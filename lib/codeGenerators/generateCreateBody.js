
const createPatternBuilder = require('./createPatternBuilder');
const getVariableName = require('./getVariableName');
const createSingleBodyStore = require('../createBodyStore').createSingleBodyStore;

module.exports = generateCreateBodyFunction;
module.exports.generateCreateBodyFunctionBody = generateCreateBodyFunctionBody;

// InlineTransform: getVectorCode
module.exports.getVectorCode = getVectorCode;
// InlineTransform: getBodyCode
module.exports.getBodyCode = getBodyCode;
// InlineTransformExport: module.exports = function() { return Body; }

/**
 * A body is a view of one slot in a body store (see createBodyStore.js): `body.pos.x` reads
 * and writes `store.pos[index * dimension]`. A body made with `new Body(x, y)` gets a store of
 * its own; a simulator moves it into its store when the body is added.
 */
function generateCreateBodyFunction(dimension, debugSetters) {
  let code = generateCreateBodyFunctionBody(dimension, debugSetters);
  let {Body} = (new Function('createSingleBodyStore', code))(createSingleBodyStore);
  return Body;
}

function generateCreateBodyFunctionBody(dimension, debugSetters) {
  let code = `
${getVectorCode(dimension, debugSetters)}
${getBodyCode(dimension, debugSetters)}
return {Body: Body, Vector: Vector};
`;
  return code;
}

function getBodyCode(dimension, debugSetters) {
  let pattern = createPatternBuilder(dimension);
  let variableList = pattern('{var}', {join: ', '});
  let axes = [];
  for (let k = 0; k < dimension; ++k) axes.push(k);
  let each = (template, join) => axes.map(template).join(join === undefined ? '\n' : join);

  return `
${getViewCode('PositionView', 'pos', dimension, debugSetters)}
${getViewCode('ForceView', 'force', dimension, debugSetters)}
${getViewCode('VelocityView', 'velocity', dimension, debugSetters)}

function Body(${variableList}, store, index) {
  if (store === undefined) {
    // Not in a simulator yet: keep the numbers in a store of its own
    store = createSingleBodyStore(${dimension});
    index = 0;
    if (typeof arguments[0] === 'object') {
      let v = arguments[0];
      ${pattern('if (!Number.isFinite(v.{var})) throw new Error("Expected value is not a finite number at Vector constructor ({var})");', {indent: 6})}
      ${each(k => `store.pos[${k}] = v.${getVariableName(k)};`, '\n      ')}
    } else {
      ${each(k => `store.pos[${k}] = typeof ${getVariableName(k)} === "number" ? ${getVariableName(k)} : 0;`, '\n      ')}
    }
  }
  this.store = store;
  this.index = index;
  this.pos = new PositionView(store, index * ${dimension});
  this.force = new ForceView(store, index * ${dimension});
  this.velocity = new VelocityView(store, index * ${dimension});
}

/**
 * Makes a body for slot \`index\` of \`store\`, keeping the numbers that are already there.
 */
Body.inStore = function (store, index) {
  return new Body(${axes.map(() => 'undefined').join(', ')}, store, index);
};

Object.defineProperties(Body.prototype, {
  mass: {
    get: function () { return this.store.mass[this.index]; },
    set: function (value) {
      var store = this.store;
      store.mass[this.index] = value;
      // stores of simulators keep versions of their columns (see initColumnStore.js)
      if (store.versions !== undefined) store.versions.mass = ++store.versionClock;
    },
    enumerable: true
  },
  isPinned: {
    get: function () { return this.store.pinned[this.index] === 1; },
    set: function (value) {
      var store = this.store;
      store.pinned[this.index] = value ? 1 : 0;
      if (store.versions !== undefined) store.versions.pinned = ++store.versionClock;
    },
    enumerable: true
  },
  springCount: {
    get: function () { return this.store.springCount[this.index]; },
    set: function (value) { this.store.springCount[this.index] = value; },
    enumerable: true
  },
  springLength: {
    get: function () { return this.store.springLength[this.index]; },
    set: function (value) { this.store.springLength[this.index] = value; },
    enumerable: true
  },
  degree: {
    get: function () { return this.store.degree[this.index]; },
    enumerable: true
  }
});

/**
 * Points this body (and its vectors) to slot \`index\` of \`store\`. The numbers are not copied.
 */
Body.prototype.moveTo = function (store, index) {
  var offset = index * ${dimension};
  this.store = store;
  this.index = index;
  this.pos.store = this.force.store = this.velocity.store = store;
  this.pos.offset = this.force.offset = this.velocity.offset = offset;
  this.pos.array = store.pos;
  this.force.array = store.force;
  this.velocity.array = store.velocity;
};

Body.prototype.reset = function() {
  var force = this.store.force, offset = this.index * ${dimension};
  ${each(k => `force[offset${k ? ' + ' + k : ''}] = 0;`, ' ')}
  this.store.springCount[this.index] = 0;
  this.store.springLength[this.index] = 0;
};

Body.prototype.setPosition = function (${variableList}) {
  var store = this.store, pos = store.pos, offset = this.index * ${dimension};
  ${each(k => `pos[offset${k ? ' + ' + k : ''}] = ${getVariableName(k)} || 0;`, '\n  ')}
  ${markChanged('store', 'pos')}
};

Body.prototype.toJSON = function () {
  return {
    isPinned: this.isPinned,
    pos: this.pos.toJSON(),
    force: this.force.toJSON(),
    velocity: this.velocity.toJSON(),
    mass: this.mass,
    springCount: this.springCount,
    springLength: this.springLength
  };
};
// console.log() in node shows the numbers, not the store behind them
Body.prototype[Symbol.for('nodejs.util.inspect.custom')] = Body.prototype.toJSON;`;
}

