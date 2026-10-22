// Experimental layout ideas, one folder each (see README.md). They are demo code, not part of
// the library. Each folder's index.js is picked up here, so adding one needs no other edits.
const modules = import.meta.glob('./*/index.js', { eager: true });

export default Object.values(modules)
  .map(module => module.default)
  .filter(Boolean)
  .sort((a, b) => a.title.localeCompare(b.title));
