<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters class="flex-column">
        <!-- <v-row class="align-center" no-gutters>
          <report-output />
        </v-row> -->
        <v-window :touch="false" v-model="tab" style="width: 100%">
          <v-window-item :value="0">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :hasSearch="true"
                :searchItems="[
                  'date',
                  'persianDate',
                  'payerName',
                  'firstPayerDetailedName',
                  'totalAmount',
                  'documentCount',
                  'desc'
                ]"
                :headers="receiveHeaders"
                :items="receiveItems"
              >
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      to="/transfer/wizard/register/receive"
                      :prepend-icon="addReceiveIcon"
                      variant="tonal"
                      color="info"
                      >{{ $t('addReceive') }}</v-btn
                    >
                  </v-row>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ receiveItems.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_date="{ entity }">
                  {{ getPersianDate(entity.date) }}</template
                >
                <template v-slot:column_totalAmount="{ entity }">
                  {{ entity.totalAmount.toLocaleString() }}
                </template>
              </data-table>
            </v-col>
          </v-window-item>
          <v-window-item :value="1">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :hasSearch="true"
                :searchItems="[
                  'date',
                  'persianDate',
                  'receiverName',
                  'firstReceiverDetailedName',
                  'totalAmount',
                  'documentCount',
                  'desc'
                ]"
                :headers="payHeaders"
                :items="payItems"
              >
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      to="/transfer/wizard/register/pay"
                      :prepend-icon="addReceiveIcon"
                      variant="tonal"
                      color="info"
                      >{{ $t('addPay') }}</v-btn
                    >
                  </v-row>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ payItems.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_date="{ entity }">
                  {{ getPersianDate(entity.date) }}</template
                >
                <template v-slot:column_totalAmount="{ entity }">
                  {{ entity.totalAmount.toLocaleString() }}
                </template>
              </data-table>
            </v-col>
          </v-window-item>
        </v-window>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import transferService from '../../../../api/transfer/transferService'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import receiveIcon from '../../../components/icons/Receive.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../../plugins/utils'
import addReceiveIcon from '../../../components/icons/CheckBook.vue'
import mixin from '../../../../plugins/mixins/default-mixin'


export default {
  mixins: [mixin],
  data() {
    return {
      tab: 0,
      receiveItems: [],
      payItems: [],
      receiveIcon: markRaw(receiveIcon),
      addReceiveIcon: markRaw(addReceiveIcon),
      receiveHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('voucherDate'),
          align: 'center',
          sortable: true,
          key: 'date',
          width: '90px'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'payerDetailedAccount',
          width: '160px'
        },
        {
          title: this.$t('totalAmount'),
          align: 'center',
          sortable: true,
          key: 'totalAmount',
          width: '100px'
        },
        {
          title: this.$t('documentCount'),
          align: 'center',
          sortable: true,
          key: 'documentsCount',
          width: '100px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '220px',
          class: 'flex-grow-1'
        }
        // {
        //   title: '',
        //   align: 'center',
        //   sortable: true,
        //   key: 'operations',
        //   width: '50px',
        //   fixed: true
        // }
      ],
      payHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('voucherDate'),
          align: 'center',
          sortable: true,
          key: 'date',
          width: '90px'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'receiverDetailedAccount',
          width: '160px'
        },
        {
          title: this.$t('totalAmount'),
          align: 'center',
          sortable: true,
          key: 'totalAmount',
          width: '100px'
        },
        {
          title: this.$t('documentCount'),
          align: 'center',
          sortable: true,
          key: 'documentsCount',
          width: '100px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '220px',
          class: 'flex-grow-1'
        }
        // {
        //   title: '',
        //   align: 'center',
        //   sortable: true,
        //   key: 'operations',
        //   width: '50px',
        //   fixed: true
        // }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    getPersianDate(date) {
      return utils.showDate(date)
    },
    async setTab(value) {
      await this.getAll(value)
    },
    setTabFromRoute(route) {
      switch (route) {
        case 'receiveList':
          return 0
        case 'payList':
          return 1
        default:
          return 0
      }
    },
    async getAll(type) {
      return await transferService.getAll(type).then((res) => {
        if (res.isSuccess) {
          if (type == 0) {
            this.receiveItems = res.entities
              .map((a) => ({
                ...a,
                payerName: a.payerAccount?.name,
                firstPayerDetailedName: a.firstPayerDetailed?.name,
                persianDate: this.getPersianDate(a.date)
              }))
              .reverse()
          } else {
            this.payItems = res.entities
              .map((a) => ({
                ...a,
                receiverName: a.receiverAccount?.name,
                firstReceiverDetailedName: a.firstReceiverDetailed?.name,
                persianDate: this.getPersianDate(a.date)
              }))
              .reverse()
          }
        } else this.setErrorMessage(res.meessage)
      })
    }
  },
  async mounted() {
    this.tab = this.setTabFromRoute(this.currentActiveTab.params.type)
    this.setTab(this.tab)
  },
  components: {
    reportOutput,
    dataTable
  }
}
</script>

<style></style>
