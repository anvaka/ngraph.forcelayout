// Prototype: "Smooth each group at the end" (ru-2). A one-off final step, no forces are added.
import { findGroupBand, smoothGroups } from './smooth.js';

const MIN_PIECE = 30;

export default {
  id: 'ru-2-group-smoothing',
  title: 'Smooth each group at the end',
  author: 'ru-2 (Samarsky & Gulin reader)',
  description: `
<p><b>Problem.</b> On graphs made of groups (many links inside a group, few between groups)
ngraph spreads every node evenly over one disc, so the groups blur together. ForceAtlas2 draws
the same graphs as separate lumps, and blind judges scored it 9 against ngraph's 5.</p>
<p><b>What this does.</b> When you press <i>Smooth groups</i>, every node moves part of the way
toward the average position of its neighbours, a few times. Nodes inside a group share most of
their neighbours, so the group pulls together, while the groups stay where they are (the weighted
centre of each piece does not move). Leaves move with their hub instead of landing on it.</p>
<p><b>Checks.</b> First it tests whether the graph really has groups. It computes the graph's
<i>spectrum</i>, the list of "patterns" a graph can hold, from smooth whole-group ones to
node-against-neighbour ones, and looks for a clear jump between the two kinds. Then it averages only
until the picture's inner scatter is down to the <i>Detail left</i> share. Graphs without groups,
and drawings whose groups are already apart, are left exactly as they are.</p>
<p><b>Where it comes from.</b> Samarsky &amp; Gulin, "Numerical Methods", part II ch. 2. Their
iterative solvers shrink errors with exactly this kind of averaging step, and they show how to pick
the step so that one band of patterns shrinks as much as possible while the smoothest ones survive
(§4-§5). Here the "error" being shrunk is the scatter inside each group.</p>
<p><b>Look for.</b> Let the layout settle (about 1000 steps), then press <i>Smooth groups</i>: on
sbm8x50 or communities the groups become separate lumps around a hollow centre. On grid20 (no
groups) and cliqueCircle (groups already apart) nothing changes. Set <i>Checks</i> to 0 on
cliqueCircle to see what the checks prevent.</p>
<p><b>Gets worse.</b> Nodes inside a lump sit closer together (more overlap), leaves look like long
spokes, and edge-length fidelity (stress) drops by 5-15%. It is a display step: resume the layout
and the forces spread the groups out again.</p>`,
  tryGraphs: ['Benchmark: sbm8x50', 'Benchmark: communities', 'Benchmark: grid20', 'Benchmark: cliqueCircle'],
  params: [
    { key: 'target', label: 'Detail left', value: 0.15, step: '0.01',
      help: 'How much scatter inside groups to keep, relative to the spread between groups. Lower pulls groups tighter (more overlap). ForceAtlas2 pictures sit near 0.14-0.17, ngraph\'s near 0.21-0.28.' },
    { key: 'maxPasses', label: 'Most passes', value: 4, step: '1',
      help: 'Upper limit on the number of averaging passes. One pass is one sweep over the links.' },
    { key: 'checks', label: 'Checks on (1) / off (0)', value: 1, step: '1',
      help: 'With 0 the passes run even where the checks refuse: on cliqueCircle each clique collapses into a dot, which is why the checks exist.' },
  ],
  finishLabel: 'Smooth groups',

  attach({ layout, graph, params }) {
    return {
      finish() {
        smoothLayout(layout, graph, {
          target: Number(params.target) > 0 ? Number(params.target) : 0.15,
          maxPasses: Math.max(1, Math.round(Number(params.maxPasses) || 4)),
          checks: Number(params.checks) !== 0,
        });
      },
    };
  },
};

function smoothLayout(layout, graph, { target, maxPasses, checks }) {
  const ids = [];
  graph.forEachNode(node => { ids.push(node.id); });
  if (ids.length === 0) return;
  const index = new Map(ids.map((id, i) => [id, i]));
  const neighbors = ids.map(() => []);
  graph.forEachLink(link => {
    const a = index.get(link.fromId), b = index.get(link.toId);
    if (a === undefined || b === undefined || a === b) return;
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
    piece.forEach((g, i) => {
      const id = ids[g];
      layout.setNodePosition(id, ...axes.map((name, a) => result.x[a][i]));
      const body = layout.getBody(id);
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
