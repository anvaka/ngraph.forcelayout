// 2D spring force, written like the one lib/codeGenerators/generateCreateSpringForce.js generates,
// with one change: a stretched spring (r > L) pulls with an extra factor 1 + (d / (onset * L))^power.
// Like the stock force it reads springLength and springCoefficient from the simulator settings on
// every step, honours per-link length and coefficient, and keeps springCount / springLength up to
// date for the adaptive time step.
// Safety limit on the extra factor, so extreme settings (a tiny spring length, a huge Steepness)
// can't overflow to Infinity and turn positions into NaN. Normal settings never reach it.
const MAX_EXTRA = 1e9;

export default function createStiffSpringForce(simulator, { onset, power }) {
  const settings = simulator.settings;
  const random = simulator.random;
  const squared = power === 2;

  return function stiffSpringForce() {
    const springs = simulator.springs;
    const defaultLength = settings.springLength;
    const defaultCoefficient = settings.springCoefficient;

    for (let i = springs.length - 1; i >= 0; --i) {
      const spring = springs[i];
      const body1 = spring.from;
      const body2 = spring.to;
      const length = spring.length < 0 ? defaultLength : spring.length;
      let dx = body2.pos.x - body1.pos.x;
      let dy = body2.pos.y - body1.pos.y;
      let r = Math.sqrt(dx * dx + dy * dy);

      if (r === 0) {
        dx = (random.nextDouble() - 0.5) / 50;
        dy = (random.nextDouble() - 0.5) / 50;
        r = Math.sqrt(dx * dx + dy * dy);
      }

      const d = r - length;
      let pull = ((spring.coefficient > 0) ? spring.coefficient : defaultCoefficient) * d;
      // A spring of length 0 (or less) has no "spring lengths" to count stretch in: keep it stock.
      if (d > 0 && power > 0 && length > 0) {
        const u = d / (onset * length);
        let extra = squared ? u * u : Math.pow(u, power);
        if (!(extra <= MAX_EXTRA)) extra = MAX_EXTRA;
        pull *= 1 + extra;
      }
      const coefficient = pull / r;

      body1.force.x += coefficient * dx;
      body1.force.y += coefficient * dy;
      body1.springCount += 1;
      body1.springLength += r;

      body2.force.x -= coefficient * dx;
      body2.force.y -= coefficient * dy;
      body2.springCount += 1;
      body2.springLength += r;
    }
  };
}
