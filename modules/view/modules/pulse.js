// pulse: rings that spread from a node and fade, to show where it is in a big drawing.
//
//   view.use(pulseNodes);                       // pulses the node search goes to
//   let pulse = view.use(pulseNodes, {on: []}); // only when asked
//   pulse.start(node);
//
// A found node may be one dot among a hundred thousand: its highlight (a ring, see the view's
// styles) shows it to whoever already looks there, and the pulse makes the eye go there. Rings
// grow from the node outwards and fade (`count` of them, `duration` ms each, `stagger` apart),
// following the node as it moves. With prefers-reduced-motion nothing moves: no pulse (the
// highlight stays).
//
// Options: `on` (['search']: view events whose node pulses), `color` (0xffffffff), `halo`
// (0x0e1624b3: a dark band either side of the ring, so it reads over bright areas), `width` (2
// CSS pixels), `radius` (64: how far the rings spread), `count` (2), `duration` (900),
// `stagger` (300).
//
// API: start(nodeOrId), stop(), dispose().
import {createProgram, createBuffer} from '../gl.js';
import {POSITION_OF} from '../programs.js';

const DEFAULTS = {
  on: ['search'],
  color: 0xffffffff,
  halo: 0x0e1624b3,
  width: 2,
  radius: 64,
  count: 2,
  duration: 900,
  stagger: 300
};

const VERTEX = `
  precision highp float;
  uniform mat4 modelViewProjection;
  uniform vec2 resolution;
  uniform float row;
  // Outer edge of the quad, in device pixels
  uniform float reach;
  ${POSITION_OF}
  attribute vec2 point; // corner of the quad, -0.5..0.5
  varying vec2 vPixel;  // device pixels from the node
  void main() {
    vec4 clip = modelViewProjection * vec4(positionOf(row).xyz, 1.0);
    if (clip.w <= 0.0) {
      gl_Position = NOWHERE;
      return;
    }
    vPixel = point * 2.0 * reach;
    gl_Position = vec4(clip.xy + clip.w * vPixel * 2.0 / resolution, 0.0, clip.w);
  }`;

const FRAGMENT = `
  precision mediump float;
  uniform vec4 color;
  uniform vec4 halo;
  uniform float radius; // the ring's middle, device pixels
  uniform float width;  // device pixels
  uniform float alpha;
  varying vec2 vPixel;
  void main() {
    float off = abs(length(vPixel) - radius);
    float ring = clamp(0.5 * width + 0.5 - off, 0.0, 1.0);
    float band = clamp(0.5 * width + 2.0 - off, 0.0, 1.0);
    if (band <= 0.0) discard;
    vec4 c = mix(vec4(halo.rgb, halo.a * band), color, ring);
    gl_FragColor = vec4(c.rgb, c.a * alpha);
  }`;

const QUAD = new Float32Array([-0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5]);

export default {
  name: 'pulse',
  attach(ctx, options = {}) {
    let settings = Object.assign({}, DEFAULTS, options);
    let gl = ctx.gl;
    let info = createProgram(gl, VERTEX, FRAGMENT, ['point'],
      ['modelViewProjection', 'positions', 'positionsSize', 'resolution', 'row', 'reach', 'color', 'halo', 'radius', 'width', 'alpha']);
    let quad = createBuffer(gl, QUAD);
    let color = rgba(settings.color), halo = rgba(settings.halo);
    // {node, start} while a pulse runs
    let running = null;
    let reduced = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;

    settings.on.forEach(name => ctx.on(name, e => { if (e && e.node) start(e.node); }));
    ctx.addLayer({
      order: 10,
      draw(frame) {
        if (!running) return;
        let elapsed = frame.time - running.start;
        let total = settings.duration + settings.stagger * (settings.count - 1);
        if (elapsed > total) {
          running = null;
          return;
        }
        let body = ctx.layout.getBody(running.node.id);
        if (!body) {
          running = null;
          return;
        }
        let ratio = frame.drawContext.pixelRatio || 1;
        let u = info.uniforms;
        gl.useProgram(info.program);
        gl.uniformMatrix4fv(u.modelViewProjection, false, frame.mvp);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, frame.positions.texture);
        gl.uniform1i(u.positions, 0);
        gl.uniform2f(u.positionsSize, frame.positions.width, frame.positions.rows);
        gl.uniform2f(u.resolution, frame.drawContext.width, frame.drawContext.height);
        gl.uniform1f(u.row, body.index);
        gl.uniform1f(u.reach, (settings.radius + settings.width + 4) * ratio);
        gl.uniform4fv(u.color, color);
        gl.uniform4fv(u.halo, halo);
        gl.uniform1f(u.width, settings.width * ratio);
        gl.bindBuffer(gl.ARRAY_BUFFER, quad);
        gl.enableVertexAttribArray(info.attributes.point);
        gl.vertexAttribPointer(info.attributes.point, 2, gl.FLOAT, false, 0, 0);
        gl.disable(gl.DEPTH_TEST);
        for (let k = 0; k < settings.count; ++k) {
          let t = (elapsed - k * settings.stagger) / settings.duration;
          if (t < 0 || t > 1) continue;
          // eases out: fast at first, slowing as it fades
          let grow = 1 - (1 - t) * (1 - t);
          gl.uniform1f(u.radius, (8 + (settings.radius - 8) * grow) * ratio);
          gl.uniform1f(u.alpha, 1 - t);
          gl.drawArrays(gl.TRIANGLES, 0, 6);
        }
        gl.disableVertexAttribArray(info.attributes.point);
        ctx.animate();
      },
      dispose() {
        gl.deleteBuffer(quad);
        gl.deleteProgram(info.program);
      }
    });

    return {
      start,
      stop() { running = null; },
      dispose() { running = null; }
    };

    function start(nodeOrId) {
      if (reduced && reduced.matches) return;
      let node = typeof nodeOrId === 'object' && nodeOrId ? nodeOrId : ctx.graph.getNode(nodeOrId);
      if (!node) return;
      running = {node, start: performance.now()};
      ctx.requestFrame();
    }
  }
};

function rgba(color) {
  return new Float32Array([((color >>> 24) & 255) / 255, ((color >>> 16) & 255) / 255, ((color >>> 8) & 255) / 255, (color & 255) / 255]);
}
