// Density-equalizing flow (the diffusion cartogram of Gastner & Newman, 2004), for node positions.
//
// Node density rho on a G x G grid over the drawing spreads out like heat (the heat equation, with
// closed walls), and every node is carried along with the speed v = -grad(rho) / rho. Crowded spots
// expand into emptier space around them, nearby nodes move together, and the drawing deforms
// rather than scrambles.
//
// The heat equation is solved exactly in time by the Fourier method (Samarskii & Gulin, Numerical
// Methods, chapter "Separation of variables" §4, PDF p. 332): in the cosine basis every coefficient
// just decays as exp(-lambda t), with lambda the eigenvalues of the five-point grid Laplacian (same
// chapter §2, p. 319). The maximum principle (chapter "Maximum principle" §2, p. 296) keeps rho
// between its starting minimum and maximum, so rho > 0 and the speed stays finite.

import createCosineTransform from './cosineTransform.js';

/**
 * @param {Float64Array} points node positions [x0, y0, x1, y1, ...], moved in place
 * @param {Uint8Array} movable 1 if a node may move (pinned nodes still count in the density)
 * @param {object} options
 *   sea    - density given to empty space, as a fraction of the drawing's mean density
 *            (1: only crowded spots spread, evenly filled shapes keep their outline;
 *            0.2: the drawing also grows to fill most of its frame)
 *   amount - how long the heat spreads, in units of the slowest density difference's fade time
 *   margin - free room around the drawing, as a fraction of its size
 */
