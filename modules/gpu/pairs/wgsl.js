// WGSL of the pair formulas' lowering above N* (design section 6.4), in 2, 3 and 4 dimensions.
// One cell sort per radius, then per stage a chunk kernel and a gather:
//
//   BIN        per body: its cell (side = the radius, a hair larger), the cell's bucket in a
//              hashed table of 2n or more buckets (the CPU's hash), a slot by u32 atomics
//   SCAN_*     exclusive scan of the bucket counts in blocks of 1,024, then the blocks' offsets;
//              readers add the two (pair_start)
//   PLACE      per body: into its bucket at its slot (run-dependent order); a body of a bucket of
//              more than 1,024 claims chunks of work to rank itself
//   ARGS_RANK  one thread: the rank work against the cap, the indirect dispatch size of RANK
//   RANK       per rank chunk (crowded buckets only): how many of 256 bodies of its bucket have a
//              lower index, added up with atomics (integers, so the order does not matter)
//   ORDER      per bucket slot: the body's rank in its bucket, by index (counted directly up to
//              1,024 bodies), so each bucket lists its bodies the same way in every run. Writes
//              the body's snapshot there (position, columns the formulas read, index); counts its
//              candidates in the distinct buckets of its 3^D cells (two cells may share a bucket:
//              a mask marks the repeats) and claims ceil(count / 256) chunks, in bucket order, so
//              threads next to each other read the same cells; writes its home record (first
//              chunk, cell, mask)
//   ARGS       one thread: the pair work against the cap. Over it: no pair work this step, and the
//              status for the runner (it halts at the next readback with the stage and the count).
//              Else the indirect dispatch size of EVAL, as a 2D grid
//   EVAL       per chunk: up to 256 candidates, filtered by r < radius, the formula with the
//              CPU's roles; one partial (push and accumulators) per chunk
//   GATHER     per body: its chunks added up in order, into the plan's output columns
//
// Everything that adds floats does it in an order that does not depend on the run, so pair
// results repeat exactly. Atomic order only decides where a chunk's partial is stored.
import { printPairFormula, pairCandidate, accumulatorName } from './formula.js';

export const WG = 256;
export const EVAL_WG = 64;
export const RANK_WG = 64;
// Candidates per chunk: the most pair tests one thread makes
export const CHUNK = 256;
// Buckets up to this many bodies are ranked by the body itself in ORDER
export const RANK_DIRECT = 1024;
// Cells are a hair larger than the radius: two bodies closer than the radius stay in neighbouring
// cells despite f32 rounding of x / side, up to about 1e4 cells from the origin
export const CELL_GROWTH = 1 + 1 / 1024;
// Cell coordinates are clamped here, so that adding the neighbour offsets cannot overflow
const CELL_LIMIT = 1073741823;

// A step whose pair work is over the cap runs in slices of at most the cap, each in its own
// submit (see build.js); at most this many per step
export const MAX_SLICES = 64;
// Words of pairArgs; a sliced step's indirect dispatch sizes per slice from SLICE_EVAL and
// SLICE_RANK (3 words each)
export const ARGS = {
  RANK_X: 0, RANK_Y: 1, RANK_Z: 2, EVAL_X: 3, EVAL_Y: 4, EVAL_Z: 5,
  RANK_TOTAL: 6, FLAGS: 7, ALLOC: 8, OK: 9, EVAL_COUNT: 10, RANK_COUNT: 11,
  SLICE_EVAL: 16, SLICE_RANK: 16 + 3 * MAX_SLICES, WORDS: 16 + 6 * MAX_SLICES,
};
const OVER = 1, CROWDED = 2;
// Words per body in pairBody: bucket, slot, rank, first chunk, chunks, first rank chunk, then the
// cell
export const BODY = { BUCKET: 0, SLOT: 1, RANK: 2, FIRST: 3, COUNT: 4, RANK_FIRST: 5, CELL: 6 };

const AX = 'xyzw';

function each(n, fn, sep = ' ') {
  const out = [];
  for (let k = 0; k < n; k++) out.push(fn(k));
  return out.join(sep);
}

function u32(value) {
  return value + 'u';
}

const LINEAR = '@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u';
const linearId = wg => `gid.x + gid.y * nwg.x * ${u32(wg)}`;

// A sliced step's numbers, at a dynamic offset: the slices of the step (k), or which slice this
// dispatch works on (index; its chunks start at index * PP.cap)
const SLICE = binding => `struct PairSlice { k: u32, index: u32, pad0: u32, pad1: u32 };
@group(0) @binding(${binding}) var<uniform> SL: PairSlice;`;

const PARAMS = `struct PairParams { n: u32, mask: u32, size: u32, blocks: u32, cap: u32, sort: u32, owners: u32, home: u32 };
@group(0) @binding(0) var<uniform> PP: PairParams;`;

// Where bucket b starts: its offset in its block of 1,024, plus the block's (bucket `size` is n)
const START_FN = `fn pair_start(b: u32) -> u32 {
  return pairStart[b] + pairStart[PP.size + 1u + (b >> 10u)];
}`;

