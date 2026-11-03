// The parts of the copied program that make the user's page look like the demo: where the graph
// comes from, and how it is drawn (the same colours, sizes, labels and camera as lib/look.js and
// drawing.js give the demo). Settings as code (components/CodeSettings.vue) puts them around the
// createLayout() call the visitor edits.
//
// Each part is {packages: [npm names], addons: [modules/ folder names], imports: [lines],
// lines: [lines], helpers: [lines]}: `helpers` go at the end of the program.
import {hasNames, styleOptions} from './look.js';
import {labelledGraphs} from './loadLabelledGraph.js';
import {COMMIT} from './release.js';

const SUITESPARSE = 'https://s3.amazonaws.com/yasiv_uf/out/';

// Graphs the demo generates, as code a user can run
const GENERATED = {
  'Binary': {gen: 'generate.balancedBinTree(10)'},
  'Grid 100x100 (10k)': {gen: 'generate.grid(100, 100)'},
  'Binary tree (8k)': {gen: 'generate.balancedBinTree(12)'},
  'Watts-Strogatz (10k)': {gen: 'generate.wattsStrogatz(10000, 6, 0.05)'},
  'Cube 20x20x20 (8k)': {gen: 'generate.grid3(20, 20, 20)'},
  'Barabasi-Albert (20k)': {fn: 'barabasiAlbert', call: 'barabasiAlbert(20000, 2)'},
  'Barabasi-Albert (100k)': {fn: 'barabasiAlbert', call: 'barabasiAlbert(100000, 2)'},
  'Scale-free tree (10k)': {fn: 'barabasiAlbert', call: 'barabasiAlbert(10000, 1)'},
  'Groups 8x250 (2k)': {fn: 'plantedGroups', call: 'plantedGroups(8, 250)'},
  'Many pieces (300)': {fn: 'manyPieces', call: 'manyPieces(300)'}
};

// The same generators as loadGraph.js, with the same seeds, so the user gets the same graph
const FUNCTIONS = {
  seededRandom: [
    `function seededRandom(seed) {`,
    `  return () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };`,
    `}`
  ],
  barabasiAlbert: [
    `// Preferential attachment: each new node links to m nodes, picked by their links`,
    `function barabasiAlbert(n, m) {`,
    `  const random = seededRandom(42), graph = createGraph(), ends = [];`,
    `  for (let i = 0; i <= m; i++) for (let j = 0; j < i; j++) { graph.addLink(i, j); ends.push(i, j); }`,
    `  for (let i = m + 1; i < n; i++) {`,
    `    const targets = new Set();`,
    `    while (targets.size < m) targets.add(ends[Math.floor(random() * ends.length)]);`,
    `    targets.forEach(t => { graph.addLink(i, t); ends.push(i, t); });`,
    `  }`,
    `  return graph;`,
    `}`
  ],
  plantedGroups: [
    `// Groups of \`size\` nodes, each linked to 3 of its group; one in eight links anywhere`,
    `function plantedGroups(groups, size) {`,
    `  const random = seededRandom(7), pick = n => Math.floor(random() * n), graph = createGraph();`,
    `  for (let u = 0; u < groups * size; u++) graph.addNode(u, {group: Math.floor(u / size)});`,
    `  for (let u = 0; u < groups * size; u++) {`,
    `    const group = Math.floor(u / size);`,
    `    for (let k = 0; k < 3; k++) { const v = group * size + pick(size); if (v !== u) graph.addLink(u, v); }`,
    `    if (random() < 0.12) graph.addLink(u, pick(groups * size));`,
    `  }`,
    `  return graph;`,
    `}`
  ],
  manyPieces: [
    `// Separate pieces of 8 to 400 nodes: random trees with a few loops`,
    `function manyPieces(count) {`,
    `  const random = seededRandom(42), pick = n => Math.floor(random() * n), graph = createGraph();`,
    `  let next = 0;`,
    `  for (let p = 0; p < count; p++) {`,
    `    const size = 2 + Math.floor(400 / (1 + pick(60))), base = next;`,
    `    next += size;`,
    `    for (let i = 1; i < size; i++) graph.addLink(base + i, base + pick(i));`,
    `    for (let k = 0; k < size / 10; k++) { const a = base + pick(size), b = base + pick(size); if (a !== b) graph.addLink(a, b); }`,
    `  }`,
    `  return graph;`,
    `}`
  ],
  loadGraphFile: [
    `// The demo's graph files: {fields, nodes: [[...fields]], links: [from, to, ...], linkData?},`,
    `// with what colours them: colorBy, and the data's own palette and linkColors`,
    `async function loadGraphFile(url) {`,
    `  const doc = await (await fetch(url)).json();`,
    `  const graph = createGraph(), ids = [], idAt = doc.fields.indexOf('id');`,
    `  doc.nodes.forEach((row, i) => {`,
    `    const data = {};`,
    `    doc.fields.forEach((field, k) => { if (k !== idAt && row[k] != null) data[field] = row[k]; });`,
    `    ids[i] = idAt < 0 ? i : row[idAt];`,
    `    graph.addNode(ids[i], data);`,
    `  });`,
    `  for (let i = 0; i + 1 < doc.links.length; i += 2) {`,
    `    graph.addLink(ids[doc.links[i]], ids[doc.links[i + 1]], doc.linkData ? doc.linkData[i / 2] : undefined);`,
    `  }`,
    `  return {graph, style: {colorBy: doc.colorBy, palette: doc.palette, linkColors: doc.linkColors}};`,
    `}`
  ],
  loadMatrix: [
    `// A SuiteSparse matrix as a graph: a node per row, a link per nonzero`,
    `async function loadMatrix(url) {`,
    `  const {links, recordsPerEdge} = await (await fetch(url)).json();`,
    `  const graph = createGraph();`,
    `  for (let i = 0; i < links.length - 1; i += recordsPerEdge) graph.addLink(links[i], links[i + 1]);`,
    `  return graph;`,
    `}`
  ],
  loadEdgeList: [
    `// The layout benchmark's graphs: {n, edges: [from, to, ...]}`,
    `async function loadEdgeList(url) {`,
    `  const {n, edges} = await (await fetch(url)).json();`,
    `  const graph = createGraph();`,
    `  for (let i = 0; i < n; i++) graph.addNode(i);`,
    `  for (let i = 0; i + 1 < edges.length; i += 2) graph.addLink(edges[i], edges[i + 1]);`,
    `  return graph;`,
    `}`
  ]
};

