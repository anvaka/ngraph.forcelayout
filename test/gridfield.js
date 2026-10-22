var test = require('tap').test;
var createSimulator = require('../lib/createPhysicsSimulator');

// modules/gridfield is an ES module (Node loads it with require since 22.12)
var gridField = Promise.resolve(require('../modules/gridfield/index.js').default);

// A simulator with `count` bodies in a few clumps, two on the same spot
function makeSimulator(dimensions, count, seed) {
  var random = require('ngraph.random').random(seed || 3);
  var sim = createSimulator({ dimensions: dimensions });
  for (var i = 0; i < count; ++i) {
    var pos = {};
    var clump = i % 3;
    for (var k = 0; k < dimensions; ++k) pos['xyz'[k] || 'c' + (k + 1)] = i < 2 ? 4 : clump * 40 + (random.nextDouble() - 0.5) * (8 + 10 * clump);
    sim.addBodyAt(pos);
  }
  for (i = 0; i < count; ++i) sim.store.mass[i] = 1 + (i % 4);
  return sim;
}

// The field written plainly: every body's stencil as a list, a dense grid, line solves one line
// at a time. Same rules as the module, different code.
function reference(sim, o) {
  var store = sim.store, n = store.n, D = store.D;
  var quadratic = o.weights === 'quadratic', pad = quadratic ? 1 : 0;
  var lo = [], hi = [];
  for (var k = 0; k < D; ++k) {
    lo[k] = Infinity; hi[k] = -Infinity;
    for (var i = 0; i < n; ++i) { lo[k] = Math.min(lo[k], store.pos[i * D + k]); hi[k] = Math.max(hi[k], store.pos[i * D + k]); }
  }
  var cell = o.cell, size = [], coordinate;
  if (o.anchor === 'box') {
    for (k = 0; k < D; ++k) cell = Math.max(cell, (hi[k] + o.margin - (lo[k] - o.margin)) / o.maxCells);
    var origin = [];
    for (k = 0; k < D; ++k) {
      size[k] = Math.min(Math.ceil((hi[k] + o.margin - (lo[k] - o.margin)) / cell), o.maxCells) + 2 + 2 * pad;
      origin[k] = lo[k] - o.margin - pad * cell;
    }
    coordinate = function (x, axis) { return { g: (x - origin[axis]) / cell, shift: 0 }; };
  } else {
    var first = [];
    for (k = 0; k < D; ++k) {
      first[k] = Math.floor((lo[k] - o.margin) / cell) - pad;
      size[k] = Math.floor((hi[k] + o.margin) / cell) - Math.floor((lo[k] - o.margin) / cell) + 2 + 2 * pad;
    }
    coordinate = function (x, axis) { return { g: x / cell, shift: first[axis] }; };
  }
  var cells = size.reduce(function (a, b) { return a * b; }, 1);
  var area = Math.pow(cell, D);
  var stencils = [];
  for (i = 0; i < n; ++i) {
    var axes = [];
    for (k = 0; k < D; ++k) {
      var c = coordinate(store.pos[i * D + k], k), points = [];
      if (quadratic) {
        var base = Math.round(c.g), d = c.g - base;
        points.push({ at: base - 1 - c.shift, w: 0.5 * (0.5 - d) * (0.5 - d), s: -(0.5 - d) });
        points.push({ at: base - c.shift, w: 0.75 - d * d, s: -2 * d });
        points.push({ at: base + 1 - c.shift, w: 0.5 * (0.5 + d) * (0.5 + d), s: 0.5 + d });
      } else {
        var low = Math.floor(c.g), f = c.g - low;
        points.push({ at: low - c.shift, w: 1 - f, s: -1 });
        points.push({ at: low + 1 - c.shift, w: f, s: 1 });
      }
      axes.push(points);
    }
    var list = [{ index: 0, stride: 1, w: 1, s: new Array(D).fill(1) }];
    axes.forEach(function (along, axis) {
      var next = [];
      list.forEach(function (entry) {
        along.forEach(function (p) {
          next.push({
            index: entry.index + p.at * entry.stride, stride: entry.stride * size[axis], w: entry.w * p.w,
            s: entry.s.map(function (v, m) { return v * (m === axis ? p.s : p.w); })
          });
        });
      });
      list = next;
    });
    stencils.push(list);
  }
  var value = o.value || function () { return 1; };
  var deposit = function (field, body, sign) {
    stencils[body].forEach(function (p) { field[p.index] += sign * value(body) * p.w / area; });
  };
  var F = new Float64Array(cells);
  stencils.forEach(function (entries, body) { deposit(F, body, 1); });
  var smoothed = function (field) {
    if (!o.diffuse) return field;
    var g = o.diffuse / (cell * cell), stride = 1;
    for (var axis = 0; axis < D; ++axis) {
      var length = size[axis];
      for (var start = 0; start < cells; ++start) {
        if (Math.floor(start / stride) % length !== 0) continue; // first point of a line along this axis
        var line = [];
        for (var j = 0; j < length; ++j) line.push(field[start + j * stride]);
        var solved = solve(line, g);
        for (j = 0; j < length; ++j) field[start + j * stride] = solved[j];
      }
      stride *= length;
    }
    return field;
  };
  var out = new Float64Array(n), gradient = new Float64Array(n * D);
  var read = function (field, body) {
    stencils[body].forEach(function (p) {
      out[body] += p.w * field[p.index];
      for (var axis = 0; axis < D; ++axis) gradient[body * D + axis] += p.s[axis] * field[p.index] / cell;
    });
  };
  if (o.self !== 'exclude') {
    var all = smoothed(F);
    stencils.forEach(function (entries, body) { read(all, body); });
  } else {
    // what the others deposited, smoothed, for every body
    stencils.forEach(function (entries, body) {
      var others = Float64Array.from(F);
      deposit(others, body, -1);
      read(smoothed(others), body);
    });
  }
  return { value: out, gradient: gradient, cells: cells };
}

