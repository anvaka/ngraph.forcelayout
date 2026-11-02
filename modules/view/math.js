// Camera math for picking and dragging, in the coordinates of the view's element (the layout's
// coordinates) and in CSS pixels of the canvas. Matrices are column-major, as in WebGL and gl-matrix.

/** `out` = `a` × `b`. `out` must be neither of them. */
export function multiply(out, a, b) {
  for (let c = 0; c < 4; ++c) {
    let b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3];
    for (let r = 0; r < 4; ++r) {
      out[c * 4 + r] = a[r] * b0 + a[4 + r] * b1 + a[8 + r] * b2 + a[12 + r] * b3;
    }
  }
  return out;
}

/** The inverse of `a` into `out`, or null when `a` has none */
export function invert(out, a) {
  let a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
  let a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
  let a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
  let a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
  let b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10, b02 = a00 * a13 - a03 * a10;
  let b03 = a01 * a12 - a02 * a11, b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12;
  let b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30, b08 = a20 * a33 - a23 * a30;
  let b09 = a21 * a32 - a22 * a31, b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32;
  let det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
  if (!det) return null;
  det = 1 / det;
  out[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det;
  out[1] = (a02 * b10 - a01 * b11 - a03 * b09) * det;
  out[2] = (a31 * b05 - a32 * b04 + a33 * b03) * det;
  out[3] = (a22 * b04 - a21 * b05 - a23 * b03) * det;
  out[4] = (a12 * b08 - a10 * b11 - a13 * b07) * det;
  out[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det;
  out[6] = (a32 * b02 - a30 * b05 - a33 * b01) * det;
  out[7] = (a20 * b05 - a22 * b02 + a23 * b01) * det;
  out[8] = (a10 * b10 - a11 * b08 + a13 * b06) * det;
  out[9] = (a01 * b08 - a00 * b10 - a03 * b06) * det;
  out[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det;
  out[11] = (a21 * b02 - a20 * b04 - a23 * b00) * det;
  out[12] = (a11 * b07 - a10 * b09 - a12 * b06) * det;
  out[13] = (a00 * b09 - a01 * b07 + a02 * b06) * det;
  out[14] = (a31 * b01 - a30 * b03 - a32 * b00) * det;
  out[15] = (a20 * b03 - a21 * b01 + a22 * b00) * det;
  return out;
}

/**
 * Turns points of the scene into points of the canvas and back. `set()` takes the camera of a
 * frame: the projection and view matrices, the element's world model, and the canvas size in CSS
 * pixels. Screen points are CSS pixels from the canvas's top left corner.
 */
export function createProjector() {
  let mvp = new Float64Array(16);
  let inverse = new Float64Array(16);
  let viewModel = new Float64Array(16);
  let width = 1, height = 1;
  // CSS pixels per unit of the scene at clip w = 1 (see pixelsPerUnit())
  let yScale = 1;
  let invertible = false;
  let near = [0, 0, 0], far = [0, 0, 0];

  let projector = {
    mvp,
    get width() { return width; },
    get height() { return height; },
    set(projection, view, model, cssWidth, cssHeight) {
      multiply(viewModel, view, model);
      multiply(mvp, projection, viewModel);
      invertible = invert(inverse, mvp) !== null;
      width = cssWidth || 1;
      height = cssHeight || 1;
      // How far clip y moves for one unit of the scene, in the direction where it moves most
      yScale = 0.5 * height * Math.hypot(mvp[1], mvp[5], mvp[9]);
      return projector;
    },

    /** A point of the scene on the canvas: `out.x`, `out.y` and its clip `out.w`; false behind the camera */
    toScreen(x, y, z, out) {
      let w = mvp[3] * x + mvp[7] * y + mvp[11] * z + mvp[15];
      if (!(w > 0)) return false;
      out.x = ((mvp[0] * x + mvp[4] * y + mvp[8] * z + mvp[12]) / w + 1) * 0.5 * width;
      out.y = (1 - (mvp[1] * x + mvp[5] * y + mvp[9] * z + mvp[13]) / w) * 0.5 * height;
      out.w = w;
      return true;
    },

    /** CSS pixels per unit of the scene, at a point whose clip w is `w` */
    pixelsPerUnit(w) {
      return yScale / w;
    },

    /**
     * The ray from the camera through a point of the canvas: `out.origin` and `out.direction`
     * (not normalized). False when the camera can't be inverted.
     */
    ray(sx, sy, out) {
      if (!invertible) return false;
      let nx = (sx / width) * 2 - 1;
      let ny = 1 - (sy / height) * 2;
      // The near plane, and a plane between it and infinity (w-gl's far plane is at infinity)
      if (!unproject(nx, ny, -1, near) || !unproject(nx, ny, 0, far)) return false;
      out.origin[0] = near[0]; out.origin[1] = near[1]; out.origin[2] = near[2];
      out.direction[0] = far[0] - near[0];
      out.direction[1] = far[1] - near[1];
      out.direction[2] = far[2] - near[2];
      return true;
    },

    /**
     * Where the ray through a canvas point meets the plane through `point` with `normal`, into
     * `out` ([x, y, z]). False when it misses (parallel, or behind the camera).
     */
    onPlane(sx, sy, point, normal, out) {
      let ray = scratchRay;
      if (!projector.ray(sx, sy, ray)) return false;
      let o = ray.origin, d = ray.direction;
      let denominator = d[0] * normal[0] + d[1] * normal[1] + d[2] * normal[2];
      if (Math.abs(denominator) < 1e-12) return false;
      let t = ((point[0] - o[0]) * normal[0] + (point[1] - o[1]) * normal[1] + (point[2] - o[2]) * normal[2]) / denominator;
      if (!(t > 0) || !Number.isFinite(t)) return false;
      out[0] = o[0] + t * d[0];
      out[1] = o[1] + t * d[1];
      out[2] = o[2] + t * d[2];
      return true;
    },

    /** The direction the camera looks in, through the middle of the canvas, into `out` (unit length) */
    forward(out) {
      let ray = scratchRay;
      if (!projector.ray(width / 2, height / 2, ray)) return false;
      let d = ray.direction, length = Math.hypot(d[0], d[1], d[2]);
      if (!length) return false;
      out[0] = d[0] / length; out[1] = d[1] / length; out[2] = d[2] / length;
      return true;
    }
  };
  let scratchRay = {origin: [0, 0, 0], direction: [0, 0, 0]};
  return projector;

  function unproject(nx, ny, nz, out) {
    let m = inverse;
    let w = m[3] * nx + m[7] * ny + m[11] * nz + m[15];
    if (!w) return false;
    out[0] = (m[0] * nx + m[4] * ny + m[8] * nz + m[12]) / w;
    out[1] = (m[1] * nx + m[5] * ny + m[9] * nz + m[13]) / w;
    out[2] = (m[2] * nx + m[6] * ny + m[10] * nz + m[14]) / w;
    return true;
  }
}

export const Z_NORMAL = [0, 0, 1];
export const ORIGIN = [0, 0, 0];
