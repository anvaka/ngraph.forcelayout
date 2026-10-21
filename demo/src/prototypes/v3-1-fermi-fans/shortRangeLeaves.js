// Optional part of "Fermi fans": leaves push only what is near them.
//
// Nodes that are not leaves ("core" nodes) repel everything as before. A leaf feels that push from
// every core node, but pushes back only when closer than `range`, with the stock strength
// (gravity * m1 * m2 / r^2) faded smoothly to zero at `range`. Two leaves push each other the same
// way, both sides. So a big fan no longer shoves distant stars away, while a foreign hub still
// clears its way through a fan.
//
// A leaf gets charge 0 but keeps its charge as its sensitivity: the trees hold only core nodes,
// and leaves still feel them. The near push is a pair rule. Both trees work.
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

  // Read once per step, for the pair rule below
  let range = 0, range2 = 0, gravity = 0, leaf = null, charge = null;
  sim.addStage('fanCharges', ({ n, fanCharge }) => {
    // A spring length of 0 (or less) leaves no range, so leaves push nothing
    range = Math.max(0, rangeInLinks * sim.springLength());
    range2 = range * range;
    gravity = sim.gravity();
    leaf = store.fanLeaf;
    charge = store[baseCharge];
    for (let i = 0; i < n; i++) fanCharge[i] = leaf[i] ? 0 : charge[i];
  }, { before: 'repulsion' });

  // The push from leaves closer than `range`. A leaf already got the push from core nodes through
  // the trees, so a leaf-core pair moves the core node only.
  sim.addPairRule('fanLeaves', {
    radius: () => range,
    symmetric: false,
    rule(i, j, r) {
      if (!leaf[j]) return 0;
      const fade = 1 - r * r / range2;
      return -gravity * charge[i] * charge[j] * fade * fade / (r * r * r);
    }
  });

  return function remove() {
    sim.off('topology', findLeaves);
    sim.removePairRule('fanLeaves');
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
