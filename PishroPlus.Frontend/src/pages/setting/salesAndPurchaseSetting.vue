<template>
  <v-card>
    <v-card class="ma-4 pa-2">
      <v-card-title class="text-primary">
        {{ $t('salesSetting') }}
      </v-card-title>
      <v-divider></v-divider>
      
      <div class="pa-3">
        <v-form @submit.prevent="" class="py-2">
          <v-row no-gutters class="mb-4">
            <v-col cols="12" md="3" class="pa-1">
              <v-checkbox
                hide-details
                :label="$t('enableBarcodeReaderAsDefault')"
                v-model="salesSettings.enableBarcodeReaderAsDefault"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="3" class="pa-1">
              <v-checkbox
                hide-details
                :label="$t('barcodeScaningFastMode')"
                v-model="salesSettings.barcodeScaningFastMode"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="3" class="pa-1">
              <v-checkbox
                hide-details
                :label="$t('creatingVoucherAfterSalesInvoiceCreation')"
                v-model="salesSettings.creatingVoucherAfterSalesInvoiceCreation"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="3" class="pa-1">
              <v-checkbox
                disabled
                hide-details
                :label="$t('sendSMSToCustomerAfterInvoiceCreation')"
                v-model="salesSettings.sendSMSToCustomerAfterInvoiceCreation"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
    
    <v-card class="ma-4 pa-2">
      <v-card-title class="text-primary">
        {{ $t('purchaseSetting') }}
      </v-card-title>
      <v-divider></v-divider>
      
      <div class="pa-3">
        <v-form @submit.prevent="" class="py-2">
          <v-row no-gutters class="mb-4">
            <v-col cols="12" md="4" class="pa-1">
              <v-checkbox
                hide-details
                :label="$t('creatingVoucherAfterPurchaseInvoiceCreation')"
                v-model="purchaseSettings.creatingVoucherAfterPurchaseInvoiceCreation"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <v-checkbox
                hide-details
                :label="$t('enableBarcodeScanForPurchase')"
                v-model="purchaseSettings.enableBarcodeScanForPurchase"
              ></v-checkbox>
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <v-checkbox
                hide-details
                :label="$t('purchaseAutomaticCodeGeneration')"
                v-model="purchaseSettings.purchaseAutomaticCodeGeneration"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-card>
    
    <v-row no-gutters justify="end" class="ma-4">
      <v-btn
        color="primary"
        prepend-icon="mdi-content-save"
        @click="saveSettings"
        size="large"
      >{{ $t('save') }}</v-btn>
    </v-row>
  </v-card>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import accountSelector from '../../components/accountsComponents/accountSelector.vue'
import settingService from '../../../api/setting/settingService'
import accountService from '../../../api/account/accountService'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'

export default {
  components: {
    accountSelector,
    dataTable
  },
  data() {
    return {
      salesSettings: {
        creatingVoucherAfterSalesInvoiceCreation: false,
        enableBarcodeReaderAsDefault: false,
        barcodeScaningFastMode: false,
        sendSMSToCustomerAfterInvoiceCreation: false
      },
      purchaseSettings: {
        creatingVoucherAfterPurchaseInvoiceCreation: false,
        enableBarcodeScanForPurchase: false,
        purchaseAutomaticCodeGeneration: false
      }
    }
  },
  async created() {
    await this.getSettings();
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
    }),
    
    async saveSettings() {
      const salesSettingsArray = [
        {
          key: 'CreatingVoucherAfterSalesInvoiceCreation',
          value: this.salesSettings.creatingVoucherAfterSalesInvoiceCreation.toString(),
          module: 6
        },
        {
          key: 'EnableBarcodeReaderAsDefault', 
          value: this.salesSettings.enableBarcodeReaderAsDefault.toString(),
          module: 6
        },
        {
          key: 'BarcodeScaningFastMode',
          value: this.salesSettings.barcodeScaningFastMode.toString(), 
          module: 6
        },
        {
          key: 'SendSMSToCustomerAfterInvoiceCreation',
          value: this.salesSettings.sendSMSToCustomerAfterInvoiceCreation.toString(),
          module: 6
        }
      ];
      
      const purchaseSettingsArray = [
        {
          key: 'CreatingVoucherAfterPurchaseInvoiceCreation',
          value: this.purchaseSettings.creatingVoucherAfterPurchaseInvoiceCreation.toString(),
          module: 7
        },
        {
          key: 'EnableBarcodeScanForPurchase', 
          value: this.purchaseSettings.enableBarcodeScanForPurchase.toString(),
          module: 7
        },
        {
          key: 'PurchaseAutomaticCodeGeneration',
          value: this.purchaseSettings.purchaseAutomaticCodeGeneration.toString(), 
          module: 7
        }
      ];
      
      const allSettings = [...salesSettingsArray, ...purchaseSettingsArray];
      const response = await settingService.setSettings(allSettings);

      if (response.isSuccess) {
        this.setErrorMessage(this.$t('settingHasSetSuccessfully'), 'success');
      } else {
        this.setErrorMessage(response.message);
      }
    },
    
    async getSettings() {
      try {
        const salesResponse = await settingService.getSetting({ settingModule: 6 });
        if (salesResponse.isSuccess) {
          const salesSettings = salesResponse.value.result;
          this.salesSettings = {
            creatingVoucherAfterSalesInvoiceCreation: this.getSetting(salesSettings, 'CreatingVoucherAfterSalesInvoiceCreation'),
            enableBarcodeReaderAsDefault: this.getSetting(salesSettings, 'EnableBarcodeReaderAsDefault'),
            barcodeScaningFastMode: this.getSetting(salesSettings, 'BarcodeScaningFastMode'),
            sendSMSToCustomerAfterInvoiceCreation: this.getSetting(salesSettings, 'SendSMSToCustomerAfterInvoiceCreation')
          };
        } else {
          this.setErrorMessage(salesResponse.message);
        }
        
        const purchaseResponse = await settingService.getSetting({ settingModule: 7 });
        if (purchaseResponse.isSuccess) {
          const purchaseSettings = purchaseResponse.value.result;
          this.purchaseSettings = {
            creatingVoucherAfterPurchaseInvoiceCreation: this.getSetting(purchaseSettings, 'CreatingVoucherAfterPurchaseInvoiceCreation'),
            enableBarcodeScanForPurchase: this.getSetting(purchaseSettings, 'EnableBarcodeScanForPurchase'),
            purchaseAutomaticCodeGeneration: this.getSetting(purchaseSettings, 'PurchaseAutomaticCodeGeneration')
          };
        }
      } catch (error) {
        this.setErrorMessage('خطا در دریافت تنظیمات: ' + error.message);
      }
    },
    
    getSetting(settings, key) {
      const setting = settings.find(x => x.key === key);
      return setting?.value === 'true';
    }
  }
}
</script>

<style scoped>

</style>