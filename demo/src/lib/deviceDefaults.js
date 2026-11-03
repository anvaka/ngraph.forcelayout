// The demo's first settings for the device it runs on. These are the demo's choice: the library
// keeps its own defaults (lib/, README), and a value in the URL always wins over both.
//
// Every device gets the same physics (the library's Euler integrator, dual tree repulsion, pivot
// MDS start). What differs is where it runs and how much work a frame may do:
//
// - WebGPU when the browser has a hardware adapter, else the CPU;
// - steps per frame 0, "auto": as many steps as fit in `frameBudget` ms of measured step time,
//   1 to `maxAutoSteps`. A handheld device (coarse pointer, no hover) gets half the desktop
//   budget: its CPU is slower, its battery smaller, and its frame has to draw too.
//
// The FIRE integrator is not picked although it settles connected graphs sooner: it throws the
// pieces of disconnected graphs out of view within seconds.

// What the demo runs with when nothing picks for it: the library's defaults
export const libraryChoice = {
  nbody: 'quadtree',
  placement: 'default',
  backend: 'cpu',
  stepsPerFrame: 1
};

// Settings that the device decides, unless the URL or the visitor does
export const deviceKeys = Object.keys(libraryChoice);

export const maxAutoSteps = 10;

// What a page can read about the device without asking anything
export function readSignals(win = globalThis) {
  let nav = win.navigator || {};
  let media = query => !!(win.matchMedia && win.matchMedia(query).matches);
  let screen = win.screen || {};
  return {
    // presence only: probeWebGPU() checks that there is an adapter
    webgpu: !!nav.gpu,
    coarsePointer: media('(pointer: coarse)'),
    hover: media('(hover: hover)'),
    reducedMotion: media('(prefers-reduced-motion: reduce)'),
    // Chromium only; undefined elsewhere
    deviceMemory: nav.deviceMemory,
    saveData: !!(nav.connection && nav.connection.saveData),
    cores: nav.hardwareConcurrency,
    screen: [screen.width, screen.height],
    pixelRatio: win.devicePixelRatio || 1
  };
}

export function pickDefaults(signals) {
  // A phone or a tablet: the main pointer is a finger. A touch laptop with a mouse has hover.
  let handheld = signals.coarsePointer && !signals.hover;
  return {
    profile: handheld ? 'handheld' : 'desktop',
    nbody: 'dualtree',
    placement: 'pivot',
    backend: signals.webgpu ? 'webgpu' : 'cpu',
    stepsPerFrame: 0,
    frameBudget: handheld ? 4 : 8
  };
}

// navigator.gpu can be there without a usable GPU: no adapter (blocklisted driver, WebGPU off),
// or a software one, which runs the layout slower than the CPU does
export async function probeWebGPU(nav = globalThis.navigator) {
  if (!nav || !nav.gpu) return false;
  try {
    let adapter = await nav.gpu.requestAdapter({powerPreference: 'high-performance'});
    if (!adapter) return false;
    let software = adapter.info ? adapter.info.isFallbackAdapter : adapter.isFallbackAdapter;
    return !software;
  } catch (e) {
    return false;
  }
}

// Steps for the next frame: a fixed number, or for 0 ("auto") as many as fit in the budget at the
// measured ms per step (none measured yet: one step)
export function stepsForFrame(stepsPerFrame, msPerStep, frameBudget) {
  if (stepsPerFrame > 0) return stepsPerFrame;
  if (!(msPerStep > 0)) return 1;
  return Math.max(1, Math.min(maxAutoSteps, Math.floor(frameBudget / msPerStep)));
}
