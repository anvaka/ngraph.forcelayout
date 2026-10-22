/**
 * A grid field: a smooth density of the bodies, sampled back at every body.
 *
 * Every step, each body spreads a value (1 by default) over the grid points around it, with the
 * standard particle-mesh weights: linear (cloud-in-cell, 2^D points) or quadratic (3^D points).
 * The grid can then be smoothed by one implicit step of the heat equation. Each body reads the
 * field back with the same weights, and gets two ordinary body columns:
 *
 *   value    - sum over grid points g of w_i(g) * F(g), a density per unit area (or volume);
 *   gradient - sum over g of grad w_i(g) * F(g), its slope in layout units (D numbers).
 *
 * A force is then a plain node formula that reads them, for example
 * 'force -= select(pinned == 0, k * pressureGradient, 0 * pos)'.
 *
 * The grid is dense and covers the bodies plus a margin:
 *  - 'box': its corner is the bodies' smallest corner minus the margin, and the cell grows when
 *    an axis would need more than `maxCells` cells;
 *  - 'lattice': grid points sit at multiples of `cell`, which never changes. Without smoothing
 *    the CPU has no cap on the number of cells: past a memory budget it keeps only the cells that
 *    bodies touch, in small bricks found through a hash map, with the same numbers. A smoothed
 *    lattice wider than `maxCells` stops with a message, as on the GPU.
 *
 * Other engines read the stage's description (shape 'grid') and run their own version of it.
 */
import formula from '../../lib/formula.js';

// Cells per axis, at most. For a box they set the cost (the cell grows to fit); for a lattice only
// where the GPU stops, so the 2D lattice gets more room: measured at 1M bodies on the GPU, a
// 2,000 x 2,000 lattice took 0.73 ms per step against 0.41 at 1,000 x 1,000.
const MAX_CELLS = { box: { 2: 1024, 3: 128 }, lattice: { 2: 2048, 3: 128 } };
const ANCHORS = ['box', 'lattice'];
const WEIGHTS = ['linear', 'quadratic'];
const SELF = ['include', 'exclude'];
// Kernels are generated per dimension, weights, anchor, self and value
const kernelCache = new Map();

/**
 * Adds the grid field stage `name` to `simulator` (before `integrate`, or where `before`,
 * `after` or `replace` say). Options:
 *  - anchor: 'box' (default) or 'lattice';
 *  - cell: the cell size in layout units (an expression, a number or a function of the step
 *    context). For 'box' it is the smallest cell;
 *  - margin: room around the bodies, in layout units (default 0);
 *  - maxCells: cells per axis, at most (box: 1024 in 2D; lattice: 2048 in 2D; 128 in 3D);
 *  - deposit: {value, weights}. `value` is what each body spreads (default '1'; an expression
 *    that may read body columns); weights 'linear' (default) or 'quadratic';
 *  - smooth: {diffuse}: one implicit heat step that spreads the field over about
 *    sqrt(diffuse) layout units. Leave it out for no smoothing;
 *  - self: 'include' (default), or 'exclude' to leave each body's own share out of what it reads
 *    (with smoothing, its own smoothed share);
 *  - into: {value, gradient}, names of the two body columns it writes (defined when missing);
 *  - params: numbers, or functions of the step context (see simulator.stepContext()), that the
 *    expressions read; functions are called once per step;
 *  - when: run the stage only on the steps where this holds (as for any stage);
 *  - denseLimit: a 'lattice' grid without smoothing that would have more cells than this keeps
 *    only the cells bodies touch (default: 64 per body, at least 4M: 32 MB).
 *
 * Returns {name, dispose()}; dispose() removes the stage and the columns this call defined.
 */
