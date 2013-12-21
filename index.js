module.exports = createLayout;

// Maximum movement of the system at which system should be considered as stabile
var MAX_MOVEMENT = 0.001; 

var merge = require('./lib/merge');

/**
 * Creates force based layout for a given graph.
 * @param {ngraph.graph} graph which needs to be layed out
 */
function createLayout(graph, settings) {
  if (!graph) {
    throw new Error('Graph structure cannot be undefined');
  }

  settings = merge(settings, {
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
      timeStep : 20,

      /**
       * Calculates mass of a body, which corresponds to node with given id.
       *
       * @param {String|Number} nodeId identifier of a node, for which body mass needs to be calculated
       * @returns {Number} recommended mass of the body;
       */
      nodeMass: function (nodeId) {
        return 1 + graph.getLinks(nodeId).length / 3.0;
      }
  });

  var random = require('ngraph.random').random(42),
      simulator = require('ngraph.physics.simulator'),
      physics = require('ngraph.physics.primitives');

  var nodeBodies = {},
      springs = {},
      physicsSimulator = simulator(),
      graphRect = { x1: 0, y1: 0, x2: 0, y2: 0 };

  // Initialize physical objects according to what we have in the graph:
  initPhysics();
  listenToGraphEvents();

  return {
    /**
     * Performs one step of iterative layout algorithm
     */
    step: function() {
      var totalMovement = physicsSimulator.step(settings.timeStep);
      updateGraphRect();

      return totalMovement < MAX_MOVEMENT;
    },

    /**
     * For a given `nodeId` returns position
     */
    getNodePosition: function (nodeId) {
      return getInitializedBody(nodeId).pos;
    },

    /**
     * @returns {Object} area required to fit in the graph. Object contains
     * `x1`, `y1` - top left coordinates
     * `x2`, `y2` - bottom right coordinates
     */
    getGraphRect: function () {
      return graphRect;
    },

    /*
     * Requests layout algorithm to pin/unpin node to its current position
     * Pinned nodes should not be affected by layout algorithm and always
     * remain at their position
     */
    pinNode: function (node, isPinned) {
      var body = getInitializedBody(node.id);
       body.isPinned = !!isPinned;
    },

    /**
     * Checks whether given graph's node is currently pinned
     */
    isNodePinned: function (node) {
      return getInitializedBody(node.id).isPinned;
    },

    /**
     * Request to release all resources
     */
    dispose: function() {
      graph.off('changed', onGraphChanged);
    }
  };

  function listenToGraphEvents() {
    graph.on('changed', onGraphChanged);
  }

  function onGraphChanged(changes) {
    for (var i = 0; i < changes.length; ++i) {
      var change = changes[i];
      if (change.changeType === 'add') {
        if (change.node) {
          initBody(change.node.id);
        }
        if (change.link) {
          initLink(change.link);
        }
      } else if (change.changeType === 'remove') {
        if (change.node) {
          releaseNode(change.node);
        }
        if (change.link) {
          releaseLink(change.link);
        }
      }
    }
  }

  function initPhysics() {
    graph.forEachNode(function (node) {
      initBody(node.id);
    });
  }

  function initBody(nodeId) {
    var body = nodeBodies[nodeId];
    if (!body) {
      var node = graph.getNode(nodeId);
      if (!node) {
        throw new Error('initBody() was called with unknown node id');
      }

      var pos = getBestInitialNodePosition(node);
      body = new physics.Body(pos.x, pos.y);
      // we need to augment body with previous position to let users pin them
      body.prevPos = new physics.Vector2d(pos.x, pos.y);

      nodeBodies[nodeId] = body;
      updateBodyMass(nodeId);

      if (isNodeOriginallyPinned(node)) {
        body.isPinned = true;
      }

      physicsSimulator.addBody(body);
    }
  }

  function releaseNode(node) {
    var nodeId = node.id;
    var body = nodeBodies[nodeId];
    if (body) {
      nodeBodies[nodeId] = null;
      delete nodeBodies[nodeId];

      physicsSimulator.removeBody(body);
      if (graph.getNodesCount() === 0) {
        graphRect.x1 = graphRect.y1 = 0;
        graphRect.x2 = graphRect.y2 = 0;
      }
    }
  }

  function initLink(link) {
    updateBodyMass(link.fromId);
    updateBodyMass(link.toId);

    var fromBody = nodeBodies[link.fromId],
        toBody  = nodeBodies[link.toId],
        spring = physicsSimulator.addSpring(fromBody, toBody, link.length);

    springs[link.id] = spring;
  }

  function releaseLink(link) {
    var spring = springs[link.id];
    if (spring) {
      var from = graph.getNode(link.fromId),
          to = graph.getNode(link.toId);

      if (from) updateBodyMass(from.id);
      if (to) updateBodyMass(to.id);

      delete springs[link.id];

      physicsSimulator.removeSpring(spring);
    }
  }

  function getBestInitialNodePosition(node) {
    // TODO: Initial position could be picked better, e.g. take into
    // account all neighbouring nodes/links, not only one.
    // How about center of mass?
    if (node.position) {
      return node.position;
    }

    var baseX = (graphRect.x1 + graphRect.x2) / 2,
        baseY = (graphRect.y1 + graphRect.y2) / 2,
        springLength = settings.springLength;

    if (node.links && node.links.length > 0) {
      var firstLink = node.links[0],
          otherBody = firstLink.fromId !== node.id ? nodeBodies[firstLink.fromId] : nodeBodies[firstLink.toId];
      if (otherBody && otherBody.pos) {
        baseX = otherBody.pos.x;
        baseY = otherBody.pos.y;
      }
    }

    return {
      x: baseX + random.next(springLength) - springLength / 2,
      y: baseY + random.next(springLength) - springLength / 2
    };
  }

  function updateBodyMass(nodeId) {
    var body = nodeBodies[nodeId];
    body.mass = settings.nodeMass(nodeId);
  }


  function updateGraphRect() {
    if (graph.getNodesCount() === 0) {
      // don't have to wory here.
      return;
    }

    var x1 = Number.MAX_VALUE,
        y1 = Number.MAX_VALUE,
        x2 = Number.MIN_VALUE,
        y2 = Number.MIN_VALUE;

    // this is O(n), could it be done faster with quadtree?
    for (var key in nodeBodies) {
      if (nodeBodies.hasOwnProperty(key)) {
        // how about pinned nodes?
        var body = nodeBodies[key];
        if (isBodyPinned(body)) {
          body.pos.x = body.prevPos.x;
          body.pos.y = body.prevPos.y;
        } else {
          body.prevPos.x = body.pos.x;
          body.prevPos.y = body.pos.y;
        }
        if (body.pos.x < x1) {
          x1 = body.pos.x;
        }
        if (body.pos.x > x2) {
          x2 = body.pos.x;
        }
        if (body.pos.y < y1) {
          y1 = body.pos.y;
        }
        if (body.pos.y > y2) {
          y2 = body.pos.y;
        }
      }
    }

    graphRect.x1 = x1;
    graphRect.x2 = x2;
    graphRect.y1 = y1;
    graphRect.y2 = y2;
  }

  /**
   * Checks whether graph node has in its settings pinned attribute,
   * which means layout algorithm cannot move it. Node can be preconfigured
   * as pinned, if it has "isPinned" attribute, or when node.data has it.
   *
   * @param {Object} node a graph node to check
   * @return {Boolean} true if node should be treated as pinned; false otherwise.
   */
  function isNodeOriginallyPinned(node) {
    return (node && (node.isPinned || (node.data && node.data.isPinned)));
  }

  /**
   * Checks whether given physical body should be treated as pinned. Unlinke
   * `isNodeOriginallyPinned` this operates on body object, which is specific to layout
   * instance. Thus two layouters can independntly pin bodies, which represent
   * same node of a source graph.
   *
   * @param {ngraph.physics.Body} body - body to check
   * @return {Boolean} true if body should be treated as pinned; false otherwise.
   */
  function isBodyPinned (body) {
    return body.isPinned;
  }

  function getInitializedBody(nodeId) {
    var body = nodeBodies[nodeId];
    if (!body) {
      initBody(nodeId);
      body = nodeBodies[nodeId];
    }
    return body;
  }
}
