const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateCreateSpringForceFunction;
module.exports.generateCreateSpringForceFunctionBody = generateCreateSpringForceFunctionBody;

function generateCreateSpringForceFunction(dimension) {
  let code = generateCreateSpringForceFunctionBody(dimension);
  return new Function('options', 'random', code);
}

function generateCreateSpringForceFunctionBody(dimension) {
  let pattern = createPatternBuilder(dimension);
  let applyForce = (indent, withStats) => `var d = r - length;
${indent}var coefficient = ((springCoefficient[i] > 0) ? springCoefficient[i] : options.springCoefficient) * d / r;

${indent}${pattern('force[offset1{+k}] += coefficient * d{var};', {indent: indent.length})}
${indent}${pattern('force[offset2{+k}] -= coefficient * d{var};', {indent: indent.length})}` + (withStats ? `
${indent}springCount[body1] += 1;
${indent}springLength[body1] += r;
${indent}springCount[body2] += 1;
${indent}springLength[body2] += r;` : '');
  let readSpring = indent => `var body1 = from[i];
${indent}var body2 = to[i];
${indent}var offset1 = body1 * ${dimension};
${indent}var offset2 = body2 * ${dimension};
${indent}var length = restLength[i] < 0 ? options.springLength : restLength[i];`;
  let readArrays = indent => `var from = springs.from, to = springs.to, restLength = springs.length, springCoefficient = springs.coefficient;
${indent}var pos = store.pos, force = store.force;
${indent}var springCount = store.springCount, springLength = store.springLength;`;
  let updateUntilZeroLength = (name, withStats) => `
  function ${name}(springs, store, i) {
    ${readArrays('    ')}
    while (i--) {
      ${readSpring('      ')}
      ${pattern('var d{var} = pos[offset2{+k}] - pos[offset1{+k}];', {indent: 6})}
      var r = Math.sqrt(${pattern('d{var} * d{var}', {join: ' + '})});
      if (r === 0) return i;

      ${applyForce('      ', withStats)}
    }
    return -1;
  }`;

  let code = `
  if (!Number.isFinite(options.springCoefficient)) throw new Error('Spring coefficient is not a number');
  if (!Number.isFinite(options.springLength)) throw new Error('Spring length is not a number');

  return {
    /**
     * Updates forces of all springs in \`springs\` (a spring store), last spring first.
     * Spring ends are bodies of \`store\`. With \`withStats\` it also counts springs and sums
     * their lengths per body (\`store.springCount\`, \`store.springLength\`), which the adaptive
     * time step needs.
     */
    update: function (springs, store, withStats) {
      var i = springs.n;
      var update = withStats ? updateWithStatsUntilZeroLength : updateUntilZeroLength;
      while ((i = update(springs, store, i)) >= 0) {
        updateZeroLength(springs, store, i, withStats);
      }
    }
  };

  // These update springs i - 1, i - 2, ... 0 and return -1, or stop at the first spring whose
  // ends are at the same point and return its index. The loop has no function calls, which
  // lets it keep the arrays in registers.
${updateUntilZeroLength('updateUntilZeroLength', false)}
${updateUntilZeroLength('updateWithStatsUntilZeroLength', true)}

  // Ends at the same point: push them apart in a random direction.
  function updateZeroLength(springs, store, i, withStats) {
    ${readArrays('    ')}
    ${readSpring('    ')}
    ${pattern('var d{var} = (random.nextDouble() - 0.5) / 50;', {indent: 4})}
    var r = Math.sqrt(${pattern('d{var} * d{var}', {join: ' + '})});

    ${applyForce('    ', false)}
    if (withStats) {
      springCount[body1] += 1;
      springLength[body1] += r;
      springCount[body2] += 1;
      springLength[body2] += r;
    }
  }
`;
  return code;
}