export default function createDensityFlow(points, movable, options = {}) {
  const sea = options.sea ?? 1;
  const amount = options.amount ?? 1;
  const margin = options.margin ?? 0.15;
  const n = points.length / 2;
  const G = gridSize(n);
  const cells = G * G;

  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < n; i++) {
    const x = points[2 * i], y = points[2 * i + 1];
    if (x < x0) x0 = x;
    if (x > x1) x1 = x;
    if (y < y0) y0 = y;
    if (y > y1) y1 = y;
  }
  const span = Math.max(x1 - x0, y1 - y0, 1e-9);
  const side = span * (1 + 2 * margin);
  const ox = (x0 + x1) / 2 - side / 2, oy = (y0 + y1) / 2 - side / 2;
  const h = side / G;

  // Grid coordinates: cell (a, b) covers [a, a + 1) x [b, b + 1)
  const u = new Float64Array(n), v = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    u[i] = (points[2 * i] - ox) / h;
    v[i] = (points[2 * i + 1] - oy) / h;
  }

  const transform = createCosineTransform(G);
  const coefficients = new Float64Array(cells), decayed = new Float64Array(cells);
  // Eigenvalues of the five-point Laplacian with closed walls, in grid units
  const lambda = new Float64Array(G);
  for (let k = 0; k < G; k++) lambda[k] = 4 * Math.sin(Math.PI * k / (2 * G)) ** 2;

  const rho = new Float64Array(cells);
  depositNodes(rho);
  fillSea(rho);
  transform.forward2D(rho, coefficients);

  const rhoNow = new Float64Array(cells), rhoMid = new Float64Array(cells);
  const vxNow = new Float64Array(cells), vyNow = new Float64Array(cells);
  const vxMid = new Float64Array(cells), vyMid = new Float64Array(cells);
  const endTime = amount / lambda[1];
  const MAX_STEPS = 400;
  let time = 0, steps = 0;

  return {
    /**
     * Runs at most `maxSteps` flow steps, for at most `budgetMs` milliseconds.
     * Returns true when the flow is done.
     */
    advance(maxSteps = Infinity, budgetMs = 12) {
      const start = performance.now();
      for (let s = 0; s < maxSteps && !isDone() && performance.now() - start < budgetMs; s++) step();
      return isDone();
    },
    isDone,
    getSteps: () => steps,
    gridSize: G,
  };

  function isDone() {
    return time >= endTime - 1e-12 || steps >= MAX_STEPS;
  }

  function step() {
    densityAt(time, rhoNow);
    const vmax = velocity(rhoNow, vxNow, vyNow);
    // Small steps first (the fastest density differences fade early), then longer ones
    const dt = Math.min(endTime - time, 0.25 / vmax, Math.max(0.05, time));
    densityAt(time + dt / 2, rhoMid);
    velocity(rhoMid, vxMid, vyMid);
    // Midpoint (second order) step for every node
    for (let i = 0; i < n; i++) {
      if (movable && !movable[i]) continue;
      const um = u[i] + 0.5 * dt * sample(vxNow, u[i], v[i]);
      const vm = v[i] + 0.5 * dt * sample(vyNow, u[i], v[i]);
      u[i] = clampGrid(u[i] + dt * sample(vxMid, um, vm));
      v[i] = clampGrid(v[i] + dt * sample(vyMid, um, vm));
      points[2 * i] = ox + u[i] * h;
      points[2 * i + 1] = oy + v[i] * h;
    }
    time += dt;
    steps++;
  }

  // "Land" is where the drawing is: the node density smoothed over about two cells. Empty
  // space ("sea") gets `sea` times the land's mean density, so an evenly filled shape has
  // nothing to push against and keeps its outline; only crowded spots spread.
  function fillSea(field) {
    const SMOOTH_TIME = 2;
    transform.forward2D(field, coefficients);
    decay(SMOOTH_TIME);
    transform.inverse2D(decayed, field);
    const landThreshold = 0.5 / (4 * Math.PI * SMOOTH_TIME); // half the peak of one smoothed node
    let land = 0, landMass = 0;
    for (let k = 0; k < cells; k++) {
      if (field[k] > landThreshold) { land++; landMass += field[k]; }
    }
    const seaDensity = sea * landMass / Math.max(1, land);
    for (let k = 0; k < cells; k++) {
      if (field[k] <= landThreshold) field[k] = seaDensity;
    }
  }

  // rho(t) from the decayed cosine coefficients
  function densityAt(t, out) {
    decay(t);
    transform.inverse2D(decayed, out);
  }

  function decay(t) {
    for (let b = 0; b < G; b++) {
      for (let a = 0; a < G; a++) {
        decayed[b * G + a] = coefficients[b * G + a] * Math.exp(-(lambda[a] + lambda[b]) * t);
      }
    }
  }

  // v = -grad(rho) / rho on cell centres; zero through the walls. Returns the largest |v|.
  function velocity(field, vx, vy) {
    let vmax = 1e-12;
    for (let b = 0; b < G; b++) {
      for (let a = 0; a < G; a++) {
        const k = b * G + a, c = Math.max(field[k], 1e-12);
        const gx = (a > 0 && a < G - 1) ? (field[k + 1] - field[k - 1]) / 2 : 0;
        const gy = (b > 0 && b < G - 1) ? (field[k + G] - field[k - G]) / 2 : 0;
        vx[k] = -gx / c;
        vy[k] = -gy / c;
        const m = Math.max(Math.abs(vx[k]), Math.abs(vy[k]));
        if (m > vmax) vmax = m;
      }
    }
    return vmax;
  }

  // Bilinear interpolation between cell centres
  function sample(field, uu, vv) {
    uu = Math.min(G - 1, Math.max(0, uu - 0.5));
    vv = Math.min(G - 1, Math.max(0, vv - 0.5));
    const a = Math.min(G - 2, Math.floor(uu)), b = Math.min(G - 2, Math.floor(vv));
    const fu = uu - a, fv = vv - b, k = b * G + a;
    return field[k] * (1 - fu) * (1 - fv) + field[k + 1] * fu * (1 - fv) +
      field[k + G] * (1 - fu) * fv + field[k + G + 1] * fu * fv;
  }

  // Each node spreads its unit mass over the four nearest cell centres
  function depositNodes(out) {
    for (let i = 0; i < n; i++) {
      const uu = u[i] - 0.5, vv = v[i] - 0.5;
      const a = Math.floor(uu), b = Math.floor(vv), fu = uu - a, fv = vv - b;
      add(out, a, b, (1 - fu) * (1 - fv));
      add(out, a + 1, b, fu * (1 - fv));
      add(out, a, b + 1, (1 - fu) * fv);
      add(out, a + 1, b + 1, fu * fv);
    }
  }

  function add(out, a, b, w) {
    a = Math.min(G - 1, Math.max(0, a));
    b = Math.min(G - 1, Math.max(0, b));
    out[b * G + a] += w;
  }

  function clampGrid(value) {
    return Math.min(G - 1e-6, Math.max(1e-6, value));
  }
}

// About two cells per node along each side, rounded to a power of two for the fast transform
function gridSize(n) {
  const target = 2 * Math.sqrt(Math.max(n, 1));
  return Math.min(256, Math.max(64, 2 ** Math.round(Math.log2(target))));
}
