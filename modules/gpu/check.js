// What this module can run, for the library's `simulator.plan(backend)`, decided without a device:
// from the step as data (simulator.program()), the store's columns, and a capability profile
// (the device's limits).
//
//   const plan = layout.simulator.plan(gpuCapabilities());    // WebGPU's default limits
//   plan.runs; plan.reasons;   // ['personalSpace: WebGPU does not run pair formulas yet', ...]
//
// One lowering decides both what plan() says and what runOnGpu() builds (lower() below), so a
// "runs" verdict is the plan the runner compiles. It runs, in any number of dimensions:
//  - node formulas and sums over bodies (global), in CPU stage order;
//  - the stock repulsion and extra passes (addRepulsion), with any law the printer accepts and
//    any charge and sensitivity columns, as exact pairs up to 16,384 bodies; the stock step in 2D
//    on any number of bodies (the grid template);
//  - drag, the stock springs (one length and stiffness), Euler or FIRE with any inertia column;
//  - `when` on any of these.
// Everything else gets a refusal that says what does not run.
import formula from '../../lib/formula.js';
import { createPrinter, emitLaw, lawValueProblem, lawValueWarnings, f32Problem } from './wgsl/print.js';
import { schedule } from './schedule.js';
import { physicsStages, isGuard } from './program.js';

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

// What plan() says once the backend's device is gone (a lost device never comes back)
export const DEVICE_LOST = 'the WebGPU device was lost; create a new backend';

// Kernels run 256 threads per workgroup, one body per thread
const THREADS = 256;
const PHYSICS_SETTINGS = ['timeStep', 'springLength', 'springCoefficient', 'dragCoefficient', 'gravity', 'maxVelocity'];
const FLOATS = { f64: true, f32: true };

/**
 * A backend for `simulator.plan(backend)` that needs no device: WebGPU's default limits, or
 * `limits` on top of them (e.g. {maxStorageBuffersPerShaderStage: 10}). `options.generic` keeps
 * the stock step off its template (tests that compare the two use it).
 */
export function gpuCapabilities(limits, options) {
  return createCapabilities(Object.assign({}, SPEC_LIMITS, limits), options);
}

/**
 * The backend object for `limits`: {name, limits, check, checkProgram, lower}. `options.lost()`
 * tells when the device of the backend is lost: nothing runs on it then.
 */
