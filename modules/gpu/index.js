// ngraph.forcelayout.gpu: runs a layout of ngraph.forcelayout on WebGPU. The layout keeps its API;
// the GPU runs its own simulator, from the step as data (simulator.program()), and positions come
// back into its store.
//
//   const backend = await createWebGPUBackend();      // null without WebGPU
//   const plan = layout.simulator.plan(backend);      // {runs, reasons, warnings, stages}
//   const gpu = await runOnGpu(layout, backend);      // rejects with plan.reasons
//   gpu.step(20);                                     // queues 20 steps, returns at once
//   layout.getNodePosition(id);                       // the store, updated by every readback
//   await gpu.stop();                                 // back to layout.step() on the CPU
//
// See README.md for the parts of the module.
import { requestDevice, watchDevice } from './device.js';
import { createCapabilities, LIMIT_NAMES } from './check.js';
import { gridArithmetic, GRID_CHECK_PENDING } from './grid/canary.js';

export { runOnGpu } from './runner.js';
export { gpuCapabilities, SPEC_LIMITS } from './check.js';

/**
 * A backend for `simulator.plan(backend)` and `runOnGpu(layout, backend)`, or null when WebGPU is
 * not available. Pass `{device}` to use a device you already have; otherwise one is requested
 * with the adapter's limits for storage buffers, workgroups and buffer sizes, and with timestamp
 * queries when the adapter has them. The backend plans against the device's limits, and against
 * what its compiler keeps of the grid field's exact arithmetic: a check (grid/canary.js) that
 * starts here and is not waited for; `backend.gridCheck` settles when it is done, and runOnGpu
 * waits for it when the layout has a grid stage.
 */
export async function createWebGPUBackend(options = {}) {
  const device = options.device || await requestDevice(LIMIT_NAMES);
  if (!device) return null;
  const state = watchDevice(device);
  const limits = {};
  for (const name of LIMIT_NAMES) limits[name] = device.limits[name];
  const forced = options.gridArithmetic;
  limits.gridArithmetic = forced && !forced.then ? forced : GRID_CHECK_PENDING;
  const gridCheck = Promise.resolve(forced || gridArithmetic(device)).then(result => { limits.gridArithmetic = result; return result; });
  // For tests and measurements: `gridArithmetic` stands for the grid's check of the device
  // ({sums, residual, reason}, or a promise of it), `generic: true` runs the stock step with the
  // generic engine too, `smallGraph` moves N* (one kernel and exact pairs up to it),
  // `pairEstimate` scales the pair formulas' expected work (below 1 their guard halts steps it did
  // not plan for), `slowdown` stands for the speed probe's factor (device.js), `renumber: false`
  // keeps large layouts in the store's row order on the device
  return Object.assign(createCapabilities(limits, { generic: !!options.generic, smallGraph: options.smallGraph, renumber: options.renumber, lost: () => !!state.lost }),
    { device, pairEstimate: options.pairEstimate || 1, slowdown: options.slowdown || 0, gridCheck });
}
