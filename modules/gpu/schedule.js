// From a step that check.js accepts to what the runner builds: which kernels run, in which order,
// and which stages each one computes.
//
//  - The exact stock step (clear, repulsion, drag, springs, integrate, with the mass as charge,
//    sensitivity and inertia) in 2D above the small-graph size N* runs today's grid engine, the
//    stock template, byte for byte (templates/grid.js).
//  - Everything else is a generic plan (generic/plan.js): node kernels in CPU stage order. Up to
//    N* the whole step is one kernel with exact pairs; above it, in 2D and 3D, tree passes walk
//    the generic grid pyramid (pyramid/).
import { gridBuffers, shaderCode as gridCode, KERNEL_STAGES as GRID_STAGES, LAW_VALUES } from './templates/grid.js';
import { genericPlan, SMALL_GRAPH } from './generic/plan.js';
import { kernelCode } from './generic/emit.js';
import { GUARD, STOCK_STAGES, isGuard, physicsStages } from './program.js';
import { lawValueCount } from './wgsl/print.js';

export { GUARD, STOCK_STAGES, isGuard, physicsStages, SMALL_GRAPH };

/**
 * The plan for `program`, or {refusal}. `laws` maps every tree stage to its compiled law (null for
 * 1/r^2); `limits` a device's or a capability profile's; `options.generic` keeps the stock step
 * off its template (for tests that compare the two), `options.smallGraph` overrides N* (for
 * measurements). A plan has {template, nodes, buffers,
 * kernels(), kernelStages, how, reads}:
 *  - buffers: bytes per buffer; kernels(): the WGSL of every kernel by name;
 *  - kernelStages: the stages each kernel computes; how: per stage, for plan();
 *  - reads: the body columns the GPU reads, which a 'step' listener must not change.
 */
export function schedule(program, laws, limits, options = {}) {
  const nodes = program.spaces.nodes;
  const data = options.data || { linksDefault: true, groups: {} };
  if (!options.generic && nodes > (options.smallGraph || SMALL_GRAPH) && isStockStep(program, laws, data)) {
    return Object.assign(stockPlan(program, laws.repulsion || null), { dataKey: JSON.stringify(data) });
  }
  const plan = genericPlan(program, laws, { limits, warn: options.warn, smallGraph: options.smallGraph, data });
  if (plan.refusal) return plan;
  const grids = plan.kernelList.filter(kernel => kernel.kind === 'grid');
  plan.buffers = Object.assign({
    S: plan.S.size * 4, H: plan.H.size * 4, X: plan.cap * plan.D * 4, Y: plan.cap * plan.D * 4,
    L: lBytes(plan), V: plan.slot.bytes,
  }, plan.pyramid ? plan.pyramid.buffers : {});
  // grid fields: their buffers and kernels under their kernel's name
  grids.forEach(kernel => {
    const grid = kernel.section.grid;
    Object.keys(grid.buffers).forEach(name => { plan.buffers[`${kernel.name} ${name}`] = grid.buffers[name]; });
  });
  plan.kernels = printer => {
    const out = Object.assign(kernelCode(plan, printer), plan.pyramid ? plan.pyramid.kernels : {});
    grids.forEach(kernel => Object.entries(kernel.section.grid.kernels).forEach(([name, k]) => { out[name] = k.code; }));
    return out;
  };
  plan.how = genericHow(plan);
  plan.reads = Object.keys(plan.columns);
  return plan;
}

// Bytes of L: rows, links at both ends, and a block per group column (see generic/plan.js)
function lBytes(plan) {
  const n = plan.nodes, m = plan.links;
  let words = n + 1 + 7 * m + 1 + plan.groupColumns.length;
  if (plan.chunked) words += 2 + n + 2 * (Math.ceil(2 * m / 8) + n);
  plan.groupColumns.forEach(column => {
    const count = (Object.values(plan.sums).find(sum => sum.column === column) || {}).count || 0;
    const runs = Math.ceil(n / 256) + count;
    words += 3 + n + runs + 1 + count + 1;
  });
  return words * 4;
}

/**
 * True for the exact stock step: the built in stages in their order and nothing else, the mass
 * as charge, sensitivity and inertia, a law that fits the template's 16 numbers, in 2D, while
 * every link has the default length and stiffness (`data.linksDefault`).
 */
