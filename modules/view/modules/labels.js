// labels: node labels that stay put while the layout moves.
//
//   view.use(labelNodes);
//   view.use(labelNodes, {importance: 'pagerank'});
//   view.use(labelNodes, {importance: 'population', max: 150});
//
// Every node has a fixed importance (links by default; or PageRank, a numeric field of node.data,
// or `node => number`), ranked once per graph change. A greedy pass places labels in that order
// against a grid on the screen, beside their node, and skips any that would overlap. So the most
// important nodes are labelled first, and zooming in makes room for more: the hierarchy comes
// from the ranking and the zoom. The most important labels are also bigger.
//
// Placement is stable:
// - It runs again only every 250 ms while the layout or the camera moves, and once they stop;
//   sooner when the zoom changed a lot (a search glide, a double tap), so the screen isn't left
//   with the labels of nodes that flew off it.
// - Labels placed last time go first, on the side of their node they had, so they don't jump.
// - Hovered, focused, dragged and selected nodes are always labelled, then the selection's
//   neighbours.
// - Labels make way for what covers the canvas (a settings panel, a toolbar): the view measures
//   what is visible (see visible.js and the view's `occlusion` option), and no label goes there.
// - Labels fade in and out (300 ms) in the shader.
// - Between placements each label follows its node on the GPU (see labels/program.js), so a
//   running layout costs the CPU nothing per frame for labels.
//
// The text is the view's `labelOf(node)` (or `text(node)`), cut to `maxLength` characters, drawn
// once per label with the canvas 2D API (any script works) into an atlas at the device's pixel
// ratio. A node whose text is empty gets no label.
//
// Options:
// - `importance` ('degree'): 'degree', 'pagerank', a field name of node.data, or `node => number`.
// - `max`: labels at most (besides forced ones). Default: one per `area` (8,000) square pixels of
//   canvas, between 20 and 200.
// - `padding` (8): pixels kept free around each label, so a dense part of the drawing reads as
//   labels with the drawing between them, not a wall of text.
// - `spacing` (null): {x, y} pixels the nodes of two labels must be apart, as an ellipse, for a
//   sparser and more even spread (a label on screen needs only 0.7 of it to stay).
// - `tiers`: text sizes by rank, [{count, share, min, size, weight, tone}] from the most important;
//   a node ranked below `count` and below `share` of all nodes (but at least `min`) takes that
//   tier. Default: the top 20 at 15 px semibold, the next to 200 at 13 px, the rest at 12 px.
//   `tone` (0 to 1) dims a tier's text: small labels recede (the default tones are 1, 0.92, 0.8),
//   and pointed and selected nodes' labels are always at full brightness.
// - `text`: `node => string`, the label's text (default: the view's `labelOf`). Return '' for
//   nodes that should have no label, e.g. nodes that have only an id.
// - `font` (system-ui and friends), `color` (0xffffffff), `halo` (0x0c2952e6), `haloWidth` (2 px),
//   `gap` (3 px between the node and its label), `every` (250 ms), `fade` (300 ms), `maxLength` (40).
//
// API: update(options) (new options; importance, text and look are read again), refresh() (labels
// read again), get() (the labelled nodes), stats() ({labels, placements, lastMs, maxMs}), dispose().
import {createLabelAtlas} from '../labels/atlas.js';
import {createLabelProgram, STRIDE} from '../labels/program.js';
import {placeLabels, ANCHOR_INDEX} from '../labels/place.js';
import {computeImportance, rankRows} from '../labels/importance.js';
import {HOVERED, SELECTED, DRAGGED, FOCUSED} from '../flags.js';

