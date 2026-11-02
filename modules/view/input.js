// Pointer, wheel and key input on the view's canvas, shared by the camera and the modules.
//
// Every pointer has one owner, decided when it goes down: handlers are asked in priority order
// (lower first) whether they want it, with the node under it at hand; the camera, last, takes the
// rest. So one finger can drag a node while two others move the camera.
//
// A press stays undecided until it moves past a small distance (then the owner gets dragstart,
// drag, dragend) or lifts (then it is a tap, offered to everyone). A long press is offered to
// everyone while the press is undecided; a handler that takes it becomes the owner. Taps fire on
// release, at once: a double tap doesn't make single taps wait.
//
// A handler is an object with any of:
//   priority          lower is asked first (default 100; the camera is last)
//   press(p)          claim pointer `p`? Must not change anything: it is also asked for the cursor
//   down(p)           the claimed pointer went down
//   dragstart(p)      `p` moved past the drag distance; return false to pass it on to the next handler
//   drag(p), dragend(p)
//   up(p)             `p` lifted before it moved (a tap may follow)
//   cancel(p)         the gesture is over without an end: pointercancel, lost capture, blur, Escape...
//   longpress(p)      return true to take `p` (the previous owner gets cancel)
//   tap(e), doubletap(e), contextmenu(e), twofingertap(e)   return true to stop the others
//   hover(point)      a mouse or pen moved with no button down (null: it left)
//   wheel(w), key(e), keyup(e), blur()
//   cursor            the cursor to show where this handler would claim a press

const PENDING = 0, DRAGGING = 1, CANCELLED = 2, DONE = 3;

const DEFAULTS = {
  // Pixels a press moves before it is a drag
  dragDistance: {mouse: 3, pen: 6, touch: 10},
  doubleTapTime: 300,
  doubleTapDistance: {mouse: 10, pen: 30, touch: 30},
  longPressTime: 500,
  twoFingerTapTime: 400
};

/**
 * `canvas`: the element to listen on.
 * `options`:
 * - `pick(x, y, pointer)`: the hit under a canvas point (CSS pixels), or null;
 * - `emit(name, event)`: give an event to the app's listeners first;
 * - `hasListeners(name)`: whether the app listens to `name`;
 * - `scenePoint(x, y)`: the point of the scene under a canvas point;
 * - `onPress()`: a pointer or the wheel started (the camera stops its inertia);
 * - `settings`: thresholds (DEFAULTS above);
 * - `env`: {window, document, now, setTimeout, clearTimeout} for tests.
 */
