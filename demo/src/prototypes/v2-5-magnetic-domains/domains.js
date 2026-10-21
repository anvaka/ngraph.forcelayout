// "Magnetic domains" on a graph: every node holds a small arrow (a magnetization vector with
// Q components, length at most 1). Each round, a node turns its arrow toward the average arrow
// of its neighbors, minus a weak pull against the graph's overall average (so the whole graph
// can't agree on one direction). The length follows tanh(|field| / temperature), as in Weiss's
// mean-field theory of iron (Feynman Lectures Vol. 2, Sec. 36-6, Eqs. 36.36-36.38). Below a
// critical temperature the arrows settle into regions that point the same way: domains.
export const Q = 4;

export function computeDomains(nodeCount, neighbors, options = {}) {
  // 0 or less: every arrow at full length (tanh of infinity is 1). Not a number: the default.
  const temperature = Number.isFinite(options.temperature) ? Math.max(0, options.temperature) : 0.3;
  const antiAlign = 1;
  // Cap the work on big graphs: about 2e8 multiply-adds, but at least 60 rounds.
  let edgeEnds = 0;
  for (let i = 0; i < nodeCount; ++i) edgeEnds += neighbors[i].length;
  const rounds = Math.min(300, Math.max(60, Math.floor(2e8 / Math.max(1, Q * edgeEnds))));

  let seed = 8;
  const random = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  let spins = new Float64Array(nodeCount * Q);
  let next = new Float64Array(nodeCount * Q);
  for (let k = 0; k < spins.length; ++k) spins[k] = 0.01 * (random() - 0.5);
  const mean = new Float64Array(Q);
  const field = new Float64Array(Q);

  for (let round = 0; round < rounds; ++round) {
    mean.fill(0);
    for (let i = 0; i < nodeCount; ++i) {
      for (let a = 0; a < Q; ++a) mean[a] += spins[i * Q + a];
    }
    for (let a = 0; a < Q; ++a) mean[a] /= nodeCount;

    for (let i = 0; i < nodeCount; ++i) {
      const list = neighbors[i];
      const degree = list.length;
      field.fill(0);
      for (let k = 0; k < degree; ++k) {
        const j = list[k] * Q;
        for (let a = 0; a < Q; ++a) field[a] += spins[j + a];
      }
      let norm = 0;
      for (let a = 0; a < Q; ++a) {
        field[a] = (degree ? field[a] / degree : 0) - antiAlign * mean[a];
        norm += field[a] * field[a];
      }
      norm = Math.sqrt(norm);
      const scale = norm > 0 ? Math.tanh(norm / temperature) / norm : 0;
      // Half old, half new, so the rounds don't oscillate
      for (let a = 0; a < Q; ++a) next[i * Q + a] = 0.5 * spins[i * Q + a] + 0.5 * field[a] * scale;
    }
    const swap = spins; spins = next; next = swap;
  }
  return { spins, rounds };
}

// Is the grouping real? Three numbers, all cheap:
//  - magnitude: mean arrow length. Above the "Curie point" the arrows shrink toward 0, but their
//    directions still follow the graph, so the other two numbers alone can't tell.
//  - wallShare: share of links whose two arrows clearly disagree (dot < 0.5). On grids, meshes
//    and trees the arrows turn slowly from place to place, so this is about 0.
//  - modularity of the domains (each node labeled by its arrow's strongest axis and sign):
//    random graphs score 0.34-0.43 here, graphs made of groups 0.5-0.65.
export function describeDomains(nodeCount, neighbors, spins) {
  const labels = new Int32Array(nodeCount);
  let magnitude = 0;
  for (let i = 0; i < nodeCount; ++i) {
    let length2 = 0;
    for (let a = 0; a < Q; ++a) length2 += spins[i * Q + a] * spins[i * Q + a];
    magnitude += Math.sqrt(length2) / nodeCount;
    let best = 0, bestValue = -1;
    for (let a = 0; a < Q; ++a) {
      const value = Math.abs(spins[i * Q + a]);
      if (value > bestValue) { bestValue = value; best = 2 * a + (spins[i * Q + a] > 0 ? 0 : 1); }
    }
    labels[i] = best;
  }
  let links = 0, walls = 0, inside = 0;
  const degreeSum = new Float64Array(2 * Q);
  const insideCount = new Float64Array(2 * Q);
  for (let i = 0; i < nodeCount; ++i) {
    const list = neighbors[i];
    degreeSum[labels[i]] += list.length;
    for (let k = 0; k < list.length; ++k) {
      const j = list[k];
      if (j <= i) continue;
      links += 1;
      let dot = 0;
      for (let a = 0; a < Q; ++a) dot += spins[i * Q + a] * spins[j * Q + a];
      if (dot < 0.5) walls += 1;
      if (labels[i] === labels[j]) { inside += 1; insideCount[labels[i]] += 1; }
    }
  }
  let modularity = 0;
  if (links > 0) {
    for (let c = 0; c < 2 * Q; ++c) {
      modularity += insideCount[c] / links - (degreeSum[c] / (2 * links)) ** 2;
    }
  }
  return { wallShare: links ? walls / links : 0, modularity, links, magnitude };
}

// Domains for the colors: group the arrows by direction. (The strongest axis above would split an
// arrow that sits between two axes and merge two arrows that share one.) Strongest arrows first;
// a node joins the first group whose first arrow is within about 25 degrees (cosine > 0.9).
// Groups under 2% of the nodes join the closest big group. At most 64 groups are started.
export function arrowGroups(nodeCount, spins) {
  const length = new Float64Array(nodeCount);
  for (let i = 0; i < nodeCount; ++i) {
    let s = 0;
    for (let a = 0; a < Q; ++a) s += spins[i * Q + a] * spins[i * Q + a];
    length[i] = Math.sqrt(s) || 1e-12;
  }
  const cosine = (i, j) => {
    let d = 0;
    for (let a = 0; a < Q; ++a) d += spins[i * Q + a] * spins[j * Q + a];
    return d / (length[i] * length[j]);
  };
  const order = Array.from({ length: nodeCount }, (_, i) => i).sort((a, b) => length[b] - length[a] || a - b);
  const seeds = [], size = [], group = new Int32Array(nodeCount);
  for (const i of order) {
    let match = -1, nearest = -1, nearestCosine = -2;
    for (let c = 0; c < seeds.length && match < 0; ++c) {
      const value = cosine(i, seeds[c]);
      if (value > 0.9) match = c;
      else if (value > nearestCosine) { nearestCosine = value; nearest = c; }
    }
    if (match < 0 && seeds.length < 64) { match = seeds.length; seeds.push(i); size.push(0); }
    if (match < 0) match = nearest;
    group[i] = match; size[match] += 1;
  }
  const big = seeds.map((_, c) => c).filter(c => size[c] >= 0.02 * nodeCount);
  for (let i = 0; i < nodeCount; ++i) {
    if (size[group[i]] >= 0.02 * nodeCount || !big.length) continue;
    let best = big[0], bestCosine = -2;
    for (const c of big) {
      const value = cosine(i, seeds[c]);
      if (value > bestCosine) { bestCosine = value; best = c; }
    }
    group[i] = best;
  }
  return group;
}
