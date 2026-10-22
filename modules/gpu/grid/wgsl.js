// WGSL of the grid field (design 6.7 and 9.2): the GPU version of modules/gridfield, with the
// same grid and the same numbers. One step:
//
//   MINMAX: smallest and largest position per axis (integer atomics on order-preserving bits)
//   PARAMS: one thread; the grid's corner, cell and sizes as the CPU module computes them, the
//     sizes of the indirect dispatches, and the smoothing's coefficients (kept while they last)
//   BIN, SCAN x3, ORDER: a counting sort of the bodies by base cell (within a cell, in the order
//     the atomic counter gave them)
//   DEPOSIT: a thread per grid point gathers the bodies of the 2^D or 3^D base cells around it:
//     along x those cells are neighbours in the sorted order, so each stencil row is one run. It
//     adds in 64-bit fixed point, so the order of bodies within a cell does not change a bit: a
//     layout's start puts thousands of bodies in one cell (megaStars: 2,909 in a spring length
//     square), too many to put in index order
//   SMOOTH: one dispatch per axis, a line solve (Thomas) per grid line. Along x in 2D a workgroup
//     runs each line as a scan of affine maps; elsewhere a thread runs a line, loading 8 points
//     per wait (measured: one thread per line, a point per load, cost 0.28 of a 0.39 ms step)
//   RESIDUAL, SMOOTH again: from gamma 2 on, one step of iterative refinement keeps the smoothed
//     field in two words (gridField + gridLo), so slopes stay within 1e-6 of the CPU's however
//     far the smoothing reaches (see residual())
//   GATHER: a thread per body writes the value and gradient columns
//
// No float atomics anywhere, and no float sum whose order a race decides, so steps repeat exactly.
//
// Buffers owned here (the caller's are positions and the columns, through colRefs):
//   gridMeta  u32 words, see META; then the smoothing's coefficient tables (f32 bits)
//   gridCount bodies per grid cell (atomic; the scan zeroes it for the next step), then the largest
//             |deposit value| when that reads columns
//   gridStart where each cell's bodies start in the sorted order (one more entry for the end),
//             then the scan's block sums
//   gridKey   per body: its cell and its slot in it, and its deposit value when that reads columns
//   gridSp    per sorted body: its offsets in its base cell per axis and that cell along x (and its
//             value, in 2D in the third word; in 3D in a second vec4)
//   gridField the field, a density per grid point
//   gridLo    with smoothing: the deposit, then the residual, then the field's low word
export const WG = 256;
// Threads of a smoothing workgroup that runs one line per thread
const LINE_WG = 64;
// Bodies per block of the counting sort's scan
const SCAN_BLOCK = 2048;

// Words of gridMeta
export const META = {
  MIN: 0,        // D order-preserving keys
  MAX: 4,        // D keys
  K0: 8,         // lattice: the index of the grid's first point per axis (i32)
  SIZE: 12,      // grid points per axis
  CELL: 16,      // the cell, f32: CELL + CELL_LOW is the CPU's f64 cell to about 1e-14
  UNIT: 17,      // what one body deposits per unit weight: value / cell^D (or 1 / cell^D)
  TOTAL: 18,     // grid points in use
  FLAG: 19,      // this step: 0 ok, 1 lattice wider than maxCells, 2 no grid (field 0), 3 over capacity
  MA: 20,        // the anchor A = MA * cell + RA per axis (box: the grid's corner; lattice: -phase);
  RA: 24,        //   MA a whole number, both f32
  CELL_LOW: 27,
  BLOCKS: 28,    // blocks of the scan
  TAB_LAST: 30,  // last entry of the coefficient tables
  TAB_GAMMA: 31, // diffuse / cell^2 the tables hold (f32 bits)
  TAB_DONE: 32,  // entries they hold, or CONVERGED: entries past the last equal it
  ZERO: 33,      // always 0: grid_hold() in kernels without GU
  REFINE: 34,    // 1 when this step's smoothing takes the refinement step (see residual())
  STATUS: 36,    // sticky: [1 too wide | 3 over capacity, cells across (f32), cell (f32), axis]
  IND: 40,       // indirect dispatch arguments, 3 words each: scan blocks, scan add, deposit, smooth per
                 // axis, the residual, smooth per axis again (0 workgroups when the step does not refine)
  TABLE: 80,     // coefficient tables (see params()): 1 / pivot, then mu; tableSize entries each
};
export const IND_SCAN = META.IND, IND_ADD = META.IND + 3, IND_DEPOSIT = META.IND + 6, IND_SMOOTH = META.IND + 9;
export const IND_RESIDUAL = META.IND + 18, IND_SMOOTH_LOW = META.IND + 21;
// Smoothing from this gamma (diffuse / cell^2) on takes the refinement step; below it the plain
// f32 field's slopes are within 2e-6 of the CPU's (measured: 1.9e-6 at gamma 1, 3.2e-6 at 4)
const REFINE_GAMMA = 2;
const CONVERGED = 0xffffffff;

function each(n, fn, sep = ' ') {
  const out = [];
  for (let k = 0; k < n; k++) out.push(fn(k));
  return out.join(sep);
}

/**
 * Smoothing per axis: 'scan' (a workgroup per line) along contiguous 2D lines, 'lines' (a thread
 * per line, batched loads) elsewhere. That mix measured fastest (gridproto/RESULTS.md, variant M).
 */
export function smoothVariant(D, axis) {
  return D === 2 && axis === 0 ? 'scan' : 'lines';
}

/**
 * Words of the coefficient tables: a line is at most maxCells + 4 points (2 spare and the
 * quadratic stencil's padding)
 */
export function tableSize(maxCells) {
  return maxCells + 8;
}

/**
 * Grid points the buffers hold: every grid that fits maxCells, plus the end entry of the scan,
 * rounded up to whole scan blocks
 */
export function gridCapacity(D, maxCells) {
  return Math.ceil((Math.pow(maxCells + 4, D) + 1) / SCAN_BLOCK) * SCAN_BLOCK;
}

/**
 * The kernels of one grid field: {NAME: {code, bindings}}, where `bindings` lists
 * {name, kind: 'uniform' | 'step' | 'read' | 'storage'} in binding order ('step' is the caller's
 * step values: a uniform, at a dynamic offset when the caller says so).
 *
 * spec: {D, anchor, weights, smooth, self, maxCells, capacity, label, pos, outputs: {value,
 * gradient}, deposit: null | {lines, code, buffers}, values: {decl(binding), at(name)}}.
 * colRefs (`pos`, outputs) are {buffer, at(row, axis)}; `deposit` is the per-body value printed
 * as WGSL of row `i`, reading the caller's `buffers`.
 */
export function gridKernels(spec) {
  const { D, label } = spec;
  const k = {};
  k[`${label}_MINMAX`] = minmax(spec);
  k[`${label}_PARAMS`] = params(spec);
  k[`${label}_BIN`] = bin(spec);
  k[`${label}_SCAN_BLOCKS`] = scanBlocks(spec);
  k[`${label}_SCAN_TOP`] = scanTop(spec);
  k[`${label}_SCAN_ADD`] = scanAdd(spec);
  k[`${label}_ORDER`] = order(spec);
  k[`${label}_DEPOSIT`] = deposit(spec);
  if (spec.smooth) {
    for (let axis = 0; axis < D; axis++) k[`${label}_SMOOTH${axis}`] = smooth(spec, axis);
    k[`${label}_RESIDUAL`] = residual(spec);
  }
  k[`${label}_GATHER`] = gather(spec);
  return k;
}

