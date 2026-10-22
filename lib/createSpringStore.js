module.exports = createSpringStore;

var initColumnStore = require('./initColumnStore');

/**
 * Numbers of springs, in flat typed arrays (see initColumnStore.js). Spring `i` connects bodies
 * `from[i]` and `to[i]`; `length[i] < 0` and `coefficient[i] <= 0` mean "use the simulator's
 * setting".
 */
function createSpringStore(capacity) {
  var store = {
    n: 0,
    capacity: 0,

    from: null,
    to: null,
    length: null,
    coefficient: null,

    add: null, removeRows: null, define: null, has: null, get: null, remove: null,
    names: null, sizeOf: null, copyTo: null, lockBuiltIns: null, reserve: null, onResize: null,
    typeOf: null, versions: null, versionClock: 0, columnsVersion: 0, changed: null
  };
  initColumnStore(store);

  store.define('from', Int32Array, 1);
  store.define('to', Int32Array, 1);
  store.define('length', Float64Array, 1, -1);
  store.define('coefficient', Float64Array, 1, -1);
  store.lockBuiltIns();

  if (capacity) store.reserve(capacity);
  return store;
}
