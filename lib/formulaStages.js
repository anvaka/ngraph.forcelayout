/**
 * Stages written as formulas (see formula.js). The simulator owns the loops; a formula says what
 * happens to one body, one link, or one pair of close bodies:
 *
 *  - node: runs for every body. It reads the body's columns by name (`mass`, `pos`, `force`,
 *    ...) and assigns to them;
 *  - link: runs for every link (spring). It reads the distance `r`, the link's `length` and
 *    `coefficient` (with the simulator's settings filled in), the link's own columns, and the
 *    columns of its two bodies as `name_i` (the `from` body) and `name_j` (the `to` body). It
 *    sets `pull`, the force that pulls the two bodies together (negative pushes them apart);
 *  - pair: runs for every pair of bodies closer than a radius. It reads `r` and `name_i`,
 *    `name_j`, and sets `push`, the force that pushes the two apart;
 *  - sum: adds up a formula over bodies or links (or takes its min or max), for all of them or
 *    per group, so that later formulas can read the result by name (`total`, or `total[group]`
 *    for a sum per group).
 *
 * What a write means depends on its operator, the same way on every engine: `x = v` replaces
 * the value, `x += v` and `x -= v` add onto the value `x` has when the stage starts. Link and pair
 * formulas add into body columns as `name_i += ...`; a stage's `startAtZero: ['name']` sets such
 * columns to 0 first, so they hold what this pass added up. Formulas never move bodies (`pos` is
 * read only), and a link or pair formula cannot read a column it adds into, as it would see a
 * partial sum.
 *
 * Every formula can read its `params` (numbers, or functions of the step context read once per
 * step), its lookup `tables`, the sums added before it, and the names every formula knows (see
 * formula.js). With `when` (an expression of `step`, the params and the settings) the stage runs
 * only on the steps where it holds. Each stage is compiled into one function with the formula
 * inside its loop, so it costs what the formula's arithmetic costs.
 *
 * A stage also describes itself as plain data (see simulator.program()): what it reads and
 * writes, how, its params and options.
 */
var formula = require('./formula');
var BUILT_IN_VALUES = formula.BUILT_IN_VALUES;

module.exports.node = createNodeStage;
module.exports.link = createLinkStage;
module.exports.pair = createPairStage;
module.exports.sum = createSumStage;
module.exports.gate = createGate;
module.exports.describeValue = describeValue;

// Generated code is shared by stages with the same code
var codeCache = Object.create(null);

// Columns of a spring store that link formulas see through `length` and `coefficient`, or not
var LINK_BUILT_INS = { from: true, to: true, length: true, coefficient: true };
// Body columns that formulas do not see: counters of the adaptive time step (`springLength` in a
// formula is the setting; `degree` counts springs)
var HIDDEN_BODY_COLUMNS = { springCount: true, springLength: true };
// Columns that `startAtZero` never zeroes: the state of bodies
var STATE_COLUMNS = { pos: true, velocity: true, force: true };
var WRITE_MODES = { '=': 'set', '+=': 'add', '-=': 'add', '*=': 'scale', '/=': 'scale' };

/**
 * Formula for every body. Returns {run, describe, values}.
 */
function createNodeStage(simulator, name, options) {
  var context = createContext(simulator, name, options);
  var scope = context.scope(bodyNames(context, '$i', '$o', 'any'));
  var compiled = compileFormula(options.formula, scope, name);
  var lines = context.prologue();
  lines.push('var $n = $store.n;');
  lines.push('for (var $i = 0; $i < $n; ++$i) {');
  lines.push('  var $o = $i * ' + context.D + ';');
  indent(compiled.lines, lines);
  lines.push('}');
  return context.stage(lines, 'node', 'nodes');
}

/**
 * Formula for every link. With `options.replace === 'springs'` it takes the place of the stock
 * springs: it then also keeps the counters of the adaptive time step.
 */
