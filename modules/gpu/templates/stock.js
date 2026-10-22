// The stock grid template as an engine the runner drives (see runner.js): the exact stock step
// in 2D above the small-graph size. It keeps today's kernels byte for byte (grid.js); this file
// moves data between them and the store: settings into the uniforms, the law's numbers (per step
// when they can change within a call), uploads by column version, and readbacks in the store's
// order (a small kernel undoes the Hilbert order on the GPU).
import { createGridEngine, KERNEL_STAGES } from './grid.js';
import { getPipeline } from '../device.js';
import { lawValueCount, writeLawValues, lawValueProblem, lawValueWarnings } from '../wgsl/print.js';
import { readLayout, relativePositions, writeVelocities, writeMasses, writePositionsBack, writePermutedBack, rowsMoved } from '../buffers.js';
import { createRowWriter, trackHostPositions } from '../rows.js';

// Calls with at least this many steps undo the Hilbert order on the GPU for their readback (its
// cost is spread over the steps); shorter ones read the template's order and undo it on the CPU,
// so a step at a time costs the GPU nothing more
const ORDER_ON_GPU = 16;
// Settings the template reads from its uniforms
const SETTINGS = ['gravity', 'springLength', 'springCoefficient', 'dragCoefficient', 'timeStep', 'maxVelocity', 'integrator'];
// The stock step's repulsion stage, whose law the template compiles
const REPULSION = 'repulsion';

// Positions back in the store's order: out[row] = pos[toInternal[row]]
const UNPERMUTE = `@group(0) @binding(0) var<uniform> count: vec4u;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> toInternal: array<u32>;
@group(0) @binding(3) var<storage, read_write> out: array<vec2f>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let row = gid.x;
  if (row >= count.x) { return; }
  out[row] = pos[toInternal[row]];
}`;

/**
 * The engine of a stock plan (schedule.js), built from the store of `simulator`.
 */
