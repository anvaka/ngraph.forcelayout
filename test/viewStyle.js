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

// Links as the view's style module reads them: positions (2D) and the two ends of each link
function linksOf(points, pairs) {
  return {
    pos: Float64Array.from(points.flat()),
    springs: {n: pairs.length, from: pairs.map(function (p) { return p[0]; }), to: pairs.map(function (p) { return p[1]; })},
    rect: {
      min_x: Math.min.apply(null, points.map(function (p) { return p[0]; })),
      max_x: Math.max.apply(null, points.map(function (p) { return p[0]; })),
      min_y: Math.min.apply(null, points.map(function (p) { return p[1]; })),
      max_y: Math.max.apply(null, points.map(function (p) { return p[1]; }))
    }
  };
}

test('a few long links do not read as a crowd', async function (t) {
  var s = await style;
  // A triangle with a tail, 10 units a side, at 12 pixels per unit: four links 120 px long
  var g = linksOf([[0, 0], [10, 0], [5, 8.66], [15, 8.66]], [[0, 1], [1, 2], [2, 0], [2, 3]]);
  var crowded = s.linkCrowding(g.pos, 2, g.springs, g.rect, 12, 2);
  t.ok(crowded > 0.1 && crowded < 1, 'a 2 px line through a cell covers part of it: ' + crowded.toFixed(3));
  t.ok(0.25 / crowded > 0.25, 'so the links are drawn at a quarter of full opacity or more');
});

test('a chain that lies almost straight is not a crowd either', async function (t) {
  var s = await style;
  var g = linksOf([[0, 0], [10, 0.001], [20, 0], [30, 0.002]], [[0, 1], [1, 2], [2, 3]]);
  var crowded = s.linkCrowding(g.pos, 2, g.springs, g.rect, 12, 2);
  t.ok(crowded > 0.5 && crowded < 1.5, 'one line covers the cells it runs through about once: ' + crowded.toFixed(3));
});

test('links on top of each other are a crowd', async function (t) {
  var s = await style;
  // 200 links between the same two spots
  var points = [], pairs = [];
  for (var i = 0; i < 200; ++i) {
    points.push([0, i * 0.001], [10, 10 + i * 0.001]);
    pairs.push([2 * i, 2 * i + 1]);
  }
  var g = linksOf(points, pairs);
  var crowded = s.linkCrowding(g.pos, 2, g.springs, g.rect, 12, 2);
  t.ok(crowded > 20, 'many times the cells\' area: ' + crowded.toFixed(1));
});

test('links shorter than a cell are binned where they are, as before', async function (t) {
  var s = await style;
  // A 64 x 64 grid of nodes, each linked to the next in its row: every link is half a cell long
  var points = [], pairs = [];
  for (var y = 0; y < 64; ++y) for (var x = 0; x < 64; ++x) {
    points.push([x, y]);
    if (x > 0) pairs.push([y * 64 + x - 1, y * 64 + x]);
  }
  var g = linksOf(points, pairs);
  var crowded = s.linkCrowding(g.pos, 2, g.springs, g.rect, 10, 2);
  // a cell is 63/32 units each way and holds four links of 1 unit, 0.2 units wide
  t.ok(Math.abs(crowded - 4 * 0.2 / ((63 / 32) * (63 / 32))) < 0.02, 'coverage of an even grid: ' + crowded.toFixed(3));
});

test('a light background gets the light look: dark links, a dark plain color, darkened data colors', async function (t) {
  var s = await style;
  var theme = await import('../modules/view/theme.js');
  t.equal(theme.themeOf('#ffffff'), 'light');
  t.equal(theme.themeOf('#f4f1ea'), 'light');
  t.equal(theme.themeOf('#808080'), 'light', 'black text reads better on mid grey');
  t.equal(theme.themeOf('#0e1624'), 'dark');
  t.equal(theme.themeOf('#000'), 'dark');
  t.throws(function () { theme.themeValues('sepia'); }, /Unknown theme/);

  var graph = createGraph();
  graph.addLink(1, 2);
  var plain = s.colorsOf(graph, {background: '#ffffff'});
  t.equal(hex(plain.nodeColor(graph.getNode(1))), theme.THEMES.light.node, 'nodes are dark enough to read on white');
  t.equal((plain.linkColor(0.5) & 0xffffff00) >>> 0, theme.THEMES.light.link, 'links are ink, not white');
  t.equal(hex(s.colorsOf(graph, {}).nodeColor(graph.getNode(1))), theme.THEMES.dark.node, 'the dark look is as it was');
  t.equal((s.colorsOf(graph, {}).linkColor(0.5) & 0xffffff00) >>> 0, 0xffffff00);

  var lines = createGraph();
  lines.addNode(1, {line: 'Circle'});
  lines.addNode(2, {line: 'Northern'});
  var colors = s.colorsOf(lines, {colorBy: 'line', background: '#ffffff', palette: {Circle: '#ffd329', Northern: '#000000'}});
  t.not(hex(colors.nodeColor(lines.getNode(1))), '#ffd329', 'yellow is darkened on white');
  t.equal(hex(colors.nodeColor(lines.getNode(2))), '#000000', 'black stays');
  t.equal(s.readable('#ffffff', '#ffffff'), '#8c8c8c', 'toward black, in steps, to 3:1 or more');
  t.equal(s.readable('#000000', '#0e1624') > '#000000', true, 'toward white on dark');

  var grouped = createGraph();
  grouped.addNode(1, {kind: 'a'});
  grouped.addNode(2, {kind: 'b'});
  var onWhite = s.colorsOf(grouped, {colorBy: 'kind', background: '#ffffff'});
  t.equal(hex(onWhite.nodeColor(grouped.getNode(1))), s.PALETTE[0], 'the palette is the same on both backgrounds');
  t.throws(function () { s.colorsOf(grouped, {background: 'no such color'}); }, /needs a color/);
});
