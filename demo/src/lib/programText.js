// The parts of the copied program that make the user's page look like the demo: where the graph
// comes from, and how it is drawn (the same colours, sizes, labels and camera as lib/look.js and
// drawing.js give the demo). Settings as code (components/CodeSettings.vue) puts them around the
// createLayout() call the visitor edits.
//
// Each part is {packages: [npm names], addons: [modules/ folder names], imports: [lines],
// lines: [lines], helpers: [lines]}: `helpers` go at the end of the program.
import LOOK, {PALETTE, OTHER, colorsOf, hasNames} from './look.js';
import {labelledGraphs} from './loadLabelledGraph.js';

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
    `// The demo's graph files: {fields, nodes: [[...fields]], links: [from, to, ...], linkData?}`,
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
    `  return graph;`,
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
    part.lines.push(`// ${name}, from the demo's data (see its license there)`,
      `const graph = await loadGraphFile('${base}graphs/data/${labelledGraphs[name]}.json');`);
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
 * same colours, node sizes, labels and camera. `state`: {springLength, dimensions, linkAlpha,
 * nodeMinSize} as the demo has them now.
 */
export function drawingProgram(graph, state) {
  let part = {
    // the view's w-gl (its peer dependency): one copy for the page and the view
    packages: ['w-gl@0.21'], addons: ['view'],
    imports: [
      `import {createScene} from 'w-gl';`,
      `import createView, {fitLayout, labelNodes, hoverNodes, dragNodes, selectNodes, inspectNodes} from 'ngraph.forcelayout.view';`
    ],
    lines: [], helpers: []
  };
  let [r, g, b] = LOOK.background;
  let meta = (graph && graph.meta) || {};
  let unit = (state.springLength || 10) / 10;
  let alpha = round(state.linkAlpha === undefined ? LOOK.linkAlpha[1] : Math.max(1 / 255, state.linkAlpha));
  let lines = part.lines;
  lines.push(
    `// Draw it as the demo does: a canvas over the window, the view (modules/view) on a w-gl scene`,
    `const canvas = document.body.appendChild(document.createElement('canvas'));`,
    `canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%';`,
    `const scene = createScene(canvas, {wglContextOptions: {antialias: false}});`,
    `scene.setClearColor(${r} / 255, ${g} / 255, ${b} / 255, 1);`
  );
  lines.push(...colorLines(graph, meta, alpha));
  lines.push(
    `// Size from links: hubs read as hubs, leaves stay small`,
    `const linksOf = node => (node.links ? (node.links.size ?? node.links.length) : 0);`,
    `const nodeSize = node => ${unit} * (linksOf(node) <= 1 ? 0.5 : 0.5 * Math.sqrt(linksOf(node)));`,
    `const view = createView(scene, {`,
    `  graph, layout, nodeColor, nodeSize, linkColor, linkWidth: ${LOOK.linkWidth},`,
    `  nodeMinSize: ${round(state.nodeMinSize === undefined ? LOOK.nodeMinSize : state.nodeMinSize)}, nodeRoom: ${LOOK.nodeRoom},` +
      (state.dimensions > 2 ? ` fog: ${LOOK.fog},` : ''),
    `  styles: ${stylesText(LOOK.styles)}`,
    `});`,
    `view.use(fitLayout); // the whole drawing in view, until you move the camera`
  );
  let labels = `{color: ${hex32(LOOK.labels.color)}, halo: ${hex32(LOOK.labels.halo)}, haloWidth: ${LOOK.labels.haloWidth}` +
    (meta.importance ? `, importance: '${jsString(meta.importance)}'` : '') + '}';
  if (graph && hasNames(graph)) lines.push(`view.use(labelNodes, ${labels});`);
  lines.push(`[hoverNodes, dragNodes, selectNodes, inspectNodes].forEach(module => view.use(module));`);
  return part;
}

