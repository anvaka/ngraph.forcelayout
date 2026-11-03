<template>
<div class='legend' ref='row'>
  <!-- Anything before the name (the about button) -->
  <slot></slot>
  <span class='legend-name'>Colour: {{title}}</span>
  <span class='legend-chip' v-for='item in shown' :key='item.label'><span class='swatch' aria-hidden='true' :style='{background: item.color}'></span>{{item.label}}</span>
  <span class='legend-more' v-if='hidden' :title='hiddenNames'>+{{hidden}}</span>
  <!-- Every chip once more, out of sight, to measure what fits -->
  <div class='legend-measure' aria-hidden='true' ref='measure'>
    <span class='legend-name'>Colour: {{title}}</span>
    <span class='legend-chip' v-for='item in items' :key='item.label'><span class='swatch' :style='{background: item.color}'></span>{{item.label}}</span>
    <span class='legend-more'>+{{items.length + more}}</span>
  </div>
</div>
</template>

<script>
// What the colors mean, as a row of chips that never cuts a word: it shows the chips that fit in
// the lines the row may take (one when the row doesn't wrap, as on a phone; two when it wraps),
// then "+N" for the rest. It measures again when its width changes.
export default {
  props: {
    title: String,
    // [{color, label, count}], the most common first
    items: {type: Array, default: () => []},
    // categories past `items` (they share a neutral color)
    more: {type: Number, default: 0},
    // lines the row may take when it wraps
    lines: {type: Number, default: 2}
  },
  data() {
    return {fit: this.items.length};
  },
  computed: {
    shown() {
      return this.items.slice(0, this.fit);
    },
    hidden() {
      return this.items.length - this.fit + this.more;
    },
    hiddenNames() {
      let names = this.items.slice(this.fit).map(item => item.label);
      if (this.more) names.push(`${this.more} more`);
      return names.join(', ');
    }
  },
  watch: {
    items() { this.$nextTick(this.measure); },
    more() { this.$nextTick(this.measure); }
  },
  mounted() {
    this.measure();
    if (typeof ResizeObserver === 'function') {
      this.observer = new ResizeObserver(() => this.measure());
      this.observer.observe(this.$refs.row);
    }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => this.measure());
  },
  beforeUnmount() {
    if (this.observer) this.observer.disconnect();
  },
  methods: {
    measure() {
      let row = this.$refs.row, measure = this.$refs.measure;
      if (!row || !measure) return;
      let style = getComputedStyle(row);
      let width = row.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight);
      if (!(width > 0)) return;
      let gap = parseFloat(style.columnGap) || 0;
      let lines = style.flexWrap === 'nowrap' ? 1 : this.lines;
      // What comes before the name (the slot), as the row lays it out
      let before = [];
      for (let el = row.firstElementChild; el && !el.classList.contains('legend-name'); el = el.nextElementSibling) {
        if (el.offsetWidth) before.push(el.offsetWidth);
      }
      let parts = measure.children;
      let name = parts[0].offsetWidth;
      let chips = Array.from(parts).slice(1, 1 + this.items.length).map(el => el.offsetWidth);
      let plus = parts[parts.length - 1].offsetWidth;
      // Greedy, like flex-wrap: the most chips whose line count, with "+N" when some are left out,
      // stays within `lines`
      let fits = list => {
        let line = 1, x = 0;
        for (let w of list) {
          let next = x ? x + gap + w : w;
          if (next > width + 0.5 && x) {
            line += 1;
            x = w;
          } else {
            x = next;
          }
          if (line > lines || x > width + 0.5) return false;
        }
        return true;
      };
      let k = chips.length;
      while (k > 0) {
        let list = before.concat(name, chips.slice(0, k));
        if (k < chips.length || this.more) list.push(plus);
        if (fits(list)) break;
        k -= 1;
      }
      this.fit = k;
    }
  }
};
</script>