// --- shared pieces ---------------------------------------------------------------------------

function quadratic(spec) {
  return spec.weights === 'quadratic';
}

// Words per body in gridKey, and vec4s per sorted body in gridSp
function keyWords(spec) {
  return spec.deposit ? 3 : 2;
}
function spWords(spec) {
  return spec.deposit && spec.D === 3 ? 2 : 1;
}

function common(spec) {
  const quad = quadratic(spec);
  return `struct GridU { n: u32, maxCells: u32, capacity: u32, tableSize: u32, zero: u32, unused0: u32, unused1: u32, unused2: u32 };
const GRID_PAD: i32 = ${quad ? 1 : 0};
fn grid_finite(x: f32) -> bool { return (bitcast<u32>(x) & 0x7f800000u) != 0x7f800000u; }
fn grid_enc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn grid_dec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
${quad ? `// quadratic (triangular-shaped cloud) weights and slopes of the points at offset d of the base
fn grid_w(f: f32, d: i32) -> f32 {
  if (d < 0) { let t = 0.5 - f; return 0.5 * t * t; }
  if (d == 0) { return 0.75 - f * f; }
  let t = 0.5 + f; return 0.5 * t * t;
}
fn grid_s(f: f32, d: i32) -> f32 {
  if (d < 0) { return f - 0.5; }
  if (d == 0) { return -2.0 * f; }
  return 0.5 + f;
}` : `// linear (cloud-in-cell) weights and slopes of the points at offset d of the base
fn grid_w(f: f32, d: i32) -> f32 { return select(1.0 - f, f, d == 1); }
fn grid_s(f: f32, d: i32) -> f32 { return select(-1.0, 1.0, d == 1); }`}
`;
}

// Declarations of a kernel's bindings, in order
function declare(spec, bindings) {
  return bindings.map((b, index) => {
    if (b.kind === 'step') return spec.values.decl(index);
    if (b.kind === 'uniform') return `@group(0) @binding(${index}) var<uniform> ${b.name}: ${b.type};`;
    return `@group(0) @binding(${index}) var<storage, ${b.kind === 'read' ? 'read' : 'read_write'}> ${b.name}: ${b.type};`;
  }).join('\n');
}

// grid_opq(x) is x, in a way the compiler cannot see through (GU.zero is 0). Metal compiles with
// fast math, which reassociates sums: without it, the exact arithmetic below folds away.
const OPAQUE = 'fn grid_opq(x: f32) -> f32 { return bitcast<f32>(bitcast<u32>(x) ^ GU.zero); }\n';

function kernel(spec, bindings, body) {
  const opaque = bindings.some(b => b.name === 'GU') ? OPAQUE : '';
  return { code: common(spec) + declare(spec, bindings) + '\n' + opaque + body, bindings: bindings.map(b => ({ name: b.name, kind: b.kind })) };
}

const U = { name: 'GU', kind: 'uniform', type: 'GridU' };
const STEP = { name: 'V', kind: 'step' };
const metaRead = { name: 'gridMeta', kind: 'read', type: 'array<u32>' };
const metaWrite = { name: 'gridMeta', kind: 'storage', type: 'array<u32>' };
const field = access => ({ name: 'gridField', kind: access, type: 'array<f32>' });
// the smoothed field's low word (see residual())
const low = access => ({ name: 'gridLo', kind: access, type: 'array<f32>' });

// The caller's buffers named by colRefs, once each
function callerBuffers(refs, access) {
  const names = [];
  refs.forEach(ref => { if (names.indexOf(ref.buffer) < 0) names.push(ref.buffer); });
  return names.map(name => ({ name, kind: access, type: 'array<f32>' }));
}

function f32At(word) {
  return `bitcast<f32>(gridMeta[${word}u])`;
}

// This step's grid, from gridMeta
function gridLets(spec) {
  const box = spec.anchor === 'box';
  let s = `  let cell = ${f32At(META.CELL)}; let clo = ${f32At(META.CELL_LOW)}; let total = gridMeta[${META.TOTAL}u]; let flag = gridMeta[${META.FLAG}u];\n`;
  for (let k = 0; k < spec.D; k++) {
    s += `  let s${k} = i32(gridMeta[${META.SIZE + k}u]); let ma${k} = ${f32At(META.MA + k)}; let ra${k} = ${f32At(META.RA + k)};`;
    s += box ? '\n' : ` let k${k} = bitcast<i32>(gridMeta[${META.K0 + k}u]);\n`;
  }
  return s;
}

// Body `i`: its base point b along each axis (the grid coordinate g = (x - A) / cell, floored;
// rounded for quadratic weights), its offset f from it, and its base cell c in the grid (clamped,
// so a body rounding past the edge stays inside). g is not formed: with cell = c + clo and
// A = MA cell + RA, x = m c + r (r from a fused multiply-add, exact) gives
// g = (m - MA) + (r - RA - m clo) / cell, so f is exact to about 1e-7 of a cell however wide the
// grid, as the CPU's f64 is. (In f32, g itself would be off by up to 6e-5 cells at 1,000 cells.)
function bodyLets(spec) {
  const box = spec.anchor === 'box', quad = quadratic(spec);
  let s = '';
  for (let k = 0; k < spec.D; k++) {
    s += `  let x${k} = ${spec.pos.at('i', k)};\n`;
    s += `  let m${k} = floor(x${k} / cell);\n`;
    s += `  let t${k} = grid_opq(fma(-m${k}, cell, x${k})) - ra${k} - m${k} * clo${quad ? ' + 0.5 * cell' : ''};\n`;
    s += `  let q${k} = floor(t${k} / cell);\n`;
    s += `  let b${k} = (m${k} - ma${k}) + q${k};\n`;
    s += `  let f${k} = t${k} / cell - q${k}${quad ? ' - 0.5' : ''};\n`;
    s += `  let c${k} = clamp(i32(b${k})${box ? '' : ` - k${k}`}, GRID_PAD, s${k} - 2);\n`;
  }
  s += `  let ok = ${each(spec.D, k => `grid_finite(x${k})`, ' && ')};\n`;
  return s;
}

function cellId(D) {
  return D === 3 ? 'c0 + c1 * s0 + c2 * s0 * s1' : 'c0 + c1 * s0';
}

// --- kernels ---------------------------------------------------------------------------------

function minmax(spec) {
  const { D } = spec;
  const bindings = [U, { name: spec.pos.buffer, kind: 'read', type: 'array<f32>' }, { name: 'gridMeta', kind: 'storage', type: 'array<atomic<u32>>' }];
  return kernel(spec, bindings, `var<workgroup> grid_mn: array<atomic<u32>, ${D}>;
var<workgroup> grid_mx: array<atomic<u32>, ${D}>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32, @builtin(num_workgroups) nwg: vec3u) {
  if (li < ${D}u) { atomicStore(&grid_mn[li], 0xffffffffu); atomicStore(&grid_mx[li], 0u); }
  workgroupBarrier();
  ${each(D, k => `var mn${k} = 3.4e38; var mx${k} = -3.4e38;`)}
  for (var i = gid.x; i < GU.n; i += nwg.x * ${WG}u) {
    ${each(D, k => `let x${k} = ${spec.pos.at('i', k)};`)}
    if (!(${each(D, k => `grid_finite(x${k})`, ' && ')})) { continue; }
    ${each(D, k => `mn${k} = min(mn${k}, x${k}); mx${k} = max(mx${k}, x${k});`)}
  }
  ${each(D, k => `atomicMin(&grid_mn[${k}], grid_enc(mn${k})); atomicMax(&grid_mx[${k}], grid_enc(mx${k}));`, '\n  ')}
  workgroupBarrier();
  if (li == 0u) {
    ${each(D, k => `atomicMin(&gridMeta[${META.MIN + k}u], atomicLoad(&grid_mn[${k}])); atomicMax(&gridMeta[${META.MAX + k}u], atomicLoad(&grid_mx[${k}]));`, '\n    ')}
  }
}`);
}

