
import createPatternBuilder from './createPatternBuilder.js';

export default function generateCreateBodyFunction(dimension, debugSetters) {
  const code = generateCreateBodyFunctionBody(dimension, debugSetters);
  const {Body} = (new Function(code))();
  return Body;
}

export function generateCreateVectorFunction(dimension, debugSetters) {
  const code = generateCreateBodyFunctionBody(dimension, debugSetters);
  const {Vector} = (new Function(code))();
  return Vector;
}

export function generateCreateBodyFunctionBody(dimension, debugSetters) {
  const code = `
${getVectorCode(dimension, debugSetters)}
${getBodyCode(dimension, debugSetters)}
return {Body: Body, Vector: Vector};
`;
  return code;
}

export function getBodyCode(dimension) {
  const pattern = createPatternBuilder(dimension);
  const variableList = pattern('{var}', {join: ', '});
  return `
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
};`;
}

export function getVectorCode(dimension, debugSetters) {
  const pattern = createPatternBuilder(dimension);
  let setters = '';
  if (debugSetters) {
    setters = `${pattern("\n\
   let v{var};\n\
Object.defineProperty(this, '{var}', {\n\
  set: function(v) { \n\
    if (!Number.isFinite(v)) throw new Error('Cannot set non-numbers to {var}');\n\
    v{var} = v; \n\
  },\n\
  get: function() { return v{var}; }\n\
});")}`;
  }

  const variableList = pattern('{var}', {join: ', '});
  return `function Vector(${variableList}) {
  ${setters}
    if (typeof arguments[0] === 'object') {
      // could be another vector
      const v = arguments[0];
      ${pattern('if (!Number.isFinite(v.{var}) && v.{var} !== undefined) throw new Error("Expected value is not a finite number at Vector constructor ({var})");', {indent: 6})}
      ${pattern('this.{var} = v.{var} !== undefined ? v.{var}: 1;', {indent: 6})}
    } else {
      ${pattern('this.{var} = typeof {var} === "number" ? {var} : 0;', {indent: 6})}
    }
  }
  
  Vector.prototype.reset = function () {
    ${pattern('this.{var} = ', {join: ''})}0;
  };`;
}