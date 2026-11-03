<template>
  <div>
    <!-- First after the canvas in Tab order: the controls that act on the canvas -->
    <div class='canvas-tools' data-graph-overlay>
      <button v-if='!following' class='tool fit-view' @click='fitView'
        title='Show the whole graph, and follow it as the layout moves (0)'>Fit graph</button>
      <button class='tool' @click='toggleHelp' :aria-expanded='helpOpen ? "true" : "false"' aria-label='Keys and gestures' title='Keys and gestures (?)'>?</button>
      <button class='tool' @click='openSearch' aria-label='Find a node' title='Find a node (/)'>
        <svg aria-hidden='true' viewBox='0 0 16 16' width='16' height='16'><circle cx='6.5' cy='6.5' r='4.5' fill='none' stroke='currentColor' stroke-width='1.6'/><path d='M10 10l4 4' stroke='currentColor' stroke-width='1.6' stroke-linecap='round'/></svg>
      </button>
    </div>
    <div class='title-row'>
      <h2><a href='https://github.com/anvaka/ngraph.forcelayout#readme'>ngraph.forcelayout</a></h2>
      <p class='pitch' v-if='showPitch'><span class='long'>{{pitch}}</span><span class='short'>{{pitchShort}}</span></p>
    </div>
    <div class='layout-box'>
      <div class='buttons graph-row'>
        <label class='graph-picker'>
          <span class='visually-hidden'>Graph</span>
          <select v-model='graphChoice' ref='graphSelect'>
            <option v-if='fileName' value='__file__'>{{fileName}}</option>
            <optgroup v-for='group in graphGroups' :key='group.label' :label='group.label'>
              <option v-for='graph in group.graphs' :key='graph' :value='graph'>{{graphTitle(graph)}}</option>
            </optgroup>
          </select>
        </label>
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
        </div>
        <button @click='settingsOpen = !settingsOpen' class='toggle-settings' :aria-expanded='settingsOpen ? "true" : "false"'>Settings<span v-if='!settingsOpen && changedCount'> · {{changedCount}} changed</span><span aria-hidden='true'> {{settingsOpen ? '▴' : '▾'}}</span></button>
      </div>
      <div class='about-line' v-if='info && !loading'>
        <p class='about-text' id='about-text' v-if='info.about' :class='{open: aboutTextOpen, "with-legend": legend.length > 0}' @click='aboutTextOpen = !aboutTextOpen'>{{info.about}}</p>
        <div class='legend' v-if='legend.length'>
          <button type='button' class='about-toggle' v-if='info.about' @click='aboutTextOpen = !aboutTextOpen'
            :aria-expanded='aboutTextOpen ? "true" : "false"' aria-controls='about-text' aria-label='About this graph'>ⓘ</button>
          <span class='legend-name'>Colour: {{info.colorBy}}</span>
          <span class='legend-chip' v-for='item in legend' :key='item.label'><span class='swatch' aria-hidden='true' :style='{background: item.color}'></span>{{item.label}}</span>
          <span class='legend-more' v-if='legendMore'>+{{legendMore}}</span>
        </div>
        <div class='credit' v-if='info.credit'>Data: <a :href='info.credit.href' target='_blank' rel='noopener'>{{info.credit.text}}</a></div>
      </div>
    </div>
    <div class='content' v-if='settingsOpen'>
      <template v-if='prototypes.length && !prototype'>
        <div class='section first'>
          Layout ideas
          <small><a href='https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/src/prototypes'>experiments, not part of the library</a></small>
        </div>
        <input-select label='Try an idea' v-model='prototypeId' :options='prototypeOptions'>
          Experimental changes to the layout, one per folder in <code>demo/src/prototypes</code>.
          Picking an idea restarts the layout from the same start as <b>none</b>, and puts it at
          the top of the panel; its <b>on</b> box turns it off and on again, so you can compare the two.
        </input-select>
      </template>
      <div class='section' :class='{first: !(prototypes.length && !prototype)}'>Layout <small><a href='#' @click.prevent='resetSettings' title='Every setting back to what this page starts with'>reset all settings</a></small></div>
      <input-value label='Time step' v-model='layoutSettings.timeStep'>
      This is integration time step value. The higher it is, the faster nodes will move, but setting it too high
      can result in lots of jitter and instability.
      </input-value>
      <input-value label='Gravity' v-model='layoutSettings.gravity'>
        This coefficient defines how strongly each node repels each other.
      </input-value>
      <input-value label='Ideal spring length' v-model='layoutSettings.springLength'>
         What is the ideal length of each spring?
      </input-value>
      <input-value label='Spring coefficient' v-model='layoutSettings.springCoefficient'>
        Higher values makes the spring force stronger, pushing edges closer to the ideal spring length.
      </input-value>
      <input-value label='Drag coefficient' v-model='layoutSettings.dragCoefficient'
        :disabled='usesFire' :note="usesFire ? 'Not used by the fire integrator.' : ''">
        This coefficient introduces "resistance" from environment. When it is close to 0 the forces
        will have a lot of freedom, nothing will be stopping them, and that can result in a very
        unstable simulation.
      </input-value>
      <input-value label='Theta' v-model='layoutSettings.theta'
        :disabled='onGpu' :note="onGpu ? 'Not used on WebGPU.' : ''">
        This coefficient influences when we apply long distance forces approximation. When this value is
        close to 0, the simulation compares forces between every single node (giving O(n^2), slow performance).
        Recommended value is 0.8.
      </input-value>

      <input-value label='Dimensions' v-model='layoutSettings.dimensions' step=1>
      Defines number of dimensions of the space where layout is performed. For visualization purpose
      2 or 3 dimensions are normally enough. Note: Memory consumptions grows exponentially with number
      of dimensions.
      </input-value>

      <div class='section'>
        Speed-ups
        <small>
          <a href='#' @click.prevent='useDeviceDefaults' title='The speed-ups picked for this device'>this device</a> |
          <a href='#' @click.prevent='useLibraryDefaults' :title='"The " + libraryDefaultsLabel + " for the speed-ups (the physics stay)"'>{{libraryDefaultsLabel}}</a>
        </small>
      </div>
      <div class='device-note' v-if='deviceSummary'>{{deviceSummary}}</div>
      <input-value label='Max velocity' v-model='layoutSettings.maxVelocity'>
        Maximum distance a node can travel in one unit of time (each step moves a node by at most
        time step * max velocity). Library default is 4. Set it to 1 to get the layouts of versions
        before v3.4, which settle more slowly.
      </input-value>
      <input-select label='Integrator' v-model='layoutSettings.integrator' :options='integratorOptions'>
        How forces move nodes. <b>euler</b> is the classic integration slowed down by drag.
        <b>fire</b> (Fast Inertial Relaxation Engine) ignores drag: the whole system keeps its momentum
        while it moves "downhill", and stops dead when it overshoots. Usually reaches a good layout in
        fewer steps, especially on trees and grids.
      </input-select>
      <input-select label='Repulsion' v-model='layoutSettings.nbody' :options='nbodyOptions'
        :disabled='onGpu' :note="onGpu ? 'Not used on WebGPU: exact pairs up to 1,024 nodes, a grid pyramid beyond.' : ''">
        How node repulsion is computed. <b>quad tree</b> is Barnes-Hut: each node walks the tree.
        <b>dual tree</b> lets pairs of tree cells interact with each other, which is 5-10x faster on large
        graphs with the same accuracy. Both use theta.
      </input-select>
      <input-value label='Steps per frame' v-model='stepsPerFrame' step=1 :note='stepsNote'>
        How many layout steps to run before each frame is rendered. Fast layouts can do many steps per frame.
        <b>0</b> is auto: as many steps as fit in {{device.frameBudget}} ms of each frame, up to {{maxAutoSteps}}.
      </input-value>

      <div class='section'>
        Add-ons
        <small><a href='https://github.com/anvaka/ngraph.forcelayout/tree/main/modules'>not part of the library</a></small>
      </div>
      <input-select label='Start from' v-model='placement' :options='placementOptions'>
        Initial positions of nodes. <b>pivot MDS</b> places nodes so that distances follow graph distances
        (or uses a radial tree when it fits better), so the layout only needs to polish it.
        Changing this restarts the layout.
        This is a separate module, <code>modules/pivot</code> in this repository; ngraph.forcelayout itself
        places each node at random near its already placed neighbours.
      </input-select>
      <input-select label='Run on' v-model='backend' :options='backendOptions' :note='gpuMessage'>
        <b>WebGPU</b> runs the layout's own simulation on the GPU when it can run all of it (for now
        the built in physics with any repulsion law, node formulas and sums, in any number of
        dimensions); otherwise the layout stays on the CPU and the note under the stats says why.
        Repulsion is exact over all pairs up to 1,024 nodes; larger layouts use a grid pyramid
        instead of a tree (in 2D and 3D), so Theta and Repulsion settings do not apply. It is hundreds of times faster on large graphs, so raise
        Steps per frame (e.g. 20) to see it: with one step per frame, drawing the graph is the
        bottleneck. This is a separate module, <code>modules/gpu</code> in this repository;
        ngraph.forcelayout itself always runs on the CPU.
      </input-select>

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
    </div>
  </div>
