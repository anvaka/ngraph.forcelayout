const createPatternBuilder = require('./createPatternBuilder');
const getVariableName = require('./getVariableName');

module.exports = generateQuadTreeFunction;
module.exports.generateQuadTreeFunctionBody = generateQuadTreeFunctionBody;

// These exports are for InlineTransform tool.
// InlineTransform: getInsertStackCode
module.exports.getInsertStackCode = getInsertStackCode;
// InlineTransform: getQuadNodeCode
module.exports.getQuadNodeCode = getQuadNodeCode;
// InlineTransform: isSamePosition
module.exports.isSamePosition = isSamePosition;
// InlineTransform: getChildBodyCode
module.exports.getChildBodyCode = getChildBodyCode;
// InlineTransform: setChildBodyCode
module.exports.setChildBodyCode = setChildBodyCode;

/**
 * `law` is a repulsion law (see repulsionLaw.js). Without one, bodies push as 1/r^2.
 *
 * `law` can also be an array of K laws, one per charge. Then every cell keeps K charge sums and
 * one walk adds all K pushes: `gravity * sum_c charge_c(j) * sensitivity_c(i) * F_c(r)`. The tree
 * takes the laws as an array, and `insertBodies(store, charges, sensitivities)` takes arrays of
 * columns (a missing sensitivity is that charge). `options.centroid`:
 *  - 'own' (default): every charge acts from its own centre;
 *  - 'shared': the first charge, which must not be negative, sets each cell's centre and the
 *    other charges act from it: one distance per cell instead of K. Other charges may be signed.
 * Cells open by their distance to the first charge's centre (or to their middle, when they hold
 * none of it). One law in an array generates the same code as the law alone.
 */
function generateQuadTreeFunction(dimension, law, options) {
  let code = generateQuadTreeFunctionBody(dimension, law, options);
  return (new Function(code))();
}

