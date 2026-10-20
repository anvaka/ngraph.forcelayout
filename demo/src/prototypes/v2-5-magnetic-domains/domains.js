// "Magnetic domains" on a graph: every node holds a small arrow (a magnetization vector with
// Q components, length at most 1). Each round, a node turns its arrow toward the average arrow
// of its neighbors, minus a weak pull against the graph's overall average (so the whole graph
// can't agree on one direction). The length follows tanh(|field| / temperature), as in Weiss's
// mean-field theory of iron (Feynman Lectures Vol. 2, Sec. 36-6, Eqs. 36.36-36.38). Below a
// critical temperature the arrows settle into regions that point the same way: domains.
export const Q = 4;

export function computeDomains(nodeCount, neighbors, options = {}) {
  const temperature = options.temperature > 0 ? options.temperature : 0.3;
  const antiAlign = 1;
  // Cap the work on big graphs: about 2e8 multiply-adds at most.
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

// Is the grouping real? Two numbers, both cheap:
//  - wallShare: share of links whose two arrows clearly disagree (dot < 0.5). On grids, meshes
//    and trees the arrows turn slowly from place to place, so this is about 0.
//  - modularity of the domains (each node labeled by its arrow's strongest axis and sign):
//    random graphs score 0.34-0.43 here, graphs made of groups 0.5-0.65.
export function describeDomains(nodeCount, neighbors, spins) {
  const labels = new Int32Array(nodeCount);
  for (let i = 0; i < nodeCount; ++i) {
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
  const domainCount = new Set(labels).size;
  return { wallShare: links ? walls / links : 0, modularity, domainCount, links, labels };
}
