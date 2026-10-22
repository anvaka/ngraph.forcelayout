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
import { watchDevice, submitCost } from './device.js';
import { GUARD } from './schedule.js';
import { createGridEngine } from './templates/grid.js';
import { createSmallEngine } from './templates/small.js';
import { lawValueCount, writeLawValues, lawValueProblem, lawValueWarnings } from './wgsl/print.js';
import { readLayout, writePositions, writeVelocities, writeMasses, readPositions, readVelocities } from './buffers.js';

const READBACK_BUFFERS = 3;
const STATS_WINDOW = 30;
// Steps per submit before a step has been timed (today's module always used 64)
const DEFAULT_BATCH = 64;
const MAX_BATCH = 1024;
// A submit holds at most this much GPU work, far below the 2-second watchdog
const MAX_SUBMIT_MS = 100;
// Settings the stock templates read from their uniforms
const SETTINGS = ['gravity', 'springLength', 'springCoefficient', 'dragCoefficient', 'timeStep', 'maxVelocity', 'integrator'];
// More pinned rows changed at once than this make a sync point (see uploadPinned())
const MAX_PINNED_WRITES = 4096;
// Columns the stock templates read: a 'step' listener that changes one changes the physics
const NODE_COLUMNS = ['pos', 'velocity', 'mass', 'pinned'];
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
  let engine = null, data = null;
  let law = null, lawValues = null, lawCount = 0;
  let firstStep = simulator.iteration(); // the simulator's step count when the GPU took over
  let queued = 0;          // steps submitted to the device
  let pending = 0;         // steps asked for while the runner was busy
  let busy = null;         // a build or a sync point in progress
  let halted = null, stopped = false, released = false;
  let hostOwns = false;    // after sync(): the store is the truth until the next step()
  let topologyChanged = false, settingsChanged = false;
  let structure = null;    // the stages the plan was made from, to notice changes cheaply
  let uploaded = {};       // column versions on the device
  let written = {};        // settings in the uniforms
  let fireState = null;    // FIRE's (alpha, steps downhill, ...) from the last sync
  let submitMs = 0;

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
    _debug: { get fence() { return engine ? [engine.pos] : []; } },
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
    law = plan.law;
    lawCount = law ? lawValueCount(law) : 0;
    lawValues = law ? new Float32Array(lawCount) : null;
    data = readLayout(simulator, plan.template === 'grid');
    data.pinned = Uint8Array.from(store.pinned.subarray(0, data.n), value => (value ? 1 : 0));
    const create = plan.template === 'small' ? createSmallEngine : createGridEngine;
    const next = data.n > 0 ? await create(device, {
      n: data.n, edges: data.edges, init: data.init, mass: data.mass, law, variants: plan.perStep,
    }) : null;
    if (released) { if (next) next.destroy(); return; }
    engine = next;
    written = {};
    writeSettings();
    if (engine) {
      device.queue.writeBuffer(engine.vel, 0, data.velocity);
      if (fireState) engine.setFire(fireState);
    }
    uploaded = versions();
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
    if (settingsChanged || settingsDiffer()) writeSettings();
    if (!engine) return true;
    const now = versions();
    if (now.from !== uploaded.from || now.to !== uploaded.to) {
      syncPoint();
      return false;
    }
    if (now.length !== uploaded.length || now.coefficient !== uploaded.coefficient) {
      // a change mark re-plans: links may now have their own lengths
      const verdict = backend.lower(simulator.program(), simulator);
      if (!verdict.runs) {
        halt({ message: refusal(reasonsOf(verdict)).message, kernel: null, stages: ['springs'] });
        return false;
      }
    }
    const n = data.n;
    if (hostOwns || now.pos !== uploaded.pos) {
      // the store is the truth: what sync() read and what the host wrote since, or what the host
      // marked with store.changed('pos')
      device.queue.writeBuffer(engine.pos, 0, writePositions(store, data, new Float32Array(2 * n)));
    }
    if (hostOwns || now.velocity !== uploaded.velocity) {
      device.queue.writeBuffer(engine.vel, 0, writeVelocities(store, data.toInternal, new Float32Array(4 * n)));
      data.pinned.set(store.pinned.subarray(0, n));
    } else if (now.pinned !== uploaded.pinned && !uploadPinned()) {
      return false;
    }
    if (now.mass !== uploaded.mass) device.queue.writeBuffer(engine.mass, 0, writeMasses(store, data, new Float32Array(n)));
    uploaded = now;
    hostOwns = false;
    return true;
  }

  // Pinned flags live next to the velocity on the device, which the store does not have between
  // syncs: changed rows are written one by one (pinning is usually a few bodies). Many changes
  // at once make a sync point instead.
  function uploadPinned() {
    const pinned = store.pinned, copy = data.pinned, flag = new Float32Array(1);
    let changed = 0;
    for (let i = 0; i < data.n; i++) if ((pinned[i] ? 1 : 0) !== copy[i]) changed++;
    if (changed > MAX_PINNED_WRITES) {
      syncPoint();
      return false;
    }
    for (let i = 0; i < data.n; i++) {
      const value = pinned[i] ? 1 : 0;
      if (value === copy[i]) continue;
      copy[i] = value;
      flag[0] = value;
      device.queue.writeBuffer(engine.vel, data.toInternal[i] * 16 + 12, flag);
    }
    return true;
  }

  // Encodes `count` steps in as few submits as the batching allows, and reads positions back
  function run(count) {
    if (!engine) { queued += count; return; }
    let lawSteps = null;
    if (law) {
      const perStep = lowering.plan.perStep ? stepValues(count) : null;
      if (perStep === false) return; // halted on a value
      if (perStep && perStep.count < count) {
        // the values went bad at a step: run the steps before it
        count = perStep.count;
        if (count === 0) return;
      }
      if (perStep && !perStep.same) lawSteps = (s, out, offset) => out.set(perStep.values.subarray(s * lawCount, (s + 1) * lawCount), offset);
      else if (!perStep && !updateStaticLaw()) return;
    }
    const rb = free.pop();
    const withTs = !!rb && timestamps;
    const n = data.n;
    engine.run(count, {
      timestampWrites: withTs ? { querySet } : null,
      perSubmit: stepsPerSubmit(),
      lawSteps,
      beforeFinish: rb ? enc => {
        enc.copyBufferToBuffer(engine.pos, 0, rb.buffer, 0, n * 8);
        if (withTs) {
          enc.resolveQuerySet(querySet, 0, 2, resolveBuffer, 0);
          enc.copyBufferToBuffer(resolveBuffer, 0, rb.buffer, n * 8, 16);
        }
      } : null,
    });
    queued += count;
    if (rb) readBack(rb, count, withTs);
  }

  // The law's numbers when they cannot change within a batch: once per call, written when they
  // changed. False when a number does not fit f32 (the runner halts).
  function updateStaticLaw() {
    law.update(simulator.stepContext(firstStep + queued));
    if (!checkValues(firstStep + queued)) return false;
    const fresh = new Float32Array(lawCount);
    writeLawValues(law, fresh, 0);
    if (!sameValues(fresh, lawValues)) {
      lawValues = fresh;
      engine.setLawValues();
    }
    return true;
  }

  // The law's numbers for each of the next `count` steps, evaluated with that step's context:
  // {values, count, same}. `same`: every step has the numbers in the uniforms, so the batch runs
  // as usual. `count` is smaller than asked when a number went bad at that step (the runner then
  // halts after the steps before it); false when that is the first step.
  function stepValues(count) {
    const values = new Float32Array(count * lawCount);
    let same = true;
    for (let s = 0; s < count; s++) {
      const at = firstStep + queued + s;
      law.update(simulator.stepContext(at));
      if (!checkValues(at)) {
        if (s === 0) return false;
        return { values, count: s, same: false };
      }
      writeLawValues(law, values, s * lawCount);
      if (same && !sameValues(values.subarray(s * lawCount, (s + 1) * lawCount), lawValues)) same = false;
    }
    if (same) return { values, count, same };
    // the uniforms get the last step's numbers, so a batch that follows with the same numbers
    // runs the usual pipelines
    lawValues = values.slice((count - 1) * lawCount, count * lawCount);
    engine.setLawValues();
    return { values, count, same };
  }

  // The law's numbers of step `at` must fit f32: a bad one halts the runner, naming the number
  // and the step; one that underflows warns once
  function checkValues(at) {
    const problem = lawValueProblem(law);
    if (problem) {
      halt({ message: `the law's ${problem.name} is ${problem.problem} at step ${at}`, kernel: null, stages: ['repulsion'] });
      return false;
    }
    lawValueWarnings(law).forEach(warnOnce);
    return true;
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
    rb.buffer.mapAsync(GPUMapMode.READ).then(() => {
      if (released) { rb.buffer.destroy(); return; }
      const n = data.n;
      if (rb.serial > appliedSerial && rb.data === data) {
        apply(rb.serial, rb.steps, new Float32Array(rb.buffer.getMappedRange(0, n * 8)));
      }
      if (withTs) {
        const t = new BigUint64Array(rb.buffer.getMappedRange(n * 8, 16));
        const ns = Number(t[1] - t[0]);
        if (t[1] > t[0] && ns < 60e9) addSample(ns / 1e6, count);
      } else {
        const now = performance.now();
        if (lastResolve && rb.steps > lastResolve.steps) addSample(now - lastResolve.time, rb.steps - lastResolve.steps);
        lastResolve = { time: now, steps: rb.steps };
      }
      rb.buffer.unmap();
      if (rb.data === data) free.push(rb); else rb.buffer.destroy();
      afterReadback();
    }).catch(() => { /* destroyed, or the device was lost */ });
  }

  // Positions after `steps` into the store
  function apply(serial, steps, positions) {
    appliedSerial = serial;
    const done = steps - appliedSteps;
    const move = readPositions(simulator, data, positions, Math.max(1, done));
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
    const before = physicsMarks();
    layout.lastMove = lastMove;
    try {
      layout.fire('step');
    } catch (e) {
      halt({ message: "a 'step' listener failed: " + e.message, kernel: null, stages: [] });
      return;
    }
    const after = physicsMarks();
    const changed = after.findIndex((mark, i) => mark !== before[i]);
    if (changed >= 0) {
      halt({
        message: `a 'step' listener changed ${markNames()[changed]}. On the GPU, 'step' fires once per readback, not after ` +
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

  // Positions, velocities and FIRE's state after every submitted step, into the store
  async function readDevice() {
    const n = data.n;
    const buffer = device.createBuffer({ size: n * 24 + 16, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
    const enc = device.createCommandEncoder();
    enc.copyBufferToBuffer(engine.pos, 0, buffer, 0, n * 8);
    enc.copyBufferToBuffer(engine.vel, 0, buffer, n * 8, n * 16);
    enc.copyBufferToBuffer(engine.fire, 0, buffer, n * 24, 16);
    device.queue.submit([enc.finish()]);
    const serial = ++readSerial, steps = queued, from = data;
    try {
      await buffer.mapAsync(GPUMapMode.READ);
    } catch (e) {
      buffer.destroy();
      return;
    }
    if (!released && from === data) {
      if (serial > appliedSerial) apply(serial, steps, new Float32Array(buffer.getMappedRange(0, n * 8)));
      readVelocities(simulator, data, new Float32Array(buffer.getMappedRange(n * 8, n * 16)));
      fireState = Array.from(new Float32Array(buffer.getMappedRange(n * 24, 16)));
    }
    buffer.unmap();
    buffer.destroy();
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
    const size = Math.max(16, data.n * 8 + (timestamps ? 16 : 0));
    for (let r = 0; r < READBACK_BUFFERS; r++) {
      const rb = { buffer: device.createBuffer({ size, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }), data };
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
    const kernels = lowering && lowering.plan ? Object.keys(lowering.plan.kernelStages) : [];
    const kernel = kernels.find(name => message.indexOf('"' + name + '"') >= 0) || null;
    return { message, kernel, stages: kernel ? stagesOf(kernel) : [] };
  }

  function stagesOf(kernel) {
    const stages = lowering && lowering.plan && lowering.plan.kernelStages[kernel];
    return stages ? stages.slice() : [];
  }

  function writeSettings() {
    settingsChanged = false;
    if (!settingsDiffer()) return;
    const settings = simulator.settings;
    const first = written.integrator === undefined, wasFire = written.integrator === 'fire';
    SETTINGS.forEach(key => { written[key] = settings[key]; });
    if (!engine) return;
    // as the CPU's integrator: a speed limit that is not positive is 1
    engine.setParams(Object.assign({}, settings, { maxVelocity: settings.maxVelocity > 0 ? settings.maxVelocity : 1 }));
    if (!first && !wasFire && settings.integrator === 'fire') engine.resetFire();
  }

  function settingsDiffer() {
    const settings = simulator.settings;
    for (let i = 0; i < SETTINGS.length; i++) if (written[SETTINGS[i]] !== settings[SETTINGS[i]]) return true;
    return false;
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
    const names = simulator.stages();
    if (names.length !== structure.names.length) return true;
    for (let i = 0; i < names.length; i++) {
      if (names[i] !== structure.names[i] || simulator.getStage(names[i]) !== structure.runs[i]) return true;
    }
    if (store.columnsVersion + springStore.columnsVersion !== structure.columns) return true;
    return settingsChanged && simulator.program().version !== structure.version;
  }

  function versions() {
    const v = store.versions, l = springStore.versions;
    return {
      pos: v.pos, velocity: v.velocity, mass: v.mass, pinned: v.pinned,
      from: l.from, to: l.to, length: l.length, coefficient: l.coefficient,
    };
  }

  // Marks of everything the GPU reads: column versions and settings
  function physicsMarks() {
    const marks = NODE_COLUMNS.map(name => store.versions[name]).concat(LINK_COLUMNS.map(name => springStore.versions[name]));
    const settings = simulator.settings;
    SETTINGS.forEach(key => marks.push(settings[key]));
    marks.push(simulator.repulsionLaw(), settings.inertia);
    return marks;
  }

  function markNames() {
    return NODE_COLUMNS.map(name => 'the column ' + name).concat(LINK_COLUMNS.map(name => 'the link column ' + name),
      SETTINGS.map(key => 'the setting ' + key), ['the repulsion law', 'the inertia']);
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
      nodes: data ? data.n : 0,
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

function sameValues(a, b) {
  if (!b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
  return true;
}