export default function addGridField(simulator, name, options) {
  if (!options) throw new Error(`Grid field ${name} needs options`);
  const store = simulator.store;
  const D = store.D;
  if (D !== 2 && D !== 3) throw new Error(`Grid field ${name}: grid fields are 2D and 3D; this layout has ${D} dimensions`);
  const anchor = pick(options.anchor, 'box', ANCHORS, 'anchor');
  const deposit = options.deposit || {};
  const weights = pick(deposit.weights, 'linear', WEIGHTS, 'deposit.weights');
  const self = pick(options.self, 'include', SELF, 'self');
  const into = options.into || {};
  if (!into.value || !into.gradient || into.value === into.gradient) {
    throw new Error(`Grid field ${name} needs two column names: into: {value, gradient}`);
  }
  if (options.cell === undefined) throw new Error(`Grid field ${name} needs a cell size`);
  const maxCells = options.maxCells === undefined ? MAX_CELLS[anchor][D] : options.maxCells;
  if (!(maxCells >= 1) || Math.floor(maxCells) !== maxCells) throw new Error(`Grid field ${name}: maxCells should be a positive whole number`);
  const smooth = options.smooth || null;
  if (smooth && smooth.diffuse === undefined) throw new Error(`Grid field ${name}: smooth needs diffuse`);

  const values = createValues(simulator, name, options.params || {});
  const cell = values.scalar(options.cell, 'cell');
  const margin = values.scalar(options.margin === undefined ? 0 : options.margin, 'margin');
  const diffuse = smooth ? values.scalar(smooth.diffuse, 'smooth.diffuse') : null;
  const value = values.perBody(deposit.value === undefined ? '1' : deposit.value);

  const defined = [];
  defineColumn(into.value, 1);
  defineColumn(into.gradient, D);

  const kernel = getKernel(D, weights, anchor, self, !!smooth, value.code);
  const pad = weights === 'quadratic' ? 1 : 0;
  const touched = Math.pow(weights === 'quadratic' ? 3 : 2, D); // grid points per body
  const grid = {
    field: new Float64Array(0), cells: 0, cell: 0, unit: 0,
    origin: new Float64Array(D), size: new Float64Array(D), lo: new Float64Array(D), hi: new Float64Array(D),
    columns: value.columns.map(() => null), now: Object.create(null),
    // the sparse lattice: bricks of cells found through a hash map, and each body's cells in them
    bricks: null, slots: new Int32Array(0),
    // per axis, the inverse of the smoothing's line solve near its diagonal (for self: 'exclude')
    inverse: []
  };
  for (let k = 0; k < D; ++k) grid.inverse.push({ c: new Float64Array(0), d: new Float64Array(0) });
  let sweepC = new Float64Array(0), sweepM = new Float64Array(0);
  // what params and built in values read on the CPU's steps
  const context = simulator.stepContext();

  simulator.addStage(name, run, {
    before: options.before, after: options.after, replace: options.replace, when: options.when,
    describe, values: stepValues
  });

  return {
    name,
    dispose() {
      if (simulator.getStage(name)) simulator.removeStage(name);
      defined.forEach(column => store.remove(column));
    }
  };

  function run(bodies) {
    const n = bodies.n;
    if (n === 0) return;
    const now = values.read(context, grid.now);
    const h = cell.read(now), room = margin.read(now);
    const out = bodies[into.value], slope = bodies[into.gradient];
    if (!out || !slope) throw new Error(`Grid field ${name}: the column ${out ? into.gradient : into.value} is gone`);
    if (!(h > 0 && h < Infinity && room >= 0 && room < Infinity) || !kernel.bounds(bodies, grid)) {
      // No grid can be built (a cell of 0, or no body at a finite position): the field is 0
      out.fill(0, 0, n);
      slope.fill(0, 0, n * D);
      return;
    }
    if (anchor === 'box') placeBox(h, room);
    else placeLattice(h, room, !!diffuse);
    // Deposits are densities: per unit area (or volume) of a cell
    const area = grid.cell * grid.cell * (D === 3 ? grid.cell : 1);
    grid.unit = value.scalar ? value.read(now) / area : 1 / area;
    for (let c = 0; c < value.columns.length; ++c) {
      grid.columns[c] = bodies[value.columns[c]];
      if (!grid.columns[c]) throw new Error(`Grid field ${name} reads the body column ${value.columns[c]}, which is gone`);
    }
    // Lattice cells are whole numbers up to 2^30 per axis on the dense grid; the bricks skip bodies
    // past 1e9 cells, so one body thrown far away does not break everyone's field
    const limit = options.denseLimit === undefined ? Math.max(4194304, 64 * n) : options.denseLimit;
    if (anchor === 'lattice' && !diffuse && (grid.cells > limit || !(grid.span < 1073741824))) {
      runSparse(bodies, out, slope);
      return;
    }
    const cells = grid.cells;
    if (grid.field.length < cells) grid.field = new Float64Array(Math.max(cells, 2 * grid.field.length));
    else grid.field.fill(0, 0, cells);
    kernel.deposit(bodies, grid);
    if (diffuse) {
      const amount = diffuse.read(now);
      smoothField(amount > 0 ? amount / (grid.cell * grid.cell) : 0);
    }
    kernel.gather(bodies, grid, out, slope);
  }

  // The same deposit and gather over bricks of 4^D cells, found through a hash map of the
  // bricks that bodies touch (one or two per axis, against 2 or 3 cells per axis to look up)
  function runSparse(bodies, out, slope) {
    const n = bodies.n;
    if (!grid.bricks) grid.bricks = createBricks(D);
    if (grid.slots.length < touched * n) grid.slots = new Int32Array(touched * n);
    grid.bricks.reset(2 * n);
    while (!kernel.depositSparse(bodies, grid)) {
      // keep the hash map at most half full
      grid.bricks.grow();
    }
    kernel.gatherSparse(bodies, grid, out, slope);
  }

  // Corner at the smallest corner minus the margin; the cell grows so no axis needs more than
  // maxCells cells (written as gridPressure.js of ru-4 does, so the numbers are the same)
  function placeBox(smallest, room) {
    let h = smallest;
    for (let k = 0; k < D; ++k) h = Math.max(h, ((grid.hi[k] + room) - (grid.lo[k] - room)) / maxCells);
    let cells = 1;
    for (let k = 0; k < D; ++k) {
      const x0 = grid.lo[k] - room, x1 = grid.hi[k] + room;
      grid.size[k] = Math.min(Math.ceil((x1 - x0) / h), maxCells) + 2 + 2 * pad;
      grid.origin[k] = pad ? x0 - h : x0;
      cells *= grid.size[k];
    }
    grid.cell = h;
    grid.cells = cells;
  }

  // Grid points at multiples of h. `origin` holds the index of the first one per axis. Sizes are
  // whole numbers in f64: a body far away gives a huge `span`, not a wrapped one.
  function placeLattice(h, room, smoothed) {
    let cells = 1, span = 0;
    for (let k = 0; k < D; ++k) {
      const first = Math.floor((grid.lo[k] - room) / h);
      const across = Math.floor((grid.hi[k] + room) / h) - first;
      if (smoothed && !(across <= maxCells)) {
        throw new Error(`Grid field ${name}: the layout spans ${across} cells at cell ${h}; maxCells is ${maxCells}`);
      }
      grid.origin[k] = first - pad;
      grid.size[k] = across + 2 + 2 * pad;
      cells *= grid.size[k];
      span = Math.max(span, across);
    }
    grid.cell = h;
    grid.cells = cells;
    grid.span = span;
  }

  // One implicit heat step, split into a tridiagonal solve along each axis (zero outside the
  // grid). The Thomas coefficients do not depend on the line, so they are computed once per
  // axis, and lines across the memory order are swept together, a row at a time.
  function smoothField(g) {
    const u = grid.field, size = grid.size, cells = grid.cells;
    const a = -g, b = 1 + 2 * g;
    let stride = 1;
    for (let k = 0; k < D; ++k) {
      const length = size[k];
      if (sweepC.length < length) { sweepC = new Float64Array(2 * length); sweepM = new Float64Array(2 * length); }
      const c = sweepC, m = sweepM;
      m[0] = b;
      c[0] = a / b;
      for (let i = 1; i < length; ++i) {
        m[i] = b - a * c[i - 1];
        c[i] = a / m[i];
      }
      if (self === 'exclude') inverseNearDiagonal(grid.inverse[k], length, a, b, c, m);
      if (g === 0) { stride *= length; continue; }
      const block = stride * length; // values between two lines along this axis, plus the line
      if (stride === 1) {
        for (let base = 0; base < cells; base += length) {
          u[base] = u[base] / b;
          for (let i = 1; i < length; ++i) u[base + i] = (u[base + i] - a * u[base + i - 1]) / m[i];
          for (let i = length - 2; i >= 0; --i) u[base + i] = u[base + i] - c[i] * u[base + i + 1];
        }
      } else {
        for (let start = 0; start < cells; start += block) {
          for (let x = start; x < start + stride; ++x) u[x] = u[x] / b;
          for (let i = 1; i < length; ++i) {
            const row = start + i * stride, mi = m[i];
            for (let x = row; x < row + stride; ++x) u[x] = (u[x] - a * u[x - stride]) / mi;
          }
          for (let i = length - 2; i >= 0; --i) {
            const row = start + i * stride, ci = c[i];
            for (let x = row; x < row + stride; ++x) u[x] = u[x] - ci * u[x + stride];
          }
        }
      }
      stride *= length;
    }
  }

  // What a body reads back of its own smoothed deposit needs the inverse of each axis's line
  // solve A (b on the diagonal, a next to it), but only next to the diagonal: its diagonal
  // d_i = 1 / (m_i + n_i - b), from the forward pivots m (Thomas) and the backward pivots n, and
  // (A^-1)_{i,j} = -c_i (A^-1)_{i+1,j} for i < j, with Thomas's c_i = a / m_i.
  function inverseNearDiagonal(table, length, a, b, c, m) {
    if (table.d.length < length) { table.c = new Float64Array(2 * length); table.d = new Float64Array(2 * length); }
    let next = b; // backward pivot n_i, from the end of the line
    for (let i = length - 1; i >= 0; --i) {
      if (i < length - 1) next = b - a * a / next;
      table.d[i] = 1 / (m[i] + next - b);
      table.c[i] = c[i];
    }
  }

  // The stage as plain data (see simulator.program()): the grid's options in `args`, its numbers
  // as {kind: 'number' | 'expression' | 'host'}
  function describe() {
    return {
      shape: 'grid',
      space: 'grid',
      how: `generated loops: a ${anchor} grid, ${weights} weights${diffuse ? ', smoothed' : ''}`,
      reads: ['pos'].concat(value.columns).reduce((list, column) => list.concat(
        { space: 'nodes', column, rows: 'own' }, { space: 'nodes', column, rows: 'other' }), []),
      writes: [
        { space: 'nodes', column: into.value, mode: 'set' },
        { space: 'nodes', column: into.gradient, mode: 'set' }
      ],
      params: values.describe(),
      builtIns: values.builtIns(),
      args: {
        anchor, weights, self, maxCells,
        cell: cell.describe(), margin: margin.describe(),
        diffuse: diffuse ? diffuse.describe() : null,
        value: value.describe(),
        into: { value: into.value, gradient: into.gradient }
      }
    };
  }

  // This stage's numbers in the step of `stepContext`, for engines that queue steps
  function stepValues(stepContext) {
    const now = values.read(stepContext, Object.create(null));
    const params = {};
    values.names.forEach(key => { params[key] = now[key]; });
    return {
      when: true, params,
      cell: cell.read(now), margin: margin.read(now), diffuse: diffuse ? diffuse.read(now) : 0,
      value: value.scalar ? value.read(now) : null
    };
  }

  function defineColumn(column, size) {
    if (store.has(column)) {
      if (store.sizeOf(column) !== size) throw new Error(`Grid field ${name}: column ${column} should have ${size} number(s) per body`);
      return;
    }
    store.define(column, Float64Array, size);
    defined.push(column);
  }

  function pick(given, fallback, allowed, key) {
    const chosen = given === undefined ? fallback : given;
    if (allowed.indexOf(chosen) < 0) throw new Error(`Grid field ${name}: ${key} should be ${allowed.map(v => `'${v}'`).join(' or ')}`);
    return chosen;
  }
}

