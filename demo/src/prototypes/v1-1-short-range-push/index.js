// Short-range push: node repulsion fades out beyond a couple of spring lengths, the way neutral
// matter barely pushes at a distance (Feynman Lectures, Vol. I, ch. 2). It replaces the library's
// n-body force with the same Barnes-Hut quad tree, patched to screen the push (screenedQuadTree.js).
// At Push range 0 it calls the library's own n-body force, whichever Repulsion method is picked.
import createScreenedQuadTreeFactory from './screenedQuadTree.js';

export default {
  id: 'v1-1-short-range-push',
  title: 'Push fades fast with distance',
  author: 'v1-1 (Feynman Vol. I, ch. 1-6)',
  description: `
<p><b>The problem.</b> On graphs with big hubs, ngraph draws each star as a small, dense disc far
from the next one, and on graphs with many pieces the main piece shrinks while the small pieces
drift away.</p>
<p><b>The change.</b> Two nodes still push each other as usual when they are close, but the push
dies out beyond about <i>Push range</i> spring lengths, so a big group no longer shoves everything
away with its whole crowd. Neutral atoms behave this way: their plus and minus charges cancel, so
they barely feel each other until they come close (Feynman, <i>Lectures on Physics</i>, Vol. I,
chapter 2).</p>
<p><b>What to look for.</b> On starOfStars and megaStars the stars grow into large bursts that
nearly touch; on yeast the main piece takes about 40% of the frame instead of 10%, and the small
pieces stay close instead of drifting away; on sbm8x50 almost nothing changes.</p>
<p><b>What gets worse.</b> More edges cross where groups touch, and trees fold up and lose their
long trunk edges (binTree8, forest5k); <i>Push range</i> 4 brings part of the trunk back and clears
the crumpled corner grid20 can keep at 2. On yeast about three times as many nodes keep shaking
(15% to 44% of nodes moving at the speed limit). Each step takes about 1.5 times as long; 2D only
(in 3D it does nothing), and it ignores the Repulsion setting, so with <i>dual tree</i> it is
several times slower than stock.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: yeast', 'Benchmark: sbm8x50'],
  params: [{
    key: 'range',
    label: 'Push range',
    value: 2,
    step: '0.5',
    help: 'How far the push reaches, in spring lengths. Small (2): stars and pieces pack tightly, ' +
      'trees lose their trunk. Large (4-8): closer to the stock layout. 0 or less turns the idea ' +
      'off: the stock push, with whichever Repulsion method is picked.'
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
    const stockNbody = simulator.getForces().get('nbody');
    original.forEach(([name]) => simulator.removeForce(name));
    simulator.addForce('short-range-push', shortRangePush);
    original.forEach(([name, force]) => { if (name !== 'nbody') simulator.addForce(name, force); });

    return {
      dispose() {
        [...simulator.getForces().keys()].forEach(name => simulator.removeForce(name));
        original.forEach(([name, force]) => simulator.addForce(name, force));
      }
    };

    function shortRangePush(iteration) {
      if (bodies.length === 0) return;
      const range = Math.max(0, Number(params.range) || 0) * live.springLength;
      // No fading (range 0, or spring length 0) is the stock force, whatever Repulsion method the
      // panel picked; so is an infinite range, where the fading factor is 1.
      if (!(range > 0) || range === Infinity) return stockNbody(iteration);
      screen.range = range;
      screen.cutoff = 6 * range;
      quadTree.options({ gravity: live.gravity, theta: live.theta });
      quadTree.insertBodies(bodies);
      // Like the library's n-body force: FIRE does its own damping, Euler gets drag here. Same
      // order as the library too, so coincident bodies draw the same random nudges.
      const drag = live.integrator === 'fire' ? 0 : live.dragCoefficient;
      let i = bodies.length;
      while (i--) {
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
