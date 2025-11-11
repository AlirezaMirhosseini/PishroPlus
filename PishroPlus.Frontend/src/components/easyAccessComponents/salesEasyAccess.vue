<template>
  <nav-tab :items="[$t('definitions')]" v-model:activeTab="activeTab" storeName="saleTab"></nav-tab>
  <div class="bg-surface flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center tab-container">
    <transition name="easyaccess" mode="out-in">
      <v-row
        v-if="activeTab == 0"
        justify="center"
        no-gutters
        dense
        style="align-content: baseline"
      >
        <easy-access-item v-for="(item, index) in definitionItems" :key="index" :item="item" />
      </v-row>
    </transition>
  </div>
</template>
<script>
import { markRaw } from 'vue'
import navTab from '../../components/baseComponents/navTab.vue'
import easyAccessItem from '../../components/dashboardComponents/easyAccessItem.vue'
import quickInvoiceIcon from '../../components/icons/quickInvoice.vue'
export default {
  data() {
    return {
      activeTab: localStorage?.getItem('saleTab') ?? 0,
      definitionItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('quickInvoice'),
          desc: this.$t('quickInvoice'),
          icon: 'mdi-note-plus-outline mdi-flip-h',
          url: '/sales/quick'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('newSale'),
          desc: this.$t('newSale'),
          icon: 'mdi-note-plus-outline mdi-flip-h',
          url: '/sales/new'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('saleList'),
          desc: this.$t('saleList'),
          icon: 'mdi-note-multiple-outline mdi-flip-h',
          url: '/sales'
        }
      ]
    }
  },
  components: {
    navTab,
    easyAccessItem
  }
}
</script>