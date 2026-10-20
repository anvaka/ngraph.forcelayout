<template>
  <div>
    <h2><a href='https://github.com/anvaka/ngraph.forcelayout'>ngraph.forcelayout</a> demo</h2>
    <div class='layout-box'>
      <div class='buttons'>
        <label class='graph-picker' title='Graph'>
          <select v-model='selectedGraph'>
            <option v-for="graph in graphs" :key='graph' :value='graph'>{{graph}}</option>
          </select>
        </label>
        <a href="#" @click.prevent='toggleLayoutRun' class='btn'>{{isRunning ? 'Pause' : 'Run'}}</a>
        <a href="#" @click.prevent='restart' class='btn restart' title='Start over from initial positions'>Reset</a>
      </div>
      <div class='buttons idea-bar' v-if='prototypes.length'>
        <label class='graph-picker' :title="onGpu ? 'Prototypes run on the CPU only.' : 'Layout idea to try'">
          <select v-model='prototypeId' :disabled='onGpu'>
            <option v-for='option in prototypeOptions' :key='option.value' :value='option.value'>{{option.label}}</option>
          </select>
        </label>
        <label class='idea-toggle' :class='{inactive: !prototype || onGpu}'
          title='Turn the idea off and on: the layout restarts from the same start, so you can compare'>
          <input type='checkbox' v-model='prototypeOn' :disabled='!prototype || onGpu'> on
        </label>
        <help-icon @show='aboutOpen = !aboutOpen' :class='{open: aboutOpen}'></help-icon>
      </div>
      <div class='about idea-about' v-if='aboutOpen && prototypes.length'>
        <div v-if='prototype' v-html='prototype.description'></div>
        <template v-else>
          Experimental changes to the layout, one per folder in <code>demo/src/prototypes</code>.
          Picking an idea restarts the layout from the same start as <b>none</b>; the <b>on</b> box
          turns it off and on again, so you can compare the two. Its parameters are under Settings.
        </template>
      </div>
      <div class='stats'>
        <div v-if='loading'>Loading graph...</div>
        <div v-else-if='stats'>
          {{stats.nodes.toLocaleString()}} nodes, {{stats.links.toLocaleString()}} links<span v-if='stats.placement'>, {{stats.placement}} start</span><br>
          {{stats.steps.toLocaleString()}} steps<span v-if='stats.msPerStep'>, <span class='number'>{{formatMs(stats.msPerStep)}}</span> ms/step</span>
          on {{stats.backend === 'webgpu' ? 'WebGPU' : 'CPU'}}
        </div>
        <a href='#' @click.prevent='settingsOpen = !settingsOpen' class='toggle-settings'>Settings {{settingsOpen ? '▴' : '▾'}}</a>
      </div>
    </div>
    <div class='content' v-if='settingsOpen'>
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
          <a href='#' @click.prevent='useSpeedups(true)'>turn all on</a> |
          <a href='#' @click.prevent='useSpeedups(false)'>library defaults</a>
        </small>
      </div>
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
        :disabled='onGpu' :note="onGpu ? 'Not used on WebGPU: it has its own grid pyramid (exact up to 1,024 nodes).' : ''">
        How node repulsion is computed. <b>quad tree</b> is Barnes-Hut: each node walks the tree.
        <b>dual tree</b> lets pairs of tree cells interact with each other, which is 5-10x faster on large
        graphs with the same accuracy. Both use theta.
      </input-select>
      <input-value label='Steps per frame' v-model='stepsPerFrame' step=1>
        How many layout steps to run before each frame is rendered. Fast layouts can do many steps per frame.
      </input-value>

      <input-flag label='Follow bounding box' v-model='fixedViewBox' step=1>
      Setting this to true will disable pan/zoom but will always keep the graph visible. This is not
      part of the layout algorithm. Just a view setting of the renderer.
      </input-flag>

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
        <b>WebGPU</b> runs the whole simulation on the GPU (2D only). Repulsion uses a grid pyramid
        instead of a tree, so Theta and Repulsion settings do not apply; graphs up to 1,024 nodes
        use exact all-pairs repulsion. It is hundreds of times faster on large graphs, so raise
        Steps per frame (e.g. 20) to see it: with one step per frame, drawing the graph is the
        bottleneck. This is a separate module, <code>modules/gpu</code> in this repository;
        ngraph.forcelayout itself always runs on the CPU.
      </input-select>

      <template v-if='prototype && !onGpu'>
        <div class='section'>
          Idea settings
          <small><a href='https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/src/prototypes'>ideas to try, not part of the library</a></small>
        </div>
        <div class='prototype'>
          <div v-if='!prototypeOn' class='off-note'>The idea is off: turn it on at the top to use these.</div>
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
import getAvailableGraphs from './lib/getAvailableGraphs';
import loadGraph from './lib/loadGraph';
import bus from './lib/bus';
import queryState from 'query-state';
import InputValue from './components/InputValue.vue';
import InputFlag from './components/InputFlag.vue';
import InputSelect from './components/InputSelect.vue';
import HelpIcon from './components/HelpIcon.vue';
import prototypes from './prototypes';

