var test = require('tap').test;
var createBodyStore = require('../lib/createBodyStore');

test('copyBody copies every built in column', function (t) {
  [1, 2, 3].forEach(function (dimensions) {
    var columns = createBodyStore.builtInColumns(dimensions);
    var from = createBodyStore(dimensions, 2);
    from.add();
    from.add();
    columns.forEach(function (column, c) {
      var size = column[2];
      for (var k = 0; k < size; ++k) from[column[0]][size + k] = c + 1 + k;
    });
    [createBodyStore(dimensions, 1), createBodyStore.createSingleBodyStore(dimensions)].forEach(function (to) {
      if (to.add) to.add();
      createBodyStore.copyBody(from, 1, to, 0);
      columns.forEach(function (column, c) {
        var size = column[2];
        for (var k = 0; k < size; ++k) t.equal(to[column[0]][k], c + 1 + k, dimensions + 'D ' + column[0]);
      });
    });
  });
  t.end();
});

test('a single body store has the built in columns', function (t) {
  var single = createBodyStore.createSingleBodyStore(3);
  createBodyStore.builtInColumns(3).forEach(function (column) {
    t.equal(single[column[0]].length, column[2], column[0]);
  });
  t.equal(single.mass[0], 1, 'mass starts at 1');
  t.end();
});
