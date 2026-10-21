// Short-range push: node repulsion fades out beyond a couple of spring lengths, the way neutral
// matter barely pushes at a distance (Feynman Lectures, Vol. I, ch. 2). Two bodies push with
//   F = G m1 m2 (1 + r/L) exp(-r/L) / r^2
// the exact force of the potential G m1 m2 exp(-r/L) / r: close up the usual 1/r^2 push, past a
// few L gone. The library compiles the law into both trees. (Skipping far cells with the law's
// `range` made a step slower, not faster: most of the work is with close cells anyway.)
export default {
  id: 'v1-1-short-range-push',
  title: 'Push fades fast with distance',
  author: 'v1-1 (Feynman Vol. I, ch. 1-6)',
  description: `
<p><b>The problem.</b> On graphs with big hubs, ngraph draws each star as a small, dense disc far
from the next one, and on graphs with many pieces the main piece shrinks while the small pieces
drift away.</p>
<p><b>The change.</b> Two nodes still push each other as usual when they are close, but the push
dies out beyond about <i>Push range</i> spring lengths, so a big group no longer shoves everything
away with its whole crowd. Neutral atoms behave this way: their plus and minus charges cancel, so
they barely feel each other until they come close (Feynman, <i>Lectures on Physics</i>, Vol. I,
chapter 2).</p>
<p><b>What to look for.</b> On starOfStars and megaStars the stars grow into large bursts that
nearly touch; on yeast the main piece takes about 40% of the frame instead of 10%, and the small
pieces stay close instead of drifting away; on sbm8x50 almost nothing changes.</p>
<p><b>What gets worse.</b> More edges cross where groups touch, and trees fold up and lose their
long trunk edges (binTree8, forest5k); <i>Push range</i> 4 brings part of the trunk back and clears
the crumpled corner grid20 can keep at 2. On yeast about three times as many nodes keep shaking
(15% to 44% of nodes moving at the speed limit). Each step takes about 1.6 times as long with the
quad tree and 2.5 times with the <i>dual tree</i> (one exp() per pair); it works in 3D too.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: yeast', 'Benchmark: sbm8x50'],
  params: [{
    key: 'range',
    label: 'Push range',
    value: 2,
    step: '0.5',
    help: 'How far the push reaches, in spring lengths. Small (2): stars and pieces pack tightly, ' +
      'trees lose their trunk. Large (4-8): closer to the stock layout. 0 or less turns the idea ' +
      'off: the stock push, with whichever Repulsion method is picked.'
  }],

  attach({ layout, params }) {
    const rangeInSprings = Math.max(0, Number(params.range) || 0);
    // 0 is the stock push, whatever Repulsion method the panel picked
    if (!(rangeInSprings > 0)) return null;
    const previousLaw = layout.simulator.repulsionLaw().spec;
    layout.simulator.repulsionLaw({
      force: '(1 + r / L) * exp(-r / L) / r^2',
      // Read every step, so it follows the spring length. Without fading (a spring length of 0,
      // or an infinite range) L is infinite and the law is the stock 1/r^2; a range too small to
      // divide by (e.g. 1e-320) leaves no push at all.
      params: { L: simulator => {
        const range = rangeInSprings * simulator.springLength();
        return range > 0 ? Math.max(range, 1e-300) : Infinity;
      } }
    });
    return { dispose() { layout.simulator.repulsionLaw(previousLaw); } };
  },
};
