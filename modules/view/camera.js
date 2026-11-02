// The camera as an input handler: pointers nobody else claimed pan, zoom and rotate it, and so do
// the wheel and keys. The camera itself stays w-gl's map controls (its pan, zoom about a point,
// rotation and inertia); only their mouse, touch and keyboard listeners are replaced. The controls
// listen on a detached element, so they never see an event, and this handler drives them.
import {mapControls} from 'w-gl';

const DEFAULTS = {
  // 'zoom': the wheel zooms about the pointer. 'pan': it pans, and pinch or Cmd/Ctrl + wheel zooms.
  wheel: 'zoom',
  // Rotation and tilt (where the scene allows rotation): right or Alt drag, two-finger twist and tilt
  rotate: true,
  doubleTapZoom: true,
  twoFingerTapZoom: true,
  inertia: true,
  keys: true,
  // Pixels of arc two fingers turn before the camera rotates
  rotateArc: 25
};

const KEYS = {
  ArrowLeft: 'left', KeyA: 'left',
  ArrowRight: 'right', KeyD: 'right',
  ArrowUp: 'up', KeyW: 'up',
  ArrowDown: 'down', KeyS: 'down',
  Equal: 'in', NumpadAdd: 'in', '+': 'in', '=': 'in',
  Minus: 'out', NumpadSubtract: 'out', '-': 'out', '_': 'out',
  KeyQ: 'turnRight', KeyE: 'turnLeft',
  KeyR: 'tiltUp', KeyF: 'tiltDown'
};
const ROTATING = {turnRight: true, turnLeft: true, tiltUp: true, tiltDown: true};

/**
 * Takes over camera input of `scene`. Returns {handler, stop, dispose}: add `handler` to the
 * input, `stop()` stops the inertia, and `dispose()` gives the scene back its own controls.
 */
