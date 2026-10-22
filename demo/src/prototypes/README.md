# Layout prototypes

Each folder here is one experimental change to the layout that you can try live in the demo:
pick it in the idea bar at the top of the panel. They are demo code, not part of the library,
and each one changes the layout only through the library's public API.

Picking an idea restarts the layout from the same start as **none**, and the **on** box next to
the picker turns the idea off and on again, so switching compares the two directly. Changing a
parameter (under Settings) carries on from the current drawing: the demo makes a new layout at the
current positions and attaches the idea again with the new values. Reset starts over.

## Adding one

Create `demo/src/prototypes/<id>/index.js`. Nothing else needs to change: `index.js` in this
folder finds it. Keep everything the prototype needs inside its folder.

```js
export default {
  id: 'my-idea',                 // stable, used in the URL
  title: 'Short name',           // shown in the picker
  author: 'who wrote it',
  // HTML shown by the picker's help (?) icon: what problem it fixes, how, and what to look for
  description: '<p>...</p>',
  // Graphs worth trying, as named in the graph picker (src/lib/getAvailableGraphs.js)
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: grid20'],
  // Numbers the viewer can change. Each one shows up as an input; `help` is its help text.
  params: [{ key: 'strength', label: 'Strength', value: 1, step: '0.1', help: '...' }],
  // Label of the final-step button, when attach() returns finish()
  finishLabel: 'Run final step',

  // Called for every new layout: graph load, Reset, picking the idea, changing a parameter or the
  // number of dimensions. `layout` is the ngraph.forcelayout instance, `graph` the ngraph.graph,
  // `params` the current parameter values, `settings` the layout settings from the panel.
  // `steps` is how many steps the drawing has already run: 0 for a fresh start, more when the
  // new layout carries on from the current positions. If the idea counts steps (e.g. "switch on
  // at step 300"), count from it.
  attach({ layout, graph, params, settings, steps }) {
    // Change the layout here, e.g.:
    //   layout.simulator.addNodeFormula('my-pull', { formula: 'force -= 0.01 * pos' });
    //   layout.simulator.repulsionLaw('exp(-r / 30) / r^2');
    //   layout.getSpring(fromId, toId).length = 20;
    //   layout.simulator.on('settings', onSettings); // redo what depends on the settings
    return {
      // Optional: one-off step the viewer runs with a button (the layout pauses first)
      finish() {},
      // Optional: color of a node as 0xRRGGBBAA, e.g. by the group it is in; return 0 or
      // nothing for the default color. Called for every node on every frame, so keep it cheap.
      nodeColor(nodeId) {},
      // Optional: undo anything that outlives the layout, e.g. remove event listeners
      dispose() {},
    };
  },
};
```

The library's README ("Changing the physics") shows the tools: stages that run every step, a
repulsion law, charges, columns of your own on the bodies, and rules for close pairs. Write
forces over `store.pos` and `store.force` (axis `k` of body `i` is at `i * D + k`) and they work
in any number of dimensions.

Physics that other engines (the GPU) should run too goes into formulas, sums, stages gated with
`when` (e.g. every 25 steps) and host steps, never into a `'step'` listener: on the GPU that
listener runs once per readback, not once per step. Parameter functions get the step context
(the step, the settings), not the positions; JS that needs positions in the middle of a step is
a host step.

On WebGPU the demo asks `simulator.plan(gpuBackend)` whether the GPU module can run what an idea
changed. If it can (today, ideas that only change the repulsion law), the GPU runs the idea;
otherwise the GPU runs the layout without it and the demo says why.
