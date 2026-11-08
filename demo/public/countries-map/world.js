// Turns a graph of countries into a map where
//   1. linked countries share a border,
//   2. countries that are not linked never touch,
//   3. every country's land area is proportional to its population.
//
// How (each step keeps the rules true, so the result is correct by construction and the page
// checks it again at the end):
//   - Planar layout. Rules 1 and 2 need a planar drawing of the graph. When the graph is not
//     planar we keep as many links as a planar drawing allows; every other link becomes an
//     exclave: a small detached piece of the smaller country inside the bigger one.
//   - Regions. Every country becomes the region around its node: a border crosses each link at
//     its middle, three borders meet inside each triangular face, and every longer face holds a
//     lake, so countries around it that are not linked stay apart. The outer face is the sea.
//   - First drawing: Tutte's barycentric embedding of that subdivision (coast on a circle),
//     which has no overlaps by construction.
//   - Areas. Borders then move like soap films: a country pushes outwards while it is smaller
//     than its population says and inwards while it is bigger. A vertex never moves more than
//     half the gap to the nearest other boundary, so no two boundaries ever cross, and no
//     border or coast shrinks below a visible length, so no contact appears or disappears.
//   - Coasts and borders get a hand-drawn wobble, then the areas are fitted once more.

const OCEAN = -1;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function() {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------------------------------------------------------------------------------------------
// Faces of a planar embedding. rotation[v] lists v's neighbours counter-clockwise. The face on
// the left of half-edge u->v continues with v->w, where w comes right before u in rotation[v].
export function tracedFaces(rotation) {
  let seen = new Set();
  let faces = [];
  let position = rotation.map(list => {
    let at = new Map();
    list.forEach((w, i) => at.set(w, i));
    return at;
  });
  for (let u = 0; u < rotation.length; ++u) {
    for (let v of rotation[u]) {
      let key = u + ',' + v;
      if (seen.has(key)) continue;
      let face = [];
      let a = u, b = v;
      while (!seen.has(a + ',' + b)) {
        seen.add(a + ',' + b);
        face.push([a, b]);
        let list = rotation[b];
        let i = position[b].get(a);
        let w = list[(i - 1 + list.length) % list.length];
        a = b; b = w;
      }
      faces.push(face);
    }
  }
  return faces;
}

// ---------------------------------------------------------------------------------------------
// A planar graph usually has many embeddings, and they make very different maps. A tree of
// countries hanging off a cut vertex (a peninsula) may be embedded inside some inner face, so it
// would end up in a lake, crushed between its neighbours. This picks the embedding block by
// block: the biggest block keeps its largest face as the sea, and every other block is put into
// the sea at its cut vertex, with its own largest face merged into it.
// Returns the new rotation and a half-edge [a, b] with the sea on its left.
function seaFacingEmbedding(n, rotation, weightOf = () => 1) {
  // biconnected components (edge sets) and articulation points, iterative DFS
  let index = new Int32Array(n).fill(-1), low = new Int32Array(n);
  let blocks = [], edgeStack = [], counter = 0;
  for (let root = 0; root < n; ++root) {
    if (index[root] >= 0 || !rotation[root].length) continue;
    index[root] = low[root] = counter++;
    let stack = [[root, -1, 0]];
    while (stack.length) {
      let top = stack[stack.length - 1];
      let [v, parent] = top;
      if (top[2] < rotation[v].length) {
        let w = rotation[v][top[2]++];
        if (index[w] < 0) {
          edgeStack.push([v, w]);
          index[w] = low[w] = counter++;
          stack.push([w, v, 0]);
        } else if (w !== parent && index[w] < index[v]) {
          edgeStack.push([v, w]);
          low[v] = Math.min(low[v], index[w]);
        }
      } else {
        stack.pop();
        if (parent >= 0) {
          low[parent] = Math.min(low[parent], low[v]);
          if (low[v] >= index[parent]) {
            let block = [];
            let e;
            do { e = edgeStack.pop(); block.push(e); } while (!(e[0] === parent && e[1] === v));
            blocks.push(block);
          }
        }
      }
    }
  }
  if (!blocks.length) return {rotation, sea: null, pockets: []};
  // each block's own rotation: the global one restricted to the block's edges
  let blockRotation = blocks.map(block => {
    let inBlock = new Map();
    block.forEach(([a, b]) => {
      if (!inBlock.has(a)) inBlock.set(a, new Set());
      if (!inBlock.has(b)) inBlock.set(b, new Set());
      inBlock.get(a).add(b); inBlock.get(b).add(a);
    });
    let rot = new Map();
    inBlock.forEach((set, v) => rot.set(v, rotation[v].filter(w => set.has(w))));
    return rot;
  });
  let facesOfBlock = rot => {
    let seen = new Set(), faces = [];
    rot.forEach((list, u) => list.forEach(v => {
      if (seen.has(u + ',' + v)) return;
      let face = [], a = u, b = v;
      while (!seen.has(a + ',' + b)) {
        seen.add(a + ',' + b);
        face.push([a, b]);
        let l = rot.get(b);
        let w = l[(l.indexOf(a) - 1 + l.length) % l.length];
        a = b; b = w;
      }
      faces.push(face);
    }));
    return faces;
  };
  let size = face => new Set(face.map(h => h[0])).size * 1000 + face.length;

  // block-cut tree walk from the biggest block
  let order = blocks.map((b, i) => i).sort((a, b) => blocks[b].length - blocks[a].length);
  let merged = rotation.map(() => []);
  let placed = new Set(), done = new Uint8Array(blocks.length);
  let blocksAt = rotation.map(() => []);
  blocks.forEach((block, i) => {
    let vs = new Set();
    block.forEach(([a, b]) => { vs.add(a); vs.add(b); });
    vs.forEach(v => blocksAt[v].push(i));
  });
  let first = order[0];
  let firstFaces = facesOfBlock(blockRotation[first]);
  // how much land hangs off each point of the first block through other blocks: a face that
  // carries big hanging pieces (peninsulas, island chains) makes a better sea, since they then
  // hang into open water instead of filling a pocket inside the continent
  let hang = new Float64Array(n);
  {
    let inFirst = new Set();
    blocks[first].forEach(([a, b]) => { inFirst.add(a); inFirst.add(b); });
    let seenBlock = new Uint8Array(blocks.length);
    seenBlock[first] = 1;
    inFirst.forEach(root => {
      let total = 0;
      let stack = blocksAt[root].filter(b => !seenBlock[b]);
      stack.forEach(b => { seenBlock[b] = 1; });
      let seenVertex = new Set([root]);
      while (stack.length) {
        let b = stack.pop();
        blocks[b].forEach(e => e.forEach(v => {
          if (seenVertex.has(v)) return;
          seenVertex.add(v);
          total += weightOf(v);
          blocksAt[v].forEach(c => { if (!seenBlock[c]) { seenBlock[c] = 1; stack.push(c); } });
        }));
      }
      hang[root] = total;
    });
  }
  let landTotal = 0;
  for (let v = 0; v < n; ++v) landTotal += weightOf(v);
  let seaScore = face => {
    let vs = new Set(face.map(h => h[0]));
    let hanging = 0;
    vs.forEach(v => { hanging += hang[v]; });
    return vs.size + 200 * hanging / landTotal;
  };
  let seaFace = firstFaces.reduce((best, f) => seaScore(f) > seaScore(best) ? f : best);
  let sea = seaFace[0].slice();
  blockRotation[first].forEach((list, v) => { merged[v] = list.slice(); placed.add(v); });
  done[first] = 1;
  // the merged map's faces, recomputed lazily: a face lookup per half-edge
  let faceOf = () => {
    let id = new Map();
    let rot = new Map();
    merged.forEach((list, v) => { if (list.length) rot.set(v, list); });
    facesOfBlock(rot).forEach((face, i) => face.forEach(h => id.set(h[0] + ',' + h[1], {i, face})));
    return id;
  };
  let pockets = [];
  let queue = [first];
  while (queue.length) {
    let current = queue.shift();
    let vs = new Set();
    blocks[current].forEach(([a, b]) => { vs.add(a); vs.add(b); });
    vs.forEach(v => blocksAt[v].forEach(child => {
      if (done[child]) return;
      done[child] = 1;
      queue.push(child);
      let rot = blockRotation[child];
      // the child's largest face at v becomes part of the sea (or of the largest face at v)
      let faces = facesOfBlock(rot).filter(face => face.some(h => h[1] === v));
      let own = faces.reduce((best, f) => size(f) > size(best) ? f : best);
      let into = own.find(h => h[1] === v);            // b_i -> v on the child's chosen face
      let list = rot.get(v);
      let start = list.indexOf(into[0]);
      let inserted = [];
      for (let k = 0; k < list.length; ++k) inserted.push(list[(start + k) % list.length]);
      // the corner at v to put it in: on the sea if v is on it, else in v's largest face
      let lookup = faceOf();
      let seaId = lookup.get(sea[0] + ',' + sea[1]).i;
      let at = merged[v];
      let corner = -1, best = -Infinity, onSea = false;
      at.forEach((u, k) => {
        let f = lookup.get(u + ',' + v);
        let score = (f.i === seaId ? 1e9 : 0) + size(f.face);
        if (score > best) { best = score; corner = k; onSea = f.i === seaId; }
      });
      // a piece that has to hang into an inner face ends up in a pocket of the continent
      if (!onSea) pockets.push({at: v, links: list.slice()});
      // corner k: incoming u -> v with u = at[k]; insert between w = at[k - 1] and u
      merged[v] = at.slice(0, corner).concat(inserted, at.slice(corner));
      rot.forEach((l, w) => { if (w !== v) { merged[w] = l.slice(); placed.add(w); } });
    }));
  }
  return {rotation: merged, sea, pockets};
}

// ---------------------------------------------------------------------------------------------
// Foam: the map as boundary segments. Every segment a->b knows the face on its left and on its
// right (a country piece, a lake, or OCEAN). Faces are {owner, kind, target, bias}.
function createFoam() {
  return {x: [], y: [], segs: [], inc: [], faces: []};
}

function addPoint(foam, x, y) {
  foam.x.push(x); foam.y.push(y); foam.inc.push([]);
  return foam.x.length - 1;
}

function addSeg(foam, a, b, l, r) {
  foam.segs.push({a, b, l, r, dead: false});
  let id = foam.segs.length - 1;
  foam.inc[a].push(id); foam.inc[b].push(id);
  return id;
}

function dropSeg(foam, id) {
  let s = foam.segs[id];
  s.dead = true;
  for (let v of [s.a, s.b]) {
    let list = foam.inc[v];
    list.splice(list.indexOf(id), 1);
  }
}

// Polygons (point ids, CCW, face on the left) -> segments with left and right faces
function addPolygons(foam, polygons, pointOf) {
  let byKey = new Map();
  polygons.forEach(({ring, face}) => ring.forEach((p, i) => {
    let a = pointOf(p), b = pointOf(ring[(i + 1) % ring.length]);
    let key = a < b ? a + ',' + b : b + ',' + a;
    let known = byKey.get(key);
    if (known === undefined) byKey.set(key, addSeg(foam, a, b, face, OCEAN));
    else {
      let s = foam.segs[known];
      if (s.a !== b || s.r !== OCEAN) throw new Error('Segment shared the wrong way');
      s.r = face;
    }
  }));
}

function faceAreas(foam) {
  let area = new Float64Array(foam.faces.length);
  let {x, y, segs} = foam;
  for (let i = 0; i < segs.length; ++i) {
    let s = segs[i];
    if (s.dead) continue;
    let c = 0.5 * (x[s.a] * y[s.b] - x[s.b] * y[s.a]);
    if (s.l >= 0) area[s.l] += c;
    if (s.r >= 0) area[s.r] -= c;
  }
  return area;
}

function targetOf(foam, f) {
  return f >= 0 && foam.faces[f].kind === 'land' ? foam.faces[f].target : Infinity;
}

// Boundary arcs: runs of segments between junctions (points where three or more segments meet).
// A closed run with no junction (an exclave's coast) is a ring.
function arcsOf(foam) {
  let used = new Uint8Array(foam.segs.length);
  let arcs = [];
  let walk = (start, first) => {
    let points = [start], segs = [];
    let v = start, id = first;
    while (true) {
      used[id] = 1;
      segs.push(id);
      let s = foam.segs[id];
      v = s.a === v ? s.b : s.a;
      points.push(v);
      if (foam.inc[v].length !== 2 || v === start) break;
      let list = foam.inc[v];
      id = list[0] === id ? list[1] : list[0];
    }
    let s0 = foam.segs[segs[0]];
    let forward = s0.a === start;
    return {points, segs, l: forward ? s0.l : s0.r, r: forward ? s0.r : s0.l,
      ring: points[0] === points[points.length - 1] && foam.inc[start].length === 2};
  };
  foam.inc.forEach((list, v) => {
    if (list.length === 2 || list.length === 0) return;
    list.forEach(id => { if (!used[id]) arcs.push(walk(v, id)); });
  });
  foam.segs.forEach((s, id) => { if (!s.dead && !used[id]) arcs.push(walk(s.a, id)); });
  return arcs;
}

// Uniform grid over segment bounding boxes, for "what is near this segment" questions.
function segmentGrid(foam, cell) {
  let {x, y} = foam;
  let cells = new Map();
  let key = (i, j) => (i + 1048576) * 2097152 + (j + 1048576);
  foam.segs.forEach((s, id) => {
    if (s.dead) return;
    let i0 = Math.floor(Math.min(x[s.a], x[s.b]) / cell), i1 = Math.floor(Math.max(x[s.a], x[s.b]) / cell);
    let j0 = Math.floor(Math.min(y[s.a], y[s.b]) / cell), j1 = Math.floor(Math.max(y[s.a], y[s.b]) / cell);
    for (let i = i0; i <= i1; ++i) for (let j = j0; j <= j1; ++j) {
      let k = key(i, j);
      let list = cells.get(k);
      if (list) list.push(id); else cells.set(k, [id]);
    }
  });
  let stamp = new Uint32Array(foam.segs.length), round = 0;
  return function near(x0, y0, x1, y1, visit) {
    round += 1;
    let i0 = Math.floor(x0 / cell), i1 = Math.floor(x1 / cell);
    let j0 = Math.floor(y0 / cell), j1 = Math.floor(y1 / cell);
    if ((i1 - i0 + 1) * (j1 - j0 + 1) > 1e6) throw new Error('Query too wide');
    for (let i = i0; i <= i1; ++i) for (let j = j0; j <= j1; ++j) {
      let list = cells.get(key(i, j));
      if (!list) continue;
      for (let k = 0; k < list.length; ++k) {
        let id = list[k];
        if (stamp[id] === round) continue;
        stamp[id] = round;
        visit(id);
      }
    }
  };
}

function pointSegment(px, py, ax, ay, bx, by) {
  let dx = bx - ax, dy = by - ay;
  let len = dx * dx + dy * dy;
  let t = len > 0 ? ((px - ax) * dx + (py - ay) * dy) / len : 0;
  t = t < 0 ? 0 : t > 1 ? 1 : t;
  let ex = ax + t * dx - px, ey = ay + t * dy - py;
  return Math.sqrt(ex * ex + ey * ey);
}

function orient(ax, ay, bx, by, cx, cy) {
  return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}

function segmentsCross(ax, ay, bx, by, cx, cy, dx, dy) {
  let o1 = orient(ax, ay, bx, by, cx, cy), o2 = orient(ax, ay, bx, by, dx, dy);
  let o3 = orient(cx, cy, dx, dy, ax, ay), o4 = orient(cx, cy, dx, dy, bx, by);
  return ((o1 > 0) !== (o2 > 0)) && ((o3 > 0) !== (o4 > 0)) && o1 !== 0 && o2 !== 0 && o3 !== 0 && o4 !== 0;
}

function segmentDistance(foam, s, t) {
  let {x, y} = foam;
  let ax = x[s.a], ay = y[s.a], bx = x[s.b], by = y[s.b];
  let cx = x[t.a], cy = y[t.a], dx = x[t.b], dy = y[t.b];
  if (segmentsCross(ax, ay, bx, by, cx, cy, dx, dy)) return 0;
  return Math.min(pointSegment(ax, ay, cx, cy, dx, dy), pointSegment(bx, by, cx, cy, dx, dy),
    pointSegment(cx, cy, ax, ay, bx, by), pointSegment(dx, dy, ax, ay, bx, by));
}

function sharesPoint(s, t) {
  return s.a === t.a || s.a === t.b || s.b === t.a || s.b === t.b;
}

function segLength(foam, s) {
  return Math.hypot(foam.x[s.b] - foam.x[s.a], foam.y[s.b] - foam.y[s.a]);
}

function typicalCell(foam) {
  let lengths = [];
  let step = Math.max(1, Math.floor(foam.segs.length / 400));
  for (let i = 0; i < foam.segs.length; i += step) {
    let s = foam.segs[i];
    if (!s.dead) lengths.push(segLength(foam, s));
  }
  lengths.sort((a, b) => a - b);
  return Math.max(lengths[Math.floor(lengths.length * 0.7)] * 2, 1e-12);
}

// Collisions. For every pair of nearby segments that share no point, both sides may approach
// each other by at most 0.45 of their gap before the gaps are measured again, so together
// they never close it; moving along each other is free. These limits are a fast filter: after
// each step every new crossing is found exactly and the points involved go back to where they
// were, so no two boundaries ever cross (each step is also short next to the segments
// involved, so nothing can jump across a boundary in one go).
function closestPoints(foam, s, t) {
  let {x, y} = foam;
  let best = null;
  let tryPair = (px, py, ax, ay, bx, by, flip) => {
    let dx = bx - ax, dy = by - ay, len = dx * dx + dy * dy;
    let u = len > 0 ? Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / len)) : 0;
    let qx = ax + u * dx, qy = ay + u * dy;
    let d = Math.hypot(px - qx, py - qy);
    if (!best || d < best.d) best = flip ? {d, sx: qx, sy: qy, tx: px, ty: py} : {d, sx: px, sy: py, tx: qx, ty: qy};
  };
  tryPair(x[s.a], y[s.a], x[t.a], y[t.a], x[t.b], y[t.b], false);
  tryPair(x[s.b], y[s.b], x[t.a], y[t.a], x[t.b], y[t.b], false);
  tryPair(x[t.a], y[t.a], x[s.a], y[s.a], x[s.b], y[s.b], true);
  tryPair(x[t.b], y[t.b], x[s.a], y[s.a], x[s.b], y[s.b], true);
  return best;
}

