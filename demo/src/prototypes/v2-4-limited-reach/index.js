// "Push with a limited reach": nodes repel each other with the law of a flat world that has a
// range (Yukawa's equation solved in a plane) instead of the library's 3-D law with no range.
// It replaces the library's 'nbody' force with the same Barnes-Hut walk and a different kernel.
// 2-D only; it always uses the quad tree (the panel's dual-tree choice is ignored while it's on).
import createReachTree from './createReachTree.js';

export default {
  id: 'v2-4-limited-reach',
  title: 'Push with a limited reach',
  author: 'v2-4 (Feynman Vol. II, ch. 23-29)',
  description: `
<p><b>Problem.</b> Nodes push each other apart with a law made for 3-D space, and the push never
stops, however far away two nodes are. In a flat picture that has two bad effects. Up close the
push fades too fast, so crowded cores and the leaves around big hubs are squeezed into small dense
discs. Far away it never stops, so heavy hubs and whole components shove each other across the
screen, and zoom-to-fit leaves the structure small in a lot of empty space.</p>
<p><b>Change.</b> Here the push fades more gently up close (as 1/distance instead of
1/distance<sup>2</sup>) but has a <i>reach</i>: beyond a few spring lengths it dies out
quickly. Nearby nodes still keep their room. Distant stars and pieces stop shoving each other,
and the springs between them pull the picture together.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, ch. 28-6: Yukawa's equation for a
force with a limited range, solved here for a plane instead of 3-D space (its solution there is a
Bessel function, ch. 23).</p>
<p><b>Look for.</b> On megaStars and starOfStars the stars grow into large bursts that fill the
screen. On sciMet and yeast the core opens up and stays large; with <i>none</i> the small
pieces keep flying outward and the core shrinks to a dot. Trees such as binTree8 should look
about the same.</p>
<p><b>Gets worse.</b> Groups in community graphs get denser inside. Thousands of tiny pieces
(EVA) crowd together. A short reach (2 or less) starts to fold trees. <i>Reach 0</i> means
"no limit": the gentler law alone, which blows hub graphs apart. Try it on megaStars to see
why the reach matters.</p>`,
  tryGraphs: ['Benchmark: megaStars', 'Benchmark: starOfStars', 'Benchmark: sciMet', 'Benchmark: yeast', 'Benchmark: binTree8'],
  params: [{
    key: 'reach', label: 'Reach (spring lengths)', value: 4, step: '0.5',
    help: 'How far the push reaches before it fades out, in spring lengths. Smaller: bigger stars and tighter pieces, but trees start to fold below about 2. Larger: closer to the library. 0 means no limit. At one spring length two nodes push exactly as hard as in the library.'
  }],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    const settings = simulator.settings;
    // 2-D only: in other dimensions the library's own force stays in place.
    if (settings.dimensions !== 2) return null;

    const forces = simulator.getForces();
    const libraryNbody = forces.get('nbody');
    if (!libraryNbody) return null;

    const tree = createReachTree({ gravity: settings.gravity, theta: settings.theta }, simulator.random);
    const unit = settings.springLength;
    const reach = Math.max(0, Number(params.reach) || 0) * unit;
    tree.setReach(reach, unit);

    // Forces run in the order they were added: our n-body force has to stay first, because it
    // resets each body's force before the springs add theirs.
    const others = [];
    forces.forEach((fn, name) => { if (name !== 'nbody') others.push([name, fn]); });
    others.forEach(([name]) => simulator.removeForce(name));
    simulator.removeForce('nbody');
    simulator.addForce('nbody', nbodyWithReach);
    others.forEach(([name, fn]) => simulator.addForce(name, fn));

    function nbodyWithReach() {
      const bodies = simulator.bodies;
      if (bodies.length === 0) return;
      // Read the live settings, so the panel's gravity/theta/drag still apply.
      tree.options({ gravity: settings.gravity, theta: settings.theta });
      // FIRE removes energy its own way and has no drag; Euler gets the library's drag.
      const drag = settings.integrator === 'fire' ? 0 : settings.dragCoefficient;
      tree.insertBodies(bodies);
      for (let i = bodies.length - 1; i >= 0; --i) {
        const body = bodies[i];
        if (body.isPinned) continue;
        body.reset();
        tree.updateBodyForce(body);
        if (drag) {
          body.force.x -= drag * body.velocity.x;
          body.force.y -= drag * body.velocity.y;
        }
      }
    }

    return {
      dispose() {
        // The layout is thrown away after dispose(); put the library force back anyway, in case
        // the same layout keeps running.
        if (simulator.getForces().get('nbody') !== nbodyWithReach) return;
        const after = [];
        simulator.getForces().forEach((fn, name) => { if (name !== 'nbody') after.push([name, fn]); });
        after.forEach(([name]) => simulator.removeForce(name));
        simulator.removeForce('nbody');
        simulator.addForce('nbody', libraryNbody);
        after.forEach(([name, fn]) => simulator.addForce(name, fn));
      }
    };
  }
};
