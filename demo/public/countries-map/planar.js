// planar.js - planarity testing, planar embedding, face tracing and
// minimum planarizing edge deletion. Dependency-free ES module (browser and
// Node 18+).
//
// Exports
//   planarEmbedding(n, edges)          -> rotation | null
//   faces(rotation)                    -> [[ [u, v], ... ], ...]
//   planarSubgraph(n, edges, options)  -> { kept, removed, rotation, optimal,
//                                          weightOptimal, lowerBound, stats }
//   isPlanar(n, edges)                 -> boolean
//   kuratowskiSubgraph(n, edges, seed) -> [edgeIndex...] | null
//
// Graph input everywhere: nodes are 0..n-1, `edges` is an array of [u, v]
// pairs. Self-loops and repeated pairs are ignored by the planarity code (they
// never affect planarity); planarSubgraph reports a repeated pair with the same
// fate as its first occurrence and always keeps self-loops.
//
// Orientation conventions (shared by all functions)
//   rotation[v] lists the neighbours of v in COUNTER-CLOCKWISE order (as they
//   would appear around v in a straight-line drawing, angles increasing).
//   A face is traced so that it lies to the LEFT of each of its half-edges:
//   after the half-edge u->v comes v->w, where w is the neighbour that follows
//   u CLOCKWISE around v, i.e. the entry just BEFORE u in rotation[v] (cyclic).
//   With real coordinates whose angular order matches `rotation`, every
//   bounded face is therefore traversed counter-clockwise (positive signed
//   area) and the outer face of each component clockwise.
//
// The planarity test is the Left-Right planarity test of U. Brandes,
// "The Left-Right Planarity Test" (2009), following the structure of the
// networkx implementation (nx.algorithms.planarity.LRPlanarity), written
// iteratively over typed arrays; it runs in linear time (bucket sorts are
// used for the nesting-depth orders).

const NONE = -1;

// ---------------------------------------------------------------------------
// Left-Right planarity core
// ---------------------------------------------------------------------------

function makeWorkspace(n, m) {
  n = Math.max(n, 1);
  m = Math.max(m, 1);
  return {
    capN: n,
    capM: m,
    adjStart: new Int32Array(n + 1),
    adjList: new Int32Array(2 * m),
    height: new Int32Array(n),
    parentEdge: new Int32Array(n),
    ptr: new Int32Array(n),
    vstack: new Int32Array(n),
    roots: new Int32Array(n),
    src: new Int32Array(m),
    dst: new Int32Array(m),
    oriented: new Uint8Array(m),
    lowpt: new Int32Array(m),
    lowpt2: new Int32Array(m),
    nd: new Int32Array(m),
    ref: new Int32Array(m),
    side: new Int8Array(m),
    lowptEdge: new Int32Array(m),
    stackBottom: new Int32Array(m),
    outStart: new Int32Array(n + 1),
    outList: new Int32Array(m),
    sorted: new Int32Array(m),
    bucket: new Int32Array(4 * n + 4),
    // conflict-pair stack: L.low, L.high, R.low, R.high, identity
    sLl: new Int32Array(m + 1),
    sLh: new Int32Array(m + 1),
    sRl: new Int32Array(m + 1),
    sRh: new Int32Array(m + 1),
    sId: new Int32Array(m + 1),
    sp: 0,
    nextId: 0,
    chain: new Int32Array(m),
    // embedding: half-edge 2e lives at src[e] and points to dst[e];
    // 2e+1 lives at dst[e] and points to src[e]. nxt = clockwise successor
    // around the vertex, prv = counter-clockwise successor.
    nxt: new Int32Array(2 * m),
    prv: new Int32Array(2 * m),
    head: new Int32Array(n),
    leftRef: new Int32Array(n),
    rightRef: new Int32Array(n),
  };
}

// Sort the oriented edges by key[e] + offset (range 0..range-1) and group
// them by source vertex; result in outStart/outList (stable counting sorts).
function sortOutEdges(ws, n, m, key, offset, range) {
  const { bucket, sorted, outStart, outList, src } = ws;
  bucket.fill(0, 0, range + 1);
  for (let e = 0; e < m; e++) bucket[key[e] + offset + 1]++;
  for (let k = 0; k < range; k++) bucket[k + 1] += bucket[k];
  for (let e = 0; e < m; e++) sorted[bucket[key[e] + offset]++] = e;
  outStart.fill(0, 0, n + 1);
  for (let e = 0; e < m; e++) outStart[src[e] + 1]++;
  for (let v = 0; v < n; v++) outStart[v + 1] += outStart[v];
  const cursor = ws.ptr;
  for (let v = 0; v < n; v++) cursor[v] = outStart[v];
  for (let i = 0; i < m; i++) {
    const e = sorted[i];
    outList[cursor[src[e]]++] = e;
  }
}

