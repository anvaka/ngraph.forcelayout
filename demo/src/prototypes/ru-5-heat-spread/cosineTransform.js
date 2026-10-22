// Fast cosine transforms on a square grid, built on a radix-2 complex FFT (Makhoul's method).
// The cosines cos(pi k (i + 1/2) / N) are the eigenvectors of the five-point Laplacian on a grid
// with closed (no-flux) walls, so in this basis the heat equation is solved exactly in time:
// every coefficient just decays. N must be a power of two.

export default function createCosineTransform(N) {
  if (N & (N - 1)) throw new Error('Grid size must be a power of two');
  const re = new Float64Array(N), im = new Float64Array(N);
  const cosTw = new Float64Array(N), sinTw = new Float64Array(N); // exp(-i pi k / 2N)
  for (let k = 0; k < N; k++) {
    cosTw[k] = Math.cos(Math.PI * k / (2 * N));
    sinTw[k] = Math.sin(Math.PI * k / (2 * N));
  }
  const bits = Math.log2(N);
  const reverse = new Uint32Array(N);
  for (let i = 0; i < N; i++) {
    let r = 0;
    for (let b = 0; b < bits; b++) if (i & (1 << b)) r |= 1 << (bits - 1 - b);
    reverse[i] = r;
  }
  const rowIn = new Float64Array(N), rowOut = new Float64Array(N);

  return { forward2D, inverse2D };

  function fft(inverse) {
    for (let i = 0; i < N; i++) {
      const j = reverse[i];
      if (j > i) {
        let t = re[i]; re[i] = re[j]; re[j] = t;
        t = im[i]; im[i] = im[j]; im[j] = t;
      }
    }
    for (let size = 2; size <= N; size <<= 1) {
      const half = size >> 1, angle = (inverse ? 2 : -2) * Math.PI / size;
      const wr = Math.cos(angle), wi = Math.sin(angle);
      for (let start = 0; start < N; start += size) {
        let cr = 1, ci = 0;
        for (let k = 0; k < half; k++) {
          const a = start + k, b = a + half;
          const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
          re[b] = re[a] - tr; im[b] = im[a] - ti;
          re[a] += tr; im[a] += ti;
          const ncr = cr * wr - ci * wi;
          ci = cr * wi + ci * wr; cr = ncr;
        }
      }
    }
  }

  // X_k = sum_n x_n cos(pi k (2n + 1) / 2N)
  function dct(x, X) {
    for (let n = 0; n < N / 2; n++) {
      re[n] = x[2 * n]; re[N - 1 - n] = x[2 * n + 1];
    }
    im.fill(0);
    fft(false);
    for (let k = 0; k < N; k++) X[k] = re[k] * cosTw[k] + im[k] * sinTw[k];
  }

  // inverse of dct(): x_n = (X_0 + 2 sum_{k>0} X_k cos(pi k (2n + 1) / 2N)) / N
  function idct(X, x) {
    for (let k = 0; k < N; k++) {
      const a = X[k], b = k === 0 ? 0 : -X[N - k];
      // (a + i b) * exp(+i pi k / 2N)
      re[k] = a * cosTw[k] - b * sinTw[k];
      im[k] = a * sinTw[k] + b * cosTw[k];
    }
    fft(true);
    for (let n = 0; n < N / 2; n++) {
      x[2 * n] = re[n] / N; x[2 * n + 1] = re[N - 1 - n] / N;
    }
  }

  // 2D transforms of a row-major N x N grid (rows are y, columns are x)
  function forward2D(src, dst) { apply2D(src, dst, dct); }
  function inverse2D(src, dst) { apply2D(src, dst, idct); }

  function apply2D(src, dst, transform) {
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) rowIn[c] = src[r * N + c];
      transform(rowIn, rowOut);
      for (let c = 0; c < N; c++) dst[r * N + c] = rowOut[c];
    }
    for (let c = 0; c < N; c++) {
      for (let r = 0; r < N; r++) rowIn[r] = dst[r * N + c];
      transform(rowIn, rowOut);
      for (let r = 0; r < N; r++) dst[r * N + c] = rowOut[r];
    }
  }
}
