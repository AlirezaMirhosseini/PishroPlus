<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters class="flex-column">
        <!-- <v-row class="align-center" no-gutters>
          <reportOutput></reportOutput>
        </v-row> -->
        <v-window :touch="false" v-model="tab" style="width: 100%">
          <v-window-item :value="0">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <datatable :headers="remittanceOrReceiptHeader" :items="remittanceItems">
                <template #toolbar>
                  <v-row class="ps-2 ga-2" no-gutters>
                    <v-btn
                      to="/warehouse/remittances/new"
                      prepend-icon="mdi-plus"
                      variant="tonal"
                      style="float: right"
                      color="info"
                      >{{ $t('newRemittance') }}</v-btn
                    >
                    <v-select
                      class="ms-auto"
                      hide-details
                      :label="$t('sortBy')"
                      variant="outlined"
                      density="compact"
                      style="max-width: 200px"
                      :items="sortByList"
                      item-value="id"
                      item-title="title"
                      v-model="sortByFilter"
                      @update:modelValue="() => getRemittance()"
                    ></v-select>
                    <v-select
                      hide-details
                      :label="$t('sortType')"
                      variant="outlined"
                      density="compact"
                      style="max-width: 150px"
                      :items="sortTypeList"
                      item-value="id"
                      item-title="title"
                      v-model="sortTypeFilter"
                      @update:modelValue="() => getRemittance()"
                    ></v-select>
                  </v-row>
                </template>
                <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
                <template v-slot:column_dateTime="{ entity }">{{
                  showDate(entity.dateTime)
                }}</template>
                <template v-slot:column_buyer="{ entity }">
                  {{ entity.customer?.name }}
                </template>
                <template v-slot:column_remittanceType="{ entity }">
                  {{ remittanceTypes.filter((x) => x.value === entity.type)[0]?.title }}
                </template>
                <template v-slot:column_invoice="{ entity }">
                  <v-tooltip :text="$t('invoiceCode')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="entity.invoiceCode"
                        v-bind="props"
                        variant="text"
                        color="info"
                        size="x-small"
                        :to="`/sales/${entity.invoiceId}`"
                        >{{ entity.invoiceCode }}</v-btn
                      >
                      <p v-else>--</p>
                    </template>
                  </v-tooltip>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-tooltip :text="$t('editInvoice')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi mdi-square-edit-outline"
                        variant="text"
                        color="info"
                        size="x-small"
                        :to="`/warehouse/remittances/${entity.id}`"
                      />
                    </template>
                  </v-tooltip>
                </template>
              </datatable>
            </v-col>
          </v-window-item>
          <v-window-item :value="1">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <datatable :headers="remittanceOrReceiptHeader" :items="receiptItems">
                <template #toolbar>
                  <v-row class="ps-2 ga-2" no-gutters>
                    <v-btn
                      to="/warehouse/receipts/new"
                      prepend-icon="mdi-plus"
                      variant="tonal"
                      color="info"
                      >{{ $t('newReceipt') }}</v-btn
                    >
                    <v-select
                      class="ms-auto"
                      hide-details
                      :label="$t('sortBy')"
                      variant="outlined"
                      density="compact"
                      style="max-width: 200px"
                      :items="sortByList"
                      item-value="id"
                      item-title="title"
                      v-model="sortByFilter"
                      @update:modelValue="() => getReceipt()"
                    ></v-select>
                    <v-select
                      hide-details
                      :label="$t('sortType')"
                      variant="outlined"
                      density="compact"
                      style="max-width: 150px"
                      :items="sortTypeList"
                      item-value="id"
                      item-title="title"
                      v-model="sortTypeFilter"
                      @update:modelValue="() => getReceipt()"
                    ></v-select>
                  </v-row>
                </template>
                <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
                <template v-slot:column_dateTime="{ entity }">{{
                  showDate(entity.dateTime)
                }}</template>
                <template v-slot:column_provider="{ entity }">
                  {{ entity.provider?.name }}
                </template>
                <template v-slot:column_receipType="{ entity }">
                  {{ receipTypes.filter((x) => x.value === entity.type)[0]?.title }}
                </template>
                <template v-slot:column_invoice="{ entity }">
                  <v-tooltip :text="$t('invoiceCode')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-if="entity.invoiceCode"
                        v-bind="props"
                        variant="text"
                        color="info"
                        size="x-small"
                        :to="`/purchase/${entity.invoiceId}`"
                      >
                        {{ entity.invoiceCode }}
                      </v-btn>
                      <p v-else>--</p>
                    </template>
                  </v-tooltip>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-tooltip :text="$t('editInvoice')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi mdi-square-edit-outline"
                        variant="text"
                        color="info"
                        size="x-small"
                        :to="`/warehouse/receipts/${entity.id}`"
                      />
                    </template>
                  </v-tooltip>
                </template>
              </datatable>
            </v-col>
          </v-window-item>
        </v-window>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import datatable from '../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../plugins/utils'
