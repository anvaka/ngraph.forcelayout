// plan() verdicts for WebGPU without a device: the lowering table, the words of the refusals, the
// small and grid templates by size and profile, literal checks and budgets.
//
//   node modules/gpu/test/check.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { gpuCapabilities, SPEC_LIMITS } from '../index.js';
import { lower } from '../check.js';
import { GUARD } from '../schedule.js';

const require = createRequire(import.meta.url);
const createLayout = require('../../../index.js');
const createGraph = require('ngraph.graph');

// The limits of the Mac this was built on: 10 storage buffers, 1,024 threads per workgroup
const WIDE = { maxStorageBuffersPerShaderStage: 10, maxComputeInvocationsPerWorkgroup: 1024, maxComputeWorkgroupSizeX: 1024, maxComputeWorkgroupStorageSize: 32768 };

function layoutOf(n, settings) {
  const graph = createGraph();
  for (let i = 1; i < n; i++) graph.addLink(i, Math.floor(i / 2));
  return createLayout(graph, settings);
}

function reasons(layout, limits) {
  return layout.simulator.plan(gpuCapabilities(limits)).reasons;
}

test('the stock step runs, on the small engine when it fits one workgroup', () => {
  const small = layoutOf(500);
  assert.deepEqual(reasons(small), []);
  const lowering = lower(small.simulator.program(), small.simulator, Object.assign({}, SPEC_LIMITS, WIDE));
  assert.equal(lowering.plan.template, 'small');
  assert.equal(lower(small.simulator.program(), small.simulator, SPEC_LIMITS).plan.template, 'grid', '256 threads: too few for 500 bodies');
  const big = layoutOf(3000, { integrator: 'fire' });
  const plan = big.simulator.plan(gpuCapabilities(WIDE));
  assert.ok(plan.runs);
  assert.match(plan.stages.find(s => s.stage === 'repulsion').how, /grid pyramid/);
  assert.match(plan.stages.find(s => s.stage === 'integrate').how, /FIRE/);
});

test('what does not run yet is named', () => {
  const layout = layoutOf(50, { dimensions: 3 });
  assert.deepEqual(reasons(layout), ['WebGPU does not run 3D layouts yet']);

  const sim = layoutOf(50).simulator;
  sim.addNodeFormula('pull', { formula: 'force += -0.01 * pos' });
  sim.addLinkFormula('springy', { formula: 'pull = coefficient * (r - length)', replace: 'springs' });
  sim.addPairFormula('apart', { radius: 5, formula: 'push = 1' });
  sim.addSum('total', { formula: 'mass' });
  sim.addRepulsion('more', { law: 'r^-1' });
  sim.addHostStep('look', { run: () => {}, when: 'step == 3' });
  sim.addStage('js', () => {});
  sim.addPairRule('rule', { radius: 1, rule: () => 0 });
  const plan = sim.plan(gpuCapabilities());
  const words = Object.fromEntries(plan.stages.filter(s => !s.runs).map(s => [s.stage, s.reason]));
  assert.deepEqual(words, {
    pull: 'WebGPU does not run node formulas yet',
    springy: 'WebGPU does not run link formulas yet',
    apart: 'WebGPU does not run pair formulas yet',
    total: 'WebGPU does not run sums yet',
    more: 'WebGPU does not run extra repulsion passes (addRepulsion) yet',
    look: 'WebGPU does not run host steps yet',
    js: 'JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)',
    pairRules: 'pair rules are JavaScript and run on the CPU only (pair formulas do the same on every engine)',
  });
  assert.ok(plan.reasons.indexOf('pull: WebGPU does not run node formulas yet') >= 0);
});

test('laws: tables and JS functions, f32 literals and values, 16 numbers', () => {
  const sim = layoutOf(50).simulator;
  const verdict = () => sim.plan(gpuCapabilities()).stages.find(s => s.stage === 'repulsion');
  sim.repulsionLaw({ force: 'T(r) / r^2', tables: { T: { from: 0, to: 4, values: [1, 0.5, 0] } } });
  assert.equal(verdict().reason, 'WebGPU does not run laws with lookup tables yet');
  sim.repulsionLaw({ force: 'K(r) / r', functions: { K: { value: Math.cos } } });
  assert.equal(verdict().reason, 'laws with JavaScript functions run on the CPU only');
  sim.repulsionLaw('1e300 / r^2');
  assert.equal(verdict().reason, 'the law: the number 1e+300 does not fit a 32-bit float');
  sim.repulsionLaw({ force: 'exp(-r / L) / r^2', params: { L: () => Infinity } });
  assert.equal(verdict().reason, "the law's L is Infinity, which does not fit a 32-bit float");
  sim.repulsionLaw({ force: 'L * exp(-r) / r^2', params: { L: 1e-41 } });
  assert.ok(verdict().runs);
  assert.ok(sim.plan(gpuCapabilities()).warnings.some(w => /L is 1e-41, below 1.18e-38/.test(w)));
  const params = {};
  let force = '0';
  for (let i = 0; i < 17; i++) { params['a' + i] = i + 1; force += ' + a' + i + ' / r'; }
  sim.repulsionLaw({ force, params });
  assert.match(verdict().reason, /up to 16 numbers/);
  sim.repulsionLaw({ force: 'exp(-r / L) / r^2', params: { L: c => 2 * c.springLength() } });
  assert.ok(verdict().runs);
  sim.repulsionLaw(null);
  assert.ok(verdict().runs);
});

