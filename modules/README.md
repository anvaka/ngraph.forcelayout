# Add-on modules

Code that works with `ngraph.forcelayout` but is not part of it. Each folder is its own package;
none of them ships inside the `ngraph.forcelayout` npm package, and none is published yet
(they are marked `private`).

| Folder | Package name | What it does |
|---|---|---|
| [pivot](pivot) | `ngraph.forcelayout.pivot` | Places nodes before the first step so that distances on screen follow graph distances. The layout then only needs to polish. |
| [gpu](gpu) | `ngraph.forcelayout.gpu` | Runs a 2D force layout on WebGPU, with the same physics and settings as the library. |
| [gridfield](gridfield) | `ngraph.forcelayout.gridfield` | A density of the bodies on a grid, read back at every body as two columns that formulas can use. |

The [demo](../demo) imports pivot and gpu by package name (see `demo/vite.config.js`) and shows them
in its "Add-ons" section. Two of its ideas, ru-4 and v1-6, import gridfield by its path.
