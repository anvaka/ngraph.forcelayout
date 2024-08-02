/* eslint-disable no-shadow */
import t from 'tap';
import generateCreateBodyFunction from '../lib/codeGenerators/generateCreateBody.js';
import createPhysicsSimulator from '../lib/createPhysicsSimulator.js';
import {augment} from '../lib/createPhysicsSimulator.js';
import Spring from '../lib/spring.js';
import Graph from 'graphology';

const dimensions2 = 2;
const Body2 = generateCreateBodyFunction(dimensions2);
const Body3 = generateCreateBodyFunction(3);

t.test("Can step without bodies", function (t) {
  const simulator = createPhysicsSimulator();
  // t.equal(simulator.bodies.length, 0, "There should be no bodies");
  // t.equal(simulator.springs.size, 0, "There should be no springs");
  simulator.step();
  t.end();
});

t.test("it has settings exposed", function (t) {
  const simulator = createPhysicsSimulator();
  t.ok(simulator.settings, "settings are exposed");
  t.end();
});

t.test("augment source needs key", function (t) {
  t.notOk(augment({}, {}, "notPresent"), "augment fails");
  t.end();
});

t.test("value of augment key should be a number", function (t) {
  const source = { foo: 10 };
  const target = {};
  augment(source, target, "foo");
  t.throws(
    () => target["foo"]("bar"),
    "Value of foo should be a valid number.",
  );
  t.end();
});

t.test("it gives amount of total movement", function (t) {
  const g = new Graph();
  g.addNode("first", {position: {x: -10, y: 0}});
  g.addNode("second", {position: {x: 10, y: 0}});
  const simulator = createPhysicsSimulator(g);
  simulator.step();

  const totalMoved = simulator.getTotalMovement();
  t.ok(!isNaN(totalMoved), "Amount of total movement is returned");
  t.end();
});

t.test("it can create a body at given position", function (t) {
  const simulator = createPhysicsSimulator();
  const pos1 = { x: -10, y: 0 };
  const pos2 = { x: 10, y: 1 };
  const body1 = simulator.createBodyAt(pos1);
  const body2 = simulator.createBodyAt(pos2);

  t.equal(body1.pos.x, -10, "X is there");
  t.equal(body1.pos.y, 0, "Y is there");

  t.equal(body2.pos.x, 10, "X is there");
  t.equal(body2.pos.y, 1, "Y is there");
  t.end();
});

t.test("Does not update position of one body", function (t) {
  const simulator = createPhysicsSimulator();
  const pos = {x: 0, y: 0};
  const body = simulator.createBodyAt(pos);
  simulator.addBody("test", body);

  simulator.step();
  t.equal(simulator.getBody("test"), body, "Body points to actual object");
  t.equal(body.pos.x, 0, "X is not changed");
  t.equal(body.pos.y, 0, "Y is not changed");
  t.end();
});

t.test("throws on no body or no pos", (t) => {
  const simulator = createPhysicsSimulator();
  t.throws(() => simulator.addBody(), /Node must be provided to addBody/);
  t.throws(() => simulator.addBody("test"), /Body is required/);
  t.throws(() => simulator.createBodyAt(), /Body position is required/);
  t.end();
});

t.test("throws on no spring", (t) => {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g);
  g.addNode("src");
  g.addNode("dst");
  g.addEdgeWithKey("test", "src", "dst");
  t.throws(
    () => simulator.addSpring("test"),
    /Cannot add null spring to force simulator/
  );
  t.end();
});

t.test("Can add and remove forces", function (t) {
  const simulator = createPhysicsSimulator();
  const testForce = function () {};
  simulator.addForce("foo", testForce);
  t.equal(simulator.getForces().get("foo"), testForce);

  simulator.removeForce("foo");
  t.equal(simulator.getForces().get("foo"), undefined);

  simulator.removeForce("foo");
  // should still be good
  t.end();
});

t.test("Throws when adding forces of duplicate name", function (t) {
  const simulator = createPhysicsSimulator();
  const testForce = function () {};
  t.throws(
    () => simulator.addForce("spring", testForce),
    "Force spring is already added",
  );
  t.end();
});

