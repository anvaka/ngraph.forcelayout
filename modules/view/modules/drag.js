// drag: moves nodes with a mouse, pen or finger. The node is pinned while it moves and goes back
// to the layout when dropped. Dragging a selected node moves the whole selection rigidly. Escape
// (or a cancelled pointer) puts every dragged node back where it was.
//
//   view.use(dragNodes);
//   view.on('dragend', e => console.log(e.node.id, e.nodes.length, e.cancelled));
//
// The same rule holds for a mouse, a pen and a finger; only the picking reach differs (8, 10 and
// 16+ pixels). A press grabs a node when it clearly lands on it: on its drawn disc, or nearer to it
// than to any other node by at least half the reach. Where nodes crowd (a dense graph at a small
// zoom, where every point is near several nodes) the press moves the camera instead, and a long
// press grabs the nearest node.
//
// The node stays under the pointer while the camera moves (other fingers can pan and zoom), and
// keeps its offset from the pointer. In 3D it moves on the plane through it that faces the
// camera. It works the same with the layout on the CPU or on WebGPU (through setNodePosition()),
// and with the layout paused.
//
// Events: 'dragstart' (e.preventDefault() leaves the press to the camera), 'drag', 'dragend'
// ({cancelled}). Each has `node` (the one under the pointer) and `nodes` (all that move).
//
// Options:
// - `pinOnDrop` (false): leave dropped nodes pinned. Nodes that were pinned stay pinned either way.
// - `longPress` (true): a long press near a node grabs it, also where nodes crowd.
import {DRAGGED, SELECTED} from '../flags.js';

