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
    [column: string]: any;
  }

  /**
   * How hard two unit charges push each other at distance `r`, e.g. `'exp(-r / L) / r^2'`.
   */
  export interface RepulsionLawSpec {
    /** F(r), an expression of `r`, `D` (dimensions) and the parameters */
    force: string;
    /** Parameter values, or functions of the simulator that are read every step */
    params?: Record<string, number | ((simulator: PhysicsSimulator) => number)>;
    /** Pairs and tree cells farther apart than this are skipped */
    range?: number | string | ((simulator: PhysicsSimulator) => number);
    /** Extra functions the expression can call */
    functions?: Record<string, { value: (x: number) => number; derivative?: (x: number) => number }>;
  }

  /**
   * A compiled repulsion law.
   */
  export interface RepulsionLaw {
    spec: RepulsionLawSpec;
    isDefault: boolean;
    hasRange: boolean;
    paramNames: string[];
    values: Record<string, number>;
  }

  export interface PairRule {
    /** Pairs closer than this are passed to the rule */
    radius: number | ((simulator: PhysicsSimulator) => number);
    /**
     * Returns `s`; the force `s * (pos_i - pos_j)` is added to body `i`, and the opposite one
     * to body `j` (unless the rule is not symmetric).
     */
    rule(i: number, j: number, r: number, store: BodyStore): number;
    /** false: the rule is asked for (i, j) and (j, i), and each answer moves the first body only */
    symmetric?: boolean;
  }

  /**
   * Grid of bodies for finding close pairs, in any number of dimensions.
   */
  export interface NeighborGrid {
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
  export interface PhysicsSimulator {
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
     * Adds a stage to every step. By default it runs just before 'integrate'.
     */
    addStage(name: string, run: StageFunction, options?: { before?: string; after?: string }): void;

    /**
     * Replaces a stage, keeping its place. Returns the old function.
     */
    replaceStage(name: string, run: StageFunction): StageFunction;

    /**
     * Removes a stage. Returns true when there was such a stage.
     */
    removeStage(name: string): boolean;

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
     * Number of steps performed so far.
     */
    iteration(): number;

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
