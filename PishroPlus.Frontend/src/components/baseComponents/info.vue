<template>
  <v-dialog persistent v-model="showDialog" min-width="380" max-width="fit-content">
    <div class="bg-surface info-container">
      <v-form ref="infoFormRef" @submit.prevent="submit">
        <div class="d-flex align-center info-header">
          <v-icon class="mx-2" :icon="infoIcon" color="info" size="40" />
          <p class="v-card-title" style="font-weight: bold">{{ title }}</p>
          <v-btn
            class="ms-auto me-2"
            variant="text"
            size="x-small"
            icon="mdi mdi-window-close"
            @click="$emit('update:show', false)"
          />
        </div>
        <div class="pa-4" style="position: relative">
          <p>{{ desc }}</p>
          <slot name="body" />
        </div>
        <div class="d-flex justify-end pe-2 mb-2">
          <slot name="action" />
        </div>
      </v-form>
    </div>
  </v-dialog>
</template>

<script>
import { markRaw } from 'vue'
import infoIcon from '../icons/Info.vue'
export default {
  data() {
    return {
      infoIcon: markRaw(infoIcon)
    }
  },
  props: {
    show: { required: true },
    title: { required: true },
    desc: { required: true },
    formRef: { required: false },
    isVal: { required: false }
  },
  emits: ['update:isVal', 'update:show', 'submitForm'],
  methods: {
    async submit() {
      const isVal = await this.$refs.infoFormRef.validate()
      this.$emit('update:isVal', isVal)
      this.$emit('submitForm')
    },
    onkeydown(e) {
      if (this.show && e.keyCode == 27) this.$emit('update:show', false)
    }
  },
  computed: {
    showDialog: {
      get() {
        return this.show
      },
      set(value) {
        this.$emit('update:show', value)
      }
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
.info-container {
  border-radius: 15px;
}

.info-header {
  border-bottom: 2px solid rgb(var(--v-theme-info));
}
</style>
