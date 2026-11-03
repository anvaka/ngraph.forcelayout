// inspect: a tooltip with what is known about a node: its label, id, number of links and data.
//
//   view.use(hoverNodes);      // tooltips while a mouse or pen hovers a node
//   view.use(inspectNodes);    // a tap (mouse, pen or finger) keeps one open
//   view.use(inspectNodes, {content: node => node.data.title});
//
// Hovering a node shows its tooltip while the pointer stays on the node or on the tooltip (so its
// text can be read and selected). Keyboard focus (the navigate module) shows it too, while the
// node has focus. A tap on a node, or Enter on a focused one, keeps the tooltip open until a tap
// elsewhere or Escape; that is how touch shows it. The tooltip follows its node as the layout and the camera
// move, beside the node rather than over it, inside the canvas.
//
// Where it goes: beside the node, on the side that covers the fewest of the node's neighbours
// (what a selection lights up), never under what covers the canvas; when every side covers some,
// docked at the bottom of what shows. On a phone-sized canvas it always docks at the bottom, in a
// card at most 150 px tall that scrolls.
//
// Options:
// - `content(node)`: what to show, as text (a string) or an element; null shows nothing. The
//   default is `describeNode()`: the label (and the id when it differs), the number of links,
//   and the fields of `node.data`.
//   Strings are always text, never HTML.
// - `hover` (true): show tooltips on hover (needs the hover module). `tap` (true): keep one open
//   on tap.
// - `style`: CSS added to the tooltip's own. `className`: a class for it.
//
// API: show(node), hide(), get() (the node shown, or null).
import {overlayBoxes} from '../visible.js';

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
// The sides of a node a tooltip may take, in the order they are tried
const SIDES = ['below-right', 'above-right', 'below-left', 'above-left'];
// A neighbour this close to the card counts as covered (its disc and the start of its label)
const COVER_MARGIN = 10;
// The side the card has wins ties: it moves only to a side that covers fewer neighbours
const KEEP = 0.5;
// Pixels between a docked tooltip and what covers the canvas or its edges
const DOCK_MARGIN = 12;
// Neighbours looked at, at most (a hub's thousands don't need to be)
const NEIGHBOURS = 500;
// A canvas narrower than this (a phone) has no room beside a node: the card docks at the bottom,
// in the band a width-bound drawing leaves free, at most DOCK_HEIGHT tall (it scrolls) and
// narrow enough to leave room for buttons in a corner
const NARROW = 560, DOCK_HEIGHT = 150, DOCK_ROOM = 150;
// Smaller caps a card takes when it fits nowhere at its own size; it scrolls (and fades at its
// edge) instead. On a narrow canvas only the heights apply.
const COMPACT = [{width: 220, height: 110}, {width: 160, height: 72}];

function boxBeside(side, at, width, height) {
  let right = side.endsWith('right'), below = side.startsWith('below');
  return {
    x: right ? at.x + OFFSET : at.x - OFFSET - width,
    y: below ? at.y + OFFSET : at.y - OFFSET - height,
    width, height
  };
}

// How many points are on the box, or near it
function covers(box, points) {
  let count = 0;
  for (let i = 0; i < points.length; ++i) {
    if (inside(points[i], box, box.width, box.height, COVER_MARGIN)) count += 1;
  }
  return count;
}

function inside(point, box, width, height, margin) {
  return point.x >= box.x - margin && point.x <= box.x + width + margin &&
    point.y >= box.y - margin && point.y <= box.y + height + margin;
}

