
const createPatternBuilder = require('./createPatternBuilder');

module.exports = generateCreateBodyFunction;
module.exports.generateCreateBodyFunctionBody = generateCreateBodyFunctionBody;

function generateCreateBodyFunction(dimension) {
  let code = generateCreateBodyFunctionBody(dimension);
  let {Body} = (new Function(code))();
  return Body;
}

function generateCreateBodyFunctionBody(dimension) {
  let pattern = createPatternBuilder(dimension);
  let variableList = pattern('{var}', {join: ', '});

  let code = `
function Vector(${variableList}) {
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
};

function Body(${variableList}) {
  this.isPinned = false;
  this.pos = new Vector(${variableList});
  this.force = new Vector();
  this.velocity = new Vector();
  this.mass = 1;

  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.reset = function() {
  this.force.reset();
  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.setPosition = function (${variableList}) {
  ${pattern('this.pos.{var} = {var} || 0;', {indent: 2})}
};

return {Body: Body, Vector: Vector};
`
  return code;
}