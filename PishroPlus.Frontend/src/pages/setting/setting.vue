<template>
  <v-card>
    <v-card-text class="px-0">
      <v-row no-gutters class="flex-column">
        <!-- <v-row class="align-center" no-gutters>
          <v-tabs v-model="tab" color="primary" align-tabs="start">
            <v-tab v-for="item in tabItems" :value="item.title" :key="item.title"
              ><v-icon
                class="me-2"
                size="25"
                :color="tab == item.title ? 'primary' : 'grey'"
                :icon="item.icon"
              />
              <p
                :class="tab == item.title ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == item.title ? 'bold' : 'unset'}`"
              >
                {{ $t(item.title) }}
              </p></v-tab
            >
          </v-tabs>
        </v-row> -->

        <!-- <v-window :touch="false" v-model="tab" style="width: 100%">
          <v-window-item value="generalSettings">
            <general-setting :shortcutConfig="shortcutConfig" />
          </v-window-item>
          <v-window-item value="accountingSettings">
            <voucher-setting />
          </v-window-item>
          <v-window-item value="receiveAndPaySetting">
            <receive-and-pay-setting />
          </v-window-item>
          <v-window-item value="remittanceOrReceiptSetting">
          </v-window-item>
          <v-window-item value="remittanceOrReceiptSetting">
            <remittanceOrReceiptSetting></remittanceOrReceiptSetting>
          </v-window-item>
          <v-window-item value="salesSetting">
            <sales-setting />
          </v-window-item>
          <v-window-item value="templateSetting">
            <theme-setting />
          </v-window-item>
          <v-window-item value="shopSetting">
            <shop-setting />
          </v-window-item>
        </v-window> -->
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
// import RightMenuHesabdari from '../../components/icons/RightMenu-Hesabdari.vue'
// import { markRaw } from 'vue'
// import salesSetting from '../../components/settingComponents/salesSetting.vue'
// import themeSetting from '../../components/settingComponents/themeSetting.vue'
// import voucherSetting from '../../components/settingComponents/voucherSetting.vue'
// import remittanceOrReceiptSetting from '../../components/settingComponents/remittanceOrReceiptSetting.vue'
// import receiveAndPaySetting from '../../components/settingComponents/reveiveAndPaySetting.vue'
// import generalSetting from '../../components/settingComponents/generalSetting.vue'
// import salesSetting from '../../components/settingComponents/salesSetting.vue'
// import themeSetting from '../../components/settingComponents/themeSetting.vue'
// import voucherSetting from '../../components/settingComponents/voucherSetting.vue'
// import remittanceOrReceiptSetting from '../../components/settingComponents/remittanceOrReceiptSetting.vue'
// import receiveAndPaySetting from '../../components/settingComponents/reveiveAndPaySetting.vue'
// import generalSetting from '../../components/settingComponents/generalSetting.vue'
// import RightMenuCheckOBank from '../../components/icons/RightMenu-CheckOBank.vue'
// import AnbarIcon from '../../components/icons/RightMenu-Anbar.vue'
// import SaleIcon from '../../components/icons/RightMenu-Sale.vue'

export default {
  data() {
    return {
      shortcutConfig:{
        openReceiptOrRemittanceListPanel: 'ctrl+m'
      },
      tabItems: [
        // { title: 'generalSettings', icon: 'mdi mdi-cog-outline' },
        // { title: 'accountingSettings', icon: markRaw(RightMenuHesabdari) },
        // { title: 'receiveAndPaySetting', icon: markRaw(RightMenuCheckOBank) },
        // {title: 'remittanceOrReceiptSetting', icon: markRaw(AnbarIcon),},
        // { title: 'salesSetting', icon: markRaw(SaleIcon) },
        // { title: 'templateSetting', icon: 'mdi mdi-brush-variant' },
        // { title: 'shopSetting', icon: 'mdi mdi-store' },
        // { title: 'generalSettings', icon: 'mdi mdi-cog-outline' },
        // { title: 'accountingSettings', icon: markRaw(RightMenuHesabdari) },
        // { title: 'receiveAndPaySetting', icon: markRaw(RightMenuCheckOBank) },
        // {title: 'remittanceOrReceiptSetting', icon: markRaw(AnbarIcon),},
        // { title: 'salesSetting', icon: markRaw(SaleIcon) },
        // { title: 'shopSetting', icon: 'mdi mdi-store' },
        
      ],
      // tab: 'generalSettings'
    }
  },
  components: {
    // themeSetting,
    // voucherSetting,
    // receiveAndPaySetting,
    // generalSetting,
    // voucherSetting,
    // receiveAndPaySetting,
    // generalSetting,
    // salesSetting,
    // remittanceOrReceiptSetting
  },
  
}
</script>

<style>
.v-color-picker-edit input {
  /* font-family: serif !important; */
  direction: ltr;
}
</style>
