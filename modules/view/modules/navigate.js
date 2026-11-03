// navigate: keyboard and screen-reader access to the nodes.
//
//   view.use(navigateNodes);
//
// The canvas is one tab stop. On it:
//   Enter        focuses the node nearest the middle of what shows (or the selected one); on a
//                focused node it is a tap: it selects (Shift adds, Cmd/Ctrl toggles) and keeps
//                its tooltip open, exactly as a click or a tap would
//   arrows       move focus to the nearest node in that direction (with no node focused, the
//                arrows move the camera, as before)
//   ] and [      walk the neighbours of the node you started from, strongest link first
//   Space        walks into the focused node: its neighbours are next; Backspace goes back
//   Shift+arrows move the focused node (Alt for small steps); releasing Shift drops it, like the
//                end of a drag: the keyboard way to do what dragging does
//   Escape       one layer at a time: a move in progress, then (after the tooltip and the
//                selection) the focus
//   ?            lists these keys
// Tab always leaves the canvas.
//
// A polite live region says where focus went: the node's label, its links, whether it is
// selected or pinned, and its place among the neighbours being walked. The camera follows focus.
// The FOCUSED flag shows only while the canvas has keyboard focus, and the keys above act only
// while it shows. Clicking a node moves the keyboard's place there without a focus ring: the
// arrows still move the camera, and Enter shows the focus on the clicked node.
//
// Events: 'focus' ({node, previous, reason}); a move fires 'dragstart', 'drag' and 'dragend'
// with pointerType 'keyboard'. Other modules reach it as ctx.get('focus').
//
// Options:
// - `pinOnDrop` (false): leave a node moved with the keys pinned.
// - `help` (true): ? shows a card with the keys.
// - `announce` (true): speak through a live region.
//
// API: focus(node), get(), clear(), announce(text).
import {FOCUSED, SELECTED, DRAGGED} from '../flags.js';
import {placeOverCanvas} from '../visible.js';

const DIRECTIONS = {
  ArrowRight: {x: 1, y: 0, name: 'to the right'},
  ArrowLeft: {x: -1, y: 0, name: 'to the left'},
  ArrowUp: {x: 0, y: -1, name: 'above'},
  ArrowDown: {x: 0, y: 1, name: 'below'}
};
// Pixels a node moves per key press (Alt: fine steps)
const STEP = 10, FINE_STEP = 1;

// Pointer gestures: the same for a mouse, a pen and a finger (only the reach differs)
const GESTURES = [
  ['Drag', 'a node moves it; the background pans'],
  ['Pinch or wheel', 'zoom'],
  ['Double tap', 'zoom in; a two-finger tap zooms out'],
  ['Tap a node', 'its details and neighbours; tap the background to clear'],
  ['Long press', 'on a node: grab it where nodes crowd; on the background: drag a box to select'],
  ['Twist, or right drag', 'rotate (3D)']
];

const HELP = [
  ['Enter', 'focus a node; on a focused node, select it (Shift adds, Cmd/Ctrl toggles)'],
  ['Arrows', 'nearest node in that direction'],
  ['] and [', 'next and previous neighbour'],
  ['Space', 'walk into the focused node’s neighbours'],
  ['Backspace', 'back to where the walk came from'],
  ['Shift+arrows', 'move the node (Alt: small steps); release Shift to drop it'],
  ['/', 'search'],
  ['Escape', 'close, clear, then leave the nodes'],
  ['WASD, + and −', 'move and zoom the camera']
];

const CARD_STYLE = 'position:fixed;z-index:2147483646;max-width:360px;padding:8px 10px;border-radius:4px;' +
  'background:rgba(9,22,44,0.96);color:#e8f1ff;border:1px solid rgba(255,255,255,0.18);' +
  'font:12px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:0 2px 10px rgba(0,0,0,0.45);';
const HIDDEN_STYLE = 'position:absolute;width:1px;height:1px;margin:-1px;padding:0;border:0;' +
  'overflow:hidden;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap;';

