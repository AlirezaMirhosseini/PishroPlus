<template>
  <v-card>
    <v-card-text class="px-0 px-sm-4">
      <v-row class="pishro-border pa-4" no-gutters>
        <v-form
          class="d-flex align-center"
          style="gap: 8px; width: 100%"
          @submit.prevent="handleUpdateAccountCode"
          ref="accountCodeRef"
        >
          <v-autocomplete
            :autofocus="!this.currentActiveTab.query?.HierarchicalCode"
            v-model="accountCode"
            :items="filteredAccounts"
            item-title="fullName"
            item-value="hierarchyCode"
            variant="outlined"
            clearable
            :label="$t('selectAccount')"
            @update:search="searchQuery = $event"
            hide-details
            :hide-no-data="true"
            :no-data-text="$t('noDataAvailable')"
            :append-inner-icon="null"
            :rules="[
              (v) => {
                if (v) return true
                return $t('selectAccountMessage')
              }
            ]"
          >
            <template v-slot:item="{ props, item }">
              <v-list-item v-bind="props">
                <v-list-item-subtitle>{{ item.raw.hierarchyCode }}</v-list-item-subtitle>
                <v-list-item-subtitle>{{ item.raw.hierarchyName }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>
          <v-btn type="submit" flat color="primary" size="large" style="height: 100%">{{
            $t('search')
          }}</v-btn>
        </v-form>
        <v-col cols="12">
          <data-table
            :hasSearch="true"
            :searchItems="[
              'VoucherCode',
              'Description',
              'TotalDebtAmount',
              'TotalCreditAmount',
              'RemainAmount',
              'Detection(E)',
              'Date'
            ]"
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
            itemValue="VoucherId"
            @enterMethod="viewVoucher"
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
                    <v-col cols="12" sm="6" md="4">
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
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-select
                        :label="$t('sortType')"
                        :items="sortTypes"
                        v-model="filters.orderType"
                        variant="outlined"
                        density="compact"
                        hide-details
                      />
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
                <td colspan="5" class="px-4">{{ $t('currentPageTotal') }}</td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSum?.toLocaleString() }}</td>
                <td class="text-center">{{ metaData?.TotalCreditAmountSum?.toLocaleString() }}</td>
                <td :class="`text-center ${metaData?.TotalRemainAmountSum < 0 ? 'text-error' : ''}`">
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
                <td colspan="5" class="px-4">{{ $t('totalSum') }}</td>
                <td class="text-center">{{ metaData?.TotalDebtAmountSumAll?.toLocaleString() }}</td>
                <td class="text-center">
                  {{ metaData?.TotalCreditAmountSumAll?.toLocaleString() }}
                </td>
                <td :class="`text-center ${metaData?.TotalRemainAmountSumAll < 0 ? 'text-error' : ''}`">
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
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../../stores/default'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../../plugins/utils'
import ReportService from '../../../../api/reports/reportService'
import accountService from '../../../../api/account/accountService'
import router from '../../../../plugins/router'