// Runs the LR test on the simple graph (n, eu[0..m), ev[0..m)).
// Returns false when non-planar, true when planar. When `embed` is true and
// the graph is planar, the rotation system is left in ws.nxt/ws.prv/ws.head.
function lrCore(ws, n, m, eu, ev, embed) {
  if (n > 2 && m > 3 * n - 6) return false;
  if (m === 0) {
    if (embed) ws.head.fill(NONE, 0, n);
    return true;
  }
  const {
    adjStart, adjList, height, parentEdge, ptr, vstack, roots, src, dst,
    oriented, lowpt, lowpt2, nd, ref, side, lowptEdge, stackBottom,
  } = ws;

  // adjacency lists (edge ids)
  adjStart.fill(0, 0, n + 1);
  for (let e = 0; e < m; e++) {
    adjStart[eu[e] + 1]++;
    adjStart[ev[e] + 1]++;
  }
  for (let v = 0; v < n; v++) adjStart[v + 1] += adjStart[v];
  for (let v = 0; v < n; v++) ptr[v] = adjStart[v];
  for (let e = 0; e < m; e++) {
    adjList[ptr[eu[e]]++] = e;
    adjList[ptr[ev[e]]++] = e;
  }

  // ---- phase 1: DFS orientation, lowpoints, nesting depths
  height.fill(NONE, 0, n);
  parentEdge.fill(NONE, 0, n);
  oriented.fill(0, 0, m);
  for (let v = 0; v < n; v++) ptr[v] = adjStart[v];
  let nRoots = 0;
  for (let r = 0; r < n; r++) {
    if (height[r] !== NONE) continue;
    height[r] = 0;
    roots[nRoots++] = r;
    let sp = 0;
    vstack[sp++] = r;
    while (sp > 0) {
      const v = vstack[sp - 1];
      let e;
      let fv;
      if (ptr[v] < adjStart[v + 1]) {
        e = adjList[ptr[v]++];
        if (oriented[e]) continue;
        oriented[e] = 1;
        const w = eu[e] === v ? ev[e] : eu[e];
        src[e] = v;
        dst[e] = w;
        lowpt[e] = height[v];
        lowpt2[e] = height[v];
        if (height[w] === NONE) { // tree edge
          parentEdge[w] = e;
          height[w] = height[v] + 1;
          vstack[sp++] = w;
          continue;
        }
        lowpt[e] = height[w]; // back edge
        fv = v;
      } else {
        sp--;
        e = parentEdge[v];
        if (e === NONE) continue;
        fv = src[e];
      }
      // finish edge e = (fv, .): nesting depth and parent's lowpoints
      nd[e] = 2 * lowpt[e] + (lowpt2[e] < height[fv] ? 1 : 0);
      const pe = parentEdge[fv];
      if (pe !== NONE) {
        if (lowpt[e] < lowpt[pe]) {
          lowpt2[pe] = Math.min(lowpt[pe], lowpt2[e]);
          lowpt[pe] = lowpt[e];
        } else if (lowpt[e] > lowpt[pe]) {
          lowpt2[pe] = Math.min(lowpt2[pe], lowpt[e]);
        } else {
          lowpt2[pe] = Math.min(lowpt2[pe], lowpt2[e]);
        }
      }
    }
  }

  // ---- phase 2: testing
  sortOutEdges(ws, n, m, nd, 0, 2 * n + 2);
  const { outStart, outList, sLl, sLh, sRl, sRh, sId } = ws;
  ref.fill(NONE, 0, m);
  side.fill(1, 0, m);
  ws.sp = 0;
  ws.nextId = 0;

  for (let ri = 0; ri < nRoots; ri++) {
    const r = roots[ri];
    let vsp = 0;
    vstack[vsp++] = r;
    ptr[r] = outStart[r];
    while (vsp > 0) {
      const v = vstack[vsp - 1];
      let ei;
      let at;
      if (ptr[v] < outStart[v + 1]) {
        ei = outList[ptr[v]++];
        stackBottom[ei] = ws.sp > 0 ? sId[ws.sp - 1] : NONE;
        const w = dst[ei];
        if (parentEdge[w] === ei) { // tree edge: descend
          ptr[w] = outStart[w];
          vstack[vsp++] = w;
          continue;
        }
        // back edge
        lowptEdge[ei] = ei;
        const t = ws.sp++;
        sLl[t] = NONE; sLh[t] = NONE; sRl[t] = ei; sRh[t] = ei;
        sId[t] = ws.nextId++;
        at = v;
      } else {
        vsp--;
        ei = parentEdge[v];
        if (ei === NONE) continue;
        removeBackEdges(ws, ei);
        at = src[ei];
      }
      // integrate new return edges of ei into the constraints of `at`
      if (lowpt[ei] < height[at]) {
        const e = parentEdge[at];
        if (ei === outList[outStart[at]]) {
          lowptEdge[e] = lowptEdge[ei];
        } else if (!addConstraints(ws, ei, e)) {
          return false;
        }
      }
    }
  }
  if (!embed) return true;

  // ---- phase 3: embedding
  const { chain } = ws;
  for (let e0 = 0; e0 < m; e0++) {
    // sign(e0): resolve relative sides along the ref chain
    let e = e0;
    let k = 0;
    while (ref[e] !== NONE) {
      chain[k++] = e;
      e = ref[e];
    }
    for (let i = k - 1; i >= 0; i--) {
      const x = chain[i];
      side[x] *= side[ref[x]];
      ref[x] = NONE;
    }
    nd[e0] *= side[e0];
  }
  sortOutEdges(ws, n, m, nd, 2 * n + 1, 4 * n + 3);

  const { nxt, prv, head, leftRef, rightRef } = ws;
  // initial cyclic (clockwise) order at v: parent half-edge, then the
  // outgoing edges by signed nesting depth
  for (let v = 0; v < n; v++) {
    let first = NONE;
    let last = NONE;
    const pe = parentEdge[v];
    if (pe !== NONE) first = last = 2 * pe + 1;
    for (let i = outStart[v]; i < outStart[v + 1]; i++) {
      const h = 2 * outList[i];
      if (first === NONE) first = h;
      else { nxt[last] = h; prv[h] = last; }
      last = h;
    }
    head[v] = first;
    if (first !== NONE) { nxt[last] = first; prv[first] = last; }
  }
  for (let ri = 0; ri < nRoots; ri++) {
    const r = roots[ri];
    let vsp = 0;
    vstack[vsp++] = r;
    ptr[r] = outStart[r];
    while (vsp > 0) {
      const v = vstack[vsp - 1];
      if (ptr[v] >= outStart[v + 1]) { vsp--; continue; }
      const ei = outList[ptr[v]++];
      const w = dst[ei];
      if (parentEdge[w] === ei) {
        leftRef[v] = 2 * ei;
        rightRef[v] = 2 * ei;
        ptr[w] = outStart[w];
        vstack[vsp++] = w;
      } else {
        const h = 2 * ei + 1; // half-edge at w pointing to v
        if (side[ei] === 1) { // directly clockwise after rightRef[w]
          const a = rightRef[w];
          const b = nxt[a];
          nxt[a] = h; prv[h] = a; nxt[h] = b; prv[b] = h;
        } else { // directly counter-clockwise before leftRef[w]
          const a = leftRef[w];
          const b = prv[a];
          prv[a] = h; nxt[h] = a; prv[h] = b; nxt[b] = h;
          leftRef[w] = h;
        }
      }
    }
  }
  return true;
}

function intervalEmpty(low, high) {
  return low === NONE && high === NONE;
}

function addConstraints(ws, ei, e) {
  const { lowpt, ref, lowptEdge, stackBottom, sLl, sLh, sRl, sRh, sId } = ws;
  let pLl = NONE, pLh = NONE, pRl = NONE, pRh = NONE;
  // merge return edges of ei into P.R
  do {
    const t = --ws.sp;
    let qLl = sLl[t], qLh = sLh[t], qRl = sRl[t], qRh = sRh[t];
    if (!intervalEmpty(qLl, qLh)) {
      let x = qLl; qLl = qRl; qRl = x;
      x = qLh; qLh = qRh; qRh = x;
    }
    if (!intervalEmpty(qLl, qLh)) return false;
    if (lowpt[qRl] > lowpt[e]) { // merge intervals
      if (intervalEmpty(pRl, pRh)) pRh = qRh;
      else ref[pRl] = qRh;
      pRl = qRl;
    } else { // align
      ref[qRl] = lowptEdge[e];
    }
  } while ((ws.sp > 0 ? sId[ws.sp - 1] : NONE) !== stackBottom[ei]);

  // merge conflicting return edges of e_1..e_{i-1} into P.L
  const lowEi = lowpt[ei];
  while (ws.sp > 0) {
    const t = ws.sp - 1;
    const lConf = !intervalEmpty(sLl[t], sLh[t]) && lowpt[sLh[t]] > lowEi;
    const rConf = !intervalEmpty(sRl[t], sRh[t]) && lowpt[sRh[t]] > lowEi;
    if (!lConf && !rConf) break;
    ws.sp--;
    let qLl = sLl[t], qLh = sLh[t], qRl = sRl[t], qRh = sRh[t];
    if (rConf) {
      let x = qLl; qLl = qRl; qRl = x;
      x = qLh; qLh = qRh; qRh = x;
    }
    if (!intervalEmpty(qRl, qRh) && lowpt[qRh] > lowEi) return false;
    // merge interval below lowpt(ei) into P.R
    if (pRl !== NONE) ref[pRl] = qRh;
    if (qRl !== NONE) pRl = qRl;
    if (intervalEmpty(pLl, pLh)) pLh = qLh;
    else ref[pLl] = qLh;
    pLl = qLl;
  }
  if (!(intervalEmpty(pLl, pLh) && intervalEmpty(pRl, pRh))) {
    const t = ws.sp++;
    sLl[t] = pLl; sLh[t] = pLh; sRl[t] = pRl; sRh[t] = pRh;
    sId[t] = ws.nextId++;
  }
  return true;
}

