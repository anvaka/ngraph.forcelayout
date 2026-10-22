// The generic plan: from the step as data (simulator.program()) to sections of code in CPU stage
// order, cut into kernels by the fusion rules (design section 7), plus where every column lives
// and what each step's slot of numbers holds. emit.js prints the kernels, engine.js runs them.
//
// Regime 'pairs': every tree pass is exact all-pairs inside a node kernel, over tiles of 256
// bodies in workgroup memory. Up to the small-graph size N* the whole step is then one kernel;
// sums and FIRE add their own small kernels. In 4 or more dimensions it runs up to 16,384 bodies.
// Regime 'pyramid' (2D and 3D above N*, which is 2,560 in 3D): the first group of tree passes is the generic grid
// pyramid (../pyramid): its structure dispatches run right before the node kernel that holds its
// section, and that kernel runs its threads in the pyramid's cell order (thread t works on row
// tree_row(t)), so bodies near each other in space run together. Further groups stay exact pairs.
//
// Buffers (one binding each per kernel, the same layout for every kernel):
//   P  uniform: n and counts (written when the data is built)
//   V  uniform, at a dynamic offset: the slot of the step being run (see slots below)
//   S  storage read_write: velocity, force, columns that stages write, sum results, FIRE state,
//      partial sums
//   H  storage read: columns only the host writes (mass, pinned, ...)
//   L  storage read (u32): springs as rows of neighbours
//   X, Y  storage read / read_write: positions at the start of the step and after it; they swap
//      every step, so other rows' positions are always read from a buffer nothing writes
// Every column is a block of `cap` rows (`cap * D` numbers for vectors, row by row), at an
// offset that is a constant of the WGSL; `cap` leaves room for the graph to grow.
import { physicsStages } from '../program.js';
import { planPyramid } from '../pyramid/plan.js';

export const THREADS = 256;
// Up to this many bodies the whole step is one kernel and repulsion is exact over all pairs
// (design section 6.1; it measured about 2k on an M4 Max, so this default is conservative). In 3D
// the pyramid costs more: exact pairs stay faster up to 2.7k-3k bodies there (G5, M4 Max)
export const SMALL_GRAPH = 1024;
export const SMALL_GRAPH_3D = 2560;
// Up to this many bodies the exact all-pairs loop runs where the pyramid does not (4D and up)
export const MAX_PAIRS = 16384;
const AXES = 'xyzw';
// Floats per slot of the step ring: a multiple of the 256-byte uniform offset alignment
const SLOT_FLOATS = 64;

// Settings every slot carries, at fixed places
const SETTING_VALUES = ['n', 'gravity', 'timeStep', 'dragCoefficient', 'springLength', 'springCoefficient', 'maxVelocity'];

/**
 * The number at place `index` of the step's slot, in WGSL
 */
export function slotValue(index) {
  return `V[${index >> 2}].${AXES[index & 3]}`;
}

/**
 * The generic plan of `program`, or {refusal} when it cannot take it (the stages themselves are
 * checked by check.js before). `laws` maps a tree stage's name to its compiled law (null for
 * 1/r^2); `options.limits` the device's (for the pyramid's buffers), `options.warn` takes the
 * printer's warnings, `options.smallGraph` overrides N* (for measurements).
 */
