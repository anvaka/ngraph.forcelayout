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
* Formulas: `addNodeFormula()`, `addLinkFormula()`, `addPairFormula()` and `addSum()` compile
  a formula into a loop the simulator owns, so it costs what its arithmetic costs and other
  engines can run the same text. Laws are written in the same language, which now has
  conditions, named values, lookup tables, `floor`/`ceil`/`round`/`sign`/`clamp`, and built in
  values such as `dt`, `step` and `unit`.
* `addRepulsion()` - more tree passes, each with its own law, charges and sensitivity.
* `simulator.plan(backend)` - which stages an engine (such as the WebGPU module) can run, and
  why not, with warnings. Stages can `replace` another stage.
* `simulator.program()` - the whole step as plain data (settings, columns and who writes them,
  stages in order with their shape, formula, reads, writes and options), for other engines,
  inspectors and tests; `simulator.stageValues(name, context)` gives a stage's numbers for a step.
  A formula compiles to other languages through a printer: `formula.compile(text, scope,
  printer)`, `law.emit(printer, ...)`.
* `when` - any stage can run on some steps only, e.g. `'step - floor(step / 25) * 25 == 0'`.
  A gated sum keeps its last result.
* `simulator.addHostStep(name, {when, reads, writes, run})` - JavaScript that needs data in the
  middle of a step, at its place among the stages.
* `inertia` setting and `simulator.inertia(name)` - forces are divided by this column (the mass
  by default) when bodies move.
* `startAtZero` for link and pair formulas, and `axis(k)` in formulas.
* A `'settings'` event from the setters, and column versions (`store.versions`,
  `store.changed(name)`) for engines that keep their own copy of the numbers. Setters of bodies
  and springs mark their column, positions set with `setNodePosition()` included.
  `simulator.programVersion()` tells when the structure of a step changed.
* `simulator.iteration(n)` sets the step count; `simulator.applyEdits()` applies graph edits and
  fires `'topology'` at once; `addStage(name, run, {describe})` lets an add-on stage describe
  itself.

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
* Functions that give stages and laws their numbers (params, radii, ranges) get the step
  context, not the simulator: `iteration()`, `settings`, getters of settings, `unit()`,
  `store.n` and `store.D`. It has no columns: data goes through formulas, sums and host steps.
* `x += v` in link and pair formulas adds onto the column's value at the stage's start. Before,
  such a column started every pass at 0, which also erased the forces of earlier stages for
  `force_i += ...`. List scratch columns in `startAtZero` to keep the old meaning.
* `pos` is read only in formulas, and a link or pair formula cannot read a column it adds into.
* A pair formula skips bodies on exactly the same spot (r = 0): no push, nothing added up.
* A backend's `check(stage, program, simulator)` gets stages of `program()`, and
  `checkProgram(program, simulator)` replaces `checkSettings(simulator)`.

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