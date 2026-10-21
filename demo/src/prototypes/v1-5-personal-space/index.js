// Two bodies of the same piece closer than `radius` push each other apart with
//   F(r) = 2C (1/r^3 - 1/a^3),          a/2 <= r < a
//   F(r) = F(a/2) + |F'(a/2)| (a/2 - r), r < a/2 (linear, keeps the push bounded)
// This is the force 2C/r^3 of the pair energy C/r^2, shifted down by 2C/a^3 so that it fades to
// zero at r = a: squeezing a body into a space r costs energy that grows like 1/r^2 (Feynman,
// Lectures on Physics I, 38-4). C is chosen so that F(a/2) = strength. Bodies farther apart than
// `a` feel nothing. The push is a pair rule, so the library finds close pairs, in any dimension.
// After the start delay, the push grows from zero to full strength over this many steps
const FADE_STEPS = 100;
// "Start after" when the value is not a number
const DEFAULT_DELAY = 400;
// Largest Radius, in spring lengths. The work per step grows with the number of nodes inside the
// radius: on megaStars a step takes about 3x the stock time at 5 and over 20x at 1000.
const MAX_RADIUS = 5;
// Largest swing (frequency times time step) a crowded body may have; the integrator becomes
// unstable at 2
const MAX_SWING = 1.4;

