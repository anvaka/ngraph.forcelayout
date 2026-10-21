// Optional part of "Fermi fans": leaves push only what is near them.
//
// Replaces the library's repulsion (lib/createPhysicsSimulator.js nbodyForce). Nodes that are not
// leaves ("core" nodes) repel everything as before, through the library's own quad tree, which holds
// only core nodes. A leaf feels that push from every core node, but pushes back only when closer than
// `range`, with the stock strength (gravity * m1 * m2 / r^2) faded smoothly to zero at `range`. Two
// leaves push each other the same way, both sides. So a big fan no longer shoves distant stars away,
// while a foreign hub still clears its way through a fan. Drag is applied as in the library (not with
// the FIRE integrator).
//
// Round 2 ("fermi2" in the lab) used a range of two link lengths and gave a leaf near a core node
// that core node's push twice (once through the tree, once in the near pass). Here the range is one
// link length, and each push is counted once.
import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js';

export default function createShortRangeLeaves(layout, isLeafNode, rangeInLinks = 1) {
  const sim = layout.simulator;
  const settings = sim.settings;
  const tree = generateQuadTree(2)({ gravity: settings.gravity, theta: settings.theta }, sim.random);

  let bodiesCount = -1;
  let core = [], leaves = [], isLeaf = new Uint8Array(0);
  let cellX = new Int32Array(0), cellY = new Int32Array(0), next = new Int32Array(0), head = new Int32Array(0);

  return function shortRangeLeavesForce() {
    const bodies = sim.bodies;
    if (bodies.length === 0) return;
    if (bodies.length !== bodiesCount) splitBodies(bodies);

    tree.options({ gravity: settings.gravity, theta: settings.theta });
    tree.insertBodies(core);
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      if (body.isPinned) continue;
      body.reset();
      tree.updateBodyForce(body); // core push, felt by core nodes and leaves alike
    }

    // A spring length of 0 (or less) leaves no range, so leaves push nothing
    const range = rangeInLinks * settings.springLength;
    if (range > 0) nearLeaves(bodies, range, settings.gravity);

    if (settings.integrator === 'fire') return; // FIRE removes energy its own way, as in the library
    const drag = settings.dragCoefficient;
    for (let i = 0; i < bodies.length; i++) {
      const body = bodies[i];
      if (body.isPinned) continue;
      body.force.x -= drag * body.velocity.x;
      body.force.y -= drag * body.velocity.y;
    }
  };

  function splitBodies(bodies) {
    bodiesCount = bodies.length;
    core = []; leaves = [];
    isLeaf = new Uint8Array(bodiesCount);
    for (let i = 0; i < bodiesCount; i++) {
      if (isLeafNode(bodies[i].id)) { isLeaf[i] = 1; leaves.push(bodies[i]); }
      else core.push(bodies[i]);
    }
    cellX = new Int32Array(bodiesCount);
    cellY = new Int32Array(bodiesCount);
    next = new Int32Array(bodiesCount);
    let tableSize = 1;
    while (tableSize < 2 * bodiesCount) tableSize *= 2;
    head = new Int32Array(tableSize);
  }

  // Pushes from leaves closer than `range`, through a hashed uniform grid. A leaf already got the
  // push from core nodes through the tree, so a leaf-core pair adds force to the core node only.
  function nearLeaves(bodies, range, gravity) {
    const n = bodies.length, mask = head.length - 1;
    // Cells are at least a millionth of the span from the origin to the farthest body: with a tiny
    // range the cell numbers would overflow the integer arrays and fall into one crowded bucket.
    // A cell wider than `range` still finds every pair within it.
    let span = 0;
    for (let i = 0; i < n; i++) {
      const p = bodies[i].pos;
      span = Math.max(span, Math.abs(p.x), Math.abs(p.y));
    }
    const cell = Math.max(range, span * 1e-6);
    head.fill(-1);
    for (let i = 0; i < n; i++) {
      const cx = Math.floor(bodies[i].pos.x / cell), cy = Math.floor(bodies[i].pos.y / cell);
      cellX[i] = cx; cellY[i] = cy;
      const h = hash(cx, cy) & mask;
      next[i] = head[h]; head[h] = i;
    }
    const range2 = range * range;
    for (let i = 0; i < n; i++) {
      if (!isLeaf[i]) continue;
      const a = bodies[i], ax = a.pos.x, ay = a.pos.y;
      for (let ox = -1; ox <= 1; ox++) for (let oy = -1; oy <= 1; oy++) {
        const cx = cellX[i] + ox, cy = cellY[i] + oy;
        for (let j = head[hash(cx, cy) & mask]; j !== -1; j = next[j]) {
          if (cellX[j] !== cx || cellY[j] !== cy) continue; // another cell in the same bucket
          if (isLeaf[j] && j <= i) continue;                // each leaf pair once
          const b = bodies[j];
          let dx = b.pos.x - ax, dy = b.pos.y - ay, r2 = dx * dx + dy * dy;
          if (r2 >= range2 || j === i) continue;
          if (r2 === 0) {
            dx = (sim.random.nextDouble() - 0.5) / 50; dy = (sim.random.nextDouble() - 0.5) / 50;
            r2 = dx * dx + dy * dy;
          }
          const r = Math.sqrt(r2), fade = 1 - r2 / range2;
          const v = gravity * a.mass * b.mass * fade * fade / (r2 * r);
          if (isLeaf[j]) { a.force.x += v * dx; a.force.y += v * dy; }
          b.force.x -= v * dx; b.force.y -= v * dy;
        }
      }
    }
  }
}

function hash(x, y) {
  return Math.imul(x, 73856093) ^ Math.imul(y, 19349663);
}
