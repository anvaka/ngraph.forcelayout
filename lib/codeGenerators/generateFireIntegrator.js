const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateFireIntegratorFunction;
module.exports.generateFireIntegratorFunctionBody = generateFireIntegratorFunctionBody;

/**
 * FIRE (Fast Inertial Relaxation Engine, Bitzek et al. 2006) integrator.
 *
 * Instead of a constant drag, the whole system keeps its momentum while it moves
 * "downhill" (total power F.v > 0), and velocities are steered towards forces. As soon
 * as the system goes uphill, all velocities are zeroed and the system starts again from
 * rest. Drag is not applied in this mode.
 *
 * Returns a factory: each simulator needs its own integrator, since FIRE keeps state.
 */
function generateFireIntegratorFunction(dimension) {
  let code = generateFireIntegratorFunctionBody(dimension);
  return new Function(code);
}

function generateFireIntegratorFunctionBody(dimension) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  var ALPHA_START = 0.1;
  var ALPHA_DECAY = 0.99;
  var MIN_POSITIVE_STEPS = 5;

  var alpha = ALPHA_START;
  var positiveSteps = 0;

  return function integrate(bodies, timeStep, adaptiveTimeStepWeight, maxVelocity) {
    var length = bodies.length;
    if (length === 0) return 0;

    var i, body;
    var power = 0, velocityNorm = 0, forceNorm = 0;
    for (i = 0; i < length; ++i) {
      body = bodies[i];
      if (body.isPinned) continue;
      ${pattern('var f{var} = body.force.{var}, v{var} = body.velocity.{var};', {indent: 6})}
      power += ${pattern('f{var} * v{var}', {join: ' + '})};
      velocityNorm += ${pattern('v{var} * v{var}', {join: ' + '})};
      forceNorm += ${pattern('f{var} * f{var}', {join: ' + '})};
    }

    if (power > 0) {
      // Going downhill: steer velocities towards forces, and trust momentum more over time.
      var keep = 1 - alpha;
      var mix = forceNorm > 0 ? alpha * Math.sqrt(velocityNorm / forceNorm) : 0;
      for (i = 0; i < length; ++i) {
        body = bodies[i];
        if (body.isPinned) continue;
        ${pattern('body.velocity.{var} = keep * body.velocity.{var} + mix * body.force.{var};', {indent: 8})}
      }
      positiveSteps += 1;
      if (positiveSteps > MIN_POSITIVE_STEPS) alpha *= ALPHA_DECAY;
    } else {
      // Going uphill (we overshot): stop everything and start from rest.
      for (i = 0; i < length; ++i) {
        body = bodies[i];
        if (body.isPinned) continue;
        ${pattern('body.velocity.{var} = 0;', {indent: 8})}
      }
      positiveSteps = 0;
      alpha = ALPHA_START;
    }

    ${pattern('var d{var} = 0, t{var} = 0;', {indent: 4})}
    var maxV = maxVelocity > 0 ? maxVelocity : 1;

    for (i = 0; i < length; ++i) {
      body = bodies[i];
      if (body.isPinned) continue;

      var dt = timeStep;
      if (adaptiveTimeStepWeight && body.springCount) {
        dt = (adaptiveTimeStepWeight * body.springLength/body.springCount);
      }

      var coeff = dt / body.mass;

      ${pattern('body.velocity.{var} += coeff * body.force.{var};', {indent: 6})}
      ${pattern('var u{var} = body.velocity.{var};', {indent: 6})}
      var v = Math.sqrt(${pattern('u{var} * u{var}', {join: ' + '})});

      if (v > maxV) {
        ${pattern('body.velocity.{var} = maxV * u{var} / v;', {indent: 8})}
      }

      ${pattern('d{var} = dt * body.velocity.{var};', {indent: 6})}

      ${pattern('body.pos.{var} += d{var};', {indent: 6})}

      ${pattern('t{var} += Math.abs(d{var});', {indent: 6})}
    }

    return (${pattern('t{var} * t{var}', {join: ' + '})})/length;
  };
`;
  return code;
}
