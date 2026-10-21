// "Crowding costs energy": every node pays (c / m) * (how crowded its surroundings are), like the
// energy it takes to squeeze a quantum particle into a small space. For two nodes closer than h,
// the pair energy is c * (1/m_i + 1/m_j) * (1 - r/h)^2, so they push apart with
//   F = c * (1/m_i + 1/m_j) * 2 * (1 - r/h) / h
// on each of the two, in opposite directions. Two light nodes (leaves) push each other harder
// than a pair that includes a heavy hub. Nodes farther apart than h do not feel it at all.
//
// The push is stiff where nodes are crowded, and the explicit step (v += dt F / m) overshoots
// once dt^2 * stiffness / m > ~2, which makes nodes shake. So crowded nodes get a larger inertia
// for this step only: the whole force, drag included, is divided by it. A steady force still
// moves them at the same speed, so pieces drift apart as fast as without this.
//
// Close pairs are found with a uniform grid of cell size h, stored in a hash table of typed
// arrays that is reused from step to step: O(n + pairs) work per step, no allocations.
const MIN_H = 1e-9; // shortest push range, in layout units

export default function createConfinementForce(simulator, options) {
  const bodies = simulator.bodies;
  const settings = simulator.settings;
  const bSafe = options.bSafe || 1.5;
  let capacity = 0, mask = 0, stamp = 0;
  let cellX, cellY, slotOf, stiffness;
  let tableX, tableY, tableStamp, tableStart, tableCount, usedSlots, order;
  const stats = { pairs: 0, steps: 0 };

  return { force, stats };

  function force() {
    const n = bodies.length;
    const c = options.strength;
    const h = options.range * settings.springLength;
    // A range shorter than MIN_H holds no two distinct nodes in practice, and its push (~ c / h)
    // and stiffness (~ c / h^2) could overflow, so it counts as off.
    if (!(c > 0) || !(h >= MIN_H) || !Number.isFinite(c) || !Number.isFinite(h) || n < 2) return;
    ensureCapacity(n);
    bin(n, 1 / h);
    const pairs = push(n, c, h);
    limitSteps(n);
    stats.pairs += pairs;
    stats.steps += 1;
  }

  function ensureCapacity(n) {
    if (n <= capacity) return;
    capacity = Math.max(n, capacity * 2, 64);
    cellX = new Int32Array(capacity);
    cellY = new Int32Array(capacity);
    slotOf = new Int32Array(capacity);
    stiffness = new Float64Array(capacity);
    order = new Int32Array(capacity);
    usedSlots = new Int32Array(capacity);
    let size = 1;
    while (size < capacity * 2) size *= 2;
    mask = size - 1;
    tableX = new Int32Array(size);
    tableY = new Int32Array(size);
    tableStamp = new Int32Array(size);
    tableStart = new Int32Array(size);
    tableCount = new Int32Array(size);
    stamp = 0;
  }

  function hash(x, y) {
    return ((Math.imul(x, 0x9E3779B1) ^ Math.imul(y, 0x85EBCA77)) >>> 0) & mask;
  }

  // Slot of cell (x, y) in the table, or -1 if no node is in that cell this step.
  function find(x, y) {
    let slot = hash(x, y);
    while (tableStamp[slot] === stamp) {
      if (tableX[slot] === x && tableY[slot] === y) return slot;
      slot = (slot + 1) & mask;
    }
    return -1;
  }

  // Counting sort of nodes by grid cell: order[tableStart[s] .. + tableCount[s]] are the nodes
  // of the cell in slot s.
  function bin(n, inv) {
    stamp += 1;
    let used = 0;
    for (let i = 0; i < n; ++i) {
      const pos = bodies[i].pos;
      const x = Math.floor(pos.x * inv), y = Math.floor(pos.y * inv);
      cellX[i] = x;
      cellY[i] = y;
      let slot = hash(x, y);
      while (tableStamp[slot] === stamp && (tableX[slot] !== x || tableY[slot] !== y)) slot = (slot + 1) & mask;
      if (tableStamp[slot] !== stamp) {
        tableStamp[slot] = stamp;
        tableX[slot] = x;
        tableY[slot] = y;
        tableCount[slot] = 0;
        usedSlots[used++] = slot;
      }
      tableCount[slot] += 1;
      slotOf[i] = slot;
    }
    let start = 0;
    for (let k = 0; k < used; ++k) {
      const slot = usedSlots[k];
      tableStart[slot] = start;
      start += tableCount[slot];
      tableCount[slot] = 0; // refilled below
    }
    for (let i = 0; i < n; ++i) {
      const slot = slotOf[i];
      order[tableStart[slot] + tableCount[slot]] = i;
      tableCount[slot] += 1;
    }
  }

  function push(n, c, h) {
    const inv = 1 / h, pairStiffness = 2 * inv * inv;
    let pairs = 0;
    for (let i = 0; i < n; ++i) stiffness[i] = 0;
    for (let i = 0; i < n; ++i) {
      const bi = bodies[i];
      const xi = bi.pos.x, yi = bi.pos.y, invMassI = 1 / bi.mass;
      for (let ox = -1; ox <= 1; ++ox) {
        for (let oy = -1; oy <= 1; ++oy) {
          const slot = find(cellX[i] + ox, cellY[i] + oy);
          if (slot < 0) continue;
          const end = tableStart[slot] + tableCount[slot];
          for (let k = tableStart[slot]; k < end; ++k) {
            const j = order[k];
            if (j <= i) continue; // each pair once
            const bj = bodies[j];
            let dx = xi - bj.pos.x, dy = yi - bj.pos.y;
            let r = Math.sqrt(dx * dx + dy * dy);
            if (r >= h) continue;
            const distance = r;
            if (r === 0) {
              // Same spot: push along a direction picked from the two indices (deterministic)
              const angle = (((i * 2654435761) ^ (j * 40503)) >>> 0) / 4294967296 * 2 * Math.PI;
              dx = Math.cos(angle); dy = Math.sin(angle); r = 1;
            }
            const weight = c * (invMassI + 1 / bj.mass);
            const f = weight * 2 * (1 - distance * inv) * inv / r;
            if (!bi.isPinned) { bi.force.x += f * dx; bi.force.y += f * dy; }
            if (!bj.isPinned) { bj.force.x -= f * dx; bj.force.y -= f * dy; }
            stiffness[i] += weight * pairStiffness;
            stiffness[j] += weight * pairStiffness;
            pairs += 1;
          }
        }
      }
    }
    return pairs;
  }

  // Heavier inertia for nodes whose step would overshoot: the whole force on such a node,
  // drag included, is scaled by m / inertia.
  function limitSteps(n) {
    const dt = settings.timeStep, springK = settings.springCoefficient;
    for (let i = 0; i < n; ++i) {
      const body = bodies[i];
      if (body.isPinned || stiffness[i] === 0) continue;
      const inertia = dt * dt * (stiffness[i] + springK * body.springCount) / bSafe;
      if (inertia <= body.mass) continue;
      const scale = body.mass / inertia;
      body.force.x *= scale;
      body.force.y *= scale;
    }
  }
}
