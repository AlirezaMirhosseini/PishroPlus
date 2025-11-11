<template>
  <div v-if="!$route.meta.noBreadCrumb" class="w-100 bg-container bc-wrapper">
    <div class="bread-crumb bg-surface">
      <div>
        <template v-for="item in routeParents" :key="item.name">
          <router-link color="red" :to="item.url">{{ $t(item.name) }}</router-link>
          <span>{{ ' / ' }}</span>
        </template>
        <span> {{ $t(pageTitle) }}</span>
      </div>
      <div>
        <v-btn
          class="back-button"
          :prepend-icon="backIcon"
          variant="text"
          size="small"
          color="primary"
          @click="$router.go(-1)"
        >
          {{ $t('back') }}
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import backIcon from '../icons/BreadCrumb-Back.vue'
import { markRaw } from 'vue'
import { mapState } from 'pinia'
import { defaultStore } from '../../stores/default'
export default {
  data() {
    return {
      backIcon: markRaw(backIcon)
    }
  },
  computed: {
    ...mapState(defaultStore, {
      pageTitle: 'pageTitle'
    }),
    routeParents() {
      return this.$route.meta.parents
    }
  },
}
</script>

<style>
.back-button .v-btn__prepend {
  transform: scaleX(-1);
  transition: 0.3s ease;
}

.v-locale--is-rtl .back-button .v-btn__prepend {
  transform: scaleX(1);
}
</style>
