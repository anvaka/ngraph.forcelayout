/* eslint-disable no-shadow */
const test = require('tap').test,
    Graph = require('graphology'),
    createGraphologyLayout = require('../index.js');

test('it exposes simulator', (t) => {
  t.ok(typeof createGraphologyLayout.simulator === 'function', 'Simulator is exposed');
  t.end();
});

test('it adds a node', (t) => {
  const g = new Graph();
  g.addNode(1);
  t.ok(1 == g.order, 'graph has the number of expected nodes');
  t.ok('1' == g.nodes()[0], 'graph contains all expected nodes');
  t.end();
});

test('it creates a layout from a prepopulated graph', (t) => {
  const g = new Graph();
  g.addNode(1);
  g.addNode(2);
  const edge = g.addEdgeWithKey('1->2', 1, 2);
  const layout = createGraphologyLayout(g, {dimensions: 3});

  t.ok(1 == g.size, 'graph has one node');
  t.ok('1->2' == edge, 'edge key is constant');
  t.ok(layout, 'Layout exists.');
  t.end();
});

test('it returns spring', (t) => { // stones after this
  const g = new Graph();
  const layout = createGraphologyLayout(g);

  g.addNode(1);
  g.addNode(2);
  const link = g.addEdge(1, 2);

  const springForLink = layout.getSpring(link);

  t.ok(springForLink, 'spring is here');
  t.end();
});

test('it returns same position', function(t) {
  const g = new Graph();
  const layout = createGraphologyLayout(g);

  g.addNode(1);
  g.addNode(2);
  g.addEdge(1, 2);

  const firstNodePos = layout.getNodePosition('1');
  layout.step();
  t.ok(firstNodePos === layout.getNodePosition('1'), 'Position is the same object');
  layout.step();
  t.ok(firstNodePos === layout.getNodePosition('1'), 'Position is the same object after multiple steps');
  t.end();
});

test('it returns body', function(t) {
  const g = new Graph();
  const layout = createGraphologyLayout(g);

  g.addNode(1);
  g.addNode(2);
  g.addEdge(1, 2);

  t.ok(layout.getBody('1'), 'node 1 has body');
  t.ok(layout.getBody('2'), 'node 2 has body');
  t.notOk(layout.getBody('4'), 'there is no node 4');

  const body = layout.getBody('1');
  t.ok(body.pos.x && body.pos.y, 'Body has a position');
  t.ok(body.mass, 'Body has a mass');

  t.end();
});


test('it can set node mass', function(t) {
  const g = new Graph();
  g.addNode('anvaka');

  const layout = createGraphologyLayout(g, {
    nodeMass: function (nodeId) {
      t.equal(nodeId, 'anvaka', 'correct node is called');
      return 84; // my mass in kilograms :P
    }
  });

  const body = layout.getBody('anvaka');
  t.equal(body.mass, 84, 'Mass is okay');

  t.end();
});

test('does not tolerate bad input', function (t) {
  t.throws(missingGraph);
  t.throws(invalidNodeId);
  t.end();

  function missingGraph() {
    // graph is missing:
    createGraphologyLayout();
  }

  function invalidNodeId() {
    const graph = new Graph();
    const layout = createGraphologyLayout(graph);

    // we don't have nodes in the graph. This should throw:
    layout.getNodePosition(1);
  }
});

test('it fires stable on empty graph', function(t) {
  const graph = new Graph();
  const layout = createGraphologyLayout(graph);
  layout.on('stable', endTest);
  layout.step();

  function endTest() {
    t.end();
  }
});

test('can add bodies which are standard prototype names', function (t) {
  const graph = new Graph();
  graph.addNode('constructor');
  graph.addNode('watch');
  graph.addEdge('constructor', 'watch');

  const layout = createGraphologyLayout(graph);
  layout.step();

  graph.forEachNode(function (nodeId) {
    const pos = layout.getNodePosition(nodeId);
    t.ok(pos && typeof pos.x === 'number' &&
         typeof pos.y === 'number', 'Position is defined');
  });

  t.end();
});

test('it can step when no links present', function (t) {
  const graph = new Graph();
  graph.addNode('constructor');
  graph.addNode('watch');

  const layout = createGraphologyLayout(graph);
  layout.step();

  graph.forEachNode(function (nodeId) {
    const pos = layout.getNodePosition(nodeId);
    t.ok(pos && typeof pos.x === 'number' &&
         typeof pos.y === 'number', 'Position is defined');
  });

  t.end();
});

test('layout initializes nodes positions', function (t) {
  const graph = new Graph();
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);

  const layout = createGraphologyLayout(graph);

  // perform one iteration of layout:
  layout.step();

  graph.forEachNode(function (nodeId) {
    const pos = layout.getNodePosition(nodeId);
    t.ok(pos && typeof pos.x === 'number' &&
         typeof pos.y === 'number', 'Position is defined');
  });

  graph.forEachEdge(function (linkId, attributes, source, target) {
    const linkPos = layout.getLinkPosition(linkId);
    t.ok(linkPos && linkPos.from && linkPos.to, 'Link position is defined');
    const fromPos = layout.getNodePosition(source);
    t.ok(linkPos.from === fromPos, '"From" should be identical to getNodePosition');
    const toPos = layout.getNodePosition(target);
    t.ok(linkPos.to === toPos, '"To" should be identical to getNodePosition');
  });

  t.end();
});

