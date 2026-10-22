// The generic plan: from the step as data (simulator.program()) to sections of code in CPU stage
// order, cut into kernels by the fusion rules (design section 7), plus where every column lives
// and what each step's slot of numbers holds. emit.js prints the kernels, engine.js runs them.
//
// Regime 'pairs': every tree pass is exact all-pairs inside a node kernel, over tiles of 256
// bodies in workgroup memory. Up to the small-graph size N* the whole step is then one kernel;
// sums and FIRE add their own small kernels. In 4 or more dimensions it runs up to 16,384 bodies.
// Regime 'pyramid' (2D and 3D above N*, which is 2,560 in 3D): the first group of tree passes is
// the generic grid pyramid (../pyramid): its structure dispatches run right before the node kernel
// that holds its section, and that kernel runs its threads in the pyramid's cell order (thread t
// works on row tree_row(t)), so bodies near each other in space run together. Further groups stay
// exact pairs.
//
// Links (design section 6.3). Every link sits in the rows of both its bodies (CSR), with its index
// and the body's role (from or to). A link stage that pulls, or adds into body columns, is a
// gather in a node kernel: each body evaluates the formula for its links with the true roles and
// keeps its own end's share. Above N*, a hub's thousands of links would keep one thread busy while
// its workgroup waits: there LINK_CHUNKS goes through chunks of 8 links of a row first, a thread
// each, and the body's section adds its chunks in order. A link stage that only writes link
// columns runs a thread per link, in a link kernel of its own.
//
// Sums per group (section 6.5): a node section writes each row's value, then GROUP_RUNS adds up
// runs of up to 256 rows of one group (in an order the host sorts by group) and GROUP_SUM adds
// each group's runs in order.
//
// Buffers (one binding each per kernel, the same layout for every kernel):
//   P  uniform: n, workgroups, FIRE's workgroups, links (written when the data is built)
//   V  uniform, at a dynamic offset: the slot of the step being run (see slots below)
//   S  storage read_write: velocity, force, node columns that stages write, link columns that
//      stages write (link order), sum results, per-row values of sums per group, FIRE state,
//      partial sums
//   H  storage read: node columns only the host writes (mass, pinned, ...), and link columns only
//      the host writes, in CSR order (each link at both of its ends)
//   L  storage read (u32): [first entry of each row (n + 1) | other body of each entry (2m) | link
//      and role of each entry (2m) | entry of each link at its from end (m) | from (m) | to (m) |
//      where the blocks below start (1 + group columns) | the chunks of links | a block per group
//      column (sums per group)]
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
// Rows of one group that one thread of GROUP_RUNS adds up
export const GROUP_RUN = 256;
// Links of a row that one thread of LINK_CHUNKS goes through, above N* (today's SPRINGS does 8)
export const LINK_CHUNK = 8;
// A body with more links than this makes gathers go through chunks
const HUB_DEGREE = 64;
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
 * printer's warnings, `options.smallGraph` overrides N* (for measurements). `options.data` holds
 * what the plan needs to know of the store: {linksDefault: no link has its own length or
 * stiffness, groups: {column: number of groups}}.
 */
