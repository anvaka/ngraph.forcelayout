// WGSL of links and sums per group (design sections 6.3 and 6.5), for emit.js:
//  - the stock springs and link formulas that pull or add into body columns, as a gather in a node
//    kernel: the thread goes through its row's links; both ends evaluate a link with its true
//    roles (i is the from end), so they get the same pull, and each keeps its own end's share;
//  - link formulas that only write link columns: a kernel with a thread per link;
//  - GROUP_RUNS and GROUP_SUM for sums per group.
import formula from '../../../lib/formula.js';
import { header, NUDGE, settingsLines, scopeOf, linkRef, locals, columnRef, u32, slotValue, L_OTHER, L_ROLE, L_FROM_ENTRY, L_FROM, L_TO, L_HEADER } from './common.js';
import { LINK_CHUNK } from './plan.js';

/**
 * The stock springs, or a link formula that pulls or adds into body columns: lines of a node
 * kernel section. `pos` and `force` are the thread's locals. Up to N* the section goes through
 * the row's links itself; above it, it adds the row's chunks (LINK_CHUNKS) in order.
 */
export function gatherCode(plan, section, printer) {
  const out = [];
  // a pass's own sums start at zero (the CPU zeroes the column; each row here is its thread's)
  const zero = section.kind === 'springs' ? [] : section.stage.args.startAtZero || [];
  zero.forEach(column => locals(plan, column).forEach(name => out.push(`${name} = 0.0;`)));
  out.push('if (live) {');
  if (section.chunks) {
    const { offset, width, parts } = section.chunks;
    out.push(`  let cb = L[${L_HEADER}];`);
    out.push('  for (var c = L[cb + 1u + row]; c < L[cb + 2u + row]; c++) {');
    let at = 0;
    parts.forEach(part => {
      locals(plan, part.column).forEach(name => { out.push(`    ${name} += S[${u32(offset)} + c * ${u32(width)} + ${u32(at)}];`); at++; });
    });
    out.push('  }');
  } else {
    out.push('  for (var e = L[row]; e < L[row + 1u]; e++) {');
    entryBody(plan, section, printer).forEach(line => out.push('    ' + line));
    out.push('  }');
  }
  out.push('}');
  return out;
}

/**
 * LINK_CHUNKS: a thread per chunk of up to 8 links of one row (the chunks of a row in a row) goes
 * through them as the row's gather would, and writes what they add (the force, and into each
 * column) to the chunk's place
 */
export function chunkKernel(plan, kernel, printer) {
  const section = kernel.section;
  const { offset, width, parts } = section.chunks;
  const out = [header(plan), NUDGE(plan.D)];
  out.push('@compute @workgroup_size(256)');
  out.push('fn main(@builtin(global_invocation_id) gid: vec3u) {');
  out.push(`  let cb = L[${L_HEADER}];`);
  out.push('  let chunks = L[cb];');
  out.push('  let c = gid.x;');
  out.push('  if (c >= chunks) { return; }');
  out.push('  let row = L[cb + 2u + P.n + c];');
  out.push('  let first = L[cb + 2u + P.n + chunks + c];');
  out.push(`  let last = min(first + ${u32(LINK_CHUNK)}, L[row + 1u]);`);
  out.push(settingsLines(plan));
  if (section.gate !== undefined) out.push(`  if (${slotValue(section.gate)} == 0.0) { return; }`);
  // the row's own values the links read; what they add starts at 0
  const added = new Set(parts.map(part => part.column));
  const reads = new Set(['pos']);
  if (section.kind === 'gather') section.stage.reads.forEach(read => { if (read.space === 'nodes' && plan.columns[read.column]) reads.add(read.column); });
  reads.forEach(column => {
    if (added.has(column)) return;
    const refs = columnRef(plan, column, 'row', false);
    locals(plan, column).forEach((name, k) => out.push(`  let ${name} = ${refs[k]};`));
  });
  added.forEach(column => locals(plan, column).forEach(name => out.push(`  var ${name} = 0.0;`)));
  out.push('  for (var e = first; e < last; e++) {');
  entryBody(plan, section, printer).forEach(line => out.push('    ' + line));
  out.push('  }');
  let at = 0;
  parts.forEach(part => {
    locals(plan, part.column).forEach(name => { out.push(`  S[${u32(offset)} + c * ${u32(width)} + ${u32(at)}] = ${name};`); at++; });
  });
  out.push('}');
  return out.join('\n') + '\n';
}

