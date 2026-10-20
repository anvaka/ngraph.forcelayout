// Magnetic domains decide who repels whom (reader v2-5, Feynman Lectures Vol. 2, Ch. 35-36).
// 1. Once per layout: every node gets a small arrow; arrows turn toward their neighbors' average
//    until they settle into domains (domains.js).
// 2. Every step: nodes whose arrows disagree push each other harder (domainRepulsion.js).
// A gate leaves graphs without dense groups alone: grids, meshes and trees (no sharp walls
// between domains), random graphs (domains no better than chance) and tree-like graphs.
import { computeDomains, describeDomains } from './domains.js';
import createDomainRepulsion from './domainRepulsion.js';

export default {
  id: 'v2-5-magnetic-domains',
  title: 'Magnetic domains decide who repels',
  author: 'reader v2-5 (Feynman Vol. 2, Ch. 35-36)',
  description: `
<p>On graphs made of groups, like <i>communities</i> or <i>sbm8x50</i>, ngraph draws one even
blob: the groups touch and you can't tell where one ends.</p>
<p>This idea first lets nodes vote with their neighbors. Every node holds a little arrow, like a
compass needle, and keeps turning it toward the average arrow of its neighbors, while a weak pull
stops the whole graph from agreeing on one direction. After a few hundred rounds the arrows settle
into patches that point the same way, called <b>domains</b>, and on these graphs the domains are the
groups. Then two nodes whose arrows disagree push each other up to 11 times harder than before.</p>
<p>It comes from the physics of magnets (Feynman Lectures, Vol. 2, Ch. 35 and 36): neighboring atoms
in iron line up their tiny magnets, and below a critical temperature the metal splits into domains.</p>
<p>Look for separate clusters with open space between them, where <b>none</b> shows one disc. What gets
worse: edge crossings don't go down, edges between groups get longer, and loosely grouped graphs
like Miserables get stretched. Grids, trees, random and tree-like graphs are recognized and left
unchanged (try <i>grid20</i>) unless you set <i>Auto-off</i> to 0. 2D only: with 3 or more dimensions
it does nothing. The browser console says whether it switched on and why.</p>`,
  tryGraphs: ['Benchmark: communities', 'Benchmark: sbm8x50', 'Groups 8x250 (2k)', 'Benchmark: grid20'],
  params: [
    {
      key: 'boost', label: 'Push between groups', value: 10, step: '1',
      help: 'How much harder two nodes in different domains push apart: up to 1 + this times the normal push. 0 turns the idea off. 10 is the tested default; more separates groups further but stretches loosely grouped graphs.'
    },
    {
      key: 'temperature', label: 'Temperature', value: 0.3, step: '0.1',
      help: 'How firmly nodes settle into domains. Low (0.1-0.5): firm domains. Around 0.8 and above the arrows stay random (the "Curie point" of a magnet), no domains form and nothing changes.'
    },
    {
      key: 'autoOff', label: 'Auto-off', value: 1, step: '1',
      help: '1: skip graphs without dense groups (grids, meshes, trees, random graphs, graphs with fewer than 1.5 links per node). 0: always apply, to see what it does to a grid (it warps).'
    }
  ],

  attach({ layout, graph, params, settings }) {
    const boost = Number(params.boost);
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
    const ms = Math.round(performance.now() - started);
    // Auto-off: only graphs made of dense groups. Grids, meshes and most trees have no sharp walls
    // (arrows turn slowly from place to place); random graphs have walls but their domains are no
    // better than chance; tree-like graphs (fewer than 1.5 links per node) have nothing dense to
    // pull apart, and pushing their branches apart only adds empty space.
    const sharpWalls = about.wallShare >= 0.01;
    const realGroups = about.modularity >= 0.5;
    const dense = about.links >= 1.5 * bodies.length;
    const summary = `${about.domainCount} domains, ${(100 * about.wallShare).toFixed(1)}% of links cross a wall, ` +
      `modularity ${about.modularity.toFixed(2)}, ${(about.links / bodies.length).toFixed(1)} links per node ` +
      `(${rounds} rounds, ${ms} ms)`;
    if (Number(params.autoOff) !== 0 && !(sharpWalls && realGroups && dense)) {
      const why = !sharpWalls ? 'no sharp walls between domains (grid, mesh or tree)'
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
    return {
      dispose() {
        simulator.removeForce(forceName);
      }
    };
  }
};
