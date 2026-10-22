// The grid field's plan without a device: every combination of the stage's options in 2D and 3D,
// storage bindings per kernel, refusals with their numbers, the step's numbers and the halt
// message. The device checks (T6, against modules/gridfield's CPU stage) run in a browser.
//
//   node modules/gpu/test/grid.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import addGridField from '../../gridfield/index.js';
import { planGrid, checkGrid, gridSlotValues, gridIsDynamic, gridStatus } from '../grid/plan.js';
import { gridChunkWords, CROWD } from '../grid/wgsl.js';
import { SPEC_LIMITS } from '../check.js';

const require = createRequire(import.meta.url);
const createSimulator = require('../../../lib/createPhysicsSimulator.js');

// A simulator with a grid field stage; returns its description from program()
function gridStage(D, options) {
  const sim = createSimulator({ dimensions: D });
  for (let i = 0; i < 10; i++) sim.addBodyAt({ x: i, y: -i, z: i / 2 });
  if (options.charge) sim.store.define('charge', Float64Array, 1, 1);
  addGridField(sim, 'gas', Object.assign({ into: { value: 'v', gradient: 'g' } }, options));
  return { sim, stage: sim.program().stages.find(s => s.name === 'gas') };
}

const refs = D => ({
  pos: { buffer: 'X', at: (row, k) => `X[${row} * ${D}u + ${k}u]` },
  column: name => ({ buffer: name === 'charge' ? 'H' : 'S', at: (row, k) => `${name === 'charge' ? 'H' : 'S'}[${row} + ${k}u]` }),
});

function plan(D, stage, n = 50000, limits = SPEC_LIMITS) {
  return planGrid(Object.assign({ stage, D, n, limits }, refs(D)));
}

function storageBindings(code) {
  return (code.match(/var<storage\b/g) || []).length;
}