// One link of the row (entry e), as the row's end sees it: what the link adds to the row's force
// and columns
function entryBody(plan, section, printer) {
  const D = plan.D;
  const pos = locals(plan, 'pos'), force = locals(plan, 'force');
  const axes = Array.from({ length: D }, (_, k) => k);
  const stock = section.kind === 'springs';
  const stage = section.stage;
  const pulls = stock || section.pulls;
  const body = [`let j = L[${L_OTHER} + e];`];
  const needsLink = !stock || section.own;
  if (needsLink) {
    body.push(`let lrole = L[${L_ROLE} + e];`);
    body.push('let s = lrole & 0x7fffffffu;');
    body.push('let isFrom = (lrole >> 31u) == 0u;');
  }
  // from this body to the other one (the CPU's d is to - from: the from end sees this d)
  body.push(axes.map(k => `var dm${k} = X[j * ${u32(D)} + ${u32(k)}] - ${pos[k]};`).join(' '));
  body.push(`var lr = sqrt(${axes.map(k => `dm${k} * dm${k}`).join(' + ')});`);
  // ends on one spot: a link that pulls goes along a small direction both ends agree on (the CPU
  // draws a random one); one that does not sees r = 0, as on the CPU
  if (pulls) body.push(`if (lr == 0.0) { ${axes.map(k => `dm${k} = nudge(row, j, ${u32(k)});`).join(' ')} lr = sqrt(${axes.map(k => `dm${k} * dm${k}`).join(' + ')}); }`);
  body.push(...linkValues(plan, stage, stock, 's', 'e'));
  if (stock) {
    body.push('let lpull = lk_coefficient * (lr - lk_length);');
  } else {
    // the other end's columns the formula reads
    stage.reads.forEach(read => {
      if (read.space !== 'nodes' || !read.end || read.column === 'pos' || !plan.columns[read.column]) return;
      const refs = columnRef(plan, read.column, 'j', false);
      locals(plan, read.column).forEach((name, k) => {
        const line = `let o${name.slice(1)} = ${refs[k]};`;
        if (body.indexOf(line) < 0) body.push(line);
      });
    });
    body.push(axes.map(k => `let o_pos_${k} = X[j * ${u32(D)} + ${u32(k)}];`).join(' '));
    if (pulls) body.push('var lpull = 0.0;');
    const compiled = formula.compile(stage.formula, scopeOf(plan, section, { space: 'gather' }), printer);
    body.push(...compiled.lines);
  }
  // from: force_i += k d; to: force_j -= k d; with d = to - from, both are k times dm
  if (pulls) {
    body.push('let kp = lpull / lr;');
    body.push(axes.map(k => `${force[k]} += kp * dm${k};`).join(' '));
  }
  return body;
}

// The link's length, stiffness and columns as lk_* locals: the settings while every link has
// the defaults, else the link's own with the settings for a negative length or a stiffness of 0
function linkValues(plan, stage, stock, s, e) {
  const out = [];
  ['length', 'coefficient'].forEach(name => {
    const setting = name === 'length' ? 's_springLength' : 's_springCoefficient';
    if (!plan.linkColumns[name]) {
      out.push(`var lk_${name} = ${setting};`);
      return;
    }
    out.push(`var lw_${name} = ${linkRef(plan, name, s, e)};`);
    out.push(`var lk_${name} = select(lw_${name}, ${setting}, lw_${name} ${name === 'length' ? '< 0.0' : '<= 0.0'});`);
  });
  if (!stock) {
    stage.reads.forEach(read => {
      if (read.space !== 'links' || read.column === 'length' || read.column === 'coefficient' || !plan.linkColumns[read.column]) return;
      const line = `var lk_${read.column} = ${linkRef(plan, read.column, s, e)};`;
      if (out.indexOf(line) < 0) out.push(line);
    });
  }
  return out;
}

/**
 * A kernel with a thread per link, for link formulas that only write link columns (their own
 * length and stiffness, or columns of their own)
 */
export function linkKernel(plan, kernel, printer) {
  const D = plan.D;
  const axes = Array.from({ length: D }, (_, k) => k);
  const out = [header(plan)];
  out.push('@compute @workgroup_size(256)');
  out.push('fn main(@builtin(global_invocation_id) gid: vec3u) {');
  out.push('  let s = gid.x;');
  out.push('  let live = s < P.links;');
  out.push('  let sl = select(0u, s, live);');
  out.push(`  let li = L[${L_FROM} + sl];`);
  out.push(`  let lj = L[${L_TO} + sl];`);
  out.push(`  let e = L[${L_FROM_ENTRY} + sl];`);
  out.push(settingsLines(plan));
  kernel.sections.forEach(section => {
    const stage = section.stage;
    const written = new Set();
    const body = [];
    if (stage.reads.some(read => read.space === 'nodes' && read.column === 'pos')) {
      // no nudge: ends on one spot see r = 0, as on the CPU
      body.push(axes.map(k => `let d${k} = X[lj * ${u32(D)} + ${u32(k)}] - X[li * ${u32(D)} + ${u32(k)}];`).join(' '));
      body.push(`let lr = sqrt(${axes.map(k => `d${k} * d${k}`).join(' + ')});`);
    }
    body.push(...linkValues(plan, stage, false, 'sl', 'e'));
    // columns it writes start as the link's values
    stage.writes.forEach(write => {
      if (write.space !== 'links' || write.column === 'length' || write.column === 'coefficient') return;
      const line = `var lk_${write.column} = ${linkRef(plan, write.column, 'sl', 'e')};`;
      if (body.indexOf(line) < 0) body.push(line);
    });
    const compiled = formula.compile(stage.formula, scopeOf(plan, section, { space: 'link', written }), printer);
    body.push(...compiled.lines);
    const writes = [...written].map(name => `S[${u32(plan.linkColumns[name].offset)} + s] = ${name === 'length' || name === 'coefficient' ? 'lw_' : 'lk_'}${name};`);
    if (writes.length) body.push(`if (live) { ${writes.join(' ')} }`);
    out.push(`  // ${stage.name}`);
    const gate = section.gate !== undefined ? slotValue(section.gate) + ' != 0.0' : 'true';
    out.push(`  if (${gate}) {`);
    body.forEach(line => out.push('    ' + line));
    out.push('  }');
  });
  out.push('}');
  return out.join('\n') + '\n';
}

