// Where labels go: a greedy pass over candidates in order of preference, against a grid of screen
// cells. A label sits beside its node (right, left, above or below); a label placed last time
// tries its old side first, so labels don't jump around.

/** The sides a label can take, in the order they are tried */
export const ANCHORS = ['right', 'left', 'above', 'below'];
export const ANCHOR_INDEX = {right: 0, left: 1, above: 2, below: 3};

/**
 * `candidates`, in order of preference: {row, x, y, radius, width, height, anchor, forced}. x, y
 * and radius are the node's disc on the screen (CSS pixels); width and height the label's box;
 * `anchor` the side it had last time (or null); `forced` labels are placed even where they
 * overlap others (the hovered or selected node's label).
 *
 * `options`: width, height (the canvas), gap (pixels between the disc and the label, 3),
 * padding (pixels kept free around each label, 2), margin (pixels past the canvas edges where
 * labels may still go, 0), max (labels at most, not counting forced ones), cell (grid cell, 32).
 *
 * Returns [{row, anchor, x, y, width, height}]: the placed labels' boxes (top left corner).
 */
export function placeLabels(candidates, options) {
  let gap = options.gap !== undefined ? options.gap : 3;
  let padding = options.padding !== undefined ? options.padding : 2;
  let margin = options.margin || 0;
  let max = options.max !== undefined ? options.max : Infinity;
  let grid = createGrid(options.width, options.height, options.cell || 32, margin);
  let placed = [];
  let free = 0;
  let box = {x: 0, y: 0, width: 0, height: 0};
  for (let i = 0; i < candidates.length; ++i) {
    let c = candidates[i];
    if (!c.forced && free >= max) break;
    let first = c.anchor && ANCHOR_INDEX[c.anchor] !== undefined ? c.anchor : null;
    for (let k = first ? -1 : 0; k < ANCHORS.length; ++k) {
      let anchor = k < 0 ? first : ANCHORS[k];
      if (k >= 0 && anchor === first) continue;
      boxBeside(c, anchor, gap, box);
      if (!c.forced) {
        if (box.x < -margin || box.y < -margin || box.x + box.width > options.width + margin ||
            box.y + box.height > options.height + margin) continue;
        if (grid.collides(box, padding)) continue;
      }
      grid.add(box);
      placed.push({row: c.row, anchor, x: box.x, y: box.y, width: box.width, height: box.height});
      if (!c.forced) free += 1;
      break;
    }
  }
  return placed;
}

/** The box (top left corner and size) of a label on `anchor` side of its node, into `out` */
export function boxBeside(c, anchor, gap, out) {
  let w = c.width, h = c.height, r = c.radius + gap;
  if (anchor === 'right') { out.x = c.x + r; out.y = c.y - h / 2; }
  else if (anchor === 'left') { out.x = c.x - r - w; out.y = c.y - h / 2; }
  else if (anchor === 'above') { out.x = c.x - w / 2; out.y = c.y - r - h; }
  else { out.x = c.x - w / 2; out.y = c.y + r; }
  out.width = w;
  out.height = h;
  return out;
}

// Boxes by the cells they cover. Boxes outside the grid still count, in the edge cells.
function createGrid(width, height, cell, margin) {
  let left = -margin, top = -margin;
  let columns = Math.max(1, Math.ceil((width + 2 * margin) / cell));
  let rows = Math.max(1, Math.ceil((height + 2 * margin) / cell));
  let cells = new Array(columns * rows);
  let boxes = [];
  return {
    add(box) {
      let index = boxes.length / 4;
      boxes.push(box.x, box.y, box.x + box.width, box.y + box.height);
      forCells(box, 0, c => {
        (cells[c] || (cells[c] = [])).push(index);
        return false;
      });
    },
    collides(box, padding) {
      let x0 = box.x - padding, y0 = box.y - padding, x1 = box.x + box.width + padding, y1 = box.y + box.height + padding;
      return forCells(box, padding, c => {
        let list = cells[c];
        if (!list) return false;
        for (let i = 0; i < list.length; ++i) {
          let b = list[i] * 4;
          if (boxes[b] < x1 && boxes[b + 2] > x0 && boxes[b + 1] < y1 && boxes[b + 3] > y0) return true;
        }
        return false;
      });
    }
  };

  function forCells(box, padding, visit) {
    let c0 = clamp(Math.floor((box.x - padding - left) / cell), columns);
    let c1 = clamp(Math.floor((box.x + box.width + padding - left) / cell), columns);
    let r0 = clamp(Math.floor((box.y - padding - top) / cell), rows);
    let r1 = clamp(Math.floor((box.y + box.height + padding - top) / cell), rows);
    for (let r = r0; r <= r1; ++r) {
      for (let c = c0; c <= c1; ++c) {
        if (visit(r * columns + c)) return true;
      }
    }
    return false;
  }
}

function clamp(value, count) {
  return value < 0 ? 0 : value >= count ? count - 1 : value;
}