// import receiveIcon from '../components/icons/Receive.vue'
import receiptService from '../../../api/receipt/receiptService.js'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import reportOutput from '../../components/baseComponents/reportOutput.vue'

export default {
  data() {
    return {
      tab: 0,
      remittanceOrReceiptHeader: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '20px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '70px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '20px'
        },
        {
          title: this.$t('warehouse'),
          align: 'center',
          sortable: true,
          key: 'warehouseTitle',
          width: '70px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'dateTime',
          width: '50px'
        },
        {
          show: false,
          title: this.$t('buyer'),
          align: 'center',
          sortable: true,
          key: 'buyer',
          width: '80px'
        },
        {
          show: false,
          title: this.$t('provider'),
          align: 'center',
          sortable: true,
          key: 'provider',
          width: '80px'
        },
        {
          show: false,
          title: this.$t('remittanceType'),
          align: 'center',
          sortable: true,
          key: 'remittanceType',
          width: '80px'
        },
        {
          show: false,
          title: this.$t('receipType'),
          align: 'center',
          sortable: true,
          key: 'receipType',
          width: '80px'
        },
        {
          title: this.$t('invoice'),
          align: 'center',
          sortable: true,
          key: 'invoice',
          width: '50px'
        },

        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '20px'
        }
      ],
      remittanceTypes: [
        {
          value: 51,
          title: this.$t('sale')
        },
        {
          value: 52,
          title: this.$t('exitPurchaseReturn')
        },
        {
          value: 53,
          title: this.$t('exitConsumption')
        },
        {
          value: 54,
          title: this.$t('exitTreansfer')
        },
        {
          value: 55,
          title: this.$t('exitWastage')
        },
        {
          value: 99,
          title: this.$t('exitOther')
        }
      ],
      receipTypes: [
        {
          value: 0,
          title: this.$t('entryInitialProductstock')
        },
        {
          value: 1,
          title: this.$t('entryPurchase')
        },
        {
          value: 2,
          title: this.$t('entrySalesReturn')
        },
        {
          value: 3,
          title: this.$t('entryProduction')
        },
        {
          value: 4,
          title: this.$t('entryTransfer')
        },
        {
          value: 50,
          title: this.$t('entryOther')
        }
      ],
      remittanceItems: [],
      receiptItems: [],
      sortByFilter: true,
      sortTypeFilter: true
    }
  },
  computed: {
    sortByList() {
      return [
        {
          id: false,
          title: this.$t('createTime')
        },
        {
          id: true,
          title: this.$t('lastEditTime')
        }
      ]
    },
    sortTypeList() {
      return [
        {
          id: true,
          title: this.$t('descending')
        },
        {
          id: false,
          title: this.$t('ascending')
        }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    showDate(date) {
      return utils.showDate(date)
    },
    setTabFromRoute(route) {
      switch (route) {
        case 'remittance':
          return 0
        case 'receipt':
          return 1
        default:
          return 0
      }
    },
    async getRemittance() {
      await receiptService
        .getAll(1, 1000, 1, this.sortByFilter, this.sortTypeFilter)
        .then((res) => {
          if (res.isSuccess) {
            this.remittanceItems = res.value.result
          } else this.setErrorMessage(res.message)
        })
    },
    async getReceipt() {
      await receiptService
        .getAll(1, 1000, 0, this.sortByFilter, this.sortTypeFilter)
        .then((res) => {
          if (res.isSuccess) {
            this.receiptItems = res.value.result
          } else this.setErrorMessage(res.message)
        })
    }
  },
  async mounted() {
    if (this.currentActiveTab.path === '/warehouse/remittance-and-receipt/remittances') {
      await this.getRemittance()
      this.remittanceOrReceiptHeader[3].show = true
      this.remittanceOrReceiptHeader[5].show = true
      this.tab = 0
    }
    if (this.currentActiveTab.path === '/warehouse/remittance-and-receipt/receipts') {
      await this.getReceipt()
      this.remittanceOrReceiptHeader[4].show = true
      this.remittanceOrReceiptHeader[6].show = true
      this.tab = 1
    }
  },

  components: {
    datatable,
    reportOutput
  }
}
</script>

<style></style>