test('Layout can set node position', function (t) {
  const graph = new Graph();
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);

  const layout = createGraphologyLayout(graph);

  layout.pinNode('1', true);
  layout.setNodePosition('1', 42, 42);

  // perform one iteration of layout:
  layout.step();

  // and make sure node 1 was not moved:
  const actualPosition = layout.getNodePosition('1');
  t.equal(actualPosition.x, 42, 'X has not changed');
  t.equal(actualPosition.y, 42, 'Y has not changed');

  t.end();
});

test('Layout updates bounding box when it sets node position', function (t) {
  const graph = new Graph();
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);

  const layout = createGraphologyLayout(graph);
  layout.setNodePosition('1', 42, 42);
  layout.setNodePosition('2', 40, 40);
  const rect = layout.getGraphRect();
  t.ok(rect.max_x <= 42); t.ok(rect.max_y <= 42);
  t.ok(rect.min_x >= 40); t.ok(rect.min_y >= 40);

  t.end();
});

test('layout initializes links', function (t) {
  const graph = new Graph();
  const node1 = graph.addNode(1); node1.position = {x : -1000, y: 0};
  const node2 = graph.addNode(2); node2.position = {x : 1000, y: 0};

  graph.addEdge(1, 2);

  const layout = createGraphologyLayout(graph);

  // perform one iteration of layout:
  layout.step();

  // since both nodes are connected by spring and distance is too large between
  // them, they should start attracting each other
  const pos1 = layout.getNodePosition('1');
  const pos2 = layout.getNodePosition('2');

  t.ok(pos1.x > -1000, 'Node 1 moves towards node 2');
  t.ok(pos2.x < 1000, 'Node 1 moves towards node 2');

  t.end();
});

test('layout respects proposed original position', function (t) {
  const graph = new Graph();

  const position = {x: 100, y: 100};
  graph.addNode(1, {position});

  const layout = createGraphologyLayout(graph);
  layout.step();

  const newPosition = layout.getNodePosition('1');

  t.same(newPosition, position, 'original position preserved');

  t.end();
});

test('layout has defined graph rectangle', function (t) {
  t.test('empty graph', function (t) {
    const graph = new Graph();
    const layout = createGraphologyLayout(graph);

    const rect = layout.getGraphRect();
    const expectedProperties = ['min_x', 'min_y', 'max_x', 'max_y'];
    t.ok(rect && expectedProperties.reduce(hasProperties, true), 'Values are present before step()');

    layout.step();

    t.ok(rect && expectedProperties.reduce(hasProperties, true), 'Values are present after step()');
    t.end();

    function hasProperties(result, key) {
      return result && typeof rect[key] === 'number';
    }
  });

  t.test('two nodes', function (t) {
    const graph = new Graph();
    graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);
    const layout = createGraphologyLayout(graph);
    layout.step();

    const rect = layout.getGraphRect();
    t.ok(!rectangleIsEmpty(rect), 'Graph rectangle is not empty');

    t.end();
  });

  t.end();
});

test('it does not move pinned nodes', function (t) {
  t.test('respects original data.isPinned attribute', function (t) {
    const graph = new Graph();
    const testNode = graph.addNode(1, { isPinned: true });
    const layout = createGraphologyLayout(graph);
    t.ok(layout.isNodePinned(testNode), 'Node is pinned due to initial value');
    t.end();
  });

  t.test('respects node.isPinned attribute', function (t) {
    const graph = new Graph();
    const testNode = graph.addNode(1);

    // this was possible in vivagraph. Port it over to ngraph:
    graph.setNodeAttribute(testNode, 'isPinned', true);

    const layout = createGraphologyLayout(graph);
    t.ok(layout.isNodePinned(testNode), 'Node is pinned after setting attribute');
    t.end();
  });

  t.test('can pin nodes after graph is initialized', function (t) {
    const graph = new Graph();
    graph.addNode(1);
    graph.addNode(2);
    graph.addEdge(1, 2);

    const layout = createGraphologyLayout(graph);
    layout.pinNode('1', true);
    layout.step();
    const pos1 = copy(layout.getNodePosition('1'));
    const pos2 = copy(layout.getNodePosition('2'));

    // make one more step and make sure node 1 did not move:
    layout.step();

    t.ok(!positionChanged(pos1, layout.getNodePosition('1')), 'Node 1 was not moved');
    t.ok(positionChanged(pos2, layout.getNodePosition('2')), 'Node 2 has moved');

    t.end();
  });

  t.end();
});

