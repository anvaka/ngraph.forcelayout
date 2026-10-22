var test = require('tap').test;
var formula = require('../lib/formula');
var createRepulsionLaw = require('../lib/repulsionLaw');
var createSimulator = require('../lib/createPhysicsSimulator');
var createGraph = require('ngraph.graph');
var createLayout = require('..');

// A simulator with `count` bodies at random spots (the first three on one spot), linked in a chain
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

function stageOf(program, name) {
  return program.stages.filter(function (stage) { return stage.name === name; })[0];
}

function sameNumbers(t, a, b, what) {
  var same = a.length === b.length;
  for (var i = 0; same && i < a.length; ++i) same = Object.is(a[i], b[i]);
  t.ok(same, what);
}

test('x_i += in a link formula adds onto earlier forces', function (t) {
  var stock = makeSimulator({ dimensions: 2 }, 12);
  var sim = makeSimulator({ dimensions: 2 }, 12);
  sim.addLinkFormula('nothing', { formula: 'force_i += 0 * pos_i; force_j += axis(0); pull = 0' });
  stock.step();
  sim.step();
  var expected = Array.from(stock.store.force.subarray(0, 24));
  sim.springs.forEach(function (spring) { expected[2 * spring.to.index] += 1; });
  sameNumbers(t, Array.from(sim.store.force.subarray(0, 24)), expected, 'repulsion, drag and springs are kept');
  t.end();
});

test('columns that link and pair formulas add into keep their value unless startAtZero', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 8);
  sim.store.define('ends');
  sim.store.define('fresh');
  sim.addLinkFormula('count', { formula: 'ends_i += 1; ends_j += 1; fresh_i += 1; fresh_j += 1; pull = 0', startAtZero: ['fresh'] });
  sim.step();
  sim.step();
  t.equal(sim.store.ends[1], 2 * sim.store.degree[1], 'without startAtZero the column grows');
  t.equal(sim.store.fresh[1], sim.store.degree[1], 'with it, the column holds this pass');
  var warnings = sim.plan().warnings;
  t.equal(warnings.length, 1, 'plan() warns about a column that only grows');
  t.match(warnings[0], /^ends only grows: count adds into it/);
  sim.addNodeFormula('reset', { formula: 'ends = 0', before: 'count' });
  t.same(sim.plan().warnings, [], 'a stage that sets the column resets it');
  t.end();
});

test('startAtZero, pos and partial sums are checked when the stage is added', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 6);
  sim.store.define('crowd');
  t.throws(function () {
    sim.addPairFormula('a', { radius: 1, formula: 'crowd_i += 1; push = 1', startAtZero: ['force'] });
  }, /cannot zero force/);
  t.throws(function () {
    sim.addPairFormula('b', { radius: 1, formula: 'push = 1', startAtZero: ['crowd'] });
  }, /does not add into/);
  t.throws(function () { sim.addNodeFormula('c', { formula: 'pos += velocity' }); }, /^c: pos is read only/);
  t.throws(function () { sim.addLinkFormula('d', { formula: 'pos_i += 1 * pos_j; pull = 0' }); }, /pos is read only/);
  t.throws(function () {
    sim.addPairFormula('e', { radius: 1, formula: 'crowd_i += 1; crowd_j += 1; push = crowd_j' });
  }, /e reads crowd_j, which it adds into/);
  t.throws(function () { sim.addLinkFormula('f', { formula: 'pull = length(force_i)' }); }, /reads force_i/, 'pull adds into force');
  t.throws(function () {
    sim.addPairFormula('g', { radius: 1, symmetric: false, formula: 'crowd_i += 1; push = crowd_j' });
  }, /reads crowd_j/);
  t.end();
});

