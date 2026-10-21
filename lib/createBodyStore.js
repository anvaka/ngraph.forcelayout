module.exports = createBodyStore;
module.exports.createSingleBodyStore = createSingleBodyStore;
module.exports.copyBody = copyBody;

var initColumnStore = require('./initColumnStore');

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
    // number of springs attached to the body
    degree: null,

    add: null, removeRows: null, define: null, has: null, get: null, remove: null,
    names: null, copyTo: null, lockBuiltIns: null, reserve: null, onResize: null
  };
  initColumnStore(store);

  store.define('pos', Float64Array, dimensions);
  store.define('velocity', Float64Array, dimensions);
  store.define('force', Float64Array, dimensions);
  store.define('mass', Float64Array, 1, 1);
  store.define('pinned', Uint8Array, 1);
  store.define('springCount', Float64Array, 1);
  store.define('springLength', Float64Array, 1);
  store.define('degree', Float64Array, 1);
  store.lockBuiltIns();

  if (capacity) store.reserve(capacity);
  return store;
}

/**
 * The numbers of one body that is not in a simulator: the built in columns, without the
 * machinery to add or remove rows.
 */
function createSingleBodyStore(dimensions) {
  return {
    D: dimensions,
    n: 1,
    pos: new Float64Array(dimensions),
    velocity: new Float64Array(dimensions),
    force: new Float64Array(dimensions),
    mass: new Float64Array([1]),
    pinned: new Uint8Array(1),
    springCount: new Float64Array(1),
    springLength: new Float64Array(1),
    degree: new Float64Array(1)
  };
}

/**
 * Copies the built in columns of body `row` to body `otherRow` of `other`.
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
