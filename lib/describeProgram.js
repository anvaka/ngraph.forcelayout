/**
 * The step as plain data (simulator.program()), and what an engine can run of it
 * (simulator.plan()). createPhysicsSimulator.js loads this file with the first description it
 * makes, so layouts that are only stepped never load it.
 */
module.exports.clear = describeClear;
module.exports.drag = describeDrag;
module.exports.springs = describeSprings;
module.exports.integrate = describeIntegrate;
module.exports.tree = describeTree;
module.exports.stage = describeStage;
module.exports.builtInValues = builtInValues;
module.exports.program = buildProgram;
module.exports.plan = plan;

function describeClear() {
  return {
    shape: 'node', builtIn: 'clear', space: 'nodes',
    reads: [ownRow('pinned')],
    writes: [set('force'), set('springCount'), set('springLength')],
    formula: 'force = pinned != 0 ? force : 0 * force'
  };
}

function describeDrag(settings) {
  return {
    shape: 'node', builtIn: 'drag', space: 'nodes',
    reads: [ownRow('pinned'), ownRow('velocity')],
    writes: [add('force')],
    formula: 'force -= pinned == 0 ? dragCoefficient * velocity : 0 * velocity',
    builtIns: ['dragCoefficient'],
    // FIRE removes energy its own way
    args: { skipped: settings.integrator === 'fire' }
  };
}

function describeSprings(settings) {
  var counters = settings.adaptiveTimeStepWeight !== 0;
  var writes = [add('force')];
  writes[0].via = 'pull';
  if (counters) writes.push(add('springCount'), add('springLength'));
  return {
    shape: 'link', builtIn: 'springs', space: 'links',
    reads: [otherRows('pos', 'i'), otherRows('pos', 'j'), { space: 'links', column: 'length', rows: 'own' }, { space: 'links', column: 'coefficient', rows: 'own' }],
    writes: writes,
    formula: 'pull = coefficient * (r - length)',
    builtIns: ['springLength', 'springCoefficient'],
    args: { counters: counters }
  };
}

function describeIntegrate(settings) {
  var adaptive = settings.adaptiveTimeStepWeight !== 0;
  var reads = [ownRow('pinned'), ownRow('force'), ownRow('velocity'), ownRow('pos'), ownRow(settings.inertia)];
  if (adaptive) reads.push(ownRow('springCount'), ownRow('springLength'));
  return {
    shape: 'integrate', builtIn: 'integrate', space: 'nodes',
    reads: reads,
    writes: [set('velocity'), set('pos')],
    builtIns: ['timeStep', 'maxVelocity'],
    args: {
      integrator: settings.integrator, inertia: settings.inertia, maxVelocity: settings.maxVelocity,
      adaptiveTimeStepWeight: settings.adaptiveTimeStepWeight
    }
  };
}

// A tree stage: `member` is its charge in a walk (see the simulator's walk groups), `walk` the
// walk it is part of
function describeTree(builtIn, treeLaw, member, settings, walk) {
  var charge = member.charge(), sensitivity = member.sensitivity();
  // every body is pushed from its own position by the others
  var reads = [ownRow('pos'), otherRows('pos', null), otherRows(charge, null), ownRow(sensitivity), ownRow('pinned')];
  return {
    shape: 'tree', builtIn: builtIn, space: 'tree',
    reads: reads,
    writes: [add('force')],
    builtIns: ['gravity', 'theta'],
    args: {
      channels: [{ law: treeLaw.describe(), charge: charge, sensitivity: sensitivity, centroid: member.centroid }],
      theta: settings.theta, nbody: settings.nbody,
      walk: walk
    }
  };
}

function ownRow(column) { return { space: 'nodes', column: column, rows: 'own' }; }
function otherRows(column, end) {
  var entry = { space: 'nodes', column: column, rows: 'other' };
  if (end) entry.end = end;
  return entry;
}
function set(column) { return { space: 'nodes', column: column, mode: 'set' }; }
function add(column) { return { space: 'nodes', column: column, mode: 'add' }; }

