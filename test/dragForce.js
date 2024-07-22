const test = require('tap').test;
const dimensions = 2;
const createDragForce = require('../lib/codeGenerators/generateCreateDragForce')(dimensions);
const Body = require('../lib/codeGenerators/generateCreateBody')(dimensions);

test('reduces force value', function (t) {
  const body = new Body();
  body.force.x = 1; body.force.y = 1;
  body.velocity.x = 1; body.velocity.y = 1;

  const dragForce = createDragForce({ dragCoefficient: 0.1 });
  dragForce.update(body);

  t.ok(body.force.x < 1 && body.force.y < 1, 'Force value is reduced');
  t.end();
});

test('Initialized with default value', function (t) {
  t.throws(() => createDragForce());
  t.end();
});