test('pairs at exactly r = 0 push nothing and add nothing up', function (t) {
  var sim = createSimulator({ dimensions: 2 });
  sim.addBodyAt({ x: 0, y: 0 });
  sim.addBodyAt({ x: 0, y: 0 });
  sim.addBodyAt({ x: 1, y: 0 });
  ['repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
  sim.store.define('count');
  sim.addPairFormula('touch', { radius: 5, formula: 'count_i += 1; count_j += 1; push = 1', startAtZero: ['count'] });
  sim.step();
  t.same(Array.from(sim.store.count.subarray(0, 3)), [1, 1, 2], 'only the pairs at r = 1 count');
  t.same(Array.from(sim.store.force.subarray(0, 6)), [-1, 0, -1, 0, 2, 0], 'and push');
  t.end();
});

test('program() describes the stock step as plain data', function (t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  graph.addLink(2, 3);
  var layout = createLayout(graph);
  var onStep = function () {};
  layout.on('step', onStep);
  var sim = layout.simulator;
  var program = sim.program();
  t.equal(program.dims, 2);
  t.same(program.spaces, { nodes: 3, links: 2 });
  t.same(program.stages.map(function (stage) { return stage.name + ':' + stage.shape + ':' + stage.builtIn; }),
    ['clear:node:clear', 'repulsion:tree:repulsion', 'drag:node:drag', 'springs:link:springs', 'integrate:integrate:integrate']);
  t.equal(program.settings.inertia, 'mass');
  t.equal(program.settings.integrator, 'euler');
  var columns = {};
  program.columns.nodes.forEach(function (column) { columns[column.name] = column; });
  t.same([columns.pos.width, columns.pos.type, columns.pos.writer], ['D', 'f64', 'engine']);
  t.same([columns.mass.width, columns.mass.writer], [1, 'host']);
  t.equal(columns.pinned.type, 'u8');
  t.ok(columns.springCount.hidden, 'counters of the adaptive time step are hidden');
  var repulsion = stageOf(program, 'repulsion');
  t.same(repulsion.args.channels, [{
    law: { force: 'r^-2', params: [], builtIns: [], range: null, tables: [], functions: [], isDefault: true, key: 'r^-2|||' },
    charge: 'mass', sensitivity: 'mass', centroid: 'own'
  }]);
  t.same(repulsion.args.walk, { stages: ['repulsion'], index: 0, charges: 1, tree: 'quadtree' }, 'the repulsion walks alone');
  t.same(stageOf(program, 'integrate').args.inertia, 'mass');
  t.equal(program.listeners.step, 1, "the layout's step listeners are counted");
  layout.off('step', onStep);
  t.notOk(sim.program().listeners.step, 'and uncounted');
  t.same(JSON.parse(JSON.stringify(program)), program, 'nothing but data');
  t.end();
});

test('program() version grows when the structure changes', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 5);
  var version = sim.program().version;
  function changed(what, fn) {
    fn();
    var now = sim.program().version;
    t.ok(now > version, what);
    version = now;
  }
  sim.springLength(20);
  sim.gravity(-2);
  t.equal(sim.program().version, version, 'not for numbers');
  changed('a stage added', function () { sim.addNodeFormula('n', { formula: 'force *= 0.5' }); });
  changed('a stage removed', function () { sim.removeStage('n'); });
  var stock = sim.getStage('drag');
  changed('a stage replaced', function () { sim.replaceStage('drag', function () {}); });
  changed('and put back', function () { sim.replaceStage('drag', stock); });
  changed('the law', function () { sim.repulsionLaw('r^-1'); });
  changed('the integrator', function () { sim.integrator('fire'); });
  changed('the solver', function () { sim.nbody('dualtree'); });
  changed('adaptive time step on', function () { sim.adaptiveTimeStepWeight(0.2); });
  sim.adaptiveTimeStepWeight(0.3);
  t.equal(sim.program().version, version, 'not for its weight');
  changed('a column', function () { sim.store.define('heavy', Float64Array, 1, 1); });
  changed('the inertia', function () { sim.inertia('heavy'); });
  t.end();
});

test('program() describes formula stages: reads, writes, params, tables, sums', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 6);
  sim.store.define('crowd');
  sim.store.define('scaled');
  sim.addSum('total', { formula: 'mass' });
  sim.addNodeFormula('scale', {
    params: { k: 2, live: function (context) { return context.iteration(); } },
    tables: { T: { from: 0, to: 1, values: [0, 1] } },
    formula: 'scaled = T(mass / total) * k * live * dt; force *= 0.5'
  });
  sim.addPairFormula('crowding', { radius: 'h', params: { h: 3 }, startAtZero: ['crowd'], formula: 'crowd_i += 1; crowd_j += 1; push = mass_i * mass_j' });
  var program = sim.program();
  var scale = stageOf(program, 'scale');
  t.equal(scale.shape, 'node');
  t.equal(scale.space, 'nodes');
  t.same(scale.reads, [{ space: 'nodes', column: 'mass', rows: 'own' }]);
  t.same(scale.writes, [
    { space: 'nodes', column: 'scaled', mode: 'set', op: '=' },
    { space: 'nodes', column: 'force', mode: 'scale', op: '*=' }
  ]);
  t.same(scale.params, [{ kind: 'number', value: 2, name: 'k' }, { kind: 'host', name: 'live' }], 'functions have no body');
  t.same(scale.builtIns, ['dt']);
  t.same(scale.sums, ['total']);
  t.same(program.tables, [{ stage: 'scale', name: 'T', from: 0, to: 1, values: Float64Array.from([0, 1]) }]);
  t.same(program.sums, [{ name: 'total', over: 'nodes', group: null, reduce: 'sum', width: 1, when: null }]);
  var crowding = stageOf(program, 'crowding');
  t.equal(crowding.space, 'pairs');
  t.same(crowding.args, { radius: { kind: 'expression', text: 'h' }, symmetric: true, startAtZero: ['crowd'] });
  t.same(crowding.writes, [
    { space: 'nodes', column: 'crowd', mode: 'add', op: '+=', end: 'i', startAtZero: true },
    { space: 'nodes', column: 'crowd', mode: 'add', op: '+=', end: 'j', startAtZero: true },
    { space: 'nodes', column: 'force', mode: 'add', via: 'push' }
  ]);
  t.same(crowding.reads.filter(function (read) { return read.column === 'mass'; }).map(function (read) { return read.end; }), ['i', 'j']);
  var columns = {};
  program.columns.nodes.forEach(function (column) { columns[column.name] = column; });
  t.equal(columns.crowd.writer, 'stage:crowding');
  t.equal(columns.scaled.writer, 'stage:scale');
  t.end();
});

