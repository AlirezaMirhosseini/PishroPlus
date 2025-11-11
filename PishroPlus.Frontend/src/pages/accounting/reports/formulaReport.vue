<template>
  <v-card>
    <v-card-text class="px-0 px-sm-4">
      <v-row class="pishro-border pa-2 pa-sm-4 d-flex flex-column" no-gutters style="gap: 16px">
        <v-col cols="12">
          <v-row class="align-center" no-gutters style="gap: 8px">
            <p>{{ $t('dateRange') }} :</p>
            <template v-if="isCustomDateRange">
              <date-picker
                :label="$t('startDate')"
                v-model="filters.startDate"
                format="YYYY-MM-DD"
                display-format="jD jMMMM jYYYY"
              />
              <date-picker
                :label="$t('endDate')"
                v-model="filters.endDate"
                format="YYYY-MM-DD"
                display-format="jD jMMMM jYYYY"
              />
            </template>
            <template v-else>
              <p>{{ $t('from') }}</p>
              <v-btn-toggle
                divided
                v-model="customDateRange"
                color="primary"
                base-color="container"
                density="compact"
                mandatory
                style="overflow: auto"
              >
                <v-btn>{{ $t('yesterday') }}</v-btn>
                <v-btn>{{ $t('lastWeek') }}</v-btn>
                <v-btn>{{ $t('lastMonth') }}</v-btn>
                <v-btn>{{ $t('lastSeason') }}</v-btn>
                <v-btn>{{ $t('lastYear') }}</v-btn>
              </v-btn-toggle>
              <p>{{ $t('until') + ' ' + $t('today') }}</p>
            </template>
            <!-- <v-btn
              @click="() => (isCustomDateRange = !isCustomDateRange)"
              class="ms-auto"
              flat
              color="primary"
              >{{ isCustomDateRange ? $t('default') : $t('customRange') }}</v-btn
            > -->
          </v-row>
        </v-col>
        <v-divider />
        <v-col cols="12">
          <v-row class="align-center" no-gutters style="gap: 8px">
            <v-checkbox
              hide-details
              density="comfortable"
              v-model="isGrouped"
              :label="$t('grouping')"
            />
            <template v-if="isGrouped">
              <p class="mx-4">-</p>
              <p>{{ $t('type') }} :</p>
              <v-btn-toggle
                divided
                v-model="intervalType"
                color="primary"
                base-color="container"
                density="compact"
                mandatory
                style="overflow: auto"
              >
                <v-btn>{{ $t('daily') }}</v-btn>
                <v-btn>{{ $t('weekly') }}</v-btn>
                <v-btn>{{ $t('monthly') }}</v-btn>
                <v-btn>{{ $t('seasonal') }}</v-btn>
                <v-btn>{{ $t('annual') }}</v-btn>
                <v-btn class="d-flex">
                  <div class="d-flex align-center" style="gap: 4px">
                    {{ $t('customInterval') }}
                    <v-text-field
                      v-if="intervalType === 5"
                      v-model="customInterval"
                      variant="underlined"
                      :suffix="$t('day')"
                      class="text-center day-suffix"
                      style="min-width: 40px"
                    />

                    <v-btn
                      v-if="intervalType === 5 && customInterval"
                      @click="setCustomInterval"
                      type="submit"
                      color="success"
                      variant="text"
                      icon="mdi-check-circle"
                    >
                      <v-icon color="success" icon="mdi-check-circle" size="large"></v-icon>
                    </v-btn>
                  </div>
                </v-btn>
              </v-btn-toggle>
            </template>
            <v-btn
              v-if="periodModel?.length > 0"
              @click="() => (periodModel = [])"
              class="ms-auto"
              flat
              color="primary"
              >{{ $t('closeAll') }}</v-btn
            >
          </v-row>
        </v-col>
        <v-col cols="12">
          <v-row class="ms-4 me-8">
            <v-col class="pa-6 text-center" cols="1">{{ $t('row') }}</v-col>
            <v-col class="pa-6 text-center" :cols="intervalType == '0' ? 3 : 2">{{
              $t('title')
            }}</v-col>
            <v-col v-if="intervalType != '0'" class="pa-6 text-center" cols="2">{{
              $t('fromDate')
            }}</v-col>
            <v-col v-if="intervalType != '0'" class="pa-6 text-center" cols="2">{{
              $t('untilDate')
            }}</v-col>
            <v-col class="pa-6 text-center" :cols="intervalType == '0' ? 3 : 2">{{
              $t('creditFlow')
            }}</v-col>
            <v-col class="pa-6 text-center" :cols="intervalType == '0' ? 3 : 2">{{
              $t('debtFlow')
            }}</v-col>
            <v-col class="pa-6 text-center" :cols="intervalType == '0' ? 2 : 1">{{
              $t('remaining')
            }}</v-col>
          </v-row>
          <v-expansion-panels
            elevation="0"
            color="container"
            v-model="periodModel"
            multiple
            style="border: 1px solid #e0e0e0; border-radius: 4px"
          >
            <v-expansion-panel v-for="item in items" :key="item.PeriodID" :value="item.PeriodID">
              <v-expansion-panel-title>
                <v-row>
                  <v-col class="text-center" cols="1">{{ item.index }}</v-col>
                  <v-col class="text-center" :cols="intervalType == '0' ? 3 : 2">{{
                    item.PeriodLabel
                  }}</v-col>
                  <v-col v-if="intervalType != '0'" class="text-center" cols="2">{{
                    showDate(item.FormattedStartDate)
                  }}</v-col>
                  <v-col v-if="intervalType != '0'" class="text-center" cols="2">{{
                    showDate(item.FormattedEndDate)
                  }}</v-col>
                  <v-col class="text-center" :cols="intervalType == '0' ? 3 : 2">{{
                    item.TotalCreditAmount?.toLocaleString()
                  }}</v-col>
                  <v-col class="text-center" :cols="intervalType == '0' ? 3 : 2">{{
                    item.TotalDebtAmount?.toLocaleString()
                  }}</v-col>
                  <v-col
                    :class="`text-center ${item.FormulaResult < 0 ? 'text-error' : ''}`"
                    :cols="intervalType == '0' ? 2 : 1"
                    >{{
                      item.FormulaResult >= 0
                        ? item.FormulaResult?.toLocaleString()
                        : `(${(-item.FormulaResult)?.toLocaleString()})`
                    }}</v-col
                  >
                </v-row>
              </v-expansion-panel-title>
              <v-expansion-panel-text>
                <data-table
                  :hasSearch="true"
                  :headers="tableHeaders"
                  :searchItems="['HierarchicalCode', 'HierarchicalName', 'RemainAmount']"
                  :items="item.reports"
                  :clickableRow="true"
                  :selectableRow="true"
                  :hasEnter="true"
                  v-model:selectedRow="selectedRow"
                  itemValue="HierarchicalCode"
                  @enterMethod="selectAccount"
                >
                  <template v-slot:column_RemainAmount="{ entity }">
                    <p :class="`text-center ${entity.RemainAmount < 0 ? 'text-error' : ''}`">
                      {{
                        entity.RemainAmount >= 0
                          ? entity.RemainAmount?.toLocaleString()
                          : `(${(-entity.RemainAmount)?.toLocaleString()})`
                      }}
                    </p>
                  </template>
                  <template v-slot:fixed_row>
                    <tr class="bg-container">
                      <td colspan="4" class="px-4">{{ $t('totalSum') }}</td>
                      <td class="text-center">
                        {{
                          isNaN(item?.TotalCreditAmount)
                            ? ''
                            : item?.TotalCreditAmount?.toLocaleString()
                        }}
                      </td>
                      <td class="text-center">
                        {{
                          isNaN(item?.TotalDebtAmount)
                            ? ''
                            : item?.TotalDebtAmount?.toLocaleString()
                        }}
                      </td>
                      <td class="text-center">{{ item.TotalRemainingCredit?.toLocaleString() }}</td>
                      <td class="text-center">{{ item.TotalRemainingDebt?.toLocaleString() }}</td>
                      <td :class="`text-center ${item?.FormulaResult < 0 ? 'text-error' : ''}`">
                        {{
                          isNaN(item?.FormulaResult)
                            ? ''
                            : item?.FormulaResult >= 0
                            ? item?.FormulaResult?.toLocaleString()
                            : `(${(-item?.FormulaResult)?.toLocaleString()})`
                        }}
                      </td>
                    </tr>
                  </template>
                </data-table>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import ReportService from '../../../../api/reports/reportService'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import moment from 'moment-jalaali'
