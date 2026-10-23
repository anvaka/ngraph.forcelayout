import { createApp } from 'vue'
import { isWebGLEnabled } from 'w-gl';
import App from './App.vue'
import fileDrop from './lib/fileDrop.js';
import loadDroppedGraph from './lib/loadDroppedGraph.js';

// The demo draws with WebGL, and w-gl doesn't check for it: without WebGL there is only the
// message from index.html
if (isWebGLEnabled(document.getElementById('cnv'))) {
  createApp(App).mount('#app')

  // When they drop a `.dot` file into the browser - let's load it.
  fileDrop(document.body, loadDroppedGraph);
} else {
  document.body.classList.add('no-webgl');
}