export default {
  id: 'v1-5-personal-space',
  title: 'Personal space within a piece',
  author: 'v1-5 (from Feynman, Lectures on Physics I, ch. 38)',
  description: `
<p>In ngraph's pictures a hub with many leaves turns into a solid ball or a thin rim of dots,
because all its leaves crowd onto one ring around it.</p>
<p>This idea gives every node a little personal space: from step 400 on, two nodes of the same
connected piece that are closer than <i>Radius</i> spring lengths push each other apart, harder the
closer they are. It comes from Feynman's Lectures on Physics, Vol. 1, chapter 38: matter has a size
because its particles cannot all crowd into one spot.</p>
<p>That push alone makes crowded nodes shake, so <i>Calm crowded nodes</i> also gives them extra
inertia: they respond more slowly to every force. This extra does a large share of the work. The
calm on megaStars and most of its gain (stars fill more of the frame and sit closer together) come
from it, not from the push; set it to 0 to see the push alone.</p>
<p>What to look for, compared with <b>none</b>: on starOfStars, EVA and megaStars the rings of
leaves open into sunbursts, which is the push itself. grid20 ends up exactly the same.</p>
<p>What gets worse: crossings around hubs go up 1.1–1.9×, small trees such as binTree8 pick up
crossings, and steps take 1.1–1.4× as long. It works in any number of dimensions.</p>
`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: grid20'],
  params: [
    {
      key: 'radius', label: 'Radius', value: 0.8, step: '0.1',
      help: 'Personal space, in spring lengths: nodes of one piece that are closer push apart. Larger fills the stars more, but spreads leaves into neighbouring fans and adds crossings. 0 turns it off. At most 5: larger values count as 5, because each step gets much slower.'
    },
    {
      key: 'strength', label: 'Strength', value: 2, step: '0.5',
      help: 'Push at half the radius, in units of a spring stretched by one spring length. Larger opens dense rings more, but crowded parts settle more slowly. 0 turns it off.'
    },
    {
      key: 'delay', label: 'Start after', value: 400, step: '100',
      help: 'Steps to wait before the push starts (it then fades in over 100 steps). 0 starts it at once, which about doubles the gain on starOfStars (the share of the frame the drawing covers), but can freeze knots into grids and trees that are still unfolding (try grid20).'
    },
    {
      key: 'calm', label: 'Calm crowded nodes', value: 1, step: '1',
      help: '1: while the push runs, crowded nodes get extra inertia (and matching drag), so they respond more slowly to every force and do not shake. It also calms graphs that tremble with none, such as megaStars, and does most of the work there. 0: the push alone; dense stars then shake.'
    }
  ],

  attach({ layout, graph, params, steps }) {
    const simulator = layout.simulator;
    const stepsBefore = steps || 0; // the steps the drawing already ran count towards the delay
    // Per body: its piece (only bodies of the same piece push), how stiff the push is around it
    // (the sum of 2|dF/dr| over its pairs), and its mass while the integrator sees a bigger one
    simulator.store.define('piece', Int32Array);
    simulator.store.define('pushStiffness', Float64Array);
    simulator.store.define('trueMass', Float64Array);
    let active = false, radius = 0, strength = 0, C = 0, slope = 0, calmed = false;

    simulator.on('topology', findPieces);
    simulator.addPairRule('personalSpace', {
      radius: () => active ? radius : 0,
      rule(i, j, r, { piece, pushStiffness }) {
        if (piece[i] !== piece[j]) return 0;
        const half = radius / 2;
        let f, k;
        if (r >= half) {
          const r3 = r * r * r;
          f = 2 * C * (1 / r3 - 1 / (radius * radius * radius));
          k = 6 * C / (r3 * r);
        } else {
          f = strength + slope * (half - r);
          k = slope;
        }
        pushStiffness[i] += 2 * k;
        pushStiffness[j] += 2 * k;
        // On the same spot (r = 0) the simulator pushes along a fixed axis by what we return
        return f / (r || 1);
      }
    });
    // Reads the settings every step, so panel changes apply live
    simulator.addStage('personalSpaceSize', ({ n, pushStiffness }, sim) => {
      const delayValue = Number(params.delay);
      const delay = Number.isNaN(delayValue) ? DEFAULT_DELAY : Math.max(0, delayValue);
      const fade = Math.min(1, (sim.iteration() + 1 + stepsBefore - delay) / FADE_STEPS);
      const s = sim.settings;
      radius = Math.min(MAX_RADIUS, Number(params.radius)) * s.springLength;
      strength = fade * Number(params.strength) * s.springCoefficient * s.springLength;
      C = strength * radius * radius * radius / 14; // 2C (8/a^3 - 1/a^3) = strength
      slope = 6 * C / Math.pow(radius / 2, 4);
      // absurd radius or strength values overflow or underflow these; then push nothing
      active = fade > 0 && radius > 0 && strength > 0 && C > 0 && Number.isFinite(C) && Number.isFinite(slope);
      pushStiffness.fill(0, 0, n);
    }, { before: 'pairRules' });

    const calm = Number(params.calm);
    if (Number.isNaN(calm) || calm > 0) {
      simulator.addStage('calmCrowdedBodies', calmCrowdedBodies);
      simulator.addStage('restoreMasses', restoreMasses, { after: 'integrate' });
    }
    return {
      dispose() {
        simulator.off('topology', findPieces);
        simulator.removePairRule('personalSpace');
        ['personalSpaceSize', 'calmCrowdedBodies', 'restoreMasses'].forEach(name => {
          if (simulator.getStage(name)) simulator.removeStage(name);
        });
        ['piece', 'pushStiffness', 'trueMass'].forEach(name => simulator.store.remove(name));
      }
    };

    // A stiff push makes crowded bodies overshoot and shake when the time step is too long for
    // them. Giving a body inertia m >= K dt^2 / MAX_SWING^2 (K: how stiff its surroundings are)
    // keeps every step well inside the stable range. Drag is raised by the same factor, so the
    // body still slows down at its usual rate. A layout at rest would end up the same, since at
    // rest all forces are zero whatever the masses are. But a layout that still trembles with
    // none (megaStars) is calmed too, and that changes the picture: on megaStars it gives most of
    // the gain on its own. Only bodies the push reaches are touched, so the rest move exactly as
    // without the idea at any time step. The push has already used the true masses; only the
    // integrator sees the bigger ones, and they are put back right after it.
    function calmCrowdedBodies({ n, D, force, velocity, mass, degree, pushStiffness, trueMass }, sim) {
      if (!active) return;
      trueMass.set(mass.subarray(0, n));
      calmed = true;
      const s = sim.settings;
      const dt = s.timeStep, springStiffness = 2 * s.springCoefficient;
      const useDrag = s.integrator !== 'fire';
      for (let i = 0; i < n; ++i) {
        if (!(pushStiffness[i] > 0)) continue;
        const k = pushStiffness[i] + springStiffness * degree[i];
        const inertia = k * dt * dt / (MAX_SWING * MAX_SWING);
        // the finiteness tests only matter at absurd settings, where the numbers overflow
        if (!(inertia > mass[i]) || !Number.isFinite(inertia)) continue;
        if (useDrag) {
          const extra = s.dragCoefficient * (inertia / mass[i] - 1);
          let finite = true;
          for (let a = 0; a < D; ++a) finite = finite && Number.isFinite(force[i * D + a] - extra * velocity[i * D + a]);
          if (!finite) continue;
          for (let a = 0; a < D; ++a) force[i * D + a] -= extra * velocity[i * D + a];
        }
        mass[i] = inertia;
      }
    }

    function restoreMasses({ n, mass, trueMass }) {
      if (!calmed) return;
      mass.set(trueMass.subarray(0, n));
      calmed = false;
    }

    // Numbers every body by its connected piece, so that only bodies of the same piece push
    // each other. Pushing across pieces makes pieces that start on top of each other jam.
    function findPieces() {
      const pieceOf = new Map();
      let count = 0;
      graph.forEachNode(start => {
        if (pieceOf.has(start.id)) return;
        const stack = [start.id];
        pieceOf.set(start.id, count);
        while (stack.length) {
          graph.forEachLinkedNode(stack.pop(), other => {
            if (pieceOf.has(other.id)) return;
            pieceOf.set(other.id, count);
            stack.push(other.id);
          });
        }
        count += 1;
      });
      const { bodies, store } = simulator;
      for (let i = 0; i < bodies.length; ++i) {
        const p = pieceOf.get(bodies[i].id);
        store.piece[i] = p === undefined ? -1 - i : p; // unknown bodies push nobody
      }
    }
  }
};