export function createCapabilities(limits, options = {}) {
  // plan() asks checkProgram() and then check() for every stage of the same program object
  const lowered = new WeakMap();
  const lowerFor = (program, simulator) => {
    let lowering = lowered.get(program);
    if (!lowering) {
      lowering = lower(program, simulator, limits, options);
      lowered.set(program, lowering);
    }
    if (options.lost && options.lost()) {
      return Object.assign({}, lowering, { runs: false, reasons: [DEVICE_LOST].concat(lowering.reasons), plan: null });
    }
    return lowering;
  };
  return {
    name: 'webgpu',
    limits,
    options,
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
export function lower(program, simulator, limits, options = {}) {
  const reasons = [], warnings = [], stages = {};
  const printer = createPrinter(message => { if (warnings.indexOf(message) < 0) warnings.push(message); });
  const laws = Object.create(null);
  const facts = programFacts(program);
  program.stages.forEach(stage => {
    const verdict = checkStage(stage, program, simulator, printer, laws, facts);
    stages[stage.name] = verdict.runs ? { runs: true, how: verdict.how } : { runs: false, reason: verdict.reason };
    if (verdict.warnings && verdict.warnings.length) stages[stage.name].warnings = verdict.warnings;
  });
  PHYSICS_SETTINGS.forEach(key => {
    const problem = f32Problem(program.settings[key]);
    if (problem) reasons.push(`the setting ${key}: ${problem}`);
  });
  if (program.listeners.step) warnings.push("'step' listeners run once per readback from the GPU, not after every step");

  const stagesRun = Object.keys(stages).every(name => stages[name].runs);
  let plan = null;
  if (stagesRun && reasons.length === 0) {
    plan = schedule(program, laws, limits, options);
    if (plan.refusal) {
      reasons.push(plan.refusal);
      plan = null;
    } else {
      budgets(plan, limits, reasons, printer);
      physicsStages(program).forEach(stage => { if (plan.how[stage.name]) stages[stage.name].how = plan.how[stage.name]; });
      if (reasons.length) plan = null;
    }
  }
  return { runs: stagesRun && reasons.length === 0, reasons, warnings, stages, plan };
}

// What the stages need to know about the program as a whole
function programFacts(program) {
  const columns = Object.create(null), sums = Object.create(null);
  program.columns.nodes.forEach(column => { columns[column.name] = column; });
  program.sums.forEach(sum => { sums[sum.name] = sum; });
  return { columns, sums, D: program.dims };
}

// The lowering table: what each kind of stage needs to run here
function checkStage(stage, program, simulator, printer, laws, facts) {
  if (isGuard(stage)) return runs('stops layout.step() while the GPU runs the layout');
  const columnProblem = columnsProblem(stage, facts);
  switch (stage.builtIn || stage.shape) {
    case 'clear':
    case 'drag':
      return runs('part of the step');
    case 'springs':
      return checkSprings(stage, simulator);
    case 'repulsion':
    case 'tree':
      return columnProblem ? refuse(columnProblem) : checkTree(stage, simulator, printer, laws);
    case 'integrate':
      return checkIntegrate(stage, facts);
    case 'node':
      return columnProblem ? refuse(columnProblem) : checkFormula(stage, facts, printer);
    case 'sum':
      if (stage.args.over !== 'nodes') return refuse('WebGPU does not run sums over links yet');
      if (stage.args.group) return refuse('WebGPU does not run sums per group yet');
      if (stage.args.reduce !== 'sum') return refuse(`WebGPU does not run ${stage.args.reduce} over bodies yet`);
      return columnProblem ? refuse(columnProblem) : checkFormula(stage, facts, printer);
    case 'link':
      return refuse('WebGPU does not run link formulas yet');
    case 'pair':
      return refuse('WebGPU does not run pair formulas yet');
    case 'host':
      return refuse('WebGPU does not run host steps yet');
    case 'js':
      return refuse('JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)');
    case 'pair rules':
      return refuse('pair rules are JavaScript and run on the CPU only (pair formulas do the same on every engine)');
  }
  return refuse(`WebGPU does not know stages of shape ${stage.shape}`);
}

// Columns a stage reads or writes must hold one number or D numbers per body, and a formula
// writes 32-bit floats: an integer column it writes would keep fractions it drops on the CPU
function columnsProblem(stage, facts) {
  for (const entry of stage.reads.concat(stage.writes)) {
    if (entry.space !== 'nodes') continue;
    const column = facts.columns[entry.column];
    if (!column || column.hidden) continue;
    if (column.width !== 1 && column.width !== 'D') return `WebGPU reads columns of 1 or D numbers per body; ${entry.column} has ${column.width}`;
  }
  for (const entry of stage.writes) {
    const column = entry.space === 'nodes' && facts.columns[entry.column];
    if (column && !FLOATS[column.type]) return `WebGPU does not run formulas that write the ${column.type} column ${entry.column} yet`;
  }
  return null;
}

function checkSprings(stage, simulator) {
  if (stage.args.counters) return refuse('WebGPU has no adaptive time step');
  const springs = simulator.springStore;
  for (let i = 0; i < springs.n; i++) {
    if (springs.length[i] >= 0 || springs.coefficient[i] > 0) {
      return refuse('WebGPU does not run links with their own length or stiffness yet');
    }
  }
  return runs('part of the step');
}

function checkTree(stage, simulator, printer, laws) {
  const described = stage.args.channels[0].law;
  if (described.tables.length) return refuse('WebGPU does not run laws with lookup tables yet');
  if (described.functions.length) return refuse('laws with JavaScript functions run on the CPU only');
  if (described.isDefault) {
    laws[stage.name] = null;
    return runs('part of the step');
  }
  // The law the CPU runs, compiled; its numbers as of this step
  const { law, lawValues } = simulator.stageValues(stage.name);
  try {
    emitLaw(law, 2, 'r', 'k1', 'k2', printer);
  } catch (e) {
    return refuse('the law: ' + e.message);
  }
  const values = lawValues || law.values;
  const problem = lawValueProblem(law, values);
  if (problem) return refuse(`the law's ${problem.name} is ${problem.problem}`);
  laws[stage.name] = law;
  return Object.assign(runs('part of the step'), { warnings: lawValueWarnings(law, values) });
}

function checkIntegrate(stage, facts) {
  const args = stage.args;
  if (args.integrator !== 'euler' && args.integrator !== 'fire') return refuse(`WebGPU does not know the integrator ${args.integrator}`);
  if (args.adaptiveTimeStepWeight) return refuse('WebGPU has no adaptive time step');
  const inertia = facts.columns[args.inertia];
  if (inertia && inertia.width !== 1) return refuse(`the inertia column ${args.inertia} should hold one number per body`);
  return runs('part of the step');
}

// A node formula or a sum: what it reads must run here, and its WGSL must print
function checkFormula(stage, facts, printer) {
  if (stage.tables.length) return refuse('WebGPU does not run lookup tables in formulas yet');
  const grouped = stage.sums.find(name => facts.sums[name] && facts.sums[name].group);
  if (grouped) return refuse(`WebGPU does not run sums per group yet (reads ${grouped})`);
  try {
    printFormula(stage, facts, printer);
  } catch (e) {
    return refuse(e.message);
  }
  return runs('part of the step');
}

// Prints a formula with a scope that knows every name the stage can read, to find literals and
// builtins the GPU cannot take
function printFormula(stage, facts, printer) {
  const scope = {
    D: facts.D,
    name(key) {
      const column = facts.columns[key];
      if (column && !column.hidden) {
        const width = column.width === 'D' ? facts.D : column.width;
        const codes = Array.from({ length: width }, (_, k) => `c_${key}_${k}`);
        const write = (op, value) => codes.map((code, k) => `${code} ${op} ${(value.codes || [value.code])[k]};`);
        return width === 1 ? { type: 'num', code: codes[0], write } : { type: 'vec', codes, write };
      }
      if (stage.params.some(p => p.name === key)) return { type: 'num', code: 'p_' + key };
      const sum = facts.sums[key];
      if (sum) {
        const width = sum.width === 'D' ? facts.D : sum.width;
        const codes = Array.from({ length: width }, (_, k) => `g_${key}_${k}`);
        return width === 1 ? { type: 'num', code: codes[0] } : { type: 'vec', codes };
      }
      if (stage.builtIns.indexOf(key) >= 0) return { type: 'num', code: 'b_' + key };
      return undefined;
    },
  };
  return formula.compile(stage.formula, scope, printer);
}

// Storage bindings per kernel, workgroup memory, uniform slots, buffer sizes and dispatch sizes
// against the device's limits
function budgets(plan, limits, reasons, printer) {
  const kernels = plan.kernels(printer);
  Object.keys(kernels).forEach(name => {
    const bindings = (kernels[name].match(/var<storage\b/g) || []).length;
    if (bindings > limits.maxStorageBuffersPerShaderStage) {
      reasons.push(`kernel ${name} needs ${bindings} storage buffers; this device allows ${limits.maxStorageBuffersPerShaderStage}`);
    }
  });
  if (plan.template === 'generic') {
    const tile = Math.ceil(plan.tileFloats / 4) * 16 * THREADS + (plan.sumWidth ? 16 * THREADS : 0);
    if (tile > limits.maxComputeWorkgroupStorageSize) {
      reasons.push(`the repulsion tiles need ${tile} bytes of workgroup memory (${plan.tileFloats} numbers per body); this device allows ${limits.maxComputeWorkgroupStorageSize}`);
    }
    if (plan.slot.bytes > limits.maxUniformBufferBindingSize) reasons.push(`a step needs ${plan.slot.bytes} bytes of numbers; this device allows ${limits.maxUniformBufferBindingSize} per uniform`);
  }
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