// The grid of this step, as modules/gridfield places it:
//  - box: corner = smallest - margin, cell = max(cell, widest span / maxCells), and per axis
//    min(ceil(span / cell), maxCells) + 2 + 2 * pad points (the min: f32 can land an ulp over
//    maxCells);
//  - lattice: points at multiples of the cell, from floor((smallest - margin) / cell) to
//    floor((largest + margin) / cell), plus 2 + 2 * pad. Positions are relative to the caller's
//    origin; `phase` (origin mod cell) puts them back on the lattice.
// pad is 1 for quadratic weights, whose stencil reaches a point further.
function params(spec) {
  const { D } = spec;
  const box = spec.anchor === 'box', at = spec.values.at;
  const TS = tableSize(spec.maxCells);
  const maxOf = names => names.reduce((a, b) => `max(${a}, ${b})`);
  const split = (w, word) => `grid_split(${w}, ${word}u);`;
  const lines = [];
  lines.push(`  let cellBase = ${at('cell')}; let margin = ${at('margin')};`);
  lines.push(`  let mg = vec2f(margin, ${at('marginLow')});`);
  lines.push('  var flag = 0u;');
  lines.push('  if (!(grid_finite(cellBase) && cellBase > 0.0 && grid_finite(margin) && margin >= 0.0)) { flag = 2u; }');
  lines.push(`  if (${each(D, k => `gridMeta[${META.MIN + k}u] > gridMeta[${META.MAX + k}u]`, ' || ')}) { flag = 2u; }`);
  for (let k = 0; k < D; k++) {
    lines.push(`  let mn${k} = grid_dec(gridMeta[${META.MIN + k}u]); let mx${k} = grid_dec(gridMeta[${META.MAX + k}u]);`);
    lines.push(`  gridMeta[${META.MIN + k}u] = 0xffffffffu; gridMeta[${META.MAX + k}u] = 0u;`);
  }
  // the cell as hi + lo: the CPU's f64 cell to about 1e-14, so the grid coordinates of bodies 1,000
  // cells away still agree with the CPU's
  lines.push(`  var cell = vec2f(cellBase, ${at('cellLow')});`);
  lines.push(`  ${each(D, k => `var sz${k} = 0u;`)}`);
  lines.push(`  ${each(D, k => `var ma${k} = 0.0; var ra${k} = 0.0;`)}`);
  const pad = quadratic(spec) ? 1 : 0;
  if (box) {
    for (let k = 0; k < D; k++) lines.push(`  let span${k} = grid_add(grid_sum(mx${k}, -mn${k}), 2.0 * mg);`);
    lines.push('  let most = f32(GU.maxCells);');
    for (let k = 0; k < D; k++) lines.push(`  { let fit = grid_over(span${k}, most); if (fit.x > cell.x || (fit.x == cell.x && fit.y > cell.y)) { cell = fit; } }`);
    lines.push('  if (!(grid_finite(cell.x) && cell.x > 0.0)) { flag = 2u; }');
    lines.push('  if (flag == 0u) {');
    for (let k = 0; k < D; k++) {
      // the corner, smallest - margin - pad * cell, as MA * cell + RA
      lines.push(`    let corner${k} = grid_add(grid_add(vec2f(mn${k}, 0.0), -mg), ${pad ? `-cell` : 'vec2f(0.0, 0.0)'});`);
      lines.push(`    ma${k} = floor(corner${k}.x / cell.x); ra${k} = grid_opq(fma(-ma${k}, cell.x, corner${k}.x)) + corner${k}.y - ma${k} * cell.y;`);
      lines.push(`    let fit${k} = grid_index(span${k}, 0.0, 0.0, cell);`);
      lines.push(`    sz${k} = min(u32(fit${k}.x) + select(0u, 1u, fit${k}.y > 0.0), GU.maxCells) + ${2 + 2 * pad}u;`);
    }
    lines.push('  }');
  } else {
    lines.push('  var widest = 0.0; var wideAxis = 0u;');
    lines.push('  if (flag == 0u) {');
    for (let k = 0; k < D; k++) {
      // positions are relative to the caller's origin: A = -phase puts them back on the lattice
      lines.push(`    let ph${k} = ${at('phase' + k)};`);
      lines.push(`    ma${k} = floor(-ph${k} / cell.x); ra${k} = grid_opq(fma(-ma${k}, cell.x, -ph${k})) - ma${k} * cell.y;`);
      lines.push(`    let lo${k} = grid_index(grid_add(vec2f(mn${k}, 0.0), -mg), ma${k}, ra${k}, cell).x;`);
      lines.push(`    let hi${k} = grid_index(grid_add(vec2f(mx${k}, 0.0), mg), ma${k}, ra${k}, cell).x;`);
      lines.push(`    let across${k} = hi${k} - lo${k};`);
      lines.push(`    if (!(across${k} <= f32(GU.maxCells)) && !(across${k} <= widest)) { widest = across${k}; wideAxis = ${k}u; }`);
      lines.push(`    sz${k} = u32(max(across${k}, 0.0)) + ${2 + 2 * pad}u;`);
      lines.push(`    gridMeta[${META.K0 + k}u] = bitcast<u32>(i32(lo${k}) - GRID_PAD);`);
    }
    lines.push('  }');
    lines.push('  if (flag == 0u && widest > 0.0) { flag = 1u; }');
    // sticky: the runner halts at the next readback and names the numbers
    lines.push(`  if (flag == 1u && gridMeta[${META.STATUS}u] == 0u) {`);
    lines.push(`    gridMeta[${META.STATUS}u] = 1u; gridMeta[${META.STATUS + 1}u] = bitcast<u32>(widest);`);
    lines.push(`    gridMeta[${META.STATUS + 2}u] = bitcast<u32>(cell.x); gridMeta[${META.STATUS + 3}u] = wideAxis;`);
    lines.push('  }');
  }
  for (let k = 0; k < D; k++) lines.push(`  gridMeta[${META.MA + k}u] = bitcast<u32>(ma${k}); gridMeta[${META.RA + k}u] = bitcast<u32>(ra${k});`);
  lines.push('  var total = 0u;');
  lines.push(`  if (flag == 0u) { total = ${each(D, k => `sz${k}`, ' * ')}; }`);
  lines.push('  if (flag == 0u && total + 1u > GU.capacity) {');
  lines.push(`    if (gridMeta[${META.STATUS}u] == 0u) { gridMeta[${META.STATUS}u] = 3u; gridMeta[${META.STATUS + 1}u] = bitcast<u32>(f32(total)); gridMeta[${META.STATUS + 2}u] = bitcast<u32>(cell.x); }`);
  lines.push('    flag = 3u; total = 0u;');
  lines.push('  }');
  for (let k = 0; k < D; k++) lines.push(`  gridMeta[${META.SIZE + k}u] = sz${k};`);
  lines.push(`  gridMeta[${META.CELL}u] = bitcast<u32>(cell.x); gridMeta[${META.CELL_LOW}u] = bitcast<u32>(cell.y);`);
  lines.push(`  gridMeta[${META.TOTAL}u] = total; gridMeta[${META.FLAG}u] = flag;`);
  // deposits are densities: per unit area (or volume) of a cell
  const area = each(D, () => 'cell.x', ' * ');
  lines.push(`  gridMeta[${META.UNIT}u] = bitcast<u32>(${spec.deposit ? '1.0' : at('value')} / (${area}));`);
  lines.push(`  let blocks = (total + ${SCAN_BLOCK}u) / ${SCAN_BLOCK}u;`);
  lines.push(`  gridMeta[${META.BLOCKS}u] = blocks;`);
  lines.push(`  gridMeta[${IND_SCAN}u] = blocks; gridMeta[${IND_SCAN + 1}u] = 1u; gridMeta[${IND_SCAN + 2}u] = 1u;`);
  lines.push(`  ${split(`(total + ${WG}u) / ${WG}u`, IND_ADD)}`);
  lines.push(`  ${split(`(total + ${WG - 1}u) / ${WG}u`, IND_DEPOSIT)}`);
  if (spec.smooth) {
    for (let k = 0; k < D; k++) {
      const lineCount = `select(0u, total / sz${k}, total > 0u)`;
      lines.push(`  ${split(smoothVariant(D, k) === 'scan' ? lineCount : `(${lineCount} + ${LINE_WG - 1}u) / ${LINE_WG}u`, IND_SMOOTH + 3 * k)}`);
    }
    // One implicit heat step: per axis a line solve with 1 + 2 gamma on the diagonal and -gamma
    // next to it, gamma = diffuse / cell^2 (zero outside the grid). Thomas's pivots m_i depend on
    // the distance from the line's start only, so one table serves every line and axis; it
    // converges within a few dozen entries, past which readers clamp, and is kept until gamma
    // changes or a longer line needs more of it.
    // The pivots come from mu_i = m_i - gamma: mu_0 = 1 + gamma, mu_i = 1 + gamma mu_{i-1} / m_{i-1},
    // m_i = gamma + mu_i, so no step subtracts. Thomas's own m_i = 1 + 2 gamma - gamma^2 / m_{i-1}
    // loses the 1 of 1 + 2 gamma to f32 rounding, which the pivots' fixed point amplifies: the solve
    // was off by about gamma times f32's precision (1e-5 at gamma 16), and is now off by about
    // sqrt(gamma) times it. The table holds 1 / m_i, and mu_i for the self term.
    lines.push(`  let diffuse = ${at('diffuse')};`);
    lines.push('  let gam = select(0.0, diffuse / (cell.x * cell.x), diffuse > 0.0);');
    lines.push(`  let refine = flag == 0u && gam >= ${REFINE_GAMMA}.0;`);
    lines.push(`  gridMeta[${META.REFINE}u] = select(0u, 1u, refine);`);
    lines.push(`  ${split(`select(0u, (total + ${WG - 1}u) / ${WG}u, refine)`, IND_RESIDUAL)}`);
    for (let k = 0; k < D; k++) {
      lines.push(`  for (var w = 0u; w < 3u; w++) { gridMeta[${IND_SMOOTH_LOW + 3 * k}u + w] = select(0u, gridMeta[${IND_SMOOTH + 3 * k}u + w], refine || w == 2u); }`);
    }
    lines.push(`  let need = ${maxOf(Array.from({ length: D }, (_, k) => `sz${k}`))};`);
    lines.push(`  let held = gridMeta[${META.TAB_DONE}u];`);
    lines.push(`  if (flag == 0u && (gridMeta[${META.TAB_GAMMA}u] != bitcast<u32>(gam) || (held != ${CONVERGED}u && held < need))) {`);
    lines.push(`    let ti = ${META.TABLE}u; let tu = ${META.TABLE + TS}u;`);
    lines.push('    var mu = 1.0 + gam; var inv = 1.0 / (gam + mu); var mu1 = -1.0; var inv1 = -1.0;');
    lines.push('    gridMeta[ti] = bitcast<u32>(inv); gridMeta[tu] = bitcast<u32>(mu);');
    lines.push(`    var last = 0u; var done = ${CONVERGED}u;`);
    lines.push('    loop {');
    lines.push('      if (last + 1u >= need) { done = need; break; }');
    lines.push('      let mu2 = 1.0 + gam * mu * inv; let inv2 = 1.0 / (gam + mu2);');
    lines.push('      last += 1u;');
    lines.push('      gridMeta[ti + last] = bitcast<u32>(inv2); gridMeta[tu + last] = bitcast<u32>(mu2);');
    // converged: the numbers repeat, or (f32 rounding) alternate between two; stopping at a
    // relative tolerance instead left the clamped entries 4e-7 off, which the solve amplifies
    lines.push('      if ((mu2 == mu && inv2 == inv) || (mu2 == mu1 && inv2 == inv1)) { break; }');
    lines.push('      mu1 = mu; inv1 = inv; mu = mu2; inv = inv2;');
    lines.push('    }');
    lines.push(`    gridMeta[${META.TAB_LAST}u] = last; gridMeta[${META.TAB_GAMMA}u] = bitcast<u32>(gam); gridMeta[${META.TAB_DONE}u] = done;`);
    lines.push('  }');
  }
  const bindings = [U, STEP, metaWrite];
  if (spec.deposit) {
    // the largest |deposit value| of this step, which BIN finds
    bindings.push({ name: 'gridCount', kind: 'storage', type: 'array<u32>' });
    lines.push(`  gridCount[${spec.capacity}u] = 0u;`);
  }
  return kernel(spec, bindings, `fn grid_split(w: u32, at: u32) { gridMeta[at] = min(w, 65535u); gridMeta[at + 1u] = (w + 65534u) / 65535u; gridMeta[at + 2u] = 1u; }
// Numbers held as hi + lo. a + b = s + e exactly (two-sum)
fn grid_sum(a: f32, b: f32) -> vec2f {
  let s = grid_opq(a + b);
  let bb = grid_opq(s - a);
  return vec2f(s, grid_opq(a - grid_opq(s - bb)) + grid_opq(b - bb));
}
fn grid_add(x: vec2f, y: vec2f) -> vec2f {
  let s = grid_sum(x.x, y.x);
  return grid_sum(s.x, s.y + x.y + y.y);
}
// x / k for a whole number k
fn grid_over(x: vec2f, k: f32) -> vec2f {
  let q = x.x / k;
  return grid_sum(q, (grid_opq(fma(-q, k, x.x)) + x.y) / k);
}
// floor((v - A) / cell) and the fraction left, with A = ma cell + ra (as bodyLets computes them)
fn grid_index(v: vec2f, ma: f32, ra: f32, cell: vec2f) -> vec2f {
  let m = floor(v.x / cell.x);
  let t = grid_opq(fma(-m, cell.x, v.x)) + v.y - ra - m * cell.y;
  let q = floor(t / cell.x);
  return vec2f(m - ma + q, t / cell.x - q);
}
@compute @workgroup_size(1)
fn main() {
${lines.join('\n')}
}`);
}

