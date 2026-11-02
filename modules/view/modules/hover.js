// hover: tracks the node under a mouse or pen, flags it HOVERED, sets the cursor, and fires
// 'hover' with the node and the previous one (node null: nothing is hovered now).
//
//   view.use(hoverNodes);
//   view.on('hover', e => tooltip(e.node));
//
// Touch never hovers. A pointer move picks once per animation frame, and the node is picked again
// after every frame in which the layout or the camera moved, since nodes move under a still
// pointer. Nothing is hovered while something is being dragged. e.preventDefault() on 'hover'
// keeps the node from lighting up.
//
// Options:
// - `holdStill` (false): pin the hovered node, so it doesn't drift away from the pointer. Off by
//   default because it changes the layout's physics.
import {HOVERED} from '../flags.js';

export default {
  name: 'hover',
  attach(ctx, options = {}) {
    let point = null;
    // The current hit: {node, row, distance, inside, x, y, radius}
    let hovered = null;
    let frame = 0;
    let held = null; // {node, wasPinned}

    ctx.input.add({
      name: 'hover',
      priority: 0,
      hover(newPoint) {
        point = newPoint;
        if (!frame) frame = requestAnimationFrame(onFrame);
      }
    });
    ctx.onFrame(change => {
      if (point && (change.positions || change.camera || change.structure)) update();
    });

    return {
      /** The hovered node, or null */
      get: () => hovered ? hovered.node : null,
      dispose() {
        if (frame) cancelAnimationFrame(frame);
        frame = 0;
        point = null;
        set(null);
      }
    };

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
      updateCursor(hit);
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
