// The grid field on a device: its buffers, pipelines and the dispatches of a step, the gather of
// the two columns included.
//
//   const grid = await buildGrid(device, plan, { buffers: { X: [a, b], S } });
//   grid.setValues(gridSlotValues(...));   // only when the grid holds its own numbers
//   grid.encode(pass, { stepOffset, parity });
//   // copy grid.status into a readback: gridStatus(words, plan, name) says when to halt, and
//   // grid.observe(words) takes the step's size; grid.observeTime(ms) the runner's GPU ms a step;
//   // grid.cappedMs() is the GPU ms of a step at its worst on this device
import { getPipeline } from '../device.js';
import { META, IND_SCAN, IND_DEPOSIT, IND_SMOOTH, IND_RESIDUAL, IND_SMOOTH_LOW, WG, STATUS_WORDS } from './wgsl.js';
import { gridCappedMs, gridRelaxedMs } from './plan.js';

// MINMAX loops over the bodies with at most this many workgroups
const MINMAX_GROUPS = 1024;
// The most times slower than an M4 Max a device is taken to be (the speed probe's bound too)
const MOST_SLOWDOWN = 100;

/**
 * Buffers, pipelines and bind groups for `plan` (planGrid()). `buffers` are the caller's, by the
 * names its colRefs use; a pair [a, b] is a buffer that alternates between steps (positions that
 * ping-pong), a at even steps and b at odd ones (encode()'s `parity`). `step`, when the caller's
 * step slot holds the grid's numbers: {buffer, size, dynamic}. `slowdown`: how many times slower
 * than an M4 Max the device is, from the speed probe (device.js), until timed steps say more
 * (observeTime()). Resolves once the pipelines are compiled; rejects naming the kernel when one
 * fails, or when the buffers cannot be created.
 */
