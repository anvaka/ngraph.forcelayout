import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { build } from 'esbuild';
import { execSync } from 'node:child_process';

const libraryRoot = path.resolve(fileURLToPath(new URL('..', import.meta.url)));

// The commit this demo is built from: the copied code installs exactly it (Settings as code)
function commitOf(dir) {
  try {
    return execSync('git rev-parse --short HEAD', {cwd: dir, stdio: ['ignore', 'pipe', 'ignore']}).toString().trim();
  } catch (e) {
    return '';
  }
}

export default defineConfig({
  base: './',
  define: {
    __DEMO_COMMIT__: JSON.stringify(commitOf(libraryRoot))
  },
  plugins: [vue(), localForceLayout()],
  resolve: {
    // Add-ons that live next to the library in this repository, imported by their package names
    alias: {
      'ngraph.forcelayout.pivot': path.join(libraryRoot, 'modules/pivot/index.js'),
      'ngraph.forcelayout.gpu': path.join(libraryRoot, 'modules/gpu/index.js'),
      'ngraph.forcelayout.view': path.join(libraryRoot, 'modules/view/index.js')
    },
    // modules/view imports w-gl, which is installed here: resolve it from demo/, one copy for both
    dedupe: ['w-gl']
  },
  // The dev server may serve files from the whole repository, not only demo/
  server: { port: 8080, host: true, fs: { allow: [libraryRoot] } }
});

/**
 * The demo imports ngraph.forcelayout straight from this repository (`../../../`)
 * so that library edits show up immediately. The library is CommonJS, which Vite
 * only converts inside node_modules, so this plugin bundles it into a single ES
 * module with esbuild and reloads the page whenever one of its files changes.
 * Files under lib/ get the same treatment, so prototypes can reuse library internals.
 */
function localForceLayout() {
  const virtualId = '\0local-forcelayout';
  const virtualPrefix = virtualId + ':';
  const libFolder = path.join(libraryRoot, 'lib') + path.sep;
  // virtual module id -> library files it was built from
  const builtFrom = new Map();

  return {
    name: 'local-forcelayout',
    enforce: 'pre',

    resolveId(source, importer) {
      if (!importer || !source.startsWith('.')) return null;
      const resolved = path.resolve(path.dirname(importer), source);
      if (resolved === libraryRoot || resolved === path.join(libraryRoot, 'index.js')) return virtualId;
      const file = resolved.endsWith('.js') ? resolved : resolved + '.js';
      if (file.startsWith(libFolder)) return virtualPrefix + file;
      return null;
    },

    async load(id) {
      if (id !== virtualId && !id.startsWith(virtualPrefix)) return null;
      const entry = id === virtualId ? path.join(libraryRoot, 'index.js') : id.slice(virtualPrefix.length);
      const result = await build({
        entryPoints: [entry],
        absWorkingDir: libraryRoot,
        bundle: true,
        format: 'esm',
        write: false,
        metafile: true,
        logLevel: 'silent'
      });
      const files = new Set(Object.keys(result.metafile.inputs).map(file => path.resolve(libraryRoot, file)));
      builtFrom.set(id, files);
      files.forEach(file => this.addWatchFile(file));
      return result.outputFiles[0].text;
    },

    hotUpdate({ file }) {
      const stale = [...builtFrom].filter(([, files]) => files.has(file)).map(([id]) => id);
      if (!stale.length) return;
      // Reload the page rather than hot-swapping App.vue: a fresh simulation with the
      // new library code is what we want, and layout settings survive in the URL.
      stale.forEach(id => {
        const mod = this.environment.moduleGraph.getModuleById(id);
        if (mod) this.environment.moduleGraph.invalidateModule(mod);
      });
      this.environment.hot.send({ type: 'full-reload' });
      return [];
    }
  };
}
