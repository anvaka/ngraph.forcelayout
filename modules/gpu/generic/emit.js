// WGSL of a generic plan (plan.js). A node kernel runs one thread per body: it loads the columns
// its sections touch into locals, runs the sections in CPU stage order, and writes back what
// they changed. Formulas print through the module's WGSL printer, so user names never meet a
// WGSL word, and vectors are unrolled to D numbers (D is in the text).
//
// A thread past n works on row 0 and writes nothing; it stays to the end, because tile loops and
// reductions have workgroup barriers (WGSL uniformity). The kernel that holds the pyramid's section
// runs its threads in the pyramid's order: thread t works on row tree_row(t).
import formula from '../../../lib/formula.js';
import WGSL, { emitLaw, lawPrologue } from '../wgsl/print.js';
import { THREADS, readsOf, writesOf, slotValue } from './plan.js';

const AXES = 'xyzw';

/**
 * The WGSL of every kernel of `plan`, by kernel name. `printer` is a WGSL printer (its warnings
 * go where the caller wants them).
 */
export function kernelCode(plan, printer = WGSL) {
  const out = {};
  plan.kernelList.forEach(kernel => {
    if (kernel.kind === 'node') out[kernel.name] = nodeKernel(plan, kernel, printer);
    else if (kernel.kind === 'reduce') out[kernel.name] = reduceKernel(plan, kernel);
    else if (kernel.kind === 'fireReduce') out[kernel.name] = fireReduceKernel(plan);
    else if (kernel.kind === 'fireState') out[kernel.name] = fireStateKernel(plan);
  });
  return out;
}

// The bindings every kernel of a plan shares (one pipeline layout for all of them)
function header(plan) {
  return `struct Params { n: u32, groups: u32, fireGroups: u32, links: u32 };
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<uniform> V: array<vec4f, ${plan.slot.floats / 4}>;
@group(0) @binding(2) var<storage, read_write> S: array<f32>;
@group(0) @binding(3) var<storage, read> H: array<f32>;
@group(0) @binding(4) var<storage, read> L: array<u32>;
@group(0) @binding(5) var<storage, read> X: array<f32>;
@group(0) @binding(6) var<storage, read_write> Y: array<f32>;
`;
}

export const BINDINGS = ['uniform', 'dynamic', 'storage', 'read', 'read', 'read', 'storage'];
// The kernel with the pyramid's section also reads its uniform and three buffers
const TREE_BINDINGS = BINDINGS.concat(['uniform', 'read', 'read', 'read']);

/**
 * The bindings of a kernel of a plan (see device.js getPipeline())
 */
export function bindingsOf(kernel) {
  return kernel.tree ? TREE_BINDINGS : BINDINGS;
}

function u32(value) {
  return value + 'u';
}

// Where row `row` of `column` lives: an expression for each of its numbers
function columnRef(plan, column, row, afterIntegrate) {
  const c = plan.columns[column];
  const out = [];
  for (let k = 0; k < c.width; k++) {
    const at = c.width === 1 ? `${u32(c.offset)} + ${row}` : `${u32(c.offset)} + ${row} * ${u32(c.width)} + ${u32(k)}`;
    const buffer = c.buffer === 'X' ? (afterIntegrate ? 'Y' : 'X') : c.buffer;
    out.push(`${buffer}[${at}]`);
  }
  return out;
}

function local(column, k, width) {
  return width === 1 ? `c_${column}` : `c_${column}_${k}`;
}

function locals(plan, column) {
  const width = plan.columns[column].width;
  const out = [];
  for (let k = 0; k < width; k++) out.push(local(column, k, width));
  return out;
}

function settingsLines(plan) {
  return plan.slot.entries.filter(e => e.kind === 'setting').map(e => `  let s_${e.stage} = ${slotValue(e.index)};`).join('\n');
}

// ---------------------------------------------------------------------------------------------
// Node kernels
// ---------------------------------------------------------------------------------------------

