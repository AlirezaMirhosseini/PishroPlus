<template>
  <v-dialog
    persistent
    close-on-back
    v-model="transferAccountDialog.show"
    width="600px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-cursor-move" />
        <p style="font-weight: bold">
          {{ $t('transferAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="transferAccountDialog.show = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="transferAccountRef" @submit.prevent="saveTransfer">
        <v-card-text>
          <v-row>
            <v-col class="d-flex align-center" cols="12" sm="3">
              <p>{{ $t('destinationAccount') + ' :' }}</p>
            </v-col>
            <v-col cols="12" sm="9">
              <v-text-field
                readonly
                hide-details
                @focus="openSelectDestDialog"
                :placeholder="$t('select')"
                :rules="[
                  (v) => {
                    if (v) return true
                    return $t('enterRequiredField')
                  }
                ]"
                variant="outlined"
                density="compact"
                v-model="transferAccountDialog.destAccount.hierarchicalName"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex align-center" cols="12">
              <v-checkbox
                v-model="transferAccountDialog.generateNewCode"
                :label="$t('automaticNewCode')"
                hide-details
                density="compact"
              ></v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn type="submit" :prepend-icon="saveIcon" variant="flat" color="info"
            >{{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog
    persistent
    close-on-back
    v-model="copyAccountDialog.show"
    width="600px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-content-copy" />
        <p style="font-weight: bold">
          {{ $t('copyAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="copyAccountDialog.show = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="copyAccountRef" @submit.prevent="saveCopy">
        <v-card-text>
          <v-row>
            <v-col class="d-flex align-center" cols="12" sm="3">
              <p>{{ $t('destinationAccount') + ' :' }}</p>
            </v-col>
            <v-col cols="12" sm="9">
              <v-text-field
                readonly
                hide-details
                clearable
                @focus="openSelectDestDialog"
                :placeholder="$t('select')"
                :rules="[
                  (v) => {
                    if (v) return true
                    return $t('enterRequiredField')
                  }
                ]"
                variant="outlined"
                density="compact"
                v-model="copyAccountDialog.destAccount.hierarchicalName"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex align-center" cols="12" sm="3">{{ $t('newName') + ' :' }} </v-col>
            <v-col cols="12" sm="9">
              <v-text-field
                hide-details
                name="newName"
                :rules="[
                  (v) => {
                    if (v) return true
                    return $t('enterRequiredField')
                  }
                ]"
                variant="outlined"
                density="compact"
                v-model="copyAccountDialog.newName"
                style="max-width: 300px"
              ></v-text-field>
            </v-col>
            <v-col class="d-flex align-center" cols="12">
              <v-checkbox
                v-model="copyAccountDialog.generateNewCode"
                :label="$t('automaticNewCode')"
                hide-details
                density="compact"
              ></v-checkbox>
            </v-col>
            <v-col
              v-if="!copyAccountDialog.generateNewCode"
              class="d-flex align-center"
              cols="12"
              sm="3"
              >{{ $t('newCode') + ' :' }}
            </v-col>
            <v-col v-if="!copyAccountDialog.generateNewCode" cols="12" sm="9">
              <v-text-field
                hide-details
                :rules="[
                  (v) => {
                    if (v || copyAccountDialog.generateNewCode) return true
                    if (!v || v.toString().trim() === '') {
                      return $t('enterRequiredField')
                    }
                    return true
                  }
                ]"
                name="code"
                type="number"
                variant="outlined"
                density="compact"
                v-model="copyAccountDialog.newCode"
                style="max-width: 100px"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn type="submit" :prepend-icon="saveIcon" variant="flat" color="info"
            >{{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-dialog>

  <v-dialog
    persistent
    close-on-back
    v-model="destAccountDialog.show"
    width="600px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-target" />
        <p style="font-weight: bold">
          {{ $t('selectDestAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="destAccountDialog.show = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="px-1">
        <v-text-field
          class="mb-4"
          hide-details
          variant="outlined"
          name="search"
          autofocus
          density="compact"
          :label="$t('search')"
          append-inner-icon="mdi mdi-magnify"
          v-model="searchDestAccountText"
          v-debounce:300="changeDestSearchText"
        />
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ $t('accountingTreeView') }}
          </legend>
          <tree-view
            v-model="destAccountDialog.accounts"
            @activeChanged="setActiveDestAccount"
            :hasEnter="destAccountDialog.show"
            @enterMethod="saveSelectDestAccount"
          />
        </fieldset>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="saveSelectDestAccount" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('select') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog close-on-back v-model="moreInfoDialog.dialog" width="800px" max-width="100%">
    <v-card class="pb-3">
      <v-row class="align-center px-2 dialog-topbar" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="infoIcon" />
        <div>
          <p style="font-weight: bold">
            {{ $t('accountDetails') }}
          </p>
          <p class="text-grey pishro-caption">
            {{ $t('accountParticularity') }} {{ selectedRow.title }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="moreInfoDialog.dialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-row class="pa-0 ma-4 pishro-border">
        <v-col class="first-col" cols="12" sm="6"
          >{{ $t('accountCode') }}:
          {{ moreInfoDialog.model.code }}
        </v-col>
        <v-col class="second-col" cols="12" sm="6"
          >{{ $t('fullCode') }}:
          {{ moreInfoDialog.model.hierarchyCodes }}
        </v-col>
        <v-col class="first-col" cols="12" sm="6"
          >{{ $t('accountName') }}: {{ moreInfoDialog.model.name }}</v-col
        >
        <v-col class="second-col" cols="12" sm="6"
          >{{ $t('fullName') }}: {{ moreInfoDialog.model.hierarchyNames }}</v-col
        >
        <v-col class="first-col" cols="12" sm="6"
          >{{ $t('description') }}: {{ moreInfoDialog.model.description }}</v-col
        >
        <v-col class="second-col" cols="12" sm="6"
          >{{ $t('accountDigitNumbers') }}:
          {{ moreInfoDialog.model.maximumChildCodeLength }}</v-col
        >
        <v-col class="first-col" cols="12" sm="6"
          >{{ $t('accountOpeningDate') }}:
          {{ showDate(moreInfoDialog.model.establishDateTime) }}</v-col
        >
        <v-col class="second-col" cols="12" sm="6"
          >{{ $t('separator') }}: "{{
            accountSetting.filter((a) => a.key == 'AccountCodeSeparator')[0].value
          }}"</v-col
        >
        <v-col class="first-col" cols="12" sm="6"
          >{{ $t('debtAmount') }}: {{ moreInfoDialog.model.debitAmount?.toLocaleString() }}</v-col
        >
        <v-col class="second-col" cols="12" sm="6"
          >{{ $t('creditAmount') }}:
          {{ moreInfoDialog.model.creditAmount?.toLocaleString() }}</v-col
        >
        <v-col class="first-col" cols="12" sm="6"
          >{{ $t('accountIsActive') }}؟ :
          {{ moreInfoDialog.model.isActive ? $t('yes') : $t('no') }}</v-col
        >
        <v-col class="second-col" cols="12" sm="6"
          >{{ $t('accountType') }}: {{ showAccountType(moreInfoDialog.model?.type) }}</v-col
        >
        <v-col cols="12" sm="6"
          >{{ $t('accountFamily') }}: {{ showFamily(moreInfoDialog.model?.family) }}</v-col
        >
      </v-row>
    </v-card>
  </v-dialog>

  <v-dialog
    persistent
    v-model="createAccountDialog.dialog"
    close-on-back
    width="800px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="addAccountIcon" />
        <div>
          <p style="font-weight: bold">
            {{
              createAccountDialog.isEdit ? $t('edit') + ' ' + $t('account') : $t('createAccount')
            }}
          </p>
          <p v-if="!createAccountDialog.isEdit" class="text-grey pishro-caption">
            {{ $t('createAccountInSubset') }} {{ selectedAccount.title }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            v-if="!createAccountDialog.isEdit"
            @click="createAccount(true)"
            :icon="savePlusIcon"
            variant="text"
          />
          <v-btn color="grey" icon="mdi mdi-close" @click="handleCloseEditDialog" variant="text" />
        </div>
      </v-row>
      <custom-form
        @submit="submitDialog"
        :focusoutKeyCode="9"
        @input="
          () => {
            if (!createAccountDialog.hasChanged) createAccountDialog.hasChanged = true
          }
        "
      >
        <v-card-text>
          <fieldset class="pishro-border">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('accountDetails') }}
            </legend>
            <v-row>
              <v-col v-if="selectedAccount.code" cols="12">
                <p>
                  {{ $t('parentAccountCode') }}: {{
                    createAccountDialog.isEdit
                      ? createAccountDialog.form.parentCode
                      : selectedAccount.code
                  }}
                </p>
              </v-col>
              <v-col v-if="selectedAccount.maximumChildCodeLength" class="d-flex" cols="12">
                <p class="my-auto me-4">
                  {{ $t('accountDigitNumbers') }}: {{ selectedAccount.maximumChildCodeLength }}
                </p>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('detailedCode') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <v-text-field
                  autofocus
                  :disabled="isAutomateCode"
                  name="code"
                  type="number"
                  :rules="[
                    (v) => {
                      if (v || isAutomateCode) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="createAccountDialog.form.code"
                  style="max-width: 100px"
                ></v-text-field>
                <switch-button
                  v-if="!createAccountDialog.isEdit"
                  class="mb-5 ms-2"
                  v-model:checked="isAutomateCode"
                  :label="isAutomateCode ? $t('automatic') : $t('manual')"
                  style="width: 130px"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('detailedName') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="name"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  autofocus
                  variant="outlined"
                  density="compact"
                  v-model="createAccountDialog.form.name"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('description') }}:</v-col>
              <v-col cols="12" sm="9"
                ><v-text-field
                  name="description"
                  variant="outlined"
                  density="compact"
                  hide-details
                  v-model="createAccountDialog.form.desc"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('subGroupStatus') }}:</v-col>
              <v-col cols="12" sm="9"
                ><v-select
                  ref="selectStatus"
                  variant="outlined"
                  density="compact"
                  hide-details
                  v-model="createAccountDialog.form.maximumChildCodeLength"
                  item-title="title"
                  item-value="id"
                  :items="subGroupStatuses"
                  style="max-width: 300px"
                ></v-select>
              </v-col>
              <v-col cols="12" sm="6" class="d-flex flex-column justify-start gap-2">
                <v-checkbox
                  color="info"
                  v-model="createAccountDialog.form.useCustomSeparator"
                  hide-details
                  :label="$t('insert') + ' ' + $t('separator')"
                  density="compact"
                />
                <v-text-field
                  name="separator"
                  variant="outlined"
                  density="compact"
                  hide-details
                  v-model="createAccountDialog.form.separator"
                  :disabled="!createAccountDialog.form.useCustomSeparator"
                  maxlength="1"
                  class="flex-grow-0"
                  style="width: 100px;"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  color="info"
                  v-model="createAccountDialog.form.isActive"
                  :label="$t('accountIsActive')"
                  hide-details
                  density="compact"
                />
              </v-col>
            </v-row>
          </fieldset>
          <fieldset class="pishro-border mt-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('accountRestriction') }}
            </legend>
            <v-row>
              <v-col class="d-flex pa-0" cols="12" md="6">
                <v-col class="my-auto" cols="5">{{ $t('debtAmount') }}:</v-col>
                <v-col cols="7"
                  ><v-text-field
                    name="debt"
                    v-maska:[debtMaskOptions]
                    v-maska="createAccountDialog.form.debtAmountMasked"
                    v-model="createAccountDialog.form.debtAmountMasked.masked"
                    variant="outlined"
                    density="compact"
                    suffix="ریال"
                    hide-details
                  ></v-text-field
                ></v-col>
              </v-col>
              <v-col class="d-flex pa-0" cols="12" md="6">
                <v-col class="my-auto" cols="5">{{ $t('creditAmount') }}:</v-col>
                <v-col cols="7"
                  ><v-text-field
                    name="credit"
                    v-maska:[creditMaskOptions]
                    v-maska="createAccountDialog.form.creditAmountMasked"
                    v-model="createAccountDialog.form.creditAmountMasked.masked"
                    variant="outlined"
                    density="compact"
                    suffix="ریال"
                    hide-details
                  ></v-text-field
                ></v-col>
              </v-col>
              <v-col class="d-flex pa-0" cols="12" md="6">
                <v-col class="my-auto" cols="5">{{ $t('accountNature') }}:</v-col>
                <v-col cols="7"
                  ><v-select
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="createAccountDialog.form.nature"
                    item-title="title"
                    item-value="id"
                    :items="accountNatures"
                  ></v-select
                ></v-col>
              </v-col>
              <v-col class="d-flex pa-0" cols="12" md="6">
                <v-col class="my-auto" cols="5">{{ $t('accountCharacter') }}:</v-col>
                <v-col cols="7"
                  ><v-select
                    variant="outlined"
                    density="compact"
                    hide-details
                    v-model="createAccountDialog.form.family"
                    item-title="title"
                    item-value="id"
                    :disabled="!createAccountDialog.form.isFamilyEditable"
                    :items="accountFamilies"
                  ></v-select
                ></v-col>
              </v-col>
            </v-row>
          </fieldset>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn type="submit" :prepend-icon="saveIcon" variant="flat" color="info"
            >{{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </custom-form>
    </v-card>
  </v-dialog>

  <v-card>
    <v-card-text>
      <!-- <reportOutput></reportOutput> -->
      <v-row no-gutters class="flex-column-reverse flex-md-row">
        <v-col class="pishro-border flex-grow-1 pa-2" cols="12" md="8" id="data" style="min-width: 350px">
          <div class="data-table-container">
            <data-table
              :headers="datatableHeader"
              :items="selectedAccount?.children"
              @rowDblClick="openEdit"
              :clickableRow="true"
              :selectableRow="true"
              :arrowCondition="!(copyAccountDialog?.show || transferAccountDialog?.show || createAccountDialog?.dialog)"
              v-model:selectedRow="selectedRow"
            >
              <template v-slot:toolbar>
                <v-row style="gap: 8px" no-gutters>
                  <v-btn
                    v-if="selectedAccount"
                    @click="openAddAccountDialog()"
                    variant="tonal"
                    color="primary"
                    :prepend-icon="addAccountIcon"
                    >{{ $t('addAccount') }}</v-btn
                  >
                  <v-btn
                    v-if="selectedRow"
                    @click="openEdit(selectedRow)"
                    variant="tonal"
                    color="info"
                    prepend-icon="mdi mdi-square-edit-outline"
                    >{{ $t('edit') }}</v-btn
                  >
                  <v-btn
                    v-if="selectedRow"
                    @click="openTransfer(selectedRow)"
                    variant="tonal"
                    color="warning"
                    prepend-icon="mdi mdi-cursor-move"
                    >{{ $t('transferAccount') }}</v-btn
                  >
                  <v-btn
                    v-if="selectedRow"
                    @click="openCopy(selectedRow)"
                    variant="tonal"
                    color="secondary"
                    prepend-icon="mdi mdi-content-copy"
                    >{{ $t('copyAccount') }}</v-btn
                  >
                </v-row>
              </template>
              <template v-slot:column_maximumChildCodeLength="{ entity }">
                <p>
                  {{ showStatus(entity.maximumChildCodeLength) }}
                </p>
              </template>
              <template v-slot:column_isActive="{ entity }">
                <v-icon
                  :icon="entity.isActive ? 'mdi mdi-check' : 'mdi mdi-close'"
                  :color="entity.isActive ? 'success' : 'error'"
                />
              </template>
              <template v-slot:column_delete="{ entity }">
                <v-row class="d-none d-md-flex justify-center" style="width: 100px">
                  <v-tooltip :text="$t('moreInfo')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi mdi-information-variant-circle-outline"
                        variant="text"
                        color="info"
                        size="x-small"
                        @click="() => openMoreInfo(entity)"
                      />
                    </template>
                  </v-tooltip>

                  <v-tooltip :text="$t('delete')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :icon="deleteIcon"
                        variant="text"
                        color="error"
                        size="x-small"
                        @click="openDeleteDialog(entity)"
                      />
                    </template>
                  </v-tooltip>
                </v-row>
                <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                  <v-btn size="x-small" icon="mdi-dots-vertical" variant="text">
                    <v-icon icon="mdi-dots-vertical" variant="text" />
                    <v-menu activator="parent">
                      <v-list density="compact">
                        <v-list-item
                          density="compact"
                          @click.prevent="() => openMoreInfo(entity)"
                          :title="$t('moreInfo')"
                        >
                          <template v-slot:prepend>
                            <v-icon icon="mdi mdi-information-variant-circle-outline" color="info" />
                          </template>
                        </v-list-item>
                        <v-list-item
                          density="compact"
                          @click.prevent="() => openDeleteDialog(entity)"
                          :title="$t('delete')"
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
          </div>
        </v-col>
        <v-col
          class="pishro-border flex-grow-1 me-0 mb-4 mb-md-0 pa-2 pt-0 tree-view-accounts-container"
          cols="12"
          md="4"
          style="flex-basis: 300px; max-height: 85vh"
        >
          <v-col
            class="bg-surface"
            cols="12"
            style="
              margin-inline: -8px;
              width: unset;
              max-width: unset;
              position: sticky;
              top: 0;
              z-index: 2;
            "
          >
            <v-text-field
              :label="$t('search') + ' (' + $t('ctrlSlash') + ')'"
              ref="accountSearchText"
              v-model="searchTreeText"
              class="my-2"
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
            />
          </v-col>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import detailedAccountService from '../../../../api/detailedAccount/detailedAccountService'
import addAccountIcon from '../../../components/icons/AccountingAddAccount.vue'
import { markRaw } from 'vue'
import treeView from '../../../components/baseComponents/Treeview/treeview.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import switchButton from '../../../components/baseComponents/switchButton.vue'
import customForm from '../../../components/baseComponents/customForm.vue'
import folderIcon from '../../../components/icons/Folder.vue'
import openedFolderIcon from '../../../components/icons/Folder-Opened.vue'
import paperIcon from '../../../components/icons/Paper.vue'
import folderstarIcon from '../../../components/icons/Folder-Star.vue'
import saveIcon from '../../../components/icons/Save.vue'
import savePlusIcon from '../../../components/icons/SavePlus.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import infoIcon from '../../../components/icons/Info.vue'
import utils from '../../../../plugins/utils'
import settingService from '../../../../api/setting/settingService'
import { vMaska } from 'maska'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import TransferCategoryVue from '../../../components/icons/TransferCategory.vue'
import router from '../../../../plugins/router'

export default {
  directives: { maska: vMaska },
  data() {
    return {
      debtMaskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, ''),
        postProcess: (val) => {
          if (!val) return ''
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.createAccountDialog.form.debtAmount = value.unmasked
          this.createAccountDialog.form.debtAmountMasked = value
        }
      },
      creditMaskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, ''),
        postProcess: (val) => {
          if (!val) return ''
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.createAccountDialog.form.creditAmount = value.unmasked
          this.createAccountDialog.form.creditAmountMasked = value
        }
      },
      searchDestAccountText: '',
      destAccountDialog: {
        show: false,
        accounts: [],
        selected: {}
      },
      copyAccountDialog: {
        show: false,
        generateNewCode: true,
        destAccount: {}
      },
      transferAccountDialog: {
        show: false,
        generateNewCode: true,
        destAccount: {}
      },
      accountSetting: [],
      accounts: [],
      isAutomateCode: true,
      createAccountDialog: {
        dialog: false,
        form: {
          useCustomSeparator: false,
          separator: null,
          controlLimit: 1,
          type: 0,
          maximumChildCodeLength: 0,
          debtAmountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          },
          creditAmountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        }
      },
      moreInfoDialog: {
        dialog: false,
        model: null
      },
      lastOpenItems: [],
      selectedAccount: null,
      selectedItemFromApi: null,
      selectedRow: null,
      treeViewAccounts: [],
      treeViewAccountsShowList: [],
      searchTreeText: null,
      addAccountIcon: markRaw(addAccountIcon),
      folderIcon: markRaw(folderIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      paperIcon: markRaw(paperIcon),
      folderstarIcon: markRaw(folderstarIcon),
      deleteIcon: markRaw(deleteIcon),
      savePlusIcon: markRaw(savePlusIcon),
      saveIcon: markRaw(saveIcon),
      infoIcon: markRaw(infoIcon),
      datatableHeader: [
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          key: 'hierarchicalCode',
          width: '90px'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'hierarchicalName',
          minWidth: '200px'
        },
        {
          title: this.$t('subGroupStatus'),
          align: 'center',
          sortable: true,
          key: 'maximumChildCodeLength',
          width: '140px'
        },
        {
          title: this.$t('active'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '0'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: false,
          key: 'delete',
          width: '0',
          fixed: true
        }
      ]
    }
  },
  computed: {
    subGroupStatuses() {
      return [
        { title: this.$t('noSubGroup'), id: 0 },
        { title: this.$t('subGroup') + ' ' + this.$t('singleDigit'), id: 1 },
        { title: this.$t('subGroup') + ' ' + this.$t('doubleDigit'), id: 2 },
        { title: this.$t('subGroup') + ' ' + this.$t('threeDigit'), id: 3 },
        { title: this.$t('subGroup') + ' ' + this.$t('fourDigit'), id: 4 },
        { title: this.$t('subGroup') + ' ' + this.$t('fiveDigit'), id: 5 },
        { title: this.$t('subGroup') + ' ' + this.$t('sixDigit'), id: 6 },
        { title: this.$t('subGroup') + ' ' + this.$t('sevenDigit'), id: 7 },
        { title: this.$t('subGroup') + ' ' + this.$t('eightDigit'), id: 8 }
      ]
    },
    controlLimits() {
      return [
        { title: 'بدون محدودیت', id: 1 },
        { title: 'مانده بدهکار', id: 2 },
        { title: 'مانده بستانکار', id: 3 },
        { title: 'فقط گردش بدهکار', id: 4 },
        { title: 'فقط گردش بستانکار', id: 5 }
      ]
    },
    accountNatures() {
      return [
        { title: this.$t('neutral'), id: 0 },
        { title: this.$t('debtor'), id: 1 },
        { title: this.$t('creditor'), id: 2 }
      ]
    },
    accountFamilies() {
      return [
        { title: this.$t('people'), id: 0 },
        { title: this.$t('stockholder'), id: 1 },
        { title: this.$t('costCenters'), id: 2 },
        { title: this.$t('projects'), id: 3 },
        { title: this.$t('contracts'), id: 4 },
        { title: this.$t('bank'), id: 5 },
        { title: this.$t('cashDesk'), id: 6 },
        { title: this.$t('fund'), id: 7 },
        { title: this.$t('productsOrServices'), id: 8 },
        { title: this.$t('warehouse'), id: 9 },
        { title: this.$t('other'), id: 10 }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    handleCloseEditDialog() {
      if (this.createAccountDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.createAccountDialog.dialog = false
        })
      } else this.createAccountDialog.dialog = false
    },
    async openSelectDestDialog() {
      this.destAccountDialog = {
        show: true,
        accounts: [],
        selected: {}
      }
      await this.searchAccounts('', true)
    },
    openTransfer(item) {
      this.transferAccountDialog = {
        show: true,
        generateNewCode: true,
        selectedAccount: item,
        destAccount: {}
      }
    },
    async saveTransfer() {
      const { valid } = await this.$refs.transferAccountRef.validate()
      if (valid) {
        let request = {
          id: this.transferAccountDialog.selectedAccount.id,
          newParentId: this.transferAccountDialog.destAccount.id,
          generateNewCode: this.transferAccountDialog.generateNewCode
        }
        await detailedAccountService.transfer(request).then(async (res) => {
          if (res.isSuccess) {
            this.transferAccountDialog = {
              generateNewCode: true,
              selectedAccount: {},
              destAccount: {},
              show: false
            }
            this.setErrorMessage(this.$t('transferAccountSuccessfullMessage'), 'success')
            await this.getAllTickets()
          } else this.setErrorMessage(res.errors[0].message)
        })
      }
    },
    setActiveDestAccount(item) {
      item.active = true
      this.destAccountDialog.selected = item
    },
    async changeDestSearchText(text) {
      await this.searchAccounts(text, true)
    },
    saveSelectDestAccount() {
      if (this.destAccountDialog.selected) {
        if (this.copyAccountDialog.show)
          this.copyAccountDialog.destAccount = this.destAccountDialog.selected
        if (this.transferAccountDialog.show)
          this.transferAccountDialog.destAccount = this.destAccountDialog.selected
        this.destAccountDialog.show = false
      }
    },
    openCopy(item) {
      this.copyAccountDialog = {
        show: true,
        generateNewCode: true,
        selectedAccount: item,
        destAccount: {},
        newName: `${this.$t('copyOf')} ${item.name}`,
        newCode: null,
      }
    },
    async saveCopy() {
      const { valid } = await this.$refs.copyAccountRef.validate()
      
      if (!this.copyAccountDialog.destAccount.id) {
        this.setErrorMessage(this.$t('pleaseEnterDestAccount'), 'warning');
        return;
      }
      if (!this.copyAccountDialog.generateNewCode) {
        if (!this.copyAccountDialog.newCode || this.copyAccountDialog.newCode.toString().trim() === '') {
          this.setErrorMessage(this.$t('pleaseEnterCodeOrSelectAutomatic'), 'warning');
          return;
        }
      }

      if (valid) {
        let request = {
          newName: this.copyAccountDialog.newName,
          newCode: this.copyAccountDialog.generateNewCode ? null : this.copyAccountDialog?.newCode,
          parentId: this.copyAccountDialog.destAccount.id
        }
        await detailedAccountService.copy(this.copyAccountDialog.selectedAccount.id, request).then(async (res) => {
          if (res.isSuccess) {
            this.copyAccountDialog = {
              generateNewCode: true,
              selectedAccount: {},
              destAccount: {},
              show: false
            }
            this.setErrorMessage(this.$t('copyAccountSuccessfullMessage'), 'success')
            await this.getAllTickets()
          } else this.setErrorMessage(res.errors[0].message)
        })
      }
    },
    showDate(date) {
      return utils.showDate(date, false, false, false, true)
    },
    showStatus(num) {
      return utils.showmaximumChildCodeLength(num)
    },
    showAccountType(type) {
      return utils.showAccountType(type)
    },
    showFamily(family) {
      return utils.showAccountFamily(family)
    },
    async setActiveAccount(item) {
      this.clearActiveItems(this.treeViewAccounts);

      item.active = true;
      if (!(item.family >= 0) && item.id) {
        let acc = await this.getById(item.id);
        item.family = (acc.family >= 0) ? acc.family : 0;
      }
      this.selectedAccount = item
      this.selectedRow = null
      document.getElementById('data').scrollIntoView()
    },
    findAccountById(accounts, id) {
      if (!accounts) return null;
      
      for (const account of accounts) {
        if (account.id === id) {
          return account;
        }
        if (account.children && account.children.length > 0) {
          const found = this.findAccountById(account.children, id);
          if (found) return found;
        }
      }
      return null;
    },
    clearActiveItems(items) {
      if (!items) return;
      items.forEach(item => {
        item.active = false;
        if (item.children && item.children.length > 0) {
          this.clearActiveItems(item.children);
        }
      });
    },
    arrangeItems(list, isSearch) {
      const itemsMap = new Map(list.map(item => [item.id, item]))
      
      const processItem = (item) => {
        const processed = {
          ...item,
          active: this.copyAccountDialog.show || this.transferAccountDialog.show
            ? false
            : this.selectedAccount?.id === item.id,
          title: `${item.name} ${this.showAccountCode ? item.hierarchicalCode : ''}`,
          draggable: false,
          icon: item?.maximumChildCodeLength > 0 ? folderIcon : paperIcon,
          openedIcon: item?.children?.length > 0 ? openedFolderIcon : null,
          open: isSearch ? item?.children?.length > 0 : this.lastOpenItems.includes(item.id),
          family: item.parentId ? itemsMap.get(item.parentId)?.family : item.family,
          isFamilyEditable: !item.parentId && item.family === null,
        }

        if (!(this.copyAccountDialog.show || this.transferAccountDialog.show)) {
          processed.contexts = [
            {
              label: this.$t('addAccount'),
              icon: 'mdi mdi-file-document-plus-outline',
              onClick: () => {
                this.setActiveAccount(processed)
                this.openAddAccountDialog()
              }
            },
            {
              label: this.$t('edit'),
              icon: 'mdi mdi-square-edit-outline',
              onClick: () => this.openEdit(processed)
            },
            {
              label: this.$t('copyAccount'),
              icon: 'mdi mdi-content-copy',
              onClick: () => {
                this.setActiveAccount(processed)
                this.openCopy(processed)
              }
            },
            {
              label: this.$t('transferAccount'),
              icon: 'mdi mdi-cursor-move',
              onClick: () => {
                this.setActiveAccount(processed)
                this.openTransfer(processed)
              }
            },
            {
              label: this.$t('delete'),
              icon: 'mdi mdi-delete',
              onClick: () => this.openDeleteDialog(processed)
            }
          ]
          processed.dblClick = () => this.openEdit(processed)
        }
        if (item?.children?.length > 0) processed.children = item.children.map(child => processItem(child))
        return processed
      }
      return list.map(item => processItem(item))
    },
    openDeleteDialog(item) {
      if (item.children?.length > 0) {
        this.setWarningDialog(
          true,
          this.$t('deleteAccount'),
          this.$t('deleteAccountWithChildrenWarning'),
          () => this.deleteAccount(item.id)
        );
      } else {
        this.setWarningDialog(
          true,
          this.$t('deleteAccount'),
          this.$t('confirmDeleteMessage'),
          () => this.deleteAccount(item.id)
        );
      }
    },
    openAddAccountDialog() {
      // (await this.$refs["detailedName"])?.focus()
      this.isAutomateCode = true
      if (this.selectedAccount.maximumChildCodeLength == 0) {
        this.setErrorMessage(this.$t('noSubGroupInSelectedAccount'))
      } else {
        this.createAccountDialog = {
          hasChanged: false,
          dialog: true,
          form: {
            controlLimit: 1,
            type: 0,
            isActive: true,
            maximumChildCodeLength: 0,
            family: this.selectedAccount?.id ? this.selectedAccount.family : 0,
            debtAmountMasked: {
              masked: '',
              unmasked: '',
              completed: false
            },
            creditAmountMasked: {
              masked: '',
              unmasked: '',
              completed: false
            }
          }
        }
        if ((!this.selectedAccount?.id && this.selectedAccount.family === null) || this.selectedAccount.title === this.$t('detailedAccountsTreeView')) {
          this.createAccountDialog.form.isFamilyEditable = true
        } else {
          this.createAccountDialog.form.isFamilyEditable = false
        }
      }
    },
    async openEdit(model) {
      this.isAutomateCode = true;
      let item = await this.getById(model.id);
      this.selectedItemFromApi = item;

      if (item !== false) {
        const separator = item.separator || '/';
        const hCodes = item.hierarchyCodes?.split(separator) || [];
        const parentCode = hCodes.length > 1 ? hCodes[hCodes.length - 2] : '';

        this.createAccountDialog = {
          hasChanged: false,
          dialog: true,
          isEdit: true,
          form: {
            id: item.id,
            code: item.code,
            parentId: item?.parentId,
            creditAmount: item.maximumCredit || null,
            debtAmount: item.maximumDebit || null,
            desc: item.description,
            isBanned: item.isBanned ?? false,
            separator: item.separator || null,
            isActive: item.isActive ?? true,
            name: item.name,
            maximumChildCodeLength: item?.maximumChildCodeLength ?? 0,
            type: item?.type ?? 0,
            family: item.parentId ? item.family : (item.family ?? 0),
            isFamilyEditable: !item.parentId && item.family === null,
            nature: item.nature,
            parentCode: parentCode,
            debtAmountMasked: {
              masked: item.maximumDebit ? item.maximumDebit.toLocaleString() : '',
              unmasked: (item.maximumDebit || 0),
              completed: false
            },
            creditAmountMasked: {
              masked: item.maximumCredit ? item.maximumCredit.toLocaleString() : '',
              unmasked: (item.maximumCredit || 0),
              completed: false
            }
          }
        }
      }
    },
    async openMoreInfo(model) {
      let item = await this.getById(model.id)
      if (item !== false) {
        this.moreInfoDialog = {
          dialog: true,
          model: item
        }
      }
    },
    async changeSearchTreeText(text) {
      await this.searchAccounts(text?.trim())
    },
    async getById(id) {
      let resp = await detailedAccountService.getById(id)
      if (resp.isSuccess) return resp.value
      else {
        this.setErrorMessage(resp.errors[0].message)
        return false
      }
    },
    async getAllTickets() {
      var lst = utils.recursiveSearch(this.treeViewAccounts, 'open', true, 'children', true, null)
      this.lastOpenItems = lst.map((x) => x.id)
      await detailedAccountService.getAll().then(async (resp) => {
        if (resp.isSuccess) {
          this.accounts = [...resp.value];
          this.treeViewAccounts = this.arrangeItems(this.accounts);
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: this.selectedAccount ? false : true,
              title: this.$t('detailedAccountsTreeView'),
              draggable: false,
              open: true,
              icon: folderIcon,
              openedIcon: openedFolderIcon,
              children: this.treeViewAccounts,
              contexts: [
                {
                  label: this.$t('addAccount'),
                  icon: 'mdi mdi-file-document-plus-outline',
                  onClick: () => {
                    this.setActiveAccount(this.treeViewAccountsShowList[0])
                    this.openAddAccountDialog()
                  }
                }
              ]
            }
          ]
          if (this.selectedAccount && this.selectedAccount.id) {
            const foundAccount = this.findAccountById(this.treeViewAccounts, this.selectedAccount.id);
            if (foundAccount) {
              await this.setActiveAccount(foundAccount);
            } else {
              this.selectedAccount = this.treeViewAccountsShowList[0];
              this.selectedRow = null;
            }
          } else {
            this.selectedAccount = this.treeViewAccountsShowList[0];
            this.selectedRow = null;
          }
          // if (this.selectedAccount) this.setActiveAccount(this.selectedAccount)
          // else {
          //   this.selectedAccount = this.treeViewAccountsShowList[0]
          //   this.selectedRow = null
          // }
        } else this.setErrorMessage(resp.errors[0].message)
      })
    },
    async searchAccounts(paramText, isDest) {
      var lst = utils.recursiveSearch(this.treeViewAccounts, 'open', true, 'children', true, null)
      this.lastOpenItems = lst.map((x) => x.id)
      const params = {
        accountType: 3,
        accountFamily: null,
        leafAccounts: null,
        text: paramText,
        id: null
      }
      await detailedAccountService.search(params).then((resp) => {
        if (resp.isSuccess) {
          this.accounts = [...resp.value]
          this.treeViewAccounts = this.arrangeItems(
            this.accounts,
            paramText?.trim() != '' ? true : false
          )
          if (isDest) {
            this.destAccountDialog.accounts = [
              {
                id: null,
                active: true,
                title: this.$t('detailedAccountsTreeView'),
                draggable: false,
                open: true,
                icon: folderIcon,
                openedIcon: openedFolderIcon,
                children: this.treeViewAccounts
              }
            ]
          } else {
            this.treeViewAccountsShowList = [
              {
                id: null,
                active: this.selectedAccount ? false : true,
                title: this.$t('detailedAccountsTreeView'),
                draggable: false,
                open: true,
                icon: folderIcon,
                openedIcon: openedFolderIcon,
                children: this.treeViewAccounts,
                contexts: [
                  {
                    label: this.$t('addAccount'),
                    icon: 'mdi mdi-file-document-plus-outline',
                    onClick: () => {
                      this.setActiveAccount(this.treeViewAccountsShowList[0])
                      this.openAddAccountDialog()
                    }
                  }
                ]
              }
            ]
            if (this.selectedAccount) this.setActiveAccount(this.selectedAccount)
            else {
              this.selectedAccount = this.treeViewAccountsShowList[0]
              this.selectedRow = null
            }
          }
        } else this.setErrorMessage(resp.errors[0].message)
      })
    },
    async submitDialog() {
      if (this.createAccountDialog.isEdit) await this.editAccount()
      else await this.createAccount()
    },
    async createAccount(isSaveAndNew) {
      const request = {
        code: this.createAccountDialog.form.code || null,
        maximumCredit: Number(this.createAccountDialog.form.creditAmount) || null,
        maximumDebit: Number(this.createAccountDialog.form.debtAmount) || null,
        description: this.createAccountDialog.form.desc || null,
        isBanned: this.createAccountDialog.form?.isBanned ?? false,
        separator: this.createAccountDialog.form?.separator || null,
        isActive: this.createAccountDialog.form?.isActive ?? false,
        name: this.createAccountDialog.form.name,
        parentId: this.selectedAccount?.id,
        type: 3,
        nature: this.createAccountDialog.form?.nature ?? 0,
        family: this.createAccountDialog.form?.family ?? 0,
        maximumChildCodeLength: this.createAccountDialog.form?.maximumChildCodeLength ?? 0
      };
      await detailedAccountService.create(request)
        .then(async (resp) => {
          if (resp.isSuccess) {
            this.setErrorMessage(this.$t('accountSuccessfullyCreated'), 'success')
            this.createAccountDialog = {
              dialog: isSaveAndNew ? true : false,
              form: {
                controlLimit: 1,
                type: 0,
                debtAmountMasked: {
                  masked: '',
                  unmasked: '',
                  completed: false
                },
                creditAmountMasked: {
                  masked: '',
                  unmasked: '',
                  completed: false
                }
              }
            }
            await this.getAllTickets()
          } else {
            this.setErrorMessage(resp.errors[0].message)
            if (resp.errors?.length > 0) {
              var errorMessage = ''
              resp.errors.forEach((error) => {
                errorMessage += error + '\n'
              })
              this.setErrorMessage(errorMessage.slice(0, -1))
            }
          }
        })
    },
    async editAccount() {
      const request = {
        ...this.selectedItemFromApi,
        code: this.createAccountDialog.form.code || null,
        maximumCredit: Number(this.createAccountDialog.form.creditAmount) || null,
        maximumDebit: Number(this.createAccountDialog.form.debtAmount) || null,
        description: this.createAccountDialog.form.desc || null,
        isBanned: this.createAccountDialog.form?.isBanned ?? false,
        separator: this.createAccountDialog.form?.separator || null,
        isActive: this.createAccountDialog.form?.isActive ?? false,
        name: this.createAccountDialog.form.name,
        id: this.createAccountDialog.form.id,
        maximumChildCodeLength: this.createAccountDialog.form?.maximumChildCodeLength ?? 0,
        type: 3,
        nature: this.createAccountDialog.form?.nature ?? 0,
        family: this.createAccountDialog.form?.family ?? 0,
      };
      console.log(request);
      await detailedAccountService.update(request)
        .then(async (resp) => {
          if (resp.isSuccess) {
            this.setErrorMessage(this.$t('accountSuccessfullyEdited'), 'success')
            this.createAccountDialog = {
              dialog: false,
              form: {
                controlLimit: 1,
                type: 3,
                nature: 0,
                debtAmountMasked: {
                  masked: '',
                  unmasked: '',
                  completed: false
                },
                creditAmountMasked: {
                  masked: '',
                  unmasked: '',
                  completed: false
                }
              }
            }
            await this.getAllTickets()
          } else {
            if (resp.errors?.length > 0) {
              var errorMessage = ''
              resp.errors.forEach((error) => {
                errorMessage += error + '\n'
              })
              this.setErrorMessage(errorMessage.slice(0, -1))
            }
          }
        })
    },
    async deleteAccount(id) {
      const resp = await detailedAccountService.delete(id);
      if (resp.data.isSuccess) {
        this.setErrorMessage(this.$t('accountSuccessfullyDeleted'), 'success');
        this.closeWarning();
        
        if (this.selectedAccount && this.selectedAccount.id === id) {
          this.selectedAccount = this.treeViewAccountsShowList[0];
          this.selectedRow = null;
        }
        await this.getAllTickets();
      } else {
        this.setErrorMessage(resp.errors[0].message);
      }
    },
    async getAccountSetting() {
      const params = {
        page: 1,
        size: 10,
        settingModule: 0
      }
      await settingService.getSetting(params).then((resp) => {
        this.accountSetting = resp.value.result
      })
    },
    onkeydown(e) {
      if (this.createAccountDialog?.dialog && e.keyCode == 27) this.handleCloseEditDialog()
      if (!this.$refs.accountSearchText.focused && e.key == '/' && e.ctrlKey)
        this.$refs.accountSearchText.focus()
      if (this.transferAccountDialog?.show && e.keyCode == 27)
        if (this.destAccountDialog?.show) this.destAccountDialog.show = false
        else this.transferAccountDialog.show = false
      if (this.copyAccountDialog?.show && e.keyCode == 27)
        if (this.destAccountDialog?.show) this.destAccountDialog.show = false
        else this.copyAccountDialog.show = false
    },
    async selectAccountById(id) {
      const findAccount = (accounts, id) => {
        for (let acc of accounts) {
          if (acc.id === id) {
            return acc;
          }
          if (acc.children && acc.children.length > 0) {
            const found = findAccount(acc.children, id);
            if (found) return found;
          }
        }
        return null;
      };
      let account = findAccount(this.treeViewAccounts, id);
      
      if (account) {
        this.openPathToAccount(account.id);
        this.setActiveAccount(account);
      } else {
        const result = await detailedAccountService.getById(id);
        if (result.isSuccess) {
          await this.searchAccounts(result.value.name);
          setTimeout(() => {
            account = findAccount(this.treeViewAccounts, id);
            if (account) {
              this.openPathToAccount(account.id);
              this.setActiveAccount(account);
            }
          }, 500);
        }
      }
    },
    openPathToAccount(id) {
      const findPathToAccount = (accounts, id, path = []) => {
        for (let acc of accounts) {
          const newPath = [...path, acc.id];
          if (acc.id === id) {
            return newPath;
          }
          if (acc.children && acc.children.length > 0) {
            const found = findPathToAccount(acc.children, id, newPath);
            if (found) return found;
          }
        }
        return null;
      };
      
      const path = findPathToAccount(this.treeViewAccounts, id);
      if (path) {
        path.forEach(accId => {
          const markNodeOpen = (accounts, id) => {
            for (let acc of accounts) {
              if (acc.id === id) {
                acc.open = true;
                return true;
              }
              if (acc.children && acc.children.length > 0) {
                if (markNodeOpen(acc.children, id)) {
                  acc.open = true;
                  return true;
                }
              }
            }
            return false;
          };
          markNodeOpen(this.treeViewAccounts, accId);
        });
        
        this.lastOpenItems = path;
      }
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)

    const accountId = this.currentActiveTab.query.detailedAccountId;

    await this.getAllTickets()
    await this.getAccountSetting()
    
    if (accountId) {
      this.selectAccountById(accountId);
    }
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  watch: {
    isAutomateCode(value) {
      if (value == true) this.createAccountDialog.form.code = null
    }
  },
  components: {
    treeView,
    dataTable,
    customForm,
    switchButton,
    reportOutput
  }
}
</script>

<style>
.tree-view-accounts-container {
  direction: rtl;
  flex-direction: column;
  overflow: auto;
}

.v-locale--is-rtl .tree-view-accounts-container {
  direction: ltr;
}

.first-col {
  border-bottom: 1px solid #e0e0e0;
  border-inline-end: 1px solid #e0e0e0;
}

.first-col-lastrow {
  border-inline-end: 1px solid #e0e0e0;
}

.second-col {
  border-bottom: 1px solid #e0e0e0;
}

.tree-view-wrapper {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 8px;
  margin-right: -8px;
}

.data-table-container {
  overflow: auto;
}

@media (max-width: 959px) {
  .tree-view-accounts-container {
    max-height: 400px !important;
    margin-bottom: 1rem;
  }
  
  .data-table-container {
    margin-top: 1rem;
  }
}

@media only screen and (max-width: 600px) {
  .first-col,
  .first-col-lastrow {
    border-inline-end: none;
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

</style>
