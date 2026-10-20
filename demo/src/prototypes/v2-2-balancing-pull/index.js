// "Balancing pull replaces the wall" (reader v2-2, from Feynman Vol. 2, chapters 8-12).
//
// For graphs in several pieces: every body is pulled toward the middle with a force that grows
// linearly with distance, -kappa * m * (x - c). kappa is set so the pull exactly balances the
// bodies' own push when they are spread evenly, one body per springLength^2 (a uniform
// "background" of opposite charge, as in a plasma). For that balance to hold, the push between
// far-apart bodies must fall off as 1/r, as in a flat world; slabPush.js does that beyond a
// distance h and keeps today's 1/r^2 up close. One-piece graphs are left alone.
import createSlabPush from './slabPush.js';

export default {
  id: 'v2-2-balancing-pull',
  title: 'Balancing pull for graphs in pieces',
  author: 'v2-2 (Feynman Vol. 2 reader)',
  description: `
<p><b>Problem.</b> When a graph comes in several pieces, nothing holds the pieces together: they
drift far away, and zoom-to-fit shrinks the main piece to a small dense ball in a mostly empty
picture. A wall around the layout (tried for v4) only moves the pieces onto a ring at the wall.</p>
<p><b>Change.</b> Instead of a wall, every node gets a gentle pull toward the middle. The pull
grows with distance and is sized to cancel the nodes' push on each other exactly when they are
spread evenly. Then pieces stop right at the edge of the main piece. For the cancelling to work,
the push between far-apart nodes has to weaken more slowly with distance than it does today; up
close it is unchanged. This only switches on for graphs in more than one piece.</p>
<p><b>Where it comes from.</b> Feynman Lectures, Vol. 2, ch. 8–12. Things that push each other
away (like charges) and are kept in by a metal wall all end up pressed against the wall. An even
background of opposite charge holds them evenly spread instead, as in a plasma.</p>
<p><b>Look for.</b> The main piece fills the screen and its inner structure shows. The small
pieces sit just around it, not far away. Compare with <b>none</b>. On grid20 (one piece) nothing
changes.</p>
<p><b>Worse.</b> Small pieces get pressed against the main one, and graphs made mostly of tiny
pieces (try protein) get crowded. A step costs about the same as the stock layout. This always
uses the plain tree for the push, so it is slower than the "dual tree" setting if you picked that.
2D only; in 3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: sciMet', 'Benchmark: CSphd', 'Benchmark: grid20'],
  params: [
    {
      key: 'strength', label: 'Pull strength', value: 1, step: '0.1',
      help: '1 = the pull exactly cancels the push, so pieces settle at the edge of the main piece. ' +
        '0 turns the pull off (pieces drift away, as in none). Above 1 the small pieces get squeezed into the main one.'
    },
    {
      key: 'reach', label: 'Long push from', value: 2, step: '0.5',
      help: 'In spring lengths. Beyond this distance the push weakens as 1/distance instead of today\'s 1/distance², ' +
        'like in a flat world; the pull stays the same. Smaller: the main piece opens up more. ' +
        "0 or large (e.g. 100) brings back today's push, and then the pull drags small pieces inside the main one (try CSphd)."
    },
    {
      key: 'always', label: 'Also on one-piece graphs', value: 0, step: '1',
      help: '1 = use it even when the graph is in one piece (try grid20): the pull squeezes the shape into a disc. ' +
        'That is why it is off there by default.'
    }
  ],

  attach({ layout, graph, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return {}; // 2D only: does nothing in 3D+
    if (countPieces(graph) < 2 && !(Number(params.always) > 0)) return {};

    const simulator = layout.simulator;
    const simSettings = simulator.settings;
    const strength = Math.max(0, Number(params.strength) || 0);
    const reach = Math.max(0, Number(params.reach) || 0);
    const getH = () => reach * simSettings.springLength;

    // Forces run in the order they were added, and the push resets every body's force, so it
    // has to come first: take the springs out, put our push in, put the springs back.
    const spring = simulator.getForces().get('spring');
    simulator.removeForce('nbody');
    simulator.removeForce('spring');
    simulator.addForce('v2-2-slab-push', createSlabPush(simulator, getH));
    simulator.addForce('spring', spring);
    if (strength > 0) simulator.addForce('v2-2-balancing-pull', () => balancingPull(simulator, strength));

    return {};
  }
};

// The pull of an even background of opposite charge, one body per springLength^2, centred on
// the bodies' charge-weighted middle. In a flat world the field inside such a background grows
// linearly with distance (Gauss's law; Feynman Vol. 2, Eq. 12.24 for the 3D ball). It uses the
// far-field constant of the default slab push (h = 2 spring lengths): G' = 2G/h = G/L. The
// 'reach' parameter changes only the push, so a large reach shows the pull without the
// flat-world push.
function balancingPull(simulator, strength) {
  const bodies = simulator.bodies;
  const n = bodies.length;
  if (n < 2) return;
  const settings = simulator.settings;
  const L = settings.springLength;
  let charge = 0, cx = 0, cy = 0;
  for (let i = 0; i < n; ++i) {
    const body = bodies[i];
    charge += body.mass;
    cx += body.mass * body.pos.x;
    cy += body.mass * body.pos.y;
  }
  cx /= charge;
  cy /= charge;
  const flatG = Math.abs(settings.gravity) / L;
  const radius2 = n * L * L / Math.PI;
  const kappa = strength * flatG * charge / radius2;
  for (let i = 0; i < n; ++i) {
    const body = bodies[i];
    if (body.isPinned) continue;
    body.force.x -= kappa * body.mass * (body.pos.x - cx);
    body.force.y -= kappa * body.mass * (body.pos.y - cy);
  }
}

// Number of connected pieces (isolated nodes count as pieces)
function countPieces(graph) {
  const seen = new Set();
  let pieces = 0;
  graph.forEachNode(node => {
    if (seen.has(node.id)) return;
    pieces += 1;
    const queue = [node.id];
    seen.add(node.id);
    while (queue.length) {
      const id = queue.pop();
      graph.forEachLinkedNode(id, other => {
        if (!seen.has(other.id)) {
          seen.add(other.id);
          queue.push(other.id);
        }
      });
    }
  });
  return pieces;
}
