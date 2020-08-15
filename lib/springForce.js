/**
 * Represents spring force, which updates forces acting on two bodies, connected
 * by a spring.
 *
 * @param {Object} options for the spring force
 * @param {Number=} options.springCoeff spring force coefficient.
 * @param {Number=} options.springLength desired length of a spring at rest.
 */
module.exports = function (options) {
  var merge = require('ngraph.merge');
  var random = require('ngraph.random').random(42);
  var expose = require('ngraph.expose');

  options = merge(options, {
    springCoeff: 0.8,
    springLength: 80
  });

  var api = {
    /**
     * Updates forces acting on a spring
     */
    update : function (spring) {
      var body1 = spring.from,
          body2 = spring.to,
          length = spring.length < 0 ? options.springLength : spring.length,
          dx = body2.pos.x - body1.pos.x,
          dy = body2.pos.y - body1.pos.y,
          r = Math.sqrt(dx * dx + dy * dy);

      if (r === 0) {
          dx = (random.nextDouble() - 0.5) / 50;
          dy = (random.nextDouble() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
      }

      var d = r - length;
      var coeff = ((!spring.coeff || spring.coeff < 0) ? options.springCoeff : spring.coeff) * d / r;

      body1.force.x += coeff * dx;
      body1.force.y += coeff * dy;
      body1.springCount += 1;
      body1.springLength += r;

      body2.force.x -= coeff * dx;
      body2.force.y -= coeff * dy;
      body2.springCount += 1;
      body2.springLength += r;
    }
  };

  expose(options, api, ['springCoeff', 'springLength']);
  return api;
}
