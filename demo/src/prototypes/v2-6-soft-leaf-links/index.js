import findFans from './fans.js';

// A flat sheet fits about this many nodes inside one link length of a node: the node itself
// plus 6 neighbours around it, as in a honeycomb.
const FLAT_BALL = 7;
// Side branches up to this many nodes count as part of a hub's fan (a leaf is a branch of one).
// Bigger branches need room of their own, and stretching their links starts to bend trees.
const MAX_BRANCH = 7;

export default {
  id: 'v2-6-soft-leaf-links',
  title: 'Longer, softer leaf links',
  author: 'v2-6 (Feynman Vol. 2 reader)',
  description: `
<p>ngraph draws a hub with hundreds of leaves (nodes with a single link) as a small solid disk:
every link has the same length, so the leaves pile up while most of the screen stays empty.</p>
<p>This idea gives a hub's leaves, and any tiny side branches hanging off it by one link, links
long enough for a flat disk to hold them all: about the square root of (count + 1) / 7 times the
usual length, so 3.8 times for 100 leaves. Those links are also made softer by the same factor,
like a longer rubber band, so the leaves spread over the disk instead of lining its rim. They grow
to the new length over the first 800 steps, and every other link stays as it is.</p>
<p>It comes from Feynman's Lectures, Vol. 2, chapter 42, where a bug on a hot plate, whose rulers
stretch with the heat, measures a curved world on a flat plate; the softening is Hooke's law for a
rod (chapter 38).</p>
<p>Look for big, readable stars that fill the screen on starOfStars and megaStars, where
<b>none</b> shows tight disks; ba500 has no leaves, so nothing changes there. Worse: more
crossings, as links between hubs now cut across neighbouring stars, and EVA's main piece gets more
crowded. 2D only: in 3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: ba500'],
  params: [
    {
      key: 'room', label: 'Room per leaf', value: 1, step: '0.25',
      help: 'How much area each fan node gets, compared with a node in a flat honeycomb. 1 is the tested value; 2 makes stars about 1.4 times wider, 0.5 smaller. 0 turns the idea off.'
    },
    {
      key: 'soften', label: 'Softening', value: 1, step: '0.25',
      help: 'How much softer the longer links get. 1: as soft as a rod that much longer (Hooke). 0: as stiff as before, so leaves line the rim like an umbrella and neighbouring stars overlap.'
    },
    {
      key: 'grow', label: 'Steps to grow', value: 800, step: '100',
      help: 'The fan links grow from their usual length to the new one over this many steps. Growing them at once lets a big star swallow a small neighbour, which then takes thousands of steps to get out. 0: all at once.'
    }
  ],

  attach({ layout, graph, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    let room = Math.max(0, Number(params.room));
    let soften = Math.max(0, Number(params.soften));
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
    let steps = 0;
    let appliedLength, appliedCoefficient, appliedProgress;
    apply();
    layout.on('step', onStep);

    return {
      dispose() {
        layout.off('step', onStep);
      }
    };

    function onStep() {
      steps += 1;
      apply();
    }

    // While the links grow this touches every fan link once per step (a few thousand
    // multiplications). After that it only checks whether the panel changed the global link length
    // or stiffness, and keeps the fan links in proportion if it did.
    function apply() {
      let length = simulator.springLength();
      let coefficient = simulator.springCoefficient();
      let progress = grow > 0 ? Math.min(1, steps / grow) : 1;
      if (length === appliedLength && coefficient === appliedCoefficient && progress === appliedProgress) return;
      appliedLength = length;
      appliedCoefficient = coefficient;
      appliedProgress = progress;
      for (let i = 0; i < fanSprings.length; ++i) {
        let {spring, factor} = fanSprings[i];
        let current = 1 + (factor - 1) * progress;
        spring.length = length * current;
        spring.coefficient = coefficient / Math.pow(current, soften);
      }
    }
  },
};
