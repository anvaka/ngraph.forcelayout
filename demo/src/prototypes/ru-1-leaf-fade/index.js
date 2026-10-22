import addLeafFade from './leafFade.js';

// Leaves push only nearby nodes. See leafFade.js for the force itself.
export default {
  id: 'ru-1-leaf-fade',
  title: 'Leaf pushes fade (short reach)',
  author: 'ru-1 (Samarsky & Gulin reader)',
  description: `
<p>On graphs made of hubs with many leaves (starOfStars, megaStars), ngraph draws each hub as a
tight little disc far from the others, because every leaf of one hub pushes the next hub away at
any distance.</p>
<p>Here a push that involves a leaf (a node with one link, hanging off a node with more) fades
with distance: three quarters of its strength at one ideal spring length, a fifth at three, and
nothing beyond six; other pushes stay as they were.</p>
<p>Look for fans that open into sunbursts and fill the frame: on starOfStars the share of the frame
holding nodes goes from 0.13 to 0.43, while grid20, which has no leaves, keeps the stock layout
exactly.</p>
<p>From Samarsky &amp; Gulin, <i>Numerical Methods</i>, Part I §3–4: a nudge travels down a chain
of springs with no decay, unless every node is also tied to a fixed spot, and then it dies out
within a few nodes.</p>
<p>What gets worse: links cross about 2.5× more often on the star graphs, neighbouring fans
overlap in leafy trees (paTree3k: 0.07 → 0.30 crossings per link), graphs with many pieces (CSphd)
draw their main piece smaller, and each step costs about 1.6–2× stock. <i>Fade every push</i> = 1
packs the stars tighter, but trees and sheets stop unfolding (paTree3k: 0.85 crossings per link).
It works in 2D only. Its pushes always walk one quad tree, whichever Repulsion method is picked.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: grid20'],
  params: [
    {
      key: 'reach', label: 'Leaf reach', value: 1, step: '0.5',
      help: 'How far a leaf\'s push reaches, in ideal spring lengths. Smaller packs the hub fans ' +
        'closer together; just above 0, leaves push almost nothing. Larger moves back toward the ' +
        'stock layout. 0 turns the fade off (stock layout).'
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
    const remove = addLeafFade(layout, { reach, fadeAll });
    return { dispose: remove };
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
