// Numbers between the simulator's store (f64, by row) and the device (f32, in the module's own
// order). Positions go up relative to an f64 origin near the middle of the drawing, so f32 keeps
// its precision wherever the layout sits; large graphs are renumbered along a Hilbert curve, so
// bodies close in space are close in memory. Both stay inside the module: the store keeps its
// rows and f64 positions.

// Graphs at least this large are renumbered along a Hilbert curve
const HILBERT_MIN_NODES = 4096;

/**
 * The stock templates' data from the store of `simulator` (2D): {n, edges, init, mass, velocity,
 * toInternal, bodies, origin}. `velocity` holds (vx, vy, 0, pinned) per body, as the templates
 * keep it. `bodies` is the simulator's bodies at this moment, by row, so that readbacks still find
 * them after rows move. With `hilbert`, rows are renumbered along a Hilbert curve.
 */
export function readLayout(simulator, hilbert) {
  const store = simulator.store, springs = simulator.springStore;
  const n = store.n, pos = store.pos;
  const xs = new Float64Array(n), ys = new Float64Array(n);
  for (let i = 0; i < n; i++) { xs[i] = pos[2 * i]; ys[i] = pos[2 * i + 1]; }
  // Bodies on exactly the same spot would stay in one grid cell: repeats move onto a small spiral
  separateCoincident(xs, ys);
  const robust = robustCenter(xs, ys);
  const origin = { x: robust.x, y: robust.y };
  const toInternal = hilbert && n >= HILBERT_MIN_NODES ? hilbertOrder(xs, ys, robust) : identity(n);

  const init = new Float32Array(2 * n), mass = new Float32Array(n), velocity = new Float32Array(4 * n);
  for (let i = 0; i < n; i++) {
    const k = toInternal[i];
    init[2 * k] = xs[i] - origin.x; init[2 * k + 1] = ys[i] - origin.y;
    mass[k] = store.mass[i];
  }
  writeVelocities(store, toInternal, velocity);

  // Springs between two different bodies; a spring from a body to itself pulls it nowhere
  const from = springs.from, to = springs.to;
  const list = [];
  for (let s = 0; s < springs.n; s++) {
    if (from[s] !== to[s]) list.push(toInternal[from[s]], toInternal[to[s]]);
  }
  return { n, edges: Uint32Array.from(list), init, mass, velocity, toInternal, bodies: simulator.bodies.slice(), origin };
}

/**
 * (vx, vy, 0, pinned) per body, in internal order, from the store.
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
 * Positions of the store, relative to the origin, in internal order.
 */
export function writePositions(store, layout, out) {
  const pos = store.pos, { toInternal, origin } = layout;
  for (let i = 0, n = toInternal.length; i < n; i++) {
    const k = 2 * toInternal[i];
    out[k] = pos[2 * i] - origin.x; out[k + 1] = pos[2 * i + 1] - origin.y;
  }
  return out;
}

/**
 * Masses of the store in internal order.
 */
export function writeMasses(store, layout, out) {
  const mass = store.mass, toInternal = layout.toInternal;
  for (let i = 0, n = toInternal.length; i < n; i++) out[toInternal[i]] = mass[i];
  return out;
}

/**
 * Copies positions read from the device (internal order, relative to the origin) into the store
 * as f64, and returns the CPU's measure of movement over those steps (see the library's
 * integrator: the squared sum of |dx| per axis, over the bodies), per step. When rows moved since
 * the data was read (a graph edit), the bodies of that moment get their positions wherever they
 * are now, and bodies that left the simulator are skipped.
 */
export function readPositions(simulator, layout, data, steps) {
  const store = simulator.store, { toInternal, origin, bodies } = layout;
  const n = toInternal.length;
  if (n === 0) return 0;
  const ox = origin.x, oy = origin.y;
  let tx = 0, ty = 0;
  if (!rowsMoved(simulator, layout)) {
    // rows are where they were: the usual case
    const pos = store.pos;
    for (let i = 0; i < n; i++) {
      const k = 2 * toInternal[i];
      const x = ox + data[k], y = oy + data[k + 1];
      tx += Math.abs(x - pos[2 * i]); ty += Math.abs(y - pos[2 * i + 1]);
      pos[2 * i] = x; pos[2 * i + 1] = y;
    }
  } else {
    for (let i = 0; i < n; i++) {
      const body = bodies[i];
      if (body.store !== store) continue;
      const k = 2 * toInternal[i], row = 2 * body.index;
      store.pos[row] = ox + data[k]; store.pos[row + 1] = oy + data[k + 1];
    }
  }
  tx /= steps; ty /= steps;
  return (tx * tx + ty * ty) / n;
}

/**
 * True when graph edits moved the rows of the bodies `layout` was read from (rows of removed
 * bodies were dropped since).
 */
export function rowsMoved(simulator, layout) {
  const store = simulator.store, n = layout.toInternal.length, last = layout.bodies[n - 1];
  return !(n === 0 || (store.n >= n && last.store === store && last.index === n - 1));
}

/**
 * Copies velocities read from the device ((vx, vy, 0, pinned) per body, internal order) into the
 * store, by body as readPositions() does.
 */
export function readVelocities(simulator, layout, data) {
  const store = simulator.store, { toInternal, bodies } = layout;
  for (let i = 0, n = toInternal.length; i < n; i++) {
    const body = bodies[i];
    if (body.store !== store) continue;
    const k = 4 * toInternal[i], row = 2 * body.index;
    store.velocity[row] = data[k]; store.velocity[row + 1] = data[k + 1];
  }
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
