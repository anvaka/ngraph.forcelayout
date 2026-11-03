// createView(): draws a graph that an ngraph.forcelayout layout moves, on a w-gl scene, and lets
// modules add interaction on top of it.
//
//   const scene = createScene(canvas);
//   const view = createView(scene, { graph, layout });
//   view.use(hoverNodes);   // modules: hover, drag, select (see modules/)
//   layout.step();          // the view redraws on the layout's 'step' event
//   view.setLayout(next);   // a new layout of the same graph
//   view.dispose();
//
// Positions go to the GPU as a texture, filled in one pass over the layout's `store.pos`; nodes
// and edges read them there, so a frame costs one loop over the nodes and one upload, and nothing
// at all when no position changed. Frames are drawn only when something changed: a step of the
// layout, a camera move, a flag, or a call below.
//
// The view takes over camera input from the scene (see camera.js and input.js): pointers, the
// wheel and keys go through one input layer, which modules share with the camera.
import {Element} from 'w-gl';
import {getCapabilities, setBufferData, createFloatTexture} from './gl.js';
import {createNodeProgram, createEdgeProgram} from './programs.js';
import {TEXTURE_WIDTH, textureRows, packPositions, collectNodes, collectEdges} from './positions.js';
import {createProjector, ORIGIN, Z_NORMAL} from './math.js';
import {pickNode, nodesInRect, projectAll} from './pick.js';
import {createFlags, layoutFlags, SELECTED} from './flags.js';
import * as FLAGS from './flags.js';
import {createInput, ViewEvent} from './input.js';
import {createCamera} from './camera.js';
import {createVisibility} from './visible.js';
import {computeRooms} from './room.js';

const DEFAULTS = {
  // The text that stands for a node: in tooltips, search, announcements and labels
  nodeLabel: node => {
    let data = node.data;
    if (data && typeof data === 'object') {
      if (data.label !== undefined && data.label !== null) return String(data.label);
      if (data.name !== undefined && data.name !== null) return String(data.name);
    }
    return String(node.id);
  },
  nodeColor: 0x90f8fcff,
  linkColor: 0xffffff10,
  linkWidth: 2,
  // Size of a node's dot in scene units
  nodeSize: node => (node.data && node.data.size) || 1,
  // Smallest diameter of the smallest node in CSS pixels, at any zoom (0: nodes shrink with the
  // zoom). Bigger nodes keep their order: four times the size is at least twice as wide
  nodeMinSize: 0,
  // Where nodes crowd, no node is drawn wider than this share of the distance to its nearest
  // neighbour at least as big (see room.js), so small nodes give way to big ones. 0: off
  nodeRoom: 0,
  // How nodes and links mix with what is under them: 'normal' (alpha), or 'add' (light adds up,
  // so dense places glow; on a dark background). Highlights and layers always blend normally.
  blend: 'normal',
  // In 3D, what is farther from the camera fades to this share of its alpha (1: no fog)
  fog: 1
};

// How flagged nodes and links look. "Pointed" is hovered, dragged or focused.
const STYLES = {
  pointedColor: 0xffffffff,
  pointedScale: 1.5,
  // Smallest diameter in CSS pixels, so a highlight shows at any zoom
  pointedMinSize: 8,
  selectedColor: 0xffc24bff,
  selectedScale: 1.25,
  selectedMinSize: 6,
  // Links that touch a selected or pointed node get at least this alpha, and this color (alpha
  // 0: they keep their own)
  litLinkAlpha: 0.8,
  litLinkColor: 0,
  // While something is selected, nodes and links away from it fade to this alpha
  dimAlpha: 0.15
};

// Pixels from a node's disc within which a pointer still picks it. For touch, half the finger's
// reported contact width when that is larger, up to `touchMax`.
const REACH = {mouse: 8, pen: 10, touch: 16, touchMax: 32};
// The hovered node gets this many more pixels, so hover doesn't flicker between neighbours
const STICKY = 4;
// Selected nodes are drawn on top while there are at most this many, with this many links
const ON_TOP_LIMITS = {nodes: 1000, links: 100000};

/**
 * Options:
 * - `graph`: the ngraph.graph to draw.
 * - `layout`: the ngraph.forcelayout layout of that graph that gives the positions.
 * - `nodeColor`: 0xRRGGBBAA, or `node => color` (0 or nothing means the default color).
 * - `linkColor`: 0xRRGGBBAA, or `link => color`.
 * - `nodeSize`: a number, or `node => size` in scene units (default: `node.data.size` or 1).
 * - `linkWidth`: width of links in pixels.
 * - `nodeLabel`: `node => text` that stands for a node in tooltips, search and announcements
 *   (default: `data.label`, `data.name`, or the id).
 * - `styles`: how flagged nodes look (STYLES above).
 * - `camera`: camera input options (see camera.js), `input`: thresholds (see input.js), or
 *   `input: false` to leave the scene's own controls alone (no modules then).
 * - `reach`: picking reach in pixels per pointer type (REACH above).
 * - `occlusion`: what hides parts of the canvas, so the camera brings nodes out from under it
 *   (see visible.js). true (default): any element on top of the canvas (a settings panel) or
 *   outside the window, found by hit testing; false: only the canvas edges; or a function
 *   `(x, y) => boolean` that says whether a canvas point (CSS pixels) is hidden.
 *
 * Functions are called once per node or link when the view builds its buffers (the first frame,
 * graph changes, setLayout(), setNodeColor(), refresh()), never on every frame.
 */
