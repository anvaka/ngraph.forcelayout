// The generic pyramid's plan, made without a device: grid size, buffers and their bytes (with the
// refusal when they do not fit the device), the WGSL of its structure kernels and the section a
// node kernel fuses to add the push at each body. build.js makes it real on a device.
//
//   const pyr = planPyramid({ D, n, limits, channels, pos });
//   pyr.refusal     // null, or why this device cannot hold it (with the numbers)
//   pyr.buffers     // bytes per buffer
//   pyr.kernels     // WGSL by kernel name
//   pyr.section     // {bindings, uniform, declarations, row(t), code({t, i, force, sensitivity})}
//
// A channel is {stage, law, centroid, charge, sensitivity}: `law` a compiled law of the library
// (null for 1/r^2), `centroid` 'own' or 'shared' (channel 0 always has its own centre),
// `charge` and `pos` colRefs: {buffer, type?, at(row, axis)}, the caller's columns.
import { pyramidKernels, pyramidLayout, boxLayout, WG, LIST_HEAD } from './wgsl.js';
import { createPrinter, lawValueCount, lawValueProblem, f32Problem, F32_MAX } from '../wgsl/print.js';

// Bodies of an overfull cell past this many are sampled with weights. Today's template samples
// past 64, which on relaxed hub graphs left cells of 65 to 330 bodies sampled and their pushes
// 15 to 100% off, and dense clusters (a hub's leaves at the start) further off. Up to 1,024 a
// cell is exact, as it is also the size up to which ORDER sorts a cell by index; past it a body
// still sees at most 3^D x 1,024 bodies.
export const NEAR_CAP = 1024;
const AX = 'xyzw';

/**
 * Cells per axis for n bodies in D dimensions. 2D: today's grid (templates/grid.js), G^2 >= n / 2
 * from 32 to 1,024. 3D: the smallest G with G^3 >= max(1,024, 2n), at most 2^20 cells. (Round 3
 * had G^3 >= n / 2: on hub graphs that put most bodies of megaStars in 30 crowded cells.)
 */
export function chooseGrid(n, D) {
  if (D === 2) {
    let G = 32;
    while (G * G * 2 < n && G < 1024) G *= 2;
    return G;
  }
  let G = 2;
  while ((G ** D < 1024 || G ** D < 2 * n) && (2 * G) ** D <= (1 << 20)) G *= 2;
  return G;
}

/**
 * The pyramid for `n` bodies: see the top of this file. `values`, when given, holds the law
 * numbers per step instead of the pyramid's uniform: {decl(binding), law(c, k), gravity}.
 * `grid` forces the cells per axis and `blocks: false` one TREE_PYR dispatch per level (for
 * measurements and tests).
 */