/**
 * Values of the options: numbers, functions of the step context, or expressions of the params
 * and the built in values (see lib/formula.js), compiled once. read(context, into) fills `into`
 * with this step's params and built in values; each option then reads its number from it.
 */
function createValues(simulator, stageName, params) {
  const names = Object.keys(params);
  const builtIn = formula.BUILT_IN_VALUES;
  names.forEach(key => {
    if (!/^[A-Za-z_]\w*$/.test(key) || builtIn[key] || key === 'D' || key === 'pi' || simulator.store.has(key)) {
      throw new Error(`Grid field ${stageName}: parameter ${key} has the name of a column or a built in value`);
    }
  });
  const usedBuiltIns = [];
  const D = simulator.store.D;
  return {
    names,
    read(context, into) {
      into.$context = context;
      for (let i = 0; i < names.length; ++i) {
        const param = params[names[i]];
        into[names[i]] = typeof param === 'function' ? param(context) : param;
      }
      for (let i = 0; i < usedBuiltIns.length; ++i) into['$' + usedBuiltIns[i]] = builtIn[usedBuiltIns[i]](context);
      return into;
    },
    describe() {
      return names.map(key => Object.assign({ name: key }, describeValue(params[key])));
    },
    builtIns() {
      return usedBuiltIns.slice();
    },
    scalar(spec, key) {
      if (typeof spec === 'number') return { describe: () => describeValue(spec), read: () => spec };
      if (typeof spec === 'function') return { describe: () => describeValue(spec), read: now => spec(now.$context) };
      if (typeof spec !== 'string') throw new Error(`Grid field ${stageName}: ${key} should be a number, a function or an expression`);
      const compiled = compile(spec, key, null);
      const read = new Function('$now', compiled.lines.join('\n') + '\nreturn ' + compiled.result.code + ';');
      return { describe: () => describeValue(spec), read };
    },
    // The deposit value: a number per step, or code per body when it reads body columns
    perBody(spec) {
      if (typeof spec === 'number') spec = String(spec);
      if (typeof spec !== 'string') throw new Error(`Grid field ${stageName}: deposit.value should be an expression`);
      const columns = [];
      const compiled = compile(spec, 'deposit.value', columns);
      const describe = () => describeValue(spec);
      if (!columns.length) {
        const read = new Function('$now', compiled.lines.join('\n') + '\nreturn ' + compiled.result.code + ';');
        return { describe, scalar: true, columns, code: null, read };
      }
      if (compiled.lines.length) throw new Error(`Grid field ${stageName}: deposit.value should be one expression`);
      return { describe, scalar: false, columns, code: compiled.result.code };
    }
  };

  function compile(text, key, columns) {
    let compiled;
    try {
      compiled = formula.compile(text, { D, name: resolve });
    } catch (e) {
      e.message = `Grid field ${stageName}, ${key}: ${e.message}`;
      throw e;
    }
    if (!compiled.result || compiled.result.type !== 'num') throw new Error(`Grid field ${stageName}: ${key} should be an expression giving a number`);
    return compiled;

    function resolve(id) {
      if (Object.prototype.hasOwnProperty.call(params, id)) return { type: 'num', code: '$now[' + JSON.stringify(id) + ']' };
      if (columns && simulator.store.has(id) && simulator.store.sizeOf(id) === 1) {
        if (columns.indexOf(id) < 0) columns.push(id);
        return { type: 'num', code: `$c${columns.indexOf(id)}[$i]` };
      }
      if (builtIn[id]) {
        if (usedBuiltIns.indexOf(id) < 0) usedBuiltIns.push(id);
        return { type: 'num', code: '$now.$' + id };
      }
    }
  }
}

