// Soft-core repulsion: only the short-range part of the push changes, so a close pair can't get
// stiffer than the step can follow. Far away both laws are today's 1/r^2.
//
//  - Plummer (law 0): F = r / (r^2 + e^2)^1.5. Below about e the push levels off, and a pair's
//    stiffness is capped near 2 |G| q^2 / e^3. e comes from the step: e^3 = 2 |G| dt^2 q, with q the
//    mean charge, which puts a typical pair's stiffness at half the explicit step's limit
//    (geometry.md, vis.md). `plummer` scales that length.
//  - Slab (law 1): F = 1 / (r sqrt(r^2 + s^2)), a charge spread through a slab of thickness 2s
//    (plasma.md). Below s it is the 2D law 1/r, so it still grows without limit as r -> 0 and
//    nodes can't sit on top of each other; past about 2s it is 1/r^2. s = slab * unit, the spring
//    length, so it follows springLength.
//
// Both are laws in the library's law slot, written with the names every formula knows (gravity,
// dt, unit), so a change of those settings applies at once, and the GPU runs the same law. The
// trees use the law for cells as well as for bodies, so lumped close cells are softened too.
export const LAWS = ['Plummer', 'slab'];

export default function addSoftCore(simulator, options) {
  const store = simulator.store;
  const chargeName = simulator.settings.repulsionCharge || 'mass';
  // Mean charge, read once: charges are fixed while the idea is attached
  let sum = 0;
  const charge = store[chargeName];
  for (let i = 0; i < store.n; ++i) sum += Math.abs(charge[i]);
  const qbar = store.n ? sum / store.n : 1;

  const spec = options.law === 1 ? {
    force: '1 / (r * sqrt(r^2 + (s * unit)^2))',
    params: { s: () => options.slab }
  } : {
    // r / (r^2 + e^2)^1.5, written with sqrt: pow is several times slower on the CPU
    force: 'u = r^2 + e^2; r / (u * sqrt(u))',
    params: {
      // (2 |G| dt^2 q)^(1/3), read every step from the live settings
      e: context => options.plummer * Math.cbrt(2 * Math.abs(context.settings.gravity) * context.settings.timeStep * context.settings.timeStep * qbar)
    }
  };
  simulator.repulsionLaw(spec);
  return {
    qbar,
    dispose() { simulator.repulsionLaw(null); }
  };
}
