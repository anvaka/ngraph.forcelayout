# ngraph.forcelayout.gpu

Runs a layout of `ngraph.forcelayout` on WebGPU. The layout keeps its API. The GPU runs the
layout's own simulator, the stages you added included, and positions come back into the layout
after every batch of steps. Ask `layout.simulator.plan(backend)` first: it says whether the GPU
can run this layout's step, and if not, why.

There is no fallback. A step the GPU cannot run is refused before it starts, or halts the runner
with a message if it shows up later; your app decides what to do (usually `await gpu.stop()` and
carry on with `layout.step()`).

## What runs on the GPU

These stages run, in the CPU's order and with their `when` gates (what does not run is listed
under "What is refused"):

| Shape | On the GPU |
|---|---|
| The built-in step | springs, repulsion with any law the library takes (lookup tables included), drag, Euler or FIRE, any inertia column |
| Extra repulsion passes (`addRepulsion`) | their own charge and sensitivity columns, own or shared centre; passes next to each other walk together (K charges at once) |
| Node formulas | read and write body columns, sums, settings, parameters (host functions included), `step`, `dt` |
| Link formulas | ones that pull (in place of the springs or beside them), add into body columns at either end (`hits_i += 1`, `force_i += …`), or write their link's own columns, `length` and `coefficient` included |
| Links with their own length and stiffness | the springs read them |
| Pair formulas | every pair within the radius, with the CPU's i/j roles, one-sided stages, accumulators |
| Sums | over all bodies, or per group of a column the host sets; formulas read `name` or `name[group]` |
| Lookup tables | in formulas and in laws |
| Host steps (`addHostStep`) | the batch stops at the steps where one runs; it runs on the host with the device's numbers in the store, then the step goes on. Each host step's `when` is asked at its turn, after the ones before it ran, as on the CPU |
| Grid fields (`modules/gridfield`) | every option: both anchors, both weights, smoothing, self included or left out |

How it runs, by size and dimension:

| Layout | How |
|---|---|
| Up to 1,024 bodies (2,560 in 3D) | the whole step in one kernel when nothing splits it; repulsion and pair formulas exact over all pairs |
| 2D and 3D, larger | repulsion through a grid pyramid (one group of tree passes per step above 16,384 bodies); pair formulas through a cell sort with a bounded work list (2D to 4D) |
| The plain stock step in 2D, larger | today's grid kernels, byte for byte, while every link has the default length and stiffness and nothing is added to the step |
| 4D and up | exact pairs, up to 16,384 bodies |
| Grid fields | 2D and 3D |

On the demo's 23 ideas, 21 run on WebGPU in 2D; v1-4 and v1-7 are refused by design (below). In
3D, 8 of the 9 ideas that do something there run (v1-7 again).

## Usage

``` js
import createLayout from 'ngraph.forcelayout';
import {createWebGPUBackend, runOnGpu} from 'ngraph.forcelayout.gpu';

const layout = createLayout(graph);
const backend = await createWebGPUBackend();          // null without WebGPU
const plan = layout.simulator.plan(backend);          // {runs, reasons, warnings, stages}
if (plan.runs) {
  const gpu = await runOnGpu(layout, backend);        // resolves when pipelines and data are ready
  gpu.on('error', e => console.log(e.message));       // stepping stopped; see "When the runner halts"
  function frame() {
    gpu.step(20);                                     // queues 20 steps, returns at once
    const pos = layout.getNodePosition(someNodeId);   // as on the CPU, from the latest readback
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
} else {
  console.log(plan.reasons);   // ['v1-7-contact-and-wall: JavaScript stages run on the CPU only (...)']
}
```

- **`createWebGPUBackend({device})`** uses your device, or requests one with the adapter's limits
  and timestamp queries. `gpuCapabilities(limits)` is a backend without a device, for `plan()` in
  tests or on a server.
- **`simulator.plan(backend)`** gives `{runs, reasons, warnings, stages}`; `stages[name]` is
  `{runs, how}` or `{runs: false, reason}`.
- **`gpu.step(n)`** queues `n` steps and submits their work. The layout's `'step'` event fires once
  per readback (calls a few milliseconds apart share one), and `'stable'` from the movement
  between readbacks (`gpu.lastMove`, the net displacement over a batch per step: a layout that
  oscillates reads calmer than on the CPU).
