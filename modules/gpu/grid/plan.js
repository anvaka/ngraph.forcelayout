// The grid field's plan, made without a device: the stage's options (modules/gridfield describes
// its stage with shape 'grid'), buffers and their bytes (with the refusal when they do not fit the
// device), the WGSL of its kernels and the numbers it reads per step. build.js makes it real.
//
//   const grid = planGrid({ stage, D, n, limits, pos, column, values });
//   grid.refusal     // null, or why it cannot run here (with the numbers)
//   grid.buffers     // bytes per buffer
//   grid.kernels     // {NAME: {code, bindings}}
//   grid.slotNames   // the step's numbers it reads: cell, margin, diffuse, value, phase0..,
//                    // param:<name>, builtIn:<name> (gridSlotValues() gives the first ones)
//
// `pos` and `column(name)` give colRefs, {buffer, at(row, axis)}: the positions at the start of
// the step, the columns the deposit value reads, and the two columns the field writes (into.value,
// into.gradient). `values`, when given, is the caller's step slot: {decl(binding), at(name)};
// without it the grid has a uniform of its own (build.js setValues()). `limits.gridArithmetic`,
// when the device was checked (canary.js), says which exact arithmetic it keeps: what needs the
// rest is refused.
import formula from '../../../lib/formula.js';
import { createPrinter, f32Problem, F32_MAX } from '../wgsl/print.js';
import { gridKernels, gridCapacity, gridChunkWords, tableSize, META, WG, REFINE_GAMMA } from './wgsl.js';

const AX = 'xyzw';
// Numbers of the stage that the host works out per step (simulator.stageValues())
const NUMBERS = ['cell', 'cellLow', 'margin', 'marginLow', 'diffuse', 'value'];
// The widest box grid, per D, that keeps within half the tolerance when a device's compiler sees
// through grid_opq (canary.js). Measured on Metal with the barriers left out: a box's cell and
// corner then lose their low words, and 2D boxes were off by 1.9e-6 at 16 cells and 6.9e-6 at 32;
// 3D by 1.3e-6 at 8 and 9.8e-6 at 16. Lattices, whose cell comes from the host, held 4e-6 up to
// 2,048 cells (grid-work/plaincells-seen*.json).
const PLAIN_BOX_CELLS = { 2: 16, 3: 8 };

/**
 * The grid's own numbers per step, by slot name (gridSlotValues() gives them); the stage's params
 * and built in values come as 'param:<name>' and 'builtIn:<name>'
 */
export function gridNumbers(D) {
  return NUMBERS.concat(Array.from({ length: D }, (_, k) => 'phase' + k));
}

/**
 * The grid field of program stage `stage` (shape 'grid') for n bodies in D dimensions: see the top
 * of this file. `label` prefixes its kernels' names (one plan per grid stage).
 */
