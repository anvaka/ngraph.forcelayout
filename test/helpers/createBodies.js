var createBodyStore = require('../../lib/createBodyStore');
var generateCreateBody = require('../../lib/codeGenerators/generateCreateBody');

/**
 * Makes `count` bodies that share one body store, the way a simulator keeps them. Generated
 * forces and integrators work on the store; tests read the bodies.
 */
module.exports = function createBodies(count, dimensions) {
  dimensions = dimensions || 2;
  var Body = generateCreateBody(dimensions);
  var store = createBodyStore(dimensions, count);
  var bodies = [];
  for (var i = 0; i < count; ++i) bodies.push(Body.inStore(store, store.add()));
  return { store: store, bodies: bodies };
};
