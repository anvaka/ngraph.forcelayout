// The two programs of the view: nodes as round points, edges as lines of a fixed width on screen.
// Both read node positions from the positions texture (see positions.js), so the CPU never touches
// an edge after it is built.
//
// Edges smooth their own sides: the quad is half a pixel wider on each side than the line, and
// the fragment shader scales alpha by how much of the pixel the line covers. Multisampling (the
// WebGL default) is not needed, and should be off: with it, every blended edge fragment is written
// to every sample, which made edges the most expensive part of a frame. Nodes smooth their round
// edge the same way, over one pixel (with OES_standard_derivatives; without it the edge is hard).
import {createProgram, createBuffer, bindAttribute, unbindAttribute} from './gl.js';

// Row `i` of the positions texture, as texture coordinates of its texel
const POSITION_OF = `
  uniform highp sampler2D positions;
  uniform vec2 positionsSize;
  vec3 positionOf(float row) {
    float y = floor(row / positionsSize.x);
    float x = row - y * positionsSize.x;
    return texture2D(positions, vec2((x + 0.5) / positionsSize.x, (y + 0.5) / positionsSize.y)).xyz;
  }
`;

const NODE_VERTEX = `
  precision highp float;
  uniform mat4 modelViewProjection;
  ${POSITION_OF}
  attribute vec2 point; // corner of the quad, per vertex
  attribute float row;  // per node
  attribute float size;
  attribute vec4 color; // 0xRRGGBBAA as four bytes

  varying vec4 vColor;
  varying vec2 vPoint;
  void main() {
    gl_Position = modelViewProjection * vec4(positionOf(row) + vec3(point * size, 0.), 1.0);
    vColor = color.abgr;
    vPoint = point;
  }`;

const NODE_FRAGMENT = `
  #extension GL_OES_standard_derivatives : enable
  precision highp float;
  // 0: the whole node; 1: only its solid inside; 2: only its smoothed edge
  uniform float part;
  varying vec4 vColor;
  varying vec2 vPoint;
  void main() {
    float dist = length(vPoint);
  #ifdef GL_OES_standard_derivatives
    // one pixel, in units of the quad
    float pixel = fwidth(dist);
    float coverage = clamp((0.5 - dist) / pixel + 0.5, 0.0, 1.0);
    if (coverage <= 0.0 || (part == 1.0 && coverage < 1.0) || (part == 2.0 && coverage >= 1.0)) {discard;}
    gl_FragColor = vec4(vColor.rgb, vColor.a * coverage);
  #else
    if (dist >= 0.5) {discard;}
    gl_FragColor = vColor;
  #endif
  }`;

const EDGE_VERTEX = `
  precision highp float;
  uniform mat4 modelViewProjection;
  uniform float width;
  uniform vec2 resolution;
  ${POSITION_OF}
  attribute vec2 point; // corner of the quad, per vertex
  attribute vec2 ends;  // rows of the two nodes, per edge
  attribute vec4 color;

  varying vec4 vColor;
  varying float vAcross; // distance from the middle of the line, in pixels
  void main() {
    vec4 clip0 = modelViewProjection * vec4(positionOf(ends.x), 1.0);
    vec4 clip1 = modelViewProjection * vec4(positionOf(ends.y), 1.0);

    vec2 screen0 = resolution * (0.5 * clip0.xy/clip0.w + 0.5);
    vec2 screen1 = resolution * (0.5 * clip1.xy/clip1.w + 0.5);

    vec2 xBasis = normalize(screen1 - screen0);
    vec2 yBasis = vec2(-xBasis.y, xBasis.x);

    // half a pixel wider than the line on each side, for the smoothed sides
    float across = (width + 1.0) * point.x;
    vec2 pt0 = screen0 + across * yBasis;
    vec2 pt1 = screen1 + across * yBasis;

    vec2 pt = mix(pt0, pt1, point.y);
    vec4 clip = mix(clip0, clip1, point.y);

    gl_Position = vec4(clip.w * (2.0 * pt/resolution - 1.0), clip.z, clip.w);
    vColor = color.abgr;
    vAcross = across;
  }`;

const EDGE_FRAGMENT = `
  precision highp float;
  uniform float width;
  varying vec4 vColor;
  varying float vAcross;
  void main() {
    // the part of this pixel (one unit wide, centered here) that the line covers
    float coverage = clamp(0.5 * width + 0.5 - abs(vAcross), 0.0, 1.0);
    gl_FragColor = vec4(vColor.rgb, vColor.a * coverage);
  }`;