function removeBackEdges(ws, e) {
  const { lowpt, ref, side, height, src, dst, sLl, sLh, sRl, sRh } = ws;
  const u = src[e];
  const hu = height[u];
  // drop entire conflict pairs whose lowest return point is u
  while (ws.sp > 0) {
    const t = ws.sp - 1;
    let lowest;
    if (intervalEmpty(sLl[t], sLh[t])) lowest = lowpt[sRl[t]];
    else if (intervalEmpty(sRl[t], sRh[t])) lowest = lowpt[sLl[t]];
    else lowest = Math.min(lowpt[sLl[t]], lowpt[sRl[t]]);
    if (lowest !== hu) break;
    ws.sp--;
    if (sLl[t] !== NONE) side[sLl[t]] = -1;
  }
  if (ws.sp > 0) { // one more conflict pair to consider (modified in place)
    const t = ws.sp - 1;
    // trim left interval
    while (sLh[t] !== NONE && dst[sLh[t]] === u) sLh[t] = ref[sLh[t]];
    if (sLh[t] === NONE && sLl[t] !== NONE) { // just emptied
      ref[sLl[t]] = sRl[t];
      side[sLl[t]] = -1;
      sLl[t] = NONE;
    }
    // trim right interval
    while (sRh[t] !== NONE && dst[sRh[t]] === u) sRh[t] = ref[sRh[t]];
    if (sRh[t] === NONE && sRl[t] !== NONE) {
      ref[sRl[t]] = sLl[t];
      side[sRl[t]] = -1;
      sRl[t] = NONE;
    }
  }
  // side of e is side of a highest return edge
  if (lowpt[e] < hu && ws.sp > 0) {
    const t = ws.sp - 1;
    const hl = sLh[t];
    const hr = sRh[t];
    if (hl !== NONE && (hr === NONE || lowpt[hl] > lowpt[hr])) ref[e] = hl;
    else ref[e] = hr;
  }
}

// ---------------------------------------------------------------------------
// Input normalisation helpers
// ---------------------------------------------------------------------------

function checkNode(x, n) {
  if (!Number.isInteger(x) || x < 0 || x >= n) {
    throw new Error('planar.js: edge endpoint ' + x + ' is not a node index in 0..' + (n - 1));
  }
}

// Returns { eu, ev, m, canon } where canon[i] is the index into eu/ev of
// input edge i, or -1 for a self-loop. Repeated pairs share one entry.
function simpleEdges(n, edges) {
  const eu = new Int32Array(edges.length);
  const ev = new Int32Array(edges.length);
  const canon = new Int32Array(edges.length);
  const seen = new Map();
  let m = 0;
  for (let i = 0; i < edges.length; i++) {
    const u = edges[i][0];
    const v = edges[i][1];
    checkNode(u, n);
    checkNode(v, n);
    if (u === v) { canon[i] = NONE; continue; }
    const key = u < v ? u * n + v : v * n + u;
    const prev = seen.get(key);
    if (prev !== undefined) { canon[i] = prev; continue; }
    seen.set(key, m);
    canon[i] = m;
    eu[m] = u;
    ev[m] = v;
    m++;
  }
  return { eu, ev, m, canon };
}

function readRotation(ws, n) {
  const { head, prv, src, dst } = ws;
  const rotation = new Array(n);
  for (let v = 0; v < n; v++) {
    const list = [];
    const h0 = head[v];
    if (h0 !== NONE) {
      let h = h0;
      do {
        const e = h >> 1;
        list.push((h & 1) ? src[e] : dst[e]);
        h = prv[h]; // counter-clockwise walk
      } while (h !== h0);
    }
    rotation[v] = list;
  }
  return rotation;
}

// ---------------------------------------------------------------------------
// Public: planarity and embedding
// ---------------------------------------------------------------------------

/**
 * Planar embedding by the Left-Right planarity test.
 * @param {number} n number of nodes (0..n-1)
 * @param {Array<[number, number]>} edges undirected edges
 * @returns {number[][] | null} null if not planar, otherwise rotation where
 *   rotation[v] lists v's neighbours in counter-clockwise order.
 */
export function planarEmbedding(n, edges) {
  const { eu, ev, m } = simpleEdges(n, edges);
  const ws = makeWorkspace(n, m);
  if (!lrCore(ws, n, m, eu, ev, true)) return null;
  return readRotation(ws, n);
}

/** True when the graph is planar. */
export function isPlanar(n, edges) {
  const { eu, ev, m } = simpleEdges(n, edges);
  return lrCore(makeWorkspace(n, m), n, m, eu, ev, false);
}

/**
 * Traces all faces of a rotation system.
 * Convention (see top of file): the face lies to the LEFT of each half-edge;
 * after u->v comes v->w with w the entry just before u in rotation[v]
 * (= next clockwise around v). With rotation[] counter-clockwise, bounded
 * faces come out counter-clockwise and outer faces clockwise.
 * Every half-edge appears in exactly one face. For a planar rotation system
 * each connected component with at least one edge satisfies V - E + F = 2.
 * @param {number[][]} rotation
 * @returns {Array<Array<[number, number]>>}
 */
export function faces(rotation) {
  const n = rotation.length;
  // offsets of the half-edges of every vertex in a flat array
  const start = new Int32Array(n + 1);
  for (let v = 0; v < n; v++) start[v + 1] = start[v] + rotation[v].length;
  const total = start[n];
  const target = new Int32Array(total);
  const pos = new Map(); // key v * n + u -> index of u in rotation[v]
  for (let v = 0; v < n; v++) {
    const list = rotation[v];
    for (let i = 0; i < list.length; i++) {
      target[start[v] + i] = list[i];
      pos.set(v * n + list[i], i);
    }
  }
  const used = new Uint8Array(total);
  const result = [];
  for (let v0 = 0; v0 < n; v0++) {
    for (let i0 = start[v0]; i0 < start[v0 + 1]; i0++) {
      if (used[i0]) continue;
      const face = [];
      let u = v0;
      let h = i0;
      while (!used[h]) {
        used[h] = 1;
        const v = target[h];
        face.push([u, v]);
        const j = pos.get(v * n + u);
        if (j === undefined) {
          throw new Error('planar.js faces: ' + v + ' does not list ' + u + ' as a neighbour');
        }
        const deg = start[v + 1] - start[v];
        h = start[v] + (j === 0 ? deg - 1 : j - 1);
        u = v;
      }
      result.push(face);
    }
  }
  return result;
}

// ---------------------------------------------------------------------------
// Subgraph planarity tests and Kuratowski extraction on a fixed edge universe
// ---------------------------------------------------------------------------

// Tests planarity of edge subsets of a fixed simple graph (n nodes, m edges
// eu/ev) given as an active mask, reusing one workspace.
function makeTester(n, eu, ev, m) {
  const ws = makeWorkspace(n, m);
  const su = new Int32Array(m);
  const sv = new Int32Array(m);
  let tests = 0;
  let incidence = null;
  return {
    n, m, eu, ev, ws,
    get tests() { return tests; },
    // vertex -> incident edge ids (CSR), built on first use
    incidence() {
      if (incidence) return incidence;
      const start = new Int32Array(n + 1);
      for (let e = 0; e < m; e++) { start[eu[e] + 1]++; start[ev[e] + 1]++; }
      for (let v = 0; v < n; v++) start[v + 1] += start[v];
      const edge = new Int32Array(2 * m);
      const cur = start.slice(0, n);
      for (let e = 0; e < m; e++) { edge[cur[eu[e]]++] = e; edge[cur[ev[e]]++] = e; }
      incidence = { start, edge };
      return incidence;
    },
    // planarity of the subgraph made of edges with active[e] = 1
    planar(active) {
      let k = 0;
      for (let e = 0; e < m; e++) {
        if (active[e]) { su[k] = eu[e]; sv[k] = ev[e]; k++; }
      }
      tests++;
      return lrCore(ws, n, k, su, sv, false);
    },
  };
}

