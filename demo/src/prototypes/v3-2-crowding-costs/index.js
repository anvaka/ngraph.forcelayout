import addCrowdingCost from './confinement.js';

const NAME = 'v3-2-crowding-costs';
// The panel has no min/max, so the caps named in the help texts are applied in attach().
const MAX_STRENGTH = 1e6;
const MAX_RANGE = 1.5;

export default {
  id: 'v3-2-crowding-costs',
  title: 'Crowding costs energy',
  author: 'v3-2 (Feynman Vol. 3 reader)',
  description: `
<p>In ngraph's pictures, a hub's leaves often sit on a crowded ring at one distance, with empty
spokes inside (starOfStars, megaStars, EVA).</p>
<p>This idea makes crowding cost energy: two nodes closer than half a spring length push each
other apart, harder the closer they are, and two light leaves push about twice as hard as a leaf
and a heavy hub.</p>
<p>It comes from quantum mechanics (Feynman Lectures on Physics, Vol. 3, Section 10-1): squeezing
a particle into less room costs energy, more so for a light one.</p>
<p>One extra: the push alone makes crowded nodes shake, so they also get more inertia, which makes
their steps smaller but lets a steady pull move them as fast as before. Most of the calm you see
comes from this extra, not from the push (on starOfStars, 9% of nodes reverse direction each step
with <b>none</b>, under 1% here).</p>
<p>Look for discs that fill in toward the hub, with dots at many distances, while the stars stay
about as far apart as with <b>none</b>; grid20 is identical with <i>Start from: pivot MDS</i>.</p>
<p>What gets worse: more edge crossings (about 3&times; on starOfStars), Range 1 tangles sparse
graphs (powerGrid), and it costs about 1.5&ndash;1.7&times; the time per step, much more with a
long spring length.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: grid20'],
  params: [
    {
      key: 'strength', label: 'Strength', value: 100, step: '10',
      help: 'How hard crowded nodes push apart. More fills the discs further and adds edge crossings. 0 turns it off; values above 1,000,000 act as 1,000,000.'
    },
    {
      key: 'range', label: 'Range', value: 0.5, step: '0.1',
      help: 'How close two nodes must be, in spring lengths, before they push. 0.5 acts only inside crowded fans; 1 also spreads sparse graphs and trees, where it adds crossings, and costs about 2–2.5× the time per step. 0 turns it off; values above 1.5 act as 1.5 (up to about 3× the time per step).'
    },
  ],

  attach({ layout, params }) {
    const remove = addCrowdingCost(layout.simulator, NAME, {
      strength: Math.min(Number(params.strength), MAX_STRENGTH),
      range: Math.min(Number(params.range), MAX_RANGE),
    });
    return { dispose: remove };
  },
};
