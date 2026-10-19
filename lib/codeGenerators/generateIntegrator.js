const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateIntegratorFunction;
module.exports.generateIntegratorFunctionBody = generateIntegratorFunctionBody;

function generateIntegratorFunction(dimension) {
  let code = generateIntegratorFunctionBody(dimension);
  return new Function('bodies', 'timeStep', 'adaptiveTimeStepWeight', 'maxVelocity', code);
}

function generateIntegratorFunctionBody(dimension) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  var length = bodies.length;
  if (length === 0) return 0;

  ${pattern('var d{var} = 0, t{var} = 0;', {indent: 2})}
  var maxV = maxVelocity > 0 ? maxVelocity : 1;

  for (var i = 0; i < length; ++i) {
    var body = bodies[i];
    if (body.isPinned) continue;

    var dt = timeStep;
    if (adaptiveTimeStepWeight && body.springCount) {
      dt = (adaptiveTimeStepWeight * body.springLength/body.springCount);
    }

    var coeff = dt / body.mass;

    ${pattern('body.velocity.{var} += coeff * body.force.{var};', {indent: 4})}
    ${pattern('var v{var} = body.velocity.{var};', {indent: 4})}
    var v = Math.sqrt(${pattern('v{var} * v{var}', {join: ' + '})});

    if (v > maxV) {
      // We normalize it so that we move within timeStep range.
      // for the case when v <= maxV - we let velocity to fade out.
      ${pattern('body.velocity.{var} = maxV * v{var} / v;', {indent: 6})}
    }

    ${pattern('d{var} = dt * body.velocity.{var};', {indent: 4})}

    ${pattern('body.pos.{var} += d{var};', {indent: 4})}

    ${pattern('t{var} += Math.abs(d{var});', {indent: 4})}
  }

  return (${pattern('t{var} * t{var}', {join: ' + '})})/length;
`;
  return code;
}
