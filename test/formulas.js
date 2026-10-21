var test = require('tap').test;
var formula = require('../lib/formula');
var createRepulsionLaw = require('../lib/repulsionLaw');
var createSimulator = require('../lib/createPhysicsSimulator');
var createGraph = require('ngraph.graph');
var createLayout = require('..');

// A simulator with `count` bodies at random spots, a few on the same spot, linked in a chain
function makeSimulator(settings, count) {
  var random = require('ngraph.random').random(11);
  var sim = createSimulator(settings);
  var D = sim.settings.dimensions;
  var bodies = [];
  for (var i = 0; i < count; ++i) {
    var pos = {};
    for (var k = 0; k < D; ++k) pos['xyz'[k] || 'c' + (k + 1)] = i < 3 ? 1 : random.nextDouble() * 20;
    bodies.push(sim.addBodyAt(pos));
    if (i > 0 && i % 4) sim.addSpring(bodies[i - 1], bodies[i]);
  }
  for (i = 0; i < count; ++i) sim.store.mass[i] = 1 + (i % 3);
  return sim;
}

function sameNumbers(t, a, b, what) {
  var same = a.length === b.length;
  for (var i = 0; same && i < a.length; ++i) same = Object.is(a[i], b[i]);
  t.ok(same, what);
}

function positions(sim) {
  return Array.from(sim.store.pos.subarray(0, sim.store.n * sim.settings.dimensions));
}

test('settings win over the adaptive time step counters', function (t) {
  var sim = makeSimulator({ dimensions: 2, springLength: 7 }, 3);
  sim.store.define('out');
  sim.addNodeFormula('f', { formula: 'out = springLength' });
  sim.step();
  t.equal(sim.store.out[0], 7, 'springLength is the setting');
  sim.store.define('step');
  t.throws(function () { sim.addNodeFormula('g', { formula: 'out = step' }); }, /both a column and a built in value/);
  t.end();
});

test('formulas parse with the usual precedence', function (t) {
  var tree = formula.parse('-r^2 + a * b < c && !(d >= 1) || e == f ? 1 : 2');
  t.equal(tree.type, 'call', '?: is a choice');
  t.equal(tree.name, 'select');
  t.equal(tree.args[0].op, '||', '|| binds loosest');
  t.equal(formula.parse('-r^2').type, 'neg', 'minus applies after the power');
  t.equal(formula.parse('a === b').op, '==', '=== reads as ==');
  t.equal(formula.parse('round(x)').name, 'floor', 'round rounds halves up everywhere');
  t.equal(formula.parse('clamp(x, 0, 1)').name, 'min');
  var program = formula.parseProgram('w = 2; // a comment\n w += 1; w * r');
  t.equal(program.length, 3);
  t.equal(program[1].op, '+=');
  t.equal(program[2].target, null, 'a bare expression ends the formula');
  t.throws(function () { formula.parse('a < b < c'); }, /chained/, 'comparisons do not chain');
  t.throws(function () { formula.parse('a +'); }, /ends too early/);
  t.end();
});

test('formulas check types and names', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 4);
  function add(text) { sim.addNodeFormula('f' + Math.random(), { formula: text, params: { k: 1 } }); }
  t.throws(function () { add('force += mass < 1'); }, /condition is used as a number/);
  t.throws(function () { add('mass = mass < 1'); }, /condition is used as a number/);
  add('light = mass < 2 && pinned == 0; mass = light ? 2 : mass');
  sim.step();
  t.same([sim.store.mass[0], sim.store.mass[1], sim.store.mass[2]], [2, 2, 3], 'a named value can hold a condition');
  t.throws(function () { add('force += mass'); }, /vector but gets a number/);
  t.throws(function () { add('mass = pos * pos'); }, /cannot be multiplied/);
  t.throws(function () { add('w = mass; force += pos'); }, /never used/);
  t.throws(function () { add('force += nope * pos'); }, /Unknown name nope/);
  t.throws(function () { add('k = 2'); }, /cannot be assigned/);
  t.throws(function () { add('force += pos[1]'); }, /cannot be indexed/);
  t.throws(function () { add('mass = sqrt(pos)'); }, /vector is used as a number/);
  t.throws(function () {
    sim.addNodeFormula('bad', { formula: 'mass = 1', params: { mass: 2 } });
  }, /name of a column/, 'params cannot hide columns');
  t.throws(function () {
    sim.addPairFormula('one-sided', { radius: 1, symmetric: false, formula: 'mass_j += 1' });
  }, /cannot be assigned/, 'a one-sided pair formula only adds into body i');
  t.throws(function () {
    sim.addPairFormula('accumulate', { radius: 1, formula: 'mass_i = 1' });
  }, /only be changed with \+= or -=/);
  t.end();
});