test('stageValues() gives a stage its numbers for any step', function (t) {
  var sim = makeSimulator({ dimensions: 2, repulsionLaw: { force: 'exp(-r / L) / r^2', params: { L: function (context) { return 2 * context.iteration(); } } } }, 6);
  sim.store.define('crowd');
  sim.addPairFormula('crowding', {
    radius: 'h * 2',
    params: { h: function (context) { return context.iteration() + 1; } },
    when: 'step >= 2',
    formula: 'crowd_i += 1; push = 0',
    startAtZero: ['crowd']
  });
  var now = sim.stageValues('crowding');
  t.same(now, { params: { h: 1 }, when: false, builtIns: { step: 0 }, radius: 2 }, 'the current step');
  t.same(sim.stageValues('crowding', sim.stepContext(5)), { params: { h: 6 }, when: true, builtIns: { step: 5 }, radius: 12 }, 'a step to come');
  var step5 = sim.stageValues('repulsion', sim.stepContext(5));
  var step6 = sim.stageValues('repulsion', sim.stepContext(6));
  t.equal(step5.lawValues.L, 10, 'a law gets its numbers for that step');
  t.equal(step6.lawValues.L, 12);
  t.equal(step5.lawValues.$h0, 1 / 10, 'with the parts computed once per step');
  t.equal(step6.lawValues.$h0, 1 / 12, 'each call keeps its own numbers');
  t.equal(step5.law, step6.law, 'the compiled law is the same, for generating code');
  t.same(sim.stageValues('drag').builtIns, { dragCoefficient: 0.9 });
  t.same(sim.stageValues('repulsion').builtIns, { gravity: -12, theta: 0.8 });
  t.equal(sim.stageValues('drag').when, true);
  sim.springLength(0);
  sim.store.define('scaled');
  sim.addNodeFormula('scale', { formula: 'scaled = unit * n' });
  t.same(sim.stageValues('scale').builtIns, { unit: 1e-3, n: 6 }, 'unit keeps its floor');
  t.throws(function () { sim.stageValues('nope'); }, /No stage named nope/);
  t.end();
});

test('parameter functions get the step context, not the simulator', function (t) {
  var sim = makeSimulator({ dimensions: 3, springLength: 7 }, 5);
  var seen = null, iteration = -1;
  sim.store.define('out');
  sim.addNodeFormula('look', { formula: 'out = k', params: { k: function (context) { seen = context; iteration = context.iteration(); return 1; } } });
  sim.step();
  sim.step();
  t.equal(iteration, 1, 'the step being computed');
  t.equal(seen.settings.springLength, 7);
  t.equal(seen.springLength(), 7);
  t.equal(seen.dimensions(), 3);
  t.equal(seen.unit(), 7);
  t.same([seen.store.n, seen.store.D], [5, 3]);
  t.notOk(seen.store.pos, 'no columns');
  t.notOk(seen.neighbors, 'no neighbors');
  t.throws(function () { 'use strict'; seen.settings.springLength = 3; }, TypeError, 'settings are read only');
  sim.springLength(9);
  t.equal(seen.settings.springLength, 9, 'and current');
  t.equal(seen.springLength(), 9);
  t.equal(seen.unit(), 9);
  t.equal(formula.liveSettings(seen), sim.settings, 'the library reads the live settings behind the view');
  t.equal(formula.BUILT_IN_VALUES.springLength(seen), 9);
  var plain = { settings: { springLength: 4 } };
  t.equal(formula.liveSettings(plain), plain.settings, 'or the settings of a context without a view');
  t.equal(sim.stepContext(40).iteration(), 40, 'a context for a step to come');
  t.end();
});

