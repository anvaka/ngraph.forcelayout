import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js';
import generateDualTree from '../../../../lib/codeGenerators/generateDualTree.js';
import createPiecePush from './piecePush.js';

let kernels = null; // the library's 2D n-body kernels, generated once

export default {
  id: 'v1-7-contact-push',
  title: 'Pieces push only on contact',
  author: 'v1-7 (Feynman Lectures, vol. I, ch. 47)',
  description: `
<p>When a graph has one big piece and many small ones (yeast, sciMet, erdos992), ngraph shrinks the
big piece to a dark ball and leaves the small ones on a far ring, so most of the picture is empty.</p>
<p>That happens because every node pushes every other node, even across pieces, so each small piece
is pushed away by the thousands of nodes of the big one. Here a piece pushes only its own nodes, two
pieces push each other only when they touch, like stones in a bag, and a wall around all of them
(taken from the v4 prototype) keeps the bag closed.</p>
<p>The idea comes from the chapter on sound in Feynman's Lectures (vol. I, ch. 47): in a gas the push
comes only from right next door, so at rest a gas fills its container evenly, with no empty gaps.</p>
<p>Look for the big piece filling the frame with the small pieces close around it. Set <b>Push from
afar</b> to 1 to keep the same wall with the old push: the ring comes back. (Stock ngraph,
<b>none</b>, has no wall, so there the small pieces keep drifting away.)</p>
<p>What gets worse: pieces that start on top of each other stay crossed, because touching pieces only
slide apart (caterpillars; the fire integrator with a pivot start helps), and on CSphd the big tree
loses a little of its shape. 2D only; in 3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: erdos992', 'Benchmark: sciMet', 'Benchmark: sbm8x50'],
  params: [
    {
      key: 'contact', label: 'Contact distance', value: 1, step: '0.1',
      help: 'How close two pieces may come, in average edge lengths. Larger leaves more room between pieces and fewer crossings; smaller packs them tighter. 0 turns contact off.'
    },
    {
      key: 'farPush', label: 'Push from afar', value: 0, step: '1',
      help: '0: pieces push each other only on contact (this idea). 1: every node pushes every node, as in stock ngraph, with the same wall. Compare the two to see what contact alone changes.'
    },
    {
      key: 'wallSlack', label: 'Wall size', value: 1.3, step: '0.1',
      help: 'Size of the wall around all pieces, relative to their total area (1.3 is the v4 setting). Larger gives the pieces more room; with contact only, they then sit looser around the big piece.'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    if ((simulator.settings.dimensions || 2) !== 2) return null; // 2D only: in 3D the layout stays stock
    if (!kernels) kernels = { createQuadTree: generateQuadTree(2), createDualTree: generateDualTree(2) };
    return createPiecePush(simulator, params, kernels);
  }
};
