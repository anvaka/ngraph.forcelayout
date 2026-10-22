module.exports = initColumnStore;

function Versions() {}
Versions.prototype = Object.create(null);

// Columns that setters of bodies and springs write. A setter raises its column's flag on this
// object, which has the same shape in every store, so setters stay as fast with many layouts in
// one process as with one; reading `versions` turns raised flags into new versions.
function HostWrites() {
  this.any = false;
  this.pos = false;
  this.velocity = false;
  this.mass = false;
  this.pinned = false;
  this.length = false;
  this.coefficient = false;
}
var SETTER_COLUMNS = ['pos', 'velocity', 'mass', 'pinned', 'length', 'coefficient'];

// Where a store keeps its versions. Every store reads them through the same getter, so that
// stores keep one shape however many there are: code that all layouts share reads them
var VERSIONS = typeof Symbol === 'function' ? Symbol('versions') : '$versions';

// `store.versions`: columns that setters wrote since the last read get new versions first
function readVersions() {
  var writes = this.writes, versions = this[VERSIONS];
  if (!writes.any) return versions;
  writes.any = false;
  for (var i = 0; i < SETTER_COLUMNS.length; ++i) {
    var name = SETTER_COLUMNS[i];
    if (!writes[name]) continue;
    writes[name] = false;
    versions[name] = ++this.versionClock;
  }
  return versions;
}

var TYPE_NAMES = {
  Float64Array: 'f64', Float32Array: 'f32', Int32Array: 'i32', Uint32Array: 'u32',
  Int16Array: 'i16', Uint16Array: 'u16', Int8Array: 'i8', Uint8Array: 'u8', Uint8ClampedArray: 'u8'
};

/**
 * Turns `store` into a table of numbers kept in flat typed arrays, one array per column.
 * Row `i` of a column with `size` numbers per row is `array[i * size + k]`, `k < size`.
 * Rows keep the order they were added in; removing one shifts the later rows down, so the
 * order (and every result computed from it) never depends on what was removed.
 *
 * `store` is expected to declare the fields below (and its built in columns) up front, so
 * that its shape stays fixed.
 *
 * Every column has a version, `store.versions[name]`: a number that grows whenever the column
 * changes in a way an engine with its own copy of the numbers should know about. Writes to the
 * arrays cannot be seen, so code that writes a column calls `store.changed(name)`; defining the
 * column, setters of bodies and springs, and graph edits do it themselves. `columnsVersion`
 * grows when a column is defined or removed.
 */