test('the stock spring written as a link formula gives the same numbers', function (t) {
  [2, 3].forEach(function (D) {
    [0, 0.3].forEach(function (adaptiveTimeStepWeight) {
      var settings = { dimensions: D, adaptiveTimeStepWeight: adaptiveTimeStepWeight };
      var stock = makeSimulator(settings, 40);
      var formulaSim = makeSimulator(settings, 40);
      formulaSim.springs[3].length = 7;
      stock.springs[3].length = 7;
      formulaSim.springs[5].coefficient = 0.2;
      stock.springs[5].coefficient = 0.2;
      formulaSim.addLinkFormula('springs-formula', { replace: 'springs', formula: 'pull = coefficient * (r - length)' });
      t.notOk(formulaSim.stages().indexOf('springs') >= 0, 'the formula takes the place of the springs');
      for (var i = 0; i < 30; ++i) { stock.step(); formulaSim.step(); }
      sameNumbers(t, positions(stock), positions(formulaSim), D + 'D, adaptive weight ' + adaptiveTimeStepWeight);
      formulaSim.removeStage('springs-formula');
      t.ok(formulaSim.stages().indexOf('springs') >= 0, 'removing the formula brings the springs back');
    });
  });
  t.end();
});

test('a pair formula gives the numbers of the same pair rule', function (t) {
  [true, false].forEach(function (symmetric) {
    var rule = makeSimulator({ dimensions: 2 }, 60);
    var pair = makeSimulator({ dimensions: 2 }, 60);
    rule.store.define('stiff');
    pair.store.define('stiff');
    var h = 6, c = 3;
    rule.addPairRule('crowd', {
      radius: h,
      symmetric: symmetric,
      rule: function (i, j, r, store) {
        var w = c * (1 / store.mass[i] + 1 / store.mass[j]);
        store.stiff[i] += w;
        if (symmetric) store.stiff[j] += w;
        return w * 2 * (1 - r / h) / h / (r || 1);
      }
    });
    rule.addStage('zero', function (store) { store.stiff.fill(0); }, { before: 'pairRules' });
    pair.addPairFormula('crowd', {
      radius: 'h',
      symmetric: symmetric,
      params: { h: h, c: function () { return c; } },
      formula: 'w = c * (1 / mass_i + 1 / mass_j); stiff_i += w; ' + (symmetric ? 'stiff_j += w; ' : '') + 'push = w * 2 * (1 - r / h) / h'
    });
    for (var i = 0; i < 20; ++i) { rule.step(); pair.step(); }
    sameNumbers(t, positions(rule), positions(pair), 'positions, ' + (symmetric ? 'symmetric' : 'one-sided'));
    sameNumbers(t, rule.store.stiff, pair.store.stiff, 'added up column, ' + (symmetric ? 'symmetric' : 'one-sided'));
  });
  t.end();
});

test('a pair formula with radius 0 does nothing, but still zeroes what it adds into', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 10);
  sim.store.define('count');
  var radius = 100;
  sim.addPairFormula('count', { radius: function () { return radius; }, formula: 'count_i += 1; count_j += 1' });
  sim.step();
  t.equal(sim.store.count[5], 9, 'every other body is close');
  sim.step();
  t.equal(sim.store.count[5], 9, 'the column starts each step at 0');
  radius = 0;
  sim.step();
  t.equal(sim.store.count[5], 0, 'no pairs, no counts');
  t.end();
});

