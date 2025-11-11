<template>
  <v-btn @click="getAllDepartments" :prepend-icon="feedBackIcon" variant="text" size="medium" color="primary"
    :activeRoute="null">
  </v-btn>
</template>
<script>
import feedBackIcon from '../icons/feedback.vue'
import { markRaw } from 'vue'
import html2canvas from 'html2canvas'
import { defaultStore } from '../../stores/default'
import { mapState, mapActions } from 'pinia'
export default {
  data() {
    return {
      params: null,
      feedBackIcon: markRaw(feedBackIcon),
      selectedDepartment: null
    }
  },
  methods: {
    getAllDepartments() {
      this.$router.push(`/support/ticket/newTicket?from=${this.$route.fullPath}`)
      const targetElement = document.getElementById('app')
      // console.log(targetElement)
      html2canvas(targetElement)
        .then((canvas) => {
          this.screenshot = canvas.toDataURL()
        })
        .catch((error) => {
          console.error('error', error)
        })
    }
  }
  // async mounted() {
  //   await this.getAllDepartments()
  // },
}
</script>
<style scoped>
/* .btn{
float: left;
height: 10px;
} */
</style>