t.test("Can configure forces", function (t) {
  t.test("Gravity", function (t) {
    const simulator = createPhysicsSimulator();
    const body1 = new Body2(0, 0);
    const body2 = new Body2(1, 0);

    simulator.addBody("test1", body1);
    simulator.addBody("test2", body2);

    simulator.step();
    // by default gravity is negative, bodies should repel each other:
    const xDist = Math.abs(body1.pos.x - body2.pos.x); 
    t.ok(xDist > 1, "Body 1 moves away from body 2");

    // now reverse gravity, and bodies should attract each other:
    simulator.gravity(100);
    simulator.step();
    const newDist = Math.abs(body1.pos.x - body2.pos.x);
    t.ok(xDist > newDist, "Body 1 moved towards body 2");

    t.end();
  });

  t.test("Drag", function (t) {
    const simulator = createPhysicsSimulator();
    const body1 = new Body2(0, 0);
    body1.velocity.x = -1; // give it small impulse
    simulator.addBody("test", body1);

    simulator.step();

    const x1 = body1.velocity.x;
    // by default drag force will slow down entire system:
    t.ok(x1 > -1, "Body 1 moves at reduced speed");

    // Restore original velocity, but now set drag force to 0
    body1.velocity.x = -1;
    simulator.dragCoefficient(0);
    simulator.step();
    t.ok(body1.velocity.x === -1, "Velocity should remain unchanged");
    t.end();
  });
  t.end();
});

t.test("Can remove bodies", function (t) {
  const simulator = createPhysicsSimulator();
  const body = new Body2(0, 0);
  const node = "test";
  simulator.addBody(node, body);
  t.equal(simulator.countBodies(), 1, "Number of bodies is 1");
  const result = simulator.removeBody(node);
  t.equal(result, true, "body successfully removed");
  t.equal(simulator.countBodies(), 0, "Number of bodies is 0");
  t.end();
});

t.test("removeBody requires body", function (t) {
  const simulator = createPhysicsSimulator();
  const body = new Body2(0, 0);
  const node = "test";
  simulator.addBody(node, body);
  t.notOk(
    simulator.removeBody(),
    "removeBody returns falsey if not given body",
  );
  t.end();
});

t.test("Updates position for two bodies", function (t) {
  const simulator = createPhysicsSimulator();
  const body1 = new Body2(-1, 0);
  const body2 = new Body2(1, 0);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);

  simulator.step();
  t.equal(simulator.countBodies(), 2, "Number of bodies is 2");
  t.ok(body1.pos.x !== 0, "Body1.X has changed");
  t.ok(body2.pos.x !== 0, "Body2.X has changed");

  t.equal(body1.pos.y, 0, "Body1.Y has not changed");
  t.equal(body2.pos.y, 0, "Body2.Y has not changed");
  t.end();
});

t.test("addSpring should not add bodies", function (t) {
  const simulator = createPhysicsSimulator();
  const body1 = new Body2(-1, 0);
  const body2 = new Body2(1, 0);

  const spring = new Spring(body1, body2, 10, 2);
  t.throws(() => simulator.addSpring("test", spring), /Cannot create spring on nonexistant edge/);
  t.end();
});

t.test("throws when adding spring with duplicate key", function (t) {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g);
  const body1 = new Body2(-1, 0);
  const body2 = new Body2(1, 0);
  const spring = new Spring(body1, body2, 10, 2);
  simulator.addBody("src", body1);
  simulator.addBody("dst", body2);
  g.addEdgeWithKey("test", "src", "dst");
  simulator.addSpring("test", spring);
  t.throws(
    () => simulator.addSpring("test", spring),
    "Spring test is already added",
  );
  t.end();
});

t.test("negative spring coefficients must be -1", function (t) {
  const body1 = new Body2(-1, 0);
  const body2 = new Body2(1, 0);
  const spring = new Spring(body1, body2, 1, -10);
  t.equal(spring.coefficient, -1, "non-negative value should be set to -1");
  t.end();
});

t.test("Spring affects bodies positions", function (t) {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g);
  const body1 = new Body2(-10, 0);
  const body2 = new Body2(10, 0);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);
  g.addEdgeWithKey("test", "test1", "test2");
  // If you take this out, bodies will repel each other:
  const spring = new Spring(body1, body2, 1);
  simulator.addSpring("test", spring);

  simulator.step();
  t.ok(simulator.getBody("test1").pos.x > -10, "Body 1 should move towards body 2");
  t.ok(simulator.getBody("test2").pos.x < 10, "Body 2 should move towards body 1");

  t.end();
});

