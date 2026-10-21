// What this module can run, for the library's `simulator.plan(backend)`: it tells, before a
// layout moves to the GPU, which stages of a simulator would not run here and why.
//
//   const plan = layout.simulator.plan(gpuBackend);
//   if (!plan.runs) console.log(plan.reasons); // ['pull: the WebGPU module does not run node formulas yet']
import { LAW_VALUES } from './gridEngine.js';

const KERNELS = {
  clear: 'part of the integration kernel',
  drag: 'part of the integration kernel',
  springs: 'one pass over links stored per node',
  integrate: 'one kernel per step',
};

export const gpuBackend = {
  name: 'webgpu',

  /**
   * Problems with the simulator as a whole, as a list of sentences.
   */
  checkSettings(simulator) {
    const reasons = [];
    const settings = simulator.settings;
    if (settings.dimensions !== 2) reasons.push(`the WebGPU module is 2D only (dimensions: ${settings.dimensions})`);
    if (settings.adaptiveTimeStepWeight) reasons.push('the WebGPU module has no adaptive time step');
    return reasons;
  },

  /**
   * Whether this module runs a stage, from the stage's description (see simulator.plan()).
   */
  check(description, simulator) {
    switch (description.shape) {
      case 'clear':
      case 'drag':
      case 'integrate':
        return runs(KERNELS[description.shape]);
      case 'springs':
        return checkSprings(simulator);
      case 'tree':
        return description.builtIn ? checkRepulsion(description, simulator) :
          refuse('the WebGPU module runs one repulsion pass');
      case 'node':
      case 'link':
      case 'pair':
      case 'sum':
        return refuse(`the WebGPU module does not run ${description.shape} formulas yet`);
      case 'pair rules':
      case 'js':
        return refuse('JavaScript stages run on the CPU only');
    }
    return refuse(`unknown kind of stage: ${description.shape}`);
  },
};

function checkSprings(simulator) {
  const springs = simulator.springStore;
  for (let i = 0; i < springs.n; i++) {
    if (springs.length[i] >= 0 || springs.coefficient[i] > 0) {
      return refuse('the WebGPU module uses one spring length and one stiffness for all links');
    }
  }
  return runs(KERNELS.springs);
}

function checkRepulsion(description, simulator) {
  const law = description.law;
  if (law.tableNames.length) return refuse('the WebGPU module cannot read lookup tables in a law yet');
  if (Object.keys(law.functions).length) return refuse('laws with JavaScript functions run on the CPU only');
  if (law.valueCount > LAW_VALUES) return refuse(`the WebGPU module takes laws with up to ${LAW_VALUES} numbers`);
  if (description.charge !== 'mass' || description.sensitivity !== 'mass') {
    return refuse('the WebGPU module uses the mass as charge and sensitivity');
  }
  // The module sets every mass to the library's default, 1 + links / 3
  const { n, mass, degree } = simulator.store;
  for (let i = 0; i < n; i++) {
    if (Math.abs(mass[i] - (1 + degree[i] / 3)) > 1e-6 * mass[i]) {
      return refuse('the WebGPU module sets every mass to 1 + links / 3');
    }
  }
  return runs(law.isDefault ? 'exact pairs or a grid pyramid' : 'exact pairs or a grid pyramid, with the law compiled in');
}

function runs(how) {
  return { runs: true, how };
}

function refuse(reason) {
  return { runs: false, reason };
}
