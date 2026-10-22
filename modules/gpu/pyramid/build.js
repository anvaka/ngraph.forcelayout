// The generic pyramid on a device: its buffers, pipelines and the structure dispatches of a step.
// The node kernel that adds the push is the caller's (plan.section), so this encodes everything
// up to it.
//
//   const tree = await buildPyramid(device, plan, { buffers: { S: positions, H: columns } });
//   tree.setValues({ gravity }, laws);   // laws: one compiled law per channel (or null)
//   tree.encode(pass);                   // HIST ... LOCAL, into the caller's compute pass
//   // then the caller's node kernel, with tree.buffers bound as plan.section.bindings says
import { getPipeline } from '../device.js';
import { writeLawValues } from '../wgsl/print.js';
import { boxLayout, WG, CROWD_GROUPS } from './wgsl.js';
import { NEAR_CAP, pyrLevels } from './plan.js';

const PARAM_WORDS = 20;
// Pair evaluations a step may spend on crowded cells (cells past the near cap) before the step
// is refused: about 20 ms of this Mac's GPU
export const WORK_CAP = 2e9;

/**
 * Buffers, pipelines and bind groups for `plan` (planPyramid()). `buffers` are the caller's, by
 * the names its colRefs use; a pair [a, b] is a buffer that alternates between steps (positions
 * that ping-pong), a at even steps and b at odd ones (encode()'s `parity`). `step`, when the
 * caller's step values hold the law numbers:
 * {buffer, size, dynamic} (dynamic: bound at an offset per step, see encode()).
 * Resolves once the pipelines are compiled; rejects naming the kernel when one fails, or when the
 * buffers cannot be created.
 */
