var test = require('tap').test;
var createGraph = require('ngraph.graph');

// modules/view is an ES module; the style module's color rules run without WebGL or a DOM
var style = import('../modules/view/modules/style.js');

function hex(rgba) {
  return '#' + (rgba >>> 8).toString(16).padStart(6, '0');
}

test('categories take the palette by size, links inside a category take its color', async function (t) {
  var s = await style;
  var graph = createGraph();
  ['a', 'b', 'c'].forEach(function (id) { graph.addNode(id, {kind: 'big'}); });
  graph.addNode('d', {kind: 'small'});
  graph.addNode('e');
  graph.addLink('a', 'b');
  graph.addLink('c', 'd');
  var colors = s.colorsOf(graph, {colorBy: 'kind'});
  t.equal(hex(colors.nodeColor(graph.getNode('a'))), s.PALETTE[0], 'the biggest category takes the first color');
  t.equal(hex(colors.nodeColor(graph.getNode('d'))), s.PALETTE[1]);
  t.equal(hex(colors.nodeColor(graph.getNode('e'))), s.OTHER, 'no category: the neutral color');
  var linkColor = colors.linkColor(0.5);
  var inside, between;
  graph.forEachLink(function (link) {
    if (link.fromId === 'a') inside = linkColor(link);
    else between = linkColor(link);
  });
  t.equal(hex(inside), s.PALETTE[0], 'a link inside a category');
  t.equal(between & 0xff, Math.round(0.5 * 0.6 * 255), 'a link between categories is fainter');
  t.same(colors.legend.items.map(function (item) { return item.label; }), ['big', 'small']);
  t.equal(colors.legend.title, 'kind');
});

test('the data\'s own colors are kept, lightened to 3:1 on the background', async function (t) {
  var s = await style;
  var graph = createGraph();
  graph.addNode(1, {line: 'Northern'});
  graph.addNode(2, {line: 'Central'});
  var colors = s.colorsOf(graph, {colorBy: 'line', palette: {Northern: '#000000', Central: '#e42313'}});
  t.not(hex(colors.nodeColor(graph.getNode(1))), '#000000', 'black is lightened');
  t.equal(hex(colors.nodeColor(graph.getNode(2))), '#e42313', 'a readable color stays');
  t.equal(s.readable('#e42313'), '#e42313');
});

test('no categories: one color, no legend; bare numbers: no legend', async function (t) {
  var s = await style;
  var graph = createGraph();
  graph.addLink(1, 2);
  var colors = s.colorsOf(graph, {});
  t.equal(colors.legend, null);
  t.equal(hex(colors.nodeColor(graph.getNode(1))), '#90f8fc');
  var groups = createGraph();
  groups.addNode(1, {group: 1});
  groups.addNode(2, {group: 2});
  t.equal(s.colorsOf(groups, {}).legend, null, 'group numbers name nothing');
  t.not(s.colorsOf(groups, {}).nodeColor(groups.getNode(1)), s.colorsOf(groups, {}).nodeColor(groups.getNode(2)), 'but they are colored');
});

test('size by links: leaves are small, hubs grow with the square root', async function (t) {
  var s = await style;
  var graph = createGraph();
  for (var i = 1; i <= 16; ++i) graph.addLink(0, i);
  var size = s.sizeByLinks(2);
  t.equal(size(graph.getNode(1)), 1, 'a leaf: unit x 0.5');
  t.equal(size(graph.getNode(0)), 4, 'a hub of 16 links: unit x 0.5 x 4');
});

test('below 1/255, a fixed share of the links is drawn instead', async function (t) {
  var s = await style;
  var graph = createGraph();
  for (var i = 0; i < 400; ++i) graph.addLink(i, i + 1);
  var colors = s.colorsOf(graph, {});
  var linkColor = colors.linkColor(0.25 / 255);
  var drawn = 0, again = 0;
  graph.forEachLink(function (link) { if (linkColor(link) & 0xff) drawn += 1; });
  graph.forEachLink(function (link) { if (linkColor(link) & 0xff) again += 1; });
  t.ok(drawn > 50 && drawn < 150, 'about a quarter of the links: ' + drawn);
  t.equal(again, drawn, 'the same links every time');
});
