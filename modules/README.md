# Add-on modules

Code that works with `ngraph.forcelayout` but is not part of it. Each folder is its own package;
none of them ships inside the `ngraph.forcelayout` npm package, and none is published yet
(they are marked `private`).

| Folder | Package name | What it does |
|---|---|---|
| [pivot](pivot) | `ngraph.forcelayout.pivot` | Places nodes before the first step so that distances on screen follow graph distances. The layout then only needs to polish. |
| [gpu](gpu) | `ngraph.forcelayout.gpu` | Runs a layout of the library on WebGPU: the GPU runs the layout's own simulator, and `plan()` says what it cannot run yet. |
| [gridfield](gridfield) | `ngraph.forcelayout.gridfield` | A density of the bodies on a grid, read back at every body as two columns that formulas can use. |
| [view](view) | `ngraph.forcelayout.view` | Draws the graph a layout moves on a w-gl scene, reading positions straight from the layout's store, and only when something changed. |

The [demo](../demo) imports pivot, gpu and view by package name (see `demo/vite.config.js`). It shows
pivot and gpu in its "Add-ons" section, and draws every graph with view. Two of its ideas, ru-4 and v1-6, import gridfield by its path.