export async function buildPyramid(device, plan, { buffers: external = {}, step = null, groupLimit = 0, workCap = WORK_CAP } = {}) {
  if (plan.refusal) throw new Error(plan.refusal);
  const { D, sizes, kernels, columns } = plan;
  const missing = [].concat(...Object.values(columns)).filter(name => !external[name]);
  if (missing.length) throw new Error('buildPyramid: no buffer for ' + missing.join(', '));

  const jobs = Object.keys(kernels).map(name => {
    const options = { code: kernels[name], label: name };
    const stepBinding = step ? [step.dynamic ? 'dynamic' : 'uniform'] : [];
    if (name === 'TREE_LOCAL' && step) options.bindings = ['uniform', 'storage', 'read', 'storage', 'read'].concat(stepBinding);
    if (name === 'TREE_HEAVY' && step) options.bindings = ['uniform', 'read', 'read', 'storage', 'read'].concat(stepBinding);
    return getPipeline(device, options).then(pipeline => [name, pipeline]);
  });
  const pipes = Object.fromEntries(await Promise.all(jobs));

  const S = GPUBufferUsage.STORAGE, CD = GPUBufferUsage.COPY_DST, CS = GPUBufferUsage.COPY_SRC, U = GPUBufferUsage.UNIFORM;
  const owned = [];
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  const buf = (size, usage = S) => {
    const b = device.createBuffer({ size, usage });
    owned.push(b);
    return b;
  };
  const sizesOf = plan.buffers;
  const treeBox = buf(sizesOf.treeBox, S | CD | CS);
  const treeCount = buf(sizesOf.treeCount, S | CD);
  const treeBlocks = buf(sizesOf.treeBlocks);
  const treeWork = buf(sizesOf.treeWork);
  const treeMeta = buf(sizesOf.treeMeta, S | CS);
  const treeSp = buf(sizesOf.treeSp, S | CS);
  const treeCells = buf(sizesOf.treeCells, S | CD | CS);
  const treeLists = buf(sizesOf.treeLists, S | CS);
  const paramBytes = (PARAM_WORDS + plan.lawWords) * 4;
  const TP = buf(Math.max(64, Math.ceil(paramBytes / 16) * 16), U | CD);
  const nbU = buf(16, U | CD);
  device.queue.writeBuffer(nbU, 0, new Uint32Array([sizes.nCells / 1024, 0, 0, 0]));

  // Box state: an empty bounding box, histogram centre at the origin; the first step's HIST and
  // BOX find the box before anything is binned
  const BL = boxLayout(D);
  const boxInit = new Uint32Array(BL.size);
  for (let k = 0; k < D; k++) boxInit[BL.BB_MIN + k] = 0xffffffff;
  device.queue.writeBuffer(treeBox, 0, boxInit);
  writeTables(device, treeCells, plan);

  const params = new ArrayBuffer(Math.max(64, Math.ceil(paramBytes / 16) * 16));
  const pu = new Uint32Array(params), pf = new Float32Array(params);
  pu[0] = sizes.n; pu[1] = sizes.G; pu[2] = sizes.levels; pu[3] = sizes.nCells;
  pu[4] = sizes.locOff; pu[5] = sizes.metaTag; pu[6] = sizes.metaRow; pu[7] = sizes.metaCount;
  pu[8] = NEAR_CAP; pu[9] = Math.max(1, Math.floor(sizes.n / 1000)); pf[10] = -1; pu[11] = sizes.pyrSize - 1;
  // LOCAL's own workgroups, then CROWD_GROUPS more for the crowded cells
  const localThreads = plan.heads ? sizes.n + sizes.localCells - sizes.nCells : sizes.localCells;
  const localGroups = Math.ceil(localThreads / WG);
  pu[12] = localGroups; pu[13] = sizes.crowdOff; pf[14] = workCap; pu[15] = sizes.crowdList; pu[16] = sizes.occList;

  const bind = (name, list, pipeline = pipes[name]) => device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: list.map((resource, binding) => ({ binding, resource: resource.buffer ? resource : { buffer: resource } })),
  });
  // The caller's buffers of kernel `name` at step parity p
  const cols = (name, p) => columns[name].map(column => (Array.isArray(external[column]) ? external[column][p] : external[column]));
  const alternates = name => columns[name].some(column => Array.isArray(external[column]));
  // A kernel that reads alternating buffers gets a bind group per parity
  const both = (name, list) => (alternates(name) ? [0, 1].map(p => bind(name, list(p))) : bind(name, list(0)));
  const stepEntry = step ? [{ buffer: step.buffer, size: step.size }] : [];
  const groups = {
    TREE_HIST: both('TREE_HIST', p => [TP].concat(cols('TREE_HIST', p), [treeBox])),
    TREE_BOX: bind('TREE_BOX', [TP, treeBox, treeLists]),
    TREE_BIN: both('TREE_BIN', p => [TP].concat(cols('TREE_BIN', p), [treeBox, treeCount, treeWork])),
    TREE_SCAN_BLOCKS: bind('TREE_SCAN_BLOCKS', [treeCount, treeMeta, treeBlocks]),
    TREE_SCAN_TOP: bind('TREE_SCAN_TOP', [treeBlocks, nbU]),
    TREE_SCAN_ADD: bind('TREE_SCAN_ADD', [TP, treeMeta, treeBlocks]),
    TREE_PLACE: bind('TREE_PLACE', [TP, treeMeta, treeWork]),
    TREE_ORDER: both('TREE_ORDER', p => [TP].concat(cols('TREE_ORDER', p), [treeWork, treeMeta, treeSp])),
    TREE_AGG0: bind('TREE_AGG0', [TP, treeSp, treeMeta, treeCells, treeLists]),
    TREE_LOCAL: bind('TREE_LOCAL', [TP, treeCells, treeMeta, treeLists, treeSp].concat(stepEntry)),
  };
  if (plan.heavyCells) groups.TREE_HEAVY = bind('TREE_HEAVY', [TP, treeSp, treeMeta, treeCells, treeLists].concat(stepEntry));
  // TREE_PYR's dispatches: a block of levels each (blockSteps), else a level each
  const levels = pyrLevels(sizes.levels, plan.blockSteps).map(({ from, steps }) => {
    const u = buf(16, U | CD);
    const count = plan.blockSteps ? (sizes.G >> from) ** D : (sizes.G >> (from + 1)) ** D;
    device.queue.writeBuffer(u, 0, new Uint32Array(plan.blockSteps ? [count, sizes.levelOff[from], steps, sizes.metaCount] :
      [count, sizes.levelOff[from], sizes.levelOff[from + 1], sizes.metaCount]));
    return { count, group: bind('TREE_PYR', [u, treeCells].concat(plan.layout.CNT < 0 ? [treeMeta] : [])) };
  });
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the tree buffers: ' + setupError.message);
  }

  // (`groupLimit` lowers it, so tests can see 2D grids at small sizes)
  const limit = groupLimit || device.limits.maxComputeWorkgroupsPerDimension;
  // Workgroups for `threads`, as a 2D grid past the per-dimension limit (kernels read the linear id)
  function grid(threads) {
    const w = Math.max(1, Math.ceil(threads / WG));
    if (w <= limit) return [w, 1];
    const x = limit;
    return [x, Math.ceil(w / x)];
  }
  const nodes = grid(sizes.n), cells = grid(sizes.nCells);
  const locals = grid((localGroups + CROWD_GROUPS) * WG);
  const histGroups = Math.min(nodes[0] * nodes[1], 128);
  let parity = 0;
  function dispatch(pass, name, size) {
    pass.setPipeline(pipes[name]);
    pass.setBindGroup(0, Array.isArray(groups[name]) ? groups[name][parity] : groups[name]);
    pass.dispatchWorkgroups(size[0], size[1]);
  }

  return {
    plan,
    buffers: { treeSp, treeMeta, treeCells, TP },
    // For the caller's node kernel: dispatch size over the bodies, in the tree's cell order
    nodeGrid: nodes,
    // Settings and the law numbers of every channel (compiled laws, after update(); null for
    // 1/r^2). The law numbers are skipped when the caller's step values hold them.
    setValues(settings, laws) {
      pf[10] = settings.gravity;
      if (laws && plan.lawWords) {
        plan.groups.forEach(group => {
          if (group.law) writeLawValues(laws[group.first] || group.law, pf, PARAM_WORDS + group.base);
        });
      }
      device.queue.writeBuffer(TP, 0, params);
    },
    // The structure dispatches of one step. `stepOffset`: the dynamic offset of the caller's
    // step values for this step; `parity`: which buffer of an alternating pair holds this step's
    // positions (0 or 1).
    encode(pass, { stepOffset, parity: p = 0 } = {}) {
      parity = p;
      dispatch(pass, 'TREE_HIST', [histGroups, 1]);
      dispatch(pass, 'TREE_BOX', [1, 1]);
      dispatch(pass, 'TREE_BIN', nodes);
      dispatch(pass, 'TREE_SCAN_BLOCKS', [sizes.nCells / 1024, 1]);
      dispatch(pass, 'TREE_SCAN_TOP', [1, 1]);
      dispatch(pass, 'TREE_SCAN_ADD', cells);
      dispatch(pass, 'TREE_PLACE', nodes);
      dispatch(pass, 'TREE_ORDER', nodes);
      dispatch(pass, 'TREE_AGG0', cells);
      pass.setPipeline(pipes.TREE_PYR);
      for (const { count, group } of levels) {
        pass.setBindGroup(0, group);
        const size = grid(count);
        pass.dispatchWorkgroups(size[0], size[1]);
      }
      const offsets = step && step.dynamic ? [stepOffset || 0] : [];
      pass.setPipeline(pipes.TREE_LOCAL);
      pass.setBindGroup(0, groups.TREE_LOCAL, offsets);
      pass.dispatchWorkgroups(locals[0], locals[1]);
      if (plan.heavyCells) {
        pass.setPipeline(pipes.TREE_HEAVY);
        pass.setBindGroup(0, groups.TREE_HEAVY, offsets);
        pass.dispatchWorkgroups(plan.heavyGroups);
      }
    },
    boxBuffer: treeBox,
    // Copy these 16 bytes into a readback and give the 4 words to pyramidStatus(): non-null means
    // the step's crowded cells were refused and the runner should halt with that message
    status: { buffer: treeLists, offset: 0, size: 16 },
    destroy() {
      for (const b of owned) b.destroy();
    },
  };
}

// The laws' lookup tables, as f32 at the start of treeCells
function writeTables(device, treeCells, plan) {
  const words = plan.layout.TAB4 * 4;
  if (!words) return;
  const data = new Float32Array(words);
  plan.groups.forEach(group => {
    (group.tables || []).forEach(table => { data.set(table.values, table.base); });
  });
  device.queue.writeBuffer(treeCells, 0, data);
}

/**
 * The message to halt with for the 4 status words of a step (tree.status), or null. Cells of more
 * than NEAR_CAP bodies are summed exactly in workgroups; past `workCap` pair evaluations a step
 * (a layout piled into a few cells), they are refused rather than sampled.
 */
export function pyramidStatus(words) {
  const biggest = words[2];
  if (!biggest) return null;
  return `the tree pass: a grid cell holds ${biggest.toLocaleString('en-US')} bodies, and the crowded cells need about ` +
    `${(words[3] / 1000).toFixed(1)} billion pair evaluations a step, more than the GPU takes (${WORK_CAP / 1e9} billion); ` +
    'the layout is piled too densely in one place for the grid';
}
