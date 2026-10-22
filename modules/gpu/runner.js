// runOnGpu(): the GPU runs a layout's own simulator. The layout stays the CPU view of it:
// positions come back into its store after every batch, its 'step' event fires once per readback
// and its 'stable' event from the movement between readbacks. While wrapped, layout.step() throws.
//
//   const gpu = await runOnGpu(layout, backend);   // after plan(backend) says it runs
//   gpu.step(20);           // queues 20 steps and returns; the work is submitted
//   await gpu.sync();       // the store holds positions and velocities; the host owns it until
//                           // the next gpu.step(), which uploads what changed
//   await gpu.stop();       // syncs, hands the step count back to the simulator, unwraps
//
// What changes reaches the device through the store's column versions (store.changed(name), the
// setters of bodies and springs, graph edits), settings through the simulator's setters. A graph
// edit, or a change of the step's structure, is a sync point: the device's numbers come back,
// the data is rebuilt from the store and the pipelines are fetched again (cached by their text).
// Errors halt the runner and fire 'error'; nothing falls back to the CPU on its own.
//
// The runner drives an engine (the stock grid template, templates/stock.js, or a generic plan,
// generic/engine.js) through one interface: prepare(hostOwns) uploads, run(count, firstStep, …)
// encodes steps, copyPositions()/readPositions() read back, readDevice() syncs.
import { watchDevice, submitCost } from './device.js';
import { GUARD } from './program.js';
import { createStockEngine } from './templates/stock.js';
import { createGenericEngine } from './generic/engine.js';

const READBACK_BUFFERS = 3;
const STATS_WINDOW = 30;
// Steps per submit before a step has been timed (today's module always used 64)
const DEFAULT_BATCH = 64;
const MAX_BATCH = 1024;
// A submit holds at most this much GPU work, far below the 2-second watchdog
const MAX_SUBMIT_MS = 100;
// Settings that change the physics: a 'step' listener must not change them
const PHYSICS_SETTINGS = ['gravity', 'springLength', 'springCoefficient', 'dragCoefficient', 'timeStep', 'maxVelocity', 'integrator', 'theta'];
const LINK_COLUMNS = ['from', 'to', 'length', 'coefficient'];

/**
 * Runs `layout` (from ngraph.forcelayout) on the GPU of `backend` (see createWebGPUBackend()).
 * Resolves once the pipelines are compiled and the data is on the device. Rejects with the plan's
 * reasons (`error.reasons`) when the backend cannot run the layout's step.
 */
export async function runOnGpu(layout, backend) {
  if (!layout || !layout.simulator) throw new Error('runOnGpu() needs a layout made by ngraph.forcelayout');
  if (!backend || !backend.device) throw new Error('runOnGpu() needs a backend from createWebGPUBackend()');
  const simulator = layout.simulator;
  if (simulator.getStage(GUARD)) throw new Error('this layout already runs on the GPU');
  const plan = simulator.plan(backend);
  if (!plan.runs) throw refusal(plan.reasons);
  const runner = createRunner(layout, backend);
  await runner.start();
  return runner.api;
}

// Reasons of a lowering (check.js), as plan() words them
function reasonsOf(lowering) {
  return lowering.reasons.concat(Object.keys(lowering.stages)
    .filter(name => !lowering.stages[name].runs).map(name => name + ': ' + lowering.stages[name].reason));
}

function refusal(reasons) {
  const error = new Error('WebGPU cannot run this layout: ' + reasons.join('; '));
  error.reasons = reasons;
  return error;
}