/**
 * Words per body record, per home record (first chunk, cell, mask) and per snapshot entry for `D`
 * and the snapshot's columns ([{width}]).
 */
export function pairLayout(D, columns) {
  const words = D + columns.reduce((total, c) => total + c.width, 0) + 1;
  const maskWords = Math.ceil(3 ** D / 32);
  return { body: BODY.CELL + D, home: 1 + D + maskWords, maskWords, snap4: Math.ceil(words / 4), index: words - 1 };
}

// The bucket of a cell: the CPU's hash (lib/createNeighborGrid.js), masked by the table's size
function hashFn(D) {
  return `fn pair_hash(${each(D, k => `c${k}: i32`, ', ')}) -> u32 {
  var h = 0x165667b1u;
  ${each(D, k => `h = (h ^ bitcast<u32>(c${k})) * 0x27d4eb2du; h ^= h >> 15u;`, '\n  ')}
  return h & PP.mask;
}`;
}

// The neighbour cell o of cell (c0, c1, ...): offset (o / 3^k) % 3 - 1 on axis k
function neighbourHash(D, o) {
  return `pair_hash(${each(D, k => `c${k} + i32((${o} / ${u32(3 ** k)}) % 3u) - 1`, ', ')})`;
}

// Code that counts the candidates in the distinct buckets of the 3^D cells around (c0, c1, ...)
// into `candidates`, and sets bit o of mask<o / 32> when cell o's bucket repeats an earlier one.
// Unrolled up to 3D, so the buckets stay in registers
function countNeighbours(D, indent) {
  const cells = 3 ** D, words = Math.ceil(cells / 32);
  const lines = ['var candidates = 0u;'];
  for (let w = 0; w < words; w++) lines.push(`var mask${w} = 0u;`);
  if (D <= 3) {
    for (let o = 0; o < cells; o++) {
      lines.push(`let pb${o} = ${neighbourHash(D, u32(o))};`);
      const repeats = [];
      for (let q = 0; q < o; q++) repeats.push(`pb${o} == pb${q}`);
      const add = `candidates += pair_start(pb${o} + 1u) - pair_start(pb${o});`;
      lines.push(o ? `if (${repeats.join(' || ')}) { mask${o >> 5} |= ${u32(2 ** (o & 31))}; } else { ${add} }` : add);
    }
  } else {
    lines.push(
      `var seen: array<u32, ${cells}>;`,
      `for (var o = 0u; o < ${u32(cells)}; o++) {`,
      `  let pb = ${neighbourHash(D, 'o')};`,
      '  var repeat = false;',
      '  for (var q = 0u; q < o; q++) { repeat = repeat || seen[q] == pb; }',
      '  seen[o] = pb;',
      `  if (repeat) { ${each(words, w => `if ((o >> 5u) == ${u32(w)}) { mask${w} |= 1u << (o & 31u); }`)} continue; }`,
      '  candidates += pair_start(pb + 1u) - pair_start(pb);',
      '}');
  }
  return lines.map(line => indent + line).join('\n');
}

// Code that walks the distinct buckets of the 3^D cells around (c0, c1, ...), skipping those the
// mask marks: `body` runs for each, with `pb` its bucket
function forNeighbourBuckets(D, body, indent) {
  const cells = 3 ** D, words = Math.ceil(cells / 32);
  const word = words === 1 ? 'mask0' : 'select(select(mask0, mask1, o >= 32u), mask2, o >= 64u)';
  const lines = [
    `for (var o = 0u; o < ${u32(cells)}; o++) {`,
    `  if (((${word} >> (o & 31u)) & 1u) != 0u) { continue; }`,
    `  let pb = ${neighbourHash(D, 'o')};`,
  ].concat(body.map(line => '  ' + line), ['}']);
  return lines.map(line => indent + line).join('\n');
}

// Writes the indirect dispatch size for `count` threads of `wg` into pairArgs from `at`
function gridArgs(name, count, wg, at, maxGroups) {
  return [
    `let ${name}W = (${count} + ${u32(wg - 1)}) / ${u32(wg)};`,
    `pairArgs[${at}] = min(${name}W, ${u32(maxGroups)}); pairArgs[${at + 1}] = (${name}W + ${u32(maxGroups - 1)}) / ${u32(maxGroups)}; pairArgs[${at + 2}] = 1u;`,
  ].join(' ');
}

/**
 * The structure kernels of one sort: {name: {code, bindings}}. `spec`: {D, layout, snapshot:
 * [{column, width, ref}], pos (colRef), slot: {decl(binding), at(index)}, radius (slot index),
 * maxGroups}.
 */
