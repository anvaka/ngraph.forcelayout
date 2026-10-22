// T4: the stock templates' WGSL against today's module (fixtures/t4.json: the sha256 of every grid
// kernel and of the small engine, for 16 laws in 2D). The tanh law differs only by the clamp of
// the safe printing, undone before hashing.
//
//   node modules/gpu/test/t4.js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { LAWS, spec, lawId, undoSafePrintings } from './laws.js';
import { shaderCode as gridCode } from '../templates/grid.js';
import { shaderCode as smallCode } from '../templates/small.js';

const require = createRequire(import.meta.url);
const createRepulsionLaw = require('../../../lib/repulsionLaw.js');
const fixtures = JSON.parse(fs.readFileSync(new URL('./fixtures/t4.json', import.meta.url), 'utf8')).laws;
const sha = text => crypto.createHash('sha256').update(text).digest('hex');

test('T4: stock template WGSL as today', () => {
  let kernels = 0, same = 0, safe = 0, small = 0;
  LAWS.forEach((text, index) => {
    const id = lawId(index), expected = fixtures[id];
    let law = createRepulsionLaw(spec(text));
    if (law.isDefault) law = null;
    let grid, smallText;
    try {
      grid = gridCode(law);
      smallText = smallCode(law);
    } catch (e) {
      assert.ok(expected.refused, `${id}: refused now (${e.message})`);
      return;
    }
    assert.ok(!expected.refused, `${id}: should be refused`);
    for (const name of Object.keys(expected.grid)) {
      kernels++;
      assert.ok(grid[name] !== undefined, `${id}: ${name} missing`);
      if (sha(grid[name]) === expected.grid[name].sha256) same++;
      else {
        assert.equal(sha(undoSafePrintings(grid[name])), expected.grid[name].sha256, `${id}: ${name} differs`);
        safe++;
      }
    }
    assert.deepEqual(Object.keys(grid).sort(), Object.keys(expected.grid).sort(), `${id}: the same kernels`);
    assert.equal(sha(undoSafePrintings(smallText)), expected.small.sha256, `${id}: small engine differs`);
    small++;
  });
  console.log(`T4: ${same}/${kernels} grid kernels identical, ${safe} differ only by safe builtins (tanh clamped); small engine ${small}/${small}`);
  assert.equal(same + safe, kernels);
});
