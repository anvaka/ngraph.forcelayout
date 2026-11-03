// What part of the canvas the user can see. Other elements can cover it (a settings panel, a
// toolbar, a header), and part of it can be outside the window. The view finds out the way the
// browser routes a press: a point of the canvas is visible when a click there would reach the
// canvas. That needs no word from the app, and follows whatever the page does (a panel that opens
// or scrolls, a window that shrinks).
//
// Elements marked `data-graph-overlay` don't count: the view's own tooltip, search box and help
// card move with what they show. Elements with `pointer-events: none` don't count either, since
// the browser looks through them.
//
// Hit testing a point costs a few µs (more when the page has to lay itself out first), so the
// visible area is measured on a grid of about 1500 cells (30 px on a 1440×900 canvas, 3 to 12 ms)
// only when asked. What covers the canvas changes almost only when the visitor does something
// (a click, a key, a resize, a scroll) or when a transition ends, so a measured area is kept
// until one of those happens, and at most a second (for pages that change on their own).

export const OVERLAY_ATTRIBUTE = 'data-graph-overlay';

const CELLS = 1500;
const MIN_CELL = 16;
// How long a measured area is trusted (ms) when nothing that could change it happened
const MAX_AGE = 1000;
// What makes a measured area stale: the visitor acted, the page moved or a transition ended
const STALE_ON = ['pointerup', 'keyup', 'click', 'scroll', 'transitionend', 'animationend'];

/**
 * `canvas`: the element. `covered`: `(x, y) => boolean` in canvas CSS pixels, to say yourself
 * what is hidden; by default the page is hit tested.
 */
export function createVisibility(canvas, covered) {
  let test = covered || hitTest(canvas);
  let cached = null;
  let forget = () => { cached = null; };
  let doc = typeof document !== 'undefined' ? document : null;
  let win = typeof window !== 'undefined' ? window : null;
  // Capture: a panel's own handlers may stop the event from bubbling
  if (doc && doc.addEventListener) STALE_ON.forEach(name => doc.addEventListener(name, forget, true));
  if (win && win.addEventListener) win.addEventListener('resize', forget);

  return {
    /** True when the canvas point (CSS pixels) is hidden */
    covered(x, y) {
      return test(x, y, canvasRect());
    },
    /** True when any point of a `step` lattice in the box is hidden */
    coveredIn(x0, y0, x1, y1, step) {
      let rect = canvasRect();
      let nx = Math.max(1, Math.ceil((x1 - x0) / step)), ny = Math.max(1, Math.ceil((y1 - y0) / step));
      for (let j = 0; j <= ny; ++j) {
        for (let i = 0; i <= nx; ++i) {
          if (test(x0 + (x1 - x0) * i / nx, y0 + (y1 - y0) * j / ny, rect)) return true;
        }
      }
      return false;
    },
    /** The visible area, measured now or a moment ago (see measureArea) */
    area() {
      let rect = canvasRect();
      let now = Date.now();
      if (!cached || now - cached.time > MAX_AGE || cached.width !== rect.width || cached.height !== rect.height) {
        cached = measureArea(rect.width, rect.height, (x, y) => test(x, y, rect));
        cached.time = now;
      }
      return cached;
    },
    forget,
    dispose() {
      cached = null;
      if (doc && doc.removeEventListener) STALE_ON.forEach(name => doc.removeEventListener(name, forget, true));
      if (win && win.removeEventListener) win.removeEventListener('resize', forget);
    }
  };

  function canvasRect() {
    return canvas.getBoundingClientRect();
  }
}

// Pixels between an element placed over the canvas and the canvas's edges or what covers it
const OVERLAY_MARGIN = 12;

/**
 * Puts a fixed-position element of the view (a search box, a help card) over the canvas where it
 * shows: the first spot from the `from` edge ('top' or 'bottom') where it fits in the visible
 * `area`, a little away from covers; the canvas's corner on that side when nothing covers the
 * canvas or the element fits nowhere. `height`: room to keep for an element that grows (its own
 * height when larger).
 */
