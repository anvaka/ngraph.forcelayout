// A pair formula (simulator.addPairFormula) in WGSL, for a gather: one thread works for one body
// ("me") and visits the other bodies near it ("other"). The CPU runs the formula once per pair,
// with i the lower store row, and adds the push and the accumulations to both ends. A gather
// runs it at both ends instead, and each end keeps only what lands on its own row:
//
//  - the i-variant: me is i (`x_i` reads me, `x_j` the other body); it keeps `x_i += v`;
//  - the j-variant: me is j (`x_i` reads the other body, `x_j` me); it keeps `x_j += v`.
//
// A symmetric stage uses the i-variant when my store row is lower than the other's and the
// j-variant otherwise, so both ends evaluate the formula with the CPU's roles and get the same
// push. A one-sided stage (symmetric: false) runs for (i, j) and for (j, i) on the CPU, each run
// pushing body i: me is always i. Either way the caller adds `push / r * (pos_me - pos_other)` to
// my force, and pairs at r = 0 are skipped before the formula, as on the CPU.
//
// The printed code reads `pair_r`, assigns `pair_push` and adds into `pair_acc_<column>`
// (`pair_acc_<column>_<k>` for vectors), all declared by the caller. Both regimes print through
// here: the one-kernel step's all-pairs loop below N*, and the chunk kernel of the cell sort
// above it (wgsl.js).
import formula from '../../../lib/formula.js';

/**
 * The columns a pair stage adds into, with their widths (1 or D): what a pass adds up per body.
 */
export function pairAccumulators(stage, D, columns) {
  const out = [];
  stage.writes.forEach(write => {
    if (write.space !== 'nodes' || write.mode !== 'add' || write.column === 'force' || write.via) return;
    if (out.some(a => a.column === write.column)) return;
    const column = columns[write.column];
    const width = column && column.width === 'D' ? D : 1;
    out.push({ column: write.column, width, startAtZero: (stage.args.startAtZero || []).indexOf(write.column) >= 0 });
  });
  return out;
}

/**
 * The columns a pair formula reads at either end (pos excluded): what a gather needs of the
 * other body, and of me.
 */
export function pairReads(stage) {
  const out = [];
  stage.reads.forEach(read => {
    if (read.space !== 'nodes' || read.column === 'pos' || out.indexOf(read.column) >= 0) return;
    out.push(read.column);
  });
  return out;
}

/**
 * The WGSL of `stage`'s formula for a gather. `options`:
 *  - D, printer (a WGSL printer, wgsl/print.js), columns: name -> {width} (program().columns);
 *  - read(column, who, k): the k-th number of `column` of 'me' or 'other', as formulas see it
 *    (positions with the origin added);
 *  - param(name), builtIn(name), sum(name, k): the stage's numbers.
 * Returns {i, j, accumulators, reads}: `i` and `j` are lists of WGSL statements (`j` is null
 * for a one-sided stage). Throws what the GPU cannot print.
 */
export function printPairFormula(stage, options) {
  const { D, printer } = options;
  if (stage.tables && stage.tables.length) throw new Error('WebGPU does not run lookup tables in pair formulas yet');
  const symmetric = stage.args.symmetric !== false;
  const accumulators = pairAccumulators(stage, D, options.columns);
  const variant = role => formula.compile(stage.formula, scope(stage, options, role, accumulators), printer).lines;
  return {
    i: variant('i'),
    j: symmetric ? variant('j') : null,
    accumulators,
    reads: pairReads(stage),
  };
}

/**
 * The name the printed code adds into for `column` (its k-th number for vectors).
 */
export function accumulatorName(column, k, width) {
  return width === 1 ? `pair_acc_${column}` : `pair_acc_${column}_${k}`;
}

// What names mean when me plays `role` ('i' or 'j')
function scope(stage, options, role, accumulators) {
  const { D, columns } = options;
  const who = end => (end === role ? 'me' : 'other');
  return {
    D,
    name(key) {
      if (key === 'r') return { type: 'num', code: 'pair_r' };
      if (key === 'push') {
        return { type: 'num', code: 'pair_push', write: (op, value) => [`pair_push ${op} ${value.code};`] };
      }
      const end = /^(\w+)_([ij])$/.exec(key);
      if (end && (end[1] === 'pos' || (columns[end[1]] && !columns[end[1]].hidden))) return endName(end[1], end[2]);
      if (stage.params.some(p => p.name === key)) return { type: 'num', code: options.param(key) };
      if (options.sumWidth && options.sumWidth(key)) {
        const width = options.sumWidth(key);
        const codes = Array.from({ length: width }, (_, k) => options.sum(key, k));
        return width === 1 ? { type: 'num', code: codes[0] } : { type: 'vec', codes };
      }
      if (stage.builtIns.indexOf(key) >= 0) return { type: 'num', code: options.builtIn(key) };
      return undefined;
    },
  };

  function endName(column, end) {
    const info = column === 'pos' ? { width: 'D' } : columns[column];
    const width = info.width === 'D' ? D : 1;
    const accumulator = accumulators.find(a => a.column === column);
    // a formula never reads what it adds into (the library refuses it), so those have no value
    const codes = Array.from({ length: width }, (_, k) => (accumulator ? 'pair_unread' : options.read(column, who(end), k)));
    // my end's accumulations go into the pass's sum; the other end's are left to the other body
    const write = accumulator ? (op, value) => {
      if (end !== role) return [];
      const values = value.codes || [value.code];
      return Array.from({ length: width }, (_, k) => `${accumulatorName(column, k, width)} ${op} ${values[k]};`);
    } : null;
    const out = width === 1 ? { type: 'num', code: codes[0] } : { type: 'vec', codes };
    if (write) {
      out.write = write;
      out.ops = ['+=', '-='];
    }
    return out;
  }
}
