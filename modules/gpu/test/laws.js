// The test laws of T3 and T4: PR #105's 48 law/dimension byte checks (check-formulas/lawbytes.js
// of the GPU work), as the fixtures recorded them.
export const LAWS = [
  null, 'r^-2', 'r^-1', 'exp(-r / L) / r^2', 'sqrt(1 + K * r * r) / r^2', 'r^(1 - D) * L^(D - 3)',
  'c * T(mu * r) / r', 'r^-p', 'exp(-r / L) / r^2|range', 'min(r, L) / r^3', 'abs(r - L) / r^2', 'tanh(r / L) / r',
  'pow(r, -p) * cos(r / L)', 'log(1 + r) / r^2', '2 / (r * r + L)', '-1 / r^2',
];

export const DIMS = [2, 3, 4];

// Every parameter is 1.5, a range is '4 * L', T is a JS function
export function spec(text) {
  if (text === null) return null;
  const [force, range] = text.split('|');
  const params = {};
  for (const name of ['L', 'K', 'p', 'mu', 'c']) if (new RegExp('\\b' + name + '\\b').test(force)) params[name] = 1.5;
  const s = { force, params };
  if (range) s.range = '4 * L';
  if (force.includes('T(')) s.functions = { T: { value: x => x, derivative: () => 1 } };
  return s;
}

/** File-safe id: index and a slug of the text. */
export function lawId(index) {
  const text = LAWS[index];
  const slug = text === null ? 'default' : text.replace(/\^/g, 'pow').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
  return String(index).padStart(2, '0') + '-' + slug;
}

/** A step context for law.update(), with the library's default settings. */
export function lawContext(dimensions) {
  const settings = { dimensions, timeStep: 0.5, springLength: 10, springCoefficient: 0.8, dragCoefficient: 0.9, gravity: -12, maxVelocity: 4, theta: 0.8 };
  const ctx = { settings, store: { n: 100, D: dimensions }, unit: () => 10, iteration: () => 0 };
  for (const key of Object.keys(settings)) ctx[key] = () => settings[key];
  return ctx;
}

// The printings that changed on purpose since the fixtures were recorded: tanh is clamped, as
// Metal's tanh is NaN from 45 (wgsl/print.js). Undoing them must give the recorded text.
export function undoSafePrintings(text) {
  return text.replace(/tanh\(clamp\(([^()]*), -10\.0, 10\.0\)\)/g, 'tanh($1)');
}
