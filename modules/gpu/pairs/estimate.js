// A step's pair work counted on the host from positions, the way the device's guard counts it:
// chunks of 256 candidates over the 3^D cells around each body, and the rank chunks of buckets
// over 1,024 bodies. It visits a bucket two neighbour cells share twice (the device once), so it
// can only count more. build.js plans a step's slices from it before the device has measured
// anything (the first step, or a stage whose radius just turned positive).
import { CELL_GROWTH, CHUNK, RANK_DIRECT } from './wgsl.js';

const CELL_LIMIT = 1073741823;

/**
 * {chunks, ranks} for `n` bodies at `pos` (D numbers each) and `radius`, with a table of `size`
 * buckets (a power of two).
 */
export function estimateWork(pos, n, D, radius, size) {
  const mask = size - 1;
  const inv = 1 / (radius * CELL_GROWTH);
  const cells = new Int32Array(n * D);
  const counts = new Uint32Array(size);
  for (let i = 0; i < n; i++) {
    for (let k = 0; k < D; k++) {
      cells[i * D + k] = Math.max(-CELL_LIMIT, Math.min(CELL_LIMIT, Math.floor(pos[i * D + k] * inv)));
    }
    counts[hash(cells, i * D, D, null) & mask] += 1;
  }
  const cellsAround = 3 ** D;
  const offset = new Int32Array(D);
  let chunks = 0;
  for (let i = 0; i < n; i++) {
    let candidates = 0;
    for (let o = 0; o < cellsAround; o++) {
      let rest = o;
      for (let k = 0; k < D; k++) { offset[k] = (rest % 3) - 1; rest = (rest / 3) | 0; }
      candidates += counts[hash(cells, i * D, D, offset) & mask];
    }
    chunks += Math.ceil(candidates / CHUNK);
  }
  let ranks = 0;
  for (let b = 0; b < size; b++) if (counts[b] > RANK_DIRECT) ranks += counts[b] * Math.ceil(counts[b] / CHUNK);
  return { chunks, ranks };
}

// The CPU's and the device's hash of a cell (lib/createNeighborGrid.js), shifted by `offset`
function hash(cells, at, D, offset) {
  let h = 0x165667b1;
  for (let k = 0; k < D; k++) {
    h = Math.imul(h ^ (cells[at + k] + (offset ? offset[k] : 0)), 0x27d4eb2d);
    h ^= h >>> 15;
  }
  return h >>> 0;
}
