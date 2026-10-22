// Does this device keep the grid's exact arithmetic? The grid field's numbers stay within 1e-6 of
// the CPU's because of two barriers that the compiler must not see through (wgsl.js):
//  - grid_opq (XOR with a uniform zero): two-sums, and grid coordinates exact however far from
//    the origin. Without it, grids 1,024 cells wide were off by 1e-4.
//  - grid_hold (XOR with a zero from a buffer): the refinement's residual. Without it, refinement
//    made the field far worse, up to 0.5 relative error in 3D.
// Metal keeps both today; another compiler (Dawn on Vulkan or D3D, a later Metal, a driver that
// specializes on values) might not, and the field would be wrong without a word. So once per
// device, on known numbers, the kernels below must give the exact answers:
//
//   const exact = await gridArithmetic(device);   // {sums, residual, reason}
//
// planGrid() refuses what needs the arithmetic a device does not keep (see plan.js).
import { getPipeline } from '../device.js';
import { gridCanaryKernels, META } from './wgsl.js';

const checked = new WeakMap();

/**
 * {sums, residual, reason, numbers} for `device`, checked once (later calls get the same
 * promise). `sums`: two-sums and grid coordinates are exact; `residual`: the refinement's residual
 * is. `reason` says what failed, in plain words; `numbers` are the errors measured.
 * `opaque: false` checks kernels without their barriers (tests: both must then fail); it is not
 * cached.
 */
export function gridArithmetic(device, { opaque = true } = {}) {
  if (!opaque) return run(device, opaque);
  if (!checked.has(device)) checked.set(device, run(device, opaque));
  return checked.get(device);
}

async function run(device, opaque) {
  const owned = [];
  try {
    const kernels = gridCanaryKernels({ opaque });
    const pipes = {};
    await Promise.all(Object.entries(kernels).map(async ([name, kernel]) => {
      pipes[name] = await getPipeline(device, { code: kernel.code, label: name, bindings: kernel.bindings.map(b => b.kind) });
    }));
    const buffer = (data, usage) => {
      const b = device.createBuffer({ size: Math.max(16, Math.ceil(data.byteLength / 16) * 16), usage: usage | GPUBufferUsage.COPY_DST });
      owned.push(b);
      device.queue.writeBuffer(b, 0, data);
      return b;
    };
    const SB = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC;
    const read = async (src, bytes) => {
      const dst = device.createBuffer({ size: bytes, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      owned.push(dst);
      const enc = device.createCommandEncoder();
      enc.copyBufferToBuffer(src, 0, dst, 0, bytes);
      device.queue.submit([enc.finish()]);
      await dst.mapAsync(GPUMapMode.READ);
      const out = new Float32Array(dst.getMappedRange().slice(0));
      dst.unmap();
      return out;
    };
    const dispatch = (name, entries, groups) => {
      const enc = device.createCommandEncoder();
      const pass = enc.beginComputePass();
      pass.setPipeline(pipes[name]);
      pass.setBindGroup(0, device.createBindGroup({ layout: pipes[name].getBindGroupLayout(0), entries: entries.map((b, binding) => ({ binding, resource: { buffer: b } })) }));
      pass.dispatchWorkgroups(groups);
      pass.end();
      device.queue.submit([enc.finish()]);
    };

    const sums = await checkSums(buffer, read, dispatch, SB);
    const residuals = [];
    for (const D of [2, 3]) residuals.push(await checkResidual(D, buffer, read, dispatch, SB));
    const residual = residuals.every(r => r.ok);
    const reasons = [];
    if (!sums.ok) reasons.push('its two-sums or grid coordinates are not exact');
    if (!residual) reasons.push('the smoothing\'s residual is not exact');
    return {
      sums: sums.ok, residual,
      reason: reasons.length ? `this GPU's compiler sees through the grid's exact arithmetic: ${reasons.join(', and ')}` : null,
      numbers: { sumError: sums.sumError, quotientError: sums.quotientError, offsetError: sums.offsetError, residualError: residuals.map(r => r.error) },
    };
  } catch (e) {
    return { sums: false, residual: false, reason: 'the check of the grid\'s exact arithmetic could not run on this GPU: ' + e.message, numbers: null };
  } finally {
    owned.forEach(b => b.destroy());
  }
}

const f32 = Math.fround;
const bits = x => new Uint32Array(new Float32Array([x]).buffer)[0];

// Two-sums, a quotient in hi + lo, and the offsets of bodies 18,000 cells from the origin, against
// f64
async function checkSums(buffer, read, dispatch, SB) {
  // a + b with b below half an ulp of a: the sum is a, its error term b exactly (0 when folded)
  const C = new Float32Array(16 + 4 * 16);
  C[0] = 1; C[1] = f32(1.5 * Math.pow(2, -26));
  const x = 1000.3, k = 1024;
  C[4] = f32(x); C[5] = f32(x - C[4]); C[6] = k;
  // a 2D box: the cell 0.7 as hi + lo, its corner far from the origin as MA cell + RA
  const hi = f32(0.7), lo = f32(0.7 - hi), cell = hi + lo;
  const corner = [12345.678, -9876.54];
  const meta = new Uint32Array(META.TABLE);
  meta[META.CELL] = bits(hi); meta[META.CELL_LOW] = bits(lo);
  const MA = [], RA = [];
  for (let a = 0; a < 2; a++) {
    MA.push(Math.floor(corner[a] / cell));
    RA.push(f32(corner[a] - MA[a] * cell));
    meta[META.MA + a] = bits(MA[a]); meta[META.RA + a] = bits(RA[a]);
    meta[META.SIZE + a] = 4096;
  }
  // bodies at whole cells plus a fraction from the corner, up to 2,047 cells out
  const whole = [0, 3, 40, 500, 1000, 2047, 7, 1500, 250, 64, 1999, 12, 777, 1234, 333, 1800];
  const parts = [0.25, 0.5, 0.71, 0.13, 0.9, 0.37, 0.61, 0.07, 0.83, 0.44, 0.19, 0.66, 0.31, 0.58, 0.12, 0.95];
  const n = whole.length;
  const X = new Float32Array(2 * n);
  for (let i = 0; i < n; i++) {
    X[2 * i] = f32(corner[0] + (whole[i] + parts[i]) * cell);
    X[2 * i + 1] = f32(corner[1] + (whole[n - 1 - i] + parts[(i + 5) % n]) * cell);
  }
  const U = new Uint32Array([n, 0, 0, 0, 0, 0, 0, 0]);
  const out = buffer(C, SB);
  dispatch('SUMS', [buffer(U, GPUBufferUsage.UNIFORM), buffer(meta, GPUBufferUsage.STORAGE), buffer(X, GPUBufferUsage.STORAGE), out], 1);
  const got = await read(out, C.byteLength);
  const sumError = Math.abs(got[3] - C[1]) / C[1] + (got[2] === C[0] ? 0 : 1);
  const quotient = (C[4] + C[5]) / k;
  const quotientError = Math.abs(got[7] + got[8] - quotient) / quotient;
  // each body's grid coordinate in f64, from the same corner and cell
  let offsetError = 0;
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < 2; a++) {
      const g = (X[2 * i + a] - (MA[a] * cell + RA[a])) / cell;
      const b = Math.floor(g);
      const at = 16 + 4 * i + 2 * a;
      offsetError = Math.max(offsetError, got[at] === b ? Math.abs(got[at + 1] - (g - b)) : 1);
    }
  }
  // measured on Metal with the barriers: 0, 0 and 6.8e-8; without them the error term is 0 (sumError
  // 1), the quotient off by 1.2e-8, the offsets still 6.8e-8
  return { ok: sumError === 0 && quotientError < 1e-12 && offsetError < 1e-5, sumError, quotientError, offsetError };
}

