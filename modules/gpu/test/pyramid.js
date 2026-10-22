// The generic pyramid's plan without a device: grid sizes, refusals with their numbers, storage
// bindings per kernel, laws and tables, and the section a node kernel fuses.
//
//   node modules/gpu/test/pyramid.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { planPyramid, chooseGrid, pyramidMemory, pyrLevels } from '../pyramid/plan.js';
import { walkGroups, walkChannels } from '../pyramid/channels.js';
import { pyramidStatus } from '../pyramid/build.js';
import { SPEC_LIMITS } from '../check.js';

const require = createRequire(import.meta.url);
const createRepulsionLaw = require('../../../lib/repulsionLaw.js');

const pos = D => ({ buffer: 'S', at: (row, k) => `S[${row} * ${D}u + ${k}u]` });
const column = (buffer, block) => ({ buffer, at: row => `${buffer}[${block}u * TP.n + ${row}]` });

function plan(D, n, channels, options = {}) {
  return planPyramid(Object.assign({ D, n, limits: SPEC_LIMITS, pos: pos(D), channels }, options));
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

test('grids: 2D as the stock template (twice as fine up to 8,192 bodies), 3D with about two cells per body', () => {
  assert.deepEqual([1000, 7237, 8192, 10000, 100000, 1000000].map(n => chooseGrid(n, 2)), [64, 128, 128, 128, 256, 1024]);
  assert.deepEqual([1000, 7237, 100000, 1000000].map(n => chooseGrid(n, 3)), [16, 32, 64, 64]);
  const p = plan(3, 100000, stock);
  assert.equal(p.refusal, null);
  assert.deepEqual([p.sizes.G, p.sizes.levels, p.sizes.nCells], [64, 6, 262144]);
  assert.equal(p.dispatches, 13, '10, 2 PYR for 6 levels (2 a workgroup, AGG0 the first 2), and the heavy cells');
  assert.deepEqual(pyrLevels(7, 4), [{ from: 4, steps: 3 }], '2D at 10k: AGG0 does 4 levels, one PYR the other 3');
  assert.deepEqual(pyrLevels(10, 4), [{ from: 4, steps: 4 }, { from: 8, steps: 2 }]);
  assert.equal(pyrLevels(3, 4).length, 0);
  assert.equal(pyrLevels(6, 0).length, 6, 'without blocks, one level a dispatch');
  assert.ok(p.kernels.TREE_HEAVY, 'heavy cells: 3D only');
  assert.equal(plan(2, 100000, stock).kernels.TREE_HEAVY, undefined);
});

test('hubs: 2D lists heavy bodies in AGG0 and gives them their own far field in TREE_LOCAL', () => {
  const p2 = plan(2, 10000, stock), p3 = plan(3, 10000, stock);
  assert.equal(p2.hubs, true);
  assert.equal(p3.hubs, false, '3D has its heavy cells');
  assert.match(p2.kernels.TREE_HIST, /qpart/, 'HIST sums |charge| per workgroup');
  assert.match(p2.kernels.TREE_AGG0, /heavyQ/);
  assert.match(p2.kernels.TREE_LOCAL, /fn tree_hub/);
  assert.match(p2.section.declarations, /let hub = \(raw >> 20u\)/);
  assert.doesNotMatch(p3.kernels.TREE_LOCAL, /tree_hub/);
  assert.equal(plan(2, 10000, stock, { hubs: false }).kernels.TREE_LOCAL.includes('tree_hub'), false);
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
  assert.equal(planPyramid({ D: 3, n: 1000, limits: SPEC_LIMITS, pos: pos(3), channels: stock, grid: 128 }).refusal,
    'the grid pyramid takes up to 2^20 cells; 128^3 is more');
  const big = plan(2, 1000000, v25());
  assert.equal(big.refusal, 'the tree pass with 6 charges in 2D at 1,000,000 bodies needs 259 MiB for its cells; this device allows 128 MiB per buffer');
  assert.equal(plan(2, 1000000, v25(), { limits: Object.assign({}, SPEC_LIMITS, { maxStorageBufferBindingSize: 2 ** 32 - 4, maxBufferSize: 2 ** 32 - 4 }) }).refusal, null);
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

test('walk groups: the library\'s walks, else tree stages next to each other', () => {
  const tree = (name, walk, channel = {}) => ({ name, shape: 'tree', args: { channels: [Object.assign({ charge: 'mass', sensitivity: 'mass', centroid: 'own' }, channel)], walk } });
  const node = name => ({ name, shape: 'node', args: {} });
  const walk = stages => ({ stages, index: 0, charges: stages.length, tree: 'quadtree' });
  const names = groups => groups.map(group => group.map(stage => stage.name));
  const three = ['repulsion', 'core', 'leaves'];
  assert.deepEqual(names(walkGroups({ stages: [node('clear'), tree('repulsion', walk(three)), tree('core', walk(three)),
    tree('leaves', walk(three), { charge: 'leafq', sensitivity: 'core', centroid: 'shared' }), node('drag')] })), [three]);
  assert.deepEqual(names(walkGroups({ stages: [tree('repulsion', walk(['repulsion'])), tree('gated', walk(['gated']))] })), [['repulsion'], ['gated']]);
  assert.deepEqual(names(walkGroups({ stages: [tree('a'), tree('b'), node('n'), tree('c')] })), [['a', 'b'], ['c']]);
  const group = walkGroups({ stages: three.map((name, k) => tree(name, walk(three), k === 2 ? { charge: 'leafq', sensitivity: 'core', centroid: 'shared' } : {})) })[0];
  const channels = walkChannels(group, { column: name => ({ buffer: 'H', name }), law: () => null });
  assert.deepEqual(channels.map(c => [c.stage, c.centroid, c.charge.name, c.sensitivity, c.sameColumn]),
    [['repulsion', 'own', 'mass', 'mass', true], ['core', 'own', 'mass', 'mass', true], ['leaves', 'shared', 'leafq', 'core', false]]);
});

test('laws that fall slower than 1/r^2 get second-order expansions, and wider near cells in 2D', () => {
  const law = spec => { const compiled = createRepulsionLaw(spec); compiled.update({ settings: { dimensions: 2 } }); return compiled; };
  const one = (D, compiled) => plan(D, 5000, [{ stage: 'repulsion', law: compiled, centroid: 'own', charge: column('H', 0) }]);
  const slow = { force: 'a / r', params: { a: 10 } };
  assert.equal(one(2, law(slow)).groups[0].second, true);
  assert.equal(one(2, law(slow)).layout.LSW, 2 + 2 + 3 + 4, 'centre, field, Jacobian, 4 second derivatives');
  assert.equal(one(3, law(slow)).groups[0].second, true);
  assert.match(one(2, law(slow)).section.declarations, /max\(cx0 - 2, 0\)/, '5 x 5 near cells in 2D');
  assert.match(one(3, law(slow)).section.declarations, /max\(cx0 - 1, 0\)/, '3 x 3 x 3 near cells in 3D');
  assert.ok(!one(2, law(slow)).kernels.TREE_HEAVY && one(3, law(slow)).kernels.TREE_HEAVY);
  assert.equal(one(2, law({ force: 'exp(-r / L) / r^2', params: { L: 30 } })).groups[0].second, false);
  assert.equal(one(2, null).groups[0].second, false);
  assert.match(one(2, law(slow)).kernels.TREE_LOCAL, /fn tree_k123_0/);
});

test('crowded cells: a status word turns into a halt message', () => {
  assert.equal(pyramidStatus([0, 3, 0, 120]), null);
  assert.match(pyramidStatus([0, 2, 100000, 20000]), /a grid cell holds 100,000 bodies.*20 billion pair evaluations/);
  assert.match(pyramidStatus([0, 2, 100000, 20000], 4e8), /more than the GPU takes \(0\.40 billion\)/, 'the device\'s own cap');
  assert.match(pyramidStatus([0, 2, 50000, 1200], 2e9, 5), /1\.2 billion pair evaluations a step with 5 charges \(the work of 2\.4 billion with one\), more than the GPU takes \(2\.0 billion\)/);
  const p = plan(2, 100000, stock);
  assert.ok(p.buffers.treeLists >= (4 + Math.floor(100000 / 1025) + 1) * 4, 'room for every crowded cell');
  assert.match(p.section.declarations, /if \(crowded\)/);
});
