// WGSL of the generic grid pyramid: the far field of the tree passes (the stock repulsion and the
// addRepulsion passes walked with it) for every plan that is not the exact 2D stock step, in 2D
// and 3D, with K charges at once (design 6.6 and 9.1). It is today's grid engine
// (templates/grid.js) with every coordinate unrolled per axis and every cell sum kept per charge:
//
//   robust box -> bin bodies into a G^D Morton grid (counting sort; index order within a cell, so
//   runs repeat exactly) -> per cell, each charge's sum and centre -> 2^D reductions up to one
//   cell -> per cell, the far field of its interaction list (children of the parent's 3^D
//   neighbours that are not my neighbours) as a field and a Jacobian per charge at the cell's
//   middle -> per body, in the node kernel that fuses the section: exact pairs in its 3^D cells
//   and the far field down its chain of cells, each charge weighted by the body's sensitivity.
//
// Charges. Channel 0 opens nothing here (the pyramid has no theta) but sets the shared centre: a
// channel with centroid 'shared' acts from channel 0's centre of the cell (from the mean of its
// bodies when channel 0 weighs nothing there), the others from their own centre, so their charges
// must not be negative. Channels with one law object evaluate it once per pair, and a law is not
// evaluated where the weight of its channels is 0 (as the CPU's K-charge tree does).
//
// Buffers (all owned by the pyramid, except the columns it reads through `colRef`s):
//   treeBox   box state: bounding box, grid box, histogram centre, then D histograms
//   treeCount atomic body counts per finest cell (zeroed by the scan)
//   treeWork  [cell (bit 31: outside the box) and slot per body: 2n | bodies by atomic slot: n]
//   treeMeta  [start per finest cell | (row, cell) per sorted body: 2n | sorted slot per row: n |
//              bodies per cell of every level]
//   treeSp    per sorted body: position, then each channel's charge (vec4s)
//   treeCells [lookup tables | per cell of every level: charge sums and centres | per cell of
//              every level but the top: the local expansion (middle, then field and Jacobian per
//              channel)]
import { createPrinter, lawPrologue } from '../wgsl/print.js';

export const WG = 256;
export const HIST_BINS = 1024;
const AX = 'xyzw';

function each(n, fn, sep = ' ') {
  const out = [];
  for (let k = 0; k < n; k++) out.push(fn(k));
  return out.join(sep);
}

// Literal for a float the generator knows (always with a decimal point)
function lit(value) {
  let text = String(Math.fround(value));
  if (/^-?\d+$/.test(text)) text += '.0';
  else if (/e/.test(text) && !/\./.test(text)) text = text.replace('e', '.0e');
  return value < 0 ? '(' + text + ')' : text;
}

// Word `w` of a record loaded into vec4 locals `name0`, `name1`, ...
function word(name, w) {
  return `${name}${w >> 2}.${AX[w & 3]}`;
}

function loadVec4s(name, buffer, base, count) {
  return each(count, j => `let ${name}${j} = ${buffer}[${base}${j ? ` + ${j}u` : ''}];`);
}

// vec4 writes of `words` (WGSL expressions) at `base`, zero padded
function storeVec4s(buffer, base, words) {
  const out = [];
  for (let j = 0; j < words.length; j += 4) {
    const four = [0, 1, 2, 3].map(q => (j + q < words.length ? words[j + q] : '0.0'));
    out.push(`${buffer}[${base}${j ? ` + ${j / 4}u` : ''}] = vec4f(${four.join(', ')});`);
  }
  return out.join(' ');
}

/**
 * The layout of a pyramid for `D` and `channels` ([{own}]: own centre or channel 0's): record
 * words, vec4 strides and the box state. Channel 0 always has its own centre.
 */
export function pyramidLayout(D, channels, tableWords = 0) {
  const K = channels.length;
  const JN = D * (D + 1) / 2;
  // cell record: S_0, C_0, then per channel S_c and its own centre if it has one
  const S = [], C = [];
  let w = 0;
  channels.forEach((channel, c) => {
    S.push(w++);
    if (c === 0 || channel.own) { C.push(w); w += D; } else C.push(C[0]);
  });
  const CSW = w;
  // bodies per cell: in the record's padding when it has some, else in treeMeta
  const CNT = CSW % 4 ? CSW : -1;
  // local expansion: the cell's middle, then per channel the field and the Jacobian
  const F = [], J = [];
  w = D;
  for (let c = 0; c < K; c++) { F.push(w); J.push(w + D); w += D + JN; }
  const LSW = w;
  const pairs = [];
  for (let a = 0; a < D; a++) for (let b = a; b < D; b++) pairs.push([a, b]);
  return {
    D, K, JN, pairs,
    SPW: D + K, SP4: Math.ceil((D + K) / 4),
    S, C, CSW, CS4: Math.ceil(CSW / 4), CNT,
    F, J, LSW, LS4: Math.ceil(LSW / 4),
    TAB4: Math.ceil(tableWords / 4),
    box: boxLayout(D),
    bits: Math.floor(31 / D),
  };
}

// Box state (u32 words) for D axes
export function boxLayout(D) {
  const L = { BB_MIN: 0, BB_MAX: D, ORIGIN: 2 * D, SIDE: 3 * D, INV: 3 * D + 1, CENTRE: 3 * D + 2, DIAG: 4 * D + 2 };
  L.HEADER = Math.ceil((4 * D + 3) / 4) * 4;
  L.size = L.HEADER + D * HIST_BINS;
  return L;
}

// Bit spreading for Morton codes (bit b of x goes to bit b * D), with the classic magic numbers
function spreadSteps(D, bits) {
  const at = [];
  for (let i = 0; i < bits; i++) at.push(i);
  const steps = [];
  for (let j = Math.floor(Math.log2(Math.max(1, bits - 1))); j >= 0; j--) {
    const shift = (1 << j) * (D - 1);
    for (let i = 0; i < bits; i++) if ((i >> j) & 1) at[i] += shift;
    let mask = 0;
    for (const p of at) mask = (mask | (1 << p)) >>> 0;
    steps.push([shift, mask >>> 0]);
  }
  return steps;
}

