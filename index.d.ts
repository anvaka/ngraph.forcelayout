declare module "ngraph.forcelayout" {
  import { Graph, NodeId, LinkId, Node, Link } from "ngraph.graph";
  import { EventedType } from "ngraph.events";

  /**
   * A stage of a simulator step. `store` holds the numbers of all bodies.
   */
  export type StageFunction = (store: BodyStore, simulator: PhysicsSimulator) => void;

  /**
   * Numbers of bodies in flat typed arrays. Axis `k` of body `i` is `pos[i * D + k]`.
   * Columns added with `define()` are available by their name too.
   */
  export interface BodyStore {
    /** Number of dimensions */
    readonly D: number;
    /** Number of bodies */
    readonly n: number;
    pos: Float64Array;
    velocity: Float64Array;
    force: Float64Array;
    mass: Float64Array;
    pinned: Uint8Array;
    /** Number of springs attached to each body */
    degree: Float64Array;
    /** Spring count and total spring length of the last step (only with an adaptive time step) */
    springCount: Float64Array;
    springLength: Float64Array;
    /**
     * Adds a column with `size` numbers per body. New bodies get `initial`.
     */
    define<T extends TypedArray>(name: string, ArrayType?: { new(length: number): T }, size?: number, initial?: number): T;
    get(name: string): TypedArray | undefined;
    has(name: string): boolean;
    remove(name: string): boolean;
    names(): string[];
    /** Numbers per body of a column (D for pos, velocity and force) */
    sizeOf(name: string): number | undefined;
    /** Kind of numbers of a column: 'f64', 'f32', 'i32', 'u32', 'i16', 'u16', 'i8' or 'u8' */
    typeOf(name: string): string | undefined;
    /**
     * Version of every column: grows when the column changes in a way an engine with its own
     * copy of the numbers should know about (see changed())
     */
    readonly versions: Record<string, number>;
    /** Grows when a column is defined or removed */
    readonly columnsVersion: number;
    /**
     * Marks a column (every column, without a name) as changed. Code that writes a column's array
     * calls it; setters of bodies and springs, define() and graph edits do it themselves.
     */
    changed(name?: string): void;
    [column: string]: any;
  }

  export type TypedArray = Float64Array | Float32Array | Int32Array | Uint32Array | Int16Array | Uint16Array | Int8Array | Uint8Array;

  /**
   * Numbers of springs. Spring `i` connects body rows `from[i]` and `to[i]`; `length[i] < 0` and
   * `coefficient[i] <= 0` mean "use the simulator setting".
   */
  export interface SpringStore {
    readonly n: number;
    from: Int32Array;
    to: Int32Array;
    length: Float64Array;
    coefficient: Float64Array;
    define<T extends TypedArray>(name: string, ArrayType?: { new(length: number): T }, size?: number, initial?: number): T;
    typeOf(name: string): string | undefined;
    readonly versions: Record<string, number>;
    readonly columnsVersion: number;
    changed(name?: string): void;
    [column: string]: any;
  }

  /**
   * What functions that give stages their numbers (params of formulas and laws, radii, `when`)
   * see, the same on every engine. It has no columns or positions: data goes through formulas,
   * sums and host steps.
   */
  export interface StepContext {
    /** The step being computed */
    iteration(): number;
    /** The settings, read only */
    readonly settings: Readonly<PhysicsSettings>;
    /** The spring length, but never 0 */
    unit(): number;
    readonly store: { readonly n: number; readonly D: number };
    springLength(): number;
    springCoefficient(): number;
    gravity(): number;
    theta(): number;
    dragCoefficient(): number;
    timeStep(): number;
    maxVelocity(): number;
    dimensions(): number;
    [setting: string]: any;
  }

  /** A number, a function of the step context read every step */
  export type StepValue = number | ((context: StepContext) => number);

  /**
   * How hard two unit charges push each other at distance `r`, e.g. `'exp(-r / L) / r^2'`.
   */
  export interface RepulsionLawSpec {
    /**
     * F(r): a formula of `r`, the parameters, tables and built in values (`D`, `dt`, `unit`, ...),
     * optionally after named values: `'u = r / L; exp(-u) / r^2'`
     */
    force: string;
    /** Parameter values, or functions of the step context that are read every step */
    params?: Record<string, StepValue>;
    /** Pairs and tree cells farther apart than this are skipped */
    range?: number | string | ((context: StepContext) => number);
    /** Lookup tables the expression can call */
    tables?: Record<string, FormulaTable>;
    /** Extra JS functions the expression can call (they keep the law on the CPU) */
    functions?: Record<string, { value: (x: number) => number; derivative?: (x: number) => number }>;
  }

  /**
   * Samples of a function at evenly spaced points, from `from` to `to`. Formulas read it as
   * `name(x)`: interpolated linearly, and the nearest end value outside.
   */
  export interface FormulaTable {
    from: number;
    to: number;
    values: ArrayLike<number>;
  }

  /**
   * What every formula stage takes. `formula` is a list of statements separated by `;` (see
   * lib/formula.js); `before`, `after` and `replace` place the stage.
   */
  export interface FormulaStageOptions {
    formula: string;
    /** Numbers, or functions of the step context read once per step */
    params?: Record<string, StepValue>;
    tables?: Record<string, FormulaTable>;
    /**
     * The stage runs only on steps where this holds: an expression of `step`, the params and the
     * settings (e.g. 'step - floor(step / 25) * 25 == 0'), or a function of the step context
     */
    when?: string | ((context: StepContext) => boolean);
    before?: string;
    after?: string;
    /** Takes the place of this stage, which comes back when the formula stage is removed */
    replace?: string;
  }

  export interface LinkFormulaOptions extends FormulaStageOptions {
    /**
     * Body columns the formula adds into (`name_i += ...`) that start each pass at 0, so they
     * hold this pass's sum. Other columns keep their value and the formula adds onto it. Never
     * pos, velocity or force.
     */
    startAtZero?: string[];
  }

  export interface PairFormulaOptions extends LinkFormulaOptions {
    /** Pairs closer than this run the formula; 0 or less skips the pass */
    radius: number | string | ((context: StepContext) => number);
    /** false: the formula runs for (i, j) and (j, i), and each run pushes body i only */
    symmetric?: boolean;
  }

  export interface SumOptions extends FormulaStageOptions {
    /** 'nodes' (default) or 'links' */
    over?: 'nodes' | 'links';
    reduce?: 'sum' | 'min' | 'max';
    /** A column of group ids: one result per group 0, 1, 2, ... (negative ids are left out) */
    group?: string;
  }

  export interface SumResult {
    /** 1 number, or D for a sum of vectors */
    width: number;
    grouped: boolean;
    value: Float64Array;
    /** count * width numbers, for sums per group */
    groups: Float64Array;
    count: number;
  }

  export interface RepulsionPassOptions {
    law: string | RepulsionLawSpec | null;
    /** Body column of charges (not negative); the simulator's repulsionCharge by default */
    charge?: string;
    /** Body column of how strongly bodies feel the push; the charge by default */
    sensitivity?: string;
    /**
     * Passes next to each other (and to the stock repulsion) walk one tree. 'own' (default): this
     * charge acts from its own centre in a cell, so it may not be negative; 'shared': from the
     * centre of the walk's first charge, which is faster, and then it may be signed.
     */
    centroid?: 'own' | 'shared';
    when?: string | ((context: StepContext) => boolean);
    before?: string;
    after?: string;
    replace?: string;
  }

  export interface StageOptions {
    before?: string;
    after?: string;
    replace?: string;
    /** The stage runs only on steps where this holds (see FormulaStageOptions.when) */
    when?: string | ((context: StepContext) => boolean);
    /**
     * How a stage written for other engines too (an add-on module's) describes itself in
     * program(): at least a `shape`. Without it the stage is JavaScript, which only the CPU runs.
     */
    describe?: Partial<ProgramStage> & { shape: string } | (() => Partial<ProgramStage> & { shape: string });
    /** The stage's numbers for a step, for stageValues() */
    values?: (context: StepContext) => StageValues;
  }

  export interface HostStepOptions {
    run(simulator: PhysicsSimulator): void;
    /** Columns it reads and changes: body column names, or {space: 'links', column} */
    reads?: (string | { space: 'nodes' | 'links'; column: string })[];
    writes?: (string | { space: 'nodes' | 'links'; column: string })[];
    /** Steps on which it runs; every step without it */
    when?: string | ((context: StepContext) => boolean);
    before?: string;
    after?: string;
  }

  /** A value of a stage: a number, an expression, or a function (which has no body here) */
  export type ValueDescription = { kind: 'number'; value: number } | { kind: 'expression'; text: string } | { kind: 'host' };

  export interface LawDescription {
    force: string;
    params: (ValueDescription & { name: string })[];
    /** Built in values the law reads (dt, unit, ...) */
    builtIns: string[];
    range: ValueDescription | null;
    tables: { name: string; from: number; to: number; values: Float64Array }[];
    /** Names of JS functions (CPU only) */
    functions: string[];
    isDefault: boolean;
    key: string;
  }

  export interface ProgramRead {
    space: 'nodes' | 'links';
    column: string;
    /** 'own': the row the stage works on; 'other': rows of other bodies (link and pair ends, trees) */
    rows?: 'own' | 'other';
    /** Which end of a link or pair ('i' or 'j') */
    end?: 'i' | 'j';
  }

  export interface ProgramWrite {
    space: 'nodes' | 'links';
    column: string;
    /**
     * 'set' (=) replaces, 'add' (+=, -=) adds onto the value at the stage's start, 'scale' (*=,
     * /=) scales the row's own value, 'host' is a host step's
     */
    mode: 'set' | 'add' | 'scale' | 'host';
    op?: string;
    end?: 'i' | 'j';
    /** The column starts the pass at 0 */
    startAtZero?: boolean;
    /** Added along the link or pair, by `pull` or `push` */
    via?: 'pull' | 'push';
  }

  /**
   * A stage of program(), in the order the CPU runs them.
   */
  export interface ProgramStage {
    name: string;
    /** 'node', 'link', 'pair', 'sum', 'tree', 'integrate', 'host', 'js', 'pair rules', or an add-on's */
    shape: string;
    /** 'clear', 'repulsion', 'drag', 'springs' or 'integrate' for the simulator's own stages */
    builtIn: string | null;
    when: ValueDescription | null;
    /** What it loops over: 'nodes', 'links', 'pairs', 'tree', 'none', ... */
    space: string;
    reads: ProgramRead[];
    writes: ProgramWrite[];
    /** The formula (for built in stages: the formula they equal) */
    formula: string | null;
    params: (ValueDescription & { name: string })[];
    builtIns: string[];
    tables: { name: string; from: number; to: number; values: Float64Array }[];
    sums: string[];
    /**
     * Options of the shape: radius, symmetric, startAtZero, channels, integrator, ... Trees also
     * have `walk`: {stages, index, charges, tree}, the stages whose charges one tree walks at once,
     * this stage's place among them, and 'quadtree' or 'dualtree'.
     */
    args: Record<string, any>;
    [detail: string]: any;
  }

  export interface ProgramColumn {
    name: string;
    width: number | 'D';
    type: string;
    /** 'host', 'engine' (built in stages), or 'stage:<name>' (the first stage that writes it) */
    writer: string;
    writers: string[];
    /** Counters of the adaptive time step, which formulas do not see */
    hidden?: boolean;
  }

  /**
   * The step as plain data (see simulator.program()).
   */
  export interface Program {
    /** Grows when the structure of the step changes */
    version: number;
    dims: number;
    spaces: { nodes: number; links: number };
    settings: Record<string, number | string | boolean>;
    columns: { nodes: ProgramColumn[]; links: ProgramColumn[] };
    tables: { stage: string; name: string; from: number; to: number; values: Float64Array }[];
    sums: { name: string; over: 'nodes' | 'links'; group: string | null; reduce: 'sum' | 'min' | 'max'; width: number; when: ValueDescription | null }[];
    stages: ProgramStage[];
    hostSteps: { name: string; when: ValueDescription | null; reads: ProgramRead[]; writes: ProgramWrite[] }[];
    /** Listeners by event: the simulator's ('topology', 'settings') and the layout's ('step') */
    listeners: Record<string, number>;
  }

  /** What stageValues() gives: a stage's numbers for one step */
  export interface StageValues {
    [value: string]: any;
    params?: Record<string, number>;
    radius?: number;
    when: boolean;
    /** Repulsion passes: the compiled law, its `values` set for that step */
    law?: RepulsionLaw;
  }

  /**
   * An engine that can run (some of) a simulator's stages.
   */
  export interface Backend {
    name: string;
    /** Whether the engine runs a stage of program() */
    check(stage: ProgramStage, program: Program, simulator: PhysicsSimulator): { runs: boolean; how?: string; reason?: string; warnings?: string[] };
    /** Problems with the step as a whole */
    checkProgram?(program: Program, simulator: PhysicsSimulator): string[] | { reasons?: string[]; warnings?: string[] };
  }

  export interface Plan {
    backend: string;
    runs: boolean;
    /** One sentence for every problem */
    reasons: string[];
    /** Not refusals: columns that only grow, host steps that run every step, the engine's notes */
    warnings: string[];
    stages: { stage: string; shape: string; runs: boolean; how?: string; reason?: string; cost?: string }[];
  }

  /**
   * A compiled repulsion law.
   */
  export interface RepulsionLaw {
    spec: RepulsionLawSpec;
    isDefault: boolean;
    hasRange: boolean;
    paramNames: string[];
    tableNames: string[];
    values: Record<string, number>;
    /** Reads parameters and range for a step */
    update(context: StepContext): void;
    describe(): LawDescription;
  }

  export interface PairRule {
    /** Pairs closer than this are passed to the rule */
    radius: number | ((context: StepContext) => number);
    /**
     * Returns `s`; the force `s * (pos_i - pos_j)` is added to body `i`, and the opposite one
     * to body `j` (unless the rule is not symmetric). Bodies on the same spot get r = 0, and
     * then the force is `s` along an axis picked from i and j (a non-finite `s` is skipped).
     */
    rule(i: number, j: number, r: number, store: BodyStore): number;
    /** false: the rule is asked for (i, j) and (j, i), and each answer moves the first body only */
    symmetric?: boolean;
  }

  /**
   * Grid of bodies for finding close pairs, in any number of dimensions.
   */
  export interface NeighborGrid {
    /** Every pair closer than `radius` once, with i < j; bodies on the same spot have r = 0 */
    forEachPair(radius: number, callback: (i: number, j: number, r: number) => void): void;
    forEachNeighbor(i: number, radius: number, callback: (j: number, r: number) => void): void;
    cellSize(): number;
  }

  export interface Vector {
    x: number;
    y: number;
    z?: number;
    [coord: `c${number}`]: number
  }

  /**
   * A body's position, force or velocity: reads and writes the simulator's store. Spreading it
   * or `Object.keys()` does not see the axes; `toJSON()` gives a plain copy.
   */
  export interface VectorView extends Vector {
    toJSON(): Vector;
  }

  /**
   * A body is a view of row `index` of the simulator's body store: its `pos`, `force` and
   * `velocity` read and write the store.
   */
  export interface Body {
    /** Row of this body in the store */
    readonly index: number;
    store: BodyStore;
    id?: NodeId;
    /** Number of springs attached to the body */
    readonly degree: number;
    isPinned: boolean;
    pos: VectorView;
    force: VectorView;
    velocity: VectorView;
    mass: number;
    springCount: number;
    springLength: number;
    reset(): void;
    setPosition(x: number, y: number, z?: number, ...c: number[]): void;
  }

  export interface Spring {
    /** Row of this spring in the simulator's spring store (-1 once removed) */
    readonly index: number;
    from: Body;
    to: Body;
    length: number;
    coefficient: number;
  }

  export interface BoundingBox {
    min_x: number;
    max_x: number;
    min_y: number;
    max_y: number;
    min_z?: number;
    max_z?: number;
    [min: `min_c${number}`]: number;
    [max: `max_c${number}`]: number;
  }

  /**
   * Settings for a PhysicsSimulator
   */
  export interface PhysicsSettings {
    /**
     * Ideal length for links (springs in physical model).
     */
    springLength: number;

    /**
     * Hook's law coefficient. 1 - solid spring.
     */
    springCoefficient: number;

    /**
     * Coulomb's law coefficient. It's used to repel nodes thus should be negative
     * if you make it positive nodes start attract each other :).
     */
    gravity: number;

    /**
     * Theta coefficient from Barnes Hut simulation. Ranged between (0, 1).
     * The closer it's to 1 the more nodes algorithm will have to go through.
     * Setting it to one makes Barnes Hut simulation no different from
     * brute-force forces calculation (each node is considered).
     */
    theta: number;

    /**
     * Drag force coefficient. Used to slow down system, thus should be less than 1.
     * The closer it is to 0 the less tight system will be.
     */
    dragCoefficient: number;

    /**
     * Default time step (dt) for forces integration
     */
    timeStep: number;

    /**
     * Adaptive time step uses average spring length to compute actual time step:
     * See: https://twitter.com/anvaka/status/1293067160755957760
     */
    adaptiveTimeStepWeight: number;

    /**
     * Maximum speed of a body. Each step moves a body by at most `timeStep * maxVelocity`.
     * Default is 4 (before v3.4 the limit was fixed at 1).
     */
    maxVelocity: number;

    /**
     * How velocities and positions are updated from forces. `'euler'` (default) is
     * classic integration slowed down by drag. `'fire'` (Fast Inertial Relaxation
     * Engine) ignores `dragCoefficient`, keeps momentum while the system moves "downhill"
     * and stops it when it overshoots.
     */
    integrator: 'euler' | 'fire';

    /**
     * How repulsion between bodies is computed. `'quadtree'` (default) is Barnes-Hut,
     * where each body walks the tree. `'dualtree'` lets pairs of tree cells interact,
     * which is several times faster on large graphs with about the same accuracy.
     */
    nbody: 'quadtree' | 'dualtree';

    /**
     * How hard two unit charges push each other at distance r: an expression like
     * 'exp(-r / L) / r^2', or a law description. Empty means 1/r^2.
     */
    repulsionLaw: string | RepulsionLawSpec | null;

    /**
     * Name of the body column with charges. Masses are used by default.
     */
    repulsionCharge: string;

    /**
     * Name of the body column that forces are divided by when bodies move. 'mass' by default.
     */
    inertia: string;

    /**
     * Name of the body column with how strongly bodies feel the push of others. Empty (the
     * default) means the charge. A body with charge 0 is pushed but pushes nobody.
     */
    repulsionSensitivity: string;

    /**
     * Mass (how slowly a node speeds up) for a node. By default 1 + links / 3.
     */
    nodeMass: (nodeId: NodeId) => number;

    /**
     * Charge (how hard a node pushes others) for a node. By default the mass is used.
     */
    nodeCharge: (nodeId: NodeId) => number;

    /**
     * This parameter defines number of dimensions of the space where simulation
     * is performed.
     */
    dimensions: number;

    /**
     * In debug mode more checks are performed, this will help you catch errors
     * quickly, however for production build it is recommended to turn off this flag
     * to speed up computation.
     */
    debug: boolean;
  }

  /**
   * Manages a simulation of physical forces acting on bodies and springs.
   */
  export interface PhysicsSimulator extends EventedType {
    /**
     * Bodies of this simulator; `bodies[i]` is the body of row `i` while the simulator steps.
     *
     * Note: To add new body, use addBody() method.
     */
    bodies: Body[];

    /**
     * Numbers of all bodies.
     */
    store: BodyStore;

    /**
     * Springs of this simulator.
     *
     * Note: To add new spring, use addSpring() method.
     */
    springs: Spring[];

    /**
     * Numbers of all springs.
     */
    springStore: SpringStore;

    /**
     * Returns settings with which current simulator was initialized
     */
    settings: PhysicsSettings;

    /**
     * Names of the stages of a step, in the order they run. Built in:
     * 'clear', 'repulsion', 'drag', 'springs', 'integrate'.
     */
    stages(): string[];

    /**
     * Adds a stage to every step. By default it runs just before 'integrate'. With `replace` it
     * takes the place of that stage, which comes back when this one is removed.
     */
    addStage(name: string, run: StageFunction, options?: StageOptions): void;

    /**
     * A step that JavaScript runs on the host at its place among the stages. Engines with their
     * own copy of the numbers hand over what it reads and writes.
     */
    addHostStep(name: string, options: HostStepOptions): void;

    /**
     * Replaces a stage, keeping its place. Returns the old function.
     */
    replaceStage(name: string, run: StageFunction): StageFunction;

    /**
     * Removes a stage (formula stages too). Returns true when there was such a stage.
     */
    removeStage(name: string): boolean;

    /**
     * A formula for every body, e.g. 'force += -k * mass * (pos - center)'.
     */
    addNodeFormula(name: string, options: FormulaStageOptions): void;

    /**
     * A formula for every link that sets `pull` from `r`, `length`, `coefficient`, link columns
     * and `name_i` / `name_j` columns of both ends. `replace: 'springs'` replaces the stock
     * springs, which compute 'pull = coefficient * (r - length)'.
     */
    addLinkFormula(name: string, options: LinkFormulaOptions): void;

    /**
     * A formula for every pair of bodies closer than `radius`: it sets `push` from `r` and
     * `name_i` / `name_j` columns, and can add into columns (`stiff_i += ...`).
     */
    addPairFormula(name: string, options: PairFormulaOptions): void;

    /**
     * Adds up a formula over bodies or links, for later formulas to read by name.
     */
    addSum(name: string, options: SumOptions): void;

    /**
     * Results of sums by name.
     */
    sums(): Record<string, SumResult>;

    /**
     * Another repulsion pass with its own law and columns.
     */
    addRepulsion(name: string, options: RepulsionPassOptions): void;

    /**
     * Which stages an engine can run; without a backend, the CPU (which runs all).
     */
    plan(backend?: Backend): Plan;

    /**
     * The step as plain data, built when asked for.
     */
    program(): Program;

    /**
     * What a stage reads in the step of `context` (the current step without one).
     */
    stageValues(name: string, context?: StepContext): StageValues;

    /**
     * The step context of the current step, or of `step`.
     */
    stepContext(step?: number): StepContext;

    /**
     * Gets or sets the body column forces are divided by when bodies move.
     */
    inertia(): string;
    inertia(column: string): PhysicsSimulator;

    /**
     * Drops rows of removed bodies and springs, and fires 'topology' if the graph changed, now.
     */
    applyEdits(): PhysicsSimulator;

    /**
     * Counts listeners of another event source too (the layout's), for program().
     */
    watchListeners(source: EventedType): void;

    /**
     * Returns the function of a stage.
     */
    getStage(name: string): StageFunction | undefined;

    /**
     * Returns the current repulsion law.
     */
    repulsionLaw(): RepulsionLaw;
    /**
     * Sets the repulsion law. `null` restores 1/r^2.
     */
    repulsionLaw(law: string | RepulsionLawSpec | null): PhysicsSimulator;

    /**
     * Gets or sets the name of the body column with charges.
     */
    repulsionCharge(): string;
    repulsionCharge(column: string): PhysicsSimulator;

    /**
     * Gets or sets the name of the body column with how strongly bodies feel the push ('' for
     * the charge).
     */
    repulsionSensitivity(): string;
    repulsionSensitivity(column: string): PhysicsSimulator;

    /**
     * Adds a rule for pairs of bodies closer than its radius. Rules run in the stage
     * 'pairRules', after 'springs'.
     */
    addPairRule(name: string, rule: PairRule): void;

    removePairRule(name: string): boolean;

    /**
     * Grid of the current positions with cells of `cellSize`.
     */
    neighbors(cellSize: number): NeighborGrid;

    /**
     * A length to measure ideas in: the spring length, but never 0.
     */
    unit(): number;

    /**
     * Number of steps performed so far; with `count`, sets it.
     */
    iteration(): number;
    iteration(count: number): PhysicsSimulator;

    /**
     * Performs one step of force simulation.
     *
     * @returns amount of movement during this step.
     */
    step(): number;

    /**
     * Adds body to the system
     * @param body physical body
     * @returns added body
     */
    addBody(body: Body): Body;

    /**
     * Adds body to the system at given position
     * @param pos position of a body
     * @returns added body
     */
    addBodyAt(pos: Vector): Body;

    /**
     * Removes body (and its springs) from the system
     * @param body to remove
     * @returns true if body found and removed. falsy otherwise;
     */
    removeBody(body: Body): boolean;

    /**
     * Adds a spring between two bodies of this simulator
     * @param body1 first body
     * @param body2 second body
     * @param springLength Ideal length for links
     * @param springCoefficient Hook's law coefficient. 1 - solid spring
     * @returns a handle for a spring. If you want to later remove
     * spring pass it to removeSpring() method.
     */
    addSpring(body1: Body, body2: Body, springLength?: number, springCoefficient?: number): Spring;

    /**
     * Returns amount of movement performed on last step() call
     */
    getTotalMovement(): number;

    /**
     * Removes spring from the system
     * @param spring to remove. Spring is an object returned by addSpring
     * @returns true if spring found and removed. falsy otherwise;
     */
    removeSpring(spring: Spring): boolean;

    getBestNewBodyPosition(neighbors: Body[]): Vector;

    /**
     * Returns bounding box which covers all bodies
     */
    getBBox(): BoundingBox;

    /**
     * Returns bounding box which covers all bodies
     */
    getBoundingBox(): BoundingBox;

    /**
     * Changes the gravity for the system
     * @param value Coulomb's law coefficient
     */
    gravity(value: number): number;

    /**
     * Changes the theta coeffitient for the system
     * @param value Theta coefficient from Barnes Hut simulation
     */
    theta(value: number): number;

    // TODO: create types declaration file for ngraph.random
    /**
     * Returns pseudo-random number generator instance
     */
    random: any;
  }

  /**
   * Force based layout for a given graph.
   */
  export interface Layout<T extends Graph> {
    /**
     * Performs one step of iterative layout algorithm
     * @returns true if the system should be considered stable; False otherwise.
     * The system is stable if no further call to `step()` can improve the layout.
     */
    step(): boolean;

    /**
     * For a given `nodeId` returns position
     * @param nodeId node identifier
     */
    getNodePosition(nodeId: NodeId): VectorView;

    /**
     * Sets position of a node to a given coordinates
     * @param nodeId node identifier
     * @param x position of a node
     * @param y position of a node
     * @param z position of node (only if applicable to body)
     */
    setNodePosition(nodeId: NodeId, x: number, y: number, z?: number, ...c: number[]): void;

    /**
     * Gets Link position by link id
     * @param linkId link identifier
     * @returns from: {x, y} coordinates of link start
     * @returns to: {x, y} coordinates of link end
     */
    getLinkPosition(linkId: LinkId): { from: VectorView; to: VectorView };

    /**
     * @returns area required to fit in the graph. Object contains
     * `x1`, `y1` - top left coordinates
     * `x2`, `y2` - bottom right coordinates
     */
    getGraphRect(): { x1: number; y1: number; x2: number; y2: number };

    /**
     * Iterates over each body in the layout simulator and performs a callback(body, nodeId)
     * @param callbackfn the callback function
     */
    forEachBody(callbackfn: (value: Body, key: NodeId, map: Map<NodeId, Body>) => void): void;

    /**
     * Requests layout algorithm to pin/unpin node to its current position
     * Pinned nodes should not be affected by layout algorithm and always
     * remain at their position
     * @param node the node to pin/unpin
     * @param isPinned true to pin, false to unpin
     */
    pinNode(node: Node, isPinned: boolean): void;

    /**
     * Checks whether given graph's node is currently pinned
     * @param node the node to check
     */
    isNodePinned(node: Node): boolean;

    /**
     * Request to release all resources
     */
    dispose(): void;

    /**
     * Gets physical body for a given node id. If node is not found undefined
     * value is returned.
     * @param nodeId node identifier
     */
    getBody(nodeId: NodeId): Body | undefined;

    /**
     * Gets spring for a given edge.
     *
     * @param linkId link identifer.
     */
    getSpring(linkId: LinkId | Link): Spring;

    /**
     * Gets spring for a given edge.
     *
     * @param fromId node identifer - tail of the link
     * @param toId head of the link - head of the link
     */
    getSpring(fromId: NodeId, toId: NodeId): Spring | undefined;

    /**
     * Returns length of cumulative force vector. The closer this to zero - the more stable the system is
     */
    getForceVectorLength(): number;

    /**
     * @readonly Gets current physics simulator
     */
    readonly simulator: PhysicsSimulator;

    /**
     * Gets the graph that was used for layout
     */
    graph: T;

    /**
     * Gets amount of movement performed during last step operation
     */
    lastMove: number;
  }

  /**
   * Creates force based layout for a given graph.
   *
   * @param graph which needs to be laid out
   * @param physicsSettings if you need custom settings
   * for physics simulator you can pass your own settings here. If it's not passed
   * a default one will be created.
   */
  export default function createLayout<T extends Graph>(
    graph: T,
    physicsSettings?: Partial<PhysicsSettings>
  ): Layout<T> & EventedType;
}