t.test("Added dimensions get used", function (t) {
  const simulator = createPhysicsSimulator();
  const body1 = new Body2(-10, -10);
  const body2 = new Body2(10, 10);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);

  simulator.step();

  simulator.setDimensions(3);

  t.ok(body1.pos.z == 1, "Body 1 should start at z=1");
  t.ok(body2.pos.z == 1, "Body 2 should start at z=1");

  simulator.step();

  t.ok(body1.pos.z != 1, "Body 1 should move along z axis");
  t.ok(body2.pos.z != 1, "Body 2 should move along z axis");

  t.end();
});

t.test("If bodies do not start using a dimension, that dimension will never be used", function (t) {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g, { dimensions: 3 });
  const body1 = new Body3(10000, 2, 1);
  const body2 = new Body3(-1100000, 0, 1);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);
  g.addEdgeWithKey("test", "test1", "test2");
  const spring = new Spring(body1, body2, 1);
  // If you take this out, bodies will repel each other:
  simulator.addSpring("test", spring);

  t.ok(body1.pos.z == 1, "Body 1 should start at z=1");
  t.ok(body2.pos.z == 1, "Body 2 should start at z=1");

  simulator.step();

  t.ok(body1.pos.z == 1, "Body 1 should not move along z axis");
  t.ok(body2.pos.z == 1, "Body 2 should not move along z axis");

  t.end();
});

t.test("Can remove springs", function (t) {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g);

  const body1 = new Body2(-10, 0);
  const body2 = new Body2(10, 0);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);

  const spring = new Spring(body1, body2, 1);
  g.addEdgeWithKey("test", "test1", "test2");
  simulator.addSpring("test", spring);

  simulator.removeSpring("test");

  simulator.step();
  const dist = Math.abs(body1.pos.x - body2.pos.x);
  t.ok(dist > 20, "Body 1 should move away from body 2");

  t.end();
});

t.test("removeSpring requires spring", function (t) {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g);
  const body1 = new Body2(-10, 0);
  const body2 = new Body2(10, 0);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);
  const spring = new Spring(body1, body2, 1);
  g.addEdgeWithKey("test", "test1", "test2");
  simulator.addSpring("test", spring);

  t.notOk(simulator.removeSpring(null), "returns falsey if spring is falsey");
  t.end();
});

t.test("Get bounding box", function (t) {
  const simulator = createPhysicsSimulator();
  const body1 = new Body2(0, 0);
  const body2 = new Body2(10, 10);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);
  simulator.step(); // this will move bodies farther away
  const bbox = simulator.getBBox();
  t.ok(bbox.min_x <= 0, "Left is 0");
  t.ok(bbox.min_y <= 0, "Top is 0");
  t.ok(bbox.max_x >= 10, "right is 10");
  t.ok(bbox.max_y >= 10, "bottom is 10");
  t.end();
});

t.test("it updates bounding box", function (t) {
  const simulator = createPhysicsSimulator();
  const body1 = new Body2(0, 0);
  const body2 = new Body2(10, 10);
  simulator.addBody("test1", body1);
  simulator.addBody("test2", body2);
  let bbox = simulator.getBBox();

  t.ok(bbox.min_x === 0, "Left is 0");
  t.ok(bbox.min_y === 0, "Top is 0");
  t.ok(bbox.max_x === 10, "right is 10");
  t.ok(bbox.max_y === 10, "bottom is 10");

  body1.setPosition(15, 15);
  bbox = simulator.getBBox();

  t.ok(bbox.min_x === 10, "Left is 10");
  t.ok(bbox.min_y === 10, "Top is 10");
  t.ok(bbox.max_x === 15, "right is 15");
  t.ok(bbox.max_y === 15, "bottom is 15");
  t.end();
});

t.test("Get best position", function (t) {
  t.test("can get with empty simulator", function (t) {
    const simulator = createPhysicsSimulator();
    const empty = simulator.getBestNewBodyPosition([]);
    t.ok(typeof empty.x === "number", "Has X");
    t.ok(typeof empty.y === "number", "Has Y");

    t.end();
  });

  t.end();
});

