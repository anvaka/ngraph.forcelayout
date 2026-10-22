// The pair formulas' lowering on a device: buffers, pipelines, bind groups and the dispatches of a
// step. The node kernel that adds the totals is the caller's (plan.section()).
//
//   const pairs = await buildPairs(device, plan, { buffers: { X: [x, y], S, H }, step });
//   pairs.encode(pass, { stepOffset, parity, values });   // before the node kernel, every step
//   // after a readback that copied pairs.status.buffer:
//   const message = pairs.statusMessage(words);          // non-null: halt the runner with it
import { getPipeline } from '../device.js';
import { statusMessage } from './plan.js';
import { WG, ARGS } from './wgsl.js';

/**
 * Buffers, pipelines and bind groups for `plan` (planPairs()). `buffers` are the caller's, by the
 * names its colRefs use (`X` the positions: a pair [a, b] alternates by step parity). `step`:
 * {buffer, size} of the caller's step values, bound at a dynamic offset per step. Resolves once
 * the pipelines are compiled; rejects naming the kernel when one fails, or when the buffers
 * cannot be created.
 */
export async function buildPairs(device, plan, { buffers: external, step }) {
  if (plan.refusal) throw new Error(plan.refusal);
  const pipes = Object.fromEntries(await Promise.all(Object.keys(plan.kernels).map(name =>
    getPipeline(device, { code: plan.kernels[name], label: name, bindings: plan.bindings[name] }).then(pipeline => [name, pipeline]))));

  const SB = GPUBufferUsage.STORAGE, CD = GPUBufferUsage.COPY_DST, CS = GPUBufferUsage.COPY_SRC;
  const owned = [];
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  const buffer = (name, usage = SB) => {
    const b = device.createBuffer({ size: plan.buffers[name], usage, label: name });
    owned.push(b);
    return b;
  };
  const status = buffer('pairStatus', SB | CS | CD);
  const sorts = plan.sorts.map(sort => {
    const s = sort.index;
    const params = device.createBuffer({ size: 32, usage: GPUBufferUsage.UNIFORM | CD, label: 'PP' + s });
    owned.push(params);
    device.queue.writeBuffer(params, 0, new Uint32Array([plan.n, plan.size - 1, plan.size, plan.blocks, plan.capChunks, s, plan.n + plan.capChunks, plan.n + 2 * plan.capChunks]));
    return {
      sort, params,
      count: buffer('pairCount' + s), start: buffer('pairStart' + s), body: buffer('pairBody' + s),
      list: buffer('pairList' + s), args: buffer('pairArgs' + s, SB | GPUBufferUsage.INDIRECT | CS), snap: buffer('pairSnap' + s),
    };
  });
  const partials = plan.stages.map(stage => buffer('pairPartial' + stage.index));
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the pair buffers: ' + setupError.message);
  }

  const stepEntry = { buffer: step.buffer, size: step.size };
  const resource = r => (r.buffer ? r : { buffer: r });
  const bind = (name, list) => device.createBindGroup({
    layout: pipes[name].getBindGroupLayout(0),
    entries: list.map((r, binding) => ({ binding, resource: resource(r) })),
  });
  const columnsOf = (names, p) => names.map(name => (Array.isArray(external[name]) ? external[name][p] : external[name]));
  const X = p => (Array.isArray(external.X) ? external.X[p] : external.X);
  sorts.forEach(b => {
    const k = b.sort.kernels;
    b.groups = {
      BIN: [0, 1].map(p => bind(k.BIN, [b.params, stepEntry, X(p), b.count, b.body])),
      SCAN_BLOCKS: bind(k.SCAN_BLOCKS, [b.params, b.count, b.start]),
      SCAN_TOP: bind(k.SCAN_TOP, [b.params, b.start]),
      PLACE: bind(k.PLACE, [b.params, b.start, b.body, b.list, b.args]),
      ARGS_RANK: bind(k.ARGS_RANK, [b.params, b.args, status]),
      RANK: bind(k.RANK, [b.params, b.args, b.start, b.body, b.list]),
      ARGS: bind(k.ARGS, [b.params, b.args, status]),
      ORDER: [0, 1].map(p => bind(k.ORDER, [b.params, b.args, b.start, b.body, b.list, b.snap, X(p)].concat(columnsOf(b.sort.columns, p)))),
    };
  });
  const stages = plan.stages.map(stage => {
    const b = sorts[stage.sort];
    return {
      stage, sort: b,
      EVAL: bind(stage.kernels.EVAL, [b.params, stepEntry, b.args, b.start, b.list, b.snap, partials[stage.index]]
        .concat(stage.sumBuffer ? columnsOf([stage.sumBuffer], 0) : [])),
      GATHER: bind(stage.kernels.GATHER, [b.params, b.args, b.body, partials[stage.index]].concat(columnsOf(stage.gatherColumns, 0))),
    };
  });

  const limit = device.limits.maxComputeWorkgroupsPerDimension;
  // Workgroups for `threads`, as a 2D grid past the per-dimension limit (kernels read the linear id)
  const grid = threads => {
    const w = Math.max(1, Math.ceil(threads / WG));
    return w <= limit ? [w, 1] : [limit, Math.ceil(w / limit)];
  };
  const bodies = grid(plan.n);
  const dispatch = (pass, name, group, size, offsets) => {
    pass.setPipeline(pipes[name]);
    pass.setBindGroup(0, group, offsets);
    pass.dispatchWorkgroups(size[0], size[1]);
  };
  const indirect = (pass, name, group, args, word, offsets) => {
    pass.setPipeline(pipes[name]);
    pass.setBindGroup(0, group, offsets);
    pass.dispatchWorkgroupsIndirect(args, word * 4);
  };
  const on = (stage, values) => stage.gate === undefined || values[stage.gate] !== 0;

  return {
    plan,
    status: { buffer: status, bytes: plan.buffers.pairStatus },
    /**
     * The pair work of one step, into the caller's compute pass. `values`: the step's numbers as
     * the slot holds them (for the radius and the gates: a sort whose stages are all off, or whose
     * radius is not positive, encodes nothing); `parity`: the buffer of X holding the positions
     * the stages read.
     */
    encode(pass, { stepOffset = 0, parity = 0, values }) {
      const offsets = [stepOffset];
      for (const b of sorts) {
        const active = stages.filter(s => s.sort === b && on(s.stage, values));
        if (!active.length || !(values[b.sort.radius] > 0)) continue;
        const k = b.sort.kernels, g = b.groups;
        dispatch(pass, k.BIN, g.BIN[parity], bodies, offsets);
        dispatch(pass, k.SCAN_BLOCKS, g.SCAN_BLOCKS, [plan.blocks, 1]);
        dispatch(pass, k.SCAN_TOP, g.SCAN_TOP, [1, 1]);
        dispatch(pass, k.PLACE, g.PLACE, bodies);
        dispatch(pass, k.ARGS_RANK, g.ARGS_RANK, [1, 1]);
        indirect(pass, k.RANK, g.RANK, b.args, ARGS.RANK_X);
        dispatch(pass, k.ORDER, g.ORDER[parity], bodies);
        dispatch(pass, k.ARGS, g.ARGS, [1, 1]);
        for (const s of active) {
          indirect(pass, s.stage.kernels.EVAL, s.EVAL, b.args, ARGS.EVAL_X, offsets);
          dispatch(pass, s.stage.kernels.GATHER, s.GATHER, bodies);
        }
      }
    },
    /**
     * The runner's message for status words read back from `status.buffer`, or null.
     */
    statusMessage(words) {
      return statusMessage(plan, words);
    },
    /**
     * Chunks of 256 pair tests the last encoded step of each sort needed, from status words.
     */
    lastChunks(words) {
      return plan.sorts.map(sort => words[4 + sort.index]);
    },
    // For tests: the device buffers by name
    buffers: { status, sorts, partials },
    destroy() {
      owned.forEach(b => b.destroy());
    },
  };
}

