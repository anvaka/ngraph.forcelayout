// Exact layout for graphs up to 1024 nodes in one persistent workgroup: one dispatch runs many
// steps, positions live in workgroup memory and steps are separated by barriers instead of
// dispatches. All-pairs repulsion, same physics and integrators as the grid engine.
//
// The stock template for small graphs, with today's WGSL byte for byte (test/t4.js). The
// one-kernel step of design section 6.1 replaces it (M1).
import { LAW_VALUES } from './grid.js';
import { emitLaw, lawPrologue, lawValueCount, writeLawValues } from '../wgsl/print.js';
import { getPipeline } from '../device.js';

export const SMALL_MAX_NODES = 1024;

// `law` is a compiled repulsion law of the library, or null for 1/r^2
const CODE = law => /* wgsl */`
struct Params {
  n: u32, steps: u32, integrator: u32, pad0: u32,
  gravity: f32, springLength: f32, springK: f32, drag: f32,
  dt: f32, maxV: f32, pad1: f32, pad2: f32,${law ? `
  law: array<vec4f, ${LAW_VALUES / 4}>,` : ''}
};
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vel: array<vec4f>; // (velocity, 0, pinned)
@group(0) @binding(3) var<storage, read> mass: array<f32>;
@group(0) @binding(4) var<storage, read> csr: array<u32>;         // [rowStart (n + 1), neighbors]
@group(0) @binding(5) var<storage, read_write> fire: array<vec4f>; // [0] = (a, npos, 0, 0)

override WGS: u32 = 1024;
var<workgroup> sp: array<vec2f, WGS>;
var<workgroup> sm: array<f32, WGS>;
var<workgroup> red: array<f32, WGS>;

// Same as the grid engine: deterministic, antisymmetric push for coincident nodes.
fn jitter(a: u32, b: u32) -> vec2f {
  var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;
  let angle = f32(h) * (6.2831853 / 4294967296.0);
  return select(-0.01, 0.01, a < b) * vec2f(cos(angle), sin(angle));
}

@compute @workgroup_size(WGS)
fn main(@builtin(local_invocation_index) i: u32) {
  let live = i < P.n;
  var p = vec2f(0.0); var v = vec2f(0.0); var mi = 0.0; var pinned = false;
  if (live) { p = pos[i]; let v4 = vel[i]; v = v4.xy; pinned = v4.w != 0.0; mi = mass[i]; }
  let moving = live && !pinned;
  sm[i] = mi;
  var st = fire[0];
  var a = st.x; var npos = st.y;${law ? '\n  ' + lawPrologue(law, i => `P.law[${i >> 2}].${'xyzw'[i & 3]}`) : ''}
  for (var s = 0u; s < P.steps; s++) {
    sp[i] = p;
    workgroupBarrier();
    var f = vec2f(0.0);
    if (live) {
      for (var j = 0u; j < P.n; j++) {
        if (j == i) { continue; }
        var d = sp[j] - p;
        var r2 = dot(d, d);
        if (r2 == 0.0) { d = jitter(i, j); r2 = dot(d, d); }
        ${law ? `${law.hasRange ? `if (r2 > lawRange2) { continue; }
        ` : ''}let r = sqrt(r2);
        ${emitLaw(law, 2, 'r', 'k1')}
        f += (P.gravity * mi * sm[j] * k1) * d;` : `let r = sqrt(r2);
        f += (P.gravity * mi * sm[j] / (r2 * r)) * d;`}
      }
      for (var e = csr[i]; e < csr[i + 1u]; e++) {
        let j = csr[P.n + 1u + e];
        var d = sp[j] - p;
        var r = length(d);
        if (r == 0.0) { d = jitter(i, j); r = length(d); }
        f += (P.springK * (r - P.springLength) / r) * d;
      }
    }
    if (P.integrator == 1u) {
      // FIRE: workgroup sums of (F.v, |v|^2) in sp and |F|^2 in red
      workgroupBarrier();
      sp[i] = select(vec2f(0.0), vec2f(dot(f, v), dot(v, v)), moving);
      red[i] = select(0.0, dot(f, f), moving);
      workgroupBarrier();
      for (var k = 512u; k > 0u; k >>= 1u) {
        if (i < k && i + k < WGS) { sp[i] += sp[i + k]; red[i] += red[i + k]; }
        workgroupBarrier();
      }
      let power = sp[0].x; let v2 = sp[0].y; let f2 = red[0];
      var cv = 0.0; var cf = 0.0;
      if (power > 0.0) {
        cv = 1.0 - a;
        if (f2 > 0.0) { cf = a * sqrt(v2) / sqrt(f2); }
        npos += 1.0;
        if (npos > 5.0) { a *= 0.99; }
      } else {
        npos = 0.0; a = 0.1;
      }
      if (moving) {
        v = cv * v + cf * f;
        v += (P.dt / mi) * f;
        let vl = length(v);
        if (vl > P.maxV) { v *= P.maxV / vl; }
        p += P.dt * v;
      }
    } else if (moving) {
      f -= P.drag * v;
      v += (P.dt / mi) * f;
      let vl = length(v);
      if (vl > P.maxV) { v *= P.maxV / vl; }
      p += P.dt * v;
    }
    workgroupBarrier();
  }
  if (live) { pos[i] = p; vel[i] = vec4f(v, 0.0, select(0.0, 1.0, pinned)); }
  if (i == 0u) { fire[0] = vec4f(a, npos, 0.0, 0.0); }
}`;

