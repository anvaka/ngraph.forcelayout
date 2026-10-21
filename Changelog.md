# Unreleased

The physics can now be changed without copying library code (see "Changing the physics" in
the README):

* Numbers of all bodies and springs live in flat typed arrays (`simulator.store`,
  `simulator.springStore`), so new forces work in any number of dimensions. Ideas can add
  their own columns with `store.define()`.
* Every step runs named stages (`clear`, `repulsion`, `drag`, `springs`, `integrate`) that can
  be added, replaced, removed or wrapped.
* `repulsionLaw` - the push between two nodes can be any expression of the distance, e.g.
  `'exp(-r / L) / r^2'`. It is compiled into both the quad tree and the dual tree. The 2D only
  bundle (`dist/ngraph.forcelayout2d.js`) has pre-generated code for 1/r^2 only, and throws for
  other laws.
* `repulsionCharge` / `nodeCharge` - nodes can push with a charge other than their mass, and
  `repulsionSensitivity` - feel the push with yet another number.
* `simulator.addPairRule()` - forces between close nodes, found with one shared grid.
* `simulator.unit()`, `simulator.iteration()`, `body.degree` and a `'topology'` event.

Steps are 3-35% faster than in 3.3, and layouts are the same to the last bit.

Breaking changes:

* `simulator.addForce()`, `removeForce()` and `getForces()` are removed: use stages.
* `simulator.quadTree` and `invalidateBBox()` are removed.
* `body.pos`, `body.force` and `body.velocity` (and so `layout.getNodePosition()`) are views
  into the store. Reading and writing `x`, `y`, ... works as before, but `{...pos}`,
  `Object.keys(pos)` and deep comparisons no longer see the axes. `pos.toJSON()` gives a plain
  `{x, y, ...}` copy (`JSON.stringify` uses it).
* `addSpring()` needs bodies that are in the simulator (`addBody()` them first).
* `removeBody()` also removes the body's springs.
* `body.springCount` and `body.springLength` are only kept up to date when
  `adaptiveTimeStepWeight` is not 0; use `body.degree` for the number of springs.

* `maxVelocity` - replaces the hard coded speed limit of 1. **The default is 4**, so layouts
  settle in fewer steps, and default layouts are different from previous versions. Pass
  `maxVelocity: 1` to get the old layouts.

New opt-in settings to make layouts faster:

* `integrator: 'fire'` - Fast Inertial Relaxation Engine integrator.
* `nbody: 'dualtree'` - dual tree traversal for repulsion forces. Works in any dimension.

Fixes:

* Adaptive time step of one body no longer leaks into the next bodies.
* Quad tree bounds are correct when all bodies have negative coordinates.

# v3.0 

The following physics settings are renamed: 

* `springCoeff -> springCoefficient`
* `dragCoeff -> dragCoefficient`

A new interactive demo is added to the library: http://anvaka.github.io/ngraph.forcelayout/.

Also the library is now available for consumption via CDN.

# v2.0

Major rework on how library treats dimensions of space. Previous versions of the library
required concrete implementation for the given space (e.g. [3d](https://github.com/anvaka/ngraph.forcelayout3d), [N-d](https://github.com/anvaka/ngraph.forcelayout.nd)).

With version 2.0, `ngraph.forcealyout` generates code on the fly to support layout in the
given dimension. This comes at no extra performance cost to the consumer.

Second big change, is that custom forces can now be added to the library via `simulator.addForce()`
`simulator.removeForce()` api.

With this change, the old `physicsSimulator` factory methods became obsolete and were removed
(like `settings.createQuadTree`, `settings,createBounds`, [etc.](https://github.com/anvaka/ngraph.forcelayout/blob/d2eea4a5dd6913fb0002787d91d211916b56ba01/lib/physicsSimulator.js#L50-L55) )

# 0.xx - V1.0

This was original implementation of the ngraph.forcelayout.