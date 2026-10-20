// Spreads the crowded parts of a finished drawing inside its own frame.
//
// In plain words: lay a grid over the picture and count how many nodes fall into each cell
// (the density). Cells more crowded than `crowding` times the average act like places of high
// pressure, and the pressure pushes nodes out of them, the way a gas spreads from high pressure
// to low. The frame is a closed box: nothing flows out of it. The push is smooth, so the picture
// is stretched like a rubber sheet and no node changes its neighbours.
//
// The pressure phi solves Poisson's equation in the frame, with no flow through its sides:
//     Lap(phi) = s,  s = max(rho - crowding * mean, 0) - (average of that over the frame),
// and nodes move with velocity grad(phi) / rho. With that velocity, every cell loses the
// nodes it has above the limit at a steady rate (continuity: d rho/dt = -div(rho v) = -s).
//
// Source: A. A. Samarskii, A. V. Gulin, «Численные методы» (1989), ch. 5 of the difference
// schemes part. Poisson's equation in a rectangle is its model problem (p. 379, eq. 2), and it
// is solved there by direct methods: written as one equation per grid column (p. 413, eq. 9),
// the operator along x is diagonalised by its exact eigenvectors (here cosines, because nothing
// flows through the sides), which leaves one tridiagonal system along y per mode, solved by the
// sweep ("progonka", p. 414-415). With an FFT this costs O(M^2 log M), like the book's reduction
// method (p. 425); the plain cosine sums used below cost O(M^3), a few milliseconds for M = 128.

/**
 * @param {Float64Array} xs node x coordinates, changed in place
 * @param {Float64Array} ys node y coordinates, changed in place
 * @param {object} options
 *   crowding   only density above crowding * average pushes (2)
 *   passes     how many passes step() runs before it reports done (40)
 *   grid       cells per side of the grid (about 1.5 * sqrt(n), at most 128)
 *   movable    Uint8Array, 0 for nodes that must not move (pinned)
 *   piece      Int32Array, piece (connected component) id of every node
 *   pieceSize  Int32Array, nodes in every piece
 *   rigidBelow pieces with fewer nodes move as a whole, keeping their shape (30)
 */