/**
 * Where the graph on screen comes from, as code: `name` is the picker's graph, `fileName` a file
 * the visitor opened, `base` the URL the demo is served from (its data files are there).
 */
export function graphProgram(name, fileName, base) {
  let part = {packages: ['ngraph.graph'], addons: [], imports: [`import createGraph from 'ngraph.graph';`], lines: [], helpers: []};
  let helper = fn => {
    if (fn === 'barabasiAlbert' || fn === 'plantedGroups' || fn === 'manyPieces') addHelper(part, 'seededRandom');
    addHelper(part, fn);
  };
  if (fileName) {
    part.packages.push('ngraph.fromdot');
    part.imports.push(`import fromDot from 'ngraph.fromdot';`);
    part.lines.push(`// Your file, ${fileName}: its text (a .dot file; for ngraph JSON, use ngraph.fromjson)`,
      `const graph = fromDot(await (await fetch('${jsString(fileName)}')).text());`);
  } else if (name === 'Miserables') {
    part.packages.push('miserables');
    part.imports.push(`import miserables from 'miserables';`);
    part.lines.push(`const graph = miserables; // Les Misérables, from D. E. Knuth's Stanford GraphBase`);
  } else if (GENERATED[name]) {
    let g = GENERATED[name];
    if (g.gen) {
      part.packages.push('ngraph.generators');
      part.imports.push(`import generate from 'ngraph.generators';`);
      part.lines.push(`const graph = ${g.gen}; // ${name}`);
    } else {
      helper(g.fn);
      part.lines.push(`const graph = ${g.call}; // ${name}`);
    }
  } else if (labelledGraphs[name]) {
    helper('loadGraphFile');
    part.fileStyle = true;
    part.lines.push(`// ${name}, from the demo's data`,
      `const {graph, style} = await loadGraphFile('${base}graphs/data/${labelledGraphs[name]}.json');`);
  } else if (name.startsWith('Benchmark: ')) {
    helper('loadEdgeList');
    part.lines.push(`const graph = await loadEdgeList('${base}graphs/${name.slice('Benchmark: '.length)}.json'); // ${name}`);
  } else if (name.includes('/')) {
    helper('loadMatrix');
    part.lines.push(`const graph = await loadMatrix('${SUITESPARSE}${name}/index.js'); // ${name}, SuiteSparse (CC BY 4.0)`);
  } else {
    part.lines.push(`const graph = createGraph(); // or yours`,
      `graph.addLink('a', 'b'); graph.addLink('b', 'c'); graph.addLink('c', 'a');`);
  }
  return part;
}

