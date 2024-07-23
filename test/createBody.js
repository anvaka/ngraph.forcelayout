
import t from 'tap';
import generateCreateBodyFunction from '../lib/codeGenerators/generateCreateBody.js';
import { generateCreateVectorFunction } from '../lib/codeGenerators/generateCreateBody.js';

const dimensions = 2;
const Body = generateCreateBodyFunction(dimensions, true);
const Vector = generateCreateVectorFunction(dimensions, true);

t.test('can debug setters in Body', function (t) {
  const b = new Body();
  t.throws(() => b.pos.x = 'foo', /Cannot set non-numbers to x/);
  t.throws(() => b.pos.y = 'foo', /Cannot set non-numbers to y/);
  t.end();
});

t.test('can debug setters in Vector', function (t) {
  const v = new Vector();
  t.throws(() => v.x = 'foo', /Cannot set non-numbers to x/);
  t.throws(() => v.y = 'foo', /Cannot set non-numbers to y/);
  t.end();
});