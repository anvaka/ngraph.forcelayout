/* eslint-disable no-shadow */
const test = require('tap').test;

const dimensions = 2;
const createSpringForce = require('../lib/codeGenerators/generateCreateSpringForce')(dimensions);
const Body = require('../lib/codeGenerators/generateCreateBody')(dimensions);
const Spring = require('../lib/spring');
const random = require('ngraph.random')(42);

test('Initialized with default value', function (t) {
  t.throws(() => createSpringForce());
  t.end();
});


test('Should bump bodies at same position', function (t) { 
  const body1 = new Body(0, 0);
  const body2 = new Body(0, 0);
  // length between two bodies is 2, while ideal length is 1. Each body
  // should start moving towards each other after force update
  const idealLength = 1;
  const spring = new Spring(body1, body2, idealLength);
  const springForce = createSpringForce({springCoefficient: 0.1, springLength: 1}, random);
  springForce.update(spring);

  t.ok(body1.force.x > 0, 'Body 1 should go right');
  t.ok(body2.force.x < 0, 'Body 2 should go left');
  t.end();
});

test('Check spring force direction', function (t) {
  const springForce = createSpringForce({springCoefficient: 0.1, springLength: 1});

  t.test('Should contract two bodies when ideal length is smaller than actual', function (t) { 
    const body1 = new Body(-1, 0);
    const body2 = new Body(+1, 0);
    // length between two bodies is 2, while ideal length is 1. Each body
    // should start moving towards each other after force update
    const idealLength = 1;
    const spring = new Spring(body1, body2, idealLength);
    springForce.update(spring);

    t.ok(body1.force.x > 0, 'Body 1 should go right');
    t.ok(body2.force.x < 0, 'Body 2 should go left');
    t.end();
  });

  t.test('Should repel two bodies when ideal length is larger than actual', function (t) { 
    const body1 = new Body(-1, 0);
    const body2 = new Body(+1, 0);
    // length between two bodies is 2, while ideal length is 1. Each body
    // should start moving towards each other after force update
    const idealLength = 3;
    const spring = new Spring(body1, body2, idealLength);
    springForce.update(spring);

    t.ok(body1.force.x < 0, 'Body 1 should go left');
    t.ok(body2.force.x > 0, 'Body 2 should go right');
    t.end();
  });

  t.end();
});
