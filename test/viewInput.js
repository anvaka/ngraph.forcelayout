var test = require('tap').test;
var createGraph = require('ngraph.graph');

// modules/view is an ES module; these parts run without WebGL or a DOM
var math = import('../modules/view/math.js');
var pick = import('../modules/view/pick.js');
var flags = import('../modules/view/flags.js');
var input = import('../modules/view/input.js');
var select = import('../modules/view/modules/select.js');
var inspect = import('../modules/view/modules/inspect.js');
var navigate = import('../modules/view/modules/navigate.js');
var search = import('../modules/view/modules/search.js');

// A camera 100 units above the origin, looking down, 90° field of view, on an 800 x 600 canvas:
// the plane z = 0 shows 3 CSS pixels per unit, and the origin is at (400, 300).
function topDown(m, distance) {
  var near = 0.01, aspect = 800 / 600;
  var projection = new Float64Array(16);
  projection[0] = 1 / aspect; projection[5] = 1; projection[10] = -1; projection[11] = -1; projection[14] = -2 * near;
  var view = identity();
  view[14] = -(distance || 100);
  return m.createProjector().set(projection, view, identity(), 800, 600);
}

function identity() {
  var out = new Float64Array(16);
  out[0] = out[5] = out[10] = out[15] = 1;
  return out;
}

function state(projector, pos, D, sizes) {
  var maxSize = 0;
  for (var i = 0; i < sizes.length; ++i) maxSize = Math.max(maxSize, sizes[i]);
  return {pos: new Float64Array(pos), D: D, count: sizes.length, sizes: new Float32Array(sizes), maxSize: maxSize, projector: projector};
}

test('projector maps the scene to canvas pixels and back', function (t) {
  return math.then(function (m) {
    var p = topDown(m);
    var out = {x: 0, y: 0, w: 0};
    t.ok(p.toScreen(10, 5, 0, out));
    t.ok(Math.abs(out.x - 430) < 1e-6 && Math.abs(out.y - 285) < 1e-6, 'x right, y up');
    t.ok(Math.abs(p.pixelsPerUnit(out.w) - 3) < 1e-6, '3 pixels per unit');
    var back = [0, 0, 0];
    t.ok(p.onPlane(430, 285, m.ORIGIN, m.Z_NORMAL, back));
    t.ok(Math.abs(back[0] - 10) < 1e-6 && Math.abs(back[1] - 5) < 1e-6 && Math.abs(back[2]) < 1e-9, 'back on the plane');
    var forward = [0, 0, 0];
    t.ok(p.forward(forward));
    t.ok(Math.abs(forward[2] + 1) < 1e-9, 'looks down');
    // Behind the camera
    t.notOk(p.toScreen(0, 0, 200, out));
  });
});

test('pickNode: inside a disc, within reach, out of reach', function (t) {
  return Promise.all([math, pick]).then(function (mods) {
    var p = topDown(mods[0]);
    // Two nodes of diameter 2 (radius 3 px) at x = 0 and x = 20 (60 px apart)
    var s = state(p, [0, 0, 20, 0], 2, [2, 2]);
    var hit = mods[1].pickNode(s, 400, 300, 8);
    t.equal(hit.row, 0);
    t.ok(hit.inside, 'on the disc');
    t.equal(hit.distance, 0);

    hit = mods[1].pickNode(s, 400 + 3 + 5, 300, 8);
    t.equal(hit.row, 0, '5 px from the edge is within reach');
    t.notOk(hit.inside);
    t.ok(Math.abs(hit.distance - 5) < 1e-6);

    t.equal(mods[1].pickNode(s, 400 + 3 + 9, 300, 8), null, '9 px is out of reach');
    t.equal(mods[1].pickNode(s, 455, 300, 8).row, 1, 'nearest edge wins');
  });
});

