// The plan of the pair formulas' lowering above N* (design section 6.4), made without a device:
// one cell sort per radius, a chunk kernel and a gather per stage, their buffers and the cap on a
// step's work. build.js makes it real on a device; the caller's node kernel adds each stage's
// totals at the stage's place (section()).
//
//   const pairs = planPairs({ D, n, limits, stages, columns, sums, slot, pos, origin });
//   pairs.refusal    // null, or why this device cannot run it (with the numbers)
//   pairs.kernels    // WGSL by kernel name; pairs.bindings: binding types by kernel name
//   pairs.section(name).code({ force, local })   // WGSL for the node kernel
//
// A stage is {stage (from program()), radius, gate, params, builtIns, outputs}: slot indices of
// its radius and gate (undefined when ungated), maps of its params and built in values to slot
// indices, and the colRefs the gather writes its totals to: `force` (D numbers per body) and one
// per accumulator (pairOutputs() lists them). Stages whose radius is the same number share a
// sort. colRefs are {buffer, at(row, k)} as in the pyramid.
import { createPrinter } from '../wgsl/print.js';
import { pairAccumulators, pairReads } from './formula.js';
import { sortKernels, stageKernels, pairLayout, ARGS, CHUNK } from './wgsl.js';

// Pair tests a step may make: past it the step runs no pair work and the runner halts, naming the
// stage and the count. An M4 Max makes 43 to 260 billion tests a second (the fewer pass the
// radius, the faster), so the cap is at most 6 ms a step there, and a first submit of 64 steps
// at the cap 0.4 s, far from the 2-second watchdog. It is also 2.7e8 pair tests: the CPU's own
// step would take seconds
export const PAIR_WORK_CAP = 1 << 28;
// Above N*, in 5 dimensions and more, pair formulas run as exact pairs up to this many bodies
// (the scheduler's all-pairs loop, with pairCandidate())
export const MAX_PAIRS = 16384;

/**
 * The totals a pair stage's gather writes per body: [{name, width}], `force` first. The caller
 * keeps room for them (hidden columns) and passes their colRefs as the stage's `outputs`.
 */
export function pairOutputs(stage, D, columns) {
  return [{ name: 'force', width: D }].concat(pairAccumulators(stage, D, columns).map(a => ({ name: a.column, width: a.width })));
}

/**
 * See the top of this file. `columns`: name -> {width, hidden, ref} (program().columns.nodes with
 * the device's colRef of every column a formula may read); `sums`: name -> {width, at(k)} and
 * `sumBuffer` (the buffer they live in); `slot`: {decl(binding), at(index)}; `origin(k)`: slot
 * index of the origin's k-th number; `cap`: pair tests per step (PAIR_WORK_CAP).
 */
