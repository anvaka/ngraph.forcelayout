var test = require('tap').test,
    createGraph = require('ngraph.graph'),
    createLayout = require('..');


test('layout initialized with graph nodes', function (t) {
  var graph = createGraph();
  graph.addLink(1, 2);

  var layout = createLayout(graph);

  // perform one iteration of layout:
  layout.step();

  graph.forEachNode(function (node) {
    var pos = layout.getNodePosition(node.id);
    t.ok(pos && typeof pos.x === 'number'
         && typeof pos.y === 'number', 'Position is defined');
  });

  t.end();
});

test('layout has defined graph rectange', function (t) {
  t.test('empty graph', function (t) {
    var graph = createGraph();
    var layout = createLayout(graph);

    var rect = layout.getGraphRect();
    t.ok(rect && ['x1', 'y1', 'x2', 'y2'].reduce(
      function (result, key) {
        return result && typeof rect[key] === 'number';
      }, true), 'Values are present');
    t.end();
  });

  t.test('two nodes', function (t) {
    var graph = createGraph();
    graph.addLink(1, 2);
    var layout = createLayout(graph);
    layout.step();

    var rect = layout.getGraphRect();
    t.ok(Math.abs(rect.x2 - rect.x1) > 0 ||
         Math.abs(rect.y2 - rect.y1) > 0, 'Graph rectangle is not empty');

    t.end();
  })

  t.end();
});
