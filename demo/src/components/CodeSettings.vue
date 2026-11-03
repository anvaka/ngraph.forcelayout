<template>
<div class='code-settings'>
  <!-- The program that makes this drawing. Every value is an input named after its option; what
       you change, the layout uses at once, and Copy takes the program home. -->
  <!-- First, so a visitor who came for the code has it at once -->
  <div class='code-actions'>
    <button type='button' class='copy' @click='copy'>{{copied ? 'Copied' : 'Copy code'}}</button>
    <button type='button' class='link' @click='$emit("reset")' title='Every setting back to what this page starts with'>Reset all</button>
    <button type='button' class='link' @click='$emit("speedups", "device")' title='The speed-ups picked for this device; the physics stay'>Device speed-ups</button>
    <a :href='repo + "#api"' target='_blank' rel='noopener'>API</a>
  </div>
  <div class='code' role='group' aria-label='Settings, written as the code that makes this layout'>
    <!-- The lines before the options fold, so the values are what shows first -->
    <button type='button' class='line comment fold' :aria-expanded='preambleOpen ? "true" : "false"' aria-controls='code-preamble'
      @click='preambleOpen = !preambleOpen'>// {{preambleOpen ? '▾' : '▸'}} install, imports and this graph</button>
    <div id='code-preamble' class='preamble' :class='{open: preambleOpen}'>
      <div class='line' v-for='(line, i) in parts.head' :key='"h" + i' :class='{comment: line.startsWith("//"), blank: !line}'>{{line}}</div>
      <div class='line blank'></div>
    </div>
    <div class='line'><span class='kw'>const</span> layout = createLayout(graph, {</div>
    <template v-for='option in options' :key='option.key'>
      <div class='line indent' :class='{changed: isChanged(option), unused: !!unusedReason(option)}'>
        <label :for='"code-" + option.key'>{{option.key}}</label>:
        <span class='hit'><select v-if='option.choices' :id='"code-" + option.key' class='value' :value='settings[option.key]'
          :aria-describedby='"code-help-" + option.key'
          @change='set(option.key, $event.target.value)' @focus='focused = option.key' @blur='blur(option.key)'>
          <option v-for='choice in option.choices' :key='choice' :value='choice'>'{{choice}}'</option>
        </select><input v-else :id='"code-" + option.key' class='value' type='text'
          :inputmode='option.signed ? "text" : "decimal"' autocomplete='off' spellcheck='false' enterkeyhint='done'
          :aria-describedby='"code-help-" + option.key'
          :value='settings[option.key]' :style='widthOf(settings[option.key])'
          @input='setNumber(option, $event)' @change='revert(option, $event)'
          @focus='focus(option.key, $event)' @blur='blur(option.key)'></span>,<span
          v-if='unusedReason(option)' class='comment'> // {{unusedReason(option)}}</span>
      </div>
      <!-- Always in the page, so screen readers find it through aria-describedby; shown on focus -->
      <div :id='"code-help-" + option.key' class='line indent comment help' :hidden='focused !== option.key'>// {{helpOf(option)}}</div>
    </template>
    <div class='line'>});</div>
    <label class='line toggle' :class='{off: placement !== "pivot"}'>
      <input type='checkbox' :checked='placement === "pivot"' @change='$emit("set", "placement", $event.target.checked ? "pivot" : "default")'>
      <span v-if='placement === "pivot"'>{{placeLine()}} <span class='comment'>// start from pivot MDS</span></span>
      <span v-else class='comment'>// placeNodes(graph, layout); start from pivot MDS (add-on)</span>
    </label>
    <label class='line toggle' :class='{off: backend !== "webgpu"}'>
      <input type='checkbox' :checked='backend === "webgpu"' :disabled='!gpuAvailable'
        @change='$emit("set", "backend", $event.target.checked ? "webgpu" : "cpu")'>
      <span v-if='backend === "webgpu"'><span class='kw'>const</span> gpu = <span class='kw'>await</span> runOnGpu(layout, <span class='kw'>await</span> createWebGPUBackend()); <span class='comment'>// or the CPU, in the copy</span></span>
      <span v-else class='comment'>// const gpu = await runOnGpu(layout, ...); WebGPU (add-on){{gpuAvailable ? '' : ': not in this browser'}}</span>
    </label>
    <div class='line blank'></div>
    <!-- How the demo draws it, folded: the same colours, sizes, labels and camera -->
    <button type='button' class='line comment fold' :aria-expanded='drawingOpen ? "true" : "false"' aria-controls='code-drawing'
      @click='drawingOpen = !drawingOpen'>// {{drawingOpen ? '▾' : '▸'}} draw it as the demo does: colours, sizes, labels</button>
    <div id='code-drawing' class='preamble' :class='{open: drawingOpen}'>
      <div class='line' v-for='(line, i) in parts.drawing' :key='"d" + i' :class='{comment: line.startsWith("//")}'>{{line}}</div>
    </div>
    <div class='line blank'></div>
    <div class='line'><span class='kw'>let</span> settled = <span class='kw'>false</span>; <span class='comment'>// it stops when the layout settles, and wakes when you drag a node</span></div>
    <div class='line'>layout.on(<span class='str'>'stable'</span>, isStable =&gt; { settled = isStable; <span class='kw'>if</span> (!isStable) requestAnimationFrame(frame); });</div>
    <div class='line'><span class='kw'>function</span> frame() {</div>
    <div class='line indent'><span class='kw'>if</span> (settled) <span class='kw'>return</span>;</div>
    <div class='line indent' v-if='backend === "webgpu"'>gpu.step(<span class='hit'><input class='value' id='code-steps' type='text' inputmode='numeric'
      aria-label='steps per frame' aria-describedby='code-help-steps' :value='stepsText' :style='widthOf(stepsText)'
      @input='setSteps($event)' @change='revertSteps($event)' @focus='focus("steps", $event)' @blur='blur("steps")'></span>);</div>
    <div class='line indent' v-else><span class='kw'>for</span> (<span class='kw'>let</span> i = 0; i &lt; <span class='hit'><input class='value' id='code-steps' type='text' inputmode='numeric'
      aria-label='steps per frame' aria-describedby='code-help-steps' :value='stepsText' :style='widthOf(stepsText)'
      @input='setSteps($event)' @change='revertSteps($event)' @focus='focus("steps", $event)' @blur='blur("steps")'></span>; ++i) layout.step();</div>
    <div id='code-help-steps' class='line indent comment help' :hidden='focused !== "steps"'>// Steps per frame. "auto" (0): as many as fit in {{frameBudget}} ms ({{autoNow}} now)</div>
    <div class='line indent'>requestAnimationFrame(frame); <span class='comment'>// the view draws every step</span></div>
    <div class='line'>}</div>
    <div class='line'>frame();</div>
    <div class='line comment' v-if='parts.helpers.length'>// … and {{helperNames}} (in the copy)</div>
  </div>
  <template v-if='copyFailed'>
    <p class='code-note' role='status'>Copy didn't work here: the code below is selected, press Ctrl+C or Cmd+C.</p>
    <textarea class='code-copy' ref='copyText' readonly aria-label='The code, to copy' :value='code()'></textarea>
  </template>
  <p class='code-note' v-if='gpuMessage'>{{gpuMessage}}</p>