function createLinkStage(simulator, name, options) {
  var context = createContext(simulator, name, options);
  var D = context.D;
  var accumulated = [];
  var names = linkNames(context, accumulated);
  names.pull = { type: 'num', code: '$pull', write: assignment('$pull') };
  var compiled = compileFormula(options.formula, context.scope(names), name);
  context.checkAccumulators(accumulated);
  var startAtZero = context.startAtZero(accumulated);
  readEnds(context, 'pos');
  var withStats = options.replace === 'springs';

  var lines = context.prologue();
  lines.push('var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;');
  lines.push('var $pos = $store.pos, $force = $store.force;');
  lines.push('var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;');
  if (withStats) lines.push('var $stats = $values.$stats, $springCount = $store.springCount, $springLength = $store.springLength;');
  zeroColumns(context, startAtZero, lines);
  // The same order and the same arithmetic as the stock springs, so that the formula of the
  // stock springs gives the same numbers
  lines.push('for (var $s = $springs.n - 1; $s >= 0; --$s) {');
  lines.push('  var $i = $from[$s], $j = $to[$s];');
  lines.push('  var $oi = $i * ' + D + ', $oj = $j * ' + D + ';');
  lines.push('  var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];');
  lines.push('  ' + each(D, function (k) { return 'var $d' + k + ' = $pos[$oj + ' + k + '] - $pos[$oi + ' + k + '];'; }));
  lines.push('  var $r = Math.sqrt(' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ');');
  lines.push('  if ($r === 0) {');
  lines.push('    // ends on the same spot: pull along a random direction');
  lines.push('    ' + each(D, function (k) { return '$d' + k + ' = ($random.nextDouble() - 0.5) / 50;'; }));
  lines.push('    $r = Math.sqrt(' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ');');
  lines.push('  }');
  lines.push('  var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;');
  lines.push('  var $pull = 0;');
  indent(compiled.lines, lines);
  lines.push('  var $k = $pull / $r;');
  lines.push('  ' + each(D, function (k) { return '$force[$oi + ' + k + '] += $k * $d' + k + ';'; }));
  lines.push('  ' + each(D, function (k) { return '$force[$oj + ' + k + '] -= $k * $d' + k + ';'; }));
  if (withStats) {
    lines.push('  if ($stats) {');
    lines.push('    $springCount[$i] += 1; $springLength[$i] += $r; $springCount[$j] += 1; $springLength[$j] += $r;');
    lines.push('  }');
  }
  lines.push('}');
  context.wrote({ space: 'nodes', column: 'force', mode: 'add', via: 'pull' });
  return context.stage(lines, 'link', 'links', {
    replace: options.replace === undefined ? null : options.replace,
    counters: withStats,
    startAtZero: startAtZero
  });
}

/**
 * Formula for every pair of bodies closer than `options.radius` (a number, an expression of the
 * params, or a function of the step context; 0 or less skips the pass). With `options.symmetric`
 * (the default) it runs once per pair, i being the lower row, and both bodies get the push.
 * Otherwise it runs for (i, j) and for (j, i), and each run pushes only body i (and can only add
 * into `name_i`).
 *
 * Bodies on the same spot (r = 0) have no direction to push along: such a pair pushes nothing
 * and adds nothing up.
 */
