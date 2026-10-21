// Magnetic domains decide who repels whom (reader v2-5, Feynman Lectures Vol. 2, Ch. 35-36).
// 1. Once per layout: every node gets a small arrow; arrows turn toward their neighbors' average
//    until they settle into domains (domains.js).
// 2. Every step: nodes whose arrows disagree push each other harder (domainRepulsion.js).
// A gate leaves graphs without dense groups alone: grids, meshes and trees (no sharp walls
// between domains), random graphs (domains no better than chance) and tree-like graphs. It also
// stays off when the temperature is too high for domains to form.
import { computeDomains, describeDomains, arrowGroups } from './domains.js';
import createDomainRepulsion from './domainRepulsion.js';

// Node colors by domain, largest domain first, then cycling
const PALETTE = [0xf28e2bff, 0xe15759ff, 0xedc948ff, 0x59a14fff, 0xff9da7ff, 0xb07aa1ff, 0x76b7b2ff, 0xffffffff, 0x9c755fff, 0xbab0acff];

export default {
  id: 'v2-5-magnetic-domains',
  title: 'Magnetic domains decide who repels',
  author: 'reader v2-5 (Feynman Vol. 2, Ch. 35-36)',
  description: `
<p>On graphs made of groups, like <i>communities</i> or <i>sbm8x50</i>, ngraph draws one even
disc where the groups touch.</p>
<p>Here every node holds a little arrow, like a compass needle, and keeps turning it toward its
neighbors' average until patches of nodes point the same way: <b>domains</b>, as in a magnet
(Feynman Lectures, Vol. 2, Ch. 35-36). Then nodes in different domains push each other about 7 times
harder than before (at most 11), nodes in one domain about 1.2 times, and the colors show the
domains.</p>
<p>Look for separate clusters with open space between them; on <i>sbm8x50</i> the domains only
partly match the real groups.</p>
<p>What gets worse: edges between groups get longer, crossings rise on <i>communities</i> and
<i>Miserables</i>, and <i>Miserables</i> gets stretched. Each step takes about 2 times as long, or 6
times with Repulsion = dual tree, because the extra push ignores that setting and always uses its
own, slightly less exact tree.</p>
<p>Grids, trees, random graphs, and temperatures where no domains form are left unchanged in the
default color (try <i>grid20</i>, or set <i>Auto-off</i> to 0); with 3 or more dimensions it does
nothing, and the browser console says why.</p>`,
  tryGraphs: ['Benchmark: communities', 'Benchmark: sbm8x50', 'Groups 8x250 (2k)', 'Benchmark: grid20'],
  params: [
    {
      key: 'boost', label: 'Push between groups', value: 10, step: '1',
      help: 'How much harder two nodes in different domains push apart: up to 1 + this times the normal push (about 7 times at 10). 0 or less turns the idea off. 10 is the tested default; more separates groups further but stretches loosely grouped graphs. Values above 1000 count as 1000.'
    },
    {
      key: 'temperature', label: 'Temperature', value: 0.3, step: '0.1',
      help: 'How firmly nodes settle into domains. 0 or less: every arrow at full length, the firmest domains. 0.1-0.5: firm domains. Near 0.8 the domains get weak and links get longer. From about 0.9 the arrows shrink to nothing (the "Curie point" of a magnet), no domains form, and Auto-off leaves the layout unchanged.'
    },
    {
      key: 'autoOff', label: 'Auto-off', value: 1, step: '1',
      help: '1: skip graphs without dense groups (grids, meshes, trees, random graphs, graphs with fewer than 1.5 links per node) and temperatures where no domains form. 0: always apply, to see what it does to a grid (it warps). Any value other than 0 counts as 1.'
    }
  ],

  attach({ layout, graph, params, settings }) {
    // Capped: far above 1000 the forces overflow to infinity and the layout breaks
    const boost = Math.min(1000, Number(params.boost));
    if (!(boost > 0)) return {};
    if ((settings.dimensions || 2) !== 2) {
      console.info('[magnetic domains] 2D only; doing nothing for dimensions =', settings.dimensions);
      return {};
    }

    const bodies = [];
    const index = new Map();
    graph.forEachNode(node => {
      const body = layout.getBody(node.id);
      if (!body) return;
      index.set(node.id, bodies.length);
      bodies.push(body);
    });
    if (bodies.length < 3) return {};
    const neighbors = bodies.map(() => []);
    graph.forEachLink(link => {
      const a = index.get(link.fromId), b = index.get(link.toId);
      if (a === undefined || b === undefined || a === b) return;
      neighbors[a].push(b);
      neighbors[b].push(a);
    });

    const started = performance.now();
    const { spins, rounds } = computeDomains(bodies.length, neighbors, { temperature: Number(params.temperature) });
    const about = describeDomains(bodies.length, neighbors, spins);
    // Domains as the colors show them
    const groups = arrowGroups(bodies.length, spins);
    const ms = Math.round(performance.now() - started);
    // Auto-off: only graphs made of dense groups. Grids, meshes and most trees have no sharp walls
    // (arrows turn slowly from place to place); random graphs have walls but their domains are no
    // better than chance; tree-like graphs (fewer than 1.5 links per node) have nothing dense to
    // pull apart, and pushing their branches apart only adds empty space.
    const sharpWalls = about.wallShare >= 0.01;
    const realGroups = about.modularity >= 0.5;
    const dense = about.links >= 1.5 * bodies.length;
    // Above the Curie point the arrows shrink toward 0, but their directions still follow the
    // graph, so walls and modularity alone can't tell
    const ordered = about.magnitude >= 0.1;
    const summary = `${new Set(groups).size} domains, ${(100 * about.wallShare).toFixed(1)}% of links cross a wall, ` +
      `modularity ${about.modularity.toFixed(2)}, ${(about.links / bodies.length).toFixed(1)} links per node ` +
      `(${rounds} rounds, ${ms} ms)`;
    if (Number(params.autoOff) !== 0 && !(ordered && sharpWalls && realGroups && dense)) {
      const why = !ordered ? 'no domains formed (temperature above the Curie point)'
        : !sharpWalls ? 'no sharp walls between domains (grid, mesh or tree)'
        : !realGroups ? 'domains no better than in a random graph' : 'tree-like graph, nothing dense to separate';
      console.info(`[magnetic domains] off: ${why}. ${summary}`);
      return {};
    }
    console.info(`[magnetic domains] on: ${summary}`);

    const simulator = layout.simulator;
    const repulsion = createDomainRepulsion(bodies, spins, {
      boost,
      getTheta: () => simulator.theta(),
      getGravity: () => simulator.gravity()
    });
    const forceName = 'v2-5-domain-repulsion';
    simulator.addForce(forceName, repulsion.apply);

    // The domains are final from the start (computed above), so colors don't change while it runs
    const size = new Map();
    for (const label of groups) size.set(label, (size.get(label) || 0) + 1);
    const colorOfLabel = new Map([...size.keys()]
      .sort((a, b) => size.get(b) - size.get(a) || a - b)
      .map((label, rank) => [label, PALETTE[rank % PALETTE.length]]));
    const colorOfNode = new Map();
    index.forEach((i, nodeId) => colorOfNode.set(nodeId, colorOfLabel.get(groups[i])));

    return {
      nodeColor(nodeId) {
        return colorOfNode.get(nodeId) || 0;
      },
      dispose() {
        simulator.removeForce(forceName);
      }
    };
  }
};
