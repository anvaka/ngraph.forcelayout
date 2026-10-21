/**
 * Barnes-Hut repulsion (2D) where every push fades as it crosses other nodes, like light
 * through a cloud. The push of j on i is the library's
 *
 *     gravity * m_i * m_j / r^2
 *
 * times exp(-r * min(1 / minReach, crossSection * density)), where `density` is the number of
 * bodies per unit area along the segment from i to j: for a cell, Simpson's rule over three samples
 * of a density grid (at i, at the middle, at the cell's center of mass); for a pair of bodies, which
 * are usually close, the mean of the two ends. Sparse parts of the graph (trees, grids) stay almost
 * transparent; crowds (a hub with its leaves, a dense core) dim the push of whatever lies behind
 * them, but never on a scale shorter than `minReach`.
 *
 * Same opening rule as the library's quad tree: a cell acts as one body when
 * width / distance-to-its-center-of-mass < theta. Cells that are dark enough are skipped.
 */
const MAX_DEPTH = 48;
const MAX_GRID = 1024; // density grid side, in cells
const DARK = 13; // exp(-13) ~ 2e-6: treat as fully dimmed
// exp(-x) on [0, DARK] from a table with linear interpolation: several times faster than Math.exp
// in this loop, and accurate to ~1e-6
const EXP_STEPS = 4096, EXP_SCALE = EXP_STEPS / DARK;
const EXP_TABLE = new Float64Array(EXP_STEPS + 2);
for (let k = 0; k < EXP_TABLE.length; k++) EXP_TABLE[k] = Math.exp(-k / EXP_SCALE);
function fade(x) {
  if (x >= DARK) return 0;
  const t = x * EXP_SCALE, k = t | 0;
  return EXP_TABLE[k] + (EXP_TABLE[k + 1] - EXP_TABLE[k]) * (t - k);
}

