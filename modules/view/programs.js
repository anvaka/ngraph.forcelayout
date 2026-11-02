// The two programs of the view: nodes as round points, edges as lines of a fixed width on screen.
// Both read node positions from the positions texture (see positions.js), so the CPU never touches
// an edge after it is built. The texture's fourth float holds the node's flags (see flags.js):
// nodes and links read their style from it with the same fetch.
//
// Edges smooth their own sides: the quad is half a pixel wider on each side than the line, and
// the fragment shader scales alpha by how much of the pixel the line covers. Multisampling (the
// WebGL default) is not needed, and should be off: with it, every blended edge fragment is written
// to every sample, which made edges the most expensive part of a frame. Nodes smooth their round
// edge the same way, over one pixel (with OES_standard_derivatives; without it the edge is hard).
//
// Each program draws in two passes. The first (`pass` 0) skips nodes flagged ON_TOP and the links
// that touch them; the second (`pass` 1) draws only those, from short lists, after everything
// else, so a highlight is never buried under faint links.
import {createProgram, createBuffer, bindAttribute, unbindAttribute} from './gl.js';

// Row `i` of the positions texture: xyz, and the node's flags in w. Layers of modules (labels)
// read positions the same way.
export const POSITION_OF = `
  uniform highp sampler2D positions;
  uniform vec2 positionsSize;
  vec4 positionOf(float row) {
    float y = floor(row / positionsSize.x);
    float x = row - y * positionsSize.x;
    return texture2D(positions, vec2((x + 0.5) / positionsSize.x, (y + 0.5) / positionsSize.y));
  }
  // 1.0 when flags has the bit (a power of two)
  float hasFlag(float flags, float bit) {
    return mod(floor(flags / bit + 0.5 / bit), 2.0);
  }
  // Hovered, dragged or focused
  float isPointed(float flags) {
    return max(hasFlag(flags, 1.0), max(hasFlag(flags, 4.0), hasFlag(flags, 8.0)));
  }
  // Out of view: the instance draws nothing
  const vec4 NOWHERE = vec4(0.0, 0.0, 2.0, 1.0);
`;

