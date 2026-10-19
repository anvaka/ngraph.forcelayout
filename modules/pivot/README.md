# ngraph.forcelayout.pivot

Starting positions for `ngraph.forcelayout`. By default the layout puts every node at random
near its already placed neighbours, and spends hundreds of steps untangling. This module
places nodes so that distances on screen roughly follow graph distances (number of hops), so
the layout only needs to polish the result.

It computes two candidates and keeps the one that matches graph distances better:

* Pivot MDS ([Brandes & Pich, 2006](https://doi.org/10.1007/978-3-540-70904-6_6)): breadth first
  search from a few well spread "pivot" nodes, then classical MDS on those distances.
  `O(pivots * (nodes + links))`.
* Radial tree (2D only): a breadth first search tree from a central node, where depth is the
  radius and each subtree gets an angle proportional to its size. This catches trees, which MDS
  tends to fold onto themselves. `O(nodes + links)`.

## Usage

``` js
import createLayout from 'ngraph.forcelayout';
import placeNodes from 'ngraph.forcelayout.pivot';

const layout = createLayout(graph);
const choice = placeNodes(graph, layout, {unit: 10}); // 'pivot MDS' or 'radial tree'
for (let i = 0; i < 300; ++i) layout.step();
```

Options:

* `dimensions` (2): must match the layout's `dimensions`.
* `unit` (10): length of one hop in layout units. Pass the layout's `springLength`.
* `pivots` (25): number of pivot nodes.
* `jitter` (0.1): random offset, as a fraction of `unit`, so that nodes with the same graph
  distances don't sit on top of each other.
* `seed` (42): the same seed gives the same positions.

## Not done yet

* Pinned nodes are moved like any other node.
* Nodes added to the graph later are placed by the layout, not by this module.

Part of the [ngraph.forcelayout](../..) repository. Not published to npm yet.
