var test = require('tap').test;
var dimensions = 2;
var Body = require('../lib/codeGenerators/generateCreateBody')(dimensions);
var createFireIntegrator = require('../lib/codeGenerators/generateFireIntegrator')(dimensions);

test('Body starts moving along the force', function (t) {
  var integrate = createFireIntegrator();
  var body = new Body();
  body.force.x = 0.1;

  integrate([body], 1);
  t.equal(body.velocity.x, 0.1, 'Velocity grows by force');
  t.equal(body.pos.x, 0.1, 'Body moves');

  integrate([body], 1);
  t.ok(body.velocity.x > 0.1, 'Body keeps its momentum while moving downhill');
  t.end();
});

test('Velocities are reset when the system goes uphill', function (t) {
  var integrate = createFireIntegrator();
  var body = new Body();
  body.velocity.x = 0.5;
  body.force.x = -0.1;

  integrate([body], 1);
  t.ok(Math.abs(body.velocity.x - (-0.1)) < 1e-12, 'Old velocity is dropped');
  t.end();
});

test('Velocity is steered towards the force', function (t) {
  var integrate = createFireIntegrator();
  var body = new Body();
  body.velocity.x = 1;
  body.force.x = 1;
  body.force.y = 1;

  integrate([body], 1, 0, 100);
  // v = 0.9 * (1, 0) + 0.1 * |v|/|F| * (1, 1) + F
  t.ok(Math.abs(body.velocity.x - (0.9 + 0.1 / Math.SQRT2 + 1)) < 1e-12, 'x is mixed');
  t.ok(Math.abs(body.velocity.y - (0.1 / Math.SQRT2 + 1)) < 1e-12, 'y is mixed');
  t.end();
});

test('It respects max velocity and pinned bodies', function (t) {
  var integrate = createFireIntegrator();
  var body = new Body();
  var pinned = new Body();
  pinned.isPinned = true;
  body.force.x = 10;
  pinned.force.x = 10;

  integrate([body, pinned], 1, 0, 4);
  t.equal(body.velocity.x, 4, 'Velocity is clamped by max velocity');
  t.equal(pinned.pos.x, 0, 'Pinned body does not move');
  t.end();
});

test('No bodies yield 0 movement', function (t) {
  t.equal(createFireIntegrator()([], 1), 0, 'Nothing has moved');
  t.end();
});

test('Layout can use FIRE integrator', function (t) {
  var createLayout = require('..');
  var graph = require('ngraph.generators').balancedBinTree(6);
  var layout = createLayout(graph, { integrator: 'fire', maxVelocity: 4 });
  for (var i = 0; i < 200; ++i) layout.step();
  var rect = layout.getGraphRect();
  t.ok(Number.isFinite(rect.min_x) && Number.isFinite(rect.max_y), 'Layout is finite');

  layout.simulator.integrator('euler');
  layout.step();
  t.ok(Number.isFinite(layout.getGraphRect().min_x), 'Can switch at run time');
  t.end();
});
