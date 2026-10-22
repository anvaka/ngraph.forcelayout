# ngraph.forcelayout.gridfield

A density of the bodies on a grid, read back at every body, for `ngraph.forcelayout`. Each step:

1. every body spreads a value (1 by default) over the grid points around it;
2. optionally, the grid is smoothed by one implicit step of the heat equation;
3. every body reads the field back with the same weights, into two ordinary body columns:
   the density at the body (`value`) and its slope (`gradient`, D numbers).

A force is then a plain node formula that reads those columns. This is the particle-mesh
deposit and gather of N-body and SPH codes, and of density maps drawn under a layout.

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
* `maxCells`: cells per axis, at most: 1024 in 2D, 128 in 3D. It sizes `'box'` grids. A
  `'lattice'` grid is never capped on the CPU; on the GPU a lattice wider than this stops the
  layout with a message.
* `deposit.value` (`'1'`): what each body spreads. An expression that can read body columns
  (`'mass'`) and params.
* `deposit.weights`: `'linear'` (cloud-in-cell: the 2^D grid points around the body) or
  `'quadratic'` (the 3^D nearest grid points, with smoother weights).
* `smooth.diffuse`: one implicit heat step that spreads the field over about `sqrt(diffuse)`
  layout units. It is always stable; outside the grid the field is 0. Leave `smooth` out for no
  smoothing.
* `self`: `'include'` (default), or `'exclude'` to leave each body's own share out of what it
  reads (its own unsmoothed deposit is subtracted).
* `into`: `{value, gradient}`, the names of the two body columns it writes. They are defined when
  missing.
* `params`: numbers, or functions of the simulator called once per step. Expressions can also
  read the formula language's built in values (`unit`, `springLength`, `n`, `step`, ...).
* `before`, `after`, `replace`: where the stage goes, as in `simulator.addStage()`. By default
  it runs just before `integrate`.
* `denseLimit`: a `'lattice'` grid without smoothing that would have more cells than this keeps
  only the cells that bodies touch, in a hash map. The numbers are the same; it only matters for
  speed and memory when the bodies spread far apart. Default: 64 cells per body, at least 65,536.

Units: `value` is a density, per unit area (2D) or volume (3D), so a formula never needs the cell
size the grid picked. `gradient` is its slope per layout unit.

Only 2D and 3D layouts: in 4D and more it throws "grid fields are 2D and 3D".

## Other engines

The stage describes itself to `simulator.plan(backend)` as shape `'grid'`, with its options,
expressions as text, the columns it reads and writes, and `evaluate(simulator)`, which gives this
step's numbers (cell, margin, diffuse, value) for an engine that computes them on the host. The
GPU module lowers it to a dense grid built on the device (see DESIGN.md, section 6.7).

## Cost

Per step: one pass over the bodies for the bounds, 2^D or 3^D deposits and reads per body, and a
pass over the grid's cells (clearing, and the smoothing when there is one). In 2D it computes what
the demo's hand-written versions did: ru-4's numbers exactly, v1-6's to rounding.

Part of the [ngraph.forcelayout](../..) repository. Not published to npm yet.
