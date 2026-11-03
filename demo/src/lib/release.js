// What is published, and what the page may say because of it. npm's ngraph.forcelayout is 3.3.1
// (2022-10-04): it has none of main's speed-ups (maxVelocity, integrator, nbody), and the add-ons
// in modules/ (WebGPU, pivot start, view) are private, not on npm. Flip RELEASED when a release
// with this page's library is on npm; every line below follows.
export const RELEASED = false;

// The commit the demo was built from (vite.config.js), or '' (tests, a build outside git)
// eslint-disable-next-line no-undef
export const COMMIT = typeof __DEMO_COMMIT__ === 'string' ? __DEMO_COMMIT__ : '';

// Works as written: from npm once released, until then the commit that built this page, from
// GitHub. The title and the copied code use this same line.
export const installLine = RELEASED ? 'npm i ngraph.forcelayout'
  : COMMIT ? `npm i anvaka/ngraph.forcelayout#${COMMIT}` : 'npm i anvaka/ngraph.forcelayout';
export const installNote = RELEASED
  ? ''
  : 'Installs the commit that drew this page from GitHub: npm’s 3.3.1 (2022) has no dual tree, FIRE or maxVelocity. The add-ons are in modules/ of the repository.';

// How Settings name the library's own defaults
export const libraryDefaultLabel = RELEASED ? 'library default' : 'library default on main';
export const libraryDefaultsLabel = RELEASED ? 'library defaults' : 'library defaults on main';

export const pitch = 'Force-directed graph layout for JavaScript. 2D, 3D, any dimension. WebGPU add-on.';
// The line under the name and the install line: one line on a phone and in the 360 px panel
export const pitchShort = 'Force-directed graph layout for JavaScript.';
