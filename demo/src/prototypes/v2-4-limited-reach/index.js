// "Push with a limited reach": nodes repel each other with the law of a flat world that has a
// range (Yukawa's equation solved in a plane) instead of the library's 3-D law with no range. The
// law is in reachLaw.js. 2-D only.
import createReachLaw from './reachLaw.js';

const DEFAULT_REACH = 4;
// Below about 1/9 spring length the push at one spring length rounds to zero, and matching it to
// the library's would divide by zero. A quarter spring length keeps the match well defined.
const MIN_REACH = 0.25;

export default {
  id: 'v2-4-limited-reach',
  title: 'Push with a limited reach',
  author: 'v2-4 (Feynman Vol. II, ch. 23-29)',
  description: `
<p><b>Problem.</b> Today's push never stops, however far apart two nodes are, so heavy hubs and
whole pieces shove each other across the screen, and zoom-to-fit shows small dense stars or a
tiny core in a lot of empty space.</p>
<p><b>Change.</b> Here the push has a <i>reach</i>, from Yukawa's equation for a force with a
limited range (Feynman's Lectures, Vol. II, ch. 28-6), solved for a flat picture (ch. 23). At the
default reach of 4 it is weaker than today closer than one spring length, up to 2.6 times
stronger from 2 to 12 spring lengths, and nearly gone beyond 30.</p>
<p><b>Look for.</b> On megaStars the stars become bursts that use about twice as much of the
screen as with <i>none</i>; binTree8 looks about the same. On sciMet, with <i>none</i> the pieces
keep flying outward and the core shrinks to a dot; with the reach the core keeps about 9 times
more of the screen after 6000 steps.</p>
<p><b>Gets worse.</b> Community groups and EVA's tiny pieces get denser, a reach of 2 or less
folds trees, and reach 0 ("no limit") blows hub graphs apart, with a reach above about 16 moving
toward it. It works in 2-D only (nothing happens in 3-D) and turns itself off at spring length
0. A step costs about 1.1 times as much with the quad tree and 1.3 times with the dual tree.</p>`,
  tryGraphs: ['Benchmark: megaStars', 'Benchmark: starOfStars', 'Benchmark: sciMet', 'Benchmark: yeast', 'Benchmark: binTree8'],
  params: [{
    key: 'reach', label: 'Reach (spring lengths)', value: DEFAULT_REACH, step: '0.5',
    help: 'Where the push starts to fade, in spring lengths. Smaller: bigger stars and tighter pieces, but at 2 or less trees fold. Larger, up to about 16: a weaker effect, closer to the library; above that it moves toward 0. 0 (or less) means no limit, which blows hub graphs apart. Values between 0 and 0.25 act as 0.25. At one spring length two nodes push exactly as hard as in the library.'
  }],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    // 2-D only: in other dimensions the library's own force stays in place.
    if (simulator.settings.dimensions !== 2) return null;

    // In spring lengths. 0 or less: no limit. NaN (e.g. a broken URL value): the default.
    const asked = Number(params.reach);
    const reachInUnits = Number.isNaN(asked) ? DEFAULT_REACH : (asked > 0 ? Math.max(asked, MIN_REACH) : 0);
    // At spring length 0 the law is the library's own push (see reachLaw.js)
    const previousLaw = simulator.repulsionLaw().spec;
    simulator.repulsionLaw(createReachLaw(reachInUnits));
    return {
      dispose() {
        simulator.repulsionLaw(previousLaw);
      }
    };
  }
};
