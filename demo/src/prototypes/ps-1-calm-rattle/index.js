// Dense cores rattle because their crowded nodes are stiffer than the explicit step can follow:
// each node overshoots, flips back, and the speed limit turns that into a steady boil. Here every
// node measures how stiff its own motion is, from its last two steps (no pairs, no tree: the force
// it feels and the move it made), and only the part of that stiffness the step cannot follow is
// treated implicitly, as backward Euler would. A crowd that moves as a whole feels little change of
// force and is left alone; a node that rattles against its neighbours feels the whole stiffness of
// the rattle and is calmed in the same step. At rest nothing changes: the drawing settles where it
// would have settled.
//
// One node formula, so the CPU and WebGPU run the same text.
export const CALM_FORMULA = [
  // the force without drag, and how much it changed along the move the node just made (dt * v)
  'f = force + dragCoefficient * velocity',
  'v2 = dot(velocity, velocity)',
  // moves slower than `floor` (a share of the spring length per step) are too small to measure
  // a stiffness from: at rest, noise in the forces would read as a huge stiffness
  'slow = floor * unit / dt',
  'measured = v2 > 1e-12 ? max(0, -dot(f - calmForce, velocity) / (dt * (v2 + slow * slow))) : 0',
  // a stiffness, once measured, is kept for a while: a calmed node moves too little to measure it
  'calmStiffness = max(measured, hold * calmStiffness)',
  'calmForce = f',
  // the stiffness past what the explicit step handles (gain dt^2 k / m of 1; it breaks at 3.1 or
  // more) is made implicit: the velocity becomes g * (v + dt F / m)
  'extra = strength * max(0, dt * dt * calmStiffness - safe * mass)',
  'g = mass / (mass + extra)',
  'force = (g * (mass * velocity + dt * force) - mass * velocity) / dt'
].join('; ');

export function attachCalm(layout, params = {}) {
  const simulator = layout.simulator, store = simulator.store;
  if (!store.has('calmForce')) store.define('calmForce', Float64Array, store.D);
  if (!store.has('calmStiffness')) store.define('calmStiffness', Float64Array, 1);
  simulator.addNodeFormula('calmRattle', {
    formula: CALM_FORMULA,
    params: {
      strength: orDefault(params.strength, 1),
      hold: Math.min(0.999, Math.max(0, orDefault(params.hold, 0.9))),
      safe: Math.max(0, orDefault(params.safe, 1)),
      floor: Math.max(0, orDefault(params.floor, 0.005))
    }
  });
}

function orDefault(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

export default {
  id: 'ps-1-calm-rattle',
  title: 'Calm rattling cores',
  author: 'phys-struct (structural dynamics)',
  description: `
<p>On dense graphs the middle of the drawing boils: crowded nodes are stiffer than the step can
follow, so each one overshoots, flips back, and the speed limit turns that into a steady jitter of
about two units per step.</p>
<p>Here every node measures how stiff its own motion is from its last two steps (how much its force
changed along the move it just made), and the part of that stiffness the step cannot follow is
treated implicitly, as an implicit integrator would. A crowd that moves as a whole feels little
change of force and is left alone; only nodes that rattle are calmed. At rest it does nothing, so
the drawing settles where it would have.</p>
<p>Look at the middle of Barabasi-Albert (20k), Gset/G43, er1000 and megaStars: on, the core holds
still and keeps unfolding, and settles into an even packing; off, it boils, and the picture it
stops in keeps the clumps of the boil. Trees, grids and pieces look the same either way.</p>
<p>What gets worse: pieces that start on top of each other (Many pieces) pull apart more slowly in
the first two seconds; graphs that boiled take longer to stop, because the boil no longer passes
for "settled" and the slow creep left after it is real motion; a node dragged through a dense
graph pulls its neighbours along a little less.</p>`,
  tryGraphs: ['Barabasi-Albert (20k)', 'Gset/G43', 'Benchmark: er1000', 'Benchmark: megaStars'],
  params: [
    {
      key: 'strength', label: 'Strength', value: 1, step: '0.5',
      help: 'How much of the extra stiffness is made implicit. 1 is enough for any stiffness; 0.5 is ' +
        'the least that is; 0 turns it off.'
    },
    {
      key: 'hold', label: 'Memory', value: 0.9, step: '0.05',
      help: 'How long a measured stiffness is kept, per step (0.9: it fades to a third in about 10 ' +
        'steps). Shorter lets pieces that overlap pull apart sooner, but the core calms less.'
    }
  ],
  attach({ layout, params }) {
    attachCalm(layout, params);
    return {};
  }
};