test('pickNode: overlaps go to the node drawn last in 2D, the nearest in 3D, the hovered first', function (t) {
  return Promise.all([math, pick]).then(function (mods) {
    var p = topDown(mods[0]);
    var s = state(p, [0, 0, 0.5, 0], 2, [4, 4]);
    t.equal(mods[1].pickNode(s, 400, 300, 8).row, 1, 'drawn last');
    t.equal(mods[1].pickNode(s, 400, 300, 8, 0, 4).row, 0, 'the hovered one');

    // 3D: row 0 is nearer the camera (z = 10)
    var s3 = state(p, [0, 0, 10, 0.5, 0, 0], 3, [4, 4]);
    t.equal(mods[1].pickNode(s3, 400, 300, 8).row, 0, 'nearest');

    // A pointer 8.5 px from row 0's edge (and 15.5 px from row 1's), with a reach of 8
    var sticky = state(p, [0, 0, 10, 0], 2, [2, 2]);
    var x = 400 + 3 + 8.5;
    t.equal(mods[1].pickNode(sticky, x, 300, 8), null, 'out of reach');
    t.equal(mods[1].pickNode(sticky, x, 300, 8, 0, 4).row, 0, 'the hovered node reaches 4 px farther');
  });
});

test('pickNode says how clearly the nearest node wins', function (t) {
  return Promise.all([math, pick]).then(function (mods) {
    var p = topDown(mods[0]);
    // Discs of radius 3 px at x = 400 and 412 (6 px between their edges)
    var s = state(p, [0, 0, 4, 0], 2, [2, 2]);
    var hit = mods[1].pickNode(s, 406, 300, 16, -1, 0, 8);
    t.equal(hit.gap, 0, 'right between them: no gap');
    hit = mods[1].pickNode(s, 397, 300, 16, -1, 0, 8);
    t.equal(hit.row, 0);
    t.ok(hit.inside);
    t.ok(Math.abs(hit.gap - 12) < 1e-6, 'the other edge is 12 px farther');
    var lone = state(p, [0, 0, 40, 0], 2, [2, 2]);
    t.equal(mods[1].pickNode(lone, 410, 300, 16, -1, 0, 8).gap, Infinity, 'nothing else within reach and margin');
    // The hovered node gets its bonus in the gap too
    hit = mods[1].pickNode(s, 406, 300, 16, 0, 4, 8);
    t.equal(hit.row, 0);
    t.equal(hit.gap, 4);
  });
});

test('nodesInRect counts discs that touch the box', function (t) {
  return Promise.all([math, pick]).then(function (mods) {
    var p = topDown(mods[0]);
    var s = state(p, [0, 0, 10, 0, 50, 50], 2, [2, 2, 2]);
    // Box from x 425 to 500: row 1 is at 430
    t.same(mods[1].nodesInRect(s, 500, 250, 425, 350), [1]);
    // Its disc reaches to 427 from the left: a box ending at 428 touches it
    t.same(mods[1].nodesInRect(s, 300, 250, 428, 350), [0, 1]);
    t.same(mods[1].nodesInRect(s, 300, 250, 426, 350), [0]);
  });
});

test('flags: set, clear, count', function (t) {
  return flags.then(function (f) {
    var changes = 0;
    var store = f.createFlags(function () { changes += 1; });
    t.ok(store.set('a', f.SELECTED, true));
    t.notOk(store.set('a', f.SELECTED, true), 'no change');
    store.set('b', f.SELECTED | f.HOVERED, true);
    t.equal(store.count(f.SELECTED), 2);
    t.equal(store.count(f.HOVERED), 1);
    t.same(store.ids(f.SELECTED).sort(), ['a', 'b']);
    store.set('a', f.NEIGHBOR | f.ON_TOP, true);
    t.equal(store.get('a'), f.SELECTED, 'the view sets NEIGHBOR and ON_TOP, not modules');
    store.clear(f.SELECTED);
    t.equal(store.count(f.SELECTED), 0);
    t.equal(store.get('b'), f.HOVERED);
    store.drop('b');
    t.equal(store.count(f.HOVERED), 0);
    t.equal(changes, 4, 'one call per change');
  });
});

