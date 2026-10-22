// Grid pyramid force layout for any graph size. Every buffer stays on the GPU and a step needs
// no CPU round trip:
//
//   robust box -> bin nodes into a G x G Morton grid (counting sort, index order within a cell,
//   so runs are deterministic) -> per-cell mass and centre of mass -> 2x2 reductions up to one
//   cell -> per-cell far field (interaction lists, as field + Jacobian at the cell centre) ->
//   per node: exact pairs in its 3x3 cells + far field + springs.
//
// Springs are summed in chunks of edges (CSR), so a hub does not stall one lane. The integrator is
// ngraph's Euler (drag, |v| <= maxVelocity) or FIRE (three more dispatches: a reduction, a
// one-thread state update and the integration).
//
// The grid covers a robust box rather than the bounding box: a log-scale histogram of positions
// gives quantiles, so one far outlier no longer stretches the grid until every node shares a
// cell. Nodes outside the box are clamped into border cells. Their real positions still feed the
// centres of mass, and they compute their own far field from monopoles at their real position,
// because a cell-centred expansion is meaningless that far from the cell.
//
// Repulsion is 1/r^2 like the library's default. Another law (a compiled law of the library) is
// printed into LOCAL and FORCE by the module's WGSL printer, and they read its numbers from P.law.
//
// This is the stock template: the module runs it for the exact stock step above the small-graph
// size, and its WGSL is today's text byte for byte (test/t4.js). Its JS side takes the masses
// from the simulator's store, compiles pipelines asynchronously, and can feed LOCAL and FORCE a
// different copy of P per step (the law-variant pipelines, see run()).
import { emitLaw, lawPrologue, lawValueCount, writeLawValues } from '../wgsl/print.js';
import { getPipeline } from '../device.js';

const WG = 256;
const SPRING_CHUNK = 8;
const NEAR_CAP = 64;
const FIRE_GROUPS = 256;

// Box state buffer (u32 words):
//   0..3   bounding box, order-preserving encoded (min x, min y, max x, max y)
//   4..7   grid box as f32 bits: origin x, origin y, side, G / side
//   8..9   histogram centre as f32 bits (median of the previous step)
//   10     bounding box side as f32 bits (diagnostics)
//   16..   histograms: 1024 bins for x, then 1024 for y
const BOX_HEADER = 16;
const HIST_BINS = 1024;

const COMMON = /* wgsl */`
struct Params {
  n: u32, G: u32, K: u32, nCells: u32,
  gravity: f32, springLength: f32, springK: f32, drag: f32,
  dt: f32, maxV: f32, nearCap: u32, integrator: u32,
  springChunk: u32, outlierRank: u32, nChunks: u32, locOff: u32,
};
fn part1by1(v: u32) -> u32 {
  var x = v & 0x0000ffffu;
  x = (x | (x << 8u)) & 0x00FF00FFu;
  x = (x | (x << 4u)) & 0x0F0F0F0Fu;
  x = (x | (x << 2u)) & 0x33333333u;
  x = (x | (x << 1u)) & 0x55555555u;
  return x;
}
fn compact1by1(v: u32) -> u32 {
  var x = v & 0x55555555u;
  x = (x | (x >> 1u)) & 0x33333333u;
  x = (x | (x >> 2u)) & 0x0F0F0F0Fu;
  x = (x | (x >> 4u)) & 0x00FF00FFu;
  x = (x | (x >> 8u)) & 0x0000FFFFu;
  return x;
}
fn morton(x: u32, y: u32) -> u32 { return part1by1(x) | (part1by1(y) << 1u); }
// Direction for two coincident nodes, from their indices: deterministic and antisymmetric,
// jitter(a, b) == -jitter(b, a), so the pair is pushed apart instead of moving together.
fn jitter(a: u32, b: u32) -> vec2f {
  var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;
  let angle = f32(h) * (6.2831853 / 4294967296.0);
  return select(-0.01, 0.01, a < b) * vec2f(cos(angle), sin(angle));
}
`;