export default function createView(scene, options = {}) {
  let gl = scene.getGL();
  let {instancing, maxTextureSize} = getCapabilities(gl);
  let graph = options.graph;
  if (!graph) throw new Error('createView() needs a graph');
  let canvas = scene.getDrawContext().canvas;

  let settings = {...DEFAULTS};
  ['nodeColor', 'linkColor', 'linkWidth', 'nodeSize', 'nodeLabel', 'nodeMinSize', 'nodeRoom', 'blend', 'fog'].forEach(name => {
    if (options[name] !== undefined) settings[name] = options[name];
  });
  let styles = {...STYLES, ...(options.styles || {})};
  let reach = {...REACH, ...(options.reach || {})};
  let style = {
    pointedColor: new Float32Array(4), pointedSize: new Float32Array(2),
    selectedColor: new Float32Array(4), selectedSize: new Float32Array(2),
    litAlpha: 1, litColor: new Float32Array(4), dimAlpha: 1, minSize: 0, fog: new Float32Array([0, 1, 1])
  };

  let nodeProgram = createNodeProgram(gl, instancing);
  let edgeProgram = createEdgeProgram(gl, instancing);
  // `hasDepth`: the layout has a third axis, so nodes are drawn with depth (see programs.js)
  let positions = {texture: null, width: TEXTURE_WIDTH, rows: 0, data: null, hasDepth: false};
  // `rooms` is set while `roomBuffer` holds a room for every node
  let nodes = {count: 0, rows: gl.createBuffer(), sizes: gl.createBuffer(), colors: gl.createBuffer(), rooms: null, rowCount: 0};
  let roomBuffer = gl.createBuffer();
  // Rooms of the nodes (room.js), when they were measured, what that took, and a timer for the
  // measure after the drawing stopped moving
  let rooms = {data: new Float32Array(0), reach: new Float32Array(0), cache: {}, at: -Infinity, ms: 0, timer: 0, stale: true};
  // The box of the drawn positions (for the fog), updated with them
  let bounds = {cx: 0, cy: 0, cz: 0, radius: 0};
  let edges = {count: 0, ends: gl.createBuffer(), colors: gl.createBuffer(), width: settings.linkWidth};
  // Nodes and links drawn again on top (see flags.js)
  let top = {
    nodes: {count: 0, rows: gl.createBuffer(), sizes: gl.createBuffer(), colors: gl.createBuffer()},
    edges: {count: 0, ends: gl.createBuffer(), colors: gl.createBuffer(), width: settings.linkWidth}
  };
  // What the last build read: the node of each row, sizes and colors
  let nodeData = {nodes: [], sizes: new Float32Array(0), colors: new Uint32Array(0), maxSize: 0};

  // What the next frame has to bring up to date
  let structureDirty = true, nodesDirty = true, edgesDirty = true, positionsDirty = true;
  let flagsDirty = true, textureDirty = false, cameraMoved = false;
  // The graph changed and the layout may still hold rows of removed bodies
  let editsPending = false;
  let layout = null;

  let flags = createFlags(() => {
    flagsDirty = true;
    scene.renderFrame();
  });
  // Flag of each row as drawn, and the rows that have one
  let rowBits = new Uint8Array(0);
  let flaggedRows = [];

  let events = createEmitter();
  let projector = createProjector();
  let frameHooks = new Set();
  let cameraHooks = new Set();
  // APIs modules share with each other (ctx.provide / ctx.get)
  let services = new Map();
  // What modules draw after the nodes (labels), and whether one wants the next frame too
  let layers = [];
  let animating = false;
  let revealFrame = 0;
  let modules = [];
  let savedCursor = canvas.style ? canvas.style.cursor : '';

  let element = new Element();
  element.type = 'GraphView';
  element.draw = draw;
  element.dispose = disposeGL;
  scene.appendChild(element);

  let visibility = options.occlusion === false ? null :
    createVisibility(canvas, typeof options.occlusion === 'function' ? options.occlusion : null);

  let camera = null, input = null;
  if (options.input !== false) {
    camera = createCamera(scene, options.camera);
    input = createInput(canvas, {
      // A press of a mouse or pen picks the node it highlighted, if it is still within reach
      // A press is decided the same way for every pointer: no bonus for the hovered node, which
      // would make a mouse grab where a finger pans (in a crowd, see drag.js)
      pick: (x, y, p) => pick(x, y, {pointerType: p.pointerType, width: p.width}),
      emit: (name, e) => events.emit(name, e),
      hasListeners: name => events.has(name),
      scenePoint,
      onPress: () => camera.stop(),
      settings: options.input
    });
    input.add(camera.handler);
  }

  scene.on('transform', onTransform);
  graph.on('changed', onGraphChanged);
  setLayout(options.layout);

  let api = {
    setLayout,
    setNodeColor,
    setLinkColor,
    setNodeMinSize,
    setStyles,
    invalidate,
    refresh,
    use,
    /** The API of the attached module with this name (the last one attached), or null */
    getModule(name) {
      for (let i = modules.length - 1; i >= 0; --i) {
        if (modules[i].module.name === name && modules[i].result) return modules[i].result;
      }
      return null;
    },
    on: (name, fn) => { events.on(name, fn); return api; },
    off: (name, fn) => { events.off(name, fn); return api; },
    pick,
    flags,
    labelOf,
    reveal,
    visibleArea,
    toScreen,
    getLayout: () => layout,
    getCamera: () => camera && camera.controls,
    dispose,
    getElement: () => element
  };
  return api;

  /** Draw positions of another layout of the same graph (e.g. after a reset) */
  function setLayout(newLayout) {
    if (!newLayout) throw new Error('createView() needs a layout');
    if (layout) unsubscribe(layout);
    layout = newLayout;
    layout.on('step', invalidate);
    // Rows of bodies move when bodies come and go
    layout.simulator.on('topology', onTopology);
    // Body order of the new layout may differ from the old one
    structureDirty = true;
    scene.renderFrame();
  }

  function setNodeColor(color) {
    settings.nodeColor = color;
    nodesDirty = true;
    scene.renderFrame();
  }

  function setLinkColor(color) {
    settings.linkColor = color;
    edgesDirty = true;
    scene.renderFrame();
  }

  /** Smallest diameter of a node in CSS pixels (0: none) */
  function setNodeMinSize(pixels) {
    settings.nodeMinSize = pixels || 0;
    scene.renderFrame();
  }

  /** New styles for flagged nodes and links (any of STYLES) */
  function setStyles(newStyles) {
    Object.assign(styles, newStyles);
    scene.renderFrame();
  }

  /** Positions changed outside of a layout step (setNodePosition(), a GPU sync, ...) */
  function invalidate() {
    positionsDirty = true;
    scene.renderFrame();
  }

  /** Call the color and size functions again, e.g. when what they read has changed */
  function refresh() {
    nodesDirty = edgesDirty = positionsDirty = true;
    scene.renderFrame();
  }

  /**
   * Attaches a module: an object with `attach(ctx, options)` that returns its API (or nothing).
   * Returns that API with a `dispose()` that also removes everything the module registered
   * through `ctx`.
   */
  function use(module, moduleOptions) {
    if (!module || typeof module.attach !== 'function') throw new Error('view.use() needs a module with attach(ctx, options)');
    if (!input) throw new Error(`The ${module.name || ''} module needs input, but this view was created with input: false`);
    let record = {module, cleanups: [], cursor: null, disposed: false};
    modules.push(record);
    let result;
    try {
      result = module.attach(createContext(record), moduleOptions || {}) || {};
    } catch (e) {
      release(record);
      throw e;
    }
    let ownDispose = result.dispose;
    result.dispose = () => {
      if (record.disposed) return;
      if (ownDispose) ownDispose.call(result);
      release(record);
    };
    record.result = result;
    return result;
  }

  function release(record) {
    record.disposed = true;
    for (let i = record.cleanups.length - 1; i >= 0; --i) record.cleanups[i]();
    record.cleanups = [];
    let index = modules.indexOf(record);
    if (index >= 0) modules.splice(index, 1);
    updateCursor();
  }

  // What a module gets. Everything it registers here is removed when it is disposed.
  function createContext(record) {
    let cleanups = record.cleanups;
    return {
      view: api,
      scene,
      graph,
      get layout() { return layout; },
      flags,
      FLAGS,
      input: {
        add(handler) {
          let remove = input.add(handler);
          cleanups.push(remove);
          return remove;
        },
        cancel: pointerId => input.cancel(pointerId),
        dragging: () => input.dragging(),
        busy: () => input.busy(),
        claimant: p => input.claimant(p),
        hoverPoint: () => input.hoverPoint(),
        /**
         * A tap on `node` that came from somewhere else than a pointer (Enter on a focused node):
         * the app and every module see it as a tap. `fields` adds modifier keys and the like.
         */
        tap(node, fields) {
          let row = rowOf(node.id);
          let at = row >= 0 ? toScreenOf(node) : null;
          return input.tap({node, row, inside: true, clear: true}, Object.assign({
            x: at ? at.x : 0, y: at ? at.y : 0, pointerType: 'keyboard', button: 0
          }, fields));
        },
        settings: input.settings
      },
      labelOf,
      reveal,
      visibleArea,
      /** Every node's place on the canvas this frame: {nodes, x, y, onScreen} (see screenPositions) */
      screenPositions,
      /** Makes `api` available to other modules as `ctx.get(name)` while this module is attached */
      provide(name, value) {
        services.set(name, value);
        cleanups.push(() => { if (services.get(name) === value) services.delete(name); });
      },
      get: name => services.get(name) || null,
      pick,
      nodesInRect: (x0, y0, x1, y1) => {
        let state = pickState();
        if (!state) return [];
        return nodesInRect(state, x0, y0, x1, y1).map(row => nodeData.nodes[row]).filter(Boolean);
      },
      toScreen,
      fromScreen,
      /** An event for the app's listeners (returned, so the module can check defaultPrevented) */
      emit(name, fields) {
        let e = new ViewEvent(name, null, fields);
        events.emit(name, e);
        return e;
      },
      on(name, fn) {
        events.on(name, fn);
        cleanups.push(() => events.off(name, fn));
      },
      /**
       * `fn(change)` runs inside every frame, before flags and positions go to the GPU, so what
       * it flags shows in this frame. `change`: {positions, camera, structure} tells what moved.
       */
      onFrame(fn) {
        frameHooks.add(fn);
        cleanups.push(() => frameHooks.delete(fn));
      },
      /** `fn()` runs after every camera move */
      onCamera(fn) {
        cameraHooks.add(fn);
        cleanups.push(() => cameraHooks.delete(fn));
      },
      /** WebGL of the scene, for layers: the context and ANGLE_instanced_arrays */
      gl,
      instancing,
      /**
       * Draws `layer.draw(frame)` after the nodes, in `layer.order` (default 0). `frame` has gl,
       * instancing, positions (the texture, see positions.js), mvp, drawContext, style and time.
       * `layer.dispose()` runs when the module goes.
       */
      addLayer(layer) {
        if (layer.order === undefined) layer.order = 0;
        layers.push(layer);
        layers.sort((a, b) => a.order - b.order);
        cleanups.push(() => {
          let index = layers.indexOf(layer);
          if (index >= 0) layers.splice(index, 1);
          if (layer.dispose) layer.dispose();
          scene.renderFrame();
        });
      },
      /** Asks for another frame after this one (an animation, such as a fade, is running) */
      animate() {
        animating = true;
        scene.renderFrame();
      },
      /** The cursor this module wants (null: none). The highest `priority` wins. */
      setCursor(value, priority = 1) {
        record.cursor = value ? {value, priority} : null;
        updateCursor();
      },
      requestFrame: () => scene.renderFrame()
    };
  }

  function updateCursor() {
    if (!canvas.style) return;
    let best = null;
    modules.forEach(record => {
      if (record.cursor && (!best || record.cursor.priority >= best.priority)) best = record.cursor;
    });
    canvas.style.cursor = best ? best.value : savedCursor;
  }

  /**
   * The node under a canvas point (CSS pixels from its top left corner), or null. `options`:
   * `pointerType` ('mouse', 'pen', 'touch') and `width` (contact width) set the reach; `reach`
   * sets it in pixels; `sticky` (a node) gets a few more pixels.
   *
   * Returns {node, row, distance, inside, covers, clear, gap, x, y, radius}: `distance` from the
   * disc's edge in pixels, the disc on the canvas. `clear`: the point is on this disc and no
   * other, or the next nearest node is at least half the reach farther (`gap` pixels). Where nodes
   * crowd or overlap, a pick is not clear. The same for every pointer: hovering (`sticky`) helps a
   * node win, but doesn't make it clear.
   */
  function pick(x, y, pickOptions = {}) {
    let state = pickState();
    if (!state || !state.count) return null;
    let distance = pickOptions.reach !== undefined ? pickOptions.reach : reachFor(pickOptions.pointerType, pickOptions.width);
    let margin = distance / 2;
    let stickyRow = pickOptions.sticky ? rowOf(pickOptions.sticky.id) : -1;
    let hit = pickNode(state, x, y, distance, stickyRow, stickyRow >= 0 ? STICKY : 0, margin);
    if (!hit) return null;
    hit.node = nodeData.nodes[hit.row];
    hit.clear = (hit.inside && hit.covers === 1) || hit.gap >= margin;
    return hit.node ? hit : null;
  }

  function reachFor(pointerType, width) {
    if (pointerType === 'touch') return Math.max(reach.touch, Math.min(reach.touchMax, (width || 0) / 2));
    if (pointerType === 'pen') return reach.pen;
    return reach.mouse;
  }

  function pickState() {
    if (!layout) return null;
    build();
    let store = layout.simulator.store;
    updateProjector();
    return {
      pos: store.pos, D: store.D, count: Math.min(store.n, nodes.count),
      sizes: nodeData.sizes, maxSize: nodeData.maxSize, projector
    };
  }

  function updateProjector() {
    let drawContext = scene.getDrawContext();
    let rect = canvas.getBoundingClientRect();
    projector.set(drawContext.projection, drawContext.view.matrix, element.worldModel, rect.width, rect.height);
  }

  function rowOf(id) {
    let body = layout && layout.getBody(id);
    return body && body.index < nodes.count ? body.index : -1;
  }

  /**
   * Pans the camera so `node` is in view: inside the canvas and out from under what covers it (a
   * panel over the canvas, see the `occlusion` option), `margin` (a share of the smaller side,
   * 0.15) away from both. It glides there (about 200 ms) unless the user prefers reduced motion
   * or `animate` is false. Returns false when the node was in view already.
   *
   * The camera pans the plane z = 0; a node at another depth moves by a different amount, so
   * every step measures again where the node is and how far it still has to go.
   */
  function reveal(node, revealOptions = {}) {
    let controls = camera && camera.controls;
    if (!controls || !node) return false;
    let margin = revealOptions.margin !== undefined ? revealOptions.margin : 0.15;
    let area = coversNear(node, margin) ? visibility.area() : null;
    let first = remaining(node, margin, area);
    if (!first || (!first.x && !first.y)) return false;
    if (revealFrame) cancelAnimationFrame(revealFrame);
    revealFrame = 0;
    let reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || revealOptions.animate === false) {
      for (let i = 0, left = first; i < 6 && left && (Math.abs(left.x) > 0.5 || Math.abs(left.y) > 0.5); ++i) {
        controls.panByAbsoluteOffset(left.x, left.y);
        controls.redraw();
        left = remaining(node, margin, area);
      }
      return true;
    }
    let frames = 0;
    let step = () => {
      let left = remaining(node, margin, area);
      frames += 1;
      if (!left || (Math.abs(left.x) <= 0.5 && Math.abs(left.y) <= 0.5) || frames > 40) {
        if (left && (left.x || left.y)) {
          controls.panByAbsoluteOffset(left.x, left.y);
          controls.redraw();
        }
        revealFrame = 0;
        return;
      }
      // A third of the way each frame: about 200 ms to arrive at 60 fps
      controls.panByAbsoluteOffset(left.x / 3, left.y / 3);
      controls.redraw();
      revealFrame = requestAnimationFrame(step);
    };
    revealFrame = requestAnimationFrame(step);
    return true;
  }

  // How far (pixels) the camera still has to move `node` to have it `margin` inside the canvas,
  // and, with the visible `area`, as far from what covers it
  function remaining(node, margin, area) {
    let at = toScreenOf(node);
    if (!at) return null;
    let rect = canvas.getBoundingClientRect();
    let inset = Math.min(rect.width, rect.height) * margin;
    let spot = area && area.anyHidden ? area.nearest(at.x, at.y, inset) : null;
    if (!spot) spot = {x: clamp(at.x, inset, rect.width - inset), y: clamp(at.y, inset, rect.height - inset)};
    return {x: spot.x - at.x, y: spot.y - at.y};
  }

  // Whether something covers the canvas near where `node` would go without covers: a quick look
  // (25 points) before measuring the whole visible area
  function coversNear(node, margin) {
    if (!visibility) return false;
    let at = toScreenOf(node);
    if (!at) return false;
    let rect = canvas.getBoundingClientRect();
    let inset = Math.min(rect.width, rect.height) * margin;
    let x = clamp(at.x, inset, rect.width - inset), y = clamp(at.y, inset, rect.height - inset);
    let around = Math.max(inset, 8);
    return visibility.coveredIn(Math.max(0, x - around), Math.max(0, y - around),
      Math.min(rect.width, x + around), Math.min(rect.height, y + around), around / 2);
  }

  /**
   * The part of the canvas the user can see (see visible.js): {isHidden(x, y), nearest(x, y,
   * margin), center(), anyHidden, ...}, measured by hit testing (about 3 ms) or a moment ago.
   * Null with `occlusion: false`.
   */
  function visibleArea() {
    return visibility ? visibility.area() : null;
  }

  function labelOf(node) {
    let label = settings.nodeLabel(node);
    return label === undefined || label === null || label === '' ? String(node.id) : String(label);
  }

  /** Where a node is on the canvas now: {x, y} in CSS pixels, or null */
  function toScreenOf(node) {
    let pos = layout && layout.getBody(node.id) ? layout.getNodePosition(node.id) : null;
    return pos ? toScreen(pos.x, pos.y || 0, pos.z || 0) : null;
  }

  /**
   * Where every node is on the canvas: {nodes, x, y, radius, onScreen, width, height, sizes}. `x`,
   * `y` (CSS pixels) and `radius` (of the disc, pixels) are per row; `onScreen[row]` is 1 when the
   * node is in front of the camera and inside the canvas; `sizes` are the nodes' diameters in
   * scene units. One pass over the nodes (about 0.6 ms at 100k).
   */
  function screenPositions() {
    let state = pickState();
    if (!state) return {nodes: [], x: new Float32Array(0), y: new Float32Array(0), onScreen: new Uint8Array(0), width: 0, height: 0};
    let projected = projectAll(state);
    projected.nodes = nodeData.nodes;
    projected.sizes = nodeData.sizes;
    return projected;
  }

  /** Where a point of the scene is on the canvas: {x, y} in CSS pixels, or null behind the camera */
  function toScreen(x, y, z = 0) {
    updateProjector();
    let out = {x: 0, y: 0, w: 0};
    return projector.toScreen(x, y, z, out) ? out : null;
  }

  /**
   * The point of the scene under a canvas point: on the plane z = 0, or, with `through` ([x, y, z]),
   * on the plane through that point that faces the camera. Null when the ray misses the plane.
   */
  function fromScreen(x, y, through) {
    updateProjector();
    let out = [0, 0, 0];
    if (!through) return projector.onPlane(x, y, ORIGIN, Z_NORMAL, out) ? out : null;
    let normal = [0, 0, 0];
    if (!projector.forward(normal)) return null;
    return projector.onPlane(x, y, through, normal, out) ? out : null;
  }

  function scenePoint(x, y) {
    let point = fromScreen(x, y);
    return point ? {x: point[0], y: point[1], z: point[2]} : null;
  }

  function onTransform() {
    cameraMoved = true;
    cameraHooks.forEach(fn => fn());
  }

  function onGraphChanged(changes) {
    // The layout updates its bodies on the same event; rebuild at the next frame, after it did
    editsPending = true;
    if (changes) {
      changes.forEach(change => {
        if (change.changeType === 'remove' && change.node) flags.drop(change.node.id);
      });
    }
    onTopology();
  }

  function onTopology() {
    structureDirty = true;
    scene.renderFrame();
  }

  function unsubscribe(oldLayout) {
    oldLayout.off('step', invalidate);
    oldLayout.simulator.off('topology', onTopology);
  }

  function draw(_gl, drawContext) {
    prepare();
    updateStyle(drawContext);
    // w-gl clears only colors between frames. Nodes test depth (in 3D a nearer node covers a
    // farther one), so depth from the last frame's positions must not hide this frame's nodes.
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    let mvp = element.modelViewProjection;
    let add = settings.blend === 'add';
    if (add) gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    edgeProgram.draw(edges, positions, mvp, drawContext, style, 0);
    // Nodes cover the links under them, also in additive light (no spokes inside a disc)
    if (add) gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    nodeProgram.draw(nodes, positions, mvp, drawContext, style, 0);
    top.edges.width = edges.width;
    edgeProgram.draw(top.edges, positions, mvp, drawContext, style, 1);
    nodeProgram.draw(top.nodes, positions, mvp, drawContext, style, 1);
    if (layers.length) {
      let frame = {gl, instancing, positions, mvp, drawContext, style, time: performance.now()};
      layers.forEach(layer => layer.draw(frame));
    }
    // A frame hook (or an app listener it called) changed something after it was read, or a
    // layer animates: the scene ignores renderFrame() inside a frame, so ask again once it's over
    if (structureDirty || nodesDirty || edgesDirty || positionsDirty || flagsDirty || animating) {
      animating = false;
      Promise.resolve().then(() => scene.renderFrame());
    }
  }

  function prepare() {
    let structureChanged = structureDirty;
    build();
    if (edgesDirty) buildEdges();
    if (frameHooks.size) {
      let change = {positions: positionsDirty, camera: cameraMoved, structure: structureChanged};
      frameHooks.forEach(fn => fn(change));
    }
    let moved = cameraMoved;
    cameraMoved = false;
    if (flagsDirty) writeFlags();
    if (positionsDirty) {
      packPositions(layout.simulator.store.pos, layout.simulator.store.D, Math.min(layout.simulator.store.n, nodes.count), positions.data);
      positions.hasDepth = layout.simulator.store.D >= 3;
      if (positions.hasDepth && settings.fog < 1) updateBounds();
      textureDirty = true;
      positionsDirty = false;
      rooms.stale = true;
    }
    // Rooms depend on the zoom too: the smallest size is in pixels
    if (moved) rooms.stale = true;
    if (settings.nodeRoom > 0 && rooms.stale) measureRooms();
    if (textureDirty) uploadTexture();
  }

  // Brings rows and node buffers up to date (also before picking, between frames)
  function build() {
    if (structureDirty) {
      if (editsPending) {
        // Drop the rows of removed bodies now rather than at the next step, so rows are dense.
        // It may fire 'topology', which only marks what is rebuilt here.
        editsPending = false;
        layout.simulator.applyEdits();
      }
      nodesDirty = edgesDirty = positionsDirty = flagsDirty = true;
      structureDirty = false;
    }
    if (nodesDirty) buildNodes();
  }

  function buildNodes() {
    let size = settings.nodeSize;
    let sizeOf = typeof size === 'function' ? size : () => size;
    let color = settings.nodeColor;
    let colorOf = typeof color === 'function' ? color : null;
    let defaultColor = colorOf ? DEFAULTS.nodeColor : color;
    let built = collectNodes(graph, layout, colorOf, sizeOf, defaultColor);
    let count = built.sizes.length;

    if (count > nodes.rowCount) {
      // Row numbers 0..n-1: node i of the drawing is body i of the layout
      let rows = new Float32Array(count);
      for (let i = 0; i < count; ++i) rows[i] = i;
      setBufferData(gl, nodes.rows, rows);
      nodes.rowCount = count;
    }
    setBufferData(gl, nodes.sizes, built.sizes);
    setBufferData(gl, nodes.colors, built.colors);
    nodes.count = count;
    nodes.rooms = null;
    let smallest = Infinity;
    for (let i = 0; i < count; ++i) if (built.sizes[i] > 0 && built.sizes[i] < smallest) smallest = built.sizes[i];
    built.minSize = Number.isFinite(smallest) ? smallest : 1;
    rooms.stale = true;
    nodeData = built;
    ensureTexture(count);
    nodesDirty = false;
    // Nodes drawn on top copy their sizes and colors
    flagsDirty = true;
  }

  // Measures every node's room (room.js) at most every 400 ms, or less often when it takes long,
  // and once more after the drawing stops moving
  function measureRooms() {
    let now = performance.now();
    let wait = Math.max(400, 20 * rooms.ms) - (now - rooms.at);
    if (wait > 0 && nodes.rooms) {
      if (!rooms.timer) rooms.timer = setTimeout(() => { rooms.timer = 0; scene.renderFrame(); }, wait);
      return;
    }
    rooms.stale = false;
    rooms.at = now;
    let n = Math.min(nodes.count, nodeData.sizes.length);
    if (!n) return;
    if (rooms.data.length < n) {
      rooms.data = new Float32Array(n);
      rooms.reach = new Float32Array(n);
    }
    // A node is drawn at least nodeMinSize pixels wide: in scene units at the middle of the drawing
    updateBounds();
    updateProjector();
    let at = {x: 0, y: 0, w: 1};
    let ppu = projector.toScreen(bounds.cx, bounds.cy, bounds.cz, at) ? projector.pixelsPerUnit(at.w) : 0;
    let smallest = ppu > 0 ? (settings.nodeMinSize || 0) / ppu : 0;
    let share = settings.nodeRoom, sizes = nodeData.sizes, radius = rooms.reach;
    let base = nodeData.minSize || 1;
    for (let i = 0; i < n; ++i) radius[i] = Math.max(sizes[i], smallest * Math.sqrt(Math.max(sizes[i] / base, 1))) / share;
    computeRooms(positions.data, n, sizes, radius, positions.hasDepth, rooms.data, rooms.cache);
    for (let i = 0; i < n; ++i) rooms.data[i] *= share;
    setBufferData(gl, roomBuffer, rooms.data.subarray(0, n));
    nodes.rooms = roomBuffer;
    rooms.ms = performance.now() - now;
  }

  // The box around the drawn positions: its middle and half its diagonal
  function updateBounds() {
    let data = positions.data, n = Math.min(nodes.count, layout ? layout.simulator.store.n : 0);
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    for (let i = 0, o = 0; i < n; ++i, o += 4) {
      let x = data[o], y = data[o + 1], z = data[o + 2];
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (z < minZ) minZ = z;
      if (z > maxZ) maxZ = z;
    }
    if (!(maxX >= minX)) return;
    bounds.cx = (minX + maxX) / 2;
    bounds.cy = (minY + maxY) / 2;
    bounds.cz = (minZ + maxZ) / 2;
    bounds.radius = 0.5 * Math.hypot(maxX - minX, maxY - minY, maxZ - minZ);
  }

  // Fog runs from the nearest to the farthest point of the drawing's box, as the camera sees it
  function updateFog() {
    let fog = style.fog;
    if (!positions.hasDepth || !(settings.fog < 1) || !(bounds.radius > 0)) {
      fog[0] = 0;
      fog[1] = 1;
      fog[2] = 1;
      return;
    }
    updateProjector();
    let at = {x: 0, y: 0, w: 1};
    if (!projector.toScreen(bounds.cx, bounds.cy, bounds.cz, at)) return;
    fog[0] = at.w - bounds.radius;
    fog[1] = at.w + bounds.radius;
    fog[2] = settings.fog;
  }

  function buildEdges() {
    let colorOf = linkColorOf();
    let built = collectEdges(graph, layout, colorOf, DEFAULTS.linkColor);
    setBufferData(gl, edges.ends, built.ends);
    setBufferData(gl, edges.colors, built.colors);
    edges.count = built.count;
    edges.width = settings.linkWidth;
    edgesDirty = false;
    flagsDirty = true;
  }

  function linkColorOf() {
    let color = settings.linkColor;
    return typeof color === 'function' ? color : () => color;
  }

  function ensureTexture(count) {
    let rows = textureRows(count);
    if (rows > maxTextureSize) throw new Error(`The view draws at most ${TEXTURE_WIDTH * maxTextureSize} nodes here`);
    if (rowBits.length < count) {
      rowBits = new Uint8Array(Math.max(count, 2 * rowBits.length));
      flaggedRows = [];
    }
    if (positions.texture && rows <= positions.rows) return;
    if (positions.texture) gl.deleteTexture(positions.texture);
    positions.texture = createFloatTexture(gl, TEXTURE_WIDTH, rows);
    positions.rows = rows;
    positions.data = new Float32Array(TEXTURE_WIDTH * rows * 4);
    // The new texture has no flags yet
    rowBits.fill(0);
    flaggedRows = [];
    flagsDirty = positionsDirty = true;
  }

  // Writes each row's flags into the fourth float of its texel, and the lists drawn on top
  function writeFlags() {
    let data = positions.data;
    for (let i = 0; i < flaggedRows.length; ++i) data[flaggedRows[i] * 4 + 3] = 0;
    let laid = layoutFlags(flags, graph, rowOf, rowBits, flaggedRows, ON_TOP_LIMITS);
    for (let i = 0; i < laid.rows.length; ++i) data[laid.rows[i] * 4 + 3] = rowBits[laid.rows[i]];
    flaggedRows = laid.rows;

    let topRows = laid.topNodes;
    let rows = new Float32Array(topRows.length);
    let sizes = new Float32Array(topRows.length);
    let colors = new Uint32Array(topRows.length);
    for (let i = 0; i < topRows.length; ++i) {
      rows[i] = topRows[i];
      sizes[i] = nodeData.sizes[topRows[i]];
      colors[i] = nodeData.colors[topRows[i]];
    }
    setBufferData(gl, top.nodes.rows, rows);
    setBufferData(gl, top.nodes.sizes, sizes);
    setBufferData(gl, top.nodes.colors, colors);
    top.nodes.count = topRows.length;

    let colorOf = linkColorOf();
    let ends = new Float32Array(laid.topLinks.length * 2);
    let linkColors = new Uint32Array(laid.topLinks.length);
    let k = 0;
    laid.topLinks.forEach(link => {
      let from = rowOf(link.fromId), to = rowOf(link.toId);
      if (from < 0 || to < 0) return;
      ends[2 * k] = from;
      ends[2 * k + 1] = to;
      linkColors[k] = colorOf(link) || DEFAULTS.linkColor;
      k += 1;
    });
    setBufferData(gl, top.edges.ends, ends.subarray(0, 2 * k));
    setBufferData(gl, top.edges.colors, linkColors.subarray(0, k));
    top.edges.count = k;

    flagsDirty = false;
    textureDirty = true;
  }

  function uploadTexture() {
    let rows = textureRows(nodes.count);
    gl.bindTexture(gl.TEXTURE_2D, positions.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TEXTURE_WIDTH, rows, gl.RGBA, gl.FLOAT,
      positions.data.subarray(0, TEXTURE_WIDTH * rows * 4));
    textureDirty = false;
  }

  function updateStyle(drawContext) {
    let ratio = drawContext.pixelRatio || 1;
    toRGBA(styles.pointedColor, style.pointedColor);
    toRGBA(styles.selectedColor, style.selectedColor);
    style.pointedSize[0] = styles.pointedScale;
    style.pointedSize[1] = styles.pointedMinSize * ratio;
    style.selectedSize[0] = styles.selectedScale;
    style.selectedSize[1] = styles.selectedMinSize * ratio;
    style.minSize = (settings.nodeMinSize || 0) * ratio;
    style.baseSize = nodeData.minSize || 1;
    style.litAlpha = styles.litLinkAlpha;
    toRGBA(styles.litLinkColor || 0, style.litColor);
    updateFog();
    style.dimAlpha = flags.count(SELECTED) ? styles.dimAlpha : 1;
  }

  function disposeGL() {
    nodeProgram.dispose();
    edgeProgram.dispose();
    clearTimeout(rooms.timer);
    [nodes.rows, nodes.sizes, nodes.colors, roomBuffer, edges.ends, edges.colors,
      top.nodes.rows, top.nodes.sizes, top.nodes.colors, top.edges.ends, top.edges.colors
    ].forEach(buffer => gl.deleteBuffer(buffer));
    if (positions.texture) gl.deleteTexture(positions.texture);
    positions.texture = null;
  }

  function dispose() {
    if (revealFrame) cancelAnimationFrame(revealFrame);
    modules.slice().reverse().forEach(record => record.result ? record.result.dispose() : release(record));
    if (input) input.dispose();
    if (camera) camera.dispose();
    if (visibility) visibility.dispose();
    if (canvas.style) canvas.style.cursor = savedCursor;
    scene.off('transform', onTransform);
    graph.off('changed', onGraphChanged);
    if (layout) unsubscribe(layout);
    scene.removeChild(element);
    disposeGL();
  }
}

