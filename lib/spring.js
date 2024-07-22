module.exports = Spring;

/**
 * Represents a physical spring. Spring connects two bodies, has rest length
 * stiffness coefficient and optional weight
 */
function Spring(fromBody, toBody, length, springCoefficient) {
  if (typeof length !== "number") {
    length = -1; // assume global configuration
  }
  this.from = fromBody;
  this.to = toBody;
  this.length = length;
  this.coefficient = springCoefficient >= 0 ? springCoefficient : -1;
}
