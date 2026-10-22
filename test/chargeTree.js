var test = require('tap').test;
var generateQuadTree = require('../lib/codeGenerators/generateQuadTree');
var createRepulsionLaw = require('../lib/repulsionLaw');
var createBodyStore = require('../lib/createBodyStore');
var Random = require('ngraph.random');

// A tree with several charges walks once and adds every charge's push (see generateQuadTree.js)
test('one law in an array generates the same code as the law alone', function (t) {
  [null, 'exp(-r) / r^2', { force: 'exp(-r / L) / r^2', params: { L: 2 }, range: '4 * L' }].forEach(function (spec) {
    [2, 3].forEach(function (dimension) {
      var law = createRepulsionLaw(spec);
      var alone = generateQuadTree.generateQuadTreeFunctionBody(dimension, law);
      t.equal(generateQuadTree.generateQuadTreeFunctionBody(dimension, [law]), alone, JSON.stringify(spec) + ' in ' + dimension + 'D');
      t.equal(generateQuadTree.generateQuadTreeFunctionBody(dimension, [law], { centroid: 'shared' }), alone, 'centroid option ignored');
    });
  });
  t.end();
});

test('at theta 0 the walk is the exact sum of every charge', function (t) {
  var L = 3;
  var fade = function (r) { var u = r / L; return (1 + u) * Math.exp(-u); };
  // Charge 0 fades past L and stops at 6 L, charge 1 makes it whole again for its bodies
  var specs = [
    { force: 'u = r / L; (1 + u) * exp(-u) / r^2', params: { L: L }, range: '6 * L' },
    { force: 'u = r / L; (r < 6 * L ? 1 - (1 + u) * exp(-u) : 1) / r^2', params: { L: L } },
    null
  ];
  var exact = [
    function (r) { return r <= 6 * L ? fade(r) / (r * r) : 0; },
    function (r) { return (r < 6 * L ? 1 - fade(r) : 1) / (r * r); },
    function (r) { return 1 / (r * r); }
  ];
  [2, 3].forEach(function (dimension) {
    ['own', 'shared'].forEach(function (centroid) {
      var store = randomStore(dimension, 300, 3);
      // Charge 0 is missing on a few bodies, so some cells have none of it
      for (var i = 0; i < 40; ++i) store.mass[i] = 0;
      var laws = specs.map(createRepulsionLaw);
      laws.forEach(function (law) { law.update(fakeSimulator(dimension)); });
      var tree = generateQuadTree(dimension, laws, { centroid: centroid })({ gravity: -2, theta: 0 }, Random.random(1), laws);
      tree.insertBodies(store, store.charges, store.sensitivities);
      for (i = 0; i < store.n; ++i) tree.updateBodyForce(i);
      var expected = exactForces(store, exact, -2);
      t.ok(relativeDifference(store.force, expected) < 1e-12, dimension + 'D, ' + centroid + ' centres: ' + relativeDifference(store.force, expected));
    });
  });
  t.end();
});

test('charges that are copies of the first one push as one charge', function (t) {
  // With charge 1 = 2 * charge 0 and the same law, both centre rules give the one-charge tree with
  // three times the sensitivity, cell for cell
  [2, 3].forEach(function (dimension) {
    [null, { force: 'exp(-r / L) / r^2', params: { L: 4 } }].forEach(function (spec) {
      ['own', 'shared'].forEach(function (centroid) {
        var law = createRepulsionLaw(spec);
        law.update(fakeSimulator(dimension));
        var store = randomStore(dimension, 500, 2);
        var double = new Float64Array(store.n), triple = new Float64Array(store.n);
        for (var i = 0; i < store.n; ++i) { double[i] = 2 * store.mass[i]; triple[i] = 3 * store.mass[i]; }
        var options = { gravity: -1, theta: 0.8 };
        var one = generateQuadTree(dimension, law)(options, Random.random(1), law);
        one.insertBodies(store, store.mass, triple);
        for (i = 0; i < store.n; ++i) one.updateBodyForce(i);
        var expected = Float64Array.from(store.force.subarray(0, store.n * dimension));
        store.force.fill(0);
        // Different law objects: each charge evaluates its own law
        var laws = [law, createRepulsionLaw(spec)];
        laws[1].update(fakeSimulator(dimension));
        var two = generateQuadTree(dimension, laws, { centroid: centroid })(options, Random.random(1), laws);
        two.insertBodies(store, [store.mass, double], [store.mass, store.mass]);
        for (i = 0; i < store.n; ++i) two.updateBodyForce(i);
        t.ok(relativeDifference(store.force, expected) < 1e-12, dimension + 'D ' + JSON.stringify(spec) + ' ' + centroid);
      });
    });
  });
  t.end();
});

