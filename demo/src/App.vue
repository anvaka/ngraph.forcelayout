<template>
  <div>
    <h2><a href='https://github.com/anvaka/ngraph.forcelayout'>ngraph.forcelayout</a> demo
      <small class='toggle-settings'><a href='#' @click.prevent='settingsOpen = !settingsOpen'>{{settingsOpen ? 'hide settings' : 'show settings'}}</a></small>
    </h2>
    <div class='content' v-if='settingsOpen'>
      <div class='row'>
        <div class='label'>Graph </div>
        <select v-model='selectedGraph' :disable='loading' class='value'>
          <option v-for="graph in graphs" :key='graph' :value='graph'>{{graph}}</option>
        </select>
      </div>
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
      <input-value label='Theta' v-model='layoutSettings.theta'>
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
      <input-select label='Repulsion' v-model='layoutSettings.nbody' :options='nbodyOptions'>
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
      <div v-if='loading'>Loading graph...</div>
    </div>
      <div v-if='!loading' class='layout-box'>
        <div class='buttons'>
          <a href="#" @click.prevent='toggleLayoutRun' class='btn'>{{isRunning ? 'Stop layout' : 'Start layout'}}</a>
          <a href="#" @click.prevent='restart' class='btn restart' title='Start over from initial positions'>Restart</a>
        </div>
        <div class='stats' v-if='stats'>
          {{stats.nodes.toLocaleString()}} nodes, {{stats.links.toLocaleString()}} links<br>
          {{stats.steps.toLocaleString()}} steps<span v-if='stats.msPerStep'>, <span class='number'>{{formatMs(stats.msPerStep)}}</span> ms/step</span>
        </div>
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
  stepsPerFrame: 1,
}, { useSearch: true });

export default {
  name: 'app',
  components: {
    InputValue,
    InputFlag,
    InputSelect
  },
  computed: {
    usesFire() {
      return this.layoutSettings.integrator === 'fire';
    },
    integratorOptions() {
      return [{value: 'euler', label: 'euler (default)'}, {value: 'fire', label: 'fire'}];
    },
    nbodyOptions() {
      return [{value: 'quadtree', label: 'quad tree (default)'}, {value: 'dualtree', label: 'dual tree'}];
    }
  },
  methods: {
    useSpeedups(enabled) {
      Object.assign(this.layoutSettings, enabled ? fastSpeedSettings : librarySpeedSettings);
    },

    restart() {
      this.scene.restart();
    },

    formatMs(ms) {
      return ms < 1 ? ms.toFixed(2) : ms < 10 ? ms.toFixed(1) : Math.round(ms);
    },

    updateStats() {
      if (!this.scene) return;
      this.stats = this.scene.getStats();
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
      this.isRunning = false;
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
    stepsPerFrame(newValue) {
      appState.set('stepsPerFrame', newValue);
      this.scene.setStepsPerFrame(newValue);
    },
    selectedGraph(newGraph) {
      appState.set('graph', newGraph);
      this.loadNewGraph(newGraph);
    }
  },
  data() {
    let graphs = getAvailableGraphs();
    return {
      isRunning: false,
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
      stepsPerFrame: appState.get('stepsPerFrame'),
      stats: null,
      graphs
    }
  },
  mounted() {
    const canvas = document.getElementById('cnv');
    this.scene = createGraphScene(canvas, {...this.layoutSettings}, {
      stepsPerFrame: this.stepsPerFrame
    });
    this.loadNewGraph(this.selectedGraph);
    bus.on('load-graph', this.onGraphLoaded);
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
  background: rgb(12, 41, 82);
  border: 1px solid white;
}
a {
  text-decoration: none;
}
.content {
  padding: 8px;
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
.buttons {
  display: flex;
  a.btn.restart {
    width: 30%;
    border-left: 1px solid;
  }
}
.stats {
  padding: 8px;
  font-size: 12px;
  border-top: 1px solid;
  .number {
    font-size: 12px;
  }
}
a.btn {
  color: rgb(244, 244, 244);
  text-decoration: none;
  justify-content: center;
  align-items: center;
  border-top: 1px solid;
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
  small a {
    position: absolute;
    right: 8px;
    top: 8px;
    font-size: 12px;
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
