<template>
  <data-table :items="items" :headers="formulaHeaders">
    <template v-slot:toolbar>
      <v-row no-gutters align="center">
        <p style="font-weight: bold">{{ $t('formulas') }}</p>
        <v-btn class="mx-2" color="info" variant="tonal" @click="showNewFormulaDialog">
          <v-icon size="small">mdi-plus</v-icon>
          {{ $t('newFormula') }}
        </v-btn>
      </v-row>
    </template>
    <template v-slot:column_row="{ entity }">
      {{ items.indexOf(entity) + 1 }}
    </template>
    <template v-slot:column_formula="{ entity }">
      <p style="direction: ltr">
        {{ entity.formula }}
      </p>
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
              @click="() => showUpdateFormulaDialog(entity)"
            />
          </template>
        </v-tooltip>
        <v-tooltip :text="$t('delete')">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              @click="deleteFormula(entity, index)"
              :icon="deleteIcon"
              variant="text"
              color="error"
              size="small"
            />
          </template>
        </v-tooltip>
      </div>
    </template>
  </data-table>
  <v-dialog v-model="newFormulaDialog" :max-width="formulaEntity.isProMode ? '75%' : '700px'">
    <v-card>
      <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
        <v-icon color="info" class="ml-2" icon="mdi mdi-calculator-variant" />
        <div class="d-flex align-center" style="gap: 12px">
          <p style="font-weight: bold">
            {{ !formulaEntity.id ? $t('createFormula') : $t('updateFormula') }}
          </p>
          <v-btn
            @click="() => (formulaEntity.isProMode = !formulaEntity.isProMode)"
            flat
            color="primary"
            >{{ formulaEntity.isProMode ? $t('goToBasicMode') : $t('goToProMode') }}</v-btn
          >
        </div>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="hideNewFormulaDialog" variant="text" />
        </div>
      </v-row>
      <v-form ref="formulaEntityForm" @submit.prevent="saveFormula">
        <v-card-text>
          <v-row class="align-content-start mb-3" no-gutters>
            <v-text-field
              v-model="formulaEntity.name"
              :label="$t('name')"
              hide-details
              variant="outlined"
              :rules="[(v) => !!v || $t('enterRequiredField')]"
            />
          </v-row>
          <div class="d-flex flex-column flex-md-row" style="gap: 8px">
            <v-row v-if="formulaEntity.isProMode" class="align-content-start">
              <v-col cols="12">
                <v-text-field
                  id="formula"
                  @drop.stop="handleDropAccount"
                  @dragover.prevent
                  v-model="formulaEntity.formula"
                  :label="$t('formula')"
                  variant="outlined"
                  :rules="[
                    (v) => !!v || $t('enterRequiredField'),
                    (v) => validateFormula(v) || $t('invalidFormula')
                  ]"
                  dir="ltr"
                />
                <v-card class="mt-2 pa-3">
                  <p class="font-weight-bold mb-2">{{ $t('formulaGuide') }}</p>
                  <v-divider class="mb-2"></v-divider>
                  <div class="text-body-2">
                    <p class="mb-1">
                      <strong>{{ $t('allowedOperators') }}:</strong>
                    </p>
                    <p class="mb-2">{{ $t('operatorGuide') }}</p>

                    <p class="mb-1">
                      <strong>{{ $t('accountFormat') }}:</strong>
                    </p>
                    <p class="mb-2">{{ $t('accountCodeFormat') }}</p>

                    <p class="mb-1">
                      <strong>{{ $t('accountTypes') }}:</strong>
                    </p>
                    <p class="mb-2">{{ $t('accountTypeGuide') }}</p>

                    <p class="mb-1">
                      <strong>{{ $t('dragDropGuide') }}:</strong>
                    </p>
                    <p class="mb-2">{{ $t('dragDropText') }}</p>

                    <p class="mb-1">
                      <strong>{{ $t('exampleFormula') }}:</strong>
                    </p>
                    <p class="mb-0">[3/1,0] * 1000 + ([4/2/5,0] * [5/1,3]) + 2</p>
                  </div>
                </v-card>
              </v-col>
            </v-row>
            <v-row v-else class="align-content-start d-flex">
              <v-col
                class="d-flex flex-column flex-md-row"
                cols="12"
                style="gap: 8px; height: 100%"
              >
                <v-col
                  class="pishro-border flex-grow-1"
                  @drop.stop="handleDropBasicMode"
                  @dragover.prevent
                  id="formula-accounts"
                >
                  <div
                    v-for="item in formulaEntity.formulaItems"
                    class="my-1 d-flex align-center"
                    :key="item.id"
                    style="width: 100%; gap: 4px"
                  >
                    <div class="flex-grow-1">
                      <v-btn flat variant="outlined" color="primary" style="width: 100%">
                        {{ item.hierarchicalName }}</v-btn
                      >
                    </div>
                    <v-btn
                      density="comfortable"
                      color="error"
                      icon="mdi-close-circle"
                      variant="text"
                      @click="() => handleRemoveAccountFromFormula(item)"
                    ></v-btn>
                  </div>
                </v-col>
                <v-btn
                  class="align-self-center"
                  flat
                  variant="outlined"
                  color="primary"
                  @click="handleMoveAccountToFormula"
                >
                  <<
                </v-btn>
              </v-col>
            </v-row>
            <v-col
              class="pishro-border me-0 mb-4 mb-md-0 pa-2 pt-0 tree-view-accounts-container"
              style="flex-basis: 300px; max-height: 450px"
              id="data"
            >
              <v-tabs
                v-model="formulaEntity.tab"
                class="bg-surface"
                style="margin-inline: -8px; position: sticky; top: 0; z-index: 2"
              >
                <v-tab :value="1">{{ $t('accounts') }}</v-tab>
                <v-tab :value="2">{{ $t('detailedAccounts') }}</v-tab>
              </v-tabs>
              <v-tabs-window v-model="formulaEntity.tab">
                <v-tabs-window-item :value="1">
                  <v-col
                    class="bg-surface"
                    cols="12"
                    style="margin-inline: -8px; width: unset; max-width: unset"
                  >
                    <v-text-field
                      ref="accountSearchText"
                      :label="$t('search') + ' (' + $t('ctrlSlash') + ')'"
                      v-model="searchTreeText"
                      class="pb-0"
                      bg-color="surface"
                      variant="outlined"
                      hide-details
                      density="compact"
                      append-inner-icon="mdi mdi-magnify"
                      v-debounce:500="changeSearchTreeText"
                    />
                  </v-col>
                  <v-col class="tree-view-wrapper">
                    <tree-view
                      v-model="treeViewAccountsShowList"
                      @activeChanged="setActiveAccount"
                      :isLtr="true"
                      disableDragToChangeTree
                    />
                  </v-col>
                </v-tabs-window-item>
                <v-tabs-window-item :value="2">
                  <v-col
                    class="bg-surface"
                    cols="12"
                    style="margin-inline: -8px; width: unset; max-width: unset"
                  >
                    <v-text-field
                      ref="accountSearchText"
                      :label="$t('search') + ' (' + $t('ctrlSlash') + ')'"
                      v-model="searchTreeText"
                      class="pb-0"
                      bg-color="surface"
                      variant="outlined"
                      hide-details
                      density="compact"
                      append-inner-icon="mdi mdi-magnify"
                      v-debounce:500="changeSearchTreeText"
                    />
                  </v-col>
                  <v-col class="tree-view-wrapper">
                    <tree-view
                      v-model="treeViewDetailedAccountsShowList"
                      @activeChanged="setActiveAccount"
                      :isLtr="true"
                      disableDragToChangeTree
                    />
                  </v-col>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>
          </div>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn
            @click="hideNewFormulaDialog"
            color="grey"
            variant="outlined"
            size="large"
            prepend-icon="mdi mdi-close"
            >{{ $t('cancel') }}</v-btn
          >
          <v-btn
            :disabled="
              !formulaEntity.name ||
              (formulaEntity.isProMode && !formulaEntity.formula) ||
              (!formulaEntity.isProMode && formulaEntity.formulaItems.length == 0)
            "
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
</template>

