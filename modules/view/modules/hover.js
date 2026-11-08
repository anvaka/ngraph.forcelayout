// hover: the node a mouse or pen rests on is flagged HOVERED, and 'hover' fires with the node and
// the previous one (node null: nothing is hovered now). The cursor shows at once what a press
// would do there.
//
//   view.use(hoverNodes);
//   view.on('hover', e => tooltip(e.node));
//
// Only a node the pointer singles out lights up (view.pick's `distinct`): on its label, on a hub's
// dot, or a dot with no other within the pointer's tip (5 px for a mouse, 8 for a pen). Dots
// denser than that are texture: nothing lights, and a press there moves the camera. Zoom in and
// they come apart.
//
// Resting: a node lights up (and its label comes in front, its tooltip opens) once the pointer
// rests on it: it stayed within `rest.distance` pixels of a point for `rest.time` ms (as Windows'
// hover rectangle, and hoverIntent).
// A pointer on its way somewhere crosses other nodes without lighting them up, so nothing it
// passes changes the picture; leaving the hovered node puts its light out at once. A label's text
// counts as its node (see the labels module).
//
// While the pointer rests, nodes move under it (a running layout, a zoom): the hovered node stays
// hovered while it stays near the pointer (`stillReach` pixels from its disc, or on its label),
// so a still pointer doesn't hop between neighbours. Touch never hovers. Nothing is hovered while
// something is being dragged. e.preventDefault() on 'hover' keeps the node from lighting up.
//
// Options:
// - `holdStill` (false): pin the hovered node, so it doesn't drift away from the pointer. Off by
//   default because it changes the layout's physics.
// - `rest` ({distance: {mouse: 3, pen: 6}, time: 120}): how still a pointer rests (a pen hovering
//   in the air shakes more); false: it rests at once, and a node lights up as soon as the pointer
//   is over it.
// - `stillReach` (20): pixels from the hovered node's disc within which a still pointer keeps it.
import {HOVERED} from '../flags.js';

const REST = {distance: {mouse: 3, pen: 6}, time: 120};
const STILL_REACH = 20;

