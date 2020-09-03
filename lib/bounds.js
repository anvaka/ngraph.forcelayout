const generateBoundsFunction = require('./codeGenerators/generateBounds');

module.exports = generateBoundsFunction(2);

function boundsFunctionSample(bodies, settings, random) {
  var boundingBox =  { x1: 0, y1: 0, x2: 0, y2: 0 };

  return {
    box: boundingBox,

    update: updateBoundingBox,

    reset : function () {
      boundingBox.x1 = boundingBox.y1 = 0;
      boundingBox.x2 = boundingBox.y2 = 0;
    },

    getBestNewPosition: function (neighbors) {
      var graphRect = boundingBox;

      var baseX = 0, baseY = 0;

      if (neighbors.length) {
        for (var i = 0; i < neighbors.length; ++i) {
          baseX += neighbors[i].pos.x0;
          baseY += neighbors[i].pos.x1;
        }

        baseX /= neighbors.length;
        baseY /= neighbors.length;
      } else {
        baseX = (graphRect.x1 + graphRect.x2) / 2;
        baseY = (graphRect.y1 + graphRect.y2) / 2;
      }

      var springLength = settings.springLength;
      var a = random.nextDouble() * Math.PI * 2;
      return {
        x0: baseX + springLength * Math.cos(a),
        x1: baseY + springLength * Math.sin(a)
      };
    }
  };

  function updateBoundingBox() {
    var i = bodies.length;
    if (i === 0) return; // No bodies - no borders.

    var x1 = Number.MAX_VALUE,
        y1 = Number.MAX_VALUE,
        x2 = Number.MIN_VALUE,
        y2 = Number.MIN_VALUE;

    while(i--) {
      // this is O(n), it could be done faster with quadtree, if we check the root node bounds
      var body = bodies[i];
      if (body.pos.x0 < x1) x1 = body.pos.x0;
      if (body.pos.x0 > x2) x2 = body.pos.x0;
      if (body.pos.x1 < y1) y1 = body.pos.x1;
      if (body.pos.x1 > y2) y2 = body.pos.x1;
    }

    boundingBox.x1 = x1;
    boundingBox.x2 = x2;
    boundingBox.y1 = y1;
    boundingBox.y2 = y2;
  }
}