// Bounding box and per-axis log-scale histograms of (position - centre). Bins: sign, then
// |d| in [2^-24, 2^40) with 8 bins per octave, so quantiles are found to ~12% of their distance
// from the centre whatever the scale.
const HIST = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> bs: array<atomic<u32>>;
var<workgroup> hist: array<atomic<u32>, ${2 * HIST_BINS}>;
var<workgroup> wb: array<atomic<u32>, 4>;
fn fenc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn hbin(d: f32) -> u32 {
  let key = u32(clamp(i32(bitcast<u32>(abs(d)) >> 20u) - 824, 0, 511));
  return select(512u + key, 511u - key, d < 0.0);
}
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(num_workgroups) nwg: vec3u) {
  for (var b = li; b < ${2 * HIST_BINS}u; b += ${WG}u) { atomicStore(&hist[b], 0u); }
  if (li < 2u) { atomicStore(&wb[li], 0xffffffffu); } else if (li < 4u) { atomicStore(&wb[li], 0u); }
  workgroupBarrier();
  let c = vec2f(bitcast<f32>(atomicLoad(&bs[8])), bitcast<f32>(atomicLoad(&bs[9])));
  var mn = vec2f(3e38); var mx = vec2f(-3e38);
  for (var i = gid.x; i < P.n; i += nwg.x * ${WG}u) {
    let p = pos[i];
    if (!(all(p == p) && all(abs(p) < vec2f(1e37)))) { continue; } // NaN or inf
    mn = min(mn, p); mx = max(mx, p);
    let d = p - c;
    atomicAdd(&hist[hbin(d.x)], 1u);
    atomicAdd(&hist[${HIST_BINS}u + hbin(d.y)], 1u);
  }
  atomicMin(&wb[0], fenc(mn.x)); atomicMin(&wb[1], fenc(mn.y));
  atomicMax(&wb[2], fenc(mx.x)); atomicMax(&wb[3], fenc(mx.y));
  workgroupBarrier();
  for (var b = li; b < ${2 * HIST_BINS}u; b += ${WG}u) {
    let v = atomicLoad(&hist[b]);
    if (v != 0u) { atomicAdd(&bs[${BOX_HEADER}u + b], v); }
  }
  if (li == 0u) {
    atomicMin(&bs[0], atomicLoad(&wb[0])); atomicMin(&bs[1], atomicLoad(&wb[1]));
    atomicMax(&bs[2], atomicLoad(&wb[2])); atomicMax(&bs[3], atomicLoad(&wb[3]));
  }
}`;

// One workgroup: quantiles from the histograms -> grid box. The box is the bounding box,
// shrunk to the [k, n - 1 - k] quantile range (k = outlierRank) plus a 25% margin when that is
// smaller, so ordinary layouts get exactly the bounding box. Also moves the histogram centre to
// the median and resets the histograms and bounding box for the next step.
const BOX = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> bs: array<u32>;
var<workgroup> scan: array<u32, ${WG}>;
var<workgroup> found: array<f32, 6>;
var<workgroup> total: u32;
fn fdec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
fn keyLo(key: u32) -> f32 { return select(bitcast<f32>((key + 824u) << 20u), 0.0, key == 0u); }
fn keyHi(key: u32) -> f32 { return bitcast<f32>((key + 825u) << 20u); }
fn edgeLo(s: u32) -> f32 { return select(-keyHi(511u - s), keyLo(s - 512u), s >= 512u); }
fn edgeHi(s: u32) -> f32 { return select(-keyLo(511u - s), keyHi(s - 512u), s >= 512u); }
@compute @workgroup_size(${WG})
fn main(@builtin(local_invocation_index) li: u32) {
  if (li < 6u) { found[li] = 0.0; }
  for (var a = 0u; a < 2u; a++) {
    let base = ${BOX_HEADER}u + a * ${HIST_BINS}u + li * 4u;
    var cs = array<u32, 4>(bs[base], bs[base + 1u], bs[base + 2u], bs[base + 3u]);
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
      let k = min(P.outlierRank, (count - 1u) / 2u);
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
    for (var j = 0u; j < 4u; j++) { bs[base + j] = 0u; }
    workgroupBarrier();
  }
  if (li == 0u) {
    if (total > 0u) {
      let bbMin = vec2f(fdec(bs[0]), fdec(bs[1]));
      let bbMax = vec2f(fdec(bs[2]), fdec(bs[3]));
      let c = vec2f(bitcast<f32>(bs[8]), bitcast<f32>(bs[9]));
      let qLo = c + vec2f(found[0], found[3]);
      let qHi = c + vec2f(found[1], found[4]);
      let margin = vec2f(0.25 * max(qHi.x - qLo.x, qHi.y - qLo.y));
      let lo = max(bbMin, qLo - margin);
      let hi = min(bbMax, qHi + margin);
      let side = max(max(hi.x - lo.x, hi.y - lo.y) * 1.0001, 1e-3);
      let o = 0.5 * (lo + hi) - vec2f(0.5 * side);
      bs[4] = bitcast<u32>(o.x); bs[5] = bitcast<u32>(o.y);
      bs[6] = bitcast<u32>(side); bs[7] = bitcast<u32>(f32(P.G) / side);
      bs[8] = bitcast<u32>(c.x + found[2]); bs[9] = bitcast<u32>(c.y + found[5]);
      bs[10] = bitcast<u32>(max(bbMax.x - bbMin.x, bbMax.y - bbMin.y));
    }
    bs[0] = 0xffffffffu; bs[1] = 0xffffffffu; bs[2] = 0u; bs[3] = 0u;
  }
}`;

const BIN = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> bs: array<u32>;
@group(0) @binding(3) var<storage, read_write> cellCount: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> nodeCell: array<u32>;
@group(0) @binding(5) var<storage, read_write> nodeSlot: array<u32>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  let o = vec2f(bitcast<f32>(bs[4]), bitcast<f32>(bs[5]));
  let q = (pos[i] - o) * bitcast<f32>(bs[7]);
  let gmax = f32(P.G - 1u);
  let g = clamp(floor(q), vec2f(0.0), vec2f(gmax));
  // outside the box (by more than half a cell): clamped into a border cell
  let inside = all(q > vec2f(-0.5)) && all(q < vec2f(gmax + 1.5));
  let c = morton(u32(g.x), u32(g.y));
  nodeCell[i] = c | select(0x80000000u, 0u, inside);
  nodeSlot[i] = atomicAdd(&cellCount[c], 1u);
}`;

// Exclusive scan of cellCount (nCells = 4^k >= 1024) in blocks of 1024; zeroes the counts
// for the next step.
const SCAN_BLOCKS = /* wgsl */`
@group(0) @binding(0) var<storage, read_write> cnt: array<u32>;
@group(0) @binding(1) var<storage, read_write> start: array<u32>;
@group(0) @binding(2) var<storage, read_write> blockSums: array<u32>;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * 1024u + li * 4u;
  let a0 = cnt[base]; let a1 = cnt[base + 1u]; let a2 = cnt[base + 2u]; let a3 = cnt[base + 3u];
  cnt[base] = 0u; cnt[base + 1u] = 0u; cnt[base + 2u] = 0u; cnt[base + 3u] = 0u;
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
  start[base] = ex; start[base + 1u] = ex + a0; start[base + 2u] = ex + a0 + a1; start[base + 3u] = ex + a0 + a1 + a2;
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