export function createInput(canvas, options) {
  let env = options.env || defaultEnv();
  let settings = mergeSettings(options.settings);
  let handlers = [];
  let pointers = new Map();
  let lastTap = null;
  // Pointers pressed together: none of them taps, two quick touches are a two-finger tap
  let group = null;
  let hover = null;
  let sequence = 0;

  let savedStyle = prepareCanvas(canvas);
  let addedTabIndex = false;
  if (canvas.setAttribute && !canvas.hasAttribute('tabindex')) {
    canvas.setAttribute('tabindex', '0');
    addedTabIndex = true;
  }

  let listeners = [
    [canvas, 'pointerdown', onPointerDown],
    [canvas, 'pointermove', onPointerMove],
    [canvas, 'pointerup', onPointerUp],
    [canvas, 'pointercancel', onPointerCancel],
    [canvas, 'lostpointercapture', onPointerCancel],
    [canvas, 'pointerleave', onPointerLeave],
    [canvas, 'wheel', onWheel, {passive: false}],
    [canvas, 'contextmenu', preventDefault],
    // Safari's own pinch zoom of the page
    [canvas, 'gesturestart', preventDefault],
    [canvas, 'keydown', onKeyDown],
    [canvas, 'keyup', onKeyUp],
    [canvas, 'blur', onBlur],
    [env.window, 'blur', onWindowBlur],
    [env.document, 'visibilitychange', onVisibilityChange]
  ];
  listeners.forEach(([target, name, fn, opts]) => target && target.addEventListener(name, fn, opts));

  return {
    add,
    remove,
    cancel,
    cancelAll,
    /** True while any pointer drags (a node, the camera, a box...) */
    dragging() {
      for (let p of pointers.values()) if (p.state === DRAGGING) return true;
      return false;
    },
    /** True while any pointer is down */
    busy: () => pointers.size > 0,
    /** The last mouse or pen position with no button down, or null */
    hoverPoint: () => hover,
    /**
     * A tap that came from somewhere else than a pointer (a key): the app's listeners, then the
     * handlers, see it like any tap. `hit` is {node, row, ...}.
     */
    tap(hit, fields) {
      let e = new ViewEvent('tap', hit, fields);
      return dispatch('tap', e, true);
    },
    /** The first handler (not the camera) that would claim a press like `p`, or null */
    claimant(p) {
      for (let h of handlers) {
        if (h.priority === Infinity) continue;
        if (h.press && h.press(p)) return h;
      }
      return null;
    },
    settings,
    dispose
  };

  function add(handler) {
    if (!handler || typeof handler !== 'object') throw new Error('input.add() needs a handler object');
    if (handler.priority === undefined) handler.priority = 100;
    handler.order = sequence++;
    handlers.push(handler);
    handlers.sort((a, b) => (a.priority - b.priority) || (a.order - b.order));
    return () => remove(handler);
  }

  function remove(handler) {
    let index = handlers.indexOf(handler);
    if (index < 0) return;
    // Its pointers end here
    pointers.forEach(p => {
      if (p.owner !== handler) return;
      if (p.state === PENDING || p.state === DRAGGING) call(handler, 'cancel', p);
      p.owner = null;
      p.state = CANCELLED;
    });
    handlers.splice(index, 1);
  }

  /** Ends the gesture of a pointer: its owner gets cancel(), and the pointer is ignored until it lifts */
  function cancel(pointerId) {
    let p = pointers.get(pointerId);
    if (!p || p.state === CANCELLED) return;
    clearLongPress(p);
    let owner = p.owner;
    p.state = CANCELLED;
    if (group) group.cancelled = true;
    if (owner) call(owner, 'cancel', p);
  }

  function cancelAll() {
    Array.from(pointers.keys()).forEach(cancel);
  }

  function onPointerDown(e) {
    // Another button of a mouse that is already down, or the back and forward buttons
    if (pointers.has(e.pointerId) || e.button > 2) return;
    if (options.onPress) options.onPress();
    if (e.isTrusted && canvas.setPointerCapture) {
      try { canvas.setPointerCapture(e.pointerId); } catch (_) { /* the pointer is gone already */ }
    }
    if (canvas.focus && env.document && env.document.activeElement !== canvas) {
      canvas.focus({preventScroll: true});
    }

    let p = new Pointer(e, local(e), env.now(), options.pick);
    if (!pointers.size || !group) group = {start: p.downTime, count: 0, touch: true, moved: false, cancelled: false, x: 0, y: 0, clientX: 0, clientY: 0};
    if (pointers.size) {
      p.multi = true;
      pointers.forEach(q => { q.multi = true; clearLongPress(q); });
    }
    group.count += 1;
    group.x += p.downX; group.y += p.downY;
    group.clientX += p.downClientX; group.clientY += p.downClientY;
    if (p.pointerType !== 'touch') group.touch = false;
    pointers.set(p.id, p);

    offer(p, 0);
    if (p.owner) call(p.owner, 'down', p);
    if (!p.multi && wantsLongPress()) {
      p.timer = env.setTimeout(() => longPress(p), settings.longPressTime);
    }
  }

  function onPointerMove(e) {
    let p = pointers.get(e.pointerId);
    if (!p) {
      if (e.pointerType !== 'touch' && !e.buttons) hoverAt(e);
      return;
    }
    if (p.state === CANCELLED) return;
    if (p.pointerType === 'mouse' && e.buttons === 0) {
      // The button went up where we couldn't see it (outside the window)
      finish(p, true);
      return;
    }
    p.update(e, local(e));
    if (p.state === PENDING) {
      if (Math.hypot(p.x - p.downX, p.y - p.downY) > distanceFor(settings.dragDistance, p.pointerType)) {
        clearLongPress(p);
        if (group) group.moved = true;
        startDrag(p);
      }
    } else if (p.state === DRAGGING && p.owner) {
      call(p.owner, 'drag', p);
    }
  }

  function onPointerUp(e) {
    let p = pointers.get(e.pointerId);
    if (!p) return;
    if (p.state !== CANCELLED) p.update(e, local(e));
    finish(p, false);
    if (e.pointerType !== 'touch') hoverAt(e);
  }

  function onPointerCancel(e) {
    let p = pointers.get(e.pointerId);
    if (p) finish(p, true);
  }

  function onPointerLeave(e) {
    if (e.pointerType === 'touch' || pointers.has(e.pointerId)) return;
    setHover(null);
  }

  function finish(p, cancelled) {
    clearLongPress(p);
    pointers.delete(p.id);
    let owner = p.owner;
    if (p.state === DRAGGING) {
      if (owner) call(owner, cancelled ? 'cancel' : 'dragend', p);
    } else if (p.state === PENDING) {
      if (cancelled) {
        if (owner) call(owner, 'cancel', p);
      } else {
        if (owner) call(owner, 'up', p);
        if (!p.multi && !p.longPressed) tapped(p);
      }
    }
    if (cancelled && group) group.cancelled = true;
    p.state = DONE;
    if (!pointers.size && group) {
      let g = group;
      group = null;
      if (g.count === 2 && g.touch && !g.moved && !g.cancelled && env.now() - g.start <= settings.twoFingerTapTime) {
        let e = new ViewEvent('twofingertap', null, {
          x: g.x / 2, y: g.y / 2, clientX: g.clientX / 2, clientY: g.clientY / 2,
          pointerType: 'touch', originalEvent: p.event
        });
        dispatch('twofingertap', e, false);
      }
    }
  }

  // Asks handlers from `from` on whether they want `p`
  function offer(p, from) {
    for (let i = from; i < handlers.length; ++i) {
      let h = handlers[i];
      if (h.press && h.press(p)) {
        p.owner = h;
        return true;
      }
    }
    p.owner = null;
    return false;
  }

  function startDrag(p) {
    p.state = DRAGGING;
    while (p.owner) {
      let owner = p.owner;
      if (!owner.dragstart || owner.dragstart(p) !== false) {
        // The owner sees the whole move since the press
        if (p.owner === owner && p.state === DRAGGING) call(owner, 'drag', p);
        return;
      }
      offer(p, handlers.indexOf(owner) + 1);
      if (p.owner) call(p.owner, 'down', p);
    }
  }

  function wantsLongPress() {
    if (options.hasListeners && options.hasListeners('longpress')) return true;
    return handlers.some(h => h.longpress);
  }

  function longPress(p) {
    p.timer = 0;
    if (p.state !== PENDING || p.multi || pointers.get(p.id) !== p) return;
    let e = makeEvent('longpress', p);
    let listened = options.hasListeners && options.hasListeners('longpress');
    if (options.emit) options.emit('longpress', e);
    if (e.defaultPrevented) {
      p.longPressed = true;
      return;
    }
    for (let h of handlers.slice()) {
      if (!h.longpress || !h.longpress(p)) continue;
      if (p.owner && p.owner !== h) call(p.owner, 'cancel', p);
      p.owner = h;
      p.longPressed = true;
      return;
    }
    // Someone saw it: the release is not a tap
    if (listened) p.longPressed = true;
  }

  function clearLongPress(p) {
    if (!p.timer) return;
    env.clearTimeout(p.timer);
    p.timer = 0;
  }

  function tapped(p) {
    if (p.button === 1) return;
    if (p.button === 2) {
      dispatch('contextmenu', makeEvent('contextmenu', p), true);
      return;
    }
    let time = env.now();
    let near = lastTap && lastTap.pointerType === p.pointerType &&
      time - lastTap.time <= settings.doubleTapTime &&
      Math.hypot(p.downX - lastTap.x, p.downY - lastTap.y) <= distanceFor(settings.doubleTapDistance, p.pointerType);
    let count = near ? lastTap.count + 1 : 1;
    lastTap = {time, x: p.downX, y: p.downY, count, pointerType: p.pointerType};

    let tap = makeEvent('tap', p);
    tap.count = count;
    dispatch('tap', tap, true);
    if (count === 2) {
      let double = makeEvent('doubletap', p);
      double.count = 2;
      dispatch('doubletap', double, true);
    }
  }

  // The app's listeners first (they can prevent the rest), then handlers until one returns true
  function dispatch(name, e, toApp) {
    if (toApp && options.emit) options.emit(name, e);
    if (e.defaultPrevented) return e;
    for (let h of handlers.slice()) {
      if (h[name] && h[name](e) === true) break;
    }
    return e;
  }

  function makeEvent(type, p) {
    let hit = p.hit;
    return new ViewEvent(type, hit, {
      x: p.downX, y: p.downY, clientX: p.downClientX, clientY: p.downClientY,
      scene: options.scenePoint ? options.scenePoint(p.downX, p.downY) : null,
      pointerType: p.pointerType, pointerId: p.id, button: p.button,
      shiftKey: p.shiftKey, altKey: p.altKey, ctrlKey: p.ctrlKey, metaKey: p.metaKey,
      originalEvent: p.event
    });
  }

  function hoverAt(e) {
    if (e.pointerType === 'touch') return;
    let point = local(e);
    setHover({
      x: point.x, y: point.y, clientX: e.clientX, clientY: e.clientY,
      pointerType: e.pointerType || 'mouse', width: e.width || 1,
      shiftKey: e.shiftKey, altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
      originalEvent: e
    });
  }

  function setHover(point) {
    if (!point && !hover) return;
    hover = point;
    for (let h of handlers.slice()) if (h.hover) h.hover(point);
  }

  function onWheel(e) {
    // Firefox turns line deltas into pixels only if the deltas are read first: read the mode first
    let mode = e.deltaMode;
    let scale = mode === 1 ? 25 : mode === 2 ? (canvas.clientHeight || 800) : 1;
    let point = local(e);
    e.preventDefault();
    if (options.onPress) options.onPress();
    let wheel = {
      deltaX: e.deltaX * scale, deltaY: e.deltaY * scale,
      x: point.x, y: point.y, clientX: e.clientX, clientY: e.clientY,
      shiftKey: e.shiftKey, altKey: e.altKey, ctrlKey: e.ctrlKey, metaKey: e.metaKey,
      originalEvent: e
    };
    for (let h of handlers.slice()) {
      if (h.wheel && h.wheel(wheel) === true) break;
    }
  }

  function onKeyDown(e) {
    if (e.isComposing || e.key === 'Tab') return;
    for (let h of handlers.slice()) {
      if (h.key && h.key(e) === true) {
        e.preventDefault();
        return;
      }
    }
  }

  function onKeyUp(e) {
    for (let h of handlers.slice()) if (h.keyup) h.keyup(e);
  }

  function onBlur() {
    for (let h of handlers.slice()) if (h.blur) h.blur();
  }

  function onWindowBlur() {
    cancelAll();
    onBlur();
  }

  function onVisibilityChange() {
    if (env.document.visibilityState === 'hidden') onWindowBlur();
  }

  function local(e) {
    let rect = canvas.getBoundingClientRect();
    return {x: e.clientX - rect.left, y: e.clientY - rect.top};
  }

  function dispose() {
    cancelAll();
    listeners.forEach(([target, name, fn, opts]) => target && target.removeEventListener(name, fn, opts));
    restoreCanvas(canvas, savedStyle);
    if (addedTabIndex) canvas.removeAttribute('tabindex');
    handlers = [];
    hover = null;
  }
}

