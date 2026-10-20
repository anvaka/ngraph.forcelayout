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
leaf at the same distance from it. They pile up on one thin ring, so the whole star shows as a
small solid ball, while the long links between stars leave most of the screen empty (megaStars,
starOfStars, EVA).</p>
<p>Here the leaves of one node take turns filling rings, like seats in a stadium. The first ring,
one link length out, takes as many leaves as fit half a link length apart, the next ring is half a
link farther out and has more seats, and so on. The star becomes an evenly filled disc, and the
node's other links start at the edge of that disc so they don't cut through it. All of this is set
once when the layout starts.</p>
<p>The idea comes from Feynman's Lectures, Vol. 3, Ch. 4 (identical particles). Two electrons can't
share one state, so they fill shells outward instead of crowding at the nucleus. His drawing of
atoms with crowding electrons looks just like ngraph's stars.</p>
<p>Look for solid red balls turning into dandelions, with visible dots and spokes of different
lengths. Turning on "Leaves push only nearby nodes" also lets the stars move close together. With
the default settings, graphs where no node has more than about 12 leaves don't change at all
(caterpillars).</p>
<p>What gets worse: a leaf's link length now says which ring it sits in, not how far it is in the
graph, and lines that pass over a big disc cross more spokes. "Leaves push only nearby nodes" makes
fans lean away from their neighbours, packs trees tighter and adds crossings. 2D only; in 3D this
does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: caterpillars'],
  params: [
    {
      key: 'spacing', label: 'Leaf spacing (link lengths)', value: 0.5, step: '0.1',
      help: 'Distance between neighbouring leaves and between rings. Larger gives bigger stars ' +
        'with longer spokes (starOfStars fills the screen at 1), but trees with many small fans ' +
        'get tangled (paTree3k crosses 4 times more at 1). Smaller packs leaves into tighter ' +
        'discs. A node keeps the normal layout while all its leaves fit in the first ring ' +
        '(about 6.3 / spacing leaves).'
    },
    {
      key: 'rimBonds', label: 'Links leave from the rim (1 on, 0 off)', value: 1, step: '1',
      help: 'With 1, a filled node\'s links to non-leaves start at the edge of its disc. With 0 ' +
        'they start at the centre and cross many spokes.'
    },
    {
      key: 'shortRange', label: 'Leaves push only nearby nodes (1 on, 0 off)', value: 0, step: '1',
      help: 'With 1, a leaf pushes other nodes only when they are closer than one link length ' +
        '(leaves still get pushed by everything else), so big stars stop shoving each other ' +
        'apart and fill the screen. Fans lean and trees get tighter, with more crossings. ' +
        'Leaves start on their rings. Uses the quad tree whatever the Repulsion setting says.'
    }
  ],

  attach({ layout, graph, params, settings }) {
    if (settings.dimensions !== 2) return null;
    const spacing = Math.max(0.05, Number(params.spacing) || 0.5);
    const shells = computeShells(graph, layout, { spacing, rimBonds: Number(params.rimBonds) !== 0 });

    // Rest lengths are multiples of the panel's spring length, so they follow it when it changes
    let appliedLength = NaN;
    applyLengths();
    layout.on('step', applyLengths);

    if (Number(params.shortRange) !== 0) {
      // Seat the leaves on their rings first. Leaves start piled on their hub, and a short-range
      // push among thousands of piled leaves costs far more than the tree it replaces.
      const length = layout.simulator.springLength();
      shells.seats.forEach(({ hub, leaf, radius, angle }) => {
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
