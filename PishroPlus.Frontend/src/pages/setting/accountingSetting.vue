<template>
  <v-card>
    <v-card-text class="d-flex flex-column" style="gap: 4px">
      <p style="font-weight: bold" class="mb-2">{{ $t('public') }}</p>
      <v-row no-gutters class="d-flex justify-space-between align-center">
        <v-text-field
          v-model="settingEntity.generalAccountLevel"
          :label="$t('generalAccountLevel')"
          type="number"
          min="1"
          @input="validateMinNumber"
          :rules="[(v) => !!v || $t('enterRequiredField')]"
          hide-details
          density="compact"
          variant="outlined"
          style="max-width: 200px"
        ></v-text-field>
        <v-checkbox
          :label="$t('showAccountCodeInTreeList')"
          v-model="settingEntity.showAccountCodeInTreeList"
          hide-details
          density="compact"
          class="ml-5"
        ></v-checkbox>
        <v-checkbox
          :label="$t('VoucherDescRequired')"
          v-model="settingEntity.voucherDescRequired"
          hide-details
          density="compact"
        ></v-checkbox>
      </v-row>
      <voucher-template />
      <!-- <data-table 
        :items="templates" 
        :headers="voucherTemplateHeaders"
        :page="templatesParams.page"
        :pageSize="templatesParams.size"
        :totalCount="templatesTotalCount"
        :isServerSide="true"
        @update:page="updateTemplatesPage"
        @update:pageSize="updateTemplatesPageSize"
      >
        <template v-slot:toolbar>
          <v-row no-gutters align="center">
            <p style="font-weight: bold">{{ $t('voucherTemplates') }}</p>
            <v-btn
              class="mx-2"
              color="info"
              variant="tonal"
              @click="showCreateOrUpdateTemplateDialog"
            >
              <v-icon size="small">mdi-plus</v-icon>
              {{ $t('newVoucherTemplate') }}
            </v-btn>
          </v-row>
        </template>
        <template v-slot:column_row="{ entity }">
          <v-icon
            v-if="entity.isDefault"
            color="amber-darken-3"
            size="x-small"
            icon="mdi mdi-star"
          />
          {{ templates.indexOf(entity) + 1 }}
        </template>
        <template v-slot:column_title="{ entity }">
          <span>{{ entity.title }}</span>
        </template>
        <template v-slot:column_issuerPart="{ entity }">
          {{ getSourceTypeName(entity.issuerPart) }}
        </template>
        <template v-slot:column_type="{ entity }">
          {{ entity.type === 0 ? $t('customize') : $t('systemic') }}
        </template>
        <template v-slot:column_operations="{ entity }">
          <div class="d-flex justify-ceneter">
            <v-tooltip :text="$t('edit')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi mdi-pencil-outline"
                  variant="text"
                  color="info"
                  size="small"
                  @click="() => OpenEdit(entity)"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('delete')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="deleteIcon"
                  :disabled="entity.type === 1"
                  @click="deleteVoucherTemplate(entity)"
                  variant="text"
                  color="error"
                  size="small"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </data-table> -->
      <formula />
      <v-btn
        color="info"
        variant="flat"
        size="large"
        prepend-icon="mdi mdi-content-save"
        class="text-center align-self-end"
        @click="saveSettings"
        >{{ $t('save') }}</v-btn
      >
    </v-card-text>
  </v-card>
  <!-- <v-dialog v-model="createOrUpdateTemplateDialog" max-width="75%">
    <v-card>
      <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
        <v-icon
          color="info"
          class="ml-2"
          :icon="`mdi ${templateEntity.id ? 'mdi-pencil-outline' : 'mdi-note-plus'}`"
        />
        <div>
          <p style="font-weight: bold">
            {{ !templateEntity.id ? $t('createVoucherTemplate') : $t('updateVoucherTemplate') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="hideCreateOrUpdateTemplateDialog"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="templateEntityForm" @submit.prevent="saveTemplate">
        <v-card-text>
          <v-row class="mb-4" no-gutters>
            <v-col class="pa-1" cols="12" md="3">
              <v-select
                :label="$t('templateType')"
                variant="outlined"
                density="compact"
                hide-details
                v-model="templateEntity.issuerPart"
                item-title="title"
                item-value="id"
                :items="issuerParts"
              ></v-select>
            </v-col>
            <v-col class="pa-1" cols="12" md="6">
              <v-text-field
                v-model="templateEntity.title"
                :rules="[(v) => !!v || $t('enterRequiredField')]"
                variant="outlined"
                density="compact"
                :label="$t('templateTitle')"
              />
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-checkbox
                hide-details
                density="compact"
                v-model="templateEntity.isDefault"
                :label="$t('setAsDefaultTemplate')"
              />
            </v-col>
            <v-col class="pa-1" cols="12" md="9">
              <v-textarea
                @drop.prevent="dropToVoucherDesc"
                v-model="templateEntity.desc"
                :rules="[(v) => !!v || $t('enterRequiredField')]"
                variant="outlined"
                density="compact"
                :label="$t('desc')"
                style="min-width: 300px"
              />
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-card variant="outlined" class="pishro-border" width="100%">
                <p
                  v-for="item in voucherDescItems"
                  :key="item.id"
                  :draggable="true"
                  @dragstart="($event) => onDragDescItem($event, item)"
                  class="text-info pishro-caption pishro-border pa-2 ma-1"
                  style="cursor: move"
                >
                  <v-icon>mdi-chevron-double-right</v-icon>
                  {{ `(${item.id}) ${item.title}` }}
                </p>
              </v-card>
            </v-col>
          </v-row>
          <data-table
            :showPagination="false"
            :headers="voucherTemplateRecordHeaders"
            :items="templateEntity.records"
          >
            <template v-slot:toolbar>
              <v-row no-gutters align="center">
                <p style="font-weight: bold">{{ $t('voucherTemplateRecords') }}</p>
                <v-btn
                  class="mr-2"
                  @click="showAddOrUpdateTemplateRowDialog(true)"
                  prepend-icon="mdi mdi-plus"
                  variant="tonal"
                  color="primary"
                  >{{ $t('addRow') }}</v-btn
                >
              </v-row>
            </template>
            <template v-slot:column_row="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:column_type="{ entity }">
              {{ entity.typeTitle }}
            </template>
            <template v-slot:column_accountType="{ entity }">
              {{ entity.accountTypeTitle }}
            </template>
            <template v-slot:column_account="{ entity }">
              {{ entity.account?.fName }}
            </template>
            <template v-slot:column_operations="{ entity, index }">
              <div class="d-flex justify-center">
                <v-tooltip :text="$t('edit')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi mdi-pencil-outline"
                      variant="text"
                      color="info"
                      size="small"
                      @click="() => openVoucherTemplateRecordEdit(entity)"
                      :disabled="templateEntity.type === 1"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('delete')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      @click="deleteRecordItem(entity, index)"
                      :icon="deleteIcon"
                      variant="text"
                      color="error"
                      size="small"
                      :disabled="templateEntity.type === 1"
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>
          </data-table>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn
            v-if="templateEntity.id"
            @click="cancelEdit"
            color="grey"
            variant="outlined"
            size="large"
            prepend-icon="mdi mdi-close"
            >{{ $t('cancel') }}</v-btn
          >
          <v-btn
            :disabled="!templateEntity.title || !templateEntity.desc || templateEntity.type === 1"
            type="submit"
            color="info"
            size="large"
            variant="flat"
            prepend-icon="mdi mdi-content-save"
            >{{ $t('save') }}</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>
  <v-dialog v-model="addOrUpdateTemplateRowDialog" max-width="75%" persistent eager>
    <v-card>
      <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
        <v-icon
          color="info"
          class="ml-2"
          :icon="`mdi ${templateRecordEntity.isEdit ? 'mdi-note-pencil' : 'mdi-note-plus'}`"
        />
        <div>
          <p style="font-weight: bold">
            {{ !templateRecordEntity.isEdit ? $t('add') : $t('edit') }} {{ $t('row') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="hideAddOrUpdateTemplateRowDialog"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="addOrUpdateTemplateRowFrm">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" md="9" class="pa-1">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <v-select
                    variant="outlined"
                    density="compact"
                    :label="`${$t('type')}(${$t('creditor')}/${$t('debtor')})`"
                    :items="voucherTemplateRecordTypes"
                    v-model="templateRecordEntity.type"
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <v-select
                    density="compact"
                    variant="outlined"
                    :label="$t('accountType')"
                    :items="
                      voucherTemplateAccountTypes.filter((x) =>
                        x.issuerPart.includes(templateEntity.issuerPart)
                      )
                    "
                    v-model="templateRecordEntity.accountType"
                  ></v-select>
                </v-col>
                <v-col cols="12" class="pa-1">
                  <accountSelector v-model="templateRecordEntity.account" :justAccount="true" />
                </v-col>
                <v-col cols="12" class="pa-1">
                  <v-textarea
                    @drop.prevent="dropToVoucherTemplateRecordDesc"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :label="$t('desc')"
                    v-model="templateRecordEntity.desc"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="3" class="pa-1">
              <v-row class="pa-4 pishro-border" no-gutters>
                <v-col class="mb-2" cols="12">
                  <p class="text-center text-grey">
                    {{ $t('descItems') }}
                  </p>
                </v-col>
                <v-col
                  v-for="item in voucherRecordDescItems"
                  :key="item.id"
                  cols="12"
                  sm="6"
                  md="12"
                >
                  <p
                    :draggable="true"
                    @dragstart="($event) => onDragDescItem($event, item)"
                    class="text-info pishro-caption my-2"
                    style="cursor: grab"
                  >
                    {{ `(${item.id}) ${item.title}` }}
                  </p>
                </v-col>
              </v-row>
              <p class="pishro-caption text-grey pa-2">{{ '* ' + $t('insertByDragAndDrop') }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn
            @click="addOrUpdateTemplateRow"
            color="info"
            variant="flat"
            size="large"
            prepend-icon="mdi mdi-check"
            >{{ $t('submit') }}</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog> -->
  <v-dialog v-model="PLdialog" max-width="75%" eager>
    <v-card>
      <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
        <div>
          <p style="font-weight: bold">
            {{ $t('createNewComponentTemplate') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="PLdialog = false" variant="text" />
        </div>
      </v-row>
      <v-form ref="plComponentForm">
        <v-row no-gutters>
          <v-col cols="12" md="12" class="pa-1 d-flex">
            <v-col cols="12" md="6">
              <accountSelector
                :justAccount="true"
                v-model="selectedAccount"
                :justOperationlAccounts="false"
                :textFieldRules="[(v) => !!v || $t('daskjbds')]"
              />
            </v-col>
            <v-col>
              <v-select
                :items="actionTypes"
                variant="outlined"
                item-value="id"
                density="compact"
                :label="$t('action')"
                v-model="selectedAction"
              />
            </v-col>
          </v-col>
          <div class="ms-auto ml-2 mb-2">
            <v-btn
              color="info"
              variant="flat"
              size="large"
              prepend-icon="mdi mdi-content-save"
              class="text-center"
              @click="addToTable()"
              >{{ $t('save') }}</v-btn
            >
          </div>
        </v-row>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default.js'
import voucherService from '../../../api/voucher/voucherService.js'
import accountService from '../../../api/account/accountService.js'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import treeView from '../../components/baseComponents/Treeview/treeview.vue'
import utils from '../../../plugins/utils.js'
import treeViewIcon from '../../components/icons/AccountingTreeView.vue'
import folderIcon from '../../components/icons/Folder.vue'
import openedFolderIcon from '../../components/icons/Folder-Opened.vue'
import folderStarIcon from '../../components/icons/Folder-Star.vue'
import paperIcon from '../../components/icons/Paper.vue'
import saveIcon from '../../components/icons/Save.vue'
import deleteIcon from '../../components/icons/Delete.vue'
import accountSelector from '../../components/accountsComponents/accountSelector.vue'
import { markRaw } from 'vue'
import accountReportService from '../../../api/accountReport/accountReportService.js'
import settingService from '../../../api/setting/settingService'
import voucherTemplate from '../../components/settingComponents/voucherTemplate.vue'
import Formula from '../../components/settingComponents/formula.vue'

export default {
  data() {
    return {
      isSystemi: false,
      PLdialog: false,
      tableData: [],
      selectedAccount: {},
      selectedAction: 0,
      treeViewIcon: markRaw(treeViewIcon),
      folderIcon: markRaw(folderIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      folderStarIcon: markRaw(folderStarIcon),
      paperIcon: markRaw(paperIcon),
      saveIcon: markRaw(saveIcon),
      deleteIcon: markRaw(deleteIcon),
      addOrUpdateTemplateRowDialog: false,
      createOrUpdateTemplateDialog: false,
      treeViewAccountsShowList: [],
      settingEntity: {
        showAccountCodeInTreeList: 1,
        voucherDescRequired: 0,
        generalAccountLevel: 1
      },
      templatesParams: {
        page: 1,
        size: 10
      },
      generalAccountLevel: 1,
      templatesTotalCount: 0,
      selectAccountDialog: {
        show: false,
        searchText: ''
      },
      templates: [],
      templateEntity: {
        isEdit: false,
        sourceType: 0,
        records: []
      },
      templateRecordEntity: {
        isEdit: false
      },
      issuerParts: [
        { id: 0, title: `${this.$t('salesInvoice')}` },
        { id: 21, title: `${this.$t('receiveDeposit')}_${this.$t('cardToCard')}` },
        { id: 24, title: `${this.$t('receiveDeposit')}_${this.$t('bankPos')}` }
      ],
      voucherDescItems: [
        { id: 'code', title: this.$t('code') },
        { id: 'dateTime', title: this.$t('dateTime') },
        { id: 'totalAmount', title: this.$t('totalAmount') },
        { id: 'dueDate', title: this.$t('dueDate') }
      ],
      voucherRecordDescItems: [
        { id: 'accountCode', title: this.$t('accountCode') },
        { id: 'accountName', title: this.$t('accountName') },
        { id: 'invoiceCode', title: this.$t('invoiceCode') },
        { id: 'invoiceDate', title: this.$t('invoiceDate') },
        { id: 'invoiceDueDate', title: this.$t('dueDate') },
        { id: 'totalAmount', title: this.$t('totalAmount') },
        { id: 'documentType', title: this.$t('documentType') },
        { id: 'serialNumber', title: this.$t('serialNumber') }
      ],
      actionTypes: [
        { id: 0, title: this.$t('additional') },
        { id: 1, title: this.$t('regressive') }
      ],
      profitAndLossHeader: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'accountName',
          width: '50px'
        },
        {
          title: this.$t('action'),
          align: 'center',
          sortable: true,
          key: 'action',
          width: '50px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '50px'
        }
      ],
      voucherTemplateRecordHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('type'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '100px'
        },
        {
          title: this.$t('accountType'),
          align: 'center',
          sortable: true,
          key: 'accountType',
          width: '100px'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'account',
          width: '200px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '200px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '40px',
          fixed: true
        }
      ],
      voucherTemplateHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('issuerPart'),
          align: 'center',
          sortable: true,
          key: 'issuerPart',
          width: '200px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '200px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '300px'
        },
        {
          title: this.$t('type'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '100px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '40px',
          fixed: true
        }
      ],
      voucherTemplateRecordTypes: [
        {
          title: this.$t('debtor'),
          value: 0
        },
        {
          title: this.$t('creditor'),
          value: 1
        }
      ],
      voucherTemplateAccountTypes: [
        {
          title: this.$t('productSalesAccount'),
          value: 0,
          issuerPart: [0]
        },
        {
          title: this.$t('serviceSalesAccount'),
          value: 1,
          issuerPart: [0]
        },
        {
          title: this.$t('productStockAccount'),
          value: 2,
          issuerPart: [0]
        },
        {
          title: this.$t('productCostAccount'),
          value: 3,
          issuerPart: [0]
        },
        {
          title: this.$t('vatAccount'),
          value: 4,
          issuerPart: [0]
        },
        {
          title: this.$t('discountAccount'),
          value: 5,
          issuerPart: [0]
        },
        {
          title: this.$t('marketingCostAccount'),
          value: 6,
          issuerPart: [0]
        },
        {
          title: this.$t('bankAccount'),
          value: 20,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('cashBoxAccount'),
          value: 21,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('receivableAccount'),
          value: 22,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('payableAccount'),
          value: 23,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('commissionAccount'),
          value: 24,
          issuerPart: [24, 21]
        }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog'
    }),
    validateMinNumber(event) {
      const value = parseInt(this.settingEntity.generalAccountLevel)
      if (value < 1) {
        this.settingEntity.generalAccountLevel = 1
      }
    },
    DeleteComponentTemplate(entity, index) {
      this.tableData.splice(index, 1)
    },
    showPLDialog() {
      this.action = 0
      this.selectedAccount = {}
      this.PLdialog = true
    },
    showAddOrUpdateTemplateRowDialog(isNew) {
      if (isNew) {
        this.templateRecordEntity = {}
      }
      this.addOrUpdateTemplateRowDialog = true
    },
    hideAddOrUpdateTemplateRowDialog() {
      this.$refs.addOrUpdateTemplateRowFrm.reset()
      this.addOrUpdateTemplateRowDialog = false
    },
    hideCreateOrUpdateTemplateDialog() {
      this.$refs.templateEntityForm.reset()
      this.createOrUpdateTemplateDialog = false
    },
    showCreateOrUpdateTemplateDialog() {
      this.templateEntity = {
        isEdit: false,
        sourceType: 0,
        records: []
      }
      this.createOrUpdateTemplateDialog = true
    },
    openVoucherTemplateRecordEdit(item) {
      this.templateRecordEntity = {
        ...item,
        account: {
          ...item.account,
          selectedAccount: { ...item.account }
        }
      }
      this.showAddOrUpdateTemplateRowDialog()
    },
    addOrUpdateTemplateRow() {
      let idx = !this.templateRecordEntity.id
        ? -1
        : this.templateEntity.records.findIndex((x) => x.id === this.templateRecordEntity.id)
      if (idx < 0)
        this.templateEntity.records.push({
          ...this.templateRecordEntity,
          accountTypeTitle: this.voucherTemplateAccountTypes.filter(
            (x) => x.value === this.templateRecordEntity.accountType
          )[0]?.title,
          typeTitle: this.voucherTemplateRecordTypes.filter(
            (x) => x.value === this.templateRecordEntity.type
          )[0]?.title,
          key: this.templateRecordEntity.accountType,
          account: { ...(this.templateRecordEntity.account?.selectedAccount ?? {}) },
          accountId: this.templateRecordEntity.account?.selectedAccount?.accountId
        })
      else {
        this.templateEntity.records[idx] = { ...this.templateRecordEntity }
        this.templateEntity.records[idx].accountTypeTitle = this.voucherTemplateAccountTypes.filter(
          (x) => x.value === this.templateRecordEntity.accountType
        )[0]?.title
        this.templateEntity.records[idx].typeTitle = this.voucherTemplateRecordTypes.filter(
          (x) => x.value === this.templateRecordEntity.type
        )[0]?.title

        this.templateEntity.records[idx].key = this.templateRecordEntity.accountType

        this.templateEntity.records[idx].account = {
          ...(this.templateRecordEntity.account?.selectedAccount ?? {})
        }
        this.templateEntity.records[idx].accountId =
          this.templateRecordEntity.account?.selectedAccount?.accountId
      }
      this.hideAddOrUpdateTemplateRowDialog()
    },
    deleteRecordItem(entity, index) {
      this.setWarningDialog(true, this.$t('deleteRow'), this.$t('confirmDeleteMessage'), () =>
        this.templateEntity.records.splice(index, 1)
      )
    },
    onDragDescItem(element, item) {
      element.dataTransfer.setData('text', item.id)
    },
    dropToVoucherDesc(element) {
      const id = element.dataTransfer.getData('text')
      if (!this.templateEntity.desc) this.templateEntity.desc = ''
      this.templateEntity.desc += `[${id}]`
    },
    dropToVoucherTemplateRecordDesc(element) {
      const id = element.dataTransfer.getData('text')
      if (!this.templateRecordEntity.desc) this.templateRecordEntity.desc = ''
      this.templateRecordEntity.desc += `[${id}]`
    },
    arrangeItems(list) {
      list.forEach((item) => {
        item.title = item.name + ' ' + item.fCode
        item.draggable = false
        item.icon = item.isGeneralType
          ? folderStarIcon
          : item.isOperational
          ? paperIcon
          : folderIcon
        item.openedIcon = item.isOperational || item.isGeneralType ? null : openedFolderIcon
        item.open = this.selectAccountDialog.searchText ? true : false
        item.dblClick = () => this.saveSelectAccount()
        if (item?.children?.length > 0) item.children = this.arrangeItems(item.children)
      })
      return list
    },
    setActiveAccount(item) {
      this.selectAccountDialog.selectedAccount = item
    },
    saveSelectAccount() {
      if (this.selectAccountDialog.isDebtor)
        this.templateEntity.debtorAccount = this.selectAccountDialog.selectedAccount
      else this.templateEntity.creditorAccount = this.selectAccountDialog.selectedAccount
      this.selectAccountDialog = {
        show: false,
        searchText: '',
        isDebtor: false
      }
    },
    OpenEdit(item) {
      this.templateEntity = { ...item }
      this.createOrUpdateTemplateDialog = true
    },
    openEditComponent(item) {
      this.selectedAccount = {
        selectedAccount: {
          accountId: item.accountId,
          fName: item.accountName,
          fCode: item.accountCode,
          code: item.accountCode
        }
      }
      this.selectedAction = item.action
      this.PLdialog = true
    },
    getSourceTypeName(type) {
      return this.issuerParts.filter((x) => x.id === type)[0]?.title
    },
    async addToTable() {
      if (!(await this.$refs.plComponentForm.validate()).valid) return
      this.tableData.push({
        accountName: this.selectedAccount.selectedAccount?.fName,
        accountId: this.selectedAccount.selectedAccount?.accountId,
        action: this.selectedAction
      })
      this.PLdialog = false
      this.selectedAction = 0
      this.selectedAccount = {}
    },
    async setPLComponent() {
      let request = {
        entity: {
          components: [...this.tableData]
        }
      }
      await accountReportService.setPLComponents(request).then((res) => {
        if (res.isSuccess) {
          this.getPLComponent()
          this.setErrorMessage(
            this.$t('componentsOfTheProfitAndLossReportSuccessfullyCreated'),
            'success'
          )
        } else {
          this.setErrorMessage(res.message)
        }
      })
    },
    async getPLComponent() {
      await accountReportService.getPLComponents().then((res) => {
        this.tableData = res.entity.components
      })
    },
    async saveSettings() {
      await this.setPLComponent()
      const settings = [
        {
          key: 'ShowAccountCodeInTreeList',
          value: (this.settingEntity?.showAccountCodeInTreeList || false).toString(),
          module: 0
        },
        {
          key: 'VoucherDescRequired',
          value: (this.settingEntity?.voucherDescRequired || false).toString(),
          module: 0
        },
        {
          key: 'default_level_of_general_accounts',
          value: (this.settingEntity?.generalAccountLevel || 1).toString(),
          module: 0
        }
      ]

      for (const setting of settings) {
        const res = await settingService.setSettings(setting)
        if (!res.isSuccess) {
          this.setErrorMessage(res.errors[0]?.message || res.message)
          return
        }
      }

      if (!res.isSuccess) {
        this.setErrorMessage(res.message)
      } else {
        this.setErrorMessage(this.$t('settingHasSetSuccessfully'), 'success')
      }
    },
    async getAccountSettings() {
      const params = {
        page: 1,
        size: 100,
        settingModule: 0
      }
      let res = await settingService.getSetting(params)
      if (res.isSuccess) {
        this.settingEntity.showAccountCodeInTreeList =
          res.entities?.filter((x) => x.name === 'ShowAccountCodeInTreeList')[0]?.value == '1'
        this.settingEntity.voucherDescRequired =
          res.entities?.filter((x) => x.name === 'VoucherDescRequired')[0]?.value == '1'
        this.settingEntity.generalAccountLevel = 
          parseInt(res.entities?.filter(x => x.name === 'default_level_of_general_accounts')[0]?.value) || 1;
      }
    },
    async changeSearchText(text) {
      await this.searchAccount(text)
    },
    async openSelectAccount(isDebtor) {
      await this.searchAccount('')
      this.selectAccountDialog = {
        show: true,
        searchText: '',
        isDebtor: isDebtor
      }
    },
    async searchAccount(text) {
      await accountService.search({ entity: { searchText: text } }).then((res) => {
        if (res.isSuccess) {
          let accounts = this.arrangeItems([...res.entities])
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: false,
              title: this.$t('accountingTreeView'),
              draggable: false,
              open: true,
              icon: folderIcon,
              openedIcon: openedFolderIcon,
              children: accounts
            }
          ]
        } else this.setErrorMessage(res.message)
      })
    },
    // async cancelEdit() {
    //   this.$refs.templateEntityForm.reset()
    //   this.createOrUpdateTemplateDialog = false
    //   await this.getTemplates()
    // },
    // async deleteVoucherTemplate(entity) {
    //   const deleteFunc = async () => {
    //     await voucherService.deleteTemplate(entity.id).then((res) => {
    //       if (res.isSuccess) {
    //         this.setErrorMessage(this.$t('voucherTemplateHasRemoveSuccessfully'), 'success')
    //         this.getTemplates()
    //       }
    //     })
    //   }
    //   this.setWarningDialog(true, this.$t('deleteRow'), this.$t('confirmDeleteMessage'), deleteFunc)
    // },
    // async saveTemplate() {
    //   const { valid } = await this.$refs.templateEntityForm.validate()
    //   if (valid) {
    //     if (this.templateEntity.id) {
    //       await voucherService
    //         .updateTemplate({
    //           entity: {
    //             ...this.templateEntity,
    //             items: this.templateEntity.records
    //           }
    //         })
    //         .then((res) => {
    //           if (res.isSuccess) {
    //             this.$refs.templateEntityForm.reset()
    //             this.setErrorMessage(this.$t('voucherTemplateUpdatedSuccessfully'), 'success')
    //             this.getTemplates()
    //             this.createOrUpdateTemplateDialog = false
    //           } else this.setErrorMessage(res.message)
    //         })
    //     } else {
    //       await voucherService
    //         .createTemplate({
    //           entity: {
    //             ...this.templateEntity,
    //             items: this.templateEntity.records
    //           }
    //         })
    //         .then((res) => {
    //           if (res.isSuccess) {
    //             this.$refs.templateEntityForm.reset()
    //             this.setErrorMessage(this.$t('voucherTemplateCreatedSuccessfully'), 'success')
    //             this.getTemplates()
    //             this.createOrUpdateTemplateDialog = false
    //           } else this.setErrorMessage(res.message)
    //         })
    //     }
    //   }
    // },
    // async getTemplates() {
    //   // console.log(this.templatesParams);
    //   // this.templatesParams.issuerPart = 0
    //   const res = await voucherService.getAllTemplates(this.templatesParams);
    //   console.log(res);
      
    //   if (res.isSuccess) {
    //     this.templates = res.value.result.map(x => ({
    //       ...x,
    //       records: x.items.map(m => ({
    //         ...m,
    //         accountType: m.key,
    //         accountTypeTitle: this.voucherTemplateAccountTypes.filter(
    //           n => n.value === m.key
    //         )[0]?.title,
    //         typeTitle: this.voucherTemplateRecordTypes.filter(
    //           n => n.value === m.type
    //         )[0]?.title,
    //         account: {
    //           name: m.accountName,
    //           fName: m.accountFName,
    //           code: m.accountCode,
    //           fCode: m.accountFCode,
    //           id: m.accountId,
    //           accountId: m.accountId
    //         }
    //       }))
    //     }));
        
    //     this.templatesTotalCount = res.value.totalCount;
    //   } else {
    //     this.setErrorMessage(res.errors[0]?.message);
    //   }

      // await voucherService
      //   .getAllTemplates({ entity: { issuerParts: [0, 1, 2, 3, 4, 5, 6, 7, 8] } })
      //   .then((res) => {
      //     if (res.isSuccess) {
      //       this.templates = res.entities.map((x) => {
      //         return {
      //           ...x,
      //           records: x.items.map((m) => {
      //             return {
      //               ...m,
      //               accountType: m.key,
      //               accountTypeTitle: this.voucherTemplateAccountTypes.filter(
      //                 (n) => n.value === m.key
      //               )[0]?.title,
      //               typeTitle: this.voucherTemplateRecordTypes.filter((n) => n.value === m.type)[0]
      //                 ?.title,
      //               account: {
      //                 name: m.accountName,
      //                 fName: m.accountFName,
      //                 code: m.accountCode,
      //                 fCode: m.accountFCode,
      //                 id: m.accountId,
      //                 accountId: m.accountId
      //               }
      //             }
      //           })
      //         }
      //       })
      //     } else setErrorMessage(res.message)
      //   })
    // },

    // async updateTemplatesPage(newPage) {
    //   this.templatesParams.page = newPage;
    //   await this.getTemplates();
    // },

    // async updateTemplatesPageSize(newSize) {
    //   this.templatesParams.size = newSize;
    //   this.templatesParams.page = 1;
    //   await this.getTemplates();
    // },
  },
  async mounted() {
    // await this.getTemplates()
    // await this.getPLComponent()
    await this.getAccountSettings()
  },
  components: {
    dataTable,
    treeView,
    accountSelector,
    voucherTemplate,
    Formula
  }
}
</script>

<style></style>
