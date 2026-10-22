// Shell rule for "Fermi fans": the leaves (one-link nodes) of a hub take turns filling rings.
//
// Ring j (j = 1, 2, ...) sits at (1 + (j - 1) * spacing) link lengths from the hub and has one seat
// per arc of `spacing` link lengths, so it holds floor(2 * PI * (1 + (j - 1) * spacing) / spacing)
// leaves. Leaves fill ring 1, then ring 2, and so on, which gives an evenly filled disc. A hub whose
// leaves all fit in ring 1 keeps the stock springs.
//
// Returns, for every changed spring, its rest length in units of the global spring length, and the
// seat (ring and angle) of every leaf in a filled fan.

export default function computeShells(graph, layout, options) {
  const spacing = options.spacing;
  const rimBonds = options.rimBonds;
  const firstRing = ringCapacity(1, spacing);

  // Leaf springs grouped by hub
  const fans = new Map();
  graph.forEachLink(link => {
    const from = link.fromId, to = link.toId;
    if (from === to) return;
    const fromLeaf = degree(graph, from) === 1, toLeaf = degree(graph, to) === 1;
    if (fromLeaf === toLeaf) return; // a link between two leaves, or no leaf at all
    const hub = fromLeaf ? to : from;
    const spring = layout.getSpring(link);
    if (!spring) return;
    let fan = fans.get(hub);
    if (!fan) fans.set(hub, fan = []);
    fan.push({ spring, leaf: fromLeaf ? from : to });
  });

  const lengths = new Map();   // spring -> rest length / spring length
  const rimOffset = new Map(); // hub -> how far past one link length its outer ring ends
  const seats = [];            // {hub, leaf, radius (link lengths), angle}
  let changedLeaves = 0, filledHubs = 0, maxRings = 1;
  fans.forEach((fan, hub) => {
    if (fan.length <= firstRing) return;
    let ring = 1, seated = 0;
    for (let i = 0; i < fan.length; i++) {
      if (seated >= ringCapacity(ring, spacing)) { ring += 1; seated = 0; }
      const radius = 1 + (ring - 1) * spacing;
      seats.push({ hub, leaf: fan[i].leaf, radius, angle: 2 * Math.PI * seated / ringCapacity(ring, spacing) + ring });
      seated += 1;
      if (ring > 1) changedLeaves += 1;
      lengths.set(fan[i].spring, radius);
    }
    filledHubs += 1;
    if (ring > maxRings) maxRings = ring;
    // The hub's other links start one seat past its outer ring
    rimOffset.set(hub, ring * spacing);
  });

  if (rimBonds && rimOffset.size) {
    graph.forEachLink(link => {
      const from = link.fromId, to = link.toId;
      if (from === to || degree(graph, from) === 1 || degree(graph, to) === 1) return;
      const extra = (rimOffset.get(from) || 0) + (rimOffset.get(to) || 0);
      if (extra === 0) return;
      const spring = layout.getSpring(link);
      if (spring) lengths.set(spring, 1 + extra);
    });
  }

  return { lengths, seats, changedLeaves, filledHubs, maxRings };
}

function ringCapacity(ring, spacing) {
  return Math.floor(2 * Math.PI * (1 + (ring - 1) * spacing) / spacing);
}

function degree(graph, nodeId) {
  const links = graph.getLinks(nodeId);
  if (!links) return 0;
  return links.size === undefined ? links.length : links.size;
}
