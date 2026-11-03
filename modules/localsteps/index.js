/**
 * Local time steps: each body moves with a step its own neighbourhood can follow.
 *
 * N-body codes give every particle its own time step, from its local dynamical time (how much
 * mass sits how close: t ~ 1 / sqrt(G * sum m_j / r_j^3)), so a dense core is followed in small
 * steps while the outskirts take big ones. A layout does not need the core's true motion, only
 * that the step does not overshoot. So each body keeps the common step and gets a larger inertia
 * instead, where the explicit step is past its stability limit:
 *
 *   K_i = q_i * sum over bodies j closer than `reach` springs of 2 |gravity| q_j / r^3
 *       + degree_i * springCoefficient                 (the stiffness around body i)
 *   I_i = max(mass_i, dt^2 * K_i / sigma)               (the step at most 1/sigma of its limit)
 *
 * The stiffness comes from a pair formula over close bodies (crowded neighbours are where the
 * stiffness is: 1/r^3), so it is known before the step: nothing has to overshoot first.
 *
 * Drag is still divided by the mass, so a slowed body loses its speed per step as fast as before
 * (dividing drag by the larger inertia leaves dense blobs undamped: they wander and spin).
 *
 * `mode: 'secant'` measures the stiffness instead, from how each body's force changed along its
 * last move (no pair pass; it overreacts while a layout unfolds).
 *
 * All of it is formulas, so every engine that runs formulas (the CPU, the WebGPU module) runs
 * it as it is.
 *
 *   import addLocalSteps from 'ngraph.forcelayout.localsteps';
 *   let control = addLocalSteps(layout.simulator);
 *   control.dispose(); // back to the stock step
 */
export default function addLocalSteps(simulator, options = {}) {
  const store = simulator.store;
  const D = store.D;
  const name = options.name || 'localSteps';
  const mode = options.mode || 'pairs';
  const sigma = options.sigma || 1;
  const relax = options.relax === undefined ? (mode === 'secant' ? 0.99 : 0) : options.relax;
  const reach = options.reach || 1;
  // the pair pass can run every `every` steps (the column keeps its sums in between); on G43 even
  // 4 steps late lets 6% of the bodies boil again: 1/r^3 changes fast
  const every = options.every || 1;
  const delta = options.delta === undefined ? 0.01 : options.delta;
  const column = name + 'Inertia', stiffness = name + 'Stiffness', lastPos = name + 'Pos', lastForce = name + 'Force';
  const charge = simulator.settings.repulsionCharge || 'mass';
  const defined = [];
  const stages = [];
  define(column, 1, 1);
  const before = simulator.inertia();

  let measure;
  if (mode === 'pairs') {
    define(stiffness, 1, 0);
    // after the springs, like any pair formula; pushes nothing, only adds up
    simulator.addPairFormula(name + 'Pairs', {
      radius: 'h',
      when: every > 1 ? `step - floor(step / ${every}) * ${every} == 0` : undefined,
      params: {h: context => reach * context.unit()},
      startAtZero: [stiffness],
      formula: `g = 2 * abs(gravity) / (r * r * r); ${stiffness}_i += g * ${charge}_j; ${stiffness}_j += g * ${charge}_i`
    });
    stages.push(name + 'Pairs');
    measure = [`kappa = ${charge} * ${stiffness} + degree * springCoefficient`];
  } else {
    define(lastPos, D, 0);
    define(lastForce, D, 0);
    measure = [
      // the force without drag (the drag stage added -dragCoefficient * velocity)
      `fc = force + dragCoefficient * velocity`,
      `dx = pos - ${lastPos}`,
      `h = delta * dt * maxVelocity`,
      `k0 = step > 0 ? max(0, -dot(fc - ${lastForce}, dx) / (dot(dx, dx) + h * h)) : 0`,
      `kappa = k0`
    ];
  }

  // Before integrate (after the springs and the pair pass): all forces are in
  simulator.addNodeFormula(name, {
    before: 'integrate',
    params: {relax, sigma, delta},
    formula: measure.concat([
      `I = max(mass, max(dt * dt * kappa / sigma, mass + (${column} - mass) * relax))`,
      `${column} = I`,
      // drag stays divided by the mass: add what the larger inertia takes away from it
      `force -= dragCoefficient * velocity * (I / mass - 1)`
    ]).concat(mode === 'secant' ? [`${lastPos} = pos`, `${lastForce} = fc`] : []).join('; ')
  });
  stages.push(name);
  simulator.inertia(column);

  return {
    name,
    column,
    dispose() {
      stages.forEach(stage => simulator.removeStage(stage));
      simulator.inertia(before);
      defined.forEach(c => store.remove(c));
    }
  };

  function define(columnName, size, initial) {
    if (store.has(columnName)) return;
    store.define(columnName, Float64Array, size, initial);
    defined.push(columnName);
  }
}
