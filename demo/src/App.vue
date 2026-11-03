<template>
  <section aria-label='Graph and settings' :class='{"settings-open": settingsOpen, "panel-folded": panelFolded}'>
    <!-- First after the canvas in Tab order: the controls that act on the canvas -->
    <!-- Not an overlay: they cover the canvas, so the fit, labels and the card keep clear of them -->
    <div class='canvas-tools'>
      <button v-if='!following' class='tool fit-view' @click='fitView'
        title='Show the whole graph, and follow it as the layout moves (0)'>Fit graph</button>
      <button class='tool' @click='toggleHelp' :aria-expanded='helpOpen ? "true" : "false"' aria-label='Keys and gestures' title='Keys and gestures (?)'>?</button>
      <button class='tool' @click='openSearch' aria-label='Find a node' title='Find a node (/)'>
        <svg aria-hidden='true' viewBox='0 0 16 16' width='16' height='16'><circle cx='6.5' cy='6.5' r='4.5' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M10 10l4 4' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/></svg>
      </button>
    </div>
    <div class='title-row'>
      <div class='name-line'>
        <h2><a href='https://github.com/anvaka/ngraph.forcelayout#readme'>ngraph.forcelayout</a></h2>
        <button type='button' class='install' @click='copyInstall' :title='installNote || "Copy the install command"'
          :aria-label='"Copy the install command: " + installLine'><code>{{copied ? 'copied' : installLine}}</code></button>
      </div>
      <p class='pitch' v-if='showPitch'>{{pitchShort}}</p>
    </div>
    <div class='layout-box'>
      <div class='buttons graph-row'>
        <label class='graph-picker'>
          <span class='visually-hidden'>Graph</span>
          <select v-model='graphChoice' ref='graphSelect' @keydown='pickerKey = $event.key' @pointerdown='pickerKey = ""'>
            <option v-if='fileName' value='__file__'>{{fileName}}</option>
            <option value='__open__'>Your graph: open a .dot or .json file…</option>
            <optgroup v-for='group in graphGroups' :key='group.label' :label='group.label'>
              <option v-for='graph in group.graphs' :key='graph' :value='graph'>{{graphTitle(graph)}}</option>
            </optgroup>
          </select>
        </label>
        <input type='file' ref='fileInput' class='visually-hidden' accept='.dot,.gv,.json' tabindex='-1' aria-hidden='true' @change='onFilePicked'>
        <button @click='toggleLayoutRun' class='btn'>{{isRunning ? 'Pause' : 'Run'}}</button>
        <button @click='restart' class='btn restart' title='Start over from initial positions'>Reset</button>
      </div>
      <div class='buttons idea-bar' v-if='prototype'>
        <label class='graph-picker' title='Layout idea to try'>
          <select v-model='prototypeId'>
            <option v-for='option in prototypeOptions' :key='option.value' :value='option.value'>{{option.label}}</option>
          </select>
        </label>
        <label class='idea-toggle' :class='{inactive: !prototype}'
          title='Turn the idea off and on: the layout restarts from the same start, so you can compare'>
          <input type='checkbox' v-model='prototypeOn' :disabled='!prototype'> on
        </label>
        <help-icon @show='aboutOpen = !aboutOpen' :class='{open: aboutOpen}'></help-icon>
      </div>
      <div class='about idea-about' v-if='aboutOpen && prototype'>
        <div v-if='prototype' v-html='prototype.description'></div>
        <template v-else>
          Experimental changes to the layout, one per folder in <code>demo/src/prototypes</code>.
          Picking an idea restarts the layout from the same start as <b>none</b>; the <b>on</b> box
          turns it off and on again, so you can compare the two. Its parameters are under Settings;
          changing one carries on from the current drawing, and Reset starts over.
        </template>
      </div>
      <div class='stats stats-row'>
        <div v-if='loading' role='status'>Loading {{graphTitle(selectedGraph)}}…</div>
        <div v-else-if='stats' class='stats-text'>
          <div>{{stats.nodes.toLocaleString()}} nodes · {{stats.links.toLocaleString()}} links<span class='placement' v-if='stats.placement'> · {{stats.placement}} start</span></div>
          <div :title='speedTitle'>{{speedLine}}</div>
          <div v-if='stats.gpuReasons' class='off-gpu'>Runs on the CPU: {{stats.gpuReasons}}.</div>
          <div v-if='fileError' class='off-gpu file-error' role='alert'>{{fileError}}</div>
          <div v-if='gpuNote' class='off-gpu' role='status'>{{gpuNote}}</div>
        </div>
      </div>
      <div class='controls-row'>
        <div class='switch' role='group' aria-label='Dimensions'>
          <button type='button' :aria-pressed='layoutSettings.dimensions === 2 ? "true" : "false"' @click='setDimensions(2)'>2D</button>
          <button type='button' :aria-pressed='layoutSettings.dimensions === 3 ? "true" : "false"' @click='setDimensions(3)'>3D</button>
        </div>
        <div class='switch' role='group' aria-label='Run the layout on'>
          <button type='button' :aria-pressed='backend === "cpu" ? "true" : "false"' @click='backend = "cpu"'
            title='The library itself, on the CPU'>CPU</button>
          <button type='button' :aria-pressed='backend === "webgpu" ? "true" : "false"' :aria-disabled='gpuAvailable === false ? "true" : null'
            @click='pickGpu' title='The WebGPU add-on (modules/gpu)'>GPU</button>
        </div>
        <button @click='settingsOpen = !settingsOpen' class='toggle-settings' :class='{tuned: !settingsOpen && changedCount > 0}'
          :aria-expanded='settingsOpen ? "true" : "false"' aria-controls='settings'
          :aria-label='!settingsOpen && changedCount ? `Settings, ${changedCount} changed` : null'>Settings<span class='changed-count' v-if='!settingsOpen && changedCount'> · {{changedCount}} changed</span><span aria-hidden='true'> {{settingsOpen ? '▴' : '▾'}}</span></button>
      </div>
      <div class='about-line' v-if='info && !loading'>
        <p class='about-text' id='about-text' v-if='info.about' :class='{open: aboutTextOpen, "with-legend": !!(legendData && legendData.items.length)}' @click='aboutTextOpen = !aboutTextOpen'>{{info.about}}</p>
        <legend-row v-if='legendData && legendData.items.length' :title='legendData.title' :items='legendData.items'
          :more='legendData.more ? legendData.more.count : 0'>
          <button type='button' class='about-toggle' v-if='info.about' @click='aboutTextOpen = !aboutTextOpen'
            :aria-expanded='aboutTextOpen ? "true" : "false"' aria-controls='about-text' aria-label='About this graph'>ⓘ</button>
        </legend-row>
        <div class='credit' v-if='info.credit'>Data: <a :href='info.credit.href' target='_blank' rel='noopener'>{{info.credit.text}}</a></div>
      </div>
    </div>
    <!-- Phones: the panel folds to one line, out of the drawing's way (a tap or a swipe up), and
         unfolds by a tap or a swipe down -->
    <button type='button' class='panel-fold' @click='onFoldClick' @pointerdown='onFoldDown' @pointermove='onFoldMove'
      @pointerup='onFoldUp' @pointercancel='onFoldUp' :aria-expanded='panelFolded ? "false" : "true"'
      :aria-label='panelFolded ? "Show the panel (" + foldTitle + ")" : "Hide the panel"' :title='panelFolded ? "Show the panel" : "Hide the panel"'>
      <span class='fold-title' v-if='panelFolded'>{{foldTitle}}</span>
      <span class='fold-chevron' v-if='panelFolded' aria-hidden='true'>Show</span>
      <span class='grip' aria-hidden='true'></span>
    </button>
    <div class='content sheet' id='settings' v-if='settingsOpen' ref='sheet' @focusin='onSettingsFocus'>
      <code-settings :settings='layoutSettings' :steps-per-frame='stepsPerFrame' :auto-now='stats ? stats.stepsPerFrame : 0'
        :frame-budget='device.frameBudget' :placement='placement' :backend='backend' :gpu-available='gpuAvailable !== false'
        :gpu-message='gpuMessage' :install-line='installLine' :install-note='installNote' :library-default-label='libraryDefaultLabel'
        :describe='describeProgram' :program-key='programKey'
        @set='setSetting' @reset='resetSettings' @speedups='useDeviceDefaults'></code-settings>

      <template v-if='prototypes.length && !prototype'>
        <div class='section'>
          Layout ideas
          <small><a href='https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/src/prototypes'>experiments, not part of the library</a></small>
        </div>
        <input-select label='Try an idea' v-model='prototypeId' :options='prototypeOptions'>
          Experimental changes to the layout, one per folder in <code>demo/src/prototypes</code>.
          Picking an idea restarts the layout from the same start as <b>none</b>, and puts it at
          the top of the panel; its <b>on</b> box turns it off and on again, so you can compare the two.
        </input-select>
      </template>

      <template v-if='prototype'>
        <div class='section'>
          Idea settings
          <small><a href='https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/src/prototypes'>ideas to try, not part of the library</a></small>
        </div>
        <div class='prototype'>
          <div v-if='!prototypeOn' class='off-note'>The idea is off: turn it on at the top to use these.</div>
          <div v-else-if='stats && stats.gpuReasons' class='off-note'>Runs on the CPU: {{stats.gpuReasons}}.</div>
          <div v-if='prototype.tryGraphs' class='try'>
            Try on:
            <a href='#' v-for='name in prototype.tryGraphs' :key='name' @click.prevent='selectedGraph = name'>{{shortGraphName(name)}}</a>
          </div>
          <input-value v-for='param in prototype.params || []' :key='param.key'
            :label='param.label' :step='param.step || "0.1"' v-model='prototypeParams[param.key]'>
            {{param.help}}
          </input-value>
          <a href='#' v-if='stats && stats.canFinishPrototype' class='finish' @click.prevent='finishPrototype'>
            {{prototype.finishLabel || 'Run final step'}}
          </a>
        </div>
      </template>
      <button type='button' class='settings-done' @click='settingsOpen = false'>Done</button>
    </div>
  </section>
