<template>
  <v-card>
    <v-card-text>
      <v-row>
        <!-- <v-col cols="12">
          <report-output />
        </v-col> -->
        <v-col cols="12">
          <data-table
            :hasSearch="true"
            :searchItems="['accountName', 'desc', 'accountCode', 'date', 'index']"
            :headers="tableHeaders"
            :items="showingItems"
          >
            <template v-slot:toolbar>
              <v-btn
                class="ms-2"
                @click="showFilters = !showFilters"
                :icon="showFilters ? 'mdi mdi-menu-up' : 'mdi mdi-filter-variant'"
                color="primary"
                variant="tonal"
                size="x-small"
              />
            </template>
            <template v-slot:filterBox>
              <v-expand-transition>
                <fieldset v-show="showFilters" class="my-2 pishro-border">
                  <legend class="mx-auto px-2 text-grey">{{ $t('accountsFilter') }}</legend>
                  <v-row no-gutters style="gap: 16px">
                    <date-picker
                      value="voucherDateRange"
                      @change="changeVoucherRange($event)"
                      range
                      auto-submit
                      format="YYYY-MM-DD"
                      display-format="jMMMM jD"
                      :label="$t('dateRange')"
                    />
                    <v-col cols="12">
                      <v-row class="align-center" no-gutters style="gap: 8px">
                        <p>{{ $t('from') }}</p>
                        <v-text-field
                          :label="$t('voucherNumber')"
                          v-model="fromVouchercode"
                          hide-details
                          density="compact"
                          variant="outlined"
                          style="max-width: 130px"
                        />
                        <p>{{ $t('to') }}</p>
                        <v-text-field
                          :label="$t('voucherNumber')"
                          v-model="toVouchercode"
                          hide-details
                          density="compact"
                          variant="outlined"
                          style="max-width: 130px"
                        />
                        <v-btn @click="getAllData" color="info" variant="flat">{{
                          $t('apply')
                        }}</v-btn>
                      </v-row>
                    </v-col>
                  </v-row>
                </fieldset>
              </v-expand-transition>
            </template>
            <template v-slot:column_checkBox="{ entity }">
              <v-checkbox
                v-model="items.filter((a) => a.id == entity.id)[0].checkBox"
                hide-details
                density="compact"
                style="margin: -10px"
              />
            </template>
            <template v-slot:column_accountName="{ entity }">
              <v-tooltip location="top" :text="$t('generalAccount') + ': ' + entity.generalAccount">
                <template v-slot:activator="{ props }">
                  <p class="w-100" v-bind="props">{{ entity.accountName }}</p>
                </template>
              </v-tooltip>
            </template>
          </data-table>
        </v-col>
      </v-row></v-card-text
    >
  </v-card>
</template>

<script>
import accountReportService from '../../../../api/accountReport/accountReportService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../../plugins/utils'

export default {
  data() {
    return {
      items: [],
      searchText: null,
      showFilters: false,
      voucherDateRange: null,
      voucherFromDate: null,
      voucherToDate: null,
      fromVouchercode: null,
      toVouchercode: null,
      tableHeaders: [
        {
          title: '',
          align: 'center',
          key: 'checkBox',
          width: '30px',
          notShowInSetting: true
        },
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '50px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'date'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'accountName'
        },
        {
          title: this.$t('tafzil'),
          align: 'center',
          sortable: true,
          key: 'detailed'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc'
        },
        {
          title: this.$t('debtMoney'),
          align: 'center',
          sortable: true,
          key: 'debtAmount',
          width: '150px'
        },
        {
          title: this.$t('creditMoney'),
          align: 'center',
          sortable: true,
          key: 'creditAmount',
          width: '150px'
        }
      ]
    }
  },
  computed: {
    showingItems() {
      return this.items?.map((z, ind) => ({
        id: z.id,
        index: ind + 1,
        checkBox: z.checkBox,
        accountName: z.account?.name,
        accountCode: z.account?.code,
        accountId: z.account?.id,
        debtAmount: z.debtAmount.toLocaleString(),
        creditAmount: z.creditAmount.toLocaleString(),
        date: utils.showDate(z.date),
        desc: z.desc,
        detailed: z.firstDetailedAccount?.code || '-',
        generalAccount: z.generalTypeAccount?.name
      }))
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    changeVoucherRange(value) {
      this.voucherDateRange = value
      this.voucherFromDate = value[0]
      this.voucherToDate = value[1]
      this.getAllData()
    },
    showDate(date) {
      return utils.showDate(date)
    },
    async getAllData() {
      await accountReportService
        .getJournal({
          entity: {
            descendingOrder: false,
            fromDate: null,
            fromVoucherCode: this.fromVouchercode,
            orderByProperty: null,
            toDate: null,
            toVoucherCode: this.toVouchercode,
            voucherFromDate: this.voucherFromDate,
            voucherToDate: this.voucherToDate
          }
        })
        .then((res) => {
          if (res.isSuccess) {
            this.items = res.entities
          } else this.setErrorMessage(res.message)
        })
    }
  },
  async mounted() {
    await this.getAllData()
  },
  components: {
    reportOutput,
    dataTable
  }
}
</script>

<style></style>
