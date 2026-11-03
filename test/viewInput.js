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
    // The hovered node wins a tie, but its bonus doesn't count in the gap: a mouse that hovers
    // and a finger that doesn't must decide a press the same way
    hit = mods[1].pickNode(s, 406, 300, 16, 0, 4, 8);
    t.equal(hit.row, 0, 'the hovered node wins');
    t.equal(hit.gap, 0, 'but not clearly');
    hit = mods[1].pickNode(s, 407, 300, 16, 0, 4, 8);
    t.equal(hit.row, 0, 'it wins over a nearer node too');
    t.ok(hit.gap < 0, 'with a negative gap');
    // Inside two overlapping discs
    var overlap = state(p, [0, 0, 0.5, 0], 2, [4, 4]);
    hit = mods[1].pickNode(overlap, 400, 300, 16, -1, 0, 8);
    t.equal(hit.covers, 2, 'the point is inside both');
    t.equal(hit.gap, 0);
    t.equal(mods[1].pickNode(s, 397, 300, 16, -1, 0, 8).covers, 1, 'one disc');
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

test('input: two fingers pinch, also when the first landed on a node', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    var touch = {pointerType: 'touch'};
    s.core.add(s.recorder('nodes', 20, function (p) { return !!p.node; }));

    // The first finger on a node, the second anywhere: the camera takes both
    s.down(1, 100, 100, touch);
    s.advance(40);
    s.down(2, 300, 300, touch);
    t.same(s.log, ['nodes.down', 'nodes.cancel', 'camera.down', 'camera.down']);
    s.move(1, 80, 100, touch);
    s.move(2, 340, 300, touch);
    t.same(s.log.slice(4), ['camera.dragstart', 'camera.drag', 'camera.dragstart', 'camera.drag'], 'they move the camera');
    s.up(1, 80, 100, touch);
    s.up(2, 340, 300, touch);

    // The other way round: the first on the background, the second on a node
    s.log.length = 0;
    s.down(1, 300, 300, touch);
    s.down(2, 100, 100, touch);
    t.same(s.log, ['camera.down', 'camera.down']);
    s.up(1, 300, 300, touch);
    s.up(2, 100, 100, touch);

    // A drag that has just started joins the pinch: it is cancelled (the node goes back)
    s.log.length = 0;
    s.down(1, 100, 100, touch);
    s.move(1, 115, 100, touch);
    s.advance(100);
    s.down(2, 300, 300, touch);
    t.same(s.log, ['nodes.down', 'nodes.dragstart', 'nodes.drag', 'nodes.cancel', 'camera.down', 'camera.down']);
    s.move(1, 130, 100, touch);
    t.equal(s.log[s.log.length - 1], 'camera.drag', 'the camera moves with it now');
    s.up(1, 130, 100, touch);
    s.up(2, 300, 300, touch);
  });
});

