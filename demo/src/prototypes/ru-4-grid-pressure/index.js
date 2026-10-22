// Crowding pressure on a grid (2D only).
//
// Every node drops one unit of "stuff" into the four grid cells around it. One implicit
// (always stable) step of the heat equation smooths that into a pressure field: crowded places
// get high pressure, empty places low. Each node is then pushed downhill on that field. The
// smoothing reaches about `range` units, so the push is short-range: crowds spread out, but
// things far apart stop pushing each other.
//
// The grid, the deposit, the smoothing and the slope at each node are a grid field (see
// modules/gridfield); the push is a formula that reads the slope.
import addGridField from '../../../../modules/gridfield/index.js';

// Values tuned in the lab with springLength 10 and springCoefficient 0.8 (the demo's defaults).
// The pressure strength is rescaled for other spring settings, so the look stays similar.
const BASE_STRENGTH = 60000;
const BASE_RANGE = 2;
const MAX_CELLS = 512; // grid cells per side, at most

export default {
  id: 'ru-4-grid-pressure',
  title: 'Grid crowding pressure',
  author: 'ru-4 (Samarskii & Gulin, Numerical Methods)',
  description: `
<p><b>Problem.</b> On graphs with big hubs, ngraph draws each hub with its leaves as a small,
dense disc, and the discs float far apart in a mostly empty picture.</p>
<p><b>What this does.</b> In the stock layout every node pushes every other node, from any
distance, and a hub pushes harder the more links it has. This idea replaces most of that push
with a crowding pressure: nodes are counted on a grid, the counts are blurred, and each node is
pushed from crowded spots toward emptier ones. The push only reaches about <i>Range</i> spring
lengths, so each star or piece of the graph gets about the room it needs instead of shoving
everything else away.</p>
<p><b>Where it comes from.</b> The blur is one step of the heat equation, done with the
always-stable implicit scheme from Samarskii &amp; Gulin, <i>Numerical Methods</i>, part III,
ch. 1, §4. Because that scheme is stable for any step size, one big step does the whole blur at
a fixed cost.</p>
<p><b>Look for</b> big, readable star bursts that sit next to each other and fill the frame;
switch to <b>none</b> to compare. On grid20 the flat lattice should stay (at most a little
wavy).</p>
<p><b>What gets worse:</b> separate pieces that touch can tangle together (try caterpillars),
and edges cross more where stars touch. A longer <i>Range</i> helps trees and separate pieces,
but the stars get smaller. 2D only: in 3D the idea does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: erdos992', 'Benchmark: grid20'],
  params: [
    {
      key: 'range', label: 'Range (spring lengths)', value: BASE_RANGE, step: '0.5',
      help: 'How far the crowding push reaches. Short (1 to 2): big, packed stars and fans. ' +
        'Long (4 or more): trees and separate pieces untangle better, but stars stay smaller.'
    },
    {
      key: 'strength', label: 'Crowding strength', value: 1, step: '0.1',
      help: 'How hard crowded nodes push each other apart. Higher spreads the leaves of hubs wider.'
    },
    {
      key: 'farPush', label: 'Far push kept', value: 0.3, step: '0.1',
      help: 'Share of the stock all-pairs push that stays on. 0 drops it (fastest; stars can ' +
        'show spokes and pieces drift into each other). 1 keeps the full stock push and adds the pressure.'
    }
  ],

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;

    const range = positive(params.range, BASE_RANGE);
    const strength = positive(params.strength, 1);
    const farPush = Math.max(0, finite(params.farPush, 0.3));

    // Keep only a share of the stock push (drag comes after it and stays whole)
    const stockRepulsion = simulator.getStage('repulsion');
    if (farPush === 0) simulator.removeStage('repulsion');
    else if (farPush !== 1) {
      simulator.addNodeFormula('ru4-far-push', {
        after: 'repulsion',
        params: { farPush },
        formula: 'force *= select(pinned == 0, farPush, 1)'
      });
    }

    // The spring length and stiffness that BASE_STRENGTH was tuned for
    const unit = context => context.settings.springLength > 0 ? context.settings.springLength : 10;
    const stiffness = context => context.settings.springCoefficient > 0 ? context.settings.springCoefficient : 0.8;
    const field = addGridField(simulator, 'ru4-pressure', {
      anchor: 'box',
      cell: 'L / 2',
      // room for the pressure to fade out around the drawing
      margin: '3 * R',
      maxCells: MAX_CELLS,
      deposit: { weights: 'linear' },
      // one implicit heat step with time step R^2
      smooth: { diffuse: 'R * R' },
      params: { L: unit, R: context => range * unit(context) },
      into: { value: 'ru4Pressure', gradient: 'ru4PressureSlope' }
    });
    simulator.addNodeFormula('ru4-crowding', {
      after: 'ru4-pressure',
      params: {
        k: context => BASE_STRENGTH * strength * Math.pow(range / BASE_RANGE, 2) *
          (stiffness(context) / 0.8) * Math.pow(unit(context) / 10, 4)
      },
      // push each node downhill
      formula: 'force -= select(pinned == 0, k * ru4PressureSlope, 0 * pos)'
    });
    return {
      dispose() {
        ['ru4-far-push', 'ru4-crowding'].forEach(name => {
          if (simulator.getStage(name)) simulator.removeStage(name);
        });
        field.dispose();
        if (!simulator.getStage('repulsion')) simulator.addStage('repulsion', stockRepulsion, { after: 'clear' });
      }
    };
  }
};

function finite(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function positive(value, fallback) {
  const number = finite(value, fallback);
  return number > 0 ? number : fallback;
}
