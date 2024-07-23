import createPatternBuilder from './createPatternBuilder.js';

export default function generateIntegratorFunction(dimension) {
  const code = generateIntegratorFunctionBody(dimension);
  return new Function('bodies', 'timeStep', 'adaptiveTimeStepWeight', code);
}

export function generateIntegratorFunctionBody(dimension) {
  const pattern = createPatternBuilder(dimension);
  const code = `
  const length = bodies.length;
  if (length === 0) return 0;

  ${pattern('let d{var} = 0, t{var} = 0;', {indent: 2})}

  for (let i = 0; i < length; ++i) {
    const body = bodies[i];
    if (body.isPinned) continue;

    if (adaptiveTimeStepWeight && body.springCount) {
      timeStep = (adaptiveTimeStepWeight * body.springLength/body.springCount);
    }

    const coeff = timeStep / body.mass;

    ${pattern('body.velocity.{var} += coeff * body.force.{var};', {indent: 4})}
    ${pattern('const v{var} = body.velocity.{var};', {indent: 4})}
    const v = Math.sqrt(${pattern('v{var} * v{var}', {join: ' + '})});

    if (v > 1) {
      // We normalize it so that we move within timeStep range. 
      // for the case when v <= 1 - we let velocity to fade out.
      ${pattern('body.velocity.{var} = v{var} / v;', {indent: 6})}
    }

    ${pattern('d{var} = timeStep * body.velocity.{var};', {indent: 4})}

    ${pattern('body.pos.{var} += d{var};', {indent: 4})}

    ${pattern('t{var} += Math.abs(d{var});', {indent: 4})}
  }

  return (${pattern('t{var} * t{var}', {join: ' + '})})/length;
`;
  return code;
}
