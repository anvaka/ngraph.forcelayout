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
 * Stages added with `addStage()` go before `integrate` unless told otherwise. Stages can also be
 * written as formulas (see formulaStages.js): the simulator then owns the loop, and other engines
 * can run the same formula. `plan()` tells which stages an engine can run.
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
// Loaded with the first formula stage, so layouts without formulas don't pay for them
var formulaStages;
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
  // Results of sums, by name (see addSum)
  var sums = Object.create(null);

  var totalMovement = 0; // how much movement we made on last step
  var iterationNumber = 0;

  var stages = [];
  addStage('clear', clearStage, null, describeAs('clear'));
  addStage('repulsion', repulsionStage, null, function () {
    return {
      shape: 'tree', builtIn: true, law: law,
      charge: settings.repulsionCharge, sensitivity: settings.repulsionSensitivity || settings.repulsionCharge
    };
  });
  addStage('drag', dragStage, null, describeAs('drag'));
  addStage('springs', springStage, null, describeAs('springs'));
  addStage('integrate', integrateStage, null, function () { return { shape: 'integrate', builtIn: true, integrator: settings.integrator }; });

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
     * stage to run next to; by default new stages run just before `integrate`. With
     * `options.replace` the stage takes the place of the named one, which comes back when this
     * stage is removed.
     */
    addStage: function (name, run, options) {
      addStage(name, run, options);
    },

    /**
     * Replaces the stage `name` with `run`, keeping its place. Returns the old function. The
     * stage is a JS stage for plan() until its first function is put back.
     */
    replaceStage: function (name, run) {
      var stage = getStage(name);
      if (!stage) throw new Error('No stage named ' + name);
      var old = stage.run;
      if (!stage.first) stage.first = { run: old, describe: stage.describe };
      stage.run = run;
      stage.describe = run === stage.first.run ? stage.first.describe : describeJS;
      return old;
    },

    /**
     * Removes the stage `name` (a formula stage too). A stage it replaced comes back. Returns
     * true when there was such a stage.
     */
    removeStage: function (name) {
      var at = indexOfStage(name);
      if (at < 0) return false;
      var stage = stages[at];
      if (stage.replaced) stages.splice(at, 1, stage.replaced);
      else stages.splice(at, 1);
      if (stage.dispose) stage.dispose();
      return true;
    },

    /**
     * Adds a stage that runs `options.formula` for every body (see formulaStages.js). The
     * formula reads and assigns the body's columns by name, e.g. 'force += -k * (pos - center)'.
     * `options.params` are numbers or functions of the simulator, read once per step;
     * `options.tables` are lookup tables; `before`, `after` and `replace` place the stage as in
     * addStage().
     */
    addNodeFormula: function (name, options) {
      addFormulaStage(name, getFormulaStages().node(publicApi, name, options), options);
    },

    /**
     * Adds a stage that runs `options.formula` for every link (see formulaStages.js). The formula
     * sets `pull` from `r`, `length`, `coefficient`, link columns and the columns of both ends
     * (`mass_i`, `mass_j`). With `replace: 'springs'` it takes the place of the stock springs;
     * 'pull = coefficient * (r - length)' is what they compute.
     */
    addLinkFormula: function (name, options) {
      addFormulaStage(name, getFormulaStages().link(publicApi, name, options), options);
    },

    /**
     * Adds a stage that runs `options.formula` for every pair of bodies closer than
     * `options.radius` (see formulaStages.js). The formula sets `push` from `r` and the columns
     * of both bodies (`mass_i`, `mass_j`), and can add into columns (`stiff_i += ...`).
     * By default the stage runs after `springs`.
     */
    addPairFormula: function (name, options) {
      var placement = options;
      if (options && options.before === undefined && options.after === undefined && options.replace === undefined) {
        placement = getStage('springs') ? { after: 'springs' } : undefined;
      }
      addFormulaStage(name, getFormulaStages().pair(publicApi, name, options), placement);
    },

    /**
     * Adds a stage that adds up `options.formula` over bodies (or links, with
     * `over: 'links'`), for all of them or per group (`group`: a column of group ids). Formulas
     * added later read the result by `name` (or `name[group]`). `reduce` can be 'sum', 'min' or
     * 'max'. Sums run where they are placed, like other stages; place them before the formulas
     * that read them.
     */
    addSum: function (name, options) {
      if (sums[name]) throw new Error('Sum ' + name + ' is already added');
      var builtIn = require('./formula').BUILT_IN_VALUES;
      if (!/^[A-Za-z_]\w*$/.test(name) || builtIn[name] || name === 'D' || name === 'pi' || store.has(name)) {
        throw new Error('Sum ' + name + ' needs a name that is not a column or a built in value');
      }
      var stage = getFormulaStages().sum(publicApi, name, options);
      stage.dispose = function () { delete sums[name]; };
      addFormulaStage(name, stage, options);
      sums[name] = stage.result;
    },

    /**
     * Results of sums by name: {value, groups, count, width} (see formulaStages.js).
     */
    sums: function () {
      return sums;
    },

    /**
     * Adds another repulsion pass: every pair of bodies pushes apart by `options.law` (see
     * repulsionLaw.js), with charges from the body column `options.charge` (which should not be
     * negative) and sensitivity from `options.sensitivity`. Each pass walks its own tree, so a
     * pass costs about what the stock repulsion costs. Bodies with sensitivity 0 are skipped.
     */
    addRepulsion: function (name, options) {
      options = options || {};
      addFormulaStage(name, createRepulsionPass(name, options), options);
    },

    /**
     * Tells which stages an engine can run. `backend` describes an engine (see
     * modules/gpu/index.js): {name, check(description, simulator), checkSettings(simulator)}.
     * Without one it describes the CPU, which runs every stage. Returns {backend, runs,
     * reasons, stages: [{stage, shape, runs, how or reason}]}.
     */
    plan: function (backend) {
      var planned = stages.map(function (stage) {
        var description = stage.describe ? stage.describe() : { shape: 'js' };
        var verdict = backend ? backend.check(description, publicApi) : { runs: true, how: CPU_HOW[description.shape] };
        var entry = { stage: stage.name, shape: description.shape, runs: verdict.runs };
        if (verdict.runs) entry.how = verdict.how;
        else entry.reason = verdict.reason;
        return entry;
      });
      var reasons = backend && backend.checkSettings ? backend.checkSettings(publicApi) : [];
      planned.forEach(function (entry) { if (!entry.runs) reasons.push(entry.stage + ': ' + entry.reason); });
      return { backend: backend ? backend.name : 'cpu', runs: reasons.length === 0, reasons: reasons, stages: planned };
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
     * Bodies on the same spot get r = 0. The force is then `s` itself, along an axis picked
     * from i and j (as in the dual tree); a rule that gives no finite `s` there, e.g. one that
     * divides by r, leaves them alone.
     *
     * Pair rules run in the stage `pairRules`, added with the first rule after `springs` (or
     * before `integrate`, when there is no `springs` stage).
     */
    addPairRule: function (name, options) {
      if (!options || typeof options.rule !== 'function') throw new Error('Pair rule needs a rule(i, j, r, store) function');
      if (pairRules.some(function (rule) { return rule.name === name; })) throw new Error('Pair rule ' + name + ' is already added');
      if (!getStage('pairRules')) {
        addStage('pairRules', pairRuleStage, getStage('springs') ? { after: 'springs' } : undefined, function () {
          return { shape: 'pair rules', rules: pairRules.map(function (rule) { return rule.name; }) };
        });
      }
      pairRules.push({
        name: name,
        radius: options.radius,
        rule: options.rule,
        symmetric: options.symmetric !== false
      });
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
     * simulator's store. Columns added with `store.define()` start from their initial values.
     *
     * @param {ngraph.physics.primitives.Body} body physical body
     *
     * @returns {ngraph.physics.primitives.Body} added body
     */
    addBody: function (body) {
      if (!body) {
        throw new Error('Body is required');
      }
      if (body.store === store) {
        throw new Error('Body is already in this simulator');
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
      checkPosition(pos);
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

  function addStage(name, run, options, describe) {
    if (typeof run !== 'function') throw new Error('Stage ' + name + ' needs a function');
    if (getStage(name)) throw new Error('Stage ' + name + ' is already added');
    var stage = { name: name, run: run, describe: describe, replaced: null, dispose: null, first: null };
    var at = stages.length;
    var before = options ? options.before : undefined;
    var after = options ? options.after : undefined;
    var replace = options ? options.replace : undefined;
    if (replace !== undefined) {
      at = indexOfStage(replace);
      if (at < 0) throw new Error('No stage named ' + replace);
      stage.replaced = stages[at];
      stages[at] = stage;
      return stage;
    }
    if (before !== undefined || after !== undefined) {
      at = indexOfStage(before !== undefined ? before : after);
      if (at < 0) throw new Error('No stage named ' + (before !== undefined ? before : after));
      if (after !== undefined) at += 1;
    } else {
      var integrate = indexOfStage('integrate');
      if (integrate >= 0) at = integrate;
    }
    stages.splice(at, 0, stage);
    return stage;
  }

  function addFormulaStage(name, formulaStage, options) {
    var stage = addStage(name, formulaStage.run, options, formulaStage.describe);
    stage.dispose = formulaStage.dispose || null;
  }

  function describeAs(shape) {
    return function () { return { shape: shape, builtIn: true }; };
  }

  function describeJS() {
    return { shape: 'js' };
  }

  // A repulsion pass of its own, for addRepulsion()
  function createRepulsionPass(name, options) {
    var passLaw = createRepulsionLaw(options.law);
    var passQuadTree, passDualTree;
    return {
      run: function () {
        if (store.n === 0) return;
        passLaw.update(publicApi);
        var chargeName = options.charge || settings.repulsionCharge;
        var charge = store[chargeName];
        if (!charge) throw new Error(name + ': no body column named ' + chargeName + ' for charges');
        var sensitivity = options.sensitivity ? store[options.sensitivity] : charge;
        if (!sensitivity) throw new Error(name + ': no body column named ' + options.sensitivity + ' for sensitivity');
        if (settings.nbody === 'dualtree') {
          if (!passDualTree) passDualTree = getTrees(passLaw).createDualTree(settings, passLaw);
          passDualTree.computeForces(store, charge, sensitivity);
          return;
        }
        if (!passQuadTree) passQuadTree = getTrees(passLaw).createQuadTree(settings, random, passLaw);
        passQuadTree.options(settings);
        passQuadTree.insertBodies(store, charge, sensitivity);
        var pinned = store.pinned;
        var i = store.n;
        while (i--) {
          if (!pinned[i] && sensitivity[i] !== 0) passQuadTree.updateBodyForce(i);
        }
      },
      describe: function () {
        return {
          shape: 'tree',
          law: passLaw,
          charge: options.charge || settings.repulsionCharge,
          sensitivity: options.sensitivity || options.charge || settings.repulsionCharge
        };
      }
    };
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
      if (!dualTree) dualTree = getTrees(law).createDualTree(settings, law);
      dualTree.computeForces(store, charge, sensitivity);
      return;
    }

    if (!quadTree) quadTree = getTrees(law).createQuadTree(settings, random, law);
    quadTree.options(settings);
    quadTree.insertBodies(store, charge, sensitivity);
    var pinned = store.pinned;
    var i = store.n;
    while (i--) {
      if (!pinned[i]) quadTree.updateBodyForce(i);
    }
  }

  function getTrees(treeLaw) {
    var key = dimensions + '|' + treeLaw.key;
    var trees = treeCache[key];
    if (!trees) {
      trees = treeCache[key] = {
        createQuadTree: generateQuadTreeFunction(dimensions, treeLaw),
        createDualTree: generateDualTreeFunction(dimensions, treeLaw)
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

  // Throws before anything is added when an axis is missing or not a finite number
  function checkPosition(pos) {
    for (var k = 0; k < dimensions; ++k) {
      if (!Number.isFinite(pos[getVariableName(k)])) throw new Error('Expected value is not a finite number at Vector constructor (' + getVariableName(k) + ')');
    }
  }

  function setPosition(index, pos) {
    var offset = index * dimensions;
    for (var k = 0; k < dimensions; ++k) store.pos[offset + k] = pos[getVariableName(k)];
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

// How the CPU runs each kind of stage, for plan()
var CPU_HOW = {
  clear: 'built in', drag: 'built in', springs: 'built in', integrate: 'built in',
  tree: 'tree walk with the law compiled in',
  node: 'generated loop over bodies', link: 'generated loop over links', sum: 'generated loop',
  pair: 'generated loop over grid neighbors', 'pair rules': 'grid neighbors, a call per pair',
  js: 'JavaScript function'
};

function getFormulaStages() {
  if (!formulaStages) formulaStages = require('./formulaStages');
  return formulaStages;
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