test('when gates a stage', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 5);
  sim.store.define('runs');
  sim.addNodeFormula('every3', { formula: 'runs += 1', when: 'step - floor(step / 3) * 3 == 0' });
  sim.addSum('stepAtSum', { formula: 'step + 0 * mass', reduce: 'max', when: 'step < k', params: { k: 2 } });
  var jsRuns = 0, hostRuns = [];
  sim.addStage('js', function () { jsRuns += 1; }, { when: function (context) { return context.iteration() % 2 === 1; } });
  sim.addRepulsion('late', { law: 'r^-2', when: 'step > 100' });
  for (var i = 0; i < 7; ++i) sim.step();
  t.equal(sim.store.runs[0], 3, 'steps 0, 3 and 6');
  t.equal(sim.sums().stepAtSum.value[0], 1, 'a gated sum keeps its last result');
  t.equal(jsRuns, 3, 'JS stages: steps 1, 3 and 5');
  var program = sim.program();
  t.same(stageOf(program, 'every3').when, { kind: 'expression', text: 'step - floor(step / 3) * 3 == 0' });
  t.same(stageOf(program, 'js').when, { kind: 'host' });
  t.same(stageOf(program, 'late').when, { kind: 'expression', text: 'step > 100' });
  t.same(program.sums[0].when, { kind: 'expression', text: 'step < k' });
  t.equal(sim.stageValues('late', sim.stepContext(101)).when, true);
  t.throws(function () { sim.addNodeFormula('bad', { formula: 'runs = 1', when: 'step + 1' }); }, /Expected a condition/);
  sim.addHostStep('measure', { when: 'step == 7', reads: ['pos'], run: function (s) { hostRuns.push(s.iteration()); } });
  sim.step();
  sim.step();
  t.same(hostRuns, [7], 'host steps run inline when their `when` holds');
  t.end();
});

test('inertia: the integrators divide by its column', function (t) {
  ['euler', 'fire'].forEach(function (integrator) {
    var plain = makeSimulator({ dimensions: 2, integrator: integrator }, 20);
    var same = makeSimulator({ dimensions: 2, integrator: integrator }, 20);
    same.store.define('inertiaCopy');
    same.store.inertiaCopy.set(same.store.mass.subarray(0, 20));
    same.inertia('inertiaCopy');
    for (var i = 0; i < 20; ++i) { plain.step(); same.step(); }
    sameNumbers(t, plain.store.pos.subarray(0, 40), same.store.pos.subarray(0, 40), integrator + ': a copy of the mass moves bodies the same way');

    var heavy = makeSimulator({ dimensions: 2, integrator: integrator, maxVelocity: 1e9 }, 20);
    heavy.store.define('heavy');
    for (i = 0; i < 20; ++i) heavy.store.heavy[i] = 4 * heavy.store.mass[i];
    heavy.inertia('heavy');
    heavy.step();
    var force = heavy.store.force, velocity = heavy.store.velocity;
    var expected = integrator === 'euler' ? 0.5 * force[10] / heavy.store.heavy[5] : velocity[10];
    t.ok(Math.abs(velocity[10] - expected) < 1e-12 * Math.abs(expected), integrator + ': v = dt * f / inertia');
  });
  var sim = makeSimulator({ dimensions: 2 }, 3);
  t.throws(function () { sim.inertia('nope'); }, /No body column named nope/);
  t.throws(function () { sim.inertia('pos'); }, /one number per body/);
  t.equal(sim.inertia(), 'mass');
  t.end();
});