function bin(spec) {
  const KW = keyWords(spec);
  const bindings = [U, metaRead, { name: spec.pos.buffer, kind: 'read', type: 'array<f32>' },
    { name: 'gridCount', kind: 'storage', type: 'array<atomic<u32>>' }, { name: 'gridKey', kind: 'storage', type: 'array<u32>' }];
  if (spec.deposit) {
    bindings.push(STEP);
    spec.deposit.buffers.forEach(name => { if (!bindings.some(b => b.name === name)) bindings.push({ name, kind: 'read', type: 'array<f32>' }); });
  }
  // the deposit value, and the largest |value| (non-negative floats order as their bits)
  const value = spec.deposit ? `${spec.deposit.lines.map(line => '  ' + line).join('\n')}
  let grid_value = ${spec.deposit.code};
  gridKey[${KW}u * i + 2u] = bitcast<u32>(grid_value);
  if (ok) { atomicMax(&gridCount[${spec.capacity}u], bitcast<u32>(abs(grid_value))); }\n` : '';
  return kernel(spec, bindings, `@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= GU.n) { return; }
${gridLets(spec)}  if (flag != 0u) { return; }
${bodyLets(spec)}${value}  if (!ok) { gridKey[${KW}u * i] = 0xffffffffu; return; }
  let cid = u32(${cellId(spec.D)});
  gridKey[${KW}u * i] = cid;
  gridKey[${KW}u * i + 1u] = atomicAdd(&gridCount[cid], 1u);
}`);
}

