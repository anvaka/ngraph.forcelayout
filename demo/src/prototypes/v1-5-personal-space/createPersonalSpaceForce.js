// Short-range "personal space" push between bodies, for 2D layouts.
//
// Two bodies closer than `radius` push each other apart with
//   F(r) = 2C (1/r^3 - 1/a^3),          a/2 <= r < a
//   F(r) = F(a/2) + |F'(a/2)| (a/2 - r), r < a/2 (linear, keeps the push bounded)
// This is the force 2C/r^3 of the pair energy C/r^2, shifted down by 2C/a^3 so that it fades to
// zero at r = a: squeezing a body into a space r costs energy that grows like 1/r^2 (Feynman,
// Lectures on Physics I, 38-4). C is chosen so that F(a/2) = strength. Bodies farther apart than
// `a` feel nothing.
//
// Neighbours are found with a uniform grid of cells of size `a`, stored in a hash table of linked
// lists (typed arrays, no allocation per step). Only pairs in neighbouring cells are tested.
//
// apply() also fills `stiffness` with how stiff the push is around every body (the sum of
// 2|dF/dr| over its pairs, a bound on the largest eigenvalue). The caller uses it to keep the
// integrator stable.

export default function createPersonalSpaceForce(bodies, groupOf) {
  let n = 0;
  let cellX, cellY, next, head, mask, px, py, fx, fy, stiff;
  ensureCapacity(bodies.length);

  return {
    /**
     * Adds the push to body.force for every pair closer than `radius`.
     * When `sameGroupOnly` is set, only pairs with equal groupOf[] values push.
     * Returns the number of pairs tested (a measure of the work done).
     */
    apply(radius, strength, sameGroupOnly) {
      n = bodies.length;
      ensureCapacity(n);
      stiff.fill(0, 0, n);
      if (n < 2 || !(radius > 0) || !(strength > 0)) return 0;

      const a = radius, a3 = a * a * a, half = a / 2;
      const C = strength * a3 / 14;            // 2C (8/a^3 - 1/a^3) = strength
      const slope = 6 * C / (half * half * half * half);
      // absurd radius or strength values overflow or underflow these; then push nothing
      if (!(C > 0) || !Number.isFinite(C) || !Number.isFinite(slope)) return 0;

      head.fill(-1);
      for (let i = 0; i < n; ++i) {
        const pos = bodies[i].pos;
        px[i] = pos.x; py[i] = pos.y; fx[i] = 0; fy[i] = 0;
        const cx = Math.floor(pos.x / a), cy = Math.floor(pos.y / a);
        cellX[i] = cx; cellY[i] = cy;
        const h = hash(cx, cy);
        next[i] = head[h];
        head[h] = i;
      }

      // Half stencil: the body's own cell (bodies after it in the list) and 4 of its 8
      // neighbours, so every pair is visited once.
      let tested = 0;
      for (let i = 0; i < n; ++i) {
        const cx = cellX[i], cy = cellY[i];
        tested += visit(i, next[i], cx, cy, a, a3, half, C, slope, strength, sameGroupOnly);
        tested += visit(i, head[hash(cx + 1, cy)], cx + 1, cy, a, a3, half, C, slope, strength, sameGroupOnly);
        tested += visit(i, head[hash(cx - 1, cy + 1)], cx - 1, cy + 1, a, a3, half, C, slope, strength, sameGroupOnly);
        tested += visit(i, head[hash(cx, cy + 1)], cx, cy + 1, a, a3, half, C, slope, strength, sameGroupOnly);
        tested += visit(i, head[hash(cx + 1, cy + 1)], cx + 1, cy + 1, a, a3, half, C, slope, strength, sameGroupOnly);
      }
      for (let i = 0; i < n; ++i) {
        const body = bodies[i];
        if (body.isPinned || !Number.isFinite(fx[i] + fy[i])) continue;
        body.force.x += fx[i];
        body.force.y += fy[i];
      }
      return tested;
    },

    /** Stiffness bound per body from the last apply(), in body order */
    get stiffness() { return stiff; }
  };

  // Pushes body i away from every body of the list starting at j that lies in cell (qx, qy)
  function visit(i, j, qx, qy, a, a3, half, C, slope, strength, sameGroupOnly) {
    const xi = px[i], yi = py[i], groupI = groupOf[i];
    let tested = 0, fxi = 0, fyi = 0, stiffI = 0;
    while (j >= 0) {
      // the cell check skips other cells that share the hash bucket
      if (cellX[j] === qx && cellY[j] === qy && (!sameGroupOnly || groupOf[j] === groupI)) {
        tested += 1;
        let ux = xi - px[j], uy = yi - py[j];
        let r = Math.sqrt(ux * ux + uy * uy);
        if (r < a) {
          if (r > 1e-9) {
            ux /= r; uy /= r;
          } else {
            // Same spot: pick a direction from the indices, so runs are repeatable
            const angle = ((i * 7919 + j * 104729) % 360) * Math.PI / 180;
            ux = Math.cos(angle); uy = Math.sin(angle); r = 0;
          }
          let f, k;
          if (r >= half) {
            const r3 = r * r * r;
            f = 2 * C * (1 / r3 - 1 / a3);
            k = 6 * C / (r3 * r);
          } else {
            f = strength + slope * (half - r);
            k = slope;
          }
          fxi += f * ux; fyi += f * uy;
          stiffI += 2 * k; stiff[j] += 2 * k;
          fx[j] -= f * ux; fy[j] -= f * uy;
        }
      }
      j = next[j];
    }
    fx[i] += fxi; fy[i] += fyi; stiff[i] += stiffI;
    return tested;
  }

  function hash(cx, cy) {
    // Integer mix of the two cell coordinates (they can be negative)
    let h = Math.imul(cx | 0, 73856093) ^ Math.imul(cy | 0, 19349663);
    return (h ^ (h >>> 16)) & mask;
  }

  function ensureCapacity(count) {
    if (cellX && cellX.length >= count) return;
    const size = Math.max(16, count);
    cellX = new Int32Array(size);
    cellY = new Int32Array(size);
    next = new Int32Array(size);
    px = new Float64Array(size); py = new Float64Array(size);
    fx = new Float64Array(size); fy = new Float64Array(size);
    stiff = new Float64Array(size);
    let tableSize = 16;
    while (tableSize < 2 * size) tableSize *= 2;
    head = new Int32Array(tableSize);
    mask = tableSize - 1;
  }
}
