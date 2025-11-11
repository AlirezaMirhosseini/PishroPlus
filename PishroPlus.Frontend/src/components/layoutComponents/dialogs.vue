<template>
  <v-menu :close-on-content-click="false" location="right" width="500px">
    <template v-slot:activator="{ props }">
      <span class="top-icon">
        <v-badge content="33" max="10" color="primary" location="bottom start">
          <v-btn size="medium" icon="mdi-bell-outline" color="primary" variant="text" v-bind="props">
          </v-btn>
        </v-badge>
      </span>
    </template>
    <div>
      <v-card v-for="items in item" :key="items.id" class="ml-2">
        <v-card-text class="text-subtitle-2 rounded">
          <div class="d-flex justify-space-between mb-2">
            <p class="font-weight-bold">{{ items.title }}</p>
            <div>
            <span class="footer-text">{{ persianDate }}</span>
            <span class="footer-text">{{ $t('hour') }}:</span>
            <span class="footer-text">{{ time }}</span>
          </div>
          </div>
          <div class="d-flex justify-space-between">
            <p>{{ items.description }}</p>
            <img src="@/assets/images/companyImg.png" alt="not show" width="50px" />
          </div>
          <v-checkbox label="isRead" hide-details color="primary" class="mr-n3"></v-checkbox>
        </v-card-text>
      </v-card>
    </div>
  </v-menu>
</template>
<script>
import companyIcon from '../icons/companyIcon.vue'
import { markRaw } from 'vue'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'

export default {
  data() {
    return {
      item: [
        {
          id: 1,
          title: this.$t('test'),
          description: this.$t('test'),
          isRead: 'read',
          // date:  Date.now(),
        }
      ]
    }
    companyIcon: markRaw(companyIcon)
  },
  computed:{
     ...mapState(defaultStore, {
      companyDetails: 'companyDetails',
      currentFP: 'fp'
      }),
     persianDate() {
      var options = {
        weekday: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
      return new Intl.DateTimeFormat(
        this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US',
        options
      ).format(this.date)
    },
    time() {
      var options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }
      return new Intl.DateTimeFormat(
        this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US',
        options
      ).format(this.date)
    }
  }
}
</script>