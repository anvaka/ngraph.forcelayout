/**
 * How far apart the nodes typically sit: the side of the cube (square in 2D) that holds one node
 * where nodes are as dense as around a typical node. The density around a node is k / (V d^D),
 * where d is the distance to its k-th nearest node and V the volume of a ball of radius 1; the
 * median is taken over up to 1500 sampled nodes. Returns undefined when no node has k neighbours.
 *
 * The same measurement as the jellium idea's (v3-4), kept here so that either idea can be removed
 * without the other.
 */
export default function typicalSpacing(sim, k) {
  const store = sim.store, n = store.n, D = store.D;
  const box = sim.getBBox();
  let volume = 1;
  for (let a = 0; a < D; ++a) {
    const name = a === 0 ? 'x' : a === 1 ? 'y' : 'z';
    volume *= Math.max(box['max_' + name] - box['min_' + name], 1e-9);
  }
  // start with cells that hold about one node, and grow them for nodes with too few neighbours
  let cell = Math.max(1e-6, Math.pow(volume / n, 1 / D));
  const stride = Math.max(1, Math.floor(n / 1500));
  let pending = [];
  for (let i = 0; i < n; i += stride) pending.push(i);
  const densities = [];
  for (let attempt = 0; attempt < 30 && pending.length; ++attempt) {
    const grid = sim.neighbors(cell);
    const next = [];
    pending.forEach(i => {
      const distances = [];
      grid.forEachNeighbor(i, cell, (j, r) => distances.push(r));
      if (distances.length < k) { next.push(i); return; }
      distances.sort(byNumber);
      densities.push(k / (ballVolume(D) * Math.pow(distances[k - 1], D)));
    });
    pending = next;
    cell *= 2;
  }
  if (!densities.length) return undefined;
  densities.sort(byNumber);
  return Math.pow(densities[densities.length >> 1], -1 / D);
}

// Volume of a ball of radius 1 in D dimensions: 2, pi, 4/3 pi, ...
export function ballVolume(D) {
  return D === 0 ? 1 : D === 1 ? 2 : ballVolume(D - 2) * 2 * Math.PI / D;
}

function byNumber(a, b) {
  return a - b;
}