export function placeOverCanvas(element, canvas, area, from = 'top', height = 0) {
  let rect = canvas.getBoundingClientRect();
  let w = element.offsetWidth, h = Math.max(element.offsetHeight, height);
  let at = area && area.anyHidden ? area.spot(w, h, OVERLAY_MARGIN, from) : null;
  if (!at) {
    at = {x: OVERLAY_MARGIN, y: from === 'bottom' ? Math.max(OVERLAY_MARGIN, rect.height - h - OVERLAY_MARGIN) : OVERLAY_MARGIN};
  }
  element.style.left = (rect.left + at.x) + 'px';
  element.style.top = (rect.top + at.y) + 'px';
}

// A point is covered when the topmost element there (looking through the view's own overlays)
// is not the canvas, or when it is outside the window
function hitTest(canvas) {
  let root = canvas.getRootNode ? canvas.getRootNode() : null;
  if (!root || typeof root.elementFromPoint !== 'function') root = typeof document !== 'undefined' ? document : null;
  if (!root) return () => false;
  return (x, y, rect) => {
    let clientX = rect.left + x, clientY = rect.top + y;
    let top = root.elementFromPoint(clientX, clientY);
    if (top === canvas) return false;
    if (!top || !isOverlay(top)) return true;
    let stack = root.elementsFromPoint(clientX, clientY);
    for (let i = 0; i < stack.length; ++i) {
      if (stack[i] === canvas) return false;
      if (!isOverlay(stack[i])) return true;
    }
    return true;
  };
}

function isOverlay(element) {
  return !!(element.closest && element.closest('[' + OVERLAY_ATTRIBUTE + ']'));
}

/**
 * The visible part of a `width` × `height` canvas as a grid: `covered(x, y)` (canvas pixels) is
 * sampled at the centre of each cell. Returns an area with:
 * - `cell`, `cols`, `rows`, `hidden` (1 per covered cell), `anyHidden`;
 * - `clearance`: per cell, how many cells away the nearest covered cell is (along either axis);
 * - `isHidden(x, y)`, `nearest(x, y, margin)`, `center()`, `largestRect()`,
 *   `spot(width, height, margin, from)` below.
 */
