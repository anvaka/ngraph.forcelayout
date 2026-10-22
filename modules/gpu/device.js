// The device: requesting it with the adapter's limits, watching it for errors and loss, its
// pipelines (compiled asynchronously, cached by their WGSL text), what a submit costs on it, and
// how much slower than the Mac the work caps were sized on it is.
const deviceStates = new WeakMap(); // device -> state, see watchDevice()

/**
 * A GPUDevice with the adapter's values of `limits` (names of GPUSupportedLimits) and with
 * timestamp queries when the adapter has them, or null when WebGPU is not available.
 */
export async function requestDevice(limits) {
  try {
    if (typeof navigator === 'undefined' || !navigator.gpu) return null;
    const adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    if (!adapter) return null;
    const requiredLimits = {};
    for (const name of limits) {
      if (adapter.limits[name] !== undefined) requiredLimits[name] = adapter.limits[name];
    }
    const requiredFeatures = adapter.features.has('timestamp-query') ? ['timestamp-query'] : [];
    return await adapter.requestDevice({ requiredFeatures, requiredLimits });
  } catch (e) {
    console.warn('WebGPU is not available:', e);
    return null;
  }
}

/**
 * Per device: the listeners of its errors and loss (runners), its pipelines and its submit cost.
 * Validation errors are only console warnings unless someone listens, so every device a runner
 * uses is watched.
 */
export function watchDevice(device) {
  let state = deviceStates.get(device);
  if (state) return state;
  state = { listeners: new Set(), lost: null, modules: new Map(), pipelines: new Map(), layouts: new Map(), submitMs: null, slowdown: null };
  deviceStates.set(device, state);
  device.addEventListener('uncapturederror', e => {
    const message = e.error && e.error.message ? e.error.message : String(e.error);
    state.listeners.forEach(listener => listener({ message }));
  });
  device.lost.then(info => {
    state.lost = info;
    state.listeners.forEach(listener => listener({ lost: true, message: info.message || 'the device was lost', reason: info.reason }));
  });
  return state;
}

/**
 * A compute pipeline for `code`, created asynchronously and cached per device by the WGSL text,
 * the layout and the override constants. `bindings` gives an explicit layout, one entry per
 * binding: 'uniform', 'dynamic' (a uniform with a dynamic offset), 'read' or 'storage'; without
 * it the layout is 'auto'. Rejects with an error that names the kernel (`error.kernel`).
 */
export function getPipeline(device, { code, label, bindings = null, constants = null }) {
  const state = watchDevice(device);
  const layoutKey = bindings ? bindings.join(',') : 'auto';
  const key = layoutKey + '|' + (constants ? JSON.stringify(constants) : '') + '|' + code;
  let pipeline = state.pipelines.get(key);
  if (!pipeline) {
    pipeline = createPipeline(device, state, { code, label, bindings, constants });
    state.pipelines.set(key, pipeline);
    pipeline.catch(() => { state.pipelines.delete(key); });
  }
  return pipeline;
}

async function createPipeline(device, state, { code, label, bindings, constants }) {
  let module = state.modules.get(code);
  let moduleError = null;
  if (!module) {
    device.pushErrorScope('validation');
    module = device.createShaderModule({ code, label });
    moduleError = device.popErrorScope();
    state.modules.set(code, module);
  }
  const layout = bindings ? pipelineLayout(device, state, bindings) : 'auto';
  const compute = { module, entryPoint: 'main' };
  if (constants) compute.constants = constants;
  try {
    const [error, pipeline] = await Promise.all([moduleError, device.createComputePipelineAsync({ layout, compute, label })]);
    if (error) throw error;
    return pipeline;
  } catch (e) {
    state.modules.delete(code);
    const error = new Error(`kernel ${label}: ${e.message}`);
    error.kernel = label;
    throw error;
  }
}

const BINDING_TYPES = {
  uniform: { buffer: { type: 'uniform' } },
  dynamic: { buffer: { type: 'uniform', hasDynamicOffset: true } },
  read: { buffer: { type: 'read-only-storage' } },
  storage: { buffer: { type: 'storage' } },
};

function pipelineLayout(device, state, bindings) {
  const key = bindings.join(',');
  let layout = state.layouts.get(key);
  if (!layout) {
    const group = device.createBindGroupLayout({
      entries: bindings.map((type, binding) => Object.assign({ binding, visibility: GPUShaderStage.COMPUTE }, BINDING_TYPES[type])),
    });
    layout = device.createPipelineLayout({ bindGroupLayouts: [group] });
    state.layouts.set(key, layout);
  }
  return layout;
}

/**
 * What one submit costs on this device, in ms: the wall clock of near empty submits, measured
 * once per device. Batching (runner.js) puts enough steps in a submit to hide it.
 */