test('a charge pushes only bodies that feel it', function (t) {
  var store = randomStore(2, 50, 4);
  var laws = [null, null];
  var zero = new Float64Array(store.n);
  var tree = generateQuadTree(2, laws)({ gravity: -1, theta: 0.8 }, Random.random(1), laws);
  // Charge 0 is felt by nobody; charge 1 only by body 7
  var feels = new Float64Array(store.n);
  feels[7] = 1;
  tree.insertBodies(store, [store.mass, store.mass], [zero, feels]);
  for (var i = 0; i < store.n; ++i) tree.updateBodyForce(i);
  for (i = 0; i < store.n; ++i) {
    var pushed = store.force[2 * i] !== 0 || store.force[2 * i + 1] !== 0;
    if (pushed !== (i === 7)) t.fail('body ' + i);
  }
  t.pass('only body 7 is pushed');
  t.end();
});

test('cells without the first charge act from their middle', function (t) {
  // Only charge 1 here: no cell has charge 0, and forces stay finite and close to exact
  ['own', 'shared'].forEach(function (centroid) {
    var store = randomStore(2, 400, 5);
    var none = new Float64Array(store.n);
    var laws = [null, null];
    var tree = generateQuadTree(2, laws, { centroid: centroid })({ gravity: -1, theta: 0.8 }, Random.random(1), laws);
    tree.insertBodies(store, [none, store.mass], [none, store.mass]);
    for (var i = 0; i < store.n; ++i) tree.updateBodyForce(i);
    var expected = exactForces({ D: 2, n: store.n, pos: store.pos, charges: [store.mass], sensitivities: [store.mass] }, [function (r) { return 1 / (r * r); }], -1);
    var error = relativeDifference(store.force, expected);
    t.ok(error < 0.05, centroid + ' centres: ' + error.toFixed(4) + ' from exact');
  });
  t.end();
});

test('unknown centroid rule throws', function (t) {
  t.throws(function () { generateQuadTree(2, [null, null], { centroid: 'middle' }); }, /Unknown centroid/);
  t.end();
});

function randomStore(dimension, n, charges) {
  var random = Random.random(dimension * 1000 + n);
  var store = createBodyStore(dimension, n);
  store.charges = [store.mass];
  store.sensitivities = [store.mass];
  for (var i = 0; i < n; ++i) {
    store.add();
    for (var k = 0; k < dimension; ++k) store.pos[i * dimension + k] = 100 * random.nextDouble();
    store.mass[i] = 1 + random.next(4);
  }
  for (var c = 1; c < charges; ++c) {
    var charge = new Float64Array(n), sensitivity = new Float64Array(n);
    for (i = 0; i < n; ++i) {
      // some bodies lack the charge, sensitivities may be negative
      charge[i] = random.next(3) === 0 ? 0 : random.nextDouble();
      sensitivity[i] = random.nextDouble() - 0.3;
    }
    store.charges.push(charge);
    store.sensitivities.push(sensitivity);
  }
  return store;
}

function exactForces(store, laws, gravity) {
  var D = store.D, n = store.n, pos = store.pos, out = new Float64Array(n * D);
  for (var i = 0; i < n; ++i) {
    for (var j = 0; j < n; ++j) {
      if (i === j) continue;
      var r2 = 0;
      for (var k = 0; k < D; ++k) r2 += Math.pow(pos[j * D + k] - pos[i * D + k], 2);
      var r = Math.sqrt(r2), v = 0;
      for (var c = 0; c < laws.length; ++c) v += store.charges[c][j] * store.sensitivities[c][i] * laws[c](r) / r;
      for (k = 0; k < D; ++k) out[i * D + k] += gravity * v * (pos[j * D + k] - pos[i * D + k]);
    }
  }
  return out;
}

function relativeDifference(force, expected) {
  var a = 0, b = 0;
  for (var k = 0; k < expected.length; ++k) {
    a += Math.pow(force[k] - expected[k], 2);
    b += expected[k] * expected[k];
  }
  return Math.sqrt(a / b);
}

function fakeSimulator(dimension) {
  return { settings: { dimensions: dimension } };
}
