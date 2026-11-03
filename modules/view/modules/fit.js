// fit: keeps the whole layout in view while it moves, inside the part of the canvas the user
// sees (out from under a panel), until the user moves the camera. fit() brings it back.
//
//   const fit = view.use(fitLayout);
//   fit.on(following => button.hidden = following);
//   button.onclick = () => fit.fit();       // or the 0 key on the canvas
//
// - The camera moves with the layout: when the drawing grows it backs off in the same frame
//   (nothing is cut off); when it shrinks it eases in (it snaps when the user prefers reduced
//   motion).
// - Any other camera move stops following: a pan, the wheel, a pinch, keys, a double tap, or
//   reveal() for search and keyboard focus. The module remembers where it left the camera, and
//   a camera that is somewhere else was moved by someone else.
// - It changes only where the camera looks and how far it is, never its angles, so a 3D layout
//   keeps the tilt it has (a 3D layout gets `tilt` the first time it is fitted). It measures the
//   projected corners of the layout's box, so perspective is accounted for.
// - It frames the bulk of the nodes: a few far pieces don't shrink the rest to a dot (`bulk`).
// - With labels on, it leaves room for them beside the outermost nodes (`labelRoom`).
// - In 2D, once the layout settles, it turns the view so the drawing's long side runs along the
//   long side of what shows (`orient`), when that shows it clearly larger: a wide drawing on a
//   tall phone screen stands up. Force layouts have no up, so turning the view loses nothing.

const DEFAULTS = {
  // pixels between the drawing and the edges of what shows
  padding: 24,
  // more pixels at the sides and at the top and bottom while labels are on
  labelRoom: {x: 60, y: 12},
  // closest zoom, in pixels per layout unit, so a graph of a few nodes isn't blown up
  maxScale: 12,
  // share of the way to the target per frame when the camera moves in
  ease: 0.08,
  // frame the box that holds all but `bulk` of the nodes on each side of each axis...
  bulk: 0.01,
  // ...unless the box of every node is at most this much larger
  bulkSlack: 1.3,
  // how the camera leans the first time it fits a 3D layout (radians from straight above, and
  // around the vertical axis); null keeps it as it is
  tilt: {theta: 0.6, phi: 0.5},
  // the key on the canvas that fits again (null: none)
  key: '0',
  // 2D: turn the view to the free area's long side when the layout settles, if the drawing then
  // shows at least this much larger by area (false: never turn)
  orient: 1.25,
  // ms the turn takes (it snaps when the user prefers reduced motion)
  orientTime: 400,
  follow: true
};

