// The push of "Push with a limited reach": the law of a flat world with a range, mu * K1(mu * r).
// Up close it falls as 1/r; beyond about 1/mu it dies out exponentially. (K1 is a Bessel
// function, read from a lookup table; see below.) The library compiles the law, table included,
// into both trees.

const TABLE_SIZE = 1024;
// Beyond x = mu * r = X_MAX the force is below 0.01% of its value at r = 1/mu: treat it as zero.
const X_MAX = 9;
const SCALE = TABLE_SIZE / X_MAX;

/**
 * Law for the simulator's repulsionLaw(). `reachInUnits`: distance where the push starts to fade,
 * in spring lengths; 0 means "no limit". At one spring length the push is the library's.
 */
export default function createReachLaw(reachInUnits) {
  const table = getTable();
  // 1 / where the push starts to fade, in layout units
  const mu = simulator => {
    const unit = simulator.springLength();
    return reachInUnits > 0 && unit > 0 ? 1 / (reachInUnits * unit) : 0;
  };
  return {
    // T(x) = x K1(x) goes from 1 at x = 0 to 0 at X_MAX, so c T(mu r) / r is a force of
    // c mu K1(mu r). The push is matched to the library's at one spring length, which needs a
    // spring length above 0: at 0 (the panel passes through it while you type "0.5") the push is
    // the library's 1/r^2.
    force: '(springLength > 0 ? c * T(mu * r) : 1 / r) / r',
    // The simulator interpolates the table, and uses the slope of the table's straight piece
    // under x as T's derivative (the dual tree needs it). Past X_MAX it keeps the last value, 0.
    tables: { T: { from: 0, to: X_MAX, values: table } },
    // Read every step, so the law follows the spring length
    params: {
      mu,
      // Same push as the library at r = unit: c * T(mu * unit) / unit = 1 / unit^2
      c: simulator => {
        const unit = simulator.springLength();
        return unit > 0 ? 1 / (unit * lookup(table, mu(simulator) * unit)) : 0;
      }
    }
    // Past X_MAX the law is 0. Telling the trees (range: 'X / mu') would let them skip far
    // cells, but testing every cell for it made a step about 15% slower, not faster.
  };
}

function lookup(t, x) {
  if (x >= X_MAX) return 0;
  const q = x * SCALE, i = q | 0;
  return t[i] + (t[i + 1] - t[i]) * (q - i);
}

let table = null;
// T(x) = x * K1(x) at TABLE_SIZE + 1 points from 0 to X_MAX.
function getTable() {
  if (table) return table;
  table = new Float64Array(TABLE_SIZE + 1);
  for (let i = 0; i < table.length; i++) {
    const x = (i / TABLE_SIZE) * X_MAX;
    table[i] = x === 0 ? 1 : (x >= X_MAX ? 0 : x * besselK1(x));
  }
  return table;
}

// Modified Bessel function K1, polynomial fits from Abramowitz & Stegun 9.8.3, 9.8.7, 9.8.8.
function besselI1(x) {
  const t = x / 3.75, t2 = t * t;
  return x * (0.5 + t2 * (0.87890594 + t2 * (0.51498869 + t2 * (0.15084934 + t2 * (0.02658733 + t2 * (0.00301532 + t2 * 0.00032411))))));
}

function besselK1(x) {
  if (x <= 2) {
    const y = x * x / 4;
    return Math.log(x / 2) * besselI1(x) + (1 / x) * (1 + y * (0.15443144 + y * (-0.67278579 + y * (-0.18156897 + y * (-0.01919402 + y * (-0.00110404 + y * (-0.00004686)))))));
  }
  const y = 2 / x;
  return Math.exp(-x) / Math.sqrt(x) * (1.25331414 + y * (0.23498619 + y * (-0.03655620 + y * (0.01504268 + y * (-0.00780353 + y * (0.00325614 + y * (-0.00068245)))))));
}
