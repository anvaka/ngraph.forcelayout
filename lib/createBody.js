var physics = require('./primitives');

module.exports = function(pos) {
  return new physics.Body(pos);
}
