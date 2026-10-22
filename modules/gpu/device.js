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

// The speed probe: three kinds of work the module's kernels do, each timed in its own pass.
//  - pairs: every thread sums a push from each of 1,024 bodies (an exact pair loop, from cache);
//  - gather: every thread reads scattered words of a 16 MB buffer (a cell sort's neighbours);
//  - atomics: every thread adds into scattered and into shared counters (a grid's deposit).
// MS is each part's GPU time on the M4 Max the work caps were sized on (0.93-1.01, 0.95 and
// 0.76-0.87 ms measured), with a margin for noise; at about 1 ms each, Chrome's 100 us timestamp
// quantum costs at most a tenth.
const PROBE_THREADS = 65536, PROBE_BODIES = 1024, GATHER_WORDS = 1 << 22, GATHER_READS = 128, ATOMIC_SLOTS = 1 << 20, ATOMIC_ADDS = 32;
const MIX = `fn mix(x: u32) -> u32 {
  var h = x * 747796405u + 2891336453u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu;
  return (h >> 16u) ^ h;
}`;
const PROBE_PARTS = [
  {
    name: 'pairs', MS: 1.06, buffers: ['bodies', 'out'],
    code: `@group(0) @binding(0) var<storage, read> p: array<vec4f>;
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
}`,
  },
  {
    name: 'gather', MS: 1.0, buffers: ['words', 'out'],
    code: `@group(0) @binding(0) var<storage, read> words: array<u32>;
@group(0) @binding(1) var<storage, read_write> out: array<f32>;
${MIX}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  var at = mix(gid.x);
  var acc = 0u;
  for (var k = 0u; k < ${GATHER_READS}u; k++) {
    let w = words[at & ${GATHER_WORDS - 1}u];
    acc += w;
    at = mix(at + w);
  }
  out[gid.x] = f32(acc);
}`,
  },
  {
    name: 'atomics', MS: 0.91, buffers: ['slots'],
    code: `@group(0) @binding(0) var<storage, read_write> slots: array<atomic<u32>>;
${MIX}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  var at = mix(gid.x);
  for (var k = 0u; k < ${ATOMIC_ADDS}u; k++) {
    // one add in four lands on 256 shared counters, as bodies piled into a few grid cells do
    let slot = select(at & ${ATOMIC_SLOTS - 1}u, at & 255u, (k & 3u) == 0u);
    atomicAdd(&slots[slot], 1u);
    at = mix(at);
  }
}`,
  },
];
// The factor when the probe cannot measure: a slow device, the safe side
const UNKNOWN_SLOWDOWN = 10;

/**
 * How many times slower than the M4 Max the work caps were sized on this device is: the largest
 * ratio of the probe's three parts (1 at least, 100 at most), measured once per device. GPU time
 * from timestamps when the device has them (the larger of two runs after a warm-up), else the
 * wall clock of each part's submit, which counts its latency too (so it reads slower, the safe
 * side). A probe that cannot measure gives UNKNOWN_SLOWDOWN. About 3 ms of GPU work here.
 */
export async function deviceSlowdown(device) {
  const state = watchDevice(device);
  if (state.slowdown !== null) return state.slowdown;
  let factor = UNKNOWN_SLOWDOWN;
  const owned = [];
  try {
    const pipelines = await Promise.all(PROBE_PARTS.map(part => getPipeline(device, { code: part.code, label: 'SPEED_PROBE_' + part.name })));
    const buffer = (size, usage) => { const b = device.createBuffer({ size, usage }); owned.push(b); return b; };
    const S = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
    const bodies = new Float32Array(PROBE_BODIES * 4);
    for (let i = 0; i < PROBE_BODIES; i++) bodies.set([Math.cos(i), Math.sin(i * 1.3), (i % 37) * 0.1, 1 + (i % 5)], i * 4);
    const input = buffer(bodies.byteLength, S);
    device.queue.writeBuffer(input, 0, bodies);
    const words = buffer(GATHER_WORDS * 4, S);
    const fill = new Uint32Array(1 << 16);
    for (let i = 0; i < fill.length; i++) fill[i] = (i * 2654435761) >>> 0;
    for (let at = 0; at < GATHER_WORDS; at += fill.length) device.queue.writeBuffer(words, at * 4, fill);
    const slots = buffer(ATOMIC_SLOTS * 4, S);
    const output = buffer(PROBE_THREADS * 4, GPUBufferUsage.STORAGE);
    const named = { bodies: input, words, slots, out: output };
    const groups = pipelines.map((pipeline, p) => device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: PROBE_PARTS[p].buffers.map((name, binding) => ({ binding, resource: { buffer: named[name] } })),
    }));
    const timed = device.features.has('timestamp-query');
    const count = 2 * PROBE_PARTS.length;
    const querySet = timed ? device.createQuerySet({ type: 'timestamp', count }) : null;
    const resolve = timed ? buffer(count * 8, GPUBufferUsage.QUERY_RESOLVE | GPUBufferUsage.COPY_SRC) : null;
    const read = timed ? buffer(count * 8, GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST) : null;
    const submit = timed ? 0 : await submitCost(device);
    // one run: each part's ms
    const once = async () => {
      if (timed) {
        const enc = device.createCommandEncoder();
        PROBE_PARTS.forEach((part, p) => {
          const pass = enc.beginComputePass({ timestampWrites: { querySet, beginningOfPassWriteIndex: 2 * p, endOfPassWriteIndex: 2 * p + 1 } });
          pass.setPipeline(pipelines[p]);
          pass.setBindGroup(0, groups[p]);
          pass.dispatchWorkgroups(PROBE_THREADS / 256);
          pass.end();
        });
        enc.resolveQuerySet(querySet, 0, count, resolve, 0);
        enc.copyBufferToBuffer(resolve, 0, read, 0, count * 8);
        device.queue.submit([enc.finish()]);
        await read.mapAsync(GPUMapMode.READ);
        const t = new BigUint64Array(read.getMappedRange());
        const ms = PROBE_PARTS.map((part, p) => Number(t[2 * p + 1] - t[2 * p]) / 1e6);
        read.unmap();
        return ms;
      }
      const ms = [];
      for (let p = 0; p < PROBE_PARTS.length; p++) {
        const enc = device.createCommandEncoder();
        const pass = enc.beginComputePass();
        pass.setPipeline(pipelines[p]);
        pass.setBindGroup(0, groups[p]);
        pass.dispatchWorkgroups(PROBE_THREADS / 256);
        pass.end();
        const start = performance.now();
        device.queue.submit([enc.finish()]);
        await device.queue.onSubmittedWorkDone();
        ms.push(performance.now() - start - submit);
      }
      return ms;
    };
    // a warm-up run, then the larger of two (slower reads the safe side)
    await once();
    const runs = [await once(), await once()];
    const ms = PROBE_PARTS.map((part, p) => Math.max(runs[0][p], runs[1][p]));
    state.probeMs = ms;
    if (ms.every(value => Number.isFinite(value) && value > 0)) {
      factor = Math.min(100, Math.max(1, ...ms.map((value, p) => value / PROBE_PARTS[p].MS)));
    }
    if (querySet) querySet.destroy();
  } catch (e) {
    factor = UNKNOWN_SLOWDOWN;
  } finally {
    owned.forEach(b => b.destroy());
  }
  state.slowdown = factor;
  return factor;
}
