import getVariableName from './getVariableName.js';

export default function createPatternBuilder(dimension) {

  return pattern;
  
  function pattern(template, config) {
    const indent = (config && config.indent) || 0;
    const join = (config && config.join !== undefined) ? config.join : '\n';
    const indentString = Array(indent + 1).join(' ');
    const buffer = [];
    for (let i = 0; i < dimension; ++i) {
      const variableName = getVariableName(i);
      const prefix = (i === 0) ? '' : indentString;
      buffer.push(prefix + template.replace(/{var}/g, variableName));
    }
    return buffer.join(join);
  }
};