function nodeKernel(plan, kernel, printer) {
  const D = plan.D;
  const touched = new Set(), modified = new Set();
  let integrates = false;
  kernel.sections.forEach(section => {
    readsOf(section).forEach(column => { if (plan.columns[column]) touched.add(column); });
    writesOf(section).forEach(column => { if (plan.columns[column]) { touched.add(column); modified.add(column); } });
    if (section.kind === 'euler' || section.kind === 'fire') integrates = true;
  });
  const hasTiles = kernel.sections.some(s => s.kind === 'pairs');
  const lines = [];
  const decls = [header(plan)];
  if (hasTiles) {
    for (let a = 0; a < Math.ceil(plan.tileFloats / 4); a++) decls.push(`var<workgroup> tile${a}: array<vec4f, ${THREADS}>;`);
  }
  if (kernel.sums.length) decls.push(`var<workgroup> red: array<vec4f, ${THREADS}>;`);
  decls.push(NUDGE(D));
  if (kernel.tree) {
    const tree = kernel.tree.pyramid.section;
    decls.push(tree.uniform.struct, tree.uniform.decl(BINDINGS.length));
    tree.bindings.forEach((b, k) => decls.push(`@group(0) @binding(${BINDINGS.length + 1 + k}) var<storage, ${b.access}> ${b.name}: ${b.type};`));
    decls.push(tree.declarations);
  }

  lines.push(`@compute @workgroup_size(${THREADS})`);
  lines.push('fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {');
  if (kernel.tree) {
    lines.push('  let t = gid.x;');
    lines.push('  let live = t < P.n;');
    lines.push('  var i = 0u;');
    lines.push(`  if (live) { i = ${kernel.tree.pyramid.section.row('t')}; }`);
    lines.push('  let row = i;');
  } else {
    lines.push('  let i = gid.x;');
    lines.push('  let live = i < P.n;');
    lines.push('  let row = select(0u, i, live);');
  }
  lines.push(settingsLines(plan));
  // own columns, once
  touched.forEach(column => {
    const refs = columnRef(plan, column, 'row', kernel.afterIntegrate);
    const keep = modified.has(column) || column === 'pos' ? 'var' : 'let';
    locals(plan, column).forEach((name, k) => lines.push(`  ${keep} ${name} = ${refs[k]};`));
  });
  // sums the sections read
  const sumsRead = new Set();
  kernel.sections.forEach(section => { if (section.stage && section.stage.sums) section.stage.sums.forEach(name => sumsRead.add(name)); });
  sumsRead.forEach(name => {
    const sum = plan.sums[name];
    for (let k = 0; k < sum.width; k++) lines.push(`  let g_${name}_${k} = S[${u32(sum.offset + k)}];`);
  });
  // what this kernel's sums add up, per row
  kernel.sums.forEach((sum, s) => { for (let k = 0; k < sum.width; k++) lines.push(`  var sv${s}_${k} = 0.0;`); });

  kernel.sections.forEach((section, index) => {
    lines.push(`  // ${section.kind}${section.stage ? ': ' + section.stage.name : ''}`);
    lines.push(sectionCode(plan, kernel, section, index, printer).map(line => '  ' + line).join('\n'));
  });

  if (kernel.sums.length) lines.push(sumEpilogue(plan, kernel));

  lines.push('  if (live) {');
  modified.forEach(column => {
    const c = plan.columns[column];
    if (c.buffer === 'H') return;
    const refs = columnRef(plan, column, 'i', true);
    locals(plan, column).forEach((name, k) => lines.push(`    ${c.buffer === 'X' ? refs[k] : refs[k]} = ${name};`));
  });
  if (integrates && !modified.has('pos')) {
    const refs = columnRef(plan, 'pos', 'i', true);
    locals(plan, 'pos').forEach((name, k) => lines.push(`    ${refs[k]} = ${name};`));
  }
  lines.push('  }');
  lines.push('}');
  return decls.join('\n') + '\n' + lines.join('\n') + '\n';
}

function sectionCode(plan, kernel, section, index, printer) {
  const code = sectionBody(plan, kernel, section, index, printer);
  if (section.gate === undefined || section.kind === 'pairs' || section.kind === 'tree') return code;
  // a stage's `when`: the same branch for every thread
  return [`if (${slotValue(section.gate)} != 0.0) {`].concat(code.map(line => '  ' + line), ['}']);
}