// Positions and velocities written from outside the simulator (dragging a node, say) mark their
// column, so engines with their own copy of the numbers see the write. Forces are cleared every step.
function markChanged(store, column) {
  return `if (${store}.versions !== undefined) ${store}.versions.${column} = ++${store}.versionClock;`;
}

function getViewCode(className, column, dimension, debugSetters) {
  let axes = [];
  for (let k = 0; k < dimension; ++k) axes.push(k);
  let at = k => `this.offset${k ? ' + ' + k : ''}`;
  let check = name => debugSetters ? `if (!Number.isFinite(value)) throw new Error('Cannot set non-numbers to ${name}'); ` : '';
  let mark = column === 'force' ? '' : ' var store = this.store; ' + markChanged('store', column);
  return `
function ${className}(store, offset) {
  this.store = store;
  this.offset = offset;
  // The store's current array; Body.moveTo() updates it when the store grows
  this.array = store.${column};
}
Object.defineProperties(${className}.prototype, {
${axes.map(k => `  ${getVariableName(k)}: {
    get: function () { return this.array[${at(k)}]; },
    set: function (value) { ${check(getVariableName(k))}this.array[${at(k)}] = value;${mark} },
    enumerable: true
  }`).join(',\n')}
});
${className}.prototype.reset = function () {
  var array = this.array;
  ${axes.map(k => `array[${at(k)}] = 0;`).join(' ')}${mark ? '\n ' + mark : ''}
};
${className}.prototype.toJSON = function () {
  return { ${axes.map(k => `${getVariableName(k)}: this.array[${at(k)}]`).join(', ')} };
};
${className}.prototype[Symbol.for('nodejs.util.inspect.custom')] = ${className}.prototype.toJSON;`;
}

function getVectorCode(dimension, debugSetters) {
  let pattern = createPatternBuilder(dimension);
  let setters = '';
  if (debugSetters) {
    setters = `${pattern("\n\
   var v{var};\n\
Object.defineProperty(this, '{var}', {\n\
  set: function(v) { \n\
    if (!Number.isFinite(v)) throw new Error('Cannot set non-numbers to {var}');\n\
    v{var} = v; \n\
  },\n\
  get: function() { return v{var}; }\n\
});")}`;
  }

  let variableList = pattern('{var}', {join: ', '});
  return `function Vector(${variableList}) {
  ${setters}
    if (typeof arguments[0] === 'object') {
      // could be another vector
      let v = arguments[0];
      ${pattern('if (!Number.isFinite(v.{var})) throw new Error("Expected value is not a finite number at Vector constructor ({var})");', {indent: 4})}
      ${pattern('this.{var} = v.{var};', {indent: 4})}
    } else {
      ${pattern('this.{var} = typeof {var} === "number" ? {var} : 0;', {indent: 4})}
    }
  }

  Vector.prototype.reset = function () {
    ${pattern('this.{var} = ', {join: ''})}0;
  };`;
}