const hex = v => '0x' + (v >>> 0).toString(16) + 'u';

function mortonFns(D, bits) {
  const steps = spreadSteps(D, bits);
  const low = ((1 << bits) - 1) >>> 0;
  const back = [];
  for (let j = steps.length - 1; j >= 0; j--) back.push([steps[j][0], j ? steps[j - 1][1] : low]);
  return /* wgsl */`
fn spread(v: u32) -> u32 {
  var x = v & ${hex(low)};
  ${steps.map(([sh, m]) => `x = (x | (x << ${sh}u)) & ${hex(m)};`).join(' ')}
  return x;
}
fn compact(v: u32) -> u32 {
  var x = v & ${hex(steps[steps.length - 1][1])};
  ${back.map(([sh, m]) => `x = (x | (x >> ${sh}u)) & ${hex(m)};`).join(' ')}
  return x;
}`;
}

// Direction for two coincident bodies, from their indices: deterministic and antisymmetric,
// jitter(a, b) == -jitter(b, a), with length 0.01 (2D: today's, templates/grid.js)
function jitterFn(D) {
  const hash = `var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;`;
  if (D === 2) {
    return `
fn jitter(a: u32, b: u32) -> vec2f {
  ${hash}
  let angle = f32(h) * (6.2831853 / 4294967296.0);
  return select(-0.01, 0.01, a < b) * vec2f(cos(angle), sin(angle));
}`;
  }
  return `
fn jitter(a: u32, b: u32) -> vec3f {
  ${hash}
  let z = f32(h & 0xffffu) * (2.0 / 65536.0) - 1.0;
  let angle = f32(h >> 16u) * (6.2831853 / 65536.0);
  let s = sqrt(max(0.0, 1.0 - z * z));
  return select(-0.01, 0.01, a < b) * vec3f(s * cos(angle), s * sin(angle), z);
}`;
}

// Nested loops over a box of cells lo<k>..hi<k> (variables x<k>), with the Morton code of the
// current cell in mm0 and `body` innermost
function boxLoops(D, body, indent) {
  let open = '', close = '';
  for (let k = D - 1; k >= 0; k--) {
    const pad = indent + '  '.repeat(D - 1 - k);
    open += `${pad}for (var x${k} = lo${k}; x${k} <= hi${k}; x${k}++) {\n`;
    open += `${pad}  let mm${k} = ${k === D - 1 ? '' : `mm${k + 1} | `}(spread(u32(x${k})) << ${k}u);\n`;
    close = `${pad}}\n` + close;
  }
  const pad = indent + '  '.repeat(D);
  return open + body.trim().split('\n').map(line => pad + line.trim()).join('\n') + '\n' + close;
}

// Thread index over a 1D or 2D grid of workgroups (2D past 65,535 workgroups, see build.js)
const LINEAR = `@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u`;
const LINEAR_ID = `gid.x + gid.y * nwg.x * ${WG}u`;

/**
 * The struct of the pyramid's uniform. `lawWords`: numbers of the laws kept here (0 when the
 * caller's step values hold them).
 */
function paramsStruct(lawWords) {
  return /* wgsl */`
struct TreeParams {
  n: u32, G: u32, levels: u32, nCells: u32,
  locOff: u32, metaTag: u32, metaRow: u32, metaCount: u32,
  nearCap: u32, outlierRank: u32, gravity: f32, pad: u32,${lawWords ? `
  law: array<vec4f, ${Math.ceil(lawWords / 4)}>,` : ''}
};`;
}

// ---------------------------------------------------------------------------------------------
// Laws: per law group, functions of r (and r^2) for F(r)/r (k1) and (F(r)/r - F'(r))/r^2 (k2)
// ---------------------------------------------------------------------------------------------

function lawFunctions(spec) {
  const { groups, L } = spec;
  const printer = createPrinter(spec.warn);
  return groups.map((group, g) => {
    if (group.isDefault) {
      return `
fn tree_k1_${g}(r: f32, r2: f32) -> f32 { return 1.0 / (r2 * r); }
fn tree_k12_${g}(r: f32, r2: f32) -> vec2f { let k1 = 1.0 / (r2 * r); return vec2f(k1, 3.0 * k1 / r2); }`;
    }
    const law = group.law;
    const prologue = lawPrologue(law, i => group.value(i));
    const tables = (group.tables || []).map(table => tableFns(g, table)).join('');
    const body = (k2) => withTables(g, law.emit(printer, L.D, 'r', 'k1', k2 ? 'k2' : undefined));
    return `${tables}
fn tree_k1_${g}(r: f32, r2: f32) -> f32 { ${prologue} ${body(false)} return k1; }
fn tree_k12_${g}(r: f32, r2: f32) -> vec2f { ${prologue} ${body(true)} return vec2f(k1, k2); }${law.hasRange ? `
fn tree_in_${g}(r2: f32) -> bool { ${prologue} return r2 <= lawRange2; }` : ''}`;
  }).join('\n');
}

// A table call printed by the law compiler (lawFunctions.T.value(x) and its derivative) becomes a
// lookup in treeCells
function withTables(g, code) {
  const arg = '(\\(?[^()]*\\)?)';
  return code
    .replace(new RegExp(`\\(lawFunctions\\.(\\w+)\\.derivative \\? lawFunctions\\.\\w+\\.derivative\\(${arg}\\) : 0\\)`, 'g'), `tree_slope_${g}_$1($2)`)
    .replace(new RegExp(`lawFunctions\\.(\\w+)\\.value\\(${arg}\\)`, 'g'), `tree_table_${g}_$1($2)`);
}

