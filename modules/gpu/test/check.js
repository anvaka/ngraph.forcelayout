// plan() verdicts for WebGPU without a device: the lowering table, the words of the refusals, the
// stock template against the generic plan, literal checks and budgets.
//
//   node modules/gpu/test/check.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { gpuCapabilities, SPEC_LIMITS } from '../index.js';
import { lower, createCapabilities, DEVICE_LOST } from '../check.js';
import { GUARD } from '../program.js';

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

function planOf(layout, limits = SPEC_LIMITS) {
  return lower(layout.simulator.program(), layout.simulator, Object.assign({}, SPEC_LIMITS, limits)).plan;
}

test('the stock step: one kernel up to N*, the grid template above it in 2D', () => {
  const small = layoutOf(500);
  assert.deepEqual(reasons(small), []);
  const plan = planOf(small);
  assert.equal(plan.template, 'generic');
  assert.deepEqual(plan.kernelList.map(k => k.name), ['STEP0']);
  const big = layoutOf(3000, { integrator: 'fire' });
  const verdict = big.simulator.plan(gpuCapabilities(WIDE));
  assert.ok(verdict.runs);
  assert.equal(planOf(big).template, 'grid');
  assert.match(verdict.stages.find(s => s.stage === 'repulsion').how, /grid pyramid/);
  assert.match(verdict.stages.find(s => s.stage === 'integrate').how, /FIRE/);
  // a generic plan on request (tests compare the two), and for the stock step in 3D: the generic
  // pyramid above N*
  const generic = lower(big.simulator.program(), big.simulator, SPEC_LIMITS, { generic: true }).plan;
  assert.equal(generic.template, 'generic');
  assert.equal(generic.regime, 'pyramid');
  const deep = planOf(layoutOf(4000, { dimensions: 3 }));
  assert.equal(deep.regime, 'pyramid');
  assert.ok(Object.keys(deep.kernels()).indexOf('TREE_LOCAL') >= 0);
  assert.match(layoutOf(4000, { dimensions: 3 }).simulator.plan(gpuCapabilities()).stages.find(s => s.stage === 'repulsion').how, /grid pyramid/);
  // in 3D exact pairs stay faster up to 2,560 bodies
  assert.equal(planOf(layoutOf(2500, { dimensions: 3 })).regime, 'pairs');
  assert.equal(planOf(layoutOf(3000, { dimensions: 3 })).regime, 'pyramid');
});

test('node formulas, sums, extra passes, charges, inertia and when run, in any dimension', () => {
  for (const D of [2, 3, 5]) {
    const sim = layoutOf(200, { dimensions: D }).simulator;
    sim.store.define('q', Float64Array, 1, 1);
    sim.store.define('calm', Float64Array, 1, 2);
    sim.repulsionCharge('q');
    sim.inertia('calm');
    sim.addSum('total', { formula: 'mass' });
    sim.addSum('moment', { formula: 'mass * pos' });
    sim.addNodeFormula('pull', { params: { k: c => 0.01 * c.springLength() }, formula: 'force -= k * (pos - moment / total)', when: 'step > 2' });
    sim.addRepulsion('more', { law: { force: 'exp(-r / L) / r^2', params: { L: 3 } }, charge: 'mass', sensitivity: 'q' });
    const plan = sim.plan(gpuCapabilities());
    assert.deepEqual(plan.reasons, [], D + 'D');
    const kernels = planOf({ simulator: sim }).kernelList.map(k => k.name);
    assert.deepEqual(kernels, ['SUMS', 'SUMS_REDUCE', 'STEP2'], D + 'D: sums go first, the rest is one kernel');
  }
});

test('tree passes walk together across stages that only add to the force', () => {
  const sim = layoutOf(200).simulator;
  sim.addRepulsion('far', { law: { force: 'a / r', params: { a: 0.1 } } });
  const walks = () => planOf({ simulator: sim }).sections.filter(s => s.kind === 'pairs').map(s => s.channels.map(c => c.stage.name));
  // drag and springs only add to the force: one walk of two charges
  assert.deepEqual(walks(), [['repulsion', 'far']]);
  sim.addNodeFormula('push', { formula: 'force += 0.1 * axis(0)', before: 'far' });
  assert.deepEqual(walks(), [['repulsion', 'far']]);
  // a stage that scales the force reads what came before it: two walks
  sim.addNodeFormula('calm', { formula: 'force *= 0.5', before: 'far' });
  assert.deepEqual(walks(), [['repulsion'], ['far']]);
});

