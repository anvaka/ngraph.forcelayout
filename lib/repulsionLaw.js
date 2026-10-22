/**
 * A repulsion law says how hard two unit charges push each other at distance `r`: F(r).
 * Bodies `i` and `j` then push each other with `gravity * charge_i * charge_j * F(r)`.
 *
 * Laws are written as small expressions, e.g. `'exp(-r / L) / r^2'`, with named parameters
 * (`L`) whose values are read once per step. The expression is compiled into the tree code,
 * so a law costs about as much as the arithmetic it asks for. The trees need two numbers from
 * a law, and both are generated from the expression:
 *
 *  - F(r) / r, which multiplies the vector between two bodies (or a body and a cell);
 *  - (F(r) / r - F'(r)) / r^2, the dual tree's field gradient. F' is derived here.
 *
 * A law is written in the formula language (see formula.js): numbers, `r`, the law's parameters,
 * the names every formula knows (`D`, `dt`, `unit`, ...), comparisons and `?:`, named values
 * (`'u = r / L; exp(-u) / r^2'`), and the functions of formula.js except the vector ones.
 * Lookup tables are passed in as `tables: { name: { from, to, values } }`; on the CPU, other
 * functions can be passed in as `functions: { name: { value: fn, derivative: fn } }`.
 */
// The formula language is loaded with the first law other than 1/r^2, so that default layouts
// never load or run the parser (see loadFormula)
var formula = null;
var BUILT_IN_VALUES = null;
var BUILT_IN_FUNCTIONS = null;
// The JS printer of formula.js
var JS = null;

module.exports = createRepulsionLaw;
module.exports.parse = function (text) { return loadFormula().parse(text); };
module.exports.presets = {
  /**
   * The default: 1/r^2, as charges push in 3D.
   */
  inverseSquare: function () {
    return { force: 'r^-2', isInverseSquare: true };
  },
  /**
   * 1/r^p. With p = D - 1 this is how charges push in D dimensions (1/r in 2D).
   */
  power: function (p) {
    return { force: 'r^-p', params: { p: p } };
  },
  /**
   * 1/r^2 that fades out exponentially past `length`.
   */
  fading: function (length) {
    return { force: 'exp(-r / L) / r^2', params: { L: length } };
  }
};

var DEFAULT_KEY = 'r^-2';

/**
 * Turns a law description into a compiled law. `spec` is a string (the force expression) or
 * an object:
 *  - `force`: the expression for F(r);
 *  - `params`: { name: number or function(context) returning a number }, read every step with
 *    the step context (see simulator.stepContext());
 *  - `range`: a number, an expression of the parameters, or a function(context). Pairs and
 *    tree cells farther apart than this are skipped;
 *  - `tables`: lookup tables the expression can call, { name: {from, to, values} } (see
 *    formula.createTable);
 *  - `functions`: extra JS functions the expression can call (CPU only).
 */
function createRepulsionLaw(spec) {
  if (!spec) spec = module.exports.presets.inverseSquare();
  if (typeof spec === 'string') spec = { force: spec };
  if (typeof spec.force !== 'string') throw new Error('A repulsion law needs a `force` expression of r');
  if (isPlainDefault(spec)) return createDefaultLaw(spec);
  return createParsedLaw(spec);
}

function isPlainDefault(spec) {
  return compact(spec.force) === DEFAULT_KEY && spec.range === undefined &&
    isEmpty(spec.params) && isEmpty(spec.tables) && isEmpty(spec.functions);
}

function isEmpty(object) {
  return !object || Object.keys(object).length === 0;
}

/**
 * 1/r^2 without parameters: the trees run their stock code, so nothing is parsed until something
 * asks for the law's code (a GPU engine, say).
 */