</template>

<script>
import createGraphScene from './lib/createGraphScene';
import {graphGroups, graphTitle} from './lib/getAvailableGraphs';
import graphInfo from './lib/graphInfo';
import {libraryDefaultLabel, libraryDefaultsLabel, pitchShort, installLine, installNote} from './lib/release';
import loadDroppedGraph from './lib/loadDroppedGraph';
import CodeSettings from './components/CodeSettings.vue';
import './styles/layout.css';
import loadGraph from './lib/loadGraph';
import bus from './lib/bus';
import queryState from 'query-state';
import InputValue from './components/InputValue.vue';
import InputSelect from './components/InputSelect.vue';
import HelpIcon from './components/HelpIcon.vue';
import LegendRow from './components/LegendRow.vue';
import prototypes from './prototypes';
import {libraryChoice, deviceKeys, maxAutoSteps, readSignals, pickDefaults, probeWebGPU} from './lib/deviceDefaults';

const DEFAULTS = {
  graph: 'Mammals (WordNet)',
  timeStep: 0.5,
  springLength: 10,
  springCoefficient: 0.8,
  dragCoefficient: 0.9,
  dimensions: 2,
  theta: 0.8,
  gravity: -12,
  maxVelocity: 4,
  integrator: 'euler',
  // nbody, placement, backend and stepsPerFrame have no defaults here: the device picks them
  // (deviceDefaults.js), and they are in the URL only when the link or the visitor sets them
  prototype: 'none',
};

