<template>
  <v-dialog persistent v-model="dialog.show" width="380">
    <div class="bg-surface warning-container">
      <div class="d-flex align-center warning-header">
        <v-icon class="mx-2" :icon="warningIcon" color="warning" size="40" />
        <p class="v-card-title" style="font-weight: bold">{{ dialog.title }}</p>
      </div>
      <div class="pa-4">
        <p>{{ dialog.desc }}</p>
      </div>
      <div class="d-flex justify-end pe-2 mb-2">
        <v-btn @click="onConfirm" color="warning" variant="flat">{{ $t('yes') }}</v-btn>
        <v-btn @click="onCancel" variant="tonal" color="grey" class='mr-1'>{{ $t('cancel') }}</v-btn>
      </div>
    </div>
  </v-dialog>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../stores/default'
import warningIcon from '../icons/Warning.vue'
import { markRaw } from 'vue'

export default {
  data() {
    return {
      warningIcon: markRaw(warningIcon)
    }
  },
  computed: {
    ...mapState(defaultStore, {
      dialog: 'warningDialog'
    })
  },
  methods: {
    ...mapActions(defaultStore, {
      closeWarning: 'closeWarning'
    }),
    onCancel() {
      this.closeWarning()
    },
    onkeydown(e) {
      if (this.dialog?.show) {
        if (e.keyCode == 27) this.closeWarning()
        else if (e.keyCode == 13) this.dialog.confirm()
      }
    },
    onConfirm(){
      this.dialog.confirm();
      this.closeWarning()
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  }
}
</script>

<style>
.warning-container {
  border-radius: 15px;
}

.warning-header {
  border-bottom: 2px solid rgb(var(--v-theme-warning));
}
</style>