function createPairStage(simulator, name, options) {
  if (options.radius === undefined) throw new Error('Pair formula ' + name + ' needs a radius');
  var context = createContext(simulator, name, options);
  var D = context.D;
  var symmetric = options.symmetric !== false;
  var accumulated = [];
  var forward = pairNames(context, accumulated, symmetric, false);
  var compiled = compileFormula(options.formula, context.scope(forward), name);
  var backward = null;
  if (!symmetric) {
    // The same formula with the roles of i and j swapped
    backward = compileFormula(options.formula, context.scope(pairNames(context, [], false, true), true), name);
  }
  context.checkAccumulators(accumulated);
  var startAtZero = context.startAtZero(accumulated);
  readEnds(context, 'pos');
  var radius = context.global(options.radius, 'radius');

  var lines = context.prologue();
  lines.push('var $radius = $values.$radius;');
  zeroColumns(context, startAtZero, lines);
  lines.push('if (!($radius > 0)) return;');
  lines.push('var $grid = $simulator.neighbors($radius).internals();');
  lines.push('var $n = $grid.n, $cells = $grid.cells, $bucketStart = $grid.bucketStart, $sorted = $grid.sorted;');
  lines.push('var $tableMask = $grid.tableMask, $offsets = $grid.offsets, $offsetCount = $grid.offsetCount;');
  lines.push('var $pos = $store.pos, $force = $store.force;');
  // Walks pairs as the grid's forEachPair does: each pair once, i < j
  lines.push('for (var $i = 0; $i < $n; ++$i) {');
  lines.push('  var $oi = $i * ' + D + ';');
  lines.push('  ' + each(D, function (k) { return 'var $c' + k + ' = $cells[$oi + ' + k + '];'; }));
  lines.push('  ' + each(D, function (k) { return 'var $x' + k + ' = $pos[$oi + ' + k + '];'; }));
  lines.push('  for (var $cell = 0; $cell < $offsetCount; ++$cell) {');
  lines.push('    ' + each(D, function (k) { return 'var $m' + k + ' = $c' + k + ' + $offsets[$cell * ' + D + ' + ' + k + '];'; }));
  lines.push('    var $hash = 0x165667b1;');
  for (var axis = 0; axis < D; ++axis) lines.push('    $hash = Math.imul($hash ^ $m' + axis + ', 0x27d4eb2d); $hash ^= $hash >>> 15;');
  lines.push('    var $bucket = $hash & $tableMask;');
  lines.push('    for (var $at = $bucketStart[$bucket], $end = $bucketStart[$bucket + 1]; $at < $end; ++$at) {');
  lines.push('      var $j = $sorted[$at];');
  lines.push('      if ($j <= $i) continue;');
  lines.push('      var $oj = $j * ' + D + ';');
  lines.push('      // a bucket can hold bodies of other cells too');
  lines.push('      if (' + each(D, function (k) { return '$cells[$oj + ' + k + '] !== $m' + k; }, ' || ') + ') continue;');
  lines.push('      ' + each(D, function (k) { return 'var $d' + k + ' = $x' + k + ' - $pos[$oj + ' + k + '];'; }));
  lines.push('      var $r = Math.sqrt(' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ');');
  lines.push('      // bodies on the same spot have no direction to push along');
  lines.push('      if (!($r < $radius) || $r === 0) continue;');
  lines.push('      var $push = 0;');
  lines.push('      {');
  indent(compiled.lines, lines, '        ');
  lines.push('      }');
  lines.push('      var $pushI = $push;');
  if (backward) {
    lines.push('      $push = 0;');
    lines.push('      {');
    indent(backward.lines, lines, '        ');
    lines.push('      }');
  }
  lines.push('      var $pushJ = $push;');
  lines.push('      if (!$pushI && !$pushJ) continue;');
  lines.push(symmetric ? '      var $si = $pushI / $r, $sj = $si;' : '      var $si = $pushI / $r, $sj = $pushJ / $r;');
  lines.push('      ' + each(D, function (k) { return '$force[$oi + ' + k + '] += $si * $d' + k + ';'; }));
  lines.push('      ' + each(D, function (k) { return '$force[$oj + ' + k + '] -= $sj * $d' + k + ';'; }));
  lines.push('    }');
  lines.push('  }');
  lines.push('}');
  context.wrote({ space: 'nodes', column: 'force', mode: 'add', via: 'push' });
  return context.stage(lines, 'pair', 'pairs', {
    radius: describeValue(radius, options.radius),
    symmetric: symmetric,
    startAtZero: startAtZero
  });
}

/**
 * A sum over bodies (or links, with `options.over === 'links'`) of the formula's value, a number
 * or a vector. `options.reduce` is 'sum' (the default), 'min' or 'max'. With `options.group`
 * (the name of a body or link column) there is one result per group id 0, 1, 2, ...; rows whose
 * group is negative are left out. Later formulas read the result as `name`, or `name[group]`
 * (0 for a group that has no rows). A sum gated off by `when` keeps its last result.
 *
 * Returns {run, describe, values, result}: `result` holds `value` (an array of 1 or D numbers),
 * and with groups `groups` (count * width numbers) and `count`.
 */
