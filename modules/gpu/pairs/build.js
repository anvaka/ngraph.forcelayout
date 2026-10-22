// The pair formulas' lowering on a device: buffers, pipelines, bind groups and the dispatches of a
// step. The node kernel that adds the totals is the caller's (plan.section()).
//
//   const pairs = await buildPairs(device, plan, { buffers: { X: [x, y], S, H }, step });
//   pass = pairs.encode(pass, { stepOffset, parity, values, split });   // before the node kernel
//   pass = pairs.encode(pass, { ..., stages: ['crowd'] });  // only these stages, and their sorts
//   // after a readback that copied pairs.status.buffer:
//   pairs.observe(words);                                  // the work the device measured
//   const message = pairs.statusMessage(words);            // non-null: halt the runner with it
//
// A step whose pair work is expected past the cap (from the device's last measurement, or at
// first from the host's count of the store's positions) runs sliced: its rank work and pair work
// in slices of at most the cap, each slice in a submit of its own, through `split()`, which the
// caller gives (it ends the pass, submits, and returns a new pass). Every submit then stays far
// from the GPU watchdog, however crowded the layout. Results are the same, bit for bit. Without
// `split`, or when the device needs more than the slices planned, the guard stops the step and the
// status says so.
import { getPipeline } from '../device.js';
import { statusMessage } from './plan.js';
import { estimateWork } from './estimate.js';
import { WG, ARGS, CHUNK, MAX_SLICES } from './wgsl.js';

// A step runs sliced when its expected work times this passes the cap: the work may grow between
// the measurement and the step (a readback comes once per call)
const MARGIN = 1.5;
// Bytes between two entries of the slices' uniform (the dynamic offset alignment)
const SLICE_STRIDE = 256;

/**
 * Buffers, pipelines and bind groups for `plan` (planPairs()). `buffers` are the caller's, by the
 * names its colRefs use (`X` the positions: a pair [a, b] alternates by step parity). `step`:
 * {buffer, size} of the caller's step values, bound at a dynamic offset per step. `positions`:
 * the store's positions (D numbers per body), for the host's count of a step's work before the
 * device has measured it; `estimateScale` multiplies every expected work (tests force it low).
 * Resolves once the pipelines are compiled; rejects naming the kernel when one fails, or when the
 * buffers cannot be created.
 */
