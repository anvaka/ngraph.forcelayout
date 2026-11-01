# ngraph.forcelayout.view

Draws a graph that an `ngraph.forcelayout` layout moves, on a [w-gl](https://github.com/anvaka/w-gl)
scene: nodes as round dots, links as lines of a fixed width on screen.

It is built so that drawing stays cheap at hundreds of thousands of nodes, and so that interactive
add-ons (labels, tooltips, highlighting) can be added on top of it later:

* **Positions are a texture.** Each frame copies the first three axes of the layout's
  `simulator.store.pos` into a float texture in one loop, and uploads it once. Nodes and links
  read their positions there, so a link is just the two rows it joins, and the CPU never touches
  it after it is built.
* **Frames are drawn only when something changed:** a layout step (its `'step'` event, also fired
  once per readback when the layout runs on WebGPU), a camera move, or a call below. A paused
  layout costs nothing.
* **Colors and sizes are read once**, when the view builds its buffers, not on every frame.

Node `i` of the drawing is body `i` of the layout (row `i` of `simulator.store`). When the graph
changes, the view drops removed rows (`simulator.applyEdits()`) and rebuilds at the next frame;
it also rebuilds on the simulator's `'topology'` event.

## Usage

``` js
import {createScene} from 'w-gl';
import createLayout from 'ngraph.forcelayout';
import createView from 'ngraph.forcelayout.view';

const scene = createScene(canvas);
const layout = createLayout(graph);
const view = createView(scene, {graph, layout});

function frame() {
  layout.step();          // the view asks the scene for a frame on every step
  requestAnimationFrame(frame);
}
frame();
```

Options:

* `graph`, `layout` (required): the graph and the layout that positions it.
* `nodeColor` (`0x90f8fcff`): a color as `0xRRGGBBAA`, or `node => color`. A function that returns
  0 (or nothing) gives the default color for that node.
* `linkColor` (`0xffffff10`): a color, or `link => color`.
* `nodeSize`: a number, or `node => size` in scene units. Default: `node.data.size`, or 1.
* `linkWidth` (2): width of links in pixels.

Methods:

* `setLayout(layout)`: draw another layout of the same graph, e.g. after a reset or a change of
  dimensions.
* `setNodeColor(color)`, `setLinkColor(color)`: new colors (a value or a function).
* `invalidate()`: positions changed outside of a step, e.g. after `layout.setNodePosition()` or
  code that wrote `store.pos`.
* `refresh()`: call the color and size functions again, e.g. when the data they read changed.
* `dispose()`: stop listening to the graph and the layout, and free the GPU resources.

Only x, y and z are drawn; a layout in more dimensions shows its first three axes.

## Requirements

WebGL 1 with `ANGLE_instanced_arrays`, `OES_texture_float` and texture reads in vertex shaders
(all common). `createView()` throws an Error naming what is missing. Up to 2048 × the maximum
texture size nodes (16M on most GPUs).

`w-gl` is a peer dependency: the view adds itself to your scene as a w-gl element, so both must
use the same copy of w-gl (the demo's `vite.config.js` dedupes it).

## Not done yet

The design this is the first step of (interactive add-ons on top of the view: picking, per-node
state flags, labels, tooltips) is in the pull request that added this module.