export function planGrid({ stage, D, n, limits, pos, column, values = null, label = 'GRID', warn, printer }) {
  const refuse = (reason, buffers = {}) => ({ refusal: reason, buffers, kernels: {}, slotNames: [], dispatches: 0 });
  const args = stage.args || {};
  if (D !== 2 && D !== 3) return refuse(`grid fields are 2D and 3D; this layout is ${D}D`);
  const maxCells = args.maxCells;
  if (!(maxCells >= 1) || Math.floor(maxCells) !== maxCells) return refuse(`the grid's maxCells should be a positive whole number, not ${maxCells}`);
  for (const key of ['cell', 'margin', 'diffuse']) {
    const number = args[key];
    if (number && number.kind === 'number') {
      const problem = f32Problem(number.value);
      if (problem) return refuse(`the grid's ${key}: ${problem}`);
    }
  }

  // What the device's compiler does not keep exact (canary.js); unknown (no device) passes
  const exact = limits.gridArithmetic;
  if (exact && !exact.sums && args.anchor === 'box' && maxCells > PLAIN_BOX_CELLS[D]) {
    return refuse(`${exact.reason}. Without exact arithmetic a ${D}D box grid wider than ${PLAIN_BOX_CELLS[D]} cells per axis is off by more than half the ` +
      `tolerance, and this one may reach ${maxCells}. Set maxCells to ${PLAIN_BOX_CELLS[D]}, use the 'lattice' anchor, or run on the CPU`);
  }
  if (exact && !(exact.sums && exact.residual) && args.diffuse) {
    // smoothing over diffuse / cell^2 >= REFINE_GAMMA needs the refinement step, which needs both
    const gamma = gammaBound(args);
    if (!(gamma < REFINE_GAMMA)) {
      return refuse(`${exact.reason}. Without exact arithmetic smoothing with diffuse / cell^2 of ${REFINE_GAMMA} or more is off by more than half the ` +
        `tolerance, and this grid's ${Number.isFinite(gamma) ? `is ${+gamma.toPrecision(4)}` : 'comes from expressions, known only as it runs'}. Run it on the CPU`);
    }
  }

  // The step's numbers: the caller's slot, or a uniform of the grid's own
  const names = gridNumbers(D);
  stage.params.forEach(param => names.push('param:' + param.name));
  (stage.builtIns || []).forEach(name => names.push('builtIn:' + name));
  let own = null;
  if (!values) {
    const floats = Math.max(16, Math.ceil(names.length / 4) * 4);
    own = { names, floats };
    values = {
      decl: binding => `@group(0) @binding(${binding}) var<uniform> V: array<vec4f, ${floats / 4}>;`,
      at: name => {
        const index = names.indexOf(name);
        if (index < 0) throw new Error(`the grid reads no number ${name}`);
        return `V[${index >> 2}].${AX[index & 3]}`;
      },
    };
  }

  // The deposit value per body, when it reads columns; else the host gives it per step
  let deposit = null;
  try {
    deposit = printDeposit(args.value, stage, D, {
      param: name => values.at('param:' + name),
      builtIn: name => values.at('builtIn:' + name),
      column,
    }, printer || createPrinter(warn));
  } catch (e) {
    return refuse('the deposit value: ' + e.message);
  }

  const capacity = gridCapacity(D, maxCells);
  const TS = tableSize(maxCells);
  const keyWords = deposit ? 3 : 2, spWords = deposit && D === 3 ? 2 : 1;
  const size = bytes => Math.max(16, Math.ceil(bytes / 16) * 16);
  const buffers = {
    gridMeta: size((META.TABLE + 2 * TS) * 4),
    gridCount: size(capacity * 4),
    gridStart: size((capacity + capacity / 2048) * 4),
    gridKey: size(keyWords * n * 4),
    gridSp: size(spWords * n * 16),
    gridChunk: size(gridChunkWords(n) * 4),
    // crowded cells' 64-bit sums
    gridAcc: size(2 * capacity * 4),
    gridField: size(capacity * 4),
  };
  // a smoothed field's low word (the refinement step, see residual() in wgsl.js)
  if (args.diffuse) buffers.gridLo = size(capacity * 4);
  const largest = Math.min(limits.maxStorageBufferBindingSize, limits.maxBufferSize);
  const over = Object.keys(buffers).filter(name => buffers[name] > largest);
  if (over.length) {
    const name = over.sort((a, b) => buffers[b] - buffers[a])[0];
    return refuse(`a ${D}D grid of up to ${maxCells.toLocaleString('en-US')} cells per axis at ${n.toLocaleString('en-US')} bodies needs ` +
      `${megabytes(buffers[name])} for ${name}; this device allows ${megabytes(largest)} per buffer`, buffers);
  }
  if (Math.ceil(n / WG) > limits.maxComputeWorkgroupsPerDimension) return refuse(`grid fields run up to ${(limits.maxComputeWorkgroupsPerDimension * WG).toLocaleString('en-US')} bodies`);

  const into = args.into || {};
  const spec = {
    D, label, maxCells, capacity,
    anchor: args.anchor, weights: args.weights, self: args.self, smooth: !!args.diffuse,
    pos, outputs: { value: column(into.value), gradient: column(into.gradient) }, deposit, values,
  };
  const kernels = gridKernels(spec);
  return {
    refusal: null, D, n, label, maxCells, capacity, tableSize: TS, anchor: args.anchor,
    smooth: spec.smooth, deposit: !!deposit, buffers, kernels, values, own,
    slotNames: names,
    // MINMAX, PARAMS, BIN, 2 scans, ORDER, CROWD, DEPOSIT, GATHER; with smoothing a sweep per
    // axis, the residual and a sweep per axis again
    dispatches: 9 + (spec.smooth ? 2 * D + 1 : 0),
  };
}

