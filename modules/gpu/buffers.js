// Numbers between the simulator's store (f64, by row) and the device (f32). Positions go up
// relative to an f64 origin, so f32 keeps its precision wherever the layout sits: the origin is
// 0 on an axis where the drawing sits around 0 (then readbacks are a plain copy), else the
// drawing's middle. The stock grid template also renumbers large graphs along a Hilbert curve,
// so bodies close in space are close in memory; readbacks undo that on the GPU, so positions
// always come back in the store's order.

// Graphs at least this large are renumbered along a Hilbert curve (2D) or in Morton order (3D)
export const HILBERT_MIN_NODES = 4096;
// Movement is measured on about this many bodies of a large graph, in runs of MOVEMENT_RUN rows
// spread over it: one row in every k would cost a cache miss per row (twice as much on readback
// memory that was just mapped)
const MOVEMENT_SAMPLE = 16384;
const MOVEMENT_RUN = 256;

/**
 * The origin of positions on the device: per axis 0 when the drawing's middle is no farther from
 * 0 than its spread (f32 then loses at most a bit), else the middle.
 */
export function chooseOrigin(pos, n, D) {
  const origin = new Float64Array(D);
  if (!n) return origin;
  const stride = Math.max(1, Math.floor(n / 4096));
  for (let k = 0; k < D; k++) {
    const sample = [];
    for (let i = 0; i < n; i += stride) sample.push(pos[i * D + k]);
    sample.sort((a, b) => a - b);
    const q = t => sample[Math.min(sample.length - 1, Math.max(0, Math.round(t * (sample.length - 1))))];
    const middle = q(0.5), spread = q(0.999) - q(0.001);
    origin[k] = Math.abs(middle) <= Math.max(spread, 1e-3) ? 0 : middle;
  }
  return origin;
}

/**
 * Positions of the first n rows of the store, relative to `origin`, as f32.
 */
export function relativePositions(pos, n, D, origin) {
  const out = new Float32Array(n * D);
  for (let i = 0, at = 0; i < n; i++) for (let k = 0; k < D; k++, at++) out[at] = pos[at] - origin[k];
  return out;
}

/**
 * Positions read from the device (f32, relative to `origin`, in the store's order) into the store
 * as f64. Returns the CPU integrator's measure of movement per step (the squared sum over axes of
 * the summed |dx|, over the bodies), measured on a sample of a large graph. When graph edits
 * moved rows since `bodies` (the simulator's bodies when the data was read), bodies get their
 * positions wherever they are now, bodies that left are skipped, and the movement is unknown
 * (null): the store's rows are not the ones the device moved.
 */
export function writePositionsBack(simulator, bodies, data, D, origin, steps) {
  const store = simulator.store, n = bodies.length;
  if (!n) return 0;
  if (rowsMoved(simulator, bodies)) {
    for (let i = 0; i < n; i++) {
      const body = bodies[i];
      if (body.store !== store) continue;
      for (let k = 0; k < D; k++) store.pos[body.index * D + k] = origin[k] + data[i * D + k];
    }
    return null;
  }
  const pos = store.pos;
  const sums = new Float64Array(D);
  const runs = n <= MOVEMENT_SAMPLE ? 1 : Math.floor(MOVEMENT_SAMPLE / MOVEMENT_RUN);
  const gap = n / runs, length = runs === 1 ? n : MOVEMENT_RUN;
  for (let r = 0; r < runs; r++) {
    const from = Math.floor(r * gap) * D, to = from + length * D;
    for (let at = from; at < to; at += D) {
      for (let k = 0; k < D; k++) sums[k] += Math.abs(origin[k] + data[at + k] - pos[at + k]);
    }
  }
  if (origin.every(x => x === 0)) pos.set(data.subarray(0, n * D));
  else for (let i = 0, at = 0; i < n; i++) for (let k = 0; k < D; k++, at++) pos[at] = origin[k] + data[at];
  let total = 0;
  const scale = n / (runs * length) / steps;
  for (let k = 0; k < D; k++) { const t = sums[k] * scale; total += t * t; }
  return total / n;
}

/**
 * The same for positions in another order: row i's are at toInternal[i] of `data` (D numbers a
 * row). `mirror`, when given, gets the f32 numbers in the store's order in the same pass (reading
 * the readback in this order costs a cache miss per row: twice would cost twice).
 */
