/**
 * Rollup plugin that replaces code generators with the code they generate for
 * a fixed number of dimensions, so the bundle does not need `new Function()`.
 */
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
        `module.exports = function() { return ${content(dimensions).toString()} }`;
      return { code: `${additionalTransform}\n${codeExport}`, map: null };
    }
  };
};