function createSumStage(simulator, name, options) {
  var context = createContext(simulator, name, options);
  var D = context.D;
  var overLinks = options.over === 'links';
  if (options.over !== undefined && options.over !== 'nodes' && !overLinks) throw new Error('Sum ' + name + ' should be over nodes or links');
  var reduce = options.reduce || 'sum';
  if (reduce !== 'sum' && reduce !== 'min' && reduce !== 'max') throw new Error('Sum ' + name + ': reduce should be sum, min or max');
  var names = overLinks ? linkNames(context, null) : bodyNames(context, '$i', '$o', null);
  var compiled = compileFormula(options.formula, context.scope(names), name);
  if (overLinks) readEnds(context, 'pos');
  var value = compiled.result;
  if (!value) throw new Error('Sum ' + name + ' should end with the expression to add up');
  var width = value.type === 'vec' ? D : 1;
  var codes = value.codes || [value.code];
  var start = reduce === 'sum' ? '0' : reduce === 'min' ? 'Infinity' : '-Infinity';
  var group = options.group;
  if (group !== undefined) {
    var groupStore = overLinks ? simulator.springStore : simulator.store;
    if (!groupStore.has(group)) throw new Error('Sum ' + name + ': no ' + (overLinks ? 'link' : 'body') + ' column named ' + group);
    context.read({ space: overLinks ? 'links' : 'nodes', column: group, rows: 'own' });
  }
  var result = { width: width, grouped: group !== undefined, value: new Float64Array(width), groups: new Float64Array(0), count: 0 };
  result.value.fill(+start);

  var lines = context.prologue();
  lines.push('var $result = $sums[' + JSON.stringify(name) + '];');
  if (overLinks) {
    lines.push('var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;');
    lines.push('var $pos = $store.pos;');
    lines.push('var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;');
  }
  var rows = overLinks ? '$springs.n' : '$store.n';
  var row = overLinks ? '$s' : '$i';
  if (group !== undefined) {
    lines.push('var $group = ' + (overLinks ? '$springs' : '$store') + '[' + JSON.stringify(group) + '];');
    lines.push('var $count = 0;');
    lines.push('for (var ' + row + ' = 0; ' + row + ' < ' + rows + '; ++' + row + ') if ($group[' + row + '] >= $count) $count = Math.floor($group[' + row + ']) + 1;');
    lines.push('var $acc = $result.resize($count);');
  } else {
    for (var slot = 0; slot < width; ++slot) lines.push('var $acc' + slot + ' = ' + start + ';');
  }
  lines.push('for (var ' + row + ' = 0; ' + row + ' < ' + rows + '; ++' + row + ') {');
  if (group !== undefined) {
    lines.push('  var $g = $group[' + row + '];');
    lines.push('  if (!($g >= 0)) continue;');
    lines.push('  $g = Math.floor($g) * ' + width + ';');
  }
  if (overLinks) {
    lines.push('  var $i = $from[$s], $j = $to[$s];');
    lines.push('  var $oi = $i * ' + D + ', $oj = $j * ' + D + ';');
    lines.push('  var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];');
    lines.push('  var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;');
    lines.push('  var $r = Math.sqrt(' + each(D, function (k) { return '($pos[$oj + ' + k + '] - $pos[$oi + ' + k + ']) * ($pos[$oj + ' + k + '] - $pos[$oi + ' + k + '])'; }, ' + ') + ');');
  } else {
    lines.push('  var $o = $i * ' + D + ';');
  }
  indent(compiled.lines, lines);
  codes.forEach(function (code, k) {
    var target = group !== undefined ? '$acc[$g + ' + k + ']' : '$acc' + k;
    lines.push('  ' + target + ' = ' + (reduce === 'sum' ? target + ' + ' + code : 'Math.' + reduce + '(' + target + ', ' + code + ')') + ';');
  });
  lines.push('}');
  if (group === undefined) {
    for (slot = 0; slot < width; ++slot) lines.push('$result.value[' + slot + '] = $acc' + slot + ';');
  }
  result.resize = function (count) {
    if (result.groups.length < count * width) result.groups = new Float64Array(Math.max(count, 2 * result.count) * width);
    result.count = count;
    result.groups.fill(+start, 0, count * width);
    return result.groups;
  };
  var stage = context.stage(lines, 'sum', overLinks ? 'links' : 'nodes', {
    over: overLinks ? 'links' : 'nodes', reduce: reduce, group: group === undefined ? null : group, width: width
  });
  stage.result = result;
  return stage;
}

/**
 * A `when` for any stage: an expression of `step`, the settings and `params` (an object of
 * numbers and functions of the step context), or a function of the step context. Returns
 * {test(context), describe()}.
 */
function createGate(simulator, name, when, params) {
  if (typeof when === 'function') {
    return {
      test: when,
      describe: function () { return { kind: 'host' }; }
    };
  }
  var context = createContext(simulator, name, { formula: '', params: params });
  var gate = context.when(when);
  return {
    test: function (stepContext) { return gate(context.readValues(stepContext)); },
    describe: function () { return { kind: 'expression', text: when }; }
  };
}

// ---------------------------------------------------------------------------------------
// What names mean
// ---------------------------------------------------------------------------------------

/**
 * Columns of the body in row `row` (offset `offset` for vectors). `writes` is 'any' for node
 * formulas (they assign to their own body), or null (read only).
 */
