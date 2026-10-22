# ngraph.forcelayout.gpu

Runs a layout of `ngraph.forcelayout` on WebGPU. The layout keeps its API: the GPU runs the
layout's own simulator, and positions come back into the layout after every batch of steps.
Today it runs, in any number of dimensions, the built in step (springs, repulsion with any law,
drag, Euler or FIRE, any inertia column), extra repulsion passes with their own charge and
sensitivity columns, node formulas, link formulas (that pull, add into body columns, or set their
link's own columns, length and stiffness too), links with their own lengths and stiffness, pair
formulas (every pair up to 1,024 bodies, a cell sort with a bounded work list above), and
sums over bodies, for all of them or per group of a column the host sets, lookup tables in
formulas and laws, and host steps (the batch stops at the steps where one runs, the host step
runs on the host with the device's numbers in the store, then the step goes on), all in the CPU's
stage order and with `when` gates. Repulsion is exact over all pairs up to 1,024 bodies (2,560 in 3D); larger 2D and
3D layouts use a grid pyramid, and 4D and up runs exact pairs up to 16,384 bodies. `plan()` says
why it cannot run anything else.

## Usage

``` js
import createLayout from 'ngraph.forcelayout';
import {createWebGPUBackend, runOnGpu} from 'ngraph.forcelayout.gpu';

const layout = createLayout(graph);
const backend = await createWebGPUBackend();          // null without WebGPU
const plan = layout.simulator.plan(backend);          // {runs, reasons, warnings, stages}
if (plan.runs) {
  const gpu = await runOnGpu(layout, backend);        // resolves when pipelines and data are ready
  function frame() {
    gpu.step(20);                                     // queues 20 steps, returns at once
    const pos = layout.getNodePosition(someNodeId);   // as on the CPU, from the latest readback
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
  gpu.on('error', e => console.log(e.message));       // stepping stopped (e.lost: the device is gone)
} else {
  console.log(plan.reasons);                          // ['pull: WebGPU does not run node formulas yet']
}
```

- `gpu.step(n)` queues `n` steps and submits their work. The layout's `'step'` event fires once
  per readback (calls made within a few milliseconds of each other share one), and `'stable'`
  from the movement between readbacks (`gpu.lastMove`). That
  movement is the net displacement over the batch divided by its steps, where the CPU adds up
  every step's path: a layout that oscillates reads calmer here, and may report stable earlier.
- `await gpu.sync()`: the store holds the positions and velocities of every queued step. Until the
  next `gpu.step()`, the host owns them: write positions then (a final step on the drawing, say),
  and the next step uploads them. Between syncs, the body setters (`setNodePosition`,
  `body.pos.x = …`) mark what they write, and the next step uploads those rows only (a drag
  works without `sync()`); a raw write into `store.pos` needs `store.changed('pos')`.
- `await gpu.stop()` syncs, gives the simulator the step count and unwraps the layout:
  `layout.step()` works again. While wrapped, `layout.step()` throws. `layout.dispose()` stops it.
- Changes reach the GPU by themselves: settings through the simulator's setters, masses and
  pinned nodes through the store's column versions (the body setters mark them), graph edits
  and a new law at the next `gpu.step()`.
- A `'step'` listener that changes what the GPU reads (a link length, a setting) halts the runner
  with a message: on the CPU it would run after every step, here only once per batch.
- `gpu.stats()`: `{msPerStep, source: 'gpu-timestamps' | 'wall-clock', steps, engine, ...}`.
- There is no fallback to the CPU. A step the GPU cannot run is refused before it starts, or
  halts the runner if it shows up later; the app decides what to do (`await gpu.stop()` and
  `layout.step()`, say).
- A structure that passes its work cap (a pair formula's tests, the pyramid's crowded cells, a
  grid field's lattice) halts the runner with `e.status` set. Steps after it ran without that
  work, so the store keeps the last readback from before and `stop()` reads nothing more back:
  the layout loses at most a batch of good steps and never keeps bad ones.
- Work caps (the pyramid's crowded cells, a pair formula's tests a slice) were sized on an M4 Max.
  On a slower device a speed probe at `runOnGpu()` lowers them so that a capped step takes about
  as long, and the pairs then follow the rate they measure on dense steps. A submit holds no
  more steps than fit 1 s if every step reached its caps (`gpu.stats().slowdown` shows the
  probe's factor).

`gpuCapabilities(limits)` is a backend without a device, for `plan()` in tests or on a server:
WebGPU's default limits, or yours on top of them.

## Architecture

The library describes the step as data (`simulator.program()`: stages in CPU order, what each
reads and writes, formulas as text) and prints formulas through a printer it is given. The module
compiles that description; it never reads the library's internals.

| File | Part |
|---|---|
| `index.js` | Public API: `createWebGPUBackend`, `runOnGpu`, `gpuCapabilities`. |
| `device.js` | The device: limits, `uncapturederror` and loss watching, pipelines compiled with `createComputePipelineAsync` and cached per device by their WGSL text and layout, the submit cost, and a speed probe (0.26 ms of pair work here) that says how much slower than the M4 Max the work caps were sized on a device is. |
| `wgsl/print.js` | The WGSL printer of the formula language: prefixed user names, safe builtins (tanh clamped, constant whole powers multiplied), f32 literal rules; the law helpers (`emitLaw`, the law's numbers). |
| `check.js` | The lowering table: what each stage needs to run here, checked against a capability profile (limits) with no device. `lower()` gives `plan()` its verdicts and the runner its plan, so they cannot disagree. Literal checks, storage bindings per kernel, buffer sizes. |
| `schedule.js` | From an accepted step to a plan: the stock template for the exact stock step in 2D above 1,024 bodies, a generic plan for everything else. |
| `generic/plan.js` | A generic plan: the step's stages as sections in CPU order (clear, drag, springs, tree passes as channels of one tile loop, formulas, sums, Euler or FIRE), fused into as few kernels as the reads allow; where every column lives; the per-step slot. Up to 1,024 bodies the whole step is one kernel. |
| `generic/emit.js` | The WGSL of a generic plan: node kernels with formulas through the printer, the exact all-pairs tile loop for any law, charge and sensitivity, fixed-order reductions for sums and FIRE. |
| `generic/links.js`, `generic/common.js` | Links: both ends of every link evaluate it with its true roles (in place, or by chunks of 8 links for hubs above 1,024 bodies), a thread per link for formulas that only write link columns; sums per group (runs of a group's rows, then each group's runs); what names mean in formulas, where columns live. |
| `generic/values.js` | The per-step slot: settings, every stage's parameters, built in values, gate bits and law numbers, from `simulator.stageValues()` for each queued step. |
| `generic/engine.js` | A generic plan on a device: buffers from the store, the ring of slots, encoding, readbacks of positions, columns, sums and FIRE's state. |
| `pairs/` | Pair formulas above N* (2D to 4D): a cell sort per radius, a work list of chunks of 256 pair tests with a cap on a step's work (its status halts the runner), chunks and a gather per stage; the printer of a pair formula with the CPU's roles, which the all-pairs loop below N* uses too. |
| `pyramid/` | The generic grid pyramid (2D and 3D, K charges, any law): its plan and buffers without a device (`plan.js`), the structure kernels and the section a node kernel fuses (`wgsl.js`), the buffers and dispatches on a device (`build.js`). A generic plan uses it above 1,024 bodies in 2D and 2,560 in 3D. |
| `grid/` | Grid fields (design 6.7, the `modules/gridfield` shape): a lattice's deposit in 64-bit fixed point, smoothing, the value and its slope gathered back per body; its own dispatches, first in the step when nothing before it changes what it reads; a lattice wider than `maxCells` halts the runner with the CPU module's message. |
| `templates/grid.js`, `templates/stock.js` | Today's grid engine as the stock template, WGSL byte for byte (test/t4.js), and the engine around it: settings and law numbers into its uniforms, uploads, readbacks in the store's order. |
| `buffers.js`, `rows.js` | Store to device and back: the f64 origin, Hilbert renumbering, readback into the store as f64; rows the host wrote between syncs, found and uploaded row by row (one scatter dispatch for many), kept from readbacks encoded before the upload. |
| `runner.js` | `runOnGpu`: the guard stage, uploads by column version, batching, readbacks, `sync`, `stop`, events, the listener check, errors and device loss, sync points for graph edits and structure changes. It drives either engine through one interface. |

How a call flows: `gpu.step(n)` applies graph edits (a sync point when there were any), checks
the step's structure (a sync point and a new plan when it changed), uploads what changed, reads
the numbers of each queued step (once per call when none can change within it), and encodes the
steps in as few submits as fit 100 ms of GPU work. One of three staging buffers copies the
positions; when it maps, the store gets them as f64 and the events fire.

## Tests

Text only, with plain node (no device):

```
node modules/gpu/test/t3.js       # law WGSL against what the library printed (48 pairs)
node modules/gpu/test/t4.js       # the stock template against today's kernels (16 laws)
node modules/gpu/test/print.js    # the printer: numbers agree with JS, literals, names, every builtin
node modules/gpu/test/check.js    # plan() verdicts and budgets
node modules/gpu/test/pyramid.js  # the pyramid's plans, refusals and WGSL
node modules/gpu/test/t8.js <demo root>   # every idea of the demo: how many run, 2D and 3D, both profiles
```

Device tests run in headless Chrome through the GPU harness of this work (not in the repo).

Part of the [ngraph.forcelayout](../..) repository. Not published to npm yet.
