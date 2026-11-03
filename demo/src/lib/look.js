// How the demo draws a graph: the one place for the drawing's colors, sizes and labels. The page's
// colors are in ../theme.css (the canvas here is its --canvas).
//
// Every graph goes through the same rules, whatever it comes from:
// - Colors come from the data: a category field (a graph file's `colorBy`, or `group`), or the
//   data's own colors (a file's palette, colors as values, link colors). Categories take the
//   palette below in order of size; past it they share a neutral color. Any color too dark for
//   the canvas is lightened to 3:1.
// - Size from links: hubs read as hubs, leaves stay small (the view keeps them out of each
//   other's way, see `nodeRoom`).
// - Labels only for graphs that have names.

// Canvas (theme.css --canvas), also the labels' halo
export const CANVAS = '#0e1624';

// Eight categorical colors for the dark canvas, in this order. Checked with the dataviz palette
// validator against #0e1624: every color 3:1 or more, inside the dark lightness band (OKLCH L
// 0.48-0.67), chroma 0.10 or more; every adjacent pair and all pairs of the first four pass both
// color-vision checks (CVD ΔE >= 8, normal ΔE >= 15). All eight at once can't: gold and orange
// look alike to deuteranopes, teal and green are close for everyone. Categories sit together in a
// layout, and the legend and the tooltip name them.
export const PALETTE = ['#3987e5', '#e66700', '#da5dad', '#259f56', '#9e76f2', '#b18d2a', '#c3513d', '#1aa39a'];
// Categories past the palette
export const OTHER = '#6e7a8d';
// Nodes of a graph without categories: the page's accent family
const PLAIN = '#90f8fc';

const LOOK = {
  background: [14, 22, 36],
  // Links: one color; their alpha follows the ink they put on screen (createGraphScene.js)
  linkRGB: 0xffffff,
  // Opacity links should add to a pixel where they crowd most (the 90th percentile of a grid)
  linkInk: 0.25,
  // Alpha range. Below 1/255 links are thinned (look.js thinned()), so the low end is a share of
  // links drawn at 1/255: a 200k-link hairball on a phone keeps its texture
  linkAlpha: [0.05 / 255, 0.5],
  // Links inside a category take its color; links between categories are this much fainter
  crossLinkShare: 0.6,
  linkWidth: 2,
  // Smallest node in CSS pixels where nodes have room, so colors show at any zoom
  nodeMinSize: 3.5,
  // No node wider than this share of the distance to its nearest neighbour at least as big
  nodeRoom: 0.7,
  // In 3D, the far side of the drawing fades to this share of its alpha
  fog: 0.3,
  styles: {
    // One color for every lit link of a selection or a hover (they keep the node's group in their
    // ends' colors)
    litLinkColor: 0xe6ebf2ff,
    litLinkAlpha: 0.7,
  },
  // Labels: the page's text color, a halo of the canvas wide enough to knock lines out under them
  labels: {
    color: 0xe6ebf2ff,
    halo: 0x0e1624f2,
    haloWidth: 3,
  },
  // Tooltip: the panel's surface, opaque
  inspect: {
    style: 'background:#151e2d;color:#e6ebf2;border-color:rgba(255,255,255,0.1);border-radius:8px;padding:7px 10px;box-shadow:0 8px 24px rgba(0,0,0,0.45);'
  }
};
export default LOOK;

/** Node diameter in scene units: grows with the square root of the links, leaves stay small */
export function nodeSizeOf(graph, unit) {
  return node => {
    let links = degreeOf(node);
    return unit * (links <= 1 ? 0.5 : 0.5 * Math.sqrt(links));
  };
}

export function degreeOf(node) {
  let links = node.links;
  if (!links) return 0;
  return links.size !== undefined ? links.size : links.length;
}