const NODE_VERTEX = `
  precision highp float;
  uniform mat4 modelViewProjection;
  uniform vec2 resolution;
  uniform float pass;
  // Styles of flagged nodes. Colors with alpha 0 keep the node's own color. Sizes: x scales the
  // node, y is the smallest diameter in pixels.
  uniform vec4 pointedColor;
  uniform vec2 pointedSize;
  uniform vec4 selectedColor;
  uniform vec2 selectedSize;
  // Alpha of nodes that are neither selected, next to a selected node, nor pointed at, while
  // something is selected (1 otherwise)
  uniform float dimAlpha;
  ${POSITION_OF}
  attribute vec2 point; // corner of the quad, per vertex
  attribute float row;  // per node
  attribute float size;
  attribute vec4 color; // 0xRRGGBBAA as four bytes

  varying vec4 vColor;
  varying vec2 vPoint;
  void main() {
    vec4 position = positionOf(row);
    float flags = position.w;
    if (hasFlag(flags, 128.0) != pass) {
      gl_Position = NOWHERE;
      return;
    }
    vec4 c = color.abgr;
    float diameter = size;
    if (flags > 0.0) {
      vec4 center = modelViewProjection * vec4(position.xyz, 1.0);
      // pixels per unit of the scene here
      float scale = 0.5 * resolution.y * length(vec3(modelViewProjection[0][1], modelViewProjection[1][1], modelViewProjection[2][1])) / max(center.w, 1e-6);
      float pointed = isPointed(flags);
      float selected = hasFlag(flags, 2.0);
      if (selected > 0.5) {
        if (selectedColor.a > 0.0) c = selectedColor;
        diameter = max(diameter * selectedSize.x, selectedSize.y / scale);
      }
      if (pointed > 0.5) {
        if (pointedColor.a > 0.0) c = pointedColor;
        diameter = max(diameter * pointedSize.x, pointedSize.y / scale);
      }
      if (pointed + selected + hasFlag(flags, 16.0) < 0.5) c.a *= dimAlpha;
    } else {
      c.a *= dimAlpha;
    }
    gl_Position = modelViewProjection * vec4(position.xyz + vec3(point * diameter, 0.), 1.0);
    vColor = c;
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
  uniform float pass;
  // Alpha (at least) of links that touch a selected or pointed-at node
  uniform float litAlpha;
  uniform float dimAlpha;
  ${POSITION_OF}
  attribute vec2 point; // corner of the quad, per vertex
  attribute vec2 ends;  // rows of the two nodes, per edge
  attribute vec4 color;

  varying vec4 vColor;
  varying float vAcross; // distance from the middle of the line, in pixels
  void main() {
    vec4 from = positionOf(ends.x);
    vec4 to = positionOf(ends.y);
    if (max(hasFlag(from.w, 128.0), hasFlag(to.w, 128.0)) != pass) {
      gl_Position = NOWHERE;
      return;
    }
    vec4 c = color.abgr;
    float lit = max(max(isPointed(from.w), hasFlag(from.w, 2.0)), max(isPointed(to.w), hasFlag(to.w, 2.0)));
    if (lit > 0.5) c.a = max(c.a, litAlpha);
    else c.a *= dimAlpha;

    vec4 clip0 = modelViewProjection * vec4(from.xyz, 1.0);
    vec4 clip1 = modelViewProjection * vec4(to.xyz, 1.0);

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
    vColor = c;
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
 * `style` holds the uniforms of flagged nodes (see index.js), `pass` is 0 or 1 (see above).
 *
 * With depth (`positions.hasDepth`, a layout in 3D or more) nodes are drawn in two passes: first
 * their solid insides, which write depth, then their smoothed edges, which are tested against
 * depth but don't write it. An edge then blends over whatever is behind it and is hidden by
 * whatever is in front, in any drawing order. In 2D every node is at depth 0 and one pass draws
 * them in order.
 */
export function createNodeProgram(gl, instancing) {
  let info = createProgram(gl, NODE_VERTEX, NODE_FRAGMENT, ['point', 'row', 'size', 'color'], POSITION_UNIFORMS.concat([
    'part', 'pass', 'resolution', 'pointedColor', 'pointedSize', 'selectedColor', 'selectedSize', 'dimAlpha'
  ]));
  let quad = createBuffer(gl, NODE_QUAD);
  let a = info.attributes, u = info.uniforms;

  return {
    draw(nodes, positions, modelViewProjection, drawContext, style, pass) {
      if (!nodes.count) return;
      gl.useProgram(info.program);
      setPositionUniforms(gl, u, positions, modelViewProjection);
      gl.uniform1f(u.pass, pass);
      gl.uniform2f(u.resolution, drawContext.width, drawContext.height);
      gl.uniform4fv(u.pointedColor, style.pointedColor);
      gl.uniform2fv(u.pointedSize, style.pointedSize);
      gl.uniform4fv(u.selectedColor, style.selectedColor);
      gl.uniform2fv(u.selectedSize, style.selectedSize);
      gl.uniform1f(u.dimAlpha, style.dimAlpha);
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
 * `edges.colors`. `style.litAlpha` and `style.dimAlpha` style links by the flags of their ends.
 */
export function createEdgeProgram(gl, instancing) {
  let info = createProgram(gl, EDGE_VERTEX, EDGE_FRAGMENT, ['point', 'ends', 'color'], POSITION_UNIFORMS.concat([
    'width', 'resolution', 'pass', 'litAlpha', 'dimAlpha'
  ]));
  let quad = createBuffer(gl, EDGE_QUAD);
  let a = info.attributes, u = info.uniforms;

  return {
    draw(edges, positions, modelViewProjection, drawContext, style, pass) {
      if (!edges.count) return;
      gl.useProgram(info.program);
      setPositionUniforms(gl, u, positions, modelViewProjection);
      gl.uniform1f(u.pass, pass);
      gl.uniform1f(u.litAlpha, style.litAlpha);
      gl.uniform1f(u.dimAlpha, style.dimAlpha);
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
