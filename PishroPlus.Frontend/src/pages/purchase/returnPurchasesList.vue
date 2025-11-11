<template>
  <v-card>
    <v-card-text>
      <data-table
        :headers="headers"
        :items="returnedPurchaseInvoices"
        :hasSearch="true"
        :searchItems="[
          'code',
          'dateTime',
          'title',
          'customer',
          'dueDateTime',
          'totalAmount',
          'paidAmount',
          'remainingAmount'
        ]"
        :clickableRow="true"
      >
        <template v-slot:toolbar>
          <v-row class="ps-2 ga-2" no-gutters>
            <v-btn
              to="/purchase/return/selectInvoice"
              prepend-icon="mdi-plus"
              variant="tonal"
              color="info"
              >{{ $t('newReturnInvoice') }}</v-btn
            >
            <v-spacer></v-spacer>
            <date-picker
              v-model="fromDate"
              @change="getInvoiceList"
              format="YYYY-MM-DD"
              display-format="jYYYY-jMM-jDD"
              :label="$t('fromDate')"
              locale="fa,en"
            />
            <date-picker
              v-model="toDate"
              @change="getInvoiceList"
              format="YYYY-MM-DD"
              display-format="jYYYY-jMM-jDD"
              :label="$t('toDate')"
              locale="fa,en"
            />
            <v-select
              hide-details
              variant="outlined"
              density="compact"
              :loading="false"
              style="max-width: 250px"
              :items="invoiceStatusList"
              item-value="id"
              item-title="title"
              v-model="selectStatusFilter"
              @update:modelValue="getInvoiceList"
            ></v-select>
          </v-row>
        </template>
        <template v-slot:column_index="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:column_dateTime="{ entity }">
          {{ getPersianDate(entity.dateTime) }}
        </template>
        <template v-slot:column_dueDateTime="{ entity }">
          {{ getPersianDate(entity.dueDateTime) }}
        </template>
        <template v-slot:column_customer="{ entity }">
          <span v-if="entity.customerDetailedAccount">{{
            `${entity.customerDetailedAccount?.name}`
          }}</span>
        </template>
        <template v-slot:column_totalAmount="{ entity }">
          {{ entity.totalAmount?.toLocaleString() }}
        </template>
        <template v-slot:column_remainingAmount="{ entity }">
          {{ entity.remainingAmount?.toLocaleString() }}
        </template>
        <template v-slot:column_paidAmount="{ entity }">
          {{ entity.paidAmount?.toLocaleString() }}
        </template>
        <template v-slot:column_status="{ entity }">
          <v-icon
            v-if="entity.paidAmount === entity.totalAmount"
            color="primary"
            size="small"
            :title="$t('hasReceived')"
            >mdi-check</v-icon
          >
          <v-chip class="justify-center" :color="entity.status === 0 ? 'warning' : 'success'">
            {{ entity.status === 0 ? $t('draft') : $t('finalized') }}
          </v-chip>
        </template>
        <template v-slot:column_operations="{ entity }">
          <v-row class="d-none d-md-flex justify-center">
            <v-tooltip :text="$t('editInvoice')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi mdi-square-edit-outline"
                  variant="text"
                  color="info"
                  size="x-small"
                  :to="`/purchase/return/${entity.id}`"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('viewVoucher')" v-if="entity.status === 1">
              <template v-slot:activator="{ props }">
                <v-btn
                  :disabled="!entity.voucherId"
                  v-bind="props"
                  :icon="viewVoucherIcon"
                  variant="text"
                  color="primary"
                  size="x-small"
                  :to="
                    entity.voucherId ? `/accounting/registerVoucher/view/${entity.voucherId}` : '#'
                  "
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('convertDraftToInvoice')" v-if="entity.status === 0">
              <template v-slot:activator="{ props }">
                <v-btn
                  @click="confirmInvoiceDialog(entity)"
                  v-bind="props"
                  :icon="changeToCheckIcon"
                  variant="text"
                  color="success"
                  size="x-small"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('deleteInvoice')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="deleteIcon"
                  variant="text"
                  color="error"
                  size="x-small"
                  tabindex="-1"
                  @click.stop="confirmDelete(entity)"
                />
              </template>
            </v-tooltip>
          </v-row>
        </template>
      </data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import invoiceService from '../../../api/invoice/invoiceService'
import utils from '../../../plugins/utils'
import ViewVoucherIcon from '../../components/icons/ViewVoucher.vue'
import ChangeToCheckIcon from '../../components/icons/ChangeToCheck.vue'
import DeleteIcon from '../../components/icons/Delete.vue'
import reportOutput from '../../components/baseComponents/reportOutput.vue'

