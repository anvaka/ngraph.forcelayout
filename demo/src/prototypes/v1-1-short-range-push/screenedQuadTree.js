// The library's 2D Barnes-Hut quad tree with a screened push: the force between two bodies is
//   F = G m1 m2 (1 + r/range) exp(-r/range) / r^2
// which is the exact force of the potential G m1 m2 exp(-r/range) / r. Close up it is the usual
// 1/r^2 push; past a few `range`s it is gone. Cells whose nearest possible body is farther than
// 6 ranges (where the factor is below 0.02) are skipped without opening them.
//
// We start from the code lib/codeGenerators/generateQuadTree.js generates for the library and
// patch three lines of it, so everything else (tree build, theta test, coincident bodies) is the
// library's own.
import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js';

const BODY_FORCE = 'v = gravity * body.mass * sourceBody.mass / (r * r * r);';
const CELL_FORCE = 'v = gravity * node.mass * sourceBody.mass / (r * r * r);';
const OPEN_TEST = 'if ((node.max_x - node.min_x) / r < theta) {';
// q is Infinity only when the range is too small to divide by (e.g. 1e-320): the factor is 0
// there, not Infinity * 0 = NaN.
const SCREEN = 'if (screen.range > 0) { var q = r / screen.range; v *= q < Infinity ? (1 + q) * Math.exp(-q) : 0; }';
const SKIP_FAR = 'if (screen.range > 0 && r - (node.max_x - node.min_x) * 1.4143 > screen.cutoff) continue;';

/**
 * Returns createQuadTree(options, random), same API as the library's. `screen` is read on every
 * force evaluation: { range, cutoff }; range 0 means no screening (the library's force).
 */
export default function createScreenedQuadTreeFactory(screen) {
  let code = generateQuadTree.generateQuadTreeFunctionBody(2);
  for (const line of [BODY_FORCE, CELL_FORCE, OPEN_TEST]) {
    if (code.indexOf(line) < 0) throw new Error('Short-range push: the quad tree code has changed, cannot patch: ' + line);
  }
  code = code
    .replace(BODY_FORCE, BODY_FORCE + ' ' + SCREEN)
    .replace(CELL_FORCE, CELL_FORCE + ' ' + SCREEN)
    .replace(OPEN_TEST, SKIP_FAR + '\n' + OPEN_TEST);
  return new Function('screen', code)(screen);
}
