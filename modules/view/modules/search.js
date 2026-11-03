// search: find a node by its label (or id) and go to it.
//
//   view.use(searchNodes);                  // '/' on the canvas opens a search box
//   const search = view.use(searchNodes);
//   search.open('Val');
//
// Typing lists the best matches: labels that start with the text, then labels with a word that
// starts with it, then labels that contain it, then ids; nodes with more links first in each
// group. Up and Down move through the list; Enter (or a click) goes to the node. With the
// navigate module the node gets keyboard focus (and its tooltip shows); without it, going to a
// node is a tap on it. The camera brings it into view. Escape closes the box and gives the keys
// back to the canvas.
//
// The box is an ARIA combobox with a listbox, so screen readers read the matches.
//
// Events: 'search' ({node, query}) when a node is picked.
// Options: `limit` (8), `key` ('/'), `placeholder` ('Find a node').
// API: open(text), close(), find(text) (the matching nodes), dispose().
//
// The box opens at the top of what shows of the canvas, beside a panel that covers part of it
// rather than under it (see the view's visible area).
import {placeOverCanvas} from '../visible.js';

// Height kept free below the box's top for the list of matches (CSS pixels)
const RESULTS_ROOM = 260;
const ROOT_STYLE = 'position:fixed;z-index:2147483646;width:300px;max-width:calc(100vw - 24px);padding:6px;' +
  'border-radius:4px;background:rgba(9,22,44,0.96);border:1px solid rgba(255,255,255,0.18);' +
  'box-shadow:0 2px 10px rgba(0,0,0,0.45);font:13px/1.4 system-ui,-apple-system,"Segoe UI",sans-serif;color:#e8f1ff;';
const INPUT_STYLE = 'width:100%;box-sizing:border-box;padding:5px 7px;border-radius:3px;border:1px solid rgba(255,255,255,0.3);' +
  'background:rgba(0,0,0,0.35);color:inherit;font:inherit;outline-offset:1px;';
const LIST_STYLE = 'list-style:none;margin:4px 0 0;padding:0;max-height:50vh;overflow:auto;';
const OPTION_STYLE = 'display:flex;justify-content:space-between;gap:8px;padding:3px 6px;border-radius:3px;cursor:pointer;';

let searchBoxes = 0;

export default {
  name: 'search',
  attach(ctx, options = {}) {
    let limit = options.limit || 8;
    let openKey = options.key || '/';
    let canvas = ctx.scene.getDrawContext().canvas;
    let index = null;
    let box = null;
    let listId = 'graph-search-' + (++searchBoxes);

    ctx.input.add({
      name: 'search',
      priority: 35,
      key(e) {
        if (e.key !== openKey || e.ctrlKey || e.metaKey || e.altKey) return false;
        open('');
        return true;
      }
    });
    ctx.graph.on('changed', forget);

    return {
      open,
      close: () => close(false),
      find: text => findNodes(getIndex(), text, limit).map(match => match.node),
      dispose() {
        close(false);
        ctx.graph.off('changed', forget);
      }
    };

    function forget() {
      index = null;
    }

    function getIndex() {
      if (!index) index = buildSearchIndex(ctx.graph, ctx.labelOf);
      return index;
    }

    function open(text) {
      if (!box) createBox();
      box.input.value = text || '';
      box.root.style.display = 'block';
      // At the top of what shows, not under a panel, with room for the results below it
      placeOverCanvas(box.root, canvas, ctx.visibleArea(), 'top', RESULTS_ROOM);
      box.input.focus({preventScroll: true});
      update();
    }

    // `byPointer`: the pick was a click or a tap, so the canvas takes focus without the keyboard's
    // focus ring (browsers that ignore focusVisible decide themselves)
    function close(backToCanvas, byPointer) {
      if (!box || box.root.style.display === 'none') return;
      box.root.style.display = 'none';
      box.input.setAttribute('aria-expanded', 'false');
      box.input.removeAttribute('aria-activedescendant');
      if (backToCanvas && canvas.focus) canvas.focus(byPointer ? {preventScroll: true, focusVisible: false} : {preventScroll: true});
    }

    function createBox() {
      let root = document.createElement('div');
      root.style.cssText = ROOT_STYLE;
      root.setAttribute('role', 'search');
      root.setAttribute('data-graph-overlay', '');
      let input = document.createElement('input');
      input.type = 'search';
      input.style.cssText = INPUT_STYLE;
      input.placeholder = options.placeholder || 'Find a node';
      input.setAttribute('role', 'combobox');
      input.setAttribute('aria-label', 'Find a node');
      input.setAttribute('aria-autocomplete', 'list');
      input.setAttribute('aria-expanded', 'false');
      input.setAttribute('aria-controls', listId);
      input.autocomplete = 'off';
      input.spellcheck = false;
      let list = document.createElement('ul');
      list.id = listId;
      list.setAttribute('role', 'listbox');
      list.setAttribute('aria-label', 'Matching nodes');
      list.style.cssText = LIST_STYLE;
      let status = document.createElement('div');
      status.setAttribute('aria-live', 'polite');
      status.style.cssText = 'opacity:0.65;font-size:12px;margin-top:3px;';
      root.appendChild(input);
      root.appendChild(list);
      root.appendChild(status);
      document.body.appendChild(root);

      input.addEventListener('input', update);
      input.addEventListener('keydown', onKey);
      root.addEventListener('focusout', () => {
        // Closes when focus leaves the box (Tab, a click elsewhere)
        setTimeout(() => { if (box && !box.root.contains(document.activeElement)) close(false); }, 0);
      });
      // A click on an option keeps focus in the input until the pick
      list.addEventListener('pointerdown', e => e.preventDefault());
      list.addEventListener('click', e => {
        let option = e.target.closest('[role=option]');
        if (option) pick(+option.dataset.index, true);
      });
      box = {root, input, list, status, matches: [], active: -1};
    }

    function update() {
      let query = box.input.value;
      let matches = findNodes(getIndex(), query, limit);
      box.matches = matches;
      box.active = matches.length ? 0 : -1;
      render(query);
    }

    function render(query) {
      let {list, input, status, matches} = box;
      list.textContent = '';
      matches.forEach((match, i) => {
        let option = document.createElement('li');
        option.id = `${listId}-${i}`;
        option.setAttribute('role', 'option');
        option.dataset.index = i;
        option.style.cssText = OPTION_STYLE;
        let label = document.createElement('span');
        label.textContent = match.label;
        label.style.cssText = 'overflow:hidden;text-overflow:ellipsis;white-space:nowrap;';
        let links = document.createElement('span');
        links.textContent = match.degree === 1 ? '1 link' : `${match.degree} links`;
        links.style.cssText = 'opacity:0.6;white-space:nowrap;font-size:12px;';
        option.appendChild(label);
        option.appendChild(links);
        list.appendChild(option);
      });
      input.setAttribute('aria-expanded', matches.length ? 'true' : 'false');
      highlight();
      let total = matches.total || 0;
      status.textContent = !query.trim() ? '' :
        total === 0 ? 'No matches' :
        total > matches.length ? `${total.toLocaleString('en-US')} matches, the first ${matches.length} shown` :
        total === 1 ? '1 match' : `${total} matches`;
    }

    function highlight() {
      let items = box.list.children;
      for (let i = 0; i < items.length; ++i) {
        let on = i === box.active;
        items[i].setAttribute('aria-selected', on ? 'true' : 'false');
        items[i].style.background = on ? 'rgba(255,255,255,0.16)' : '';
      }
      if (box.active >= 0) {
        box.input.setAttribute('aria-activedescendant', `${listId}-${box.active}`);
        if (items[box.active] && items[box.active].scrollIntoView) items[box.active].scrollIntoView({block: 'nearest'});
      } else {
        box.input.removeAttribute('aria-activedescendant');
      }
    }

    function onKey(e) {
      let count = box.matches.length;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!count) return;
        box.active = (box.active + (e.key === 'ArrowDown' ? 1 : -1) + count) % count;
        highlight();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (box.active >= 0) pick(box.active);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        close(true);
      }
    }

    function pick(i, byPointer) {
      let match = box.matches[i];
      if (!match) return;
      let query = box.input.value;
      close(true, byPointer);
      let node = match.node;
      let focus = ctx.get('focus');
      if (focus) {
        focus.set(node, 'search');
      } else {
        ctx.reveal(node);
        ctx.input.tap(node, {});
      }
      ctx.emit('search', {node, id: node.id, query});
    }
  }
};