test('every combination plans in 2D and 3D, each kernel within 8 storage buffers', () => {
  for (const D of [2, 3]) {
    for (const anchor of ['box', 'lattice']) {
      for (const weights of ['linear', 'quadratic']) {
        for (const smooth of [false, true]) {
          for (const self of ['include', 'exclude']) {
            for (const charge of [false, true]) {
              const options = { anchor, cell: 1, deposit: { weights }, self, charge };
              if (smooth) options.smooth = { diffuse: 4 };
              if (charge) Object.assign(options.deposit, { value: 'charge * k' }) && (options.params = { k: 2 });
              const p = plan(D, gridStage(D, options).stage);
              const what = `${D}D ${anchor} ${weights} ${smooth ? 'smooth' : 'plain'} ${self}${charge ? ' charge' : ''}`;
              assert.equal(p.refusal, null, what);
              assert.equal(p.dispatches, 9 + (smooth ? 2 * D + 1 : 0), what);
              assert.equal(Object.keys(p.kernels).length, 9 + (smooth ? D + 1 : 0), what);
              for (const [name, kernel] of Object.entries(p.kernels)) {
                assert.ok(storageBindings(kernel.code) <= 8, `${what} ${name}: ${storageBindings(kernel.code)} storage buffers`);
                assert.equal(kernel.bindings.length, (kernel.code.match(/@binding\(/g) || []).length, `${what} ${name}: bindings listed`);
              }
              assert.equal(p.deposit, charge, what);
            }
          }
        }
      }
    }
  }
});

test('the deposit value reads its column and param; the step slot names them', () => {
  const { stage } = gridStage(2, { anchor: 'box', cell: 'unit / 2', deposit: { value: 'charge * k' }, params: { k: 2 }, charge: true });
  const p = plan(2, stage);
  assert.ok(p.kernels.GRID_BIN.code.indexOf('H[i + 0u]') >= 0, 'BIN reads the column');
  assert.ok(p.kernels.GRID_MINMAX.code.indexOf('H[i + 0u]') >= 0, 'MINMAX finds its largest value');
  assert.deepEqual(p.slotNames, ['cell', 'cellLow', 'margin', 'marginLow', 'diffuse', 'value', 'phase0', 'phase1', 'param:k', 'builtIn:unit']);
});

test('refusals name the numbers', () => {
  assert.match(planGrid(Object.assign({ stage: gridStage(2, { cell: 1 }).stage, D: 4, n: 10, limits: SPEC_LIMITS }, refs(4))).refusal, /grid fields are 2D and 3D; this layout is 4D/);
  const huge = plan(2, gridStage(2, { cell: 1, maxCells: 8192 }).stage);
  assert.match(huge.refusal, /a 2D grid of up to 8,192 cells per axis at 50,000 bodies needs 513 MiB for gridAcc; this device allows 128 MiB per buffer/);
  const roomy = plan(2, gridStage(2, { cell: 1, maxCells: 8192 }).stage, 50000, Object.assign({}, SPEC_LIMITS, { maxStorageBufferBindingSize: 1 << 30, maxBufferSize: 1 << 30 }));
  assert.equal(roomy.refusal, null, 'a device with larger buffers takes it');
  const { stage } = gridStage(2, { cell: 1e300 });
  assert.match(checkGrid(stage, 2, 10, SPEC_LIMITS).reason, /the grid's cell: the number 1e\+300 does not fit a 32-bit float/);
});

test('plan() says how it runs', () => {
  const { stage } = gridStage(2, { anchor: 'lattice', cell: 1, deposit: { weights: 'quadratic' }, self: 'exclude' });
  assert.deepEqual(checkGrid(stage, 2, 1000, SPEC_LIMITS), { runs: true, how: 'a lattice grid of up to 2,048 cells per axis, quadratic weights, own share left out: 9 dispatches' });
});

test('numbers per step: the lattice phase puts relative positions back on it', () => {
  const values = { cell: 10, margin: 0.1, diffuse: 0, value: null };
  const lattice = gridSlotValues(values, [1234.567, -877.25], 2, 'lattice');
  assert.ok(Math.abs(lattice.phase0 - 4.567) < 1e-9 && Math.abs(lattice.phase1 - 2.75) < 1e-9, JSON.stringify(lattice));
  assert.equal(lattice.value, 1, 'a deposit value of 1 when it reads columns');
  assert.equal(lattice.marginLow, 0.1 - Math.fround(0.1));
  assert.equal(gridSlotValues(values, [1234.567, 5], 2, 'box').phase0, 0, 'the box needs no phase');
  assert.equal(gridSlotValues(values, null, 2, 'lattice').phase0, 0);
});

test('a grid stage is dynamic when its numbers can change within a call', () => {
  assert.equal(gridIsDynamic(gridStage(2, { cell: 1 }).stage), false);
  assert.equal(gridIsDynamic(gridStage(2, { cell: ctx => ctx.springLength() }).stage), true);
  assert.equal(gridIsDynamic(gridStage(2, { cell: 'h', params: { h: () => 2 } }).stage), true);
  assert.equal(gridIsDynamic(Object.assign({}, gridStage(2, { cell: 1 }).stage, { when: 'step > 3' })), true);
});

test('the halt message for a lattice wider than maxCells', () => {
  const bits = x => new Uint32Array(new Float32Array([x]).buffer)[0];
  // smoothed: the CPU module stops too, in these words
  const smoothed = plan(2, gridStage(2, { anchor: 'lattice', cell: 10, smooth: { diffuse: 100 } }).stage);
  assert.equal(gridStatus([0, 0, 0, 0], smoothed, 'gas'), null);
  assert.equal(gridStatus([1, bits(5300), bits(10), 0], smoothed, 'gas'), 'Grid field gas: the layout spans 5300 cells at cell 10; maxCells is 2048');
  assert.equal(gridStatus([1, bits(5300), bits(4.1), 0], smoothed, 'gas'), 'Grid field gas: the layout spans 5300 cells at cell 4.1; maxCells is 2048', 'the cell as the CPU prints it');
  // without smoothing the CPU goes on: the message says it is the GPU's limit
  const plain = plan(2, gridStage(2, { anchor: 'lattice', cell: 10 }).stage);
  assert.equal(gridStatus([1, bits(5300), bits(10), 0], plain, 'gas'),
    'Grid field gas: the layout spans 5300 cells at cell 10, more than the GPU\'s maxCells of 2048; the CPU runs this lattice at any width. Raise maxCells, or run on the CPU');
});

test('gridChunk holds the chunks of the most crowding', () => {
  // the most chunks per body: every cell just crowded (CROWD + 1 bodies, two chunks)
  for (const n of [1, 64, 65, 1000, 123457, 1e6]) {
    const cells = Math.floor(n / (CROWD + 1)), rest = n - cells * (CROWD + 1);
    const chunks = 2 * cells + (rest > CROWD ? Math.ceil(rest / CROWD) : 0);
    assert.ok(4 + 2 * chunks <= gridChunkWords(n), `${n} bodies`);
    assert.ok(4 + 2 * Math.ceil(n / CROWD) <= gridChunkWords(n), `${n} bodies in one cell`);
  }
});
