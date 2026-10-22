import createScreenedRepulsion from './screenedRepulsion.js';

const finite = (value, fallback) => (Number.isFinite(value) ? value : fallback);

export default {
  id: 'v1-4-dimming-crowds',
  title: 'Push dims through crowds',
  author: 'v1-4 (Feynman Vol. 1, ch. 31–32)',
  description: `
<p>On graphs with hubs, ngraph draws each star as a small, dense disc on a long spoke, so most
of the picture is empty.</p>
<p>Here a push fades with how many nodes lie between the two nodes, the way sunlight dims in a
cloud (Feynman's Lectures, Vol. 1, ch. 31–32), but never over less than <i>Shortest reach</i>.
Crowds then pack close instead of pushing each other away with their full weight, while trees
and grids barely change.</p>
<p>Look for bigger stars that fill the picture: against <b>none</b>, the share of the frame
holding nodes goes from 0.13 to 0.24 on starOfStars, 0.11 to 0.30 on megaStars and 0.09 to
0.18 on erdos992, and grid20 stays the same.</p>
<p>What gets worse: 1.3 to 3 times as many links cross on hub graphs and on powerGrid, a high
<i>Cloudiness</i> folds trees, and the leaves of packed stars never settle but keep trembling
(a <i>Time step</i> of 0.25 calms them).</p>
<p>To stay fast it checks the crowd at 3 points along each line instead of the 5 its first
tests used, which gives a smaller effect on starOfStars. 2D only (3D runs the stock layout); it
ignores the <i>Repulsion</i> setting.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: erdos992', 'Benchmark: grid20'],
  params: [{
    key: 'cloudiness', label: 'Cloudiness', value: 0.05, step: '0.01',
    help: 'How much each node dims a push passing it. 0 or less turns the dimming off. Higher ' +
      'values also dim sparse parts: stars pack tighter, but trees and grids start to fold.'
  }, {
    key: 'minReach', label: 'Shortest reach', value: 3, step: '0.5',
    help: 'Even inside the densest crowd, a push fades no faster than over this distance, in link ' +
      'lengths. Smaller values pack crowds tighter; below about 2, stars can slide into each ' +
      'other. 0 or less removes this floor.'
  }],

  attach({ layout, params, settings }) {
    // 2D only: in other dimensions the layout runs unchanged
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;

    // 0 or less: no dimming, and no floor on the reach. NaN (never sent by the panel): the default.
    const cloudiness = Math.max(0, finite(params.cloudiness, 0.05));
    const minReach = Math.max(0, finite(params.minReach, 3));
    const repulsion = createScreenedRepulsion();
    // Swap the library's repulsion stage for the dimmed one; drag and springs run after it
    const libraryRepulsion = simulator.replaceStage('repulsion', store => {
      const s = simulator.settings;
      // A spring length of 0 or less gives no length scale, so nothing dims
      const L = Math.max(0, s.springLength);
      repulsion.computeForces(store, {
        gravity: s.gravity,
        theta: s.theta,
        // in the panel both are per link length; here per unit length and in units of length.
        // Kept finite, so that a huge value times an empty stretch is 0, not NaN.
        crossSection: Math.min(cloudiness * L, Number.MAX_VALUE),
        minReach: minReach * L,
        cell: L,
      });
    });

    return {
      dispose() { simulator.replaceStage('repulsion', libraryRepulsion); }
    };
  },
};
