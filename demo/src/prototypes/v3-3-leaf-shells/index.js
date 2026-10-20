import computeShells from './computeShells.js';

// Leaves fill rings (stability rule). A hub's leaves sit in rings at growing distances, each
// ring holding only as many leaves as it can without buckling; the hub's other links start
// outside its rings. Only link rest lengths change, once when the layout starts.
export default {
  id: 'v3-3-leaf-shells',
  title: 'Leaves fill rings (stability rule)',
  author: 'v3-3 (Feynman Vol. 3, ch. 13 and 15)',
  description: `
<p>On star-like graphs ngraph piles each hub's leaves (nodes with a single link) into a dark ball or a thick rim, so stars look like small blots far apart.</p>
<p>Why: leaves at the same distance from their hub push each other apart. Packed closer than about half a link length, the ring buckles (every other leaf slides in or out) and crumples into a dense disk.</p>
<p>This gives each hub several rings of leaves at growing distances, like the shells of an atom, and puts in each ring only as many leaves as it holds without buckling. The hub's other links start outside its rings, so they don't cut through them. Only link lengths change, once at the start; hubs with up to about 11 leaves are left alone.</p>
<p>From Feynman's Lectures, Vol. 3: ch. 13 and 15 (waves on a ring of atoms; the zigzag wave is the first to give way) and ch. 15-6 (electrons filling shells).</p>
<p>Look for evenly filled sunbursts with visible rays instead of dark balls, and stars that fill the screen. Compare with <b>none</b>. A close sibling, "Fermi fans" (v3-1), uses a fixed gap you set yourself; here the gap follows gravity and spring strength.</p>
<p>Worse: big stars make the drawing larger, so the rest looks smaller, and links between stars can cut across other stars' rays (more crossings on starOfStars). 2D only: in 3D it does nothing.</p>`,
  tryGraphs: ['Benchmark: starOfStars', 'Benchmark: megaStars', 'Benchmark: EVA', 'Benchmark: caterpillars'],
  params: [
    {
      key: 'spacing', label: 'Ring spacing', value: 1.1, step: '0.1',
      help: 'Gap between neighbouring leaves on a ring, and between rings, as a multiple of the smallest gap that does not buckle (about half a link at default settings). Below 1 the rings buckle again; larger values give bigger, airier stars.'
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
    let touched = [];
    let length, stiffness, gravity;
    apply();
    // The panel can change spring length, stiffness or gravity without a restart: redo the rings.
    layout.on('step', onStep);

    return {
      dispose() { layout.off('step', onStep); }
    };

    function onStep() {
      if (simulator.springLength() !== length || simulator.springCoefficient() !== stiffness ||
          simulator.gravity() !== gravity) apply();
    }

    function apply() {
      length = simulator.springLength();
      stiffness = simulator.springCoefficient();
      gravity = simulator.gravity();
      for (const spring of touched) spring.length = -1;
      const plan = computeShells(graph, {
        springLength: length,
        springCoefficient: stiffness,
        gravity,
        leafCharge: leafId => layout.getBody(leafId).mass,
        spacing: Number(params.spacing) > 0 ? Number(params.spacing) : 1.1,
        minLeaves: Number(params.minLeaves) || 0,
        bondsOutside: Number(params.bondsOutside) !== 0,
      });
      touched = [];
      for (const [link, rest] of plan.lengths) {
        const spring = layout.getSpring(link);
        if (!spring) continue;
        spring.length = rest;
        touched.push(spring);
      }
    }
  },
};