export default {
  name: 'fit',
  attach(ctx, options) {
    let settings = {...DEFAULTS, ...options};
    let following = !!settings.follow;
    let pending = following;  // fit at the next frame, without easing
    let mine = null;          // the camera as this module left it
    let easing = false;       // the camera is still on its way in
    let tiltedFor = null;     // the layout the 3D tilt was applied to
    let tilted = false;       // the camera leans because this module leaned it
    let listeners = new Set();
    let canvas = ctx.scene.getDrawContext().canvas;
    let reduced = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
    let watched = null;       // the layout whose 'stable' event this module listens to
    let turning = 0;          // the animation frame of a turn

    ctx.onFrame(change => {
      watch(ctx.layout);
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

    if (settings.key) {
      ctx.input.add({
        name: 'fit',
        priority: 45,
        key(e) {
          if (e.key !== settings.key || e.ctrlKey || e.metaKey || e.altKey) return false;
          api.fit();
          return true;
        }
      });
    }

    let onResize = () => {
      if (!following) return;
      pending = true;
      mine = null;
      ctx.requestFrame();
    };
    window.addEventListener('resize', onResize);

    let api = {
      /** Fits the layout now, and follows it again until the user moves the camera */
      fit() {
        pending = true;
        mine = null;
        setFollowing(true);
        ctx.requestFrame();
      },
      /** Turns following on or off without moving the camera now */
      follow(on) {
        setFollowing(!!on);
        if (on) {
          pending = true;
          mine = null;
          ctx.requestFrame();
        }
      },
      following: () => following,
      /** The key that fits, for help texts */
      key: settings.key,
      /** `fn(following)` runs when following starts or stops. Returns a function that removes it. */
      on(fn) {
        listeners.add(fn);
        return () => listeners.delete(fn);
      },
      dispose() {
        window.removeEventListener('resize', onResize);
        if (turning) cancelAnimationFrame(turning);
        watch(null);
        listeners.clear();
      }
    };
    ctx.provide('fit', api);
    return api;

    // Settling is when the drawing's shape is known: the moment to turn it to the screen
    function watch(layout) {
      if (layout === watched) return;
      if (watched && watched.off) watched.off('stable', onStable);
      watched = layout && layout.on ? layout : null;
      if (watched) watched.on('stable', onStable);
    }

    function onStable(isStable) {
      if (isStable && following && settings.orient) orient();
    }

    // Turns the view (2D) so the drawing's main axis runs along the free area's long side
    function orient() {
      let cam = controls();
      let store = ctx.layout && ctx.layout.simulator && ctx.layout.simulator.store;
      if (!cam || !cam.allowRotation || !store || store.D !== 2 || store.n < 3 || angles().theta > 0.05) return;
      let axis = principalAxis(store);
      if (!axis) return;
      let rect = canvas.getBoundingClientRect();
      let area = ctx.visibleArea && ctx.visibleArea();
      let free = (area && area.largestRect()) || {width: rect.width, height: rect.height};
      if (Math.abs(free.width / free.height - 1) < 0.15) return;
      // The axis on the screen now, and where it should point: down a tall area, across a wide one
      let c = ctx.toScreen(axis.cx, axis.cy, 0), e = ctx.toScreen(axis.cx + axis.ux, axis.cy + axis.uy, 0);
      if (!c || !e) return;
      let now = Math.atan2(e.y - c.y, e.x - c.x);
      let want = free.height > free.width ? Math.PI / 2 : 0;
      let delta = want - now;
      // an axis has no direction: the shortest turn is at most a quarter
      while (delta > Math.PI / 2) delta -= Math.PI;
      while (delta < -Math.PI / 2) delta += Math.PI;
      if (Math.abs(delta) < 0.05) return;
      // Worth it? Compare how large the drawing could show along its axes now and turned
      let scaleNow = Math.min(free.width / axis.extent(now), free.height / axis.extent(now + Math.PI / 2));
      let scaleTurned = Math.min(free.width / axis.extent(want), free.height / axis.extent(want + Math.PI / 2));
      if (!(scaleTurned * scaleTurned >= settings.orient * scaleNow * scaleNow)) return;
      // phi turns the view about the vertical; which way the screen turns is measured, not assumed
      let phi0 = angles().phi;
      cam.rotateByAngle(0.01, 0);
      cam.redraw();
      let e2 = ctx.toScreen(axis.cx + axis.ux, axis.cy + axis.uy, 0), c2 = ctx.toScreen(axis.cx, axis.cy, 0);
      let shift = Math.atan2(e2.y - c2.y, e2.x - c2.x) - now;
      if (shift > Math.PI) shift -= 2 * Math.PI;
      if (shift < -Math.PI) shift += 2 * Math.PI;
      // phi by +0.01 turned the screen by `shift`: the turn in phi that gives `delta` on the screen
      let total = (Math.sign(shift) || 1) * delta;
      let start = performance.now();
      let duration = reduced && reduced.matches ? 0 : settings.orientTime;
      if (turning) cancelAnimationFrame(turning);
      let step = () => {
        turning = 0;
        if (!following) return;
        let t = duration > 0 ? Math.min(1, (performance.now() - start) / duration) : 1;
        let eased = t < 1 ? 1 - Math.pow(1 - t, 3) : 1;
        turnTo(cam, phi0 + total * eased);
        pending = true;
        fitNow(true);
        if (t < 1) turning = requestAnimationFrame(step);
      };
      turnTo(cam, phi0);
      step();
    }

    function turnTo(cam, phi) {
      let now = angles();
      cam.rotateByAngle(phi - now.phi, 0);
      cam.redraw();
    }

    function setFollowing(on) {
      if (on === following) return;
      following = on;
      if (!on) mine = null;
      listeners.forEach(fn => fn(following));
    }

    function controls() {
      return ctx.view.getCamera && ctx.view.getCamera();
    }

    function cameraState() {
      let view = ctx.scene.getDrawContext().view;
      return Array.from(view.position).concat(Array.from(view.center));
    }

    function moved() {
      let now = cameraState();
      let tolerance = 1e-6 * Math.max(1, Math.abs(distance()));
      for (let i = 0; i < now.length; ++i) {
        if (Math.abs(now[i] - mine[i]) > tolerance) return true;
      }
      return false;
    }

    // The camera's distance to the point it looks at
    function distance() {
      let view = ctx.scene.getDrawContext().view;
      let p = view.position, c = view.center;
      return Math.hypot(p[0] - c[0], p[1] - c[1], p[2] - c[2]);
    }

    // The camera's angles: theta from straight above, phi around the vertical axis
    function angles() {
      let view = ctx.scene.getDrawContext().view;
      let p = view.position, c = view.center;
      let x = p[0] - c[0], y = p[1] - c[1], z = p[2] - c[2];
      let r = Math.hypot(x, y, z) || 1;
      return {theta: Math.acos(Math.max(-1, Math.min(1, z / r))), phi: Math.atan2(y, x)};
    }

    // Turns the camera to these angles (when the scene allows rotation)
    function turn(cam, theta, phi) {
      if (!cam.allowRotation || !cam.rotateByAngle) return false;
      let now = angles();
      cam.rotateByAngle(phi - now.phi, theta - now.theta);
      cam.redraw();
      return true;
    }

    // Puts the camera `r` away from `center`, at the angles it has now
    function place(center, r) {
      let cam = controls();
      let view = ctx.scene.getDrawContext().view;
      let now = distance();
      view.center[0] = center[0];
      view.center[1] = center[1];
      view.center[2] = center[2];
      if (now > 0 && Math.abs(r / now - 1) > 1e-9) cam.zoomCenterByScaleFactor(1 - r / now, 0, 0);
      cam.redraw();
    }

    function fitNow(instant) {
      let cam = controls();
      let layout = ctx.layout;
      if (!cam || !layout) return;
      let bounds = layoutBounds(layout, settings.bulk, settings.bulkSlack);
      if (!bounds) return;
      if (bounds.D > 2 && settings.tilt && tiltedFor !== layout) {
        // a 3D layout: lean the camera so depth shows, if it looks straight down
        tiltedFor = layout;
        if (angles().theta < 0.05) tilted = turn(cam, settings.tilt.theta || 0, (settings.tilt.phi || 0) + angles().phi) || tilted;
      } else if (bounds.D <= 2 && tilted) {
        // back to 2D: level the camera this module leaned
        tiltedFor = null;
        tilted = false;
        turn(cam, 0, angles().phi);
      }
      let rect = canvas.getBoundingClientRect();
      let area = ctx.visibleArea && ctx.visibleArea();
      let free = (area && area.largestRect()) || {x: 0, y: 0, width: rect.width, height: rect.height};
      let labels = !!(ctx.view.getModule && ctx.view.getModule('labels'));
      let room = labels && settings.labelRoom ? settings.labelRoom : {x: 0, y: 0};
      // Room around the drawing, and beside it for labels, shrinks with a small screen
      let pad = Math.min(settings.padding, Math.max(8, 0.04 * Math.min(free.width, free.height)));
      let padX = Math.min(pad + Math.min(room.x, 0.08 * free.width), free.width / 4);
      let padY = Math.min(pad + room.y, free.height / 4);
      let target = {
        x: free.x + padX, y: free.y + padY,
        width: Math.max(1, free.width - 2 * padX), height: Math.max(1, free.height - 2 * padY)
      };
      let view = ctx.scene.getDrawContext().view;
      let from = {center: Array.from(view.center), r: distance()};
      let fov = ctx.scene.getDrawContext().fov;
      // pixels per layout unit at the plane through the centre, facing the camera
      let ppu = r => (rect.height / 2) / (r * Math.tan(fov / 2));
      let minR = (rect.height / 2) / (settings.maxScale * Math.tan(fov / 2));

      let center = [(bounds.minX + bounds.maxX) / 2, (bounds.minY + bounds.maxY) / 2, (bounds.minZ + bounds.maxZ) / 2];
      let r = Math.max(from.r, minR);
      place(center, r);
      // The box's corners on the screen decide the distance and where the camera looks. With a
      // camera from straight above this is exact at once; leaning, it converges in a few rounds.
      for (let round = 0; round < 6; ++round) {
        let screen = projectBox(bounds);
        if (!screen) {
          r *= 2;
          place(center, r);
          continue;
        }
        let f = Math.max(screen.width / target.width, screen.height / target.height, 1e-3);
        let newR = Math.max(r * f, minR);
        let k = ppu(r), kNew = ppu(newR);
        let canvasX = rect.width / 2, canvasY = rect.height / 2;
        let dx = (screen.x + screen.width / 2 - canvasX) / k - (target.x + target.width / 2 - canvasX) / kNew;
        let dy = (screen.y + screen.height / 2 - canvasY) / k - (target.y + target.height / 2 - canvasY) / kNew;
        // the camera's right and up, in the scene
        let m = view.cameraWorld;
        center = [
          center[0] + m[0] * dx - m[4] * dy,
          center[1] + m[1] * dx - m[5] * dy,
          center[2] + m[2] * dx - m[6] * dy
        ];
        let done = Math.abs(newR / r - 1) < 2e-3 && Math.abs(dx * kNew) < 0.5 && Math.abs(dy * kNew) < 0.5;
        r = newR;
        place(center, r);
        if (done) break;
      }
      easing = false;
      if (!instant && r < from.r * 0.995 && !(reduced && reduced.matches)) {
        // moving in: ease. Moving out happens at once, so the drawing is never cut off
        let a = settings.ease;
        r = from.r * Math.pow(r / from.r, a);
        center = center.map((value, i) => from.center[i] + (value - from.center[i]) * a);
        place(center, r);
        easing = true;
      }
      mine = cameraState();
      // the frame being drawn used the camera from before: draw once more
      ctx.animate();
    }

    // The screen box of the layout's box corners (CSS pixels), or null when one is behind the camera
    function projectBox(b) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      let zs = b.D > 2 ? [b.minZ, b.maxZ] : [0];
      for (let i = 0; i < 2; ++i) {
        for (let j = 0; j < 2; ++j) {
          for (let k = 0; k < zs.length; ++k) {
            let p = ctx.toScreen(i ? b.maxX : b.minX, j ? b.maxY : b.minY, zs[k]);
            if (!p) return null;
            if (p.x < minX) minX = p.x;
            if (p.x > maxX) maxX = p.x;
            if (p.y < minY) minY = p.y;
            if (p.y > maxY) maxY = p.y;
          }
        }
      }
      return {x: minX, y: minY, width: Math.max(maxX - minX, 1e-3), height: Math.max(maxY - minY, 1e-3)};
    }
  }
};

/**
 * The box to frame: of every node, or, when that is much larger (`slack` times on an axis than
 * the box that leaves out `bulk` of the nodes at each end), of the bulk. First three axes.
 */
export function layoutBounds(layout, bulk = 0, slack = Infinity) {
  let store = layout && layout.simulator && layout.simulator.store;
  if (!store || !store.pos || !store.n) return null;
  let {pos, D, n} = store;
  let dims = Math.min(D, 3);
  let min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < n; ++i) {
    for (let d = 0; d < dims; ++d) {
      let v = pos[i * D + d];
      if (!Number.isFinite(v)) continue;
      if (v < min[d]) min[d] = v;
      if (v > max[d]) max[d] = v;
    }
  }
  if (!(min[0] <= max[0])) return null;
  for (let d = dims; d < 3; ++d) min[d] = max[d] = 0;
  if (bulk > 0 && n >= 50) {
    let trimmed = false;
    let lo = min.slice(), hi = max.slice();
    for (let d = 0; d < dims; ++d) {
      let q = quantiles(pos, D, n, d, min[d], max[d], bulk);
      if (max[d] - min[d] > slack * (q[1] - q[0])) {
        lo[d] = q[0];
        hi[d] = q[1];
        trimmed = true;
      }
    }
    if (trimmed) {
      // a little room past the bulk, so its own edge isn't cut
      for (let d = 0; d < dims; ++d) {
        let extra = (hi[d] - lo[d]) * 0.04;
        min[d] = Math.max(min[d], lo[d] - extra);
        max[d] = Math.min(max[d], hi[d] + extra);
      }
    }
  }
  return {minX: min[0], maxX: max[0], minY: min[1], maxY: max[1], minZ: min[2], maxZ: max[2], D};
}

