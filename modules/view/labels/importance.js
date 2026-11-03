// How important each node is, for labels: the most important get their labels first, and bigger.

/**
 * A score per row: `how` is 'degree' (links), 'pagerank', the name of a numeric field of
 * node.data, or `node => number`. `rowOf(id)` gives a node's row, `count` the number of rows.
 * Returns a Float64Array; rows with no node score -Infinity.
 */
export function computeImportance(graph, rowOf, count, how = 'degree') {
  let scores = new Float64Array(count).fill(-Infinity);
  if (how === 'pagerank') return pagerank(graph, rowOf, count, scores);
  graph.forEachNode(node => {
    let row = rowOf(node.id);
    if (row < 0 || row >= count) return;
    let score;
    if (typeof how === 'function') score = +how(node);
    else if (how === 'degree') {
      score = 0;
      graph.forEachLinkedNode(node.id, () => { score += 1; });
    } else {
      let value = node.data && node.data[how];
      score = typeof value === 'number' ? value : +value;
    }
    scores[row] = Number.isFinite(score) ? score : 0;
  });
  return scores;
}

/**
 * Rows from the most important to the least. Ties come in a fixed scrambled order: rows follow
 * the order the graph was built in (a grid row by row), so ties by row would put every label of
 * a grid on its first rows, where placement stops looking.
 */
export function rankRows(scores) {
  let order = new Uint32Array(scores.length);
  let mixed = new Uint32Array(scores.length);
  for (let i = 0; i < order.length; ++i) {
    order[i] = i;
    mixed[i] = scramble(i);
  }
  order.sort((a, b) => (scores[b] - scores[a]) || (mixed[a] - mixed[b]) || (a - b));
  return order;
}

// A 32-bit integer hash (lowbias32): neighbouring rows land far apart
function scramble(x) {
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

// PageRank of the graph with links read both ways: 30 rounds, damping 0.85
function pagerank(graph, rowOf, count, scores) {
  let from = [], to = [];
  graph.forEachLink(link => {
    let a = rowOf(link.fromId), b = rowOf(link.toId);
    if (a < 0 || b < 0 || a >= count || b >= count || a === b) return;
    from.push(a);
    to.push(b);
  });
  let present = new Uint8Array(count);
  let n = 0;
  graph.forEachNode(node => {
    let row = rowOf(node.id);
    if (row >= 0 && row < count && !present[row]) { present[row] = 1; n += 1; }
  });
  if (!n) return scores;
  let degree = new Float64Array(count);
  for (let i = 0; i < from.length; ++i) { degree[from[i]] += 1; degree[to[i]] += 1; }
  let rank = new Float64Array(count), next = new Float64Array(count);
  for (let i = 0; i < count; ++i) rank[i] = present[i] ? 1 / n : 0;
  let damping = 0.85;
  for (let round = 0; round < 30; ++round) {
    let dangling = 0;
    for (let i = 0; i < count; ++i) if (present[i] && degree[i] === 0) dangling += rank[i];
    let base = (1 - damping) / n + damping * dangling / n;
    for (let i = 0; i < count; ++i) next[i] = present[i] ? base : 0;
    for (let i = 0; i < from.length; ++i) {
      let a = from[i], b = to[i];
      next[b] += damping * rank[a] / degree[a];
      next[a] += damping * rank[b] / degree[b];
    }
    let swap = rank; rank = next; next = swap;
  }
  for (let i = 0; i < count; ++i) if (present[i]) scores[i] = rank[i];
  return scores;
}
