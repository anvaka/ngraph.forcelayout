import { createApp } from 'vue'
import { isWebGLEnabled } from 'w-gl';
import App from './App.vue'
// The look: tokens and control styles for every panel element (see theme.css)
import './theme.css'
import fileDrop from './lib/fileDrop.js';
import loadDroppedGraph from './lib/loadDroppedGraph.js';

// The demo draws with WebGL, and w-gl doesn't check for it: without WebGL there is only the
// message from index.html. The check uses a canvas of its own: the first getContext() on #cnv
// fixes its options, and the scene asks for a context without multisampling.
if (isWebGLEnabled(document.createElement('canvas'))) {
  createApp(App).mount('#app')

  // When they drop a `.dot` file into the browser - let's load it.
  fileDrop(document.body, loadDroppedGraph);
} else {
  document.body.classList.add('no-webgl');
}
