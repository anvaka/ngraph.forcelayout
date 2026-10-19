<template>
<div class='block' :class='{inactive: disabled}'>
  <div class='row'>
    <div class='col'>{{label}}</div>
    <div class='col'>
      <select v-model='inputValue' :disabled='disabled'>
        <option v-for='option in options' :key='option.value' :value='option.value' :disabled='option.disabled'>{{option.label}}</option>
      </select>
    </div>
    <help-icon @show='helpVisible = !helpVisible' :class='{open: helpVisible}'></help-icon>
  </div>
  <div class='row note' v-if='note'>{{note}}</div>
  <div class='row help' v-if='helpVisible'>
    <slot></slot>
  </div>
</div>
</template>
<script>
import HelpIcon from './HelpIcon.vue';

export default {
  components: {
    HelpIcon
  },
  emits: ['update:modelValue'],
  props: {
    label: String,
    modelValue: String,
    disabled: Boolean,
    // short line shown under the select, e.g. why it is disabled
    note: String,
    // [{value, label, disabled?}]
    options: Array,
  },
  data() {
    return {
      helpVisible: false,
      inputValue: this.modelValue
    }
  },
  watch: {
    modelValue(newValue) {
      this.inputValue = newValue;
    },
    inputValue(newValue) {
      this.$emit('update:modelValue', newValue);
    }
  }
}
</script>

<style lang="stylus">
.block select {
  width: 100%;
  margin: 4px 0 4px 7px;
  font-size: 14px;
}
</style>
