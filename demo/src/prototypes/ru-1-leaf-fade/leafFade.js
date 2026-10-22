// Repulsion (2D) in which every push that involves a leaf fades with distance.
//
// The library pushes every pair of bodies apart with G * m_i * m_j / r^2, at any distance. Here a
// push between two non-leaf ("core") bodies keeps exactly that law, but a push that involves a
// leaf (a node with one link, hanging off a node with more) is multiplied by
//
//   fade(r) = (1 + r / reach) * exp(-r / reach),
//
// the push of a "screened" charge, and dropped beyond CUTOFF * reach. `reach` is in spring lengths
// and follows the spring length setting.
//
// Three charges, which the library walks in one tree (stages next to each other share a walk):
// - the stock repulsion, with the fade law: every body's charge, felt by leaves only;
// - 'leafFadeCore': core charges at 1/r^2, felt by core bodies;
// - 'leafFadeLeaves': leaf charges with the fade law, felt by core bodies.
// The core charge acts from its own centre in a tree cell, since a hub sits apart from its leaves;
// the leaf charge acts from the cell's centre, which is faster and as accurate.
const CUTOFF = 6;

export default function addLeafFade(layout, { reach, fadeAll }) {
  const sim = layout.simulator, store = sim.store;
  const charge = sim.repulsionCharge(), sensitivity = sim.repulsionSensitivity(), law = sim.repulsionLaw().spec;
  store.define('leafFadeLeaf', Uint8Array);
  store.define('leafFadeCore');
  store.define('leafFadeLeafCharge');
  findLeaves();
  sim.on('topology', findLeaves);

  sim.addNodeFormula('leafFadeCharges', {
    before: 'repulsion',
    formula: `leafFadeCore = leafFadeLeaf != 0 ? 0 : ${charge}; leafFadeLeafCharge = leafFadeLeaf != 0 ? ${charge} : 0`
  });
  const fade = {
    force: 'u = r / L; (1 + u) * exp(-u) / r^2',
    params: { L: context => reach * context.springLength() },
    range: CUTOFF + ' * L'
  };
  sim.repulsionLaw(fade);
  sim.repulsionSensitivity('leafFadeLeafCharge');
  sim.addRepulsion('leafFadeCore', { after: 'repulsion', charge: 'leafFadeCore' });
  sim.addRepulsion('leafFadeLeaves', {
    after: 'leafFadeCore', charge: 'leafFadeLeafCharge', sensitivity: 'leafFadeCore', law: fade, centroid: 'shared'
  });

  return function remove() {
    sim.off('topology', findLeaves);
    ['leafFadeLeaves', 'leafFadeCore', 'leafFadeCharges'].forEach(name => sim.removeStage(name));
    sim.repulsionLaw(law);
    sim.repulsionSensitivity(sensitivity);
    ['leafFadeLeaf', 'leafFadeCore', 'leafFadeLeafCharge'].forEach(name => store.remove(name));
  };

  // A leaf has one link and hangs off a node with more; an isolated pair keeps the plain push
  function findLeaves() {
    const n = store.n, degree = store.degree, leaf = store.leafFadeLeaf;
    const neighbor = new Int32Array(n);
    const springs = sim.springStore, from = springs.from, to = springs.to;
    for (let s = 0; s < springs.n; s++) { neighbor[from[s]] = to[s]; neighbor[to[s]] = from[s]; }
    for (let i = 0; i < n; i++) leaf[i] = fadeAll || (degree[i] === 1 && degree[neighbor[i]] > 1) ? 1 : 0;
    store.changed('leafFadeLeaf');
  }
}