</div>
</template>

<script>
import {graphProgram, drawingProgram, installLines} from '../lib/programText.js';
import {RELEASED, COMMIT} from '../lib/release.js';

// The library's defaults on main (lib/createPhysicsSimulator.js): changed values are lit, and
// only they are copied
const OPTIONS = [
  {key: 'timeStep', value: 0.5, help: 'Integration time step. Higher moves nodes faster, but too high jitters.'},
  {key: 'gravity', value: -12, signed: true, help: 'How strongly nodes repel each other (negative pushes apart).'},
  {key: 'springLength', value: 10, help: 'The length a link would like to have.'},
  {key: 'springCoefficient', value: 0.8, help: 'How hard links pull towards springLength.'},
  {key: 'dragCoefficient', value: 0.9, help: 'Resistance of the medium. Near 0 nothing slows the nodes down.'},
  {key: 'theta', value: 0.8, help: 'Barnes-Hut accuracy: 0 compares every pair (slow); 0.8 is recommended.'},
  {key: 'dimensions', value: 2, integer: true, help: '2, 3 or more. The view shows the first three axes.'},
  {key: 'maxVelocity', value: 4, help: 'Each step moves a node by at most timeStep * maxVelocity. 1: layouts before v3.4.'},
  {key: 'integrator', value: 'euler', choices: ['euler', 'fire'], help: "'fire' keeps momentum while it goes downhill and ignores drag: fewer steps, mostly on trees and grids."},
  {key: 'nbody', value: 'quadtree', choices: ['quadtree', 'dualtree'], help: "'dualtree' lets tree cells push each other: 5-10x faster on large graphs, same accuracy."},
];
const REPO = 'https://github.com/anvaka/ngraph.forcelayout';