// diffuse / cell^2 at most, when both are numbers in the description (a box's cell only grows);
// else Infinity
function gammaBound(args) {
  const number = x => (x && x.kind === 'number' ? x.value : NaN);
  const gamma = number(args.diffuse) / (number(args.cell) * number(args.cell));
  return gamma >= 0 ? gamma : Infinity;
}

/**
 * The first of a grid's numbers for a step (simulator.stageValues()) that does not fit f32, as
 * {name, value}, or null. The device would turn them into NaN or no grid without a word.
 */
export function gridNumberProblem(numbers) {
  const names = { cell: 'grid cell', margin: 'grid margin', diffuse: 'smoothing\'s diffuse', value: 'deposit value' };
  for (const name of Object.keys(names)) {
    const value = numbers[name];
    if (value === null || value === undefined) continue;
    if (!Number.isFinite(value) || Math.abs(value) > F32_MAX) return { name: names[name], value };
  }
  return null;
}

/**
 * What plan() says about a grid stage on a device with `limits` (for n bodies in D dimensions):
 * {runs: true, how} or {runs: false, reason}.
 */
export function checkGrid(stage, D, n, limits, printer) {
  const ref = buffer => ({ buffer, at: (row, k) => `${buffer}[${row} + ${k}u]` });
  const plan = planGrid({ stage, D, n, limits, printer, pos: ref('X'), column: () => ref('S') });
  if (plan.refusal) return { runs: false, reason: plan.refusal };
  const args = stage.args;
  return {
    runs: true,
    how: `a ${args.anchor} grid of up to ${args.maxCells.toLocaleString('en-US')} cells per axis, ${args.weights} weights` +
      `${plan.smooth ? ', smoothed' : ''}${args.self === 'exclude' ? ', own share left out' : ''}: ${plan.dispatches} dispatches`,
  };
}

/**
 * The grid's own numbers for one step, from simulator.stageValues(name, context) of its stage:
 * {cell, cellLow, margin, marginLow, diffuse, value, phase0, ...}. `origin` is the f64 origin of the positions on the
 * device: on a lattice, phase_k = origin_k mod cell puts relative positions back on the lattice
 * (0 when the origin sits on it).
 */
export function gridSlotValues(numbers, origin, D, anchor) {
  // the f32 cell and margin, plus what f32 drops of them (the device works in hi + lo)
  const low = x => (Number.isFinite(x) && Math.abs(x) < 3e38 ? x - Math.fround(x) : 0);
  const out = {
    cell: numbers.cell,
    cellLow: low(numbers.cell),
    margin: numbers.margin,
    marginLow: low(numbers.margin),
    diffuse: numbers.diffuse || 0,
    value: numbers.value === null || numbers.value === undefined ? 1 : numbers.value,
  };
  const cell = numbers.cell;
  for (let k = 0; k < D; k++) {
    const o = origin ? origin[k] : 0;
    out['phase' + k] = anchor === 'lattice' && o !== 0 && cell > 0 && cell < Infinity ? o - cell * Math.floor(o / cell) : 0;
  }
  return out;
}

/**
 * True when the grid stage's numbers can change from one step to the next within a call (so
 * every queued step needs its own slot)
 */
