<!-- <template>
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
      <v-row no-gutters class="px-1">
        <v-col cols="12" md="4" class="pa-1">
          <accountSelector
            v-model="publicSettings.defaultSalesInvoiceCustomerAccount"
            :title="$t('defaultSalesInvoiceCustomerAccount')"
            :persistent="false"
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
              :persistent="false"
              :title="$t('defaultSalesInvoiceSettlementCashAccount')"
            />
          </v-col>
          <v-col cols="12" md="4" class="pa-1">
            <accountSelector
              v-model="publicSettings.settlement.depositDefaultBankAccount"
              :detailedAccountFamily="4"
              :persistent="false"
              :title="$t('defaultSalesInvoiceSettlementDepositBankAccount')"
            />
          </v-col>
         <v-col cols="12" md="4" class="pa-1">
            <accountSelector
              v-model="publicSettings.settlement.checkDefaultBankAccount"
              :detailedAccountFamily="4"
              :persistent="false"
              :title="$t('defaultSalesInvoiceSettlementCheckBankAccount')"
            />
          </v-col> -->
        <!-- </v-row>
      </fieldset>
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
</template>
<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import accountSelector from '../accountsComponents/accountSelector.vue'
import settingService from '../../../api/setting/settingService'
import accountService from '../../../api/account/accountService'
import dataTable from '../baseComponents/datatable/datatable.vue'
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
      tab: 'overall'
    }
  },
  async created() {
    await this.getDefaultAccounts()
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    setDefaultAccounts() {
      let items = {}
      items['CreatingVoucherAfterSalesInvoiceCreation'] =
        this.publicSettings.creatingVoucherAfterSalesInvoiceCreation.toString()

      items['EnableBarcodeReaderAsDefault'] =
        this.publicSettings.enableBarcodeReaderAsDefault.toString()

      items['DefaultSalesInvoiceCustomerAccountId'] =
        this.publicSettings.defaultSalesInvoiceCustomerAccount?.selectedAccount?.accountId ?? null
      items['DefaultSalesInvoiceCustomerDetailedAccountId'] =
        this.publicSettings.defaultSalesInvoiceCustomerAccount?.selectedDetailedAccount
          ?.detailedAccountId ?? null

      items['DefaultSalesInvoiceSettlementCashAccountId'] =
        this.publicSettings.settlement.cashDefaultCashBoxAccount?.selectedAccount?.accountId ?? null
      items['DefaultSalesInvoiceSettlementCashDetailedAccountId'] =
        this.publicSettings.settlement.cashDefaultCashBoxAccount?.selectedDetailedAccount
          ?.detailedAccountId ?? null

      items['DefaultSalesInvoiceSettlementDepositBankAccountId'] =
        this.publicSettings.settlement.depositDefaultBankAccount?.selectedAccount?.accountId ?? null
      items['DefaultSalesInvoiceSettlementDepositBankDetailedAccountId'] =
        this.publicSettings.settlement.depositDefaultBankAccount?.selectedDetailedAccount
          ?.detailedAccountId ?? null

      items['DefaultSalesInvoiceSettlementCheckBankAccountId'] =
        this.publicSettings.settlement.checkDefaultBankAccount?.selectedAccount?.accountId ?? null
      items['DefaultSalesInvoiceSettlementCheckBankDetailedAccountId'] =
        this.publicSettings.settlement.checkDefaultBankAccount?.selectedDetailedAccount
          ?.detailedAccountId ?? null

      if (Object.keys(items).length > 0) {
        settingService
          .setSalesSetting({
            entity: {
              items: items
            }
          })
          .then((res) => {
            if (!res.isSuccess) {
              this.setErrorMessage(res.message)
            } else {
              this.setErrorMessage(this.$t('settingHasSetSuccessfully'), 'success')
            }
          })
      }
    },
    async getDefaultAccounts() {
      settingService.getSalesSetting().then((res) => {
        if (!res.isSuccess) {
          this.setErrorMessage(res.message)
          return
        }
        this.publicSettings.creatingVoucherAfterSalesInvoiceCreation =
          res.entities.filter((x) => x.name === 'CreatingVoucherAfterSalesInvoiceCreation')[0]
            ?.value == 'true'
        this.publicSettings.enableBarcodeReaderAsDefault =
          res.entities.filter((x) => x.name === 'EnableBarcodeReaderAsDefault')[0]?.value == 'true'
        let defaultSalesInvoiceCustomerAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceCustomerAccountId'
        )[0]?.value
        let defaultSalesInvoiceCustomerDetailedAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceCustomerDetailedAccountId'
        )[0]?.value
        let cashDefaultCashBoxAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceSettlementCashAccountId'
        )[0]?.value
        let cashDefaultCashBoxDetailedAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceSettlementCashDetailedAccountId'
        )[0]?.value
        let depositDefaultBankAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceSettlementDepositBankAccountId'
        )[0]?.value
        let depositDefaultBankDetailedAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceSettlementDepositBankDetailedAccountId'
        )[0]?.value
        let checkDefaultBankAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceSettlementCheckBankAccountId'
        )[0]?.value
        let checkDefaultBankDetailedAccountId = res.entities.filter(
          (x) => x.name === 'DefaultSalesInvoiceSettlementCheckBankDetailedAccountId'
        )[0]?.value

        accountService
          .advancedSearch({
            entity: { searchType: 4 }
          })
          .then((res) => {
            if (res.isSuccess) {
              if (defaultSalesInvoiceCustomerAccountId) {
                let account = res.entities.filter(
                  (x) => x.accountId == defaultSalesInvoiceCustomerAccountId
                )[0]
                this.publicSettings.defaultSalesInvoiceCustomerAccount.selectedAccount = {
                  accountId: account?.accountId,
                  fName: account.name,
                  name: account.name,
                  code: account.code
                }
                let detailedAccount = res.entities.filter(
                  (x) => x.detailedAccountId == defaultSalesInvoiceCustomerDetailedAccountId
                )[0]
                this.publicSettings.defaultSalesInvoiceCustomerAccount.selectedDetailedAccount = {
                  detailedAccountId: detailedAccount?.detailedAccountId,
                  fName: detailedAccount?.name,
                  name: detailedAccount?.name,
                  code: detailedAccount?.code
                }
              }
              if (cashDefaultCashBoxAccountId) {
                let cashAccount = res.entities.filter(
                  (x) => x.accountId == cashDefaultCashBoxAccountId
                )[0]
                this.publicSettings.settlement.cashDefaultCashBoxAccount.selectedAccount = {
                  accountId: cashAccount?.accountId,
                  fName: cashAccount?.name,
                  name: cashAccount?.name,
                  code: cashAccount?.code
                }
                let cashDetailedAccount = res.entities.filter(
                  (x) => x.detailedAccountId == cashDefaultCashBoxDetailedAccountId
                )[0]
                this.publicSettings.settlement.cashDefaultCashBoxAccount.selectedDetailedAccount = {
                  detailedAccountId: cashDetailedAccount?.detailedAccountId,
                  fName: cashDetailedAccount?.name,
                  name: cashDetailedAccount?.name,
                  code: cashDetailedAccount?.code
                }
              }
              if (depositDefaultBankAccountId) {
                let depositAccount = res.entities.filter(
                  (x) => x.accountId == depositDefaultBankAccountId
                )[0]
                this.publicSettings.settlement.depositDefaultBankAccount.selectedAccount = {
                  accountId: depositAccount?.accountId,
                  fName: depositAccount?.name,
                  name: depositAccount?.name,
                  code: depositAccount?.code
                }
                let depositDetailedAccount = res.entities.filter(
                  (x) => x.detailedAccountId == depositDefaultBankDetailedAccountId
                )[0]
                this.publicSettings.settlement.depositDefaultBankAccount.selectedDetailedAccount = {
                  detailedAccountId: depositDetailedAccount?.detailedAccountId,
                  fName: depositDetailedAccount?.name,
                  name: depositDetailedAccount?.name,
                  code: depositDetailedAccount?.code
                }
              }
              if (checkDefaultBankAccountId) {
                let checkAccount = res.entities.filter(
                  (x) => x.accountId == checkDefaultBankAccountId
                )[0]
                this.publicSettings.settlement.checkDefaultBankAccount.selectedAccount = {
                  accountId: checkAccount?.accountId,
                  fName: checkAccount?.name,
                  name: checkAccount?.name,
                  code: checkAccount?.code
                }
                let checkDetailedAccount = res.entities.filter(
                  (x) => x.detailedAccountId == checkDefaultBankDetailedAccountId
                )[0]
                this.publicSettings.settlement.checkDefaultBankAccount.selectedDetailedAccount = {
                  detailedAccountId: checkDetailedAccount?.detailedAccountId,
                  fName: checkDetailedAccount?.name,
                  name: checkDetailedAccount?.name,
                  code: checkDetailedAccount?.code
                }
              }
            } else this.setErrorMessage(res.message)
          })
      })
    }
  }
}
</script> --> -->
