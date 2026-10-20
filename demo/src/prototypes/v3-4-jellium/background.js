import {FIELD, FIELD_MAX_U} from './diskField.js';

const FIELD_STEPS = FIELD.length - 1;

/**
 * Adds an even "background" of opposite charge under the nodes: a disk, centred at the nodes'
 * mass-weighted centre, that pulls on every node exactly as hard as an evenly spread disk of nodes
 * of the same density would push it. Evenly spread nodes then feel no net force, crowded places
 * still push apart, and empty places pull nodes in.
 *
 * The background's density is measured once, at step `startStep`, as `density` times the typical
 * local density of the nodes at that moment, and then kept. Measuring it every step feeds back:
 * the pull makes the drawing denser, the background follows, and the drawing collapses.
 * Its total charge is (1 + extra) times the nodes' total mass, so pieces that already drifted
 * far away are pulled back.
 *
 * Works in 2D only. Costs two passes over the bodies per step.
 */
export default function addBackground(layout, options) {
  const simulator = layout.simulator;
  const bodies = simulator.bodies;
  const density = options.density;
  const extra = options.extra;
  const startStep = Math.max(0, Math.round(options.startStep));
  let sigma = 0, radius = 0;

  simulator.addForce('neutral-background', backgroundForce);
  return {
    getRadius: () => radius
  };

  function backgroundForce(iteration) {
    if (iteration < startStep || bodies.length < 8) return;
    var gravity = simulator.settings.gravity;
    if (!(gravity < 0)) return; // the background only makes sense for repelling nodes

    var totalMass = 0, cx = 0, cy = 0, i, body;
    for (i = 0; i < bodies.length; ++i) {
      body = bodies[i];
      totalMass += body.mass;
      cx += body.mass * body.pos.x;
      cy += body.mass * body.pos.y;
    }
    cx /= totalMass;
    cy /= totalMass;

    if (!sigma) {
      var nodesPerArea = typicalDensity(bodies, 6);
      if (!(nodesPerArea > 0)) return;
      sigma = density * nodesPerArea * totalMass / bodies.length;
      radius = Math.sqrt((1 + extra) * totalMass / (Math.PI * sigma));
    }

    for (i = 0; i < bodies.length; ++i) {
      body = bodies[i];
      if (body.isPinned) continue;
      var dx = body.pos.x - cx, dy = body.pos.y - cy;
      var s = Math.sqrt(dx * dx + dy * dy);
      if (s === 0) continue;
      // gravity < 0, so this points toward the centre
      var f = gravity * body.mass * sigma * diskPush(s / radius) / s;
      body.force.x += f * dx;
      body.force.y += f * dy;
    }
  }
}

function diskPush(u) {
  if (u >= FIELD_MAX_U) return FIELD[FIELD_STEPS] * FIELD_MAX_U * FIELD_MAX_U / (u * u);
  var x = u / FIELD_MAX_U * FIELD_STEPS;
  var i = Math.floor(x), t = x - i;
  return FIELD[i] * (1 - t) + FIELD[i + 1] * t;
}

/**
 * Median over (up to 1500 sampled) nodes of k / (pi d^2), where d is the distance to the node's
 * k-th nearest neighbour: how many nodes per unit of area there typically are around a node.
 */
function typicalDensity(bodies, k) {
  var n = bodies.length;
  var x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, i;
  for (i = 0; i < n; ++i) {
    var p = bodies[i].pos;
    if (p.x < x0) x0 = p.x;
    if (p.x > x1) x1 = p.x;
    if (p.y < y0) y0 = p.y;
    if (p.y > y1) y1 = p.y;
  }
  // grid cell size so that occupied cells hold about four nodes on average
  var cell = Math.max(1e-6, Math.sqrt(Math.max((x1 - x0) * (y1 - y0), 1e-9) / n));
  var grid;
  for (var attempt = 0; attempt < 12; ++attempt) {
    grid = new Map();
    for (i = 0; i < n; ++i) {
      var key = cellKey(Math.floor((bodies[i].pos.x - x0) / cell), Math.floor((bodies[i].pos.y - y0) / cell));
      var list = grid.get(key);
      if (!list) grid.set(key, list = []);
      list.push(i);
    }
    if (n / grid.size <= 4) break;
    cell /= 2;
  }

  var densities = [];
  var stride = Math.max(1, Math.floor(n / 1500));
  for (i = 0; i < n; i += stride) {
    var me = bodies[i].pos;
    var bx = Math.floor((me.x - x0) / cell), by = Math.floor((me.y - y0) / cell);
    var distances = [];
    for (var ring = 0; ring < 64; ++ring) {
      for (var gx = bx - ring; gx <= bx + ring; ++gx) {
        for (var gy = by - ring; gy <= by + ring; ++gy) {
          if (Math.max(Math.abs(gx - bx), Math.abs(gy - by)) !== ring) continue;
          var others = grid.get(cellKey(gx, gy));
          if (!others) continue;
          for (var j = 0; j < others.length; ++j) {
            if (others[j] === i) continue;
            var other = bodies[others[j]].pos;
            distances.push(Math.hypot(other.x - me.x, other.y - me.y));
          }
        }
      }
      // everything within `ring` cells is found; stop once the k-th nearest is that close
      if (distances.length >= k && ring >= 1) {
        distances.sort(byNumber);
        if (distances[k - 1] <= ring * cell) break;
      }
    }
    distances.sort(byNumber);
    var d = distances[Math.min(k, distances.length) - 1] || cell;
    densities.push(k / (Math.PI * d * d));
  }
  densities.sort(byNumber);
  return densities[densities.length >> 1];
}

function cellKey(x, y) {
  return x * 1048576 + y;
}

function byNumber(a, b) {
  return a - b;
}
