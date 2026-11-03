<template>
<div class='block'>
  <div class='row'>
    <div class='col'>{{label}}</div>
    <div class='col'>
      <input type='checkbox' v-model='inputValue' >
    </div>
    <help-icon @show='helpVisible = !helpVisible' :class='{open: helpVisible}'></help-icon>
  </div>
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
    modelValue: Boolean,
  },
  methods: {
    selectAll(e) {
      e.target.select()
    }
  },
  data() {
    return {
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

