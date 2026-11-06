import addSoftCore from './softCore.js';
import addSoftStep from './softStep.js';
import addGatedSoftStep from './gatedSoftStep.js';

export default {
  id: 'soft-core',
  title: 'Soft-core push for crowded nodes',
  author: 'phys-engine, from the round 6 geometry, vis, plasma and circuits reports',
  description: `
<p>On dense graphs (Gset/G43, er1000, Barabasi-Albert) the core boils: close, unlinked nodes push
each other so stiffly that the step overshoots, and the speed limit turns that into a steady shake.
The 1/r² push is the 3D law; in 2D every crowded neighbour adds to that stiffness.</p>
<p>This idea changes only the short-range part of the push. With the default <b>Law</b> 1 (slab),
each node pushes like a charge spread through a thin slab: 1/r up close, the 2D law, which still
grows so nodes can't sit on top of each other, and today's 1/r² past about twice <b>Slab size</b>
spring lengths. Law 0 is Plummer softening from N-body codes: the push levels off closer than a
length set by the step.</p>
<p>What's left after that is a small shake in very crowded spots (megaStars' leaf fans), stirred by
the force approximation's error. <b>Calm crowds</b> 2 (the default) gives only the nodes whose
back-and-forth motion keeps going, and isn't dying down, a gentler step for their measured
stiffness. Other nodes, and every node in the first <b>Shake memory</b> steps, take the usual
step, so unfolding isn't slowed.</p>
<p>Look for the G43, er1000 and Barabasi-Albert cores going still and evenly spaced, and
megaStars' fans going still with their rings kept. Grids, trees and many pieces should look as
they do without it. The shake thresholds count steps, so with a timeStep other than 0.5 G43 can
stop while still creeping a little.</p>`,
  tryGraphs: ['Gset/G43', 'Benchmark: er1000', 'Barabasi-Albert (20k)', 'Benchmark: megaStars', 'Binary tree (8k)'],
  params: [
    { key: 'law', label: 'Law', value: 1, step: '1',
      help: '1: slab (1/r up close, still growing). 0: Plummer softening (the push levels off up close).' },
    { key: 'slab', label: 'Slab size', value: 1.5, step: '0.1',
      help: 'Law 1 only: half the slab thickness, in spring lengths. Larger calms bigger cores but shrinks them.' },
    { key: 'plummer', label: 'Plummer size', value: 1, step: '0.1',
      help: 'Law 0 only: times the length the step allows, (2 |gravity| timeStep² · mean charge)^(1/3). Larger softens more and lets fans and crowds pack tighter.' },
    { key: 'calm', label: 'Calm crowds', value: 2, step: '1',
      help: '2: give the soft step only to nodes that keep shaking: whose recent motion goes back and forth (over Shake threshold spring lengths a step) and is not dying down over Shake memory steps, after the first Shake memory steps. 1: give every node the soft step, which also slows unfolding. 0: off. The soft step: a node whose force swings as it moves takes the implicit step for its measured stiffness.' },
    { key: 'shake', label: 'Shake threshold', value: 0.002, step: '0.001',
      help: 'Calm crowds 2 only: how much back-and-forth motion, in spring lengths per step, opens a node\'s soft step. With Law 0, 0.01 works better.' },
    { key: 'settle', label: 'Shake memory', value: 512, step: '64',
      help: 'Calm crowds 2 only: steps over which a node\'s shaking must not have died down for its soft step to open; also the steps at the start when it never opens. With Law 0, 256 works better.' }
  ],

  attach({ layout, params }) {
    const law = Number(params.law) === 0 ? 0 : 1;
    const core = addSoftCore(layout.simulator, {
      law,
      plummer: Math.max(0.01, Number(params.plummer) || 1),
      slab: Math.max(0.01, Number(params.slab) || 1.5)
    });
    const calm = Number(params.calm);
    const removeCalm = calm === 1 ? addSoftStep(layout.simulator, 'soft-core-calm', { strength: 1, release: 0.9, cap: 50 }) :
      calm === 2 ? addGatedSoftStep(layout.simulator, 'soft-core-calm', {
        release: 0.9, cap: 50, window: 32, persist: 0.9, decay: 0.995,
        slow: Math.max(32, Number(params.settle) || 512),
        on: Math.max(0, Number(params.shake) || 0.002)
      }) : null;
    return { dispose() { if (removeCalm) removeCalm(); core.dispose(); } };
  }
};