const SCAN_ADD = /* wgsl */`
@group(0) @binding(0) var<storage, read_write> start: array<u32>;
@group(0) @binding(1) var<storage, read> blockSums: array<u32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let e = gid.x;
  if (e >= arrayLength(&start)) { return; }
  start[e] += blockSums[e >> 10u];
}`;

// Counting sort, part 1: nodes in the (run-dependent) order of the atomic slots.
const PLACE = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(2) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(3) var<storage, read> start: array<u32>;
@group(0) @binding(4) var<storage, read_write> slotted: array<u32>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  slotted[start[nodeCell[i] & 0x7fffffffu] + nodeSlot[i]] = i;
}`;

// Part 2: within a cell, nodes go in index order, so sums run in the same order every time
// and the layout is deterministic. sp[k] = (x, y, mass, cell + 0.5), negated when the node is
// outside the box.
const ORDER = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> mass: array<f32>;
@group(0) @binding(3) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(4) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(5) var<storage, read> start: array<u32>;
@group(0) @binding(6) var<storage, read> slotted: array<u32>;
@group(0) @binding(7) var<storage, read_write> sp: array<vec4f>;
@group(0) @binding(8) var<storage, read_write> perm: array<u32>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  let raw = nodeCell[i];
  let c = raw & 0x7fffffffu;
  let s = start[c];
  let e = select(P.n, start[c + 1u], c + 1u < P.nCells);
  var rank = nodeSlot[i];
  if (e - s <= 1024u) { // a pathologically full cell keeps the atomic order
    rank = 0u;
    for (var t = s; t < e; t++) { if (slotted[t] < i) { rank++; } }
  }
  let k = s + rank;
  let w = f32(c) + 0.5;
  sp[k] = vec4f(pos[i], mass[i], select(-w, w, raw == c));
  perm[k] = i;
}`;

// Springs in fixed chunks of edges, one thread per chunk; nodes add up their chunks later.
const SPRINGS = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> chunks: array<vec2u>; // (row, first edge)
@group(0) @binding(2) var<storage, read> csr: array<u32>;      // [rowStart (n + 1), neighbors]
@group(0) @binding(3) var<storage, read> pos: array<vec2f>;
@group(0) @binding(4) var<storage, read_write> springF: array<vec2f>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let t = gid.x;
  if (t >= P.nChunks) { return; }
  let ch = chunks[t];
  let i = ch.x;
  let eEnd = min(ch.y + P.springChunk, csr[i + 1u]);
  let p = pos[i];
  var f = vec2f(0.0);
  for (var e = ch.y; e < eEnd; e++) {
    let j = csr[P.n + 1u + e];
    var d = pos[j] - p;
    var r = length(d);
    if (r == 0.0) { d = jitter(i, j); r = length(d); }
    f += (P.springK * (r - P.springLength) / r) * d;
  }
  springF[t] = f;
}`;

// cells = [pyramid: (mass, centre of mass, count) per cell of every level | local expansions]
const AGG0 = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> start: array<u32>;
@group(0) @binding(2) var<storage, read> sp: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let c = gid.x;
  if (c >= P.nCells) { return; }
  let s = start[c];
  let e = select(P.n, start[c + 1u], c + 1u < P.nCells);
  var m = 0.0; var com = vec2f(0.0);
  for (var t = s; t < e; t++) { let q = sp[t]; m += q.z; com += q.z * q.xy; }
  if (m > 0.0) { com /= m; }
  cells[c] = vec4f(m, com, f32(e - s));
}`;

const PYR = /* wgsl */`
struct L { count: u32, childOff: u32, parentOff: u32, pad: u32 };
@group(0) @binding(0) var<uniform> lv: L;
@group(0) @binding(1) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let q = gid.x;
  if (q >= lv.count) { return; }
  var m = 0.0; var com = vec2f(0.0); var cn = 0.0;
  for (var k = 0u; k < 4u; k++) {
    let c = cells[lv.childOff + 4u * q + k];
    m += c.x; com += c.x * c.yz; cn += c.w;
  }
  if (m > 0.0) { com /= m; }
  cells[lv.parentOff + q] = vec4f(m, com, cn);
}`;

