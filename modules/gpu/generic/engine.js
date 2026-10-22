// The device side of a generic plan (plan.js, emit.js): buffers from the store, the pipelines, a
// ring of per-step slots, and the encoding of steps. Rows keep the store's order; positions are
// f32 relative to an f64 origin near the middle of the drawing, and swap between X and Y every
// step.
import { getPipeline } from '../device.js';
import { kernelCode, BINDINGS } from './emit.js';
import { THREADS } from './plan.js';
import { slotFiller } from './values.js';
import { chooseOrigin, relativePositions as relative, writePositionsBack } from '../buffers.js';

// More rows written by the host than this go up whole
const MAX_ROW_WRITES = 4096;
// Integers above this are not exact in f32
const F32_INTEGER = 16777216;

/**
 * Builds a generic plan's buffers and pipelines from the store of `simulator`. Resolves to the
 * engine the runner drives (see runner.js), or rejects naming the kernel that failed.
 */
export async function createGenericEngine(device, { simulator, plan, fireState, warn }) {
  const store = simulator.store, springs = simulator.springStore;
  const D = plan.D, n = store.n, cap = plan.cap;
  const code = kernelCode(plan);
  const names = Object.keys(code);
  const pipelines = await Promise.all(names.map(name => getPipeline(device, { code: code[name], label: name, bindings: BINDINGS })));
  const pipelineOf = {};
  names.forEach((name, k) => { pipelineOf[name] = pipelines[k]; });

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
  const csr = csrOf(springs, n);
  const L = buffer(csr.byteLength, SB | CD, 'L');
  device.queue.writeBuffer(L, 0, csr);
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
  if (integerProblem) throw new Error(`the column ${integerProblem} holds integers above 2^24, which 32-bit floats cannot hold exactly`);
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
  let ring = null, ringSlots = 0;
  const groupsFor = [null, null];
  function growRing(count) {
    if (ring) ring.destroy();
    ringSlots = Math.max(64, count);
    ring = device.createBuffer({ size: ringSlots * plan.slot.bytes, usage: GPUBufferUsage.UNIFORM | CD, label: 'V' });
    for (let p = 0; p < 2; p++) {
      groupsFor[p] = device.createBindGroup({
        layout: pipelines[0].getBindGroupLayout(0),
        entries: [params, { buffer: ring, size: plan.slot.bytes }, S, H, L, positions[p], positions[1 - p]]
          .map((resource, binding) => ({ binding, resource: resource.buffer ? resource : { buffer: resource } })),
      });
    }
  }
  growRing(64);
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    if (ring) ring.destroy();
    throw new Error('could not create the GPU buffers: ' + setupError.message);
  }

  let parity = 0;   // positions of the next step are read from positions[parity]
  // What the module last put on the device or into the store, to find rows the host wrote
  let devicePositions = startPositions;
  let deviceVelocities = Float64Array.from(store.velocity.subarray(0, n * D));
  let uploaded = versions();
  const bodies = simulator.bodies.slice();
  const kernels = plan.kernelList.map(kernel => ({ kernel, pipeline: pipelineOf[kernel.name], groups: workgroups(kernel), gates: kernelGates(kernel) }));
  let lastSlot = null;

  // The gates of a kernel whose every part is gated (it is left out on steps where none holds),
  // or null
  function kernelGates(kernel) {
    if (kernel.kind === 'reduce') return kernel.gates.every(g => g !== undefined) ? kernel.gates : null;
    if (kernel.kind !== 'node') return null;
    const gates = [];
    for (const section of kernel.sections) {
      if (section.kind === 'pairs') {
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
    prepare(hostOwns) {
      const now = versions();
      if (hostOwns) {
        devicePositions = relative(store.pos, n, D, origin);
        device.queue.writeBuffer(positions[parity], 0, devicePositions);
        uploadColumn('velocity');
        uploadColumns(name => name !== 'velocity' && plan.columns[name].buffer !== 'X');
        deviceVelocities = Float64Array.from(store.velocity.subarray(0, n * D));
      } else {
        if (now.pos !== uploaded.pos) uploadPositionRows(positionRows());
        if (now.velocity !== uploaded.velocity) uploadVelocityRows(velocityRows());
        uploadColumns(name => name !== 'velocity' && plan.columns[name].buffer !== 'X' && now.columns[name] !== uploaded.columns[name]);
      }
      uploaded = now;
      return integerProblem ? { halt: integerProblem } : 'ok';
    },

    /**
     * Encodes `count` steps from simulator step `firstStep`. Returns {ran, halt?}: fewer steps
     * run when a step's numbers do not fit f32 (that step halts the runner).
     */
    run(count, firstStep, { timestampWrites = null, beforeFinish = null, perSubmit = 64 } = {}) {
      const filled = slots.fill(count, firstStep);
      const ran = filled.count;
      if (ran === 0) return { ran, halt: filled.halt };
      const floats = plan.slot.floats;
      if (filled.perStep && ran > ringSlots) growRing(ran);
      // without numbers that change within the call, one slot serves every step, written only
      // when it changed
      const same = !filled.perStep && sameSlot(filled.data, lastSlot, floats);
      if (!filled.perStep && !same) {
        lastSlot = filled.data.slice(0, floats);
        device.queue.writeBuffer(ring, 0, lastSlot);
      }
      if (filled.perStep) lastSlot = null;
      for (let done = 0; done < ran;) {
        const c = Math.min(perSubmit, ran - done);
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
          for (const { pipeline, groups: g, gates } of kernels) {
            // a kernel of gated stages only, none of which runs this step
            if (gates && gates.every(index => values[index] === 0)) continue;
            cp.setPipeline(pipeline);
            cp.setBindGroup(0, groupsFor[parity], offset);
            cp.dispatchWorkgroups(g);
          }
          parity ^= 1;
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
     * Positions read from the device (f32, relative) into the store as f64. Rows the host wrote
     * since the last upload keep its numbers. Returns the CPU's measure of movement per step.
     */
    readPositions(data, steps) {
      const keep = store.versions.pos !== uploaded.pos ? positionRows() : [];
      const saved = keep.map(i => Array.from(store.pos.subarray(i * D, i * D + D)));
      const move = writePositionsBack(simulator, bodies, data, D, origin, steps);
      keep.forEach((i, j) => { for (let k = 0; k < D; k++) store.pos[i * D + k] = saved[j][k]; });
      devicePositions = Float32Array.from(data);
      return move;
    },

    /**
     * Reads the device's state after every submitted step: positions, velocities, the columns
     * stages write, the sums and FIRE's state. Resolves to {positions, apply()}: apply() writes
     * all but the positions into the store and the sums.
     */
    async readDevice() {
      const stageColumns = Object.values(plan.columns).filter(c => c.buffer === 'S');
      const posBytes = n * D * 4;
      const read = device.createBuffer({ size: Math.max(16, posBytes + plan.S.size * 4), usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      const enc = device.createCommandEncoder();
      enc.copyBufferToBuffer(positions[parity], 0, read, 0, posBytes);
      enc.copyBufferToBuffer(S, 0, read, posBytes, plan.S.size * 4);
      device.queue.submit([enc.finish()]);
      try {
        await read.mapAsync(GPUMapMode.READ);
      } catch (e) {
        read.destroy();
        return null;
      }
      const positionsRead = new Float32Array(read.getMappedRange(0, posBytes)).slice();
      const s = new Float32Array(read.getMappedRange(posBytes, plan.S.size * 4)).slice();
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
          const sumResults = simulator.sums();
          Object.values(plan.sums).forEach(sum => {
            const result = sumResults[sum.name];
            if (result && result.value) for (let k = 0; k < sum.width; k++) result.value[k] = s[sum.offset + k];
          });
        },
      };
    },

    destroy() {
      owned.forEach(b => b.destroy());
      if (ring) ring.destroy();
    },
  };

  function versions() {
    const out = { pos: store.versions.pos, velocity: store.versions.velocity, columns: Object.create(null) };
    Object.keys(plan.columns).forEach(name => { out.columns[name] = store.versions[name]; });
    return out;
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

  function positionRows() {
    const pos = store.pos, rows = [];
    for (let i = 0; i < n; i++) {
      for (let k = 0; k < D; k++) {
        if (Math.fround(pos[i * D + k] - origin[k]) !== devicePositions[i * D + k]) { rows.push(i); break; }
      }
    }
    return rows;
  }

  function velocityRows() {
    const v = store.velocity, rows = [];
    for (let i = 0; i < n * D; i++) if (v[i] !== deviceVelocities[i] && rows[rows.length - 1] !== Math.floor(i / D)) rows.push(Math.floor(i / D));
    return rows;
  }

  function uploadPositionRows(rows) {
    if (rows.length > MAX_ROW_WRITES) {
      devicePositions = relative(store.pos, n, D, origin);
      device.queue.writeBuffer(positions[parity], 0, devicePositions);
      return;
    }
    const one = new Float32Array(D);
    rows.forEach(i => {
      for (let k = 0; k < D; k++) one[k] = devicePositions[i * D + k] = store.pos[i * D + k] - origin[k];
      device.queue.writeBuffer(positions[parity], i * D * 4, one);
    });
  }

  function uploadVelocityRows(rows) {
    const column = plan.columns.velocity;
    if (rows.length > MAX_ROW_WRITES) uploadColumn('velocity');
    else {
      const one = new Float32Array(D);
      rows.forEach(i => {
        for (let k = 0; k < D; k++) one[k] = store.velocity[i * D + k];
        device.queue.writeBuffer(S, (column.offset + i * D) * 4, one);
      });
    }
    deviceVelocities = Float64Array.from(store.velocity.subarray(0, n * D));
  }
}

// Springs as rows of neighbours: [first link of each row (n + 1) | the other end of each link]
function sameSlot(data, last, floats) {
  if (!last) return false;
  for (let k = 0; k < floats; k++) if (!Object.is(data[k], last[k])) return false;
  return true;
}

function csrOf(springs, n) {
  const from = springs.from, to = springs.to, m = springs.n;
  const degree = new Uint32Array(n);
  let count = 0;
  for (let s = 0; s < m; s++) if (from[s] !== to[s]) { degree[from[s]]++; degree[to[s]]++; count += 2; }
  const csr = new Uint32Array(n + 1 + count);
  for (let i = 0; i < n; i++) csr[i + 1] = csr[i] + degree[i];
  const fill = csr.slice(0, n);
  for (let s = 0; s < m; s++) {
    const a = from[s], b = to[s];
    if (a === b) continue;
    csr[n + 1 + fill[a]++] = b;
    csr[n + 1 + fill[b]++] = a;
  }
  return csr;
}