export function planPairs({ D, n, limits, stages, columns, sums = {}, sumBuffer = 'S', slot, pos, origin, cap = PAIR_WORK_CAP, warn }) {
  const refuse = reason => ({ refusal: reason, kernels: {}, bindings: {}, buffers: {}, sorts: [], stages: [] });
  if (D >= 5) {
    if (n <= MAX_PAIRS) return refuse(`the cell sort runs in 2 to 4 dimensions; ${D}D pair formulas run in the all-pairs loop`);
    return refuse(`pair formulas in ${D}D run as exact pairs up to ${MAX_PAIRS.toLocaleString('en-US')} bodies; this layout has ` +
      `${n.toLocaleString('en-US')} (more needs a tree search)`);
  }
  const printer = createPrinter(warn);

  // Sorts: one per radius; radii that are the same number share one
  const sorts = [];
  stages.forEach(entry => {
    const radius = entry.stage.args.radius;
    const key = radius && radius.kind === 'number' ? 'number:' + radius.value : 'stage:' + entry.stage.name;
    let sort = sorts.find(s => s.key === key);
    if (!sort) {
      sort = { key, index: sorts.length, radius: entry.radius, stages: [] };
      sorts.push(sort);
    }
    sort.stages.push(entry);
  });

  // The snapshot of each sort: the columns its formulas read, at either end
  const reads = new Set();
  for (const sort of sorts) {
    const snapshot = [];
    let word = D;
    for (const entry of sort.stages) {
      for (const column of pairReads(entry.stage)) {
        if (snapshot.some(c => c.column === column)) continue;
        const info = columns[column];
        if (!info || !info.ref) return refuse(`${entry.stage.name}: WebGPU has no column ${column}`);
        const width = info.width === 'D' ? D : info.width;
        if (width !== 1 && width !== D) return refuse(`${entry.stage.name}: WebGPU reads columns of 1 or D numbers per body; ${column} has ${width}`);
        snapshot.push({ column, width, word, ref: info.ref });
        word += width;
        reads.add(column);
      }
    }
    sort.snapshot = snapshot;
    sort.layout = pairLayout(D, snapshot);
  }

  // Sizes: the hashed table has 2n buckets or more (a multiple of 1,024), and a step's chunks are
  // capped by the work cap, by what n bodies can need at most, and by the device's buffers
  const size = Math.max(1024, 2 ** Math.ceil(Math.log2(2 * Math.max(1, n))));
  const largest = Math.min(limits.maxStorageBufferBindingSize, limits.maxBufferSize);
  const sizeOf = bytes => Math.max(16, Math.ceil(bytes / 16) * 16);
  let partialWords = D;
  stages.forEach(entry => {
    const words = D + pairAccumulators(entry.stage, D, columns).reduce((total, a) => total + a.width, 0);
    partialWords = Math.max(partialWords, words);
  });
  const capChunks = Math.max(1, Math.min(
    Math.floor(cap / CHUNK),
    n * Math.ceil(n / CHUNK),
    Math.floor(largest / (4 * partialWords)),
    Math.floor((largest / 4 - n * (1 + 1 + 1 + 4 + 3)) / 2),
  ));

  const maxGroups = limits.maxComputeWorkgroupsPerDimension;
  const kernels = {}, bindings = {}, kernelStages = {}, buffers = {};
  const add = (name, kernel, names) => {
    kernels[name] = kernel.code;
    bindings[name] = kernel.bindings;
    kernelStages[name] = names;
  };
  for (const sort of sorts) {
    const names = sort.stages.map(entry => entry.stage.name);
    const out = sortKernels({ D, layout: sort.layout, snapshot: sort.snapshot, pos, slot, radius: sort.radius, maxGroups });
    sort.kernels = {};
    sort.columns = out.ORDER.columns;
    Object.keys(out).forEach(part => {
      const name = `PAIR_${part}_${sort.index}`;
      sort.kernels[part] = name;
      add(name, out[part], names);
    });
    const s = sort.index;
    buffers['pairCount' + s] = sizeOf(size * 4);
    buffers['pairStart' + s] = sizeOf((size + 2 + size / 1024) * 4);
    buffers['pairBody' + s] = sizeOf(n * sort.layout.body * 4);
    // [bodies by atomic slot | rank chunk owners | chunk owners | home records by bucket slot |
    // each body's bucket slot (sliced steps)]
    buffers['pairList' + s] = sizeOf((n + 2 * capChunks + n * sort.layout.home + n) * 4);
    buffers['pairArgs' + s] = sizeOf(ARGS.WORDS * 4);
    buffers['pairSnap' + s] = sizeOf(n * sort.layout.snap4 * 16);
  }

  const planned = [];
  for (let k = 0; k < stages.length; k++) {
    const entry = stages[k];
    const sort = sorts.find(s => s.stages.indexOf(entry) >= 0);
    let out;
    try {
      out = stageKernels({
        D, layout: sort.layout, stage: entry.stage, snapshot: sort.snapshot, columns, slot, radius: sort.radius,
        param: name => slot.at(entry.params[name]), builtIn: name => slot.at(entry.builtIns[name]),
        sums: { width: name => (sums[name] ? sums[name].width : 0), at: (name, i) => sums[name].at(i), buffer: sumBuffer },
        origin: i => slot.at(origin(i)), outputs: entry.outputs, printer,
      });
    } catch (e) {
      return refuse(`${entry.stage.name}: ${e.message}`);
    }
    const names = [entry.stage.name];
    add(`PAIR_EVAL_${k}`, out.EVAL, names);
    add(`PAIR_GATHER_${k}`, out.GATHER, names);
    add(`PAIR_EVAL_S_${k}`, out.EVAL_S, names);
    add(`PAIR_GATHER_S_${k}`, out.GATHER_S, names);
    buffers['pairPartial' + k] = sizeOf(capChunks * out.partialWords * 4);
    planned.push({
      name: entry.stage.name, index: k, sort: sort.index, gate: entry.gate, radius: sort.radius,
      accumulators: out.accumulators, partialWords: out.partialWords, outputs: entry.outputs,
      kernels: { EVAL: `PAIR_EVAL_${k}`, GATHER: `PAIR_GATHER_${k}`, EVAL_S: `PAIR_EVAL_S_${k}`, GATHER_S: `PAIR_GATHER_S_${k}` },
      gatherColumns: out.GATHER.columns,
      sumBuffer: entry.stage.sums.length ? sumBuffer : null,
      params: entry.params, builtIns: entry.builtIns,
    });
  }
  buffers.pairStatus = sizeOf((4 + sorts.length) * 4);

  const over = Object.keys(buffers).filter(name => buffers[name] > largest);
  if (over.length) {
    const name = over.sort((a, b) => buffers[b] - buffers[a])[0];
    return refuse(`the pair formulas at ${n.toLocaleString('en-US')} bodies need ${megabytes(buffers[name])} for ${name}; this device allows ${megabytes(largest)} per buffer`);
  }

  return {
    refusal: null, D, n, size, blocks: size / 1024, capChunks, cap: capChunks * CHUNK,
    sorts, stages: planned, kernels, bindings, kernelStages, buffers,
    reads: Array.from(reads),
    // per sort: bin, 2 scans, place, rank args, rank, order, args; per stage: chunks and gather
    // (a sliced step adds per slice: rank owners, rank, chunk owners, and per stage chunks and
    // gather, each slice in a submit of its own)
    dispatches: 8 * sorts.length + 2 * stages.length,
    section: name => section(planned.find(s => s.name === name), D, slot),
  };
}