// A number of a stage as plain data, as formula stages describe theirs
function describeValue(spec) {
  if (typeof spec === 'number') return { kind: 'number', value: spec };
  if (typeof spec === 'string') return { kind: 'expression', text: spec };
  return { kind: 'host' };
}

/**
 * Generated loops for one kind of grid: bounds(store, grid), deposit(store, grid) and
 * gather(store, grid, value, gradient), plus depositSparse and gatherSparse over bricks of cells
 * (lattice only). The 2D linear code is written as ru-4's gridPressure.js and the quadratic code
 * as v1-6's gasPressure.js, so they give the same numbers.
 */
function getKernel(D, weights, anchor, self, smooth, valueCode) {
  const key = [D, weights, anchor, self, smooth, valueCode].join('|');
  let kernel = kernelCache.get(key);
  if (!kernel) {
    // with smoothing, a body's own share is read back through the line solves
    const exclude = self === 'exclude' ? (smooth ? 'smoothed' : 'plain') : null;
    kernel = {
      bounds: new Function('$store', '$grid', boundsCode(D)),
      deposit: new Function('$store', '$grid', depositCode(D, weights, anchor, valueCode, false)),
      gather: new Function('$store', '$grid', '$value', '$gradient', gatherCode(D, weights, anchor, exclude, valueCode, false))
    };
    if (anchor === 'lattice') {
      kernel.depositSparse = new Function('$store', '$grid', depositCode(D, weights, anchor, valueCode, true));
      kernel.gatherSparse = new Function('$store', '$grid', '$value', '$gradient', gatherCode(D, weights, anchor, exclude && 'plain', valueCode, true));
    }
    kernelCache.set(key, kernel);
  }
  return kernel;
}