function createDefaultLaw(spec) {
  var parsed = null;
  function full() {
    if (!parsed) parsed = createParsedLaw(spec);
    return parsed;
  }
  return {
    key: DEFAULT_KEY + '|||',
    tableNames: [],
    isDefault: true,
    hasRange: false,
    paramNames: [],
    functions: {},
    spec: spec,
    get values() { return full().values; },
    // nothing to read: no parameters, no range
    update: function () {},
    describe: function () {
      return { force: spec.force, params: [], builtIns: [], range: null, tables: [], functions: [], isDefault: true, key: DEFAULT_KEY + '|||' };
    },
    prologue: function (valuesName) { return full().prologue(valuesName); },
    emit: function (printer, dimension, rName, k1Name, k2Name) { return full().emit(printer, dimension, rName, k1Name, k2Name); }
  };
}

function loadFormula() {
  if (formula) return formula;
  formula = require('./formula');
  BUILT_IN_VALUES = formula.BUILT_IN_VALUES;
  // Formula functions of numbers (vectors have no place in a law, and select is written ?:)
  BUILT_IN_FUNCTIONS = {};
  Object.keys(formula.BUILTINS).forEach(function (name) {
    var builtIn = formula.BUILTINS[name];
    var numbers = builtIn.result === 'num' && builtIn.args.every(function (arg) { return arg === 'num'; });
    if (numbers) BUILT_IN_FUNCTIONS[name] = builtIn.args.length;
  });
  JS = formula.JS;
  return formula;
}

