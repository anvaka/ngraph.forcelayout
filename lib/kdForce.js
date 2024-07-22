/**
 * This is not used anywhere, but it is a good exploration into kd-tree based
 * simulation.
 */
module.exports = createKDForce;

function createKDForce(bodies, settings) {
  const KDBush = require('kdbush').default;
  const random = require('ngraph.random').random(1984);

  return kdForce;

  function kdForce(iterationNumber) {
    if (iterationNumber < 500) return;
    const gravity = settings.gravity;
    const points = new KDBush(bodies, p => p.pos.x0, p => p.pos.x1);
    let i = bodies.length;
    while (i--) {
      const body = bodies[i];
      body.reset();
      const neighbors = points.within(body.pos.x0, body.pos.x1, settings.springLength);
      let fx = 0, fy = 0;
      for (let j = 0; j < neighbors.length; ++j) {
        let other = bodies[neighbors[j]];
        if (other === body) continue;

        let dx = other.pos.x0 - body.pos.x0;
        let dy = other.pos.x1 - body.pos.x1;
        let r = Math.sqrt(dx * dx + dy * dy);
        if (r === 0) {
          // Poor man's protection against zero distance.
          dx = (random.nextDouble() - 0.5) / 50;
          dy = (random.nextDouble() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
        }
        const v = gravity * other.mass * body.mass / (r * r * r);
        fx += v * dx;
        fy += v * dy;
      }
      body.force.x0 = fx;
      body.force.x1 = fy;
      //dragForce.update(body);
    }
  }
}