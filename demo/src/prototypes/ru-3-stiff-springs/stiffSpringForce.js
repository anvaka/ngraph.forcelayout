// Spring stage written like the library's own (lib/codeGenerators/generateCreateSpringForce.js), in
// any number of dimensions, with one change: a stretched spring (r > L) pulls with an extra factor
// 1 + (d / (onset * L))^power. Like the stock stage it reads springLength and springCoefficient from
// the simulator settings on every step, honours per-link length and coefficient, and keeps
// springCount / springLength up to date when the adaptive time step needs them.
// Safety limit on the extra factor, so extreme settings (a tiny spring length, a huge Steepness)
// can't overflow to Infinity and turn positions into NaN. Normal settings never reach it.
const MAX_EXTRA = 1e9;

export default function createStiffSprings({ onset, power }) {
  const squared = power === 2;
  let delta = new Float64Array(0);

  return function stiffSprings(store, simulator) {
    const settings = simulator.settings;
    const springs = simulator.springStore;
    const from = springs.from, to = springs.to, restLength = springs.length, coefficients = springs.coefficient;
    const D = store.D, pos = store.pos, force = store.force;
    const springCount = store.springCount, springLength = store.springLength;
    const withStats = settings.adaptiveTimeStepWeight !== 0;
    const defaultLength = settings.springLength;
    const defaultCoefficient = settings.springCoefficient;
    if (delta.length !== D) delta = new Float64Array(D);

    for (let i = springs.n - 1; i >= 0; --i) {
      const body1 = from[i], body2 = to[i];
      const offset1 = body1 * D, offset2 = body2 * D;
      const length = restLength[i] < 0 ? defaultLength : restLength[i];
      let r2 = 0;
      for (let k = 0; k < D; ++k) {
        const d = pos[offset2 + k] - pos[offset1 + k];
        delta[k] = d;
        r2 += d * d;
      }

      if (r2 === 0) {
        // ends at the same point: pull along a random direction, as the stock springs do
        for (let k = 0; k < D; ++k) {
          const d = (simulator.random.nextDouble() - 0.5) / 50;
          delta[k] = d;
          r2 += d * d;
        }
      }
      const r = Math.sqrt(r2);

      const d = r - length;
      let pull = ((coefficients[i] > 0) ? coefficients[i] : defaultCoefficient) * d;
      // A spring of length 0 (or less) has no "spring lengths" to count stretch in: keep it stock.
      if (d > 0 && power > 0 && length > 0) {
        const u = d / (onset * length);
        let extra = squared ? u * u : Math.pow(u, power);
        if (!(extra <= MAX_EXTRA)) extra = MAX_EXTRA;
        pull *= 1 + extra;
      }
      const coefficient = pull / r;

      for (let k = 0; k < D; ++k) {
        force[offset1 + k] += coefficient * delta[k];
        force[offset2 + k] -= coefficient * delta[k];
      }
      if (withStats) {
        springCount[body1] += 1;
        springLength[body1] += r;
        springCount[body2] += 1;
        springLength[body2] += r;
      }
    }
  };
}