// Edge-minimal non-planar subgraph (a Kuratowski subdivision) of the active
// subgraph, which must be non-planar. Group deletion: drop a chunk of edges,
// keep it dropped if the rest stays non-planar, otherwise split the chunk.
// `order` is the deletion order (edges early in the order are dropped first).
function extractKuratowski(tester, active, order) {
  const { n, eu, ev, m } = tester;
  const act = Uint8Array.from(active);
  // edges outside the 2-core (pendant trees) never belong to a Kuratowski
  // subgraph: drop them for free, now and after every successful deletion
  const deg = new Int32Array(n);
  for (let e = 0; e < m; e++) if (act[e]) { deg[eu[e]]++; deg[ev[e]]++; }
  const inc = tester.incidence();
  const stack = [];
  const trim = () => {
    while (stack.length) {
      const v = stack.pop();
      if (deg[v] !== 1) continue;
      for (let i = inc.start[v]; i < inc.start[v + 1]; i++) {
        const e = inc.edge[i];
        if (!act[e]) continue;
        act[e] = 0;
        deg[eu[e]]--; deg[ev[e]]--;
        const w = eu[e] === v ? ev[e] : eu[e];
        if (deg[w] === 1) stack.push(w);
        break;
      }
    }
  };
  for (let v = 0; v < n; v++) if (deg[v] === 1) stack.push(v);
  trim();
  const list = [];
  for (let i = 0; i < order.length; i++) if (act[order[i]]) list.push(order[i]);
  const stackA = [];
  const stackB = [];
  if (list.length > 1) {
    const mid = list.length >> 1;
    stackA.push(mid, 0); stackB.push(list.length, mid);
  }
  const removedNow = [];
  while (stackA.length) {
    const a = stackA.pop();
    const b = stackB.pop();
    removedNow.length = 0;
    for (let i = a; i < b; i++) if (act[list[i]]) { act[list[i]] = 0; removedNow.push(list[i]); }
    if (removedNow.length === 0) continue;
    if (!tester.planar(act)) { // whole chunk is unnecessary
      for (const e of removedNow) {
        for (const v of [eu[e], ev[e]]) if (--deg[v] === 1) stack.push(v);
      }
      trim();
      continue;
    }
    for (const e of removedNow) act[e] = 1;
    if (removedNow.length === 1) continue; // essential edge
    const mid = (a + b) >> 1;
    stackA.push(mid); stackB.push(b);
    stackA.push(a); stackB.push(mid);
  }
  const k = [];
  for (let i = 0; i < list.length; i++) if (act[list[i]]) k.push(list[i]);
  return k;
}

function mulberry32(seed) {
  let a = (seed >>> 0) || 0x9e3779b9;
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled(arr, rnd) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
  return a;
}

/**
 * Edge indices (into `edges`) of a Kuratowski subgraph (subdivision of K5 or
 * K3,3), or null when the graph is planar.
 */
export function kuratowskiSubgraph(n, edges, seed = 1) {
  const { eu, ev, m, canon } = simpleEdges(n, edges);
  const tester = makeTester(n, eu, ev, m);
  const active = new Uint8Array(m).fill(1);
  if (tester.planar(active)) return null;
  const order = shuffled(Array.from({ length: m }, (_, i) => i), mulberry32(seed));
  const k = extractKuratowski(tester, active, order);
  const firstInput = new Int32Array(m).fill(NONE);
  for (let i = 0; i < edges.length; i++) {
    if (canon[i] !== NONE && firstInput[canon[i]] === NONE) firstInput[canon[i]] = i;
  }
  return k.map((e) => firstInput[e]).sort((a, b) => a - b);
}

