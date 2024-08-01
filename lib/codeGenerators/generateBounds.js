
import createPatternBuilder from './createPatternBuilder.js';

export default function generateBoundsFunction(dimension) {
  const code = generateBoundsFunctionBody(dimension);
  return new Function('graph', 'settings', 'random', code);
}

export function generateBoundsFunctionBody(dimension) {
  const pattern = createPatternBuilder(dimension);

  const code = `
  const boundingBox = {
    ${pattern('min_{var}: 0, max_{var}: 0,', {indent: 4})}
  };

  return {
    box: boundingBox,

    update: updateBoundingBox,

    reset: resetBoundingBox,

    getBestNewPosition: function (neighbors) { // TODO: change argument to be graph
      let ${pattern('base_{var} = 0', {join: ', '})};

      if (neighbors.length) {
        for (let i = 0; i < neighbors.length; ++i) {
          const neighborPos = graph.getNodeAttribute(neighbors[i], settings.body).pos;
          ${pattern('base_{var} += neighborPos.{var};', {indent: 10})}
        }

        ${pattern('base_{var} /= neighbors.length;', {indent: 8})}
      } else {
        ${pattern('base_{var} = (boundingBox.min_{var} + boundingBox.max_{var}) / 2;', {indent: 8})}
      }

      const springLength = settings.springLength;
      return {
        ${pattern('{var}: base_{var} + (random.nextDouble() - 0.5) * springLength,', {indent: 8})}
      };
    }
  };

  function updateBoundingBox() {
    if (graph.order == 0) return;
    ${pattern('let max_{var} = -Infinity;', {indent: 4})}
    ${pattern('let min_{var} = Infinity;', {indent: 4})}
    graph.forEachNode((node, attributes) => {
      const bodyPos = attributes[settings.body].pos;
      ${pattern('if (bodyPos.{var} < min_{var}) min_{var} = bodyPos.{var};', {indent: 6})}
      ${pattern('if (bodyPos.{var} > max_{var}) max_{var} = bodyPos.{var};', {indent: 6})}
    });
    ${pattern('boundingBox.min_{var} = min_{var};', {indent: 4})}
    ${pattern('boundingBox.max_{var} = max_{var};', {indent: 4})}
  }

  function resetBoundingBox() {
    ${pattern('boundingBox.min_{var} = boundingBox.max_{var} = 0;', {indent: 4})}
  }
`;
  return code;
}