// -g u[i-1] + (1 + 2g) u[i] - g u[i+1] = rhs[i], zero outside
function solve(rhs, g) {
  var L = rhs.length, c = [], d = [], a = -g, b = 1 + 2 * g;
  c[0] = a / b; d[0] = rhs[0] / b;
  for (var i = 1; i < L; ++i) {
    var m = b - a * c[i - 1];
    c[i] = a / m;
    d[i] = (rhs[i] - a * d[i - 1]) / m;
  }
  var u = new Array(L);
  u[L - 1] = d[L - 1];
  for (i = L - 2; i >= 0; --i) u[i] = d[i] - c[i] * u[i + 1];
  return u;
}

// The reference, computed where the stage `name` runs (the quad tree nudges bodies that share a
// spot, so positions at the start of the step are not the ones the field sees)
function expectedAt(sim, name, o) {
  var expected = {};
  sim.addStage('reference', function () {
    var result = reference(sim, o);
    expected.value = result.value;
    expected.gradient = result.gradient;
  }, { before: name });
  return expected;
}

function relative(a, b) {
  var num = 0, den = 0;
  for (var i = 0; i < b.length; ++i) { num += (a[i] - b[i]) * (a[i] - b[i]); den += b[i] * b[i]; }
  return Math.sqrt(num / (den || 1));
}

test('grid field matches a plain reference', function (t) {
  return gridField.then(function (addGridField) {
    [2, 3].forEach(function (D) {
      ['box', 'lattice'].forEach(function (anchor) {
        ['linear', 'quadratic'].forEach(function (weights) {
          ['include', 'exclude'].forEach(function (self) {
            [0, 30].forEach(function (diffuse) {
              var sim = makeSimulator(D, 60);
              var o = {
                anchor: anchor, weights: weights, self: self, cell: 3, margin: 5, diffuse: diffuse,
                // a small box cap, so the cell grows
                maxCells: anchor === 'box' && D === 2 ? 20 : 1000
              };
              addGridField(sim, 'field', {
                anchor: anchor, cell: 'h', margin: 'm', maxCells: o.maxCells, self: self,
                deposit: { weights: weights },
                smooth: diffuse ? { diffuse: diffuse } : undefined,
                params: { h: 3, m: function () { return 5; } },
                into: { value: 'density', gradient: 'slope' }
              });
              var expected = expectedAt(sim, 'field', o);
              sim.step();
              var name = D + 'D ' + anchor + ' ' + weights + ' ' + self + (diffuse ? ' smoothed' : '');
              t.ok(relative(sim.store.density.subarray(0, 60), expected.value) < 1e-12, name + ': value');
              t.ok(relative(sim.store.slope.subarray(0, 60 * D), expected.gradient) < 1e-12, name + ': gradient');
            });
          });
        });
      });
    });
  });
});

