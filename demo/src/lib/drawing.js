// The drawing's rules (lib/look.js) applied to a view: what createGraphScene.js passes to
// createView(), and what keeps the drawing readable while the layout and the camera move.
//
// - Link brightness follows the ink links put on the screen: at most every 300 ms, a sample of up
//   to 20k springs is binned on a 32 x 32 grid over the drawing, and the alpha is set so that the
//   most crowded tenth of the cells gets `look.linkInk` of opacity. So a hairball's core isn't a
//   solid disc, a sparse tree's links are bright, and zooming in brings links up.
// - The smallest node size follows crowding too: 1 to `look.nodeMinSize` pixels.
import look, {colorsOf, nodeSizeOf, hasNames} from './look.js';

/** Options for createView(): colors, sizes and styles from the look */
export function viewOptions(graph, layout, {nodeColor, springLength} = {}) {
  let colors = colorsOf(graph);
  return {
    colors,
    options: {
      graph, layout,
      nodeColor: nodeColor ? nodeColor(colors.nodeColor) : colors.nodeColor,
      nodeSize: nodeSizeOf(graph, (springLength || 10) / 10),
      nodeMinSize: look.nodeMinSize,
      nodeRoom: look.nodeRoom,
      fog: look.fog,
      linkColor: colors.linkColor(look.linkAlpha[1]),
      linkWidth: look.linkWidth,
      styles: look.styles
    }
  };
}

/** Options for the labels module: names only, the look's typography */
export function labelOptions(graph) {
  let meta = graph.meta || {};
  let options = Object.assign({}, look.labels);
  if (meta.importance) options.importance = meta.importance;
  // Ids are not names: a graph that has only ids gets no labels (the tooltip shows the id)
  if (!hasNames(graph)) options.text = () => '';
  return options;
}

/**
 * Keeps link alpha and the smallest node size fitting what is on screen. `colors` is what
 * viewOptions() returned. Returns {legend, update(), dispose()}.
 */
export function attachDrawing(view, graph, colors) {
  let alpha = look.linkAlpha[1], minSize = look.nodeMinSize;
  let timer = 0, at = 0;
  let module = view.use({
    name: 'drawing',
    attach(ctx) {
      ctx.onFrame(change => { if (change.positions || change.camera) schedule(); });
      ctx.onCamera(schedule);
    }
  });
  schedule();

  return {
    legend: colors.legend,
    // What it picked for the screen now (the copied code starts from these)
    linkAlpha: () => alpha,
    nodeMinSize: () => minSize,
    update: measure,
    dispose() {
      clearTimeout(timer);
      if (module && module.dispose) module.dispose();
    }
  };

  function schedule() {
    if (timer) return;
    timer = setTimeout(measure, Math.max(0, 300 - (performance.now() - at)));
  }

  function measure() {
    timer = 0;
    at = performance.now();
    let layout = view.getLayout();
    if (!layout) return;
    let sim = layout.simulator, pos = sim.store.pos, D = sim.store.D, springs = sim.springStore;
    let n = sim.store.n;
    if (!n) return;
    let rect = layout.getGraphRect();
    let w = rect.max_x - rect.min_x, h = rect.max_y - rect.min_y;
    let k = pixelsPerUnit(rect);
    if (!(k > 0) || !(w > 0) || !(h > 0)) return;

    // Nodes: 1 to nodeMinSize pixels, by how many share a pixel of the drawing's box
    let perNode = w * h * k * k / n;
    let size = Math.min(look.nodeMinSize, Math.max(1, Math.sqrt(0.15 * perNode)));
    if (Math.abs(size - minSize) > 0.1) {
      minSize = size;
      view.setNodeMinSize(size);
    }

    // Links: their length per cell of a 32 x 32 grid, as screen coverage
    let count = springs.n;
    if (!count) return;
    const BINS = 32;
    let cells = new Float64Array(BINS * BINS);
    let step = Math.max(1, Math.floor(count / 20000));
    for (let i = 0; i < count; i += step) {
      let a = springs.from[i] * D, b = springs.to[i] * D;
      let x1 = pos[a], y1 = pos[a + 1], x2 = pos[b], y2 = pos[b + 1];
      let mx = Math.min(BINS - 1, Math.max(0, Math.floor(((x1 + x2) / 2 - rect.min_x) / w * BINS)));
      let my = Math.min(BINS - 1, Math.max(0, Math.floor(((y1 + y2) / 2 - rect.min_y) / h * BINS)));
      cells[my * BINS + mx] += Math.hypot(x2 - x1, y2 - y1) * step;
    }
    let cellArea = (w / BINS) * (h / BINS);
    let width = look.linkWidth / k;
    let filled = [];
    for (let c = 0; c < cells.length; ++c) if (cells[c] > 0) filled.push(cells[c] * width / cellArea);
    if (!filled.length) return;
    filled.sort((p, q) => p - q);
    let crowded = filled[Math.floor(0.9 * (filled.length - 1))];
    let [low, high] = look.linkAlpha;
    let next = Math.min(high, Math.max(low, look.linkInk / Math.max(crowded, 1e-9)));
    // Rebuilding link colors costs a pass over the links: only for a visible change
    if (Math.abs(next - alpha) / alpha < 0.15) return;
    alpha = next;
    view.setLinkColor(colors.linkColor(alpha));
  }

  // CSS pixels per unit of the scene at the middle of the drawing
  function pixelsPerUnit(rect) {
    let cx = (rect.min_x + rect.max_x) / 2, cy = (rect.min_y + rect.max_y) / 2;
    let cz = rect.min_z !== undefined ? (rect.min_z + rect.max_z) / 2 : 0;
    let a = view.toScreen(cx, cy, cz), b = view.toScreen(cx + 1, cy, cz), c = view.toScreen(cx, cy + 1, cz);
    if (!a || !b || !c) return 0;
    return Math.max(Math.hypot(b.x - a.x, b.y - a.y), Math.hypot(c.x - a.x, c.y - a.y));
  }
}
