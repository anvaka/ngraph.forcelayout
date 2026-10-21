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
 * Expressions know `+ - * / ^`, parentheses, numbers, `r`, `D` (the number of dimensions),
 * the law's parameters, and the functions exp, log, sqrt, abs, min, max, pow, tanh, sin, cos.
 * Other functions can be passed in as `functions: { name: { value: fn, derivative: fn } }`.
 */
module.exports = createRepulsionLaw;
module.exports.parse = parse;
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
 *  - `params`: { name: number or function(simulator) returning a number }, read every step;
 *  - `range`: a number, an expression of the parameters, or a function(simulator). Pairs and
 *    tree cells farther apart than this are skipped;
 *  - `functions`: extra functions the expression can call.
 */
function createRepulsionLaw(spec) {
  if (!spec) spec = module.exports.presets.inverseSquare();
  if (typeof spec === 'string') spec = { force: spec };
  if (typeof spec.force !== 'string') throw new Error('A repulsion law needs a `force` expression of r');

  var params = spec.params || {};
  var paramNames = Object.keys(params);
  var functions = spec.functions || {};
  var known = { r: true, D: true };
  paramNames.forEach(function (name) {
    if (!/^[A-Za-z_]\w*$/.test(name) || name === 'r' || name === 'D') throw new Error('Bad law parameter name: ' + name);
    known[name] = true;
  });

  var forceTree = parse(spec.force);
  check(forceTree, known, functions);
  var rangeTree = typeof spec.range === 'string' ? parse(spec.range) : null;
  if (rangeTree) {
    check(rangeTree, known, functions);
    if (uses(rangeTree, 'r')) throw new Error('Law range cannot depend on r');
  }

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
    isDefault: isDefault,
    hasRange: hasRange,
    paramNames: paramNames,
    functions: functions,
    values: values,
    spec: spec,

    /**
     * Reads parameter values (and the range) for the coming step.
     */
    update: function (simulator) {
      for (var i = 0; i < paramNames.length; ++i) {
        var name = paramNames[i];
        var value = params[name];
        values[name] = typeof value === 'function' ? value(simulator) : value;
      }
      var dimensions = simulator.settings.dimensions;
      if (rangeIsNumber) values.$range = spec.range;
      else if (rangeIsFunction) values.$range = spec.range(simulator);
      else if (evaluateRange) values.$range = evaluateRange(values, functions, dimensions);
      if (evaluateHoisted) evaluateHoisted(values, functions, dimensions);
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
     * where `rName` holds the distance and the parameters are in local variables.
     */
    emit: function (dimension, rName, k1Name, k2Name) {
      return emitKernel(forceTree, dimension, rName, k1Name, k2Name, JS);
    },

    /**
     * The same code in WGSL, for GPU engines. `k1Name` and `k2Name` are declared with `let`.
     */
    emitWGSL: function (dimension, rName, k1Name, k2Name) {
      if (Object.keys(functions).length) throw new Error('Laws with custom functions cannot run on the GPU');
      return emitKernel(forceTree, dimension, rName, k1Name, k2Name, WGSL);
    },

    /**
     * How many numbers `writeValues` writes: the parameters, the hoisted parts and, with a
     * range, the squared range.
     */
    valueCount: paramNames.length + hoisted.length + (hasRange ? 1 : 0),

    /**
     * Writes the numbers of the coming step (after `update`) into `out` from `offset`, as f32
     * friendly values for a GPU buffer.
     */
    writeValues: function (out, offset) {
      var names = paramNames.concat(hoistedKeys);
      for (var i = 0; i < names.length; ++i) out[offset + i] = values[names[i]];
      // f32 has no room for a squared range past 1e19, and some GPUs mishandle infinity
      if (hasRange) out[offset + names.length] = Math.min(values.$range * values.$range, 3e38);
    },

    /**
     * WGSL that declares the law's numbers, where `read(i)` is an expression for the i-th
     * number written by `writeValues`. A range is declared as `lawRange2` (squared).
     */
    wgslPrologue: function (read) {
      var names = paramNames.map(function (name) { return 'law_' + name; })
        .concat(hoisted.map(function (h) { return h.variable; }));
      var lines = names.map(function (name, i) { return 'let ' + name + ' = ' + read(i) + ';'; });
      if (hasRange) lines.push('let lawRange2 = ' + read(names.length) + ';');
      return lines.join(' ');
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
  var dependsOnR = visit(tree);
  if (!dependsOnR) mark(tree);
  return hoisted;

  function visit(node) {
    var children = node.args || [node.a, node.b].filter(Boolean);
    var childDepends = children.map(visit);
    var depends = node.type === 'var' ? node.name === 'r' : childDepends.some(Boolean);
    if (depends) {
      children.forEach(function (child, i) { if (!childDepends[i]) mark(child); });
      if (node.type === 'bin' && node.op === '/' && !childDepends[1]) {
        node.reciprocal = hoist('1 / ' + toJS(node.b));
      }
    }
    return depends;
  }

  function mark(node) {
    if (node.type === 'num' || node.type === 'var') return;
    node.hoisted = hoist(toJS(node));
  }

  function hoist(code) {
    var n = hoisted.length;
    hoisted.push({ variable: 'lawH' + n, key: '$h' + n, code: code });
    return 'lawH' + n;
  }
}

function paramPrologue(paramNames, valuesName) {
  return paramNames.map(function (name) { return 'var law_' + name + ' = ' + valuesName + '.' + name + ';'; }).join(' ');
}

function compact(text) {
  return text.replace(/\s+/g, '');
}

// ---------------------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------------------

function tokenize(text) {
  var tokens = [];
  var re = /\s*(?:(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)|(\*\*|[-+*/^(),]))/y;
  var at = 0;
  while (at < text.length) {
    if (/^\s*$/.test(text.slice(at))) break;
    re.lastIndex = at;
    var match = re.exec(text);
    if (!match) throw new Error('Cannot read law expression at "' + text.slice(at) + '"');
    if (match[1] !== undefined) tokens.push({ type: 'num', value: Number(match[1]) });
    else if (match[2] !== undefined) tokens.push({ type: 'id', value: match[2] });
    else tokens.push({ type: 'op', value: match[3] === '**' ? '^' : match[3] });
    at = re.lastIndex;
  }
  return tokens;
}

/**
 * Parses an expression into a tree of {type: 'num' | 'var' | 'neg' | 'bin' | 'call'} nodes.
 */
function parse(text) {
  var tokens = tokenize(text);
  var at = 0;
  var tree = expression();
  if (at < tokens.length) throw new Error('Unexpected "' + tokens[at].value + '" in law expression ' + text);
  return tree;

  function peek(value) { return at < tokens.length && tokens[at].type === 'op' && tokens[at].value === value; }
  function expect(value) {
    if (!peek(value)) throw new Error('Expected "' + value + '" in law expression ' + text);
    at++;
  }
  function expression() {
    var node = term();
    while (peek('+') || peek('-')) {
      var op = tokens[at++].value;
      node = { type: 'bin', op: op, a: node, b: term() };
    }
    return node;
  }
  function term() {
    var node = unary();
    while (peek('*') || peek('/')) {
      var op = tokens[at++].value;
      node = { type: 'bin', op: op, a: node, b: unary() };
    }
    return node;
  }
  function unary() {
    if (peek('-')) { at++; return { type: 'neg', a: unary() }; }
    if (peek('+')) { at++; return unary(); }
    return power();
  }
  function power() {
    var base = primary();
    if (peek('^')) { at++; return { type: 'bin', op: '^', a: base, b: unary() }; }
    return base;
  }
  function primary() {
    var token = tokens[at++];
    if (!token) throw new Error('Law expression ends too early: ' + text);
    if (token.type === 'num') return { type: 'num', value: token.value };
    if (token.type === 'id') {
      if (peek('(')) {
        at++;
        var args = [];
        if (!peek(')')) {
          args.push(expression());
          while (peek(',')) { at++; args.push(expression()); }
        }
        expect(')');
        return { type: 'call', name: token.value, args: args };
      }
      return { type: 'var', name: token.value };
    }
    if (token.value === '(') {
      var inner = expression();
      expect(')');
      return inner;
    }
    throw new Error('Unexpected "' + token.value + '" in law expression ' + text);
  }
}

var BUILT_IN_FUNCTIONS = { exp: 1, log: 1, sqrt: 1, abs: 1, tanh: 1, sin: 1, cos: 1, min: 2, max: 2, pow: 2 };

function check(node, known, functions) {
  if (node.type === 'var' && !known[node.name]) throw new Error('Unknown name in law expression: ' + node.name);
  if (node.type === 'call') {
    var arity = BUILT_IN_FUNCTIONS[node.name];
    if (arity === undefined) {
      var custom = functions[node.name];
      if (!custom || typeof custom.value !== 'function') throw new Error('Unknown function in law expression: ' + node.name);
      arity = 1;
    }
    if (node.args.length !== arity) throw new Error(node.name + '() expects ' + arity + ' argument(s)');
  }
  if (node.a) check(node.a, known, functions);
  if (node.b) check(node.b, known, functions);
  if (node.args) node.args.forEach(function (arg) { check(arg, known, functions); });
}

function uses(node, name) {
  if (node.type === 'var') return node.name === name;
  return (node.a && uses(node.a, name)) || (node.b && uses(node.b, name)) ||
    (node.args ? node.args.some(function (arg) { return uses(arg, name); }) : false);
}

// Plain JS for an expression without derivatives (used for the range); `D` stays a variable
function toJS(node) {
  switch (node.type) {
    case 'num': return numberLiteral(node.value);
    case 'var': return node.name === 'D' ? 'D' : 'law_' + node.name;
    case 'neg': return '(-' + toJS(node.a) + ')';
    case 'bin':
      if (node.op === '^') return 'Math.pow(' + toJS(node.a) + ', ' + toJS(node.b) + ')';
      return '(' + toJS(node.a) + ' ' + node.op + ' ' + toJS(node.b) + ')';
    case 'call':
      var args = node.args.map(toJS).join(', ');
      if (BUILT_IN_FUNCTIONS[node.name]) return 'Math.' + node.name + '(' + args + ')';
      return 'functions.' + node.name + '.value(' + args + ')';
  }
}

/**
 * Value of an expression made of numbers and D only (NaN for anything else).
 */
function fold(node, dimension) {
  switch (node.type) {
    case 'num': return node.value;
    case 'var': return node.name === 'D' ? dimension : NaN;
    case 'neg': return -fold(node.a, dimension);
    case 'bin':
      var a = fold(node.a, dimension), b = fold(node.b, dimension);
      if (node.op === '+') return a + b;
      if (node.op === '-') return a - b;
      if (node.op === '*') return a * b;
      if (node.op === '/') return a / b;
      return Math.pow(a, b);
  }
  return NaN;
}

function numberLiteral(value) {
  var text = String(value);
  return value < 0 ? '(' + text + ')' : text;
}

// ---------------------------------------------------------------------------------------
// Code for F(r)/r and (F(r)/r - F'(r))/r^2
// ---------------------------------------------------------------------------------------

// How the kernel is written: JS for the trees, WGSL for GPU engines
var JS = {
  declare: 'var ',
  result: '',
  call: function (name) { return 'Math.' + name; },
  choose: function (condition, yes, no) { return '(' + condition + ' ? ' + yes + ' : ' + no + ')'; },
  number: numberLiteral
};

var WGSL = {
  declare: 'let ',
  result: 'let ',
  call: function (name) { return name; },
  choose: function (condition, yes, no) { return 'select(' + no + ', ' + yes + ', ' + condition + ')'; },
  // Always with a decimal point: 1 / 2 between integer literals is 0 in WGSL
  number: function (value) {
    if (!Number.isFinite(value)) throw new Error('Law has a number the GPU cannot use: ' + value);
    var text = String(value);
    if (/^-?\d+$/.test(text)) text += '.0';
    return value < 0 ? '(' + text + ')' : text;
  }
};

// Drops temporaries that nothing reads, e.g. a / b when F / r is computed as a / (b * r), or
// derivatives that only k2 would need
function dropUnused(lines, prefix) {
  var kept = [], read = '';
  for (var i = lines.length - 1; i >= 0; --i) {
    var declared = /^(?:var|let) (\w+) = /.exec(lines[i]);
    if (declared && declared[1].indexOf(prefix) === 0 && !new RegExp('\\b' + declared[1] + '\\b').test(read)) continue;
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
function emitKernel(tree, dimension, rName, k1Name, k2Name, target) {
  var lines = [];
  var temp = 0;
  var prefix = k1Name + '_';

  var force = visit(tree, k2Name !== undefined);
  if (force.dividend !== undefined) {
    // F = a / b: one division for F / r
    lines.push(target.result + k1Name + ' = ' + force.dividend + ' / (' + force.divisor + ' * ' + rName + ');');
  } else {
    lines.push(target.result + k1Name + ' = ' + force.v + ' / ' + rName + ';');
  }
  if (k2Name !== undefined) {
    var derivative = force.d === null ? target.number(0) : force.d;
    lines.push(target.result + k2Name + ' = (' + k1Name + ' - ' + derivative + ') / (' + rName + ' * ' + rName + ');');
  }
  return dropUnused(lines, prefix).join(' ');

  function save(code) {
    if (/^[\w.]+$/.test(code)) return code;
    var name = prefix + (temp++);
    lines.push(target.declare + name + ' = ' + code + ';');
    return name;
  }
  function constant(node) { return node.d === null; }

  // Returns {v: code, d: code or null}
  function visit(node, needDerivative) {
    if (node.hoisted) {
      // Numbers and D only: known right now
      var known = fold(node, dimension);
      return { v: Number.isFinite(known) ? target.number(known) : node.hoisted, d: null };
    }
    switch (node.type) {
      case 'num': return { v: target.number(node.value), d: null };
      case 'var':
        if (node.name === 'r') return { v: rName, d: target.number(1) };
        if (node.name === 'D') return { v: target.number(dimension), d: null };
        return { v: 'law_' + node.name, d: null };
      case 'neg':
        var arg = visit(node.a, needDerivative);
        return { v: save('-' + arg.v), d: arg.d === null ? null : save('-' + arg.d) };
      case 'bin': return binary(node, needDerivative);
      case 'call': return call(node, needDerivative);
    }
  }

  function binary(node, needDerivative) {
    if (node.op === '^') return power(visit(node.a, needDerivative), node.b, needDerivative);
    var a = visit(node.a, needDerivative), b = visit(node.b, needDerivative);
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
        v = save(target.call('pow') + '(' + base.v + ', ' + exponent.v + ')');
      }
      if (needDerivative && !constant(base)) {
        // (b^n)' = n * b^n / b * b'
        d = save(exponent.v + ' * ' + v + ' / ' + base.v + ' * ' + base.d);
      }
      return { v: v, d: d };
    }
    v = save(target.call('pow') + '(' + base.v + ', ' + exponent.v + ')');
    if (needDerivative) {
      // (b^e)' = b^e * (e' * log(b) + e * b' / b)
      var parts = [exponent.d + ' * ' + target.call('log') + '(' + base.v + ')'];
      if (!constant(base)) parts.push(exponent.v + ' * ' + base.d + ' / ' + base.v);
      d = save(v + ' * (' + parts.join(' + ') + ')');
    }
    return { v: v, d: d };
  }

  function integerPower(base, n) {
    if (n === 0) return target.number(1);
    var product = [];
    for (var i = 0; i < Math.abs(n); ++i) product.push(base);
    var text = product.join(' * ');
    return n > 0 ? '(' + text + ')' : target.number(1) + ' / (' + text + ')';
  }

  function call(node, needDerivative) {
    var args = node.args.map(function (arg) { return visit(arg, needDerivative); });
    var a = args[0], b = args[1];
    var v, d = null;
    var allConstant = args.every(constant);
    switch (node.name) {
      case 'exp':
        v = save(target.call('exp') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save(v + ' * ' + a.d);
        break;
      case 'log':
        v = save(target.call('log') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save(a.d + ' / ' + a.v);
        break;
      case 'sqrt':
        v = save(target.call('sqrt') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save(a.d + ' / (' + target.number(2) + ' * ' + v + ')');
        break;
      case 'abs':
        v = save(target.call('abs') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save(target.choose(a.v + ' < ' + target.number(0), '-' + a.d, a.d));
        break;
      case 'tanh':
        v = save(target.call('tanh') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save('(' + target.number(1) + ' - ' + v + ' * ' + v + ') * ' + a.d);
        break;
      case 'sin':
        v = save(target.call('sin') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save(target.call('cos') + '(' + a.v + ') * ' + a.d);
        break;
      case 'cos':
        v = save(target.call('cos') + '(' + a.v + ')');
        if (needDerivative && !allConstant) d = save('-' + target.call('sin') + '(' + a.v + ') * ' + a.d);
        break;
      case 'min':
      case 'max':
        v = save(target.call(node.name) + '(' + a.v + ', ' + b.v + ')');
        if (needDerivative && !allConstant) {
          var pickA = a.v + (node.name === 'min' ? ' <= ' : ' >= ') + b.v;
          d = save(target.choose(pickA, a.d === null ? target.number(0) : a.d, b.d === null ? target.number(0) : b.d));
        }
        break;
      case 'pow':
        return power(a, node.args[1], needDerivative);
      default:
        v = save('lawFunctions.' + node.name + '.value(' + a.v + ')');
        if (needDerivative && !allConstant) {
          var custom = 'lawFunctions.' + node.name + '.derivative';
          d = save('(' + custom + ' ? ' + custom + '(' + a.v + ') : 0) * ' + a.d);
        }
    }
    return { v: v, d: d };
  }
}