function createParsedLaw(spec) {
  loadFormula();

  var params = spec.params || {};
  var paramNames = Object.keys(params);
  var known = { r: true, D: true, pi: true };
  paramNames.forEach(function (name) {
    if (!/^[A-Za-z_]\w*$/.test(name) || known[name]) throw new Error('Bad law parameter name: ' + name);
    known[name] = true;
  });
  var tableNames = Object.keys(spec.tables || {});
  var functions = lawFunctions(spec.functions || {}, spec.tables || {});

  var forceTree = lawTree(spec.force, known);
  if (check(forceTree, known, functions) !== 'num') throw new Error('A law should give a number, not a condition: ' + spec.force);
  var rangeTree = typeof spec.range === 'string' ? lawTree(spec.range, known) : null;
  if (rangeTree) {
    if (check(rangeTree, known, functions) !== 'num') throw new Error('Law range should be a number: ' + spec.range);
    if (uses(rangeTree, 'r')) throw new Error('Law range cannot depend on r');
  }
  // Names every formula knows (dt, unit, ...) are read every step, as parameters are
  var builtInNames = [];
  [forceTree, rangeTree].forEach(function (tree) {
    if (tree) collectNames(tree, function (name) {
      if (!known[name] && BUILT_IN_VALUES[name] && builtInNames.indexOf(name) < 0) builtInNames.push(name);
    });
  });
  var userParamCount = paramNames.length;
  paramNames = paramNames.concat(builtInNames);

  var rangeIsFunction = typeof spec.range === 'function';
  var rangeIsNumber = typeof spec.range === 'number';
  var hasRange = rangeTree !== null || rangeIsFunction || rangeIsNumber;
  var isDefault = !hasRange && paramNames.length === 0 && compact(spec.force) === DEFAULT_KEY;

  // Parts of the law that do not depend on r are computed once per step, not once per pair:
  var hoisted = [];
  hoistConstants(forceTree, hoisted);
  var hoistedKeys = hoisted.map(function (h) { return h.key; });

  // Values that the generated code reads at the start of every tree walk. Parameters go by
  // their names; the range and hoisted parts start with $, which a parameter name cannot.
  var values = { $range: Infinity };
  paramNames.concat(hoistedKeys).forEach(function (name) { values[name] = 0; });
  // The default law runs the stock code, which needs none of these (and no new Function()):
  var evaluateRange = rangeTree ? new Function('values', 'functions', 'D', paramPrologue(paramNames, 'values') + 'return ' + toJS(rangeTree) + ';') : null;
  var evaluateHoisted = hoisted.length && !isDefault ? new Function('values', 'functions', 'D', paramPrologue(paramNames, 'values') +
    hoisted.map(function (h) { return 'values.' + h.key + ' = ' + h.code + ';'; }).join(' ')) : null;

  var law = {
    /**
     * Same key, same generated code.
     */
    key: compact(spec.force) + '|' + paramNames.join(',') + '|' + (hasRange ? 'range' : '') + '|' + Object.keys(functions).join(','),
    tableNames: tableNames,
    isDefault: isDefault,
    hasRange: hasRange,
    paramNames: paramNames,
    functions: functions,
    /**
     * The numbers of the coming step (after `update`): parameters by name, the parts computed
     * once per step as `$h<n>` (read as `lawH<n>` by the code `emit` prints) and the range as
     * `$range`. Engines that keep their own copy of the numbers read them here.
     */
    values: values,
    spec: spec,

    /**
     * Reads parameter values (and the range) for the coming step, from the step context (see
     * simulator.stepContext()).
     */
    update: function (context) {
      for (var i = 0; i < paramNames.length; ++i) {
        var name = paramNames[i];
        var value = i < userParamCount ? params[name] : BUILT_IN_VALUES[name];
        values[name] = typeof value === 'function' ? value(context) : value;
      }
      var dimensions = formula.liveSettings(context).dimensions;
      if (rangeIsNumber) values.$range = spec.range;
      else if (rangeIsFunction) values.$range = spec.range(context);
      else if (evaluateRange) values.$range = evaluateRange(values, functions, dimensions);
      if (evaluateHoisted) evaluateHoisted(values, functions, dimensions);
    },

    /**
     * The law as plain data: its expression, parameters ({name, kind: 'number', value},
     * {name, kind: 'host'} for functions), the built in values it reads, range, tables and the
     * names of JS functions.
     */
    describe: function () {
      return {
        force: spec.force,
        params: paramNames.slice(0, userParamCount).map(function (name) {
          var described = describeValue(params[name]);
          described.name = name;
          return described;
        }),
        builtIns: builtInNames.slice(),
        range: spec.range === undefined ? null : describeValue(spec.range),
        tables: tableNames.map(function (name) {
          var table = spec.tables[name];
          return { name: name, from: table.from, to: table.to, values: Float64Array.from(table.values) };
        }),
        functions: Object.keys(spec.functions || {}),
        isDefault: isDefault,
        key: law.key
      };
    },

    /**
     * Code that declares the parameters as local variables, read from `valuesName`.
     */
    prologue: function (valuesName) {
      return paramPrologue(paramNames, valuesName) +
        hoisted.map(function (h) { return ' var ' + h.variable + ' = ' + valuesName + '.' + h.key + ';'; }).join('') +
        (hasRange ? ' var lawRange = ' + valuesName + '.$range, lawRange2 = lawRange * lawRange;' : '');
    },

    /**
     * Code that sets `k1Name` to F(r) / r (and `k2Name`, when given, to (F(r)/r - F'(r)) / r^2),
     * where `rName` holds the distance and the parameters are in local variables (`law_<name>`,
     * and `lawH<n>` for the parts computed once per step). `printer` spells the code (see
     * formula.js; JS when left out: `emit(dimension, rName, k1Name, k2Name)`).
     */
    emit: function (printer, dimension, rName, k1Name, k2Name) {
      if (typeof printer === 'number') return emitKernel(forceTree, printer, dimension, rName, k1Name, JS);
      return emitKernel(forceTree, dimension, rName, k1Name, k2Name, printer);
    }
  };
  return law;
}

/**
 * Marks the parts of the expression that do not depend on r, so they are computed once per
 * step: every largest such part that is more than a name or a number, and every divisor (whose
 * reciprocal is computed, so the division becomes a multiplication). Names depend on the
 * expression only, so all laws with the same expression share the generated code. A hoisted
 * part is `lawH<n>` in the generated code (parameters are `law_<name>`) and `$h<n>` in values.
 */
