(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ngraphCreate2dLayout = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	var ngraph_forcelayout = {exports: {}};

	var generateCreateBody;
	var hasRequiredGenerateCreateBody;

	function requireGenerateCreateBody () {
		if (hasRequiredGenerateCreateBody) return generateCreateBody;
		hasRequiredGenerateCreateBody = 1;


		function PositionView(store, offset) {
		  this.store = store;
		  this.offset = offset;
		  // The store's current array; Body.moveTo() updates it when the store grows
		  this.array = store.pos;
		  this.writes = store.writes || null;
		}
		Object.defineProperties(PositionView.prototype, {
		  x: {
		    get: function () { return this.array[this.offset]; },
		    set: function (value) { this.array[this.offset] = value; var writes = this.writes; if (writes !== null) { writes.pos = true; writes.any = true; } },
		    enumerable: true
		  },
		  y: {
		    get: function () { return this.array[this.offset + 1]; },
		    set: function (value) { this.array[this.offset + 1] = value; var writes = this.writes; if (writes !== null) { writes.pos = true; writes.any = true; } },
		    enumerable: true
		  }
		});
		PositionView.prototype.reset = function () {
		  var array = this.array;
		  array[this.offset] = 0; array[this.offset + 1] = 0;
		  var writes = this.writes; if (writes !== null) { writes.pos = true; writes.any = true; }
		};
		PositionView.prototype.toJSON = function () {
		  return { x: this.array[this.offset], y: this.array[this.offset + 1] };
		};
		PositionView.prototype[Symbol.for('nodejs.util.inspect.custom')] = PositionView.prototype.toJSON;

		function ForceView(store, offset) {
		  this.store = store;
		  this.offset = offset;
		  // The store's current array; Body.moveTo() updates it when the store grows
		  this.array = store.force;
		  this.writes = store.writes || null;
		}
		Object.defineProperties(ForceView.prototype, {
		  x: {
		    get: function () { return this.array[this.offset]; },
		    set: function (value) { this.array[this.offset] = value; },
		    enumerable: true
		  },
		  y: {
		    get: function () { return this.array[this.offset + 1]; },
		    set: function (value) { this.array[this.offset + 1] = value; },
		    enumerable: true
		  }
		});
		ForceView.prototype.reset = function () {
		  var array = this.array;
		  array[this.offset] = 0; array[this.offset + 1] = 0;
		};
		ForceView.prototype.toJSON = function () {
		  return { x: this.array[this.offset], y: this.array[this.offset + 1] };
		};
		ForceView.prototype[Symbol.for('nodejs.util.inspect.custom')] = ForceView.prototype.toJSON;

		function VelocityView(store, offset) {
		  this.store = store;
		  this.offset = offset;
		  // The store's current array; Body.moveTo() updates it when the store grows
		  this.array = store.velocity;
		  this.writes = store.writes || null;
		}
		Object.defineProperties(VelocityView.prototype, {
		  x: {
		    get: function () { return this.array[this.offset]; },
		    set: function (value) { this.array[this.offset] = value; var writes = this.writes; if (writes !== null) { writes.velocity = true; writes.any = true; } },
		    enumerable: true
		  },
		  y: {
		    get: function () { return this.array[this.offset + 1]; },
		    set: function (value) { this.array[this.offset + 1] = value; var writes = this.writes; if (writes !== null) { writes.velocity = true; writes.any = true; } },
		    enumerable: true
		  }
		});
		VelocityView.prototype.reset = function () {
		  var array = this.array;
		  array[this.offset] = 0; array[this.offset + 1] = 0;
		  var writes = this.writes; if (writes !== null) { writes.velocity = true; writes.any = true; }
		};
		VelocityView.prototype.toJSON = function () {
		  return { x: this.array[this.offset], y: this.array[this.offset + 1] };
		};
		VelocityView.prototype[Symbol.for('nodejs.util.inspect.custom')] = VelocityView.prototype.toJSON;

		function Body(x, y, store, index) {
		  if (store === undefined) {
		    // Not in a simulator yet: keep the numbers in a store of its own
		    store = createSingleBodyStore(2);
		    index = 0;
		    if (typeof x === 'object') {
		      let v = x;
		      if (!Number.isFinite(v.x)) throw new Error("Expected value is not a finite number at Vector constructor (x)");
		      if (!Number.isFinite(v.y)) throw new Error("Expected value is not a finite number at Vector constructor (y)");
		      store.pos[0] = v.x;
		      store.pos[1] = v.y;
		    } else {
		      store.pos[0] = typeof x === "number" ? x : 0;
		      store.pos[1] = typeof y === "number" ? y : 0;
		    }
		  }
		  this.store = store;
		  this.index = index;
		  // the store's flags for writes from outside the simulator (see initColumnStore.js)
		  this.writes = store.writes || null;
		  this.pos = new PositionView(store, index * 2);
		  this.force = new ForceView(store, index * 2);
		  this.velocity = new VelocityView(store, index * 2);
		}

		/**
		 * Makes a body for slot `index` of `store`, keeping the numbers that are already there.
		 */
		Body.inStore = function (store, index) {
		  return new Body(undefined, undefined, store, index);
		};

		Object.defineProperties(Body.prototype, {
		  mass: {
		    get: function () { return this.store.mass[this.index]; },
		    set: function (value) {
		      this.store.mass[this.index] = value;
		      var writes = this.writes; if (writes !== null) { writes.mass = true; writes.any = true; }
		    },
		    enumerable: true
		  },
		  isPinned: {
		    get: function () { return this.store.pinned[this.index] === 1; },
		    set: function (value) {
		      this.store.pinned[this.index] = value ? 1 : 0;
		      var writes = this.writes; if (writes !== null) { writes.pinned = true; writes.any = true; }
		    },
		    enumerable: true
		  },
		  springCount: {
		    get: function () { return this.store.springCount[this.index]; },
		    set: function (value) { this.store.springCount[this.index] = value; },
		    enumerable: true
		  },
		  springLength: {
		    get: function () { return this.store.springLength[this.index]; },
		    set: function (value) { this.store.springLength[this.index] = value; },
		    enumerable: true
		  },
		  degree: {
		    get: function () { return this.store.degree[this.index]; },
		    enumerable: true
		  }
		});

		/**
		 * Points this body (and its vectors) to slot `index` of `store`. The numbers are not copied.
		 */
		Body.prototype.moveTo = function (store, index) {
		  var offset = index * 2;
		  this.store = store;
		  this.index = index;
		  this.writes = this.pos.writes = this.force.writes = this.velocity.writes = store.writes || null;
		  this.pos.store = this.force.store = this.velocity.store = store;
		  this.pos.offset = this.force.offset = this.velocity.offset = offset;
		  this.pos.array = store.pos;
		  this.force.array = store.force;
		  this.velocity.array = store.velocity;
		};

		Body.prototype.reset = function() {
		  var force = this.store.force, offset = this.index * 2;
		  force[offset] = 0; force[offset + 1] = 0;
		  this.store.springCount[this.index] = 0;
		  this.store.springLength[this.index] = 0;
		};

		Body.prototype.setPosition = function (x, y) {
		  var pos = this.store.pos, offset = this.index * 2;
		  pos[offset] = x || 0;
		  pos[offset + 1] = y || 0;
		  var writes = this.writes; if (writes !== null) { writes.pos = true; writes.any = true; }
		};

		Body.prototype.toJSON = function () {
		  return {
		    isPinned: this.isPinned,
		    pos: this.pos.toJSON(),
		    force: this.force.toJSON(),
		    velocity: this.velocity.toJSON(),
		    mass: this.mass,
		    springCount: this.springCount,
		    springLength: this.springLength
		  };
		};
		// console.log() in node shows the numbers, not the store behind them
		Body.prototype[Symbol.for('nodejs.util.inspect.custom')] = Body.prototype.toJSON;
		generateCreateBody = function() { return Body; };
		return generateCreateBody;
	}

	var generateQuadTree = {exports: {}};

	var hasRequiredGenerateQuadTree;

	function requireGenerateQuadTree () {
		if (hasRequiredGenerateQuadTree) return generateQuadTree.exports;
		hasRequiredGenerateQuadTree = 1;
		/**
		 * Our implementation of QuadTree is non-recursive to avoid GC hit
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
		            // we are trying to avoid memory pressure: create new element
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
		    this.body = body; // index of the body which needs to be inserted to node
		}


		function QuadNode() {
		  // index of the body stored inside this node, or -1. In quad tree only leaf nodes
		  // (by construction) contain bodies:
		  this.body = -1;

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
		  this.mass_x = 0;
		  this.mass_y = 0;

		  // bounding box coordinates
		  this.min_x = 0;
		  this.min_y = 0;
		  this.max_x = 0;
		  this.max_y = 0;
		}


		  function isSamePosition(pos, body1, body2) {
		    var offset1 = body1 * 2, offset2 = body2 * 2;
		    var dx = Math.abs(pos[offset1] - pos[offset2]);
		    var dy = Math.abs(pos[offset1 + 1] - pos[offset2 + 1]);
		  
		    return dx < 1e-8 && dy < 1e-8;
		  }  

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
		generateQuadTree.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function createQuadTree(options, random, law) {
		  options = options || {};
		  // Values of the law's parameters, refreshed by the simulator every step:
		  law ? law.values : null;
		  law ? law.functions : null;
		  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
		  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

		  var gravity = options.gravity;
		  var updateQueue = [];
		  var insertStack = new InsertStack();
		  var theta = options.theta;

		  var nodesCache = [];
		  var currentInCache = 0;
		  var root = newNode();

		  // Arrays of the store from the last insertBodies() call (`sensitivity`: how strongly
		  // bodies feel the push):
		  var pos, mass, sensitivity, force;

		  return {
		    insertBodies: insertBodies,

		    /**
		     * Gets root node if it is present
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
		      node.body = -1;
		      node.mass = node.mass_x = node.mass_y = 0;
		      node.min_x = node.max_x = node.min_y = node.max_y = 0;
		    } else {
		      node = new QuadNode();
		      nodesCache[currentInCache] = node;
		    }

		    ++currentInCache;
		    return node;
		  }

		  function update(sourceBody) {
		    var queue = updateQueue;
		    var v;
		    var dx;
		    var dy;
		    var r; 
		    var fx = 0;
		    var fy = 0;
		    var queueLength = 1;
		    var shiftIdx = 0;
		    var pushIdx = 1;
		    var sourceOffset = sourceBody * 2;
		    var sx = pos[sourceOffset];
		    var sy = pos[sourceOffset + 1];
		    var sourceMass = sensitivity[sourceBody];
		    

		    queue[0] = root;

		    while (queueLength) {
		      var node = queue[shiftIdx];
		      var body = node.body;

		      queueLength -= 1;
		      shiftIdx += 1;
		      var differentBody = (body !== sourceBody);
		      if (body >= 0 && differentBody) {
		        // If the current node is a leaf node (and it is not source body),
		        // calculate the force exerted by the current node on body, and add this
		        // amount to body's net force.
		        var bodyOffset = body * 2;
		        dx = pos[bodyOffset] - sx;
		        dy = pos[bodyOffset + 1] - sy;
		        r = Math.sqrt(dx * dx + dy * dy);

		        if (r === 0) {
		          // Poor man's protection against zero distance.
		          dx = (random.nextDouble() - 0.5) / 50;
		          dy = (random.nextDouble() - 0.5) / 50;
		          r = Math.sqrt(dx * dx + dy * dy);
		        }

		        
		        // This is standard gravitation force calculation but we divide
		        // by r^3 to save two operations when normalizing force vector.
		        v = gravity * mass[body] * sourceMass / (r * r * r);
		        fx += v * dx;
		        fy += v * dy;
		      } else if (differentBody) {
		        // Otherwise, calculate the ratio s / r,  where s is the width of the region
		        // represented by the internal node, and r is the distance between the body
		        // and the node's center-of-mass
		        dx = node.mass_x / node.mass - sx;
		        dy = node.mass_y / node.mass - sy;
		        r = Math.sqrt(dx * dx + dy * dy);

		        if (r === 0) {
		          // Sorry about code duplication. I don't want to create many functions
		          // right away. Just want to see performance first.
		          dx = (random.nextDouble() - 0.5) / 50;
		          dy = (random.nextDouble() - 0.5) / 50;
		          r = Math.sqrt(dx * dx + dy * dy);
		        }
		        // If s / r < θ, treat this internal node as a single body, and calculate the
		        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
		        if ((node.max_x - node.min_x) / r < theta) {
		          // in the if statement above we consider node's width only
		          // because the region was made into square during tree creation.
		          // Thus there is no difference between using width or height.
		          v = gravity * node.mass * sourceMass / (r * r * r);
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

		    force[sourceOffset] += fx;
		    force[sourceOffset + 1] += fy;
		  }

		  // `charge` is the column of charges (masses by default), `bodySensitivity` how strongly
		  // bodies feel the push (the charges by default). Bodies without charge push nobody, so they
		  // are left out of the tree.
		  function insertBodies(store, charge, bodySensitivity) {
		    pos = store.pos;
		    mass = charge || store.mass;
		    sensitivity = bodySensitivity || mass;
		    force = store.force;
		    var xmin = Number.MAX_VALUE;
		    var ymin = Number.MAX_VALUE;
		    var xmax = -Number.MAX_VALUE;
		    var ymax = -Number.MAX_VALUE;
		    var i = store.n;

		    // To reduce quad tree depth we are looking for exact bounding box of all particles.
		    while (i--) {
		      if (mass[i] === 0) continue;
		      var offset = i * 2;
		      var x = pos[offset];
		      var y = pos[offset + 1];
		      if (x < xmin) xmin = x;
		      if (y < ymin) ymin = y;
		      if (x > xmax) xmax = x;
		      if (y > ymax) ymax = y;
		    }

		    // Makes the bounds square.
		    var maxSideLength = -Infinity;
		    if (xmax - xmin > maxSideLength) maxSideLength = xmax - xmin ;
		    if (ymax - ymin > maxSideLength) maxSideLength = ymax - ymin ;

		    currentInCache = 0;
		    root = newNode();
		    root.min_x = xmin;
		    root.min_y = ymin;
		    root.max_x = xmin + maxSideLength;
		    root.max_y = ymin + maxSideLength;

		    i = store.n;
		    var rootTaken = false;
		    while (i--) {
		      if (mass[i] === 0) continue;
		      if (rootTaken) {
		        insert(i);
		      } else {
		        root.body = i;
		        rootTaken = true;
		      }
		    }
		  }

		  function insert(newBody) {
		    insertStack.reset();
		    insertStack.push(root, newBody);

		    while (!insertStack.isEmpty()) {
		      var stackItem = insertStack.pop();
		      var node = stackItem.node;
		      var body = stackItem.body;

		      if (node.body < 0) {
		        // This is internal node. Update the total mass of the node and center-of-mass.
		        var bodyOffset = body * 2;
		        var x = pos[bodyOffset];
		        var y = pos[bodyOffset + 1];
		        var bodyMass = mass[body];
		        node.mass += bodyMass;
		        node.mass_x += bodyMass * x;
		        node.mass_y += bodyMass * y;

		        // Recursively insert the body in the appropriate quadrant.
		        // But first find the appropriate quadrant.
		        var quadIdx = 0; // Assume we are in the 0's quad.
		        var min_x = node.min_x;
		        var min_y = node.min_y;
		        var max_x = (min_x + node.max_x) / 2;
		        var max_y = (min_y + node.max_y) / 2;

		        if (x > max_x) {
		          quadIdx = quadIdx + 1;
		          min_x = max_x;
		          max_x = node.max_x;
		        }
		        if (y > max_y) {
		          quadIdx = quadIdx + 2;
		          min_y = max_y;
		          max_y = node.max_y;
		        }

		        var child = getChild(node, quadIdx);

		        if (!child) {
		          // The node is internal but this quadrant is not taken. Add
		          // subnode to it.
		          child = newNode();
		          child.min_x = min_x;
		          child.min_y = min_y;
		          child.max_x = max_x;
		          child.max_y = max_y;
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
		        node.body = -1; // internal nodes do not cary bodies

		        if (isSamePosition(pos, oldBody, body)) {
		          // Prevent infinite subdivision by bumping one node
		          // anywhere in this quadrant
		          var retriesCount = 3;
		          do {
		            var offset = random.nextDouble();
		            var dx = (node.max_x - node.min_x) * offset;
		            var dy = (node.max_y - node.min_y) * offset;

		            pos[oldBody * 2] = node.min_x + dx;
		            pos[oldBody * 2 + 1] = node.min_y + dy;
		            retriesCount -= 1;
		            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
		          } while (retriesCount > 0 && isSamePosition(pos, oldBody, body));

		          if (retriesCount === 0 && isSamePosition(pos, oldBody, body)) {
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
		};
		generateQuadTree.exports.preGenerated = true;
		return generateQuadTree.exports;
	}

	var generateBounds = {exports: {}};

	var hasRequiredGenerateBounds;

	function requireGenerateBounds () {
		if (hasRequiredGenerateBounds) return generateBounds.exports;
		hasRequiredGenerateBounds = 1;
		generateBounds.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function anonymous(store,settings,random
		) {

		  var boundingBox = {
		    min_x: 0, max_x: 0,
		    min_y: 0, max_y: 0,
		  };

		  return {
		    box: boundingBox,

		    update: updateBoundingBox,

		    reset: resetBoundingBox,

		    getBestNewPosition: function (neighbors) {
		      var base_x = 0, base_y = 0;

		      if (neighbors.length) {
		        var pos = store.pos;
		        for (var i = 0; i < neighbors.length; ++i) {
		          var offset = neighbors[i].index * 2;
		          base_x += pos[offset];
		          base_y += pos[offset + 1];
		        }

		        base_x /= neighbors.length;
		        base_y /= neighbors.length;
		      } else {
		        base_x = (boundingBox.min_x + boundingBox.max_x) / 2;
		        base_y = (boundingBox.min_y + boundingBox.max_y) / 2;
		      }

		      var springLength = settings.springLength;
		      return {
		        x: base_x + (random.nextDouble() - 0.5) * springLength,
		        y: base_y + (random.nextDouble() - 0.5) * springLength,
		      };
		    }
		  };

		  function updateBoundingBox() {
		    var i = store.n;
		    if (i === 0) return; // No bodies - no borders.
		    var pos = store.pos;

		    var max_x = -Infinity;
		    var max_y = -Infinity;
		    var min_x = Infinity;
		    var min_y = Infinity;

		    while(i--) {
		      // this is O(n), it could be done faster with quadtree, if we check the root node bounds
		      var offset = i * 2;
		      var x = pos[offset];
		      var y = pos[offset + 1];
		      if (x < min_x) min_x = x;
		      if (y < min_y) min_y = y;
		      if (x > max_x) max_x = x;
		      if (y > max_y) max_y = y;
		    }

		    boundingBox.min_x = min_x;
		    boundingBox.min_y = min_y;
		    boundingBox.max_x = max_x;
		    boundingBox.max_y = max_y;
		  }

		  function resetBoundingBox() {
		    boundingBox.min_x = boundingBox.max_x = 0;
		    boundingBox.min_y = boundingBox.max_y = 0;
		  }

		};
		};
		generateBounds.exports.preGenerated = true;
		return generateBounds.exports;
	}

	var generateCreateDragForce = {exports: {}};

	var hasRequiredGenerateCreateDragForce;

	function requireGenerateCreateDragForce () {
		if (hasRequiredGenerateCreateDragForce) return generateCreateDragForce.exports;
		hasRequiredGenerateCreateDragForce = 1;
		generateCreateDragForce.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function anonymous(options
		) {

		  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

		  return {
		    /**
		     * Slows down every body of the store that is not pinned.
		     */
		    update: function(store) {
		      var force = store.force, velocity = store.velocity, pinned = store.pinned;
		      var dragCoefficient = options.dragCoefficient;
		      for (var i = 0, n = store.n; i < n; ++i) {
		        if (pinned[i]) continue;
		        var offset = i * 2;
		        force[offset] -= dragCoefficient * velocity[offset];
		        force[offset + 1] -= dragCoefficient * velocity[offset + 1];
		      }
		    }
		  };

		};
		};
		generateCreateDragForce.exports.preGenerated = true;
		return generateCreateDragForce.exports;
	}

	var generateCreateSpringForce = {exports: {}};

	var hasRequiredGenerateCreateSpringForce;

	function requireGenerateCreateSpringForce () {
		if (hasRequiredGenerateCreateSpringForce) return generateCreateSpringForce.exports;
		hasRequiredGenerateCreateSpringForce = 1;
		generateCreateSpringForce.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function anonymous(options,random
		) {

		  if (!Number.isFinite(options.springCoefficient)) throw new Error('Spring coefficient is not a number');
		  if (!Number.isFinite(options.springLength)) throw new Error('Spring length is not a number');

		  return {
		    /**
		     * Updates forces of all springs in `springs` (a spring store), last spring first.
		     * Spring ends are bodies of `store`. With `withStats` it also counts springs and sums
		     * their lengths per body (`store.springCount`, `store.springLength`), which the adaptive
		     * time step needs.
		     */
		    update: function (springs, store, withStats) {
		      var i = springs.n;
		      var update = withStats ? updateWithStatsUntilZeroLength : updateUntilZeroLength;
		      while ((i = update(springs, store, i)) >= 0) {
		        updateZeroLength(springs, store, i, withStats);
		      }
		    }
		  };

		  // These update springs i - 1, i - 2, ... 0 and return -1, or stop at the first spring whose
		  // ends are at the same point and return its index. The loop has no function calls, which
		  // lets it keep the arrays in registers.

		  function updateUntilZeroLength(springs, store, i) {
		    var from = springs.from, to = springs.to, restLength = springs.length, springCoefficient = springs.coefficient;
		    var pos = store.pos, force = store.force;
		    store.springCount; store.springLength;
		    while (i--) {
		      var body1 = from[i];
		      var body2 = to[i];
		      var offset1 = body1 * 2;
		      var offset2 = body2 * 2;
		      var length = restLength[i] < 0 ? options.springLength : restLength[i];
		      var dx = pos[offset2] - pos[offset1];
		      var dy = pos[offset2 + 1] - pos[offset1 + 1];
		      var r = Math.sqrt(dx * dx + dy * dy);
		      if (r === 0) return i;

		      var d = r - length;
		      var coefficient = ((springCoefficient[i] > 0) ? springCoefficient[i] : options.springCoefficient) * d / r;

		      force[offset1] += coefficient * dx;
		      force[offset1 + 1] += coefficient * dy;
		      force[offset2] -= coefficient * dx;
		      force[offset2 + 1] -= coefficient * dy;
		    }
		    return -1;
		  }

		  function updateWithStatsUntilZeroLength(springs, store, i) {
		    var from = springs.from, to = springs.to, restLength = springs.length, springCoefficient = springs.coefficient;
		    var pos = store.pos, force = store.force;
		    var springCount = store.springCount, springLength = store.springLength;
		    while (i--) {
		      var body1 = from[i];
		      var body2 = to[i];
		      var offset1 = body1 * 2;
		      var offset2 = body2 * 2;
		      var length = restLength[i] < 0 ? options.springLength : restLength[i];
		      var dx = pos[offset2] - pos[offset1];
		      var dy = pos[offset2 + 1] - pos[offset1 + 1];
		      var r = Math.sqrt(dx * dx + dy * dy);
		      if (r === 0) return i;

		      var d = r - length;
		      var coefficient = ((springCoefficient[i] > 0) ? springCoefficient[i] : options.springCoefficient) * d / r;

		      force[offset1] += coefficient * dx;
		      force[offset1 + 1] += coefficient * dy;
		      force[offset2] -= coefficient * dx;
		      force[offset2 + 1] -= coefficient * dy;
		      springCount[body1] += 1;
		      springLength[body1] += r;
		      springCount[body2] += 1;
		      springLength[body2] += r;
		    }
		    return -1;
		  }

		  // Ends at the same point: push them apart in a random direction.
		  function updateZeroLength(springs, store, i, withStats) {
		    var from = springs.from, to = springs.to, restLength = springs.length, springCoefficient = springs.coefficient;
		    store.pos; var force = store.force;
		    var springCount = store.springCount, springLength = store.springLength;
		    var body1 = from[i];
		    var body2 = to[i];
		    var offset1 = body1 * 2;
		    var offset2 = body2 * 2;
		    var length = restLength[i] < 0 ? options.springLength : restLength[i];
		    var dx = (random.nextDouble() - 0.5) / 50;
		    var dy = (random.nextDouble() - 0.5) / 50;
		    var r = Math.sqrt(dx * dx + dy * dy);

		    var d = r - length;
		    var coefficient = ((springCoefficient[i] > 0) ? springCoefficient[i] : options.springCoefficient) * d / r;

		    force[offset1] += coefficient * dx;
		    force[offset1 + 1] += coefficient * dy;
		    force[offset2] -= coefficient * dx;
		    force[offset2 + 1] -= coefficient * dy;
		    if (withStats) {
		      springCount[body1] += 1;
		      springLength[body1] += r;
		      springCount[body2] += 1;
		      springLength[body2] += r;
		    }
		  }

		};
		};
		generateCreateSpringForce.exports.preGenerated = true;
		return generateCreateSpringForce.exports;
	}

	var generateIntegrator = {exports: {}};

	var hasRequiredGenerateIntegrator;

	function requireGenerateIntegrator () {
		if (hasRequiredGenerateIntegrator) return generateIntegrator.exports;
		hasRequiredGenerateIntegrator = 1;
		generateIntegrator.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function anonymous(store,timeStep,adaptiveTimeStepWeight,maxVelocity
		) {

		  var length = store.n;
		  if (length === 0) return 0;
		  var pos = store.pos, velocity = store.velocity, force = store.force, mass = store.mass;
		  var pinned = store.pinned, springCount = store.springCount, springLength = store.springLength;

		  var dx = 0, tx = 0;
		  var dy = 0, ty = 0;
		  var maxV = maxVelocity > 0 ? maxVelocity : 1;

		  for (var i = 0; i < length; ++i) {
		    if (pinned[i]) continue;

		    var dt = timeStep;
		    if (adaptiveTimeStepWeight && springCount[i]) {
		      dt = (adaptiveTimeStepWeight * springLength[i]/springCount[i]);
		    }

		    var coeff = dt / mass[i];
		    var offset = i * 2;

		    velocity[offset] += coeff * force[offset];
		    velocity[offset + 1] += coeff * force[offset + 1];
		    var vx = velocity[offset];
		    var vy = velocity[offset + 1];
		    var v = Math.sqrt(vx * vx + vy * vy);

		    if (v > maxV) {
		      // We normalize it so that we move within timeStep range.
		      // for the case when v <= maxV - we let velocity to fade out.
		      velocity[offset] = maxV * vx / v;
		      velocity[offset + 1] = maxV * vy / v;
		    }

		    dx = dt * velocity[offset];
		    dy = dt * velocity[offset + 1];

		    pos[offset] += dx;
		    pos[offset + 1] += dy;

		    tx += Math.abs(dx);
		    ty += Math.abs(dy);
		  }

		  return (tx * tx + ty * ty)/length;

		};
		};
		generateIntegrator.exports.preGenerated = true;
		return generateIntegrator.exports;
	}

	var generateClearForces = {exports: {}};

	var hasRequiredGenerateClearForces;

	function requireGenerateClearForces () {
		if (hasRequiredGenerateClearForces) return generateClearForces.exports;
		hasRequiredGenerateClearForces = 1;
		generateClearForces.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function anonymous(store
		) {

		  var force = store.force, pinned = store.pinned;
		  var springCount = store.springCount, springLength = store.springLength;
		  for (var i = 0, n = store.n; i < n; ++i) {
		    if (pinned[i]) continue;
		    var offset = i * 2;
		    force[offset] = 0; force[offset + 1] = 0;
		    springCount[i] = 0;
		    springLength[i] = 0;
		  }

		};
		};
		generateClearForces.exports.preGenerated = true;
		return generateClearForces.exports;
	}

	var createBodyStore = {exports: {}};

	var initColumnStore_1;
	var hasRequiredInitColumnStore;

	function requireInitColumnStore () {
		if (hasRequiredInitColumnStore) return initColumnStore_1;
		hasRequiredInitColumnStore = 1;
		initColumnStore_1 = initColumnStore;

		function Versions() {}
		Versions.prototype = Object.create(null);

		// Columns that setters of bodies and springs write. A setter raises its column's flag on this
		// object, which has the same shape in every store, so setters stay as fast with many layouts in
		// one process as with one; reading `versions` turns raised flags into new versions.
		function HostWrites() {
		  this.any = false;
		  this.pos = false;
		  this.velocity = false;
		  this.mass = false;
		  this.pinned = false;
		  this.length = false;
		  this.coefficient = false;
		}
		var SETTER_COLUMNS = ['pos', 'velocity', 'mass', 'pinned', 'length', 'coefficient'];

		// Where a store keeps its versions. Every store reads them through the same getter, so that
		// stores keep one shape however many there are: code that all layouts share reads them
		var VERSIONS = typeof Symbol === 'function' ? Symbol('versions') : '$versions';

		// `store.versions`: columns that setters wrote since the last read get new versions first
		function readVersions() {
		  var writes = this.writes, versions = this[VERSIONS];
		  if (!writes.any) return versions;
		  writes.any = false;
		  for (var i = 0; i < SETTER_COLUMNS.length; ++i) {
		    var name = SETTER_COLUMNS[i];
		    if (!writes[name]) continue;
		    writes[name] = false;
		    versions[name] = ++this.versionClock;
		  }
		  return versions;
		}

		var TYPE_NAMES = {
		  Float64Array: 'f64', Float32Array: 'f32', Int32Array: 'i32', Uint32Array: 'u32',
		  Int16Array: 'i16', Uint16Array: 'u16', Int8Array: 'i8', Uint8Array: 'u8', Uint8ClampedArray: 'u8'
		};

		/**
		 * Turns `store` into a table of numbers kept in flat typed arrays, one array per column.
		 * Row `i` of a column with `size` numbers per row is `array[i * size + k]`, `k < size`.
		 * Rows keep the order they were added in; removing one shifts the later rows down, so the
		 * order (and every result computed from it) never depends on what was removed.
		 *
		 * `store` is expected to declare the fields below (and its built in columns) up front, so
		 * that its shape stays fixed.
		 *
		 * Every column has a version, `store.versions[name]`: a number that grows whenever the column
		 * changes in a way an engine with its own copy of the numbers should know about. Writes to the
		 * arrays cannot be seen, so code that writes a column calls `store.changed(name)`; defining the
		 * column, setters of bodies and springs, and graph edits do it themselves. `columnsVersion`
		 * grows when a column is defined or removed.
		 */
		function initColumnStore(store, capacity) {
		  var columns = [];
		  // Columns whose initial value is not 0: a row never used before needs only these filled
		  var withInitial = [];
		  // Rows past this one still hold zeros from the allocation
		  var highestUsed = 0;
		  var builtInCount = 0;

		  store.n = 0;
		  store.capacity = 0;
		  store.add = add;
		  store.removeRows = removeRows;
		  store.define = define;
		  store.has = has;
		  store.get = get;
		  store.remove = removeColumn;
		  store.names = names;
		  store.sizeOf = sizeOf;
		  store.copyTo = copyTo;
		  store.typeOf = typeOf;
		  // Versions of all columns come from one clock, so a column defined again never gets back an
		  // old one. `versions` has no prototype chain and stays in fast mode (columns are never deleted
		  // from it)
		  var versions = store[VERSIONS] = new Versions();
		  store.writes = new HostWrites();
		  store.versionClock = 0;
		  Object.defineProperty(store, 'versions', { get: readVersions, enumerable: true });
		  store.columnsVersion = 0;
		  store.changed = changed;
		  store.lockBuiltIns = function () { builtInCount = columns.length; };
		  store.reserve = function (size) { if (size > store.capacity) resize(size); };
		  // Called after the arrays were replaced by bigger ones:
		  store.onResize = null;

		  if (capacity) resize(capacity);
		  return store;

		  /**
		   * Adds a column with `size` numbers per row (1 by default). New rows get `initial` (0 by
		   * default) in every slot.
		   */
		  function define(name, ArrayType, size, initial) {
		    if (has(name)) throw new Error('Column ' + name + ' is already defined');
		    var column = {
		      name: name,
		      ArrayType: ArrayType || Float64Array,
		      size: size || 1,
		      initial: initial || 0,
		      array: null
		    };
		    column.array = new column.ArrayType(store.capacity * column.size);
		    if (column.initial) column.array.fill(column.initial);
		    columns.push(column);
		    if (column.initial !== 0) withInitial.push(column);
		    store[name] = column.array;
		    store.columnsVersion += 1;
		    changed(name);
		    return column.array;
		  }

		  /**
		   * Marks column `name` as changed (every column, without a name).
		   */
		  function changed(name) {
		    if (name !== undefined) {
		      versions[name] = ++store.versionClock;
		      return;
		    }
		    for (var i = 0; i < columns.length; ++i) versions[columns[i].name] = ++store.versionClock;
		  }


		  function has(name) {
		    return columns.some(function (c) { return c.name === name; });
		  }

		  function get(name) {
		    for (var i = 0; i < columns.length; ++i) if (columns[i].name === name) return columns[i].array;
		  }

		  function removeColumn(name) {
		    for (var i = builtInCount; i < columns.length; ++i) {
		      if (columns[i].name === name) {
		        var at = withInitial.indexOf(columns[i]);
		        if (at >= 0) withInitial.splice(at, 1);
		        columns.splice(i, 1);
		        store[name] = undefined;
		        changed(name);
		        store.columnsVersion += 1;
		        return true;
		      }
		    }
		    return false;
		  }

		  function names() {
		    return columns.map(function (c) { return c.name; });
		  }

		  /**
		   * Kind of numbers of column `name`: 'f64', 'f32', 'i32', 'u32', 'i16', 'u16', 'i8' or 'u8'
		   * (undefined when there is no such column).
		   */
		  function typeOf(name) {
		    for (var i = 0; i < columns.length; ++i) {
		      if (columns[i].name === name) return TYPE_NAMES[columns[i].ArrayType.name] || columns[i].ArrayType.name;
		    }
		  }

		  /**
		   * Numbers per row of column `name` (undefined when there is no such column).
		   */
		  function sizeOf(name) {
		    for (var i = 0; i < columns.length; ++i) if (columns[i].name === name) return columns[i].size;
		  }

		  /**
		   * Adds a row and returns its index. Its slots hold each column's initial value.
		   */
		  function add() {
		    if (store.n === store.capacity) resize(Math.max(16, store.capacity * 2));
		    var index = store.n++;
		    var used = index < highestUsed;
		    if (!used) highestUsed = index + 1;
		    var fill = used ? columns : withInitial;
		    for (var i = 0; i < fill.length; ++i) {
		      var column = fill[i];
		      var size = column.size, array = column.array, start = index * size;
		      for (var k = 0; k < size; ++k) array[start + k] = column.initial;
		    }
		    return index;
		  }

		  /**
		   * Removes the rows listed in `rows` (sorted, no repeats). The rows after them move down,
		   * keeping their order.
		   */
		  function removeRows(rows) {
		    var count = rows.length;
		    if (count === 0) return;
		    var n = store.n;
		    for (var i = 0; i < columns.length; ++i) {
		      var column = columns[i];
		      var size = column.size, array = column.array;
		      var write = rows[0];
		      for (var h = 0; h < count; ++h) {
		        var start = rows[h] + 1, end = h + 1 < count ? rows[h + 1] : n;
		        if (end > start) {
		          array.copyWithin(write * size, start * size, end * size);
		          write += end - start;
		        }
		      }
		    }
		    store.n = n - count;
		  }

		  /**
		   * Copies row `index` to row `otherIndex` of `other`, for every column both stores have.
		   */
		  function copyTo(index, other, otherIndex) {
		    for (var i = 0; i < columns.length; ++i) {
		      var column = columns[i];
		      var target = other.get(column.name);
		      if (!target) continue;
		      var size = column.size;
		      for (var k = 0; k < size; ++k) target[otherIndex * size + k] = column.array[index * size + k];
		    }
		  }

		  function resize(newCapacity) {
		    for (var i = 0; i < columns.length; ++i) {
		      var column = columns[i];
		      var bigger = new column.ArrayType(newCapacity * column.size);
		      bigger.set(column.array.subarray(0, Math.min(column.array.length, store.n * column.size)));
		      if (column.initial) bigger.fill(column.initial, store.n * column.size);
		      column.array = bigger;
		      store[column.name] = bigger;
		    }
		    store.capacity = newCapacity;
		    if (store.onResize) store.onResize();
		  }
		}
		return initColumnStore_1;
	}

	var hasRequiredCreateBodyStore;

	function requireCreateBodyStore () {
		if (hasRequiredCreateBodyStore) return createBodyStore.exports;
		hasRequiredCreateBodyStore = 1;
		createBodyStore.exports = createBodyStore$1;
		createBodyStore.exports.createSingleBodyStore = createSingleBodyStore;
		createBodyStore.exports.copyBody = copyBody;
		createBodyStore.exports.builtInColumns = builtInColumns;

		var initColumnStore = requireInitColumnStore();

		/**
		 * Columns every body has: [name, array type, numbers per body, initial value].
		 */
		function builtInColumns(dimensions) {
		  return [
		    ['pos', Float64Array, dimensions],
		    ['velocity', Float64Array, dimensions],
		    ['force', Float64Array, dimensions],
		    ['mass', Float64Array, 1, 1],
		    ['pinned', Uint8Array, 1],
		    ['springCount', Float64Array, 1],
		    ['springLength', Float64Array, 1],
		    // number of springs attached to the body
		    ['degree', Float64Array, 1]
		  ];
		}

		/**
		 * Numbers of bodies, in flat typed arrays (see initColumnStore.js). Body `i` owns row `i`, and
		 * axis `k` of its position is `pos[i * D + k]`. More columns can be added with `define()`.
		 */
		function createBodyStore$1(dimensions, capacity) {
		  var store = {
		    D: dimensions,
		    n: 0,
		    capacity: 0,

		    pos: null,
		    velocity: null,
		    force: null,
		    mass: null,
		    pinned: null,
		    springCount: null,
		    springLength: null,
		    degree: null,

		    add: null, removeRows: null, define: null, has: null, get: null, remove: null,
		    names: null, sizeOf: null, copyTo: null, lockBuiltIns: null, reserve: null, onResize: null,
		    typeOf: null, versionClock: 0, writes: null, columnsVersion: 0, changed: null
		  };
		  initColumnStore(store);
		  builtInColumns(dimensions).forEach(function (column) {
		    store.define(column[0], column[1], column[2], column[3]);
		  });
		  store.lockBuiltIns();

		  if (capacity) store.reserve(capacity);
		  return store;
		}

		/**
		 * The numbers of one body that is not in a simulator: the built in columns, without the
		 * machinery to add or remove rows.
		 */
		function createSingleBodyStore(dimensions) {
		  var store = { D: dimensions, n: 1 };
		  builtInColumns(dimensions).forEach(function (column) {
		    var values = new column[1](column[2]);
		    if (column[3]) values.fill(column[3]);
		    store[column[0]] = values;
		  });
		  return store;
		}

		/**
		 * Copies the built in columns of body `row` to body `otherRow` of `other`. Columns added with
		 * `define()` are not copied. They are written out, as this runs for every added or removed
		 * body; test/bodyStore.js checks that none is missing.
		 */
		function copyBody(store, row, other, otherRow) {
		  var D = store.D;
		  for (var k = 0; k < D; ++k) {
		    other.pos[otherRow * D + k] = store.pos[row * D + k];
		    other.velocity[otherRow * D + k] = store.velocity[row * D + k];
		    other.force[otherRow * D + k] = store.force[row * D + k];
		  }
		  other.mass[otherRow] = store.mass[row];
		  other.pinned[otherRow] = store.pinned[row];
		  other.springCount[otherRow] = store.springCount[row];
		  other.springLength[otherRow] = store.springLength[row];
		  other.degree[otherRow] = store.degree[row];
		}
		return createBodyStore.exports;
	}

	var createSpringStore_1;
	var hasRequiredCreateSpringStore;

	function requireCreateSpringStore () {
		if (hasRequiredCreateSpringStore) return createSpringStore_1;
		hasRequiredCreateSpringStore = 1;
		createSpringStore_1 = createSpringStore;

		var initColumnStore = requireInitColumnStore();

		/**
		 * Numbers of springs, in flat typed arrays (see initColumnStore.js). Spring `i` connects bodies
		 * `from[i]` and `to[i]`; `length[i] < 0` and `coefficient[i] <= 0` mean "use the simulator's
		 * setting".
		 */
		function createSpringStore(capacity) {
		  var store = {
		    n: 0,
		    capacity: 0,

		    from: null,
		    to: null,
		    length: null,
		    coefficient: null,

		    add: null, removeRows: null, define: null, has: null, get: null, remove: null,
		    names: null, sizeOf: null, copyTo: null, lockBuiltIns: null, reserve: null, onResize: null,
		    typeOf: null, versionClock: 0, writes: null, columnsVersion: 0, changed: null
		  };
		  initColumnStore(store);

		  store.define('from', Int32Array, 1);
		  store.define('to', Int32Array, 1);
		  store.define('length', Float64Array, 1, -1);
		  store.define('coefficient', Float64Array, 1, -1);
		  store.lockBuiltIns();

		  if (capacity) store.reserve(capacity);
		  return store;
		}
		return createSpringStore_1;
	}

	var repulsionLaw = {exports: {}};

	var parsedLaw = {exports: {}};

	var formula = {};

	/**
	 * The formula language. Ideas describe their physics as small formulas, and the simulator
	 * compiles them into its own loops: the repulsion law into the trees (repulsionLaw.js), and
	 * formulas over bodies, links and close pairs into stages (formulaStages.js). A formula is plain
	 * arithmetic with no loops and no calls into JavaScript, so other engines (such as a GPU one) can
	 * compile the same text.
	 *
	 * A formula is one or more statements separated by `;`:
	 *
	 *   w = c * (1 / mass_i + 1 / mass_j);   a named value
	 *   stiff_i += w;                        adds into a column
	 *   push = w * (1 - r / h)               an output of the stage
	 *
	 * The last statement may be a bare expression instead: the value of a sum or of a law. `//`
	 * starts a comment that runs to the end of the line.
	 *
	 * Expressions know numbers, names, `+ - * / ^` (also `**`), comparisons `< <= > >= == !=`,
	 * `&& || !`, `c ? a : b` (also written `select(c, a, b)`; both sides may be computed), and the
	 * functions exp, log, sqrt, abs, sign, floor, ceil, round, tanh, sin, cos, min, max, pow,
	 * clamp(x, lo, hi), and for vectors dot(a, b), length(a) and axis(k) (the unit vector along axis
	 * k, a whole number written in the formula). A comparison is a condition, not a number: write
	 * `select(a < b, 1, 0)` to count it.
	 *
	 * Vectors have D numbers: positions, velocities, forces, and sums of them. They add and subtract,
	 * multiply or divide by numbers, and pick with `?:`.
	 *
	 * Every formula can read `D` (number of dimensions), `pi`, and the values of BUILT_IN_VALUES.
	 *
	 * The same text compiles to any language through a printer (see JS below): the compiler decides
	 * what an expression means, the printer only spells it.
	 */

	var hasRequiredFormula;

	function requireFormula () {
		if (hasRequiredFormula) return formula;
		hasRequiredFormula = 1;
		formula.parse = parse;
		formula.parseProgram = parseProgram;
		formula.children = children;
		formula.compile = compile;
		formula.createTable = createTable;
		formula.numberLiteral = numberLiteral;
		formula.isCondition = isCondition;

		/**
		 * Functions every formula knows. For each:
		 *  - `args`: what each argument is: 'num' a number, 'vec' a vector, 'bool' a condition, 'any' a
		 *    number or a vector, 'const' a number known when the formula is compiled;
		 *  - `result`: 'num', 'vec', or 'arg' (the type of the second argument, for select);
		 *  - `domain`: where it is defined. Arguments outside it give what JS gives on the CPU, and
		 *    other engines may differ there;
		 *  - `derivative(printer, args, value)`: code for the derivative with respect to r, from the
		 *    arguments' codes `{v, d}` (d is null when an argument does not depend on r) and the code of
		 *    the value; null: 0 almost everywhere. Laws need it; select and pow are differentiated by the
		 *    law compiler itself;
		 *  - `js`: the JS function that computes it.
		 * Printers of other languages print every name of this table their own way, or refuse it by
		 * name. `round` and `clamp` are rewritten when parsed (into floor(x + 0.5), so that every engine
		 * rounds halves up, and min(max(x, lo), hi)), so no printer sees them.
		 */
		var BUILTINS = {
		  exp: ofNumber('all', 'Math.exp', function (p, a, v) { return v + ' * ' + a[0].d; }),
		  log: ofNumber('x > 0', 'Math.log', function (p, a) { return a[0].d + ' / ' + a[0].v; }),
		  sqrt: ofNumber('x >= 0', 'Math.sqrt', function (p, a, v) { return a[0].d + ' / (' + p.number(2) + ' * ' + v + ')'; }),
		  abs: ofNumber('all', 'Math.abs', function (p, a) { return p.choose(a[0].v + ' < ' + p.number(0), '-' + a[0].d, a[0].d); }),
		  sign: ofNumber('all', 'Math.sign', null),
		  floor: ofNumber('all', 'Math.floor', null),
		  ceil: ofNumber('all', 'Math.ceil', null),
		  tanh: ofNumber('all', 'Math.tanh', function (p, a, v) { return '(' + p.number(1) + ' - ' + v + ' * ' + v + ') * ' + a[0].d; }),
		  sin: ofNumber('all', 'Math.sin', function (p, a) { return p.call('cos', [a[0].v]) + ' * ' + a[0].d; }),
		  cos: ofNumber('all', 'Math.cos', function (p, a) { return '-' + p.call('sin', [a[0].v]) + ' * ' + a[0].d; }),
		  min: pick('min', ' <= '),
		  max: pick('max', ' >= '),
		  pow: { args: ['num', 'num'], result: 'num', domain: 'x > 0, or y a whole number', derivative: null, js: 'Math.pow' },
		  select: { args: ['bool', 'any', 'any'], result: 'arg', domain: 'all', derivative: null, js: null },
		  dot: { args: ['vec', 'vec'], result: 'num', domain: 'all', derivative: null, js: null },
		  length: { args: ['vec'], result: 'num', domain: 'all', derivative: null, js: null },
		  // the unit vector along axis k (0 is the first axis): constant components, 1 on axis k
		  axis: { args: ['const'], result: 'vec', domain: '0 <= k < D, whole', derivative: null, js: null }
		};

		function ofNumber(domain, js, derivative) {
		  return { args: ['num'], result: 'num', domain: domain, derivative: derivative, js: js };
		}

		// The derivative of min and max is the one of the argument they pick
		function pick(name, picksFirst) {
		  return {
		    args: ['num', 'num'], result: 'num', domain: 'all', js: 'Math.' + name,
		    derivative: function (p, a) {
		      return p.choose(a[0].v + picksFirst + a[1].v, a[0].d === null ? p.number(0) : a[0].d, a[1].d === null ? p.number(0) : a[1].d);
		    }
		  };
		}

		/**
		 * Number of arguments of every function, by name.
		 */
		var FUNCTIONS = {};
		Object.keys(BUILTINS).forEach(function (name) { FUNCTIONS[name] = BUILTINS[name].args.length; });

		/**
		 * Prints JS. A printer spells what the compilers decided; another language gets another object
		 * with the same methods:
		 *  - number(value): a literal;
		 *  - call(name, argumentCodes): a function of BUILTINS (pow included);
		 *  - choose(condition, yes, no): a choice between two values;
		 *  - operator(op): a comparison or && ||, as written in formulas (== != < <= > >= && ||);
		 *  - declare(name, code, kind): a statement that declares a variable. `kind` is 'temp' for
		 *    values the compiler names (never assigned again) and 'local' for named values of the
		 *    formula (assigned again by `+=` and the like);
		 *  - result(name, code): a statement that gives an output variable its value (the law's k1, k2;
		 *    JS declares them before);
		 *  - assign(target, op, code): `target op code` as a statement, op one of = += -= *= /=;
		 *  - local(name): the variable for a named value of the formula, so that user names never
		 *    collide with the language's own words;
		 *  - temp(index): the variable for the compiler's index-th temporary.
		 */
		var JS = {
		  name: 'js',
		  number: numberLiteral,
		  call: function (name, args) { return BUILTINS[name].js + '(' + args.join(', ') + ')'; },
		  choose: function (condition, yes, no) { return '(' + condition + ' ? ' + yes + ' : ' + no + ')'; },
		  operator: function (op) { return op === '==' ? '===' : op === '!=' ? '!==' : op; },
		  declare: function (name, code) { return 'var ' + name + ' = ' + code + ';'; },
		  result: function (name, code) { return name + ' = ' + code + ';'; },
		  assign: function (target, op, code) { return target + ' ' + op + ' ' + code + ';'; },
		  local: function (name) { return '$v_' + name; },
		  temp: function (index) { return '$t' + index; }
		};

		formula.BUILTINS = BUILTINS;
		formula.JS = JS;

		// Where the read-only view of a step context's settings keeps the live settings (the same key as
		// createPhysicsSimulator.js's)
		var SETTINGS = typeof Symbol === 'function' ? Symbol.for('ngraph.forcelayout.settings') : '$settings';

		/**
		 * The live settings behind a step context. The library reads them, not the context's view: the
		 * view's getters are shared by all setting names, and a read through them costs several times a
		 * plain property read, on every step. A context without a view (a test's) gives its settings.
		 */
		function liveSettings(context) {
		  var settings = context.settings;
		  return settings[SETTINGS] || settings;
		}

		/**
		 * Names every formula can read. They change at most once per step, and are read from the step
		 * context (see simulator.stepContext()).
		 */
		var BUILT_IN_VALUES = {
		  // number of bodies
		  n: function (context) { return context.store.n; },
		  // number of steps done so far
		  step: function (context) { return context.iteration(); },
		  dt: function (context) { return liveSettings(context).timeStep; },
		  // the spring length, never below a small positive number (see simulator.unit())
		  unit: function (context) { return context.unit(); },
		  springLength: setting('springLength'),
		  springCoefficient: setting('springCoefficient'),
		  gravity: setting('gravity'),
		  dragCoefficient: setting('dragCoefficient'),
		  theta: setting('theta'),
		  timeStep: setting('timeStep'),
		  maxVelocity: setting('maxVelocity')
		};

		formula.FUNCTIONS = FUNCTIONS;
		formula.BUILT_IN_VALUES = BUILT_IN_VALUES;
		formula.SETTINGS = SETTINGS;
		formula.liveSettings = liveSettings;

		function setting(name) {
		  return function (context) { return liveSettings(context)[name]; };
		}

		var COMPARISONS = { '<': true, '<=': true, '>': true, '>=': true, '==': true, '!=': true };
		var ASSIGNMENTS = { '=': true, '+=': true, '-=': true, '*=': true, '/=': true };

		// ---------------------------------------------------------------------------------------
		// Parsing
		// ---------------------------------------------------------------------------------------

		var TOKEN = /(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)|(\*\*|===|!==|<=|>=|==|!=|&&|\|\||\+=|-=|\*=|\/=|[-+*/^(),;?:[\]<>!=])/y;
		var SPACE = /(?:\s+|\/\/[^\n]*)*/y;

		function tokenize(text) {
		  var tokens = [];
		  var at = 0;
		  while (true) {
		    SPACE.lastIndex = at;
		    SPACE.exec(text);
		    at = SPACE.lastIndex;
		    if (at >= text.length) break;
		    TOKEN.lastIndex = at;
		    var match = TOKEN.exec(text);
		    if (!match) throw new Error('Cannot read formula at "' + text.slice(at) + '"');
		    if (match[1] !== undefined) tokens.push({ type: 'num', value: Number(match[1]) });
		    else if (match[2] !== undefined) tokens.push({ type: 'id', value: match[2] });
		    else tokens.push({ type: 'op', value: OPERATOR_ALIASES[match[3]] || match[3] });
		    at = TOKEN.lastIndex;
		  }
		  return tokens;
		}

		var OPERATOR_ALIASES = { '**': '^', '===': '==', '!==': '!=' };

		/**
		 * Parses one expression into a tree of nodes:
		 *  - {type: 'num', value}, {type: 'var', name};
		 *  - {type: 'neg', a}, {type: 'not', a};
		 *  - {type: 'bin', op, a, b}, where op is one of + - * / ^, a comparison, && or ||;
		 *  - {type: 'call', name, args}; `c ? a : b` is a call of select;
		 *  - {type: 'index', name, a}: `name[a]`.
		 */
		function parse(text) {
		  var statements = parseProgram(text);
		  if (statements.length !== 1 || statements[0].target !== null) throw new Error('Expected one expression: ' + text);
		  return statements[0].expr;
		}

		/**
		 * Parses a formula into statements {target, op, expr}. `target` is null for a bare expression;
		 * `op` is one of = += -= *= /=.
		 */
		function parseProgram(text) {
		  if (typeof text !== 'string') throw new Error('A formula should be a string');
		  var tokens = tokenize(text);
		  var at = 0;
		  var statements = [];
		  while (at < tokens.length) {
		    if (peek(';')) { at++; continue; }
		    var statement;
		    var next = tokens[at + 1];
		    if (tokens[at].type === 'id' && next && next.type === 'op' && ASSIGNMENTS[next.value]) {
		      statement = { target: tokens[at].value, op: next.value, expr: null };
		      at += 2;
		      statement.expr = expression();
		    } else {
		      statement = { target: null, op: null, expr: expression() };
		    }
		    statements.push(statement);
		    if (at < tokens.length) expect(';');
		  }
		  if (statements.length === 0) throw new Error('Formula is empty');
		  return statements;

		  function peek(value) { return at < tokens.length && tokens[at].type === 'op' && tokens[at].value === value; }
		  function peekOperator() { return at < tokens.length && tokens[at].type === 'op' ? tokens[at].value : null; }
		  function expect(value) {
		    if (!peek(value)) {
		      var found = at < tokens.length ? '"' + tokens[at].value + '"' : 'the end';
		      throw new Error('Expected "' + value + '" but found ' + found + ' in formula ' + text);
		    }
		    at++;
		  }
		  function expression() {
		    var condition = or();
		    if (!peek('?')) return condition;
		    at++;
		    var yes = expression();
		    expect(':');
		    var no = expression();
		    return { type: 'call', name: 'select', args: [condition, yes, no] };
		  }
		  function or() {
		    var node = and();
		    while (peek('||')) { at++; node = { type: 'bin', op: '||', a: node, b: and() }; }
		    return node;
		  }
		  function and() {
		    var node = comparison();
		    while (peek('&&')) { at++; node = { type: 'bin', op: '&&', a: node, b: comparison() }; }
		    return node;
		  }
		  function comparison() {
		    var node = sum();
		    if (COMPARISONS[peekOperator()]) {
		      var op = tokens[at++].value;
		      node = { type: 'bin', op: op, a: node, b: sum() };
		      if (COMPARISONS[peekOperator()]) throw new Error('Comparisons cannot be chained (use &&) in formula ' + text);
		    }
		    return node;
		  }
		  function sum() {
		    var node = term();
		    while (peek('+') || peek('-')) {
		      var op = tokens[at++].value;
		      node = { type: 'bin', op: op, a: node, b: term() };
		    }
		    return node;
		  }
		  function term() {
		    var node = unary();
		    while (peek('*') || peek('/')) {
		      var op = tokens[at++].value;
		      node = { type: 'bin', op: op, a: node, b: unary() };
		    }
		    return node;
		  }
		  function unary() {
		    if (peek('-')) { at++; return { type: 'neg', a: unary() }; }
		    if (peek('+')) { at++; return unary(); }
		    if (peek('!')) { at++; return { type: 'not', a: unary() }; }
		    return power();
		  }
		  function power() {
		    var base = primary();
		    if (peek('^')) { at++; return { type: 'bin', op: '^', a: base, b: unary() }; }
		    return base;
		  }
		  function primary() {
		    var token = tokens[at++];
		    if (!token) throw new Error('Formula ends too early: ' + text);
		    if (token.type === 'num') return { type: 'num', value: token.value };
		    if (token.type === 'id') {
		      if (peek('(')) {
		        at++;
		        var args = [];
		        if (!peek(')')) {
		          args.push(expression());
		          while (peek(',')) { at++; args.push(expression()); }
		        }
		        expect(')');
		        return rewrite({ type: 'call', name: token.value, args: args });
		      }
		      if (peek('[')) {
		        at++;
		        var index = expression();
		        expect(']');
		        return { type: 'index', name: token.value, a: index };
		      }
		      return { type: 'var', name: token.value };
		    }
		    if (token.value === '(') {
		      var inner = expression();
		      expect(')');
		      return inner;
		    }
		    throw new Error('Unexpected "' + token.value + '" in formula ' + text);
		  }
		}

		function rewrite(node) {
		  var args = node.args;
		  if (node.name === 'round' && args.length === 1) {
		    return { type: 'call', name: 'floor', args: [{ type: 'bin', op: '+', a: args[0], b: { type: 'num', value: 0.5 } }] };
		  }
		  if (node.name === 'clamp' && args.length === 3) {
		    return { type: 'call', name: 'min', args: [{ type: 'call', name: 'max', args: [args[0], args[1]] }, args[2]] };
		  }
		  return node;
		}

		function children(node) {
		  if (node.args) return node.args;
		  var list = [];
		  if (node.a) list.push(node.a);
		  if (node.b) list.push(node.b);
		  return list;
		}

		/**
		 * True for nodes whose value is a condition (true or false), not a number.
		 */
		function isCondition(node) {
		  if (node.type === 'not') return true;
		  return node.type === 'bin' && (COMPARISONS[node.op] || node.op === '&&' || node.op === '||') === true;
		}

		function numberLiteral(value) {
		  var text = String(value);
		  return value < 0 ? '(' + text + ')' : text;
		}

		// ---------------------------------------------------------------------------------------
		// Lookup tables
		// ---------------------------------------------------------------------------------------

		/**
		 * A function sampled at evenly spaced points: `{from, to, values}` (values[0] at `from`, the
		 * last one at `to`). Between samples it is interpolated linearly; outside it keeps the value of
		 * the nearest end. Its derivative is the slope of the segment (0 outside), which is what the
		 * trees need from a law.
		 */
		function createTable(name, spec) {
		  if (!spec || !(spec.values && spec.values.length >= 2)) throw new Error('Table ' + name + ' needs at least two values');
		  if (!(Number.isFinite(spec.from) && Number.isFinite(spec.to) && spec.to > spec.from)) {
		    throw new Error('Table ' + name + ' needs finite `from` < `to`');
		  }
		  var values = Float64Array.from(spec.values);
		  var last = values.length - 1;
		  var from = spec.from;
		  var scale = last / (spec.to - spec.from);
		  return {
		    from: from,
		    to: spec.to,
		    values: values,
		    value: function (x) {
		      var q = (x - from) * scale;
		      if (!(q > 0)) return values[0];
		      if (q >= last) return values[last];
		      var i = q | 0;
		      return values[i] + (values[i + 1] - values[i]) * (q - i);
		    },
		    derivative: function (x) {
		      var q = (x - from) * scale;
		      if (!(q > 0) || q >= last) return 0;
		      var i = q | 0;
		      return (values[i + 1] - values[i]) * scale;
		    }
		  };
		}

		// ---------------------------------------------------------------------------------------
		// Code for formulas of stages
		// ---------------------------------------------------------------------------------------

		/**
		 * Compiles a formula into lines of code, printed by `printer` (JS by default). `scope` tells
		 * what names mean:
		 *
		 *  - `scope.D`: number of dimensions;
		 *  - `scope.condition`: true when the closing bare expression is a condition (a stage's `when`);
		 *  - `scope.name(name, assigned)` returns undefined for an unknown name, or a description
		 *    (`assigned` is true when the formula assigns to the name rather than reads it):
		 *      {type: 'num', code} or {type: 'vec', codes} - a value the formula can read;
		 *      add `write(op, value)` returning lines, and `ops` (allowed operators), when the formula
		 *      can assign to it;
		 *      {index(code)} - a name read as `name[index]`, returning a value;
		 *      {call(argumentCodes)} - a function of one number (a table), returning code.
		 *
		 * Names the formula assigns that the scope does not know are named values (local variables).
		 * Returns {lines, result}: `result` is the value of a closing bare expression, if any.
		 */
		function compile(text, scope, printer) {
		  printer = printer || JS;
		  var statements = parseProgram(text);
		  var D = scope.D;
		  var lines = [];
		  var locals = Object.create(null);
		  var temp = 0;
		  var result = null;

		  statements.forEach(function (statement, at) {
		    if (statement.target === null) {
		      if (at !== statements.length - 1) throw new Error('Only the last statement of a formula can be a bare expression: ' + text);
		      result = scope.condition ? { type: 'bool', code: condition(statement.expr) } : number(statement.expr, true);
		      return;
		    }
		    var name = statement.target;
		    var op = statement.op;
		    // A named value can hold a condition; anything else takes numbers or vectors
		    var value = evaluate(statement.expr);
		    var local = locals[name];
		    if (value.type === 'bool' && (op !== '=' || local || scope.name(name, true))) {
		      throw new Error('A condition is used as a number in formula ' + text + ' (use select(condition, 1, 0) to count it)');
		    }
		    if (local) {
		      value = scaling(local, op, value);
		      sameType(local, value, name);
		      assign(local.codes || [local.code], op, value);
		      return;
		    }
		    var known = scope.name(name, true);
		    if (known) {
		      if (!known.write) throw new Error(name + ' cannot be assigned in formula ' + text);
		      if (known.ops && known.ops.indexOf(op) < 0) {
		        throw new Error(name + ' can only be changed with ' + known.ops.join(' or ') + ' in formula ' + text);
		      }
		      value = scaling(known, op, value);
		      sameType(known, value, name);
		      known.write(op, value).forEach(function (line) { lines.push(line); });
		      return;
		    }
		    if (op !== '=') throw new Error(name + ' is used with ' + op + ' before it has a value, in formula ' + text);
		    if (name === 'D' || name === 'pi') throw new Error(name + ' cannot be assigned in formula ' + text);
		    local = { type: value.type, reads: 0 };
		    if (value.type === 'vec') {
		      local.codes = value.codes.map(function (code, k) {
		        var variable = printer.local(name) + '_' + k;
		        lines.push(printer.declare(variable, code, 'local'));
		        return variable;
		      });
		    } else {
		      local.code = printer.local(name);
		      lines.push(printer.declare(local.code, value.code, 'local'));
		    }
		    locals[name] = local;
		  });

		  Object.keys(locals).forEach(function (name) {
		    if (locals[name].reads === 0) throw new Error(name + ' is computed but never used in formula ' + text);
		  });
		  return { lines: lines, result: result };

		  function assign(targets, op, value) {
		    var codes = value.codes || [value.code];
		    targets.forEach(function (target, k) { lines.push(printer.assign(target, op, codes[k])); });
		  }

		  // `vector *= number` and `vector /= number` scale every component
		  function scaling(target, op, value) {
		    if (target.type !== 'vec' || value.type !== 'num' || (op !== '*=' && op !== '/=')) return value;
		    var factor = save(value.code);
		    return each(function () { return factor; });
		  }

		  function sameType(target, value, name) {
		    if (target.type !== value.type) {
		      throw new Error(name + ' is a ' + typeName(target.type) + ' but gets a ' + typeName(value.type) + ' in formula ' + text);
		    }
		  }

		  function save(code) {
		    if (/^[\w$]+$/.test(code) || /^\(-?[\d.e+-]+\)$/.test(code)) return code;
		    var variable = printer.temp(temp++);
		    lines.push(printer.declare(variable, code, 'temp'));
		    return variable;
		  }

		  // A number or a vector (not a condition)
		  function number(node, allowVector) {
		    var value = evaluate(node);
		    if (value.type === 'bool') {
		      throw new Error('A condition is used as a number in formula ' + text + ' (use select(condition, 1, 0) to count it)');
		    }
		    if (!allowVector && value.type === 'vec') throw new Error('A vector is used as a number in formula ' + text);
		    return value;
		  }

		  function condition(node) {
		    var value = evaluate(node);
		    if (value.type !== 'bool') throw new Error('Expected a condition (such as a < b) in formula ' + text);
		    return value.code;
		  }

		  function scalar(code) { return { type: 'num', code: code }; }
		  function vector(codes) { return { type: 'vec', codes: codes }; }
		  function each(fn) {
		    var codes = [];
		    for (var k = 0; k < D; ++k) codes.push(fn(k));
		    return vector(codes);
		  }
		  // Components that are read more than once are computed once
		  function saved(value) {
		    return value.type === 'vec' ? vector(value.codes.map(save)) : scalar(save(value.code));
		  }

		  function evaluate(node) {
		    switch (node.type) {
		      case 'num': return scalar(printer.number(node.value));
		      case 'var': return read(node.name);
		      case 'index': return index(node);
		      case 'neg':
		        var a = number(node.a, true);
		        if (a.type === 'vec') return vector(a.codes.map(function (code) { return '(-' + code + ')'; }));
		        return scalar('(-' + a.code + ')');
		      case 'not': return { type: 'bool', code: '!' + condition(node.a) };
		      case 'bin': return binary(node);
		      case 'call': return call(node);
		    }
		    throw new Error('Unknown formula node ' + node.type);
		  }

		  function read(name) {
		    var local = locals[name];
		    if (local) {
		      local.reads += 1;
		      if (local.type === 'bool') return { type: 'bool', code: local.code };
		      return local.type === 'vec' ? vector(local.codes) : scalar(local.code);
		    }
		    if (name === 'D') return scalar(printer.number(D));
		    if (name === 'pi') return scalar(printer.number(Math.PI));
		    var known = scope.name(name);
		    if (!known || known.call || known.index) {
		      throw new Error((known ? name + ' cannot be read as a value' : 'Unknown name ' + name) + ' in formula ' + text);
		    }
		    return known.type === 'vec' ? vector(known.codes) : scalar(known.code);
		  }

		  function index(node) {
		    var known = scope.name(node.name);
		    if (!known || !known.index) throw new Error(node.name + ' cannot be indexed in formula ' + text);
		    return known.index(save(number(node.a).code));
		  }

		  function binary(node) {
		    var op = node.op;
		    if (op === '&&' || op === '||') return { type: 'bool', code: '(' + condition(node.a) + ' ' + printer.operator(op) + ' ' + condition(node.b) + ')' };
		    if (COMPARISONS[op]) {
		      return { type: 'bool', code: '(' + number(node.a).code + ' ' + printer.operator(op) + ' ' + number(node.b).code + ')' };
		    }
		    if (op === '^') return power(number(node.a), node.b);
		    var a = number(node.a, true), b = number(node.b, true);
		    if (op === '+' || op === '-') {
		      if (a.type !== b.type) throw new Error('Cannot ' + (op === '+' ? 'add' : 'subtract') + ' a vector and a number in formula ' + text);
		      if (a.type === 'vec') return each(function (k) { return '(' + a.codes[k] + ' ' + op + ' ' + b.codes[k] + ')'; });
		      return scalar('(' + a.code + ' ' + op + ' ' + b.code + ')');
		    }
		    if (a.type === 'vec' && b.type === 'vec') throw new Error('Vectors cannot be multiplied or divided (use dot()) in formula ' + text);
		    if (a.type === 'vec' || b.type === 'vec') {
		      if (op === '/' && b.type === 'vec') throw new Error('Cannot divide by a vector in formula ' + text);
		      var v = a.type === 'vec' ? a : b;
		      var s = save(a.type === 'vec' ? b.code : a.code);
		      return each(function (k) { return '(' + v.codes[k] + ' ' + op + ' ' + s + ')'; });
		    }
		    return scalar('(' + a.code + ' ' + op + ' ' + b.code + ')');
		  }

		  function power(base, exponentNode) {
		    var exponent = exponentNode.type === 'num' ? exponentNode.value :
		      exponentNode.type === 'neg' && exponentNode.a.type === 'num' ? -exponentNode.a.value : NaN;
		    if (Number.isInteger(exponent) && exponent >= -4 && exponent <= 4) {
		      if (exponent === 0) return scalar(printer.number(1));
		      var b = save(base.code);
		      var product = [];
		      for (var i = 0; i < Math.abs(exponent); ++i) product.push(b);
		      return scalar(exponent > 0 ? '(' + product.join(' * ') + ')' : '(' + printer.number(1) + ' / (' + product.join(' * ') + '))');
		    }
		    return scalar(printer.call('pow', [base.code, number(exponentNode).code]));
		  }

		  function call(node) {
		    var name = node.name;
		    var args = node.args;
		    var arity = FUNCTIONS[name];
		    if (arity === undefined) {
		      var known = scope.name(name);
		      if (!known || !known.call) throw new Error('Unknown function ' + name + ' in formula ' + text);
		      if (args.length !== 1) throw new Error(name + '() expects 1 argument in formula ' + text);
		      return scalar(known.call([number(args[0]).code]));
		    }
		    if (args.length !== arity) throw new Error(name + '() expects ' + arity + ' argument(s) in formula ' + text);
		    if (name === 'select') {
		      var test = save(condition(args[0]));
		      var yes = number(args[1], true), no = number(args[2], true);
		      if (yes.type !== no.type) throw new Error('Both sides of a choice should be numbers, or both vectors, in formula ' + text);
		      if (yes.type === 'vec') return each(function (k) { return printer.choose(test, yes.codes[k], no.codes[k]); });
		      return scalar(printer.choose(test, yes.code, no.code));
		    }
		    if (name === 'dot' || name === 'length') {
		      var u = saved(number(args[0], true));
		      var w = name === 'dot' ? saved(number(args[1], true)) : u;
		      if (u.type !== 'vec' || w.type !== 'vec') throw new Error(name + '() expects vectors in formula ' + text);
		      var terms = u.codes.map(function (code, k) { return code + ' * ' + w.codes[k]; }).join(' + ');
		      return scalar(name === 'dot' ? '(' + terms + ')' : printer.call('sqrt', [terms]));
		    }
		    if (name === 'axis') {
		      var axis = constantNumber(args[0]);
		      if (!(Number.isInteger(axis) && axis >= 0 && axis < D)) {
		        throw new Error('axis() takes a whole number from 0 to ' + (D - 1) + ' in formula ' + text);
		      }
		      return each(function (k) { return printer.number(k === axis ? 1 : 0); });
		    }
		    return scalar(printer.call(name, args.map(function (arg) { return number(arg).code; })));
		  }

		  // A number written in the formula (or D), known when it is compiled
		  function constantNumber(node) {
		    if (node.type === 'num') return node.value;
		    if (node.type === 'var' && node.name === 'D' && !locals.D) return D;
		    if (node.type === 'neg') return -constantNumber(node.a);
		    if (node.type === 'bin' && (node.op === '+' || node.op === '-')) {
		      var a = constantNumber(node.a), b = constantNumber(node.b);
		      return node.op === '+' ? a + b : a - b;
		    }
		    return NaN;
		  }
		}

		function typeName(type) {
		  return type === 'vec' ? 'vector' : 'number';
		}
		return formula;
	}

	var hasRequiredParsedLaw;

	function requireParsedLaw () {
		if (hasRequiredParsedLaw) return parsedLaw.exports;
		hasRequiredParsedLaw = 1;
		// The code of repulsion laws other than the stock 1/r^2 (see repulsionLaw.js, which loads this
		// file with the first such law): parsing, checks, the derivative, hoisted parts and printing.
		var DEFAULT_KEY = requireRepulsionLaw().DEFAULT_KEY;
		var formula = null;
		var BUILT_IN_VALUES = null;
		var BUILT_IN_FUNCTIONS = null;
		// The JS printer of formula.js
		var JS = null;

		parsedLaw.exports = createParsedLaw;
		parsedLaw.exports.parse = function (text) { return loadFormula().parse(text); };

		function loadFormula() {
		  if (formula) return formula;
		  formula = requireFormula();
		  BUILT_IN_VALUES = formula.BUILT_IN_VALUES;
		  // Formula functions of numbers (vectors have no place in a law, and select is written ?:)
		  BUILT_IN_FUNCTIONS = {};
		  Object.keys(formula.BUILTINS).forEach(function (name) {
		    var builtIn = formula.BUILTINS[name];
		    var numbers = builtIn.result === 'num' && builtIn.args.every(function (arg) { return arg === 'num'; });
		    if (numbers) BUILT_IN_FUNCTIONS[name] = builtIn.args.length;
		  });
		  JS = formula.JS;
		  return formula;
		}

		function createParsedLaw(spec) {
		  loadFormula();

		  var params = spec.params || {};
		  var paramNames = Object.keys(params);
		  var known = { r: true, D: true, pi: true };
		  paramNames.forEach(function (name) {
		    if (!/^[A-Za-z_]\w*$/.test(name) || known[name]) throw new Error('Bad law parameter name: ' + name);
		    known[name] = true;
		  });
		  var tableNames = Object.keys(spec.tables || {});
		  var functions = lawFunctions(spec.functions || {}, spec.tables || {});

		  var forceTree = lawTree(spec.force, known);
		  if (check(forceTree, known, functions) !== 'num') throw new Error('A law should give a number, not a condition: ' + spec.force);
		  var rangeTree = typeof spec.range === 'string' ? lawTree(spec.range, known) : null;
		  if (rangeTree) {
		    if (check(rangeTree, known, functions) !== 'num') throw new Error('Law range should be a number: ' + spec.range);
		    if (uses(rangeTree, 'r')) throw new Error('Law range cannot depend on r');
		  }
		  // Names every formula knows (dt, unit, ...) are read every step, as parameters are
		  var builtInNames = [];
		  [forceTree, rangeTree].forEach(function (tree) {
		    if (tree) collectNames(tree, function (name) {
		      if (!known[name] && BUILT_IN_VALUES[name] && builtInNames.indexOf(name) < 0) builtInNames.push(name);
		    });
		  });
		  var userParamCount = paramNames.length;
		  paramNames = paramNames.concat(builtInNames);

		  var rangeIsFunction = typeof spec.range === 'function';
		  var rangeIsNumber = typeof spec.range === 'number';
		  var hasRange = rangeTree !== null || rangeIsFunction || rangeIsNumber;
		  var isDefault = !hasRange && paramNames.length === 0 && compact(spec.force) === DEFAULT_KEY;

		  // Parts of the law that do not depend on r are computed once per step, not once per pair:
		  var hoisted = [];
		  hoistConstants(forceTree, hoisted);
		  var hoistedKeys = hoisted.map(function (h) { return h.key; });

		  // Values that the generated code reads at the start of every tree walk. Parameters go by
		  // their names; the range and hoisted parts start with $, which a parameter name cannot.
		  var values = { $range: Infinity };
		  paramNames.concat(hoistedKeys).forEach(function (name) { values[name] = 0; });
		  // The default law runs the stock code, which needs none of these (and no new Function()):
		  var evaluateRange = rangeTree ? new Function('values', 'functions', 'D', paramPrologue(paramNames, 'values') + 'return ' + toJS(rangeTree) + ';') : null;
		  var evaluateHoisted = hoisted.length && !isDefault ? new Function('values', 'functions', 'D', paramPrologue(paramNames, 'values') +
		    hoisted.map(function (h) { return 'values.' + h.key + ' = ' + h.code + ';'; }).join(' ')) : null;

		  var law = {
		    /**
		     * Same key, same generated code.
		     */
		    key: compact(spec.force) + '|' + paramNames.join(',') + '|' + (hasRange ? 'range' : '') + '|' + Object.keys(functions).join(','),
		    tableNames: tableNames,
		    isDefault: isDefault,
		    hasRange: hasRange,
		    paramNames: paramNames,
		    functions: functions,
		    /**
		     * The numbers of the coming step (after `update`): parameters by name, the parts computed
		     * once per step as `$h<n>` (read as `lawH<n>` by the code `emit` prints) and the range as
		     * `$range`. Engines that keep their own copy of the numbers read them here.
		     */
		    values: values,
		    spec: spec,

		    /**
		     * Reads parameter values (and the range) for the coming step, from the step context (see
		     * simulator.stepContext()).
		     */
		    update: function (context) {
		      for (var i = 0; i < paramNames.length; ++i) {
		        var name = paramNames[i];
		        var value = i < userParamCount ? params[name] : BUILT_IN_VALUES[name];
		        values[name] = typeof value === 'function' ? value(context) : value;
		      }
		      var dimensions = formula.liveSettings(context).dimensions;
		      if (rangeIsNumber) values.$range = spec.range;
		      else if (rangeIsFunction) values.$range = spec.range(context);
		      else if (evaluateRange) values.$range = evaluateRange(values, functions, dimensions);
		      if (evaluateHoisted) evaluateHoisted(values, functions, dimensions);
		    },

		    /**
		     * The law as plain data: its expression, parameters ({name, kind: 'number', value},
		     * {name, kind: 'host'} for functions), the built in values it reads, range, tables and the
		     * names of JS functions.
		     */
		    describe: function () {
		      return {
		        force: spec.force,
		        params: paramNames.slice(0, userParamCount).map(function (name) {
		          var described = describeValue(params[name]);
		          described.name = name;
		          return described;
		        }),
		        builtIns: builtInNames.slice(),
		        range: spec.range === undefined ? null : describeValue(spec.range),
		        tables: tableNames.map(function (name) {
		          var table = spec.tables[name];
		          return { name: name, from: table.from, to: table.to, values: Float64Array.from(table.values) };
		        }),
		        functions: Object.keys(spec.functions || {}),
		        isDefault: isDefault,
		        key: law.key
		      };
		    },

		    /**
		     * Code that declares the parameters as local variables, read from `valuesName`.
		     */
		    prologue: function (valuesName) {
		      return paramPrologue(paramNames, valuesName) +
		        hoisted.map(function (h) { return ' var ' + h.variable + ' = ' + valuesName + '.' + h.key + ';'; }).join('') +
		        (hasRange ? ' var lawRange = ' + valuesName + '.$range, lawRange2 = lawRange * lawRange;' : '');
		    },

		    /**
		     * Code that sets `k1Name` to F(r) / r (and `k2Name`, when given, to (F(r)/r - F'(r)) / r^2),
		     * where `rName` holds the distance and the parameters are in local variables (`law_<name>`,
		     * and `lawH<n>` for the parts computed once per step). `printer` spells the code (see
		     * formula.js; JS when left out: `emit(dimension, rName, k1Name, k2Name)`).
		     */
		    emit: function (printer, dimension, rName, k1Name, k2Name) {
		      if (typeof printer === 'number') return emitKernel(forceTree, printer, dimension, rName, k1Name, JS);
		      return emitKernel(forceTree, dimension, rName, k1Name, k2Name, printer);
		    }
		  };
		  return law;
		}

		/**
		 * Marks the parts of the expression that do not depend on r, so they are computed once per
		 * step: every largest such part that is more than a name or a number, and every divisor (whose
		 * reciprocal is computed, so the division becomes a multiplication). Names depend on the
		 * expression only, so all laws with the same expression share the generated code. A hoisted
		 * part is `lawH<n>` in the generated code (parameters are `law_<name>`) and `$h<n>` in values.
		 */
		function hoistConstants(tree, hoisted) {
		  // Named values make the tree a graph: a shared part is looked at (and hoisted) once
		  var seen = new Map();
		  var dependsOnR = visit(tree);
		  if (!dependsOnR) mark(tree);
		  return hoisted;

		  function visit(node) {
		    if (seen.has(node)) return seen.get(node);
		    var parts = children(node);
		    var childDepends = parts.map(visit);
		    var depends = node.type === 'var' ? node.name === 'r' : childDepends.some(Boolean);
		    if (depends) {
		      parts.forEach(function (child, i) { if (!childDepends[i]) mark(child); });
		      if (node.type === 'bin' && node.op === '/' && !childDepends[1] && !node.reciprocal) {
		        node.reciprocal = hoist('1 / ' + toJS(node.b));
		      }
		    }
		    seen.set(node, depends);
		    return depends;
		  }

		  function mark(node) {
		    if (node.type === 'num' || node.type === 'var' || node.hoisted) return;
		    // A condition is not a number, so it cannot be one of the law's values; its parts can
		    if (formula.isCondition(node)) children(node).forEach(mark);
		    else node.hoisted = hoist(toJS(node));
		  }

		  function hoist(code) {
		    var n = hoisted.length;
		    hoisted.push({ variable: 'lawH' + n, key: '$h' + n, code: code });
		    return 'lawH' + n;
		  }
		}

		// A number, an expression, or a function (called by engines with the step context)
		function describeValue(spec) {
		  if (typeof spec === 'number') return { kind: 'number', value: spec };
		  if (typeof spec === 'string') return { kind: 'expression', text: spec };
		  return { kind: 'host' };
		}

		function paramPrologue(paramNames, valuesName) {
		  return paramNames.map(function (name) { return 'var law_' + name + ' = ' + valuesName + '.' + name + ';'; }).join(' ');
		}

		function compact(text) {
		  return text.replace(/\s+/g, '');
		}


		/**
		 * Parses a law: an expression of r, optionally after named values (`'u = r / L; exp(-u) / r^2'`).
		 * A named value becomes a part of the tree that every use shares.
		 */
		function lawTree(text, known) {
		  var statements = formula.parseProgram(text);
		  var named = Object.create(null);
		  var used = Object.create(null);
		  var tree = null;
		  statements.forEach(function (statement, at) {
		    if (statement.target === null) {
		      if (at !== statements.length - 1) throw new Error('Only the last part of a law can be its expression: ' + text);
		      tree = substitute(statement.expr);
		      return;
		    }
		    var name = statement.target;
		    if (statement.op !== '=') throw new Error('Law values are set with =, not ' + statement.op + ': ' + text);
		    if (named[name] || known[name] || BUILT_IN_VALUES[name]) throw new Error(name + ' already has a meaning in law ' + text);
		    named[name] = substitute(statement.expr);
		  });
		  if (!tree) throw new Error('A law should end with the expression of F(r): ' + text);
		  Object.keys(named).forEach(function (name) {
		    if (!used[name]) throw new Error(name + ' is computed but never used in law ' + text);
		  });
		  return tree;

		  function substitute(node) {
		    if (node.type === 'var' && named[node.name]) {
		      used[node.name] = true;
		      return named[node.name];
		    }
		    var copy = {};
		    Object.keys(node).forEach(function (key) { copy[key] = node[key]; });
		    if (node.args) copy.args = node.args.map(substitute);
		    if (node.a) copy.a = substitute(node.a);
		    if (node.b) copy.b = substitute(node.b);
		    return copy;
		  }
		}

		/**
		 * Custom functions and lookup tables, as {name: {value, derivative}}.
		 */
		function lawFunctions(functions, tables) {
		  var all = {};
		  Object.keys(functions).forEach(function (name) { all[name] = functions[name]; });
		  Object.keys(tables).forEach(function (name) {
		    if (all[name]) throw new Error(name + ' is both a function and a table');
		    var table = formula.createTable(name, tables[name]);
		    all[name] = { value: table.value, derivative: table.derivative };
		  });
		  return all;
		}

		/**
		 * Checks names, functions and types. Returns 'num' or 'bool' (a condition).
		 */
		function check(node, known, functions) {
		  switch (node.type) {
		    case 'num': return 'num';
		    case 'var':
		      if (!known[node.name] && !BUILT_IN_VALUES[node.name]) throw new Error('Unknown name in law expression: ' + node.name);
		      return 'num';
		    case 'index': throw new Error('Laws cannot read ' + node.name + '[...]');
		    case 'neg': return expect(node.a, 'num');
		    case 'not':
		      expect(node.a, 'bool');
		      return 'bool';
		    case 'bin':
		      if (node.op === '&&' || node.op === '||') {
		        expect(node.a, 'bool');
		        expect(node.b, 'bool');
		        return 'bool';
		      }
		      expect(node.a, 'num');
		      expect(node.b, 'num');
		      return formula.isCondition(node) ? 'bool' : 'num';
		    case 'call':
		      if (node.name === 'select') {
		        if (node.args.length !== 3) throw new Error('select() expects 3 arguments');
		        expect(node.args[0], 'bool');
		        expect(node.args[1], 'num');
		        return expect(node.args[2], 'num');
		      }
		      var arity = BUILT_IN_FUNCTIONS[node.name];
		      if (arity === undefined) {
		        if (formula.FUNCTIONS[node.name]) throw new Error('Laws work on numbers; ' + node.name + '() is for vectors');
		        var custom = functions[node.name];
		        if (!custom || typeof custom.value !== 'function') throw new Error('Unknown function in law expression: ' + node.name);
		        arity = 1;
		      }
		      if (node.args.length !== arity) throw new Error(node.name + '() expects ' + arity + ' argument(s)');
		      node.args.forEach(function (arg) { expect(arg, 'num'); });
		      return 'num';
		  }
		  throw new Error('Unknown law node ' + node.type);

		  function expect(child, type) {
		    var actual = check(child, known, functions);
		    if (actual !== type) {
		      throw new Error(type === 'num' ? 'A condition is used as a number in a law (use select(condition, 1, 0))' :
		        'Expected a condition (such as a < b) in a law');
		    }
		    return actual;
		  }
		}

		function uses(node, name) {
		  if (node.type === 'var') return node.name === name;
		  return children(node).some(function (child) { return uses(child, name); });
		}

		function collectNames(node, fn) {
		  if (node.type === 'var') fn(node.name);
		  children(node).forEach(function (child) { collectNames(child, fn); });
		}

		// Plain JS for an expression without derivatives (used for the range); `D` stays a variable
		function toJS(node) {
		  switch (node.type) {
		    case 'num': return numberLiteral(node.value);
		    case 'var':
		      if (node.name === 'pi') return numberLiteral(Math.PI);
		      return node.name === 'D' ? 'D' : 'law_' + node.name;
		    case 'neg': return '(-' + toJS(node.a) + ')';
		    case 'not': return '(!' + toJS(node.a) + ')';
		    case 'bin':
		      if (node.op === '^') return JS.call('pow', [toJS(node.a), toJS(node.b)]);
		      return '(' + toJS(node.a) + ' ' + JS.operator(node.op) + ' ' + toJS(node.b) + ')';
		    case 'call':
		      var args = node.args.map(toJS);
		      if (node.name === 'select') return JS.choose(args[0], args[1], args[2]);
		      if (BUILT_IN_FUNCTIONS[node.name]) return JS.call(node.name, args);
		      return 'functions.' + node.name + '.value(' + args.join(', ') + ')';
		  }
		}

		/**
		 * Value of an expression made of numbers and D only (NaN for anything else).
		 */
		function fold(node, dimension) {
		  switch (node.type) {
		    case 'num': return node.value;
		    case 'var': return node.name === 'D' ? dimension : node.name === 'pi' ? Math.PI : NaN;
		    case 'neg': return -fold(node.a, dimension);
		    case 'bin':
		      var a = fold(node.a, dimension), b = fold(node.b, dimension);
		      if (node.op === '+') return a + b;
		      if (node.op === '-') return a - b;
		      if (node.op === '*') return a * b;
		      if (node.op === '/') return a / b;
		      if (node.op === '^') return Math.pow(a, b);
		  }
		  return NaN;
		}

		function children(node) {
		  return formula.children(node);
		}

		function numberLiteral(value) {
		  var text = String(value);
		  return value < 0 ? '(' + text + ')' : text;
		}

		// ---------------------------------------------------------------------------------------
		// Code for F(r)/r and (F(r)/r - F'(r))/r^2
		// ---------------------------------------------------------------------------------------

		// Drops temporaries that nothing reads, e.g. a / b when F / r is computed as a / (b * r), or
		// derivatives that only k2 would need. `declared[i]` names the temporary that line i declares.
		function dropUnused(lines, declared) {
		  var kept = [], read = '';
		  for (var i = lines.length - 1; i >= 0; --i) {
		    if (declared[i] && !new RegExp('\\b' + declared[i] + '\\b').test(read)) continue;
		    kept.unshift(lines[i]);
		    read += ' ' + lines[i];
		  }
		  return kept;
		}

		/**
		 * Forward mode differentiation: every node becomes a value and a derivative with respect to r.
		 * Each is either a constant number, or code in a temporary variable. A derivative of `null`
		 * means 0 (the node does not depend on r).
		 */
		function emitKernel(tree, dimension, rName, k1Name, k2Name, printer) {
		  var lines = [], declared = [];
		  var temp = 0;
		  var prefix = k1Name + '_';
		  // Parts shared by named values are written once
		  var done = new Map();

		  var force = visit(tree, k2Name !== undefined);
		  if (force.dividend !== undefined) {
		    // F = a / b: one division for F / r
		    push(printer.result(k1Name, force.dividend + ' / (' + force.divisor + ' * ' + rName + ')'));
		  } else {
		    push(printer.result(k1Name, force.v + ' / ' + rName));
		  }
		  if (k2Name !== undefined) {
		    var derivative = force.d === null ? printer.number(0) : force.d;
		    push(printer.result(k2Name, '(' + k1Name + ' - ' + derivative + ') / (' + rName + ' * ' + rName + ')'));
		  }
		  return dropUnused(lines, declared).join(' ');

		  function push(line, name) {
		    lines.push(line);
		    declared.push(name || null);
		  }
		  function save(code) {
		    if (/^[\w.]+$/.test(code)) return code;
		    var name = prefix + (temp++);
		    push(printer.declare(name, code, 'temp'), name);
		    return name;
		  }
		  function constant(node) { return node.d === null; }

		  // Returns {v: code, d: code or null}
		  function visit(node, needDerivative) {
		    var result = done.get(node);
		    if (!result) {
		      result = visitOnce(node, needDerivative);
		      done.set(node, result);
		    }
		    return result;
		  }

		  function visitOnce(node, needDerivative) {
		    if (node.hoisted) {
		      // Numbers and D only: known right now
		      var known = fold(node, dimension);
		      return { v: Number.isFinite(known) ? printer.number(known) : node.hoisted, d: null };
		    }
		    switch (node.type) {
		      case 'num': return { v: printer.number(node.value), d: null };
		      case 'var':
		        if (node.name === 'r') return { v: rName, d: printer.number(1) };
		        if (node.name === 'D') return { v: printer.number(dimension), d: null };
		        if (node.name === 'pi') return { v: printer.number(Math.PI), d: null };
		        return { v: 'law_' + node.name, d: null };
		      case 'neg':
		        var arg = visit(node.a, needDerivative);
		        return { v: save('-' + arg.v), d: arg.d === null ? null : save('-' + arg.d) };
		      case 'not':
		        // conditions have no derivative
		        return { v: save('!' + visit(node.a, needDerivative).v), d: null };
		      case 'bin': return binary(node, needDerivative);
		      case 'call': return call(node, needDerivative);
		    }
		  }

		  function binary(node, needDerivative) {
		    if (node.op === '^') return power(visit(node.a, needDerivative), node.b, needDerivative);
		    var a = visit(node.a, needDerivative), b = visit(node.b, needDerivative);
		    if (formula.isCondition(node)) return { v: save(a.v + ' ' + printer.operator(node.op) + ' ' + b.v), d: null };
		    if (node.reciprocal) {
		      // a / b with b fixed for the step: multiply by 1 / b
		      var reciprocal = node.reciprocal;
		      var product = save(a.v + ' * ' + reciprocal);
		      return { v: product, d: needDerivative && !constant(a) ? save(a.d + ' * ' + reciprocal) : null };
		    }
		    var v = save(a.v + ' ' + node.op + ' ' + b.v);
		    var result = node.op === '/' ? { v: v, d: null, dividend: a.v, divisor: b.v } : { v: v, d: null };
		    if (!needDerivative || (constant(a) && constant(b))) return result;
		    var d;
		    if (node.op === '+' || node.op === '-') {
		      if (constant(a)) d = node.op === '+' ? b.d : '-' + b.d;
		      else if (constant(b)) d = a.d;
		      else d = a.d + ' ' + node.op + ' ' + b.d;
		    } else if (node.op === '*') {
		      if (constant(a)) d = a.v + ' * ' + b.d;
		      else if (constant(b)) d = a.d + ' * ' + b.v;
		      else d = a.d + ' * ' + b.v + ' + ' + a.v + ' * ' + b.d;
		    } else {
		      // (a / b)' = a'/b - (a/b) * b'/b
		      if (constant(b)) d = a.d + ' / ' + b.v;
		      else if (constant(a)) d = '-' + v + ' * ' + b.d + ' / ' + b.v;
		      else d = '(' + a.d + ' - ' + v + ' * ' + b.d + ') / ' + b.v;
		    }
		    result.d = save(d);
		    return result;
		  }

		  function power(base, exponentNode, needDerivative) {
		    var exponent = visit(exponentNode, needDerivative);
		    var v, d = null;
		    if (constant(exponent)) {
		      var n = fold(exponentNode, dimension);
		      if (Number.isInteger(n) && n >= -4 && n <= 4) {
		        v = save(integerPower(base.v, n));
		      } else {
		        v = save(printer.call('pow', [base.v, exponent.v]));
		      }
		      if (needDerivative && !constant(base)) {
		        // (b^n)' = n * b^n / b * b'
		        d = save(exponent.v + ' * ' + v + ' / ' + base.v + ' * ' + base.d);
		      }
		      return { v: v, d: d };
		    }
		    v = save(printer.call('pow', [base.v, exponent.v]));
		    if (needDerivative) {
		      // (b^e)' = b^e * (e' * log(b) + e * b' / b)
		      var parts = [exponent.d + ' * ' + printer.call('log', [base.v])];
		      if (!constant(base)) parts.push(exponent.v + ' * ' + base.d + ' / ' + base.v);
		      d = save(v + ' * (' + parts.join(' + ') + ')');
		    }
		    return { v: v, d: d };
		  }

		  function integerPower(base, n) {
		    if (n === 0) return printer.number(1);
		    var product = [];
		    for (var i = 0; i < Math.abs(n); ++i) product.push(base);
		    var text = product.join(' * ');
		    return n > 0 ? '(' + text + ')' : printer.number(1) + ' / (' + text + ')';
		  }

		  function call(node, needDerivative) {
		    var args = node.args.map(function (arg) { return visit(arg, needDerivative); });
		    var a = args[0], b = args[1];
		    var v, d = null;
		    var allConstant = args.every(constant);
		    if (node.name === 'select') {
		      v = save(printer.choose(a.v, b.v, args[2].v));
		      if (needDerivative && !(constant(b) && constant(args[2]))) {
		        d = save(printer.choose(a.v, constant(b) ? printer.number(0) : b.d, constant(args[2]) ? printer.number(0) : args[2].d));
		      }
		      return { v: v, d: d };
		    }
		    if (node.name === 'pow') return power(a, node.args[1], needDerivative);
		    var builtIn = BUILT_IN_FUNCTIONS[node.name] ? formula.BUILTINS[node.name] : null;
		    if (builtIn) {
		      v = save(printer.call(node.name, args.map(function (arg) { return arg.v; })));
		      // functions without a derivative are steps: 0 almost everywhere
		      if (needDerivative && !allConstant && builtIn.derivative) d = save(builtIn.derivative(printer, args, v));
		      return { v: v, d: d };
		    }
		    v = save('lawFunctions.' + node.name + '.value(' + a.v + ')');
		    if (needDerivative && !allConstant) {
		      var custom = 'lawFunctions.' + node.name + '.derivative';
		      d = save('(' + custom + ' ? ' + custom + '(' + a.v + ') : 0) * ' + a.d);
		    }
		    return { v: v, d: d };
		  }
		}
		return parsedLaw.exports;
	}

	/**
	 * A repulsion law says how hard two unit charges push each other at distance `r`: F(r).
	 * Bodies `i` and `j` then push each other with `gravity * charge_i * charge_j * F(r)`.
	 *
	 * Laws are written as small expressions, e.g. `'exp(-r / L) / r^2'`, with named parameters
	 * (`L`) whose values are read once per step. The expression is compiled into the tree code,
	 * so a law costs about as much as the arithmetic it asks for. The trees need two numbers from
	 * a law, and both are generated from the expression:
	 *
	 *  - F(r) / r, which multiplies the vector between two bodies (or a body and a cell);
	 *  - (F(r) / r - F'(r)) / r^2, the dual tree's field gradient. F' is derived here.
	 *
	 * A law is written in the formula language (see formula.js): numbers, `r`, the law's parameters,
	 * the names every formula knows (`D`, `dt`, `unit`, ...), comparisons and `?:`, named values
	 * (`'u = r / L; exp(-u) / r^2'`), and the functions of formula.js except the vector ones.
	 * Lookup tables are passed in as `tables: { name: { from, to, values } }`; on the CPU, other
	 * functions can be passed in as `functions: { name: { value: fn, derivative: fn } }`.
	 */

	var hasRequiredRepulsionLaw;

	function requireRepulsionLaw () {
		if (hasRequiredRepulsionLaw) return repulsionLaw.exports;
		hasRequiredRepulsionLaw = 1;
		(function (module) {
			// Laws other than 1/r^2 are parsed and compiled by parsedLaw.js, which this file loads with the
			// first of them: default layouts never load the formula language or run its parser
			var createParsedLaw = null;

			module.exports = createRepulsionLaw;
			module.exports.parse = function (text) { return parsedLaws().parse(text); };
			module.exports.presets = {
			  /**
			   * The default: 1/r^2, as charges push in 3D.
			   */
			  inverseSquare: function () {
			    return { force: 'r^-2', isInverseSquare: true };
			  },
			  /**
			   * 1/r^p. With p = D - 1 this is how charges push in D dimensions (1/r in 2D).
			   */
			  power: function (p) {
			    return { force: 'r^-p', params: { p: p } };
			  },
			  /**
			   * 1/r^2 that fades out exponentially past `length`.
			   */
			  fading: function (length) {
			    return { force: 'exp(-r / L) / r^2', params: { L: length } };
			  }
			};

			var DEFAULT_KEY = 'r^-2';
			module.exports.DEFAULT_KEY = DEFAULT_KEY;

			/**
			 * Turns a law description into a compiled law. `spec` is a string (the force expression) or
			 * an object:
			 *  - `force`: the expression for F(r);
			 *  - `params`: { name: number or function(context) returning a number }, read every step with
			 *    the step context (see simulator.stepContext());
			 *  - `range`: a number, an expression of the parameters, or a function(context). Pairs and
			 *    tree cells farther apart than this are skipped;
			 *  - `tables`: lookup tables the expression can call, { name: {from, to, values} } (see
			 *    formula.createTable);
			 *  - `functions`: extra JS functions the expression can call (CPU only).
			 */
			function createRepulsionLaw(spec) {
			  if (!spec) spec = module.exports.presets.inverseSquare();
			  if (typeof spec === 'string') spec = { force: spec };
			  if (typeof spec.force !== 'string') throw new Error('A repulsion law needs a `force` expression of r');
			  if (isPlainDefault(spec)) return createDefaultLaw(spec);
			  return parsedLaws()(spec);
			}

			function parsedLaws() {
			  if (!createParsedLaw) createParsedLaw = requireParsedLaw();
			  return createParsedLaw;
			}

			function isPlainDefault(spec) {
			  return spec.force.replace(/\s+/g, '') === DEFAULT_KEY && spec.range === undefined &&
			    isEmpty(spec.params) && isEmpty(spec.tables) && isEmpty(spec.functions);
			}

			function isEmpty(object) {
			  return !object || Object.keys(object).length === 0;
			}

			/**
			 * 1/r^2 without parameters: the trees run their stock code, so nothing is parsed until something
			 * asks for the law's code (a GPU engine, say).
			 */
			function createDefaultLaw(spec) {
			  var parsed = null;
			  function full() {
			    if (!parsed) parsed = parsedLaws()(spec);
			    return parsed;
			  }
			  return {
			    key: DEFAULT_KEY + '|||',
			    tableNames: [],
			    isDefault: true,
			    hasRange: false,
			    paramNames: [],
			    functions: {},
			    spec: spec,
			    get values() { return full().values; },
			    // nothing to read: no parameters, no range
			    update: function () {},
			    describe: function () {
			      return { force: spec.force, params: [], builtIns: [], range: null, tables: [], functions: [], isDefault: true, key: DEFAULT_KEY + '|||' };
			    },
			    prologue: function (valuesName) { return full().prologue(valuesName); },
			    emit: function (printer, dimension, rName, k1Name, k2Name) { return full().emit(printer, dimension, rName, k1Name, k2Name); }
			  };
			} 
		} (repulsionLaw));
		return repulsionLaw.exports;
	}

	var spring;
	var hasRequiredSpring;

	function requireSpring () {
		if (hasRequiredSpring) return spring;
		hasRequiredSpring = 1;
		spring = Spring;

		/**
		 * Represents a physical spring. Spring connects two bodies, has rest length
		 * stiffness coefficient and optional weight.
		 *
		 * A spring of a simulator keeps its numbers in row `index` of the simulator's spring store.
		 * Any other spring (made with `new Spring()`, or removed from its simulator) keeps them in
		 * its own fields.
		 */
		function Spring(fromBody, toBody, length, springCoefficient, store, index) {
		  this.from = fromBody;
		  this.to = toBody;
		  this.store = store || null;
		  this.index = store ? index : -1;
		  // the store's flags for writes from outside the simulator (see initColumnStore.js)
		  this.writes = store && store.writes || null;
		  this.ownLength = length;
		  this.ownCoefficient = springCoefficient;
		}

		Object.defineProperties(Spring.prototype, {
		  length: {
		    get: function () { return this.store !== null ? this.store.length[this.index] : this.ownLength; },
		    set: function (value) {
		      if (this.store === null) {
		        this.ownLength = value;
		        return;
		      }
		      this.store.length[this.index] = value;
		      // engines with their own copy of the numbers see that the column changed
		      var writes = this.writes;
		      if (writes !== null) { writes.length = true; writes.any = true; }
		    },
		    enumerable: true
		  },
		  coefficient: {
		    get: function () { return this.store !== null ? this.store.coefficient[this.index] : this.ownCoefficient; },
		    set: function (value) {
		      if (this.store === null) {
		        this.ownCoefficient = value;
		        return;
		      }
		      this.store.coefficient[this.index] = value;
		      var writes = this.writes;
		      if (writes !== null) { writes.coefficient = true; writes.any = true; }
		    },
		    enumerable: true
		  }
		});

		/**
		 * Points this spring to row `index` of `store`. The numbers are not copied.
		 */
		Spring.prototype.moveTo = function (store, index) {
		  this.store = store;
		  this.index = index;
		  this.writes = store.writes || null;
		};

		/**
		 * Takes the numbers out of the store, into the spring's own fields.
		 */
		Spring.prototype.detach = function () {
		  if (this.store === null) return;
		  this.ownLength = this.store.length[this.index];
		  this.ownCoefficient = this.store.coefficient[this.index];
		  this.store = null;
		  this.index = -1;
		  this.writes = null;
		};

		Spring.prototype.toJSON = function () {
		  return { from: this.from, to: this.to, length: this.length, coefficient: this.coefficient };
		};
		return spring;
	}

	var getVariableName;
	var hasRequiredGetVariableName;

	function requireGetVariableName () {
		if (hasRequiredGetVariableName) return getVariableName;
		hasRequiredGetVariableName = 1;
		getVariableName = function getVariableName(index) {
		  if (index === 0) return 'x';
		  if (index === 1) return 'y';
		  if (index === 2) return 'z';
		  return 'c' + (index + 1);
		};
		return getVariableName;
	}

	var ngraph_merge;
	var hasRequiredNgraph_merge;

	function requireNgraph_merge () {
		if (hasRequiredNgraph_merge) return ngraph_merge;
		hasRequiredNgraph_merge = 1;
		ngraph_merge = merge;

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
		return ngraph_merge;
	}

	var ngraph_events;
	var hasRequiredNgraph_events;

	function requireNgraph_events () {
		if (hasRequiredNgraph_events) return ngraph_events;
		hasRequiredNgraph_events = 1;
		ngraph_events = function eventify(subject) {
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
		return ngraph_events;
	}

	var ngraph_random = {exports: {}};

	var hasRequiredNgraph_random;

	function requireNgraph_random () {
		if (hasRequiredNgraph_random) return ngraph_random.exports;
		hasRequiredNgraph_random = 1;
		ngraph_random.exports = random;

		// TODO: Deprecate?
		ngraph_random.exports.random = random,
		ngraph_random.exports.randomIterator = randomIterator;

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
		 * Returns a random real number from uniform distribution in [0, 1)
		 */
		Generator.prototype.uniform = nextDouble;

		/**
		 * Returns a random real number from a Gaussian distribution
		 * with 0 as a mean, and 1 as standard deviation u ~ N(0,1)
		 */
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

		/**
		 * See https://twitter.com/anvaka/status/1296182534150135808
		 */
		Generator.prototype.levy = levy;

		function levy() {
		  var beta = 3 / 2;
		  var sigma = Math.pow(
		      gamma( 1 + beta ) * Math.sin(Math.PI * beta / 2) / 
		        (gamma((1 + beta) / 2) * beta * Math.pow(2, (beta - 1) / 2)),
		      1/beta
		  );
		  return this.gaussian() * sigma / Math.pow(Math.abs(this.gaussian()), 1/beta);
		}

		// gamma function approximation
		function gamma(z) {
		  return Math.sqrt(2 * Math.PI / z) * Math.pow((1 / Math.E) * (z + 1 / (12 * z - 1 / (10 * z))), z);
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
		return ngraph_random.exports;
	}

	var createNeighborGrid_1;
	var hasRequiredCreateNeighborGrid;

	function requireCreateNeighborGrid () {
		if (hasRequiredCreateNeighborGrid) return createNeighborGrid_1;
		hasRequiredCreateNeighborGrid = 1;
		createNeighborGrid_1 = createNeighborGrid;

		// All 3^D offsets from a cell to its neighbors (and itself)
		function neighborOffsets(D) {
		  var count = Math.pow(3, D);
		  var offsets = new Int32Array(count * D);
		  for (var o = 0; o < count; ++o) {
		    var rest = o;
		    for (var k = 0; k < D; ++k) {
		      offsets[o * D + k] = (rest % 3) - 1;
		      rest = (rest / 3) | 0;
		    }
		  }
		  return offsets;
		}

		/**
		 * A uniform grid over the bodies of a store, in any number of dimensions, for finding bodies
		 * closer than some radius. Cells are hashed into a table, so empty space costs nothing.
		 *
		 * Build it with cells at least as large as the radius you will ask for: a query looks at the
		 * 3^D cells around a body (9 in 2D, 27 in 3D).
		 */
		function createNeighborGrid(dimensions) {
		  var D = dimensions;
		  var cellSize = 1;
		  var n = 0;
		  var pos = null;
		  var store = null;
		  // Cell coordinates of every body, and the table bucket of its cell:
		  var cells = new Int32Array(0), bucketOf = new Int32Array(0);
		  // Bodies sorted by bucket; bucket b holds sorted[bucketStart[b] .. bucketStart[b + 1] - 1]
		  var sorted = new Int32Array(0), bucketStart = new Int32Array(1);
		  var tableMask = 0;
		  var next = new Int32Array(0);
		  var neighborCell = new Int32Array(D);

		  var offsetCount = Math.pow(3, D);
		  var offsets = neighborOffsets(D);

		  var api = {
		    /**
		     * Sorts the bodies of `bodyStore` into cells of `size`.
		     */
		    build: build,

		    /**
		     * Calls `fn(i, j, r)` once for every pair of bodies closer than `radius`, with i < j.
		     * Bodies at the same point are a pair too, with r = 0.
		     */
		    forEachPair: forEachPair,

		    /**
		     * Calls `fn(j, r)` for every body `j` closer than `radius` to body `i`.
		     */
		    forEachNeighbor: forEachNeighbor,

		    /**
		     * For every pair closer than `radius`: `s = rule(i, j, r, store)` adds `s * (pos_i - pos_j)`
		     * to the force of `i` and the opposite to `j`. When not `symmetric`, the rule is asked for
		     * (i, j) and (j, i), and each answer moves only the first body. At r = 0 the force is `s`
		     * along an axis picked from i and j, and a non-finite `s` is skipped.
		     */
		    applyPairRule: applyPairRule,

		    cellSize: function () { return cellSize; },

		    /**
		     * The grid's arrays after build(), for generated loops over pairs (see formulaStages.js):
		     * bodies sorted by bucket, where each bucket starts, cell coordinates of every body, and the
		     * 3^D offsets to neighbor cells. Cells hash into buckets as in `hash()` below.
		     */
		    internals: function () {
		      return {
		        n: n, cells: cells, bucketStart: bucketStart, sorted: sorted, tableMask: tableMask,
		        offsets: offsets, offsetCount: offsetCount
		      };
		    }
		  };
		  return api;

		  function build(bodyStore, size) {
		    if (!(size > 0)) throw new Error('Grid cells need a positive size');
		    store = bodyStore;
		    pos = bodyStore.pos;
		    n = bodyStore.n;
		    cellSize = size;
		    if (cells.length < n * D) {
		      cells = new Int32Array(n * D);
		      bucketOf = new Int32Array(n);
		      sorted = new Int32Array(n);
		    }
		    var tableSize = 1;
		    while (tableSize < 2 * n) tableSize *= 2;
		    if (bucketStart.length !== tableSize + 1) bucketStart = new Int32Array(tableSize + 1);
		    else bucketStart.fill(0);
		    tableMask = tableSize - 1;

		    for (var i = 0; i < n; ++i) {
		      for (var k = 0; k < D; ++k) cells[i * D + k] = Math.floor(pos[i * D + k] / size);
		      var bucket = hash(cells, i * D);
		      bucketOf[i] = bucket;
		      bucketStart[bucket + 1] += 1;
		    }
		    for (var b = 0; b < tableSize; ++b) bucketStart[b + 1] += bucketStart[b];
		    // counting sort: `next` is the next free slot of each bucket
		    if (next.length !== tableSize) next = new Int32Array(tableSize);
		    next.set(bucketStart.subarray(0, tableSize));
		    for (i = 0; i < n; ++i) sorted[next[bucketOf[i]]++] = i;
		    return api;
		  }

		  function hash(coordinates, offset) {
		    var h = 0x165667b1;
		    for (var k = 0; k < D; ++k) {
		      h = Math.imul(h ^ coordinates[offset + k], 0x27d4eb2d);
		      h ^= h >>> 15;
		    }
		    return h & tableMask;
		  }

		  function sameCell(j) {
		    for (var k = 0; k < D; ++k) if (cells[j * D + k] !== neighborCell[k]) return false;
		    return true;
		  }

		  function distance(i, j) {
		    var r2 = 0;
		    for (var k = 0; k < D; ++k) {
		      var d = pos[i * D + k] - pos[j * D + k];
		      r2 += d * d;
		    }
		    return Math.sqrt(r2);
		  }

		  // Bucket of the o-th neighbor cell of body i (the cell itself is in `neighborCell`)
		  function neighborBucket(i, o) {
		    for (var k = 0; k < D; ++k) neighborCell[k] = cells[i * D + k] + offsets[o * D + k];
		    return hash(neighborCell, 0);
		  }

		  function forEachNeighbor(i, radius, fn) {
		    for (var o = 0; o < offsetCount; ++o) {
		      var bucket = neighborBucket(i, o);
		      for (var s = bucketStart[bucket], end = bucketStart[bucket + 1]; s < end; ++s) {
		        var j = sorted[s];
		        // a bucket can hold bodies of other cells too
		        if (j === i || !sameCell(j)) continue;
		        var r = distance(i, j);
		        if (r < radius) fn(j, r);
		      }
		    }
		  }

		  function forEachPair(radius, fn) {
		    for (var i = 0; i < n; ++i) {
		      for (var o = 0; o < offsetCount; ++o) {
		        var bucket = neighborBucket(i, o);
		        for (var s = bucketStart[bucket], end = bucketStart[bucket + 1]; s < end; ++s) {
		          var j = sorted[s];
		          // each pair once; a bucket can hold bodies of other cells too
		          if (j <= i || !sameCell(j)) continue;
		          var r = distance(i, j);
		          if (r < radius) fn(i, j, r);
		        }
		      }
		    }
		  }

		  function applyPairRule(radius, rule, symmetric) {
		    var force = store.force;
		    forEachPair(radius, function (i, j, r) {
		      var s = rule(i, j, r, store);
		      var t = symmetric ? s : rule(j, i, r, store);
		      if (!s && !t) return;
		      if (r === 0) {
		        // Same spot: push by s and t along an axis picked from i < j, as the dual tree does
		        var axis = (((i * 2654435761) ^ (j * 40503)) >>> 0) % D;
		        if (Number.isFinite(s)) force[i * D + axis] -= s;
		        if (Number.isFinite(t)) force[j * D + axis] += t;
		        return;
		      }
		      for (var k = 0; k < D; ++k) {
		        var d = pos[i * D + k] - pos[j * D + k];
		        force[i * D + k] += s * d;
		        force[j * D + k] -= t * d;
		      }
		    });
		  }
		}
		return createNeighborGrid_1;
	}

	var generateDualTree = {exports: {}};

	var hasRequiredGenerateDualTree;

	function requireGenerateDualTree () {
		if (hasRequiredGenerateDualTree) return generateDualTree.exports;
		hasRequiredGenerateDualTree = 1;
		generateDualTree.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return (function () {

		var D = 2;
		var JN = 3;
		var LEAF_SIZE = 16;
		var MAX_DEPTH = 60;
		var THETA_SCALE = 0.875;

		return function createDualTree(settings, law) {
		  // Values of the law's parameters, refreshed by the simulator every step:
		  law ? law.values : null;
		  law ? law.functions : null;
		  var n = 0;
		  // Body index of the k-th body in tree order, and the other way around:
		  var order, rank;
		  // Positions, masses and fields of bodies in tree order:
		  var pos, mass, field;
		  // Tree topology (grows as needed):
		  var nodeCapacity = 0, nodeCount = 0;
		  var nodeStart, nodeEnd, nodeSkip;
		  // Per node data:
		  var dataCapacity = 0;
		  var nodeMass, nodeCenter, nodeRadius, localField, localJacobian;

		  var cellMin = [], cellSide = new Float64Array(MAX_DEPTH + 2);
		  for (var depth = 0; depth < MAX_DEPTH + 2; ++depth) cellMin.push(new Float64Array(D));

		  var stack = new Int32Array(1 << 12);

		  return {
		    computeForces: computeForces
		  };

		  // Adds the push to the force of every body that is not pinned. `charge` is the column of
		  // charges (masses by default): how hard bodies push. `sensitivity` is how strongly they
		  // feel the push (the charge by default).
		  function computeForces(store, charge, sensitivity) {
		    if (store.n === 0) return;
		    charge = charge || store.mass;
		    sensitivity = sensitivity || charge;
		    buildTree(store, charge);
		    walk(settings.theta * THETA_SCALE);
		    pushDown();

		    var gravity = settings.gravity;
		    var force = store.force, pinned = store.pinned;
		    for (var i = 0; i < n; ++i) {
		      if (pinned[i]) continue;
		      var k = rank[i];
		      var g = gravity * sensitivity[i];
		      force[i * D + 0] += g * field[k * D + 0];
		      force[i * D + 1] += g * field[k * D + 1];
		    }
		  }

		  function ensureBodies(count) {
		    if (count === n && order) return;
		    n = count;
		    order = new Int32Array(n);
		    rank = new Int32Array(n);
		    for (var i = 0; i < n; ++i) order[i] = i;
		    pos = new Float64Array(n * D);
		    mass = new Float64Array(n);
		    field = new Float64Array(n * D);
		  }

		  function newNode(start, end) {
		    if (nodeCount === nodeCapacity) {
		      nodeCapacity = Math.max(1024, nodeCapacity * 2);
		      nodeStart = grow(Int32Array, nodeStart, nodeCapacity);
		      nodeEnd = grow(Int32Array, nodeEnd, nodeCapacity);
		      nodeSkip = grow(Int32Array, nodeSkip, nodeCapacity);
		    }
		    var node = nodeCount++;
		    nodeStart[node] = start;
		    nodeEnd[node] = end;
		    return node;
		  }

		  function ensureNodeData() {
		    if (nodeCount <= dataCapacity) return;
		    dataCapacity = nodeCapacity;
		    nodeMass = new Float64Array(dataCapacity);
		    nodeCenter = new Float64Array(dataCapacity * D);
		    nodeRadius = new Float64Array(dataCapacity);
		    localField = new Float64Array(dataCapacity * D);
		    localJacobian = new Float64Array(dataCapacity * JN);
		  }

		  function buildTree(store, bodyMass) {
		    ensureBodies(store.n);

		    var min0 = Infinity, max0 = -Infinity;
		    var min1 = Infinity, max1 = -Infinity;
		    // Bodies are read in their own order (it is cheaper to jump in the tree order arrays):
		    var bodyPos = store.pos;
		    for (var i = 0; i < n; ++i) rank[order[i]] = i;
		    for (var i = 0; i < n; ++i) {
		      var k = rank[i];
		      mass[k] = bodyMass[i];
		      var p0 = bodyPos[i * D + 0]; pos[k * D + 0] = p0;
		      var p1 = bodyPos[i * D + 1]; pos[k * D + 1] = p1;
		      if (p0 < min0) min0 = p0; if (p0 > max0) max0 = p0;
		      if (p1 < min1) min1 = p1; if (p1 > max1) max1 = p1;
		    }

		    var side = 0;
		    if (max0 - min0 > side) side = max0 - min0;
		    if (max1 - min1 > side) side = max1 - min1;
		    cellMin[0][0] = min0; cellMin[0][1] = min1;
		    cellSide[0] = side * (1 + 1e-9) + 1e-9;
		    nodeCount = 0;
		    buildNode(0, n, 0);
		    for (var i = 0; i < n; ++i) rank[order[i]] = i;
		    ensureNodeData();

		    // Children come after parents, so we can aggregate bottom up in reverse order:
		    for (var node = nodeCount - 1; node >= 0; --node) {
		      var m = 0, r = 0;
		      var s0 = 0; var s1 = 0;
		      if (nodeSkip[node] === node + 1) {
		        // Leaf: center of mass of its bodies, radius is the farthest body.
		        var start = nodeStart[node], end = nodeEnd[node];
		        for (var k = start; k < end; ++k) {
		          var w = mass[k];
		          m += w;
		          s0 += w * pos[k * D + 0]; s1 += w * pos[k * D + 1];
		        }
		        var weight = m;
		        if (m === 0) {
		          // No charge here (it pushes nobody): the plain middle of its bodies
		          s0 = 0; s1 = 0;
		          for (var k = start; k < end; ++k) { s0 += pos[k * D + 0]; s1 += pos[k * D + 1]; }
		          weight = end - start;
		        }
		        var c0 = s0 / weight; var c1 = s1 / weight;
		        var r2 = 0;
		        for (var k = start; k < end; ++k) {
		          var h0 = pos[k * D + 0] - c0; var h1 = pos[k * D + 1] - c1;
		          var q2 = h0 * h0 + h1 * h1;
		          if (q2 > r2) r2 = q2;
		        }
		        r = Math.sqrt(r2);
		      } else {
		        // Internal node: aggregate children, radius bounds every child's sphere.
		        var skip = nodeSkip[node];
		        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
		          var w = nodeMass[c];
		          m += w;
		          s0 += w * nodeCenter[c * D + 0]; s1 += w * nodeCenter[c * D + 1];
		        }
		        var weight = m;
		        if (m === 0) {
		          s0 = 0; s1 = 0;
		          weight = 0;
		          for (var c = node + 1; c < skip; c = nodeSkip[c]) {
		            var count = nodeEnd[c] - nodeStart[c];
		            weight += count;
		            s0 += count * nodeCenter[c * D + 0]; s1 += count * nodeCenter[c * D + 1];
		          }
		        }
		        var c0 = s0 / weight; var c1 = s1 / weight;
		        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
		          var h0 = nodeCenter[c * D + 0] - c0; var h1 = nodeCenter[c * D + 1] - c1;
		          var q = Math.sqrt(h0 * h0 + h1 * h1) + nodeRadius[c];
		          if (q > r) r = q;
		        }
		      }
		      nodeMass[node] = m;
		      nodeRadius[node] = r;
		      nodeCenter[node * D + 0] = c0; localField[node * D + 0] = 0;
		      nodeCenter[node * D + 1] = c1; localField[node * D + 1] = 0;
		      for (var t = 0; t < JN; ++t) localJacobian[node * JN + t] = 0;
		    }
		    for (var k = 0; k < n * D; ++k) field[k] = 0;
		  }

		  function buildNode(start, end, depth) {
		    var node = newNode(start, end);
		    if (end - start > LEAF_SIZE && depth < MAX_DEPTH) splitAxis(start, end, D - 1, 0, depth);
		    nodeSkip[node] = nodeCount;
		  }

		  // Splits bodies of a cell one axis at a time; each non empty orthant becomes a child.
		  function splitAxis(start, end, axis, bits, depth) {
		    if (axis < 0) {
		      var parentMin = cellMin[depth], childMin = cellMin[depth + 1], half = cellSide[depth] / 2;
		      childMin[0] = parentMin[0] + ((bits >> 0) & 1) * half;
		      childMin[1] = parentMin[1] + ((bits >> 1) & 1) * half;
		      cellSide[depth + 1] = half;
		      buildNode(start, end, depth + 1);
		      return;
		    }
		    var mid = partition(start, end, axis, cellMin[depth][axis] + cellSide[depth] / 2);
		    if (start < mid) splitAxis(start, mid, axis - 1, bits, depth);
		    if (mid < end) splitAxis(mid, end, axis - 1, bits | (1 << axis), depth);
		  }

		  // Bodies that are already on the correct side cost no swaps, so keeping the
		  // order from the previous step makes this cheap.
		  function partition(start, end, axis, pivot) {
		    var i = start, j = end - 1;
		    while (true) {
		      while (i <= j && pos[i * D + axis] < pivot) i++;
		      while (i <= j && pos[j * D + axis] >= pivot) j--;
		      if (i >= j) return i;
		      var t = order[i]; order[i] = order[j]; order[j] = t;
		      t = mass[i]; mass[i] = mass[j]; mass[j] = t;
		      var a = i * D, b = j * D;
		      t = pos[a + 0]; pos[a + 0] = pos[b + 0]; pos[b + 0] = t;
		      t = pos[a + 1]; pos[a + 1] = pos[b + 1]; pos[b + 1] = t;
		      i++; j--;
		    }
		  }

		  function push(a, b, top) {
		    if (top + 2 > stack.length) stack = grow(Int32Array, stack, stack.length * 2);
		    stack[top] = a;
		    stack[top + 1] = b;
		    return top + 2;
		  }

		  function walk(theta) {
		    var theta2 = theta * theta;
		    
		    var top = push(0, 0, 0);
		    while (top) {
		      top -= 2;
		      var a = stack[top], b = stack[top + 1];
		      var skipA = nodeSkip[a];
		      if (a === b) {
		        // A cell with itself: all pairs of its children, and each child with itself.
		        if (skipA === a + 1) {
		          direct(nodeStart[a], nodeEnd[a], 0, nodeEnd[a], true);
		          continue;
		        }
		        for (var c = a + 1; c < skipA; c = nodeSkip[c]) {
		          top = push(c, c, top);
		          for (var u = nodeSkip[c]; u < skipA; u = nodeSkip[u]) top = push(c, u, top);
		        }
		        continue;
		      }

		      var d0 = nodeCenter[b * D + 0] - nodeCenter[a * D + 0]; var d1 = nodeCenter[b * D + 1] - nodeCenter[a * D + 1];
		      var r2 = d0 * d0 + d1 * d1;
		      var radiusA = nodeRadius[a], radiusB = nodeRadius[b], radii = radiusA + radiusB;
		      
		      if (radii * radii < theta2 * r2) {
		        // Far enough: exchange fields of the two cells, both ways.
		        var inv2 = 1 / r2, inv3 = Math.sqrt(inv2) * inv2, inv5 = 3 * inv3 * inv2;
		        var massA = nodeMass[a], massB = nodeMass[b];
		        var fieldA = a * D, fieldB = b * D, jacobianA = a * JN, jacobianB = b * JN;
		        var k0 = d0 * inv3; localField[fieldA + 0] += massB * k0; localField[fieldB + 0] -= massA * k0;
		        var k1 = d1 * inv3; localField[fieldA + 1] += massB * k1; localField[fieldB + 1] -= massA * k1;
		        var j0 = d0 * d0 * inv5 - inv3; localJacobian[jacobianA + 0] += massB * j0; localJacobian[jacobianB + 0] += massA * j0;
		        var j1 = d0 * d1 * inv5; localJacobian[jacobianA + 1] += massB * j1; localJacobian[jacobianB + 1] += massA * j1;
		        var j2 = d1 * d1 * inv5 - inv3; localJacobian[jacobianA + 2] += massB * j2; localJacobian[jacobianB + 2] += massA * j2;
		        continue;
		      }

		      var skipB = nodeSkip[b], isLeafA = skipA === a + 1, isLeafB = skipB === b + 1;
		      if (isLeafA && isLeafB) {
		        direct(nodeStart[a], nodeEnd[a], nodeStart[b], nodeEnd[b], false);
		        continue;
		      }
		      // Too close: open the bigger cell.
		      if (!isLeafA && (isLeafB || radiusA >= radiusB)) {
		        for (var c = a + 1; c < skipA; c = nodeSkip[c]) top = push(c, b, top);
		      } else {
		        for (var c = b + 1; c < skipB; c = nodeSkip[c]) top = push(a, c, top);
		      }
		    }
		  }

		  // Exact interaction of bodies [startA, endA) with bodies [startB, endB), both ways.
		  function direct(startA, endA, startB, endB, sameCell) {
		    
		    for (var i = startA; i < endA; ++i) {
		      var x0 = pos[i * D + 0]; var x1 = pos[i * D + 1];
		      var massI = mass[i];
		      var a0 = 0; var a1 = 0;
		      for (var j = sameCell ? i + 1 : startB; j < endB; ++j) {
		        var d0 = pos[j * D + 0] - x0; var d1 = pos[j * D + 1] - x1;
		        var r2 = d0 * d0 + d1 * d1;
		        if (r2 === 0) {
		          // Two bodies at the same position: push them apart as if they were a unit
		          // distance apart, along an axis picked from their ids (deterministic and bounded).
		          var lo = order[i] < order[j] ? order[i] : order[j];
		          var hi = order[i] < order[j] ? order[j] : order[i];
		          var axis = (((lo * 2654435761) ^ (hi * 40503)) >>> 0) % D;
		          var sign = order[i] < order[j] ? 1 : -1;
		          d0 = axis === 0 ? sign : 0; d1 = axis === 1 ? sign : 0;
		          r2 = 1;
		        }
		        var inv3 = 1 / (r2 * Math.sqrt(r2));
		        var massJ = mass[j] * inv3, massII = massI * inv3;
		        a0 += massJ * d0; field[j * D + 0] -= massII * d0;
		        a1 += massJ * d1; field[j * D + 1] -= massII * d1;
		      }
		      field[i * D + 0] += a0; field[i * D + 1] += a1;
		    }
		  }

		  // Pushes local expansions from parents to children, and from leaves to bodies.
		  function pushDown() {
		    for (var node = 0; node < nodeCount; ++node) {
		      var offset = node * D, jacobian = node * JN, skip = nodeSkip[node];
		      var c0 = nodeCenter[offset + 0], g0 = localField[offset + 0]; var c1 = nodeCenter[offset + 1], g1 = localField[offset + 1];
		      var j0 = localJacobian[jacobian + 0]; var j1 = localJacobian[jacobian + 1]; var j2 = localJacobian[jacobian + 2];
		      if (skip === node + 1) {
		        for (var k = nodeStart[node], end = nodeEnd[node]; k < end; ++k) {
		          var h0 = pos[k * D + 0] - c0; var h1 = pos[k * D + 1] - c1;
		          field[k * D + 0] += g0 + j0 * h0 + j1 * h1;
		          field[k * D + 1] += g1 + j1 * h0 + j2 * h1;
		        }
		        continue;
		      }
		      for (var c = node + 1; c < skip; c = nodeSkip[c]) {
		        var childOffset = c * D, childJacobian = c * JN;
		        var h0 = nodeCenter[childOffset + 0] - c0; var h1 = nodeCenter[childOffset + 1] - c1;
		        localField[childOffset + 0] += g0 + j0 * h0 + j1 * h1;
		        localField[childOffset + 1] += g1 + j1 * h0 + j2 * h1;
		        localJacobian[childJacobian + 0] += j0; localJacobian[childJacobian + 1] += j1; localJacobian[childJacobian + 2] += j2;
		      }
		    }
		  }
		};

		function grow(ArrayType, array, size) {
		  var bigger = new ArrayType(size);
		  if (array) bigger.set(array.subarray(0, Math.min(array.length, size)));
		  return bigger;
		}

		})();
		};
		generateDualTree.exports.preGenerated = true;
		return generateDualTree.exports;
	}

	var generateFireIntegrator = {exports: {}};

	var hasRequiredGenerateFireIntegrator;

	function requireGenerateFireIntegrator () {
		if (hasRequiredGenerateFireIntegrator) return generateFireIntegrator.exports;
		hasRequiredGenerateFireIntegrator = 1;
		generateFireIntegrator.exports = function(dimension, option) {
		  if (typeof option === 'string' && option !== 'mass') throw new Error("This bundle has pre-generated code for the mass as inertia only. Use ngraph.forcelayout.js for another inertia column.");
		  if (Array.isArray(option)) throw new Error("This bundle has pre-generated trees that walk one charge at a time. Use ngraph.forcelayout.js for trees of several charges.");
		  if (option && typeof option === 'object' && !option.isDefault) throw new Error("This bundle has pre-generated code for the default repulsion law only. Use ngraph.forcelayout.js for other laws.");
		  return function anonymous(
		) {

		  var ALPHA_START = 0.1;
		  var ALPHA_DECAY = 0.99;
		  var MIN_POSITIVE_STEPS = 5;

		  var alpha = ALPHA_START;
		  var positiveSteps = 0;

		  return function integrate(store, timeStep, adaptiveTimeStepWeight, maxVelocity) {
		    var length = store.n;
		    if (length === 0) return 0;
		    var pos = store.pos, velocity = store.velocity, force = store.force, mass = store.mass;
		    var pinned = store.pinned, springCount = store.springCount, springLength = store.springLength;

		    var i, offset;
		    var power = 0, velocityNorm = 0, forceNorm = 0;
		    for (i = 0; i < length; ++i) {
		      if (pinned[i]) continue;
		      offset = i * 2;
		      var fx = force[offset], vx = velocity[offset];
		      var fy = force[offset + 1], vy = velocity[offset + 1];
		      power += fx * vx + fy * vy;
		      velocityNorm += vx * vx + vy * vy;
		      forceNorm += fx * fx + fy * fy;
		    }

		    if (power > 0) {
		      // Going downhill: steer velocities towards forces, and trust momentum more over time.
		      var keep = 1 - alpha;
		      var mix = forceNorm > 0 ? alpha * Math.sqrt(velocityNorm / forceNorm) : 0;
		      for (i = 0; i < length; ++i) {
		        if (pinned[i]) continue;
		        offset = i * 2;
		        velocity[offset] = keep * velocity[offset] + mix * force[offset];
		        velocity[offset + 1] = keep * velocity[offset + 1] + mix * force[offset + 1];
		      }
		      positiveSteps += 1;
		      if (positiveSteps > MIN_POSITIVE_STEPS) alpha *= ALPHA_DECAY;
		    } else {
		      // Going uphill (we overshot): stop everything and start from rest.
		      for (i = 0; i < length; ++i) {
		        if (pinned[i]) continue;
		        offset = i * 2;
		        velocity[offset] = 0;
		        velocity[offset + 1] = 0;
		      }
		      positiveSteps = 0;
		      alpha = ALPHA_START;
		    }

		    var dx = 0, tx = 0;
		    var dy = 0, ty = 0;
		    var maxV = maxVelocity > 0 ? maxVelocity : 1;

		    for (i = 0; i < length; ++i) {
		      if (pinned[i]) continue;

		      var dt = timeStep;
		      if (adaptiveTimeStepWeight && springCount[i]) {
		        dt = (adaptiveTimeStepWeight * springLength[i]/springCount[i]);
		      }

		      var coeff = dt / mass[i];
		      offset = i * 2;

		      velocity[offset] += coeff * force[offset];
		      velocity[offset + 1] += coeff * force[offset + 1];
		      var ux = velocity[offset];
		      var uy = velocity[offset + 1];
		      var v = Math.sqrt(ux * ux + uy * uy);

		      if (v > maxV) {
		        velocity[offset] = maxV * ux / v;
		        velocity[offset + 1] = maxV * uy / v;
		      }

		      dx = dt * velocity[offset];
		      dy = dt * velocity[offset + 1];

		      pos[offset] += dx;
		      pos[offset + 1] += dy;

		      tx += Math.abs(dx);
		      ty += Math.abs(dy);
		    }

		    return (tx * tx + ty * ty)/length;
		  };

		};
		};
		generateFireIntegrator.exports.preGenerated = true;
		return generateFireIntegrator.exports;
	}

	var formulaStages = {};

	/**
	 * Stages written as formulas (see formula.js). The simulator owns the loops; a formula says what
	 * happens to one body, one link, or one pair of close bodies:
	 *
	 *  - node: runs for every body. It reads the body's columns by name (`mass`, `pos`, `force`,
	 *    ...) and assigns to them;
	 *  - link: runs for every link (spring). It reads the distance `r`, the link's `length` and
	 *    `coefficient` (with the simulator's settings filled in), the link's own columns, and the
	 *    columns of its two bodies as `name_i` (the `from` body) and `name_j` (the `to` body). It
	 *    sets `pull`, the force that pulls the two bodies together (negative pushes them apart);
	 *  - pair: runs for every pair of bodies closer than a radius. It reads `r` and `name_i`,
	 *    `name_j`, and sets `push`, the force that pushes the two apart;
	 *  - sum: adds up a formula over bodies or links (or takes its min or max), for all of them or
	 *    per group, so that later formulas can read the result by name (`total`, or `total[group]`
	 *    for a sum per group).
	 *
	 * What a write means depends on its operator, the same way on every engine: `x = v` replaces
	 * the value, `x += v` and `x -= v` add onto the value `x` has when the stage starts. Link and pair
	 * formulas add into body columns as `name_i += ...`; a stage's `startAtZero: ['name']` sets such
	 * columns to 0 first, so they hold what this pass added up. Formulas never move bodies (`pos` is
	 * read only), and a link or pair formula cannot read a column it adds into, as it would see a
	 * partial sum.
	 *
	 * Every formula can read its `params` (numbers, or functions of the step context read once per
	 * step), its lookup `tables`, the sums added before it, and the names every formula knows (see
	 * formula.js). With `when` (an expression of `step`, the params and the settings) the stage runs
	 * only on the steps where it holds. Each stage is compiled into one function with the formula
	 * inside its loop, so it costs what the formula's arithmetic costs.
	 *
	 * A stage also describes itself as plain data (see simulator.program()): what it reads and
	 * writes, how, its params and options.
	 */

	var hasRequiredFormulaStages;

	function requireFormulaStages () {
		if (hasRequiredFormulaStages) return formulaStages;
		hasRequiredFormulaStages = 1;
		var formula = requireFormula();
		var BUILT_IN_VALUES = formula.BUILT_IN_VALUES;

		formulaStages.node = createNodeStage;
		formulaStages.link = createLinkStage;
		formulaStages.pair = createPairStage;
		formulaStages.sum = createSumStage;
		formulaStages.gate = createGate;
		formulaStages.describeValue = describeValue;

		// Generated code is shared by stages with the same code
		var codeCache = Object.create(null);

		// Columns of a spring store that link formulas see through `length` and `coefficient`, or not
		var LINK_BUILT_INS = { from: true, to: true, length: true, coefficient: true };
		// Body columns that formulas do not see: counters of the adaptive time step (`springLength` in a
		// formula is the setting; `degree` counts springs)
		var HIDDEN_BODY_COLUMNS = { springCount: true, springLength: true };
		// Columns that `startAtZero` never zeroes: the state of bodies
		var STATE_COLUMNS = { pos: true, velocity: true, force: true };
		var WRITE_MODES = { '=': 'set', '+=': 'add', '-=': 'add', '*=': 'scale', '/=': 'scale' };
		// A line of generated code that stands for the stage's prologue (its params, columns, sums and
		// tables), for stages whose loops are functions of their own. Such code makes its functions once
		// and returns the stage's run.
		var PROLOGUE = '$prologue$';

		/**
		 * Formula for every body. Returns {run, describe, values}.
		 */
		function createNodeStage(simulator, name, options) {
		  var context = createContext(simulator, name, options);
		  var scope = context.scope(bodyNames(context, '$i', '$o', 'any'));
		  var compiled = compileFormula(options.formula, scope, name);
		  var lines = context.prologue();
		  lines.push('var $n = $store.n;');
		  lines.push('for (var $i = 0; $i < $n; ++$i) {');
		  lines.push('  var $o = $i * ' + context.D + ';');
		  indent(compiled.lines, lines);
		  lines.push('}');
		  return context.stage(lines, 'node', 'nodes');
		}

		/**
		 * Formula for every link. With `options.replace === 'springs'` it takes the place of the stock
		 * springs: it then also keeps the counters of the adaptive time step.
		 */
		function createLinkStage(simulator, name, options) {
		  var context = createContext(simulator, name, options);
		  var D = context.D;
		  var accumulated = [];
		  var names = linkNames(context, accumulated);
		  var setsPull = false, readsDistance = false;
		  names.r.onRead = function () { readsDistance = true; };
		  var writePull = assignment('$pull');
		  names.pull = { type: 'num', code: '$pull', write: function (op, value) { setsPull = true; return writePull(op, value); } };
		  var compiled = compileFormula(options.formula, context.scope(names), name);
		  context.checkAccumulators(accumulated);
		  var startAtZero = context.startAtZero(accumulated);
		  var withStats = options.replace === 'springs';
		  // In place of the springs it keeps their counters, which need the distance too
		  var pulls = setsPull || withStats;
		  if (pulls || readsDistance) readEnds(context, 'pos');

		  var lines;
		  if (pulls) {
		    lines = [];
		    pullingLinks(lines, compiled.lines, D, withStats, startAtZero.map(function (column) { return zeroColumn(context, column); }));
		    context.wrote({ space: 'nodes', column: 'force', mode: 'add', via: 'pull' });
		  } else {
		    // No pull: no force to add, and r only when the formula reads it (0 for ends on one spot)
		    lines = context.prologue();
		    zeroColumns(context, startAtZero, lines);
		    lines.push('var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;');
		    if (readsDistance) lines.push('var $pos = $store.pos;');
		    lines.push('var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;');
		    lines.push('for (var $s = $springs.n - 1; $s >= 0; --$s) {');
		    lines.push('  var $i = $from[$s], $j = $to[$s];');
		    lines.push('  var $oi = $i * ' + D + ', $oj = $j * ' + D + ';');
		    lines.push('  var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];');
		    if (readsDistance) {
		      lines.push('  ' + each(D, function (k) { return 'var $d' + k + ' = $pos[$oj + ' + k + '] - $pos[$oi + ' + k + '];'; }));
		      lines.push('  var $r = Math.sqrt(' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ');');
		    }
		    lines.push('  var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;');
		    indent(compiled.lines, lines);
		    lines.push('}');
		  }
		  return context.stage(lines, 'link', 'links', {
		    replace: options.replace === undefined ? null : options.replace,
		    counters: false,
		    startAtZero: startAtZero
		  }, function (info) {
		    // In place of the stock springs it keeps their counters while the adaptive time step is on
		    if (!withStats || simulator.settings.adaptiveTimeStepWeight === 0) return;
		    info.args.counters = true;
		    info.writes.push({ space: 'nodes', column: 'springCount', mode: 'add' }, { space: 'nodes', column: 'springLength', mode: 'add' });
		  });
		}

		// The loop of a link stage that pulls. It has the same order and the same arithmetic as the stock
		// springs, so that the formula of the stock springs gives the same numbers, and like them it has
		// no calls: a link whose ends are on the same spot ends the loop, $sameSpot pulls it along a
		// random direction, and the loop goes on from the next link. The counters of the adaptive time
		// step have a loop of their own. The code makes these functions once and returns the stage's run
		// (see PROLOGUE).
		function pullingLinks(lines, formulaLines, D, withStats, zeroLines) {
		  var arrays = [
		    PROLOGUE,
		    'var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;',
		    'var $pos = $store.pos, $force = $store.force;',
		    'var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;'
		  ];
		  if (withStats) arrays.push('var $springCount = $store.springCount, $springLength = $store.springLength;');
		  var link = [
		    'var $i = $from[$s], $j = $to[$s];',
		    'var $oi = $i * ' + D + ', $oj = $j * ' + D + ';',
		    'var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];'
		  ];
		  var pull = ['var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;', 'var $pull = 0;']
		    .concat(formulaLines)
		    .concat([
		      'var $k = $pull / $r;',
		      each(D, function (k) { return '$force[$oi + ' + k + '] += $k * $d' + k + ';'; }),
		      each(D, function (k) { return '$force[$oj + ' + k + '] -= $k * $d' + k + ';'; })
		    ]);
		  var counters = '$springCount[$i] += 1; $springLength[$i] += $r; $springCount[$j] += 1; $springLength[$j] += $r;';
		  var args = '$s, $store, $springs, $values, $sums, $tables';
		  var loop = function (functionName, stats) {
		    lines.push('function ' + functionName + '(' + args + ') {');
		    indent(arrays, lines);
		    lines.push('  while ($s--) {');
		    indent(link, lines, '    ');
		    lines.push('    ' + each(D, function (k) { return 'var $d' + k + ' = $pos[$oj + ' + k + '] - $pos[$oi + ' + k + '];'; }));
		    lines.push('    var $r = Math.sqrt(' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ');');
		    lines.push('    if ($r === 0) return $s;');
		    indent(pull, lines, '    ');
		    if (stats) lines.push('    ' + counters);
		    lines.push('  }');
		    lines.push('  return -1;');
		    lines.push('}');
		  };
		  loop('$links', false);
		  if (withStats) loop('$linksWithCounters', true);
		  lines.push('// ends on the same spot: pull along a random direction');
		  lines.push('function $sameSpot(' + args + ', $random) {');
		  indent(arrays, lines);
		  indent(link, lines);
		  lines.push('  ' + each(D, function (k) { return 'var $d' + k + ' = ($random.nextDouble() - 0.5) / 50;'; }));
		  lines.push('  var $r = Math.sqrt(' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ');');
		  indent(pull, lines);
		  if (withStats) lines.push('  if ($values.$stats) { ' + counters + ' }');
		  lines.push('}');
		  lines.push('return function ($store, $springs, $values, $sums, $tables, $random) {');
		  indent(zeroLines, lines);
		  lines.push('  var $loop = ' + (withStats ? '$values.$stats ? $linksWithCounters : $links' : '$links') + ';');
		  lines.push('  for (var $s = $springs.n; ($s = $loop(' + args + ')) >= 0;) $sameSpot(' + args + ', $random);');
		  lines.push('};');
		}

		/**
		 * Formula for every pair of bodies closer than `options.radius` (a number, an expression of the
		 * params, or a function of the step context; 0 or less skips the pass). With `options.symmetric`
		 * (the default) it runs once per pair, i being the lower row, and both bodies get the push.
		 * Otherwise it runs for (i, j) and for (j, i), and each run pushes only body i (and can only add
		 * into `name_i`).
		 *
		 * Bodies on the same spot (r = 0) have no direction to push along: such a pair pushes nothing
		 * and adds nothing up.
		 */
		function createPairStage(simulator, name, options) {
		  if (options.radius === undefined) throw new Error('Pair formula ' + name + ' needs a radius');
		  var context = createContext(simulator, name, options);
		  var D = context.D;
		  var symmetric = options.symmetric !== false;
		  var accumulated = [];
		  var forward = pairNames(context, accumulated, symmetric, false);
		  var compiled = compileFormula(options.formula, context.scope(forward), name);
		  var backward = null;
		  if (!symmetric) {
		    // The same formula with the roles of i and j swapped
		    backward = compileFormula(options.formula, context.scope(pairNames(context, [], false, true), true), name);
		  }
		  context.checkAccumulators(accumulated);
		  var startAtZero = context.startAtZero(accumulated);
		  readEnds(context, 'pos');
		  var radius = context.global(options.radius, 'radius');

		  var lines = context.prologue();
		  lines.push('var $radius = $values.$radius;');
		  // Most candidates are farther than the radius: a test of the squared distance spares them the
		  // root. Its small margin makes it drop only pairs the exact test drops, so it changes nothing;
		  // near underflow the margin would not hold, and there is no such test
		  lines.push('var $reach2 = $radius * $radius * (1 + 1e-12);');
		  lines.push('if (!($reach2 > 1e-290)) $reach2 = Infinity;');
		  zeroColumns(context, startAtZero, lines);
		  lines.push('if (!($radius > 0)) return;');
		  lines.push('var $grid = $simulator.neighbors($radius).internals();');
		  lines.push('var $n = $grid.n, $cells = $grid.cells, $bucketStart = $grid.bucketStart, $sorted = $grid.sorted;');
		  lines.push('var $tableMask = $grid.tableMask, $offsets = $grid.offsets, $offsetCount = $grid.offsetCount;');
		  lines.push('var $pos = $store.pos, $force = $store.force;');
		  // Walks pairs as the grid's forEachPair does: each pair once, i < j
		  lines.push('for (var $i = 0; $i < $n; ++$i) {');
		  lines.push('  var $oi = $i * ' + D + ';');
		  lines.push('  ' + each(D, function (k) { return 'var $c' + k + ' = $cells[$oi + ' + k + '];'; }));
		  lines.push('  ' + each(D, function (k) { return 'var $x' + k + ' = $pos[$oi + ' + k + '];'; }));
		  lines.push('  for (var $cell = 0; $cell < $offsetCount; ++$cell) {');
		  lines.push('    ' + each(D, function (k) { return 'var $m' + k + ' = $c' + k + ' + $offsets[$cell * ' + D + ' + ' + k + '];'; }));
		  lines.push('    var $hash = 0x165667b1;');
		  for (var axis = 0; axis < D; ++axis) lines.push('    $hash = Math.imul($hash ^ $m' + axis + ', 0x27d4eb2d); $hash ^= $hash >>> 15;');
		  lines.push('    var $bucket = $hash & $tableMask;');
		  lines.push('    for (var $at = $bucketStart[$bucket], $end = $bucketStart[$bucket + 1]; $at < $end; ++$at) {');
		  lines.push('      var $j = $sorted[$at];');
		  lines.push('      if ($j <= $i) continue;');
		  lines.push('      var $oj = $j * ' + D + ';');
		  lines.push('      // a bucket can hold bodies of other cells too');
		  lines.push('      if (' + each(D, function (k) { return '$cells[$oj + ' + k + '] !== $m' + k; }, ' || ') + ') continue;');
		  lines.push('      ' + each(D, function (k) { return 'var $d' + k + ' = $x' + k + ' - $pos[$oj + ' + k + '];'; }));
		  lines.push('      var $r2 = ' + each(D, function (k) { return '$d' + k + ' * $d' + k; }, ' + ') + ';');
		  lines.push('      if (!($r2 <= $reach2)) continue;');
		  lines.push('      var $r = Math.sqrt($r2);');
		  lines.push('      // bodies on the same spot have no direction to push along');
		  lines.push('      if (!($r < $radius) || $r === 0) continue;');
		  lines.push('      var $push = 0;');
		  lines.push('      {');
		  indent(compiled.lines, lines, '        ');
		  lines.push('      }');
		  lines.push('      var $pushI = $push;');
		  if (backward) {
		    lines.push('      $push = 0;');
		    lines.push('      {');
		    indent(backward.lines, lines, '        ');
		    lines.push('      }');
		  }
		  lines.push('      var $pushJ = $push;');
		  lines.push('      if (!$pushI && !$pushJ) continue;');
		  lines.push(symmetric ? '      var $si = $pushI / $r, $sj = $si;' : '      var $si = $pushI / $r, $sj = $pushJ / $r;');
		  lines.push('      ' + each(D, function (k) { return '$force[$oi + ' + k + '] += $si * $d' + k + ';'; }));
		  lines.push('      ' + each(D, function (k) { return '$force[$oj + ' + k + '] -= $sj * $d' + k + ';'; }));
		  lines.push('    }');
		  lines.push('  }');
		  lines.push('}');
		  context.wrote({ space: 'nodes', column: 'force', mode: 'add', via: 'push' });
		  return context.stage(lines, 'pair', 'pairs', {
		    radius: describeValue(radius),
		    symmetric: symmetric,
		    startAtZero: startAtZero
		  });
		}

		/**
		 * A sum over bodies (or links, with `options.over === 'links'`) of the formula's value, a number
		 * or a vector. `options.reduce` is 'sum' (the default), 'min' or 'max'. With `options.group`
		 * (the name of a body or link column) there is one result per group id 0, 1, 2, ...; rows whose
		 * group is negative are left out. Later formulas read the result as `name`, or `name[group]`
		 * (0 for a group that has no rows). A sum gated off by `when` keeps its last result.
		 *
		 * Returns {run, describe, values, result}: `result` holds `value` (an array of 1 or D numbers),
		 * and with groups `groups` (count * width numbers) and `count`.
		 */
		function createSumStage(simulator, name, options) {
		  var context = createContext(simulator, name, options);
		  var D = context.D;
		  var overLinks = options.over === 'links';
		  if (options.over !== undefined && options.over !== 'nodes' && !overLinks) throw new Error('Sum ' + name + ' should be over nodes or links');
		  var reduce = options.reduce || 'sum';
		  if (reduce !== 'sum' && reduce !== 'min' && reduce !== 'max') throw new Error('Sum ' + name + ': reduce should be sum, min or max');
		  var names = overLinks ? linkNames(context, null) : bodyNames(context, '$i', '$o', null);
		  var compiled = compileFormula(options.formula, context.scope(names), name);
		  if (overLinks) readEnds(context, 'pos');
		  var value = compiled.result;
		  if (!value) throw new Error('Sum ' + name + ' should end with the expression to add up');
		  var width = value.type === 'vec' ? D : 1;
		  var codes = value.codes || [value.code];
		  var start = reduce === 'sum' ? '0' : reduce === 'min' ? 'Infinity' : '-Infinity';
		  var group = options.group;
		  if (group !== undefined) {
		    var groupStore = overLinks ? simulator.springStore : simulator.store;
		    if (!groupStore.has(group)) throw new Error('Sum ' + name + ': no ' + (overLinks ? 'link' : 'body') + ' column named ' + group);
		    context.read({ space: overLinks ? 'links' : 'nodes', column: group, rows: 'own' });
		  }
		  var result = { width: width, grouped: group !== undefined, value: new Float64Array(width), groups: new Float64Array(0), count: 0 };
		  result.value.fill(+start);

		  var lines = context.prologue();
		  lines.push('var $result = $sums[' + JSON.stringify(name) + '];');
		  if (overLinks) {
		    lines.push('var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;');
		    lines.push('var $pos = $store.pos;');
		    lines.push('var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;');
		  }
		  var rows = overLinks ? '$springs.n' : '$store.n';
		  var row = overLinks ? '$s' : '$i';
		  var pad = '  ';
		  if (group !== undefined) {
		    // Groups are counted in the pass that adds up, starting from the last step's count (groups
		    // are host data and rarely change). A group id at or past it counts them all, then adds up
		    // again.
		    lines.push('var $group = ' + (overLinks ? '$springs' : '$store') + '[' + JSON.stringify(group) + '];');
		    lines.push('var $count = $result.count, $max = -1, ' + row + ';');
		    lines.push('for (;;) {');
		    lines.push('  var $acc = $result.resize($count);');
		    lines.push('  $max = -1;');
		    pad = '    ';
		  } else {
		    for (var slot = 0; slot < width; ++slot) lines.push('var $acc' + slot + ' = ' + start + ';');
		  }
		  var loop = [];
		  loop.push('for (' + row + ' = 0; ' + row + ' < ' + rows + '; ++' + row + ') {');
		  if (group !== undefined) {
		    loop.push('  var $g = $group[' + row + '];');
		    loop.push('  if (!($g >= 0)) continue;');
		    loop.push('  $g = Math.floor($g);');
		    loop.push('  if ($g >= $count) break;');
		    loop.push('  if ($g > $max) $max = $g;');
		    if (width > 1) loop.push('  $g *= ' + width + ';');
		  }
		  if (overLinks) {
		    loop.push('  var $i = $from[$s], $j = $to[$s];');
		    loop.push('  var $oi = $i * ' + D + ', $oj = $j * ' + D + ';');
		    loop.push('  var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];');
		    loop.push('  var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;');
		    loop.push('  var $r = Math.sqrt(' + each(D, function (k) { return '($pos[$oj + ' + k + '] - $pos[$oi + ' + k + ']) * ($pos[$oj + ' + k + '] - $pos[$oi + ' + k + '])'; }, ' + ') + ');');
		  } else {
		    loop.push('  var $o = $i * ' + D + ';');
		  }
		  indent(compiled.lines, loop);
		  codes.forEach(function (code, k) {
		    var target = group !== undefined ? '$acc[$g + ' + k + ']' : '$acc' + k;
		    loop.push('  ' + target + ' = ' + (reduce === 'sum' ? target + ' + ' + code : 'Math.' + reduce + '(' + target + ', ' + code + ')') + ';');
		  });
		  loop.push('}');
		  if (group === undefined) {
		    loop[0] = loop[0].replace('for (', 'for (var ');
		    loop.forEach(function (line) { lines.push(line); });
		    for (slot = 0; slot < width; ++slot) lines.push('$result.value[' + slot + '] = $acc' + slot + ';');
		  } else {
		    indent(loop, lines, pad.slice(2));
		    lines.push('  if (' + row + ' === ' + rows + ') break;');
		    lines.push('  $count = 0;');
		    lines.push('  for (' + row + ' = 0; ' + row + ' < ' + rows + '; ++' + row + ') if ($group[' + row + '] >= $count) $count = Math.floor($group[' + row + ']) + 1;');
		    lines.push('}');
		    lines.push('$result.count = $max + 1;');
		  }
		  result.resize = function (count) {
		    if (result.groups.length < count * width) result.groups = new Float64Array(Math.max(count, 2 * result.count) * width);
		    result.count = count;
		    result.groups.fill(+start, 0, count * width);
		    return result.groups;
		  };
		  var stage = context.stage(lines, 'sum', overLinks ? 'links' : 'nodes', {
		    over: overLinks ? 'links' : 'nodes', reduce: reduce, group: group === undefined ? null : group, width: width
		  });
		  stage.result = result;
		  return stage;
		}

		/**
		 * A `when` for any stage: an expression of `step`, the settings and `params` (an object of
		 * numbers and functions of the step context), or a function of the step context. Returns
		 * {test(context), describe()}.
		 */
		function createGate(simulator, name, when, params) {
		  if (typeof when === 'function') {
		    return {
		      test: when,
		      describe: function () { return { kind: 'host' }; }
		    };
		  }
		  var context = createContext(simulator, name, { formula: '', params: params });
		  var gate = context.when(when);
		  return {
		    test: function (forStep) { return gate.test(forStep); },
		    describe: function () { return { kind: 'expression', text: when }; }
		  };
		}

		// A `when` that reads only built in values (step, settings) gives every stage that has it the same
		// answer: each distinct one is tested once per step of a simulator, and its stages share the
		// answer. Tests for other step contexts (engines asking about steps they queue) are not kept.
		var sharedGates = new WeakMap();
		function sharedGate(simulator, text, builtIns, holds) {
		  var gates = sharedGates.get(simulator);
		  if (!gates) sharedGates.set(simulator, gates = Object.create(null));
		  if (gates[text]) return gates[text];
		  var values = {}, lastContext = null, lastStep = -1, lastAnswer = false;
		  var gate = gates[text] = {
		    params: [],
		    builtIns: builtIns,
		    test: function (forStep, target) {
		      var step = forStep.iteration();
		      if (target === undefined && forStep === lastContext && step === lastStep) return lastAnswer;
		      var into = target || values;
		      for (var i = 0; i < builtIns.length; ++i) into['$' + builtIns[i]] = BUILT_IN_VALUES[builtIns[i]](forStep);
		      var answer = holds(into);
		      if (target === undefined) {
		        lastContext = forStep;
		        lastStep = step;
		        lastAnswer = answer;
		      }
		      return answer;
		    }
		  };
		  return gate;
		}

		// ---------------------------------------------------------------------------------------
		// What names mean
		// ---------------------------------------------------------------------------------------

		/**
		 * Columns of the body in row `row` (offset `offset` for vectors). `writes` is 'any' for node
		 * formulas (they assign to their own body), or null (read only).
		 */
		function bodyNames(context, row, offset, writes) {
		  var names = Object.create(null);
		  context.store.names().forEach(function (column) {
		    if (HIDDEN_BODY_COLUMNS[column]) return;
		    var described = bodyColumn(context, column, row, offset, writes ? null : [], null);
		    if (described) names[column] = described;
		  });
		  return names;
		}

		// `end` is null for the body's own row (node formulas), or 'i' or 'j' (link and pair formulas)
		function bodyColumn(context, column, row, offset, ops, end) {
		  var size = columnSize(context.store, column);
		  var array = '$c_' + column;
		  var target;
		  var described;
		  if (size === 1) {
		    target = array + '[' + row + ']';
		    described = { type: 'num', code: target };
		  } else if (size === context.D) {
		    target = [];
		    for (var k = 0; k < size; ++k) target.push(array + '[' + offset + ' + ' + k + ']');
		    described = { type: 'vec', codes: target };
		  } else {
		    return null;
		  }
		  described.write = ops && ops.length === 0 ? null : recordedAssignment(context, target, { space: 'nodes', column: column, end: end });
		  if (ops) described.ops = ops;
		  // marked as used when the formula names it
		  described.column = column;
		  described.end = end;
		  return described;
		}

		// Names of link formulas (and sums over links). `accumulated` collects the body columns that the
		// formula adds into (null: read only).
		function linkNames(context, accumulated) {
		  var names = Object.create(null);
		  names.r = { type: 'num', code: '$r' };
		  names.length = { type: 'num', code: '$length', builtInColumn: 'length' };
		  names.coefficient = { type: 'num', code: '$coefficient', builtInColumn: 'coefficient' };
		  if (accumulated) {
		    // A link formula sets its link's own spring with =; negative lengths and coefficients <= 0
		    // still mean the settings
		    names.length.ops = names.coefficient.ops = ['='];
		    names.length.write = ownSpring(context, 'length', '$restLength', '$length', '$restLength[$s] < 0 ? $defaultLength : $restLength[$s]');
		    names.coefficient.write = ownSpring(context, 'coefficient', '$springCoefficient', '$coefficient',
		      '$springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient');
		  }
		  context.springStore.names().forEach(function (column) {
		    if (LINK_BUILT_INS[column]) return;
		    if (names[column]) throw new Error('Link column ' + column + ' has the name of a value link formulas know');
		    var array = '$l_' + column;
		    names[column] = {
		      type: 'num', code: array + '[$s]', linkColumn: column,
		      write: accumulated ? recordedAssignment(context, array + '[$s]', { space: 'links', column: column, end: null }) : null
		    };
		  });
		  addEnds(context, names, accumulated, true, false);
		  return names;
		}

		function pairNames(context, accumulated, symmetric, swapped) {
		  var names = Object.create(null);
		  names.r = { type: 'num', code: '$r' };
		  names.push = { type: 'num', code: '$push', write: assignment('$push') };
		  addEnds(context, names, accumulated, symmetric, swapped);
		  return names;
		}

		// `name_i` and `name_j` for every body column. Formulas can add into them, and both ends only
		// when `bothEnds`.
		function addEnds(context, names, accumulated, bothEnds, swapped) {
		  var ends = swapped ? [['_i', '$j', '$oj'], ['_j', '$i', '$oi']] : [['_i', '$i', '$oi'], ['_j', '$j', '$oj']];
		  context.store.names().forEach(function (column) {
		    if (HIDDEN_BODY_COLUMNS[column]) return;
		    ends.forEach(function (end) {
		      var canAdd = accumulated && (end[0] === '_i' || bothEnds);
		      var described = bodyColumn(context, column, end[1], end[2], canAdd ? ['+=', '-='] : [], end[0].slice(1));
		      if (!described) return;
		      if (canAdd) {
		        var write = described.write;
		        described.write = function (op, value) {
		          if (accumulated.indexOf(column) < 0) accumulated.push(column);
		          return write(op, value);
		        };
		      }
		      names[column + end[0]] = described;
		    });
		  });
		}

		function assignment(target) {
		  var targets = Array.isArray(target) ? target : [target];
		  return function (op, value) {
		    var codes = value.codes || [value.code];
		    return targets.map(function (code, k) { return code + ' ' + op + ' ' + codes[k] + ';'; });
		  };
		}

		// An assignment to a column, recorded for the stage's description. Formulas never move bodies.
		function recordedAssignment(context, target, write) {
		  var lines = assignment(target);
		  return function (op, value) {
		    if (write.space === 'nodes' && write.column === 'pos') {
		      throw new Error('pos is read only in formulas: only integrate and host steps move bodies');
		    }
		    context.wrote({ space: write.space, column: write.column, mode: WRITE_MODES[op], op: op, end: write.end });
		    return lines(op, value);
		  };
		}

		// Writes a link's own spring setting, and what the rest of the formula reads as it
		function ownSpring(context, column, array, local, fallback) {
		  return function (op, value) {
		    context.wrote({ space: 'links', column: column, mode: WRITE_MODES[op], op: op });
		    return [array + '[$s] = ' + value.code + ';', local + ' = ' + fallback + ';'];
		  };
		}

		// Every link and pair stage reads the positions of both ends, for r
		function readEnds(context, column) {
		  context.read({ space: 'nodes', column: column, rows: 'other', end: 'i' });
		  context.read({ space: 'nodes', column: column, rows: 'other', end: 'j' });
		}

		function columnSize(store, column) {
		  return store.sizeOf(column);
		}

		// Columns listed in a stage's `startAtZero` start each pass at 0
		function zeroColumns(context, columns, lines) {
		  columns.forEach(function (column) { lines.push(zeroColumn(context, column)); });
		}

		function zeroColumn(context, column) {
		  return '$store[' + JSON.stringify(column) + '].fill(0, 0, $store.n * ' + columnSize(context.store, column) + ');';
		}

		/**
		 * A value of a stage as plain data: {kind: 'number', value}, {kind: 'expression', text}, or
		 * {kind: 'host'} for a function (it has no body here; engines call it with the step context).
		 */
		function describeValue(spec) {
		  if (typeof spec === 'number') return { kind: 'number', value: spec };
		  if (typeof spec === 'string') return { kind: 'expression', text: spec };
		  return { kind: 'host' };
		}

		// ---------------------------------------------------------------------------------------
		// What every formula stage shares
		// ---------------------------------------------------------------------------------------

		function createContext(simulator, name, options) {
		  if (!options || typeof options.formula !== 'string') throw new Error('Formula stage ' + name + ' needs a `formula` string');
		  var store = simulator.store;
		  var D = store.D;
		  // Parameter functions get the step context, never the simulator: other engines call them
		  // for steps they queue
		  var stepContext = simulator.stepContext();
		  var params = options.params || {};
		  var paramNames = Object.keys(params);
		  var tables = {};
		  Object.keys(options.tables || {}).forEach(function (table) {
		    tables[table] = formula.createTable(table, options.tables[table]);
		  });
		  var sums = simulator.sums();
		  paramNames.forEach(function (param) {
		    if (!/^[A-Za-z_]\w*$/.test(param)) throw new Error('Bad parameter name ' + param + ' in ' + name);
		    if (store.has(param) || tables[param] || sums[param] || BUILT_IN_VALUES[param] || param === 'D' || param === 'pi') {
		      throw new Error('Parameter ' + param + ' of ' + name + ' has the name of a column, table, sum or built in value');
		    }
		  });

		  var prologue = [];
		  var usedParams = Object.create(null), usedBuiltIns = [], usedSums = Object.create(null);
		  var usedColumns = Object.create(null), usedLinkColumns = Object.create(null);
		  var globals = [];
		  var values = {};
		  var gate = null;
		  var reads = [], writes = [];
		  var context = {
		    D: D,
		    store: store,
		    springStore: simulator.springStore,
		    // `swapped`: the scope of a one-sided pair formula with i and j swapped, which reads the same
		    // columns as the formula itself
		    scope: function (names, swapped) {
		      return { D: D, name: function (key, assigned) { return resolve(names, key, assigned || swapped); } };
		    },
		    // A value of the stage read once per step, as `$values.$<key>`: a number, a function of the
		    // step context, or an expression of the params and built in values
		    global: function (spec, key) {
		      if (typeof spec === 'number' || typeof spec === 'function') {
		        globals.push({ key: key, read: spec });
		        return spec;
		      }
		      if (typeof spec !== 'string') throw new Error(key + ' of ' + name + ' should be a number, a function or an expression');
		      var compiled = compileFormula(spec, { D: D, name: globalName }, name);
		      if (!compiled.result || compiled.result.type !== 'num') throw new Error(key + ' of ' + name + ' should be an expression giving a number');
		      var code = compiled.lines.join('\n') + '\nreturn ' + compiled.result.code + ';';
		      globals.push({ key: key, read: new Function('$values', code), compiled: true });
		      return spec;
		    },
		    // A condition of the params and built in values, as a function of the values
		    // A `when` condition of the params and built in values. Its test(step context, target)
		    // reads only the params and built in values the condition names, into target, so a gated off
		    // stage reads nothing else.
		    when: function (spec) {
		      if (typeof spec !== 'string') throw new Error('when of ' + name + ' should be an expression or a function of the step context');
		      var gateParams = [], gateBuiltIns = [];
		      var compiled = compileFormula(spec, { D: D, condition: true, name: function (key) {
		        if (Object.prototype.hasOwnProperty.call(params, key)) {
		          if (gateParams.indexOf(key) < 0) gateParams.push(key);
		          return { type: 'num', code: '$values[' + JSON.stringify(key) + ']' };
		        }
		        if (BUILT_IN_VALUES[key]) {
		          if (gateBuiltIns.indexOf(key) < 0) gateBuiltIns.push(key);
		          return { type: 'num', code: '$values.$' + key };
		        }
		      } }, name);
		      if (!compiled.result) throw new Error('when of ' + name + ' should end with a condition, such as step > 100');
		      var holds = new Function('$values', compiled.lines.join('\n') + '\nreturn ' + compiled.result.code + ';');
		      if (gateParams.length === 0) return sharedGate(simulator, spec, gateBuiltIns, holds);
		      var own = {};
		      return {
		        params: gateParams,
		        builtIns: gateBuiltIns,
		        test: function (forStep, target) {
		          target = target || own;
		          for (var i = 0; i < gateParams.length; ++i) {
		            var param = params[gateParams[i]];
		            target[gateParams[i]] = typeof param === 'function' ? param(forStep) : param;
		          }
		          for (i = 0; i < gateBuiltIns.length; ++i) target['$' + gateBuiltIns[i]] = BUILT_IN_VALUES[gateBuiltIns[i]](forStep);
		          return holds(target);
		        }
		      };
		    },
		    read: function (entry) { addOnce(reads, entry); },
		    wrote: function (entry) { addOnce(writes, entry); },
		    // A link or pair formula sees a partial sum of what it adds into on the CPU and the value at
		    // the stage's start elsewhere, so it cannot read it. `pull` and `push` add into `force`.
		    checkAccumulators: function (accumulated) {
		      reads.forEach(function (entry) {
		        if (entry.space !== 'nodes') return;
		        if (entry.column === 'force' || accumulated.indexOf(entry.column) >= 0) {
		          throw new Error(name + ' reads ' + entry.column + '_' + entry.end + ', which it adds into; a link or pair formula ' +
		            'sees no partial sums (read it in a later stage)');
		        }
		      });
		    },
		    startAtZero: function (accumulated) {
		      var columns = options.startAtZero || [];
		      if (!Array.isArray(columns)) throw new Error('startAtZero of ' + name + ' should be a list of column names');
		      columns.forEach(function (column) {
		        if (STATE_COLUMNS[column]) throw new Error('startAtZero of ' + name + ' cannot zero ' + column + ': it holds the state of bodies');
		        if (accumulated.indexOf(column) < 0) throw new Error('startAtZero of ' + name + ' names ' + column + ', which the formula does not add into');
		      });
		      writes.forEach(function (entry) {
		        if (entry.mode === 'add' && entry.space === 'nodes' && columns.indexOf(entry.column) >= 0) entry.startAtZero = true;
		      });
		      return columns.slice();
		    },
		    prologue: function () {
		      // Filled in by stage(), after the formulas named what they use
		      return prologue;
		    },
		    // `describeNow(info)` adds what depends on the settings at the time of describe()
		    stage: function (body, shape, space, args, describeNow) {
		      // A gated stage tests its gate first, and on its off steps reads nothing else
		      var hostGate = typeof options.when === 'function' ? options.when : null;
		      if (options.when !== undefined && !hostGate) gate = context.when(options.when);
		      var gateParams = gate ? gate.params : [];
		      var otherParams = paramNames.filter(function (param) { return gateParams.indexOf(param) < 0; });
		      var builtIns = usedBuiltIns.concat((gate ? gate.builtIns : []).filter(function (b) { return usedBuiltIns.indexOf(b) < 0; }));
		      var head = valueLines();
		      Object.keys(usedColumns).forEach(function (column) {
		        head.push('var $c_' + column + ' = $store[' + JSON.stringify(column) + '];');
		        head.push('if (!$c_' + column + ') throw new Error(' + JSON.stringify(name + ' reads the body column ' + column + ', which is gone') + ');');
		      });
		      Object.keys(usedLinkColumns).forEach(function (column) {
		        head.push('var $l_' + column + ' = $springs[' + JSON.stringify(column) + '];');
		        head.push('if (!$l_' + column + ') throw new Error(' + JSON.stringify(name + ' reads the link column ' + column + ', which is gone') + ');');
		      });
		      Object.keys(tables).forEach(function (table) {
		        head.push('var $T_' + table + ' = $tables[' + JSON.stringify(table) + '];');
		      });
		      // The prologue goes where the stage marked it, or first
		      var marked = body.some(function (line) { return line.indexOf(PROLOGUE) >= 0; });
		      var code;
		      if (marked) {
		        var expanded = [];
		        body.forEach(function (line) {
		          var at = line.indexOf(PROLOGUE);
		          if (at < 0) expanded.push(line);
		          else head.forEach(function (headLine) { expanded.push(line.slice(0, at) + headLine); });
		        });
		        code = expanded.join('\n');
		      } else {
		        prologue.unshift.apply(prologue, head);
		        code = body.join('\n');
		      }
		      var run = codeCache[code];
		      if (!run) {
		        run = codeCache[code] = marked ? new Function(code)() :
		          new Function('$store', '$springs', '$values', '$sums', '$tables', '$random', '$simulator', code);
		      }
		      var whenDescription = hostGate ? { kind: 'host' } : gate ? { kind: 'expression', text: options.when } : null;
		      // A gate of its own params reads them into the stage's values; a shared one keeps its answer
		      var holds = hostGate ? hostGate : gate ? (gate.params.length ? function (forStep) { return gate.test(forStep, values); } :
		        function (forStep) { return gate.test(forStep); }) : null;
		      return {
		        run: function (bodyStore, sim) {
		          if (holds !== null && !holds(stepContext)) return;
		          readValues(stepContext, values, otherParams);
		          run(bodyStore, sim.springStore, values, sim.sums(), tables, sim.random, sim);
		        },
		        // What the stage would read this step, for engines that queue steps: the params and
		        // `radius` as numbers, and whether `when` holds
		        values: function (otherContext) {
		          var own = {};
		          var on = hostGate ? !!hostGate(otherContext) : gate ? !!gate.test(otherContext, own) : true;
		          readValues(otherContext, own, otherParams);
		          var out = { params: {}, when: on, builtIns: {} };
		          paramNames.forEach(function (param) { out.params[param] = own[param]; });
		          builtIns.forEach(function (builtIn) { out.builtIns[builtIn] = own['$' + builtIn]; });
		          if (own.$radius !== undefined) out.radius = own.$radius;
		          return out;
		        },
		        describe: function () {
		          var info = {
		            shape: shape,
		            builtIn: null,
		            space: space,
		            when: whenDescription,
		            formula: options.formula,
		            reads: reads.map(copy),
		            writes: writes.map(copy),
		            params: paramNames.map(function (param) {
		              var described = describeValue(params[param]);
		              described.name = param;
		              return described;
		            }),
		            builtIns: builtIns.slice(),
		            tables: Object.keys(tables).map(function (table) {
		              return { name: table, from: tables[table].from, to: tables[table].to, values: tables[table].values };
		            }),
		            sums: Object.keys(usedSums),
		            args: Object.assign({}, args),
		            code: code
		          };
		          if (describeNow) describeNow(info);
		          return info;
		        }
		      };
		    }
		  };
		  return context;

		  function valueLines() {
		    var lines = [];
		    Object.keys(usedParams).forEach(function (param) { lines.push('var $p_' + param + ' = $values[' + JSON.stringify(param) + '];'); });
		    usedBuiltIns.forEach(function (builtIn) { lines.push('var $b_' + builtIn + ' = $values.$' + builtIn + ';'); });
		    Object.keys(usedSums).forEach(function (sum) {
		      lines.push('var $sum_' + sum + ' = $sums[' + JSON.stringify(sum) + '];');
		      lines.push('if (!$sum_' + sum + ') throw new Error(' + JSON.stringify(name + ' reads the sum ' + sum + ', which is gone') + ');');
		      if (sums[sum].grouped) lines.push('var $g_' + sum + ' = $sum_' + sum + '.groups, $gn_' + sum + ' = $sum_' + sum + '.count;');
		      else lines.push('var $s_' + sum + ' = $sum_' + sum + '.value;');
		    });
		    return lines;
		  }

		  // Names of values read once per step: params and built in values
		  function globalName(key) {
		    if (Object.prototype.hasOwnProperty.call(params, key)) return { type: 'num', code: '$values[' + JSON.stringify(key) + ']' };
		    if (BUILT_IN_VALUES[key]) {
		      if (usedBuiltIns.indexOf(key) < 0) usedBuiltIns.push(key);
		      return { type: 'num', code: '$values.$' + key };
		    }
		  }

		  function resolve(names, key, assigned) {
		    var named = names[key];
		    if (named && (BUILT_IN_VALUES[key] || key === 'D' || key === 'pi')) {
		      throw new Error(name + ': ' + key + ' is both a column and a built in value; give the column another name');
		    }
		    if (named) {
		      if (!assigned && named.onRead) named.onRead();
		      if (named.column) {
		        usedColumns[named.column] = true;
		        if (!assigned) context.read({ space: 'nodes', column: named.column, rows: named.end ? 'other' : 'own', end: named.end });
		      }
		      if (named.linkColumn) {
		        usedLinkColumns[named.linkColumn] = true;
		        if (!assigned) context.read({ space: 'links', column: named.linkColumn, rows: 'own' });
		      }
		      if (named.builtInColumn && !assigned) context.read({ space: 'links', column: named.builtInColumn, rows: 'own' });
		      return named;
		    }
		    if (Object.prototype.hasOwnProperty.call(params, key)) {
		      usedParams[key] = true;
		      return { type: 'num', code: '$p_' + key };
		    }
		    if (tables[key]) return { call: function (args) { return '$T_' + key + '.value(' + args[0] + ')'; } };
		    var sum = sums[key];
		    if (sum) {
		      usedSums[key] = true;
		      var width = sum.width;
		      if (sum.grouped) {
		        return {
		          index: function (indexCode) {
		            var read = function (k) {
		              return '(' + indexCode + ' >= 0 && ' + indexCode + ' < $gn_' + key + ' ? $g_' + key + '[Math.floor(' + indexCode + ') * ' + width + ' + ' + k + '] : 0)';
		            };
		            if (width === 1) return { type: 'num', code: read(0) };
		            var codes = [];
		            for (var k = 0; k < width; ++k) codes.push(read(k));
		            return { type: 'vec', codes: codes };
		          }
		        };
		      }
		      if (width === 1) return { type: 'num', code: '$s_' + key + '[0]' };
		      var vector = [];
		      for (var c = 0; c < width; ++c) vector.push('$s_' + key + '[' + c + ']');
		      return { type: 'vec', codes: vector };
		    }
		    if (BUILT_IN_VALUES[key]) {
		      if (usedBuiltIns.indexOf(key) < 0) usedBuiltIns.push(key);
		      return { type: 'num', code: '$b_' + key };
		    }
		  }

		  // Reads the numbers of the step of `forStep` (a step context) into `target`: the params
		  // `names` (all by default), built in values, settings and globals
		  function readValues(forStep, target, names) {
		    names = names || paramNames;
		    for (var i = 0; i < names.length; ++i) {
		      var param = params[names[i]];
		      target[names[i]] = typeof param === 'function' ? param(forStep) : param;
		    }
		    for (i = 0; i < usedBuiltIns.length; ++i) target['$' + usedBuiltIns[i]] = BUILT_IN_VALUES[usedBuiltIns[i]](forStep);
		    var settings = formula.liveSettings(forStep);
		    target.$springLength = settings.springLength;
		    target.$springCoefficient = settings.springCoefficient;
		    target.$stats = settings.adaptiveTimeStepWeight !== 0;
		    for (i = 0; i < globals.length; ++i) {
		      var global = globals[i];
		      target['$' + global.key] = typeof global.read === 'number' ? global.read :
		        global.compiled ? global.read(target) : global.read(forStep);
		    }
		  }
		}

		function addOnce(list, entry) {
		  var key = JSON.stringify(entry);
		  for (var i = 0; i < list.length; ++i) if (JSON.stringify(list[i]) === key) return;
		  list.push(entry);
		}

		function copy(entry) {
		  var out = {};
		  Object.keys(entry).forEach(function (key) { if (entry[key] !== null && entry[key] !== undefined) out[key] = entry[key]; });
		  return out;
		}

		function compileFormula(text, scope, name) {
		  try {
		    return formula.compile(text, scope);
		  } catch (e) {
		    e.message = name + ': ' + e.message;
		    throw e;
		  }
		}

		function indent(source, target, prefix) {
		  prefix = prefix || '  ';
		  source.forEach(function (line) { target.push(prefix + line); });
		}

		function each(D, fn, join) {
		  var parts = [];
		  for (var k = 0; k < D; ++k) parts.push(fn(k));
		  return parts.join(join === undefined ? ' ' : join);
		}
		return formulaStages;
	}

	var describeProgram = {};

	/**
	 * The step as plain data (simulator.program()), and what an engine can run of it
	 * (simulator.plan()). createPhysicsSimulator.js loads this file with the first description it
	 * makes, so layouts that are only stepped never load it.
	 */

	var hasRequiredDescribeProgram;

	function requireDescribeProgram () {
		if (hasRequiredDescribeProgram) return describeProgram;
		hasRequiredDescribeProgram = 1;
		describeProgram.clear = describeClear;
		describeProgram.drag = describeDrag;
		describeProgram.springs = describeSprings;
		describeProgram.integrate = describeIntegrate;
		describeProgram.tree = describeTree;
		describeProgram.stage = describeStage;
		describeProgram.builtInValues = builtInValues;
		describeProgram.program = buildProgram;
		describeProgram.plan = plan;

		function describeClear() {
		  return {
		    shape: 'node', builtIn: 'clear', space: 'nodes',
		    reads: [ownRow('pinned')],
		    writes: [set('force'), set('springCount'), set('springLength')],
		    formula: 'force = pinned != 0 ? force : 0 * force'
		  };
		}

		function describeDrag(settings) {
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

		function describeSprings(settings) {
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

		function describeIntegrate(settings) {
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

		// A tree stage: `member` is its charge in a walk (see the simulator's walk groups), `walk` the
		// walk it is part of
		function describeTree(builtIn, treeLaw, member, settings, walk) {
		  var charge = member.charge(), sensitivity = member.sensitivity();
		  // every body is pushed from its own position by the others
		  var reads = [ownRow('pos'), otherRows('pos', null), otherRows(charge, null), ownRow(sensitivity), ownRow('pinned')];
		  return {
		    shape: 'tree', builtIn: builtIn, space: 'tree',
		    reads: reads,
		    writes: [add('force')],
		    builtIns: ['gravity', 'theta'],
		    args: {
		      channels: [{ law: treeLaw.describe(), charge: charge, sensitivity: sensitivity, centroid: member.centroid }],
		      theta: settings.theta, nbody: settings.nbody,
		      walk: walk
		    }
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

		// Built in values a stage reads, as formulas see them (unit with its floor, step, ...). The
		// names are kept per stage, so a description is built once
		function builtInValues(stage, context) {
		  if (!stage.builtInNames) stage.builtInNames = describeStage(stage).builtIns;
		  var out = {};
		  if (stage.builtInNames.length === 0) return out;
		  var BUILT_IN_VALUES = requireFormula().BUILT_IN_VALUES;
		  stage.builtInNames.forEach(function (name) { out[name] = BUILT_IN_VALUES[name](context); });
		  return out;
		}

		function describeStage(stage) {
		  var described = stage.describe ? stage.describe() : { shape: 'js' };
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

		// `simulator` is what the simulator knows: {version, dimensions, nodes, links, settings, store,
		// springStore, stages, listenerCounts}
		function buildProgram(simulator) {
		  var described = simulator.stages.map(describeStage);
		  var dimensions = simulator.dimensions;
		  var program = {
		    version: simulator.version,
		    dims: dimensions,
		    spaces: { nodes: simulator.nodes, links: simulator.links },
		    settings: {},
		    columns: {
		      nodes: describeColumns(simulator.store, 'nodes', described, dimensions),
		      links: describeColumns(simulator.springStore, 'links', described, dimensions)
		    },
		    tables: [],
		    sums: [],
		    stages: described,
		    hostSteps: [],
		    listeners: {}
		  };
		  var settings = simulator.settings;
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
		  var listenerCounts = simulator.listenerCounts;
		  Object.keys(listenerCounts).forEach(function (event) {
		    if (listenerCounts[event].length) program.listeners[event] = listenerCounts[event].length;
		  });
		  return program;
		}

		function describeColumns(columnStore, space, described, dimensions) {
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

		// See simulator.plan(): `program` is the simulator's program(), `simulator` its public API
		function plan(program, backend, simulator) {
		  var reasons = [], warnings = programWarnings(program);
		  if (!backend) warnings = warnings.concat(cpuWarnings(program));
		  if (backend && backend.checkProgram) {
		    var whole = backend.checkProgram(program, simulator) || [];
		    if (Array.isArray(whole)) whole = { reasons: whole };
		    reasons = reasons.concat(whole.reasons || []);
		    warnings = warnings.concat(whole.warnings || []);
		  }
		  var planned = program.stages.map(function (stage) {
		    var verdict = backend ? backend.check(stage, program, simulator) : { runs: true, how: cpuHow(stage) };
		    var entry = { stage: stage.name, shape: stage.shape, runs: verdict.runs };
		    if (verdict.runs) entry.how = verdict.how;
		    else entry.reason = verdict.reason;
		    if (stage.shape === 'host') entry.cost = hostCost(stage, program);
		    (verdict.warnings || []).forEach(function (warning) { warnings.push(stage.name + ': ' + warning); });
		    return entry;
		  });
		  planned.forEach(function (entry) { if (!entry.runs) reasons.push(entry.stage + ': ' + entry.reason); });
		  return { backend: backend ? backend.name : 'cpu', runs: reasons.length === 0, reasons: reasons, warnings: warnings, stages: planned };
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

		// nbody picks the tree of a pass alone; passes walked together walk one quad tree, so a step
		// with them costs several times a stock dual tree step
		function cpuWarnings(program) {
		  if (program.settings.nbody !== 'dualtree') return [];
		  return program.stages.filter(function (stage) {
		    var walk = stage.args && stage.args.walk;
		    return walk && walk.index === 0 && walk.charges > 1;
		  }).map(function (stage) {
		    return "nbody 'dualtree' does not apply to tree passes walked together (" + stage.args.walk.stages.join(', ') + '): they walk one quad tree';
		  });
		}

		// What a host step costs an engine with its own copy of the numbers
		function hostCost(stage, program) {
		  var numbers = 0, names = [];
		  stage.reads.forEach(function (read) {
		    var columns = program.columns[read.space] || [];
		    for (var i = 0; i < columns.length; ++i) {
		      if (columns[i].name !== read.column) continue;
		      numbers += columns[i].width === 'D' ? program.dims : columns[i].width;
		      names.push(read.column);
		    }
		  });
		  var reads = names.length ? 'reads ' + names.join(', ') + ' (' + numbers + '·n numbers)' : 'reads nothing';
		  var writes = stage.writes.length ? 'writes ' + stage.writes.map(function (w) { return w.column; }).join(', ') : 'writes nothing';
		  return (stage.when ? 'on the steps where `when` holds: ' : 'every step: ') + reads + ', ' + writes;
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
		return describeProgram;
	}

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

	var createPhysicsSimulator_1;
	var hasRequiredCreatePhysicsSimulator;

	function requireCreatePhysicsSimulator () {
		if (hasRequiredCreatePhysicsSimulator) return createPhysicsSimulator_1;
		hasRequiredCreatePhysicsSimulator = 1;
		createPhysicsSimulator_1 = createPhysicsSimulator;

		var generateCreateBodyFunction = requireGenerateCreateBody();
		var generateQuadTreeFunction = requireGenerateQuadTree();
		var generateBoundsFunction = requireGenerateBounds();
		var generateCreateDragForceFunction = requireGenerateCreateDragForce();
		var generateCreateSpringForceFunction = requireGenerateCreateSpringForce();
		var generateIntegratorFunction = requireGenerateIntegrator();
		var generateClearForcesFunction = requireGenerateClearForces();
		var createBodyStore = requireCreateBodyStore();
		var createSpringStore = requireCreateSpringStore();
		var createRepulsionLaw = requireRepulsionLaw();
		// Loaded when first used, so layouts that don't use them don't load them: formula stages, the
		// dual tree, FIRE, the neighbour grid, and the step's description (program(), plan())
		var formulaStages, describer;
		var Spring = requireSpring();
		var copyBody = createBodyStore.copyBody;
		var getVariableName = requireGetVariableName();

		var dimensionalCache = {};
		// Trees are generated for every dimension and law:
		var treeCache = {};
		// Trees that walk several charges at once, by dimension, laws and centre rules (see walkTree())
		var walkTreeCache = {};

		// The length unit never goes below this, so ideas can divide by it
		var MIN_UNIT = 1e-3;

		function createPhysicsSimulator(settings) {
		  var merge = requireNgraph_merge();
		  var eventify = requireNgraph_events();
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
		      createFireIntegrator: null, // made with the first FIRE layout
		      clearForces: generateClearForcesFunction(dimensions),
		    };
		    dimensionalCache[dimensions] = factory;
		  }

		  var Body = factory.Body;
		  var fireIntegrate; // created on demand, since FIRE keeps state between steps

		  var random = requireNgraph_random().random(42);
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
		  addStage('clear', clearStage, null, describeBuiltIn('clear'));
		  var repulsion = addStage('repulsion', repulsionStage, null, function () {
		    return describeTree('repulsion', law, repulsion.tree);
		  });
		  repulsion.law = function () { return law; };
		  repulsion.tree = treeMember('repulsion', repulsionStage, function () { return settings.repulsionCharge; },
		    function () { return settings.repulsionSensitivity || settings.repulsionCharge; }, repulsion.law, 'own');
		  addStage('drag', dragStage, null, describeBuiltIn('drag'));
		  addStage('springs', springStage, null, describeBuiltIn('springs'));
		  addStage('integrate', integrateStage, null, describeBuiltIn('integrate'));

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
		      stage.builtInNames = null;
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
		      var builtIn = requireFormula().BUILT_IN_VALUES;
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
		     * charge each, so a pass costs much less than a walk of its own. nbody 'dualtree' does not
		     * apply to such a walk (plan() warns).
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
		     * What stage `name` reads in the step of `context` (the current step without one), as numbers
		     * of its own for every call: `params`, `radius`, whether its `when` holds, the `builtIns` it
		     * reads ({step, unit, ...}, as formulas see them), and for repulsion passes the law's numbers
		     * (`lawValues`: its parameters, `$h<n>` for the parts computed once per step, `$range`). Engines
		     * that queue steps call it once per queued step. `law` is the compiled law, for generating
		     * code: its own `values` are live and change with the next call.
		     */
		    stageValues: function (name, context) {
		      var stage = getStage(name);
		      if (!stage) throw new Error('No stage named ' + name);
		      context = context || stepContext;
		      var out = stage.values ? stage.values(context) : { when: true };
		      if (stage.gate) out.when = !!stage.gate.test(context);
		      if (!out.builtIns) out.builtIns = getDescriber().builtInValues(stage, context);
		      if (stage.law) {
		        var stageLaw = stage.law();
		        stageLaw.update(context);
		        out.law = stageLaw;
		        out.lawValues = Object.assign({}, stageLaw.values);
		      }
		      return out;
		    },

		    /**
		     * The version program() would report, without building it: engines check it before each
		     * batch and re-plan when it grows.
		     */
		    programVersion: function () {
		      return structureVersion + store.columnsVersion + springStore.columnsVersion;
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
		      return getDescriber().plan(buildProgram(), backend, publicApi);
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
		      structureVersion += 1;
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
		          structureVersion += 1;
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
		      if (!neighborGrid) neighborGrid = requireCreateNeighborGrid()(dimensions);
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
		      gate: null, law: null, values: null, builtInNames: null
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
		  // The step as plain data (program(); the descriptions are in describeProgram.js)
		  // ---------------------------------------------------------------------------------------

		  // A built in stage's description, made when first asked for
		  function describeBuiltIn(name) {
		    return function () { return getDescriber()[name](settings); };
		  }

		  function describeTree(builtIn, treeLaw, member) {
		    return getDescriber().tree(builtIn, treeLaw, member, settings, describeWalk(member));
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

		  function hostColumn(column) {
		    if (typeof column === 'string') return { space: 'nodes', column: column };
		    return { space: column.space || 'nodes', column: column.column };
		  }

		  function buildProgram() {
		    return getDescriber().program({
		      version: publicApi.programVersion(), dimensions: dimensions, nodes: bodies.length, links: springs.length,
		      settings: settings, store: store, springStore: springStore, stages: stages, listenerCounts: listenerCounts
		    });
		  }

		  // ---------------------------------------------------------------------------------------
		  // Step context, settings and listeners
		  // ---------------------------------------------------------------------------------------

		  // Three fields of its own; the getters of settings and unit() come from a prototype shared by
		  // every context with the same settings, so contexts share a shape (see contextPrototype)
		  function createStepContext(iteration) {
		    var context = Object.create(contextPrototype(Object.keys(settings)));
		    context.iteration = iteration;
		    context.settings = settingsView();
		    context.store = storeView();
		    return Object.freeze(context);
		  }

		  // A read-only view of the live settings. Never the settings as a prototype: that gives every
		  // layout's settings object a shape of its own, and code that layouts share (the springs read
		  // options.springLength for every link) slows down once a few layouts ran in one process
		  function settingsView() {
		    var view = new SettingsView(settings);
		    Object.keys(settings).forEach(function (key) {
		      Object.defineProperty(view, key, { get: settingGetter(key), enumerable: true });
		    });
		    return Object.freeze(view);
		  }

		  function storeView() {
		    return Object.freeze(new StoreView(store));
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
		        if (!passDualTree) passDualTree = getTrees(passLaw).createDualTree(settings, runtimeLaw(passLaw));
		        passDualTree.computeForces(store, charge, sensitivity);
		        return;
		      }
		      if (!passQuadTree) passQuadTree = getTrees(passLaw).createQuadTree(settings, random, runtimeLaw(passLaw));
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
		      if (!dualTree) dualTree = getTrees(law).createDualTree(settings, runtimeLaw(law));
		      dualTree.computeForces(store, charge, sensitivity);
		      return;
		    }

		    if (!quadTree) quadTree = getTrees(law).createQuadTree(settings, random, runtimeLaw(law));
		    quadTree.options(settings);
		    quadTree.insertBodies(store, charge, sensitivity);
		    var pinned = store.pinned;
		    var i = store.n;
		    while (i--) {
		      if (!pinned[i]) quadTree.updateBodyForce(i);
		    }
		  }

		  // Trees for a law, each generated when a layout first walks it: most layouts never use the
		  // dual tree, and making it costs about as much as the first step's walk
		  function getTrees(treeLaw) {
		    var key = dimensions + '|' + treeLaw.key;
		    var trees = treeCache[key];
		    if (!trees) {
		      trees = treeCache[key] = {
		        createQuadTree: function (options, randomNumbers, runLaw) {
		          trees.createQuadTree = generateQuadTreeFunction(dimensions, treeLaw);
		          return trees.createQuadTree(options, randomNumbers, runLaw);
		        },
		        createDualTree: function (options, runLaw) {
		          trees.createDualTree = requireGenerateDualTree()(dimensions, treeLaw);
		          return trees.createDualTree(options, runLaw);
		        }
		      };
		    }
		    return trees;
		  }

		  // The law a tree reads at run time. The stock 1/r^2 code reads none, and asking a default law
		  // for its values would load and run the formula parser
		  function runtimeLaw(stageLaw) {
		    return stageLaw.isDefault ? null : stageLaw;
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
		        var generateFireIntegratorFunction = requireGenerateFireIntegrator();
		        if (inertia === 'mass' && !factory.createFireIntegrator) factory.createFireIntegrator = generateFireIntegratorFunction(dimensions);
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

		// What a view reads (the settings, or the store), under a symbol: the view's own keys are only
		// its getters. The same symbol as formula.js's, which this file does not load up front
		var SETTINGS = typeof Symbol === 'function' ? Symbol.for('ngraph.forcelayout.settings') : '$settings';

		function SettingsView(settings) {
		  Object.defineProperty(this, SETTINGS, { value: settings });
		}

		// Prototypes of step contexts, one per list of setting names: a getter method per setting
		// (`springLength()`, ...) and unit(), reading the context's settings view
		var contextPrototypes = Object.create(null);
		var CONTEXT_FIELDS = { iteration: true, settings: true, store: true, unit: true };
		function contextPrototype(keys) {
		  var id = keys.join(',');
		  var prototype = contextPrototypes[id];
		  if (prototype) return prototype;
		  // They read the live settings behind the view (see formula.liveSettings)
		  prototype = {
		    unit: function () {
		      var length = this.settings[SETTINGS].springLength;
		      return length > MIN_UNIT ? length : MIN_UNIT;
		    }
		  };
		  keys.forEach(function (key) {
		    if (!CONTEXT_FIELDS[key]) prototype[key] = function () { return this.settings[SETTINGS][key]; };
		  });
		  contextPrototypes[id] = Object.freeze(prototype);
		  return prototype;
		}

		// `store.n` and `store.D` of the step context; the getter is shared, so all views have one shape
		function StoreView(store) {
		  Object.defineProperty(this, SETTINGS, { value: store });
		  this.D = store.D;
		}
		Object.defineProperty(StoreView.prototype, 'n', { get: function () { return this[SETTINGS].n; } });

		// One getter per setting name for all views, so views with the same settings share a shape
		var settingGetters = Object.create(null);
		function settingGetter(key) {
		  var getter = settingGetters[key];
		  if (!getter) getter = settingGetters[key] = function () { return this[SETTINGS][key]; };
		  return getter;
		}

		function getFormulaStages() {
		  if (!formulaStages) formulaStages = requireFormulaStages();
		  return formulaStages;
		}

		function getDescriber() {
		  if (!describer) describer = requireDescribeProgram();
		  return describer;
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
		return createPhysicsSimulator_1;
	}

	var createStabilityCheck_1;
	var hasRequiredCreateStabilityCheck;

	function requireCreateStabilityCheck () {
		if (hasRequiredCreateStabilityCheck) return createStabilityCheck_1;
		hasRequiredCreateStabilityCheck = 1;
		createStabilityCheck_1 = createStabilityCheck;

		/**
		 * Says when a layout has settled: when its drawing has stopped changing ('still'), or when
		 * what still changes is only noise ('noise').
		 *
		 * Every `window` steps it compares where a sample of bodies is now with where they were:
		 *  - still: 95% of the bodies moved less than `stillness` of the drawing's size over the last
		 *    window (0.002 is 2 px of a drawing shown 1000 px wide), on two checks in a row;
		 *  - noise: bodies moved no further over the last four windows than over the last one, as for
		 *    jitter or a random walk (mean squared shift over four windows below `noise` times the one
		 *    window shift; directed motion gives 16, a random walk 4, jitter 1), on `hold` checks in a
		 *    row.
		 * Shifts are measured after removing the drift of the whole drawing; pinned bodies are left
		 * out. A check costs O(sample size), once per window: nothing per step.
		 *
		 * Steps are counted by `simulator.iteration()`, so an engine that runs many steps between
		 * calls (the GPU, which reads positions back once per batch) gets a check at its next call
		 * after a window has passed, over the steps that actually passed.
		 */
		function createStabilityCheck(simulator, options) {
		  options = options || {};
		  var window = options.window > 0 ? options.window : 100;
		  var stillness = options.stillness >= 0 ? options.stillness : 0.002;
		  var noise = options.noise >= 0 ? options.noise : 5;
		  var hold = options.hold > 0 ? options.hold : 3;
		  var sampleSize = options.sample > 0 ? options.sample : 1000;

		  var store = simulator.store;
		  var HISTORY = 5; // now and four windows back
		  var sample, D, m;
		  var ring, ringSteps, ringCount;
		  var lastCheck, stillChecks, noiseChecks;
		  var state;
		  reset();

		  return {
		    /** Looks at the bodies if a window has passed since the last check; returns `stable` */
		    update: update,
		    /** Forgets what it saw: positions were moved by hand, the graph or the physics changed */
		    reset: reset,
		    /** {stable, reason ('still', 'noise' or ''), step (when it settled), stillness, noise} */
		    state: function () { return state; }
		  };

		  function reset() {
		    sample = null;
		    ringCount = 0;
		    lastCheck = -Infinity;
		    stillChecks = 0;
		    noiseChecks = 0;
		    state = {stable: false, reason: '', step: -1, stillness: NaN, noise: NaN};
		  }

		  function pickSample() {
		    var n = store.n;
		    D = store.D;
		    m = Math.min(n, sampleSize);
		    sample = new Int32Array(m);
		    if (m === n) {
		      for (var i = 0; i < n; ++i) sample[i] = i;
		    } else {
		      // every k-th row from a fixed offset: rows follow the order nodes were added
		      var stride = n / m;
		      for (var j = 0; j < m; ++j) sample[j] = Math.floor(j * stride + stride / 2);
		    }
		    ring = new Float64Array(HISTORY * m * D);
		    ringSteps = new Float64Array(HISTORY);
		  }

		  function update() {
		    if (state.stable) return true;
		    var step = simulator.iteration();
		    if (step - lastCheck < window) return false;
		    if (!sample || sample.length !== Math.min(store.n, sampleSize)) pickSample();
		    if (m === 0) return settle('still', step);
		    lastCheck = step;

		    // newest snapshot first: shift the ring
		    ring.copyWithin(m * D, 0, (HISTORY - 1) * m * D);
		    ringSteps.copyWithin(1, 0, HISTORY - 1);
		    var pos = store.pos;
		    for (var j = 0; j < m; ++j) {
		      var from = sample[j] * D;
		      for (var k = 0; k < D; ++k) ring[j * D + k] = pos[from + k];
		    }
		    ringSteps[0] = step;
		    if (ringCount < HISTORY) ringCount += 1;
		    if (ringCount < 2) return false;

		    var size = drawingSize();
		    var one = shifts(1);
		    state.stillness = size > 0 ? one.q95 / size : 0;
		    stillChecks = state.stillness <= stillness ? stillChecks + 1 : 0;
		    if (stillChecks >= 2) return settle('still', step);

		    if (ringCount === HISTORY) {
		      var four = shifts(HISTORY - 1);
		      state.noise = one.msd > 0 ? four.msd / one.msd : Infinity;
		      noiseChecks = state.noise < noise ? noiseChecks + 1 : 0;
		      if (noiseChecks >= hold) return settle('noise', step);
		    }
		    return false;
		  }

		  function settle(reason, step) {
		    state.stable = true;
		    state.reason = reason;
		    state.step = step;
		    return true;
		  }

		  // Shifts between the newest snapshot and the one `back` windows ago, the mean shift removed:
		  // their 95th percentile and mean square
		  var lengths = null;
		  function shifts(back) {
		    var pinned = store.pinned;
		    var mean = new Float64Array(D), count = 0, j, k;
		    var old = back * m * D;
		    for (j = 0; j < m; ++j) {
		      if (pinned[sample[j]]) continue;
		      for (k = 0; k < D; ++k) mean[k] += ring[j * D + k] - ring[old + j * D + k];
		      count += 1;
		    }
		    if (count === 0) return {q95: 0, msd: 0};
		    for (k = 0; k < D; ++k) mean[k] /= count;
		    if (!lengths || lengths.length !== m) lengths = new Float64Array(m);
		    var used = 0, sum = 0;
		    for (j = 0; j < m; ++j) {
		      if (pinned[sample[j]]) continue;
		      var d2 = 0;
		      for (k = 0; k < D; ++k) {
		        var d = ring[j * D + k] - ring[old + j * D + k] - mean[k];
		        d2 += d * d;
		      }
		      sum += d2;
		      lengths[used++] = d2;
		    }
		    var sorted = lengths.subarray(0, used).sort();
		    return {q95: Math.sqrt(sorted[Math.floor(0.95 * (used - 1))]), msd: sum / used};
		  }

		  // The larger side of the box around all bodies
		  function drawingSize() {
		    var box = simulator.getBBox();
		    var size = 0;
		    for (var k = 0; k < D; ++k) {
		      var name = k < 3 ? ['x', 'y', 'z'][k] : 'c' + (k + 1);
		      var lo = box['min_' + name], hi = box['max_' + name];
		      if (hi - lo > size) size = hi - lo;
		    }
		    return size;
		  }
		}
		return createStabilityCheck_1;
	}

	var hasRequiredNgraph_forcelayout;

	function requireNgraph_forcelayout () {
		if (hasRequiredNgraph_forcelayout) return ngraph_forcelayout.exports;
		hasRequiredNgraph_forcelayout = 1;
		ngraph_forcelayout.exports = createLayout;
		ngraph_forcelayout.exports.simulator = requireCreatePhysicsSimulator();

		var eventify = requireNgraph_events();
		var createStabilityCheck = requireCreateStabilityCheck();

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

		  var createSimulator = (physicsSettings && physicsSettings.createSimulator) || requireCreatePhysicsSimulator();
		  var physicsSimulator = createSimulator(physicsSettings);
		  if (Array.isArray(physicsSettings)) throw new Error('Physics settings is expected to be an object');

		  var nodeMass = graph.version > 19 ? defaultSetNodeMass : defaultArrayNodeMass;
		  if (physicsSettings && typeof physicsSettings.nodeMass === 'function') {
		    nodeMass = physicsSettings.nodeMass;
		  }
		  // How hard a node pushes others. Without it, the mass is used.
		  var nodeCharge = physicsSettings && typeof physicsSettings.nodeCharge === 'function' ? physicsSettings.nodeCharge : null;
		  if (nodeCharge) {
		    physicsSimulator.store.define('charge', Float64Array, 1, 1);
		    physicsSimulator.repulsionCharge('charge');
		  }

		  var nodeBodies = new Map();
		  var springs = {};
		  var bodiesCount = 0;

		  var springTransform = physicsSimulator.settings.springTransform || noop;

		  // Initialize physics with what we have in the graph:
		  initPhysics();
		  listenToEvents();

		  var wasStable = false;
		  // When the drawing stopped changing (see lib/createStabilityCheck.js). `stable` in the
		  // settings tunes it: {window, stillness, noise, hold, sample}.
		  var stability = createStabilityCheck(physicsSimulator, physicsSettings && physicsSettings.stable);
		  // New physics, new graph: the layout has to settle again
		  physicsSimulator.on('settings', wake);
		  physicsSimulator.on('topology', wake);

		  var api = {
		    /**
		     * Performs one step of iterative layout algorithm
		     *
		     * @returns {boolean} true once the layout has settled: its drawing stopped changing, or only
		     * noise is left (see `getStability()`). It stays true until nodes are moved by hand, the
		     * graph changes or a setting changes.
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

		      return api.checkStable();
		    },

		    /**
		     * Updates whether the layout has settled from the positions in the store, and fires
		     * 'stable' when that changed. step() calls it; engines that step elsewhere (the GPU) call it
		     * after they bring positions back.
		     */
		    checkStable: function () {
		      var isStableNow = bodiesCount === 0 || stability.update();
		      updateStableStatus(isStableNow);
		      return isStableNow;
		    },

		    /**
		     * Whether and why the layout has settled: {stable, reason, step, stillness, noise}.
		     * `reason` is 'still' (the drawing stopped changing) or 'noise' (what still moves goes
		     * nowhere); `step` is when it settled; `stillness` is how far bodies moved over the last
		     * window, as a share of the drawing's size; `noise` how much further they moved over four
		     * windows than over one (16 for directed motion, 1 to 4 for noise).
		     */
		    getStability: function () {
		      return stability.state();
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
		      // A node moved by hand: the others have to settle around it again
		      wake();
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
		     * @param {string} linkId link identifier. If two arguments are passed then
		     * this argument is treated as formNodeId
		     * @param {string=} toId when defined this parameter denotes head of the link
		     * and first argument is treated as tail of the link (fromId)
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
		    lastMove: 0
		  };

		  eventify(api);
		  // program() lists the layout's 'step' listeners too: other engines call them less often
		  if (physicsSimulator.watchListeners) physicsSimulator.watchListeners(api);

		  return api;

		  function wake() {
		    stability.reset();
		    updateStableStatus(bodiesCount === 0);
		  }

		  function updateStableStatus(isStableNow) {
		    if (wasStable !== isStableNow) {
		      wasStable = isStableNow;
		      onStableChanged(isStableNow);
		    }
		  }

		  function forEachBody(cb) {
		    nodeBodies.forEach(cb);
		  }

		  function getForceVectorLength() {
		    var fx = 0, fy = 0;
		    forEachBody(function(body) {
		      fx += Math.abs(body.force.x);
		      fy += Math.abs(body.force.y);
		    });
		    return Math.sqrt(fx * fx + fy * fy);
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
		    // Rows for every node and link at once: growing the stores one doubling at a time copies
		    // them and re-points every body each time
		    var bodyStore = physicsSimulator.store, springStore = physicsSimulator.springStore;
		    if (bodyStore && bodyStore.reserve && graph.getNodesCount) bodyStore.reserve(graph.getNodesCount());
		    if (springStore && springStore.reserve && graph.getLinksCount) springStore.reserve(graph.getLinksCount());

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
		    // TODO: Previously I was looking only at two links. Should I look at all of them?
		    node.links.forEach(function(link) {
		      var otherBody = link.fromId !== node.id ? nodeBodies.get(link.fromId) : nodeBodies.get(link.toId);
		      if (otherBody && otherBody.pos) {
		        neighbors.push(otherBody);
		      }
		    });

		    return neighbors;
		  }

		  function updateBodyMass(nodeId) {
		    var body = nodeBodies.get(nodeId);
		    // Straight into the store, not through the setter: every mass update here comes with a graph
		    // edit, after which the simulator marks all columns changed anyway
		    var mass = body.store.mass;
		    mass[body.index] = nodeMass(nodeId);
		    if (Number.isNaN(mass[body.index])) {
		      throw new Error('Node mass should be a number');
		    }
		    if (nodeCharge) {
		      var charge = nodeCharge(nodeId);
		      if (typeof charge !== 'number' || Number.isNaN(charge)) throw new Error('Node charge should be a number');
		      physicsSimulator.store.charge[body.index] = charge;
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
		  function defaultArrayNodeMass(nodeId) {
		    // This function is for older versions of ngraph.graph.
		    var links = graph.getLinks(nodeId);
		    if (!links) return 1;
		    return 1 + links.length / 3.0;
		  }

		  function defaultSetNodeMass(nodeId) {
		    var links = graph.getLinks(nodeId);
		    if (!links) return 1;
		    return 1 + links.size / 3.0;
		  }
		}

		function noop() { }
		return ngraph_forcelayout.exports;
	}

	var ngraph_forcelayoutExports = requireNgraph_forcelayout();
	var index = /*@__PURE__*/getDefaultExportFromCjs(ngraph_forcelayoutExports);

	return index;

}));
