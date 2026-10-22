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
// The push is a repulsion law, so it runs in both trees; the pull is two sums and a formula for
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
<p><b>What to look for.</b> Compare with <b>none</b> after about 1500 steps: the big piece's share
of the picture goes from 0.10 to 0.73 on yeast, 0.06 to 0.49 on sciMet and 0.23 to 0.60 on
CSphd, and the eight communities of sbm8x50 separate.</p>
<p><b>What gets worse.</b> Grids bow outward into a pillow shape, isolated nodes pile up in a band
at the rim (protein), and star fans are not helped. Spacing is tuned for spring length 10 and
gravity -12: with longer springs or weaker gravity the effect fades unless you lower it (see its
help).</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: CSphd', 'Benchmark: sciMet', 'Benchmark: sbm8x50', 'Benchmark: starOfStars'],
  params: [
    {
      key: 'spacing', label: 'Spacing', value: 1.5, step: '0.1',
      help: 'Room per node in the balancing disc, in spring lengths. Smaller: tighter, more even fill, but grids bend into a disc (1.0). Larger: flatter grids, but pieces drift further out (2.0+). The default 1.5 is tuned for spring length 10 and gravity -12; for longer springs or weaker gravity, lower it (spring length 30: about 0.5; gravity -2: about 0.6). Values below 0.1 count as 0.1.'
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
    const spacing = Math.max(0.1, numberOr(params.spacing, 1.5));
    // Capped so a huge value from the URL can't overflow the pull to Infinity (and NaN)
    const balance = Math.min(100, Math.max(0, numberOr(params.balance, 1)));
    const falloff = numberOr(params.falloff, 1) === 2 ? 2 : 1;

    // The push 1/r^(D-1), scaled to equal the library's 1/r^2 at one spring length L
    const push = 'r^(1 - D) * L^(D - 3)';
    const previousLaw = simulator.repulsionLaw().spec;
    if (falloff === 1) simulator.repulsionLaw({ force: push, params: { L: sim => sim.unit() } });
    const stages = ['flatWorldCharge', 'flatWorldMoment', 'v2-3-pull'];
    const dispose = () => {
      simulator.repulsionLaw(previousLaw);
      stages.forEach(name => { if (simulator.getStage(name)) simulator.removeStage(name); });
    };
    if (balance === 0) return { dispose };

    // A uniform ball with total charge -balance * Q, centred on the charge centroid. Inside it the
    // pull on body i is k q_i d / R^D (grows linearly with the distance d from the centre), outside
    // it k q_i d / |d|^D (falls off as 1/|d|^(D-1)). The charges are the column the layout pushes
    // with when the idea is attached.
    const charge = simulator.repulsionCharge();
    simulator.addSum('flatWorldCharge', { formula: charge });
    simulator.addSum('flatWorldMoment', { formula: `${charge} * pos` });
    simulator.addNodeFormula('v2-3-pull', {
      params: { spacing, balance, falloff, ballVolume: ballVolume(simulator.settings.dimensions) },
      formula: `
        Q = flatWorldCharge;
        d = pos - flatWorldMoment / Q;
        // The ball holds the n nodes at one node per cube of side spacing * L
        R = spacing * unit * pow(n / ballVolume, 1 / D);
        RD = pow(R, D);
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

// Volume of a ball of radius 1 in D dimensions: 2, pi, 4/3 pi, ...
function ballVolume(D) {
  return D === 0 ? 1 : D === 1 ? 2 : ballVolume(D - 2) * 2 * Math.PI / D;
}

function numberOr(value, fallback) {
  const number = Number(value);
  return value === undefined || value === '' || !Number.isFinite(number) ? fallback : number;
}
