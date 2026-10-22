// The generic pyramid's plan without a device: grid sizes, refusals with their numbers, storage
// bindings per kernel, laws and tables, and the section a node kernel fuses.
//
//   node modules/gpu/test/pyramid.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { planPyramid, chooseGrid, pyramidMemory } from '../pyramid/plan.js';
import { SPEC_LIMITS } from '../check.js';

const require = createRequire(import.meta.url);
const createRepulsionLaw = require('../../../lib/repulsionLaw.js');

const pos = D => ({ buffer: 'S', at: (row, k) => `S[${row} * ${D}u + ${k}u]` });
const column = (buffer, block) => ({ buffer, at: row => `${buffer}[${block}u * TP.n + ${row}]` });

function plan(D, n, channels, limits = SPEC_LIMITS) {
  return planPyramid({ D, n, limits, pos: pos(D), channels });
}

const stock = [{ stage: 'repulsion', law: null, centroid: 'own', charge: column('H', 0) }];

function v25(law = null) {
  const out = [stock[0], { stage: 'domainPush', law, centroid: 'shared', charge: column('H', 0) }];
  for (let a = 0; a < 4; a++) out.push({ stage: 'domainPush' + a, law, centroid: 'shared', charge: column('C', a) });
  return out;
}

function storageBindings(code) {
  return (code.match(/var<storage\b/g) || []).length;
}

test('grids: 2D as the stock template, 3D with about two cells per body', () => {
  assert.deepEqual([1000, 10000, 100000, 1000000].map(n => chooseGrid(n, 2)), [32, 128, 256, 1024]);
  assert.deepEqual([1000, 7237, 100000, 1000000].map(n => chooseGrid(n, 3)), [16, 32, 64, 64]);
  const p = plan(3, 100000, stock);
  assert.equal(p.refusal, null);
  assert.deepEqual([p.sizes.G, p.sizes.levels, p.sizes.nCells], [64, 6, 262144]);
  assert.equal(p.dispatches, 16);
});

test('every kernel fits 8 storage buffers, with columns in up to three buffers', () => {
  for (const D of [2, 3]) {
    for (const channels of [stock, v25()]) {
      const p = plan(D, 50000, channels);
      for (const [name, code] of Object.entries(p.kernels)) {
        assert.ok(storageBindings(code) <= 8, `${D}D ${name}: ${storageBindings(code)} storage buffers`);
      }
      assert.equal(p.section.bindings.length, 3, 'the section binds treeSp, treeMeta, treeCells');
    }
  }
});

test('channels: one law object or one spec is one law group; shared centres are not stored', () => {
  const fade = { force: 'u = r / L; (1 + u) * exp(-u) / r^2', params: { L: 10 }, range: '6 * L' };
  const a = createRepulsionLaw(fade), b = createRepulsionLaw(fade);
  [a, b].forEach(law => law.update({ settings: { dimensions: 2 } }));
  const p = plan(2, 5000, [
    { stage: 'repulsion', law: a, centroid: 'own', charge: column('H', 0) },
    { stage: 'core', law: null, centroid: 'own', charge: column('C', 0) },
    { stage: 'leaves', law: b, centroid: 'shared', charge: column('C', 1) },
  ]);
  assert.equal(p.refusal, null);
  assert.deepEqual(p.groups.map(g => g.channels), [[0, 2], [1]]);
  // S_0, C_0 (2), S_1, C_1 (2), S_2: the leaves act from channel 0's centre
  assert.equal(p.layout.CSW, 7);
  assert.match(p.kernels.TREE_LOCAL, /tree_in_0\(r2\)/);
  const v = plan(2, 5000, v25());
  assert.equal(v.layout.CSW, 3 + 5, 'six charges at one centre: 8 numbers per cell');
  assert.equal(v.groups.length, 1, '1/r^2 is evaluated once for all six');
});

test('laws with tables print as lookups in treeCells; JavaScript functions are refused', () => {
  const values = new Float64Array(65).map((_, k) => Math.exp(-k / 8));
  const table = createRepulsionLaw({ force: 'E(r / F) / r^2', params: { F: 30 }, range: '6 * F', tables: { E: { from: 0, to: 8, values } } });
  table.update({ settings: { dimensions: 2 } });
  const p = plan(2, 5000, [{ stage: 'repulsion', law: table, centroid: 'own', charge: column('H', 0) }]);
  assert.equal(p.refusal, null);
  assert.match(p.section.declarations, /fn tree_table_0_E\(x: f32\)/);
  assert.match(p.section.declarations, /tree_slope_0_E\(/);
  assert.doesNotMatch(p.section.declarations, /lawFunctions/);
  assert.equal(p.layout.TAB4, Math.ceil(65 / 4));

  const custom = createRepulsionLaw({ force: 'f(r) / r^2', functions: { f: { value: x => x } } });
  custom.update({ settings: { dimensions: 2 } });
  const refused = plan(2, 5000, [{ stage: 'repulsion', law: custom, centroid: 'own', charge: column('H', 0) }]);
  assert.equal(refused.refusal, 'repulsion: laws with JavaScript functions run on the CPU only');
});

test('refusals name what does not fit, with the numbers', () => {
  assert.equal(plan(4, 1000, stock).refusal, 'the grid pyramid is 2D and 3D; this layout is 4D');
  const big = plan(2, 1000000, v25());
  assert.equal(big.refusal, 'the tree pass with 6 charges in 2D at 1,000,000 bodies needs 213 MiB for its cells; this device allows 128 MiB per buffer');
  assert.equal(plan(2, 1000000, v25(), Object.assign({}, SPEC_LIMITS, { maxStorageBufferBindingSize: 2 ** 32 - 4, maxBufferSize: 2 ** 32 - 4 })).refusal, null);
  const bytes = pyramidMemory(2, 1000000, v25());
  assert.equal(bytes.treeCells, big.buffers.treeCells);
});

test('the section adds to the force variables it is given', () => {
  const p = plan(3, 20000, v25());
  const code = p.section.code({ t: 't', i: 'i', force: ['fx', 'fy', 'fz'], sensitivity: c => (c === 0 ? null : `C[${c}u]`) });
  assert.match(code, /tree_force\(tk, array<f32, 6>\(tree_charge\(tk, 0u\), C\[1u\]/);
  assert.match(code, /fx \+= tf\.x; fy \+= tf\.y; fz \+= tf\.z;/);
  assert.match(p.section.code({ t: null, i: 'row', force: ['a', 'b', 'c'] }), /let tk = tree_slot\(row\)/);
  assert.equal(p.section.row('t'), 'tree_row(t)');
});
