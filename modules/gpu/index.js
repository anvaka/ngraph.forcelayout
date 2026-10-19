// Experimental WebGPU force layout: a 2D force layout that runs entirely on the GPU and mirrors
// positions back to the CPU without ever blocking the frame. It follows ngraph.forcelayout's
// physics and settings, but it is a separate engine and does not use the library.
//
//   const device = await initWebGPU();          // null when WebGPU is unavailable
//   const layout = createGpuLayout(device, graph, { settings, getInitialPosition });
//   // every frame:
//   layout.step();                              // encodes a step and an async readback
//   layout.getNodePosition(id);                 // {x, y} from the latest completed readback
//
// The graph is captured when the layout is created; adding or removing nodes needs a new layout.
//
// Graphs up to 1024 nodes run on an exact single-workgroup kernel (smallEngine.js), larger ones on
// a grid pyramid (gridEngine.js). Positions are uploaded relative to an origin near the median of
// the initial positions, so f32 keeps its precision when the whole graph sits far from (0, 0).
import { createGridEngine } from './gridEngine.js';
import { createSmallEngine, smallEngineFits } from './smallEngine.js';

const DEFAULT_SETTINGS = {
  timeStep: 0.5,
  springLength: 10,
  springCoefficient: 0.8,
  dragCoefficient: 0.9,
  gravity: -12,
  maxVelocity: 4,
  integrator: 'euler',
};
const READBACK_BUFFERS = 3;
const STATS_WINDOW = 30;
// Graphs at least this large are renumbered along a Hilbert curve, so nodes that are close in
// space are close in memory.
const HILBERT_MIN_NODES = 4096;

let devicePromise = null;
const deviceState = new WeakMap(); // device -> { errors, lost }

/**
 * Returns a cached GPUDevice, or null when WebGPU is unavailable. Never throws.
 */
export async function initWebGPU() {
  if (!devicePromise) devicePromise = requestDevice();
  return devicePromise;
}

async function requestDevice() {
  try {
    if (typeof navigator === 'undefined' || !navigator.gpu) return null;
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return null;
    const requiredLimits = {};
    for (const name of ['maxStorageBuffersPerShaderStage', 'maxStorageBufferBindingSize', 'maxBufferSize',
      'maxComputeInvocationsPerWorkgroup', 'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupStorageSize']) {
      requiredLimits[name] = adapter.limits[name];
    }
    const requiredFeatures = adapter.features.has('timestamp-query') ? ['timestamp-query'] : [];
    const device = await adapter.requestDevice({ requiredFeatures, requiredLimits });
    watchDevice(device);
    device.lost.then(() => { devicePromise = null; });
    return device;
  } catch (e) {
    console.warn('WebGPU is not available:', e);
    return null;
  }
}

// Validation errors are only console warnings unless someone listens; count and log them.
function watchDevice(device) {
  let state = deviceState.get(device);
  if (state) return state;
  state = { errors: 0, lost: false };
  deviceState.set(device, state);
  device.addEventListener('uncapturederror', e => {
    state.errors += 1;
    console.error('WebGPU error:', e.error && e.error.message);
  });
  device.lost.then(info => {
    state.lost = true;
    if (info.reason !== 'destroyed') console.error('WebGPU device lost:', info.message);
  });
  return state;
}

/**
 * Creates a GPU layout for an ngraph.graph instance.
 *
 * options.settings: timeStep, springLength, springCoefficient, dragCoefficient, gravity,
 *   maxVelocity (4), integrator ('euler' | 'fire')
 * options.getInitialPosition(nodeId) -> {x, y}; nodes without one get a deterministic spot.
 */