export function sortKernels(spec) {
  const { D, layout, slot } = spec;
  const B = layout.body;
  const hash = hashFn(D);
  const out = {};

  out.BIN = {
    bindings: ['uniform', 'dynamic', 'read', 'storage', 'storage'],
    code: `${PARAMS}
${slot.decl(1)}
@group(0) @binding(2) var<storage, read> X: array<f32>;
@group(0) @binding(3) var<storage, read_write> pairCount: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> pairBody: array<u32>;
${hash}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n) { return; }
  let inv = 1.0 / (${slot.at(spec.radius)} * ${CELL_GROWTH});
  ${each(D, k => `let c${k} = i32(clamp(floor(${spec.pos.at('i', k)} * inv), ${-CELL_LIMIT}.0, ${CELL_LIMIT}.0));`, '\n  ')}
  let h = pair_hash(${each(D, k => `c${k}`, ', ')});
  let record = i * ${u32(B)};
  pairBody[record + ${u32(BODY.BUCKET)}] = h;
  pairBody[record + ${u32(BODY.SLOT)}] = atomicAdd(&pairCount[h], 1u);
  pairBody[record + ${u32(BODY.RANK)}] = 0u;
  ${each(D, k => `pairBody[record + ${u32(BODY.CELL + k)}] = bitcast<u32>(c${k});`, ' ')}
}
`,
  };

  // Exclusive scan of the counts in blocks of 1,024 (the table holds a multiple of 1,024); zeroes
  // the counts for the next step. pairStart: [start in its block per bucket | 0 | block offsets,
  // then n]
  out.SCAN_BLOCKS = {
    bindings: ['uniform', 'storage', 'storage'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairCount: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStart: array<u32>;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * 1024u + li * 4u;
  let a0 = pairCount[base]; let a1 = pairCount[base + 1u]; let a2 = pairCount[base + 2u]; let a3 = pairCount[base + 3u];
  pairCount[base] = 0u; pairCount[base + 1u] = 0u; pairCount[base + 2u] = 0u; pairCount[base + 3u] = 0u;
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
  pairStart[base] = ex; pairStart[base + 1u] = ex + a0; pairStart[base + 2u] = ex + a0 + a1; pairStart[base + 3u] = ex + a0 + a1 + a2;
  if (li == 255u) { pairStart[PP.size + 1u + wid.x] = tmp[255]; }
}
`,
  };

  // One workgroup: the block sums become block offsets, 1,024 at a time with a carry; the offset
  // past the last block is n, so pair_start(size) is n
  out.SCAN_TOP = {
    bindings: ['uniform', 'storage'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairStart: array<u32>;
var<workgroup> tmp: array<u32, 256>;
var<workgroup> carry: u32;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  if (li == 0u) { carry = 0u; }
  workgroupBarrier();
  let sums = PP.size + 1u;
  for (var done = 0u; done < PP.blocks; done += 1024u) {
    let base = done + li * 4u;
    var a = vec4u(0u);
    for (var k = 0u; k < 4u; k++) { if (base + k < PP.blocks) { a[k] = pairStart[sums + base + k]; } }
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
    var ex = carry + tmp[li] - t;
    for (var k = 0u; k < 4u; k++) { if (base + k < PP.blocks) { pairStart[sums + base + k] = ex; } ex += a[k]; }
    workgroupBarrier();
    if (li == 255u) { carry += tmp[255]; }
    workgroupBarrier();
  }
  if (li == 0u) { pairStart[sums + PP.blocks] = carry; }
}
`,
  };

  out.PLACE = {
    bindings: ['uniform', 'read', 'storage', 'storage', 'storage'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairStart: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairList: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairArgs: array<atomic<u32>>;
${START_FN}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n) { return; }
  let record = i * ${u32(B)};
  let h = pairBody[record + ${u32(BODY.BUCKET)}];
  let s = pair_start(h);
  let k = pair_start(h + 1u) - s;
  pairList[s + pairBody[record + ${u32(BODY.SLOT)}]] = i;
  if (k > ${u32(RANK_DIRECT)}) {
    atomicOr(&pairArgs[${ARGS.FLAGS}], ${u32(CROWDED)});
    let ranks = (k + ${u32(CHUNK - 1)}) / ${u32(CHUNK)};
    let first = atomicAdd(&pairArgs[${ARGS.RANK_TOTAL}], ranks);
    pairBody[record + ${u32(BODY.RANK_FIRST)}] = first;
    // past the cap nothing is written, and ARGS_RANK stops the step
    if (first <= PP.cap && first + ranks <= PP.cap) {
      for (var c = 0u; c < ranks; c++) { pairList[PP.n + first + c] = i; }
    }
  }
}
`,
  };

  // One thread: rank work over the cap stops the step's pair work, and the status keeps the first
  // stage and count that went over until the runner reads it
  const stop = (count, code, capacity = 'PP.cap') => `pairArgs[${ARGS.OK}] = 0u;
    if (pairStatus[0] == 0u) {
      pairStatus[0] = ${u32(code)};
      pairStatus[1] = PP.sort;
      // a total at or under the cap has wrapped past 2^32
      pairStatus[2] = select(0xffffffffu, ${count}, ${count} > ${capacity});
      pairStatus[3] = ${capacity};
    }`;
  out.ARGS_RANK = {
    bindings: ['uniform', 'storage', 'storage'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
@compute @workgroup_size(1)
fn main() {
  let ranks = pairArgs[${ARGS.RANK_TOTAL}];
  let crowded = (pairArgs[${ARGS.FLAGS}] & ${u32(CROWDED)}) != 0u;
  pairArgs[${ARGS.OK}] = 1u;
  pairArgs[${ARGS.RANK_X}] = 0u; pairArgs[${ARGS.RANK_Y}] = 1u; pairArgs[${ARGS.RANK_Z}] = 1u;
  pairArgs[${ARGS.RANK_COUNT}] = 0u;
  if (crowded && ranks > PP.cap) {
    ${stop('ranks', 2)}
  } else if (crowded) {
    ${gridArgs('rank', 'ranks', RANK_WG, ARGS.RANK_X, spec.maxGroups)}
    pairArgs[${ARGS.RANK_COUNT}] = ranks;
  }
  pairArgs[${ARGS.RANK_TOTAL}] = 0u;
}
`,
  };

  out.RANK = {
    bindings: ['uniform', 'read', 'read', 'storage', 'read'],
    indirect: ARGS.RANK_X,
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairBody: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read> pairList: array<u32>;
${START_FN}
@compute @workgroup_size(${RANK_WG})
fn main(${LINEAR}) {
  let t = ${linearId(RANK_WG)};
  if (t >= pairArgs[${ARGS.RANK_COUNT}]) { return; }
  let i = pairList[PP.n + t];
  let record = i * ${u32(B)};
  let c = t - atomicLoad(&pairBody[record + ${u32(BODY.RANK_FIRST)}]);
  let h = atomicLoad(&pairBody[record + ${u32(BODY.BUCKET)}]);
  let lo = pair_start(h) + c * ${u32(CHUNK)};
  let hi = min(pair_start(h + 1u), lo + ${u32(CHUNK)});
  var lower = 0u;
  for (var at = lo; at < hi; at++) { lower += select(0u, 1u, pairList[at] < i); }
  if (lower > 0u) { atomicAdd(&pairBody[record + ${u32(BODY.RANK)}], lower); }
}
`,
  };

  // The snapshot of a body: its position (relative, as the device keeps it), the columns the
  // sort's formulas read, its index; as u32 words, so the index stays exact
  const words = [];
  for (let k = 0; k < D; k++) words.push(`bitcast<u32>(${spec.pos.at('i', k)})`);
  spec.snapshot.forEach(c => { for (let k = 0; k < c.width; k++) words.push(`bitcast<u32>(${c.ref.at('i', k)})`); });
  while (words.length < layout.index) words.push('0u');
  words.push('i');
  while (words.length < layout.snap4 * 4) words.push('0u');
  const columnBuffers = [];
  spec.snapshot.forEach(c => { if (columnBuffers.indexOf(c.ref.buffer) < 0) columnBuffers.push(c.ref.buffer); });
  out.ORDER = orderKernel(spec, words, columnBuffers, false);
  out.ORDER_S = orderKernel(spec, words, columnBuffers, true);

  out.ARGS = {
    bindings: ['uniform', 'storage', 'storage'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
@compute @workgroup_size(1)
fn main() {
  let total = pairArgs[${ARGS.ALLOC}];
  pairStatus[4u + PP.sort] = total;
  pairArgs[${ARGS.EVAL_X}] = 0u; pairArgs[${ARGS.EVAL_Y}] = 1u; pairArgs[${ARGS.EVAL_Z}] = 1u;
  pairArgs[${ARGS.EVAL_COUNT}] = 0u;
  if ((pairArgs[${ARGS.FLAGS}] & ${u32(OVER)}) != 0u || total > PP.cap) {
    ${stop('total', 1)}
  } else if (pairArgs[${ARGS.OK}] != 0u) {
    ${gridArgs('eval', 'total', EVAL_WG, ARGS.EVAL_X, spec.maxGroups)}
    pairArgs[${ARGS.EVAL_COUNT}] = total;
  }
  pairArgs[${ARGS.FLAGS}] = 0u; pairArgs[${ARGS.ALLOC}] = 0u;
}
`,
  };
  Object.assign(out, slicedSortKernels(spec, stop));
  return out;
}

