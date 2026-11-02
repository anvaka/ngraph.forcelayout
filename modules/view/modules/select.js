// select: a set of selected nodes, flagged SELECTED. The view lights their links, marks their
// neighbours and dims the rest.
//
//   const selection = view.use(selectNodes);
//   view.on('select', e => console.log(e.nodes.map(node => node.id)));
//   selection.set(['a', 'b']);
//
// A tap on a node selects it; Shift adds it, Cmd or Ctrl toggles it. A tap on the background, or
// Escape, clears the selection. Shift-drag on the background (mouse or pen) draws a box that adds
// the nodes whose disc touches it.
//
// 'select' fires before a change is kept: {nodes, added, removed}; e.preventDefault() keeps the
// old selection. A box shows what it would select while it is drawn, and fires once at the end.
//
// Options:
// - `box` (true): Shift-drag draws a selection box.
// - `boxStyle`: CSS for the box element.
import {SELECTED} from '../flags.js';

const BOX_STYLE = 'position:fixed;pointer-events:none;z-index:2147483647;box-sizing:border-box;' +
  'border:1px solid rgba(255,255,255,0.85);background:rgba(255,255,255,0.08);';

export default {
  name: 'select',
  attach(ctx, options = {}) {
    let selected = new Set();
    let box = null;

    ctx.input.add({
      name: 'select',
      priority: 30,
      cursor: 'crosshair',
      press: p => options.box !== false && p.button === 0 && p.shiftKey && p.pointerType !== 'touch',
      dragstart(p) {
        box = {
          pointerId: p.id, base: new Set(selected),
          x0: p.downX, y0: p.downY, x1: p.x, y1: p.y,
          clientX0: p.downClientX, clientY0: p.downClientY, clientX1: p.clientX, clientY1: p.clientY,
          element: createBoxElement(), frame: 0, inside: []
        };
      },
      drag(p) {
        if (!box || box.pointerId !== p.id) return;
        box.x1 = p.x; box.y1 = p.y;
        box.clientX1 = p.clientX; box.clientY1 = p.clientY;
        placeBox();
        if (!box.frame) box.frame = requestAnimationFrame(previewBox);
      },
      dragend(p) {
        if (!box || box.pointerId !== p.id) return;
        let base = box.base;
        let inside = ctx.nodesInRect(box.x0, box.y0, box.x1, box.y1);
        closeBox();
        let next = new Set(base);
        inside.forEach(node => next.add(node.id));
        if (!change(next, p)) show(base);
      },
      cancel(p) {
        if (!box || box.pointerId !== p.id) return;
        let base = box.base;
        closeBox();
        show(base);
      },
      tap(e) {
        if (e.button !== 0) return false;
        let toggle = e.metaKey || e.ctrlKey;
        if (!e.node) {
          if (!e.shiftKey && !toggle && selected.size) change(new Set(), e);
          return false;
        }
        let id = e.node.id;
        let next;
        if (toggle) {
          next = new Set(selected);
          if (next.has(id)) next.delete(id); else next.add(id);
        } else if (e.shiftKey) {
          next = new Set(selected).add(id);
        } else {
          next = new Set([id]);
        }
        change(next, e);
        return false;
      },
      key(e) {
        if (e.key !== 'Escape') return false;
        if (box) {
          ctx.input.cancel(box.pointerId);
          return true;
        }
        if (!selected.size) return false;
        change(new Set(), e);
        return true;
      }
    });
    ctx.graph.on('changed', onGraphChanged);

    return {
      /** The selected nodes */
      get() {
        let nodes = [];
        selected.forEach(id => {
          let node = ctx.graph.getNode(id);
          if (node) nodes.push(node);
        });
        return nodes;
      },
      /** Selects these nodes (or ids); fires 'select' */
      set(nodesOrIds) {
        return change(new Set(Array.from(nodesOrIds || [], idOf)), null);
      },
      clear() {
        return change(new Set(), null);
      },
      has(nodeOrId) {
        return selected.has(idOf(nodeOrId));
      },
      dispose() {
        if (box) ctx.input.cancel(box.pointerId);
        ctx.graph.off('changed', onGraphChanged);
        show(new Set());
        selected.clear();
      }
    };

    // Keeps `next` as the selection unless a 'select' listener prevents it; true if kept
    function change(next, cause) {
      next.forEach(id => { if (!ctx.graph.getNode(id)) next.delete(id); });
      let added = [], removed = [];
      next.forEach(id => { if (!selected.has(id)) added.push(id); });
      selected.forEach(id => { if (!next.has(id)) removed.push(id); });
      if (!added.length && !removed.length) {
        show(next);
        return true;
      }
      let e = ctx.emit('select', {
        nodes: nodesOf(next), added: nodesOf(added), removed: nodesOf(removed),
        node: cause && cause.node ? cause.node : null,
        pointerType: cause ? cause.pointerType : null,
        originalEvent: cause ? (cause.originalEvent || cause.event || cause) : null
      });
      if (e.defaultPrevented) {
        show(selected);
        return false;
      }
      selected = next;
      show(selected);
      return true;
    }

    // Flags exactly the nodes of `ids` as selected
    function show(ids) {
      ctx.flags.ids(SELECTED).forEach(id => { if (!ids.has(id)) ctx.flags.set(id, SELECTED, false); });
      ids.forEach(id => ctx.flags.set(id, SELECTED, true));
    }

    function previewBox() {
      if (!box) return;
      box.frame = 0;
      let preview = new Set(box.base);
      ctx.nodesInRect(box.x0, box.y0, box.x1, box.y1).forEach(node => preview.add(node.id));
      show(preview);
    }

    function createBoxElement() {
      if (typeof document === 'undefined') return null;
      let element = document.createElement('div');
      element.style.cssText = BOX_STYLE + (options.boxStyle || '');
      document.body.appendChild(element);
      return element;
    }

    function placeBox() {
      if (!box.element) return;
      let left = Math.min(box.clientX0, box.clientX1), top = Math.min(box.clientY0, box.clientY1);
      let style = box.element.style;
      style.left = left + 'px';
      style.top = top + 'px';
      style.width = Math.abs(box.clientX1 - box.clientX0) + 'px';
      style.height = Math.abs(box.clientY1 - box.clientY0) + 'px';
    }

    function closeBox() {
      if (box.frame) cancelAnimationFrame(box.frame);
      if (box.element && box.element.parentNode) box.element.parentNode.removeChild(box.element);
      box = null;
    }

    function onGraphChanged(changes) {
      changes.forEach(c => {
        if (c.changeType === 'remove' && c.node) selected.delete(c.node.id);
      });
    }

    function nodesOf(ids) {
      let nodes = [];
      ids.forEach(id => {
        let node = ctx.graph.getNode(id);
        if (node) nodes.push(node);
      });
      return nodes;
    }
  }
};

function idOf(nodeOrId) {
  return nodeOrId && typeof nodeOrId === 'object' && 'id' in nodeOrId ? nodeOrId.id : nodeOrId;
}