test('setters fire settings; columns keep versions', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 3);
  var events = [];
  sim.on('settings', function (key, value) { events.push(key + '=' + value); });
  sim.springLength(12);
  sim.springLength(12);
  sim.integrator('fire');
  sim.store.define('heavy', Float64Array, 1, 2);
  sim.inertia('heavy');
  t.same(events, ['springLength=12', 'integrator=fire', 'inertia=heavy'], 'once per change');
  t.equal(sim.program().listeners.settings, 1);

  var store = sim.store;
  // reading store.versions applies what setters wrote since the last read
  var versions = function () { return store.versions; };
  var mass = versions().mass;
  sim.bodies[1].mass = 5;
  t.ok(versions().mass > mass, 'the body mass setter marks the mass');
  var pinned = versions().pinned;
  sim.bodies[1].isPinned = true;
  t.ok(versions().pinned > pinned, 'pinning marks pinned');
  var length = sim.springStore.versions.length;
  sim.springs[0].length = 3;
  t.ok(sim.springStore.versions.length > length, 'spring setters mark their column');
  var heavy = versions().heavy;
  store.changed('heavy');
  t.ok(versions().heavy > heavy, 'changed() marks a column');
  var before = Object.assign({}, versions());
  sim.addBodyAt({ x: 3, y: 3 });
  var topology = 0;
  sim.on('topology', function () { topology += 1; });
  sim.applyEdits();
  t.equal(topology, 1, 'applyEdits() fires topology at once');
  t.ok(Object.keys(before).every(function (name) { return versions()[name] > before[name]; }), 'graph edits mark every column');
  sim.step();
  t.equal(topology, 1, 'and the step does not fire it again');
  var columnsVersion = store.columnsVersion;
  heavy = versions().heavy;
  store.remove('heavy');
  t.ok(versions().heavy > heavy, 'removing a column changes it');
  t.ok(store.columnsVersion > columnsVersion);
  t.notOk('toString' in versions(), 'versions has columns only');
  t.end();
});

test('applyEdits() drops removed rows now', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 6);
  sim.step();
  sim.removeBody(sim.bodies[2]);
  t.equal(sim.store.n, 6, 'rows stay until the edits are applied');
  sim.applyEdits();
  t.equal(sim.store.n, 5);
  t.equal(sim.bodies[2].index, 2, 'rows moved down');
  t.end();
});

test('iteration(n) sets the step count', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 3);
  sim.step();
  t.equal(sim.iteration(), 1);
  sim.iteration(40);
  t.equal(sim.iteration(), 40);
  t.equal(sim.stepContext().iteration(), 40);
  sim.step();
  t.equal(sim.iteration(), 41);
  t.throws(function () { sim.iteration(-1); }, /whole number/);
  t.end();
});

test('axis(k) is the unit vector along axis k', function (t) {
  var sim = makeSimulator({ dimensions: 3 }, 4);
  ['clear', 'repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
  sim.store.force.fill(0);
  sim.addNodeFormula('down', { formula: 'force += 2 * axis(1) + axis(D - 1)' });
  sim.step();
  t.same(Array.from(sim.store.force.subarray(0, 3)), [0, 2, 1]);
  t.throws(function () { sim.addNodeFormula('bad', { formula: 'force += axis(3)' }); }, /axis\(\) takes a whole number from 0 to 2/);
  t.throws(function () { sim.addNodeFormula('bad2', { formula: 'force += axis(mass)' }); }, /axis\(\)/);
  t.end();
});

test('host steps run inline and are described', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 4);
  var order = [];
  sim.addStage('first', function () { order.push('first'); }, { after: 'clear' });
  sim.addHostStep('look', { after: 'first', reads: ['pos', 'mass', { space: 'links', column: 'length' }], writes: ['mass'], run: function (s) { order.push('look@' + s.iteration()); } });
  sim.step();
  t.same(order, ['first', 'look@0']);
  var program = sim.program();
  t.same(program.hostSteps, [{
    name: 'look', when: null,
    reads: [{ space: 'nodes', column: 'pos' }, { space: 'nodes', column: 'mass' }, { space: 'links', column: 'length' }],
    writes: [{ space: 'nodes', column: 'mass', mode: 'host' }]
  }]);
  var plan = sim.plan();
  var look = plan.stages.filter(function (stage) { return stage.stage === 'look'; })[0];
  t.equal(look.cost, 'every step: reads pos, mass, length (4·n numbers), writes mass');
  t.same(plan.warnings, ['look: a host step without `when` runs on the host every step']);
  t.throws(function () { sim.addHostStep('nothing', {}); }, /needs a run/);
  t.end();
});