test('deposit values can read body columns and params', function (t) {
  return gridField.then(function (addGridField) {
    [2, 3].forEach(function (D) {
      [0, 6].forEach(function (diffuse) {
        var sim = makeSimulator(D, 40);
        addGridField(sim, 'field', {
          anchor: 'lattice', cell: 2, margin: 3, deposit: { value: 'k * mass', weights: 'quadratic' }, self: 'exclude',
          smooth: diffuse ? { diffuse: diffuse } : undefined,
          params: { k: 0.5 }, into: { value: 'density', gradient: 'slope' }
        });
        var expected = expectedAt(sim, 'field', {
          anchor: 'lattice', weights: 'quadratic', self: 'exclude', cell: 2, margin: 3, diffuse: diffuse,
          value: function (i) { return 0.5 * sim.store.mass[i]; }
        });
        sim.step();
        var name = D + 'D' + (diffuse ? ' smoothed' : '');
        t.ok(relative(sim.store.density.subarray(0, 40), expected.value) < 1e-12, name + ': value');
        t.ok(relative(sim.store.slope.subarray(0, 40 * D), expected.gradient) < 1e-12, name + ': gradient');
      });
    });
  });
});

test('a spread out lattice keeps only touched cells, with the same numbers', function (t) {
  return gridField.then(function (addGridField) {
    [2, 3].forEach(function (D) {
      ['linear', 'quadratic'].forEach(function (weights) {
        var columns = [];
        [Infinity, 0].forEach(function (denseLimit) {
          // bodies far apart: hundreds of grid cells each, so the hash map grows a few times
          var sim = makeSimulator(D, 400, 5);
          for (var i = 0; i < sim.store.n * D; ++i) sim.store.pos[i] *= 9;
          addGridField(sim, 'field', {
            anchor: 'lattice', cell: 1.5, margin: 2, deposit: { weights: weights, value: 'mass' }, self: 'exclude',
            denseLimit: denseLimit, into: { value: 'v', gradient: 'g' }
          });
          ['clear', 'repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
          sim.step();
          columns.push(Array.from(sim.store.v.subarray(0, 400)).concat(Array.from(sim.store.g.subarray(0, 400 * D))));
        });
        var same = columns[0].every(function (v, i) { return Object.is(v, columns[1][i]); });
        t.ok(same, D + 'D ' + weights + ': hash map and dense grid agree exactly');
      });
    });
  });
});

test('a lone body that leaves its own share out feels nothing, smoothed or not', function (t) {
  return gridField.then(function (addGridField) {
    [2, 3].forEach(function (D) {
      ['box', 'lattice'].forEach(function (anchor) {
        ['linear', 'quadratic'].forEach(function (weights) {
          [0, 4].forEach(function (diffuse) {
            var sim = createSimulator({ dimensions: D });
            sim.addBodyAt(D === 2 ? { x: 1.3, y: -0.4 } : { x: 1.3, y: -0.4, z: 2.2 });
            var options = { anchor: anchor, cell: 1, margin: 3, deposit: { weights: weights }, into: { value: 'v', gradient: 'g' } };
            if (diffuse) options.smooth = { diffuse: diffuse };
            addGridField(sim, 'alone', Object.assign({ self: 'exclude' }, options));
            addGridField(sim, 'all', Object.assign({}, options, { into: { value: 'v2', gradient: 'g2' } }));
            sim.step();
            var name = D + 'D ' + anchor + ' ' + weights + (diffuse ? ' smoothed' : '');
            // its own reading, for scale
            var scale = Math.abs(sim.store.v2[0]);
            t.ok(scale > 0, name + ': it reads its own share when included');
            t.ok(Math.abs(sim.store.v[0]) <= 1e-14 * scale, name + ': no density of others');
            t.ok(Array.from(sim.store.g.subarray(0, D)).every(function (g) { return Math.abs(g) <= 1e-14 * scale; }), name + ': no slope');
          });
        });
      });
    });
  });
});

test('the density adds up to the deposits', function (t) {
  return gridField.then(function (addGridField) {
    // Two bodies on the same spot, cloud-in-cell: each reads the bilinear density, which
    // integrates to 2 over the plane; at a grid point it is 2 / cell^2
    var sim = createSimulator({ dimensions: 2 });
    sim.addBodyAt({ x: 4, y: 4 });
    sim.addBodyAt({ x: 4, y: 4 });
    addGridField(sim, 'pair', { anchor: 'lattice', cell: 2, into: { value: 'v', gradient: 'g' } });
    sim.step();
    t.equal(sim.store.v[0], 0.5, 'two bodies on one grid point of a 2 x 2 cell');
  });
});

test('bodies at infinity or NaN do not break the grid', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 10);
    sim.store.pos[0] = Infinity;
    sim.store.pos[3] = NaN;
    addGridField(sim, 'field', { anchor: 'box', cell: 1, maxCells: 64, into: { value: 'v', gradient: 'g' } });
    // the tree cannot take a body at infinity; only the field runs
    ['clear', 'repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
    sim.step();
    t.ok(Number.isFinite(sim.store.v[5]) && sim.store.v[5] > 0, 'others still get a density');
  });
});

