// A final step that spreads crowded parts of the drawing into empty space, like heat spreading
// through a plate, and carries the nodes along. See densityFlow.js for the method.
import createDensityFlow from './densityFlow.js';

// Flow steps per animation frame, so the viewer sees the drawing spread (about a second)
const STEPS_PER_FRAME = 2;

export default {
  id: 'ru-5-heat-spread',
  title: 'Heat-like spreading at the end',
  author: 'ru-5 (Samarsky & Gulin reader)',
  description: `
<p>In ngraph's pictures crowded spots sit next to empty space: a hub's leaves pile into a small
solid disc, or the main piece of the graph shrinks to a dot, while most of the frame stays empty.</p>
<p>Let the layout settle, then press the button below. Crowding spreads out the way heat spreads
through a metal plate, and every node is carried along with it. Packed areas grow into the empty
space around them and nearby nodes move together, so the drawing stretches without being shuffled.
Areas that are already evenly filled have nothing to push against and keep their shape.</p>
<p>The spreading is the heat equation, solved with the Fourier method and kept well-behaved by the
"maximum principle" (spreading heat never makes a new hot or cold spot), both from Samarsky &amp;
Gulin's <i>Numerical Methods</i>, the chapters on the maximum principle and on separation of
variables. Carrying nodes along with the spreading is Gastner and Newman's density-equalizing map.</p>
<p>Look at megaStars and starOfStars: solid star discs open into fans of spokes. On yeast the main
piece grows from a dot into a disc. A grid should keep its shape.</p>
<p>What gets worse: bigger fans reach the long edges between stars, so edges cross more (about twice
as many on starOfStars); tightly knit groups blend a little; sharp corners, like a grid's, round off a
bit; "Fill the frame" bends shapes towards a round outline. It changes the current picture once: press Run afterwards and the forces pull it
back. 2D only: in 3D the button doesn't appear.</p>`,
  tryGraphs: ['Benchmark: megaStars', 'Benchmark: starOfStars', 'Benchmark: yeast', 'Benchmark: grid20'],
  params: [
    {
      key: 'fill', label: 'Fill the frame', value: 0, step: '0.1',
      help: '0: only crowded spots spread; empty space counts as if it were as full as the drawing on ' +
        'average, so the outline barely moves. 1: empty space counts as nearly empty, so the whole ' +
        'drawing also grows into it until it fills most of the frame. Dense areas open more, but shapes ' +
        'bend towards a round outline. Values in between mix the two.',
    },
    {
      key: 'time', label: 'Spreading time', value: 1, step: '0.5',
      help: 'How long the heat spreads. At 1 the largest density differences fade to about a third. ' +
        'Bigger values make the density more even everywhere; smaller ones are a gentler touch. 0 does nothing.',
    },
  ],
  finishLabel: 'Spread the crowding like heat',

  attach({ layout, graph, params, settings }) {
    if (settings.dimensions && settings.dimensions !== 2) return {};
    let frame = 0;

    return {
      finish() {
        stop();
        const bodies = [];
        graph.forEachNode(node => { bodies.push(layout.getBody(node.id)); });
        const n = bodies.length;
        if (n < 2) return;
        const points = new Float64Array(2 * n);
        const movable = new Uint8Array(n);
        bodies.forEach((body, i) => {
          points[2 * i] = body.pos.x;
          points[2 * i + 1] = body.pos.y;
          movable[i] = body.isPinned ? 0 : 1;
        });
        const fill = Math.min(1, Math.max(0, params.fill));
        const flow = createDensityFlow(points, movable, {
          sea: 1 - 0.8 * fill,
          amount: Math.max(0, params.time),
        });

        const frameBefore = boundingBox(points);
        const anyPinned = movable.includes(0);

        const tick = () => {
          const done = flow.advance(STEPS_PER_FRAME);
          // The flow may push the outermost nodes a little past the old picture. Shrink the whole
          // drawing to the old bounding box, so it stays in view (skipped when nodes are pinned)
          const now = boundingBox(points);
          const scale = anyPinned ? 1 : Math.min(1, frameBefore.width / now.width, frameBefore.height / now.height);
          bodies.forEach((body, i) => {
            if (!movable[i]) return;
            body.pos.x = frameBefore.cx + (points[2 * i] - now.cx) * scale;
            body.pos.y = frameBefore.cy + (points[2 * i + 1] - now.cy) * scale;
            // The nodes were carried, not pushed: start from rest if the layout runs again
            body.velocity.x = 0;
            body.velocity.y = 0;
          });
          frame = done ? 0 : requestAnimationFrame(tick);
        };
        tick();
      },
      dispose: stop,
    };

    function stop() {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }
  },
};

function boundingBox(points) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < points.length; i += 2) {
    if (points[i] < x0) x0 = points[i];
    if (points[i] > x1) x1 = points[i];
    if (points[i + 1] < y0) y0 = points[i + 1];
    if (points[i + 1] > y1) y1 = points[i + 1];
  }
  return {
    cx: (x0 + x1) / 2, cy: (y0 + y1) / 2,
    width: Math.max(x1 - x0, 1e-9), height: Math.max(y1 - y0, 1e-9),
  };
}
