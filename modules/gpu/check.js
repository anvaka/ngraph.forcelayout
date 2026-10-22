// What this module can run, for the library's `simulator.plan(backend)`, decided without a device:
// from the step as data (simulator.program()) and a capability profile (the device's limits).
//
//   const plan = layout.simulator.plan(gpuCapabilities());    // WebGPU's default limits
//   plan.runs; plan.reasons;   // ['personalSpace: WebGPU does not run pair formulas yet', ...]
//
// One lowering decides both what plan() says and what runOnGpu() builds (lower() below), so a
// "runs" verdict is the plan the runner compiles. Today that is the stock step: clear, repulsion,
// drag, springs, integrate, in 2D, with any law the printer accepts, the mass as charge,
// sensitivity and inertia, the default length and stiffness on every link, and no adaptive time
// step. Everything else gets a refusal that says what does not run.
import { createPrinter, emitLaw, lawValueCount, lawValueProblem, lawValueWarnings, f32Problem } from './wgsl/print.js';
import { schedule, physicsStages, isGuard, STOCK_STAGES } from './schedule.js';
import { LAW_VALUES } from './templates/grid.js';

// Limits the module asks a device for, and plans against
export const LIMIT_NAMES = [
  'maxStorageBuffersPerShaderStage', 'maxStorageBufferBindingSize', 'maxBufferSize',
  'maxComputeInvocationsPerWorkgroup', 'maxComputeWorkgroupSizeX', 'maxComputeWorkgroupStorageSize',
  'maxComputeWorkgroupsPerDimension', 'maxUniformBufferBindingSize', 'minUniformBufferOffsetAlignment',
  'maxDynamicUniformBuffersPerPipelineLayout',
];

// WebGPU's default limits: every device has at least these
export const SPEC_LIMITS = Object.freeze({
  maxStorageBuffersPerShaderStage: 8,
  maxStorageBufferBindingSize: 134217728,
  maxBufferSize: 268435456,
  maxComputeInvocationsPerWorkgroup: 256,
  maxComputeWorkgroupSizeX: 256,
  maxComputeWorkgroupStorageSize: 16384,
  maxComputeWorkgroupsPerDimension: 65535,
  maxUniformBufferBindingSize: 65536,
  minUniformBufferOffsetAlignment: 256,
  maxDynamicUniformBuffersPerPipelineLayout: 8,
});

// Kernels run 256 threads per workgroup, one body per thread
const THREADS = 256;
const PHYSICS_SETTINGS = ['timeStep', 'springLength', 'springCoefficient', 'dragCoefficient', 'gravity', 'maxVelocity'];
const FORMULA_KINDS = { node: 'node formulas', link: 'link formulas', pair: 'pair formulas', sum: 'sums' };

/**
 * A backend for `simulator.plan(backend)` that needs no device: WebGPU's default limits, or
 * `limits` on top of them (e.g. {maxStorageBuffersPerShaderStage: 10}).
 */
export function gpuCapabilities(limits) {
  return createCapabilities(Object.assign({}, SPEC_LIMITS, limits));
}

/**
 * The backend object for `limits`: {name, limits, check, checkProgram, lower}.
 */
export function createCapabilities(limits) {
  // plan() asks checkProgram() and then check() for every stage of the same program object
  const lowered = new WeakMap();
  const lowerFor = (program, simulator) => {
    let lowering = lowered.get(program);
    if (!lowering) {
      lowering = lower(program, simulator, limits);
      lowered.set(program, lowering);
    }
    return lowering;
  };
  return {
    name: 'webgpu',
    limits,
    checkProgram(program, simulator) {
      const lowering = lowerFor(program, simulator);
      return { reasons: lowering.reasons, warnings: lowering.warnings };
    },
    check(stage, program, simulator) {
      return lowerFor(program, simulator).stages[stage.name];
    },
    lower: lowerFor,
  };
}

/**
 * The verdicts for `program` on a device with `limits`: {runs, reasons, warnings, stages, plan}.
 * `reasons` and `warnings` are about the step as a whole (plan() adds the stages' own);
 * `stages` maps a stage name to {runs, how} or {runs: false, reason}; `plan` is what
 * schedule() makes of it, or null when it does not run.
 */
export function lower(program, simulator, limits) {
  const reasons = [], warnings = [], stages = {};
  const printer = createPrinter(message => { if (warnings.indexOf(message) < 0) warnings.push(message); });
  let law = null;
  program.stages.forEach(stage => {
    const verdict = checkStage(stage, program, simulator, printer);
    if (verdict.law !== undefined) law = verdict.law;
    stages[stage.name] = verdict.runs ? { runs: true, how: verdict.how } : { runs: false, reason: verdict.reason };
    if (verdict.warnings && verdict.warnings.length) stages[stage.name].warnings = verdict.warnings;
  });

  if (program.dims !== 2) reasons.push(`WebGPU does not run ${program.dims}D layouts yet`);
  const physics = physicsStages(program);
  const stagesRun = Object.keys(stages).every(name => stages[name].runs);
  if (stagesRun) {
    // every stage is one of the stock step's (a replaced or an added one is refused by itself)
    const builtIn = physics.filter(stage => stage.builtIn).map(stage => stage.builtIn);
    const missing = STOCK_STAGES.filter(name => builtIn.indexOf(name) < 0);
    if (missing.length) reasons.push(`WebGPU runs the whole built in step only for now; this step has no ${missing.join(', ')}`);
    else if (builtIn.join() !== STOCK_STAGES.join()) reasons.push('WebGPU runs the built in stages in their usual order only');
  }
  PHYSICS_SETTINGS.forEach(key => {
    const problem = f32Problem(program.settings[key]);
    if (problem) reasons.push(`the setting ${key}: ${problem}`);
  });
  if (program.listeners.step) warnings.push("'step' listeners run once per readback from the GPU, not after every step");

  let plan = null;
  if (stagesRun && reasons.length === 0) {
    plan = schedule(program, law, limits);
    budgets(plan, limits, reasons);
    physics.forEach(stage => { stages[stage.name].how = plan.how[stage.builtIn]; });
    if (reasons.length) plan = null;
  }
  return { runs: stagesRun && reasons.length === 0, reasons, warnings, stages, plan };
}

