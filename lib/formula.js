/**
 * The formula language. Ideas describe their physics as small formulas, and the simulator
 * compiles them into its own loops: the repulsion law into the trees (repulsionLaw.js), and
 * formulas over bodies, links and close pairs into stages (formulaStages.js). A formula is plain
 * arithmetic with no loops and no calls into JavaScript, so other engines (such as a GPU one) can
 * compile the same text.
 *
 * A formula is one or more statements separated by `;`:
 *
 *   w = c * (1 / mass_i + 1 / mass_j);   a named value
 *   stiff_i += w;                        adds into a column
 *   push = w * (1 - r / h)               an output of the stage
 *
 * The last statement may be a bare expression instead: the value of a sum or of a law. `//`
 * starts a comment that runs to the end of the line.
 *
 * Expressions know numbers, names, `+ - * / ^` (also `**`), comparisons `< <= > >= == !=`,
 * `&& || !`, `c ? a : b` (also written `select(c, a, b)`; both sides may be computed), and the
 * functions exp, log, sqrt, abs, sign, floor, ceil, round, tanh, sin, cos, min, max, pow,
 * clamp(x, lo, hi), and for vectors dot(a, b) and length(a). A comparison is a condition, not a
 * number: write `select(a < b, 1, 0)` to count it.
 *
 * Vectors have D numbers: positions, velocities, forces, and sums of them. They add and subtract,
 * multiply or divide by numbers, and pick with `?:`.
 *
 * Every formula can read `D` (number of dimensions), `pi`, and the values of BUILT_IN_VALUES.
 */
module.exports.parse = parse;
module.exports.parseProgram = parseProgram;
module.exports.children = children;
module.exports.compile = compile;
module.exports.createTable = createTable;
module.exports.numberLiteral = numberLiteral;
module.exports.isCondition = isCondition;

/**
 * Functions every formula knows, by number of arguments. `round` and `clamp` are rewritten when
 * parsed (into floor(x + 0.5), so that every engine rounds halves up, and min(max(x, lo), hi)).
 */
var FUNCTIONS = {
  exp: 1, log: 1, sqrt: 1, abs: 1, sign: 1, floor: 1, ceil: 1, tanh: 1, sin: 1, cos: 1,
  min: 2, max: 2, pow: 2, select: 3, dot: 2, length: 1
};

/**
 * Names every formula can read. They change at most once per step.
 */
var BUILT_IN_VALUES = {
  // number of bodies
  n: function (simulator) { return simulator.store.n; },
  // number of steps done so far
  step: function (simulator) { return simulator.iteration(); },
  dt: function (simulator) { return simulator.settings.timeStep; },
  // the spring length, never below a small positive number (see simulator.unit())
  unit: function (simulator) { return simulator.unit(); },
  springLength: setting('springLength'),
  springCoefficient: setting('springCoefficient'),
  gravity: setting('gravity'),
  dragCoefficient: setting('dragCoefficient'),
  theta: setting('theta'),
  timeStep: setting('timeStep'),
  maxVelocity: setting('maxVelocity')
};

module.exports.FUNCTIONS = FUNCTIONS;
module.exports.BUILT_IN_VALUES = BUILT_IN_VALUES;

function setting(name) {
  return function (simulator) { return simulator.settings[name]; };
}

var COMPARISONS = { '<': true, '<=': true, '>': true, '>=': true, '==': true, '!=': true };
var ASSIGNMENTS = { '=': true, '+=': true, '-=': true, '*=': true, '/=': true };

// ---------------------------------------------------------------------------------------
// Parsing
// ---------------------------------------------------------------------------------------

var TOKEN = /(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)|(\*\*|===|!==|<=|>=|==|!=|&&|\|\||\+=|-=|\*=|\/=|[-+*/^(),;?:[\]<>!=])/y;
var SPACE = /(?:\s+|\/\/[^\n]*)*/y;

