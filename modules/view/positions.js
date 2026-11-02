// Where the view keeps what it draws. Node `i` of the drawing is body `i` of the layout (row `i`
// of `simulator.store`), so positions go to the GPU in one pass over `store.pos`, and an edge is
// just the two rows it joins.

// Positions live in a float texture this many texels wide (a power of two, so the shaders can
// turn a row number into texture coordinates exactly); it grows by rows.
export const TEXTURE_WIDTH = 2048;

/** Texture rows needed for `count` nodes (at least one, so an empty graph still has a texture) */
export function textureRows(count) {
  return Math.max(1, Math.ceil(count / TEXTURE_WIDTH));
}

/**
 * Copies the first three axes of `n` bodies from `pos` (`D` numbers per body, as in
 * `simulator.store.pos`) into `out`, four floats per node: x, y, z (0 when D < 3), and a fourth
 * it doesn't touch (the view keeps node flags there). Axes after the third are not drawn.
 */
export function packPositions(pos, D, n, out) {
  let i, j, o;
  if (D === 2) {
    for (i = 0, j = 0, o = 0; i < n; ++i, j += 2, o += 4) {
      out[o] = pos[j];
      out[o + 1] = pos[j + 1];
      out[o + 2] = 0;
    }
  } else if (D === 3) {
    for (i = 0, j = 0, o = 0; i < n; ++i, j += 3, o += 4) {
      out[o] = pos[j];
      out[o + 1] = pos[j + 1];
      out[o + 2] = pos[j + 2];
    }
  } else {
    let axes = Math.min(D, 3);
    for (i = 0, j = 0, o = 0; i < n; ++i, j += D, o += 4) {
      for (let k = 0; k < 3; ++k) out[o + k] = k < axes ? pos[j + k] : 0;
    }
  }
  return out;
}

/**
 * Node colors and sizes in body order. `color(node)` and `size(node)` give each node's values;
 * a color of 0 (or none) means `defaultColor`. Returns {colors: Uint32Array, sizes: Float32Array,
 * nodes, maxSize} with one entry per body: `nodes[row]` is the graph's node of that row, and
 * `maxSize` the largest size.
 */
export function collectNodes(graph, layout, color, size, defaultColor) {
  let count = layout.simulator.store.n;
  let colors = new Uint32Array(count);
  let sizes = new Float32Array(count);
  let nodes = new Array(count);
  let maxSize = 0;
  graph.forEachNode(node => {
    let row = layout.getBody(node.id).index;
    colors[row] = (color && color(node)) || defaultColor;
    sizes[row] = size(node);
    nodes[row] = node;
    if (sizes[row] > maxSize) maxSize = sizes[row];
  });
  return {colors, sizes, nodes, maxSize};
}

/**
 * The rows each link joins, two floats per link in the order of `graph.forEachLink()`, and the
 * link colors. `color(link)` gives a link's color; 0 (or none) means `defaultColor`.
 */
export function collectEdges(graph, layout, color, defaultColor) {
  let count = graph.getLinksCount();
  let ends = new Float32Array(count * 2);
  let colors = new Uint32Array(count);
  let k = 0;
  graph.forEachLink(link => {
    ends[2 * k] = layout.getBody(link.fromId).index;
    ends[2 * k + 1] = layout.getBody(link.toId).index;
    colors[k] = (color && color(link)) || defaultColor;
    k += 1;
  });
  // Links can be fewer than getLinksCount() says while a graph change is in flight
  return {ends: ends.subarray(0, 2 * k), colors: colors.subarray(0, k), count: k};
}