/**
 * The status the guard writes (u32 words, build.js reads them back) as a message for the runner,
 * or null when every step ran its pair work.
 */
export function statusMessage(plan, words) {
  if (!words || words[0] === 0) return null;
  const code = words[0];
  const sort = plan.sorts[words[1]];
  const names = sort ? sort.stages.map(entry => entry.stage.name).join(', ') : 'a pair stage';
  const cap = words[3] * CHUNK;
  const needs = words[2] === 0xffffffff ? `more than ${count(cap)}` : `about ${count(words[2] * CHUNK)}`;
  const what = code === 2 || code === 4 ? 'tests to order its crowded cells' : 'pair tests';
  // codes 3 and 4: a sliced step that needed more slices than the last measurement predicted
  const limit = code >= 3
    ? `more than the ${count(cap)} planned for it from the last measurement (in slices that each stay far from the GPU watchdog)`
    : `more than the ${count(cap)} the GPU runs in one submit, so that it stays far from the GPU watchdog`;
  return `the pair formula ${names} needed ${needs} ${what} in one step, ${limit}. Bodies crowd into a few cells, or the ` +
    "radius is large for the layout: start the stage later (when: 'step > 40') or lower its radius";
}

// The node kernel's part of a stage: at the stage's place, `x += v` columns start from their value
// at the stage's start (or from 0 with startAtZero), and the force and every accumulator get the
// totals the gather wrote. On steps where the stage is gated off nothing changes; where its radius
// is not positive, it only zeroes, as on the CPU.
function section(stage, D, slot) {
  return {
    stage,
    code({ force, local, row = 'row' }) {
      const totals = [];
      for (let k = 0; k < D; k++) totals.push(`${force[k]} += ${stage.outputs.force.at(row, k)};`);
      const zero = [];
      stage.accumulators.forEach(a => {
        for (let k = 0; k < a.width; k++) {
          if (a.startAtZero) zero.push(`${local(a.column, k)} = 0.0;`);
          totals.push(`${local(a.column, k)} += ${stage.outputs[a.column].at(row, k)};`);
        }
      });
      const body = zero.concat([`if (${slot.at(stage.radius)} > 0.0) { ${totals.join(' ')} }`]);
      if (stage.gate === undefined) return body;
      return [`if (${slot.at(stage.gate)} != 0.0) {`].concat(body.map(line => '  ' + line), ['}']);
    },
  };
}

function count(value) {
  return value >= 1e6 ? value.toExponential(1).replace('e+', 'e') : value.toLocaleString('en-US');
}

function megabytes(bytes) {
  return (bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0) + ' MiB';
}
