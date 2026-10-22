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
// Both parts are formulas: the push is a pair formula (the simulator finds the close pairs with
// its grid, in any number of dimensions) that also adds up how stiff the push is around each
// node, and the inertia is a node formula. The push runs after the library's repulsion and
// springs, and the inertia just before the integration, so it sees each node's whole force.
const MIN_H = 1e-9; // shortest push range, in layout units
const B_SAFE = 1.5;

export default function addCrowdingCost(simulator, name, options) {
  // How stiff the push is around each body, added up over its pairs every step
  simulator.store.define('crowdingStiffness', Float64Array);
  // Read every step, so panel changes to the spring length apply live
  const h = sim => options.range * sim.settings.springLength;
  const inv = sim => 1 / h(sim);

  simulator.addPairFormula(name, {
    // the stiffness of this step's pairs, not a running total
    startAtZero: ['crowdingStiffness'],
    // A range shorter than MIN_H holds no two distinct nodes in practice, and its push (~ c / h)
    // and stiffness (~ c / h^2) could overflow, so it counts as off.
    radius: sim => {
      const c = options.strength, range = h(sim);
      const active = c > 0 && range >= MIN_H && Number.isFinite(c) && Number.isFinite(range) && sim.store.n >= 2;
      return active ? range : 0;
    },
    params: {
      c: () => options.strength,
      inv,
      pairStiffness: sim => 2 * inv(sim) * inv(sim)
    },
    formula: `
      weight = c * (1 / mass_i + 1 / mass_j);
      crowdingStiffness_i += weight * pairStiffness;
      crowdingStiffness_j += weight * pairStiffness;
      push = weight * 2 * (1 - r * inv) * inv`
  });
  // Heavier inertia for nodes whose step would overshoot: the whole force on such a node, drag
  // included, is scaled by m / inertia. Without the push every stiffness is 0, and nothing changes.
  simulator.addNodeFormula(name + '-inertia', {
    formula: `
      inertia = dt * dt * (crowdingStiffness + springCoefficient * degree) / ${B_SAFE};
      force *= pinned == 0 && crowdingStiffness != 0 && inertia > mass ? mass / inertia : 1`
  });

  return function remove() {
    simulator.removeStage(name);
    simulator.removeStage(name + '-inertia');
    simulator.store.remove('crowdingStiffness');
  };
}
