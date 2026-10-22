const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateIntegratorFunction;
module.exports.generateIntegratorFunctionBody = generateIntegratorFunctionBody;
module.exports.inertiaColumn = inertiaColumn;

/**
 * Moves bodies: v += dt * force / inertia, then pos += dt * v. `inertia` names the body column
 * forces are divided by (the mass by default).
 */
function generateIntegratorFunction(dimension, inertia) {
  let code = generateIntegratorFunctionBody(dimension, inertia);
  return new Function('store', 'timeStep', 'adaptiveTimeStepWeight', 'maxVelocity', code);
}

function generateIntegratorFunctionBody(dimension, inertia) {
  let pattern = createPatternBuilder(dimension);
  let code = `
  var length = store.n;
  if (length === 0) return 0;
  var pos = store.pos, velocity = store.velocity, force = store.force, mass = ${inertiaColumn(inertia)};
  var pinned = store.pinned, springCount = store.springCount, springLength = store.springLength;

  ${pattern('var d{var} = 0, t{var} = 0;', {indent: 2})}
  var maxV = maxVelocity > 0 ? maxVelocity : 1;

  for (var i = 0; i < length; ++i) {
    if (pinned[i]) continue;

    var dt = timeStep;
    if (adaptiveTimeStepWeight && springCount[i]) {
      dt = (adaptiveTimeStepWeight * springLength[i]/springCount[i]);
    }

    var coeff = dt / mass[i];
    var offset = i * ${dimension};

    ${pattern('velocity[offset{+k}] += coeff * force[offset{+k}];', {indent: 4})}
    ${pattern('var v{var} = velocity[offset{+k}];', {indent: 4})}
    var v = Math.sqrt(${pattern('v{var} * v{var}', {join: ' + '})});

    if (v > maxV) {
      // We normalize it so that we move within timeStep range.
      // for the case when v <= maxV - we let velocity to fade out.
      ${pattern('velocity[offset{+k}] = maxV * v{var} / v;', {indent: 6})}
    }

    ${pattern('d{var} = dt * velocity[offset{+k}];', {indent: 4})}

    ${pattern('pos[offset{+k}] += d{var};', {indent: 4})}

    ${pattern('t{var} += Math.abs(d{var});', {indent: 4})}
  }

  return (${pattern('t{var} * t{var}', {join: ' + '})})/length;
`;
  return code;
}

// The default reads the mass as it always did, so its code stays the same
function inertiaColumn(inertia) {
  return !inertia || inertia === 'mass' ? 'store.mass' : 'store[' + JSON.stringify(inertia) + ']';
}
