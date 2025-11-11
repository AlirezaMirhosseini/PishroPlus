<template>
  <info
    v-model:show="showSelectStatus"
    :title="$t('select') + ' ' + $t('status')"
    :desc="$t('selectVouchersStatusMessage')"
    @submitForm="saveChangeStatus"
    v-model:isVal="isChangeStatusformValidate"
  >
    <template v-slot:body>
      <p class="selected-voucher-text text-grey pishro-caption">
        {{ $t('selectedVoucher') + ': ' + selectedItems.length }}
      </p>
      <v-row
        class="align-center my-2"
        v-for="(group, index) in Object.keys(showingSelectedItemsByStatus)"
        :key="index"
        no-gutters
        style="row-gap: 8px"
      >
        <v-icon
          class="me-2"
          v-if="loadingStatus && showingSelectedItemsByStatus[group].isSuccess"
          icon="mdi mdi-check-circle-outline"
          color="success"
        />
        <v-icon
          class="me-2"
          v-if="loadingStatus && !showingSelectedItemsByStatus[group].isSuccess"
          icon="mdi mdi-close-circle-outline"
          color="error"
        />
        <p>{{ $t('from') }}</p>
        <v-select
          class="mx-2"
          readonly
          density="compact"
          hide-details
          :value="
            getStatusText(Number.parseInt(group)) +
            ` (${showingSelectedItemsByStatus[group].length})`
          "
          :items="[
            getStatusText(Number.parseInt(group)) +
              ` (${showingSelectedItemsByStatus[group].length})`
          ]"
          variant="outlined"
          style="max-width: 150px; min-width: 150px"
        ></v-select>
        <p>{{ $t('to') }}</p>
        <v-select
          class="mx-2"
          density="compact"
          hide-details
          :rules="[
            (v) => {
              if (v) return true
              return $t('enterRequiredField')
            }
          ]"
          v-model="showingSelectedItemsByStatus[group].targetStatus"
          :items="getChangeStatusSelectItems(Number.parseInt(group))"
          :disabled="loadingStatus"
          item-title="title"
          item-value="value"
          variant="outlined"
          style="max-width: 150px; min-width: 150px"
        ></v-select>
        <v-btn
          v-if="
            Object.keys(selectedItemsByStatus).length > 1 &&
            index == 0 &&
            Object.keys(showingSelectedItemsByStatus).length <
              Object.keys(selectedItemsByStatus).length
          "
          @click="addChangeStatusRow"
          :disabled="loadingStatus"
          class="rounded"
          color="info"
          variant="tonal"
          icon="mdi mdi-plus"
          size="40"
        ></v-btn>
        <v-btn
          v-else-if="Object.keys(selectedItemsByStatus).length > 1"
          :disabled="loadingStatus"
          @click="removeChangeStatusRow(group)"
          class="rounded"
          color="error"
          variant="tonal"
          icon="mdi mdi-minus"
          size="40"
        ></v-btn>
      </v-row>
    </template>
    <template v-slot:action>
      <v-btn :disabled="loadingStatus" type="submit" color="info" variant="flat">{{
        $t('confirm')
      }}</v-btn>
    </template>
  </info>
  <v-card>
    <v-card-text class="px-2">
      <v-row class="flex-grow-1 pa-2" no-gutters>
        <v-col cols="12">
          <data-table
            :hasSearch="true"
            :searchItems="['date', 'code', 'desc']"
            :headers="tableHeaders"
            :items="showingDocuments"
            :isServerSide="true"
            :page="paginationModel.page"
            :pageSize="paginationModel.pageSize"
            :totalCount="totalCount"
            :clickableRow="true"
            @update:page="updatePage"
            @update:pageSize="updatePageSize"
            :preventClientSideSearch="true"
            :selectableRow="$vuetify.display.smAndDown"
            v-model:selectedRow="selectedRow"
            @enterMethod="onRowDblClick"
          >
            <template v-slot:toolbar>
              <v-row class="ms-4" no-gutters>
                <v-btn
                  to="/accounting/registerVoucher/create/new"
                  variant="tonal"
                  :prepend-icon="newDocumentIcon"
                  color="primary"
                  >{{ $t('newVoucher') }}</v-btn
                >
                <v-btn
                  @click="changeStatus"
                  class="ms-2"
                  variant="tonal"
                  :prepend-icon="changeStatusIcon"
                  color="info"
                  >{{ $t('changeStatus') }}</v-btn
                >
                <v-spacer></v-spacer>
                <!-- <report-output /> -->
              </v-row>
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
            <template v-slot:column_showingStatus="{ entity }">
              <v-chip class="w-100 justify-center" :color="getStatusColor(entity.status)">{{
                entity.showingStatus
              }}</v-chip>
            </template>
            <template v-slot:column_operations="{ entity }">
              <v-row class="d-none d-md-flex justify-center" style="width: 120px">
                <v-tooltip :text="$t('view')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      variant="text"
                      size="x-small"
                      :to="`/accounting/registerVoucher/view/${entity.id}`"
                      color="primary"
                      icon="mdi mdi-eye-outline"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('edit')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :disabled="[2, 3].indexOf(entity.status) > -1"
                      variant="text"
                      size="x-small"
                      :to="`/accounting/registerVoucher/edit/${entity.id}`"
                      color="info"
                      icon="mdi mdi-square-edit-outline"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('delete')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :disabled="[2, 3].indexOf(entity.status) > -1"
                      variant="text"
                      size="x-small"
                      @click="deleteDocument(entity)"
                      color="error"
                      :icon="deleteIcon"
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
                        :to="`/accounting/registerVoucher/view/${entity.id}`"
                        :title="$t('view')"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi mdi-eye-outline" color="primary" />
                        </template>
                      </v-list-item>
                      <v-list-item
                        :disabled="[2, 3].indexOf(entity.status) > -1"
                        density="compact"
                        :to="`/accounting/registerVoucher/edit/${entity.id}`"
                        :title="$t('edit')"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                        </template>
                      </v-list-item>
                      <v-list-item
                        :disabled="[2, 3].indexOf(entity.status) > -1"
                        density="compact"
                        @click.prevent="deleteDocument(entity)"
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
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import voucherService from '../../../api/voucher/voucherService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import changeStatusIcon from '../../components/icons/ChangeStatus.vue'
import newDocumentIcon from '../../components/icons/AccountingRegisterDocument.vue'
import deleteIcon from '../../components/icons/Delete.vue'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../plugins/utils'
import { markRaw } from 'vue'
import info from '../../components/baseComponents/info.vue'
import reportOutput from '../../components/baseComponents/reportOutput.vue'

