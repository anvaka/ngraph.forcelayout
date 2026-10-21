const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateCreateDragForceFunction;
module.exports.generateCreateDragForceFunctionBody = generateCreateDragForceFunctionBody;

function generateCreateDragForceFunction(dimension) {
  let code = generateCreateDragForceFunctionBody(dimension);
  return new Function('options', code);
}

function generateCreateDragForceFunctionBody(dimension) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    /**
     * Slows down every body of the store that is not pinned.
     */
    update: function(store) {
      var force = store.force, velocity = store.velocity, pinned = store.pinned;
      var dragCoefficient = options.dragCoefficient;
      for (var i = 0, n = store.n; i < n; ++i) {
        if (pinned[i]) continue;
        var offset = i * ${dimension};
        ${pattern('force[offset{+k}] -= dragCoefficient * velocity[offset{+k}];', {indent: 8})}
      }
    }
  };
`;
  return code;
}
