// From the step as data (simulator.program()) to the pyramid's channels: which tree stages walk
// together, and each one's law, charge, sensitivity and centre rule.
//
// Tree stages are the stock repulsion and addRepulsion passes. The library says which walk one
// tree (`args.walk.stages`, the K-charge quad tree); without that, tree stages next to each other
// walk together. The pyramid has no theta, so a walk is only the engine's choice of how to
// approximate; the force law is each stage's own either way.

/**
 * The walk groups of `program`: arrays of tree stages, in step order.
 */
export function walkGroups(program) {
  const groups = [];
  let run = [];
  const flush = () => { if (run.length) groups.push(run); run = []; };
  program.stages.forEach(stage => {
    if (stage.shape !== 'tree') { flush(); return; }
    const walk = stage.args.walk;
    if (run.length && walk && walk.stages.indexOf(run[0].name) < 0) flush();
    run.push(stage);
  });
  flush();
  return groups;
}

/**
 * The channels of a walk group for planPyramid(): `column(name)` gives the caller's colRef of a
 * body column; `law(stage)` the stage's compiled law (simulator.stageValues(name).law).
 * Sensitivities are given as `sensitivity` (a column name) for the section's code() and as
 * `sameColumn` when it is the charge column itself (the section then reads the sorted charge).
 */
export function walkChannels(group, { column, law }) {
  return group.map((stage, c) => {
    const described = stage.args.channels[0];
    return {
      stage: stage.name,
      law: law(stage),
      centroid: c === 0 ? 'own' : described.centroid || 'own',
      charge: column(described.charge),
      sensitivity: described.sensitivity,
      sameColumn: described.sensitivity === described.charge,
    };
  });
}
