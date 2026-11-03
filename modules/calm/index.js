/**
 * Calm crowded bodies: each body measures how stiff its surroundings are, and a body whose
 * surroundings are too stiff for the time step answers forces more slowly, just enough to stay
 * inside the stable step. Bodies in soft surroundings move exactly as without it.
 *
 * Why: the library's step `v += dt (F - c v) / m; x += dt v` is stable for a body only while
 * dt^2 K / m < 2 (2 - dt c / m), K being how fast the force on it grows as it moves. In the
 * crowded parts of dense graphs K comes from the 1/r^2 push of close, unlinked neighbours, and
 * sits 2-6 times past that bound: the body overshoots every step, and the speed limit
 * (maxVelocity) turns that into a steady boil of random jumps.
 *
 * How: every step, a body measures its stiffness from how the force on it changed along its last
 * move (a secant, as in the Barzilai-Borwein step of optimisation):
 *
 *     k = -(F_now - F_before) . dx / |dx|^2
 *
 * It remembers the largest recent value (`calmStiff`, forgotten by `decay` per step) and moves
 * with inertia I = max(m, dt^2 K / swing2), so that dt^2 K / I stays at `swing2`, about half the
 * stable bound. Drag grows by the same factor I / m, so the body loses the same share of its
 * speed per step as before and does not wander: it only answers forces I / m times more slowly
 * (a local preconditioner, as mass scaling is in explicit dynamics).
 *
 * The stiffness comes from the forces the step computed: springs, every repulsion pass and any
 * added stage, whatever their law. Nothing here knows the force law, and nothing searches for
 * neighbours: it is one node formula, so the CPU and the WebGPU engine run the same text.
 *
 * Options:
 *  - swing2 (1.5): dt^2 K / I a calmed body keeps; 2 is the edge for a fully damped body
 *  - decay (0.98): share of the remembered stiffness kept per step
 *  - delay (300), fade (100): bodies are not calmed in the first `delay` steps, fully after
 *    `fade` more. The start (pivot or random) puts bodies on top of each other, which is stiff
 *    for a moment; calming then would slow the first unfolding, which the boil does no harm to
 *  - measure: 'motion' (the secant, default) or 'pairs': the default law's 2|G| m_i m_j / r^3
 *    summed over pairs closer than `radius` (0.5) spring lengths, with a tail for the bodies
 *    beyond (2D). Needs no history, but costs a pair search and misses heavy, spread-out bodies
 */
export default function calmCrowdedBodies(simulator, options = {}) {
  const o = {
    swing2: options.swing2 > 0 ? options.swing2 : 1.5,
    decay: options.decay >= 0 ? options.decay : 0.98,
    delay: options.delay >= 0 ? options.delay : 300,
    fade: options.fade > 0 ? options.fade : 100,
    radius: options.radius > 0 ? options.radius : 0.5,
    tail: options.tail !== undefined ? Number(options.tail) : (simulator.store.D === 2 ? 1 : 0)
  };
  const store = simulator.store;
  const columns = ['calmPrevForce', 'calmStiff', 'calmNear', 'calmNearMass', 'calmInertia'];
  const stages = ['calmCrowdedBodies', 'calmNearPairs'];
  columns.forEach(name => { if (store.has(name)) store.remove(name); });
  store.define('calmInertia', Float64Array, 1, 1);
  // 0 before the delay, 1 after the fade: the share of the measured inertia bodies get
  const on = ctx => Math.max(0, Math.min(1, (ctx.iteration() - o.delay) / o.fade));
  const useDrag = ctx => ctx.settings.integrator !== 'fire' ? 1 : 0;

  if (options.measure === 'pairs') addPairStiffness(simulator, o, on, useDrag);
  else addMeasuredStiffness(simulator, o, on, useDrag);
  simulator.inertia('calmInertia');

  return {
    dispose() {
      simulator.inertia('mass');
      stages.forEach(name => { if (simulator.getStage(name)) simulator.removeStage(name); });
      columns.forEach(name => { if (store.has(name)) store.remove(name); });
    }
  };
}

// The stiffness measured from the motion
function addMeasuredStiffness(simulator, o, on, useDrag) {
  const store = simulator.store;
  store.define('calmPrevForce', Float64Array, store.D);
  store.define('calmStiff', Float64Array, 1);
  // Runs after every force of the step and before `integrate`. `force` holds the drag (-c v),
  // which the secant must not see, so it is taken out first.
  simulator.addNodeFormula('calmCrowdedBodies', {
    params: { swing2: o.swing2, decay: o.decay, on, useDrag },
    formula: `
      f = force + useDrag * dragCoefficient * velocity;
      dx = dt * velocity;
      dx2 = dot(dx, dx);
      k = dx2 > 1e-12 ? -dot(f - calmPrevForce, dx) / dx2 : 0;
      calmStiff = max(k, calmStiff * decay);
      calmPrevForce = f;
      I = max(mass, on * calmStiff * dt * dt / swing2);
      force = force - useDrag * dragCoefficient * (I / mass - 1) * velocity;
      calmInertia = I`
  });
}

// The stiffness from where the bodies are: the default repulsion's 2|G| q_i q_j / r^3 (charges
// are the masses) summed over pairs closer than `radius` spring lengths, plus what the bodies
// beyond would add at the density seen inside (a tail correction, as for the cut-off of a pair
// potential in molecular dynamics; 2D only), plus the springs
function addPairStiffness(simulator, o, on, useDrag) {
  const store = simulator.store;
  store.define('calmNear', Float64Array, 1);
  store.define('calmNearMass', Float64Array, 1);
  simulator.addPairFormula('calmNearPairs', {
    startAtZero: ['calmNear', 'calmNearMass'],
    radius: ctx => o.radius * ctx.unit(),
    formula: `
      w = 1 / (r * r * r);
      calmNear_i += mass_j * w;
      calmNear_j += mass_i * w;
      calmNearMass_i += mass_j;
      calmNearMass_j += mass_i;
      push = 0`
  });
  simulator.addNodeFormula('calmCrowdedBodies', {
    after: 'calmNearPairs',
    params: {
      swing2: o.swing2,
      tail: o.tail,
      R3: ctx => Math.pow(o.radius * ctx.unit(), 3),
      on,
      useDrag
    },
    formula: `
      K = 2 * abs(gravity) * mass * (calmNear + tail * 2 * calmNearMass / R3) + springCoefficient * degree;
      I = max(mass, on * K * dt * dt / swing2);
      force = force - useDrag * dragCoefficient * (I / mass - 1) * velocity;
      calmInertia = I`
  });
}