// The address keeps only what differs from the defaults, so a shared link says what was changed
// (and a later change of a default reaches old links)
let urlState = queryState({}, { useSearch: true });
let appState = {
  get(key) {
    let value = urlState.get(key);
    return value === undefined ? DEFAULTS[key] : value;
  },
  set(key, value) {
    if (key in DEFAULTS && DEFAULTS[key] === value) urlState.unset(key);
    else urlState.set(key, value);
  },
  unset: key => urlState.unset(key),
  has: key => urlState.get(key) !== undefined
};
// The physics settings, as the page starts them
const PHYSICS = ['timeStep', 'springLength', 'springCoefficient', 'dragCoefficient', 'dimensions', 'theta', 'gravity', 'maxVelocity', 'integrator'];
// Pixels a swipe on the panel's fold button travels before it folds or unfolds the panel
const FOLD_SWIPE = 16;
const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

const deviceChoice = pickDefaults(readSignals());
// Device settings the URL doesn't set: they follow the device until the visitor changes them
const pickedByDevice = Object.fromEntries(deviceKeys.map(key => [key, appState.get(key) === undefined]));

function startValue(key) {
  return pickedByDevice[key] ? deviceChoice[key] : appState.get(key);
}

function startsFolded() {
  return typeof matchMedia === 'function' && matchMedia('(max-width: 500px) and (max-height: 700px), (max-height: 500px)').matches;
}

