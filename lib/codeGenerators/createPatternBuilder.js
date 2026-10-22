const getVariableName = require('./getVariableName');

/**
 * Repeats a template once per axis. In the template `{var}` is the axis name (x, y, z, c4...),
 * `{k}` is the axis index, and `{+k}` is ` + k` (empty for the first axis), which addresses
 * flat arrays: `pos[offset{+k}]` gives `pos[offset]`, `pos[offset + 1]`...
 */
module.exports = function createPatternBuilder(dimension) {

  return pattern;
  
  function pattern(template, config) {
    let indent = (config && config.indent) || 0;
    let join = (config && config.join !== undefined) ? config.join : '\n';
    let indentString = Array(indent + 1).join(' ');
    let buffer = [];
    for (let i = 0; i < dimension; ++i) {
      let variableName = getVariableName(i);
      let prefix = (i === 0) ? '' : indentString;
      buffer.push(prefix + template
        .replace(/{var}/g, variableName)
        .replace(/{k}/g, String(i))
        .replace(/{\+k}/g, i === 0 ? '' : ' + ' + i));
    }
    return buffer.join(join);
  }
};
