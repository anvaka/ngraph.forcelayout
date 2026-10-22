import addBackground from './background.js';

export default {
  id: 'v3-4-jellium',
  title: 'Neutral background ("jellium")',
  author: 'v3-4 (Feynman Vol. III reader)',
  description: `
<p>On graphs with many separate pieces (yeast, sciMet, EVA), ngraph pushes the small pieces far out,
and on big-star graphs (megaStars, starOfStars) the stars end up as small discs on long lines.</p>
<p>This idea keeps every node's push, but adds an even "background" disc that pulls each node toward
the centre about as hard as an evenly spread crowd of nodes would push it, so crowded places still
push apart and empty space pulls nodes in. It comes from Feynman's <i>Lectures on Physics</i>,
Vol. III, chapter 21, where a fixed background of positive charge in a metal ("jellium") balances the
electrons' push on each other.</p>
<p>At step 300 it measures how closely the nodes sit and fixes the disc's density from that. On
megaStars the stars become big touching starbursts (the longest hub-to-hub line shrinks from about
240 to 125); on yeast the main part keeps its size, but the pieces stop drifting away, so zoom-to-fit
gives it most of the screen; grid20 and sbm8x50 look the same.</p>
<p>What gets worse: more crossing lines where stars touch (starOfStars: 0.13 to 0.31 per line),
small pieces packed too close to tell apart at a higher <i>Background density</i>, a crushed
drawing if it switches on before about step 50, and a short pause at step 300 while it measures.
It changes nothing before step 300, doesn't help communities, and does nothing in 1D or above 3D,
on graphs under 8 nodes, or when nodes attract each other (gravity 0 or more). In 3D the disc is a
ball, whose pull is exact.</p>`,
  tryGraphs: ['Benchmark: megaStars', 'Benchmark: starOfStars', 'Benchmark: yeast', 'Benchmark: sciMet', 'Benchmark: grid20'],
  params: [
    {
      key: 'density', label: 'Background density', value: 0.25, step: '0.05',
      help: 'How dense the background is, as a share of how closely nodes sit at the step it switches on. ' +
        '0 (or less) turns the background off. Higher packs stars and pieces tighter: fewer gaps, more crossings, ' +
        'and at 0.5 EVA\'s small pieces pack so close that you can\'t tell them apart. Lower is gentler. ' +
        'Measured once, then kept: re-measuring every step gave the same picture in a short test, ' +
        'so measuring once is simply the simpler choice.'
    },
    {
      key: 'extra', label: 'Extra pull', value: 0.3, step: '0.1',
      help: 'Extra background charge, as a share of the nodes\' total mass, meant to pull back pieces that start ' +
        'far away. 0 means an exactly balanced background; below 0 counts as 0. From the demo\'s start it isn\'t ' +
        'needed: at 0, yeast, sciMet and EVA pull their pieces in just as well.'
    },
    {
      key: 'startStep', label: 'Switch on at step', value: 300, step: '50',
      help: 'The background waits this many steps, so the graph can first unfold, and then measures node density. ' +
        'Below about 50 the graph hasn\'t unfolded yet: the background comes out too small and crushes the whole ' +
        'drawing (at 0, yeast shrinks to a tenth of its width). Below 0 counts as 0.'
    }
  ],

  attach({ layout, params, settings, steps }) {
    const dimensions = settings.dimensions || 2;
    if (dimensions !== 2 && dimensions !== 3) return null;
    const density = Number.isNaN(Number(params.density)) ? 0.25 : Number(params.density);
    if (!(density > 0)) return null; // 0 turns the background off
    const extra = Number(params.extra);
    const startStep = Number(params.startStep);
    const background = addBackground(layout, {
      density,
      extra: Number.isNaN(extra) ? 0.3 : Math.max(0, extra),
      startStep: Number.isNaN(startStep) ? 300 : startStep,
      stepsBefore: steps || 0
    });
    return { dispose: background.dispose };
  }
};
