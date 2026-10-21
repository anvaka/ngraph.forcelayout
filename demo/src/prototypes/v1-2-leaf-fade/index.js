import createLeafFadeTree from './createLeafFadeTree.js';

// Replaces the layout's repulsion with one where pushes that involve a leaf fade with
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
    const forces = simulator.getForces();
    if (!forces.has('nbody')) return null;

    const tree = createLeafFadeTree();
    const random = simulator.random;
    const out = new Float64Array(2);
    const fadeLength = numberOr(params.fade, 3, 0);         // 0: leaves don't push at all
    const leafLinks = numberOr(params.leafLinks, 1, 0);     // 0: nothing fades
    let isLeaf = new Uint8Array(0);
    let knownBodies = -1, knownSprings = -1, sinceRefresh = 0;

    // Swap the repulsion in place: it resets forces, so every force after it (springs, and
    // anything added later) must still run after it.
    const names = [...forces.keys()];
    const later = names.slice(names.indexOf('nbody') + 1).map(name => [name, forces.get(name)]);
    simulator.removeForce('nbody');
    later.forEach(([name]) => simulator.removeForce(name));
    simulator.addForce('nbody', leafFadeRepulsion);
    later.forEach(([name, force]) => simulator.addForce(name, force));
    return {};

    function leafFadeRepulsion() {
      const bodies = simulator.bodies;
      const n = bodies.length;
      if (n === 0) return;
      const s = simulator.settings;
      refreshLeaves(bodies);
      tree.build(bodies, isLeaf);
      // A spring length of 0 or less (e.g. while typing in the panel) gives no reach at all
      const fade = s.springLength > 0 ? fadeLength * s.springLength : 0;
      const cutoff = 6 * fade; // exp(-6) is 0.25%: farther faded pushes are dropped
      const drag = s.integrator === 'fire' ? 0 : s.dragCoefficient; // FIRE uses no drag
      for (let i = 0; i < n; ++i) {
        const body = bodies[i];
        if (body.isPinned) continue;
        body.reset();
        out[0] = 0; out[1] = 0;
        tree.force(i, s.gravity, s.theta, fade, cutoff, random, out);
        body.force.x = out[0] - drag * body.velocity.x;
        body.force.y = out[1] - drag * body.velocity.y;
      }
    }

    // A body is a leaf when it has 1..leafLinks springs. Recounted when bodies or springs change.
    function refreshLeaves(bodies) {
      const springs = simulator.springs;
      sinceRefresh += 1;
      if (bodies.length === knownBodies && springs.length === knownSprings && sinceRefresh < 200) return;
      sinceRefresh = 0;
      knownBodies = bodies.length; knownSprings = springs.length;
      const index = new Map();
      for (let i = 0; i < bodies.length; ++i) index.set(bodies[i], i);
      const degree = new Int32Array(bodies.length);
      for (const spring of springs) {
        const a = index.get(spring.from), b = index.get(spring.to);
        if (a !== undefined) degree[a] += 1;
        if (b !== undefined) degree[b] += 1;
      }
      isLeaf = new Uint8Array(bodies.length);
      for (let i = 0; i < bodies.length; ++i) isLeaf[i] = degree[i] >= 1 && degree[i] <= leafLinks ? 1 : 0;
    }
  },
};

// A number from the panel or the URL: NaN falls back to the default, anything below `min` is `min`
function numberOr(value, fallback, min) {
  const number = Number(value);
  return Number.isNaN(number) ? fallback : Math.max(number, min);
}