// The kernels a sliced step adds to its sort (ORDER_S is ORDER's variant). Its pair work and rank
// work run in slices of at most PP.cap chunks, each in a submit of its own; owner lists are
// written per slice, so memory stays at one slice:
//   PLACE_S        PLACE, without writing rank chunk owners
//   ARGS_RANK_S    ARGS_RANK against the step's slices (SL.k of them); a dispatch size per slice
//   RANK_OWNERS_S  per body of a crowded bucket: the owners of its rank chunks in this slice
//   RANK_S         RANK over this slice's rank chunks
//   ARGS_S         ARGS against the step's slices; a dispatch size per slice
//   EVAL_OWNERS_S  per body: the owners (its place in bucket order) of its chunks in this slice
function slicedSortKernels(spec, stop) {
  const { layout } = spec;
  const B = layout.body;
  const out = {};
  // a slice's chunks, from `first` for `count`, clipped to slice SL.index
  const clip = (first, count) => `let base = SL.index * PP.cap;
  let lo = max(${first}, base);
  let hi = min(${first} + ${count}, base + PP.cap);`;
  // the indirect dispatch size of each slice of `total` chunks, `wg` threads a workgroup
  const sliceArgs = (total, wg, at) => `for (var s = 0u; s < SL.k; s++) {
      let count = select(0u, min(PP.cap, ${total} - s * PP.cap), ${total} > s * PP.cap);
      let w = (count + ${u32(wg - 1)}) / ${u32(wg)};
      pairArgs[${u32(at)} + 3u * s] = min(w, ${u32(spec.maxGroups)});
      pairArgs[${u32(at)} + 3u * s + 1u] = (w + ${u32(spec.maxGroups - 1)}) / ${u32(spec.maxGroups)};
      pairArgs[${u32(at)} + 3u * s + 2u] = 1u;
    }`;
  const zeroArgs = at => `for (var s = 0u; s < SL.k; s++) { pairArgs[${u32(at)} + 3u * s] = 0u; pairArgs[${u32(at)} + 3u * s + 1u] = 1u; pairArgs[${u32(at)} + 3u * s + 2u] = 1u; }`;

  out.PLACE_S = {
    bindings: ['uniform', 'read', 'storage', 'storage', 'storage'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairStart: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairList: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairArgs: array<atomic<u32>>;
${START_FN}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n) { return; }
  let record = i * ${u32(B)};
  let h = pairBody[record + ${u32(BODY.BUCKET)}];
  let s = pair_start(h);
  let k = pair_start(h + 1u) - s;
  pairList[s + pairBody[record + ${u32(BODY.SLOT)}]] = i;
  if (k > ${u32(RANK_DIRECT)}) {
    atomicOr(&pairArgs[${ARGS.FLAGS}], ${u32(CROWDED)});
    pairBody[record + ${u32(BODY.RANK_FIRST)}] = atomicAdd(&pairArgs[${ARGS.RANK_TOTAL}], (k + ${u32(CHUNK - 1)}) / ${u32(CHUNK)});
  }
}
`,
  };

  out.ARGS_RANK_S = {
    bindings: ['uniform', 'storage', 'storage', 'dynamic'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
${SLICE(3)}
@compute @workgroup_size(1)
fn main() {
  let ranks = pairArgs[${ARGS.RANK_TOTAL}];
  let crowded = (pairArgs[${ARGS.FLAGS}] & ${u32(CROWDED)}) != 0u;
  let capacity = SL.k * PP.cap;
  pairArgs[${ARGS.OK}] = 1u;
  pairArgs[${ARGS.RANK_COUNT}] = 0u;
  ${zeroArgs(ARGS.SLICE_RANK)}
  if (crowded && ranks > capacity) {
    ${stop('ranks', 4, 'capacity')}
  } else if (crowded) {
    ${sliceArgs('ranks', RANK_WG, ARGS.SLICE_RANK)}
    pairArgs[${ARGS.RANK_COUNT}] = ranks;
  }
  pairArgs[${ARGS.RANK_TOTAL}] = 0u;
}
`,
  };

  out.RANK_OWNERS_S = {
    bindings: ['uniform', 'read', 'read', 'read', 'storage', 'dynamic'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read> pairBody: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairList: array<u32>;
${SLICE(5)}
${START_FN}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n || pairArgs[${ARGS.RANK_COUNT}] == 0u) { return; }
  let record = i * ${u32(B)};
  let h = pairBody[record + ${u32(BODY.BUCKET)}];
  let k = pair_start(h + 1u) - pair_start(h);
  if (k <= ${u32(RANK_DIRECT)}) { return; }
  ${clip(`pairBody[record + ${u32(BODY.RANK_FIRST)}]`, `(k + ${u32(CHUNK - 1)}) / ${u32(CHUNK)}`)}
  for (var c = lo; c < hi; c++) { pairList[PP.n + c - base] = i; }
}
`,
  };

  out.RANK_S = {
    bindings: ['uniform', 'read', 'read', 'storage', 'read', 'dynamic'],
    indirect: ARGS.SLICE_RANK,
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairBody: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read> pairList: array<u32>;
${SLICE(5)}
${START_FN}
@compute @workgroup_size(${RANK_WG})
fn main(${LINEAR}) {
  let t = ${linearId(RANK_WG)};
  let chunk = SL.index * PP.cap + t;
  if (t >= PP.cap || chunk >= pairArgs[${ARGS.RANK_COUNT}]) { return; }
  let i = pairList[PP.n + t];
  let record = i * ${u32(B)};
  let c = chunk - atomicLoad(&pairBody[record + ${u32(BODY.RANK_FIRST)}]);
  let h = atomicLoad(&pairBody[record + ${u32(BODY.BUCKET)}]);
  let lo = pair_start(h) + c * ${u32(CHUNK)};
  let hi = min(pair_start(h + 1u), lo + ${u32(CHUNK)});
  var lower = 0u;
  for (var at = lo; at < hi; at++) { lower += select(0u, 1u, pairList[at] < i); }
  if (lower > 0u) { atomicAdd(&pairBody[record + ${u32(BODY.RANK)}], lower); }
}
`,
  };

  out.ARGS_S = {
    bindings: ['uniform', 'storage', 'storage', 'dynamic'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
${SLICE(3)}
@compute @workgroup_size(1)
fn main() {
  let total = pairArgs[${ARGS.ALLOC}];
  let capacity = SL.k * PP.cap;
  pairStatus[4u + PP.sort] = total;
  pairArgs[${ARGS.EVAL_COUNT}] = 0u;
  ${zeroArgs(ARGS.SLICE_EVAL)}
  if ((pairArgs[${ARGS.FLAGS}] & ${u32(OVER)}) != 0u || total > capacity) {
    ${stop('total', 3, 'capacity')}
  } else if (pairArgs[${ARGS.OK}] != 0u) {
    ${sliceArgs('total', EVAL_WG, ARGS.SLICE_EVAL)}
    pairArgs[${ARGS.EVAL_COUNT}] = total;
  }
  pairArgs[${ARGS.FLAGS}] = 0u; pairArgs[${ARGS.ALLOC}] = 0u;
}
`,
  };

  out.EVAL_OWNERS_S = {
    bindings: ['uniform', 'read', 'read', 'storage', 'dynamic'],
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairList: array<u32>;
${SLICE(4)}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n || pairArgs[${ARGS.EVAL_COUNT}] == 0u) { return; }
  let record = i * ${u32(B)};
  let p = pairList[PP.home + PP.n * ${u32(layout.home)} + i];
  ${clip(`pairBody[record + ${u32(BODY.FIRST)}]`, `pairBody[record + ${u32(BODY.COUNT)}]`)}
  for (var c = lo; c < hi; c++) { pairList[PP.owners + c - base] = p; }
}
`,
  };
  return out;
}

