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
springs are added or removed, the simulator fires `'topology'` before the next step (or at
once, with `simulator.applyEdits()`), and `simulator.bodies[i]` is the body of row `i`
(`body.id` is its node id).

`simulator.unit()` is a length to measure ideas in: the spring length, but never 0.

Forces are divided by the mass when bodies move. `simulator.inertia('column')` divides them by
another column instead, so a body can respond slowly without pushing others harder.

A stage can run on some steps only: `{ when: 'step - floor(step / 25) * 25 == 0' }` (an
expression of `step` and the settings, or a function of the step context) gates any stage. A
`when` is tested once per step: stages with the same text (that reads no params of their own)
share the answer.

JavaScript that needs data in the middle of a step is a host step. It runs at its place among
the stages; engines that keep their own copy of the numbers (a GPU, a worker) hand over the
columns it names, on the steps where `when` holds:

``` js
simulator.addHostStep('measure', {
  when: 'step == 300', reads: ['pos'], writes: [],
  run: function (simulator) { /* reads simulator.store.pos */ }
});
```

Setters of settings fire `'settings'` (`simulator.on('settings', function (key, value) {})`).
Change settings only through them (`simulator.springLength(20)`, `simulator.nbody('dualtree')`,
...). A direct write such as `simulator.settings.springLength = 20` changes the next steps on the
CPU, but fires no event: `'settings'` listeners don't see it, and neither do engines that keep
their own copy of the numbers.
Every column has a version, `store.versions[name]`, that grows when it changes. Setters mark
their column: `body.mass`, `body.isPinned`, `spring.length`, `spring.coefficient`, and positions
and velocities written through a body (`layout.setNodePosition()`, `body.setPosition()`,
`body.pos.x = ...`). Code that writes a column's array directly calls `store.changed(name)` so
that such engines see it.

### Repulsion law

Two nodes push each other with `gravity * charge1 * charge2 * F(r)`. By default
`F(r) = 1/r^2`. The law can be any expression of the distance `r`:

``` js
var layout = createLayout(graph, {
  // A push that fades out past 3 spring lengths. Parameters are read every step.
  repulsionLaw: {
    force: 'exp(-r / L) / r^2',
    params: { L: function (context) { return 3 * context.unit(); } },
    // optional: pairs (and tree cells) farther apart than this are skipped
    range: 'L * 8'
  }
});
// or, while the layout runs:
layout.simulator.repulsionLaw('r^(1 - D)'); // how charges push in D dimensions
```

The expression is compiled into both the quad tree and the dual tree (its derivative, which
the dual tree needs, is derived automatically), so a new law keeps all speed-ups. A law is
written in the formula language described below: besides `r` and its parameters it can use
conditions (`r < L ? 1 / r^2 : 0`), named values (`'u = r / L; exp(-u) / r^2'`), the built in
values and lookup tables (`tables: { T: { from, to, values } }`). JS functions can be passed as
`functions: { name: { value: fn, derivative: fn } }`, but they keep the law on the CPU.

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
  radius: function (context) { return context.unit(); },
  // returns s; the force s * (pos_i - pos_j) is added to i, the opposite one to j
  rule: function (i, j, r, store) { return 0.5 * (1 / r - 1 / simulator.unit()); }
});
```

With `symmetric: false` the rule is asked for both `(i, j)` and `(j, i)` and only moves the
first body. Two bodies on the same spot get `r = 0`, and `s` is then the size of their push
along an axis picked from `i` and `j`. A rule that divides by `r`, as above, gives no finite `s`
there and leaves them alone. `simulator.neighbors(cellSize)` gives the grid to stages that need their own
neighbor queries. Pair rules are JavaScript, so only the CPU runs them; pair formulas (below) do
the same on every engine.

### Formulas

Most new physics is "for every node", "for every link" or "for every close pair, do this
arithmetic". Written as a formula, the simulator owns the loop and compiles the formula into it,
so it costs what its arithmetic costs, works in any dimension, and other engines can run the
same text (`plan()` below tells which):

``` js
// A pull of every node towards the center of mass
simulator.addSum('total', { formula: 'mass' });
simulator.addSum('weighted', { formula: 'mass * pos' });
simulator.addNodeFormula('pullToCenter', {
  formula: 'force += -k * mass * (pos - weighted / total)',
  params: { k: 0.01 }
});

// Springs that stiffen when stretched past 3 spring lengths, in place of the stock springs
simulator.addLinkFormula('stiffSprings', {
  replace: 'springs',
  formula: 'stretch = max(0, r - length) / (3 * length); pull = coefficient * (r - length) * (1 + stretch^2)'
});

