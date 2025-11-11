<template>
  <nav-tab :items="[$t('definitions')]" v-model:activeTab="activeTab" storeName="supportTab"></nav-tab>
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
import navTab from '../../components/baseComponents/navTab.vue'
import easyAccessItem from '../../components/dashboardComponents/easyAccessItem.vue'
export default {
  data() {
    return {
      activeTab: localStorage?.getItem('supportTab') ?? 0,
      definitionItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('tickets'),
          desc: this.$t('tickets'),
          icon: 'mdi mdi-ticket',
          url: '/support/ticket'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('newTickets'),
          desc: this.$t('newTickets'),
            icon: 'mdi mdi-ticket-account',
          url: '/support/ticket/newTicket'
        },
      ]
    }
  },
  components: {
    navTab,
    easyAccessItem
  }
}
</script>