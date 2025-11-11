<template>
  <v-dialog v-model="linkProductToWarehouseDialog" max-width="75%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi-format-list-checkbox" />
        <p style="font-weight: bold">
          {{ $t('linkProductToWarehouse') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="linkProductToWarehouseDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <data-table
          :headers="productHeaders"
          :items="
            products?.filter((i) =>
              showProductsType ? (showProductsType == 1 ? i.checked : !i.checked) : true
            )
          "
          :hasSearch="true"
          :searchText="productDialogSearchTxt"
          :searchItems="['title', 'code', 'salesPrice', 'categoryTitle', 'stock']"
          :key="dtKey"
        >
          <template v-slot:toolbar>
            <v-row no-gutters class="ga-2 px-2">
              <v-select
                hide-details
                variant="outlined"
                density="compact"
                :items="showProductsList"
                item-value="id"
                item-title="title"
                v-model="showProductsType"
                style="max-width: 250px"
              ></v-select>
              <v-select
                class="ms-auto"
                hide-details
                :label="$t('category')"
                :placeholder="$t('selectCategory')"
                variant="outlined"
                density="compact"
                style="max-width: 250px"
                :items="productCategories"
                item-value="parentDetailedAccountId"
                item-title="parentDetailedAccountName"
                v-model="selectedCategoryAccountFilterId"
                @update:modelValue="searchProducts"
                clearable
              ></v-select>
            </v-row>
          </template>
          <template v-slot:column_checkbox="{ entity }">
            <div class="d-flex justify-center" style="margin: -10px">
              <v-checkbox
                :model-value="entity.checked || false"
                @change="(ev) => (entity.checked = ev.target.checked)"
                hide-details
                density="compact"
              />
            </div>
          </template>
          <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
          <template v-slot:column_purchasePrice="{ entity }">
            <div class="d-flex align-center ga-1 justify-center">
              <p>
                {{ entity.prices?.find((p) => p.type == 0)?.price?.toLocaleString() || 0 }}
              </p>
              <p class="pishro-caption">
                {{ entity.prices?.find((p) => p.type == 0)?.currency.name }}
              </p>
            </div>
          </template>
          <template v-slot:column_salesPrice="{ entity }">
            <div class="d-flex align-center ga-1 justify-center">
              <p>
                {{ entity.prices?.find((p) => p.type == 1)?.price?.toLocaleString() || 0 }}
              </p>
              <p class="pishro-caption">
                {{ entity.prices?.find((p) => p.type == 1)?.currency.name }}
              </p>
            </div>
          </template>
          <template v-slot:column_parentDetailedAccountName="{ entity }">
            {{ entity.parentDetailedAccount?.name || '' }}
          </template>
        </data-table>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="updateLinkedProducts" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog persistent v-model="selectAccountDialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="treeViewIcon" />
        <p style="font-weight: bold">
          {{ $t('selectAccount') }}
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
          v-model="searchAccountText"
          v-debounce:300="changeSearchText"
        />
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ $t('accountingTreeView') }}
          </legend>
          <tree-view
            v-model="treeViewAccountsShowList"
            @activeChanged="setActiveAccount"
            :hasEnter="selectAccountDialog"
            @enterMethod="saveSelectAccount"
          />
        </fieldset>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="saveSelectAccount" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('select') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog
    close-on-back
    persistent
    v-model="addWarehouseDialog.show"
    width="600px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-store-plus-outline" />
        <p style="font-weight: bold">
          {{ addWarehouseDialog.isEdit ? $t('editWarehouse') : $t('addWarehouse') }}
        </p>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="handleCloseAddDialog" variant="text" />
        </div>
      </v-row>
      <v-form
        ref="addWarehouseForm"
        @submit.prevent="saveAdd"
        @input="
          () => {
            if (!addWarehouseDialog.hasChanged) addWarehouseDialog.hasChanged = true
          }
        "
      >
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('warehouseDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('warehouseCode') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <v-text-field
                  autofocus
                  :disabled="isAutomateCode"
                  name="warehouseCode"
                  type="number"
                  :rules="[
                    (v) => {
                      if (v || isAutomateCode) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.code"
                  style="max-width: 100px"
                ></v-text-field>
                <switch-button
                  v-if="!addWarehouseDialog.isEdit"
                  class="mb-5 ms-2"
                  v-model:checked="isAutomateCode"
                  :label="isAutomateCode ? $t('automatic') : $t('manual')"
                  style="width: 130px"
                />
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('warehouseName') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="warehouseName"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.title"
                ></v-text-field>
              </v-col>

              <v-col class="my-auto" cols="12" sm="3"
                >{{ $t('warehouseOperationalAccount') }}:</v-col
              >
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  class="selectWarehouseAccountField"
                  readonly
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  @focus="() => showSelectAccountDialog('')"
                  name="operationalAccount"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.accountName"
                >
                  <template v-if="selectedAccount" v-slot:append>
                    <v-tooltip :text="$t('clear')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          @click="clearWarehouseAccount"
                          variant="text"
                          color="grey"
                          icon="mdi mdi-close-circle"
                        />
                      </template>
                    </v-tooltip>
                  </template>
                </v-text-field>
              </v-col>

              <v-col class="my-auto" cols="12" sm="3">{{ $t('wareHouseKeeper') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  hide-details
                  name="wareHouseKeeper"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.keeperFullName"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('telephoneNumber') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  hide-details
                  name="phoneNumber"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.telephone"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('address') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  hide-details
                  name="address"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.address"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('postalCode') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  hide-details
                  name="postalCode"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.postalCode"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('description') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  hide-details
                  name="description"
                  variant="outlined"
                  density="compact"
                  v-model="addWarehouseDialog.form.description"
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  color="info"
                  v-model="addWarehouseDialog.form.isActive"
                  :label="$t('warehouseIsActive')"
                  hide-details
                  density="compact"
                />
              </v-col>
              <v-col cols="12" sm="6">
                <v-checkbox
                  color="info"
                  v-model="addWarehouseDialog.form.isDefault"
                  :label="$t('isDefaultWarehouse')"
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
    <v-card-text>
      <v-row no-gutters class="flex-column">
        <!-- <v-row class="align-center" no-gutters>
          <report-output />
        </v-row> -->
        <v-col cols="12" class="align-start pa-2" no-gutters>
          <data-table
            :headers="headers"
            :items="warehouses"
            :hasSearch="true"
            :searchItems="['code', 'title', 'keeperFullName', 'telephone', 'address', 'postalCode']"
            :clickableRow="true"
          >
            <template v-slot:toolbar>
              <v-row class="ps-2" no-gutters>
                <v-btn
                  @click="openAddDialog()"
                  prepend-icon="mdi mdi-store-plus-outline"
                  variant="tonal"
                  color="info"
                  >{{ $t('addWarehouse') }}</v-btn
                >
              </v-row>
            </template>
            <template v-slot:column_index="{ entity }">
              <p>{{ warehouses.indexOf(entity) + 1 }}</p>
            </template>
            <template v-slot:column_isActive="{ entity }">
              <v-icon
                :icon="entity.isActive ? 'mdi mdi-check' : 'mdi mdi-close'"
                :color="entity.isActive ? 'success' : 'error'"
              />
            </template>
            <template v-slot:column_isDefault="{ entity }">
              <v-icon
                :icon="entity.isDefault ? 'mdi mdi-check' : 'mdi mdi-close'"
                :color="entity.isDefault ? 'success' : 'error'"
              />
            </template>
            <template v-slot:column_operations="{ entity }">
              <v-row class="d-none d-md-flex justify-center">
                <v-tooltip :text="$t('viewStock')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="viewStockIcon"
                      variant="text"
                      size="x-small"
                      color="primary"
                      @click="viewStock(entity.id)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('linkProductToWarehouse')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi-format-list-checkbox"
                      variant="text"
                      size="x-small"
                      color="warning"
                      @click="showLinkProductToWarehouseDialog(entity.id)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('editWarehouse')">
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
                <v-tooltip :text="$t('deleteWarehouse')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="deleteIcon"
                      variant="text"
                      color="error"
                      size="x-small"
                      @click="() => openDeleteDialog(entity)"
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
                        :title="$t('editWarehouse')"
                        @click.prevent="() => openEditDialog(entity)"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                        </template>
                      </v-list-item>
                      <v-list-item
                        density="compact"
                        :title="$t('deleteWarehouse')"
                        @click.prevent="() => openDeleteDialog(entity)"
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
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import warehouseService from '../../../../api/warehouse/warehouseService'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import treeView from '../../../components/baseComponents/Treeview/treeview.vue'
import switchButton from '../../../components/baseComponents/switchButton.vue'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import saveIcon from '../../../components/icons/Save.vue'
import treeViewIcon from '../../../components/icons/AccountingTreeView.vue'
import folderIcon from '../../../components/icons/Folder.vue'
import openedFolderIcon from '../../../components/icons/Folder-Opened.vue'
import folderStarIcon from '../../../components/icons/Folder-Star.vue'
import paperIcon from '../../../components/icons/Paper.vue'
import accountService from '../../../../api/account/accountService'
import productService from '../../../../api/product/productService'
import viewStock from '../../../components/icons/viewStock.vue'

export default {
  data() {
    return {
      selectAccountDialog: false,
      warehouses: [],
      isAutomateCode: true,
      searchAccountText: '',
      treeViewAccountsShowList: [],
      selectedAccount: null,
      deleteIcon: markRaw(deleteIcon),
      saveIcon: markRaw(saveIcon),
      treeViewIcon: markRaw(treeViewIcon),
      folderIcon: markRaw(folderIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      folderStarIcon: markRaw(folderStarIcon),
      paperIcon: markRaw(paperIcon),
      viewStockIcon: markRaw(viewStock),
      addWarehouseDialog: {
        show: false,
        isEdit: false,
        form: {
          code: null
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
          width: '120px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '70px'
        },
        {
          title: this.$t('wareHouseKeeper'),
          align: 'center',
          sortable: true,
          key: 'keeperFullName',
          width: '120px'
        },
        {
          title: this.$t('telephoneNumber'),
          align: 'center',
          sortable: true,
          key: 'telephone',
          width: '100px'
        },
        {
          title: this.$t('address'),
          align: 'center',
          sortable: true,
          key: 'address',
          minWidth: '250px'
        },
        {
          title: this.$t('postalCode'),
          align: 'center',
          sortable: true,
          key: 'postalCode',
          width: '90px'
        },
        {
          title: this.$t('active'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '0'
        },
        {
          title: this.$t('default'),
          align: 'center',
          sortable: true,
          key: 'isDefault',
          width: '0'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '140px',
          fixed: true
        }
      ],
      selectedCategoryAccountFilterId: null,
      selectedWarehouseId: '',
      checkAllIndeterminate: false,
      linkProductToWarehouseDialog: false,
      productDialogSearchTxt: '',
      showProductSelectionDialog: false,
      selectedRow: {},
      selectedRowIndex: 0,
      productHeaders: [
        {
          title: '',
          align: 'center',
          key: 'checkbox',
          width: '30px',
          sortable: false,
          notShowInSetting: true
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '30px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '150px'
        },
        {
          title: this.$t('purchasePrice'),
          align: 'center',
          sortable: true,
          key: 'purchasePrice',
          width: '100px'
        },
        {
          title: this.$t('salesPrice'),
          align: 'center',
          sortable: true,
          key: 'salesPrice',
          width: '100px'
        },
        {
          title: this.$t('category'),
          align: 'center',
          sortable: true,
          key: 'parentDetailedAccountName',
          width: '100px'
        }
      ],
      dtKey: 0,
      justShowRelatedProducts: false,
      showProductsType: null
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    viewStock(id) {
      this.$router.push({
        path: '/warehouse/products',
        query: {
          warehouseId: id
        }
      })
    },
    openAddDialog() {
      this.isAutomateCode = true
      this.addWarehouseDialog = {
        hasChanged: false,
        show: true,
        isEdit: false,
        form: {
          code: null,
          isActive: true,
          isDefault: false
        }
      }
    },
    handleCloseAddDialog() {
      if (this.addWarehouseDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.addWarehouseDialog.show = false
        })
      } else this.addWarehouseDialog.show = false
    },
    openDeleteDialog(item) {
      this.setWarningDialog(true, this.$t('deleteWarehouse'), this.$t('confirmDeleteMessage'), () =>
        this.deleteWarehouse(item.id)
      )
    },
    onkeydown(e) {
      if (this.addWarehouseDialog.show && e.keyCode == 27)
        if (this.selectAccountDialog) this.selectAccountDialog = false
        else this.handleCloseAddDialog()
    },
    setActiveAccount(item) {
      this.selectedAccount = item
    },
    clearWarehouseAccount() {
      this.selectedAccount = null
      this.addWarehouseDialog.form.accountId = null
      this.addWarehouseDialog.form.accountName = null
    },
    saveSelectAccount() {
      if (!this.selectedAccount) this.setErrorMessage(this.$t('noAccountSelected'))
      else if (this.selectedAccount.children?.length == 0) {
        this.addWarehouseDialog.form.accountId = this.selectedAccount.id
        this.addWarehouseDialog.form.accountName = this.selectedAccount.hierarchicalName

        this.selectAccountDialog = false
      } else this.setErrorMessage(this.$t('selectedAccountIsNotOperational'))
    },
    arrangeItems(list) {
      list.forEach((item) => {
        item.title = item.name + ' ' + item.hierarchicalCode
        item.draggable = false
        // item.icon = item.isGeneralType
        //   ? folderStarIcon
        //   : item.isOperational
        //   ? paperIcon
        //   : folderIcon
        item.icon = item.children?.length > 0 ? folderIcon : paperIcon
        item.openedIcon = item.isOperational || item.isGeneralType ? null : openedFolderIcon
        item.open = this.searchAccountText ? true : false
        item.dblClick = () => this.saveSelectAccount()
        if (item?.children?.length > 0) item.children = this.arrangeItems(item.children)
      })
      return list
    },
    async updateLinkedProducts() {
      if (!this.selectedWarehouseId) return
      let res = await warehouseService.productLink({
        products: Object.fromEntries(this.products?.map((p) => [p.id, p.checked])),
        warehouseId: this.selectedWarehouseId
      })
      if (res.isSuccess) {
        this.linkProductToWarehouseDialog = false
        this.products = []
        this.setErrorMessage(this.$t('productLinkedSuccessfully'), 'success')
      } else this.setErrorMessage(res.message)
    },
    async showLinkProductToWarehouseDialog(warehouseId) {
      this.selectedWarehouseId = warehouseId
      await this.searchProducts()
      this.linkProductToWarehouseDialog = true
    },
    async searchProducts() {
      this.products = []
      await productService
        .getAll(0, null, 1, 1000, this.selectedCategoryAccountFilterId)
        .then(async (res) => {
          if (res.isSuccess) {
            this.products = res.value?.result?.map((x) => {
              return {
                ...x,
                checked: x?.allowedWarehouseIds?.includes(this.selectedWarehouseId) || false,
                typeTitle: x.type === 0 ? this.$t('product') : this.$t('service'),
                type: x.type
              }
            })
            this.dtKey += 1
          } else this.setErrorMessage(res.message)
        })
    },
    async selectProduct() {
      if (this.selectedRow && this.selectedRow.product) {
        this.showProductSelectionDialog = false
      }
    },
    async openEditDialog(item) {
      await warehouseService.getById(item.id).then((res) => {
        if (res.isSuccess) {
          this.isAutomateCode = true
          this.addWarehouseDialog = {
            hasChanged: false,
            show: true,
            isEdit: true,
            form: { ...res.value }
          }
          if (res.value.accountId)
            this.selectedAccount = {
              id: res.value.accountId,
              fName: res.value.accountName
            }
          else this.selectedAccount = null
        } else this.setErrorMessage(res.message)
      })
    },
    async deleteWarehouse(id) {
      await warehouseService.delete({ id: id }).then((res) => {
        if (res == '') {
          this.setErrorMessage(this.$t('warehouseDeletedSuccessfully'), 'success')
          this.closeWarning()
          this.getAllData()
        } else {
          this.setErrorMessage(res.message)
        }
      })
    },
    async saveAdd() {
      const validation = await this.$refs.addWarehouseForm.validate()
      if (validation.valid) {
        let form = this.addWarehouseDialog.form
        let request = {
          code: form?.code,
          title: form?.title,
          keeperFullName: form?.keeperFullName,
          telephone: form?.telephone,
          address: form?.address,
          postalCode: form?.postalCode,
          description: form?.description,
          isDefault: form.isDefault,
          isActive: form.isActive,
          accountId: form?.accountId
        }
        if (this.addWarehouseDialog.isEdit) {
          request.id = form.id
          await warehouseService.update(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('warehouseEditedSuccessfully'), 'success')
              this.addWarehouseDialog.show = false
              this.getAllData()
            } else {
              this.setErrorMessage(res.message)
              if (res.errors?.length > 0) {
                var errorMessage = ''
                res.errors.forEach((error) => {
                  errorMessage += error + '\n'
                })
                this.setErrorMessage(errorMessage.slice(0, -1))
              }
            }
          })
        } else {
          await warehouseService.create(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('warehouseCreatedSuccessfully'), 'success')
              this.addWarehouseDialog.show = false
              this.getAllData()
            } else {
              this.setErrorMessage(res.message)
              if (res.errors?.length > 0) {
                var errorMessage = ''
                res.errors.forEach((error) => {
                  errorMessage += error + '\n'
                })
                this.setErrorMessage(errorMessage.slice(0, -1))
              }
            }
          })
        }
      }
    },
    async getAllData() {
      await warehouseService.getAll().then((res) => {
        if (res.isSuccess) {
          this.warehouses = res.value?.result
        } else this.setErrorMessage(res.message)
      })
    },
    async showSelectAccountDialog(text) {
      this.searchAccountText = text
      await this.searchAccount(text)
      this.selectAccountDialog = true
    },
    async changeSearchText(value) {
      await this.searchAccount(value)
    },
    async searchAccount(text) {
      await accountService.search({ text: text }).then((res) => {
        if (res.isSuccess) {
          let accounts = this.arrangeItems([...res.value])
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: true,
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
    }
  },
  watch: {
    isAutomateCode(value) {
      if (value == true) this.addWarehouseDialog.form.code = null
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
    await this.getAllData()
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  computed: {
    showProductsList() {
      return [
        {
          id: null,
          title: this.$t('showAll')
        },
        {
          id: 1,
          title: this.$t('relatedProducts')
        },
        {
          id: 2,
          title: this.$t('otherProducts')
        }
      ]
    },
    productCategories() {
      let lst = [
        ...new Set(
          this.products
            ?.map((x) => {
              return {
                parentDetailedAccountName: x.parentDetailedAccount?.name,
                parentDetailedAccountId: x.parentDetailedAccount?.id
              }
            })
            .reduce((acc, current) => {
              const x = acc.find(
                (item) => item.parentDetailedAccountId === current.parentDetailedAccountId
              )
              if (!x) {
                acc.push(current)
              }
              return acc
            }, [])
        )
      ]
      return lst || []
    }
  },
  components: {
    dataTable,
    reportOutput,
    switchButton,
    treeView
  }
}
</script>

<style>
.selectWarehouseAccountField .v-input__append {
  margin-inline-start: 0 !important;
}
</style>
