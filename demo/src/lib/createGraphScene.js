import {createScene} from 'w-gl';
import bus from './bus';
import createHighLayout from 'ngraph.hde'
import createForceLayout from './createForceLayout';
import findLargestComponent from './findLargestComponent';
// Add-ons from modules/ in this repository (see vite.config.js), not part of ngraph.forcelayout
import placeNodes from 'ngraph.forcelayout.pivot';
import {createWebGPUBackend, runOnGpu} from 'ngraph.forcelayout.gpu';
import createView, {hoverNodes, dragNodes, selectNodes, inspectNodes, navigateNodes, searchNodes, labelNodes, fitLayout} from 'ngraph.forcelayout.view';
import createGraph from 'ngraph.graph';
import {stepsForFrame} from './deviceDefaults';
import look, {hasNames} from './look.js';
import {viewOptions, labelOptions, attachDrawing} from './drawing.js';

const NODE_COLOR = 0x90f8fcff;
const layoutProps = ['timeStep', 'springLength', 'springCoefficient', 'dimensions', 'dragCoefficient', 'gravity', 'theta', 'maxVelocity', 'integrator', 'nbody'];

export default function createGraphScene(canvas, layoutSettings = {}, sceneSettings = {}) {
  // Since graph can be loaded dynamically, we have these uninitialized
  // and captured into closure. loadGraph will do the initialization
  let graph, layout;
  // `view` draws the graph (modules/view): it redraws when the layout steps or the camera moves
  let scene, view;
  // The drawing's rules on the view (drawing.js): link alpha and node sizes, the legend
  let drawing = null, colors = null;

  // With WebGPU picked, the GPU runs the layout's own simulator whenever its plan says it can
  // (`gpu`); otherwise the layout stays on the CPU and `gpuReasons` says why.
  let backend = 'cpu';
  let gpuBackend, gpu = null;
  let gpuReasons = '', gpuError = '';
  // Starting and stopping the GPU runs one change at a time; frames don't step meanwhile
  let changes = Promise.resolve(), changing = false;

  // The camera follows the whole drawing (fitLayout) until the user moves it; `onFollow`
  // listeners hear when that starts or stops, so the app can offer a Fit button
  let fitter = null;
  let followListeners = new Set();
  let isRunning = false;
  // The layout settled and the frame loop stopped by itself (not paused by the viewer): moving a
  // node, changing a setting or a new layout runs it again
  let autoStopped = false;
  // {step, reason} of the layout's last settling, while it stays settled
  let settled = null;
  // The frame loop runs only while the layout runs; a paused layout draws only when the view changes
  let rafHandle = 0;
  // 0 is "auto": as many steps as fit in frameBudget ms (see deviceDefaults.js)
  let stepsPerFrame = sceneSettings.stepsPerFrame ?? 1;
  let frameBudget = sceneSettings.frameBudget || 8;
  let lastFrameSteps = 0;
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
    fitView,
    onFollow: fn => followListeners.add(fn),
    // The view's search box and its keys-and-gestures card, for buttons a finger can reach
    openSearch: () => { let search = view && view.getModule('search'); if (search) search.open(''); },
    toggleHelp: () => { let navigate = view && view.getModule('navigate'); return navigate ? navigate.help() : false; },
    setStepsPerFrame,
    setPlacement,
    setBackend,
    setPrototype,
    setPrototypeParams,
    finishPrototype,
    restart,
    getStats,
    getLegend,
  };

  function loadGraph(newGraph, desiredLayout) {
    if (scene) {
      if (drawing) drawing.dispose();
      drawing = null;
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

    // No background grid: the drawing isn't a coordinate plot, and its axes ran through the graph
    // this is a standard force layout
    layout = createForceLayout(graph, layoutSettings);
    watchStability(layout);
    applyPlacement();
    attachPrototype();
    changeLayout(null);
    stats.reset();

    // Colors, sizes and labels from the data, by the same rules for every graph (look.js)
    let drawn = viewOptions(graph, layout, {springLength: layoutSettings.springLength});
    colors = drawn.colors;
    view = createView(scene, Object.assign(drawn.options, {nodeColor: nodeColorOf()}));
    // The camera keeps the whole drawing in view (modules/view fit), with room for labels when
    // the nodes have names (look.js decides, for the labels too)
    fitter = view.use(fitLayout, hasNames(graph) ? {} : {labelRoom: null});
    fitter.on(following => followListeners.forEach(fn => fn(following)));
    followListeners.forEach(fn => fn(true));
    // Hover, drag, select and inspect nodes (modules/view). Dragging works while the layout is paused too.
    // Keyboard: Enter focuses a node, arrows move between nodes, / searches, ? lists the keys.
    view.use(hoverNodes);
    view.use(dragNodes);
    view.use(selectNodes);
    view.use(inspectNodes, look.inspect);
    view.use(navigateNodes);
    view.use(searchNodes);
    view.use(labelNodes, labelOptions(graph));
    drawing = attachDrawing(view, graph, colors);
    window.view = view;

    runLayout(true);
  }

  function restart() {
    // Fresh layout keeps the settings, but forgets positions and velocities.
    gpu = null; // disposing the layout stops it
    detachPrototype();
    layout.dispose();
    layout = createForceLayout(graph, layoutSettings);
    watchStability(layout);
    applyPlacement();
    attachPrototype();
    showLayout();
    resumeIfSettled();
    changeLayout(null);
    stats.reset();
    fitView();
  }

  // Back to the whole drawing, following it again
  function fitView() {
    if (fitter) fitter.fit();
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
    let own = colors ? colors.nodeColor : NODE_COLOR;
    if (!nodeColor) return own;
    return node => nodeColor(node.id) || (typeof own === 'function' ? own(node) : own);
  }

  // What the colors mean: {title, items: [{color, label, count}], more} or null (look.js)
  function getLegend() {
    return drawing ? drawing.legend : null;
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
    stepsPerFrame = Math.max(0, Math.round(newStepsPerFrame) || 0);
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
      running: isRunning,
      // {step, reason}: when the layout settled ('still': the drawing stopped changing; 'noise':
      // only jitter is left), while it stays settled
      settled,
      msPerStep: gpu ? gpu.stats().msPerStep : stats.msPerStep(),
      // wall clock: steps and frames per second over the last second, while it runs
      rate: isRunning ? stats.rate() : null,
      // steps the last frame ran (with steps per frame on auto, what the budget allowed)
      stepsPerFrame: lastFrameSteps,
      placement: placementChoice,
      canFinishPrototype: !!(prototypeControl && prototypeControl.finish),
      // why the layout runs on the CPU although WebGPU is picked
      gpuReasons: backend === 'webgpu' && !gpu && !changing ? gpuReasons : '',
      gpuError
    };
  }

  // Run or pause, as the viewer asked. Run on a settled layout keeps it going (until the viewer
  // pauses, or it wakes and settles again)
  function runLayout(newIsRunning) {
    autoStopped = false;
    if (newIsRunning) settled = null;
    setRunning(newIsRunning);
  }

  function setRunning(newIsRunning) {
    isRunning = newIsRunning;
    if (!isRunning) stats.pause();
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
    watchStability(layout);
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
    resumeIfSettled();
  }

  // When the layout settles (lib: the drawing stopped changing, or only jitter is left), the frame
  // loop stops: no more steps, no more GPU work. When it wakes (a node is moved by hand, a setting
  // changes), the loop runs again until it settles again.
  function watchStability(target) {
    settled = null;
    target.on('stable', isStable => {
      if (target !== layout) return;
      if (isStable) {
        let state = target.getStability();
        // how long it took counts only the first time it settles after a start
        // how long it took counts only the first time it settles after a start (load, reset)
        settled = {step: stats.steps, reason: state.reason, seconds: stats.timed ? 0 : stats.runMs / 1000};
        stats.timed = true;
        if (isRunning) {
          autoStopped = true;
          setRunning(false);
        }
      } else {
        settled = null;
        resumeIfSettled();
      }
    });
  }

  function resumeIfSettled() {
    if (!autoStopped) return;
    autoStopped = false;
    setRunning(true);
  }

  function initScene() {
    // No multisampling: the view smooths its own lines, and multisampled blending made links the
    // most expensive part of a frame (see modules/view/programs.js)
    let scene = createScene(canvas, {wglContextOptions: {antialias: false}});
    let [r, g, b] = look.background;
    scene.setClearColor(r / 255, g / 255, b / 255, 1)
    // Until the fit module takes over: the scene size small graphs always had
    scene.setViewBox({left: -100.8, top: -100.8, right: 100.8, bottom: 100.8});
    return scene;
  }
  
  function frame() {
    rafHandle = 0;
    if (!isRunning) return;
    rafHandle = requestAnimationFrame(frame);
    if (changing) return;

    let steps = stepsForFrame(stepsPerFrame, gpu ? gpu.stats().msPerStep : stats.msPerStep(), frameBudget);
    lastFrameSteps = steps;
    let start = performance.now();
    if (gpu) {
      gpu.step(steps);
    } else {
      // each step fires the layout's 'step' event, on which the view asks for a frame
      for (let i = 0; i < steps; ++i) layout.step();
    }
    stats.record(performance.now() - start, steps);
    // The loop stops by itself when the layout settles: see the 'stable' listener above
  }

  function dispose() {
    cancelAnimationFrame(rafHandle);
    rafHandle = 0;

    if (gpu) gpu.stop();
    gpu = null;
    detachPrototype();
    if (drawing) drawing.dispose();
    if (view) view.dispose();
    scene.dispose();
    bus.off('load-graph', loadGraph);
  }
}