function createRunner(layout, backend) {
  const simulator = layout.simulator;
  const store = simulator.store, springStore = simulator.springStore;
  const device = backend.device;
  const deviceState = watchDevice(device);
  const timestamps = device.features.has('timestamp-query');
  const listeners = { readback: [], error: [] };

  let lowering = null;     // check.js lower(): the plan the engine runs
  let engine = null;
  let firstStep = simulator.iteration(); // the simulator's step count when the GPU took over
  let queued = 0;          // steps submitted to the device
  let pending = 0;         // steps asked for while the runner was busy
  let busy = null;         // a build or a sync point in progress
  let halted = null, stopped = false, released = false;
  let hostOwns = false;    // after sync(): the store is the truth until the next step()
  let topologyChanged = false, settingsChanged = false;
  let structure = null;    // the stages the plan was made from, to notice changes cheaply
  let linkVersions = null; // link columns as built
  let fireState = null;    // FIRE's (alpha, steps downhill, ...) from the last sync
  let submitMs = 0;
  let marks = null;        // what a 'step' listener must not change

  // Readbacks: positions after a batch, and (with timestamp queries) its GPU time
  const free = [], all = [];
  let querySet = null, resolveBuffer = null;
  let readSerial = 0, appliedSerial = 0, appliedSteps = 0, lastReadSteps = 0;
  const samples = [];
  let lastResolve = null;
  let lastMove = 0, wasStable = false;

  const onSettings = () => { settingsChanged = true; };
  const onTopology = () => { topologyChanged = true; };
  const onDisposed = () => {
    stopped = true;
    release();
    simulator.iteration(firstStep + appliedSteps);
  };
  const onDeviceError = error => {
    if (released) return;
    if (error.lost) halt({ lost: true, message: error.message, kernel: null, stages: [] });
    else halt(attribute(error.message));
  };

  const api = {
    step,
    sync,
    stop,
    on(event, callback) {
      if (!listeners[event]) throw new Error(`gpu.on(): unknown event ${event}; use 'readback' or 'error'`);
      listeners[event].push(callback);
      return api;
    },
    off(event, callback) {
      if (listeners[event]) listeners[event] = listeners[event].filter(other => other !== callback);
      return api;
    },
    stats,
    get lastMove() { return lastMove; },
    get halted() { return halted; },
    // For the test harness: the buffers the last kernel of every step writes
    _debug: { get fence() { return engine ? engine.fence : []; } },
  };

  return { start, api };

  async function start() {
    // From here on, the store's positions are the GPU's: layout.step() would step a stale copy
    simulator.addStage(GUARD, guard, {
      before: simulator.stages()[0],
      describe: { shape: 'guard', how: 'stops layout.step() while the GPU runs the layout' },
    });
    simulator.on('settings', onSettings);
    simulator.on('topology', onTopology);
    layout.on('disposed', onDisposed);
    deviceState.listeners.add(onDeviceError);
    if (timestamps) {
      querySet = device.createQuerySet({ type: 'timestamp', count: 2 });
      resolveBuffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC });
    }
    try {
      submitMs = await submitCost(device);
      await build();
    } catch (e) {
      release();
      throw e;
    }
  }

  function guard() {
    throw new Error('this layout runs on the GPU; call gpu.step(), or await gpu.stop() first');
  }

  // Data, pipelines and uploads from the store, as the plan of the current program says
  async function build() {
    simulator.applyEdits();
    topologyChanged = false;
    const program = simulator.program();
    lowering = backend.lower(program, simulator);
    if (!lowering.runs) throw refusal(reasonsOf(lowering));
    const plan = lowering.plan;
    structure = stageSnapshot(program.version);
    linkVersions = LINK_COLUMNS.map(name => springStore.versions[name]);
    marks = markList(plan);
    const create = plan.template === 'grid' ? createStockEngine : createGenericEngine;
    const next = store.n > 0 ? await create(device, { simulator, plan, fireState, warn: warnOnce }) : null;
    if (released) { if (next) next.destroy(); return; }
    engine = next;
    hostOwns = false;
    settingsChanged = false;
    lastReadSteps = queued;
    makeReadbacks();
  }

  /**
   * Queues `count` steps (1 by default) and returns; their work is submitted unless the runner is
   * waiting for a sync point, which runs them once it is done.
   */
  function step(count = 1) {
    count = Math.floor(count);
    if (!(count > 0) || stopped || halted) return;
    if (busy) { pending += count; return; }
    if (!prepare()) { pending += count; return; }
    run(count);
  }

  // Everything that changed on the host since the last batch reaches the device. Returns false
  // when it started a sync point instead (the steps then wait for it), or halted.
  function prepare() {
    simulator.applyEdits();
    if (topologyChanged || structureChanged()) {
      syncPoint();
      return false;
    }
    settingsChanged = false;
    if (!engine) return true;
    if (springStore.versions.from !== linkVersions[0] || springStore.versions.to !== linkVersions[1]) {
      syncPoint();
      return false;
    }
    if (springStore.versions.length !== linkVersions[2] || springStore.versions.coefficient !== linkVersions[3]) {
      // a change mark re-plans: links may now have their own lengths
      const verdict = backend.lower(simulator.program(), simulator);
      if (!verdict.runs) {
        halt({ message: refusal(reasonsOf(verdict)).message, kernel: null, stages: ['springs'] });
        return false;
      }
      linkVersions = LINK_COLUMNS.map(name => springStore.versions[name]);
    }
    const prepared = engine.prepare(hostOwns);
    hostOwns = false;
    if (prepared === 'sync') { syncPoint(); return false; }
    if (prepared && prepared.halt) { halt({ message: prepared.halt, kernel: null, stages: [] }); return false; }
    return true;
  }

  // Encodes `count` steps in as few submits as the batching allows, and reads positions back
  function run(count) {
    if (!engine) { queued += count; return; }
    const rb = free.pop();
    const withTs = !!rb && timestamps;
    const bytes = engine.positionBytes;
    const result = engine.run(count, firstStep + queued, {
      timestampWrites: withTs ? { querySet } : null,
      perSubmit: stepsPerSubmit(),
      beforeFinish: rb ? enc => {
        rb.ordered = engine.copyPositions(enc, rb.buffer, 0, count);
        if (withTs) {
          enc.resolveQuerySet(querySet, 0, 2, resolveBuffer, 0);
          enc.copyBufferToBuffer(resolveBuffer, 0, rb.buffer, bytes, 16);
        }
      } : null,
    });
    queued += result.ran;
    if (result.ran && rb) readBack(rb, result.ran, withTs);
    else if (rb) free.push(rb);
    if (result.halt) halt({ message: result.halt.message, kernel: null, stages: result.halt.stages || [] });
  }

  // Steps per submit: as many as fit in MAX_SUBMIT_MS of GPU time, and enough that the submit's
  // own cost stays under 10% of the work
  function stepsPerSubmit() {
    const ms = gpuMsPerStep();
    if (!(ms > 0)) return DEFAULT_BATCH;
    const most = Math.floor(MAX_SUBMIT_MS / ms);
    const least = Math.ceil(submitMs / (0.1 * ms));
    return Math.max(1, Math.min(MAX_BATCH, Math.max(most, least)));
  }

  function readBack(rb, count, withTs) {
    rb.serial = ++readSerial;
    rb.steps = queued;
    rb.count = count;
    const from = engine;
    rb.buffer.mapAsync(GPUMapMode.READ).then(() => {
      if (released) { rb.buffer.destroy(); return; }
      const bytes = rb.engine.positionBytes;
      if (rb.serial > appliedSerial && from === engine) {
        apply(rb.serial, rb.steps, new Float32Array(rb.buffer.getMappedRange(0, bytes)), rb.ordered);
      }
      if (withTs) {
        const t = new BigUint64Array(rb.buffer.getMappedRange(bytes, 16));
        const ns = Number(t[1] - t[0]);
        if (t[1] > t[0] && ns < 60e9) addSample(ns / 1e6, count);
      } else {
        const now = performance.now();
        if (lastResolve && rb.steps > lastResolve.steps) addSample(now - lastResolve.time, rb.steps - lastResolve.steps);
        lastResolve = { time: now, steps: rb.steps };
      }
      rb.buffer.unmap();
      if (rb.engine === engine) free.push(rb); else rb.buffer.destroy();
      afterReadback();
    }).catch(() => { /* destroyed, or the device was lost */ });
  }

  // Positions after `steps` into the store
  function apply(serial, steps, positions, inStoreOrder) {
    appliedSerial = serial;
    const done = steps - appliedSteps;
    const move = engine.readPositions(positions, Math.max(1, done), inStoreOrder);
    if (done > 0) lastMove = move;
    appliedSteps = steps;
    simulator.iteration(firstStep + steps);
  }

  // The layout's 'step' fires once per readback, then 'stable' when that changed, then the
  // runner's 'readback'. A 'step' listener that changes what the GPU reads halts the runner: on
  // the CPU it would run after every step, here only once per batch.
  function afterReadback() {
    if (appliedSteps === lastReadSteps || halted || released) return;
    lastReadSteps = appliedSteps;
    const before = marks.map(mark => mark.read());
    layout.lastMove = lastMove;
    try {
      layout.fire('step');
    } catch (e) {
      halt({ message: "a 'step' listener failed: " + e.message, kernel: null, stages: [] });
      return;
    }
    const changed = marks.findIndex((mark, i) => mark.read() !== before[i]);
    if (changed >= 0) {
      halt({
        message: `a 'step' listener changed ${marks[changed].name}. On the GPU, 'step' fires once per readback, not after ` +
          'every step, so listeners must not change the physics: use a formula, a sum, a host step, or a \'settings\' listener',
        kernel: null, stages: [],
      });
      return;
    }
    const isStable = store.n === 0 || lastMove / store.n <= 0.01;
    if (isStable !== wasStable) {
      wasStable = isStable;
      layout.fire('stable', isStable);
    }
    emit('readback', { steps: firstStep + appliedSteps, lastMove });
  }

  /**
   * Resolves when every step asked for so far has run and the store holds the positions and
   * velocities they made. The host then owns the store: the next step() uploads it.
   */
  async function sync() {
    while (busy) await busy;
    if (released) return;
    if (pending && !halted) {
      const count = pending;
      pending = 0;
      step(count);
      while (busy) await busy;
    }
    if (released || !engine || (halted && halted.lost)) { hostOwns = true; return; }
    await readDevice();
    hostOwns = true;
    afterReadback();
  }

  // Positions, velocities, device columns, sums and FIRE's state after every submitted step,
  // into the store
  async function readDevice() {
    const serial = ++readSerial, steps = queued, from = engine;
    const state = await engine.readDevice();
    if (!state || released || from !== engine) return;
    if (serial > appliedSerial) apply(serial, steps, state.positions, true);
    state.apply();
    fireState = state.fireState;
  }

  // Graph edits and new structure: the device's numbers come back, then everything is built
  // again from the store
  function syncPoint() {
    busy = (async () => {
      if (engine && !(halted && halted.lost)) await readDevice();
      dropEngine();
      await build();
    })().then(() => {
      busy = null;
      if (pending && !halted && !stopped) {
        const count = pending;
        pending = 0;
        step(count);
      }
    }, error => {
      busy = null;
      halt({ message: error.message, kernel: error.kernel || null, stages: error.kernel ? stagesOf(error.kernel) : [] });
    });
  }

  /**
   * Syncs, gives the simulator the step count, and unwraps the layout: layout.step() works again.
   * Resolves to the step count.
   */
  async function stop() {
    if (stopped) return simulator.iteration();
    try {
      await sync();
    } catch (e) { /* the store keeps the last readback */ }
    stopped = true;
    release();
    simulator.iteration(firstStep + appliedSteps);
    return simulator.iteration();
  }

  function release() {
    if (released) return;
    released = true;
    pending = 0;
    simulator.removeStage(GUARD);
    simulator.off('settings', onSettings);
    simulator.off('topology', onTopology);
    layout.off('disposed', onDisposed);
    deviceState.listeners.delete(onDeviceError);
    dropEngine();
    if (querySet) querySet.destroy();
    if (resolveBuffer) resolveBuffer.destroy();
  }

  function dropEngine() {
    if (engine) engine.destroy();
    engine = null;
    for (const rb of all) {
      // a buffer still mapping is destroyed when its readback returns
      if (free.indexOf(rb) >= 0) rb.buffer.destroy();
    }
    all.length = 0;
    free.length = 0;
  }

  function makeReadbacks() {
    if (!engine) return;
    const size = Math.max(16, engine.positionBytes + (timestamps ? 16 : 0));
    for (let r = 0; r < READBACK_BUFFERS; r++) {
      const rb = { buffer: device.createBuffer({ size, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }), engine };
      all.push(rb);
      free.push(rb);
    }
  }

  function halt(error) {
    if (halted || released) return;
    halted = error;
    pending = 0;
    emit('error', error);
  }

  // Which kernel an error message names, and the stages it computes
  function attribute(message) {
    const kernels = engine ? Object.keys(engine.kernelStages) : [];
    const kernel = kernels.find(name => message.indexOf('"' + name + '"') >= 0) || null;
    return { message, kernel, stages: kernel ? stagesOf(kernel) : [] };
  }

  function stagesOf(kernel) {
    const stages = engine && engine.kernelStages[kernel];
    return stages ? stages.slice() : [];
  }

  // The step's structure, to notice a change cheaply on every call: the stages and their
  // functions (a stage added, removed or replaced), columns defined or removed, and, after a
  // 'settings' event, program().version (the law, the inertia, the integrator, charge columns,
  // the adaptive time step)
  function stageSnapshot(version) {
    const names = simulator.stages();
    return { names, runs: names.map(name => simulator.getStage(name)), columns: store.columnsVersion + springStore.columnsVersion, version };
  }

  function structureChanged() {
    if (simulator.programVersion) return simulator.programVersion() !== structure.version;
    const names = simulator.stages();
    if (names.length !== structure.names.length) return true;
    for (let i = 0; i < names.length; i++) {
      if (names[i] !== structure.names[i] || simulator.getStage(names[i]) !== structure.runs[i]) return true;
    }
    if (store.columnsVersion + springStore.columnsVersion !== structure.columns) return true;
    return settingsChanged && simulator.program().version !== structure.version;
  }

  // What a 'step' listener must not change: the columns the plan reads, the link columns, the
  // physics settings, the law and the inertia
  function markList(plan) {
    const columns = plan.reads || ['pos', 'velocity', 'mass', 'pinned'];
    const out = columns.map(name => ({ name: 'the column ' + name, read: () => store.versions[name] }));
    LINK_COLUMNS.forEach(name => out.push({ name: 'the link column ' + name, read: () => springStore.versions[name] }));
    PHYSICS_SETTINGS.forEach(key => out.push({ name: 'the setting ' + key, read: () => simulator.settings[key] }));
    out.push({ name: 'the repulsion law', read: () => simulator.repulsionLaw() });
    out.push({ name: 'the inertia', read: () => simulator.settings.inertia });
    return out;
  }

  function gpuMsPerStep() {
    let ms = 0, steps = 0;
    for (const s of samples) { ms += s.ms; steps += s.steps; }
    return steps ? ms / steps : 0;
  }

  function addSample(ms, steps) {
    samples.push({ ms, steps });
    if (samples.length > STATS_WINDOW) samples.shift();
  }

  /**
   * {msPerStep, source, steps, engine, nodes, stepsPerSubmit, halted}: msPerStep is GPU time per
   * step from timestamp queries when the device has them, else wall clock between readbacks.
   */
  function stats() {
    return {
      msPerStep: gpuMsPerStep(),
      source: timestamps ? 'gpu-timestamps' : 'wall-clock',
      steps: firstStep + queued,
      engine: engine ? engine.kind : 'none',
      nodes: engine ? engine.n : 0,
      stepsPerSubmit: stepsPerSubmit(),
      halted: halted ? halted.message : null,
    };
  }

  function emit(event, payload) {
    listeners[event].slice().forEach(callback => callback(payload));
  }
}

const warned = new Set();
function warnOnce(message) {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn('ngraph.forcelayout.gpu: ' + message);
}