test('input: a finger that committed to a drag keeps it; the next finger is offered as usual', function (t) {
  return input.then(function (i) {
    var s = setup(i);
    var touch = {pointerType: 'touch'};
    s.core.add(s.recorder('nodes', 20, function (p) { return !!p.node; }, {
      longpress: function (p) { s.log.push('nodes.longpress'); return !!p.node; }
    }));

    // Dragged for longer than pinchTime
    s.down(1, 100, 100, touch);
    s.move(1, 115, 100, touch);
    s.advance(300);
    s.down(2, 300, 300, touch);
    t.same(s.log, ['nodes.down', 'nodes.dragstart', 'nodes.drag', 'camera.down'], 'the node stays; the new finger pans');
    s.up(2, 300, 300, touch);
    s.up(1, 115, 100, touch);

    // Taken by a long press
    s.log.length = 0;
    s.down(1, 100, 100, touch);
    s.advance(500);
    s.down(2, 300, 300, touch);
    t.same(s.log, ['nodes.down', 'nodes.longpress', 'camera.down']);
    s.up(2, 300, 300, touch);
    s.up(1, 100, 100, touch);

    // A mouse and a finger don't pinch
    s.log.length = 0;
    s.down(1, 300, 300);
    s.down(2, 100, 100, touch);
    t.same(s.log, ['camera.down', 'nodes.down']);
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

var place = import('../modules/view/labels/place.js');
var importance = import('../modules/view/labels/importance.js');

test('placeLabels: in order, beside the node, never overlapping unless forced', function (t) {
  return place.then(function (m) {
    var options = {width: 400, height: 300, gap: 3, padding: 2};
    var label = function (row, x, y, extra) {
      return Object.assign({row: row, x: x, y: y, radius: 5, width: 60, height: 16, anchor: null, forced: false}, extra);
    };
    var placed = m.placeLabels([label(0, 100, 100), label(1, 110, 100), label(2, 300, 200)], options);
    t.same(placed.map(function (p) { return [p.row, p.anchor]; }), [[0, 'right'], [1, 'left'], [2, 'right']], 'the second takes another side');
    t.same([placed[0].x, placed[0].y], [108, 92], 'right of the disc, centred');

    // Five narrow labels on one spot: one on each side, then no room
    var crowd = [0, 1, 2, 3, 4].map(function (row) { return label(row, 200, 150, {width: 30}); });
    var tight = Object.assign({}, options, {padding: 0});
    placed = m.placeLabels(crowd, tight);
    t.same(placed.map(function (p) { return p.anchor; }), ['right', 'left', 'above', 'below'], 'no room for a fifth');
    t.same([placed[2].x, placed[2].y], [185, 126], 'above: centred, over the disc');
    crowd[4].forced = true;
    t.equal(m.placeLabels(crowd, tight).length, 5, 'unless it is forced');
    t.equal(m.placeLabels(crowd, options).length, 3, 'padding keeps the sides apart: two, and the forced one');

    // A label placed last time tries its old side first
    placed = m.placeLabels([label(0, 100, 100, {anchor: 'above'})], options);
    t.equal(placed[0].anchor, 'above');
    // Off the canvas: tries the other sides
    placed = m.placeLabels([label(0, 395, 150)], options);
    t.equal(placed[0].anchor, 'left', 'no room on the right at the edge');
    // At most `max` (forced ones don't count)
    placed = m.placeLabels([label(0, 50, 50, {forced: true}), label(1, 50, 150), label(2, 250, 150)], Object.assign({max: 1}, options));
    t.same(placed.map(function (p) { return p.row; }), [0, 1]);
    // Something covers x < 150: a label goes to a side that is clear, or not at all
    var blocked = function (box) { return box.x < 150; };
    placed = m.placeLabels([label(0, 160, 100), label(1, 100, 200)], Object.assign({blocked: blocked}, options));
    t.same(placed.map(function (p) { return [p.row, p.anchor]; }), [[0, 'right']], 'right of the cover, none under it');
    placed = m.placeLabels([label(0, 100, 200, {forced: true})], Object.assign({blocked: blocked}, options));
    t.equal(placed.length, 1, 'a forced label goes anyway');
  });
});

test('importance: degree, a data field, a function, pagerank', function (t) {
  return importance.then(function (m) {
    var graph = createGraph();
    ['a', 'b', 'c', 'd'].forEach(function (id, i) { graph.addNode(id, {weight: 10 - i}); });
    graph.addLink('a', 'b');
    graph.addLink('a', 'c');
    graph.addLink('a', 'd');
    graph.addLink('c', 'd');
    var rows = {a: 0, b: 1, c: 2, d: 3};
    var rowOf = function (id) { return id in rows ? rows[id] : -1; };
    t.same(Array.from(m.computeImportance(graph, rowOf, 4, 'degree')), [3, 1, 2, 2]);
    t.same(Array.from(m.computeImportance(graph, rowOf, 4, 'weight')), [10, 9, 8, 7]);
    t.same(Array.from(m.computeImportance(graph, rowOf, 4, function (node) { return node.id === 'b' ? 5 : 0; })), [0, 5, 0, 0]);
    var pr = m.computeImportance(graph, rowOf, 4, 'pagerank');
    t.ok(pr[0] > pr[2] && pr[2] > pr[1], 'the hub ranks first, the leaf last');
    t.ok(Math.abs(pr[0] + pr[1] + pr[2] + pr[3] - 1) < 1e-9, 'ranks sum to 1');
    var order = Array.from(m.rankRows(new Float64Array([3, 1, 2, 2])));
    t.equal(order[0], 0, 'most important first');
    t.equal(order[3], 1, 'least important last');
    t.same(order.slice(1, 3).sort(), [2, 3], 'ties between');
    t.same(Array.from(m.rankRows(new Float64Array([3, 1, 2, 2]))), order, 'the same order every time');
    // A grid's rows come row by row: equal nodes must not come in that order, or the first
    // rows get every label
    var equal = Array.from(m.rankRows(new Float64Array(1000)));
    var firstHundred = equal.slice(0, 100);
    t.ok(Math.min.apply(null, firstHundred) < 100 && Math.max.apply(null, firstHundred) > 900, 'ties spread over all rows');
    t.equal(new Set(equal).size, 1000, 'every row once');
    var empty = m.computeImportance(graph, rowOf, 5, 'degree');
    t.equal(empty[4], -Infinity, 'a row with no node');
  });
});

var visible = import('../modules/view/visible.js');

test('measureArea: what covers the canvas, the nearest visible spot, the middle of what shows', function (t) {
  return visible.then(function (v) {
    // A 400 x 300 canvas; a panel covers x < 100, y < 200
    var area = v.measureArea(400, 300, function (x, y) { return x < 100 && y < 200; }, 20);
    t.equal(area.cols, 20);
    t.equal(area.rows, 15);
    t.ok(area.anyHidden);
    t.ok(area.isHidden(50, 50), 'under the panel');
    t.notOk(area.isHidden(50, 250), 'below it');
    t.ok(area.isHidden(-1, 10), 'outside the canvas');

    // A point under the panel goes right out of it, `margin` from its edge
    var spot = area.nearest(60, 100, 40);
    t.same(spot, {x: 140, y: 100}, 'to the right of the panel, 40 px away');
    spot = area.nearest(60, 190, 40);
    t.same(spot, {x: 60, y: 240}, 'below it when that is nearer');
    t.same(area.nearest(300, 150, 40), {x: 300, y: 150}, 'a visible point stays');
    t.same(area.nearest(390, 150, 40), {x: 360, y: 150}, 'the canvas edges count too');

    // With no room for the margin, a smaller one
    spot = area.nearest(60, 100, 200);
    t.ok(spot && !area.isHidden(spot.x, spot.y), 'somewhere visible all the same');

    var middle = area.center();
    t.notOk(area.isHidden(middle.x, middle.y), 'the middle of what shows is visible');
    t.ok(middle.x > 200, 'away from the panel', middle);

    var none = v.measureArea(400, 300, function () { return false; }, 20);
    t.notOk(none.anyHidden);
    t.same(none.nearest(10, 10, 40), {x: 40, y: 40}, 'just the canvas edges');
    var c = none.center();
    t.ok(Math.abs(c.x - 200) <= 10 && Math.abs(c.y - 150) <= 10, 'the middle of the canvas, within half a cell', c);

    var all = v.measureArea(400, 300, function () { return true; }, 20);
    t.ok(all.allHidden);
    t.equal(all.nearest(10, 10, 40), null, 'nothing to go by');
    t.equal(all.center(), null);

    // Where a box fits: the panel covers x < 100, y < 200
    var top = area.spot(80, 40, 12, 'top');
    t.equal(top.y, 12, 'at the top');
    t.ok(top.x >= 112, 'beside the panel, 12 px from it', top);
    var bottom = area.spot(80, 40, 12, 'bottom');
    t.same(bottom, {x: 12, y: 248}, 'at the bottom left, below the panel');
    t.equal(area.spot(390, 40, 12), null, 'wider than the canvas');
    t.equal(area.spot(300, 250, 12), null, 'nowhere big enough');
    t.same(v.measureArea(400, 300, function () { return false; }, 20).spot(80, 40, 12), {x: 12, y: 12}, 'nothing covers: the corner');
  });
});

test('createVisibility: a function can say what is hidden; the area is measured once for a moment', function (t) {
  return visible.then(function (v) {
    var calls = 0;
    var canvas = {getBoundingClientRect: function () { return {left: 0, top: 0, width: 400, height: 300}; }};
    var visibility = v.createVisibility(canvas, function (x) { calls += 1; return x < 100; });
    t.ok(visibility.covered(50, 50));
    t.notOk(visibility.covered(150, 50));
    t.ok(visibility.coveredIn(80, 0, 200, 100, 50), 'a lattice that reaches under the cover');
    t.notOk(visibility.coveredIn(150, 0, 300, 100, 50));
    calls = 0;
    var first = visibility.area();
    var measured = calls;
    t.ok(measured > 100, 'about 1500 cells at most');
    t.equal(visibility.area(), first, 'the same area right after');
    t.equal(calls, measured, 'no new hit tests');
    visibility.forget();
    t.not(visibility.area(), first, 'measured again once forgotten');
  });
});
