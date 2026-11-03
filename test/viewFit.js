var test = require('tap').test;
var createGraph = require('ngraph.graph');
var createLayout = require('..');

// modules/view is an ES module; these parts run without WebGL or a DOM
var visible = import('../modules/view/visible.js');
var fit = import('../modules/view/modules/fit.js');

test('largestOpenRect finds the largest uncovered rectangle', function (t) {
  return visible.then(function (m) {
    // 6 x 4 cells, a panel covering the two left columns of the top three rows
    var cols = 6, rows = 4;
    var hidden = new Uint8Array(cols * rows);
    for (var r = 0; r < 3; ++r) { hidden[r * cols] = 1; hidden[r * cols + 1] = 1; }
    var best = m.largestOpenRect(hidden, cols, rows);
    t.same(best, {c0: 2, c1: 5, r0: 0, r1: 3}, 'right of the panel, all rows');
    t.equal(m.largestOpenRect(new Uint8Array(4).fill(1), 2, 2), null, 'nothing open');
    t.end();
  });
});

test('measureArea gives the largest visible rectangle in canvas pixels', function (t) {
  return visible.then(function (m) {
    // a 400 x 300 panel at the top left of a 1000 x 600 canvas
    var area = m.measureArea(1000, 600, function (x, y) { return x < 400 && y < 300; }, 20);
    t.same(area.largestRect(), {x: 400, y: 0, width: 600, height: 600});
    var open = m.measureArea(100, 100, function () { return false; }, 20);
    t.same(open.largestRect(), {x: 0, y: 0, width: 100, height: 100}, 'the whole canvas when nothing covers it');
    t.end();
  });
});

test('layoutBounds frames the bulk when a few nodes are far away', function (t) {
  return fit.then(function (m) {
    var graph = createGraph();
    for (var i = 0; i < 200; ++i) graph.addNode(i);
    var layout = createLayout(graph);
    graph.forEachNode(function (node) {
      var id = node.id;
      // 198 nodes on a 10 x 20 patch, two thrown 1000 away
      if (id < 198) layout.setNodePosition(id, (id % 10), Math.floor(id / 10));
      else layout.setNodePosition(id, 1000 * (id === 198 ? 1 : -1), 0);
    });
    var all = m.layoutBounds(layout);
    t.equal(all.maxX, 1000, 'every node without a bulk share');
    var bulk = m.layoutBounds(layout, 0.01, 1.3);
    t.ok(bulk.maxX < 20 && bulk.minX > -20, 'the far pair is left out: ' + bulk.minX + '..' + bulk.maxX);
    t.ok(bulk.maxY >= 18, 'the patch stays whole');
    // a compact drawing keeps every node
    layout.setNodePosition(198, 9, 19);
    layout.setNodePosition(199, 0, 19);
    var compact = m.layoutBounds(layout, 0.01, 1.3);
    t.same([compact.minX, compact.maxX], [0, 9], 'nothing is trimmed when the box is not much larger');
    t.end();
  });
});
