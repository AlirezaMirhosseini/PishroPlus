<template>
  <v-dialog
    v-model="show"
    persistent
    close-on-back
    width="width"
    max-width="maxWidth"
    min-width="minWidth"
    ref="cDialog"
  >
    <slot />
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      show: false
    }
  },
  emits: ['update:modelValue'],
  props: {
    modelValue: {
      required: true
    },
    maxWidth: {
      default: undefined
    },
    minWidth: {
      default: undefined
    },
    width: {
      default: undefined
    }
  },
  watch: {
    minWidth(value) {
      console.log(value)
    },
    maxWidth(value) {
      console.log(value)
    },
    width(value) {
      console.log(value)
    },
    modelValue(value) {
      this.show = value
    }
  },
  methods: {
    onkeydown(e) {
      if (this.show) {
        if (e.keyCode == 27) {
          console.log(this.$refs.cDialog)
          this.$emit('update:modelValue', false)
        }
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onkeydown)
    console.log(this.width)
    console.log(this.minWidth)
    console.log(this.maxWidth)
  },
  beforedestroy() {
    document.removeeventlistener('keydown', this.onkeydown)
  }
}
</script>

<style></style>
