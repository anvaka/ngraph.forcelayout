// hover: tracks the node under a mouse or pen, flags it HOVERED, sets the cursor, and fires
// 'hover' with the node and the previous one (node null: nothing is hovered now).
//
//   view.use(hoverNodes);
//   view.on('hover', e => tooltip(e.node));
//
// Touch never hovers. A pointer move picks once per animation frame, and the node is picked again
// after every frame in which the layout or the camera moved, since nodes move under a still
// pointer. Nothing is hovered while something is being dragged. e.preventDefault() on 'hover'
// keeps the node from lighting up. A label's text counts as its node (see the labels module).
//
// Resting: hover lights a node up at once, as the pointer passes; what hover adds to the picture
// (the node's label in front, its tooltip) waits until the pointer rests on the node: it moved
// less than `rest.distance` pixels in `rest.time` ms (hoverIntent's rule). Then 'rest' fires with
// the node (and with null when the pointer moves on). So a pointer on its way to a label doesn't
// open labels and cards over it as it crosses other nodes.
//
//   view.on('rest', e => e.node && console.log('resting on', e.node.id));
//
// Options:
// - `holdStill` (false): pin the hovered node, so it doesn't drift away from the pointer. Off by
//   default because it changes the layout's physics.
// - `rest` ({distance: 6, time: 100}): how still a pointer rests; false: it rests at once.
//
// Other modules read it as ctx.get('hover'): {get(), resting()}.
import {HOVERED} from '../flags.js';

const REST = {distance: 6, time: 100};

export default {
  name: 'hover',
  attach(ctx, options = {}) {
    let point = null;
    // The current hit: {node, row, distance, inside, x, y, radius}
    let hovered = null;
    let frame = 0;
    let held = null; // {node, wasPinned}
    let rest = options.rest === false ? null : Object.assign({}, REST, options.rest || {});
    // The node the pointer rests on, where the pointer was when the stillness check started, and
    // the check's timer
    let resting = null;
    let restFrom = null;
    let restTimer = 0;

    ctx.input.add({
      name: 'hover',
      priority: 0,
      hover(newPoint) {
        point = newPoint;
        if (!point) setResting(null);
        else watchRest();
        if (!frame) frame = requestAnimationFrame(onFrame);
      }
    });
    ctx.onFrame(change => {
      if (point && (change.positions || change.camera || change.structure)) update();
    });
    let api = {
      /** The hovered node, or null */
      get: () => hovered ? hovered.node : null,
      /** The node the pointer rests on, or null */
      resting: () => resting,
      dispose() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        clearTimeout(restTimer);
        restTimer = 0;
        point = null;
        set(null);
      }
    };
    ctx.provide('hover', api);
    return api;

    // Checks every `rest.time` ms while the pointer moves whether it stayed within `rest.distance`
    function watchRest() {
      if (restTimer) return;
      restFrom = {x: point.x, y: point.y};
      if (!rest) {
        checkRest();
        return;
      }
      restTimer = setTimeout(checkRest, rest.time);
    }

    function checkRest() {
      restTimer = 0;
      if (!point) return;
      let still = !rest || Math.hypot(point.x - restFrom.x, point.y - restFrom.y) < rest.distance;
      if (still) setResting(hovered ? hovered.node : null);
      else watchRest();
    }

    function setResting(node) {
      if (resting === node) return;
      let previous = resting;
      resting = node;
      ctx.emit('rest', {node, previous, id: node ? node.id : undefined});
    }

    function onFrame() {
      frame = 0;
      update();
    }

    function update() {
      let hit = null;
      if (point && !ctx.input.dragging()) {
        hit = ctx.pick(point.x, point.y, {
          pointerType: point.pointerType,
          width: point.width,
          sticky: hovered ? hovered.node : null
        });
      }
      set(hit);
      // The cursor shows what a press would do, and a press is picked without the hover's bonus
      let pressHit = hit && hovered ? ctx.pick(point.x, point.y, {pointerType: point.pointerType, width: point.width}) : hit;
      updateCursor(pressHit);
    }

    function set(hit) {
      let previous = hovered ? hovered.node : null;
      let node = hit ? hit.node : null;
      hovered = hit;
      if (previous === node) return;
      // Another node: it rests once the pointer has been still on it
      if (resting && resting !== node) setResting(null);
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
      if (node && point) watchRest();
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