// Linear interpolation of the library's tables (lib/formula.js createTable): the first value at
// and below `from`, the last at and past `to`; the slope of the straight piece as the derivative
function tableFns(g, table) {
  const last = table.length - 1;
  const scale = last / (table.to - table.from);
  const read = idx => `tree_tableWord(${table.base}u + ${idx})`;
  return `
fn tree_table_${g}_${table.name}(x: f32) -> f32 {
  let q = (x - ${lit(table.from)}) * ${lit(scale)};
  if (!(q > 0.0)) { return ${read('0u')}; }
  if (q >= ${lit(last)}) { return ${read(`${last}u`)}; }
  let k = u32(q);
  let a = ${read('k')};
  return a + (${read('k + 1u')} - a) * (q - f32(k));
}
fn tree_slope_${g}_${table.name}(x: f32) -> f32 {
  let q = (x - ${lit(table.from)}) * ${lit(scale)};
  if (!(q > 0.0) || q >= ${lit(last)}) { return 0.0; }
  let k = u32(q);
  return (${read('k + 1u')} - ${read('k')}) * ${lit(scale)};
}`;
}

function tableWordFn(L) {
  return L.TAB4 ? `
fn tree_tableWord(w: u32) -> f32 { return treeCells[w >> 2u][w & 3u]; }` : '';
}

// Is any of `channels` weighing something at a source (an expression per channel)?
function nonzero(channels, value) {
  return channels.map(c => `${value(c)} != 0.0`).join(' || ');
}

// ---------------------------------------------------------------------------------------------
// Kernels
// ---------------------------------------------------------------------------------------------

/**
 * The structure kernels and the node section of a pyramid. `spec`:
 *   {D, channels: [{own, group}], groups: [{isDefault, law, value(i), tables, channels}], L,
 *    pos: colRef, charges: [colRef], lawWords, values?: {decl(binding), gravity}, warn}
 * colRef: {buffer, type?, at(row, axis)}.
 */
