<template>
  <!-- <v-dialog persistent v-model="selectAccountDialog" width="400px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="treeViewIcon" />
        <p style="font-weight: bold">
          {{ $t('selectCategory') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="selectAccountDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ $t('detailedAccountsTreeView') }}
          </legend>
          <tree-view v-model="treeViewAccountsShowList" @activeChanged="setActiveAccount" />
        </fieldset>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="saveSelectAccount" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('select') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> -->

  <v-dialog close-on-back persistent v-model="addBank.dialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="bankAccountIcon" />
        <p style="font-weight: bold">
          {{ addBank.isEdit ? $t('editBankAccount') : $t('defineBankAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="handleCloseBankDialog" variant="text" />
        </div>
      </v-row>
      <v-form
        ref="addBankForm"
        @submit.prevent="saveAdd"
        @input="
          () => {
            if (!addBank.hasChanged) addBank.hasChanged = true
          }
        "
      >
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('bankAccountDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('accountCode') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <v-text-field
                  autofocus
                  :disabled="isAutomateBankCode"
                  name="accountCode"
                  type="number"
                  :rules="[
                    (v) => {
                      if (v || isAutomateBankCode) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.code"
                  style="max-width: 100px"
                ></v-text-field>
                <switch-button
                  v-if="!addBank.isEdit"
                  class="mb-5 ms-2"
                  v-model:checked="isAutomateBankCode"
                  :label="isAutomateBankCode ? $t('automatic') : $t('manual')"
                  style="width: 130px"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('category') }}:</v-col>
              <v-col class="pb-0 d-flex" cols="12" sm="9">
                <v-text-field
                  readonly
                  v-model="addBank.form.parentName"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  @focus="() => (showBankGroupDialog = true)"
                  density="compact"
                  :label="$t('category')"
                />
                <group-select
                  :selected="addBank.form.parentId"
                  @save="saveSelectBankParent"
                  v-model:show="showBankGroupDialog"
                  :family="tab"
                  :onlyParents="true"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('bankName') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="bankName"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.name"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('branchName') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="branchName"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.extraAttributes.branch"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('accountNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  type="number"
                  name="bankAccountNumber"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.extraAttributes.bankAccountNumber"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('shabaNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="iBan"
                  required
                  :rules="[
                    (v) => {
                      if (/^\d{24}$/.test(v)) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.extraAttributes.iBan"
                  counter="24"
                  dir="ltr"
                  maxlength="24"
                  suffix="IR"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('cardNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="cardNumber"
                  :rules="[
                    (v) => {
                      if (/^\d{16}$/.test(v)) return true
                      return $t('cardNumberMustBe16Digits')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  counter="16"
                  dir="ltr"
                  maxlength="16"
                  v-model="addBank.form.extraAttributes.cardNumber"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('accountOwner') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="accountOwner"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.extraAttributes.accountOwner"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('accountType') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9">
                <v-select
                  :items="bankAccountTypes"
                  v-model="addBank.form.extraAttributes.accountType"
                  :rules="[(v) => !!v || $t('enterRequiredField')]"
                  variant="outlined"
                  density="compact"
                  item-value="id"
                >
                  <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :disabled="item.raw.disabled"></v-list-item>
                  </template>
                </v-select>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('preCode') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="3"
                ><v-text-field
                  type="number"
                  name="preCode"
                  variant="outlined"
                  density="compact"
                  v-model="addBank.form.extraAttributes.preCode"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  color="info"
                  v-model="addBank.form.isActive"
                  :label="$t('accountIsActive')"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>
          </fieldset>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn type="submit" variant="flat" :prepend-icon="saveIcon" color="info">{{
            $t('save')
          }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog close-on-back persistent v-model="addFund.dialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon
          class="me-2"
          size="40"
          color="info"
          :icon="this.tab == 5 ? cashDeskIcon : fundAccountIcon"
        />
        <p v-if="tab == 5" style="font-weight: bold">
          {{ addFund.isEdit ? $t('editCashBox') : $t('defineCashBox') }}
        </p>
        <p v-else style="font-weight: bold">
          {{ addFund.isEdit ? $t('editFund') : $t('defineFund') }}
        </p>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="handleCloseFundDialog" variant="text" />
        </div>
      </v-row>
      <v-form
        ref="addFundForm"
        @submit.prevent="saveAdd"
        @input="
          () => {
            if (!addFund.hasChanged) addFund.hasChanged = true
          }
        "
      >
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ this.tab == 5 ? $t('cashBoxAccountDetails') : $t('fundAccountDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('accountCode') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <v-text-field
                  autofocus
                  :disabled="isAutomateFundCode"
                  name="accountCode"
                  type="number"
                  :rules="[
                    (v) => {
                      if (v || isAutomateFundCode) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addFund.form.code"
                  style="max-width: 100px"
                ></v-text-field>
                <switch-button
                  v-if="!addFund.isEdit"
                  class="mb-5 ms-2"
                  v-model:checked="isAutomateFundCode"
                  :label="isAutomateFundCode ? $t('automatic') : $t('manual')"
                  style="width: 130px"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('category') }}:</v-col>
              <v-col class="pb-0 d-flex" cols="12" sm="9">
                <v-text-field
                  readonly
                  v-model="addFund.form.parentName"
                  variant="outlined"
                  @focus="() => (showFundGroupDialog = true)"
                  density="compact"
                  :label="$t('category')"
                />
                <group-select
                  :selected="addFund.form.parentId"
                  @save="saveSelectFundParent"
                  v-model:show="showFundGroupDialog"
                  :family="tab"
                  :onlyParents="true"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3"
                >{{ this.tab == 5 ? $t('cashBoxName') : $t('fundName') }}:</v-col
              >
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="accountname"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addFund.form.name"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('description') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="description"
                  variant="outlined"
                  density="compact"
                  v-model="addFund.form.desc"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  color="info"
                  v-model="addFund.form.isActive"
                  :label="$t('accountIsActive')"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>
          </fieldset>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn type="submit" variant="flat" :prepend-icon="saveIcon" color="info">{{
            $t('save')
          }}</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-text class="px-0">
      <v-row no-gutters class="flex-column">
        <v-row class="align-center" no-gutters>
          <!-- <report-output /> -->
        </v-row>
        <v-window :touch="false" v-model="tab" style="width: 100%">
          <v-window-item :value="4">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :hasSearch="true"
                :searchItems="[
                  'fCode',
                  'name',
                  'branch',
                  'bankAccountNumber',
                  'iBan',
                  'cardNumber',
                  'accountOwner',
                  'preCode',
                  'parentName'
                ]"
                @rowDblClick="openEditDialog"
                :clickableRow="true"
                :headers="bankHeaders"
                :items="bankItems"
              >
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      @click="openAddDialog"
                      :prepend-icon="bankAccountIcon"
                      variant="tonal"
                      color="info"
                      >{{ $t('addAccount') }}</v-btn
                    >
                  </v-row>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ bankItems.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_iBan="{ entity }">
                  {{ entity.iBan ? 'IR ' + entity.iBan : '' }}
                </template>
                <template v-slot:column_isActive="{ entity }">
                  <div v-if="entity.isActive" class="d-flex align-center">
                    <v-icon icon="mdi mdi-checkbox-outline" color="success"></v-icon>
                    <p class="text-success ms-2">{{ $t('active') }}</p>
                  </div>
                  <div v-else class="d-flex align-center">
                    <v-icon icon="mdi mdi-checkbox-outline" color="error"></v-icon>
                    <p class="text-error ms-2">{{ $t('inActive') }}</p>
                  </div>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-row class="d-none d-md-flex justify-center" style="width: 100px">
                    <v-tooltip :text="$t('editBank')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi mdi-square-edit-outline"
                          variant="text"
                          color="info"
                          size="x-small"
                          @click="() => openEditDialog(entity)"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="$t('deleteBank')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="deleteIcon"
                          variant="text"
                          color="error"
                          size="x-small"
                          @click="() => deleteItem(entity)"
                        />
                      </template>
                    </v-tooltip>
                  </v-row>
                  <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                    <v-btn size="x-small" icon="mdi-dots-vertical" color="grey" variant="text">
                      <v-icon icon="mdi-dots-vertical" variant="text" />
                      <v-menu activator="parent">
                        <v-list density="compact">
                          <v-list-item
                            density="compact"
                            @click.prevent="openEditDialog(entity)"
                            :title="$t('editBank')"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                            </template>
                          </v-list-item>
                          <v-list-item
                            density="compact"
                            @click.prevent="deleteItem(entity)"
                            :title="$t('deleteBank')"
                          >
                            <template v-slot:prepend>
                              <v-icon :icon="deleteIcon" color="error" />
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </v-row>
                </template>
              </data-table>
            </v-col>
          </v-window-item>
          <v-window-item :value="5">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :hasSearch="true"
                :searchItems="['fCode', 'name', 'desc', 'parentName']"
                @rowDblClick="openEditDialog"
                :clickableRow="true"
                :headers="cashBoxHeaders"
                :items="cashBoxItems"
              >
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      @click="openAddDialog"
                      :prepend-icon="cashDeskIcon"
                      variant="tonal"
                      color="info"
                      >{{ $t('addCashBox') }}</v-btn
                    >
                  </v-row>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ cashBoxItems.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_isActive="{ entity }">
                  <div v-if="entity.isActive" class="d-flex align-center">
                    <v-icon icon="mdi mdi-checkbox-outline" color="success"></v-icon>
                    <p class="text-success ms-2">{{ $t('active') }}</p>
                  </div>
                  <div v-else class="d-flex align-center">
                    <v-icon icon="mdi mdi-checkbox-outline" color="error"></v-icon>
                    <p class="text-error ms-2">{{ $t('inActive') }}</p>
                  </div>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-row class="d-none d-md-flex justify-center" style="width: 100px">
                    <v-tooltip :text="$t('editCashBox')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi mdi-square-edit-outline"
                          variant="text"
                          color="info"
                          size="x-small"
                          @click="() => openEditDialog(entity)"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="$t('deleteCashBox')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="deleteIcon"
                          variant="text"
                          color="error"
                          size="x-small"
                          @click="() => deleteItem(entity)"
                        />
                      </template>
                    </v-tooltip>
                  </v-row>
                  <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                    <v-btn size="x-small" icon="mdi-dots-vertical" color="grey" variant="text">
                      <v-icon icon="mdi-dots-vertical" variant="text" />
                      <v-menu activator="parent">
                        <v-list density="compact">
                          <v-list-item
                            density="compact"
                            @click.prevent="openEditDialog(entity)"
                            :title="$t('editCashBox')"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                            </template>
                          </v-list-item>
                          <v-list-item
                            density="compact"
                            @click.prevent="deleteItem(entity)"
                            :title="$t('deleteCashBox')"
                          >
                            <template v-slot:prepend>
                              <v-icon :icon="deleteIcon" color="error" />
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </v-row>
                </template>
              </data-table>
            </v-col>
          </v-window-item>
          <v-window-item :value="6">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :hasSearch="true"
                :searchItems="['fCode', 'name', 'desc', 'parentName']"
                @rowDblClick="openEditDialog"
                :clickableRow="true"
                :headers="fundHeaders"
                :items="fundItems"
              >
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      @click="openAddDialog"
                      :prepend-icon="fundAccountIcon"
                      variant="tonal"
                      color="info"
                      >{{ $t('addFund') }}</v-btn
                    >
                  </v-row>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ fundItems.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_isActive="{ entity }">
                  <div v-if="entity.isActive" class="d-flex align-center">
                    <v-icon icon="mdi mdi-checkbox-outline" color="success"></v-icon>
                    <p class="text-success ms-2">{{ $t('active') }}</p>
                  </div>
                  <div v-else class="d-flex align-center">
                    <v-icon icon="mdi mdi-checkbox-outline" color="error"></v-icon>
                    <p class="text-error ms-2">{{ $t('inActive') }}</p>
                  </div>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-row class="d-none d-md-flex justify-center" style="width: 100px">
                    <v-tooltip :text="$t('editFund')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi mdi-square-edit-outline"
                          variant="text"
                          color="info"
                          size="x-small"
                          @click="() => openEditDialog(entity)"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="$t('deleteFund')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="deleteIcon"
                          variant="text"
                          color="error"
                          size="x-small"
                          @click="() => deleteItem(entity)"
                        />
                      </template>
                    </v-tooltip>
                  </v-row>
                  <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                    <v-btn size="x-small" icon="mdi-dots-vertical" color="grey" variant="text">
                      <v-icon icon="mdi-dots-vertical" variant="text" />
                      <v-menu activator="parent">
                        <v-list density="compact">
                          <v-list-item
                            density="compact"
                            @click.prevent="() => openEditDialog(entity)"
                            :title="$t('editFund')"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                            </template>
                          </v-list-item>
                          <v-list-item
                            density="compact"
                            @click.prevent="() => deleteItem(entity)"
                            :title="$t('deleteFund')"
                          >
                            <template v-slot:prepend>
                              <v-icon :icon="deleteIcon" color="error" />
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </v-row>
                </template>
              </data-table>
            </v-col>
          </v-window-item>
        </v-window>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../../stores/default'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import treeView from '../../../components/baseComponents/Treeview/treeview.vue'
import switchButton from '../../../components/baseComponents/switchButton.vue'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import detailedAccountService from '../../../../api/detailedAccount/detailedAccountService'
import bankAccountIcon from '../../../components/icons/BankAccount.vue'
import fundAccountIcon from '../../../components/icons/FundAccount.vue'
import cashDeskIcon from '../../../components/icons/AccountingRegisterIncomesToCashDesk.vue'
import saveIcon from '../../../components/icons/Save.vue'
import treeViewIcon from '../../../components/icons/AccountingTreeView.vue'
import folderIcon from '../../../components/icons/Folder.vue'
import openedFolderIcon from '../../../components/icons/Folder-Opened.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import groupSelect from '../../../components/accountsComponents/detailedAccountGroupSelect.vue'

export default {
  data() {
    return {
      showBankGroupDialog: false,
      showFundGroupDialog: false,
      tab: 4,
      bankAccountIcon: markRaw(bankAccountIcon),
      treeViewIcon: markRaw(treeViewIcon),
      cashDeskIcon: markRaw(cashDeskIcon),
      fundAccountIcon: markRaw(fundAccountIcon),
      saveIcon: markRaw(saveIcon),
      folderIcon: markRaw(folderIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      saveIcon: markRaw(saveIcon),
      deleteIcon: markRaw(deleteIcon),
      categories: [],
      treeViewAccountsShowList: [],
      treeViewAccounts: [],
      selectedCategory: null,
      selectAccountDialog: false,
      isAutomateBankCode: true,
      isAutomateFundCode: true,
      bankAccountTypes: [
        { id: '0', title: this.$t('DepositAccount') },
        { id: '1', title: this.$t('SavingAccount') },
        { id: '2', title: this.$t('ChequingAccount') }
      ],
      addBank: {
        dialog: false,
        isEdit: false,
        form: {
          extraAttributes: {},
          isActive: true
        }
      },
      addFund: {
        dialog: false,
        isEdit: false,
        form: {
          extraAttributes: {},
          isActive: true
        }
      },
      bankItems: [],
      cashBoxItems: [],
      fundItems: [],
      bankHeaders: [
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
          key: 'fCode',
          width: '90px'
        },
        {
          title: this.$t('bankName'),
          align: 'center',
          sortable: true,
          key: 'name',
          minWidth: '180px'
        },
        {
          title: this.$t('branchName'),
          align: 'center',
          sortable: true,
          key: 'branch',
          width: '100px'
        },
        {
          title: this.$t('accountNumber'),
          align: 'center',
          sortable: true,
          key: 'bankAccountNumber',
          width: '200px'
        },
        {
          title: this.$t('shabaNumber'),
          align: 'center',
          sortable: true,
          key: 'iBan',
          width: '220px'
        },
        {
          title: this.$t('cardNumber'),
          align: 'center',
          sortable: true,
          key: 'cardNumber',
          width: '180px'
        },
        {
          title: this.$t('accountOwner'),
          align: 'center',
          sortable: true,
          key: 'accountOwner',
          width: '150px'
        },
        {
          title: this.$t('preCode'),
          align: 'center',
          sortable: true,
          key: 'preCode',
          width: '90px'
        },
        {
          title: this.$t('category'),
          align: 'center',
          sortable: true,
          key: 'parentName',
          width: '120px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '100px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ],
      cashBoxHeaders: [
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
          key: 'fCode',
          width: '90px'
        },
        {
          title: this.$t('name'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '200px'
        },
        {
          title: this.$t('category'),
          align: 'center',
          sortable: true,
          key: 'parentName',
          width: '200px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '100px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '200px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ],
      fundHeaders: [
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
          key: 'fCode',
          width: '90px'
        },
        {
          title: this.$t('name'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '200px'
        },
        {
          title: this.$t('category'),
          align: 'center',
          sortable: true,
          key: 'parentName',
          width: '200px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '100px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '200px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ]
    }
  },
  computed: {
    ...mapState(defaultStore, {
      addBankDialog: 'addBankDialog',
      addCashBoxDialog: 'addCashBoxDialog',
    })
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      setAddBankDialog: 'setAddBankDialog',
      setAddCashBoxDialog: 'setAddCashBoxDialog',
    }),
    // async openSelectParentDialog() {
    //   await this.getCategories()
    //   if (this.treeViewAccountsShowList[0]?.children?.length > 0) this.selectAccountDialog = true
    // },
    // setActiveAccount(item) {
    //   this.selectedCategory = item
    //   item.active = true
    // },
    // saveSelectAccount() {
    //   if (this.tab == 4) {
    //     this.addBank.form.parentName = this.selectedCategory.name
    //     this.addBank.form.parentId = this.selectedCategory.id
    //   } else {
    //     this.addFund.form.parentName = this.selectedCategory.name
    //     this.addFund.form.parentId = this.selectedCategory.id
    //   }
    //   this.selectAccountDialog = false
    // },
    saveSelectBankParent(item) {
      if (item) {
        this.addBank.form.parentName = item.fName
        this.addBank.form.parentId = item.id
      }
      this.showBankGroupDialog = false
    },
    saveSelectFundParent(item) {
      if (item) {
        this.addFund.form.parentName = item.fName
        this.addFund.form.parentId = item.id
      }
      this.showFundGroupDialog = false
    },
    handleCloseBankDialog() {
      if (this.addBank.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.addBank.dialog = false
        })
      } else this.addBank.dialog = false
    },
    handleCloseFundDialog() {
      if (this.addFund.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.addFund.dialog = false
        })
      } else this.addFund.dialog = false
    },
    async openAddDialog() {
      if (this.tab == 4) {
        this.isAutomateBankCode = true
        this.addBank = {
          hasChanged: false,
          dialog: true,
          isEdit: false,
          form: {
            extraAttributes: {},
            isActive: true,
            parentId: null,
            parentName: null
          }
        }
      } else {
        this.isAutomateFundCode = true
        this.addFund = {
          hasChanged: false,
          dialog: true,
          isEdit: false,
          form: {
            extraAttributes: {},
            isActive: true,
            parentId: null,
            parentName: null
          }
        }
      }
    },
    async openEditDialog(item) {
      if (this.tab == 4) {
        this.isAutomateBankCode = true
        this.addBank = {
          hasChanged: false,
          dialog: true,
          isEdit: true,
          form: { ...item }
        }
      } else {
        this.isAutomateFundCode = true
        this.addFund = {
          hasChanged: false,
          dialog: true,
          isEdit: true,
          form: { ...item }
        }
      }
    },
    async saveAdd() {
      let bankVal = null
      let fundVal = null
      if (this.tab == 4) bankVal = await this.$refs.addBankForm.validate()
      else fundVal = await this.$refs.addFundForm.validate()
      if ((this.tab == 4 && bankVal.valid) || (this.tab != 4 && fundVal.valid)) {
        let entity = {}
        if (this.tab == 4) {
          entity = { ...this.addBank.form }
          entity.extraAttributes.parentName = this.addBank.form.parentName
        } else {
          entity = { ...this.addFund.form }
          entity.extraAttributes.parentName = this.addFund.form.parentName
        }
        entity.family = this.tab
        entity.subLevelAccountCodeCount = 0
        if ((this.tab == 4 && this.addBank.isEdit) || (this.tab != 4 && this.addFund.isEdit)) {
          await detailedAccountService.update({ entity: entity }).then((res) => {
            if (res.isSuccess) {
              if (this.tab == 4) {
                this.setErrorMessage(this.$t('bankSuccessfullyUpdated'), 'success')
                this.getData(this.tab)
                this.addBank = {
                  hasChanged: false,
                  dialog: false,
                  isEdit: false,
                  form: {
                    extraAttributes: {},
                    isActive: true
                  }
                }
              } else {
                this.setErrorMessage(
                  this.tab == 5
                    ? this.$t('cashBoxSuccessfullyUpdated')
                    : this.$t('fundSuccessfullyUpdated'),
                  'success'
                )
                this.getData(this.tab)
                this.addFund = {
                  hasChanged: false,
                  dialog: false,
                  isEdit: false,
                  form: {
                    extraAttributes: {},
                    isActive: true
                  }
                }
              }
            } else this.setErrorMessage(res.message)
          })
        } else {
          await detailedAccountService.create({ entity: entity }).then((res) => {
            if (res.isSuccess) {
              if (this.tab == 4) {
                this.setErrorMessage(this.$t('bankSuccessfullyAdded'), 'success')
                this.getData(this.tab)
                this.addBank = {
                  hasChanged: false,
                  dialog: false,
                  isEdit: false,
                  form: {
                    extraAttributes: {},
                    isActive: true,
                    parentId: null,
                    parentName: null
                  }
                }
              } else {
                this.setErrorMessage(
                  this.tab == 5
                    ? this.$t('cashBoxSuccessfullyAdded')
                    : this.$t('fundSuccessfullyAdded'),
                  'success'
                )
                this.getData(this.tab)
                this.addFund = {
                  hasChanged: false,
                  dialog: false,
                  isEdit: false,
                  form: {
                    extraAttributes: {},
                    isActive: true,
                    parentId: null,
                    parentName: null
                  }
                }
              }
            } else this.setErrorMessage(res.message)
          })
        }
      }
    },
    deleteItem(item) {
      this.setWarningDialog(
        true,
        this.tab == 4
          ? this.$t('deleteUser')
          : this.tab == 5
          ? this.$t('deleteCashBox')
          : this.$t('deleteFund'),
        this.$t('confirmDeleteMessage'),
        () => this.deleteAccount(item.id)
      )
    },
    async deleteAccount(id) {
      await detailedAccountService.delete(id).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(
            this.tab == 4
              ? this.$t('bankSuccessfullyDeleted')
              : this.tab == 5
              ? this.$t('cashBoxSuccessfullyDeleted')
              : this.$t('fundSuccessfullyDeleted'),
            'success'
          )
          this.closeWarning()
          this.getData(this.tab)
        } else this.setErrorMessage(res.message)
      })
    },
    async setTab(value) {
      await this.getData(value)
    },
    setTabFromRoute(route) {
      switch (route) {
        case 'bank':
          return 4
        case 'cashBox':
          return 5
        case 'fund':
          return 6
        default:
          return 4
      }
    },
    arrangeItems(list) {
      list.forEach((item) => {
        if (this.tab == 4 && this.addBank.form.parentId && item.id == this.addBank.form.parentId)
          this.setActiveAccount(item)
        if (this.tab != 4 && this.addFund.form.parentId && item.id == this.addFund.form.parentId)
          this.setActiveAccount(item)
        item.title = item.name + ' ' + item.fCode
        item.draggable = false
        item.icon = folderIcon
        item.openedIcon = openedFolderIcon
        item.open = item?.children?.length > 0
        if (item?.children?.length > 0) item.children = this.arrangeItems(item.children)
      })
      return list
    },
    async getCategories2() {
      await detailedAccountService.getByFamily(this.tab, 1, 1000, true).then((res) => {
        if (res.isSuccess) {
          this.categories = res.entities
        } else this.setErrorMessage(res.message)
      })
    },
    async getCategories() {
      await detailedAccountService.getAll(1, 1000, this.tab, true).then((res) => {
        if (res.isSuccess) {
          let accounts = [...res.entities]
          this.treeViewAccounts = this.arrangeItems(accounts)
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: false,
              title: '-',
              notClickable: true,
              draggable: false,
              open: true,
              icon: folderIcon,
              openedIcon: openedFolderIcon,
              children: this.treeViewAccounts
            }
          ]
          if (this.treeViewAccounts?.length > 0) {
            if (!this.addBank.form.parentId)
              this.setActiveAccount(this.treeViewAccountsShowList[0].children[0])
          } else this.setErrorMessage(this.$t('noCategoryFound'))
        } else this.setErrorMessage(res.message)
      })
    },
    async getData(tab) {
      await detailedAccountService.getByFamily(tab).then((res) => {
        if (res.isSuccess) {
          if (tab == 4) this.bankItems = res.entities
          else if (tab == 5) this.cashBoxItems = res.entities
          else if (tab == 6) this.fundItems = res.entities
          res.entities.forEach((item, index) => {
            let extra =
              item.extraAttributes == '' ? { parentName: '' } : JSON.parse(item.extraAttributes)
            res.entities[index] = { ...item, ...extra }
            res.entities[index].extraAttributes = extra
            res.entities[index].contexts = [
              {
                label: this.$t('edit'),
                icon: 'mdi mdi-square-edit-outline',
                onClick: () => this.openEditDialog(res.entities[index])
              },
              {
                label: this.$t('delete'),
                icon: 'mdi mdi-delete',
                onClick: () => this.deleteItem(res.entities[index])
              }
            ]
          })
        } else this.setErrorMessage(res.message)
      })
    },
    onkeydown(e) {
      if (this.addBank?.dialog && e.keyCode == 27)
        if (!this.showBankGroupDialog) this.handleCloseBankDialog()
        else if (this.addFund?.dialog && e.keyCode == 27)
          if (!this.showFundGroupDialog) this.handleCloseFundDialog()
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onkeydown)
    this.tab = this.setTabFromRoute(this.currentActiveTab.params.type)
    this.setTab(this.tab)
    if (this.currentActiveTab.params.type === 'bank' && this.addBankDialog) {
      this.addBank.dialog = true
      this.setAddBankDialog(false)
    } else if (this.currentActiveTab.params.type === 'cashBox' && this.addCashBoxDialog) {
      this.tab = 5;
      this.addFund.dialog = true
      this.setAddCashBoxDialog(false)
    }
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },

  watch: {
    isAutomateBankCode(value) {
      if (value == true) this.addBank.form.code = null
    },
    isAutomateFundCode(value) {
      if (value == true) this.addFund.form.code = null
    }
  },
  components: {
    dataTable,
    treeView,
    reportOutput,
    switchButton,
    groupSelect
  }
}
</script>

<style></style>