test('plan(backend): add-on stages describe themselves; backends check program() stages', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 4);
  sim.addStage('field', function () {}, {
    describe: { shape: 'grid', anchor: 'box', writes: [{ space: 'nodes', column: 'mass', mode: 'set' }] },
    values: function (context) { return { when: true, params: { cell: context.unit() / 2 } }; }
  });
  sim.addStage('other', function () {}, { describe: function () { return { shape: 'mesh', how: 'a mesh on the CPU' }; } });
  var field = stageOf(sim.program(), 'field');
  t.equal(field.shape, 'grid');
  t.equal(field.anchor, 'box', 'with options of its own');
  t.same(sim.stageValues('field', sim.stepContext(3)), { when: true, params: { cell: 5 }, builtIns: {} }, 'and its own numbers per step');
  var cpu = sim.plan().stages;
  t.equal(cpu.filter(function (s) { return s.stage === 'field'; })[0].how, 'add-on stage (grid)');
  t.equal(cpu.filter(function (s) { return s.stage === 'other'; })[0].how, 'a mesh on the CPU');
  sim.removeStage('other');
  t.equal(sim.program().columns.nodes.filter(function (c) { return c.name === 'mass'; })[0].writer, 'stage:field');
  var seen = [];
  var backend = {
    name: 'toy',
    checkProgram: function (program) { return { reasons: program.dims === 2 ? [] : ['2D only'], warnings: ['careful'] }; },
    check: function (stage, program, simulator) {
      seen.push(stage.name);
      t.equal(simulator, sim);
      if (stage.shape === 'grid') return { runs: false, reason: 'no grid fields here' };
      return { runs: true, how: 'somehow', warnings: stage.builtIn === 'drag' ? ['drag is slow'] : [] };
    }
  };
  var plan = sim.plan(backend);
  t.same(seen, sim.stages());
  t.notOk(plan.runs);
  t.same(plan.reasons, ['field: no grid fields here']);
  t.same(plan.warnings, ['careful', 'drag: drag is slow']);
  t.equal(plan.backend, 'toy');
  t.end();
});

test('a printer spells formulas in another language', function (t) {
  // A toy printer: names of the formula get a prefix, numbers always have a decimal point
  var printer = Object.assign({}, formula.JS, {
    name: 'toy',
    number: function (value) { var text = String(value); return /^-?\d+$/.test(text) ? text + '.0' : text; },
    call: function (name, args) { return name + '(' + args.join(', ') + ')'; },
    declare: function (name, code, kind) { return (kind === 'local' ? 'var ' : 'let ') + name + ' = ' + code + ';'; },
    local: function (name) { return 'p_' + name; },
    temp: function (index) { return 't_' + index; }
  });
  var scope = { D: 2, name: function (name) { return name === 'mass' ? { type: 'num', code: 'mass[i]' } : undefined; } };
  var compiled = formula.compile('active = sqrt(mass) * 2; active += 1; active / 3', scope, printer);
  t.same(compiled.lines, ['var p_active = (sqrt(mass[i]) * 2.0);', 'p_active += 1.0;']);
  t.equal(compiled.result.code, '(p_active / 3.0)');
  var law = createRepulsionLaw({ force: 'exp(-r / L) / r^2', params: { L: 2 } });
  t.equal(law.emit(formula.JS, 2, 'r', 'k1', 'k2'), law.emit(2, 'r', 'k1', 'k2'), 'law.emit(printer, ...) and the JS default agree');
  Object.keys(formula.BUILTINS).forEach(function (name) {
    var builtIn = formula.BUILTINS[name];
    t.ok(Array.isArray(builtIn.args) && builtIn.result && builtIn.domain, name + ' has its semantics');
  });
  t.end();
});

test('host writes to positions and velocities mark their columns', function (t) {
  var graph = createGraph();
  graph.addLink(1, 2);
  var layout = createLayout(graph);
  layout.step();
  var store = layout.simulator.store;
  var versions = function () { return store.versions; };
  var pos = versions().pos;
  layout.setNodePosition(1, 5, 6);
  t.ok(versions().pos > pos, 'setNodePosition (a drag) marks pos');
  pos = versions().pos;
  layout.getBody(2).pos.x = 3;
  t.ok(versions().pos > pos, 'so does a write through a body\'s position');
  var velocity = versions().velocity;
  layout.getBody(2).velocity.reset();
  t.ok(versions().velocity > velocity, 'and of its velocity');
  var force = versions().force;
  layout.getBody(2).force.x = 1;
  t.equal(versions().force, force, 'forces are cleared every step and not marked');
  var Body = require('../lib/codeGenerators/generateCreateBody')(2);
  var loose = new Body(1, 2);
  loose.setPosition(3, 4);
  loose.pos.y = 5;
  t.same(loose.pos.toJSON(), { x: 3, y: 5 }, 'a body outside a simulator has nothing to mark');
  t.end();
});