function measureGaps(foam, reachOf) {
  let {x, y, segs} = foam;
  let count = x.length;
  let limits = [];
  for (let v = 0; v < count; ++v) limits.push([]);
  let add = (v, nx, ny, c) => {
    let list = limits[v];
    if (list.length < 8) { list.push([nx, ny, c]); return; }
    let worst = 0;
    for (let k = 1; k < list.length; ++k) if (list[k][2] > list[worst][2]) worst = k;
    if (c < list[worst][2]) list[worst] = [nx, ny, c];
  };
  let near = segmentGrid(foam, typicalCell(foam));
  segs.forEach((s, id) => {
    if (s.dead) return;
    let reach = Math.max(reachOf(s.a), reachOf(s.b), 0.5 * segLength(foam, s));
    near(Math.min(x[s.a], x[s.b]) - reach, Math.min(y[s.a], y[s.b]) - reach,
      Math.max(x[s.a], x[s.b]) + reach, Math.max(y[s.a], y[s.b]) + reach, other => {
        if (other <= id) return;           // each pair once
        let t = segs[other];
        if (t.dead || sharesPoint(s, t)) return;
        let c = closestPoints(foam, s, t);
        if (!(c.d > 0) || c.d > reach) return;
        let nx = (c.sx - c.tx) / c.d, ny = (c.sy - c.ty) / c.d;     // from t towards s
        // never closer than a tenth of the shorter segment: gaps stay open and visible
        let keep = 0.1 * Math.min(segLength(foam, s), segLength(foam, t));
        let room = 0.45 * Math.max(0, c.d - keep);
        add(s.a, nx, ny, room); add(s.b, nx, ny, room);
        add(t.a, -nx, -ny, room); add(t.b, -nx, -ny, room);
      });
  });
  foam.limits = limits;
  foam.travelX = new Float64Array(count);
  foam.travelY = new Float64Array(count);
  foam.budget = true;
  foam.budgetAge = 0;
}

function moveSafely(foam, mx, my) {
  let {segs, inc} = foam;
  let count = foam.x.length;
  if (!foam.budget || !foam.limits || foam.limits.length !== count || foam.budgetAge >= 6) {
    // look only as far as a point can go before the next measurement: a few of its segments
    measureGaps(foam, v => {
      let longest = 0;
      for (let id of inc[v]) longest = Math.max(longest, segLength(foam, segs[id]));
      return Math.min(8 * Math.hypot(mx[v], my[v]), 2 * longest);
    });
  }
  let {x, y, limits, travelX, travelY} = foam;
  let ox = Float64Array.from(x), oy = Float64Array.from(y);
  let moved = [];
  let clipped = false;
  for (let v = 0; v < count; ++v) {
    let dx = mx[v], dy = my[v];
    let len = Math.hypot(dx, dy);
    if (!(len > 0)) continue;
    // short next to its own segments
    let cap = Infinity;
    let list = inc[v];
    for (let k = 0; k < list.length; ++k) cap = Math.min(cap, 0.3 * segLength(foam, segs[list[k]]));
    if (len > cap) { dx *= cap / len; dy *= cap / len; }
    // and never closer to a nearby boundary than its share of the gap
    let lim = limits[v];
    for (let pass = 0; pass < 3; ++pass) {
      for (let k = 0; k < lim.length; ++k) {
        let [nx, ny, c] = lim[k];
        let toward = (travelX[v] + dx) * nx + (travelY[v] + dy) * ny;
        if (toward < -c) { let fix = -c - toward; dx += fix * nx; dy += fix * ny; clipped = true; }
      }
    }
    let ok = true;
    for (let k = 0; k < lim.length; ++k) {
      let [nx, ny, c] = lim[k];
      if ((travelX[v] + dx) * nx + (travelY[v] + dy) * ny < -c * 1.0000001) { ok = false; break; }
    }
    if (!ok) continue;
    x[v] += dx; y[v] += dy;
    travelX[v] += dx; travelY[v] += dy;
    moved.push(v);
  }
  // exact check: any crossing sends its points back
  if (moved.length) {
    let cell = typicalCell(foam);
    let clean = false;
    for (let round = 0; round < 20 && !clean; ++round) {
      let near = segmentGrid(foam, cell);
      let back = new Set();
      let touched = new Uint8Array(segs.length);
      moved.forEach(v => inc[v].forEach(id => { touched[id] = 1; }));
      segs.forEach((s, id) => {
        if (s.dead || !touched[id]) return;
        near(Math.min(x[s.a], x[s.b]), Math.min(y[s.a], y[s.b]), Math.max(x[s.a], x[s.b]), Math.max(y[s.a], y[s.b]), other => {
          if (other === id) return;
          let t = segs[other];
          if (t.dead || sharesPoint(s, t)) return;
          if (segmentsCross(x[s.a], y[s.a], x[s.b], y[s.b], x[t.a], y[t.a], x[t.b], y[t.b]) || touches(foam, s, t)) {
            for (let v of [s.a, s.b, t.a, t.b]) if (x[v] !== ox[v] || y[v] !== oy[v]) back.add(v);
          }
        });
      });
      // and no boundary may fold back on itself at a point (two of its segments lying on top
      // of each other there): that is a spike of no width, a contact in all but name
      let check = new Set();
      moved.forEach(v => { check.add(v); inc[v].forEach(id => { check.add(segs[id].a); check.add(segs[id].b); }); });
      check.forEach(v => {
        let list = inc[v];
        for (let i = 0; i < list.length; ++i) {
          let s1 = segs[list[i]], a = s1.a === v ? s1.b : s1.a;
          let ax = x[a] - x[v], ay = y[a] - y[v], al = Math.hypot(ax, ay);
          for (let j = i + 1; j < list.length; ++j) {
            let s2 = segs[list[j]], b = s2.a === v ? s2.b : s2.a;
            let bx = x[b] - x[v], by = y[b] - y[v], bl = Math.hypot(bx, by);
            let now = (ax * bx + ay * by) / (al * bl);
            if (!(now > 0.9995)) continue;
            // a fold may get wider, never sharper
            let pax = ox[a] - ox[v], pay = oy[a] - oy[v], pbx = ox[b] - ox[v], pby = oy[b] - oy[v];
            let was = (pax * pbx + pay * pby) / (Math.hypot(pax, pay) * Math.hypot(pbx, pby));
            if (now > was) for (let w of [v, a, b]) if (x[w] !== ox[w] || y[w] !== oy[w]) back.add(w);
          }
        }
      });
      if (!back.size) { clean = true; break; }
      back.forEach(v => {
        travelX[v] -= x[v] - ox[v]; travelY[v] -= y[v] - oy[v];
        x[v] = ox[v]; y[v] = oy[v];
      });
      clipped = true;
    }
    if (!clean) {
      for (let v = 0; v < count; ++v) {
        travelX[v] -= x[v] - ox[v]; travelY[v] -= y[v] - oy[v];
        x[v] = ox[v]; y[v] = oy[v];
      }
    }
  }
  foam.budgetAge += clipped ? 3 : 1;
}

// an end of one segment lying exactly on the other (crossing tests miss it)
function touches(foam, s, t) {
  let {x, y} = foam;
  let on = (p, a, b) => orient(x[a], y[a], x[b], y[b], x[p], y[p]) === 0 &&
    Math.min(x[a], x[b]) <= x[p] && x[p] <= Math.max(x[a], x[b]) &&
    Math.min(y[a], y[b]) <= y[p] && y[p] <= Math.max(y[a], y[b]);
  return on(s.a, t.a, t.b) || on(s.b, t.a, t.b) || on(t.a, s.a, s.b) || on(t.b, s.a, s.b);
}

// Keep segments near their wanted length h (split long ones, merge short ones), never letting a
// merge cut across another boundary.
function resample(foam, spacing) {
  let {x, y, segs, inc} = foam;
  // spacing follows each country's size: its target, or its current area while it is bigger
  let area = faceAreas(foam);
  // spacing follows each country's current size (fine while it is small, coarse while big);
  // a long thin country counts by its length, so its few long segments can retract quickly
  let perimeter = new Float64Array(foam.faces.length);
  segs.forEach(s => {
    if (s.dead) return;
    let len = segLength(foam, s);
    if (s.l >= 0) perimeter[s.l] += len;
    if (s.r >= 0) perimeter[s.r] += len;
  });
  let sizeOf = f => f >= 0 && foam.faces[f].kind === 'land' ?
    Math.max(area[f], (perimeter[f] / 8) ** 2, 1e-12) : Infinity;
  let want = s => spacing * Math.sqrt(Math.min(sizeOf(s.l), sizeOf(s.r)));
  // split
  for (let id = 0; id < segs.length; ++id) {
    let s = segs[id];
    if (s.dead) continue;
    let len = segLength(foam, s), h = want(s);
    if (len <= 1.6 * h) continue;
    let parts = Math.min(64, Math.ceil(len / h));
    let {a, b, l, r} = s;
    dropSeg(foam, id);
    let prev = a;
    for (let k = 1; k < parts; ++k) {
      let t = k / parts;
      let p = addPoint(foam, x[a] + (x[b] - x[a]) * t, y[a] + (y[b] - y[a]) * t);
      addSeg(foam, prev, p, l, r);
      prev = p;
    }
    addSeg(foam, prev, b, l, r);
  }
  // merge: drop a point that sits between two short segments of the same run
  let near = segmentGrid(foam, typicalCell(foam));
  let arcs = arcsOf(foam);
  let keep = new Uint8Array(x.length);
  let added = [];
  arcs.forEach(arc => {
    // an arc keeps at least two segments, a ring at least six
    let min = arc.ring ? 6 : 2;
    arc.alive = arc.segs.length;
    arc.min = min;
  });
  arcs.forEach(arc => {
    for (let k = 1; k < arc.points.length - 1; ++k) {
      if (arc.alive <= arc.min) break;
      let b = arc.points[k];
      if (keep[b] || inc[b].length !== 2) continue;
      let [s1, s2] = inc[b].map(id => segs[id]);
      let a = s1.a === b ? s1.b : s1.a, c = s2.a === b ? s2.b : s2.a;
      if (a === c) continue;
      let h = want(s1);
      if (segLength(foam, s1) + segLength(foam, s2) > 0.8 * h) continue;
      // nothing else may cross the triangle a, b, c
      let x0 = Math.min(x[a], x[b], x[c]), x1 = Math.max(x[a], x[b], x[c]);
      let y0 = Math.min(y[a], y[b], y[c]), y1 = Math.max(y[a], y[b], y[c]);
      let blocked = false;
      let test = id => {
        if (blocked) return;
        let t = segs[id];
        if (t.dead || t === s1 || t === s2) return;
        if (t.a === a && t.b === c || t.a === c && t.b === a) { blocked = true; return; }
        if (crossesTriangle(foam, t, a, b, c)) blocked = true;
      };
      near(x0, y0, x1, y1, test);
      // the index predates this pass's own shortcuts: check those too
      for (let k = 0; k < added.length && !blocked; ++k) test(added[k]);
      // and the shortcut must not fold back onto a neighbouring segment at either end
      for (let [p, q] of [[a, c], [c, a]]) {
        if (blocked) break;
        let ux = x[q] - x[p], uy = y[q] - y[p], ul = Math.hypot(ux, uy);
        inc[p].forEach(id => {
          let t = segs[id];
          if (t === s1 || t === s2 || blocked) return;
          let o = t.a === p ? t.b : t.a;
          let vx = x[o] - x[p], vy = y[o] - y[p];
          if (ux * vx + uy * vy > 0.9995 * ul * Math.hypot(vx, vy)) blocked = true;
        });
      }
      if (blocked) continue;
      let l = s1.a === a ? s1.l : s1.r, r = s1.a === a ? s1.r : s1.l;
      dropSeg(foam, inc[b][0]);
      dropSeg(foam, inc[b][0]);
      added.push(addSeg(foam, a, c, l, r));
      keep[a] = keep[c] = 1;
      arc.alive -= 1;
    }
  });
  compact(foam);
}

function crossesTriangle(foam, t, a, b, c) {
  let {x, y} = foam;
  let inside = p => {
    if (p === a || p === b || p === c) return false;
    let o1 = orient(x[a], y[a], x[b], y[b], x[p], y[p]);
    let o2 = orient(x[b], y[b], x[c], y[c], x[p], y[p]);
    let o3 = orient(x[c], y[c], x[a], y[a], x[p], y[p]);
    return (o1 >= 0 && o2 >= 0 && o3 >= 0) || (o1 <= 0 && o2 <= 0 && o3 <= 0);
  };
  if (inside(t.a) || inside(t.b)) return true;
  let edge = (p, q) => {
    if (t.a === p || t.a === q || t.b === p || t.b === q) return false;
    return segmentsCross(x[t.a], y[t.a], x[t.b], y[t.b], x[p], y[p], x[q], y[q]) ||
      pointSegment(x[t.a], y[t.a], x[p], y[p], x[q], y[q]) === 0 ||
      pointSegment(x[t.b], y[t.b], x[p], y[p], x[q], y[q]) === 0;
  };
  return edge(a, c) || edge(a, b) || edge(b, c);
}

// Drop dead segments and unused points, renumbering everything
function compact(foam) {
  let used = new Int32Array(foam.x.length).fill(-1);
  let x = [], y = [];
  foam.segs.forEach(s => {
    if (s.dead) return;
    for (let v of [s.a, s.b]) if (used[v] < 0) { used[v] = x.length; x.push(foam.x[v]); y.push(foam.y[v]); }
  });
  let segs = [];
  foam.segs.forEach(s => { if (!s.dead) segs.push({a: used[s.a], b: used[s.b], l: s.l, r: s.r, dead: false}); });
  foam.x = x; foam.y = y; foam.segs = segs;
  foam.budget = null;
  foam.limits = null;
  foam.inc = x.map(() => []);
  segs.forEach((s, id) => { foam.inc[s.a].push(id); foam.inc[s.b].push(id); });
}

