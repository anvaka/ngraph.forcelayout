import createPatternBuilder from './createPatternBuilder.js';

export default function generateCreateDragForceFunction(dimension) {
  const code = generateCreateDragForceFunctionBody(dimension);
  return new Function('options', code);
}

export function generateCreateDragForceFunctionBody(dimension) {
  const pattern = createPatternBuilder(dimension);
  const code = `
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    update: function(body) {
      ${pattern('body.force.{var} -= options.dragCoefficient * body.velocity.{var};', {indent: 6})}
    }
  };
`;
  return code;
}