export default {
  name: 'Ledger',
  props: {
    type: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      selectedAccount: {
        HierarchicalCode: null,
        HierarchicalName: null
      },
      tableHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '50px'
        },
        {
          title: this.$t('voucherNumber'),
          align: 'center',
          sortable: true,
          key: 'VoucherCode',
          width: '90px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'Date',
          width: '200px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'Description',
          width: '200px'
        },
        {
          title: this.$t('debtFlow'),
          align: 'center',
          sortable: true,
          key: 'TotalDebtAmount',
          width: '120px'
        },
        {
          title: this.$t('creditFlow'),
          align: 'center',
          sortable: true,
          key: 'TotalCreditAmount',
          width: '120px'
        },
        {
          title: this.$t('remaining'),
          align: 'center',
          sortable: true,
          key: 'RemainAmount',
          width: '120px'
        },
        {
          title: this.$t('distinction'),
          align: 'center',
          sortable: true,
          key: 'Detection(E)',
          width: '50px'
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
      allAccounts: [],
      accountCode: null,
      selectedAccountCode: null,
      searchQuery: '',
      metaData: null,
      selectedRow: null
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    async handleUpdateAccountCode() {
      const { valid } = await this.$refs.accountCodeRef.validate()

      if (valid) {
        this.selectedAccountCode = this.accountCode
        await this.getReports()
      }
    },
    async getReports() {
      const params = {
        '@PageNumber': this.paginationModel.page,
        '@PageSize': this.paginationModel.pageSize,
        '@HierarchicalCode': this.selectedAccountCode || this.selectedAccount.HierarchicalCode,
        '@OrderType': this.appliedFilters.orderType,
        '@Type': this.type
      }
      if (this.appliedFilters?.orderByColumn?.length > 0)
        params['@OrderByColumns'] = this.appliedFilters.orderByColumn?.join(',')
      if (this.appliedFilters?.startDate) params['@StartDate'] = this.appliedFilters.startDate
      if (this.appliedFilters?.endDate) params['@EndDate'] = this.appliedFilters.endDate
      if (this.searchText) params['@SearchTerm'] = this.searchText

      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'Accounting_GetAccountLedgerReport',
        parameters: params
      })

      if (res.isSuccess) {
        this.items =
          res.value[0]?.map((item, idx) => ({
            ...item,
            'Detection(E)': utils.showAccountDetection(item['Detection(E)']),
            index: (this.paginationModel.page - 1) * this.paginationModel.pageSize + idx + 1,
            date: utils.showDate(item.date)
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
    async loadAllAccounts() {
      let apiAccounts = []
      let currentPage = 1
      let hasMoreData = true
      const pageSize = 100

      while (hasMoreData) {
        const response = await accountService.advancedSearch({
          accountType: this.type,
          page: currentPage,
          size: pageSize,
          text: ''
        })

        if (!response.isSuccess) {
          this.setErrorMessage(response.errors[0].message)
          break
        }
        apiAccounts = [
          ...apiAccounts,
          ...response.value.result?.map((a) => ({
            ...a,
            fullName: `${a.name} (${a.hierarchyCode})`
          }))
        ]

        hasMoreData = currentPage * pageSize < response.value.totalCount
        currentPage++
      }
      this.allAccounts = apiAccounts

      if (this.currentActiveTab.query?.HierarchicalCode) {
        this.accountCode = this.selectedAccount.HierarchicalCode
      }
    },
    getDetectionByRemaining(remaining) {
      return utils.getDetectionByRemaining(remaining)
    },
    viewVoucher() {
      if (this.selectedRow?.VoucherId)
        this.$router.push(`/accounting/registerVoucher/view/${this.selectedRow.VoucherId}`)
    }
  },
  computed: {
    sortTypes() {
      return utils.getSortTypes()
    },
    filteredAccounts() {
      const searchText = this.searchQuery

      const filteredItems = this.allAccounts.filter((account) => {
        const code = account.code?.toString()?.toLowerCase()
        const name = account.name.toLowerCase()
        const hierarchyCode = account.hierarchyCode.toLowerCase()
        const hierarchyName = account.hierarchyName.toLowerCase()

        return (
          code.indexOf(searchText) > -1 ||
          name.indexOf(searchText) > -1 ||
          hierarchyCode.indexOf(searchText) > -1 ||
          hierarchyName.indexOf(searchText) > -1
        )
      })

      return filteredItems.slice(0, 10)
    }
  },
  async mounted() {
    if (this.currentActiveTab.query?.HierarchicalCode) {
      this.selectedAccount = {
        HierarchicalCode: this.currentActiveTab.query?.HierarchicalCode?.split('?')[0],
        HierarchicalName:
          this.currentActiveTab.query?.HierarchicalCode?.split('?')[1]?.split('=')[1]
      }
      await this.getReports()
    }
    await this.loadAllAccounts()
  },
  components: {
    dataTable
  }
}
</script>

<style></style>
