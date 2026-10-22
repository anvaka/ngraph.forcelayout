// WGSL from the library's formula language. The library's compilers decide what a formula means
// and call a printer for the spelling (lib/formula.js describes the interface); this is the WGSL
// printer, plus the law helpers the kernels use. Three rules make the GPU agree with JS:
//
//  - names: named values print as `v_<name>` and engines print user names (params, columns) with
//    a prefix too (`p_active`), so a user name never hits a WGSL reserved word;
//  - builtins: every function of the library's table prints so that it means what JS computes on
//    the whole domain the table states, or is refused by name. Metal's tanh is NaN from 45, so tanh
//    is clamped to +-10 (tanh(10) is already 1 in f32); a constant whole exponent multiplies, since
//    WGSL's pow is undefined for a negative base;
//  - literals: a number that does not fit a 32-bit float is refused when the shader is printed,
//    never left to become an error or a silent 0 on the device (non-finite, |v| > 3.4028e38, or a
//    nonzero value that rounds to 0). Numbers below 1.18e-38 may be flushed to 0, so they warn.
//
// Laws and builtins that were already safe print exactly as before this module owned the printer
// (test/t3.js compares them with the text the library used to print).

export const F32_MAX = 3.4028234663852886e38;
export const F32_MIN_NORMAL = 1.1754943508222875e-38;

// Builtins that WGSL has with the same meaning as JS on the table's domain
const NATIVE = new Set(['exp', 'log', 'sqrt', 'abs', 'sign', 'floor', 'ceil', 'sin', 'cos', 'min', 'max', 'dot', 'length']);
// A constant whole exponent up to this is a product; larger ones keep the sign by hand
const MAX_PRODUCT = 8;

/**
 * Why `value` cannot be a 32-bit float literal, or null when it can.
 */
export function f32Problem(value) {
  if (!Number.isFinite(value) || Math.abs(value) > F32_MAX) return `the number ${value} does not fit a 32-bit float`;
  if (value !== 0 && Math.fround(value) === 0) return `the number ${value} is 0 in a 32-bit float`;
  return null;
}

/**
 * True for a nonzero value below the smallest normal f32, which a GPU may flush to 0.
 */
export function f32Tiny(value) {
  return value !== 0 && Math.abs(value) < F32_MIN_NORMAL;
}

/**
 * A WGSL printer. `warn(message)` hears about literals a GPU may flush to 0 (console.warn, once
 * per message, by default).
 */
export function createPrinter(warn) {
  if (!warn) warn = warnOnce;
  const printer = {
    name: 'wgsl',

    // Always with a decimal point: 1 / 2 between integer literals is 0 in WGSL
    number(value) {
      const problem = f32Problem(value);
      if (problem) throw new Error(problem);
      if (f32Tiny(value)) warn(`the number ${value} is below 1.18e-38, which the GPU may treat as 0`);
      let text = String(value);
      if (/^-?\d+$/.test(text)) text += '.0';
      return value < 0 ? '(' + text + ')' : text;
    },

    call(name, args) {
      if (NATIVE.has(name)) return name + '(' + args.join(', ') + ')';
      if (name === 'tanh') return 'tanh(clamp(' + args[0] + ', -10.0, 10.0))';
      if (name === 'pow') return power(args[0], args[1]);
      if (name === 'select') return printer.choose(args[0], args[1], args[2]);
      if (name === 'axis') throw new Error('axis() is a constant vector: the formula compiler prints it, not a call');
      throw new Error(`${name}() has no WGSL printing`);
    },

    choose(condition, yes, no) { return 'select(' + no + ', ' + yes + ', ' + condition + ')'; },
    operator(op) { return op; },
    // Named values may be assigned again (+= and the like), so they are variables
    declare(name, code, kind) { return (kind === 'local' ? 'var ' : 'let ') + name + ' = ' + code + ';'; },
    result(name, code) { return 'let ' + name + ' = ' + code + ';'; },
    assign(target, op, code) { return target + ' ' + op + ' ' + code + ';'; },
    local(name) { return 'v_' + name; },
    temp(index) { return 't_' + index; },
  };
  return printer;
}

const WGSL = createPrinter();
export default WGSL;

/**
 * How an engine spells a user's name (a param, a column) in WGSL.
 */
export function userName(name) {
  return 'p_' + name;
}

const warned = new Set();
function warnOnce(message) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn('ngraph.forcelayout.gpu: ' + message);
}