export function writePermutedBack(simulator, bodies, data, toInternal, origin, steps, mirror, D = 2) {
  const store = simulator.store, n = bodies.length;
  if (!n) return 0;
  const moved = rowsMoved(simulator, bodies);
  const pos = store.pos;
  const sums = new Float64Array(D);
  for (let i = 0; i < n; i++) {
    const from = D * toInternal[i];
    if (moved) {
      const body = bodies[i];
      if (body.store === store) for (let k = 0; k < D; k++) pos[D * body.index + k] = origin[k] + data[from + k];
      continue;
    }
    for (let k = 0; k < D; k++) {
      const f = data[from + k], x = origin[k] + f;
      sums[k] += Math.abs(x - pos[D * i + k]);
      pos[D * i + k] = x;
      if (mirror) mirror[D * i + k] = f;
    }
  }
  let total = 0;
  for (let k = 0; k < D; k++) { const t = sums[k] / steps; total += t * t; }
  return moved ? null : total / n;
}

/**
 * The device's order of the rows of a large layout (`toDevice[row]`), or null to keep the store's:
 * along a Hilbert curve in 2D, in Morton order in 3D, through a robust box of the positions, so
 * bodies close in space are close in memory. At 1M bodies in 2D the generic step took 1.45 times
 * today's template in the store's (random) order and 0.96 times in this one.
 */
export function bodyOrder(pos, n, D) {
  if (n < HILBERT_MIN_NODES || n >= 16777216 || (D !== 2 && D !== 3)) return null;
  if (D === 2) {
    const xs = new Float64Array(n), ys = new Float64Array(n);
    for (let i = 0; i < n; i++) { xs[i] = pos[2 * i]; ys[i] = pos[2 * i + 1]; }
    return hilbertOrder(xs, ys, robustCenter(xs, ys));
  }
  // 3D: 9 bits an axis, so a key and a row (< 2^24) fit a double exactly
  const box = [];
  const stride = Math.max(1, Math.floor(n / 4096));
  for (let k = 0; k < 3; k++) {
    const sample = [];
    for (let i = 0; i < n; i += stride) sample.push(pos[3 * i + k]);
    sample.sort((a, b) => a - b);
    const q = t => sample[Math.min(sample.length - 1, Math.max(0, Math.round(t * (sample.length - 1))))];
    box.push([q(0.001), q(0.999)]);
  }
  const side = Math.max(...box.map(([lo, hi]) => hi - lo)) || 1, N = 512;
  const keys = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let code = 0;
    for (let k = 0; k < 3; k++) {
      const c = Math.min(N - 1, Math.max(0, Math.floor((pos[3 * i + k] - box[k][0]) / side * N)));
      for (let b = 0; b < 9; b++) if (c & (1 << b)) code += 2 ** (3 * b + k);
    }
    keys[i] = code * 16777216 + i;
  }
  keys.sort();
  const out = new Uint32Array(n);
  for (let k = 0; k < n; k++) out[keys[k] % 16777216] = k;
  return out;
}

/**
 * True when graph edits moved the rows of `bodies` (rows of removed bodies were dropped since).
 */
export function rowsMoved(simulator, bodies) {
  const store = simulator.store, n = bodies.length, last = bodies[n - 1];
  return !(n === 0 || (store.n >= n && last.store === store && last.index === n - 1));
}

/**
 * The stock template's data from the store of `simulator` (2D): {n, edges, init, mass, velocity,
 * toInternal, bodies, origin}. `velocity` holds (vx, vy, 0, pinned) per body, as the template keeps
 * it, in its order; `init` the positions relative to `origin`, in its order. With `hilbert`, rows
 * are renumbered along a Hilbert curve.
 */
export function readLayout(simulator, hilbert) {
  const store = simulator.store, springs = simulator.springStore;
  const n = store.n, pos = store.pos;
  const xs = new Float64Array(n), ys = new Float64Array(n);
  for (let i = 0; i < n; i++) { xs[i] = pos[2 * i]; ys[i] = pos[2 * i + 1]; }
  // Bodies on exactly the same spot would stay in one grid cell: repeats move onto a small spiral
  separateCoincident(xs, ys);
  const robust = robustCenter(xs, ys);
  const origin = chooseOrigin(pos, n, 2);
  const toInternal = hilbert && n >= HILBERT_MIN_NODES ? hilbertOrder(xs, ys, robust) : identity(n);

  const init = new Float32Array(2 * n), mass = new Float32Array(n), velocity = new Float32Array(4 * n);
  for (let i = 0; i < n; i++) {
    const k = toInternal[i];
    init[2 * k] = xs[i] - origin[0]; init[2 * k + 1] = ys[i] - origin[1];
    mass[k] = store.mass[i];
  }
  writeVelocities(store, toInternal, velocity);

  // Springs between two different bodies; a spring from a body to itself pulls it nowhere
  const from = springs.from, to = springs.to;
  const list = [];
  for (let s = 0; s < springs.n; s++) {
    if (from[s] !== to[s]) list.push(toInternal[from[s]], toInternal[to[s]]);
  }
  return { n, edges: Uint32Array.from(list), init, mass, velocity, toInternal, permuted: n >= HILBERT_MIN_NODES && hilbert, bodies: simulator.bodies.slice(), origin };
}