const DEFAULTS = {
  importance: 'degree',
  max: 0,
  // Text sizes by rank: a tier holds the nodes ranked below `count` (and below `share` of all
  // nodes), so a big graph has as few big labels as a small one. `tone` is the text's brightness:
  // the small labels recede and the big ones read first, as on a map.
  tiers: [
    {count: 20, share: 0.05, min: 3, size: 15, weight: 600, tone: 1},
    {count: 200, share: 0.3, min: 10, size: 13, weight: 500, tone: 0.92},
    {share: 1, min: 0, size: 12, weight: 400, tone: 0.8}
  ],
  // How far apart the nodes of two labels must be ({x, y} CSS pixels, an ellipse), for a sparser,
  // more even spread than padding gives. Off by default
  spacing: null,
  // One label per this many square CSS pixels of canvas at most (20 to 200)
  area: 8000,
  // Pixels kept free around each label: room to breathe, so dense parts aren't a wall of text
  padding: 8,
  font: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
  color: 0xffffffff,
  halo: 0x0c2952e6,
  haloWidth: 2,
  gap: 3,
  every: 250,
  fade: 300,
  maxLength: 40
};
// A label placed less than this long ago is kept before older ones
const YOUNG = 1000;
// At most this many selected nodes are labelled for sure, and this many of their neighbours first
const FORCED_SELECTED = 50, NEIGHBOURS = 200;
// How many candidates (per label wanted) a placement looks at before it stops
const LOOK_AT = 12;
// Pixels a label on screen may come closer to others before it gives way: a running layout
// jiggles nodes by a few pixels, and without this the labels packed tightest blink out and
// back, or jump to another side, as their neighbours move
const SLACK = 6;
// The zoom changed by this factor since the last placement: place again without waiting for
// `every`, but not more often than every ZOOM_GAP ms
const ZOOM_STEP = 1.5, ZOOM_GAP = 50;

