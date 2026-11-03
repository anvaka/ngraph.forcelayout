// Draws labels: one quad per label, beside its node. The quad keeps only the node's row and which
// side it is on; the shader reads the node's position from the positions texture, so labels follow
// moving nodes and the camera with no work on the CPU between placements. Fades run in the shader
// from a start time and two alphas.
import {createProgram, createBuffer} from '../gl.js';
import {POSITION_OF} from '../programs.js';

// Floats per label (see LabelBuffer in labels.js)
export const STRIDE = 13;

const VERTEX = `
  precision highp float;
  uniform mat4 modelViewProjection;
  uniform vec2 resolution;
  uniform float pixelRatio;
  uniform float gap;
  uniform float time;
  uniform float fadeDuration;
  uniform float dimAlpha;
  uniform vec2 pointedSize;
  uniform vec2 selectedSize;
  // Device pixels a ring adds around pointed and selected nodes (0: no ring)
  uniform vec2 rings;
  ${POSITION_OF}
  attribute vec2 corner; // per vertex, 0..1
  // row, diameter in scene units, side (0 right, 1 left, 2 above, 3 below), and the text's tone
  // (0 to 1), or below 0 for a label in front: -1 at its own place, -2 over the others on a plate
  attribute vec4 node;
  attribute vec2 box;    // width, height in CSS pixels
  attribute vec4 uv;     // the image in the atlas: left, top, right, bottom
  attribute vec3 fade;   // start (seconds), alpha at the start, alpha at the end

  varying vec2 vUv;
  varying float vAlpha;
  varying float vTone;
  void main() {
    vec4 position = positionOf(node.x);
    vec4 clip = modelViewProjection * vec4(position.xyz, 1.0);
    if (clip.w <= 0.0) {
      gl_Position = NOWHERE;
      return;
    }
    vec2 center = (clip.xy / clip.w * 0.5 + 0.5) * resolution;
    // The node's radius in device pixels, as the node program draws it
    float scale = 0.5 * resolution.y * length(vec3(modelViewProjection[0][1], modelViewProjection[1][1], modelViewProjection[2][1])) / clip.w;
    float diameter = node.y * scale;
    float flags = position.w;
    if (hasFlag(flags, 2.0) > 0.5) diameter = max(diameter * selectedSize.x, selectedSize.y);
    // A pointed node is drawn larger; its label makes room only once it is in front, so a pointer
    // passing over nodes doesn't nudge their labels
    float front = 1.0 - step(-0.5, node.w);
    float pointed = isPointed(flags) * front;
    if (pointed > 0.5) diameter = max(diameter * pointedSize.x, pointedSize.y);
    float ring = pointed > 0.5 && rings.x > 0.0 ? rings.x : hasFlag(flags, 2.0) > 0.5 ? rings.y : 0.0;
    float r = 0.5 * diameter + ring + gap * pixelRatio;

    vec2 size = box * pixelRatio;
    vec2 origin;
    if (node.z < 0.5) origin = center + vec2(r, -0.5 * size.y);
    else if (node.z < 1.5) origin = center + vec2(-r - size.x, -0.5 * size.y);
    else if (node.z < 2.5) origin = center + vec2(-0.5 * size.x, r);
    else origin = center + vec2(-0.5 * size.x, -r - size.y);
    // On whole device pixels, so the image maps texel to pixel
    origin = floor(origin + 0.5);
    vec2 at = origin + corner * size;
    gl_Position = vec4(at / resolution * 2.0 - 1.0, 0.0, 1.0);
    // The atlas's rows go down, the screen's go up
    vUv = vec2(mix(uv.x, uv.z, corner.x), mix(uv.w, uv.y, corner.y));

    float t = clamp((time - fade.x) / fadeDuration, 0.0, 1.0);
    float alpha = mix(fade.y, fade.z, t);
    if (isPointed(flags) + hasFlag(flags, 2.0) + hasFlag(flags, 16.0) < 0.5) alpha *= dimAlpha;
    vAlpha = alpha;
    // Pointed and selected nodes' labels at full brightness; others at their tier's tone. A label
    // over the others (-2) is at full brightness on a plate (vTone -1)
    vTone = node.w < -1.5 ? -1.0 : front > 0.5 || isPointed(flags) + hasFlag(flags, 2.0) > 0.5 ? 1.0 : node.w;
  }`;

