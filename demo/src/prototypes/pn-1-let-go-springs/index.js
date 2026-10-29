// Springs that let go of long links. A stock spring pulls with k * s, where s = r - L is how far the
// link is stretched, so the longer a link gets the harder it pulls. This one pulls with
// k * s / (1 + (s / R)^2): like the stock spring while s is small, hardest at s = R, and less and
// less after that. R is Reach spring lengths. It is the attraction t-SNE uses, applied to links.
//
// It is a link formula that takes the place of the stock springs, so the library keeps everything
// else the stock springs do: per-link lengths and stiffness, the random nudge for links of length 0,
// and the counters of the adaptive time step.
const NAME = 'pn-1-let-go-springs';

export default {
  id: 'pn-1-let-go-springs',
  title: 'Springs let go of long links',
  author: 'pn-1 (panel on natural graphs, after t-SNE)',
  description: `
<p>On natural graphs (protein interactions, citations, co-authorship) the stock layout ends as one
ball. Groups show only when nodes are coloured by a clustering: drawn in one colour and blurred to
what a glance takes in, sciMet, yeast and erdos992 read as a single blob at every step.</p>
<p>The reason is the springs. A stock spring pulls harder the longer it gets, and between two groups
there are many stretched links, all pulling. Together they beat the push between nodes and squeeze
the groups into each other.</p>
<p>Here a link pulls like a stock spring while it is short, pulls hardest when it is stretched by
<b>Let go after</b> spring lengths, and then lets go: the pull fades as the link gets longer. It is
the attraction t-SNE uses, applied to links. Groups joined by few links drift apart; groups joined
by many stay together.</p>
<p>What to look for (quick checks, one to three starts, 2000 steps): sciMet and erdos992 break into
separate clumps you can see without colour (4 and 6 in a blurred one-colour test, against 1 with
<b>none</b>). A node's nearest drawn nodes are its graph neighbours about 3 to 6 times as often on
java, yeast, sciMet and erdos992. Randomly rewired copies of these graphs (same degrees, no groups) stay one round blob,
so it is not inventing groups.</p>
<p>What gets worse:</p>
<ul>
<li>Trees and grids: powerGrid and CSphd fall apart into scattered pieces joined by long crossing links.</li>
<li>The drawing keeps spreading for a long time, so the clumps shrink on screen as the view zooms out.</li>
<li>The links between clumps are drawn at full strength and cover the gaps.</li>
<li><b>Let go after</b> is sensitive: at 1.5 graphs tear into small clumps, and at 3 erdos992's hub
fans already pull away from their groups.</li>
</ul>
<p>It replaces the stock springs with one link formula and costs nothing extra per step. Works in
any number of dimensions. On WebGPU the GPU runs the layout without it.</p>`,
  tryGraphs: ['Benchmark: sciMet', 'Benchmark: erdos992', 'Benchmark: yeast', 'Benchmark: java', 'Benchmark: powerGrid'],
  params: [
    {
      key: 'reach', label: 'Let go after (spring lengths)', value: 3, step: '0.5',
      help: 'Stretch, in spring lengths, at which a link pulls hardest; longer links pull less and less. ' +
        'Smaller lets go sooner and gives more, smaller clumps; at 1.5 graphs tear apart. Larger is closer ' +
        'to the stock springs. Values below 0.1 count as 0.1.'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    // NaN falls back to the default; very small values would tear every link, so 0.1 is the least.
    const reach = Number.isFinite(params.reach) ? Math.max(params.reach, 0.1) : 3;
    simulator.addLinkFormula(NAME, {
      replace: 'springs',
      // R follows the spring length from the panel
      params: { R: context => reach * context.unit() },
      formula: 's = r - length; pull = coefficient * s / (1 + (s / R)^2)'
    });

    return {
      dispose() {
        simulator.removeStage(NAME); // the stock springs come back
      }
    };
  }
};
