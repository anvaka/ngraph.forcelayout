import Graph from 'graphology';
import completeGraph from 'graphology-generators/classic/complete';
import createLayout from '../index.js';

import Benchmark from 'benchmark';
const suite = new Benchmark.Suite;

// add tests
suite.add('Run default', function() {
  const graph = completeGraph(Graph, 100);
  const layout = createLayout(graph);
  for (let i = 0; i < 20; ++i) {
    layout.step();
  }
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
})
// run async
.run({ 'async': true });