export function createGpuLayout(device, graph, options = {}) {
  const deviceInfo = watchDevice(device);
  const errorsAtStart = deviceInfo.errors;
  const settings = Object.assign({}, DEFAULT_SETTINGS);
  mergeSettings(settings, options.settings);

  // Node ids -> user index (graph.forEachNode order)
  const ids = [];
  graph.forEachNode(node => { ids.push(node.id); });
  const n = ids.length;
  const userIndex = new Map();
  for (let u = 0; u < n; u++) userIndex.set(ids[u], u);

  // Initial positions (f64), with coincident nodes spread out deterministically
  const xs = new Float64Array(n), ys = new Float64Array(n);
  const side = Math.sqrt(n) * settings.springLength;
  for (let u = 0; u < n; u++) {
    const p = options.getInitialPosition ? options.getInitialPosition(ids[u]) : null;
    if (p && Number.isFinite(p.x) && Number.isFinite(p.y)) {
      xs[u] = p.x; ys[u] = p.y;
    } else {
      xs[u] = (hash01(u, 1) - 0.5) * side;
      ys[u] = (hash01(u, 2) - 0.5) * side;
    }
  }
  separateCoincident(xs, ys);
  const robust = robustCenter(xs, ys);
  const ox = robust.x, oy = robust.y;

  // Edges (no self-loops) and the library's default mass, 1 + links / 3
  const edgeList = [];
  graph.forEachLink(link => {
    if (link.fromId === link.toId) return;
    const a = userIndex.get(link.fromId), b = userIndex.get(link.toId);
    if (a !== undefined && b !== undefined) edgeList.push(a, b);
  });
  const userMass = new Float32Array(n);
  for (let u = 0; u < n; u++) {
    const links = graph.getLinks ? graph.getLinks(ids[u]) : null;
    const count = links ? (links.size !== undefined ? links.size : links.length) : 0;
    userMass[u] = 1 + count / 3;
  }

  const useSmall = n > 0 && smallEngineFits(device, n);
  // internal index of every user index
  const toInternal = !useSmall && n >= HILBERT_MIN_NODES ? hilbertOrder(xs, ys, robust) : identity(n);
  const init = new Float32Array(2 * n);
  const mass = new Float32Array(n);
  for (let u = 0; u < n; u++) {
    const k = toInternal[u];
    init[2 * k] = xs[u] - ox; init[2 * k + 1] = ys[u] - oy;
    mass[k] = userMass[u];
  }
  const edges = new Uint32Array(edgeList.length);
  for (let e = 0; e < edgeList.length; e++) edges[e] = toInternal[edgeList[e]];

  let engine = null;
  let creationError = null;
  if (n > 0) {
    device.pushErrorScope('validation');
    device.pushErrorScope('out-of-memory');
    engine = (useSmall ? createSmallEngine : createGridEngine)(device, { n, edges, init, mass });
    engine.setParams(settings);
    const report = e => {
      if (!e) return;
      creationError = e.message;
      console.error('WebGPU layout setup failed:', e.message);
    };
    device.popErrorScope().then(report);
    device.popErrorScope().then(report);
  }

  // CPU mirror (internal order, relative to the origin) and stable {x, y} objects per node
  const mirror = new Float32Array(init);
  const positionObjects = new Array(n);
  let rect = null;

  // Readbacks: positions, then (when supported) two GPU timestamps for the step() call
  const hasTimestamps = !!engine && device.features.has('timestamp-query');
  const tsOffset = n * 8;
  const readbackSize = Math.max(16, tsOffset + (hasTimestamps ? 16 : 0));
  const freeReadbacks = [];
  const allReadbacks = [];
  if (engine) {
    for (let r = 0; r < READBACK_BUFFERS; r++) {
      const buffer = device.createBuffer({ size: readbackSize, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      allReadbacks.push(buffer);
      freeReadbacks.push({ buffer });
    }
  }
  let querySet = null, resolveBuffer = null;
  if (hasTimestamps) {
    querySet = device.createQuerySet({ type: 'timestamp', count: 2 });
    resolveBuffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC });
  }

  let disposed = false;
  let stepsSubmitted = 0;
  let readbackSerial = 0;      // serial of the latest readback that was submitted
  let lastReadbackSteps = 0;   // stepsSubmitted when that readback was submitted
  let appliedSerial = 0;       // serial of the latest readback copied into the mirror
  const overrides = new Map(); // internal index -> {x, y, serial}: setNodePosition calls newer than pending readbacks
  const samples = [];          // recent {ms, steps}
  let lastResolve = null;      // {time, steps} for wall-clock stats
  const pendingWaiters = [];   // flush() promises

  return {
    step,
    getNodePosition,
    setNodePosition,
    pinNode,
    getGraphRect,
    updateSettings,
    getStats,
    flush,
    dispose,
    get settings() { return Object.assign({}, settings); },
    _engine: engine, // for tests and debugging
  };

  /**
   * Encodes `count` steps plus a copy of positions into a free readback buffer, without
   * blocking. When all readback buffers are still pending, the steps run without a readback.
   */
  function step(count = 1) {
    if (disposed || !engine || deviceInfo.lost) return;
    count = Math.floor(count);
    if (!(count > 0)) return;
    const rb = freeReadbacks.pop();
    const withTs = !!rb && hasTimestamps;
    engine.run(count, withTs ? { querySet } : null, rb ? enc => {
      enc.copyBufferToBuffer(engine.pos, 0, rb.buffer, 0, n * 8);
      if (withTs) {
        enc.resolveQuerySet(querySet, 0, 2, resolveBuffer, 0);
        enc.copyBufferToBuffer(resolveBuffer, 0, rb.buffer, tsOffset, 16);
      }
    } : null);
    stepsSubmitted += count;
    if (rb) mapReadback(rb, count, withTs);
  }

  function mapReadback(rb, count, withTs) {
    rb.serial = ++readbackSerial;
    rb.steps = stepsSubmitted;
    lastReadbackSteps = stepsSubmitted;
    rb.buffer.mapAsync(GPUMapMode.READ).then(() => {
      if (disposed) return;
      applyReadback(rb, new Float32Array(rb.buffer.getMappedRange(0, n * 8)));
      if (withTs) {
        const t = new BigUint64Array(rb.buffer.getMappedRange(tsOffset, 16));
        const ns = Number(t[1] - t[0]);
        if (t[1] > t[0] && ns < 60e9) addSample(ns / 1e6, count);
      } else {
        const now = performance.now();
        if (lastResolve && rb.steps > lastResolve.steps) addSample(now - lastResolve.time, rb.steps - lastResolve.steps);
        lastResolve = { time: now, steps: rb.steps };
      }
      rb.buffer.unmap();
      freeReadbacks.push(rb);
    }).catch(() => { /* buffer destroyed or device lost */ });
  }

  function applyReadback(rb, data) {
    if (rb.serial > appliedSerial) {
      appliedSerial = rb.serial;
      mirror.set(data);
      overrides.forEach((o, k) => {
        if (o.serial <= rb.serial) overrides.delete(k);
        else { mirror[2 * k] = o.x; mirror[2 * k + 1] = o.y; }
      });
      for (let k = 0; k < n; k++) {
        const obj = positionObjects[k];
        if (obj) { obj.x = mirror[2 * k] + ox; obj.y = mirror[2 * k + 1] + oy; }
      }
      rect = null;
    }
    for (let w = pendingWaiters.length - 1; w >= 0; w--) {
      if (pendingWaiters[w].serial <= appliedSerial) { pendingWaiters[w].resolve(); pendingWaiters.splice(w, 1); }
    }
  }

  function addSample(ms, steps) {
    samples.push({ ms, steps });
    if (samples.length > STATS_WINDOW) samples.shift();
  }

  /**
   * Returns {x, y} from the CPU mirror. The object is stable per node and is updated in place
   * whenever a readback completes.
   */
  function getNodePosition(nodeId) {
    const u = userIndex.get(nodeId);
    if (u === undefined) return undefined;
    const k = toInternal[u];
    let obj = positionObjects[k];
    if (!obj) {
      obj = { x: mirror[2 * k] + ox, y: mirror[2 * k + 1] + oy };
      positionObjects[k] = obj;
    }
    return obj;
  }

  function setNodePosition(nodeId, x, y) {
    const u = userIndex.get(nodeId);
    if (u === undefined || disposed) return;
    const k = toInternal[u];
    const rx = x - ox, ry = y - oy;
    mirror[2 * k] = rx; mirror[2 * k + 1] = ry;
    const obj = positionObjects[k];
    if (obj) { obj.x = x; obj.y = y; }
    rect = null;
    if (!engine) return;
    device.queue.writeBuffer(engine.pos, k * 8, new Float32Array([rx, ry]));
    // readbacks submitted before this call still carry the old position
    overrides.set(k, { x: rx, y: ry, serial: readbackSerial + 1 });
  }

  /** Pinned nodes keep their position and are left out of FIRE's sums. */
  function pinNode(nodeId, isPinned) {
    const u = userIndex.get(nodeId);
    if (u === undefined || disposed || !engine) return;
    device.queue.writeBuffer(engine.vel, toInternal[u] * 16, new Float32Array([0, 0, 0, isPinned ? 1 : 0]));
  }

  function getGraphRect() {
    if (!rect) {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (let k = 0; k < n; k++) {
        const x = mirror[2 * k], y = mirror[2 * k + 1];
        if (x < minX) minX = x; if (x > maxX) maxX = x;
        if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
      rect = n ? { min_x: minX + ox, min_y: minY + oy, max_x: maxX + ox, max_y: maxY + oy } : { min_x: 0, min_y: 0, max_x: 0, max_y: 0 };
    }
    return { min_x: rect.min_x, min_y: rect.min_y, max_x: rect.max_x, max_y: rect.max_y };
  }

  function updateSettings(partial) {
    if (disposed) return;
    const wasFire = settings.integrator === 'fire';
    mergeSettings(settings, partial);
    if (!engine) return;
    engine.setParams(settings);
    if (settings.integrator === 'fire' && !wasFire) engine.resetFire();
  }

  /**
   * steps: steps submitted so far. msPerStep: GPU time per step from timestamp queries when the
   * device has them, otherwise wall clock between completed readbacks (which includes waiting
   * for the next frame), averaged over the last few readbacks.
   */
  function getStats() {
    let ms = 0, steps = 0;
    for (const s of samples) { ms += s.ms; steps += s.steps; }
    return {
      steps: stepsSubmitted,
      msPerStep: steps ? ms / steps : 0,
      source: hasTimestamps ? 'gpu-timestamps' : 'wall-clock',
      engine: engine ? engine.kind : 'none',
      nodes: n,
      errors: deviceInfo.errors - errorsAtStart + (creationError ? 1 : 0),
      lost: deviceInfo.lost,
    };
  }

  /** Resolves once the mirror holds the positions after every step submitted so far. */
  function flush() {
    if (disposed || !engine || deviceInfo.lost) return Promise.resolve();
    if (stepsSubmitted > lastReadbackSteps) {
      // the latest steps ran without a readback (all buffers were busy): read positions now
      const buffer = device.createBuffer({ size: n * 8, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      const enc = device.createCommandEncoder();
      enc.copyBufferToBuffer(engine.pos, 0, buffer, 0, n * 8);
      device.queue.submit([enc.finish()]);
      const rb = { buffer, serial: ++readbackSerial };
      lastReadbackSteps = stepsSubmitted;
      return buffer.mapAsync(GPUMapMode.READ).then(() => {
        if (!disposed) applyReadback(rb, new Float32Array(buffer.getMappedRange()));
        buffer.destroy();
      }).catch(() => buffer.destroy());
    }
    if (appliedSerial >= readbackSerial) return Promise.resolve();
    const serial = readbackSerial;
    return new Promise(resolve => pendingWaiters.push({ serial, resolve }));
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    if (engine) engine.destroy();
    for (const b of allReadbacks) b.destroy();
    if (querySet) querySet.destroy();
    if (resolveBuffer) resolveBuffer.destroy();
    pendingWaiters.forEach(w => w.resolve());
    pendingWaiters.length = 0;
  }
}

function mergeSettings(target, partial) {
  if (!partial) return target;
  for (const name of Object.keys(DEFAULT_SETTINGS)) {
    const value = partial[name];
    if (value === undefined || value === null) continue;
    if (name === 'integrator') {
      if (value !== 'euler' && value !== 'fire') console.warn(`Unknown integrator "${value}", using euler`);
      target.integrator = value === 'fire' ? 'fire' : 'euler';
    } else if (Number.isFinite(+value)) {
      target[name] = +value;
    }
  }
  if (!(target.maxVelocity > 0)) target.maxVelocity = 1;
  return target;
}

function identity(n) {
  const out = new Uint32Array(n);
  for (let i = 0; i < n; i++) out[i] = i;
  return out;
}

// Deterministic value in [0, 1) from an index and a salt.
function hash01(i, salt) {
  let h = Math.imul(i + 1, 0x9e3779b1) ^ Math.imul(salt, 0x85ebca77);
  h = Math.imul(h ^ (h >>> 16), 0x7feb352d);
  h = Math.imul(h ^ (h >>> 15), 0x846ca68b);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// Nodes that start at exactly the same point would stay on top of each other (and pile into
// one grid cell). Every repeat of a point moves onto a golden-angle spiral around it, so
// k copies cover a disc of radius ~sqrt(k) at unit density. Deterministic: depends only on
// the node order.
function separateCoincident(xs, ys) {
  const n = xs.length;
  if (n < 2) return;
  let size = 1;
  while (size < 2 * n) size <<= 1;
  const table = new Int32Array(size).fill(-1);
  const repeats = new Uint32Array(n);
  const f = new Float64Array(2), w = new Uint32Array(f.buffer);
  for (let i = 0; i < n; i++) {
    f[0] = xs[i] + 0; f[1] = ys[i] + 0; // + 0 turns -0 into 0
    let h = (Math.imul(w[0] ^ w[1], 0x9e3779b1) ^ Math.imul(w[2] ^ w[3], 0x85ebca77)) >>> 0;
    h = (h ^ (h >>> 15)) & (size - 1);
    let first = -1;
    for (;;) {
      const j = table[h];
      if (j === -1) { table[h] = i; break; }
      if (xs[j] === xs[i] && ys[j] === ys[i]) { first = j; break; }
      h = (h + 1) & (size - 1);
    }
    if (first >= 0) {
      const k = ++repeats[first];
      const r = Math.sqrt(k), angle = k * 2.399963229728653;
      xs[i] = xs[first] + r * Math.cos(angle);
      ys[i] = ys[first] + r * Math.sin(angle);
    }
  }
}

// Median of a strided sample (the f32 origin) and a robust extent for the Hilbert curve.
function robustCenter(xs, ys) {
  const n = xs.length;
  if (!n) return { x: 0, y: 0, minX: 0, minY: 0, side: 1 };
  const stride = Math.max(1, Math.floor(n / 4096));
  const sx = [], sy = [];
  for (let i = 0; i < n; i += stride) { sx.push(xs[i]); sy.push(ys[i]); }
  const sortedX = Float64Array.from(sx).sort(), sortedY = Float64Array.from(sy).sort();
  const q = (arr, t) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(t * (arr.length - 1))))];
  const minX = q(sortedX, 0.001), maxX = q(sortedX, 0.999), minY = q(sortedY, 0.001), maxY = q(sortedY, 0.999);
  return { x: q(sortedX, 0.5), y: q(sortedY, 0.5), minX, minY, side: Math.max(maxX - minX, maxY - minY) || 1 };
}

// Internal index of every node along a Hilbert curve through the start positions.
function hilbertOrder(xs, ys, box) {
  const n = xs.length, N = 4096;
  const keys = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let x = Math.min(N - 1, Math.max(0, Math.floor((xs[i] - box.minX) / box.side * N)));
    let y = Math.min(N - 1, Math.max(0, Math.floor((ys[i] - box.minY) / box.side * N)));
    let d = 0;
    for (let s = N >> 1; s > 0; s >>= 1) {
      const rx = (x & s) > 0 ? 1 : 0, ry = (y & s) > 0 ? 1 : 0;
      d += s * s * ((3 * rx) ^ ry);
      if (ry === 0) {
        if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
        const t = x; x = y; y = t;
      }
    }
    keys[i] = d * 16777216 + i; // key < 2^24, i < 2^24: exact in a double
  }
  keys.sort();
  const out = new Uint32Array(n);
  for (let k = 0; k < n; k++) out[keys[k] % 16777216] = k;
  return out;
}