export default {
  name: 'navigate',
  attach(ctx, options = {}) {
    let canvas = ctx.scene.getDrawContext().canvas;
    let graph = ctx.graph;
    // The keyboard's place, and whether its FOCUSED flag shows
    let current = null;
    let showing = false;
    // Neighbours being walked: {anchor, list: [{node, link, weight}], index}
    let walk = null;
    let back = [];
    // A move with Shift+arrows: {node, body, start, wasPinned, layout}
    let nudge = null;
    let live = options.announce === false ? null : createLiveRegion();
    let help = null;
    let savedAria = saveAttributes(canvas, ['role', 'aria-roledescription', 'aria-label']);

    canvas.setAttribute('role', 'application');
    canvas.setAttribute('aria-roledescription', 'graph');
    describeCanvas();
    canvas.addEventListener('focus', onCanvasFocus);
    canvas.addEventListener('blur', onCanvasBlur);
    graph.on('changed', onGraphChanged);
    // A click or tap on a node moves the keyboard's place there (no focus ring until a key)
    ctx.on('tap', e => {
      if (e.pointerType !== 'keyboard' && e.node) place(e.node);
    });

    // Escape first ends what is in progress here (a move, the keys card), before the tooltip or the
    // selection; like a pointer drag, which also comes first
    ctx.input.add({
      name: 'navigate-escape',
      priority: 15,
      key(e) {
        if (e.key !== 'Escape') return false;
        if (nudge) {
          finishNudge(true);
          return true;
        }
        if (help) {
          closeHelp();
          return true;
        }
        return false;
      }
    });
    ctx.input.add({
      name: 'navigate',
      priority: 40,
      key,
      keyup(e) {
        if (e.key === 'Shift' && nudge) finishNudge(false);
      },
      blur() {
        if (nudge) finishNudge(false);
      }
    });

    let api = {
      focus: node => focus(node, 'api'),
      get: () => current,
      clear,
      announce: say,
      /** Shows or hides the help card (keys and gestures); with no argument it toggles */
      help(show) {
        if (show === undefined ? !help : show) {
          if (!help) toggleHelp();
        } else {
          closeHelp();
        }
        return !!help;
      }
    };
    ctx.provide('focus', {get: () => current, set: (node, reason) => focus(node, reason || 'api'), clear});
    ctx.provide('announce', say);

    return Object.assign(api, {
      dispose() {
        if (nudge) finishNudge(true);
        hideFlag();
        closeHelp();
        canvas.removeEventListener('focus', onCanvasFocus);
        canvas.removeEventListener('blur', onCanvasBlur);
        graph.off('changed', onGraphChanged);
        restoreAttributes(canvas, savedAria);
        if (live && live.parentNode) live.parentNode.removeChild(live);
        live = null;
        current = null;
      }
    });

    function key(e) {
      if (e.ctrlKey && e.key !== 'Enter' || e.metaKey && e.key !== 'Enter') return false;
      if (e.key === '?') {
        if (options.help === false) return false;
        toggleHelp();
        return true;
      }
      if (e.key === 'Enter') {
        if (!current || !showing) {
          let entry = current || entryNode();
          if (!entry) {
            say('This graph has no nodes.');
            return true;
          }
          focus(entry, current ? 'return' : 'enter');
        } else {
          select(e);
        }
        return true;
      }
      if (e.key === 'Escape') {
        if (!current || !showing) return false;
        clear();
        say('Left the nodes. The arrow keys move the camera.');
        return true;
      }
      // The rest acts on a focused node, and only while its focus ring shows: after a click the
      // arrows still move the camera, and Enter shows the focus on the clicked node
      if (!current || !showing) return false;
      let direction = DIRECTIONS[e.key];
      if (direction) {
        if (e.shiftKey) nudgeBy(direction, e.altKey ? FINE_STEP : STEP);
        else moveToward(direction);
        return true;
      }
      if (e.key === ']' || e.key === '[') {
        stepNeighbour(e.key === ']' ? 1 : -1);
        return true;
      }
      if (e.key === ' ' || e.code === 'Space') {
        walkInto();
        return true;
      }
      if (e.key === 'Backspace') {
        walkBack();
        return true;
      }
      return false;
    }

    function focus(node, reason) {
      if (!node || !graph.getNode(node.id)) return;
      let previous = current;
      if (nudge && nudge.node !== node) finishNudge(false);
      hideFlag();
      current = node;
      if (reason !== 'neighbour' && reason !== 'back') {
        walk = null;
        if (reason !== 'walk') back = [];
      }
      showFlag();
      ctx.reveal(node);
      ctx.emit('focus', {node, previous, reason, id: node.id});
      say(describe(node));
    }

    // The keyboard's place without the focus ring (after a click)
    function place(node) {
      if (current === node) return;
      hideFlag();
      current = node;
      walk = null;
      back = [];
    }

    function clear() {
      if (nudge) finishNudge(true);
      let previous = current;
      hideFlag();
      current = null;
      walk = null;
      back = [];
      if (previous) ctx.emit('focus', {node: null, previous, reason: 'clear'});
    }

    function showFlag() {
      if (!current || showing) return;
      ctx.flags.set(current.id, FOCUSED, true);
      showing = true;
    }

    function hideFlag() {
      if (current && showing) ctx.flags.set(current.id, FOCUSED, false);
      showing = false;
    }

    // Where Enter starts: the selected node, else the hovered one, else the one nearest the middle
    // of what the user sees (a panel may cover part of the canvas)
    function entryNode() {
      let selected = ctx.flags.ids(SELECTED);
      if (selected.length === 1 && graph.getNode(selected[0])) return graph.getNode(selected[0]);
      let screen = ctx.screenPositions();
      let best = -1, bestDistance = Infinity;
      let cx = screen.width / 2, cy = screen.height / 2;
      let area = ctx.visibleArea();
      let middle = area && area.anyHidden ? area.center() : null;
      if (middle) {
        cx = middle.x;
        cy = middle.y;
      } else {
        area = null;
      }
      for (let i = 0; i < screen.x.length; ++i) {
        if (!screen.onScreen[i] || (area && area.isHidden(screen.x[i], screen.y[i]))) continue;
        let d = (screen.x[i] - cx) * (screen.x[i] - cx) + (screen.y[i] - cy) * (screen.y[i] - cy);
        if (d < bestDistance) { bestDistance = d; best = i; }
      }
      if (best >= 0) return screen.nodes[best];
      // Nothing in view: the node with the most links
      let hub = null, most = -1;
      graph.forEachNode(node => {
        let links = degreeOf(graph, node);
        if (links > most) { most = links; hub = node; }
      });
      return hub;
    }

    function moveToward(direction) {
      let screen = ctx.screenPositions();
      let body = ctx.layout.getBody(current.id);
      let row = body ? body.index : -1;
      let next = row >= 0 ? nearestInDirection(screen, row, direction) : -1;
      if (next < 0) {
        say(`No node ${direction.name}.`);
        return;
      }
      focus(screen.nodes[next], 'arrow');
    }

    function stepNeighbour(by) {
      if (!walk) walk = {anchor: current, list: neighboursOf(graph, current, ctx.labelOf), index: -1};
      if (!walk.list.length) {
        say(`${ctx.labelOf(walk.anchor)} has no neighbours.`);
        return;
      }
      let n = walk.list.length;
      walk.index = walk.index < 0 ? (by > 0 ? 0 : n - 1) : (walk.index + by + n) % n;
      focus(walk.list[walk.index].node, 'neighbour');
    }

    function walkInto() {
      if (walk && current !== walk.anchor) back.push(walk.anchor);
      walk = {anchor: current, list: neighboursOf(graph, current, ctx.labelOf), index: -1};
      say(`${ctx.labelOf(current)}: ${plural(walk.list.length, 'neighbour')}.` +
        (walk.list.length ? ' Press ] for the first.' : ''));
    }

    function walkBack() {
      if (!back.length) {
        say(walk ? `Back at ${ctx.labelOf(walk.anchor)}, where the walk started.` : 'Nothing to go back to.');
        if (walk && current !== walk.anchor) focus(walk.anchor, 'back');
        return;
      }
      let anchor = back.pop();
      walk = {anchor, list: neighboursOf(graph, anchor, ctx.labelOf), index: -1};
      focus(anchor, 'back');
    }

    function select(e) {
      let node = current;
      let wasSelected = ctx.flags.has(node.id, SELECTED);
      ctx.input.tap(node, {
        shiftKey: e.shiftKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, originalEvent: e
      });
      let selected = ctx.flags.has(node.id, SELECTED);
      if (selected !== wasSelected) {
        let count = ctx.flags.count(SELECTED);
        say(`${ctx.labelOf(node)} ${selected ? 'selected' : 'deselected'}.` + (count > 1 ? ` ${count} selected.` : ''));
      }
    }

    // Shift+arrows: a drag made of key presses. Releasing Shift drops the node.
    function nudgeBy(direction, step) {
      let layout = ctx.layout;
      if (!nudge) {
        let e = ctx.emit('dragstart', {node: current, nodes: [current], id: current.id, pointerType: 'keyboard'});
        if (e.defaultPrevented) return;
        let body = layout.getBody(current.id);
        let start = new Float64Array(body.pos.array.subarray(body.pos.offset, body.pos.offset + layout.simulator.store.D));
        nudge = {node: current, body, start, layout, wasPinned: layout.isNodePinned(current), moved: false};
        layout.pinNode(current, true);
        body.velocity.reset();
        ctx.flags.set(current.id, DRAGGED, true);
      }
      let pos = nudge.body.pos, D = nudge.start.length;
      let x = pos.array[pos.offset], y = D > 1 ? pos.array[pos.offset + 1] : 0, z = D > 2 ? pos.array[pos.offset + 2] : 0;
      let at = ctx.toScreen(x, y, z);
      if (!at) return;
      let target = ctx.fromScreen(at.x + direction.x * step, at.y + direction.y * step, D > 2 ? [x, y, z] : null);
      if (!target) return;
      let args = [current.id];
      for (let k = 0; k < D; ++k) args.push(k < 3 ? target[k] : pos.array[pos.offset + k]);
      layout.setNodePosition.apply(layout, args);
      nudge.moved = true;
      ctx.view.invalidate();
      ctx.reveal(current);
      ctx.emit('drag', {node: current, nodes: [current], id: current.id, pointerType: 'keyboard'});
    }

    function finishNudge(cancelled) {
      let move = nudge;
      nudge = null;
      let {node, layout, body} = move;
      ctx.flags.set(node.id, DRAGGED, false);
      if (layout === ctx.layout && graph.getNode(node.id)) {
        if (cancelled) {
          let args = [node.id].concat(Array.from(move.start));
          layout.setNodePosition.apply(layout, args);
        }
        layout.pinNode(node, move.wasPinned || (!!options.pinOnDrop && !cancelled));
        body.velocity.reset();
        ctx.view.invalidate();
      }
      ctx.emit('dragend', {node, nodes: [node], id: node.id, cancelled, pointerType: 'keyboard'});
      if (move.moved) say(cancelled ? `Put ${ctx.labelOf(node)} back.` : `Moved ${ctx.labelOf(node)}.`);
    }

    function describe(node) {
      let parts = [ctx.labelOf(node) + '.'];
      let links = degreeOf(graph, node);
      if (walk && node !== walk.anchor && walk.index >= 0 && walk.list[walk.index].node === node) {
        let entry = walk.list[walk.index];
        parts.push(`Neighbour ${walk.index + 1} of ${walk.list.length} of ${ctx.labelOf(walk.anchor)}` +
          (entry.weight !== null ? `, link weight ${entry.weight}.` : '.'));
      }
      parts.push(plural(links, 'link') + '.');
      if (ctx.flags.has(node.id, SELECTED)) parts.push('Selected.');
      if (ctx.layout && ctx.layout.getBody(node.id) && ctx.layout.isNodePinned(node)) parts.push('Pinned.');
      return parts.join(' ');
    }

    function describeCanvas() {
      canvas.setAttribute('aria-label', `Graph with ${plural(graph.getNodesCount(), 'node')} and ${plural(graph.getLinksCount(), 'link')}`);
    }

    function onCanvasFocus() {
      let byKeyboard = false;
      try { byKeyboard = canvas.matches(':focus-visible'); } catch (_) { byKeyboard = false; }
      if (!byKeyboard) return;
      if (current) {
        showFlag();
        say(describe(current));
      } else {
        say(`Graph with ${plural(graph.getNodesCount(), 'node')} and ${plural(graph.getLinksCount(), 'link')}. ` +
          'Enter focuses a node, slash searches, question mark lists the keys.');
      }
    }

    function onCanvasBlur() {
      // The ring shows only while the canvas has focus; the place is kept for coming back
      hideFlag();
    }

    function onGraphChanged(changes) {
      describeCanvas();
      changes.forEach(change => {
        if (change.changeType !== 'remove' || !change.node) return;
        let id = change.node.id;
        if (current && current.id === id) clear();
        if (walk) {
          if (walk.anchor.id === id) walk = null;
          else walk.list = walk.list.filter(entry => entry.node.id !== id);
        }
        back = back.filter(node => node.id !== id);
      });
    }

    function say(text) {
      if (!live) return;
      // The same words twice still get read: alternate a trailing no-break space
      live.textContent = live.textContent === text ? text + ' ' : text;
    }

    function toggleHelp() {
      if (help) return closeHelp();
      help = document.createElement('div');
      help.style.cssText = CARD_STYLE;
      help.setAttribute('data-graph-overlay', '');
      help.setAttribute('role', 'dialog');
      help.setAttribute('aria-label', 'Keys and gestures');
      let keys = keyRows();
      // A finger first sees what fingers do; a keyboard first sees the keys
      let coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;
      let sections = coarse ? [['Gestures', GESTURES], ['Keys', keys]] : [['Keys', keys], ['Gestures', GESTURES]];
      sections.forEach(([name, rows], i) => {
        let title = document.createElement('div');
        title.style.cssText = 'font-weight:600;margin:' + (i ? '8px' : '0') + ' 0 4px;';
        title.textContent = name;
        help.appendChild(title);
        let table = document.createElement('div');
        table.style.cssText = 'display:grid;grid-template-columns:auto 1fr;column-gap:10px;';
        rows.forEach(([what, does]) => {
          let k = document.createElement('div');
          k.style.cssText = 'white-space:nowrap;font-weight:600;';
          k.textContent = what;
          let w = document.createElement('div');
          w.style.cssText = 'opacity:0.8;';
          w.textContent = does;
          table.appendChild(k);
          table.appendChild(w);
        });
        help.appendChild(table);
      });
      help.style.overflowY = 'auto';
      document.body.appendChild(help);
      // At the top of what shows, not under a panel, and clear of buttons along the bottom
      let area = ctx.visibleArea && ctx.visibleArea();
      let free = area && area.largestRect();
      if (free) help.style.maxHeight = Math.max(120, free.height - 24 - 56) + 'px';
      placeOverCanvas(help, canvas, area, 'top');
      say('Keys: ' + keys.map(([name, what]) => `${name}: ${what}`).join('. ') + '. Gestures: ' +
        GESTURES.map(([gesture, what]) => `${gesture}: ${what}`).join('. ') + '.');
    }

    // The keys, with those of other modules that say so (fit's key)
    function keyRows() {
      let rows = HELP.slice();
      let fit = ctx.get('fit');
      if (fit && fit.key) rows.splice(rows.length - 1, 0, [fit.key, 'fit the whole graph, and follow it']);
      return rows;
    }

    function closeHelp() {
      if (help && help.parentNode) help.parentNode.removeChild(help);
      help = null;
    }
  }
};