export function createCamera(scene, options = {}, env = {}) {
  let settings = {...DEFAULTS, ...options};
  let raf = env.requestAnimationFrame || (fn => requestAnimationFrame(fn));
  let cancelRaf = env.cancelAnimationFrame || (handle => cancelAnimationFrame(handle));
  let detached = document.createElement('div');
  let proxy = Object.create(scene);
  proxy.getOptions = () => Object.assign({}, scene.getOptions(), {inputTarget: detached});
  let controls = install(scene, proxy);

  let canRotate = !!(settings.rotate && controls.allowRotation);
  let canTwist = canRotate && controls.allowPinchRotation;

  // Pointers this camera owns, in the order they went down: id -> {p, x, y} (client coordinates
  // the last time the camera moved for them)
  let owned = new Map();
  let mode = null;      // one pointer: 'pan' or 'rotate'
  let pinch = null;     // two or more: what the fingers do
  let pinched = false;  // a pinch happened since the first pointer went down: no inertia after it

  let held = new Map(); // key code -> action
  let keyFrame = 0;
  let motion = {x: 0, y: 0, turn: 0, tilt: 0, zoom: 0};

  let handler = {
    name: 'camera',
    priority: Infinity,
    press: p => p.button >= 0 && p.button <= 2,
    down(p) {
      owned.set(p.id, {p, x: p.clientX, y: p.clientY});
      if (owned.size >= 2) {
        pinched = true;
        controls.panAnimation.cancel();
        pinch = null;
      }
    },
    dragstart(p) {
      if (owned.size === 1) {
        let rotate = canRotate && p.pointerType !== 'touch' && (p.button === 2 || p.altKey);
        mode = rotate ? 'rotate' : 'pan';
        stop();
        if (settings.inertia) (rotate ? controls.rotateAnimation : controls.panAnimation).start();
      }
    },
    drag: move,
    dragend: p => release(p, false),
    up: p => release(p, true),
    cancel: p => release(p, true),
    wheel,
    doubletap(e) {
      // Two quick Shift or Cmd taps add and toggle selection: they don't zoom
      if (!settings.doubleTapZoom || e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return false;
      controls.zoomToClientCoordinates(e.clientX, e.clientY, 0.5, true);
      return true;
    },
    twofingertap(e) {
      if (!settings.twoFingerTapZoom) return false;
      controls.zoomToClientCoordinates(e.clientX, e.clientY, -1, true);
      return true;
    },
    key,
    keyup,
    blur: releaseKeys
  };

  return {handler, stop, dispose, controls};

  function stop() {
    controls.panAnimation.cancel();
    controls.rotateAnimation.cancel();
  }

  function move() {
    if (owned.size === 1) {
      let only = owned.values().next().value;
      let dx = only.p.clientX - only.x, dy = only.p.clientY - only.y;
      only.x = only.p.clientX;
      only.y = only.p.clientY;
      if (!dx && !dy) return;
      if (mode === 'rotate') controls.rotateByAbsoluteOffset(dx, dy);
      else controls.panByAbsoluteOffset(dx, dy);
      controls.redraw();
      return;
    }
    let iterator = owned.values();
    let a = iterator.next().value, b = iterator.next().value;
    let ax = a.p.clientX, ay = a.p.clientY, bx = b.p.clientX, by = b.p.clientY;
    if (!pinch) pinch = {state: 'unknown', turned: 0, ax: a.x, ay: a.y, bx: b.x, by: b.y};

    let before = Math.hypot(b.x - a.x, b.y - a.y), after = Math.hypot(bx - ax, by - ay);
    let turn = Math.atan2(by - ay, bx - ax) - Math.atan2(b.y - a.y, b.x - a.x);
    if (turn > Math.PI) turn -= 2 * Math.PI;
    if (turn < -Math.PI) turn += 2 * Math.PI;
    pinch.turned += turn;
    classify(ax, ay, bx, by, after);

    let cx = (ax + bx) / 2, cy = (ay + by) / 2;
    if (pinch.state === 'tilt') {
      controls.rotateByAbsoluteOffset(0, ((ay - a.y) + (by - b.y)) / 2);
      controls.redraw();
    } else {
      if (pinch.state === 'turn') controls.rotateByAngle(turn, 0);
      controls.panByAbsoluteOffset(cx - (a.x + b.x) / 2, cy - (a.y + b.y) / 2);
      controls.redraw();
      // Zoom about the fingers' centre: the distance between them scales the view exactly
      if (before > 0 && after > 0) controls.zoomToClientCoordinates(cx, cy, 1 - before / after);
    }
    owned.forEach(state => {
      state.x = state.p.clientX;
      state.y = state.p.clientY;
    });
  }

  // Two fingers either turn (after `rotateArc` pixels of arc; they also zoom then), tilt (both move
  // up or down together while level), or just pinch and pan
  function classify(ax, ay, bx, by, distance) {
    if (pinch.state !== 'unknown' || !canRotate) return;
    if (canTwist && Math.abs(pinch.turned) * distance / 2 > settings.rotateArc) {
      pinch.state = 'turn';
      return;
    }
    let level = Math.abs(Math.atan2(pinch.by - pinch.ay, pinch.bx - pinch.ax));
    level = Math.min(level, Math.PI - level);
    let va = ay - pinch.ay, vb = by - pinch.by;
    let sideways = Math.abs(ax - pinch.ax) + Math.abs(bx - pinch.bx);
    if (level < Math.PI / 3 && va * vb > 0 && Math.abs(va + vb) > 42 && sideways < 20) {
      pinch.state = 'tilt';
    }
  }

  function release(p, abrupt) {
    if (!owned.delete(p.id)) return;
    pinch = null;
    if (owned.size) return;
    if (mode && settings.inertia && !abrupt && !pinched) {
      (mode === 'rotate' ? controls.rotateAnimation : controls.panAnimation).stop();
    } else {
      stop();
    }
    mode = null;
    pinched = false;
  }

  function wheel(w) {
    stop();
    if (settings.wheel === 'pan' && !w.ctrlKey && !w.metaKey) {
      controls.panByAbsoluteOffset(-w.deltaX, -w.deltaY);
      controls.redraw();
      return true;
    }
    // Ctrl + wheel is a trackpad pinch in Chrome, Firefox and Safari: small deltas, finer steps
    let change = w.deltaY * (w.ctrlKey ? 0.01 : 0.002);
    change = Math.max(-0.5, Math.min(0.5, change));
    if (change) controls.zoomToClientCoordinates(w.clientX, w.clientY, 1 - Math.exp(change));
    return true;
  }

  function key(e) {
    if (!settings.keys || e.ctrlKey || e.metaKey || e.altKey) return false;
    let action = KEYS[e.code] || KEYS[e.key];
    if (!action || (ROTATING[action] && !canRotate)) return false;
    held.set(e.code || e.key, action);
    startKeys();
    return true;
  }

  function keyup(e) {
    // macOS drops other keys' keyup while Cmd is down
    if (e.key === 'Meta') held.clear();
    else held.delete(e.code || e.key);
  }

  function releaseKeys() {
    held.clear();
  }

  // Held keys move the camera with the same easing as w-gl's keyboard controls
  function startKeys() {
    if (!keyFrame) keyFrame = raf(keyStep);
  }

  function keyStep() {
    keyFrame = 0;
    let wants = {left: 0, right: 0, up: 0, down: 0, in: 0, out: 0, turnLeft: 0, turnRight: 0, tiltUp: 0, tiltDown: 0};
    held.forEach(action => { wants[action] = 1; });
    motion.x = settle(motion.x * 0.9 + wants.left - wants.right, 0.5);
    motion.y = settle(motion.y * 0.9 + wants.up - wants.down, 0.5);
    motion.turn = settle(motion.turn * 0.9 + (wants.turnLeft - wants.turnRight) / 2, Math.PI / 360);
    motion.tilt = settle(motion.tilt * 0.9 + (wants.tiltUp - wants.tiltDown) / 6, Math.PI / 360);
    motion.zoom = settle(motion.zoom * 0.7 + wants.in - wants.out, 0.5);
    let moved = false;
    if (motion.x || motion.y) {
      controls.panByAbsoluteOffset(motion.x, motion.y);
      moved = true;
    }
    if (motion.turn || motion.tilt) {
      controls.rotateByAbsoluteOffset(motion.turn, motion.tilt);
      moved = true;
    }
    if (motion.zoom) {
      controls.zoomCenterByScaleFactor(Math.sign(motion.zoom) * 0.025, 0, 0);
      moved = true;
    }
    if (moved) {
      controls.redraw();
      startKeys();
    }
  }

  function dispose() {
    stop();
    if (keyFrame) cancelRaf(keyFrame);
    keyFrame = 0;
    owned.clear();
    held.clear();
    install(scene, scene);
  }
}

// New map controls for `scene`, made through `sceneLike`, that keep the camera where it is.
// Map controls start at distance 1 from the centre; setViewBox() takes the distance from the
// camera's position instead.
function install(scene, sceneLike) {
  let view = scene.getDrawContext().view;
  let position = [view.position[0], view.position[1], view.position[2]];
  scene.setCameraController(() => mapControls(sceneLike));
  let controls = scene.getCameraController();
  view.position[0] = position[0];
  view.position[1] = position[1];
  view.position[2] = position[2];
  controls.setViewBox();
  return controls;
}

function settle(value, threshold) {
  return Math.abs(value) < threshold ? 0 : value;
}