export default {
  components: {
    dataTable,
    reportOutput
  },
  data() {
    return {
      viewVoucherIcon: markRaw(ViewVoucherIcon),
      changeToCheckIcon: markRaw(ChangeToCheckIcon),
      deleteIcon: markRaw(DeleteIcon),
      fromDate: null,
      toDate: null,
      selectStatusFilter: null,
      returnedPurchaseInvoices: [],
      invoiceStatusList: [
        {
          id: null,
          title: this.$t('showAll')
        },
        {
          id: 0,
          title: this.$t('draft')
        },
        {
          id: 1,
          title: this.$t('finalized')
        }
      ],
      headers: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '40px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '200px'
        },
        {
          title: this.$t('provider'),
          align: 'center',
          sortable: true,
          key: 'customer',
          width: '200px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'dateTime',
          width: '60px'
        },
        {
          title: this.$t('dueDate'),
          align: 'center',
          sortable: true,
          key: 'dueDateTime',
          width: '60px'
        },
        {
          show: false,
          title: this.$t('totalAmount'),
          align: 'center',
          sortable: true,
          key: 'totalAmount',
          width: '100px'
        },
        {
          title: this.$t('paid'),
          align: 'center',
          sortable: true,
          key: 'paidAmount',
          width: '60px'
        },
        {
          title: this.$t('remainingAmount'),
          align: 'center',
          sortable: true,
          key: 'remainingAmount',
          width: '60px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'status',
          width: '40px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          key: 'operations',
          width: '140px',
          sortable: true
        }
      ]
    }
  },
  async mounted() {
    await this.getInvoiceList()
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    getPersianDate(date) {
      return utils.showDate(date)
    },
    confirmInvoiceDialog(item) {
      this.setWarningDialog(
        true,
        this.$t('confirmRefundInvoice'),
        this.$t('confirmRefundInvoiceMessage'),
        () => this.changeDraftToInvoice(item.id)
      )
    },
    confirmDelete(item) {
      this.setWarningDialog(
        true,
        this.$t('deleteRefundInvoice'),
        this.$t('deleteRefundInvoiceMessage'),
        () => this.deleteInvoice(item)
      )
    },
    async deleteInvoice(item) {
      try {
        this.setErrorMessage(this.$t('invoiceDeletedSuccessfully'), 'success')
        this.closeWarning()

        await this.getInvoiceList()
      } catch (error) {
        this.setErrorMessage(error.message || this.$t('errorDeletingInvoice'))
      }
    },
    async changeDraftToInvoice(id) {
      let res = await invoiceService.changeRefundDraftToInvoice(id, true)
      if (!res.isSuccess) {
        this.setErrorMessage(res.message || res.errors?.[0]?.message)
      } else {
        this.setErrorMessage(this.$t('invoiceSuccessfullyConfirmed'), 'success')
        this.closeWarning()
        await this.getInvoiceList()
      }
    },
    async getInvoiceList() {
      try {
        const res = await invoiceService.getAll(
          1,
          1000,
          3,
          null,
          this.selectStatusFilter,
          this.fromDate ? new Date(this.fromDate)?.toISOString() : null,
          this.toDate ? new Date(this.toDate)?.toISOString() : null
        )

        if (res.isSuccess) {
          this.returnedPurchaseInvoices = res.value.result.map((x) => {
            return {
              ...x,
              customer: x.customerDetailedAccount?.name,
              contexts: [
                {
                  label: this.$t('viewInvoice'),
                  icon: 'mdi mdi-eye',
                  onClick: () => this.$router.push(`/purchase/return/${x.id}`)
                },
                {
                  ...(x.status === 1
                    ? {
                        label: this.$t('viewVoucher'),
                        svgIcon: '#viewVoucher',
                        onClick: () =>
                          this.$router.push(`/accounting/registerVoucher/view/${x.voucherId}`)
                      }
                    : {
                        label: this.$t('convertDraftToInvoice'),
                        svgIcon: '#changeToCheck',
                        onClick: () => this.confirmInvoiceDialog(x)
                      })
                },
                {
                  label: this.$t('deleteInvoice'),
                  icon: 'mdi mdi-delete',
                  onClick: () => this.confirmDelete(x)
                }
              ]
            }
          })
        } else {
          this.setErrorMessage(res.message)
        }
      } catch (error) {
        console.error('Error fetching return purchase invoices:', error)
        this.setErrorMessage('خطا در دریافت اطلاعات از سرور')
      }
    }
  }
}
</script>