function hoistConstants(tree, hoisted) {
  // Named values make the tree a graph: a shared part is looked at (and hoisted) once
  var seen = new Map();
  var dependsOnR = visit(tree);
  if (!dependsOnR) mark(tree);
  return hoisted;

  function visit(node) {
    if (seen.has(node)) return seen.get(node);
    var parts = children(node);
    var childDepends = parts.map(visit);
    var depends = node.type === 'var' ? node.name === 'r' : childDepends.some(Boolean);
    if (depends) {
      parts.forEach(function (child, i) { if (!childDepends[i]) mark(child); });
      if (node.type === 'bin' && node.op === '/' && !childDepends[1] && !node.reciprocal) {
        node.reciprocal = hoist('1 / ' + toJS(node.b));
      }
    }
    seen.set(node, depends);
    return depends;
  }

  function mark(node) {
    if (node.type === 'num' || node.type === 'var' || node.hoisted) return;
    // A condition is not a number, so it cannot be one of the law's values; its parts can
    if (formula.isCondition(node)) children(node).forEach(mark);
    else node.hoisted = hoist(toJS(node));
  }

  function hoist(code) {
    var n = hoisted.length;
    hoisted.push({ variable: 'lawH' + n, key: '$h' + n, code: code });
    return 'lawH' + n;
  }
}

// A number, an expression, or a function (called by engines with the step context)
function describeValue(spec) {
  if (typeof spec === 'number') return { kind: 'number', value: spec };
  if (typeof spec === 'string') return { kind: 'expression', text: spec };
  return { kind: 'host' };
}

function paramPrologue(paramNames, valuesName) {
  return paramNames.map(function (name) { return 'var law_' + name + ' = ' + valuesName + '.' + name + ';'; }).join(' ');
}

function compact(text) {
  return text.replace(/\s+/g, '');
}


/**
 * Parses a law: an expression of r, optionally after named values (`'u = r / L; exp(-u) / r^2'`).
 * A named value becomes a part of the tree that every use shares.
 */
function lawTree(text, known) {
  var statements = formula.parseProgram(text);
  var named = Object.create(null);
  var used = Object.create(null);
  var tree = null;
  statements.forEach(function (statement, at) {
    if (statement.target === null) {
      if (at !== statements.length - 1) throw new Error('Only the last part of a law can be its expression: ' + text);
      tree = substitute(statement.expr);
      return;
    }
    var name = statement.target;
    if (statement.op !== '=') throw new Error('Law values are set with =, not ' + statement.op + ': ' + text);
    if (named[name] || known[name] || BUILT_IN_VALUES[name]) throw new Error(name + ' already has a meaning in law ' + text);
    named[name] = substitute(statement.expr);
  });
  if (!tree) throw new Error('A law should end with the expression of F(r): ' + text);
  Object.keys(named).forEach(function (name) {
    if (!used[name]) throw new Error(name + ' is computed but never used in law ' + text);
  });
  return tree;

  function substitute(node) {
    if (node.type === 'var' && named[node.name]) {
      used[node.name] = true;
      return named[node.name];
    }
    var copy = {};
    Object.keys(node).forEach(function (key) { copy[key] = node[key]; });
    if (node.args) copy.args = node.args.map(substitute);
    if (node.a) copy.a = substitute(node.a);
    if (node.b) copy.b = substitute(node.b);
    return copy;
  }
}

/**
 * Custom functions and lookup tables, as {name: {value, derivative}}.
 */
function lawFunctions(functions, tables) {
  var all = {};
  Object.keys(functions).forEach(function (name) { all[name] = functions[name]; });
  Object.keys(tables).forEach(function (name) {
    if (all[name]) throw new Error(name + ' is both a function and a table');
    var table = formula.createTable(name, tables[name]);
    all[name] = { value: table.value, derivative: table.derivative };
  });
  return all;
}

/**
 * Checks names, functions and types. Returns 'num' or 'bool' (a condition).
 */
