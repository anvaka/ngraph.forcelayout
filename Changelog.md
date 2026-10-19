# Unreleased

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