// pow(a, b) is exp2(b * log2(a)) in WGSL: undefined for a < 0. JS gives a real number there when
// b is whole, so a whole exponent written in the formula keeps that meaning; a run-time exponent
// with a negative base is outside the parity contract (design section 1).
function power(base, exponent) {
  const whole = wholeLiteral(exponent);
  if (whole === null) return 'pow(' + base + ', ' + exponent + ')';
  if (whole === 0) return '1.0';
  const count = Math.abs(whole);
  if (count <= MAX_PRODUCT) {
    const product = '(' + Array(count).fill(base).join(' * ') + ')';
    return whole < 0 ? '(1.0 / ' + product + ')' : product;
  }
  const magnitude = 'pow(abs(' + base + '), ' + exponent + ')';
  return count % 2 ? '(sign(' + base + ') * ' + magnitude + ')' : magnitude;
}

// The whole number a literal printed by number() holds ('3.0', '(-2.0)'), or null
function wholeLiteral(code) {
  const match = /^\(?(-?\d+)\.0\)?$/.exec(code);
  return match ? Number(match[1]) : null;
}

// ---------------------------------------------------------------------------------------------
// Laws. A compiled law (lib/repulsionLaw.js) keeps its numbers in `law.values`: the parameters
// by name, the parts computed once per step as `$h<n>` and the range as `$range`. Kernels read
// them from a uniform as `law_<name>` and `lawH<n>`, and the squared range as `lawRange2`.
// ---------------------------------------------------------------------------------------------

/**
 * Code that sets `k1Name` to F(r) / r (and `k2Name`, when given, to (F(r)/r - F'(r)) / r^2),
 * both declared with `let`. Throws for what the GPU cannot run, literals included.
 */
export function emitLaw(law, dimension, rName, k1Name, k2Name, printer = WGSL) {
  if (law.tableNames.length) throw new Error('Laws with lookup tables cannot run on the GPU yet');
  if (Object.keys(law.functions).length) throw new Error('Laws with custom functions cannot run on the GPU');
  return law.emit(printer, dimension, rName, k1Name, k2Name);
}

/**
 * Names of the law's numbers in the order lawPrologue() and writeLawValues() use: the parameters,
 * then the hoisted parts.
 */
export function lawValueNames(law) {
  const hoisted = Object.keys(law.values).filter(key => /^\$h\d+$/.test(key))
    .sort((a, b) => Number(a.slice(2)) - Number(b.slice(2)));
  return law.paramNames.concat(hoisted);
}

/**
 * How many numbers the law needs in a buffer: its values, plus the squared range when it has one.
 */
export function lawValueCount(law) {
  return lawValueNames(law).length + (law.hasRange ? 1 : 0);
}

/**
 * Writes the law's numbers for the coming step (after `law.update()`) into `out` from `offset`.
 */
export function writeLawValues(law, out, offset) {
  const names = lawValueNames(law);
  const values = law.values;
  for (let i = 0; i < names.length; ++i) out[offset + i] = values[names[i]];
  // f32 has no room for a squared range past 1e19, and some GPUs mishandle infinity
  if (law.hasRange) out[offset + names.length] = Math.min(values.$range * values.$range, 3e38);
}

/**
 * WGSL that declares the law's numbers, where `read(i)` is an expression for the i-th number
 * written by writeLawValues(). A range is declared as `lawRange2` (squared).
 */
export function lawPrologue(law, read) {
  const names = lawValueNames(law).map(key => (key[0] === '$' ? 'lawH' + key.slice(2) : 'law_' + key));
  const lines = names.map((name, i) => 'let ' + name + ' = ' + read(i) + ';');
  if (law.hasRange) lines.push('let lawRange2 = ' + read(names.length) + ';');
  return lines.join(' ');
}

/**
 * The first of the law's numbers for this step that does not fit a 32-bit float (not finite, or
 * beyond +-3.4028e38), as {name, value, problem}, or null. Names are as the user wrote them (`L`),
 * or `part $h<n>` for a part computed once per step. The range is clamped instead (writeLawValues).
 */
export function lawValueProblem(law) {
  for (const key of lawValueNames(law)) {
    const value = law.values[key];
    if (!Number.isFinite(value) || Math.abs(value) > F32_MAX) {
      return { name: valueName(key), value, problem: `${value}, which does not fit a 32-bit float` };
    }
  }
  return null;
}

/**
 * Warnings about the law's numbers for this step: nonzero values that are 0 in a 32-bit float, or
 * below 1.18e-38 (which a GPU may treat as 0).
 */
export function lawValueWarnings(law) {
  const out = [];
  for (const key of lawValueNames(law)) {
    const value = law.values[key];
    if (value !== 0 && Math.fround(value) === 0) out.push(`the law's ${valueName(key)} is ${value}, which is 0 in a 32-bit float`);
    else if (f32Tiny(value)) out.push(`the law's ${valueName(key)} is ${value}, below 1.18e-38: the GPU may treat it as 0`);
  }
  return out;
}

// A parameter by its name; a part the law computes once per step from its parameters by its key
function valueName(key) {
  return key[0] === '$' ? `part ${key} (computed from its parameters)` : key;
}