// Average time per layout step over the last frames; steps and frames per second over the last
// second (wall clock, so they compare across CPU and GPU); and how long the layout has run.
function createStats() {
  let samples = [];
  let recent = [];  // [time, steps, time, steps, ...] of the last second's frames
  let lastAt = 0;
  let api = {
    steps: 0,
    // ms the layout has been running since it started (paused time doesn't count)
    runMs: 0,
    // the layout settled once since it started: later settles (after a wake) aren't timed
    timed: false,
    record(ms, steps) {
      api.steps += steps;
      samples.push(ms / steps);
      if (samples.length > 30) samples.shift();
      let now = performance.now();
      if (lastAt) api.runMs += Math.min(now - lastAt, 100);
      lastAt = now;
      recent.push(now, steps);
      while (recent.length > 2 && now - recent[0] > 1000) recent.splice(0, 2);
    },
    // The loop stopped: the next frame doesn't count the pause as running time
    pause() {
      lastAt = 0;
      recent = [];
    },
    reset() {
      api.steps = 0;
      api.runMs = 0;
      api.timed = false;
      samples = [];
      recent = [];
      lastAt = 0;
    },
    msPerStep() {
      if (samples.length === 0) return 0;
      return samples.reduce((a, b) => a + b, 0) / samples.length;
    },
    // {stepsPerSecond, fps} over the last second, or null before a quarter second of frames
    rate() {
      if (recent.length < 4) return null;
      let span = recent[recent.length - 2] - recent[0];
      if (span < 250) return null;
      let steps = 0;
      // the first frame's steps ran before the span started
      for (let i = 3; i < recent.length; i += 2) steps += recent[i];
      let frames = recent.length / 2 - 1;
      return {stepsPerSecond: steps * 1000 / span, fps: frames * 1000 / span};
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