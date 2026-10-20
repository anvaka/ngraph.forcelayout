// Barnes-Hut repulsion (2D) in which every push that involves a leaf fades with distance.
//
// The library pushes every pair of bodies apart with G * m_i * m_j / r^2, at any distance. Here a
// push between two non-leaf bodies keeps exactly that law, but a push that involves a leaf (a
// node with one link, hanging off a node with more) is multiplied by
//
//   fade(r) = (1 + r / reach) * exp(-r / reach),
//
// the push of a "screened" charge: about full strength up close, almost nothing beyond a few
// `reach`. Cells farther than CUTOFF * reach are skipped for leaf pushes.
//
// One quad tree holds all bodies. Every cell keeps two charge sums: all bodies, and non-leaf
// bodies only, so a non-leaf body can take the plain push from the non-leaf part of a cell and
// the faded push from its leaf part in one walk.
const CUTOFF = 6;

export default function createLeafFadeForce(simulator, options) {
  const bodies = simulator.bodies;
  const springs = simulator.springs;
  const settings = simulator.settings;
  const reach = options.reach * settings.springLength;
  const fadeAll = !!options.fadeAll;
  const cut = CUTOFF * reach;

  let n = 0, springCount = -1;
  let X, Y, Q, isLeaf;
  // tree, flat arrays: corner, side, all-body charge sums, non-leaf charge sums, children, body
  let cap = 0, count = 0;
  let minX, minY, side, q, qx, qy, sq, sqx, sqy, child, cellBody, stack;

  return { update };

  function update() {
    if (bodies.length === 0) return;
    if (bodies.length !== n || springs.length !== springCount) prepare();
    buildTree();
    const G = settings.gravity, theta = settings.theta;
    const useDrag = settings.integrator !== 'fire';
    const drag = settings.dragCoefficient;
    for (let i = 0; i < n; i++) {
      const body = bodies[i];
      if (body.isPinned) continue;
      body.reset();
      const leaf = fadeAll || isLeaf[i];
      const x = X[i], y = Y[i], qi = Q[i];
      let fx = 0, fy = 0, top = 0;
      stack[top++] = 0;
      while (top) {
        const c = stack[--top];
        if (cellBody[c] === i) continue;
        const all = q[c];
        if (all === 0) continue;
        let dx = qx[c] / all - x, dy = qy[c] / all - y;
        let r = Math.sqrt(dx * dx + dy * dy);
        // leaf bodies only feel faded pushes: skip cells that are out of reach entirely
        if (leaf && r - 1.42 * side[c] > cut) continue;
        if (cellBody[c] < 0 && side[c] >= theta * r) {
          for (let k = 4 * c; k < 4 * c + 4; k++) if (child[k] >= 0) stack[top++] = child[k];
          continue;
        }
        if (r === 0) { dx = (Math.random() - 0.5) / 50; dy = (Math.random() - 0.5) / 50; r = Math.sqrt(dx * dx + dy * dy); }
        if (leaf) {
          if (r < cut) {
            const v = G * all * qi * fade(r) / (r * r * r);
            fx += v * dx; fy += v * dy;
          }
          continue;
        }
        // non-leaf body: plain push from the cell's non-leaf bodies, faded push from its leaves
        const plain = sq[c];
        if (plain > 0) {
          let ex = dx, ey = dy, er = r;
          if (plain !== all) { ex = sqx[c] / plain - x; ey = sqy[c] / plain - y; er = Math.sqrt(ex * ex + ey * ey) || r; }
          const v = G * plain * qi / (er * er * er);
          fx += v * ex; fy += v * ey;
        }
        const leaves = all - plain;
        if (leaves > 1e-12) {
          let ex = dx, ey = dy, er = r;
          if (plain > 0) { ex = (qx[c] - sqx[c]) / leaves - x; ey = (qy[c] - sqy[c]) / leaves - y; er = Math.sqrt(ex * ex + ey * ey) || r; }
          if (er < cut) {
            const v = G * leaves * qi * fade(er) / (er * er * er);
            fx += v * ex; fy += v * ey;
          }
        }
      }
      body.force.x += fx;
      body.force.y += fy;
      if (useDrag) {
        body.force.x -= drag * body.velocity.x;
        body.force.y -= drag * body.velocity.y;
      }
    }
  }

  function fade(r) {
    const t = r / reach;
    return (1 + t) * Math.exp(-t);
  }

  // Leaf flags and buffers; redone when bodies or springs are added or removed.
  function prepare() {
    n = bodies.length;
    springCount = springs.length;
    X = new Float64Array(n); Y = new Float64Array(n); Q = new Float64Array(n);
    isLeaf = new Uint8Array(n);
    const index = new Map();
    for (let i = 0; i < n; i++) index.set(bodies[i], i);
    const degree = new Int32Array(n), neighbor = new Int32Array(n);
    for (const spring of springs) {
      const a = index.get(spring.from), b = index.get(spring.to);
      if (a === undefined || b === undefined) continue;
      degree[a] += 1; degree[b] += 1; neighbor[a] = b; neighbor[b] = a;
    }
    // a leaf hangs off a node with more links; an isolated pair of nodes keeps the plain push
    for (let i = 0; i < n; i++) isLeaf[i] = degree[i] === 1 && degree[neighbor[i]] > 1 ? 1 : 0;
    const want = 2 * n + 16; // a quad tree has about 1.5-2.5 cells per body; grow() adds more
    if (want > cap) {
      cap = want;
      minX = new Float64Array(cap); minY = new Float64Array(cap); side = new Float64Array(cap);
      q = new Float64Array(cap); qx = new Float64Array(cap); qy = new Float64Array(cap);
      sq = new Float64Array(cap); sqx = new Float64Array(cap); sqy = new Float64Array(cap);
      child = new Int32Array(4 * cap); cellBody = new Int32Array(cap); stack = new Int32Array(cap);
    }
  }

  function buildTree() {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < n; i++) {
      const body = bodies[i];
      const x = X[i] = body.pos.x, y = Y[i] = body.pos.y;
      Q[i] = body.mass;
      if (x < x0) x0 = x;
      if (x > x1) x1 = x;
      if (y < y0) y0 = y;
      if (y > y1) y1 = y;
    }
    count = 0;
    newCell(x0, y0, Math.max(x1 - x0, y1 - y0) || 1);
    for (let i = 0; i < n; i++) insert(i);
  }

  function newCell(x, y, s) {
    if (count >= cap) grow();
    const c = count++;
    minX[c] = x; minY[c] = y; side[c] = s;
    q[c] = qx[c] = qy[c] = sq[c] = sqx[c] = sqy[c] = 0;
    child[4 * c] = child[4 * c + 1] = child[4 * c + 2] = child[4 * c + 3] = -1;
    cellBody[c] = -1;
    return c;
  }

  function grow() {
    const bigger = (a, size) => { const b = new a.constructor(size); b.set(a); return b; };
    cap *= 2;
    minX = bigger(minX, cap); minY = bigger(minY, cap); side = bigger(side, cap);
    q = bigger(q, cap); qx = bigger(qx, cap); qy = bigger(qy, cap);
    sq = bigger(sq, cap); sqx = bigger(sqx, cap); sqy = bigger(sqy, cap);
    child = bigger(child, 4 * cap); cellBody = bigger(cellBody, cap); stack = bigger(stack, cap);
  }

  function addCharge(c, i) {
    const m = Q[i];
    q[c] += m; qx[c] += m * X[i]; qy[c] += m * Y[i];
    if (!isLeaf[i]) { sq[c] += m; sqx[c] += m * X[i]; sqy[c] += m * Y[i]; }
  }

  function quadrant(c, x, y) {
    const h = side[c] / 2;
    return (x >= minX[c] + h ? 1 : 0) + (y >= minY[c] + h ? 2 : 0);
  }

  function childCell(c, k) {
    const h = side[c] / 2;
    const cc = newCell(minX[c] + (k & 1 ? h : 0), minY[c] + (k & 2 ? h : 0), h);
    child[4 * c + k] = cc;
    return cc;
  }

  function insert(i) {
    let c = 0, depth = 0;
    for (;;) {
      if (q[c] === 0 && cellBody[c] < 0) { // empty cell
        cellBody[c] = i;
        addCharge(c, i);
        return;
      }
      if (cellBody[c] >= 0) { // a single body: push it one level down
        const j = cellBody[c];
        cellBody[c] = -1;
        if (X[j] === X[i] && Y[j] === Y[i] || depth > 48) {
          // same spot: nudge the new body inside this cell
          X[i] = minX[c] + side[c] * Math.random();
          Y[i] = minY[c] + side[c] * Math.random();
        }
        const cj = childCell(c, quadrant(c, X[j], Y[j]));
        cellBody[cj] = j;
        addCharge(cj, j);
      }
      addCharge(c, i);
      const k = quadrant(c, X[i], Y[i]);
      const next = child[4 * c + k];
      if (next < 0) {
        const cc = childCell(c, k);
        cellBody[cc] = i;
        addCharge(cc, i);
        return;
      }
      c = next;
      depth += 1;
    }
  }
}
