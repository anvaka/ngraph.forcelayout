// Gas pressure where nodes are crowded (2D only; in 3D it does nothing).
//
// The nodes are treated as a gas: where they are packed densely, they push outward, from dense to
// sparse, with a force proportional to how quickly the density falls off:
//
//     F_i = -kT * grad(n) / n,   evaluated at body i
//
// This is the ideal gas law P = n kT (pressure grows with density) turned into a force on each
// body. It only acts on crowding: below the target density n0 = 1 / (spacing * springLength)^2
// there is no force at all, and between n0 and 2 n0 it fades in. With the default springLength and
// gravity, graphs whose nodes end up spread wider than that (grids, meshes) end up as they would
// without it; their crowded start is still pushed apart while they unfold. With weaker repulsion
// (gravity -2) or longer springs (30), ordinary spacing already counts as crowded.
//
// The fire integrator has no drag, so there the temperature is halved. This is checked every step,
// because the demo can switch the integrator without making a new layout.
//
// The density n is measured on a grid of square cells of side h (h = springLength by default).
// Each body is spread over the 3 x 3 nearest grid points with smooth quadratic weights (they add
// up to 1 per body), so the density and its slope change smoothly as a body moves. A body does
// not feel its own share. The grid is a hash table, so far-apart pieces cost nothing extra.
//
// Known artifact: near the target density, bodies settle on the grid points, so the inside of a
// filled star shows rows and columns along the grid. A cell of 2 spring lengths, or a grid that
// moves every step, removes it, but the first leaves a hole in each star and the second shakes.
//
// Cost per step: 9 weighted deposits and 9 reads per body, O(n) whatever the crowding.
export default function createGasPressure(options = {}) {
  const stats = { cells: 0, crowded: 0 };

  // grid hash: open addressing over (x, y) cell keys, cleared lazily with a stamp
  let capacity = 0, mask = 0, keyX, keyY, stamp, value, used = 0;
  let currentStamp = 0;
  // per body: its 9 grid slots and its offset from the nearest grid point
  let slots = new Int32Array(0), offX = new Float64Array(0), offY = new Float64Array(0);

  function allocate(size) {
    capacity = size;
    mask = capacity - 1;
    keyX = new Int32Array(capacity);
    keyY = new Int32Array(capacity);
    stamp = new Int32Array(capacity);
    value = new Float64Array(capacity);
    currentStamp = 0;
  }

  function slotOf(x, y) {
    let i = (Math.imul(x, 73856093) ^ Math.imul(y, 19349663)) & mask;
    while (true) {
      if (stamp[i] !== currentStamp) {
        stamp[i] = currentStamp; keyX[i] = x; keyY[i] = y; value[i] = 0; used++;
        return i;
      }
      if (keyX[i] === x && keyY[i] === y) return i;
      i = (i + 1) & mask;
    }
  }

  return { force, stats };

  // A simulator stage: adds the push to the forces in `store`
  function force(store, simulator) {
    const settings = simulator.settings;
    if (store.D !== 2) return;
    const n = store.n;
    if (n === 0) return;
    const pos = store.pos, bodyForce = store.force, pinned = store.pinned;
    const L0 = settings.springLength;
    const h = (options.radius || 1) * L0;
    const fireScale = settings.integrator === 'fire' ? 0.5 : 1;
    const kT = fireScale * options.temperature * settings.springCoefficient * L0 * L0;
    // off for a temperature of 0, a spring length of 0, and values so large that kT overflows
    if (!(kT > 0) || !Number.isFinite(kT) || !(h > 0)) return;
    const spacing = options.spacing === undefined ? 1 : options.spacing;
    if (!(spacing > 0)) return; // a crowding spacing of 0 turns the push off
    // target density, in bodies per cell
    const rho0 = Math.pow(h / (spacing * L0), 2);
    const floor = 0.05;

    if (capacity < 4 * n) { let size = 1024; while (size < 4 * n) size <<= 1; allocate(size); }
    if (slots.length < 9 * n) { slots = new Int32Array(9 * n); offX = new Float64Array(n); offY = new Float64Array(n); }
    currentStamp += 1;
    if (currentStamp > 2e9) { stamp.fill(0); currentStamp = 1; }
    used = 0;

    // 1. spread every body over its 3 x 3 nearest grid points
    for (let i = 0; i < n; i++) {
      const u = pos[2 * i] / h, v = pos[2 * i + 1] / h;
      const base = 9 * i;
      // cell numbers must fit the hash's 32-bit keys; a body farther out (or at NaN) is left alone
      if (!(Math.abs(u) < 1e9 && Math.abs(v) < 1e9)) { slots[base] = -1; continue; }
      const gx = Math.round(u), gy = Math.round(v);
      const dx = u - gx, dy = v - gy;
      offX[i] = dx; offY[i] = dy;
      const wx0 = 0.5 * (0.5 - dx) * (0.5 - dx), wx1 = 0.75 - dx * dx, wx2 = 0.5 * (0.5 + dx) * (0.5 + dx);
      const wy0 = 0.5 * (0.5 - dy) * (0.5 - dy), wy1 = 0.75 - dy * dy, wy2 = 0.5 * (0.5 + dy) * (0.5 + dy);
      for (let b = 0; b < 3; b++) {
        const wy = b === 0 ? wy0 : b === 1 ? wy1 : wy2;
        for (let a = 0; a < 3; a++) {
          const wx = a === 0 ? wx0 : a === 1 ? wx1 : wx2;
          const s = slotOf(gx + a - 1, gy + b - 1);
          value[s] += wx * wy;
          slots[base + 3 * b + a] = s;
        }
      }
      // keep the load factor under 1/2 (a body touches at most 9 new cells)
      if (2 * used > capacity - 18) { allocate(2 * capacity); force(store, simulator); return; }
    }
    stats.cells = used;

    // 2. density of the other bodies and its slope at every body, then the push
    let crowded = 0;
    for (let i = 0; i < n; i++) {
      const base = 9 * i;
      if (slots[base] < 0) continue; // out of the grid's range
      const dx = offX[i], dy = offY[i];
      const wx0 = 0.5 * (0.5 - dx) * (0.5 - dx), wx1 = 0.75 - dx * dx, wx2 = 0.5 * (0.5 + dx) * (0.5 + dx);
      const wy0 = 0.5 * (0.5 - dy) * (0.5 - dy), wy1 = 0.75 - dy * dy, wy2 = 0.5 * (0.5 + dy) * (0.5 + dy);
      // slopes of the weights along x and y (per cell)
      const sx0 = -(0.5 - dx), sx1 = -2 * dx, sx2 = 0.5 + dx;
      const sy0 = -(0.5 - dy), sy1 = -2 * dy, sy2 = 0.5 + dy;
      let rho = 0, gradX = 0, gradY = 0;
      for (let b = 0; b < 3; b++) {
        const wy = b === 0 ? wy0 : b === 1 ? wy1 : wy2;
        const sy = b === 0 ? sy0 : b === 1 ? sy1 : sy2;
        for (let a = 0; a < 3; a++) {
          const wx = a === 0 ? wx0 : a === 1 ? wx1 : wx2;
          const sx = a === 0 ? sx0 : a === 1 ? sx1 : sx2;
          const w = wx * wy;
          const others = value[slots[base + 3 * b + a]] - w; // leave this body's own share out
          rho += w * others;
          gradX += sx * wy * others;
          gradY += wx * sy * others;
        }
      }
      if (rho <= rho0 || pinned[i]) continue;
      crowded++;
      const ramp = rho >= 2 * rho0 ? 1 : (rho - rho0) / rho0;
      const c = -kT * ramp / ((rho + floor) * h);
      const fx = c * gradX, fy = c * gradY;
      // a huge temperature or spring constant can still overflow here: never add Infinity or NaN
      if (!(Math.abs(fx) + Math.abs(fy) < Infinity)) continue;
      bodyForce[2 * i] += fx;
      bodyForce[2 * i + 1] += fy;
    }
    stats.crowded = crowded / n;
  }
}