test('charges, inertia, adaptive step, per-link springs, the shape of the step', () => {
  const charged = createLayout(layoutOf(20).graph, { nodeCharge: () => 2 });
  assert.match(reasons(charged)[0], /charge or sensitivity columns other than the mass/);

  const sim = layoutOf(20).simulator;
  sim.store.define('calm', Float64Array, 1, 1);
  sim.inertia('calm');
  assert.deepEqual(reasons({ simulator: sim }), ['integrate: WebGPU divides forces by the mass only for now (inertia: calm)']);
  sim.inertia('mass');
  sim.adaptiveTimeStepWeight(0.1);
  assert.deepEqual(reasons({ simulator: sim }), ['integrate: WebGPU has no adaptive time step']);
  sim.adaptiveTimeStepWeight(0);
  sim.springs[3].length = 30;
  assert.deepEqual(reasons({ simulator: sim }), ['springs: WebGPU does not run links with their own length or stiffness yet']);
  sim.springs[3].length = -1;
  sim.springs[4].coefficient = 2;
  assert.deepEqual(reasons({ simulator: sim }), ['springs: WebGPU does not run links with their own length or stiffness yet']);
  sim.springs[4].coefficient = -1;
  assert.deepEqual(reasons({ simulator: sim }), []);

  const drag = sim.getStage('drag');
  sim.replaceStage('drag', () => {});
  assert.deepEqual(reasons({ simulator: sim }), ['drag: JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)']);
  sim.replaceStage('drag', drag);
  sim.removeStage('drag');
  assert.deepEqual(reasons({ simulator: sim }), ['WebGPU runs the whole built in step only for now; this step has no drag']);

  const other = layoutOf(20).simulator;
  other.gravity(1e300);
  assert.deepEqual(reasons({ simulator: other }), ['the setting gravity: the number 1e+300 does not fit a 32-bit float']);
});

test("the guard stage runs; 'step' listeners are a warning", () => {
  const layout = layoutOf(20);
  layout.simulator.addStage(GUARD, () => {}, { before: 'clear', describe: { shape: 'guard', how: 'guards' } });
  layout.on('step', () => {});
  const plan = layout.simulator.plan(gpuCapabilities());
  assert.ok(plan.runs);
  assert.deepEqual(plan.warnings, ["'step' listeners run once per readback from the GPU, not after every step"]);
  // a stage of that name that is not the guard is a stage like any other
  const other = layoutOf(20);
  other.simulator.addStage(GUARD, () => {});
  assert.ok(!other.simulator.plan(gpuCapabilities()).runs);
});

test('budgets: storage buffers per kernel, buffer sizes, bodies per dispatch', () => {
  const layout = layoutOf(5000);
  assert.deepEqual(reasons(layout, { maxStorageBuffersPerShaderStage: 7 }), [
    'kernel ORDER needs 8 storage buffers; this device allows 7',
    'kernel FORCE needs 8 storage buffers; this device allows 7',
  ]);
  assert.deepEqual(reasons(layout, { maxBufferSize: 65536 }).filter(r => /vel/.test(r)), ['the buffer vel needs 0.2 MiB; this device allows 0.1 MiB per buffer']);
  assert.match(reasons(layout, { maxComputeWorkgroupsPerDimension: 16 })[0], /up to 4,096 bodies/);
  // the default limits take a million bodies
  assert.ok(lower({ ...layout.simulator.program(), spaces: { nodes: 1e6, links: 1.25e6 } }, layout.simulator, SPEC_LIMITS).runs);
});

test('plan() and the runner use the same lowering', () => {
  const layout = layoutOf(300);
  const backend = gpuCapabilities(WIDE);
  const program = layout.simulator.program();
  const lowering = backend.lower(program, layout.simulator);
  assert.ok(lowering.runs && lowering.plan.template === 'small');
  layout.simulator.addNodeFormula('pull', { formula: 'force += -0.01 * pos' });
  const refused = backend.lower(layout.simulator.program(), layout.simulator);
  assert.equal(refused.plan, null);
  assert.equal(refused.runs, false);
});
