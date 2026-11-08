// Builds the world off the main thread, so the page stays responsive while it is drawn.
import {buildWorld} from './world.js';
import {planarSubgraph} from './planar.js';

self.onmessage = async ({data}) => {
  try {
    let result = await buildWorld(data.doc, {
      seed: data.seed, planarSubgraph,
      onProgress: progress => self.postMessage({type: 'progress', progress}),
    });
    self.postMessage({type: 'done', result});
  } catch (error) {
    self.postMessage({type: 'error', message: error.message, stack: error.stack});
  }
};