</template>

<script>
import createGraphScene from './lib/createGraphScene';
import {graphGroups, graphTitle} from './lib/getAvailableGraphs';
import graphInfo from './lib/graphInfo';
import {libraryDefaultLabel, libraryDefaultsLabel, pitch, pitchShort} from './lib/release';
import './styles/layout.css';
import loadGraph from './lib/loadGraph';
import bus from './lib/bus';
import queryState from 'query-state';
import InputValue from './components/InputValue.vue';
import InputSelect from './components/InputSelect.vue';
import HelpIcon from './components/HelpIcon.vue';
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
const coarse = typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches;

const deviceChoice = pickDefaults(readSignals());
// Device settings the URL doesn't set: they follow the device until the visitor changes them
const pickedByDevice = Object.fromEntries(deviceKeys.map(key => [key, appState.get(key) === undefined]));

function startValue(key) {
  return pickedByDevice[key] ? deviceChoice[key] : appState.get(key);
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
    HelpIcon
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
    graphChoice: {
      get() {
        return this.fileName ? '__file__' : this.selectedGraph;
      },
      set(value) {
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
    legend() {
      let list = (this.info && this.info.legend) || [];
      return list.slice(0, coarse ? 4 : 6);
    },
    legendMore() {
      let list = (this.info && this.info.legend) || [];
      return Math.max(0, list.length - this.legend.length);
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
      this.aboutTextOpen = false;
    }
  },
  watch: {
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
      aboutTextOpen: false,
      fileName: '',
      fileError: '',
      helpOpen: false,
      showPitch: true,
      pitch,
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

<style lang='stylus'>
small-screen = 500px;

#app {
  position: absolute;
  width: 400px;
  max-height: 100dvh;
  overflow-y: auto;
  background: rgb(12, 41, 82);
  border: 1px solid white;
}
a {
  text-decoration: none;
}
.content {
  padding: 8px;
  border-top: 1px solid;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.row .label {
  flex: 1;
}
.row .value {
  flex: 1;
}
.row select {
  width: 100%;
}

.section {
  margin: 12px 0 4px 0;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.3);
  small {
    float: right;
    font-size: 12px;
  }
  a {
    color: #267fcd;
  }
}
.device-note {
  font-size: 12px;
  opacity: 0.7;
  margin-bottom: 4px;
}
.about {
  font-size: 14px;
  p {
    margin: 6px 0;
  }
  p:first-child {
    margin-top: 0;
  }
  p:last-child {
    margin-bottom: 0;
  }
}
.idea-bar {
  label.idea-toggle {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 0 8px;
    border-left: 1px solid;
    font-size: 14px;
    white-space: nowrap;
    cursor: pointer;
    &.inactive {
      opacity: 0.5;
      cursor: default;
    }
  }
  a.help-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    flex-shrink: 0;
    border-left: 1px solid;
    &.open {
      background: #004499;
      svg {
        fill: white;
      }
    }
  }
  select:disabled {
    opacity: 0.5;
  }
}
.idea-about {
  padding: 8px;
  background: #004499;
  border-top: 1px solid;
}
.prototype {
  font-size: 14px;
  a {
    color: #267fcd;
  }
  .off-note {
    margin: 6px 0;
    opacity: 0.7;
  }
  .try {
    margin: 6px 0;
    a {
      margin-left: 6px;
    }
  }
  .finish {
    display: block;
    margin-top: 8px;
    padding: 6px 0;
    text-align: center;
    border: 1px solid #267fcd;
  }
}
.buttons {
  display: flex;
  border-top: 1px solid;
  a.btn {
    border-left: 1px solid;
  }
  a.btn.restart {
    width: 60%;
  }
}
.graph-picker {
  position: relative;
  width: 100%;
  min-width: 0;
  select {
    appearance: none;
    width: 100%;
    height: 32px;
    padding: 0 24px 0 8px;
    border: none;
    border-radius: 0;
    background: rgb(12, 41, 82);
    color: rgb(244, 244, 244);
    font: inherit;
    text-overflow: ellipsis;
  }
  &::after {
    content: '▾';
    position: absolute;
    right: 8px;
    top: 7px;
    pointer-events: none;
  }
}
.stats {
  display: flex;
  align-items: center;
  padding: 8px;
  font-size: 12px;
  border-top: 1px solid;
  .number {
    font-size: 12px;
  }
  .off-gpu {
    margin-top: 2px;
    opacity: 0.7;
  }
}
.toggle-settings {
  margin-left: auto;
  padding: 0 8px;
  border: 1px solid #267fcd;
  border-radius: 4px;
  color: #267fcd;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;
}
a.btn {
  color: rgb(244, 244, 244);
  text-decoration: none;
  justify-content: center;
  align-items: center;
  height: 32px;
  width: 100%;
  display: flex;
  margin: 0;
}
h2 {
  margin: 8px;
  font-size: 18px;
  font-weight: normal;
  a {
    color: #267fcd;
  }
}
.number {
  color: yellow;
  font-size: 18px;
}
.names {
  position: fixed;
  font-size: 24px;
  top: 18px;
  left: 50%;
  transform: translateX(-50%);
}
button.fit-view {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border: 1px solid #267fcd;
  border-radius: 18px;
  background: rgb(12, 41, 82);
  color: #fff;
  font: inherit;
  font-size: 14px;
  cursor: pointer;
}
button.fit-view:hover, button.fit-view:focus-visible {
  background: #004499;
}
@media (max-width: small-screen) {
  #app {
    width: 100%;
  }
}
</style>
