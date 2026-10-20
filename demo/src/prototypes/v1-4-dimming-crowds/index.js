import createScreenedRepulsion from './screenedRepulsion.js';

export default {
  id: 'v1-4-dimming-crowds',
  title: 'Push dims through crowds',
  author: 'v1-4 (Feynman Vol. 1, ch. 31–32)',
  description: `
<p>On graphs with hubs, every hub's leaves end up in a small, dense disc. The stars hang far
apart on long spokes, so most of the picture is empty and the stars are too small to read.
The reason: every node pushes every other node at full strength, so a whole star pushes its
neighbour star with the weight of all its nodes, and only one link holds them together.</p>
<p>Here a push fades as it passes other nodes, the way sunlight dims passing through a cloud.
Where nodes are sparse (trees, grids) nothing changes. A dense crowd shades whatever lies
behind it, so crowds stop pushing each other away with their full weight and settle close
together. Up close, within a few link lengths, the push stays.</p>
<p>The idea comes from Feynman's Lectures, Vol. 1, chapters 31–32: light crossing matter dims
in proportion to how much matter it crosses.</p>
<p>Look for: big, readable stars that fill the picture instead of tiny rings on long spokes.
Compare with <b>none</b>.</p>
<p>What gets worse: more links cross, because neighbouring stars are now close and spokes pass
over them. Big sparse networks such as powerGrid get more tangled in the middle, and large
values of <i>Cloudiness</i> fold trees. 2D only; it replaces the <i>Repulsion</i> setting
while it is on.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: erdos992', 'Benchmark: grid20'],
  params: [{
    key: 'cloudiness', label: 'Cloudiness', value: 0.05, step: '0.01',
    help: 'How much each node dims a push passing it. 0 turns the idea off. Higher values also ' +
      'dim sparse parts: stars pack tighter, but trees and grids start to fold.'
  }, {
    key: 'minReach', label: 'Shortest reach', value: 3, step: '0.5',
    help: 'Even inside the densest crowd, a push keeps at least this reach, in link lengths. ' +
      'Smaller values pack crowds tighter; below about 2, stars can slide into each other.'
  }],

  attach({ layout, params, settings }) {
    // 2D only: in other dimensions the layout runs unchanged
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;
    const forces = simulator.getForces();
    const libraryRepulsion = forces.get('nbody');
    const springs = forces.get('spring');
    if (!libraryRepulsion || !springs) return null;

    const repulsion = createScreenedRepulsion();
    function dimmedRepulsion() {
      const s = simulator.settings;
      const L = s.springLength;
      repulsion.computeForces(simulator.bodies, {
        gravity: s.gravity,
        theta: s.theta,
        // in the panel both are per link length; here per unit length and in units of length
        crossSection: Math.max(0, params.cloudiness) * L,
        minReach: Math.max(0.1, params.minReach) * L,
        cell: L,
      });
      // Like the library: drag, unless the FIRE integrator handles the slowing down
      if (s.integrator === 'fire') return;
      const bodies = simulator.bodies, drag = s.dragCoefficient;
      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (body.isPinned) continue;
        body.force.x -= drag * body.velocity.x;
        body.force.y -= drag * body.velocity.y;
      }
    }

    // Swap the library's repulsion for the dimmed one, keeping the order: repulsion first
    // (it resets the forces), then springs.
    simulator.removeForce('nbody');
    simulator.removeForce('spring');
    simulator.addForce('nbody', dimmedRepulsion);
    simulator.addForce('spring', springs);

    return {
      dispose() {
        simulator.removeForce('nbody');
        simulator.removeForce('spring');
        simulator.addForce('nbody', libraryRepulsion);
        simulator.addForce('spring', springs);
      }
    };
  },
};
