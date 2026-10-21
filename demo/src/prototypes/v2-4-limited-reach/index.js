// "Push with a limited reach": nodes repel each other with the law of a flat world that has a
// range (Yukawa's equation solved in a plane) instead of the library's 3-D law with no range.
// It replaces the library's 'nbody' force with the same Barnes-Hut walk and a different kernel.
// 2-D only; it always uses the quad tree (the panel's dual-tree choice is ignored while it's on).
import createReachTree from './createReachTree.js';

const DEFAULT_REACH = 4;
// Below about 1/9 spring length the push at one spring length rounds to zero, and matching it to
// the library's would divide by zero. A quarter spring length keeps the match well defined.
const MIN_REACH = 0.25;

export default {
  id: 'v2-4-limited-reach',
  title: 'Push with a limited reach',
  author: 'v2-4 (Feynman Vol. II, ch. 23-29)',
  description: `
<p><b>Problem.</b> Today's push never stops, however far apart two nodes are, so heavy hubs and
whole pieces shove each other across the screen, and zoom-to-fit shows small dense stars or a
tiny core in a lot of empty space.</p>
<p><b>Change.</b> Here the push has a <i>reach</i>, from Yukawa's equation for a force with a
limited range (Feynman's Lectures, Vol. II, ch. 28-6), solved for a flat picture (ch. 23). At the
default reach of 4 it is weaker than today closer than one spring length, up to 2.6 times
stronger from 2 to 12 spring lengths, and nearly gone beyond 30.</p>
<p><b>Look for.</b> On megaStars the stars become bursts that use about twice as much of the
screen as with <i>none</i>; binTree8 looks about the same. On sciMet, with <i>none</i> the pieces
keep flying outward and the core shrinks to a dot; with the reach the core keeps about 9 times
more of the screen after 6000 steps.</p>
<p><b>Gets worse.</b> Community groups and EVA's tiny pieces get denser, a reach of 2 or less
folds trees, and reach 0 ("no limit") blows hub graphs apart, with a reach above about 16 moving
toward it. It works in 2-D only (nothing happens in 3-D), ignores the dual-tree Repulsion
setting, and turns itself off at spring length 0.</p>`,
  tryGraphs: ['Benchmark: megaStars', 'Benchmark: starOfStars', 'Benchmark: sciMet', 'Benchmark: yeast', 'Benchmark: binTree8'],
  params: [{
    key: 'reach', label: 'Reach (spring lengths)', value: DEFAULT_REACH, step: '0.5',
    help: 'Where the push starts to fade, in spring lengths. Smaller: bigger stars and tighter pieces, but at 2 or less trees fold. Larger, up to about 16: a weaker effect, closer to the library; above that it moves toward 0. 0 (or less) means no limit, which blows hub graphs apart. Values between 0 and 0.25 act as 0.25. At one spring length two nodes push exactly as hard as in the library.'
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
    // In spring lengths. 0 or less: no limit. NaN (e.g. a broken URL value): the default.
    const asked = Number(params.reach);
    const reachInUnits = Number.isNaN(asked) ? DEFAULT_REACH : (asked > 0 ? Math.max(asked, MIN_REACH) : 0);
    // The spring length the reach is measured in; set on the first step.
    let unit = NaN;

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
      // The push is matched to the library's at one spring length, which needs a spring length
      // above 0: otherwise use the library's own push.
      if (!(settings.springLength > 0)) return libraryNbody();
      // The panel changes springLength on the running layout: follow it.
      if (settings.springLength !== unit) {
        unit = settings.springLength;
        tree.setReach(reachInUnits * unit, unit);
      }
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
