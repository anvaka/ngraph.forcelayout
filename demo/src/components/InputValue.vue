<template>
<div class='block' :class='{inactive: disabled}'>
  <div class='row'>
    <div class='col'>{{label}}</div>
    <div class='col'>
      <input type='number' 
        :step='step' 
        v-model='inputValue' 
        :disabled='disabled'
        @focus="selectAll"
        autocomplete="off" 
        autocorrect="off" 
        autocapitalize="off" 
        spellcheck="false">
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

<style lang="stylus">
primary-text = white;

help-background = #004499;

.block {
  .row {
    display: flex;
    flex-direction: row;
    margin-top: 1px;
  }
  .col {
    flex: 1;
  }
  a.help-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: stretch;
    width: 25px;
    margin-right: -7px;
    svg {
      fill: secondary-text;
    }
    &.open {
      background: help-background;
      svg {
        fill: primary-text;
      }
    }
  }
  &.inactive .col {
    opacity: 0.5;
  }
  .row.note {
    font-size: 12px;
    opacity: 0.7;
    padding: 0 0 6px 0;
  }
  .row.help {
    margin-top: 0;
    background: help-background;
    padding: 8px;
    margin: 0 -7px;
  }
  input[type='text'],
  input[type='number'] {
    background: transparent;
    color: primary-text;
    border: 1px solid transparent;
    padding: 7px;
    font-size: 16px;
    width: 100%;
    margin-left: 7px;
    &:focus {
      outline-offset: 0;
      outline: none;
      border: 1px dashed;
      background: #13294f;
    }
    &:invalid {
      box-shadow:none;
    }
  }
}
</style>