// Crowding pressure on a grid (2D only).
//
// Every node drops one unit of "stuff" into the four grid cells around it. One implicit
// (always stable) step of the heat equation smooths that into a pressure field: crowded places
// get high pressure, empty places low. Each node is then pushed downhill on that field. The
// smoothing reaches about `range` units, so the push is short-range: crowds spread out, but
// things far apart stop pushing each other.
//
// The heat step is done one axis at a time. Along each grid line it is the tridiagonal system
//   -g * p[k-1] + (1 + 2g) * p[k] - g * p[k+1] = rho[k],   g = range^2 / cell^2,
// solved by a forward and a backward sweep (Thomas algorithm).

export default function createGridPressure() {
  let capacity = 0;
  let rho, sweepC, sweepD;

  return { apply };

  // Adds -strength * grad(pressure) to body.force for every body that is not pinned.
  function apply(bodies, { strength, range, cellSize, maxCells }) {
    let n = bodies.length;
    if (n === 0 || !(strength > 0) || !(range > 0)) return;

    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    for (let i = 0; i < n; ++i) {
      let pos = bodies[i].pos;
      if (pos.x < x0) x0 = pos.x;
      if (pos.x > x1) x1 = pos.x;
      if (pos.y < y0) y0 = pos.y;
      if (pos.y > y1) y1 = pos.y;
    }
    // Leave room for the pressure to fade out around the drawing.
    let margin = 3 * range;
    x0 -= margin; y0 -= margin; x1 += margin; y1 += margin;
    let cell = Math.max(cellSize, (x1 - x0) / maxCells, (y1 - y0) / maxCells);
    let width = Math.ceil((x1 - x0) / cell) + 2;
    let height = Math.ceil((y1 - y0) / cell) + 2;
    ensureCapacity(width * height, Math.max(width, height));
    rho.fill(0, 0, width * height);

    // Cloud-in-cell deposit: each node shares one unit between its 4 surrounding cells.
    let unit = 1 / (cell * cell);
    for (let i = 0; i < n; ++i) {
      let pos = bodies[i].pos;
      let gx = (pos.x - x0) / cell, gy = (pos.y - y0) / cell;
      let ix = Math.floor(gx), iy = Math.floor(gy);
      let fx = gx - ix, fy = gy - iy;
      let o = iy * width + ix;
      rho[o] += (1 - fx) * (1 - fy) * unit;
      rho[o + 1] += fx * (1 - fy) * unit;
      rho[o + width] += (1 - fx) * fy * unit;
      rho[o + width + 1] += fx * fy * unit;
    }

    // One implicit heat step with time step range^2, split into x and y sweeps (in place).
    let g = (range * range) / (cell * cell);
    sweepLines(rho, width, height, 1, width, g);
    sweepLines(rho, height, width, width, 1, g);

    // Push each node downhill, using the gradient of the same bilinear interpolation.
    for (let i = 0; i < n; ++i) {
      let body = bodies[i];
      if (body.isPinned) continue;
      let pos = body.pos;
      let gx = (pos.x - x0) / cell, gy = (pos.y - y0) / cell;
      let ix = Math.floor(gx), iy = Math.floor(gy);
      let fx = gx - ix, fy = gy - iy;
      let o = iy * width + ix;
      let p00 = rho[o], p10 = rho[o + 1], p01 = rho[o + width], p11 = rho[o + width + 1];
      let dpx = ((p10 - p00) * (1 - fy) + (p11 - p01) * fy) / cell;
      let dpy = ((p01 - p00) * (1 - fx) + (p11 - p10) * fx) / cell;
      body.force.x -= strength * dpx;
      body.force.y -= strength * dpy;
    }
  }

  function ensureCapacity(cells, lineLength) {
    if (cells > capacity) {
      capacity = Math.max(cells, capacity * 2);
      rho = new Float64Array(capacity);
    }
    if (!sweepC || sweepC.length < lineLength) {
      sweepC = new Float64Array(lineLength * 2);
      sweepD = new Float64Array(lineLength * 2);
    }
  }

  // Solves the tridiagonal system along `count` lines of `length` points each. Points of a line
  // are `step` apart in the array, and lines start `lineStep` apart. Values outside the grid
  // are zero.
  function sweepLines(u, length, count, step, lineStep, g) {
    let a = -g, b = 1 + 2 * g;
    let c = sweepC, d = sweepD;
    for (let line = 0; line < count; ++line) {
      let base = line * lineStep;
      c[0] = a / b;
      d[0] = u[base] / b;
      for (let k = 1; k < length; ++k) {
        let m = b - a * c[k - 1];
        c[k] = a / m;
        d[k] = (u[base + k * step] - a * d[k - 1]) / m;
      }
      u[base + (length - 1) * step] = d[length - 1];
      for (let k = length - 2; k >= 0; --k) {
        u[base + k * step] = d[k] - c[k] * u[base + (k + 1) * step];
      }
    }
  }
}
