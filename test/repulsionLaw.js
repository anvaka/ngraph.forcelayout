var test = require('tap').test;
var createRepulsionLaw = require('../lib/repulsionLaw');
var createSimulator = require('../lib/createPhysicsSimulator');
var random = require('ngraph.random').random(7);

test('law code gives F(r)/r and its gradient term', function (t) {
  var laws = [
    { force: 'r^-2' },
    { force: 'exp(-r / L) / r^2', params: { L: 2 } },
    { force: 'r^(1 - D)' },
    { force: '1 / (r * r + e * e)', params: { e: 0.5 } },
    { force: 'tanh(r / L) / r^2 + min(r, L) - abs(r - 3) + sqrt(r) * log(r)', params: { L: 2 } },
    { force: 'pow(r, -p) * 2', params: { p: 1.5 } },
    { force: 'K(r) / r', functions: { K: { value: Math.cos, derivative: function (x) { return -Math.sin(x); } } } }
  ];
  laws.forEach(function (spec) {
    var law = createRepulsionLaw(spec);
    law.update({ settings: { dimensions: 3 } });
    var code = law.prologue('values') + ' var k1, k2; ' + law.emit(3, 'r', 'k1', 'k2') + ' return [k1, k2];';
    var kernel = new Function('r', 'values', 'lawFunctions', code);
    var force = function (r) { return kernel(r, law.values, law.functions)[0] * r; };
    [0.3, 1.7, 4].forEach(function (r) {
      var k = kernel(r, law.values, law.functions);
      var h = 1e-6;
      var derivative = (force(r + h) - force(r - h)) / (2 * h);
      var expected = (k[0] - derivative) / (r * r);
      t.ok(Math.abs(k[1] - expected) < 1e-6 * (1 + Math.abs(expected)), spec.force + ' at r = ' + r);
    });
  });
  t.end();
});

test('law expressions are checked', function (t) {
  t.throws(function () { createRepulsionLaw('exp(-r / L)'); }, /Unknown name/);
  t.throws(function () { createRepulsionLaw('foo(r)'); }, /Unknown function/);
  t.throws(function () { createRepulsionLaw('r ^'); }, /ends too early/);
  t.throws(function () { createRepulsionLaw({ force: 'r', params: { r: 1 } }); }, /Bad law parameter/);
  t.throws(function () { createRepulsionLaw({ force: 'r^-2', range: 'r * 2' }); }, /cannot depend on r/);
  t.ok(createRepulsionLaw().isDefault, 'empty law is 1/r^2');
  t.ok(createRepulsionLaw(' r ^ -2 ').isDefault, '1/r^2 written out is the default too');
  t.notOk(createRepulsionLaw({ force: 'r^-2', params: { L: 1 } }).isDefault, 'parameters make a custom law');
  t.end();
});

test('both trees follow the law in any dimension', function (t) {
  var laws = [
    { force: 'r^-1' },
    { force: 'exp(-r / L) / r^2', params: { L: 15 } },
    { force: 'r^(1 - D)' },
    { force: 'exp(-r / L) / r^2', params: { L: 15 }, range: 'L * 6' }
  ];
  [2, 3].forEach(function (dimensions) {
    laws.forEach(function (law) {
      ['quadtree', 'dualtree'].forEach(function (nbody) {
        var simulator = createSimulator({ dimensions: dimensions, nbody: nbody, repulsionLaw: law, theta: 0.5 });
        addRandomBodies(simulator, 600, dimensions);
        var exact = exactForces(simulator, law);
        runStages(simulator, ['clear', 'repulsion']);
        var error = relativeError(simulator.store.force, exact);
        t.ok(error < 0.05, dimensions + 'D ' + nbody + ' ' + law.force + (law.range ? ' with range' : '') + ': error ' + error.toFixed(4));
      });
    });
  });
  t.end();
});

