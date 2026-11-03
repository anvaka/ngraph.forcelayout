import addSoftStep from './softStep.js';

const NAME = 'pe-1-soft-step';

export default {
  id: NAME,
  title: 'Soft step for crowded nodes',
  author: 'phys-engine (real-time physics engines)',
  description: `
<p>On dense graphs (Gset/G43, HB/bcsstk02, Barabasi-Albert) the core boils: most nodes run at the
speed limit every step and land somewhere new every frame (G43: 20–30 px per frame on WebGPU),
until the stop rule gives up and freezes them, overlapping and uneven.</p>
<p>The cause is numerical. In a crowd, the push between close unlinked nodes is so stiff that the
step overshoots (those nodes would need a time step 3–10× shorter), and the speed limit turns the
overshoot into a steady shake. Exact forces shake the same way.</p>
<p>Game physics engines keep piles of boxes still with <i>soft</i> steps: a stiff contact is
solved as backward Euler would solve it, as stiff as the step allows and no stiffer. Here each node
measures its own stiffness (how much its force changed per unit it moved since the last step) and
takes the backward Euler step for it: heavier and more damped the stiffer its crowd is. A node
that feels no change takes exactly the stock step. It is one node formula, so WebGPU runs it too.</p>
<p>Look for G43 and bcsstk02 packing into an even, crystal-like disc instead of a frozen gas, and
for the Barabasi-Albert core going quiet within a few seconds (under 1 px per frame).</p>
<p>What gets worse: graphs that start piled up (Many pieces) spread out about 1–2 s later, as the
pile is damped instead of exploding; layouts settle later (BA 20k 24 s instead of 3 s), because
the old early stops were the stop rule giving up on the shaking; about 20% more GPU time per step
on large graphs, as any added stage moves WebGPU off its fastest template.</p>`,
  tryGraphs: ['Gset/G43', 'HB/bcsstk02', 'Barabasi-Albert (20k)', 'Barabasi-Albert (100k)'],
  params: [
    {
      key: 'strength', label: 'Strength', value: 1, step: '0.1',
      help: '1: the implicit step for the measured stiffness. 0: the stock step (the measuring still runs).'
    },
    {
      key: 'release', label: 'Memory', value: 0.9, step: '0.05',
      help: 'How much of the measured stiffness a node keeps from one step to the next when its force swings less (0 to 0.99). Higher keeps shaken nodes calm longer.'
    },
    {
      key: 'cap', label: 'Cap', value: 50, step: '5',
      help: 'Largest stiffness, in units of mass / dt²: a node gets at most this many times heavier.'
    }
  ],

  attach({ layout, params }) {
    const remove = addSoftStep(layout.simulator, NAME, {
      strength: Math.max(0, Number(params.strength) || 0),
      release: Math.min(0.99, Math.max(0, Number(params.release) || 0)),
      cap: Math.max(0, Number(params.cap) || 0)
    });
    return { dispose: remove };
  }
};
