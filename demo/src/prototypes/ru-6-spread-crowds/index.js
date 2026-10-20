// "Spread crowded areas at the end": a one-off final step that lets crowded parts of the finished
// picture spread out inside its own frame. The physics is in densityFlow.js.
import createDensityFlow from './densityFlow.js';

export default {
  id: 'ru-6-spread-crowds',
  title: 'Spread crowded areas at the end',
  author: 'ru-6 (Samarskii & Gulin, ch. 5 reader)',
  description: `
<p>In ngraph's pictures the details are drawn tiny. A star's leaves sit in a small dark disc,
and on graphs with many separate pieces the main part is a small ball in a mostly empty frame.</p>
<p>This final step keeps the frame fixed and lets crowded places spread out, the way a gas moves
from high pressure to low. Only places more than twice as crowded as the average push outward,
so the gaps between groups stay. The picture is stretched smoothly, like a rubber sheet, so no node
changes its neighbours, and small separate pieces move as a whole.</p>
<p>The "pressure" is the solution of Poisson's equation in a rectangle, solved directly with the
sweep method from Samarskii and Gulin, «Численные методы», chapter 5.</p>
<p>Let the layout settle, then press the button below: stars open into fans and the central ball
fills the frame. Community graphs and grids barely change.</p>
<p>What gets worse: edges are no longer of equal length, fans touching the frame get flattened, and
thousands of tiny pieces (EVA) get herded together. Running the layout again pulls the stars back
into discs. 2D only: in 3D there is no button.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: sciMet', 'Benchmark: erdos992', 'Benchmark: communities'],
  params: [
    {
      key: 'crowding', label: 'Push above (× average)', value: 2, step: '0.5',
      help: 'Only places more crowded than this many times the average push outward. 1 evens out the ' +
        'whole picture, which also fills the gaps between communities; 3 or more opens only the worst clumps.'
    },
    {
      key: 'passes', label: 'Passes', value: 40, step: '10',
      help: 'How far the spreading goes. In one pass no node moves more than one grid cell. ' +
        'More passes open the fans further but flatten the ones that reach the frame.'
    },
    {
      key: 'rigidBelow', label: 'Rigid pieces under', value: 30, step: '10',
      help: 'Separate pieces with fewer nodes than this move as a whole and keep their shape. ' +
        '0 lets every piece stretch: caterpillar legs open more, but tiny pieces get squashed against the frame.'
    }
  ],
  finishLabel: 'Spread crowded areas',

  attach({ layout, graph, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return {}; // 2D only: no final-step button
    let frameHandle = 0;

    return { finish, dispose };

    function finish() {
      if (frameHandle) return; // already spreading
      const bodies = [], index = new Map();
      layout.forEachBody((body, nodeId) => {
        index.set(nodeId, bodies.length);
        bodies.push(body);
      });
      const n = bodies.length;
      if (n < 2) return;
      const xs = new Float64Array(n), ys = new Float64Array(n), movable = new Uint8Array(n);
      for (let i = 0; i < n; i++) {
        xs[i] = bodies[i].pos.x;
        ys[i] = bodies[i].pos.y;
        movable[i] = bodies[i].isPinned ? 0 : 1;
      }
      const { piece, pieceSize } = findPieces(graph, index, n);
      const flow = createDensityFlow(xs, ys, {
        crowding: Number(params.crowding),
        passes: Number(params.passes),
        rigidBelow: Number(params.rigidBelow),
        movable, piece, pieceSize
      });

      // Animate: a few passes per frame, about 12 ms of work, so the viewer sees the picture open
      frameHandle = requestAnimationFrame(animate);
      function animate() {
        const start = performance.now();
        let finished;
        do finished = flow.step(); while (!finished && performance.now() - start < 12);
        for (let i = 0; i < n; i++) {
          if (!movable[i]) continue;
          const body = bodies[i];
          body.pos.x = xs[i];
          body.pos.y = ys[i];
          // forget the momentum, so resuming the layout doesn't throw nodes around
          body.velocity.x = 0;
          body.velocity.y = 0;
        }
        frameHandle = finished ? 0 : requestAnimationFrame(animate);
      }
    }

    function dispose() {
      if (frameHandle) cancelAnimationFrame(frameHandle);
      frameHandle = 0;
    }
  },
};

// Connected pieces of the graph: piece id per body index, and the size of every piece
function findPieces(graph, index, n) {
  const piece = new Int32Array(n).fill(-1);
  const sizes = [];
  const ids = new Array(n);
  index.forEach((i, nodeId) => { ids[i] = nodeId; });
  const queue = new Int32Array(n);
  for (let s = 0; s < n; s++) {
    if (piece[s] >= 0) continue;
    const c = sizes.length;
    let head = 0, tail = 0;
    queue[tail++] = s;
    piece[s] = c;
    while (head < tail) {
      const u = queue[head++];
      graph.forEachLinkedNode(ids[u], other => {
        const v = index.get(other.id);
        if (v !== undefined && piece[v] < 0) { piece[v] = c; queue[tail++] = v; }
      });
    }
    sizes.push(tail);
  }
  return { piece, pieceSize: Int32Array.from(sizes) };
}