// Pressure-driven relaxation. Each face pushes out while smaller than its target and in while
// bigger; tension smooths boundaries; no boundary run may get shorter than its visible minimum.
function relax(foam, options) {
  let {iterations, tension = 0.2, junctionTension = 0.3, gain = 0.6, integral = 0,
    spacing = 0.15, tolerance = 0, resampleEvery = 5, shortest = 0.2, retract = 0} = options;
  let arcs = null;
  let error = Infinity;
  for (let it = 0; it < iterations; ++it) {
    if (it % resampleEvery === 0 || !arcs) {
      resample(foam, spacing);
      arcs = arcsOf(foam);
    }
    let {x, y, segs, inc, faces} = foam;
    let area = faceAreas(foam);
    let pressure = new Float64Array(faces.length);
    error = 0;
    faces.forEach((face, f) => {
      let ratio = area[f] > 0 ? Math.log(face.target / area[f]) : 2;
      if (face.kind === 'land') {
        error = Math.max(error, Math.abs(ratio));
        if (integral) face.bias = Math.max(-1, Math.min(1, face.bias + integral * ratio));
        pressure[f] = Math.max(-3, Math.min(3, ratio)) + face.bias;
      } else {
        // a lake gives way to the land around it until it is down to a third of its size, then
        // holds that much water, so countries on its shore can always reach their size
        let floor = Math.log(0.3 * face.target / Math.max(area[f], 1e-300));
        pressure[f] = floor > 0 ? Math.min(3, floor) : 0;
      }
    });
    if (error < tolerance) { foam.lastIterations = it; break; }
    foam.lastIterations = it + 1;
    let count = x.length;
    let mx = new Float64Array(count), my = new Float64Array(count);
    // Each face wants its boundary moved out by the distance that would fix its area,
    // (ln target/area) * area / perimeter; a boundary between two faces moves by the
    // difference, damped because both sides adjust.
    let perimeter = new Float64Array(faces.length);
    for (let i = 0; i < segs.length; ++i) {
      let s = segs[i];
      let len = Math.hypot(x[s.b] - x[s.a], y[s.b] - y[s.a]);
      if (s.l >= 0) perimeter[s.l] += len;
      if (s.r >= 0) perimeter[s.r] += len;
    }
    // reach: how far a face's boundary may move in one go, about the distance that would fix
    // its area; a thin face still gets a tenth of its size
    let reach = new Float64Array(faces.length);
    for (let f = 0; f < faces.length; ++f) {
      let a = Math.max(area[f], 0);
      reach[f] = perimeter[f] > 0 ? Math.max(a / perimeter[f], 0.1 * Math.sqrt(a)) : 0;
    }
    // a stretched-out country (perimeter far beyond a disc's) is drawn in towards its middle,
    // which retracts long thin arms and slivers that pressure and smoothing alone keep
    let cx = new Float64Array(faces.length), cy = new Float64Array(faces.length), cw = new Float64Array(faces.length);
    for (let i = 0; i < segs.length; ++i) {
      let s = segs[i];
      let len = Math.hypot(x[s.b] - x[s.a], y[s.b] - y[s.a]);
      for (let f of [s.l, s.r]) {
        if (f < 0) continue;
        cx[f] += len * (x[s.a] + x[s.b]) / 2; cy[f] += len * (y[s.a] + y[s.b]) / 2; cw[f] += len;
      }
    }
    let squeeze = new Float64Array(faces.length);
    for (let f = 0; f < faces.length; ++f) {
      if (faces[f].kind !== 'land' || !(area[f] > 0) || !cw[f]) continue;
      cx[f] /= cw[f]; cy[f] /= cw[f];
      let stretch = perimeter[f] * perimeter[f] / (4 * Math.PI * area[f]);
      squeeze[f] = stretch > 4 ? retract * Math.min(1, (stretch - 4) / 20) : 0;
    }
    for (let i = 0; i < segs.length; ++i) {
      let s = segs[i];
      let len = Math.hypot(x[s.b] - x[s.a], y[s.b] - y[s.a]);
      for (let f of [s.l, s.r]) {
        if (f < 0 || !squeeze[f]) continue;
        for (let v of [s.a, s.b]) {
          let dx = cx[f] - x[v], dy = cy[f] - y[v], d = Math.hypot(dx, dy) || 1;
          mx[v] += 0.1 * squeeze[f] * len * dx / d;
          my[v] += 0.1 * squeeze[f] * len * dy / d;
        }
      }
    }
    for (let i = 0; i < segs.length; ++i) {
      let s = segs[i];
      // the pressure difference decides the direction; the smaller face sets the scale, so a big
      // country never bulldozes a small one that also needs room
      let scale = Math.min(s.l >= 0 ? reach[s.l] : Infinity, s.r >= 0 ? reach[s.r] : Infinity);
      let dp = ((s.l >= 0 ? pressure[s.l] : 0) - (s.r >= 0 ? pressure[s.r] : 0)) * scale;
      let dx = x[s.b] - x[s.a], dy = y[s.b] - y[s.a];
      let len = Math.hypot(dx, dy) || 1;
      // the unit normal to the right of a->b points into the right face: moving there grows the left one
      let nx = dy / len, ny = -dx / len;
      let k = 0.5 * gain * dp;
      mx[s.a] += k * nx; my[s.a] += k * ny;
      mx[s.b] += k * nx; my[s.b] += k * ny;
    }
    for (let v = 0; v < count; ++v) {
      let list = inc[v];
      if (list.length === 2) {
        // along a run: curvature smoothing
        if (!tension) continue;
        let sx = 0, sy = 0;
        for (let k = 0; k < 2; ++k) {
          let s = segs[list[k]];
          let o = s.a === v ? s.b : s.a;
          sx += x[o]; sy += y[o];
        }
        mx[v] += tension * (sx / 2 - x[v]);
        my[v] += tension * (sy / 2 - y[v]);
      } else if (junctionTension) {
        // where runs meet: the pull of every run along its first segment (the films' tension),
        // which shortens long runs and slivers instead of only smoothing them
        let ux = 0, uy = 0, shortest = Infinity;
        for (let k = 0; k < list.length; ++k) {
          let s = segs[list[k]];
          let o = s.a === v ? s.b : s.a;
          let dx = x[o] - x[v], dy = y[o] - y[v], len = Math.hypot(dx, dy) || 1;
          ux += dx / len; uy += dy / len;
          shortest = Math.min(shortest, len);
        }
        mx[v] += junctionTension * shortest * ux;
        my[v] += junctionTension * shortest * uy;
      }
    }
    // visible minimum: relative to the smaller country's wanted size, which also keeps a small
    // growing country from being pinched shut where its borders meet
    let sizeOf = f => f >= 0 && faces[f].kind === 'land' ? faces[f].target : Infinity;
    arcs.forEach(arc => {
      if (arc.ring) return;
      let p = arc.points, a = p[0], b = p[p.length - 1];
      if (a === b) return;
      arc.minLength = Math.sqrt(Math.max(0, Math.min(sizeOf(arc.l), sizeOf(arc.r))));
      let length = 0;
      for (let k = 1; k < p.length; ++k) length += Math.hypot(x[p[k]] - x[p[k - 1]], y[p[k]] - y[p[k - 1]]);
      let need = shortest * arc.minLength;
      if (length >= need) return;
      let dx = x[a] - x[b], dy = y[a] - y[b], d = Math.hypot(dx, dy) || 1;
      let push = 0.25 * (need - length) / d;
      mx[a] += dx * push; my[a] += dy * push;
      mx[b] -= dx * push; my[b] -= dy * push;
    });
    let watch = globalThis.__watchFace;
    let before = watch !== undefined && it % 25 === 0 ? [Float64Array.from(x), Float64Array.from(y)] : null;
    moveSafely(foam, mx, my);
    if (before) {
      let f = faces.findIndex(face => face.kind === 'land' && face.owner === watch);
      if (f >= 0) {
        let want = 0, got = 0, n = 0;
        let seen = new Set();
        segs.forEach(s2 => {
          if (s2.l !== f && s2.r !== f) return;
          for (let v of [s2.a, s2.b]) {
            if (seen.has(v)) continue;
            seen.add(v);
            want += Math.hypot(mx[v], my[v]);
            got += Math.hypot(foam.x[v] - before[0][v], foam.y[v] - before[1][v]);
            n += 1;
          }
        });
        console.log('watch it', it, 'area/target', (area[f] / faces[f].target).toFixed(3), 'p', pressure[f].toFixed(2),
          'bias', faces[f].bias.toFixed(2), 'points', n, 'wanted', want.toExponential(2), 'moved', got.toExponential(2));
      }
    }
  }
  return error;
}

// Rings of every face, as lists of [x, y] with the face on the left. Where a face's boundary
// passes through one point more than once, the ring goes on along the next boundary clockwise
// from where it came in, which keeps the face on the left and the rings apart.
function faceRings(foam) {
  let {x, y} = foam;
  let out = foam.faces.map(() => new Map());   // face -> point -> [next points]
  foam.segs.forEach(s => {
    if (s.dead) return;
    let add = (f, a, b) => {
      if (f < 0) return;
      let list = out[f].get(a);
      if (list) list.push(b); else out[f].set(a, [b]);
    };
    add(s.l, s.a, s.b);
    add(s.r, s.b, s.a);
  });
  return out.map(map => {
    let rings = [];
    let used = new Set();
    map.forEach((targets, start) => targets.forEach(first => {
      if (used.has(start + ',' + first)) return;
      let ring = [];
      let a = start, b = first;
      while (!used.has(a + ',' + b)) {
        used.add(a + ',' + b);
        ring.push([x[a], y[a]]);
        let options = map.get(b);
        if (!options) throw new Error('Open face boundary');
        let next = options[0];
        if (options.length > 1) {
          // the outgoing edge first clockwise from the way back
          let back = Math.atan2(y[a] - y[b], x[a] - x[b]);
          let best = Infinity;
          options.forEach(c => {
            if (used.has(b + ',' + c)) return;
            let turn = back - Math.atan2(y[c] - y[b], x[c] - x[b]);
            while (turn <= 0) turn += 2 * Math.PI;
            if (turn < best) { best = turn; next = c; }
          });
        }
        a = b; b = next;
      }
      rings.push(ring);
    }));
    return rings;
  });
}

// ---------------------------------------------------------------------------------------------
// A continent like Afro-Eurasia encloses several ocean-sized faces (between the land bridges),
// and only one of them can be the open sea: the rest would become inland seas ringed by dozens
// of countries, which squeeze everything around them. Each such face that touches the sea is
// opened by dropping one link on the shore they share (the cheapest: the one whose smaller
// country is smallest), turning that link into an exclave as well, as Ceuta is for Spain.
// Returns the rotation without those links and the links dropped.
function openSeas(rotation, sea, weightOf, longest, maxHops = 3) {
  let rot = rotation.map(list => list.slice());
  let dropped = [];
  for (let round = 0; round < 20; ++round) {
    let faces = tracedFaces(rot);
    let faceOf = new Map();
    faces.forEach((face, i) => face.forEach(h => faceOf.set(h[0] + ',' + h[1], i)));
    let seaFace = faceOf.get(sea[0] + ',' + sea[1]);
    // cheapest way from the sea to every face, crossing links (each crossing costs a link)
    let cost = new Float64Array(faces.length).fill(Infinity), via = new Array(faces.length);
    cost[seaFace] = 0;
    let queue = [seaFace];
    while (queue.length) {
      queue.sort((p, q) => cost[q] - cost[p]);
      let f = queue.pop();
      faces[f].forEach(([u, v]) => {
        let g = faceOf.get(v + ',' + u);
        if (g === f || rot[u].length < 2 || rot[v].length < 2) return;
        let c = cost[f] + 1 + 1e-3 * Math.min(weightOf(u), weightOf(v)) / (1 + Math.min(weightOf(u), weightOf(v)));
        if (c < cost[g]) { cost[g] = c; via[g] = {from: f, u, v}; queue.push(g); }
      });
    }
    // the biggest enclosed face that can be reached in a few crossings
    let best = -1;
    faces.forEach((face, i) => {
      if (i === seaFace || face.length <= longest || !(cost[i] <= maxHops + 0.5)) return;
      if (best < 0 || face.length > faces[best].length) best = i;
    });
    if (best < 0) break;
    for (let f = best; f !== seaFace; f = via[f].from) {
      let {u, v} = via[f];
      rot[u] = rot[u].filter(w => w !== v);
      rot[v] = rot[v].filter(w => w !== u);
      dropped.push([u, v]);
      if ((sea[0] === u && sea[1] === v) || (sea[0] === v && sea[1] === u)) {
        sea = faces[seaFace].find(h => !((h[0] === u && h[1] === v) || (h[0] === v && h[1] === u)));
      }
    }
  }
  return {rotation: rot, sea, dropped};
}

// ---------------------------------------------------------------------------------------------
// The skeleton: a triangulation made of the countries plus water points. Every face of the
// embedding that is a triangle of three countries stays a triangle (three borders meet inside
// it). Every other face holds water: a ring of water points, one near each side and one near
// each corner, so countries that are not linked never come near each other. Inner faces become
// lakes (with a centre point), the outer face is the sea and its ring is the skeleton's rim.
// Each country's region is then the union of its kites (vertex, side midpoints, triangle
// centre) and the kites split every triangle into three equal areas, so a valid straight-line
// drawing of the skeleton is always a valid map with exactly the right contacts.
function skeleton(n, rotation, sea) {
  let faces = tracedFaces(rotation);
  let kind = [];                 // 'land' | 'lake' | 'sea'
  let owner = [];                // country id for land, lake id for lake water, -1 for sea
  for (let u = 0; u < n; ++u) { kind.push('land'); owner.push(u); }
  let add = (k, o) => (kind.push(k), owner.push(o), kind.length - 1);
  let tris = [];
  let rim = null, lakes = [], centres = [];
  faces.forEach(face => {
    let isSea = face.some(h => h[0] === sea[0] && h[1] === sea[1]);
    if (!isSea && face.length === 3) {
      tris.push(face[0][0], face[1][0], face[2][0]);
      return;
    }
    let k = face.length;
    let lake = isSea ? -1 : lakes.length;
    let water = isSea ? 'sea' : 'lake';
    let side = [], corner = [];
    for (let i = 0; i < k; ++i) { side.push(add(water, lake)); corner.push(add(water, lake)); }
    let ring = [];
    for (let i = 0; i < k; ++i) {
      let [vi, vj] = face[i];
      let next = (i + 1) % k;
      tris.push(vi, vj, side[i]);
      tris.push(vj, corner[i], side[i]);
      tris.push(vj, side[next], corner[i]);
      ring.push(side[i], corner[i]);
    }
    if (isSea) {
      rim = ring;
    } else {
      let centre = add(water, lake);
      centres.push(centre);
      ring.forEach((p, i) => tris.push(p, ring[(i + 1) % ring.length], centre));
      lakes.push({around: Array.from(new Set(face.map(h => h[0])))});
    }
  });
  // the fan inside a lake only has to stay unfolded: it may be as thin as the lake needs
  // (and so may the triangles along its shore: a third of each of them is lake, so a lake ringed
  // by many countries can only be small if they are thin)
  let soft = new Uint8Array(tris.length / 3);
  for (let t = 0; t < soft.length; ++t) {
    if (kind[tris[3 * t]] === 'lake' || kind[tris[3 * t + 1]] === 'lake' || kind[tris[3 * t + 2]] === 'lake') soft[t] = 1;
  }
  // triangles on the sea stay well shaped: a third of each is land, and a stretched one would
  // reach a thin spike of land out into the sea
  let coastal = new Uint8Array(tris.length / 3);
  for (let t = 0; t < coastal.length; ++t) {
    if (kind[tris[3 * t]] === 'sea' || kind[tris[3 * t + 1]] === 'sea' || kind[tris[3 * t + 2]] === 'sea') coastal[t] = 1;
  }
  return {kind, owner, tris: Int32Array.from(tris), rim, lakes, soft, coastal, count: kind.length};
}

// Tutte's barycentric drawing of the skeleton with its rim on a circle: no triangle flips.
function tutte(sk, radius, size) {
  // size[p]: how big point p's surroundings should be (a country's sqrt(target); water points
  // are kept small). Springs between big things are weak, so big countries spread out and
  // small ones and lakes stay compact; the rim gives each coast a share by its size.
  let {count, tris, rim} = sk;
  let near = [];
  for (let i = 0; i < count; ++i) near.push(new Set());
  for (let t = 0; t < tris.length; t += 3) {
    for (let k = 0; k < 3; ++k) {
      near[tris[t + k]].add(tris[t + (k + 1) % 3]);
      near[tris[t + (k + 1) % 3]].add(tris[t + k]);
    }
  }
  let lists = near.map(set => Array.from(set));
  let weights = lists.map((list, i) => list.map(j => size ? 1 / (size[i] + size[j]) : 1));
  let px = new Float64Array(2 * count);
  let pinned = new Uint8Array(count);
  let share = rim.map(p => size ? size[p] : 1);
  let total = share.reduce((a, b) => a + b, 0);
  let angle = 0;
  rim.forEach((p, i) => {
    px[2 * p] = radius * Math.cos(angle);
    px[2 * p + 1] = radius * Math.sin(angle);
    pinned[p] = 1;
    angle -= 2 * Math.PI * share[i] / total;
  });
  for (let sweep = 0; sweep < 20000; ++sweep) {
    let change = 0;
    for (let i = 0; i < count; ++i) {
      if (pinned[i]) continue;
      let list = lists[i], w = weights[i], sx = 0, sy = 0, sw = 0;
      for (let k = 0; k < list.length; ++k) { sx += w[k] * px[2 * list[k]]; sy += w[k] * px[2 * list[k] + 1]; sw += w[k]; }
      let dx = 1.8 * (sx / sw - px[2 * i]), dy = 1.8 * (sy / sw - px[2 * i + 1]);
      px[2 * i] += dx; px[2 * i + 1] += dy;
      change = Math.max(change, Math.abs(dx), Math.abs(dy));
    }
    if (change < radius * 1e-13) break;
  }
  let area = new Float64Array(tris.length / 3);
  if (!triangleAreas(tris, px, area)) {
    // the rim went round the other way: mirror
    for (let i = 0; i < count; ++i) px[2 * i + 1] = -px[2 * i + 1];
    if (!triangleAreas(tris, px, area)) throw new Error('First drawing has a flipped triangle');
  }
  if (!sk.useBand) {
    sk.fixed = new Uint8Array(count);
    sk.bandStart = tris.length / 3;
    return px;
  }
  // A band of sea triangles from the rim out to a fixed frame three times wider: the coast
  // can then never run into itself, because the band's triangles would have to flip first.
  let n = rim.length;
  let frame = [];
  let all = Array.from(px);
  rim.forEach(p => {
    frame.push(all.length / 2);
    all.push(3 * px[2 * p], 3 * px[2 * p + 1]);
    sk.kind.push('frame'); sk.owner.push(-1);
  });
  let band = Array.from(tris);
  let orient3 = (a, b, c) => (all[2 * b] - all[2 * a]) * (all[2 * c + 1] - all[2 * a + 1]) -
    (all[2 * b + 1] - all[2 * a + 1]) * (all[2 * c] - all[2 * a]);
  for (let i = 0; i < n; ++i) {
    let j = (i + 1) % n;
    for (let [a, b, c] of [[rim[i], frame[i], frame[j]], [rim[i], frame[j], rim[j]]]) {
      if (orient3(a, b, c) > 0) band.push(a, b, c); else band.push(a, c, b);
    }
  }
  sk.tris = Int32Array.from(band);
  sk.count = all.length / 2;
  sk.fixed = new Uint8Array(sk.count);
  frame.forEach(p => { sk.fixed[p] = 1; });
  sk.bandStart = tris.length / 3;
  return Float64Array.from(all);
}

