var test = require('tap').test;
var createGraph = require('ngraph.graph');
var createLayout = require('..');

// modules/view is an ES module: import() loads it on every Node version CI runs. Only its
// positions.js is tested here; the rest needs WebGL.
var positions = import('../modules/view/positions.js');

test('packPositions copies the first three axes, four floats per node', function (t) {
  return positions.then(function (m) {
    var out = new Float32Array(12);
    m.packPositions(new Float64Array([1, 2, 3, 4, 5, 6]), 2, 3, out);
    t.same(Array.from(out), [1, 2, 0, 0, 3, 4, 0, 0, 5, 6, 0, 0], '2D: z is 0');

    out = new Float32Array(8);
    m.packPositions(new Float64Array([1, 2, 3, 4, 5, 6]), 3, 2, out);
    t.same(Array.from(out), [1, 2, 3, 0, 4, 5, 6, 0], '3D');

    out = new Float32Array(8);
    m.packPositions(new Float64Array([1, 2, 3, 9, 5, 6, 7, 9]), 4, 2, out);
    t.same(Array.from(out), [1, 2, 3, 0, 5, 6, 7, 0], '4D: the fourth axis is not drawn');

    out = new Float32Array(8);
    m.packPositions(new Float64Array([1, 2]), 1, 2, out);
    t.same(Array.from(out), [1, 0, 0, 0, 2, 0, 0, 0], '1D: y and z are 0');
  });
});

test('textureRows counts whole rows, at least one', function (t) {
  return positions.then(function (m) {
    t.equal(m.textureRows(0), 1);
    t.equal(m.textureRows(1), 1);
    t.equal(m.textureRows(m.TEXTURE_WIDTH), 1);
    t.equal(m.textureRows(m.TEXTURE_WIDTH + 1), 2);
  });
});

test('nodes and edges are in body order', function (t) {
  return positions.then(function (m) {
    var graph = createGraph();
    graph.addNode('a', { size: 3 });
    graph.addLink('a', 'b');
    graph.addLink('b', 'c');
    var layout = createLayout(graph);
    var rowOf = function (id) { return layout.getBody(id).index; };

    var size = function (node) { return (node.data && node.data.size) || 1; };
    var red = function (node) { return node.id === 'b' ? 0xff0000ff : 0; };
    var nodes = m.collectNodes(graph, layout, red, size, 0x00ff00ff);
    t.equal(nodes.sizes[rowOf('a')], 3, 'size from data');
    t.equal(nodes.sizes[rowOf('c')], 1, 'default size');
    t.equal(nodes.colors[rowOf('b')], 0xff0000ff, 'color from the function');
    t.equal(nodes.colors[rowOf('a')], 0x00ff00ff, '0 means the default color');

    var edges = m.collectEdges(graph, layout, null, 0xffffff10);
    t.equal(edges.count, 2);
    t.same(Array.from(edges.ends), [rowOf('a'), rowOf('b'), rowOf('b'), rowOf('c')], 'rows of the ends');
    t.same(Array.from(edges.colors), [0xffffff10, 0xffffff10]);

    // Rows follow the bodies when a node goes away. The view drops the removed rows first, as
    // the simulator would at its next step.
    graph.removeNode('a');
    layout.simulator.applyEdits();
    nodes = m.collectNodes(graph, layout, null, size, 1);
    t.equal(nodes.sizes.length, 2, 'one entry per body');
    edges = m.collectEdges(graph, layout, null, 1);
    t.same(Array.from(edges.ends), [rowOf('b'), rowOf('c')], 'rows after a removal');
    t.ok(rowOf('b') < 2 && rowOf('c') < 2, 'rows stay dense');
  });
});