test('program() details: own positions of trees, pair rules, counters of link formulas', function (t) {
  var sim = makeSimulator({ dimensions: 2, adaptiveTimeStepWeight: 0.2 }, 6);
  var repulsion = stageOf(sim.program(), 'repulsion');
  t.same(repulsion.reads[0], { space: 'nodes', column: 'pos', rows: 'own' }, 'a tree reads the position of the body it pushes');
  var version = sim.programVersion();
  t.equal(sim.program().version, version, 'programVersion() is the version program() reports');
  sim.addPairRule('a', { radius: 1, rule: function () { return 0; } });
  t.ok(sim.programVersion() > version);
  version = sim.programVersion();
  sim.addPairRule('b', { radius: 1, rule: function () { return 0; } });
  t.ok(sim.programVersion() > version, 'a rule added to the pairRules stage changes the structure');
  version = sim.programVersion();
  sim.removePairRule('b');
  t.ok(sim.programVersion() > version, 'and so does one removed');
  sim.addLinkFormula('soft', { replace: 'springs', formula: 'pull = coefficient * (r - length)' });
  var soft = stageOf(sim.program(), 'soft');
  t.equal(soft.args.counters, true, 'in place of the springs it keeps their counters');
  t.same(soft.writes.slice(-2).map(function (w) { return w.column + ':' + w.mode; }), ['springCount:add', 'springLength:add']);
  sim.adaptiveTimeStepWeight(0);
  soft = stageOf(sim.program(), 'soft');
  t.equal(soft.args.counters, false, 'only while the adaptive time step is on');
  t.notOk(soft.writes.some(function (w) { return w.column === 'springCount'; }));
  t.end();
});

test('a link formula without pull adds no force and draws no random numbers', function (t) {
  var plain = makeSimulator({ dimensions: 2 }, 12);
  var sim = makeSimulator({ dimensions: 2 }, 12);
  sim.springStore.define('seen');
  sim.addLinkFormula('measure', { formula: 'seen = r', after: 'integrate' });
  for (var i = 0; i < 5; ++i) { plain.step(); sim.step(); }
  sameNumbers(t, Array.from(sim.store.pos.subarray(0, 24)), Array.from(plain.store.pos.subarray(0, 24)), 'the layout moves as without it');
  var spring = sim.springs[0];
  var d = [0, 1].map(function (k) { return sim.store.pos[2 * spring.to.index + k] - sim.store.pos[2 * spring.from.index + k]; });
  t.equal(sim.springStore.seen[0], Math.sqrt(d[0] * d[0] + d[1] * d[1]), 'it reads r');
  var measure = stageOf(sim.program(), 'measure');
  t.notOk(measure.writes.some(function (w) { return w.column === 'force'; }), 'no force in its writes');
  sim.addLinkFormula('count', { formula: 'seen = seen + 1' });
  t.notOk(stageOf(sim.program(), 'count').reads.some(function (r) { return r.column === 'pos'; }), 'nor positions when it does not read r');
  t.end();
});

test('a link formula sets its own spring with =', function (t) {
  var set = makeSimulator({ dimensions: 2 }, 16);
  var viaFormula = makeSimulator({ dimensions: 2 }, 16);
  [set, viaFormula].forEach(function (sim) {
    sim.springStore.define('stiff');
    for (var s = 0; s < sim.springStore.n; s += 3) sim.springStore.stiff[s] = 0.3;
  });
  for (var s = 0; s < set.springStore.n; ++s) {
    set.springStore.coefficient[s] = set.springStore.stiff[s] > 0 ? set.springStore.stiff[s] : -1;
    set.springStore.length[s] = 12;
  }
  viaFormula.store.define('seen');
  viaFormula.addLinkFormula('controller', {
    before: 'clear',
    formula: 'coefficient = stiff > 0 ? stiff : -1; length = 12; seen_i += coefficient'
  });
  for (var i = 0; i < 10; ++i) { set.step(); viaFormula.step(); }
  sameNumbers(t, Array.from(viaFormula.store.pos.subarray(0, 32)), Array.from(set.store.pos.subarray(0, 32)), 'the springs read what it set');
  t.equal(viaFormula.springStore.coefficient[1], -1, 'the store holds what it set');
  t.ok(Math.abs(viaFormula.store.seen[viaFormula.springs[1].from.index] - 8) < 1e-9, 'after = it reads the value with the settings filled in');
  var controller = stageOf(viaFormula.program(), 'controller');
  t.same(controller.writes.filter(function (w) { return w.space === 'links'; }).map(function (w) { return w.column + ':' + w.mode; }), ['coefficient:set', 'length:set']);
  var column = viaFormula.program().columns.links.filter(function (c) { return c.name === 'coefficient'; })[0];
  t.equal(column.writer, 'stage:controller');
  t.throws(function () { viaFormula.addLinkFormula('bad', { formula: 'coefficient += 1' }); }, /coefficient can only be changed with =/);
  t.throws(function () { viaFormula.addSum('bad2', { over: 'links', formula: 'coefficient = 1; 1' }); }, /cannot be assigned/);
  t.end();
});