t.test("it can change settings", function (t) {
  const simulator = createPhysicsSimulator();

  const currentTheta = simulator.theta();
  t.ok(typeof currentTheta === "number", "theta is here");
  simulator.theta(1.2);
  t.equal(simulator.theta(), 1.2, "theta is changed");

  const currentSpringCoefficient = simulator.springCoefficient();
  t.ok(
    typeof currentSpringCoefficient === "number",
    "springCoefficient is here",
  );
  simulator.springCoefficient(0.8);
  t.equal(simulator.springCoefficient(), 0.8, "springCoefficient is changed");

  const gravity = simulator.gravity();
  t.ok(typeof gravity === "number", "gravity is here");
  simulator.gravity(-0.8);
  t.equal(simulator.gravity(), -0.8, "gravity is changed");

  const springLength = simulator.springLength();
  t.ok(typeof springLength === "number", "springLength is here");
  simulator.springLength(80);
  t.equal(simulator.springLength(), 80, "springLength is changed");

  const dragCoefficient = simulator.dragCoefficient();
  t.ok(typeof dragCoefficient === "number", "dragCoefficient is here");
  simulator.dragCoefficient(0.8);
  t.equal(simulator.dragCoefficient(), 0.8, "dragCoefficient is changed");

  const timeStep = simulator.timeStep();
  t.ok(typeof timeStep === "number", "timeStep is here");
  simulator.timeStep(8);
  t.equal(simulator.timeStep(), 8, "timeStep is changed");

  t.end();
});

t.test("it can augment string setter values", function (t) {
  const g = new Graph();
  const simulator = createPhysicsSimulator(g, {
    name: "John",
  });

  simulator.name("Alisa");
  t.equal(simulator.name(), "Alisa", "name is Alisa");
  t.end();
});

t.test("it ignores body that does not exist", function (t) {
  const simulator = createPhysicsSimulator();
  const body = new Body2(0, 0);
  simulator.addBody("real", body);
  simulator.removeBody("fake");
  t.equal(simulator.countBodies(), 1, "Should ignore body that does not exist");
  t.end();
});

t.test("it can change number of dimensions", function (t) {
  t.test("it can refuse invalid dimensions", function (t) {
    const simulator = createPhysicsSimulator();
    t.throws(
      () => simulator.setDimensions(-1),
      "Dimensions must be set to integer greater than zero",
    );
    t.end();
  });

  t.test("it can add a dimension", function (t) {
    const simulator = createPhysicsSimulator();
    const body = new Body2(-10, 10);
    simulator.addBody("test", body);

    const body2 = simulator.getBody("test");

    t.equal(body, body2, "2D bodies persist after sim insertion");
    t.equal(body2.pos.x, -10, "X is there");
    t.equal(body2.pos.y, 10, "Y is there");
    t.notOk(body2.pos.z, "Z is absent");

    simulator.setDimensions(3);

    const body3 = simulator.getBody("test");
    t.equal(body3, body2, "bodies persist after dimension transition");
    t.equal(body3.pos.x, -10, "X is the same");
    t.equal(body3.pos.y, 10, "Y is the same");
    t.ok(body3.pos.z, "Z is added");

    t.equal(body, body3, "bodies persist E2E");

    t.end();
  });
  t.test("it can remove a dimension", function (t) {
    const g = new Graph();
    const simulator = createPhysicsSimulator(g, { dimensions: 3 });
    const Body3 = generateCreateBodyFunction(3);
    const body = new Body3(-10, 10, 10);
    simulator.addBody("test", body);

    const body3 = simulator.getBody("test");

    t.equal(body, body3, "3D bodies persist after sim insertion");
    t.equal(body3.pos.x, -10, "X is there");
    t.equal(body3.pos.y, 10, "Y is there");
    t.equal(body3.pos.z, 10, "Z is there");

    simulator.setDimensions(2);

    const body2 = simulator.getBody("test");
    t.equal(body2, body3, "bodies persist after dimension transition");
    t.equal(body2.pos.x, -10, "X is the same");
    t.equal(body2.pos.y, 10, "Y is the same");
    t.notOk(body2.pos.z, "Z is absent");

    t.equal(body, body2, "bodies persist E2E");

    t.end();
  });
  t.test("it can add two dimensions", function (t) {
    const g = new Graph();
    const simulator = createPhysicsSimulator(g, { dimensions: 3 });
    const Body3 = generateCreateBodyFunction(3);
    const body = new Body3(-10, 10, 20);
    simulator.addBody("test", body);
    simulator.setDimensions(5);

    t.equal(body.pos.x, -10, "X is there");
    t.equal(body.pos.y, 10, "Y is there");
    t.equal(body.pos.z, 20, "Z is there");
    t.equal(body.pos.c4, 1, "c4 is there");
    t.equal(body.pos.c5, 1, "c5 is there");
    t.end();
  });

  t.end();
});
