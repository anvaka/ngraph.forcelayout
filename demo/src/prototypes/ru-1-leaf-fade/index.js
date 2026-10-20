import createLeafFadeForce from './leafFadeForce.js';

// Leaves push only nearby nodes. See leafFadeForce.js for the force itself.
export default {
  id: 'ru-1-leaf-fade',
  title: 'Leaf pushes fade (short reach)',
  author: 'ru-1 (Samarsky & Gulin reader)',
  description: `
<p>On graphs made of hubs with many leaves (starOfStars, megaStars), ngraph draws each hub as a
tight little disc far from the others, so most of the picture is empty.</p>
<p>The reason: every node pushes every other node away at any distance. All the leaves of one hub
push the next hub's fan, so the bigger the fans, the wider the gaps.</p>
<p>Here a push that involves a leaf (a node with one link, hanging off a node with more) fades
with distance: three quarters of its strength at one link length, a fifth at three, nothing
beyond six. Pushes between other nodes stay as they were.</p>
<p>Look for fans that open into wide sunbursts and sit next to each other, filling the frame.
Graphs without leaves (grid20) keep the stock layout exactly.</p>
<p>From Samarsky &amp; Gulin, <i>Numerical Methods</i>, Part I §3–4: a nudge travels down a chain
of springs with no decay, unless every node is also held by its own spring to a fixed spot; then
it dies out within a few nodes (a "screened" push).</p>
<p>What gets worse: in leafy trees (paTree3k) the fans of neighbouring branches overlap, and
graphs with many pieces (CSphd, EVA) show their main piece smaller. <i>Fade every push</i> = 1
packs the stars even more tightly, but trees and grids then stop unfolding (try paTree3k,
rgg1500).</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: grid20'],
  params: [
    {
      key: 'reach', label: 'Leaf reach', value: 1, step: '0.5',
      help: 'How far a leaf\'s push reaches, in link lengths. Smaller packs the hub fans closer ' +
        'together. Larger moves back toward the stock layout. 0 turns the fade off.'
    },
    {
      key: 'fadeAll', label: 'Fade every push', value: 0, step: '1',
      help: '0: only pushes that involve a leaf fade. 1: every push fades. Stars pack even more ' +
        'tightly, but trees and sheets lose the long-reach push that unfolds them.'
    },
  ],

  attach({ layout, graph, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null; // 2D only; other dimensions keep the stock layout
    const reach = Number(params.reach);
    if (!(reach > 0)) return null;
    const fadeAll = Number(params.fadeAll) > 0;
    // Without leaves there is nothing to fade: keep the stock force, so the layout is identical
    if (!fadeAll && !hasLeaves(graph)) return null;
    const simulator = layout.simulator;
    const force = createLeafFadeForce(simulator, { reach, fadeAll });
    // Our push replaces the library's n-body force. Springs must still run after it, because the
    // n-body pass is the one that clears last step's forces.
    const springForce = simulator.getForces().get('spring');
    simulator.removeForce('nbody');
    simulator.removeForce('spring');
    simulator.addForce('ru1-leaf-fade', force.update);
    simulator.addForce('spring', springForce);
    return {};
  },
};

// A leaf is a node with one link, hanging off a node with more links
function hasLeaves(graph) {
  let found = false;
  graph.forEachNode(node => {
    const links = linksOf(graph, node.id);
    if (links.length !== 1) return;
    const other = links[0].fromId === node.id ? links[0].toId : links[0].fromId;
    if (linksOf(graph, other).length > 1) { found = true; return true; }
  });
  return found;
}

// ngraph.graph 20 returns a Set, older versions an array
function linksOf(graph, id) {
  const links = graph.getLinks(id);
  return links ? Array.from(links) : [];
}