export function gridIsDynamic(stage) {
  const args = stage.args || {};
  if (stage.when) return true;
  if (['cell', 'margin', 'diffuse', 'value'].some(key => args[key] && args[key].kind === 'host')) return true;
  if (stage.params.some(param => param.kind === 'host')) return true;
  return (stage.builtIns || []).indexOf('step') >= 0;
}

/**
 * GPU time of one step of the grid at its worst, in ms on an M4 Max (the engine scales it by the
 * device's speed), for the runner's bound on steps per submit. Measured at 1M bodies: piled into
 * one cell 1.0-1.1 ms (BIN's counter takes every body); about 64 bodies in every cell, the gather's
 * longest threads, 0.38-0.68 ms; the grid at maxCells 0.63 ms (2,003^2 lattice), 0.88 ms (131^3)
 * and 1.43 ms (2,050^2 box, smoothed and refined).
 */
export function gridCappedMs(plan) {
  return 0.1 + 1.2 * plan.n / 1e6 + 0.3 * plan.capacity / 1e6;
}

/**
 * GPU ms of a relaxed step of the grid on an M4 Max, at most: n bodies and `points` grid points
 * this step. A lower envelope of the measured steps (100k and 1M bodies, 2D and 3D, both grids of
 * timegrid.js), so a step timed on a device, divided by it, gives that device's factor or more
 * (build.js observeTime()).
 */
export function gridRelaxedMs(plan, points) {
  return 0.02 + 0.25 * plan.n / 1e6 + (plan.smooth ? 0.15 : 0.03) * points / 1e6;
}

/**
 * The message to halt with for the 4 status words of a grid (build.js `status`), or null.
 * Sticky: the first problem stays until the grid is built again.
 */
export function gridStatus(words, plan, stageName) {
  const code = words[0];
  if (!code) return null;
  const f = new Float32Array(new Uint32Array([words[1], words[2]]).buffer);
  const cells = Number.isFinite(f[0]) ? Math.round(f[0]) : f[0];
  const cell = +f[1].toPrecision(6);
  if (code === 1) {
    // a smoothed lattice: the CPU module's words, numbers as it prints them (it stops too)
    const spans = `Grid field ${stageName}: the layout spans ${cells} cells at cell ${cell}`;
    if (plan.smooth) return `${spans}; maxCells is ${plan.maxCells}`;
    // without smoothing the CPU keeps going past maxCells (in bricks of cells); the GPU's grid is dense
    return `${spans}, more than the GPU's maxCells of ${plan.maxCells}; the CPU runs this lattice at any width. Raise maxCells, or run on the CPU`;
  }
  return `Grid field ${stageName}: the grid needs ${cells} cells, more than its buffers hold (${plan.capacity})`;
}

/**
 * The per-body deposit value as WGSL of row `i`, or null when it reads no column (the host gives
 * it per step then): {lines, code, buffers}. Names resolve as the CPU module resolves them:
 * params, then columns, then built in values.
 */
export function printDeposit(value, stage, D, scope, printer) {
  const columns = new Set(stage.reads.filter(r => r.space === 'nodes' && r.column !== 'pos').map(r => r.column));
  if (!columns.size) return null;
  if (!value || value.kind !== 'expression') throw new Error('a deposit value that reads columns should be an expression');
  const params = new Set(stage.params.map(p => p.name));
  const builtIns = new Set(stage.builtIns || []);
  const used = [];
  const compiled = formula.compile(value.text, {
    D,
    name(id) {
      if (params.has(id)) return { type: 'num', code: scope.param(id) };
      if (columns.has(id)) {
        const ref = scope.column(id);
        if (used.indexOf(ref.buffer) < 0) used.push(ref.buffer);
        return { type: 'num', code: ref.at('i', 0) };
      }
      if (builtIns.has(id)) return { type: 'num', code: scope.builtIn(id) };
      return undefined;
    },
  }, printer);
  if (!compiled.result || compiled.result.type !== 'num') throw new Error('it should give a number');
  return { lines: compiled.lines, code: compiled.result.code, buffers: used };
}

function megabytes(bytes) {
  return (bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0) + ' MiB';
}
