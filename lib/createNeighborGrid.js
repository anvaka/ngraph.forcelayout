module.exports = createNeighborGrid;

// All 3^D offsets from a cell to its neighbors (and itself)
function neighborOffsets(D) {
  var count = Math.pow(3, D);
  var offsets = new Int32Array(count * D);
  for (var o = 0; o < count; ++o) {
    var rest = o;
    for (var k = 0; k < D; ++k) {
      offsets[o * D + k] = (rest % 3) - 1;
      rest = (rest / 3) | 0;
    }
  }
  return offsets;
}

/**
 * A uniform grid over the bodies of a store, in any number of dimensions, for finding bodies
 * closer than some radius. Cells are hashed into a table, so empty space costs nothing.
 *
 * Build it with cells at least as large as the radius you will ask for: a query looks at the
 * 3^D cells around a body (9 in 2D, 27 in 3D).
 */
function createNeighborGrid(dimensions) {
  var D = dimensions;
  var cellSize = 1;
  var n = 0;
  var pos = null;
  var store = null;
  // Cell coordinates of every body, and the table bucket of its cell:
  var cells = new Int32Array(0), bucketOf = new Int32Array(0);
  // Bodies sorted by bucket; bucket b holds sorted[bucketStart[b] .. bucketStart[b + 1] - 1]
  var sorted = new Int32Array(0), bucketStart = new Int32Array(1);
  var tableMask = 0;
  var next = new Int32Array(0);
  var neighborCell = new Int32Array(D);

  var offsetCount = Math.pow(3, D);
  var offsets = neighborOffsets(D);

  var api = {
    /**
     * Sorts the bodies of `bodyStore` into cells of `size`.
     */
    build: build,

    /**
     * Calls `fn(i, j, r)` once for every pair of bodies closer than `radius` (and not at the
     * same point).
     */
    forEachPair: forEachPair,

    /**
     * Calls `fn(j, r)` for every body `j` closer than `radius` to body `i`.
     */
    forEachNeighbor: forEachNeighbor,

    /**
     * For every pair closer than `radius`: `s = rule(i, j, r, store)` adds `s * (pos_i - pos_j)`
     * to the force of `i` and the opposite to `j`. When not `symmetric`, the rule is asked for
     * (i, j) and (j, i), and each answer moves only the first body.
     */
    applyPairRule: applyPairRule,

    cellSize: function () { return cellSize; }
  };
  return api;

  function build(bodyStore, size) {
    if (!(size > 0)) throw new Error('Grid cells need a positive size');
    store = bodyStore;
    pos = bodyStore.pos;
    n = bodyStore.n;
    cellSize = size;
    if (cells.length < n * D) {
      cells = new Int32Array(n * D);
      bucketOf = new Int32Array(n);
      sorted = new Int32Array(n);
    }
    var tableSize = 1;
    while (tableSize < 2 * n) tableSize *= 2;
    if (bucketStart.length !== tableSize + 1) bucketStart = new Int32Array(tableSize + 1);
    else bucketStart.fill(0);
    tableMask = tableSize - 1;

    for (var i = 0; i < n; ++i) {
      for (var k = 0; k < D; ++k) cells[i * D + k] = Math.floor(pos[i * D + k] / size);
      var bucket = hash(cells, i * D);
      bucketOf[i] = bucket;
      bucketStart[bucket + 1] += 1;
    }
    for (var b = 0; b < tableSize; ++b) bucketStart[b + 1] += bucketStart[b];
    // counting sort: `next` is the next free slot of each bucket
    if (next.length !== tableSize) next = new Int32Array(tableSize);
    next.set(bucketStart.subarray(0, tableSize));
    for (i = 0; i < n; ++i) sorted[next[bucketOf[i]]++] = i;
    return api;
  }

  function hash(coordinates, offset) {
    var h = 0x165667b1;
    for (var k = 0; k < D; ++k) {
      h = Math.imul(h ^ coordinates[offset + k], 0x27d4eb2d);
      h ^= h >>> 15;
    }
    return h & tableMask;
  }

  function sameCell(j) {
    for (var k = 0; k < D; ++k) if (cells[j * D + k] !== neighborCell[k]) return false;
    return true;
  }

  function distance(i, j) {
    var r2 = 0;
    for (var k = 0; k < D; ++k) {
      var d = pos[i * D + k] - pos[j * D + k];
      r2 += d * d;
    }
    return Math.sqrt(r2);
  }

  // Bucket of the o-th neighbor cell of body i (the cell itself is in `neighborCell`)
  function neighborBucket(i, o) {
    for (var k = 0; k < D; ++k) neighborCell[k] = cells[i * D + k] + offsets[o * D + k];
    return hash(neighborCell, 0);
  }

  function forEachNeighbor(i, radius, fn) {
    for (var o = 0; o < offsetCount; ++o) {
      var bucket = neighborBucket(i, o);
      for (var s = bucketStart[bucket], end = bucketStart[bucket + 1]; s < end; ++s) {
        var j = sorted[s];
        // a bucket can hold bodies of other cells too
        if (j === i || !sameCell(j)) continue;
        var r = distance(i, j);
        if (r < radius) fn(j, r);
      }
    }
  }

  function forEachPair(radius, fn) {
    for (var i = 0; i < n; ++i) {
      for (var o = 0; o < offsetCount; ++o) {
        var bucket = neighborBucket(i, o);
        for (var s = bucketStart[bucket], end = bucketStart[bucket + 1]; s < end; ++s) {
          var j = sorted[s];
          // each pair once; a bucket can hold bodies of other cells too
          if (j <= i || !sameCell(j)) continue;
          var r = distance(i, j);
          if (r > 0 && r < radius) fn(i, j, r);
        }
      }
    }
  }

  function applyPairRule(radius, rule, symmetric) {
    var force = store.force;
    forEachPair(radius, function (i, j, r) {
      var s = rule(i, j, r, store);
      var t = symmetric ? s : rule(j, i, r, store);
      if (!s && !t) return;
      for (var k = 0; k < D; ++k) {
        var d = pos[i * D + k] - pos[j * D + k];
        force[i * D + k] += s * d;
        force[j * D + k] -= t * d;
      }
    });
  }
}
