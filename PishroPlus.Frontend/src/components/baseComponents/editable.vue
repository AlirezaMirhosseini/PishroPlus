<template>
  <div @click="handleClick">
    <div
      :id="itemId"
      ref="me"
      contenteditable
      @input.stop="handleInput"
      @blur="handleDone"
      @keydown.enter="handleDone"
      @keypress.stop="handleKeyPress"
      v-text="value"
      v-show="editing"
    ></div>
    <span v-html="value" class="editable" v-if="!editing"></span>
  </div>
</template>

<script>
export default {
  name: 'EditableComponent',
  props: {
    value: {
      type: String,
      default: ''
    },
    maxLength: {
      type: Number,
      default: 500
    },
    itemId: {
      type: String,
      default: ''
    }
  },
  emits: ['input'],
  data() {
    return {
      editing: false
    }
  },
  methods: {
    handleInput() {},
    handleKeyPress(e) {
      if (e.target.innerText.length >= this.maxLength) {
        e.preventDefault()
        // eslint-disable-next-line
        return
      }
    },
    handleClick() {
      this.editing = true
      setTimeout(() => {
        this.$refs.me.focus()
      }, 10)
    },
    handleDone(e) {
      this.$emit('input', e.target.innerText)
      this.editing = false
    }
  }
}
</script>

<style></style>
