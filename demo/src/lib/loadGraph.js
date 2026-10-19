import createGraph from 'ngraph.graph';
import miserables from 'miserables';
import generate from 'ngraph.generators';

let cache = simpleCache();

const generatedGraphs = {
  'Grid 100x100 (10k)': () => generate.grid(100, 100),
  'Binary tree (8k)': () => generate.balancedBinTree(13),
  'Watts-Strogatz (10k)': () => generate.wattsStrogatz(10000, 6, 0.05),
  'Barabasi-Albert (20k)': () => barabasiAlbert(20000, 2),
  'Barabasi-Albert (100k)': () => barabasiAlbert(100000, 2),
};

export default function loadGraph(name) {
  if (name === 'Miserables') return Promise.resolve(miserables);
  if (name === 'Binary') return Promise.resolve(generate.balancedBinTree(10));
  if (generatedGraphs[name]) return Promise.resolve(generatedGraphs[name]());

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
  let seed = 42;
  const random = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
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
