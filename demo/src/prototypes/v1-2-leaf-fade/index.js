import createLeafFadeTree from './createLeafFadeTree.js';

// Replaces the layout's repulsion stage with one where pushes that involve a leaf fade with
// distance. Springs, drag and the integrator stay as they are; the Repulsion (nbody) setting
// is ignored, since this uses its own quad tree.
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
<p>2D only (it does nothing in 3D), and it ignores the Repulsion setting, since it uses its own
quad tree. A step takes about 1.2 to 1.7 times as long as the stock quad tree, and 9 to 14 times
as long as the dual tree.</p>`,
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

    const tree = createLeafFadeTree();
    const random = simulator.random;
    const out = new Float64Array(2);
    const fadeLength = numberOr(params.fade, 3, 0);         // 0: leaves don't push at all
    const leafLinks = numberOr(params.leafLinks, 1, 0);     // 0: nothing fades
    let isLeaf = new Uint8Array(0);

    // Swap the repulsion in place: the drag stage and springs still run after it
    simulator.replaceStage('repulsion', leafFadeRepulsion);
    return {};

    function leafFadeRepulsion(store) {
      const n = store.n;
      if (n === 0) return;
      const s = simulator.settings;
      // A body is a leaf when it has 1..leafLinks springs
      if (isLeaf.length < n) isLeaf = new Uint8Array(store.capacity);
      const degree = store.degree;
      for (let i = 0; i < n; ++i) isLeaf[i] = degree[i] >= 1 && degree[i] <= leafLinks ? 1 : 0;
      tree.build(store, isLeaf);
      // A spring length of 0 or less (e.g. while typing in the panel) gives no reach at all
      const fade = s.springLength > 0 ? fadeLength * s.springLength : 0;
      const cutoff = 6 * fade; // exp(-6) is 0.25%: farther faded pushes are dropped
      const force = store.force, pinned = store.pinned;
      for (let i = 0; i < n; ++i) {
        if (pinned[i]) continue;
        out[0] = 0; out[1] = 0;
        tree.force(i, s.gravity, s.theta, fade, cutoff, random, out);
        force[2 * i] += out[0];
        force[2 * i + 1] += out[1];
      }
    }
  },
};

// A number from the panel or the URL: NaN falls back to the default, anything below `min` is `min`
function numberOr(value, fallback, min) {
  const number = Number(value);
  return Number.isNaN(number) ? fallback : Math.max(number, min);
}