/**
 * How the demo draws `graph`, as code: a full-window canvas, the view (modules/view) with the
 * demo's style module options, labels and the camera fit. `state`: {springLength, fileStyle (the
 * graph's colours come with its file)}.
 */
export function drawingProgram(graph, state) {
  let part = {
    // the view's w-gl (its peer dependency): one copy for the page and the view
    packages: ['w-gl@0.21'], addons: ['view'],
    imports: [
      `import {createScene} from 'w-gl';`,
      `import createView, {styleNodes, fitLayout, labelNodes, hoverNodes, dragNodes, selectNodes, inspectNodes} from 'ngraph.forcelayout.view';`
    ],
    lines: [], helpers: []
  };
  let meta = (graph && graph.meta) || {};
  let options = graph ? styleOptions(graph, state.springLength) : {};
  let named = graph && hasNames(graph);
  // What the style module gets: a file's own colouring comes with the file
  let own = [];
  if (options.background) own.push(`background: '${options.background}'`);
  if (options.unit) own.push(`unit: ${options.unit}`);
  if (!state.fileStyle && options.colorBy) own.push(`colorBy: '${jsString(options.colorBy)}'`);
  let styleText = state.fileStyle ? `{...style, ${own.join(', ')}}` : `{${own.join(', ')}}`;
  let lines = part.lines;
  if (meta.license) lines.push(`// Data: ${meta.license}${firstUrl(meta.source) ? ', ' + firstUrl(meta.source) : ''}`);
  lines.push(
    `// Draw it as the demo does: a canvas over the window, the view (modules/view) on a w-gl scene`,
    `const canvas = document.body.appendChild(document.createElement('canvas'));`,
    `canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';`,
    `const scene = createScene(canvas, {wglContextOptions: {antialias: false}});`,
    `const view = createView(scene, {graph, layout});`,
    `view.use(styleNodes, ${styleText}); // colour by category, size by links, links by their ink`,
    `view.use(fitLayout); // the whole drawing in view, until you move the camera`
  );
  if (named) lines.push(meta.importance ? `view.use(labelNodes, {importance: '${jsString(meta.importance)}'});` : `view.use(labelNodes);`);
  lines.push(`[hoverNodes, dragNodes, selectNodes, inspectNodes].forEach(module => view.use(module));`);
  return part;
}

function firstUrl(text) {
  let match = /https?:\/\/[^\s)]+/.exec(text || '');
  return match ? match[0] : '';
}


/**
 * The install lines: npm packages, and the add-ons from a clone of the repository, inside the
 * project folder (so the add-ons find the project's w-gl). Until a release, the library and the
 * add-ons come from the commit this page was built from, so the code is the code that drew it.
 */
export function installLines(parts, installLine, repo, released) {
  let packages = [], addons = [];
  parts.forEach(part => {
    part.packages.forEach(p => { if (!packages.includes(p)) packages.push(p); });
    part.addons.forEach(a => { if (!addons.includes(a)) addons.push(a); });
  });
  let lines = [`// ${installLine} ${packages.join(' ')}`];
  if (addons.length) {
    lines.push(`// add-ons, not on npm: in this project's folder, git clone ${repo}` +
      (!released && COMMIT ? ` && git -C ngraph.forcelayout checkout ${COMMIT}` : ''),
    `// then npm i ${addons.map(name => `./ngraph.forcelayout/modules/${name}`).join(' ')}`);
  }
  return lines;
}


function addHelper(part, name) {
  if (part.helpers.some(line => line.startsWith(`function ${name}(`) || line.startsWith(`async function ${name}(`))) return;
  part.helpers.push('', ...FUNCTIONS[name]);
}






function jsString(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