export function genericPlan(program, laws, options = {}) {
  const D = program.dims, n = program.spaces.nodes, m = program.spaces.links;
  const data = options.data || { linksDefault: true, groups: {} };
  const smallGraph = options.smallGraph || (D === 3 ? SMALL_GRAPH_3D : SMALL_GRAPH);
  // above N*, when a body has many links, gathers go through chunks of links first (on graphs
  // without hubs going through a row's links in place is faster: 10k 1.07 against 1.12 of
  // today's step, 100k 1.05 against 1.08; megaStars 1.28 against 3.67)
  const chunked = n > smallGraph && (data.maxDegree === undefined || data.maxDegree > HUB_DEGREE);
  const stages = physicsStages(program);
  const columnInfo = Object.create(null);
  program.columns.nodes.forEach(column => { columnInfo[column.name] = column; });
  const linkInfo = Object.create(null);
  (program.columns.links || []).forEach(column => { linkInfo[column.name] = column; });
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
    } else if (kind === 'link') {
      const pulls = stage.writes.some(write => write.via === 'pull');
      const adds = stage.writes.some(write => write.space === 'nodes' && write.end);
      sections.push({ kind: pulls || adds ? 'gather' : 'linkset', stage, pulls });
    } else if (kind === 'node') sections.push({ kind: 'formula', stage });
    else if (kind === 'sum') {
      const sum = sumInfo[stage.name];
      sections.push({ kind: sum.group ? 'groupsum' : 'sum', stage, sum });
    } else if (kind === 'integrate') sections.push({ kind: stage.args.integrator === 'fire' ? 'fire' : 'euler', stage });
  }
  if (sections.filter(s => s.kind === 'euler' || s.kind === 'fire').length !== 1) {
    return { refusal: 'WebGPU needs exactly one integrate stage' };
  }
  // tree passes and links read other bodies' positions from the start of the step
  const integrateAt = sections.findIndex(s => s.kind === 'euler' || s.kind === 'fire');
  const late = sections.slice(integrateAt + 1).find(s => s.kind === 'pairs' || s.kind === 'gather' || s.kind === 'springs' || (s.kind === 'linkset' && readsPositions(s)));
  if (late) return { refusal: `WebGPU runs tree passes and link stages that read positions before the integrate stage only (${late.stage.name} comes after it)` };
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

  // Sums that read nothing an earlier stage of the step writes (no column, no sum) go first, in
  // one pass
  const written = new Set(), summed = new Set();
  const hoisted = [];
  const rest = [];
  sections.forEach(section => {
    const isSum = section.kind === 'sum' || section.kind === 'groupsum';
    if (isSum && !readsAny(section.stage, written) && !section.stage.sums.some(name => summed.has(name))) hoisted.push(section);
    else rest.push(section);
    writesOf(section).forEach(column => written.add(column));
    if (isSum) summed.add(section.stage.name);
  });

  // --- node columns -------------------------------------------------------------------------
  const used = new Set(['pos', 'velocity', 'force', 'pinned']);
  const writtenByStages = new Set();
  sections.forEach(section => {
    readsOf(section).forEach(column => used.add(column));
    writesOf(section).forEach(column => { used.add(column); writtenByStages.add(column); });
  });
  const cap = capacity(n), capL = capacity(m);
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

  // --- link columns: the host's in CSR order in H, the stages' in link order in S --------------
  const usedLinks = new Set(), linkWritten = new Set();
  sections.forEach(section => {
    if (section.kind === 'springs') {
      // the stock springs read the links' own lengths and stiffness once some link has them
      if (!data.linksDefault) { usedLinks.add('length'); usedLinks.add('coefficient'); }
      return;
    }
    if (section.kind !== 'gather' && section.kind !== 'linkset') return;
    section.stage.reads.forEach(read => {
      // while every link has the defaults, `length` and `coefficient` are the settings
      if (read.space === 'links' && !(data.linksDefault && (read.column === 'length' || read.column === 'coefficient'))) usedLinks.add(read.column);
    });
    section.stage.writes.forEach(write => { if (write.space === 'links') { usedLinks.add(write.column); linkWritten.add(write.column); } });
  });
  // a column a stage writes is read where it is written, also by stages that only read it
  sections.forEach(section => {
    if (section.kind !== 'gather' && section.kind !== 'linkset') return;
    section.stage.reads.forEach(read => { if (read.space === 'links' && linkWritten.has(read.column)) usedLinks.add(read.column); });
  });
  // a column a stage writes is read from where it writes it, by the springs too
  if (sections.some(s => s.kind === 'springs')) ['length', 'coefficient'].forEach(name => { if (linkWritten.has(name)) usedLinks.add(name); });
  const linkColumns = Object.create(null);
  usedLinks.forEach(name => {
    const info = linkInfo[name];
    const stageWritten = linkWritten.has(name) || (info && /^stage:/.test(info.writer || ''));
    if (stageWritten) {
      linkColumns[name] = { name, buffer: 'S', order: 'link', offset: sSize, type: info ? info.type : 'f64' };
      sSize += capL;
    } else {
      linkColumns[name] = { name, buffer: 'H', order: 'csr', offset: hSize, type: info ? info.type : 'f64' };
      hSize += 2 * capL;
    }
  });
  // what the stock springs read: the settings while every link has the defaults
  sections.forEach(section => { if (section.kind === 'springs') section.own = !!(linkColumns.length || linkColumns.coefficient); });

  // chunked gathers: per chunk, the force it adds and what it adds into each column
  const maxChunks = Math.ceil(2 * m / LINK_CHUNK) + n;
  sections.forEach(section => {
    if ((section.kind !== 'springs' && section.kind !== 'gather') || !chunked) return;
    const parts = [];
    if (section.kind === 'springs' || section.pulls) parts.push({ column: 'force', width: D });
    if (section.kind === 'gather') {
      section.stage.writes.forEach(write => {
        if (write.space === 'nodes' && write.end && write.column !== 'force' && !parts.some(p => p.column === write.column)) {
          parts.push({ column: write.column, width: columns[write.column].width });
        }
      });
    }
    const width = parts.reduce((total, part) => total + part.width, 0);
    section.chunks = { offset: sSize, width, parts };
    sSize += maxChunks * width;
  });

  // --- sums: results, per-row values of sums per group, FIRE's state, partial sums -------------
  const groups = Math.max(1, Math.ceil(cap / THREADS));
  const sums = Object.create(null);
  const groupColumns = [];
  sections.forEach(section => {
    if (section.kind !== 'sum' && section.kind !== 'groupsum') return;
    const width = section.sum.width === 'D' ? D : section.sum.width;
    const sum = sums[section.stage.name] = { name: section.stage.name, width, offset: sSize, grouped: section.kind === 'groupsum' };
    if (!sum.grouped) { sSize += width; return; }
    sum.column = section.sum.group;
    sum.count = data.groups[sum.column] || 0;
    if (groupColumns.indexOf(sum.column) < 0) groupColumns.push(sum.column);
    sum.block = groupColumns.indexOf(sum.column);
    sSize += Math.max(1, sum.count) * width;
    sum.rows = sSize; sSize += cap * width;
    // runs: at most one per 256 rows plus one per group
    sum.runs = sSize; sSize += (Math.ceil(n / GROUP_RUN) + sum.count + 1) * width;
  });
  const fire = sSize; sSize += 4;
  const firePartials = sSize; sSize += 4 * THREADS;
  const partials = sSize;
  const sumWidth = Object.values(sums).filter(sum => !sum.grouped).reduce((total, sum) => total + sum.width, 0);
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
    current = { kind: 'node', name: '', sections: [], afterIntegrate, sums: [], groupSums: [] };
    kernels.push(current);
  };
  // A node kernel ends: its sums get their results right after it
  const close = () => {
    if (current) reductions(current);
    current = null;
  };
  const reductions = kernel => {
    if (kernel.sums.length) {
      kernels.push({ kind: 'reduce', name: kernel.hoisted ? 'SUMS_REDUCE' : '', sums: kernel.sums.slice(), gates: kernel.sections.filter(s => s.kind === 'sum').map(s => s.gate) });
    }
    groupColumns.forEach(column => {
      const list = kernel.groupSums.filter(sum => sum.column === column);
      if (!list.length) return;
      const gates = list.map(sum => kernel.sections.find(s => s.stage && s.stage.name === sum.name).gate);
      kernels.push({ kind: 'groupRuns', name: '', column, sums: list, gates });
      kernels.push({ kind: 'groupSum', name: '', column, sums: list, gates });
    });
  };
  if (hoisted.length) {
    current = {
      kind: 'node', name: 'SUMS', sections: hoisted, afterIntegrate: false, hoisted: true,
      sums: hoisted.filter(s => s.kind === 'sum').map(s => sums[s.stage.name]),
      groupSums: hoisted.filter(s => s.kind === 'groupsum').map(s => sums[s.stage.name]),
    };
    kernels.push(current);
    close();
  }
  for (let k = 0; k < rest.length; k++) {
    const section = rest[k];
    if (section.kind === 'fire') {
      close();
      kernels.push({ kind: 'fireReduce', name: 'FIRE_REDUCE' }, { kind: 'fireState', name: 'FIRE_STATE' });
      // FIRE moves bodies from the step's positions; later sections read the new ones
      open();
      current.sections.push(section);
      afterIntegrate = true;
      continue;
    }
    if (section.kind === 'linkset') {
      // a thread per link: a kernel of its own, shared with the link stages right after it
      const previous = kernels[kernels.length - 1];
      if (current || !previous || previous.kind !== 'link') {
        close();
        kernels.push({ kind: 'link', name: '', sections: [] });
      }
      kernels[kernels.length - 1].sections.push(section);
      continue;
    }
    if (!current) open();
    // a tile loop, a gather and the pyramid read other rows of some columns (the pyramid before
    // its kernel): a node section earlier in this kernel must not have written them (rule 2); the
    // pyramid also orders the threads of its kernel, so a kernel holds at most one
    const others = otherReadsOf(section);
    if (others.size) {
      const kernelWrites = new Set();
      current.sections.forEach(s => writesOf(s).forEach(column => kernelWrites.add(column)));
      if ([...others].some(column => kernelWrites.has(column)) || (section.kind === 'tree' && current.tree)) { close(); open(); }
    }
    // the chunks of a gather run before its node kernel: they must not read what it writes
    if (section.chunks) {
      const kernelWrites = new Set();
      current.sections.forEach(s => writesOf(s).forEach(column => kernelWrites.add(column)));
      if ([...readsOf(section)].some(column => kernelWrites.has(column))) { close(); open(); }
      kernels.splice(kernels.indexOf(current), 0, { kind: 'chunks', name: '', section, gates: [section.gate] });
    }
    if (section.kind === 'tree') current.tree = section;
    current.sections.push(section);
    if (section.kind === 'euler') afterIntegrate = true;
    if (section.kind === 'sum') current.sums.push(sums[section.stage.name]);
    if (section.kind === 'groupsum') current.groupSums.push(sums[section.stage.name]);
    if (section.kind === 'sum' || section.kind === 'groupsum') {
      // a later stage reads the result in this step: the kernel ends, the results are added up
      const readLater = rest.slice(k + 1).some(s => s.stage && s.stage.sums && s.stage.sums.indexOf(section.stage.name) >= 0);
      const nextIsSum = k + 1 < rest.length && (rest[k + 1].kind === 'sum' || rest[k + 1].kind === 'groupsum');
      if (readLater && !nextIsSum) close();
    }
  }
  close();
  // names in step order
  kernels.forEach((kernel, index) => {
    if (kernel.name) return;
    const prefix = { node: 'STEP', reduce: 'REDUCE', link: 'LINKS', groupRuns: 'GROUP_RUNS', groupSum: 'GROUP_SUM', chunks: 'LINK_CHUNKS' }[kernel.kind];
    kernel.name = prefix + index;
  });

  // the stages each kernel computes, for error reports
  const kernelStages = Object.create(null);
  kernels.forEach(kernel => {
    const names = [];
    (kernel.sections || []).forEach(section => {
      if (section.kind === 'pairs' || section.kind === 'tree') section.channels.forEach(c => names.push(c.stage.name));
      else names.push(section.stage.name);
    });
    if (kernel.kind === 'reduce' || kernel.kind === 'groupRuns' || kernel.kind === 'groupSum') kernel.sums.forEach(sum => names.push(sum.name));
    if (kernel.kind === 'chunks') names.push(kernel.section.stage.name);
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
    links: m,
    cap,
    capL,
    groups,
    columns,
    linkColumns,
    groupColumns,
    chunked,
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
    // what of the store this plan depends on: a change of it needs a new plan
    dataKey: JSON.stringify(data),
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
  if (section.kind === 'springs') out.add('pos');
  return out;
}

// Body columns a section reads in other bodies' rows
export function otherReadsOf(section) {
  const out = new Set();
  if (section.kind === 'pairs' || section.kind === 'tree') {
    section.channels.forEach(c => out.add(c.charge));
    out.add('pos');
    return out;
  }
  if (section.kind === 'springs') { out.add('pos'); return out; }
  if (!section.stage) return out;
  section.stage.reads.forEach(read => { if (read.space === 'nodes' && (read.rows === 'other' || read.end)) out.add(read.column); });
  return out;
}

// Body columns a section writes
export function writesOf(section) {
  const out = new Set();
  if (section.kind === 'pairs' || section.kind === 'tree' || section.kind === 'springs') { out.add('force'); return out; }
  section.stage.writes.forEach(write => { if (write.space === 'nodes') out.add(write.column); });
  return out;
}

// A link stage that reads positions (its formula reads r)
function readsPositions(section) {
  return section.stage.reads.some(read => read.space === 'nodes' && read.column === 'pos');
}

// True for a section that writes nothing but additions to the force, and does not read it
function onlyAddsForce(section) {
  if (section.kind === 'sum' || section.kind === 'groupsum' || section.kind === 'euler' || section.kind === 'fire' || !section.stage) return false;
  const stage = section.stage;
  return stage.writes.every(write => (write.space === 'nodes' && write.column === 'force' && write.mode === 'add')) &&
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