const range = count => Array.from({ length: count }, (_, i) => i);

// Smallest and largest coordinate per axis, over bodies at finite positions. Returns false when
// there is no such body.
function boundsCode(D) {
  const axes = range(D);
  return `
var pos = $store.pos, n = $store.n;
${axes.map(k => `var lo${k} = Infinity, hi${k} = -Infinity;`).join('\n')}
for (var i = 0; i < n; ++i) {
${axes.map(k => `  var x${k} = pos[${D} * i + ${k}];\n  if (x${k} < lo${k}) lo${k} = x${k};\n  if (x${k} > hi${k}) hi${k} = x${k};`).join('\n')}
}
if (!(${axes.map(k => `hi${k} - lo${k} < Infinity`).join(' && ')})) {
  // A body far away (at infinity) is left out of the grid
${axes.map(k => `  lo${k} = Infinity; hi${k} = -Infinity;`).join('\n')}
  for (var j = 0; j < n; ++j) {
${axes.map(k => `    var y${k} = pos[${D} * j + ${k}];`).join('\n')}
    if (!(${axes.map(k => `Math.abs(y${k}) < Infinity`).join(' && ')})) continue;
${axes.map(k => `    if (y${k} < lo${k}) lo${k} = y${k};\n    if (y${k} > hi${k}) hi${k} = y${k};`).join('\n')}
  }
  if (!(${axes.map(k => `hi${k} >= lo${k}`).join(' && ')})) return false;
}
${axes.map(k => `$grid.lo[${k}] = lo${k}; $grid.hi[${k}] = hi${k};`).join('\n')}
return true;`;
}

// The stencil's grid points in memory order (x changes fastest): linear corners by bits,
// quadratic points by their offset (0, 1, 2) along each axis
function stencil(D, weights) {
  const points = [];
  const per = weights === 'linear' ? 2 : 3;
  const total = Math.pow(per, D);
  for (let p = 0; p < total; ++p) {
    const at = [];
    let rest = p;
    for (let k = 0; k < D; ++k) { at.push(rest % per); rest = Math.floor(rest / per); }
    points.push(at);
  }
  return points;
}

