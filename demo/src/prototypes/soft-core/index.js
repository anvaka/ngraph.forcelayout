import addSoftCore from './softCore.js';
import addSoftStep from '../pe-1-soft-step/softStep.js';
import addGatedSoftStep from './gatedSoftStep.js';

export default {
  id: 'soft-core',
  title: 'Soft-core push for crowded nodes',
  author: 'phys-engine, from the round 6 geometry, vis and plasma reports',
  description: `
<p>On dense graphs (Gset/G43, HB/bcsstk02, Barabasi-Albert) the core boils: close, unlinked nodes
push each other so stiffly that the step overshoots, and the speed limit turns that into a steady
shake.</p>
<p>This idea changes only the short-range part of the push, so a close pair can't get stiffer than
the step can follow. Far away it is today's 1/r². Nothing else changes: masses, drag, the step.</p>
<p><b>Law</b> 0 is Plummer softening from N-body codes: the push levels off closer than a length
set by the step (|gravity|, timeStep and the mean charge). <b>Law</b> 1 is a slab: each node pushes
like a charge spread through a thin slab, 1/r up close (it still grows, so nodes can't sit on top of
each other), 1/r² past about twice <b>Slab size</b> spring lengths.</p>
<p>Look for the G43 and Barabasi-Albert cores going still; check megaStars' leaf fans and trees.</p>`,
  tryGraphs: ['Gset/G43', 'Barabasi-Albert (20k)', 'Benchmark: megaStars', 'Binary tree (8k)'],
  params: [
    { key: 'law', label: 'Law', value: 0, step: '1',
      help: '0: Plummer softening (the push levels off up close). 1: slab (1/r up close, still growing).' },
    { key: 'plummer', label: 'Plummer size', value: 1, step: '0.1',
      help: 'Times the length the step allows, (2 |gravity| timeStep² · mean charge)^(1/3). Larger softens more and lets fans and crowds pack tighter.' },
    { key: 'calm', label: 'Calm crowds', value: 0, step: '1',
      help: '1: also give every node the soft step (pe-1): a node whose force swings as it moves takes the implicit step. With the soft core, what still shakes is crowds stirred by the force approximation error; this damps them. 2: the same, but only for nodes that keep shaking: whose recent motion goes back and forth (over Shake threshold spring lengths a step) and is not dying down over Shake memory steps, after the first Shake memory steps.' },
    { key: 'shake', label: 'Shake threshold', value: 0.01, step: '0.001',
      help: 'Calm crowds 2 only: how much back-and-forth motion, in spring lengths per step, opens a node\'s soft step.' },
    { key: 'settle', label: 'Shake memory', value: 256, step: '64',
      help: 'Calm crowds 2 only: steps over which a node\'s shaking must not have died down for its soft step to open; also the steps at the start when it never opens.' },
    { key: 'slab', label: 'Slab size', value: 1.5, step: '0.1',
      help: 'Half the slab thickness, in spring lengths. Larger calms bigger cores but shrinks them.' }
  ],

  attach({ layout, params }) {
    const law = Number(params.law) === 1 ? 1 : 0;
    const core = addSoftCore(layout.simulator, {
      law,
      plummer: Math.max(0.01, Number(params.plummer) || 1),
      slab: Math.max(0.01, Number(params.slab) || 1.5)
    });
    const calm = Number(params.calm);
    const removeCalm = calm === 1 ? addSoftStep(layout.simulator, 'soft-core-calm', { strength: 1, release: 0.9, cap: 50 }) :
      calm === 2 ? addGatedSoftStep(layout.simulator, 'soft-core-calm', { release: 0.9, cap: 50, window: 32, slow: Math.max(32, Number(params.settle) || 256), persist: 0.9, on: Math.max(0, Number(params.shake) || 0.01), decay: 0.995 }) : null;
    return { dispose() { if (removeCalm) removeCalm(); core.dispose(); } };
  }
};
