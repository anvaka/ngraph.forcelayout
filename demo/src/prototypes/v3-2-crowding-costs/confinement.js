// "Crowding costs energy": every node pays (c / m) * (how crowded its surroundings are), like the
// energy it takes to squeeze a quantum particle into a small space. For two nodes closer than h,
// the pair energy is c * (1/m_i + 1/m_j) * (1 - r/h)^2, so they push apart with
//   F = c * (1/m_i + 1/m_j) * 2 * (1 - r/h) / h
// on each of the two, in opposite directions. Two light nodes (leaves) push each other harder
// than a pair that includes a heavy hub. Nodes farther apart than h do not feel it at all.
//
// The push is stiff where nodes are crowded, and the explicit step (v += dt F / m) overshoots
// once dt^2 * stiffness / m > ~2, which makes nodes shake. So crowded nodes get a larger inertia
// for this step only: the whole force, drag included, is divided by it. A steady force still
// moves them at the same speed, so pieces drift apart as fast as without this.
//
// The push is a pair rule: the simulator finds the close pairs with its grid, in any number of
// dimensions. It runs after the library's repulsion and springs, so the inertia sees each node's
// whole force.
const MIN_H = 1e-9; // shortest push range, in layout units
const B_SAFE = 1.5;

export default function addCrowdingCost(simulator, name, options) {
  // How stiff the push is around each body, summed over its pairs every step
  simulator.store.define('crowdingStiffness', Float64Array);
  let c = 0, h = 0, inv = 0, pairStiffness = 0, active = false;

  simulator.addPairRule(name, {
    radius: () => active ? h : 0,
    rule(i, j, r, { mass, crowdingStiffness }) {
      const weight = c * (1 / mass[i] + 1 / mass[j]);
      crowdingStiffness[i] += weight * pairStiffness;
      crowdingStiffness[j] += weight * pairStiffness;
      return weight * 2 * (1 - r * inv) * inv / r;
    }
  });
  // Reads the spring length every step, so panel changes apply live
  simulator.addStage(name + '-range', ({ n, crowdingStiffness }, sim) => {
    c = options.strength;
    h = options.range * sim.settings.springLength;
    // A range shorter than MIN_H holds no two distinct nodes in practice, and its push (~ c / h)
    // and stiffness (~ c / h^2) could overflow, so it counts as off.
    active = c > 0 && h >= MIN_H && Number.isFinite(c) && Number.isFinite(h) && n >= 2;
    inv = 1 / h;
    pairStiffness = 2 * inv * inv;
    crowdingStiffness.fill(0, 0, n);
  }, { before: 'pairRules' });
  simulator.addStage(name + '-inertia', limitSteps);

  return function remove() {
    simulator.removePairRule(name);
    simulator.removeStage(name + '-range');
    simulator.removeStage(name + '-inertia');
    simulator.store.remove('crowdingStiffness');
  };

  // Heavier inertia for nodes whose step would overshoot: the whole force on such a node,
  // drag included, is scaled by m / inertia.
  function limitSteps({ n, D, force, mass, pinned, degree, crowdingStiffness }, sim) {
    if (!active) return;
    const dt = sim.settings.timeStep, springK = sim.settings.springCoefficient;
    for (let i = 0; i < n; ++i) {
      if (pinned[i] || crowdingStiffness[i] === 0) continue;
      const inertia = dt * dt * (crowdingStiffness[i] + springK * degree[i]) / B_SAFE;
      if (inertia <= mass[i]) continue;
      const scale = mass[i] / inertia;
      for (let k = 0; k < D; ++k) force[i * D + k] *= scale;
    }
  }
}