/**
 * (vx, vy, 0, pinned) per body, in the template's order, from the store.
 */
export function writeVelocities(store, toInternal, out) {
  const v = store.velocity, pinned = store.pinned;
  for (let i = 0, n = toInternal.length; i < n; i++) {
    const k = 4 * toInternal[i];
    out[k] = v[2 * i]; out[k + 1] = v[2 * i + 1]; out[k + 2] = 0; out[k + 3] = pinned[i] ? 1 : 0;
  }
  return out;
}

/**
 * Masses of the store in the template's order.
 */
export function writeMasses(store, toInternal, out) {
  const mass = store.mass;
  for (let i = 0, n = toInternal.length; i < n; i++) out[toInternal[i]] = mass[i];
  return out;
}

function identity(n) {
  const out = new Uint32Array(n);
  for (let i = 0; i < n; i++) out[i] = i;
  return out;
}

// Nodes that start at exactly the same point would stay on top of each other (and pile into
// one grid cell). Every repeat of a point moves onto a golden-angle spiral around it, so
// k copies cover a disc of radius ~sqrt(k) at unit density. Deterministic: depends only on
// the node order.
function separateCoincident(xs, ys) {
  const n = xs.length;
  if (n < 2) return;
  let size = 1;
  while (size < 2 * n) size <<= 1;
  const table = new Int32Array(size).fill(-1);
  const repeats = new Uint32Array(n);
  const f = new Float64Array(2), w = new Uint32Array(f.buffer);
  for (let i = 0; i < n; i++) {
    f[0] = xs[i] + 0; f[1] = ys[i] + 0; // + 0 turns -0 into 0
    let h = (Math.imul(w[0] ^ w[1], 0x9e3779b1) ^ Math.imul(w[2] ^ w[3], 0x85ebca77)) >>> 0;
    h = (h ^ (h >>> 15)) & (size - 1);
    let first = -1;
    for (;;) {
      const j = table[h];
      if (j === -1) { table[h] = i; break; }
      if (xs[j] === xs[i] && ys[j] === ys[i]) { first = j; break; }
      h = (h + 1) & (size - 1);
    }
    if (first >= 0) {
      const k = ++repeats[first];
      const r = Math.sqrt(k), angle = k * 2.399963229728653;
      xs[i] = xs[first] + r * Math.cos(angle);
      ys[i] = ys[first] + r * Math.sin(angle);
    }
  }
}

// Median of a strided sample (the f32 origin) and a robust extent for the Hilbert curve.
function robustCenter(xs, ys) {
  const n = xs.length;
  if (!n) return { x: 0, y: 0, minX: 0, minY: 0, side: 1 };
  const stride = Math.max(1, Math.floor(n / 4096));
  const sx = [], sy = [];
  for (let i = 0; i < n; i += stride) { sx.push(xs[i]); sy.push(ys[i]); }
  const sortedX = Float64Array.from(sx).sort(), sortedY = Float64Array.from(sy).sort();
  const q = (arr, t) => arr[Math.min(arr.length - 1, Math.max(0, Math.round(t * (arr.length - 1))))];
  const minX = q(sortedX, 0.001), maxX = q(sortedX, 0.999), minY = q(sortedY, 0.001), maxY = q(sortedY, 0.999);
  return { x: q(sortedX, 0.5), y: q(sortedY, 0.5), minX, minY, side: Math.max(maxX - minX, maxY - minY) || 1 };
}

// Internal index of every node along a Hilbert curve through the start positions.
function hilbertOrder(xs, ys, box) {
  const n = xs.length, N = 4096;
  const keys = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let x = Math.min(N - 1, Math.max(0, Math.floor((xs[i] - box.minX) / box.side * N)));
    let y = Math.min(N - 1, Math.max(0, Math.floor((ys[i] - box.minY) / box.side * N)));
    let d = 0;
    for (let s = N >> 1; s > 0; s >>= 1) {
      const rx = (x & s) > 0 ? 1 : 0, ry = (y & s) > 0 ? 1 : 0;
      d += s * s * ((3 * rx) ^ ry);
      if (ry === 0) {
        if (rx === 1) { x = s - 1 - x; y = s - 1 - y; }
        const t = x; x = y; y = t;
      }
    }
    keys[i] = d * 16777216 + i; // key < 2^24, i < 2^24: exact in a double
  }
  keys.sort();
  const out = new Uint32Array(n);
  for (let k = 0; k < n; k++) out[keys[k] % 16777216] = k;
  return out;
}
