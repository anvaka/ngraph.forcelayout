import {FIELD, FIELD_MAX_U} from './diskField.js';

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
 * Works in 2D and 3D with the library's 1/r^2 push. If the background's density over- or
 * underflows (a huge or tiny `density`), the background turns itself off.
 *
 * Written as formulas, so the simulator runs the loops: two sums (the total charge and the
 * charge-weighted position, for the centre) and a formula for every body. Only the measurement
 * runs in JS, once. Returns {getRadius, dispose}.
 */
export default function addBackground(layout, options) {
  const simulator = layout.simulator;
  const density = options.density;
  const extra = options.extra;
  const startStep = Math.max(0, Math.round(options.startStep));
  const stepsBefore = options.stepsBefore || 0;
  const D = simulator.settings.dimensions;
  // The charges are the column the layout pushes with when the idea is attached
  const charge = simulator.repulsionCharge();
  let sigma = 0, radius = 0, off = false, triedAt = -1;

  simulator.addSum('jelliumCharge', { formula: charge });
  simulator.addSum('jelliumMoment', { formula: `${charge} * pos` });
  simulator.addNodeFormula('neutral-background', {
    params: {
      sigma: sim => measure(sim),
      radius: sim => { measure(sim); return radius; },
      start: startStep,
      before: stepsBefore,
      edge: FIELD[FIELD.length - 1],
      maxU: FIELD_MAX_U
    },
    tables: { field: { from: 0, to: FIELD_MAX_U, values: FIELD } },
    formula: `
      d = pos - jelliumMoment / jelliumCharge;
      s = length(d);
      u = s / radius;
      // How hard the background pushes a node of unit charge at distance s from its centre
      push = ${D === 2 ? DISK_PUSH : BALL_PUSH};
      // gravity < 0, so this points toward the centre
      f = gravity * ${charge} * sigma * push * (D == 3 ? radius : 1) / s;
      // The background switches on at the start step, once it is measured (sigma > 0), and only
      // when nodes repel each other
      force += select(sigma > 0 && step + before >= start && n >= 8 && gravity < 0 && pinned == 0 && s != 0,
        f * d, 0 * pos)`
  });
  return {
    getRadius: () => radius,
    dispose() {
      ['jelliumCharge', 'jelliumMoment', 'neutral-background'].forEach(name => {
        if (simulator.getStage(name)) simulator.removeStage(name);
      });
    }
  };

  // The background's density: measured once, at the start step, as `density` times the typical
  // local density of the nodes. This runs on the CPU and reads positions (a GPU engine has to
  // hand them over at this step).
  function measure(sim) {
    if (sigma || off || sim.iteration() === triedAt) return sigma;
    triedAt = sim.iteration();
    const n = sim.store.n;
    if (sim.iteration() + stepsBefore < startStep || n < 8 || !(sim.gravity() < 0)) return 0;
    const nodesPerVolume = typicalDensity(sim, 6);
    if (!(nodesPerVolume > 0)) return 0;
    const q = sim.store[charge];
    let total = 0;
    for (let i = 0; i < n; ++i) total += q[i];
    sigma = density * nodesPerVolume * total / n;
    radius = Math.pow((1 + extra) * total / (ballVolume(D) * sigma), 1 / D);
    if (!(sigma > 0 && sigma < Infinity && radius > 0)) {
      // over- or underflow: the force would be NaN (Infinity * 0) or nothing at all
      off = true;
      sigma = 0;
    }
    return sigma;
  }
}

// The push of an evenly filled disk of radius 1 at distance u from its centre: sampled in
// diskField.js up to FIELD_MAX_U, and falling off as 1/u^2 past it
const DISK_PUSH = 'u >= maxU ? edge * maxU * maxU / (u * u) : field(u)';

// The push of an evenly filled ball of radius 1 whose edge is soft, as the disk's is: the average
// over radii a = 0.85 ... 1.15 of the push of a sharp ball, u inside it and a^3/u^2 outside
// (Gauss's law)
const BALL_RADII = [0, 1, 2, 3, 4, 5, 6].map(step => 0.85 + 0.05 * step);
const BALL_PUSH = '4 / 3 * pi * (' +
  BALL_RADII.map(a => `(u < ${a} ? u : ${a} * ${a} * ${a} / (u * u))`).join(' + ') + ') / 7';

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