export default {
  name: 'hover',
  attach(ctx, options = {}) {
    let point = null;
    // The hovered hit: {node, row, distance, inside, x, y, radius}
    let hovered = null;
    let frame = 0;
    let held = null; // {node, wasPinned}
    let rest = options.rest === false ? null : Object.assign({}, REST, options.rest || {});
    let stillReach = options.stillReach !== undefined ? options.stillReach : STILL_REACH;
    // The pointer rests: it has stayed near `anchor` ({x, y, t}) since `anchor.t` for `rest.time`
    let still = !rest;
    let anchor = null;
    let restTimer = 0;

    ctx.input.add({
      name: 'hover',
      priority: 0,
      hover(newPoint) {
        point = newPoint;
        if (!point) {
          still = !rest;
          anchor = null;
          stopWatching();
        } else if (rest) {
          if (!anchor || Math.hypot(point.x - anchor.x, point.y - anchor.y) >= restDistance(point)) {
            anchor = {x: point.x, y: point.y, t: performance.now()};
            still = false;
          }
          if (!still) watchRest();
        }
        if (!frame) frame = requestAnimationFrame(onFrame);
      }
    });
    ctx.onFrame(change => {
      if (point && (change.positions || change.camera || change.structure)) update(true);
    });
    // A press of this pointer takes the node that is lit (index.js asks): what lights up is what
    // a press takes, also when the node drifted from a still pointer (`stillReach`)
    ctx.provide('litAt', (x, y) => hovered && point && Math.hypot(x - point.x, y - point.y) <= restDistance(point) ? hovered : null);

    return {
      /** The hovered node, or null */
      get: () => hovered ? hovered.node : null,
      dispose() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        stopWatching();
        point = null;
        set(null);
      }
    };

    function onFrame() {
      frame = 0;
      update(false);
    }

    // `moved`: the nodes or the camera moved under the pointer (not the pointer itself)
    function update(moved) {
      let hit = null;
      if (point && !ctx.input.dragging()) {
        if (moved && still && hovered && near(hovered.node)) {
          hit = hovered;
        } else {
          // Only a node the pointer singles out lights up: dots denser than its tip are texture
          hit = ctx.pick(point.x, point.y, {
            pointerType: point.pointerType,
            width: point.width,
            sticky: hovered ? hovered.node : null,
            distinct: true
          });
        }
      }
      if (hit && hovered && hit.node === hovered.node) hovered = hit;
      // A resting pointer hovers what it is on; a moving one only lets go of what it left
      else if (still || !hit) set(hit);
      else set(null);
      // The cursor shows what a press would do: a press takes what is lit (see index.js)
      updateCursor(hit);
    }

    // The still pointer is near `node`: on its label, or within `stillReach` of its disc
    function near(node) {
      let labels = ctx.get ? ctx.get('labelTargets') : null;
      let box = labels ? labels.boxOf(node) : null;
      if (box && point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height) return true;
      let disc = ctx.discsOf ? ctx.discsOf([node])[0] : null;
      return !!disc && Math.hypot(disc.x - point.x, disc.y - point.y) - disc.radius <= stillReach;
    }

    function restDistance(p) {
      let d = rest.distance;
      if (typeof d === 'number') return d;
      return d[p.pointerType] || d.mouse || 3;
    }

    // Checks, once the pointer has had `rest.time` to settle, whether it stayed near its anchor
    function watchRest() {
      if (restTimer) return;
      restTimer = setTimeout(checkRest, Math.max(10, anchor.t + rest.time - performance.now()));
    }

    function stopWatching() {
      clearTimeout(restTimer);
      restTimer = 0;
    }

    function checkRest() {
      restTimer = 0;
      if (!point || !anchor || still) return;
      if (performance.now() - anchor.t >= rest.time - 1) {
        still = true;
        update(false);
      } else {
        watchRest();
      }
    }

    function set(hit) {
      let previous = hovered ? hovered.node : null;
      let node = hit ? hit.node : null;
      hovered = hit;
      if (previous === node) return;
      if (previous) {
        ctx.flags.set(previous.id, HOVERED, false);
        letGo();
      }
      let e = ctx.emit('hover', {
        node, previous, id: node ? node.id : undefined, row: hit ? hit.row : -1, hit,
        x: point ? point.x : 0, y: point ? point.y : 0,
        clientX: point ? point.clientX : 0, clientY: point ? point.clientY : 0,
        pointerType: point ? point.pointerType : null,
        originalEvent: point ? point.originalEvent : null
      });
      if (node && !e.defaultPrevented) {
        ctx.flags.set(node.id, HOVERED, true);
        if (options.holdStill) hold(node);
      }
    }

    // What a press would do here: the cursor of the module that would take it (a drag's grab),
    // or a pointer over a node a tap would pick
    function updateCursor(hit) {
      if (!point) {
        ctx.setCursor(null);
        return;
      }
      let claimant = ctx.input.claimant({
        id: -1, pointerType: point.pointerType, button: 0,
        x: point.x, y: point.y, downX: point.x, downY: point.y,
        shiftKey: point.shiftKey, altKey: point.altKey, ctrlKey: point.ctrlKey, metaKey: point.metaKey,
        hit, node: hit ? hit.node : null
      });
      let cursor = claimant && claimant.cursor ? claimant.cursor : (hit ? 'pointer' : null);
      ctx.setCursor(cursor);
    }

    function hold(node) {
      let layout = ctx.layout;
      held = {node, layout, wasPinned: layout.isNodePinned(node)};
      layout.pinNode(node, true);
    }

    function letGo() {
      if (!held) return;
      // A drag may have pinned or released it since: leave it to the drag then
      if (held.layout === ctx.layout && ctx.graph.getNode(held.node.id) && !ctx.flags.has(held.node.id, ctx.FLAGS.DRAGGED)) {
        held.layout.pinNode(held.node, held.wasPinned);
      }
      held = null;
    }
  }
};
