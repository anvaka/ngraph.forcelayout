/**
 * A 2D Barnes-Hut quad tree for a repulsion where some pushes fade with distance.
 *
 * Every body is either "core" or "leaf". A push between two core bodies is the library's
 * usual one, g * m1 * m2 / r^2. A push that involves at least one leaf body fades:
 * g * m1 * m2 * exp(-r / fade) / r^2. The rule is the same for both bodies of a pair, so
 * action still equals reaction.
 *
 * Each cell of the tree keeps two charges, core and leaf, each with its own center, so one
 * tree walk serves both kinds of push. Faded pushes past `cutoff` are dropped: a leaf body
 * only walks the cells near it, and a core body ignores the leaf charge of far cells.
 *
 * Cells live in flat typed arrays that grow as needed. A cell without children keeps its
 * bodies as a list; bodies only share a list when they sit at the same point.
 */
const TABLE_SIZE = 2048;
const TABLE_RANGE = 8; // the fade table covers r / fade in [0, 8]; exp(-8) = 0.03%

export default function createLeafFadeTree() {
  let capacity = 0;
  let child, head, isInner;              // 4 children per cell, first body in a cell, inner flag
  let minX, minY, size;                  // cell square
  let coreMass, coreX, coreY;            // core charge and its center (sums while building)
  let leafMass, leafX, leafY;            // leaf charge and its center (sums while building)
  let allX, allY;                        // center of both charges together
  let cellCount = 0;

  let bodyCapacity = 0;
  let next, px, py, mass, leaf;          // per body: list link, position, charge, leaf flag
  let stack = new Int32Array(1024);

  // exp(-u) sampled on [0, TABLE_RANGE], read with linear interpolation
  const fadeTable = new Float64Array(TABLE_SIZE + 2);
  for (let k = 0; k <= TABLE_SIZE + 1; ++k) fadeTable[k] = Math.exp(-k * TABLE_RANGE / TABLE_SIZE);

  grow(1024);

  return { build, force };

  /**
   * Builds the tree. `isLeaf[i]` (0 or 1) says how body i pushes.
   */
  function build(bodies, isLeaf) {
    const n = bodies.length;
    if (n > bodyCapacity) growBodies(n);
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < n; ++i) {
      const pos = bodies[i].pos;
      const x = pos.x, y = pos.y;
      px[i] = x; py[i] = y;
      mass[i] = bodies[i].mass;
      leaf[i] = isLeaf[i];
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    cellCount = 0;
    if (n === 0) return;
    const side = Math.max(x1 - x0, y1 - y0, 1e-9) * 1.0001;
    newCell(x0, y0, side);
    for (let i = 0; i < n; ++i) insert(i);
    // weighted sums -> centers
    for (let c = 0; c < cellCount; ++c) {
      const cm = coreMass[c], lm = leafMass[c], total = cm + lm;
      allX[c] = (coreX[c] + leafX[c]) / total;
      allY[c] = (coreY[c] + leafY[c]) / total;
      if (cm > 0) { coreX[c] /= cm; coreY[c] /= cm; }
      if (lm > 0) { leafX[c] /= lm; leafY[c] /= lm; }
    }
  }

  /**
   * Adds the push on body `i` to `out` ([fx, fy]). `gravity` is the library's (negative)
   * coefficient, `theta` the Barnes-Hut opening ratio, `fade` the fade length (0 drops every
   * faded push, when `cutoff` is 0 too).
   */
  function force(i, gravity, theta, fade, cutoff, random, out) {
    if (cellCount === 0) return;
    // local copies: faster to read in the loop below
    const cellChild = child, cellHead = head, inner = isInner, cellX = minX, cellY = minY, cellSize = size;
    const cMass = coreMass, cX = coreX, cY = coreY, lMass = leafMass, lX = leafX, lY = leafY, aX = allX, aY = allY;
    const bodyNext = next, bx = px, by = py, bodyMass = mass, bodyLeaf = leaf, table = fadeTable;
    const x = bx[i], y = by[i], gi = gravity * bodyMass[i], sourceIsLeaf = bodyLeaf[i] === 1;
    const cutoff2 = cutoff * cutoff, toTable = fade > 0 ? TABLE_SIZE / (TABLE_RANGE * fade) : 0;
    let fx = 0, fy = 0;
    let todo = stack, top = 0;
    todo[top++] = 0;
    while (top > 0) {
      const c = todo[--top];
      if (inner[c] === 0) {
        // a cell with bodies: exact pushes
        for (let j = cellHead[c]; j !== -1; j = bodyNext[j]) {
          if (j === i) continue;
          let dx = bx[j] - x, dy = by[j] - y;
          let r2 = dx * dx + dy * dy;
          if (r2 === 0) {
            dx = (random.nextDouble() - 0.5) / 50;
            dy = (random.nextDouble() - 0.5) / 50;
            r2 = dx * dx + dy * dy;
          }
          const r = Math.sqrt(r2);
          let v = gi * bodyMass[j] / (r2 * r);
          if (sourceIsLeaf || bodyLeaf[j] === 1) {
            if (r2 > cutoff2) continue;
            const u = r * toTable, k = u | 0;
            v *= table[k] + (u - k) * (table[k + 1] - table[k]);
          }
          fx += v * dx; fy += v * dy;
        }
        continue;
      }
      const cm = cMass[c], lm = lMass[c], s = cellSize[c];
      // Is the whole cell past the cutoff? Then only core-to-core pushes remain.
      let far = false;
      if (sourceIsLeaf || lm > 0) {
        const ox = cellX[c], oy = cellY[c];
        const gx = x < ox ? ox - x : (x > ox + s ? x - ox - s : 0);
        const gy = y < oy ? oy - y : (y > oy + s ? y - oy - s : 0);
        far = gx * gx + gy * gy > cutoff2;
        if (far && (sourceIsLeaf || cm === 0)) continue;
      }
      const dx = aX[c] - x, dy = aY[c] - y;
      const r2 = dx * dx + dy * dy;
      const r = Math.sqrt(r2);
      if (r > 0 && s < theta * r) {
        if (sourceIsLeaf) {
          // every push on a leaf fades, so the cell's whole charge acts from its center
          if (r2 <= cutoff2) {
            const u = r * toTable, k = u | 0;
            const v = gi * (cm + lm) * (table[k] + (u - k) * (table[k + 1] - table[k])) / (r2 * r);
            fx += v * dx; fy += v * dy;
          }
          continue;
        }
        if (lm === 0) {
          // a core body and only core charge: the usual push
          const v = gi * cm / (r2 * r);
          fx += v * dx; fy += v * dy;
          continue;
        }
        // a core body: the core charge pushes in full, the leaf charge fades
        if (cm > 0) {
          const ex = cX[c] - x, ey = cY[c] - y;
          const rc2 = ex * ex + ey * ey, rc = Math.sqrt(rc2);
          if (rc > 0) {
            const v = gi * cm / (rc2 * rc);
            fx += v * ex; fy += v * ey;
          }
        }
        if (!far) {
          const ex = lX[c] - x, ey = lY[c] - y;
          const rl2 = ex * ex + ey * ey, rl = Math.sqrt(rl2);
          if (rl > 0 && rl2 <= cutoff2) {
            const u = rl * toTable, k = u | 0;
            const v = gi * lm * (table[k] + (u - k) * (table[k + 1] - table[k])) / (rl2 * rl);
            fx += v * ex; fy += v * ey;
          }
        }
        continue;
      }
      if (top + 4 > todo.length) {
        const bigger = new Int32Array(todo.length * 2);
        bigger.set(todo);
        todo = stack = bigger;
      }
      const base = c * 4;
      let k = cellChild[base];
      if (k !== -1) todo[top++] = k;
      k = cellChild[base + 1];
      if (k !== -1) todo[top++] = k;
      k = cellChild[base + 2];
      if (k !== -1) todo[top++] = k;
      k = cellChild[base + 3];
      if (k !== -1) todo[top++] = k;
    }
    out[0] += fx; out[1] += fy;
  }

  function insert(i) {
    let c = 0;
    for (;;) {
      if (isInner[c]) {
        addCharge(c, i);
        const half = size[c] / 2;
        const right = px[i] >= minX[c] + half ? 1 : 0;
        const down = py[i] >= minY[c] + half ? 1 : 0;
        const slot = c * 4 + right + 2 * down;
        const k = child[slot];
        if (k === -1) {
          const created = newCell(minX[c] + right * half, minY[c] + down * half, half);
          child[slot] = created;
          head[created] = i; next[i] = -1;
          addCharge(created, i);
          return;
        }
        c = k;
        continue;
      }
      const j = head[c];
      if (j === -1) {
        // the empty root
        head[c] = i; next[i] = -1;
        addCharge(c, i);
        return;
      }
      if ((px[j] === px[i] && py[j] === py[i]) || size[c] < 1e-9) {
        // same point (or no room left to split): share the cell's list
        next[i] = j; head[c] = i;
        addCharge(c, i);
        return;
      }
      // Split: move the cell's list into a child, then keep inserting body i here
      const half = size[c] / 2;
      const right = px[j] >= minX[c] + half ? 1 : 0;
      const down = py[j] >= minY[c] + half ? 1 : 0;
      const moved = newCell(minX[c] + right * half, minY[c] + down * half, half);
      head[moved] = j;
      coreMass[moved] = coreMass[c]; coreX[moved] = coreX[c]; coreY[moved] = coreY[c];
      leafMass[moved] = leafMass[c]; leafX[moved] = leafX[c]; leafY[moved] = leafY[c];
      head[c] = -1;
      isInner[c] = 1;
      child[c * 4 + right + 2 * down] = moved;
    }
  }

  function addCharge(c, i) {
    const m = mass[i];
    if (leaf[i] === 1) {
      leafMass[c] += m; leafX[c] += m * px[i]; leafY[c] += m * py[i];
    } else {
      coreMass[c] += m; coreX[c] += m * px[i]; coreY[c] += m * py[i];
    }
  }

  function newCell(x, y, side) {
    if (cellCount === capacity) grow(capacity * 2);
    const c = cellCount++;
    const base = c * 4;
    child[base] = child[base + 1] = child[base + 2] = child[base + 3] = -1;
    head[c] = -1; isInner[c] = 0;
    minX[c] = x; minY[c] = y; size[c] = side;
    coreMass[c] = coreX[c] = coreY[c] = 0;
    leafMass[c] = leafX[c] = leafY[c] = 0;
    return c;
  }

  function grow(newCapacity) {
    const copy = (Type, old, per) => {
      const array = new Type(newCapacity * per);
      if (old) array.set(old);
      return array;
    };
    child = copy(Int32Array, child, 4);
    head = copy(Int32Array, head, 1);
    isInner = copy(Uint8Array, isInner, 1);
    minX = copy(Float64Array, minX, 1);
    minY = copy(Float64Array, minY, 1);
    size = copy(Float64Array, size, 1);
    coreMass = copy(Float64Array, coreMass, 1);
    coreX = copy(Float64Array, coreX, 1);
    coreY = copy(Float64Array, coreY, 1);
    leafMass = copy(Float64Array, leafMass, 1);
    leafX = copy(Float64Array, leafX, 1);
    leafY = copy(Float64Array, leafY, 1);
    allX = copy(Float64Array, allX, 1);
    allY = copy(Float64Array, allY, 1);
    capacity = newCapacity;
  }

  function growBodies(n) {
    bodyCapacity = Math.max(n, bodyCapacity * 2);
    next = new Int32Array(bodyCapacity);
    px = new Float64Array(bodyCapacity);
    py = new Float64Array(bodyCapacity);
    mass = new Float64Array(bodyCapacity);
    leaf = new Uint8Array(bodyCapacity);
  }
}
