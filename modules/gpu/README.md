# ngraph.forcelayout.gpu

An experimental 2D force layout for `ngraph.graph` that runs entirely on WebGPU. It follows the
physics and settings of `ngraph.forcelayout` (springs, repulsion, drag, `maxVelocity`, the
`euler` and `fire` integrators), but it is a separate engine and does not use the library.

Graphs up to 1,024 nodes use exact all-pairs repulsion. Larger graphs use a grid pyramid
instead of a tree, so `theta` and `nbody` don't apply. On large graphs a step is hundreds of
times faster than on the CPU.

## Usage

``` js
import {initWebGPU, createGpuLayout} from 'ngraph.forcelayout.gpu';

const device = await initWebGPU(); // null when WebGPU is not available
if (device) {
  const layout = createGpuLayout(device, graph, {
    settings: {springLength: 10, maxVelocity: 4},
    // optional: start from positions you already have
    getInitialPosition: nodeId => cpuLayout.getNodePosition(nodeId)
  });

  function frame() {
    layout.step(20); // queues 20 steps, never waits for the GPU
    const pos = layout.getNodePosition(someNodeId); // {x, y} from the latest finished step
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
```

Repulsion is 1/r^2 by default, as in the library. `settings.repulsionLaw` takes any law the
library's `repulsionLaw` takes (say `'exp(-r / L) / r^2'` or `{force, params, range}`) and compiles
it into the shaders, so a new law costs only its arithmetic. The law is read when the layout is
created; its parameters are read again on every `step()` call. Parameter functions get a stand-in
for the simulator with `settings`, `unit()`, `iteration()` and getters such as `springLength()`.
Laws with custom JS `functions`, or with more than 16 numbers, run on the CPU only: the GPU
layout throws for them when it is created.

`gpuBackend` tells which parts of a library simulator this module can run, before you switch:
`layout.simulator.plan(gpuBackend)` returns `{runs, reasons, stages}`, with a reason for every
stage it cannot run (formula stages, JavaScript stages, per-link spring lengths, charges other
than the default mass, more than 2 dimensions, ...).

The layout also has `setNodePosition(id, x, y)`, `pinNode(id, isPinned)`, `getGraphRect()`,
`updateSettings(partial)`, `getStats()` and `dispose()`. `await layout.flush()` waits until
positions include every step queued so far.

## Not done yet

* 2D only.
* The graph is read once: after adding or removing nodes or links, create a new layout.
* Positions come back one or more frames late, because reading from the GPU is asynchronous.
* No stop rule: it runs as long as you call `step()`.

Part of the [ngraph.forcelayout](../..) repository. Not published to npm yet.