/** A graph has names when at least half of its nodes (of the first 200) have a label or a name */
export function hasNames(graph) {
  let named = 0, seen = 0;
  graph.forEachNode(node => {
    seen += 1;
    let data = node.data;
    if (data && (isName(data.label) || isName(data.name))) named += 1;
    return seen >= 200;
  });
  return seen > 0 && named >= seen / 2;
}

function isName(value) {
  return typeof value === 'string' && value.length > 0;
}

/**
 * The graph's colors: {nodeColor, linkColor(alpha), legend}. `nodeColor` is a node => 0xRRGGBBAA
 * function, or the plain color. `linkColor(alpha)` gives the view's link color for an alpha.
 * `legend` is {title, items: [{color, label, count}], more} or null.
 */
export function colorsOf(graph) {
  let meta = graph.meta || {};
  let field = meta.colorBy || (hasField(graph, 'group') ? 'group' : null);
  let plain = toRGBA(PLAIN);
  let linkRGB = ((LOOK.linkRGB << 8) >>> 0);
  let ownLinks = meta.linkColors ? linkColorsOf(meta.linkColors) : null;
  if (!field) {
    return {nodeColor: plain, legend: null, linkColor: thinned(alpha => ownLinks ? withOwn(ownLinks, alpha, linkRGB) : (linkRGB | alphaByte(alpha)) >>> 0)};
  }
  let counts = new Map();
  graph.forEachNode(node => {
    let value = node.data && node.data[field];
    if (value === undefined || value === null || value === '') return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  let values = Array.from(counts.keys()).sort((a, b) => counts.get(b) - counts.get(a) || String(a).localeCompare(String(b)));
  let colorOf = new Map();
  let legend = null;
  if (meta.palette) {
    // The data's own palette (London's line colors), made readable on the canvas
    values.forEach(value => colorOf.set(value, readable(meta.palette[value] || OTHER)));
    legend = legendOf(field, values, counts, colorOf, 10);
  } else if (values.length && values.every(value => parseColor(String(value)))) {
    // The values are colors (metro lines): draw them, a legend of colors says nothing
    values.forEach(value => colorOf.set(value, readable(parseColor(String(value)))));
  } else {
    values.forEach((value, i) => colorOf.set(value, i < PALETTE.length ? PALETTE[i] : OTHER));
    legend = legendOf(field, values, counts, colorOf, PALETTE.length);
  }
  let rgba = new Map();
  colorOf.forEach((hex, value) => rgba.set(value, toRGBA(hex)));
  let other = toRGBA(OTHER);
  let nodeColor = node => {
    let value = node.data && node.data[field];
    return rgba.get(value) || other;
  };
  let linkColor = thinned(alpha => {
    let a = alphaByte(alpha);
    let cross = (linkRGB | alphaByte(alpha * LOOK.crossLinkShare)) >>> 0;
    if (ownLinks) return withOwn(ownLinks, alpha, cross);
    return link => {
      let from = graph.getNode(link.fromId), to = graph.getNode(link.toId);
      let a1 = from && from.data && from.data[field], a2 = to && to.data && to.data[field];
      if (a1 === undefined || a1 !== a2 || !rgba.has(a1)) return cross;
      return ((rgba.get(a1) & 0xffffff00) | a) >>> 0;
    };
  });
  return {nodeColor, linkColor, legend};
}

function hasField(graph, name) {
  let found = false, seen = 0;
  graph.forEachNode(node => {
    seen += 1;
    if (node.data && node.data[name] !== undefined) found = true;
    return found || seen >= 200;
  });
  return found;
}

function legendOf(field, values, counts, colorOf, max) {
  if (values.length < 2) return null;
  // Bare numbers (Les Misérables' groups) name nothing: the colors show the groups, no legend
  if (values.every(value => typeof value === 'number' || /^\d+$/.test(String(value)))) return null;
  let shown = values.slice(0, max);
  let rest = values.slice(max);
  return {
    title: field.replace(/^_/, ''),
    items: shown.map(value => ({color: colorOf.get(value), label: String(value), count: counts.get(value)})),
    more: rest.length ? {count: rest.length, nodes: rest.reduce((sum, value) => sum + counts.get(value), 0), color: OTHER} : null
  };
}

// Link colors from the data: link.data is a key of `table`, or a color itself ('self')
function linkColorsOf(table) {
  let cache = new Map();
  return value => {
    if (!value) return 0;
    if (!cache.has(value)) {
      let hex = table === 'self' ? parseColor(String(value)) : table[value];
      cache.set(value, hex ? toRGBA(readable(hex)) : 0);
    }
    return cache.get(value);
  };
}

function withOwn(own, alpha, fallback) {
  // The data's link colors are the data: bright enough to read, at least 0.8
  let a = alphaByte(Math.max(alpha, 0.8));
  return link => {
    let color = own(link.data);
    return color ? ((color & 0xffffff00) | a) >>> 0 : fallback;
  };
}

// Below the smallest alpha an 8-bit canvas can blend (1/255), links are thinned instead: a share
// of them, picked by a hash of their ends (the same ones every time), is drawn at 1/255 and the
// rest not at all. A hairball on a phone then keeps the texture a bigger screen shows, where
// every link at 1/255 would still add up to a flat disc.
function thinned(colorOf) {
  let floor = 1 / 255;
  return alpha => {
    if (alpha >= floor) return colorOf(alpha);
    let keep = alpha / floor, color = colorOf(floor);
    let colorFn = typeof color === 'function' ? color : () => color;
    return link => hashOf(link) < keep ? colorFn(link) : ((colorFn(link) & 0xffffff00) >>> 0) || 0xffffff00;
  };
}

let hashes = new WeakMap();
function hashOf(link) {
  let h = hashes.get(link);
  if (h !== undefined) return h;
  let text = String(link.fromId) + ':' + String(link.toId), x = 2166136261;
  for (let i = 0; i < text.length; ++i) x = Math.imul(x ^ text.charCodeAt(i), 16777619);
  h = (x >>> 0) / 4294967296;
  hashes.set(link, h);
  return h;
}

function alphaByte(alpha) {
  return Math.max(1, Math.min(255, Math.round(alpha * 255)));
}

export function toRGBA(hex, alpha = 0xff) {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  return ((parseInt(h.slice(0, 6), 16) << 8) | alpha) >>> 0;
}

/** '#rrggbb' for a CSS color ('red', '#f00', 'rgb(...)'), or null */
let parser = null;
export function parseColor(value) {
  if (/^#[0-9a-f]{6}$/i.test(value)) return value.toLowerCase();
  if (/^#[0-9a-f]{3}$/i.test(value)) return '#' + value.slice(1).split('').map(c => c + c).join('').toLowerCase();
  if (typeof document === 'undefined') return null;
  if (!parser) parser = document.createElement('canvas').getContext('2d');
  parser.fillStyle = '#000001';
  parser.fillStyle = value;
  let parsed = parser.fillStyle;
  if (parsed === '#000001' && value.toLowerCase() !== '#000001') return null;
  return /^#[0-9a-f]{6}$/i.test(parsed) ? parsed : null;
}

/** The color, mixed toward white just enough for 3:1 against the canvas */
export function readable(hex, against = CANVAS, ratio = 3) {
  let rgb = toRGB(hex);
  if (contrast(rgb, toRGB(against)) >= ratio) return hex;
  for (let t = 0.05; t <= 1.001; t += 0.05) {
    let mixed = rgb.map(c => c + (255 - c) * t);
    if (contrast(mixed, toRGB(against)) >= ratio) return toHex(mixed);
  }
  return '#ffffff';
}

function toRGB(hex) {
  let h = hex.replace('#', '');
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16));
}

function toHex(rgb) {
  return '#' + rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function luminance(rgb) {
  let [r, g, b] = rgb.map(c => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a, b) {
  let la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