export default {
  emits: ['set', 'speedups', 'reset'],
  props: {
    settings: Object,
    stepsPerFrame: Number,
    // steps the last frame ran, for "auto"
    autoNow: Number,
    frameBudget: Number,
    placement: String,
    backend: String,
    gpuAvailable: Boolean,
    gpuMessage: String,
    installLine: String,
    installNote: String,
    libraryDefaultLabel: String,
    // () => {name, fileName, graph, base, linkAlpha, nodeMinSize}: what is on screen, for the
    // parts of the program that load and draw the same graph
    describe: Function,
    // changes when the graph on screen changes (the program is read again)
    programKey: String
  },
  data() {
    return {options: OPTIONS, focused: '', copied: false, copyFailed: false, repo: REPO, preambleOpen: false, drawingOpen: false};
  },
  computed: {
    // The program's parts around the options: {head, drawing, helpers} (lines)
    parts() {
      // eslint-disable-next-line no-unused-expressions
      this.programKey;
      return this.program();
    },
    helperNames() {
      return this.parts.helpers.filter(line => /^(async )?function /.test(line)).map(line => line.replace(/^(async )?function (\w+).*/, '$2()')).join(', ');
    },
    stepsText() {
      return this.stepsPerFrame === 0 ? 'auto' : String(this.stepsPerFrame);
    },
  },
  methods: {
    // An input as wide as its text, like the code around it
    widthOf(value) {
      return {width: `calc(${Math.max(1, String(value).length)}ch + 6px)`};
    },
    helpOf(option) {
      let base = `${this.libraryDefaultLabel}: ${option.choices ? `'${option.value}'` : option.value}`;
      return `${option.help} (${base})`;
    },
    isChanged(option) {
      return this.settings[option.key] !== option.value;
    },
    unusedReason(option) {
      if (this.backend === 'webgpu' && (option.key === 'theta' || option.key === 'nbody')) return 'not used on WebGPU';
      if (this.settings.integrator === 'fire' && option.key === 'dragCoefficient') return 'not used by fire';
      return '';
    },
    set(key, value) {
      this.$emit('set', key, value);
    },
    setNumber(option, e) {
      let text = e.target.value.trim().replace(',', '.');
      Object.assign(e.target.style, this.widthOf(e.target.value));
      let value = Number(text);
      if (text === '' || text === '-' || !Number.isFinite(value)) return;
      if (option.integer) value = Math.round(value);
      this.$emit('set', option.key, value);
    },
    // What doesn't parse goes back to the value in use when the field is left
    revert(option, e) {
      e.target.value = this.settings[option.key];
      Object.assign(e.target.style, this.widthOf(e.target.value));
    },
    setSteps(e) {
      let text = e.target.value.trim().toLowerCase();
      Object.assign(e.target.style, this.widthOf(e.target.value));
      if (text === 'auto' || text === '0') return this.$emit('set', 'stepsPerFrame', 0);
      let value = parseInt(text, 10);
      if (Number.isFinite(value) && value > 0) this.$emit('set', 'stepsPerFrame', value);
    },
    revertSteps(e) {
      e.target.value = this.stepsText;
      Object.assign(e.target.style, this.widthOf(e.target.value));
    },
    focus(key, e) {
      this.focused = key;
      if (e && e.target.select) e.target.select();
    },
    blur(key) {
      if (this.focused === key) this.focused = '';
    },
    // As the demo calls it: the start's unit is the spring length
    placeLine() {
      let options = [];
      if (this.settings.dimensions !== 2) options.push(`dimensions: ${this.settings.dimensions}`);
      if (this.settings.springLength !== 10) options.push(`unit: ${this.settings.springLength}`);
      return options.length ? `placeNodes(graph, layout, {${options.join(', ')}});` : `placeNodes(graph, layout);`;
    },
    // Where the graph comes from, how it is drawn, what to install: from what is on screen
    program() {
      let gpu = this.backend === 'webgpu', pivot = this.placement === 'pivot';
      let d = this.describe ? this.describe() : {};
      let graphPart = graphProgram(d.name || '', d.fileName || '', d.base || '');
      let drawing = drawingProgram(d.graph, {springLength: this.settings.springLength, fileStyle: !!graphPart.fileStyle});
      let core = {packages: [], addons: [], imports: [`import createLayout from 'ngraph.forcelayout';`]};
      if (pivot) {
        core.addons.push('pivot');
        core.imports.push(`import placeNodes from 'ngraph.forcelayout.pivot';`);
      }
      if (gpu) {
        core.addons.push('gpu');
        core.imports.push(`import {createWebGPUBackend, runOnGpu} from 'ngraph.forcelayout.gpu';`);
      }
      let parts = [graphPart, core, drawing];
      let head = installLines(parts, this.installLine, REPO, RELEASED);
      if (!RELEASED && COMMIT) head.push(`// npm’s 3.3.1 (2022) has no dual tree, FIRE or maxVelocity: this installs the commit that drew this page`);
      else if (this.installNote) head.push(`// ${this.installNote}`);
      head.push(`// Runs in a page as an ES module (Vite, esbuild…): it awaits at the top level.`);
      head.push(...graphPart.imports, ...core.imports, ...drawing.imports, '', ...graphPart.lines);
      return {head, drawing: drawing.lines, helpers: graphPart.helpers};
    },
    // The program as it reads, for Copy: only the changed options, and the add-ons that are on
    code() {
      let gpu = this.backend === 'webgpu', pivot = this.placement === 'pivot';
      // Every changed option, theta and nbody too: the GPU ignores them, but the CPU fallback uses them
      let changed = OPTIONS.filter(option => this.isChanged(option))
        .map(option => `  ${option.key}: ${option.choices ? `'${this.settings[option.key]}'` : this.settings[option.key]},` +
          (gpu && (option.key === 'theta' || option.key === 'nbody') ? ' // for the CPU (the GPU ignores it)' : ''));
      let auto = this.stepsPerFrame === 0;
      let steps = auto ? Math.max(1, this.autoNow || 1) : this.stepsPerFrame;
      let parts = this.program();
      let lines = [...parts.head, ''];
      lines.push(changed.length ? `const layout = createLayout(graph, {\n${changed.join('\n')}\n});` : `const layout = createLayout(graph);`);
      if (pivot) lines.push(this.placeLine());
      if (gpu) {
        lines.push(`// WebGPU where the browser has it and the layout runs there, else the CPU`,
          `const backend = await createWebGPUBackend();`,
          `const gpu = backend && layout.simulator.plan(backend).runs ? await runOnGpu(layout, backend) : null;`);
      }
      lines.push('', ...parts.drawing, '');
      lines.push(`let settled = false; // it stops when the layout settles, and wakes when you drag a node`,
        `layout.on('stable', isStable => { settled = isStable; if (!isStable) requestAnimationFrame(frame); });`,
        `function frame() {`, `  if (settled) return;`);
      // "auto": as many steps as fit in the frame budget, up to 10 (the demo's rule); the GPU line
      // says what it picked here
      let budget = this.frameBudget || 8;
      let cpuLoop = auto
        ? `for (let i = 0, t = performance.now(); i < 10 && performance.now() - t < ${budget}; ++i) layout.step(); // auto: what fits in ${budget} ms`
        : `for (let i = 0; i < ${steps}; ++i) layout.step();`;
      if (gpu) lines.push(`  if (gpu) gpu.step(${steps});${auto ? ` // ${steps}: what "auto" picked here` : ''}`, `  else ${cpuLoop}`);
      else lines.push(`  ${cpuLoop}`);
      lines.push(`  requestAnimationFrame(frame); // the view draws every step`, `}`, `frame();`);
      lines.push(...parts.helpers);
      return lines.join('\n');
    },
    copy() {
      let text = this.code();
      let done = () => {
        this.copied = true;
        this.copyFailed = false;
        setTimeout(() => { this.copied = false; }, 1500);
      };
      let fail = () => {
        // Show the code as text, selected, so the keyboard can copy it
        this.copyFailed = true;
        this.$nextTick(() => {
          let area = this.$refs.copyText;
          if (area) {
            area.focus();
            area.select();
          }
        });
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
      else fail();
    }
  }
}
</script>
