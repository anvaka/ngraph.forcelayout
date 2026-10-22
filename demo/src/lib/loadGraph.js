import createGraph from 'ngraph.graph';
import miserables from 'miserables';
import generate from 'ngraph.generators';

let cache = simpleCache();

const generatedGraphs = {
  'Grid 100x100 (10k)': () => generate.grid(100, 100),
  'Binary tree (8k)': () => generate.balancedBinTree(12),
  'Watts-Strogatz (10k)': () => generate.wattsStrogatz(10000, 6, 0.05),
  'Barabasi-Albert (20k)': () => barabasiAlbert(20000, 2),
  'Barabasi-Albert (100k)': () => barabasiAlbert(100000, 2),
  'Scale-free tree (10k)': () => barabasiAlbert(10000, 1),
  'Cube 20x20x20 (8k)': () => generate.grid3(20, 20, 20),
  'Groups 8x250 (2k)': () => plantedGroups(8, 250),
  'Many pieces (300)': () => manyPieces(300),
};

const BENCHMARK = 'Benchmark: ';

export default function loadGraph(name) {
  if (name === 'Miserables') return Promise.resolve(miserables);
  if (name === 'Binary') return Promise.resolve(generate.balancedBinTree(10));
  if (generatedGraphs[name]) return Promise.resolve(generatedGraphs[name]());
  if (name.startsWith(BENCHMARK)) return loadBenchmarkGraph(name.slice(BENCHMARK.length));

  let mtxObject = cache.get(name);
  if (mtxObject) return Promise.resolve(renderGraph(mtxObject.links, mtxObject.recordsPerEdge));

  return fetch(`https://s3.amazonaws.com/yasiv_uf/out/${name}/index.js`, {
    mode: 'cors'
  })
  .then(x => x.json())
  .then(mtxObject => {
    cache.put(name, mtxObject);
    return renderGraph(mtxObject.links, mtxObject.recordsPerEdge);
  });
}
// Benchmark graphs are {n, edges: [from, to, from, to, ...]} with node ids 0..n-1.
function loadBenchmarkGraph(id) {
  return fetch(`${import.meta.env.BASE_URL}graphs/${id}.json`)
    .then(x => x.json())
    .then(({n, edges}) => {
      let graph = createGraph();
      // Some benchmark graphs have isolated nodes, which a list of links alone would drop
      for (let i = 0; i < n; i++) graph.addNode(i);
      for (let i = 0; i + 1 < edges.length; i += 2) graph.addLink(edges[i], edges[i + 1]);
      return graph;
    });
}

function renderGraph (edges, recordsPerEdge) {
  let graph = createGraph();
  for(var i = 0; i < edges.length - 1; i += recordsPerEdge) {
      graph.addLink(edges[i], edges[i + 1]);
  }
  return graph
}

function simpleCache() {
    var supported = 'localStorage' in window;

    return {
        get : function(key) {
            if (!supported) { return null; }
            var graphData = JSON.parse(window.localStorage.getItem(key));
            if (!graphData || graphData.recordsPerEdge === undefined) {
              // this is old cache. Invalidate it
              return null;
            }
            return graphData;
        },
        put : function(key, value) {
            if (!supported) { return false;}
            try {
                window.localStorage.setItem(key, JSON.stringify(value));
            } catch(err) {
                // TODO: make something clever than this in case of quata exceeded.
                window.localStorage.clear();
            }
        }
    };
}

// Preferential attachment: each new node links to `m` existing nodes, picked
// proportionally to their degree. Gives a few large hubs.
function barabasiAlbert(n, m) {
  const random = seededRandom(42);
  let graph = createGraph();
  let endpoints = [];
  for (let i = 0; i <= m; i++) {
    for (let j = 0; j < i; j++) {
      graph.addLink(i, j);
      endpoints.push(i, j);
    }
  }
  for (let i = m + 1; i < n; i++) {
    let targets = new Set();
    while (targets.size < m) targets.add(endpoints[Math.floor(random() * endpoints.length)]);
    targets.forEach(target => {
      graph.addLink(i, target);
      endpoints.push(i, target);
    });
  }
  return graph;
}

// Groups of `size` nodes: each node links to 3 random nodes of its own group,
// and about one node in eight also links to a random node anywhere.
function plantedGroups(groups, size) {
  const random = seededRandom(7);
  const pick = n => Math.floor(random() * n);
  let graph = createGraph();
  for (let u = 0; u < groups * size; u++) {
    const group = Math.floor(u / size);
    for (let k = 0; k < 3; k++) {
      const v = group * size + pick(size);
      if (v !== u) graph.addLink(u, v);
    }
    if (random() < 0.12) graph.addLink(u, pick(groups * size));
  }
  return graph;
}

// Separate pieces of very different sizes (8 to 400 nodes): each is a random
// tree with a few extra links that make loops.
function manyPieces(count) {
  const random = seededRandom(42);
  const pick = n => Math.floor(random() * n);
  let graph = createGraph();
  let next = 0;
  for (let p = 0; p < count; p++) {
    const size = 2 + Math.floor(400 / (1 + pick(60)));
    const base = next;
    next += size;
    for (let i = 1; i < size; i++) graph.addLink(base + i, base + pick(i));
    for (let k = 0; k < size / 10; k++) {
      const a = base + pick(size), b = base + pick(size);
      if (a !== b) graph.addLink(a, b);
    }
  }
  return graph;
}

function seededRandom(seed) {
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
