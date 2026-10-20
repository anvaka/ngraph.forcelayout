// "Pieces push only on contact": the forces behind the v1-7-contact-push prototype (2D only).
//
// 1. Repulsion inside a piece. The library's own n-body kernel (quad tree or dual tree, as
//    picked in the panel) runs once per connected piece, so nodes of different pieces no
//    longer push each other from afar. This replaces the simulator's 'nbody' force.
// 2. Contact between pieces. Two nodes of different pieces that come closer than the contact
//    distance push their pieces apart. The push is applied to the whole piece as one
//    acceleration, so no piece gets bent.
// 3. A wall around all pieces, as in the v4 prototype: a piece that pokes out of a circle
//    sized from the pieces' own areas is pulled back toward the common centre. The pull is
//    paired (the total momentum stays the same), so the picture doesn't drift away.
const SMALL_PIECE = 8; // pieces up to this size use a plain double loop instead of a tree
const CONTACT_STIFFNESS = 2; // times springCoefficient

export default function createPiecePush(simulator, options, kernels) {
  const bodies = simulator.bodies;
  const springs = simulator.springs;
  const settings = simulator.settings;
  const contact = Math.max(0, Number(options.contact) || 0);
  const farPush = !!Number(options.farPush);
  const wallSlack = Math.max(1, Number(options.wallSlack) || 1.3);

  // Pieces (connected components), rebuilt when bodies or springs are added or removed
  let knownBodies = -1, knownSprings = -1;
  let pieceOf = new Int32Array(0), pieces = [], pieceCount = 0;
  let quadTrees = [], dualTrees = [];
  let mass, sumX, sumY, spread, accX, accY;
  // Spatial hash for contacts
  let cellX = new Int32Array(0), cellY = new Int32Array(0), next = new Int32Array(0), head = new Int32Array(0);
  // first piece seen in each bucket, or -2 when the bucket holds more than one piece
  let bucketPiece = new Int32Array(0);

  if (!farPush) {
    const springForce = simulator.getForces().get('spring');
    simulator.removeForce('nbody');
    simulator.removeForce('spring');
    simulator.addForce('nbody', repulsionInsidePieces);
    // springs must run after repulsion, which resets the forces
    if (springForce) simulator.addForce('spring', springForce);
  }
  simulator.addForce('v1-7-contact-and-wall', contactAndWall);

  return {
    dispose() {
      simulator.removeForce('v1-7-contact-and-wall');
    }
  };

  function updatePieces() {
    if (knownBodies === bodies.length && knownSprings === springs.length) return;
    knownBodies = bodies.length;
    knownSprings = springs.length;
    const n = bodies.length;
    const index = new Map();
    bodies.forEach((body, i) => index.set(body, i));
    const parent = new Int32Array(n);
    for (let i = 0; i < n; i++) parent[i] = i;
    const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    for (const spring of springs) {
      const a = find(index.get(spring.from)), b = find(index.get(spring.to));
      if (a !== b) parent[a] = b;
    }
    const pieceByRoot = new Map();
    pieceOf = new Int32Array(n);
    pieces = [];
    for (let i = 0; i < n; i++) {
      const root = find(i);
      let id = pieceByRoot.get(root);
      if (id === undefined) { id = pieces.length; pieceByRoot.set(root, id); pieces.push([]); }
      pieceOf[i] = id;
      pieces[id].push(bodies[i]);
    }
    pieceCount = pieces.length;
    quadTrees = new Array(pieceCount);
    dualTrees = new Array(pieceCount);
    mass = new Float64Array(pieceCount); sumX = new Float64Array(pieceCount); sumY = new Float64Array(pieceCount);
    spread = new Float64Array(pieceCount); accX = new Float64Array(pieceCount); accY = new Float64Array(pieceCount);
    cellX = new Int32Array(n); cellY = new Int32Array(n); next = new Int32Array(n);
    let size = 1; while (size < 2 * n) size *= 2;
    head = new Int32Array(size);
    bucketPiece = new Int32Array(size);
  }

  function repulsionInsidePieces() {
    updatePieces();
    const useDualTree = settings.nbody === 'dualtree';
    for (let p = 0; p < pieceCount; p++) {
      const piece = pieces[p];
      if (piece.length <= SMALL_PIECE) {
        directRepulsion(piece);
      } else if (useDualTree) {
        if (!dualTrees[p]) dualTrees[p] = kernels.createDualTree(settings);
        dualTrees[p].computeForces(piece);
      } else {
        if (!quadTrees[p]) quadTrees[p] = kernels.createQuadTree({}, simulator.random);
        const tree = quadTrees[p];
        tree.options({ gravity: settings.gravity, theta: settings.theta });
        tree.insertBodies(piece);
        for (const body of piece) {
          if (body.isPinned) continue;
          body.reset();
          tree.updateBodyForce(body);
        }
      }
    }
    // Same drag as the library's own n-body force; FIRE brings its own instead
    if (settings.integrator !== 'fire') {
      const drag = settings.dragCoefficient;
      for (const body of bodies) {
        if (body.isPinned) continue;
        body.force.x -= drag * body.velocity.x;
        body.force.y -= drag * body.velocity.y;
      }
    }
  }

  function directRepulsion(piece) {
    for (const body of piece) if (!body.isPinned) body.reset();
    const gravity = settings.gravity;
    for (let i = 0; i < piece.length; i++) {
      const a = piece[i];
      for (let j = i + 1; j < piece.length; j++) {
        const b = piece[j];
        let dx = b.pos.x - a.pos.x, dy = b.pos.y - a.pos.y;
        let r2 = dx * dx + dy * dy;
        if (r2 === 0) { dx = (simulator.random.nextDouble() - 0.5) / 50; dy = (simulator.random.nextDouble() - 0.5) / 50; r2 = dx * dx + dy * dy; }
        const v = gravity * a.mass * b.mass / (r2 * Math.sqrt(r2));
        if (!a.isPinned) { a.force.x += v * dx; a.force.y += v * dy; }
        if (!b.isPinned) { b.force.x -= v * dx; b.force.y -= v * dy; }
      }
    }
  }

  function contactAndWall() {
    updatePieces();
    if (pieceCount < 2) return;
    const n = bodies.length;
    mass.fill(0); sumX.fill(0); sumY.fill(0); spread.fill(0); accX.fill(0); accY.fill(0);
    let totalMass = 0, centerX = 0, centerY = 0;
    for (let i = 0; i < n; i++) {
      const body = bodies[i], p = pieceOf[i], m = body.mass;
      mass[p] += m; sumX[p] += m * body.pos.x; sumY[p] += m * body.pos.y;
      totalMass += m; centerX += m * body.pos.x; centerY += m * body.pos.y;
    }
    if (!(totalMass > 0)) return;
    centerX /= totalMass; centerY /= totalMass;

    if (!farPush && contact > 0) addContacts();
    addWall(centerX, centerY, totalMass);

    for (let i = 0; i < n; i++) {
      const body = bodies[i];
      if (body.isPinned) continue;
      const p = pieceOf[i], k = body.mass / mass[p];
      body.force.x += k * accX[p];
      body.force.y += k * accY[p];
    }
  }

  // Contact pushes, summed per piece into accX/accY (as forces; divided by mass when applied)
  function addContacts() {
    let length = 0;
    for (const spring of springs) {
      const dx = spring.to.pos.x - spring.from.pos.x, dy = spring.to.pos.y - spring.from.pos.y;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    length = springs.length ? length / springs.length : settings.springLength;
    const reach = contact * length;
    if (!(reach > 0)) return;
    const stiffness = CONTACT_STIFFNESS * settings.springCoefficient;
    const mask = head.length - 1;
    const bucket = (u, v) => (Math.imul(u, 73856093) ^ Math.imul(v, 19349663)) & mask;
    head.fill(-1);
    bucketPiece.fill(-1);
    const n = bodies.length;
    for (let i = 0; i < n; i++) {
      const pos = bodies[i].pos;
      const u = Math.floor(pos.x / reach), v = Math.floor(pos.y / reach);
      cellX[i] = u; cellY[i] = v;
      const h = bucket(u, v);
      next[i] = head[h]; head[h] = i;
      if (bucketPiece[h] === -1) bucketPiece[h] = pieceOf[i];
      else if (bucketPiece[h] !== pieceOf[i]) bucketPiece[h] = -2;
    }
    for (let i = 0; i < n; i++) {
      const a = bodies[i].pos, pa = pieceOf[i], u0 = cellX[i], v0 = cellY[i];
      // Most nodes sit among their own piece only: skip them without walking the buckets
      let nearOther = false;
      for (let du = -1; du <= 1 && !nearOther; du++) {
        for (let dv = -1; dv <= 1; dv++) {
          const owner = bucketPiece[bucket(u0 + du, v0 + dv)];
          if (owner !== -1 && owner !== pa) { nearOther = true; break; }
        }
      }
      if (!nearOther) continue;
      for (let du = -1; du <= 1; du++) {
        for (let dv = -1; dv <= 1; dv++) {
          const u = u0 + du, v = v0 + dv;
          for (let j = head[bucket(u, v)]; j !== -1; j = next[j]) {
            // the bucket may also hold other cells; skip them, and count each pair once
            if (j <= i || cellX[j] !== u || cellY[j] !== v) continue;
            const pb = pieceOf[j];
            if (pb === pa) continue;
            const b = bodies[j].pos;
            let dx = a.x - b.x, dy = a.y - b.y;
            let r = Math.sqrt(dx * dx + dy * dy);
            if (r >= reach) continue;
            if (r === 0) { dx = 1; dy = 0; r = 1e-9; }
            const f = stiffness * (reach - r) / r;
            accX[pa] += f * dx; accY[pa] += f * dy;
            accX[pb] -= f * dx; accY[pb] -= f * dy;
          }
        }
      }
    }
  }

  // The v4 wall: pieces sticking out of a circle around everyone are pulled back in
  function addWall(centerX, centerY, totalMass) {
    const n = bodies.length;
    const L = settings.springLength;
    for (let i = 0; i < n; i++) {
      const body = bodies[i], p = pieceOf[i];
      const qx = body.pos.x - sumX[p] / mass[p], qy = body.pos.y - sumY[p] / mass[p];
      spread[p] += body.mass * (qx * qx + qy * qy);
    }
    let area = 0;
    for (let p = 0; p < pieceCount; p++) {
      spread[p] = Math.sqrt(2 * spread[p] / mass[p]); // radius of a disc with the same spread
      area += (spread[p] + L / 2) * (spread[p] + L / 2);
    }
    const wallRadius = wallSlack * Math.sqrt(area);
    const strength = Math.abs(settings.gravity) * (totalMass / n) / (L * L);
    let pullX = 0, pullY = 0;
    const pulls = [];
    for (let p = 0; p < pieceCount; p++) {
      const tx = centerX - sumX[p] / mass[p], ty = centerY - sumY[p] / mass[p];
      const dist = Math.sqrt(tx * tx + ty * ty);
      const out = dist + spread[p] - wallRadius;
      if (out <= 0 || dist === 0) continue;
      const scale = mass[p] * strength * Math.min(1, out / L) / dist;
      pulls.push(p, scale * tx, scale * ty);
      pullX += scale * tx; pullY += scale * ty;
    }
    for (let k = 0; k < pulls.length; k += 3) { accX[pulls[k]] += pulls[k + 1]; accY[pulls[k]] += pulls[k + 2]; }
    // pair the pull: every piece gives back its share, so the pull can't move the whole picture
    for (let p = 0; p < pieceCount; p++) {
      accX[p] -= mass[p] * pullX / totalMass;
      accY[p] -= mass[p] * pullY / totalMass;
    }
  }
}
