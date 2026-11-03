import createGraph from 'ngraph.graph';

// Graphs with real names, served from demo/public/graphs/data. Each file is
// {title, about, source, license, fields, nodes: [[...fields]], links: [from, to, ...],
//  colorBy?, palette?, importance?, linkData?, linkColors?}. Node rows hold `fields` in order;
// "id" (or else the row number) is the node id, and the other fields become node.data, which
// the view shows in tooltips (label first, for search and labels).
export const labelledGraphs = {
  'London Underground': 'london-underground',
  'Programming languages': 'programming-languages',
  'Map of science': 'map-of-science',
  'Countries': 'countries',
  'Mammals (WordNet)': 'wordnet-mammals',
  'Chess openings': 'chess-openings',
  'US counties': 'us-counties',
  'Air routes': 'air-routes',
  'Languages of the world': 'languages',
  'Metros of the world': 'world-metros',
  'English nouns (WordNet)': 'wordnet-nouns',
  'Tree of life': 'tree-of-life',
};

// Bright enough on the dark blue background; categories past the palette share the last color
const PALETTE = ['#4fc3f7', '#ffb74d', '#81c784', '#f06292', '#ba68c8', '#fff176', '#e57373',
  '#4db6ac', '#a1887f', '#90a4ae', '#dce775', '#7986cb'];
const OTHER = '#7d8a99';

export default function loadLabelledGraph(name) {
  return fetch(`${import.meta.env.BASE_URL}graphs/data/${labelledGraphs[name]}.json`)
    .then(x => x.json())
    .then(toGraph);
}

function toGraph(doc) {
  let graph = createGraph();
  let fields = doc.fields;
  let idAt = fields.indexOf('id');
  let ids = new Array(doc.nodes.length);
  doc.nodes.forEach((row, i) => {
    let data = {};
    // Hidden fields start with "_": they color nodes, but tooltips don't list them
    fields.forEach((field, k) => {
      if (k === idAt || row[k] === null || row[k] === undefined) return;
      if (field[0] === '_') Object.defineProperty(data, field, {value: row[k]});
      else data[field] = row[k];
    });
    ids[i] = idAt < 0 ? i : row[idAt];
    graph.addNode(ids[i], data);
  });
  let linkData = doc.linkData;
  for (let i = 0; i + 1 < doc.links.length; i += 2) {
    graph.addLink(ids[doc.links[i]], ids[doc.links[i + 1]], linkData ? linkData[i / 2] : undefined);
  }
  let colors = doc.colorBy ? categoryColor(doc, graph) : null;
  graph.meta = {
    title: doc.title, about: doc.about, source: doc.source, license: doc.license,
    importance: doc.importance,
    nodeSize: doc.nodeSize,
    nodeColor: colors ? colors.color : undefined,
    // What the colours mean: the field, and its values by how many nodes have them
    colorBy: doc.colorBy,
    legend: colors ? colors.legend : undefined,
    linkColor: linkData ? linkColorOf(doc) : undefined,
  };
  return graph;
}

// Colors by a field: the palette in the file, else the most common values get the PALETTE.
// Returns {color: node => rgba, legend: [{label, color, count}]} (legend most common first).
function categoryColor(doc, graph) {
  let field = doc.colorBy;
  let counts = new Map();
  graph.forEachNode(node => {
    let value = node.data[field];
    if (value !== undefined) counts.set(value, (counts.get(value) || 0) + 1);
  });
  let byCount = [...counts.keys()].sort((a, b) => counts.get(b) - counts.get(a));
  let colors = {...doc.palette};
  if (!doc.palette) byCount.forEach((value, i) => { colors[value] = PALETTE[i] || OTHER; });
  let rgba = {};
  Object.keys(colors).forEach(key => { if (colors[key]) rgba[key] = toRGBA(colors[key], 0xff); });
  // A hidden field (its own colour per value, such as a metro line's) has no legend
  let legend = field[0] === '_' ? null : byCount.map(value => ({
    label: String(value), color: colors[value] || OTHER, count: counts.get(value)
  }));
  return {color: node => rgba[node.data && node.data[field]] || toRGBA(OTHER, 0xff), legend};
}

function linkColorOf(doc) {
  let cache = {};
  let colorOf = value => {
    if (!value) return 0;
    if (!(value in cache)) {
      let hex = doc.linkColors === 'self' ? value : doc.linkColors[value];
      cache[value] = hex ? toRGBA(hex, 0xd0) : 0;
    }
    return cache[value];
  };
  return link => colorOf(link.data) || 0xffffff10;
}

function toRGBA(hex, alpha) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return ((parseInt(h.slice(0, 6), 16) << 8) | alpha) >>> 0;
}
