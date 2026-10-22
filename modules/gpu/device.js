// The device: requesting it with the adapter's limits, watching it for errors and loss, its
// pipelines (compiled asynchronously, cached by their WGSL text) and what a submit costs on it.
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
  state = { listeners: new Set(), lost: null, modules: new Map(), pipelines: new Map(), layouts: new Map(), submitMs: null };
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
