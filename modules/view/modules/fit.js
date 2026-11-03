// fit: keeps the whole layout in view while it moves, inside the part of the canvas the user
// sees (out from under a panel), until the user moves the camera. fit() brings it back.
//
//   const fit = view.use(fitLayout, {padding: 32});
//   fit.on(following => button.hidden = following);
//   button.onclick = () => fit.fit();
//
// The camera moves with the layout: when the drawing grows the camera backs off in the same
// frame (nothing is cut off), when it shrinks the camera eases in. Any other camera move (a pan,
// the wheel, a pinch, keys, reveal() for search or keyboard focus) stops following: the module
// remembers where it put the camera, and a camera that is somewhere else was moved by someone else.

const DEFAULTS = {
  // pixels between the drawing and the edges of what shows
  padding: 32,
  // closest zoom, in pixels per layout unit, so a graph of a few nodes isn't blown up
  maxScale: 8,
  // share of the way to the target per frame when the camera moves in
  ease: 0.2,
  follow: true
};

export default {
  name: 'fit',
  attach(ctx, options) {
    let settings = {...DEFAULTS, ...options};
    let following = !!settings.follow;
    let pending = following;  // fit at the next frame, without easing
    let mine = null;          // the camera as this module left it
    let current = null;       // {cx, cy, half} of the last view box this module set
    let easing = false;       // the camera is still on its way in
    let listeners = new Set();
    let canvas = ctx.scene.getDrawContext().canvas;

    ctx.onFrame(change => {
      if (!following) return;
      if (mine && moved()) {
        setFollowing(false);
        return;
      }
      if (pending || change.positions || change.structure || easing) {
        let instant = pending;
        pending = false;
        fitNow(instant);
      }
    });

    let onResize = () => {
      if (!following) return;
      pending = true;
      mine = null;
      current = null;
      ctx.requestFrame();
    };
    window.addEventListener('resize', onResize);

    return {
      /** Fits the layout now, and follows it again until the user moves the camera */
      fit() {
        pending = true;
        mine = null;
        current = null;
        setFollowing(true);
        ctx.requestFrame();
      },
      /** Turns following on or off without moving the camera now */
      follow(on) {
        setFollowing(!!on);
        if (on) { pending = true; mine = null; current = null; ctx.requestFrame(); }
      },
      following: () => following,
      /** `fn(following)` runs when following starts or stops. Returns a function that removes it. */
      on(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
      dispose() {
        window.removeEventListener('resize', onResize);
        listeners.clear();
      }
    };

    function setFollowing(on) {
      if (on === following) return;
      following = on;
      if (!on) mine = null;
      listeners.forEach(fn => fn(following));
    }

    function cameraState() {
      let view = ctx.scene.getDrawContext().view;
      return Array.from(view.position).concat(Array.from(view.orientation));
    }

    function moved() {
      let now = cameraState();
      let tolerance = 1e-6 * Math.max(1, Math.abs(mine[2]));
      for (let i = 0; i < now.length; ++i) {
        if (Math.abs(now[i] - mine[i]) > (i < 3 ? tolerance : 1e-9)) return true;
      }
      return false;
    }

    function fitNow(instant) {
      let bounds = layoutBounds(ctx.layout);
      if (!bounds) return;
      let rect = canvas.getBoundingClientRect();
      let target = visibleRect(rect.width, rect.height);
      let pad = Math.min(settings.padding, target.width / 4, target.height / 4);
      let rw = Math.max(1, target.width - 2 * pad), rh = Math.max(1, target.height - 2 * pad);
      let bw = Math.max(bounds.maxX - bounds.minX, 1e-6), bh = Math.max(bounds.maxY - bounds.minY, 1e-6);
      // pixels per layout unit
      let s = Math.min(rw / bw, rh / bh, settings.maxScale);
      if (bounds.depth) {
        // In 3D the near side of the drawing looks bigger: make room for it
        s = Math.min(s, Math.min(rw, rh) / (Math.max(bw, bh) + bounds.depth));
      }
      let probe = measure();
      // w-gl's view box: the camera looks at the box centre, `half` (in layout units) maps to a
      // fixed number of pixels, k
      let half = probe.k / s;
      let offX = target.x + target.width / 2 - rect.width / 2;
      let offY = target.y + target.height / 2 - rect.height / 2;
      let cx = (bounds.minX + bounds.maxX) / 2 - probe.sx * offX / s;
      let cy = (bounds.minY + bounds.maxY) / 2 - probe.sy * offY / s;
      easing = false;
      if (!instant && current && half < current.half * 0.995) {
        // moving in: ease. Moving out happens at once, so the drawing is never cut off
        let a = settings.ease;
        half = current.half * Math.pow(half / current.half, a);
        cx = current.cx + (cx - current.cx) * a;
        cy = current.cy + (cy - current.cy) * a;
        easing = true;
      }
      setBox(cx, cy, half);
    }

    function setBox(cx, cy, half) {
      if (current && Math.abs(half - current.half) < half * 1e-4 &&
          Math.abs(cx - current.cx) < half * 1e-4 && Math.abs(cy - current.cy) < half * 1e-4) return;
      ctx.scene.setViewBox({left: cx - half, top: cy - half, right: cx + half, bottom: cy + half});
      current = {cx, cy, half};
      mine = cameraState();
      // the frame being drawn used the camera from before: draw once more
      ctx.animate();
    }

    // How the view box maps to the canvas: pixels per unit times half (k), and the axis signs
    function measure() {
      let base = current || {cx: 0, cy: 0, half: 100};
      if (!current) setBox(base.cx, base.cy, base.half);
      let a = ctx.toScreen(base.cx, base.cy, 0), b = ctx.toScreen(base.cx + 1, base.cy + 1, 0);
      if (!a || !b) return {k: base.half, sx: 1, sy: 1};
      let dx = b.x - a.x, dy = b.y - a.y;
      return {k: Math.abs(dx) * base.half, sx: Math.sign(dx) || 1, sy: Math.sign(dy) || 1};
    }

    // The largest rectangle of the canvas that nothing covers (CSS pixels)
    function visibleRect(width, height) {
      let area = ctx.visibleArea && ctx.visibleArea();
      if (!area || !area.anyHidden || area.allHidden) return {x: 0, y: 0, width, height};
      let best = largestOpenRect(area.hidden, area.cols, area.rows);
      if (!best) return {x: 0, y: 0, width, height};
      let x = best.c0 * area.cell, y = best.r0 * area.cell;
      return {
        x, y,
        width: Math.min(width, (best.c1 + 1) * area.cell) - x,
        height: Math.min(height, (best.r1 + 1) * area.cell) - y
      };
    }
  }
};

// Bounds of the positions in the layout's store (first three axes)
function layoutBounds(layout) {
  let store = layout && layout.simulator && layout.simulator.store;
  if (!store || !store.pos || !store.n) return null;
  let {pos, D, n} = store;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let i = 0; i < n; ++i) {
    let x = pos[i * D], y = D > 1 ? pos[i * D + 1] : 0;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
    if (D > 2) {
      let z = pos[i * D + 2];
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
  }
  if (minX > maxX) return null;
  return {minX, minY, maxX, maxY, depth: D > 2 && maxZ > minZ ? maxZ - minZ : 0};
}

// The largest all-open rectangle of a grid (1 = covered), by the histogram method: O(cols × rows)
export function largestOpenRect(hidden, cols, rows) {
  let heights = new Int32Array(cols);
  let best = null, bestArea = 0;
  let stack = new Int32Array(cols + 1);
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
