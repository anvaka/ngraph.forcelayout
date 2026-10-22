var test = require('tap').test;
var dimensions = 2;
var createDragForce = require('../lib/codeGenerators/generateCreateDragForce')(dimensions);
var createBodies = require('./helpers/createBodies');

test('reduces force value', function (t) {
  var {store, bodies: [body]} = createBodies(1, dimensions);
  body.force.x = 1; body.force.y = 1;
  body.velocity.x = 1; body.velocity.y = 1;

  var dragForce = createDragForce({ dragCoefficient: 0.1 });
  dragForce.update(store);

  t.ok(body.force.x < 1 && body.force.y < 1, 'Force value is reduced');
  t.end();
});

test('Initialized with default value', function (t) {
  t.throws(() => createDragForce());
  t.end();
});