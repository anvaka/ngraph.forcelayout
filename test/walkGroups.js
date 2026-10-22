var test = require('tap').test;
var createSimulator = require('../lib/createPhysicsSimulator');
var generateQuadTree = require('../lib/codeGenerators/generateQuadTree');

// The stock repulsion and addRepulsion passes next to it walk one tree with a charge each
function makeSimulator(settings, count) {
  var random = require('ngraph.random').random(5);
  var sim = createSimulator(settings);
  var D = sim.settings.dimensions;
  for (var i = 0; i < count; ++i) {
    var pos = {};
    for (var k = 0; k < D; ++k) pos['xyz'[k]] = random.nextDouble() * 50;
    sim.addBodyAt(pos);
  }
  sim.store.define('core');
  sim.store.define('signed');
  for (i = 0; i < count; ++i) {
    sim.store.mass[i] = 1 + (i % 3);
    sim.store.core[i] = i % 4 ? sim.store.mass[i] : 0;
    sim.store.signed[i] = i % 2 ? 1 : -0.5;
  }
  ['drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
  return sim;
}

var fading = { force: 'exp(-r / L) / r^2', params: { L: 10 }, range: '4 * L' };

function addPasses(sim, options) {
  options = options || {};
  sim.repulsionLaw(fading);
  sim.addRepulsion('core', { after: options.after || 'repulsion', charge: 'core', centroid: 'shared' });
  sim.addRepulsion('signed', { after: 'core', charge: 'mass', sensitivity: 'signed', law: { force: 'r^-1' } });
}

function forces(sim) {
  sim.step();
  return Array.from(sim.store.force.subarray(0, sim.store.n * sim.settings.dimensions));
}

function relativeDifference(a, b) {
  var x = 0, y = 0;
  for (var k = 0; k < a.length; ++k) {
    x += Math.pow(a[k] - b[k], 2);
    y += b[k] * b[k];
  }
  return Math.sqrt(x / y);
}

test('passes next to the repulsion walk with it, and give what separate walks give', function (t) {
  ['quadtree', 'dualtree'].forEach(function (nbody) {
    [2, 3].forEach(function (dimensions) {
      // At theta 0 every walk is the exact sum
      var together = makeSimulator({ dimensions: dimensions, nbody: nbody, theta: 0 }, 120);
      addPasses(together);
      var apart = makeSimulator({ dimensions: dimensions, nbody: nbody, theta: 0 }, 120);
      apart.addStage('between', function () {}, { after: 'repulsion' });
      addPasses(apart, { after: 'between' });
      apart.addStage('between2', function () {}, { after: 'core' });
      var a = forces(together), b = forces(apart);
      var error = relativeDifference(a, b);
      t.ok(error < 1e-12, nbody + ', ' + dimensions + 'D: ' + error);
      var walk = together.program().stages[1].args.walk;
      t.same(walk, { stages: ['repulsion', 'core', 'signed'], index: 0, charges: 3, tree: 'quadtree' }, 'one quad tree walk');
      t.same(apart.program().stages[1].args.walk.charges, 1, 'apart: alone');
    });
  });
  t.end();
});

test('program() and plan() say who walks with whom, and on which tree', function (t) {
  var sim = makeSimulator({ dimensions: 2, nbody: 'dualtree' }, 30);
  t.same(sim.program().stages[1].args.walk, { stages: ['repulsion'], index: 0, charges: 1, tree: 'dualtree' }, 'the repulsion alone keeps the dual tree');
  addPasses(sim);
  var program = sim.program();
  var core = program.stages[2];
  t.same(core.args.walk, { stages: ['repulsion', 'core', 'signed'], index: 1, charges: 3, tree: 'quadtree' });
  t.equal(core.args.channels[0].centroid, 'shared');
  t.equal(program.stages[3].args.channels[0].centroid, 'own');
  var plan = sim.plan();
  t.equal(plan.stages[1].how, 'one quad tree walk with 3 charges: repulsion, core, signed');
  t.equal(plan.stages[2].how, 'in the walk of repulsion');
  t.throws(function () { sim.addRepulsion('bad', { centroid: 'middle' }); }, /unknown centroid middle/);
  t.end();
});

test('a gated, replaced or separated stage walks alone', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 30);
  addPasses(sim);
  sim.addRepulsion('late', { after: 'signed', law: 'r^-2', when: 'step > 100' });
  var walk = sim.program().stages[1].args.walk;
  t.same(walk.stages, ['repulsion', 'core', 'signed'], 'a gated pass is not in the walk');
  var stock = sim.replaceStage('repulsion', function () {});
  t.same(sim.program().stages[2].args.walk.stages, ['core', 'signed'], 'the passes walk without a replaced repulsion');
  sim.replaceStage('repulsion', stock);
  t.same(sim.program().stages[2].args.walk.stages, ['repulsion', 'core', 'signed'], 'and with it again');
  sim.removeStage('core');
  t.same(sim.program().stages[1].args.walk.stages, ['repulsion', 'signed'], 'a removed pass leaves the walk');
  sim.removeStage('signed');
  t.equal(sim.program().stages[1].args.walk.charges, 1, 'the repulsion alone');
  t.end();
});

test('bodies that feel none of the charges are not pushed', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 30);
  sim.store.define('feels');
  sim.store.feels.fill(1);
  sim.store.feels[4] = 0;
  sim.repulsionSensitivity('feels');
  sim.addRepulsion('core', { after: 'repulsion', charge: 'core', sensitivity: 'feels' });
  var f = forces(sim);
  t.same([f[8], f[9]], [0, 0], 'body 4');
  t.ok(f[10] !== 0, 'others are pushed');
  t.end();
});

test('with pre-generated trees of one charge every stage walks alone', function (t) {
  generateQuadTree.preGenerated = true;
  try {
    var sim = makeSimulator({ dimensions: 2 }, 30);
    sim.addRepulsion('core', { after: 'repulsion', charge: 'core' });
    t.equal(sim.program().stages[1].args.walk.charges, 1);
    t.ok(forces(sim).every(Number.isFinite), 'and push');
  } finally {
    delete generateQuadTree.preGenerated;
  }
  t.end();
});
