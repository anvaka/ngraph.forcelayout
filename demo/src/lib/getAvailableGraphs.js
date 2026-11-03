// The graphs in the picker, in groups. Names with a slash are downloaded from the SuiteSparse
// collection mirror, 'Benchmark: ' names are files in demo/public/graphs (the layout benchmark's
// graphs, which the prototypes were judged on), graphs with real names are files in
// demo/public/graphs/data (loadLabelledGraph.js), and the rest are generated in loadGraph.js.
export const graphGroups = [
  {
    label: 'Real graphs, with names',
    graphs: [
      'Mammals (WordNet)',
      'London Underground',
      'Countries',
      'Miserables',
      'Chess openings',
      'US counties',
      'Languages of the world',
      'Metros of the world',
    ]
  },
  {
    label: 'Large: best on WebGPU',
    graphs: [
      'English nouns (WordNet)',
    ]
  },
  {
    label: 'Generated: speed and shape tests',
    graphs: [
      'Binary',
      'Grid 100x100 (10k)',
      'Binary tree (8k)',
      'Scale-free tree (10k)',
      'Watts-Strogatz (10k)',
      'Barabasi-Albert (20k)',
      'Barabasi-Albert (100k)',
      'Cube 20x20x20 (8k)',
      'Groups 8x250 (2k)',
      'Many pieces (300)',
    ]
  },
  {
    label: 'SuiteSparse matrices: grids and meshes',
    graphs: [
      'HB/blckhole',
      'HB/lshp1882',
      'Bai/dw256A',
      'HB/dwt_419',
      'HB/plat1919',
      'Nasa/barth5',
    ]
  },
  {
    label: 'SuiteSparse matrices: rings, tubes and solids',
    graphs: [
      'Gset/G11',
      'Pothen/sphere3',
    ]
  },
  {
    label: 'SuiteSparse matrices: chains',
    graphs: [
      'GHS_indef/laser',
      'Bai/olm1000',
    ]
  },
  {
    label: 'SuiteSparse matrices: trees',
    graphs: [
      'HB/1138_bus',
      'Bai/qh882',
      'Hamm/add32',
    ]
  },
  {
    label: 'SuiteSparse matrices: hubs and stars',
    graphs: [
      'HB/fs_541_1',
      'Meszaros/gams30a',
      'JGD_Homology/cis-n4c6-b15',
      'Rajat/rajat14',
    ]
  },
  {
    label: 'SuiteSparse matrices: groups',
    graphs: [
      'HB/west0497',
      'LPnetlib/lp_share2b',
      'LPnetlib/lp_ship12s',
      'Pajek/SmallW',
    ]
  },
  {
    label: 'SuiteSparse matrices: many pieces',
    graphs: [
      'Pajek/CSphd',
      'Bai/tols2000',
      'Barabasi/NotreDame_yeast',
      'JGD_SPG/08blocks',
      'HB/dwt_512',
    ]
  },
  {
    label: 'SuiteSparse matrices: real networks',
    graphs: [
      'Pajek/USpowerGrid',
      'Pajek/USAir97',
      'Pajek/Erdos02',
      'MathWorks/Harvard500',
      'Sandia/oscil_dcop_01',
      'Pajek/dictionary28',
    ]
  },
  {
    label: 'SuiteSparse matrices: blobs',
    graphs: [
      'Gset/G43',
      'HB/bcsstk02',
    ]
  },
  {
    label: 'Layout benchmark (the prototypes were judged on these)',
    graphs: [
      'Benchmark: starOfStars',
      'Benchmark: megaStars',
      'Benchmark: hubLeaves5k',
      'Benchmark: EVA',
      'Benchmark: paTree3k',
      'Benchmark: yeast',
      'Benchmark: sciMet',
      'Benchmark: erdos992',
      'Benchmark: CSphd',
      'Benchmark: protein',
      'Benchmark: caterpillars',
      'Benchmark: forest5k',
      'Benchmark: gridIsolates',
      'Benchmark: npmMix4',
      'Benchmark: communities',
      'Benchmark: sbm8x50',
      'Benchmark: grid20',
      'Benchmark: binTree8',
      'Benchmark: cliqueCircle',
      'Benchmark: ba500',
      'Benchmark: er1000',
      'Benchmark: rgg1500',
      'Benchmark: powerGrid',
      'Benchmark: java',
    ]
  },
];

