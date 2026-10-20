// "Gas pressure where crowded": nodes packed denser than about one per spring-length square push
// outward, from dense to sparse, like a gas. See gasPressure.js for the force itself.
import createGasPressure from './gasPressure.js';

export default {
  id: 'v1-6-gas-pressure',
  title: 'Gas pressure where crowded',
  author: 'v1-6 (Feynman Vol 1, Ch. 40)',
  description: `
<p>In ngraph's pictures of hubs with many leaves (<i>starOfStars</i>, <i>megaStars</i>), each
star is a thin ring of leaves piled on top of each other: every leaf's spring pulls it to the same
distance from its hub.</p>
<p>This idea treats the nodes as a gas. Where nodes are packed closer than about one spring length
apart, they push outward, from the crowded spot towards emptier space. How hard they push is the
"temperature". Where nodes are already that far apart, nothing changes.</p>
<p>It comes from Feynman's Lectures on Physics, Vol. 1, Chapter 40: air spreads up over a height
because its pressure, which grows with density, holds it up against gravity; with no temperature
it would all lie flat on the ground, like the leaves on their ring.</p>
<p>Look for the stars turning from thin rings into filled discs, and for hub blobs in trees
loosening. A grid should not change at all.</p>
<p>What gets worse: more edge crossings around big stars and between tree branches, as leaves
spread into their neighbours' space. Too high a temperature makes crowded parts shake.</p>`,
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
        'the most crowded spots.'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    const fire = simulator.settings.integrator === 'fire';
    const gas = createGasPressure(simulator, {
      temperature: (fire ? 0.5 : 1) * Math.max(0, params.temperature),
      spacing: Math.max(0.05, params.spacing),
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
