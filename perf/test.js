const graph = require('ngraph.generators').grid(20, 20);

const Benchmark = require('benchmark');
const suite = new Benchmark.Suite;

// add tests
suite.add('Run default', function() {
  const layout = require('../')(graph);
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
