import createPersonalSpaceForce from './createPersonalSpaceForce.js';

const FORCE_NAME = 'v1-5-personal-space';
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
crossings, and steps take 1.1–1.4× as long. It does nothing in 3D.</p>
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

  attach({ layout, graph, params, settings, steps }) {
    if ((settings.dimensions || 2) !== 2) return {}; // 2D only: does nothing in 3D or more

    const simulator = layout.simulator;
    const bodies = simulator.bodies;
    let force = null;
    let knownCount = -1;
    let stepCount = steps || 0; // the steps the drawing already ran count towards the delay
    // body.mass is both the body's "charge" (how hard it repels) and its inertia (how fast it
    // moves under a force). While the push runs, crowded bodies get extra inertia for the
    // integrator only; `charge` keeps the real masses, which are restored after every step.
    let charge = new Float64Array(0);
    let massChanged = false;
    const markDirty = () => { knownCount = -1; };
    graph.on('changed', markDirty);
    layout.on('step', restoreMasses);

    simulator.addForce(FORCE_NAME, () => {
      stepCount += 1;
      const delayValue = Number(params.delay);
      const delay = Number.isNaN(delayValue) ? DEFAULT_DELAY : Math.max(0, delayValue);
      const fade = Math.min(1, (stepCount - delay) / FADE_STEPS);
      if (fade <= 0) return;

      if (bodies.length !== knownCount) rebuild();
      const s = simulator.settings; // read every step, so panel changes apply live
      const radius = Math.min(MAX_RADIUS, Number(params.radius)) * s.springLength;
      const strength = fade * Number(params.strength) * s.springCoefficient * s.springLength;
      force.apply(radius, strength, true);
      const calm = Number(params.calm);
      if (Number.isNaN(calm) || calm > 0) slowDownCrowdedBodies(s);
    });

    return {
      dispose() {
        restoreMasses();
        graph.off('changed', markDirty);
        layout.off('step', restoreMasses);
        simulator.removeForce(FORCE_NAME);
      }
    };

    // A stiff push makes crowded bodies overshoot and shake when the time step is too long for
    // them. Giving a body inertia m >= K dt^2 / MAX_SWING^2 (K: how stiff its surroundings are)
    // keeps every step well inside the stable range. Drag is raised by the same factor, so the
    // body still slows down at its usual rate. A layout at rest would end up the same, since at
    // rest all forces are zero whatever the masses are. But a layout that still trembles with
    // none (megaStars) is calmed too, and that changes the picture: on megaStars it gives most of
    // the gain on its own. Only bodies the push reaches are touched, so the rest move exactly as
    // without the idea at any time step.
    function slowDownCrowdedBodies(s) {
      const stiffness = force.stiffness;
      const dt = s.timeStep, springStiffness = 2 * s.springCoefficient;
      const useDrag = s.integrator !== 'fire';
      for (let i = 0; i < bodies.length; ++i) {
        if (!(stiffness[i] > 0)) continue;
        const body = bodies[i];
        const k = stiffness[i] + springStiffness * body.springCount;
        const inertia = k * dt * dt / (MAX_SWING * MAX_SWING);
        // the finiteness tests only matter at absurd settings, where the numbers overflow
        if (!(inertia > charge[i]) || !Number.isFinite(inertia)) continue;
        let fx = body.force.x, fy = body.force.y;
        if (useDrag) {
          const extra = s.dragCoefficient * (inertia / charge[i] - 1);
          fx -= extra * body.velocity.x;
          fy -= extra * body.velocity.y;
          if (!Number.isFinite(fx + fy)) continue;
        }
        body.force.x = fx;
        body.force.y = fy;
        body.mass = inertia;
        massChanged = true;
      }
    }

    function restoreMasses() {
      if (!massChanged) return;
      for (let i = 0; i < charge.length && i < bodies.length; ++i) bodies[i].mass = charge[i];
      massChanged = false;
    }

    // Numbers every body by its connected piece, so that only bodies of the same piece push
    // each other. Pushing across pieces makes pieces that start on top of each other jam.
    function rebuild() {
      const pieceOf = new Map();
      let piece = 0;
      graph.forEachNode(start => {
        if (pieceOf.has(start.id)) return;
        const stack = [start.id];
        pieceOf.set(start.id, piece);
        while (stack.length) {
          graph.forEachLinkedNode(stack.pop(), other => {
            if (pieceOf.has(other.id)) return;
            pieceOf.set(other.id, piece);
            stack.push(other.id);
          });
        }
        piece += 1;
      });
      const pieceOfBody = new Map();
      graph.forEachNode(node => {
        const body = layout.getBody(node.id);
        if (body) pieceOfBody.set(body, pieceOf.get(node.id));
      });
      const groupOf = new Int32Array(bodies.length);
      for (let i = 0; i < bodies.length; ++i) {
        const p = pieceOfBody.get(bodies[i]);
        groupOf[i] = p === undefined ? -1 - i : p; // unknown bodies push nobody
      }
      force = createPersonalSpaceForce(bodies, groupOf);
      charge = Float64Array.from(bodies, body => body.mass);
      knownCount = bodies.length;
    }
  }
};
