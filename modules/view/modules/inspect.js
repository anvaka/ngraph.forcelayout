// inspect: a tooltip with what is known about a node: its id, its number of links and its data.
//
//   view.use(hoverNodes);      // tooltips while a mouse or pen hovers a node
//   view.use(inspectNodes);    // a tap (mouse, pen or finger) keeps one open
//   view.use(inspectNodes, {content: node => node.data.title});
//
// Hovering a node shows its tooltip while the pointer stays on the node or on the tooltip (so its
// text can be read and selected). A tap on a node keeps the tooltip open until a tap elsewhere or
// Escape; that is how touch shows it. The tooltip follows its node as the layout and the camera
// move, beside the node rather than over it, inside the canvas.
//
// Options:
// - `content(node)`: what to show, as text (a string) or an element; null shows nothing. The
//   default is `describeNode()`: the id, the number of links, and the fields of `node.data`.
//   Strings are always text, never HTML.
// - `hover` (true): show tooltips on hover (needs the hover module). `tap` (true): keep one open
//   on tap.
// - `style`: CSS added to the tooltip's own. `className`: a class for it.
//
// API: show(node), hide(), get() (the node shown, or null).

const STYLE = 'position:fixed;z-index:2147483646;max-width:280px;padding:6px 8px;border-radius:4px;' +
  'background:rgba(9,22,44,0.94);color:#e8f1ff;border:1px solid rgba(255,255,255,0.18);' +
  'font:12px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 2px 10px rgba(0,0,0,0.45);' +
  'pointer-events:auto;user-select:text;-webkit-user-select:text;overflow-wrap:anywhere;display:none;';
// Pixels between a node and its tooltip
const OFFSET = 14;
// After the pointer leaves a node, how long the tooltip waits for it to reach the tooltip
const LINGER = 200;
const MAX_FIELDS = 12;
const MAX_VALUE = 120;