// Exclusive scan of the counts in blocks of 2,048 (256 threads x 8); zeroes the counts for the
// next step. Block totals go after the starts.
function scanBlocks(spec) {
  return kernel(spec, [{ name: 'gridCount', kind: 'storage', type: 'array<u32>' }, { name: 'gridStart', kind: 'storage', type: 'array<u32>' }],
    `var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * ${SCAN_BLOCK}u + li * 8u;
  var a: array<u32, 8>;
  var t = 0u;
  for (var m = 0u; m < 8u; m++) { a[m] = gridCount[base + m]; gridCount[base + m] = 0u; t += a[m]; }
  tmp[li] = t;
  workgroupBarrier();
  for (var off = 1u; off < 256u; off <<= 1u) {
    var v = tmp[li];
    if (li >= off) { v += tmp[li - off]; }
    workgroupBarrier();
    tmp[li] = v;
    workgroupBarrier();
  }
  var ex = tmp[li] - t;
  for (var m = 0u; m < 8u; m++) { gridStart[base + m] = ex; ex += a[m]; }
  if (li == 255u) { gridStart[${spec.capacity}u + wid.x] = tmp[255]; }
}`);
}

// One workgroup scans the block totals (PER per thread)
function scanTop(spec) {
  const PER = Math.max(1, Math.ceil(spec.capacity / SCAN_BLOCK / 256));
  return kernel(spec, [metaRead, { name: 'gridStart', kind: 'storage', type: 'array<u32>' }], `var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  let nb = gridMeta[${META.BLOCKS}u];
  let top = ${spec.capacity}u;
  let base = li * ${PER}u;
  var a: array<u32, ${PER}>;
  var t = 0u;
  for (var m = 0u; m < ${PER}u; m++) { if (base + m < nb) { a[m] = gridStart[top + base + m]; } else { a[m] = 0u; } t += a[m]; }
  tmp[li] = t;
  workgroupBarrier();
  for (var off = 1u; off < 256u; off <<= 1u) {
    var v = tmp[li];
    if (li >= off) { v += tmp[li - off]; }
    workgroupBarrier();
    tmp[li] = v;
    workgroupBarrier();
  }
  var ex = tmp[li] - t;
  for (var m = 0u; m < ${PER}u; m++) { if (base + m < nb) { gridStart[top + base + m] = ex; } ex += a[m]; }
}`);
}

function scanAdd(spec) {
  return kernel(spec, [metaRead, { name: 'gridStart', kind: 'storage', type: 'array<u32>' }], `@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let e = gid.x + gid.y * nwg.x * ${WG}u;
  if (e > gridMeta[${META.TOTAL}u]) { return; }
  gridStart[e] += gridStart[${spec.capacity}u + e / ${SCAN_BLOCK}u];
}`);
}

// Each body's record at its place in the sorted order: its cell's start plus its slot
function order(spec) {
  const { D } = spec;
  const KW = keyWords(spec), SPW = spWords(spec);
  const value = spec.deposit ? `bitcast<f32>(gridKey[${KW}u * i + 2u])` : '0.0';
  let record;
  if (D === 2) record = `  gridSp[at] = vec4f(f0, f1, ${value}, f32(c0));`;
  else if (SPW === 1) record = '  gridSp[at] = vec4f(f0, f1, f2, f32(c0));';
  else record = `  gridSp[${SPW}u * at] = vec4f(f0, f1, f2, f32(c0));\n  gridSp[${SPW}u * at + 1u] = vec4f(${value}, 0.0, 0.0, 0.0);`;
  return kernel(spec, [U, metaRead, { name: spec.pos.buffer, kind: 'read', type: 'array<f32>' }, { name: 'gridKey', kind: 'read', type: 'array<u32>' },
    { name: 'gridStart', kind: 'read', type: 'array<u32>' }, { name: 'gridSp', kind: 'storage', type: 'array<vec4f>' }], `@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= GU.n) { return; }
${gridLets(spec)}  if (flag != 0u) { return; }
  let cid = gridKey[${KW}u * i];
  if (cid == 0xffffffffu) { return; }
${bodyLets(spec)}  let at = gridStart[cid] + gridKey[${KW}u * i + 1u];
${record}
}`);
}

// A thread per grid point j: the bodies whose stencil reaches j have base cells j - d, d in
// {0, 1} (linear) or {-1, 0, 1} (quadratic) per axis. Along x those cells are consecutive, so
// each stencil row is one run of sorted bodies.
// The sum is a 64-bit integer (hi, lo) of weights in units of 2^-30, so any order gives the same
// bits, and it is exact to 1e-9 per body (f32 adds would round at 6e-8). A deposit value read
// from columns scales each term by 2^30 / (the largest |value|, from BIN).
function deposit(spec) {
  const { D } = spec;
  const quad = quadratic(spec), SPW = spWords(spec);
  const ds = quad ? [-1, 0, 1] : [0, 1];
  const rows = [];
  if (D === 2) ds.forEach(d1 => rows.push([d1]));
  else ds.forEach(d2 => ds.forEach(d1 => rows.push([d1, d2])));
  const valueOf = D === 2 ? 'e.z' : `gridSp[${SPW}u * q + 1u].x`;
  // add a term of at most 2^30 to (hi, lo); a signed one carries its sign into hi
  const add = spec.deposit
    ? `let tq = i32(round(w * ${valueOf} * scale)); let sum = lo + bitcast<u32>(tq); hi += bitcast<u32>(tq >> 31u) + select(0u, 1u, sum < lo); lo = sum;`
    : 'let tq = u32(max(w, 0.0) * 1073741824.0 + 0.5); let sum = lo + tq; hi += select(0u, 1u, sum < lo); lo = sum;';
  const body = rows.map(([d1, d2]) => {
    const conds = ['cy >= 0 && cy < s1'];
    if (D === 3) conds.push('cz >= 0 && cz < s2');
    const w = `grid_w(e.x, dx) * grid_w(e.y, ${d1})` + (D === 3 ? ` * grid_w(e.z, ${d2})` : '');
    return `{
    let cy = j1 - (${d1});${D === 3 ? ` let cz = j2 - (${d2});` : ''}
    if (${conds.join(' && ')}) {
      let row = cy * s0${D === 3 ? ' + cz * s0 * s1' : ''};
      let beg = gridStart[u32(row + lo0)];
      let fin = gridStart[u32(row + hi0 + 1)];
      for (var q = beg; q < fin; q++) { let e = gridSp[${SPW === 1 ? 'q' : `${SPW}u * q`}]; let dx = j0 - i32(e.w); let w = ${w}; ${add} }
    }
  }`;
  }).join('\n  ');
  const bindings = [metaRead, { name: 'gridStart', kind: 'read', type: 'array<u32>' }, { name: 'gridSp', kind: 'read', type: 'array<vec4f>' }, field('storage')];
  if (spec.deposit) bindings.push({ name: 'gridCount', kind: 'read', type: 'array<u32>' });
  // with smoothing, the deposit stays in gridLo too: the residual needs it
  if (spec.smooth) bindings.push(low('storage'));
  const unit = f32At(META.UNIT);
  const scale = spec.deposit ? `  let most = bitcast<f32>(gridCount[${spec.capacity}u]);
  let scale = select(0.0, 1073741824.0 / most, most > 0.0);
` : '';
  const total = spec.deposit
    ? `select(0.0, (f32(bitcast<i32>(hi)) * 4294967296.0 + f32(lo)) * (${unit} / scale), scale > 0.0)`
    : `(f32(hi) * 4294967296.0 + f32(lo)) * (${unit} * 9.313225746154785e-10)`;
  return kernel(spec, bindings, `@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let t = gid.x + gid.y * nwg.x * ${WG}u;
${gridLets(spec)}  if (t >= total) { return; }
${scale}  let j0 = i32(t % u32(s0));
  let r = t / u32(s0);
  ${D === 3 ? 'let j1 = i32(r % u32(s1)); let j2 = i32(r / u32(s1));' : 'let j1 = i32(r);'}
  let lo0 = max(j0 - 1, 0);
  let hi0 = min(j0${quad ? ' + 1' : ''}, s0 - 1);
  var lo = 0u; var hi = 0u;
  ${body}
  let deposited = ${total};
  gridField[t] = deposited;${spec.smooth ? `\n  gridLo[t] = select(0.0, deposited, gridMeta[${META.REFINE}u] != 0u);` : ''}
}`);
}