function bodyNames(context, row, offset, writes) {
  var names = Object.create(null);
  context.store.names().forEach(function (column) {
    if (HIDDEN_BODY_COLUMNS[column]) return;
    var described = bodyColumn(context, column, row, offset, writes ? null : [], null);
    if (described) names[column] = described;
  });
  return names;
}

// `end` is null for the body's own row (node formulas), or 'i' or 'j' (link and pair formulas)
function bodyColumn(context, column, row, offset, ops, end) {
  var size = columnSize(context.store, column);
  var array = '$c_' + column;
  var target;
  var described;
  if (size === 1) {
    target = array + '[' + row + ']';
    described = { type: 'num', code: target };
  } else if (size === context.D) {
    target = [];
    for (var k = 0; k < size; ++k) target.push(array + '[' + offset + ' + ' + k + ']');
    described = { type: 'vec', codes: target };
  } else {
    return null;
  }
  described.write = ops && ops.length === 0 ? null : recordedAssignment(context, target, { space: 'nodes', column: column, end: end });
  if (ops) described.ops = ops;
  // marked as used when the formula names it
  described.column = column;
  described.end = end;
  return described;
}

// Names of link formulas (and sums over links). `accumulated` collects the body columns that the
// formula adds into (null: read only).
function linkNames(context, accumulated) {
  var names = Object.create(null);
  names.r = { type: 'num', code: '$r' };
  names.length = { type: 'num', code: '$length', builtInColumn: 'length' };
  names.coefficient = { type: 'num', code: '$coefficient', builtInColumn: 'coefficient' };
  context.springStore.names().forEach(function (column) {
    if (LINK_BUILT_INS[column]) return;
    if (names[column]) throw new Error('Link column ' + column + ' has the name of a value link formulas know');
    var array = '$l_' + column;
    names[column] = {
      type: 'num', code: array + '[$s]', linkColumn: column,
      write: accumulated ? recordedAssignment(context, array + '[$s]', { space: 'links', column: column, end: null }) : null
    };
  });
  addEnds(context, names, accumulated, true, false);
  return names;
}

function pairNames(context, accumulated, symmetric, swapped) {
  var names = Object.create(null);
  names.r = { type: 'num', code: '$r' };
  names.push = { type: 'num', code: '$push', write: assignment('$push') };
  addEnds(context, names, accumulated, symmetric, swapped);
  return names;
}

// `name_i` and `name_j` for every body column. Formulas can add into them, and both ends only
// when `bothEnds`.
function addEnds(context, names, accumulated, bothEnds, swapped) {
  var ends = swapped ? [['_i', '$j', '$oj'], ['_j', '$i', '$oi']] : [['_i', '$i', '$oi'], ['_j', '$j', '$oj']];
  context.store.names().forEach(function (column) {
    if (HIDDEN_BODY_COLUMNS[column]) return;
    ends.forEach(function (end) {
      var canAdd = accumulated && (end[0] === '_i' || bothEnds);
      var described = bodyColumn(context, column, end[1], end[2], canAdd ? ['+=', '-='] : [], end[0].slice(1));
      if (!described) return;
      if (canAdd) {
        var write = described.write;
        described.write = function (op, value) {
          if (accumulated.indexOf(column) < 0) accumulated.push(column);
          return write(op, value);
        };
      }
      names[column + end[0]] = described;
    });
  });
}

function assignment(target) {
  var targets = Array.isArray(target) ? target : [target];
  return function (op, value) {
    var codes = value.codes || [value.code];
    return targets.map(function (code, k) { return code + ' ' + op + ' ' + codes[k] + ';'; });
  };
}

// An assignment to a column, recorded for the stage's description. Formulas never move bodies.
function recordedAssignment(context, target, write) {
  var lines = assignment(target);
  return function (op, value) {
    if (write.space === 'nodes' && write.column === 'pos') {
      throw new Error('pos is read only in formulas: only integrate and host steps move bodies');
    }
    context.wrote({ space: write.space, column: write.column, mode: WRITE_MODES[op], op: op, end: write.end });
    return lines(op, value);
  };
}

// Every link and pair stage reads the positions of both ends, for r
function readEnds(context, column) {
  context.read({ space: 'nodes', column: column, rows: 'other', end: 'i' });
  context.read({ space: 'nodes', column: column, rows: 'other', end: 'j' });
}

function columnSize(store, column) {
  return store.sizeOf(column);
}

// Columns listed in a stage's `startAtZero` start each pass at 0
function zeroColumns(context, columns, lines) {
  columns.forEach(function (column) {
    lines.push('$store[' + JSON.stringify(column) + '].fill(0, 0, $store.n * ' + columnSize(context.store, column) + ');');
  });
}