export async function createStockEngine(device, { simulator, plan, fireState, warn }) {
  const store = simulator.store;
  const law = plan.law;
  const lawCount = law ? lawValueCount(law) : 0;
  let lawValues = law ? new Float32Array(lawCount) : null;
  const data = readLayout(simulator, true);
  const n = data.n;
  const [engine, unpermute, writeRows] = await Promise.all([
    createGridEngine(device, { n, edges: data.edges, init: data.init, mass: data.mass, law, variants: plan.perStep }),
    data.permuted ? getPipeline(device, { code: UNPERMUTE, label: 'UNPERMUTE' }) : null,
    createRowWriter(device),
  ]);
  device.queue.writeBuffer(engine.vel, 0, data.velocity);
  if (fireState) engine.setFire(fireState);

  // the store's order on the GPU, for readbacks
  let ordered = null, unpermuteGroup = null;
  const extra = [];
  if (unpermute) {
    const countBuffer = device.createBuffer({ size: 16, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST });
    const indexBuffer = device.createBuffer({ size: n * 4, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST });
    ordered = device.createBuffer({ size: n * 8, usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC });
    device.queue.writeBuffer(countBuffer, 0, new Uint32Array([n, 0, 0, 0]));
    device.queue.writeBuffer(indexBuffer, 0, data.toInternal);
    unpermuteGroup = device.createBindGroup({
      layout: unpermute.getBindGroupLayout(0),
      entries: [countBuffer, engine.pos, indexBuffer, ordered].map((buffer, binding) => ({ binding, resource: { buffer } })),
    });
    extra.push(countBuffer, indexBuffer, ordered);
  }

  let written = {};
  writeSettings();
  // What the module last put on the device or into the store, to find rows the host wrote
  const host = trackHostPositions(store, n, 2, data.origin, relativePositions(store.pos, n, 2, data.origin));
  let deviceVelocities = Float64Array.from(store.velocity.subarray(0, 2 * n));
  let devicePinned = Uint8Array.from(store.pinned.subarray(0, n), value => (value ? 1 : 0));
  let uploaded = versions();

  return {
    kind: 'grid',
    n,
    D: 2,
    get fence() { return [engine.pos]; },
    positionBytes: n * 8,
    kernelStages: KERNEL_STAGES,

    // `steps`: the steps queued so far, which the uploads follow
    prepare(hostOwns, steps) {
      writeSettings();
      const now = versions();
      if (hostOwns) {
        // the store is the truth: what sync() read and what the host wrote since
        const positions = relativePositions(store.pos, n, 2, data.origin);
        host.reset(positions);
        device.queue.writeBuffer(engine.pos, 0, permuted(positions, 2));
        device.queue.writeBuffer(engine.vel, 0, writeVelocities(store, data.toInternal, new Float32Array(4 * n)));
        deviceVelocities = Float64Array.from(store.velocity.subarray(0, 2 * n));
        devicePinned = Uint8Array.from(store.pinned.subarray(0, n), value => (value ? 1 : 0));
      } else {
        // between syncs the device is ahead of the store: only rows the host wrote go up
        if (now.pos !== uploaded.pos) {
          const rows = host.written();
          const values = host.uploaded(rows, steps);
          writeRows(engine.pos, 0, 2, rows.map(i => data.toInternal[i]), values);
        }
        if (now.velocity !== uploaded.velocity || now.pinned !== uploaded.pinned) uploadVelocityRows(velocityRows());
      }
      if (now.mass !== uploaded.mass) device.queue.writeBuffer(engine.mass, 0, writeMasses(store, data.toInternal, new Float32Array(n)));
      uploaded = now;
      return 'ok';
    },

    run(count, firstStep, options) {
      let lawSteps = null, halt;
      if (law) {
        const values = plan.perStep ? stepValues(count, firstStep) : staticValues(firstStep);
        halt = values.halt;
        count = Math.min(count, values.count);
        if (count === 0) return { ran: 0, halt };
        if (values.perStep) lawSteps = (s, out, offset) => out.set(values.numbers.subarray(s * lawCount, (s + 1) * lawCount), offset);
      }
      engine.run(count, Object.assign({}, options, { lawSteps }));
      return { ran: count, halt };
    },

    // Encodes the copy of positions after every step so far into `dst`; true when they are in the
    // store's order (else in the template's)
    copyPositions(enc, dst, offset, count = ORDER_ON_GPU) {
      if (unpermute && count >= ORDER_ON_GPU) {
        const pass = enc.beginComputePass();
        pass.setPipeline(unpermute);
        pass.setBindGroup(0, unpermuteGroup);
        pass.dispatchWorkgroups(Math.ceil(n / 256));
        pass.end();
        enc.copyBufferToBuffer(ordered, 0, dst, offset, n * 8);
        return true;
      }
      enc.copyBufferToBuffer(engine.pos, 0, dst, offset, n * 8);
      return !data.permuted;
    },

    /**
     * Positions after `through` steps (`steps` of them since the last readback) into the store;
     * rows the host wrote keep its numbers (see rows.js). Returns the movement per step, or null
     * when graph edits moved the rows since.
     */
    readPositions(positions, steps, inStoreOrder, through) {
      const write = () => (inStoreOrder
        ? writePositionsBack(simulator, data.bodies, positions, 2, data.origin, steps)
        : writePermutedBack(simulator, data.bodies, positions, data.toInternal, data.origin, steps));
      if (rowsMoved(simulator, data.bodies)) return write();
      return host.readBack(through, store.versions.pos !== uploaded.pos, () => {
        const move = write();
        const mirror = host.mirror;
        if (inStoreOrder) mirror.set(positions.subarray(0, 2 * n));
        else {
          for (let i = 0; i < n; i++) {
            const k = 2 * data.toInternal[i];
            mirror[2 * i] = positions[k]; mirror[2 * i + 1] = positions[k + 1];
          }
        }
        return move;
      });
    },

    async readDevice() {
      const read = device.createBuffer({ size: n * 24 + 16, usage: GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST });
      const enc = device.createCommandEncoder();
      this.copyPositions(enc, read, 0, ORDER_ON_GPU);
      enc.copyBufferToBuffer(engine.vel, 0, read, n * 8, n * 16);
      enc.copyBufferToBuffer(engine.fire, 0, read, n * 24, 16);
      device.queue.submit([enc.finish()]);
      try {
        await read.mapAsync(GPUMapMode.READ);
      } catch (e) {
        read.destroy();
        return null;
      }
      const positions = new Float32Array(read.getMappedRange(0, n * 8)).slice();
      const velocities = new Float32Array(read.getMappedRange(n * 8, n * 16)).slice();
      const fire = Array.from(new Float32Array(read.getMappedRange(n * 24, 16)));
      read.unmap();
      read.destroy();
      return {
        positions,
        fireState: fire,
        apply() {
          if (rowsMoved(simulator, data.bodies)) return;
          const keep = store.versions.velocity !== uploaded.velocity ? velocityRows() : [];
          const saved = keep.map(i => [store.velocity[2 * i], store.velocity[2 * i + 1]]);
          for (let i = 0; i < n; i++) {
            const k = 4 * data.toInternal[i];
            store.velocity[2 * i] = velocities[k]; store.velocity[2 * i + 1] = velocities[k + 1];
          }
          keep.forEach((i, j) => { store.velocity[2 * i] = saved[j][0]; store.velocity[2 * i + 1] = saved[j][1]; });
          deviceVelocities = Float64Array.from(store.velocity.subarray(0, 2 * n));
        },
      };
    },

    destroy() {
      engine.destroy();
      extra.forEach(b => b.destroy());
    },
  };

  function writeSettings() {
    const settings = simulator.settings;
    if (SETTINGS.every(key => written[key] === settings[key])) return;
    const first = written.integrator === undefined, wasFire = written.integrator === 'fire';
    written = {};
    SETTINGS.forEach(key => { written[key] = settings[key]; });
    // as the CPU's integrator: a speed limit that is not positive is 1
    engine.setParams(Object.assign({}, settings, { maxVelocity: settings.maxVelocity > 0 ? settings.maxVelocity : 1 }));
    if (!first && !wasFire && settings.integrator === 'fire') engine.resetFire();
  }

  // The law's numbers when they cannot change within a call: once per call, written when they
  // changed
  function staticValues(at) {
    const numbers = lawValuesAt(at);
    const problem = checkValues(numbers, at);
    if (problem) return { count: 0, halt: problem };
    const fresh = new Float32Array(lawCount);
    writeLawValues(law, fresh, 0, numbers);
    if (!sameValues(fresh, lawValues)) {
      lawValues = fresh;
      engine.setLawValues(lawValues);
    }
    return { count: Infinity };
  }

  // The law's numbers for each of the next `count` steps. When every step has the numbers in the
  // uniforms, the steps run the usual pipelines; otherwise the law-variant ones, each step with
  // its own copy. Fewer steps run when a step's numbers do not fit f32.
  function stepValues(count, firstStep) {
    const numbers = new Float32Array(count * lawCount);
    let same = true;
    for (let s = 0; s < count; s++) {
      const at = firstStep + s;
      const values = lawValuesAt(at);
      const problem = checkValues(values, at);
      if (problem) return { count: s, numbers, perStep: true, halt: problem };
      writeLawValues(law, numbers, s * lawCount, values);
      if (same && !sameValues(numbers.subarray(s * lawCount, (s + 1) * lawCount), lawValues)) same = false;
    }
    if (same) return { count, perStep: false };
    // the uniforms get the last step's numbers, so a call that follows with the same numbers
    // runs the usual pipelines
    lawValues = numbers.slice((count - 1) * lawCount, count * lawCount);
    engine.setLawValues(lawValues);
    return { count, numbers, perStep: true };
  }

  function lawValuesAt(at) {
    const out = simulator.stageValues(REPULSION, simulator.stepContext(at));
    return out.lawValues || Object.assign({}, out.law.values);
  }

  function checkValues(values, at) {
    const problem = lawValueProblem(law, values);
    if (problem) return { message: `the law's ${problem.name} is ${problem.problem} at step ${at}`, stages: [REPULSION] };
    lawValueWarnings(law, values).forEach(warn);
    return null;
  }

  function versions() {
    return { pos: store.versions.pos, velocity: store.versions.velocity, mass: store.versions.mass, pinned: store.versions.pinned };
  }

  // Store-order numbers in the template's order
  function permuted(values, width) {
    if (!data.permuted) return values;
    const out = new Float32Array(values.length);
    for (let i = 0; i < n; i++) for (let k = 0; k < width; k++) out[data.toInternal[i] * width + k] = values[i * width + k];
    return out;
  }

  function velocityRows() {
    const v = store.velocity, pinned = store.pinned, rows = [];
    for (let i = 0; i < n; i++) {
      if (v[2 * i] !== deviceVelocities[2 * i] || v[2 * i + 1] !== deviceVelocities[2 * i + 1] || (pinned[i] ? 1 : 0) !== devicePinned[i]) rows.push(i);
    }
    return rows;
  }

  // Velocities with the pinned flag, which the template keeps next to them
  function uploadVelocityRows(rows) {
    const values = new Float32Array(4 * rows.length), v = store.velocity, pinned = store.pinned;
    rows.forEach((i, r) => {
      values[4 * r] = deviceVelocities[2 * i] = v[2 * i];
      values[4 * r + 1] = deviceVelocities[2 * i + 1] = v[2 * i + 1];
      values[4 * r + 3] = devicePinned[i] = pinned[i] ? 1 : 0;
    });
    writeRows(engine.vel, 0, 4, rows.map(i => data.toInternal[i]), values);
  }
}

function sameValues(a, b) {
  if (!b || a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (!Object.is(a[i], b[i])) return false;
  return true;
}