// One step of iterative refinement for the smoothing. The f32 sweeps leave a few ulps of noise
// in every point of the smoothed field X, and a slope is a difference of neighbouring points,
// which on a field smoothed over many cells is a small difference of large numbers: at gamma 256
// the slopes were off by 1.9e-5 of their RMS. So the field is kept in two words, X + Y:
// R = u - (A_x A_y ...) X, then Y = the same smoothing of R (the second pass of the SMOOTH
// kernels, on gridLo). A_k = 1 + gamma L_k with L_k f = (f - f_left) + (f - f_right) (zero outside
// the grid); R is formed from those differences, never from (1 + 2 gamma) X, so its own rounding
// is noise the second smoothing averages away. Both words then hold the field to about 1e-12.
// gridLo holds the deposit u on entry (DEPOSIT) and R on exit.
function residual(spec) {
  const { D } = spec;
  const offsets = [];
  const walk = (k, cur) => { if (k === D) { offsets.push(cur); return; } for (const d of [-1, 0, 1]) walk(k + 1, cur.concat(d)); };
  walk(0, []);
  const key = o => o.map(d => ({ '-1': 'm', 0: 'z', 1: 'p' })[d]).join('');
  const strides = ['', ' * s0', ' * s0 * s1'];
  // neighbours outside the grid are 0; their loads are clamped inside it and the value dropped
  const loads = offsets.map(o => {
    const inside = o.map((d, k) => (d === 0 ? null : d < 0 ? `j${k} > 0` : `j${k} + 1 < s${k}`)).filter(Boolean);
    const idx = o.map((d, k) => `${d === 0 ? `j${k}` : d < 0 ? `max(j${k} - 1, 0)` : `min(j${k} + 1, s${k} - 1)`}${strides[k]}`).join(' + ');
    const load = `gridField[u32(${idx})]`;
    return `let x${key(o)} = ${inside.length ? `select(0.0, ${load}, ${inside.join(' && ')})` : load};`;
  });
  // (prod_{k in axes} L_k) X at the centre, as nested differences: L along the first axis of the
  // set at every offset of the others, and so on
  const products = [];
  const termOf = axes => {
    // values over offsets of `axes` (others at 0), reduced one axis at a time
    let table = new Map();
    offsets.filter(o => o.every((d, k) => axes.indexOf(k) >= 0 || d === 0)).forEach(o => table.set(key(o), `x${key(o)}`));
    let free = axes.slice();
    while (free.length) {
      const axis = free.shift();
      const next = new Map();
      table.forEach((code, k) => {
        const o = k.split('').map(c => ({ m: -1, z: 0, p: 1 })[c]);
        if (o[axis] !== 0) return;
        const at = d => table.get(key(o.map((v, a) => (a === axis ? d : v))));
        const name = `l${axes.join('')}_${axis}_${k}`;
        products.push(`let ${name} = grid_hold(grid_hold(${code} - ${at(-1)}) + grid_hold(${code} - ${at(1)}));`);
        next.set(k, name);
      });
      table = next;
    }
    return table.get(key(Array(D).fill(0)));
  };
  const sets = [];
  for (let mask = 1; mask < 1 << D; mask++) sets.push(Array.from({ length: D }, (_, k) => k).filter(k => mask & (1 << k)));
  const bySize = [1, 2, 3].map(size => sets.filter(set => set.length === size).map(termOf)).filter(list => list.length);
  const gammas = ['gam', 'gam * gam', 'gam * gam * gam'];
  const sum = bySize.map((list, i) => `grid_hold(${gammas[i]} * grid_hold(${list.join(' + ')}))`).join(' + ');
  // fast math would otherwise fold the differences back into (1 + 4 gamma + ...) X - ..., whose
  // cancellation is what the refinement is there to avoid
  return kernel(spec, [metaRead, field('read'), low('storage')], `fn grid_hold(x: f32) -> f32 { return bitcast<f32>(bitcast<u32>(x) ^ gridMeta[${META.ZERO}u]); }
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let t = gid.x + gid.y * nwg.x * ${WG}u;
  let total = gridMeta[${META.TOTAL}u];
  if (t >= total) { return; }
  let gam = ${f32At(META.TAB_GAMMA)};
  ${each(D, k => `let s${k} = i32(gridMeta[${META.SIZE + k}u]);`)}
  let j0 = i32(t % u32(s0));
  let r = t / u32(s0);
  ${D === 3 ? 'let j1 = i32(r % u32(s1)); let j2 = i32(r / u32(s1));' : 'let j1 = i32(r);'}
  ${loads.join('\n  ')}
  ${products.join('\n  ')}
  gridLo[t] = grid_hold(gridLo[t] - x${key(Array(D).fill(0))}) - grid_hold(${sum});
}`);
}

// First point, stride and length of line l along `axis`
function lineBase(axis) {
  if (axis === 0) return 'let base = l * u32(s0); let step = 1u; let L = u32(s0);';
  if (axis === 1) return 'let base = (l % u32(s0)) + (l / u32(s0)) * u32(s0 * s1); let step = u32(s0); let L = u32(s1);';
  return 'let base = l; let step = u32(s0 * s1); let L = u32(s2);';
}