test('a law can change while the layout runs', function (t) {
  var simulator = createSimulator({ nbody: 'dualtree' });
  addRandomBodies(simulator, 300, 2);
  simulator.repulsionLaw('r^-1');
  runStages(simulator, ['clear', 'repulsion']);
  var error = relativeError(simulator.store.force, exactForces(simulator, { force: 'r^-1' }));
  t.ok(error < 0.06, 'new law is used, error ' + error.toFixed(4));
  t.equal(simulator.repulsionLaw().spec.force, 'r^-1');

  // parameters given as functions are read every step
  var length = 10;
  simulator.repulsionLaw({ force: 'exp(-r / L) / r^2', params: { L: function () { return length; } } });
  runStages(simulator, ['clear', 'repulsion']);
  var before = simulator.store.force[0];
  length = 1e9;
  runStages(simulator, ['clear', 'repulsion']);
  runStages(simulator, ['clear', 'repulsion']);
  t.not(simulator.store.force[0], before, 'parameter value is read again');
  t.end();
});

test('charge can differ from mass', function (t) {
  var simulator = createSimulator({ repulsionCharge: 'charge' });
  simulator.store.define('charge', Float64Array, 1, 1);
  var a = simulator.addBodyAt({ x: 0, y: 0 });
  var b = simulator.addBodyAt({ x: 1, y: 0 });
  simulator.store.charge[b.index] = 2;
  a.mass = 5;
  runStages(simulator, ['clear', 'repulsion']);
  // gravity -12 * charges 1 * 2 / 1^2, away from b
  t.equal(a.force.x, -24, 'push uses charges, not masses');
  t.end();
});

test('bodies without charge push nobody, in both trees', function (t) {
  [2, 3].forEach(function (dimensions) {
    ['quadtree', 'dualtree'].forEach(function (nbody) {
      var simulator = createSimulator({ dimensions: dimensions, nbody: nbody, theta: 0.5, repulsionCharge: 'charge' });
      simulator.store.define('charge', Float64Array, 1, 1);
      addRandomBodies(simulator, 600, dimensions);
      // a whole cluster without charge, and a few more bodies here and there
      var charge = simulator.store.charge;
      for (var i = 0; i < 600; ++i) charge[i] = (i % 4 === 1 || i % 37 === 0) ? 0 : simulator.store.mass[i];
      runStages(simulator, ['clear', 'repulsion']);
      var error = relativeError(simulator.store.force, exactForces(simulator, { force: 'r^-2' }));
      t.ok(error < 0.05, dimensions + 'D ' + nbody + ' with uncharged bodies: error ' + error.toFixed(4));
    });
  });
  t.end();
});

test('sensitivity: how strongly a body feels the push', function (t) {
  ['quadtree', 'dualtree'].forEach(function (nbody) {
    var simulator = createSimulator({ nbody: nbody, repulsionCharge: 'charge', repulsionSensitivity: 'feel' });
    simulator.store.define('charge', Float64Array, 1, 1);
    simulator.store.define('feel', Float64Array, 1, 1);
    var a = simulator.addBodyAt({ x: 0, y: 0 });
    var b = simulator.addBodyAt({ x: 1, y: 0 });
    simulator.store.charge[a.index] = 0; // a pushes nobody
    simulator.store.charge[b.index] = 2;
    simulator.store.feel[a.index] = 3;
    runStages(simulator, ['clear', 'repulsion']);
    t.equal(a.force.x, -12 * 3 * 2, nbody + ': a feels b with its sensitivity');
    t.equal(b.force.x, 0, nbody + ': b feels nothing from a');
  });
  t.end();
});