// The law-variant layout: P at a dynamic offset into a ring of per-step copies (see run())
const VARIANT_BINDINGS = ['dynamic', 'storage', 'storage', 'read', 'read', 'storage'];
export const KERNEL_STAGES = { small: ['clear', 'repulsion', 'drag', 'springs', 'integrate'] };
// Bytes per slot of the per-step ring (the uniform offset alignment)
const SLOT = 256;

function workgroupSize(n) {
  return Math.max(32, Math.ceil(n / 32) * 32);
}

/**
 * Whether `n` bodies fit one workgroup within `limits` (a device's, or a capability profile's).
 */
export function smallEngineFits(limits, n) {
  const wgs = workgroupSize(n);
  return n <= SMALL_MAX_NODES && limits.maxComputeInvocationsPerWorkgroup >= wgs &&
    limits.maxComputeWorkgroupSizeX >= wgs && limits.maxComputeWorkgroupStorageSize >= 16 * wgs;
}

/**
 * The small engine for `n` bodies (`n` fits, see smallEngineFits()). With `variants`, the
 * pipeline that reads P at a dynamic offset is built too. Resolves once the pipelines are
 * compiled; rejects (naming the kernel) when one fails, or when the buffers cannot be created.
 */
export async function createSmallEngine(device, { n, edges, init, mass, law = null, variants = false }) {
  if (law && lawValueCount(law) > LAW_VALUES) throw new Error(`The GPU takes laws with up to ${LAW_VALUES} numbers`);
  // the workgroup is sized to the graph, so barriers only wait on live lanes
  const wgs = workgroupSize(n);
  const code = CODE(law);
  const [pipeline, stepPipeline] = await Promise.all([
    getPipeline(device, { code, label: 'small', constants: { WGS: wgs } }),
    variants ? getPipeline(device, { code, label: 'small', constants: { WGS: wgs }, bindings: VARIANT_BINDINGS }) : null,
  ]);
  const deg = new Uint32Array(n);
  for (let e = 0; e < edges.length; e += 2) { deg[edges[e]]++; deg[edges[e + 1]]++; }
  const csr = new Uint32Array(n + 1 + edges.length);
  for (let i = 0; i < n; i++) csr[i + 1] = csr[i] + deg[i];
  const fill = csr.slice(0, n);
  for (let e = 0; e < edges.length; e += 2) {
    const a = edges[e], b = edges[e + 1];
    csr[n + 1 + fill[a]++] = b; csr[n + 1 + fill[b]++] = a;
  }

  const S = GPUBufferUsage.STORAGE, CD = GPUBufferUsage.COPY_DST, CS = GPUBufferUsage.COPY_SRC;
  const owned = [];
  device.pushErrorScope('validation');
  device.pushErrorScope('out-of-memory');
  const buf = (size, usage) => {
    const b = device.createBuffer({ size: Math.max(16, Math.ceil(size / 16) * 16), usage });
    owned.push(b);
    return b;
  };
  const upload = (data, usage = S | CD) => { const b = buf(data.byteLength, usage); device.queue.writeBuffer(b, 0, data); return b; };
  const pos = upload(init, S | CD | CS);
  const vel = buf(n * 16, S | CD | CS);
  const massB = upload(mass), csrB = upload(csr);
  const fireB = buf(16, S | CD | CS);
  const paramSize = law ? 48 + 4 * LAW_VALUES : 48;
  const params = buf(paramSize, GPUBufferUsage.UNIFORM | CD);
  const buffers = [params, pos, vel, massB, csrB, fireB];
  const group = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: buffers.map((b, i) => ({ binding: i, resource: { buffer: b } })),
  });
  const errors = await Promise.all([device.popErrorScope(), device.popErrorScope()]);
  const setupError = errors.find(Boolean);
  if (setupError) {
    owned.forEach(b => b.destroy());
    throw new Error('could not create the GPU buffers: ' + setupError.message);
  }

  const paramBuf = new ArrayBuffer(paramSize);
  const pu = new Uint32Array(paramBuf), pf = new Float32Array(paramBuf);
  pu[0] = n;
  const stepsWord = new Uint32Array(1);

  // The law-variant pipeline runs one step per dispatch, each with its own copy of P
  let ring = null, ringGroup = null, ringSlots = 0, ringData = null;
  function growRing(slots) {
    if (ring) ring.destroy();
    ringSlots = Math.max(64, slots);
    ring = device.createBuffer({ size: ringSlots * SLOT, usage: GPUBufferUsage.UNIFORM | CD });
    ringData = new ArrayBuffer(ringSlots * SLOT);
    ringGroup = device.createBindGroup({
      layout: stepPipeline.getBindGroupLayout(0),
      entries: [{ binding: 0, resource: { buffer: ring, size: paramSize } }].concat(buffers.slice(1).map((b, i) => ({ binding: i + 1, resource: { buffer: b } }))),
    });
  }

  function setFire(state) { device.queue.writeBuffer(fireB, 0, new Float32Array(state || [0.1, 0, 0, 0])); }
  function resetFire() { setFire(null); }
  resetFire();

  return {
    kind: 'small',
    G: 0,
    pos,
    vel,
    mass: massB,
    fire: fireB,
    variants,
    setParams(s) {
      pu[2] = s.integrator === 'fire' ? 1 : 0;
      pf[4] = s.gravity; pf[5] = s.springLength; pf[6] = s.springCoefficient; pf[7] = s.dragCoefficient;
      pf[8] = s.timeStep; pf[9] = s.maxVelocity;
      if (law) writeLawValues(law, pf, 12);
      device.queue.writeBuffer(params, 0, paramBuf);
    },
    // After law.update(): the law's numbers for the next steps
    setLawValues() {
      writeLawValues(law, pf, 12);
      device.queue.writeBuffer(params, 48, paramBuf, 48);
    },
    resetFire,
    setFire,
    // One dispatch runs up to `perSubmit` (64) steps; the step count is a uniform written before
    // each submit. With `lawSteps(s, out, offset)` (the law's numbers of step s of this call)
    // every step is a dispatch of its own that reads its copy of P from the ring. See the grid
    // engine for `timestampWrites` and `beforeFinish`.
    run(count, { timestampWrites = null, beforeFinish = null, perSubmit = 64, lawSteps = null } = {}) {
      if (lawSteps && !variants) throw new Error('this engine was built without per-step law values');
      for (let done = 0; done < count;) {
        const c = Math.min(perSubmit, count - done);
        if (lawSteps) {
          if (c > ringSlots) growRing(c);
          const bytes = new Uint8Array(paramBuf);
          const slots = new Uint8Array(ringData);
          for (let s = 0; s < c; s++) {
            slots.set(bytes, s * SLOT);
            const slot = new Float32Array(ringData, s * SLOT, paramSize / 4);
            new Uint32Array(ringData, s * SLOT, 2)[1] = 1;
            lawSteps(done + s, slot, 12);
          }
          device.queue.writeBuffer(ring, 0, ringData, 0, c * SLOT);
        } else {
          stepsWord[0] = c;
          device.queue.writeBuffer(params, 4, stepsWord);
        }
        const enc = device.createCommandEncoder();
        const first = done === 0, last = done + c === count;
        let tw;
        if (timestampWrites && (first || last)) {
          tw = { querySet: timestampWrites.querySet };
          if (first) tw.beginningOfPassWriteIndex = 0;
          if (last) tw.endOfPassWriteIndex = 1;
        }
        const cp = enc.beginComputePass(tw ? { timestampWrites: tw } : undefined);
        if (lawSteps) {
          cp.setPipeline(stepPipeline);
          for (let s = 0; s < c; s++) { cp.setBindGroup(0, ringGroup, [s * SLOT]); cp.dispatchWorkgroups(1); }
        } else {
          cp.setPipeline(pipeline); cp.setBindGroup(0, group); cp.dispatchWorkgroups(1);
        }
        cp.end();
        if (last && beforeFinish) beforeFinish(enc);
        device.queue.submit([enc.finish()]);
        done += c;
      }
    },
    destroy() {
      for (const b of owned) b.destroy();
      if (ring) ring.destroy();
    },
  };
}

// For checks: the WGSL for a law (null for 1/r^2)
export function shaderCode(law = null) {
  return CODE(law);
}
