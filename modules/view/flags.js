// Per-node state that the view draws: one byte per node, written into the unused fourth float of
// the positions texture, so nodes and links read it with the same fetch as their position. Links
// read the flags of both ends, so lighting up a selected node's links costs no JavaScript per link.

export const HOVERED = 1;
export const SELECTED = 2;
export const DRAGGED = 4;
export const FOCUSED = 8;
/** Set by the view on nodes linked to a selected node */
export const NEIGHBOR = 16;
/** Free for modules: not styled by the view */
export const CUSTOM_1 = 32;
export const CUSTOM_2 = 64;
/** The view's own: this node, and the links that touch it, are drawn again after everything else */
export const ON_TOP = 128;

const SETTABLE = HOVERED | SELECTED | DRAGGED | FOCUSED | CUSTOM_1 | CUSTOM_2;
const ALWAYS_ON_TOP = HOVERED | DRAGGED | FOCUSED;

/**
 * Flags by node id. `onChange()` is called after every change. Ids stay until cleared, also when
 * their node leaves the graph (see `drop()`).
 */
export function createFlags(onChange) {
  let byId = new Map();
  let counts = new Map();

  return {
    /** Sets (`on` true) or clears the bits of `bit` on node `id`; true if something changed */
    set(id, bit, on) {
      bit &= SETTABLE;
      let old = byId.get(id) || 0;
      let next = on ? (old | bit) : (old & ~bit);
      if (next === old) return false;
      if (next) byId.set(id, next); else byId.delete(id);
      count(old, -1);
      count(next, 1);
      onChange();
      return true;
    },
    /** All bits of node `id` (0 if none) */
    get(id) {
      return byId.get(id) || 0;
    },
    has(id, bit) {
      return ((byId.get(id) || 0) & bit) !== 0;
    },
    /** Clears `bit` on every node */
    clear(bit) {
      let changed = false;
      byId.forEach((bits, id) => {
        if (!(bits & bit)) return;
        let next = bits & ~bit;
        if (next) byId.set(id, next); else byId.delete(id);
        count(bits, -1);
        count(next, 1);
        changed = true;
      });
      if (changed) onChange();
      return changed;
    },
    /** Ids of the nodes that have `bit` */
    ids(bit) {
      let ids = [];
      byId.forEach((bits, id) => { if (bits & bit) ids.push(id); });
      return ids;
    },
    /** How many nodes have `bit` (a single bit) */
    count(bit) {
      return counts.get(bit) || 0;
    },
    forEach(callback) {
      byId.forEach((bits, id) => callback(id, bits));
    },
    /** Forgets node `id`, e.g. when it left the graph */
    drop(id) {
      let old = byId.get(id);
      if (!old) return;
      byId.delete(id);
      count(old, -1);
      onChange();
    }
  };

  function count(bits, change) {
    for (let bit = 1; bit <= 64; bit <<= 1) {
      if (bits & bit) counts.set(bit, (counts.get(bit) || 0) + change);
    }
  }
}

/**
 * The flag of every row, ready to draw: writes `rowBits` (one byte per row) and says which rows
 * and links are drawn again on top.
 *
 * - `rowOf(id)`: the row of a node, or -1 when it has none;
 * - `previousRows`: rows written last time (cleared first);
 * - `limits.nodes`, `limits.links`: selected nodes are drawn on top only while there are at most
 *   this many of them, with at most this many links between them (a highlight of half the graph
 *   would just draw it twice; dimming the rest already shows it).
 *
 * Returns {rows, topNodes, topLinks}: the rows written, the rows drawn on top (selected first,
 * hovered last, so it is the topmost), and the links drawn on top, each once.
 */
export function layoutFlags(flags, graph, rowOf, rowBits, previousRows, limits) {
  for (let i = 0; i < previousRows.length; ++i) rowBits[previousRows[i]] = 0;
  let rows = [];
  let selectedOnTop = flags.count(SELECTED) <= limits.nodes;
  if (selectedOnTop) {
    let links = 0;
    flags.forEach((id, bits) => {
      if (bits & SELECTED) links += degree(graph.getNode(id));
    });
    selectedOnTop = links <= limits.links;
  }

  // Selected first, hovered last: the order they are drawn on top in. Each holds [row, id] pairs.
  let buckets = [[], [], [], []];
  flags.forEach((id, bits) => {
    let row = rowOf(id);
    if (row < 0) return;
    if ((bits & ALWAYS_ON_TOP) || ((bits & SELECTED) && selectedOnTop)) {
      buckets[bits & HOVERED ? 3 : bits & DRAGGED ? 2 : bits & FOCUSED ? 1 : 0].push(row, id);
      bits |= ON_TOP;
    }
    rowBits[row] = bits;
    rows.push(row);
  });

  if (flags.count(SELECTED)) {
    flags.forEach((id, bits) => {
      if (!(bits & SELECTED)) return;
      graph.forEachLinkedNode(id, other => {
        let row = rowOf(other.id);
        if (row < 0) return;
        if (!rowBits[row]) rows.push(row);
        rowBits[row] |= NEIGHBOR;
      });
    });
  }

  let pairs = buckets[0].concat(buckets[1], buckets[2], buckets[3]);
  let topNodes = [];
  let topLinks = [];
  for (let i = 0; i < pairs.length; i += 2) {
    let row = pairs[i];
    topNodes.push(row);
    graph.forEachLinkedNode(pairs[i + 1], (other, link) => {
      let otherRow = rowOf(other.id);
      if (otherRow < 0) return;
      // A link between two nodes on top: once, from the end with the larger row
      if ((rowBits[otherRow] & ON_TOP) && otherRow < row) return;
      if (otherRow === row && topLinks.length && topLinks[topLinks.length - 1] === link) return;
      topLinks.push(link);
    });
  }
  return {rows, topNodes, topLinks};
}

function degree(node) {
  if (!node || !node.links) return 0;
  return node.links.size !== undefined ? node.links.size : node.links.length;
}