// ORDER (see the top of this file). `words`: the snapshot's words, `columnBuffers`: the buffers
// its columns come from. Sliced, it checks the claimed chunks against the step's slices and
// keeps each body's place in bucket order for the slices' owner lists, instead of writing them
function orderKernel(spec, words, columnBuffers, sliced) {
  const { D, layout } = spec;
  const B = layout.body;
  // a sliced step may claim up to its slices' chunks, and leaves the chunk owners to each slice
  const capacity = sliced ? 'capacity' : 'PP.cap';
  return {
    bindings: ['uniform', 'storage', 'read', 'storage', 'storage', 'storage', 'read'].concat(columnBuffers.map(() => 'read'), sliced ? ['dynamic'] : []),
    columns: columnBuffers,
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairBody: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairList: array<u32>;
@group(0) @binding(5) var<storage, read_write> pairSnap: array<vec4u>;
@group(0) @binding(6) var<storage, read> X: array<f32>;
${columnBuffers.map((name, k) => `@group(0) @binding(${7 + k}) var<storage, read> ${name}: array<f32>;`).join('\n')}${sliced ? '\n' + SLICE(7 + columnBuffers.length) : ''}
var<workgroup> claimed: atomic<u32>;
var<workgroup> base: u32;
var<workgroup> fits: u32;
${hashFn(D)}
${START_FN}
@compute @workgroup_size(${WG})
fn main(${LINEAR}, @builtin(local_invocation_index) li: u32) {
  let q = ${linearId(WG)};
  let live = q < PP.n && atomicLoad(&pairArgs[${ARGS.OK}]) != 0u;
  var i = 0u; var p = 0u; var chunks = 0u; var mine = 0u;
  ${each(D, k => `var c${k} = 0;`)}
  ${each(layout.maskWords, w => `var home${w} = 0u;`)}
  if (live) {
    i = pairList[q];
    let record = i * ${u32(B)};
    let h = pairBody[record + ${u32(BODY.BUCKET)}];
    let s = pair_start(h);
    let e = pair_start(h + 1u);
    var rank = pairBody[record + ${u32(BODY.RANK)}];
    if (e - s <= ${u32(RANK_DIRECT)}) {
      rank = 0u;
      for (var t = s; t < e; t++) { rank += select(0u, 1u, pairList[t] < i); }
    }
    p = s + rank;
    ${each(layout.snap4, w => `pairSnap[p * ${u32(layout.snap4)} + ${u32(w)}] = vec4u(${words.slice(4 * w, 4 * w + 4).join(', ')});`, '\n    ')}
    ${each(D, k => `c${k} = bitcast<i32>(pairBody[record + ${u32(BODY.CELL + k)}]);`)}
${countNeighbours(D, '    ')}
    ${each(layout.maskWords, w => `home${w} = mask${w};`)}
    // the body's own bucket is among them, so every body has a chunk
    chunks = (candidates + ${u32(CHUNK - 1)}) / ${u32(CHUNK)};
    mine = atomicAdd(&claimed, chunks);
  }
  // chunks are handed out per workgroup, in bucket order; past the cap nothing is written, and
  // ARGS stops the step
  workgroupBarrier();
  if (li == 0u) {
    let total = atomicLoad(&claimed);
    base = atomicAdd(&pairArgs[${ARGS.ALLOC}], total);${sliced ? '\n    let capacity = SL.k * PP.cap;' : ''}
    fits = select(0u, 1u, base <= ${capacity} && base + total <= ${capacity});
    if (fits == 0u) { atomicOr(&pairArgs[${ARGS.FLAGS}], ${u32(OVER)}); }
  }
  workgroupBarrier();
  if (live && fits != 0u) {
    let first = base + mine;
    let record = i * ${u32(B)};
    pairBody[record + ${u32(BODY.FIRST)}] = first;
    pairBody[record + ${u32(BODY.COUNT)}] = chunks;
    let home = PP.home + p * ${u32(layout.home)};
    pairList[home] = first;
    ${each(D, k => `pairList[home + ${u32(1 + k)}] = bitcast<u32>(c${k});`)}
    ${each(layout.maskWords, w => `pairList[home + ${u32(1 + D + w)}] = home${w};`)}
    ${sliced ? `pairList[PP.home + PP.n * ${u32(layout.home)} + i] = p;` : 'for (var c = 0u; c < chunks; c++) { pairList[PP.owners + first + c] = p; }'}
  }
}
`,
  };
}

/**
 * The chunk kernel and the gather of one pair stage: {EVAL, GATHER} as {code, bindings}.
 * `spec`: {D, layout, stage, snapshot: [{column, width, word}], columns (program's, by name),
 * slot, radius, param(name), builtIn(name), sums: {width(name), at(name, k), buffer}, origin(k),
 * outputs: {force: colRef, <accumulator>: colRef}, printer}.
 */
export function stageKernels(spec) {
  const { D, layout, slot } = spec;
  const B = layout.body;
  const wordOf = (column, k) => spec.snapshot.find(c => c.column === column).word + k;
  // a number of a snapshot entry loaded into vec4u locals (me0, me1, ... or other0, ...)
  const field = (who, w) => `${who}${w >> 2}.${AX[w & 3]}`;
  const fieldF = (who, w) => `bitcast<f32>(${field(who, w)})`;
  const read = (column, who, k) => {
    if (column === 'pos') return `(${fieldF(who, k)} + ${spec.origin(k)})`;
    return fieldF(who, wordOf(column, k));
  };
  const printed = printPairFormula(spec.stage, {
    D, printer: spec.printer, columns: spec.columns, read,
    param: spec.param, builtIn: spec.builtIn,
    sumWidth: name => spec.sums.width(name), sum: (name, k) => spec.sums.at(name, k),
  });
  const accumulators = printed.accumulators;
  const partialWords = D + accumulators.reduce((total, a) => total + a.width, 0);
  const sumsRead = spec.stage.sums.length > 0;
  const candidate = pairCandidate(printed, { D, me: 'me', other: 'other', r2: 'r2', radius: 'radius', reach2: 'reach2', force: k => `pair_force_${k}` });
  const totals = [];
  for (let k = 0; k < D; k++) totals.push(`pair_force_${k}`);
  accumulators.forEach(a => { for (let k = 0; k < a.width; k++) totals.push(accumulatorName(a.column, k, a.width)); });
  const load = (who, base) => each(layout.snap4, w => `let ${who}${w} = pairSnap[${base} * ${u32(layout.snap4)} + ${u32(w)}];`, ' ');

  // A sliced step's chunk kernel works on the chunks of one slice: thread t on chunk
  // SL.index * PP.cap + t, its owner and partial at t
  const evalKernel = sliced => ({
    bindings: ['uniform', 'dynamic', 'read', 'read', 'read', 'read', 'storage'].concat(sumsRead ? ['read'] : [], sliced ? ['dynamic'] : []),
    indirect: sliced ? ARGS.SLICE_EVAL : ARGS.EVAL_X,
    partialWords,
    code: `${PARAMS}
${slot.decl(1)}
@group(0) @binding(2) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(3) var<storage, read> pairStart: array<u32>;
@group(0) @binding(4) var<storage, read> pairList: array<u32>;
@group(0) @binding(5) var<storage, read> pairSnap: array<vec4u>;
@group(0) @binding(6) var<storage, read_write> pairPartial: array<f32>;
${sumsRead ? `@group(0) @binding(7) var<storage, read> ${spec.sums.buffer}: array<f32>;` : ''}${sliced ? '\n' + SLICE(sumsRead ? 8 : 7) : ''}
${hashFn(D)}
${START_FN}
@compute @workgroup_size(${EVAL_WG})
fn main(${LINEAR}) {
  let t = ${linearId(EVAL_WG)};
  ${sliced ? `let chunk = SL.index * PP.cap + t;
  if (t >= PP.cap || chunk >= pairArgs[${ARGS.EVAL_COUNT}]) { return; }` : `if (t >= pairArgs[${ARGS.EVAL_COUNT}]) { return; }`}
  let p = pairList[PP.owners + t];
  ${load('me', 'p')}
  let me = me${layout.index >> 2}.${AX[layout.index & 3]};
  let home = PP.home + p * ${u32(layout.home)};
  ${each(D, k => `let c${k} = bitcast<i32>(pairList[home + ${u32(1 + k)}]);`)}
  ${each(layout.maskWords, w => `let mask${w} = pairList[home + ${u32(1 + D + w)}];`)}
  let radius = ${slot.at(spec.radius)};
  // most candidates are farther than the radius: the squared test spares them the root, with a
  // margin that drops only pairs the exact test drops
  let reach2 = radius * radius * 1.0001;
  ${totals.map(name => `var ${name} = 0.0;`).join(' ')}
  var skip = (${sliced ? 'chunk' : 't'} - pairList[home]) * ${u32(CHUNK)};
  var left = ${u32(CHUNK)};
${forNeighbourBuckets(D, [
    'let s = pair_start(pb);',
    'let k = pair_start(pb + 1u) - s;',
    'if (skip >= k) { skip -= k; continue; }',
    'let lo = s + skip;',
    'skip = 0u;',
    'let hi = min(s + k, lo + left);',
    'left -= hi - lo;',
    'for (var at = lo; at < hi; at++) {',
    `  ${load('other', 'at')}`,
    `  let other = other${layout.index >> 2}.${AX[layout.index & 3]};`,
    `  ${each(D, k => `let d${k} = ${fieldF('me', k)} - ${fieldF('other', k)};`)}`,
    `  let r2 = ${each(D, k => `d${k} * d${k}`, ' + ')};`,
  ].concat(candidate.map(line => '  ' + line), [
    '}',
    'if (left == 0u) { break; }',
  ]), '  ')}
  let out = t * ${u32(partialWords)};
  ${totals.map((name, w) => `pairPartial[out + ${u32(w)}] = ${name};`).join(' ')}
}
`,
  });

  const outputBuffers = [];
  const outputs = [];
  for (let k = 0; k < D; k++) outputs.push(spec.outputs.force.at('i', k));
  accumulators.forEach(a => { for (let k = 0; k < a.width; k++) outputs.push(spec.outputs[a.column].at('i', k)); });
  [spec.outputs.force].concat(accumulators.map(a => spec.outputs[a.column])).forEach(ref => {
    if (outputBuffers.indexOf(ref.buffer) < 0) outputBuffers.push(ref.buffer);
  });
  const GATHER = {
    bindings: ['uniform', 'read', 'read', 'read'].concat(outputBuffers.map(() => 'storage')),
    columns: outputBuffers,
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read> pairPartial: array<f32>;
${outputBuffers.map((name, k) => `@group(0) @binding(${4 + k}) var<storage, read_write> ${name}: array<f32>;`).join('\n')}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n) { return; }
  ${outputs.map((_, w) => `var total${w} = 0.0;`).join(' ')}
  if (pairArgs[${ARGS.EVAL_COUNT}] != 0u) {
    let record = i * ${u32(B)};
    let first = pairBody[record + ${u32(BODY.FIRST)}];
    let count = pairBody[record + ${u32(BODY.COUNT)}];
    for (var c = 0u; c < count; c++) {
      let at = (first + c) * ${u32(partialWords)};
      ${outputs.map((_, w) => `total${w} += pairPartial[at + ${u32(w)}];`).join(' ')}
    }
  }
  ${outputs.map((ref, w) => `${ref} = total${w};`).join(' ')}
}
`,
  };

  // A slice's gather adds the body's chunks in this slice onto what the slices before added (the
  // first slice starts from 0): the same additions in the same order as GATHER
  const GATHER_S = {
    bindings: ['uniform', 'read', 'read', 'read'].concat(outputBuffers.map(() => 'storage'), ['dynamic']),
    columns: outputBuffers,
    code: `${PARAMS}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read> pairPartial: array<f32>;
${outputBuffers.map((name, k) => `@group(0) @binding(${4 + k}) var<storage, read_write> ${name}: array<f32>;`).join('\n')}
${SLICE(4 + outputBuffers.length)}
@compute @workgroup_size(${WG})
fn main(${LINEAR}) {
  let i = ${linearId(WG)};
  if (i >= PP.n) { return; }
  let opening = SL.index == 0u;
  ${outputs.map((ref, w) => `var total${w} = select(${ref}, 0.0, opening);`).join(' ')}
  var added = false;
  if (pairArgs[${ARGS.EVAL_COUNT}] != 0u) {
    let record = i * ${u32(B)};
    let first = pairBody[record + ${u32(BODY.FIRST)}];
    let base = SL.index * PP.cap;
    let lo = max(first, base);
    let hi = min(first + pairBody[record + ${u32(BODY.COUNT)}], base + PP.cap);
    for (var c = lo; c < hi; c++) {
      let at = (c - base) * ${u32(partialWords)};
      ${outputs.map((_, w) => `total${w} += pairPartial[at + ${u32(w)}];`).join(' ')}
      added = true;
    }
  }
  if (opening || added) { ${outputs.map((ref, w) => `${ref} = total${w};`).join(' ')} }
}
`,
  };
  return { EVAL: evalKernel(false), GATHER, EVAL_S: evalKernel(true), GATHER_S, accumulators, partialWords };
}
