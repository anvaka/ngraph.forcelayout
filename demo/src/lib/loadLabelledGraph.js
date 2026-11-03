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
  // What the drawing reads (lib/look.js turns colorBy, palette and linkColors into colors)
  graph.meta = {
    title: doc.title, about: doc.about, source: doc.source, license: doc.license,
    importance: doc.importance,
    colorBy: doc.colorBy, palette: doc.palette, linkColors: doc.linkData ? doc.linkColors : undefined,
  };
  return graph;
}
