// "Balancing pull replaces the wall" (reader v2-2, from Feynman Vol. 2, chapters 8-12).
//
// For graphs in several pieces: every body is pulled toward the middle with a force that grows
// linearly with distance, -kappa * m * (x - c). kappa is set so the pull exactly balances the
// bodies' own push when they are spread evenly, one body per springLength^2 (a uniform
// "background" of opposite charge, as in a plasma). For that balance to hold, the push between
// far-apart bodies must fall off as 1/r, as in a flat world: bodies push each other as if they
// lived in a thin flat slab of thickness h,
//
//   F = G m_i m_j sqrt(1 + (2r/h)^2) / r^2
//
// which is today's 1/r^2 much closer than h/2 and 2/(h r) much farther (an interpolation of the
// exact sum over mirror images of a source between two insulating walls; within 15% of it
// everywhere and exact at both ends). The two parts are equal at r = h/2, so at the default
// h = 2 spring lengths the push is already 1.4x today's at one spring length. One-piece graphs
// are left alone.

// Upper bound on 4/h^2. It only applies when h is below about 1e-50 layout units (or h*h
// underflows to 0), where sqrt(1 + K r^2) would overflow and turn positions into NaN.
const MAX_SLAB_K = 1e100;

export default {
  id: 'v2-2-balancing-pull',
  title: 'Balancing pull for graphs in pieces',
  author: 'v2-2 (Feynman Vol. 2 reader)',
  description: `
<p><b>Problem.</b> When a graph comes in several pieces, nothing holds them together: they drift
far off, and zoom-to-fit shrinks the main piece to a small ball (on yeast it gets 10% of the
picture).</p>
<p><b>Change.</b> Every node gets a pull toward the middle that grows with distance, sized for all
the nodes spread evenly at one per spring length², like the even background of opposite charge
that holds a plasma together (Feynman Lectures, Vol. 2, ch. 8–12). For that balance to work, the
push between nodes fades as 1/distance far away instead of today's 1/distance²; it is already
1.4× today's at one spring length and stronger farther out, so on dense graphs the main piece
also spreads out wider (yeast: 1.7× as wide).</p>
<p><b>Look for.</b> Compared with <b>none</b>, the main piece fills most of the picture (yeast 10% →
90%, CSphd 23% → 71%), and the small pieces sit 3–6 spring lengths from it instead of 20–55.
Graphs in one piece are left alone, so grid20 doesn't change.</p>
<p><b>Worse.</b> Small pieces get pressed against the main one and lose some of their shape, and
graphs made mostly of tiny pieces (protein) get crowded and overlap. A step costs about the same
as stock, with either Repulsion setting. It does nothing in 3D.</p>`,
  tryGraphs: ['Benchmark: yeast', 'Benchmark: sciMet', 'Benchmark: CSphd', 'Benchmark: grid20'],
  params: [
    {
      key: 'strength', label: 'Pull strength', value: 1, step: '0.1',
      help: '1 = the pull balances the push of all nodes spread evenly at one per spring length², so pieces settle ' +
        'at the edge of that disc, a few spring lengths outside the main piece. ' +
        '0 turns the pull off (pieces drift away, as in none). Above 1 the small pieces get pressed closer and start to overlap the main one.'
    },
    {
      key: 'reach', label: 'Long push scale', value: 2, step: '0.5',
      help: 'In spring lengths. The push is today\'s 1/distance² at short range and fades only as 1/distance at long ' +
        'range, like in a flat world; the two parts are equal at half this value. At the default 2 the push is 1.4× ' +
        'today\'s at one spring length and 2.2× at two. The pull stays the same. Smaller: the main piece opens up more. ' +
        "0 gives exactly today's push, and large values (e.g. 100) nearly so; then the pull drags small pieces inside the main one (try CSphd)."
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
    const strength = Number.isFinite(Number(params.strength)) ? Math.max(0, Number(params.strength)) : 0;
    const reach = Math.max(0, Number(params.reach) || 0);

    // The slab law, in both trees; h is read every step, so it follows the spring length.
    // A reach of 0 is today's push.
    const previousLaw = simulator.repulsionLaw().spec;
    if (reach > 0) {
      simulator.repulsionLaw({
        force: 'sqrt(1 + K * r * r) / r^2',
        params: {
          K(sim) {
            const h = reach * sim.settings.springLength;
            return h > 0 ? Math.min(4 / (h * h), MAX_SLAB_K) : 0;
          }
        }
      });
    }
    const stages = strength > 0 ? addBalancingPull(simulator, strength) : [];

    return {
      dispose() {
        simulator.repulsionLaw(previousLaw);
        stages.forEach(name => { if (simulator.getStage(name)) simulator.removeStage(name); });
      }
    };
  }
};

// The pull of an even background of opposite charge, one body per springLength^2, centred on
// the bodies' charge-weighted middle. In a flat world the field inside such a background grows
// linearly with distance (Gauss's law; Feynman Vol. 2, Eq. 12.24 for the 3D ball). It uses the
// far-field constant of the default slab push (h = 2 spring lengths): G' = 2G/h = G/L. The
// 'reach' parameter changes only the push, so a large reach shows the pull without the
// flat-world push.
//
// Written as formulas, so the simulator runs the loops: two sums (the total charge and the
// charge-weighted position) and a formula for every body. Returns the names of the stages.
function addBalancingPull(simulator, strength) {
  simulator.addSum('balancingCharge', { formula: 'mass' });
  simulator.addSum('balancingMoment', { formula: 'mass * pos' });
  simulator.addNodeFormula('v2-2-balancing-pull', {
    params: { strength },
    formula: `
      center = balancingMoment / balancingCharge;
      d = pos - center;
      // the pull balances the push of n bodies spread evenly over a disc, one per springLength^2
      flatG = abs(gravity) / springLength;
      radius2 = n * springLength * springLength / pi;
      kappa = strength * flatG * balancingCharge / radius2;
      // Spring length 0 (the panel passes through it while you type "0.5") and other extreme
      // settings make kappa 0, negative, infinite or NaN: then there is no pull, rather than NaN
      // positions. A body whose pull would be huge (only at absurd strengths) is left alone; 1e30
      // is a limit that 32-bit floats (a GPU) hold too.
      force -= select(n >= 2 && kappa > 0 && kappa < 1e30 && pinned == 0 && kappa * mass * length(d) < 1e30,
        kappa * mass * d, 0 * pos)`
  });
  return ['balancingCharge', 'balancingMoment', 'v2-2-balancing-pull'];
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