export async function submitCost(device) {
  const state = watchDevice(device);
  if (state.submitMs !== null) return state.submitMs;
  const count = 16;
  await device.queue.onSubmittedWorkDone();
  const start = performance.now();
  for (let i = 0; i < count; i++) device.queue.submit([device.createCommandEncoder().finish()]);
  await device.queue.onSubmittedWorkDone();
  state.submitMs = (performance.now() - start) / count;
  return state.submitMs;
}

// The speed probe: every thread sums a push from each of PROBE_BODIES bodies, as an exact pair loop
// does (16.8M pairs). PROBE_MS is its GPU time on the M4 Max the work caps were sized on (0.262 ms),
// with a margin for noise
const PROBE_BODIES = 1024, PROBE_THREADS = 16384, PROBE_MS = 0.27;
const PROBE = `@group(0) @binding(0) var<storage, read> p: array<vec4f>;
@group(0) @binding(1) var<storage, read_write> out: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let me = p[gid.x % ${PROBE_BODIES}u];
  var acc = vec3f(0.0);
  for (var j = 0u; j < ${PROBE_BODIES}u; j++) {
    let o = p[j];
    let d = o.xyz - me.xyz;
    let r2 = dot(d, d) + 0.01;
    acc += d * (o.w * inverseSqrt(r2) / r2);
  }
  out[gid.x] = acc.x + acc.y + acc.z;
}`;

/**
 * How many times slower than the M4 Max the work caps were sized on this device is (1 at least,
 * at most 100), measured once per device with a probe of a known amount of pair work: GPU time
 * from timestamps when the device has them, else the wall clock of 4 probes less a submit's cost.
 * About 0.2 ms of GPU work here; the caps and the steps per submit scale with it.
 */
export async function deviceSlowdown(device) {
  const state = watchDevice(device);
  if (state.slowdown !== null) return state.slowdown;
  const pipeline = await getPipeline(device, { code: PROBE, label: 'SPEED_PROBE' });
  const bodies = new Float32Array(PROBE_BODIES * 4);
  for (let i = 0; i < PROBE_BODIES; i++) bodies.set([Math.cos(i), Math.sin(i * 1.3), (i % 37) * 0.1, 1 + (i % 5)], i * 4);
  const input = device.createBuffer({ size: bodies.byteLength, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
  const output = device.createBuffer({ size: PROBE_THREADS * 4, usage: GPUBufferUsage.STORAGE });
  device.queue.writeBuffer(input, 0, bodies);
  const group = device.createBindGroup({ layout: pipeline.getBindGroupLayout(0), entries: [input, output].map((buffer, binding) => ({ binding, resource: { buffer } })) });
  const timed = device.features.has('timestamp-query');
  const querySet = timed ? device.createQuerySet({ type: 'timestamp', count: 2 }) : null;
  const resolve = timed ? device.createBuffer({ size: 16, usage: GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC }) : null;
  const read = timed ? device.createBuffer({ size: 16, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST }) : null;
  const repeats = timed ? 1 : 4;
  const once = async () => {
    const enc = device.createCommandEncoder();
    const pass = enc.beginComputePass(timed ? { timestampWrites: { querySet, beginningOfPassWriteIndex: 0, endOfPassWriteIndex: 1 } } : undefined);
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, group);
    for (let r = 0; r < repeats; r++) pass.dispatchWorkgroups(PROBE_THREADS / 256);
    pass.end();
    if (timed) {
      enc.resolveQuerySet(querySet, 0, 2, resolve, 0);
      enc.copyBufferToBuffer(resolve, 0, read, 0, 16);
    }
    const start = performance.now();
    device.queue.submit([enc.finish()]);
    if (!timed) {
      await device.queue.onSubmittedWorkDone();
      return (performance.now() - start) / repeats;
    }
    await read.mapAsync(GPUMapMode.READ);
    const t = new BigUint64Array(read.getMappedRange());
    const ms = Number(t[1] - t[0]) / 1e6;
    read.unmap();
    return ms;
  };
  let best = Infinity;
  try {
    const submit = timed ? 0 : await submitCost(device);
    // the first run warms the device up; the best of three counts
    await once();
    for (let k = 0; k < 3; k++) best = Math.min(best, Math.max(0, (await once()) - submit / repeats));
  } catch (e) {
    best = NaN;
  } finally {
    [input, output, resolve, read].forEach(buffer => { if (buffer) buffer.destroy(); });
    if (querySet) querySet.destroy();
  }
  state.slowdown = Number.isFinite(best) && best > 0 ? Math.min(100, Math.max(1, best / PROBE_MS)) : 1;
  state.probeMs = best;
  return state.slowdown;
}