test('a body thrown far away does not change the others', function (t) {
  return gridField.then(function (addGridField) {
    var readings = function (far) {
      var sim = createSimulator({ dimensions: 2 });
      [[0.2, 0.3], [1.1, 0.4], [0.7, 1.5], [1.9, 1.2]].forEach(function (p) { sim.addBodyAt({ x: p[0], y: p[1] }); });
      if (far !== undefined) sim.addBodyAt({ x: far, y: 0 });
      addGridField(sim, 'field', { anchor: 'lattice', cell: 1, deposit: { weights: 'quadratic' }, self: 'exclude', into: { value: 'v', gradient: 'g' } });
      ['clear', 'repulsion', 'drag', 'springs', 'integrate'].forEach(function (name) { sim.removeStage(name); });
      sim.step();
      return Array.from(sim.store.v.subarray(0, 4)).concat(Array.from(sim.store.g.subarray(0, 8)));
    };
    var near = readings();
    [1e8, 2.5e9, 5e9, 1e12, 1e300].forEach(function (far) {
      t.same(readings(far), near, 'a body at x = ' + far);
    });
  });
});

test('a smoothed lattice wider than maxCells stops with a message', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 10);
    addGridField(sim, 'gas', { anchor: 'lattice', cell: 1, maxCells: 32, smooth: { diffuse: 1 }, into: { value: 'v', gradient: 'g' } });
    t.throws(function () { sim.step(); }, /Grid field gas: the layout spans \d+ cells at cell 1; maxCells is 32/);
  });
});

test('`when` runs the field only on some steps', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 10);
    addGridField(sim, 'field', { cell: 1, when: 'step - floor(step / 2) * 2 == 0', into: { value: 'v', gradient: 'g' } });
    sim.step();
    var first = sim.store.v[3];
    sim.store.v[3] = 7;
    sim.step();
    t.equal(sim.store.v[3], 7, 'skipped on step 1');
    sim.step();
    t.ok(sim.store.v[3] !== 7 && first > 0, 'runs on steps 0 and 2');
    t.ok(sim.program().stages.filter(function (s) { return s.name === 'field'; })[0].when, 'the description has the gate');
  });
});

test('a cell of 0 turns the field off', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 10);
    addGridField(sim, 'field', { cell: 'springLength * s', params: { s: 0 }, into: { value: 'v', gradient: 'g' } });
    sim.store.v.fill(7);
    sim.step();
    t.equal(sim.store.v[3], 0, 'value 0');
  });
});