function initColumnStore(store, capacity) {
  var columns = [];
  // Columns whose initial value is not 0: a row never used before needs only these filled
  var withInitial = [];
  // Rows past this one still hold zeros from the allocation
  var highestUsed = 0;
  var builtInCount = 0;

  store.n = 0;
  store.capacity = 0;
  store.add = add;
  store.removeRows = removeRows;
  store.define = define;
  store.has = has;
  store.get = get;
  store.remove = removeColumn;
  store.names = names;
  store.sizeOf = sizeOf;
  store.copyTo = copyTo;
  store.typeOf = typeOf;
  // Versions of all columns come from one clock, so a column defined again never gets back an
  // old one. `versions` has no prototype chain and stays in fast mode (columns are never deleted
  // from it)
  var versions = store[VERSIONS] = new Versions();
  store.writes = new HostWrites();
  store.versionClock = 0;
  Object.defineProperty(store, 'versions', { get: readVersions, enumerable: true });
  store.columnsVersion = 0;
  store.changed = changed;
  store.lockBuiltIns = function () { builtInCount = columns.length; };
  store.reserve = function (size) { if (size > store.capacity) resize(size); };
  // Called after the arrays were replaced by bigger ones:
  store.onResize = null;

  if (capacity) resize(capacity);
  return store;

  /**
   * Adds a column with `size` numbers per row (1 by default). New rows get `initial` (0 by
   * default) in every slot.
   */
  function define(name, ArrayType, size, initial) {
    if (has(name)) throw new Error('Column ' + name + ' is already defined');
    var column = {
      name: name,
      ArrayType: ArrayType || Float64Array,
      size: size || 1,
      initial: initial || 0,
      array: null
    };
    column.array = new column.ArrayType(store.capacity * column.size);
    if (column.initial) column.array.fill(column.initial);
    columns.push(column);
    if (column.initial !== 0) withInitial.push(column);
    store[name] = column.array;
    store.columnsVersion += 1;
    changed(name);
    return column.array;
  }

  /**
   * Marks column `name` as changed (every column, without a name).
   */
  function changed(name) {
    if (name !== undefined) {
      versions[name] = ++store.versionClock;
      return;
    }
    for (var i = 0; i < columns.length; ++i) versions[columns[i].name] = ++store.versionClock;
  }


  function has(name) {
    return columns.some(function (c) { return c.name === name; });
  }

  function get(name) {
    for (var i = 0; i < columns.length; ++i) if (columns[i].name === name) return columns[i].array;
  }

  function removeColumn(name) {
    for (var i = builtInCount; i < columns.length; ++i) {
      if (columns[i].name === name) {
        var at = withInitial.indexOf(columns[i]);
        if (at >= 0) withInitial.splice(at, 1);
        columns.splice(i, 1);
        store[name] = undefined;
        changed(name);
        store.columnsVersion += 1;
        return true;
      }
    }
    return false;
  }

  function names() {
    return columns.map(function (c) { return c.name; });
  }

  /**
   * Kind of numbers of column `name`: 'f64', 'f32', 'i32', 'u32', 'i16', 'u16', 'i8' or 'u8'
   * (undefined when there is no such column).
   */
  function typeOf(name) {
    for (var i = 0; i < columns.length; ++i) {
      if (columns[i].name === name) return TYPE_NAMES[columns[i].ArrayType.name] || columns[i].ArrayType.name;
    }
  }

  /**
   * Numbers per row of column `name` (undefined when there is no such column).
   */
  function sizeOf(name) {
    for (var i = 0; i < columns.length; ++i) if (columns[i].name === name) return columns[i].size;
  }

  /**
   * Adds a row and returns its index. Its slots hold each column's initial value.
   */
  function add() {
    if (store.n === store.capacity) resize(Math.max(16, store.capacity * 2));
    var index = store.n++;
    var used = index < highestUsed;
    if (!used) highestUsed = index + 1;
    var fill = used ? columns : withInitial;
    for (var i = 0; i < fill.length; ++i) {
      var column = fill[i];
      var size = column.size, array = column.array, start = index * size;
      for (var k = 0; k < size; ++k) array[start + k] = column.initial;
    }
    return index;
  }

  /**
   * Removes the rows listed in `rows` (sorted, no repeats). The rows after them move down,
   * keeping their order.
   */
  function removeRows(rows) {
    var count = rows.length;
    if (count === 0) return;
    var n = store.n;
    for (var i = 0; i < columns.length; ++i) {
      var column = columns[i];
      var size = column.size, array = column.array;
      var write = rows[0];
      for (var h = 0; h < count; ++h) {
        var start = rows[h] + 1, end = h + 1 < count ? rows[h + 1] : n;
        if (end > start) {
          array.copyWithin(write * size, start * size, end * size);
          write += end - start;
        }
      }
    }
    store.n = n - count;
  }

  /**
   * Copies row `index` to row `otherIndex` of `other`, for every column both stores have.
   */
  function copyTo(index, other, otherIndex) {
    for (var i = 0; i < columns.length; ++i) {
      var column = columns[i];
      var target = other.get(column.name);
      if (!target) continue;
      var size = column.size;
      for (var k = 0; k < size; ++k) target[otherIndex * size + k] = column.array[index * size + k];
    }
  }

  function resize(newCapacity) {
    for (var i = 0; i < columns.length; ++i) {
      var column = columns[i];
      var bigger = new column.ArrayType(newCapacity * column.size);
      bigger.set(column.array.subarray(0, Math.min(column.array.length, store.n * column.size)));
      if (column.initial) bigger.fill(column.initial, store.n * column.size);
      column.array = bigger;
      store[column.name] = bigger;
    }
    store.capacity = newCapacity;
    if (store.onResize) store.onResize();
  }
}