test('it listens to graph events', function (t) {
  // we first initialize with empty graph:
  const graph = new Graph();
  const layout = createGraphologyLayout(graph);

  // and only then add nodes:
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);

  // make two iterations
  layout.step();
  const pos1 = copy(layout.getNodePosition('1'));
  const pos2 = copy(layout.getNodePosition('2'));

  layout.step();

  t.ok(positionChanged(pos1, layout.getNodePosition('1')), 'Node 1 has moved');
  t.ok(positionChanged(pos2, layout.getNodePosition('2')), 'Node 2 has moved');

  t.end();
});

test('can stop listen to events', function (t) {
  // we first initialize with empty graph:
  const graph = new Graph();
  const layout = createGraphologyLayout(graph);
  layout.dispose();

  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);
  layout.step();
  t.ok(layout.simulator.bodies.length === 0, 'No bodies in the simulator');

  t.end();
});

test('physics simulator', function (t) {
  t.test('has default simulator', function (t) {
    const graph = new Graph();
    const layout = createGraphologyLayout(graph);

    t.ok(layout.simulator, 'physics simulator is present');
    t.end();
  });

  t.test('can override default settings', function (t) {
    const graph = new Graph();
    const layout = createGraphologyLayout(graph, {
      theta: 1.5
    });
    t.equal(layout.simulator.theta(), 1.5, 'Simulator settings are overridden');
    t.end();
  });

  t.test('it can get the number of dimensions used by the simulation', function(t) {
    t.test('it can read the default number', function (t) {
      const g = new Graph();
      const layout = createGraphologyLayout(g);

      t.ok(2 == layout.getDimensions(), 'layout is 2D');
      t.end();
    });
    t.test('it can read the number supplied by settings', function (t) {
      const g = new Graph();
      const layout = createGraphologyLayout(g, {dimensions: 3});

      t.ok(3 == layout.getDimensions(), 'layout is 3D');
      t.end();
    });

    t.end();
  });

  t.end();
});

test('it removes removed nodes', function (t) {
  const graph = new Graph();
  const layout = createGraphologyLayout(graph);
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);

  layout.step();
  graph.clear();

  // since we removed everything from graph rect should be empty:
  const rect = layout.getGraphRect();

  t.ok(rectangleIsEmpty(rect), 'Graph rect is empty');
  t.end();
});

test('it can iterate over bodies', function(t) {
  const graph = new Graph();
  const layout = createGraphologyLayout(graph);
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);
  let calledCount = 0;

  layout.forEachBody(function(body, bodyId) {
    t.ok(body.pos, bodyId + ' has position');
    t.ok(graph.hasNode(bodyId), bodyId + ' matches a graph node');
    calledCount += 1;
  });

  t.equal(calledCount, 2, 'Both bodies are visited');
  t.end();
});

test('it handles large graphs', function (t) {
  const graph = new Graph({'multi': true}); // Multigraph in case random edges create parallels
  const layout = createGraphologyLayout(graph);

  const count = 60000;

  let i = count;
  while (i--) {
    graph.addNode(i);
  }

  // link each node to 2 other random nodes
  i = count;
  while (i--) {
    graph.addEdge(i.toString(), Math.floor(Math.random() * graph.order));
    graph.addEdge(i.toString(), Math.floor(Math.random() * graph.order));
  }

  layout.step();

  t.ok(layout.simulator.bodies.length !== 0, 'Bodies in the simulator');
  t.end();
});

test('it can create high dimensional layout', function(t) {
  const graph = new Graph();
  graph.addNode(1);
  graph.addNode(2);
  graph.addEdge(1, 2);
  const layout = createGraphologyLayout(graph, {dimensions: 6});
  layout.step();

  const pos = layout.getNodePosition('1');
  t.ok(pos.x !== undefined, 'Position has x');
  t.ok(pos.y !== undefined, 'Position has y');
  t.ok(pos.z !== undefined, 'Position has z');
  t.ok(pos.c4 !== undefined, 'Position has c4');
  t.ok(pos.c5 !== undefined, 'Position has c5');
  t.ok(pos.c6 !== undefined, 'Position has c6');
  t.end();
});

test('it can layout two graphs independently', function(t) {
  const graph1 = new Graph();
  const graph2 = new Graph();
  const layout1 = createGraphologyLayout(graph1);
  const layout2 = createGraphologyLayout(graph2);
  graph1.addNode(1);
  graph1.addNode(2);
  graph1.addEdge(1, 2);
  graph2.addNode(1);
  graph2.addNode(2);
  graph2.addEdge(1, 2);
  layout1.step();
  layout2.step();
  layout2.step();
  t.ok(layout1.getNodePosition('1').x !== layout2.getNodePosition('1').x, 'Positions are different');
  t.end();
});

function positionChanged(pos1, pos2) {
  return (pos1.x !== pos2.x) || (pos1.y !== pos2.y);
}

function copy(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function rectangleIsEmpty(rect) {
  return rect.min_x === 0 && rect.min_y === 0 && rect.max_x === 0 && rect.max_y === 0;
}
