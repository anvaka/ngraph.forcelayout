<template>
<div class='block' :class='{inactive: disabled}'>
  <div class='row'>
    <label class='col' :for='id'>{{label}}</label>
    <div class='col'>
      <input :id='id' type='number' 
        :step='step' 
        v-model='inputValue' 
        :disabled='disabled'
        @focus="selectAll"
        autocomplete="off" 
        autocorrect="off" 
        autocapitalize="off" 
        spellcheck="false">
    </div>
    <help-icon @show='helpVisible = !helpVisible' :class='{open: helpVisible}' :label='label' :expanded='helpVisible' :controls='id + "-help"'></help-icon>
  </div>
  <div class='row note' v-if='note'>{{note}}</div>
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
    modelValue: Number,
    step: {
      default: '0.1',
      type: String
    },
    disabled: Boolean,
    // short line shown under the input, e.g. why it is disabled
    note: String,
  },
  methods: {
    selectAll(e) {
      e.target.select()
    }
  },
  data() {
    return {
      // links the label, the input and its help
      id: 'value-' + (++ids),
      helpVisible: false,
      inputValue: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      if (newValue !== parseFloat(this.inputValue)) this.inputValue = newValue;
    },
    inputValue(newValue) {
      this.$emit('update:modelValue', parseFloat(newValue));
    }
  }
}
</script>

