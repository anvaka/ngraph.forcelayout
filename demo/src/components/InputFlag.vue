<template>
<div class='block'>
  <div class='row'>
    <label class='col' :for='id'>{{label}}</label>
    <div class='col'>
      <input :id='id' type='checkbox' v-model='inputValue' >
    </div>
    <help-icon @show='helpVisible = !helpVisible' :class='{open: helpVisible}' :label='label' :expanded='helpVisible' :controls='id + "-help"'></help-icon>
  </div>
  <div class='row help' v-if='helpVisible' :id='id + "-help"'>
    <slot></slot>
  </div>
</div>
</template>
<script>
import HelpIcon from './HelpIcon.vue';

let ids = 0;

export default {
  components: {
    HelpIcon
  },
  emits: ['update:modelValue'],
  props: {
    label: String,
    modelValue: Boolean,
  },
  methods: {
    selectAll(e) {
      e.target.select()
    }
  },
  data() {
    return {
      // links the label, the input and its help
      id: 'flag-' + (++ids),
      helpVisible: false,
      inputValue: this.modelValue
    }
  },
  watch: {
    inputValue(newValue) {
      this.$emit('update:modelValue', newValue);
    }
  }
}
</script>

