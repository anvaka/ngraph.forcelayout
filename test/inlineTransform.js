var test = require('tap').test;
var fs = require('fs');
var inlineTransform = require('../inline-transform');
var createRepulsionLaw = require('../lib/repulsionLaw');
var generateDualTree = require('../lib/codeGenerators/generateDualTree');
var createBodies = require('./helpers/createBodies');
var random = require('ngraph.random').random(3);

// The 2D bundle replaces code generators with the code they generate (see inline-transform.js)
test('the pre-generated dual tree gives the same forces', function (t) {
  var generate = transformed('generateDualTree');
  var settings = { gravity: -12, theta: 0.8 };
  var forces = [generate(2), generateDualTree(2)].map(function (createDualTree) {
    var store = randomStore();
    createDualTree(settings).computeForces(store);
    return Array.from(store.force.subarray(0, store.n * 2));
  });
  t.same(forces[0], forces[1], 'same numbers');
  t.end();
});

test('pre-generated trees take only the default law', function (t) {
  ['generateQuadTree', 'generateDualTree'].forEach(function (name) {
    var generate = transformed(name);
    t.ok(generate(2, createRepulsionLaw()), name + ': default law');
    t.throws(function () { generate(2, createRepulsionLaw('exp(-r) / r^2')); }, /default repulsion law only/, name + ': other law');
  });
  t.end();
});

function transformed(name) {
  var file = require.resolve('../lib/codeGenerators/' + name);
  var code = inlineTransform(2).transform(fs.readFileSync(file, 'utf8'), file).code;
  var module = { exports: {} };
  new Function('module', 'exports', 'require', code)(module, module.exports, require);
  return module.exports;
}

function randomStore() {
  random = require('ngraph.random').random(3);
  var store = createBodies(500, 2).store;
  for (var i = 0; i < store.n * 2; ++i) store.pos[i] = (random.nextDouble() - 0.5) * 100;
  return store;
}
