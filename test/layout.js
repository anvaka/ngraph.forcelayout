var test = require('tap').test,
    createGraph = require('ngraph.graph'),
    createLayout = require('..');

test('it exposes simulator', function(t) {
  t.ok(typeof createLayout.simulator === 'function', 'Simulator is exposed');
  t.end();
});

test('it returns spring', function(t) {
  var g = createGraph();
  var layout = createLayout(g);

  var link = g.addLink(1, 2);

  var springForLink = layout.getSpring(link);
  var springForLinkId = layout.getSpring(link.id);
  var springForFromTo = layout.getSpring(1, 2);

  t.ok(springForLink, 'spring is here');
  t.ok(springForLinkId === springForLink, 'Spring is the same');
  t.ok(springForFromTo === springForLink, 'Spring is the same');
  t.end();
});

test('it returns body', function(t) {
  var g = createGraph();
  var layout = createLayout(g);

  g.addLink(1, 2);

  t.ok(layout.getBody(1), 'node 1 has body');
  t.ok(layout.getBody(2), 'node 2 has body');
  t.notOk(layout.getBody(4), 'there is no node 4');

  t.end();
});

test('does not tolerate bad input', function (t) {
  t.throws(missingGraph);
  t.throws(invalidNodeId);
  t.end();

  function missingGraph() {
    // graph is missing:
    createLayout();
  }

  function invalidNodeId() {
    var graph = createGraph();
    var layout = createLayout(graph);

    // we don't have nodes in the graph. This should throw:
    layout.getNodePosition(1);
  }
});

test('can add bodies which are standard prototype names', function (t) {
  var graph = createGraph();
  graph.addLink('constructor', 'watch');

  var layout = createLayout(graph);
  layout.step();

  graph.forEachNode(function (node) {
    var pos = layout.getNodePosition(node.id);
    t.ok(pos && typeof pos.x === 'number' &&
         typeof pos.y === 'number', 'Position is defined');
  });

  t.end();
});

test('it can step when no links present', function (t) {
  var graph = createGraph();
  graph.addNode('constructor');
  graph.addNode('watch');

  var layout = createLayout(graph);
  layout.step();

  graph.forEachNode(function (node) {
    var pos = layout.getNodePosition(node.id);
    t.ok(pos && typeof pos.x === 'number' &&
         typeof pos.y === 'number', 'Position is defined');
  });

  t.end();
});

test('layout initializes nodes positions', function (t) {
  var graph = createGraph();
  graph.addLink(1, 2);

  var layout = createLayout(graph);

  // perform one iteration of layout:
  layout.step();

  graph.forEachNode(function (node) {
    var pos = layout.getNodePosition(node.id);
    t.ok(pos && typeof pos.x === 'number' &&
         typeof pos.y === 'number', 'Position is defined');
  });

  graph.forEachLink(function (link) {
    var linkPos = layout.getLinkPosition(link.id);
    t.ok(linkPos && linkPos.from && linkPos.to, 'Link position is defined');
    var fromPos = layout.getNodePosition(link.fromId);
    t.ok(linkPos.from === fromPos, '"From" should be identical to getNodePosition');
    var toPos = layout.getNodePosition(link.toId);
    t.ok(linkPos.to === toPos, '"To" should be identical to getNodePosition');
  });

  t.end();
});

test('Layout can set node position', function (t) {
  var graph = createGraph();
  graph.addLink(1, 2);

  var layout = createLayout(graph);

  layout.pinNode(graph.getNode(1), true);
  layout.setNodePosition(1, 42, 42);

  // perform one iteration of layout:
  layout.step();

  // and make sure node 1 was not moved:
  var actualPosition = layout.getNodePosition(1);
  t.equals(actualPosition.x, 42, 'X has not changed');
  t.equals(actualPosition.y, 42, 'Y has not changed');

  t.end();
});

test('layout initializes links', function (t) {
  var graph = createGraph();
  var node1 = graph.addNode(1); node1.position = {x : -1000, y: 0};
  var node2 = graph.addNode(2); node2.position = {x : 1000, y: 0};

  graph.addLink(1, 2);

  var layout = createLayout(graph);

  // perform one iteration of layout:
  layout.step();

  // since both nodes are connected by spring and distance is too large between
  // them, they should start attracting each other
  var pos1 = layout.getNodePosition(1);
  var pos2 = layout.getNodePosition(2);

  t.ok(pos1.x > -1000, 'Node 1 moves towards node 2');
  t.ok(pos2.x < 1000, 'Node 1 moves towards node 2');

  t.end();
});