function sectionBody(plan, kernel, section, index, printer) {
  const D = plan.D;
  const each = fn => { const out = []; for (let k = 0; k < D; k++) out.push(fn(k)); return out; };
  const pos = locals(plan, 'pos'), velocity = locals(plan, 'velocity'), force = locals(plan, 'force');
  switch (section.kind) {
    case 'clear':
      return [`if (c_pinned == 0.0) { ${force.map(f => f + ' = 0.0;').join(' ')} }`];
    case 'drag':
      return [`if (c_pinned == 0.0) { ${force.map((f, k) => `${f} -= s_dragCoefficient * ${velocity[k]};`).join(' ')} }`];
    case 'springs':
      return springsCode(plan, pos, force);
    case 'pairs':
      return pairsCode(plan, section, index, pos, force, printer);
    case 'tree':
      return treeCode(section, force);
    case 'formula':
      return ['{'].concat(formulaLines(plan, section, index, printer).map(line => '  ' + line), ['}']);
    case 'sum':
      return sumCode(plan, kernel, section, index, printer);
    case 'euler':
    case 'fire': {
      const inertia = plan.columns[section.stage.args.inertia] ? local(section.stage.args.inertia, 0, 1) : 'c_mass';
      const out = ['if (c_pinned == 0.0) {'];
      if (section.kind === 'fire') {
        out.push(`  let fireCv = S[${u32(plan.S.fire + 2)}]; let fireCf = S[${u32(plan.S.fire + 3)}];`);
        out.push('  ' + each(k => `${velocity[k]} = fireCv * ${velocity[k]} + fireCf * ${force[k]};`).join(' '));
      }
      out.push(`  let coeff = s_timeStep / ${inertia};`);
      out.push('  ' + each(k => `${velocity[k]} += coeff * ${force[k]};`).join(' '));
      out.push(`  let speed = sqrt(${velocity.map(v => v + ' * ' + v).join(' + ')});`);
      out.push(`  if (speed > s_maxVelocity) { ${each(k => `${velocity[k]} = s_maxVelocity * ${velocity[k]} / speed;`).join(' ')} }`);
      out.push('  ' + each(k => `${pos[k]} += s_timeStep * ${velocity[k]};`).join(' '));
      out.push('}');
      return out;
    }
  }
  throw new Error('unknown section ' + section.kind);
}

// The stock springs as a gather: every body adds the pull of its own links (the CPU adds each
// link to both ends, which is the same sum)
function springsCode(plan, pos, force) {
  const D = plan.D;
  const d = [], k = [];
  for (let a = 0; a < D; a++) { d.push('d' + a); k.push(a); }
  return [
    'if (live) {',
    '  for (var e = L[row]; e < L[row + 1u]; e++) {',
    '    let j = L[P.n + 1u + e];',
    '    ' + k.map(a => `var d${a} = X[j * ${u32(D)} + ${u32(a)}] - ${pos[a]};`).join(' '),
    `    var r = sqrt(${d.map(x => x + ' * ' + x).join(' + ')});`,
    `    if (r == 0.0) { ${k.map(a => `d${a} = nudge(row, j, ${u32(a)});`).join(' ')} r = sqrt(${d.map(x => x + ' * ' + x).join(' + ')}); }`,
    '    let pull = s_springCoefficient * (r - s_springLength) / r;',
    '    ' + k.map(a => `${force[a]} += pull * d${a};`).join(' '),
    '  }',
    '}',
  ];
}