/** What search looks in: one entry per node with its label, lowercased text and links */
export function buildSearchIndex(graph, labelOf) {
  let entries = [];
  graph.forEachNode(node => {
    let label = labelOf ? labelOf(node) : String(node.id);
    let links = 0;
    graph.forEachLinkedNode(node.id, () => { links += 1; });
    entries.push({node, label, text: label.toLowerCase(), id: String(node.id).toLowerCase(), degree: links});
  });
  return entries;
}

/**
 * The best `limit` matches of `query`: [{node, label, degree, rank}] with `total`, the number of
 * all matches. Ranks: 0 the label starts with it, 1 a word of the label does, 2 the label contains
 * it, 3 the id does. Within a rank, more links first, then the label (ignoring case).
 */
export function findNodes(index, query, limit = 8) {
  let q = (query || '').trim().toLowerCase();
  let best = [];
  best.total = 0;
  if (!q) return best;
  for (let i = 0; i < index.length; ++i) {
    let entry = index[i];
    let rank = rankOf(entry, q);
    if (rank < 0) continue;
    best.total += 1;
    // Keep the best `limit` so far, sorted (insertion into a short list)
    if (best.length === limit && !better(rank, entry, best[limit - 1])) continue;
    let match = {node: entry.node, label: entry.label, text: entry.text, degree: entry.degree, rank};
    let at = best.length;
    while (at > 0 && better(rank, entry, best[at - 1])) at -= 1;
    best.splice(at, 0, match);
    if (best.length > limit) best.pop();
  }
  return best;
}

function rankOf(entry, q) {
  let text = entry.text;
  let at = text.indexOf(q);
  if (at === 0) return 0;
  if (at > 0) {
    while (at > 0) {
      if (!isWordCharacter(text.charCodeAt(at - 1))) return 1;
      at = text.indexOf(q, at + 1);
    }
    return 2;
  }
  if (entry.id !== text && entry.id.indexOf(q) >= 0) return 3;
  return -1;
}

function better(rank, entry, match) {
  if (rank !== match.rank) return rank < match.rank;
  if (entry.degree !== match.degree) return entry.degree > match.degree;
  return entry.text < match.text;
}

function isWordCharacter(code) {
  // Letters and digits (Latin, and anything above ASCII counts as a letter)
  return (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122) || code > 127;
}