// Per body: its grid coordinates, the first grid point of its stencil along each axis (`t`: the
// position on a dense grid's line; on a sparse lattice, the global cell number), the dense grid's
// index of that point (`o`), and the weights. Bricks key cells by whole numbers, so their deposit
// skips bodies too far out (`skip` marks them).
function bodyCode(D, weights, anchor, dense, skip) {
  const axes = range(D);
  const lines = [];
  const coordinate = k => anchor === 'box' ? `(pos[${D} * $i + ${k}] - o${k}) / cell` : `pos[${D} * $i + ${k}] / cell`;
  axes.forEach(k => lines.push(`var g${k} = ${coordinate(k)};`));
  if (skip) lines.push(`if (!(${axes.map(k => `Math.abs(g${k}) < 1e9`).join(' && ')})) { ${skip} continue; }`);
  if (weights === 'linear') {
    axes.forEach(k => lines.push(`var i${k} = Math.floor(g${k});`));
    axes.forEach(k => lines.push(`var f${k} = g${k} - i${k};`));
  } else {
    axes.forEach(k => lines.push(`var i${k} = Math.round(g${k});`));
    axes.forEach(k => lines.push(`var d${k} = g${k} - i${k};`));
  }
  // box: `origin` is the grid's corner; lattice: the index of its first point
  const shift = k => (weights === 'linear' ? '' : ' - 1') + (anchor === 'lattice' && dense ? ` - o${k}` : '');
  axes.forEach(k => lines.push(`var t${k} = i${k}${shift(k)};`));
  if (dense) lines.push(`var o = ${axes.map(k => k === 0 ? 't0' : `t${k} * W${k === 1 ? '0' : '01'}`).reverse().join(' + ')};`);
  if (weights === 'quadratic') {
    axes.forEach(k => lines.push(`var w${k}_0 = 0.5 * (0.5 - d${k}) * (0.5 - d${k}), w${k}_1 = 0.75 - d${k} * d${k}, w${k}_2 = 0.5 * (0.5 + d${k}) * (0.5 + d${k});`));
  }
  return lines.map(line => '  ' + line).join('\n');
}

function prologue(D, valueCode, sparse) {
  const lines = ['var pos = $store.pos, n = $store.n, cell = $grid.cell, $u = $grid.unit;'];
  if (sparse) {
    lines.push('var $bricks = $grid.bricks, F = $bricks.value, slots = $grid.slots, $K = $bricks.found;');
  } else {
    lines.push('var F = $grid.field, W0 = $grid.size[0]' + (D === 3 ? ', W01 = $grid.size[0] * $grid.size[1];' : ';'));
    lines.push(range(D).map(k => `var o${k} = $grid.origin[${k}];`).join(' '));
  }
  if (valueCode) {
    const used = valueCode.match(/\$c\d+/g) || [];
    Array.from(new Set(used)).forEach(c => lines.push(`var ${c} = $grid.columns[${c.slice(2)}];`));
    if (valueCode.indexOf('$now') >= 0) lines.push('var $now = $grid.now;');
    lines.push('var $area = $u;');
  }
  return lines.join('\n');
}

// Where stencil point `p` (at offsets `at`) is in the field: an index into the dense grid, or the
// slot the sparse deposit found for it
function cellOf(at, p, sparse) {
  if (sparse) return `$s${p}`;
  const parts = [];
  if (at[0]) parts.push(String(at[0]));
  if (at[1]) parts.push(at[1] === 1 ? 'W0' : at[1] + ' * W0');
  if (at[2]) parts.push(at[2] === 1 ? 'W01' : at[2] + ' * W01');
  return parts.length ? 'o + ' + parts.reverse().join(' + ') : 'o';
}

function weightOf(weights, at) {
  if (weights === 'linear') return at.map((bit, k) => bit ? `f${k}` : `(1 - f${k})`).join(' * ');
  return at.map((offset, k) => `w${k}_${offset}`).join(' * ');
}

// The weight and the slope of point `j` of the stencil along axis `k`
function axisWeight(weights, k, j) {
  return weights === 'linear' ? (j ? `f${k}` : `(1 - f${k})`) : `w${k}_${j}`;
}

function axisSlope(weights, k, j) {
  return weights === 'linear' ? (j ? '1' : '-1') : `s${k}_${j}`;
}

function depositCode(D, weights, anchor, valueCode, sparse) {
  const points = stencil(D, weights);
  const lines = [
    prologue(D, valueCode, sparse),
    'for (var $i = 0; $i < n; ++$i) {',
    bodyCode(D, weights, anchor, !sparse, sparse ? `slots[${points.length} * $i] = -1;` : null)
  ];
  if (valueCode) lines.push(`  $u = (${valueCode}) * $area;`);
  if (sparse) lines.push(sparseCells(D, weights, points));
  points.forEach((at, p) => lines.push(`  F[${cellOf(at, p, sparse)}] += ${weightOf(weights, at)} * $u;`));
  if (sparse) lines.push(`  if ($bricks.full(${1 << D})) return false;`);
  lines.push('}');
  if (sparse) lines.push('return true;');
  return lines.join('\n');
}

