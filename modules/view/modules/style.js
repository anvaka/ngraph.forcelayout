// style: colors and sizes from the graph's data, kept readable while the layout and the camera move.
//
//   view.use(styleNodes);                                   // colors by node.data.group, if any
//   let style = view.use(styleNodes, {colorBy: 'branch', background: '#0e1624'});
//   style.legend(); // {title, items: [{color, label, count}], more} or null
//   style.update({background: '#ffffff'}); // the light look
//
// One set of rules for any graph, on a dark background or a light one:
// - **Color from a category** (`colorBy`: a field of node.data, or `node => value`; default
//   `group` when nodes have one). Categories take PALETTE in order of size, the biggest first;
//   past its eight colors they share OTHER. A `palette` ({value: color}) gives the data's own
//   colors, and values that are colors themselves (`'#e42313'`, `'red'`) are drawn as they are.
//   Any color too close to the background is moved away from it (lightened on a dark one,
//   darkened on a light one) to 3:1 against it. Links inside a category
//   take its color; links between categories are neutral and fainter. `linkColors`
//   ({value: color} for `link.data`, or `'self'` when link.data is a color) colors links by the
//   data instead. Nodes without a category are `color`.
// - **Size from links**: a leaf is `unit` scene units wide, a node with k links unit·√k.
// - **Link alpha from their ink**: at most every 300 ms the links are binned on a 32 x 32 grid over
//   the drawing (see linkCrowding), and their alpha is set so the most crowded tenth of the cells
//   gets `ink` of opacity. A hairball's core isn't a solid disc, a sparse tree's links are bright, and zooming
//   in brings them up. Below 1/255 (the least an 8-bit canvas blends) a fixed share of the links
//   is drawn at 1/255 instead.
// - **Nodes at least `minSize` pixels wide**, less where they crowd (1 px at the least), and no
//   wider than `room` of the distance to their nearest neighbour as big (the view's nodeRoom).
// - **Highlights**: nodes keep their color and get a ring, with a halo of the background: white
//   under the pointer, cyan (the page's focus color) when focused or found by search, amber when
//   selected; lit links in one light color. On a light background: near black, dark cyan, dark
//   amber, and dark lit links.
// - **`background`** (any CSS color): the scene's clear color, the rings' halo and the labels'
//   halo. It also picks the view's theme (see theme.js): a background that black text reads
//   better on than white text is light, and then links, label text, the rings and the panels of
//   the other modules (tooltip, search, help) are dark on light.
// - In 3D, `fog` fades the far side of the drawing.
//
// Options (defaults): colorBy, palette, linkColors, color ('#90f8fc'; '#0b7a8a' on a light
// background), background ('#0e1624'),
// unit (1), ink (0.25; 0.35 on a light background), alpha ([0.05 / 255, 0.5]), crossLinks (0.6, alpha share of links between
// categories), minSize (3.5), room (0.7), fog (0.3), rings (true), dim (0.3: the alpha of what
// isn't selected or next to it, while something is selected), linkWidth (2).
//
// API: legend(), colorOf(node) (0xRRGGBBAA), linkAlpha(), nodeMinSize(), update(options) (reads
// the data again, with new options when given), dispose().
import {THEMES, themeOf, toRGB, luminance} from '../theme.js';

// Eight categorical colors, in this order, for the dark background and for a white one. Checked
// with the dataviz palette validator against #0e1624 and against #ffffff: every color 3:1 or
// more, in the lightness band of both (OKLCH L 0.48-0.67), chroma 0.10 or more; every adjacent pair, and all pairs of the first four, pass both
// color-vision checks (CVD ΔE >= 8, normal ΔE >= 15). All eight at once can't: gold and orange
// look alike to deuteranopes, teal and green are close. Categories sit together in a layout, and
// a legend and the tooltip name them.
export const PALETTE = ['#3987e5', '#e66700', '#da5dad', '#259f56', '#9e76f2', '#b18d2a', '#c3513d', '#1aa39a'];
// Categories past the palette
export const OTHER = '#6e7a8d';

const DEFAULTS = {
  colorBy: undefined,
  palette: null,
  linkColors: null,
  // The theme's: '#90f8fc' on a dark background, '#0b7a8a' on a light one
  color: undefined,
  background: '#0e1624',
  unit: 1,
  // The theme's: 0.25 on a dark background, 0.35 on a light one
  ink: undefined,
  alpha: [0.05 / 255, 0.5],
  crossLinks: 0.6,
  minSize: 3.5,
  room: 0.7,
  fog: 0.3,
  rings: true,
  dim: 0.3,
  linkWidth: 2
};

