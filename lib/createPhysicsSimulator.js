/**
 * Manages a simulation of physical forces acting on bodies and springs.
 *
 * Numbers of all bodies live in flat typed arrays (`simulator.store`, see createBodyStore.js):
 * axis `k` of body `i` is `pos[i * D + k]`. `simulator.bodies[i]` is a view of row `i`.
 *
 * Every step runs a list of named stages. The built in ones are:
 *
 *   clear      - zero the forces of bodies that are not pinned;
 *   repulsion  - every pair of bodies pushes apart (Barnes-Hut quad tree or dual tree), by the
 *                repulsion law (see repulsionLaw.js);
 *   drag       - slow bodies down (skipped by the FIRE integrator);
 *   springs    - links pull or push their ends towards the spring length;
 *   integrate  - move bodies.
 *
 * Stages added with `addStage()` go before `integrate` unless told otherwise.
 */
module.exports = createPhysicsSimulator;

var generateCreateBodyFunction = require('./codeGenerators/generateCreateBody');
var generateQuadTreeFunction = require('./codeGenerators/generateQuadTree');
var generateBoundsFunction = require('./codeGenerators/generateBounds');
var generateCreateDragForceFunction = require('./codeGenerators/generateCreateDragForce');
var generateCreateSpringForceFunction = require('./codeGenerators/generateCreateSpringForce');
var generateIntegratorFunction = require('./codeGenerators/generateIntegrator');
var generateFireIntegratorFunction = require('./codeGenerators/generateFireIntegrator');
var generateDualTreeFunction = require('./codeGenerators/generateDualTree');
var generateClearForcesFunction = require('./codeGenerators/generateClearForces');
var createBodyStore = require('./createBodyStore');
var createSpringStore = require('./createSpringStore');
var createRepulsionLaw = require('./repulsionLaw');
var createNeighborGrid = require('./createNeighborGrid');
var Spring = require('./spring');
var copyBody = createBodyStore.copyBody;
var getVariableName = require('./codeGenerators/getVariableName');

var dimensionalCache = {};
// Trees are generated for every dimension and law:
var treeCache = {};

// The length unit never goes below this, so ideas can divide by it
var MIN_UNIT = 1e-3;