- **`await gpu.sync()`**: the store holds the positions, velocities, columns and sums of every
  queued step.
- **`await gpu.stop()`** syncs, gives the simulator the step count back and unwraps the layout:
  `layout.step()` works again. While the GPU runs the layout, `layout.step()` throws.
  `layout.dispose()` also stops it (without a last readback).
- **`gpu.on('readback', ({steps, lastMove}) => …)`** after each readback;
  **`gpu.on('error', e => …)`** when the runner halts. `gpu.off(event, callback)`.
- **`gpu.stats()`**: `{msPerStep, source, steps, engine, nodes, stepsPerSubmit, slowdown, halted}`.
  `msPerStep` is GPU time from timestamp queries when the device has them, else wall clock.
  `engine` is `'grid'` (today's kernels) or `'pairs'` / `'pyramid'` (the generic engine).
- **`gpu.halted`**: the halt, or null.

### Who owns the store

- Between syncs the GPU is ahead of the store. Positions in the store are those of the latest
  readback.
- After `sync()` the host owns the store until the next `gpu.step()`, which uploads it: write
  positions, velocities or columns then, and they go up.
- Between syncs, the body setters (`setNodePosition`, `body.pos.x = …`, pinning) mark what they
  write, and the next step uploads those rows only, so a drag works without `sync()`. The same
  holds for columns: a raw write needs `store.changed(name)`, and only the rows you changed go up,
  so the device's newer numbers in other rows stay.
- Settings reach the GPU on their own. Through the setters is the documented way. Numbers written
  straight into `simulator.settings` are read on every call too, and settings that change the
  plan (integrator, nbody, inertia, charge and sensitivity columns, the adaptive step) re-plan at
  the next call.
- Graph edits, new stages, new columns and a new law are sync points: the device's numbers come
  back, the plan and data are rebuilt, and stepping goes on.
- A `'step'` listener that changes what the GPU reads (a link length, a setting, a column) halts
  the runner: on the CPU it would run after every step, here only once per batch. Use a formula,
  a sum, a host step or a `'settings'` listener instead.

## When the runner halts

The `'error'` event gets `{message, kernel, stages, status?, lost?}`. Stepping stops; `stop()`
still works.

| Halt | What it means |
|---|---|
| A work cap passed (`e.status` set) | a pair formula needed more pair tests in one step than its slices planned for; the pyramid's crowded cells need more pair evaluations than the cap (a layout piled densely in one place); a grid field's lattice is wider than its `maxCells` (a smoothed lattice halts in the CPU module's words; an unsmoothed one, which the CPU runs at any width, says to raise `maxCells` or run on the CPU). The message says by which step. |
| A number that does not fit 32-bit floats | a host value or parameter became too large on some step; the message names it and the step |
| A `'step'` listener changed the physics | see above |
| A device error (`e.kernel`) or a lost device (`e.lost`) | a validation error names its kernel; after a loss, create a new backend |
| A host step or a listener threw | its message |

After a work-cap halt (and after a device error), the steps after the cap ran without that work,
so the store keeps the last readback from before, and `sync()` and `stop()` read nothing more
from the device. The layout loses at most a batch of good steps and never keeps bad ones.

## Each device's speed

The work caps (the pyramid's crowded cells, a pair formula's tests per slice) were sized on an
Apple M4 Max. `runOnGpu()` runs a speed probe once per device: an exact pair loop, scattered
reads over 16 MB and atomic adds, about 1 ms each there (about 9 ms of setup in all). The part
that falls furthest behind the M4 Max says how many times slower the device is
(`gpu.stats().slowdown`, 1 to 100; 10 when the probe cannot measure):

- the pyramid's cap (pair evaluations, weighted by its charges) is divided by it, so a capped
  step takes about 30 ms on any device; the pyramid then follows the rate it measures on crowded
  steps;
- the pair formulas start from a matching cap, then follow the rate they measure on dense steps;
- a grid field's worst step is its estimate for the M4 Max times the factor;
- a submit holds no more steps than fit 1 s if every step reached its caps, far below the
  2-second GPU watchdog; and as many as fit 100 ms of the time steps actually take.

A pair step that needs more than its cap runs in several submits ("slices") rather than halting.

## What is refused, and why

`plan()` names the stage and the reason. Today's refusals:

| Refused | Why |
|---|---|
| JavaScript stages (a stage function you wrote, or a built-in replaced by one) | the GPU cannot run JavaScript; write it as a formula, or as a host step if it must run on the host. v1-4 (a path-dependent law) and v1-7 (contact rules in JavaScript) stay on the CPU for this reason |
| Pair rules (`addPairRule`) | JavaScript; a pair formula does the same on every engine |
| Laws with JavaScript functions | the same; laws written as formulas, with lookup tables if needed, run |
| The adaptive time step | not built on the GPU |
| Integrators other than Euler and FIRE | |
| Sums over links, `min` and `max` sums | not built yet |
| Sums per group whose group column a stage writes | groups are sorted on the host; set group ids from the host |
| Formulas that write integer columns | the GPU keeps columns as 32-bit floats |
| A link formula that both moves bodies and writes link columns | both ends evaluate a link, so the writes would race |
| Lookup tables in pair formulas | not built yet |
| Tree passes, pair formulas, grid fields, or link stages that read positions, after the integrate stage | they would read the step's start |
| Steps without exactly one integrate stage | |
| Repulsion in 4D and up above 16,384 bodies; pair formulas in 5D and up above 16,384 | exact pairs only; more needs a tree search |
| More than one group of tree passes per step above 16,384 bodies in 2D and 3D | one pyramid per step |
| Grid fields outside 2D and 3D | |
| Numbers that do not fit 32-bit floats (`1e300` in a formula, a column with integers above 2^24) | f32 rules: a literal is refused when the step is planned; a value that grows too large halts at the step |
| Columns of other than 1 or D numbers per body | |
| A layout too large for the device (buffer sizes, storage buffers per kernel, workgroup memory, one thread per body: 16.7M bodies) | the reason names the limit and the device's value |
| A lost device | create a new backend |

## Known limits

- **The plain stock 2D step above 1,024 bodies keeps today's grid kernels.** On relaxed layouts
  with big hubs their force error is up to 2.76× the CPU tree's (megaStars), 1.25–1.28× on
  starOfStars, where the generic pyramid stays within 1.25×. The pyramid is as fast or faster
  from 2k to 100k bodies, but 1.26–1.45× slower on hub graphs (megaStars, EVA) from a random
  start. So the switch
  (`isStockStep()` in `schedule.js`) still sends that one step to the old kernels.
- **32-bit floats.** Positions go up as f32 relative to an f64 origin and come back as f64. One
  step matches the CPU to 1e-5 of the column's RMS (1e-4 with `exp`, `log`, `pow`, `sqrt`,
  `tanh`). A body with k > 64 links may differ by √(k/64) times that: its force sums thousands of
  terms each rounded in f32. Long runs diverge from the CPU, as any two layouts do. NaN and
  infinity are outside the contract. `tanh` is clamped (Metal's is NaN from 45).
- **Bodies on one spot** are pushed apart along a small fixed direction where the CPU picks a
  random one.
- **Some costs:** a pair formula in 3D costs about twice 2D (0.20–0.23 ms at 100k); laws that fall
  slower than 1/r² cost 1.35–1.68× a stock step in 2D; a 3D grid field with quadratic weights
  costs 0.73 ms at 1M bodies.
- **FIRE's state** is not handed back to the CPU's integrator on `stop()`.
- **An uncaptured device error halts every runner on that device**: WebGPU reports errors per
  device.
- **Tested on one browser and one GPU:** Chrome 146 (headless shell) on Metal, Apple M4 Max.
  Firefox, Safari, Windows, Linux and other GPUs are untested. The speed probe scales the caps,
  but nothing else has been tried elsewhere.
- Long picture runs (T10) and long runs at 1M bodies were not run.
- Not published to npm.

## Architecture

The library describes the step as data (`simulator.program()`: stages in CPU order, what each
reads and writes, formulas as text) and prints formulas through a printer it is given. The module
compiles that description; it never reads the library's internals. `plan()` and `runOnGpu()` use
the same lowering, so they cannot disagree.

| File | Part |
|---|---|
| `index.js` | Public API: `createWebGPUBackend`, `runOnGpu`, `gpuCapabilities`. Test options: `generic`, `smallGraph`, `pairEstimate`, `slowdown`, `renumber`. |
| `device.js` | The device: limits, `uncapturederror` and loss watching, pipelines compiled with `createComputePipelineAsync` and cached per device by their WGSL text, the submit cost, the speed probe. |
| `wgsl/print.js` | The WGSL printer of the formula language: prefixed user names, safe builtins, f32 literal rules, the law helpers. |
| `check.js` | The lowering table: what each stage needs, checked against a set of limits with no device; budgets (storage buffers per kernel, buffer sizes, workgroup memory). |
| `schedule.js` | From an accepted step to a plan: today's grid kernels for the plain stock 2D step above 1,024 bodies (`isStockStep()`, the one switch), a generic plan for everything else. |
| `generic/plan.js` | The step's stages as sections in CPU order, fused into as few kernels as the reads allow; where every column lives; the per-step slot of numbers. |
| `generic/emit.js` | The WGSL of a generic plan: node kernels, the exact all-pairs tile loop for any law, charge and sensitivity, fixed-order reductions for sums and FIRE. |
| `generic/links.js`, `generic/common.js` | Links (both ends evaluate a link with its true roles; chunks of 8 links for hubs), link-column kernels, pair formulas over all pairs, sums per group; names and column places. |
| `generic/values.js` | The per-step slot: settings, parameters, built-in values, gates and law numbers from `simulator.stageValues()` for each queued step. |
| `generic/engine.js` | A generic plan on a device: buffers, the ring of slots, encoding, status words, readbacks, uploads row by row. Layouts of 4,096 bodies or more keep their rows in a spatial order on the device; uploads, links and groups go through it, and readbacks come back in the store's order. |
| `pyramid/` | The grid pyramid for tree passes (2D and 3D, K charges, any law): exact crowded cells under a cap, far fields of their own for hubs. |
| `pairs/` | Pair formulas above N*: a cell sort per radius, a work list of 256-test chunks with a cap and slices, a gather per stage; the pair-formula printer both regimes share. |
| `grid/` | Grid fields: a deposit into 64-bit fixed-point sums, smoothing, the value and slope gathered back per body; a lattice wider than `maxCells` halts. |
| `templates/grid.js`, `templates/stock.js` | Today's grid kernels, WGSL byte for byte, and the engine around them. |
| `buffers.js`, `rows.js` | Store to device and back: the f64 origin, the device's row order (a Hilbert curve in 2D, Morton order in 3D), rows the host wrote found and uploaded one by one (one scatter dispatch for many). |
| `runner.js` | `runOnGpu`: the guard stage, uploads, batching, readbacks, `sync`, `stop`, events, the listener check, status and device errors, sync points. It drives either engine through one interface. |
| `program.js` | Reading the step as data; the guard stage's name. |

How a call flows: `gpu.step(n)` applies graph edits (a sync point when there were any), checks the
step's structure (a new plan when it changed), uploads what changed, fills the numbers of each
queued step (once per call when none can change within it), and encodes the steps in as few
submits as the caps allow. One of three staging buffers copies the positions and the status
words; when it maps, the status is checked, then the store gets the positions as f64 and the
events fire.

## Tests

Text only, with plain node (no device):

```
node modules/gpu/test/check.js    # plan() verdicts, refusals and budgets
node modules/gpu/test/print.js    # the printer: numbers agree with JS, literals, names, every builtin
node modules/gpu/test/t3.js       # law WGSL against what the library printed (48 pairs)
node modules/gpu/test/t4.js       # today's grid kernels, byte for byte (16 laws)
node modules/gpu/test/pyramid.js  # the pyramid's plans, refusals and WGSL
node modules/gpu/test/pairs.js    # the pair lowering's plans and WGSL
node modules/gpu/test/grid.js     # the grid field's plans and WGSL
node modules/gpu/test/order.js    # the device's row order for large layouts
node modules/gpu/test/t8.js <demo root>   # every idea of the demo: active and running, 2D and 3D
```

Device tests (one step against the CPU per shape, the runner's contract, halts, speed) run in
headless Chrome through the harness this work was built with; they are not in the repository.

Part of the [ngraph.forcelayout](../..) repository. Not published to npm yet.
