var test = require('tap').test;
var dimensions = 2;
var createBodies = require('./helpers/createBodies');
var integrate = require('../lib/codeGenerators/generateIntegrator')(dimensions);

test('Body preserves velocity without forces', function (t) {
  var {store, bodies: [body]} = createBodies(1, dimensions);
  var timeStep = 1;
  body.mass = 1; body.velocity.x = 1;

  integrate(store, timeStep);
  t.equal(body.pos.x, 1, 'Should move by 1 pixel on first iteration');

  timeStep = 2; // let's increase time step:
  integrate(store, timeStep);
  t.equal(body.pos.x, 3, 'Should move by 2 pixel on second iteration');
  t.end();
});

test('Body gains velocity under force', function (t) {
  var {store, bodies: [body]} = createBodies(1, dimensions);
  var timeStep = 1;
  body.mass = 1; body.force.x = 0.1;

  // F = m * a;
  // since mass = 1 =>  F = a = y';
  integrate(store, timeStep);
  t.equal(body.velocity.x, 0.1, 'Should increase velocity');

  integrate(store, timeStep);
  t.equal(body.velocity.x, 0.2, 'Should increase velocity');
  // floating point math:
  t.ok(0.29 < body.pos.x && body.pos.x < 0.31, 'Position should be at 0.3 now');

  t.end();
});

test('No bodies yield 0 movement', function (t) {
  var movement = integrate(createBodies(0).store, 2);
  t.equal(movement, 0, 'Nothing has moved');
  t.end();
});

test('Body does not move faster than 1px', function (t) {
  var {store, bodies: [body]} = createBodies(1, dimensions);
  var timeStep = 1;
  body.mass = 1; body.force.x = 2;

  integrate(store, timeStep);
  t.ok(body.velocity.x <= 1, 'Velocity should be within speed limit');

  integrate(store, timeStep);
  t.ok(body.velocity.x <= 1, 'Velocity should be within speed limit');

  t.end();
});

test('Can get total system movement', function (t) {
  var {store, bodies: [body]} = createBodies(1, dimensions);
  var timeStep = 1;
  body.mass = 1; body.velocity.x = 0.2;

  var movement = integrate(store, timeStep);
  // to improve performance, integrator does not take square root, thus
  // total movement is .2 * .2 = 0.04;
  t.ok(0.04 <= movement && movement <= 0.041, 'System should travel by 0.2 pixels');
  t.end();
});

test('Body does not move faster than maxVelocity', function (t) {
  var {store, bodies: [body]} = createBodies(1, dimensions);
  body.mass = 1; body.force.x = 10;

  integrate(store, 1, 0, 4);
  t.equal(body.velocity.x, 4, 'Velocity is clamped to maxVelocity');
  t.end();
});

test('Adaptive time step of one body does not leak into another', function (t) {
  var {store, bodies: [withSprings, withoutSprings]} = createBodies(2, dimensions);
  withSprings.springCount = 1; withSprings.springLength = 100;
  withoutSprings.velocity.x = 0.5;

  integrate(store, 1, 0.1);
  t.equal(withoutSprings.pos.x, 0.5, 'Body without springs uses the global time step');
  t.end();
});