function triangleAreas(tris, px, out) {
  let ok = true;
  for (let t = 0; t < out.length; ++t) {
    let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
    out[t] = 0.5 * ((px[2 * b] - px[2 * a]) * (px[2 * c + 1] - px[2 * a + 1]) -
      (px[2 * b + 1] - px[2 * a + 1]) * (px[2 * c] - px[2 * a]));
    if (!(out[t] > 0)) ok = false;
  }
  return ok;
}

function ringIsSimple(ring, px, report) {
  let n = ring.length;
  let cell = 0, longest = 0;
  for (let i = 0; i < n; ++i) {
    let a = ring[i], b = ring[(i + 1) % n];
    let len = Math.hypot(px[2 * b] - px[2 * a], px[2 * b + 1] - px[2 * a + 1]);
    cell += len;
    longest = Math.max(longest, len);
  }
  // cells big enough that no segment covers more than a few dozen of them
  cell = Math.max(2 * cell / n, longest / 30);
  let grid = new Map();
  let key = (i, j) => i * 100003 + j;
  for (let i = 0; i < n; ++i) {
    let a = ring[i], b = ring[(i + 1) % n];
    let i0 = Math.floor(Math.min(px[2 * a], px[2 * b]) / cell), i1 = Math.floor(Math.max(px[2 * a], px[2 * b]) / cell);
    let j0 = Math.floor(Math.min(px[2 * a + 1], px[2 * b + 1]) / cell), j1 = Math.floor(Math.max(px[2 * a + 1], px[2 * b + 1]) / cell);
    if ((i1 - i0 + 1) * (j1 - j0 + 1) > 4096) return false;
    for (let x = i0; x <= i1; ++x) for (let y = j0; y <= j1; ++y) {
      let list = grid.get(key(x, y));
      if (!list) grid.set(key(x, y), list = []);
      for (let j of list) {
        if (Math.abs(i - j) <= 1 || Math.abs(i - j) === n - 1) continue;
        let c = ring[j], d = ring[(j + 1) % n];
        if (segmentsCross(px[2 * a], px[2 * a + 1], px[2 * b], px[2 * b + 1],
          px[2 * c], px[2 * c + 1], px[2 * d], px[2 * d + 1])) {
          if (!report) return false;
          report.push(a, b, c, d);
        }
      }
      list.push(i);
    }
  }
  return !(report && report.length);
}

// ---------------------------------------------------------------------------------------------
// Shaping the skeleton: minimise
//   sum over countries and lakes  w (ln area/target)^2   +   mu * sum over triangles (shape - 1)
// where area is a third of each touching triangle (the kites) and
// shape = (a^2 + b^2 + c^2) / (4 sqrt3 area): 1 for an equilateral triangle, unbounded as a
// triangle flattens, so no triangle can flip. Limited-memory BFGS; a step is only accepted if
// every triangle stays positive and the rim does not cross itself.
function skeletonEnergy(sk, px, gradient, mu) {
  let {tris, faceOf, faceCount, target, weight, share} = sk;
  let area = new Float64Array(faceCount);
  let energy = 0;
  gradient.fill(0);
  let S3 = 4 * Math.sqrt(3);
  let triCount = tris.length / 3;
  for (let t = 0; t < triCount; ++t) {
    let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
    let ax = px[2 * a], ay = px[2 * a + 1], bx = px[2 * b], by = px[2 * b + 1], cx = px[2 * c], cy = px[2 * c + 1];
    let A = 0.5 * ((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
    if (!(A > 0)) return Infinity;
    for (let k = 0; k < 3; ++k) {
      let f = faceOf[tris[3 * t + k]];
      if (f >= 0) area[f] += A * share[3 * t + k];
    }
    let S = (ax - bx) ** 2 + (ay - by) ** 2 + (bx - cx) ** 2 + (by - cy) ** 2 + (cx - ax) ** 2 + (cy - ay) ** 2;
    let m = sk.soft && sk.soft[t] ? mu * (sk.softWeight ?? 0.01) : sk.coastal && sk.coastal[t] ? mu * sk.coastWeight : mu;
    energy += m * (S / (S3 * A) - 1);
    let k1 = m / (S3 * A), k2 = -m * S / (S3 * A * A);
    gradient[2 * a] += k1 * 2 * (2 * ax - bx - cx) + k2 * 0.5 * (by - cy);
    gradient[2 * a + 1] += k1 * 2 * (2 * ay - by - cy) + k2 * 0.5 * (cx - bx);
    gradient[2 * b] += k1 * 2 * (2 * bx - cx - ax) + k2 * 0.5 * (cy - ay);
    gradient[2 * b + 1] += k1 * 2 * (2 * by - cy - ay) + k2 * 0.5 * (ax - cx);
    gradient[2 * c] += k1 * 2 * (2 * cx - ax - bx) + k2 * 0.5 * (ay - by);
    gradient[2 * c + 1] += k1 * 2 * (2 * cy - ay - by) + k2 * 0.5 * (bx - ax);
  }
  let factor = new Float64Array(faceCount);
  for (let f = 0; f < faceCount; ++f) {
    let r = Math.log(area[f] / target[f]);
    energy += weight[f] * r * r;
    factor[f] = 2 * weight[f] * r / area[f];
  }
  let {triTarget, triWeight} = sk;
  for (let t = 0; t < triCount; ++t) {
    let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
    let k = 0;
    for (let j = 0; j < 3; ++j) {
      let f = faceOf[tris[3 * t + j]];
      if (f >= 0) k += factor[f] * share[3 * t + j];
    }
    // every triangle also wants its own share of the area: keeps the mesh from crushing
    let A = 0.5 * ((px[2 * b] - px[2 * a]) * (px[2 * c + 1] - px[2 * a + 1]) -
      (px[2 * b + 1] - px[2 * a + 1]) * (px[2 * c] - px[2 * a]));
    if (t < sk.bandStart && !sk.soft[t]) {
      let rt = Math.log(A / triTarget[t]);
      energy += triWeight * rt * rt;
      k += 2 * triWeight * rt / A;
    }
    if (!k) continue;
    let ax = px[2 * a], ay = px[2 * a + 1], bx = px[2 * b], by = px[2 * b + 1], cx = px[2 * c], cy = px[2 * c + 1];
    gradient[2 * a] += k * 0.5 * (by - cy); gradient[2 * a + 1] += k * 0.5 * (cx - bx);
    gradient[2 * b] += k * 0.5 * (cy - ay); gradient[2 * b + 1] += k * 0.5 * (ax - cx);
    gradient[2 * c] += k * 0.5 * (ay - by); gradient[2 * c + 1] += k * 0.5 * (bx - ax);
  }
  energy += rimRepulsion(sk.rim, px, gradient, sk.rimWeight ?? 1);
  if (sk.fixed) for (let v = 0; v < sk.fixed.length; ++v) if (sk.fixed[v]) { gradient[2 * v] = 0; gradient[2 * v + 1] = 0; }
  sk.area = area;
  return energy;
}

// Coast segments that come within a segment's length of each other push apart, smoothly, and
// infinitely hard at contact, so the optimiser slows down before the coast touches itself
// instead of running into a wall it cannot see.
function rimRepulsion(ring, px, gradient, weight) {
  if (!ring || !weight) return 0;
  let n = ring.length;
  let lens = new Float64Array(n), mean = 0;
  for (let i = 0; i < n; ++i) {
    let a = ring[i], b = ring[(i + 1) % n];
    lens[i] = Math.hypot(px[2 * b] - px[2 * a], px[2 * b + 1] - px[2 * a + 1]);
    mean += lens[i] / n;
  }
  // a pair pushes when closer than half their lengths summed; each segment sits in the grid
  // with its box grown by half its length and looks around its own box grown by half its own,
  // so every such pair is found whatever the cells (a missed pair would make the energy jump)
  let cell = 2 * mean || 1;
  let grid = new Map();
  let key = (i, j) => i * 1000003 + j;
  let energy = 0;
  let pull = (p, a, b) => {
    let ax = px[2 * a], ay = px[2 * a + 1], bx = px[2 * b], by = px[2 * b + 1];
    let dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
    let t = len2 > 0 ? Math.max(0, Math.min(1, ((px[2 * p] - ax) * dx + (px[2 * p + 1] - ay) * dy) / len2)) : 0;
    let cx = ax + t * dx, cy = ay + t * dy;
    let ex = px[2 * p] - cx, ey = px[2 * p + 1] - cy;
    return {d: Math.hypot(ex, ey), ex, ey, t};
  };
  let stamp = new Int32Array(n).fill(-1);
  for (let i = 0; i < n; ++i) {
    let a = ring[i], b = ring[(i + 1) % n];
    let grow = 0.5 * lens[i];
    let x0 = Math.min(px[2 * a], px[2 * b]) - grow, x1 = Math.max(px[2 * a], px[2 * b]) + grow;
    let y0 = Math.min(px[2 * a + 1], px[2 * b + 1]) - grow, y1 = Math.max(px[2 * a + 1], px[2 * b + 1]) + grow;
    let g0 = Math.floor(x0 / cell), g1 = Math.floor(x1 / cell), h0 = Math.floor(y0 / cell), h1 = Math.floor(y1 / cell);
    for (let gx = g0; gx <= g1; ++gx) {
      for (let gy = h0; gy <= h1; ++gy) {
        let list = grid.get(key(gx, gy));
        if (!list) continue;
        for (let j of list) {
          if (stamp[j] === i || Math.abs(i - j) <= 1 || Math.abs(i - j) === n - 1) continue;
          stamp[j] = i;
          let c = ring[j], d = ring[(j + 1) % n];
          let d0 = 0.5 * (lens[i] + lens[j]);
          // boxes further apart than d0 cannot push
          let bx0 = Math.min(px[2 * c], px[2 * d]), bx1 = Math.max(px[2 * c], px[2 * d]);
          let by0 = Math.min(px[2 * c + 1], px[2 * d + 1]), by1 = Math.max(px[2 * c + 1], px[2 * d + 1]);
          let gapX = Math.max(0, bx0 - (x1 - grow), (x0 + grow) - bx1), gapY = Math.max(0, by0 - (y1 - grow), (y0 + grow) - by1);
          if (gapX * gapX + gapY * gapY >= d0 * d0) continue;
          let best = null;
          for (let k = 0; k < 4; ++k) {
            let p = k === 0 ? a : k === 1 ? b : k === 2 ? c : d;
            let s0 = k < 2 ? c : a, s1 = k < 2 ? d : b;
            let r = pull(p, s0, s1);
            if (!best || r.d < best.d) { best = r; best.p = p; best.s0 = s0; best.s1 = s1; }
          }
          if (!(best.d < d0)) continue;
          if (!(best.d > 0)) return Infinity;
          let x = best.d / d0;
          energy += weight * (-Math.log(x) + x - 1);
          let g = weight * (-1 / best.d + 1 / d0);
          let ux = best.ex / best.d, uy = best.ey / best.d;
          gradient[2 * best.p] += g * ux; gradient[2 * best.p + 1] += g * uy;
          gradient[2 * best.s0] -= g * ux * (1 - best.t); gradient[2 * best.s0 + 1] -= g * uy * (1 - best.t);
          gradient[2 * best.s1] -= g * ux * best.t; gradient[2 * best.s1 + 1] -= g * uy * best.t;
        }
      }
    }
    for (let gx = g0; gx <= g1; ++gx) for (let gy = h0; gy <= h1; ++gy) {
      let list = grid.get(key(gx, gy));
      if (!list) grid.set(key(gx, gy), list = []);
      list.push(i);
    }
  }
  return energy;
}

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; ++i) sum += a[i] * b[i];
  return sum;
}

function shape(sk, px, mu, iterations) {
  let size = px.length;
  let g = new Float64Array(size), trialG = new Float64Array(size), trial = new Float64Array(size);
  let energy = skeletonEnergy(sk, px, g, mu);
  let history = [];
  let it = 0, stalled = 0;
  for (; it < iterations; ++it) {
    let d = Float64Array.from(g, v => -v);
    let alphas = [];
    for (let k = history.length - 1; k >= 0; --k) {
      let {s, y, rho} = history[k];
      alphas[k] = rho * dot(s, d);
      for (let i = 0; i < size; ++i) d[i] -= alphas[k] * y[i];
    }
    if (history.length) {
      let {s, y} = history[history.length - 1];
      let gamma = dot(s, y) / dot(y, y);
      for (let i = 0; i < size; ++i) d[i] *= gamma;
    } else {
      let biggest = 0, span = 0;
      for (let i = 0; i < size; ++i) { biggest = Math.max(biggest, Math.abs(d[i])); span = Math.max(span, Math.abs(px[i])); }
      for (let i = 0; i < size; ++i) d[i] *= 1e-3 * span / (biggest || 1);
    }
    for (let k = 0; k < history.length; ++k) {
      let {s, y, rho} = history[k];
      let beta = rho * dot(y, d);
      for (let i = 0; i < size; ++i) d[i] += s[i] * (alphas[k] - beta);
    }
    let slope = dot(g, d);
    if (!(slope < 0)) { history = []; continue; }
    let step = 1, accepted = false, trialEnergy;
    for (let tries = 0; tries < 50; ++tries) {
      for (let i = 0; i < size; ++i) trial[i] = px[i] + step * d[i];
      trialEnergy = skeletonEnergy(sk, trial, trialG, mu);
      if (trialEnergy <= energy + 1e-4 * step * slope && (sk.useBand || ringIsSimple(sk.rim, trial))) { accepted = true; break; }
      step *= 0.5;
    }
    if (!accepted) {
      if (sk.debug) {
        for (let i = 0; i < size; ++i) trial[i] = px[i] + 1e-6 * d[i];
        let g0 = new Float64Array(size), g1 = new Float64Array(size);
        let r0 = rimRepulsion(sk.rim, px, g0, sk.rimWeight ?? 1), r1 = rimRepulsion(sk.rim, trial, g1, sk.rimWeight ?? 1);
        console.log('rim term', r0, '->', r1);
        let e = skeletonEnergy(sk, trial, trialG, mu);
        console.log('line search failed at', it, 'history', history.length, 'tiny step energy', e, 'vs', energy, 'rim ok', ringIsSimple(sk.rim, trial), 'slope', slope);
        skeletonEnergy(sk, px, g, mu);
      }
      if (!history.length) break;
      history = [];
      continue;
    }
    let s = new Float64Array(size), y = new Float64Array(size);
    for (let i = 0; i < size; ++i) { s[i] = trial[i] - px[i]; y[i] = trialG[i] - g[i]; }
    let sy = dot(s, y);
    if (sy > 0) {
      history.push({s, y, rho: 1 / sy});
      if (history.length > 10) history.shift();
    }
    let drop = energy - trialEnergy;
    px.set(trial); g.set(trialG);
    energy = trialEnergy;
    stalled = drop < 1e-9 * Math.max(1, energy) ? stalled + 1 : 0;
    if (stalled > 20) break;
  }
  skeletonEnergy(sk, px, g, mu);
  if (sk.debug) console.log('shape mu', mu, 'iterations', it, 'energy', energy.toFixed(3));
  sk.iterations = (sk.iterations || 0) + it;
  return energy;
}

