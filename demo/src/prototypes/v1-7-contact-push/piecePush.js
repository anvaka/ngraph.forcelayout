// "Pieces push only on contact": the forces behind the v1-7-contact-push prototype.
//
// 1. Repulsion inside a piece. Each connected piece gets a simulator of its own that holds
//    copies of its bodies, and only that simulator's repulsion stage runs (quad tree or dual
//    tree, as picked in the panel). So nodes of different pieces no longer push each other
//    from afar. This replaces the simulator's 'repulsion' stage.
// 2. Contact between pieces. Two nodes of different pieces that come closer than the contact
//    distance push their pieces apart. The push is applied to the whole piece as one
//    acceleration, so no piece gets bent. Close pairs come from the simulator's neighbor grid.
// 3. A wall around all pieces, as in the v4 prototype: a piece that pokes out of a ball sized
//    from the pieces' own volumes is pulled back toward the common centre. The pull is paired
//    (the total momentum stays the same), so the picture doesn't drift away.
// Pieces that hold a pinned node get neither contact nor wall pushes (as in v4), so the
// pinned node doesn't hold back one part of its piece while the rest is pushed.
import createLayout from '../../../../index.js';

const SMALL_PIECE = 8; // pieces up to this size use a plain double loop instead of a tree
const CONTACT_STIFFNESS = 2; // times springCoefficient
const MAX_CONTACT = 100; // larger contact distances count as 100 (the help text says so)
const DEFAULT_WALL_SLACK = 1.3;
const STAGE_NAME = 'v1-7-contact-and-wall';

