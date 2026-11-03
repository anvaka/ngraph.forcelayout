// How much room each node has: the distance to its nearest neighbour that is at least as big. The
// view draws no node wider than a share of its room (option `nodeRoom`), so where nodes crowd
// (the leaves around a hub, the core of a hairball) small nodes give way to bigger ones instead
// of merging into a solid disc, while a node with space around it keeps its size.
//
// Only the room that would cap a node matters: node i is searched up to `reach[i]` (its drawn
// diameter over the share), so small nodes look at a few cells and big ones further. One pass
// puts the nodes into the buckets of a hashed uniform grid (a counting sort), sized for the
// typical node's spacing; a node searches at most MAX_RINGS rings of cells, so a big node isn't
// capped by what is further than that (big nodes keep their size). Positions are the view's packed texture data: four floats per node, x, y, z first.

const MAX_RINGS = 6;

/**
 * Fills `out[i]` with node i's room in scene units, or 0 when it has more than `reach[i]`.
 * `sizes[i]` is node i's diameter: a node yields only to neighbours at least as big. `depth`: use
 * z as well (3D). `cache` keeps the grid's arrays between calls.
 */
export function computeRooms(data, n, sizes, reach, depth, out, cache = {}) {
  out.fill(0, 0, n);
  if (n < 2) return out;
  let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0, o = 0; i < n; ++i, o += 4) {
    let x = data[o], y = data[o + 1], z = depth ? data[o + 2] : 0;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (z < minZ) minZ = z;
    if (z > maxZ) maxZ = z;
  }
  if (!(maxX >= minX)) return out;
  // Cells about as wide as the spacing where the typical node is (a few nodes a cell there), and
  // never so small that the most common reach needs more than MAX_RINGS rings. Cells are hashed
  // into a table of buckets, so far-flung nodes cost no empty cells.
  let w = maxX - minX, h = maxY - minY, d = depth ? maxZ - minZ : 0;
  let cell = Math.max(crowdedSpacing(data, n, minX, minY, minZ, w, h, d, depth, cache) * 1.5, medianOf(reach, n, cache) / MAX_RINGS);
  if (!(cell > 0)) return out;
  let buckets = 1;
  while (buckets < 2 * n) buckets *= 2;
  let mask = buckets - 1;
  if (!cache.start || cache.start.length < buckets + 1) {
    cache.start = new Int32Array(buckets + 1);
    cache.fill = new Int32Array(buckets);
  }
  if (!cache.cellOf || cache.cellOf.length < n) {
    cache.cellOf = new Int32Array(n * 3);
    cache.order = new Int32Array(n);
  }
  let start = cache.start, fill = cache.fill, cellOf = cache.cellOf, order = cache.order;
  start.fill(0, 0, buckets + 1);
  let bucketOf = (kx, ky, kz) => (Math.imul(kx, 73856093) ^ Math.imul(ky, 19349663) ^ Math.imul(kz, 83492791)) & mask;
  for (let i = 0, o = 0; i < n; ++i, o += 4) {
    let kx = Math.floor((data[o] - minX) / cell);
    let ky = Math.floor((data[o + 1] - minY) / cell);
    let kz = depth ? Math.floor((data[o + 2] - minZ) / cell) : 0;
    cellOf[3 * i] = kx;
    cellOf[3 * i + 1] = ky;
    cellOf[3 * i + 2] = kz;
    start[bucketOf(kx, ky, kz) + 1] += 1;
  }
  for (let c = 0; c < buckets; ++c) start[c + 1] += start[c];
  fill.set(start.subarray(0, buckets));
  for (let i = 0; i < n; ++i) order[fill[bucketOf(cellOf[3 * i], cellOf[3 * i + 1], cellOf[3 * i + 2])]++] = i;

  for (let i = 0, o = 0; i < n; ++i, o += 4) {
    let limit = reach[i];
    if (!(limit > 0)) continue;
    // Big nodes look at most MAX_RINGS rings away: what is further doesn't cap them
    let rings = Math.min(MAX_RINGS, Math.ceil(limit / cell));
    let x = data[o], y = data[o + 1], z = depth ? data[o + 2] : 0;
    let size = sizes[i];
    let ix = cellOf[3 * i], iy = cellOf[3 * i + 1], iz = cellOf[3 * i + 2];
    let best = limit * limit;
    for (let ring = 0; ring <= rings; ++ring) {
      // every point of this ring is at least (ring - 1) cells away
      let near = (ring - 1) * cell;
      if (ring > 1 && near * near >= best) break;
      let z0 = depth ? iz - ring : 0, z1 = depth ? iz + ring : 0;
      for (let kz = z0; kz <= z1; ++kz) {
        let edgeZ = depth && Math.abs(kz - iz) === ring;
        for (let ky = iy - ring; ky <= iy + ring; ++ky) {
          let edge = edgeZ || Math.abs(ky - iy) === ring;
          // inside the ring only its two ends in x are new
          let step = edge || ring === 0 ? 1 : 2 * ring;
          for (let kx = ix - ring; kx <= ix + ring; kx += step) {
            let k = bucketOf(kx, ky, kz);
            for (let q = start[k], end = start[k + 1]; q < end; ++q) {
              let j = order[q];
              if (j === i || sizes[j] < size) continue;
              let p = j * 4;
              let dx = data[p] - x, dy = data[p + 1] - y, dz = depth ? data[p + 2] - z : 0;
              let dist = dx * dx + dy * dy + dz * dz;
              if (dist < best) best = dist;
            }
          }
        }
      }
    }
    if (best < limit * limit) out[i] = Math.sqrt(best);
  }
  return out;
}

// Spacing of nodes where the typical node is, from a coarse grid over the box (32 bins a side)
function crowdedSpacing(data, n, minX, minY, minZ, w, h, d, depth, cache) {
  let bins = depth ? 16 : 32, total = depth ? bins * bins * bins : bins * bins;
  if (!cache.bins || cache.bins.length < total) cache.bins = new Int32Array(total);
  let counts = cache.bins;
  counts.fill(0, 0, total);
  let bx = Math.max(w, 1e-9) / bins, by = Math.max(h, 1e-9) / bins, bz = Math.max(d, 1e-9) / bins;
  for (let i = 0, o = 0; i < n; ++i, o += 4) {
    let kx = Math.min(bins - 1, Math.floor((data[o] - minX) / bx));
    let ky = Math.min(bins - 1, Math.floor((data[o + 1] - minY) / by));
    let kz = depth ? Math.min(bins - 1, Math.floor((data[o + 2] - minZ) / bz)) : 0;
    counts[(kz * bins + ky) * bins + kx] += 1;
  }
  // The crowding the typical node sees: the bin that holds the median node, densest first
  let filled = Array.from(counts.subarray(0, total)).filter(c => c > 0).sort((a, b) => b - a);
  let crowd = 1;
  for (let k = 0, seen = 0; k < filled.length; ++k) {
    seen += filled[k];
    crowd = filled[k];
    if (seen >= n / 2) break;
  }
  let volume = depth ? bx * by * bz : bx * by;
  return (depth ? Math.cbrt : Math.sqrt)(volume / crowd);
}

function medianOf(values, n, cache) {
  if (!cache.sample) cache.sample = new Float32Array(1024);
  let sample = cache.sample, m = Math.min(n, sample.length), stride = n / m;
  for (let k = 0; k < m; ++k) sample[k] = values[Math.floor(k * stride)];
  let part = sample.subarray(0, m).sort();
  return part[m >> 1];
}
