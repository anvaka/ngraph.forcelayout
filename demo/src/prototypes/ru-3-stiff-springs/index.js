// Springs that pull much harder once they are stretched far past their length.
// The stock spring pulls with k * (r - L). This one pulls with k * (r - L) * (1 + (d / (onset * L))^power)
// when d = r - L > 0, and is unchanged when the spring is shorter than L. Near its length it is the
// stock spring; a link stretched to many spring lengths is pulled back hard.
import createStiffSpringForce from './stiffSpringForce.js';

export default {
  id: 'ru-3-stiff-springs',
  title: 'Springs stiffen when overstretched',
  author: 'ru-3 (Samarskii & Gulin, Numerical Methods)',
  description: `
<p>In graphs with big hubs, such as starOfStars, ngraph draws each star as a small tight disc and joins
the stars with very long thin links, so most of the screen is empty. Heavy hubs push each other far
apart, a handful of links stretch to 10–18 times their normal length (the "spring length", the length
a link wants to have), and because the view zooms to fit everything, those few links decide how small
everything else looks.</p>
<p>Here a link pulls much harder once it is stretched well past its normal length: at 3 spring lengths
of extra stretch its pull doubles, and it keeps growing fast after that. Links near their normal
length behave exactly as before.</p>
<p>The idea comes from Samarskii &amp; Gulin, <i>Numerical Methods</i>, chapter 3, §5: an ordinary spring
fits link lengths on average (least squares), which lets a few links be very wrong; fitting by the
worst link instead (the uniform norm) keeps every link close to its length.</p>
<p>Look for stars that grow into large bursts that fill the screen, with short links between them.
Compare with <b>none</b>.</p>
<p>What gets worse: where long links carry meaning, like the links between groups in sbm8x50 or
communities, the groups blend more. Leaves piled around a hub (EVA) are not spread out by this.
2D only: in 3D the layout is left unchanged.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: java', 'Benchmark: grid20'],
  params: [
    {
      key: 'onset', label: 'Stiffen after (spring lengths)', value: 3, step: '0.5',
      help: 'Extra stretch, in spring lengths, at which a link pulls twice as hard as a normal spring. ' +
        'Smaller pulls long links in sooner: stars come closer and bigger, but groups in community ' +
        'graphs blend. Larger is closer to the stock springs.'
    },
    {
      key: 'power', label: 'Steepness', value: 2, step: '1',
      help: 'How fast the extra pull grows past that point: 2 grows with the square of the stretch, ' +
        'higher values leave moderate stretches alone and clamp only the extreme ones. 0 turns the ' +
        'extra pull off (stock springs).'
    }
  ],

  attach({ layout, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;
    const forces = simulator.getForces();
    const stockSpring = forces.get('spring');
    if (!stockSpring) return null;

    const onset = Number.isFinite(params.onset) && params.onset > 0 ? params.onset : 3;
    const power = Number.isFinite(params.power) && params.power >= 0 ? params.power : 2;
    const stiffSpring = createStiffSpringForce(simulator, { onset, power });

    // Same slot and order as the stock spring force: it runs after repulsion, which resets forces.
    simulator.removeForce('spring');
    simulator.addForce('spring', stiffSpring);

    return {
      dispose() {
        if (simulator.getForces().get('spring') !== stiffSpring) return;
        simulator.removeForce('spring');
        simulator.addForce('spring', stockSpring);
      }
    };
  }
};