const POSITION_UNIFORMS = ['modelViewProjection', 'positions', 'positionsSize'];

// Two triangles of a quad
const NODE_QUAD = new Float32Array([-0.5, -0.5, -0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, -0.5, -0.5, -0.5]);
const EDGE_QUAD = new Float32Array([-0.5, 0, -0.5, 1, 0.5, 1, -0.5, 0, 0.5, 1, 0.5, 0]);

/**
 * Draws `nodes.count` nodes: buffers `nodes.rows`, `nodes.sizes`, `nodes.colors`, one entry each.
 *
 * With depth (`positions.hasDepth`, a layout in 3D or more) nodes are drawn in two passes: first
 * their solid insides, which write depth, then their smoothed edges, which are tested against
 * depth but don't write it. An edge then blends over whatever is behind it and is hidden by
 * whatever is in front, in any drawing order. In 2D every node is at depth 0 and one pass draws
 * them in order.
 */
export function createNodeProgram(gl, instancing) {
  let info = createProgram(gl, NODE_VERTEX, NODE_FRAGMENT, ['point', 'row', 'size', 'color'], POSITION_UNIFORMS.concat(['part']));
  let quad = createBuffer(gl, NODE_QUAD);
  let a = info.attributes, u = info.uniforms;

  return {
    draw(nodes, positions, modelViewProjection) {
      if (!nodes.count) return;
      gl.useProgram(info.program);
      setPositionUniforms(gl, u, positions, modelViewProjection);
      bindAttribute(gl, instancing, a.point, quad, 2, gl.FLOAT, false, 0);
      bindAttribute(gl, instancing, a.row, nodes.rows, 1, gl.FLOAT, false, 1);
      bindAttribute(gl, instancing, a.size, nodes.sizes, 1, gl.FLOAT, false, 1);
      bindAttribute(gl, instancing, a.color, nodes.colors, 4, gl.UNSIGNED_BYTE, true, 1);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      if (positions.hasDepth) {
        gl.uniform1f(u.part, 1);
        instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, nodes.count);
        gl.depthMask(false);
        gl.uniform1f(u.part, 2);
        instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, nodes.count);
        gl.depthMask(true);
      } else {
        gl.uniform1f(u.part, 0);
        instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, nodes.count);
      }
      gl.disable(gl.DEPTH_TEST);
      [a.point, a.row, a.size, a.color].forEach(location => unbindAttribute(gl, instancing, location));
    },
    dispose() {
      gl.deleteBuffer(quad);
      gl.deleteProgram(info.program);
    }
  };
}

/**
 * Draws `edges.count` edges, `width` pixels wide: buffers `edges.ends` (two rows per edge) and
 * `edges.colors`.
 */
export function createEdgeProgram(gl, instancing) {
  let info = createProgram(gl, EDGE_VERTEX, EDGE_FRAGMENT, ['point', 'ends', 'color'], POSITION_UNIFORMS.concat(['width', 'resolution']));
  let quad = createBuffer(gl, EDGE_QUAD);
  let a = info.attributes, u = info.uniforms;

  return {
    draw(edges, positions, modelViewProjection, drawContext) {
      if (!edges.count) return;
      gl.useProgram(info.program);
      setPositionUniforms(gl, u, positions, modelViewProjection);
      gl.uniform1f(u.width, edges.width);
      gl.uniform2f(u.resolution, drawContext.width, drawContext.height);
      bindAttribute(gl, instancing, a.point, quad, 2, gl.FLOAT, false, 0);
      bindAttribute(gl, instancing, a.ends, edges.ends, 2, gl.FLOAT, false, 1);
      bindAttribute(gl, instancing, a.color, edges.colors, 4, gl.UNSIGNED_BYTE, true, 1);
      instancing.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, edges.count);
      [a.point, a.ends, a.color].forEach(location => unbindAttribute(gl, instancing, location));
    },
    dispose() {
      gl.deleteBuffer(quad);
      gl.deleteProgram(info.program);
    }
  };
}

function setPositionUniforms(gl, u, positions, modelViewProjection) {
  gl.uniformMatrix4fv(u.modelViewProjection, false, modelViewProjection);
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, positions.texture);
  gl.uniform1i(u.positions, 0);
  gl.uniform2f(u.positionsSize, positions.width, positions.rows);
}
