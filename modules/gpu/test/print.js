// The WGSL printer without a device: printed laws compute what the JS ones do, the literal and
// name rules, and a printing or a named refusal for every builtin of the library's table. T5 runs
// the builtins on a device.
//
//   node modules/gpu/test/print.js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import WGSL, { createPrinter, userName, emitLaw, lawPrologue, lawValueCount, writeLawValues, lawValueProblem, lawValueWarnings } from '../wgsl/print.js';

const require = createRequire(import.meta.url);
const createRepulsionLaw = require('../../../lib/repulsionLaw.js');
const formula = require('../../../lib/formula.js');

test('WGSL law code gives the same numbers as the JS code', () => {
  const laws = [
    { force: 'r^-2', params: { L: 1 } },
    { force: 'exp(-r / L) / r^2', params: { L: 2 }, range: 'L * 3' },
    { force: 'r^(1 - D) * L^(D - 3)', params: { L: 7 } },
    { force: 'tanh(r / L) / r^2 + min(r, L) - abs(r - 3) + sqrt(r) * log(r) / 2', params: { L: 2 } },
    { force: 'pow(r, -p) * sin(r) - cos(r / 2) / max(r, 1)', params: { p: 1.5 } },
    { force: 'r^q / (r * r + e * e)', params: { q: 0.3, e: 0.5 } },
    { force: 'r^7 / (1 + r^9)' },
  ];
  laws.forEach(spec => {
    const law = createRepulsionLaw(spec);
    law.update({ settings: { dimensions: 2 } });
    const numbers = new Float32Array(lawValueCount(law));
    writeLawValues(law, numbers, 0);
    const kernel = emitLaw(law, 2, 'r', 'k1', 'k2');
    const wgsl = lawPrologue(law, i => 'numbers[' + i + ']') + ' ' + kernel;
    assert.ok(!/Math\.|\bvar\b|\?/.test(wgsl), spec.force + ': no JS left in WGSL');
    const literals = [], number = /(^|[^\w.])(\d+(\.\d*)?([eE][+-]?\d+)?)/g;
    let match;
    while ((match = number.exec(kernel))) literals.push(match[2]);
    assert.ok(literals.every(text => /[.eE]/.test(text)), spec.force + ': every number is a float');
    if (spec.range) assert.match(wgsl, /lawRange2 = numbers\[\d+\]/);

    const asJS = wgsl.replace(/\blet\b/g, 'var')
      .replace(/select\(([^,()]+), ([^,()]+), ([^()]+)\)/g, '($3 ? $2 : $1)')
      .replace(/\b(exp|log|sqrt|abs|sign|tanh|sin|cos|min|max|pow)\(/g, 'Math.$1(')
      .replace(/\bclamp\(/g, 'clamp(');
    const gpu = new Function('r', 'numbers', 'function clamp(x, lo, hi) { return Math.min(Math.max(x, lo), hi); }' + asJS + ' return [k1, k2];');
    const cpu = new Function('r', 'values', 'lawFunctions', law.prologue('values') + ' var k1, k2; ' + law.emit(2, 'r', 'k1', 'k2') + ' return [k1, k2];');
    [0.3, 1.7, 4].forEach(r => {
      const a = gpu(r, numbers), b = cpu(r, law.values, law.functions);
      assert.ok(Math.abs(a[0] - b[0]) <= 1e-6 * Math.abs(b[0]) && Math.abs(a[1] - b[1]) <= 1e-6 * Math.abs(b[1]), `${spec.force} at r = ${r}: ${a} vs ${b}`);
    });
  });
});

test('laws the GPU cannot run are refused', () => {
  assert.throws(() => emitLaw(createRepulsionLaw({ force: 'K(r)', functions: { K: { value: Math.cos } } }), 2, 'r', 'k1'), /custom functions/);
  // a table prints as the law compiler's call, for the caller to look up
  assert.match(emitLaw(createRepulsionLaw({ force: 'T(r)', tables: { T: { from: 0, to: 1, values: [1, 0] } } }), 2, 'r', 'k1', 'k2'), /lawFunctions\.T\.value\(/);
  assert.throws(() => emitLaw(createRepulsionLaw('1e300 / r^2'), 2, 'r', 'k1'), /1e\+300 does not fit a 32-bit float/);
});

test('literals that do not fit f32 are refused; tiny ones warn', () => {
  for (const value of [1e300, 3.5e38, -1e39, Infinity, -Infinity, NaN]) assert.throws(() => WGSL.number(value), /does not fit a 32-bit float/);
  for (const value of [5e-324, 1e-46]) assert.throws(() => WGSL.number(value), /is 0 in a 32-bit float/);
  const warnings = [];
  const printer = createPrinter(message => warnings.push(message));
  assert.equal(printer.number(1e-39), '1e-39');
  assert.equal(warnings.length, 1);
  assert.equal(printer.number(2), '2.0');
  assert.equal(printer.number(-2), '(-2.0)');
  assert.equal(printer.number(3.4e38), '3.4e+38');
  assert.equal(printer.number(0.5), '0.5');
});

test('user names are prefixed, named values are variables', () => {
  assert.equal(WGSL.local('active'), 'v_active');
  assert.equal(userName('active'), 'p_active');
  assert.equal(WGSL.declare('v_x', '1.0', 'local'), 'var v_x = 1.0;');
  assert.equal(WGSL.declare('t_0', '1.0', 'temp'), 'let t_0 = 1.0;');
  assert.equal(WGSL.choose('c', 'a', 'b'), 'select(b, a, c)');
});

test('every builtin of the library has a WGSL printing or a named refusal', () => {
  for (const name of Object.keys(formula.BUILTINS)) {
    const entry = formula.BUILTINS[name];
    const args = entry.args.map((type, i) => 'a' + i);
    let printed = null, refusal = null;
    try { printed = WGSL.call(name, args); } catch (e) { refusal = e.message; }
    assert.ok(printed || (refusal && refusal.indexOf(name) >= 0), name + ': ' + (printed || refusal));
  }
  assert.equal(WGSL.call('tanh', ['x']), 'tanh(clamp(x, -10.0, 10.0))');
  assert.throws(() => WGSL.call('erf', ['x']), /erf\(\) has no WGSL printing/);
});

test('whole constant exponents keep the sign of a negative base', () => {
  assert.equal(WGSL.call('pow', ['x', WGSL.number(3)]), '(x * x * x)');
  assert.equal(WGSL.call('pow', ['x', WGSL.number(-2)]), '(1.0 / (x * x))');
  assert.equal(WGSL.call('pow', ['x', WGSL.number(0)]), '1.0');
  assert.equal(WGSL.call('pow', ['x', WGSL.number(9)]), '(sign(x) * pow(abs(x), 9.0))');
  assert.equal(WGSL.call('pow', ['x', WGSL.number(10)]), 'pow(abs(x), 10.0)');
  assert.equal(WGSL.call('pow', ['x', 'p_q']), 'pow(x, p_q)');
  assert.equal(WGSL.call('pow', ['x', WGSL.number(2.5)]), 'pow(x, 2.5)');
});

test("a law's numbers for a step are checked against f32", () => {
  const law = createRepulsionLaw({ force: 'exp(-r / L) / r^2', params: { L: 1 } });
  law.update({ settings: { dimensions: 2 } });
  assert.equal(lawValueProblem(law), null);
  law.values.L = Infinity;
  assert.match(lawValueProblem(law).problem, /does not fit/);
  law.values.L = 1e-50;
  assert.equal(lawValueProblem(law), null);
  assert.match(lawValueWarnings(law)[0], /is 0 in a 32-bit float/);
});
