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
// How dense the ball is comes from the drawing: the layout first runs as stock until the start
// step, so the graph can unfold, then measures how far apart the nodes typically sit, and the
// ball holds one node per `spacing` times that distance. Then the flat-world push and the pull
// switch on together. A ball of a fixed size (1.5 spring lengths per node) worked only at the
// demo's spring length and gravity: with longer springs or weaker gravity it did nothing, with
// short springs it crushed grids into folds.
//
// The push is a repulsion law, so it runs in both trees; the pull is two sums and a formula for
// every body, so the simulator runs the loops. Only the measurement runs in JS, once, as a host
// step.
import typicalSpacing, { ballVolume } from './typicalSpacing.js';

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
evenly as the disc. The disc's size comes from the drawing: the layout runs as <b>none</b> until
step 300, then measures how far apart the nodes typically sit and gives the disc one node per 3
times that distance, and the push and the pull switch on together. In D dimensions the push
weakens as 1/distance^(D-1) and the disc is a ball, so in 3D the push is the library's own.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, Ch. 18 and 20: Gauss's law, and how
the push of a charge follows from the dimension of space.</p>
<p><b>What to look for.</b> Compare with <b>none</b> after about 1500 steps: the big piece's share
of the picture goes from 0.09 to 0.71 on yeast, 0.05 to 0.53 on sciMet and 0.20 to 0.45 on CSphd;
trees cross their own lines far less (paTree3k: 0.09 to 0.03 crossings per line, caterpillars:
0.020 to 0.005); megaStars' fans get bigger, and the eight communities of sbm8x50 separate. It
works at spring lengths 3 to 30 and at gravity -2 too.</p>
<p><b>What gets worse.</b> Nothing changes before step 300. Grids keep their square, but edges near
the corners get shorter than in the middle; the nodes of a community pack tighter (on sbm8x50 a
third of them nearly touch another), and protein's pieces get a bit distorted. In 3D it helps
pieces less (jellium does more there).</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: CSphd', 'Benchmark: sciMet', 'Benchmark: sbm8x50', 'Benchmark: starOfStars'],
  params: [
    {
      key: 'spacing', label: 'Spacing', value: 3, step: '0.5',
      help: 'Room per node in the balancing disc, as a multiple of how far apart the nodes typically sit when it switches on. Smaller: bigger star fans, but more crossing lines on star graphs and small pieces pressed against the main one (at 2). Larger: gentler (at 5, yeast\'s big piece gets 0.54 of the picture instead of 0.68). Values below 0.1 count as 0.1.'
    },
    {
      key: 'startStep', label: 'Switch on at step', value: 300, step: '50',
      help: 'Until this step the layout runs as none, so the graph can unfold; then the spacing is measured and the flat-world push and the pull switch on. At 0 the graph has not unfolded yet: the disc comes out far too small and crushes the drawing (grids fold, trees tangle); 100 works about as well as 300. Below 0 counts as 0.'
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

  attach({ layout, params, steps }) {
    const simulator = layout.simulator;
    const spacing = Math.max(0.1, numberOr(params.spacing, 3));
    const startStep = Math.max(0, Math.round(numberOr(params.startStep, 300)));
    // Steps the drawing ran before this layout carried it on: the start step counts from the
    // drawing's first step
    const stepsBefore = steps || 0;
    // Capped so a huge value from the URL can't overflow the pull to Infinity (and NaN)
    const balance = Math.min(100, Math.max(0, numberOr(params.balance, 1)));
    const falloff = numberOr(params.falloff, 1) === 2 ? 2 : 1;
    // How far apart nodes typically sit at the start step; 0 until it is measured
    let measured = 0;
    const isOn = context => measured > 0 && context.iteration() + stepsBefore >= startStep;

    // The push 1/r^(D-1), scaled to equal the library's 1/r^2 at one spring length L, once the
    // spacing is measured; the library's push before that
    const push = 'on > 0 ? r^(1 - D) * L^(D - 3) : 1 / r^2';
    const previousLaw = simulator.repulsionLaw().spec;
    if (falloff === 1) {
      simulator.repulsionLaw({ force: push, params: { L: sim => sim.unit(), on: context => isOn(context) ? 1 : 0 } });
    }

    // A uniform ball with total charge -balance * Q, centred on the charge centroid. Inside it the
    // pull on body i is k q_i d / R^D (grows linearly with the distance d from the centre), outside
    // it k q_i d / |d|^D (falls off as 1/|d|^(D-1)). The charges are the column the layout pushes
    // with when the idea is attached.
    const charge = simulator.repulsionCharge();
    simulator.addSum('flatWorldCharge', { formula: charge });
    simulator.addSum('flatWorldMoment', { formula: `${charge} * pos` });
    // Measures the spacing once, at the start step; if there is nothing to measure yet (no node
    // has enough neighbours), it tries again on the next step
    simulator.addHostStep('flatWorldMeasure', {
      when: context => measured === 0 && context.iteration() + stepsBefore >= startStep && context.store.n >= 2,
      reads: ['pos'],
      run(sim) {
        const s = typicalSpacing(sim, Math.min(6, sim.store.n - 1));
        if (s > 0 && s < Infinity) measured = s;
      }
    });
    simulator.addNodeFormula('v2-3-pull', {
      params: {
        spacing, balance, falloff, ballVolume: ballVolume(simulator.settings.dimensions),
        measured: () => measured,
        on: context => isOn(context) ? 1 : 0
      },
      formula: `
        Q = flatWorldCharge;
        d = pos - flatWorldMoment / Q;
        // The ball holds the n nodes at one node per cube of side spacing * measured
        R = spacing * measured * pow(n / ballVolume, 1 / D);
        RD = pow(R, D);
        // Same strength as the push between two nodes: |G| L^(D-3), or |G| with the stock push
        strength = -gravity * (falloff == 1 ? pow(unit, D - 3) : 1 / unit);
        scale = strength * balance * Q;
        rD = pow(dot(d, d), D / 2);
        f = -scale * ${charge} / (rD > RD ? rD : RD);
        force += select(on > 0 && Q > 0 && pinned == 0, f * d, 0 * pos)`
    });
    return {
      dispose() {
        simulator.repulsionLaw(previousLaw);
        ['flatWorldCharge', 'flatWorldMoment', 'flatWorldMeasure', 'v2-3-pull'].forEach(name => {
          if (simulator.getStage(name)) simulator.removeStage(name);
        });
      }
    };
  }
};

function numberOr(value, fallback) {
  const number = Number(value);
  return value === undefined || value === '' || !Number.isFinite(number) ? fallback : number;
}