function tokenize(text) {
  var tokens = [];
  var at = 0;
  while (true) {
    SPACE.lastIndex = at;
    SPACE.exec(text);
    at = SPACE.lastIndex;
    if (at >= text.length) break;
    TOKEN.lastIndex = at;
    var match = TOKEN.exec(text);
    if (!match) throw new Error('Cannot read formula at "' + text.slice(at) + '"');
    if (match[1] !== undefined) tokens.push({ type: 'num', value: Number(match[1]) });
    else if (match[2] !== undefined) tokens.push({ type: 'id', value: match[2] });
    else tokens.push({ type: 'op', value: OPERATOR_ALIASES[match[3]] || match[3] });
    at = TOKEN.lastIndex;
  }
  return tokens;
}

var OPERATOR_ALIASES = { '**': '^', '===': '==', '!==': '!=' };

/**
 * Parses one expression into a tree of nodes:
 *  - {type: 'num', value}, {type: 'var', name};
 *  - {type: 'neg', a}, {type: 'not', a};
 *  - {type: 'bin', op, a, b}, where op is one of + - * / ^, a comparison, && or ||;
 *  - {type: 'call', name, args}; `c ? a : b` is a call of select;
 *  - {type: 'index', name, a}: `name[a]`.
 */
function parse(text) {
  var statements = parseProgram(text);
  if (statements.length !== 1 || statements[0].target !== null) throw new Error('Expected one expression: ' + text);
  return statements[0].expr;
}

/**
 * Parses a formula into statements {target, op, expr}. `target` is null for a bare expression;
 * `op` is one of = += -= *= /=.
 */
function parseProgram(text) {
  if (typeof text !== 'string') throw new Error('A formula should be a string');
  var tokens = tokenize(text);
  var at = 0;
  var statements = [];
  while (at < tokens.length) {
    if (peek(';')) { at++; continue; }
    var statement;
    var next = tokens[at + 1];
    if (tokens[at].type === 'id' && next && next.type === 'op' && ASSIGNMENTS[next.value]) {
      statement = { target: tokens[at].value, op: next.value, expr: null };
      at += 2;
      statement.expr = expression();
    } else {
      statement = { target: null, op: null, expr: expression() };
    }
    statements.push(statement);
    if (at < tokens.length) expect(';');
  }
  if (statements.length === 0) throw new Error('Formula is empty');
  return statements;

  function peek(value) { return at < tokens.length && tokens[at].type === 'op' && tokens[at].value === value; }
  function peekOperator() { return at < tokens.length && tokens[at].type === 'op' ? tokens[at].value : null; }
  function expect(value) {
    if (!peek(value)) {
      var found = at < tokens.length ? '"' + tokens[at].value + '"' : 'the end';
      throw new Error('Expected "' + value + '" but found ' + found + ' in formula ' + text);
    }
    at++;
  }
  function expression() {
    var condition = or();
    if (!peek('?')) return condition;
    at++;
    var yes = expression();
    expect(':');
    var no = expression();
    return { type: 'call', name: 'select', args: [condition, yes, no] };
  }
  function or() {
    var node = and();
    while (peek('||')) { at++; node = { type: 'bin', op: '||', a: node, b: and() }; }
    return node;
  }
  function and() {
    var node = comparison();
    while (peek('&&')) { at++; node = { type: 'bin', op: '&&', a: node, b: comparison() }; }
    return node;
  }
  function comparison() {
    var node = sum();
    if (COMPARISONS[peekOperator()]) {
      var op = tokens[at++].value;
      node = { type: 'bin', op: op, a: node, b: sum() };
      if (COMPARISONS[peekOperator()]) throw new Error('Comparisons cannot be chained (use &&) in formula ' + text);
    }
    return node;
  }
  function sum() {
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
    if (peek('!')) { at++; return { type: 'not', a: unary() }; }
    return power();
  }
  function power() {
    var base = primary();
    if (peek('^')) { at++; return { type: 'bin', op: '^', a: base, b: unary() }; }
    return base;
  }
  function primary() {
    var token = tokens[at++];
    if (!token) throw new Error('Formula ends too early: ' + text);
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
        return rewrite({ type: 'call', name: token.value, args: args });
      }
      if (peek('[')) {
        at++;
        var index = expression();
        expect(']');
        return { type: 'index', name: token.value, a: index };
      }
      return { type: 'var', name: token.value };
    }
    if (token.value === '(') {
      var inner = expression();
      expect(')');
      return inner;
    }
    throw new Error('Unexpected "' + token.value + '" in formula ' + text);
  }
}