import utils from '../../../../plugins/utils'

export default {
  data() {
    return {
      tableHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'HierarchicalName'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          key: 'HierarchicalCode'
        },
        {
          title: this.$t('creditFlow'),
          align: 'center',
          sortable: true,
          key: 'CreditAmount'
        },
        {
          title: this.$t('debtFlow'),
          align: 'center',
          sortable: true,
          key: 'DebtAmount'
        },
        {
          title: this.$t('remainingCredit'),
          align: 'center',
          sortable: true,
          key: 'CreditRemainingAmount'
        },
        {
          title: this.$t('remainingDebt'),
          align: 'center',
          sortable: true,
          key: 'DebtRemainingAmount'
        },
        {
          title: this.$t('remaining'),
          align: 'center',
          sortable: true,
          key: 'RemainAmount'
        }
      ],
      filters: {
        startDate: moment().subtract(1, 'jYear').add(1, 'day').format('YYYY-MM-DD'),
        endDate: moment().format('YYYY-MM-DD'),
        IntervalDays: 30,
        FilterBy: 'Month'
      },
      items: [],
      selectedRow: null,
      intervalType: 2,
      customInterval: null,
      oneDayAgo: moment().subtract(1, 'day').add(1, 'day').format('YYYY-MM-DD'),
      oneWeekAgo: moment().subtract(7, 'day').add(1, 'day').format('YYYY-MM-DD'),
      oneMonthAgo: moment().subtract(1, 'jMonth').add(1, 'day').format('YYYY-MM-DD'),
      oneSeasonAgo: moment().subtract(3, 'jMonth').add(1, 'day').format('YYYY-MM-DD'),
      oneYearAgo: moment().subtract(1, 'jYear').add(1, 'day').format('YYYY-MM-DD'),
      today: moment().format('YYYY-MM-DD'),
      periodModel: null,
      isCustomDateRange: true,
      isGrouped: false,
      customDateRange: 4
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    showDate(date) {
      return utils.showDate(date)
    },
    async getReports() {
      let params = {
        '@FormulaID': this.currentActiveTab.params.id,
        '@StartDate': this.filters.startDate,
        '@EndDate': this.filters.endDate,
        '@FilterBy': this.isGrouped ? this.filters.FilterBy : 'None'
      }
      if (this.filters.FilterBy == 'Day') params['@IntervalDays'] = this.filters.IntervalDays
      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'CalculateAndGetFormulaDetails',
        parameters: params
      })

      if (res.isSuccess) {
        if (!this.isGrouped) this.periodModel = [res.value[1][0]?.PeriodID]
        this.items =
          res.value[1]?.map((item, idx) => {
            let TotalCreditRemaining = 0
            let TotalDebtRemaining = 0
            return {
              ...item,
              reports: JSON.parse(item.AccountDetailsJSON)?.map((i, idx) => {
                let creditRemaining = 0
                let debtRemaining = 0
                if (i.CreditAmount > i.DebtAmount) {
                  creditRemaining = i.CreditAmount - i.DebtAmount
                  TotalCreditRemaining += creditRemaining
                } else {
                  debtRemaining = i.DebtAmount - i.CreditAmount
                  TotalDebtRemaining += debtRemaining
                }
                return {
                  ...i,
                  index: idx + 1,
                  HierarchicalCode: i.Code,
                  HierarchicalName: i.Name,
                  CreditRemainingAmount: creditRemaining,
                  DebtRemainingAmount: debtRemaining
                }
              }),
              index: idx + 1,
              TotalRemainingCredit: TotalCreditRemaining,
              TotalRemainingDebt: TotalDebtRemaining
            }
          }) || []
      }
    },
    async getByPeriodId(periodId) {
      const params = {
        '@PeriodID': periodId
      }
      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'GetFormulaCalculationDetails',
        parameters: params
      })

      if (res.isSuccess) {
        let selected = this.items.find((i) => i.PeriodID == periodId)
        selected.reports =
          res.value.result?.map((item, idx) => ({
            ...item,
            index: idx + 1
          })) || []
        selected.metaData = res.value.metaData[0]
      }
    },
    selectAccount() {
      if (this.selectedRow?.HierarchicalCode) {
        const item = this.selectedRow
        let basePath =
          this.type == 3
            ? '/accounting/allDetailedAccountLedgerReport'
            : '/accounting/allAccountLedgerReport'
        this.$router.push(
          `${basePath}/single?HierarchicalCode=${item.HierarchicalCode}?HierarchicalName=${item.HierarchicalName}`
        )
      }
    },
    setCustomInterval() {
      if (this.customInterval) {
        this.filters = {
          ...this.filters,
          IntervalDays: this.customInterval,
          FilterBy: 'Day'
        }
      }
    }
  },
  async mounted() {
    await this.getReports()
  },
  watch: {
    // periodModel(val) {
    //   const selected = this.items.filter((i) => val.includes(i.PeriodID))
    //   selected.forEach((element) => {
    //     if (!element?.reports) this.getByPeriodId(element.PeriodID)
    //   })
    // },
    filters: {
      handler(val) {
        this.getReports()
      },
      deep: true
    },
    isGrouped(value) {
      this.getReports()
    },
    customDateRange(value) {
      switch (value) {
        case 0:
          this.filters = {
            ...this.filters,
            startDate: this.oneDayAgo,
            endDate: this.today
          }
          break
        case 1:
          this.filters = {
            ...this.filters,
            startDate: this.oneWeekAgo,
            endDate: this.today
          }
          break
        case 2:
          this.filters = {
            ...this.filters,
            startDate: this.oneMonthAgo,
            endDate: this.today
          }
          break
        case 3:
          this.filters = {
            ...this.filters,
            startDate: this.oneSeasonAgo,
            endDate: this.today
          }
          break
        case 4:
          this.filters = {
            ...this.filters,
            startDate: this.oneYearAgo,
            endDate: this.today
          }
          break

        default:
          break
      }
    },
    intervalType(value) {
      switch (value) {
        case 0:
          this.filters = {
            ...this.filters,
            IntervalDays: 1,
            FilterBy: 'Day'
          }
          break
        case 1:
          this.filters = {
            ...this.filters,
            FilterBy: 'Week'
          }
          break
        case 2:
          this.filters = {
            ...this.filters,
            FilterBy: 'Month'
          }
          break
        case 3:
          this.filters = {
            ...this.filters,
            FilterBy: 'Season'
          }
          break
        case 4:
          this.filters = {
            ...this.filters,
            FilterBy: 'Year'
          }
          break

        default:
          break
      }
    }
  },
  components: {
    dataTable
  }
}
</script>

<style>
.day-suffix .v-text-field__suffix__text {
  color: white !important;
}
</style>