export default {
  name: 'inspect',
  attach(ctx, options = {}) {
    let content = options.content || (node => describeNode(node, ctx.graph));
    let card = null;
    // What is shown: {node, pinned}
    let shown = null;
    let overCard = false;
    let hoverNode = null;
    let lingering = 0;

    if (options.hover !== false) ctx.on('hover', onHover);
    ctx.input.add({
      name: 'inspect',
      priority: 25,
      tap(e) {
        if (options.tap === false || e.button !== 0) return false;
        if (e.node) show(e.node, true);
        else if (shown) hide();
        return false;
      },
      key(e) {
        if (e.key !== 'Escape' || !shown) return false;
        hide();
        return true;
      }
    });
    // Nodes move under their tooltips: follow them every frame
    ctx.onFrame(() => { if (shown) place(); });
    ctx.graph.on('changed', onGraphChanged);

    return {
      show: node => show(node, true),
      hide,
      get: () => shown ? shown.node : null,
      dispose() {
        clearTimeout(lingering);
        ctx.graph.off('changed', onGraphChanged);
        if (card && card.parentNode) card.parentNode.removeChild(card);
        card = null;
        shown = null;
      }
    };

    function onHover(e) {
      hoverNode = e.node;
      if (shown && shown.pinned) return;
      clearTimeout(lingering);
      if (e.node) {
        show(e.node, false);
      } else if (shown) {
        lingering = setTimeout(() => {
          if (!overCard && !hoverNode && shown && !shown.pinned) hide();
        }, LINGER);
      }
    }

    function show(node, pinned) {
      if (!node) return hide();
      let body = content(node);
      if (body === null || body === undefined) return hide();
      ensureCard();
      if (!shown || shown.node !== node) fill(body);
      shown = {node, pinned};
      place();
    }

    function hide() {
      clearTimeout(lingering);
      shown = null;
      if (card) card.style.display = 'none';
    }

    function fill(body) {
      card.textContent = '';
      if (typeof body === 'string') {
        card.textContent = body;
        return;
      }
      if (body && body.nodeType) {
        card.appendChild(body);
        return;
      }
      // {title, rows: [[name, value], ...]} from describeNode()
      let title = document.createElement('div');
      title.style.cssText = 'font-weight:600;margin-bottom:2px;';
      title.textContent = body.title;
      card.appendChild(title);
      if (!body.rows.length) return;
      let table = document.createElement('div');
      table.style.cssText = 'display:grid;grid-template-columns:auto 1fr;column-gap:8px;';
      body.rows.forEach(([name, value]) => {
        let key = document.createElement('div');
        key.style.cssText = 'opacity:0.65;white-space:nowrap;';
        key.textContent = name;
        let text = document.createElement('div');
        text.textContent = value;
        table.appendChild(key);
        table.appendChild(text);
      });
      card.appendChild(table);
    }

    // Beside the node, flipped to stay inside the canvas
    function place() {
      let layout = ctx.layout;
      if (!layout || !layout.getBody(shown.node.id)) return hide();
      let pos = layout.getNodePosition(shown.node.id);
      let at = ctx.toScreen(pos.x, pos.y || 0, pos.z || 0);
      if (!at) {
        card.style.display = 'none';
        return;
      }
      let rect = ctx.scene.getDrawContext().canvas.getBoundingClientRect();
      if (at.x < 0 || at.y < 0 || at.x > rect.width || at.y > rect.height) {
        // The node is out of view
        card.style.display = 'none';
        return;
      }
      card.style.display = 'block';
      let width = card.offsetWidth, height = card.offsetHeight;
      let x = rect.left + at.x + OFFSET, y = rect.top + at.y + OFFSET;
      if (x + width > rect.right) x = rect.left + at.x - OFFSET - width;
      if (y + height > rect.bottom) y = rect.top + at.y - OFFSET - height;
      card.style.left = Math.max(rect.left, x) + 'px';
      card.style.top = Math.max(rect.top, y) + 'px';
    }

    function ensureCard() {
      if (card) return;
      card = document.createElement('div');
      card.setAttribute('role', 'tooltip');
      card.style.cssText = STYLE + (options.style || '');
      if (options.className) card.className = options.className;
      // The pointer can move onto the tooltip without it closing
      card.addEventListener('pointerenter', () => { overCard = true; clearTimeout(lingering); });
      card.addEventListener('pointerleave', () => {
        overCard = false;
        if (shown && !shown.pinned && !hoverNode) hide();
      });
      document.body.appendChild(card);
    }

    function onGraphChanged(changes) {
      if (!shown) return;
      changes.forEach(change => {
        if (change.changeType === 'remove' && change.node && shown && change.node.id === shown.node.id) hide();
      });
    }
  }
};

/**
 * What the default tooltip shows: {title, rows}, with rows of [name, value] text: the number of
 * links, then the fields of `node.data` (or `data` itself when it isn't an object).
 */
export function describeNode(node, graph) {
  let rows = [];
  let links = 0;
  if (graph && graph.forEachLinkedNode) graph.forEachLinkedNode(node.id, () => { links += 1; });
  rows.push(['links', String(links)]);
  let data = node.data;
  if (data !== undefined && data !== null) {
    if (typeof data === 'object' && !Array.isArray(data)) {
      let names = Object.keys(data);
      names.slice(0, MAX_FIELDS).forEach(name => rows.push([name, valueText(data[name])]));
      if (names.length > MAX_FIELDS) rows.push(['…', `${names.length - MAX_FIELDS} more`]);
    } else {
      rows.push(['data', valueText(data)]);
    }
  }
  return {title: String(node.id), rows};
}

function valueText(value) {
  let text;
  if (typeof value === 'number') text = Number.isInteger(value) ? String(value) : String(+value.toPrecision(6));
  else if (typeof value === 'string') text = value;
  else {
    try { text = JSON.stringify(value); } catch (_) { text = String(value); }
    if (text === undefined) text = String(value);
  }
  return text.length > MAX_VALUE ? text.slice(0, MAX_VALUE - 1) + '…' : text;
}
