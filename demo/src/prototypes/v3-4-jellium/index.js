import addBackground from './background.js';

export default {
  id: 'v3-4-jellium',
  title: 'Neutral background ("jellium")',
  author: 'v3-4 (Feynman Vol. III reader)',
  description: `
<p>On graphs with many separate pieces (yeast, sciMet, EVA) ngraph draws the main part as a small
dense ball, with the pieces on a ring far away, so most of the screen is empty. Graphs made of big
stars (megaStars, starOfStars) have the same problem: small discs of leaves joined by very long lines.</p>
<p>The cause is that every node pushes every other node away, however far apart they are, and big
hubs push hardest. This idea keeps that push, but lays an even "background" under the drawing: a
disc that pulls each node exactly as hard as an evenly spread crowd of nodes would push it. Where
nodes are spread evenly the two cancel. Crowded places still push apart, empty places now pull
nodes in, and nothing gets flung far away.</p>
<p>It comes from Feynman's <i>Lectures on Physics</i>, Vol. III, chapter 21 (superconductivity).
In a metal, a fixed background of positive ions balances the electrons' push on each other, and
that keeps the electrons' density nearly even. Physicists call such a background "jellium".</p>
<p>The background switches on at step 300. At that moment it measures how closely nodes sit, and it
keeps that value for the rest of the run. Look for the stars or the main part filling the screen,
with the pieces close around it. Compare with <b>none</b>.</p>
<p>What gets worse: more crossing lines where stars now touch. A higher <i>Background density</i>
packs small pieces so close that you can't tell them apart, and trees get more crossings. It does
not help communities (sbm8x50 looks the same), and it changes nothing until step 300. 2D only: in
3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: megaStars', 'Benchmark: starOfStars', 'Benchmark: yeast', 'Benchmark: sciMet', 'Benchmark: grid20'],
  params: [
    {
      key: 'density', label: 'Background density', value: 0.25, step: '0.05',
      help: 'How dense the background is, as a share of how closely nodes sit at the step it switches on. ' +
        'Higher packs stars and pieces tighter (fewer gaps, more crossings, pieces start to mix); lower is gentler. ' +
        'Measured once, then kept: re-measuring would let the drawing shrink without end.'
    },
    {
      key: 'extra', label: 'Extra pull', value: 0.3, step: '0.1',
      help: 'Extra background charge, as a share of the nodes\' total mass. Pulls back pieces that were pushed ' +
        'far away before the background switched on. 0 means an exactly balanced background.'
    },
    {
      key: 'startStep', label: 'Switch on at step', value: 300, step: '50',
      help: 'The background waits this many steps, so the graph can first unfold, and then measures node density. ' +
        'Earlier gets pieces in sooner but can freeze an unfinished layout.'
    }
  ],

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    addBackground(layout, {
      density: Number(params.density) > 0 ? Number(params.density) : 0.25,
      extra: Number(params.extra) >= 0 ? Number(params.extra) : 0.3,
      startStep: Number(params.startStep) >= 0 ? Number(params.startStep) : 300
    });
    return null;
  }
};
