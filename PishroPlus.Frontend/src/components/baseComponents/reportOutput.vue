<template>
  <!-- <v-row class="d-flex d-md-none justify-end" no-gutters> -->
  <div class="d-flex d-md-none justify-end">
    <v-btn :icon="pdfIcon" color="error" variant="text" />
    <v-btn :icon="excelIcon" color="success" variant="text" />
    <v-btn :icon="printIcon" color="info" @click="printPage" variant="text" />
  </div>
  <div class="d-none d-md-flex justify-end">
    <v-hover v-slot="{ isHovering, props }">
      <v-btn
        class="top-btn"
        v-bind="props"
        :prepend-icon="pdfIcon"
        color="error"
        :variant="isHovering ? 'tonal' : 'text'"
        >{{ $t('pdfFile') }}</v-btn
      >
    </v-hover>
    <v-hover v-slot="{ isHovering, props }">
      <v-btn
        class="top-btn"
        v-bind="props"
        :prepend-icon="excelIcon"
        color="success"
        :variant="isHovering ? 'tonal' : 'text'"
        >{{ $t('excelFile') }}</v-btn
      >
    </v-hover>
    <v-hover v-slot="{ isHovering, props }">
      <v-btn
        class="top-btn"
        v-bind="props"
        :prepend-icon="printIcon"
        color="info"
        @click="printPage"
        :variant="isHovering ? 'tonal' : 'text'"
        >{{ $t('print') }}</v-btn
      >
    </v-hover>
  </div>
</template>

<script>
import pdfIcon from '../icons/Pdf.vue'
import excelIcon from '../icons/Excel.vue'
import printIcon from '../icons/Print.vue'
import { markRaw } from 'vue'
export default {
  data() {
    return {
      pdfIcon: markRaw(pdfIcon),
      excelIcon: markRaw(excelIcon),
      printIcon: markRaw(printIcon)
    }
  },
  methods: {
    printPage() {
      window.print()
    }
  }
}
</script>

<style>
.top-btn {
  /* width: 20px; */
  overflow: hidden;
  transition: all 0.6s ease;
  padding-inline: 0 !important;
  /* margin-inline-start: -15px; */
  margin-inline: 0;
}

.top-btn .v-btn__content {
  width: 0px;
  overflow: hidden;
  transition: 0.6s ease;
}

.top-btn:hover {
  width: 110px;
  margin-inline: 5px;
  transition: all 0.6s ease;
}

.top-btn:hover .v-btn__content {
  width: 65px;
  transition: all 0.6s ease;
}
</style>