export default function createPiecePush(simulator, options) {
  const settings = simulator.settings;
  const D = settings.dimensions;
  const random = simulator.random;
  const contact = Math.min(MAX_CONTACT, Math.max(0, Number(options.contact) || 0));
  const farPush = !!Number(options.farPush);
  // 0 turns the wall off, other values below 1 count as 1, NaN falls back to the default
  const slack = Number(options.wallSlack);
  const wallSlack = Number.isNaN(slack) ? DEFAULT_WALL_SLACK : (slack === 0 ? 0 : Math.max(1, slack));

  // Pieces (connected components), found again when bodies or springs are added or removed.
  // The rows of piece p are rows[start[p]] .. rows[start[p + 1] - 1], in row order.
  let piecesKnown = false;
  let pieceOf = new Int32Array(0), rows = new Int32Array(0), start = new Int32Array(1);
  let pieceCount = 0, largest = 0;
  let pieceSimulators = [];
  let mass, sum, spread, acc, pinnedPiece;
  const d = new Float64Array(D), center = new Float64Array(D), pull = new Float64Array(D);

  const onTopology = () => { piecesKnown = false; };
  simulator.on('topology', onTopology);
  const repulsion = farPush ? null : simulator.replaceStage('repulsion', repulsionInsidePieces);
  simulator.addStage(STAGE_NAME, contactAndWall);

  return {
    dispose() {
      simulator.off('topology', onTopology);
      simulator.removeStage(STAGE_NAME);
      if (repulsion) simulator.replaceStage('repulsion', repulsion);
    }
  };

  function updatePieces({ n }) {
    if (piecesKnown) return;
    piecesKnown = true;
    const parent = new Int32Array(n);
    for (let i = 0; i < n; i++) parent[i] = i;
    const find = x => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
    const { from, to } = simulator.springStore;
    for (let s = 0; s < simulator.springStore.n; s++) {
      const a = find(from[s]), b = find(to[s]);
      if (a !== b) parent[a] = b;
    }
    const pieceByRoot = new Map();
    pieceOf = new Int32Array(n);
    const sizes = [];
    for (let i = 0; i < n; i++) {
      const root = find(i);
      let id = pieceByRoot.get(root);
      if (id === undefined) { id = sizes.length; pieceByRoot.set(root, id); sizes.push(0); }
      pieceOf[i] = id;
      sizes[id] += 1;
    }
    pieceCount = sizes.length;
    start = new Int32Array(pieceCount + 1);
    largest = 0;
    for (let p = 0; p < pieceCount; p++) {
      start[p + 1] = start[p] + sizes[p];
      if (sizes[p] > sizes[largest]) largest = p;
    }
    rows = new Int32Array(n);
    const next = start.slice(0, pieceCount);
    for (let i = 0; i < n; i++) rows[next[pieceOf[i]]++] = i;
    pieceSimulators = new Array(pieceCount);
    mass = new Float64Array(pieceCount); sum = new Float64Array(pieceCount * D);
    spread = new Float64Array(pieceCount); acc = new Float64Array(pieceCount * D);
    pinnedPiece = new Uint8Array(pieceCount);
  }

  function repulsionInsidePieces(store) {
    updatePieces(store);
    const charge = store[settings.repulsionCharge];
    for (let p = 0; p < pieceCount; p++) {
      if (start[p + 1] - start[p] <= SMALL_PIECE) directRepulsion(store, charge, p);
      else repulsionInPiece(store, charge, p);
    }
  }

  // Runs the repulsion stage of the piece's own simulator on copies of its bodies
  function repulsionInPiece({ pos, force, pinned }, charge, p) {
    const first = start[p], count = start[p + 1] - first;
    let piece = pieceSimulators[p];
    if (!piece) {
      piece = pieceSimulators[p] = createLayout.simulator({ ...settings, repulsionCharge: 'mass' });
      for (let m = 0; m < count; m++) piece.addBodyAt(simulator.bodies[rows[first + m]].pos);
    }
    // the panel changes these without a new layout
    piece.settings.gravity = settings.gravity;
    piece.settings.theta = settings.theta;
    piece.settings.nbody = settings.nbody;
    const own = piece.store;
    for (let m = 0; m < count; m++) {
      const i = rows[first + m];
      for (let k = 0; k < D; k++) own.pos[m * D + k] = pos[i * D + k];
      own.mass[m] = charge[i];
      own.pinned[m] = pinned[i];
    }
    own.force.fill(0, 0, count * D);
    piece.getStage('repulsion')(own, piece);
    for (let m = 0; m < count; m++) {
      const i = rows[first + m];
      if (pinned[i]) continue;
      for (let k = 0; k < D; k++) force[i * D + k] += own.force[m * D + k];
    }
  }

  function directRepulsion({ pos, force, pinned }, charge, p) {
    const gravity = settings.gravity;
    for (let a = start[p]; a < start[p + 1]; a++) {
      const i = rows[a];
      for (let b = a + 1; b < start[p + 1]; b++) {
        const j = rows[b];
        let r2 = 0;
        for (let k = 0; k < D; k++) { d[k] = pos[j * D + k] - pos[i * D + k]; r2 += d[k] * d[k]; }
        if (r2 === 0) {
          for (let k = 0; k < D; k++) { d[k] = (random.nextDouble() - 0.5) / 50; r2 += d[k] * d[k]; }
        }
        const v = gravity * charge[i] * charge[j] / (r2 * Math.sqrt(r2));
        if (!pinned[i]) for (let k = 0; k < D; k++) force[i * D + k] += v * d[k];
        if (!pinned[j]) for (let k = 0; k < D; k++) force[j * D + k] -= v * d[k];
      }
    }
  }

  function contactAndWall(store) {
    updatePieces(store);
    if (pieceCount < 2) return;
    const { n, pos, force, pinned } = store;
    mass.fill(0); sum.fill(0); spread.fill(0); acc.fill(0); pinnedPiece.fill(0); center.fill(0);
    let totalMass = 0;
    for (let i = 0; i < n; i++) {
      const p = pieceOf[i], m = store.mass[i];
      mass[p] += m;
      totalMass += m;
      for (let k = 0; k < D; k++) {
        sum[p * D + k] += m * pos[i * D + k];
        center[k] += m * pos[i * D + k];
      }
      if (pinned[i]) pinnedPiece[p] = 1;
    }
    if (!(totalMass > 0)) return;
    for (let k = 0; k < D; k++) center[k] /= totalMass;

    if (!farPush && contact > 0) addContacts(store);
    if (wallSlack > 0) addWall(store, totalMass);

    for (let i = 0; i < n; i++) {
      const p = pieceOf[i];
      if (pinned[i] || pinnedPiece[p]) continue;
      const share = store.mass[i] / mass[p];
      for (let k = 0; k < D; k++) force[i * D + k] += share * acc[p * D + k];
    }
  }

  function averageEdgeLength({ pos }) {
    const { n, from, to } = simulator.springStore;
    let length = 0;
    for (let s = 0; s < n; s++) {
      let r2 = 0;
      for (let k = 0; k < D; k++) {
        const dk = pos[to[s] * D + k] - pos[from[s] * D + k];
        r2 += dk * dk;
      }
      length += Math.sqrt(r2);
    }
    return n ? length / n : settings.springLength;
  }

  // Contact pushes, summed per piece into acc (as forces; divided by mass when applied)
  function addContacts(store) {
    const reach = contact * averageEdgeLength(store);
    if (!(reach > 0)) return;
    const stiffness = CONTACT_STIFFNESS * settings.springCoefficient;
    const pos = store.pos;
    const grid = simulator.neighbors(reach);
    if (start[largest + 1] - start[largest] < store.n / 4) {
      // Only small pieces: every close pair once. (The grid skips pairs on the same spot, which
      // a layout of separate pieces practically never has.)
      grid.forEachPair(reach, (i, j, r) => {
        const pa = pieceOf[i], pb = pieceOf[j];
        if (pa === pb) return;
        const f = stiffness * (reach - r) / r;
        for (let k = 0; k < D; k++) {
          const dk = pos[i * D + k] - pos[j * D + k];
          acc[pa * D + k] += f * dk;
          acc[pb * D + k] -= f * dk;
        }
      });
      return;
    }
    // A big piece: only nodes outside it look for contacts, so its nodes are never walked
    // against each other. Each pair counts once: the largest piece's pairs from the other side.
    let i = 0;
    const fromOutside = (j, r) => {
      const pa = pieceOf[i], pb = pieceOf[j];
      if (pb === pa || (j <= i && pb !== largest)) return;
      if (r === 0) { pushFromSameSpot(pa, pb, reach, stiffness); return; }
      const f = stiffness * (reach - r) / r;
      for (let k = 0; k < D; k++) {
        const dk = pos[i * D + k] - pos[j * D + k];
        acc[pa * D + k] += f * dk;
        acc[pb * D + k] -= f * dk;
      }
    };
    for (i = 0; i < store.n; i++) {
      if (pieceOf[i] !== largest) grid.forEachNeighbor(i, reach, fromOutside);
    }
  }

  // Two nodes on the same spot: a random direction, as in the library. It stays r long, so the
  // push is stiffness * (reach - r), not divided by a made-up tiny r
  function pushFromSameSpot(pa, pb, reach, stiffness) {
    let r2 = 0;
    for (let k = 0; k < D; k++) { d[k] = (random.nextDouble() - 0.5) / 50; r2 += d[k] * d[k]; }
    const r = Math.sqrt(r2);
    const f = stiffness * (reach - r) / r;
    for (let k = 0; k < D; k++) {
      acc[pa * D + k] += f * d[k];
      acc[pb * D + k] -= f * d[k];
    }
  }

  // The v4 wall: pieces sticking out of a ball around everyone are pulled back in
  function addWall(store, totalMass) {
    const { n, pos } = store;
    let L = settings.springLength;
    let strength = Math.abs(settings.gravity) * (totalMass / n) / (L * L);
    if (!(L > 0) || !Number.isFinite(strength)) {
      // spring length 0 (the panel passes through 0 while "0.5" is typed) or tiny:
      // measure the wall in average edge lengths instead, or skip it if there are no edges
      L = averageEdgeLength(store);
      strength = Math.abs(settings.gravity) * (totalMass / n) / (L * L);
      if (!(L > 0) || !Number.isFinite(strength)) return;
    }
    for (let i = 0; i < n; i++) {
      const p = pieceOf[i];
      let q2 = 0;
      for (let k = 0; k < D; k++) {
        const q = pos[i * D + k] - sum[p * D + k] / mass[p];
        q2 += q * q;
      }
      spread[p] += store.mass[i] * q2;
    }
    let volume = 0;
    for (let p = 0; p < pieceCount; p++) {
      spread[p] = Math.sqrt((D + 2) / D * spread[p] / mass[p]); // radius of a ball with the same spread
      let size = 1;
      for (let k = 0; k < D; k++) size *= spread[p] + L / 2;
      volume += size;
    }
    const wallRadius = wallSlack * Math.pow(volume, 1 / D);
    pull.fill(0);
    for (let p = 0; p < pieceCount; p++) {
      let dist = 0;
      for (let k = 0; k < D; k++) {
        const t = center[k] - sum[p * D + k] / mass[p];
        dist += t * t;
      }
      dist = Math.sqrt(dist);
      const out = dist + spread[p] - wallRadius;
      if (out <= 0 || dist === 0 || pinnedPiece[p]) continue;
      const scale = mass[p] * strength * Math.min(1, out / L) / dist;
      for (let k = 0; k < D; k++) {
        const t = scale * (center[k] - sum[p * D + k] / mass[p]);
        acc[p * D + k] += t;
        pull[k] += t;
      }
    }
    // pair the pull: every piece gives back its share, so the pull can't move the whole picture
    for (let p = 0; p < pieceCount; p++) {
      for (let k = 0; k < D; k++) acc[p * D + k] -= mass[p] * pull[k] / totalMass;
    }
  }
}
