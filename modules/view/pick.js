// Which node is under a point of the canvas. Picking runs on the CPU, from the layout's own
// positions, and only when someone asks (a press, a hover module, a selection box).
//
// It works as a bubble cursor with a capped reach: a point inside a node's disc picks that node;
// otherwise the node whose disc edge is nearest wins, if it is within `reach` pixels. Overlapping
// discs go to the node drawn last in 2D, and to the nearest one in 3D.
//
// In 2D the point becomes a point of the scene and the positions are scanned there, with no
// projection (0.1 ms at 100k nodes, 0.9 ms at 1M on an M4 Max). Only the few nodes near it are
// projected, to measure them in pixels. In 3D every node is projected (0.6 ms at 100k, 5 ms at 1M).
import {ORIGIN, Z_NORMAL} from './math.js';

const onScreen = {x: 0, y: 0, w: 0};
const planePoint = [0, 0, 0], stepX = [0, 0, 0], stepY = [0, 0, 0];

/**
 * `state`:
 * - `pos`, `D`: the layout's `store.pos`, `D` numbers per row;
 * - `count`: rows to look at;
 * - `sizes`: diameter of each row's disc in scene units, and `maxSize` the largest of them;
 * - `projector`: the camera of this frame (see math.js).
 *
 * `sx`, `sy`: the point, in CSS pixels of the canvas. `reach`: pixels from a disc's edge within
 * which a node still counts. Row `sticky` (the hovered node, or -1) gets `bonus` more pixels.
 *
 * Returns {row, distance, inside, x, y, radius} or null: `distance` is in pixels from the disc's
 * edge (0 inside), `x`, `y` and `radius` are the disc on the canvas.
 */
export function pickNode(state, sx, sy, reach, sticky = -1, bonus = 0) {
  let best = {row: -1, inside: false, score: Infinity, distance: 0, x: 0, y: 0, w: 0, radius: 0};
  let flat = state.D < 3;
  if (!flat || !scanPlane(state, sx, sy, reach, sticky, bonus, best)) {
    scanAll(state, sx, sy, reach, sticky, bonus, best, !flat);
  }
  if (best.row < 0) return null;
  return {row: best.row, distance: best.distance, inside: best.inside, x: best.x, y: best.y, radius: best.radius};
}

/**
 * Rows whose disc touches the rectangle between two canvas points (CSS pixels), for a selection box
 */
export function nodesInRect(state, x0, y0, x1, y1) {
  let left = Math.min(x0, x1), right = Math.max(x0, x1);
  let top = Math.min(y0, y1), bottom = Math.max(y0, y1);
  let {pos, D, count, sizes, projector} = state;
  let rows = [];
  for (let i = 0, j = 0; i < count; ++i, j += D) {
    if (!projector.toScreen(pos[j], D > 1 ? pos[j + 1] : 0, D > 2 ? pos[j + 2] : 0, onScreen)) continue;
    let radius = sizes[i] * 0.5 * projector.pixelsPerUnit(onScreen.w);
    let dx = onScreen.x < left ? left - onScreen.x : (onScreen.x > right ? onScreen.x - right : 0);
    let dy = onScreen.y < top ? top - onScreen.y : (onScreen.y > bottom ? onScreen.y - bottom : 0);
    if (dx * dx + dy * dy <= radius * radius) rows.push(i);
  }
  return rows;
}

// 2D: scan in the plane z = 0. Returns false when the camera can't map pixels to that plane well
// enough (then every node is projected instead).
function scanPlane(state, sx, sy, reach, sticky, bonus, best) {
  let projector = state.projector;
  // Looking away from the plane: nothing is under the point
  if (!projector.onPlane(sx, sy, ORIGIN, Z_NORMAL, planePoint)) return true;
  if (!projector.onPlane(sx + 1, sy, ORIGIN, Z_NORMAL, stepX) ||
      !projector.onPlane(sx, sy + 1, ORIGIN, Z_NORMAL, stepY)) return false;
  // Units of the scene per pixel near the point, with room for a tilted camera
  let unitsPerPixel = 1.25 * Math.max(distance3(planePoint, stepX), distance3(planePoint, stepY));
  if (!Number.isFinite(unitsPerPixel)) return false;

  let around = (reach + bonus) * unitsPerPixel;
  let limit = around + state.maxSize * 0.5;
  let {pos, D, count, sizes} = state;
  let cx = planePoint[0], cy = planePoint[1];
  for (let i = 0, j = 0; i < count; ++i, j += D) {
    let dx = pos[j] - cx;
    if (dx > limit || dx < -limit) continue;
    let y = D > 1 ? pos[j + 1] : 0;
    let dy = y - cy;
    if (dy > limit || dy < -limit) continue;
    let within = around + sizes[i] * 0.5;
    if (dx * dx + dy * dy > within * within) continue;
    if (!projector.toScreen(pos[j], y, 0, onScreen)) continue;
    rank(best, i, sizes[i] * 0.5 * projector.pixelsPerUnit(onScreen.w), sx, sy, reach, sticky, bonus, false);
  }
  return true;
}

function scanAll(state, sx, sy, reach, sticky, bonus, best, depth) {
  let {pos, D, count, sizes, projector} = state;
  let m = projector.mvp, width = projector.width, height = projector.height;
  let far = reach + bonus;
  for (let i = 0, j = 0; i < count; ++i, j += D) {
    let x = pos[j], y = D > 1 ? pos[j + 1] : 0, z = D > 2 ? pos[j + 2] : 0;
    let w = m[3] * x + m[7] * y + m[11] * z + m[15];
    if (!(w > 0)) continue;
    let px = ((m[0] * x + m[4] * y + m[8] * z + m[12]) / w + 1) * 0.5 * width;
    let radius = sizes[i] * 0.5 * projector.pixelsPerUnit(w);
    let limit = far + radius;
    if (px - sx > limit || sx - px > limit) continue;
    let py = (1 - (m[1] * x + m[5] * y + m[9] * z + m[13]) / w) * 0.5 * height;
    if (py - sy > limit || sy - py > limit) continue;
    onScreen.x = px; onScreen.y = py; onScreen.w = w;
    rank(best, i, radius, sx, sy, reach, sticky, bonus, depth);
  }
}

// Keeps the better of `best` and the row at `onScreen`
function rank(best, row, radius, sx, sy, reach, sticky, bonus, depth) {
  let distance = Math.hypot(onScreen.x - sx, onScreen.y - sy) - radius;
  if (distance <= 0) {
    if (best.inside) {
      // Inside several discs: the hovered one, then the one on top
      if (best.row === sticky) return;
      if (row !== sticky && (depth ? onScreen.w >= best.w : row < best.row)) return;
    }
    best.inside = true;
    best.score = -Infinity;
    keep(best, row, 0, radius);
    return;
  }
  if (best.inside) return;
  let score = row === sticky ? distance - bonus : distance;
  if (score > reach || score >= best.score) return;
  best.score = score;
  keep(best, row, distance, radius);
}

function keep(best, row, distance, radius) {
  best.row = row;
  best.distance = distance;
  best.x = onScreen.x;
  best.y = onScreen.y;
  best.w = onScreen.w;
  best.radius = radius;
}

function distance3(a, b) {
  return Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}
