# graphology.forcelayout 

[![build status](https://github.com/AddingBurritos/graphology.forcelayout/actions/workflows/tests.yaml/badge.svg)](https://github.com/AddingBurritos/graphology.forcelayout/actions/workflows/tests.yaml)

This is a [force directed](http://en.wikipedia.org/wiki/Force-directed_graph_drawing) graph layout algorithm, 
that works in any dimension (2D, 3D, and above).

The library uses quad tree to speed up computation of long-distance forces.

This repository is inspired by [ngraph family](https://github.com/anvaka/ngraph), and operates on 
[`graphology`](https://github.com/graphology/graphology) data structure.

# API

All force directed algorithms are iterative. We need to perform multiple iterations of an algorithm, 
before graph starts looking good:

``` js
// graph is an instance of `graphology` object.
import createLayout from 'graphology.forcelayout';
const layout = createLayout(graph);
for (let i = 0; i < ITERATIONS_COUNT; ++i) {
  layout.step();
}

// now we can ask layout where each node/edge is best positioned:
graph.forEachNode(function(nodeId) {
  console.log(layout.getNodePosition(nodeId));
  // Node position is pair of x,y coordinates:
  // {x: ... , y: ... }
});

graph.forEachEdge(function(edgeId) {
  console.log(layout.getLinkPosition(edgeId));
  // edge position is a pair of two positions:
  // {
  //   from: {x: ..., y: ...},
  //   to: {x: ..., y: ...}
  // }
});
```

If you'd like to perform graph layout in space with more than two dimensions, just add one
argument to this line:

``` js
const layout = createLayout(graph, {dimensions: 3}); // 3D layout
const nodePosition = layout.getNodePosition(nodeId); // has {x, y, z} attributes
```

Even higher dimensions are not a problem for this library:

``` js
const layout = createLayout(graph, {dimensions: 6}); // 6D layout
// Every layout with more than 3 dimensions, say N, gets additional attributes:
// c4, c5, ... cN
const nodePosition = layout.getNodePosition(nodeId); // has {x, y, z, c4, c5, c6} 
```

Note: Higher dimensionality comes at exponential cost of memory for every added
dimension. See a performance section below for more details.

## Node position and object reuse

Recently immutability became a ruling principle of javascript world. This library
doesn't follow the rules, and results of `getNodePosition()`/`getLinkPosition()` will be
always the same for the same node. This is true:

``` js
layout.getNodePosition(1) === layout.getNodePosition(1);
```

Reason for this is performance. If you are interested in storing positions
somewhere else, you can do it and they still will be updated after each force
directed layout iteration.

## "Pin" node and initial position

Sometimes it's desirable to tell layout algorithm not to move certain nodes.
This can be done with `pinNode()` method:

``` js
layout.pinNode(nodeToPin, true); // now layout will not move this node
```

If you want to check whether node is pinned or not you can use `isNodePinned()`
method. Here is an example how to toggle node pinning, without knowing it's
original state:

``` js
layout.pinNode(node, !layout.isNodePinned(node)); // toggle it
```

What if you still want to move your node according to some external factor (e.g.
you have initial positions, or user drags pinned node)? To do this, call
`setNodePosition()` method:

``` js
layout.setNodePosition(nodeId, x, y);
```

## Monitoring changes

Like many other algorithms in `ngraph` family, force layout monitors graph changes
via [graphology events](https://graphology.github.io/events.html).
It keeps layout up to date whenever graph changes:

``` js
import Graph from 'graphology';
import createLayout from 'graphology.forcelayout';
const graph = new Graph(); // empty graph
const layout = createLayout(graph); // layout of empty graph

graph.addNode("test"); // create test node
layout.getNodePosition("test"); // returns position.
```

If you want to stop monitoring graph events, call `dispose()` method:

``` js
layout.dispose();
```

## Physics Simulator

Simulator calculates forces acting on each body and then deduces their position via Newton's law.
There are three major forces in the system:

1. Spring force keeps connected nodes together via [Hooke's law](http://en.wikipedia.org/wiki/Hooke's_law)
2. Each body repels each other via [Coulomb's law](http://en.wikipedia.org/wiki/Coulomb's_law)
3. The drag force slows the entire simulation down, helping with convergence.

Body forces are calculated in `n*lg(n)` time with help of Barnes-Hut algorithm implemented with quadtree.

``` js
// Configure
const physicsSettings = {
  timeStep: 0.5,
  dimensions: 2,
  gravity: -12,
  theta: 0.8,
  springLength: 10,
  springCoefficient: 0.8,
  dragCoefficient: 0.9,
};

// pass it as second argument to layout:
const layout = createLayout(graph, physicsSettings);
```

You can get current physics simulator from layout by checking `layout.simulator`
property. This is a read only property. 

## Space occupied by graph

Finally, it's often desirable to know how much space does our graph occupy. To
quickly get bounding box use `getGraphRect()` method:

``` js
const rect = layout.getGraphRect();
// rect.min_x, rect.min_y - left top coordinates of the bounding box
// rect.max_x, rect.max_y - right bottom coordinates of the bounding box
```

## Manipulating bodies

This is advanced technique to get to internal state of the simulator. If you need
to get a node position use regular `layout.getNodePosition(nodeId)` described
above.

In some cases you really need to manipulate physic attributes on a body level.
To get to a single body by node id:

``` js
const graph = createGraph();
graph.addNode("test");

// Get body that represents node 1:
const body = layout.getBody("test");
assert(
  typeof body.pos.x === 'number' &&
  typeof body.pos.y === 'number', 'Body has position');
assert(body.mass, 'Body has mass');
```

To iterate over all bodies at once:

``` js
layout.forEachBody(function(body, nodeId) {
  assert(
    typeof body.pos.x === 'number' &&
    typeof body.pos.y === 'number', 'Body has position');
  assert(graph.hasNode(nodeId), 'NodeId is coming from the graph');
});
```

# Section about performance

This library is focused on performance of physical simulation. We use quad tree data structure
in 2D space to approximate long distance forces, and reduce amount of required computations.

When layout is performed in higher dimensions we use analogues tree data structure. By design
such tree requires to store `2^dimensions_count` child nodes on each node. In practice, performing
layout in 6 dimensional space on a graph with a few thousand nodes yields decent performance
on modern mac book (graph can be both rendered and layed out at 60FPS rate).

Additionally, the vector algebra is optimized by a ad-hoc code generation. Essentially this means
that upon first load of the library, we check the dimension of the space where you want to perform
layout, and generate all required data structure to run fast in this space. 

The code generation happens only once when dimension is requested. Any subsequent layouts in the same
space would reuse generated codes. It is pretty fast and cool.

# install

With [npm](https://npmjs.org) do:

```
npm install graphology.forcelayout
```

Or download from CDN:

``` html
<script src='https://unpkg.com/graphology.forcelayout@0.1.0/dist/graphology.forcelayout.min.js'></script>
```

If you download from CDN the library will be available under `graphologyCreateLayout` global name.

# license

BSD 3-Clause
