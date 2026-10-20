import createPersonalSpaceForce from './createPersonalSpaceForce.js';

const FORCE_NAME = 'v1-5-personal-space';
// After the start delay, the push grows from zero to full strength over this many steps
const FADE_STEPS = 100;
// Largest swing (frequency times time step) a crowded body may have; the integrator becomes
// unstable at 2
const MAX_SWING = 1.4;

export default {
  id: 'v1-5-personal-space',
  title: 'Personal space within a piece',
  author: 'v1-5 (from Feynman, Lectures on Physics I, ch. 38)',
  description: `
<p>In ngraph's pictures a hub with many leaves turns into a solid ball or a tight rim of dots:
all its leaves crowd onto a few thin rings around it. The only thing that keeps nodes apart is a
long-range push, and next to a hub it loses to the springs as soon as many nodes share a small space.</p>
<p>This idea gives every node a little personal space. Two nodes of the same connected piece that
come closer than <i>Radius</i> spring lengths push each other apart, and the push grows quickly the
closer they get. Crowded nodes also move more slowly while they are crowded, so the strong push
does not make them shake; that changes how fast they settle, not where. Nodes with room to spare
feel nothing extra, so grids, trees and chains stay as they are.</p>
<p>It comes from Feynman's Lectures on Physics, Vol. 1, chapter 38 ("the size of an atom"): matter
has a size only because particles cannot all crowd into one spot; squeezing them into a space of
size r costs energy that grows like 1/r².</p>
<p>What to look for, compared with <b>none</b>: a few hundred steps in, the rings of leaves on
starOfStars and megaStars fill in and become sunbursts with visible spokes, and megaStars stops
trembling. On EVA, zoom into the hubs. grid20 should end up the same as with <b>none</b>.</p>
<p>What gets worse: more crossings around hubs, leaf fans in dense hairballs (erdos992) blur
together, and steps take about 1.1–1.3× as long. Starting the push right away
(<i>Start after</i> 0) can lock small knots into grids and trees that are still unfolding.</p>
`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: grid20'],
  params: [
    {
      key: 'radius', label: 'Radius', value: 0.8, step: '0.1',
      help: 'Personal space, in spring lengths: nodes of one piece that are closer push apart. Larger fills the stars more, but spreads leaves into neighbouring fans and adds crossings. 0 turns it off.'
    },
    {
      key: 'strength', label: 'Strength', value: 2, step: '0.5',
      help: 'Push at half the radius, in units of a spring stretched by one spring length. Larger opens dense rings more, but crowded parts settle more slowly.'
    },
    {
      key: 'delay', label: 'Start after', value: 400, step: '100',
      help: 'Steps to wait before the push starts (it then fades in over 100 steps). 0 starts it at once, which can freeze knots into grids and trees that are still unfolding.'
    }
  ],

  attach({ layout, graph, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return {}; // 2D only: does nothing in 3D or more

    const simulator = layout.simulator;
    const bodies = simulator.bodies;
    let force = null;
    let knownCount = -1;
    let stepCount = 0;
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
      const delay = Math.max(0, Number(params.delay) || 0);
      const fade = Math.min(1, (stepCount - delay) / FADE_STEPS);
      if (fade <= 0) return;

      if (bodies.length !== knownCount) rebuild();
      const s = simulator.settings; // read every step, so panel changes apply live
      const radius = Number(params.radius) * s.springLength;
      const strength = fade * Number(params.strength) * s.springCoefficient * s.springLength;
      force.apply(radius, strength, true);
      slowDownCrowdedBodies(s);
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
    // body still slows down at its usual rate. This changes how fast bodies move, not where
    // they come to rest: at rest all forces are zero, whatever the masses are.
    function slowDownCrowdedBodies(s) {
      const stiffness = force.stiffness;
      const dt = s.timeStep, springStiffness = 2 * s.springCoefficient;
      const useDrag = s.integrator !== 'fire';
      for (let i = 0; i < bodies.length; ++i) {
        const body = bodies[i];
        const k = stiffness[i] + springStiffness * body.springCount;
        const inertia = k * dt * dt / (MAX_SWING * MAX_SWING);
        if (inertia <= charge[i]) continue;
        if (useDrag) {
          const extra = s.dragCoefficient * (inertia / charge[i] - 1);
          body.force.x -= extra * body.velocity.x;
          body.force.y -= extra * body.velocity.y;
        }
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
