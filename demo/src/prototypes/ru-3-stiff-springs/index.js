// Springs that pull much harder once they are stretched far past their length.
// The stock spring pulls with k * (r - L). This one pulls with k * (r - L) * (1 + (d / (onset * L))^power)
// when d = r - L > 0, and is unchanged when the spring is shorter than L. Near its length it is the
// stock spring; a link stretched to many spring lengths is pulled back hard.
import createStiffSprings from './stiffSpringForce.js';

export default {
  id: 'ru-3-stiff-springs',
  title: 'Springs stiffen when overstretched',
  author: 'ru-3 (Samarskii & Gulin, Numerical Methods)',
  description: `
<p>On graphs with big hubs, such as starOfStars, a few links between hubs stretch to about 18 times
a typical link, and since the view zooms to fit everything, the stars are drawn as small discs on a
mostly empty screen.</p>
<p>Here a link pulls harder once it is longer than its spring length (the length a link wants to
have): twice as hard at 3 spring lengths of extra stretch, and growing with the square of the stretch
after that, while shorter links are unchanged.</p>
<p>The idea comes from Samarskii &amp; Gulin, <i>Numerical Methods</i>, chapter 3, §5: fit link lengths
by the worst link (the uniform norm) instead of on average (least squares).</p>
<p>On starOfStars the picture shrinks from about 37 typical links wide to 17 and the stars grow into
big bursts that fill the screen; megaStars changes less (32 to 24), and grid20 not at all. Compare
with <b>none</b>.</p>
<p>What gets worse: at the default time step (0.5) starOfStars never comes to rest, because the center
hub jumps back and forth on every step and the outer stars keep shimmering, and megaStars shakes more
than with <b>none</b>; on starOfStars, time step 0.25 stops it and gives the same picture. On community
graphs (sbm8x50, communities) links cross 5–8% more often, and in sbm8x50 the groups mix more.</p>
<p>Works in any number of dimensions. A safety limit keeps the pull finite at extreme settings;
normal settings never reach it.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: java', 'Benchmark: grid20'],
  params: [
    {
      key: 'onset', label: 'Stiffen after (spring lengths)', value: 3, step: '0.5',
      help: 'Extra stretch, in spring lengths, at which a link pulls twice as hard as a normal spring. ' +
        'Smaller pulls long links in sooner: stars come closer and bigger, but groups in community ' +
        'graphs blend. Larger is closer to the stock springs. Typical links on starOfStars sit near ' +
        '2 spring lengths, so at 3 they already pull about 15% harder. Values below 0.1 count as 0.1.'
    },
    {
      key: 'power', label: 'Steepness', value: 2, step: '1',
      help: 'How fast the extra pull grows past that point: 2 grows with the square of the stretch, ' +
        'higher values leave moderate stretches alone and clamp only the extreme ones. 0 or less turns ' +
        'the extra pull off (stock springs).'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator;
    // NaN falls back to the defaults. Stiffen after is at least 0.1; Steepness 0 or less is off.
    const onset = Number.isFinite(params.onset) ? Math.max(params.onset, 0.1) : 3;
    const power = Number.isFinite(params.power) ? Math.max(params.power, 0) : 2;
    const stiffSprings = createStiffSprings({ onset, power });
    const stockSprings = simulator.replaceStage('springs', stiffSprings);

    return {
      dispose() {
        if (simulator.getStage('springs') === stiffSprings) simulator.replaceStage('springs', stockSprings);
      }
    };
  }
};
