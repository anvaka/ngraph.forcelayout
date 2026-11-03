# ngraph.forcelayout.view

Draws a graph that an `ngraph.forcelayout` layout moves, on a [w-gl](https://github.com/anvaka/w-gl)
scene: nodes as round dots, links as lines of a fixed width on screen. Modules add interaction on
top: labels, hover, drag, select, inspect (tooltips), navigate (keyboard and screen readers) and
search come with it. Pointer modules work the same with a mouse, a pen or a finger, and the keyboard
reaches the same actions.

It is built so that drawing stays cheap at hundreds of thousands of nodes:

* **Positions are a texture.** Each frame copies the first three axes of the layout's
  `simulator.store.pos` into a float texture in one loop, and uploads it once. Nodes and links
  read their positions there, so a link is just the two rows it joins, and the CPU never touches
  it after it is built.
* **Frames are drawn only when something changed:** a layout step (its `'step'` event, also fired
  once per readback when the layout runs on WebGPU), a camera move, or a call below. A paused
  layout costs nothing.
* **Colors and sizes are read once**, when the view builds its buffers, not on every frame.
* **Edges are smoothed in the shaders, not by multisampling.** Links fade over half a pixel on
  each side, and nodes fade at their round edge (in 3D in two passes, so an edge never hides a node
  behind it). Create the scene without multisampling (below): with it, every blended link fragment
  is written to every sample. On a 100k-node graph at pixel ratio 2, that made a frame about 2.5
  times slower and looked no better.

Node `i` of the drawing is body `i` of the layout (row `i` of `simulator.store`). When the graph
changes, the view drops removed rows (`simulator.applyEdits()`) and rebuilds at the next frame;
it also rebuilds on the simulator's `'topology'` event.

## Usage

``` js
import {createScene} from 'w-gl';
import createLayout from 'ngraph.forcelayout';
import createView, {labelNodes, hoverNodes, dragNodes, selectNodes, inspectNodes, navigateNodes, searchNodes} from 'ngraph.forcelayout.view';

// No multisampling: the view smooths its own edges
const scene = createScene(canvas, {wglContextOptions: {antialias: false}});
const layout = createLayout(graph);
const view = createView(scene, {graph, layout});
view.use(labelNodes);
view.use(hoverNodes);
view.use(dragNodes);
const selection = view.use(selectNodes);
view.use(inspectNodes);
view.use(navigateNodes);
view.use(searchNodes);
view.on('tap', e => { if (e.node) console.log(e.node.id); });

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
* `nodeMinSize` (0): the smallest diameter of the smallest node in CSS pixels, at any zoom, so
  nodes (and their colors) stay visible when a big graph is zoomed out. Bigger nodes keep their
  order: a node four times the size of the smallest is at least twice as wide. Picking still uses
  the node's own size.
* `nodeRoom` (0): where nodes crowd, no node is drawn wider than this share (e.g. 0.7) of the
  distance to its nearest neighbour that is at least as big, so the leaves around a hub or the core
  of a hairball don't merge into a solid disc, and small nodes give way to big ones. Hovered,
  selected and focused nodes keep their size. Rooms are measured on the CPU at most every 400 ms
  while the drawing moves, and once after it stops (about 30 ms at 100k nodes; see `room.js`).
* `fog` (1): in 3D, what is farther from the camera fades, down to this share of its alpha at the
  far side of the drawing (e.g. 0.3), so depth reads. 1: no fog.
* `blend` (`'normal'`): `'add'` lets links add their light, so where they crowd the drawing glows
  (on a dark background; nodes still cover the links under them). Highlights and layers blend
  normally.
* `linkWidth` (2): width of links in pixels.
* `nodeLabel`: `node => text` that stands for a node in tooltips, search and announcements.
  Default: `data.label`, else `data.name`, else the id.
* `styles`: how flagged nodes and links look (see [Flags](#flags)).
* `camera`: camera input, see [Camera](#camera).
* `input`: gesture thresholds, see [Gestures](#gestures). `input: false` leaves the scene's own
  w-gl controls in place; modules can't be used then.
* `reach`: how far from a node, in pixels, a pointer still picks it (see [Picking](#picking)).
* `occlusion` (true): what hides parts of the canvas, so the camera brings nodes out from under
  it (see [What the user sees](#what-the-user-sees)). `false`: only the canvas edges count; a
  function `(x, y) => boolean` says yourself whether a canvas point (CSS pixels) is hidden.

Methods:

* `setLayout(layout)`: draw another layout of the same graph, e.g. after a reset or a change of
  dimensions.
* `setNodeColor(color)`, `setLinkColor(color)`: new colors (a value or a function).
* `setNodeMinSize(pixels)`: a new `nodeMinSize`.
* `invalidate()`: positions changed outside of a step, e.g. after `layout.setNodePosition()` or
  code that wrote `store.pos`.
* `refresh()`: call the color and size functions again, e.g. when the data they read changed.
* `use(module, options)`: attach a module; returns its API (see [Modules](#modules)).
* `on(name, fn)`, `off(name, fn)`: listen to [events](#events).
* `pick(x, y, options)`: the node under a canvas point (see [Picking](#picking)).
* `flags`: per-node flags (see [Flags](#flags)).
* `setStyles(styles)`: new styles for flagged nodes.
* `toScreen(x, y, z)`: where a point of the scene is on the canvas, in CSS pixels.
* `labelOf(node)`: the node's label (see `nodeLabel`).
* `reveal(node, {margin, animate})`: pan the camera so the node is in view, gliding unless the
  user prefers reduced motion. In view means inside the canvas and out from under what covers it,
  `margin` (0.15 of the smaller side) away from both.
* `visibleArea()`: the part of the canvas the user sees (see
  [What the user sees](#what-the-user-sees)).
* `getLayout()`, `getCamera()` (w-gl's map controls that the view drives), `getModule(name)` (the
  API of an attached module, e.g. `getModule('labels')`).
* `dispose()`: detach the modules, give the scene its own camera controls back, stop listening
  to the graph and the layout, and free the GPU resources.

Only x, y and z are drawn; a layout in more dimensions shows its first three axes.

The first `getContext()` call on a canvas fixes its options. If you check for WebGL before
creating the scene (e.g. with w-gl's `isWebGLEnabled()`), check on a separate canvas.

## Input

The view takes over camera input from the scene. Pointers (mouse, pen, touch), the wheel and keys
go through one input layer that the camera and the modules share, so they never fight over a
gesture:

* **Every pointer has one owner**, decided when it goes down. Modules are asked in priority order
  whether they want it, with the node under it already picked; the camera takes the rest.
* **Two fingers pinch**, wherever they land. A finger that lands while another is down goes to
  the camera, and takes that other finger along, even from a node it was about to drag (the
  node goes back). Only a finger that has committed to a gesture of its own keeps it: one that
  long-pressed, or that has dragged for `pinchTime`. So one finger can hold a node while another
  pans.
* **A press stays undecided** until it moves past a small distance (then it is a drag for its
  owner) or lifts (then it is a tap). A long press is offered to every module while the press is
  undecided. Taps fire on release, at once: a double tap doesn't make single taps wait.
* **Every drag ends once**, with an end or a cancel: pointercancel, lost capture, leaving the
  window, a release outside the window, or Escape.

The camera is still w-gl's map controls (pan, zoom about the pointer, rotation, inertia); only
their mouse, touch and keyboard listeners are replaced. It works with w-gl 0.21 as is: the controls
listen on a detached element, and the view drives them.

### Camera

| Input | Does |
|---|---|
| Drag on the background | pans; with the right button or Alt it rotates and tilts |
| Wheel | zooms about the pointer (`camera: {wheel: 'pan'}`: pans, and Cmd/Ctrl + wheel zooms) |
| Trackpad pinch (Ctrl + wheel) | zooms, in finer steps |
| Two fingers | pinch zooms about their centre and pans; a twist rotates (after 25 px of arc); a level two-finger move up or down tilts |
| Double tap | zooms in (not with Shift, Ctrl, Cmd or Alt) |
| Two-finger tap | zooms out |
| Arrows or WASD, + and −, Q and E, R and F | pan, zoom, rotate, tilt while held |

Rotation and tilt work only where the scene allows rotation. `camera` options: `wheel` ('zoom'),
`rotate` (true), `doubleTapZoom` (true), `twoFingerTapZoom` (true), `inertia` (true), `keys` (true),
`rotateArc` (25).

### Gestures

`input` options, with their defaults:

* `dragDistance` (`{mouse: 3, pen: 6, touch: 10}`): pixels a press moves before it is a drag.
* `doubleTapTime` (300 ms) and `doubleTapDistance` (`{mouse: 10, pen: 30, touch: 30}`).
* `longPressTime` (500 ms).
* `twoFingerTapTime` (400 ms).
* `pinchTime` (250 ms): a finger that has dragged for less than this joins a pinch when another
  one lands.

The canvas gets `touch-action: none` (so the browser leaves gestures to the view), no text
selection or iOS callout, and `tabindex="0"` so it takes keys after a press. Only keys a handler
uses are prevented, and Tab never is. The browser's context menu is off on the canvas. Held keys
are forgotten when the window loses focus. All of this is undone by `dispose()`.

### What the user sees

Part of the canvas may be hidden: a settings panel or a toolbar over it, or the part of a tall
canvas that is scrolled out of the window. The view finds out the way the browser routes a click:
a point of the canvas is visible when a click there would reach the canvas. The app doesn't have
to say anything, and whatever the page does next (a panel that opens, a window that shrinks) is
seen the next time.

The camera uses this when it brings a node into view (`reveal()`, so keyboard focus and search):
a node under the panel comes out, `margin` from the panel's edge as from the canvas's. Enter
starts on the node nearest the middle of what shows.

Hit testing costs about 2 µs a point. `reveal()` first looks at 25 points around where the node
would go; only when one of them is covered does it measure the whole visible area, on a grid of
about 1500 cells (30 px on a 1440 × 900 canvas, about 3 ms), kept for 300 ms.

Elements marked `data-graph-overlay` don't count as covering (the view's tooltip, search box and
help card have it: they move with what they show), nor do elements with `pointer-events: none`.
Pass `occlusion: (x, y) => boolean` if the page can't be hit tested, such as an opaque element
that lets clicks through, or `occlusion: false`.

`view.visibleArea()` (and `ctx.visibleArea()`) returns the measured area: `isHidden(x, y)`,
`nearest(x, y, margin)` (the visible point nearest a canvas point, `margin` inside),
`center()` (the visible point farthest from covers and edges), `anyHidden`, and the grid (`cell`,
`cols`, `rows`, `hidden`).

### Events

`view.on(name, e => …)`. App listeners run before modules and the camera, and
`e.preventDefault()` stops them from reacting.

| Event | When | Extra fields |
|---|---|---|
| `tap` | a press lifted before it moved (left button, touch, pen) | `count`: 2 for the second of a double tap |
| `doubletap` | after the second `tap` | |
| `longpress` | 500 ms without moving | |
| `contextmenu` | a right click, on release | |
| `hover` | the hovered node changed (hover module) | `previous` |
| `dragstart`, `drag`, `dragend` | a node drag (drag module) | `nodes`, `cancelled` on `dragend` |
| `select` | the selection is about to change (select module) | `nodes`, `added`, `removed` |

Every event has `node` (null on the background), `id`, `row`, `x` and `y` (CSS pixels on the
canvas), `clientX`, `clientY`, `pointerType`, the modifier keys and `originalEvent`. Pointer events
also have `scene` (the point of the scene on the plane z = 0), `button` and `hit` (below).

### Picking

`view.pick(x, y, {pointerType, width, reach, sticky})` returns the node under a canvas point, or
null, as `{node, row, distance, inside, clear, gap, x, y, radius}`: `distance` in pixels from the
disc's edge (0 inside it), and the disc on the canvas. `clear` says the pick is unambiguous: the
point is on the disc, or the next nearest node is at least half the reach farther (`gap` pixels).

It works as a bubble cursor with a capped reach. A point inside a node's disc picks that node
(overlaps go to the node drawn last in 2D, the nearest one in 3D). Otherwise the node whose disc
edge is nearest wins, within `reach`: 8 px for a mouse, 10 for a pen, 16 for touch (or half the
finger's contact width, up to 32). The `sticky` node (the hovered one) reaches 4 px farther, so
hover doesn't flicker between neighbours.

Picking runs on the CPU from the layout's own positions, and only when asked. In 2D the point is
mapped to the plane of the graph and the positions are scanned there (0.27 ms per pick at 100k
nodes in the demo); in 3D every node is projected.

### Flags

Each node has a byte of flags, kept in the unused fourth float of the positions texture, so nodes
and links read them in their shaders with the fetch they already do.

``` js
import {SELECTED, FOCUSED} from 'ngraph.forcelayout.view';
view.flags.set(node.id, SELECTED, true);
view.flags.has(node.id, SELECTED);
view.flags.ids(SELECTED);
view.flags.clear(SELECTED);
```

`HOVERED`, `DRAGGED` and `FOCUSED` nodes are drawn larger in `pointedColor`; `SELECTED` ones in
`selectedColor`. Links that touch any of them are lit. While anything is selected, the nodes next to
it (`NEIGHBOR`, set by the view) stay as they are and everything else fades to `dimAlpha`. Flagged
nodes and their links are drawn a second time after everything else, so a highlight is never
buried under faint links. Selected nodes are drawn on top only while there are at most 1,000 of
them; past that, dimming the rest already shows them. `CUSTOM_1` and `CUSTOM_2` are free for
modules and not styled.

`styles`, with their defaults: `pointedColor` (`0xffffffff`), `pointedScale` (1.5),
`pointedMinSize` (8 CSS pixels), `selectedColor` (`0xffc24bff`), `selectedScale` (1.25),
`selectedMinSize` (6), `litLinkAlpha` (0.8), `litLinkColor` (0: lit links keep their color),
`dimAlpha` (0.15). A color with alpha 0 keeps the
node's own color.

## Modules

Every module works the same with a mouse, a pen and a finger; only the picking reach differs.
Where a mouse uses a key (Shift-drag for a box), a long press does the same for every pointer.

### labels

`view.use(labelNodes, {importance, max, tiers, font, color, halo, haloWidth, gap, every, fade, maxLength})`:
node labels that stay put while the layout moves.

* **What gets a label.** Every node has a fixed importance, ranked once per graph change: its links
  (`importance: 'degree'`, the default), `'pagerank'`, a numeric field of `node.data` (its name),
  or `node => number`. A greedy pass places labels in that order beside their nodes, against a
  grid on the screen, and skips any that would overlap. The most important nodes are labelled
  first, and zooming in makes room for more, so the hierarchy comes from the ranking and the
  zoom. The top ranks get bigger text (`tiers`: the top 1% at 15 px, the top 10% at 13 px, the
  rest at 12 px). At most `max` labels (default: one per 3,500 square pixels, 30 to 400).
* **Stable.** Placement runs again only every 250 ms (`every`) while the layout or the camera
  moves, and once more when they stop. Labels placed last time go first, on the side of their
  node they had. Hovered, focused, dragged and selected nodes are always labelled, then the
  selection's neighbours. Labels fade in and out over 300 ms (`fade`), in the shader.
* **Cheap.** Between placements every label follows its node on the GPU: a label is a quad that
  keeps its node's row and its side, and the shader reads the node's position. A running layout
  costs the CPU nothing per frame for labels. A placement takes about 1 ms on 77 nodes and 3 ms at
  100k (the first one, which ranks every node, 20 and 60 ms).
* **Any script.** The text is the view's `labelOf(node)` (cut to `maxLength`, 40), drawn once per
  label with the canvas 2D API into an atlas at the device's pixel ratio, with a halo
  (`halo`, `haloWidth`) so it reads over nodes and links. Labels of dimmed nodes dim too.

API: `update(options)`, `refresh()` (read the labels again), `get()` (the labelled nodes),
`stats()`.

### hover

`view.use(hoverNodes, {holdStill})`: the node under a mouse or pen gets `HOVERED` and the cursor
shows what a press would do there (grab, a box's crosshair, or a pointer over a node a tap would
pick). Fires `hover`. Touch never hovers. The node is picked again after every frame in which the
layout or the camera moved, since nodes move under a still pointer. `holdStill: true` pins the
hovered node (it changes the physics, so it is off). API: `get()`.

### drag

`view.use(dragNodes, {pinOnDrop, longPress})`: moves nodes. The node is pinned while it moves and
goes back to the layout when dropped (`pinOnDrop: true` leaves it pinned; a node that was pinned
stays pinned). Dragging a selected node moves the whole selection. Escape puts the nodes back.

A press grabs a node when the pick is clear: on the node's disc, or clearly nearer to it than to
any other node. Where nodes crowd (a dense graph at a small zoom, where every point is near
several nodes) a press moves the camera instead, and a long press grabs the nearest node. The
hover cursor shows which one a press will do: `grab` or `pointer`.

The node keeps its offset from the pointer, and stays under it while the camera moves (another
finger can pan). Two fingers that land together pinch, also when the first landed on a node (see
[Input](#input)). In 3D it moves on the plane through it that faces the camera. It works
with the layout on the CPU or on WebGPU (through `setNodePosition()`), running or paused. API:
`get()` (the nodes being dragged).

### select

`view.use(selectNodes, {box})`: a tap selects a node; Shift adds, Cmd or Ctrl toggles. A tap on
the background or Escape clears. A long press on the background, then a drag, draws a box that
selects the nodes whose disc touches it (a ring shows when the long press takes); Shift-drag
draws one right away. With Shift, Cmd or Ctrl held the box adds to the selection. Fires `select`
before a change is kept. API: `get()`, `set(nodesOrIds)`, `clear()`, `has(nodeOrId)`.

### inspect

`view.use(inspectNodes, {content, hover, tap, style, className})`: a tooltip with the node's id,
its number of links and the fields of `node.data` (`describeNode()`). Hovering a node shows it
while the pointer stays on the node or on the tooltip; a tap (mouse, pen or finger) keeps it open
until a tap elsewhere or Escape. It follows its node as the layout and the camera move, beside the
node and inside the canvas. `content(node)` returns text (never parsed as HTML), an element, or
null. Hover tooltips need the hover module. API: `show(node)`, `hide()`, `get()`.

### navigate

`view.use(navigateNodes, {pinOnDrop, help, announce})`: keyboard and screen-reader access. The
canvas is one tab stop (`role="application"`, described as a graph with its size), and Tab always
leaves it.

| Key | Does |
|---|---|
| Enter | focuses the node nearest the middle of what shows (or the selected one); on a focused node it is a tap: it selects (Shift adds, Cmd/Ctrl toggles) and keeps the tooltip open |
| Arrows | move focus to the nearest node in that direction; with no node focused they move the camera |
| `]` and `[` | next and previous neighbour of the node the walk started from, strongest link first |
| Space | walks into the focused node: its neighbours are next |
| Backspace | back to where the walk came from |
| Shift+arrows | move the focused node 10 px a step (Alt: 1 px); releasing Shift drops it, as a drag ends |
| Escape | ends a move, then (after the tooltip and the selection) leaves the nodes |
| `?` | lists the keys |

A polite live region says where focus went: the label, the number of links, whether the node is
selected or pinned, and its place among the neighbours being walked ("Neighbour 2 of 10 of
Grantaire, link weight 3"). The camera keeps the focused node in view, and the tooltip follows
focus. The focus ring (`FOCUSED`) shows only while the canvas has keyboard focus, and the keys
act only while it shows: a click on a node moves the keyboard's place there, so Enter continues
from it, while the arrows still move the camera. Fires `focus` ({node, previous, reason}); a
move fires `dragstart`, `drag` and `dragend` with `pointerType: 'keyboard'`. API: `focus(node)`,
`get()`, `clear()`, `announce(text)`.

### search

`view.use(searchNodes, {limit, key, placeholder})`: `/` on the canvas opens a search box (an ARIA
combobox). Typing lists the best matches: labels that start with the text, then labels with a
word that does, then labels that contain it, then ids; nodes with more links first. Up and Down
choose, Enter or a click goes to the node: with navigate it gets keyboard focus, otherwise it is
tapped. The camera brings it into view. Escape gives the keys back to the canvas. A query scans
every node: 1.6 ms at 100k nodes (17 ms at 1M), after a 31 ms index built when the box first
opens. Fires `search` ({node, query}). API: `open(text)`, `close()`, `find(text)`.

### Writing a module

A module is an object with `attach(ctx, options)`, which returns the module's API (or nothing).
`view.use()` returns that API with a `dispose()` that also removes everything registered through
`ctx`:

``` js
const pinOnDoubleTap = {
  name: 'pin',
  attach(ctx) {
    ctx.input.add({
      priority: 10,
      doubletap(e) {
        if (!e.node) return false;
        ctx.layout.pinNode(e.node, !ctx.layout.isNodePinned(e.node));
        return true; // the camera doesn't zoom
      }
    });
  }
};
view.use(pinOnDoubleTap);
```

`ctx` has `view`, `scene`, `graph`, `layout`, `flags`, `pick()`, `nodesInRect()`, `toScreen()`,
`fromScreen(x, y, through)`, `screenPositions()` (every node on the canvas, one pass), `labelOf()`,
`reveal()`, `visibleArea()`, `emit(name, fields)`, `on(name, fn)`, `onFrame(fn)` (runs inside every frame, before
flags go to the GPU), `onCamera(fn)`, `setCursor(value, priority)`, `provide(name, api)` and
`get(name)` (APIs modules share: navigate provides `focus` and `announce`), `gl` and `instancing`,
`addLayer({order, draw(frame), dispose()})` (draw after the nodes, as labels do; `frame` has the
positions texture, `mvp`, `drawContext`, `style` and `time`), `animate()` (ask for the next frame
too, while a fade runs), and `input`:

* `input.add(handler)`: a handler is an object with any of `priority` (lower is asked first),
  `press(p)` (claim this pointer? it must not change anything: it is also asked for the cursor),
  `down`, `dragstart` (return false to pass the pointer on), `drag`, `dragend`, `up`, `cancel`,
  `longpress` (return true to take the pointer), `tap`, `doubletap`, `contextmenu`, `twofingertap`
  (return true to stop the others), `hover(point)`, `wheel`, `key`, `keyup`, `blur`, and `cursor`.
* `input.cancel(pointerId)`, `input.dragging()`, `input.busy()`, `input.hoverPoint()`.
* `input.tap(node, fields)`: a tap that comes from somewhere else than a pointer (navigate's
  Enter): the app and every module see it as a tap.

A pointer `p` has `id`, `pointerType`, `button`, `x`, `y` (now), `downX`, `downY`, `clientX`,
`clientY`, the modifier keys, `hit` and `node` (picked at the press, once, when first asked) and
`event`.

## Requirements

WebGL 1 with `ANGLE_instanced_arrays`, `OES_texture_float` and texture reads in vertex shaders
(all common). Smooth node edges also use `OES_standard_derivatives`; without it, they are hard. `createView()` throws an Error naming what is missing. Up to 2048 × the maximum
texture size nodes (16M on most GPUs).

`w-gl` is a peer dependency: the view adds itself to your scene as a w-gl element, so both must
use the same copy of w-gl (the demo's `vite.config.js` dedupes it).

## Not done yet

Labels that make way for what covers the canvas (they are placed under a panel now),
group (cluster) labels over the node labels, zoom ranges fixed once the layout settles (so
zooming in never removes a label), clicking on label text, picking links, and cooperative
gestures for graphs embedded in a scrolling page.