/** An event for the app and the handlers. `node` is null on the background. */
export class ViewEvent {
  constructor(type, hit, fields) {
    this.type = type;
    this.node = hit ? hit.node : null;
    this.id = hit ? hit.node.id : undefined;
    this.row = hit ? hit.row : -1;
    this.hit = hit || null;
    this.count = 1;
    this.defaultPrevented = false;
    Object.assign(this, fields);
  }
  preventDefault() {
    this.defaultPrevented = true;
  }
}

class Pointer {
  constructor(e, point, time, pick) {
    this.id = e.pointerId;
    // From pointerdown: since Safari 18.2 later events of a touch may say 'mouse' (WebKit bug 282988)
    this.pointerType = e.pointerType || 'mouse';
    this.button = e.button;
    this.downX = this.x = point.x;
    this.downY = this.y = point.y;
    this.downClientX = this.clientX = e.clientX;
    this.downClientY = this.clientY = e.clientY;
    this.width = e.width || 1;
    this.height = e.height || 1;
    this.downTime = time;
    this.state = PENDING;
    this.owner = null;
    this.multi = false;
    this.longPressed = false;
    this.timer = 0;
    this.event = e;
    this.shiftKey = !!e.shiftKey;
    this.altKey = !!e.altKey;
    this.ctrlKey = !!e.ctrlKey;
    this.metaKey = !!e.metaKey;
    this._pick = pick;
    this._hit = undefined;
  }

