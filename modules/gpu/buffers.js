// Numbers between the simulator's store (f64, by row) and the device (f32). Positions go up
// relative to an f64 origin, so f32 keeps its precision wherever the layout sits: the origin is
// 0 on an axis where the drawing sits around 0 (then readbacks are a plain copy), else the
// drawing's middle. The stock grid template also renumbers large graphs along a Hilbert curve,
// so bodies close in space are close in memory; readbacks undo that on the GPU, so positions
// always come back in the store's order.

// Graphs at least this large are renumbered along a Hilbert curve (stock template)
const HILBERT_MIN_NODES = 4096;
// Movement is measured on about this many bodies of a large graph
const MOVEMENT_SAMPLE = 65536;

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
  const stride = Math.max(1, Math.floor(n / MOVEMENT_SAMPLE));
  const sums = new Float64Array(D);
  for (let i = 0; i < n; i += stride) {
    for (let k = 0; k < D; k++) sums[k] += Math.abs(origin[k] + data[i * D + k] - pos[i * D + k]);
  }
  if (origin.every(x => x === 0)) pos.set(data.subarray(0, n * D));
  else for (let i = 0, at = 0; i < n; i++) for (let k = 0; k < D; k++, at++) pos[at] = origin[k] + data[at];
  let total = 0;
  for (let k = 0; k < D; k++) { const t = sums[k] * stride / steps; total += t * t; }
  return total / n;
}

/**
 * The same for positions in another order: row i's are at toInternal[i] of `data`.
 */
export function writePermutedBack(simulator, bodies, data, toInternal, origin, steps) {
  const store = simulator.store, n = bodies.length;
  if (!n) return 0;
  const moved = rowsMoved(simulator, bodies);
  const pos = store.pos, ox = origin[0], oy = origin[1];
  let tx = 0, ty = 0;
  for (let i = 0; i < n; i++) {
    const k = 2 * toInternal[i];
    const x = ox + data[k], y = oy + data[k + 1];
    if (moved) {
      const body = bodies[i];
      if (body.store === store) { pos[2 * body.index] = x; pos[2 * body.index + 1] = y; }
      continue;
    }
    tx += Math.abs(x - pos[2 * i]); ty += Math.abs(y - pos[2 * i + 1]);
    pos[2 * i] = x; pos[2 * i + 1] = y;
  }
  tx /= steps; ty /= steps;
  return moved ? null : (tx * tx + ty * ty) / n;
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