test('pair rules act on close pairs only', function (t) {
  [1, 2, 3, 4].forEach(function (dimensions) {
    var simulator = createSimulator({ dimensions: dimensions });
    var position = function (x) { var p = {x: x, y: 0, z: 0, c4: 0}; return p; };
    simulator.addBodyAt(position(0));
    simulator.addBodyAt(position(1));
    simulator.addBodyAt(position(10));
    var seen = [];
    simulator.addPairRule('contact', {
      radius: 2,
      rule: function (i, j, r) { seen.push([i, j, r]); return 1; }
    });
    t.same(simulator.stages(), ['clear', 'repulsion', 'drag', 'springs', 'pairRules', 'integrate']);
    runStages(simulator, ['clear', 'pairRules']);
    t.same(seen, [[0, 1, 1]], dimensions + 'D: one close pair');
    t.equal(simulator.bodies[0].force.x, -1, 'pushed away along the pair');
    t.equal(simulator.bodies[1].force.x, 1, 'and the other way');

    simulator.addPairRule('oneSided', {
      radius: function (sim) { return sim.unit(); },
      symmetric: false,
      rule: function (i) { return i === 0 ? 3 : 0; }
    });
    runStages(simulator, ['clear', 'pairRules']);
    t.equal(simulator.bodies[1].force.x, 1, 'one sided rule moves only the first body');
    t.equal(simulator.bodies[0].force.x, -4, 'both rules add up');
    simulator.removePairRule('contact');
    simulator.removePairRule('oneSided');
    t.notOk(simulator.getStage('pairRules'), 'stage goes with the last rule');
  });
  t.end();
});

test('pair rules push bodies on the same spot apart', function (t) {
  [2, 3].forEach(function (dimensions) {
    var simulator = createSimulator({ dimensions: dimensions });
    simulator.addBodyAt({ x: 1, y: 1, z: 1 });
    simulator.addBodyAt({ x: 1, y: 1, z: 1 });
    var distances = [];
    simulator.addPairRule('apart', {
      radius: 1,
      rule: function (i, j, r) { distances.push(r); return r > 0 ? 2 / r : 2; }
    });
    runStages(simulator, ['clear', 'pairRules']);
    t.same(distances, [0], dimensions + 'D: the pair is seen at r = 0');
    var force = simulator.store.force;
    var axes = [];
    for (var k = 0; k < dimensions; ++k) {
      if (force[k] !== 0) axes.push(k);
      t.equal(force[k], -force[dimensions + k], 'opposite pushes');
    }
    t.equal(axes.length, 1, 'along one axis');
    t.equal(Math.abs(force[axes[0]]), 2, 'by s');

    simulator.removePairRule('apart');
    simulator.addPairRule('dividesByR', { radius: 1, rule: function (i, j, r) { return 1 / r; } });
    runStages(simulator, ['clear', 'pairRules']);
    t.same(Array.from(force.subarray(0, 2 * dimensions)), new Array(2 * dimensions).fill(0), 'no finite push leaves them alone');
  });
  t.end();
});

test('pair rules work without the springs stage', function (t) {
  var simulator = createSimulator();
  simulator.removeStage('springs');
  simulator.addPairRule('contact', { radius: 1, rule: function () { return 0; } });
  t.same(simulator.stages(), ['clear', 'repulsion', 'drag', 'pairRules', 'integrate']);
  t.end();
});

test('law parameters can have any name', function (t) {
  ['q', 'h0', 'h1', 'lawH0', 'range'].forEach(function (name) {
    var params = {};
    params[name] = 2;
    var law = createRepulsionLaw({ force: 'exp(-r / ' + name + ') * ' + name + ' / r^2', params: params, range: 10 });
    law.update({ settings: { dimensions: 2 } });
    var code = law.prologue('values') + ' var k1; ' + law.emit(2, 'r', 'k1') + ' return k1;';
    var k1 = new Function('r', 'values', 'lawFunctions', code)(3, law.values, law.functions);
    var expected = Math.exp(-3 / 2) * 2 / 9 / 3;
    t.ok(Math.abs(k1 - expected) < 1e-15 * expected, name + ': ' + k1);
    t.equal(law.values[name], 2, name + ' keeps its value');
  });
  t.end();
});

test('a range of 0 pushes nothing, even with 1/r^2', function (t) {
  t.notOk(createRepulsionLaw({ force: 'r^-2', range: 0 }).isDefault, 'not the stock law');
  ['quadtree', 'dualtree'].forEach(function (nbody) {
    var simulator = createSimulator({ nbody: nbody, repulsionLaw: { force: 'r^-2', range: 0 } });
    simulator.addBodyAt({ x: 0, y: 0 });
    simulator.addBodyAt({ x: 1, y: 0 });
    runStages(simulator, ['clear', 'repulsion']);
    t.equal(simulator.store.force[0], 0, nbody);
  });
  t.end();
});