// Built in values a stage reads, as formulas see them (unit with its floor, step, ...). The
// names are kept per stage, so a description is built once
function builtInValues(stage, context) {
  if (!stage.builtInNames) stage.builtInNames = describeStage(stage).builtIns;
  var out = {};
  if (stage.builtInNames.length === 0) return out;
  var BUILT_IN_VALUES = require('./formula').BUILT_IN_VALUES;
  stage.builtInNames.forEach(function (name) { out[name] = BUILT_IN_VALUES[name](context); });
  return out;
}

function describeStage(stage) {
  var described = stage.describe ? stage.describe() : { shape: 'js' };
  var entry = {
    name: stage.name,
    shape: described.shape,
    builtIn: described.builtIn || null,
    when: stage.gate ? stage.gate.describe() : described.when || null,
    space: described.space || (described.shape === 'js' || described.shape === 'pair rules' ? 'none' : described.shape),
    reads: described.reads || [],
    writes: described.writes || [],
    formula: described.formula || null,
    params: described.params || [],
    builtIns: described.builtIns || [],
    tables: described.tables || [],
    sums: described.sums || [],
    args: described.args || {}
  };
  // Add-on stages describe more of their own
  Object.keys(described).forEach(function (key) {
    if (!(key in entry) && key !== 'code') entry[key] = described[key];
  });
  return entry;
}

// `simulator` is what the simulator knows: {version, dimensions, nodes, links, settings, store,
// springStore, stages, listenerCounts}
function buildProgram(simulator) {
  var described = simulator.stages.map(describeStage);
  var dimensions = simulator.dimensions;
  var program = {
    version: simulator.version,
    dims: dimensions,
    spaces: { nodes: simulator.nodes, links: simulator.links },
    settings: {},
    columns: {
      nodes: describeColumns(simulator.store, 'nodes', described, dimensions),
      links: describeColumns(simulator.springStore, 'links', described, dimensions)
    },
    tables: [],
    sums: [],
    stages: described,
    hostSteps: [],
    listeners: {}
  };
  var settings = simulator.settings;
  Object.keys(settings).forEach(function (key) {
    var value = settings[key];
    if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') program.settings[key] = value;
  });
  described.forEach(function (stage) {
    stage.tables.forEach(function (table) {
      program.tables.push({ stage: stage.name, name: table.name, from: table.from, to: table.to, values: table.values });
    });
    if (stage.shape === 'sum') {
      program.sums.push({
        name: stage.name, over: stage.args.over, group: stage.args.group, reduce: stage.args.reduce, width: stage.args.width,
        when: stage.when
      });
    }
    if (stage.shape === 'host') program.hostSteps.push({ name: stage.name, when: stage.when, reads: stage.reads, writes: stage.writes });
  });
  var listenerCounts = simulator.listenerCounts;
  Object.keys(listenerCounts).forEach(function (event) {
    if (listenerCounts[event].length) program.listeners[event] = listenerCounts[event].length;
  });
  return program;
}

function describeColumns(columnStore, space, described, dimensions) {
  return columnStore.names().map(function (name) {
    var size = columnStore.sizeOf(name);
    var writers = [], fromStage = null, fromEngine = false;
    described.forEach(function (stage) {
      var writes = stage.writes.some(function (write) { return write.space === space && write.column === name; });
      if (!writes) return;
      writers.push(stage.name);
      if (stage.builtIn) fromEngine = true;
      else if (stage.shape !== 'host' && fromStage === null) fromStage = stage.name;
    });
    var column = {
      name: name,
      width: size === 1 ? 1 : size === dimensions ? 'D' : size,
      type: columnStore.typeOf(name),
      writer: fromEngine ? 'engine' : fromStage !== null ? 'stage:' + fromStage : 'host',
      writers: writers
    };
    // counters of the adaptive time step, which formulas do not see
    if (space === 'nodes' && (name === 'springCount' || name === 'springLength')) column.hidden = true;
    return column;
  });
}