export function measureArea(width, height, covered, cellSize) {
  let cell = cellSize || Math.max(MIN_CELL, Math.ceil(Math.sqrt(width * height / CELLS)));
  let cols = Math.max(1, Math.ceil(width / cell)), rows = Math.max(1, Math.ceil(height / cell));
  let count = cols * rows;
  let hidden = new Uint8Array(count);
  let anyHidden = false, allHidden = true;
  for (let r = 0; r < rows; ++r) {
    let y = Math.min((r + 0.5) * cell, height - 0.5);
    for (let c = 0; c < cols; ++c) {
      let x = Math.min((c + 0.5) * cell, width - 0.5);
      if (covered(x, y)) {
        hidden[r * cols + c] = 1;
        anyHidden = true;
      } else {
        allHidden = false;
      }
    }
  }
  let clearance = chebyshev(hidden, cols, rows);
  let largest;

  return {
    width, height, cell, cols, rows, hidden, clearance, anyHidden,
    // Nothing is visible: the page covers the whole canvas (a transparent layer that takes the
    // clicks, say). Then nobody can tell, and covers are ignored.
    allHidden,
    isHidden(x, y) {
      let c = Math.floor(x / cell), r = Math.floor(y / cell);
      if (c < 0 || r < 0 || c >= cols || r >= rows) return true;
      return hidden[r * cols + c] === 1;
    },
    /**
     * The visible point nearest (x, y) that is at least `margin` pixels inside the canvas and
     * `margin` away from what covers it; with a smaller margin where nothing is that far in.
     * Null when nothing is visible.
     */
    nearest(x, y, margin) {
      if (allHidden) return null;
      for (let m = margin; ; m /= 2) {
        let spot = nearestAt(x, y, m < 1 ? 0 : m);
        if (spot || m < 1) return spot;
      }
    },
    /** The visible point farthest from what covers the canvas and from its edges, or null */
    center() {
      if (allHidden) return null;
      let best = -1, bestRoom = -1, bestOff = Infinity;
      for (let r = 0; r < rows; ++r) {
        for (let c = 0; c < cols; ++c) {
          let i = r * cols + c;
          if (hidden[i]) continue;
          let x = (c + 0.5) * cell, y = (r + 0.5) * cell;
          let room = Math.min((clearance[i] - 0.5) * cell, x, y, width - x, height - y);
          let off = Math.abs(x - width / 2) + Math.abs(y - height / 2);
          if (room > bestRoom || (room === bestRoom && off < bestOff)) {
            best = i; bestRoom = room; bestOff = off;
          }
        }
      }
      return best < 0 ? null : {x: Math.min((best % cols + 0.5) * cell, width), y: Math.min((Math.floor(best / cols) + 0.5) * cell, height)};
    },
    /**
     * The largest rectangle of the canvas that nothing covers, {x, y, width, height} in canvas
     * pixels (the whole canvas when nothing covers it; null when everything does). It is where
     * the whole graph can be shown, or an overlay placed, out from under a panel.
     */
    largestRect() {
      if (largest !== undefined) return largest;
      if (allHidden) return (largest = null);
      if (!anyHidden) return (largest = {x: 0, y: 0, width, height});
      let best = largestOpenRect(hidden, cols, rows);
      if (!best) return (largest = null);
      let x = best.c0 * cell, y = best.r0 * cell;
      largest = {
        x, y,
        width: Math.min(width, (best.c1 + 1) * cell) - x,
        height: Math.min(height, (best.r1 + 1) * cell) - y
      };
      return largest;
    },
    /**
     * Where a `width` × `height` box (a search box, a help card) fits in what shows, `margin`
     * pixels inside the canvas and at least `margin` (and half a cell) from what covers it: its
     * top left corner {x, y}, the first one found from the `from` edge ('top' or 'bottom'), left
     * to right. Null when it fits nowhere.
     */
    spot(boxWidth, boxHeight, margin = 0, from = 'top') {
      if (allHidden) return null;
      let left = margin, right = width - margin - boxWidth;
      let top = margin, bottom = height - margin - boxHeight;
      if (right < left || bottom < top) return null;
      let sums = hiddenSums();
      let reach = Math.max(margin, cell / 2);
      let xs = candidates(left, right), ys = candidates(top, bottom);
      if (from === 'bottom') ys.reverse();
      for (let j = 0; j < ys.length; ++j) {
        for (let i = 0; i < xs.length; ++i) {
          let x = xs[i], y = ys[j];
          let c0 = Math.max(0, Math.floor((x - reach) / cell)), c1 = Math.min(cols - 1, Math.floor((x + boxWidth + reach) / cell));
          let r0 = Math.max(0, Math.floor((y - reach) / cell)), r1 = Math.min(rows - 1, Math.floor((y + boxHeight + reach) / cell));
          if (countIn(sums, c0, r0, c1, r1) === 0) return {x, y};
        }
      }
      return null;

      // The edge positions, then every cell boundary between them
      function candidates(from0, to) {
        let list = [from0];
        for (let k = Math.ceil(from0 / cell); k * cell < to; ++k) if (k * cell > from0) list.push(k * cell);
        if (to > from0) list.push(to);
        return list;
      }
    }
  };

  // Hidden cells summed over every top left rectangle, so a box is counted at once
  function hiddenSums() {
    let sums = new Uint32Array((cols + 1) * (rows + 1));
    for (let r = 0; r < rows; ++r) {
      let line = 0;
      for (let c = 0; c < cols; ++c) {
        line += hidden[r * cols + c];
        sums[(r + 1) * (cols + 1) + c + 1] = sums[r * (cols + 1) + c + 1] + line;
      }
    }
    return sums;
  }

  function countIn(sums, c0, r0, c1, r1) {
    let w = cols + 1;
    return sums[(r1 + 1) * w + c1 + 1] - sums[r0 * w + c1 + 1] - sums[(r1 + 1) * w + c0] + sums[r0 * w + c0];
  }

  function nearestAt(x, y, margin) {
    // Cells that are `margin` away from covered cells, all of them: `need` cells apart, the gap
    // between them is (need - 1) cells. The edge of a cover is known to half a cell.
    let need = margin > 0 ? margin / cell + 1 : 1;
    let x0 = margin, y0 = margin, x1 = width - margin, y1 = height - margin;
    if (x0 > x1 || y0 > y1) return null;
    let best = null, bestDistance = Infinity;
    for (let r = 0; r < rows; ++r) {
      let top = Math.max(r * cell, y0), bottom = Math.min((r + 1) * cell, y1);
      if (top > bottom) continue;
      let py = Math.min(Math.max(y, top), bottom);
      let dy = py - y;
      if (dy * dy >= bestDistance) continue;
      for (let c = 0; c < cols; ++c) {
        let i = r * cols + c;
        if (hidden[i] || clearance[i] < need) continue;
        let left = Math.max(c * cell, x0), right = Math.min((c + 1) * cell, x1);
        if (left > right) continue;
        let px = Math.min(Math.max(x, left), right);
        let d = (px - x) * (px - x) + dy * dy;
        if (d < bestDistance) {
          bestDistance = d;
          best = {x: px, y: py};
        }
      }
    }
    return best;
  }
}

