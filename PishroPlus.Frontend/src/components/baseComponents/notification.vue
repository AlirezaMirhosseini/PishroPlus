<template>
  <v-snackbar
    v-if="snackbar"
    top
    v-model="snackbar"
    :timeout="3000"
    :color="notice.type === 'success' ? 'green' : '#b61827'"
    transition="scroll-y-transition"
    multi-line
  >
    <v-row no-gutters justify="space-between" align="center">
      <p class="mb-0">{{ notice.message }}</p>
      <v-btn color="white" icon @click="snackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-row>
  </v-snackbar>
</template>
<script>
export default {
  name: 'NotificationComponent',
  computed: {
    snackbar: {
      get() {
        if (!this.$store.state.notice) return false
        return true
      },
      set(val) {
        console.log(val);
        if (!val) {
          this.$store.commit('set_notice', null)
        } else {
          this.$store.commit('set_notice', {
            message: this.notice.message,
            type: 'error',
          })
        }
      },
    },
    notice() {
      return this.$store.state.notice
    },
  },
}
</script>

<style>
</style>