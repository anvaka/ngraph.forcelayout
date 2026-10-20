// A Barnes-Hut quad tree whose repulsion has a limited reach.
//
// It starts from the code the library generates for its own quad tree and changes two things:
//  - the force law: instead of the 3-D law (strength falls as 1/r^2), bodies push with the law of a
//    flat world with a range, mu * K1(mu * r). Up close it falls as 1/r; beyond about 1/mu it dies
//    out exponentially. (K1 is a Bessel function; see kernel below.)
//  - cells that lie entirely beyond the reach are skipped, so far away parts of the tree are not
//    walked at all.
import generateQuadTree from '../../../../lib/codeGenerators/generateQuadTree.js';

const TABLE_SIZE = 1024;
// Beyond x = mu * r = X_MAX the force is below 0.01% of its value at r = 1/mu: treat it as zero.
const X_MAX = 9;

let cachedFactory = null;

export default function createReachTree(options, random) {
  if (!cachedFactory) cachedFactory = compile();
  const kernel = {mu: 0, scale: TABLE_SIZE / X_MAX, xMax: X_MAX, c: 1, cutoff: Infinity, table: getTable()};
  const tree = cachedFactory(kernel)(options, random);
  return {
    insertBodies: tree.insertBodies,
    updateBodyForce: tree.updateBodyForce,
    options: tree.options,
    /**
     * reach: distance (in layout units) where the push starts to fade; 0 or less means "no limit".
     * unit: the distance where the new law matches the library's push exactly (the spring length).
     */
    setReach(reach, unit) {
      if (reach > 0) {
        kernel.mu = 1 / reach;
        kernel.cutoff = X_MAX * reach;
      } else {
        kernel.mu = 0;
        kernel.cutoff = Infinity;
      }
      // Same push as the library at r = unit: c * T(mu * unit) / unit = 1 / unit^2
      kernel.c = 1 / (unit * lookup(kernel.table, kernel.mu * unit));
    }
  };
}

function compile() {
  let code = generateQuadTree.generateQuadTreeFunctionBody(2);
  // v multiplies the offset (dx, dy), so the force's size is v * r. T(x) = x K1(x) goes from 1 at
  // x = 0 to 0 at X_MAX, so v = G m1 m2 c T(mu r) / r^2 gives a force of G m1 m2 c mu K1(mu r).
  const law = mass => `
        var x = r * K.mu;
        if (x >= K.xMax) {
          v = 0;
        } else {
          var q = x * K.scale, i = q | 0, t = K.table;
          v = gravity * ${mass} * sourceBody.mass * K.c * (t[i] + (t[i + 1] - t[i]) * (q - i)) / (r * r);
        }`;
  code = replaceOnce(code, 'v = gravity * body.mass * sourceBody.mass / (r * r * r);', law('body.mass'));
  code = replaceOnce(code, 'v = gravity * node.mass * sourceBody.mass / (r * r * r);', law('node.mass'));
  // A cell whose nearest point is beyond the reach adds nothing: don't open it, don't add it.
  // (0.71 * width is the farthest a square cell's corner can be from any point inside it.)
  code = replaceOnce(code, 'if ((node.max_x - node.min_x) / r < theta) {',
    'if (r - 0.71 * (node.max_x - node.min_x) > K.cutoff) {\n        } else if ((node.max_x - node.min_x) / r < theta) {');
  // The generated body ends with `return createQuadTree;`
  return new Function('K', code);
}

function replaceOnce(code, from, to) {
  const at = code.indexOf(from);
  if (at < 0 || code.indexOf(from, at + from.length) >= 0) {
    throw new Error('Library quad tree code changed, cannot patch: ' + from);
  }
  return code.slice(0, at) + to + code.slice(at + from.length);
}

let table = null;
// T(x) = x * K1(x) on [0, X_MAX], with one extra entry so interpolation can read t[i + 1].
function getTable() {
  if (table) return table;
  table = new Float64Array(TABLE_SIZE + 2);
  for (let i = 0; i < table.length; i++) {
    const x = (i / TABLE_SIZE) * X_MAX;
    table[i] = x === 0 ? 1 : (x >= X_MAX ? 0 : x * besselK1(x));
  }
  return table;
}

function lookup(t, x) {
  if (x >= X_MAX) return 0;
  const q = x * (TABLE_SIZE / X_MAX), i = q | 0;
  return t[i] + (t[i + 1] - t[i]) * (q - i);
}

// Modified Bessel function K1, polynomial fits from Abramowitz & Stegun 9.8.3, 9.8.7, 9.8.8.
function besselI1(x) {
  const t = x / 3.75, t2 = t * t;
  return x * (0.5 + t2 * (0.87890594 + t2 * (0.51498869 + t2 * (0.15084934 + t2 * (0.02658733 + t2 * (0.00301532 + t2 * 0.00032411))))));
}

function besselK1(x) {
  if (x <= 2) {
    const y = x * x / 4;
    return Math.log(x / 2) * besselI1(x) + (1 / x) * (1 + y * (0.15443144 + y * (-0.67278579 + y * (-0.18156897 + y * (-0.01919402 + y * (-0.00110404 + y * (-0.00004686)))))));
  }
  const y = 2 / x;
  return Math.exp(-x) / Math.sqrt(x) * (1.25331414 + y * (0.23498619 + y * (-0.03655620 + y * (0.01504268 + y * (-0.00780353 + y * (0.00325614 + y * (-0.00068245)))))));
}
