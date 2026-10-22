// The device side of a generic plan (plan.js, emit.js): buffers from the store, the pipelines, a
// ring of per-step slots, the pyramid when the plan has one, and the encoding of steps. Rows keep
// the store's order; positions are f32 relative to an f64 origin near the middle of the drawing,
// and swap between X and Y every step.
import { getPipeline } from '../device.js';
import { kernelCode, bindingsOf } from './emit.js';
import { THREADS, GROUP_RUN, LINK_CHUNK } from './plan.js';
import { buildPyramid, pyramidStatus } from '../pyramid/build.js';
import { buildPairs } from '../pairs/build.js';
import { slotFiller } from './values.js';
import { chooseOrigin, relativePositions as relative, writePositionsBack, rowsMoved } from '../buffers.js';
import { createRowWriter, trackHostPositions } from '../rows.js';

// Integers above this are not exact in f32
const F32_INTEGER = 16777216;
// Slots of the ring when numbers change from step to step: a submit holds at most this many steps
const RING_SLOTS = 1024;

/**
 * Builds a generic plan's buffers and pipelines from the store of `simulator`. Resolves to the
 * engine the runner drives (see runner.js), or rejects naming the kernel that failed.
 */
export async function createGenericEngine(device, { simulator, plan, fireState, warn }) {
  const store = simulator.store, springs = simulator.springStore;
  const D = plan.D, n = store.n, cap = plan.cap;
  const code = kernelCode(plan);
  const pipelineOf = {};
  const dispatched = plan.kernelList.filter(kernel => kernel.kind !== 'host');
  const [writeRows] = await Promise.all([createRowWriter(device)].concat(dispatched.map(kernel =>
    getPipeline(device, { code: code[kernel.name], label: kernel.name, bindings: bindingsOf(kernel) })
      .then(pipeline => { pipelineOf[kernel.name] = pipeline; }))));

  // --- data from the store ------------------------------------------------------------------------
  const origin = chooseOrigin(store.pos, n, D);
  const SB = GPUBufferUsage.STORAGE, CD = GPUBufferUsage.COPY_DST, CS = GPUBufferUsage.COPY_SRC;
  const owned = [];
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  const buffer = (bytes, usage, label) => {
    const b = device.createBuffer({ size: Math.max(16, Math.ceil(bytes / 16) * 16), usage, label });
    owned.push(b);
    return b;
  };
  const params = buffer(16, GPUBufferUsage.UNIFORM | CD, 'P');
  const S = buffer(plan.S.size * 4, SB | CD | CS, 'S');
  const H = buffer(plan.H.size * 4, SB | CD, 'H');
  const positions = [buffer(cap * D * 4, SB | CD | CS, 'X'), buffer(cap * D * 4, SB | CD | CS, 'Y')];
  const links = linkTable(springs, n);
  const groupData = plan.groupColumns.map(name => groupBlock(store[name], n));
  const groupProblem = plan.groupColumns.find((name, k) => groupData[k].count !== countOf(plan, name));
  if (groupProblem) throw new Error(`the groups of ${groupProblem} changed while the plan was made`);
  const chunkData = plan.chunked ? chunkBlock(links, n) : null;
  const lWords = linkWords(links, chunkData, groupData, n, springs.n);
  const L = buffer(lWords.byteLength, SB | CD, 'L');
  device.queue.writeBuffer(L, 0, lWords);
  const groups = Math.max(1, Math.ceil(n / THREADS));
  device.queue.writeBuffer(params, 0, new Uint32Array([n, groups, Math.min(THREADS, groups), springs.n]));

  // Every column at its place; S also gets the sums' last results and FIRE's state
  const sData = new Float32Array(plan.S.size), hData = new Float32Array(plan.H.size);
  let integerProblem = null;
  Object.values(plan.columns).forEach(column => {
    if (column.buffer === 'X') return;
    const target = column.buffer === 'S' ? sData : hData;
    const source = store[column.name];
    const count = n * column.width;
    for (let k = 0; k < count; k++) target[column.offset + k] = source[k];
    if (column.type !== 'f64' && column.type !== 'f32') {
      for (let k = 0; k < count; k++) if (Math.abs(source[k]) > F32_INTEGER) { integerProblem = column.name; break; }
    }
  });
  Object.values(plan.linkColumns).forEach(column => {
    const problem = writeLinkColumn(column, springs[column.name], column.order === 'csr' ? hData : sData, links);
    if (problem) integerProblem = column.name;
  });
  if (integerProblem) throw new Error(`the column ${integerProblem} holds integers above 2^24, which 32-bit floats cannot hold exactly`);
  plan.tables.forEach(table => hData.set(table.values, table.offset));
  const results = simulator.sums();
  Object.values(plan.sums).forEach(sum => {
    const result = results[sum.name];
    if (result && result.value) for (let k = 0; k < sum.width; k++) sData[sum.offset + k] = result.value[k];
  });
  sData.set(fireState || [0.1, 0, 0, 0], plan.S.fire);
  device.queue.writeBuffer(S, 0, sData);
  device.queue.writeBuffer(H, 0, hData);
  const startPositions = relative(store.pos, n, D, origin);
  device.queue.writeBuffer(positions[0], 0, startPositions);

  // The ring of per-step slots, read at a dynamic offset
  const slots = slotFiller(simulator, plan, warn, origin);
  const ringSlots = slots.perStep ? RING_SLOTS : 1;
  const ring = buffer(ringSlots * plan.slot.bytes, GPUBufferUsage.UNIFORM | CD, 'V');
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the GPU buffers: ' + setupError.message);
  }
  // The pyramid reads positions (X or Y, by the step's parity), charge columns and the slot
  let tree = null;
  if (plan.pyramid) {
    try {
      tree = await buildPyramid(device, plan.pyramid, { buffers: { X: positions, S, H }, step: { buffer: ring, size: plan.slot.bytes, dynamic: true } });
    } catch (e) {
      owned.forEach(b => b.destroy());
      throw e;
    }
    tree.setValues({ gravity: 0 }, null);
  }
  // Structures with status words on the device (work caps passed, ...): {buffer, offset, size,
  // message(words), stages}
  // The pair track's sorts and gathers, above N*
  let pairs = null;
  if (plan.pairs) {
    try {
      pairs = await buildPairs(device, plan.pairs, { buffers: { X: positions, S, H }, step: { buffer: ring, size: plan.slot.bytes } });
    } catch (e) {
      owned.forEach(b => b.destroy());
      if (tree) tree.destroy();
      throw e;
    }
  }
  const statuses = [];
  if (pairs) statuses.push({ buffer: pairs.status.buffer, offset: 0, size: pairs.status.bytes, message: words => pairs.statusMessage(words), stages: plan.pairs.stages.map(s => s.name) });
  if (tree && tree.status) {
    statuses.push(Object.assign({ message: pyramidStatus, stages: plan.pyramid.channels.map(c => c.stage) }, tree.status));
  }
  // Bind groups per layout and parity
  const bindGroups = kernel => [0, 1].map(p => device.createBindGroup({
    layout: pipelineOf[kernel.name].getBindGroupLayout(0),
    entries: [params, { buffer: ring, size: plan.slot.bytes }, S, H, L, positions[p], positions[1 - p]]
      .concat(kernel.tree ? [tree.buffers.TP, tree.buffers.treeSp, tree.buffers.treeMeta, tree.buffers.treeCells] : [])
      .map((resource, binding) => ({ binding, resource: resource.buffer ? resource : { buffer: resource } })),
  }));

  let parity = 0;   // positions of the next step are read from positions[parity]
  // What the module last put on the device or into the store, to find rows the host wrote
  const host = trackHostPositions(store, n, D, origin, startPositions);
  let deviceVelocities = Float64Array.from(store.velocity.subarray(0, n * D));
  let uploaded = versions();
  const bodies = simulator.bodies.slice();
  const kernels = dispatched.map(kernel => ({
    kernel, pipeline: pipelineOf[kernel.name], bind: bindGroups(kernel), groups: workgroups(kernel), gates: kernelGates(kernel),
  }));
  // the kernels between host steps: a step where a host step runs is encoded a part at a time
  const segments = [[]];
  plan.kernelList.forEach(kernel => {
    if (kernel.kind === 'host') segments.push([]);
    else segments[segments.length - 1].push(kernels.find(k => k.kernel === kernel));
  });
  let lastSlot = null;

  // The gates of a kernel whose every part is gated (it is left out on steps where none holds),
  // or null
  function kernelGates(kernel) {
    if (kernel.kind === 'reduce' || kernel.kind === 'groupRuns' || kernel.kind === 'groupSum' || kernel.kind === 'chunks') return kernel.gates.every(g => g !== undefined) ? kernel.gates : null;
    if (kernel.kind !== 'node' && kernel.kind !== 'link') return null;
    const gates = [];
    for (const section of kernel.sections) {
      if (section.kind === 'pairs' || section.kind === 'tree') {
        if (section.channels.some(c => c.gate === undefined)) return null;
        section.channels.forEach(c => gates.push(c.gate));
      } else if (section.gate === undefined) return null;
      else gates.push(section.gate);
    }
    return gates.length ? gates : null;
  }

  function workgroups(kernel) {
    if (kernel.kind === 'reduce' || kernel.kind === 'fireState') return 1;
    if (kernel.kind === 'fireReduce') return Math.min(THREADS, groups);
    if (kernel.kind === 'link') return Math.max(1, Math.ceil(springs.n / THREADS));
    if (kernel.kind === 'chunks') return Math.max(1, Math.ceil(chunkData.chunks / THREADS));
    const block = kernel.column !== undefined ? groupData[plan.groupColumns.indexOf(kernel.column)] : null;
    if (kernel.kind === 'groupRuns') return Math.max(1, Math.ceil(block.runs / THREADS));
    if (kernel.kind === 'groupSum') return Math.max(1, Math.ceil(block.count / THREADS));
    return groups;
  }

  return {
    kind: plan.regime,
    n,
    D,
    get fence() { return positions.slice(); },
    positionBytes: n * D * 4,
    kernelStages: plan.kernelStages,

    /**
     * What changed on the host goes up: everything after sync() (`hostOwns`), else the rows
     * the host wrote and the columns it marked. 'sync' when a sync point is needed instead.
     */
    prepare(hostOwns, steps) {
      const now = versions();
      // new group ids: the runs and counts are made again with the plan
      if (plan.groupColumns.some(name => now.groups[name] !== uploaded.groups[name])) return 'sync';
      if (hostOwns) {
        const relativePositions = relative(store.pos, n, D, origin);
        host.reset(relativePositions);
        device.queue.writeBuffer(positions[parity], 0, relativePositions);
        uploadColumn('velocity');
        uploadColumns(name => name !== 'velocity' && plan.columns[name].buffer !== 'X');
        deviceVelocities = Float64Array.from(store.velocity.subarray(0, n * D));
      } else {
        if (now.pos !== uploaded.pos) {
          const rows = host.written();
          writeRows(positions[parity], 0, D, rows, host.uploaded(rows, steps));
        }
        if (now.velocity !== uploaded.velocity) uploadVelocityRows(velocityRows());
        uploadColumns(name => name !== 'velocity' && plan.columns[name].buffer !== 'X' && now.columns[name] !== uploaded.columns[name]);
      }
      Object.keys(plan.linkColumns).forEach(name => { if (hostOwns || now.links[name] !== uploaded.links[name]) uploadLinkColumn(name); });
      uploaded = now;
      return integerProblem ? { halt: integerProblem } : 'ok';
    },

    // parts of a step between host steps (see run()'s `segment`)
    segments: segments.length,

    // The status words of the structures that have them, for every readback: copyStatus() puts
    // them at `offset` of a readback, statusMessage() says why to halt, or null
    statusBytes: statuses.reduce((total, status) => total + status.size, 0),
    copyStatus(enc, dst, offset) {
      let at = offset;
      statuses.forEach(status => { enc.copyBufferToBuffer(status.buffer, status.offset, dst, at, status.size); at += status.size; });
    },
    statusMessage(words) {
      let at = 0;
      for (const status of statuses) {
        const message = status.message(words.subarray(at, at + status.size / 4));
        if (message) return { message, stages: status.stages };
        at += status.size / 4;
      }
      return null;
    },

    /**
     * Encodes `count` steps from simulator step `firstStep`. Returns {ran, halt?}: fewer steps
     * run when a step's numbers do not fit f32 (that step halts the runner). With `segment`, one
     * step's kernels between two host steps only (the numbers are read for it at this moment):
     * the step ends with its last part.
     */
    run(count, firstStep, { timestampWrites = null, beforeFinish = null, perSubmit = 64, segment } = {}) {
      const list = segment === undefined ? kernels : segments[segment];
      const ends = segment === undefined || segment === segments.length - 1;
      const filled = slots.fill(count, firstStep);
      const ran = filled.count;
      if (ran === 0) return { ran, halt: filled.halt };
      const floats = plan.slot.floats;
      // without numbers that change within the call, one slot serves every step, written only
      // when it changed
      const same = !filled.perStep && sameSlot(filled.data, lastSlot, floats);
      if (!filled.perStep && !same) {
        lastSlot = filled.data.slice(0, floats);
        device.queue.writeBuffer(ring, 0, lastSlot);
      }
      if (filled.perStep) lastSlot = null;
      for (let done = 0; done < ran;) {
        const c = Math.min(perSubmit, ran - done, filled.perStep ? ringSlots : Infinity);
        if (filled.perStep) device.queue.writeBuffer(ring, 0, filled.data, done * floats, c * floats);
        const enc = device.createCommandEncoder();
        const first = done === 0, last = done + c === ran;
        let tw;
        if (timestampWrites && (first || last)) {
          tw = { querySet: timestampWrites.querySet };
          if (first) tw.beginningOfPassWriteIndex = 0;
          if (last) tw.endOfPassWriteIndex = 1;
        }
        const cp = enc.beginComputePass(tw ? { timestampWrites: tw } : undefined);
        for (let s = 0; s < c; s++) {
          const slot = filled.perStep ? s : 0;
          const offset = [slot * plan.slot.bytes];
          const values = filled.data.subarray((filled.perStep ? done + s : 0) * floats);
          for (const { kernel, pipeline, bind, groups: g, gates } of list) {
            // a kernel of gated stages only, none of which runs this step
            if (gates && gates.every(index => values[index] === 0)) continue;
            // the pyramid's structure, from this step's positions; it also orders the threads of
            // its kernel, so it is built even on steps where its passes are gated off
            if (kernel.tree) tree.encode(cp, { stepOffset: offset[0], parity });
            // the pair formulas' sort, chunks and gathers, from this step's positions and numbers
            if (kernel.pairStages) pairs.encode(cp, { stepOffset: offset[0], parity, values, stages: kernel.pairStages });
            cp.setPipeline(pipeline);
            cp.setBindGroup(0, bind[parity], offset);
            cp.dispatchWorkgroups(g);
          }
          if (ends) parity ^= 1;
        }
        cp.end();
        if (last && beforeFinish) beforeFinish(enc);
        device.queue.submit([enc.finish()]);
        done += c;
      }
      return { ran, halt: filled.halt };
    },

    // positions after every step encoded so far
    copyPositions(enc, dst, offset) {
      enc.copyBufferToBuffer(positions[parity], 0, dst, offset, n * D * 4);
      return true;
    },

    /**
     * Positions read from the device (f32, relative) after `through` steps (`steps` of them since
     * the last readback) into the store as f64; rows the host wrote keep its numbers (see
     * rows.js). Returns the CPU's measure of movement per step, or null when graph edits moved
     * the rows since.
     */
    readPositions(data, steps, inStoreOrder, through) {
      const write = () => writePositionsBack(simulator, bodies, data, D, origin, steps);
      if (rowsMoved(simulator, bodies)) return write();
      return host.readBack(through, store.versions.pos !== uploaded.pos, () => {
        const move = write();
        host.mirror.set(data.subarray(0, n * D));
        return move;
      });
    },

    /**
     * Reads the device's state after every submitted step: positions, velocities, the columns
     * stages write, the sums and FIRE's state. Resolves to {positions, apply()}: apply() writes
     * all but the positions into the store and the sums.
     */
    async readDevice() {
      const stageColumns = Object.values(plan.columns).filter(c => c.buffer === 'S');
      // getMappedRange() takes offsets that are multiples of 8
      const posBytes = n * D * 4, sAt = Math.ceil(posBytes / 8) * 8;
      const read = device.createBuffer({ size: Math.max(16, sAt + plan.S.size * 4), usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      const enc = device.createCommandEncoder();
      enc.copyBufferToBuffer(positions[parity], 0, read, 0, posBytes);
      enc.copyBufferToBuffer(S, 0, read, sAt, plan.S.size * 4);
      device.queue.submit([enc.finish()]);
      try {
        await read.mapAsync(GPUMapMode.READ);
      } catch (e) {
        read.destroy();
        return null;
      }
      const positionsRead = new Float32Array(read.getMappedRange(0, posBytes)).slice();
      const s = new Float32Array(read.getMappedRange(sAt, plan.S.size * 4)).slice();
      read.unmap();
      read.destroy();
      return {
        positions: positionsRead,
        fireState: Array.from(s.subarray(plan.S.fire, plan.S.fire + 4)),
        apply() {
          const keep = store.versions.velocity !== uploaded.velocity ? velocityRows() : [];
          const saved = keep.map(i => Array.from(store.velocity.subarray(i * D, i * D + D)));
          stageColumns.forEach(column => {
            if (column.name === 'force') return;
            const target = store[column.name];
            if (!target) return;
            const count = n * column.width;
            for (let k = 0; k < count; k++) target[k] = s[column.offset + k];
          });
          keep.forEach((i, j) => { for (let k = 0; k < D; k++) store.velocity[i * D + k] = saved[j][k]; });
          deviceVelocities = Float64Array.from(store.velocity.subarray(0, n * D));
          // link columns stages write (their versions do not move: these are the device's numbers)
          Object.values(plan.linkColumns).forEach(column => {
            const target = springs[column.name];
            if (column.order !== 'link' || !target) return;
            for (let k = 0; k < springs.n; k++) target[k] = s[column.offset + k];
          });
          const sumResults = simulator.sums();
          Object.values(plan.sums).forEach(sum => {
            const result = sumResults[sum.name];
            if (!result) return;
            if (sum.grouped) {
              const groupsOut = result.resize(sum.count);
              for (let k = 0; k < sum.count * sum.width; k++) groupsOut[k] = s[sum.offset + k];
            } else if (result.value) for (let k = 0; k < sum.width; k++) result.value[k] = s[sum.offset + k];
          });
        },
      };
    },

    // a pair formula's work cap is near: the first submits are short
    pairs: !!pairs,

    destroy() {
      owned.forEach(b => b.destroy());
      if (tree) tree.destroy();
      if (pairs) pairs.destroy();
    },
  };

  function versions() {
    const out = { pos: store.versions.pos, velocity: store.versions.velocity, columns: Object.create(null), links: Object.create(null), groups: Object.create(null) };
    Object.keys(plan.columns).forEach(name => { out.columns[name] = store.versions[name]; });
    Object.keys(plan.linkColumns).forEach(name => { out.links[name] = springs.versions[name]; });
    plan.groupColumns.forEach(name => { out.groups[name] = store.versions[name]; });
    return out;
  }

  function uploadLinkColumn(name) {
    const column = plan.linkColumns[name];
    const data = new Float32Array(column.order === 'csr' ? 2 * springs.n : springs.n);
    writeLinkColumn(Object.assign({}, column, { offset: 0 }), springs[name], data, links);
    device.queue.writeBuffer(column.order === 'csr' ? H : S, column.offset * 4, data);
  }

  function uploadColumn(name) {
    const column = plan.columns[name];
    const data = new Float32Array(n * column.width);
    const source = store[name];
    for (let k = 0; k < data.length; k++) data[k] = source[k];
    device.queue.writeBuffer(column.buffer === 'S' ? S : H, column.offset * 4, data);
  }

  function uploadColumns(which) {
    Object.keys(plan.columns).forEach(name => { if (which(name)) uploadColumn(name); });
  }

  function velocityRows() {
    const v = store.velocity, rows = [];
    for (let i = 0; i < n * D; i++) if (v[i] !== deviceVelocities[i] && rows[rows.length - 1] !== Math.floor(i / D)) rows.push(Math.floor(i / D));
    return rows;
  }

  function uploadVelocityRows(rows) {
    const values = new Float32Array(rows.length * D), v = store.velocity;
    rows.forEach((i, r) => {
      for (let k = 0; k < D; k++) values[r * D + k] = deviceVelocities[i * D + k] = v[i * D + k];
    });
    writeRows(S, plan.columns.velocity.offset, D, rows, values);
  }
}

function sameSlot(data, last, floats) {
  if (!last) return false;
  for (let k = 0; k < floats; k++) if (!Object.is(data[k], last[k])) return false;
  return true;
}

// Links as rows of entries: every link at both of its bodies (a link from a body to itself twice),
// in link order within a row, with its index and the body's role (bit 31: the to end)
function linkTable(springs, n) {
  const from = springs.from, to = springs.to, m = springs.n;
  const starts = new Uint32Array(n + 1);
  for (let s = 0; s < m; s++) { starts[from[s] + 1]++; starts[to[s] + 1]++; }
  for (let i = 0; i < n; i++) starts[i + 1] += starts[i];
  const fill = starts.slice(0, n);
  const other = new Uint32Array(2 * m), linkRole = new Uint32Array(2 * m), fromEntry = new Uint32Array(m);
  for (let s = 0; s < m; s++) {
    const a = from[s], b = to[s];
    const ea = fill[a]++;
    other[ea] = b; linkRole[ea] = s; fromEntry[s] = ea;
    const eb = fill[b]++;
    other[eb] = a; linkRole[eb] = (s | 0x80000000) >>> 0;
  }
  return { starts, other, linkRole, fromEntry, from, to, m };
}

// L: [starts | other | link and role | entry of each link's from end | from | to | where the
// chunks and each group block start | the chunks | the group blocks]
function linkWords(links, chunkData, groupData, n, m) {
  const header = n + 1 + 7 * m;
  let size = header + 1 + groupData.length + (chunkData ? chunkData.words.length : 0);
  groupData.forEach(block => { size += block.words.length; });
  const out = new Uint32Array(Math.max(4, size));
  out.set(links.starts, 0);
  out.set(links.other, n + 1);
  out.set(links.linkRole, n + 1 + 2 * m);
  out.set(links.fromEntry, n + 1 + 4 * m);
  for (let s = 0; s < m; s++) { out[n + 1 + 5 * m + s] = links.from[s]; out[n + 1 + 6 * m + s] = links.to[s]; }
  let at = header + 1 + groupData.length;
  if (chunkData) {
    out[header] = at;
    out.set(chunkData.words, at);
    at += chunkData.words.length;
  }
  groupData.forEach((block, k) => {
    out[header + 1 + k] = at;
    out.set(block.words, at);
    at += block.words.length;
  });
  return out;
}

// Chunks of up to LINK_CHUNK entries of one row, the chunks of a row in a row: [chunks, first chunk
// of each row (n + 1), row of each chunk, first entry of each chunk]
function chunkBlock(links, n) {
  const starts = links.starts;
  let chunks = 0;
  for (let i = 0; i < n; i++) chunks += Math.ceil((starts[i + 1] - starts[i]) / LINK_CHUNK);
  const words = new Uint32Array(2 + n + 2 * chunks);
  words[0] = chunks;
  let c = 0;
  for (let i = 0; i < n; i++) {
    words[1 + i] = c;
    for (let e = starts[i]; e < starts[i + 1]; e += LINK_CHUNK, c++) {
      words[2 + n + c] = i;
      words[2 + n + chunks + c] = e;
    }
  }
  words[1 + n] = c;
  return { words, chunks };
}

// A link column into its place in `target` (at column.offset): in CSR order (each link at both of
// its entries) or in link order. Returns true when it holds integers f32 cannot hold exactly.
function writeLinkColumn(column, source, target, links) {
  const m = links.m;
  let problem = false;
  const integers = column.type !== 'f64' && column.type !== 'f32';
  if (column.order === 'csr') {
    for (let e = 0; e < 2 * m; e++) target[column.offset + e] = source[links.linkRole[e] & 0x7fffffff];
  } else {
    for (let s = 0; s < m; s++) target[column.offset + s] = source[s];
  }
  if (integers) for (let s = 0; s < m; s++) if (Math.abs(source[s]) > F32_INTEGER) { problem = true; break; }
  return problem;
}

// The rows of a group column in group order (rows of a negative or missing group left out), cut
// into runs of at most GROUP_RUN rows of one group: [runs, groups, rows, the rows, the first row of
// each run (runs + 1), the first run of each group (groups + 1)]
function groupBlock(column, n) {
  const rows = [];
  for (let i = 0; i < n; i++) if (column[i] >= 0) rows.push(i);
  // by group, then by row: the order the CPU adds them up in, within a group
  rows.sort((a, b) => Math.floor(column[a]) - Math.floor(column[b]) || a - b);
  const count = rows.length ? Math.floor(column[rows[rows.length - 1]]) + 1 : 0;
  const runStarts = [], groupRuns = new Array(count + 1).fill(-1);
  let group = -1, length = 0;
  rows.forEach((row, t) => {
    const g = Math.floor(column[row]);
    if (g !== group || length === GROUP_RUN) {
      if (g !== group) { for (let q = group + 1; q <= g; q++) groupRuns[q] = runStarts.length; group = g; }
      runStarts.push(t);
      length = 0;
    }
    length++;
  });
  const runs = runStarts.length;
  runStarts.push(rows.length);
  for (let q = group + 1; q <= count; q++) groupRuns[q] = runs;
  const words = new Uint32Array(3 + rows.length + runs + 1 + count + 1);
  words[0] = runs; words[1] = count; words[2] = rows.length;
  words.set(rows, 3);
  words.set(runStarts, 3 + rows.length);
  words.set(groupRuns, 3 + rows.length + runs + 1);
  return { words, runs, count };
}

function countOf(plan, column) {
  const sum = Object.values(plan.sums).find(s => s.column === column);
  return sum ? sum.count : 0;
}
