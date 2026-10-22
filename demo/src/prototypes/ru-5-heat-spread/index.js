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
solid disc, and on yeast the main piece shrinks to a dot in a mostly empty frame.</p>
<p>Let the layout settle, then press the button below (2D only: in 3D it doesn't appear): the crowding
spreads out the way heat spreads through a metal plate and carries the nodes along, so packed areas
grow into empty space while nearby nodes move together and keep their order.</p>
<p>The spreading is the heat equation, solved with the Fourier method so that it never makes a new
crowded or empty spot (Samarsky &amp; Gulin, <i>Numerical Methods</i>, the chapters on the maximum
principle and on separation of variables); carrying the nodes along is Gastner and Newman's
density-equalizing map.</p>
<p>Unlike the round-2 lab version, which added the drawing's average density everywhere, empty space
is set to that average, and the density is first blurred over about two grid cells: a grid keeps its
outline better, but the push is stronger (starOfStars crossings ×1.9 instead of ×1.3). At the end the
whole picture is shrunk evenly back into its old frame, so it stays in view, and the nodes are left
at rest.</p>
<p>Look at megaStars and starOfStars, where the big star discs grow to about twice their size and show
their spokes, and at yeast, whose main piece grows from a tenth to over a quarter of the frame; grid20
barely changes.</p>
<p>What gets worse: edge crossings on starOfStars nearly double, small side pieces (on yeast) shrink and
the smallest stars don't open, groups blend a little, a grid's corners round off, "Fill the frame"
bends shapes towards a round outline, and the change lasts only until you press Run: the forces pull
most of it back within about 200 steps.</p>`,
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
      help: 'How long the heat spreads. At 1 the broadest density differences, across the whole drawing, ' +
        'fade to about a third; smaller ones fade more. Bigger values make the density more even everywhere; ' +
        'smaller ones are a gentler touch. 0 does nothing. The spreading stops after at most 400 flow steps.',
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
        // A missing or NaN parameter falls back to its default (NaN would turn every position into NaN)
        const fill = Math.min(1, Math.max(0, orDefault(params.fill, 0)));
        const flow = createDensityFlow(points, movable, {
          sea: 1 - 0.8 * fill,
          amount: Math.max(0, orDefault(params.time, 1)),
        });

        const frameBefore = boundingBox(points);
        const anyPinned = movable.includes(0);

        const tick = () => {
          const done = flow.advance(STEPS_PER_FRAME);
          // The flow may push the outermost nodes a little past the old picture. Shrink the whole
          // drawing evenly to the old bounding box and centre it there, so it stays in view. Both
          // are skipped when nodes are pinned: the others stay where the flow put them, next to the
          // pinned ones
          const now = anyPinned ? frameBefore : boundingBox(points);
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

function orDefault(value, fallback) {
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
}

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
