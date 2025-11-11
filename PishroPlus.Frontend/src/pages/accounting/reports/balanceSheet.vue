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
                <v-btn
                  class="ms-auto"
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
                          :items="[...tableHeaders]"
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
            <template v-slot:column_DebtRemainAmount="{ entity }">
              {{ entity.DebtRemainAmount?.toLocaleString() }}
            </template>
            <template v-slot:column_CreditRemainAmount="{ entity }">
              {{ entity.CreditRemainAmount?.toLocaleString() }}
            </template>
            <template v-slot:fixed_row>
              <tr class="bg-container">
                <td colspan="4" class="px-4">{{ $t('currentPageTotal') }}</td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSum?.toLocaleString() }}</td>
                <td class="text-center">{{ metaData?.TotalCreditAmountSum?.toLocaleString() }}</td>
                <td class="text-center">
                  {{ metaData?.TotalDebtRemainAmountSum?.toLocaleString() }}
                </td>
                <td class="text-center">
                  {{ metaData?.TotalCreditRemainAmountSum?.toLocaleString() }}
                </td>
              </tr>
              <tr class="bg-container">
                <td colspan="4" class="px-4">{{ $t('totalSum') }}</td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSumAll?.toLocaleString() }}</td>
                <td class="text-center">
                  {{ metaData?.TotalCreditAmountSumAll?.toLocaleString() }}
                </td>
                <td class="text-center">
                  {{ metaData?.TotalDebtRemainAmountSumAll?.toLocaleString() }}
                </td>
                <td class="text-center">
                  {{ metaData?.TotalCreditRemainAmountSumAll?.toLocaleString() }}
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
          title: this.$t('remainingDebt'),
          align: 'center',
          sortable: true,
          key: 'TotalDebtRemainAmount'
        },
        {
          title: this.$t('remainingCredit'),
          align: 'center',
          sortable: true,
          key: 'TotalCreditRemainAmount'
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
      selectedRow: null
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    async getReports() {
      const params = {
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

      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'Accounting_GetBalanceSheetReport',
        parameters: params
      })

      if (res.isSuccess) {
        this.items =
          res.value[0]?.map((item, idx) => ({
            ...item,
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
        let basePath = '/accounting/allAccountLedgerReport'
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
  components: {
    dataTable
  }
}
</script>

<style></style>
