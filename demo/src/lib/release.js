// What is published, and what the page may say because of it. npm's ngraph.forcelayout is 4.0.0
// (2026-11-22): it has everything this page uses of the library. The add-ons in modules/
// (WebGPU, pivot start, view) are private, not on npm; the copied code clones them.
//
// Set RELEASED back to false when the page starts to use something of the library that the
// latest release on npm doesn't have: the install line then names the commit that built the
// page, and every line below follows.
export const RELEASED = true;

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
