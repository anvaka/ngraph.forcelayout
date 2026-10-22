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
// tug of war balances when the centres are `gap` group widths apart (never aiming closer than
// 1.5 link lengths). The other groups push too, so the real distances end up a little closer to
// the middle than `gap` asks. It only ever weakens those links (never below 5%), and touches
// nothing else.
//
// All of it is formulas, so every engine runs it: sums per group measure the groups, and at the
// start of every 25th step a link formula sets the stiffness of each link between two groups; the
// stock springs read it. Which group a node is in, and which two groups a link joins, are columns
// filled once.
import findGroups from './findGroups.js';

const EVERY = 25;      // steps between updates
const MIN_SHARE = 0.05; // weakest a link between groups can get, as a share of its stiffness
// Group colors, largest group first, then the list repeats
const PALETTE = [0xf28e2bff, 0xe15759ff, 0xedc948ff, 0x59a14fff, 0xff9da7ff,
  0xb07aa1ff, 0x76b7b2ff, 0xffffffff, 0x9c755fff, 0xbab0acff];
// Sums of the groups, in the order they run
const SUMS = ['groupCount', 'groupMass', 'groupPos', 'groupSpread'];

export default {
  id: 'v1-3-group-bridges',
  title: 'Tune links between communities',
  author: 'v1-3 (Feynman Vol 1, Ch. 15-23)',
  description: `
<p>On graphs made of communities (groups of nodes linked mostly among themselves),
ngraph draws one even sheet in which the groups touch and mix.</p>
<p>This idea finds the groups once and, every 25 steps, loosens only the links between two
groups, so that the push and pull of the two whole groups balance at about <b>Gap</b> group
widths apart (those links never get stiffer, keep at least 5% of their stiffness, and never
aim closer than 1.5 link lengths).</p>
<p>It comes from Feynman, Vol 1, chapters 18&ndash;19: the forces inside a body cancel, so only
outside forces move its centre, and from far away a whole group pushes like one heavy node.</p>
<p>Look for separate colored blobs with long links across white gaps: on sbm8x50 the group
centres move from about 1.8 to 2.6 group widths apart.</p>
<p>If nothing is colored, it found no linked groups and the layout is the same as <b>none</b>
(grid20, or any 3D layout).</p>
<p>What gets worse: stress (how badly drawn distances match the number of hops between nodes)
rises 18% on sbm8x50 and 29% on communities, the gaps leave more of the frame empty, and the
default settings also push apart two or three big groups in sciMet (stress +24%), npmMix4 and
erdos992.</p>
<p>Lower <b>Smallest group</b> to 1 and weak groups (Miserables) and random clumps (rgg1500)
get pulled apart as well.</p>`,
  tryGraphs: ['Benchmark: sbm8x50', 'Benchmark: communities', 'Groups 8x250 (2k)', 'Benchmark: grid20'],
  params: [
    {
      key: 'gap', label: 'Gap', value: 2.5, step: '0.5',
      help: 'Target distance between the centres of two linked groups, in group widths (a group\'s width ' +
        'is the root-mean-square distance of its nodes from its centre; the two widths are added). The other ' +
        'groups push too, so real distances come out closer to the middle: on sbm8x50, 1.5 gives about 2.2, ' +
        '2.5 about 2.6 (like ForceAtlas2), 3.5 about 3.4 (tight blobs, very long links). 0 or less asks for ' +
        'no gap, so the links stay as stiff as before.'
    },
    {
      key: 'certainty', label: 'Group certainty', value: 0.75, step: '0.05',
      help: 'Communities are searched 8 times from different random orders. A link counts as running ' +
        'between groups only if it does so in at least this share of the searches, so it moves in steps ' +
        'of 1/8 (0.75 means 6 of 8). Lower lets links of fuzzier groups loosen too (0: every link between ' +
        'two groups); higher keeps only the clearest ones (above 1: none, so nothing changes).'
    },
    {
      key: 'minGroup', label: 'Smallest group', value: 2, step: '0.5',
      help: 'Smallest group that counts, as a multiple of the square root of the number of nodes ' +
        '(400 nodes: 2 means 40; 0 counts every group, however small). 1 lets smaller groups separate ' +
        'too, but then weak groups (Miserables) and random clumps (rgg1500) get pulled apart as well.'
    }
  ],

  attach({layout, graph, params, settings}) {
    if ((settings.dimensions || 2) !== 2) return null; // 2D only
    const {groups, pairs} = findGroups(graph, {
      certainty: numberOr(params.certainty, 0.75),
      minGroupFactor: numberOr(params.minGroup, 2)
    });
    if (!pairs.length) return null; // no clear communities: leave the layout as it is

    const gap = Math.max(0, numberOr(params.gap, 2.5));
    const simulator = layout.simulator;
    // The groups are measured at the start of the step the idea is attached at and of every 25th
    // step after it, and the new stiffness applies from that step on. The text has no params, so
    // the stages share one test of it per step.
    const updateStep = `step - floor(step / ${EVERY}) * ${EVERY} == ${simulator.iteration() % EVERY}`;
    const store = simulator.store, springs = simulator.springStore;
    // The group of every node (-1: in none); for every link between two groups those two groups
    // (the smaller first) and how many links join them; and every link's own stiffness from
    // before (0 or less: the setting). A link formula sets every link, so links inside groups get
    // their own stiffness from attach time back on every update: a stiffness given to such a link
    // later lasts only until the next update.
    store.define('group', Int32Array, 1, -1);
    springs.define('groupA', Int32Array, 1, -1);
    springs.define('groupB', Int32Array, 1, -1);
    springs.define('bridges', Int32Array);
    springs.define('ownCoefficient', Float64Array, 1, -1);
    springs.ownCoefficient.set(springs.coefficient.subarray(0, springs.n));
    groups.forEach((nodes, g) => nodes.forEach(id => { store.group[layout.getBody(id).index] = g; }));
    pairs.forEach(pair => {
      const bridgeSprings = pair.links.map(link => layout.getSpring(link.id)).filter(Boolean);
      for (const spring of bridgeSprings) {
        springs.groupA[spring.index] = pair.a;
        springs.groupB[spring.index] = pair.b;
        springs.bridges[spring.index] = bridgeSprings.length;
      }
    });

    // Each group's size, mass, centre and width (root mean square distance of its nodes from the
    // centre), measured at the start of the step
    const measure = { group: 'group', when: updateStep, before: 'clear' };
    simulator.addSum('groupCount', { ...measure, formula: '1' });
    simulator.addSum('groupMass', { ...measure, formula: 'mass' });
    simulator.addSum('groupPos', { ...measure, formula: 'pos' });
    simulator.addSum('groupSpread', { ...measure, formula: 'd = pos - groupPos[group] / groupCount[group]; dot(d, d)' });
    // Stiffness share f that balances push and pull at the target distance R:
    //   push * M_A * M_B / R^2 = f * k * e_AB * (R - rest)
    // A target no farther than the rest length (gap 0 with springLength 0) has no balance, and
    // neither has a stiffness of 0 or less: keep k (f = 1). The link's stiffness becomes f * k.
    simulator.addLinkFormula('bridgeStiffness', {
      when: updateStep,
      before: 'clear',
      params: { gap, minShare: MIN_SHARE },
      formula: `
        wA = sqrt(groupSpread[groupA] / groupCount[groupA]);
        wB = sqrt(groupSpread[groupB] / groupCount[groupB]);
        R = max(gap * (wA + wB), 1.5 * springLength);
        f = R > springLength && springCoefficient > 0 ?
          abs(gravity) * groupMass[groupA] * groupMass[groupB] / (springCoefficient * bridges * R * R * (R - springLength)) : 1;
        coefficient = groupA >= 0 ? min(1, max(minShare, f)) * springCoefficient : ownCoefficient`
    });

    // One color per group, largest group first
    const color = new Map();
    groups.map((nodes, g) => g)
      .sort((a, b) => groups[b].length - groups[a].length)
      .forEach((g, rank) => {
        const c = PALETTE[rank % PALETTE.length];
        groups[g].forEach(id => color.set(id, c));
      });

    return {
      nodeColor(nodeId) {
        return color.get(nodeId) || 0;
      },
      dispose() {
        SUMS.concat('bridgeStiffness').forEach(name => {
          if (simulator.getStage(name)) simulator.removeStage(name);
        });
        // links between groups get their own stiffness back
        for (let s = 0; s < springs.n; ++s) {
          if (springs.groupA[s] >= 0) springs.coefficient[s] = springs.ownCoefficient[s];
        }
        springs.changed('coefficient');
        store.remove('group');
        ['groupA', 'groupB', 'bridges', 'ownCoefficient'].forEach(name => springs.remove(name));
      }
    };
  }
};

// NaN (e.g. from the URL) falls back to the default; every other value is used as given
function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isNaN(number) ? fallback : number;
}
