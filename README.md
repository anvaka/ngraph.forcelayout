# ngraph.forcelayout 

[![build status](https://github.com/anvaka/ngraph.forcelayout/actions/workflows/tests.yaml/badge.svg)](https://github.com/anvaka/ngraph.forcelayout/actions/workflows/tests.yaml)

This is a [force directed](http://en.wikipedia.org/wiki/Force-directed_graph_drawing) graph layout algorithm, 
that works in any dimension (2D, 3D, and above).

The library uses quad tree to speed up computation of long-distance forces.

This repository is part of [ngraph family](https://github.com/anvaka/ngraph), and operates on 
[`ngraph.graph`](https://github.com/anvaka/ngraph.graph) data structure.

# API

All force directed algorithms are iterative. We need to perform multiple iterations of an algorithm, 
before graph starts looking good:

``` js
// graph is an instance of `ngraph.graph` object.
var createLayout = require('ngraph.forcelayout');
var layout = createLayout(graph);
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

If you'd like to perform graph layout in space with more than two dimensions, just add one
argument to this line:

``` js
let layout = createLayout(graph, {dimensions: 3}); // 3D layout
let nodePosition = layout.getNodePosition(nodeId); // has {x, y, z} attributes
```

Even higher dimensions are not a problem for this library:

``` js
let layout = createLayout(graph, {dimensions: 6}); // 6D layout
// Every layout with more than 3 dimensions, say N, gets additional attributes:
// c4, c5, ... cN
let nodePosition = layout.getNodePosition(nodeId); // has {x, y, z, c4, c5, c6} 
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

## Physics Simulator

Simulator calculates forces acting on each body and then deduces their position via Newton's law.
There are three major forces in the system:

1. Spring force keeps connected nodes together via [Hooke's law](http://en.wikipedia.org/wiki/Hooke's_law)
2. Each body repels each other via [Coulomb's law](http://en.wikipedia.org/wiki/Coulomb's_law)
3. The drag force slows the entire simulation down, helping with convergence.

Body forces are calculated in `n*lg(n)` time with help of Barnes-Hut algorithm implemented with quadtree.

``` js
// Configure
var physicsSettings = {
  timeStep: 0.5,
  dimensions: 2,
  gravity: -12,
  theta: 0.8,
  springLength: 10,
  springCoefficient: 0.8,
  dragCoefficient: 0.9,
  maxVelocity: 4,
  integrator: 'euler',
  nbody: 'quadtree',
};

// pass it as second argument to layout:
var layout = require('ngraph.forcelayout')(graph, physicsSettings);
```

### Faster layouts

Each step moves a body by at most `timeStep * maxVelocity`. The default `maxVelocity`
is 4 since v3.4 (it was fixed at 1 before), which lets layouts settle in fewer steps.
Pass `maxVelocity: 1` to get exactly the same layouts as in previous versions.

Two more settings make large graphs converge several times faster. They are off by default:

``` js
var layout = require('ngraph.forcelayout')(graph, {
  // FIRE integrator: keeps momentum while the layout improves, and stops the
  // system when it overshoots. Ignores `dragCoefficient`.
  integrator: 'fire',
  // Dual tree traversal: pairs of tree cells interact with each other, instead
  // of every body walking the tree. 5-10x faster repulsion on large graphs, with
  // about the same accuracy for the same `theta`.
  nbody: 'dualtree',
});
```

On graphs with several separate pieces, the pieces drift apart faster with these settings.

All three settings can also be changed while the layout runs, e.g. `layout.simulator.nbody('dualtree')`.

You can get current physics simulator from layout by checking `layout.simulator`
property. This is a read only property. 

## Changing the physics

Every step of the simulator runs a list of named stages:

``` js
layout.simulator.stages();
// ['clear', 'repulsion', 'drag', 'springs', 'integrate']
```

`clear` zeroes forces, `repulsion` makes every pair of nodes push apart, `drag` slows bodies
down (the FIRE integrator skips it), `springs` pulls linked nodes together, and `integrate`
moves bodies. Numbers of all bodies are kept in flat arrays, so new physics works in any
number of dimensions without knowing axis names:

``` js
var simulator = layout.simulator;

// A pull towards the origin. Axis k of body i is pos[i * D + k].
simulator.addStage('pullToCenter', function (store) {
  var pos = store.pos, force = store.force, D = store.D;
  for (var i = 0; i < store.n * D; ++i) force[i] -= 0.01 * pos[i];
});
```

New stages run just before `integrate`; pass `{ before: name }` or `{ after: name }` to put
them elsewhere (`{ after: 'integrate' }` moves bodies after they were integrated).
`replaceStage(name, fn)` swaps a stage in place, `removeStage(name)` removes it, and
`getStage(name)` returns its function, e.g. to wrap the built in springs.

The store has columns `pos`, `velocity`, `force` (`D` numbers per body), `mass`, `pinned`
and `degree` (the number of springs of a body). More columns can be added with
`store.define(name, Float64Array)`; they grow and shrink with the bodies. When bodies or
springs are added or removed, the simulator fires `'topology'` before the next step, and
`simulator.bodies[i]` is the body of row `i` (`body.id` is its node id).

`simulator.unit()` is a length to measure ideas in: the spring length, but never 0.

### Repulsion law

Two nodes push each other with `gravity * charge1 * charge2 * F(r)`. By default
`F(r) = 1/r^2`. The law can be any expression of the distance `r`:

``` js
var layout = createLayout(graph, {
  // A push that fades out past 3 spring lengths. Parameters are read every step.
  repulsionLaw: {
    force: 'exp(-r / L) / r^2',
    params: { L: function (simulator) { return 3 * simulator.unit(); } },
    // optional: pairs (and tree cells) farther apart than this are skipped
    range: 'L * 8'
  }
});
// or, while the layout runs:
layout.simulator.repulsionLaw('r^(1 - D)'); // how charges push in D dimensions
```

The expression is compiled into both the quad tree and the dual tree (its derivative, which
the dual tree needs, is derived automatically), so a new law keeps all speed-ups. Expressions
know `+ - * / ^`, `r`, `D` (number of dimensions), the law's parameters, and `exp`, `log`,
`sqrt`, `abs`, `min`, `max`, `pow`, `tanh`, `sin`, `cos`. Other functions can be passed as
`functions: { name: { value: fn, derivative: fn } }`.

A law that fades fast leaves mostly the pushes of near nodes, which the trees approximate less
well: in 3D, `theta: 0.5` gives such a law the accuracy that 1/r^2 has at the default 0.8.

Charges are masses by default. To push with something else, give the layout a `nodeCharge`
function, or set `repulsionCharge` to the name of a body column. A body feels the push of
others with its charge too, unless `repulsionSensitivity` names another column: a body with
charge 0 and sensitivity 1 is pushed by everyone but pushes nobody, and costs the quad tree
nothing.

### Rules for close pairs

Forces that only act between close nodes (contact, personal space) are pair rules. The
simulator finds close pairs with one grid, shared by all rules, in any dimension:

``` js
simulator.addPairRule('personalSpace', {
  radius: function (simulator) { return simulator.unit(); },
  // returns s; the force s * (pos_i - pos_j) is added to i, the opposite one to j
  rule: function (i, j, r, store) { return 0.5 * (1 / r - 1 / simulator.unit()); }
});
```

With `symmetric: false` the rule is asked for both `(i, j)` and `(j, i)` and only moves the
first body. Two bodies on the same spot get `r = 0`, and `s` is then the size of their push
along an axis picked from `i` and `j`. A rule that divides by `r`, as above, gives no finite `s`
there and leaves them alone. `simulator.neighbors(cellSize)` gives the grid to stages that need their own
neighbor queries.

## Space occupied by graph

Finally, it's often desirable to know how much space does our graph occupy. To
quickly get bounding box use `getGraphRect()` method:

``` js
var rect = layout.getGraphRect();
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
var graph = createGraph();
graph.addLink(1, 2);

// Get body that represents node 1:
var body = layout.getBody(1);
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
  assert(graph.getNode(nodeId), 'NodeId is coming from the graph');
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
npm install ngraph.forcelayout
```

Or download from CDN:

``` html
<script src='https://unpkg.com/ngraph.forcelayout@3.0.0/dist/ngraph.forcelayout.min.js'></script>
```

If you download from CDN the library will be available under `ngraphCreateLayout` global name.

# license

MIT

# Feedback?

I'd totally love it! Please email me, open issue here, [tweet](https://twitter.com/anvaka) to me,
or join discussion [on gitter](https://gitter.im/anvaka/VivaGraphJS).

If you love this library, please consider sponsoring it at https://github.com/sponsors/anvaka or at
https://www.patreon.com/anvaka
