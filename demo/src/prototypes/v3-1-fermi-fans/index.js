// "Fermi fans": the leaves of a hub fill rings outward, like electrons filling shells in an atom,
// instead of all sitting one link length from the hub. The rule is in shells.js; the optional
// short-range push for leaves is in shortRangeLeaves.js.
import computeShells from './shells.js';
import createShortRangeLeaves from './shortRangeLeaves.js';

export default {
  id: 'v3-1-fermi-fans',
  title: 'Leaves fill shells (Fermi fans)',
  author: 'v3-1 (Feynman Lectures Vol. 3, Ch. 4)',
  description: `
<p>When a node has hundreds of <i>leaves</i> (neighbours with no other link), ngraph puts every
leaf one link length from it, so the star shows as a small bright ball and the long links between
stars leave most of the screen empty.</p>
<p>Here the leaves take turns filling rings, like seats in a stadium: the first ring is one link
length out with a seat every half link length, each next ring is half a link farther out, and the
node's other links start just past its outer ring so they don't cut through the disc. This comes
from Feynman's Lectures, Vol. 3, Ch. 4: two electrons can't share one state, so they fill shells
outward instead of crowding at the nucleus.</p>
<p>Look for balls turning into dandelions with spokes of different lengths: after 1500 steps at the
demo's defaults, the share of the picture that holds dots goes from 0.13 to 0.25 on starOfStars,
0.10 to 0.17 on megaStars and 0.27 to 0.29 on EVA, while caterpillars (no node has more than 12
leaves) doesn't change at all.</p>
<p>What gets worse: a leaf's link length shows its ring, not its distance in the graph, and more
links cross (starOfStars 0.13 to 0.21 crossings per link, paTree3k about 20% more, and much more
at a larger spacing); 2D only, in 3D it does nothing.</p>
<p>"Leaves push only nearby nodes" is an optional extra in which a leaf pushes only what is within
one link length (round 2 tried two) and starts on its seat: stars move close together (megaStars
fill 0.29), but fans lean, trees cross more, a step costs about 1.3 times as much (2 times in the
first hundred steps), and the Repulsion setting is ignored.</p>
<p>Close relatives: "leaf shells" (v3-3) picks the ring gap from a stability rule, and "soft leaf
links" (v2-6) gives a node's leaves one longer, softer link.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: caterpillars'],
  params: [
    {
      key: 'spacing', label: 'Leaf spacing (link lengths)', value: 0.5, step: '0.1',
      help: 'Distance between neighbouring leaves and between rings. Larger gives bigger stars ' +
        'with longer spokes (starOfStars fills the screen at 1), but trees with many small fans ' +
        'get tangled (paTree3k crossed 6 times more at 1). Smaller packs leaves into tighter ' +
        'discs. A node keeps the normal layout while all its leaves fit in the first ring ' +
        '(about 6.3 / spacing leaves). 0 turns the rings off. Values above 6.28 count as 6.28, ' +
        'so the first ring always has a seat.'
    },
    {
      key: 'rimBonds', label: 'Links leave from the rim (1 on, 0 off)', value: 1, step: '1',
      help: 'With 1, a filled node\'s links to non-leaves start at the edge of its disc. With 0 ' +
        'they start at the centre and cross many spokes.'
    },
    {
      key: 'shortRange', label: 'Leaves push only nearby nodes (1 on, 0 off)', value: 0, step: '1',
      help: 'With 1, a leaf pushes other nodes only when they are closer than one link length ' +
        '(round 2 tried two). Every node that is not a leaf still pushes leaves from any ' +
        'distance. Big stars stop shoving each other apart and fill the screen. Fans lean and ' +
        'trees get tighter, with more crossings. Leaves start on their rings. Uses the quad tree ' +
        'whatever the Repulsion setting says. A step costs about 1.3 times as much, 2 times in ' +
        'the first hundred steps.'
    }
  ],

  attach({ layout, graph, params, settings }) {
    if (settings.dimensions !== 2) return null;
    // 0 or less turns the rings off. Above 2 * PI the first ring would have no seat at all, so a
    // node with a single leaf would move it outward: count those as 2 * PI (the help says so).
    const rawSpacing = Number(params.spacing);
    const spacing = Number.isFinite(rawSpacing) ? Math.min(rawSpacing, 2 * Math.PI) : 0.5;
    const shells = spacing > 0 ?
      computeShells(graph, layout, { spacing, rimBonds: Number(params.rimBonds) !== 0 }) :
      { lengths: new Map(), seats: [] };

    // Rest lengths are multiples of the panel's spring length, so they follow it when it changes
    let appliedLength = NaN;
    applyLengths();
    layout.on('step', applyLengths);

    if (Number(params.shortRange) > 0) {
      // Seat the leaves on their rings first. Leaves start piled on their hub, and a short-range
      // push among thousands of piled leaves costs far more than the tree it replaces.
      const length = layout.simulator.springLength();
      shells.seats.forEach(({ hub, leaf, radius, angle }) => {
        if (layout.getBody(leaf).isPinned) return; // a pinned node stays where it is
        const center = layout.getNodePosition(hub);
        layout.setNodePosition(leaf, center.x + radius * length * Math.cos(angle), center.y + radius * length * Math.sin(angle));
      });
      const sim = layout.simulator;
      const spring = sim.getForces().get('spring');
      // Repulsion must run before springs: it resets the forces of every body each step
      sim.removeForce('nbody');
      sim.removeForce('spring');
      sim.addForce('nbody', createShortRangeLeaves(layout, nodeId => isFanLeaf(graph, nodeId)));
      sim.addForce('spring', spring);
    }

    return {
      dispose() { layout.off('step', applyLengths); }
    };

    function applyLengths() {
      const length = layout.simulator.springLength();
      if (length === appliedLength) return;
      appliedLength = length;
      shells.lengths.forEach((multiple, spring) => { spring.length = multiple * length; });
    }
  }
};

// A one-link node whose neighbour has other links (a lone pair of nodes is not a fan)
function isFanLeaf(graph, nodeId) {
  if (degreeOf(graph, nodeId) !== 1) return false;
  let neighbour = null;
  graph.forEachLinkedNode(nodeId, other => { neighbour = other.id; });
  return neighbour !== null && neighbour !== nodeId && degreeOf(graph, neighbour) > 1;
}

function degreeOf(graph, nodeId) {
  const links = graph.getLinks(nodeId);
  if (!links) return 0;
  return links.size === undefined ? links.length : links.size;
}