test('node formulas and sums do what JS stages do', function (t) {
  [2, 3].forEach(function (D) {
    var js = makeSimulator({ dimensions: D }, 30);
    var formulaSim = makeSimulator({ dimensions: D }, 30);
    var k = 0.05;
    js.addStage('pull', function (store) {
      var center = new Float64Array(D), total = 0;
      for (var i = 0; i < store.n; ++i) {
        total += store.mass[i];
        for (var a = 0; a < D; ++a) center[a] += store.mass[i] * store.pos[i * D + a];
      }
      for (i = 0; i < store.n; ++i) {
        for (a = 0; a < D; ++a) store.force[i * D + a] += -k * store.mass[i] * (store.pos[i * D + a] - center[a] / total);
      }
    });
    formulaSim.addSum('total', { formula: 'mass' });
    formulaSim.addSum('weighted', { formula: 'mass * pos' });
    formulaSim.addNodeFormula('pull', { formula: 'force += -k * mass * (pos - weighted / total)', params: { k: k } });
    for (var i = 0; i < 20; ++i) { js.step(); formulaSim.step(); }
    sameNumbers(t, positions(js), positions(formulaSim), D + 'D pull to the center');
    t.equal(formulaSim.sums().weighted.width, D, 'a sum of vectors has D numbers');
  });
  t.end();
});

test('sums per group, min and max, and over links', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 12);
  sim.store.define('group', Int32Array);
  for (var i = 0; i < 12; ++i) sim.store.group[i] = i % 3 === 2 ? -1 : i % 3;
  sim.addSum('massOf', { formula: 'mass', group: 'group' });
  sim.addSum('heaviest', { formula: 'mass', reduce: 'max' });
  sim.addSum('shortest', { formula: 'r', over: 'links', reduce: 'min' });
  sim.store.define('share');
  sim.addNodeFormula('share', { formula: 'share = group >= 0 ? mass / massOf[group] : massOf[group]' });
  sim.step();
  var sums = sim.sums();
  t.equal(sums.massOf.count, 2, 'groups 0 and 1; -1 is left out');
  t.equal(sums.massOf.groups[0], 4 * 1, 'group 0 holds masses of rows 0, 3, 6, 9');
  t.equal(sums.massOf.groups[1], 4 * 2, 'group 1 holds masses of rows 1, 4, 7, 10');
  t.equal(sums.heaviest.value[0], 3);
  t.equal(sum(sim.store.share.subarray(0, 12)), 2, 'shares of each group add up to 1; a body outside reads 0');
  t.ok(sums.shortest.value[0] >= 0 && sums.shortest.value[0] < 30, 'shortest link');
  t.throws(function () { sim.addSum('massOf', { formula: 'mass' }); }, /already added/);
  sim.removeStage('massOf');
  t.notOk(sim.sums().massOf, 'removing the stage removes the sum');
  t.throws(function () { sim.step(); }, /reads the sum massOf, which is gone/);
  t.end();

  function sum(array) { return array.reduce(function (a, b) { return a + b; }, 0); }
});