export default {
  data() {
    return {
      loadingStatus: false,
      isChangeStatusformValidate: false,
      selectedItems: [],
      selectedItemsByStatus: [],
      showingSelectedItemsByStatus: [],
      showSelectStatus: false,
      checkAllIndeterminate: false,
      documents: [],
      items: [],
      totalCount: 0,
      paginationModel: {
        page: 1,
        pageSize: 10
      },
      selectedRow: null,
      newDocumentIcon: markRaw(newDocumentIcon),
      changeStatusIcon: markRaw(changeStatusIcon),
      deleteIcon: markRaw(deleteIcon),
      tableHeaders: [
        {
          title: '',
          align: 'center',
          key: 'checkbox',
          width: '30px',
          sortable: true,
          notShowInSetting: true
        },
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'showingIndex',
          width: '0'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'date',
          width: '0'
        },
        {
          title: this.$t('voucherNumber'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '100px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '300px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'showingStatus',
          width: '0'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          key: 'operations',
          fixed: true,
          width: '0'
        }
      ]
    }
  },
  computed: {
    showingDocuments() {
      return this.items.map((item, index) => ({
        id: item.id,
        showingIndex: ((this.paginationModel.page - 1) * this.paginationModel.pageSize) + index + 1,
        date: utils.showDate(item.date),
        code: item.code,
        desc: item.description,
        status: item.status,
        showingStatus: utils.showDocumentStatus(item.status).text,
        checkbox: item.checkbox || false,
        statusColor: utils.showDocumentStatus(item.status).color
      }));
    },
    checkAll: {
      get() {
        if (this.documents.some((a) => a.checkbox)) {
          if (this.documents.every((a) => a.checkbox)) {
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
        this.documents.forEach((element) => {
          element.checkbox = value
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
    onRowDblClick(item) {
      if (item?.id) {
        this.$router.push(`/accounting/registerVoucher/view/${item.id}`);
      }
    },
    getChangeStatusSelectItems(status) {
      switch (status) {
        case 0:
          return [{ title: this.$t('operational'), value: 1 }]
        case 1:
          return [{ title: this.$t('confirmed'), value: 2 }]
        // case 2:
        //   return [
        //     { title: this.$t('operational'), value: 1 },
        //     { title: this.$t('finalized'), value: 3 }
        //   ]
        case 2:
          return [{ title: this.$t('operational'), value: 1 }]
        // case 3:
        //   return [{ title: this.$t('confirmed'), value: 2 }]
        default:
          return []
      }
    },
    addChangeStatusRow() {
      let diff = Object.keys(this.selectedItemsByStatus).filter(
        (x) => !Object.keys(this.showingSelectedItemsByStatus).includes(x)
      )
      this.showingSelectedItemsByStatus[diff[0]] = this.selectedItemsByStatus[diff[0]]
    },
    removeChangeStatusRow(group) {
      delete this.showingSelectedItemsByStatus[group]
    },
    async saveChangeStatus() {
      if (this.isChangeStatusformValidate.valid) {
        this.loadingStatus = true
        await this.sendChangeStatusToApi().then(() => {
          let hasError = false
          Object.keys(this.showingSelectedItemsByStatus).forEach((element) => {
            if (this.showingSelectedItemsByStatus[element].error) {
              hasError = true
              this.setErrorMessage(this.showingSelectedItemsByStatus[element].error)
            }
          })
          if (!hasError) {
            this.setErrorMessage(this.$t('successfullChangeVoucherStatusMessage'), 'success')
            this.showSelectStatus = false
          }
          this.loadVouchers()
        })
      } else this.setErrorMessage(this.$t('enterTheVoucherTargetStatusMessage'))
    },
    async sendChangeStatusToApi() {  
      for await (const element of Object.keys(this.showingSelectedItemsByStatus)) {
        const currentGroup = this.showingSelectedItemsByStatus[element];
        let allSuccess = true;
        let errors = [];

        for await (const item of currentGroup) {
          let stat = null;
          
          if (currentGroup.targetStatus == 1) {
            stat = await this.makeOperational(item.id);
          } else if (currentGroup.targetStatus == 2) {
            stat = await this.confirm(item.id);
          }
          // else if (this.showingSelectedItemsByStatus[element].targetStatus == 3)
          //   stat = await this.finalize(this.showingSelectedItemsByStatus[element].map((a) => a.id))

          if (stat !== true) {
            allSuccess = false;
            if (stat.errors) {
              errors = errors.concat(stat.errors);
            }
          }
        }
        currentGroup.isSuccess = allSuccess;
        if (!allSuccess) {
          currentGroup.error = errors;
        }
      }
    },
    changeStatus() {
      this.selectedItems = this.showingDocuments.filter((a) => a.checkbox)
      if (this.selectedItems?.length > 0) {
        this.showSelectStatus = true
        this.loadingStatus = false
        this.selectedItemsByStatus = this.selectedItems.reduce((group, item) => {
          const { status } = item
          group[status] = group[status] ?? []
          group[status].push(item)
          return group
        }, {})
        this.showingSelectedItemsByStatus = { ...this.selectedItemsByStatus }
      } else this.setErrorMessage(this.$t('noVoucherSelected'))
    },
    deleteDocument(item) {
      this.setWarningDialog(true, this.$t('deleteVoucher'), this.$t('confirmDeleteMessage'), () =>
        this.delete(item.id)
      )
    },
    changeCB(value, item) {
      // this.documents.filter((a) => a.id == item.id)[0].checkbox = value
      const foundItem = this.items.find(a => a.id === item.id);
      if (foundItem) {
        foundItem.checkbox = value;
      }
    },
    getStatusColor(status) {
      return utils.showDocumentStatus(status).color
    },
    getStatusText(status) {
      return utils.showDocumentStatus(status).text
    },
    async delete(id) {
      await voucherService.delete(id).then((res) => {
        if (res.status === 204) {
          this.setErrorMessage(this.$t('voucherSuccessfullyDeleted'), 'success');
          this.closeWarning();
          this.loadVouchers();
        } else {
          if (res.errors && res.errors.length > 0) {
            this.setErrorMessage(res.errors[0].message)
          } else {
            this.setErrorMessage(this.$t('deleteError'))
          }
        }
      })
    },
    async makeOperational(id) {
      let output = null
      var res = await voucherService.makeOperational(id)
      if (res.isSuccess) {
        output = true
        await this.$nextTick(() => {
          const foundItem = this.items.find(item => item.id === id);
          if (foundItem) {
            foundItem.status = 1;
            foundItem.showingStatus = utils.showDocumentStatus(1).text;
          }
        });
      } else {
        var errorMessage = res.message
        if (res.errors?.length > 0) {
          errorMessage = ''
          res.errors.forEach((error) => {
            errorMessage += error + '\n'
          })
          errorMessage = errorMessage.slice(0, -1)
        }
        output = { status: false, errors: errorMessage }
      }
      return output
    },
    async confirm(id) {
      let ouput = null
      var res = await voucherService.confirm(id)
      if (res.isSuccess) ouput = true
      else {
        var errorMessage = res.message
        if (res.errors?.length > 0) {
          errorMessage = ''
          res.errors.forEach((error) => {
            errorMessage += error + '\n'
          })
          errorMessage = errorMessage.slice(0, -1)
        }
        ouput = { status: false, errors: errorMessage }
      }
      return ouput
    },
    // async finalize(ids) {
    //   let ouput = null
    //   var res = await voucherService.finalize(ids)
    //   if (res.isSuccess) ouput = true
    //   else {
    //     var errorMessage = res.message
    //     if (res.errors?.length > 0) {
    //       errorMessage = ''
    //       res.errors.forEach((error) => {
    //         errorMessage += error + '\n'
    //       })
    //       errorMessage = errorMessage.slice(0, -1)
    //     }
    //     ouput = { status: false, errors: errorMessage }
    //   }
    //   return ouput
    // },
    async loadVouchers() {
      const result = await voucherService.getAll(
        this.paginationModel.page,
        this.paginationModel.pageSize
      );
        
      if (result.isSuccess) {
        this.items = result.value.result.map(item => ({
          ...item,
          checkbox: false
        }));
        this.totalCount = result.value.totalCount;
      } else {
        this.setErrorMessage(this.$t('errorLoadingData'));
      }
    },

    updatePage(newPage) {
      this.paginationModel.page = newPage;
      this.loadVouchers();
    },

    updatePageSize(newPageSize) {
      this.paginationModel.pageSize = newPageSize;
      this.paginationModel.page = 1;
      this.loadVouchers();
    },
    // async getAll() {
    //   await voucherService.getAll().then((res) => {
    //     if (res.isSuccess) {
    //       this.documents = res.value.result.map(item => ({
    //         ...item,
    //         checkbox: false
    //       }))
    //     } else {
    //       if (res.errors && res.errors.length > 0) {
    //         this.setErrorMessage(res.errors[0])
    //       } else {
    //         this.setErrorMessage(this.$t('errorLoadingVouchers'))
    //       }
    //     }
    //   })
    // },
  },
  async mounted() {
    // await this.getAll()
    await this.loadVouchers();
  },
  components: {
    dataTable,
    info,
    reportOutput
  }
}
</script>

<style>
.selected-voucher-text {
  position: absolute;
  top: 5px;
  width: 100%;
  text-align: end;
  padding-inline-end: 30px;
  opacity: 0.8;
}

.status-help-strip {
  width: 20px;
  height: 4px;
  border-radius: 4px;
}

</style>
