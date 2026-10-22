// The extra push between domains, as repulsion passes that walk the library's tree together with
// its own repulsion.
//
// The library already pushes every pair i, j apart with gravity * m_i * m_j / r^2. On top of
// that, this adds (boost / 2) * (1 - s_i . s_j) times the same push, where s are the domain
// arrows from domains.js: almost zero for two nodes with the same arrow (arrows are a bit shorter
// than 1, so neighbors in one domain push about 1.2 times the stock push), up to `boost` times the
// stock push for opposite arrows.
//
// With beta = boost / 2 and t_a = s_a + 1 (never negative), the extra weight of a pair splits into
// Q + 1 charges that each body carries:
//   beta * m_i * m_j * (1 - s_i . s_j)
//     = m_j * [beta * m_i * (1 + sum_a s_ia)] + sum_a (m_j * t_ja) * [-beta * m_i * s_ia],
// charges m_j and m_j * t_ja, felt as the bracketed sensitivities. Summed over a tree cell this is
// the cell's mass and its moments m * t_a, so each charge acts from the cell's mass centre
// ('shared' centres). The passes sit next to the library's repulsion, so all Q + 2 charges share
// one tree walk.
import { Q } from './domains.js';

export default function addDomainPasses(layout, spinsByBody, bodies, boost) {
  const sim = layout.simulator, store = sim.store;
  const charge = sim.repulsionCharge();
  const spin = a => 'domainSpin' + a, sense = a => 'domainSense' + a, moment = a => 'domainCharge' + a;
  const columns = [];
  for (let a = 0; a < Q; ++a) columns.push(spin(a), moment(a), sense(a));
  columns.push('domainSense');
  columns.forEach(name => store.define(name));
  // The arrows are final from the start (computed in index.js); rows follow the bodies
  bodies.forEach((body, i) => {
    for (let a = 0; a < Q; ++a) store[spin(a)][body.index] = spinsByBody[Q * i + a];
  });
  for (let a = 0; a < Q; ++a) store.changed(spin(a));

  // The columns follow the charges, so changed masses push as before
  const spins = [];
  for (let a = 0; a < Q; ++a) spins.push(spin(a));
  const lines = [`domainSense = beta * ${charge} * (1 + ${spins.join(' + ')})`];
  for (let a = 0; a < Q; ++a) {
    lines.push(`${moment(a)} = ${charge} * (${spin(a)} + 1)`, `${sense(a)} = -beta * ${charge} * ${spin(a)}`);
  }
  sim.addNodeFormula('domainCharges', { before: 'repulsion', params: { beta: boost / 2 }, formula: lines.join('; ') });

  const passes = ['domainPush'];
  sim.addRepulsion('domainPush', { after: 'repulsion', charge, sensitivity: 'domainSense', centroid: 'shared' });
  for (let a = 0; a < Q; ++a) {
    const name = 'domainPush' + a;
    sim.addRepulsion(name, { after: passes[passes.length - 1], charge: moment(a), sensitivity: sense(a), centroid: 'shared' });
    passes.push(name);
  }

  return function remove() {
    passes.forEach(name => sim.removeStage(name));
    sim.removeStage('domainCharges');
    columns.forEach(name => store.remove(name));
  };
}
