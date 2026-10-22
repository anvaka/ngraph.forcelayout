const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateClearForcesFunction;
module.exports.generateClearForcesFunctionBody = generateClearForcesFunctionBody;

function generateClearForcesFunction(dimension) {
  let code = generateClearForcesFunctionBody(dimension);
  return new Function('store', code);
}

/**
 * Zeroes the force and spring counters of every body that is not pinned.
 */
function generateClearForcesFunctionBody(dimension) {
  let pattern = createPatternBuilder(dimension);
  return `
  var force = store.force, pinned = store.pinned;
  var springCount = store.springCount, springLength = store.springLength;
  for (var i = 0, n = store.n; i < n; ++i) {
    if (pinned[i]) continue;
    var offset = i * ${dimension};
    ${pattern('force[offset{+k}] = 0;', {join: ' '})}
    springCount[i] = 0;
    springLength[i] = 0;
  }
`;
}
