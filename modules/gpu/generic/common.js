// What the WGSL of every generic kernel shares (emit.js, links.js): the bindings, where a column's
// row lives, the names of locals, and what names mean in a formula.
import { slotValue } from './plan.js';

const AXES = 'xyzw';

/**
 * The bindings every kernel of a plan shares (one pipeline layout for all of them)
 */
export function header(plan) {
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

// Where the parts of L start (see plan.js): u32 expressions
export const L_OTHER = 'P.n + 1u';
export const L_ROLE = 'P.n + 1u + 2u * P.links';
export const L_FROM_ENTRY = 'P.n + 1u + 4u * P.links';
export const L_FROM = 'P.n + 1u + 5u * P.links';
export const L_TO = 'P.n + 1u + 6u * P.links';
export const L_GROUPS = 'P.n + 1u + 7u * P.links';

export function u32(value) {
  return value + 'u';
}

/**
 * Where row `row` of body column `column` lives: an expression for each of its numbers
 */
export function columnRef(plan, column, row, afterIntegrate) {
  const c = plan.columns[column];
  const out = [];
  for (let k = 0; k < c.width; k++) {
    const at = c.width === 1 ? `${u32(c.offset)} + ${row}` : `${u32(c.offset)} + ${row} * ${u32(c.width)} + ${u32(k)}`;
    const buffer = c.buffer === 'X' ? (afterIntegrate ? 'Y' : 'X') : c.buffer;
    out.push(`${buffer}[${at}]`);
  }
  return out;
}

/**
 * Where link column `name` of link `s` lives: the host's columns are in CSR order (entry `e`),
 * the stages' in link order
 */
export function linkRef(plan, name, s, e) {
  const c = plan.linkColumns[name];
  return c.order === 'csr' ? `H[${u32(c.offset)} + ${e}]` : `S[${u32(c.offset)} + ${s}]`;
}

export function local(column, k, width) {
  return width === 1 ? `c_${column}` : `c_${column}_${k}`;
}

export function locals(plan, column) {
  const width = plan.columns[column].width;
  const out = [];
  for (let k = 0; k < width; k++) out.push(local(column, k, width));
  return out;
}

export function settingsLines(plan) {
  return plan.slot.entries.filter(e => e.kind === 'setting').map(e => `  let s_${e.stage} = ${slotValue(e.index)};`).join('\n');
}

/**
 * The number of a sum per group for the group `index` (a WGSL f32 expression): 0 outside
 * 0 ... count - 1, as on the CPU
 */
export function groupRead(sum, index, k) {
  if (!sum.count) return '0.0';
  const at = `${u32(sum.offset)} + min(u32(max(floor(${index}), 0.0)), ${u32(sum.count - 1)}) * ${u32(sum.width)} + ${u32(k)}`;
  return `select(0.0, S[${at}], ${index} >= 0.0 && ${index} < ${sum.count}.0)`;
}

/**
 * What names mean in the formula of `section` on the GPU. `where.space`:
 *  - 'node': the thread's own row (locals c_*);
 *  - 'gather': one link of the thread's row, in a node kernel: `isFrom` says which end the thread
 *    is, the other body's row is `j` (its columns read at the link's ends are in o_* locals), the
 *    link's values in lk_* locals, `lr` the distance and `lpull` the pull;
 *  - 'link': a thread per link (rows `li` and `lj`), its values in lk_* locals; link columns it
 *    writes go into lw_* and lk_*, written back at the end.
 * `where.written` collects the link columns a 'link' formula writes.
 */
export function scopeOf(plan, section, where = { space: 'node' }) {
  const D = plan.D;
  const space = where.space;
  const vector = codes => (codes.length === 1 ? { type: 'num', code: codes[0] } : { type: 'vec', codes });
  return {
    D,
    name(key) {
      if (space !== 'node') {
        const named = linkName(key);
        if (named) return named;
      }
      const column = plan.columns[key];
      if (space === 'node' && key === 'pos') {
        // positions are relative to the origin on the device; a formula sees where bodies are
        return { type: 'vec', codes: locals(plan, 'pos').map((name, k) => `(${name} + s_origin_${k})`), write: null };
      }
      if (space === 'node' && column) {
        const names = locals(plan, key);
        const write = (op, value) => {
          const codes = value.codes || [value.code];
          return names.map((name, k) => `${name} ${op} ${codes[k]};`);
        };
        return column.width === 1 ? { type: 'num', code: names[0], write } : { type: 'vec', codes: names, write };
      }
      if (section.params && section.params[key] !== undefined) return { type: 'num', code: slotValue(section.params[key]) };
      const sum = plan.sums[key];
      if (sum && sum.grouped) {
        return { index: code => vector(Array.from({ length: sum.width }, (_, k) => groupRead(sum, code, k))) };
      }
      if (sum) return vector(Array.from({ length: sum.width }, (_, k) => `g_${key}_${k}`));
      if (section.builtIns && section.builtIns[key] !== undefined) return { type: 'num', code: slotValue(section.builtIns[key]) };
      return undefined;
    },
  };

  // Names of link formulas: r, pull, the link's values, and body columns at either end
  function linkName(key) {
    if (key === 'r') return { type: 'num', code: 'lr' };
    if (key === 'pull' && space === 'gather') {
      return { type: 'num', code: 'lpull', write: (op, value) => [`lpull ${op} ${value.code};`] };
    }
    if (key === 'length' || key === 'coefficient') {
      const fallback = key === 'length' ? `select(lw_length, s_springLength, lw_length < 0.0)` : `select(lw_coefficient, s_springCoefficient, lw_coefficient <= 0.0)`;
      const write = space === 'link' ? (op, value) => {
        where.written.add(key);
        return [`lw_${key} = ${value.code};`, `lk_${key} = ${fallback};`];
      } : null;
      return { type: 'num', code: 'lk_' + key, write };
    }
    if (plan.linkColumns[key]) {
      const write = space === 'link' ? (op, value) => { where.written.add(key); return [`lk_${key} ${op} ${value.code};`]; } : null;
      return { type: 'num', code: 'lk_' + key, write };
    }
    const end = /^(.+)_([ij])$/.exec(key);
    if (!end) return undefined;
    const column = plan.columns[end[1]];
    if (!column) return undefined;
    const isI = end[2] === 'i';
    if (space === 'link') {
      const row = isI ? 'li' : 'lj';
      const codes = end[1] === 'pos'
        ? Array.from({ length: D }, (_, k) => `(X[${row} * ${u32(D)} + ${u32(k)}] + s_origin_${k})`)
        : columnRef(plan, end[1], row, false);
      return vector(codes);
    }
    // gather: one end is the thread's own row (locals), the other row j (o_* locals)
    const own = end[1] === 'pos' ? locals(plan, 'pos') : locals(plan, end[1]);
    const other = own.map(name => 'o' + name.slice(1));
    const mine = isI ? 'isFrom' : '!isFrom';
    let codes = own.map((name, k) => `select(${other[k]}, ${name}, ${mine})`);
    if (end[1] === 'pos') codes = codes.map((code, k) => `(${code} + s_origin_${k})`);
    const write = (op, value) => {
      const values = value.codes || [value.code];
      return [`if (${mine}) { ${own.map((name, k) => `${name} ${op} ${values[k]};`).join(' ')} }`];
    };
    return codes.length === 1 ? { type: 'num', code: codes[0], write } : { type: 'vec', codes, write };
  }
}

/**
 * A direction for two bodies on the same spot, from their indices: axis k of a unit vector of
 * about 0.01, the same for (a, b) and (b, a) but for the sign, so the two are pushed apart
 */
export function NUDGE(D) {
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

export { AXES, slotValue };
