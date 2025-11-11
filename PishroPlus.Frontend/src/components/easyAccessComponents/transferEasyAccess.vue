<template>
  <nav-tab
    :items="[$t('receive'), $t('pay'),$t('definitions')]"
    v-model:activeTab="activeTab"
    storeName="transferTab"
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
        <easy-access-item v-for="(item, index) in receiveItems" :key="index" :item="item" />
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
        <easy-access-item v-for="(item, index) in payItems" :key="index" :item="item" />
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
        <easy-access-item v-for="(item, index) in accountItems" :key="index" :item="item" />
      </v-row>
    </transition>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import navTab from '../../components/baseComponents/navTab.vue'
import easyAccessItem from '../../components/dashboardComponents/easyAccessItem.vue'
import bankAccountIcon from '../../components/icons/BankAccount.vue'
import accountingRegisterIncomesToCashDeskIcon from '../../components/icons/AccountingRegisterIncomesToCashDesk.vue'
import fundAccountIcon from '../../components/icons/FundAccount.vue'
import receiveAndPayListIcon from '../../components/icons/ReceiveAndPayList.vue'
import checkBookIcon from '../../components/icons/CheckBook.vue'
import receiveIcon from '../../components/icons/Receive.vue'
export default {
  data() {
    return {
      activeTab: localStorage?.getItem('transferTab') ?? 0,
      accountItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('bank'),
          desc: this.$t('registerBankAccount'),
          icon: markRaw(bankAccountIcon),
          url: '/transfer/registerAccount/bank'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('cashDesk'),
          desc: this.$t('registerCashDeskAccount'),
          icon: markRaw(accountingRegisterIncomesToCashDeskIcon),
          url: '/transfer/registerAccount/cashBox'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('fund'),
          desc: this.$t('registerFundAccount'),
          icon: markRaw(fundAccountIcon),
          url: '/transfer/registerAccount/fund'
        },
        {
          id: 3,
          order: 3,
          title: this.$t('checkBook'),
          desc: this.$t('checkBookList'),
          icon: 'mdi mdi-checkbook',
          url: '/transfer/checkBookList'
        },
      ],
      receiveItems: [
        {
          id: 1,
          order: 1,
          title: this.$t('receiveList'),
          desc: this.$t('receiveAndPayList'),
          icon: markRaw(receiveAndPayListIcon),
          url: '/transfer/payOrReceiveList/receive'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('addReceive'),
          desc: this.$t('receiveAndPayList'),
          icon: markRaw(receiveIcon),
          url: '/transfer/wizard/register/receive'
        }
      ],
      payItems: [
        {
          id: 1,
          order: 1,
          title: this.$t('payList'),
          desc: this.$t('receiveAndPayList'),
          icon: markRaw(receiveAndPayListIcon),
          url: '/transfer/payOrReceiveList/pay'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('addPay'),
          desc: this.$t('receiveAndPayList'),
          icon: markRaw(receiveIcon),
          iconStyle:'transform: scaleY(-1)',
          url: '/transfer/wizard/register/pay'
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

<style></style>
