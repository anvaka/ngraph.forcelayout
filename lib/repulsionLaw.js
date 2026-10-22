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
// Laws other than 1/r^2 are parsed and compiled by parsedLaw.js, which this file loads with the
// first of them: default layouts never load the formula language or run its parser
var createParsedLaw = null;

module.exports = createRepulsionLaw;
module.exports.parse = function (text) { return parsedLaws().parse(text); };
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
module.exports.DEFAULT_KEY = DEFAULT_KEY;

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
  return parsedLaws()(spec);
}

function parsedLaws() {
  if (!createParsedLaw) createParsedLaw = require('./parsedLaw');
  return createParsedLaw;
}

function isPlainDefault(spec) {
  return spec.force.replace(/\s+/g, '') === DEFAULT_KEY && spec.range === undefined &&
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
    if (!parsed) parsed = parsedLaws()(spec);
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
