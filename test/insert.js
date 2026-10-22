var test = require('tap').test;

var dimensions = 2;
var createQuadTree = require('../lib/codeGenerators/generateQuadTree')(dimensions);
var createBodies = require('./helpers/createBodies');
var random = require('ngraph.random').random(42);

test('insert and update update forces', function (t) {
  var tree = createQuadTree({}, random);
  var {store, bodies: [body]} = createBodies(1, dimensions);
  var clone = JSON.parse(JSON.stringify(body));

  tree.insertBodies(store);
  tree.updateBodyForce(body.index);
  t.same(JSON.parse(JSON.stringify(body)), clone, 'The body should not be changed - there are no forces acting on it');
  t.end();
});

test('it can get root', function (t) {
  var tree = createQuadTree({}, random);
  var {store, bodies: [body]} = createBodies(1, dimensions);

  tree.insertBodies(store);
  var root = tree.getRoot();
  t.ok(root, 'Root is present');
  t.equal(root.body, body.index, 'Body is initialized');
  t.end();
});

test('Two bodies repel each other', function (t) {
  var tree = createQuadTree({}, random);
  var {store, bodies: [bodyA, bodyB]} = createBodies(2, dimensions);
  bodyA.pos.x = 1; bodyA.pos.y = 0;
  bodyB.pos.x = 2; bodyB.pos.y = 0;

  tree.insertBodies(store);
  tree.updateBodyForce(bodyA.index);
  tree.updateBodyForce(bodyB.index);
  // based on our physical model construction forces should be equivalent, with
  // opposite sign:
  t.ok(bodyA.force.x + bodyB.force.x === 0, 'Forces should be same, with opposite sign');
  t.ok(bodyA.force.x !== 0, 'X-force for body A should not be zero');
  t.ok(bodyB.force.x !== 0, 'X-force for body B should not be zero');
  // On the other hand, our bodies should not move by Y axis:
  t.ok(bodyA.force.y === 0, 'Y-force for body A should be zero');
  t.ok(bodyB.force.y === 0, 'Y-force for body B should be zero');

  t.end();
});

test('Can handle two bodies at the same location', function (t) {
  var tree = createQuadTree({}, random);
  var {store, bodies: [bodyA, bodyB]} = createBodies(2, dimensions);

  tree.insertBodies(store);
  tree.updateBodyForce(bodyA.index);
  tree.updateBodyForce(bodyB.index);

  t.end();
});

test('it does not stuck', function(t) {
  var count = 60000;
  var {store, bodies} = createBodies(count, dimensions);

  bodies.forEach(function(body) {
    body.setPosition(Math.random(), Math.random());
  });

  var quadTree = createQuadTree({}, random);
  quadTree.insertBodies(store);

  bodies.forEach(function(body) {
    quadTree.updateBodyForce(body.index);
  });
  t.ok(1);
  t.end();
});

test('Tree bounds fit bodies with negative coordinates', function (t) {
  var tree = createQuadTree({}, random);
  var {store, bodies: [bodyA, bodyB]} = createBodies(2, dimensions);
  bodyA.pos.x = -20; bodyA.pos.y = -20;
  bodyB.pos.x = -10; bodyB.pos.y = -10;

  tree.insertBodies(store);
  var root = tree.getRoot();
  t.equal(root.max_x - root.min_x, 10, 'Root is as wide as the bodies');
  t.end();
});