<script>
import { markRaw } from 'vue'
import FormulaService from '../../../api/formula/formulaService'
import dataTable from '../baseComponents/datatable/datatable.vue'
import deleteIcon from '../icons/Delete.vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import utils from '../../../plugins/utils'
import accountService from '../../../api/account/accountService'
import settingService from '../../../api/setting/settingService'
import folderIcon from '../icons/Folder.vue'
import openedFolderIcon from '../icons/Folder-Opened.vue'
import paperIcon from '../icons/Paper.vue'
import folderstarIcon from '../icons/Folder-Star.vue'
import openedFolderStarIcon from '../icons/Folder-Opened-Star.vue'
import treeView from '../baseComponents/Treeview/treeview.vue'

export default {
  name: 'formula',
  data() {
    return {
      deleteIcon: markRaw(deleteIcon),
      items: [],
      formulaHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('name'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '200px'
        },
        // {
        //   title: this.$t('formula'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'formula'
        // },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '40px',
          fixed: true
        }
      ],
      formulaEntity: {
        isEdit: false,
        name: '',
        formula: '',
        isProMode: false,
        tab: 1,
        formulaItems: []
      },
      newFormulaDialog: false,
      accountSetting: [],
      treeViewAccounts: [],
      treeViewAccountsShowList: [],
      lastOpenItems: [],
      accountSetting: [],
      treeViewDetailedAccounts: [],
      treeViewDetailedAccountsShowList: [],
      lastOpenDetailedItems: [],
      searchTreeText: null,
      selectedAccount: null,
      folderIcon: markRaw(folderIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      paperIcon: markRaw(paperIcon),
      folderstarIcon: markRaw(folderstarIcon),
      openedFolderStarIcon: markRaw(openedFolderStarIcon),
      showFormulaGuide: false
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog'
    }),
    async getAllData() {
      const res = await FormulaService.getAll()
      if (res.isSuccess) {
        this.items = res.value.result
      }
    },
    handleDropAccount(event) {
      event.preventDefault()
      const draggedItem = JSON.parse(event.dataTransfer.getData('application/json'))
      if (!draggedItem.id) return

      this.formulaEntity.formula += `[${draggedItem.hierarchicalCode},${draggedItem.type}]`
      const ele = document.getElementById('formula')
      setTimeout(() => {
        ele.focus()
      }, 100)
    },
    handleDropBasicMode(event) {
      event.preventDefault()
      const draggedItem = JSON.parse(event.dataTransfer.getData('application/json'))
      if (!draggedItem.id) return
      this.formulaEntity.formula += `${this.formulaEntity.formulaItems?.length > 0 ? '+' : ''}[${
        draggedItem.hierarchicalCode
      },${draggedItem.type}]`
      this.formulaEntity.formulaItems.push(draggedItem)
    },
    handleMoveAccountToFormula() {
      if (!this.selectedAccount.id) return
      this.formulaEntity.formula += `${this.formulaEntity.formulaItems?.length > 0 ? '+' : ''}[${
        this.selectedAccount.hierarchicalCode
      },${this.selectedAccount.type}]`
      this.formulaEntity.formulaItems.push(this.selectedAccount)
    },
    handleRemoveAccountFromFormula(item) {
      this.formulaEntity.formulaItems.splice(this.formulaEntity.formulaItems.indexOf(item), 1)
    },
    async showNewFormulaDialog() {
      this.formulaEntity = {
        isEdit: false,
        name: '',
        formula: '',
        formulaItems: [],
        isProMode: false,
        tab: 1
      }
      this.newFormulaDialog = true
      await this.getAccountSetting()
      await this.getAllAccounts()
      await this.getAllDetailedAccounts()
    },
    async showUpdateFormulaDialog(item) {
      this.formulaEntity = { ...item, isEdit: true, isProMode: false, formulaItems: [], tab: 1 }
      this.newFormulaDialog = true
      await this.getAccountSetting()
      await this.getAllAccounts()
      await this.getAllDetailedAccounts()
    },
    hideNewFormulaDialog() {
      this.$refs.formulaEntityForm.reset()
      this.newFormulaDialog = false
    },
    async saveFormula() {
      if (!(await this.$refs.formulaEntityForm.validate()).valid) return

      let request = {
        formula: this.formulaEntity.isProMode
          ? this.formulaEntity.formula.replace(/\s+/g, '')
          : this.formulaEntity.formulaItems
              ?.map((item) => `[${item.hierarchicalCode},0]`)
              .join('+'),
        name: this.formulaEntity.name
      }

      if (this.formulaEntity.isEdit) {
        request.id = this.formulaEntity.id
        const res = await FormulaService.update(request)
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('formulaUpdatedSuccessfully'), 'success')
          this.newFormulaDialog = false
          this.getAllData()
        }
      } else {
        const res = await FormulaService.create(request)
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('formulaCreatedSuccessfully'), 'success')
          this.newFormulaDialog = false
          this.getAllData()
        }
      }
    },
    async deleteFormula(entity, index) {
      this.setWarningDialog(
        true,
        this.$t('deleteRow'),
        this.$t('confirmDeleteMessage'),
        async () => {
          const res = await FormulaService.delete(entity.id)
          if (res?.status == 204) {
            this.setErrorMessage(this.$t('formulaDeletedSuccessfully'), 'success')
            this.getAllData()
          }
        }
      )
    },
    setActiveAccount(item) {
      item.active = true
      this.selectedAccount = item
      this.selectedRow = null
      document.getElementById('data').scrollIntoView()
    },
    arrangeItems(list, type, isSearch) {
      let showAccountCode =
        this.accountSetting.filter((a) => a.key == 'ShowAccountCodeInTreeList')[0]?.value == '1' ||
        false
      let generalAccountLevel =
        parseInt(
          this.accountSetting.filter((a) => a.key == 'default_level_of_general_accounts')[0]?.value
        ) || 1

      if (this.formulaEntity.isEdit && !isSearch && this.formulaEntity.formula) {
        const formulaMatches = this.formulaEntity.formula.match(/\[([^,]+),\d+\]/g) || []
        
        // Extract both code and type, and filter by matching type
        const accountCodes = formulaMatches
          .map(match => {
            const [code, accountType] = match.slice(1, -1).split(',')
            return { code, type: parseInt(accountType) }
          })
          .filter(item => item.type === type)
          .map(item => item.code)
        
        list.forEach((item) => {
          if (
            accountCodes.includes(item.hierarchicalCode) &&
            !this.formulaEntity.formulaItems.some((fi) => fi.id === item.id)
          ) {
            this.formulaEntity.formulaItems.push(item)
          }

          item.active = this.selectedAccount
            ? item.id == this.selectedAccount.id
              ? true
              : false
            : false
          item.title = `${item.name} ${showAccountCode ? item.hierarchicalCode : ''}`
          item.type = type
          item.draggable = true
          item.canDropOutside = true
          item.icon =
            item.maximumChildCodeLength > 0
              ? item.levelType === generalAccountLevel
                ? this.folderstarIcon
                : this.folderIcon
              : this.paperIcon
          item.openedIcon =
            item.levelType === generalAccountLevel
              ? this.openedFolderStarIcon
              : this.openedFolderIcon
          item.open = isSearch ? item?.children?.length > 0 : this.lastOpenItems.includes(item.id)

          if (item?.children?.length > 0) {
            item.children = this.arrangeItems(item.children, type, isSearch)
          }

          if (this.selectedAccount && item.id == this.selectedAccount.id) {
            this.selectedAccount = item
          }
        })
      } else {
        list.forEach((item) => {
          item.active = this.selectedAccount
            ? item.id == this.selectedAccount.id
              ? true
              : false
            : false
          item.title = `${item.name} ${showAccountCode ? item.hierarchicalCode : ''}`
          item.type = type
          item.draggable = true
          item.canDropOutside = true
          item.icon =
            item.maximumChildCodeLength > 0
              ? item.levelType === generalAccountLevel
                ? this.folderstarIcon
                : this.folderIcon
              : this.paperIcon
          item.openedIcon =
            item.levelType === generalAccountLevel
              ? this.openedFolderStarIcon
              : this.openedFolderIcon
          item.open = isSearch ? item?.children?.length > 0 : this.lastOpenItems.includes(item.id)

          if (item?.children?.length > 0) {
            item.children = this.arrangeItems(item.children, type, isSearch)
          }

          if (this.selectedAccount && item.id == this.selectedAccount.id) {
            this.selectedAccount = item
          }
        })
      }
      return list
    },
    async getAllAccounts() {
      var lst = utils.recursiveSearch(this.treeViewAccounts, 'open', true, 'children', true, null)
      this.lastOpenItems = lst.map((x) => x.id)
      const params = {
        accountType: 0
      }
      await accountService.getAll(params).then((resp) => {
        if (resp.isSuccess) {
          this.treeViewAccounts = this.arrangeItems([...resp.value], 0)
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: !this.selectedAccount,
              title: this.$t('accountingTreeView'),
              draggable: false,
              open: true,
              icon: this.folderIcon,
              openedIcon: this.openedFolderIcon,
              children: this.treeViewAccounts
            }
          ]
          if (this.selectedAccount) this.setActiveAccount(this.selectedAccount)
          else {
            this.selectedAccount = this.treeViewAccountsShowList[0]
          }
        } else {
          this.setErrorMessage(resp.errors[0].message)
        }
      })
    },
    async getAllDetailedAccounts() {
      var lst = utils.recursiveSearch(
        this.treeViewDetailedAccounts,
        'open',
        true,
        'children',
        true,
        null
      )
      this.lastOpenDetailedItems = lst.map((x) => x.id)
      const params = {
        accountType: 3
      }
      await accountService.getAll(params).then((resp) => {
        if (resp.isSuccess) {
          this.treeViewDetailedAccounts = this.arrangeItems([...resp.value], 3)
          this.treeViewDetailedAccountsShowList = [
            {
              id: null,
              active: !this.selectedAccount,
              title: this.$t('detailedAccountsTreeView'),
              draggable: false,
              open: true,
              icon: this.folderIcon,
              openedIcon: this.openedFolderIcon,
              children: this.treeViewDetailedAccounts
            }
          ]
          if (this.selectedAccount) this.setActiveAccount(this.selectedAccount)
          else {
            this.selectedAccount = this.treeViewDetailedAccountsShowList[0]
          }
        } else {
          this.setErrorMessage(resp.errors[0].message)
        }
      })
    },
    async changeSearchTreeText(text) {
      await this.searchAccounts(text)
    },
    async searchAccounts(paramText) {
      var lst = utils.recursiveSearch(this.treeViewAccounts, 'open', true, 'children', true, null)
      this.lastOpenItems = lst.map((x) => x.id)
      const params = {
        accountType: null,
        accountFamily: null,
        leafAccounts: null,
        text: paramText,
        id: null
      }
      await accountService.search(params).then((resp) => {
        if (resp.isSuccess) {
          this.treeViewAccounts = this.arrangeItems(
            [...resp.value],
            0,
            paramText?.trim() != '' ? true : false
          )

          this.treeViewAccountsShowList = [
            {
              id: null,
              active: this.selectedAccount ? false : true,
              title: this.$t('accountingTreeView'),
              draggable: false,
              open: true,
              icon: folderIcon,
              openedIcon: openedFolderIcon,
              children: this.treeViewAccounts
            }
          ]
          if (this.selectedAccount) this.setActiveAccount(this.selectedAccount)
          else {
            this.selectedAccount = this.treeViewAccountsShowList[0]
            this.selectedRow = null
          }
        } else this.setErrorMessage(resp.errors[0].message)
      })
    },
    async getAccountSetting() {
      const params = {
        page: 1,
        size: 100,
        settingModule: 0
      }
      await settingService.getSetting(params).then((resp) => {
        this.accountSetting = resp.value.result
      })
    },
    validateFormula(formula) {
      if (!formula) return true

      // Check for consecutive operators
      if (/[\+\-\*\/]{2,}/.test(formula)) {
        return this.$t('consecutiveOperatorsError')
      }

      // Check if formula ends with an operator
      if (/[\+\-\*\/]$/.test(formula.trim())) {
        return this.$t('formulaEndsWithOperatorError')
      }

      // Check for invalid characters
      const validCharsPattern = /^[\[\]\d\/,\s\+\-\*\/\(\)]+$/
      if (!validCharsPattern.test(formula)) {
        return this.$t('invalidCharactersError')
      }

      // Check parentheses balance
      const checkParentheses = (str) => {
        let count = 0
        for (let char of str) {
          if (char === '(') count++
          if (char === ')') count--
          if (count < 0) return false
        }
        return count === 0
      }

      if (!checkParentheses(formula)) {
        return this.$t('unbalancedParenthesesError')
      }

      // Check if accounts exist in tree
      const checkAccountExists = (code, type) => {
        // Recursive function to search through account tree
        const findAccount = (accounts) => {
          for (const account of accounts) {
            if (account.hierarchicalCode === code) {
              return true
            }
            if (account.children?.length > 0) {
              if (findAccount(account.children)) {
                return true
              }
            }
          }
          return false
        }
        
        // Check in appropriate tree based on account type
        return type === 0 
          ? findAccount(this.treeViewAccounts)
          : findAccount(this.treeViewDetailedAccounts)
      }

      // Extract and validate accounts from formula
      const accounts = formula.match(/\[\d+(?:\/\d+)*,(?:0|3)\]/g) || []
      for (const account of accounts) {
        const [code, type] = account.slice(1, -1).split(',')
        if (!checkAccountExists(code, parseInt(type))) {
          return this.$t('accountNotFoundError', { code })
        }
      }

      // Split formula by operators outside brackets
      const splitFormulaByOperators = (formula) => {
        let parts = []
        let current = ''
        let inBracket = 0

        for (let char of formula) {
          if (char === '[') inBracket++
          if (char === ']') inBracket--

          if (inBracket === 0 && /[\+\-\*\/]/.test(char)) {
            if (current) parts.push(current.trim())
            current = ''
          } else {
            current += char
          }
        }
        if (current) parts.push(current.trim())
        return parts
      }

      // Validate each part
      const accountPattern = /^\[\d+(?:\/\d+)*,(?:0|3)\]$/
      const numberPattern = /^\d+$/

      const parts = splitFormulaByOperators(formula.replace(/\s+/g, ''))

      if (!formula.trim().startsWith('[') && !formula.trim().startsWith('(')) {
        return this.$t('formulaMustStartWithAccount')
      }

      for (let part of parts) {
        const cleanPart = part.replace(/[()]/g, '').trim()
        if (!accountPattern.test(cleanPart) && !numberPattern.test(cleanPart)) {
          return this.$t('invalidFormulaStructureError')
        }
      }

      return true
    }
  },
  async mounted() {
    await this.getAllData()
  },
  components: {
    dataTable,
    treeView
  }
}
</script>

