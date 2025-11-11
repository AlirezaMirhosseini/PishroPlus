<template>
  <div>
    <v-row no-gutters class="d-flex justify-center">
      <v-text-field
        density="compact"
        :label="title === null ? $t('account') : title"
        :rules="textFieldRules"
        :disabled="disableComponent"
        @keyup.enter="openDialog"
        @dblclick="openDialog"
        :style="`max-width: ${maxWidth}`"
        :tabindex="$attrs.tabindex"
        :hide-details="$attrs['hide-details']"
        :variant="$attrs.variant || 'outlined'"
        :class="$attrs.class"
        ref="inp_account_fName"
        v-model="inputModel"
      >
        <template #append-inner>
          <!-- <v-btn variant="text" class="pa-0" min-width="30"  > -->
          <v-icon @click="openDialog">mdi-open-in-new</v-icon>
          <!-- </v-btn> -->
        </template>
      </v-text-field>
      <!-- <v-icon v-if="addNewRoute" color="success" class="mr-2 mt-3" v-model:checked="hasrouter" target="_blank"
        icon="mdi mdi-plus" cursor="pointer" @click="this.$router.push('/persons/new')">
      </v-icon> -->
    </v-row>
    <v-dialog close-on-back v-model="showAccountDialog" width="600px" max-width="100%">
      <v-card>
        <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
          <v-icon class="me-2" size="40" color="info" :icon="paperIcon" />
          <p style="font-weight: bold">
            {{ $t('selectAccount') }}
          </p>
          <div class="ms-auto">
            <v-btn
              color="grey"
              icon="mdi mdi-close"
              @click="showAccountDialog = false"
              variant="text"
            />
          </div>
        </v-row>
        <v-card-text>
          <p v-if="!justAccount">{{ $t('selectConnectedMoeinMessage') }}</p>
          <data-table
            id="accounts-dt"
            :hasSearch="true"
            :bigSearch="true"
            :searchLabel="$t('search')"
            :searchItems="['name', 'hierarchyName', 'code', 'fCode']"
            :headers="accountsHeaders"
            :items="accounts"
            :clickableRow="true"
            :selectableRow="true"
            :hasEnter="showAccountDialog"
            :searchText="accountSearchText"
            itemValue="accountId"
            @enterMethod="selectAccount"
            v-model:selectedRow="selectedAccount"
          >
            <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
          </data-table>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn @click="selectAccount" variant="flat" color="info">{{ $t('select') }} </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog
      v-model="showDetailedAccountDialog"
      max-width="75%"
      @afterLeave="cancel"
      :persistent="persistent"
    >
      <v-card>
        <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
          <v-icon class="me-2" color="info" :icon="personIcon" />
          <p style="font-weight: bold">
            {{ $t('selectAccount') }}
          </p>
          <div class="ms-auto">
            <v-btn
              color="grey"
              icon="mdi mdi-close"
              @click="showDetailedAccountDialog = false"
              variant="text"
            />
          </div>
        </v-row>
        <v-card-text>
          <v-btn
            color="info"
            :to="addNewRoute"
            variant="tonal"
            class="add-new-btn"
            v-if="addNewRoute && addNewRoute.length > 0"
            @click="handleAddAccount"
            >{{ $t('add') }}</v-btn
          >
          <!-- <v-btn color="success" variant="outlined" size="large" class="btn" >{{addNewRoute?$t('add'): $t('')}}</v-btn> -->
          <!-- <v-btn color="success" variant="outlined" size="large" class="btn" v-else>{{$t('add')}}</v-btn> -->
          <!-- {{ entity.isDraft ? $t('draft') : $t('finalized') }} -->
          <data-table
            :hasSearch="true"
            :bigSearch="true"
            :searchLabel="$t('search')"
            :searchItems="['name', 'hierarchyName', 'code', 'fCode', 'phoneNumber', 'nationalCode']"
            :headers="effectiveHeaders"
            :items="detailedAccounts"
            :clickableRow="true"
            :selectableRow="true"
            :searchText="searchTxt"
            itemValue="id"
            v-model:selectedRow="selectedDetailedAccount"
            maxHeight="340px"
            :hasEnter="true"
            @enterMethod="selectDetailedAccount"
            id="detailedAccounts-dt"
          >
            <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
            <template v-slot:column_operations="{ entity }">
              <v-row class="d-none d-md-flex justify-center" style="width: 100px">
                <v-tooltip :text="$t('editPerson')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi mdi-square-edit-outline"
                      variant="text"
                      color="info"
                      size="x-small"
                      @click="updateItems"
                    />
                    <!-- @click="$emit('editItemClicked', entity.detailedAccountId)" -->
                  </template>
                </v-tooltip>
              </v-row>
            </template>
          </data-table>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn
            @click.prevent="selectDetailedAccount"
            color="info"
            variant="elevated"
            size="large"
          >
            <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}</v-btn
          >
          <v-btn color="grey darken-2" variant="outlined" size="large" @click="cancel">
            {{ $t('cancel') }}</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import PaperIcon from '../icons/Paper.vue'