export function genericPlan(program, laws, options = {}) {
  const D = program.dims, n = program.spaces.nodes;
  const smallGraph = options.smallGraph || (D === 3 ? SMALL_GRAPH_3D : SMALL_GRAPH);
  const stages = physicsStages(program);
  const columnInfo = Object.create(null);
  program.columns.nodes.forEach(column => { columnInfo[column.name] = column; });
  const sumInfo = Object.create(null);
  program.sums.forEach(sum => { sumInfo[sum.name] = sum; });

  // --- sections, in CPU order -------------------------------------------------------------
  const sections = [], skipped = [];
  for (let at = 0; at < stages.length; at++) {
    const stage = stages[at];
    const kind = stage.builtIn || stage.shape;
    if (kind === 'clear') sections.push({ kind: 'clear', stage });
    else if (kind === 'drag') {
      // FIRE removes energy its own way
      if (stage.args.skipped) skipped.push(stage.name);
      else sections.push({ kind: 'drag', stage });
    }
    else if (kind === 'springs') sections.push({ kind: 'springs', stage });
    else if (kind === 'repulsion' || kind === 'tree') {
      // tree stages next to each other walk together: one tile loop with a channel each
      const walk = [];
      while (at < stages.length && (stages[at].builtIn === 'repulsion' || (!stages[at].builtIn && stages[at].shape === 'tree'))) {
        const tree = stages[at];
        const channel = tree.args.channels[0];
        walk.push({ stage: tree, charge: channel.charge, sensitivity: channel.sensitivity, law: laws[tree.name] || null });
        at++;
      }
      at--;
      sections.push({ kind: 'pairs', channels: walk, stage: walk[0].stage });
    } else if (kind === 'node') sections.push({ kind: 'formula', stage });
    else if (kind === 'sum') sections.push({ kind: 'sum', stage, sum: sumInfo[stage.name] });
    else if (kind === 'integrate') sections.push({ kind: stage.args.integrator === 'fire' ? 'fire' : 'euler', stage });
  }
  if (sections.filter(s => s.kind === 'euler' || s.kind === 'fire').length !== 1) {
    return { refusal: 'WebGPU needs exactly one integrate stage' };
  }
  // tree passes read other bodies' positions from the start of the step
  const integrateAt = sections.findIndex(s => s.kind === 'euler' || s.kind === 'fire');
  const late = sections.slice(integrateAt + 1).find(s => s.kind === 'pairs');
  if (late) return { refusal: `WebGPU runs tree passes before the integrate stage only (${late.stage.name} comes after it)` };
  // A tree pass joins the walk before it when the stages between only add to the force and
  // don't read it (drag, springs, addRepulsion's default place before integrate): the order of
  // additions is all that changes
  for (let k = 0; k < sections.length; k++) {
    if (sections[k].kind !== 'pairs') continue;
    let p = k - 1;
    while (p >= 0 && sections[p].kind !== 'pairs' && onlyAddsForce(sections[p])) p--;
    if (p >= 0 && sections[p].kind === 'pairs') {
      sections[p].channels.push(...sections[k].channels);
      sections.splice(k, 1);
      k--;
    }
  }
  // Above N* in 2D and 3D, the first group of tree passes walks the pyramid
  const walks = sections.filter(s => s.kind === 'pairs');
  const pyramidWalk = n > smallGraph && D <= 3 && walks.length ? walks[0] : null;
  if (pyramidWalk) pyramidWalk.kind = 'tree';
  if (n > MAX_PAIRS && sections.some(s => s.kind === 'pairs')) {
    return {
      refusal: D > 3
        ? `WebGPU runs repulsion in ${D}D as exact pairs, for up to ${MAX_PAIRS.toLocaleString('en-US')} bodies (its grid pyramid is 2D and 3D); this layout has ${n.toLocaleString('en-US')}`
        : `WebGPU's grid pyramid takes one group of tree passes per step above ${MAX_PAIRS.toLocaleString('en-US')} bodies; this step has ${walks.length} (passes next to each other walk together)`,
    };
  }

  // Sums that read nothing an earlier stage of the step writes go first, in one pass
  const written = new Set();
  const hoisted = [];
  const rest = [];
  sections.forEach(section => {
    if (section.kind === 'sum' && !readsAny(section.stage, written)) hoisted.push(section);
    else rest.push(section);
    writesOf(section).forEach(column => written.add(column));
  });

  // --- columns ------------------------------------------------------------------------------
  const used = new Set(['pos', 'velocity', 'force', 'pinned']);
  const writtenByStages = new Set();
  sections.forEach(section => {
    readsOf(section).forEach(column => used.add(column));
    writesOf(section).forEach(column => { used.add(column); writtenByStages.add(column); });
  });
  const cap = capacity(n);
  const columns = Object.create(null);
  let sSize = 0, hSize = 0;
  const place = (name, buffer, width) => {
    const size = cap * width;
    const offset = buffer === 'S' ? sSize : hSize;
    if (buffer === 'S') sSize += size; else hSize += size;
    columns[name] = { name, width, buffer, offset, type: columnInfo[name] ? columnInfo[name].type : 'f64' };
  };
  used.forEach(name => {
    if (name === 'pos') { columns.pos = { name: 'pos', width: D, buffer: 'X', offset: 0, type: 'f64' }; return; }
    const info = columnInfo[name];
    // the adaptive time step's counters: formulas don't see them, and it does not run here
    if (!info || info.hidden) return;
    const width = info.width === 'D' ? D : info.width;
    const inS = name === 'velocity' || name === 'force' || writtenByStages.has(name);
    place(name, inS ? 'S' : 'H', width);
  });

  // Results of sums, FIRE's state and partial sums at the end of S
  const groups = Math.max(1, Math.ceil(cap / THREADS));
  const sums = Object.create(null);
  sections.forEach(section => {
    if (section.kind !== 'sum') return;
    const width = section.sum.width === 'D' ? D : section.sum.width;
    sums[section.stage.name] = { name: section.stage.name, width, offset: sSize };
    sSize += width;
  });
  const fire = sSize; sSize += 4;
  const firePartials = sSize; sSize += 4 * THREADS;
  const partials = sSize;
  const sumWidth = Object.values(sums).reduce((total, sum) => total + sum.width, 0);
  sSize += Math.max(4, groups * Math.max(1, sumWidth));

  // --- the slot of numbers per step -----------------------------------------------------------
  const slot = createSlotTable();
  SETTING_VALUES.forEach(key => slot.add('setting', key));
  // the f64 origin of positions on the device: formulas that read pos itself add it back
  for (let k = 0; k < D; k++) slot.add('setting', 'origin_' + k);
  sections.forEach(section => {
    if (section.kind === 'pairs' || section.kind === 'tree') {
      section.channels.forEach(channel => {
        if (channel.stage.when) channel.gate = slot.add('gate', channel.stage.name);
        if (channel.law) channel.values = slot.addLaw(channel.stage.name, channel.law);
      });
      return;
    }
    const stage = section.stage;
    if (stage.when) section.gate = slot.add('gate', stage.name);
    section.params = Object.create(null);
    stage.params.forEach(param => { section.params[param.name] = slot.add('param', stage.name, param.name); });
    // formulas read built in values as their stage gets them; built in stages read the settings
    section.builtIns = Object.create(null);
    if (!stage.builtIn) stage.builtIns.forEach(name => { section.builtIns[name] = slot.add('builtIn', stage.name, name); });
  });

  // --- kernels --------------------------------------------------------------------------------
  const kernels = [];
  let current = null;
  let afterIntegrate = false;
  const open = () => {
    current = { kind: 'node', name: 'STEP' + kernels.length, sections: [], afterIntegrate, sums: [] };
    kernels.push(current);
  };
  const close = () => { current = null; };
  if (hoisted.length) {
    kernels.push({ kind: 'node', name: 'SUMS', sections: hoisted, afterIntegrate: false, sums: hoisted.map(s => sums[s.stage.name]), hoisted: true });
    kernels.push({ kind: 'reduce', name: 'SUMS_REDUCE', sums: hoisted.map(s => sums[s.stage.name]), gates: hoisted.map(s => s.gate) });
  }
  for (let k = 0; k < rest.length; k++) {
    const section = rest[k];
    if (section.kind === 'fire') {
      if (current) close();
      kernels.push({ kind: 'fireReduce', name: 'FIRE_REDUCE' }, { kind: 'fireState', name: 'FIRE_STATE' });
      // FIRE moves bodies from the step's positions; later sections read the new ones
      open();
      current.sections.push(section);
      afterIntegrate = true;
      continue;
    }
    if (!current) open();
    // a tile loop reads other rows' charges, and the pyramid is built from them before its node
    // kernel: a node section earlier in this kernel must not have written them (rule 2); the
    // pyramid also orders the threads of its kernel, so a kernel holds at most one
    if (section.kind === 'pairs' || section.kind === 'tree') {
      const kernelWrites = new Set();
      current.sections.forEach(s => writesOf(s).forEach(column => kernelWrites.add(column)));
      if (section.channels.some(c => kernelWrites.has(c.charge))) { close(); open(); }
    }
    if (section.kind === 'tree') current.tree = section;
    current.sections.push(section);
    if (section.kind === 'euler') afterIntegrate = true;
    if (section.kind === 'sum') {
      current.sums.push(sums[section.stage.name]);
      // a later stage reads the result in this step: the kernel ends, the partials are added
      const readLater = rest.slice(k + 1).some(s => s.stage && s.stage.sums && s.stage.sums.indexOf(section.stage.name) >= 0);
      const nextIsSum = k + 1 < rest.length && rest[k + 1].kind === 'sum';
      if (readLater && !nextIsSum) {
        kernels.push({ kind: 'reduce', name: 'REDUCE' + kernels.length, sums: current.sums.slice(), gates: current.sections.filter(s => s.kind === 'sum').map(s => s.gate) });
        close();
      }
    }
  }
  // sums nobody reads in this step still get their results, at the end of the step
  kernels.forEach((kernel, index) => {
    if (kernel.kind !== 'node' || !kernel.sums.length || kernel.hoisted) return;
    const next = kernels[index + 1];
    if (!next || next.kind !== 'reduce') {
      kernels.splice(index + 1, 0, { kind: 'reduce', name: 'REDUCE' + index, sums: kernel.sums.slice(), gates: kernel.sections.filter(s => s.kind === 'sum').map(s => s.gate) });
    }
  });
  kernels.forEach((kernel, index) => { if (kernel.kind === 'node' && !kernel.hoisted) kernel.name = 'STEP' + index; });

  // the stages each kernel computes, for error reports
  const kernelStages = Object.create(null);
  kernels.forEach(kernel => {
    const names = [];
    (kernel.sections || []).forEach(section => {
      if (section.kind === 'pairs' || section.kind === 'tree') section.channels.forEach(c => names.push(c.stage.name));
      else names.push(section.stage.name);
    });
    if (kernel.kind === 'reduce') kernel.sums.forEach(sum => names.push(sum.name));
    if (kernel.kind === 'fireReduce' || kernel.kind === 'fireState') names.push(integrateName(sections));
    kernelStages[kernel.name] = names;
  });
  const done = slot.done();

  // The pyramid reads positions and charges from this plan's buffers, and the law numbers and
  // gravity from the step's slot
  let pyramid = null;
  if (pyramidWalk) {
    const colRef = name => {
      const column = columns[name];
      return { buffer: column.buffer, at: row => `${column.buffer}[${column.offset}u + ${row}]` };
    };
    pyramid = planPyramid({
      D, n, limits: options.limits, warn: options.warn,
      channels: pyramidWalk.channels.map(c => ({ stage: c.stage.name, law: c.law, centroid: 'own', charge: colRef(c.charge) })),
      pos: { buffer: 'X', at: (row, k) => `X[${row} * ${D}u + ${k}u]` },
      values: {
        decl: binding => `@group(0) @binding(${binding}) var<uniform> V: array<vec4f, ${done.floats / 4}>;`,
        law: (c, k) => slotValue(pyramidWalk.channels[c].values + k),
        gravity: slotValue(slot.add('setting', 'gravity')),
      },
    });
    if (pyramid.refusal) return { refusal: pyramid.refusal };
    pyramidWalk.pyramid = pyramid;
    Object.keys(pyramid.kernels).forEach(name => { kernelStages[name] = pyramidWalk.channels.map(c => c.stage.name); });
  }

  // charges and positions of a tile: D + one per distinct charge column
  let tile = 0;
  sections.forEach(section => {
    if (section.kind === 'pairs') tile = Math.max(tile, D + new Set(section.channels.map(c => c.charge)).size);
  });

  return {
    template: 'generic',
    regime: pyramidWalk ? 'pyramid' : 'pairs',
    pyramid,
    D,
    nodes: n,
    links: program.spaces.links,
    cap,
    groups,
    columns,
    sums,
    sumWidth,
    S: { size: sSize, fire, firePartials, partials },
    H: { size: hSize },
    slot: done,
    sections,
    skipped,
    kernelList: kernels,
    kernelStages,
    tileFloats: tile,
    fire: sections.some(s => s.kind === 'fire'),
    springs: sections.some(s => s.kind === 'springs'),
    inertia: integrateArgs(sections).inertia,
  };
}

