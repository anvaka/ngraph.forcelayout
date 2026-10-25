// "Flat-world push plus balancing pull" (reader v2-3). See the description below and README.md.
//
// Today every pair of nodes pushes apart with a force that falls off as 1/r^2. That is how charges
// push in a 3D world. In a world of D dimensions, Gauss's law (Feynman Vol. II, Ch. 18, Table 18-1,
// eq. I: the flux of the field through a closed surface equals the charge inside) makes the push
// of one charge fall off as 1/r^(D-1): 1/r in a flat (2D) world. This prototype uses that push,
// plus a uniform ball (a disc in 2D) of opposite total charge ("background") centred on the
// layout. By the same law the ball pulls each node toward its centre with a force that grows
// linearly inside the ball and falls off as 1/r^(D-1) outside it, and it cancels the push exactly
// wherever the nodes are as dense as the ball. The layout as a whole is then neutral: big clumps
// stop pushing everything else away.
//
// How big the ball is comes from the drawing on every step: the ball is as spread out as the
// nodes are (times a size factor), so nothing is measured at a chosen moment. Several readers
// (v2-1, v2-2, v1-4, v2-6, v3-4) arrived at this rule on their own; see the pull below.
//
// The push is a repulsion law, so it runs in both trees; the pull is three sums and a formula for
// every body, so the simulator runs the loops.
export default {
  id: 'v2-3-flat-world',
  title: 'Flat-world push plus balancing pull',
  author: 'v2-3 (Feynman Vol. II reader)',
  description: `
<p><b>Problem.</b> On graphs with one big piece and many small ones (yeast, sciMet, CSphd), the
big piece shrinks to a dense ball in the middle and the small pieces sit far out on a ring, so
most of the picture is empty.</p>
<p><b>Change.</b> Nodes push each other apart with a force that weakens as 1/distance, the way
charges push in a flat world, instead of 1/distance², and an even pull toward the middle (as if
the nodes stood on a disc of opposite charge) cancels that push wherever the nodes are spread as
evenly as the disc. In D dimensions the push weakens as 1/distance^(D-1) and the disc is a ball,
so in 3D the push is the library's own.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, Ch. 18 and 20: Gauss's law, and how
the push of a charge follows from the dimension of space.</p>
<p>The disc is not a fixed size: on every step it is made as spread out as the nodes are (times
<b>Disc size</b>), so it follows the drawing from the first step on.</p>
<p><b>What to look for.</b> Compare with <b>none</b> after about 1500 steps (one start each): the big
piece fills 0.96 of the picture on yeast instead of 0.08, the star fans of megaStars fill 0.38
instead of 0.10, rgg1500 unfolds instead of folding, and grid20 stays square.</p>
<p><b>What gets worse.</b> The result hangs on <b>Disc size</b>: at 1.0 the drawing scrambles
into an even disc, from 1.3 the effect fades. At the default 1.1 the main piece of npmMix4 and
the groups of sbm8x50 get mixed up (far fewer graph neighbours stay near each other), and CSphd and
protein pull their pieces in less than with a fixed disc. With spring length 30 or gravity -2
even 1.3 mixes up sbm8x50.</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: CSphd', 'Benchmark: sciMet', 'Benchmark: sbm8x50', 'Benchmark: starOfStars'],
  params: [
    {
      key: 'size', label: 'Disc size', value: 1.1, step: '0.05',
      help: 'How big the balancing disc is, as a multiple of how spread out the nodes are right now (1 = exactly as spread out); it follows the drawing on every step. 1.0 cancels the far push completely and the drawing scrambles into an even disc. 1.1: pieces close in and star fans grow. 1.3 and up: the pull fades and pieces and stars drift apart as with none. Values below 0.1 count as 0.1.'
    },
    {
      key: 'balance', label: 'Balance', value: 1, step: '0.1',
      help: 'How much of the total push the pull cancels: 1 = all of it (neutral layout), 0 = no pull at all, the flat-world push alone (stars collapse, pieces fly far away). Negative values count as 0, values above 100 as 100.'
    },
    {
      key: 'falloff', label: 'Falloff', value: 1, step: '1',
      help: '1 = flat-world push (1/distance), the idea. 2 = the library\'s push (1/distance²) with the same pull: plain centre gravity, where grids fold, to show why the two halves must match. Any other value counts as 1.'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    const size = Math.max(0.1, numberOr(params.size, 1.1));
    // Capped so a huge value from the URL can't overflow the pull to Infinity (and NaN)
    const balance = Math.min(100, Math.max(0, numberOr(params.balance, 1)));
    const falloff = numberOr(params.falloff, 1) === 2 ? 2 : 1;

    // The push 1/r^(D-1), scaled to equal the library's 1/r^2 at one spring length L
    const push = 'r^(1 - D) * L^(D - 3)';
    const previousLaw = simulator.repulsionLaw().spec;
    if (falloff === 1) simulator.repulsionLaw({ force: push, params: { L: sim => sim.unit() } });
    const stages = ['flatWorldCharge', 'flatWorldMoment', 'flatWorldSpread', 'v2-3-pull'];
    const dispose = () => {
      simulator.repulsionLaw(previousLaw);
      stages.forEach(name => { if (simulator.getStage(name)) simulator.removeStage(name); });
    };
    if (balance === 0) return { dispose };

    // A uniform ball with total charge -balance * Q, centred on the charge centroid. Inside it the
    // pull on body i is k q_i d / R^D (grows linearly with the distance d from the centre), outside
    // it k q_i d / |d|^D (falls off as 1/|d|^(D-1)). The charges are the column the layout pushes
    // with when the idea is attached.
    //
    // The ball's radius comes from the drawing on every step: R^2 = size^2 (D + 2) / D <d^2>,
    // where <d^2> is the charge-weighted mean squared distance from the centre. At size 1 that is
    // the radius at which the energy of the ball with the nodes is lowest, the ball exactly as
    // spread out as the nodes (an even disc of nodes gets a ball of its own radius). In 2D, where
    // every pair's push times its distance is the same constant, it is also the radius at which
    // the pull cancels the push's tendency to grow the whole drawing, at any size: the size is
    // then left to the springs. A size above 1 leaves part of that tendency, a fixed share, for the
    // springs to hold. A ball measured from the nodes once and multiplied by a factor (spacing 3)
    // instead feeds back on itself: the nodes come to fill the ball, so measuring again would grow
    // it 3x each time.
    const charge = simulator.repulsionCharge();
    const D = simulator.settings.dimensions;
    simulator.addSum('flatWorldCharge', { formula: charge });
    simulator.addSum('flatWorldMoment', { formula: `${charge} * pos` });
    simulator.addSum('flatWorldSpread', {
      formula: `
        d = pos - flatWorldMoment / flatWorldCharge;
        ${charge} * dot(d, d)`
    });
    simulator.addNodeFormula('v2-3-pull', {
      params: { size, balance, falloff, fill: (D + 2) / D },
      formula: `
        Q = flatWorldCharge;
        d = pos - flatWorldMoment / Q;
        // The ball as spread out as the nodes (times size); never smaller than 1% of a spring
        R2 = max(size * size * fill * flatWorldSpread / Q, 0.0001 * unit * unit);
        RD = pow(R2, D / 2);
        // Same strength as the push between two nodes: |G| L^(D-3), or |G| with the stock push
        strength = -gravity * (falloff == 1 ? pow(unit, D - 3) : 1 / unit);
        scale = strength * balance * Q;
        rD = pow(dot(d, d), D / 2);
        f = -scale * ${charge} / (rD > RD ? rD : RD);
        force += select(Q > 0 && pinned == 0, f * d, 0 * pos)`
    });
    return { dispose };
  }
};

function numberOr(value, fallback) {
  const number = Number(value);
  return value === undefined || value === '' || !Number.isFinite(number) ? fallback : number;
}
