import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { build } from 'esbuild';

const libraryRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

export default defineConfig({
  base: './',
  plugins: [vue(), localForceLayout()],
  server: { port: 8080, host: true }
});

/**
 * The demo imports ngraph.forcelayout straight from this repository (`../../../`)
 * so that library edits show up immediately. The library is CommonJS, which Vite
 * only converts inside node_modules, so this plugin bundles it into a single ES
 * module with esbuild and reloads the page whenever one of its files changes.
 */
function localForceLayout() {
  const virtualId = '\0local-forcelayout';
  let libraryFiles = new Set();

  return {
    name: 'local-forcelayout',
    enforce: 'pre',

    resolveId(source, importer) {
      if (!importer || !source.startsWith('.')) return null;
      const resolved = path.resolve(path.dirname(importer), source);
      if (resolved === libraryRoot || resolved === path.join(libraryRoot, 'index.js')) return virtualId;
      return null;
    },

    async load(id) {
      if (id !== virtualId) return null;
      const result = await build({
        entryPoints: [path.join(libraryRoot, 'index.js')],
        absWorkingDir: libraryRoot,
        bundle: true,
        format: 'esm',
        write: false,
        metafile: true,
        logLevel: 'silent'
      });
      libraryFiles = new Set(Object.keys(result.metafile.inputs).map(file => path.resolve(libraryRoot, file)));
      libraryFiles.forEach(file => this.addWatchFile(file));
      return result.outputFiles[0].text;
    },

    hotUpdate({ file }) {
      if (!libraryFiles.has(file)) return;
      // Reload the page rather than hot-swapping App.vue: a fresh simulation with the
      // new library code is what we want, and layout settings survive in the URL.
      const mod = this.environment.moduleGraph.getModuleById(virtualId);
      if (mod) this.environment.moduleGraph.invalidateModule(mod);
      this.environment.hot.send({ type: 'full-reload' });
      return [];
    }
  };
}
