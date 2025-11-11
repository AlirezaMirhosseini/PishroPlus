<template>
  <v-card>
    <v-card-text class="px-0 px-sm-4">
      <v-row class="pishro-border pa-2" no-gutters>
        <v-col cols="12">
          <data-table
            :hasSearch="true"
            :headers="tableHeaders"
            :items="items"
            :isServerSide="true"
            :page="paginationModel.page"
            :pageSize="paginationModel.pageSize"
            :totalCount="totalCount"
            @update:page="updatePage"
            @update:pageSize="updatePageSize"
            :clickableRow="true"
            :selectableRow="true"
            :hasEnter="true"
            v-model:selectedRow="selectedRow"
            itemValue="HierarchicalCode"
            @enterMethod="selectAccount"
            :preventClientSideSearch="true"
            :searchText="searchText"
            @update:search="
              (val) => {
                searchText = val
                getReports()
              }
            "
          >
            <template v-slot:toolbar>
              <v-row class="align-center justify-space-between ps-2" no-gutters>
                <v-btn-toggle
                  v-if="type === 0"
                  divided
                  v-model="level"
                  color="primary"
                  base-color="container"
                  density="compact"
                  mandatory
                >
                  <div class="flex"></div>
                  <v-btn>{{ $t('general') }}</v-btn>
                  <v-btn>{{ $t('subsidiary') }}</v-btn>
                  <v-btn class="d-flex">
                    <div class="d-flex align-center" style="gap: 4px">
                      {{ $t('customLevel') }}
                      <v-text-field
                        v-if="type == 0 && level === 2"
                        v-model="customLevel"
                        variant="underlined"
                        class="text-center"
                      />
                    </div>
                  </v-btn>
                </v-btn-toggle>
                <v-text-field
                  v-else
                  hide-details
                  density="compact"
                  variant="outlined"
                  :label="$t('level')"
                  v-model="maskedCustomLevel"
                  v-maska:[maskOptions]
                  @maska="($event) => changeMaskedLevel($event)"
                  style="max-width: 80px"
                />
                <v-btn
                  class="ms-2"
                  @click="showFilters = !showFilters"
                  :icon="showFilters ? 'mdi mdi-menu-up' : 'mdi mdi-filter-variant'"
                  color="primary"
                  variant="tonal"
                  size="x-small"
                />
              </v-row>
            </template>
            <template v-slot:filterBox>
              <v-expand-transition>
                <fieldset v-show="showFilters" class="my-2 pishro-border">
                  <legend class="mx-auto px-2 text-grey">{{ $t('accountsFilter') }}</legend>
                  <v-row style="width: 100%">
                    <v-col cols="12" sm="6" md="2">
                      <v-checkbox
                        v-model="filters.includeZeroResultAccounts"
                        :label="$t('includeZeroResultAccounts')"
                        color="info"
                        hide-details
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-row no-gutters style="gap: 12px">
                        <v-select
                          :label="$t('orderBy')"
                          :items="[
                            ...tableHeaders?.filter(
                              (h) => !(h.key == 'index' || h.key == 'Detection(E)')
                            )
                          ]"
                          v-model="filters.orderByColumn"
                          variant="outlined"
                          density="compact"
                          item-title="title"
                          item-value="key"
                          :placeholder="$t('default')"
                          hide-details
                          chips
                          multiple
                        />
                        <v-select
                          :label="$t('sortType')"
                          :items="sortTypes"
                          v-model="filters.orderType"
                          variant="outlined"
                          density="compact"
                          hide-details
                          style="max-width: 130px"
                        />
                      </v-row>
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <date-picker
                        :label="$t('startDate')"
                        v-model="filters.startDate"
                        format="YYYY-MM-DD"
                        display-format="jD jMMMM jYYYY"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <date-picker
                        :label="$t('endDate')"
                        v-model="filters.endDate"
                        format="YYYY-MM-DD"
                        display-format="jD jMMMM jYYYY"
                      />
                    </v-col>
                    <v-col class="justify-end d-flex" cols="12" style="gap: 4px">
                      <v-btn @click="resetFilters" color="error" flat>{{ $t('clear') }}</v-btn>
                      <v-btn @click="applyFilters" color="success" flat>{{ $t('apply') }}</v-btn>
                    </v-col>
                  </v-row>
                </fieldset>
              </v-expand-transition>
            </template>
            <template v-slot:column_TotalCreditAmount="{ entity }">
              {{ entity.TotalCreditAmount?.toLocaleString() }}
            </template>
            <template v-slot:column_TotalDebtAmount="{ entity }">
              {{ entity.TotalDebtAmount?.toLocaleString() }}
            </template>
            <template v-slot:column_RemainAmount="{ entity }">
              <p :class="`text-center ${entity?.RemainAmount < 0 ? 'text-error' : ''}`">
                {{
                  entity.RemainAmount >= 0
                    ? entity.RemainAmount?.toLocaleString()
                    : `(${(-entity.RemainAmount)?.toLocaleString()})`
                }}
              </p>
            </template>
            <template v-slot:fixed_row>
              <tr class="bg-container">
                <td colspan="4" class="px-4">{{ $t('currentPageTotal') }}</td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSum?.toLocaleString() }}</td>
                <td class="text-center">{{ metaData?.TotalCreditAmountSum?.toLocaleString() }}</td>
                <td
                  :class="`text-center ${metaData?.TotalRemainAmountSum < 0 ? 'text-error' : ''}`"
                >
                  {{
                    isNaN(metaData?.TotalRemainAmountSum)
                      ? ''
                      : metaData?.TotalRemainAmountSum >= 0
                      ? metaData?.TotalRemainAmountSum?.toLocaleString()
                      : `(${(-metaData?.TotalRemainAmountSum)?.toLocaleString()})`
                  }}
                </td>
                <td class="text-center">
                  {{ getDetectionByRemaining(metaData?.TotalRemainAmountSum) }}
                </td>
              </tr>
              <tr class="bg-container">
                <td colspan="4" class="px-4">{{ $t('totalSum') }}</td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSumAll?.toLocaleString() }}</td>
                <td class="text-center">
                  {{ metaData?.TotalCreditAmountSumAll?.toLocaleString() }}
                </td>
                <td
                  :class="`text-center ${
                    metaData?.TotalRemainAmountSumAll < 0 ? 'text-error' : ''
                  }`"
                >
                  {{
                    isNaN(metaData?.TotalRemainAmountSumAll)
                      ? ''
                      : metaData?.TotalRemainAmountSumAll >= 0
                      ? metaData?.TotalRemainAmountSumAll?.toLocaleString()
                      : `(${(-metaData?.TotalRemainAmountSumAll)?.toLocaleString()})`
                  }}
                </td>
                <td class="text-center">
                  {{ getDetectionByRemaining(metaData?.TotalRemainAmountSumAll) }}
                </td>
              </tr>
            </template>
          </data-table>
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
import utils from '../../../../plugins/utils'

export default {
  name: 'AllLedgers',
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      maskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, '1'),
        postProcess: (val) => {
          if (!val) return ''
          return val
        }
      },
      tableHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          key: 'HierarchicalCode'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'HierarchicalName'
        },
        {
          title: this.$t('debtFlow'),
          align: 'center',
          sortable: true,
          key: 'TotalDebtAmount'
        },
        {
          title: this.$t('creditFlow'),
          align: 'center',
          sortable: true,
          key: 'TotalCreditAmount'
        },
        {
          title: this.$t('remaining'),
          align: 'center',
          sortable: true,
          key: 'RemainAmount'
        },
        {
          title: this.$t('distinction'),
          align: 'center',
          sortable: true,
          key: 'Detection(E)'
        }
      ],
      paginationModel: {
        page: 1,
        pageSize: 10
      },
      totalCount: 0,
      showFilters: false,
      searchText: '',
      filters: {
        startDate: null,
        endDate: null,
        includeZeroResultAccounts: true,
        orderByColumn: null,
        orderType: 'ASC'
      },
      appliedFilters: {
        startDate: null,
        endDate: null,
        includeZeroResultAccounts: true,
        orderByColumn: null,
        orderType: 'ASC'
      },
      items: [],
      metaData: null,
      level: 0,
      customLevel: this.type == 0 ? 3 : 1,
      maskedCustomLevel: '1',
      selectedRow: null
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    async getReports() {
      const params = {
        '@Type': this.type,
        '@PageNumber': this.paginationModel.page,
        '@PageSize': this.paginationModel.pageSize,
        '@IncludeZeroResultAccounts': this.appliedFilters.includeZeroResultAccounts,
        '@OrderType': this.appliedFilters.orderType
      }
      if (this.appliedFilters?.orderByColumn?.length > 0)
        params['@OrderByColumns'] = this.appliedFilters.orderByColumn?.join(',')
      if (this.appliedFilters?.startDate) params['@StartDate'] = this.appliedFilters.startDate
      if (this.appliedFilters?.endDate) params['@EndDate'] = this.appliedFilters.endDate
      if (this.searchText) params['@SearchTerm'] = this.searchText
      if (this.type === 3) {
        if (this.customLevel) params['@Level'] = this.customLevel
      }
      if (this.level)
        params['@Level'] = this.level === 2 ? this.customLevel : this.level == 1 ? 2 : 1

      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'Accounting_GetAllAccountLedgerReport',
        parameters: params
      })

      if (res.isSuccess) {
        this.items =
          res.value[0]?.map((item, idx) => ({
            ...item,
            'Detection(E)': utils.showAccountDetection(item['Detection(E)']),
            index: (this.paginationModel.page - 1) * this.paginationModel.pageSize + idx + 1
          })) || []
        this.totalCount = res.value[1][0].TotalCount
        this.metaData = res.value[1][0]
      }
    },
    updatePage(newPage) {
      this.paginationModel.page = newPage
      this.getReports()
    },
    updatePageSize(newPageSize) {
      this.paginationModel.pageSize = newPageSize
      this.getReports()
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
    async resetFilters() {
      this.filters = {
        startDate: null,
        endDate: null,
        includeZeroResultAccounts: true,
        orderByColumn: null
      }
      this.appliedFilters = {
        startDate: null,
        endDate: null,
        includeZeroResultAccounts: true,
        orderByColumn: null
      }
      await this.getReports()
    },
    async applyFilters() {
      this.appliedFilters = this.filters
      await this.getReports()
    },
    getDetectionByRemaining(remaining) {
      return utils.getDetectionByRemaining(remaining)
    },
    changeMaskedLevel(value) {
      let amount = value.detail.unmasked
      this.customLevel = amount
    }
  },
  computed: {
    sortTypes() {
      return utils.getSortTypes()
    }
  },
  async mounted() {
    await this.getReports()
  },
  watch: {
    async level(value) {
      await this.getReports()
    },
    async customLevel(value) {
      await this.getReports()
    }
  },
  components: {
    dataTable
  }
}
</script>

<style></style>
