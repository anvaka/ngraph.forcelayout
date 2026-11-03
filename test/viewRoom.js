var test = require('tap').test;

// modules/view is an ES module; room.js runs without WebGL or a DOM
var room = import('../modules/view/room.js');

// Positions packed as the view packs them: x, y, z and a free fourth float per node
function scatter(n, depth, seed) {
  var random = function () { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  var data = new Float32Array(n * 4), sizes = new Float32Array(n), reach = new Float32Array(n);
  for (var i = 0; i < n; ++i) {
    // a dense core and a sparse rim, like a hairball
    var r = random() < 0.7 ? random() * 20 : 20 + random() * 200, a = random() * 2 * Math.PI;
    data[4 * i] = r * Math.cos(a);
    data[4 * i + 1] = r * Math.sin(a);
    data[4 * i + 2] = depth ? (random() - 0.5) * 40 : 0;
    sizes[i] = random() < 0.05 ? 5 : 0.6;
    reach[i] = sizes[i] > 1 ? 8 : 2;
  }
  return {data: data, sizes: sizes, reach: reach};
}

function bruteForce(nodes, n, depth, i) {
  var limit = nodes.reach[i], best = limit * limit, d = nodes.data;
  for (var j = 0; j < n; ++j) {
    if (j === i || nodes.sizes[j] < nodes.sizes[i]) continue;
    var dx = d[4 * j] - d[4 * i], dy = d[4 * j + 1] - d[4 * i + 1], dz = depth ? d[4 * j + 2] - d[4 * i + 2] : 0;
    best = Math.min(best, dx * dx + dy * dy + dz * dz);
  }
  return best < limit * limit ? Math.sqrt(best) : 0;
}

[false, true].forEach(function (depth) {
  test('rooms are the distance to the nearest node at least as big, within reach (' + (depth ? '3D' : '2D') + ')', async function (t) {
    var computeRooms = (await room).computeRooms;
    var n = 1500, nodes = scatter(n, depth, depth ? 11 : 7), out = new Float32Array(n);
    computeRooms(nodes.data, n, nodes.sizes, nodes.reach, depth, out, {});
    var wrong = 0;
    for (var i = 0; i < n; ++i) {
      var want = bruteForce(nodes, n, depth, i);
      // big nodes look at most a few rings of cells away: what is further leaves them uncapped
      if (Math.abs(out[i] - want) > 1e-4 && !(out[i] === 0 && nodes.sizes[i] > 1)) wrong += 1;
    }
    t.equal(wrong, 0, 'every small node matches a brute-force search');
    t.ok(out.some(function (value) { return value > 0; }), 'crowded nodes have a room');
  });
});

test('a node with nobody near enough has no cap, and a lone node has none', async function (t) {
  var computeRooms = (await room).computeRooms;
  var data = new Float32Array([0, 0, 0, 0, 100, 0, 0, 0]);
  var out = new Float32Array(2);
  computeRooms(data, 2, new Float32Array([1, 1]), new Float32Array([5, 5]), false, out, {});
  t.same(Array.from(out), [0, 0], 'far apart: no cap');
  computeRooms(data, 2, new Float32Array([1, 1]), new Float32Array([200, 200]), false, out, {});
  t.same(Array.from(out), [100, 100], 'within reach: the distance');
  computeRooms(data, 2, new Float32Array([1, 3]), new Float32Array([200, 200]), false, out, {});
  t.same(Array.from(out), [100, 0], 'a big node does not yield to a smaller one');
  computeRooms(data, 1, new Float32Array([1]), new Float32Array([200]), false, out, {});
  t.equal(out[0], 0, 'a lone node');
});
