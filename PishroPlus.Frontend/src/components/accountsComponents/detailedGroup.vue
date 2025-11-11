<template>
  <v-dialog close-on-back persistent v-model="addGroupDialog.show" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-format-list-group" />
        <p style="font-weight: bold">
          {{ addGroupDialog.isEdit ? $t('editCategory') : $t('defineCategory') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="handleCloseAddGroupDialog"
            variant="text"
          />
        </div>
      </v-row>
      <v-form
        ref="addGroupForm"
        @submit.prevent="saveAdd"
        @input="
          () => {
            if (!addGroupDialog.hasChanged) addGroupDialog.hasChanged = true
          }
        "
      >
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('accountDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('categoryCode') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <v-text-field
                  autofocus
                  :disabled="isAutomateCode"
                  name="categoryCode"
                  type="number"
                  :rules="[
                    (v) => {
                      if (v || isAutomateCode) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addGroupDialog.form.code"
                  style="max-width: 100px"
                ></v-text-field>
                <switch-button
                  v-if="!addGroupDialog.isEdit"
                  class="mb-5 ms-2"
                  v-model:checked="isAutomateCode"
                  :label="isAutomateCode ? $t('automatic') : $t('manual')"
                  style="width: 130px"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('parentCategory') }}:</v-col>
              <v-col class="pb-0 d-flex" cols="12" sm="9">
                <v-autocomplete
                  v-model="addGroupDialog.form.parentId"
                  :items="items"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  item-title="name"
                  item-value="id"
                  :label="$t('parentCategory')"
                  density="compact"
                  variant="outlined"
                  :no-data-text="$t('noItems')"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('categoryName') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="categoryName"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addGroupDialog.form.name"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('description') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="description"
                  variant="outlined"
                  density="compact"
                  v-model="addGroupDialog.form.desc"
                ></v-text-field>
              </v-col>
              <!-- <v-col class="my-auto" cols="12" sm="3">{{ $t('discountPercent') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="discountPercent"
                  variant="outlined"
                  density="compact"
                  prefix="%"
                  type="number"
                  v-model="addGroupDialog.form.extraAttributes.discountPercent"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('discountAmount') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="discountAmount"
                  variant="outlined"
                  density="compact"
                  type="number"
                  v-model="addGroupDialog.form.extraAttributes.discountAmount"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('purchaseTax') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="purchaseTax"
                  variant="outlined"
                  density="compact"
                  prefix="%"
                  type="number"
                  v-model="addGroupDialog.form.extraAttributes.purchaseTax"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('salesTax') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="salesTax"
                  variant="outlined"
                  density="compact"
                  prefix="%"
                  type="number"
                  v-model="addGroupDialog.form.extraAttributes.salesTax"
                ></v-text-field>
              </v-col> -->
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
    <v-card-text>
      <data-table
        :items="items"
        :headers="headers"
        :hasSearch="true"
        :searchItems="['description', 'code', 'name', 'hierarchicalCode']"
      >
        <template v-slot:toolbar>
          <v-row class="ps-2" no-gutters>
            <v-btn
              @click="openAddGroup"
              prepend-icon="mdi mdi-format-list-group-plus"
              variant="tonal"
              color="info"
              >{{ $t('createCategory') }}</v-btn
            >
            <report-output />
          </v-row>
        </template>
        <template v-slot:column_index="{ entity }">
          <p>{{ items.indexOf(entity) + 1 }}</p>
        </template>
        <template v-slot:column_title="{ entity }">
          <v-tooltip location="top" :text="entity.hierarchyName">
            <template v-slot:activator="{ props }">
              <p class="w-100" v-bind="props">{{ entity.name }}</p>
            </template>
          </v-tooltip>
        </template>
        <template v-slot:column_discountPercent="{ entity }">
          <p>{{ getValueFromExtraAttribute(entity, 'discountPercent') }}</p>
        </template>
        <template v-slot:column_discountAmount="{ entity }">
          <p>{{ getValueFromExtraAttribute(entity, 'discountAmount') }}</p>
        </template>
        <template v-slot:column_purchaseTax="{ entity }">
          <p>{{ getValueFromExtraAttribute(entity, 'purchaseTax') }}</p>
        </template>
        <template v-slot:column_salesTax="{ entity }">
          <p>{{ getValueFromExtraAttribute(entity, 'salesTax') }}</p>
        </template>
        <template v-slot:column_operations="{ entity }">
          <v-row class="d-none d-md-flex justify-center">
            <v-tooltip :text="$t('editCategory')">
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
            <v-tooltip :text="$t('viewInTreeView')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="treeViewIcon"
                  variant="text"
                  color="secondary"
                  size="x-small"
                  :to="`/accounting/detailedAccountsTreeView?detailedAccountId=${entity.id}`"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('deleteCategory')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="deleteIcon"
                  variant="text"
                  color="error"
                  size="x-small"
                  @click="() => openDelete(entity)"
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
                    :title="$t('editCategory')"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                    </template>
                  </v-list-item>
                  <v-list-item
                    density="compact"
                    :to="`/accounting/detailedAccountsTreeView?detailedAccountId=${entity.id}`"
                    :title="$t('viewInTreeView')"
                  >
                    <template v-slot:prepend>
                      <v-icon :icon="treeViewIcon" color="secondary" />
                    </template>
                  </v-list-item>
                  <v-list-item
                    density="compact"
                    @click.prevent="() => openDelete(entity)"
                    :title="$t('deleteCategory')"
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
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import reportOutput from '../baseComponents/reportOutput.vue'
import dataTable from '../baseComponents/datatable/datatable.vue'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
import accountService from '../../../api/account/accountService'
import switchButton from '../baseComponents/switchButton.vue'
import saveIcon from '../icons/Save.vue'
import deleteIcon from '../icons/Delete.vue'
import treeViewIcon from '../icons/AccountingTreeView.vue'

export default {
  props: {
    family: {
      required: true
    }
  },
  data() {
    return {
      saveIcon: markRaw(saveIcon),
      deleteIcon: markRaw(deleteIcon),
      treeViewIcon: markRaw(treeViewIcon),
      isAutomateCode: true,
      items: [],
      addGroupDialog: {
        show: false,
        form: {
          extraAttributes: {},
          isActive: true
        }
      },
      headers: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '200px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'hierarchyCode',
          width: '140px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'description',
          width: '250px'
        },
        // {
        //   title: this.$t('discountPercent'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'discountPercent',
        //   minWidth: '80px'
        // },
        // {
        //   title: this.$t('discountAmount'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'discountAmount',
        //   minWidth: '80px'
        // },
        // {
        //   title: this.$t('purchaseTax'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'purchaseTax',
        //   minWidth: '80px'
        // },
        // {
        //   title: this.$t('salesTax'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'salesTax',
        //   minWidth: '80px'
        // },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '90px',
          minWidth: '80px',
          fixed: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    getValueFromExtraAttribute(entity, key) {
      const ea = entity.extraAttributes ? JSON.parse(entity.extraAttributes) : ''
      return ea.hasOwnProperty(key) ? ea[key] : ''
    },
    viewInTreeView(entity) {
      localStorage.setItem('selectedDetailedAccountId', entity.id)
      this.$router.push(`/accounting/treeViewDetailedAccounts?detailedAccountId=${entity.id}`)
    },
    handleCloseAddGroupDialog() {
      if (this.addGroupDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.addGroupDialog.show = false
        })
      } else this.addGroupDialog.show = false
    },
    openAddGroup() {
      this.isAutomateCode = true
      this.addGroupDialog = {
        show: true,
        form: {
          extraAttributes: {},
          isActive: true
        }
      }
    },
    openEditDialog(entity) {
      this.addGroupDialog = {
        show: true,
        isEdit: true,
        form: {
          // extraAttributes: { ...extraAttributes },
          id: entity.id,
          code: entity.code,
          name: entity.name,
          parentId: entity.parentId,
          desc: entity.description,
          isActive: entity.isActive
        }
      }
    },
    openDelete(item) {
      this.setWarningDialog(true, this.$t('deleteCategory'), this.$t('confirmDeleteMessage'), () =>
        this.deleteAccount(item.id)
      )
    },
    async deleteAccount(id) {
      await detailedAccountService.delete(id).then((res) => {
        if (res == '') {
          this.setErrorMessage(this.$t('categoryDeletedSuccessfully'), 'success')
          this.closeWarning()
          this.getAllData(this.tab)
        } else this.setErrorMessage(res.message)
      })
    },
    async saveAdd() {
      const validation = await this.$refs.addGroupForm.validate()
      if (validation.valid) {
        let request = {
          code: this.addGroupDialog.form.code || null,
          creditAmount: Number(this.addGroupDialog.form.creditAmount || 0),
          debitAmount: Number(this.addGroupDialog.form.debtAmount || 0),
          description: this.addGroupDialog.form.desc || null,
          isBanned: this.addGroupDialog.form?.isBanned ?? false,
          isActive: this.addGroupDialog.form?.isActive ?? false,
          name: this.addGroupDialog.form.name,
          parentId: this.addGroupDialog.form?.parentId,
          type: 3,
          family: this.family,
          children: this.addGroupDialog.form.detailedAccounts,
          maximumChildCodeLength: 10
          // attributes: Object.entries(this.addGroupDialog.form?.extraAttributes).map(
          //   ([key, value]) => ({
          //     key,
          //     value,
          //     action: 1,
          //     id: null,
          //     validation: null
          //   })
          // )
        }
        if (this.addGroupDialog.isEdit) {
          request.id = this.addGroupDialog.form.id
          await detailedAccountService.update(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('categoryEditedSuccessfully'), 'success')
              this.isAutomateCode = true
              this.addGroupDialog.show = false
              this.getAllData()
            } else this.setErrorMessage(res.message)
          })
        } else
          await detailedAccountService.create(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('categoryCreatedSuccessfully'), 'success')
              this.isAutomateCode = true
              this.addGroupDialog.show = false
              this.getAllData()
            } else this.setErrorMessage(res.message)
          })
      }
    },
    async getAllData() {
      const params = {
        accountType: 3,
        accountFamily: this.family,
        leafAccounts: false
      }
      await accountService.advancedSearch(params).then((res) => {
        if (res.isSuccess) this.items = res.value.result
        else this.setErrorMessage(res.message)
      })
    },
    onkeydown(e) {
      if (this.addGroupDialog.show && e.keyCode == 27) this.handleCloseAddGroupDialog()
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
    await this.getAllData()
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  watch: {
    isAutomateCode(value) {
      if (value == true) this.addGroupDialog.form.code = null
    }
  },
  components: {
    reportOutput,
    dataTable,
    switchButton
  }
}
</script>

<style></style>