function smooth(spec, axis) {
  const { D } = spec;
  const TS = tableSize(spec.maxCells);
  const sizes = `let s0 = i32(gridMeta[${META.SIZE}u]); let s1 = i32(gridMeta[${META.SIZE + 1}u]);${D === 3 ? ` let s2 = i32(gridMeta[${META.SIZE + 2}u]);` : ''}`;
  // 1 / m_m from the table (see params()): forward d_m = (u_m + gamma d_{m-1}) / m_m, backward
  // x_m = d_m + (gamma / m_m) x_{m+1}
  const tables = `let K = gridMeta[${META.TAB_LAST}u]; let gam = ${f32At(META.TAB_GAMMA)};
  let ti = ${META.TABLE}u;`;
  const bindings = [metaRead, field('storage')];
  if (smoothVariant(D, axis) === 'scan') {
    // A workgroup per line, every thread busy: both sweeps are first-order linear recurrences,
    // x_m = alpha_m x_{m-1} + beta_m, so each thread composes the affine maps of its PER points, a
    // workgroup scan composes the segments, and each thread replays its points from the value
    // entering its segment.
    const PWG = 256;
    const PER = Math.ceil(TS / PWG);
    return kernel(spec, bindings, `var<workgroup> sa: array<f32, ${PWG}>;
var<workgroup> sb: array<f32, ${PWG}>;
var<workgroup> wlines: u32;
// inclusive scan of affine maps (A, B), x -> A x + B, earlier maps applied first
fn grid_scan(li: u32) {
  for (var off = 1u; off < ${PWG}u; off <<= 1u) {
    var A = sa[li]; var B = sb[li];
    if (li >= off) { let Ap = sa[li - off]; let Bp = sb[li - off]; B = A * Bp + B; A = A * Ap; }
    workgroupBarrier();
    sa[li] = A; sb[li] = B;
    workgroupBarrier();
  }
}
@compute @workgroup_size(${PWG})
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  if (li == 0u) { wlines = select(0u, gridMeta[${META.TOTAL}u] / gridMeta[${META.SIZE + axis}u], gridMeta[${META.TOTAL}u] > 0u); }
  let lines = workgroupUniformLoad(&wlines);
  ${sizes}
  let l = wid.x + wid.y * nwg.x;
  if (l >= lines) { return; }
  ${lineBase(axis)}
  ${tables}
  let m0 = li * ${PER}u;
  var u: array<f32, ${PER}>;
  for (var k = 0u; k < ${PER}u; k++) { let m = m0 + k; if (m < L) { u[k] = gridField[base + m * step]; } else { u[k] = 0.0; } }
  // forward: d_m = alpha_m d_{m-1} + u_m inv_m, alpha_m = gamma inv_m (alpha_0 = 0)
  var A = 1.0; var B = 0.0;
  for (var k = 0u; k < ${PER}u; k++) {
    let m = m0 + k;
    if (m < L) { let iv = bitcast<f32>(gridMeta[ti + min(m, K)]); let al = select(gam * iv, 0.0, m == 0u); A = al * A; B = al * B + u[k] * iv; }
  }
  sa[li] = A; sb[li] = B;
  workgroupBarrier();
  grid_scan(li);
  var d = select(0.0, sb[max(li, 1u) - 1u], li > 0u);
  workgroupBarrier();
  for (var k = 0u; k < ${PER}u; k++) {
    let m = m0 + k;
    if (m < L) { let iv = bitcast<f32>(gridMeta[ti + min(m, K)]); let al = select(gam * iv, 0.0, m == 0u); d = al * d + u[k] * iv; u[k] = d; }
  }
  // backward: x_m = g_m x_{m+1} + d_m, g_m = gamma inv_m (g_{L-1} = 0), scanned from the end
  A = 1.0; B = 0.0;
  for (var k = ${PER - 1}; k >= 0; k--) {
    let m = m0 + u32(k);
    if (m < L) { let g = select(gam * bitcast<f32>(gridMeta[ti + min(m, K)]), 0.0, m == L - 1u); A = g * A; B = g * B + u[k]; }
  }
  let r = ${PWG - 1}u - li;
  sa[r] = A; sb[r] = B;
  workgroupBarrier();
  grid_scan(r);
  var x = select(0.0, sb[max(r, 1u) - 1u], r > 0u);
  for (var k = ${PER - 1}; k >= 0; k--) {
    let m = m0 + u32(k);
    if (m < L) { let g = select(gam * bitcast<f32>(gridMeta[ti + min(m, K)]), 0.0, m == L - 1u); x = g * x + u[k]; u[k] = x; }
  }
  for (var k = 0u; k < ${PER}u; k++) { let m = m0 + k; if (m < L) { gridField[base + m * step] = u[k]; } }
}`);
  }
  // A thread per line, loading 8 points per wait
  return kernel(spec, bindings, `@compute @workgroup_size(${LINE_WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let l = gid.x + gid.y * nwg.x * ${LINE_WG}u;
  let total = gridMeta[${META.TOTAL}u];
  ${sizes}
  if (total == 0u || l >= total / gridMeta[${META.SIZE + axis}u]) { return; }
  ${lineBase(axis)}
  ${tables}
  var d = gridField[base] * bitcast<f32>(gridMeta[ti]);
  gridField[base] = d;
  var u: array<f32, 8>; var cf: array<f32, 8>;
  var m = 1u;
  loop {
    if (m + 8u > L) { break; }
    for (var k = 0u; k < 8u; k++) { u[k] = gridField[base + (m + k) * step]; cf[k] = bitcast<f32>(gridMeta[ti + min(m + k, K)]); }
    for (var k = 0u; k < 8u; k++) { d = (u[k] + gam * d) * cf[k]; u[k] = d; }
    for (var k = 0u; k < 8u; k++) { gridField[base + (m + k) * step] = u[k]; }
    m += 8u;
  }
  for (; m < L; m++) { let idx = base + m * step; d = (gridField[idx] + gam * d) * bitcast<f32>(gridMeta[ti + min(m, K)]); gridField[idx] = d; }
  var x = d;
  var q = i32(L) - 2;
  loop {
    if (q < 7) { break; }
    for (var k = 0; k < 8; k++) { u[k] = gridField[base + u32(q - k) * step]; cf[k] = gam * bitcast<f32>(gridMeta[ti + min(u32(q - k), K)]); }
    for (var k = 0; k < 8; k++) { x = u[k] + cf[k] * x; u[k] = x; }
    for (var k = 0; k < 8; k++) { gridField[base + u32(q - k) * step] = u[k]; }
    q -= 8;
  }
  for (; q >= 0; q--) { let idx = base + u32(q) * step; x = gridField[idx] + gam * bitcast<f32>(gridMeta[ti + min(u32(q), K)]) * x; gridField[idx] = x; }
}`);
}