// Stage 1 alternative: Tutte's embedding again, with the frame pinned, but with spring weights
// adjusted until every triangle has about its share of area. Any positive weights give a valid
// drawing (Tutte, Floater), so this can never flip a triangle; it only redistributes room.
function balance(sk, px, rounds, debug) {
  let {tris, fixed, triTarget, bandStart} = sk;
  let count = px.length / 2, triCount = tris.length / 3;
  let edgeOf = new Map(), ei = [], ej = [], edgeTris = [];
  for (let t = 0; t < triCount; ++t) {
    for (let k = 0; k < 3; ++k) {
      let i = tris[3 * t + k], j = tris[3 * t + (k + 1) % 3];
      let key = i < j ? i + ',' + j : j + ',' + i;
      let id = edgeOf.get(key);
      if (id === undefined) { id = ei.length; ei.push(i); ej.push(j); edgeTris.push([]); edgeOf.set(key, id); }
      edgeTris[id].push(t);
    }
  }
  let edgeCount = ei.length;
  let logw = new Float64Array(edgeCount);
  let w = new Float64Array(edgeCount).fill(1);
  let nbr = [];
  for (let v = 0; v < count; ++v) nbr.push([]);
  for (let e = 0; e < edgeCount; ++e) { nbr[ei[e]].push(e); nbr[ej[e]].push(e); }
  let area = new Float64Array(triCount);
  triangleAreas(tris, px, area);
  let want = new Float64Array(triCount);
  for (let t = 0; t < triCount; ++t) want[t] = t < bandStart ? triTarget[t] : area[t];
  // land and lakes together should fill about what they want
  let solve = sweeps => {
    for (let sweep = 0; sweep < sweeps; ++sweep) {
      for (let v = 0; v < count; ++v) {
        if (fixed[v]) continue;
        let sx = 0, sy = 0, sw = 0;
        for (let e of nbr[v]) {
          let o = ei[e] === v ? ej[e] : ei[e];
          sx += w[e] * px[2 * o]; sy += w[e] * px[2 * o + 1]; sw += w[e];
        }
        px[2 * v] += 1.6 * (sx / sw - px[2 * v]);
        px[2 * v + 1] += 1.6 * (sy / sw - px[2 * v + 1]);
      }
    }
  };
  let error = 0;
  for (let round = 0; round < rounds; ++round) {
    solve(round ? 60 : 400);
    if (!triangleAreas(tris, px, area)) { solve(400); triangleAreas(tris, px, area); }
    // scale wanted land areas to the room the band leaves, then nudge every spring
    let have = 0, wanted = 0;
    for (let t = 0; t < bandStart; ++t) { have += area[t]; wanted += want[t]; }
    let scale = have / wanted;
    error = 0;
    let logr = new Float64Array(triCount);
    for (let t = 0; t < triCount; ++t) {
      logr[t] = t < bandStart ? Math.log(area[t] / (want[t] * scale)) : 0;
      if (t < bandStart) error = Math.max(error, Math.abs(logr[t]));
    }
    for (let e = 0; e < edgeCount; ++e) {
      let g = 0;
      for (let t of edgeTris[e]) g += logr[t];
      g /= edgeTris[e].length;
      logw[e] = Math.max(-4, Math.min(4, logw[e] + 0.3 * g));
      w[e] = Math.exp(logw[e]);
    }
    if (debug && round % 20 === 0) console.log('balance round', round, 'worst triangle', error.toFixed(2));
  }
  for (let k = 0; k < 50 && !triangleAreas(tris, px, area); ++k) solve(400);
  if (!triangleAreas(tris, px, area)) throw new Error('Balanced drawing has a flipped triangle');
  return error;
}

// Stage 1, point by point: each point in turn takes the step (at most half its distance to the
// lines of its opposite edges, so none of its triangles can flip) that lowers the energy of the
// triangles and faces around it. Steps are relative to each point's own neighbourhood, so a
// crushed corner of the map opens up as fast, in proportion, as a roomy one.
function descend(sk, px, mu, sweeps) {
  let {tris, fixed, triTarget, triWeight, bandStart, faceOf, target, weight, faceCount} = sk;
  let count = px.length / 2, triCount = tris.length / 3;
  let around = [];
  for (let v = 0; v < count; ++v) around.push([]);
  for (let t = 0; t < triCount; ++t) for (let k = 0; k < 3; ++k) around[tris[3 * t + k]].push(t);
  let A = new Float64Array(triCount);
  triangleAreas(tris, px, A);
  let faceArea = new Float64Array(faceCount);
  for (let t = 0; t < triCount; ++t) for (let k = 0; k < 3; ++k) {
    let f = faceOf[tris[3 * t + k]];
    if (f >= 0) faceArea[f] += A[t] / 3;
  }
  let S3 = 4 * Math.sqrt(3);
  let triEnergy = (t, a, ax, ay, bx, by, cx, cy) => {
    if (!(a > 0)) return Infinity;
    let S = (ax - bx) ** 2 + (ay - by) ** 2 + (bx - cx) ** 2 + (by - cy) ** 2 + (cx - ax) ** 2 + (cy - ay) ** 2;
    let e = mu * (S / (S3 * a) - 1);
    if (t < bandStart) { let r = Math.log(a / triTarget[t]); e += triWeight * r * r; }
    return e;
  };
  let faceEnergy = (f, a) => { let r = Math.log(a / target[f]); return weight[f] * r * r; };
  let changed = new Map();
  let tryMove = (v, nx, ny) => {
    // energy change if v moves to (nx, ny)
    let ox = px[2 * v], oy = px[2 * v + 1];
    let delta = 0;
    changed.clear();
    for (let t of around[v]) {
      let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
      let P = i => i === v ? [nx, ny] : [px[2 * i], px[2 * i + 1]];
      let [ax, ay] = P(a), [bx, by] = P(b), [cx, cy] = P(c);
      let area = 0.5 * ((bx - ax) * (cy - ay) - (by - ay) * (cx - ax));
      if (!(area > 0)) return Infinity;
      delta += triEnergy(t, area, ax, ay, bx, by, cx, cy) -
        triEnergy(t, A[t], px[2 * a], px[2 * a + 1], px[2 * b], px[2 * b + 1], px[2 * c], px[2 * c + 1]);
      for (let k = 0; k < 3; ++k) {
        let f = faceOf[tris[3 * t + k]];
        if (f >= 0) changed.set(f, (changed.get(f) || 0) + (area - A[t]) / 3);
      }
    }
    changed.forEach((d, f) => { delta += faceEnergy(f, faceArea[f] + d) - faceEnergy(f, faceArea[f]); });
    void ox; void oy;
    return delta;
  };
  let commit = (v, nx, ny) => {
    px[2 * v] = nx; px[2 * v + 1] = ny;
    for (let t of around[v]) {
      let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
      let area = 0.5 * ((px[2 * b] - px[2 * a]) * (px[2 * c + 1] - px[2 * a + 1]) -
        (px[2 * b + 1] - px[2 * a + 1]) * (px[2 * c] - px[2 * a]));
      for (let k = 0; k < 3; ++k) {
        let f = faceOf[tris[3 * t + k]];
        if (f >= 0) faceArea[f] += (area - A[t]) / 3;
      }
      A[t] = area;
    }
  };
  for (let sweep = 0; sweep < sweeps; ++sweep) {
    let moved = 0;
    for (let v = 0; v < count; ++v) {
      if (fixed && fixed[v]) continue;
      // numerical gradient from the exact local energy, with a step tied to the neighbourhood
      let room = Infinity;
      for (let t of around[v]) {
        let k = tris[3 * t] === v ? 0 : tris[3 * t + 1] === v ? 1 : 2;
        let b = tris[3 * t + (k + 1) % 3], c = tris[3 * t + (k + 2) % 3];
        let len = Math.hypot(px[2 * c] - px[2 * b], px[2 * c + 1] - px[2 * b + 1]);
        room = Math.min(room, 2 * A[t] / len);
      }
      let h = 1e-3 * room;
      let x0 = px[2 * v], y0 = px[2 * v + 1];
      let gx = (tryMove(v, x0 + h, y0) - tryMove(v, x0 - h, y0)) / (2 * h);
      let gy = (tryMove(v, x0, y0 + h) - tryMove(v, x0, y0 - h)) / (2 * h);
      let g = Math.hypot(gx, gy);
      if (!(g > 0) || !isFinite(g)) continue;
      let step = 0.5 * room;
      for (let tries = 0; tries < 8; ++tries) {
        let nx = x0 - gx / g * step, ny = y0 - gy / g * step;
        if (tryMove(v, nx, ny) < 0) { commit(v, nx, ny); moved += 1; break; }
        step *= 0.5;
      }
    }
    if (!moved) break;
  }
  sk.area = faceArea;
}

// Before fitting areas, spread the skeleton like a force-directed graph drawing (springs along
// its edges, every point pushing every other), with ideal distances from the sizes. Pushes act
// across the whole map at once, so a crushed corner opens up in a few sweeps. Each point moves
// at most a fraction of its distance to the far sides of its triangles, so no triangle flips:
// the embedding, and with it every contact, stays exactly as it was.
function spread(sk, px, size, sweeps) {
  let {tris, fixed} = sk;
  let count = px.length / 2;
  let around = [];
  for (let v = 0; v < count; ++v) around.push([]);
  for (let t = 0; t < tris.length / 3; ++t) for (let k = 0; k < 3; ++k) around[tris[3 * t + k]].push(t);
  let edges = new Map();
  for (let t = 0; t < tris.length; t += 3) {
    for (let k = 0; k < 3; ++k) {
      let a = tris[t + k], b = tris[t + (k + 1) % 3];
      edges.set(a < b ? a + ',' + b : b + ',' + a, [a, b]);
    }
  }
  let springs = Array.from(edges.values()).filter(([a, b]) => !(fixed[a] && fixed[b]));
  let free = [];
  for (let v = 0; v < count; ++v) if (!fixed[v] && sk.kind[v] !== 'frame') free.push(v);
  let fx = new Float64Array(count), fy = new Float64Array(count);
  for (let sweep = 0; sweep < sweeps; ++sweep) {
    let heat = 0.5 * (1 - sweep / sweeps) + 0.05;
    fx.fill(0); fy.fill(0);
    springs.forEach(([a, b]) => {
      let dx = px[2 * b] - px[2 * a], dy = px[2 * b + 1] - px[2 * a + 1];
      let d = Math.hypot(dx, dy) || 1e-12, L = size[a] + size[b];
      let f = d / L;                      // pull, d^2 / L, along the unit direction
      fx[a] += f * dx; fy[a] += f * dy; fx[b] -= f * dx; fy[b] -= f * dy;
    });
    for (let i = 0; i < free.length; ++i) {
      let a = free[i];
      for (let j = i + 1; j < free.length; ++j) {
        let b = free[j];
        let dx = px[2 * b] - px[2 * a], dy = px[2 * b + 1] - px[2 * a + 1];
        let d2 = dx * dx + dy * dy || 1e-24, L = size[a] + size[b];
        let f = L * L / d2;                 // push, L^2 / d, along the unit direction
        fx[a] -= f * dx; fy[a] -= f * dy; fx[b] += f * dx; fy[b] += f * dy;
      }
    }
    for (let v of free) {
      let room = Infinity;
      for (let t of around[v]) {
        let k = tris[3 * t] === v ? 0 : tris[3 * t + 1] === v ? 1 : 2;
        let b = tris[3 * t + (k + 1) % 3], c = tris[3 * t + (k + 2) % 3];
        let ex = px[2 * c] - px[2 * b], ey = px[2 * c + 1] - px[2 * b + 1];
        let len = Math.hypot(ex, ey);
        let height = ((px[2 * v] - px[2 * b]) * ey - (px[2 * v + 1] - px[2 * b + 1]) * ex) / len;
        room = Math.min(room, Math.abs(height));
      }
      let f = Math.hypot(fx[v], fy[v]);
      if (!(f > 0)) continue;
      let step = Math.min(0.1 * f, heat * room);
      let nx = px[2 * v] + fx[v] / f * step, ny = px[2 * v + 1] + fy[v] / f * step;
      let ox = px[2 * v], oy = px[2 * v + 1];
      px[2 * v] = nx; px[2 * v + 1] = ny;
      for (let t of around[v]) {
        let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
        let area = (px[2 * b] - px[2 * a]) * (px[2 * c + 1] - px[2 * a + 1]) - (px[2 * b + 1] - px[2 * a + 1]) * (px[2 * c] - px[2 * a]);
        if (!(area > 0)) { px[2 * v] = ox; px[2 * v + 1] = oy; break; }
      }
    }
  }
}

// ---------------------------------------------------------------------------------------------
// Weighted kites. Each skeleton triangle is split among its three corners, but not in equal
// thirds: the point on each side sits nearer the smaller country and the point inside nearer
// the smaller ones too, so a big country gets most of every triangle it is in. Those points
// are fixed blends of the corners, so each corner's share is a fixed fraction of the
// triangle's area, whatever its shape.
function sideBlend(wa, wb) { return wa / (wa + wb); }             // how far from a towards b
function innerBlend(wa, wb, wc) {
  let ia = 1 / wa, ib = 1 / wb, ic = 1 / wc, sum = ia + ib + ic;
  return [ia / sum, ib / sum, ic / sum];
}
function kiteShares(wa, wb, wc) {
  // barycentric frame: a = (0, 0), b = (1, 0), c = (0, 1); triangle area 1/2
  let point = (la, lb, lc) => [lb, lc];
  let ab = sideBlend(wa, wb), bc = sideBlend(wb, wc), ca = sideBlend(wc, wa);
  let mAB = point(1 - ab, ab, 0), mBC = point(0, 1 - bc, bc), mCA = point(ca, 0, 1 - ca);
  let [ga, gb, gc] = innerBlend(wa, wb, wc);
  let g = point(ga, gb, gc);
  let area = poly => {
    let s = 0;
    poly.forEach((p, i) => { let q = poly[(i + 1) % poly.length]; s += p[0] * q[1] - q[0] * p[1]; });
    return Math.abs(s) / 2;
  };
  let A = point(1, 0, 0), B = point(0, 1, 0), C = point(0, 0, 1);
  return [area([A, mAB, g, mCA]) * 2, area([B, mBC, g, mAB]) * 2, area([C, mCA, g, mBC]) * 2];
}

// ---------------------------------------------------------------------------------------------
// Moving area across the whole continent: the skeleton is cut into its kites (each skeleton
// triangle into six small triangles, two per corner) and the mesh flows like a diffusion
// cartogram (Gastner and Newman): every step moves all points along the gradient of psi,
// where  laplacian(psi) = ln(density / mean density)  over the mesh and psi = 0 on the rim.
// Crowded countries spread out, roomy ones contract, smoothly over the whole map. A step
// that would flip a triangle or make the rim cross itself is halved, so the map stays valid.
function kiteMesh(sk, px, faceOfPoint, seaFace) {
  let {tris, pointWeight: wp} = sk;
  let points = Array.from(px);
  let mid = new Map();
  let midOf = (a, b) => {
    let key = a < b ? a + ',' + b : b + ',' + a;
    let m = mid.get(key);
    if (m === undefined) {
      m = points.length / 2;
      let t = sideBlend(wp[a], wp[b]);
      points.push(px[2 * a] + t * (px[2 * b] - px[2 * a]), px[2 * a + 1] + t * (px[2 * b + 1] - px[2 * a + 1]));
      mid.set(key, m);
    }
    return m;
  };
  let sub = [], owner = [];
  for (let t = 0; t < tris.length; t += 3) {
    let a = tris[t], b = tris[t + 1], c = tris[t + 2];
    if (sk.kind[a] === 'frame' || sk.kind[b] === 'frame' || sk.kind[c] === 'frame') continue;
    let g = points.length / 2;
    let [la, lb, lc] = innerBlend(wp[a], wp[b], wp[c]);
    points.push(la * px[2 * a] + lb * px[2 * b] + lc * px[2 * c], la * px[2 * a + 1] + lb * px[2 * b + 1] + lc * px[2 * c + 1]);
    let ab = midOf(a, b), bc = midOf(b, c), ca = midOf(c, a);
    for (let [v, m1, m2] of [[a, ab, ca], [b, bc, ab], [c, ca, bc]]) {
      let f = faceOfPoint(v);
      if (f < 0) f = seaFace;
      sub.push(v, m1, g, v, g, m2);
      owner.push(f, f);
    }
  }
  // the rim of the kite mesh: edges used by one triangle, chained into a loop
  let use = new Map();
  for (let t = 0; t < sub.length; t += 3) {
    for (let k = 0; k < 3; ++k) {
      let i = sub[t + k], j = sub[t + (k + 1) % 3];
      let key = i < j ? i + ',' + j : j + ',' + i;
      let e = use.get(key);
      if (e) e.count += 1; else use.set(key, {i, j, count: 1});
    }
  }
  let next = new Map();
  use.forEach(e => { if (e.count === 1) next.set(e.i, e.j); });
  let rim = [];
  let start = next.keys().next().value;
  let v = start;
  do { rim.push(v); v = next.get(v); } while (v !== undefined && v !== start && rim.length <= next.size);
  return {px: Float64Array.from(points), tris: Int32Array.from(sub), owner: Int32Array.from(owner), rim};
}