export default {
  name: 'style',
  attach(ctx, options = {}) {
    let settings = Object.assign({}, DEFAULTS, options);
    let view = ctx.view, graph = ctx.graph;
    let colors = null;
    let alpha = settings.alpha[1], minSize = settings.minSize;
    let timer = 0, at = 0, labelsStyled = false;

    apply();
    ctx.onFrame(change => {
      if (!labelsStyled) styleLabels();
      if (change.positions || change.camera) schedule();
    });
    ctx.onCamera(schedule);
    graph.on('changed', onGraphChanged);

    return {
      legend: () => colors.legend,
      colorOf: node => colors.nodeColor(node),
      linkAlpha: () => alpha,
      nodeMinSize: () => minSize,
      // Read the data again (after its fields changed), with new options when there are any
      update(newOptions) {
        if (newOptions) Object.assign(settings, newOptions);
        apply();
      },
      dispose() {
        clearTimeout(timer);
        graph.off('changed', onGraphChanged);
      }
    };

    function onGraphChanged() {
      apply();
    }

    function apply() {
      let background = backgroundOf(settings.background);
      let theme = THEMES[themeOf(background)];
      colors = colorsOf(graph, settings);
      let rgb = toRGB(background);
      ctx.scene.setClearColor(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1);
      // The rest of the view follows: its own defaults, the labels, the panels of other modules
      view.setTheme(themeOf(background));
      let halo = toRGBA(background);
      view.setDrawing({
        nodeSize: sizeByLinks(settings.unit),
        nodeRoom: settings.room,
        fog: settings.fog,
        linkWidth: settings.linkWidth
      });
      view.setNodeColor(colors.nodeColor);
      view.setLinkColor(colors.linkColor(alpha));
      view.setNodeMinSize(minSize);
      // While something is selected the rest fades to `dim`: enough to show the selection, not so
      // much that the visitor loses where it is (the rings mark the selection already)
      let styles = {litLinkColor: theme.text, litLinkAlpha: 0.7, dimAlpha: settings.dim};
      if (settings.rings) {
        Object.assign(styles, {
          pointedColor: 0, pointedMinSize: 10, pointedRing: theme.pointedRing,
          selectedColor: 0, selectedMinSize: 8, selectedRing: theme.selectedRing,
          // Focus (the keyboard's place, a node search went to) in the page's focus color, so a
          // found node and a hovered one never look the same
          focusedRing: theme.focusedRing,
          ringHalo: halo, ringGap: 2, ringWidth: 2
        });
      }
      view.setStyles(styles);
      labelsStyled = false;
      schedule();
    }

    // Labels attached after this module get the background's halo at the next frame
    function styleLabels() {
      let labels = view.getModule && view.getModule('labels');
      if (!labels) return;
      labelsStyled = true;
      // A thin, part-see-through halo: enough to lift the text off links and dots, without
      // punching dark boxes into the drawing
      let background = backgroundOf(settings.background);
      labels.update({color: THEMES[themeOf(background)].text, halo: (toRGBA(background) & 0xffffff00 | 0xb3) >>> 0, haloWidth: 2});
    }

    function schedule() {
      if (timer) return;
      timer = setTimeout(measure, Math.max(0, 300 - (performance.now() - at)));
    }

    function measure() {
      timer = 0;
      at = performance.now();
      let layout = view.getLayout();
      if (!layout || !layout.simulator) return;
      let sim = layout.simulator, pos = sim.store.pos, D = sim.store.D, springs = sim.springStore;
      let n = sim.store.n;
      if (!n) return;
      let rect = layout.getGraphRect();
      let w = rect.max_x - rect.min_x, h = rect.max_y - rect.min_y;
      let k = pixelsPerUnit(rect);
      if (!(k > 0) || !(w > 0) || !(h > 0)) return;

      // Nodes: 1 to minSize pixels, by how many share a pixel of the drawing's box
      let perNode = w * h * k * k / n;
      let size = Math.min(settings.minSize, Math.max(1, Math.sqrt(0.15 * perNode)));
      if (Math.abs(size - minSize) > 0.1) {
        minSize = size;
        view.setNodeMinSize(size);
      }

      // Links: how much of the screen they cover where they crowd
      if (!springs.n) return;
      let crowded = linkCrowding(pos, D, springs, rect, k, settings.linkWidth);
      if (!(crowded > 0)) return;
      let [low, high] = settings.alpha;
      let next = Math.min(high, Math.max(low, inkOf() / Math.max(crowded, 1e-9)));
      // Rebuilding link colors costs a pass over the links: only for a visible change
      if (Math.abs(next - alpha) / alpha < 0.15) return;
      alpha = next;
      view.setLinkColor(colors.linkColor(alpha));
    }

    function inkOf() {
      return settings.ink !== undefined ? settings.ink : THEMES[view.getTheme()].linkInk;
    }

    // CSS pixels per unit of the scene at the middle of the drawing
    function pixelsPerUnit(rect) {
      let cx = (rect.min_x + rect.max_x) / 2, cy = (rect.min_y + rect.max_y) / 2;
      let cz = rect.min_z !== undefined ? (rect.min_z + rect.max_z) / 2 : 0;
      let a = view.toScreen(cx, cy, cz), b = view.toScreen(cx + 1, cy, cz), c = view.toScreen(cx, cy + 1, cz);
      if (!a || !b || !c) return 0;
      return Math.max(Math.hypot(b.x - a.x, b.y - a.y), Math.hypot(c.x - a.x, c.y - a.y));
    }
  }
};

