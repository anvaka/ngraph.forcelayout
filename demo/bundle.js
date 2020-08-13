(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.b = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = {
  forceDirected : require('../'),
  generators : require('ngraph.generators')
}

},{"../":2,"ngraph.generators":13}],2:[function(require,module,exports){
module.exports = createLayout;
module.exports.simulator = require('./lib/physicsSimulator');

var eventify = require('ngraph.events');

/**
 * Creates force based layout for a given graph.
 *
 * @param {ngraph.graph} graph which needs to be laid out
 * @param {object} physicsSettings if you need custom settings
 * for physics simulator you can pass your own settings here. If it's not passed
 * a default one will be created.
 */
function createLayout(graph, physicsSettings) {
  if (!graph) {
    throw new Error('Graph structure cannot be undefined');
  }

  var createSimulator = (physicsSettings && physicsSettings.createSimulator) || require('./lib/physicsSimulator');;
  var physicsSimulator = createSimulator(physicsSettings);

  var nodeMass = defaultNodeMass
  if (physicsSettings && typeof physicsSettings.nodeMass === 'function') {
    nodeMass = physicsSettings.nodeMass
  }

  var nodeBodies = new Map();
  var springs = {};
  var bodiesCount = 0;

  var springTransform = physicsSimulator.settings.springTransform || noop;

  // Initialize physics with what we have in the graph:
  initPhysics();
  listenToEvents();

  var wasStable = false;

  var api = {
    /**
     * Performs one step of iterative layout algorithm
     *
     * @returns {boolean} true if the system should be considered stable; False otherwise.
     * The system is stable if no further call to `step()` can improve the layout.
     */
    step: function() {
      if (bodiesCount === 0) {
        updateStableStatus(true);
        return true;
      }

      var lastMove = physicsSimulator.step();

      // Save the movement in case if someone wants to query it in the step
      // callback.
      api.lastMove = lastMove;

      // Allow listeners to perform low-level actions after nodes are updated.
      api.fire('step');

      var ratio = lastMove/bodiesCount;
      var isStableNow = ratio <= 0.01; // TODO: The number is somewhat arbitrary...
      updateStableStatus(isStableNow);


      return isStableNow;
    },

    /**
     * For a given `nodeId` returns position
     */
    getNodePosition: function (nodeId) {
      return getInitializedBody(nodeId).pos;
    },

    /**
     * Sets position of a node to a given coordinates
     * @param {string} nodeId node identifier
     * @param {number} x position of a node
     * @param {number} y position of a node
     * @param {number=} z position of node (only if applicable to body)
     */
    setNodePosition: function (nodeId) {
      var body = getInitializedBody(nodeId);
      body.setPosition.apply(body, Array.prototype.slice.call(arguments, 1));
      physicsSimulator.invalidateBBox();
    },

    /**
     * @returns {Object} Link position by link id
     * @returns {Object.from} {x, y} coordinates of link start
     * @returns {Object.to} {x, y} coordinates of link end
     */
    getLinkPosition: function (linkId) {
      var spring = springs[linkId];
      if (spring) {
        return {
          from: spring.from.pos,
          to: spring.to.pos
        };
      }
    },

    /**
     * @returns {Object} area required to fit in the graph. Object contains
     * `x1`, `y1` - top left coordinates
     * `x2`, `y2` - bottom right coordinates
     */
    getGraphRect: function () {
      return physicsSimulator.getBBox();
    },

    /**
     * Iterates over each body in the layout simulator and performs a callback(body, nodeId)
     */
    forEachBody: forEachBody,

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
      api.fire('disposed');
    },

    /**
     * Gets physical body for a given node id. If node is not found undefined
     * value is returned.
     */
    getBody: getBody,

    /**
     * Gets spring for a given edge.
     *
     * @param {string} linkId link identifer. If two arguments are passed then
     * this argument is treated as formNodeId
     * @param {string=} toId when defined this parameter denotes head of the link
     * and first argument is treated as tail of the link (fromId)
     */
    getSpring: getSpring,

    /**
     * [Read only] Gets current physics simulator
     */
    simulator: physicsSimulator,

    /**
     * Gets the graph that was used for layout
     */
    graph: graph,

    /**
     * Gets amount of movement performed during last step operation
     */
    lastMove: 0
  };

  eventify(api);

  return api;

  function updateStableStatus(isStableNow) {
    if (wasStable !== isStableNow) {
      wasStable = isStableNow;
      onStableChanged(isStableNow);
    }
  }

  function forEachBody(cb) {
    nodeBodies.forEach(function(body, bodyId) {
      cb(body, bodyId);
    })
  }

  function getSpring(fromId, toId) {
    var linkId;
    if (toId === undefined) {
      if (typeof fromId !== 'object') {
        // assume fromId as a linkId:
        linkId = fromId;
      } else {
        // assume fromId to be a link object:
        linkId = fromId.id;
      }
    } else {
      // toId is defined, should grab link:
      var link = graph.hasLink(fromId, toId);
      if (!link) return;
      linkId = link.id;
    }

    return springs[linkId];
  }

  function getBody(nodeId) {
    return nodeBodies.get(nodeId);
  }

  function listenToEvents() {
    graph.on('changed', onGraphChanged);
  }

  function onStableChanged(isStable) {
    api.fire('stable', isStable);
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
    bodiesCount = graph.getNodesCount();
  }

  function initPhysics() {
    bodiesCount = 0;

    graph.forEachNode(function (node) {
      initBody(node.id);
      bodiesCount += 1;
    });

    graph.forEachLink(initLink);
  }

  function initBody(nodeId) {
    var body = nodeBodies.get(nodeId);
    if (!body) {
      var node = graph.getNode(nodeId);
      if (!node) {
        throw new Error('initBody() was called with unknown node id');
      }

      var pos = node.position;
      if (!pos) {
        var neighbors = getNeighborBodies(node);
        pos = physicsSimulator.getBestNewBodyPosition(neighbors);
      }

      body = physicsSimulator.addBodyAt(pos);
      body.id = nodeId;

      nodeBodies.set(nodeId, body);
      updateBodyMass(nodeId);

      if (isNodeOriginallyPinned(node)) {
        body.isPinned = true;
      }
    }
  }

  function releaseNode(node) {
    var nodeId = node.id;
    var body = nodeBodies.get(nodeId);
    if (body) {
      nodeBodies.delete(nodeId);
      physicsSimulator.removeBody(body);
    }
  }

  function initLink(link) {
    updateBodyMass(link.fromId);
    updateBodyMass(link.toId);

    var fromBody = nodeBodies.get(link.fromId),
        toBody  = nodeBodies.get(link.toId),
        spring = physicsSimulator.addSpring(fromBody, toBody, link.length);

    springTransform(link, spring);

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

  function getNeighborBodies(node) {
    // TODO: Could probably be done better on memory
    var neighbors = [];
    if (!node.links) {
      return neighbors;
    }
    var maxNeighbors = Math.min(node.links.length, 2);
    for (var i = 0; i < maxNeighbors; ++i) {
      var link = node.links[i];
      var otherBody = link.fromId !== node.id ? nodeBodies.get(link.fromId) : nodeBodies.get(link.toId);
      if (otherBody && otherBody.pos) {
        neighbors.push(otherBody);
      }
    }

    return neighbors;
  }

  function updateBodyMass(nodeId) {
    var body = nodeBodies.get(nodeId);
    body.mass = nodeMass(nodeId);
    if (Number.isNaN(body.mass)) {
      throw new Error('Node mass should be a number')
    }
  }

  /**
   * Checks whether graph node has in its settings pinned attribute,
   * which means layout algorithm cannot move it. Node can be marked
   * as pinned, if it has "isPinned" attribute, or when node.data has it.
   *
   * @param {Object} node a graph node to check
   * @return {Boolean} true if node should be treated as pinned; false otherwise.
   */
  function isNodeOriginallyPinned(node) {
    return (node && (node.isPinned || (node.data && node.data.isPinned)));
  }

  function getInitializedBody(nodeId) {
    var body = nodeBodies.get(nodeId);
    if (!body) {
      initBody(nodeId);
      body = nodeBodies.get(nodeId);
    }
    return body;
  }

  /**
   * Calculates mass of a body, which corresponds to node with given id.
   *
   * @param {String|Number} nodeId identifier of a node, for which body mass needs to be calculated
   * @returns {Number} recommended mass of the body;
   */
  function defaultNodeMass(nodeId) {
    var links = graph.getLinks(nodeId);
    if (!links) return 1;
    return 1 + links.length / 3.0;
  }
}

function noop() { }

},{"./lib/physicsSimulator":7,"ngraph.events":11}],3:[function(require,module,exports){
module.exports = function (bodies, settings) {
  var random = require('ngraph.random').random(42);
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
          baseX += neighbors[i].pos.x;
          baseY += neighbors[i].pos.y;
        }

        baseX /= neighbors.length;
        baseY /= neighbors.length;
      } else {
        baseX = (graphRect.x1 + graphRect.x2) / 2;
        baseY = (graphRect.y1 + graphRect.y2) / 2;
      }

      var springLength = settings.springLength;
      return {
        x: baseX + random.next(springLength) - springLength / 2,
        y: baseY + random.next(springLength) - springLength / 2
      };
    }
  };

  function updateBoundingBox() {
    var i = bodies.length;
    if (i === 0) { return; } // don't have to wory here.

    var x1 = Number.MAX_VALUE,
        y1 = Number.MAX_VALUE,
        x2 = Number.MIN_VALUE,
        y2 = Number.MIN_VALUE;

    while(i--) {
      // this is O(n), could it be done faster with quadtree?
      // how about pinned nodes?
      var body = bodies[i];
      if (body.isPinned) {
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

    boundingBox.x1 = x1;
    boundingBox.x2 = x2;
    boundingBox.y1 = y1;
    boundingBox.y2 = y2;
  }
}

},{"ngraph.random":20}],4:[function(require,module,exports){
var physics = require('./primitives');

module.exports = function(pos) {
  return new physics.Body(pos);
}

},{"./primitives":8}],5:[function(require,module,exports){
/**
 * Represents drag force, which reduces force value on each step by given
 * coefficient.
 *
 * @param {Object} options for the drag force
 * @param {Number=} options.dragCoeff drag force coefficient. 0.1 by default
 */
module.exports = function (options) {
  var merge = require('ngraph.merge'),
      expose = require('ngraph.expose');

  options = merge(options, {
    dragCoeff: 0.02
  });

  var api = {
    update : function (body) {
      body.force.x -= options.dragCoeff * body.velocity.x;
      body.force.y -= options.dragCoeff * body.velocity.y;
    }
  };

  // let easy access to dragCoeff:
  expose(options, api, ['dragCoeff']);

  return api;
};

},{"ngraph.expose":12,"ngraph.merge":15}],6:[function(require,module,exports){
/**
 * Performs forces integration, using given time step. Uses Euler method to solve
 * differential equation (http://en.wikipedia.org/wiki/Euler_method ).
 *
 * @returns {Number} squared distance of total position updates.
 */

module.exports = integrate;

function integrate(bodies, timeStep) {
  var dx = 0, tx = 0,
      dy = 0, ty = 0,
      i,
      max = bodies.length;

  if (max === 0) {
    return 0;
  }

  for (i = 0; i < max; ++i) {
    var body = bodies[i],
        coeff = timeStep / body.mass;

    body.velocity.x += coeff * body.force.x;
    body.velocity.y += coeff * body.force.y;
    var vx = body.velocity.x,
        vy = body.velocity.y,
        v = Math.sqrt(vx * vx + vy * vy);

    if (v > 1) {
      // We normalize it so that we move within timeStep range. 
      // for the case when v <= 1 - we let velocity to fade out.
      body.velocity.x = vx / v;
      body.velocity.y = vy / v;
    }

    dx = timeStep * body.velocity.x;
    dy = timeStep * body.velocity.y;

    body.pos.x += dx;
    body.pos.y += dy;

    tx += Math.abs(dx); ty += Math.abs(dy);
  }

  return (tx * tx + ty * ty)/max;
}

},{}],7:[function(require,module,exports){
/**
 * Manages a simulation of physical forces acting on bodies and springs.
 */
module.exports = physicsSimulator;

function physicsSimulator(settings) {
  var Spring = require('./spring');
  var expose = require('ngraph.expose');
  var merge = require('ngraph.merge');
  var eventify = require('ngraph.events');

  settings = merge(settings, {
      /**
       * Ideal length for links (springs in physical model).
       */
      springLength: 30,

      /**
       * Hook's law coefficient. 1 - solid spring.
       */
      springCoeff: 0.0008,

      /**
       * Coulomb's law coefficient. It's used to repel nodes thus should be negative
       * if you make it positive nodes start attract each other :).
       */
      gravity: -1.2,

      /**
       * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
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
  });

  // We allow clients to override basic factory methods:
  var createQuadTree = settings.createQuadTree || require('ngraph.quadtreebh');
  var createBounds = settings.createBounds || require('./bounds');
  var createDragForce = settings.createDragForce || require('./dragForce');
  var createSpringForce = settings.createSpringForce || require('./springForce');
  var integrate = settings.integrator || require('./eulerIntegrator');
  var createBody = settings.createBody || require('./createBody');

  var bodies = [], // Bodies in this simulation.
      springs = [], // Springs in this simulation.
      quadTree =  createQuadTree(settings),
      bounds = createBounds(bodies, settings),
      springForce = createSpringForce(settings),
      dragForce = createDragForce(settings);

  var bboxNeedsUpdate = true;
  var totalMovement = 0; // how much movement we made on last step

  var publicApi = {
    /**
     * Array of bodies, registered with current simulator
     *
     * Note: To add new body, use addBody() method. This property is only
     * exposed for testing/performance purposes.
     */
    bodies: bodies,

    quadTree: quadTree,

    /**
     * Array of springs, registered with current simulator
     *
     * Note: To add new spring, use addSpring() method. This property is only
     * exposed for testing/performance purposes.
     */
    springs: springs,

    /**
     * Returns settings with which current simulator was initialized
     */
    settings: settings,

    /**
     * Performs one step of force simulation.
     *
     * @returns {boolean} true if system is considered stable; False otherwise.
     */
    step: function () {
      accumulateForces();

      var movement = integrate(bodies, settings.timeStep);
      bounds.update();

      return movement;
    },

    /**
     * Adds body to the system
     *
     * @param {ngraph.physics.primitives.Body} body physical body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBody: function (body) {
      if (!body) {
        throw new Error('Body is required');
      }
      bodies.push(body);

      return body;
    },

    /**
     * Adds body to the system at given position
     *
     * @param {Object} pos position of a body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBodyAt: function (pos) {
      if (!pos) {
        throw new Error('Body position is required');
      }
      var body = createBody(pos);
      bodies.push(body);

      return body;
    },

    /**
     * Removes body from the system
     *
     * @param {ngraph.physics.primitives.Body} body to remove
     *
     * @returns {Boolean} true if body found and removed. falsy otherwise;
     */
    removeBody: function (body) {
      if (!body) { return; }

      var idx = bodies.indexOf(body);
      if (idx < 0) { return; }

      bodies.splice(idx, 1);
      if (bodies.length === 0) {
        bounds.reset();
      }
      return true;
    },

    /**
     * Adds a spring to this simulation.
     *
     * @returns {Object} - a handle for a spring. If you want to later remove
     * spring pass it to removeSpring() method.
     */
    addSpring: function (body1, body2, springLength, springCoefficient) {
      if (!body1 || !body2) {
        throw new Error('Cannot add null spring to force simulator');
      }

      if (typeof springLength !== 'number') {
        springLength = -1; // assume global configuration
      }

      var spring = new Spring(body1, body2, springLength, springCoefficient >= 0 ? springCoefficient : -1);
      springs.push(spring);

      // TODO: could mark simulator as dirty.
      return spring;
    },

    /**
     * Returns amount of movement performed on last step() call
     */
    getTotalMovement: function () {
      return totalMovement;
    },

    /**
     * Removes spring from the system
     *
     * @param {Object} spring to remove. Spring is an object returned by addSpring
     *
     * @returns {Boolean} true if spring found and removed. falsy otherwise;
     */
    removeSpring: function (spring) {
      if (!spring) { return; }
      var idx = springs.indexOf(spring);
      if (idx > -1) {
        springs.splice(idx, 1);
        return true;
      }
    },

    getBestNewBodyPosition: function (neighbors) {
      return bounds.getBestNewPosition(neighbors);
    },

    /**
     * Returns bounding box which covers all bodies
     */
    getBBox: function () {
      if (bboxNeedsUpdate) {
        bounds.update();
        bboxNeedsUpdate = false;
      }
      return bounds.box;
    },

    invalidateBBox: function () {
      bboxNeedsUpdate = true;
    },

    gravity: function (value) {
      if (value !== undefined) {
        settings.gravity = value;
        quadTree.options({gravity: value});
        return this;
      } else {
        return settings.gravity;
      }
    },

    theta: function (value) {
      if (value !== undefined) {
        settings.theta = value;
        quadTree.options({theta: value});
        return this;
      } else {
        return settings.theta;
      }
    }
  };

  // allow settings modification via public API:
  expose(settings, publicApi);

  eventify(publicApi);

  return publicApi;

  function accumulateForces() {
    // Accumulate forces acting on bodies.
    var body,
        i = bodies.length;

    if (i) {
      // only add bodies if there the array is not empty:
      quadTree.insertBodies(bodies); // performance: O(n * log n)
      while (i--) {
        body = bodies[i];
        // If body is pinned there is no point updating its forces - it should
        // never move:
        if (!body.isPinned) {
          body.force.reset();

          quadTree.updateBodyForce(body);
          dragForce.update(body);
        }
      }
    }

    i = springs.length;
    while(i--) {
      springForce.update(springs[i]);
    }
  }
};

},{"./bounds":3,"./createBody":4,"./dragForce":5,"./eulerIntegrator":6,"./spring":9,"./springForce":10,"ngraph.events":11,"ngraph.expose":12,"ngraph.merge":15,"ngraph.quadtreebh":16}],8:[function(require,module,exports){
module.exports = {
  Body: Body,
  Vector2d: Vector2d,
  Body3d: Body3d,
  Vector3d: Vector3d
};

function Body(x, y) {
  this.pos = new Vector2d(x, y);
  this.prevPos = new Vector2d(x, y);
  this.force = new Vector2d();
  this.velocity = new Vector2d();
  this.mass = 1;
}

Body.prototype.setPosition = function (x, y) {
  this.prevPos.x = this.pos.x = x;
  this.prevPos.y = this.pos.y = y;
};

function Vector2d(x, y) {
  if (x && typeof x !== 'number') {
    // could be another vector
    this.x = typeof x.x === 'number' ? x.x : 0;
    this.y = typeof x.y === 'number' ? x.y : 0;
  } else {
    this.x = typeof x === 'number' ? x : 0;
    this.y = typeof y === 'number' ? y : 0;
  }
}

Vector2d.prototype.reset = function () {
  this.x = this.y = 0;
};

function Body3d(x, y, z) {
  this.pos = new Vector3d(x, y, z);
  this.prevPos = new Vector3d(x, y, z);
  this.force = new Vector3d();
  this.velocity = new Vector3d();
  this.mass = 1;
}

Body3d.prototype.setPosition = function (x, y, z) {
  this.prevPos.x = this.pos.x = x;
  this.prevPos.y = this.pos.y = y;
  this.prevPos.z = this.pos.z = z;
};

function Vector3d(x, y, z) {
  if (x && typeof x !== 'number') {
    // could be another vector
    this.x = typeof x.x === 'number' ? x.x : 0;
    this.y = typeof x.y === 'number' ? x.y : 0;
    this.z = typeof x.z === 'number' ? x.z : 0;
  } else {
    this.x = typeof x === 'number' ? x : 0;
    this.y = typeof y === 'number' ? y : 0;
    this.z = typeof z === 'number' ? z : 0;
  }
};

Vector3d.prototype.reset = function () {
  this.x = this.y = this.z = 0;
};

},{}],9:[function(require,module,exports){
module.exports = Spring;

/**
 * Represents a physical spring. Spring connects two bodies, has rest length
 * stiffness coefficient and optional weight
 */
function Spring(fromBody, toBody, length, coeff) {
    this.from = fromBody;
    this.to = toBody;
    this.length = length;
    this.coeff = coeff;
};

},{}],10:[function(require,module,exports){
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
    springCoeff: 0.0002,
    springLength: 80
  });

  var api = {
    /**
     * Upsates forces acting on a spring
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

      body2.force.x -= coeff * dx;
      body2.force.y -= coeff * dy;
    }
  };

  expose(options, api, ['springCoeff', 'springLength']);
  return api;
}

},{"ngraph.expose":12,"ngraph.merge":15,"ngraph.random":20}],11:[function(require,module,exports){
module.exports = function eventify(subject) {
  validateSubject(subject);

  var eventsStorage = createEventsStorage(subject);
  subject.on = eventsStorage.on;
  subject.off = eventsStorage.off;
  subject.fire = eventsStorage.fire;
  return subject;
};

function createEventsStorage(subject) {
  // Store all event listeners to this hash. Key is event name, value is array
  // of callback records.
  //
  // A callback record consists of callback function and its optional context:
  // { 'eventName' => [{callback: function, ctx: object}] }
  var registeredEvents = Object.create(null);

  return {
    on: function (eventName, callback, ctx) {
      if (typeof callback !== 'function') {
        throw new Error('callback is expected to be a function');
      }
      var handlers = registeredEvents[eventName];
      if (!handlers) {
        handlers = registeredEvents[eventName] = [];
      }
      handlers.push({callback: callback, ctx: ctx});

      return subject;
    },

    off: function (eventName, callback) {
      var wantToRemoveAll = (typeof eventName === 'undefined');
      if (wantToRemoveAll) {
        // Killing old events storage should be enough in this case:
        registeredEvents = Object.create(null);
        return subject;
      }

      if (registeredEvents[eventName]) {
        var deleteAllCallbacksForEvent = (typeof callback !== 'function');
        if (deleteAllCallbacksForEvent) {
          delete registeredEvents[eventName];
        } else {
          var callbacks = registeredEvents[eventName];
          for (var i = 0; i < callbacks.length; ++i) {
            if (callbacks[i].callback === callback) {
              callbacks.splice(i, 1);
            }
          }
        }
      }

      return subject;
    },

    fire: function (eventName) {
      var callbacks = registeredEvents[eventName];
      if (!callbacks) {
        return subject;
      }

      var fireArguments;
      if (arguments.length > 1) {
        fireArguments = Array.prototype.splice.call(arguments, 1);
      }
      for(var i = 0; i < callbacks.length; ++i) {
        var callbackInfo = callbacks[i];
        callbackInfo.callback.apply(callbackInfo.ctx, fireArguments);
      }

      return subject;
    }
  };
}

function validateSubject(subject) {
  if (!subject) {
    throw new Error('Eventify cannot use falsy object as events subject');
  }
  var reservedWords = ['on', 'fire', 'off'];
  for (var i = 0; i < reservedWords.length; ++i) {
    if (subject.hasOwnProperty(reservedWords[i])) {
      throw new Error("Subject cannot be eventified, since it already has property '" + reservedWords[i] + "'");
    }
  }
}

},{}],12:[function(require,module,exports){
module.exports = exposeProperties;

/**
 * Augments `target` object with getter/setter functions, which modify settings
 *
 * @example
 *  var target = {};
 *  exposeProperties({ age: 42}, target);
 *  target.age(); // returns 42
 *  target.age(24); // make age 24;
 *
 *  var filteredTarget = {};
 *  exposeProperties({ age: 42, name: 'John'}, filteredTarget, ['name']);
 *  filteredTarget.name(); // returns 'John'
 *  filteredTarget.age === undefined; // true
 */
function exposeProperties(settings, target, filter) {
  var needsFilter = Object.prototype.toString.call(filter) === '[object Array]';
  if (needsFilter) {
    for (var i = 0; i < filter.length; ++i) {
      augment(settings, target, filter[i]);
    }
  } else {
    for (var key in settings) {
      augment(settings, target, key);
    }
  }
}

function augment(source, target, key) {
  if (source.hasOwnProperty(key)) {
    if (typeof target[key] === 'function') {
      // this accessor is already defined. Ignore it
      return;
    }
    target[key] = function (value) {
      if (value !== undefined) {
        source[key] = value;
        return target;
      }
      return source[key];
    }
  }
}

},{}],13:[function(require,module,exports){
var createGraph = require('ngraph.graph');

module.exports = factory(createGraph);

// Allow other developers have their own createGraph
module.exports.factory = factory;

function factory(createGraph) {
  return {
    ladder: ladder,
    complete: complete,
    completeBipartite: completeBipartite,
    balancedBinTree: balancedBinTree,
    path: path,
    circularLadder: circularLadder,
    grid: grid,
    grid3: grid3,
    noLinks: noLinks,
    wattsStrogatz: wattsStrogatz,
    cliqueCircle: cliqueCircle
  };


  function ladder(n) {
  /**
  * Ladder graph is a graph in form of ladder
  * @param {Number} n Represents number of steps in the ladder
  */
    if (!n || n < 0) {
      throw new Error("Invalid number of nodes");
    }

    var g = createGraph(),
        i;

    for (i = 0; i < n - 1; ++i) {
      g.addLink(i, i + 1);
      // first row
      g.addLink(n + i, n + i + 1);
      // second row
      g.addLink(i, n + i);
      // ladder's step
    }

    g.addLink(n - 1, 2 * n - 1);
    // last step in the ladder;

    return g;
  }

  function circularLadder(n) {
  /**
  * Circular ladder with n steps.
  *
  * @param {Number} n of steps in the ladder.
  */
      if (!n || n < 0) {
          throw new Error("Invalid number of nodes");
      }

      var g = ladder(n);

      g.addLink(0, n - 1);
      g.addLink(n, 2 * n - 1);
      return g;
  }

  function complete(n) {
  /**
  * Complete graph Kn.
  *
  * @param {Number} n represents number of nodes in the complete graph.
  */
    if (!n || n < 1) {
      throw new Error("At least two nodes are expected for complete graph");
    }

    var g = createGraph(),
        i,
        j;

    for (i = 0; i < n; ++i) {
      for (j = i + 1; j < n; ++j) {
        if (i !== j) {
          g.addLink(i, j);
        }
      }
    }

    return g;
  }

  function completeBipartite (n, m) {
  /**
  * Complete bipartite graph K n,m. Each node in the
  * first partition is connected to all nodes in the second partition.
  *
  * @param {Number} n represents number of nodes in the first graph partition
  * @param {Number} m represents number of nodes in the second graph partition
  */
    if (!n || !m || n < 0 || m < 0) {
      throw new Error("Graph dimensions are invalid. Number of nodes in each partition should be greater than 0");
    }

    var g = createGraph(),
        i, j;

    for (i = 0; i < n; ++i) {
      for (j = n; j < n + m; ++j) {
        g.addLink(i, j);
      }
    }

    return g;
  }

  function path(n) {
  /**
  * Path graph with n steps.
  *
  * @param {Number} n number of nodes in the path
  */
    if (!n || n < 0) {
      throw new Error("Invalid number of nodes");
    }

    var g = createGraph(),
        i;

    g.addNode(0);

    for (i = 1; i < n; ++i) {
      g.addLink(i - 1, i);
    }

    return g;
  }


  function grid(n, m) {
  /**
  * Grid graph with n rows and m columns.
  *
  * @param {Number} n of rows in the graph.
  * @param {Number} m of columns in the graph.
  */
    if (n < 1 || m < 1) {
      throw new Error("Invalid number of nodes in grid graph");
    }
    var g = createGraph(),
        i,
        j;
    if (n === 1 && m === 1) {
      g.addNode(0);
      return g;
    }

    for (i = 0; i < n; ++i) {
      for (j = 0; j < m; ++j) {
        var node = i + j * n;
        if (i > 0) { g.addLink(node, i - 1 + j * n); }
        if (j > 0) { g.addLink(node, i + (j - 1) * n); }
      }
    }

    return g;
  }

  function grid3(n, m, z) {
  /**
  * 3D grid with n rows and m columns and z levels.
  *
  * @param {Number} n of rows in the graph.
  * @param {Number} m of columns in the graph.
  * @param {Number} z of levels in the graph.
  */
    if (n < 1 || m < 1 || z < 1) {
      throw new Error("Invalid number of nodes in grid3 graph");
    }
    var g = createGraph(),
        i, j, k;

    if (n === 1 && m === 1 && z === 1) {
      g.addNode(0);
      return g;
    }

    for (k = 0; k < z; ++k) {
      for (i = 0; i < n; ++i) {
        for (j = 0; j < m; ++j) {
          var level = k * n * m;
          var node = i + j * n + level;
          if (i > 0) { g.addLink(node, i - 1 + j * n + level); }
          if (j > 0) { g.addLink(node, i + (j - 1) * n + level); }
          if (k > 0) { g.addLink(node, i + j * n + (k - 1) * n * m ); }
        }
      }
    }

    return g;
  }

  function balancedBinTree(n) {
  /**
  * Balanced binary tree with n levels.
  *
  * @param {Number} n of levels in the binary tree
  */
    if (n < 0) {
      throw new Error("Invalid number of nodes in balanced tree");
    }
    var g = createGraph(),
        count = Math.pow(2, n),
        level;

    if (n === 0) {
      g.addNode(1);
    }

    for (level = 1; level < count; ++level) {
      var root = level,
        left = root * 2,
        right = root * 2 + 1;

      g.addLink(root, left);
      g.addLink(root, right);
    }

    return g;
  }

  function noLinks(n) {
  /**
  * Graph with no links
  *
  * @param {Number} n of nodes in the graph
  */
    if (n < 0) {
      throw new Error("Number of nodes should be >= 0");
    }

    var g = createGraph(), i;
    for (i = 0; i < n; ++i) {
      g.addNode(i);
    }

    return g;
  }

  function cliqueCircle(cliqueCount, cliqueSize) {
  /**
  * A circular graph with cliques instead of individual nodes
  *
  * @param {Number} cliqueCount number of cliques inside circle
  * @param {Number} cliqueSize number of nodes inside each clique
  */

    if (cliqueCount < 1) throw new Error('Invalid number of cliqueCount in cliqueCircle');
    if (cliqueSize < 1) throw new Error('Invalid number of cliqueSize in cliqueCircle');

    var graph = createGraph();

    for (var i = 0; i < cliqueCount; ++i) {
      appendClique(cliqueSize, i * cliqueSize)

      if (i > 0) {
        graph.addLink(i * cliqueSize, i * cliqueSize - 1);
      }
    }
    graph.addLink(0, graph.getNodesCount() - 1);

    return graph;

    function appendClique(size, from) {
      for (var i = 0; i < size; ++i) {
        graph.addNode(i + from)
      }

      for (var i = 0; i < size; ++i) {
        for (var j = i + 1; j < size; ++j) {
          graph.addLink(i + from, j + from)
        }
      }
    }
  }

  function wattsStrogatz(n, k, p, seed) {
  /**
  * Watts-Strogatz small-world graph.
  *
  * @param {Number} n The number of nodes
  * @param {Number} k Each node is connected to k nearest neighbors in ring topology
  * @param {Number} p The probability of rewiring each edge

  * @see https://github.com/networkx/networkx/blob/master/networkx/generators/random_graphs.py
  */
    if (k >= n) throw new Error('Choose smaller `k`. It cannot be larger than number of nodes `n`');


    var random = require('ngraph.random').random(seed || 42);

    var g = createGraph(), i, to;
    for (i = 0; i < n; ++i) {
      g.addNode(i);
    }

    // connect each node to k/2 neighbors
    var neighborsSize = Math.floor(k/2 + 1);
    for (var j = 1; j < neighborsSize; ++j) {
      for (i = 0; i < n; ++i) {
        to = (j + i) % n;
        g.addLink(i, to);
      }
    }

    // rewire edges from each node
    // loop over all nodes in order (label) and neighbors in order (distance)
    // no self loops or multiple edges allowed
    for (j = 1; j < neighborsSize; ++j) {
      for (i = 0; i < n; ++i) {
        if (random.nextDouble() < p) {
          var from = i;
          to = (j + i) % n;

          var newTo = random.next(n);
          var needsRewire = (newTo === from || g.hasLink(from, newTo));
          if (needsRewire && g.getLinks(from).length === n - 1) {
            // we cannot rewire this node, it has too many links.
            continue;
          }
          // Enforce no self-loops or multiple edges
          while (needsRewire) {
            newTo = random.next(n);
            needsRewire = (newTo === from || g.hasLink(from, newTo));
          }
          var link = g.hasLink(from, to);
          g.removeLink(link);
          g.addLink(from, newTo);
        }
      }
    }

    return g;
  }
}

},{"ngraph.graph":14,"ngraph.random":20}],14:[function(require,module,exports){
/**
 * @fileOverview Contains definition of the core graph object.
 */

// TODO: need to change storage layer:
// 1. Be able to get all nodes O(1)
// 2. Be able to get number of links O(1)

/**
 * @example
 *  var graph = require('ngraph.graph')();
 *  graph.addNode(1);     // graph has one node.
 *  graph.addLink(2, 3);  // now graph contains three nodes and one link.
 *
 */
module.exports = createGraph;

var eventify = require('ngraph.events');

/**
 * Creates a new graph
 */
function createGraph(options) {
  // Graph structure is maintained as dictionary of nodes
  // and array of links. Each node has 'links' property which
  // hold all links related to that node. And general links
  // array is used to speed up all links enumeration. This is inefficient
  // in terms of memory, but simplifies coding.
  options = options || {};
  if ('uniqueLinkId' in options) {
    console.warn(
      'ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\n' +
      'Use `multigraph` option instead\n',
      '\n',
      'Note: there is also change in default behavior: From now on each graph\n'+
      'is considered to be not a multigraph by default (each edge is unique).'
    );

    options.multigraph = options.uniqueLinkId;
  }

  // Dear reader, the non-multigraphs do not guarantee that there is only
  // one link for a given pair of node. When this option is set to false
  // we can save some memory and CPU (18% faster for non-multigraph);
  if (options.multigraph === undefined) options.multigraph = false;

  if (typeof Map !== 'function') {
    // TODO: Should we polyfill it ourselves? We don't use much operations there..
    throw new Error('ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph');
  } 

  var nodes = new Map();
  var links = [],
    // Hash of multi-edges. Used to track ids of edges between same nodes
    multiEdges = {},
    suspendEvents = 0,

    createLink = options.multigraph ? createUniqueLink : createSingleLink,

    // Our graph API provides means to listen to graph changes. Users can subscribe
    // to be notified about changes in the graph by using `on` method. However
    // in some cases they don't use it. To avoid unnecessary memory consumption
    // we will not record graph changes until we have at least one subscriber.
    // Code below supports this optimization.
    //
    // Accumulates all changes made during graph updates.
    // Each change element contains:
    //  changeType - one of the strings: 'add', 'remove' or 'update';
    //  node - if change is related to node this property is set to changed graph's node;
    //  link - if change is related to link this property is set to changed graph's link;
    changes = [],
    recordLinkChange = noop,
    recordNodeChange = noop,
    enterModification = noop,
    exitModification = noop;

  // this is our public API:
  var graphPart = {
    /**
     * Adds node to the graph. If node with given id already exists in the graph
     * its data is extended with whatever comes in 'data' argument.
     *
     * @param nodeId the node's identifier. A string or number is preferred.
     * @param [data] additional data for the node being added. If node already
     *   exists its data object is augmented with the new one.
     *
     * @return {node} The newly added node or node with given id if it already exists.
     */
    addNode: addNode,

    /**
     * Adds a link to the graph. The function always create a new
     * link between two nodes. If one of the nodes does not exists
     * a new node is created.
     *
     * @param fromId link start node id;
     * @param toId link end node id;
     * @param [data] additional data to be set on the new link;
     *
     * @return {link} The newly created link
     */
    addLink: addLink,

    /**
     * Removes link from the graph. If link does not exist does nothing.
     *
     * @param link - object returned by addLink() or getLinks() methods.
     *
     * @returns true if link was removed; false otherwise.
     */
    removeLink: removeLink,

    /**
     * Removes node with given id from the graph. If node does not exist in the graph
     * does nothing.
     *
     * @param nodeId node's identifier passed to addNode() function.
     *
     * @returns true if node was removed; false otherwise.
     */
    removeNode: removeNode,

    /**
     * Gets node with given identifier. If node does not exist undefined value is returned.
     *
     * @param nodeId requested node identifier;
     *
     * @return {node} in with requested identifier or undefined if no such node exists.
     */
    getNode: getNode,

    /**
     * Gets number of nodes in this graph.
     *
     * @return number of nodes in the graph.
     */
    getNodeCount: getNodeCount,

    /**
     * Gets total number of links in the graph.
     */
    getLinkCount: getLinkCount,

    /**
     * Synonym for `getLinkCount()`
     */
    getLinksCount: getLinkCount,
    
    /**
     * Synonym for `getNodeCount()`
     */
    getNodesCount: getNodeCount,

    /**
     * Gets all links (inbound and outbound) from the node with given id.
     * If node with given id is not found null is returned.
     *
     * @param nodeId requested node identifier.
     *
     * @return Array of links from and to requested node if such node exists;
     *   otherwise null is returned.
     */
    getLinks: getLinks,

    /**
     * Invokes callback on each node of the graph.
     *
     * @param {Function(node)} callback Function to be invoked. The function
     *   is passed one argument: visited node.
     */
    forEachNode: forEachNode,

    /**
     * Invokes callback on every linked (adjacent) node to the given one.
     *
     * @param nodeId Identifier of the requested node.
     * @param {Function(node, link)} callback Function to be called on all linked nodes.
     *   The function is passed two parameters: adjacent node and link object itself.
     * @param oriented if true graph treated as oriented.
     */
    forEachLinkedNode: forEachLinkedNode,

    /**
     * Enumerates all links in the graph
     *
     * @param {Function(link)} callback Function to be called on all links in the graph.
     *   The function is passed one parameter: graph's link object.
     *
     * Link object contains at least the following fields:
     *  fromId - node id where link starts;
     *  toId - node id where link ends,
     *  data - additional data passed to graph.addLink() method.
     */
    forEachLink: forEachLink,

    /**
     * Suspend all notifications about graph changes until
     * endUpdate is called.
     */
    beginUpdate: enterModification,

    /**
     * Resumes all notifications about graph changes and fires
     * graph 'changed' event in case there are any pending changes.
     */
    endUpdate: exitModification,

    /**
     * Removes all nodes and links from the graph.
     */
    clear: clear,

    /**
     * Detects whether there is a link between two nodes.
     * Operation complexity is O(n) where n - number of links of a node.
     * NOTE: this function is synonim for getLink()
     *
     * @returns link if there is one. null otherwise.
     */
    hasLink: getLink,

    /**
     * Detects whether there is a node with given id
     * 
     * Operation complexity is O(1)
     * NOTE: this function is synonim for getNode()
     *
     * @returns node if there is one; Falsy value otherwise.
     */
    hasNode: getNode,

    /**
     * Gets an edge between two nodes.
     * Operation complexity is O(n) where n - number of links of a node.
     *
     * @param {string} fromId link start identifier
     * @param {string} toId link end identifier
     *
     * @returns link if there is one. null otherwise.
     */
    getLink: getLink
  };

  // this will add `on()` and `fire()` methods.
  eventify(graphPart);

  monitorSubscribers();

  return graphPart;

  function monitorSubscribers() {
    var realOn = graphPart.on;

    // replace real `on` with our temporary on, which will trigger change
    // modification monitoring:
    graphPart.on = on;

    function on() {
      // now it's time to start tracking stuff:
      graphPart.beginUpdate = enterModification = enterModificationReal;
      graphPart.endUpdate = exitModification = exitModificationReal;
      recordLinkChange = recordLinkChangeReal;
      recordNodeChange = recordNodeChangeReal;

      // this will replace current `on` method with real pub/sub from `eventify`.
      graphPart.on = realOn;
      // delegate to real `on` handler:
      return realOn.apply(graphPart, arguments);
    }
  }

  function recordLinkChangeReal(link, changeType) {
    changes.push({
      link: link,
      changeType: changeType
    });
  }

  function recordNodeChangeReal(node, changeType) {
    changes.push({
      node: node,
      changeType: changeType
    });
  }

  function addNode(nodeId, data) {
    if (nodeId === undefined) {
      throw new Error('Invalid node identifier');
    }

    enterModification();

    var node = getNode(nodeId);
    if (!node) {
      node = new Node(nodeId, data);
      recordNodeChange(node, 'add');
    } else {
      node.data = data;
      recordNodeChange(node, 'update');
    }

    nodes.set(nodeId, node);

    exitModification();
    return node;
  }

  function getNode(nodeId) {
    return nodes.get(nodeId);
  }

  function removeNode(nodeId) {
    var node = getNode(nodeId);
    if (!node) {
      return false;
    }

    enterModification();

    var prevLinks = node.links;
    if (prevLinks) {
      node.links = null;
      for(var i = 0; i < prevLinks.length; ++i) {
        removeLink(prevLinks[i]);
      }
    }

    nodes.delete(nodeId)

    recordNodeChange(node, 'remove');

    exitModification();

    return true;
  }


  function addLink(fromId, toId, data) {
    enterModification();

    var fromNode = getNode(fromId) || addNode(fromId);
    var toNode = getNode(toId) || addNode(toId);

    var link = createLink(fromId, toId, data);

    links.push(link);

    // TODO: this is not cool. On large graphs potentially would consume more memory.
    addLinkToNode(fromNode, link);
    if (fromId !== toId) {
      // make sure we are not duplicating links for self-loops
      addLinkToNode(toNode, link);
    }

    recordLinkChange(link, 'add');

    exitModification();

    return link;
  }

  function createSingleLink(fromId, toId, data) {
    var linkId = makeLinkId(fromId, toId);
    return new Link(fromId, toId, data, linkId);
  }

  function createUniqueLink(fromId, toId, data) {
    // TODO: Get rid of this method.
    var linkId = makeLinkId(fromId, toId);
    var isMultiEdge = multiEdges.hasOwnProperty(linkId);
    if (isMultiEdge || getLink(fromId, toId)) {
      if (!isMultiEdge) {
        multiEdges[linkId] = 0;
      }
      var suffix = '@' + (++multiEdges[linkId]);
      linkId = makeLinkId(fromId + suffix, toId + suffix);
    }

    return new Link(fromId, toId, data, linkId);
  }

  function getNodeCount() {
    return nodes.size;
  }

  function getLinkCount() {
    return links.length;
  }

  function getLinks(nodeId) {
    var node = getNode(nodeId);
    return node ? node.links : null;
  }

  function removeLink(link) {
    if (!link) {
      return false;
    }
    var idx = indexOfElementInArray(link, links);
    if (idx < 0) {
      return false;
    }

    enterModification();

    links.splice(idx, 1);

    var fromNode = getNode(link.fromId);
    var toNode = getNode(link.toId);

    if (fromNode) {
      idx = indexOfElementInArray(link, fromNode.links);
      if (idx >= 0) {
        fromNode.links.splice(idx, 1);
      }
    }

    if (toNode) {
      idx = indexOfElementInArray(link, toNode.links);
      if (idx >= 0) {
        toNode.links.splice(idx, 1);
      }
    }

    recordLinkChange(link, 'remove');

    exitModification();

    return true;
  }

  function getLink(fromNodeId, toNodeId) {
    // TODO: Use sorted links to speed this up
    var node = getNode(fromNodeId),
      i;
    if (!node || !node.links) {
      return null;
    }

    for (i = 0; i < node.links.length; ++i) {
      var link = node.links[i];
      if (link.fromId === fromNodeId && link.toId === toNodeId) {
        return link;
      }
    }

    return null; // no link.
  }

  function clear() {
    enterModification();
    forEachNode(function(node) {
      removeNode(node.id);
    });
    exitModification();
  }

  function forEachLink(callback) {
    var i, length;
    if (typeof callback === 'function') {
      for (i = 0, length = links.length; i < length; ++i) {
        callback(links[i]);
      }
    }
  }

  function forEachLinkedNode(nodeId, callback, oriented) {
    var node = getNode(nodeId);

    if (node && node.links && typeof callback === 'function') {
      if (oriented) {
        return forEachOrientedLink(node.links, nodeId, callback);
      } else {
        return forEachNonOrientedLink(node.links, nodeId, callback);
      }
    }
  }

  function forEachNonOrientedLink(links, nodeId, callback) {
    var quitFast;
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      var linkedNodeId = link.fromId === nodeId ? link.toId : link.fromId;

      quitFast = callback(nodes.get(linkedNodeId), link);
      if (quitFast) {
        return true; // Client does not need more iterations. Break now.
      }
    }
  }

  function forEachOrientedLink(links, nodeId, callback) {
    var quitFast;
    for (var i = 0; i < links.length; ++i) {
      var link = links[i];
      if (link.fromId === nodeId) {
        quitFast = callback(nodes.get(link.toId), link)
        if (quitFast) {
          return true; // Client does not need more iterations. Break now.
        }
      }
    }
  }

  // we will not fire anything until users of this library explicitly call `on()`
  // method.
  function noop() {}

  // Enter, Exit modification allows bulk graph updates without firing events.
  function enterModificationReal() {
    suspendEvents += 1;
  }

  function exitModificationReal() {
    suspendEvents -= 1;
    if (suspendEvents === 0 && changes.length > 0) {
      graphPart.fire('changed', changes);
      changes.length = 0;
    }
  }

  function forEachNode(callback) {
    if (typeof callback !== 'function') {
      throw new Error('Function is expected to iterate over graph nodes. You passed ' + callback);
    }

    var valuesIterator = nodes.values();
    var nextValue = valuesIterator.next();
    while (!nextValue.done) {
      if (callback(nextValue.value)) {
        return true; // client doesn't want to proceed. Return.
      }
      nextValue = valuesIterator.next();
    }
  }
}

// need this for old browsers. Should this be a separate module?
function indexOfElementInArray(element, array) {
  if (!array) return -1;

  if (array.indexOf) {
    return array.indexOf(element);
  }

  var len = array.length,
    i;

  for (i = 0; i < len; i += 1) {
    if (array[i] === element) {
      return i;
    }
  }

  return -1;
}

/**
 * Internal structure to represent node;
 */
function Node(id, data) {
  this.id = id;
  this.links = null;
  this.data = data;
}

function addLinkToNode(node, link) {
  if (node.links) {
    node.links.push(link);
  } else {
    node.links = [link];
  }
}

/**
 * Internal structure to represent links;
 */
function Link(fromId, toId, data, id) {
  this.fromId = fromId;
  this.toId = toId;
  this.data = data;
  this.id = id;
}

function makeLinkId(fromId, toId) {
  return fromId.toString() + '👉 ' + toId.toString();
}

},{"ngraph.events":11}],15:[function(require,module,exports){
module.exports = merge;

/**
 * Augments `target` with properties in `options`. Does not override
 * target's properties if they are defined and matches expected type in 
 * options
 *
 * @returns {Object} merged object
 */
function merge(target, options) {
  var key;
  if (!target) { target = {}; }
  if (options) {
    for (key in options) {
      if (options.hasOwnProperty(key)) {
        var targetHasIt = target.hasOwnProperty(key),
            optionsValueType = typeof options[key],
            shouldReplace = !targetHasIt || (typeof target[key] !== optionsValueType);

        if (shouldReplace) {
          target[key] = options[key];
        } else if (optionsValueType === 'object') {
          // go deep, don't care about loops here, we are simple API!:
          target[key] = merge(target[key], options[key]);
        }
      }
    }
  }

  return target;
}

},{}],16:[function(require,module,exports){
/**
 * This is Barnes Hut simulation algorithm for 2d case. Implementation
 * is highly optimized (avoids recusion and gc pressure)
 *
 * http://www.cs.princeton.edu/courses/archive/fall03/cs126/assignments/barnes-hut.html
 */

module.exports = function(options) {
  options = options || {};
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  // we require deterministic randomness here
  var random = require('ngraph.random').random(1984),
    Node = require('./node'),
    InsertStack = require('./insertStack'),
    isSamePosition = require('./isSamePosition');

  var gravity = options.gravity,
    updateQueue = [],
    insertStack = new InsertStack(),
    theta = options.theta,

    nodesCache = [],
    currentInCache = 0,
    root = newNode();

  return {
    insertBodies: insertBodies,
    /**
     * Gets root node if its present
     */
    getRoot: function() {
      return root;
    },
    updateBodyForce: update,
    options: function(newOptions) {
      if (newOptions) {
        if (typeof newOptions.gravity === 'number') {
          gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === 'number') {
          theta = newOptions.theta;
        }

        return this;
      }

      return {
        gravity: gravity,
        theta: theta
      };
    }
  };

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
      node.quad0 = null;
      node.quad1 = null;
      node.quad2 = null;
      node.quad3 = null;
      node.body = null;
      node.mass = node.massX = node.massY = 0;
      node.left = node.right = node.top = node.bottom = 0;
    } else {
      node = new Node();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody) {
    var queue = updateQueue,
      v,
      dx,
      dy,
      r, fx = 0,
      fy = 0,
      queueLength = 1,
      shiftIdx = 0,
      pushIdx = 1;

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx],
        body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        dx = body.pos.x - sourceBody.pos.x;
        dy = body.pos.y - sourceBody.pos.y;
        r = Math.sqrt(dx * dx + dy * dy);

        if (r === 0) {
          // Poor man's protection against zero distance.
          dx = (random.nextDouble() - 0.5) / 50;
          dy = (random.nextDouble() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
        }

        // This is standard gravition force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        v = gravity * body.mass * sourceBody.mass / (r * r * r);
        fx += v * dx;
        fy += v * dy;
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        dx = node.massX / node.mass - sourceBody.pos.x;
        dy = node.massY / node.mass - sourceBody.pos.y;
        r = Math.sqrt(dx * dx + dy * dy);

        if (r === 0) {
          // Sorry about code duplucation. I don't want to create many functions
          // right away. Just want to see performance first.
          dx = (random.nextDouble() - 0.5) / 50;
          dy = (random.nextDouble() - 0.5) / 50;
          r = Math.sqrt(dx * dx + dy * dy);
        }
        // If s / r < θ, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.right - node.left) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was squarified during tree creation.
          // Thus there is no difference between using width or height.
          v = gravity * node.mass * sourceBody.mass / (r * r * r);
          fx += v * dx;
          fy += v * dy;
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
          if (node.quad0) {
            queue[pushIdx] = node.quad0;
            queueLength += 1;
            pushIdx += 1;
          }
          if (node.quad1) {
            queue[pushIdx] = node.quad1;
            queueLength += 1;
            pushIdx += 1;
          }
          if (node.quad2) {
            queue[pushIdx] = node.quad2;
            queueLength += 1;
            pushIdx += 1;
          }
          if (node.quad3) {
            queue[pushIdx] = node.quad3;
            queueLength += 1;
            pushIdx += 1;
          }
        }
      }
    }

    sourceBody.force.x += fx;
    sourceBody.force.y += fy;
  }

  function insertBodies(bodies) {
    var x1 = Number.MAX_VALUE,
      y1 = Number.MAX_VALUE,
      x2 = Number.MIN_VALUE,
      y2 = Number.MIN_VALUE,
      i,
      max = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    i = max;
    while (i--) {
      var x = bodies[i].pos.x;
      var y = bodies[i].pos.y;
      if (x < x1) {
        x1 = x;
      }
      if (x > x2) {
        x2 = x;
      }
      if (y < y1) {
        y1 = y;
      }
      if (y > y2) {
        y2 = y;
      }
    }

    // Squarify the bounds.
    var dx = x2 - x1,
      dy = y2 - y1;
    if (dx > dy) {
      y2 = y1 + dx;
    } else {
      x2 = x1 + dy;
    }

    currentInCache = 0;
    root = newNode();
    root.left = x1;
    root.right = x2;
    root.top = y1;
    root.bottom = y2;

    i = max - 1;
    if (i >= 0) {
      root.body = bodies[i];
    }
    while (i--) {
      insert(bodies[i], root);
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop(),
        node = stackItem.node,
        body = stackItem.body;

      if (!node.body) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        var x = body.pos.x;
        var y = body.pos.y;
        node.mass = node.mass + body.mass;
        node.massX = node.massX + body.mass * x;
        node.massY = node.massY + body.mass * y;

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0, // Assume we are in the 0's quad.
          left = node.left,
          right = (node.right + left) / 2,
          top = node.top,
          bottom = (node.bottom + top) / 2;

        if (x > right) { // somewhere in the eastern part.
          quadIdx = quadIdx + 1;
          left = right;
          right = node.right;
        }
        if (y > bottom) { // and in south.
          quadIdx = quadIdx + 2;
          top = bottom;
          bottom = node.bottom;
        }

        var child = getChild(node, quadIdx);
        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          child.left = left;
          child.top = top;
          child.right = right;
          child.bottom = bottom;
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = null; // internal nodes do not cary bodies

        if (isSamePosition(oldBody.pos, body.pos)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            var dx = (node.right - node.left) * offset;
            var dy = (node.bottom - node.top) * offset;

            oldBody.pos.x = node.left + dx;
            oldBody.pos.y = node.top + dy;
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

          if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }
};

function getChild(node, idx) {
  if (idx === 0) return node.quad0;
  if (idx === 1) return node.quad1;
  if (idx === 2) return node.quad2;
  if (idx === 3) return node.quad3;
  return null;
}

function setChild(node, idx, child) {
  if (idx === 0) node.quad0 = child;
  else if (idx === 1) node.quad1 = child;
  else if (idx === 2) node.quad2 = child;
  else if (idx === 3) node.quad3 = child;
}

},{"./insertStack":17,"./isSamePosition":18,"./node":19,"ngraph.random":20}],17:[function(require,module,exports){
module.exports = InsertStack;

/**
 * Our implmentation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack () {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function() {
        return this.popIdx === 0;
    },
    push: function (node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressue: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function () {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function () {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
}

},{}],18:[function(require,module,exports){
module.exports = function isSamePosition(point1, point2) {
    var dx = Math.abs(point1.x - point2.x);
    var dy = Math.abs(point1.y - point2.y);

    return (dx < 1e-8 && dy < 1e-8);
};

},{}],19:[function(require,module,exports){
/**
 * Internal data structure to represent 2D QuadTree node
 */
module.exports = function Node() {
  // body stored inside this node. In quad tree only leaf nodes (by construction)
  // contain boides:
  this.body = null;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
  this.quad0 = null;
  this.quad1 = null;
  this.quad2 = null;
  this.quad3 = null;

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  this.massX = 0;
  this.massY = 0;

  // bounding box coordinates
  this.left = 0;
  this.top = 0;
  this.bottom = 0;
  this.right = 0;
};

},{}],20:[function(require,module,exports){
module.exports = random;

// TODO: Deprecate?
module.exports.random = random,
module.exports.randomIterator = randomIterator

/**
 * Creates seeded PRNG with two methods:
 *   next() and nextDouble()
 */
function random(inputSeed) {
  var seed = typeof inputSeed === 'number' ? inputSeed : (+new Date());
  return new Generator(seed)
}

function Generator(seed) {
  this.seed = seed;
}

/**
  * Generates random integer number in the range from 0 (inclusive) to maxValue (exclusive)
  *
  * @param maxValue Number REQUIRED. Omitting this number will result in NaN values from PRNG.
  */
Generator.prototype.next = next;

/**
  * Generates random double number in the range from 0 (inclusive) to 1 (exclusive)
  * This function is the same as Math.random() (except that it could be seeded)
  */
Generator.prototype.nextDouble = nextDouble;

/**
 * Returns a random real number uniformly in [0, 1)
 */
Generator.prototype.uniform = nextDouble;

Generator.prototype.gaussian = gaussian;

function gaussian() {
  // use the polar form of the Box-Muller transform
  // based on https://introcs.cs.princeton.edu/java/23recursion/StdRandom.java
  var r, x, y;
  do {
    x = this.nextDouble() * 2 - 1;
    y = this.nextDouble() * 2 - 1;
    r = x * x + y * y;
  } while (r >= 1 || r === 0);

  return x * Math.sqrt(-2 * Math.log(r)/r);
}

function nextDouble() {
  var seed = this.seed;
  // Robert Jenkins' 32 bit integer hash function.
  seed = ((seed + 0x7ed55d16) + (seed << 12)) & 0xffffffff;
  seed = ((seed ^ 0xc761c23c) ^ (seed >>> 19)) & 0xffffffff;
  seed = ((seed + 0x165667b1) + (seed << 5)) & 0xffffffff;
  seed = ((seed + 0xd3a2646c) ^ (seed << 9)) & 0xffffffff;
  seed = ((seed + 0xfd7046c5) + (seed << 3)) & 0xffffffff;
  seed = ((seed ^ 0xb55a4f09) ^ (seed >>> 16)) & 0xffffffff;
  this.seed = seed;
  return (seed & 0xfffffff) / 0x10000000;
}

function next(maxValue) {
  return Math.floor(this.nextDouble() * maxValue);
}

/*
 * Creates iterator over array, which returns items of array in random order
 * Time complexity is guaranteed to be O(n);
 */
function randomIterator(array, customRandom) {
  var localRandom = customRandom || random();
  if (typeof localRandom.next !== 'function') {
    throw new Error('customRandom does not match expected API: next() function is missing');
  }

  return {
    forEach: forEach,

    /**
     * Shuffles array randomly, in place.
     */
    shuffle: shuffle
  };

  function shuffle() {
    var i, j, t;
    for (i = array.length - 1; i > 0; --i) {
      j = localRandom.next(i + 1); // i inclusive
      t = array[j];
      array[j] = array[i];
      array[i] = t;
    }

    return array;
  }

  function forEach(callback) {
    var i, j, t;
    for (i = array.length - 1; i > 0; --i) {
      j = localRandom.next(i + 1); // i inclusive
      t = array[j];
      array[j] = array[i];
      array[i] = t;

      callback(t);
    }

    if (array.length) {
      callback(array[0]);
    }
  }
}
},{}]},{},[1])(1)
});