// Exact repulsion over all pairs: tiles of 256 bodies (their positions and charges) in workgroup
// memory, a channel per tree stage of the walk. A body past n has charge 0. The loop has no
// branch: a pair on the same spot (the body itself, or a body at exactly its position) gets a
// harmless r and adds 0, because its d is 0. Bodies that met another one on their spot then push
// it along nudge(i, j) in a second, rare loop, as today's kernels do.
function pairsCode(plan, section, index, pos, force, printer) {
  const D = plan.D;
  const charges = [];
  section.channels.forEach(c => { if (charges.indexOf(c.charge) < 0) charges.push(c.charge); });
  const slot = f => ({ array: f >> 2, axis: AXES[f & 3] });
  const tileValue = f => `b${f >> 2}.${AXES[f & 3]}`;
  const arrays = Math.ceil((D + charges.length) / 4);
  const axes = Array.from({ length: D }, (_, k) => k);
  const out = ['{'];
  // the laws' numbers, named per channel so that laws with the same parameter names coexist
  section.channels.forEach((c, ch) => {
    if (c.law) out.push('  ' + renameLaw(lawPrologue(c.law, k => slotValue(c.values + k)), ch));
    axes.forEach(k => out.push(`  var w${ch}_${k} = 0.0;`));
  });
  out.push('  var same = 0u;');
  out.push(`  for (var t = 0u; t < P.n; t += ${u32(THREADS)}) {`);
  out.push('    let j = t + li;');
  for (let a = 0; a < arrays; a++) out.push(`    var e${a} = vec4f(0.0);`);
  out.push('    if (j < P.n) {');
  axes.forEach(k => { const s = slot(k); out.push(`      e${s.array}.${s.axis} = X[j * ${u32(D)} + ${u32(k)}];`); });
  charges.forEach((charge, q) => { const s = slot(D + q); out.push(`      e${s.array}.${s.axis} = ${columnRef(plan, charge, 'j', false)[0]};`); });
  out.push('    }');
  for (let a = 0; a < arrays; a++) out.push(`    tile${a}[li] = e${a};`);
  out.push('    workgroupBarrier();');
  // each tile adds up on its own first: f32 error then grows with 256 + n / 256 terms, not n
  section.channels.forEach((c, ch) => axes.forEach(k => out.push(`    var u${ch}_${k} = 0.0;`)));
  // A fixed bound: a body past n has charge 0. A bound from P.n here ran 2.3x slower (harness)
  out.push(`    for (var k = 0u; k < ${u32(THREADS)}; k++) {`);
  for (let a = 0; a < arrays; a++) out.push(`      let b${a} = tile${a}[k];`);
  axes.forEach(k => out.push(`      let d${k} = ${tileValue(k)} - ${pos[k]};`));
  out.push(`      let r2 = ${axes.map(k => `d${k} * d${k}`).join(' + ')};`);
  out.push('      let near = r2 == 0.0;');
  out.push('      same += select(0u, 1u, near);');
  channelTerms(plan, section, charges, tileValue, 'select(r2, 1.0, near)', printer, 'u').forEach(line => out.push('      ' + line));
  out.push('    }');
  section.channels.forEach((c, ch) => out.push('    ' + axes.map(k => `w${ch}_${k} += u${ch}_${k};`).join(' ')));
  out.push('    workgroupBarrier();');
  out.push('  }');
  // bodies on this body's spot (the body itself counts once): the nudge, from the buffers
  out.push('  if (live && same > 1u) {');
  out.push('    for (var j = 0u; j < P.n; j++) {');
  out.push(`      if (j == i || ${axes.map(k => `X[j * ${u32(D)} + ${u32(k)}] != ${pos[k]}`).join(' || ')}) { continue; }`);
  axes.forEach(k => out.push(`      let d${k} = nudge(row, j, ${u32(k)});`));
  out.push(`      let r2 = ${axes.map(k => `d${k} * d${k}`).join(' + ')};`);
  const fromBuffers = charges.map(charge => columnRef(plan, charge, 'j', false)[0]);
  channelTerms(plan, section, charges, q => fromBuffers[q - D], 'r2', printer, 'w').forEach(line => out.push('      ' + line));
  out.push('    }');
  out.push('  }');
  // the stock repulsion and every pass skip pinned bodies
  out.push('  if (c_pinned == 0.0) {');
  section.channels.forEach((c, ch) => {
    const sensitivity = local(c.sensitivity, 0, 1);
    out.push(`    let g${ch} = s_gravity * ${sensitivity};`);
    out.push('    ' + axes.map(k => `${force[k]} += g${ch} * w${ch}_${k};`).join(' '));
  });
  out.push('  }');
  out.push('}');
  return out;
}