function formatSeconds(seconds) {
  return seconds < 10 ? `${seconds.toFixed(1)} s` : `${Math.round(seconds)} s`;
}

// Prototype parameters live in the URL as p.<key>
const PARAM_PREFIX = 'p.';

function findPrototype(id) {
  return prototypes.find(p => p.id === id) || null;
}

function getPrototypeParams(prototype, fromUrl) {
  let params = {};
  if (!prototype) return params;
  (prototype.params || []).forEach(param => {
    let saved = fromUrl ? appState.get(PARAM_PREFIX + param.key) : undefined;
    params[param.key] = Number.isFinite(saved) ? saved : param.value;
  });
  return params;
}

export default {
  name: 'app',
  components: {
    InputValue,
    InputSelect,
    CodeSettings,
    HelpIcon,
    LegendRow
  },
  computed: {
    onGpu() {
      return this.backend === 'webgpu';
    },
    usesFire() {
      return this.layoutSettings.integrator === 'fire';
    },
    integratorOptions() {
      return [{value: 'euler', label: `euler (${libraryDefaultLabel})`}, {value: 'fire', label: 'fire'}];
    },
    nbodyOptions() {
      return [{value: 'quadtree', label: `quad tree (${libraryDefaultLabel})`}, {value: 'dualtree', label: 'dual tree'}];
    },
    placementOptions() {
      return [{value: 'default', label: libraryDefaultLabel}, {value: 'pivot', label: 'pivot MDS (add-on)'}];
    },
    // The picker's value: a graph's name, or the file that was dropped
    // What the folded panel says: the graph on screen
    foldTitle() {
      return this.fileName || graphTitle(this.selectedGraph);
    },
    graphChoice: {
      get() {
        return this.fileName ? '__file__' : this.selectedGraph;
      },
      set(value) {
        if (value === '__open__') {
          // Arrow keys change a closed select on some systems: only a click or Enter opens the dialog
          if (!/^Arrow|^Page|^Home$|^End$/.test(this.pickerKey || '')) {
            this.$refs.fileInput.value = '';
            this.$refs.fileInput.click();
          }
          this.$nextTick(() => { this.$refs.graphSelect.value = this.graphChoice; });
          return;
        }
        if (value === '__file__') return;
        this.fileName = '';
        this.fileError = '';
        if (value === this.selectedGraph) this.loadNewGraph(value);
        else this.selectedGraph = value;
      }
    },
    // "2,140 steps · 612 steps/s · 60 fps · WebGPU", or how it settled
    speedLine() {
      let s = this.stats;
      if (!s) return '';
      let where = s.backend === 'webgpu' ? 'WebGPU' : 'CPU';
      let steps = `${s.steps.toLocaleString()} steps`;
      if (s.settled) {
        return s.settled.seconds > 0
          ? `Settled in ${formatSeconds(s.settled.seconds)} · ${steps} · ${where}`
          : `Settled · ${steps} · ${where}`;
      }
      if (!this.isRunning) return `Paused · ${steps} · ${where}`;
      let rate = s.rate;
      if (!rate) return `${steps} · ${where}`;
      return `${steps} · ${Math.round(rate.stepsPerSecond).toLocaleString()} steps/s · ${Math.round(rate.fps)} fps · ${where}`;
    },
    speedTitle() {
      let s = this.stats;
      if (!s) return '';
      let parts = [];
      if (s.msPerStep) parts.push(`${this.formatMs(s.msPerStep)} ms of layout per step (${s.backend === 'webgpu' ? 'GPU time' : 'wall time'}).`);
      if (s.settled) {
        parts.push(s.settled.reason === 'noise'
          ? 'Only jitter is left, so the layout stopped. Drag a node or press Run to go on.'
          : 'The drawing stopped changing, so the layout stopped. Drag a node or press Run to go on.');
      }
      return parts.join(' ');
    },
    // The legend's first entries (the most common values), and how many more there are
    programKey() {
      return `${this.selectedGraph}|${this.fileName}|${this.loading}|${this.legendData ? 1 : 0}`;
    },
    // Settings that differ from what the page starts with (the button says so while closed)
    changedCount() {
      let physics = PHYSICS.filter(key => this.layoutSettings[key] !== DEFAULTS[key]).length;
      let device = deviceKeys.filter(key => !this.picked[key] && this.deviceValue(key) !== this.device[key]).length;
      return physics + device;
    },
    prototype() {
      return findPrototype(this.prototypeId);
    },
    // The idea the layout runs: the picked one, unless it is turned off
    activePrototype() {
      return this.prototypeOn ? this.prototype : null;
    },
    prototypeOptions() {
      return [{value: 'none', label: 'none'}].concat(prototypes.map(p => ({value: p.id, label: p.title})));
    },
    // One value for the watcher, so picking an idea (which also resets its parameters) restarts once
    prototypeConfig() {
      if (!this.activePrototype) return {id: 'none', params: {}};
      return {id: this.prototypeId, params: {...this.prototypeParams}};
    },
    backendOptions() {
      return [{value: 'cpu', label: 'CPU (library)'}, {value: 'webgpu', label: 'WebGPU (add-on)', disabled: this.gpuAvailable === false}];
    },
    // What still follows the device, e.g. "Picked for this device: dual tree, pivot MDS start, WebGPU, auto steps per frame."
    deviceSummary() {
      let names = {
        nbody: value => value === 'dualtree' ? 'dual tree' : 'quad tree',
        placement: value => value === 'pivot' ? 'pivot MDS start' : 'library start',
        backend: value => value === 'webgpu' ? 'WebGPU' : this.gpuAvailable === false ? 'CPU (no WebGPU here)' : 'CPU',
        stepsPerFrame: value => value === 0 ? 'auto steps per frame' : `${value} steps per frame`
      };
      let picked = deviceKeys.filter(key => this.picked[key]).map(key => names[key](this.device[key]));
      return picked.length ? `Picked for this device: ${picked.join(', ')}.` : '';
    },
    stepsNote() {
      if (this.stepsPerFrame !== 0) return '';
      let now = this.stats && this.stats.stepsPerFrame;
      return `Auto: ${now ? `${now} a frame now, ` : ''}as many as fit in ${this.device.frameBudget} ms.`;
    }
  },
  methods: {
    // Back to what the device picks: these settings leave the URL
    useDeviceDefaults() {
      deviceKeys.forEach(key => {
        this.picked[key] = true;
        appState.unset(key);
      });
      this.applyChoice(this.device);
    },

    // The library's own defaults, as a choice of the visitor (it goes into the URL)
    useLibraryDefaults() {
      Object.assign(this.layoutSettings, {maxVelocity: 4, integrator: 'euler'});
      this.applyChoice(libraryChoice);
    },

    applyChoice(choice) {
      this.layoutSettings.nbody = choice.nbody;
      this.placement = choice.placement;
      this.stepsPerFrame = choice.stepsPerFrame;
      this.backend = choice.backend;
    },

    // Writes a changed setting to the URL, except a device setting that still has the device's
    // value, and the CPU the demo fell back to (the link keeps asking for what it asked)
    remember(key, value) {
      if (this.fallback[key] === value) {
        delete this.fallback[key];
        return;
      }
      if (this.picked[key] && value === this.device[key]) return;
      if (key in this.picked) this.picked[key] = false;
      appState.set(key, value);
    },

    restart() {
      this.scene.restart();
    },

    graphTitle,

    // A value from the code: a layout option, or the demo's own (placement, backend, steps)
    setSetting(key, value) {
      if (key in this.layoutSettings) this.layoutSettings[key] = value;
      else if (key === 'backend' && value === 'webgpu') this.pickGpu();
      else this[key] = value;
    },

    setDimensions(dimensions) {
      this.layoutSettings.dimensions = dimensions;
    },

    // GPU, or say why not where a finger can read it (a title shows only on hover)
    pickGpu() {
      if (this.gpuAvailable === false) {
        this.gpuNote = 'This browser has no WebGPU, so the layout runs on the CPU.';
        clearTimeout(this.gpuNoteTimer);
        this.gpuNoteTimer = setTimeout(() => { this.gpuNote = ''; }, 6000);
        return;
      }
      this.backend = 'webgpu';
    },

    // What the copied program needs to load and draw the graph on screen as the demo does
    describeProgram() {
      let state = this.scene && this.scene.getDrawingState ? this.scene.getDrawingState() : {};
      return Object.assign({
        name: this.selectedGraph, fileName: this.fileName,
        base: new URL(import.meta.env.BASE_URL, location.href).href
      }, state);
    },

    // The soft keyboard covers the bottom of the screen: the field being typed in scrolls up into
    // what shows (its panel or Settings scroll), once the keyboard has opened
    onSettingsFocus(e) {
      let target = e.target;
      if (!target || !/^(INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) return;
      let vv = window.visualViewport;
      let reveal = () => {
        let bottom = vv ? vv.offsetTop + vv.height : window.innerHeight;
        let box = target.getBoundingClientRect();
        if (box.bottom > bottom - 8 || box.top < 0) target.scrollIntoView({block: 'center'});
      };
      if (vv) vv.addEventListener('resize', reveal, {once: true});
      setTimeout(reveal, 350);
    },

    copyInstall() {
      let done = () => {
        this.copied = true;
        clearTimeout(this.copiedTimer);
        this.copiedTimer = setTimeout(() => { this.copied = false; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(installLine).then(done, () => {});
    },

    // A swipe on the fold button folds (up) or unfolds (down) the panel; a tap toggles it
    onFoldDown(e) {
      this.foldFrom = e.clientY;
      this.foldSwiped = false;
      // The swipe goes on past the button's edge
      if (e.currentTarget.setPointerCapture) e.currentTarget.setPointerCapture(e.pointerId);
    },

    onFoldUp() {
      this.foldFrom = null;
    },

    onFoldMove(e) {
      if (this.foldFrom == null) return;
      let dy = e.clientY - this.foldFrom;
      if (Math.abs(dy) < FOLD_SWIPE) return;
      this.foldFrom = null;
      this.foldSwiped = true;
      this.panelFolded = dy < 0;
    },

    onFoldClick() {
      if (this.foldSwiped) {
        this.foldSwiped = false;
        return;
      }
      this.panelFolded = !this.panelFolded;
    },

    onFilePicked(e) {
      this.fileError = '';
      loadDroppedGraph(e.target.files);
    },

    deviceValue(key) {
      return key === 'nbody' ? this.layoutSettings.nbody : this[key];
    },

    // Every setting back to what the page starts with: the physics, and what the device picks
    resetSettings() {
      PHYSICS.forEach(key => { this.layoutSettings[key] = DEFAULTS[key]; });
      this.useDeviceDefaults();
    },

    openSearch() {
      this.scene.openSearch();
    },

    toggleHelp() {
      this.helpOpen = this.scene.toggleHelp();
    },

    onFileGraph(name) {
      this.fileName = name;
      this.fileError = '';
    },

    onFileError(message) {
      this.fileError = message;
    },

    hidePitch() {
      // On a phone the line goes once they use the canvas: the graph needs the room
      if (coarse) this.showPitch = false;
    },

    fitView() {
      this.scene.fitView();
    },

    finishPrototype() {
      // A final step means little while the layout keeps moving the nodes
      if (this.isRunning) this.toggleLayoutRun();
      this.scene.finishPrototype();
    },

    shortGraphName(name) {
      return name.replace(/^Benchmark: /, '');
    },

    formatMs(ms) {
      return ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : Math.round(ms);
    },

    updateStats() {
      if (!this.scene) return;
      this.stats = this.scene.getStats();
      // the layout stops by itself once it settles, and runs again when it wakes
      this.isRunning = this.stats.running;
      if (this.stats.gpuError && this.backend === 'webgpu') {
        // the GPU stopped (e.g. its device was lost): the scene carries on with the CPU
        this.gpuMessage = `WebGPU stopped (${this.stats.gpuError}), switched back to CPU.`;
        this.fallback.backend = 'cpu';
        this.backend = 'cpu';
      }
    },

    toggleLayoutRun() {
      this.isRunning = !this.isRunning;
      this.scene.runLayout(this.isRunning);
    },

    loadNewGraph(newGraph) {
      this.loading = true;
      this.stats = null;
      this.isRunning = false;

      loadGraph(newGraph).then(newGraph => {
        bus.fire('load-graph', newGraph, this.selectedLayout);
        this.loading = false;
      });
    },
    onGraphLoaded(graph) {
      this.isRunning = true;
      this.info = graphInfo(this.selectedGraph, graph, this.fileName);
      // the scene drew the graph first (it heard 'load-graph' before the app), so its colours are known
      this.legendData = this.scene.getLegend ? this.scene.getLegend() : null;
      this.aboutTextOpen = false;
    }
  },
  watch: {
    // Opening Settings shows them: the panel scrolls back to its top, where they now begin
    settingsOpen(open) {
      if (!open) return;
      this.$nextTick(() => {
        let app = document.getElementById('app');
        if (app) app.scrollTop = 0;
      });
    },
    layoutSettings: {
      deep: true,
      handler(newValue) {
        this.scene.updateLayoutSettings(newValue);
        // only what changed (and not a number being typed): the device's choice stays out of the URL
        Object.keys(newValue).forEach(key => {
          let value = newValue[key];
          if (value === this.lastLayoutSettings[key] || Number.isNaN(value)) return;
          this.remember(key, value);
        });
        this.lastLayoutSettings = {...newValue};
      }
    },
    placement(newValue) {
      this.remember('placement', newValue);
      this.scene.setPlacement(newValue);
    },
    stepsPerFrame(newValue) {
      if (Number.isFinite(newValue)) this.remember('stepsPerFrame', newValue);
      this.scene.setStepsPerFrame(newValue);
    },
    backend(newValue) {
      this.scene.setBackend(newValue).then(actualBackend => {
        if (actualBackend !== newValue) {
          this.gpuAvailable = false;
          if (this.picked.backend) {
            // the device turned out to have no WebGPU: its choice is the CPU
            this.device.backend = actualBackend;
            this.gpuMessage = 'No WebGPU in this browser: runs on the CPU.';
          } else {
            this.gpuMessage = 'WebGPU is not available in this browser: runs on the CPU.';
            this.fallback.backend = actualBackend;
          }
          this.backend = actualBackend;
          return;
        }
        if (newValue === 'webgpu') this.gpuMessage = '';
        this.remember('backend', newValue);
      });
    },
    selectedGraph(newGraph) {
      this.fileName = '';
      appState.set('graph', newGraph);
      this.loadNewGraph(newGraph);
    },
    prototypeId(newId, oldId) {
      let old = findPrototype(oldId);
      if (old) (old.params || []).forEach(param => appState.unset(PARAM_PREFIX + param.key));
      appState.set('prototype', newId);
      this.prototypeParams = getPrototypeParams(this.prototype, false);
      // A newly picked idea starts on
      this.prototypeOn = true;
    },
    prototypeOn(on) {
      if (on) appState.unset('ideaOff');
      else appState.set('ideaOff', true);
    },
    prototypeParams: {
      deep: true,
      handler(params) {
        Object.entries(params).forEach(([key, value]) => {
          if (Number.isFinite(value)) appState.set(PARAM_PREFIX + key, value);
        });
      }
    },
    prototypeConfig: {
      deep: true,
      handler(config, oldConfig) {
        clearTimeout(this.paramsTimer);
        // Wait while a parameter is being typed (an empty input gives NaN)
        if (!Object.values(config.params).every(Number.isFinite)) return;
        if (oldConfig && config.id === oldConfig.id) {
          // Same idea, new values: carry on from the current drawing once the typing stops
          this.paramsTimer = setTimeout(() => this.scene.setPrototypeParams(config.params), 300);
        } else {
          this.scene.setPrototype(this.activePrototype, config.params);
        }
      }
    }
  },
  data() {
    return {
      isRunning: true,
      // the camera follows the whole drawing until the user moves it
      following: true,
      selectedGraph: appState.get('graph'),
      // Closed: the first view is the graph. A link that changed settings opens them on a desktop;
      // on a phone the Settings button says how many changed instead (they would cover the graph)
      settingsOpen: !coarse && window.innerWidth > 500 && PHYSICS.concat(deviceKeys).some(key => appState.has(key)),
      info: null,
      legendData: null,
      aboutTextOpen: false,
      fileName: '',
      fileError: '',
      helpOpen: false,
      gpuNote: '',
      copied: false,
      pickerKey: '',
      installLine,
      installNote,
      showPitch: true,
      // Phones: the panel is folded to one line (see .panel-fold). Short screens start folded: the
      // panel would take half of them
      panelFolded: startsFolded(),
      pitchShort,
      graphGroups,
      libraryDefaultLabel,
      libraryDefaultsLabel,
      loading: false,
      layoutSettings: {
        timeStep: appState.get('timeStep'),
        springLength: appState.get('springLength'),
        springCoefficient: appState.get('springCoefficient'),
        dragCoefficient: appState.get('dragCoefficient'),
        dimensions: appState.get('dimensions'),
        theta: appState.get('theta'),
        gravity: appState.get('gravity'),
        maxVelocity: appState.get('maxVelocity'),
        integrator: appState.get('integrator'),
        nbody: startValue('nbody'),
      },
      placement: startValue('placement'),
      // WebGPU is turned on after the first graph is loaded (see mounted)
      backend: 'cpu',
      stepsPerFrame: startValue('stepsPerFrame'),
      // What this device picks, and which settings still follow it (not set by the URL or the visitor)
      device: {...deviceChoice},
      picked: {...pickedByDevice},
      // The backend the demo fell back to, which the URL doesn't get (see remember)
      fallback: {},
      maxAutoSteps,
      prototypes,
      prototypeId: findPrototype(appState.get('prototype')) ? appState.get('prototype') : 'none',
      prototypeParams: getPrototypeParams(findPrototype(appState.get('prototype')), true),
      prototypeOn: appState.get('ideaOff') !== true,
      aboutOpen: false,
      gpuAvailable: typeof navigator !== 'undefined' && !!navigator.gpu,
      gpuMessage: '',
      stats: null
    }
  },
  mounted() {
    const canvas = document.getElementById('cnv');
    this.lastLayoutSettings = {...this.layoutSettings};
    this.scene = createGraphScene(canvas, {...this.layoutSettings}, {
      placement: this.placement,
      stepsPerFrame: this.stepsPerFrame,
      frameBudget: this.device.frameBudget
    });
    this.scene.onFollow(following => { this.following = following; });
    if (this.activePrototype) this.scene.setPrototype(this.activePrototype, this.prototypeParams);
    this.loadNewGraph(this.selectedGraph);
    bus.on('load-graph', this.onGraphLoaded);
    bus.on('file-graph', this.onFileGraph);
    bus.on('file-error', this.onFileError);
    ['pointerdown', 'wheel', 'keydown'].forEach(name => canvas.addEventListener(name, this.hidePitch, {once: true, passive: true}));
    if (!this.picked.backend) {
      if (appState.get('backend') === 'webgpu') this.backend = 'webgpu';
    } else if (this.device.backend === 'webgpu') {
      // navigator.gpu alone is not enough: there must be a hardware adapter
      probeWebGPU().then(ok => {
        if (!this.picked.backend) return;
        if (ok) {
          this.backend = 'webgpu';
        } else {
          this.device.backend = 'cpu';
          this.gpuAvailable = false;
        }
      });
    }
    this.statsTimer = setInterval(this.updateStats, 250);
  },

  beforeUnmount() {
    clearInterval(this.statsTimer);
    clearTimeout(this.paramsTimer);
    if (this.scene) {
      this.scene.dispose();
    }
  }
}

</script>

