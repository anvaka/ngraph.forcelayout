// The library's Barnes-Hut quad tree with a push that fades with distance. It is built from the
// code the library generates (lib/codeGenerators/generateQuadTree.js) by editing three spots:
//  - each pair force is multiplied by exp(-r / fade), so a node's push dies out over `fade`;
//  - a cell farther than 7 * fade (where the push is below 0.1%) is skipped, children included;
//  - `fade` is read from the options, next to gravity and theta.
import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js';

const factories = new Map();

export default function getFadingQuadTreeFactory(dimension) {
  if (!factories.has(dimension)) factories.set(dimension, build(dimension));
  return factories.get(dimension);
}

function build(dimension) {
  let code = generateQuadTree.generateQuadTreeFunctionBody(dimension);
  code = replaceOnce(code, '  var theta = options.theta;\n',
    '  var theta = options.theta;\n' +
    '  var fade = options.fade;\n' +
    '  var farAway = 7 * fade;\n');
  // The two force lines (a single body, a whole cell) both end in "/ (r * r * r);"
  code = replaceAll(code, '/ (r * r * r);', '* Math.exp(-r / fade) / (r * r * r);', 2);
  // A cell whose nearest corner is beyond `farAway` adds nothing: don't treat it, don't open it.
  // The widest a cell reaches from its center of mass is width * sqrt(dimension) < 2 * width.
  code = replaceOnce(code, '        if ((node.max_x - node.min_x) / r < theta) {',
    '        if (r - 2 * (node.max_x - node.min_x) > farAway) {\n' +
    '          // too far away: the faded push is negligible\n' +
    '        } else if ((node.max_x - node.min_x) / r < theta) {');
  // Keep `fade` in sync when the options change
  code = replaceOnce(code, "        if (typeof newOptions.theta === 'number') {",
    "        if (typeof newOptions.fade === 'number') {\n" +
    '          fade = newOptions.fade;\n' +
    '          farAway = 7 * fade;\n' +
    '        }\n' +
    "        if (typeof newOptions.theta === 'number') {");
  return (new Function(code))();
}

function replaceOnce(code, text, replacement) {
  return replaceAll(code, text, replacement, 1);
}

function replaceAll(code, text, replacement, expected) {
  const parts = code.split(text);
  if (parts.length - 1 !== expected) {
    throw new Error('fading push: the generated quad tree changed, cannot find "' + text.trim() + '"');
  }
  return parts.join(replacement);
}