export default function createDensityFlow(xs, ys, options = {}) {
  const n = xs.length;
  const crowding = options.crowding > 0 ? options.crowding : 2;
  const passes = Math.max(0, Math.round(options.passes === undefined ? 40 : options.passes));
  const M = options.grid || Math.max(16, Math.min(128, Math.round(1.5 * Math.sqrt(n))));
  const movable = options.movable || null;
  const piece = options.piece || null, pieceSize = options.pieceSize || null;
  const rigidBelow = options.rigidBelow === undefined ? 30 : options.rigidBelow;
  const tau = 0.25; // fraction of the excess removed per pass
  const maxCells = 1; // no node moves more than one grid cell per pass

  // The frame: the square that "fit to screen" would show, kept fixed while nodes move
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (let i = 0; i < n; i++) {
    if (xs[i] < x0) x0 = xs[i];
    if (xs[i] > x1) x1 = xs[i];
    if (ys[i] < y0) y0 = ys[i];
    if (ys[i] > y1) y1 = ys[i];
  }
  const side = Math.max(x1 - x0, y1 - y0, 1e-9) * 1.0001;
  const fx0 = (x0 + x1) / 2 - side / 2, fy0 = (y0 + y1) / 2 - side / 2;
  const h = side / M;
  const mean = n / (M * M);

  // cosT[k * M + i] = cos(pi * k * (i + 1/2) / M): eigenvectors of the second difference with
  // no flow through the ends; lam[k] are minus its eigenvalues
  const cosT = new Float64Array(M * M), lam = new Float64Array(M);
  for (let k = 0; k < M; k++) {
    lam[k] = 4 * Math.sin(Math.PI * k / (2 * M)) ** 2;
    for (let i = 0; i < M; i++) cosT[k * M + i] = Math.cos(Math.PI * k * (i + 0.5) / M);
  }
  const rho = new Float64Array(M * M), tmp = new Float64Array(M * M);
  const hat = new Float64Array(M * M), phi = new Float64Array(M * M);
  const gx = new Float64Array(M * M), gy = new Float64Array(M * M);
  const alpha = new Float64Array(M), beta = new Float64Array(M), column = new Float64Array(M);
  const dx = new Float64Array(n), dy = new Float64Array(n);
  const pieceCount = pieceSize ? pieceSize.length : 0;
  const pieceDx = new Float64Array(pieceCount), pieceDy = new Float64Array(pieceCount), pieceMovable = new Float64Array(pieceCount);
  let largest = -1;
  for (let c = 0; c < pieceCount; c++) if (largest < 0 || pieceSize[c] > pieceSize[largest]) largest = c;

  let done = 0;
  return { step, gridSize: M };

  // One pass of the flow. Returns true when all passes are done.
  function step() {
    if (done >= passes) return true;
    countNodes();
    blur(); blur();
    if (!solvePressure()) { done = passes; return true; } // nothing is crowded
    pressureGradient();
    moveNodes();
    done += 1;
    return done >= passes;
  }

  // Density: every node adds 1, shared between the 4 nearest cell centres
  function countNodes() {
    rho.fill(0);
    for (let i = 0; i < n; i++) {
      const u = (xs[i] - fx0) / h - 0.5, w = (ys[i] - fy0) / h - 0.5;
      const i0 = Math.floor(u), j0 = Math.floor(w), fu = u - i0, fw = w - j0;
      const a0 = clampCell(i0), a1 = clampCell(i0 + 1), b0 = clampCell(j0), b1 = clampCell(j0 + 1);
      rho[b0 * M + a0] += (1 - fu) * (1 - fw);
      rho[b0 * M + a1] += fu * (1 - fw);
      rho[b1 * M + a0] += (1 - fu) * fw;
      rho[b1 * M + a1] += fu * fw;
    }
  }

  // Smooths the counts with weights 1/4, 1/2, 1/4 along x and then y; keeps the total
  function blur() {
    for (let j = 0; j < M; j++) {
      const row = j * M;
      for (let i = 0; i < M; i++) {
        tmp[row + i] = 0.25 * rho[row + Math.max(0, i - 1)] + 0.5 * rho[row + i] + 0.25 * rho[row + Math.min(M - 1, i + 1)];
      }
    }
    for (let j = 0; j < M; j++) {
      const down = Math.max(0, j - 1) * M, up = Math.min(M - 1, j + 1) * M, row = j * M;
      for (let i = 0; i < M; i++) rho[row + i] = 0.25 * tmp[down + i] + 0.5 * tmp[row + i] + 0.25 * tmp[up + i];
    }
  }

  // Lap(phi) = source, no flow through the frame. Returns false if no cell is over the limit.
  function solvePressure() {
    const limit = crowding * mean;
    let excess = 0;
    for (let c = 0; c < M * M; c++) {
      const over = rho[c] > limit ? rho[c] - limit : 0;
      tmp[c] = over;
      excess += over;
    }
    if (excess <= 1e-9 * n) return false;
    excess /= M * M;
    for (let c = 0; c < M * M; c++) tmp[c] -= excess;

    // Along x: cosine coefficients of every row
    for (let j = 0; j < M; j++) {
      const row = j * M;
      for (let k = 0; k < M; k++) {
        const ck = k * M;
        let sum = 0;
        for (let i = 0; i < M; i++) sum += tmp[row + i] * cosT[ck + i];
        hat[row + k] = sum;
      }
    }
    // Along y, for every cosine mode k: phi[j-1] - (2 + lam[k]) phi[j] + phi[j+1] = hat[j],
    // first and last rows with one neighbour (no flow through the frame). Sweep (progonka):
    // phi[j] = alpha[j] * phi[j+1] + beta[j], forward to find alpha, beta, then back.
    for (let k = 0; k < M; k++) {
      // the k = 0 mode is only defined up to a constant; a tiny shift makes it unique
      const shift = k === 0 ? 1e-6 : 0;
      for (let j = 0; j < M; j++) column[j] = hat[j * M + k];
      let diagonal = 1 + lam[k] + shift;
      alpha[0] = 1 / diagonal;
      beta[0] = -column[0] / diagonal;
      for (let j = 1; j < M; j++) {
        diagonal = (j === M - 1 ? 1 : 2) + lam[k] + shift;
        const denominator = diagonal - alpha[j - 1];
        alpha[j] = 1 / denominator;
        beta[j] = (beta[j - 1] - column[j]) / denominator;
      }
      column[M - 1] = beta[M - 1];
      for (let j = M - 2; j >= 0; j--) column[j] = alpha[j] * column[j + 1] + beta[j];
      for (let j = 0; j < M; j++) hat[j * M + k] = column[j];
    }
    // Back from cosine coefficients to values along x
    for (let j = 0; j < M; j++) {
      const row = j * M;
      for (let i = 0; i < M; i++) {
        let sum = hat[row];
        for (let k = 1; k < M; k++) sum += 2 * hat[row + k] * cosT[k * M + i];
        phi[row + i] = sum / M;
      }
    }
    return true;
  }

  function pressureGradient() {
    for (let j = 0; j < M; j++) {
      const row = j * M, down = Math.max(0, j - 1) * M, up = Math.min(M - 1, j + 1) * M;
      for (let i = 0; i < M; i++) {
        gx[row + i] = (phi[row + Math.min(M - 1, i + 1)] - phi[row + Math.max(0, i - 1)]) / 2;
        gy[row + i] = (phi[up + i] - phi[down + i]) / 2;
      }
    }
  }

  function moveNodes() {
    for (let i = 0; i < n; i++) {
      const u = (xs[i] - fx0) / h - 0.5, w = (ys[i] - fy0) / h - 0.5;
      const density = Math.max(sample(rho, u, w), 0.05 * mean);
      let mx = tau * sample(gx, u, w) / density, my = tau * sample(gy, u, w) / density; // in cells
      const length = Math.hypot(mx, my);
      if (length > maxCells) { mx *= maxCells / length; my *= maxCells / length; }
      dx[i] = mx * h;
      dy[i] = my * h;
    }
    if (piece) {
      // Small separate pieces move as a whole: every node gets the piece's average move
      pieceDx.fill(0); pieceDy.fill(0); pieceMovable.fill(0);
      for (let i = 0; i < n; i++) {
        if (movable && !movable[i]) continue;
        const c = piece[i];
        pieceDx[c] += dx[i]; pieceDy[c] += dy[i]; pieceMovable[c] += 1;
      }
      for (let i = 0; i < n; i++) {
        const c = piece[i];
        if (c === largest || pieceSize[c] >= rigidBelow || !pieceMovable[c]) continue;
        dx[i] = pieceDx[c] / pieceMovable[c];
        dy[i] = pieceDy[c] / pieceMovable[c];
      }
    }
    for (let i = 0; i < n; i++) {
      if (movable && !movable[i]) continue;
      xs[i] = Math.min(fx0 + side, Math.max(fx0, xs[i] + dx[i]));
      ys[i] = Math.min(fy0 + side, Math.max(fy0, ys[i] + dy[i]));
    }
  }

  // Bilinear interpolation of a grid field at cell coordinates (u, w)
  function sample(field, u, w) {
    const i0 = Math.floor(u), j0 = Math.floor(w), fu = u - i0, fw = w - j0;
    const a0 = clampCell(i0), a1 = clampCell(i0 + 1), b0 = clampCell(j0) * M, b1 = clampCell(j0 + 1) * M;
    return (1 - fu) * (1 - fw) * field[b0 + a0] + fu * (1 - fw) * field[b0 + a1] +
      (1 - fu) * fw * field[b1 + a0] + fu * fw * field[b1 + a1];
  }

  function clampCell(c) {
    return c < 0 ? 0 : c > M - 1 ? M - 1 : c;
  }
}
