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
 * can run the same formula. `program()` describes the whole step as plain data, and `plan()`
 * tells which stages an engine can run.
 *
 * Functions that give a stage its numbers (params of formulas and laws, radii) are called once
 * per step with a step context (see stepContext()), never with the simulator, so that an engine
 * that queues steps can call them for each queued step.
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
// Trees that walk several charges at once, by dimension, laws and centre rules (see walkTree())
var walkTreeCache = {};

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
       * Name of the body column that forces are divided by when bodies move (how slowly they
       * speed up). The mass by default; see `simulator.inertia(name)`.
       */
      inertia: 'mass',

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
  // Grows when the structure of a step changes (see program())
  var structureVersion = 0;
  // FIRE keeps state; it is made again when the inertia column changes
  var fireInertia = null;
  // Listeners of the simulator's events, and of other sources (see watchListeners())
  var listenerCounts = Object.create(null);
  var stepContext = createStepContext(function () { return iterationNumber; });
  // Tree stages next to each other walk one tree (see findWalkGroups()); found again when the
  // structure of a step changes
  var treeMembers = [];
  var walkVersion = -1;

  var stages = [];
  addStage('clear', clearStage, null, describeClear);
  var repulsion = addStage('repulsion', repulsionStage, null, function () {
    return describeTree('repulsion', law, repulsion.tree);
  });
  repulsion.law = function () { return law; };
  repulsion.tree = treeMember('repulsion', repulsionStage, function () { return settings.repulsionCharge; },
    function () { return settings.repulsionSensitivity || settings.repulsionCharge; }, repulsion.law, 'own');
  addStage('drag', dragStage, null, describeDrag);
  addStage('springs', springStage, null, describeSprings);
  addStage('integrate', integrateStage, null, describeIntegrate);

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
     * stage is removed. `options.when` (an expression of `step` and the settings, or a function
     * of the step context) runs it only on the steps where it holds.
     *
     * A stage written for other engines too (an add-on module's) describes itself with
     * `options.describe`: plain data, or a function returning it, with at least a `shape`
     * (see program()). An engine that does not know the shape refuses the stage by name. Without
     * it the stage is JavaScript, which only the CPU runs. `options.values(context)` gives the
     * stage's numbers for a step, as stageValues() returns them ({when, params, ...}).
     */
    addStage: function (name, run, options) {
      var describe = options && options.describe;
      if (describe !== undefined && typeof describe !== 'function') {
        var described = describe;
        describe = function () { return described; };
      }
      var stage = addStage(name, run, options, describe);
      if (options && typeof options.values === 'function') stage.values = options.values;
    },

    /**
     * Replaces the stage `name` with `run`, keeping its place. Returns the old function. The
     * stage is a JS stage for plan() until its first function is put back.
     */
    replaceStage: function (name, run) {
      var stage = getStage(name);
      if (!stage) throw new Error('No stage named ' + name);
      var old = stage.run;
      if (!stage.first) stage.first = { run: old, describe: stage.describe, law: stage.law, values: stage.values };
      var first = run === stage.first.run;
      stage.run = run;
      stage.describe = first ? stage.first.describe : describeJS;
      stage.law = first ? stage.first.law : null;
      stage.values = first ? stage.first.values : null;
      structureVersion += 1;
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
      structureVersion += 1;
      return true;
    },

    /**
     * Adds a step that JavaScript runs on the host, at its place among the stages:
     * `run(simulator)` may read and change any data. `options.reads` and `options.writes` list
     * the columns it reads and changes (names of body columns, or {space: 'links', column}),
     * so that engines with their own copy of the numbers can hand them over; `options.when` (an
     * expression of `step` and the settings, or a function of the step context) says on which
     * steps it runs, every step without it. Place it with `before` or `after` as stages; by
     * default it runs before `integrate`.
     */
    addHostStep: function (name, options) {
      if (!options || typeof options.run !== 'function') throw new Error('Host step ' + name + ' needs a run(simulator) function');
      var hostRun = options.run;
      addStage(name, function () { hostRun(publicApi); }, options, function () {
        return {
          shape: 'host',
          space: 'none',
          reads: (options.reads || []).map(hostColumn),
          writes: (options.writes || []).map(function (column) {
            var entry = hostColumn(column);
            entry.mode = 'host';
            return entry;
          })
        };
      });
    },

    /**
     * Adds a stage that runs `options.formula` for every body (see formulaStages.js). The
     * formula reads and assigns the body's columns by name, e.g. 'force += -k * (pos - center)'.
     * `options.params` are numbers or functions of the step context, read once per step;
     * `options.tables` are lookup tables; `when` gates it; `before`, `after` and `replace`
     * place the stage as in addStage().
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
     * of both bodies (`mass_i`, `mass_j`), and can add into columns (`stiff_i += ...`;
     * `startAtZero: ['stiff']` zeroes them first). By default the stage runs after `springs`.
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
     * repulsionLaw.js), with charges from the body column `options.charge` and sensitivity from
     * `options.sensitivity`. Bodies with sensitivity 0 are skipped.
     *
     * Passes next to each other, and next to the stock repulsion, walk one quad tree with a
     * charge each (under nbody 'dualtree' too), so a pass costs much less than a walk of its own.
     * A pass alone walks its own tree. Charges should not be negative: each acts from its own
     * centre in a tree cell. With `options.centroid: 'shared'` it acts from the centre of the
     * walk's first charge instead, which saves time, and then it may be signed.
     */
    addRepulsion: function (name, options) {
      options = options || {};
      if (options.centroid !== undefined && options.centroid !== 'own' && options.centroid !== 'shared') {
        throw new Error(name + ': unknown centroid ' + options.centroid + '. Expected `own` or `shared`');
      }
      var pass = createRepulsionPass(name, options);
      var stage = addFormulaStage(name, pass, options);
      stage.law = pass.law;
      stage.tree = pass.tree;
    },

    /**
     * The step as plain data, for engines, inspectors and tests. Built when asked for, so a
     * layout that never asks never pays for it:
     *
     *   {version, dims, spaces: {nodes, links}, settings, columns: {nodes: [...], links: [...]},
     *    tables, sums, stages, hostSteps, listeners}
     *
     * `version` grows when the structure changes: stages added, removed or replaced, the law,
     * the inertia, the integrator, the solver, charge columns, the adaptive time step turned on
     * or off, columns defined or removed. Columns are {name, width (a number, or 'D'), type,
     * writer, writers}: the writer is 'engine' when built in stages write the column,
     * 'stage:<name>' for the first other stage that writes it, and 'host' otherwise. Stages come
     * in the order the CPU runs them; each is {name, shape, builtIn, when, space, reads, writes,
     * formula, params, builtIns, tables, sums, args}. Functions appear as {kind: 'host'},
     * without their code: engines get their values from stageValues().
     */
    program: function () {
      return buildProgram();
    },

    /**
     * What stage `name` reads in the step of `context` (the current step without one): its params
     * and radius as numbers, whether its `when` holds, and for repulsion passes the compiled law
     * with its values for that step. Engines that queue steps call it once per queued step.
     */
    stageValues: function (name, context) {
      var stage = getStage(name);
      if (!stage) throw new Error('No stage named ' + name);
      context = context || stepContext;
      var out = stage.values ? stage.values(context) : { when: true };
      if (stage.gate) out.when = !!stage.gate.test(context);
      if (stage.law) {
        var stageLaw = stage.law();
        stageLaw.update(context);
        out.law = stageLaw;
      }
      return out;
    },

    /**
     * The step context: what functions that give stages their numbers see, the same on every
     * engine. `iteration()` (the step being computed), `settings` (read only), a getter for
     * every setting (`springLength()`, `gravity()`, ... `dimensions()`), `unit()`, and `store.n`,
     * `store.D`. It has no columns or positions: data goes through formulas, sums and host
     * steps. With `step`, a context for that step (engines that queue steps call functions with
     * it); without, the one the CPU uses.
     */
    stepContext: function (step) {
      if (step === undefined) return stepContext;
      return createStepContext(function () { return step; });
    },

    /**
     * Tells which stages an engine can run. `backend` describes an engine:
     * {name, check(stage, program, simulator), checkProgram(program, simulator)?}. `check` gets
     * each stage of program() and returns {runs: true, how} or {runs: false, reason}, and may
     * add `warnings`; `checkProgram` returns reasons (a list) or {reasons, warnings} for the step
     * as a whole. Without a backend it describes the CPU, which runs every stage. Returns
     * {backend, runs, reasons, warnings, stages: [{stage, shape, runs, how or reason, cost?}]}.
     * Warnings are not refusals: a column that only grows, a host step that runs every step.
     */
    plan: function (backend) {
      var program = buildProgram();
      var reasons = [], warnings = programWarnings(program);
      if (backend && backend.checkProgram) {
        var whole = backend.checkProgram(program, publicApi) || [];
        if (Array.isArray(whole)) whole = { reasons: whole };
        reasons = reasons.concat(whole.reasons || []);
        warnings = warnings.concat(whole.warnings || []);
      }
      var planned = program.stages.map(function (stage) {
        var verdict = backend ? backend.check(stage, program, publicApi) : { runs: true, how: cpuHow(stage) };
        var entry = { stage: stage.name, shape: stage.shape, runs: verdict.runs };
        if (verdict.runs) entry.how = verdict.how;
        else entry.reason = verdict.reason;
        if (stage.shape === 'host') entry.cost = hostCost(stage, program);
        (verdict.warnings || []).forEach(function (warning) { warnings.push(stage.name + ': ' + warning); });
        return entry;
      });
      planned.forEach(function (entry) { if (!entry.runs) reasons.push(entry.stage + ': ' + entry.reason); });
      return { backend: backend ? backend.name : 'cpu', runs: reasons.length === 0, reasons: reasons, warnings: warnings, stages: planned };
    },

    /**
     * Gets or sets the body column that forces are divided by when bodies move (`settings.inertia`,
     * the mass by default). Charges and other formulas still read the mass.
     */
    inertia: function (name) {
      if (name === undefined) return settings.inertia;
      if (typeof name !== 'string' || !store.has(name)) throw new Error('No body column named ' + name + ' for inertia');
      if (store.sizeOf(name) !== 1) throw new Error('Inertia column ' + name + ' should have one number per body');
      if (name !== settings.inertia) {
        settings.inertia = name;
        structureVersion += 1;
        publicApi.fire('settings', 'inertia', name);
      }
      return publicApi;
    },

    /**
     * Counts the listeners of another event source too (the layout's 'step'), so that program()
     * can list them.
     */
    watchListeners: function (source) {
      countListeners(source);
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
      structureVersion += 1;
      publicApi.fire('settings', 'repulsionLaw', spec);
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
     * before `integrate`, when there is no `springs` stage). They are JavaScript, so only the
     * CPU runs them; pair formulas do the same on every engine.
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
    unit: unit,

    /**
     * Number of steps performed so far. With `count`, sets it (an engine that ran steps
     * elsewhere hands back its count).
     */
    iteration: function (count) {
      if (count === undefined) return iterationNumber;
      if (!(Number.isInteger(count) && count >= 0)) throw new Error('Step count should be a whole number, not ' + count);
      iterationNumber = count;
      return publicApi;
    },

    /**
     * Drops the rows of removed bodies and springs now, and fires 'topology' if bodies or
     * springs were added or removed, rather than at the start of the next step. Code that
     * reads the store between a graph edit and the next step then sees the rows as they will be.
     */
    applyEdits: function () {
      compact();
      if (topologyChanged) {
        topologyChanged = false;
        // every row may have moved
        store.changed();
        springStore.changed();
        publicApi.fire('topology');
      }
      return publicApi;
    },

    /**
     * Performs one step of force simulation.
     *
     * @returns {number} amount of movement during this step.
     */
    step: function () {
      publicApi.applyEdits();
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
  expose(settings, publicApi, settingChanged);

  eventify(publicApi);
  countListeners(publicApi);

  return publicApi;

  function addStage(name, run, options, describe) {
    if (typeof run !== 'function') throw new Error('Stage ' + name + ' needs a function');
    if (getStage(name)) throw new Error('Stage ' + name + ' is already added');
    var stage = {
      name: name, run: run, describe: describe, replaced: null, dispose: null, first: null,
      gate: null, law: null, values: null
    };
    var when = options ? options.when : undefined;
    if (when !== undefined && !(options && options.formulaGate)) {
      // The stage runs only on steps where `when` holds; ungated stages pay nothing for it
      var gate = stage.gate = getFormulaStages().gate(publicApi, name, when, options.params);
      var gated = run;
      stage.run = function (bodyStore, sim) {
        if (gate.test(stepContext)) gated(bodyStore, sim);
      };
    }
    structureVersion += 1;
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
    // Formula stages read `when` with their own params, inside their run
    var placement = options;
    if (options && options.when !== undefined && formulaStage.values) {
      placement = { before: options.before, after: options.after, replace: options.replace, formulaGate: true };
    }
    var stage = addStage(name, formulaStage.run, placement, formulaStage.describe);
    stage.dispose = formulaStage.dispose || null;
    stage.values = formulaStage.values || null;
    return stage;
  }

  function describeJS() {
    return { shape: 'js' };
  }

  // ---------------------------------------------------------------------------------------
  // The step as plain data (program())
  // ---------------------------------------------------------------------------------------

  function describeClear() {
    return {
      shape: 'node', builtIn: 'clear', space: 'nodes',
      reads: [ownRow('pinned')],
      writes: [set('force'), set('springCount'), set('springLength')],
      formula: 'force = pinned != 0 ? force : 0 * force'
    };
  }

  function describeDrag() {
    return {
      shape: 'node', builtIn: 'drag', space: 'nodes',
      reads: [ownRow('pinned'), ownRow('velocity')],
      writes: [add('force')],
      formula: 'force -= pinned == 0 ? dragCoefficient * velocity : 0 * velocity',
      builtIns: ['dragCoefficient'],
      // FIRE removes energy its own way
      args: { skipped: settings.integrator === 'fire' }
    };
  }

  function describeSprings() {
    var counters = settings.adaptiveTimeStepWeight !== 0;
    var writes = [add('force')];
    writes[0].via = 'pull';
    if (counters) writes.push(add('springCount'), add('springLength'));
    return {
      shape: 'link', builtIn: 'springs', space: 'links',
      reads: [otherRows('pos', 'i'), otherRows('pos', 'j'), { space: 'links', column: 'length', rows: 'own' }, { space: 'links', column: 'coefficient', rows: 'own' }],
      writes: writes,
      formula: 'pull = coefficient * (r - length)',
      builtIns: ['springLength', 'springCoefficient'],
      args: { counters: counters }
    };
  }

  function describeIntegrate() {
    var adaptive = settings.adaptiveTimeStepWeight !== 0;
    var reads = [ownRow('pinned'), ownRow('force'), ownRow('velocity'), ownRow('pos'), ownRow(settings.inertia)];
    if (adaptive) reads.push(ownRow('springCount'), ownRow('springLength'));
    return {
      shape: 'integrate', builtIn: 'integrate', space: 'nodes',
      reads: reads,
      writes: [set('velocity'), set('pos')],
      builtIns: ['timeStep', 'maxVelocity'],
      args: {
        integrator: settings.integrator, inertia: settings.inertia, maxVelocity: settings.maxVelocity,
        adaptiveTimeStepWeight: settings.adaptiveTimeStepWeight
      }
    };
  }

  function describeTree(builtIn, treeLaw, member) {
    var charge = member.charge(), sensitivity = member.sensitivity();
    var reads = [otherRows('pos', null), otherRows(charge, null), ownRow(sensitivity), ownRow('pinned')];
    return {
      shape: 'tree', builtIn: builtIn, space: 'tree',
      reads: reads,
      writes: [add('force')],
      builtIns: ['gravity', 'theta'],
      args: {
        channels: [{ law: treeLaw.describe(), charge: charge, sensitivity: sensitivity, centroid: member.centroid }],
        theta: settings.theta, nbody: settings.nbody,
        walk: describeWalk(member)
      }
    };
  }

  // The walk a tree stage's charge is part of: its stages in order, this charge's place among
  // them, and the tree that walks them
  function describeWalk(member) {
    if (walkVersion !== structureVersion) findWalkGroups();
    var group = member.group;
    if (!group) return { stages: [member.name], index: 0, charges: 1, tree: settings.nbody };
    return {
      stages: group.members.map(function (other) { return other.name; }),
      index: group.members.indexOf(member),
      charges: group.members.length,
      tree: 'quadtree'
    };
  }

  function ownRow(column) { return { space: 'nodes', column: column, rows: 'own' }; }
  function otherRows(column, end) {
    var entry = { space: 'nodes', column: column, rows: 'other' };
    if (end) entry.end = end;
    return entry;
  }
  function set(column) { return { space: 'nodes', column: column, mode: 'set' }; }
  function add(column) { return { space: 'nodes', column: column, mode: 'add' }; }

  function hostColumn(column) {
    if (typeof column === 'string') return { space: 'nodes', column: column };
    return { space: column.space || 'nodes', column: column.column };
  }

  function describeStage(stage) {
    var described = stage.describe ? stage.describe() : describeJS();
    var entry = {
      name: stage.name,
      shape: described.shape,
      builtIn: described.builtIn || null,
      when: stage.gate ? stage.gate.describe() : described.when || null,
      space: described.space || (described.shape === 'js' || described.shape === 'pair rules' ? 'none' : described.shape),
      reads: described.reads || [],
      writes: described.writes || [],
      formula: described.formula || null,
      params: described.params || [],
      builtIns: described.builtIns || [],
      tables: described.tables || [],
      sums: described.sums || [],
      args: described.args || {}
    };
    // Add-on stages describe more of their own
    Object.keys(described).forEach(function (key) {
      if (!(key in entry) && key !== 'code') entry[key] = described[key];
    });
    return entry;
  }

  function buildProgram() {
    var described = stages.map(describeStage);
    var program = {
      version: structureVersion + store.columnsVersion + springStore.columnsVersion,
      dims: dimensions,
      spaces: { nodes: bodies.length, links: springs.length },
      settings: {},
      columns: { nodes: describeColumns(store, 'nodes', described), links: describeColumns(springStore, 'links', described) },
      tables: [],
      sums: [],
      stages: described,
      hostSteps: [],
      listeners: {}
    };
    Object.keys(settings).forEach(function (key) {
      var value = settings[key];
      if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') program.settings[key] = value;
    });
    described.forEach(function (stage) {
      stage.tables.forEach(function (table) {
        program.tables.push({ stage: stage.name, name: table.name, from: table.from, to: table.to, values: table.values });
      });
      if (stage.shape === 'sum') {
        program.sums.push({
          name: stage.name, over: stage.args.over, group: stage.args.group, reduce: stage.args.reduce, width: stage.args.width,
          when: stage.when
        });
      }
      if (stage.shape === 'host') program.hostSteps.push({ name: stage.name, when: stage.when, reads: stage.reads, writes: stage.writes });
    });
    Object.keys(listenerCounts).forEach(function (event) {
      if (listenerCounts[event].length) program.listeners[event] = listenerCounts[event].length;
    });
    return program;
  }

  function describeColumns(columnStore, space, described) {
    return columnStore.names().map(function (name) {
      var size = columnStore.sizeOf(name);
      var writers = [], fromStage = null, fromEngine = false;
      described.forEach(function (stage) {
        var writes = stage.writes.some(function (write) { return write.space === space && write.column === name; });
        if (!writes) return;
        writers.push(stage.name);
        if (stage.builtIn) fromEngine = true;
        else if (stage.shape !== 'host' && fromStage === null) fromStage = stage.name;
      });
      var column = {
        name: name,
        width: size === 1 ? 1 : size === dimensions ? 'D' : size,
        type: columnStore.typeOf(name),
        writer: fromEngine ? 'engine' : fromStage !== null ? 'stage:' + fromStage : 'host',
        writers: writers
      };
      // counters of the adaptive time step, which formulas do not see
      if (space === 'nodes' && (name === 'springCount' || name === 'springLength')) column.hidden = true;
      return column;
    });
  }

  // Warnings for any engine: columns that only grow, host steps that run every step
  function programWarnings(program) {
    var warnings = [];
    program.stages.forEach(function (stage, at) {
      if (stage.shape === 'host' && !stage.when) warnings.push(stage.name + ': a host step without `when` runs on the host every step');
      if ((stage.shape !== 'link' && stage.shape !== 'pair') || stage.builtIn || stage.when) return;
      stage.writes.forEach(function (write) {
        if (write.mode !== 'add' || write.startAtZero || write.space !== 'nodes' || write.via) return;
        var reset = program.stages.some(function (other, otherAt) {
          return otherAt !== at && other.writes.some(function (w) {
            return w.space === 'nodes' && w.column === write.column && (w.mode === 'set' || w.mode === 'host' || w.startAtZero);
          });
        });
        var message = write.column + ' only grows: ' + stage.name + ' adds into it every step and nothing sets it; list it in startAtZero';
        if (!reset && warnings.indexOf(message) < 0) warnings.push(message);
      });
    });
    return warnings;
  }

  // What a host step costs an engine with its own copy of the numbers
  function hostCost(stage, program) {
    var numbers = 0, names = [];
    stage.reads.forEach(function (read) {
      var columns = program.columns[read.space] || [];
      for (var i = 0; i < columns.length; ++i) {
        if (columns[i].name !== read.column) continue;
        numbers += columns[i].width === 'D' ? dimensions : columns[i].width;
        names.push(read.column);
      }
    });
    var reads = names.length ? 'reads ' + names.join(', ') + ' (' + numbers + '·n numbers)' : 'reads nothing';
    var writes = stage.writes.length ? 'writes ' + stage.writes.map(function (w) { return w.column; }).join(', ') : 'writes nothing';
    return (stage.when ? 'on the steps where `when` holds: ' : 'every step: ') + reads + ', ' + writes;
  }

  // ---------------------------------------------------------------------------------------
  // Step context, settings and listeners
  // ---------------------------------------------------------------------------------------

  function createStepContext(iteration) {
    var context = { iteration: iteration, settings: settingsView(), unit: unit, store: storeView() };
    Object.keys(settings).forEach(function (key) {
      if (!(key in context)) context[key] = function () { return settings[key]; };
    });
    return Object.freeze(context);
  }

  function settingsView() {
    var view = {};
    Object.keys(settings).forEach(function (key) {
      Object.defineProperty(view, key, { get: function () { return settings[key]; }, enumerable: true });
    });
    return Object.freeze(view);
  }

  function storeView() {
    return Object.freeze({ get n() { return store.n; }, D: dimensions });
  }

  function unit() {
    var length = settings.springLength;
    return length > MIN_UNIT ? length : MIN_UNIT;
  }

  // Setters of settings tell listeners; some settings change the structure of a step
  function settingChanged(key, oldValue, value) {
    var structural = key === 'integrator' || key === 'nbody' || key === 'repulsionCharge' || key === 'repulsionSensitivity' ||
      (key === 'adaptiveTimeStepWeight' && (oldValue === 0) !== (value === 0));
    if (structural) structureVersion += 1;
    publicApi.fire('settings', key, value);
  }

  // Keeps a list of listeners per event next to ngraph.events, which keeps its own private
  function countListeners(source) {
    var on = source.on, off = source.off;
    source.on = function (event, callback, ctx) {
      on(event, callback, ctx);
      if (!listenerCounts[event]) listenerCounts[event] = [];
      listenerCounts[event].push(callback);
      return source;
    };
    source.off = function (event, callback) {
      off(event, callback);
      Object.keys(listenerCounts).forEach(function (name) {
        if (event !== undefined && name !== event) return;
        listenerCounts[name] = typeof callback === 'function' ?
          listenerCounts[name].filter(function (other) { return other !== callback; }) : [];
      });
      return source;
    };
  }

  // A repulsion pass of its own, for addRepulsion()
  function createRepulsionPass(name, options) {
    var passLaw = createRepulsionLaw(options.law);
    var passQuadTree, passDualTree;
    var member = treeMember(name, run, chargeName, sensitivityName, function () { return passLaw; }, options.centroid || 'own');
    return {
      law: member.law,
      tree: member,
      run: run,
      describe: function () {
        return describeTree(null, passLaw, member);
      }
    };

    function run() {
      if (store.n === 0) return;
      if (walkWith(member)) return;
      passLaw.update(stepContext);
      var charge = store[chargeName()];
      if (!charge) throw new Error(name + ': no body column named ' + chargeName() + ' for charges');
      var sensitivity = store[sensitivityName()];
      if (!sensitivity) throw new Error(name + ': no body column named ' + sensitivityName() + ' for sensitivity');
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
    }

    function chargeName() { return options.charge || settings.repulsionCharge; }
    function sensitivityName() { return options.sensitivity || options.charge || settings.repulsionCharge; }
  }

  // ---------------------------------------------------------------------------------------
  // Walk groups: tree stages next to each other walk one tree with a charge each
  // ---------------------------------------------------------------------------------------

  // A tree stage's part in a walk: its name, its own run function, its columns and law
  function treeMember(name, run, charge, sensitivity, lawOf, centroid) {
    var member = { name: name, run: run, charge: charge, sensitivity: sensitivity, law: lawOf, centroid: centroid, group: null };
    treeMembers.push(member);
    return member;
  }

  // Tree stages that run one after another, each with its own function (not replaced, not gated),
  // form a walk group: the stock repulsion and the addRepulsion passes next to it. A group walks
  // one K-charge quad tree, under nbody 'dualtree' too; a stage alone keeps its own tree. The 2D
  // bundle has pre-generated trees of one charge, so there every stage walks alone.
  function findWalkGroups() {
    walkVersion = structureVersion;
    treeMembers.forEach(function (member) { member.group = null; });
    if (generateQuadTreeFunction.preGenerated) return;
    var run = [];
    for (var i = 0; i <= stages.length; ++i) {
      var stage = stages[i];
      var member = stage && stage.tree && stage.run === stage.tree.run && !stage.gate ? stage.tree : null;
      if (member) {
        run.push(member);
        continue;
      }
      if (run.length > 1) {
        var group = { members: run, laws: null, tree: null, charges: [], sensitivities: [] };
        run.forEach(function (other) { other.group = group; });
      }
      run = [];
    }
  }

  // True when the member's charge is walked with its group: now, by the group's first stage, or
  // already in this step
  function walkWith(member) {
    if (walkVersion !== structureVersion) findWalkGroups();
    var group = member.group;
    if (!group) return false;
    if (group.members[0] === member) walkGroup(group);
    return true;
  }

  function walkGroup(group) {
    var members = group.members, K = members.length;
    if (!group.tree) group.tree = walkTree(group);
    var charges = group.charges, sensitivities = group.sensitivities;
    for (var c = 0; c < K; ++c) {
      var member = members[c];
      group.laws[c].update(stepContext);
      var chargeName = member.charge(), sensitivityName = member.sensitivity();
      charges[c] = store[chargeName];
      if (!charges[c]) throw new Error(member.name + ': no body column named ' + chargeName + ' for charges');
      sensitivities[c] = store[sensitivityName];
      if (!sensitivities[c]) throw new Error(member.name + ': no body column named ' + sensitivityName + ' for sensitivity');
    }
    var tree = group.tree;
    tree.options(settings);
    tree.insertBodies(store, charges, sensitivities);
    var pinned = store.pinned;
    var i = store.n;
    while (i--) {
      if (pinned[i]) continue;
      // bodies that feel none of the charges are skipped
      for (c = 0; c < K; ++c) {
        if (sensitivities[c][i] !== 0) {
          tree.updateBodyForce(i);
          break;
        }
      }
    }
  }

  function walkTree(group) {
    var laws = group.laws = group.members.map(function (member) { return member.law(); });
    var centroids = group.members.map(function (member) { return member.centroid; });
    // The code depends on the laws' code, which charges share a law object, and the centre rules
    var key = dimensions + '|' + laws.map(function (treeLaw) { return treeLaw.key + '#' + laws.indexOf(treeLaw); }).join('/') +
      '|' + centroids.join(',');
    var create = walkTreeCache[key] || (walkTreeCache[key] = generateQuadTreeFunction(dimensions, laws, { centroid: centroids }));
    return create(settings, random, laws);
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
    if (walkWith(repulsion.tree)) return;
    law.update(stepContext);
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
    var inertia = settings.inertia;
    if (settings.integrator === 'fire') {
      // A new inertia column starts FIRE again, as an uphill step does
      if (!fireIntegrate || fireInertia !== inertia) {
        fireIntegrate = inertia === 'mass' ? factory.createFireIntegrator() : generateFireIntegratorFunction(dimensions, checkInertia(inertia))();
        fireInertia = inertia;
      }
      integrate = fireIntegrate;
    } else if (inertia !== 'mass') {
      checkInertia(inertia);
      if (!factory.integrateBy) factory.integrateBy = Object.create(null);
      integrate = factory.integrateBy[inertia] || (factory.integrateBy[inertia] = generateIntegratorFunction(dimensions, inertia));
    }
    totalMovement = integrate(store, settings.timeStep, settings.adaptiveTimeStepWeight, settings.maxVelocity);
  }

  function checkInertia(inertia) {
    if (!store[inertia]) throw new Error('No body column named ' + inertia + ' for inertia');
    return inertia;
  }

  function pairRuleStage() {
    var radii = pairRules.map(function (rule) {
      return typeof rule.radius === 'function' ? rule.radius(stepContext) : rule.radius;
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
  'built in': 'built in',
  tree: 'tree walk with the law compiled in',
  node: 'generated loop over bodies', link: 'generated loop over links', sum: 'generated loop',
  pair: 'generated loop over grid neighbors', 'pair rules': 'grid neighbors, a call per pair',
  host: 'JavaScript function, inline', js: 'JavaScript function'
};

// An add-on stage may say how it runs in its description
function cpuHow(stage) {
  var walk = stage.args && stage.args.walk;
  if (walk && walk.charges > 1) {
    return walk.index === 0 ? 'one quad tree walk with ' + walk.charges + ' charges: ' + walk.stages.join(', ') :
      'in the walk of ' + walk.stages[0];
  }
  if (stage.builtIn) return CPU_HOW['built in'];
  if (typeof stage.how === 'string') return stage.how;
  return CPU_HOW[stage.shape] || 'add-on stage (' + stage.shape + ')';
}

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

// Setters call `changed(key, oldValue, value)` after a setting changed
function expose(settings, target, changed) {
  for (var key in settings) {
    augment(settings, target, key, changed);
  }
}

function augment(source, target, key, changed) {
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
        var old = source[key];
        source[key] = value;
        if (old !== value) changed(key, old, value);
        return target;
      }
      return source[key];
    };
  } else {
    target[key] = function (value) {
      if (value !== undefined) {
        var old = source[key];
        source[key] = value;
        if (old !== value) changed(key, old, value);
        return target;
      }
      return source[key];
    };
  }
}