function flow(mesh, target, faceCount, seaFace, iterations, tolerance) {
  let {tris, owner} = mesh;
  let px = mesh.px;
  let count = px.length / 2, triCount = tris.length / 3;
  let edgeOf = new Map(), ei = [], ej = [];
  let triEdge = new Int32Array(3 * triCount);
  for (let t = 0; t < triCount; ++t) {
    for (let k = 0; k < 3; ++k) {
      let i = tris[3 * t + (k + 1) % 3], j = tris[3 * t + (k + 2) % 3];  // edge opposite corner k
      let key = i < j ? i + ',' + j : j + ',' + i;
      let id = edgeOf.get(key);
      if (id === undefined) { id = ei.length; ei.push(i); ej.push(j); edgeOf.set(key, id); }
      triEdge[3 * t + k] = id;
    }
  }
  let fixed = new Uint8Array(count);
  mesh.rim.forEach(p => { fixed[p] = 1; });
  let edgeCount = ei.length;
  let w = new Float64Array(edgeCount), diag = new Float64Array(count);
  let triArea = new Float64Array(triCount), trialArea = new Float64Array(triCount);
  triangleAreas(tris, px, triArea);
  let psi = new Float64Array(count), rhs = new Float64Array(count);
  let r = new Float64Array(count), z = new Float64Array(count), p = new Float64Array(count), q = new Float64Array(count);
  let vx = new Float64Array(count), vy = new Float64Array(count), vw = new Float64Array(count);
  let trial = new Float64Array(px.length), room = new Float64Array(count);
  let matvec = (x, out) => {
    for (let i = 0; i < count; ++i) out[i] = fixed[i] ? 0 : diag[i] * x[i];
    for (let e = 0; e < edgeCount; ++e) {
      let i = ei[e], j = ej[e];
      if (!fixed[i] && !fixed[j]) { out[i] -= w[e] * x[j]; out[j] -= w[e] * x[i]; }
    }
  };
  let step = 0.5, error = Infinity;
  for (let it = 0; it < iterations; ++it) {
    let area = new Float64Array(faceCount + 1);
    for (let t = 0; t < triCount; ++t) area[owner[t]] += triArea[t];
    let totalArea = 0, totalTarget = 0;
    error = 0;
    for (let f = 0; f < faceCount; ++f) {
      totalArea += area[f]; totalTarget += target[f];
      error = Math.max(error, Math.abs(Math.log(area[f] / target[f])));
    }
    if (error < tolerance) break;
    let source = new Float64Array(faceCount + 1);
    for (let f = 0; f < faceCount; ++f) {
      source[f] = Math.max(-2, Math.min(2, Math.log((target[f] / area[f]) / (totalTarget / totalArea))));
    }
    source[seaFace] = 0;
    // cotangent stiffness and load
    w.fill(0); diag.fill(0); rhs.fill(0);
    for (let t = 0; t < triCount; ++t) {
      let A = triArea[t];
      for (let k = 0; k < 3; ++k) {
        let o = tris[3 * t + k], i = tris[3 * t + (k + 1) % 3], j = tris[3 * t + (k + 2) % 3];
        let ux = px[2 * i] - px[2 * o], uy = px[2 * i + 1] - px[2 * o + 1];
        let wx = px[2 * j] - px[2 * o], wy = px[2 * j + 1] - px[2 * o + 1];
        let half = 0.25 * (ux * wx + uy * wy) / A;    // half the cotangent of the angle at o
        w[triEdge[3 * t + k]] += half;
        diag[i] += half; diag[j] += half;
        rhs[o] -= source[owner[t]] * A / 3;
      }
    }
    // conjugate gradients, Jacobi preconditioned, rim pinned at psi = 0
    psi.fill(0);
    let rz = 0;
    for (let i = 0; i < count; ++i) {
      r[i] = fixed[i] ? 0 : rhs[i];
      z[i] = fixed[i] || !(diag[i] > 0) ? 0 : r[i] / diag[i];
      p[i] = z[i];
      rz += r[i] * z[i];
    }
    let first = Math.sqrt(Math.abs(rz));
    for (let k = 0; k < 2000 && Math.sqrt(Math.abs(rz)) > 1e-7 * first; ++k) {
      matvec(p, q);
      let pq = 0;
      for (let i = 0; i < count; ++i) pq += p[i] * q[i];
      if (!(pq > 0)) break;
      let alpha = rz / pq, next = 0;
      for (let i = 0; i < count; ++i) {
        psi[i] += alpha * p[i];
        r[i] -= alpha * q[i];
        z[i] = fixed[i] || !(diag[i] > 0) ? 0 : r[i] / diag[i];
        next += r[i] * z[i];
      }
      let beta = next / rz;
      rz = next;
      for (let i = 0; i < count; ++i) p[i] = z[i] + beta * p[i];
    }
    // velocity: gradient of psi per triangle, averaged onto points by area
    vx.fill(0); vy.fill(0); vw.fill(0);
    for (let t = 0; t < triCount; ++t) {
      let A = triArea[t], gx = 0, gy = 0;
      for (let k = 0; k < 3; ++k) {
        let o = tris[3 * t + k], i = tris[3 * t + (k + 1) % 3], j = tris[3 * t + (k + 2) % 3];
        gx += psi[o] * -(px[2 * j + 1] - px[2 * i + 1]) / (2 * A);
        gy += psi[o] * (px[2 * j] - px[2 * i]) / (2 * A);
      }
      for (let k = 0; k < 3; ++k) {
        let o = tris[3 * t + k];
        vx[o] += gx * A; vy[o] += gy * A; vw[o] += A;
      }
    }
    for (let i = 0; i < count; ++i) { vx[i] /= vw[i]; vy[i] /= vw[i]; }
    // no point moves more than a quarter of its distance to the far sides of its triangles
    room.fill(Infinity);
    for (let t = 0; t < triCount; ++t) {
      for (let k = 0; k < 3; ++k) {
        let o = tris[3 * t + k], i = tris[3 * t + (k + 1) % 3], j = tris[3 * t + (k + 2) % 3];
        let len = Math.hypot(px[2 * j] - px[2 * i], px[2 * j + 1] - px[2 * i + 1]);
        room[o] = Math.min(room[o], 2 * triArea[t] / len);
      }
    }
    // move; where a triangle would flip, its corners take half their step, until none flips
    let scale = new Float64Array(count);
    for (let i = 0; i < count; ++i) {
      let len = step * Math.hypot(vx[i], vy[i]);
      scale[i] = len > 0.25 * room[i] ? 0.25 * room[i] / len : 1;
    }
    let place = i => {
      trial[2 * i] = px[2 * i] + scale[i] * step * vx[i];
      trial[2 * i + 1] = px[2 * i + 1] + scale[i] * step * vy[i];
    };
    for (let i = 0; i < count; ++i) place(i);
    let moved = false;
    for (let tries = 0; tries < 40; ++tries) {
      let bad = 0;
      for (let t = 0; t < triCount; ++t) {
        let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
        let A = 0.5 * ((trial[2 * b] - trial[2 * a]) * (trial[2 * c + 1] - trial[2 * a + 1]) -
          (trial[2 * b + 1] - trial[2 * a + 1]) * (trial[2 * c] - trial[2 * a]));
        if (A > 0.05 * triArea[t]) continue;
        bad += 1;
        for (let v of [a, b, c]) { scale[v] *= 0.5; place(v); }
      }
      if (!bad) { moved = true; break; }
    }
    // and where the coast would run into itself, the points involved hold back too
    for (let tries = 0; moved && tries < 40; ++tries) {
      let crossing = [];
      if (ringIsSimple(mesh.rim, trial, crossing)) break;
      for (let v of crossing) { scale[v] *= 0.25; place(v); }
      if (tries === 39) moved = false;
    }
    if (moved) {
      // holding points back may have folded a triangle again: check once more
      for (let t = 0; t < triCount && moved; ++t) {
        let a = tris[3 * t], b = tris[3 * t + 1], c = tris[3 * t + 2];
        let A = (trial[2 * b] - trial[2 * a]) * (trial[2 * c + 1] - trial[2 * a + 1]) -
          (trial[2 * b + 1] - trial[2 * a + 1]) * (trial[2 * c] - trial[2 * a]);
        if (!(A > 0)) moved = false;
      }
    }
    if (!moved && mesh.debug) console.log('flow step refused at', it);
    if (moved) triangleAreas(tris, trial, trialArea);
    else step *= 0.5;
    if (mesh.debug && it % 5 === 0) console.log('flow', it, 'error', error.toFixed(3), 'step', step, 'moved', moved);
    if (!moved) { if (step < 1e-6) break; continue; }
    px.set(trial);
    triArea.set(trialArea);
    step = Math.min(0.5, step * 1.5);
  }
  return error;
}

// One connected component -> foam with a face per country and per lake.
//   targets[u]: wanted area of local country u (including any enclave it will hold)
function growComponent(n, edges, rotation, targets, options) {
  let embedded = options.embedded || seaFacingEmbedding(n, rotation);
  let sk = skeleton(n, embedded.rotation, embedded.sea || [0, 0]);
  sk.debug = options.debug;
  sk.coastWeight = options.coastWeight ?? 5;
  sk.softWeight = options.softWeight ?? 0.01;
  let total = targets.reduce((a, b) => a + b, 0);
  // sizes for the first drawing: countries by their target, water points small, sea points as
  // big as the coast they belong to
  let size = new Float64Array(sk.count);
  for (let v = 0; v < sk.count; ++v) if (sk.kind[v] === 'land') size[v] = Math.sqrt(targets[sk.owner[v]]);
  let small = Math.sqrt(targets.slice().sort((a, b) => a - b)[Math.floor(targets.length / 2)]) * 0.2;
  for (let v = 0; v < sk.count; ++v) if (sk.kind[v] === 'lake') size[v] = small;
  for (let t = 0; t < sk.tris.length; t += 3) {
    for (let k = 0; k < 3; ++k) {
      let v = sk.tris[t + k];
      if (sk.kind[v] !== 'sea') continue;
      for (let j = 1; j < 3; ++j) {
        let o = sk.tris[t + (k + j) % 3];
        if (sk.kind[o] === 'land') size[v] = Math.max(size[v], 0.5 * size[o]);
      }
    }
  }
  for (let v = 0; v < sk.count; ++v) if (!(size[v] > 0)) size[v] = small;
  let px = tutte(sk, Math.sqrt(total * 2 / Math.PI), options.plainTutte ? null : size);
  // the frame points tutte added: as big as the rim points they hold
  let grown = new Float64Array(sk.count);
  grown.set(size);
  sk.rim.forEach((p, i) => { grown[size.length + i] = size[p]; });
  size = grown;
  // A lake is as big as the ring of countries around it needs: an inner sea when the ring is
  // long (the face of a real ocean), a small lake where four countries meet.
  let lakeTarget = sk.lakes.map(lake => {
    let ring = lake.around.reduce((sum, u) => sum + Math.sqrt(targets[u]), 0);
    return options.lake * ring * ring / (4 * Math.PI);
  });

  // faces of the skeleton energy: countries, then lakes; sea points have none
  let faceCount = n + sk.lakes.length;
  sk.faceCount = faceCount;
  sk.faceOf = Int32Array.from(sk.kind.map((k, i) => k === 'land' ? sk.owner[i] : k === 'lake' ? n + sk.owner[i] : -1));
  let sorted = targets.slice().sort((a, b) => a - b);
  let floor = (options.floor ?? 0.02) * sorted[Math.floor(sorted.length / 2)];
  sk.target = new Float64Array(faceCount);
  sk.weight = new Float64Array(faceCount);
  // big countries count for more: the later stages move area only slowly across a continent
  let median = sorted[Math.floor(sorted.length / 2)];
  for (let u = 0; u < n; ++u) {
    sk.target[u] = Math.max(floor, targets[u]);
    sk.weight[u] = Math.min(options.bigWeight ?? 10, Math.max(1, Math.sqrt(targets[u] / median)));
  }
  sk.lakes.forEach((lake, i) => { sk.target[n + i] = Math.max(floor, lakeTarget[i]); sk.weight[n + i] = 0.3; });
  // how much of each triangle each corner gets (weighted kites): land by its size, water small
  let landSize = sk.kind.map((k, v) => k === 'land' ? Math.sqrt(targets[sk.owner[v]]) : 0).filter(w => w > 0).sort((a, b) => a - b);
  let waterWeight = 0.3 * landSize[Math.floor(landSize.length / 2)];
  sk.pointWeight = Float64Array.from(sk.kind, (k, v) => k === 'land' ? Math.sqrt(targets[sk.owner[v]]) : waterWeight);
  sk.share = new Float64Array(sk.tris.length);
  for (let t = 0; t < sk.tris.length; t += 3) {
    let [fa, fb, fc] = kiteShares(sk.pointWeight[sk.tris[t]], sk.pointWeight[sk.tris[t + 1]], sk.pointWeight[sk.tris[t + 2]]);
    sk.share[t] = fa; sk.share[t + 1] = fb; sk.share[t + 2] = fc;
  }
  // each triangle's share: a third of what each of its corners' faces wants per triangle
  let tris = sk.tris, triCount = tris.length / 3;
  let fanSize = new Float64Array(sk.count);
  for (let i = 0; i < tris.length; ++i) fanSize[tris[i]] += 1;
  let cornerShare = new Float64Array(sk.count);
  for (let v = 0; v < sk.count; ++v) {
    let f = sk.faceOf[v];
    if (f >= 0) cornerShare[v] = sk.target[f] / fanSize[v];
  }
  for (let pass = 0; pass < 3; ++pass) {
    // sea corners borrow the size of the land around them
    for (let t = 0; t < triCount; ++t) {
      let land = 0, count = 0;
      for (let k = 0; k < 3; ++k) {
        let v = tris[3 * t + k];
        if (sk.faceOf[v] >= 0 || cornerShare[v] > 0) { land += cornerShare[v]; count += 1; }
      }
      if (!count) continue;
      for (let k = 0; k < 3; ++k) {
        let v = tris[3 * t + k];
        if (sk.faceOf[v] < 0 && !(cornerShare[v] > 0)) cornerShare[v] = land / count;
      }
    }
  }
  sk.triTarget = new Float64Array(triCount);
  for (let t = 0; t < triCount; ++t) {
    sk.triTarget[t] = cornerShare[tris[3 * t]] + cornerShare[tris[3 * t + 1]] + cornerShare[tris[3 * t + 2]];
  }
  sk.triWeight = options.triWeight ?? 0.05;
  if (options.spread) spread(sk, px, size, options.spreadSweeps ?? 300);
  if (options.descend) descend(sk, px, options.descendMu ?? 0.05, options.sweeps ?? 300);
  for (let mu of options.shapeSchedule || [0.1, 0.01, 0.001]) shape(sk, px, mu, options.shapeIterations || 3000);

  // Kites -> one mesh, which flows to even out the areas, then becomes the foam
  let faceOfPoint = v => sk.kind[v] === 'land' ? sk.owner[v] : sk.kind[v] === 'lake' ? n + sk.owner[v] : OCEAN;
  let seaFace = n + sk.lakes.length;
  let mesh = kiteMesh(sk, px, faceOfPoint, seaFace);
  mesh.debug = options.debug;
  if (options.debug) console.log('kite mesh', mesh.px.length / 2, 'points', mesh.owner.length, 'triangles', 'rim', mesh.rim.length, 'valid', triangleAreas(mesh.tris, mesh.px, new Float64Array(mesh.owner.length)), ringIsSimple(mesh.rim, mesh.px));
  let realTarget = Float64Array.from({length: seaFace}, (_, f) => f < n ? targets[f] : lakeTarget[f - n]);
  if (options.flow) mesh.error = flow(mesh, realTarget, seaFace, seaFace, options.flowIterations ?? 60, 0.05);
  let foam = createFoam();
  for (let u = 0; u < n; ++u) foam.faces.push({owner: u, kind: 'land', target: targets[u], bias: 0});
  sk.lakes.forEach((lake, i) => foam.faces.push({owner: -1, kind: 'lake', target: lakeTarget[i], bias: 0}));
  let ids = new Int32Array(mesh.px.length / 2).fill(-1);
  let pointOf = v => {
    if (ids[v] < 0) ids[v] = addPoint(foam, mesh.px[2 * v], mesh.px[2 * v + 1]);
    return ids[v];
  };
  let polygons = [];
  for (let t = 0; t < mesh.owner.length; ++t) {
    let f = mesh.owner[t];
    if (f === seaFace) continue;
    polygons.push({face: f, ring: [mesh.tris[3 * t], mesh.tris[3 * t + 1], mesh.tris[3 * t + 2]]});
  }
  addPolygons(foam, polygons, pointOf);
  // segments inside one face are not boundaries
  foam.segs.forEach((s, id) => { if (!s.dead && s.l === s.r) dropSeg(foam, id); });
  compact(foam);
  return {foam, sk, px};
}

