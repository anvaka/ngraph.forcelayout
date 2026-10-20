import createLeafFadeTree from './createLeafFadeTree.js';

// Replaces the layout's repulsion with one where pushes that involve a leaf fade with
// distance. Springs, drag, the integrator and every setting stay as they are.
export default {
  id: 'v1-2-leaf-fade',
  title: 'Only leaf pushes fade',
  author: 'v1-2 (Feynman Vol. 1, ch. 12-13)',
  description: `
<p>ngraph draws a hub with many leaves (nodes that have only one link) as a small, solid disc.
The discs end up far apart, and most of the screen is empty.</p>
<p>Why: every node pushes every other node away. Seen from far off, a crowd of leaves pushes like
one heavy node that weighs as much as all of them together. Only one link holds that crowd to
the rest of the graph, so the bigger the star, the farther it shoves its neighbours, while the
star itself stays small.</p>
<p>Here, every push that involves a leaf fades with distance, like the short-range force inside
atomic nuclei in the Feynman Lectures (Vol. 1, ch. 12; "a crowd pushes like one node" is the
shell theorem of ch. 13). Up close, leaves still keep apart; from afar, they stop shoving the
drawing around. Pushes between other nodes stay as they are.</p>
<p>Look for stars opening into large sunbursts that fill the screen (starOfStars, megaStars,
EVA), and trees keeping their main branches (paTree3k). grid20 has no leaves and should not
change.</p>
<p>What gets worse: more lines cross inside the sunbursts, and graphs of many small pieces with
legs (caterpillars) pack closer and overlap more. Raising "Fade nodes with at most this many
links" fades more pushes: stars open further, but trees lose the gaps between their branches.</p>
<p>2D only: in 3D it does nothing. It uses its own quad tree, so the Repulsion setting is ignored
while it is on. A step takes about 1.4 to 1.9 times as long as with the stock quad tree on the
3k to 7k node graphs, and about 9 times as long as with the faster dual tree.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: paTree3k', 'Benchmark: grid20'],
  params: [
    {
      key: 'fade', label: 'Fade distance', value: 3, step: '0.5',
      help: 'How far a leaf\'s push reaches, in ideal spring lengths. Smaller packs the stars closer together; 20 or more is about the same as none.'
    },
    {
      key: 'leafLinks', label: 'Fade nodes with at most this many links', value: 1, step: '1',
      help: '1 fades only leaves. Raise it to fade more nodes: at 1000 every push fades, the stars open even more, but trees lose the gaps between their branches and turn into an even carpet.'
    },
  ],

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;
    const forces = simulator.getForces();
    const springForce = forces.get('spring');
    if (!forces.has('nbody') || !springForce) return null;

    const tree = createLeafFadeTree();
    const random = simulator.random;
    const out = new Float64Array(2);
    const fadeLength = Math.max(Number(params.fade) || 3, 0.1);
    const leafLinks = Math.max(Number(params.leafLinks) || 1, 1);
    let isLeaf = new Uint8Array(0);
    let knownBodies = -1, knownSprings = -1, sinceRefresh = 0;

    // Keep the order of forces: repulsion and drag first (it resets forces), then springs.
    simulator.removeForce('nbody');
    simulator.removeForce('spring');
    simulator.addForce('nbody', leafFadeRepulsion);
    simulator.addForce('spring', springForce);
    return {};

    function leafFadeRepulsion() {
      const bodies = simulator.bodies;
      const n = bodies.length;
      if (n === 0) return;
      const s = simulator.settings;
      refreshLeaves(bodies);
      tree.build(bodies, isLeaf);
      const fade = fadeLength * s.springLength;
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
