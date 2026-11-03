import createLayout from '../../../';
// Research (round 5, dense cores): two of the four candidate fixes attach to the simulator from
// the URL; the other two are ideas in the picker (pe-1-soft-step, ps-1-calm-rattle).
//   ?calm=1        modules/calm (phys-md); ?calm.<option>= sets its options
//   ?localSteps=1  modules/localsteps (phys-astro); or a JSON of options
import calmCrowdedBodies from '../../../modules/calm/index.js';
import addLocalSteps from '../../../modules/localsteps/index.js';

const search = typeof location === 'object' ? new URLSearchParams(location.search) : new URLSearchParams();
const calm = search.get('calm');
const calmOptions = {};
search.forEach((value, key) => {
  if (!key.startsWith('calm.')) return;
  calmOptions[key.slice(5)] = Number.isFinite(Number(value)) ? Number(value) : value;
});
const localStepsParam = search.get('localSteps');

export default function createForceLayout(graph, layoutSettings) {
  // return window.ngraphCreate2dLayout(graph, Object.assign({
  let layout = createLayout(graph, Object.assign({
    dimensions: 2,
    timeStep: 0.5,
    springLength: 10,
    gravity: -12,
    springCoefficient: 0.8,
    dragCoefficient: 0.9,
    // adaptiveTimeStepWeight: 0.1,
    debug: false,
  }, layoutSettings));
  if (calm && calm !== '0') calmCrowdedBodies(layout.simulator, calmOptions);
  if (localStepsParam && localStepsParam !== '0') {
    let options = localStepsParam.startsWith('{') ? JSON.parse(localStepsParam) : {};
    layout.localSteps = addLocalSteps(layout.simulator, options);
  }
  return layout;
}