test('layoutFlags marks neighbours and lists what is drawn on top', function (t) {
  return flags.then(function (f) {
    var graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('a', 'c');
    graph.addLink('c', 'd');
    graph.addLink('d', 'e');
    var rows = {a: 0, b: 1, c: 2, d: 3, e: 4};
    var rowOf = function (id) { return id in rows ? rows[id] : -1; };
    var store = f.createFlags(function () {});
    store.set('a', f.SELECTED, true);
    store.set('d', f.HOVERED, true);
    var bits = new Uint8Array(5);
    var laid = f.layoutFlags(store, graph, rowOf, bits, [], {nodes: 10, links: 10});
    t.equal(bits[0], f.SELECTED | f.ON_TOP);
    t.equal(bits[1], f.NEIGHBOR);
    t.equal(bits[2], f.NEIGHBOR);
    t.equal(bits[3], f.HOVERED | f.ON_TOP);
    t.equal(bits[4], 0);
    t.same(laid.topNodes, [0, 3], 'selected first, hovered last');
    var linkIds = laid.topLinks.map(function (link) { return link.fromId + link.toId; }).sort();
    t.same(linkIds, ['ab', 'ac', 'cd', 'de'], 'each link of a node on top, once');

    // Too many selected links: selected nodes stay in place, the hovered one is still on top
    laid = f.layoutFlags(store, graph, rowOf, bits, laid.rows, {nodes: 10, links: 1});
    t.equal(bits[0], f.SELECTED, 'not on top');
    t.same(laid.topNodes, [3]);
    t.equal(laid.topLinks.length, 2);

    // Rows written before are cleared
    store.clear(f.SELECTED);
    store.clear(f.HOVERED);
    laid = f.layoutFlags(store, graph, rowOf, bits, laid.rows, {nodes: 10, links: 10});
    t.same(Array.from(bits), [0, 0, 0, 0, 0]);
    t.same(laid.rows, []);
  });
});

// A canvas, a window and a document that record listeners, with a clock and timers to drive
function createDom() {
  var time = 1000;
  var timers = [];
  function target() {
    var listeners = {};
    return {
      listeners: listeners,
      addEventListener: function (name, fn) { (listeners[name] = listeners[name] || []).push(fn); },
      removeEventListener: function (name, fn) {
        var list = listeners[name] || [];
        var index = list.indexOf(fn);
        if (index >= 0) list.splice(index, 1);
      },
      fire: function (name, e) {
        e = Object.assign({defaultPrevented: false, preventDefault: function () { this.defaultPrevented = true; }}, e);
        (listeners[name] || []).slice().forEach(function (fn) { fn(e); });
        return e;
      }
    };
  }
  var canvas = target();
  var attributes = {};
  canvas.style = {cursor: ''};
  canvas.getBoundingClientRect = function () { return {left: 10, top: 20, width: 800, height: 600}; };
  canvas.hasAttribute = function (name) { return name in attributes; };
  canvas.setAttribute = function (name, value) { attributes[name] = value; };
  canvas.removeAttribute = function (name) { delete attributes[name]; };
  canvas.focus = function () {};
  var doc = target();
  doc.activeElement = null;
  doc.visibilityState = 'visible';
  var env = {
    window: target(),
    document: doc,
    now: function () { return time; },
    setTimeout: function (fn, ms) { timers.push({fn: fn, at: time + ms}); return timers.length; },
    clearTimeout: function (handle) { if (timers[handle - 1]) timers[handle - 1].fn = null; }
  };
  return {
    canvas: canvas,
    env: env,
    attributes: attributes,
    advance: function (ms) {
      time += ms;
      timers.forEach(function (timer) {
        if (timer.fn && timer.at <= time) {
          var fn = timer.fn;
          timer.fn = null;
          fn();
        }
      });
    },
    down: function (id, x, y, extra) {
      return canvas.fire('pointerdown', Object.assign({pointerId: id, pointerType: 'mouse', button: 0, buttons: 1, clientX: x + 10, clientY: y + 20}, extra));
    },
    move: function (id, x, y, extra) {
      return canvas.fire('pointermove', Object.assign({pointerId: id, pointerType: 'mouse', buttons: 1, clientX: x + 10, clientY: y + 20}, extra));
    },
    up: function (id, x, y, extra) {
      return canvas.fire('pointerup', Object.assign({pointerId: id, pointerType: 'mouse', button: 0, buttons: 0, clientX: x + 10, clientY: y + 20}, extra));
    }
  };
}