function rewrite(node) {
  var args = node.args;
  if (node.name === 'round' && args.length === 1) {
    return { type: 'call', name: 'floor', args: [{ type: 'bin', op: '+', a: args[0], b: { type: 'num', value: 0.5 } }] };
  }
  if (node.name === 'clamp' && args.length === 3) {
    return { type: 'call', name: 'min', args: [{ type: 'call', name: 'max', args: [args[0], args[1]] }, args[2]] };
  }
  return node;
}

function children(node) {
  if (node.args) return node.args;
  var list = [];
  if (node.a) list.push(node.a);
  if (node.b) list.push(node.b);
  return list;
}

/**
 * True for nodes whose value is a condition (true or false), not a number.
 */
function isCondition(node) {
  if (node.type === 'not') return true;
  return node.type === 'bin' && (COMPARISONS[node.op] || node.op === '&&' || node.op === '||') === true;
}

function numberLiteral(value) {
  var text = String(value);
  return value < 0 ? '(' + text + ')' : text;
}

// ---------------------------------------------------------------------------------------
// Lookup tables
// ---------------------------------------------------------------------------------------

/**
 * A function sampled at evenly spaced points: `{from, to, values}` (values[0] at `from`, the
 * last one at `to`). Between samples it is interpolated linearly; outside it keeps the value of
 * the nearest end. Its derivative is the slope of the segment (0 outside), which is what the
 * trees need from a law.
 */
function createTable(name, spec) {
  if (!spec || !(spec.values && spec.values.length >= 2)) throw new Error('Table ' + name + ' needs at least two values');
  if (!(Number.isFinite(spec.from) && Number.isFinite(spec.to) && spec.to > spec.from)) {
    throw new Error('Table ' + name + ' needs finite `from` < `to`');
  }
  var values = Float64Array.from(spec.values);
  var last = values.length - 1;
  var from = spec.from;
  var scale = last / (spec.to - spec.from);
  return {
    from: from,
    to: spec.to,
    values: values,
    value: function (x) {
      var q = (x - from) * scale;
      if (!(q > 0)) return values[0];
      if (q >= last) return values[last];
      var i = q | 0;
      return values[i] + (values[i + 1] - values[i]) * (q - i);
    },
    derivative: function (x) {
      var q = (x - from) * scale;
      if (!(q > 0) || q >= last) return 0;
      var i = q | 0;
      return (values[i + 1] - values[i]) * scale;
    }
  };
}

// ---------------------------------------------------------------------------------------
// JS code for formulas of stages
// ---------------------------------------------------------------------------------------

/**
 * Compiles a formula into lines of JS. `scope` tells what names mean:
 *
 *  - `scope.D`: number of dimensions;
 *  - `scope.name(name)` returns undefined for an unknown name, or a description:
 *      {type: 'num', code} or {type: 'vec', codes} - a value the formula can read;
 *      add `write(op, value)` returning lines, and `ops` (allowed operators), when the formula
 *      can assign to it;
 *      {index(code)} - a name read as `name[index]`, returning a value;
 *      {call(argumentCodes)} - a function of one number (a table), returning code.
 *
 * Names the formula assigns that the scope does not know are named values (local variables).
 * Returns {lines, result}: `result` is the value of a closing bare expression, if any.
 */