// The residual R = u - (A_x A_y [A_z]) X at gamma 64, on a smooth field with f32's rounding in
// it, against f64, at the points whose neighbours are all inside the grid (at the faces the terms
// are large, and so is their rounding). R is about 1e-5 of the field. Measured on Metal: exact
// with the barriers; without them off by 163 times its size in 2D and 38,000 in 3D
// (grid-work/canary-tune.json).
async function checkResidual(D, buffer, read, dispatch, SB) {
  const sizes = D === 2 ? [8, 8, 1] : [5, 5, 5];
  const total = sizes[0] * sizes[1] * sizes[2];
  const gamma = 64;
  const at = (j0, j1, j2) => j0 + sizes[0] * (j1 + sizes[1] * j2);
  const X = new Float32Array(total);
  for (let j2 = 0; j2 < sizes[2]; j2++) for (let j1 = 0; j1 < sizes[1]; j1++) for (let j0 = 0; j0 < sizes[0]; j0++) {
    X[at(j0, j1, j2)] = f32(1 + 1e-3 * Math.sin(0.05 * (j0 + 1.3 * j1 + 0.7 * j2)));
  }
  // A X in f64, one axis at a time: (1 + gamma L) with L f = (f - left) + (f - right), 0 outside
  let Y = Float64Array.from(X);
  for (let k = 0; k < D; k++) {
    const next = new Float64Array(total);
    for (let j2 = 0; j2 < sizes[2]; j2++) for (let j1 = 0; j1 < sizes[1]; j1++) for (let j0 = 0; j0 < sizes[0]; j0++) {
      const j = [j0, j1, j2];
      const side = d => { const o = j.slice(); o[k] += d; return o[k] < 0 || o[k] >= sizes[k] ? 0 : Y[at(o[0], o[1], o[2])]; };
      const y = Y[at(j0, j1, j2)];
      next[at(j0, j1, j2)] = y + gamma * ((y - side(-1)) + (y - side(1)));
    }
    Y = next;
  }
  const u = new Float32Array(total);
  for (let j = 0; j < total; j++) u[j] = f32(Y[j] + 1e-5 * (1 + 0.5 * Math.sin(j)));
  const meta = new Uint32Array(META.TABLE);
  for (let k = 0; k < D; k++) meta[META.SIZE + k] = sizes[k];
  meta[META.TOTAL] = total;
  meta[META.TAB_GAMMA] = bits(gamma);
  const lowBuffer = buffer(u, SB);
  dispatch(`RESIDUAL${D}`, [buffer(meta, GPUBufferUsage.STORAGE), buffer(X, GPUBufferUsage.STORAGE), lowBuffer], 1);
  const R = await read(lowBuffer, u.byteLength);
  let worst = 0, size = 0;
  for (let j2 = 0; j2 < sizes[2]; j2++) for (let j1 = 0; j1 < sizes[1]; j1++) for (let j0 = 0; j0 < sizes[0]; j0++) {
    const inside = [j0, j1, j2].every((v, k) => k >= D || (v > 0 && v < sizes[k] - 1));
    if (!inside) continue;
    const j = at(j0, j1, j2);
    const exact = u[j] - Y[j];
    size = Math.max(size, Math.abs(exact));
    worst = Math.max(worst, Math.abs(R[j] - exact));
  }
  const error = worst / size;
  return { ok: error < 0.1, error };
}
