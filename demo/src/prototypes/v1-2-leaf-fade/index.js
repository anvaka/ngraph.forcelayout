import addLeafFade from './leafFade.js';

// Makes the pushes that involve a leaf fade with distance (see leafFade.js). Springs, drag and the
// integrator stay as they are; the pushes always walk one quad tree, whichever Repulsion (nbody)
// setting is picked.
export default {
  id: 'v1-2-leaf-fade',
  title: 'Only leaf pushes fade',
  author: 'v1-2 (Feynman Vol. 1, ch. 12-13)',
  description: `
<p>ngraph draws a hub with many leaves (nodes that have only one link) as a small, solid disc, far
from the other discs on a mostly empty screen: seen from far off, a crowd of leaves pushes like
one heavy node.</p>
<p>Here, every push that involves a leaf fades with distance, like the short-range force inside
atomic nuclei in the Feynman Lectures (Vol. 1, ch. 12; "a crowd pushes like one node" is the
shell theorem of ch. 13), and every other push stays as it is.</p>
<p>Look for stars opening into large sunbursts (starOfStars, megaStars) and trees keeping their
main branches (paTree3k); grid20 has no leaves and looks the same.</p>
<p>What gets worse: more lines cross inside the sunbursts, and small pieces (caterpillars) pack
closer and overlap. On EVA, a piece of two linked nodes counts as two leaves, so it loses all
long-range push and mixes into the main part, which is much of why EVA fills the screen
better.</p>
<p>2D only (it does nothing in 3D). Its pushes always walk one quad tree, whichever Repulsion
setting is picked: a step takes about 1.35 to 1.55 times as long as the stock quad tree, and about 8
times as long as the dual tree.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: paTree3k', 'Benchmark: grid20'],
  params: [
    {
      key: 'fade', label: 'Fade distance', value: 3, step: '0.5',
      help: 'How far a leaf\'s push reaches, in ideal spring lengths. Smaller packs the stars closer together; 0 means leaves don\'t push at all and pile up around their hub. Larger moves toward none: on starOfStars 20 is still clearly different, and about 100 looks like none. Faded pushes past 6 fade distances are dropped (they are under 0.25%).'
    },
    {
      key: 'leafLinks', label: 'Fade nodes with at most this many links', value: 1, step: '1',
      help: 'Nodes with 1 up to this many links fade; nodes with no links never do. 0 fades nothing, so it pushes like none. 1 fades only leaves. Raise it to fade more nodes: at 1000 almost every push fades (hubs with more links keep theirs), the stars open even more, but trees lose the gaps between their branches and turn into an even carpet.'
    },
  ],

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;
    if (!simulator.getStage('repulsion')) return null;

    const fadeLength = numberOr(params.fade, 3, 0);         // 0: leaves don't push at all
    const leafLinks = numberOr(params.leafLinks, 1, 0);     // 0: nothing fades
    const remove = addLeafFade(layout, { fadeLength, leafLinks });
    return { dispose: remove };
  },
};

// A number from the panel or the URL: NaN falls back to the default, anything below `min` is `min`
function numberOr(value, fallback, min) {
  const number = Number(value);
  return Number.isNaN(number) ? fallback : Math.max(number, min);
}
