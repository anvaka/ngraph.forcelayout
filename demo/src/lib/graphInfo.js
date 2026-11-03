// What the about line says about the graph on screen: what it is, what its colours mean, and
// the credit its data's license asks for. Graphs with real names carry this in their file
// (loadLabelledGraph.js); the others are described here.

const SUITESPARSE = {
  about: 'A sparse matrix from the SuiteSparse Matrix Collection; its pattern is drawn as a graph (a node per row, a link per nonzero).',
  credit: {text: 'SuiteSparse Matrix Collection, CC BY 4.0', href: 'https://sparse.tamu.edu/about'}
};

const GENERATED = {
  'Binary': 'A balanced binary tree, generated in the browser.',
  'Grid 100x100 (10k)': 'A 100 x 100 grid, generated in the browser.',
  'Binary tree (8k)': 'A balanced binary tree of 8k nodes, generated in the browser.',
  'Watts-Strogatz (10k)': 'A small-world ring (Watts-Strogatz), generated in the browser.',
  'Barabasi-Albert (20k)': 'Preferential attachment (Barabási-Albert): a few big hubs. Generated in the browser.',
  'Barabasi-Albert (100k)': 'Preferential attachment (Barabási-Albert), 100k nodes: a speed test. Generated in the browser.',
  'Scale-free tree (10k)': 'A tree grown by preferential attachment, generated in the browser.',
  'Cube 20x20x20 (8k)': 'A 20 x 20 x 20 lattice, generated in the browser. Best in 3D.',
  'Groups 8x250 (2k)': 'Eight groups of 250 nodes, linked mostly within the group. Generated in the browser.',
  'Many pieces (300)': '300 separate pieces of very different sizes, generated in the browser.'
};

const MISERABLES = {
  about: 'Characters of Victor Hugo’s Les Misérables, linked when they appear in the same chapter.',
  credit: {text: 'D. E. Knuth, The Stanford GraphBase', href: 'https://www-cs-faculty.stanford.edu/~knuth/sgb.html'}
};

/**
 * {about, credit: {text, href} | null, colorBy, legend: [{label, color, count}] | null} for the
 * graph `name` (or a file the visitor opened, `fileName`)
 */
export default function graphInfo(name, graph, fileName) {
  let meta = (graph && graph.meta) || {};
  if (fileName) return {about: `Your file, ${fileName}. It stays in this browser.`, credit: null, legend: null};
  if (meta.about) {
    return {
      about: meta.about,
      credit: creditOf(meta),
      colorBy: meta.colorBy && meta.colorBy[0] !== '_' ? meta.colorBy : '',
      legend: meta.legend || null
    };
  }
  if (name === 'Miserables') return {...MISERABLES, legend: null};
  if (GENERATED[name]) return {about: GENERATED[name], credit: null, legend: null};
  if (name.startsWith('Benchmark: ')) {
    return {
      about: 'One of the graphs the layout benchmark uses; the layout ideas were judged on them.',
      credit: {text: 'the layout benchmark set', href: 'https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/public/graphs'},
      legend: null
    };
  }
  if (name.includes('/')) return {...SUITESPARSE, legend: null};
  return {about: '', credit: null, legend: null};
}

// "Data: …" from the file's license and source
function creditOf(meta) {
  if (!meta.license) return null;
  let href = firstUrl(meta.source);
  if (/^WordNet/.test(meta.license)) {
    // the notice WordNet's license asks for is shipped next to the data
    return {text: 'WordNet 3.0, © Princeton University', href: 'graphs/data/WORDNET-LICENSE.txt'};
  }
  return {text: meta.license, href};
}

function firstUrl(text) {
  let match = /https?:\/\/[^\s)]+/.exec(text || '');
  return match ? match[0] : '';
}
