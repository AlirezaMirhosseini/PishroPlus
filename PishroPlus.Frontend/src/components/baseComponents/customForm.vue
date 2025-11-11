<template>
  <v-form ref="frm" @submit.prevent="submitForm">
    <slot></slot>
  </v-form>
</template>

<script>
export default {
  name: 'CustomFormComponent',
  props: {
    canUseTab:{
      type: Boolean,
      default: true
    },
    isValid: Boolean,
    checkValidation: {
      type: Boolean,
      default: true
    },
    focusoutKeyCode: {
      type: Number,
      default: () => 9
    }
  },
  computed: {
    currentTarget() {
      return this.$refs.$el
    }
  },
  emits: ['submit','update:isValid'],
  // mounted() {
  //   const children = Array.from(this.$refs.frm.$el).filter((a) => a.type !== 'fieldset')
  //   /* eslint-disable */
  //   children.forEach((element) => {
  //     element.addEventListener('keydown', (e) => {
  //       if (!this.canUseTab && e.keyCode === 9 && this.focusoutKeyCode !== 9) {
  //         e.preventDefault()
  //       }
  //       if (e.keyCode === this.focusoutKeyCode && e.target.tagName.toLowerCase() !== 'button') {
  //         e.preventDefault()
  //         const index = children.findIndex((m) => m.id === e.target.id)
  //         var nextInput = children[index + 1]
  //         nextInput.focus()
  //       }
  //     })
  //   })
  //   /* eslint-disable */
  // },
  methods: {
    async submitForm(ev) {
      const isVal = await this.$refs.frm.validate()
      if (this.checkValidation && !isVal.valid) {
        return
      }
      this.$emit('update:isValid', isVal)
      this.$emit('submit', ev)
    }
  }
}
</script>

<style></style>
