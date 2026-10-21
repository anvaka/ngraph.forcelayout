// Prototype: "Smooth each group at the end" (ru-2). A one-off final step, no forces are added.
import { findGroupBand, smoothGroups } from './smooth.js';

const MIN_PIECE = 30;
const MAX_PASSES = 50;

export default {
  id: 'ru-2-group-smoothing',
  title: 'Smooth each group at the end',
  author: 'ru-2 (Samarsky & Gulin reader)',
  description: `
<p><b>Problem.</b> On graphs made of groups (many links inside a group, few between groups),
ngraph spreads all nodes evenly over one disc, so the groups blur together.</p>
<p><b>What it does.</b> Press <i>Smooth groups</i> once the layout has settled: every node moves
part of the way to its neighbours' average, a few times, so each group pulls into a lump. Leaves
move with their hub instead, pieces under 30 nodes are skipped, and moved nodes get their speed
reset to zero.</p>
<p><b>Checks.</b> It acts only where the graph's patterns show a clear jump between whole-group
shapes and node-against-neighbour ones, and only until the scatter inside groups is down to
<i>Detail left</i>. Graphs without groups, such as grids and random graphs, fail the first check;
some trees and star-shaped graphs pass it but fail the second, as do drawings whose groups are
already apart, so all of these stay exactly as they are.</p>
<p><b>Where it comes from.</b> Samarsky &amp; Gulin, "Numerical Methods", part II ch. 2 §4: the
best single step of an iterative solver, which shrinks one band of patterns while the smoothest
ones survive, here repeated.</p>
<p><b>Look for.</b> After about 1000 steps, on sbm8x50 and communities the groups become separate
lumps (often one in the middle), grid20 and cliqueCircle don't change, and <i>Checks</i> 0 on
cliqueCircle shows what the checks prevent. It works the same in 3D and with every Repulsion
setting.</p>
<p><b>Gets worse.</b> The whole drawing shrinks (on communities links get about 2.4 times shorter),
45-63% of nodes sit almost on top of another one, leaves stick out as long spokes, and link lengths
follow the graph's distances 7-16% less well. Resume the layout and the forces undo it; on the
100k-node graph the button takes about 3 seconds.</p>`,
  tryGraphs: ['Benchmark: sbm8x50', 'Benchmark: communities', 'Benchmark: grid20', 'Benchmark: cliqueCircle'],
  params: [
    { key: 'target', label: 'Detail left', value: 0.15, step: '0.01',
      help: 'How much scatter inside groups to keep, relative to the spread between groups. Lower pulls groups tighter, with more overlap. Settled demo drawings start near 0.22 (sbm8x50) and 0.25 (communities); 0.15 is about where ForceAtlas2\'s drawings of these graphs sit. Values well below 0.15 may not be reached within Most passes (0.10 stops at 0.12 on sbm8x50 and 0.145 on communities), and each extra pass shrinks the whole drawing, groups included. 0 keeps averaging up to Most passes.' },
    { key: 'maxPasses', label: 'Most passes', value: 4, step: '1',
      help: 'Upper limit on the number of averaging passes, at most 50. One pass is one sweep over the links. 0 turns the smoothing off.' },
    { key: 'checks', label: 'Checks on (1) / off (0)', value: 1, step: '1',
      help: 'With 0 both checks are skipped and all Most passes run in full, ignoring Detail left (where the graph shows no jump, a typical one is assumed). On cliqueCircle each clique then collapses into a dot, which is why the checks exist.' },
  ],
  finishLabel: 'Smooth groups',

  attach({ layout, graph, params }) {
    return {
      finish() {
        smoothLayout(layout, graph, {
          target: Math.max(0, finiteOr(params.target, 0.15)),
          maxPasses: Math.min(MAX_PASSES, Math.max(0, Math.round(finiteOr(params.maxPasses, 4)))),
          checks: Number(params.checks) !== 0,
        });
      },
    };
  },
};

function finiteOr(value, fallback) {
  const v = Number(value);
  return Number.isFinite(v) ? v : fallback;
}

function smoothLayout(layout, graph, { target, maxPasses, checks }) {
  const ids = [];
  graph.forEachNode(node => { ids.push(node.id); });
  if (ids.length === 0) return;
  const index = new Map(ids.map((id, i) => [id, i]));
  const neighbors = ids.map(() => []);
  const pairs = new Set();
  graph.forEachLink(link => {
    const a = index.get(link.fromId), b = index.get(link.toId);
    if (a === undefined || b === undefined || a === b) return;
    // a -> b and b -> a are one neighbour, so a leaf linked both ways is still a leaf
    const pair = a < b ? a * ids.length + b : b * ids.length + a;
    if (pairs.has(pair)) return;
    pairs.add(pair);
    neighbors[a].push(b);
    neighbors[b].push(a);
  });
  const axes = Object.keys(layout.getNodePosition(ids[0]));
  const start = performance.now();
  const report = [];

  for (const piece of connectedPieces(neighbors)) {
    if (piece.length < MIN_PIECE) continue;
    const local = new Map(piece.map((g, i) => [g, i]));
    const nb = piece.map(g => neighbors[g].map(h => local.get(h)));
    let band = findGroupBand(nb);
    if (!band) {
      if (checks) { report.push({ nodes: piece.length, result: 'no group scale, left alone' }); continue; }
      band = { low: 0.3, high: 2 }; // checks off: a typical band, for comparison only
    }
    const x = axes.map(name => Float64Array.from(piece, g => layout.getNodePosition(ids[g])[name] || 0));
    const result = smoothGroups(x, nb, band, { target, maxPasses, ignoreTarget: !checks });
    if (result.passes > 0) piece.forEach((g, i) => {
      const id = ids[g];
      const body = layout.getBody(id);
      if (body && body.isPinned) return; // pinned nodes stay put
      layout.setNodePosition(id, ...axes.map((name, a) => result.x[a][i]));
      // the smoothed drawing is not a resting state: start from rest if the layout is resumed
      if (body) axes.forEach(name => { if (name in body.velocity) body.velocity[name] = 0; });
    });
    report.push({ nodes: piece.length, groups: band.groups, band: [band.low, band.high].map(v => +v.toFixed(3)),
      detailBefore: +result.before.toFixed(3), detailAfter: +result.after.toFixed(3), passes: +result.passes.toFixed(2) });
  }
  // eslint-disable-next-line no-console
  console.info('Smooth each group:', (performance.now() - start).toFixed(0) + ' ms', report);
}

// Connected pieces, as lists of node indices
function connectedPieces(neighbors) {
  const seen = new Uint8Array(neighbors.length);
  const pieces = [];
  for (let s = 0; s < neighbors.length; s++) {
    if (seen[s]) continue;
    const piece = [s];
    seen[s] = 1;
    for (let k = 0; k < piece.length; k++) {
      for (const t of neighbors[piece[k]]) if (!seen[t]) { seen[t] = 1; piece.push(t); }
    }
    pieces.push(piece);
  }
  return pieces;
}