/**
 * Rows a generic plan keeps room for: the graph can grow by a quarter before buffers and
 * pipelines (whose WGSL holds the offsets) are made again.
 */
export function capacity(n) {
  return Math.max(THREADS, Math.ceil(Math.ceil(n * 1.25) / THREADS) * THREADS);
}

function integrateName(sections) {
  const integrate = sections.find(s => s.kind === 'euler' || s.kind === 'fire');
  return integrate ? integrate.stage.name : 'integrate';
}

function integrateArgs(sections) {
  const integrate = sections.find(s => s.kind === 'euler' || s.kind === 'fire');
  return integrate ? integrate.stage.args : { inertia: 'mass' };
}

// Body columns a section reads (own or other rows)
export function readsOf(section) {
  const out = new Set();
  if (section.kind === 'pairs' || section.kind === 'tree') {
    section.channels.forEach(c => { out.add(c.charge); out.add(c.sensitivity); });
    out.add('pos'); out.add('pinned');
    return out;
  }
  section.stage.reads.forEach(read => { if (read.space === 'nodes') out.add(read.column); });
  if (section.kind === 'euler' || section.kind === 'fire') out.add(section.stage.args.inertia);
  return out;
}

// Body columns a section writes
export function writesOf(section) {
  const out = new Set();
  if (section.kind === 'pairs' || section.kind === 'tree') { out.add('force'); return out; }
  section.stage.writes.forEach(write => { if (write.space === 'nodes') out.add(write.column); });
  return out;
}

