var test = require('tap').test,
    createDragForce = require('../lib/dragForce'),
    physics = require('../lib/primitives');

test('reduces force value', function (t) {
  var body = new physics.Body();
  body.force.x = 1; body.force.y = 1;
  body.velocity.x = 1; body.velocity.y = 1;

  var dragForce = createDragForce({ dragCoeff: 0.1 });
  dragForce.update(body);

  t.ok(body.force.x < 1 && body.force.y < 1, 'Force value is reduced');
  t.end();
});

test('Initialized with default value', function (t) {
  var dragForce = createDragForce();
  var dragCoeff = dragForce.dragCoeff();
  t.ok(typeof dragCoeff === 'number', 'Default value is present');

  t.end();
});

test('Can update default value', function (t) {
  var dragForce = createDragForce();
  var returnedForce = dragForce.dragCoeff(0.0);

  t.ok(dragForce === returnedForce, 'Allows chaining');

  var dragCoeff = dragForce.dragCoeff();
  t.ok(dragCoeff === 0.0, 'Default value is updated');
  t.end();
});