// Repulsion from the pyramid (its section's code, see ../pyramid/wgsl.js), on bodies that are
// not pinned. A channel's sensitivity is the body's column, or its sorted charge when that is the
// same column; a gated channel's is 0 on steps where its `when` does not hold.
function treeCode(section, force) {
  const code = section.pyramid.section.code({
    t: 't', i: 'row', force,
    sensitivity: c => {
      const channel = section.channels[c];
      const same = channel.sensitivity === channel.charge;
      const value = same ? `tree_charge(tk, ${u32(c)})` : local(channel.sensitivity, 0, 1);
      if (channel.gate !== undefined) return `select(0.0, ${value}, ${slotValue(channel.gate)} != 0.0)`;
      return same ? null : value;
    },
  });
  return [`if (live && c_pinned == 0.0) ${code}`];
}

// What one other body adds to every channel's sum (`into`: u or w), from d0.. and `r2` (an
// expression); `charge(f)` reads the charge in tile slot f
function channelTerms(plan, section, charges, charge, r2, printer, into) {
  const D = plan.D;
  const out = [`let rr = ${r2};`];
  if (section.channels.some(c => c.law)) out.push('let r = sqrt(rr);');
  if (section.channels.some(c => !c.law)) out.push('let inverseCube = 1.0 / (rr * sqrt(rr));');
  section.channels.forEach((c, ch) => {
    const q = charge(D + charges.indexOf(c.charge));
    const add = k1 => Array.from({ length: D }, (_, k) => `${into}${ch}_${k} += (${q} * ${k1}) * d${k};`).join(' ');
    let line;
    if (!c.law) line = add('inverseCube');
    else {
      const code = renameLaw(emitLaw(c.law, D, 'r', 'k' + ch, undefined, printer), ch);
      line = c.law.hasRange ? `if (rr <= law${ch}Range2) { ${code} ${add('k' + ch)} }` : `{ ${code} ${add('k' + ch)} }`;
    }
    // a gated pass adds nothing on the steps where its `when` does not hold
    out.push(c.gate !== undefined ? `if (${slotValue(c.gate)} != 0.0) { ${line} }` : line);
  });
  return out;
}

// The names a law's code reads (law_<param>, lawH<n>, lawRange2), made the channel's own
function renameLaw(code, channel) {
  return code.replace(/\blaw_(\w+)/g, `law${channel}_$1`).replace(/\blawH(\d+)\b/g, `law${channel}H$1`).replace(/\blawRange2\b/g, `law${channel}Range2`);
}

// A formula of a node stage on the thread's own row
function formulaLines(plan, section, index, printer) {
  const stage = section.stage;
  const compiled = formula.compile(stage.formula, scopeOf(plan, section), printer);
  return compiled.lines;
}

function sumCode(plan, kernel, section, index, printer) {
  const stage = section.stage;
  const compiled = formula.compile(stage.formula, scopeOf(plan, section), printer);
  const value = compiled.result;
  const codes = value.codes || [value.code];
  const s = kernel.sums.indexOf(plan.sums[stage.name]);
  const lines = compiled.lines.slice();
  codes.forEach((code, k) => lines.push(`sv${s}_${k} = select(0.0, ${code}, live);`));
  return ['{'].concat(lines.map(line => '  ' + line), ['}']);
}

// What names mean in a formula on the GPU: the body's own columns (locals of the kernel), the
// stage's params and built in values (from the step's slot), sums (from S)
function scopeOf(plan, section) {
  const D = plan.D;
  return {
    D,
    name(key) {
      const column = plan.columns[key];
      if (key === 'pos') {
        // positions are relative to the origin on the device; a formula sees where bodies are
        return { type: 'vec', codes: locals(plan, 'pos').map((name, k) => `(${name} + s_origin_${k})`), write: null };
      }
      if (column) {
        const names = locals(plan, key);
        const write = (op, value) => {
          const codes = value.codes || [value.code];
          return names.map((name, k) => `${name} ${op} ${codes[k]};`);
        };
        return column.width === 1 ? { type: 'num', code: names[0], write } : { type: 'vec', codes: names, write };
      }
      if (section.params && section.params[key] !== undefined) return { type: 'num', code: slotValue(section.params[key]) };
      const sum = plan.sums[key];
      if (sum) {
        const codes = [];
        for (let k = 0; k < sum.width; k++) codes.push(`g_${key}_${k}`);
        return sum.width === 1 ? { type: 'num', code: codes[0] } : { type: 'vec', codes };
      }
      if (section.builtIns && section.builtIns[key] !== undefined) return { type: 'num', code: slotValue(section.builtIns[key]) };
      return undefined;
    },
  };
}