test('options are checked', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 4);
    var into = { value: 'v', gradient: 'g' };
    t.throws(function () { addGridField(makeSimulator(4, 4), 'f', { cell: 1, into: into }); }, /grid fields are 2D and 3D; this layout has 4 dimensions/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, anchor: 'ring', into: into }); }, /anchor should be 'box' or 'lattice'/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, deposit: { weights: 'cubic' }, into: into }); }, /deposit.weights/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, self: 'maybe', into: into }); }, /self should be/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, into: { value: 'v' } }); }, /needs two column names/);
    t.throws(function () { addGridField(sim, 'f', { into: into }); }, /needs a cell size/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, maxCells: 2.5, into: into }); }, /maxCells/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, smooth: {}, into: into }); }, /smooth needs diffuse/);
    t.throws(function () { addGridField(sim, 'f', { cell: 'h +', into: into }); }, /Grid field f, cell/);
    t.throws(function () { addGridField(sim, 'f', { cell: 'mass', into: into }); }, /Grid field f, cell/);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, params: { unit: 2 }, into: into }); }, /parameter unit/);
    sim.store.define('g3', Float64Array, 3);
    t.throws(function () { addGridField(sim, 'f', { cell: 1, into: { value: 'v', gradient: 'g3' } }); }, /column g3 should have 2/);
  });
});

test('description and dispose', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 4);
    sim.store.define('v');
    var field = addGridField(sim, 'field', {
      anchor: 'lattice', cell: 'unit / 2', margin: 1, smooth: { diffuse: 'r * r' }, params: { r: function () { return 3; } },
      deposit: { value: 'mass', weights: 'quadratic' }, self: 'exclude', after: 'springs',
      into: { value: 'v', gradient: 'g' }
    });
    t.same(sim.stages(), ['clear', 'repulsion', 'drag', 'springs', 'field', 'integrate'], 'placed after springs');
    t.equal(field.name, 'field', 'handle');
    t.ok(sim.store.has('g') && sim.store.has('v'), 'columns');
    field.dispose();
    t.notOk(sim.getStage('field'), 'stage removed');
    t.notOk(sim.store.has('g'), 'its own column removed');
    t.ok(sim.store.has('v'), 'a column it did not define stays');
  });
});

test('the stage describes itself for other engines', function (t) {
  return gridField.then(function (addGridField) {
    var sim = makeSimulator(2, 4);
    addGridField(sim, 'gas', {
      anchor: 'lattice', cell: 'h', params: { h: function (context) { return context.settings.springLength / 10; } },
      deposit: { weights: 'quadratic', value: 'mass' }, self: 'exclude', into: { value: 'gasDensity', gradient: 'gasSlope' }
    });
    var stage = sim.program().stages.filter(function (s) { return s.name === 'gas'; })[0];
    t.equal(stage.shape, 'grid', 'shape');
    t.same(stage.reads.map(function (r) { return r.column + ' ' + r.rows; }), ['pos own', 'pos other', 'mass own', 'mass other'],
      'reads positions and the deposit column, its own and the others\'');
    t.same(stage.writes, [
      { space: 'nodes', column: 'gasDensity', mode: 'set' },
      { space: 'nodes', column: 'gasSlope', mode: 'set' }
    ], 'writes two columns');
    t.same(stage.params, [{ name: 'h', kind: 'host' }], 'a host param');
    t.same(stage.args.cell, { kind: 'expression', text: 'h' }, 'cell as text');
    t.equal(stage.args.anchor, 'lattice', 'options in args');
    t.equal(stage.args.maxCells, 2048, 'a 2D lattice stops past 2048 cells per axis by default');
    var values = sim.stageValues('gas');
    t.same([values.when, values.params, values.cell, values.margin, values.diffuse, values.value], [true, { h: 1 }, 1, 0, 0, null], 'numbers of this step');
    t.same(sim.stageValues('gas', sim.stepContext(7)).cell, 1, 'numbers of a queued step');
    t.equal(sim.plan().stages.filter(function (s) { return s.stage === 'gas'; })[0].how, 'generated loops: a lattice grid, quadratic weights', 'how the CPU runs it');
  });
});