// Input with a node 'n' at canvas (100, 100) within 8 px, a recording handler and a camera
function setup(i, extra) {
  var dom = createDom();
  var log = [];
  var appEvents = [];
  var listeners = {};
  var node = {id: 'n'};
  var core = i.createInput(dom.canvas, {
    pick: function (x, y) { return Math.hypot(x - 100, y - 100) < 8 ? {node: node, row: 0, inside: Math.hypot(x - 100, y - 100) < 3} : null; },
    emit: function (name, e) {
      appEvents.push(name + (e.count > 1 ? e.count : ''));
      (listeners[name] || []).forEach(function (fn) { fn(e); });
    },
    hasListeners: function (name) { return !!listeners[name]; },
    scenePoint: function (x, y) { return {x: x, y: y, z: 0}; },
    env: dom.env
  });
  function recorder(name, priority, claim, more) {
    var handler = {name: name, priority: priority, press: claim};
    ['down', 'dragstart', 'drag', 'dragend', 'up', 'cancel', 'tap', 'doubletap', 'contextmenu', 'twofingertap'].forEach(function (hook) {
      handler[hook] = function () { log.push(name + '.' + hook); };
    });
    return Object.assign(handler, more || {});
  }
  var camera = recorder('camera', Infinity, function () { return true; });
  core.add(camera);
  return Object.assign({core: core, log: log, appEvents: appEvents, listeners: listeners, recorder: recorder, node: node}, dom, extra);
}

test('input: a press that lifts is a tap, a second one is a double tap', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    t.equal(s.canvas.style.touchAction, 'none', 'the browser leaves gestures to the view');
    t.equal(s.attributes.tabindex, '0', 'the canvas can take focus');
    s.down(1, 100, 100);
    s.up(1, 101, 100);
    t.same(s.log, ['camera.down', 'camera.up', 'camera.tap']);
    t.same(s.appEvents, ['tap']);
    s.advance(200);
    s.down(1, 102, 101);
    s.up(1, 102, 101);
    t.same(s.appEvents, ['tap', 'tap2', 'doubletap2']);
    s.advance(400);
    s.down(1, 102, 101);
    s.up(1, 102, 101);
    t.same(s.appEvents, ['tap', 'tap2', 'doubletap2', 'tap'], 'too late for a third');
  });
});

test('input: moving past the drag distance makes a drag for the owner, not a tap', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    var nodes = s.recorder('nodes', 20, function (p) { return !!p.node; });
    s.core.add(nodes);
    s.down(1, 100, 100);
    s.move(1, 102, 100);
    t.same(s.log, ['nodes.down'], 'still undecided at 2 px');
    s.move(1, 110, 100);
    t.same(s.log, ['nodes.down', 'nodes.dragstart', 'nodes.drag']);
    t.ok(s.core.dragging());
    s.up(1, 120, 100);
    t.same(s.log, ['nodes.down', 'nodes.dragstart', 'nodes.drag', 'nodes.dragend']);
    t.same(s.appEvents, [], 'no tap');

    s.log.length = 0;
    s.down(2, 300, 300);
    s.move(2, 320, 300);
    t.same(s.log, ['camera.down', 'camera.dragstart', 'camera.drag'], 'the background goes to the camera');
    s.up(2, 320, 300);
  });
});

