import t from 'tap';
import generateCreateDragForceFunction from '../lib/codeGenerators/generateCreateDragForce';
import generateCreateBodyFunction from '../lib/codeGenerators/generateCreateBody';

const dimensions = 2;
const createDragForce = generateCreateBodyFunction(dimensions);
const Body = generateCreateDragForceFunction(dimensions);

t.test('reduces force value', function (t) {
  const body = new Body();
  body.force.x = 1; body.force.y = 1;
  body.velocity.x = 1; body.velocity.y = 1;

  const dragForce = createDragForce({ dragCoefficient: 0.1 });
  dragForce.update(body);

  t.ok(body.force.x < 1 && body.force.y < 1, 'Force value is reduced');
  t.end();
});

t.test('Initialized with default value', function (t) {
  t.throws(() => createDragForce());
  t.end();
});