function createPhysicsSimulator(settings) {
  var merge = require('ngraph.merge');
  var eventify = require('ngraph.events');
  if (settings) {
    // Check for names from older versions of the layout
    if (settings.springCoeff !== undefined) throw new Error('springCoeff was renamed to springCoefficient');
    if (settings.dragCoeff !== undefined) throw new Error('dragCoeff was renamed to dragCoefficient');
  }

  settings = merge(settings, {
      /**
       * Ideal length for links (springs in physical model).
       */
      springLength: 10,

      /**
       * Hook's law coefficient. 1 - solid spring.
       */
      springCoefficient: 0.8,

      /**
       * Coulomb's law coefficient. It's used to repel nodes thus should be negative
       * if you make it positive nodes start attract each other :).
       */
      gravity: -12,

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
      dragCoefficient: 0.9,

      /**
       * Default time step (dt) for forces integration
       */
      timeStep : 0.5,

      /**
       * Maximum speed of a body. Each step moves a body by at most `timeStep * maxVelocity`.
       * Before v3.4 the limit was fixed at 1; 4 lets graphs unfold faster at no cost per step.
       */
      maxVelocity: 4,

      /**
       * How velocities and positions are updated from forces:
       *  'euler' - classic integration, slowed down by drag force;
       *  'fire' - Fast Inertial Relaxation Engine. Ignores `dragCoefficient`: keeps momentum
       *  while the system moves "downhill" and stops it when it overshoots. Usually reaches
       *  a good layout in fewer steps, especially on trees and grids.
       */
      integrator: 'euler',

      /**
       * How repulsion between bodies is computed:
       *  'quadtree' - Barnes-Hut, each body walks the tree;
       *  'dualtree' - pairs of tree cells interact with each other. Several times faster
       *  for large graphs, with about the same accuracy for the same `theta`.
       */
      nbody: 'quadtree',

      /**
       * Name of the body column with charges (how hard bodies push each other). The mass
       * (how slowly a body speeds up) is used by default.
       */
      repulsionCharge: 'mass',

      /**
       * Name of the body column with how strongly bodies feel the push of others. Empty means
       * the charge. A body with charge 0 and some sensitivity is pushed but pushes nobody,
       * and the quad tree leaves it out.
       */
      repulsionSensitivity: '',

      /**
       * Adaptive time step uses average spring length to compute actual time step:
       * See: https://twitter.com/anvaka/status/1293067160755957760
       */
      adaptiveTimeStepWeight: 0,

      /**
       * This parameter defines number of dimensions of the space where simulation
       * is performed.
       */
      dimensions: 2,

      /**
       * In debug mode more checks are performed, this will help you catch errors
       * quickly, however for production build it is recommended to turn off this flag
       * to speed up computation.
       */
      debug: false
  });

  // How hard two unit charges push each other at distance r: a string like 'exp(-r / L) / r^2',
  // or an object (see repulsionLaw.js). Empty means 1/r^2. (Not merged with defaults above, as
  // merging would turn an empty law into {}.)
  if (settings.repulsionLaw === undefined) settings.repulsionLaw = null;

  if (settings.integrator !== 'euler' && settings.integrator !== 'fire') {
    throw new Error('Unknown integrator: ' + settings.integrator + '. Expected `euler` or `fire`');
  }
  if (settings.nbody !== 'quadtree' && settings.nbody !== 'dualtree') {
    throw new Error('Unknown nbody: ' + settings.nbody + '. Expected `quadtree` or `dualtree`');
  }

  var dimensions = settings.dimensions;
  var factory = dimensionalCache[dimensions];
  if (!factory) {
    factory = {
      Body: generateCreateBodyFunction(dimensions, settings.debug),
      createBounds: generateBoundsFunction(dimensions),
      createDragForce: generateCreateDragForceFunction(dimensions),
      createSpringForce: generateCreateSpringForceFunction(dimensions),
      integrate: generateIntegratorFunction(dimensions),
      createFireIntegrator: generateFireIntegratorFunction(dimensions),
      clearForces: generateClearForcesFunction(dimensions),
    };
    dimensionalCache[dimensions] = factory;
  }

  var Body = factory.Body;
  var fireIntegrate; // created on demand, since FIRE keeps state between steps

  var random = require('ngraph.random').random(42);
  var store = createBodyStore(dimensions);
  var bodies = []; // Bodies in this simulation.
  store.onResize = function () {
    for (var i = 0; i < bodies.length; ++i) bodies[i].moveTo(store, bodies[i].index);
  };
  var springs = []; // Springs in this simulation.
  var springStore = createSpringStore(); // and their numbers
  // Removed bodies and springs leave their rows in the stores until the next step, when
  // compact() drops all of them at once. `bodies` and `springs` are always up to date, and
  // stay sorted by row.
  var removedBodyRows = [], removedSpringRows = [];
  // Bodies removed since the last compact() keep their numbers here (one store for all of
  // them is much cheaper than one store each):
  var removedStore = null, removedBodies = [];
  // Set when bodies or springs were added or removed; the next step fires 'topology'
  var topologyChanged = false;

  var law = createRepulsionLaw(settings.repulsionLaw);
  var quadTree, dualTree; // created on demand, for the current law
  var bounds = factory.createBounds(store, settings, random);
  var springForce = factory.createSpringForce(settings, random);
  var dragForce = factory.createDragForce(settings);
  var neighborGrid; // created on demand
  var pairRules = [];

  var totalMovement = 0; // how much movement we made on last step
  var iterationNumber = 0;

  var stages = [];
  addStage('clear', clearStage);
  addStage('repulsion', repulsionStage);
  addStage('drag', dragStage);
  addStage('springs', springStage);
  addStage('integrate', integrateStage);

  var publicApi = {
    /**
     * Array of bodies, registered with current simulator. `bodies[i].index` is the body's row
     * in the store (equal to `i` while the simulator steps).
     *
     * Note: To add new body, use addBody() method.
     */
    bodies: bodies,

    /**
     * Columns of body numbers: `pos`, `velocity`, `force` (D numbers per body), `mass`,
     * `pinned`, `degree` (number of springs), and any column added with `store.define()`.
     */
    store: store,

    /**
     * Array of springs, registered with current simulator
     *
     * Note: To add new spring, use addSpring() method.
     */
    springs: springs,

    /**
     * Columns of spring numbers: `from`, `to` (body rows), `length`, `coefficient`.
     */
    springStore: springStore,

    /**
     * Returns settings with which current simulator was initialized
     */
    settings: settings,

    /**
     * Names of the stages of a step, in the order they run.
     */
    stages: function () {
      return stages.map(function (stage) { return stage.name; });
    },

    /**
     * Adds `run(store, simulator)` to every step. `options.before` or `options.after` name the
     * stage to run next to; by default new stages run just before `integrate`.
     */
    addStage: addStage,

    /**
     * Replaces the stage `name` with `run`, keeping its place. Returns the old function.
     */
    replaceStage: function (name, run) {
      var stage = getStage(name);
      if (!stage) throw new Error('No stage named ' + name);
      var old = stage.run;
      stage.run = run;
      return old;
    },

    /**
     * Removes the stage `name`. Returns true when there was such a stage.
     */
    removeStage: function (name) {
      for (var i = 0; i < stages.length; ++i) {
        if (stages[i].name === name) {
          stages.splice(i, 1);
          return true;
        }
      }
      return false;
    },

    /**
     * Returns the function of stage `name`, so it can be wrapped or reused.
     */
    getStage: function (name) {
      var stage = getStage(name);
      return stage && stage.run;
    },

    /**
     * Gets or sets the repulsion law: a string like 'exp(-r / L) / r^2' or an object (see
     * repulsionLaw.js). `null` restores 1/r^2.
     */
    repulsionLaw: function (spec) {
      if (spec === undefined) return law;
      law = createRepulsionLaw(spec);
      settings.repulsionLaw = spec;
      quadTree = dualTree = null;
      return publicApi;
    },

    /**
     * Adds a rule for pairs of bodies closer than `options.radius` (a number or a function of
     * the simulator, read every step). For each such pair `rule(i, j, r, store)` returns `s`,
     * and the force `s * (pos_i - pos_j)` is added to body `i`, the opposite one to `j`.
     * With `options.symmetric === false` the rule is asked for both (i, j) and (j, i), and only
     * body `i` gets the force. Pairs are found with one grid shared by all rules.
     *
     * Pair rules run in the stage `pairRules` (added after `springs` with the first rule).
     */
    addPairRule: function (name, options) {
      if (!options || typeof options.rule !== 'function') throw new Error('Pair rule needs a rule(i, j, r, store) function');
      if (pairRules.some(function (rule) { return rule.name === name; })) throw new Error('Pair rule ' + name + ' is already added');
      pairRules.push({
        name: name,
        radius: options.radius,
        rule: options.rule,
        symmetric: options.symmetric !== false
      });
      if (!getStage('pairRules')) addStage('pairRules', pairRuleStage, { after: 'springs' });
    },

    removePairRule: function (name) {
      for (var i = 0; i < pairRules.length; ++i) {
        if (pairRules[i].name === name) {
          pairRules.splice(i, 1);
          if (pairRules.length === 0) publicApi.removeStage('pairRules');
          return true;
        }
      }
      return false;
    },

    /**
     * Grid of bodies for neighbor queries, built from the current positions with cells of
     * `cellSize` (see createNeighborGrid.js). Stages can use it to find close bodies.
     */
    neighbors: function (cellSize) {
      if (!neighborGrid) neighborGrid = createNeighborGrid(dimensions);
      neighborGrid.build(store, cellSize);
      return neighborGrid;
    },

    /**
     * A length that ideas can measure distances in: the spring length, but never below a
     * small positive number (so dividing by it is safe while the spring length is typed in).
     */
    unit: function () {
      var length = settings.springLength;
      return length > MIN_UNIT ? length : MIN_UNIT;
    },

    /**
     * Number of steps performed so far.
     */
    iteration: function () {
      return iterationNumber;
    },

    /**
     * Performs one step of force simulation.
     *
     * @returns {number} amount of movement during this step.
     */
    step: function () {
      compact();
      if (topologyChanged) {
        topologyChanged = false;
        publicApi.fire('topology');
      }
      for (var i = 0; i < stages.length; ++i) {
        stages[i].run(store, publicApi);
      }
      iterationNumber += 1;
      return totalMovement;
    },

    /**
     * Adds body to the system. The body keeps its numbers, but from now on they live in this
     * simulator's store.
     *
     * @param {ngraph.physics.primitives.Body} body physical body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBody: function (body) {
      if (!body) {
        throw new Error('Body is required');
      }
      var index = store.add();
      copyBody(body.store, body.index, store, index);
      store.degree[index] = 0;
      body.moveTo(store, index);
      bodies.push(body);
      topologyChanged = true;

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
      var index = store.add();
      setPosition(index, pos);
      var body = Body.inStore(store, index);
      bodies.push(body);
      topologyChanged = true;

      return body;
    },

    /**
     * Removes body from the system, together with its springs.
     *
     * @param {ngraph.physics.primitives.Body} body to remove
     *
     * @returns {Boolean} true if body found and removed. falsy otherwise;
     */
    removeBody: function (body) {
      if (!body || body.store !== store) { return; }

      var row = body.index;
      // Springs can only connect bodies of this simulator, so they go with the body
      if (store.degree[row] > 0) removeSpringsOf(body);

      // The removed body keeps its last numbers
      if (!removedStore) {
        removedStore = createBodyStore(dimensions);
        removedStore.onResize = onRemovedStoreResize;
      }
      var removedRow = removedStore.add();
      copyBody(store, row, removedStore, removedRow);
      removedBodyRows.push(row);
      bodies.splice(findByRow(bodies, row), 1);
      body.moveTo(removedStore, removedRow);
      removedBodies.push(body);
      topologyChanged = true;

      if (bodies.length === 0) {
        bounds.reset();
      }
      return true;
    },

    /**
     * Adds a spring between two bodies of this simulation.
     *
     * @returns {Object} - a handle for a spring. If you want to later remove
     * spring pass it to removeSpring() method.
     */
    addSpring: function (body1, body2, springLength, springCoefficient) {
      if (!body1 || !body2) {
        throw new Error('Cannot add null spring to force simulator');
      }
      if (body1.store !== store || body2.store !== store) {
        throw new Error('Spring ends should be bodies of this simulator. Use addBody() first');
      }

      if (typeof springLength !== 'number') {
        springLength = -1; // assume global configuration
      }

      var index = springStore.add();
      springStore.from[index] = body1.index;
      springStore.to[index] = body2.index;
      springStore.length[index] = springLength;
      springStore.coefficient[index] = springCoefficient >= 0 ? springCoefficient : -1;
      var spring = new Spring(body1, body2, undefined, undefined, springStore, index);
      springs.push(spring);
      store.degree[body1.index] += 1;
      store.degree[body2.index] += 1;
      topologyChanged = true;

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
      if (!spring || spring.store !== springStore) { return; }
      detachSpring(spring);
      return true;
    },

    getBestNewBodyPosition: function (neighbors) {
      return bounds.getBestNewPosition(neighbors);
    },

    /**
     * Returns bounding box which covers all bodies
     */
    getBBox: getBoundingBox,
    getBoundingBox: getBoundingBox,

    /**
     * Returns pseudo-random number generator instance.
     */
    random: random
  };

  // allow settings modification via public API:
  expose(settings, publicApi);

  eventify(publicApi);

  return publicApi;

  function addStage(name, run, options) {
    if (typeof run !== 'function') throw new Error('Stage ' + name + ' needs a function');
    if (getStage(name)) throw new Error('Stage ' + name + ' is already added');
    var stage = { name: name, run: run };
    var at = stages.length;
    var before = options && options.before;
    var after = options && options.after;
    if (before !== undefined || after !== undefined) {
      at = indexOfStage(before !== undefined ? before : after);
      if (at < 0) throw new Error('No stage named ' + (before !== undefined ? before : after));
      if (after !== undefined) at += 1;
    } else {
      var integrate = indexOfStage('integrate');
      if (integrate >= 0) at = integrate;
    }
    stages.splice(at, 0, stage);
  }

  function getStage(name) {
    var at = indexOfStage(name);
    return at < 0 ? undefined : stages[at];
  }

  function indexOfStage(name) {
    for (var i = 0; i < stages.length; ++i) if (stages[i].name === name) return i;
    return -1;
  }

  function clearStage() {
    factory.clearForces(store);
  }

  function repulsionStage() {
    if (store.n === 0) return;
    law.update(publicApi);
    var charge = store[settings.repulsionCharge];
    if (!charge) throw new Error('No body column named ' + settings.repulsionCharge + ' for charges');
    var sensitivity = settings.repulsionSensitivity ? store[settings.repulsionSensitivity] : charge;
    if (!sensitivity) throw new Error('No body column named ' + settings.repulsionSensitivity + ' for sensitivity');

    if (settings.nbody === 'dualtree') {
      if (!dualTree) dualTree = getTrees().createDualTree(settings, law);
      dualTree.computeForces(store, charge, sensitivity);
      return;
    }

    if (!quadTree) quadTree = getTrees().createQuadTree(settings, random, law);
    quadTree.options(settings);
    quadTree.insertBodies(store, charge, sensitivity);
    var pinned = store.pinned;
    var i = store.n;
    while (i--) {
      if (!pinned[i]) quadTree.updateBodyForce(i);
    }
  }

  function getTrees() {
    var key = dimensions + '|' + law.key;
    var trees = treeCache[key];
    if (!trees) {
      trees = treeCache[key] = {
        createQuadTree: generateQuadTreeFunction(dimensions, law),
        createDualTree: generateDualTreeFunction(dimensions, law)
      };
    }
    return trees;
  }

  function dragStage() {
    // FIRE replaces drag with its own way of removing energy from the system:
    if (settings.integrator !== 'fire') dragForce.update(store);
  }

  function springStage() {
    // Spring counts and lengths per body are only needed by the adaptive time step
    springForce.update(springStore, store, settings.adaptiveTimeStepWeight !== 0);
  }

  function integrateStage() {
    var integrate = factory.integrate;
    if (settings.integrator === 'fire') {
      if (!fireIntegrate) fireIntegrate = factory.createFireIntegrator();
      integrate = fireIntegrate;
    }
    totalMovement = integrate(store, settings.timeStep, settings.adaptiveTimeStepWeight, settings.maxVelocity);
  }

  function pairRuleStage() {
    var radii = pairRules.map(function (rule) {
      return typeof rule.radius === 'function' ? rule.radius(publicApi) : rule.radius;
    });
    var largest = 0;
    for (var i = 0; i < radii.length; ++i) if (radii[i] > largest) largest = radii[i];
    if (!(largest > 0)) return;
    var grid = publicApi.neighbors(largest);
    for (var r = 0; r < pairRules.length; ++r) {
      grid.applyPairRule(radii[r], pairRules[r].rule, pairRules[r].symmetric);
    }
  }

  function setPosition(index, pos) {
    var offset = index * dimensions;
    for (var k = 0; k < dimensions; ++k) {
      var value = pos[getVariableName(k)];
      if (!Number.isFinite(value)) throw new Error('Expected value is not a finite number at Vector constructor (' + getVariableName(k) + ')');
      store.pos[offset + k] = value;
    }
  }

  function getBoundingBox() {
    compact();
    bounds.update();
    return bounds.box;
  }

  function detachSpring(spring) {
    var row = spring.index;
    store.degree[springStore.from[row]] -= 1;
    store.degree[springStore.to[row]] -= 1;
    removedSpringRows.push(row);
    springs.splice(findByRow(springs, row), 1);
    // The removed spring keeps its numbers in its own fields
    spring.detach();
    topologyChanged = true;
  }

  function removeSpringsOf(body) {
    for (var i = springs.length - 1; i >= 0; --i) {
      var spring = springs[i];
      if (spring.from === body || spring.to === body) detachSpring(spring);
    }
  }

  /**
   * Drops the rows of removed springs and bodies; the rows after them move down.
   */
  function compact() {
    if (removedSpringRows.length) {
      removedSpringRows.sort(byNumber);
      springStore.removeRows(removedSpringRows);
      for (var k = firstAfterRow(springs, removedSpringRows[0]); k < springs.length; ++k) {
        springs[k].moveTo(springStore, k);
      }
      removedSpringRows.length = 0;
    }
    if (removedBodyRows.length) {
      removedBodyRows.sort(byNumber);
      if (springStore.n > 0) {
        // Springs keep pointing to the same bodies after they move down
        var newRow = new Int32Array(store.n);
        for (var row = 0, removed = 0; row < store.n; ++row) {
          if (removedBodyRows[removed] === row) removed += 1;
          else newRow[row] = row - removed;
        }
        var from = springStore.from, to = springStore.to;
        for (var s = 0; s < springStore.n; ++s) {
          from[s] = newRow[from[s]];
          to[s] = newRow[to[s]];
        }
      }
      store.removeRows(removedBodyRows);
      for (var i = firstAfterRow(bodies, removedBodyRows[0]); i < bodies.length; ++i) {
        bodies[i].moveTo(store, i);
      }
      removedBodyRows.length = 0;
      // Bodies removed from now on go to a new store
      removedStore = null;
      removedBodies = [];
    }
  }

  function onRemovedStoreResize() {
    for (var i = 0; i < removedBodies.length; ++i) {
      var body = removedBodies[i];
      if (body.store === removedStore) body.moveTo(removedStore, body.index);
    }
  }
}