// Every non-empty cell receives the far field of its interaction list (children of the
// parent's 3x3 that are not in my 3x3) once, at its centre, as field + 2x2 Jacobian.
const LOCAL = law => withLaw(COMMON, law) + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> bs: array<u32>;
@group(0) @binding(2) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let t = gid.x;
  var off = 0u; var Gl = P.G; var l = 0u;
  loop {
    if (l >= P.K) { return; }
    if (t < off + Gl * Gl) { break; }
    off += Gl * Gl; Gl >>= 1u; l++;
  }
  let c = t - off;
  let me = cells[off + c];
  if (me.x == 0.0) { return; }${law ? '\n  ' + lawPrologue(law, lawValue) : ''}
  let o = vec2f(bitcast<f32>(bs[4]), bitcast<f32>(bs[5]));
  let w = bitcast<f32>(bs[6]) / f32(Gl);
  let xl = i32(compact1by1(c)); let yl = i32(compact1by1(c >> 1u));
  let center = o + (vec2f(f32(xl), f32(yl)) + 0.5) * w;
  let Gi = i32(Gl);
  let px = xl >> 1u; let py = yl >> 1u;
  let x0 = max(2 * px - 2, 0); let x1 = min(2 * px + 3, Gi - 1);
  let y0 = max(2 * py - 2, 0); let y1 = min(2 * py + 3, Gi - 1);
  var F = vec2f(0.0); var jxx = 0.0; var jxy = 0.0; var jyy = 0.0;
  for (var y = y0; y <= y1; y++) {
    for (var x = x0; x <= x1; x++) {
      if (abs(x - xl) <= 1 && abs(y - yl) <= 1) { continue; }
      let cell = cells[off + morton(u32(x), u32(y))];
      if (cell.x > 0.0) {
        let d = cell.yz - center;
        let r2 = dot(d, d);${law ? `
        if (${inRange(law, 'r2')}) {
          let r = sqrt(r2);
          ${emitLaw(law, 2, 'r', 'k1', 'k2')}
          let g = P.gravity * cell.x;
          F += (g * k1) * d;
          // d/dp of gravity M k1(r) (q - p) = gravity M (k2 d d^T - k1 I)
          jxx += g * (k2 * d.x * d.x - k1);
          jxy += g * (k2 * d.x * d.y);
          jyy += g * (k2 * d.y * d.y - k1);
        }` : `
        let ir2 = 1.0 / r2;
        let g = P.gravity * cell.x * ir2 * sqrt(ir2); // gravity M / r^3
        F += g * d;
        // d/dp of gravity M (q - p) / |q - p|^3 = gravity M (3 d d^T / r^5 - I / r^3)
        jxx += g * (3.0 * d.x * d.x * ir2 - 1.0);
        jxy += g * (3.0 * d.x * d.y * ir2);
        jyy += g * (3.0 * d.y * d.y * ir2 - 1.0);`}
      }
    }
  }
  cells[P.locOff + 2u * t] = vec4f(F, jxx, jxy);
  cells[P.locOff + 2u * t + 1u] = vec4f(jyy, center, 0.0);
}`;

// One thread per node, in cell order. Euler integrates here; FIRE stores the force in
// vel[n + i] for the FIRE passes.
const FORCE = law => withLaw(COMMON, law) + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> sp: array<vec4f>;
@group(0) @binding(2) var<storage, read> perm: array<u32>;
@group(0) @binding(3) var<storage, read> start: array<u32>;
@group(0) @binding(4) var<storage, read> cells: array<vec4f>;
@group(0) @binding(5) var<storage, read> springF: array<vec2f>;
@group(0) @binding(6) var<storage, read> rowChunk: array<u32>; // first chunk of each row (n + 1)
@group(0) @binding(7) var<storage, read_write> pos: array<vec2f>;
// [0, n): (velocity, 0, pinned); [n, 2n): (force, 0, 0) for FIRE
@group(0) @binding(8) var<storage, read_write> vel: array<vec4f>;

@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let k = gid.x;
  if (k >= P.n) { return; }
  let i = perm[k];
  let me = sp[k];
  let p = me.xy; let mi = me.z;
  let c = u32(abs(me.w));
  let cx = i32(compact1by1(c)); let cy = i32(compact1by1(c >> 1u));
  let Gi = i32(P.G);
  var f = vec2f(0.0);${law ? '\n  ' + lawPrologue(law, lawValue) : ''}

  // near field: exact pairs in my 3x3 cells (strided with weights in overfull cells)
  for (var dy = -1; dy <= 1; dy++) {
    let y = cy + dy;
    if (y < 0 || y >= Gi) { continue; }
    for (var dx = -1; dx <= 1; dx++) {
      let x = cx + dx;
      if (x < 0 || x >= Gi) { continue; }
      let mc = morton(u32(x), u32(y));
      let s = start[mc];
      let e = select(P.n, start[mc + 1u], mc + 1u < P.nCells);
      let n = e - s;
      var stride = 1u;
      if (n > P.nearCap) { stride = (n + P.nearCap - 1u) / P.nearCap; }
      let w = f32(stride);
      for (var t = s; t < e; t += stride) {
        if (t == k) { continue; }
        let q = sp[t];
        var d = q.xy - p;
        var r2 = dot(d, d);
        if (r2 == 0.0) { d = jitter(i, perm[t]); r2 = dot(d, d); }
        ${law ? `${law.hasRange ? `if (r2 > lawRange2) { continue; }
        ` : ''}let r = sqrt(r2);
        ${emitLaw(law, 2, 'r', 'k1')}
        f += (P.gravity * mi * q.z * w * k1) * d;` : `let r = sqrt(r2);
        f += (P.gravity * mi * q.z * w / (r2 * r)) * d;`}
      }
    }
  }

  var ff = vec2f(0.0);
  if (me.w > 0.0) {
    // far field: local expansions down my chain of parent cells
    var off = 0u; var Gl = P.G; var cc = c;
    for (var l = 0u; l < P.K; l++) {
      let a = cells[P.locOff + 2u * (off + cc)]; let b = cells[P.locOff + 2u * (off + cc) + 1u];
      let dp = p - b.yz;
      ff += a.xy + vec2f(a.z * dp.x + a.w * dp.y, a.w * dp.x + b.x * dp.y);
      off += Gl * Gl; Gl >>= 1u; cc >>= 2u;
    }
  } else {
    // clamped into a border cell: monopoles of the interaction lists at my real position
    var off = 0u; var Gl = Gi;
    for (var l = 0u; l < P.K; l++) {
      let xl = cx >> l; let yl = cy >> l;
      let px = xl >> 1u; let py = yl >> 1u;
      let x0 = max(2 * px - 2, 0); let x1 = min(2 * px + 3, Gl - 1);
      let y0 = max(2 * py - 2, 0); let y1 = min(2 * py + 3, Gl - 1);
      for (var y = y0; y <= y1; y++) {
        for (var x = x0; x <= x1; x++) {
          if (abs(x - xl) <= 1 && abs(y - yl) <= 1) { continue; }
          let cell = cells[off + morton(u32(x), u32(y))];
          if (cell.x > 0.0) {
            let d = cell.yz - p;
            let r2 = dot(d, d);
            ${law ? `if (r2 > 0.0 && ${inRange(law, 'r2')}) {
              let r = sqrt(r2);
              ${emitLaw(law, 2, 'r', 'm1')}
              ff += (P.gravity * cell.x * m1) * d;
            }` : 'if (r2 > 0.0) { ff += (P.gravity * cell.x / (r2 * sqrt(r2))) * d; }'}
          }
        }
      }
      off += u32(Gl * Gl);
      Gl = Gl >> 1u;
    }
  }
  f += mi * ff;

  for (var t = rowChunk[i]; t < rowChunk[i + 1u]; t++) { f += springF[t]; }

  let v4 = vel[i];
  if (v4.w != 0.0) { return; } // pinned
  if (P.integrator == 1u) { vel[P.n + i] = vec4f(f, 0.0, 0.0); return; }
  var v = v4.xy;
  f -= P.drag * v;
  v += (P.dt / mi) * f;
  let vl = length(v);
  if (vl > P.maxV) { v *= P.maxV / vl; }
  vel[i] = vec4f(v, 0.0, 0.0);
  pos[i] = p + P.dt * v;
}`;