test('a gated stage reads only what its gate needs on its off steps', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 4);
  sim.store.define('out');
  var calls = { every: 0, gate: 0, host: 0 };
  sim.addNodeFormula('rare', {
    when: 'step == at',
    params: { at: function () { calls.gate += 1; return 3; }, k: function () { calls.every += 1; return 2; } },
    formula: 'out = k'
  });
  sim.addNodeFormula('hosted', {
    when: function (context) { return context.iteration() === 2; },
    params: { k: function () { calls.host += 1; return 1; } },
    formula: 'out += k'
  });
  for (var i = 0; i < 5; ++i) sim.step();
  t.same(calls, { every: 1, gate: 5, host: 1 }, 'params outside the gate are read on its on steps only, once');
  t.equal(sim.store.out[0], 2, 'on its own steps it runs as before (hosted at step 2, then rare at 3)');
  t.same(sim.stageValues('rare', sim.stepContext(3)), { params: { at: 3, k: 2 }, when: true, builtIns: { step: 3 } });
  t.end();
});

test('grouped sums follow groups that grow and shrink', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 10);
  sim.store.define('group', Int32Array);
  sim.addSum('massOf', { formula: 'mass', group: 'group' });
  function expected() {
    var out = [];
    for (var i = 0; i < 10; ++i) {
      var g = sim.store.group[i];
      if (g < 0) continue;
      while (out.length <= g) out.push(0);
      out[g] += sim.store.mass[i];
    }
    return out;
  }
  [[0, 1], [0, 1, 2, 4], [1], [-1], [3, 0]].forEach(function (ids) {
    for (var i = 0; i < 10; ++i) sim.store.group[i] = ids[i % ids.length];
    sim.step();
    var sum = sim.sums().massOf;
    t.same(Array.from(sum.groups.subarray(0, sum.count)), expected(), 'groups ' + ids.join(','));
  });
  t.end();
});

test('pair formulas find pairs just inside the radius, at any scale', function (t) {
  // 1e-150: squares near underflow, where the squared test is off
  [1, 1e-150, 1e150].forEach(function (scale) {
    var sim = createSimulator({ dimensions: 2 });
    var r = 0.7 * scale;
    sim.addBodyAt({ x: 0, y: 0 });
    sim.addBodyAt({ x: r, y: 0 });
    sim.addBodyAt({ x: 0, y: 3 * r });
    ['repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
    sim.store.define('count');
    // the next number above r: the pair at distance r is inside, the one at 3r is not
    var radius = r * (1 + Number.EPSILON);
    sim.addPairFormula('near', { radius: radius, startAtZero: ['count'], formula: 'count_i += 1; count_j += 1; push = 0' });
    sim.step();
    t.same(Array.from(sim.store.count.subarray(0, 3)), [1, 1, 0], 'scale ' + scale);
  });
  t.end();
});

test('stages with the same when share its answer; gates of their own params do not', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 4);
  sim.store.define('a');
  sim.store.define('b');
  sim.store.define('c');
  var runs = [];
  var when = 'step - floor(step / 3) * 3 == 0';
  sim.addNodeFormula('first', { formula: 'a += 1', when: when });
  sim.addStage('js', function (store, s) { runs.push(s.iteration()); }, { when: when });
  sim.addNodeFormula('second', { formula: 'b += 1', when: when });
  sim.addNodeFormula('ownParam', { formula: 'c += 1', when: 'step >= k', params: { k: 4 } });
  sim.addNodeFormula('ownParam2', { formula: 'c += 10', when: 'step >= k', params: { k: 2 } });
  for (var i = 0; i < 7; ++i) sim.step();
  t.same([sim.store.a[0], sim.store.b[0]], [3, 3], 'steps 0, 3 and 6 for both formulas');
  t.same(runs, [0, 3, 6], 'and the JS stage');
  t.equal(sim.store.c[0], 3 + 10 * 5, 'the same text with params of their own answers for each stage');
  t.equal(sim.stageValues('second', sim.stepContext(9)).when, true, 'a step to come gets its own answer');
  t.equal(sim.stageValues('second', sim.stepContext(10)).when, false);
  t.end();
});

test('a link formula that only sets its coefficient does not read it', function (t) {
  var sim = makeSimulator({ dimensions: 2 }, 6);
  sim.addLinkFormula('set', { formula: 'coefficient = 0.5' });
  sim.addLinkFormula('setThenRead', { formula: 'coefficient = 0.5; pull = coefficient * (r - length)' });
  var program = sim.program();
  t.notOk(stageOf(program, 'set').reads.some(function (read) { return read.column === 'coefficient'; }));
  t.ok(stageOf(program, 'setThenRead').reads.some(function (read) { return read.column === 'coefficient'; }), 'a read after it counts');
  t.end();
});