test('what does not run yet is named', () => {
  const sim = layoutOf(50).simulator;
  sim.store.define('group', Int32Array, 1, 0);
  sim.springStore.define('kind', Int32Array, 1, 0);
  sim.addLinkFormula('springy', { formula: 'pull = coefficient * (r - length)', replace: 'springs' });
  sim.addLinkFormula('pullsAndMarks', { formula: 'coefficient = 1; pull = r' });
  sim.addLinkFormula('writesKind', { formula: 'kind = 2' });
  sim.addPairFormula('apart', { radius: 5, formula: 'push = 1' });
  sim.addSum('perGroup', { formula: 'mass', group: 'group' });
  sim.addSum('overLinks', { formula: 'r', over: 'links' });
  sim.addSum('largest', { formula: 'mass', reduce: 'max' });
  sim.addNodeFormula('table', { formula: 'force += T(mass) * axis(0)', tables: { T: { from: 0, to: 1, values: [0, 1] } } });
  sim.addNodeFormula('readsGroup', { formula: 'force += perGroup[group] * axis(0)' });
  sim.addNodeFormula('writesGroup', { formula: 'group = 2' });
  sim.addHostStep('look', { run: () => {}, when: 'step == 3' });
  sim.addStage('js', () => {});
  sim.addPairRule('rule', { radius: 1, rule: () => 0 });
  const plan = sim.plan(gpuCapabilities());
  const words = Object.fromEntries(plan.stages.filter(s => !s.runs).map(s => [s.stage, s.reason]));
  // host steps run on the host, splitting the batch
  assert.match(plan.stages.find(s => s.stage === 'look').how, /on the host/);
  assert.deepEqual(words, {
    pullsAndMarks: 'WebGPU does not run link formulas that both move bodies and write link columns yet',
    writesKind: 'WebGPU does not run formulas that write the i32 link column kind yet',
    apart: 'WebGPU does not run pair formulas yet',
    // a formula writes the group ids
    perGroup: 'WebGPU runs sums per group only with group ids set by the host',
    overLinks: 'WebGPU does not run sums over links yet',
    largest: 'WebGPU does not run max over bodies yet',
    writesGroup: 'WebGPU does not run formulas that write the i32 column group yet',
    js: 'JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)',
    pairRules: 'pair rules are JavaScript and run on the CPU only (pair formulas do the same on every engine)',
  });
});

test('laws: tables and JS functions, f32 literals and values; the template takes 16 numbers', () => {
  const sim = layoutOf(50).simulator;
  const verdict = () => sim.plan(gpuCapabilities()).stages.find(s => s.stage === 'repulsion');
  sim.repulsionLaw({ force: 'T(r) / r^2', tables: { T: { from: 0, to: 4, values: [1, 0.5, 0] } } });
  assert.ok(verdict().runs);
  assert.match(planOf({ simulator: sim }).kernels().STEP0, /fn table_0\(x: f32\)/);
  sim.repulsionLaw({ force: 'T(r) / r^2', tables: { T: { from: 0, to: 4, values: [1, 1e39, 0] } } });
  assert.equal(verdict().reason, "the law's table T: the number 1e+39 does not fit a 32-bit float");
  sim.repulsionLaw({ force: 'K(r) / r', functions: { K: { value: Math.cos } } });
  assert.equal(verdict().reason, 'laws with JavaScript functions run on the CPU only');
  sim.repulsionLaw('1e300 / r^2');
  assert.equal(verdict().reason, 'the law: the number 1e+300 does not fit a 32-bit float');
  sim.repulsionLaw({ force: 'exp(-r / L) / r^2', params: { L: () => Infinity } });
  assert.equal(verdict().reason, "the law's L is Infinity, which does not fit a 32-bit float");
  sim.repulsionLaw({ force: 'L * exp(-r) / r^2', params: { L: 1e-41 } });
  assert.ok(verdict().runs);
  assert.ok(sim.plan(gpuCapabilities()).warnings.some(w => /L is 1e-41, below 1.18e-38/.test(w)));
  // 17 numbers: too many for the template's uniforms, so a big stock layout runs the generic plan
  const params = {};
  let force = '0';
  for (let i = 0; i < 17; i++) { params['a' + i] = i + 1; force += ' + a' + i + ' / r'; }
  const big = layoutOf(3000);
  big.simulator.repulsionLaw({ force, params });
  assert.deepEqual(reasons(big), []);
  assert.equal(planOf(big).template, 'generic');
});

