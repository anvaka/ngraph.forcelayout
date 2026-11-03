// The demo's few choices for the drawing. The rules themselves (colors from the data, size by
// links, link alpha by ink, rings, fog) are modules/view's style module (styleNodes), so a page
// that copies this demo gets the same picture by naming the same options. The page's own colors
// are in ../theme.css (the canvas here is its --canvas).
import {PALETTE, OTHER, sizeByLinks} from 'ngraph.forcelayout.view';

export {PALETTE, OTHER};

// Canvas (theme.css --canvas)
export const CANVAS = '#0e1624';

const LOOK = {
  background: [14, 22, 36],
  // The style module's defaults, for code that reads them before it runs
  linkAlpha: [0.05 / 255, 0.5],
  nodeMinSize: 3.5,
  // Labels: the page's text color, a halo of the canvas wide enough to knock lines out under them
  labels: {
    color: 0xe6ebf2ff,
    halo: 0x0e1624b3,
    haloWidth: 2,
  },
  // Tooltip: the panel's surface, opaque
  inspect: {
    style: 'background:#151e2d;color:#e6ebf2;border-color:rgba(255,255,255,0.1);border-radius:8px;padding:7px 10px;box-shadow:0 8px 24px rgba(0,0,0,0.45);'
  }
};
export default LOOK;

/**
 * The style module's options for this graph: what its file says colors mean (colorBy, palette,
 * linkColors, see loadLabelledGraph.js), the canvas, and a node unit that follows the spring
 * length. Every option the demo sets is here, so the copied code can name the same ones.
 */
export function styleOptions(graph, springLength) {
  let meta = graph.meta || {};
  let options = {background: CANVAS};
  if (meta.colorBy) options.colorBy = meta.colorBy;
  if (meta.palette) options.palette = meta.palette;
  if (meta.linkColors) options.linkColors = meta.linkColors;
  if (springLength && springLength !== 10) options.unit = springLength / 10;
  return options;
}

/** Node diameter in scene units, as the style module sets it (kept for code that reads it here) */
export function nodeSizeOf(graph, unit) {
  return sizeByLinks(unit);
}

/**
 * A graph has names when at least half of its nodes (of the first 200) have a label, a name, or
 * an id that is a word rather than a number (a DOT file's `Alice -- Bob`)
 */
export function hasNames(graph) {
  let named = 0, seen = 0;
  graph.forEachNode(node => {
    seen += 1;
    let data = node.data;
    if ((data && (isName(data.label) || isName(data.name))) || isWord(node.id)) named += 1;
    return seen >= 200;
  });
  return seen > 0 && named >= seen / 2;
}

function isWord(id) {
  return typeof id === 'string' && id.length > 0 && !/^[-+]?\d+(\.\d+)?$/.test(id.trim());
}

function isName(value) {
  return typeof value === 'string' && value.length > 0;
}
