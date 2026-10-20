// Rest lengths for "leaves fill rings".
//
// Why rings buckle: leaves at the same distance R from a hub form a ring, and small in-and-out
// moves of the leaves behave like waves on Feynman's ring of atoms (Vol. 3, eq. 15.25-15.27).
// Leaves repel each other, so the wave that alternates in, out, in, out (the zigzag) is the
// softest. Its stiffness is
//     k + 2 g Q q / R^3 - 4.21 g q^2 / b^3
// (k: spring stiffness, g: |gravity|, q: leaf charge, Q: hub charge, b: gap between neighbouring
// leaves, 4.21 = 4 (1 + 1/27 + 1/125 + ...)). Once this goes negative the ring crumples into a
// disk. Ignoring the small hub term, a ring stays a ring while b > b* = (4.21 g q^2 / k)^(1/3),
// about 0.48 link lengths at default settings.
//
// So a ring of radius R holds at most 2 pi R / b* leaves. Like electrons filling shells
// (ch. 15-6), leaves fill ring 0 at R = L, then ring 1 at L + b*, and so on. A hub's links to
// non-leaf nodes get length R_outer(a) + R_outer(b) + L, so they start outside the rings.
export default function computeShells(graph, options) {
  const L = options.springLength;
  const g = Math.abs(options.gravity);
  const k = options.springCoefficient;
  const spacing = options.spacing;
  const lengths = new Map(); // link -> rest length
  if (!(L > 0) || !(k > 0) || !(g > 0)) return { lengths };

  const degree = new Map();
  graph.forEachLink(link => {
    if (link.fromId === link.toId) return;
    degree.set(link.fromId, (degree.get(link.fromId) || 0) + 1);
    degree.set(link.toId, (degree.get(link.toId) || 0) + 1);
  });

  // Leaves (links) per hub
  const leavesOf = new Map();
  graph.forEachLink(link => {
    if (link.fromId === link.toId) return;
    const a = link.fromId, b = link.toId;
    const leaf = degree.get(a) === 1 ? a : degree.get(b) === 1 ? b : null;
    if (leaf === null) return;
    const hub = leaf === a ? b : a;
    if (degree.get(hub) === 1) return; // a lone pair, not a hub
    if (!leavesOf.has(hub)) leavesOf.set(hub, []);
    leavesOf.get(hub).push({ link, leaf });
  });

  const outer = new Map(); // hub -> radius of its outermost ring
  leavesOf.forEach((list, hub) => {
    const q = options.leafCharge(list[0].leaf);
    const bStar = spacing * Math.cbrt(4.21 * g * q * q / k);
    const firstRing = Math.floor(2 * Math.PI * L / bStar);
    if (list.length <= Math.max(firstRing, options.minLeaves - 1)) return;
    let ring = 0, filled = 0, radius = L;
    for (const { link } of list) {
      radius = L + ring * bStar;
      lengths.set(link, radius);
      const capacity = Math.max(1, Math.floor(2 * Math.PI * radius / bStar));
      if (++filled >= capacity) { ring += 1; filled = 0; }
    }
    outer.set(hub, radius);
  });

  if (options.bondsOutside && outer.size) {
    graph.forEachLink(link => {
      if (lengths.has(link)) return;
      const ra = outer.get(link.fromId) || 0, rb = outer.get(link.toId) || 0;
      if (ra || rb) lengths.set(link, ra + rb + L);
    });
  }
  return { lengths, hubs: outer.size };
}
