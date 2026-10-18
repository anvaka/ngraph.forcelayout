import commonjs from '@rollup/plugin-commonjs';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { minify } from 'terser';
import inlineTransform from './inline-transform.js';

export default [
  createBundle('ngraphCreateLayout', 'dist/ngraph.forcelayout'),
  // 2D only: code generators are replaced with pre-generated code (see inline-transform.js)
  createBundle('ngraphCreate2dLayout', 'dist/ngraph.forcelayout2d', [inlineTransform(2)])
];

function createBundle(globalName, outputPath, extraPlugins = []) {
  return {
    input: 'index.js',
    output: [
      { file: `${outputPath}.js`, format: 'umd', name: globalName },
      { file: `${outputPath}.min.js`, format: 'umd', name: globalName, plugins: [minifyChunk()] }
    ],
    plugins: [...extraPlugins, nodeResolve(), commonjs()]
  };
}

// Same as the previous `terser --compress` build step (mangle stays off). Calls terser
// directly: @rollup/plugin-terser 0.4 pulls a vulnerable serialize-javascript, and 1.0 needs Node 20.
function minifyChunk() {
  return { name: 'minify', renderChunk: code => minify(code, { mangle: false }) };
}
