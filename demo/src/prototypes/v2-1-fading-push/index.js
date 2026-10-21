// Push fades slowly with distance (Debye screening). The library's repulsion between two nodes is
// G m1 m2 / r^2 at any distance. Here it is multiplied by exp(-r / fade), with fade = a number of
// spring lengths, so groups of nodes stop pushing each other once they are a few fade lengths
// apart. Nearby nodes push almost as before: at one spring length, exp(-1/10) = 0.9 of it.
import getVariableName from '../../../../lib/codeGenerators/getVariableName.js';
import getFadingQuadTreeFactory from './fadingQuadTree.js';

export default {
  id: 'v2-1-fading-push',
  title: 'Push fades slowly with distance',
  author: 'v2-1 (Feynman Vol. II reader)',
  description: `
<p><b>Problem.</b> On graphs with big hubs, ngraph draws each group as a small dense blob with
wide empty space between groups: every group pushes the others like one big charge, the sum of
all its nodes, so zoom to fit shrinks the groups to dots.</p>
<p><b>Change.</b> A node's push now fades with distance: it is about 10% weaker at one spring
length, and 2.7 times weaker for every <i>Fade distance</i> (10 spring lengths), so far-apart
groups stop pushing each other and their few links pull them together.</p>
<p><b>Source.</b> Feynman, Vol. II, chapter 7-4: in salt water, a cloud of opposite charges
gathers around each charged particle and cancels its push beyond a short distance (Debye
screening).</p>
<p><b>Look for:</b> starOfStars and megaStars cover about twice as much of the frame, with
readable spokes; on EVA the main piece grows and its hubs become spoked suns; er1000, one random
tangle, should look the same.</p>
<p><b>Gets worse:</b> big open loops fill in (powerGrid: crossings almost double), separate
pieces touch (caterpillars), trees lose white space between branches, and grids can stay folded
(grid20 keeps a folded corner, and from other starts often a big fold).</p>
<p><b>Cost:</b> 1.3 to 1.9 times the time per step; with the <i>dual tree</i> setting it still
uses the quad tree, so it runs up to about 9 times slower than none.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: er1000'],
  params: [{
    key: 'fade',
    label: 'Fade distance',
    value: 10,
    step: '1',
    help: 'In spring lengths: how far a push reaches before it fades away (it drops 2.7x per this ' +
      'distance). 3: stars and pieces pack tight, trees and loops lose their open space. 30: ' +
      'closer to the library, but grids can still stay folded. Below about 1 the push is nearly ' +
      'gone and nodes crowd together. 0 turns the fade off, and so does a spring length of 0.'
  }],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    const settings = simulator.settings;
    const fadeInSprings = Number(params.fade);
    if (!(fadeInSprings > 0)) return null;

    // The fade distance in layout units. A spring length of 0 or less would make it 0 or negative,
    // which removes the push entirely or makes it grow with distance (typing "0.5" in the panel
    // passes through 0): then nothing fades, exactly like the library, since exp(-r / Infinity) = 1.
    const fadeLength = () => {
      const length = fadeInSprings * settings.springLength;
      return length > 0 ? length : Infinity;
    };
    const createQuadTree = getFadingQuadTreeFactory(settings.dimensions);
    const tree = createQuadTree({ gravity: settings.gravity, theta: settings.theta, fade: fadeLength() }, createRandom(42));
    const bodies = simulator.bodies;
    // Coordinate names (x, y, z, c4, ...), for the drag on every axis
    const axes = [];
    for (let k = 0; k < settings.dimensions; k++) axes.push(getVariableName(k));

    // Same job as the library's own 'nbody' force (lib/createPhysicsSimulator.js), with the
    // fading tree. It must stay first: it resets the forces that the springs add to afterwards.
    function fadingPush() {
      if (bodies.length === 0) return;
      // Settings can change while the layout runs (the panel calls the simulator's setters)
      tree.options({ gravity: settings.gravity, theta: settings.theta, fade: fadeLength() });
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

    // Swap 'nbody' for the fading push, keeping the order of every force. With nbody 'dualtree'
    // this still runs the quad tree: the dual tree's far field has no fading version.
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
