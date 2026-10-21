import findFans from './fans.js';

// A flat sheet fits about this many nodes inside one link length of a node: the node itself
// plus 6 neighbours around it, as in a honeycomb.
const FLAT_BALL = 7;
// Side branches up to this many nodes count as part of a hub's fan (a leaf is a branch of one).
// Bigger branches need room of their own, and stretching their links starts to bend trees.
const MAX_BRANCH = 7;
// Room per leaf above this counts as this, so the stretched links stay finite for any typed value
const MAX_ROOM = 100;
const NAME = 'v2-6-soft-leaf-links';

// The springs, with fan links grown and softened. `fanStretch` is a link column: how many times
// longer a fan link gets in the end (1 for every other link). `step` counts the steps of this
// layout and `before` the steps the drawing ran before it, so the growth carries on across them.
// A fan link is `current` times the spring length and softer by current^soften, like a longer
// rod (Hooke); every other link is the stock spring. The library reads a negative length as
// "use the spring length", and a stiffness of 0 or less as "use the global one", so the fan
// links do the same. A huge softening that rounds the stiffness down to 0 keeps the smallest
// positive number instead.
const SOFT_LEAF_LINKS = `
  progress = grow > 0 ? min(1, (step + before) / grow) : 1;
  current = 1 + (fanStretch - 1) * progress;
  fanLength = springLength * current;
  fanCoefficient = max(5e-324, springCoefficient / current^soften);
  pull = fanStretch > 1 ?
    (springCoefficient > 0 && fanCoefficient > 0 ? fanCoefficient : springCoefficient) * (r - (fanLength < 0 ? springLength : fanLength)) :
    coefficient * (r - length)`;

export default {
  id: 'v2-6-soft-leaf-links',
  title: 'Longer, softer leaf links',
  author: 'v2-6 (Feynman Vol. 2 reader)',
  description: `
<p>ngraph draws a hub with hundreds of leaves (nodes with a single link) as a small solid disk,
because every link has the same length, so most of the screen stays empty.</p>
<p>This idea makes each link that hangs a leaf, or a side branch of up to 7 nodes, off a hub
longer, by about the square root of (count + 1) / 7 (3.8 times for 100 leaves), and softer by the
same factor, like a longer rubber band. These links grow to their new length over the first 800
steps; every other link stays as it is, and in 3D the idea does nothing.</p>
<p>It comes from Feynman's Lectures, Vol. 2: rulers that stretch on a hot plate (chapter 42), and
Hooke's law for a rod (chapter 38).</p>
<p>On starOfStars and megaStars the tight disks of <b>none</b> become big stars that fill the
screen, with the leaves in a thick ring; on starOfStars the leaves swing to the outer side of each
hub, so the stars look like fans. ba500 has no leaves, so nothing changes there.</p>
<p>Worse: links between hubs now cut across the bigger stars, so crossings per link rise
(starOfStars 0.13 → 0.60, EVA 0.71 → 1.63, paTree3k 0.07 → 0.40), and with springLength 20 or
more, or gravity -2, the bigger stars pile on top of each other.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: ba500'],
  params: [
    {
      key: 'room', label: 'Room per leaf', value: 1, step: '0.25',
      help: 'How much room each fan node gets. 1 is the tested value; 2 makes stars about 1.4 times wider (on starOfStars they then start to overlap), 0.5 smaller. 0 turns the idea off; values above 100 count as 100.'
    },
    {
      key: 'soften', label: 'Softening', value: 1, step: '0.25',
      help: 'How much softer the longer links get. 1: as soft as a rod that much longer (Hooke), which makes the ring of leaves thicker. 0: as stiff as before, so the leaves sit in a thin ring at the rim and the stars fill less of the screen.'
    },
    {
      key: 'grow', label: 'Steps to grow', value: 800, step: '100',
      help: 'The fan links grow from their usual length to the new one over this many steps. Growing them all at once lets big stars swallow small neighbours: on megaStars that left 5.9 crossings per link at step 1500, against 0.05 with 800 steps. 0: all at once.'
    }
  ],

  attach({ layout, graph, params, settings, steps: stepsBefore }) {
    if ((settings.dimensions || 2) !== 2) return null;
    let room = Math.min(MAX_ROOM, Math.max(0, Number(params.room)));
    let soften = Number(params.soften);
    soften = Number.isFinite(soften) ? Math.max(0, soften) : 1;
    let grow = Math.max(0, Math.round(Number(params.grow) || 0));
    if (!(room > 0)) return null;

    let {load, hubOfLink} = findFans(graph, MAX_BRANCH);

    // One stretch factor per fan link, from the area its hub's fan needs
    let fanSprings = [];
    hubOfLink.forEach((hubId, linkId) => {
      let spring = layout.getSpring(linkId);
      if (!spring) return;
      let factor = Math.max(1, Math.sqrt(room * (load.get(hubId) + 1) / FLAT_BALL));
      if (factor > 1) fanSprings.push({spring, factor});
    });
    if (fanSprings.length === 0) return null;

    let simulator = layout.simulator;
    let springs = simulator.springStore;
    springs.define('fanStretch', Float64Array, 1, 1);
    fanSprings.forEach(({spring, factor}) => { springs.fanStretch[spring.index] = factor; });
    simulator.addLinkFormula(NAME, {
      replace: 'springs',
      // the steps the drawing already ran count towards the growth
      params: {before: stepsBefore || 0, grow, soften},
      formula: SOFT_LEAF_LINKS
    });

    return {
      dispose() {
        simulator.removeStage(NAME); // the stock springs come back
        springs.remove('fanStretch');
      }
    };
  },
};
