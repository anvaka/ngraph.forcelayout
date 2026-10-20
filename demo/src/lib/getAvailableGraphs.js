// One or two graphs per look. Names with a slash are downloaded from the
// SuiteSparse collection mirror; the rest are generated in loadGraph.js.
export default function getAvailableGraphs() {
  return [
    'Miserables',
    'Binary',

    // Grids and meshes
    'Grid 100x100 (10k)',
    'HB/blckhole',
    'HB/lshp1882',
    'Bai/dw256A',
    'HB/dwt_419',
    'HB/plat1919',
    'Nasa/barth5',

    // Rings, tubes and solids
    'Gset/G11',
    'Pothen/sphere3',
    'Cube 20x20x20 (8k)',

    // Chains
    'GHS_indef/laser',
    'Bai/olm1000',

    // Trees
    'Binary tree (8k)',
    'HB/1138_bus',
    'Bai/qh882',
    'Hamm/add32',
    'Scale-free tree (10k)',

    // Hubs and stars
    'Barabasi-Albert (20k)',
    'Barabasi-Albert (100k)',
    'HB/fs_541_1',
    'Meszaros/gams30a',
    'JGD_Homology/cis-n4c6-b15',
    'Rajat/rajat14',

    // Groups
    'HB/west0497',
    'LPnetlib/lp_share2b',
    'LPnetlib/lp_ship12s',
    'Pajek/SmallW',
    'Groups 8x250 (2k)',

    // Many pieces
    'Pajek/CSphd',
    'Bai/tols2000',
    'Barabasi/NotreDame_yeast',
    'JGD_SPG/08blocks',
    'HB/dwt_512',
    'Many pieces (300)',

    // Real networks
    'Pajek/USpowerGrid',
    'Pajek/USAir97',
    'Pajek/Erdos02',
    'MathWorks/Harvard500',
    'Sandia/oscil_dcop_01',
    'Pajek/dictionary28',

    // Blobs
    'Watts-Strogatz (10k)',
    'Gset/G43',
    'HB/bcsstk02',
  ];
}
