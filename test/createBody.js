
const test = require('tap').test;
const dimensions = 2;

test('can debug setters', function (t) {
  const Body = require('../lib/codeGenerators/generateCreateBody')(dimensions, true);
  const b = new Body();
  t.throws(() => b.pos.x = 'foo', /Cannot set non-numbers to x/);
  // t.throws(() => b.pos.y = 'foo', /Cannot set non-numbers to x/);
  t.end();
});

test('can create appropriate debug setter code', function (t) {
  const Vector = require('../lib/codeGenerators/generateCreateBody').generateCreateVectorFunction(dimensions, true);
  const v = new Vector();
  t.throws(() => v.x = 'foo', /Cannot set non-numbers to x/);
  // t.throws(() => v.y = 'foo', /Cannot set non-numbers to x/);
  t.end();
})