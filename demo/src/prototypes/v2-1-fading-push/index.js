// Push fades slowly with distance (Debye screening). The library's repulsion between two nodes is
// G m1 m2 / r^2 at any distance. Here it is multiplied by exp(-r / fade), with fade = a number of
// spring lengths, so groups of nodes stop pushing each other once they are a few fade lengths
// apart. Nearby nodes push almost as before: at one spring length, exp(-1/10) = 0.9 of it.
export default {
  id: 'v2-1-fading-push',
  title: 'Push fades slowly with distance',
  author: 'v2-1 (Feynman Vol. II reader)',
  description: `
<p><b>Problem.</b> On graphs with big hubs, ngraph draws each group as a small dense blob with
wide empty space between groups: every group pushes the others like one big charge, the sum of
all its nodes, so zoom to fit shrinks the groups to dots.</p>
<p><b>Change.</b> A node's push now fades with distance: it is about 10% weaker at one spring
length, and 2.7 times weaker for every <i>Fade distance</i> (10 spring lengths), so far-apart
groups stop pushing each other and their few links pull them together.</p>
<p><b>Source.</b> Feynman, Vol. II, chapter 7-4: in salt water, a cloud of opposite charges
gathers around each charged particle and cancels its push beyond a short distance (Debye
screening).</p>
<p><b>Look for:</b> starOfStars and megaStars cover about twice as much of the frame, with
readable spokes; on EVA the main piece grows and its hubs become spoked suns; er1000, one random
tangle, should look the same.</p>
<p><b>Gets worse:</b> big open loops fill in (powerGrid: crossings almost double), separate
pieces touch (caterpillars), trees lose white space between branches, and grids can stay folded
(grid20 keeps a folded corner, and from other starts often a big fold).</p>
<p><b>Cost:</b> about 1.5 times the time per step with the quad tree and 2.6 times with the
dual tree (the fade costs one exp() per pair); both trees and any number of dimensions work.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: er1000'],
  params: [{
    key: 'fade',
    label: 'Fade distance',
    value: 10,
    step: '1',
    help: 'In spring lengths: how far a push reaches before it fades away (it drops 2.7x per this ' +
      'distance). 3: stars and pieces pack tight, trees and loops lose their open space. 30: ' +
      'closer to the library, but grids can still stay folded. Below about 1 the push is nearly ' +
      'gone and nodes crowd together. 0 turns the fade off, and so does a spring length of 0.'
  }],

  attach({ layout, params }) {
    const fadeInSprings = Number(params.fade);
    if (!(fadeInSprings > 0)) return null;

    // The law is compiled into both trees; L is read every step, so it follows the spring length.
    // A spring length of 0 makes L infinite, which is the stock 1/r^2; an L too small to divide
    // by (e.g. 1e-320) leaves no push at all.
    const simulator = layout.simulator;
    const previousLaw = simulator.repulsionLaw().spec;
    simulator.repulsionLaw({
      force: 'exp(-r / L) / r^2',
      params: { L: sim => {
        const L = fadeInSprings * sim.springLength();
        return L > 0 ? Math.max(L, 1e-300) : Infinity;
      } }
    });
    return { dispose() { simulator.repulsionLaw(previousLaw); } };
  },
};
