<template>
  <v-card>
    <div class="pa-3">
      <v-form @submit.prevent="" class="py-2">
        <v-row no-gutters class="mb-4">
          <v-col cols="12" md="3" class="pa-1">
            <v-checkbox
              hide-details
              :label="$t('enableBarcodeReaderAsDefault')"
              v-model="publicSettings.enableBarcodeReaderAsDefault"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="3" class="pa-1">
            <v-checkbox
              hide-details
              :label="$t('barcodeScaningFastMode')"
              v-model="publicSettings.barcodeScaningFastMode"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="3" class="pa-1">
            <v-checkbox
              hide-details
              :label="$t('creatingVoucherAfterSalesInvoiceCreation')"
              v-model="publicSettings.creatingVoucherAfterSalesInvoiceCreation"
            ></v-checkbox>
          </v-col>
          <v-col cols="12" md="3" class="pa-1">
            <v-checkbox
              disabled
              hide-details
              :label="$t('sendSMSToCustomerAfterInvoiceCreation')"
              v-model="publicSettings.sendSMSToCustomerAfterInvoiceCreation"
            ></v-checkbox>
          </v-col>
        </v-row>
        <!-- <v-row no-gutters class="px-1">
          <v-col cols="12" md="4" class="pa-1">
            <accountSelector
              v-model="publicSettings.defaultSalesInvoiceCustomerAccount"
              :title="$t('defaultSalesInvoiceCustomerAccount')"
              :persistent="false"
              addNewRoute="/persons/new"
            />
          </v-col>
        </v-row>
        <fieldset class="pishro-border mb-2">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ $t('invoiceSettlement') }}
          </legend>
          <v-row no-gutters class="px-1">
            <v-col cols="12" md="4" class="pa-1">
              <accountSelector
                v-model="publicSettings.settlement.cashDefaultCashBoxAccount"
                :detailedAccountFamily="5"
                :mainHeaders="cashBoxHeaders"
                :persistent="false"
                :title="$t('defaultSalesInvoiceSettlementCashAccount')"
                addNewRoute="/transfer/registerAccount/cashBox"
                @accountAdded="handleCashBoxAdded"
              />
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <accountSelector
                v-model="publicSettings.settlement.depositDefaultBankAccount"
                :detailedAccountFamily="4"
                :mainHeaders="bankHeaders"
                :persistent="false"
                :title="$t('defaultSalesInvoiceSettlementDepositBankAccount')"
                addNewRoute="/transfer/registerAccount/bank"
                @accountAdded="handleAccountAdded"
              />
            </v-col>
            <v-col cols="12" md="4" class="pa-1">
              <accountSelector
                v-model="publicSettings.settlement.checkDefaultBankAccount"
                :detailedAccountFamily="4"
                :persistent="false"
                :title="$t('defaultSalesInvoiceSettlementCheckBankAccount')"
              />
            </v-col>
          </v-row>
        </fieldset> -->
        <v-row no-gutters justify="end">
          <v-btn
            color="primary"
            prepend-icon="mdi-content-save"
            @click="setDefaultAccounts"
            size="large"
            >{{ $t('save') }}</v-btn
          >
        </v-row>
      </v-form>
    </div>
  </v-card>
  </template>
  <script>
  import { mapActions } from 'pinia'
  import { defaultStore } from '../../stores/default'
