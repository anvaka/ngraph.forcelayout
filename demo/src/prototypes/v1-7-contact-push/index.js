import createPiecePush from './piecePush.js';

export default {
  id: 'v1-7-contact-push',
  title: 'Pieces push only on contact',
  author: 'v1-7 (Feynman Lectures, vol. I, ch. 47)',
  description: `
<p>When a graph has one big piece and many small ones (yeast, sciMet, erdos992), ngraph shrinks the
big piece to a dark ball and leaves the small ones on a far ring, so most of the picture is empty.</p>
<p>Here each piece pushes only its own nodes, and two pieces push each other only when they touch,
like stones in a bag. A wall around all pieces (the v4 wall, made so it can't shift the whole
picture) keeps the bag closed; <b>Wall size</b> 0 turns it off, and the touching push alone still
does most of the work.</p>
<p>The idea comes from the chapter on sound in Feynman's Lectures (vol. I, ch. 47): in a gas the push
comes only from right next door, so at rest a gas fills its container evenly, with no empty gaps.</p>
<p>On yeast the big piece grows from a tenth of the picture's area to three quarters, with the small
pieces close around it; <b>Push from afar</b> 1 keeps the wall but brings back the old push, and the
ring returns (stock <b>none</b> has no wall, so there the pieces keep drifting away).</p>
<p>What gets worse: pieces that start on top of each other stay crossed, because touching pieces only
slide apart (caterpillars gets several times more crossings between pieces; the fire integrator
with a pivot start helps), and on graphs of many small pieces the first second runs 2–3× slower,
then faster than stock. The same works in 3D, with a ball for the wall.</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: erdos992', 'Benchmark: sciMet', 'Benchmark: sbm8x50'],
  params: [
    {
      key: 'contact', label: 'Contact distance', value: 1, step: '0.1',
      help: 'How close two pieces may come, in average edge lengths. Larger leaves more room between pieces and fewer crossings; smaller packs them tighter. 0 turns contact off; values above 100 count as 100. Large values are slow on graphs of many small pieces (forest5k: about 90 ms per step at 10).'
    },
    {
      key: 'farPush', label: 'Push from afar', value: 0, step: '1',
      help: '0: pieces push each other only on contact (this idea). 1: every node pushes every node, as in stock ngraph, with the same wall. Compare the two to see what contact alone changes.'
    },
    {
      key: 'wallSlack', label: 'Wall size', value: 1.3, step: '0.1',
      help: 'Size of the wall around all pieces, relative to their total area (1.3 is the v4 setting). Larger gives the pieces more room; with contact only, they then sit looser around the big piece. 0 turns the wall off; other values below 1 count as 1.'
    }
  ],

  attach({ layout, params }) {
    return createPiecePush(layout.simulator, params);
  }
};