export function planPyramid({ D, n, limits, channels, pos, values = null, grid = 0, heads, heavyCells, secondOrder, separation, blocks = true, warn }) {
  const refuse = (reason, buffers = {}) => ({ refusal: reason, buffers, kernels: {}, section: null, dispatches: 0 });
  if (D !== 2 && D !== 3) return refuse(`the grid pyramid is 2D and 3D; this layout is ${D}D`);
  if (!channels.length) return refuse('a tree pass needs at least one charge');

  // Law groups: channels with one law object (or one law spec, or 1/r^2) evaluate it once
  const groups = [];
  const printer = createPrinter(warn);
  for (let c = 0; c < channels.length; c++) {
    const law = channels[c].law && !channels[c].law.isDefault ? channels[c].law : null;
    let group = groups.find(g => (law ? g.law === law || (g.law && g.law.spec === law.spec) : g.isDefault));
    if (!group) {
      if (law) {
        const problem = lawProblem(law, D, printer);
        if (problem) return refuse(`${channels[c].stage || 'channel ' + c}: ${problem}`);
      }
      group = { law, isDefault: !law, channels: [], first: c };
      groups.push(group);
    }
    group.channels.push(c);
  }
  // Tables live at the start of treeCells, law numbers in TP.law unless the caller holds them
  let tableWords = 0, lawWords = 0;
  groups.forEach(group => {
    if (!group.law) return;
    group.tables = group.law.describe().tables.map(table => {
      const entry = { name: table.name, from: table.from, to: table.to, length: table.values.length, values: table.values, base: tableWords };
      tableWords += table.values.length;
      return entry;
    });
    group.base = lawWords;
    lawWords += Math.ceil(lawValueCount(group.law) / 4) * 4;
    group.value = values ? k => values.law(group.first, k) : k => `TP.law[${(group.base + k) >> 2}].${AX[(group.base + k) & 3]}`;
  });
  // A law whose push falls slower than 1/r^2 has a far field that is the sum of every level's
  // small errors: a/r in 2D was 1.3 to 2.5 times the CPU tree's error. Its channels get
  // second-order expansions (not for tables: their slope is piecewise constant), and in 2D wider
  // near cells (`sep` below): a/r is then 0.14 to 0.26 times, and in 3D (second order only) laws
  // down to a constant push 0.32 to 0.62 times.
  groups.forEach(group => {
    group.second = secondOrder !== undefined ? !!secondOrder && !(group.tables || []).length :
      !!group.law && !(group.tables || []).length && slowLaw(group.law, D);
  });
  const own = channels.map((channel, c) => {
    const group = groups.findIndex(g => g.channels.indexOf(c) >= 0);
    return { own: c === 0 || channel.centroid !== 'shared', group, second: groups[group].second };
  });
  const L = pyramidLayout(D, own, tableWords);

  const G = grid || chooseGrid(n, D);
  if (G ** D > (1 << 20)) return refuse(`the grid pyramid takes up to 2^20 cells; ${G}^${D} is more`);
  // Wider near cells for a law that falls slower than 1/r^2, in 2D (see wgsl.js; in 3D they would
  // cost 4.6 times the interaction lists). Heavy finest cells (hubs amid their leaves, see
  // TREE_HEAVY): 3D needs them, 2D measured within the accuracy gate without; with wider near
  // cells their ring is in the near cells already.
  const sep = separation !== undefined ? separation : (D === 2 && groups.some(group => group.second) ? 2 : 1);
  const heavy = (heavyCells === undefined ? D === 3 : heavyCells) && sep === 1;
  const { sizes, buffers } = layoutSizes(D, n, G, L, channels.length, heavy);
  const nCells = sizes.nCells, levels = sizes.levels;

  const largest = Math.min(limits.maxStorageBufferBindingSize, limits.maxBufferSize);
  const over = Object.keys(buffers).filter(name => buffers[name] > largest);
  if (over.length) {
    const name = over.sort((a, b) => buffers[b] - buffers[a])[0];
    return refuse(`the tree pass with ${channels.length} charge${channels.length > 1 ? 's' : ''} in ${D}D at ${n.toLocaleString('en-US')} bodies needs ` +
      `${megabytes(buffers[name])} for ${name === 'treeCells' ? 'its cells' : name}; this device allows ${megabytes(largest)} per buffer`, buffers);
  }
  if (Math.ceil(n / WG) > limits.maxComputeWorkgroupsPerDimension ** 2) return refuse(`the grid pyramid runs up to ${(limits.maxComputeWorkgroupsPerDimension ** 2 * WG).toLocaleString('en-US')} bodies`);

  // Levels of the pyramid a workgroup reduces in its own memory (see tree_block in wgsl.js): its
  // WG records, and the counts when they have no room in the records
  const blockBytes = WG * L.CS4 * 16 + (L.CNT < 0 ? WG * 4 : 0) + 16;
  const blockSteps = blocks && blockBytes <= (limits.maxComputeWorkgroupStorageSize || 16384) ? Math.floor(Math.log2(WG) / D) : 0;
  const spec = {
    D, L, groups, lawWords: values ? 0 : lawWords, values, warn, heads: heads === undefined ? nCells > n : heads, heavyCells: heavy,
    sep, blockSteps,
    channels: own, pos, charges: channels.map(channel => channel.charge),
  };
  const out = pyramidKernels(spec);
  return {
    refusal: null, D, n, K: channels.length, layout: L, groups, sizes, buffers, heads: spec.heads, heavyCells: spec.heavyCells,
    lawWords: spec.lawWords, values, channels,
    kernels: out.kernels, columns: out.columns, section: out.section,
    // HIST, BOX, BIN, 3 scans, PLACE, ORDER, AGG0, PYRs, LOCAL (with the crowded cells'
    // workgroups), and HEAVY in 3D
    dispatches: 10 + pyrLevels(levels, blockSteps).length + (spec.heavyCells ? 1 : 0),
    blockSteps,
    heavyGroups: out.heavyGroups,
  };
}

/**
 * Bytes the pyramid needs for `channels` ([{centroid}]) at n bodies in D dimensions, by buffer,
 * without printing anything (design risk R5).
 */
