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
    var position = layout.getNodePosition(node.id);
  });
});
