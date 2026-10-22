// Finds communities and the links between them, once per layout.
//
// Communities come from label propagation: every node starts with its own label and repeatedly
// takes the label most of its neighbours have, until nothing changes. The answer depends on the
// order nodes are visited, so we run it `runs` times with different seeds. A link counts as a
// link *between* groups only if its two ends end up in different groups in at least `certainty`
// of the runs. Clear communities pass this test every time; the arbitrary patches label
// propagation also finds in grids or trees do not, so those graphs are left alone.

export default function findGroups(graph, {runs = 8, certainty = 0.75, minGroupFactor = 1} = {}) {
  const ids = [];
  const index = new Map();
  graph.forEachNode(node => {
    index.set(node.id, ids.length);
    ids.push(node.id);
  });
  const n = ids.length;

  // Links as index pairs (self-loops dropped), and a compact neighbour list per node
  const links = [];
  const degree = new Int32Array(n);
  graph.forEachLink(link => {
    const a = index.get(link.fromId), b = index.get(link.toId);
    if (a === b) return;
    links.push({link, a, b});
    degree[a] += 1;
    degree[b] += 1;
  });
  const offset = new Int32Array(n + 1);
  for (let i = 0; i < n; i++) offset[i + 1] = offset[i] + degree[i];
  const neighbours = new Int32Array(offset[n]);
  const fill = offset.slice(0, n);
  for (const {a, b} of links) {
    neighbours[fill[a]++] = b;
    neighbours[fill[b]++] = a;
  }

  const labelings = [];
  for (let run = 0; run < runs; run++) {
    labelings.push(propagateLabels(n, offset, neighbours, 7919 * (run + 1)));
  }

  // Groups are the labels of the first run; only groups big enough to read as a blob count
  const labels = labelings[0];
  const groupOf = new Int32Array(n).fill(-1);
  const groupSize = new Map();
  for (let i = 0; i < n; i++) groupSize.set(labels[i], (groupSize.get(labels[i]) || 0) + 1);
  const minSize = minGroupFactor * Math.sqrt(n);
  const groupIds = new Map();
  for (const [label, size] of groupSize) {
    if (size >= minSize) groupIds.set(label, groupIds.size);
  }
  const members = Array.from({length: groupIds.size}, () => []);
  for (let i = 0; i < n; i++) {
    const g = groupIds.get(labels[i]);
    if (g === undefined) continue;
    groupOf[i] = g;
    members[g].push(ids[i]);
  }

  // Links between two counted groups that cross groups in enough runs, collected per pair
  const pairs = new Map();
  for (const {link, a, b} of links) {
    const ga = groupOf[a], gb = groupOf[b];
    if (ga < 0 || gb < 0 || ga === gb) continue;
    let crossed = 0;
    for (const l of labelings) if (l[a] !== l[b]) crossed += 1;
    if (crossed < certainty * runs) continue;
    const key = Math.min(ga, gb) * members.length + Math.max(ga, gb);
    let pair = pairs.get(key);
    if (!pair) {
      pair = {a: Math.min(ga, gb), b: Math.max(ga, gb), links: []};
      pairs.set(key, pair);
    }
    pair.links.push(link);
  }

  return {groups: members, pairs: [...pairs.values()]};
}

function propagateLabels(n, offset, neighbours, seed) {
  const random = seededRandom(seed);
  const labels = new Int32Array(n);
  for (let i = 0; i < n; i++) labels[i] = i;
  const order = new Int32Array(n);
  for (let i = 0; i < n; i++) order[i] = i;
  const counts = new Float64Array(n);
  const touched = new Int32Array(n);

  for (let sweep = 0; sweep < 50; sweep++) {
    for (let i = n - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const t = order[i]; order[i] = order[j]; order[j] = t;
    }
    let changed = 0;
    for (let k = 0; k < n; k++) {
      const u = order[k];
      const start = offset[u], end = offset[u + 1];
      if (start === end) continue;
      let used = 0;
      for (let e = start; e < end; e++) {
        const label = labels[neighbours[e]];
        if (counts[label] === 0) touched[used++] = label;
        counts[label] += 1;
      }
      // The most common neighbour label; ties are broken at random
      let best = labels[u], bestCount = -1, ties = 0;
      for (let t = 0; t < used; t++) {
        const label = touched[t], c = counts[label];
        if (c > bestCount) { best = label; bestCount = c; ties = 1; }
        else if (c === bestCount && random() * (++ties) < 1) best = label;
        counts[label] = 0;
      }
      if (best !== labels[u]) { labels[u] = best; changed += 1; }
    }
    if (!changed) break;
  }
  return labels;
}

function seededRandom(seed) {
  let a = seed | 0;
  return function () {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