function generateQuadTreeFunctionBody(dimension, law, options) {
  let pattern = createPatternBuilder(dimension);
  let quadCount = Math.pow(2, dimension);
  let axes = [];
  for (let k = 0; k < dimension; ++k) axes.push(k);
  let each = (template, join) => axes.map(template).join(join === undefined ? '\n' : join);
  let charges = createCharges(dimension, law, options);
  if (charges.count === 1) law = charges.laws[0];
  let customLaw = law && !law.isDefault;
  let hasRange = customLaw && law.hasRange;
  // The push of a body or a cell with `charge`. The 1/r^2 code stays as it always was.
  let push = (charge, indent) => charges.count > 1 ? charges.push(charge === 'node.mass', indent) : customLaw ?
    `${law.emit(dimension, 'r', 'k1')}\n${indent}v = gravity * ${charge} * sourceMass * k1;` :
    `v = gravity * ${charge} * sourceMass / (r * r * r);`;
  // Skips a cell whose nearest point is out of the law's range
  let skipCellOutOfRange = indent => charges.anyRange ? `var boxDistance2 = 0, edge;
${indent}${each(k => `edge = node.min_${getVariableName(k)} - s${getVariableName(k)}; if (edge > 0) boxDistance2 += edge * edge; else { edge = s${getVariableName(k)} - node.max_${getVariableName(k)}; if (edge > 0) boxDistance2 += edge * edge; }`, '\n' + indent)}
${indent}if (${charges.count > 1 ? charges.cellOutOfRange() : 'boxDistance2 > lawRange2'}) continue;
${indent}` : '';
  // Where a cell acts from: K charges may leave the first one empty in a cell
  let cellCenter = indent => charges.count > 1 ? charges.cellCenter(indent) :
    pattern('d{var} = node.mass_{var} / node.mass - s{var};', {indent: indent.length});

  let code = `
${getInsertStackCode()}
${getQuadNodeCode(dimension, charges)}
${isSamePosition(dimension)}
${getChildBodyCode(dimension)}
${setChildBodyCode(dimension)}

/**
 * Barnes-Hut tree over a body store (see createBodyStore.js). Bodies are body indexes.
 */
function createQuadTree(options, random, law) {
  options = options || {};
${charges.count > 1 ? charges.lawValues() : `  // Values of the law's parameters, refreshed by the simulator every step:
  var lawValues = law ? law.values : null;
  var lawFunctions = law ? law.functions : null;`}
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  var gravity = options.gravity;
  var updateQueue = [];
  var insertStack = new InsertStack();
  var theta = options.theta;

  var nodesCache = [];
  var currentInCache = 0;
  var root = newNode();

  // Arrays of the store from the last insertBodies() call (\`sensitivity\`: how strongly
  // bodies feel the push):
  var pos, mass, sensitivity, force${charges.columns()};

  return {
    insertBodies: insertBodies,

    /**
     * Gets root node if it is present
     */
    getRoot: function() {
      return root;
    },

    updateBodyForce: update,

    options: function(newOptions) {
      if (newOptions) {
        if (typeof newOptions.gravity === 'number') {
          gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === 'number') {
          theta = newOptions.theta;
        }

        return this;
      }

      return {
        gravity: gravity,
        theta: theta
      };
    }
  };

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
${assignQuads('      node.')}
      node.body = -1;
      node.mass = ${pattern('node.mass_{var} = ', {join: ''})}${charges.resetNode()}0;
      ${pattern('node.min_{var} = node.max_{var} = ', {join: ''})}0;
    } else {
      node = new QuadNode();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody) {
    var queue = updateQueue;
    var v;
    ${pattern('var d{var};', {indent: 4})}
    var r; 
    ${pattern('var f{var} = 0;', {indent: 4})}
    var queueLength = 1;
    var shiftIdx = 0;
    var pushIdx = 1;
    var sourceOffset = sourceBody * ${dimension};
    ${each(k => `var s${getVariableName(k)} = pos[sourceOffset${k ? ' + ' + k : ''}];`, '\n    ')}
    var sourceMass = sensitivity[sourceBody];${charges.sources('    ')}
    ${charges.count > 1 ? charges.prologue('    ') : customLaw ? 'var k1; ' + law.prologue('lawValues') : ''}

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx];
      var body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body >= 0 && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        var bodyOffset = body * ${dimension};
        ${each(k => `d${getVariableName(k)} = pos[bodyOffset${k ? ' + ' + k : ''}] - s${getVariableName(k)};`, '\n        ')}
        r = Math.sqrt(${pattern('d{var} * d{var}', {join: ' + '})});

        if (r === 0) {
          // Poor man's protection against zero distance.
          ${pattern('d{var} = (random.nextDouble() - 0.5) / 50;', {indent: 10})}
          r = Math.sqrt(${pattern('d{var} * d{var}', {join: ' + '})});
        }

        ${hasRange && charges.count === 1 ? 'if (r > lawRange) continue;' : ''}
        // This is standard gravitation force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        ${push('mass[body]', '        ')}
        ${pattern('f{var} += v * d{var};', {indent: 8})}
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        ${skipCellOutOfRange('        ')}${cellCenter('        ')}
        r = Math.sqrt(${pattern('d{var} * d{var}', {join: ' + '})});

        if (r === 0) {
          // Sorry about code duplication. I don't want to create many functions
          // right away. Just want to see performance first.
          ${pattern('d{var} = (random.nextDouble() - 0.5) / 50;', {indent: 10})}
          r = Math.sqrt(${pattern('d{var} * d{var}', {join: ' + '})});
        }
        // If s / r < θ, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.max_${getVariableName(0)} - node.min_${getVariableName(0)}) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was made into square during tree creation.
          // Thus there is no difference between using width or height.
          ${push('node.mass', '          ')}
          ${pattern('f{var} += v * d{var};', {indent: 10})}
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
${runRecursiveOnChildren()}
        }
      }
    }

    ${each(k => `force[sourceOffset${k ? ' + ' + k : ''}] += f${getVariableName(k)};`, '\n    ')}
  }

${charges.count > 1 ? charges.insertBodies() : `  // \`charge\` is the column of charges (masses by default), \`bodySensitivity\` how strongly
  // bodies feel the push (the charges by default). Bodies without charge push nobody, so they
  // are left out of the tree.
  function insertBodies(store, charge, bodySensitivity) {
    pos = store.pos;
    mass = charge || store.mass;
    sensitivity = bodySensitivity || mass;`}
    force = store.force;
    ${pattern('var {var}min = Number.MAX_VALUE;', {indent: 4})}
    ${pattern('var {var}max = -Number.MAX_VALUE;', {indent: 4})}
    var i = store.n;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    while (i--) {
      if (${charges.noCharge('i')}) continue;
      var offset = i * ${dimension};
      ${each(k => `var ${getVariableName(k)} = pos[offset${k ? ' + ' + k : ''}];`, '\n      ')}
      ${pattern('if ({var} < {var}min) {var}min = {var};', {indent: 6})}
      ${pattern('if ({var} > {var}max) {var}max = {var};', {indent: 6})}
    }

    // Makes the bounds square.
    var maxSideLength = -Infinity;
    ${pattern('if ({var}max - {var}min > maxSideLength) maxSideLength = {var}max - {var}min ;', {indent: 4})}

    currentInCache = 0;
    root = newNode();
    ${pattern('root.min_{var} = {var}min;', {indent: 4})}
    ${pattern('root.max_{var} = {var}min + maxSideLength;', {indent: 4})}

    i = store.n;
    var rootTaken = false;
    while (i--) {
      if (${charges.noCharge('i')}) continue;
      if (rootTaken) {
        insert(i, root);
      } else {
        root.body = i;
        rootTaken = true;
      }
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop();
      var node = stackItem.node;
      var body = stackItem.body;

      if (node.body < 0) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        var bodyOffset = body * ${dimension};
        ${each(k => `var ${getVariableName(k)} = pos[bodyOffset${k ? ' + ' + k : ''}];`, '\n        ')}
        var bodyMass = mass[body];
        node.mass += bodyMass;
        ${pattern('node.mass_{var} += bodyMass * {var};', {indent: 8})}${charges.addToNode('        ')}

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0; // Assume we are in the 0's quad.
        ${pattern('var min_{var} = node.min_{var};', {indent: 8})}
        ${pattern('var max_{var} = (min_{var} + node.max_{var}) / 2;', {indent: 8})}

${assignInsertionQuadIndex(8)}

        var child = getChild(node, quadIdx);

        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          ${pattern('child.min_{var} = min_{var};', {indent: 10})}
          ${pattern('child.max_{var} = max_{var};', {indent: 10})}
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = -1; // internal nodes do not cary bodies

        if (isSamePosition(pos, oldBody, body)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            ${pattern('var d{var} = (node.max_{var} - node.min_{var}) * offset;', {indent: 12})}

            ${each(k => `pos[oldBody * ${dimension}${k ? ' + ' + k : ''}] = node.min_${getVariableName(k)} + d${getVariableName(k)};`, '\n            ')}
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(pos, oldBody, body));

          if (retriesCount === 0 && isSamePosition(pos, oldBody, body)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }
}
return createQuadTree;

`;
  return code;


  function assignInsertionQuadIndex(indentCount) {
    let insertionCode = [];
    let indent = Array(indentCount + 1).join(' ');
    for (let i = 0; i < dimension; ++i) {
      insertionCode.push(indent + `if (${getVariableName(i)} > max_${getVariableName(i)}) {`);
      insertionCode.push(indent + `  quadIdx = quadIdx + ${Math.pow(2, i)};`);
      insertionCode.push(indent + `  min_${getVariableName(i)} = max_${getVariableName(i)};`);
      insertionCode.push(indent + `  max_${getVariableName(i)} = node.max_${getVariableName(i)};`);
      insertionCode.push(indent + `}`);
    }
    return insertionCode.join('\n');
    // if (x > max_x) { // somewhere in the eastern part.
    //   quadIdx = quadIdx + 1;
    //   left = right;
    //   right = node.right;
    // }
  }

  function runRecursiveOnChildren() {
    let indent = Array(11).join(' ');
    let recursiveCode = [];
    for (let i = 0; i < quadCount; ++i) {
      recursiveCode.push(indent + `if (node.quad${i}) {`);
      recursiveCode.push(indent + `  queue[pushIdx] = node.quad${i};`);
      recursiveCode.push(indent + `  queueLength += 1;`);
      recursiveCode.push(indent + `  pushIdx += 1;`);
      recursiveCode.push(indent + `}`);
    }
    return recursiveCode.join('\n');
    // if (node.quad0) {
    //   queue[pushIdx] = node.quad0;
    //   queueLength += 1;
    //   pushIdx += 1;
    // }
  }

  function assignQuads(indent) {
    // this.quad0 = null;
    // this.quad1 = null;
    // this.quad2 = null;
    // this.quad3 = null;
    let quads = [];
    for (let i = 0; i < quadCount; ++i) {
      quads.push(`${indent}quad${i} = null;`);
    }
    return quads.join('\n');
  }
}

/**
 * Code for the charges of a tree: one law per charge (see generateQuadTreeFunction). With one
 * charge every piece is empty, and the tree is today's. Charge 0 keeps the names of the single
 * charge tree (`mass`, `sensitivity`, `node.mass`, `k1`, `lawRange`); charge c is `charge<c>`,
 * `sensitivity<c>`, `node.charge<c>`, `k1c<c>`, `law<c>Range`.
 */
function createCharges(dimension, law, options) {
  let pattern = createPatternBuilder(dimension);
  let laws = Array.isArray(law) ? law : [law];
  let count = laws.length;
  let shared = (options && options.centroid) === 'shared';
  if (count > 1 && options && options.centroid !== undefined && !shared && options.centroid !== 'own') {
    throw new Error('Unknown centroid: ' + options.centroid + '. Expected `own` or `shared`');
  }
  let custom = c => !!laws[c] && !laws[c].isDefault;
  let ranged = c => custom(c) && laws[c].hasRange;
  let others = [];
  for (let c = 1; c < count; ++c) others.push(c);
  let all = [0].concat(others);

  // Charges whose laws are the same code with the same numbers share one evaluation of the law
  let groups = [];
  all.forEach(c => {
    let group = groups.find(g => custom(c) ? g.law === laws[c] : !g.custom);
    if (!group) groups.push(group = { law: laws[c], custom: custom(c), first: c, charges: [] });
    group.charges.push(c);
  });

  let column = c => c ? 'charge' + c : 'mass';
  let source = c => c ? 'sourceMass' + c : 'sourceMass';
  let nodeCharge = c => c ? 'node.charge' + c : 'node.mass';
  let k = c => c ? 'k1c' + c : 'k1';
  // A law's local names (law_L, lawH0, lawRange, lawValues...) for charge c
  let names = (code, c) => c ? code.replace(/\blaw(?=_|H\d|Range|Values|Functions)/g, 'law' + c) : code;

  return {
    count: count,
    laws: laws,
    anyRange: all.some(ranged),

    lawValues: function () {
      let lines = groups.filter(g => g.custom).map(g =>
        names(`  var lawValues = law[${g.first}].values, lawFunctions = law[${g.first}].functions;`, g.first));
      if (lines.length) lines.unshift('  // Values of the laws\' parameters (a law per charge), refreshed by the simulator every step:');
      return lines.join('\n');
    },

    columns: () => others.map(c => `, ${column(c)}, sensitivity${c}`).join(''),

    resetNode: () => others.map(c => shared ? `${nodeCharge(c)} = ` :
      `${nodeCharge(c)} = ` + pattern(`${nodeCharge(c)}_{var} = `, {join: ''})).join(''),

    nodeFields: function (indent) {
      if (count === 1) return '';
      return `\n\n${indent}// Sums of the other charges${shared ? '' : ', and their centres as for the first one'}\n${indent}` +
        others.map(c => `this.charge${c} = 0;` + (shared ? '' : `\n${indent}` + pattern(`this.charge${c}_{var} = 0;`, {indent: indent.length}))).join(`\n${indent}`);
    },

    sources: function (indent) {
      let lines = others.map(c => `var ${source(c)} = sensitivity${c}[sourceBody];`);
      if (count > 1 && !shared) lines.push(pattern('var e{var};', {indent: indent.length}), 'var er;');
      return lines.map(line => '\n' + indent + line).join('');
    },

    prologue: indent => groups.filter(g => g.custom)
      .map(g => `var ${g.charges.map(k).join(', ')}; ` + names(g.law.prologue('lawValues'), g.first)).join('\n' + indent),

    noCharge: i => all.map(c => `${column(c)}[${i}] === 0`).join(' && '),

    addToNode: indent => others.map(c => '\n' + indent + (shared ? `${nodeCharge(c)} += ${column(c)}[body];` :
      `var bodyCharge${c} = ${column(c)}[body];\n${indent}${nodeCharge(c)} += bodyCharge${c};\n${indent}` +
      pattern(`${nodeCharge(c)}_{var} += bodyCharge${c} * {var};`, {indent: indent.length}))).join(''),

    insertBodies: () => `  // \`charges\` are the K columns of charges, \`sensitivities\` how strongly bodies feel each
  // of them (that charge when missing). Bodies without any charge push nobody, so they are left
  // out of the tree.
  function insertBodies(store, charges, sensitivities) {
    pos = store.pos;
    sensitivities = sensitivities || [];
    mass = charges[0];
    sensitivity = sensitivities[0] || mass;
${others.map(c => `    ${column(c)} = charges[${c}];\n    sensitivity${c} = sensitivities[${c}] || ${column(c)};`).join('\n')}`,

    // A cell is skipped when no charge can push from it: out of a law's range, or a charge
    // without range that the cell or the body does not have
    cellOutOfRange: () => '!(' + all.map(c => ranged(c) ? `boxDistance2 <= ${names('lawRange2', c)}` :
      `${source(c)} !== 0 && ${nodeCharge(c)} !== 0`).join(' || ') + ')',

    cellCenter: indent => `if (node.mass !== 0) {
${indent}  ${pattern('d{var} = node.mass_{var} / node.mass - s{var};', {indent: indent.length + 2})}
${indent}} else {
${indent}  // None of the first charge here: the cell's middle stands in for its centre
${indent}  ${pattern('d{var} = (node.min_{var} + node.max_{var}) / 2 - s{var};', {indent: indent.length + 2})}
${indent}}`,

    // Sets v to the push of a body (at distance r) or a cell, gravity included. With own centres
    // the charges after the first push from their centres here, straight into f.
    push: function (isCell, indent) {
      let lines = [];
      if (isCell && !shared) {
        others.forEach(c => { lines = lines.concat(ownCellPush(c)); });
        lines = lines.concat(sumPush([{ law: laws[0], custom: custom(0), first: 0, charges: [0] }], nodeCharge, cellInRange));
      } else {
        lines = sumPush(groups, isCell ? nodeCharge : c => `${column(c)}[body]`, isCell ? cellInRange : c => `r <= ${names('lawRange', c)}`);
      }
      return lines.join('\n' + indent);
    }
  };

  function cellInRange(c) {
    return `boxDistance2 <= ${names('lawRange2', c)}`;
  }

  // The law of charge c sets k<c>; the law's numbers are named after the first charge with it
  function lawCode(c, r) {
    let first = groups.find(g => g.charges.indexOf(c) >= 0).first;
    return names(laws[c].emit(dimension, r, k(c)), first);
  }

  // v = gravity * sum over charges of charge * sensitivity * F(r) / r, a law at a time
  function sumPush(list, charge, inRange) {
    let sum = g => g.charges.map(c => `${charge(c)} * ${source(c)}`).join(' + ');
    let stock = list.filter(g => !g.custom);
    let lawGroups = list.filter(g => g.custom);
    if (lawGroups.length === 0) return [`v = gravity * (${sum(stock[0])}) / (r * r * r);`];
    let lines = [stock.length ? `v = (${sum(stock[0])}) / (r * r * r);` : 'v = 0;'];
    lawGroups.forEach(g => {
      // The law is skipped out of its range, and for one charge the body or cell lacks
      let test = [];
      if (ranged(g.first)) test.push(inRange(g.first));
      if (g.charges.length === 1) test.push(`${source(g.first)} !== 0`, `${charge(g.first)} !== 0`);
      lines.push(`if (${test.join(' && ')}) {`, '  ' + lawCode(g.first, 'r'), `  v += (${sum(g)}) * ${k(g.first)};`, '}');
    });
    lines.push('v *= gravity;');
    return lines;
  }

  // The push of charge c from its own centre in the cell
  function ownCellPush(c) {
    let test = [`${source(c)} !== 0`, `${nodeCharge(c)} !== 0`];
    if (ranged(c)) test.push(cellInRange(c));
    let lines = [`if (${test.join(' && ')}) {`];
    for (let a = 0; a < dimension; ++a) {
      let x = getVariableName(a);
      lines.push(`  e${x} = ${nodeCharge(c)}_${x} / ${nodeCharge(c)} - s${x};`);
    }
    lines.push(`  er = Math.sqrt(${pattern('e{var} * e{var}', {join: ' + '})});`);
    lines.push(`  // On the source: push along the cell's centre instead`);
    lines.push(`  if (er === 0) { ${pattern('e{var} = d{var}; ', {join: ''})}er = r; }`);
    if (custom(c)) lines.push('  ' + lawCode(c, 'er'), `  v = gravity * ${nodeCharge(c)} * ${source(c)} * ${k(c)};`);
    else lines.push(`  v = gravity * ${nodeCharge(c)} * ${source(c)} / (er * er * er);`);
    lines.push(`  ${pattern('f{var} += v * e{var};', {join: ' '})}`);
    lines.push('}');
    return lines;
  }
}

function isSamePosition(dimension) {
  let pattern = createPatternBuilder(dimension);
  let axes = [];
  for (let k = 0; k < dimension; ++k) axes.push(k);
  return `
  function isSamePosition(pos, body1, body2) {
    var offset1 = body1 * ${dimension}, offset2 = body2 * ${dimension};
    ${axes.map(k => `var d${getVariableName(k)} = Math.abs(pos[offset1${k ? ' + ' + k : ''}] - pos[offset2${k ? ' + ' + k : ''}]);`).join('\n    ')}
  
    return ${pattern('d{var} < 1e-8', {join: ' && '})};
  }  
`;
}

function setChildBodyCode(dimension) {
  var quadCount = Math.pow(2, dimension);
  return `
function setChild(node, idx, child) {
  ${setChildBody()}
}`;
  function setChildBody() {
    let childBody = [];
    for (let i = 0; i < quadCount; ++i) {
      let prefix = (i === 0) ? '  ' : '  else ';
      childBody.push(`${prefix}if (idx === ${i}) node.quad${i} = child;`);
    }

    return childBody.join('\n');
    // if (idx === 0) node.quad0 = child;
    // else if (idx === 1) node.quad1 = child;
    // else if (idx === 2) node.quad2 = child;
    // else if (idx === 3) node.quad3 = child;
  }
}

function getChildBodyCode(dimension) {
  return `function getChild(node, idx) {
${getChildBody()}
  return null;
}`;

  function getChildBody() {
    let childBody = [];
    let quadCount = Math.pow(2, dimension);
    for (let i = 0; i < quadCount; ++i) {
      childBody.push(`  if (idx === ${i}) return node.quad${i};`);
    }

    return childBody.join('\n');
    // if (idx === 0) return node.quad0;
    // if (idx === 1) return node.quad1;
    // if (idx === 2) return node.quad2;
    // if (idx === 3) return node.quad3;
  }
}

function getQuadNodeCode(dimension, charges) {
  let pattern = createPatternBuilder(dimension);
  let quadCount = Math.pow(2, dimension);
  var quadNodeCode = `
function QuadNode() {
  // index of the body stored inside this node, or -1. In quad tree only leaf nodes
  // (by construction) contain bodies:
  this.body = -1;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
${assignQuads('  this.')}

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  ${pattern('this.mass_{var} = 0;', {indent: 2})}${charges ? charges.nodeFields('  ') : ''}

  // bounding box coordinates
  ${pattern('this.min_{var} = 0;', {indent: 2})}
  ${pattern('this.max_{var} = 0;', {indent: 2})}
}
`;
  return quadNodeCode;

  function assignQuads(indent) {
    // this.quad0 = null;
    // this.quad1 = null;
    // this.quad2 = null;
    // this.quad3 = null;
    let quads = [];
    for (let i = 0; i < quadCount; ++i) {
      quads.push(`${indent}quad${i} = null;`);
    }
    return quads.join('\n');
  }
}

function getInsertStackCode() {
  return `
/**
 * Our implementation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack () {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function() {
        return this.popIdx === 0;
    },
    push: function (node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressure: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function () {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function () {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // index of the body which needs to be inserted to node
}
`;
}