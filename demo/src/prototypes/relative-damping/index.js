// Relative damping: an implicit (backward Euler) step for the motion of close neighbours relative
// to each other, and nothing else.
//
// Dense cores boil because the push between close, unlinked neighbours is stiffer than the
// explicit step can follow: two neighbours overshoot against each other every step. Here, every
// step, each pair closer than R = radius * springLength gets the push's radial stiffness
// w = 2 |gravity| m_i m_j / r^3, and the step's predicted velocities v* = v + dt F / m are
// corrected by solving
//
//     (M + dt^2 K) v = M v*,      (K v)_i = sum_j w_ij (v_i - v_j)
//
// with damped Jacobi sweeps (omega = 1/2, started from v*). K's rows sum to zero, so a crowd that
// moves, turns or stretches slowly as a whole is not touched; only neighbours moving against each
// other are held back, and the stiff back-and-forth dies in one step instead of flipping sign.
// Everything comes from the settings (springLength, gravity, timeStep, the masses): no per-graph
// numbers. Pair and node formulas, so the CPU and WebGPU run the same text.
const OMEGA = 0.5;

export default {
  id: 'relative-damping',
  title: 'Relative damping (implicit, close pairs)',
  author: 'phys-md (round 6; proposals from numerics, cells, sph, crowds, gamephys)',
  description: `
<p>Dense cores boil: close nodes that aren't linked push each other harder than the step can
follow, so every step they overshoot against each other.</p>
<p>This idea damps only that: the motion of close neighbours <i>relative to each other</i>, solved
implicitly (backward Euler) for pairs closer than <i>Radius</i> spring lengths. A crowd that moves,
turns or slowly stretches as a whole passes untouched, so unfolding and drift are as before.</p>
<p>Try G43, Barabasi-Albert (20k), er1000 and megaStars against <b>none</b>: the core should stop
boiling within a few steps. Trees and grids have almost no close pairs and should not change.</p>
`,
  tryGraphs: ['Gset/G43', 'Barabasi-Albert (20k)', 'Benchmark: er1000', 'Benchmark: megaStars'],
  params: [
    {
      key: 'radius', label: 'Radius', value: 0.5, step: '0.05',
      help: 'Pairs closer than this many spring lengths are damped against each other. 0.5 holds the crowded cores of dense graphs; smaller leaves more of the stiffness to the explicit step (0.15 still boils). Larger costs more pairs per step.'
    },
    {
      key: 'sweeps', label: 'Sweeps', value: 2, step: '1',
      help: 'Damped Jacobi sweeps of the implicit solve per step (1 to 4). 2 is enough at the default time step; each sweep is one more pass over the close pairs.'
    }
  ],

  attach({ layout, params }) {
    const simulator = layout.simulator, store = simulator.store;
    const radius = Math.max(0, Number(params.radius) || 0);
    const sweeps = Math.max(1, Math.min(4, Math.round(Number(params.sweeps) || 2)));
    const columns = ['rdTarget', 'rdVelocity', 'rdSum', 'rdWeight'];
    const stages = [];
    if (!(radius > 0)) return null;
    columns.forEach(name => { if (store.has(name)) store.remove(name); });
    store.define('rdTarget', Float64Array, store.D);   // M v*: this step's predicted momentum
    store.define('rdVelocity', Float64Array, store.D); // the solve's current velocity
    store.define('rdSum', Float64Array, store.D);      // sum_j w_ij v_j
    store.define('rdWeight', Float64Array, 1);         // sum_j w_ij

    // This step's predicted velocity (the force holds the drag already), as the integrator would
    // make it
    let previous = 'springs';
    add('relDampPredict', 'node', {
      after: previous,
      formula: `
        rdVelocity = velocity + dt * force / mass;
        rdTarget = mass * rdVelocity`
    });
    // The per-node answer: each node's own implicit step with its neighbours held at rest,
    // v = M v* / (m + dt^2 W). It stops nodes in stiff crowds at once; the sweeps then give back
    // what the crowd shares (its common motion)
    add('relDampWeights', 'pair', {
      after: previous,
      radius: ctx => radius * ctx.unit(),
      startAtZero: ['rdWeight'],
      formula: `
        w = 2 * abs(gravity) * mass_i * mass_j / (r * r * r);
        rdWeight_i += w;
        rdWeight_j += w;
        push = 0`
    });
    add('relDampLocal', 'node', {
      after: previous,
      formula: `rdVelocity = rdTarget / (mass + dt * dt * rdWeight)`
    });
    for (let s = 0; s < sweeps; ++s) {
      add('relDampPairs' + s, 'pair', {
        after: previous,
        radius: ctx => radius * ctx.unit(),
        startAtZero: ['rdSum', 'rdWeight'],
        formula: `
          w = 2 * abs(gravity) * mass_i * mass_j / (r * r * r);
          rdSum_i += w * rdVelocity_j;
          rdSum_j += w * rdVelocity_i;
          rdWeight_i += w;
          rdWeight_j += w;
          push = 0`
      });
      add('relDampSweep' + s, 'node', {
        after: previous,
        params: { omega: OMEGA },
        formula: `
          h = dt * dt;
          jacobi = (rdTarget + h * rdSum) / (mass + h * rdWeight);
          rdVelocity = rdWeight > 0 ? (1 - omega) * rdVelocity + omega * jacobi : rdVelocity`
      });
    }
    // The integrator does v += dt * force / mass: give it the force that lands on the solved velocity
    add('relDampApply', 'node', {
      after: previous,
      formula: `force = mass * (rdVelocity - velocity) / dt`
    });

    return {
      dispose() {
        stages.forEach(name => { if (simulator.getStage(name)) simulator.removeStage(name); });
        columns.forEach(name => { if (store.has(name)) store.remove(name); });
      }
    };

    function add(name, kind, options) {
      if (kind === 'pair') simulator.addPairFormula(name, options);
      else simulator.addNodeFormula(name, options);
      stages.push(name);
      previous = name;
    }
  }
};
