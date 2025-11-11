<template>
  <v-dialog close-on-back persistent v-model="showQrCodeScanner" width="400px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-qrcode-scan" />
        <p style="font-weight: bold">
          {{ $t('scanSayyadiBarcode') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="showQrCodeScanner = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <qrcode-stream @detect="onDetectQr" />
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    close-on-back
    persistent
    v-model="createCheckPaper.dialog"
    width="400px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="checkPaperRegisterIcon" />
        <p style="font-weight: bold">
          {{ $t('editCheckPaper') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="createCheckPaper.dialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="createCheckPaperForm" @submit.prevent="saveCreateCheckPaper">
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('checkPaperDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="6">{{ $t('paperCount') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="6">
                <v-text-field
                  autofocus
                  type="number"
                  :rules="[(v) => !!v || $t('enterRequiredField')]"
                  density="compact"
                  variant="outlined"
                  v-model="createCheckPaper.form.paperCount"
                />
              </v-col>
              <v-col v-if="!checkBookModel.checkPapers?.length > 0" class="my-auto" cols="12" sm="6"
                >{{ $t('firstCheckPaperSerialNumber') }}:</v-col
              >
              <v-col v-if="!checkBookModel.checkPapers?.length > 0" class="pb-0" cols="12" sm="6">
                <v-text-field
                  type="number"
                  :rules="[(v) => !!v || $t('enterRequiredField')]"
                  density="compact"
                  variant="outlined"
                  v-model="createCheckPaper.form.firstCheckPaperSerialNumber"
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

  <v-dialog close-on-back persistent v-model="editCheckPaper.dialog" width="400px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="checkPaperRegisterIcon" />
        <p style="font-weight: bold">
          {{ $t('editCheckPaper') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="editCheckPaper.dialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="editCheckPaperForm" @submit.prevent="saveEditCheckPaper">
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('checkPaperDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="4">{{ $t('sayyadiNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="8">
                <v-text-field
                  :label="$t('sayyadiNumber')"
                  autofocus
                  type="number"
                  density="compact"
                  variant="outlined"
                  :rules="[
                    (v) => {
                      if (v && !sayyadiRegex.test(v)) return $t('enterTheSayyadiNumberCorrectly')
                      else return true
                    }
                  ]"
                  v-model="editCheckPaper.form.sayadNumber"
                  append-inner-icon="mdi mdi-qrcode-scan"
                  @click:append-inner="openQrScanner(entity)"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="4">{{ $t('serieNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="8">
                <v-text-field
                  type="number"
                  density="compact"
                  variant="outlined"
                  :value="editCheckPaper.form.serieCode"
                  disabled
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="4">{{ $t('serialNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="8">
                <v-text-field
                  type="number"
                  :rules="[(v) => !!v || $t('enterRequiredField')]"
                  density="compact"
                  variant="outlined"
                  v-model="editCheckPaper.form.serialNumber"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="4">{{ $t('status') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="8">
                <v-select
                  density="compact"
                  variant="outlined"
                  :items="checkPaperStatuses"
                  item-title="title"
                  item-value="value"
                  v-model="editCheckPaper.form.status"
                  :base-color="getStatusColor(editCheckPaper.form.status)"
                  :color="getStatusColor(editCheckPaper.form.status)"
                  :item-color="getStatusColor(editCheckPaper.form.status)"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="4">{{ $t('description') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="8">
                <v-text-field
                  density="compact"
                  variant="outlined"
                  v-model="editCheckPaper.form.desc"
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
    <transfer-stepper ref="transferStepper" :items="stepperItems" @save="saveAll">
      <template v-slot:content_0>
        <v-card-text class="">
          <v-btn color="info" to="/transfer/registerAccount/bank" variant="tonal" class="add-new-btn" @click="handleAddAccount">{{ $t('addAccount') }}</v-btn>
          <data-table
            :headers="bankHeaders"
            :items="bankItems"
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
            :clickableRow="true"
            :selectableRow="true"
            v-model:selectedRow="selectedBank"
            :arrowCondition="$refs.transferStepper?.tab == 0"
          >
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
                <v-icon icon="mdi mdi-close-box-outline" color="error"></v-icon>
                <p class="text-error ms-2">{{ $t('inActive') }}</p>
              </div>
            </template>
          </data-table>
        </v-card-text>
      </template>
      <template v-slot:content_1>
        <v-row class="d-flex flex-column" no-gutters>
          <p v-if="checkBookModel.editMode" class="mb-4">{{ $t('checkBookInfo') }}</p>
          <v-row no-gutters v-else class="align-center w-100">
            <p class="text-grey" style="max-width: calc(100% - 60px); font-weight: bold">
              {{
                $t('selectedAccount') + ': ' + checkBookModel.bankName + `(${selectedBank.fCode})`
              }}
            </p>
            <v-btn
              variant="text"
              class="ms-2"
              icon="mdi mdi-pencil-outline"
              color="primary"
              size="small"
              @click="openEditCheckBook"
            />
          </v-row>
          <v-form
            class="d-flex flex-column w-100"
            v-if="selectedBank && checkBookModel.editMode"
            ref="createCheckBookForm"
            @submit.prevent="createCheckBook"
          >
            <v-row no-gutters style="gap: 10px">
              <v-text-field
                variant="outlined"
                hide-details
                density="compact"
                :label="this.$t('accountCodeBank')"
                v-model="selectedBank.fCode"
                readonly
                style="width: 120px"
              />
              <v-text-field
                variant="outlined"
                hide-details
                density="compact"
                :label="this.$t('bankName')"
                v-model="checkBookModel.bankName"
                readonly
                style="width: 150px"
              />
              <v-text-field
                variant="outlined"
                hide-details
                density="compact"
                :label="this.$t('accountNumber')"
                v-model="checkBookModel.bankAccountNumber"
                readonly
                style="width: 170px"
              />
              <v-text-field
                variant="outlined"
                hide-details
                density="compact"
                :label="this.$t('shabaNumber')"
                v-model="checkBookModel.iBan"
                readonly
                style="width: 190px"
                type="number"
                suffix="IR"
              />
              <v-text-field
                autofocus
                variant="outlined"
                hide-details
                density="compact"
                :label="this.$t('title')"
                :rules="[(v) => !!v || $t('enterRequiredField')]"
                v-model="checkBookEditModel.title"
                persistent-placeholder
                style="width: 190px"
              />
              <v-text-field
                variant="outlined"
                hide-details
                density="compact"
                :rules="[(v) => (!!v && numericRegex.test(v)) || $t('enterRequiredField')]"
                :label="this.$t('serieNumber')"
                v-model="checkBookEditModel.serieCode"
                type="number"
                persistent-placeholder
                style="width: 190px"
              />
              <v-text-field
                variant="outlined"
                hide-details
                density="compact"
                :label="this.$t('description')"
                v-model="checkBookEditModel.desc"
                persistent-placeholder
                style="width: 190px"
              />
            </v-row>
            <v-row class="mt-2 justify-end" no-gutters>
              <v-btn prepend-icon="mdi mdi-check" variant="flat" color="info" type="submit">{{
                $t('submit')
              }}</v-btn>
              <v-btn
                v-if="!checkBookModel.isNew"
                @click="checkBookModel.editMode = false"
                class="ms-2"
                variant="text"
                color="error"
                >{{ $t('cancel') }}</v-btn
              >
            </v-row>
          </v-form>
          <v-form ref="checkPaperTableRef" class="w-100">
            <data-table
              class="checkPapers-table"
              v-if="!checkBookModel.isNew"
              :headers="checkPaperHeaders"
              :items="checkBookModel.checkPapers"
              :hasSearch="true"
              :searchItems="['sayadNumber', 'serialNumber', 'serieCode', 'desc']"
              :clickableRow="true"
              @rowDblClick="openEditCheckPaper"
            >
              <template v-slot:toolbar>
                <v-row class="ms-2" no-gutters>
                  <v-btn
                    @click="openCreateCheckPaperDialog"
                    variant="tonal"
                    :prepend-icon="checkPaperRegisterIcon"
                    color="info"
                    >{{ $t('registerCheckPaper') }}</v-btn
                  >
                  <v-btn
                    class="ms-2"
                    @click="groupDelete"
                    :disabled="!checkBookModel?.checkPapers?.some((a) => a.checkbox)"
                    variant="tonal"
                    :prepend-icon="deleteIcon"
                    color="error"
                    >{{ $t('delete') }}</v-btn
                  >
                </v-row>
              </template>
              <template v-slot:column_index="{ entity }">
                {{ checkBookModel.checkPapers.indexOf(entity) + 1 }}
              </template>
              <template v-slot:header_checkbox>
                <v-checkbox
                  v-model="checkAll"
                  :indeterminate="checkAllIndeterminate"
                  hide-details
                  density="compact"
                  style="
                    margin: -10px;
                    color: rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity));
                  "
                />
              </template>
              <template v-slot:column_checkbox="{ entity }">
                <v-checkbox
                  :model-value="entity.checkbox"
                  @update:modelValue="($event) => changeCB($event, entity)"
                  hide-details
                  density="compact"
                  style="margin: -10px"
                />
              </template>
              <template v-slot:column_sayadNumber="{ entity }">
                <v-text-field
                  type="number"
                  bg-color="transparent"
                  hide-details
                  density="compact"
                  variant="underlined"
                  :rules="[
                    (v) => {
                      if (v && !sayyadiRegex.test(v)) return $t('enterTheSayyadiNumberCorrectly')
                      else return true
                    }
                  ]"
                  v-model="entity.sayadNumber"
                  style="margin-block: -10px"
                  append-inner-icon="mdi mdi-qrcode-scan"
                  @click:append-inner="openQrScanner(entity)"
                />
              </template>
              <template v-slot:column_serialNumber="{ entity }">
                <v-text-field
                  type="number"
                  bg-color="transparent"
                  hide-details
                  density="compact"
                  variant="underlined"
                  :rules="[(v) => !!v || $t('enterRequiredField')]"
                  v-model="entity.serialNumber"
                  style="margin-block: -10px"
                />
              </template>
              <template v-slot:column_desc="{ entity }">
                <v-text-field
                  bg-color="transparent"
                  hide-details
                  density="compact"
                  variant="underlined"
                  v-model="entity.desc"
                  style="margin-block: -10px"
                />
              </template>
              <template v-slot:column_status="{ entity }">
                <v-select
                  bg-color="transparent"
                  hide-details
                  density="compact"
                  variant="underlined"
                  :items="checkPaperStatuses"
                  item-title="title"
                  item-value="value"
                  v-model="entity.status"
                  style="margin-block: -10px"
                  :base-color="getStatusColor(entity.status)"
                  :color="getStatusColor(entity.status)"
                  :item-color="getStatusColor(entity.status)"
                />
              </template>
              <template v-slot:column_operations="{ entity }">
                <v-row class="d-none d-md-flex justify-center" style="width: 100px">
                  <v-tooltip :text="$t('editCheckPaper')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        icon="mdi mdi-square-edit-outline"
                        variant="text"
                        color="info"
                        size="x-small"
                        @click="() => openEditCheckPaper(entity)"
                      />
                    </template>
                  </v-tooltip>
                  <v-tooltip :text="$t('deleteCheckPaper')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        :icon="deleteIcon"
                        variant="text"
                        color="error"
                        size="x-small"
                        @click="() => deleteCheckPaper(entity)"
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
                          @click.prevent="() => openEditCheckPaper(entity)"
                          density="compact"
                          :title="$t('editCheckPaper')"
                        >
                          <template v-slot:prepend>
                            <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                          </template>
                        </v-list-item>
                        <v-list-item
                          @click.prevent="() => deleteCheckPaper(entity)"
                          density="compact"
                          :title="$t('deleteCheckPaper')"
                        >
                          <template v-slot:prepend>
                            <v-icon :icon="deleteIcon" color="error" />
                          </template>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-btn>
                </v-row>
              </template> </data-table
          ></v-form>
        </v-row>
      </template>
      <template v-slot:content_2>
        <v-row no-gutters class="align-center w-100">
          <p class="text-grey" style="max-width: calc(100% - 60px)">
            {{ $t('selectedAccount') + ': ' + checkBookModel.bankName + `(${selectedBank.fCode})` }}
          </p>
          <v-btn
            variant="text"
            class="ms-2"
            icon="mdi mdi-pencil-outline"
            size="small"
            @click="() => $refs.transferStepper.setTab(0)"
          />
        </v-row>
        <v-row no-gutters class="align-center w-100">
          <p class="text-grey">
            {{ $t('registeredCheckPapers') + ` :${checkBookModel.checkPapers?.length ?? 0}` }}
          </p>
          <v-btn
            variant="text"
            class="ms-2"
            icon="mdi mdi-pencil-outline"
            size="small"
            @click="() => $refs.transferStepper.setTab(1)"
          />
        </v-row>
        <v-row no-gutters class="align-center w-100">
          <data-table
            class="w-100"
            :headers="checkPaperHeaders.filter((a) => a.key != 'operations' && a.key != 'checkbox')"
            :items="checkBookModel.checkPapers"
            :hasSearch="true"
            :searchItems="['sayadNumber', 'serialNumber', 'serieCode', 'desc']"
          >
            <template v-slot:column_index="{ entity }">
              {{ checkBookModel.checkPapers.indexOf(entity) + 1 }}
            </template>
            <template v-slot:column_status="{ entity }">
              <p :class="`text-${getStatusColor(entity.status)}`">
                {{ getStatusText(entity.status) }}
              </p>
            </template>
          </data-table>
        </v-row>
      </template>
    </transfer-stepper>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import detailedAccountService from '../../../../api/detailedAccount/detailedAccountService'
import transferService from '../../../../api/transfer/transferService'
import bankAccountIcon from '../../../components/icons/BankAccount.vue'
import checkBookIcon from '../../../components/icons/CheckBook.vue'
import operationReportIcon from '../../../components/icons/OperationReport.vue'
import checkPaperRegisterIcon from '../../../components/icons/CheckPaperRegister.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import saveIcon from '../../../components/icons/Save.vue'
import transferStepper from '../../../components/baseComponents/transferStepper.vue'

export default {
  data() {
    return {
      shouldLeave: false,
      checkAllIndeterminate: false,
      id: null,
      showQrCodeScanner: false,
      selectedSayyadi: null,
      numericRegex: /^[0-9,۰-۹]+$/,
      sayyadiRegex: /^[0-9,۰-۹]{16}$/,
      checkPaperRegisterIcon: markRaw(checkPaperRegisterIcon),
      deleteIcon: markRaw(deleteIcon),
      saveIcon: markRaw(saveIcon),
      createCheckPaper: {
        dialog: false,
        form: {}
      },
      editCheckPaper: {
        dialog: false,
        form: {}
      },
      checkBookEditModel: {
        isNew: false,
        editMode: false
      },
      checkBookModel: {
        isNew: true,
        editMode: true
      },
      selectedBank: null,
      bankItems: [
        // {
        //   name: 'ملت',
        //   fCode: '01',
        //   branch: 'مطهری',
        //   bankAccountNumber: '346456456',
        //   iBan: '43564564',
        //   cardNumber: '4645645'
        // }
      ],
      checkPaperHeaders: [
        {
          title: '',
          align: 'center',
          key: 'checkbox',
          width: '30px',
          notShowInSetting: true
        },
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('sayyadiNumber'),
          align: 'center',
          sortable: true,
          key: 'sayadNumber',
          width: '140px'
        },
        {
          title: this.$t('serieNumber'),
          align: 'center',
          sortable: true,
          key: 'serieCode',
          width: '120px'
        },
        {
          title: this.$t('serialNumber'),
          align: 'center',
          sortable: true,
          key: 'serialNumber',
          width: '100px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'status',
          width: '120px'
        },
        {
          title: this.$t('description'),
          class: 'flex-grow-1',
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '200px'
        },
        {
          title: '',
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ],
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
          width: '180px'
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
        }
      ],
      stepperItems: [
        {
          id: 0,
          title: this.$t('selectAccount'),
          icon: markRaw(bankAccountIcon),
          desc: this.$t('accountsList'),
          isValid: async () => this.isValidTab(0),
          setTab: () => this.setTab(0),
          enterForNextTab: true
        },
        {
          id: 1,
          title: this.$t('defineCheckBook'),
          icon: markRaw(checkBookIcon),
          desc: this.$t('checkBookList'),
          isValid: async () => this.isValidTab(1),
          setTab: () => this.setTab(1)
        },
        {
          id: 2,
          title: this.$t('operationReport'),
          icon: markRaw(operationReportIcon),
          desc: this.$t('voucherReview'),
          isValid: () => true,
          setTab: () => this.setTab(2)
        }
      ],
      checkPaperStatuses: [
        {
          title: this.$t('initial'),
          value: 0,
          color: 'default'
        },
        {
          title: this.$t('expired'),
          value: 1,
          color: 'error'
        },
        {
          title: this.$t('returned'),
          value: 2,
          color: 'error'
        },
        {
          title: this.$t('passed'),
          value: 3,
          color: 'success'
        }
      ]
    }
  },
  computed: {
    checkAll: {
      get() {
        if (this.checkBookModel?.checkPapers?.some((a) => a.checkbox)) {
          if (this.checkBookModel?.checkPapers?.every((a) => a.checkbox)) {
            this.checkAllIndeterminate = false
            return true
          } else {
            this.checkAllIndeterminate = true
            return false
          }
        } else {
          this.checkAllIndeterminate = false
          return false
        }
      },
      set(value) {
        this.checkBookModel.checkPapers.forEach((element) => {
          element.checkbox = value
        })
      }
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      setAddBankDialog: 'setAddBankDialog',
    }),
    handleAddAccount() {
      this.setAddBankDialog(true);
    },
    changeCB(value, item) {
      this.checkBookModel.checkPapers.filter((a) => a.id == item.id)[0].checkbox = value
    },
    groupDelete() {
      this.checkBookModel.checkPapers = this.checkBookModel.checkPapers.filter((a) => !a.checkbox)
    },
    getStatusColor(status) {
      switch (status) {
        case 0:
          return 'primary'
        case 1:
          return 'error'
        case 2:
          return 'success'
        case 3:
          return 'success'
        case 4:
          return 'error'
        default:
          return ''
      }
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return this.$t('initial')
        case 1:
          return this.$t('expired')
        case 2:
          return this.$t('returned')
        case 3:
          return this.$t('passed')
        default:
          return ''
      }
    },
    async saveAll() {
      let request = {
        entity: {
          bankId: this.checkBookModel.bankId,
          title: this.checkBookModel.title,
          iBan: this.checkBookModel.iBan,
          bankAccountNumber: this.checkBookModel.bankAccountNumber,
          paperCount: this.checkBookModel.checkPapers?.length ?? 0,
          serialNumber: this.checkBookModel.serialNumber,
          desc: this.checkBookModel.desc,
          checkPapers:
            this.checkBookModel?.checkPapers?.map((a) => {
              return {
                id: a?.id,
                serialNumber: a.serialNumber.toString(),
                sayadNumber: a.sayadNumber,
                status: a.status,
                desc: a.desc,
                serieCode: a.serieCode
              }
            }) ?? []
        }
      }
      if (this.id) {
        request.entity.id = this.id
        await transferService.updateCheckBook(request).then((res) => {
          if (res.isSuccess) {
            this.setErrorMessage(this.$t('checkBookSuccessfullyUpdated'), 'success')
            this.shouldLeave = true
            this.$router.push('/transfer/checkBookList')
          } else this.setErrorMessage(res.message)
        })
      } else {
        await transferService.createCheckBook(request).then((res) => {
          if (res.isSuccess) {
            this.setErrorMessage(this.$t('checkBookSuccessfullyCreated'), 'success')
            this.shouldLeave = true
            this.$router.push('/transfer/checkBookList')
          } else this.setErrorMessage(res.message)
        })
      }
    },
    openEditCheckPaper(item) {
      this.editCheckPaper = {
        dialog: true,
        form: { ...item }
      }
    },
    async saveEditCheckPaper() {
      let validation = await this.$refs.editCheckPaperForm.validate()
      if (validation.valid) {
        let selectedItem = this.checkBookModel.checkPapers.filter(
          (a) => a.index == this.editCheckPaper.form.index
        )[0]
        selectedItem.sayadNumber = this.editCheckPaper.form.sayadNumber
        selectedItem.serialNumber = this.editCheckPaper.form.serialNumber
        selectedItem.status = this.editCheckPaper.form.status
        selectedItem.desc = this.editCheckPaper.form.desc
        this.editCheckPaper = {
          dialog: false,
          form: {}
        }
      }
    },
    openQrScanner(item) {
      this.selectedSayyadi = item
      this.showQrCodeScanner = true
    },
    onDetectQr(detectedCode) {
      let nums = detectedCode[0].rawValue.split('\n')
      let code = nums[nums.length - 1]
      if (this.sayyadiRegex.test(code)) this.selectedSayyadi.sayadNumber = code
      else this.setErrorMessage(this.$t('invalidSayyadiQrCode'))
      this.showQrCodeScanner = false
    },
    openEditCheckBook() {
      this.checkBookModel.editMode = true
      this.checkBookEditModel = { ...this.checkBookModel }
    },
    setNumericValue(value, model, field) {
      if (!value) model[field] = null
      if (this.numericRegex.test(value)) model[field] = value
    },
    deleteCheckPaper(item) {
      this.checkBookModel.checkPapers = this.checkBookModel.checkPapers.filter((a) => a != item)
      this.checkBookModel.checkPapers.forEach((element, index) => {
        element.index = index + 1
      })
    },
    openCreateCheckPaperDialog() {
      this.createCheckPaper = {
        dialog: true,
        form: {}
      }
    },
    async saveCreateCheckPaper() {
      let validate = await this.$refs.createCheckPaperForm.validate()
      if (validate.valid) {
        if (this.checkBookModel.checkPapers?.length > 0) {
          let lastPaper = {
            ...this.checkBookModel.checkPapers[this.checkBookModel.checkPapers.length - 1]
          }
          for (let i = 0; i < this.createCheckPaper.form.paperCount; i++) {
            let paper = {
              index: lastPaper.index + i + 1,
              sayadNumber: '',
              serieCode: this.checkBookModel.serieCode,
              status: 0,
              desc: '',
              serialNumber: lastPaper.serialNumber + i + 1
            }
            this.checkBookModel.checkPapers.push(paper)
          }
        } else {
          this.checkBookModel.checkPapers = []
          for (let i = 0; i < this.createCheckPaper.form.paperCount; i++) {
            let paper = {
              index: i + 1,
              sayadNumber: '',
              serieCode: this.checkBookModel.serieCode,
              status: 0,
              desc: '',
              serialNumber: parseInt(this.createCheckPaper.form.firstCheckPaperSerialNumber) + i
            }
            this.checkBookModel.checkPapers.push(paper)
          }
        }
        this.createCheckPaper.dialog = false
      }
    },
    async createCheckBook() {
      let validate = await this.$refs.createCheckBookForm.validate()
      if (validate.valid) {
        this.checkBookModel = { ...this.checkBookEditModel }
        this.checkBookModel.isNew = false
        this.checkBookModel.editMode = false
        if (this.checkBookModel.checkPapers?.length > 0)
          this.checkBookModel.checkPapers.forEach((element) => {
            element.serieCode = this.checkBookEditModel.serieCode
          })
      }
    },
    async isValidTab(tab) {
      switch (tab) {
        case 0: {
          if (this.selectedBank) {
            if (this.selectedBank.bankAccountNumber && this.selectedBank.iBan) return true
            return this.$t('noAccountNumberAndShabaInSelectedBank')
          }
          return this.$t('noBankSelected')
        }
        case 1: {
          const validation = await this.$refs.checkPaperTableRef.validate()
          if (validation.valid) return true
          else return this.$t('enterTheCheckPapersCorrectly')
        }
        default:
          break
      }
    },
    async setTab(tab) {
      switch (tab) {
        case 0: {
          await this.getBanks()
          break
        }
        case 1: {
          this.checkBookModel.bankId = this.selectedBank.id
          this.checkBookModel.bankName = this.selectedBank.name
          this.checkBookModel.iBan = this.selectedBank.iBan
          this.checkBookModel.bankAccountNumber = this.selectedBank.bankAccountNumber
          if (this.checkBookModel.isNew) this.checkBookEditModel = { ...this.checkBookModel }
        }
        default:
          break
      }
    },
    async getBanks() {
      await detailedAccountService.getByFamily(4).then((res) => {
        if (res.isSuccess) {
          this.bankItems = res.entities
          res.entities.forEach((item, index) => {
            let extra =
              item.extraAttributes == '' ? { parentName: '' } : JSON.parse(item.extraAttributes)
            res.entities[index] = { ...item, ...extra }
          })
          if (!this.selectedBank && this.currentActiveTab.params.id == 'new')
            this.selectedBank = res.entities[0]
        } else this.setErrorMessage(res.message)
      })
    },
    async getById() {
      var res = await transferService.getCheckBookById(this.id)
      if (res.isSuccess) {
        this.selectedBank = this.bankItems.filter((a) => a.id == res.entity.bankId)[0]
        this.checkBookModel = {
          isNew: false,
          editMode: true,
          bankId: res.entity.bankId,
          title: res.entity.title,
          iBan: res.entity.iBan,
          bankAccountNumber: res.entity.bankAccountNumber,
          desc: res.entity.desc,
          id: res.entity.id,
          serieCode: res?.entity?.checkPapers[0]?.serieCode,
          checkPapers: res.entity.checkPapers
        }
        this.checkBookEditModel = { ...this.checkBookModel }
        this.$refs.transferStepper.setTab(1)
      } else {
        this.setErrorMessage(res.message)
        this.shouldLeave = true
        this.$router.push('/transfer/checkBookList')
      }
    },
    onkeydown(e) {
      if (this.showQrCodeScanner && e.keyCode == 27) this.showQrCodeScanner = false
      if (this.editCheckPaper.dialog && e.keyCode == 27)
        if (this.showQrCodeScanner) this.showQrCodeScanner = false
        else this.editCheckPaper.dialog = false
    }
  },
  async mounted() {
    let id = this.currentActiveTab.params.id
    document.addEventListener('keydown', this.onkeydown)
    await this.getBanks()
    if (id != 'new') {
      this.id = id
      this.getById()
    }
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  beforeRouteLeave(to, from) {
    if (this.$refs.transferStepper?.tab > 0) {
      if (!this.shouldLeave)
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.shouldLeave = true
          this.$router.push(to.href)
        })
      return this.shouldLeave
    }
  },
  watch: {
    selectedBank(value, oldValue) {
      if (value?.id != oldValue?.id && oldValue != null) {
        this.checkBookModel.isNew = true
        this.checkBookModel.editMode = true
        this.checkBookModel.checkPapers = []
        this.checkBookModel.serieCode = ''
        this.checkBookModel.title = ''
        this.checkBookModel.firstCheckPaperSerialNumber = ''
        this.checkBookModel.paperCount = ''
        this.checkBookModel.desc = ''
      }
    }
  },
  components: {
    transferStepper,
    dataTable
  }
}
</script>

<style>
.checkPapers-table .v-field--variant-solo,
.v-field--variant-solo-filled {
  box-shadow: none !important;
}
.add-new-btn {
  cursor: pointer;
  float: left;
  position: absolute;
  width: 6rem;
  top: 50px;
  left: 40px;
  z-index: 1000;
}
</style>