test('layout respects proposed original position', function (t) {
  var graph = createGraph();
  var node = graph.addNode(1);

  var initialPosition = {x: 100, y: 100};
  node.position = copy(initialPosition);

  var layout = createLayout(graph);
  layout.step();

  t.deepEqual(layout.getNodePosition(node.id), initialPosition, 'original position preserved');

  t.end();
});

test('layout has defined graph rectange', function (t) {
  t.test('empty graph', function (t) {
    var graph = createGraph();
    var layout = createLayout(graph);

    var rect = layout.getGraphRect();
    var expectedProperties = ['x1', 'y1', 'x2', 'y2'];
    t.ok(rect && expectedProperties.reduce(hasProperties, true), 'Values are present before step()');

    layout.step();

    t.ok(rect && expectedProperties.reduce(hasProperties, true), 'Values are present after step()');
    t.end();

    function hasProperties(result, key) {
      return result && typeof rect[key] === 'number';
    }
  });

  t.test('two nodes', function (t) {
    var graph = createGraph();
    graph.addLink(1, 2);
    var layout = createLayout(graph);
    layout.step();

    var rect = layout.getGraphRect();
    t.ok(!rectangleIsEmpty(rect), 'Graph rectangle is not empty');

    t.end();
  });

  t.end();
});

test('it does not move pinned nodes', function (t) {
  t.test('respects original data.isPinned attribute', function (t) {
    var graph = createGraph();
    var testNode = graph.addNode(1, { isPinned: true });
    var layout = createLayout(graph);
    t.ok(layout.isNodePinned(testNode), 'Node is pinned');
    t.end();
  });

  t.test('respects node.isPinned attribute', function (t) {
    var graph = createGraph();
    var testNode = graph.addNode(1);

    // this was possible in vivagraph. Port it over to ngraph:
    testNode.isPinned = true;
    var layout = createLayout(graph);
    t.ok(layout.isNodePinned(testNode), 'Node is pinned');
    t.end();
  });

  t.test('can pin nodes after graph is initialized', function (t) {
    var graph = createGraph();
    graph.addLink(1, 2);

    var layout = createLayout(graph);
    layout.pinNode(graph.getNode(1), true);
    layout.step();
    var pos1 = copy(layout.getNodePosition(1));
    var pos2 = copy(layout.getNodePosition(2));

    // make one more step and make sure node 1 did not move:
    layout.step();

    t.ok(!positionChanged(pos1, layout.getNodePosition(1)), 'Node 1 was not moved');
    t.ok(positionChanged(pos2, layout.getNodePosition(2)), 'Node 2 has moved');

    t.end();
  });

  t.end();
});

test('it listens to graph events', function (t) {
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
});

test('can stop listen to events', function (t) {
  // we first initialize with empty graph:
  var graph = createGraph();
  var layout = createLayout(graph);
  layout.dispose();

  graph.addLink(1, 2);
  layout.step();
  t.ok(layout.simulator.bodies.length === 0, 'No bodies in the simulator');

  t.end();
});

test('physics simulator', function (t) {
  t.test('has default simulator', function (t) {
    var graph = createGraph();
    var layout = createLayout(graph);

    t.ok(layout.simulator, 'physics simulator is present');
    t.end();
  });

  t.test('can override default settings', function (t) {
    var graph = createGraph();
    var layout = createLayout(graph, {
      theta: 1.5
    });
    t.equals(layout.simulator.theta(), 1.5, 'Simulator settings are overridden');
    t.end();
  });

  t.end();
});

test('it removes removed nodes', function (t) {
  var graph = createGraph();
  var layout = createLayout(graph);
  graph.addLink(1, 2);

  layout.step();
  graph.clear();

  // since we removed evrything from graph rect should be empty:
  var rect = layout.getGraphRect();

  t.ok(rectangleIsEmpty(rect), 'Graph rect is empty');
  t.end();
});

test('it handles large graphs', function (t) {
  var graph = createGraph();
  var layout = createLayout(graph);

  var count = 60000;

  var i = count;
  while (i--) {
    graph.addNode(i);
  }

  // link each node to 2 other random nodes
  i = count;
  while (i--) {
    graph.addLink(i, Math.ceil(Math.random() * count));
    graph.addLink(i, Math.ceil(Math.random() * count));
  }

  layout.step();

  t.ok(layout.simulator.bodies.length !== 0, 'Bodies in the simulator');
  t.end();
});


function positionChanged(pos1, pos2) {
  return (pos1.x !== pos2.x) || (pos1.y !== pos2.y);
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function rectangleIsEmpty(rect) {
  return rect.x1 === 0 && rect.y1 === 0 && rect.x2 === 0 && rect.y2 === 0;
}