export default {
  name: 'drag',
  attach(ctx, options = {}) {
    let pinOnDrop = !!options.pinOnDrop;
    let longPress = options.longPress !== false;
    // Pointer id -> drag in progress
    let drags = new Map();
    // Pointer id -> node taken by a long press, not moved yet
    let taken = new Map();

    ctx.input.add({
      name: 'drag',
      priority: 20,
      cursor: 'grab',
      press: p => grabs(p) && !!p.hit && p.hit.clear,
      longpress(p) {
        if (!longPress || !grabs(p) || !p.node) return false;
        taken.set(p.id, p.node);
        ctx.flags.set(p.node.id, DRAGGED, true);
        updateCursor();
        return true;
      },
      dragstart: begin,
      drag(p) {
        let drag = drags.get(p.id);
        if (!drag) return;
        drag.x = p.x;
        drag.y = p.y;
        move(drag);
        ctx.emit('drag', eventOf(drag, p, {}));
      },
      dragend: p => end(p, false),
      cancel: p => end(p, true),
      up: p => letGoTaken(p.id),
      key(e) {
        if (e.key !== 'Escape' || (!drags.size && !taken.size)) return false;
        Array.from(drags.keys()).concat(Array.from(taken.keys())).forEach(ctx.input.cancel);
        return true;
      }
    });
    // Other fingers (or keys, or inertia) move the camera: keep the nodes under their pointers
    ctx.onCamera(() => drags.forEach(move));

    return {
      /** Nodes being dragged now */
      get() {
        let all = [];
        drags.forEach(drag => drag.items.forEach(item => all.push(item.node)));
        return all;
      },
      dispose() {
        Array.from(drags.keys()).concat(Array.from(taken.keys())).forEach(ctx.input.cancel);
      }
    };

    function grabs(p) {
      return p.button === 0 && !p.shiftKey && !(p.node && ctx.flags.has(p.node.id, DRAGGED) && !taken.has(p.id));
    }

    function begin(p) {
      let node = taken.get(p.id) || p.node;
      if (!node) return false;
      let layout = ctx.layout;
      let group = ctx.flags.has(node.id, SELECTED) ? ctx.flags.ids(SELECTED) : [node.id];
      let nodes = [node].concat(group.filter(id => id !== node.id).map(id => ctx.graph.getNode(id)).filter(Boolean));
      let e = ctx.emit('dragstart', {
        node, nodes, id: node.id, x: p.x, y: p.y, clientX: p.clientX, clientY: p.clientY,
        pointerType: p.pointerType, pointerId: p.id, originalEvent: p.event
      });
      if (e.defaultPrevented) {
        letGoTaken(p.id);
        return false;
      }
      taken.delete(p.id);

      let D = layout.simulator.store.D;
      let items = nodes.map(n => {
        let body = layout.getBody(n.id);
        let start = new Float64Array(D);
        for (let k = 0; k < D; ++k) start[k] = body.pos.array[body.pos.offset + k];
        let item = {node: n, body, start, wasPinned: layout.isNodePinned(n)};
        layout.pinNode(n, true);
        body.velocity.reset();
        ctx.flags.set(n.id, DRAGGED, true);
        return item;
      });
      // Where the node is on the canvas, relative to where the press went down
      let anchor = items[0].start;
      let onScreen = ctx.toScreen(anchor[0], D > 1 ? anchor[1] : 0, D > 2 ? anchor[2] : 0);
      let drag = {
        pointerId: p.id, layout, items, D, x: p.x, y: p.y,
        offsetX: onScreen ? onScreen.x - p.downX : 0,
        offsetY: onScreen ? onScreen.y - p.downY : 0
      };
      drags.set(p.id, drag);
      updateCursor();
      return true;
    }

    function move(drag) {
      if (drag.layout !== ctx.layout) return;
      let D = drag.D;
      let anchor = drag.items[0];
      let x = drag.x + drag.offsetX, y = drag.y + drag.offsetY;
      let target;
      if (D >= 3) {
        let pos = anchor.body.pos;
        target = ctx.fromScreen(x, y, [pos.array[pos.offset], pos.array[pos.offset + 1], pos.array[pos.offset + 2]]);
      } else {
        target = ctx.fromScreen(x, y);
      }
      if (!target) return;
      let delta = [target[0] - anchor.start[0], D > 1 ? target[1] - anchor.start[1] : 0, D > 2 ? target[2] - anchor.start[2] : 0];
      drag.items.forEach(item => place(drag.layout, item, delta));
      ctx.view.invalidate();
    }

    function place(layout, item, delta) {
      let args = [item.node.id];
      let pos = item.body.pos;
      for (let k = 0; k < item.start.length; ++k) {
        args.push(k < 3 ? item.start[k] + delta[k] : pos.array[pos.offset + k]);
      }
      layout.setNodePosition.apply(layout, args);
    }

    function end(p, cancelled) {
      if (letGoTaken(p.id)) return;
      let drag = drags.get(p.id);
      if (!drag) return;
      drags.delete(p.id);
      let layout = drag.layout;
      let current = layout === ctx.layout;
      drag.items.forEach(item => {
        ctx.flags.set(item.node.id, DRAGGED, false);
        if (!current || !ctx.graph.getNode(item.node.id)) return;
        if (cancelled) place(layout, item, [0, 0, 0]);
        layout.pinNode(item.node, item.wasPinned || (pinOnDrop && !cancelled));
        // Velocity from before the drag would throw the node
        item.body.velocity.reset();
      });
      ctx.view.invalidate();
      updateCursor();
      ctx.emit('dragend', eventOf(drag, p, {cancelled}));
    }

    function letGoTaken(pointerId) {
      let node = taken.get(pointerId);
      if (!node) return false;
      taken.delete(pointerId);
      ctx.flags.set(node.id, DRAGGED, false);
      updateCursor();
      return true;
    }

    function eventOf(drag, p, fields) {
      let node = drag.items[0].node;
      return Object.assign({
        node, nodes: drag.items.map(item => item.node), id: node.id,
        x: p.x, y: p.y, clientX: p.clientX, clientY: p.clientY,
        pointerType: p.pointerType, pointerId: p.id, originalEvent: p.event
      }, fields);
    }

    function updateCursor() {
      ctx.setCursor(drags.size || taken.size ? 'grabbing' : null, 2);
    }
  }
};
