module.exports = createLayout;

var STABLE_THRESHOLD = 0.001; // Maximum movement of the system which can be considered as stabilized

var merge = require('./lib/merge');

/**
 * Creates force based layout for a given graph.
 * @param {ngraph.graph} graph which needs to be layed out
 */
function createLayout(graph, settings) {
  if (!graph) {
    throw new Error('Graph structure cannot be undefined');
  }

  settings = Viva.lazyExtend(settings, {
      /**
       * Ideal length for links (springs in physical model).
       */
      springLength: 80,

      /**
       * Hook's law coefficient. 1 - solid spring.
       */
      springCoeff: 0.0002,

      /**
       * Coulomb's law coefficient. It's used to repel nodes thus should be negative
       * if you make it positive nodes start attract each other :).
       */
      gravity: -1.2,

      /**
       * Theta coeffiecient from Barnes Hut simulation. Ranged between (0, 1).
       * The closer it's to 1 the more nodes algorithm will have to go through.
       * Setting it to one makes Barnes Hut simulation no different from
       * brute-force forces calculation (each node is considered).
       */
      theta: 0.8,

      /**
       * Drag force coefficient. Used to slow down system, thus should be less than 1.
       * The closer it is to 0 the less tight system will be.
       */
      dragCoeff: 0.02,

      /**
       * Default time step (dt) for forces integration
       */
      timeStep : 20
  });

  return {
    /**
     * Performs one step of iterative layout algorithm
     */
    step: function() {
    }
  };
}
