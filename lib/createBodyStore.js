module.exports = createBodyStore;
module.exports.createSingleBodyStore = createSingleBodyStore;
module.exports.copyBody = copyBody;
module.exports.builtInColumns = builtInColumns;

var initColumnStore = require('./initColumnStore');

/**
 * Columns every body has: [name, array type, numbers per body, initial value].
 */
function builtInColumns(dimensions) {
  return [
    ['pos', Float64Array, dimensions],
    ['velocity', Float64Array, dimensions],
    ['force', Float64Array, dimensions],
    ['mass', Float64Array, 1, 1],
    ['pinned', Uint8Array, 1],
    ['springCount', Float64Array, 1],
    ['springLength', Float64Array, 1],
    // number of springs attached to the body
    ['degree', Float64Array, 1]
  ];
}

/**
 * Numbers of bodies, in flat typed arrays (see initColumnStore.js). Body `i` owns row `i`, and
 * axis `k` of its position is `pos[i * D + k]`. More columns can be added with `define()`.
 */
function createBodyStore(dimensions, capacity) {
  var store = {
    D: dimensions,
    n: 0,
    capacity: 0,

    pos: null,
    velocity: null,
    force: null,
    mass: null,
    pinned: null,
    springCount: null,
    springLength: null,
    degree: null,

    add: null, removeRows: null, define: null, has: null, get: null, remove: null,
    names: null, sizeOf: null, copyTo: null, lockBuiltIns: null, reserve: null, onResize: null,
    typeOf: null, versions: null, columnsVersion: 0, changed: null
  };
  initColumnStore(store);
  builtInColumns(dimensions).forEach(function (column) {
    store.define(column[0], column[1], column[2], column[3]);
  });
  store.lockBuiltIns();

  if (capacity) store.reserve(capacity);
  return store;
}

/**
 * The numbers of one body that is not in a simulator: the built in columns, without the
 * machinery to add or remove rows.
 */
function createSingleBodyStore(dimensions) {
  var store = { D: dimensions, n: 1 };
  builtInColumns(dimensions).forEach(function (column) {
    var values = new column[1](column[2]);
    if (column[3]) values.fill(column[3]);
    store[column[0]] = values;
  });
  return store;
}

/**
 * Copies the built in columns of body `row` to body `otherRow` of `other`. Columns added with
 * `define()` are not copied. They are written out, as this runs for every added or removed
 * body; test/bodyStore.js checks that none is missing.
 */
function copyBody(store, row, other, otherRow) {
  var D = store.D;
  for (var k = 0; k < D; ++k) {
    other.pos[otherRow * D + k] = store.pos[row * D + k];
    other.velocity[otherRow * D + k] = store.velocity[row * D + k];
    other.force[otherRow * D + k] = store.force[row * D + k];
  }
  other.mass[otherRow] = store.mass[row];
  other.pinned[otherRow] = store.pinned[row];
  other.springCount[otherRow] = store.springCount[row];
  other.springLength[otherRow] = store.springLength[row];
  other.degree[otherRow] = store.degree[row];
}