// A body's stencil lies in at most 2 bricks per axis (it spans 2 or 3 cells, a brick 4). Look up
// each brick it touches once ($K, by which axes take the next brick), then every stencil cell is a
// brick plus its place in it.
function sparseCells(D, weights, points) {
  const axes = range(D);
  const span = weights === 'linear' ? 1 : 2;
  const lines = [];
  axes.forEach(k => lines.push(`var b${k} = t${k} >> 2, z${k} = ((t${k} + ${span}) >> 2) !== b${k} ? ${1 << k} : 0;`));
  lines.push(`var $cross = ${axes.map(k => `z${k}`).join(' | ')};`);
  for (let mask = 0; mask < 1 << D; ++mask) {
    const look = `$bricks.brick(${axes.map(k => mask & (1 << k) ? `b${k} + 1` : `b${k}`).join(', ')})`;
    lines.push(mask === 0 ? `$K[0] = ${look};` : `$K[${mask}] = ($cross & ${mask}) === ${mask} ? ${look} : $K[$cross & ${mask}];`);
  }
  // per axis and offset: which brick (bit k set: the next one) and the place in it
  axes.forEach(k => {
    for (let a = 0; a <= span; ++a) {
      lines.push(`var e${k}_${a} = ((t${k} + ${a}) >> 2) !== b${k} ? ${1 << k} : 0, l${k}_${a} = ((t${k} + ${a}) & 3)${k ? ` << ${2 * k}` : ''};`);
    }
  });
  points.forEach((at, p) => {
    lines.push(`var $s${p} = $K[${axes.map(k => `e${k}_${at[k]}`).join(' | ')}] + ${axes.map(k => `l${k}_${at[k]}`).join(' + ')};`);
    lines.push(`slots[${points.length} * $i + ${p}] = $s${p};`);
  });
  return lines.map(line => '  ' + line).join('\n');
}

// `exclude`: null (the body's own share stays in), 'plain' (subtract its deposit at each point)
// or 'smoothed' (subtract what it reads back of its own smoothed deposit; see selfCode)
function gatherCode(D, weights, anchor, exclude, valueCode, sparse) {
  const axes = range(D);
  const points = stencil(D, weights);
  const lines = [prologue(D, valueCode, sparse), 'for (var $i = 0; $i < n; ++$i) {'];
  if (sparse) {
    lines.push(`  if (slots[${points.length} * $i] < 0) { $value[$i] = 0; ${axes.map(k => `$gradient[${D} * $i + ${k}] = 0;`).join(' ')} continue; }`);
    points.forEach((at, p) => lines.push(`  var $s${p} = slots[${points.length} * $i + ${p}];`));
  }
  lines.push(bodyCode(D, weights, anchor, !sparse, null));
  if (valueCode) lines.push(`  $u = (${valueCode}) * $area;`);
  const plain = exclude === 'plain';
  if (weights === 'quadratic') {
    axes.forEach(k => lines.push(`  var s${k}_0 = -(0.5 - d${k}), s${k}_1 = -2 * d${k}, s${k}_2 = 0.5 + d${k};`));
  }
  const value = '$value[$i]', slope = k => `$gradient[${D} * $i + ${k}]`;
  if (weights === 'linear') {
    // Corner values, then the interpolated value and its slope along each axis
    const nameOf = at => 'p' + at.join('');
    points.forEach((at, p) => lines.push(`  var ${nameOf(at)} = F[${cellOf(at, p, sparse)}]${plain ? ` - ${weightOf(weights, at)} * $u` : ''};`));
    lines.push(`  var $v = ${points.map(at => `${nameOf(at)} * ${weightOf(weights, at)}`).join(' + ')};`);
    axes.forEach(k => {
      const terms = points.filter(at => at[k] === 0).map(at => {
        const up = at.slice();
        up[k] = 1;
        const others = at.map((bit, m) => m === k ? null : (bit ? `f${m}` : `(1 - f${m})`)).filter(Boolean).join(' * ');
        return `(${nameOf(up)} - ${nameOf(at)}) * ${others}`;
      });
      lines.push(`  var $g${k} = (${terms.join(' + ')}) / cell;`);
    });
  } else {
    lines.push(`  var $v = 0, ${axes.map(k => `$g${k} = 0`).join(', ')};`);
    points.forEach((at, p) => {
      lines.push(`  var $w = ${weightOf(weights, at)};`);
      lines.push(`  var $q = F[${cellOf(at, p, sparse)}]${plain ? ' - $w * $u' : ''};`);
      lines.push('  $v += $w * $q;');
      axes.forEach(k => {
        const product = at.map((offset, m) => m === k ? `s${m}_${offset}` : `w${m}_${offset}`).join(' * ');
        lines.push(`  $g${k} += ${product} * $q;`);
      });
    });
    axes.forEach(k => lines.push(`  $g${k} /= cell;`));
  }
  if (exclude === 'smoothed') lines.push(selfCode(D, weights));
  lines.push(`  ${value} = $v;`);
  axes.forEach(k => lines.push(`  ${slope(k)} = $g${k};`));
  lines.push('}');
  return lines.join('\n');
}