test('input: a handler that declines at dragstart passes the pointer on', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    s.core.add(s.recorder('picky', 20, function () { return true; }, {
      dragstart: function () { s.log.push('picky.decline'); return false; }
    }));
    s.down(1, 100, 100);
    s.move(1, 120, 100);
    t.same(s.log, ['picky.down', 'picky.decline', 'camera.down', 'camera.dragstart', 'camera.drag']);
    s.up(1, 120, 100);
  });
});

test('input: a long press can be taken over; the release is not a tap', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    s.core.add(s.recorder('grab', 20, function () { return false; }, {
      longpress: function (p) { s.log.push('grab.longpress'); return !!p.node; }
    }));
    s.down(1, 100, 100);
    s.advance(499);
    t.same(s.log, ['camera.down']);
    s.advance(1);
    t.same(s.log, ['camera.down', 'grab.longpress', 'camera.cancel'], 'the camera lets go');
    s.move(1, 130, 100);
    t.same(s.log.slice(3), ['grab.dragstart', 'grab.drag']);
    s.up(1, 130, 100);
    t.same(s.appEvents, ['longpress'], 'the app heard the long press, and no tap');

    // On the background nobody takes it, nobody listens: a slow tap is still a tap
    s.log.length = 0;
    s.down(2, 300, 300);
    s.advance(600);
    s.up(2, 300, 300);
    t.same(s.log, ['camera.down', 'grab.longpress', 'camera.up', 'grab.tap', 'camera.tap']);
  });
});

test('input: the app hears events first and can stop them', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    s.listeners.tap = [function (e) {
      t.equal(e.node, s.node, 'the node under the press');
      t.equal(e.x, 100, 'canvas coordinates');
      t.equal(e.pointerType, 'mouse');
      e.preventDefault();
    }];
    s.down(1, 100, 100);
    s.up(1, 100, 100);
    t.same(s.log, ['camera.down', 'camera.up'], 'no handler saw the tap');

    // Right button: a contextmenu event on release
    s.log.length = 0;
    s.down(2, 300, 300, {button: 2, buttons: 2});
    s.up(2, 300, 300, {button: 2});
    t.same(s.log, ['camera.down', 'camera.up', 'camera.contextmenu']);
    var menu = s.canvas.fire('contextmenu', {});
    t.ok(menu.defaultPrevented, 'no browser menu on the canvas');
  });
});

test('input: two fingers make no taps, and a quick two-finger tap is one gesture', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    var touch = {pointerType: 'touch'};
    s.down(1, 300, 300, touch);
    s.down(2, 340, 300, touch);
    s.advance(100);
    s.up(1, 300, 300, touch);
    s.up(2, 340, 300, touch);
    t.same(s.log, ['camera.down', 'camera.down', 'camera.up', 'camera.up', 'camera.twofingertap']);
    t.same(s.appEvents, [], 'no single taps');

    // Too slow, or moved: not a two-finger tap
    s.log.length = 0;
    s.down(1, 300, 300, touch);
    s.down(2, 340, 300, touch);
    s.move(2, 380, 300, touch);
    s.up(1, 300, 300, touch);
    s.up(2, 380, 300, touch);
    t.notOk(s.log.indexOf('camera.twofingertap') >= 0);
  });
});

