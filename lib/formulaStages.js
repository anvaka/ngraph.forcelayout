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
 * Link and pair formulas can also add into body columns, as `name_i += ...`: such a column
 * starts each step's pass at 0, so it holds what this step's pass added up.
 *
 * Every formula can read its `params` (numbers, or functions of the simulator read once per
 * step), its lookup `tables`, the sums added before it, and the names every formula knows (see
 * formula.js). Each stage is compiled into one function with the formula inside its loop, so it
 * costs what the formula's arithmetic costs.
 */
var formula = require('./formula');
var BUILT_IN_VALUES = formula.BUILT_IN_VALUES;

module.exports.node = createNodeStage;
module.exports.link = createLinkStage;
module.exports.pair = createPairStage;
module.exports.sum = createSumStage;

// Generated code is shared by stages with the same code
var codeCache = Object.create(null);

// Columns of a spring store that link formulas see through `length` and `coefficient`, or not
var LINK_BUILT_INS = { from: true, to: true, length: true, coefficient: true };
// Body columns that formulas do not see: counters of the adaptive time step (`springLength` in a
// formula is the setting; `degree` counts springs)
var HIDDEN_BODY_COLUMNS = { springCount: true, springLength: true };

/**
 * Formula for every body. Returns {run, describe}.
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
  return context.stage(lines, 'node');
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
  var withStats = options.replace === 'springs';

  var lines = context.prologue();
  lines.push('var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;');
  lines.push('var $pos = $store.pos, $force = $store.force;');
  lines.push('var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;');
  if (withStats) lines.push('var $stats = $values.$stats, $springCount = $store.springCount, $springLength = $store.springLength;');
  zeroAccumulators(context, accumulated, lines);
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
  return context.stage(lines, 'link', { accumulates: accumulated, replacesSprings: withStats });
}

/**
 * Formula for every pair of bodies closer than `options.radius` (a number, an expression of the
 * params, or a function of the simulator; 0 or less skips the pass). With `options.symmetric`
 * (the default) it runs once per pair and both bodies get the push. Otherwise it runs for (i, j)
 * and for (j, i), and each run pushes only body i (and can only add into `name_i`).
 *
 * Bodies on the same spot have r = 0: they are pushed along an axis picked from i and j, as the
 * dual tree does, and a push that is not a finite number leaves them alone.
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
    backward = compileFormula(options.formula, context.scope(pairNames(context, [], false, true)), name);
  }
  var radius = context.global(options.radius, 'radius');

  var lines = context.prologue();
  lines.push('var $radius = $values.$radius;');
  zeroAccumulators(context, accumulated, lines);
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
  lines.push('      if (!($r < $radius)) continue;');
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
  lines.push('      if ($r === 0) {');
  lines.push('        var $axis = ((($i * 2654435761) ^ ($j * 40503)) >>> 0) % ' + D + ';');
  lines.push('        if (Number.isFinite($pushI)) $force[$oi + $axis] -= $pushI;');
  lines.push('        if (Number.isFinite($pushJ)) $force[$oj + $axis] += $pushJ;');
  lines.push('        continue;');
  lines.push('      }');
  lines.push(symmetric ? '      var $si = $pushI / $r, $sj = $si;' : '      var $si = $pushI / $r, $sj = $pushJ / $r;');
  lines.push('      ' + each(D, function (k) { return '$force[$oi + ' + k + '] += $si * $d' + k + ';'; }));
  lines.push('      ' + each(D, function (k) { return '$force[$oj + ' + k + '] -= $sj * $d' + k + ';'; }));
  lines.push('    }');
  lines.push('  }');
  lines.push('}');
  return context.stage(lines, 'pair', { accumulates: accumulated, symmetric: symmetric, radius: radius });
}

/**
 * A sum over bodies (or links, with `options.over === 'links'`) of the formula's value, a number
 * or a vector. `options.reduce` is 'sum' (the default), 'min' or 'max'. With `options.group`
 * (the name of a body or link column) there is one result per group id 0, 1, 2, ...; rows whose
 * group is negative are left out. Later formulas read the result as `name`, or `name[group]`
 * (0 for a group that has no rows).
 *
 * Returns {run, describe, result}: `result` holds `value` (an array of 1 or D numbers), and with
 * groups `groups` (count * width numbers) and `count`.
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
  var value = compiled.result;
  if (!value) throw new Error('Sum ' + name + ' should end with the expression to add up');
  var width = value.type === 'vec' ? D : 1;
  var codes = value.codes || [value.code];
  var start = reduce === 'sum' ? '0' : reduce === 'min' ? 'Infinity' : '-Infinity';
  var group = options.group;
  if (group !== undefined) {
    var groupStore = overLinks ? simulator.springStore : simulator.store;
    if (!groupStore.has(group)) throw new Error('Sum ' + name + ': no ' + (overLinks ? 'link' : 'body') + ' column named ' + group);
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
  var stage = context.stage(lines, 'sum', { over: overLinks ? 'links' : 'nodes', reduce: reduce, group: group, width: width });
  stage.result = result;
  return stage;
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
    var described = bodyColumn(context, column, row, offset, writes ? null : []);
    if (described) names[column] = described;
  });
  return names;
}

function bodyColumn(context, column, row, offset, ops) {
  var size = columnSize(context.store, column);
  var array = '$c_' + column;
  var described;
  if (size === 1) {
    var code = array + '[' + row + ']';
    described = { type: 'num', code: code, write: assignment(code) };
  } else if (size === context.D) {
    var codes = [];
    for (var k = 0; k < size; ++k) codes.push(array + '[' + offset + ' + ' + k + ']');
    described = { type: 'vec', codes: codes, write: assignment(codes) };
  } else {
    return null;
  }
  if (ops) {
    described.ops = ops;
    if (ops.length === 0) described.write = null;
  }
  // marked as used when the formula names it
  described.column = column;
  return described;
}

// Names of link formulas (and sums over links). `accumulated` collects the body columns that the
// formula adds into (null: read only).
function linkNames(context, accumulated) {
  var names = Object.create(null);
  names.r = { type: 'num', code: '$r' };
  names.length = { type: 'num', code: '$length' };
  names.coefficient = { type: 'num', code: '$coefficient' };
  context.springStore.names().forEach(function (column) {
    if (LINK_BUILT_INS[column]) return;
    if (names[column]) throw new Error('Link column ' + column + ' has the name of a value link formulas know');
    var array = '$l_' + column;
    names[column] = { type: 'num', code: array + '[$s]', write: accumulated ? assignment(array + '[$s]') : null, linkColumn: column };
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
      var described = bodyColumn(context, column, end[1], end[2], canAdd ? ['+=', '-='] : []);
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

function columnSize(store, column) {
  return store.sizeOf(column);
}

// Columns that link and pair formulas add into start each pass at 0
function zeroAccumulators(context, columns, lines) {
  columns.forEach(function (column) {
    lines.push('$store[' + JSON.stringify(column) + '].fill(0, 0, $store.n * ' + columnSize(context.store, column) + ');');
  });
}

// ---------------------------------------------------------------------------------------
// What every formula stage shares
// ---------------------------------------------------------------------------------------

function createContext(simulator, name, options) {
  if (!options || typeof options.formula !== 'string') throw new Error('Formula stage ' + name + ' needs a `formula` string');
  var store = simulator.store;
  var D = store.D;
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
  var context = {
    D: D,
    store: store,
    springStore: simulator.springStore,
    scope: function (names) {
      return { D: D, name: function (key) { return resolve(names, key); } };
    },
    // A value of the stage read once per step, as `$values.$<key>`: a number, a function of the
    // simulator, or an expression of the params and built in values
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
    prologue: function () {
      // Filled in by stage(), after the formulas named what they use
      return prologue;
    },
    stage: function (body, shape, details) {
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
      var info = {
        shape: shape,
        formula: options.formula,
        params: paramNames,
        tables: Object.keys(tables),
        sums: Object.keys(usedSums),
        columns: Object.keys(usedColumns),
        linkColumns: Object.keys(usedLinkColumns),
        code: code
      };
      Object.keys(details || {}).forEach(function (key) { info[key] = details[key]; });
      return {
        run: function (bodyStore, sim) {
          readValues(sim);
          run(bodyStore, sim.springStore, values, sim.sums(), tables, sim.random, sim);
        },
        describe: function () { return info; }
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

  function resolve(names, key) {
    var named = names[key];
    if (named && (BUILT_IN_VALUES[key] || key === 'D' || key === 'pi')) {
      throw new Error(name + ': ' + key + ' is both a column and a built in value; give the column another name');
    }
    if (named) {
      if (named.column) usedColumns[named.column] = true;
      if (named.linkColumn) usedLinkColumns[named.linkColumn] = true;
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

  function readValues(sim) {
    for (var i = 0; i < paramNames.length; ++i) {
      var param = params[paramNames[i]];
      values[paramNames[i]] = typeof param === 'function' ? param(sim) : param;
    }
    for (i = 0; i < usedBuiltIns.length; ++i) values['$' + usedBuiltIns[i]] = BUILT_IN_VALUES[usedBuiltIns[i]](sim);
    values.$springLength = sim.settings.springLength;
    values.$springCoefficient = sim.settings.springCoefficient;
    values.$stats = sim.settings.adaptiveTimeStepWeight !== 0;
    for (i = 0; i < globals.length; ++i) {
      var global = globals[i];
      values['$' + global.key] = typeof global.read === 'number' ? global.read :
        global.compiled ? global.read(values) : global.read(sim);
    }
  }
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