// Per cell: the distance in cells (the larger of the two axes) to the nearest hidden cell. Hidden
// cells get 0; with no hidden cell at all, every cell gets a large number.
function chebyshev(hidden, cols, rows) {
  let far = 65535;
  let d = new Uint16Array(cols * rows);
  for (let i = 0; i < d.length; ++i) d[i] = hidden[i] ? 0 : far;
  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) {
      let i = r * cols + c;
      if (!d[i]) continue;
      let v = d[i];
      if (c > 0) v = Math.min(v, d[i - 1] + 1);
      if (r > 0) {
        v = Math.min(v, d[i - cols] + 1);
        if (c > 0) v = Math.min(v, d[i - cols - 1] + 1);
        if (c < cols - 1) v = Math.min(v, d[i - cols + 1] + 1);
      }
      d[i] = Math.min(v, far);
    }
  }
  for (let r = rows - 1; r >= 0; --r) {
    for (let c = cols - 1; c >= 0; --c) {
      let i = r * cols + c;
      if (!d[i]) continue;
      let v = d[i];
      if (c < cols - 1) v = Math.min(v, d[i + 1] + 1);
      if (r < rows - 1) {
        v = Math.min(v, d[i + cols] + 1);
        if (c < cols - 1) v = Math.min(v, d[i + cols + 1] + 1);
        if (c > 0) v = Math.min(v, d[i + cols - 1] + 1);
      }
      d[i] = Math.min(v, far);
    }
  }
  return d;
}

/**
 * The largest all-open rectangle of a grid (`hidden[r * cols + c]` is 1 where covered), by the
 * histogram method in O(cols × rows): {c0, c1, r0, r1} (inclusive cells), or null.
 */
export function largestOpenRect(hidden, cols, rows) {
  let heights = new Int32Array(cols);
  let stack = new Int32Array(cols + 1);
  let best = null, bestArea = 0;
  for (let r = 0; r < rows; ++r) {
    for (let c = 0; c < cols; ++c) heights[c] = hidden[r * cols + c] ? 0 : heights[c] + 1;
    let top = 0;
    for (let c = 0; c <= cols; ++c) {
      let h = c < cols ? heights[c] : 0;
      while (top > 0 && heights[stack[top - 1]] >= h) {
        let height = heights[stack[--top]];
        let left = top > 0 ? stack[top - 1] + 1 : 0;
        let area = height * (c - left);
        if (area > bestArea) {
          bestArea = area;
          best = {c0: left, c1: c - 1, r0: r - height + 1, r1: r};
        }
      }
      stack[top++] = c;
    }
  }
  return best;
}
