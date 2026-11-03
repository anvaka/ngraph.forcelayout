// The drawing's rules on a view: modules/view's style module with the demo's options (look.js),
// and the labels' options.
import {styleNodes} from 'ngraph.forcelayout.view';
import look, {hasNames, styleOptions} from './look.js';

/** Options for createView(): the style module (attachDrawing) sets colors and sizes */
export function viewOptions(graph, layout) {
  return {options: {graph, layout}};
}

/** Options for the labels module: names only, the look's typography */
export function labelOptions(graph) {
  let meta = graph.meta || {};
  let options = Object.assign({}, look.labels);
  if (meta.importance) options.importance = meta.importance;
  // Ids are not names: a graph that has only ids gets no labels (the tooltip shows the id)
  if (!hasNames(graph)) options.text = () => '';
  return options;
}

/**
 * Colors, sizes and link alpha from the data, kept fitting what is on screen (styleNodes).
 * Returns {options, legend, colorOf(node), linkAlpha(), nodeMinSize(), dispose()}: `options` are
 * the style module's, as the copied code can name them.
 */
export function attachDrawing(view, graph, {springLength} = {}) {
  let options = styleOptions(graph, springLength);
  let style = view.use(styleNodes, options);
  return {
    options,
    legend: style.legend(),
    colorOf: style.colorOf,
    linkAlpha: style.linkAlpha,
    nodeMinSize: style.nodeMinSize,
    dispose() {
      if (style && style.dispose) style.dispose();
    }
  };
}
