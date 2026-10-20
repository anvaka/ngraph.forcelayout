import createConfinementForce from './confinement.js';

const FORCE_NAME = 'v3-2-crowding-costs';

export default {
  id: 'v3-2-crowding-costs',
  title: 'Crowding costs energy',
  author: 'v3-2 (Feynman Vol. 3 reader)',
  description: `
<p>In ngraph's pictures, a hub's leaves often collapse into a small solid disc, or into a crowded
ring at one distance with empty spokes inside, and the stars look tiny in a mostly empty frame
(starOfStars, megaStars, EVA).</p>
<p>This idea makes crowding cost energy. Two nodes closer than half a spring length push each other
apart, harder the closer they are, and light nodes (leaves) are pushed much harder than heavy ones
(hubs). Leaves then spread over their hub's disc instead of piling up at one distance. Nodes that
are farther apart feel nothing.</p>
<p>It comes from quantum mechanics (Feynman Lectures on Physics, Vol. 3, Section 10-1): the less
room a particle has, the faster it has to move (the uncertainty principle), so squeezing it costs
energy, and more so for a light particle. That is why an electron spreads out around its atom.</p>
<p>Look for stars that turn into larger discs of spokes with dots at many distances, filling more
of the frame (starOfStars, megaStars; on hubLeaves5k the leaf halo becomes more even; on EVA, zoom
into the main piece). On grid20 no two nodes come that close, so the result should look the same,
apart from a corner the early, crowded steps may bend differently (with <i>Start from: pivot
MDS</i> it is identical).</p>
<p>What gets worse: the bigger fans overlap edges that pass by, so there are more edge crossings.
A range of 1 or more also spreads out sparse graphs and tangles them (try powerGrid). To keep
crowded nodes from shaking, they take smaller steps (they get more inertia); as a side effect
megaStars and hubLeaves5k shake less than with <b>none</b>. It costs about 1.2–1.5&times; the time
per step. 2D only: in 3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: hubLeaves5k', 'Benchmark: grid20'],
  params: [
    {
      key: 'strength', label: 'Strength', value: 100, step: '10',
      help: 'How hard crowded nodes push apart. More spreads fans wider and fills the frame, and adds edge crossings. 0 turns it off.'
    },
    {
      key: 'range', label: 'Range', value: 0.5, step: '0.1',
      help: 'How close two nodes must be, in spring lengths, before they push. 0.5 acts only inside crowded fans; 1 or more also spreads sparse graphs and trees, where it adds crossings.'
    },
  ],

  attach({ layout, params, settings }) {
    const dimensions = (settings && settings.dimensions) || layout.simulator.settings.dimensions || 2;
    if (dimensions !== 2) return {};
    const simulator = layout.simulator;
    const confinement = createConfinementForce(simulator, {
      strength: Number(params.strength),
      range: Number(params.range),
    });
    // Runs after the library's repulsion and springs, so it sees each node's whole force.
    simulator.addForce(FORCE_NAME, confinement.force);
    return {
      dispose() {
        simulator.removeForce(FORCE_NAME);
      },
    };
  },
};