export async function buildGrid(device, plan, { buffers: external = {}, step = null, slowdown = 1 } = {}) {
  if (plan.refusal) throw new Error(plan.refusal);
  if (!step && !plan.own) throw new Error('buildGrid: the plan reads the caller\'s step values; pass `step`');
  const stepKind = step && step.dynamic ? 'dynamic' : 'uniform';
  const names = Object.keys(plan.kernels);
  const pipes = Object.fromEntries(await Promise.all(names.map(name => {
    const kernel = plan.kernels[name];
    const bindings = kernel.bindings.map(b => (b.kind === 'step' ? stepKind : b.kind === 'uniform' ? 'uniform' : b.kind));
    return getPipeline(device, { code: kernel.code, label: name, bindings }).then(pipeline => [name, pipeline]);
  })));

  const SB = GPUBufferUsage.STORAGE, CD = GPUBufferUsage.COPY_DST, CS = GPUBufferUsage.COPY_SRC;
  const owned = [];
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  const buffer = (bytes, usage) => {
    const b = device.createBuffer({ size: bytes, usage });
    owned.push(b);
    return b;
  };
  const sizes = plan.buffers;
  const own = {
    GU: buffer(32, GPUBufferUsage.UNIFORM | CD),
    gridMeta: buffer(sizes.gridMeta, SB | CD | CS | GPUBufferUsage.INDIRECT),
    gridCount: buffer(sizes.gridCount, SB),
    gridStart: buffer(sizes.gridStart, SB | CS),
    gridKey: buffer(sizes.gridKey, SB | CS),
    gridSp: buffer(sizes.gridSp, SB | CS),
    gridChunk: buffer(sizes.gridChunk, SB | CS | GPUBufferUsage.INDIRECT),
    gridAcc: buffer(sizes.gridAcc, SB | CS),
    gridField: buffer(sizes.gridField, SB | CS),
    gridLo: sizes.gridLo ? buffer(sizes.gridLo, SB | CS) : null,
  };
  own.V = plan.own ? buffer(plan.own.floats * 4, GPUBufferUsage.UNIFORM | CD) : null;
  // the last words: `zero` (see grid_opq in wgsl.js) and padding
  device.queue.writeBuffer(own.GU, 0, new Uint32Array([plan.n, plan.maxCells, plan.capacity, plan.tableSize, 0, 0, 0, 0]));
  // An empty box, so the first MINMAX finds the bodies' one
  const meta = new Uint32Array(META.IND);
  for (let k = 0; k < plan.D; k++) meta[META.MIN + k] = 0xffffffff;
  device.queue.writeBuffer(own.gridMeta, 0, meta);
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the grid field\'s buffers: ' + setupError.message);
  }

  // Bind groups: two (by parity) for kernels that read a buffer that alternates
  // `low`: the smoothing's second pass, on the field's low word (the refinement step)
  const resource = (name, parity, low) => {
    if (name === 'V') return own.V ? { buffer: own.V } : { buffer: step.buffer, size: step.size };
    if (low && name === 'gridField') return { buffer: own.gridLo };
    const b = own[name] || external[name];
    if (!b) throw new Error('buildGrid: no buffer for ' + name);
    return { buffer: Array.isArray(b) ? b[parity] : b };
  };
  const kernels = names.map(name => {
    const { bindings } = plan.kernels[name];
    const alternates = bindings.some(b => Array.isArray(external[b.name]));
    const group = (parity, low) => device.createBindGroup({
      layout: pipes[name].getBindGroupLayout(0),
      entries: bindings.map((b, binding) => ({ binding, resource: resource(b.name, parity, low) })),
    });
    const groups = alternates ? [group(0), group(1)] : [group(0)];
    const lowGroup = /_SMOOTH\d$/.test(name) ? group(0, true) : null;
    return { name, pipeline: pipes[name], groups, lowGroup, dynamic: stepKind === 'dynamic' && bindings.some(b => b.kind === 'step') };
  });
  const byName = Object.fromEntries(kernels.map(k => [k.name, k]));
  // the device's speed for this work (see observeTime()), and the last step's grid points
  let factor = Math.max(1, slowdown), points = 0;
  const nodes = Math.ceil(plan.n / WG);
  const L = plan.label;
  // [kernel, workgroups or the word of its indirect arguments in gridMeta]
  const steps = [
    [`${L}_MINMAX`, [Math.min(nodes, MINMAX_GROUPS)]],
    [`${L}_PARAMS`, [1]],
    [`${L}_BIN`, [nodes]],
    [`${L}_SCAN_BLOCKS`, IND_SCAN],
    [`${L}_SCAN_TOP`, [1]],
    [`${L}_ORDER`, [nodes]],
    // its arguments are in gridChunk (ORDER's chunks of crowded cells)
    [`${L}_CROWD`, 'chunks'],
    [`${L}_DEPOSIT`, IND_DEPOSIT],
  ];
  if (plan.smooth) {
    for (let k = 0; k < plan.D; k++) steps.push([`${L}_SMOOTH${k}`, IND_SMOOTH + 3 * k]);
    // the refinement step: the residual, smoothed again in gridLo (no workgroups when the step's
    // gamma does not need it)
    steps.push([`${L}_RESIDUAL`, IND_RESIDUAL]);
    for (let k = 0; k < plan.D; k++) steps.push([`${L}_SMOOTH${k}`, IND_SMOOTH_LOW + 3 * k, 'low']);
  }
  steps.push([`${L}_GATHER`, [nodes]]);

  function dispatch(pass, name, size, { stepOffset = 0, parity = 0 } = {}, low = null) {
    const k = byName[name];
    pass.setPipeline(k.pipeline);
    pass.setBindGroup(0, low ? k.lowGroup : k.groups[k.groups.length > 1 ? parity : 0], k.dynamic ? [stepOffset] : []);
    if (size === 'chunks') pass.dispatchWorkgroupsIndirect(own.gridChunk, 0);
    else if (typeof size === 'number') pass.dispatchWorkgroupsIndirect(own.gridMeta, size * 4);
    else pass.dispatchWorkgroups(size[0]);
  }

  return {
    buffers: own,
    // Copy these bytes into a readback and give the words to gridStatus() and observe()
    status: { buffer: own.gridMeta, offset: META.STATUS * 4, size: STATUS_WORDS * 4 },

    /** The status words of a readback: the grid points of its last step */
    observe(words) {
      points = words[4];
    },

    /**
     * The runner's GPU ms a step (a timed readback's average). The speed probe times arithmetic in
     * cache; the grid's work is atomics and memory, which a device may do relatively slower, or a
     * device may slow down as it heats. So the step, divided by what it takes an M4 Max at most
     * (gridRelaxedMs()), gives a factor that cappedMs() takes when it is larger. The whole step
     * counts, other stages too, so the factor can only come out high (the safe side).
     */
    observeTime(msPerStep) {
      if (!(msPerStep > 0) || !(points > 0)) return;
      factor = Math.min(MOST_SLOWDOWN, Math.max(factor, msPerStep / gridRelaxedMs(plan, points)));
    },

    /** GPU ms of the grid's step at its worst (gridCappedMs()) on this device, as measured */
    cappedMs() {
      return gridCappedMs(plan) * factor;
    },

    /** The grid's own numbers (when the caller's step slot does not hold them), by slot name */
    setValues(numbers) {
      if (!own.V) throw new Error('the grid reads its numbers from the caller\'s step slot');
      const data = new Float32Array(plan.own.floats);
      plan.own.names.forEach((name, index) => {
        const value = numbers[name];
        if (value === undefined) throw new Error('setValues: no number for ' + name);
        data[index] = value;
      });
      device.queue.writeBuffer(own.V, 0, data);
    },

    // The dispatches of one step, into the caller's compute pass. `stepOffset`: the dynamic
    // offset of the caller's step slot for this step; `parity`: which buffer of an alternating
    // pair holds this step's positions.
    encode(pass, options) {
      if (plan.n === 0) return;
      for (const [name, size, low] of steps) dispatch(pass, name, size, options, low);
    },

    // The same, kernel by kernel (to time each in its own pass)
    phases: steps.map(([name, size, low]) => ({ name: low ? name + '_LOW' : name, encode: (pass, options) => dispatch(pass, name, size, options, low) })),

    destroy() {
      owned.forEach(b => b.destroy());
    },
  };
}