function byNumber(a, b) { return a - b; }

// Position of the item whose `index` is `row` in an array sorted by `index`
function findByRow(array, row) {
  var lo = 0, hi = array.length - 1;
  while (lo <= hi) {
    var mid = (lo + hi) >> 1;
    var midRow = array[mid].index;
    if (midRow === row) return mid;
    if (midRow < row) lo = mid + 1; else hi = mid - 1;
  }
  return -1;
}

// Position of the first item whose `index` is greater than `row`
function firstAfterRow(array, row) {
  var lo = 0, hi = array.length;
  while (lo < hi) {
    var mid = (lo + hi) >> 1;
    if (array[mid].index <= row) lo = mid + 1; else hi = mid;
  }
  return lo;
}

function expose(settings, target) {
  for (var key in settings) {
    augment(settings, target, key);
  }
}

function augment(source, target, key) {
  if (!source.hasOwnProperty(key)) return;
  if (typeof target[key] === 'function') {
    // this accessor is already defined. Ignore it
    return;
  }
  var sourceIsNumber = Number.isFinite(source[key]);

  if (sourceIsNumber) {
    target[key] = function (value) {
      if (value !== undefined) {
        if (!Number.isFinite(value)) throw new Error('Value of ' + key + ' should be a valid number.');
        source[key] = value;
        return target;
      }
      return source[key];
    };
  } else {
    target[key] = function (value) {
      if (value !== undefined) {
        source[key] = value;
        return target;
      }
      return source[key];
    };
  }
}
