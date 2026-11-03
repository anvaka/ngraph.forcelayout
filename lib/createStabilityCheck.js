module.exports = createStabilityCheck;

/**
 * Says when a layout has settled: when its drawing has stopped changing ('still'), or when
 * what still changes is only noise ('noise').
 *
 * Every `window` steps it compares where a sample of bodies is now with where they were:
 *  - still: 95% of the bodies moved less than `stillness` of the drawing's size over the last
 *    window (0.002 is 2 px of a drawing shown 1000 px wide), on two checks in a row;
 *  - noise: bodies moved no further over the last four windows than over the last one, as for
 *    jitter or a random walk (mean squared shift over four windows below `noise` times the one
 *    window shift; directed motion gives 16, a random walk 4, jitter 1), on `hold` checks in a
 *    row.
 * Shifts are measured after removing the drift of the whole drawing; pinned bodies are left
 * out. A check costs O(sample size), once per window: nothing per step.
 *
 * Steps are counted by `simulator.iteration()`, so an engine that runs many steps between
 * calls (the GPU, which reads positions back once per batch) gets a check at its next call
 * after a window has passed, over the steps that actually passed.
 */
function createStabilityCheck(simulator, options) {
  options = options || {};
  var window = options.window > 0 ? options.window : 100;
  var stillness = options.stillness >= 0 ? options.stillness : 0.002;
  var noise = options.noise >= 0 ? options.noise : 5;
  var hold = options.hold > 0 ? options.hold : 3;
  var sampleSize = options.sample > 0 ? options.sample : 1000;

  var store = simulator.store;
  var HISTORY = 5; // now and four windows back
  var sample, D, m;
  var ring, ringSteps, ringCount;
  var lastCheck, stillChecks, noiseChecks;
  var state;
  reset();

  return {
    /** Looks at the bodies if a window has passed since the last check; returns `stable` */
    update: update,
    /** Forgets what it saw: positions were moved by hand, the graph or the physics changed */
    reset: reset,
    /** {stable, reason ('still', 'noise' or ''), step (when it settled), stillness, noise} */
    state: function () { return state; }
  };

  function reset() {
    sample = null;
    ringCount = 0;
    lastCheck = -Infinity;
    stillChecks = 0;
    noiseChecks = 0;
    state = {stable: false, reason: '', step: -1, stillness: NaN, noise: NaN};
  }

  function pickSample() {
    var n = store.n;
    D = store.D;
    m = Math.min(n, sampleSize);
    sample = new Int32Array(m);
    if (m === n) {
      for (var i = 0; i < n; ++i) sample[i] = i;
    } else {
      // every k-th row from a fixed offset: rows follow the order nodes were added
      var stride = n / m;
      for (var j = 0; j < m; ++j) sample[j] = Math.floor(j * stride + stride / 2);
    }
    ring = new Float64Array(HISTORY * m * D);
    ringSteps = new Float64Array(HISTORY);
  }

  function update() {
    if (state.stable) return true;
    var step = simulator.iteration();
    if (step - lastCheck < window) return false;
    if (!sample || sample.length !== Math.min(store.n, sampleSize)) pickSample();
    if (m === 0) return settle('still', step);
    lastCheck = step;

    // newest snapshot first: shift the ring
    ring.copyWithin(m * D, 0, (HISTORY - 1) * m * D);
    ringSteps.copyWithin(1, 0, HISTORY - 1);
    var pos = store.pos;
    for (var j = 0; j < m; ++j) {
      var from = sample[j] * D;
      for (var k = 0; k < D; ++k) ring[j * D + k] = pos[from + k];
    }
    ringSteps[0] = step;
    if (ringCount < HISTORY) ringCount += 1;
    if (ringCount < 2) return false;

    var size = drawingSize();
    var one = shifts(1);
    state.stillness = size > 0 ? one.q95 / size : 0;
    stillChecks = state.stillness <= stillness ? stillChecks + 1 : 0;
    if (stillChecks >= 2) return settle('still', step);

    if (ringCount === HISTORY) {
      var four = shifts(HISTORY - 1);
      state.noise = one.msd > 0 ? four.msd / one.msd : Infinity;
      noiseChecks = state.noise < noise ? noiseChecks + 1 : 0;
      if (noiseChecks >= hold) return settle('noise', step);
    }
    return false;
  }

  function settle(reason, step) {
    state.stable = true;
    state.reason = reason;
    state.step = step;
    return true;
  }

  // Shifts between the newest snapshot and the one `back` windows ago, the mean shift removed:
  // their 95th percentile and mean square
  var lengths = null;
  function shifts(back) {
    var pinned = store.pinned;
    var mean = new Float64Array(D), count = 0, j, k;
    var old = back * m * D;
    for (j = 0; j < m; ++j) {
      if (pinned[sample[j]]) continue;
      for (k = 0; k < D; ++k) mean[k] += ring[j * D + k] - ring[old + j * D + k];
      count += 1;
    }
    if (count === 0) return {q95: 0, msd: 0};
    for (k = 0; k < D; ++k) mean[k] /= count;
    if (!lengths || lengths.length !== m) lengths = new Float64Array(m);
    var used = 0, sum = 0;
    for (j = 0; j < m; ++j) {
      if (pinned[sample[j]]) continue;
      var d2 = 0;
      for (k = 0; k < D; ++k) {
        var d = ring[j * D + k] - ring[old + j * D + k] - mean[k];
        d2 += d * d;
      }
      sum += d2;
      lengths[used++] = d2;
    }
    var sorted = lengths.subarray(0, used).sort();
    return {q95: Math.sqrt(sorted[Math.floor(0.95 * (used - 1))]), msd: sum / used};
  }

  // The larger side of the box around all bodies
  function drawingSize() {
    var box = simulator.getBBox();
    var size = 0;
    for (var k = 0; k < D; ++k) {
      var name = k < 3 ? ['x', 'y', 'z'][k] : 'c' + (k + 1);
      var lo = box['min_' + name], hi = box['max_' + name];
      if (hi - lo > size) size = hi - lo;
    }
    return size;
  }
}
