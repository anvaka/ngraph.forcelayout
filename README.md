ngraph.forcelayout
==========================
[![Build Status](https://travis-ci.org/anvaka/ngraph.forcelayout.png?branch=master)](https://travis-ci.org/anvaka/ngraph.forcelayout)

This is a [force directed](http://en.wikipedia.org/wiki/Force-directed_graph_drawing) graph layouter. It is using quad tree as an n-body solver. 

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

Note: result of `getNodePosition()`/`getLinkPosition()` will be always the same for the same node. This is true:

``` js
  layout.getNodePosition(1) === layout.getNodePosition(1);
```

Reason for this is performance. If you are interested in storing positions somewhere else, you can do it and they still will be updated after each force directed layout iteration.

## "Pin" node and initial position

Sometimes it's desirable to tell layout algorithm not to move certain nodes. This can be done with `pinNode()` method:

``` js
  var nodeToPin = graph.getNode(nodeId);
  layout.pinNode(nodeToPin, true); // now layout will not move this node
```

If you want to check whether node is pinned or not you can use `isNodePinned()` method. Here is an example how to toggle node pinning, without knowing it's original state:

``` js
  var node = graph.getNode(nodeId);
  layout.pinNode(node, !layout.isNodePinned(node)); // toggle it
```

What if you still want to move your node according to some external factor (e.g. you have initial positions, or user drags pinned node)? To do this, call `setNodePosition()` method:

``` js
  layout.setNodePosition(nodeId, x, y);
```
