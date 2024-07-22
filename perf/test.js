const Graph = require('graphology');
const completeGraph = require('graphology-generators/classic/complete')(Graph, 20);

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

// add tests
suite.add('Run default', function() {
  const layout = require('../')(completeGraph);
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