test('law code reads every number it computes', function (t) {
  ['exp(-r / L) / r^2', '-r^-2', '(1 + r / L) * exp(-r / L) / r^2', 'sqrt(1 + L * r * r) / r^2'].forEach(function (force) {
    var law = createRepulsionLaw({ force: force, params: { L: 2 } });
    [law.emit(2, 'r', 'k1'), law.emit(2, 'r', 'k1', 'k2')].forEach(function (code) {
      var declared = code.match(/(var|let) k1_\d+ /g) || [];
      declared.forEach(function (declaration) {
        var name = declaration.split(' ')[1];
        var after = code.slice(code.indexOf(declaration) + declaration.length);
        t.ok(new RegExp('\\b' + name + '\\b').test(after), force + ': ' + name + ' is read');
      });
    });
  });
  t.end();
});

test('unit never reaches zero', function (t) {
  var simulator = createSimulator({ springLength: 30 });
  t.equal(simulator.unit(), 30);
  simulator.springLength(0);
  t.ok(simulator.unit() > 0, 'positive when spring length is 0');
  t.end();
});

test('topology event fires before the step after a change', function (t) {
  var simulator = createSimulator();
  var count = 0;
  simulator.on('topology', function () { count += 1; });
  var a = simulator.addBodyAt({ x: 0, y: 0 });
  var b = simulator.addBodyAt({ x: 1, y: 0 });
  simulator.step();
  simulator.step();
  t.equal(count, 1, 'once for the two new bodies');
  simulator.addSpring(a, b);
  simulator.step();
  t.equal(count, 2, 'after a new spring');
  simulator.removeBody(a);
  t.equal(b.index, 1, 'rows stay until the next step');
  simulator.step();
  t.equal(count, 3, 'after a removal');
  t.equal(b.index, 0, 'then bodies move down');
  t.equal(simulator.springs.length, 0, 'spring went with its body');
  t.equal(b.degree, 0, 'and the other end knows it');
  t.end();
});

function runStages(simulator, names) {
  names.forEach(function (name) { simulator.getStage(name)(simulator.store, simulator); });
}

function addRandomBodies(simulator, count, dimensions) {
  var names = ['x', 'y', 'z'];
  for (var i = 0; i < count; ++i) {
    var cluster = i % 4;
    var pos = {};
    for (var k = 0; k < dimensions; ++k) pos[names[k]] = cluster * 40 + (random.nextDouble() - 0.5) * (cluster + 1) * 25;
    var body = simulator.addBodyAt(pos);
    body.mass = 1 + random.next(3);
  }
}

// Brute force forces for a law, read from the same store the simulator uses
function exactForces(simulator, spec) {
  var law = createRepulsionLaw(spec);
  var store = simulator.store, D = store.D, n = store.n;
  law.update(simulator);
  var code = law.prologue('values') + ' var k1; ' + law.emit(D, 'r', 'k1') + ' return k1;';
  var kernel = new Function('r', 'values', 'lawFunctions', code);
  var gravity = simulator.gravity();
  var charge = store[simulator.settings.repulsionCharge];
  var sensitivity = simulator.settings.repulsionSensitivity ? store[simulator.settings.repulsionSensitivity] : charge;
  var forces = new Float64Array(n * D);
  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < n; ++j) {
      if (i === j) continue;
      var r2 = 0;
      for (var k = 0; k < D; ++k) {
        var d = store.pos[j * D + k] - store.pos[i * D + k];
        r2 += d * d;
      }
      var r = Math.sqrt(r2);
      if (r > law.values.$range) continue;
      var v = gravity * sensitivity[i] * charge[j] * kernel(r, law.values, law.functions);
      for (k = 0; k < D; ++k) forces[i * D + k] += v * (store.pos[j * D + k] - store.pos[i * D + k]);
    }
  }
  return forces;
}

function relativeError(actual, expected) {
  var error = 0, norm = 0;
  for (var i = 0; i < expected.length; ++i) {
    error += (actual[i] - expected[i]) * (actual[i] - expected[i]);
    norm += expected[i] * expected[i];
  }
  return Math.sqrt(error / norm);
}