// A new face (an exclave, or a tiny country whose only neighbour is the host) as a small bump on
// the host's coast, bulging into the sea: it touches the host and the water, nothing else, and
// it can grow outwards without having to push any country aside. Hosts without a coast get an
// enclave inside instead (addEnclave).
function addCoastalBump(foam, host, owner, target) {
  let {x, y, segs} = foam;
  let water = f => f < 0 || foam.faces[f].kind === 'lake';
  // the host's coast segment with the most room in front of it
  let near = segmentGrid(foam, typicalCell(foam));
  let best = null;
  segs.forEach((s, id) => {
    if (s.dead) return;
    let sea = s.l === host ? s.r : s.r === host ? s.l : null;
    if (sea === null || !water(sea)) return;
    // keep away from the ends of the run, where borders meet the coast
    if (foam.inc[s.a].length !== 2 || foam.inc[s.b].length !== 2) return;
    let len = segLength(foam, s);
    let cx = 0.5 * (x[s.a] + x[s.b]), cy = 0.5 * (y[s.a] + y[s.b]);
    let clear = Infinity, reach = 2 * len;
    near(cx - reach, cy - reach, cx + reach, cy + reach, other => {
      if (other === id) return;
      let t = segs[other];
      if (t.dead) return;
      clear = Math.min(clear, pointSegment(cx, cy, x[t.a], y[t.a], x[t.b], y[t.b]));
    });
    let r = Math.min(0.45 * len, 0.4 * clear);
    let score = r * (sea < 0 ? 1.5 : 1);
    if (!best || score > best.score) best = {id, r, score, sea};
  });
  if (!best || !(best.r > 1e-9 * Math.sqrt(target))) return -1;
  let pick = best.id;
  let s = segs[pick];
  let [a, b] = s.l === host ? [s.a, s.b] : [s.b, s.a];
  let sea = best.sea;
  let dx = x[b] - x[a], dy = y[b] - y[a], len = Math.hypot(dx, dy);
  let ux = dx / len, uy = dy / len, nx = uy, ny = -ux;          // n points into the sea
  let cx = x[a] + 0.5 * dx, cy = y[a] + 0.5 * dy;
  let r = Math.min(best.r, Math.sqrt(2 * target / Math.PI));
  let face = foam.faces.push({owner, kind: 'land', target, bias: 0}) - 1;
  foam.faces[host].target -= target;
  dropSeg(foam, pick);
  let p0 = addPoint(foam, cx - r * ux, cy - r * uy), p1 = addPoint(foam, cx + r * ux, cy + r * uy);
  addSeg(foam, a, p0, host, sea);
  addSeg(foam, p0, p1, host, face);
  addSeg(foam, p1, b, host, sea);
  // the bulge, from p1 round to p0 through the sea: the bump is on its right (it turns
  // towards the sea, away from the host on the left of a -> b)
  let prev = p1;
  for (let k = 1; k < 8; ++k) {
    let angle = Math.PI * k / 8;
    let q = addPoint(foam, cx + r * Math.cos(angle) * ux + r * Math.sin(angle) * nx,
      cy + r * Math.cos(angle) * uy + r * Math.sin(angle) * ny);
    addSeg(foam, prev, q, sea, face);
    prev = q;
  }
  addSeg(foam, prev, p0, sea, face);
  foam.budget = null;
  return face;
}

// A small disc of a new face (an exclave, or a tiny country whose only neighbour is the host)
// inside a host face, where the host is widest and away from other enclaves. It starts at its
// final size when there is room, else smaller, and the relaxation does the rest.
function addEnclave(foam, host, owner, target) {
  let {x, y, segs} = foam;
  let edges = segs.filter(s => !s.dead && (s.l === host || s.r === host));
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  edges.forEach(s => {
    for (let v of [s.a, s.b]) {
      minX = Math.min(minX, x[v]); maxX = Math.max(maxX, x[v]);
      minY = Math.min(minY, y[v]); maxY = Math.max(maxY, y[v]);
    }
  });
  let inside = (px, py) => {
    let hit = false;
    edges.forEach(s => {
      let ax = x[s.a], ay = y[s.a], bx = x[s.b], by = y[s.b];
      if ((ay > py) !== (by > py) && px < (bx - ax) * (py - ay) / (by - ay) + ax) hit = !hit;
    });
    return hit;
  };
  let clearance = (px, py) => {
    let best = Infinity;
    edges.forEach(s => { best = Math.min(best, pointSegment(px, py, x[s.a], y[s.a], x[s.b], y[s.b])); });
    return best;
  };
  let best = null;
  let step = Math.max(maxX - minX, maxY - minY) / 20;
  let search = (x0, y0, x1, y1, d) => {
    for (let px = x0; px <= x1; px += d) for (let py = y0; py <= y1; py += d) {
      if (!inside(px, py)) continue;
      let c = clearance(px, py);
      if (!best || c > best.c) best = {x: px, y: py, c};
    }
  };
  search(minX + step / 2, minY + step / 2, maxX, maxY, step);
  for (let k = 0; k < 3 && best; ++k) {
    search(best.x - step, best.y - step, best.x + step, best.y + step, step / 4);
    step /= 4;
  }
  if (!best) throw new Error('No room for an enclave');
  let radius = Math.min(0.45 * best.c, Math.sqrt(target / Math.PI));
  let face = foam.faces.push({owner, kind: 'land', target, bias: 0}) - 1;
  foam.faces[host].target -= target;
  let ids = [];
  for (let i = 0; i < 16; ++i) {
    let angle = 2 * Math.PI * i / 16;
    ids.push(addPoint(foam, best.x + radius * Math.cos(angle), best.y + radius * Math.sin(angle)));
  }
  ids.forEach((p, i) => addSeg(foam, p, ids[(i + 1) % ids.length], face, host));
  foam.budget = null;
  return face;
}

// ---------------------------------------------------------------------------------------------
// Settling the sizes exactly. Local pressure moves area one border at a time; this moves it
// across the whole continent at once. Every boundary run gets one sideways offset (fading to
// zero at its ends, so junctions stay put), and the offsets are the smallest ones that give
// every country exactly its area, as one linear solve over the countries: water (sea and lakes)
// takes whatever is left. Offsets go through moveSafely, so nothing can cross; a run that gets
// held back is made stiffer for the next round, which then routes area around it.
function settle(foam, rounds = 30, tolerance = 2e-4) {
  let stiff = new Map();
  let worst = Infinity;
  for (let round = 0; round < rounds; ++round) {
    let arcs = arcsOf(foam);
    let area = faceAreas(foam);
    let {x, y, faces} = foam;
    let land = [], indexOf = new Int32Array(faces.length).fill(-1);
    faces.forEach((face, f) => { if (face.kind === 'land') { indexOf[f] = land.length; land.push(f); } });
    let m = land.length;
    let residual = new Float64Array(m);
    worst = 0;
    land.forEach((f, i) => {
      residual[i] = faces[f].target - area[f];
      worst = Math.max(worst, Math.abs(residual[i]) / faces[f].target);
    });
    if (worst < tolerance) break;
    // each run: its offset profile and how much area one unit of offset moves
    let runs = [];
    arcs.forEach(arc => {
      let p = arc.points;
      let interior = arc.ring ? p.slice(0, -1) : p.slice(1, -1);
      if (!interior.length) return;
      let along = [0];
      for (let k = 1; k < p.length; ++k) along.push(along[k - 1] + Math.hypot(x[p[k]] - x[p[k - 1]], y[p[k]] - y[p[k - 1]]));
      let total = along[along.length - 1];
      if (!(total > 0)) return;
      let moves = [], effect = 0;
      let start = arc.ring ? 0 : 1, end = arc.ring ? p.length - 1 : p.length - 1;
      for (let k = start; k < end; ++k) {
        let prev = p[k === 0 ? p.length - 2 : k - 1], next = p[k + 1];
        let tx = x[next] - x[prev], ty = y[next] - y[prev], len = Math.hypot(tx, ty);
        if (!(len > 0)) continue;
        let fade = arc.ring ? 1 : Math.sin(Math.PI * along[k] / total);
        // the right-hand normal: moving there grows the face on the left of the run
        moves.push([p[k], fade * ty / len, -fade * tx / len]);
        effect += fade * len / 2;
      }
      let l = arc.l >= 0 ? indexOf[arc.l] : -1, r = arc.r >= 0 ? indexOf[arc.r] : -1;
      if (l < 0 && r < 0) return;
      let key = arc.points[0] + ':' + arc.points[1];
      runs.push({l, r, moves, effect, weight: stiff.get(key) || 1, key});
    });
    // K = M W^-1 M^T, solve K lambda = residual
    let K = new Float64Array(m * m);
    runs.forEach(({l, r, effect, weight}) => {
      let c = effect * effect / weight;
      if (l >= 0) K[l * m + l] += c;
      if (r >= 0) K[r * m + r] += c;
      if (l >= 0 && r >= 0) { K[l * m + r] -= c; K[r * m + l] -= c; }
    });
    let trace = 0;
    for (let i = 0; i < m; ++i) trace += K[i * m + i];
    for (let i = 0; i < m; ++i) K[i * m + i] += 1e-12 * trace / m + 1e-300;
    let lambda = solveDense(K, Float64Array.from(residual), m);
    if (!lambda) break;
    let mx = new Float64Array(x.length), my = new Float64Array(x.length);
    runs.forEach(run => {
      // half the solution per round: areas are only linear in the offsets for small offsets
      let offset = 0.5 * run.effect / run.weight * ((run.l >= 0 ? lambda[run.l] : 0) - (run.r >= 0 ? lambda[run.r] : 0));
      run.offset = offset;
      run.moves.forEach(([v, nx, ny]) => { mx[v] += offset * nx; my[v] += offset * ny; });
    });
    let before = Float64Array.from(x), beforeY = Float64Array.from(y);
    for (let step = 0; step < 4; ++step) {
      moveSafely(foam, mx.map(v => v / 4), my.map(v => v / 4));
    }
    // runs that could not take their full offset get stiffer
    runs.forEach(run => {
      let want = 0, got = 0;
      run.moves.forEach(([v, nx, ny]) => {
        want += Math.abs(run.offset) * Math.hypot(nx, ny);
        got += Math.abs((foam.x[v] - before[v]) * nx + (foam.y[v] - beforeY[v]) * ny);
      });
      if (want > 0 && got < 0.7 * want) stiff.set(run.key, (stiff.get(run.key) || 1) * 8);
    });
  }
  return worst;
}

function solveDense(A, b, n) {
  // Gaussian elimination with partial pivoting
  for (let c = 0; c < n; ++c) {
    let pivot = c, best = Math.abs(A[c * n + c]);
    for (let r = c + 1; r < n; ++r) {
      let v = Math.abs(A[r * n + c]);
      if (v > best) { best = v; pivot = r; }
    }
    if (!(best > 0)) return null;
    if (pivot !== c) {
      for (let k = 0; k < n; ++k) { let t = A[c * n + k]; A[c * n + k] = A[pivot * n + k]; A[pivot * n + k] = t; }
      let t = b[c]; b[c] = b[pivot]; b[pivot] = t;
    }
    for (let r = c + 1; r < n; ++r) {
      let f = A[r * n + c] / A[c * n + c];
      if (!f) continue;
      for (let k = c; k < n; ++k) A[r * n + k] -= f * A[c * n + k];
      b[r] -= f * b[c];
    }
  }
  let out = new Float64Array(n);
  for (let r = n - 1; r >= 0; --r) {
    let sum = b[r];
    for (let k = r + 1; k < n; ++k) sum -= A[r * n + k] * out[k];
    out[r] = sum / A[r * n + r];
  }
  return out;
}

// ---------------------------------------------------------------------------------------------
// Hand-drawn wobble: every boundary run is pushed sideways by smooth 1D noise that fades out at
// its ends (junctions stay put). Coasts wobble more than borders. Moves go through moveSafely in
// small steps, so the wobble can never make two boundaries touch.
function hash(n) {
  n = (n ^ 61) ^ (n >>> 16);
  n = Math.imul(n, 9);
  n ^= n >>> 4;
  n = Math.imul(n, 0x27d4eb2d);
  n ^= n >>> 15;
  return (n >>> 0) / 4294967296;
}

function valueNoise(t, seed) {
  let i = Math.floor(t), f = t - i;
  let a = hash(i * 7919 + seed) * 2 - 1, b = hash((i + 1) * 7919 + seed) * 2 - 1;
  let u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}

function fbm(t, seed) {
  let sum = 0, amp = 1, norm = 0;
  for (let o = 0; o < 4; ++o) {
    sum += amp * valueNoise(t, seed + o * 101);
    norm += amp;
    t *= 2.03; amp *= 0.55;
  }
  return sum / norm;
}

function wobble(foam, random, options = {}) {
  let {coast = 0.07, border = 0.035, wave = 0.45, steps = 10} = options;
  let arcs = arcsOf(foam);
  let {x, y} = foam;
  let count = x.length;
  let dx = new Float64Array(count), dy = new Float64Array(count);
  let land = f => f >= 0 && foam.faces[f].kind === 'land';
  arcs.forEach(arc => {
    let size = Math.sqrt(Math.min(targetOf(foam, arc.l), targetOf(foam, arc.r)));
    if (!isFinite(size)) return;
    let amp = (land(arc.l) && land(arc.r) ? border : coast) * size;
    let seed = Math.floor(random() * 1e9);
    let p = arc.points;
    let along = [0];
    for (let k = 1; k < p.length; ++k) along.push(along[k - 1] + Math.hypot(x[p[k]] - x[p[k - 1]], y[p[k]] - y[p[k - 1]]));
    let total = along[along.length - 1];
    if (!(total > 0)) return;
    let last = arc.ring ? p.length - 1 : p.length - 1;
    for (let k = arc.ring ? 0 : 1; k < last; ++k) {
      let v = p[k];
      let prev = p[k === 0 ? p.length - 2 : k - 1], next = p[k + 1];
      let tx = x[next] - x[prev], ty = y[next] - y[prev];
      let len = Math.hypot(tx, ty) || 1;
      let t = along[k] / total;
      let fade = arc.ring ? 1 : Math.min(1, 4 * t, 4 * (1 - t));
      let n;
      if (arc.ring) {
        // periodic: a few harmonics around the ring
        n = 0;
        for (let h = 2; h <= 6; ++h) n += Math.sin(2 * Math.PI * h * t + hash(seed + h) * 6.283) / h;
        n *= 0.8;
      } else {
        n = fbm(along[k] / (wave * size), seed);
      }
      let d = amp * n * fade;
      dx[v] += -ty / len * d;
      dy[v] += tx / len * d;
    }
  });
  for (let k = 0; k < steps; ++k) {
    let mx = Float64Array.from(dx, v => v / steps), my = Float64Array.from(dy, v => v / steps);
    moveSafely(foam, mx, my);
  }
}

