// "Flat-world push plus balancing pull" (reader v2-3). See the description below and README.md.
//
// Today every pair of nodes pushes apart with a force that falls off as 1/r^2. That is how charges
// push in a 3D world. In a flat (2D) world, Gauss's law (Feynman Vol. II, Ch. 18, Table 18-1,
// eq. I: the flux of the field through a closed curve equals the charge inside) makes the push of
// one charge fall off as 1/r instead. This prototype uses that flat-world push, plus a uniform
// disc of opposite total charge ("background") centred on the layout. By the same law the disc
// pulls each node toward its centre with a force that grows linearly inside the disc and falls
// off as 1/r outside it, and it cancels the push exactly wherever the nodes are as dense as the
// disc. The layout as a whole is then neutral: big clumps stop pushing everything else away.
//
// The push reuses the library's own generated quad tree code with only the distance power
// changed, so a step costs about the same as before; the pull is one pass over the bodies.
import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js';
import generateCreateDragForce from '../../../../lib/codeGenerators/generateCreateDragForce.js';

const treeCache = {};

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
evenly as the disc.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, Ch. 18 and 20: Gauss's law, and how
the push of a charge follows from the dimension of space.</p>
<p><b>What to look for.</b> Compare with <b>none</b> after about 1500 steps: the big piece's share
of the picture goes from 0.10 to 0.73 on yeast, 0.06 to 0.49 on sciMet and 0.23 to 0.60 on
CSphd, and the eight communities of sbm8x50 separate.</p>
<p><b>What gets worse.</b> Grids bow outward into a pillow shape, isolated nodes pile up in a band
at the rim (protein), and star fans are not helped. Spacing is tuned for spring length 10 and
gravity -12: with longer springs or weaker gravity the effect fades unless you lower it (see its
help). It always uses the quad tree, ignoring the dual-tree setting, and does nothing in 3D.</p>`,
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
    const dimensions = simulator.settings.dimensions;
    // 2D only. In 3D the library's 1/r^2 push already is the "right" law, but the balancing ball
    // is not implemented here; other dimensions are left untouched.
    if (dimensions !== 2) return null;

    const spacing = Math.max(0.1, numberOr(params.spacing, 1.5));
    // Capped so a huge value from the URL can't overflow the pull to Infinity (and NaN)
    const balance = Math.min(100, Math.max(0, numberOr(params.balance, 1)));
    const falloff = numberOr(params.falloff, 1) === 2 ? 2 : 1;
    const bodies = simulator.bodies;
    // The panel sets springLength live, so it is 0 for a moment while "0.5" is typed; dividing by 0
    // would turn every position into NaN.
    const unitLength = () => Math.max(simulator.springLength(), 1e-3);

    if (falloff === 1) {
      // Replace the n-body force by the flat-world one; keep the springs after it. This is always
      // a quad tree: the dual-tree setting is ignored.
      const springForce = simulator.getForces().get('spring');
      const tree = getFlatWorldTree()({ gravity: simulator.gravity(), theta: simulator.theta() }, simulator.random);
      const drag = generateCreateDragForce(2)(simulator.settings);
      simulator.removeForce('nbody');
      simulator.removeForce('spring');
      simulator.addForce('nbody', () => {
        // Same pair force as today at one spring length: |G| m m / L^2 = G1 m m / L, so G1 = G / L
        const gravity = simulator.gravity() / unitLength();
        tree.options({ gravity, theta: simulator.theta() });
        tree.insertBodies(bodies);
        const useDrag = simulator.integrator() !== 'fire';
        for (let i = 0; i < bodies.length; ++i) {
          const body = bodies[i];
          if (body.isPinned) continue;
          body.reset();
          tree.updateBodyForce(body);
          if (useDrag) drag.update(body);
        }
        if (balance > 0) addBalancingPull(-gravity);
      });
      simulator.addForce('spring', springForce);
    } else if (balance > 0) {
      // Control: today's 1/r^2 push plus the same linear pull (centre gravity)
      simulator.addForce('v2-3-pull', () => addBalancingPull(-simulator.gravity() / unitLength()));
    }

    function addBalancingPull(strength) {
      // A uniform disc with total charge -balance * Q, centred on the charge centroid. Inside it the
      // pull on body i is strength * q_i * Q * d / R^2 (grows linearly with the distance d from the
      // centre), outside it strength * q_i * Q * d / |d|^2 (falls off as 1/|d|).
      let Q = 0, cx = 0, cy = 0;
      for (let i = 0; i < bodies.length; ++i) {
        const body = bodies[i];
        Q += body.mass; cx += body.mass * body.pos.x; cy += body.mass * body.pos.y;
      }
      if (!(Q > 0)) return;
      cx /= Q; cy /= Q;
      const R = spacing * unitLength() * Math.sqrt(bodies.length / Math.PI);
      const R2 = R * R;
      const k = strength * balance * Q;
      for (let i = 0; i < bodies.length; ++i) {
        const body = bodies[i];
        if (body.isPinned) continue;
        const dx = body.pos.x - cx, dy = body.pos.y - cy;
        const r2 = dx * dx + dy * dy;
        const f = -k * body.mass / (r2 > R2 ? r2 : R2);
        body.force.x += f * dx;
        body.force.y += f * dy;
      }
    }

    return {};
  }
};

function numberOr(value, fallback) {
  const number = Number(value);
  return value === undefined || value === '' || !Number.isFinite(number) ? fallback : number;
}

// The library's 2D quad tree with the push changed from 1/r^2 to 1/r: the generated code divides
// by r^3 (force vector = d / r^3); dividing by r^2 instead gives |F| ~ 1 / r.
function getFlatWorldTree() {
  if (treeCache.flat) return treeCache.flat;
  const code = generateQuadTree.generateQuadTreeFunctionBody(2);
  const patched = code.split('/ (r * r * r)').join('/ (r * r)');
  if (patched === code) throw new Error('v2-3-flat-world: quad tree kernel not found');
  treeCache.flat = (new Function(patched))();
  return treeCache.flat;
}
