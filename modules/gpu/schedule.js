// From a step that check.js accepts to what the runner builds: which kernels run, in which order,
// and which stages each one computes. Today that is one of two stock templates for the exact stock
// step: the small engine (one workgroup) for graphs it fits, else the grid engine. The generic
// emitter adds its plans here (design sections 6 and 7): node kernels in CPU stage order, the
// one-kernel small-graph step, sums and the generic pyramid.
import { gridBuffers, shaderCode as gridCode, KERNEL_STAGES as GRID_STAGES } from './templates/grid.js';
import { smallEngineFits, shaderCode as smallCode, KERNEL_STAGES as SMALL_STAGES } from './templates/small.js';

// The stage runOnGpu() adds so that layout.step() throws while the GPU runs the layout
export const GUARD = 'runsOnGpu';
// The stock step, in the order the CPU runs it
export const STOCK_STAGES = ['clear', 'repulsion', 'drag', 'springs', 'integrate'];

/**
 * The stages of `program` that compute physics: all but the guard.
 */
export function physicsStages(program) {
  return program.stages.filter(stage => !isGuard(stage));
}

export function isGuard(stage) {
  return stage.name === GUARD && stage.shape === 'guard';
}

/**
 * The plan for the stock step of `program`. `law` is the compiled repulsion law, or null for
 * 1/r^2; `limits` a device's or a capability profile's. Returns {template, law, perStep, nodes,
 * links, buffers, kernels(), kernelStages, how}:
 *  - perStep: the law's numbers must be read for every queued step (a parameter or range given
 *    by a function, or the law reads `step`), so the runner builds the law-variant pipelines;
 *  - buffers: bytes per buffer; kernels(): the WGSL of every kernel by name;
 *  - kernelStages: the stages each kernel computes; how: per stage, for plan().
 */
export function schedule(program, law, limits) {
  const nodes = program.spaces.nodes, links = program.spaces.links;
  const small = nodes > 0 && smallEngineFits(limits, nodes);
  const fire = program.settings.integrator === 'fire';
  return {
    template: small ? 'small' : 'grid',
    law,
    perStep: !!law && readsPerStep(law.describe()),
    nodes,
    links,
    buffers: small ? smallBuffers(nodes, links) : gridBuffers(nodes, links),
    kernels: () => (small ? { small: smallCode(law) } : gridCode(law)),
    kernelStages: small ? SMALL_STAGES : GRID_STAGES,
    how: small ? {
      clear: 'part of the step kernel (one workgroup)',
      repulsion: 'exact pairs in one workgroup',
      drag: fire ? 'skipped under FIRE' : 'part of the step kernel',
      springs: 'part of the step kernel',
      integrate: (fire ? 'FIRE' : 'Euler') + ', part of the step kernel',
    } : {
      clear: 'part of FORCE',
      repulsion: 'grid pyramid with exact pairs in the 3x3 near cells (theta and nbody do not apply)',
      drag: fire ? 'skipped under FIRE' : 'part of FORCE',
      springs: 'chunks of 8 links per thread (SPRINGS), added in FORCE',
      integrate: fire ? 'FIRE: FIRE_REDUCE, FIRE_STATE, FIRE_INTEGRATE' : 'Euler, part of FORCE',
    },
  };
}

// A law described as data (law.describe()) whose numbers can change from one step to the next
function readsPerStep(described) {
  return described.params.some(param => param.kind === 'host') ||
    !!(described.range && described.range.kind === 'host') ||
    described.builtIns.indexOf('step') >= 0;
}

function smallBuffers(n, edges) {
  const size = bytes => Math.max(16, Math.ceil(bytes / 16) * 16);
  return { pos: size(n * 8), vel: size(n * 16), mass: size(n * 4), csr: size((n + 1 + 2 * edges) * 4), fire: 16 };
}
