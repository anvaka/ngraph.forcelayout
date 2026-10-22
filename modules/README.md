# Add-on modules

Code that works with `ngraph.forcelayout` but is not part of it. Each folder is its own package;
none of them ships inside the `ngraph.forcelayout` npm package, and none is published yet
(they are marked `private`).

| Folder | Package name | What it does |
|---|---|---|
| [pivot](pivot) | `ngraph.forcelayout.pivot` | Places nodes before the first step so that distances on screen follow graph distances. The layout then only needs to polish. |
| [gpu](gpu) | `ngraph.forcelayout.gpu` | Runs a layout of the library on WebGPU: the GPU runs the layout's own simulator, and `plan()` says what it cannot run yet. |

The [demo](../demo) imports both by package name (see `demo/vite.config.js`) and shows them in
its "Add-ons" section.
