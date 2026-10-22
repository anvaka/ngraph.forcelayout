# ngraph.forcelayout.gridfield

A density of the bodies on a grid, read back at every body, for `ngraph.forcelayout`. Each step:

1. every body spreads a value (1 by default) over the grid points around it;
2. optionally, the grid is smoothed by one implicit step of the heat equation;
3. every body reads the field back with the same weights, into two ordinary body columns:
   the density at the body (`value`) and its slope (`gradient`, D numbers).

A force is then a plain node formula that reads those columns. This is the particle-mesh
deposit and gather of N-body and SPH codes.

## Usage

``` js
import createLayout from 'ngraph.forcelayout';
import addGridField from 'ngraph.forcelayout.gridfield';

const layout = createLayout(graph);
const simulator = layout.simulator;
const field = addGridField(simulator, 'crowd', {
  anchor: 'box',
  cell: 'unit / 2',                  // layout units
  margin: '3 * range',
  deposit: { value: '1', weights: 'linear' },
  smooth: { diffuse: 'range * range' },
  params: { range: 20 },
  into: { value: 'crowd', gradient: 'crowdSlope' }
});
simulator.addNodeFormula('crowdPush', {
  after: 'crowd',
  params: { k: 500 },
  formula: 'force -= select(pinned == 0, k * crowdSlope, 0 * pos)'
});
// later: simulator.removeStage('crowdPush'); field.dispose();
```

Options:

* `anchor`: where the grid sits.
  * `'box'` (default): its corner is the bodies' smallest corner minus the margin. The cell is
    `cell`, or larger when an axis would need more than `maxCells` cells.
  * `'lattice'`: grid points sit at multiples of `cell`, which never changes. A body at the same
    spot always lands on the same grid points.
* `cell`: the cell size in layout units. For `'box'` it is the smallest cell.
* `margin` (0): room around the bodies, in layout units, for a smoothed field to fade out.
* `maxCells`: cells per axis, at most. It sizes `'box'` grids (default 1024 in 2D, 128 in 3D). A
  `'lattice'` grid without smoothing is never capped on the CPU (see `denseLimit`); on the GPU a
  lattice wider than this stops the layout with a message (default 2048 in 2D, 128 in 3D; on the
  GPU at 1M bodies a 2,000 x 2,000 lattice took 0.73 ms per step, against 0.41 at 1,000 x 1,000). A
  smoothed lattice wider than this stops with the same message on the CPU too: "Grid field gas:
  the layout spans 5300 cells at cell 10; maxCells is 2048".
* `deposit.value` (`'1'`): what each body spreads. An expression that can read body columns
  (`'mass'`) and params.
* `deposit.weights`: `'linear'` (cloud-in-cell: the 2^D grid points around the body) or
  `'quadratic'` (the 3^D nearest grid points, with smoother weights).
* `smooth.diffuse`: one implicit heat step that spreads the field over about `sqrt(diffuse)`
  layout units. It is always stable; outside the grid the field is 0. Leave `smooth` out for no
  smoothing.
* `self`: `'include'` (default), or `'exclude'` to leave each body's own share out of what it
  reads. With smoothing, that is its own smoothed share, computed exactly: a lone body reads 0.
* `into`: `{value, gradient}`, the names of the two body columns it writes. They are defined when
  missing.
* `params`: numbers, or functions of the step context (`simulator.stepContext()`) called once per
  step. Expressions can also read the formula language's built in values (`unit`,
  `springLength`, `n`, `step`, ...).
* `before`, `after`, `replace`, `when`: where the stage goes and on which steps it runs, as in
  `simulator.addStage()`. By default it runs just before `integrate`, every step.
* `denseLimit`: a `'lattice'` grid without smoothing that would have more cells than this (or more
  than 2^30 along an axis) keeps only the cells that bodies touch, in bricks of 4^D cells found
  through a hash map. The numbers are the same; bodies more than 1e9 cells out are left out (they
  read 0), so one body thrown far away does not break the others. Default: 64 cells per body, at
  least 4M (32 MB).

Units: `value` is a density, per unit area (2D) or volume (3D), so a formula never needs the cell
size the grid picked. `gradient` is its slope per layout unit.

Only 2D and 3D layouts: in 4D and more it throws "grid fields are 2D and 3D".

## Other engines

In `simulator.program()` the stage has shape `'grid'`, reads `pos` (and the columns the deposit
value reads), writes the two columns, and keeps its options in `args`, with numbers as
`{kind: 'number' | 'expression' | 'host'}`. `simulator.stageValues(name, stepContext)` gives one
step's numbers (`params`, `cell`, `margin`, `diffuse`, `value`) for an engine that queues steps. The
GPU module lowers it to a dense grid built on the device.

## Cost

Per step: one pass over the bodies for the bounds, 2^D or 3^D deposits and reads per body, and a
pass over the grid's cells (clearing, and the smoothing when there is one). In 2D it computes what
the demo's hand-written versions did: ru-4's numbers exactly, v1-6's to rounding.

Part of the [ngraph.forcelayout](../..) repository. Not published to npm yet.
