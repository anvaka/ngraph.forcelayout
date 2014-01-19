var graph = require('ngraph.generators').grid(100, 100);
var simulator = require('../')(graph);
var iterationsCount = 100;

console.log('Performing ' + iterationsCount + ' iterations of grid 100x100');
var started = new Date();
for (var i = 0; i < iterationsCount; ++i) {
  simulator.step();
}

var doneMs = new Date() - started;
console.log('Done in ' + doneMs + 'ms');
