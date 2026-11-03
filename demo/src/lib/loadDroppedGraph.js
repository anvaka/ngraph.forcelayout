import fromDot from 'ngraph.fromdot';
import fromJson from 'ngraph.fromjson';
import bus from './bus.js';

/**
 * Loads a graph from a dropped or picked file (DOT or ngraph JSON). The app hears how it went on
 * the bus: 'file-graph' with the file's name, or 'file-error' with a message.
 */
export default function loadDroppedGraph(files) {
  let file = files && files[0];
  if (!file) return;

  var reader = new FileReader();
  reader.readAsText(file, "UTF-8");
  reader.onload = e => {
    let content = e.target.result;
    let graph = tryDot(content) || tryJson(content);
    if (graph && graph.getNodesCount() > 0) {
      bus.fire('file-graph', file.name);
      bus.fire('load-graph', graph);
    } else {
      bus.fire('file-error', `${file.name} is not a graph in DOT or JSON format`);
    }
  }
  reader.onerror = () => {
    bus.fire('file-error', `Could not read ${file.name}`);
  };

  function tryDot(fileContent) {
    try {
      return fromDot(fileContent);
    } catch (e) {
      return null;
    }
  }
  function tryJson(fileContent) {
    try {
      return fromJson(JSON.parse(fileContent));
    } catch (e) {
      return null;
    }
  }
}
