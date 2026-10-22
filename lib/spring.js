module.exports = Spring;

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
      this.store.changed('length');
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
      // engines with their own copy of the numbers see that the column changed
      this.store.changed('coefficient');
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
};

Spring.prototype.toJSON = function () {
  return { from: this.from, to: this.to, length: this.length, coefficient: this.coefficient };
};
