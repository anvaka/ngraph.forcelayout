// Short-range push: node repulsion fades out beyond a couple of spring lengths, the way neutral
// matter barely pushes at a distance (Feynman Lectures, Vol. I, ch. 2). It replaces the library's
// n-body force with the same Barnes-Hut quad tree, patched to screen the push (screenedQuadTree.js).
import createScreenedQuadTreeFactory from './screenedQuadTree.js';

export default {
  id: 'v1-1-short-range-push',
  title: 'Push fades fast with distance',
  author: 'v1-1 (Feynman Vol. I, ch. 1-6)',
  description: `
<p><b>The problem.</b> On graphs with big hubs, ngraph draws each hub and its leaves as a small,
dense disc, far from the next one, and most of the picture stays empty. On graphs with many separate
pieces, the main piece shrinks to a blob while the small pieces fly off to a far ring.</p>
<p><b>Why.</b> Every node pushes every other node, however far, and the pushes of a group add up.
Two hubs with 200 leaves each push each other apart with their whole crowd, so they end up far apart,
while the leaves themselves stay about one spring length from their hub.</p>
<p><b>The change.</b> The push between two nodes is the usual one when they are close, but it dies
out beyond about <i>Push range</i> spring lengths. Groups then sit as close as their own leaves
allow, and the picture fills up. This is how ordinary matter behaves: atoms are full of electric
charges, but the plus and minus cancel, so two atoms barely feel each other at a distance and only
push when they come close (Feynman, <i>Lectures on Physics</i>, Vol. I, chapter 2).</p>
<p><b>What to look for.</b> On starOfStars and megaStars the stars grow into large, readable
bursts that nearly touch. On yeast the main piece fills the frame and the small pieces stay next to
it instead of drifting away. On sbm8x50 (eight communities) nothing should change.</p>
<p><b>What gets worse.</b> More edges cross where groups now touch. Without the long push nothing
irons out folds: trees lose their long trunk edges and their top branches press together (try
binTree8), and a grid can keep a crumpled corner (grid20). A larger <i>Push range</i> (4) fixes the
grid and brings part of the trunk back, while keeping part of the gain on the stars. 2D only: in 3D
the idea does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: yeast', 'Benchmark: sbm8x50'],
  params: [{
    key: 'range',
    label: 'Push range',
    value: 2,
    step: '0.5',
    help: 'How far the push reaches, in spring lengths. Small (2): stars and pieces pack tightly, ' +
      'trees lose their trunk. Large (4-8): closer to the stock layout. 0 turns the fading off.'
  }],

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return {};
    const simulator = layout.simulator;
    const live = simulator.settings;
    const bodies = simulator.bodies;
    const screen = { range: 0, cutoff: 0 };
    const createQuadTree = createScreenedQuadTreeFactory(screen);
    const quadTree = createQuadTree({ gravity: live.gravity, theta: live.theta }, simulator.random);

    // Forces run in the order they were added: n-body first (it also clears forces and adds
    // drag), then springs. Put ours in the n-body slot and keep the rest in their order.
    const original = [...simulator.getForces().entries()];
    original.forEach(([name]) => simulator.removeForce(name));
    simulator.addForce('short-range-push', shortRangePush);
    original.forEach(([name, force]) => { if (name !== 'nbody') simulator.addForce(name, force); });

    return {
      dispose() {
        [...simulator.getForces().keys()].forEach(name => simulator.removeForce(name));
        original.forEach(([name, force]) => simulator.addForce(name, force));
      }
    };

    function shortRangePush() {
      if (bodies.length === 0) return;
      const range = Math.max(0, Number(params.range) || 0) * live.springLength;
      screen.range = range;
      screen.cutoff = 6 * range;
      quadTree.options({ gravity: live.gravity, theta: live.theta });
      quadTree.insertBodies(bodies);
      // Like the library's n-body force: FIRE does its own damping, Euler gets drag here
      const drag = live.integrator === 'fire' ? 0 : live.dragCoefficient;
      for (let i = 0; i < bodies.length; ++i) {
        const body = bodies[i];
        if (body.isPinned) continue;
        body.reset();
        quadTree.updateBodyForce(body);
        if (drag) {
          body.force.x -= drag * body.velocity.x;
          body.force.y -= drag * body.velocity.y;
        }
      }
    }
  },
};