test('another repulsion pass with the same law doubles the push', function (t) {
  ['quadtree', 'dualtree'].forEach(function (nbody) {
    var sim = makeSimulator({ dimensions: 2, nbody: nbody }, 50);
    // bodies on the same spot get random nudges, different in each tree
    sim.store.pos[2] = 2;
    sim.store.pos[5] = 3;
    ['drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
    sim.step();
    var once = Array.from(sim.store.force.subarray(0, 100));
    sim.addRepulsion('again', { law: 'r^-2' });
    sim.step();
    var twice = Array.from(sim.store.force.subarray(0, 100));
    sameNumbers(t, twice, once.map(function (f) { return 2 * f; }), nbody);
  });
  var sim = makeSimulator({ dimensions: 2 }, 20);
  sim.store.define('feels');
  sim.store.feels.fill(1);
  sim.store.feels[4] = 0;
  ['repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
  sim.addRepulsion('fading', { law: { force: 'exp(-r / L) / r^2', params: { L: 3 } }, sensitivity: 'feels' });
  sim.step();
  t.equal(sim.store.force[8], 0, 'a body with sensitivity 0 is not pushed');
  t.ok(sim.store.force[10] !== 0, 'others are');
  t.equal(sim.plan().stages[1].shape, 'tree');
  t.end();
});

test('laws: named values, conditions, tables and built in values', function (t) {
  var r = 2.5, D = 2;
  function kernel(spec) {
    var law = createRepulsionLaw(spec);
    law.update({ settings: { dimensions: D, timeStep: 0.5, springLength: 10 }, unit: function () { return 10; }, iteration: function () { return 0; }, store: { n: 1 } });
    var code = law.prologue('values') + ' var k1, k2; ' + law.emit(D, 'r', 'k1', 'k2') + ' return [k1, k2];';
    return new Function('values', 'lawFunctions', 'r', code)(law.values, law.functions, r);
  }
  t.same(kernel({ force: 'u = r / L; exp(-u) / r^2', params: { L: 3 } }), kernel({ force: 'exp(-r / L) / r^2', params: { L: 3 } }), 'a named value is the same as writing it out');
  t.same(kernel({ force: 'unit / r^2' }), kernel({ force: 'L / r^2', params: { L: 10 } }), 'built in values are read every step');
  var near = kernel({ force: 'r < L ? 1 / r^2 : 0', params: { L: 3 } });
  t.same(near, kernel('r^-2'), 'a condition picks a branch, with its derivative');
  t.same(kernel({ force: 'r < L ? 1 / r^2 : 0', params: { L: 2 } }), [0, 0], 'the other branch');
  var values = [];
  for (var i = 0; i <= 64; ++i) values.push(Math.exp(-i / 16));
  var table = kernel({ force: 'T(r) / r^2', tables: { T: { from: 0, to: 4, values: values } } });
  var exact = kernel({ force: 'exp(-r) / r^2' });
  t.ok(Math.abs(table[0] - exact[0]) < 1e-4 && Math.abs(table[1] - exact[1]) < 1e-2, 'a table follows the function it samples, and its slope');
  t.throws(function () { createRepulsionLaw({ force: 'T(r)', tables: { T: { from: 0, to: 1, values: [1, 0] } } }).emitWGSL(2, 'r', 'k1', 'k2'); }, /tables/);
  t.throws(function () { createRepulsionLaw('r < 1'); }, /not a condition/);
  t.throws(function () { createRepulsionLaw('u = r; 1 / r^2'); }, /never used/);
  t.end();
});

test('formula tables interpolate and keep the end values outside', function (t) {
  var table = formula.createTable('T', { from: 1, to: 3, values: [10, 20, 40] });
  t.equal(table.value(0), 10);
  t.equal(table.value(1.5), 15);
  t.equal(table.value(2.5), 30);
  t.equal(table.value(5), 40);
  t.equal(table.derivative(2.5), 20, 'slope of the segment');
  t.equal(table.derivative(5), 0, 'flat outside');
  var sim = makeSimulator({ dimensions: 2 }, 5);
  sim.store.define('looked');
  sim.addNodeFormula('look', { formula: 'looked = T(mass)', tables: { T: { from: 1, to: 3, values: [10, 20, 40] } } });
  sim.step();
  t.same(Array.from(sim.store.looked.subarray(0, 3)), [10, 20, 40]);
  t.end();
});

test('plan() names what a backend cannot run', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 5);
  sim.addStage('custom', function () {});
  sim.addNodeFormula('calm', { formula: 'force *= 0.5' });
  var cpu = sim.plan();
  t.ok(cpu.runs, 'the CPU runs everything');
  t.equal(cpu.stages.filter(function (s) { return s.shape === 'js'; }).length, 1);
  var plan = sim.plan({
    name: 'formulas only',
    check: function (description) {
      return description.shape === 'js' ? { runs: false, reason: 'JavaScript runs on the CPU only' } : { runs: true, how: 'compiled' };
    },
    checkSettings: function () { return []; }
  });
  t.notOk(plan.runs);
  t.same(plan.reasons, ['custom: JavaScript runs on the CPU only']);
  t.end();
});

