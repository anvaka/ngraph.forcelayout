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
// - Selected nodes are always labelled, then the selection's neighbours.
// - Hover never places again (as on a map, hover changes how things look, never where labels
//   go). The hovered node (the hover module's: the pointer rests on it), the focused node and
//   dragged ones get their label in front: drawn last, where their own label is (at its size; a
//   focused node's in the top tier), or else on the side that covers the fewest labels, on a
//   plate. Labels under it stay where they are, behind it, and show again when it goes.
// - A label's text is part of its node: the view's pick() takes a point on a label as its node
//   (so the label you reach for is what you hover and tap).
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
// - `max`: labels at most (besides forced ones). Default: one per `area` (14,000) square pixels of
//   canvas, between 20 and 150, so about as many at every zoom.
// - `padding` (8): pixels kept free around each label, so a dense part of the drawing reads as
//   labels with the drawing between them, not a wall of text.
// - `spacing` (null): {x, y} pixels the nodes of two labels must be apart, as an ellipse, for a
//   sparser and more even spread (a label on screen needs only 0.7 of it to stay).
// - `tiers`: text sizes by rank, [{count, share, min, size, weight, tone}] from the most important;
//   a node ranked below `count` and below `share` of all nodes (but at least `min`) takes that
//   tier. Default: the top 20 at 16 px semibold, the next to 200 at 13 px, the rest at 12 px.
//   `tone` (0 to 1) dims a tier's text toward the halo: small labels recede and the drawing's
//   colors lead (the default tones are 1, 0.85, 0.68); pointed and selected nodes' labels are
//   always at full brightness.
// - `text`: `node => string`, the label's text (default: the view's `labelOf`). Return '' for
//   nodes that should have no label, e.g. nodes that have only an id.
// - `font` (system-ui and friends), `color` (0xffffffff), `halo` (0x0c2952e6), `haloWidth` (2 px),
//   `gap` (3 px between the node and its label), `every` (250 ms), `fade` (300 ms), `maxLength` (40).
//
// API: update(options) (new options; importance, text and look are read again), refresh() (labels
// read again), get() (the labelled nodes), boxes() (the labels on the canvas now: [{node, x, y,
// width, height, alpha, front}], CSS pixels, in drawing order), stats() ({labels, placements,
// lastMs, maxMs}), dispose().
import {createLabelAtlas} from '../labels/atlas.js';
import {createLabelProgram, STRIDE} from '../labels/program.js';
import {placeLabels, boxBeside, frontSide, labelAt, ANCHOR_INDEX} from '../labels/place.js';
import {computeImportance, rankRows} from '../labels/importance.js';
import {HOVERED, SELECTED, DRAGGED, FOCUSED} from '../flags.js';