export default {
  name: 'labels',
  attach(ctx, options = {}) {
    let settings = merge(options);
    let graph = ctx.graph;
    let atlas = createLabelAtlas(ctx.gl);
    let program = createLabelProgram(ctx.gl, ctx.instancing);
    let epoch = performance.now();

    // Ranking, by row: rebuilt when the graph or the layout's rows change
    let ranked = null;
    // What is on screen or fading out: node id -> label
    let shown = new Map();
    // Rows whose label is in the top tier for now (focused nodes), from the last placement
    let emphasis = new Set();
    // Labels drawn over the others for now: pointed nodes whose label found no room of its own
    // (it takes none: the labels around stay where they are), and focused ones
    let overlay = new Set();
    // Pointed nodes to label over the others, from candidates()
    let pointedList = [];
    // Label sizes (CSS pixels) by tier and text
    let sizes = new Map();
    // Nodes' diameters by row (scene units), from the last placement
    let nodeSizes = null;
    let ratio = 0;
    let data = new Float32Array(64 * STRIDE);
    let count = 0;
    let look = {count: 0, atlas: atlas.texture, time: 0, fade: settings.fade / 1000, gap: settings.gap,
      textColor: rgba(settings.color), haloColor: rgba(settings.halo)};

    let pending = true;
    let last = -Infinity;
    // The camera's distance to what it looks at, at the last placement
    let lastDistance = 0;
    let timer = 0;
    let stats = {labels: 0, placements: 0, lastMs: 0, maxMs: 0};

    ctx.onFrame(onFrame);
    ctx.addLayer({
      order: 0,
      draw(frame) {
        atlas.upload();
        look.count = count;
        look.time = (frame.time - epoch) / 1000;
        program.draw(frame, look);
      },
      dispose() {
        program.dispose();
        atlas.dispose();
      }
    });
    // What is labelled for sure changes with these: place again at the next frame
    ['hover', 'select', 'focus', 'dragstart', 'dragend'].forEach(name => ctx.on(name, soon));
    // A panel opened or closed: place again, as often as while the camera moves
    let coversChanged = false;
    if (ctx.onVisibleAreaChange) {
      ctx.onVisibleAreaChange(() => {
        coversChanged = true;
        ctx.requestFrame();
      });
    }
    graph.on('changed', onGraphChanged);
    ctx.requestFrame();

    return {
      update(newOptions) {
        settings = merge(Object.assign({}, options, newOptions));
        options = Object.assign({}, options, newOptions);
        look.fade = settings.fade / 1000;
        look.gap = settings.gap;
        look.textColor = rgba(settings.color);
        look.haloColor = rgba(settings.halo);
        restart();
      },
      refresh: restart,
      get() {
        let nodes = [];
        shown.forEach(label => { if (label.to > 0) nodes.push(label.node); });
        return nodes;
      },
      stats: () => Object.assign({}, stats),
      dispose() {
        clearTimeout(timer);
        graph.off('changed', onGraphChanged);
      }
    };

    function soon() {
      pending = true;
      ctx.requestFrame();
    }

    function restart() {
      ranked = null;
      sizes.clear();
      atlas.reset();
      shown.forEach(label => { label.entry = null; });
      soon();
    }

    function onGraphChanged() {
      ranked = null;
      soon();
    }

    function onFrame(change) {
      if (change.structure) {
        ranked = null;
        pending = true;
      }
      let now = performance.now();
      if (pending) {
        place(now);
      } else if (change.positions || change.camera || coversChanged) {
        coversChanged = false;
        // Moving: place again every `every` ms, and once more after it stops
        if (now - last >= settings.every || (now - last >= ZOOM_GAP && zoomedFar())) place(now);
        else schedule(settings.every - (now - last));
      }
      if (fading(now)) ctx.animate();
    }

    function schedule(ms) {
      if (timer) return;
      timer = setTimeout(() => {
        timer = 0;
        soon();
      }, Math.max(16, ms));
    }

    function zoomedFar() {
      let distance = cameraDistance();
      return lastDistance > 0 && distance > 0 &&
        (distance > lastDistance * ZOOM_STEP || distance * ZOOM_STEP < lastDistance);
    }

    function cameraDistance() {
      let view = ctx.scene.getDrawContext().view;
      if (!view || !view.position || !view.center) return 0;
      let p = view.position, c = view.center;
      return Math.hypot(p[0] - c[0], p[1] - c[1], (p[2] || 0) - (c[2] || 0));
    }

    function place(now) {
      pending = false;
      last = now;
      lastDistance = cameraDistance();
      clearTimeout(timer);
      timer = 0;
      let screen = ctx.screenPositions();
      let drawContext = ctx.scene.getDrawContext();
      if (drawContext.pixelRatio !== ratio) {
        // Images were drawn for another pixel ratio
        ratio = drawContext.pixelRatio || 1;
        atlas.reset();
        shown.forEach(label => { label.entry = null; });
      }
      nodeSizes = screen.sizes;
      if (!ranked || ranked.count !== screen.x.length) ranked = rank(screen.x.length);
      let max = settings.max || Math.round(Math.min(200, Math.max(20, screen.width * screen.height / settings.area)));

      let placed = placeLabels(candidates(screen, max), {
        width: screen.width, height: screen.height, gap: settings.gap, padding: settings.padding, slack: SLACK, max,
        spacing: settings.spacing,
        blocked: coveredTest(ctx.visibleArea())
      });
      // A pointed node's label never pushes the others out: if it has no place of its own, it is
      // drawn over them, beside its node, and they stay (the label the pointer goes to stays put)
      overlay.clear();
      let have = new Set(placed.map(p => p.row));
      let extra = pointedList.filter(c => !have.has(c.row));
      if (extra.length) {
        placeLabels(extra.map(c => Object.assign(c, {forced: true})), {width: screen.width, height: screen.height, gap: settings.gap})
          .forEach(p => {
            overlay.add(p.row);
            placed.push(p);
          });
      }
      apply(placed, screen, now);
      let ms = performance.now() - now;
      stats.labels = placed.length;
      stats.placements += 1;
      stats.lastMs = ms;
      stats.maxMs = Math.max(stats.maxMs, ms);
    }

    // Who gets a label, in order: forced (pointed and selected), the selection's neighbours,
    // labels placed last time (young ones first), then everyone by importance
    function candidates(screen, max) {
      let list = [];
      let taken = new Set();
      emphasis.clear();
      pointedList = [];
      let add = (node, forced, aside) => {
        if (!node || taken.has(node.id)) return;
        if (!textOf(node)) return;
        let body = ctx.layout.getBody(node.id);
        let row = body ? body.index : -1;
        if (row < 0 || row >= screen.x.length || !screen.onScreen[row]) return;
        taken.add(node.id);
        let flags = ctx.flags.get(node.id);
        let pointedNode = (flags & (HOVERED | FOCUSED | DRAGGED)) !== 0;
        // The label of a found or focused node is in the top tier, so it reads among the labels
        // around it; a hovered one keeps its size (labels don't grow and shrink under a moving
        // pointer)
        let focusedNode = (flags & FOCUSED) !== 0;
        let tier = focusedNode ? 0 : ranked.tier[row];
        if (focusedNode) emphasis.add(row);
        let size = sizeOf(node, tier);
        let radius = screen.radius[row];
        // Pointed and selected nodes are drawn larger, maybe with a ring (see the view's styles)
        let styles = ctx.view.getStyles ? ctx.view.getStyles() : {};
        if (pointedNode) radius = Math.max(radius * (styles.pointedScale || 1.5), (styles.pointedMinSize || 8) / 2) + ringOf(styles, styles.pointedRing);
        else if (flags & SELECTED) radius = Math.max(radius * (styles.selectedScale || 1.25), (styles.selectedMinSize || 6) / 2) + ringOf(styles, styles.selectedRing);
        let previous = shown.get(node.id);
        let candidate = {
          row, node, tier, x: screen.x[row], y: screen.y[row], radius,
          width: size.width, height: size.height,
          anchor: previous && previous.to > 0 ? previous.anchor : null,
          forced
        };
        if (aside) pointedList.push(candidate);
        else list.push(candidate);
      };
      // Pointed nodes: a found or focused one is labelled over the others; a hovered or dragged
      // one keeps its own label if it has one (it stays where it is), else gets one over the
      // others after the placement (see place())
      ctx.flags.ids(FOCUSED).forEach(id => add(graph.getNode(id), true, true));
      let hovered = ctx.flags.ids(HOVERED).concat(ctx.flags.ids(DRAGGED));
      hovered.forEach(id => {
        let label = shown.get(id);
        let node = graph.getNode(id);
        if (label && label.to > 0) add(node, false);
        else add(node, false, true);
      });
      let selected = ctx.flags.ids(SELECTED);
      selected.slice(0, FORCED_SELECTED).forEach(id => add(graph.getNode(id), true));
      let neighbours = 0;
      for (let i = 0; i < selected.length && i < FORCED_SELECTED && neighbours < NEIGHBOURS; ++i) {
        graph.forEachLinkedNode(selected[i], other => {
          if (neighbours >= NEIGHBOURS) return;
          neighbours += 1;
          add(other, false);
        });
      }
      let now = performance.now();
      let before = [];
      shown.forEach(label => { if (label.to > 0) before.push(label); });
      before.sort((a, b) => {
        let youngA = now - a.placedAt < YOUNG, youngB = now - b.placedAt < YOUNG;
        if (youngA !== youngB) return youngA ? -1 : 1;
        return ranked.position[rowOf(a.node)] - ranked.position[rowOf(b.node)];
      });
      before.forEach(label => add(label.node, false));
      let lookAt = max * LOOK_AT;
      let order = ranked.order, nodes = screen.nodes;
      for (let i = 0, seen = 0; i < order.length && seen < lookAt; ++i) {
        let row = order[i];
        if (!screen.onScreen[row]) continue;
        seen += 1;
        add(nodes[row], false);
      }
      return list;
    }

    // Labels on, labels off: fades, atlas images, and the buffer the shader reads
    function apply(placed, screen, now) {
      let time = (now - epoch) / 1000;
      let keep = new Set();
      placed.forEach(p => {
        let node = screen.nodes[p.row];
        let tier = emphasis.has(p.row) ? 0 : ranked.tier[p.row];
        keep.add(node.id);
        let label = shown.get(node.id);
        let text = textOf(node);
        let key = tier + '|' + text;
        if (!label) {
          label = {node, from: 0, to: 0, start: time, placedAt: now};
          shown.set(node.id, label);
        }
        if (label.to === 0) {
          // Fading in, from wherever it was
          label.from = alphaAt(label, time, settings.fade / 1000);
          label.to = 1;
          label.start = time;
          label.placedAt = now;
        }
        label.anchor = p.anchor;
        label.tier = tier;
        label.over = overlay.has(p.row);
        if (label.key !== key || !label.entry) {
          label.key = key;
          label.text = text;
          label.entry = null;
        }
      });
      shown.forEach((label, id) => {
        if (keep.has(id)) return;
        if (label.to > 0) {
          label.from = alphaAt(label, time, settings.fade / 1000);
          label.to = 0;
          label.start = time;
        } else if (time - label.start >= settings.fade / 1000) {
          shown.delete(id);
        }
      });
      fill();
    }

    // The buffer the shader reads: one entry per label shown or fading out
    function fill() {
      shown.forEach((label, id) => { if (!ctx.layout.getBody(id)) shown.delete(id); });
      drawImages();
      if (data.length < shown.size * STRIDE) data = new Float32Array(Math.max(shown.size, 2 * data.length / STRIDE) * STRIDE);
      count = 0;
      // Labels over the others are drawn last
      let order = [];
      shown.forEach((label, id) => { if (!label.over) order.push([label, id]); });
      shown.forEach((label, id) => { if (label.over) order.push([label, id]); });
      order.forEach(([label, id]) => {
        // No image: even an empty atlas could not hold every label; this one waits
        if (!label.entry || label.generation !== atlas.generation) return;
        let body = ctx.layout.getBody(id);
        let e = label.entry, o = count * STRIDE;
        data[o] = body.index;
        data[o + 1] = nodeSizes && body.index < nodeSizes.length ? nodeSizes[body.index] : 1;
        data[o + 2] = ANCHOR_INDEX[label.anchor] || 0;
        let tier = settings.tiers[label.tier] || settings.tiers[settings.tiers.length - 1];
        // How bright the text is: its tier's tone, full for a pointed or selected node (the shader)
        data[o + 3] = tier.tone === undefined ? 1 : tier.tone;
        data[o + 4] = e.width / ratio;
        data[o + 5] = e.height / ratio;
        data[o + 6] = e.x / atlas.width;
        data[o + 7] = e.y / atlas.height;
        data[o + 8] = (e.x + e.width) / atlas.width;
        data[o + 9] = (e.y + e.height) / atlas.height;
        data[o + 10] = label.start;
        data[o + 11] = label.from;
        data[o + 12] = label.to;
        count += 1;
      });
      program.update(data, count);
    }

    // Every label gets its image before any of them is written for the shader. The atlas keeps
    // images until it is full; then it starts over with only the labels shown now, those on
    // screen first and those fading out last, so no label points at an image that is gone.
    function drawImages() {
      for (let attempt = 0; ; ++attempt) {
        let full = false;
        for (let pass = 0; pass < 2 && !full; ++pass) {
          for (let label of shown.values()) {
            if ((label.to > 0) !== (pass === 0)) continue;
            if (label.entry && label.generation === atlas.generation) continue;
            let entry = image(label);
            if (!entry) {
              full = true;
              break;
            }
            label.entry = entry;
            label.generation = atlas.generation;
          }
        }
        // Full even when empty: the labels that didn't fit wait for the next placement
        if (!full || attempt > 0) return;
        atlas.reset();
      }
    }

    function image(label) {
      let tier = settings.tiers[label.tier] || settings.tiers[settings.tiers.length - 1];
      let size = sizeOf(label.node, label.tier);
      let font = `${tier.weight} ${tier.size * ratio}px ${settings.font}`;
      return atlas.add(label.key, label.text, font, settings.haloWidth * ratio,
        Math.ceil(size.width * ratio), Math.ceil(size.height * ratio));
    }

    // A label's box in CSS pixels: its text, a pixel of room, and the halo on each side
    function sizeOf(node, tierIndex) {
      let text = textOf(node);
      let key = tierIndex + '|' + text;
      let known = sizes.get(key);
      if (known) return known;
      let tier = settings.tiers[tierIndex] || settings.tiers[settings.tiers.length - 1];
      let width = atlas.measure(text, `${tier.weight} ${tier.size}px ${settings.font}`);
      let halo = settings.haloWidth;
      known = {width: Math.ceil(width + 2 * halo + 2), height: Math.ceil(tier.size * 1.3 + 2 * halo)};
      sizes.set(key, known);
      return known;
    }

    function textOf(node) {
      let text = settings.text ? settings.text(node) : ctx.labelOf(node);
      if (!text) return '';
      let max = settings.maxLength;
      return text.length > max ? text.slice(0, max - 1) + '…' : text;
    }

    function rowOf(node) {
      let body = ctx.layout.getBody(node.id);
      return body ? body.index : 0;
    }

    // Importance by row, the order of rows, each row's place in it, and its tier
    function rank(rows) {
      let rowOfId = id => {
        let body = ctx.layout.getBody(id);
        return body ? body.index : -1;
      };
      let scores = computeImportance(graph, rowOfId, rows, settings.importance);
      let order = rankRows(scores);
      let position = new Uint32Array(rows);
      for (let i = 0; i < order.length; ++i) position[order[i]] = i;
      let tier = new Uint8Array(rows);
      let nodes = graph.getNodesCount();
      let bounds = settings.tiers.map(t => {
        let bound = Math.ceil((t.share === undefined ? 1 : t.share) * nodes);
        if (t.count !== undefined) bound = Math.min(bound, t.count);
        return Math.max(t.min || 0, bound);
      });
      for (let i = 0; i < order.length; ++i) {
        let t = 0;
        while (t < bounds.length - 1 && i >= bounds[t]) t += 1;
        tier[order[i]] = t;
      }
      // Equal nodes get equal text: a tie takes the smallest size of its members, so when a grid's
      // nodes are all alike, none of them looks more important than the others
      for (let start = 0, i = 1; i <= order.length; ++i) {
        if (i < order.length && scores[order[i]] === scores[order[start]]) continue;
        let t = tier[order[i - 1]];
        for (let k = start; k < i; ++k) tier[order[k]] = t;
        start = i;
      }
      return {count: rows, order, position, tier};
    }

    function fading(now) {
      let time = (now - epoch) / 1000, fade = settings.fade / 1000;
      for (let label of shown.values()) {
        if (time - label.start < fade) return true;
      }
      return false;
    }
  }
};

