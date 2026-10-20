# Layout prototypes

Each folder here is one experimental change to the layout that you can try live in the demo:
pick it under **Settings → Prototypes → Idea**. They are demo code, not part of the library,
and each one changes the layout only through the library's public API.

Picking an idea restarts the layout from the same start as **none**, so switching between the
two compares them directly. Changing a parameter restarts the layout too.

## Adding one

Create `demo/src/prototypes/<id>/index.js`. Nothing else needs to change: `index.js` in this
folder finds it. Keep everything the prototype needs inside its folder.

```js
export default {
  id: 'my-idea',                 // stable, used in the URL
  title: 'Short name',           // shown in the picker
  author: 'who wrote it',
  // HTML shown under the picker: what problem it fixes, how, and what to look for
  description: '<p>...</p>',
  // Graphs worth trying, as named in the graph picker (src/lib/getAvailableGraphs.js)
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: grid20'],
  // Numbers the viewer can change. Each one shows up as an input; `help` is its help text.
  params: [{ key: 'strength', label: 'Strength', value: 1, step: '0.1', help: '...' }],
  // Label of the final-step button, when attach() returns finish()
  finishLabel: 'Run final step',

  // Called for every new layout: graph load, Reset, picking the idea, changing a parameter.
  // `layout` is the ngraph.forcelayout instance, `graph` the ngraph.graph, `params` the current
  // parameter values, `settings` the layout settings from the panel.
  attach({ layout, graph, params, settings }) {
    // Change the layout here, e.g.:
    //   layout.simulator.addForce('my-force', iteration => { ... });
    //   layout.getSpring(fromId, toId).length = 20;
    //   layout.on('step', onStep);
    return {
      // Optional: one-off step the viewer runs with a button (the layout pauses first)
      finish() {},
      // Optional: undo anything that outlives the layout, e.g. remove event listeners
      dispose() {},
    };
  },
};
```

To reuse library internals, import them by relative path, e.g.
`import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js'`;
the demo's Vite config bundles them like the library itself.

Prototypes run on the CPU only; the WebGPU backend ignores them.