test('adaptive step, per-link springs, the shape of the step, settings', () => {
  const sim = layoutOf(20).simulator;
  sim.adaptiveTimeStepWeight(0.1);
  assert.deepEqual(reasons({ simulator: sim }), ['springs: WebGPU has no adaptive time step', 'integrate: WebGPU has no adaptive time step']);
  sim.adaptiveTimeStepWeight(0);
  // links with their own length or stiffness run; the springs then read them
  sim.springs[3].length = 30;
  assert.deepEqual(reasons({ simulator: sim }), []);
  assert.ok(planOf({ simulator: sim }).linkColumns.length);
  sim.springs[3].length = -1;
  sim.springs[4].coefficient = 2;
  assert.ok(planOf({ simulator: sim }).linkColumns.coefficient);
  sim.springs[4].coefficient = -1;
  assert.deepEqual(reasons({ simulator: sim }), []);
  assert.equal(planOf({ simulator: sim }).linkColumns.length, undefined);
  // above N* the template runs only while every link has the defaults
  const big = layoutOf(3000);
  assert.equal(planOf(big).template, 'grid');
  big.simulator.springs[10].length = 5;
  assert.equal(planOf(big).template, 'generic');

  const drag = sim.getStage('drag');
  sim.replaceStage('drag', () => {});
  assert.deepEqual(reasons({ simulator: sim }), ['drag: JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)']);
  sim.replaceStage('drag', drag);
  // a step without drag runs as it is
  sim.removeStage('drag');
  assert.deepEqual(reasons({ simulator: sim }), []);
  sim.removeStage('integrate');
  assert.deepEqual(reasons({ simulator: sim }), ['WebGPU needs exactly one integrate stage']);

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

test('budgets: storage buffers, buffer sizes, workgroup memory, bodies', () => {
  const layout = layoutOf(5000);
  assert.deepEqual(reasons(layout, { maxStorageBuffersPerShaderStage: 7 }), [
    'kernel ORDER needs 8 storage buffers; this device allows 7',
    'kernel FORCE needs 8 storage buffers; this device allows 7',
  ]);
  assert.deepEqual(reasons(layout, { maxBufferSize: 65536 }).filter(r => /vel/.test(r)), ['the buffer vel needs 0.2 MiB; this device allows 0.1 MiB per buffer']);
  assert.match(reasons(layout, { maxComputeWorkgroupsPerDimension: 16 })[0], /up to 4,096 bodies/);
  // many charges in 7D: the passes walk with the stock repulsion (only drag and springs, which
  // add to the force, are between), so the tile holds 7 + 11 numbers per body
  const many = layoutOf(100, { dimensions: 7 }).simulator;
  for (let c = 0; c < 10; c++) {
    many.store.define('q' + c, Float64Array, 1, 1);
    many.addRepulsion('pass' + c, { charge: 'q' + c });
  }
  assert.match(reasons({ simulator: many })[0], /workgroup memory \(18 numbers per body\)/);
  // exact pairs go up to 16,384 bodies in 4D and up; 2D and 3D have the pyramid beyond
  assert.match(reasons(layoutOf(17000, { dimensions: 4 }))[0], /in 4D as exact pairs, for up to 16,384 bodies/);
  assert.deepEqual(reasons(layoutOf(17000, { dimensions: 3 })), []);
  assert.deepEqual(reasons(layoutOf(17000)), []);
});

test('plan() and the runner use the same lowering', () => {
  const layout = layoutOf(300);
  const backend = gpuCapabilities(WIDE);
  const lowering = backend.lower(layout.simulator.program(), layout.simulator);
  assert.ok(lowering.runs && lowering.plan.template === 'generic');
  layout.simulator.addPairFormula('apart', { radius: 5, formula: 'push = 1' });
  const refused = backend.lower(layout.simulator.program(), layout.simulator);
  assert.equal(refused.plan, null);
  assert.equal(refused.runs, false);
});

test('a backend whose device was lost runs nothing, and says so', () => {
  let lost = false;
  const backend = createCapabilities(SPEC_LIMITS, { lost: () => lost });
  const layout = layoutOf(300);
  assert.ok(layout.simulator.plan(backend).runs);
  lost = true;
  const plan = layout.simulator.plan(backend);
  assert.equal(plan.runs, false);
  assert.deepEqual(plan.reasons, [DEVICE_LOST]);
  assert.equal(backend.lower(layout.simulator.program(), layout.simulator).plan, null);
});