// `box => boolean` for placeLabels: true where something covers the canvas (a panel, a toolbar),
// from the view's measured visible area. The area is known to a cell (a cover's edge to half a
// cell), so a box keeps half a cell clear of covered cells. Null when nothing covers it.
function coveredTest(area) {
  if (!area || !area.anyHidden || area.allHidden) return null;
  let {cell, cols, rows, hidden} = area;
  let reach = cell / 2;
  return box => {
    let c0 = Math.max(0, Math.floor((box.x - reach) / cell)), c1 = Math.min(cols - 1, Math.floor((box.x + box.width + reach) / cell));
    let r0 = Math.max(0, Math.floor((box.y - reach) / cell)), r1 = Math.min(rows - 1, Math.floor((box.y + box.height + reach) / cell));
    for (let r = r0; r <= r1; ++r) {
      for (let c = c0; c <= c1; ++c) {
        if (hidden[r * cols + c]) return true;
      }
    }
    return false;
  };
}

function alphaAt(label, time, fade) {
  let t = Math.min(1, Math.max(0, (time - label.start) / fade));
  return label.from + (label.to - label.from) * t;
}

// Pixels a ring adds around a node (the view's styles: halo and ring), or 0 without a ring
function ringOf(styles, ring) {
  return ring ? (styles.ringGap || 0) + (styles.ringWidth || 0) : 0;
}

function merge(options) {
  let settings = Object.assign({}, DEFAULTS, options);
  settings.tiers = (options.tiers || DEFAULTS.tiers).map(t => Object.assign({share: 1, min: 0, size: 12, weight: 400, tone: 1}, t));
  return settings;
}

function rgba(color) {
  return new Float32Array([((color >>> 24) & 255) / 255, ((color >>> 16) & 255) / 255, ((color >>> 8) & 255) / 255, (color & 255) / 255]);
}