<style scoped>
.tree-view-accounts-container {
  direction: rtl;
  flex-direction: column;
  overflow: auto;
  max-width: 300px !important;
}

.v-locale--is-rtl .tree-view-accounts-container {
  direction: ltr;
}

.tree-view-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}

#formula-accounts {
  max-width: 300px;
  max-height: 450px;
  min-height: 450px;
  overflow: auto;
}

@media (max-width: 959px) {
  .tree-view-accounts-container {
    max-height: 400px !important;
    margin-bottom: 1rem;
    max-width: 100% !important;
  }
  #formula-accounts {
    max-width: 100%;
  }
}

.tree-view-wrapper::-webkit-scrollbar,
.data-table-container::-webkit-scrollbar {
  width: 8px;
}

.tree-view-wrapper::-webkit-scrollbar-track,
.data-table-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.tree-view-wrapper::-webkit-scrollbar-thumb,
.data-table-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

.tree-view-wrapper::-webkit-scrollbar-thumb:hover,
.data-table-container::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.leaf-account {
  opacity: 0.6;
  cursor: not-allowed !important;
}

#formula-accounts .v-btn {
  white-space: normal !important;
  height: auto !important;
  min-height: 40px !important;
}

#formula-accounts .v-btn__content {
  white-space: normal;
  text-align: start;
  width: 100%;
  padding: 8px;
}
</style>
