// Tune links between communities (reader v1-3).
//
// A community's own springs and repulsions cancel in pairs, so they cannot move the group as a
// whole: its centre (the average position of its nodes) moves only under forces from outside it
// (Feynman, Vol 1, Ch. 18-1). From far away a group also pushes like one big node holding all its
// mass at that centre (Ch. 19-1). So the distance between two groups A and B is a tug of war:
//   push = |gravity| * M_A * M_B / R^2         (M = sum of the bodies' masses, R = centre distance)
//   pull = k * e_AB * (R - springLength)       (e_AB links between them, each of stiffness k)
// In stock ngraph the links between groups are as stiff as the links inside them, the pull wins
// early, and the groups sit on top of each other. Every few steps this prototype measures each
// group's centre, mass and width, and sets the stiffness of the links between each pair so the
// tug of war balances when the centres are `gap` group widths apart. It only ever weakens those
// links (never below 5%), and touches nothing else.
import findGroups from './findGroups.js';

const EVERY = 25;      // steps between updates
const MIN_SHARE = 0.05; // weakest a link between groups can get, as a share of its stiffness

export default {
  id: 'v1-3-group-bridges',
  title: 'Tune links between communities',
  author: 'v1-3 (Feynman Vol 1, Ch. 15-23)',
  description: `
<p>On graphs made of communities (groups of nodes linked mostly among themselves),
ngraph draws one evenly spread sheet: the groups show only as faint lobes that touch, and
their edges mix.</p>
<p>This idea finds the groups once, then every 25 steps it loosens only the links that run
between two groups. For each pair of groups it picks how loose those links are, so that the
push between the two whole groups balances their pull when the groups' centres sit
<b>Gap</b> group widths apart. Links inside a group are never changed.</p>
<p>It comes from Feynman, Vol 1, chapters 18&ndash;19. The forces inside a body cancel, so only
outside forces move its centre (the average position of its parts). From far away, a whole
group pushes like one heavy node at that centre.</p>
<p>Look for separate blobs with white space between them and long links across the gaps, as
ForceAtlas2 draws them. Compare with <b>none</b>. On grid20, nothing should change.</p>
<p>What gets worse: links between groups become long, so they no longer match graph
distance, and the gaps leave more of the frame empty. Lower <b>Smallest group</b> to 1 and
weak groups (Miserables) or random clumps (rgg1500) get pulled apart too: the picture turns
lopsided or gets holes.</p>`,
  tryGraphs: ['Benchmark: sbm8x50', 'Benchmark: communities', 'Groups 8x250 (2k)', 'Benchmark: grid20'],
  params: [
    {
      key: 'gap', label: 'Gap', value: 2.5, step: '0.5',
      help: 'How far apart two linked groups settle: distance between their centres, in group widths ' +
        '(each width is a group\'s average distance of its nodes from its centre, summed over the two groups). ' +
        '1.5 is gentle, 2.5 looks like ForceAtlas2, 3.5 gives tight blobs with very long links between them.'
    },
    {
      key: 'certainty', label: 'Group certainty', value: 0.75, step: '0.05',
      help: 'Communities are searched 8 times from different random orders. A link counts as running ' +
        'between groups only if it does so in at least this share of the searches. Lower lets links of ' +
        'fuzzier groups loosen too; higher keeps only the clearest ones.'
    },
    {
      key: 'minGroup', label: 'Smallest group', value: 2, step: '0.5',
      help: 'Smallest group that counts, as a multiple of the square root of the number of nodes ' +
        '(400 nodes: 2 means 40). 1 lets smaller groups separate too, but then weak groups ' +
        '(Miserables) and random clumps (rgg1500) get pulled apart as well.'
    }
  ],

  attach({layout, graph, params, settings}) {
    if ((settings.dimensions || 2) !== 2) return null; // 2D only
    const {groups, pairs} = findGroups(graph, {
      certainty: Number(params.certainty),
      minGroupFactor: Number(params.minGroup)
    });
    if (!pairs.length) return null; // no clear communities: leave the layout as it is

    const gap = Number(params.gap) > 0 ? Number(params.gap) : 2.5;
    const simulator = layout.simulator;
    const groupBodies = groups.map(nodes => nodes.map(id => layout.getBody(id)));
    const pairSprings = pairs.map(pair => ({
      a: pair.a,
      b: pair.b,
      springs: pair.links.map(link => layout.getSpring(link.id)).filter(Boolean)
    }));
    const original = new Map();
    pairSprings.forEach(pair => pair.springs.forEach(spring => original.set(spring, spring.coefficient)));

    const mass = new Float64Array(groups.length);
    const width = new Float64Array(groups.length);

    let steps = 0;
    update();
    layout.on('step', onStep);

    return {
      dispose() {
        layout.off('step', onStep);
        original.forEach((coefficient, spring) => { spring.coefficient = coefficient; });
      }
    };

    function onStep() {
      steps += 1;
      if (steps % EVERY === 0) update();
    }

    function update() {
      const s = simulator.settings;
      const k = s.springCoefficient, rest = s.springLength, push = Math.abs(s.gravity);
      // Each group's mass, centre and width (root mean square distance of its nodes from the centre)
      const cx = new Float64Array(groups.length), cy = new Float64Array(groups.length);
      groupBodies.forEach((bodies, g) => {
        let m = 0, x = 0, y = 0;
        for (const body of bodies) { m += body.mass; x += body.pos.x; y += body.pos.y; }
        cx[g] = x / bodies.length;
        cy[g] = y / bodies.length;
        let r2 = 0;
        for (const body of bodies) r2 += (body.pos.x - cx[g]) ** 2 + (body.pos.y - cy[g]) ** 2;
        mass[g] = m;
        width[g] = Math.sqrt(r2 / bodies.length);
      });
      // Stiffness share f that balances push and pull at the target distance R:
      //   push * M_A * M_B / R^2 = f * k * e_AB * (R - rest)
      for (const pair of pairSprings) {
        if (!pair.springs.length) continue;
        const R = Math.max(gap * (width[pair.a] + width[pair.b]), 1.5 * rest);
        let f = push * mass[pair.a] * mass[pair.b] / (k * pair.springs.length * R * R * (R - rest));
        f = Math.min(1, Math.max(MIN_SHARE, f));
        for (const spring of pair.springs) spring.coefficient = f * k;
      }
    }
  }
};