  /** What is under the press (picked once, when first asked) */
  get hit() {
    if (this._hit === undefined) this._hit = (this._pick && this._pick(this.downX, this.downY, this)) || null;
    return this._hit;
  }

  get node() {
    let hit = this.hit;
    return hit ? hit.node : null;
  }

  get dragging() {
    return this.state === DRAGGING;
  }

  update(e, point) {
    this.x = point.x;
    this.y = point.y;
    this.clientX = e.clientX;
    this.clientY = e.clientY;
    this.shiftKey = !!e.shiftKey;
    this.altKey = !!e.altKey;
    this.ctrlKey = !!e.ctrlKey;
    this.metaKey = !!e.metaKey;
    this.event = e;
  }
}

function call(handler, name, p) {
  if (handler[name]) handler[name](p);
}

function distanceFor(table, pointerType) {
  return table[pointerType] !== undefined ? table[pointerType] : table.mouse;
}

function preventDefault(e) {
  e.preventDefault();
}

function mergeSettings(custom = {}) {
  let settings = {...DEFAULTS, ...custom};
  settings.dragDistance = {...DEFAULTS.dragDistance, ...(custom.dragDistance || {})};
  settings.doubleTapDistance = {...DEFAULTS.doubleTapDistance, ...(custom.doubleTapDistance || {})};
  return settings;
}

const CANVAS_STYLE = {
  // Read when a gesture starts, so it can't be set during a press
  touchAction: 'none',
  userSelect: 'none',
  webkitUserSelect: 'none',
  webkitTouchCallout: 'none',
  webkitTapHighlightColor: 'transparent'
};

function prepareCanvas(canvas) {
  let saved = {};
  if (!canvas.style) return saved;
  Object.keys(CANVAS_STYLE).forEach(name => {
    saved[name] = canvas.style[name];
    canvas.style[name] = CANVAS_STYLE[name];
  });
  return saved;
}

function restoreCanvas(canvas, saved) {
  if (!canvas.style) return;
  Object.keys(saved).forEach(name => { canvas.style[name] = saved[name] || ''; });
}

function defaultEnv() {
  return {
    window: typeof window !== 'undefined' ? window : null,
    document: typeof document !== 'undefined' ? document : null,
    now: () => performance.now(),
    setTimeout: (fn, ms) => setTimeout(fn, ms),
    clearTimeout: handle => clearTimeout(handle)
  };
}
