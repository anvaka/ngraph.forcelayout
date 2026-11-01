// Small WebGL 1 helpers. The view draws with plain WebGL inside a w-gl element, so it works next to
// w-gl's own collections (which use WebGL 1 and ANGLE_instanced_arrays) on the same context.

/**
 * What the view needs from WebGL 1: instancing, float textures, and texture reads in vertex
 * shaders (nodes and edges read positions from a texture). Throws an Error that says what is
 * missing.
 */
export function getCapabilities(gl) {
  let instancing = gl.getExtension('ANGLE_instanced_arrays');
  let floatTextures = gl.getExtension('OES_texture_float');
  let vertexTextures = gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) > 0;
  let missing = [];
  if (!instancing) missing.push('ANGLE_instanced_arrays');
  if (!floatTextures) missing.push('OES_texture_float');
  if (!vertexTextures) missing.push('textures in vertex shaders');
  if (missing.length) throw new Error('This browser\'s WebGL lacks ' + missing.join(', ') + ', which the view needs');
  // Optional: smooth edges of nodes (the node shader checks for it)
  gl.getExtension('OES_standard_derivatives');
  return {instancing, maxTextureSize: gl.getParameter(gl.MAX_TEXTURE_SIZE)};
}

/**
 * Compiles and links a program. `attributes` lists the attribute names in the order of their
 * locations; the first one must be a per-vertex (not per-instance) attribute, as some drivers
 * need location 0 to be one.
 */
export function createProgram(gl, vertexSource, fragmentSource, attributes, uniforms) {
  let vertex = compile(gl, gl.VERTEX_SHADER, vertexSource);
  let fragment = compile(gl, gl.FRAGMENT_SHADER, fragmentSource);
  let program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  attributes.forEach((name, location) => gl.bindAttribLocation(program, location, name));
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    let log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error('Linking a view program failed: ' + log);
  }
  let locations = {};
  attributes.forEach((name, location) => { locations[name] = location; });
  let uniformLocations = {};
  uniforms.forEach(name => { uniformLocations[name] = gl.getUniformLocation(program, name); });
  return {program, attributes: locations, uniforms: uniformLocations};
}

function compile(gl, type, source) {
  let shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    let log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error('Compiling a view shader failed: ' + log);
  }
  return shader;
}

/** A buffer holding `data` (a typed array) */
export function createBuffer(gl, data) {
  let buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  return buffer;
}

/** Replaces the contents of `buffer` */
export function setBufferData(gl, buffer, data) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
}

/** An RGBA float texture of `width` x `height` texels, read without filtering */
export function createFloatTexture(gl, width, height) {
  let texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
  return texture;
}

/**
 * Points attribute `location` at `buffer`: `size` components of `type` per vertex (or per
 * instance with `divisor` 1).
 */
export function bindAttribute(gl, instancing, location, buffer, size, type, normalized, divisor) {
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, size, type, normalized, 0, 0);
  instancing.vertexAttribDivisorANGLE(location, divisor);
}

/** Undoes bindAttribute(), so w-gl's programs find the attribute state they expect */
export function unbindAttribute(gl, instancing, location) {
  instancing.vertexAttribDivisorANGLE(location, 0);
  gl.disableVertexAttribArray(location);
}
