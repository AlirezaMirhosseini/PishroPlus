<template>
  <v-dialog close-on-back persistent v-model="addGroupDialog.show" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-format-list-group-plus" />
        <div>
          <p style="font-weight: bold">
            {{ addGroupDialog.isEdit ? $t('editCategory') : $t('createCategory') }}
          </p>
          <p v-if="selectedAccount" class="text-grey pishro-caption">
            {{ $t('subGroupOf') }} {{ selectedAccount.hierarchicalName }}
          </p>
        </div>
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
        ref="addCategoryForm"
        @submit.prevent="saveAddCategory"
        @input="
          () => {
            if (!addGroupDialog.hasChanged) addGroupDialog.hasChanged = true
          }
        "
      >
        <v-card-text class="py-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('categoryCode') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <v-text-field
                  autofocus
                  :disabled="isAutomateCode"
                  name="accountCode"
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
              <v-col class="my-auto" cols="12" sm="3">{{ $t('categoryName') }}:</v-col>
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

  <v-dialog persistent close-on-back :model-value="show" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-format-list-group" />
        <p style="font-weight: bold">
          {{ $t('selectCategory') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="$emit('update:show', false)"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="px-2">
        <v-row v-if="treeViewAccounts?.length > 0" no-gutters>
          <v-col cols="12" class="d-flex flex-wrap" style="gap: 8px">
            <v-btn
              @click="openAddAccountDialog"
              prepend-icon="mdi mdi-plus"
              variant="tonal"
              color="primary"
              >{{ $t('create') }}</v-btn
            >
            <v-btn
              @click="() => openEdit(selectedAccount)"
              prepend-icon="mdi mdi-square-edit-outline"
              variant="tonal"
              color="info"
              >{{ $t('edit') }}</v-btn
            >
            <v-btn
              @click="() => openDeleteDialog(selectedAccount)"
              :prepend-icon="deleteIcon"
              variant="tonal"
              color="error"
              >{{ $t('delete') }}</v-btn
            >
          </v-col>
          <tree-view
            class="mt-2 w-100"
            v-model="treeViewAccountsShowList"
            @activeChanged="setActiveAccount"
            :hasEnter="show && !(addGroupDialog.show || warningDialog.show)"
            @enterMethod="$emit('save', selectedAccount)"
          />
        </v-row>
        <div
          class="d-flex align-center justify-center h-100 flex-column"
          v-else
          style="min-width: 300px"
        >
          <p>{{ $t('noAccountsFound') }}</p>
          <v-btn
            @click="openAddAccountDialog"
            class="mt-4"
            variant="tonal"
            color="info"
            prepend-icon="mdi mdi-plus"
            >{{ $t('createCategory') }}</v-btn
          >
        </div>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="selectItem" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('select') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { markRaw } from 'vue'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
import treeView from '../baseComponents/Treeview/treeview.vue'
import saveIcon from '../icons/Save.vue'
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../stores/default'
import folderIcon from '../icons/Folder.vue'
import paperIcon from '../icons/Paper.vue'
import openedFolderIcon from '../icons/Folder-Opened.vue'
import deleteIcon from '../icons/Delete.vue'
import switchButton from '../baseComponents/switchButton.vue'

export default {
  data() {
    return {
      saveIcon: markRaw(saveIcon),
      folderIcon: markRaw(folderIcon),
      paperIcon: markRaw(paperIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      deleteIcon: markRaw(deleteIcon),
      treeViewAccounts: [],
      treeViewAccountsShowList: [],
      selectedAccount: null,
      isAutomateCode: true,
      items: [],
      addGroupDialog: {
        show: false,
        form: {
          isActive: true
        }
      }
    }
  },
  props: {
    show: {
      required: true,
      default: false
    },
    onlyParents: {
      required: false,
      default: true
    },
    family: {
      required: true,
      default: 0
    },
    selected: {
      required: false,
      default: null
    }
  },
  emits: ['update:show', 'save'],
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    hideDialog() {
      this.addGroupDialog.show = false
    },
    selectItem() {
      if (this.selectedAccount) {
        const selectedItem = {
          ...this.selectedAccount,
          hierarchyCode: this.selectedAccount.hierarchicalCode,
          hierarchyName: this.selectedAccount.hierarchicalName,
          id: this.selectedAccount.id,
          name: this.selectedAccount.name,
          fName: this.selectedAccount.hierarchicalName || this.selectedAccount.name,
          code: this.selectedAccount.code
        }

        this.$emit('save', selectedItem)
      } else {
        this.setErrorMessage(this.$t('pleaseSelectCategory'))
      }
    },
    async saveAddCategory() {
      console.log(this.addGroupDialog)
      const { valid } = await this.$refs.addCategoryForm.validate()
      if (valid) {
        let request = {
          name: this.addGroupDialog.form.name,
          code: this.addGroupDialog.form.code,
          type: 3,
          family: this.family,
          debitAmount: 0,
          creditAmount: 0,
          isActive: true,
          isBanned: false,
          description: this.addGroupDialog.form.desc,
          maximumChildCodeLength: 10
        }
        if (this.addGroupDialog.isEdit) {
          request.id = this.selectedAccount.id
          request.parentId = this.addGroupDialog.form.parentId ?? null
          await detailedAccountService.update(request).then((res) => {
            if (res.isSuccess) {
              console.log(res)
              this.setErrorMessage(this.$t('categoryEditedSuccessfully'), 'success')
              this.getAllData()
              this.addGroupDialog = {
                show: false,
                form: {
                  isActive: true
                }
              }
            } else this.setErrorMessage(res.message)
          })
        } else {
          request.parentId = this.selectedAccount?.id ?? null
          console.log(request)
          await detailedAccountService.create(request).then((res) => {
            if (res) {
              console.log(res)
              this.setErrorMessage(this.$t('categoryCreatedSuccessfully'), 'success')
              this.getAllData()
              this.addGroupDialog = {
                show: false,
                form: {
                  isActive: true
                }
              }
            } else this.setErrorMessage(res.message)
          })
        }
      }
    },
    handleCloseAddGroupDialog() {
      if (this.addGroupDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.addGroupDialog.show = false
        })
      } else this.addGroupDialog.show = false
    },
    setActiveAccount(item) {
      this.resetActiveStatus(this.treeViewAccountsShowList)
      item.active = true
      this.selectedAccount = item
    },
    resetActiveStatus(items) {
      if (!items || !items.length) return

      items.forEach((item) => {
        item.active = false
        if (item.children && item.children.length) {
          this.resetActiveStatus(item.children)
        }
      })
    },
    openAddAccountDialog() {
      this.isAutomateCode = true
      this.addGroupDialog = {
        show: true,
        form: {
          isActive: true
        }
      }
    },
    openEdit(item) {
      this.addGroupDialog = {
        show: true,
        isEdit: true,
        form: {
          id: item.id,
          code: item.code,
          name: item.name,
          parentId: item.parentId,
          desc: item.desc,
          isActive: item.isActive
        }
      }
    },
    openDeleteDialog(item) {
      this.setWarningDialog(true, this.$t('deleteCategory'), this.$t('confirmDeleteMessage'), () =>
        this.deleteAccount(item.id)
      )
    },
    async deleteAccount(id) {
      await detailedAccountService.delete(id).then((res) => {
        if (res.isSuccess) {
          this.selectedAccount = null
          this.setErrorMessage(this.$t('categoryDeletedSuccessfully'), 'success')
          this.getAllData()
          this.closeWarning()
        } else this.setErrorMessage(res.message)
      })
    },
    arrangeItems(list) {
      list.forEach((item) => {
        if (item.id == this.selected) this.setActiveAccount(item)
        item.active = this.selectedAccount
          ? item.id == this.selectedAccount.id
            ? true
            : false
          : false
        item.title = item.name + ' ' + item.hierarchicalCode
        item.draggable = false
        item.icon = item?.maximumChildCodeLength > 0 ? folderIcon : paperIcon
        item.openedIcon = item?.children?.length > 0 ? openedFolderIcon : null
        item.open = true
        if (item?.children?.length > 0) item.children = this.arrangeItems(item.children)
        item.contexts = [
          {
            label: this.$t('addAccount'),
            icon: 'mdi mdi-file-document-plus-outline',
            onClick: () => {
              this.setActiveAccount(item)
              this.openAddAccountDialog()
            }
          },
          {
            label: this.$t('edit'),
            icon: 'mdi mdi-square-edit-outline',
            onClick: () => this.openEdit(item)
          },
          {
            label: this.$t('delete'),
            icon: 'mdi mdi-delete',
            onClick: () => this.openDeleteDialog(item)
          }
        ]
        item.dblClick = () => this.openEdit(item)
        if (this.selectedAccount && item.id == this.selectedAccount.id) this.selectedAccount = item
      })
      return list
    },
    async getAllData() {
      const params = {
        accountFamily: this.family,
        leafAccounts: !this.onlyParents,
        page: 1,
        size: 1000
      }
      await detailedAccountService.getAll(params).then((res) => {
        if (res.isSuccess) {
          let accounts = [...res.value]
          this.treeViewAccounts = this.arrangeItems(accounts)
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: false,
              title: this.$t('categories'),
              notClickable: true,
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
                    this.selectedAccount = null
                    this.openAddAccountDialog()
                  }
                }
              ]
            }
          ]
          if (this.selected) {
            this.findAndSelectItem(this.treeViewAccounts, this.selected)
          } else if (this.treeViewAccounts?.length > 0) {
            this.setActiveAccount(this.treeViewAccounts[0])
          }
        } else this.setErrorMessage(res.message)
      })
    },
    findAndSelectItem(items, id) {
      if (!items || !items.length || !id) return false

      for (const item of items) {
        if (item.id === id) {
          this.setActiveAccount(item)
          return true
        }
        if (item.children && item.children.length) {
          const found = this.findAndSelectItem(item.children, id)
          if (found) return true
        }
      }
      return false
    },
    onkeydown(e) {
      if (this.show && e.keyCode == 27)
        if (this.addGroupDialog.show) this.addGroupDialog.show = false
        else this.$emit('update:show', false)
    }
  },
  computed: {
    ...mapState(defaultStore, {
      warningDialog: 'warningDialog'
    })
  },
  watch: {
    isAutomateCode(value) {
      if (value == true) this.addGroupDialog.form.code = null
    },
    show(value) {
      this.$emit('update:show', value)
      if (value) this.getAllData()
    },
    selected(newVal) {
      if (newVal && this.treeViewAccounts.length > 0) {
        this.findAndSelectItem(this.treeViewAccounts, newVal)
      }
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onkeydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  components: {
    treeView,
    switchButton
  }
}
</script>

<style></style>
