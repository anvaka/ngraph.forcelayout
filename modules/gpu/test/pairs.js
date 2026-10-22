// The pair lowering's plan without a device: the formula's i and j variants, accumulators and
// their write modes, sorts per radius, storage bindings per kernel, refusals, the node section
// and the guard's message.
//
//   node modules/gpu/test/pairs.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { printPairFormula, pairAccumulators } from '../pairs/formula.js';
import { planPairs, pairOutputs, statusMessage } from '../pairs/plan.js';
import { createPrinter } from '../wgsl/print.js';
import { SPEC_LIMITS } from '../check.js';

const require = createRequire(import.meta.url);
const createLayout = require('../../../index.js');
const createGraph = require('ngraph.graph');

const N = 2000;

function simulatorWith(D, addStages) {
  const graph = createGraph();
  for (let i = 0; i < N; i++) graph.addNode(i);
  for (let i = 1; i < N; i++) graph.addLink(i, i >> 1);
  const layout = createLayout(graph, { dimensions: D });
  const sim = layout.simulator;
  sim.store.define('stiff', Float64Array);
  sim.store.define('piece', Int32Array);
  sim.store.define('off', Float64Array, D);
  sim.store.define('w', Float64Array);
  sim.addNodeFormula('weigh', { formula: 'w = mass * 2' });
  addStages(sim);
  return sim;
}

const slot = { decl: b => `@group(0) @binding(${b}) var<uniform> V: array<vec4f, 16>;`, at: i => `V[${i >> 2}].${'xyzw'[i & 3]}` };

// A host for planPairs: columns in S (written by stages) and H, hidden outputs in S
function plan(sim, names, options = {}) {
  const program = sim.program();
  const D = program.dims;
  const columns = {};
  let offset = 0;
  program.columns.nodes.forEach(c => {
    if (c.name === 'pos' || c.hidden) return;
    const width = c.width === 'D' ? D : c.width;
    const buffer = String(c.writer).startsWith('stage:') ? 'S' : 'H';
    const at = offset;
    offset += N * width;
    columns[c.name] = { width: c.width, ref: { buffer, at: (row, k) => `${buffer}[${at}u + ${row} * ${width}u + ${k}u]` } };
  });
  let next = 8;
  const stages = names.map(name => {
    const stage = program.stages.find(s => s.name === name);
    const outputs = {};
    pairOutputs(stage, D, columns).forEach(o => { const at = offset; offset += N * o.width; outputs[o.name] = { buffer: 'S', at: (row, k) => `S[${at}u + ${row} * ${o.width}u + ${k}u]` }; });
    const params = {}, builtIns = {};
    stage.params.forEach(p => { params[p.name] = next++; });
    stage.builtIns.forEach(b => { builtIns[b] = next++; });
    return { stage, radius: next++, gate: stage.when ? next++ : undefined, params, builtIns, outputs };
  });
  return planPairs(Object.assign({
    D, n: N, limits: SPEC_LIMITS, stages, columns, sums: { total: { width: 1, at: () => 'S[0u]' } }, slot,
    pos: { buffer: 'X', at: (row, k) => `X[${row} * ${D}u + ${k}u]` }, origin: k => k,
  }, options));
}

const symmetric = sim => sim.addPairFormula('crowd', {
  radius: 3, startAtZero: ['stiff'], params: { c: 2 },
  formula: 'weight = c * (1 / mass_i + 1 / mass_j) * w_j; stiff_i += weight; stiff_j -= 2 * weight; push = weight * (1 - r)',
});

test('a symmetric formula prints an i and a j variant; each keeps only its own end\'s additions', () => {
  const sim = simulatorWith(2, symmetric);
  const stage = sim.program().stages.find(s => s.name === 'crowd');
  const read = (column, who, k) => `${who}_${column}_${k}`;
  const printed = printPairFormula(stage, {
    D: 2, printer: createPrinter(), columns: Object.fromEntries(sim.program().columns.nodes.map(c => [c.name, c])),
    read, param: name => 'P_' + name, builtIn: name => 'B_' + name,
  });
  const i = printed.i.join('\n'), j = printed.j.join('\n');
  assert.match(i, /me_mass_0/);
  assert.match(i, /other_w_0/, 'i-variant: w_j is the other body');
  assert.match(j, /me_w_0/, 'j-variant: w_j is me');
  assert.match(i, /pair_acc_stiff \+= /);
  assert.doesNotMatch(i, /pair_acc_stiff -= /, 'the i-variant drops stiff_j');
  assert.match(j, /pair_acc_stiff -= /);
  assert.doesNotMatch(j, /pair_acc_stiff \+= /, 'the j-variant drops stiff_i');
  assert.match(i, /pair_push = /);
  assert.deepEqual(printed.accumulators, [{ column: 'stiff', width: 1, startAtZero: true }]);
  assert.deepEqual(printed.reads.sort(), ['mass', 'w']);
});

