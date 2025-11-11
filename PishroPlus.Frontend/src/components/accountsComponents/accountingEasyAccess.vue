<template>
  <nav-tab
    :items="[$t('vouchers'), $t('reports'), $t('definitions') ]"
    v-model:activeTab="activeTab"
    storeName="accountingTab"
  ></nav-tab>
  <div class="bg-surface flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center tab-container">
    <transition name="easyaccess" mode="out-in">
      <v-row
        v-if="activeTab == 0"
        justify="center"
        no-gutters
        dense
        style="align-content: baseline"
      >
        <easy-access-item v-for="(item, index) in registerItems" :key="index" :item="item" />
      </v-row>
    </transition>
    <transition name="easyaccess" mode="out-in">
      <v-row
        v-if="activeTab == 1"
        justify="center"
        no-gutters
        dense
        style="align-content: baseline"
      >
        <easy-access-item v-for="(item, index) in reportItems" :key="index" :item="item" />
      </v-row>
    </transition>
    <transition name="easyaccess" mode="out-in">
      <v-row
        v-if="activeTab == 2"
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
import registerDocumentIcon from '../../components/icons/AccountingRegisterDocument.vue'
import stopRegisterDocumentIcon from '../../components/icons/AccountingStopRegisterDocument.vue'
import statusDeteminationIcon from '../../components/icons/AccountingStatusDetemination.vue'
import manualRegisterClosingDocumentIcon from '../../components/icons/AccountingManualRegisterClosingDocument.vue'
import registerIncomesToCashDeskIcon from '../../components/icons/AccountingRegisterIncomesToCashDesk.vue'
import reviewAccountsIcon from '../../components/icons/ReviewAccounts.vue'
import treeViewIcon from '../../components/icons/AccountingTreeView.vue'
import voucherJournalIcon from '../../components/icons/VoucherJournal.vue'
import voucherListIcon from '../../components/icons/VoucherList.vue'
export default {
  data() {
    return {
      activeTab: localStorage?.getItem('accountingTab') ?? 0,
      definitionItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('accountingTreeView'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(treeViewIcon),
          url: '/accounting/treeview'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('detailedAccountsTreeView'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(treeViewIcon),
          url: '/accounting/detailedAccountsTreeView'
        }
      ],
      reportItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('reviewAccounts'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(reviewAccountsIcon),
          url: '/accounting/reviewAccounts'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('voucherJournal'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(voucherJournalIcon),
          url: '/accounting/voucherJournal'
        }
      ],
      registerItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('registerAccountingVoucher'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(registerDocumentIcon),
          url: '/accounting/registerVoucher/create/new'
        },        {
          id: 1,
          order: 1,
          title: this.$t('vouchersList'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(voucherListIcon),
          url: '/accounting/vouchers'
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

<style>
.tab-container {
  min-height: calc(100% - 100px);
  border-radius: 5px;
  position: relative;
  max-height: calc(100% - 100px);
  overflow-y: auto;
}

.easyaccess-enter-active {
  animation: ea-anim 0.3s ease-out;
}

.easyaccess-leave-active {
  animation: ea-anim 0.3s ease-in reverse;
}

@keyframes ea-anim {
  from {
    opacity: 0;
    position: absolute;
    top: 100px;
  }

  to {
    opacity: 1;
    position: absolute;
    top: 16px;
  }
}
</style>
