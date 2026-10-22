// T3: the law WGSL of the module's printer against the text the library printed before the
// printer moved here (fixtures/t3.json: 16 laws in 2, 3 and 4 dimensions), and the law's numbers
// as the GPU gets them. Laws whose builtins were already safe print byte for byte as before; the
// tanh law differs only by the clamp (undoSafePrintings()).
//
//   node modules/gpu/test/t3.js
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { LAWS, DIMS, spec, lawId, lawContext, undoSafePrintings } from './laws.js';
import { emitLaw, lawPrologue, writeLawValues, lawValueCount } from '../wgsl/print.js';

const require = createRequire(import.meta.url);
const createRepulsionLaw = require('../../../lib/repulsionLaw.js');
const fixtures = JSON.parse(fs.readFileSync(new URL('./fixtures/t3.json', import.meta.url), 'utf8')).pairs;

test('T3: law WGSL and numbers as the library printed them', () => {
  let same = 0, safe = 0, total = 0;
  for (const D of DIMS) {
    LAWS.forEach((text, index) => {
      const id = `${lawId(index)}-${D}`;
      const expected = fixtures[id];
      const law = createRepulsionLaw(spec(text));
      total++;
      let wgsl, k1;
      try {
        wgsl = emitLaw(law, D, 'r', 'k1', 'k2') + lawPrologue(law, i => 'v[' + i + ']');
        k1 = emitLaw(law, D, 'r', 'k1');
      } catch (e) {
        assert.ok(expected.wgsl.startsWith('refused: '), `${id}: refused now (${e.message}), printed before`);
        same++;
        return;
      }
      assert.ok(!expected.wgsl.startsWith('refused: '), `${id}: printed now, refused before`);
      if (wgsl === expected.wgsl && k1 === expected.k1) same++;
      else {
        assert.equal(undoSafePrintings(wgsl), expected.wgsl, `${id}: only safe printings may differ`);
        assert.equal(undoSafePrintings(k1), expected.k1, `${id} (k1 form): only safe printings may differ`);
        safe++;
      }
      law.update(lawContext(D));
      assert.equal(lawValueCount(law), expected.valueCount, `${id}: number of values`);
      const out = new Float32Array(expected.valueCount);
      writeLawValues(law, out, 0);
      assert.deepEqual(Array.from(out), expected.values, `${id}: values`);
    });
  }
  console.log(`T3: ${same}/${total} law/dimension pairs print identical WGSL; ${safe} differ only by safe builtins (tanh clamped)`);
  assert.equal(same + safe, total);
});