// The lowering table: what each kind of stage needs to run here
function checkStage(stage, program, simulator, printer) {
  if (isGuard(stage)) return runs('stops layout.step() while the GPU runs the layout');
  switch (stage.builtIn || stage.shape) {
    case 'clear':
    case 'drag':
      return runs('part of the step');
    case 'springs':
      return checkSprings(simulator);
    case 'repulsion':
      return checkRepulsion(stage, simulator, printer);
    case 'integrate':
      return checkIntegrate(stage);
    case 'node':
    case 'link':
    case 'pair':
    case 'sum':
      return refuse(`WebGPU does not run ${FORMULA_KINDS[stage.shape]} yet`);
    case 'tree':
      return refuse('WebGPU does not run extra repulsion passes (addRepulsion) yet');
    case 'host':
      return refuse('WebGPU does not run host steps yet');
    case 'js':
      return refuse('JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)');
    case 'pair rules':
      return refuse('pair rules are JavaScript and run on the CPU only (pair formulas do the same on every engine)');
  }
  return refuse(`WebGPU does not know stages of shape ${stage.shape}`);
}

function checkSprings(simulator) {
  const springs = simulator.springStore;
  for (let i = 0; i < springs.n; i++) {
    if (springs.length[i] >= 0 || springs.coefficient[i] > 0) {
      return refuse('WebGPU does not run links with their own length or stiffness yet');
    }
  }
  return runs('part of the step');
}

function checkRepulsion(stage, simulator, printer) {
  const channel = stage.args.channels[0];
  const described = channel.law;
  if (channel.charge !== 'mass' || channel.sensitivity !== 'mass') {
    return refuse('WebGPU does not run charge or sensitivity columns other than the mass yet');
  }
  if (described.tables.length) return refuse('WebGPU does not run laws with lookup tables yet');
  if (described.functions.length) return refuse('laws with JavaScript functions run on the CPU only');
  if (described.isDefault) return Object.assign(runs('part of the step'), { law: null });
  // The law the CPU runs, compiled; its numbers as of this step
  const law = simulator.stageValues(stage.name).law;
  const count = lawValueCount(law);
  if (count > LAW_VALUES) return refuse(`WebGPU takes laws with up to ${LAW_VALUES} numbers for now; this one has ${count}`);
  try {
    emitLaw(law, 2, 'r', 'k1', 'k2', printer);
  } catch (e) {
    return refuse('the law: ' + e.message);
  }
  const problem = lawValueProblem(law);
  if (problem) return refuse(`the law's ${problem.name} is ${problem.problem}`);
  return Object.assign(runs('part of the step'), { law, warnings: lawValueWarnings(law) });
}

function checkIntegrate(stage) {
  const args = stage.args;
  if (args.integrator !== 'euler' && args.integrator !== 'fire') return refuse(`WebGPU does not know the integrator ${args.integrator}`);
  if (args.inertia !== 'mass') return refuse(`WebGPU divides forces by the mass only for now (inertia: ${args.inertia})`);
  if (args.adaptiveTimeStepWeight) return refuse('WebGPU has no adaptive time step');
  return runs('part of the step');
}

// Storage bindings per kernel, buffer sizes and dispatch sizes against the device's limits
function budgets(plan, limits, reasons) {
  const kernels = plan.kernels();
  Object.keys(kernels).forEach(name => {
    const bindings = (kernels[name].match(/var<storage\b/g) || []).length;
    if (bindings > limits.maxStorageBuffersPerShaderStage) {
      reasons.push(`kernel ${name} needs ${bindings} storage buffers; this device allows ${limits.maxStorageBuffersPerShaderStage}`);
    }
  });
  const largest = Math.min(limits.maxStorageBufferBindingSize, limits.maxBufferSize);
  Object.keys(plan.buffers).forEach(name => {
    const size = plan.buffers[name];
    if (size > largest) reasons.push(`the buffer ${name} needs ${megabytes(size)}; this device allows ${megabytes(largest)} per buffer`);
  });
  const most = limits.maxComputeWorkgroupsPerDimension * THREADS;
  if (plan.nodes > most) reasons.push(`WebGPU runs up to ${most.toLocaleString('en-US')} bodies (one thread each); this layout has ${plan.nodes.toLocaleString('en-US')}`);
}

function megabytes(bytes) {
  return (bytes / 1048576).toFixed(bytes < 10485760 ? 1 : 0) + ' MiB';
}

function runs(how) {
  return { runs: true, how };
}

function refuse(reason) {
  return { runs: false, reason };
}
