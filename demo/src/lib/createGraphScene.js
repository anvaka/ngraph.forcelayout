import {createScene, createGuide} from 'w-gl';
import LineCollection from './LineCollection';
import PointCollection from './PointCollection';
import bus from './bus';
import createHighLayout from 'ngraph.hde'
import createForceLayout from './createForceLayout';
import findLargestComponent from './findLargestComponent';
// Add-ons from modules/ in this repository (see vite.config.js), not part of ngraph.forcelayout
import placeNodes from 'ngraph.forcelayout.pivot';
import {initWebGPU, createGpuLayout} from 'ngraph.forcelayout.gpu';
import createGraph from 'ngraph.graph';

const layoutProps = ['timeStep', 'springLength', 'springCoefficient', 'dimensions', 'dragCoefficient', 'gravity', 'theta', 'maxVelocity', 'integrator', 'nbody'];

export default function createGraphScene(canvas, layoutSettings = {}, sceneSettings = {}) {
  let drawLinks = true;

  // Since graph can be loaded dynamically, we have these uninitialized
  // and captured into closure. loadGraph will do the initialization
  let graph, layout;
  let scene, nodes, lines, guide;

  // When WebGPU backend is on, gpuLayout runs the simulation, and `layout` only keeps
  // positions for the moment we switch back to CPU.
  let backend = 'cpu';
  let gpuDevice, gpuLayout;

  let fixedViewBox = false;
  let isRunning = false;
  let rafHandle;
  let stepsPerFrame = sceneSettings.stepsPerFrame || 1;
  let placement = sceneSettings.placement || 'default';
  let placementChoice = '';
  let stats = createStats();

  bus.on('load-graph', loadGraph);

  return {
    dispose,
    runLayout,
    updateLayoutSettings,
    setFixedViewBox,
    setStepsPerFrame,
    setPlacement,
    setBackend,
    restart,
    getStats,
  };

  function loadGraph(newGraph, desiredLayout) {
    if (scene) {
      scene.dispose();
      stopGpuLayout(false);
      layout.dispose();
      scene = null
      cancelAnimationFrame(rafHandle);
    }
    // newGraph = createGraph(); newGraph.addLink(1, 2)
    scene = initScene();

    graph = newGraph; //findLargestComponent(newGraph, 1)[0];

    // Let them play on console with it!
    window.graph = graph;

    guide = createGuide(scene, {showGrid: true, lineColor: 0xffffff10, maxAlpha: 0x10, showCursor: false});
    // this is a standard force layout
    layout = createForceLayout(graph, layoutSettings);
    applyPlacement();
    if (backend === 'webgpu') startGpuLayout();
    stats.reset();

    fitView();
    initUIElements();

    isRunning = true;
    rafHandle = requestAnimationFrame(frame);
  }

  function restart() {
    // Fresh layout keeps the settings, but forgets positions and velocities.
    stopGpuLayout(false);
    layout.dispose();
    layout = createForceLayout(graph, layoutSettings);
    applyPlacement();
    if (backend === 'webgpu') startGpuLayout();
    stats.reset();
    fitView();
  }

  function applyPlacement() {
    placementChoice = '';
    if (placement !== 'pivot') return;
    placementChoice = placeNodes(graph, layout, {
      dimensions: layoutSettings.dimensions || 2,
      unit: layoutSettings.springLength || 10
    });
  }

  function setPlacement(newPlacement) {
    if (placement === newPlacement) return;
    placement = newPlacement;
    if (graph) restart();
  }

  function setStepsPerFrame(newStepsPerFrame) {
    stepsPerFrame = Math.max(1, Math.round(newStepsPerFrame) || 1);
  }

  async function setBackend(newBackend) {
    if (newBackend === 'webgpu' && backend !== 'webgpu') {
      if ((layoutSettings.dimensions || 2) !== 2) return backend;
      gpuDevice = gpuDevice || await initWebGPU();
      if (!gpuDevice) return backend;
      backend = 'webgpu';
      if (graph) startGpuLayout();
    } else if (newBackend === 'cpu' && backend !== 'cpu') {
      backend = 'cpu';
      stopGpuLayout(true);
    }
    stats.reset();
    return backend;
  }

  function startGpuLayout() {
    gpuLayout = createGpuLayout(gpuDevice, graph, {
      settings: layoutSettings,
      getInitialPosition: nodeId => layout.getNodePosition(nodeId)
    });
  }

  function stopGpuLayout(keepPositions) {
    if (!gpuLayout) return;
    if (keepPositions) {
      graph.forEachNode(node => {
        let pos = gpuLayout.getNodePosition(node.id);
        layout.setNodePosition(node.id, pos.x, pos.y);
      });
    }
    gpuLayout.dispose();
    gpuLayout = null;
  }

  function getStats() {
    return {
      backend,
      nodes: graph ? graph.getNodesCount() : 0,
      links: graph ? graph.getLinksCount() : 0,
      steps: stats.steps,
      msPerStep: gpuLayout ? gpuLayout.getStats().msPerStep : stats.msPerStep(),
      placement: placementChoice
    };
  }

  function activeLayout() {
    return gpuLayout || layout;
  }

  function fitView() {
    let rect = activeLayout().getGraphRect();
    let cx = (rect.min_x + rect.max_x) / 2;
    let cy = (rect.min_y + rect.max_y) / 2;
    let half = Math.max(rect.max_x - rect.min_x, rect.max_y - rect.min_y) * 0.6;
    if (!Number.isFinite(half) || half < 100.8) {
      // Small graphs: keep the scene size we always had
      cx = cy = 0;
      half = 100.8;
    }
    scene.setViewBox({
      left:  cx - half,
      top:   cy - half,
      right:  cx + half,
      bottom: cy + half,
    });
  }

  function runLayout(newIsRunning) {
    isRunning = newIsRunning;
  }

  function updateLayoutSettings(newLayoutSettings) {
    let props = layoutProps;
    let previousDimensions = (layoutSettings && layoutSettings.dimensions) || 2;
    layoutSettings = props.reduce((settings, name) => (settings[name] = newLayoutSettings[name], settings), {});
    if (!layout) return;

    if (gpuLayout && layoutSettings.dimensions !== 2) {
      // WebGPU layout is 2D only
      backend = 'cpu';
      stopGpuLayout(true);
    }

    if (layoutSettings.dimensions !== previousDimensions) {
      let prevLayout = layout;
      layout = createForceLayout(graph, layoutSettings)
      graph.forEachNode(node => {
        let prevPos = prevLayout.getNodePosition(node.id);
        let positions = Object.keys(prevPos).map(name => prevPos[name]);
        for (let i = previousDimensions; i < layoutSettings.dimensions; ++i) {
          // If new layout has more dimensions than the previous layout, fill those with random values:
          positions.push(Math.random());
        }
        positions.unshift(node.id);
        layout.setNodePosition.apply(layout, positions);
      });

      prevLayout.dispose();
    } else {
      props.forEach(name => {
        layout.simulator[name](layoutSettings[name]);
      });
      if (gpuLayout) gpuLayout.updateSettings(layoutSettings);
    }
  }

  function setFixedViewBox(isFixed) {
    fixedViewBox = isFixed;
  }

  function initScene() {
    let scene = createScene(canvas);
    scene.setClearColor(12/255, 41/255, 82/255, 1)
    return scene;
  }
  
  function initUIElements() {
    nodes = new PointCollection(scene.getGL(), {
      capacity: graph.getNodesCount()
    });

    graph.forEachNode(node => {
      var point = activeLayout().getNodePosition(node.id);
      let size = 1;
      if (node.data && node.data.size) {
        size = node.data.size;
      } else {
        if (!node.data) node.data = {};
        node.data.size = size;
      }
      node.ui = {size, position: [point.x, point.y, point.z || 0], color: 0x90f8fcff};
      node.uiId = nodes.add(node.ui);
    });

    lines = new LineCollection(scene.getGL(), { capacity: graph.getLinksCount() });

    graph.forEachLink(link => {
      var from = activeLayout().getNodePosition(link.fromId);
      var to = activeLayout().getNodePosition(link.toId);
      var line = { from: [from.x, from.y, from.z || 0], to: [to.x, to.y, to.z || 0], color: 0xFFFFFF10 };
      link.ui = line;
      link.uiId = lines.add(link.ui);
    });
    // lines.add({from: [0, 0, 0], to: [0, 10, 0], color: 0xFF0000FF})

    scene.appendChild(lines);
    scene.appendChild(nodes);
  }

  function frame() {
    rafHandle = requestAnimationFrame(frame);

    if (gpuLayout && gpuLayout.getStats().lost) {
      // GPU device is gone (e.g. driver reset) - continue on CPU from the last known positions
      backend = 'cpu';
      stopGpuLayout(true);
    }

    if (isRunning) {
      let start = performance.now();
      if (gpuLayout) {
        gpuLayout.step(stepsPerFrame);
      } else {
        for (let i = 0; i < stepsPerFrame; ++i) layout.step();
      }
      stats.record(performance.now() - start, stepsPerFrame);
      if (fixedViewBox) {
        let rect = activeLayout().getGraphRect();
        scene.setViewBox({
          left:  rect.min_x,
          top:   rect.min_y,
          right:  rect.max_x,
          bottom: rect.max_y,
        });
      }
    }
    drawGraph();
    scene.renderFrame();
  }

  function drawGraph() {
    let names = ['x', 'y', 'z']
    let layout = activeLayout();
    // let minR = Infinity; let maxR = -minR;
    // let minG = Infinity; let maxG = -minG;
    // let minB = Infinity; let maxB = -minB;
    // graph.forEachNode(node => {
    //   let pos = layout.getNodePosition(node.id);
    //   if (pos.c4 < minR) minR = pos.c4;
    //   if (pos.c4 > maxR) maxR = pos.c4;

    //   if (pos.c5 < minG) minG = pos.c5;
    //   if (pos.c5 > maxG) maxG = pos.c5;

    //   if (pos.c6 < minB) minB = pos.c6;
    //   if (pos.c6 > maxB) maxB = pos.c6;
    // });

    graph.forEachNode(node => {
      let pos = layout.getNodePosition(node.id);
      let uiPosition = node.ui.position;
      for (let i = 0; i < 3; ++i) {
        uiPosition[i] = pos[names[i]] || 0;
      }
      // let r = Math.floor(255 * (pos.c4 - minR) / (maxR - minR)) << 24;
      // let g = Math.floor(255 * (pos.c5 - minG) / (maxG - minG)) << 16;
      // let b = Math.floor(255 * (pos.c6 - minB) / (maxB - minB)) << 8;
      // [r, g, b] = lab2rgb(
      //   (pos.c4 -  minR) / (maxR - minR),
      //   (pos.c5 - minG) / (maxG - minG),
      //   (pos.c6 - minB) / (maxB - minB)
      // );
      // node.ui.color = (0x000000FF | r | g | b);
      nodes.update(node.uiId, node.ui)
    });

    if (drawLinks) {
      graph.forEachLink(link => {
        var fromPos = layout.getNodePosition(link.fromId);
        var toPos = layout.getNodePosition(link.toId);
        let {from, to} = link.ui;

        for (let i = 0; i < 3; ++i) {
          from[i] = fromPos[names[i]] || 0;
          to[i] = toPos[names[i]] || 0;
        }
        // from[0] = fromPos.x || 0; from[1] = fromPos.y || 0; from[2] = fromPos.z || 0;
        // to[0] = toPos.x || 0; to[1] = toPos.y || 0; to[2] = toPos.z || 0;
        // link.ui.color = lerp(graph.getNode(link.fromId).ui.color, graph.getNode(link.toId).ui.color);
        lines.update(link.uiId, link.ui);
      })
    }
  }

  function lerp(aColor, bColor) {
    let ar = (aColor >> 24) & 0xFF;
    let ag = (aColor >> 16) & 0xFF;
    let ab = (aColor >> 8)  & 0xFF;
    let br = (bColor >> 24) & 0xFF;
    let bg = (bColor >> 16) & 0xFF;
    let bb = (bColor >> 8)  & 0xFF;
    let r = Math.floor((ar + br) / 2);
    let g = Math.floor((ag + bg) / 2);
    let b = Math.floor((ab + bb) / 2);
    return (r << 24) | (g << 16) | (b << 8) | 0xF0;
  }

  function dispose() {
    cancelAnimationFrame(rafHandle);

    stopGpuLayout(false);
    scene.dispose();
    bus.off('load-graph', loadGraph);
  }
}

// Average time per layout step over the last frames.
function createStats() {
  let samples = [];
  let api = {
    steps: 0,
    record(ms, steps) {
      api.steps += steps;
      samples.push(ms / steps);
      if (samples.length > 30) samples.shift();
    },
    reset() {
      api.steps = 0;
      samples = [];
    },
    msPerStep() {
      if (samples.length === 0) return 0;
      return samples.reduce((a, b) => a + b, 0) / samples.length;
    }
  };
  return api;
}

function standardizePositions(layout) {
  let arr = [];
  let avgX = 0, avgY = 0;
  layout.forEachBody(body => {
    arr.push(body.pos);
    avgX += body.pos.x;
    avgY += body.pos.y;
  });
  let meanX = avgX / arr.length;
  let meanY = avgY / arr.length;
  let varX = 0, varY = 0;
  arr.forEach(pos => {
    varX += Math.pow(pos.x - meanX, 2);
    varY += Math.pow(pos.y - meanY, 2);
  });
  varX = Math.sqrt(varX / arr.length);
  varY = Math.sqrt(varY / arr.length);
  arr.forEach(pos => {
    pos.x = 10 * (pos.x - meanX) / varX;
    pos.y = 10 * (pos.y - meanY) / varY;
  });
}