<template>
  <v-overlay height="100%" width="100%" content-class="d-flex justify-center align-center" :close-on-content-click="false" class="align-center justify-center" :model-value="loading" z-index="10000">
    <div class="pa-4 rounded" style="width: 200px">
      <v-row class="mb-5 ps-7" no-gutters>
        <h4 class="text-white" style="font-family: IRANSans !important;">{{ $t('pleaseWait') }} {{ dots }}</h4>
      </v-row>
      <loading-svg />
    </div>
  </v-overlay>
</template>

<script>
import LoadingSvg from '../../components/icons/Loading.vue'
export default {
  name: 'LoadingComponent',
  components: {
    LoadingSvg
  },
  data() {
    return {
      timer: null,
      dots: '.'
    }
  },
  props: {
    loading: {
      default: () => false
    }
  },
  watch: {
    loading(value) {
      if (value) {
        let sec = 0
        this.timer = setInterval(() => {
          sec++
          let r = sec % 3
          switch (r) {
            case 0:
              this.dots = '.'
              break
            case 1:
              this.dots = '..'
              break
            case 2:
              this.dots = '...'
              break
          }
        }, 1000)
      } else if (this.timer) clearInterval(this.timer)
    }
  },
  methods: {
    start() {
      this.loading = true
    },
    finish() {
      this.loading = false
    }
  }
}
</script>

<style></style>