const DEFAULTS = {
  importance: 'degree',
  max: 0,
  // Text sizes by rank: a tier holds the nodes ranked below `count` (and below `share` of all
  // nodes), so a big graph has as few big labels as a small one. `tone` is the text's brightness:
  // the small labels recede and the big ones read first, as on a map.
  tiers: [
    {count: 20, share: 0.05, min: 3, size: 16, weight: 600, tone: 1},
    {count: 200, share: 0.3, min: 10, size: 13, weight: 500, tone: 0.85},
    {share: 1, min: 0, size: 12, weight: 400, tone: 0.68}
  ],
  // How far apart the nodes of two labels must be ({x, y} CSS pixels, an ellipse), for a sparser,
  // more even spread than padding gives. Off by default
  spacing: null,
  // One label per this many square CSS pixels of canvas at most (20 to 150): about as many at
  // every zoom, so zooming in brings other names, not more of them
  area: 14000,
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
// A label that comes in front (a pointed node's) starts its fade in at this alpha
const FRONT_FROM = 0.6;
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
    // Labels in front (pointed nodes) need to be worked out again at the next frame
    let frontDirty = true;
    // The labels' boxes on the canvas, as last measured (null: measure again)
    let boxCache = null;
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
    // The canvas at the last placement (CSS pixels)
    let canvasSize = {width: 0, height: 0};
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
    // What is labelled for sure changes with the selection: place again at the next frame
    ctx.on('select', soon);
    // Pointed nodes change which labels are in front, without placing again
    ['hover', 'focus', 'dragstart', 'dragend'].forEach(name => ctx.on(name, () => {
      frontDirty = true;
      ctx.requestFrame();
    }));
    // The view's pick() asks here first: a point on a label's text is its node
    ctx.provide('labelTargets', {
      at: (x, y) => labelAt(currentBoxes(), x, y),
      /** The box of `node`'s label on the canvas now ({x, y, width, height}), or null */
      boxOf(node) {
        let found = currentBoxes().find(b => b.node === node);
        return found ? {x: found.x, y: found.y, width: found.width, height: found.height} : null;
      }
    });
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
      boxes() {
        let time = (performance.now() - epoch) / 1000;
        return currentBoxes().map(b => ({node: b.node, x: b.x, y: b.y, width: b.width, height: b.height,
          alpha: alphaAt(b.label, time, settings.fade / 1000), front: !!b.label.front}));
      },
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
      if (change.positions || change.camera || change.structure) boxCache = null;
      let now = performance.now();
      if (pending) {
        place(now);
      } else {
        if (change.positions || change.camera || coversChanged) {
          coversChanged = false;
          // Moving: place again every `every` ms, and once more after it stops
          if (now - last >= settings.every || (now - last >= ZOOM_GAP && zoomedFar())) place(now);
          else schedule(settings.every - (now - last));
        }
        // A node was pointed or let go: only the labels in front change
        if (frontDirty) {
          updateFront(now);
          fill();
        }
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
      let max = settings.max || Math.round(Math.min(150, Math.max(20, screen.width * screen.height / settings.area)));

      let covered = coveredTest(ctx.visibleArea());
      let fadingOut = fadingBoxes(screen, now);
      let placed = placeLabels(candidates(screen, max), {
        width: screen.width, height: screen.height, gap: settings.gap, padding: settings.padding, slack: SLACK, max,
        spacing: settings.spacing,
        // No new name prints over one still fading out
        blocked: fadingOut.length ? box => (covered && covered(box)) || overlapsAny(box, fadingOut) : covered
      });
      canvasSize.width = screen.width;
      canvasSize.height = screen.height;
      apply(placed, screen, now);
      let ms = performance.now() - now;
      stats.labels = placed.length;
      stats.placements += 1;
      stats.lastMs = ms;
      stats.maxMs = Math.max(stats.maxMs, ms);
    }

    // Who gets a label, in order: forced (selected), the selection's neighbours, labels placed last
    // time (young ones first), then everyone by importance. Pointed nodes take no part: their
    // labels are in front (see updateFront)
    function candidates(screen, max) {
      let list = [];
      let taken = new Set();
      let add = (node, forced) => {
        if (!node || taken.has(node.id)) return;
        if (!textOf(node)) return;
        let body = ctx.layout.getBody(node.id);
        let row = body ? body.index : -1;
        if (row < 0 || row >= screen.x.length || !screen.onScreen[row]) return;
        taken.add(node.id);
        let tier = ranked.tier[row];
        let size = sizeOf(node, tier);
        let radius = drawnRadius(node, screen.radius[row], false);
        let previous = shown.get(node.id);
        list.push({
          row, node, tier, x: screen.x[row], y: screen.y[row], radius,
          width: size.width, height: size.height,
          anchor: previous && previous.to > 0 && !previous.frontOnly ? previous.anchor : null,
          forced
        });
      };
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
      // Landmarks first: the top tier's nodes on screen, before the labels placed last time, so the
      // biggest names arrive at once and stay while the layout runs
      let topCount = 0;
      while (topCount < ranked.order.length && ranked.tier[ranked.order[topCount]] === 0) topCount += 1;
      for (let i = 0; i < topCount; ++i) {
        let row = ranked.order[i];
        if (screen.onScreen[row]) add(screen.nodes[row], false);
      }
      let now = performance.now();
      let before = [];
      // Labels only in front (a pointed node's) were not placed: they don't go first
      shown.forEach(label => { if (label.to > 0 && !label.frontOnly) before.push(label); });
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
        keep.add(node.id);
        let label = shown.get(node.id);
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
        label.frontOnly = false;
        setTier(label, label.front ? frontTier(node) : ranked.tier[p.row]);
        // Where its box sits beside its node (CSS pixels), for the fade-out test
        label.ox = p.x - screen.x[p.row];
        label.oy = p.y - screen.y[p.row];
        label.w = p.width;
        label.h = p.height;
      });
      shown.forEach((label, id) => {
        if (keep.has(id)) return;
        // In front stays, also where no label of its own fits now
        if (label.front) {
          label.frontOnly = true;
          return;
        }
        if (label.to > 0) {
          label.from = alphaAt(label, time, settings.fade / 1000);
          label.to = 0;
          label.start = time;
        } else if (time - label.start >= settings.fade / 1000) {
          shown.delete(id);
        }
      });
      updateFront(now);
      fill();
    }

    // Labels in front: the pointed nodes' (resting hover, focus, drag), largest, drawn last, where
    // their own label is or on the side that covers the fewest others. Nothing is placed again.
    function updateFront(now) {
      frontDirty = false;
      let time = (now - epoch) / 1000;
      // The hover module flags a node once the pointer rests on it
      let ids = new Set(ctx.flags.ids(FOCUSED).concat(ctx.flags.ids(DRAGGED), ctx.flags.ids(HOVERED)));
      shown.forEach((label, id) => {
        if (!label.front || ids.has(id)) return;
        label.front = false;
        if (label.frontOnly) {
          label.from = alphaAt(label, time, settings.fade / 1000);
          label.to = 0;
          label.start = time;
        } else {
          setTier(label, ranked ? ranked.tier[rowOf(label.node)] : 0);
        }
      });
      if (!ranked) return;
      let others = null;
      ids.forEach(id => {
        let node = graph.getNode(id);
        if (!node || !textOf(node) || !ctx.layout.getBody(id)) return;
        let label = shown.get(id);
        if (!label) {
          label = {node, from: 0, to: 0, start: time, placedAt: now};
          shown.set(id, label);
        }
        let placedHere = label.to > 0 && !label.frontOnly;
        if (!placedHere) {
          if (label.to === 0 || !label.front) {
            // Most of the way in already: it answers the pointer
            label.from = Math.max(alphaAt(label, time, settings.fade / 1000), FRONT_FROM);
            label.to = 1;
            label.start = time;
          }
          // A label that wasn't on the canvas takes the side that covers the fewest others, and
          // keeps it while it stays in front
          if (!label.front || !label.anchor) {
            if (!others) others = currentBoxes().filter(b => !b.label.front);
            let disc = ctx.discsOf([node])[0];
            let size = sizeOf(node, frontTier(node));
            label.anchor = disc ? frontSide({x: disc.x, y: disc.y, radius: drawnRadius(node, disc.radius, true),
              width: size.width, height: size.height}, others, {
              gap: settings.gap, width: canvasSize.width, height: canvasSize.height,
              blocked: coveredTest(ctx.visibleArea())
            }) : 'right';
          }
          label.frontOnly = true;
        }
        label.front = true;
        setTier(label, frontTier(node));
      });
      boxCache = null;
    }

    // A label in front keeps its own size (labels don't grow and shrink under the pointer), but a
    // focused (or found) node's is in the top tier, so it reads among the labels around it
    function frontTier(node) {
      return ctx.flags.has(node.id, FOCUSED) || !ranked ? 0 : ranked.tier[rowOf(node)];
    }

    // A label's text size (tier); its image is drawn again when that changes
    function setTier(label, tier) {
      let text = textOf(label.node);
      let key = tier + '|' + text;
      label.tier = tier;
      if (label.key !== key || !label.entry) {
        label.key = key;
        label.text = text;
        label.entry = null;
      }
    }

    // The node's disc as its label makes room for it: selected nodes are larger, maybe with a
    // ring (see the view's styles), and so are pointed ones, for a label in front (as the shader)
    function drawnRadius(node, radius, front) {
      let flags = ctx.flags.get(node.id);
      let styles = ctx.view.getStyles ? ctx.view.getStyles() : {};
      if (front && (flags & (HOVERED | FOCUSED | DRAGGED))) return Math.max(radius * (styles.pointedScale || 1.5), (styles.pointedMinSize || 8) / 2) + ringOf(styles, styles.pointedRing);
      if (flags & SELECTED) return Math.max(radius * (styles.selectedScale || 1.25), (styles.selectedMinSize || 6) / 2) + ringOf(styles, styles.selectedRing);
      return radius;
    }

    // Labels in the order they are drawn: those in front last
    function drawOrder() {
      let back = [], front = [];
      shown.forEach(label => (label.front ? front : back).push(label));
      return back.concat(front);
    }

    // Where the labels are on the canvas now (they follow their nodes), in drawing order: the
    // ones shown or fading in, with an image. Measured again after the nodes or the camera moved.
    function currentBoxes() {
      if (boxCache) return boxCache;
      let list = drawOrder().filter(label => label.to > 0 && label.anchor && ctx.layout.getBody(label.node.id));
      let discs = list.length ? ctx.discsOf(list.map(label => label.node)) : [];
      let box = {x: 0, y: 0, width: 0, height: 0};
      boxCache = [];
      list.forEach((label, i) => {
        let disc = discs[i];
        if (!disc) return;
        let size = sizeOf(label.node, label.tier);
        boxBeside({x: disc.x, y: disc.y, radius: drawnRadius(label.node, disc.radius, !!label.front), width: size.width, height: size.height},
          label.anchor, settings.gap, box);
        boxCache.push({label, node: label.node, x: box.x, y: box.y, width: box.width, height: box.height,
          disc: {x: disc.x, y: disc.y, radius: disc.radius}, front: !!label.front});
      });
      return boxCache;
    }

    // The buffer the shader reads: one entry per label shown or fading out, those in front last
    function fill() {
      shown.forEach((label, id) => { if (!ctx.layout.getBody(id)) shown.delete(id); });
      drawImages();
      if (data.length < shown.size * STRIDE) data = new Float32Array(Math.max(shown.size, 2 * data.length / STRIDE) * STRIDE);
      count = 0;
      boxCache = null;
      drawOrder().forEach(label => {
        let id = label.node.id;
        // No image: even an empty atlas could not hold every label; this one waits
        if (!label.entry || label.generation !== atlas.generation) return;
        let body = ctx.layout.getBody(id);
        let e = label.entry, o = count * STRIDE;
        data[o] = body.index;
        data[o + 1] = nodeSizes && body.index < nodeSizes.length ? nodeSizes[body.index] : 1;
        data[o + 2] = ANCHOR_INDEX[label.anchor] || 0;
        let tier = settings.tiers[label.tier] || settings.tiers[settings.tiers.length - 1];
        // How bright the text is: its tier's tone (the shader shows pointed and selected nodes' at
        // full). Below 0, a label in front (a pointed node's): -1 where its own label is, -2 drawn
        // over the others, on a plate of the halo's color that hides what is under it
        data[o + 3] = label.front ? (label.frontOnly ? -2 : -1) : tier.tone === undefined ? 1 : tier.tone;
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

    // Boxes of labels still fading out, where they are now: a new label waits for them to go
    function fadingBoxes(screen, now) {
      let time = (now - epoch) / 1000, fade = settings.fade / 1000, list = [];
      shown.forEach(label => {
        if (label.to !== 0 || time - label.start >= fade || label.ox === undefined) return;
        let body = ctx.layout.getBody(label.node.id);
        if (!body || body.index >= screen.x.length || !screen.onScreen[body.index]) return;
        list.push(screen.x[body.index] + label.ox, screen.y[body.index] + label.oy, label.w, label.h);
      });
      return list;
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

function overlapsAny(box, list) {
  for (let i = 0; i < list.length; i += 4) {
    if (box.x < list[i] + list[i + 2] && box.x + box.width > list[i] && box.y < list[i + 1] + list[i + 3] && box.y + box.height > list[i + 1]) return true;
  }
  return false;
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