export default {
  name: 'inspect',
  attach(ctx, options = {}) {
    let content = options.content || (node => describeNode(node, ctx.graph, ctx.labelOf ? ctx.labelOf(node) : undefined));
    let card = null;
    let natural = null;
    // What is shown: {node, pinned, source} (source: 'hover', 'focus' or 'tap')
    let shown = null;
    let overCard = false;
    let hoverNode = null;
    let lingering = 0;

    if (options.hover !== false) ctx.on('hover', onHover);
    ctx.on('focus', e => {
      if (shown && shown.pinned) return;
      if (e.node) show(e.node, false, 'focus');
      else if (shown && shown.source === 'focus') hide();
    });
    ctx.input.add({
      name: 'inspect',
      priority: 25,
      tap(e) {
        if (options.tap === false || e.button !== 0) return false;
        if (e.node) show(e.node, true, 'tap');
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
    // More room may show (a panel closed): a card that shrank tries its own size again
    if (ctx.onVisibleAreaChange) {
      ctx.onVisibleAreaChange(() => {
        if (!shown) return;
        shown.size = 0;
        ctx.requestFrame();
      });
    }
    ctx.graph.on('changed', onGraphChanged);

    return {
      show: node => show(node, true, 'api'),
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
        show(e.node, false, 'hover');
      } else if (shown && shown.source === 'hover') {
        lingering = setTimeout(() => {
          if (!overCard && !hoverNode && shown && shown.source === 'hover') hide();
        }, LINGER);
      }
    }

    function show(node, pinned, source) {
      if (!node) return hide();
      let body = content(node);
      if (body === null || body === undefined) return hide();
      ensureCard();
      if (!shown || shown.node !== node) fill(body);
      let same = shown && shown.node === node;
      shown = {node, pinned, source, side: same ? shown.side : null, narrow: same ? shown.narrow : null, size: same ? shown.size : 0};
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

    // Beside the node, on the side that covers the fewest of its neighbours (what a selection
    // lights up), inside what shows of the canvas (not under a panel). When every side covers
    // some (a hub, a small screen), along the bottom of what shows. The side it had is kept
    // unless another one is clearly better, so the card doesn't hop as the layout jiggles. When
    // the card fits nowhere at its size (a short screen, a panel open), it tries smaller ones and
    // scrolls, rather than covering its node, a panel or the canvas buttons.
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
      let narrow = rect.width < NARROW;
      if (narrow !== shown.narrow) {
        shown.narrow = narrow;
        shown.size = 0;
      }
      let area = ctx.visibleArea ? ctx.visibleArea() : null;
      if (area && (area.allHidden || area.width !== rect.width || area.height !== rect.height)) area = null;
      let points = neighbourPoints(shown.node);
      // The view's other overlays (a search box, the keys card) stay uncovered too
      let others = overlayBoxes(rect, card);
      let sizes = cardSizes(rect, narrow);
      let best = null;
      // A card that had to shrink stays small until what shows changes (see onVisibleAreaChange)
      for (let i = Math.min(shown.size || 0, sizes.length - 1); i < sizes.length && !best; ++i) {
        setSize(sizes[i]);
        best = bestBox(at, rect, area, points, others, narrow);
        shown.size = i;
      }
      if (!best && others.length) {
        // No room beside another overlay (the keys card on a short phone): the one opened later
        // wins, and this card is back when it closes
        card.style.display = 'none';
        return;
      }
      if (!best) {
        // Nowhere good: beside the node, inside the canvas, at the smallest size
        let width = card.offsetWidth, height = card.offsetHeight;
        let x = at.x + OFFSET, y = at.y + OFFSET;
        if (x + width > rect.width) x = at.x - OFFSET - width;
        if (y + height > rect.height) y = at.y - OFFSET - height;
        best = {side: null, box: {x: Math.max(0, x), y: Math.max(0, y)}};
      }
      fadeIfMore();
      shown.side = best.side;
      card.style.left = (rect.left + best.box.x) + 'px';
      card.style.top = (rect.top + best.box.y) + 'px';
    }

    // The sizes to try, largest first: {width, height} caps in pixels (0: none)
    function cardSizes(rect, narrow) {
      if (!narrow) return [{width: 0, height: 0}].concat(COMPACT);
      let width = Math.max(160, Math.min(280, rect.width - DOCK_ROOM));
      return [DOCK_HEIGHT].concat(COMPACT.map(size => size.height)).map(height => ({width, height}));
    }

    function setSize(size) {
      let maxWidth = size.width ? size.width + 'px' : natural.maxWidth;
      let maxHeight = size.height ? size.height + 'px' : natural.maxHeight;
      if (card.style.maxWidth !== maxWidth) card.style.maxWidth = maxWidth;
      if (card.style.maxHeight !== maxHeight) {
        card.style.maxHeight = maxHeight;
        card.style.overflowY = maxHeight ? 'auto' : '';
      }
    }

    // Where the card goes at its current size: {side, box, cost}, or null when it fits nowhere
    // clear of its node, what covers the canvas and the other overlays
    function bestBox(at, rect, area, points, others, narrow) {
      let width = card.offsetWidth, height = card.offsetHeight;
      let clear = box => !others.some(b => box.x < b.x + b.width && box.x + width > b.x && box.y < b.y + b.height && box.y + height > b.y);
      let best = null;
      (narrow ? [] : SIDES).forEach(side => {
        let box = boxBeside(side, at, width, height);
        if (box.x < 0 || box.y < 0 || box.x + width > rect.width || box.y + height > rect.height) return;
        if (area && area.boxCovered(box.x, box.y, width, height)) return;
        if (!clear(box)) return;
        let cost = covers(box, points) + (side === shown.side ? -KEEP : 0);
        if (!best || cost < best.cost) best = {side, box, cost};
      });
      if (!best || best.cost > 0) {
        // Docked at the bottom of what shows, away from the node: the spot search steps around it
        let node = {x: at.x - OFFSET, y: at.y - OFFSET, width: 2 * OFFSET, height: 2 * OFFSET};
        let spot = area ? area.spot(width, height, DOCK_MARGIN, 'bottom', others.concat([node]))
          : {x: DOCK_MARGIN, y: rect.height - height - DOCK_MARGIN};
        if (spot && spot.y >= 0 && !inside(at, spot, width, height, OFFSET) && clear(spot)) {
          let box = {x: spot.x, y: spot.y, width, height};
          let cost = covers(box, points) + (shown.side === 'dock' ? -KEEP : 0);
          if (!best || cost < best.cost) best = {side: 'dock', box, cost};
        }
      }
      return best;
    }

    // A docked card that scrolls fades out at its bottom edge while there is more below, so the
    // last visible line doesn't look cut
    function fadeIfMore() {
      if (!card) return;
      let more = card.scrollHeight - card.clientHeight - card.scrollTop > 1;
      let mask = more ? 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)' : '';
      if (card.style.webkitMaskImage !== mask) {
        card.style.webkitMaskImage = mask;
        card.style.maskImage = mask;
      }
    }

    // The card sits over the canvas: the wheel over it zooms the drawing, as it would without the
    // card, unless the card scrolls (a docked one with more to show). A pinch (Ctrl + wheel)
    // always zooms the drawing, never the page.
    function onCardWheel(e) {
      // Firefox turns line deltas into pixels only if the deltas are read first: read the mode first
      let deltaMode = e.deltaMode;
      if (!e.ctrlKey && !e.metaKey && card.scrollHeight - card.clientHeight > 1) return;
      e.preventDefault();
      let canvas = ctx.scene.getDrawContext().canvas;
      canvas.dispatchEvent(new WheelEvent('wheel', {
        deltaMode, deltaX: e.deltaX, deltaY: e.deltaY, deltaZ: e.deltaZ,
        clientX: e.clientX, clientY: e.clientY, screenX: e.screenX, screenY: e.screenY,
        ctrlKey: e.ctrlKey, shiftKey: e.shiftKey, altKey: e.altKey, metaKey: e.metaKey,
        bubbles: true, cancelable: true
      }));
    }

    // Where the shown node's neighbours are on the canvas (at most NEIGHBOURS of them)
    function neighbourPoints(node) {
      let points = [];
      let layout = ctx.layout;
      ctx.graph.forEachLinkedNode(node.id, other => {
        if (points.length >= NEIGHBOURS || other.id === node.id || !layout.getBody(other.id)) return;
        let p = layout.getNodePosition(other.id);
        let s = ctx.toScreen(p.x, p.y || 0, p.z || 0);
        if (s) points.push(s);
      });
      return points;
    }

    function ensureCard() {
      if (card) return;
      card = document.createElement('div');
      card.setAttribute('role', 'tooltip');
      // It moves with the node it describes: it doesn't hide the canvas (see visible.js)
      card.setAttribute('data-graph-overlay', '');
      card.style.cssText = STYLE + (options.style || '');
      // Its own size caps (STYLE's, or the `style` option's): what a card that shrank goes back to
      natural = {maxWidth: card.style.maxWidth, maxHeight: card.style.maxHeight};
      if (options.className) card.className = options.className;
      card.addEventListener('scroll', fadeIfMore, {passive: true});
      card.addEventListener('wheel', onCardWheel, {passive: false});
      // The pointer can move onto the tooltip without it closing
      card.addEventListener('pointerenter', () => { overCard = true; clearTimeout(lingering); });
      card.addEventListener('pointerleave', () => {
        overCard = false;
        if (shown && shown.source === 'hover' && !hoverNode) hide();
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
 * What the default tooltip shows: {title, rows}, with rows of [name, value] text: the id when the
 * title (`label`, default the id) is something else, the number of links, then the fields of
 * `node.data` (or `data` itself when it isn't an object).
 */
export function describeNode(node, graph, label) {
  let rows = [];
  let title = label === undefined || label === null ? String(node.id) : String(label);
  if (title !== String(node.id)) rows.push(['id', String(node.id)]);
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
  return {title, rows};
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