test('a one-sided formula has only the i-variant; vector accumulators have D numbers', () => {
  const sim = simulatorWith(3, s => s.addPairFormula('side', { radius: 2, symmetric: false, formula: 'off_i += pos_j - pos_i; push = 1' }));
  const program = sim.program();
  const stage = program.stages.find(s => s.name === 'side');
  const columns = Object.fromEntries(program.columns.nodes.map(c => [c.name, c]));
  const printed = printPairFormula(stage, { D: 3, printer: createPrinter(), columns, read: (c, who, k) => `${who}_${c}_${k}`, param: () => '', builtIn: () => '' });
  assert.equal(printed.j, null);
  assert.equal(printed.i.filter(line => /pair_acc_off_\d/.test(line)).length, 3);
  assert.deepEqual(pairAccumulators(stage, 3, columns), [{ column: 'off', width: 3, startAtZero: false }]);
});

test('kernels fit 8 storage buffers when formulas read columns from S and H', () => {
  for (const D of [2, 3, 4]) {
    const sim = simulatorWith(D, symmetric);
    const p = plan(sim, ['crowd']);
    assert.equal(p.refusal, null);
    for (const [name, code] of Object.entries(p.kernels)) {
      const storage = (code.match(/var<storage\b/g) || []).length;
      assert.ok(storage <= 8, `${D}D ${name}: ${storage}`);
    }
    assert.equal(p.dispatches, 10, '8 for the sort and work list, chunks and gather');
    assert.match(p.kernels.PAIR_EVAL_0, new RegExp(`o < ${3 ** D}u`), '3^D neighbour cells');
  }
});

test('stages with the same number as radius share a sort; others get their own', () => {
  const sim = simulatorWith(2, s => {
    s.addPairFormula('a', { radius: 3, formula: 'push = 1' });
    s.addPairFormula('b', { radius: 3, formula: 'push = 2' });
    s.addPairFormula('c', { radius: () => 3, formula: 'push = 3' });
  });
  const p = plan(sim, ['a', 'b', 'c']);
  assert.equal(p.sorts.length, 2);
  assert.deepEqual(p.sorts.map(s => s.stages.map(e => e.stage.name)), [['a', 'b'], ['c']]);
  assert.equal(p.dispatches, 2 * 8 + 3 * 2);
});

test('refusals: 5D and more, memory', () => {
  const sim5 = simulatorWith(5, symmetric);
  assert.equal(plan(sim5, ['crowd']).refusal, 'pair formulas in 5D and more need a tree search');
  const sim = simulatorWith(2, symmetric);
  const small = plan(sim, ['crowd'], { limits: Object.assign({}, SPEC_LIMITS, { maxStorageBufferBindingSize: 4096 }) });
  assert.match(small.refusal, /the pair formulas at 2,000 bodies need .* this device allows 0\.0 MiB per buffer/);
});

test('the node section: gate, startAtZero, totals only when the radius is positive', () => {
  const sim = simulatorWith(2, s => s.addPairFormula('crowd', {
    radius: 3, startAtZero: ['stiff'], when: 'step > 3', formula: 'stiff_i += 1; stiff_j += 1; push = 1',
  }));
  const p = plan(sim, ['crowd']);
  const code = p.section('crowd').code({ force: ['f0', 'f1'], local: (column, k) => `L_${column}_${k}` }).join('\n');
  const stage = p.stages[0];
  assert.match(code, new RegExp(`^if \\(${escape(slot.at(stage.gate))} != 0\\.0\\) \\{`));
  assert.match(code, /L_stiff_0 = 0\.0;/);
  assert.match(code, new RegExp(`if \\(${escape(slot.at(stage.radius))} > 0\\.0\\) \\{ f0 \\+= S\\[`));
  assert.match(code, /L_stiff_0 \+= S\[/);
});

test('the guard\'s message names the stage and the count', () => {
  const sim = simulatorWith(2, symmetric);
  const p = plan(sim, ['crowd']);
  assert.equal(statusMessage(p, new Uint32Array(5)), null);
  const message = statusMessage(p, Uint32Array.from([1, 0, 39100000, p.capChunks, 0]));
  assert.match(message, /^the pair formula crowd needed about 1\.0e10 pair tests in one step; the GPU stops at /);
  assert.match(statusMessage(p, Uint32Array.from([1, 0, 0xffffffff, p.capChunks, 0])), /needed more than /);
});

function escape(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
