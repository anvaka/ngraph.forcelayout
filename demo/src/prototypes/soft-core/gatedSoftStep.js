// The soft step (pe-1) switched on per node, only while that node keeps shaking.
//
// With the soft core on, nodes no longer hit the speed limit and few steps reverse outright, so
// the trigger is the node's own recent motion: an exponential average over about `window` steps
// of its step vector (m) and of its step length (l). l - |m| is the part of the motion that went
// back and forth (0 for a node that glides steadily, as when a tree unfolds, and 0 for a node at
// rest). The gate opens when that wobble is over `on` spring lengths per step AND has not been
// dying down: it is at least `persist` times its own slow average over about `slow` steps. A
// crowd that rings once and settles (G43 with the soft core, measured: its wobble falls 3x every
// 200 steps) stays ungated; one that keeps shaking (megaStars' fan leaves, whose wobble grows to
// 0.008 L per step) opens. The gate closes slowly (`decay` per step), so a calmed node doesn't
// start shaking again the step after.
// While open, the node takes the soft step for its measured (secant) stiffness, as in pe-1:
//   v' = ((m - dt c) v + dt F) / (m + dt^2 k).
// One node formula: the CPU and WebGPU run the same text.
export const GATED_COLUMNS = ['softF', 'softX', 'softK', 'shakeM', 'shakeL', 'shakeW', 'shakeGate'];

export default function addGatedSoftStep(simulator, name, options) {
  const store = simulator.store;
  const D = store.D;
  store.define('softF', Float64Array, D);
  store.define('softX', Float64Array, D);
  store.define('softK', Float64Array, 1);
  store.define('shakeM', Float64Array, D);  // average step vector
  store.define('shakeL', Float64Array, 1);  // average step length
  store.define('shakeW', Float64Array, 1);  // slow average of the wobble
  store.define('shakeGate', Float64Array, 1);
  const gated = options.gated !== false;
  simulator.addNodeFormula(name, {
    params: {
      release: () => options.release,
      cap: () => options.cap,
      a: () => 1 / options.window,
      b: () => 1 / options.slow,
      persist: () => options.persist,
      on: () => gated ? options.on : -1,
      decay: () => options.decay
    },
    formula: `
      fc = force + dragCoefficient * velocity;
      d = pos - softX;
      moved = length(d);
      est = length(fc - softF) / (moved + 0.000001 * unit);
      est = select(step < 1, 0, min(est, cap * mass / (dt * dt)));
      k = select(moved < 0.0001 * unit, softK, select(est > softK, est, release * softK + (1 - release) * est));
      softK = k;
      softF = fc;
      softX = pos;
      m = select(step < 1, d * 0, shakeM + a * (d - shakeM));
      l = select(step < 1, 0, shakeL + a * (moved - shakeL));
      shakeM = m;
      shakeL = l;
      wobble = max(l - length(m), 0);
      // the slow average, without its start-up bias: a ringing that dies down stays above it
      w = select(step < 1, 0, shakeW + b * (wobble - shakeW));
      shakeW = w;
      slow = w / max(1 - pow(1 - b, step + 1), b);
      // the first slow steps of a layout are its start: nothing has had time to keep shaking
      keeps = step > 1 / b && wobble > on * unit && wobble >= persist * slow;
      g = select(on < 0, 1, select(keeps, 1, shakeGate * decay));
      shakeGate = g;
      ks = g * k;
      force = select(pinned == 0, (force - dt * ks * velocity) * (mass / (mass + dt * dt * ks)), force)`
  });
  return function remove() {
    simulator.removeStage(name);
    GATED_COLUMNS.forEach(column => store.remove(column));
  };
}
