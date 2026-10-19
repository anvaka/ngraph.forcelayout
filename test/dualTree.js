var test = require('tap').test;
var createDualTreeFor = require('../lib/codeGenerators/generateDualTree');
var getVariableName = require('../lib/codeGenerators/getVariableName');
var random = require('ngraph.random').random(42);

test('dual tree forces are close to exact forces', function (t) {
  [2, 3, 4].forEach(function (dimensions) {
    var bodies = createRandomBodies(dimensions, 2000);
    var settings = { gravity: -12, theta: 0.8 };
    createDualTreeFor(dimensions)(settings).computeForces(bodies);

    var exact = exactForces(bodies, dimensions, settings.gravity);
    var names = variableNames(dimensions);
    var error = 0, norm = 0;
    bodies.forEach(function (body, i) {
      names.forEach(function (name, k) {
        var e = exact[i * dimensions + k];
        error += (body.force[name] - e) * (body.force[name] - e);
        norm += e * e;
      });
    });
    var relativeError = Math.sqrt(error / norm);
    t.ok(relativeError < 0.06, dimensions + 'D relative error ' + relativeError.toFixed(4) + ' is small');
  });
  t.end();
});

test('two bodies repel each other', function (t) {
  var Body = require('../lib/codeGenerators/generateCreateBody')(2);
  var bodyA = new Body(1, 0);
  var bodyB = new Body(2, 0);
  createDualTreeFor(2)({ gravity: -1, theta: 0.8 }).computeForces([bodyA, bodyB]);

  t.equal(bodyA.force.x, -1, 'A is pushed left');
  t.equal(bodyB.force.x, 1, 'B is pushed right');
  t.equal(bodyA.force.y, 0, 'No force along y');
  t.end();
});

test('bodies at the same position get bounded, opposite forces', function (t) {
  var Body = require('../lib/codeGenerators/generateCreateBody')(2);
  var bodies = [];
  for (var i = 0; i < 40; ++i) bodies.push(new Body(5, 5));
  createDualTreeFor(2)({ gravity: -12, theta: 0.8 }).computeForces(bodies);

  var sumX = 0, sumY = 0, allFinite = true, someNonZero = false;
  bodies.forEach(function (body) {
    allFinite = allFinite && Number.isFinite(body.force.x) && Number.isFinite(body.force.y);
    someNonZero = someNonZero || body.force.x !== 0 || body.force.y !== 0;
    sumX += body.force.x;
    sumY += body.force.y;
  });
  t.ok(allFinite, 'Forces are finite');
  t.ok(someNonZero, 'Bodies are pushed apart');
  t.ok(Math.abs(sumX) < 1e-9 && Math.abs(sumY) < 1e-9, 'Forces are opposite');
  t.end();
});

test('it does not touch forces of pinned bodies', function (t) {
  var Body = require('../lib/codeGenerators/generateCreateBody')(2);
  var bodyA = new Body(1, 0);
  var bodyB = new Body(2, 0);
  bodyA.isPinned = true;
  bodyA.force.x = 42;
  createDualTreeFor(2)({ gravity: -1, theta: 0.8 }).computeForces([bodyA, bodyB]);

  t.equal(bodyA.force.x, 42, 'Pinned body keeps its force');
  t.equal(bodyB.force.x, 1, 'Pinned body still repels others');
  t.end();
});

test('it follows changes in number of bodies and in settings', function (t) {
  var bodies = createRandomBodies(2, 300);
  var settings = { gravity: -12, theta: 0.8 };
  var dualTree = createDualTreeFor(2)(settings);
  dualTree.computeForces(bodies);
  var before = bodies[0].force.x;

  settings.gravity = -24;
  dualTree.computeForces(bodies);
  t.ok(Math.abs(bodies[0].force.x - 2 * before) < 1e-9 * Math.abs(before), 'Gravity is read on every call');

  bodies.splice(10, 100);
  dualTree.computeForces(bodies);
  var exact = exactForces(bodies, 2, settings.gravity);
  var error = 0, norm = 0;
  bodies.forEach(function (body, i) {
    error += Math.pow(body.force.x - exact[2 * i], 2) + Math.pow(body.force.y - exact[2 * i + 1], 2);
    norm += exact[2 * i] * exact[2 * i] + exact[2 * i + 1] * exact[2 * i + 1];
  });
  t.ok(Math.sqrt(error / norm) < 0.06, 'Forces are correct after bodies are removed');
  t.end();
});

test('layout can use dual tree', function (t) {
  var createLayout = require('..');
  var graph = require('ngraph.generators').grid(10, 10);
  var layout = createLayout(graph, { nbody: 'dualtree' });
  for (var i = 0; i < 100; ++i) layout.step();
  var rect = layout.getGraphRect();
  t.ok(Number.isFinite(rect.min_x) && Number.isFinite(rect.max_y), 'Layout is finite');
  t.ok(rect.max_x - rect.min_x > 10, 'Nodes are spread out');

  layout.simulator.nbody('quadtree');
  layout.step();
  layout.simulator.nbody('dualtree');
  layout.step();
  t.ok(Number.isFinite(layout.getGraphRect().min_x), 'Can switch at run time');
  t.end();
});

function variableNames(dimensions) {
  var names = [];
  for (var k = 0; k < dimensions; ++k) names.push(getVariableName(k));
  return names;
}

function createRandomBodies(dimensions, count) {
  var Body = require('../lib/codeGenerators/generateCreateBody')(dimensions);
  var names = variableNames(dimensions);
  var bodies = [];
  for (var i = 0; i < count; ++i) {
    var body = new Body();
    // a few clusters, to make the tree uneven
    var cluster = i % 5;
    names.forEach(function (name) {
      body.pos[name] = cluster * 30 + (random.nextDouble() - 0.5) * (cluster + 1) * 20;
    });
    body.mass = 1 + random.next(4);
    bodies.push(body);
  }
  return bodies;
}

function exactForces(bodies, dimensions, gravity) {
  var names = variableNames(dimensions);
  var forces = new Float64Array(bodies.length * dimensions);
  bodies.forEach(function (body, i) {
    bodies.forEach(function (other, j) {
      if (i === j) return;
      var r2 = 0;
      var d = names.map(function (name) {
        var delta = other.pos[name] - body.pos[name];
        r2 += delta * delta;
        return delta;
      });
      var v = gravity * body.mass * other.mass / (r2 * Math.sqrt(r2));
      d.forEach(function (delta, k) { forces[i * dimensions + k] += v * delta; });
    });
  });
  return forces;
}