export default function createScreenedRepulsion() {
  // Bodies, copied into flat arrays every step
  let n = 0, X, Y, M, rho, next;
  // Tree: one entry per cell, children in blocks of four
  let capacity = 0, count = 0;
  let child, first, cellX, cellY, cellSize, cellMass, comX, comY, comRho;
  // Density grid
  let grid = new Float32Array(0), gx0 = 0, gy0 = 0, gh = 1, invH = 1, gw = 0, gH = 0, invArea = 1;
  let stack = new Int32Array(1024);
  const stats = { interactions: 0, skipped: 0 };

  return { computeForces, stats };

  /**
   * Adds the repulsion to body.force for every body that is not pinned, after resetting it.
   * `options`: gravity, theta, crossSection (per unit length, finite, >= 0), minReach (length,
   * >= 0; 0 = no floor), cell (length).
   */
  function computeForces(bodies, options) {
    n = bodies.length;
    if (n === 0) return;
    if (!X || X.length < n) {
      X = new Float64Array(n); Y = new Float64Array(n); M = new Float64Array(n);
      rho = new Float64Array(n); next = new Int32Array(n);
    }
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < n; i++) {
      const b = bodies[i], x = b.pos.x, y = b.pos.y;
      X[i] = x; Y[i] = y; M[i] = b.mass;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    buildDensity(x0, y0, x1, y1, options.cell);
    buildTree(x0, y0, Math.max(x1 - x0, y1 - y0));

    const gravity = options.gravity, theta = options.theta;
    const sigma = options.crossSection, maxOpacity = 1 / options.minReach;
    let interactions = 0, skipped = 0;
    for (let i = 0; i < n; i++) {
      const body = bodies[i];
      if (body.isPinned) continue;
      body.reset();
      const xi = X[i], yi = Y[i], ri = rho[i];
      let fx = 0, fy = 0, top = 0;
      stack[top++] = 0;
      while (top > 0) {
        const c = stack[--top];
        let j = first[c];
        if (j >= 0) {
          // A leaf: exact pushes from its bodies (more than one only at MAX_DEPTH)
          do {
            if (j !== i) {
              let dx = X[j] - xi, dy = Y[j] - yi, r2 = dx * dx + dy * dy;
              if (r2 === 0) { dx = jitter(i, j); dy = jitter(j, i); r2 = dx * dx + dy * dy; }
              const r = Math.sqrt(r2);
              // The walk reaches single bodies mostly near i (farther ones usually come as cells),
              // so the density at the two ends stands for the density between them. In sparse
              // parts it also reaches lone bodies up to ~20 link lengths away; there the gap
              // between the two ends is not counted.
              const opacity = Math.min(maxOpacity, sigma * (ri + rho[j]) * 0.5);
              const v = gravity * M[j] * fade(r * opacity) / (r2 * r);
              fx += v * dx; fy += v * dy;
              interactions++;
            }
            j = next[j];
          } while (j >= 0);
          continue;
        }
        if (cellMass[c] === 0) continue;
        const dx = comX[c] - xi, dy = comY[c] - yi, r2 = dx * dx + dy * dy;
        const r = Math.sqrt(r2), size = cellSize[c];
        const mid = density(xi + dx * 0.5, yi + dy * 0.5);
        const opacity = Math.min(maxOpacity, sigma * (ri + 4 * mid + comRho[c]) / 6);
        const nearest = r - 0.71 * size;
        if (nearest > 0 && nearest * opacity > DARK) { skipped++; continue; }
        if (r > 0 && size / r < theta) {
          const v = gravity * cellMass[c] * fade(r * opacity) / (r2 * r);
          fx += v * dx; fy += v * dy;
          interactions++;
        } else {
          if (top + 4 > stack.length) { const s = new Int32Array(stack.length * 2); s.set(stack); stack = s; }
          const k = 4 * c;
          if (child[k] >= 0) stack[top++] = child[k];
          if (child[k + 1] >= 0) stack[top++] = child[k + 1];
          if (child[k + 2] >= 0) stack[top++] = child[k + 2];
          if (child[k + 3] >= 0) stack[top++] = child[k + 3];
        }
      }
      body.force.x += M[i] * fx;
      body.force.y += M[i] * fy;
    }
    stats.interactions = interactions;
    stats.skipped = skipped;
  }

  function buildDensity(x0, y0, x1, y1, cell) {
    gh = cell > 0 ? cell : 10;
    while ((x1 - x0) / gh >= MAX_GRID || (y1 - y0) / gh >= MAX_GRID) gh *= 2;
    gx0 = x0; gy0 = y0; invH = 1 / gh;
    gw = Math.floor((x1 - x0) / gh) + 1; gH = Math.floor((y1 - y0) / gh) + 1;
    // Bodies at NaN or infinity (the layout already broke down, e.g. at a spring length of 1e300):
    // a one-cell grid instead of an impossible allocation
    if (!(gw * gH <= MAX_GRID * MAX_GRID)) gw = gH = 1;
    if (grid.length < gw * gH) grid = new Float32Array(gw * gH);
    else grid.fill(0, 0, gw * gH);
    invArea = 1 / (gh * gh);
    for (let i = 0; i < n; i++) grid[(((Y[i] - gy0) * invH) | 0) * gw + (((X[i] - gx0) * invH) | 0)] += 1;
    for (let i = 0; i < n; i++) rho[i] = grid[(((Y[i] - gy0) * invH) | 0) * gw + (((X[i] - gx0) * invH) | 0)] * invArea;
  }

  function density(x, y) {
    const u = (x - gx0) * invH, w = (y - gy0) * invH;
    if (u < 0 || w < 0 || u >= gw || w >= gH) return 0;
    return grid[(w | 0) * gw + (u | 0)] * invArea;
  }

  function buildTree(x0, y0, side) {
    count = 0;
    ensureCapacity(Math.max(16, 2 * n));
    newCell(x0, y0, side * (1 + 1e-9) + 1e-9);
    for (let i = 0; i < n; i++) insert(i);
    // Children are always created after their parent, so a backwards pass sums children first
    for (let c = count - 1; c >= 0; c--) {
      let m = 0, mx = 0, my = 0, j = first[c];
      if (j >= 0) {
        do { m += M[j]; mx += M[j] * X[j]; my += M[j] * Y[j]; j = next[j]; } while (j >= 0);
      } else {
        for (let q = 0; q < 4; q++) {
          const k = child[4 * c + q];
          if (k >= 0) { m += cellMass[k]; mx += cellMass[k] * comX[k]; my += cellMass[k] * comY[k]; }
        }
      }
      cellMass[c] = m;
      comX[c] = m > 0 ? mx / m : cellX[c];
      comY[c] = m > 0 ? my / m : cellY[c];
      comRho[c] = density(comX[c], comY[c]);
    }
  }

  function insert(i) {
    next[i] = -1;
    let c = 0, depth = 0;
    if (first[0] === -1 && isEmpty(0)) { first[0] = i; return; }
    while (true) {
      const j = first[c];
      if (j >= 0) {
        if (depth >= MAX_DEPTH) { next[i] = next[j]; next[j] = i; return; } // same spot: share the leaf
        // Split the leaf: its body moves one level down
        first[c] = -2;
        const q = quadrant(c, X[j], Y[j]);
        const moved = newChild(c, q); // may grow the arrays: assign after the call
        child[4 * c + q] = moved;
        first[moved] = j;
      }
      const q = quadrant(c, X[i], Y[i]);
      const k = child[4 * c + q];
      if (k < 0) {
        const leaf = newChild(c, q);
        child[4 * c + q] = leaf;
        first[leaf] = i;
        return;
      }
      c = k; depth++;
    }
  }

  function isEmpty(c) {
    return child[4 * c] < 0 && child[4 * c + 1] < 0 && child[4 * c + 2] < 0 && child[4 * c + 3] < 0;
  }

  function quadrant(c, x, y) {
    const h = cellSize[c] / 2;
    return (x > cellX[c] + h ? 1 : 0) + (y > cellY[c] + h ? 2 : 0);
  }

  function newChild(c, q) {
    const h = cellSize[c] / 2;
    return newCell(cellX[c] + (q & 1 ? h : 0), cellY[c] + (q & 2 ? h : 0), h);
  }

  function newCell(x, y, size) {
    if (count === capacity) ensureCapacity(capacity * 2);
    const c = count++;
    cellX[c] = x; cellY[c] = y; cellSize[c] = size;
    first[c] = -1;
    child[4 * c] = child[4 * c + 1] = child[4 * c + 2] = child[4 * c + 3] = -1;
    return c;
  }

  function ensureCapacity(size) {
    if (size <= capacity) return;
    const grow = (Type, old, length) => { const a = new Type(length); if (old) a.set(old.subarray(0, Math.min(old.length, length))); return a; };
    child = grow(Int32Array, child, 4 * size);
    first = grow(Int32Array, first, size);
    cellX = grow(Float64Array, cellX, size);
    cellY = grow(Float64Array, cellY, size);
    cellSize = grow(Float64Array, cellSize, size);
    cellMass = grow(Float64Array, cellMass, size);
    comX = grow(Float64Array, comX, size);
    comY = grow(Float64Array, comY, size);
    comRho = grow(Float64Array, comRho, size);
    capacity = size;
  }
}

// Bodies at exactly the same spot: a tiny fixed nudge, so the push has a direction
function jitter(a, b) {
  const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453;
  return (s - Math.floor(s) - 0.5) / 50;
}