/**
 * A value of a stage as plain data: {kind: 'number', value}, {kind: 'expression', text}, or
 * {kind: 'host'} for a function (it has no body here; engines call it with the step context).
 */
function describeValue(spec) {
  if (typeof spec === 'number') return { kind: 'number', value: spec };
  if (typeof spec === 'string') return { kind: 'expression', text: spec };
  return { kind: 'host' };
}

// ---------------------------------------------------------------------------------------
// What every formula stage shares
// ---------------------------------------------------------------------------------------

function createContext(simulator, name, options) {
  if (!options || typeof options.formula !== 'string') throw new Error('Formula stage ' + name + ' needs a `formula` string');
  var store = simulator.store;
  var D = store.D;
  // Parameter functions get the step context, never the simulator: other engines call them
  // for steps they queue
  var stepContext = simulator.stepContext();
  var params = options.params || {};
  var paramNames = Object.keys(params);
  var tables = {};
  Object.keys(options.tables || {}).forEach(function (table) {
    tables[table] = formula.createTable(table, options.tables[table]);
  });
  var sums = simulator.sums();
  paramNames.forEach(function (param) {
    if (!/^[A-Za-z_]\w*$/.test(param)) throw new Error('Bad parameter name ' + param + ' in ' + name);
    if (store.has(param) || tables[param] || sums[param] || BUILT_IN_VALUES[param] || param === 'D' || param === 'pi') {
      throw new Error('Parameter ' + param + ' of ' + name + ' has the name of a column, table, sum or built in value');
    }
  });

  var prologue = [];
  var usedParams = Object.create(null), usedBuiltIns = [], usedSums = Object.create(null);
  var usedColumns = Object.create(null), usedLinkColumns = Object.create(null);
  var globals = [];
  var values = {};
  var gate = null;
  var reads = [], writes = [];
  var context = {
    D: D,
    store: store,
    springStore: simulator.springStore,
    // `swapped`: the scope of a one-sided pair formula with i and j swapped, which reads the same
    // columns as the formula itself
    scope: function (names, swapped) {
      return { D: D, name: function (key, assigned) { return resolve(names, key, assigned || swapped); } };
    },
    // A value of the stage read once per step, as `$values.$<key>`: a number, a function of the
    // step context, or an expression of the params and built in values
    global: function (spec, key) {
      if (typeof spec === 'number' || typeof spec === 'function') {
        globals.push({ key: key, read: spec });
        return spec;
      }
      if (typeof spec !== 'string') throw new Error(key + ' of ' + name + ' should be a number, a function or an expression');
      var compiled = compileFormula(spec, { D: D, name: globalName }, name);
      if (!compiled.result || compiled.result.type !== 'num') throw new Error(key + ' of ' + name + ' should be an expression giving a number');
      var code = compiled.lines.join('\n') + '\nreturn ' + compiled.result.code + ';';
      globals.push({ key: key, read: new Function('$values', code), compiled: true });
      return spec;
    },
    // A condition of the params and built in values, as a function of the values
    when: function (spec) {
      if (typeof spec !== 'string') throw new Error('when of ' + name + ' should be an expression or a function of the step context');
      var compiled = compileFormula(spec, { D: D, name: globalName, condition: true }, name);
      if (!compiled.result) throw new Error('when of ' + name + ' should end with a condition, such as step > 100');
      var code = compiled.lines.join('\n') + '\nreturn ' + compiled.result.code + ';';
      return new Function('$values', code);
    },
    read: function (entry) { addOnce(reads, entry); },
    wrote: function (entry) { addOnce(writes, entry); },
    // A link or pair formula sees a partial sum of what it adds into on the CPU and the value at
    // the stage's start elsewhere, so it cannot read it. `pull` and `push` add into `force`.
    checkAccumulators: function (accumulated) {
      reads.forEach(function (entry) {
        if (entry.space !== 'nodes') return;
        if (entry.column === 'force' || accumulated.indexOf(entry.column) >= 0) {
          throw new Error(name + ' reads ' + entry.column + '_' + entry.end + ', which it adds into; a link or pair formula ' +
            'sees no partial sums (read it in a later stage)');
        }
      });
    },
    startAtZero: function (accumulated) {
      var columns = options.startAtZero || [];
      if (!Array.isArray(columns)) throw new Error('startAtZero of ' + name + ' should be a list of column names');
      columns.forEach(function (column) {
        if (STATE_COLUMNS[column]) throw new Error('startAtZero of ' + name + ' cannot zero ' + column + ': it holds the state of bodies');
        if (accumulated.indexOf(column) < 0) throw new Error('startAtZero of ' + name + ' names ' + column + ', which the formula does not add into');
      });
      writes.forEach(function (entry) {
        if (entry.mode === 'add' && entry.space === 'nodes' && columns.indexOf(entry.column) >= 0) entry.startAtZero = true;
      });
      return columns.slice();
    },
    prologue: function () {
      // Filled in by stage(), after the formulas named what they use
      return prologue;
    },
    readValues: function (forStep) {
      readValues(forStep);
      return values;
    },
    stage: function (body, shape, space, args) {
      if (options.when !== undefined) gate = typeof options.when === 'function' ? options.when : context.when(options.when);
      var head = valueLines();
      Object.keys(usedColumns).forEach(function (column) {
        head.push('var $c_' + column + ' = $store[' + JSON.stringify(column) + '];');
        head.push('if (!$c_' + column + ') throw new Error(' + JSON.stringify(name + ' reads the body column ' + column + ', which is gone') + ');');
      });
      Object.keys(usedLinkColumns).forEach(function (column) {
        head.push('var $l_' + column + ' = $springs[' + JSON.stringify(column) + '];');
        head.push('if (!$l_' + column + ') throw new Error(' + JSON.stringify(name + ' reads the link column ' + column + ', which is gone') + ');');
      });
      Object.keys(tables).forEach(function (table) {
        head.push('var $T_' + table + ' = $tables[' + JSON.stringify(table) + '];');
      });
      prologue.unshift.apply(prologue, head);
      var code = body.join('\n');
      var run = codeCache[code];
      if (!run) run = codeCache[code] = new Function('$store', '$springs', '$values', '$sums', '$tables', '$random', '$simulator', code);
      var gated = gate !== null;
      var whenDescription = gated ? (typeof options.when === 'function' ? { kind: 'host' } : { kind: 'expression', text: options.when }) : null;
      return {
        run: function (bodyStore, sim) {
          readValues(stepContext);
          if (gated && !(typeof options.when === 'function' ? gate(stepContext) : gate(values))) return;
          run(bodyStore, sim.springStore, values, sim.sums(), tables, sim.random, sim);
        },
        // What the stage would read this step, for engines that queue steps: the params and
        // `radius` as numbers, and whether `when` holds
        values: function (otherContext) {
          var own = {};
          readValues(otherContext, own);
          var out = { params: {}, when: true };
          paramNames.forEach(function (param) { out.params[param] = own[param]; });
          if (own.$radius !== undefined) out.radius = own.$radius;
          if (gated) out.when = !!(typeof options.when === 'function' ? gate(otherContext) : gate(own));
          return out;
        },
        describe: function () {
          return {
            shape: shape,
            builtIn: null,
            space: space,
            when: whenDescription,
            formula: options.formula,
            reads: reads.map(copy),
            writes: writes.map(copy),
            params: paramNames.map(function (param) {
              var described = describeValue(params[param]);
              described.name = param;
              return described;
            }),
            builtIns: usedBuiltIns.slice(),
            tables: Object.keys(tables).map(function (table) {
              return { name: table, from: tables[table].from, to: tables[table].to, values: tables[table].values };
            }),
            sums: Object.keys(usedSums),
            args: args || {},
            code: code
          };
        }
      };
    }
  };
  return context;

  function valueLines() {
    var lines = [];
    Object.keys(usedParams).forEach(function (param) { lines.push('var $p_' + param + ' = $values[' + JSON.stringify(param) + '];'); });
    usedBuiltIns.forEach(function (builtIn) { lines.push('var $b_' + builtIn + ' = $values.$' + builtIn + ';'); });
    Object.keys(usedSums).forEach(function (sum) {
      lines.push('var $sum_' + sum + ' = $sums[' + JSON.stringify(sum) + '];');
      lines.push('if (!$sum_' + sum + ') throw new Error(' + JSON.stringify(name + ' reads the sum ' + sum + ', which is gone') + ');');
      if (sums[sum].grouped) lines.push('var $g_' + sum + ' = $sum_' + sum + '.groups, $gn_' + sum + ' = $sum_' + sum + '.count;');
      else lines.push('var $s_' + sum + ' = $sum_' + sum + '.value;');
    });
    return lines;
  }

  // Names of values read once per step: params and built in values
  function globalName(key) {
    if (Object.prototype.hasOwnProperty.call(params, key)) return { type: 'num', code: '$values[' + JSON.stringify(key) + ']' };
    if (BUILT_IN_VALUES[key]) {
      if (usedBuiltIns.indexOf(key) < 0) usedBuiltIns.push(key);
      return { type: 'num', code: '$values.$' + key };
    }
  }

  function resolve(names, key, assigned) {
    var named = names[key];
    if (named && (BUILT_IN_VALUES[key] || key === 'D' || key === 'pi')) {
      throw new Error(name + ': ' + key + ' is both a column and a built in value; give the column another name');
    }
    if (named) {
      if (named.column) {
        usedColumns[named.column] = true;
        if (!assigned) context.read({ space: 'nodes', column: named.column, rows: named.end ? 'other' : 'own', end: named.end });
      }
      if (named.linkColumn) {
        usedLinkColumns[named.linkColumn] = true;
        if (!assigned) context.read({ space: 'links', column: named.linkColumn, rows: 'own' });
      }
      if (named.builtInColumn) context.read({ space: 'links', column: named.builtInColumn, rows: 'own' });
      return named;
    }
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      usedParams[key] = true;
      return { type: 'num', code: '$p_' + key };
    }
    if (tables[key]) return { call: function (args) { return '$T_' + key + '.value(' + args[0] + ')'; } };
    var sum = sums[key];
    if (sum) {
      usedSums[key] = true;
      var width = sum.width;
      if (sum.grouped) {
        return {
          index: function (indexCode) {
            var read = function (k) {
              return '(' + indexCode + ' >= 0 && ' + indexCode + ' < $gn_' + key + ' ? $g_' + key + '[Math.floor(' + indexCode + ') * ' + width + ' + ' + k + '] : 0)';
            };
            if (width === 1) return { type: 'num', code: read(0) };
            var codes = [];
            for (var k = 0; k < width; ++k) codes.push(read(k));
            return { type: 'vec', codes: codes };
          }
        };
      }
      if (width === 1) return { type: 'num', code: '$s_' + key + '[0]' };
      var vector = [];
      for (var c = 0; c < width; ++c) vector.push('$s_' + key + '[' + c + ']');
      return { type: 'vec', codes: vector };
    }
    if (BUILT_IN_VALUES[key]) {
      if (usedBuiltIns.indexOf(key) < 0) usedBuiltIns.push(key);
      return { type: 'num', code: '$b_' + key };
    }
  }

  // Reads the numbers of the step of `forStep` (a step context) into `target` (the stage's own
  // values by default)
  function readValues(forStep, target) {
    target = target || values;
    for (var i = 0; i < paramNames.length; ++i) {
      var param = params[paramNames[i]];
      target[paramNames[i]] = typeof param === 'function' ? param(forStep) : param;
    }
    for (i = 0; i < usedBuiltIns.length; ++i) target['$' + usedBuiltIns[i]] = BUILT_IN_VALUES[usedBuiltIns[i]](forStep);
    var settings = forStep.settings;
    target.$springLength = settings.springLength;
    target.$springCoefficient = settings.springCoefficient;
    target.$stats = settings.adaptiveTimeStepWeight !== 0;
    for (i = 0; i < globals.length; ++i) {
      var global = globals[i];
      target['$' + global.key] = typeof global.read === 'number' ? global.read :
        global.compiled ? global.read(target) : global.read(forStep);
    }
  }
}

function addOnce(list, entry) {
  var key = JSON.stringify(entry);
  for (var i = 0; i < list.length; ++i) if (JSON.stringify(list[i]) === key) return;
  list.push(entry);
}

function copy(entry) {
  var out = {};
  Object.keys(entry).forEach(function (key) { if (entry[key] !== null && entry[key] !== undefined) out[key] = entry[key]; });
  return out;
}

function compileFormula(text, scope, name) {
  try {
    return formula.compile(text, scope);
  } catch (e) {
    e.message = name + ': ' + e.message;
    throw e;
  }
}

function indent(source, target, prefix) {
  prefix = prefix || '  ';
  source.forEach(function (line) { target.push(prefix + line); });
}

function each(D, fn, join) {
  var parts = [];
  for (var k = 0; k < D; ++k) parts.push(fn(k));
  return parts.join(join === undefined ? ' ' : join);
}
