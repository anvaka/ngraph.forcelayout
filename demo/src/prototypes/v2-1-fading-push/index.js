// Push fades slowly with distance (Debye screening). The library's repulsion between two nodes is
// G m1 m2 / r^2 at any distance. Here it is multiplied by exp(-r / fade), with fade = a number of
// spring lengths, so groups of nodes stop pushing each other once they are a few fade lengths
// apart, while nearby nodes push exactly as before.
import getVariableName from '../../../../lib/codeGenerators/getVariableName.js';
import getFadingQuadTreeFactory from './fadingQuadTree.js';

export default {
  id: 'v2-1-fading-push',
  title: 'Push fades slowly with distance',
  author: 'v2-1 (Feynman Vol. II reader)',
  description: `
<p><b>Problem.</b> On graphs with big hubs or one big piece, ngraph draws each group as a
small dense blob, and leaves huge empty space between groups. Every group pushes on the others
like one big charge, the sum of all its nodes, so the bigger the groups, the farther apart they
end up. Zoom to fit then shrinks them to dots.</p>
<p><b>Change.</b> A node's push now fades away with distance: it is the same as before up close,
and dies out over about ten spring lengths. Far-apart groups stop pushing each other, so the
few links between them pull them together, and the groups get the room on screen.</p>
<p><b>Source.</b> Feynman, Vol. II, chapter 7-4: in salt water, each charged particle gathers a
cloud of opposite charges that cancels its push beyond a short distance (Debye screening).</p>
<p><b>Look for:</b> on starOfStars and megaStars, large stars with readable spokes filling the
frame; on EVA, hubs as spoked suns instead of red clumps; grid20 should look the same.</p>
<p><b>Gets worse:</b> big open loops (powerGrid) fill in, separate pieces (caterpillars) touch,
and trees lose some white space between branches. Smaller <i>Fade distance</i> packs stars
tighter but hurts trees more.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: grid20'],
  params: [{
    key: 'fade',
    label: 'Fade distance',
    value: 10,
    step: '1',
    help: 'In spring lengths: how far a push reaches before it fades away (it drops 2.7x per this ' +
      'distance). 3: stars and pieces pack tight, trees and loops lose their open space. 30 and ' +
      'more: close to the library. 0 turns the fade off.'
  }],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    const settings = simulator.settings;
    const fadeInSprings = Number(params.fade);
    if (!(fadeInSprings > 0)) return null;

    const fade = fadeInSprings * settings.springLength;
    const createQuadTree = getFadingQuadTreeFactory(settings.dimensions);
    const tree = createQuadTree({ gravity: settings.gravity, theta: settings.theta, fade }, createRandom(42));
    const bodies = simulator.bodies;
    // Coordinate names (x, y, z, c4, ...), for the drag on every axis
    const axes = [];
    for (let k = 0; k < settings.dimensions; k++) axes.push(getVariableName(k));

    // Same job as the library's own 'nbody' force (lib/createPhysicsSimulator.js), with the
    // fading tree. It must stay first: it resets the forces that the springs add to afterwards.
    function fadingPush() {
      if (bodies.length === 0) return;
      // Settings can change while the layout runs (the panel calls the simulator's setters)
      tree.options({ gravity: settings.gravity, theta: settings.theta, fade: fadeInSprings * settings.springLength });
      const useDrag = settings.integrator !== 'fire';
      const drag = settings.dragCoefficient;
      tree.insertBodies(bodies);
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isPinned) continue;
        body.reset();
        tree.updateBodyForce(body);
        if (useDrag) {
          for (let k = 0; k < axes.length; k++) body.force[axes[k]] -= drag * body.velocity[axes[k]];
        }
      }
    }

    // Swap 'nbody' for the fading push, keeping the order of every force
    const forces = Array.from(simulator.getForces().entries());
    forces.forEach(([name]) => simulator.removeForce(name));
    forces.forEach(([name, force]) => simulator.addForce(name, name === 'nbody' ? fadingPush : force));

    return null;
  },
};

// Deterministic random numbers for the tree's "two nodes at the same spot" fallback
function createRandom(seed) {
  let state = seed >>> 0;
  return {
    nextDouble() {
      state = (state + 0x6D2B79F5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }
  };
}
