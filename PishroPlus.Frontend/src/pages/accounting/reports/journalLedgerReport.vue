<template>
  <v-card>
    <v-card-text class="px-0 px-sm-4">
      <v-row class="pishro-border pa-2" no-gutters>
        <v-col cols="12">
          <data-table
            :hasSearch="true"
            :headers="
              tableHeaders.filter(
                (column) => !['AccountCode', 'DetailedAccountCode'].includes(column.key)
              )
            "
            :items="items"
            :isServerSide="true"
            :page="paginationModel.page"
            :pageSize="paginationModel.pageSize"
            :totalCount="totalCount"
            @update:page="updatePage"
            @update:pageSize="updatePageSize"
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
              <v-row class="justify-end" no-gutters>
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
                    <v-col cols="12" sm="6">
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
              <p style="direction: ltr">
                {{ entity.RemainAmount?.toLocaleString() }}
              </p>
            </template>
            <template v-slot:fixed_row>
              <tr class="bg-container">
                <td colspan="5" class="px-4">
                  <b style="font-size: 12pt">{{ $t('currentPageTotal') }}</b>
                </td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSum?.toLocaleString() }}</td>
                <td class="text-center">{{ metaData?.TotalCreditAmountSum?.toLocaleString() }}</td>
              </tr>
              <tr class="bg-container">
                <td colspan="5" class="px-4">
                  <b style="font-size: 12pt">{{ $t('totalSum') }}</b>
                </td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSumAll?.toLocaleString() }}</td>
                <td class="text-center">
                  {{ metaData?.TotalCreditAmountSumAll?.toLocaleString() }}
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
          key: 'index',
          width: '50px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'Code',
          width: '50px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'Date',
          width: '80px'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'AccountName',
          width: '200px'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          key: 'AccountCode',
          width: '200px'
        },
        {
          title: this.$t('detailed'),
          align: 'center',
          sortable: true,
          key: 'DetailedAccountName',
          width: '200px'
        },
        {
          title: this.$t('detailedCode'),
          align: 'center',
          sortable: true,
          key: 'DetailedAccountCode',
          width: '200px'
        },
        {
          title: this.$t('debtor'),
          align: 'center',
          sortable: true,
          key: 'DebtAmount',
          width: '120px'
        },
        {
          title: this.$t('creditor'),
          align: 'center',
          sortable: true,
          key: 'CreditAmount',
          width: '120px'
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
        orderByColumn: null,
        orderType: 'ASC'
      },
      appliedFilters: {
        startDate: null,
        endDate: null,
        orderByColumn: null,
        orderType: 'ASC'
      },
      items: [],
      metaData: null
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
        '@OrderType': this.appliedFilters.orderType
      }
      if (this.appliedFilters?.orderByColumn?.length > 0)
        params['@OrderByColumns'] = this.appliedFilters.orderByColumn?.join(',')
      if (this.appliedFilters?.startDate) params['@StartDate'] = this.appliedFilters.startDate
      if (this.appliedFilters?.endDate) params['@EndDate'] = this.appliedFilters.endDate
      if (this.searchText) params['@SearchTerm'] = this.searchText

      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'Accounting_GetJournalLedgerReport',
        parameters: params
      })

      if (res.isSuccess) {
        this.items =
          res.value[0]?.map((item, idx) => {
            const accounts = JSON.parse(item.Accounts)
            const account = accounts?.find((a) => a.Order === 0)
            const detailedAccount = accounts?.find((a) => a.Order === 1)

            return {
              ...item,
              index: (this.paginationModel.page - 1) * this.paginationModel.pageSize + idx + 1,
              AccountName: account ? `${account?.Name} (${account?.Code})` : '',
              DetailedAccountName: detailedAccount
                ? `${detailedAccount?.Name} (${detailedAccount?.Code})`
                : ''
            }
          }) || []
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
    async resetFilters() {
      this.filters = {
        startDate: null,
        endDate: null,
        orderByColumn: null
      }
      this.appliedFilters = {
        startDate: null,
        endDate: null,
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
