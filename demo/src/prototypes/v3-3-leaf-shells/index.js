import computeShells from './computeShells.js';

// Leaves fill rings (stability rule). A hub's leaves sit in rings at growing distances, each
// ring holding no more leaves than a lone ring can without buckling; the hub's other links start
// outside its rings. Only link rest lengths change: when the layout starts, and again when the
// panel changes spring length, stiffness or gravity.
export default {
  id: 'v3-3-leaf-shells',
  title: 'Leaves fill rings (stability rule)',
  author: 'v3-3 (Feynman Vol. 3, ch. 13 and 15)',
  description: `
<p>On star-like graphs ngraph piles each hub's leaves (nodes with a single link) into a dense ball.</p>
<p>Leaves on one ring around their hub push each other apart; closer than about half a link, the ring buckles (every other leaf slides in or out) and crumples into a disk.</p>
<p>Here each hub with more than about 11 leaves gets several rings at growing distances, like the shells of an atom, each holding no more leaves than a lone ring can without buckling. The hub's other links start outside its rings, and only link lengths change.</p>
<p>From Feynman's Lectures, Vol. 3: ch. 13 and 15 (waves on a ring of atoms, where the zigzag gives way first) and ch. 15-6 (electrons filling shells).</p>
<p>Look for sunbursts with visible rays instead of balls: the share of the screen in use doubles on starOfStars and grows 1.7× on megaStars. Compare with <b>none</b>, or with the sibling "Fermi fans" (v3-1), where you set the gap yourself.</p>
<p>Worse: big stars make the drawing larger, so the rest looks smaller (EVA); links between stars cross more (starOfStars 0.13 → 0.20 crossings per link, EVA 8–26% more); hubs that also have many other links (hubLeaves5k) barely change; and in 3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: caterpillars'],
  params: [
    {
      key: 'spacing', label: 'Ring spacing', value: 1.1, step: '0.1',
      help: 'Gap between neighbouring leaves on a ring, and between rings, as a multiple of the smallest gap a lone ring holds without buckling (about half a link at default settings). The rings settle a bit further out and steady each other, so they stay separate down to about 0.5 and start to blur together below that. Larger values give bigger, airier stars and also reach smaller hubs (from about 1.9 even the 7-leaf hubs of caterpillars change). 0 turns the idea off.'
    },
    {
      key: 'minLeaves', label: 'Smallest hub', value: 0, step: '1',
      help: 'Hubs with fewer leaves than this keep the default link lengths. 0 means automatic: only hubs whose leaves do not fit into the first ring. Raise it to leave trees with small hubs alone and change only big stars.'
    },
    {
      key: 'bondsOutside', label: 'Other links outside rings', value: 1, step: '1',
      help: '1: a hub\'s links to non-leaf nodes get long enough to start outside its rings. 0: they keep their length and cut through the rings (many more crossings).'
    }
  ],

  attach({ layout, graph, params, settings }) {
    if ((settings.dimensions || 2) !== 2) return null;
    const simulator = layout.simulator;
    const spacing = Number(params.spacing);
    const original = new Map(); // spring -> its rest length before this idea changed it
    let length, stiffness, gravity;
    apply();
    // The panel can change spring length, stiffness or gravity without a restart: redo the rings.
    // It changes them through the simulator's setters, which fire 'settings' (a direct write to
    // simulator.settings fires nothing).
    simulator.on('settings', onSettings);

    return {
      dispose() {
        simulator.off('settings', onSettings);
        restore();
      }
    };

    function onSettings() {
      if (simulator.springLength() !== length || simulator.springCoefficient() !== stiffness ||
          simulator.gravity() !== gravity) apply();
    }

    function restore() {
      original.forEach((rest, spring) => { spring.length = rest; });
      original.clear();
    }

    function apply() {
      length = simulator.springLength();
      stiffness = simulator.springCoefficient();
      gravity = simulator.gravity();
      restore();
      const plan = computeShells(graph, {
        springLength: length,
        springCoefficient: stiffness,
        gravity,
        leafCharge: leafId => layout.getBody(leafId).mass,
        // NaN or infinite falls back to the default; 0 or less turns the idea off
        spacing: Number.isFinite(spacing) ? spacing : 1.1,
        minLeaves: Number(params.minLeaves) || 0,
        bondsOutside: Number(params.bondsOutside) !== 0,
      });
      for (const [link, rest] of plan.lengths) {
        const spring = layout.getSpring(link);
        if (!spring) continue;
        original.set(spring, spring.length);
        spring.length = rest;
      }
    }
  },
};