// Nodes per graph, so the picker can say how big a graph is before it loads (counted once from the
// files; generated graphs say it in their name)
const nodeCounts = {
  'Mammals (WordNet)': 1165,
  'London Underground': 269,
  'Countries': 252,
  'Miserables': 77,
  'Chess openings': 3866,
  'US counties': 3144,
  'Languages of the world': 13090,
  'Metros of the world': 15758,
  'English nouns (WordNet)': 74241,
  'Binary': 2047,
  'HB/blckhole': 2121,
  'HB/lshp1882': 1882,
  'Bai/dw256A': 512,
  'HB/dwt_419': 419,
  'HB/plat1919': 1919,
  'Nasa/barth5': 15606,
  'Gset/G11': 800,
  'Pothen/sphere3': 258,
  'GHS_indef/laser': 3002,
  'Bai/olm1000': 1000,
  'HB/1138_bus': 1138,
  'Bai/qh882': 882,
  'Hamm/add32': 4960,
  'HB/fs_541_1': 541,
  'Meszaros/gams30a': 531,
  'JGD_Homology/cis-n4c6-b15': 920,
  'Rajat/rajat14': 180,
  'HB/west0497': 497,
  'LPnetlib/lp_share2b': 162,
  'LPnetlib/lp_ship12s': 2869,
  'Pajek/SmallW': 233,
  'Pajek/CSphd': 1882,
  'Bai/tols2000': 2000,
  'Barabasi/NotreDame_yeast': 1846,
  'JGD_SPG/08blocks': 300,
  'HB/dwt_512': 511,
  'Pajek/USpowerGrid': 4941,
  'Pajek/USAir97': 332,
  'Pajek/Erdos02': 5534,
  'MathWorks/Harvard500': 500,
  'Sandia/oscil_dcop_01': 426,
  'Pajek/dictionary28': 39327,
  'Gset/G43': 1000,
  'HB/bcsstk02': 66,
  'Benchmark: starOfStars': 4795,
  'Benchmark: megaStars': 7237,
  'Benchmark: hubLeaves5k': 5000,
  'Benchmark: EVA': 7253,
  'Benchmark: paTree3k': 3000,
  'Benchmark: yeast': 2284,
  'Benchmark: sciMet': 2729,
  'Benchmark: erdos992': 5094,
  'Benchmark: CSphd': 1882,
  'Benchmark: protein': 2031,
  'Benchmark: caterpillars': 3760,
  'Benchmark: forest5k': 5000,
  'Benchmark: gridIsolates': 1800,
  'Benchmark: npmMix4': 14009,
  'Benchmark: communities': 360,
  'Benchmark: sbm8x50': 400,
  'Benchmark: grid20': 400,
  'Benchmark: binTree8': 511,
  'Benchmark: cliqueCircle': 96,
  'Benchmark: ba500': 500,
  'Benchmark: er1000': 998,
  'Benchmark: rgg1500': 1500,
  'Benchmark: powerGrid': 4941,
  'Benchmark: java': 1538,
};

export default function getAvailableGraphs() {
  return graphGroups.flatMap(group => group.graphs);
}

/** 'Mammals (WordNet) · 1.2k': the name with its size, unless the name already says it */
export function graphTitle(name) {
  let count = nodeCounts[name];
  if (!count || /\(\d+k?\)$/.test(name)) return name;
  return `${name} · ${formatCount(count)}`;
}

export function nodeCountOf(name) {
  return nodeCounts[name] || 0;
}

function formatCount(n) {
  if (n < 1000) return String(n);
  if (n < 10000) return (Math.round(n / 100) / 10) + 'k';
  return Math.round(n / 1000) + 'k';
}