/** Node diameter in scene units: a leaf is `unit`·0.5, a node with k links `unit`·0.5·√k */
export function sizeByLinks(unit = 1) {
  return node => {
    let links = degreeOf(node);
    return unit * (links <= 1 ? 0.5 : 0.5 * Math.sqrt(links));
  };
}

function degreeOf(node) {
  let links = node.links;
  if (!links) return 0;
  return links.size !== undefined ? links.size : links.length;
}

// Cells along each side of the grid that measures link ink
const BINS = 32;
// A link is cut into at most this many pieces, each binned where it lies
const MAX_PIECES = 2 * BINS;

/**
 * How much links cover the screen where they crowd: links are binned on a BINS x BINS grid over
 * `rect` (the layout's box), and the answer is the coverage of the cell at the 90th percentile
 * of the cells that have any (1: as much link as the cell has area; links overlap, so it can be
 * more). `pixelsPerUnit` is the zoom, `linkWidth` in pixels.
 *
 * Every link gives each cell the length that crosses it (it is cut into pieces no longer than a
 * cell), and no cell is thinner than a link is wide. Otherwise a graph of a few long links would
 * put each link's whole length into one small cell, and a chain that settles into a straight line
 * would have cells of no height: both read as crowded, and their links were drawn almost
 * transparent.
 */
export function linkCrowding(pos, D, springs, rect, pixelsPerUnit, linkWidth) {
  let count = springs.n;
  let width = linkWidth / pixelsPerUnit;
  let w = Math.max(rect.max_x - rect.min_x, BINS * width), h = Math.max(rect.max_y - rect.min_y, BINS * width);
  if (!count || !(w > 0) || !(h > 0)) return 0;
  let left = (rect.min_x + rect.max_x) / 2 - w / 2, top = (rect.min_y + rect.max_y) / 2 - h / 2;
  let cellW = w / BINS, cellH = h / BINS, cell = Math.min(cellW, cellH);
  let cells = new Float64Array(BINS * BINS);
  // At most about 20,000 links are measured; each stands for `step` links
  let step = Math.max(1, Math.floor(count / 20000));
  for (let i = 0; i < count; i += step) {
    let a = springs.from[i] * D, b = springs.to[i] * D;
    let x1 = pos[a], y1 = pos[a + 1], dx = pos[b] - x1, dy = pos[b + 1] - y1;
    let length = Math.hypot(dx, dy);
    let pieces = Math.min(MAX_PIECES, Math.max(1, Math.ceil(length / cell)));
    let ink = length * step / pieces;
    for (let p = 0; p < pieces; ++p) {
      let t = (p + 0.5) / pieces;
      let mx = Math.min(BINS - 1, Math.max(0, Math.floor((x1 + dx * t - left) / cellW)));
      let my = Math.min(BINS - 1, Math.max(0, Math.floor((y1 + dy * t - top) / cellH)));
      cells[my * BINS + mx] += ink;
    }
  }
  let cellArea = cellW * cellH;
  let filled = [];
  for (let c = 0; c < cells.length; ++c) if (cells[c] > 0) filled.push(cells[c] * width / cellArea);
  if (!filled.length) return 0;
  filled.sort((p, q) => p - q);
  return filled[Math.floor(0.9 * (filled.length - 1))];
}

/**
 * The graph's colors by the rules above: {nodeColor: node => 0xRRGGBBAA, linkColor: alpha =>
 * color or link => color, legend}. `options` as the module's.
 */
