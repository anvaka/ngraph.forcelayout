// Optional part of "Fermi fans": leaves push only what is near them.
//
// Nodes that are not leaves ("core" nodes) repel everything as before. A leaf feels that push from
// every core node, but pushes back only when closer than `range`, with the stock strength
// (gravity * m1 * m2 / r^2) faded smoothly to zero at `range`. Two leaves push each other the same
// way, both sides. So a big fan no longer shoves distant stars away, while a foreign hub still
// clears its way through a fan.
//
// A leaf gets charge 0 but keeps its charge as its sensitivity: the trees hold only core nodes,
// and leaves still feel them. The charges are a node formula and the near push a one-sided pair
// formula, so the library runs both loops. Both trees work.
//
// Round 2 ("fermi2" in the lab) used a range of two link lengths and gave a leaf near a core node
// that core node's push twice (once through the tree, once in the near pass). Here the range is one
// link length, and each push is counted once.
export default function addShortRangeLeaves(layout, isLeafNode, rangeInLinks = 1) {
  const sim = layout.simulator;
  const store = sim.store;
  // Charges as they were (masses, unless the layout was given others)
  const baseCharge = sim.repulsionCharge(), baseSensitivity = sim.repulsionSensitivity();
  store.define('fanLeaf', Uint8Array);
  store.define('fanCharge', Float64Array);
  sim.repulsionCharge('fanCharge');
  sim.repulsionSensitivity(baseCharge);
  findLeaves();
  sim.on('topology', findLeaves);

  sim.addNodeFormula('fanCharges', {
    before: 'repulsion',
    formula: `fanCharge = fanLeaf != 0 ? 0 : ${baseCharge}`
  });

  // The push from leaves closer than `range` (read once per step, so it follows the spring
  // length; a spring length of 0 or less leaves no range, so leaves push nothing). The formula
  // runs for (i, j) and for (j, i), and each run pushes body i only, by the push of j if j is a
  // leaf: a leaf already got the push from core nodes through the trees, so a leaf-core pair moves
  // the core node only.
  sim.addPairFormula('fanLeaves', {
    radius: 'range',
    symmetric: false,
    params: { range: simulator => Math.max(0, rangeInLinks * simulator.springLength()) },
    formula: `fade = 1 - r * r / (range * range);
      push = fanLeaf_j != 0 ? -gravity * ${baseCharge}_i * ${baseCharge}_j * fade * fade / (r * r) : 0`
  });

  return function remove() {
    sim.off('topology', findLeaves);
    sim.removeStage('fanLeaves');
    sim.removeStage('fanCharges');
    sim.repulsionCharge(baseCharge);
    sim.repulsionSensitivity(baseSensitivity);
    store.remove('fanLeaf');
    store.remove('fanCharge');
  };

  function findLeaves() {
    const fanLeaf = store.fanLeaf;
    sim.bodies.forEach((body, i) => { fanLeaf[i] = isLeafNode(body.id) ? 1 : 0; });
  }
}