/**
 * The value of each row for a sum per group, into its rows (a node kernel section)
 */
export function groupValueCode(plan, kernel, section, printer) {
  const stage = section.stage;
  const sum = plan.sums[stage.name];
  const compiled = formula.compile(stage.formula, scopeOf(plan, section), printer);
  const value = compiled.result;
  const codes = value.codes || [value.code];
  const lines = compiled.lines.slice();
  lines.push(`if (live) { ${codes.map((code, k) => `S[${u32(sum.rows)} + row * ${u32(sum.width)} + ${u32(k)}] = ${code};`).join(' ')} }`);
  return ['{'].concat(lines.map(line => '  ' + line), ['}']);
}

// The block of a group column in L: [runs, groups, rows, the rows in group order, the first row
// of each run (runs + 1), the first run of each group (groups + 1)]
function groupBlock(kernel) {
  const block = kernel.sums[0].block;
  return [
    `  let base = L[${L_HEADER} + ${u32(block + 1)}];`,
    '  let runs = L[base];',
    '  let count = L[base + 1u];',
    '  let rows = L[base + 2u];',
  ];
}

/**
 * GROUP_RUNS: a thread per run of rows of one group (at most 256, in group order) adds up their
 * values, in row order
 */
export function groupRunsKernel(plan, kernel) {
  const out = [header(plan), '@compute @workgroup_size(256)', 'fn main(@builtin(global_invocation_id) gid: vec3u) {'];
  out.push(...groupBlock(kernel));
  out.push('  let run = gid.x;');
  out.push('  if (run >= runs) { return; }');
  out.push('  let first = L[base + 3u + rows + run];');
  out.push('  let last = L[base + 3u + rows + run + 1u];');
  kernel.sums.forEach((sum, q) => { for (let k = 0; k < sum.width; k++) out.push(`  var a${q}_${k} = 0.0;`); });
  out.push('  for (var t = first; t < last; t++) {');
  out.push('    let row = L[base + 3u + t];');
  kernel.sums.forEach((sum, q) => { for (let k = 0; k < sum.width; k++) out.push(`    a${q}_${k} += S[${u32(sum.rows)} + row * ${u32(sum.width)} + ${u32(k)}];`); });
  out.push('  }');
  kernel.sums.forEach((sum, q) => { for (let k = 0; k < sum.width; k++) out.push(`  S[${u32(sum.runs)} + run * ${u32(sum.width)} + ${u32(k)}] = a${q}_${k};`); });
  out.push('}');
  return out.join('\n') + '\n';
}

/**
 * GROUP_SUM: a thread per group adds up its runs in order, into the sum's result (kept as it was
 * on steps where the sum's `when` does not hold)
 */
export function groupSumKernel(plan, kernel) {
  const out = [header(plan), '@compute @workgroup_size(256)', 'fn main(@builtin(global_invocation_id) gid: vec3u) {'];
  out.push(...groupBlock(kernel));
  out.push('  let g = gid.x;');
  out.push('  if (g >= count) { return; }');
  out.push('  let first = L[base + 4u + rows + runs + g];');
  out.push('  let last = L[base + 4u + rows + runs + g + 1u];');
  kernel.sums.forEach((sum, q) => {
    const gate = kernel.gates[q];
    out.push(`  if (${gate !== undefined ? slotValue(gate) + ' != 0.0' : 'true'}) {`);
    for (let k = 0; k < sum.width; k++) out.push(`    var a${k} = 0.0;`);
    out.push('    for (var run = first; run < last; run++) {');
    for (let k = 0; k < sum.width; k++) out.push(`      a${k} += S[${u32(sum.runs)} + run * ${u32(sum.width)} + ${u32(k)}];`);
    out.push('    }');
    for (let k = 0; k < sum.width; k++) out.push(`    S[${u32(sum.offset)} + g * ${u32(sum.width)} + ${u32(k)}] = a${k};`);
    out.push('  }');
  });
  out.push('}');
  return out.join('\n') + '\n';
}
