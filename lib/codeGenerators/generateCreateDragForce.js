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
  if (!Number.isFinite(options.dragCoeff)) throw new Error('dragCoeff is not a finite number');

  return {
    update: function(body) {
      ${pattern('body.force.{var} -= options.dragCoeff * body.velocity.{var};', {indent: 6})}
    }
  };
`
  return code;
}
