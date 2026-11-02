import {createScene, createGuide} from 'w-gl';
import bus from './bus';
import createHighLayout from 'ngraph.hde'
import createForceLayout from './createForceLayout';
import findLargestComponent from './findLargestComponent';
// Add-ons from modules/ in this repository (see vite.config.js), not part of ngraph.forcelayout
import placeNodes from 'ngraph.forcelayout.pivot';
import {createWebGPUBackend, runOnGpu} from 'ngraph.forcelayout.gpu';
import createView, {hoverNodes, dragNodes, selectNodes, inspectNodes} from 'ngraph.forcelayout.view';
import createGraph from 'ngraph.graph';

const NODE_COLOR = 0x90f8fcff;
const layoutProps = ['timeStep', 'springLength', 'springCoefficient', 'dimensions', 'dragCoefficient', 'gravity', 'theta', 'maxVelocity', 'integrator', 'nbody'];

export default function createGraphScene(canvas, layoutSettings = {}, sceneSettings = {}) {
  // Since graph can be loaded dynamically, we have these uninitialized
  // and captured into closure. loadGraph will do the initialization
  let graph, layout;
  // `view` draws the graph (modules/view): it redraws when the layout steps or the camera moves
  let scene, view, guide;

  // With WebGPU picked, the GPU runs the layout's own simulator whenever its plan says it can
  // (`gpu`); otherwise the layout stays on the CPU and `gpuReasons` says why.
  let backend = 'cpu';
  let gpuBackend, gpu = null;
  let gpuReasons = '', gpuError = '';
  // Starting and stopping the GPU runs one change at a time; frames don't step meanwhile
  let changes = Promise.resolve(), changing = false;

  let fixedViewBox = false;
  let isRunning = false;
  // The frame loop runs only while the layout runs; a paused layout draws only when the view changes
  let rafHandle = 0;
  let stepsPerFrame = sceneSettings.stepsPerFrame || 1;
  let placement = sceneSettings.placement || 'default';
  let placementChoice = '';
  // An experimental idea from demo/src/prototypes, attached to every new layout
  let prototype = null, prototypeParams = {}, prototypeControl = null;
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
    setPrototype,
    setPrototypeParams,
    finishPrototype,
    restart,
    getStats,
  };

  function loadGraph(newGraph, desiredLayout) {
    if (scene) {
      view.dispose();
      view = null;
      scene.dispose();
      gpu = null; // disposing the layout stops it
      detachPrototype();
      layout.dispose();
      scene = null
      cancelAnimationFrame(rafHandle);
      rafHandle = 0;
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
    attachPrototype();
    changeLayout(null);
    stats.reset();

    fitView();
    view = createView(scene, {graph, layout, nodeColor: nodeColorOf()});
    // Hover, drag, select and inspect nodes (modules/view). Dragging works while the layout is paused too.
    view.use(hoverNodes);
    view.use(dragNodes);
    view.use(selectNodes);
    view.use(inspectNodes);
    window.view = view;

    runLayout(true);
  }

  function restart() {
    // Fresh layout keeps the settings, but forgets positions and velocities.
    gpu = null; // disposing the layout stops it
    detachPrototype();
    layout.dispose();
    layout = createForceLayout(graph, layoutSettings);
    applyPlacement();
    attachPrototype();
    showLayout();
    changeLayout(null);
    stats.reset();
    fitView();
  }

  // The view draws the current layout, in the colors of the attached idea
  function showLayout() {
    view.setLayout(layout);
    view.setNodeColor(nodeColorOf());
  }

  // A prototype may color nodes, e.g. by the groups it found. Its colors are read once per
  // attach (and after its final step), not on every frame.
  function nodeColorOf() {
    let nodeColor = prototypeControl && prototypeControl.nodeColor;
    if (!nodeColor) return NODE_COLOR;
    return node => nodeColor(node.id) || NODE_COLOR;
  }

  function setPrototype(newPrototype, params) {
    prototype = newPrototype || null;
    prototypeParams = {...params};
    if (graph) restart();
  }

  // New values for the same idea: it carries on from the current drawing instead of starting over
  function setPrototypeParams(params) {
    prototypeParams = {...params};
    if (!graph || !prototype) return;
    changeLayout(() => continueLayout(layoutSettings.dimensions));
  }

  // `steps` tells the idea how many steps the drawing has already run (0 for a fresh start)
  function attachPrototype(steps = 0) {
    if (!prototype) return;
    prototypeControl = prototype.attach({
      layout,
      graph,
      params: {...prototypeParams},
      settings: {...layoutSettings},
      steps
    }) || null;
  }

  function detachPrototype() {
    if (prototypeControl && prototypeControl.dispose) prototypeControl.dispose();
    prototypeControl = null;
  }

  // The final step works on the store: on WebGPU it gets every step done so far first, and the
  // next GPU step uploads what the idea changed
  async function finishPrototype() {
    if (!prototypeControl || !prototypeControl.finish) return;
    if (gpu) await gpu.sync();
    prototypeControl.finish();
    // The final step moved nodes in the store, and may have changed their colors
    view.setNodeColor(nodeColorOf());
    view.invalidate();
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
      gpuBackend = gpuBackend || await createWebGPUBackend();
      if (!gpuBackend) return backend;
    }
    if (newBackend !== backend) {
      backend = newBackend;
      gpuError = '';
      stats.reset();
      await changeLayout(null);
    }
    return backend;
  }

  // Runs `change` (which may replace the layout) with the GPU stopped, then starts the GPU again
  // when WebGPU is picked and the layout's plan runs there. Changes run one at a time.
  function changeLayout(change) {
    changes = changes.then(async () => {
      changing = true;
      try {
        if (gpu) {
          let running = gpu;
          gpu = null;
          await running.stop();
        }
        if (change) change();
        if (backend === 'webgpu' && layout) await startGpu();
      } catch (e) {
        console.error('Switching the layout failed:', e);
      } finally {
        changing = false;
        // Stopping the GPU brought its last positions into the store
        if (view) view.invalidate();
      }
    });
    return changes;
  }

  async function startGpu() {
    let target = layout;
    let plan = target.simulator.plan(gpuBackend);
    if (!plan.runs) {
      // Each kind of refusal once, without the stage names
      let whole = plan.reasons.filter(reason => !plan.stages.some(stage => reason.startsWith(stage.stage + ': ')));
      let reasons = whole.concat(plan.stages.filter(stage => !stage.runs).map(stage => stage.reason));
      gpuReasons = Array.from(new Set(reasons)).join('; ');
      return;
    }
    gpuReasons = '';
    try {
      let running = await runOnGpu(target, gpuBackend);
      if (target !== layout) {
        await running.stop();
        return;
      }
      gpu = running;
      gpu.on('error', e => {
        // Stepping stopped on the GPU: carry on with the CPU from the last positions
        gpuError = e.lost ? 'the WebGPU device was lost' : e.message;
        // a lost device never comes back: picking WebGPU again asks for a new one
        if (e.lost) gpuBackend = null;
        backend = 'cpu';
        changeLayout(null);
      });
    } catch (e) {
      gpuReasons = e.reasons ? e.reasons.join('; ') : e.message;
    }
  }

  function getStats() {
    return {
      // where the layout runs now (WebGPU may be picked and refuse it)
      backend: gpu ? 'webgpu' : 'cpu',
      nodes: graph ? graph.getNodesCount() : 0,
      links: graph ? graph.getLinksCount() : 0,
      steps: stats.steps,
      msPerStep: gpu ? gpu.stats().msPerStep : stats.msPerStep(),
      placement: placementChoice,
      canFinishPrototype: !!(prototypeControl && prototypeControl.finish),
      // why the layout runs on the CPU although WebGPU is picked
      gpuReasons: backend === 'webgpu' && !gpu && !changing ? gpuReasons : '',
      gpuError
    };
  }

  function fitView() {
    let rect = layout.getGraphRect();
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
    if (isRunning && !rafHandle) rafHandle = requestAnimationFrame(frame);
  }

  function updateLayoutSettings(newLayoutSettings) {
    let props = layoutProps;
    let previousDimensions = (layoutSettings && layoutSettings.dimensions) || 2;
    layoutSettings = props.reduce((settings, name) => (settings[name] = newLayoutSettings[name], settings), {});
    if (!layout) return;

    if (layoutSettings.dimensions !== previousDimensions) {
      changeLayout(() => continueLayout(previousDimensions));
    } else {
      // the GPU, if it runs the layout, reads them at its next step
      props.forEach(name => {
        layout.simulator[name](layoutSettings[name]);
      });
    }
  }

  // A new layout that starts where the nodes are now, with the idea attached again
  function continueLayout(previousDimensions) {
    let prevLayout = layout;
    detachPrototype();
    layout = createForceLayout(graph, layoutSettings)
    graph.forEachNode(node => {
      // a plain {x, y, ...} copy: positions are views into the layout's arrays
      let prevPos = prevLayout.getNodePosition(node.id).toJSON();
      let positions = Object.keys(prevPos).map(name => prevPos[name]);
      for (let i = previousDimensions; i < layoutSettings.dimensions; ++i) {
        // If new layout has more dimensions than the previous layout, fill those with random values:
        positions.push(Math.random());
      }
      positions.unshift(node.id);
      layout.setNodePosition.apply(layout, positions);
    });

    prevLayout.dispose();
    attachPrototype(stats.steps);
    showLayout();
  }

  function setFixedViewBox(isFixed) {
    fixedViewBox = isFixed;
  }

  function initScene() {
    // No multisampling: the view smooths its own lines, and multisampled blending made links the
    // most expensive part of a frame (see modules/view/programs.js)
    let scene = createScene(canvas, {wglContextOptions: {antialias: false}});
    scene.setClearColor(12/255, 41/255, 82/255, 1)
    return scene;
  }
  
  function frame() {
    rafHandle = 0;
    if (!isRunning) return;
    rafHandle = requestAnimationFrame(frame);
    if (changing) return;

    let start = performance.now();
    if (gpu) {
      gpu.step(stepsPerFrame);
    } else {
      // each step fires the layout's 'step' event, on which the view asks for a frame
      for (let i = 0; i < stepsPerFrame; ++i) layout.step();
    }
    stats.record(performance.now() - start, stepsPerFrame);
    if (fixedViewBox) {
      let rect = layout.getGraphRect();
      scene.setViewBox({
        left:  rect.min_x,
        top:   rect.min_y,
        right:  rect.max_x,
        bottom: rect.max_y,
      });
    }
  }

  function dispose() {
    cancelAnimationFrame(rafHandle);
    rafHandle = 0;

    if (gpu) gpu.stop();
    gpu = null;
    detachPrototype();
    if (view) view.dispose();
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