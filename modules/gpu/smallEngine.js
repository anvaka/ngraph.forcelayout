// Exact layout for graphs up to 1024 nodes in one persistent workgroup: one dispatch runs many
// steps, positions live in workgroup memory and steps are separated by barriers instead of
// dispatches. All-pairs repulsion, same physics and integrators as the grid engine.
import { LAW_VALUES } from './gridEngine.js';

export const SMALL_MAX_NODES = 1024;

// `law` is a compiled repulsion law (../../lib/repulsionLaw.js), or null for 1/r^2
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
  var a = st.x; var npos = st.y;${law ? '\n  ' + law.wgslPrologue(i => `P.law[${i >> 2}].${'xyzw'[i & 3]}`) : ''}
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
        ${law.emitWGSL(2, 'r', 'k1')}
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

const pipelineCache = new WeakMap(); // device -> Map(workgroup size and law -> pipeline)

function workgroupSize(n) {
  return Math.max(32, Math.ceil(n / 32) * 32);
}

export function smallEngineFits(device, n) {
  const wgs = workgroupSize(n);
  const L = device.limits;
  return n <= SMALL_MAX_NODES && L.maxComputeInvocationsPerWorkgroup >= wgs &&
    L.maxComputeWorkgroupSizeX >= wgs && L.maxComputeWorkgroupStorageSize >= 16 * wgs;
}

export function createSmallEngine(device, { n, edges, init, mass, law = null }) {
  if (law && law.valueCount > LAW_VALUES) throw new Error(`The GPU takes laws with up to ${LAW_VALUES} numbers`);
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
  const buf = (size, usage) => {
    const b = device.createBuffer({ size: Math.max(16, Math.ceil(size / 16) * 16), usage });
    owned.push(b);
    return b;
  };
  const upload = (data, usage = S | CD) => { const b = buf(data.byteLength, usage); device.queue.writeBuffer(b, 0, data); return b; };
  const pos = upload(init, S | CD | CS);
  const vel = buf(n * 16, S | CD);
  const massB = upload(mass), csrB = upload(csr);
  const fireB = buf(16, S | CD);
  const paramSize = law ? 48 + 4 * LAW_VALUES : 48;
  const params = buf(paramSize, GPUBufferUsage.UNIFORM | CD);

  // the workgroup is sized to the graph, so barriers only wait on live lanes
  const wgs = workgroupSize(n);
  let byDevice = pipelineCache.get(device);
  if (!byDevice) { byDevice = new Map(); pipelineCache.set(device, byDevice); }
  const key = wgs + (law ? '|' + law.key : '');
  let pipeline = byDevice.get(key);
  if (!pipeline) {
    pipeline = device.createComputePipeline({
      layout: 'auto',
      compute: { module: device.createShaderModule({ code: CODE(law), label: 'small' }), entryPoint: 'main', constants: { WGS: wgs } },
      label: `small-${wgs}`,
    });
    byDevice.set(key, pipeline);
  }
  const group = device.createBindGroup({
    layout: pipeline.getBindGroupLayout(0),
    entries: [params, pos, vel, massB, csrB, fireB].map((b, i) => ({ binding: i, resource: { buffer: b } })),
  });

  const paramBuf = new ArrayBuffer(paramSize);
  const pu = new Uint32Array(paramBuf), pf = new Float32Array(paramBuf);
  pu[0] = n;
  const stepsWord = new Uint32Array(1);

  function resetFire() { device.queue.writeBuffer(fireB, 0, new Float32Array([0.1, 0, 0, 0])); }
  resetFire();

  return {
    kind: 'small',
    G: 0,
    pos,
    vel,
    setParams(s) {
      pu[2] = s.integrator === 'fire' ? 1 : 0;
      pf[4] = s.gravity; pf[5] = s.springLength; pf[6] = s.springCoefficient; pf[7] = s.dragCoefficient;
      pf[8] = s.timeStep; pf[9] = s.maxVelocity;
      if (law) law.writeValues(pf, 12);
      device.queue.writeBuffer(params, 0, paramBuf);
    },
    // After law.update(): the law's numbers for the next steps
    setLawValues() {
      law.writeValues(pf, 12);
      device.queue.writeBuffer(params, 48, paramBuf, 48);
    },
    resetFire,
    // One dispatch runs up to 64 steps; the step count is a uniform written before each submit.
    run(count, timestampWrites, beforeFinish) {
      const perSubmit = 64;
      for (let done = 0; done < count;) {
        const c = Math.min(perSubmit, count - done);
        stepsWord[0] = c;
        device.queue.writeBuffer(params, 4, stepsWord);
        const enc = device.createCommandEncoder();
        const first = done === 0, last = done + c === count;
        let tw;
        if (timestampWrites && (first || last)) {
          tw = { querySet: timestampWrites.querySet };
          if (first) tw.beginningOfPassWriteIndex = 0;
          if (last) tw.endOfPassWriteIndex = 1;
        }
        const cp = enc.beginComputePass(tw ? { timestampWrites: tw } : undefined);
        cp.setPipeline(pipeline); cp.setBindGroup(0, group); cp.dispatchWorkgroups(1);
        cp.end();
        if (last && beforeFinish) beforeFinish(enc);
        device.queue.submit([enc.finish()]);
        done += c;
      }
    },
    destroy() { for (const b of owned) b.destroy(); },
  };
}

// For checks: the WGSL for a law (null for 1/r^2)
export function shaderCode(law = null) {
  return CODE(law);
}
