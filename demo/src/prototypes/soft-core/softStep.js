// Soft step: every body takes the step backward (implicit) Euler would take with its own
// stiffness k, so a body packed into a crowd can't overshoot, however stiff the crowd is.
//
// Backward Euler, linearised, with each body on its own (the Hessian's diagonal):
//   v' = ((m - dt c) v + dt F) / (m + dt^2 k)
// With k = 0 this is the library's own Euler step, so calm bodies move exactly as before. A stiff
// body gets heavier AND more damped: its velocity is mostly forgotten each step instead of
// carried into the next overshoot. (The October inertia fix made stiff bodies heavier only: their
// drag got weaker, and dense blobs wandered and spun.)
//
// k is measured, not modelled: how much the force on the body changed since the last step, per
// unit the body moved (a secant, as quasi-Newton methods use). It needs no neighbour search and
// no change to the trees: a body that shakes feels its force swing back and forth, and gets a
// large k; a body that glides through a smooth field, alone or with its whole crowd, feels little
// change and keeps k near 0. k rises at once and falls by `release` per step, so a body that
// shook stays calm for a while instead of starting again the step after.
//
// The whole thing is one node formula, so every engine that runs formulas (the CPU, the WebGPU
// module) runs the same physics.
export const SOFT_COLUMNS = ['softF', 'softX', 'softK'];

export default function addSoftStep(simulator, name, options) {
  const store = simulator.store;
  const D = store.D;
  store.define('softF', Float64Array, D);   // last step's force, without drag
  store.define('softX', Float64Array, D);   // last step's position
  store.define('softK', Float64Array, 1);   // the body's stiffness, as measured
  simulator.addNodeFormula(name, {
    params: {
      strength: () => options.strength,
      release: () => options.release,
      cap: () => options.cap,
      damping: () => options.damping === undefined ? 1 : options.damping
    },
    formula: `
      fc = force + dragCoefficient * velocity;
      moved = length(pos - softX);
      est = length(fc - softF) / (moved + 0.000001 * unit);
      est = select(step < 1, 0, min(est, cap * mass / (dt * dt)));
      // a body that barely moved can't measure its stiffness: it keeps what it had
      k = select(moved < 0.0001 * unit, softK, select(est > softK, est, release * softK + (1 - release) * est));
      softK = k;
      softF = fc;
      softX = pos;
      ks = strength * k;
      force = select(pinned == 0, (force - damping * dt * ks * velocity) * (mass / (mass + dt * dt * ks)), force)`
  });
  return function remove() {
    simulator.removeStage(name);
    SOFT_COLUMNS.forEach(column => store.remove(column));
  };
}