// Close nodes push apart, and count how crowded they are this step
simulator.store.define('crowd');
simulator.addPairFormula('personalSpace', {
  radius: 'h',
  params: { h: function (context) { return context.unit(); } },
  startAtZero: ['crowd'],
  formula: 'w = 1 - r / h; crowd_i += w; crowd_j += w; push = 2 * w'
});
```

A formula is a list of statements separated by `;`. It assigns named values (`w = ...`),
columns, or the stage's output, and knows numbers, `+ - * / ^`, comparisons, `&& || !`,
`c ? a : b` (also `select(c, a, b)`), and the functions `exp`, `log`, `sqrt`, `abs`, `sign`,
`floor`, `ceil`, `round`, `tanh`, `sin`, `cos`, `min`, `max`, `pow`, `clamp(x, lo, hi)`, and
`dot(a, b)`, `length(a)`, `axis(k)` (the unit vector along axis `k`) for vectors. Columns of `D`
numbers (`pos`, `velocity`, `force`) are vectors: they add, subtract, multiply or divide by
numbers, and `*=` scales them. Every formula can read its `params`, its lookup `tables`, the
results of sums, and the built in values `D`, `pi`, `n` (number of bodies), `step` (steps done),
`dt`, `unit`, and the settings `springLength`, `springCoefficient`, `gravity`,
`dragCoefficient`, `theta`, `timeStep`, `maxVelocity`.

Params are numbers, or functions read once per step. Such a function gets the step context, not
the simulator: `iteration()`, `settings` (read only), a getter for every setting
(`springLength()`, `gravity()`, ...), `unit()`, and `store.n`, `store.D`. It has no columns or
positions, because other engines call it for steps they queue: data goes through formulas, sums
and host steps.

What a write means depends on its operator, on every engine: `x = v` replaces the value, and
`x += v` or `x -= v` add onto the value `x` has when the stage starts. Formulas never move
bodies (`pos` is read only; `integrate` and host steps move them).

* `addNodeFormula(name, options)` runs for every body and reads and assigns its columns by name.
* `addLinkFormula(name, options)` runs for every link. It reads the distance `r`, the link's
  `length` and `coefficient` (the settings when the link has none), its own columns
  (`springStore.define()`), and the columns of its ends as `mass_i` (from) and `mass_j` (to). It
  sets `pull`, which pulls the ends together (negative pushes them apart). The stock springs are
  `pull = coefficient * (r - length)`, and with `replace: 'springs'` that formula gives exactly the
  stock numbers, random nudges of links of length 0 included, at the stock springs' speed. A link
  formula can also set its link's own spring with `coefficient = ...` and `length = ...` (the
  springs then use them; `coefficient <= 0` and `length < 0` still mean the settings). One that
  sets no `pull` adds no force and costs only its arithmetic.
* `addPairFormula(name, options)` runs for every pair closer than `radius` (a number, an
  expression of the params, or a function). It reads `r` and the columns of both bodies and sets
  `push`. With `symmetric: false` it runs for `(i, j)` and `(j, i)` and pushes only `i`. Bodies on
  the same spot have no direction to push along: such a pair pushes nothing and adds nothing up.
  It replaces a pair rule and is faster: the pass takes about 0.7x the time of the same pair rule.
* Link and pair formulas can add into body columns (`crowd_i += ...`, `force_j += ...`); they add
  onto what the column holds. A column listed in the stage's `startAtZero` (never `pos`,
  `velocity` or `force`) starts each pass at 0 instead, so later formulas read what this pass
  added up; `plan()` warns about a column that only grows. Such a formula cannot read a column
  it adds into (it would see a partial sum): read it in a later stage.
* `addSum(name, options)` adds up a formula over all bodies (or links, with `over: 'links'`), or
  takes its `reduce: 'min'` or `'max'`. With `group: 'column'` it keeps one result per group id;
  formulas read that as `name[group]`. Place sums before the formulas that read them.
* `addRepulsion(name, { law, charge, sensitivity })` adds another tree pass with its own law and
  columns, e.g. a short push between leaves only. Passes next to each other and to `repulsion`
  walk one quad tree with a charge each, so a pass costs a fraction of a walk of its own.
  `nbody: 'dualtree'` does not apply to such a walk: it is always a quad tree walk, several times
  slower than a stock dual tree step, and `plan()` warns about it. Each charge acts from its own centre in a tree cell, so it should not be
  negative; with `centroid: 'shared'` it acts from the centre of the walk's first charge, which is
  faster and lets it be signed. A pass that is gated with `when`, or kept apart by another stage,
  walks alone. `program()` lists each tree stage's walk in `args.walk`.

All of them take `before`, `after` or `replace` as stages do, and `when`; `removeStage(name)`
removes them (a replaced stage comes back).

`simulator.program()` describes the whole step as plain data: settings, columns and who writes
them, and every stage in order with its shape, formula, what it reads and writes and how, its
params and options. Engines compile from it; functions appear as `{kind: 'host'}`, and
`simulator.stageValues(name, context)` gives a stage's numbers for a step (params, radius, `when`,
the built in values it reads, a law's values). `simulator.programVersion()` tells when the
structure changed without building the description. A stage of an add-on
module describes itself with `addStage(name, run, { describe: { shape: 'grid', ... } })`, and
`values: function (context) { ... }` gives its numbers for a step.
`simulator.plan(backend)` tells which stages an engine can run, and why not: the WebGPU module
in `modules/gpu` exports `gpuBackend` for it. JS stages and pair rules run on the CPU only.

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