/**
 * The row nearest `from` in a direction ({x, y}, a unit step on the screen), among rows in front
 * of the camera, or -1. Rows within about 63° of the direction count, and one that is off to the
 * side counts as twice as far, so the arrow goes where the eye expects.
 */
export function nearestInDirection(screen, from, direction) {
  let x0 = screen.x[from], y0 = screen.y[from];
  let best = -1, bestScore = Infinity;
  for (let i = 0; i < screen.x.length; ++i) {
    if (i === from) continue;
    let dx = screen.x[i] - x0, dy = screen.y[i] - y0;
    if (dx !== dx || dy !== dy) continue; // NaN: behind the camera
    let along = dx * direction.x + dy * direction.y;
    if (along <= 0.5) continue;
    let across = Math.abs(dx * direction.y - dy * direction.x);
    if (across > 2 * along) continue;
    let score = along + 2 * across;
    if (score < bestScore) {
      bestScore = score;
      best = i;
    }
  }
  return best;
}

/**
 * A node's neighbours, each once: [{node, link, weight}], strongest link first (link data
 * `weight` or `value`, when they are numbers), then the neighbours with more links, then by label.
 */
export function neighboursOf(graph, node, labelOf) {
  let byId = new Map();
  graph.forEachLinkedNode(node.id, (other, link) => {
    if (other.id === node.id) return;
    let weight = linkWeight(link);
    let known = byId.get(other.id);
    if (!known) byId.set(other.id, {node: other, link, weight});
    else if (weight !== null && (known.weight === null || weight > known.weight)) {
      known.weight = weight;
      known.link = link;
    }
  });
  let list = Array.from(byId.values());
  let degree = new Map();
  list.forEach(entry => degree.set(entry.node.id, degreeOf(graph, entry.node)));
  list.sort((a, b) => {
    let wa = a.weight === null ? -Infinity : a.weight, wb = b.weight === null ? -Infinity : b.weight;
    if (wa !== wb) return wb - wa;
    let da = degree.get(a.node.id), db = degree.get(b.node.id);
    if (da !== db) return db - da;
    let la = labelOf ? labelOf(a.node) : String(a.node.id), lb = labelOf ? labelOf(b.node) : String(b.node.id);
    return la < lb ? -1 : la > lb ? 1 : 0;
  });
  return list;
}