// A thread per body: value = sum over its stencil of w * F, gradient = sum of grad w * F / cell.
// self 'exclude' leaves the body's own share out: without smoothing its deposit at each point;
// with smoothing what it reads back of its own smoothed deposit (see selfLines).
function gather(spec) {
  const { D } = spec;
  const quad = quadratic(spec), KW = keyWords(spec);
  const ds = quad ? [-1, 0, 1] : [0, 1];
  const exclude = spec.self === 'exclude' ? (spec.smooth ? 'smoothed' : 'plain') : null;
  const name = d => ({ '-1': 'm', 0: 'z', 1: 'p' })[d];
  let pre = '';
  for (let k = 0; k < D; k++) {
    for (const d of ds) pre += `  let w${k}${name(d)} = grid_w(f${k}, ${d}); let q${k}${name(d)} = grid_s(f${k}, ${d});\n`;
  }
  const combos = [];
  const walk = (k, cur) => { if (k === D) { combos.push(cur); return; } for (const d of ds) walk(k + 1, cur.concat(d)); };
  walk(0, []);
  const strides = ['', ' * s0', ' * s0 * s1'];
  // the field at each stencil point (less the body's own deposit); a smoothed field comes in two
  // words, gridField + gridLo (see residual())
  const words = spec.smooth ? [['o', 'gridField'], ['l', 'gridLo']] : [['o', 'gridField']];
  const local = (c, word = 'o') => word + c.map(name).join('');
  const loads = [];
  words.forEach(([word, buffer]) => combos.forEach(c => {
    const idx = c.map((d, k) => `(c${k} + (${d}))${strides[k]}`).join(' + ');
    const wp = c.map((d, k) => `w${k}${name(d)}`).join(' * ');
    loads.push(`let ${local(c, word)} = ${buffer}[u32(${idx})]${exclude === 'plain' ? ` - u * ${wp}` : ''};`);
  }));
  const value = `var v = ${words.map(([word]) => combos.map(c => `${c.map((d, k) => `w${k}${name(d)}`).join(' * ')} * ${local(c, word)}`).join(' + ')).join(' + ')};`;
  // The slope along g from differences of neighbouring points, as the CPU's linear code does: on
  // a smooth field, slope * F rounded per point leaves a residue that differences do not. The
  // quadratic slopes add up to 0, so sum_j s_j F_j = s_m (F_m - F_z) + s_p (F_p - F_z).
  const slopes = Array.from({ length: D }, (_, g) => {
    const terms = [];
    words.forEach(([word]) => combos.filter(c => c[g] === 0).forEach(c => {
      const others = c.map((d, k) => (k === g ? null : `w${k}${name(d)}`)).filter(Boolean).join(' * ');
      const at = shift => local(c.map((d, k) => (k === g ? shift : d)), word);
      // (opaque, or fast math multiplies out the differences, and the hi and lo words with them)
      const along = quad ? `(q${g}m * grid_opq(${at(-1)} - ${at(0)}) + q${g}p * grid_opq(${at(1)} - ${at(0)}))` : `grid_opq(${at(1)} - ${at(0)})`;
      terms.push(others ? `grid_opq(${along} * ${others})` : along);
    }));
    return `var gr${g} = ${terms.join(' + ')};`;
  });
  const terms = loads.concat([value], slopes).join('\n  ');
  const outRefs = [spec.outputs.value, spec.outputs.gradient];
  const bindings = [U, metaRead, { name: spec.pos.buffer, kind: 'read', type: 'array<f32>' }, field('read')]
    .concat(spec.smooth ? [low('read')] : [], callerBuffers(outRefs, 'storage'));
  if (exclude && spec.deposit) bindings.push({ name: 'gridKey', kind: 'read', type: 'array<u32>' });
  const write = (v, g) => `${spec.outputs.value.at('i', 0)} = ${v}; ${each(D, k => `${spec.outputs.gradient.at('i', k)} = ${g(k)};`)}`;
  const unit = f32At(META.UNIT);
  return kernel(spec, bindings, `${exclude === 'smoothed' ? selfFunctions(spec) : ''}@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= GU.n) { return; }
${gridLets(spec)}  // no grid (a cell of 0, no body at a finite position): the field is 0, as on the CPU
  if (flag == 2u) { ${write('0.0', () => '0.0')} return; }
  // a lattice too wide (the runner halts at the next readback): the columns keep their numbers
  if (flag != 0u) { return; }
${bodyLets(spec)}  if (!ok) { ${write('0.0', () => '0.0')} return; }
  let u = ${exclude && spec.deposit ? `bitcast<f32>(gridKey[${KW}u * i + 2u]) * ${unit}` : unit};
${pre}  ${terms}
${exclude === 'smoothed' ? selfLines(spec) : ''}  ${write('v', k => `gr${k} / cell`)}
}`);
}

// What a body reads back of its own smoothed deposit. The smoothing is a line solve A_k per axis,
// so that is u * prod_k (w_k' A_k^-1 w_k), and its slope along k replaces factor k with
// s_k' A_k^-1 w_k (w_k: the body's weights on its points of axis k, s_k their slopes). Only the
// 2 x 2 or 3 x 3 block of A_k^-1 at those points is needed: its diagonal is
// 1 / (m_p + n_p - (1 + 2 gamma)) = 1 / (mu_p + nu_p - 1), with m the forward pivots and n the
// backward ones, which for this matrix are the forward ones counted from the line's other end
// (mu = m - gamma, see params()); off the diagonal, (A^-1)_{p,q} = (gamma / m_p) (A^-1)_{p+1,q}
// for p < q. (modules/gridfield: inverseNearDiagonal, selfCode.)
function selfFunctions(spec) {
  const TS = tableSize(spec.maxCells);
  return `fn grid_mu(p: i32, K: u32) -> f32 { return bitcast<f32>(gridMeta[${META.TABLE + TS}u + min(u32(p), K)]); }
fn grid_keep(p: i32, K: u32, gam: f32) -> f32 { return gam * bitcast<f32>(gridMeta[${META.TABLE}u + min(u32(p), K)]); }
fn grid_d(p: i32, L: i32, K: u32) -> f32 { return 1.0 / (grid_mu(p, K) + grid_mu(L - 1 - p, K) - 1.0); }
`;
}

function selfLines(spec) {
  const { D } = spec;
  const per = quadratic(spec) ? 3 : 2;
  const ds = quadratic(spec) ? [-1, 0, 1] : [0, 1];
  const name = d => ({ '-1': 'm', 0: 'z', 1: 'p' })[d];
  const lines = [`  let sK = gridMeta[${META.TAB_LAST}u]; let sg = ${f32At(META.TAB_GAMMA)};`];
  for (let k = 0; k < D; k++) {
    const G = (i, j) => `G${k}_${Math.min(i, j)}${Math.max(i, j)}`;
    lines.push(`  let st${k} = c${k} - GRID_PAD;`);
    for (let i = 0; i < per; i++) lines.push(`  let ${G(i, i)} = grid_d(st${k} + ${i}, s${k}, sK);`);
    for (let i = 0; i + 1 < per; i++) lines.push(`  let ${G(i, i + 1)} = grid_keep(st${k} + ${i}, sK, sg) * ${G(i + 1, i + 1)};`);
    if (per === 3) lines.push(`  let ${G(0, 2)} = grid_keep(st${k}, sK, sg) * ${G(1, 2)};`);
    const row = i => ds.map((d, j) => `${G(i, j)} * w${k}${name(d)}`).join(' + ');

    lines.push(`  let r${k}_0 = ${row(0)}; let r${k}_1 = ${row(1)};${per === 3 ? ` let r${k}_2 = ${row(2)};` : ''}`);
    lines.push(`  let tilt${k} = ${per === 3 ? `q${k}m * (r${k}_0 - r${k}_1) + q${k}p * (r${k}_2 - r${k}_1)` : `r${k}_1 - r${k}_0`};`);
    lines.push(`  let read${k} = ${ds.map((d, i) => `w${k}${name(d)} * r${k}_${i}`).join(' + ')};`);
  }
  lines.push(`  v -= u * ${each(D, k => `read${k}`, ' * ')};`);
  for (let k = 0; k < D; k++) lines.push(`  gr${k} -= u * ${each(D, m => (m === k ? `tilt${m}` : `read${m}`), ' * ')};`);
  return lines.join('\n') + '\n';
}