function clamp(value, min, max) {
  return value < min ? min : value > max ? max : value;
}

function toRGBA(color, out) {
  out[0] = ((color >>> 24) & 255) / 255;
  out[1] = ((color >>> 16) & 255) / 255;
  out[2] = ((color >>> 8) & 255) / 255;
  out[3] = (color & 255) / 255;
}

// Listeners of the view's events, called in the order they were added
function createEmitter() {
  let listeners = new Map();
  return {
    on(name, fn) {
      if (typeof fn !== 'function') throw new Error(`view.on('${name}') needs a function`);
      if (!listeners.has(name)) listeners.set(name, []);
      listeners.get(name).push(fn);
    },
    off(name, fn) {
      let list = listeners.get(name);
      if (!list) return;
      let index = list.indexOf(fn);
      if (index >= 0) list.splice(index, 1);
    },
    has(name) {
      let list = listeners.get(name);
      return !!(list && list.length);
    },
    emit(name, e) {
      let list = listeners.get(name);
      if (list) list.slice().forEach(fn => fn(e));
      return e;
    }
  };
}

export {packPositions, collectNodes, collectEdges, textureRows, TEXTURE_WIDTH} from './positions.js';
export {FLAGS};
export {HOVERED, SELECTED, DRAGGED, FOCUSED, NEIGHBOR, CUSTOM_1, CUSTOM_2} from './flags.js';
export {default as hoverNodes} from './modules/hover.js';
export {default as dragNodes} from './modules/drag.js';
export {default as selectNodes} from './modules/select.js';
export {default as inspectNodes, describeNode} from './modules/inspect.js';
export {default as navigateNodes, nearestInDirection, neighboursOf} from './modules/navigate.js';
export {default as searchNodes, buildSearchIndex, findNodes} from './modules/search.js';
export {default as labelNodes} from './modules/labels.js';
export {default as fitLayout, layoutBounds} from './modules/fit.js';
export {largestOpenRect} from './visible.js';
export {placeLabels} from './labels/place.js';
export {computeImportance, rankRows} from './labels/importance.js';