// See simulator.plan(): `program` is the simulator's program(), `simulator` its public API
function plan(program, backend, simulator) {
  var reasons = [], warnings = programWarnings(program);
  if (!backend) warnings = warnings.concat(cpuWarnings(program));
  if (backend && backend.checkProgram) {
    var whole = backend.checkProgram(program, simulator) || [];
    if (Array.isArray(whole)) whole = { reasons: whole };
    reasons = reasons.concat(whole.reasons || []);
    warnings = warnings.concat(whole.warnings || []);
  }
  var planned = program.stages.map(function (stage) {
    var verdict = backend ? backend.check(stage, program, simulator) : { runs: true, how: cpuHow(stage) };
    var entry = { stage: stage.name, shape: stage.shape, runs: verdict.runs };
    if (verdict.runs) entry.how = verdict.how;
    else entry.reason = verdict.reason;
    if (stage.shape === 'host') entry.cost = hostCost(stage, program);
    (verdict.warnings || []).forEach(function (warning) { warnings.push(stage.name + ': ' + warning); });
    return entry;
  });
  planned.forEach(function (entry) { if (!entry.runs) reasons.push(entry.stage + ': ' + entry.reason); });
  return { backend: backend ? backend.name : 'cpu', runs: reasons.length === 0, reasons: reasons, warnings: warnings, stages: planned };
}

// Warnings for any engine: columns that only grow, host steps that run every step
function programWarnings(program) {
  var warnings = [];
  program.stages.forEach(function (stage, at) {
    if (stage.shape === 'host' && !stage.when) warnings.push(stage.name + ': a host step without `when` runs on the host every step');
    if ((stage.shape !== 'link' && stage.shape !== 'pair') || stage.builtIn || stage.when) return;
    stage.writes.forEach(function (write) {
      if (write.mode !== 'add' || write.startAtZero || write.space !== 'nodes' || write.via) return;
      var reset = program.stages.some(function (other, otherAt) {
        return otherAt !== at && other.writes.some(function (w) {
          return w.space === 'nodes' && w.column === write.column && (w.mode === 'set' || w.mode === 'host' || w.startAtZero);
        });
      });
      var message = write.column + ' only grows: ' + stage.name + ' adds into it every step and nothing sets it; list it in startAtZero';
      if (!reset && warnings.indexOf(message) < 0) warnings.push(message);
    });
  });
  return warnings;
}

// nbody picks the tree of a pass alone; passes walked together walk one quad tree, so a step
// with them costs several times a stock dual tree step
function cpuWarnings(program) {
  if (program.settings.nbody !== 'dualtree') return [];
  return program.stages.filter(function (stage) {
    var walk = stage.args && stage.args.walk;
    return walk && walk.index === 0 && walk.charges > 1;
  }).map(function (stage) {
    return "nbody 'dualtree' does not apply to tree passes walked together (" + stage.args.walk.stages.join(', ') + '): they walk one quad tree';
  });
}

// What a host step costs an engine with its own copy of the numbers
function hostCost(stage, program) {
  var numbers = 0, names = [];
  stage.reads.forEach(function (read) {
    var columns = program.columns[read.space] || [];
    for (var i = 0; i < columns.length; ++i) {
      if (columns[i].name !== read.column) continue;
      numbers += columns[i].width === 'D' ? program.dims : columns[i].width;
      names.push(read.column);
    }
  });
  var reads = names.length ? 'reads ' + names.join(', ') + ' (' + numbers + '·n numbers)' : 'reads nothing';
  var writes = stage.writes.length ? 'writes ' + stage.writes.map(function (w) { return w.column; }).join(', ') : 'writes nothing';
  return (stage.when ? 'on the steps where `when` holds: ' : 'every step: ') + reads + ', ' + writes;
}

// How the CPU runs each kind of stage, for plan()
var CPU_HOW = {
  'built in': 'built in',
  tree: 'tree walk with the law compiled in',
  node: 'generated loop over bodies', link: 'generated loop over links', sum: 'generated loop',
  pair: 'generated loop over grid neighbors', 'pair rules': 'grid neighbors, a call per pair',
  host: 'JavaScript function, inline', js: 'JavaScript function'
};

// An add-on stage may say how it runs in its description
function cpuHow(stage) {
  var walk = stage.args && stage.args.walk;
  if (walk && walk.charges > 1) {
    return walk.index === 0 ? 'one quad tree walk with ' + walk.charges + ' charges: ' + walk.stages.join(', ') :
      'in the walk of ' + walk.stages[0];
  }
  if (stage.builtIn) return CPU_HOW['built in'];
  if (typeof stage.how === 'string') return stage.how;
  return CPU_HOW[stage.shape] || 'add-on stage (' + stage.shape + ')';
}
