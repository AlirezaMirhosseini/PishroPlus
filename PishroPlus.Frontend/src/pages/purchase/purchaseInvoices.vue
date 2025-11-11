<template>
  <v-card>
    <v-card-text>
      <data-table
        :headers="headers"
        :items="purchaseInvoice"
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
              to="/purchase/purchaseInvoice"
              prepend-icon="mdi-plus"
              variant="tonal"
              color="info"
              >{{ $t('newInvoice') }}</v-btn
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
          <v-tooltip :text="$t('invoiceSettlement')" v-if="entity.remainingAmount > 0">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi mdi-cash-register"
                variant="text"
                color="primary"
                size="x-small"
                :to="`/transfer/wizard/register/receive?issuer=0&amount=${entity.remainingAmount}&id=${entity.id}`"
              />
            </template>
          </v-tooltip>
          <v-tooltip :text="$t('editInvoice')">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi mdi-square-edit-outline"
                variant="text"
                color="info"
                size="x-small"
                :to="`/purchase/${entity.id}`"
              />
            </template>
          </v-tooltip>
          <v-tooltip :text="$t('returnFromPurchases')" v-if="entity.status === 1">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi mdi-skip-forward"
                variant="text"
                color="warning"
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
                @click="changeDraftToInvoice(entity)"
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
import DeleteIcon from '../../components/icons/Delete.vue'
import PenIcon from '../../components/icons/Pen.vue'
import ChangeToCheckIcon from '../../components/icons/ChangeToCheck.vue'
import reportOutput from '../../components/baseComponents/reportOutput.vue'

export default {
  components: {
    dataTable,
    reportOutput
  },
  data() {
    return {
      deleteIcon: markRaw(DeleteIcon),
      penIcon: markRaw(PenIcon),
      viewVoucherIcon: markRaw(ViewVoucherIcon),
      changeToCheckIcon: markRaw(ChangeToCheckIcon),
      purchaseInvoice: [],
      selectStatusFilter: null,
      fromDate: null,
      toDate: null,
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
      ],
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
    async changeDraftToInvoice(item) {
      let res = await invoiceService.changeDraftToInvoice(item.id)
      if (!res.isSuccess) {
        this.setErrorMessage(res.message)
      } else await getInvoiceList()
    },
    confirmDelete(item) {
      this.setWarningDialog(true, this.$t('deleteInvoice'), this.$t('deleteInvoiceMessage'), () =>
        this.deleteInvoice(item)
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
    async getInvoiceList() {
      invoiceService
        .getAll(
          1,
          1000,
          0,
          null,
          this.selectStatusFilter,
          this.fromDate ? new Date(this.fromDate)?.toISOString() : null,
          this.toDate ? new Date(this.toDate)?.toISOString() : null
        )
        .then((res) => {
          if (res.isSuccess) {
            this.purchaseInvoice = res.value.result
              .filter((invoice) => {
                if (this.selectStatusFilter === null) return true
                return invoice.status === this.selectStatusFilter
              })
              .map((x) => {
                return {
                  ...x,
                  customer: x.customerDetailedAccount?.name,
                  contexts: [
                    {
                      ...(x.remainingAmount > 0
                        ? {
                            label: this.$t('invoiceSettlement'),
                            icon: 'mdi mdi-cash-register',
                            onClick: () =>
                              this.$router.push(
                                `/transfer/wizard/register/pay?issuer=0&amount=${x.remainingAmount}&id=${x.id}`
                              )
                          }
                        : null)
                    },
                    {
                      label: this.$t('editInvoice'),
                      icon: 'mdi mdi-square-edit-outline',
                      onClick: () => this.$router.push(`/purchase/${x.id}`)
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
                            onClick: () => this.changeDraftToInvoice(x)
                          })
                    },
                    {
                      ...(x.status === 1
                        ? {
                            label: this.$t('returnFromPurchases'),
                            icon: 'mdi mdi-skip-forward',
                            onClick: () => this.$router.push(`/purchase/return/${x.id}`)
                          }
                        : null)
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
        })
    }
  }
}
</script>
