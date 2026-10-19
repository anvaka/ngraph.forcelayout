/**
 * Smart initial placement: instead of starting from random positions, place nodes so
 * that distances on screen roughly follow graph distances (number of hops). The force
 * layout then only needs to polish the result.
 *
 * Two cheap candidates are computed, and the one that better matches graph distances wins:
 *  - Pivot MDS (Brandes & Pich, 2006): BFS from k well spread "pivot" nodes, then classical
 *    MDS on those distances. O(k * (n + m)).
 *  - Radial BFS tree (2D only): BFS tree from a central node, depth is the radius, each
 *    subtree gets an angular wedge proportional to its size. Catches trees, which MDS
 *    tends to fold onto themselves. O(n + m).
 */
export default function placeNodes(graph, layout, options = {}) {
  const dimensions = options.dimensions || 2;
  const unit = options.unit || 10; // length of one hop, in layout units
  const jitter = options.jitter === undefined ? 0.1 : options.jitter;
  const random = createRandom(options.seed || 42);

  const csr = toCSR(graph);
  if (csr.n === 0) return 'empty';

  let placement = pivotMDS(csr, dimensions, options.pivots || 25, random);
  let choice = 'pivot MDS';
  if (dimensions === 2 && csr.n > 2) {
    const radial = radialBFS(csr, random);
    if (pivotStress(csr, radial) < pivotStress(csr, placement)) {
      placement = radial;
      choice = 'radial tree';
    }
  }

  const coordinates = new Array(dimensions + 1);
  for (let i = 0; i < csr.n; i++) {
    coordinates[0] = csr.ids[i];
    for (let d = 0; d < dimensions; d++) {
      coordinates[d + 1] = placement[d][i] * unit + (random() - 0.5) * jitter * unit;
    }
    layout.setNodePosition.apply(layout, coordinates);
  }
  return choice;
}

function toCSR(graph) {
  const ids = [];
  graph.forEachNode(node => { ids.push(node.id); });
  const n = ids.length;
  const index = new Map(ids.map((id, i) => [id, i]));
  const degree = new Int32Array(n);
  const edges = [];
  graph.forEachLink(link => {
    const a = index.get(link.fromId), b = index.get(link.toId);
    if (a === b) return;
    edges.push(a, b);
    degree[a]++;
    degree[b]++;
  });
  const offsets = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) offsets[i + 1] = offsets[i] + degree[i];
  const fill = offsets.slice(0, n);
  const neighbors = new Int32Array(offsets[n]);
  for (let e = 0; e < edges.length; e += 2) {
    const a = edges[e], b = edges[e + 1];
    neighbors[fill[a]++] = b;
    neighbors[fill[b]++] = a;
  }
  return { ids, n, offsets, neighbors, degree };
}

// BFS from `source` into `dist` (-1 = not reached). Returns number of reached nodes;
// `queue` holds them in BFS order.
function bfs(csr, source, dist, queue) {
  dist.fill(-1);
  dist[source] = 0;
  queue[0] = source;
  let head = 0, tail = 1;
  while (head < tail) {
    const u = queue[head++];
    const next = dist[u] + 1;
    for (let k = csr.offsets[u]; k < csr.offsets[u + 1]; k++) {
      const v = csr.neighbors[k];
      if (dist[v] < 0) { dist[v] = next; queue[tail++] = v; }
    }
  }
  return tail;
}

