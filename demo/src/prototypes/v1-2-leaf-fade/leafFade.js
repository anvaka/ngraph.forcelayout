/**
 * A repulsion (2D) where some pushes fade with distance.
 *
 * Every body is either "core" or "leaf". A push between two core bodies is the library's usual
 * one, g * m1 * m2 / r^2. A push that involves at least one leaf body fades:
 * g * m1 * m2 * exp(-r / fade) / r^2, and is dropped past `CUTOFF` fade lengths. The rule is the
 * same for both bodies of a pair, so action still equals reaction.
 *
 * Three charges, which the library walks in one tree (stages next to each other share a walk):
 * - the stock repulsion, with the fading law: every body's charge, felt by leaves only;
 * - 'leafFadeCore': core charges at 1/r^2, felt by core bodies;
 * - 'leafFadeLeaves': leaf charges with the fading law, felt by core bodies.
 * Both act from the centre of a tree cell's mass, which is fastest and, measured against the exact
 * sum, as accurate as the bespoke tree this replaces (a centre per charge is no better here, and
 * one charge at its own centre and one at the shared one is worse). exp(-u) is read from a table
 * with linear interpolation, as fast as it gets.
 */
const CUTOFF = 6; // exp(-6) is 0.25%: farther faded pushes are dropped
const TABLE_SIZE = 2048;
const TABLE_RANGE = 8; // the table covers u = r / fade in [0, 8]; exp(-8) = 0.03%

export default function addLeafFade(layout, { fadeLength, leafLinks }) {
  const sim = layout.simulator, store = sim.store;
  const charge = sim.repulsionCharge(), sensitivity = sim.repulsionSensitivity(), law = sim.repulsionLaw().spec;
  store.define('leafFadeCore');
  store.define('leafFadeLeafCharge');

  // A body is a leaf when it has 1..leafLinks springs
  sim.addNodeFormula('leafFadeCharges', {
    before: 'repulsion',
    params: { leafLinks },
    formula: `leaf = degree >= 1 && degree <= leafLinks;
      leafFadeCore = leaf ? 0 : ${charge}; leafFadeLeafCharge = leaf ? ${charge} : 0`
  });
  const values = new Float64Array(TABLE_SIZE + 1);
  for (let k = 0; k <= TABLE_SIZE; ++k) values[k] = Math.exp(-k * TABLE_RANGE / TABLE_SIZE);
  const fade = {
    force: 'E(r / F) / r^2',
    // A spring length of 0 or less (e.g. while typing in the panel) gives no reach at all
    params: { F: context => context.springLength() > 0 ? fadeLength * context.springLength() : 0 },
    range: CUTOFF + ' * F',
    tables: { E: { from: 0, to: TABLE_RANGE, values } }
  };
  sim.repulsionLaw(fade);
  sim.repulsionSensitivity('leafFadeLeafCharge');
  sim.addRepulsion('leafFadeCore', { after: 'repulsion', charge: 'leafFadeCore', centroid: 'shared' });
  sim.addRepulsion('leafFadeLeaves', {
    after: 'leafFadeCore', charge: 'leafFadeLeafCharge', sensitivity: 'leafFadeCore', law: fade, centroid: 'shared'
  });

  return function remove() {
    ['leafFadeLeaves', 'leafFadeCore', 'leafFadeCharges'].forEach(name => sim.removeStage(name));
    sim.repulsionLaw(law);
    sim.repulsionSensitivity(sensitivity);
    ['leafFadeCore', 'leafFadeLeafCharge'].forEach(name => store.remove(name));
  };
}
