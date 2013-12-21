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

test('Listens to graph events', function  (t) {
  // we first initialize with empty graph:
  var graph = createGraph();
  var layout = createLayout(graph);

  // and only then add nodes:
  graph.addLink(1, 2);

  // make two iterations
  layout.step();
  var pos1 = copy(layout.getNodePosition(1));
  var pos2 = copy(layout.getNodePosition(2));

  layout.step();

  t.ok(positionChanged(pos1, layout.getNodePosition(1)), 'Node 1 has moved');
  t.ok(positionChanged(pos2, layout.getNodePosition(2)), 'Node 2 has moved');

  t.end();

  function positionChanged(pos1, pos2) {
    return pos1.x !== pos2.x ||
           pos1.y !== pos2.y;
  }

  function copy(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
});