export function pyramidKernels(spec) {
  const { D, L } = spec;
  const K = L.K;
  const BL = L.box;
  const HB = HIST_BINS;
  const common = paramsStruct(spec.lawWords) + mortonFns(D, L.bits) + jitterFn(D);
  const tp = `@group(0) @binding(0) var<uniform> TP: TreeParams;`;
  const stepDecl = spec.values ? spec.values.decl : null;
  const gravity = spec.values && spec.values.gravity ? spec.values.gravity : 'TP.gravity';

  // The caller's buffers a kernel reads columns from, each bound once, read only
  const columnBindings = (refs, first) => {
    const seen = [];
    refs.forEach(ref => { if (seen.indexOf(ref.buffer) < 0) seen.push(ref.buffer); });
    const types = {};
    refs.forEach(ref => { types[ref.buffer] = ref.type || 'array<f32>'; });
    return {
      names: seen,
      decl: seen.map((name, k) => `@group(0) @binding(${first + k}) var<storage, read> ${name}: ${types[name]};`).join('\n'),
    };
  };
  const posAt = (row, k) => spec.pos.at(row, k);

  const HIST = (() => {
    const cols = columnBindings([spec.pos], 1);
    return common + /* wgsl */`
${tp}
${cols.decl}
@group(0) @binding(${1 + cols.names.length}) var<storage, read_write> treeBox: array<atomic<u32>>;
var<workgroup> hist: array<atomic<u32>, ${D * HB}>;
var<workgroup> wb: array<atomic<u32>, ${2 * D}>;
fn fenc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn hbin(d: f32) -> u32 {
  let key = u32(clamp(i32(bitcast<u32>(abs(d)) >> 20u) - 824, 0, 511));
  return select(512u + key, 511u - key, d < 0.0);
}
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(num_workgroups) nwg: vec3u) {
  for (var b = li; b < ${D * HB}u; b += ${WG}u) { atomicStore(&hist[b], 0u); }
  if (li < ${D}u) { atomicStore(&wb[li], 0xffffffffu); } else if (li < ${2 * D}u) { atomicStore(&wb[li], 0u); }
  workgroupBarrier();
  ${each(D, k => `let c${k} = bitcast<f32>(atomicLoad(&treeBox[${BL.CENTRE + k}]));`)}
  ${each(D, k => `var mn${k} = 3e38; var mx${k} = -3e38;`)}
  for (var i = gid.x; i < TP.n; i += nwg.x * ${WG}u) {
    ${each(D, k => `let p${k} = ${posAt('i', k)};`)}
    if (!(${each(D, k => `abs(p${k}) < 1e37`, ' && ')})) { continue; } // NaN or inf
    ${each(D, k => `mn${k} = min(mn${k}, p${k}); mx${k} = max(mx${k}, p${k});`)}
    ${each(D, k => `atomicAdd(&hist[${k * HB}u + hbin(p${k} - c${k})], 1u);`)}
  }
  ${each(D, k => `atomicMin(&wb[${k}], fenc(mn${k})); atomicMax(&wb[${D + k}], fenc(mx${k}));`)}
  workgroupBarrier();
  for (var b = li; b < ${D * HB}u; b += ${WG}u) {
    let v = atomicLoad(&hist[b]);
    if (v != 0u) { atomicAdd(&treeBox[${BL.HEADER}u + b], v); }
  }
  if (li == 0u) {
    ${each(D, k => `atomicMin(&treeBox[${BL.BB_MIN + k}], atomicLoad(&wb[${k}])); atomicMax(&treeBox[${BL.BB_MAX + k}], atomicLoad(&wb[${D + k}]));`, '\n    ')}
  }
}`;
  })();

  // One workgroup: quantiles from the histograms -> grid box: the bounding box, shrunk to the
  // [k, n - 1 - k] quantile range (k = outlierRank) plus a 25% margin when that is smaller, so
  // ordinary layouts get exactly the bounding box. Moves the histogram centre to the median and
  // resets the histograms and the bounding box for the next step.
  const BOX = common + /* wgsl */`
${tp}
@group(0) @binding(1) var<storage, read_write> treeBox: array<u32>;
var<workgroup> scan: array<u32, ${WG}>;
var<workgroup> found: array<f32, ${3 * D}>;
var<workgroup> total: u32;
fn fdec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
fn keyLo(key: u32) -> f32 { return select(bitcast<f32>((key + 824u) << 20u), 0.0, key == 0u); }
fn keyHi(key: u32) -> f32 { return bitcast<f32>((key + 825u) << 20u); }
fn edgeLo(s: u32) -> f32 { return select(-keyHi(511u - s), keyLo(s - 512u), s >= 512u); }
fn edgeHi(s: u32) -> f32 { return select(-keyLo(511u - s), keyHi(s - 512u), s >= 512u); }
@compute @workgroup_size(${WG})
fn main(@builtin(local_invocation_index) li: u32) {
  if (li < ${3 * D}u) { found[li] = 0.0; }
  for (var a = 0u; a < ${D}u; a++) {
    let base = ${BL.HEADER}u + a * ${HB}u + li * 4u;
    var cs = array<u32, 4>(treeBox[base], treeBox[base + 1u], treeBox[base + 2u], treeBox[base + 3u]);
    let t = cs[0] + cs[1] + cs[2] + cs[3];
    scan[li] = t;
    workgroupBarrier();
    for (var off = 1u; off < ${WG}u; off <<= 1u) {
      var v = scan[li];
      if (li >= off) { v += scan[li - off]; }
      workgroupBarrier();
      scan[li] = v;
      workgroupBarrier();
    }
    let count = scan[${WG - 1}];
    if (li == 0u) { total = count; }
    var cum = scan[li] - t;
    if (count > 0u) {
      let k = min(TP.outlierRank, (count - 1u) / 2u);
      let rLo = k; let rHi = count - 1u - k; let rMed = count / 2u;
      for (var j = 0u; j < 4u; j++) {
        let s = li * 4u + j;
        let e = cum + cs[j];
        if (rLo >= cum && rLo < e) { found[a * 3u] = edgeLo(s); }
        if (rHi >= cum && rHi < e) { found[a * 3u + 1u] = edgeHi(s); }
        if (rMed >= cum && rMed < e) { found[a * 3u + 2u] = 0.5 * (edgeLo(s) + edgeHi(s)); }
        cum = e;
      }
    }
    for (var j = 0u; j < 4u; j++) { treeBox[base + j] = 0u; }
    workgroupBarrier();
  }
  if (li == 0u) {
    if (total > 0u) {
      var span = 0.0;
      ${each(D, k => `let c${k} = bitcast<f32>(treeBox[${BL.CENTRE + k}]); let qLo${k} = c${k} + found[${3 * k}]; let qHi${k} = c${k} + found[${3 * k + 1}]; span = max(span, qHi${k} - qLo${k});`, '\n      ')}
      let margin = 0.25 * span;
      var side = 0.0; var diag = 0.0;
      ${each(D, k => `let lo${k} = max(fdec(treeBox[${BL.BB_MIN + k}]), qLo${k} - margin); let hi${k} = min(fdec(treeBox[${BL.BB_MAX + k}]), qHi${k} + margin); side = max(side, hi${k} - lo${k}); diag = max(diag, fdec(treeBox[${BL.BB_MAX + k}]) - fdec(treeBox[${BL.BB_MIN + k}]));`, '\n      ')}
      side = max(side * 1.0001, 1e-3);
      ${each(D, k => `treeBox[${BL.ORIGIN + k}] = bitcast<u32>(0.5 * (lo${k} + hi${k}) - 0.5 * side); treeBox[${BL.CENTRE + k}] = bitcast<u32>(c${k} + found[${3 * k + 2}]);`, '\n      ')}
      treeBox[${BL.SIDE}] = bitcast<u32>(side); treeBox[${BL.INV}] = bitcast<u32>(f32(TP.G) / side);
      treeBox[${BL.DIAG}] = bitcast<u32>(diag);
    }
    ${each(D, k => `treeBox[${BL.BB_MIN + k}] = 0xffffffffu; treeBox[${BL.BB_MAX + k}] = 0u;`, '\n    ')}
  }
}`;

  const BIN = (() => {
    const cols = columnBindings([spec.pos], 1);
    const b = 1 + cols.names.length;
    return common + /* wgsl */`
${tp}
${cols.decl}
@group(0) @binding(${b}) var<storage, read> treeBox: array<u32>;
@group(0) @binding(${b + 1}) var<storage, read_write> treeCount: array<atomic<u32>>;
@group(0) @binding(${b + 2}) var<storage, read_write> treeWork: array<u32>;
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${LINEAR_ID};
  if (i >= TP.n) { return; }
  let inv = bitcast<f32>(treeBox[${BL.INV}]);
  let gmax = f32(TP.G - 1u);
  ${each(D, k => `let q${k} = (${posAt('i', k)} - bitcast<f32>(treeBox[${BL.ORIGIN + k}])) * inv;`, '\n  ')}
  // outside the box (by more than half a cell): clamped into a border cell
  let inside = ${each(D, k => `q${k} > -0.5 && q${k} < gmax + 1.5`, ' && ')};
  let c = ${each(D, k => `(spread(u32(clamp(floor(q${k}), 0.0, gmax))) << ${k}u)`, ' | ')};
  treeWork[2u * i] = c | select(0x80000000u, 0u, inside);
  treeWork[2u * i + 1u] = atomicAdd(&treeCount[c], 1u);
}`;
  })();

  // Exclusive scan of the counts (nCells = a multiple of 1,024, at most 2^20) in blocks of 1,024
  // into the starts; zeroes the counts for the next step
  const SCAN_BLOCKS = /* wgsl */`
@group(0) @binding(0) var<storage, read_write> treeCount: array<u32>;
@group(0) @binding(1) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(2) var<storage, read_write> blockSums: array<u32>;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * 1024u + li * 4u;
  let a0 = treeCount[base]; let a1 = treeCount[base + 1u]; let a2 = treeCount[base + 2u]; let a3 = treeCount[base + 3u];
  treeCount[base] = 0u; treeCount[base + 1u] = 0u; treeCount[base + 2u] = 0u; treeCount[base + 3u] = 0u;
  let t = a0 + a1 + a2 + a3;
  tmp[li] = t;
  workgroupBarrier();
  for (var off = 1u; off < 256u; off <<= 1u) {
    var v = tmp[li];
    if (li >= off) { v += tmp[li - off]; }
    workgroupBarrier();
    tmp[li] = v;
    workgroupBarrier();
  }
  let ex = tmp[li] - t;
  treeMeta[base] = ex; treeMeta[base + 1u] = ex + a0; treeMeta[base + 2u] = ex + a0 + a1; treeMeta[base + 3u] = ex + a0 + a1 + a2;
  if (li == 255u) { blockSums[wid.x] = tmp[255]; }
}`;

  const SCAN_TOP = /* wgsl */`
@group(0) @binding(0) var<storage, read_write> blockSums: array<u32>;
@group(0) @binding(1) var<uniform> nb: vec4u;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  let base = li * 4u;
  var a = vec4u(0u);
  for (var k = 0u; k < 4u; k++) { if (base + k < nb.x) { a[k] = blockSums[base + k]; } }
  let t = a.x + a.y + a.z + a.w;
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
  for (var k = 0u; k < 4u; k++) { if (base + k < nb.x) { blockSums[base + k] = ex; } ex += a[k]; }
}`;

  const SCAN_ADD = paramsStruct(spec.lawWords) + /* wgsl */`
${tp}
@group(0) @binding(1) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(2) var<storage, read> blockSums: array<u32>;
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let e = ${LINEAR_ID};
  if (e >= TP.nCells) { return; }
  treeMeta[e] += blockSums[e >> 10u];
}`;

  // Counting sort, part 1: bodies in the (run-dependent) order of the atomic slots
  const PLACE = paramsStruct(spec.lawWords) + /* wgsl */`
${tp}
@group(0) @binding(1) var<storage, read> treeMeta: array<u32>;
@group(0) @binding(2) var<storage, read_write> treeWork: array<u32>;
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${LINEAR_ID};
  if (i >= TP.n) { return; }
  treeWork[2u * TP.n + treeMeta[treeWork[2u * i] & 0x7fffffffu] + treeWork[2u * i + 1u]] = i;
}`;

  // Part 2: within a cell, bodies go in index order, so sums run in the same order every time and
  // runs repeat exactly; a cell of more than 1,024 bodies keeps the atomic order, as today.
  // Writes each body's position and charges, its (row, cell), and its slot by row.
  const ORDER = (() => {
    const cols = columnBindings([spec.pos].concat(spec.charges), 1);
    const b = 1 + cols.names.length;
    const words = [];
    for (let k = 0; k < D; k++) words.push(`${posAt('i', k)}`);
    spec.charges.forEach(ref => words.push(ref.at('i', 0)));
    return paramsStruct(spec.lawWords) + /* wgsl */`
${tp}
${cols.decl}
@group(0) @binding(${b}) var<storage, read> treeWork: array<u32>;
@group(0) @binding(${b + 1}) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(${b + 2}) var<storage, read_write> treeSp: array<vec4f>;
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${LINEAR_ID};
  if (i >= TP.n) { return; }
  let raw = treeWork[2u * i];
  let c = raw & 0x7fffffffu;
  let s = treeMeta[c];
  let e = select(TP.n, treeMeta[c + 1u], c + 1u < TP.nCells);
  var rank = treeWork[2u * i + 1u];
  if (e - s <= 1024u) { // a pathologically full cell keeps the atomic order
    rank = 0u;
    for (var t = s; t < e; t++) { if (treeWork[2u * TP.n + t] < i) { rank++; } }
  }
  let k = s + rank;
  ${storeVec4s('treeSp', `k * ${L.SP4}u`, words)}
  treeMeta[TP.metaTag + 2u * k] = i;
  treeMeta[TP.metaTag + 2u * k + 1u] = raw;
  treeMeta[TP.metaRow + i] = k;
}`;
  })();

  // Finest cells: count, each channel's sum and centre (channel 0's centre falls back to the
  // mean of the bodies where its charges sum to 0)
  const own = [];
  spec.channels.forEach((ch, c) => { if (c === 0 || ch.own) own.push(c); });
  const recordWords = (S, C, count) => {
    const words = [];
    for (let c = 0; c < K; c++) {
      words[L.S[c]] = S(c);
      if (own.indexOf(c) >= 0) for (let k = 0; k < D; k++) words[L.C[c] + k] = C(c, k);
    }
    if (L.CNT >= 0) words[L.CNT] = `f32(${count})`;
    return words;
  };
  const AGG0 = paramsStruct(spec.lawWords) + /* wgsl */`
${tp}
@group(0) @binding(1) var<storage, read> treeSp: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(3) var<storage, read_write> treeCells: array<vec4f>;
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let c = ${LINEAR_ID};
  if (c >= TP.nCells) { return; }
  let s = treeMeta[c];
  let e = select(TP.n, treeMeta[c + 1u], c + 1u < TP.nCells);
  ${each(K, q => `var m${q} = 0.0;`)}
  ${own.map(q => each(D, k => `var s${q}_${k} = 0.0;`)).join(' ')}
  ${each(D, k => `var u${k} = 0.0;`)}
  for (var t = s; t < e; t++) {
    ${loadVec4s('b', 'treeSp', `t * ${L.SP4}u`, L.SP4)}
    ${each(K, q => `m${q} += ${word('b', D + q)};`)}
    ${own.map(q => each(D, k => `s${q}_${k} += ${word('b', D + q)} * ${word('b', k)};`)).join(' ')}
    ${each(D, k => `u${k} += ${word('b', k)};`)}
  }
  let cnt = e - s;
  let mean = select(0.0, 1.0 / f32(cnt), cnt > 0u);
  ${own.map(q => `let i${q} = select(0.0, 1.0 / m${q}, m${q} != 0.0);`).join(' ')}
  ${each(D, k => `let c0_${k} = select(u${k} * mean, s0_${k} * i0, m0 != 0.0);`)}
  ${storeVec4s('treeCells', `${L.TAB4}u + c * ${L.CS4}u`, recordWords(q => `m${q}`, (q, k) => (q === 0 ? `c0_${k}` : `s${q}_${k} * i${q}`), 'cnt'))}${L.CNT < 0 ? `
  treeMeta[TP.metaCount + c] = cnt;` : ''}
}`;

  // One level up: 2^D children, contiguous in Morton order
  const PYR = /* wgsl */`
struct Level { count: u32, childOff: u32, parentOff: u32, metaCount: u32 };
@group(0) @binding(0) var<uniform> lv: Level;
@group(0) @binding(1) var<storage, read_write> treeCells: array<vec4f>;${L.CNT < 0 ? `
@group(0) @binding(2) var<storage, read_write> treeMeta: array<u32>;` : ''}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let q = ${LINEAR_ID};
  if (q >= lv.count) { return; }
  ${each(K, c => `var m${c} = 0.0;`)}
  ${own.map(c => each(D, k => `var s${c}_${k} = 0.0;`)).join(' ')}
  ${each(D, k => `var u${k} = 0.0;`)}
  var cnt = 0u;
  for (var ch = 0u; ch < ${1 << D}u; ch++) {
    let child = lv.childOff + ${1 << D}u * q + ch;
    ${L.CNT < 0 ? `let n = treeMeta[lv.metaCount + child];
    if (n == 0u) { continue; }
    ${loadVec4s('a', 'treeCells', `${L.TAB4}u + child * ${L.CS4}u`, L.CS4)}` : `${loadVec4s('a', 'treeCells', `${L.TAB4}u + child * ${L.CS4}u`, L.CS4)}
    let n = u32(${word('a', L.CNT)});
    if (n == 0u) { continue; }`}
    cnt += n;
    ${each(K, c => `m${c} += ${word('a', L.S[c])};`)}
    ${own.map(c => each(D, k => `s${c}_${k} += ${word('a', L.S[c])} * ${word('a', L.C[c] + k)};`)).join(' ')}
    ${each(D, k => `u${k} += f32(n) * ${word('a', L.C[0] + k)};`)}
  }
  let mean = select(0.0, 1.0 / f32(cnt), cnt > 0u);
  ${own.map(c => `let i${c} = select(0.0, 1.0 / m${c}, m${c} != 0.0);`).join(' ')}
  ${each(D, k => `let c0_${k} = select(u${k} * mean, s0_${k} * i0, m0 != 0.0);`)}
  ${storeVec4s('treeCells', `${L.TAB4}u + (lv.parentOff + q) * ${L.CS4}u`, recordWords(c => `m${c}`, (c, k) => (c === 0 ? `c0_${k}` : `s${c}_${k} * i${c}`), 'cnt'))}${L.CNT < 0 ? `
  treeMeta[lv.metaCount + lv.parentOff + q] = cnt;` : ''}
}`;

  const lawCode = lawFunctions(spec) + tableWordFn(L);
  const lawGroups = spec.groups;
  // The centres channels act from: channel 0's (shared) and each own one
  const centres = [{ word: L.C[0], channels: [] }];
  spec.channels.forEach((ch, c) => {
    if (c === 0 || !ch.own) centres[0].channels.push(c);
    else centres.push({ word: L.C[c], channels: [c] });
  });

  // The far field of one source cell record `a` (loaded) at the point (x<k>), for every channel:
  // field and Jacobian into F<c>_<k>, J<c>_<e> (jacobian), or field only (monopole) into acc<c>_<k>
  const sourceCell = (at, jacobian) => centres.map(centre => {
    const lines = [];
    lines.push(`{`);
    lines.push(each(D, k => `let d${k} = ${word('a', centre.word + k)} - ${at(k)};`));
    lines.push(`let r2 = ${each(D, k => `d${k} * d${k}`, ' + ')};`);
    const groups = [];
    centre.channels.forEach(c => {
      const g = spec.channels[c].group;
      let entry = groups.find(x => x.g === g);
      if (!entry) groups.push(entry = { g, channels: [] });
      entry.channels.push(c);
    });
    lines.push(`if (r2 > 0.0) {`);
    lines.push(`let r = sqrt(r2);`);
    groups.forEach(({ g, channels }) => {
      const conds = [];
      // a source whose charges weigh nothing pushes nothing (in 3D most cells are empty)
      conds.push(`(${nonzero(channels, c => word('a', L.S[c]))})`);
      if (lawGroups[g].law && lawGroups[g].law.hasRange) conds.push(`tree_in_${g}(r2)`);
      const open = conds.length ? `if (${conds.join(' && ')}) {` : '{';
      lines.push(open);
      if (jacobian) {
        lines.push(`let k = tree_k12_${g}(r, r2);`);
        channels.forEach(c => {
          lines.push(`let g${c} = ${word('a', L.S[c])} * k.x; let h${c} = ${word('a', L.S[c])} * k.y;`);
          lines.push(each(D, k => `F${c}_${k} += g${c} * d${k};`));
          // d/dp of S k1(r) (q - p) = S (k2 d d^T - k1 I)
          lines.push(L.pairs.map(([p, q], e) => `J${c}_${e} += h${c} * d${p} * d${q}${p === q ? ` - g${c}` : ''};`).join(' '));
        });
      } else {
        lines.push(`let k1 = tree_k1_${g}(r, r2);`);
        channels.forEach(c => {
          lines.push(each(D, k => `acc${c}_${k} += (${word('a', L.S[c])} * k1) * d${k};`));
        });
      }
      lines.push(`}`);
    });
    lines.push(`}`);
    lines.push(`}`);
    return lines.join('\n');
  }).join('\n');

  // Bodies in cell `index` (any level)
  const countAt = index => (L.CNT < 0 ? `treeMeta[TP.metaCount + ${index}]` : `u32(treeCells[${L.TAB4}u + (${index}) * ${L.CS4}u + ${L.CNT >> 2}u].${AX[L.CNT & 3]})`);
  // The interaction list of cell (xl<k>) at level `off` (cells of size w): children of the
  // parent's 3^D neighbours that are not my neighbours, skipping empty parents
  const interactionList = (body, indent) => `
${indent}let poff = off + ${each(D, () => 'Gl', ' * ')};
${indent}let Gp = Gi / 2;
${indent}${each(D, k => `let lo${k} = max((xl${k} >> 1u) - 1, 0); let hi${k} = min((xl${k} >> 1u) + 1, Gp - 1);`)}
${boxLoops(D, `
if (${countAt('poff + mm0')} == 0u) { continue; }
for (var ch = 0u; ch < ${1 << D}u; ch++) {
  ${each(D, k => `let y${k} = 2 * x${k} + i32((ch >> ${k}u) & 1u);`)}
  if (${each(D, k => `abs(y${k} - xl${k}) <= 1`, ' && ')}) { continue; }
  let src = off + ((mm0 << ${D}u) | ch);
  ${loadVec4s('a', 'treeCells', `${L.TAB4}u + src * ${L.CS4}u`, L.CS4)}
  ${body}
}`, indent)}`;

  // treeMeta only when it holds the counts; then the caller's step values (law numbers per
  // step), when they hold them
  const localMeta = L.CNT < 0 ? '\n@group(0) @binding(2) var<storage, read> treeMeta: array<u32>;' : '';
  const valueBinding = stepDecl ? '\n' + stepDecl(L.CNT < 0 ? 3 : 2) : '';
  const LOCAL = common + lawCode + /* wgsl */`
${tp}
@group(0) @binding(1) var<storage, read_write> treeCells: array<vec4f>;${localMeta}${valueBinding}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let t = ${LINEAR_ID};
  var off = 0u; var Gl = TP.G; var l = 0u;
  loop {
    if (l >= TP.levels) { return; }
    let count = ${each(D, () => 'Gl', ' * ')};
    if (t < off + count) { break; }
    off += count; Gl >>= 1u; l++;
  }
  let c = t - off;
  ${loadVec4s('m', 'treeCells', `${L.TAB4}u + (off + c) * ${L.CS4}u`, L.CS4)}
  if (${L.CNT < 0 ? 'treeMeta[TP.metaCount + off + c]' : `u32(${word('m', L.CNT)})`} == 0u) { return; }
  let Gi = i32(Gl);
  ${each(D, k => `let xl${k} = i32(compact(c >> ${k}u));`, ' ')}
  // the expansion centre: the cell's centre of channel 0's charge (of its bodies when that is
  // 0), where its bodies are, rather than its middle: half the error or less on hub graphs
  ${each(D, k => `let ce${k} = ${word('m', L.C[0] + k)};`)}
  ${each(K, c => each(D, k => `var F${c}_${k} = 0.0;`) + ' ' + L.pairs.map((_, e) => `var J${c}_${e} = 0.0;`).join(' '), '\n  ')}
${interactionList(sourceCell(k => `ce${k}`, true), '  ')}
  let o = TP.locOff + t * ${L.LS4}u;
  ${storeVec4s('treeCells', 'o', (() => {
    const words = [];
    for (let k = 0; k < D; k++) words[k] = `ce${k}`;
    for (let c = 0; c < K; c++) {
      for (let k = 0; k < D; k++) words[L.F[c] + k] = `F${c}_${k}`;
      L.pairs.forEach((_, e) => { words[L.J[c] + e] = `J${c}_${e}`; });
    }
    return words;
  })())}
}`;

  // The section: the push on the body in sorted slot k (row i) with sensitivities s[c]
  const vec = `vec${D}f`;
  const nearPair = (() => {
    const lines = [];
    lines.push(loadVec4s('q', 'treeSp', `t * ${L.SP4}u`, L.SP4));
    lines.push(each(D, k => `var d${k} = ${word('q', k)} - p${k};`));
    lines.push(`var r2 = ${each(D, k => `d${k} * d${k}`, ' + ')};`);
    lines.push(`if (r2 == 0.0) { let jt = jitter(i, treeMeta[TP.metaTag + 2u * t]); ${each(D, k => `d${k} = jt.${AX[k]};`)} r2 = ${each(D, k => `d${k} * d${k}`, ' + ')}; }`);
    lines.push(`let r = sqrt(r2);`);
    lines.push(`var g = 0.0;`);
    lawGroups.forEach((group, gi) => {
      const weight = group.channels.map(c => `s[${c}] * ${word('q', D + c)}`).join(' + ');
      const conds = [];
      if (K > 1 && !group.isDefault) conds.push(`wt${gi} != 0.0`);
      if (group.law && group.law.hasRange) conds.push(`tree_in_${gi}(r2)`);
      lines.push(`let wt${gi} = ${weight};`);
      const add = `g += wt${gi} * tree_k1_${gi}(r, r2);`;
      lines.push(conds.length ? `if (${conds.join(' && ')}) { ${add} }` : add);
    });
    lines.push(each(D, k => `a${k} += (wgt * g) * d${k};`));
    return lines.join('\n');
  })();

  const nearField = boxLoops(D, `
let s0 = treeMeta[mm0];
let e0 = select(TP.n, treeMeta[mm0 + 1u], mm0 + 1u < TP.nCells);
let cnt = e0 - s0;
var stride = 1u;
if (cnt > TP.nearCap) { stride = (cnt + TP.nearCap - 1u) / TP.nearCap; }
let wgt = f32(stride);
for (var t = s0; t < e0; t += stride) {
  if (t == k) { continue; }
  ${nearPair}
}`, '  ');

  const farInside = `
    var off = 0u; var Gl = TP.G; var cc = c;
    for (var l = 0u; l < TP.levels; l++) {
      ${loadVec4s('e', 'treeCells', `TP.locOff + (off + cc) * ${L.LS4}u`, L.LS4)}
      ${each(D, k => `let h${k} = p${k} - ${word('e', k)};`)}
      ${each(K, c => each(D, q => `b${q} += s[${c}] * (${word('e', L.F[c] + q)} + ${each(D, r => {
    const e = L.pairs.findIndex(([x, y]) => (x === q && y === r) || (x === r && y === q));
    return `${word('e', L.J[c] + e)} * h${r}`;
  }, ' + ')});`), '\n      ')}
      off += ${each(D, () => 'Gl', ' * ')}; Gl >>= 1u; cc >>= ${D}u;
    }`;

  const farOutside = `
    var off = 0u; var Gl = TP.G;
    ${each(K, c => each(D, k => `var acc${c}_${k} = 0.0;`))}
    for (var l = 0u; l < TP.levels; l++) {
      let Gi = i32(Gl);
      ${each(D, k => `let xl${k} = cx${k} >> l;`)}
${interactionList(sourceCell(k => `p${k}`, false), '      ')}
      off += ${each(D, () => 'Gl', ' * ')}; Gl >>= 1u;
    }
    ${each(K, c => each(D, k => `b${k} += s[${c}] * acc${c}_${k};`), '\n    ')}`;

  const forceFn = /* wgsl */`
fn tree_force(k: u32, s: array<f32, ${K}>) -> ${vec} {
  if (${each(K, c => `s[${c}] == 0.0`, ' && ')}) { return ${vec}(0.0); }
  let i = treeMeta[TP.metaTag + 2u * k];
  let raw = treeMeta[TP.metaTag + 2u * k + 1u];
  let c = raw & 0x7fffffffu;
  ${loadVec4s('me', 'treeSp', `k * ${L.SP4}u`, L.SP4)}
  ${each(D, q => `let p${q} = ${word('me', q)};`)}
  let Gi = i32(TP.G);
  ${each(D, q => `let cx${q} = i32(compact(c >> ${q}u)); let lo${q} = max(cx${q} - 1, 0); let hi${q} = min(cx${q} + 1, Gi - 1);`, '\n  ')}
  ${each(D, q => `var a${q} = 0.0;`)}
  // near field: exact pairs in my 3^D cells (strided with weights in overfull cells)
${nearField}
  ${each(D, q => `var b${q} = 0.0;`)}
  if (raw == c) {
    // far field: local expansions down my chain of parent cells${farInside}
  } else {
    // clamped into a border cell: monopoles of the interaction lists at my real position${farOutside}
  }
  return ${gravity} * ${vec}(${each(D, q => `a${q} + b${q}`, ', ')});
}
// The charge of channel c of the body in sorted slot k (its sensitivity when the two are one column)
fn tree_charge(k: u32, c: u32) -> f32 {
  let w = ${D}u + c;
  return treeSp[k * ${L.SP4}u + (w >> 2u)][w & 3u];
}
fn tree_slot(i: u32) -> u32 { return treeMeta[TP.metaRow + i]; }
fn tree_row(k: u32) -> u32 { return treeMeta[TP.metaTag + 2u * k]; }`;

  const section = {
    bindings: [{ name: 'treeSp', access: 'read', type: 'array<vec4f>' }, { name: 'treeMeta', access: 'read', type: 'array<u32>' },
      { name: 'treeCells', access: 'read', type: 'array<vec4f>' }],
    uniform: { name: 'TP', struct: paramsStruct(spec.lawWords), decl: b => `@group(0) @binding(${b}) var<uniform> TP: TreeParams;` },
    declarations: mortonFns(D, L.bits) + jitterFn(D) + lawCode + forceFn,
    row: t => `tree_row(${t})`,
    // `t`: the thread's sorted slot (null: find it from the row i); `force`: D variables to add
    // to; `sensitivity(c)`: WGSL for channel c's sensitivity of row i, or null when it is the
    // charge column itself
    code({ t, i, force, sensitivity }) {
      const slot = t === null || t === undefined ? `tree_slot(${i})` : t;
      const s = [];
      for (let c = 0; c < K; c++) {
        const expr = sensitivity ? sensitivity(c) : null;
        s.push(expr === null || expr === undefined ? `tree_charge(tk, ${c}u)` : expr);
      }
      return `{ let tk = ${slot}; let tf = tree_force(tk, array<f32, ${K}>(${s.join(', ')})); ${each(D, q => `${force[q]} += tf.${AX[q]};`)} }`;
    },
  };

  return {
    kernels: { TREE_HIST: HIST, TREE_BOX: BOX, TREE_BIN: BIN, TREE_SCAN_BLOCKS: SCAN_BLOCKS, TREE_SCAN_TOP: SCAN_TOP,
      TREE_SCAN_ADD: SCAN_ADD, TREE_PLACE: PLACE, TREE_ORDER: ORDER, TREE_AGG0: AGG0, TREE_PYR: PYR, TREE_LOCAL: LOCAL },
    columns: {
      TREE_HIST: columnBindings([spec.pos], 1).names,
      TREE_BIN: columnBindings([spec.pos], 1).names,
      TREE_ORDER: columnBindings([spec.pos].concat(spec.charges), 1).names,
    },
    section,
  };
}