function check(node, known, functions) {
  switch (node.type) {
    case 'num': return 'num';
    case 'var':
      if (!known[node.name] && !BUILT_IN_VALUES[node.name]) throw new Error('Unknown name in law expression: ' + node.name);
      return 'num';
    case 'index': throw new Error('Laws cannot read ' + node.name + '[...]');
    case 'neg': return expect(node.a, 'num');
    case 'not':
      expect(node.a, 'bool');
      return 'bool';
    case 'bin':
      if (node.op === '&&' || node.op === '||') {
        expect(node.a, 'bool');
        expect(node.b, 'bool');
        return 'bool';
      }
      expect(node.a, 'num');
      expect(node.b, 'num');
      return formula.isCondition(node) ? 'bool' : 'num';
    case 'call':
      if (node.name === 'select') {
        if (node.args.length !== 3) throw new Error('select() expects 3 arguments');
        expect(node.args[0], 'bool');
        expect(node.args[1], 'num');
        return expect(node.args[2], 'num');
      }
      var arity = BUILT_IN_FUNCTIONS[node.name];
      if (arity === undefined) {
        if (formula.FUNCTIONS[node.name]) throw new Error('Laws work on numbers; ' + node.name + '() is for vectors');
        var custom = functions[node.name];
        if (!custom || typeof custom.value !== 'function') throw new Error('Unknown function in law expression: ' + node.name);
        arity = 1;
      }
      if (node.args.length !== arity) throw new Error(node.name + '() expects ' + arity + ' argument(s)');
      node.args.forEach(function (arg) { expect(arg, 'num'); });
      return 'num';
  }
  throw new Error('Unknown law node ' + node.type);

  function expect(child, type) {
    var actual = check(child, known, functions);
    if (actual !== type) {
      throw new Error(type === 'num' ? 'A condition is used as a number in a law (use select(condition, 1, 0))' :
        'Expected a condition (such as a < b) in a law');
    }
    return actual;
  }
}

function uses(node, name) {
  if (node.type === 'var') return node.name === name;
  return children(node).some(function (child) { return uses(child, name); });
}

function collectNames(node, fn) {
  if (node.type === 'var') fn(node.name);
  children(node).forEach(function (child) { collectNames(child, fn); });
}

// Plain JS for an expression without derivatives (used for the range); `D` stays a variable
function toJS(node) {
  switch (node.type) {
    case 'num': return numberLiteral(node.value);
    case 'var':
      if (node.name === 'pi') return numberLiteral(Math.PI);
      return node.name === 'D' ? 'D' : 'law_' + node.name;
    case 'neg': return '(-' + toJS(node.a) + ')';
    case 'not': return '(!' + toJS(node.a) + ')';
    case 'bin':
      if (node.op === '^') return JS.call('pow', [toJS(node.a), toJS(node.b)]);
      return '(' + toJS(node.a) + ' ' + JS.operator(node.op) + ' ' + toJS(node.b) + ')';
    case 'call':
      var args = node.args.map(toJS);
      if (node.name === 'select') return JS.choose(args[0], args[1], args[2]);
      if (BUILT_IN_FUNCTIONS[node.name]) return JS.call(node.name, args);
      return 'functions.' + node.name + '.value(' + args.join(', ') + ')';
  }
}

/**
 * Value of an expression made of numbers and D only (NaN for anything else).
 */
function fold(node, dimension) {
  switch (node.type) {
    case 'num': return node.value;
    case 'var': return node.name === 'D' ? dimension : node.name === 'pi' ? Math.PI : NaN;
    case 'neg': return -fold(node.a, dimension);
    case 'bin':
      var a = fold(node.a, dimension), b = fold(node.b, dimension);
      if (node.op === '+') return a + b;
      if (node.op === '-') return a - b;
      if (node.op === '*') return a * b;
      if (node.op === '/') return a / b;
      if (node.op === '^') return Math.pow(a, b);
  }
  return NaN;
}

function children(node) {
  return formula.children(node);
}

function numberLiteral(value) {
  var text = String(value);
  return value < 0 ? '(' + text + ')' : text;
}

// ---------------------------------------------------------------------------------------
// Code for F(r)/r and (F(r)/r - F'(r))/r^2
// ---------------------------------------------------------------------------------------

