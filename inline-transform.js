/**
 * Rollup plugin that replaces code generators with the code they generate for
 * a fixed number of dimensions, so the bundle does not need `new Function()`.
 * A repulsion law other than 1/r^2 is compiled while the layout runs, so such
 * a bundle throws for it.
 */
const LAW_ERROR = 'This bundle has pre-generated code for the default repulsion law only. ' +
  'Use ngraph.forcelayout.js for other laws.';
const INERTIA_ERROR = 'This bundle has pre-generated code for the mass as inertia only. ' +
  'Use ngraph.forcelayout.js for another inertia column.';

module.exports = function inlineTransform(dimensions) {
  return {
    name: 'inline-transform',
    transform: function (originalContent, file) {
      // Skip virtual modules (e.g. commonjs proxies), they reuse the file path in their id.
      if (file[0] === '\0' || file.indexOf('?') >= 0) return null;
      if (!file.match(/codeGenerators[\\/]generate/)) return null;

      let content = require(file);
      let matches = originalContent.match(/^\/\/ InlineTransform: (.+)$/gm);
      let additionalTransform = matches ? matches.map(name => {
        let f = name.substr('// InlineTransform: '.length);
        return content[f](dimensions);
      }).join('\n') : '';
      let exportCodeMatch = originalContent.match(/^\/\/ InlineTransformExport: (.+)$/m);
      let codeExport = exportCodeMatch ?  exportCodeMatch[1] :
        generatedExport(content, originalContent, dimensions);
      return { code: `${additionalTransform}\n${codeExport}`, map: null };
    }
  };
};

function generatedExport(content, originalContent, dimensions) {
  // A generator whose code keeps state next to the function it returns gives its whole
  // body, which then runs once per call, as `new Function(body)()` would.
  let bodyMatch = originalContent.match(/^\/\/ InlineTransformBody: (.+)$/m);
  let generated = bodyMatch ? `(function () {\n${content[bodyMatch[1]](dimensions)}\n})()` :
    content(dimensions).toString();
  // The second argument is a law (trees) or the name of the inertia column (integrators)
  return `module.exports = function(dimension, option) {
  if (typeof option === 'string' && option !== 'mass') throw new Error(${JSON.stringify(INERTIA_ERROR)});
  if (option && typeof option === 'object' && !option.isDefault) throw new Error(${JSON.stringify(LAW_ERROR)});
  return ${generated};
}`;
}