function pivotMDS(csr, dimensions, pivotCount, random) {
  const n = csr.n;
  const k = Math.min(pivotCount, n);
  const dist = new Int32Array(n), queue = new Int32Array(n);
  const minDist = new Float64Array(n).fill(Infinity);
  const columns = []; // squared distances to each pivot

  // First pivot is the highest degree node; each next one is the farthest from all previous.
  let pivot = 0;
  for (let i = 1; i < n; i++) if (csr.degree[i] > csr.degree[pivot]) pivot = i;
  for (let t = 0; t < k; t++) {
    bfs(csr, pivot, dist, queue);
    let maxDist = 0;
    for (let i = 0; i < n; i++) if (dist[i] > maxDist) maxDist = dist[i];
    const column = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      const d = dist[i] < 0 ? maxDist + 1 : dist[i]; // other components: just beyond the farthest
      column[i] = d * d;
      if (d < minDist[i]) minDist[i] = d;
    }
    columns.push(column);
    let next = 0;
    for (let i = 1; i < n; i++) if (minDist[i] > minDist[next]) next = i;
    pivot = next;
  }

  // Double centering
  const rowMean = new Float64Array(n);
  let grandMean = 0;
  const columnMean = columns.map(column => {
    let sum = 0;
    for (let i = 0; i < n; i++) { sum += column[i]; rowMean[i] += column[i]; }
    grandMean += sum;
    return sum / n;
  });
  for (let i = 0; i < n; i++) rowMean[i] /= k;
  grandMean /= n * k;
  columns.forEach((column, t) => {
    for (let i = 0; i < n; i++) column[i] = -0.5 * (column[i] - rowMean[i] - columnMean[t] + grandMean);
  });

  // Top eigenvectors of the small k x k matrix C^T C give the coordinates
  const M = new Float64Array(k * k);
  for (let a = 0; a < k; a++) {
    for (let b = a; b < k; b++) {
      let sum = 0;
      const ca = columns[a], cb = columns[b];
      for (let i = 0; i < n; i++) sum += ca[i] * cb[i];
      M[a * k + b] = M[b * k + a] = sum;
    }
  }
  const vectors = topEigenvectors(M, k, dimensions, random);
  const placement = vectors.map(v => {
    const out = new Float64Array(n);
    columns.forEach((column, t) => {
      for (let i = 0; i < n; i++) out[i] += v[t] * column[i];
    });
    return out;
  });
  scaleToGraphDistance(csr, placement, random);
  return placement;
}

function topEigenvectors(M, k, count, random) {
  const vectors = [];
  for (let e = 0; e < count; e++) {
    const v = new Float64Array(k).map(() => random() - 0.5);
    for (let iteration = 0; iteration < 200; iteration++) {
      const w = new Float64Array(k);
      for (let a = 0; a < k; a++) {
        let sum = 0;
        for (let b = 0; b < k; b++) sum += M[a * k + b] * v[b];
        w[a] = sum;
      }
      vectors.forEach(u => {
        let dot = 0;
        for (let a = 0; a < k; a++) dot += w[a] * u[a];
        for (let a = 0; a < k; a++) w[a] -= dot * u[a];
      });
      let norm = 0;
      for (let a = 0; a < k; a++) norm += w[a] * w[a];
      norm = Math.sqrt(norm) || 1;
      let delta = 0;
      for (let a = 0; a < k; a++) {
        const x = w[a] / norm;
        delta += Math.abs(x - v[a]);
        v[a] = x;
      }
      if (delta < 1e-9) break;
    }
    vectors.push(v);
  }
  return vectors;
}

// Scales coordinates so that 1 unit is about one hop (least squares on sampled pairs).
function scaleToGraphDistance(csr, placement, random) {
  const n = csr.n;
  const dist = new Int32Array(n), queue = new Int32Array(n);
  let num = 0, den = 0;
  for (let s = 0; s < Math.min(8, n); s++) {
    const source = Math.floor(random() * n);
    bfs(csr, source, dist, queue);
    for (let i = 0; i < n; i++) {
      const d = dist[i];
      if (d <= 0) continue;
      const e = distance(placement, i, source);
      num += e / d;
      den += (e * e) / (d * d);
    }
  }
  const scale = den > 0 ? num / den : 1;
  placement.forEach(axis => { for (let i = 0; i < n; i++) axis[i] *= scale; });
}