// Drops temporaries that nothing reads, e.g. a / b when F / r is computed as a / (b * r), or
// derivatives that only k2 would need. `declared[i]` names the temporary that line i declares.
function dropUnused(lines, declared) {
  var kept = [], read = '';
  for (var i = lines.length - 1; i >= 0; --i) {
    if (declared[i] && !new RegExp('\\b' + declared[i] + '\\b').test(read)) continue;
    kept.unshift(lines[i]);
    read += ' ' + lines[i];
  }
  return kept;
}

/**
 * Forward mode differentiation: every node becomes a value and a derivative with respect to r.
 * Each is either a constant number, or code in a temporary variable. A derivative of `null`
 * means 0 (the node does not depend on r).
 */
function emitKernel(tree, dimension, rName, k1Name, k2Name, printer) {
  var lines = [], declared = [];
  var temp = 0;
  var prefix = k1Name + '_';
  // Parts shared by named values are written once
  var done = new Map();

  var force = visit(tree, k2Name !== undefined);
  if (force.dividend !== undefined) {
    // F = a / b: one division for F / r
    push(printer.result(k1Name, force.dividend + ' / (' + force.divisor + ' * ' + rName + ')'));
  } else {
    push(printer.result(k1Name, force.v + ' / ' + rName));
  }
  if (k2Name !== undefined) {
    var derivative = force.d === null ? printer.number(0) : force.d;
    push(printer.result(k2Name, '(' + k1Name + ' - ' + derivative + ') / (' + rName + ' * ' + rName + ')'));
  }
  return dropUnused(lines, declared).join(' ');

  function push(line, name) {
    lines.push(line);
    declared.push(name || null);
  }
  function save(code) {
    if (/^[\w.]+$/.test(code)) return code;
    var name = prefix + (temp++);
    push(printer.declare(name, code, 'temp'), name);
    return name;
  }
  function constant(node) { return node.d === null; }

  // Returns {v: code, d: code or null}
  function visit(node, needDerivative) {
    var result = done.get(node);
    if (!result) {
      result = visitOnce(node, needDerivative);
      done.set(node, result);
    }
    return result;
  }

  function visitOnce(node, needDerivative) {
    if (node.hoisted) {
      // Numbers and D only: known right now
      var known = fold(node, dimension);
      return { v: Number.isFinite(known) ? printer.number(known) : node.hoisted, d: null };
    }
    switch (node.type) {
      case 'num': return { v: printer.number(node.value), d: null };
      case 'var':
        if (node.name === 'r') return { v: rName, d: printer.number(1) };
        if (node.name === 'D') return { v: printer.number(dimension), d: null };
        if (node.name === 'pi') return { v: printer.number(Math.PI), d: null };
        return { v: 'law_' + node.name, d: null };
      case 'neg':
        var arg = visit(node.a, needDerivative);
        return { v: save('-' + arg.v), d: arg.d === null ? null : save('-' + arg.d) };
      case 'not':
        // conditions have no derivative
        return { v: save('!' + visit(node.a, needDerivative).v), d: null };
      case 'bin': return binary(node, needDerivative);
      case 'call': return call(node, needDerivative);
    }
  }

  function binary(node, needDerivative) {
    if (node.op === '^') return power(visit(node.a, needDerivative), node.b, needDerivative);
    var a = visit(node.a, needDerivative), b = visit(node.b, needDerivative);
    if (formula.isCondition(node)) return { v: save(a.v + ' ' + printer.operator(node.op) + ' ' + b.v), d: null };
    if (node.reciprocal) {
      // a / b with b fixed for the step: multiply by 1 / b
      var reciprocal = node.reciprocal;
      var product = save(a.v + ' * ' + reciprocal);
      return { v: product, d: needDerivative && !constant(a) ? save(a.d + ' * ' + reciprocal) : null };
    }
    var v = save(a.v + ' ' + node.op + ' ' + b.v);
    var result = node.op === '/' ? { v: v, d: null, dividend: a.v, divisor: b.v } : { v: v, d: null };
    if (!needDerivative || (constant(a) && constant(b))) return result;
    var d;
    if (node.op === '+' || node.op === '-') {
      if (constant(a)) d = node.op === '+' ? b.d : '-' + b.d;
      else if (constant(b)) d = a.d;
      else d = a.d + ' ' + node.op + ' ' + b.d;
    } else if (node.op === '*') {
      if (constant(a)) d = a.v + ' * ' + b.d;
      else if (constant(b)) d = a.d + ' * ' + b.v;
      else d = a.d + ' * ' + b.v + ' + ' + a.v + ' * ' + b.d;
    } else {
      // (a / b)' = a'/b - (a/b) * b'/b
      if (constant(b)) d = a.d + ' / ' + b.v;
      else if (constant(a)) d = '-' + v + ' * ' + b.d + ' / ' + b.v;
      else d = '(' + a.d + ' - ' + v + ' * ' + b.d + ') / ' + b.v;
    }
    result.d = save(d);
    return result;
  }

  function power(base, exponentNode, needDerivative) {
    var exponent = visit(exponentNode, needDerivative);
    var v, d = null;
    if (constant(exponent)) {
      var n = fold(exponentNode, dimension);
      if (Number.isInteger(n) && n >= -4 && n <= 4) {
        v = save(integerPower(base.v, n));
      } else {
        v = save(printer.call('pow', [base.v, exponent.v]));
      }
      if (needDerivative && !constant(base)) {
        // (b^n)' = n * b^n / b * b'
        d = save(exponent.v + ' * ' + v + ' / ' + base.v + ' * ' + base.d);
      }
      return { v: v, d: d };
    }
    v = save(printer.call('pow', [base.v, exponent.v]));
    if (needDerivative) {
      // (b^e)' = b^e * (e' * log(b) + e * b' / b)
      var parts = [exponent.d + ' * ' + printer.call('log', [base.v])];
      if (!constant(base)) parts.push(exponent.v + ' * ' + base.d + ' / ' + base.v);
      d = save(v + ' * (' + parts.join(' + ') + ')');
    }
    return { v: v, d: d };
  }

  function integerPower(base, n) {
    if (n === 0) return printer.number(1);
    var product = [];
    for (var i = 0; i < Math.abs(n); ++i) product.push(base);
    var text = product.join(' * ');
    return n > 0 ? '(' + text + ')' : printer.number(1) + ' / (' + text + ')';
  }

  function call(node, needDerivative) {
    var args = node.args.map(function (arg) { return visit(arg, needDerivative); });
    var a = args[0], b = args[1];
    var v, d = null;
    var allConstant = args.every(constant);
    if (node.name === 'select') {
      v = save(printer.choose(a.v, b.v, args[2].v));
      if (needDerivative && !(constant(b) && constant(args[2]))) {
        d = save(printer.choose(a.v, constant(b) ? printer.number(0) : b.d, constant(args[2]) ? printer.number(0) : args[2].d));
      }
      return { v: v, d: d };
    }
    if (node.name === 'pow') return power(a, node.args[1], needDerivative);
    var builtIn = BUILT_IN_FUNCTIONS[node.name] ? formula.BUILTINS[node.name] : null;
    if (builtIn) {
      v = save(printer.call(node.name, args.map(function (arg) { return arg.v; })));
      // functions without a derivative are steps: 0 almost everywhere
      if (needDerivative && !allConstant && builtIn.derivative) d = save(builtIn.derivative(printer, args, v));
      return { v: v, d: d };
    }
    v = save('lawFunctions.' + node.name + '.value(' + a.v + ')');
    if (needDerivative && !allConstant) {
      var custom = 'lawFunctions.' + node.name + '.derivative';
      d = save('(' + custom + ' ? ' + custom + '(' + a.v + ') : 0) * ' + a.d);
    }
    return { v: v, d: d };
  }
}