test('input: cancels end the gesture once, and the pointer is ignored until it lifts', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    s.down(1, 300, 300);
    s.move(1, 320, 300);
    // The button went up outside the window
    s.move(1, 330, 300, {buttons: 0});
    t.same(s.log, ['camera.down', 'camera.dragstart', 'camera.drag', 'camera.cancel']);
    t.notOk(s.core.busy());

    s.log.length = 0;
    s.down(2, 300, 300);
    s.move(2, 320, 300);
    s.core.cancel(2);
    s.move(2, 340, 300);
    s.up(2, 340, 300);
    t.same(s.log, ['camera.down', 'camera.dragstart', 'camera.drag', 'camera.cancel'], 'no more moves, no end');

    s.log.length = 0;
    s.down(3, 300, 300);
    s.move(3, 320, 300);
    s.env.window.fire('blur', {});
    t.same(s.log, ['camera.down', 'camera.dragstart', 'camera.drag', 'camera.cancel'], 'leaving the window cancels');
    s.up(3, 320, 300);
  });
});

test('input: keys go to handlers in order, hover comes from mice only', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    var hovers = [];
    s.core.add({
      priority: 10,
      key: function (e) { return e.key === 'Escape'; },
      hover: function (point) { hovers.push(point && point.x); }
    });
    var escape = s.canvas.fire('keydown', {key: 'Escape'});
    t.ok(escape.defaultPrevented, 'a key someone used');
    var tab = s.canvas.fire('keydown', {key: 'Tab'});
    t.notOk(tab.defaultPrevented, 'Tab always leaves the canvas');

    s.canvas.fire('pointermove', {pointerId: 1, pointerType: 'mouse', buttons: 0, clientX: 60, clientY: 70});
    s.canvas.fire('pointermove', {pointerId: 2, pointerType: 'touch', buttons: 0, clientX: 60, clientY: 70});
    s.canvas.fire('pointerleave', {pointerId: 1, pointerType: 'mouse'});
    t.same(hovers, [50, null]);

    var wheel = s.canvas.fire('wheel', {deltaMode: 1, deltaY: 2, deltaX: 0, clientX: 10, clientY: 20});
    t.ok(wheel.defaultPrevented, 'the page does not scroll');
    s.core.dispose();
    t.equal(s.canvas.style.touchAction, '', 'dispose restores the canvas');
    t.notOk('tabindex' in s.attributes);
  });
});

test('select: taps select, Shift adds, Cmd toggles, the background clears', function (t) {
  return Promise.all([select, flags]).then(function (mods) {
    var selectNodes = mods[0].default, f = mods[1];
    var graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('b', 'c');
    var handler = null;
    var events = [];
    var store = f.createFlags(function () {});
    var api = selectNodes.attach({
      graph: graph,
      flags: store,
      input: {add: function (h) { handler = h; }, cancel: function () {}},
      nodesInRect: function () { return []; },
      emit: function (name, fields) {
        var e = {defaultPrevented: false, preventDefault: function () { this.defaultPrevented = true; }};
        Object.assign(e, fields);
        events.push(e);
        if (fields.added.some(function (node) { return node.id === 'c'; })) e.preventDefault();
        return e;
      }
    }, {});
    function tap(id, keys) {
      handler.tap(Object.assign({button: 0, node: id ? graph.getNode(id) : null}, keys));
    }
    function ids() { return api.get().map(function (node) { return node.id; }).sort(); }

    tap('a');
    t.same(ids(), ['a']);
    tap('b', {shiftKey: true});
    t.same(ids(), ['a', 'b']);
    tap('a', {metaKey: true});
    t.same(ids(), ['b'], 'toggled off');
    t.same(store.ids(f.SELECTED), ['b'], 'flags follow');
    tap('c', {shiftKey: true});
    t.same(ids(), ['b'], 'a listener prevented it');
    tap(null);
    t.same(ids(), []);
    t.equal(events.length, 5);
    t.same(events[1].added.map(function (n) { return n.id; }), ['b']);

    api.set(['a', 'b']);
    t.ok(handler.key({key: 'Escape'}), 'Escape clears');
    t.same(ids(), []);
    t.notOk(handler.key({key: 'Escape'}), 'nothing left to clear');
    t.ok(handler.press({button: 0, shiftKey: true, pointerType: 'mouse'}), 'Shift-press draws a box');
    t.notOk(handler.press({button: 0, pointerType: 'touch'}), 'a plain press is left to others');
    t.notOk(handler.longpress({button: 0, node: graph.getNode('a'), pointerType: 'touch'}), 'a long press on a node is left to the drag');
    api.dispose();
  });
});