// What a body reads back of its own smoothed deposit. The smoothing is a line solve A_k per axis,
// so that is u * prod_k (w_k' A_k^-1 w_k), and its slope along axis k replaces factor k with
// s_k' A_k^-1 w_k / cell (w_k: the body's weights on its 2 or 3 points of axis k; s_k: their
// slopes). Only the 2 x 2 or 3 x 3 block of A_k^-1 at those points is needed (see
// inverseNearDiagonal: diagonal d, and (A^-1)_{i,i+1} = -c_i d_{i+1}).
function selfCode(D, weights) {
  const per = weights === 'linear' ? 2 : 3;
  const lines = [];
  range(D).forEach(k => {
    // ($ic, $id: not $c, which names the deposit value's columns)
    lines.push(`var $ic${k} = $grid.inverse[${k}].c, $id${k} = $grid.inverse[${k}].d;`);
    const entry = (i, j) => `$G${k}_${Math.min(i, j)}${Math.max(i, j)}`;
    for (let i = 0; i < per; ++i) lines.push(`var ${entry(i, i)} = $id${k}[t${k} + ${i}];`);
    for (let i = 0; i + 1 < per; ++i) lines.push(`var ${entry(i, i + 1)} = -$ic${k}[t${k} + ${i}] * ${entry(i + 1, i + 1)};`);
    if (per === 3) lines.push(`var ${entry(0, 2)} = -$ic${k}[t${k}] * ${entry(1, 2)};`);
    const row = i => range(per).map(j => `${entry(i, j)} * ${axisWeight(weights, k, j)}`).join(' + ');
    lines.push(`var $read${k} = ${range(per).map(i => `${axisWeight(weights, k, i)} * (${row(i)})`).join(' + ')};`);
    lines.push(`var $tilt${k} = ${range(per).map(i => `${axisSlope(weights, k, i)} * (${row(i)})`).join(' + ')};`);
  });
  lines.push(`$v -= $u * ${range(D).map(k => `$read${k}`).join(' * ')};`);
  range(D).forEach(k => {
    lines.push(`$g${k} -= $u * ${range(D).map(m => m === k ? `$tilt${m}` : `$read${m}`).join(' * ')} / cell;`);
  });
  return lines.map(line => '  ' + line).join('\n');
}

/**
 * Bricks of 4^D cells for a sparse lattice: a hash map (open addressing, cleared lazily with a
 * stamp) from a brick's whole-number coordinates to its place in `value`. brick(x, y[, z]) returns
 * the index of the brick's first cell, adding it with zeros when it is new. `found` is scratch for
 * the generated deposit.
 */
function createBricks(D) {
  const size = 1 << (2 * D);
  let capacity = 0, mask = 0, used = 0, now = 0;
  let keys = null, stamp = null, start = null, value = null;
  const bricks = {
    value: null,
    found: new Int32Array(1 << D),
    reset(minimum) {
      if (capacity < 2 * minimum) {
        let slots = 1024;
        while (slots < 2 * minimum) slots *= 2;
        allocate(slots);
      }
      now += 1;
      if (now > 2e9) { stamp.fill(0); now = 1; }
      used = 0;
    },
    grow() {
      allocate(2 * capacity);
      now = 1;
      used = 0;
    },
    // true when `touch` more new bricks could fill the map past one half
    full(touch) { return 2 * (used + touch) > capacity; },
    brick: D === 2 ? brick2 : brick3
  };
  return bricks;

  function allocate(slots) {
    capacity = slots;
    mask = slots - 1;
    keys = new Int32Array(D * slots);
    stamp = new Int32Array(slots);
    start = new Int32Array(slots);
    // at most half the slots hold a brick
    value = bricks.value = new Float64Array(slots / 2 * size);
  }

  function add(i) {
    stamp[i] = now;
    const first = used++ * size;
    start[i] = first;
    for (let c = first; c < first + size; ++c) value[c] = 0;
    return first;
  }

  function brick2(x, y) {
    let i = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) & mask;
    while (true) {
      if (stamp[i] !== now) { keys[2 * i] = x; keys[2 * i + 1] = y; return add(i); }
      if (keys[2 * i] === x && keys[2 * i + 1] === y) return start[i];
      i = (i + 1) & mask;
    }
  }

  function brick3(x, y, z) {
    let i = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663) ^ Math.imul(z, 83492791)) & mask;
    while (true) {
      if (stamp[i] !== now) { keys[3 * i] = x; keys[3 * i + 1] = y; keys[3 * i + 2] = z; return add(i); }
      if (keys[3 * i] === x && keys[3 * i + 1] === y && keys[3 * i + 2] === z) return start[i];
      i = (i + 1) & mask;
    }
  }
}