export function isStockStep(program, laws, data = { linksDefault: true }) {
  if (program.dims !== 2 || !data.linksDefault) return false;
  const stages = physicsStages(program);
  if (stages.map(stage => stage.builtIn).join() !== STOCK_STAGES.join()) return false;
  // the template has no gates
  if (stages.some(stage => stage.when)) return false;
  const repulsion = stages[1].args.channels[0];
  if (repulsion.charge !== 'mass' || repulsion.sensitivity !== 'mass') return false;
  if (stages[4].args.inertia !== 'mass') return false;
  const law = laws.repulsion;
  // the template's law has no lookup tables
  return !law || (lawValueCount(law) <= LAW_VALUES && !law.describe().tables.length);
}

function stockPlan(program, law) {
  const fire = program.settings.integrator === 'fire';
  return {
    template: 'grid',
    law,
    perStep: !!law && readsPerStep(law.describe()),
    nodes: program.spaces.nodes,
    links: program.spaces.links,
    buffers: gridBuffers(program.spaces.nodes, program.spaces.links),
    kernels: () => gridCode(law),
    kernelStages: GRID_STAGES,
    reads: ['pos', 'velocity', 'mass', 'pinned'],
    how: {
      clear: 'part of FORCE',
      repulsion: 'grid pyramid with exact pairs in the 3x3 near cells (theta and nbody do not apply)',
      drag: fire ? 'skipped under FIRE' : 'part of FORCE',
      springs: 'chunks of 8 links per thread (SPRINGS), added in FORCE',
      integrate: fire ? 'FIRE: FIRE_REDUCE, FIRE_STATE, FIRE_INTEGRATE' : 'Euler, part of FORCE',
    },
  };
}

// How each stage runs in a generic plan, for plan()
function genericHow(plan) {
  const how = Object.create(null);
  plan.skipped.forEach(name => { how[name] = 'skipped under FIRE'; });
  const nodeKernels = plan.kernelList.filter(k => k.kind === 'node').length;
  plan.kernelList.forEach((kernel, index) => {
    if (kernel.kind === 'link') kernel.sections.forEach(section => { how[section.stage.name] = `a thread per link, in ${kernel.name}`; });
    if (kernel.kind === 'grid') {
      const grid = kernel.section.grid, args = kernel.section.stage.args;
      how[kernel.section.stage.name] = `a ${args.anchor} grid of up to ${args.maxCells.toLocaleString('en-US')} cells per axis, ${args.weights} weights` +
        `${grid.smooth ? ', smoothed' : ''}: ${grid.dispatches} dispatches (${kernel.name})${kernel.hoisted ? ', at the start of the step' : ''}`;
    }
    if (kernel.kind !== 'node') return;
    const where = nodeKernels === 1 && plan.kernelList.length === 1 ? 'the step kernel (one dispatch)' : kernel.name;
    const reduce = plan.kernelList.slice(index + 1).find(k => k.kind === 'reduce');
    kernel.sections.forEach(section => {
      if (section.kind === 'pairs') {
        section.channels.forEach(c => { how[c.stage.name] = `exact pairs over tiles of 256 bodies, in ${where}`; });
        return;
      }
      if (section.kind === 'gather') {
        how[section.stage.name] = `both ends of every link, at each body, in ${where}`;
        return;
      }
      if (section.kind === 'tree') {
        const count = section.channels.length;
        const walk = count > 1 ? ` (${count} charges in one walk)` : '';
        section.channels.forEach(c => { how[c.stage.name] = `grid pyramid${walk}: ${section.pyramid.dispatches} structure dispatches, then exact pairs in the near cells and the far field in ${where}`; });
        return;
      }
      const name = section.stage.name;
      if (section.kind === 'sum') how[name] = kernel.hoisted ? 'added up at the start of the step (SUMS, SUMS_REDUCE)' : `per body in ${where}, added up in ${reduce ? reduce.name : 'a reduction'}`;
      else if (section.kind === 'fire') how[name] = `FIRE: FIRE_REDUCE, FIRE_STATE, then ${where}`;
      else if (section.kind === 'groupsum') {
        const runs = plan.kernelList.slice(index + 1).find(k => k.kind === 'groupRuns' && k.sums.some(sum => sum.name === name));
        how[name] = `per body in ${where}, then by group in ${runs ? runs.name : 'GROUP_RUNS'} and GROUP_SUM`;
      }
      else how[name] = (section.kind === 'formula' ? 'in ' : 'part of ') + where;
    });
  });
  return how;
}

// A law described as data (law.describe()) whose numbers can change from one step to the next
function readsPerStep(described) {
  return described.params.some(param => param.kind === 'host') ||
    !!(described.range && described.range.kind === 'host') ||
    described.builtIns.indexOf('step') >= 0;
}