const FRAGMENT = `
  precision mediump float;
  uniform sampler2D atlas;
  uniform vec4 textColor;
  uniform vec4 haloColor;
  varying vec2 vUv;
  varying float vAlpha;
  varying float vTone;
  void main() {
    // Premultiplied: red is the text's coverage, green the halo's where the text isn't
    vec4 texel = texture2D(atlas, vUv);
    float text = texel.r;
    // A label over the others sits on a plate: its whole box in the halo's color
    float plate = vTone < 0.0 ? 1.0 : 0.0;
    float halo = max(texel.g * haloColor.a, plate * (1.0 - text));
    float alpha = text + halo;
    if (alpha <= 0.0) discard;
    // A dimmer tone mixes the text toward the halo (the background): a grey, not a see-through
    vec3 ink = mix(haloColor.rgb, textColor.rgb, abs(vTone));
    vec3 color = (ink * text + haloColor.rgb * halo) / alpha;
    gl_FragColor = vec4(color, alpha * textColor.a * vAlpha);
  }`;

const QUAD = new Float32Array([0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 0]);

export function createLabelProgram(gl, instancing) {
  let info = createProgram(gl, VERTEX, FRAGMENT, ['corner', 'node', 'box', 'uv', 'fade'], [
    'modelViewProjection', 'positions', 'positionsSize', 'resolution', 'pixelRatio', 'gap', 'time',
    'fadeDuration', 'dimAlpha', 'pointedSize', 'selectedSize', 'rings', 'atlas', 'textColor', 'haloColor'
  ]);
  let quad = createBuffer(gl, QUAD);
  let instances = gl.createBuffer();
  let capacity = 0;
  let a = info.attributes, u = info.uniforms;

  return {
    /** New label data: `count` labels, STRIDE floats each */
    update(data, count) {
      gl.bindBuffer(gl.ARRAY_BUFFER, instances);
      let bytes = count * STRIDE * 4;
      if (bytes > capacity) {
        capacity = Math.max(bytes, 2 * capacity, 1024);
        gl.bufferData(gl.ARRAY_BUFFER, capacity, gl.DYNAMIC_DRAW);
      }
      if (count) gl.bufferSubData(gl.ARRAY_BUFFER, 0, data.subarray(0, count * STRIDE));
    },
    /**
     * `frame`: what the view passes to layers. `look`: {count, atlas, time (seconds), fade
     * (seconds), gap, textColor, haloColor (vec4s)}.
     */
    draw(frame, look) {
      if (!look.count) return;
      let {positions, mvp, drawContext, style} = frame;
      gl.useProgram(info.program);
      gl.uniformMatrix4fv(u.modelViewProjection, false, mvp);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, positions.texture);
      gl.uniform1i(u.positions, 0);
      gl.uniform2f(u.positionsSize, positions.width, positions.rows);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, look.atlas);
      gl.uniform1i(u.atlas, 1);
      gl.uniform2f(u.resolution, drawContext.width, drawContext.height);
      gl.uniform1f(u.pixelRatio, drawContext.pixelRatio || 1);
      gl.uniform1f(u.gap, look.gap);
      gl.uniform1f(u.time, look.time);
      gl.uniform1f(u.fadeDuration, look.fade);
      gl.uniform1f(u.dimAlpha, style.dimAlpha);
      gl.uniform2fv(u.pointedSize, style.pointedSize);
      gl.uniform2fv(u.selectedSize, style.selectedSize);
      let ring = style.ringSize ? style.ringSize[0] + style.ringSize[1] : 0;
      gl.uniform2f(u.rings, style.pointedRing && style.pointedRing[3] > 0 ? ring : 0, style.selectedRing && style.selectedRing[3] > 0 ? ring : 0);
      gl.uniform4fv(u.textColor, look.textColor);
      gl.uniform4fv(u.haloColor, look.haloColor);

      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(a.corner);
      gl.vertexAttribPointer(a.corner, 2, gl.FLOAT, false, 0, 0);
      instancing.vertexAttribDivisorANGLE(a.corner, 0);
      gl.bindBuffer(gl.ARRAY_BUFFER, instances);
      let stride = STRIDE * 4;
      perInstance(a.node, 4, stride, 0);
      perInstance(a.box, 2, stride, 4 * 4);
      perInstance(a.uv, 4, stride, 6 * 4);
      perInstance(a.fade, 3, stride, 10 * 4);
      gl.disable(gl.DEPTH_TEST);
      instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, look.count);
      [a.corner, a.node, a.box, a.uv, a.fade].forEach(location => {
        instancing.vertexAttribDivisorANGLE(location, 0);
        gl.disableVertexAttribArray(location);
      });
      gl.activeTexture(gl.TEXTURE0);
    },
    dispose() {
      gl.deleteBuffer(quad);
      gl.deleteBuffer(instances);
      gl.deleteProgram(info.program);
    }
  };

  function perInstance(location, size, stride, offset) {
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, size, gl.FLOAT, false, stride, offset);
    instancing.vertexAttribDivisorANGLE(location, 1);
  }
}
