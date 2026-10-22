// Gas pressure where nodes are crowded (2D only; in 3D it does nothing).
//
// The nodes are treated as a gas: where they are packed densely, they push outward, from dense to
// sparse, with a force proportional to how quickly the density falls off:
//
//     F_i = -kT * grad(n) / n,   evaluated at body i
//
// This is the ideal gas law P = n kT (pressure grows with density) turned into a force on each
// body. It only acts on crowding: below the target density n0 = 1 / (spacing * springLength)^2
// there is no force at all, and between n0 and 2 n0 it fades in. With the default springLength and
// gravity, graphs whose nodes end up spread wider than that (grids, meshes) end up as they would
// without it; their crowded start is still pushed apart while they unfold. With weaker repulsion
// (gravity -2) or longer springs (30), ordinary spacing already counts as crowded.
//
// The fire integrator has no drag, so there the temperature is halved. This is checked every step,
// because the demo can switch the integrator without making a new layout.
//
// The density n is measured on a grid of square cells of side h (h = springLength by default), a
// grid field (see modules/gridfield): each body is spread over the 3 x 3 nearest grid points with
// smooth quadratic weights (they add up to 1 per body), so the density and its slope change
// smoothly as a body moves. A body does not feel its own share.
//
// Known artifact: near the target density, bodies settle on the grid points, so the inside of a
// filled star shows rows and columns along the grid. A cell of 2 spring lengths, or a grid that
// moves every step, removes it, but the first leaves a hole in each star and the second shakes.
//
// Cost per step: 9 weighted deposits and 9 reads per body, O(n) whatever the crowding, plus a
// pass over the grid's cells.
import addGridField from 'ngraph.forcelayout.gridfield';

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

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;
    const temperature = Math.max(0, params.temperature);
    const spacing = Math.max(0, params.spacing);
    const radius = 1; // grid cell, in spring lengths
    const h = context => radius * context.settings.springLength;

    const field = addGridField(simulator, 'v1-6-gas-density', {
      anchor: 'lattice',
      cell: 'h',
      deposit: { weights: 'quadratic' },
      self: 'exclude',
      params: { h },
      into: { value: 'gasDensity', gradient: 'gasSlope' }
    });
    // after the springs, just before bodies move
    simulator.addNodeFormula('v1-6-gas-pressure', {
      after: 'v1-6-gas-density',
      params: {
        h,
        // the fire halving is checked every step, since the integrator can change
        kT: context => (context.settings.integrator === 'fire' ? 0.5 : 1) * temperature * context.settings.springCoefficient *
          context.settings.springLength * context.settings.springLength,
        // target density, in bodies per cell (a spacing of 0 turns the push off)
        rho0: context => Math.pow(h(context) / (spacing * context.settings.springLength), 2)
      },
      formula: `
        // density of the other bodies, in bodies per cell (0.05 keeps the push finite where it is 0),
        // and the push down its slope
        rho = gasDensity * h * h;
        ramp = select(rho >= 2 * rho0, 1, (rho - rho0) / rho0);
        push = -kT * ramp / ((rho + 0.05) * h) * (gasSlope * (h * h * h));
        // a huge temperature or spring constant can overflow: never add Infinity or NaN. Checked per
        // axis, as length() would overflow 32-bit floats long before 1e30
        force += select(rho > rho0 && pinned == 0 && abs(dot(push, axis(0))) < 1e30 && abs(dot(push, axis(1))) < 1e30,
          push, 0 * pos)`
    });
    return {
      dispose() {
        simulator.removeStage('v1-6-gas-pressure');
        field.dispose();
      }
    };
  },
};
