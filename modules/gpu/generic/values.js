// The numbers of each queued step, in its slot of the ring (design section 5.4): settings, every
// stage's params and built in values as its formula sees them, gate bits, and laws' numbers, all
// from simulator.stageValues() with that step's context. A stage whose numbers cannot change
// within a call (number params, no `when`, no `step`, no function) is read once per call; when no
// stage can change, one slot serves every step of the call.
import { F32_MAX, f32Tiny, writeLawValues, lawValueProblem, lawValueWarnings } from '../wgsl/print.js';

const SETTINGS = { gravity: 'gravity', timeStep: 'timeStep', dragCoefficient: 'dragCoefficient', springLength: 'springLength', springCoefficient: 'springCoefficient' };

/**
 * `fill(count, firstStep)` gives {count, data, perStep, halt?}: `data` holds one slot per step
 * (`perStep`), or one for all of them. `count` is smaller than asked when a number of a step does
 * not fit f32; `halt` then says which and where.
 */
export function slotFiller(simulator, plan, warn, origin) {
  const floats = plan.slot.floats;
  const settingAt = Object.create(null);
  const stages = Object.create(null);
  const stageOf = name => stages[name] || (stages[name] = { name, params: [], builtIns: [], gate: undefined, law: null, lawAt: 0, dynamic: false });
  plan.slot.entries.forEach(entry => {
    if (entry.kind === 'setting') settingAt[entry.stage] = entry.index;
    else if (entry.kind === 'gate') { const s = stageOf(entry.stage); s.gate = entry.index; s.dynamic = true; }
    else if (entry.kind === 'param') stageOf(entry.stage).params.push(entry);
    else if (entry.kind === 'builtIn') {
      const s = stageOf(entry.stage);
      s.builtIns.push(entry);
      if (entry.name === 'step') s.dynamic = true;
    }
  });
  plan.sections.forEach(section => {
    const program = section.kind === 'pairs' ? section.channels : [section];
    program.forEach(part => {
      const stage = part.stage;
      if (!stages[stage.name] && !part.law) return;
      const s = stageOf(stage.name);
      if (stage.params.some(p => p.kind === 'host')) s.dynamic = true;
      if (part.law) {
        s.law = part.law;
        s.lawAt = part.values;
        const described = part.law.describe();
        if (described.params.some(p => p.kind === 'host') || (described.range && described.range.kind === 'host') || described.builtIns.indexOf('step') >= 0) s.dynamic = true;
      }
    });
  });
  const list = Object.values(stages);
  const anyDynamic = list.some(s => s.dynamic);
  let data = new Float32Array(floats * 64);

  return {
    perStep: anyDynamic,
    fill(count, firstStep) {
      const slotsNeeded = anyDynamic ? count : 1;
      if (data.length < slotsNeeded * floats) data = new Float32Array(slotsNeeded * floats);
      for (let s = 0; s < slotsNeeded; s++) {
        const at = firstStep + s;
        const context = simulator.stepContext(at);
        const slot = data.subarray(s * floats, (s + 1) * floats);
        if (s === 0) {
          writeSettings(slot, context);
        } else {
          // what does not change within a call is copied from the step before
          slot.set(data.subarray(0, floats));
        }
        for (const stage of list) {
          if (s > 0 && !stage.dynamic) continue;
          const problem = writeStage(slot, stage, context);
          if (problem) {
            return { count: s, data, perStep: anyDynamic, halt: { message: `${problem} at step ${at}`, stages: [stage.name] } };
          }
        }
      }
      return { count, data, perStep: anyDynamic };
    },
  };

  function writeSettings(slot, context) {
    const settings = context.settings;
    Object.keys(SETTINGS).forEach(key => { if (settingAt[key] !== undefined) slot[settingAt[key]] = settings[SETTINGS[key]]; });
    if (settingAt.n !== undefined) slot[settingAt.n] = context.store.n;
    for (let k = 0; k < plan.D; k++) slot[settingAt['origin_' + k]] = origin[k];
    // as the CPU's integrators: a speed limit that is not positive is 1
    if (settingAt.maxVelocity !== undefined) slot[settingAt.maxVelocity] = settings.maxVelocity > 0 ? settings.maxVelocity : 1;
  }

  // A stage's numbers for the step of `context`; returns a problem when one does not fit f32
  function writeStage(slot, stage, context) {
    const values = simulator.stageValues(stage.name, context);
    if (stage.gate !== undefined) slot[stage.gate] = values.when ? 1 : 0;
    for (const entry of stage.params) {
      const value = values.params[entry.name];
      const problem = valueProblem(value);
      if (problem) return `the parameter ${entry.name} of ${stage.name} is ${problem}`;
      if (f32Tiny(value) || (value !== 0 && Math.fround(value) === 0)) warn(`the parameter ${entry.name} of ${stage.name} is ${value}, which a 32-bit float may hold as 0`);
      slot[entry.index] = value;
    }
    for (const entry of stage.builtIns) slot[entry.index] = values.builtIns[entry.name];
    if (stage.law) {
      const numbers = values.lawValues || values.law.values;
      const problem = lawValueProblem(stage.law, numbers);
      if (problem) return `the law's ${problem.name} of ${stage.name} is ${problem.problem}`;
      lawValueWarnings(stage.law, numbers).forEach(warn);
      writeLawValues(stage.law, slot, stage.lawAt, numbers);
    }
    return null;
  }
}

function valueProblem(value) {
  if (!Number.isFinite(value) || Math.abs(value) > F32_MAX) return `${value}, which does not fit a 32-bit float`;
  return null;
}
