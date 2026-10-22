// The device's row order of large layouts (buffers.js bodyOrder): a permutation along a Hilbert
// curve in 2D and in Morton order in 3D, so bodies close in space are close in memory; none below
// HILBERT_MIN_NODES. Node only.
import test from 'node:test';
import assert from 'node:assert/strict';
import { bodyOrder, HILBERT_MIN_NODES } from '../buffers.js';

function grid(n, D, seed = 7) {
  let s = seed;
  const pos = new Float64Array(n * D);
  for (let i = 0; i < n * D; i++) { s = (s * 1664525 + 1013904223) >>> 0; pos[i] = (s / 4294967296 - 0.5) * 1000; }
  return pos;
}

function isPermutation(order, n) {
  const seen = new Uint8Array(n);
  for (let i = 0; i < n; i++) { if (order[i] >= n || seen[order[i]]) return false; seen[order[i]] = 1; }
  return true;
}

test('large layouts get a permutation, small ones keep the store order', () => {
  assert.equal(bodyOrder(grid(HILBERT_MIN_NODES - 1, 2), HILBERT_MIN_NODES - 1, 2), null);
  for (const D of [2, 3]) {
    const n = 20000;
    const order = bodyOrder(grid(n, D), n, D);
    assert.ok(order && isPermutation(order, n), `${D}D: a permutation`);
  }
  assert.equal(bodyOrder(grid(5000, 4), 5000, 4), null, 'only 2D and 3D');
});

test('neighbours in the device order are close in space', () => {
  for (const D of [2, 3]) {
    const n = 20000, pos = grid(n, D);
    const order = bodyOrder(pos, n, D);
    const byDevice = new Uint32Array(n);
    for (let i = 0; i < n; i++) byDevice[order[i]] = i;
    const gap = rows => {
      let sum = 0;
      for (let k = 1; k < n; k++) {
        const a = rows[k - 1], b = rows[k];
        let d2 = 0;
        for (let q = 0; q < D; q++) d2 += (pos[a * D + q] - pos[b * D + q]) ** 2;
        sum += Math.sqrt(d2);
      }
      return sum / (n - 1);
    };
    const store = Uint32Array.from({ length: n }, (_, i) => i);
    assert.ok(gap(byDevice) * 10 < gap(store), `${D}D: consecutive device rows sit ${gap(byDevice).toFixed(1)} apart, store rows ${gap(store).toFixed(1)}`);
  }
});