export function colorsOf(graph, options = {}) {
  let settings = Object.assign({}, DEFAULTS, options);
  let background = backgroundOf(settings.background);
  let theme = THEMES[themeOf(background)];
  let readableOn = hex => readable(hex, background);
  let valueOf = typeof settings.colorBy === 'function' ? settings.colorBy
    : settings.colorBy ? node => node.data && node.data[settings.colorBy]
    : hasField(graph, 'group') ? node => node.data && node.data.group : null;
  let title = typeof settings.colorBy === 'string' ? settings.colorBy.replace(/^_/, '') : 'group';
  let plain = toRGBA(readableOn(settings.color || theme.node));
  // Links between categories, and all links when there are none: white on dark, ink on light
  let linkRGB = theme.link;
  let ownLinks = settings.linkColors ? linkColorsOf(settings.linkColors, readableOn) : null;
  if (!valueOf) {
    return {nodeColor: () => plain, legend: null, linkColor: thinned(alpha => ownLinks ? withOwn(ownLinks, alpha, (linkRGB | alphaByte(alpha)) >>> 0) : (linkRGB | alphaByte(alpha)) >>> 0)};
  }
  let counts = new Map();
  graph.forEachNode(node => {
    let value = valueOf(node);
    if (value === undefined || value === null || value === '') return;
    counts.set(value, (counts.get(value) || 0) + 1);
  });
  let values = Array.from(counts.keys()).sort((a, b) => counts.get(b) - counts.get(a) || String(a).localeCompare(String(b)));
  let colorOf = new Map();
  let legend = null;
  if (settings.palette) {
    // The data's own palette (London's line colors), made readable on the background
    values.forEach(value => colorOf.set(value, readableOn(settings.palette[value] || OTHER)));
    legend = legendOf(title, values, counts, colorOf, 10);
  } else if (values.length && values.every(value => parseColor(String(value)))) {
    // The values are colors (metro lines): draw them; a legend of colors says nothing
    values.forEach(value => colorOf.set(value, readableOn(parseColor(String(value)))));
  } else {
    values.forEach((value, i) => colorOf.set(value, i < PALETTE.length ? PALETTE[i] : OTHER));
    legend = legendOf(title, values, counts, colorOf, PALETTE.length);
  }
  let rgba = new Map();
  colorOf.forEach((hex, value) => rgba.set(value, toRGBA(hex)));
  let other = toRGBA(OTHER);
  let nodeColor = node => rgba.get(valueOf(node)) || other;
  let linkColor = thinned(alpha => {
    let a = alphaByte(alpha);
    let cross = (linkRGB | alphaByte(alpha * settings.crossLinks)) >>> 0;
    if (ownLinks) return withOwn(ownLinks, alpha, cross);
    return link => {
      let from = graph.getNode(link.fromId), to = graph.getNode(link.toId);
      let a1 = from && valueOf(from), a2 = to && valueOf(to);
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

function legendOf(title, values, counts, colorOf, max) {
  if (values.length < 2) return null;
  // Bare numbers (Les Misérables' groups) name nothing: the colors show the groups, no legend
  if (values.every(value => typeof value === 'number' || /^\d+$/.test(String(value)))) return null;
  let shown = values.slice(0, max);
  let rest = values.slice(max);
  return {
    title,
    items: shown.map(value => ({color: colorOf.get(value), label: String(value), count: counts.get(value)})),
    more: rest.length ? {count: rest.length, nodes: rest.reduce((sum, value) => sum + counts.get(value), 0), color: OTHER} : null
  };
}

// Link colors from the data: link.data is a key of `table`, or a color itself ('self')
function linkColorsOf(table, readableOn) {
  let cache = new Map();
  return value => {
    if (!value) return 0;
    if (!cache.has(value)) {
      let hex = table === 'self' ? parseColor(String(value)) : table[value];
      cache.set(value, hex ? toRGBA(readableOn(hex)) : 0);
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
// rest not at all.
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

/** '#rrggbb' for a CSS color ('red', '#f00', '#e42313'), or null */
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

/**
 * The color, mixed just enough for `ratio` (3:1) against `against`: toward white when that is a
 * dark background, toward black when it is a light one
 */
export function readable(hex, against = '#0e1624', ratio = 3) {
  let rgb = toRGB(hex), other = toRGB(against);
  if (contrast(rgb, other) >= ratio) return hex;
  let end = themeOf(against) === 'light' ? 0 : 255;
  for (let t = 0.05; t <= 1.001; t += 0.05) {
    let mixed = rgb.map(c => c + (end - c) * t);
    if (contrast(mixed, other) >= ratio) return toHex(mixed);
  }
  return end ? '#ffffff' : '#000000';
}

// The background as '#rrggbb', from any CSS color
function backgroundOf(value) {
  let hex = parseColor(String(value));
  if (!hex) throw new Error('The style module needs a color for its background, and got: ' + value);
  return hex;
}

function toHex(rgb) {
  return '#' + rgb.map(c => Math.round(c).toString(16).padStart(2, '0')).join('');
}

function contrast(a, b) {
  let la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}