test('layouts can use formulas', function (t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(2, 3);
  graph.addLink(3, 1);
  var layout = createLayout(graph);
  layout.simulator.addLinkFormula('soft', { replace: 'springs', formula: 'pull = 0.5 * coefficient * (r - length)' });
  for (var i = 0; i < 50; ++i) layout.step();
  var rect = layout.getGraphRect();
  t.ok(Number.isFinite(rect.min_x) && rect.max_x > rect.min_x, 'the graph spreads');
  t.end();
});

test('vectors: dot, length, choices and scaling', function (t) {
  var sim = makeSimulator({ dimensions: 3 }, 6);
  ['clear', 'repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
  sim.store.define('size');
  sim.store.define('flat');
  sim.store.define('kick', Float64Array, 3);
  sim.addNodeFormula('vectors', {
    formula: [
      'size = length(pos)',
      'flat = dot(pos, pos) - size^2',
      'v = size > 10 ? -pos : pos * 2',
      'v /= 2',
      'kick = v',
      'kick *= 3'
    ].join('; ')
  });
  sim.step();
  var pos = sim.store.pos, size = sim.store.size, kick = sim.store.kick;
  for (var i = 0; i < 6; ++i) {
    var p = [pos[3 * i], pos[3 * i + 1], pos[3 * i + 2]];
    var expected = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
    t.ok(Math.abs(size[i] - expected) < 1e-12, 'length of body ' + i);
    t.ok(Math.abs(sim.store.flat[i]) < 1e-9, 'dot(pos, pos) is length^2');
    var scale = expected > 10 ? -1.5 : 3;
    t.ok(Math.abs(kick[3 * i + 2] - scale * p[2]) < 1e-12, 'choice between vectors, then scaled');
  }
  t.throws(function () { sim.addNodeFormula('bad', { formula: 'kick += 1' }); }, /vector but gets a number/);
  t.throws(function () { sim.addNodeFormula('bad2', { formula: 'size = 1 / pos' }); }, /divide by a vector/);
  t.throws(function () { sim.addNodeFormula('bad3', { formula: 'size = pos > 1 ? 1 : 0' }); }, /vector is used as a number/);
  t.end();
});

test('formula errors name the stage', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 3);
  t.throws(function () { sim.addNodeFormula('mine', { formula: 'mass = nothing' }); }, /^mine: Unknown name nothing/);
  t.throws(function () { sim.addNodeFormula('empty', { formula: ' ; ' }); }, /empty/);
  t.throws(function () { sim.addNodeFormula('noFormula', {}); }, /needs a `formula`/);
  t.throws(function () { sim.addPairFormula('noRadius', { formula: 'push = 1' }); }, /needs a radius/);
  t.throws(function () { sim.addSum('nothing', { formula: 'mass = 1' }); }, /mass cannot be assigned/, 'sums only read');
  t.throws(function () { sim.addSum('badReduce', { formula: 'mass', reduce: 'mean' }); }, /sum, min or max/);
  t.throws(function () { sim.addSum('badOver', { formula: 'mass', over: 'pairs' }); }, /over nodes or links/);
  t.throws(function () { sim.addSum('badGroup', { formula: 'mass', group: 'nope' }); }, /no body column named nope/);
  t.throws(function () { sim.addStage('x', function () {}, { replace: 'nope' }); }, /No stage named nope/);
  t.end();
});

test('link formulas read and write link columns and add into both ends', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 8);
  sim.springStore.define('seen');
  sim.store.define('linkCount');
  sim.addLinkFormula('count', { formula: 'seen = seen + 1; linkCount_i += 1; linkCount_j += 1; pull = 0' });
  sim.step();
  sim.step();
  t.equal(sim.springStore.seen[0], 2, 'link columns keep their values');
  for (var i = 0; i < sim.store.n; ++i) t.equal(sim.store.linkCount[i], sim.store.degree[i], 'counts start at 0 every pass');
  sim.addSum('links', { formula: '1', over: 'links' });
  sim.addSum('total', { formula: 'linkCount' });
  sim.step();
  t.equal(sim.sums().total.value[0], 2 * sim.sums().links.value[0], 'each link has two ends');
  t.end();
});