function triangleFree(n, eu, ev, m) {
  const nb = Array.from({ length: n }, () => new Set());
  for (let e = 0; e < m; e++) { nb[eu[e]].add(ev[e]); nb[ev[e]].add(eu[e]); }
  for (let e = 0; e < m; e++) {
    let a = nb[eu[e]], b = nb[ev[e]];
    if (a.size > b.size) { const t = a; a = b; b = t; }
    for (const x of a) if (b.has(x)) return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// Biconnected components (only non-planar blocks need any work)
// ---------------------------------------------------------------------------

// Returns block id per edge (iterative Hopcroft-Tarjan with an edge stack).
function biconnectedBlocks(n, eu, ev, m) {
  const adjStart = new Int32Array(n + 1);
  for (let e = 0; e < m; e++) { adjStart[eu[e] + 1]++; adjStart[ev[e] + 1]++; }
  for (let v = 0; v < n; v++) adjStart[v + 1] += adjStart[v];
  const adj = new Int32Array(2 * m);
  const cur = adjStart.slice(0, n);
  for (let e = 0; e < m; e++) { adj[cur[eu[e]]++] = e; adj[cur[ev[e]]++] = e; }
  const disc = new Int32Array(n).fill(NONE);
  const low = new Int32Array(n);
  const parentEdge = new Int32Array(n).fill(NONE);
  const ptr = adjStart.slice(0, n);
  const block = new Int32Array(m).fill(NONE);
  const estack = new Int32Array(m);
  const vstack = new Int32Array(n);
  let esp = 0;
  let time = 0;
  let nBlocks = 0;
  for (let r = 0; r < n; r++) {
    if (disc[r] !== NONE) continue;
    let sp = 0;
    vstack[sp++] = r;
    disc[r] = low[r] = time++;
    while (sp > 0) {
      const v = vstack[sp - 1];
      if (ptr[v] < adjStart[v + 1]) {
        const e = adj[ptr[v]++];
        if (e === parentEdge[v]) continue;
        const w = eu[e] === v ? ev[e] : eu[e];
        if (disc[w] === NONE) {
          parentEdge[w] = e;
          estack[esp++] = e;
          disc[w] = low[w] = time++;
          vstack[sp++] = w;
        } else if (disc[w] < disc[v]) { // back edge
          estack[esp++] = e;
          if (disc[w] < low[v]) low[v] = disc[w];
        }
      } else {
        sp--;
        const pe = parentEdge[v];
        if (pe === NONE) continue;
        const u = eu[pe] === v ? ev[pe] : eu[pe];
        if (low[v] < low[u]) low[u] = low[v];
        if (low[v] >= disc[u]) { // u separates the block containing pe
          let x;
          do {
            x = estack[--esp];
            block[x] = nBlocks;
          } while (x !== pe);
          nBlocks++;
        }
      }
    }
  }
  return { block, nBlocks };
}

// ---------------------------------------------------------------------------
// Weighted hitting set (branch and bound) over the Kuratowski sets
// ---------------------------------------------------------------------------
// Costs are lexicographic pairs (count, weight): fewest elements first, then
// the least total weight.

function lexLess(c1, w1, c2, w2) {
  if (c1 !== c2) return c1 < c2;
  return w1 < w2 - 1e-9 * Math.max(1, Math.abs(w2));
}

// sets: arrays of edge ids; weight: Float64Array per edge id; inc: edge ids of
// the incumbent (a planarizing set, hence a hitting set of every set).
// Searches hitting sets strictly cheaper than the incumbent and stops once
// `maxPool` of them are known. Returns
//   { pool, complete, aborted, lb }
// pool: cheaper hitting sets (edge id lists), cheapest first;
// complete: the search was exhaustive, so pool[0] (if any) is a minimum
//   hitting set and an empty pool proves the incumbent optimal;
// aborted: the deadline was hit; lb: lower bound on the size of any hitting
// set (valid when not aborted).
function hittingSetSearch(sets, weight, inc, deadline, now, maxPool) {
  // ---- element ids
  const elemOf = new Map();
  const elems = [];
  let S = [];
  for (const s of sets) {
    const local = [];
    for (const e of s) {
      let id = elemOf.get(e);
      if (id === undefined) { id = elems.length; elemOf.set(e, id); elems.push(e); }
      local.push(id);
    }
    S.push(local);
  }
  const E = elems.length;
  const wOf = (id) => weight[elems[id]];

  // ---- reductions: drop superset constraints, drop dominated elements
  const dom = new Int32Array(E).fill(NONE); // dominated element -> dominator
  for (let round = 0; round < 6; round++) {
    const before = S.length;
    S = dropSupersets(S, E);
    const W = Math.ceil(S.length / 32) || 1;
    const memb = new Uint32Array(E * W);
    const count = new Int32Array(E);
    S.forEach((s, j) => { for (const x of s) { memb[x * W + (j >> 5)] |= 1 << (j & 31); count[x]++; } });
    let changed = false;
    // a is dominated by b if sets(a) is a subset of sets(b) and b is no costlier
    for (let a = 0; a < E; a++) {
      if (count[a] === 0) continue;
      const wa = wOf(a);
      for (let b = 0; b < E; b++) {
        if (a === b || count[b] < count[a]) continue;
        const wb = wOf(b);
        if (wb > wa) continue;
        if (count[b] === count[a] && wb === wa && b > a) continue; // keep lowest id of equals
        let sub = true;
        const oa = a * W, ob = b * W;
        for (let k = 0; k < W; k++) if ((memb[oa + k] & ~memb[ob + k]) !== 0) { sub = false; break; }
        if (sub) {
          dom[a] = b;
          count[a] = 0;
          for (let k = 0; k < W; k++) memb[oa + k] = 0;
          changed = true;
          break;
        }
      }
    }
    if (changed) S = S.map((s) => s.filter((x) => dom[x] === NONE));
    if (!changed && S.length === before) break;
  }
  const alive = (x) => { while (dom[x] !== NONE) x = dom[x]; return x; };

  // ---- independent components (union-find over elements)
  const parent = new Int32Array(E);
  for (let i = 0; i < E; i++) parent[i] = i;
  const find = (x) => { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; };
  for (const s of S) for (let i = 1; i < s.length; i++) {
    const a = find(s[0]), b = find(s[i]);
    if (a !== b) parent[a] = b;
  }
  const comps = new Map();
  for (const s of S) {
    const r = find(s[0]);
    if (!comps.has(r)) comps.set(r, { sets: [], ub: new Set() });
    comps.get(r).sets.push(s);
  }
  // incumbent restricted to each component (dominated elements replaced)
  for (const e of inc) {
    const id = elemOf.get(e);
    if (id === undefined) continue;
    const x = alive(id);
    const c = comps.get(find(x));
    if (c) c.ub.add(x);
  }

  let complete = true;
  let aborted = false;
  let lb = 0; // lower bound on the size of any hitting set
  const parts = [];
  let mappedCnt = 0, mappedW = 0;
  for (const c of comps.values()) {
    const res = solveHittingComponent(c.sets, Array.from(c.ub), wOf, deadline, now, maxPool);
    if (!res.complete) complete = false;
    if (res.aborted) aborted = true;
    lb += res.lb;
    parts.push(res);
    mappedCnt += res.ub.length;
    for (const x of res.ub) mappedW += wOf(x);
    if (aborted) break;
  }
  const toEdges = (list) => list.map((x) => elems[x]);
  const base = (k) => (parts[k].pool.length ? parts[k].pool[0] : parts[k].ub);
  const pool = [];
  let incW = 0;
  for (const e of inc) incW += weight[e];
  if (parts.some((p) => p.pool.length)) {
    const first = [];
    parts.forEach((p, k) => first.push(...toEdges(base(k))));
    pool.push(first);
    for (let i = 0; i < parts.length && pool.length < maxPool; i++) {
      for (let a = 1; a < parts[i].pool.length && pool.length < maxPool; a++) {
        const s = [];
        parts.forEach((p, k) => s.push(...toEdges(k === i ? parts[i].pool[a] : base(k))));
        pool.push(s);
      }
    }
  } else if (lexLess(mappedCnt, mappedW, inc.length, incW)) {
    // the incumbent's useful part is a cheaper hitting set than the incumbent
    const s = [];
    parts.forEach((p) => s.push(...toEdges(p.ub)));
    pool.push(s);
  }
  return { pool, complete, aborted, lb: aborted ? 0 : lb };
}

function dropSupersets(S, E) {
  // sort by size; a set is dropped when it contains an earlier (smaller) set
  const order = S.map((s, i) => i).sort((a, b) => S[a].length - S[b].length);
  const kept = [];
  const mark = new Uint8Array(E);
  outer: for (const i of order) {
    const s = S[i];
    for (const x of s) mark[x] = 1;
    for (const t of kept) {
      if (t.length > s.length) continue;
      let sub = true;
      for (const x of t) if (!mark[x]) { sub = false; break; }
      if (sub) { for (const x of s) mark[x] = 0; continue outer; }
    }
    for (const x of s) mark[x] = 0;
    kept.push(s);
  }
  return kept;
}

// Branch and bound on one component. ubIn: a hitting set of these sets
// (element ids). Collects up to maxPool hitting sets strictly cheaper than
// ubIn, stopping early when the pool is full. Returns
// { pool (cheapest first), ub, complete, aborted, lb (root count bound) }.
function solveHittingComponent(setsIn, ubIn, wOf, deadline, now, maxPool) {
  // local element ids
  const loc = new Map();
  const glob = [];
  const id = (x) => {
    let i = loc.get(x);
    if (i === undefined) { i = glob.length; loc.set(x, i); glob.push(x); }
    return i;
  };
  const sets = setsIn.map((s) => s.map(id));
  const E = glob.length;
  const nS = sets.length;
  const w = new Float64Array(E);
  for (let i = 0; i < E; i++) w[i] = wOf(glob[i]);
  const W = Math.ceil(E / 32) || 1;
  const bits = new Uint32Array(nS * W);
  const elemSets = Array.from({ length: E }, () => []);
  sets.forEach((s, j) => {
    for (const x of s) { bits[j * W + (x >> 5)] |= 1 << (x & 31); elemSets[x].push(j); }
  });
  // static order for the packing bound: small sets first
  const packOrder = Int32Array.from(sets.map((s, i) => i).sort((a, b) => sets[a].length - sets[b].length));

  const hit = new Int32Array(nS);
  const deg = new Int32Array(E); // number of unhit sets containing x
  for (let x = 0; x < E; x++) deg[x] = elemSets[x].length;
  let unhit = nS;
  const exclBits = new Uint32Array(W);
  const excl = new Uint8Array(E);
  const used = new Uint32Array(W);
  const degBuf = new Int32Array(E);
  const chosen = [];

  const ub = ubIn.filter((x) => loc.has(x)).map((x) => loc.get(x));
  let bestCnt = ub.length;
  let bestW = 0;
  for (const x of ub) bestW += w[x];
  const pool = []; // [{ list, cnt, w }]
  let weighted = false;
  for (let x = 0; x < E; x++) if (w[x] !== w[0]) weighted = true;

  let nodes = 0;
  let aborted = false;
  let stopped = false;

  const choose = (x) => {
    for (const j of elemSets[x]) {
      if (hit[j]++ === 0) {
        unhit--;
        for (const y of sets[j]) deg[y]--;
      }
    }
  };
  const unchoose = (x) => {
    for (const j of elemSets[x]) {
      if (--hit[j] === 0) {
        unhit++;
        for (const y of sets[j]) deg[y]++;
      }
    }
  };

  function popcountAvail(j) {
    let c = 0;
    const o = j * W;
    for (let k = 0; k < W; k++) {
      let v = bits[o + k] & ~exclBits[k];
      v -= (v >>> 1) & 0x55555555;
      v = (v & 0x33333333) + ((v >>> 2) & 0x33333333);
      c += (((v + (v >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
    }
    return c;
  }
  function minAvailWeight(j) {
    let mw = Infinity;
    const o = j * W;
    for (let k = 0; k < W; k++) {
      let v = bits[o + k] & ~exclBits[k];
      while (v !== 0) {
        const t = v & -v;
        const x = (k << 5) + (31 - Math.clz32(t));
        if (w[x] < mw) mw = w[x];
        v ^= t;
      }
    }
    return mw;
  }

  // LP-dual style weight bound: every unhit set receives a share y_j of the
  // residual weight of each of its available elements; any hitting set
  // costs at least sum(y_j). Generalises the disjoint-packing bound.
  const resid = new Float64Array(E);
  function dualBound() {
    for (let x = 0; x < E; x++) resid[x] = w[x];
    let lbw = 0;
    for (let i = 0; i < nS; i++) {
      const j = packOrder[i];
      if (hit[j]) continue;
      const s = sets[j];
      let y = Infinity;
      for (const x of s) if (!excl[x] && resid[x] < y) y = resid[x];
      if (y <= 0) continue;
      lbw += y;
      for (const x of s) if (!excl[x]) resid[x] -= y;
    }
    return lbw;
  }

  function search(cnt, wsum) {
    if ((++nodes & 255) === 0 && now() > deadline) aborted = true;
    if (aborted || stopped) return;
    if (unhit === 0) {
      // every hitting set cheaper than the incumbent is a candidate; the
      // bound is not tightened so that the pool fills quickly
      if (!lexLess(cnt, wsum, bestCnt, bestW)) return;
      pool.push({ list: chosen.slice(), cnt, w: wsum });
      if (pool.length >= maxPool) stopped = true;
      return;
    }
    // degree bound: fewest elements whose degrees add up to `unhit`
    let k = 0;
    for (let x = 0; x < E; x++) if (!excl[x] && deg[x] > 0) degBuf[k++] = deg[x];
    if (k === 0) return;
    const room = bestCnt - cnt; // extra elements still allowed
    const sub = degBuf.subarray(0, k);
    sub.sort();
    let need = 0;
    for (let s = 0, i = k - 1; i >= 0; i--) {
      s += sub[i];
      need++;
      if (s >= unhit) break;
      if (need >= room) return;
    }
    if (need > room) return;
    // packing bound: pairwise disjoint unhit sets; also pick the branch set
    used.fill(0);
    let lbCnt = 0, lbW = 0;
    let branchSet = -1, branchSize = Infinity;
    for (let i = 0; i < nS; i++) {
      const j = packOrder[i];
      if (hit[j]) continue;
      const sz = popcountAvail(j);
      if (sz === 0) return; // cannot be hit any more
      if (sz < branchSize) { branchSize = sz; branchSet = j; }
      const o = j * W;
      let disjoint = true;
      for (let q = 0; q < W; q++) if ((bits[o + q] & ~exclBits[q] & used[q]) !== 0) { disjoint = false; break; }
      if (disjoint) {
        for (let q = 0; q < W; q++) used[q] |= bits[o + q] & ~exclBits[q];
        lbCnt++;
        lbW += minAvailWeight(j);
      }
    }
    const lc = cnt + Math.max(lbCnt, need);
    if (!lexLess(lc, wsum + lbW, bestCnt, bestW)) return;
    if (lc === bestCnt && weighted && !lexLess(lc, wsum + dualBound(), bestCnt, bestW)) return;
    // branch: x1 in; or x1 out and x2 in; ...
    const cand = [];
    const o = branchSet * W;
    for (let q = 0; q < W; q++) {
      let v = bits[o + q] & ~exclBits[q];
      while (v !== 0) {
        const t = v & -v;
        cand.push((q << 5) + (31 - Math.clz32(t)));
        v ^= t;
      }
    }
    cand.sort((a, b) => (deg[b] - deg[a]) || (w[a] - w[b]));
    let nEx = 0;
    for (const x of cand) {
      chosen.push(x);
      choose(x);
      search(cnt + 1, wsum + w[x]);
      unchoose(x);
      chosen.pop();
      if (aborted || stopped) break;
      excl[x] = 1;
      exclBits[x >> 5] |= 1 << (x & 31);
      nEx++;
    }
    for (let i = 0; i < nEx; i++) {
      const x = cand[i];
      excl[x] = 0;
      exclBits[x >> 5] &= ~(1 << (x & 31));
    }
  }
  // count lower bound at the root (degree and packing bounds)
  let rootLB = 0;
  {
    const d = Int32Array.from(elemSets, (l) => l.length).sort();
    for (let s = 0, i = E - 1; i >= 0 && s < nS; i--) { s += d[i]; rootLB++; }
    used.fill(0);
    let pack = 0;
    for (let i = 0; i < nS; i++) {
      const o = packOrder[i] * W;
      let disjoint = true;
      for (let q = 0; q < W; q++) if ((bits[o + q] & used[q]) !== 0) { disjoint = false; break; }
      if (disjoint) { pack++; for (let q = 0; q < W; q++) used[q] |= bits[o + q]; }
    }
    rootLB = Math.max(rootLB, pack);
  }
  search(0, 0);
  pool.sort((a, b) => (lexLess(a.cnt, a.w, b.cnt, b.w) ? -1 : lexLess(b.cnt, b.w, a.cnt, a.w) ? 1 : 0));
  const back = (list) => list.map((x) => glob[x]);
  return {
    pool: pool.map((p) => back(p.list)),
    ub: back(ub),
    complete: !aborted && !stopped,
    aborted,
    lb: rootLB,
  };
}

// ---------------------------------------------------------------------------
// Public: minimum planarizing edge deletion
// ---------------------------------------------------------------------------

/**
 * Removes as few edges as possible so that the rest is planar (minimum
 * planarizing edge set; the count is the graph's skewness).
 *
 * Method: only non-planar biconnected blocks are processed. Every solution
 * must remove an edge of every Kuratowski subgraph, so Kuratowski subgraphs
 * are collected (edge-minimal non-planar subgraphs, extracted by group
 * deletion), hitting sets of them cheaper than the best known solution are
 * found by branch and bound, the ones that planarize become the new best,
 * the others yield new Kuratowski subgraphs; when no cheaper hitting set
 * exists the best solution is proven optimal. Phase 1 minimises the count,
 * phase 2 (only if weights differ) the weight among minimum-count solutions.
 * Lower bounds also come from Euler's formula (m <= 3n - 6, or 2n - 4 for
 * triangle-free blocks). If `budgetMs` runs out, the best solution found is
 * returned after a 2-for-1 exchange local search (optimal = false unless it
 * meets the lower bound).
 *
 * @param {number} n
 * @param {Array<[number, number]>} edges
 * @param {{weight?: (edgeIndex:number)=>number, seed?: number, budgetMs?: number}} [options]
 *   weight: cost of removing edge i (values <= 0 or NaN count as 0);
 *     among the minimum-count solutions the one of least total weight wins.
 *   seed: integer seed for the (deterministic) randomised choices. Default 1.
 *   budgetMs: time budget, default 1500. Without timeouts, the result is
 *     deterministic for a given seed.
 * @returns {{kept: number[], removed: number[], rotation: number[][],
 *   optimal: boolean, weightOptimal: boolean, lowerBound: number,
 *   stats: object|null}}
 *   kept / removed: indices into `edges`, ascending; together a partition of
 *     0..edges.length-1. rotation: CCW planar rotation system of the kept
 *     graph (as planarEmbedding). optimal: the number of removed edges is
 *     proven minimum. weightOptimal: additionally the weight is proven
 *     minimal among minimum-count solutions. lowerBound: proven lower bound
 *     on the number of removals. stats: diagnostics (iterations, Kuratowski
 *     sets, planarity tests, ms) or null when nothing had to be removed.
 */
export function planarSubgraph(n, edges, options = {}) {
  const now = (typeof performance !== 'undefined' && performance.now)
    ? () => performance.now() : () => Date.now();
  const t0 = now();
  const budgetMs = options.budgetMs == null ? 1500 : options.budgetMs;
  const deadline = t0 + budgetMs;
  const rnd = mulberry32(options.seed == null ? 1 : options.seed);
  const weightFn = options.weight;

  const { eu, ev, m, canon } = simpleEdges(n, edges);
  // weight of a simple edge = weight of its first input occurrence
  const weight = new Float64Array(m);
  if (weightFn) {
    const done = new Uint8Array(m);
    for (let i = 0; i < edges.length; i++) {
      const c = canon[i];
      if (c === NONE || done[c]) continue;
      done[c] = 1;
      const x = +weightFn(i);
      // NaN / negative -> 0; +Infinity -> huge but finite (sums must not overflow)
      weight[c] = x > 0 ? Math.min(x, Number.MAX_VALUE / (m + 1)) : 0;
    }
  }

  const removedSimple = new Uint8Array(m);
  let optimal = true;
  let weightOptimal = true;
  let lowerBound = 0;
  let stats = null;

  const ws = makeWorkspace(n, m);
  if (!lrCore(ws, n, m, eu, ev, false)) {
    // restrict the work to the non-planar biconnected blocks
    const { block, nBlocks } = biconnectedBlocks(n, eu, ev, m);
    const blockEdges = Array.from({ length: nBlocks }, () => []);
    for (let e = 0; e < m; e++) blockEdges[block[e]].push(e);
    const bad = [];
    let eulerLB = 0;
    for (const list of blockEdges) {
      if (list.length < 9) continue; // K3,3 has 9 edges
      const vid = new Map();
      const bu = new Int32Array(list.length);
      const bv = new Int32Array(list.length);
      list.forEach((e, i) => {
        if (!vid.has(eu[e])) vid.set(eu[e], vid.size);
        if (!vid.has(ev[e])) vid.set(ev[e], vid.size);
        bu[i] = vid.get(eu[e]);
        bv[i] = vid.get(ev[e]);
      });
      const nB = vid.size;
      const mB = list.length;
      if (!lrCore(makeWorkspace(nB, mB), nB, mB, bu, bv, false)) {
        bad.push(list);
        // Euler: a planar simple graph has at most 3n - 6 edges, at most
        // 2n - 4 when it has no triangle
        let lb = Math.max(1, mB - (3 * nB - 6));
        if (triangleFree(nB, bu, bv, mB)) lb = Math.max(lb, mB - (2 * nB - 4));
        eulerLB += lb;
      }
    }
    // one universe made of all non-planar blocks (the hitting-set solver
    // splits independent parts by itself)
    const uEdges = [].concat(...bad);
    const vid = new Map();
    const uu = new Int32Array(uEdges.length);
    const uv = new Int32Array(uEdges.length);
    uEdges.forEach((e, i) => {
      if (!vid.has(eu[e])) vid.set(eu[e], vid.size);
      if (!vid.has(ev[e])) vid.set(ev[e], vid.size);
      uu[i] = vid.get(eu[e]);
      uv[i] = vid.get(ev[e]);
    });
    const uw = Float64Array.from(uEdges, (e) => weight[e]);
    const res = solveUniverse(vid.size, uu, uv, uEdges.length, uw, rnd, deadline, now, eulerLB);
    stats = res.stats;
    optimal = res.optimal;
    weightOptimal = res.weightOptimal;
    lowerBound = res.lowerBound;
    for (const i of res.removed) removedSimple[uEdges[i]] = 1;
  }

  const kept = [];
  const removed = [];
  const keptEdges = [];
  for (let i = 0; i < edges.length; i++) {
    const c = canon[i];
    if (c !== NONE && removedSimple[c]) removed.push(i);
    else {
      kept.push(i);
      if (c !== NONE) keptEdges.push(edges[i]);
    }
  }
  const rotation = planarEmbedding(n, keptEdges);
  if (!rotation) throw new Error('planar.js: internal error, kept graph is not planar');
  if (stats) stats.ms = now() - t0;
  return { kept, removed, rotation, optimal, weightOptimal, lowerBound, stats };
}

// Minimum planarizing deletion on one universe graph by an implicit hitting
// set scheme: collect Kuratowski subgraphs (every solution must remove an
// edge of each), find hitting sets cheaper than the incumbent, test whether
// they planarize, add the Kuratowski subgraphs they miss, repeat. Phase 1
// minimises the count only; phase 2 (only with weights) minimises the weight
// among minimum-count solutions.
// Returns { removed: edge ids, optimal, weightOptimal, lowerBound, stats }.
function solveUniverse(n, eu, ev, m, weight, rnd, deadline, now, initialLB) {
  const tester = makeTester(n, eu, ev, m);
  const all = Array.from({ length: m }, (_, i) => i);
  const sets = [];
  const freq = new Int32Array(m); // how many Kuratowski sets contain an edge
  const MAX_POOL = 8;
  const zero = new Float64Array(m);
  const weighted = weight.some((x) => x !== weight[0]);

  // adjacency of the universe graph
  const adjStart = new Int32Array(n + 1);
  for (let e = 0; e < m; e++) { adjStart[eu[e] + 1]++; adjStart[ev[e] + 1]++; }
  for (let v = 0; v < n; v++) adjStart[v + 1] += adjStart[v];
  const adj = new Int32Array(2 * m);
  {
    const cur = adjStart.slice(0, n);
    for (let e = 0; e < m; e++) { adj[cur[eu[e]]++] = e; adj[cur[ev[e]]++] = e; }
  }
  const dist = new Int32Array(n);
  const queue = new Int32Array(n);
  const key = new Float64Array(m);
  // Deletion order that keeps the extracted Kuratowski subgraph close to
  // `center`: far edges (BFS distance over active edges) are dropped first,
  // random among equals. Small, local subgraphs make strong constraints.
  const localOrder = (act, center) => {
    dist.fill(-1);
    let qh = 0, qt = 0;
    dist[center] = 0; queue[qt++] = center;
    while (qh < qt) {
      const v = queue[qh++];
      for (let i = adjStart[v]; i < adjStart[v + 1]; i++) {
        const e = adj[i];
        if (!act[e]) continue;
        const x = eu[e] === v ? ev[e] : eu[e];
        if (dist[x] < 0) { dist[x] = dist[v] + 1; queue[qt++] = x; }
      }
    }
    for (let e = 0; e < m; e++) {
      const a = dist[eu[e]], b = dist[ev[e]];
      const d = a < 0 || b < 0 ? 1e9 : Math.max(a, b) + Math.min(a, b) * 1e-3;
      key[e] = -d + rnd() * 1e-6;
    }
    return all.slice().sort((x, y) => key[x] - key[y]);
  };

  let bestRemoved = null;
  let bestCnt = Infinity;
  let bestW = Infinity;
  const stats = { iterations: 0, sets: 0, tests: 0, hsMs: 0 };

  const costOf = (list) => {
    let w = 0;
    for (const e of list) w += weight[e];
    return w;
  };

  // drop removals that are not needed (re-add edges while it stays planar)
  const prune = (removedList) => {
    const act = new Uint8Array(m).fill(1);
    for (const e of removedList) act[e] = 0;
    const order = removedList.slice().sort((a, b) => weight[b] - weight[a]);
    const out = [];
    for (const e of order) {
      act[e] = 1;
      if (!tester.planar(act)) { act[e] = 0; out.push(e); }
    }
    return out;
  };

  const offer = (removedList) => {
    const r = prune(removedList);
    const w = costOf(r);
    if (lexLess(r.length, w, bestCnt, bestW)) {
      bestRemoved = r; bestCnt = r.length; bestW = w;
    }
  };

  // Given a hitting set H: if G - H is planar return true. Otherwise add
  // Kuratowski subgraphs of G - H (greedily deleting one edge of each until
  // planar) and offer H + deletions as a feasible solution.
  const grow = (H, limit = Infinity) => {
    const act = new Uint8Array(m).fill(1);
    for (const e of H) act[e] = 0;
    if (tester.planar(act)) return true;
    const extra = [];
    do {
      if (extra.length >= limit) return false;
      if (now() > deadline) {
        // out of time: finish with the cheap prefix greedy (or give up if a
        // solution is already known)
        if (bestRemoved) return false;
        extra.push(...greedyPlanarize(tester, act, weight, rnd));
        break;
      }
      const K = extractKuratowski(tester, act, localOrder(act, eu[Math.floor(rnd() * m)]));
      sets.push(K);
      for (const e of K) freq[e]++;
      // greedy: delete the edge of K that appears in most sets (cheapest on ties)
      let pick = K[0];
      for (const e of K) {
        if (freq[e] > freq[pick] || (freq[e] === freq[pick] && weight[e] < weight[pick])) pick = e;
      }
      act[pick] = 0;
      extra.push(pick);
    } while (!tester.planar(act));
    offer(H.concat(extra));
    return false;
  };


  let optimal = false; // minimum count proven
  let weightOptimal = false;
  let lowerBound = Math.max(1, initialLB);
  let phase = 1;
  let candidates = [[]];
  let candidatesExact = true; // candidates[0] is a minimum hitting set
  for (;;) {
    stats.iterations++;
    let done = false;
    for (let i = 0; i < candidates.length; i++) {
      // the first candidate is grown greedily into a feasible solution, the
      // others only contribute one new Kuratowski subgraph each
      if (grow(candidates[i], i === 0 ? Infinity : 1)) {
        offer(candidates[i]);
        if (i === 0 && candidatesExact) done = true;
      }
    }
    if (phase === 1 && bestCnt <= lowerBound) done = true; // matches a lower bound
    if (done) {
      if (phase === 1) {
        optimal = true;
        lowerBound = bestCnt;
        if (!weighted) { weightOptimal = true; break; }
        phase = 2;
        candidates = [];
        continue;
      }
      weightOptimal = true;
      break;
    }
    if (now() > deadline) break;
    const th = now();
    const res = hittingSetSearch(sets, phase === 1 ? zero : weight, bestRemoved, deadline, now, MAX_POOL);
    stats.hsMs += now() - th;
    if (res.aborted) break;
    if (res.complete && res.pool.length === 0) { // incumbent is optimal
      if (phase === 1) {
        optimal = true;
        lowerBound = bestCnt;
        if (!weighted) { weightOptimal = true; break; }
        phase = 2;
        candidates = [];
        candidatesExact = false;
        continue;
      }
      weightOptimal = true;
      break;
    }
    if (res.lb > lowerBound) lowerBound = res.lb;
    candidates = res.pool;
    candidatesExact = res.complete;
  }
  if (!optimal) {
    lowerBound = Math.min(lowerBound, bestCnt);
    bestRemoved = localImprove(tester, bestRemoved, weight, rnd, now() + 200, now);
    if (bestRemoved.length === lowerBound) optimal = true;
  }
  stats.sets = sets.length;
  stats.tests = tester.tests;
  return { removed: bestRemoved, optimal, weightOptimal, lowerBound, stats };
}

// Fast maximal planar subgraph of the active graph: take the edges in an
// order (costly-to-remove first), binary-search the longest planar prefix,
// drop the edge that breaks it, continue. O(removals * log m) tests.
// Returns the dropped edge ids.
function greedyPlanarize(tester, active, weight, rnd) {
  const { n, m, eu, ev } = tester;
  // edges on many triangles first (they are rarely the culprits), then the
  // costly ones
  const nb = Array.from({ length: n }, () => new Set());
  for (let e = 0; e < m; e++) if (active[e]) { nb[eu[e]].add(ev[e]); nb[ev[e]].add(eu[e]); }
  const tri = new Int32Array(m);
  for (let e = 0; e < m; e++) {
    if (!active[e]) continue;
    let a = nb[eu[e]], b = nb[ev[e]];
    if (a.size > b.size) { const t = a; a = b; b = t; }
    for (const x of a) if (b.has(x)) tri[e]++;
  }
  const list = shuffled(Array.from({ length: m }, (_, i) => i).filter((e) => active[e]), rnd)
    .sort((a, b) => (tri[b] - tri[a]) || (weight[b] - weight[a]));
  const act = new Uint8Array(m);
  const dropped = [];
  let from = 0; // list[0..from) minus dropped is planar and in `act`
  while (from < list.length) {
    // is everything planar?
    for (let i = from; i < list.length; i++) act[list[i]] = 1;
    if (tester.planar(act)) break;
    for (let i = from; i < list.length; i++) act[list[i]] = 0;
    // smallest t in (from, len] with prefix list[from..t) non-planar
    let lo = from, hi = list.length; // prefix up to lo planar, up to hi not
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      for (let i = from; i < mid; i++) act[list[i]] = 1;
      const ok = tester.planar(act);
      for (let i = from; i < mid; i++) act[list[i]] = 0;
      if (ok) lo = mid; else hi = mid;
    }
    for (let i = from; i < hi - 1; i++) act[list[i]] = 1;
    dropped.push(list[hi - 1]);
    from = hi;
  }
  return dropped;
}

// 2-for-1 exchanges: put back two removed edges and remove one other edge.
function localImprove(tester, removed, weight, rnd, deadline, now) {
  const m = tester.m;
  let cur = removed.slice();
  let improved = true;
  while (improved && now() < deadline) {
    improved = false;
    const act = new Uint8Array(m).fill(1);
    for (const e of cur) act[e] = 0;
    for (let i = 0; i < cur.length && !improved; i++) {
      for (let j = i + 1; j < cur.length && !improved; j++) {
        if (now() > deadline) return cur;
        act[cur[i]] = 1; act[cur[j]] = 1;
        if (tester.planar(act)) { // both were unnecessary
          cur = cur.filter((x, k) => k !== i && k !== j);
          improved = true;
          break;
        }
        const order = shuffled(Array.from({ length: m }, (_, k) => k), rnd);
        const K = extractKuratowski(tester, act, order);
        for (const e of K) {
          act[e] = 0;
          if (tester.planar(act)) {
            const next = cur.filter((x, k) => k !== i && k !== j);
            next.push(e);
            cur = next;
            improved = true;
            break;
          }
          act[e] = 1;
        }
        if (!improved) { act[cur[i]] = 0; act[cur[j]] = 0; }
      }
    }
  }
  return cur;
}
