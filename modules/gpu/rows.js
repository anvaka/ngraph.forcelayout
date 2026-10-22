// Rows the host wrote between syncs go up to the device row by row: the device is ahead of the
// store then, so writing a whole column would put every other body back by the steps in flight.
// A few rows take one writeBuffer() each; many take one dispatch that scatters them.
import { getPipeline } from './device.js';

// Up to this many rows go up one writeBuffer() each
const FEW_ROWS = 64;

// rows: [count, base, width, 0, row...]; row r's numbers are values[r * width + k]
const SCATTER = `@group(0) @binding(0) var<storage, read> rows: array<u32>;
@group(0) @binding(1) var<storage, read> values: array<f32>;
@group(0) @binding(2) var<storage, read_write> into: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let r = gid.x;
  if (r >= rows[0]) { return; }
  let width = rows[2];
  let at = rows[1] + rows[4u + r] * width;
  for (var k = 0u; k < width; k++) { into[at + k] = values[r * width + k]; }
}`;

/**
 * Resolves to write(target, base, width, rows, values): row `rows[r]` of `target` (`width`
 * floats per row from float `base`) gets values[r * width ... r * width + width - 1].
 */
export async function createRowWriter(device) {
  const pipeline = await getPipeline(device, { code: SCATTER, label: 'SCATTER' });
  const usage = GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST;
  return function write(target, base, width, rows, values) {
    if (!rows.length) return;
    if (rows.length <= FEW_ROWS) {
      for (let r = 0; r < rows.length; r++) {
        device.queue.writeBuffer(target, (base + rows[r] * width) * 4, values, r * width, width);
      }
      return;
    }
    const head = new Uint32Array(4 + rows.length);
    head[0] = rows.length; head[1] = base; head[2] = width;
    head.set(rows, 4);
    const rowBuffer = device.createBuffer({ size: head.byteLength, usage, label: 'scatter rows' });
    const valueBuffer = device.createBuffer({ size: rows.length * width * 4, usage, label: 'scatter values' });
    device.queue.writeBuffer(rowBuffer, 0, head);
    device.queue.writeBuffer(valueBuffer, 0, values, 0, rows.length * width);
    const group = device.createBindGroup({
      layout: pipeline.getBindGroupLayout(0),
      entries: [rowBuffer, valueBuffer, target].map((buffer, binding) => ({ binding, resource: { buffer } })),
    });
    const enc = device.createCommandEncoder();
    const pass = enc.beginComputePass();
    pass.setPipeline(pipeline);
    pass.setBindGroup(0, group);
    pass.dispatchWorkgroups(Math.ceil(rows.length / 256));
    pass.end();
    device.queue.submit([enc.finish()]);
    // freed once the submitted work is done
    rowBuffer.destroy();
    valueBuffer.destroy();
  };
}

/**
 * Positions the host wrote, found against `mirror`: what the module last put on the device or
 * into the store, as f32 relative to `origin`, in the store's order. A row that went up is held
 * until a readback whose steps include the upload: readbacks encoded before it would put the old
 * position back (a dragged node would jump back for a frame).
 */
export function trackHostPositions(store, n, D, origin, mirror) {
  const held = new Map(); // row -> {steps, values}: the steps queued when it went up, its numbers
  return {
    mirror,

    // Rows whose positions in the store differ from the mirror
    written() {
      const pos = store.pos, rows = [];
      for (let i = 0; i < n; i++) {
        for (let k = 0; k < D; k++) {
          if (Math.fround(pos[i * D + k] - origin[k]) !== mirror[i * D + k]) { rows.push(i); break; }
        }
      }
      return rows;
    },

    // `rows` go up from the store after `steps` queued steps; returns their numbers (f32, relative)
    uploaded(rows, steps) {
      const values = new Float32Array(rows.length * D), pos = store.pos;
      rows.forEach((i, r) => {
        for (let k = 0; k < D; k++) values[r * D + k] = mirror[i * D + k] = pos[i * D + k] - origin[k];
        held.set(i, { steps, values: values.subarray(r * D, r * D + D) });
      });
      return values;
    },

    // The whole store went up (the host owned it): nothing older comes back
    reset(relative) {
      held.clear();
      mirror.set(relative);
    },

    /**
     * A readback of positions after `through` steps goes into the store through `write()` (which
     * also sets the mirror). Rows the host wrote since the last upload (`hostWrote`: the column's
     * version moved) and rows held for later readbacks keep the store's numbers.
     */
    readBack(through, hostWrote, write) {
      const keep = hostWrote ? this.written() : [];
      held.forEach((entry, i) => { if (entry.steps >= through) keep.push(i); else held.delete(i); });
      if (!keep.length) return write();
      const pos = store.pos;
      const saved = keep.map(i => pos.slice(i * D, i * D + D));
      const move = write();
      keep.forEach((i, j) => pos.set(saved[j], i * D));
      held.forEach((entry, i) => mirror.set(entry.values, i * D));
      return move;
    },
  };
}
