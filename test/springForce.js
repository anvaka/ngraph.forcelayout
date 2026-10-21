/* eslint-disable no-shadow */
var test = require('tap').test;

var dimensions = 2;
var createSpringForce = require('../lib/codeGenerators/generateCreateSpringForce')(dimensions);
var createSpringStore = require('../lib/createSpringStore');
var createBodies = require('./helpers/createBodies');
var random = require('ngraph.random')(42);

test('Initialized with default value', function (t) {
  t.throws(() => createSpringForce());
  t.end();
});

// One spring between two bodies, kept in stores the way a simulator keeps them
function createSpring(from, to, length) {
  var {store, bodies} = createBodies(2, dimensions);
  bodies[0].setPosition(from[0], from[1]);
  bodies[1].setPosition(to[0], to[1]);
  var springs = createSpringStore();
  var row = springs.add();
  springs.from[row] = 0;
  springs.to[row] = 1;
  springs.length[row] = length;
  return {store: store, springs: springs, body1: bodies[0], body2: bodies[1]};
}

test('Should bump bodies at same position', function (t) { 
  // Both bodies are at the same position, while ideal length is 1. Each body
  // should start moving away from each other after force update
  var {store, springs, body1, body2} = createSpring([0, 0], [0, 0], 1);
  var springForce = createSpringForce({springCoefficient: 0.1, springLength: 1}, random);
  springForce.update(springs, store);

  t.ok(body1.force.x > 0, 'Body 1 should go right');
  t.ok(body2.force.x < 0, 'Body 2 should go left');
  t.end();
});

test('Check spring force direction', function (t) {
  var springForce = createSpringForce({springCoefficient: 0.1, springLength: 1});

  t.test('Should contract two bodies when ideal length is smaller than actual', function (t) { 
    // length between two bodies is 2, while ideal length is 1. Each body
    // should start moving towards each other after force update
    var {store, springs, body1, body2} = createSpring([-1, 0], [1, 0], 1);
    springForce.update(springs, store);

    t.ok(body1.force.x > 0, 'Body 1 should go right');
    t.ok(body2.force.x < 0, 'Body 2 should go left');
    t.end();
  });

  t.test('Should repel two bodies when ideal length is larger than actual', function (t) { 
    // length between two bodies is 2, while ideal length is 3. Each body
    // should start moving away from each other after force update
    var {store, springs, body1, body2} = createSpring([-1, 0], [1, 0], 3);
    springForce.update(springs, store);

    t.ok(body1.force.x < 0, 'Body 1 should go left');
    t.ok(body2.force.x > 0, 'Body 2 should go right');
    t.end();
  });

  t.test('Counts springs and their lengths only when asked', function (t) {
    var {store, springs, body1} = createSpring([-1, 0], [1, 0], 3);
    springForce.update(springs, store);
    t.equal(body1.springCount, 0, 'Not counted by default');
    springForce.update(springs, store, true);
    t.equal(body1.springCount, 1, 'Counted');
    t.equal(body1.springLength, 2, 'Length is summed');
    t.end();
  });

  t.end();
});
