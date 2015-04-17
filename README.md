ngraph.forcelayout
==========================
[![Build Status](https://travis-ci.org/anvaka/ngraph.forcelayout.png?branch=master)](https://travis-ci.org/anvaka/ngraph.forcelayout)

This is a [force directed](http://en.wikipedia.org/wiki/Force-directed_graph_drawing)
graph layouter in 2d. It is using quad tree as an n-body solver. This repository
is part of [ngraph family](https://github.com/anvaka/ngraph), and operates on
[`ngraph.graph`](https://github.com/anvaka/ngraph.graph) data structure. If you
want to go the 3D space, please check out [`ngraph.forcelayout3d`](https://github.com/anvaka/ngraph.forcelayout3d)

[![Gitter](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/anvaka/VivaGraphJS)

# API

First of all it's worth to mention all force directed algorithms are iterative. We need to
perform multiple iterations of an algorithm, before graph starts looking aesthetically pleasing.

With that in mind, the easiest way to make graph look nice is:

``` js
// graph is an instance of `ngraph.graph` object.
var layout = require('ngraph.forcelayout')(graph);
for (var i = 0; i < ITERATIONS_COUNT; ++i) {
  layout.step();
}

// now we can ask layout where each node/link is best positioned:
graph.forEachNode(function(node) {
  console.log(layout.getNodePosition(node.id));
  // Node position is pair of x,y coordinates:
  // {x: ... , y: ... }
});

graph.forEachLink(function(link) {
  console.log(layout.getLinkPosition(link.id));
  // link position is a pair of two positions:
  // {
  //   from: {x: ..., y: ...},
  //   to: {x: ..., y: ...}
  // }
});
```


Result of `getNodePosition()`/`getLinkPosition()` will be always the same for
the same node. This is true:

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
var nodeToPin = graph.getNode(nodeId);
layout.pinNode(nodeToPin, true); // now layout will not move this node
```

If you want to check whether node is pinned or not you can use `isNodePinned()`
method. Here is an example how to toggle node pinning, without knowing it's
original state:

``` js
var node = graph.getNode(nodeId);
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
via [graph events](https://github.com/anvaka/ngraph.graph#listening-to-events).
It keeps layout up to date whenever graph changes:

``` js
var graph = require('ngraph.graph')(); // empty graph
var layout = require('ngraph.layout')(graph); // layout of empty graph

graph.addLink(1, 2); // create node 1 and 2, and make link between them
layout.getNodePosition(1); // returns position.
```

If you want to stop monitoring graph events, call `dispose()` method:

``` js
layout.dispose();
```

## Configuring physics

Since this is force directed layout, sometimes it's desirable to adjust physics simulator.
Please refer to [ngraph.physics.simulator](https://github.com/anvaka/ngraph.physics.simulator)
to see source code and simulator parameters. Once you have instance of physics
simulator you can pass it as a second argument to layout constructor:

``` js
// Configure
var physicsSettings = {
  springLength: 30,
  springCoeff: 0.0008,
  gravity: -1.2,
  theta: 0.8,
  dragCoeff: 0.02,
  timeStep: 20
};

// pass it as second argument to layout:
var layout = require('ngraph.forcelayout')(graph, physicsSettings);
```

You can get current physics simulator from layout by checking `layout.simulator`
property. This is a read only property.

## Space occupied by graph

Finally, it's often desirable to know how much space does our graph occupy. To
quickly get bounding box use `getGraphRect()` method:

``` js
var rect = layout.getGraphRect();
// rect.x1, rect.y1 - top left coordinates of bounding box
// rect.x2, rect.y2 - bottom right coordinates of bounding box
```

# install

With [npm](https://npmjs.org) do:

```
npm install ngraph.forcelayout
```

# license

MIT

# Feedback?

I'd totally love it! Please email me, open issue here, [tweet](https://twitter.com/anvaka) to me,
or join discussion [on gitter](https://gitter.im/anvaka/VivaGraphJS).
