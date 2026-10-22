// What this module can run, for the library's `simulator.plan(backend)`, decided without a device:
// from the step as data (simulator.program()), the store's columns, and a capability profile
// (the device's limits).
//
//   const plan = layout.simulator.plan(gpuCapabilities());    // WebGPU's default limits
//   plan.runs; plan.reasons;   // ['personalSpace: WebGPU does not run pair formulas yet', ...]
//
// One lowering decides both what plan() says and what runOnGpu() builds (lower() below), so a
// "runs" verdict is the plan the runner compiles. It runs, in any number of dimensions:
//  - node formulas, sums over bodies (global, or per group of a column the host sets), and link
//    formulas (that pull, add into body columns, or set their own link's columns), in CPU stage
//    order;
//  - the stock repulsion and extra passes (addRepulsion), with any law the printer accepts and
//    any charge and sensitivity columns: exact pairs up to 1,024 bodies, the generic grid pyramid
//    above in 2D and 3D (exact pairs up to 16,384 bodies in 4 or more dimensions); the exact
//    stock step in 2D above 1,024 bodies keeps today's grid kernels (the stock template);
//  - drag, the stock springs with the links' own lengths and stiffness, Euler or FIRE with any
//    inertia column;
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
  const warn = message => { if (warnings.indexOf(message) < 0) warnings.push(message); };
  const printer = createPrinter(warn);
  const laws = Object.create(null);
  const facts = programFacts(program);
  const data = storeFacts(program, simulator);
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
    plan = schedule(program, laws, limits, Object.assign({}, options, { warn, data }));
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
  const columns = Object.create(null), sums = Object.create(null), links = Object.create(null);
  program.columns.nodes.forEach(column => { columns[column.name] = column; });
  (program.columns.links || []).forEach(column => { links[column.name] = column; });
  program.sums.forEach(sum => { sums[sum.name] = sum; });
  return { columns, links, sums, D: program.dims };
}

// What a plan needs to know of the store's numbers: whether any link has its own length or
// stiffness (the stock template runs only while none has), the most links of one body, and how
// many groups each column that sums are grouped by has (the largest id + 1, as on the CPU)
function storeFacts(program, simulator) {
  const springs = simulator.springStore;
  let linksDefault = true;
  for (let i = 0; i < springs.n && linksDefault; i++) {
    if (springs.length[i] >= 0 || springs.coefficient[i] > 0) linksDefault = false;
  }
  // the most links one body has: hubs make gathers go through chunks of links
  const degree = new Uint32Array(simulator.store.n);
  let maxDegree = 0;
  for (let s = 0; s < springs.n; s++) {
    const a = ++degree[springs.from[s]], b = ++degree[springs.to[s]];
    if (a > maxDegree) maxDegree = a;
    if (b > maxDegree) maxDegree = b;
  }
  const groups = {};
  program.sums.forEach(sum => {
    if (!sum.group || groups[sum.group] !== undefined || sum.over !== 'nodes') return;
    const column = simulator.store[sum.group];
    let largest = -1;
    for (let i = 0; column && i < simulator.store.n; i++) {
      const g = column[i];
      if (g >= 0 && Math.floor(g) > largest) largest = Math.floor(g);
    }
    groups[sum.group] = largest + 1;
  });
  return { linksDefault, maxDegree, groups };
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
      return stage.args.counters ? refuse('WebGPU has no adaptive time step') : runs('part of the step');
    case 'repulsion':
    case 'tree':
      return columnProblem ? refuse(columnProblem) : checkTree(stage, simulator, printer, laws);
    case 'integrate':
      return checkIntegrate(stage, facts);
    case 'node':
      return columnProblem ? refuse(columnProblem) : checkFormula(stage, facts, printer);
    case 'sum':
      if (stage.args.over !== 'nodes') return refuse('WebGPU does not run sums over links yet');
      if (stage.args.reduce !== 'sum') return refuse(`WebGPU does not run ${stage.args.reduce} over bodies yet`);
      if (stage.args.group) {
        const group = facts.columns[stage.args.group];
        if (!group || group.writer !== 'host') return refuse('WebGPU runs sums per group only with group ids set by the host');
      }
      return columnProblem ? refuse(columnProblem) : checkFormula(stage, facts, printer);
    case 'link':
      return columnProblem ? refuse(columnProblem) : checkLink(stage, facts, printer);
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
  try {
    printFormula(stage, facts, printer);
  } catch (e) {
    return refuse(e.message);
  }
  return runs('part of the step');
}

// A link formula: one that moves bodies (pull, or adds into body columns) is evaluated at both
// ends of every link, one that only writes link columns by a thread per link; one kernel cannot
// do both yet
function checkLink(stage, facts, printer) {
  if (stage.args.counters) return refuse('WebGPU has no adaptive time step');
  if (stage.tables.length) return refuse('WebGPU does not run lookup tables in formulas yet');
  const moves = stage.writes.some(write => write.via === 'pull' || (write.space === 'nodes' && write.end));
  const linkWrites = stage.writes.filter(write => write.space === 'links');
  if (moves && linkWrites.length) return refuse('WebGPU does not run link formulas that both move bodies and write link columns yet');
  for (const write of linkWrites) {
    const column = facts.links[write.column];
    if (column && !FLOATS[column.type]) return refuse(`WebGPU does not run formulas that write the ${column.type} link column ${write.column} yet`);
  }
  try {
    printFormula(stage, facts, printer, true);
  } catch (e) {
    return refuse(e.message);
  }
  return runs('part of the step');
}

// Prints a formula with a scope that knows every name the stage can read, to find literals and
// builtins the GPU cannot take. A link formula (`link`) knows r, pull, the link's values and
// columns, and body columns at either end (name_i, name_j).
function printFormula(stage, facts, printer, link) {
  const value = (codes, write) => (codes.length === 1 ? { type: 'num', code: codes[0], write } : { type: 'vec', codes, write });
  const columnValue = (name, key) => {
    const column = facts.columns[name];
    if (!column || column.hidden) return undefined;
    const width = column.width === 'D' ? facts.D : column.width;
    const codes = Array.from({ length: width }, (_, k) => `c_${key}_${k}`);
    return value(codes, (op, v) => codes.map((code, k) => `${code} ${op} ${(v.codes || [v.code])[k]};`));
  };
  const write = code => (op, v) => [`${code} ${op} ${v.code};`];
  const scope = {
    D: facts.D,
    name(key) {
      if (link) {
        if (key === 'r' || key === 'length' || key === 'coefficient' || key === 'pull' || facts.links[key]) return { type: 'num', code: 'l_' + key, write: write('l_' + key) };
        const end = /^(.+)_([ij])$/.exec(key);
        if (end) return columnValue(end[1], key);
      } else {
        const column = columnValue(key, key);
        if (column) return column;
      }
      if (stage.params.some(p => p.name === key)) return { type: 'num', code: 'p_' + key };
      const sum = facts.sums[key];
      if (sum) {
        const width = sum.width === 'D' ? facts.D : sum.width;
        const codes = Array.from({ length: width }, (_, k) => `g_${key}_${k}`);
        return sum.group ? { index: () => value(codes) } : value(codes);
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