// The `share` and 1 - `share` quantiles of axis `d`, from a histogram (O(n), no sort)
function quantiles(pos, D, n, d, lo, hi, share) {
  const BINS = 4096;
  if (!(hi > lo)) return [lo, hi];
  let counts = new Uint32Array(BINS);
  let scale = (BINS - 1) / (hi - lo);
  let total = 0;
  for (let i = 0; i < n; ++i) {
    let v = pos[i * D + d];
    if (!Number.isFinite(v)) continue;
    counts[Math.floor((v - lo) * scale)] += 1;
    total += 1;
  }
  let cut = Math.floor(total * share);
  let a = 0, b = BINS - 1;
  for (let seen = 0; a < BINS - 1; ++a) {
    seen += counts[a];
    if (seen > cut) break;
  }
  for (let seen = 0; b > 0; --b) {
    seen += counts[b];
    if (seen > cut) break;
  }
  return [lo + a / scale, lo + (b + 1) / scale];
}

// The main axis of a 2D layout: its centre, unit direction, and extent(angle on the screen) giving
// the width of the drawing along a screen direction once the axis points at angle 0. Null when
// the drawing is round.
function principalAxis(store) {
  let {pos, D, n} = store;
  let mx = 0, my = 0, count = 0;
  for (let i = 0; i < n; ++i) {
    let x = pos[i * D], y = pos[i * D + 1];
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    mx += x; my += y; count += 1;
  }
  if (count < 3) return null;
  mx /= count; my /= count;
  let xx = 0, yy = 0, xy = 0;
  for (let i = 0; i < n; ++i) {
    let x = pos[i * D] - mx, y = pos[i * D + 1] - my;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    xx += x * x; yy += y * y; xy += x * y;
  }
  let angle = 0.5 * Math.atan2(2 * xy, xx - yy);
  let ux = Math.cos(angle), uy = Math.sin(angle);
  // extents along the axis (a) and across it (b), from the 1st to the 99th percentile
  let along = [], across = [];
  let stride = Math.max(1, Math.floor(n / 5000));
  for (let i = 0; i < n; i += stride) {
    let x = pos[i * D] - mx, y = pos[i * D + 1] - my;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    along.push(x * ux + y * uy);
    across.push(-x * uy + y * ux);
  }
  let spread = values => {
    values.sort((p, q) => p - q);
    let k = Math.floor(values.length * 0.01);
    return Math.max(1e-6, values[values.length - 1 - k] - values[k]);
  };
  let a = spread(along), b = spread(across);
  return {
    cx: mx, cy: my, ux, uy,
    // the drawing's width along a screen direction at `angle` from where the axis points
    extent: theta => Math.abs(a * Math.cos(theta)) + Math.abs(b * Math.sin(theta))
  };
}