function linkWeight(link) {
  let data = link && link.data;
  if (typeof data === 'number') return data;
  if (data && typeof data === 'object') {
    if (typeof data.weight === 'number') return data.weight;
    if (typeof data.value === 'number') return data.value;
  }
  return null;
}

function degreeOf(graph, node) {
  let links = 0;
  graph.forEachLinkedNode(node.id, () => { links += 1; });
  return links;
}

function plural(count, word) {
  return `${count.toLocaleString('en-US')} ${word}${count === 1 ? '' : 's'}`;
}

function createLiveRegion() {
  if (typeof document === 'undefined') return null;
  let region = document.createElement('div');
  region.setAttribute('aria-live', 'polite');
  region.setAttribute('aria-atomic', 'true');
  region.setAttribute('data-graph-announcer', '');
  region.setAttribute('data-graph-overlay', '');
  region.style.cssText = HIDDEN_STYLE;
  document.body.appendChild(region);
  return region;
}

function saveAttributes(element, names) {
  let saved = {};
  names.forEach(name => { saved[name] = element.getAttribute ? element.getAttribute(name) : null; });
  return saved;
}

function restoreAttributes(element, saved) {
  Object.keys(saved).forEach(name => {
    if (saved[name] === null) element.removeAttribute(name);
    else element.setAttribute(name, saved[name]);
  });
}