// ---------------------------------------------------------------------------------------------
// The world: every component of the graph grown into a continent, every country without
// neighbours an island, all of it laid out on one sea.
//   doc: countries.json; options.planarSubgraph(n, edges) -> {kept, removed, rotation}
export async function buildWorld(doc, options = {}) {
  let {seed = 1, planarSubgraph, onProgress = () => {}, exclaveShare = 0.1, scale = 1e-6} = options;
  let random = mulberry32(seed);
  let fields = doc.fields;
  let at = name => fields.indexOf(name);
  let countries = doc.nodes.map((row, i) => ({
    index: i, id: row[at('id')], name: row[at('label')], continent: row[at('continent')],
    population: row[at('population')] || 0, rings: [],
  }));
  let pop = g => countries[g].population;
  let links = [];
  for (let i = 0; i + 1 < doc.links.length; i += 2) links.push([doc.links[i], doc.links[i + 1]]);
  let keyOf = (a, b) => a < b ? a + ',' + b : b + ',' + a;

  // Plan: which links are drawn as shared borders and which as exclaves. Links that cannot be
  // drawn flat, links that would wall in an ocean, and links that would hold a peninsula inside
  // a pocket of its continent become exclaves; cutting the last kind turns the peninsula into
  // its own landmass, out in the open sea.
  let cut = new Set();
  let plans = null;
  for (let attempt = 0; attempt < 4; ++attempt) {
    let drawn = links.filter(([a, b]) => !cut.has(keyOf(a, b)));
    let parent = countries.map((c, i) => i);
    let find = i => parent[i] === i ? i : (parent[i] = find(parent[i]));
    drawn.forEach(([a, b]) => { parent[find(a)] = find(b); });
    let groups = new Map();
    countries.forEach(c => {
      if (!(c.population > 0)) return;
      let r = find(c.index);
      if (!groups.has(r)) groups.set(r, []);
      groups.get(r).push(c.index);
    });
    plans = [];
    let pocketCuts = [];
    Array.from(groups.values()).sort((a, b) => b.length - a.length).forEach(members => {
      if (members.length === 1) { plans.push({members}); return; }
      let inGroup = new Set(members);
      let near = new Map(members.map(g => [g, []]));
      drawn.forEach(([a, b]) => { if (inGroup.has(a) && inGroup.has(b)) { near.get(a).push(b); near.get(b).push(a); } });
      // tiny countries whose only neighbour is much bigger come back later as coastal bumps
      let tiny = members.filter(g => near.get(g).length === 1 && pop(g) < 0.02 * pop(near.get(g)[0]) &&
        near.get(near.get(g)[0]).length > 1);
      let tinySet = new Set(tiny);
      let core = members.filter(g => !tinySet.has(g));
      let local = new Map(core.map((g, i) => [g, i]));
      let edges = [];
      drawn.forEach(([a, b]) => { if (local.has(a) && local.has(b)) edges.push([local.get(a), local.get(b)]); });
      let targets = core.map(g => pop(g) * scale);
      // which links become exclaves: the cheapest set (smallest countries), and for other worlds
      // than the first, a different but still smallest set, picked by the seed
      let jitter = edges.map(() => seed === 1 ? 1 : 0.2 + random());
      let planar = planarSubgraph(core.length, edges, {seed,
        weight: k => jitter[k] * Math.min(targets[edges[k][0]], targets[edges[k][1]])});
      let embedded = seaFacingEmbedding(core.length, planar.rotation, u => targets[u]);
      // only a big piece hanging by a single link is worth cutting loose (one exclave); smaller
      // pockets stay where they are, as countries around an inner sea
      let total = targets.reduce((sum, t) => sum + t, 0);
      embedded.pockets.forEach(({at: v, links: list}) => {
        if (list.length !== 1 || attempt > 0) return;
        let w = list[0], seen = new Set([v, w]), stack = [w], weight = 0;
        while (stack.length) {
          let u = stack.pop();
          weight += targets[u];
          embedded.rotation[u].forEach(x => { if (!seen.has(x)) { seen.add(x); stack.push(x); } });
        }
        if (weight >= 0.03 * total && weight <= 0.5 * total) pocketCuts.push(keyOf(core[v], core[w]));
      });
      let dropped = planar.removed.map(k => edges[k]);
      if (embedded.sea) {
        let opened = openSeas(embedded.rotation, embedded.sea, u => targets[u], options.longestLake ?? 8);
        embedded = {rotation: opened.rotation, sea: opened.sea};
        dropped.push(...opened.dropped);
      }
      plans.push({members, core, local, tiny, near, embedded, dropped: dropped.map(([a, b]) => [core[a], core[b]])});
    });
    if (!pocketCuts.length) break;
    pocketCuts.forEach(k => cut.add(k));
  }
  // every link not drawn as a border becomes an exclave of the smaller country
  let exclaves = [];
  let owed = new Float64Array(countries.length);
  let pieces = [];
  let addExclave = (a, b) => {
    let [owner, host] = pop(a) <= pop(b) ? [a, b] : [b, a];
    exclaves.push({owner: countries[owner].id, host: countries[host].id});
    let target = exclaveShare * pop(owner) * scale * Math.pow(1 - exclaveShare, owed[owner]);
    owed[owner] += 1;
    pieces.push({owner, host, target});
  };
  cut.forEach(k => { let [a, b] = k.split(',').map(Number); addExclave(a, b); });
  plans.forEach(plan => (plan.dropped || []).forEach(([a, b]) => addExclave(a, b)));
  let mainTarget = g => pop(g) * scale * Math.pow(1 - exclaveShare, owed[g]);

  let landmasses = [];
  let lakes = [];
  let done = 0, work = plans.reduce((s, p) => s + (p.members.length > 1 ? p.members.length : 0.05), 0);
  let report = () => onProgress({stage: 'shaping', done: done / work});
  for (let plan of plans) {
    let {members} = plan;
    if (members.length === 1) {
      let c = countries[members[0]];
      let ring = island(mainTarget(c.index), random);
      let length = 0;
      ring.forEach((p, k) => { let q = ring[(k + 1) % ring.length]; length += Math.hypot(q[0] - p[0], q[1] - p[1]); });
      let byCountry = new Map([[c.index, [ring]]]);
      landmasses.push({members, byCountry, lakes: [],
        lines: [{a: c.index, b: -1, points: ring.concat([ring[0]]).map(p => p.slice()), length, kind: 'coast'}]});
      done += 0.05;
      continue;
    }
    let {core, local, tiny, near, embedded} = plan;
    let targets = core.map(mainTarget);
    let enclaves = pieces.filter(e => local.has(e.host));
    tiny.forEach(g => enclaves.push({owner: g, host: near.get(g)[0], target: mainTarget(g)}));
    let growTargets = targets.slice();
    enclaves.forEach(e => { growTargets[local.get(e.host)] += e.target; });
    let {foam} = growComponent(core.length, [], null, growTargets, {lake: 0.05, embedded, ...options.grow});
    // land faces name their country by its index in the graph from here on
    foam.faces.forEach(face => { if (face.kind === 'land') face.owner = core[face.owner]; });
    let check = options.check || (() => {});
    check('start', foam);
    relax(foam, {iterations: options.shapeIterations ?? 250, retract: 1, junctionTension: options.junctionPull ?? 1});
    check('shape', foam);
    report(); await pause();
    enclaves.forEach(e => {
      let host = local.get(e.host);
      if (addCoastalBump(foam, host, e.owner, e.target) < 0) addEnclave(foam, host, e.owner, e.target);
    });
    check('bumps', foam);
    relax(foam, {iterations: 300, integral: 0.1, tension: 0.1, tolerance: 0.01});
    check('exact', foam);
    report(); await pause();
    if (options.wobble) { wobble(foam, random); report(); await pause(); }
    let error = relax(foam, {iterations: 400, integral: 0.15, tension: 0.02, junctionTension: 0.05,
      resampleEvery: 20, tolerance: 0.001});
    unfold(foam);
    check('final', foam);
    let rings = faceRings(foam);
    let byCountry = new Map();
    let lakeRings = [];
    foam.faces.forEach((face, f) => {
      if (face.kind !== 'land') { lakeRings.push(...rings[f]); return; }
      if (!byCountry.has(face.owner)) byCountry.set(face.owner, []);
      byCountry.get(face.owner).push(...rings[f]);
    });
    // boundary runs, for drawing: borders between two countries and coasts
    let lines = [];
    arcsOf(foam).forEach(arc => {
      let side = f => f >= 0 && foam.faces[f].kind === 'land' ? foam.faces[f].owner : -1;
      let a = side(arc.l), b = side(arc.r);
      let points = arc.points.map(v => [foam.x[v], foam.y[v]]);
      let length = 0;
      for (let k = 1; k < points.length; ++k) length += Math.hypot(points[k][0] - points[k - 1][0], points[k][1] - points[k - 1][1]);
      lines.push({a, b, points, length, kind: a >= 0 && b >= 0 ? 'border' : 'coast'});
    });
    landmasses.push({members, byCountry, lakes: lakeRings, lines, error});
    done += members.length;
    report(); await pause();
  }
  landmasses.forEach(mass => { mass.rings = Array.from(mass.byCountry.values()); });
  layOut(landmasses, countries, random);
  let lines = [];
  landmasses.forEach(mass => {
    mass.byCountry.forEach((rings, g) => { countries[g].rings.push(...rings); });
    lakes.push(...mass.lakes);
    lines.push(...mass.lines);
  });
  return {countries, lakes, lines, exclaves, links};
}

function pause() {
  return new Promise(resolve => setTimeout(resolve, 0));
}

// An island of exactly the given area: a wobbly disc, scaled to size
function island(area, random) {
  let count = 48;
  let phase = [], amp = [];
  for (let h = 2; h <= 9; ++h) { phase.push(random() * Math.PI * 2); amp.push((0.25 + 0.75 * random()) * 0.22 / h); }
  let ring = [];
  for (let i = 0; i < count; ++i) {
    let angle = 2 * Math.PI * i / count;
    let r = 1;
    amp.forEach((a, k) => { r += a * Math.sin((k + 2) * angle + phase[k]); });
    ring.push([r * Math.cos(angle), r * Math.sin(angle)]);
  }
  let a = 0;
  ring.forEach((p, i) => { let q = ring[(i + 1) % count]; a += 0.5 * (p[0] * q[1] - q[0] * p[1]); });
  let k = Math.sqrt(area / a);
  return ring.map(([x, y]) => [x * k, y * k]);
}

// Landmasses on one sea: biggest first, each next one as close to its continent's land as the
// sea gap allows. Placement checks the actual outlines (grid of cells, dilated by the gap).
function layOut(masses, countries, random) {
  masses.forEach(mass => {
    let xs = [], ys = [], area = 0;
    mass.rings.forEach(list => list.forEach(ring => ring.forEach(([x, y]) => { xs.push(x); ys.push(y); })));
    mass.minX = Math.min(...xs); mass.maxX = Math.max(...xs);
    mass.minY = Math.min(...ys); mass.maxY = Math.max(...ys);
    mass.members.forEach(g => { area += countries[g].population; });
    mass.weight = area;
    let tally = new Map();
    mass.members.forEach(g => tally.set(countries[g].continent, (tally.get(countries[g].continent) || 0) + countries[g].population + 1));
    mass.continent = Array.from(tally.entries()).sort((a, b) => b[1] - a[1])[0][0];
  });
  let order = masses.slice().sort((a, b) => b.weight - a.weight);
  let biggest = order[0];
  let span = Math.max(biggest.maxX - biggest.minX, biggest.maxY - biggest.minY);
  let cell = span / 160;
  let occupied = new Set();
  let key = (i, j) => (i + 50000) * 100000 + (j + 50000);
  // Cells a landmass covers: every row from its westmost to its eastmost outline, so its lakes,
  // inland seas and bays count as taken too and no island lands inside them.
  let footprint = (mass, gapCells) => {
    let cells = new Set();
    let rows = new Map();
    let trace = ring => ring.forEach(([x0, y0], k) => {
      let [x1, y1] = ring[(k + 1) % ring.length];
      let steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / (cell * 0.5)));
      for (let s = 0; s <= steps; ++s) {
        let i = Math.floor((x0 + (x1 - x0) * s / steps) / cell), j = Math.floor((y0 + (y1 - y0) * s / steps) / cell);
        if (!rows.has(j)) rows.set(j, [i, i]);
        let r = rows.get(j);
        r[0] = Math.min(r[0], i); r[1] = Math.max(r[1], i);
      }
    });
    mass.rings.forEach(list => list.forEach(trace));
    mass.lakes.forEach(trace);
    rows.forEach(([i0, i1], j) => {
      for (let i = i0 - gapCells; i <= i1 + gapCells; ++i) {
        for (let dj = -gapCells; dj <= gapCells; ++dj) cells.add(key(i, j + dj));
      }
    });
    return Array.from(cells, k => [Math.floor(k / 100000) - 50000, (k % 100000) - 50000]);
  };
  let fits = (cells, di, dj) => cells.every(([i, j]) => !occupied.has(key(i + di, j + dj)));
  let homes = new Map();
  order.forEach((mass, n) => {
    let size = Math.sqrt(mass.weight * 1e-6);
    let gap = Math.max(2, Math.ceil(Math.max(0.6 * size, span * 0.012) / cell));
    let cells = footprint(mass, gap);
    let own = footprint(mass, 0);
    let cx = 0.5 * (mass.minX + mass.maxX), cy = 0.5 * (mass.minY + mass.maxY);
    let anchor;
    if (n === 0) anchor = [cx, cy];
    else if (homes.has(mass.continent)) anchor = homes.get(mass.continent);
    else {
      // a new continent: beside everything placed so far, on a side picked by the seed
      let angle = random() * Math.PI * 2;
      anchor = [biggest.minX + span * (0.5 + 0.8 * Math.cos(angle)), biggest.minY + span * (0.5 + 0.8 * Math.sin(angle))];
    }
    let ti = Math.round((anchor[0] - cx) / cell), tj = Math.round((anchor[1] - cy) / cell);
    let found = null;
    for (let radius = 0; radius < 2000 && !found; ++radius) {
      let candidates = [];
      for (let a = -radius; a <= radius; ++a) {
        candidates.push([a, -radius], [a, radius], [-radius, a], [radius, a]);
      }
      for (let k = candidates.length - 1; k > 0; --k) {
        let j = Math.floor(random() * (k + 1));
        [candidates[k], candidates[j]] = [candidates[j], candidates[k]];
      }
      for (let [a, b] of candidates) {
        if (fits(cells, ti + a, tj + b)) { found = [ti + a, tj + b]; break; }
      }
    }
    let ox = found[0] * cell, oy = found[1] * cell;
    mass.rings.forEach(list => list.forEach(ring => ring.forEach(p => { p[0] += ox; p[1] += oy; })));
    mass.lakes.forEach(ring => ring.forEach(p => { p[0] += ox; p[1] += oy; }));
    mass.lines.forEach(line => line.points.forEach(p => { p[0] += ox; p[1] += oy; }));
    own.forEach(([i, j]) => occupied.add(key(i + found[0], j + found[1])));
    // where this landmass's continents are, for later islands of the same continent
    let sums = new Map();
    mass.members.forEach(g => {
      let c = countries[g];
      let ring = (mass.byCountry.get(g) || [])[0];
      if (!ring || homes.has(c.continent)) return;
      let x = 0, y = 0;
      ring.forEach(p => { x += p[0]; y += p[1]; });
      let sum = sums.get(c.continent) || [0, 0, 0];
      let w = c.population + 1;
      sums.set(c.continent, [sum[0] + w * x / ring.length, sum[1] + w * y / ring.length, sum[2] + w]);
    });
    sums.forEach(([x, y, w], continent) => homes.set(continent, [x / w, y / w]));
  });
}

// Opens up any point where a boundary nearly folds back on itself (a spike of no width), by
// moving it towards the middle of its neighbours; safe moves only.
function unfold(foam, rounds = 30) {
  for (let round = 0; round < rounds; ++round) {
    let {x, y, segs, inc} = foam;
    let mx = new Float64Array(x.length), my = new Float64Array(x.length);
    let any = false;
    inc.forEach((list, v) => {
      for (let i = 0; i < list.length; ++i) for (let j = i + 1; j < list.length; ++j) {
        let s1 = segs[list[i]], s2 = segs[list[j]];
        let a = s1.a === v ? s1.b : s1.a, b = s2.a === v ? s2.b : s2.a;
        let ax = x[a] - x[v], ay = y[a] - y[v], bx = x[b] - x[v], by = y[b] - y[v];
        if (ax * bx + ay * by <= 0.999 * Math.hypot(ax, ay) * Math.hypot(bx, by)) continue;
        any = true;
        mx[v] += 0.5 * ((x[a] + x[b]) / 2 - x[v]); my[v] += 0.5 * ((y[a] + y[b]) / 2 - y[v]);
      }
    });
    if (!any) break;
    moveSafely(foam, mx, my);
  }
}

// Every boundary problem the rules care about, found by brute force over a grid: two segments
// that share no point but cross or touch, and a boundary folding back on itself at a point.
export function foamProblems(foam) {
  let {x, y, segs, inc} = foam;
  let problems = [];
  let near = segmentGrid(foam, typicalCell(foam));
  segs.forEach((s, id) => {
    if (s.dead) return;
    near(Math.min(x[s.a], x[s.b]), Math.min(y[s.a], y[s.b]), Math.max(x[s.a], x[s.b]), Math.max(y[s.a], y[s.b]), other => {
      if (other <= id) return;
      let t = segs[other];
      if (t.dead || sharesPoint(s, t)) return;
      if (segmentsCross(x[s.a], y[s.a], x[s.b], y[s.b], x[t.a], y[t.a], x[t.b], y[t.b]) || touches(foam, s, t)) {
        problems.push({kind: 'cross', faces: [s.l, s.r, t.l, t.r], at: [x[s.a], y[s.a]]});
      }
    });
  });
  inc.forEach((list, v) => {
    for (let i = 0; i < list.length; ++i) for (let j = i + 1; j < list.length; ++j) {
      let s1 = segs[list[i]], s2 = segs[list[j]];
      let a = s1.a === v ? s1.b : s1.a, b = s2.a === v ? s2.b : s2.a;
      let ax = x[a] - x[v], ay = y[a] - y[v], bx = x[b] - x[v], by = y[b] - y[v];
      if (ax * bx + ay * by > 0.9999 * Math.hypot(ax, ay) * Math.hypot(bx, by)) problems.push({kind: 'fold', at: [x[v], y[v]]});
    }
    // a face meeting itself at this point
    let seen = new Map();
    list.forEach(id => {
      let s = segs[id];
      let left = s.a === v ? s.l : s.r;          // the face on the left going out of v
      if (left >= 0) seen.set(left, (seen.get(left) || 0) + 1);
    });
    seen.forEach((n, f) => { if (n > 1) problems.push({kind: 'pinch', face: f, at: [x[v], y[v]]}); });
  });
  return problems;
}

export const internals = {settle, openSeas, addEnclave, addCoastalBump, wobble, seaFacingEmbedding, skeleton, tutte, growComponent, relax, faceAreas, faceRings, arcsOf};