import PersonIcon from '../icons/Person.vue'
import accountService from '../../../api/account/accountService'
import dataTable from '../baseComponents/datatable/datatable.vue'
export default {
  components: {
    dataTable
  },
  data() {
    return {
      hasrouter: true,
      paperIcon: markRaw(PaperIcon),
      personIcon: markRaw(PersonIcon),
      showAccountDialog: false,
      selectedAccount: {},
      selectedDetailedAccount: {},
      _selectedDetailedAccount: {},
      _selectedAccount: {},
      detailedAccounts: [],
      accounts: [],
      detailedAccountHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code'
        },
        {
          title: this.$t('name'),
          align: 'center',
          sortable: true,
          key: 'name'
        },
        {
          title: this.$t('cellPhone'),
          align: 'center',
          sortable: true,
          key: 'phoneNumber'
        },
        {
          title: this.$t('nationalCode'),
          align: 'center',
          sortable: true,
          key: 'nationalCode'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          width: '100px',
          key: 'operations'
        }
      ],
      accountsHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          width: '100px',
          key: 'hierarchicalCode'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'hierarchicalName',
          width: '200px'
        }
      ],
      showDetailedAccountDialog: false,
      inputModel: '',
      accountSearchText: ''
    }
  },
  emits: ['update:modelValue', 'accountAdded'],
  props: {
    detailedAccountFamily: {
      default: () => 0
    },
    disableComponent: {
      default: () => false
    },
    title: {
      default: () => null
    },
    persistent: {
      default: () => true
    },
    value: {
      default: {}
    },
    mainHeaders: {
      default: () => []
    },
    modelValue: {
      default: () => {
        return { selectedDetailedAccount: {}, selectedAccount: {} }
      },
      required: true
    },
    textFieldRules: {
      default: () => []
    },
    justAccount: false,
    maxWidth: '100%',
    justDetailedAccount: {
      default: () => false
    },
    justOperationlAccounts: {
      default: () => true
    },
    addNewRoute: { default: () => null }
  },
  computed: {
    effectiveHeaders() {
      return this.mainHeaders.length > 0 ? this.mainHeaders : this.detailedAccountHeaders
    },
    searchTxt() {
      return Object.keys(this.selectedAccount).length > 0 ? '' : this.inputModel
    }
  },
  watch: {
    // selectedDetailedAccount(value) {
      // console.log(value)
    // },
    async showDetailedAccountDialog(val) {
      if (val) {
        await this.getDetailedAccounts()
      } else {
        setTimeout(() => {
          if (this.$refs['inp_account_fName']) this.$refs['inp_account_fName'].focus()
        }, 300)
      }
    },
    async showAccountDialog(val) {
      if (!val & this.justAccount) {
        setTimeout(() => {
          if (this.$refs['inp_account_fName']) this.$refs['inp_account_fName'].focus()
        }, 300)
      }
    },
    modelValue: {
      deep: true,
      handler(val) {
        if (val?.selectedDetailedAccount && Object.keys(val.selectedDetailedAccount).length > 0) {
          this.selectedDetailedAccount = this._selectedDetailedAccount = {
            ...val.selectedDetailedAccount
          }
        }
        if (val?.selectedAccount && Object.keys(val.selectedAccount).length > 0) {
          this.selectedAccount = this._selectedAccount = { ...val.selectedAccount }
        }
        if (!this.justAccount) {
          this.inputModel =
            (this._selectedDetailedAccount?.hierarchyName || '') +
            (this._selectedAccount?.hierarchicalName
              ? `(${this._selectedAccount?.hierarchicalName})`
              : '')
        } else {
          this.inputModel = this._selectedAccount?.hierarchicalName
        }
      }
    },
    inputModel(val) {
      if (!val) {
        this.selectedAccount = {}
        this.selectedDetailedAccount = {}
        this._selectedAccount = {}
        this._selectedDetailedAccount = {}
        this.$emit('update:modelValue', {
          selectedDetailedAccount: {},
          selectedAccount: {}
        })
      }
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    handleAddAccount() {
      this.showDetailedAccountDialog = false
      this.$emit('accountAdded')
    },
    updateItems(id) {
      this.$router.push('/persons/' + id)
      this.showDetailedAccountDialog = false
    },
    updateModel() {
      if (!this.justAccount) {
        this.inputModel =
          (this._selectedDetailedAccount?.hierarchyName || '') +
          (this._selectedAccount?.hierarchicalName ? `(${this._selectedAccount?.hierarchicalName})` : '')
      } else {
        this.inputModel = this._selectedAccount?.hierarchyName
      }
      this.$emit('update:modelValue', {
        selectedDetailedAccount:
          Object.keys(this.selectedDetailedAccount).length > 0 ? this.selectedDetailedAccount : {},
        selectedAccount: Object.keys(this.selectedAccount).length > 0 ? this.selectedAccount : {}
      })
    },
    cancel() {
      this.updateModel()
      this.showDetailedAccountDialog = false
    },
    async openDialog() {
      if (!this.justAccount) {
        await this.getDetailedAccounts()
        this.showDetailedAccountDialog = true
      } else {
        await accountService
          .advancedSearch({
            page: 1,
            size: 1000,
            leafAccounts: !this.justOperationlAccounts || null
          })
          .then((res) => {
            if (res.isSuccess) {
              if (res.value?.result?.length == 0) {
                this.setErrorMessage(res.message)
              }
              let items = res.value?.result.map(item => ({
                ...item,
                hierarchicalCode: item.hierarchyCode,
                hierarchicalName: item.hierarchyName
              }))
              this.accounts = items
              this.showAccountDialog = true
            } else {
              this.setErrorMessage(res.message)
            }
          })
        if (this.selectedAccount.hierarchyName !== this.inputModel) {
          this.accountSearchText = this.inputModel
        }
        await this.$refs['inp_account_fName'].blur()
        this.showAccountDialog = true
      }
    },
    selectAccount() {
      if (this.selectedAccount) {
        this._selectedAccount = { ...this.selectedAccount }
        this._selectedDetailedAccount = { ...this.selectedDetailedAccount }
        this.showAccountDialog = false
        this.showDetailedAccountDialog = false
        this.updateModel()
      }
    },
    async selectDetailedAccount() {
      if (this.selectedDetailedAccount) {
        if (this.justDetailedAccount) {
          this.updateModel()
          this._selectedDetailedAccount = { ...this.selectedDetailedAccount }
          this.showDetailedAccountDialog = false
          return
        }
        console.log(this.selectedDetailedAccount);
        await accountService
          .getById(this.selectedDetailedAccount.id)
          .then((res) => {
            console.log(res);
            if (res.isSuccess) {
              if (res.value?.dependents.length == 0) {
                this.setErrorMessage(this.$t('selectedDetailedHasNoAccount'))
              } else if (res.value?.dependents.length == 1) {
                this.selectedAccount = res.value?.dependents[0]
                this.updateModel()
                this._selectedDetailedAccount = { ...this.selectedDetailedAccount }
                this._selectedAccount = { ...this.selectedAccount }
                this.showDetailedAccountDialog = false
              } else {
                let items = res.value?.dependents.map((a, index) => ({ ...a }))
                this.accounts = items
                this.showAccountDialog = true
              }
            } else {
              this.setErrorMessage(res.message)
            }
          })
      } else this.setErrorMessage(this.$t('noAccountSelected'))
    },
    async getDetailedAccounts() {
      await accountService
        .advancedSearch({
          page: 1,
          size: 1000,
          accountType: 3,
          accountFamily: this.detailedAccountFamily,
          leafAccounts: !this.justOperationlAccounts || null
        })
        .then((res) => {
          if (res.isSuccess) {
            this.detailedAccounts = res.value?.result.map((a, index) => {
              if (a.extraAttributes) {
                let extra = JSON.parse(a.extraAttributes)
                return { ...a, ...extra }
              } else return { ...a }
            })
          } else this.setErrorMessage(res.message)
        })
    }
  }
}
</script>
<style scoped>
.add-new-btn {
  cursor: pointer;
  float: left;
  position: absolute;
  top: 40px;
  left: 40px;
  z-index: 1000;
}
</style>
