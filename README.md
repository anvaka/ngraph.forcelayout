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
