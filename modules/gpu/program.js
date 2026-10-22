// Reading the step as data (simulator.program()): the stages that compute physics, and the stage
// runOnGpu() adds to guard layout.step().

// The stage runOnGpu() adds so that layout.step() throws while the GPU runs the layout
export const GUARD = 'runsOnGpu';
// The stock step, in the order the CPU runs it
export const STOCK_STAGES = ['clear', 'repulsion', 'drag', 'springs', 'integrate'];

export function isGuard(stage) {
  return stage.name === GUARD && stage.shape === 'guard';
}

/**
 * The stages of `program` that compute physics: all but the guard.
 */
export function physicsStages(program) {
  return program.stages.filter(stage => !isGuard(stage));
}