// FIRE, pass 1: per-workgroup partial sums of (F.v, |v|^2, |F|^2) over non-pinned nodes.
const FIRE_REDUCE = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> vel: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> fire: array<vec4f>; // [0]: state, [1 + w]: partials
var<workgroup> red: array<vec4f, ${WG}>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  var acc = vec4f(0.0);
  for (var i = gid.x; i < P.n; i += nwg.x * ${WG}u) {
    let v4 = vel[i];
    if (v4.w != 0.0) { continue; }
    let f = vel[P.n + i].xy;
    acc += vec4f(dot(f, v4.xy), dot(v4.xy, v4.xy), dot(f, f), 0.0);
  }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${WG / 2}u; s > 0u; s >>= 1u) {
    if (li < s) { red[li] += red[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) { fire[1u + wid.x] = red[0]; }
}`;

// FIRE, pass 2 (one workgroup): total power -> mixing coefficients and the (a, npos) update.
// fire[0] = (a, npos, cv, cf): this step uses v = cv v + cf F.
const FIRE_STATE = /* wgsl */`
struct FireParams { groups: u32, pad0: u32, pad1: u32, pad2: u32 };
@group(0) @binding(0) var<uniform> FP: FireParams;
@group(0) @binding(1) var<storage, read_write> fire: array<vec4f>;
var<workgroup> red: array<vec4f, ${WG}>;
@compute @workgroup_size(${WG})
fn main(@builtin(local_invocation_index) li: u32) {
  var acc = vec4f(0.0);
  for (var w = li; w < FP.groups; w += ${WG}u) { acc += fire[1u + w]; }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${WG / 2}u; s > 0u; s >>= 1u) {
    if (li < s) { red[li] += red[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) {
    let sum = red[0];
    let st = fire[0];
    let a = st.x;
    if (sum.x > 0.0) {
      var cf = 0.0;
      if (sum.z > 0.0) { cf = a * sqrt(sum.y) / sqrt(sum.z); }
      let npos = st.y + 1.0;
      fire[0] = vec4f(select(a, a * 0.99, npos > 5.0), npos, 1.0 - a, cf);
    } else {
      fire[0] = vec4f(0.1, 0.0, 0.0, 0.0);
    }
  }
}`;

// FIRE, pass 3: mix, then the same Euler update without drag.
const FIRE_INTEGRATE = COMMON + /* wgsl */`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vel: array<vec4f>;
@group(0) @binding(3) var<storage, read> mass: array<f32>;
@group(0) @binding(4) var<storage, read> fire: array<vec4f>;
@compute @workgroup_size(${WG})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  let v4 = vel[i];
  if (v4.w != 0.0) { return; }
  let st = fire[0];
  let f = vel[P.n + i].xy;
  var v = st.z * v4.xy + st.w * f;
  v += (P.dt / mass[i]) * f;
  let vl = length(v);
  if (vl > P.maxV) { v *= P.maxV / vl; }
  vel[i] = vec4f(v, 0.0, 0.0);
  pos[i] = pos[i] + P.dt * v;
}`;

// A law's numbers (see writeLawValues in ../wgsl/print.js) follow the 16 words of Params
export const LAW_VALUES = 16;

function withLaw(common, law) {
  if (!law) return common;
  if (lawValueCount(law) > LAW_VALUES) throw new Error(`The GPU takes laws with up to ${LAW_VALUES} numbers`);
  return common.replace('locOff: u32,\n};', `locOff: u32,\n  law: array<vec4f, ${LAW_VALUES / 4}>,\n};`);
}

function lawValue(i) {
  return `P.law[${i >> 2}].${'xyzw'[i & 3]}`;
}

function inRange(law, r2) {
  return law.hasRange ? `${r2} <= lawRange2` : 'true';
}

const SHADERS = { HIST, BOX, BIN, SCAN_BLOCKS, SCAN_TOP, SCAN_ADD, PLACE, ORDER, SPRINGS, AGG0, PYR, FIRE_REDUCE, FIRE_STATE, FIRE_INTEGRATE };
// Shaders that depend on the repulsion law
const LAW_SHADERS = { LOCAL, FORCE };
// The law-variant layouts of LOCAL and FORCE: the same WGSL, with P at a dynamic offset into a
// ring of per-step copies (see run())
const VARIANT_BINDINGS = {
  LOCAL: ['dynamic', 'read', 'storage'],
  FORCE: ['dynamic', 'read', 'read', 'read', 'read', 'read', 'read', 'storage', 'storage'],
};
// The stages of the step each kernel computes, for error reports
export const KERNEL_STAGES = {
  HIST: ['repulsion'], BOX: ['repulsion'], BIN: ['repulsion'], SCAN_BLOCKS: ['repulsion'], SCAN_TOP: ['repulsion'],
  SCAN_ADD: ['repulsion'], PLACE: ['repulsion'], ORDER: ['repulsion'], AGG0: ['repulsion'], PYR: ['repulsion'],
  LOCAL: ['repulsion'], SPRINGS: ['springs'], FORCE: ['clear', 'repulsion', 'drag', 'springs', 'integrate'],
  FIRE_REDUCE: ['integrate'], FIRE_STATE: ['integrate'], FIRE_INTEGRATE: ['integrate'],
};
// Bytes per slot of the per-step ring (the uniform offset alignment)
const SLOT = 256;

function chooseGrid(n) {
  let G = 32;
  while (G * G * 2 < n && G < 1024) G *= 2;
  return G;
}

/**
 * Sizes in bytes of the buffers a grid engine allocates for `n` bodies and `edges` links, by
 * name (`chunks`: spring chunks, at most n + edges / 4 when not given). check.js measures them
 * against the device's limits with the same numbers.
 */
export function gridBuffers(n, edges, chunks) {
  const nChunks = chunks === undefined ? n + Math.ceil(edges / 4) : chunks;
  const G = chooseGrid(n), K = Math.log2(G), nCells = G * G;
  let pyrSize = 0, last = 0;
  for (let l = 0, g = G; l <= K; l++, g >>= 1) { last = pyrSize; pyrSize += g * g; }
  const size = bytes => Math.max(16, Math.ceil(bytes / 16) * 16);
  return {
    pos: size(n * 8), vel: size(n * 32), mass: size(n * 4), csr: size((n + 1 + 2 * edges) * 4),
    chunks: size(Math.max(2, 2 * nChunks) * 4), rowChunk: size((n + 1) * 4), springF: size(Math.max(1, nChunks) * 8),
    cellCount: size(nCells * 4), start: size(nCells * 4), blockSums: size(Math.max(nCells / 1024, 4) * 4),
    nodeCell: size(n * 4), nodeSlot: size(n * 4), slotted: size(n * 4), perm: size(n * 4), sp: size(n * 16),
    cells: size((pyrSize + 2 * last) * 16), fire: size((1 + FIRE_GROUPS) * 16), box: size((BOX_HEADER + 2 * HIST_BINS) * 4),
  };
}

/**
 * Compiles the template's pipelines for `law` (null for 1/r^2), in parallel. With `variants`,
 * also LOCAL and FORCE with P at a dynamic offset, for laws whose numbers change within a batch.
 */
export async function gridPipelines(device, law, variants) {
  const jobs = [];
  for (const [name, code] of Object.entries(SHADERS)) jobs.push([name, getPipeline(device, { code, label: name })]);
  for (const [name, make] of Object.entries(LAW_SHADERS)) {
    const code = make(law);
    jobs.push([name, getPipeline(device, { code, label: name })]);
    if (variants) jobs.push([name + '_STEP', getPipeline(device, { code, label: name, bindings: VARIANT_BINDINGS[name] })]);
  }
  const pipelines = await Promise.all(jobs.map(job => job[1]));
  const out = {};
  jobs.forEach((job, i) => { out[job[0]] = pipelines[i]; });
  return out;
}

/**
 * @param {GPUDevice} device
 * @param {{n: number, edges: Uint32Array, init: Float32Array, mass: Float32Array, law?: object,
 *   variants?: boolean}} data
 *   init: 2n positions relative to the layout origin; edges: flat (from, to) pairs, no self-loops.
 *   law: a compiled repulsion law other than 1/r^2, or nothing. variants: build the per-step law
 *   pipelines too (see run()).
 * Resolves once the pipelines are compiled; rejects (naming the kernel) when one fails, or when
 * the buffers cannot be created.
 */
export async function createGridEngine(device, { n, edges, init, mass, law = null, variants = false }) {
  const pipes = await gridPipelines(device, law, variants);
  const G = chooseGrid(n);
  const K = Math.log2(G);
  const nCells = G * G;
  const nBlocks = nCells / 1024;

  // CSR adjacency, split into chunks of SPRING_CHUNK edges
  const deg = new Uint32Array(n);
  for (let e = 0; e < edges.length; e += 2) { deg[edges[e]]++; deg[edges[e + 1]]++; }
  const csr = new Uint32Array(n + 1 + 2 * (edges.length / 2));
  for (let i = 0; i < n; i++) csr[i + 1] = csr[i] + deg[i];
  const fill = csr.slice(0, n);
  for (let e = 0; e < edges.length; e += 2) {
    const a = edges[e], b = edges[e + 1];
    csr[n + 1 + fill[a]++] = b; csr[n + 1 + fill[b]++] = a;
  }
  let nChunks = 0;
  for (let i = 0; i < n; i++) nChunks += Math.ceil(deg[i] / SPRING_CHUNK);
  const chunks = new Uint32Array(Math.max(2, 2 * nChunks));
  const rowChunk = new Uint32Array(n + 1);
  for (let i = 0, t = 0; i < n; i++) {
    rowChunk[i] = t;
    for (let e = csr[i]; e < csr[i + 1]; e += SPRING_CHUNK, t++) { chunks[2 * t] = i; chunks[2 * t + 1] = e; }
  }
  rowChunk[n] = nChunks;

  const sizes = gridBuffers(n, edges.length / 2, nChunks);
  const S = GPUBufferUsage.STORAGE, CD = GPUBufferUsage.COPY_DST, CS = GPUBufferUsage.COPY_SRC;
  const owned = [];
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  const buf = (size, usage = S) => {
    const b = device.createBuffer({ size: Math.max(16, Math.ceil(size / 16) * 16), usage });
    owned.push(b);
    return b;
  };
  const upload = (data, usage = S | CD) => { const b = buf(data.byteLength, usage); device.queue.writeBuffer(b, 0, data); return b; };

  const pos = upload(init, S | CD | CS);
  const vel = buf(sizes.vel, S | CD | CS);
  const massB = upload(mass);
  const csrB = upload(csr);
  const chunksB = upload(chunks);
  const rowChunkB = upload(rowChunk);
  const springF = buf(sizes.springF);
  const cellCount = buf(sizes.cellCount, S | CD);
  const start = buf(sizes.start);
  const blockSums = buf(sizes.blockSums);
  const nodeCell = buf(sizes.nodeCell), nodeSlot = buf(sizes.nodeSlot), slotted = buf(sizes.slotted), perm = buf(sizes.perm);
  const sp = buf(sizes.sp);
  let pyrSize = 0; const levelOff = [];
  for (let l = 0, g = G; l <= K; l++, g >>= 1) { levelOff.push(pyrSize); pyrSize += g * g; }
  const cells = buf(sizes.cells);
  const fireB = buf(sizes.fire, S | CD | CS);
  const fireGroups = Math.min(FIRE_GROUPS, Math.ceil(n / WG));

  // Box state: start from the bounding box of the initial positions, histogram centre at the origin.
  const boxInit = new Uint32Array(BOX_HEADER + 2 * HIST_BINS);
  const boxF = new Float32Array(boxInit.buffer);
  {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < n; i++) {
      const x = init[2 * i], y = init[2 * i + 1];
      if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
    }
    const side = Math.max(maxX - minX, maxY - minY, 1e-3) * 1.0001;
    boxF[4] = (minX + maxX - side) / 2; boxF[5] = (minY + maxY - side) / 2; boxF[6] = side; boxF[7] = G / side;
    boxInit[0] = boxInit[1] = 0xffffffff;
  }
  const boxB = upload(boxInit, S | CD | CS);

  const paramSize = law ? 64 + 4 * LAW_VALUES : 64;
  const paramBuf = new ArrayBuffer(paramSize);
  const pu = new Uint32Array(paramBuf), pf = new Float32Array(paramBuf);
  pu[0] = n; pu[1] = G; pu[2] = K; pu[3] = nCells;
  pu[10] = NEAR_CAP; pu[12] = SPRING_CHUNK; pu[13] = Math.max(1, Math.floor(n / 1000));
  pu[14] = nChunks; pu[15] = pyrSize;
  const params = buf(paramSize, GPUBufferUsage.UNIFORM | CD);
  const nbU = upload(new Uint32Array([nBlocks, 0, 0, 0]), GPUBufferUsage.UNIFORM | CD);
  const fireU = upload(new Uint32Array([fireGroups, 0, 0, 0]), GPUBufferUsage.UNIFORM | CD);

  const bind = (p, list) => device.createBindGroup({
    layout: p.getBindGroupLayout(0),
    entries: list.map((b, i) => ({ binding: i, resource: { buffer: b } })),
  });
  const g = {
    HIST: bind(pipes.HIST, [params, pos, boxB]),
    BOX: bind(pipes.BOX, [params, boxB]),
    BIN: bind(pipes.BIN, [params, pos, boxB, cellCount, nodeCell, nodeSlot]),
    SCAN_BLOCKS: bind(pipes.SCAN_BLOCKS, [cellCount, start, blockSums]),
    SCAN_TOP: bind(pipes.SCAN_TOP, [blockSums, nbU]),
    SCAN_ADD: bind(pipes.SCAN_ADD, [start, blockSums]),
    PLACE: bind(pipes.PLACE, [params, nodeCell, nodeSlot, start, slotted]),
    ORDER: bind(pipes.ORDER, [params, pos, massB, nodeCell, nodeSlot, start, slotted, sp, perm]),
    SPRINGS: bind(pipes.SPRINGS, [params, chunksB, csrB, pos, springF]),
    AGG0: bind(pipes.AGG0, [params, start, sp, cells]),
    LOCAL: bind(pipes.LOCAL, [params, boxB, cells]),
    FORCE: bind(pipes.FORCE, [params, sp, perm, start, cells, springF, rowChunkB, pos, vel]),
    FIRE_REDUCE: bind(pipes.FIRE_REDUCE, [params, vel, fireB]),
    FIRE_STATE: bind(pipes.FIRE_STATE, [fireU, fireB]),
    FIRE_INTEGRATE: bind(pipes.FIRE_INTEGRATE, [params, pos, vel, massB, fireB]),
  };
  const pyrGroups = [];
  for (let l = 0; l < K; l++) {
    const count = (G >> (l + 1)) ** 2;
    const u = upload(new Uint32Array([count, levelOff[l], levelOff[l + 1], 0]), GPUBufferUsage.UNIFORM | CD);
    pyrGroups.push({ count, group: bind(pipes.PYR, [u, cells]) });
  }
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the GPU buffers: ' + setupError.message);
  }

  // The law-variant pipelines read P from a ring of per-step copies, one slot per step of a submit
  let ring = null, ringGroups = null, ringSlots = 0, ringData = null;
  function growRing(slots) {
    if (ring) ring.destroy();
    ringSlots = Math.max(64, slots);
    ring = device.createBuffer({ size: ringSlots * SLOT, usage: GPUBufferUsage.UNIFORM | CD });
    ringData = new ArrayBuffer(ringSlots * SLOT);
    const entry = { buffer: ring, size: paramSize };
    ringGroups = {
      LOCAL: device.createBindGroup({ layout: pipes.LOCAL_STEP.getBindGroupLayout(0), entries: [
        { binding: 0, resource: entry }, { binding: 1, resource: { buffer: boxB } }, { binding: 2, resource: { buffer: cells } }] }),
      FORCE: device.createBindGroup({ layout: pipes.FORCE_STEP.getBindGroupLayout(0), entries: [entry].concat(
        [sp, perm, start, cells, springF, rowChunkB, pos, vel].map(buffer => ({ buffer }))).map((resource, i) => ({ binding: i, resource })) }),
    };
  }

  const nodeGroups = Math.ceil(n / WG);
  const histGroups = Math.min(nodeGroups, 128);
  let fireMode = false;

  function setFire(state) { device.queue.writeBuffer(fireB, 0, new Float32Array(state || [0.1, 0, 0, 0])); }
  function resetFire() { setFire(null); }
  resetFire();

  function dispatch(cp, name, groups) {
    cp.setPipeline(pipes[name]); cp.setBindGroup(0, g[name]); cp.dispatchWorkgroups(groups);
  }

  // `slot`: the step's copy of P in the ring for LOCAL and FORCE, or -1 for the static P
  function encodeStep(cp, slot) {
    dispatch(cp, 'HIST', histGroups);
    dispatch(cp, 'BOX', 1);
    dispatch(cp, 'BIN', nodeGroups);
    dispatch(cp, 'SCAN_BLOCKS', nBlocks);
    dispatch(cp, 'SCAN_TOP', 1);
    dispatch(cp, 'SCAN_ADD', Math.ceil(nCells / 256));
    dispatch(cp, 'PLACE', nodeGroups);
    dispatch(cp, 'ORDER', nodeGroups);
    if (nChunks) dispatch(cp, 'SPRINGS', Math.ceil(nChunks / WG));
    dispatch(cp, 'AGG0', Math.ceil(nCells / WG));
    cp.setPipeline(pipes.PYR);
    for (const { count, group } of pyrGroups) { cp.setBindGroup(0, group); cp.dispatchWorkgroups(Math.ceil(count / 256)); }
    if (slot < 0) {
      dispatch(cp, 'LOCAL', Math.ceil(levelOff[K] / WG));
      dispatch(cp, 'FORCE', nodeGroups);
    } else {
      const offset = [slot * SLOT];
      cp.setPipeline(pipes.LOCAL_STEP); cp.setBindGroup(0, ringGroups.LOCAL, offset); cp.dispatchWorkgroups(Math.ceil(levelOff[K] / WG));
      cp.setPipeline(pipes.FORCE_STEP); cp.setBindGroup(0, ringGroups.FORCE, offset); cp.dispatchWorkgroups(nodeGroups);
    }
    if (fireMode) {
      dispatch(cp, 'FIRE_REDUCE', fireGroups);
      dispatch(cp, 'FIRE_STATE', 1);
      dispatch(cp, 'FIRE_INTEGRATE', nodeGroups);
    }
  }

  return {
    kind: 'grid',
    G,
    pos,
    vel,
    mass: massB,
    fire: fireB,
    variants,
    setParams(s) {
      pf[4] = s.gravity; pf[5] = s.springLength; pf[6] = s.springCoefficient; pf[7] = s.dragCoefficient;
      pf[8] = s.timeStep; pf[9] = s.maxVelocity; pu[11] = s.integrator === 'fire' ? 1 : 0;
      fireMode = pu[11] === 1;
      if (law) writeLawValues(law, pf, 16);
      device.queue.writeBuffer(params, 0, paramBuf);
    },
    // After law.update(): the law's numbers for the next steps
    setLawValues() {
      writeLawValues(law, pf, 16);
      device.queue.writeBuffer(params, 64, paramBuf, 64);
    },
    resetFire,
    setFire,
    // Encodes `count` steps, `perSubmit` (64) per compute pass and submit.
    //  - timestampWrites: {querySet}, written at the start of the first pass and the end of the last;
    //  - beforeFinish(encoder) runs on the last encoder, so callers can append copies;
    //  - lawSteps(s, out, offset): writes the law's numbers of step s of this call into `out`; the
    //    steps then run the law-variant pipelines, each with its own copy of P.
    run(count, { timestampWrites = null, beforeFinish = null, perSubmit = 64, lawSteps = null } = {}) {
      if (lawSteps && !variants) throw new Error('this engine was built without per-step law values');
      for (let done = 0; done < count;) {
        const c = Math.min(perSubmit, count - done);
        if (lawSteps) {
          if (c > ringSlots) growRing(c);
          const bytes = new Uint8Array(paramBuf);
          const slots = new Uint8Array(ringData);
          for (let s = 0; s < c; s++) {
            slots.set(bytes, s * SLOT);
            lawSteps(done + s, new Float32Array(ringData, s * SLOT, paramSize / 4), 16);
          }
          device.queue.writeBuffer(ring, 0, ringData, 0, c * SLOT);
        }
        const enc = device.createCommandEncoder();
        const first = done === 0, last = done + c === count;
        let tw;
        if (timestampWrites && (first || last)) {
          tw = { querySet: timestampWrites.querySet };
          if (first) tw.beginningOfPassWriteIndex = 0;
          if (last) tw.endOfPassWriteIndex = 1;
        }
        const cp = enc.beginComputePass(tw ? { timestampWrites: tw } : undefined);
        for (let s = 0; s < c; s++) encodeStep(cp, lawSteps ? s : -1);
        cp.end();
        if (last && beforeFinish) beforeFinish(enc);
        device.queue.submit([enc.finish()]);
        done += c;
      }
    },
    // Debug: the box state (grid box, bounding box side, histogram centre).
    boxBuffer: boxB,
    destroy() {
      for (const b of owned) b.destroy();
      if (ring) ring.destroy();
    },
  };
}

// For checks: the WGSL of every shader for a law (null for 1/r^2)
export function shaderCode(law = null) {
  const code = Object.assign({}, SHADERS);
  for (const [name, make] of Object.entries(LAW_SHADERS)) code[name] = make(law);
  return code;
}