// Adds up the kernel's sums over its workgroup with a fixed tree, and writes one partial per
// workgroup (four numbers at a time)
function sumEpilogue(plan, kernel) {
  const values = [];
  kernel.sums.forEach((sum, s) => { for (let k = 0; k < sum.width; k++) values.push(`sv${s}_${k}`); });
  const width = values.length;
  const out = [];
  for (let at = 0; at < width; at += 4) {
    const part = values.slice(at, at + 4);
    while (part.length < 4) part.push('0.0');
    out.push(`  red[li] = vec4f(${part.join(', ')});`);
    out.push('  workgroupBarrier();');
    out.push(`  for (var s = ${u32(THREADS / 2)}; s > 0u; s >>= 1u) {`);
    out.push('    if (li < s) { red[li] += red[li + s]; }');
    out.push('    workgroupBarrier();');
    out.push('  }');
    const writes = [];
    for (let c = 0; c < Math.min(4, width - at); c++) writes.push(`S[${u32(plan.S.partials)} + wid.x * ${u32(width)} + ${u32(at + c)}] = red[0].${AXES[c]};`);
    out.push(`  if (li == 0u) { ${writes.join(' ')} }`);
    out.push('  workgroupBarrier();');
  }
  return out.join('\n');
}

// ---------------------------------------------------------------------------------------------
// Reductions and FIRE
// ---------------------------------------------------------------------------------------------

// One workgroup adds up the partials of every workgroup of the kernel before, in a fixed order,
// into the sums' results. A sum whose `when` does not hold keeps its last result.
function reduceKernel(plan, kernel) {
  const targets = [];
  kernel.sums.forEach((sum, s) => { for (let k = 0; k < sum.width; k++) targets.push({ at: sum.offset + k, gate: kernel.gates[s] }); });
  const width = targets.length;
  const out = [header(plan), `var<workgroup> red: array<vec4f, ${THREADS}>;`];
  out.push(`@compute @workgroup_size(${THREADS})`);
  out.push('fn main(@builtin(local_invocation_index) li: u32) {');
  for (let at = 0; at < width; at += 4) {
    const count = Math.min(4, width - at);
    out.push('  {');
    out.push('    var acc = vec4f(0.0);');
    out.push(`    for (var w = li; w < P.groups; w += ${u32(THREADS)}) {`);
    for (let c = 0; c < count; c++) out.push(`      acc.${AXES[c]} += S[${u32(plan.S.partials)} + w * ${u32(width)} + ${u32(at + c)}];`);
    out.push('    }');
    out.push('    red[li] = acc;');
    out.push('    workgroupBarrier();');
    out.push(`    for (var s = ${u32(THREADS / 2)}; s > 0u; s >>= 1u) {`);
    out.push('      if (li < s) { red[li] += red[li + s]; }');
    out.push('      workgroupBarrier();');
    out.push('    }');
    const writes = [];
    for (let c = 0; c < count; c++) {
      const target = targets[at + c];
      const write = `S[${u32(target.at)}] = red[0].${AXES[c]};`;
      writes.push(target.gate !== undefined ? `if (${slotValue(target.gate)} != 0.0) { ${write} }` : write);
    }
    out.push(`    if (li == 0u) { ${writes.join(' ')} }`);
    out.push('    workgroupBarrier();');
    out.push('  }');
  }
  out.push('}');
  return out.join('\n') + '\n';
}