function compile(text, scope) {
  var statements = parseProgram(text);
  var D = scope.D;
  var lines = [];
  var locals = Object.create(null);
  var temp = 0;
  var result = null;

  statements.forEach(function (statement, at) {
    if (statement.target === null) {
      if (at !== statements.length - 1) throw new Error('Only the last statement of a formula can be a bare expression: ' + text);
      result = number(statement.expr, true);
      return;
    }
    var name = statement.target;
    var op = statement.op;
    var value = number(statement.expr, true);
    var local = locals[name];
    if (local) {
      value = scaling(local, op, value);
      sameType(local, value, name);
      assign(local.codes || [local.code], op, value);
      return;
    }
    var known = scope.name(name);
    if (known) {
      if (!known.write) throw new Error(name + ' cannot be assigned in formula ' + text);
      if (known.ops && known.ops.indexOf(op) < 0) {
        throw new Error(name + ' can only be changed with ' + known.ops.join(' or ') + ' in formula ' + text);
      }
      value = scaling(known, op, value);
      sameType(known, value, name);
      known.write(op, value).forEach(function (line) { lines.push(line); });
      return;
    }
    if (op !== '=') throw new Error(name + ' is used with ' + op + ' before it has a value, in formula ' + text);
    if (name === 'D' || name === 'pi') throw new Error(name + ' cannot be assigned in formula ' + text);
    local = { type: value.type, reads: 0 };
    if (value.type === 'vec') {
      local.codes = value.codes.map(function (code, k) {
        var variable = '$v_' + name + '_' + k;
        lines.push('var ' + variable + ' = ' + code + ';');
        return variable;
      });
    } else {
      local.code = '$v_' + name;
      lines.push('var ' + local.code + ' = ' + value.code + ';');
    }
    locals[name] = local;
  });

  Object.keys(locals).forEach(function (name) {
    if (locals[name].reads === 0) throw new Error(name + ' is computed but never used in formula ' + text);
  });
  return { lines: lines, result: result };

  function assign(targets, op, value) {
    var codes = value.codes || [value.code];
    targets.forEach(function (target, k) { lines.push(target + ' ' + op + ' ' + codes[k] + ';'); });
  }

  // `vector *= number` and `vector /= number` scale every component
  function scaling(target, op, value) {
    if (target.type !== 'vec' || value.type !== 'num' || (op !== '*=' && op !== '/=')) return value;
    var factor = save(value.code);
    return each(function () { return factor; });
  }

  function sameType(target, value, name) {
    if (target.type !== value.type) {
      throw new Error(name + ' is a ' + typeName(target.type) + ' but gets a ' + typeName(value.type) + ' in formula ' + text);
    }
  }

  function save(code) {
    if (/^[\w$]+$/.test(code) || /^\(-?[\d.e+-]+\)$/.test(code)) return code;
    var variable = '$t' + (temp++);
    lines.push('var ' + variable + ' = ' + code + ';');
    return variable;
  }

  // A number or a vector (not a condition)
  function number(node, allowVector) {
    var value = evaluate(node);
    if (value.type === 'bool') {
      throw new Error('A condition is used as a number in formula ' + text + ' (use select(condition, 1, 0) to count it)');
    }
    if (!allowVector && value.type === 'vec') throw new Error('A vector is used as a number in formula ' + text);
    return value;
  }

  function condition(node) {
    var value = evaluate(node);
    if (value.type !== 'bool') throw new Error('Expected a condition (such as a < b) in formula ' + text);
    return value.code;
  }

  function scalar(code) { return { type: 'num', code: code }; }
  function vector(codes) { return { type: 'vec', codes: codes }; }
  function each(fn) {
    var codes = [];
    for (var k = 0; k < D; ++k) codes.push(fn(k));
    return vector(codes);
  }
  // Components that are read more than once are computed once
  function saved(value) {
    return value.type === 'vec' ? vector(value.codes.map(save)) : scalar(save(value.code));
  }

  function evaluate(node) {
    switch (node.type) {
      case 'num': return scalar(numberLiteral(node.value));
      case 'var': return read(node.name);
      case 'index': return index(node);
      case 'neg':
        var a = number(node.a, true);
        if (a.type === 'vec') return vector(a.codes.map(function (code) { return '(-' + code + ')'; }));
        return scalar('(-' + a.code + ')');
      case 'not': return { type: 'bool', code: '!' + condition(node.a) };
      case 'bin': return binary(node);
      case 'call': return call(node);
    }
    throw new Error('Unknown formula node ' + node.type);
  }

  function read(name) {
    var local = locals[name];
    if (local) {
      local.reads += 1;
      return local.type === 'vec' ? vector(local.codes) : scalar(local.code);
    }
    if (name === 'D') return scalar(String(D));
    if (name === 'pi') return scalar(String(Math.PI));
    var known = scope.name(name);
    if (!known || known.call || known.index) {
      throw new Error((known ? name + ' cannot be read as a value' : 'Unknown name ' + name) + ' in formula ' + text);
    }
    return known.type === 'vec' ? vector(known.codes) : scalar(known.code);
  }

  function index(node) {
    var known = scope.name(node.name);
    if (!known || !known.index) throw new Error(node.name + ' cannot be indexed in formula ' + text);
    return known.index(save(number(node.a).code));
  }

  function binary(node) {
    var op = node.op;
    if (op === '&&' || op === '||') return { type: 'bool', code: '(' + condition(node.a) + ' ' + op + ' ' + condition(node.b) + ')' };
    if (COMPARISONS[op]) {
      var jsOp = op === '==' ? '===' : op === '!=' ? '!==' : op;
      return { type: 'bool', code: '(' + number(node.a).code + ' ' + jsOp + ' ' + number(node.b).code + ')' };
    }
    if (op === '^') return power(number(node.a), node.b);
    var a = number(node.a, true), b = number(node.b, true);
    if (op === '+' || op === '-') {
      if (a.type !== b.type) throw new Error('Cannot ' + (op === '+' ? 'add' : 'subtract') + ' a vector and a number in formula ' + text);
      if (a.type === 'vec') return each(function (k) { return '(' + a.codes[k] + ' ' + op + ' ' + b.codes[k] + ')'; });
      return scalar('(' + a.code + ' ' + op + ' ' + b.code + ')');
    }
    if (a.type === 'vec' && b.type === 'vec') throw new Error('Vectors cannot be multiplied or divided (use dot()) in formula ' + text);
    if (a.type === 'vec' || b.type === 'vec') {
      if (op === '/' && b.type === 'vec') throw new Error('Cannot divide by a vector in formula ' + text);
      var v = a.type === 'vec' ? a : b;
      var s = save(a.type === 'vec' ? b.code : a.code);
      return each(function (k) { return '(' + v.codes[k] + ' ' + op + ' ' + s + ')'; });
    }
    return scalar('(' + a.code + ' ' + op + ' ' + b.code + ')');
  }

  function power(base, exponentNode) {
    var exponent = exponentNode.type === 'num' ? exponentNode.value :
      exponentNode.type === 'neg' && exponentNode.a.type === 'num' ? -exponentNode.a.value : NaN;
    if (Number.isInteger(exponent) && exponent >= -4 && exponent <= 4) {
      if (exponent === 0) return scalar('1');
      var b = save(base.code);
      var product = [];
      for (var i = 0; i < Math.abs(exponent); ++i) product.push(b);
      return scalar(exponent > 0 ? '(' + product.join(' * ') + ')' : '(1 / (' + product.join(' * ') + '))');
    }
    return scalar('Math.pow(' + base.code + ', ' + number(exponentNode).code + ')');
  }

  function call(node) {
    var name = node.name;
    var args = node.args;
    var arity = FUNCTIONS[name];
    if (arity === undefined) {
      var known = scope.name(name);
      if (!known || !known.call) throw new Error('Unknown function ' + name + ' in formula ' + text);
      if (args.length !== 1) throw new Error(name + '() expects 1 argument in formula ' + text);
      return scalar(known.call([number(args[0]).code]));
    }
    if (args.length !== arity) throw new Error(name + '() expects ' + arity + ' argument(s) in formula ' + text);
    if (name === 'select') {
      var test = save(condition(args[0]));
      var yes = number(args[1], true), no = number(args[2], true);
      if (yes.type !== no.type) throw new Error('Both sides of a choice should be numbers, or both vectors, in formula ' + text);
      if (yes.type === 'vec') return each(function (k) { return '(' + test + ' ? ' + yes.codes[k] + ' : ' + no.codes[k] + ')'; });
      return scalar('(' + test + ' ? ' + yes.code + ' : ' + no.code + ')');
    }
    if (name === 'dot' || name === 'length') {
      var u = saved(number(args[0], true));
      var w = name === 'dot' ? saved(number(args[1], true)) : u;
      if (u.type !== 'vec' || w.type !== 'vec') throw new Error(name + '() expects vectors in formula ' + text);
      var terms = u.codes.map(function (code, k) { return code + ' * ' + w.codes[k]; }).join(' + ');
      return scalar(name === 'dot' ? '(' + terms + ')' : 'Math.sqrt(' + terms + ')');
    }
    return scalar('Math.' + name + '(' + args.map(function (arg) { return number(arg).code; }).join(', ') + ')');
  }
}

function typeName(type) {
  return type === 'vec' ? 'vector' : 'number';
}