function radialBFS(csr, random) {
  const n = csr.n;
  const dist = new Int32Array(n), queue = new Int32Array(n);
  // Double sweep finds a long path; its middle is a good center.
  bfs(csr, 0, dist, queue);
  let a = 0;
  for (let i = 0; i < n; i++) if (dist[i] > dist[a]) a = i;
  bfs(csr, a, dist, queue);
  let b = 0;
  for (let i = 0; i < n; i++) if (dist[i] > dist[b]) b = i;
  const half = dist[b] >> 1;
  let center = b;
  while (dist[center] > half) {
    for (let k = csr.offsets[center]; k < csr.offsets[center + 1]; k++) {
      const v = csr.neighbors[k];
      if (dist[v] === dist[center] - 1) { center = v; break; }
    }
  }

  const reached = bfs(csr, center, dist, queue);
  const parent = new Int32Array(n).fill(-1);
  for (let h = 0; h < reached; h++) {
    const u = queue[h];
    for (let k = csr.offsets[u]; k < csr.offsets[u + 1]; k++) {
      const v = csr.neighbors[k];
      if (dist[v] === dist[u] + 1 && parent[v] < 0) parent[v] = u;
    }
  }
  const size = new Float64Array(n).fill(1);
  for (let h = reached - 1; h > 0; h--) size[parent[queue[h]]] += size[queue[h]];

  const start = new Float64Array(n), span = new Float64Array(n);
  const xs = new Float64Array(n), ys = new Float64Array(n);
  span[center] = 2 * Math.PI;
  for (let h = 0; h < reached; h++) {
    const u = queue[h];
    const angle = start[u] + span[u] / 2;
    xs[u] = dist[u] * Math.cos(angle);
    ys[u] = dist[u] * Math.sin(angle);
    let cursor = start[u];
    for (let k = csr.offsets[u]; k < csr.offsets[u + 1]; k++) {
      const v = csr.neighbors[k];
      if (parent[v] !== u) continue;
      start[v] = cursor;
      span[v] = span[u] * size[v] / (size[u] - 1);
      cursor += span[v];
    }
  }
  // Other components: random spots around
  let maxRadius = 0;
  for (let i = 0; i < n; i++) if (dist[i] > maxRadius) maxRadius = dist[i];
  for (let i = 0; i < n; i++) {
    if (dist[i] >= 0) continue;
    xs[i] = (random() - 0.5) * 2 * maxRadius;
    ys[i] = (random() - 0.5) * 2 * maxRadius;
  }
  return [xs, ys];
}

// How well do distances in `placement` follow graph distances (after the best scale)?
function pivotStress(csr, placement) {
  const n = csr.n, dist = new Int32Array(n), queue = new Int32Array(n);
  const random = createRandom(3);
  const pairs = [];
  for (let s = 0; s < Math.min(12, n); s++) {
    const source = Math.floor(random() * n);
    bfs(csr, source, dist, queue);
    for (let i = 0; i < n; i++) if (dist[i] > 0) pairs.push(source, i, dist[i]);
  }
  let num = 0, den = 0;
  for (let p = 0; p < pairs.length; p += 3) {
    const e = distance(placement, pairs[p], pairs[p + 1]), d = pairs[p + 2];
    num += e / d;
    den += e * e / (d * d);
  }
  const scale = den > 0 ? num / den : 1;
  let total = 0;
  for (let p = 0; p < pairs.length; p += 3) {
    const e = scale * distance(placement, pairs[p], pairs[p + 1]), d = pairs[p + 2];
    total += (e - d) * (e - d) / (d * d);
  }
  return total / Math.max(1, pairs.length / 3);
}

function distance(placement, i, j) {
  let sum = 0;
  for (let d = 0; d < placement.length; d++) {
    const delta = placement[d][i] - placement[d][j];
    sum += delta * delta;
  }
  return Math.sqrt(sum);
}

// Small deterministic PRNG (mulberry32), so placement is the same on every load.
function createRandom(seed) {
  let state = seed >>> 0;
  return function () {
    state = (state + 0x6D2B79F5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
