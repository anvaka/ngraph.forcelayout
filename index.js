module.exports = createLayout;
module.exports.simulator = require("./lib/createPhysicsSimulator");
module.exports.noop = noop;

const Spring = require("./lib/spring");
var eventify = require("ngraph.events");

/**
 * Creates force based layout for a given graph.
 *
 * @param {graphology.Graph} graph which needs to be laid out
 * @param {object} physicsSettings if you need custom settings
 * for physics simulator you can pass your own settings here. If it's not passed
 * a default one will be created.
 */
function createLayout(graph, physicsSettings) {
  if (!graph) {
    throw new Error("Graph structure cannot be undefined");
  }

  var createSimulator =
    (physicsSettings && physicsSettings.createSimulator) ||
    require("./lib/createPhysicsSimulator");
  var physicsSimulator = createSimulator(physicsSettings);
  if (Array.isArray(physicsSettings))
    throw new Error("Physics settings is expected to be an object");

  let nodeMass = defaultNodeMass;
  if (physicsSettings && typeof physicsSettings.nodeMass === "function") {
    nodeMass = physicsSettings.nodeMass;
  }

  var nodeBodies = new Map();

  var springTransform = physicsSimulator.settings.springTransform || noop;

  // Define event handlers
  const nodeAddedHandler = ({ key, attributes }) => initBody(key, attributes);
  const edgeAddedHandler = ({ key, source, target, attributes }) =>
    initLink(key, attributes, source, target);
  const nodeDroppedHandler = ({ key, attributes }) =>
    releaseNode(key, attributes);
  const edgeDroppedHandler = ({ key, source, target, attributes }) =>
    releaseLink(key, attributes, source, target);
  const nodeAttributesUpdatedHandler = ({ type, key, attributes, name }) =>
    handleNodeUpdates(type, key, attributes, name); // Could pass 'data' if we wanted

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
    step: function () {
      if (nodeBodies.size === 0) {
        updateStableStatus(true);
        return true;
      }

      var lastMove = physicsSimulator.step();

      // Save the movement in case if someone wants to query it in the step
      // callback.
      api.lastMove = lastMove;

      // Allow listeners to perform low-level actions after nodes are updated.
      api.fire("step");

      var ratio = lastMove / nodeBodies.size;
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
    },

    /**
     * @returns {Object} Link position by link id
     * @returns {Object.from} {x, y} coordinates of link start
     * @returns {Object.to} {x, y} coordinates of link end
     */
    getLinkPosition: function (linkId) {
      const spring = getSpring(linkId);
      if (spring) {
        return {
          from: spring.from.pos,
          to: spring.to.pos,
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
    pinNode: pinNode,

    /**
     * Checks whether given graph's node is currently pinned
     */
    isNodePinned: function (nodeId) {
      return getInitializedBody(nodeId).isPinned;
    },

    /**
     * Request to release all resources
     */
    dispose: function () {
      graph.off("nodeAdded", nodeAddedHandler);
      graph.off("edgeAdded", edgeAddedHandler);
      graph.off("nodeDropped", nodeDroppedHandler);
      graph.off("edgeDropped", edgeDroppedHandler);
      graph.off("nodeAttributesUpdated", nodeAttributesUpdatedHandler);
      graph.off("cleared", handleCleared);
      api.fire("disposed");
    },

    /**
     * Gets physical body for a given node id. If node is not found undefined
     * value is returned.
     */
    getBody: getBody,

    /**
     * Gets spring for a given edge.
     * @param {string} linkId link identifier.
     */
    getSpring: getSpring,

    /**
     * Returns length of cumulative force vector. The closer this to zero - the more stable the system is
     */
    getForceVectorLength: getForceVectorLength,

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
    lastMove: 0,

    getDimensions: getDimensions,
  };

  if (physicsSettings && physicsSettings.debug) {
    const privateFunctions = {
      updateStableStatus: updateStableStatus,
      listenToEvents: listenToEvents,
      handleNodeUpdates: handleNodeUpdates,
      handleCleared: handleCleared,
      onStableChanged: onStableChanged,
      initPhysics: initPhysics,
      initBody: initBody,
      releaseNode: releaseNode,
      releaseLink: releaseLink,
      getNeighborBodies: getNeighborBodies,
      updateBodyMass: updateBodyMass,
      isNodeOriginallyPinned: isNodeOriginallyPinned,
      getInitializedBody: getInitializedBody,
      defaultNodeMass: defaultNodeMass,
      initLink: initLink,
      nodeBodies: nodeBodies,
    };
    Object.assign(api, privateFunctions);
  }
  eventify(api);

  return api;

  function getDimensions() {
    return physicsSimulator.getDimensions();
  }

  function updateStableStatus(isStableNow) {
    // untouched
    if (wasStable !== isStableNow) {
      wasStable = isStableNow;
      onStableChanged(isStableNow);
    }
  }

  function forEachBody(cb) {
    // untouched
    nodeBodies.forEach(cb);
  }

  function getForceVectorLength() {
    // untouched
    var fx = 0,
      fy = 0;
    forEachBody(function (body) {
      fx += Math.abs(body.force.x);
      fy += Math.abs(body.force.y);
    });
    return Math.sqrt(fx * fx + fy * fy);
  }

  function getSpring(linkId) {
    // graphology
    return physicsSimulator.getSpring(linkId);
  }

  function getBody(nodeId) {
    // untouched
    return nodeBodies.get(nodeId);
  }

  function pinNode(nodeId, isPinned) {
    var body = getInitializedBody(nodeId);
    body.isPinned = !!isPinned;
  }

  function listenToEvents() {
    // graphology
    graph.on("nodeAdded", nodeAddedHandler);
    graph.on("edgeAdded", edgeAddedHandler);
    graph.on("nodeDropped", nodeDroppedHandler);
    graph.on("edgeDropped", edgeDroppedHandler);
    graph.on("nodeAttributesUpdated", nodeAttributesUpdatedHandler);
    graph.on("cleared", handleCleared);
  }

  function handleNodeUpdates(type, nodeId, attributes, name) {
    if (type == "set") {
      if (name == "isPinned") {
        pinNode(nodeId, attributes.isPinned);
      }
    }
  }

  function handleCleared() {
    physicsSimulator = createSimulator(physicsSettings);
    nodeBodies = new Map();
    initPhysics();
  }

  function onStableChanged(isStable) {
    // untouched
    api.fire("stable", isStable);
  }

  function initPhysics() {
    // graphology
    graph.forEachNode(initBody);
    graph.forEachEdge(initLink);
  }

  function initBody(nodeId, nodeAttrs) {
    // graphology
    var body = nodeBodies.get(nodeId);
    if (!body) {
      if (!graph.hasNode(nodeId)) {
        throw new Error("initBody() was called with unknown node id");
      }

      var pos = nodeAttrs.position;
      if (!pos) {
        var neighbors = getNeighborBodies(nodeId);
        pos = physicsSimulator.getBestNewBodyPosition(neighbors);
      }

      body = physicsSimulator.addBodyAt(pos);
      body.id = nodeId;

      nodeBodies.set(nodeId, body);
      updateBodyMass(nodeId);

      if (isNodeOriginallyPinned(nodeId)) {
        body.isPinned = true;
      }
    }
  }

  function releaseNode(nodeId) {
    // graphology
    var body = nodeBodies.get(nodeId);
    if (body) {
      nodeBodies.delete(nodeId);
      physicsSimulator.removeBody(body);
    }
  }

  function initLink(edge, attributes, source, target) {
    const fromBody = nodeBodies.get(source);
    const toBody = nodeBodies.get(target);
    if (!fromBody || !toBody) {
      throw new Error(
        "initLink() was called with unknown source or target node id",
      );
    }
    const spring = new Spring(fromBody, toBody, attributes.length);
    physicsSimulator.addSpringWithKey(edge, spring);
    updateBodyMass(source);
    updateBodyMass(target);
    return spring;
  }

  function releaseLink(link) {
    // graphology
    const spring = physicsSimulator.getSpring(link);
    if (!spring) {
      throw new Error("releaseLink() was called with unknown link id");
    }
    const source = spring.from;
    const target = spring.to;
    physicsSimulator.removeSpring(link);
    updateBodyMass(source.id);
    updateBodyMass(target.id);
    return spring;
  }

  function getNeighborBodies(nodeId) {
    // graphology
    if (!graph.hasNode(nodeId)) {
      throw new Error("getNeighborBodies() was called with unknown node id");
    }
    const neighbors = graph.mapNeighbors(nodeId, (neighbor) => {
      return nodeBodies.get(neighbor);
    });
    const maxNeighbors = Math.min(neighbors.length, 2); // Not sure why we're capping the neighbors, but that's how the old code worked

    return neighbors.slice(0, maxNeighbors);
  }

  function updateBodyMass(nodeId) {
    // untouched
    const body = nodeBodies.get(nodeId);
    body.mass = nodeMass(nodeId);
  }

  /**
   * Checks whether graphology node has isPinned attribute,
   * which means layout algorithm cannot move it.
   *
   * @param {any} node a graphology node to check
   * @return {Boolean} true if node should be treated as pinned; falsy otherwise.
   */
  function isNodeOriginallyPinned(node) {
    return graph.getNodeAttribute(node, "isPinned");
  }

  function getInitializedBody(nodeId) {
    // untouched
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
    // graphology
    const links = graph.edges(nodeId);
    if (links.length == 0) return 1;
    return 1 + links.length / 3.0;
  }
}

function noop() {}
