// What is published, and what the page may say because of it. npm's ngraph.forcelayout is 3.3.1
// (2022-10-04): it has none of main's speed-ups (maxVelocity, integrator, nbody), and the add-ons
// in modules/ (WebGPU, pivot start, view) are private, not on npm. Flip RELEASED when a release
// with this page's library is on npm; every line below follows.
export const RELEASED = false;

// Works as written: from npm once released, until then main from GitHub
export const installLine = RELEASED ? 'npm i ngraph.forcelayout' : 'npm i anvaka/ngraph.forcelayout';
export const installNote = RELEASED
  ? ''
  : 'Installs main from GitHub: npm’s 3.3.1 (2022) has no dual tree, FIRE or maxVelocity. The add-ons are in modules/ of the repository.';

// How Settings name the library's own defaults
export const libraryDefaultLabel = RELEASED ? 'library default' : 'library default on main';

export const pitch = 'Force-directed graph layout for JavaScript. 2D, 3D, any dimension. WebGPU add-on.';
