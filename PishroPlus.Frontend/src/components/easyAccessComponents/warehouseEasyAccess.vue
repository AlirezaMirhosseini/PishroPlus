<template>
  <nav-tab
    :items="[$t('receipt'), $t('remittance'), $t('definitions')]"
    v-model:activeTab="activeTab"
    storeName="warehouseTab"
  ></nav-tab>
  <div class="bg-surface flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center tab-container">
    <transition name="easyaccess" mode="out-in">
      <v-row justify="center" no-gutters dense style="align-content: baseline">
        <easy-access-item
          v-if="activeTab == 0"
          v-for="(item, index) in receiptItems"
          :key="index"
          :item="item"
        />
        <easy-access-item
          v-if="activeTab == 1"
          v-for="(item, index) in remitanceItems"
          :key="index"
          :item="item"
        />
        <easy-access-item
          v-if="activeTab == 2"
          v-for="(item, index) in definitionItems"
          :key="index"
          :item="item"
        />
      </v-row>
    </transition>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import navTab from '../../components/baseComponents/navTab.vue'
import easyAccessItem from '../../components/dashboardComponents/easyAccessItem.vue'
import NewReceiptIcon from '../../components/icons/NewReceipt.vue'
import ReceiptListIcon from '../../components/icons/ReceiptList.vue'

export default {
  data() {
    return {
      activeTab: localStorage?.getItem('warehouseTab') ?? 0,
      remitanceItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('remittanceList'),
          desc: this.$t('remittanceList'),
          icon: markRaw(ReceiptListIcon),
          url: '/warehouse/remittances'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('newRemittance'),
          desc: this.$t('newRemittance'),
          icon: markRaw(NewReceiptIcon),
          url: '/warehouse/remittances/new'
        }
      ],
      receiptItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('receiptList'),
          desc: this.$t('receiptList'),
          icon: markRaw(ReceiptListIcon),
          url: '/warehouse/receipts'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('newReceipt'),
          desc: this.$t('newReceipt'),
          icon: markRaw(NewReceiptIcon),
          url: '/warehouse/receipts/new'
        }
      ],
      definitionItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('warehouses'),
          desc: this.$t('warehouses'),
          icon: 'mdi mdi-warehouse',
          url: '/warehouse/list'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('products'),
          desc: this.$t('products'),
          icon: 'mdi mdi-shopping-outline',
          url: '/warehouse/products'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('services'),
          desc: this.$t('services'),
          icon: 'mdi mdi-account-wrench-outline',
          url: '/warehouse/services'
        },
        {
          id: 3,
          order: 3,
          title: this.$t('productsAndServicesCategory'),
          desc: this.$t('productsAndServicesCategory'),
          icon: 'mdi mdi-shape-outline',
          url: '/warehouse/productsAndServicesCategory'
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
