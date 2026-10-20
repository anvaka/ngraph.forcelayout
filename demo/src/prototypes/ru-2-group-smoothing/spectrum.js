// Low end of the spectrum of the normalized Laplacian  I - D^-1/2 A D^-1/2  of one connected piece,
// by the Lanczos process with full reorthogonalization (only matrix-vector products, no dense matrix).
// Its eigenvalues are the same as those of the "average of neighbours" operator I - D^-1 A used by
// the smoothing. They lie in [0, 2]: small values belong to slow, large-scale shapes (a group as a
// whole), large values to fine detail (a node against its neighbours).

/**
 * @param {number[][]} neighbors neighbor lists (local indices) of the piece
 * @param {number} steps Lanczos steps (more steps: more accurate low eigenvalues)
 * @returns {{values: number[], max: number}} Ritz values sorted ascending, and the largest one
 */
export function normalizedLaplacianSpectrum(neighbors, steps = 120) {
  const n = neighbors.length;
  const m = Math.min(steps, n);
  const invSqrtDeg = new Float64Array(n);
  for (let i = 0; i < n; i++) invSqrtDeg[i] = 1 / Math.sqrt(neighbors[i].length);

  const basis = [];
  const alpha = new Float64Array(m), beta = new Float64Array(m);
  let v = new Float64Array(n);
  // Start orthogonal to the known eigenvector of 0 (sqrt of degrees), from a fixed pseudo-random vector
  let seed = 12345;
  for (let i = 0; i < n; i++) { seed = (seed * 1103515245 + 12345) >>> 0; v[i] = seed / 4294967296 - 0.5; }
  const zero = new Float64Array(n);
  for (let i = 0; i < n; i++) zero[i] = 1 / invSqrtDeg[i];
  orthogonalize(v, [normalize(zero)]);
  normalize(v);

  let count = 0;
  for (let k = 0; k < m; k++) {
    basis.push(v);
    // w = L v,  L = I - D^-1/2 A D^-1/2
    const w = new Float64Array(n);
    for (let i = 0; i < n; i++) {
      let s = 0;
      const nb = neighbors[i];
      for (let t = 0; t < nb.length; t++) s += invSqrtDeg[nb[t]] * v[nb[t]];
      w[i] = v[i] - invSqrtDeg[i] * s;
    }
    alpha[k] = dot(w, v);
    // full reorthogonalization against the zero eigenvector and all previous vectors (twice)
    orthogonalize(w, [zero].concat(basis));
    orthogonalize(w, [zero].concat(basis));
    count = k + 1;
    const b = Math.sqrt(dot(w, w));
    if (k === m - 1 || b < 1e-10) break;
    beta[k] = b;
    for (let i = 0; i < n; i++) w[i] /= b;
    v = w;
  }

  const d = Array.from(alpha.subarray(0, count));
  const e = Array.from(beta.subarray(0, count));
  tridiagonalEigenvalues(d, e);
  d.sort((a, b) => a - b);
  // the eigenvalue 0 itself was projected out; put it back so indices match the full spectrum
  return { values: [0].concat(d), max: d[d.length - 1] };
}

function dot(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i++) s += a[i] * b[i];
  return s;
}

function normalize(a) {
  const len = Math.sqrt(dot(a, a)) || 1;
  for (let i = 0; i < a.length; i++) a[i] /= len;
  return a;
}

function orthogonalize(w, vectors) {
  for (const q of vectors) {
    const c = dot(w, q);
    for (let i = 0; i < w.length; i++) w[i] -= c * q[i];
  }
}

// Eigenvalues of a symmetric tridiagonal matrix (diagonal d, off-diagonal e[0..n-2]), implicit QL.
function tridiagonalEigenvalues(d, e) {
  const n = d.length;
  e[n - 1] = 0;
  for (let l = 0; l < n; l++) {
    let iter = 0, m;
    do {
      for (m = l; m < n - 1; m++) {
        const dd = Math.abs(d[m]) + Math.abs(d[m + 1]);
        if (Math.abs(e[m]) <= 1e-15 * dd) break;
      }
      if (m !== l) {
        if (iter++ === 60) break;
        let g = (d[l + 1] - d[l]) / (2 * e[l]);
        let r = Math.hypot(g, 1);
        g = d[m] - d[l] + e[l] / (g + (g >= 0 ? r : -r));
        let s = 1, c = 1, p = 0, i;
        for (i = m - 1; i >= l; i--) {
          const f = s * e[i], b = c * e[i];
          e[i + 1] = (r = Math.hypot(f, g));
          if (r === 0) { d[i + 1] -= p; e[m] = 0; break; }
          s = f / r; c = g / r; g = d[i + 1] - p;
          r = (d[i] - g) * s + 2 * c * b;
          d[i + 1] = g + (p = s * r);
          g = c * r - b;
        }
        if (r === 0 && i >= l) continue;
        d[l] -= p; e[l] = g; e[m] = 0;
      }
    } while (m !== l);
  }
}