// The colour rule the demo uses for this graph (look.js colorsOf), written out
function colorLines(graph, meta, alpha) {
  let field = meta.colorBy || (graph && someNodeHas(graph, 'group') ? 'group' : null);
  let a = alphaByte(alpha), cross = alphaByte(alpha * LOOK.crossLinkShare);
  let neutral = hex32(((LOOK.linkRGB << 8) | cross) >>> 0);
  if (!field || !graph) {
    return [
      `const nodeColor = 0x90f8fcff;`,
      meta.linkColors ? ownLinkLine(meta, neutral) : `const linkColor = ${hex32(((LOOK.linkRGB << 8) | a) >>> 0)};`
    ];
  }
  let key = `node.data && node.data${propertyOf(field)}`;
  let lines = [];
  let colors = colorsOf(graph);
  let values = new Map();
  graph.forEachNode(node => {
    let value = node.data && node.data[field];
    if (value === undefined || value === null || value === '' || values.has(value)) return;
    values.set(value, colors.nodeColor(node));
  });
  let colorValues = values.size > 0 && [...values.keys()].every(value => /^#[0-9a-f]{3,6}$/i.test(String(value)));
  if (meta.palette) {
    // The data's own palette (London's lines): written out as the demo shows them
    let entries = [...values.entries()].map(([value, color]) => `  ${JSON.stringify(String(value))}: 0x${(color >>> 0).toString(16).padStart(8, '0')},`);
    lines.push(`// Colour: ${field}, the data's own colours (lightened where too dark for the canvas)`,
      `const colorOf = {`, ...entries, `};`,
      `const nodeColor = node => colorOf[${key}] || 0x${OTHER.slice(1)}ff;`);
  } else if (colorValues) {
    // The values are colours (metro lines)
    lines.push(`// Colour: the data's own (node.data${propertyOf(field)}); the demo also lightens colours too dark for the canvas`,
      `const nodeColor = node => (${key}) ? (parseInt(String(${key}).slice(1), 16) * 256 + 255) : 0x${OTHER.slice(1)}ff;`);
  } else {
    lines.push(
      `// Colour: ${field}, one colour per value, the most common first; the rest share grey`,
      `const PALETTE = ${JSON.stringify(PALETTE).replace(/"/g, "'").replace(/,/g, ', ')};`,
      `const counts = new Map();`,
      `graph.forEachNode(node => { const v = ${key}; if (v != null && v !== '') counts.set(v, (counts.get(v) || 0) + 1); });`,
      `const colorOf = new Map([...counts.keys()].sort((p, q) => counts.get(q) - counts.get(p) || String(p).localeCompare(String(q)))`,
      `  .map((v, i) => [v, parseInt((PALETTE[i] || '${OTHER}').slice(1), 16) * 256 + 255]));`,
      `const nodeColor = node => colorOf.get(${key}) || 0x${OTHER.slice(1)}ff;`
    );
  }
  if (meta.linkColors) {
    lines.push(ownLinkLine(meta, neutral));
  } else {
    lines.push(
      `// Links inside a group take its colour; links between groups are fainter white`,
      `const linkColor = link => {`,
      `  const from = graph.getNode(link.fromId), to = graph.getNode(link.toId);`,
      `  const v = from.data && from.data${propertyOf(field)};`,
      `  if (v == null || v !== (to.data && to.data${propertyOf(field)})) return ${neutral};`,
      `  return ((nodeColor(from) & 0xffffff00) | ${a}) >>> 0;`,
      `};`
    );
  }
  return lines;
}

// Links coloured by their own data (London's lines, metro colours)
function ownLinkLine(meta, neutral) {
  let alpha = alphaByte(0.8);
  if (meta.linkColors === 'self') {
    return `const linkColor = link => link.data ? ((parseInt(String(link.data).slice(1), 16) << 8 | ${alpha}) >>> 0) : ${neutral};`;
  }
  let table = Object.entries(meta.linkColors).map(([k, v]) => `${JSON.stringify(k)}: '${v}'`).join(', ');
  return `const lineColors = {${table}};\n` +
    `const linkColor = link => lineColors[link.data] ? ((parseInt(lineColors[link.data].slice(1), 16) << 8 | ${alpha}) >>> 0) : ${neutral};`;
}

// The commit the demo was built from (vite.config.js), or '' (tests, a build outside git)
// eslint-disable-next-line no-undef
export const COMMIT = typeof __DEMO_COMMIT__ === 'string' ? __DEMO_COMMIT__ : '';

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
  let library = !released && COMMIT ? `npm i anvaka/ngraph.forcelayout#${COMMIT}` : installLine;
  let lines = [`// ${library} ${packages.join(' ')}`];
  if (addons.length) {
    lines.push(`// add-ons, not on npm: in this project's folder, git clone ${repo}` +
      (!released && COMMIT ? ` && git -C ngraph.forcelayout checkout ${COMMIT}` : ''),
    `// then npm i ${addons.map(name => `./ngraph.forcelayout/modules/${name}`).join(' ')}`);
  }
  return lines;
}

// The view's styles as the demo has them: colours as 0xRRGGBBAA, other numbers as they are
function stylesText(styles) {
  let entries = Object.keys(styles).map(key => {
    let value = styles[key];
    let text = /Color$|Ring$|Halo$/.test(key) && value > 255 ? hex32(value) : String(value);
    return `${key}: ${text}`;
  });
  return `{${entries.join(', ')}}`;
}

function addHelper(part, name) {
  if (part.helpers.some(line => line.startsWith(`function ${name}(`) || line.startsWith(`async function ${name}(`))) return;
  part.helpers.push('', ...FUNCTIONS[name]);
}

function someNodeHas(graph, field) {
  let found = false, seen = 0;
  graph.forEachNode(node => {
    seen += 1;
    if (node.data && node.data[field] !== undefined) found = true;
    return found || seen >= 200;
  });
  return found;
}

function propertyOf(field) {
  return /^[A-Za-z_$][\w$]*$/.test(field) ? `.${field}` : `[${JSON.stringify(field)}]`;
}

function alphaByte(alpha) {
  return Math.max(1, Math.min(255, Math.round(alpha * 255)));
}

function hex32(value) {
  return '0x' + (value >>> 0).toString(16).padStart(8, '0');
}

function round(x) {
  return Math.round(x * 1000) / 1000;
}

function jsString(text) {
  return String(text).replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
