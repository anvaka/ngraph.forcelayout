// createView(): draws a graph that an ngraph.forcelayout layout moves, on a w-gl scene.
//
//   const scene = createScene(canvas);
//   const view = createView(scene, { graph, layout });
//   layout.step();          // the view redraws on the layout's 'step' event
//   view.setLayout(next);   // a new layout of the same graph
//   view.dispose();
//
// Positions go to the GPU as a texture, filled in one pass over the layout's `store.pos`; nodes
// and edges read them there, so a frame costs one loop over the nodes and one upload, and nothing
// at all when no position changed. Frames are drawn only when something changed: a step of the
// layout, a camera move (w-gl's controls ask for those), or a call below.
import {Element} from 'w-gl';
import {getCapabilities, setBufferData, createFloatTexture} from './gl.js';
import {createNodeProgram, createEdgeProgram} from './programs.js';
import {TEXTURE_WIDTH, textureRows, packPositions, collectNodes, collectEdges} from './positions.js';

const DEFAULTS = {
  nodeColor: 0x90f8fcff,
  linkColor: 0xffffff10,
  linkWidth: 2,
  // Size of a node's dot in scene units
  nodeSize: node => (node.data && node.data.size) || 1
};

/**
 * Options:
 * - `graph`: the ngraph.graph to draw.
 * - `layout`: the ngraph.forcelayout layout of that graph that gives the positions.
 * - `nodeColor`: 0xRRGGBBAA, or `node => color` (0 or nothing means the default color).
 * - `linkColor`: 0xRRGGBBAA, or `link => color`.
 * - `nodeSize`: a number, or `node => size` in scene units (default: `node.data.size` or 1).
 * - `linkWidth`: width of links in pixels.
 *
 * Functions are called once per node or link when the view builds its buffers (the first frame,
 * graph changes, setLayout(), setNodeColor(), refresh()), never on every frame.
 */
export default function createView(scene, options = {}) {
  let gl = scene.getGL();
  let {instancing, maxTextureSize} = getCapabilities(gl);
  let graph = options.graph;
  if (!graph) throw new Error('createView() needs a graph');

  let settings = {...DEFAULTS};
  ['nodeColor', 'linkColor', 'linkWidth', 'nodeSize'].forEach(name => {
    if (options[name] !== undefined) settings[name] = options[name];
  });

  let nodeProgram = createNodeProgram(gl, instancing);
  let edgeProgram = createEdgeProgram(gl, instancing);
  // `hasDepth`: the layout has a third axis, so nodes are drawn with depth (see programs.js)
  let positions = {texture: null, width: TEXTURE_WIDTH, rows: 0, data: null, hasDepth: false};
  let nodes = {count: 0, rows: gl.createBuffer(), sizes: gl.createBuffer(), colors: gl.createBuffer(), rowCount: 0};
  let edges = {count: 0, ends: gl.createBuffer(), colors: gl.createBuffer(), width: settings.linkWidth};

  // What the next frame has to bring up to date
  let structureDirty = true, nodesDirty = true, edgesDirty = true, positionsDirty = true;
  // The graph changed and the layout may still hold rows of removed bodies
  let editsPending = false;
  let layout = null;

  let element = new Element();
  element.type = 'GraphView';
  element.draw = draw;
  element.dispose = disposeGL;
  scene.appendChild(element);

  graph.on('changed', onGraphChanged);
  setLayout(options.layout);

  return {
    setLayout,
    setNodeColor,
    setLinkColor,
    invalidate,
    refresh,
    dispose,
    getElement: () => element
  };

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

  function onGraphChanged() {
    // The layout updates its bodies on the same event; rebuild at the next frame, after it did
    editsPending = true;
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
    // w-gl clears only colors between frames. Nodes test depth (in 3D a nearer node covers a
    // farther one), so depth from the last frame's positions must not hide this frame's nodes.
    gl.depthMask(true);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    edgeProgram.draw(edges, positions, element.modelViewProjection, drawContext);
    nodeProgram.draw(nodes, positions, element.modelViewProjection);
  }

  function prepare() {
    if (structureDirty) {
      if (editsPending) {
        // Drop the rows of removed bodies now rather than at the next step, so rows are dense.
        // It may fire 'topology', which only marks what is rebuilt here.
        editsPending = false;
        layout.simulator.applyEdits();
      }
      nodesDirty = edgesDirty = positionsDirty = true;
      structureDirty = false;
    }
    if (nodesDirty) buildNodes();
    if (edgesDirty) buildEdges();
    if (positionsDirty) uploadPositions();
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
    ensureTexture(count);
    nodesDirty = false;
  }

  function buildEdges() {
    let color = settings.linkColor;
    let colorOf = typeof color === 'function' ? color : null;
    let built = collectEdges(graph, layout, colorOf, colorOf ? DEFAULTS.linkColor : color);
    setBufferData(gl, edges.ends, built.ends);
    setBufferData(gl, edges.colors, built.colors);
    edges.count = built.count;
    edges.width = settings.linkWidth;
    edgesDirty = false;
  }

  function ensureTexture(count) {
    let rows = textureRows(count);
    if (rows > maxTextureSize) throw new Error(`The view draws at most ${TEXTURE_WIDTH * maxTextureSize} nodes here`);
    if (positions.texture && rows <= positions.rows) return;
    if (positions.texture) gl.deleteTexture(positions.texture);
    positions.texture = createFloatTexture(gl, TEXTURE_WIDTH, rows);
    positions.rows = rows;
    positions.data = new Float32Array(TEXTURE_WIDTH * rows * 4);
  }

  function uploadPositions() {
    let store = layout.simulator.store;
    let count = Math.min(store.n, nodes.count);
    packPositions(store.pos, store.D, count, positions.data);
    positions.hasDepth = store.D >= 3;
    let rows = textureRows(count);
    gl.bindTexture(gl.TEXTURE_2D, positions.texture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, TEXTURE_WIDTH, rows, gl.RGBA, gl.FLOAT,
      positions.data.subarray(0, TEXTURE_WIDTH * rows * 4));
    positionsDirty = false;
  }

  function disposeGL() {
    nodeProgram.dispose();
    edgeProgram.dispose();
    [nodes.rows, nodes.sizes, nodes.colors, edges.ends, edges.colors].forEach(buffer => gl.deleteBuffer(buffer));
    if (positions.texture) gl.deleteTexture(positions.texture);
    positions.texture = null;
  }

  function dispose() {
    graph.off('changed', onGraphChanged);
    if (layout) unsubscribe(layout);
    scene.removeChild(element);
    disposeGL();
  }
}

export {packPositions, collectNodes, collectEdges, textureRows, TEXTURE_WIDTH} from './positions.js';