test('select: a long press on the background starts a box for any pointer, without Shift it replaces', function (t) {
  return Promise.all([select, flags]).then(function (mods) {
    var selectNodes = mods[0].default, f = mods[1];
    var graph = createGraph();
    graph.addLink('a', 'b');
    graph.addLink('c', 'd');
    var handler = null, cursor = null;
    var store = f.createFlags(function () {});
    var api = selectNodes.attach({
      graph: graph, flags: store,
      input: {add: function (h) { handler = h; }, cancel: function () {}},
      nodesInRect: function () { return [graph.getNode('c'), graph.getNode('d')]; },
      setCursor: function (value) { cursor = value; },
      emit: function (name, fields) { return Object.assign({defaultPrevented: false}, fields); }
    }, {});
    global.requestAnimationFrame = global.requestAnimationFrame || function () { return 0; };
    global.cancelAnimationFrame = global.cancelAnimationFrame || function () {};
    api.set(['a']);
    var p = {id: 5, button: 0, node: null, pointerType: 'touch', downX: 10, downY: 10, x: 10, y: 10, downClientX: 10, downClientY: 10, clientX: 10, clientY: 10};
    t.ok(handler.longpress(p), 'takes the pointer');
    t.equal(cursor, 'crosshair');
    p.x = p.clientX = 200;
    handler.dragstart(p);
    handler.drag(p);
    handler.dragend(p);
    t.same(api.get().map(function (n) { return n.id; }).sort(), ['c', 'd'], 'replaced');
    t.equal(cursor, null);

    var q = {id: 6, button: 0, node: null, pointerType: 'mouse', shiftKey: true, downX: 10, downY: 10, x: 10, y: 10, downClientX: 10, downClientY: 10, clientX: 10, clientY: 10};
    api.set(['a']);
    handler.dragstart(q);
    handler.dragend(q);
    t.same(api.get().map(function (n) { return n.id; }).sort(), ['a', 'c', 'd'], 'Shift adds');

    // A long press that never moved draws nothing
    handler.longpress(p);
    handler.up(p);
    t.same(api.get().map(function (n) { return n.id; }).sort(), ['a', 'c', 'd']);
    api.dispose();
  });
});

test('describeNode: id, links and data fields as text', function (t) {
  return inspect.then(function (m) {
    var graph = createGraph();
    graph.addNode('a', {name: '<b>Ann</b>', weight: 1 / 3, tags: ['x', 'y'], long: new Array(300).join('z')});
    graph.addLink('a', 'b');
    graph.addLink('a', 'c');
    graph.addNode('d', 42);
    var a = m.describeNode(graph.getNode('a'), graph);
    t.equal(a.title, 'a');
    t.same(a.rows[0], ['links', '2']);
    t.same(a.rows[1], ['name', '<b>Ann</b>'], 'text as is: the tooltip never parses it as HTML');
    t.same(a.rows[2], ['weight', '0.333333']);
    t.same(a.rows[3], ['tags', '["x","y"]']);
    t.equal(a.rows[4][1].length, 120, 'long values are cut');
    t.same(m.describeNode(graph.getNode('d'), graph).rows, [['links', '0'], ['data', '42']]);
    var many = {};
    for (var i = 0; i < 20; ++i) many['f' + i] = i;
    graph.addNode('e', many);
    var e = m.describeNode(graph.getNode('e'), graph);
    t.equal(e.rows.length, 1 + 12 + 1);
    t.same(e.rows[13], ['…', '8 more']);
  });
});

