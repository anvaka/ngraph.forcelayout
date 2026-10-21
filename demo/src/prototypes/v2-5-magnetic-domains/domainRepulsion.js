// The extra push between domains, computed with its own Barnes-Hut quadtree (2D).
//
// The library already pushes every pair i, j apart with gravity * m_i * m_j / r^2. On top of
// that, this adds (boost / 2) * (1 - s_i . s_j) times the same push, where s are the domain
// arrows from domains.js: almost zero for two nodes with the same arrow (arrows are a bit
// shorter than 1, so neighbors in one domain push about 1.2 times the stock push), up to `boost`
// times the stock push for opposite arrows. Summed over a tree cell C the extra weight is
//     sum_j m_j (1 - s_i . s_j) = M_C - s_i . S_C,   with S_C = sum_j m_j s_j,
// so each cell stores one more moment (S_C, Q numbers), and each interaction costs Q more
// multiply-adds. Opening rule as in the library's quadtree (cell width / distance < theta), with
// theta at least 1: the extra push is a correction, so a coarser tree is fine (3-5% error against
// an exact sum at the demo's theta, 5-7% at theta 1.2) and the walk is cheaper.
import { Q } from './domains.js';

export default function createDomainRepulsion(bodies, spins, options) {
  const n = bodies.length;
  const halfBoost = options.boost / 2;
  // Read gravity and theta every step: the demo panel changes them without a new layout
  const getTheta = options.getTheta, getGravity = options.getGravity;
  const maxDepth = 40;
  const bucket = 8; // bodies a leaf holds before it splits

  const px = new Float64Array(n), py = new Float64Array(n), mass = new Float64Array(n);
  const next = new Int32Array(n); // next body in the same leaf, -1 at the end

  // Tree nodes, grown as needed. Leaves hold a list of up to `bucket` bodies (first in `leaf`,
  // the rest through `next`); more only for bodies on the same spot or at the depth limit.
  let capacity = 0;
  let x0, y0, size, child, leaf, leafCount, nodeMass, sumX, sumY, sumSpin;
  let nodeCount = 0;
  grow(Math.max(64, 4 * n));
  const stack = new Int32Array(4 * maxDepth + 8);

  return { apply };

  function grow(newCapacity) {
    const old = { x0, y0, size, child, leaf, leafCount, nodeMass, sumX, sumY, sumSpin };
    x0 = new Float64Array(newCapacity); y0 = new Float64Array(newCapacity); size = new Float64Array(newCapacity);
    child = new Int32Array(4 * newCapacity); leaf = new Int32Array(newCapacity); leafCount = new Int32Array(newCapacity);
    nodeMass = new Float64Array(newCapacity); sumX = new Float64Array(newCapacity); sumY = new Float64Array(newCapacity);
    sumSpin = new Float64Array(Q * newCapacity);
    if (capacity) {
      x0.set(old.x0); y0.set(old.y0); size.set(old.size); child.set(old.child); leaf.set(old.leaf); leafCount.set(old.leafCount);
      nodeMass.set(old.nodeMass); sumX.set(old.sumX); sumY.set(old.sumY); sumSpin.set(old.sumSpin);
    }
    capacity = newCapacity;
  }

  function newNode(x, y, s) {
    if (nodeCount === capacity) grow(2 * capacity);
    const k = nodeCount++;
    x0[k] = x; y0[k] = y; size[k] = s; leaf[k] = -1; leafCount[k] = 0;
    child[4 * k] = child[4 * k + 1] = child[4 * k + 2] = child[4 * k + 3] = -1;
    return k;
  }

  function quadrant(k, x, y) {
    const half = size[k] / 2;
    return (x >= x0[k] + half ? 1 : 0) + (y >= y0[k] + half ? 2 : 0);
  }

  function childNode(k, q) {
    let c = child[4 * k + q];
    if (c < 0) {
      const half = size[k] / 2;
      c = newNode(x0[k] + (q & 1 ? half : 0), y0[k] + (q & 2 ? half : 0), half);
      child[4 * k + q] = c;
    }
    return c;
  }

  function build() {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < n; ++i) {
      const pos = bodies[i].pos;
      px[i] = pos.x; py[i] = pos.y; mass[i] = bodies[i].mass;
      if (px[i] < minX) minX = px[i];
      if (px[i] > maxX) maxX = px[i];
      if (py[i] < minY) minY = py[i];
      if (py[i] > maxY) maxY = py[i];
    }
    nodeCount = 0;
    const root = newNode(minX, minY, Math.max(maxX - minX, maxY - minY, 1e-9) * 1.000001);
    for (let i = 0; i < n; ++i) insert(root, i);
    // Moments, children before parents (children are always created after their parent)
    for (let k = nodeCount - 1; k >= 0; --k) {
      let m = 0, mx = 0, my = 0;
      const spinBase = Q * k;
      for (let a = 0; a < Q; ++a) sumSpin[spinBase + a] = 0;
      if (leaf[k] >= 0) {
        for (let i = leaf[k]; i >= 0; i = next[i]) {
          m += mass[i]; mx += mass[i] * px[i]; my += mass[i] * py[i];
          for (let a = 0; a < Q; ++a) sumSpin[spinBase + a] += mass[i] * spins[Q * i + a];
        }
      } else {
        for (let q = 0; q < 4; ++q) {
          const c = child[4 * k + q];
          if (c < 0) continue;
          m += nodeMass[c]; mx += sumX[c]; my += sumY[c];
          for (let a = 0; a < Q; ++a) sumSpin[spinBase + a] += sumSpin[Q * c + a];
        }
      }
      nodeMass[k] = m; sumX[k] = mx; sumY[k] = my;
    }
    return root;
  }

  function insert(root, i) {
    let k = root, depth = 0;
    next[i] = -1;
    for (;;) {
      const internal = child[4 * k] >= 0 || child[4 * k + 1] >= 0 || child[4 * k + 2] >= 0 || child[4 * k + 3] >= 0;
      if (internal) { k = childNode(k, quadrant(k, px[i], py[i])); depth += 1; continue; }
      const first = leaf[k];
      if (leafCount[k] < bucket || depth >= maxDepth || (px[first] === px[i] && py[first] === py[i])) {
        next[i] = first; leaf[k] = i; leafCount[k] += 1; return;
      }
      // Split the full leaf: push its bodies one level down, then keep descending with i
      leaf[k] = -1; leafCount[k] = 0;
      for (let j = first; j >= 0;) {
        const following = next[j];
        const c = childNode(k, quadrant(k, px[j], py[j]));
        next[j] = leaf[c]; leaf[c] = j; leafCount[c] += 1;
        j = following;
      }
      k = childNode(k, quadrant(k, px[i], py[i]));
      depth += 1;
    }
  }

  function apply() {
    if (n < 2) return;
    const theta = Math.max(1, getTheta()), gravity = getGravity();
    const root = build();
    for (let i = 0; i < n; ++i) {
      const body = bodies[i];
      if (body.isPinned) continue;
      const xi = px[i], yi = py[i], si = Q * i;
      let fx = 0, fy = 0, top = 0;
      stack[top++] = root;
      while (top) {
        const k = stack[--top];
        if (leaf[k] >= 0) {
          for (let j = leaf[k]; j >= 0; j = next[j]) {
            if (j === i) continue;
            let dot = 0;
            for (let a = 0; a < Q; ++a) dot += spins[si + a] * spins[Q * j + a];
            // Same domain: no extra push (most close neighbors are in the same domain)
            if (dot > 0.99) continue;
            const dx = px[j] - xi, dy = py[j] - yi;
            const r2 = dx * dx + dy * dy;
            if (r2 === 0) continue;
            const w = mass[j] * (1 - dot) / (r2 * Math.sqrt(r2));
            fx += w * dx; fy += w * dy;
          }
          continue;
        }
        const m = nodeMass[k];
        if (m === 0) continue;
        const dx = sumX[k] / m - xi, dy = sumY[k] / m - yi;
        const r2 = dx * dx + dy * dy;
        if (r2 > 0 && size[k] * size[k] < theta * theta * r2) {
          let dot = 0;
          for (let a = 0; a < Q; ++a) dot += spins[si + a] * sumSpin[Q * k + a];
          const w = (m - dot) / (r2 * Math.sqrt(r2));
          fx += w * dx; fy += w * dy;
          continue;
        }
        for (let q = 0; q < 4; ++q) {
          const c = child[4 * k + q];
          if (c >= 0) stack[top++] = c;
        }
      }
      const scale = halfBoost * gravity * mass[i];
      body.force.x += scale * fx;
      body.force.y += scale * fy;
    }
  }
}