export async function buildPairs(device, plan, { buffers: external, step, positions = null, estimateScale = 1 }) {
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
  // The slices' numbers: at 0 the step's slice count, at SLICE_STRIDE * (s + 1) slice s
  const slices = device.createBuffer({ size: SLICE_STRIDE * (MAX_SLICES + 1), usage: GPUBufferUsage.UNIFORM | CD, label: 'pairSlices' });
  owned.push(slices);
  const sliceInit = new Uint32Array(SLICE_STRIDE / 4 * (MAX_SLICES + 1));
  for (let s = 0; s < MAX_SLICES; s++) sliceInit[SLICE_STRIDE / 4 * (s + 1) + 1] = s;
  device.queue.writeBuffer(slices, 0, sliceInit);
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the pair buffers: ' + setupError.message);
  }

  const stepEntry = { buffer: step.buffer, size: step.size };
  const slice = { buffer: slices, size: 16 };
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
      PLACE_S: bind(k.PLACE_S, [b.params, b.start, b.body, b.list, b.args]),
      ARGS_RANK_S: bind(k.ARGS_RANK_S, [b.params, b.args, status, slice]),
      RANK_OWNERS_S: bind(k.RANK_OWNERS_S, [b.params, b.args, b.start, b.body, b.list, slice]),
      RANK_S: bind(k.RANK_S, [b.params, b.args, b.start, b.body, b.list, slice]),
      ORDER_S: [0, 1].map(p => bind(k.ORDER_S, [b.params, b.args, b.start, b.body, b.list, b.snap, X(p)].concat(columnsOf(b.sort.columns, p), [slice]))),
      ARGS_S: bind(k.ARGS_S, [b.params, b.args, status, slice]),
      EVAL_OWNERS_S: bind(k.EVAL_OWNERS_S, [b.params, b.args, b.body, b.list, slice]),
    };
    // what the host knows of this sort's work: {chunks, radius} measured or counted, and the
    // radius of the step encoded last
    b.known = null;
    b.lastRadius = 0;
    b.lastSlices = 0;
  });
  const stages = plan.stages.map(stage => {
    const b = sorts[stage.sort];
    return {
      stage, sort: b,
      EVAL: bind(stage.kernels.EVAL, [b.params, stepEntry, b.args, b.start, b.list, b.snap, partials[stage.index]]
        .concat(stage.sumBuffer ? columnsOf([stage.sumBuffer], 0) : [])),
      GATHER: bind(stage.kernels.GATHER, [b.params, b.args, b.body, partials[stage.index]].concat(columnsOf(stage.gatherColumns, 0))),
      EVAL_S: bind(stage.kernels.EVAL_S, [b.params, stepEntry, b.args, b.start, b.list, b.snap, partials[stage.index]]
        .concat(stage.sumBuffer ? columnsOf([stage.sumBuffer], 0) : [], [slice])),
      GATHER_S: bind(stage.kernels.GATHER_S, [b.params, b.args, b.body, partials[stage.index]].concat(columnsOf(stage.gatherColumns, 0), [slice])),
    };
  });
  let cap = plan.capChunks;

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
  const sliceAt = s => SLICE_STRIDE * (s + 1);

  // Slices a step of sort `b` needs at `radius`: 0 when its expected work fits one submit. The
  // work grows about as radius^D (more bodies per cell)
  function slicesFor(b, radius) {
    if (!b.known && positions) {
      const work = estimateWork(positions, plan.n, plan.D, radius, plan.size);
      b.known = { chunks: Math.max(work.chunks, work.ranks) * estimateScale, radius };
    }
    if (!b.known) return 0;
    let chunks = b.known.chunks;
    if (radius > b.known.radius) chunks *= (radius / b.known.radius) ** plan.D;
    const need = chunks * MARGIN;
    return need <= cap ? 0 : Math.min(MAX_SLICES, Math.ceil(need / cap));
  }

  // A sliced step of sort `b`: the sort, then its rank work slice by slice, then ORDER, then each
  // stage's chunks and gather slice by slice, every slice in a submit of its own. Returns the pass
  // to go on with
  function encodeSliced(pass, b, active, count, split, offsets, parity) {
    const k = b.sort.kernels, g = b.groups;
    // what came before goes first, so that this step's slice count reaches only its own kernels
    pass = split();
    device.queue.writeBuffer(slices, 0, new Uint32Array([count, 0, 0, 0]));
    dispatch(pass, k.BIN, g.BIN[parity], bodies, offsets);
    dispatch(pass, k.SCAN_BLOCKS, g.SCAN_BLOCKS, [plan.blocks, 1]);
    dispatch(pass, k.SCAN_TOP, g.SCAN_TOP, [1, 1]);
    dispatch(pass, k.PLACE_S, g.PLACE_S, bodies);
    dispatch(pass, k.ARGS_RANK_S, g.ARGS_RANK_S, [1, 1], [0]);
    for (let s = 0; s < count; s++) {
      pass = split();
      dispatch(pass, k.RANK_OWNERS_S, g.RANK_OWNERS_S, bodies, [sliceAt(s)]);
      indirect(pass, k.RANK_S, g.RANK_S, b.args, ARGS.SLICE_RANK + 3 * s, [sliceAt(s)]);
    }
    pass = split();
    dispatch(pass, k.ORDER_S, g.ORDER_S[parity], bodies, [0]);
    dispatch(pass, k.ARGS_S, g.ARGS_S, [1, 1], [0]);
    for (let s = 0; s < count; s++) {
      active.forEach((st, j) => {
        pass = split();
        if (j === 0) dispatch(pass, k.EVAL_OWNERS_S, g.EVAL_OWNERS_S, bodies, [sliceAt(s)]);
        indirect(pass, st.stage.kernels.EVAL_S, st.EVAL_S, b.args, ARGS.SLICE_EVAL + 3 * s, [offsets[0], sliceAt(s)]);
        dispatch(pass, st.stage.kernels.GATHER_S, st.GATHER_S, bodies, [sliceAt(s)]);
      });
    }
    // what comes after goes in a submit of its own too
    return split();
  }

  return {
    plan,
    status: { buffer: status, bytes: plan.buffers.pairStatus },
    /**
     * The pair work of one step, into the caller's compute pass; returns the pass to go on with
     * (another one after a sliced step). `values`: the step's numbers as the slot holds them (for
     * the radius and the gates: a sort whose stages are all off, or whose radius is not positive,
     * encodes nothing); `parity`: the buffer of X holding the positions the stages read.
     * `stages`: names of the stages to run (all by default), with the sorts they need, for stages
     * that sit before different node kernels. A sort shared by stages in two kernels then runs
     * twice, each time with the columns as they are at that point. `split()`: ends the pass,
     * submits what was encoded, and returns a new pass; without it no step is sliced.
     */
    encode(pass, { stepOffset = 0, parity = 0, values, stages: names = null, split = null }) {
      const offsets = [stepOffset];
      for (const b of sorts) {
        const active = stages.filter(s => s.sort === b && on(s.stage, values) && (!names || names.indexOf(s.stage.name) >= 0));
        const radius = values[b.sort.radius];
        if (!active.length || !(radius > 0)) continue;
        const count = split ? slicesFor(b, radius) : 0;
        b.lastRadius = radius;
        b.lastSlices = count;
        if (count) {
          pass = encodeSliced(pass, b, active, count, split, offsets, parity);
          continue;
        }
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
      return pass;
    },
    /**
     * The device's measured work, from status words read back from `status.buffer` (call it on
     * every readback): the next steps' slices are planned from it.
     */
    observe(words) {
      sorts.forEach(b => {
        const chunks = words[4 + b.sort.index];
        if (chunks > 0 && b.lastRadius > 0) b.known = { chunks: chunks * estimateScale, radius: b.lastRadius };
      });
    },
    /**
     * Slices each sort's last encoded step ran in (0: one submit).
     */
    slices() {
      return sorts.map(b => b.lastSlices);
    },
    /**
     * Lowers the cap on a step's pair tests (a device slower than the one the default was sized
     * for); it cannot rise above the plan's, which sized the buffers.
     */
    setCap(tests) {
      cap = Math.max(1, Math.min(plan.capChunks, Math.floor(tests / CHUNK)));
      sorts.forEach(b => device.queue.writeBuffer(b.params, 16, new Uint32Array([cap])));
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