export function pyramidMemory(D, n, channels, tableWords = 0) {
  const L = pyramidLayout(D, channels.map((channel, c) => ({ own: c === 0 || channel.centroid !== 'shared' })), tableWords);
  return layoutSizes(D, n, chooseGrid(n, D), L, channels.length, D === 3).buffers;
}

/**
 * The TREE_PYR dispatches for `levels` levels above the finest cells: [{from, steps}], the level
 * each starts from and how many it reduces. With `blockSteps` (UP in wgsl.js), TREE_AGG0 has done
 * the first ones; without, one level a dispatch.
 */
export function pyrLevels(levels, blockSteps) {
  const out = [];
  if (!blockSteps) {
    for (let l = 0; l < levels; l++) out.push({ from: l, steps: 1 });
    return out;
  }
  for (let l = Math.min(blockSteps, levels); l < levels; l += blockSteps) out.push({ from: l, steps: Math.min(blockSteps, levels - l) });
  return out;
}

// Grid sizes, offsets into the buffers, and bytes per buffer
function layoutSizes(D, n, G, L, K, heavy) {
  const levels = Math.log2(G), nCells = G ** D;
  const levelOff = [];
  let pyrSize = 0;
  for (let l = 0, g = G; l <= levels; l++, g >>= 1) { levelOff.push(pyrSize); pyrSize += g ** D; }
  // local expansions: every level but the top
  const localCells = levelOff[levels];
  const locOff = L.TAB4 + pyrSize * L.CS4;
  // the crowded cells' pushes per sorted body; at most n / (cap + 1) crowded cells
  const crowdOff = locOff + localCells * L.LS4;
  const crowdMax = Math.floor(n / (NEAR_CAP + 1)) + 1;
  const size = bytes => Math.max(16, Math.ceil(bytes / 16) * 16);
  return {
    sizes: { n, G, levels, nCells, levelOff, pyrSize, localCells, locOff, crowdOff, crowdList: LIST_HEAD + (heavy ? nCells : 0),
      occList: LIST_HEAD + (heavy ? nCells : 0) + crowdMax,
      metaTag: nCells, metaRow: nCells + 2 * n, metaCount: nCells + 3 * n },
    buffers: {
      treeBox: size(boxLayout(D).size * 4),
      treeCount: size(nCells * 4),
      treeBlocks: size(Math.max(nCells / 1024, 4) * 4),
      treeWork: size(3 * n * 4),
      treeMeta: size((nCells + 3 * n + pyrSize) * 4),
      treeSp: size(n * L.SP4 * 16),
      treeCells: size((crowdOff + n * Math.ceil(D * K / 4)) * 16),
      treeLists: size((LIST_HEAD + (heavy ? nCells : 0) + crowdMax + (nCells > n ? Math.min(n, nCells) : 0)) * 4),
    },
  };
}

// True when the law's push falls slower than 1/r^2 somewhere: its k1 = F(r)/r, probed with its
// numbers of this step over r = 2^-8 .. 2^24, has a local slope above -2.5 (1/r^2 has -3)
function slowLaw(law, D) {
  const body = law.prologue('values') + ' var k1; ' + law.emit(D, 'r', 'k1') + ' return k1;';
  const k1 = new Function('r', 'values', 'lawFunctions', body);
  let last = null;
  for (let e = -8; e <= 24; e++) {
    const value = Math.abs(k1(2 ** e, law.values, law.functions));
    if (last !== null && last > 0 && value > 0 && Math.log2(value / last) > -2.5) return true;
    last = value;
  }
  return false;
}

// Why the GPU cannot print `law`, or null
function lawProblem(law, D, printer) {
  if (Object.keys(law.functions).filter(name => law.tableNames.indexOf(name) < 0).length) {
    return 'laws with JavaScript functions run on the CPU only';
  }
  try {
    law.emit(printer, D, 'r', 'k1', 'k2');
  } catch (e) {
    return 'the law: ' + e.message;
  }
  for (const table of law.describe().tables) {
    // tiny values may become 0, which a table can afford; values past f32 cannot
    const bad = Array.from(table.values).find(v => !Number.isFinite(v) || Math.abs(v) > F32_MAX);
    if (bad !== undefined) return `the law's table ${table.name}: ${f32Problem(bad)}`;
  }
  const problem = lawValueProblem(law);
  if (problem) return `the law's ${problem.name} is ${problem.problem}`;
  return null;
}

function megabytes(bytes) {
  return (bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0) + ' MiB';
}
