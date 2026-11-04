// A speed limit of each node's own, which halves when the node turns back and grows again while
// it keeps going one way (Rprop's step rule; GEM's per-node temperature; GROMACS steepest descent).
//
// In a dense core every step is the global speed limit long, about the spacing of the nodes there,
// so the core overshoots back and forth by a step forever. Here a node that reverses while moving at
// half its own limit or more halves that limit, so it closes in on its balance point as a bisection
// would; a node that keeps its direction grows its limit by 1.2 per step, up to maxVelocity. Forces,
// drag, inertia and the step stay as they are, so a crowd that moves together is not slowed.
//
// One node formula, so the CPU and WebGPU run the same text. It runs just before the integrator:
// it predicts the velocity the integrator will give, and when that is faster than the node's own
// limit it hands the integrator the force that gives the limited velocity instead.
export const CAP_FORMULA = [
  'vs = velocity + dt * force / mass',
  // the limit starts at maxVelocity (a new column holds 0)
  'cap = reversalCap > 0 ? min(reversalCap, maxVelocity) : maxVelocity',
  'turn = dot(vs, velocity)',
  'old2 = dot(velocity, velocity)',
  'cap = turn < 0 && old2 >= 0.25 * cap * cap ? max(cap * shrink, maxVelocity * floor) : (turn > 0 ? min(cap * grow, maxVelocity) : cap)',
  'reversalCap = cap',
  'speed = length(vs)',
  'scale = speed > cap ? cap / speed : 1',
  'force = mass * (vs * scale - velocity) / dt'
].join('; ');

export function attachReversalCap(layout, params = {}) {
  const simulator = layout.simulator, store = simulator.store;
  if (!store.has('reversalCap')) store.define('reversalCap', Float64Array, 1);
  simulator.addNodeFormula('reversalCap', {
    formula: CAP_FORMULA,
    params: {
      shrink: Math.min(0.95, Math.max(0.05, orDefault(params.shrink, 0.5))),
      grow: Math.min(3, Math.max(1, orDefault(params.grow, 1.2))),
      // the least a node's limit goes down to, as a share of maxVelocity
      floor: Math.min(1, Math.max(1e-6, orDefault(params.floor, 0.05)))
    }
  });
}

function orDefault(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

export default {
  id: 'r6-reversal-cap',
  title: 'Speed limit that halves on a reversal',
  author: 'phys-struct (round 6, idea from r6-control)',
  description: `
<p>In the core of a dense graph every step is as long as the speed limit allows, which is about the
spacing of the nodes there, so the core overshoots back and forth by a step forever.</p>
<p>Here each node has a speed limit of its own. When the node turns back while moving at half its
limit or more, its limit halves; while it keeps going one way, the limit grows again by 1.2 per step,
up to the usual speed limit. A node that rattles closes in on its balance point the way a bisection
does; a crowd that moves together never turns back, so it is not slowed. Forces, drag and the step
are unchanged.</p>
<p>Look at the middle of Gset/G43, Barabasi-Albert (20k) and megaStars: on, the core holds still;
off, it boils.</p>
<p>What gets worse: a node dragged through a calm dense core pulls its neighbours along less than
today, and when let go it drifts back slowly instead of snapping back: the neighbours' own limits
are small there and grow back by 1.2 a step. "Least limit" trades this against the calm.</p>`,
  tryGraphs: ['Gset/G43', 'Barabasi-Albert (20k)', 'Benchmark: megaStars', 'Binary tree (8k)'],
  params: [
    {
      key: 'shrink', label: 'On a reversal', value: 0.5, step: '0.1',
      help: 'What a node\'s own speed limit is multiplied by when it turns back (0.5 halves it).'
    },
    {
      key: 'grow', label: 'Going on', value: 1.2, step: '0.1',
      help: 'What the limit is multiplied by on each step the node keeps its direction, up to the ' +
        'usual speed limit.'
    },
    {
      key: 'floor', label: 'Least limit', value: 0.05, step: '0.01',
      help: 'The smallest a node\'s limit gets, as a share of the usual speed limit. Bigger lets ' +
        'dragged nodes pull their neighbours along sooner, but leaves a small rattle of that size.'
    }
  ],
  attach({ layout, params }) {
    attachReversalCap(layout, params);
    return {};
  }
};