//   import accountSelector from '../accountsComponents/accountSelector.vue'
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
        publicSettings: {
          creatingVoucherAfterSalesInvoiceCreation: false,
          defaultSalesInvoiceCustomerAccount: {},
          settlement: {
            cashDefaultCashBoxAccount: {},
            depositDefaultBankAccount: {},
            checkDefaultBankAccount: {}
          }
        },
        tab: 'overall',
        bankHeaders: [
          {
            title: this.$t('row'),
            align: 'center',
            sortable: true,
            key: 'index',
            width: '40px'
          },
          {
            title: this.$t('accountCode'),
            align: 'center',
            sortable: true,
            key: 'fCode',
            width: '90px'
          },
          {
            title: this.$t('bankName'),
            align: 'center',
            sortable: true,
            key: 'name',
            minWidth: '180px'
          },
          {
            title: this.$t('accountNumber'),
            align: 'center',
            sortable: true,
            key: 'bankAccountNumber',
            width: '200px'
          },
          {
            title: this.$t('accountOwner'),
            align: 'center',
            sortable: true,
            key: 'accountOwner',
            width: '150px'
          },
        ],
        cashBoxHeaders: [
          {
            title: this.$t('row'),
            align: 'center',
            sortable: true,
            key: 'index',
            width: '40px'
          },
          {
            title: this.$t('accountCode'),
            align: 'center',
            sortable: true,
            key: 'fCode',
            width: '90px'
          },
          {
            title: this.$t('name'),
            align: 'center',
            sortable: true,
            key: 'name',
            width: '200px'
          },
          {
            title: this.$t('category'),
            align: 'center',
            sortable: true,
            key: 'parentName',
            width: '200px'
          },
        ],
      }
    },
    async created() {
      await this.getDefaultAccounts()
    },
    methods: {
      ...mapActions(defaultStore, {
        setErrorMessage: 'setErrorMessage',
        setWarningDialog: 'setWarningDialog',
        closeWarning: 'closeWarning',
        setAddBankDialog: 'setAddBankDialog',
        setAddCashBoxDialog: 'setAddCashBoxDialog',
      }),
      handleAccountAdded() {
        this.setAddBankDialog(true);
      },
      handleCashBoxAdded() {
        this.setAddCashBoxDialog(true);
      },
      async setDefaultAccounts() {
        const settings = [
          {
            key: 'CreatingVoucherAfterSalesInvoiceCreation',
            value: this.publicSettings.creatingVoucherAfterSalesInvoiceCreation.toString(),
            module: 6
          },
          {
            key: 'EnableBarcodeReaderAsDefault', 
            value: this.publicSettings.enableBarcodeReaderAsDefault.toString(),
            module: 6
          },
          {
            key: 'BarcodeScaningFastMode',
            value: this.publicSettings.barcodeScaningFastMode.toString(), 
            module: 6
          },
          {
            key: 'SendSMSToCustomerAfterInvoiceCreation',
            value: this.publicSettings.sendSMSToCustomerAfterInvoiceCreation.toString(),
            module: 6
          }
        ];
  
        // items['default_customer_account_id'] =
        //   this.publicSettings.defaultSalesInvoiceCustomerAccount?.selectedAccount?.accountId ?? null
        // items['default_customer_detailed_account_id'] =
        //   this.publicSettings.defaultSalesInvoiceCustomerAccount?.selectedDetailedAccount
        //     ?.detailedAccountId ?? null
  
        // items['default_cash_account_id'] =
        //   this.publicSettings.settlement.cashDefaultCashBoxAccount?.selectedAccount?.accountId ?? null
        // items['default_cash_detailed_account_id'] =
        //   this.publicSettings.settlement.cashDefaultCashBoxAccount?.selectedDetailedAccount
        //     ?.detailedAccountId ?? null
  
        // items['default_deposit_bank_account_id'] =
        //   this.publicSettings.settlement.depositDefaultBankAccount?.selectedAccount?.accountId ?? null
        // items['default_deposit_bank_detailed_account_id'] =
        //   this.publicSettings.settlement.depositDefaultBankAccount?.selectedDetailedAccount
        //     ?.detailedAccountId ?? null
  
        // items['default_cheque_bank_account_id'] =
        //   this.publicSettings.settlement.checkDefaultBankAccount?.selectedAccount?.accountId ?? null
        // items['default_cheque_bank_detailed_account_id'] =
        //   this.publicSettings.settlement.checkDefaultBankAccount?.selectedDetailedAccount
        //     ?.detailedAccountId ?? null
  
        const response = await settingService.setSettings(settings);

        if (response.isSuccess) {
          this.setErrorMessage(this.$t('settingHasSetSuccessfully'), 'success');
        } else {
          this.setErrorMessage(response.message);
        }
        // if (Object.keys(items).length > 0) {
        //   settingService.setSettings(settings)
        //     .then((res) => {
        //       if (!res.isSuccess) {
        //         this.setErrorMessage(res.message)
        //       } else {
        //         this.setErrorMessage(this.$t('settingHasSetSuccessfully'), 'success')
        //       }
        //     })
        // }
      },
      async getDefaultAccounts() {

        const response = await settingService.getSetting({ settingModule: 6 });
    
        if (!response.isSuccess) {
          this.setErrorMessage(response.message);
          return;
        }

        const settings = response.value.result;

        const getSetting = (name) => {
          const setting = settings.find(x => x.key === name);
          return setting?.value === 'true';
        };

        this.publicSettings = {
          creatingVoucherAfterSalesInvoiceCreation: getSetting('CreatingVoucherAfterSalesInvoiceCreation'),
          enableBarcodeReaderAsDefault: getSetting('EnableBarcodeReaderAsDefault'),
          barcodeScaningFastMode: getSetting('BarcodeScaningFastMode'),
          sendSMSToCustomerAfterInvoiceCreation: getSetting('SendSMSToCustomerAfterInvoiceCreation')
        };


        // settingService.getSetting({ settingModule: 6 }).then((res) => {
        //   if (!res.isSuccess) {
        //     this.setErrorMessage(res.message)
        //     return
        //   }
        //   this.publicSettings.creatingVoucherAfterSalesInvoiceCreation =
        //     res.value.result.filter((x) => x.name === 'CreatingVoucherAfterSalesInvoiceCreation')[0]?.value == 'true'
        //   this.publicSettings.enableBarcodeReaderAsDefault =
        //     res.value.result.filter((x) => x.name === 'EnableBarcodeReaderAsDefault')[0]?.value == 'true'
        //   this.publicSettings.barcodeScaningFastMode =
        //     res.value.result.filter((x) => x.name === 'BarcodeScaningFastMode')[0]?.value == 'true'
        //   this.publicSettings.sendSMSToCustomerAfterInvoiceCreation =
        //     res.value.result.filter((x) => x.name === 'SendSMSToCustomerAfterInvoiceCreation')[0]?.value == 'true'


          // let defaultSalesInvoiceCustomerAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_customer_account_id'
          // )[0]?.value
          // let defaultSalesInvoiceCustomerDetailedAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_customer_detailed_account_id'
          // )[0]?.value
          // let cashDefaultCashBoxAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_cash_account_id'
          // )[0]?.value
          // let cashDefaultCashBoxDetailedAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_cash_detailed_account_id'
          // )[0]?.value
          // let depositDefaultBankAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_deposit_bank_account_id'
          // )[0]?.value
          // let depositDefaultBankDetailedAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_deposit_bank_detailed_account_id'
          // )[0]?.value
          // let checkDefaultBankAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_cheque_bank_account_id'
          // )[0]?.value
          // let checkDefaultBankDetailedAccountId = res.value.result.filter(
          //   (x) => x.name === 'default_cheque_bank_detailed_account_id'
          // )[0]?.value
  
          // accountService
          //   .advancedSearch()
          //   .then((res) => {
          //     if (res.isSuccess) {
          //       if (defaultSalesInvoiceCustomerAccountId) {
          //         let account = res.value.filter(
          //           (x) => x.accountId == defaultSalesInvoiceCustomerAccountId
          //         )[0]
          //         this.publicSettings.defaultSalesInvoiceCustomerAccount.selectedAccount = {
          //           accountId: account?.accountId,
          //           hName: account.hierarchyName,
          //           name: account.name,
          //           code: account.code
          //         }
          //         let detailedAccount = res.entities.filter(
          //           (x) => x.detailedAccountId == defaultSalesInvoiceCustomerDetailedAccountId
          //         )[0]
          //         this.publicSettings.defaultSalesInvoiceCustomerAccount.selectedDetailedAccount = {
          //           detailedAccountId: detailedAccount?.detailedAccountId,
          //           hName: detailedAccount?.hierarchyName,
          //           name: detailedAccount?.name,
          //           code: detailedAccount?.code
          //         }
          //       }
          //       if (cashDefaultCashBoxAccountId) {
          //         let cashAccount = res.entities.filter(
          //           (x) => x.accountId == cashDefaultCashBoxAccountId
          //         )[0]
          //         this.publicSettings.settlement.cashDefaultCashBoxAccount.selectedAccount = {
          //           accountId: cashAccount?.accountId,
          //           hName: cashAccount?.name,
          //           name: cashAccount?.name,
          //           code: cashAccount?.code
          //         }
          //         let cashDetailedAccount = res.entities.filter(
          //           (x) => x.detailedAccountId == cashDefaultCashBoxDetailedAccountId
          //         )[0]
          //         this.publicSettings.settlement.cashDefaultCashBoxAccount.selectedDetailedAccount = {
          //           detailedAccountId: cashDetailedAccount?.detailedAccountId,
          //           hName: cashDetailedAccount?.name,
          //           name: cashDetailedAccount?.name,
          //           code: cashDetailedAccount?.code
          //         }
          //       }
          //       if (depositDefaultBankAccountId) {
          //         let depositAccount = res.entities.filter(
          //           (x) => x.accountId == depositDefaultBankAccountId
          //         )[0]
          //         this.publicSettings.settlement.depositDefaultBankAccount.selectedAccount = {
          //           accountId: depositAccount?.accountId,
          //           hName: depositAccount?.name,
          //           name: depositAccount?.name,
          //           code: depositAccount?.code
          //         }
          //         let depositDetailedAccount = res.entities.filter(
          //           (x) => x.detailedAccountId == depositDefaultBankDetailedAccountId
          //         )[0]
          //         this.publicSettings.settlement.depositDefaultBankAccount.selectedDetailedAccount = {
          //           detailedAccountId: depositDetailedAccount?.detailedAccountId,
          //           hName: depositDetailedAccount?.name,
          //           name: depositDetailedAccount?.name,
          //           code: depositDetailedAccount?.code
          //         }
          //       }
          //       if (checkDefaultBankAccountId) {
          //         let checkAccount = res.entities.filter(
          //           (x) => x.accountId == checkDefaultBankAccountId
          //         )[0]
          //         this.publicSettings.settlement.checkDefaultBankAccount.selectedAccount = {
          //           accountId: checkAccount?.accountId,
          //           hName: checkAccount?.name,
          //           name: checkAccount?.name,
          //           code: checkAccount?.code
          //         }
          //         let checkDetailedAccount = res.entities.filter(
          //           (x) => x.detailedAccountId == checkDefaultBankDetailedAccountId
          //         )[0]
          //         this.publicSettings.settlement.checkDefaultBankAccount.selectedDetailedAccount = {
          //           detailedAccountId: checkDetailedAccount?.detailedAccountId,
          //           hName: checkDetailedAccount?.name,
          //           name: checkDetailedAccount?.name,
          //           code: checkDetailedAccount?.code
          //         }
          //       }
          //     } else this.setErrorMessage(res.message)
          //   })
        // })
      }
    }
  }
  </script>
  