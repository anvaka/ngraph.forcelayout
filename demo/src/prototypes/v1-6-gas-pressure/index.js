// "Gas pressure where crowded": nodes packed denser than about one per spring-length square push
// outward, from dense to sparse, like a gas. See gasPressure.js for the force itself.
import createGasPressure from './gasPressure.js';

export default {
  id: 'v1-6-gas-pressure',
  title: 'Gas pressure where crowded',
  author: 'v1-6 (Feynman Vol 1, Ch. 40)',
  description: `
<p>In ngraph's pictures of hubs with many leaves (<i>starOfStars</i>, <i>megaStars</i>), each
star is a ring of leaves with an empty middle, and the stars sit small and far apart.</p>
<p>This idea, from Feynman's Lectures on Physics, Vol. 1, Ch. 40, treats the nodes as a gas: where
they are packed denser than about one node per spring-length square, they push from the crowded
spot towards emptier space, and the "temperature" sets how hard. Crowding is measured on a hidden
square grid with one spring length per cell, and the push fades in between one and two times that
density; the round-2 lab version compared nearby pairs instead, but it shook.</p>
<p>Look for the stars' middles filling in and the stars growing: on <i>starOfStars</i> the drawing
covers about 2.4 times as much of the frame (1.6 times on <i>megaStars</i>), and <i>grid20</i> ends
up the same as with <b>none</b>.</p>
<p>What gets worse: about twice as many edge crossings on <i>starOfStars</i> and nearly four times
as many on <i>paTree3k</i>, and if you zoom into a filled star, its leaves line up in rows and
columns along that hidden grid. A temperature above about 10 makes crowded parts shake, so the fire
integrator, which has no drag, gets half the temperature. With weaker repulsion (gravity -2) or
longer springs (30), ordinary spacing already counts as crowded and grids change too; it works in
2D only and does nothing in 3D.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: paTree3k', 'Benchmark: grid20'],
  params: [
    {
      key: 'temperature', label: 'Temperature', value: 8, step: '1',
      help: 'How hard crowded nodes push outward. Higher gives fuller, bigger stars but more ' +
        'crossings. Above about 10 the crowded parts start to shake (the fire integrator has no ' +
        'drag, so this prototype halves the value for it). 0 turns the push off.'
    },
    {
      key: 'spacing', label: 'Crowding spacing', value: 1, step: '0.1',
      help: 'Nodes push only where they are, on average, closer than this many spring lengths. ' +
        'Larger values reach more of the graph (trees, sparse parts); smaller values touch only ' +
        'the most crowded spots. 0 turns the push off.'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    // the fire halving is applied in gasPressure.js at every step, since the integrator can change
    const gas = createGasPressure(simulator, {
      temperature: Math.max(0, params.temperature),
      spacing: Math.max(0, params.spacing),
      radius: 1,
    });
    simulator.addForce('v1-6-gas-pressure', gas.force);
    return {
      dispose() {
        simulator.removeForce('v1-6-gas-pressure');
      }
    };
  },
};
