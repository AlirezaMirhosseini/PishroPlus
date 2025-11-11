<template>
  <v-btn
    v-scroll="onScroll"
    v-show="fab"
    fab
    dark
    fixed
    bottom
    right
    small
    color="primary"
    @click="toTop"
    :style="`bottom: 39px;right:${$vuetify.application.right + 10}px`"
  >
    <v-icon small>mdi-chevron-up</v-icon>
  </v-btn>
</template>

<script>
export default {
  data() {
    return {
      fab: false,
    }
  },
  methods: {
    onScroll(e) {
      if (typeof window === 'undefined') return
      const top = window.pageYOffset || e.target.scrollTop || 0
      this.fab = top > 20
    },
    toTop() {
      this.$vuetify.goTo(0)
    },
  },
}
</script>

<style></style>
