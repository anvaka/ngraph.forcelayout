// The grid field on a device: its buffers, pipelines and the dispatches of a step, the gather of
// the two columns included.
//
//   const grid = await buildGrid(device, plan, { buffers: { X: [a, b], S } });
//   grid.setValues(gridSlotValues(...));   // only when the grid holds its own numbers
//   grid.encode(pass, { stepOffset, parity });
//   // copy grid.status into a readback: gridStatus(words, plan, name) says when to halt
import { getPipeline } from '../device.js';
import { META, IND_SCAN, IND_ADD, IND_DEPOSIT, IND_SMOOTH, WG } from './wgsl.js';

// MINMAX loops over the bodies with at most this many workgroups
const MINMAX_GROUPS = 1024;

/**
 * Buffers, pipelines and bind groups for `plan` (planGrid()). `buffers` are the caller's, by the
 * names its colRefs use; a pair [a, b] is a buffer that alternates between steps (positions that
 * ping-pong), a at even steps and b at odd ones (encode()'s `parity`). `step`, when the caller's
 * step slot holds the grid's numbers: {buffer, size, dynamic}. Resolves once the pipelines are
 * compiled; rejects naming the kernel when one fails, or when the buffers cannot be created.
 */
export async function buildGrid(device, plan, { buffers: external = {}, step = null } = {}) {
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
    gridField: buffer(sizes.gridField, SB | CS),
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
  const resource = (name, parity) => {
    if (name === 'V') return own.V ? { buffer: own.V } : { buffer: step.buffer, size: step.size };
    const b = own[name] || external[name];
    if (!b) throw new Error('buildGrid: no buffer for ' + name);
    return { buffer: Array.isArray(b) ? b[parity] : b };
  };
  const kernels = names.map(name => {
    const { bindings } = plan.kernels[name];
    const alternates = bindings.some(b => Array.isArray(external[b.name]));
    const group = parity => device.createBindGroup({
      layout: pipes[name].getBindGroupLayout(0),
      entries: bindings.map((b, binding) => ({ binding, resource: resource(b.name, parity) })),
    });
    const groups = alternates ? [group(0), group(1)] : [group(0)];
    return { name, pipeline: pipes[name], groups, dynamic: stepKind === 'dynamic' && bindings.some(b => b.kind === 'step') };
  });
  const byName = Object.fromEntries(kernels.map(k => [k.name, k]));
  const nodes = Math.ceil(plan.n / WG);
  const L = plan.label;
  // [kernel, workgroups or the word of its indirect arguments]
  const steps = [
    [`${L}_MINMAX`, [Math.min(nodes, MINMAX_GROUPS)]],
    [`${L}_PARAMS`, [1]],
    [`${L}_BIN`, [nodes]],
    [`${L}_SCAN_BLOCKS`, IND_SCAN],
    [`${L}_SCAN_TOP`, [1]],
    [`${L}_SCAN_ADD`, IND_ADD],
    [`${L}_ORDER`, [nodes]],
    [`${L}_DEPOSIT`, IND_DEPOSIT],
  ];
  if (plan.smooth) for (let k = 0; k < plan.D; k++) steps.push([`${L}_SMOOTH${k}`, IND_SMOOTH + 3 * k]);
  steps.push([`${L}_GATHER`, [nodes]]);

  function dispatch(pass, name, size, { stepOffset = 0, parity = 0 } = {}) {
    const k = byName[name];
    pass.setPipeline(k.pipeline);
    pass.setBindGroup(0, k.groups[k.groups.length > 1 ? parity : 0], k.dynamic ? [stepOffset] : []);
    if (typeof size === 'number') pass.dispatchWorkgroupsIndirect(own.gridMeta, size * 4);
    else pass.dispatchWorkgroups(size[0]);
  }

  return {
    buffers: own,
    // Copy these 16 bytes into a readback and give the words to gridStatus()
    status: { buffer: own.gridMeta, offset: META.STATUS * 4, size: 16 },

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
      for (const [name, size] of steps) dispatch(pass, name, size, options);
    },

    // The same, kernel by kernel (to time each in its own pass)
    phases: steps.map(([name, size]) => ({ name, encode: (pass, options) => dispatch(pass, name, size, options) })),

    destroy() {
      owned.forEach(b => b.destroy());
    },
  };
}
