// T8: how many of the demo's ideas WebGPU runs. Every idea on the first of its "Try on" graphs
// that the demo has, in 2D and 3D, planned against WebGPU's default limits (8 storage buffers)
// and against a wide profile (10, as on Apple GPUs); no device needed. Prints a verdict per idea
// and fails when a count drops below the one recorded here.
//
//   node modules/gpu/test/t8.js <demo root>   (a checkout with demo/src/prototypes, e.g. the demo branch)
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { gpuCapabilities } from '../index.js';

// Ideas that run, by dimension, when this module was last changed (M1: node formulas, sums, extra
// passes, any D), on a demo with the ideas track's rewrites (v2-2 guards with 1e30)
const EXPECTED = { 2: 7, 3: 17 };
const PROFILES = {
  'default (8)': {},
  'wide (10)': { maxStorageBuffersPerShaderStage: 10, maxComputeInvocationsPerWorkgroup: 1024, maxComputeWorkgroupSizeX: 1024, maxComputeWorkgroupStorageSize: 32768 },
};
const SETTINGS = { timeStep: 0.5, springLength: 10, springCoefficient: 0.8, dragCoefficient: 0.9, theta: 0.8, gravity: -12, maxVelocity: 4 };

async function main(root) {
  if (!root || !fs.existsSync(path.join(root, 'demo/src/prototypes'))) {
    throw new Error('usage: node modules/gpu/test/t8.js <demo root> (a checkout with demo/src/prototypes)');
  }
  const load = file => import(pathToFileURL(path.join(root, file)).href);
  const { default: createLayout } = await load('index.js');
  const { default: createGraph } = await load('node_modules/ngraph.graph/index.js');
  const ids = fs.readdirSync(path.join(root, 'demo/src/prototypes')).filter(name => /^(ru|v\d)-/.test(name)).sort();
  const counts = {};
  let failed = false;
  for (const D of [2, 3]) {
    for (const [profile, limits] of Object.entries(PROFILES)) {
      const backend = gpuCapabilities(limits);
      let runs = 0;
      console.log(`\n${D}D, ${profile} limits`);
      for (const id of ids) {
        const idea = (await load(`demo/src/prototypes/${id}/index.js`)).default;
        const name = (idea.tryGraphs || []).map(g => g.replace('Benchmark: ', ''))
          .find(g => fs.existsSync(path.join(root, `demo/public/graphs/${g}.json`))) || 'yeast';
        const { n, edges } = JSON.parse(fs.readFileSync(path.join(root, `demo/public/graphs/${name}.json`), 'utf8'));
        const graph = createGraph();
        for (let i = 0; i < n; i++) graph.addNode(i);
        for (let i = 0; i + 1 < edges.length; i += 2) graph.addLink(edges[i], edges[i + 1]);
        const settings = Object.assign({ dimensions: D }, SETTINGS);
        const layout = createLayout(graph, Object.assign({}, settings));
        const params = {};
        (idea.params || []).forEach(p => { params[p.key] = p.value; });
        const log = console.log, info = console.info;
        console.log = console.info = () => {};
        let control;
        try { control = idea.attach({ layout, graph, params, settings, steps: 0 }); } finally { console.log = log; console.info = info; }
        const plan = layout.simulator.plan(backend);
        if (plan.runs) runs++;
        const verdict = plan.runs ? 'runs' + (control && control.finish ? ' (final step after gpu.sync())' : '') :
          Array.from(new Set(plan.reasons)).join('; ');
        console.log(`  ${id.padEnd(24)} ${name.padEnd(12)} ${verdict}`);
        if (control && control.dispose) control.dispose();
        layout.dispose();
      }
      console.log(`T8 ${D}D, ${profile}: ${runs}/${ids.length} ideas run on WebGPU`);
      counts[`${D}D ${profile}`] = runs;
      if (runs < EXPECTED[D]) { failed = true; console.log(`  FAIL: fewer than ${EXPECTED[D]}`); }
    }
  }
  console.log('\nT8 counts:', JSON.stringify(counts));
  if (failed) process.exitCode = 1;
}

main(process.argv[2]).catch(e => { console.error(e.message); process.exitCode = 1; });
