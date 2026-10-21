
module.exports = generateDualTreeFunction;
module.exports.generateDualTreeFunctionBody = generateDualTreeFunctionBody;

/**
 * Dual tree traversal for the n-body force (an alternative to the Barnes-Hut quad tree).
 *
 * Instead of walking the tree once per body, it walks pairs of cells. When two cells are
 * far enough from each other, they exchange their field once (both ways), and remember it
 * as a field plus its gradient (a first order "local expansion") at the cell's center of
 * mass. When two leaves are close, their bodies interact directly (again, both ways). One
 * final pass pushes the local expansions down the tree to the bodies.
 *
 * The tree is 2^dimension-ary, with up to LEAF_SIZE bodies per leaf. Nodes are stored in
 * flat typed arrays in preorder, and children are found through skip links (first child is
 * `node + 1`, next sibling is `skip[child]`), so any dimension works without allocating
 * 2^dimension child slots. Bodies are kept in tree order between steps, which makes the
 * next partitioning cheap.
 */
function generateDualTreeFunction(dimension, law) {
  let code = generateDualTreeFunctionBody(dimension, law);
  return (new Function(code))();
}

/**
 * `law` is a repulsion law (see repulsionLaw.js). Without one, bodies push as 1/r^2.
 */
function generateDualTreeFunctionBody(dimension, law) {
  let customLaw = law && !law.isDefault;
  let hasRange = customLaw && law.hasRange;
  let axes = [];
  for (let k = 0; k < dimension; ++k) axes.push(k);
  // Repeats `template(k)` for every axis k. The axis index lets us address flat arrays.
  let each = (template, join) => axes.map(template).join(join === undefined ? '\n' : join);

  // Symmetric gradient (Jacobian) of the field is stored as its upper triangle:
  let pairs = [];
  for (let a = 0; a < dimension; ++a) {
    for (let b = a; b < dimension; ++b) pairs.push([a, b]);
  }
  let pairIndex = (a, b) => pairs.findIndex(([p, q]) => (p === a && q === b) || (p === b && q === a));
  // (J * h)[k], where J is read from `j{e}` variables
  let jacobianTimes = (k, h) => axes.map(m => `j${pairIndex(k, m)} * ${h}${m}`).join(' + ');

  // Some dimensions get more accurate approximation from the same theta than the quad tree.
  // These scales make `theta` give about the same accuracy as the quad tree, while being faster.
  let thetaScale = dimension === 2 ? 0.875 : 1;

  let code = `
var D = ${dimension};
var JN = ${pairs.length};
var LEAF_SIZE = 16;
var MAX_DEPTH = 60;
var THETA_SCALE = ${thetaScale};

return function createDualTree(settings, law) {
  // Values of the law's parameters, refreshed by the simulator every step:
  var lawValues = law ? law.values : null;
  var lawFunctions = law ? law.functions : null;
  var n = 0;
  // Body index of the k-th body in tree order, and the other way around:
  var order, rank;
  // Positions, masses and fields of bodies in tree order:
  var pos, mass, field;
  // Tree topology (grows as needed):
  var nodeCapacity = 0, nodeCount = 0;
  var nodeStart, nodeEnd, nodeSkip;
  // Per node data:
  var dataCapacity = 0;
  var nodeMass, nodeCenter, nodeRadius, localField, localJacobian;

  var cellMin = [], cellSide = new Float64Array(MAX_DEPTH + 2);
  for (var depth = 0; depth < MAX_DEPTH + 2; ++depth) cellMin.push(new Float64Array(D));

  var stack = new Int32Array(1 << 12);

  return {
    computeForces: computeForces
  };

  // Adds the push to the force of every body that is not pinned. \`charge\` is the column of
  // charges (masses by default): how hard bodies push. \`sensitivity\` is how strongly they
  // feel the push (the charge by default).
  function computeForces(store, charge, sensitivity) {
    if (store.n === 0) return;
    charge = charge || store.mass;
    sensitivity = sensitivity || charge;
    buildTree(store, charge);
    walk(settings.theta * THETA_SCALE);
    pushDown();

    var gravity = settings.gravity;
    var force = store.force, pinned = store.pinned;
    for (var i = 0; i < n; ++i) {
      if (pinned[i]) continue;
      var k = rank[i];
      var g = gravity * sensitivity[i];
      ${each(k => `force[i * D + ${k}] += g * field[k * D + ${k}];`, '\n      ')}
    }
  }

  function ensureBodies(count) {
    if (count === n && order) return;
    n = count;
    order = new Int32Array(n);
    rank = new Int32Array(n);
    for (var i = 0; i < n; ++i) order[i] = i;
    pos = new Float64Array(n * D);
    mass = new Float64Array(n);
    field = new Float64Array(n * D);
  }

  function newNode(start, end) {
    if (nodeCount === nodeCapacity) {
      nodeCapacity = Math.max(1024, nodeCapacity * 2);
      nodeStart = grow(Int32Array, nodeStart, nodeCapacity);
      nodeEnd = grow(Int32Array, nodeEnd, nodeCapacity);
      nodeSkip = grow(Int32Array, nodeSkip, nodeCapacity);
    }
    var node = nodeCount++;
    nodeStart[node] = start;
    nodeEnd[node] = end;
    return node;
  }

  function ensureNodeData() {
    if (nodeCount <= dataCapacity) return;
    dataCapacity = nodeCapacity;
    nodeMass = new Float64Array(dataCapacity);
    nodeCenter = new Float64Array(dataCapacity * D);
    nodeRadius = new Float64Array(dataCapacity);
    localField = new Float64Array(dataCapacity * D);
    localJacobian = new Float64Array(dataCapacity * JN);
  }

  function buildTree(store, bodyMass) {
    ensureBodies(store.n);

    ${each(k => `var min${k} = Infinity, max${k} = -Infinity;`, '\n    ')}
    // Bodies are read in their own order (it is cheaper to jump in the tree order arrays):
    var bodyPos = store.pos;
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    for (var i = 0; i < n; ++i) {
      var k = rank[i];
      mass[k] = bodyMass[i];
      ${each(k => `var p${k} = bodyPos[i * D + ${k}]; pos[k * D + ${k}] = p${k};`, '\n      ')}
      ${each(k => `if (p${k} < min${k}) min${k} = p${k}; if (p${k} > max${k}) max${k} = p${k};`, '\n      ')}
    }

    var side = 0;
    ${each(k => `if (max${k} - min${k} > side) side = max${k} - min${k};`, '\n    ')}
    ${each(k => `cellMin[0][${k}] = min${k};`, ' ')}
    cellSide[0] = side * (1 + 1e-9) + 1e-9;
    nodeCount = 0;
    buildNode(0, n, 0);
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    ensureNodeData();

    // Children come after parents, so we can aggregate bottom up in reverse order:
    for (var node = nodeCount - 1; node >= 0; --node) {
      var m = 0, r = 0;
      ${each(k => `var s${k} = 0;`, ' ')}
      if (nodeSkip[node] === node + 1) {
        // Leaf: center of mass of its bodies, radius is the farthest body.
        var start = nodeStart[node], end = nodeEnd[node];
        for (var k = start; k < end; ++k) {
          var w = mass[k];
          m += w;
          ${each(k => `s${k} += w * pos[k * D + ${k}];`, ' ')}
        }
        var weight = m;
        if (m === 0) {
          // No charge here (it pushes nobody): the plain middle of its bodies
          ${each(k => `s${k} = 0;`, ' ')}
          for (var k = start; k < end; ++k) { ${each(k => `s${k} += pos[k * D + ${k}];`, ' ')} }
          weight = end - start;
        }
        ${each(k => `var c${k} = s${k} / weight;`, ' ')}
        var r2 = 0;
        for (var k = start; k < end; ++k) {
          ${each(k => `var h${k} = pos[k * D + ${k}] - c${k};`, ' ')}
          var q2 = ${each(k => `h${k} * h${k}`, ' + ')};
          if (q2 > r2) r2 = q2;
        }
        r = Math.sqrt(r2);
      } else {
        // Internal node: aggregate children, radius bounds every child's sphere.
        var skip = nodeSkip[node];
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          var w = nodeMass[c];
          m += w;
          ${each(k => `s${k} += w * nodeCenter[c * D + ${k}];`, ' ')}
        }
        var weight = m;
        if (m === 0) {
          ${each(k => `s${k} = 0;`, ' ')}
          weight = 0;
          for (var c = node + 1; c < skip; c = nodeSkip[c]) {
            var count = nodeEnd[c] - nodeStart[c];
            weight += count;
            ${each(k => `s${k} += count * nodeCenter[c * D + ${k}];`, ' ')}
          }
        }
        ${each(k => `var c${k} = s${k} / weight;`, ' ')}
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          ${each(k => `var h${k} = nodeCenter[c * D + ${k}] - c${k};`, ' ')}
          var q = Math.sqrt(${each(k => `h${k} * h${k}`, ' + ')}) + nodeRadius[c];
          if (q > r) r = q;
        }
      }
      nodeMass[node] = m;
      nodeRadius[node] = r;
      ${each(k => `nodeCenter[node * D + ${k}] = c${k}; localField[node * D + ${k}] = 0;`, '\n      ')}
      for (var t = 0; t < JN; ++t) localJacobian[node * JN + t] = 0;
    }
    for (var k = 0; k < n * D; ++k) field[k] = 0;
  }

  function buildNode(start, end, depth) {
    var node = newNode(start, end);
    if (end - start > LEAF_SIZE && depth < MAX_DEPTH) splitAxis(start, end, D - 1, 0, depth);
    nodeSkip[node] = nodeCount;
  }

  // Splits bodies of a cell one axis at a time; each non empty orthant becomes a child.
  function splitAxis(start, end, axis, bits, depth) {
    if (axis < 0) {
      var parentMin = cellMin[depth], childMin = cellMin[depth + 1], half = cellSide[depth] / 2;
      ${each(k => `childMin[${k}] = parentMin[${k}] + ((bits >> ${k}) & 1) * half;`, '\n      ')}
      cellSide[depth + 1] = half;
      buildNode(start, end, depth + 1);
      return;
    }
    var mid = partition(start, end, axis, cellMin[depth][axis] + cellSide[depth] / 2);
    if (start < mid) splitAxis(start, mid, axis - 1, bits, depth);
    if (mid < end) splitAxis(mid, end, axis - 1, bits | (1 << axis), depth);
  }

  // Bodies that are already on the correct side cost no swaps, so keeping the
  // order from the previous step makes this cheap.
  function partition(start, end, axis, pivot) {
    var i = start, j = end - 1;
    while (true) {
      while (i <= j && pos[i * D + axis] < pivot) i++;
      while (i <= j && pos[j * D + axis] >= pivot) j--;
      if (i >= j) return i;
      var t = order[i]; order[i] = order[j]; order[j] = t;
      t = mass[i]; mass[i] = mass[j]; mass[j] = t;
      var a = i * D, b = j * D;
      ${each(k => `t = pos[a + ${k}]; pos[a + ${k}] = pos[b + ${k}]; pos[b + ${k}] = t;`, '\n      ')}
      i++; j--;
    }
  }

  function push(a, b, top) {
    if (top + 2 > stack.length) stack = grow(Int32Array, stack, stack.length * 2);
    stack[top] = a;
    stack[top + 1] = b;
    return top + 2;
  }

  function walk(theta) {
    var theta2 = theta * theta;
    ${customLaw ? 'var r, k1, k2; ' + law.prologue('lawValues') : ''}
    var top = push(0, 0, 0);
    while (top) {
      top -= 2;
      var a = stack[top], b = stack[top + 1];
      var skipA = nodeSkip[a];
      if (a === b) {
        // A cell with itself: all pairs of its children, and each child with itself.
        if (skipA === a + 1) {
          direct(nodeStart[a], nodeEnd[a], 0, nodeEnd[a], true);
          continue;
        }
        for (var c = a + 1; c < skipA; c = nodeSkip[c]) {
          top = push(c, c, top);
          for (var u = nodeSkip[c]; u < skipA; u = nodeSkip[u]) top = push(c, u, top);
        }
        continue;
      }

      ${each(k => `var d${k} = nodeCenter[b * D + ${k}] - nodeCenter[a * D + ${k}];`, ' ')}
      var r2 = ${each(k => `d${k} * d${k}`, ' + ')};
      var radiusA = nodeRadius[a], radiusB = nodeRadius[b], radii = radiusA + radiusB;
      ${hasRange ? `r = Math.sqrt(r2);
      // All pairs of these two cells are out of the law's range:
      if (r - radii > lawRange) continue;` : ''}
      if (radii * radii < theta2 * r2) {
        // Far enough: exchange fields of the two cells, both ways.
        ${customLaw ? `${hasRange ? '' : 'r = Math.sqrt(r2);'}
        ${law.emit(dimension, 'r', 'k1', 'k2')}
        var inv3 = k1, inv5 = k2;` : 'var inv2 = 1 / r2, inv3 = Math.sqrt(inv2) * inv2, inv5 = 3 * inv3 * inv2;'}
        var massA = nodeMass[a], massB = nodeMass[b];
        var fieldA = a * D, fieldB = b * D, jacobianA = a * JN, jacobianB = b * JN;
        ${each(k => `var k${k} = d${k} * inv3; localField[fieldA + ${k}] += massB * k${k}; localField[fieldB + ${k}] -= massA * k${k};`, '\n        ')}
        ${pairs.map(([p, q], e) => `var j${e} = d${p} * d${q} * inv5${p === q ? ' - inv3' : ''}; localJacobian[jacobianA + ${e}] += massB * j${e}; localJacobian[jacobianB + ${e}] += massA * j${e};`).join('\n        ')}
        continue;
      }

      var skipB = nodeSkip[b], isLeafA = skipA === a + 1, isLeafB = skipB === b + 1;
      if (isLeafA && isLeafB) {
        direct(nodeStart[a], nodeEnd[a], nodeStart[b], nodeEnd[b], false);
        continue;
      }
      // Too close: open the bigger cell.
      if (!isLeafA && (isLeafB || radiusA >= radiusB)) {
        for (var c = a + 1; c < skipA; c = nodeSkip[c]) top = push(c, b, top);
      } else {
        for (var c = b + 1; c < skipB; c = nodeSkip[c]) top = push(a, c, top);
      }
    }
  }

  // Exact interaction of bodies [startA, endA) with bodies [startB, endB), both ways.
  function direct(startA, endA, startB, endB, sameCell) {
    ${customLaw ? 'var r, k1; ' + law.prologue('lawValues') : ''}
    for (var i = startA; i < endA; ++i) {
      ${each(k => `var x${k} = pos[i * D + ${k}];`, ' ')}
      var massI = mass[i];
      ${each(k => `var a${k} = 0;`, ' ')}
      for (var j = sameCell ? i + 1 : startB; j < endB; ++j) {
        ${each(k => `var d${k} = pos[j * D + ${k}] - x${k};`, ' ')}
        var r2 = ${each(k => `d${k} * d${k}`, ' + ')};
        if (r2 === 0) {
          // Two bodies at the same position: push them apart as if they were a unit
          // distance apart, along an axis picked from their ids (deterministic and bounded).
          var lo = order[i] < order[j] ? order[i] : order[j];
          var hi = order[i] < order[j] ? order[j] : order[i];
          var axis = (((lo * 2654435761) ^ (hi * 40503)) >>> 0) % D;
          var sign = order[i] < order[j] ? 1 : -1;
          ${each(k => `d${k} = axis === ${k} ? sign : 0;`, ' ')}
          r2 = 1;
        }
        ${customLaw ? `r = Math.sqrt(r2);
        ${hasRange ? 'if (r > lawRange) continue;' : ''}
        ${law.emit(dimension, 'r', 'k1')}
        var inv3 = k1;` : 'var inv3 = 1 / (r2 * Math.sqrt(r2));'}
        var massJ = mass[j] * inv3, massII = massI * inv3;
        ${each(k => `a${k} += massJ * d${k}; field[j * D + ${k}] -= massII * d${k};`, '\n        ')}
      }
      ${each(k => `field[i * D + ${k}] += a${k};`, ' ')}
    }
  }

  // Pushes local expansions from parents to children, and from leaves to bodies.
  function pushDown() {
    for (var node = 0; node < nodeCount; ++node) {
      var offset = node * D, jacobian = node * JN, skip = nodeSkip[node];
      ${each(k => `var c${k} = nodeCenter[offset + ${k}], g${k} = localField[offset + ${k}];`, ' ')}
      ${pairs.map((_, e) => `var j${e} = localJacobian[jacobian + ${e}];`).join(' ')}
      if (skip === node + 1) {
        for (var k = nodeStart[node], end = nodeEnd[node]; k < end; ++k) {
          ${each(k => `var h${k} = pos[k * D + ${k}] - c${k};`, ' ')}
          ${each(k => `field[k * D + ${k}] += g${k} + ${jacobianTimes(k, 'h')};`, '\n          ')}
        }
        continue;
      }
      for (var c = node + 1; c < skip; c = nodeSkip[c]) {
        var childOffset = c * D, childJacobian = c * JN;
        ${each(k => `var h${k} = nodeCenter[childOffset + ${k}] - c${k};`, ' ')}
        ${each(k => `localField[childOffset + ${k}] += g${k} + ${jacobianTimes(k, 'h')};`, '\n        ')}
        ${pairs.map((_, e) => `localJacobian[childJacobian + ${e}] += j${e};`).join(' ')}
      }
    }
  }
};

function grow(ArrayType, array, size) {
  var bigger = new ArrayType(size);
  if (array) bigger.set(array.subarray(0, Math.min(array.length, size)));
  return bigger;
}
`;
  return code;
}
