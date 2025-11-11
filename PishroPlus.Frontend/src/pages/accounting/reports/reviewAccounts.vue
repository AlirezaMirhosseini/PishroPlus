<template>
  <v-dialog close-on-back persistent v-model="addLevel.dialog" width="300px" max-width="100%">
    <v-card class="pb-3">
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-plus" />
        <p style="font-weight: bold">
          {{ $t('addCustomLevel') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="addLevel.dialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="pb-0">
        <v-form ref="addLevelForm" @submit.prevent="saveAddLevel">
          <v-text-field
            v-model="addLevel.title"
            class="mb-2"
            :rules="[
              (v) => {
                if (v) return true
                else return $t('enterRequiredField')
              }
            ]"
            :label="$t('title')"
            variant="outlined"
          />
          <v-text-field
            v-model="addLevel.level"
            class="mb-2"
            :rules="[
              (v) => {
                if (!v) return $t('enterRequiredField')
                else if (accounts.filter((a) => a.level == v).length > 0)
                  return $t('thisLevelExists')
                else return true
              }
            ]"
            type="number"
            :label="$t('level')"
            variant="outlined"
          />
          <v-btn type="submit" width="100%" variant="flat" :prepend-icon="saveIcon" color="info">{{
            $t('save')
          }}</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog close-on-back persistent v-model="tabSetting.dialog" width="600px" max-width="100%">
    <v-card class="pb-3">
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="levelSettingIcon" />
        <div>
          <p style="font-weight: bold">
            {{ $t('levelSetting') }}
          </p>
          <p class="text-grey pishro-caption">
            {{ $t('levelSettingDesc') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="tabSetting.dialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey">{{ $t('accountLevels') }}</legend>
          <v-row>
            <v-col
              class="d-flex align-center"
              v-for="item in accounts"
              :key="item.level"
              cols="6"
              md="4"
            >
              <v-checkbox
                v-model="item.show"
                :label="$t(item.title)"
                color="info"
                hide-details
                density="compact"
              />
              <v-btn
                v-if="item.level > 3"
                @click="accounts = accounts.filter((a) => a != item)"
                :icon="deleteIcon"
                variant="text"
                color="error"
              />
            </v-col>
            <v-col cols="6" md="4">
              <v-btn
                @click="openAddLevel"
                prepend-icon="mdi mdi-plus"
                variant="text"
                color="info"
                >{{ $t('addCustomLevel') }}</v-btn
              >
            </v-col>
          </v-row>
        </fieldset>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-text class="px-0 px-sm-4">
      <v-row class="align-center" no-gutters>
        <v-tabs v-model="tab" color="primary" center-active show-arrows align-tabs="start">
          <v-tab
            v-for="item in accounts.filter((c) => c.show)"
            :value="item.level"
            :key="item.level"
            @click="setTab(item.level)"
            ><v-icon :icon="fileIcon" />{{ $t(item.title) }}
            <v-icon v-if="requestAccount?.level == item.level" icon="mdi mdi-filter-outline" />
          </v-tab>
        </v-tabs>
        <v-btn
          @click="tabSetting.dialog = true"
          :icon="levelSettingIcon"
          color="info"
          variant="text"
        />
        <!-- <report-output /> -->
      </v-row>
      <v-window :touch="false" v-model="tab">
        <v-window-item
          v-for="(item, index) in accounts.filter((c) => c.show)"
          :value="item.level"
          :key="item.level"
        >
          <v-row class="d-flex flex-column flex-md-row" no-gutters>
            <div
              :class="['px-0 pishro-right-item', item.expanded ? 'pishro-right-item-expanded' : '']"
            >
              <v-row class="pishro-border pa-2" no-gutters>
                <v-col cols="12">
                  <data-table
                    :hasSearch="true"
                    :searchItems="['name', 'code', 'debtAmount', 'creditAmount', 'sum']"
                    :headers="tableHeaders"
                    :items="showingAccounts(item.level)"
                    :clickableRow="true"
                    :selectableRow="true"
                    v-model:selectedRow="item.selected"
                    @rowDblClick="($event) => changeCB(true, $event, item.level, true, index)"
                  >
                    <template v-slot:toolbar>
                      <v-row class="align-center" no-gutters>
                        <v-chip
                          color="info"
                          v-if="requestAccount?.id"
                          class="ma-2"
                          closable
                          @click:close="closeChips"
                        >
                          {{
                            $t('filterBy') +
                            ' ' +
                            $t('theAccounts') +
                            ' ' +
                            $t(accounts.filter((z) => z.level == requestAccount.level)[0].title)
                          }}
                        </v-chip>
                        <v-row class="justify-end" no-gutters>
                          <v-btn
                            v-if="index != 0"
                            class="ms-2"
                            @click="setTab(accounts[index - 1].level)"
                            icon="mdi mdi-arrow-right-top"
                            variant="tonal"
                            size="x-small"
                            color="info"
                          />
                          <v-btn
                            v-if="index != accounts.length - 1"
                            class="ms-2"
                            @click="setTab(accounts[index + 1].level)"
                            icon="mdi mdi-arrow-left-bottom"
                            variant="tonal"
                            size="x-small"
                            color="info"
                          />
                          <v-btn
                            v-if="item.expanded"
                            class="ms-2"
                            @click="item.expanded = false"
                            icon="mdi mdi-calculator-variant-outline"
                            variant="tonal"
                            size="x-small"
                            color="info"
                          />
                          <v-btn
                            v-else
                            class="ms-2"
                            @click="item.expanded = true"
                            icon="mdi mdi-menu-left"
                            variant="tonal"
                            size="x-small"
                            color="error"
                          />
                          <v-btn
                            class="ms-2"
                            @click="item.showFilters = !item.showFilters"
                            :icon="item.showFilters ? 'mdi mdi-menu-up' : 'mdi mdi-filter-variant'"
                            color="primary"
                            variant="tonal"
                            size="x-small"
                          />
                        </v-row>
                      </v-row>
                    </template>
                    <template v-slot:filterBox>
                      <v-expand-transition>
                        <fieldset v-show="item.showFilters" class="my-2 pishro-border">
                          <legend class="mx-auto px-2 text-grey">{{ $t('accountsFilter') }}</legend>
                          <v-row no-gutters style="gap: 10px">
                            <date-picker
                              value="item.filter.range"
                              @change="changeRange($event, item.level)"
                              range
                              auto-submit
                              format="YYYY-MM-DD"
                              display-format="jMMMM jD"
                              :label="$t('dateRange')"
                            />
                            <v-select
                              :label="$t('voucherType')"
                              @update:modelValue="setTab(item.level)"
                              :items="voucherTypes"
                              item-title="title"
                              item-value="id"
                              v-model="item.filter.voucherType"
                              variant="outlined"
                              hide-details
                              density="compact"
                              style="max-width: 200px"
                            />
                          </v-row>
                          <v-row
                            class="mt-4"
                            v-for="(condition, index) in item.filter?.conditions"
                            :key="index"
                            no-gutters
                            style="gap: 10px"
                          >
                            <v-select
                              @update:modelValue="setTab(item.level)"
                              :label="$t('selectColumn')"
                              variant="outlined"
                              density="compact"
                              hide-details
                              v-model="condition.fieldName"
                              :items="columns"
                              style="max-width: 150px"
                            />
                            <v-select
                              @update:modelValue="
                                ($event) => setFilterCondition(item.level, $event, condition)
                              "
                              :label="$t('condition')"
                              variant="outlined"
                              density="compact"
                              hide-details
                              v-model="condition.condition"
                              :items="conditions"
                              style="max-width: 150px"
                            />
                            <v-text-field
                              v-debounce:350="($event) => setTab(item.level)"
                              :label="$t('value')"
                              variant="outlined"
                              density="compact"
                              hide-details
                              v-model="condition.value"
                              style="max-width: 150px"
                            />
                            <v-btn
                              v-if="index == 0"
                              @click="addCondition(item)"
                              class="rounded"
                              color="info"
                              variant="tonal"
                              icon="mdi mdi-plus"
                              size="40"
                            ></v-btn>
                            <v-btn
                              v-else
                              @click="removeCondition(item, condition)"
                              class="rounded"
                              color="error"
                              variant="tonal"
                              icon="mdi mdi-minus"
                              size="40"
                            ></v-btn>
                          </v-row>
                        </fieldset>
                      </v-expand-transition>
                    </template>
                    <template v-slot:column_checkBox="{ entity }">
                      <v-checkbox
                        :model-value="entity.checkBox"
                        @update:modelValue="($event) => changeCB($event, entity, item.level)"
                        hide-details
                        density="compact"
                        style="margin: -10px"
                      />
                    </template>
                  </data-table>
                </v-col>
              </v-row>
            </div>
            <div class="mt-2 mt-md-0 px-0 ps-md-3 pishro-left-item" v-if="!item.expanded">
              <v-row class="pishro-border pa-2" no-gutters>
                <v-col class="pa-6 rounded-lg bg-lightBlue" cols="12">
                  <v-row class="justify-space-between text-info">
                    <p style="font-weight: bold; font-size: 17px">{{ $t('accountBalance') }}</p>
                    <p style="font-weight: bold; font-size: 17px">
                      {{
                        (item?.items?.type == 1
                          ? $t('debtorAbbreviation')
                          : item?.items?.type == 2
                          ? $t('creditorAbbreviation')
                          : '') +
                        ' ' +
                        (item?.items?.sum?.toLocaleString() ?? 0)
                      }}
                    </p>
                  </v-row>
                </v-col>
                <v-col class="pa-6" cols="12">
                  <v-row class="justify-space-between">
                    <p>{{ $t('debtor') }}</p>
                    <p>{{ item?.items?.debtAmount?.toLocaleString() ?? 0 }}</p>
                  </v-row>
                </v-col>
                <v-col class="pa-6" cols="12">
                  <v-row class="justify-space-between">
                    <p>{{ $t('creditor') }}</p>
                    <p>{{ item?.items?.creditAmount?.toLocaleString() ?? 0 }}</p>
                  </v-row>
                </v-col>
              </v-row>
            </div>
          </v-row>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import accountReportService from '../../../../api/accountReport/accountReportService'
import fileIcon from '../../../components/icons/File.vue'
import levelSettingIcon from '../../../components/icons/ReviewLevelSetting.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import saveIcon from '../../../components/icons/Save.vue'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../../plugins/utils'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'

export default {
  data() {
    return {
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
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '90px'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '200px'
        },
        {
          title: this.$t('debtFlow'),
          align: 'center',
          sortable: true,
          key: 'debtAmount',
          width: '120px'
        },
        {
          title: this.$t('creditFlow'),
          align: 'center',
          sortable: true,
          key: 'creditAmount',
          width: '120px'
        },
        {
          title: this.$t('distinction'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '50px'
        },
        {
          title: this.$t('remaining'),
          align: 'center',
          sortable: true,
          key: 'sum',
          width: '120px'
        }
      ],
      tabSetting: {
        dialog: false
      },
      addLevel: {
        dialog: false
      },
      accounts: [
        {
          level: 1,
          title: 'group'
        },
        {
          level: 2,
          title: 'general'
        },
        {
          level: 3,
          title: 'subsidiary'
        },
        {
          level: -1,
          title: 'detailed'
        }
      ],
      tab: 1,
      fileIcon: markRaw(fileIcon),
      levelSettingIcon: markRaw(levelSettingIcon),
      saveIcon: markRaw(saveIcon),
      deleteIcon: markRaw(deleteIcon),
      trackingItems: {},
      requestAccount: {}
    }
  },
  computed: {
    columns() {
      return [
        {
          title: this.$t('accountCode'),
          value: 'code'
        },
        {
          title: this.$t('accountName'),
          value: 'name'
        },
        {
          title: this.$t('debtFlow'),
          value: 'debtAmount'
        },
        {
          title: this.$t('creditFlow'),
          value: 'creditAmount'
        },
        {
          title: this.$t('remaining'),
          value: 'sum'
        }
      ]
    },
    conditions() {
      return [
        {
          title: this.$t('contains'),
          value: 0
        },
        {
          title: this.$t('notContains'),
          value: 1
        },
        {
          title: this.$t('biggerThan'),
          value: 2
        },
        {
          title: this.$t('biggerOrEqual'),
          value: 3
        },
        {
          title: this.$t('smallerThan'),
          value: 4
        },
        {
          title: this.$t('smallerOrEqual'),
          value: 5
        },
        {
          title: this.$t('equal'),
          value: 6
        },
        {
          title: this.$t('empty'),
          value: 7
        },
        {
          title: this.$t('notEmpty'),
          value: 8
        },
        {
          title: this.$t('startWith'),
          value: 9
        },
        {
          title: this.$t('endWith'),
          value: 10
        }
      ]
    },
    voucherTypes() {
      return [
        {
          title: this.$t('normal'),
          id: 0
        },
        {
          title: this.$t('opening'),
          id: 1
        },
        {
          title: this.$t('closing'),
          id: 2
        },
        {
          title: this.$t('profitAndLoss'),
          id: 3
        }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    changeRange(value, level) {
      let selected = this.accounts.filter((a) => a.level == level)[0]
      selected.filter.range = value
      selected.filter.fromDate = value[0]
      selected.filter.toDate = value[1]
      this.setTab(level)
    },
    openAddLevel() {
      this.addLevel = {
        dialog: true
      }
    },
    async saveAddLevel() {
      const isVal = await this.$refs.addLevelForm.validate()
      if (isVal.valid) {
        this.accounts.push({
          title: this.addLevel.title,
          level: this.addLevel.level,
          items: {
            type: 0
          },
          selected: null,
          checked: null,
          searchText: null,
          expanded: false,
          show: true,
          showFilters: false,
          filter: {
            fromDate: null,
            toDate: null,
            voucherType: 0,
            conditions: [
              {
                fieldName: 'name',
                value: '',
                condition: 0,
                conditionOperatorType: 0
              }
            ]
          }
        })
        this.accounts.sort(this.sortTabs)
        this.addLevel.dialog = false
      }
    },
    sortTabs(a, b) {
      if (a.level == -1) return 1
      if (b.level == -1) return -1
      return a.level - b.level
    },
    showingAccounts(level) {
      return this.accounts
        .filter((a) => a.level == level)[0]
        ?.items?.items?.map((z, ind) => ({
          id: z.id,
          index: ind + 1,
          checkBox: z.checkBox,
          name: z.name,
          code: z.code,
          debtAmount: z.debtAmount.toLocaleString(),
          creditAmount: z.creditAmount.toLocaleString(),
          sum: z.sum.toLocaleString(),
          type:
            z.type == 1
              ? this.$t('debtorAbbreviation')
              : z.type == 2
              ? this.$t('creditorAbbreviation')
              : '---'
        }))
        .filter((a) =>
          utils.filterBySearch(
            this.accounts.filter((a) => a.level == level)[0]?.searchText,
            ['name', 'code', 'debtAmount', 'creditAmount', 'sum'],
            a
          )
        )
    },
    closeChips() {
      this.requestAccount = {}
      this.setTab(this.tab)
    },
    changeCB(value, item, level, goNext, index) {
      this.accounts
        .filter((b) => b.level == level)[0]
        ?.items?.items?.forEach((element) => {
          element.checkBox = false
        })
      let selected = this.accounts
        .filter((b) => b.level == level)[0]
        ?.items?.items?.filter((a) => a.id == item.id)[0]
      selected.checkBox = value
      if (value) {
        this.accounts.filter((a) => a.level == level)[0].checked = { ...selected }
        this.requestAccount = { id: selected.id, level: level }
        if (goNext && index != this.accounts.length - 1) this.setTab(this.accounts[index + 1].level)
      } else {
        if (this.requestAccount.level == level) this.requestAccount = {}
        this.accounts.filter((a) => a.level == level)[0].checked = null
      }
    },
    async setFilterCondition(level, value, condition) {
      if (value >= 2 && value <= 6) condition.value = 0
      await this.setTab(level)
    },
    async setTab(selectedTab) {
      let accoundId = null
      if (selectedTab == -1) {
        if (this.requestAccount?.level != -1) accoundId = this.requestAccount.id
        await this.getDetailedReport(
          accoundId,
          this.accounts.filter((b) => b.level == selectedTab)[0].filter
        ).then((res) => {
          if (res.isSuccess) {
            let detailedAccounts = this.accounts.filter((b) => b.level == -1)[0]
            detailedAccounts.items = res.entity
            if (detailedAccounts?.checked) {
              detailedAccounts.items.items.filter(
                (a) => a.id == detailedAccounts.checked.id
              )[0].checkBox = true
            }
          }
        })
      } else {
        if (this.requestAccount?.level != selectedTab) accoundId = this.requestAccount.id
        await this.getReports(
          this.requestAccount?.level == -1 ? null : accoundId,
          selectedTab,
          this.requestAccount?.level == -1 ? accoundId : null,
          this.accounts.filter((b) => b.level == selectedTab)[0].filter
        ).then((res) => {
          if (res.isSuccess) {
            let selectedAccounts = this.accounts.filter((b) => b.level == selectedTab)[0]
            selectedAccounts.items = res.entity
            if (selectedAccounts?.checked) {
              let selected = selectedAccounts.items.items.filter(
                (a) => a.id == selectedAccounts.checked.id
              )[0]
              if (selected) selected.checkBox = true
            }
          } else this.setErrorMessage(res.message)
        })
      }
      this.tab = selectedTab
    },
    getReports(account, level, detailed, filter) {
      return accountReportService.getAccountsReviewJournal({
        entity: {
          accountId: account || null,
          filterAccountLevel: level || 1,
          detailedAccountId: detailed || null,
          filter: filter || null
        }
      })
    },
    getDetailedReport(account, filter) {
      return accountReportService.getDetailedAccountsReviewJournal({
        entity: {
          accountId: account || null,
          filter: filter || null
        }
      })
    },
    addCondition(item) {
      item.filter.conditions.push({
        fieldName: 'name',
        value: '',
        condition: 0,
        conditionOperatorType: 0
      })
    },
    removeCondition(item, condition) {
      item.filter.conditions = item.filter.conditions.filter((a) => a != condition)
      this.setTab(item.level)
    },
    onkeydown(e) {
      if (this.tabSetting?.dialog && e.keyCode == 27)
        if (this.addLevel?.dialog) this.addLevel.dialog = false
        else this.tabSetting.dialog = false
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
    this.accounts.forEach((element) => {
      element.items = {
        type: 0
      }
      element.selected = null
      element.checked = null
      element.searchText = null
      element.expanded = false
      element.show = true
      element.showFilters = false
      element.filter = {
        fromDate: null,
        toDate: null,
        voucherType: 0,
        conditions: [
          {
            fieldName: 'name',
            value: '',
            condition: 0,
            conditionOperatorType: 0
          }
        ]
      }
    })
    await this.setTab(1)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  components: {
    reportOutput,
    dataTable
  }
}
</script>

<style>
.no-border {
  border: none !important;
}
</style>