test('nearestInDirection: the nearest node in a cone, off-axis counts double', function (t) {
  return navigate.then(function (m) {
    // 0 at the centre; 1 right; 2 farther right; 3 up-right; 4 left; 5 behind the camera
    var screen = {
      x: new Float32Array([100, 140, 200, 130, 60, NaN]),
      y: new Float32Array([100, 100, 100, 70, 100, NaN])
    };
    var right = {x: 1, y: 0}, left = {x: -1, y: 0}, up = {x: 0, y: -1}, down = {x: 0, y: 1};
    t.equal(m.nearestInDirection(screen, 0, right), 1);
    t.equal(m.nearestInDirection(screen, 0, left), 4);
    t.equal(m.nearestInDirection(screen, 0, up), 3, 'up-right is within the cone going up');
    t.equal(m.nearestInDirection(screen, 0, down), -1, 'nothing below');
    t.equal(m.nearestInDirection(screen, 1, right), 2);
    // 3 is 30 px right and 30 px up of 0: along 30 + 2 * 30 = 90, against 1 at 40
    t.equal(m.nearestInDirection(screen, 4, right), 0);
  });
});

test('neighboursOf: strongest link first, then more links, then label; each neighbour once', function (t) {
  return navigate.then(function (m) {
    var graph = createGraph();
    graph.addLink('a', 'b', {weight: 1});
    graph.addLink('a', 'c', {weight: 5});
    graph.addLink('a', 'd');
    graph.addLink('a', 'e');
    graph.addLink('e', 'x');
    graph.addLink('b', 'a', {weight: 7}); // a second link to b, stronger
    graph.addLink('a', 'a');              // a loop is not a neighbour
    var list = m.neighboursOf(graph, graph.getNode('a'), function (node) { return String(node.id); });
    t.same(list.map(function (e) { return e.node.id; }), ['b', 'c', 'e', 'd']);
    t.equal(list[0].weight, 7, 'the strongest of two links');
    t.equal(list[2].weight, null);
  });
});

test('findNodes: label starts, then word starts, then contains, then ids; more links first', function (t) {
  return search.then(function (m) {
    var graph = createGraph();
    graph.addNode('n1', {name: 'Valjean'});
    graph.addNode('n2', {name: 'Mlle Vaubois'});
    graph.addNode('n3', {name: 'Gervais'});
    graph.addNode('va-id');
    graph.addNode('n4', {name: 'Valentine'});
    graph.addLink('n4', 'n2');
    graph.addLink('n4', 'n3');
    var labelOf = function (node) { return node.data && node.data.name ? node.data.name : String(node.id); };
    var index = m.buildSearchIndex(graph, labelOf);
    var found = m.findNodes(index, 'va', 10);
    t.same(found.map(function (f) { return f.label; }), ['Valentine', 'va-id', 'Valjean', 'Mlle Vaubois', 'Gervais']);
    t.same(found.map(function (f) { return f.rank; }), [0, 0, 0, 1, 2]);
    t.equal(found.total, 5);
    t.same(m.findNodes(index, 'n3', 10).map(function (f) { return f.label; }), ['Gervais'], 'ids match too, last');
    var two = m.findNodes(index, 'va', 2);
    t.same(two.map(function (f) { return f.label; }), ['Valentine', 'va-id'], 'the best two');
    t.equal(two.total, 5, 'and how many there were');
    t.same(m.findNodes(index, '  ', 10), [], 'nothing for blank text');
  });
});

test('input: a tap from a key reaches the app first, then the handlers', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    var seen = [];
    s.listeners.tap = [function (e) { seen.push('app:' + e.pointerType + ':' + e.node.id); }];
    s.core.add({priority: 10, tap: function (e) { seen.push('module:' + (e.shiftKey ? 'shift' : '')); }});
    s.core.tap({node: s.node, row: 0}, {pointerType: 'keyboard', button: 0, shiftKey: true});
    t.same(seen, ['app:keyboard:n', 'module:shift']);
  });
});