// True for a section that writes nothing but additions to the force, and does not read it
function onlyAddsForce(section) {
  if (section.kind === 'sum' || section.kind === 'euler' || section.kind === 'fire' || !section.stage) return false;
  const stage = section.stage;
  return stage.writes.every(write => write.space !== 'nodes' || (write.column === 'force' && write.mode === 'add')) &&
    !stage.reads.some(read => read.space === 'nodes' && read.column === 'force');
}

function readsAny(stage, columns) {
  return stage.reads.some(read => read.space === 'nodes' && columns.has(read.column));
}

// Where each number of a step's slot lives: settings first, then gates, params, built in values
// and laws' numbers, in the order the plan asks for them
function createSlotTable() {
  const entries = [];
  const byKey = Object.create(null);
  return {
    add(kind, stage, name) {
      const key = kind + ':' + stage + (name === undefined ? '' : ':' + name);
      if (byKey[key] !== undefined) return byKey[key];
      byKey[key] = entries.length;
      entries.push({ kind, stage, name, index: entries.length });
      return byKey[key];
    },
    addLaw(stage, law) {
      const key = 'law:' + stage;
      if (byKey[key] !== undefined) return byKey[key];
      const first = entries.length;
      byKey[key] = first;
      const count = lawCount(law);
      for (let k = 0; k < count; k++) entries.push({ kind: 'law', stage, name: k, index: entries.length });
      return first;
    },
    done() {
      const floats = Math.max(SLOT_FLOATS, Math.ceil(entries.length / SLOT_FLOATS) * SLOT_FLOATS);
      return { entries, floats, bytes: floats * 4 };
    },
  };
}

// The numbers a law reads (see writeLawValues in ../wgsl/print.js)
function lawCount(law) {
  const hoisted = Object.keys(law.values).filter(key => /^\$h\d+$/.test(key)).length;
  return law.paramNames.length + hoisted + (law.hasRange ? 1 : 0);
}