// FIRE, part 1: per workgroup, (F.v, |v|^2, |F|^2) over bodies that are not pinned
function fireReduceKernel(plan) {
  const D = plan.D;
  const force = columnRef(plan, 'force', 'r', false), velocity = columnRef(plan, 'velocity', 'r', false);
  const pinned = columnRef(plan, 'pinned', 'r', false)[0];
  const out = [header(plan), `var<workgroup> red: array<vec4f, ${THREADS}>;`];
  out.push(`@compute @workgroup_size(${THREADS})`);
  out.push('fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {');
  out.push('  var acc = vec4f(0.0);');
  out.push(`  for (var r = gid.x; r < P.n; r += nwg.x * ${u32(THREADS)}) {`);
  out.push(`    if (${pinned} != 0.0) { continue; }`);
  for (let k = 0; k < D; k++) out.push(`    let f${k} = ${force[k]}; let v${k} = ${velocity[k]};`);
  const sum = fn => Array.from({ length: D }, (_, k) => fn(k)).join(' + ');
  out.push(`    acc += vec4f(${sum(k => `f${k} * v${k}`)}, ${sum(k => `v${k} * v${k}`)}, ${sum(k => `f${k} * f${k}`)}, 0.0);`);
  out.push('  }');
  out.push('  red[li] = acc;');
  out.push('  workgroupBarrier();');
  out.push(`  for (var s = ${u32(THREADS / 2)}; s > 0u; s >>= 1u) {`);
  out.push('    if (li < s) { red[li] += red[li + s]; }');
  out.push('    workgroupBarrier();');
  out.push('  }');
  out.push(`  if (li == 0u) { ${[0, 1, 2, 3].map(c => `S[${u32(plan.S.firePartials)} + wid.x * 4u + ${u32(c)}] = red[0].${AXES[c]};`).join(' ')} }`);
  out.push('}');
  return out.join('\n') + '\n';
}

// FIRE, part 2 (one workgroup): the total power, then FIRE's state (alpha, steps downhill, and
// this step's mix cv, cf), as the CPU's FIRE integrator does it
function fireStateKernel(plan) {
  const f = plan.S.fire;
  const out = [header(plan), `var<workgroup> red: array<vec4f, ${THREADS}>;`];
  out.push(`@compute @workgroup_size(${THREADS})`);
  out.push('fn main(@builtin(local_invocation_index) li: u32) {');
  out.push('  var acc = vec4f(0.0);');
  out.push(`  for (var w = li; w < P.fireGroups; w += ${u32(THREADS)}) { acc += vec4f(${[0, 1, 2, 3].map(c => `S[${u32(plan.S.firePartials)} + w * 4u + ${u32(c)}]`).join(', ')}); }`);
  out.push('  red[li] = acc;');
  out.push('  workgroupBarrier();');
  out.push(`  for (var s = ${u32(THREADS / 2)}; s > 0u; s >>= 1u) {`);
  out.push('    if (li < s) { red[li] += red[li + s]; }');
  out.push('    workgroupBarrier();');
  out.push('  }');
  out.push('  if (li == 0u) {');
  out.push('    let sum = red[0];');
  out.push(`    let a = S[${u32(f)}];`);
  out.push('    if (sum.x > 0.0) {');
  out.push('      var cf = 0.0;');
  out.push('      if (sum.z > 0.0) { cf = a * sqrt(sum.y) / sqrt(sum.z); }');
  out.push(`      let steps = S[${u32(f + 1)}] + 1.0;`);
  out.push(`      S[${u32(f)}] = select(a, a * 0.99, steps > 5.0); S[${u32(f + 1)}] = steps; S[${u32(f + 2)}] = 1.0 - a; S[${u32(f + 3)}] = cf;`);
  out.push('    } else {');
  out.push(`      S[${u32(f)}] = 0.1; S[${u32(f + 1)}] = 0.0; S[${u32(f + 2)}] = 0.0; S[${u32(f + 3)}] = 0.0;`);
  out.push('    }');
  out.push('  }');
  out.push('}');
  return out.join('\n') + '\n';
}

// A direction for two bodies on the same spot, from their indices: axis k of a unit vector of
// about 0.01, the same for (a, b) and (b, a) but for the sign, so the two are pushed apart
function NUDGE(D) {
  return `fn nudgeAxis(a: u32, b: u32, k: u32) -> f32 {
  var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + k * 1013904223u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;
  return f32(h) * (2.0 / 4294967296.0) - 1.0;
}
fn nudge(a: u32, b: u32, k: u32) -> f32 {
  var norm = 0.0;
  for (var axis = 0u; axis < ${u32(D)}; axis++) { let x = nudgeAxis(a, b, axis); norm += x * x; }
  let x = select(nudgeAxis(a, b, k), select(0.0, 1.0, k == 0u), norm == 0.0);
  return select(-0.01, 0.01, a < b) * x / select(sqrt(norm), 1.0, norm == 0.0);
}`;
}