const librarySpeedSettings = {maxVelocity: 4, integrator: 'euler', nbody: 'quadtree'};
const fastSpeedSettings = {maxVelocity: 4, integrator: 'fire', nbody: 'dualtree'};

let appState = queryState({
  graph: 'Miserables',
  timeStep: 0.5,
  springLength: 10,
  springCoefficient: 0.8,
  dragCoefficient: 0.9,
  dimensions: 2,
  theta: 0.8,
  gravity: -12,
  maxVelocity: 4,
  integrator: 'euler',
  nbody: 'quadtree',
  placement: 'default',
  backend: 'cpu',
  stepsPerFrame: 1,
  prototype: 'none',
}, { useSearch: true });

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
    InputFlag,
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
      return [{value: 'euler', label: 'euler (default)'}, {value: 'fire', label: 'fire'}];
    },
    nbodyOptions() {
      return [{value: 'quadtree', label: 'quad tree (default)'}, {value: 'dualtree', label: 'dual tree'}];
    },
    placementOptions() {
      return [{value: 'default', label: 'library default'}, {value: 'pivot', label: 'pivot MDS (add-on)'}];
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
      let gpuDisabled = this.layoutSettings.dimensions !== 2 || this.gpuAvailable === false;
      return [{value: 'cpu', label: 'CPU (library)'}, {value: 'webgpu', label: 'WebGPU, 2D (add-on)', disabled: gpuDisabled}];
    }
  },
  methods: {
    useSpeedups(enabled) {
      Object.assign(this.layoutSettings, enabled ? fastSpeedSettings : librarySpeedSettings);
    },

    restart() {
      this.scene.restart();
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
      if (this.stats.backend !== this.backend && this.backend === 'webgpu') {
        // the scene fell back to CPU (e.g. GPU device was lost)
        this.gpuMessage = 'WebGPU device was lost, switched back to CPU.';
        this.backend = this.stats.backend;
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
    onGraphLoaded() {
      this.isRunning = true;
    }
  },
  watch: {
    layoutSettings: {
      deep: true,
      handler(newValue) {
        this.scene.updateLayoutSettings(newValue);
        appState.set(newValue);
      }
    },
    fixedViewBox(newValue) {
      this.scene.setFixedViewBox(newValue);
    },
    'layoutSettings.dimensions'(newValue) {
      if (newValue !== 2 && this.backend === 'webgpu') {
        this.gpuMessage = 'WebGPU layout works only in 2D, switched to CPU.';
        this.backend = 'cpu';
      }
    },
    placement(newValue) {
      appState.set('placement', newValue);
      this.scene.setPlacement(newValue);
    },
    stepsPerFrame(newValue) {
      appState.set('stepsPerFrame', newValue);
      this.scene.setStepsPerFrame(newValue);
    },
    backend(newValue) {
      this.scene.setBackend(newValue).then(actualBackend => {
        if (actualBackend !== newValue) {
          this.gpuMessage = this.layoutSettings.dimensions !== 2 ?
            'WebGPU layout works only in 2D.' :
            'WebGPU is not available in this browser.';
          if (this.layoutSettings.dimensions === 2) this.gpuAvailable = false;
          this.backend = actualBackend;
        } else if (newValue === 'webgpu') {
          this.gpuMessage = '';
        }
        appState.set('backend', this.backend);
      });
    },
    selectedGraph(newGraph) {
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
      handler(config) {
        // Wait while a parameter is being typed (an empty input gives NaN)
        if (!Object.values(config.params).every(Number.isFinite)) return;
        this.scene.setPrototype(this.activePrototype, config.params);
      }
    }
  },
  data() {
    let graphs = getAvailableGraphs();
    return {
      isRunning: true,
      fixedViewBox: false,
      selectedGraph: appState.get('graph'),
      settingsOpen: window.innerWidth > 500,
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
        nbody: appState.get('nbody'),
      },
      placement: appState.get('placement'),
      // WebGPU is turned on after the first graph is loaded (see mounted)
      backend: 'cpu',
      stepsPerFrame: appState.get('stepsPerFrame'),
      prototypes,
      prototypeId: findPrototype(appState.get('prototype')) ? appState.get('prototype') : 'none',
      prototypeParams: getPrototypeParams(findPrototype(appState.get('prototype')), true),
      prototypeOn: appState.get('ideaOff') !== true,
      aboutOpen: false,
      gpuAvailable: typeof navigator !== 'undefined' && !!navigator.gpu,
      gpuMessage: '',
      stats: null,
      graphs
    }
  },
  mounted() {
    const canvas = document.getElementById('cnv');
    this.scene = createGraphScene(canvas, {...this.layoutSettings}, {
      placement: this.placement,
      stepsPerFrame: this.stepsPerFrame
    });
    if (this.activePrototype) this.scene.setPrototype(this.activePrototype, this.prototypeParams);
    this.loadNewGraph(this.selectedGraph);
    bus.on('load-graph', this.onGraphLoaded);
    if (appState.get('backend') === 'webgpu') this.backend = 'webgpu';
    this.statsTimer = setInterval(this.updateStats, 250);
  },

  beforeUnmount() {
    clearInterval(this.statsTimer);
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
@media (max-width: small-screen) {
  #app {
    width: 100%;
  }
}
</style>
