import {FIELD, FIELD_MAX_U} from './diskField.js';

const FIELD_STEPS = FIELD.length - 1;

/**
 * Adds an even "background" of opposite charge under the nodes: a disk (a ball in 3D), centred at
 * the nodes' charge-weighted centre, that pulls on every node exactly as hard as an evenly spread
 * disk of nodes of the same density would push it. Evenly spread nodes then feel no net force,
 * crowded places still push apart, and empty places pull nodes in.
 *
 * The background's density is measured once, at step `startStep` (counting the `stepsBefore` steps
 * the drawing ran before this layout carried it on), as `density` times the typical
 * local density of the nodes at that moment, and then kept. Re-measuring it every step gave the
 * same picture in a short test (yeast and megaStars, 1500 steps), so measuring once is simply the
 * simpler and cheaper choice. Measured before the graph has unfolded (below about step 50), the
 * background comes out too small and crushes the drawing.
 * Its total charge is (1 + extra) times the nodes' total charge, so pieces that already drifted
 * far away are pulled back.
 *
 * Works in 2D and 3D with the library's 1/r^2 push. Costs two passes over the bodies per step. If
 * the background's density over- or underflows (a huge or tiny `density`), the background turns
 * itself off.
 */
export default function addBackground(layout, options) {
  const simulator = layout.simulator;
  const density = options.density;
  const extra = options.extra;
  const startStep = Math.max(0, Math.round(options.startStep));
  const stepsBefore = options.stepsBefore || 0;
  let sigma = 0, radius = 0, off = false;
  const center = [];

  simulator.addStage('neutral-background', backgroundForce);
  return {
    getRadius: () => radius
  };

  function backgroundForce(store, sim) {
    const { n, D, pos, force, pinned } = store;
    if (off || sim.iteration() + stepsBefore < startStep || n < 8) return;
    const gravity = sim.gravity();
    if (!(gravity < 0)) return; // the background only makes sense for repelling nodes
    const charge = store[sim.repulsionCharge()];

    let total = 0;
    for (let k = 0; k < D; ++k) center[k] = 0;
    for (let i = 0; i < n; ++i) {
      total += charge[i];
      for (let k = 0; k < D; ++k) center[k] += charge[i] * pos[i * D + k];
    }
    for (let k = 0; k < D; ++k) center[k] /= total;

    if (!sigma) {
      const nodesPerVolume = typicalDensity(sim, 6);
      if (!(nodesPerVolume > 0)) return;
      sigma = density * nodesPerVolume * total / n;
      radius = Math.pow((1 + extra) * total / (ballVolume(D) * sigma), 1 / D);
      if (!(sigma > 0 && sigma < Infinity && radius > 0)) {
        // over- or underflow: the force would be NaN (Infinity * 0) or nothing at all
        off = true;
        return;
      }
    }

    for (let i = 0; i < n; ++i) {
      if (pinned[i]) continue;
      let s2 = 0;
      for (let k = 0; k < D; ++k) s2 += (pos[i * D + k] - center[k]) ** 2;
      const s = Math.sqrt(s2);
      if (s === 0) continue;
      // gravity < 0, so this points toward the centre
      const f = gravity * charge[i] * sigma * backgroundPush(D, s / radius) * (D === 3 ? radius : 1) / s;
      for (let k = 0; k < D; ++k) force[i * D + k] += f * (pos[i * D + k] - center[k]);
    }
  }
}

// Push of the background of radius 1 and density 1 at distance u from its centre (in 3D it then
// grows with the radius, so the caller multiplies by it)
function backgroundPush(D, u) {
  return D === 2 ? diskPush(u) : ballPush(u);
}

function diskPush(u) {
  if (u >= FIELD_MAX_U) return FIELD[FIELD_STEPS] * FIELD_MAX_U * FIELD_MAX_U / (u * u);
  const x = u / FIELD_MAX_U * FIELD_STEPS;
  const i = Math.floor(x), t = x - i;
  return FIELD[i] * (1 - t) + FIELD[i + 1] * t;
}

// In 3D the push of a ball is exact (Gauss's law): it grows as u inside and falls as 1/u^2
// outside. The edge is soft like the disk's: averaged over radii 0.85..1.15.
function ballPush(u) {
  let sum = 0;
  for (let step = 0; step <= 6; ++step) {
    const a = 0.85 + 0.05 * step;
    sum += u < a ? u : a * a * a / (u * u);
  }
  return 4 / 3 * Math.PI * sum / 7;
}

/**
 * Median over (up to 1500 sampled) nodes of k / (V d^D), where d is the distance to the node's
 * k-th nearest neighbour and V the volume of a ball of radius 1: how many nodes per unit of
 * volume there typically are around a node.
 */
function typicalDensity(sim, k) {
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
      const d = distances[k - 1];
      densities.push(k / (ballVolume(D) * Math.pow(d, D)));
    });
    pending = next;
    cell *= 2;
  }
  densities.sort(byNumber);
  return densities[densities.length >> 1];
}

// Volume of a ball of radius 1 in D dimensions: 2, pi, 4/3 pi, ...
function ballVolume(D) {
  return D === 0 ? 1 : D === 1 ? 2 : ballVolume(D - 2) * 2 * Math.PI / D;
}

function byNumber(a, b) {
  return a - b;
}
