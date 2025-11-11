<template>
  <v-card>
    <v-card-text>
      <v-row class="pa-4" no-gutters style="gap: 12px">
        <v-col cols="12">
          <p>{{ $t('document') }}</p>
        </v-col>
        <v-col cols="12">
          <v-checkbox
            hide-details
            density="compact"
            v-model="registerVoucherAfterSaveDocument"
            :label="$t('registerVoucherAfterSaveDocument')"
          />
        </v-col>
        <v-col cols="12">
          <p>{{ $t('show') }}</p>
        </v-col>
        <v-col cols="12">
          <v-select
            v-model="selectedShow"
            :items="showOptions"
            variant="outlined"
            hide-details
            density="compact"
            style="max-width: 300px"
          />
        </v-col>
        <v-col cols="12" class="align-start pa-2" no-gutters>
          <datatable :headers="remittanceHeader" :items="items">
            <template v-slot:column_type="{ entity }">
              {{ entity.connectionType === 0 ? $t('LAN') : $t('USB') }}
            </template>
            <template v-slot:toolbar>
              <v-row no-gutters align="center">
                <p style="font-weight: bold">{{ $t('BankPos') }}</p>
                <v-btn
                  class="mx-2"
                  color="info"
                  variant="tonal"
                  @click="createORUpdatePOSDialog.show = true"
                >
                  <v-icon size="small">mdi-plus</v-icon>
                  {{ $t('newBankPos') }}
                </v-btn>
              </v-row>
            </template>
            <template v-slot:column_operations="{ entity }">
              <div class="d-flex justify-center">
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
                      @click="() => deleteItems(entity)"
                      variant="text"
                      color="error"
                      size="small"
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>
            <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
          </datatable>
        </v-col>
        <v-dialog v-model="createORUpdatePOSDialog.show" max-width="75%" max-height="75%">
          <v-card>
            <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
              <v-icon color="info" class="ml-2" :icon="poseIcon" />
              <div>
                <p style="font-weight: bold">
                  {{ $t('createBankPos') }}
                </p>
              </div>
              <div class="ms-auto">
                <v-btn
                  color="grey"
                  icon="mdi mdi-close"
                  @click="createORUpdatePOSDialog.show = false"
                  variant="text"
                />
              </div>
            </v-row>
            <v-form
              ref="addWarehouseForm"
              @submit.prevent="createOrUpdatePOS"
              @input="
                () => {
                  if (!createORUpdatePOSDialog.hasChanged) createORUpdatePOSDialog.hasChanged = true
                }
              "
            >
              <v-row class="d-flex mt-2 mb-2 mr-2">
                <v-col md="3" class="px-1 d-flex">
                  <v-text-field
                    name="name"
                    :rules="[
                      (v) => {
                        if (v || isAutoCode) return true
                        return $t('enterRequiredField')
                      }
                    ]"
                    variant="outlined"
                    :label="$t('name')"
                    density="compact"
                    class="ml-2"
                    v-model="createORUpdatePOSDialog.form.name"
                  >
                  </v-text-field>
                </v-col>
                <v-col md="3" class="px-1">
                  <v-select
                    v-model="createORUpdatePOSDialog.form.connectionType"
                    :label="$t('type')"
                    :items="reveiveAndPaySettingItems"
                    variant="outlined"
                    item-value="id"
                    density="compact"
                    hide-details
                  />
                </v-col>
                <template v-if="createORUpdatePOSDialog.form.connectionType == 0">
                  <v-col md="3">
                    <!-- <template v-slot="column_" -->
                    <v-text-field
                      name="IP"
                      :rules="[
                        (v) => {
                          if (v || isAutoCode) return true
                          return $t('enterRequiredField')
                        }
                      ]"
                      v-model="createORUpdatePOSDialog.form.ip"
                      variant="outlined"
                      :label="$t('IP')"
                      density="compact"
                      class="ml-2"
                    />
                  </v-col>
                  <v-col md="3">
                    <v-text-field
                      name="port"
                      :rules="[
                        (v) => {
                          if (v || isAutoCode) return true
                          return $t('enterRequiredField')
                        }
                      ]"
                      v-model.number="createORUpdatePOSDialog.form.port"
                      type="number"
                      variant="outlined"
                      :label="$t('port')"
                      density="compact"
                      class="ml-2"
                    >
                    </v-text-field>
                  </v-col>
                </template>
                <v-col md="5" class="ml-2" v-else>
                  <v-text-field
                    name="serialNumber"
                    :rules="[
                      (v) => {
                        if (v || isAutoCode) return true
                        return $t('enterRequiredField')
                      }
                    ]"
                    v-model="createORUpdatePOSDialog.form.serialNumber"
                    variant="outlined"
                    :label="$t('serialNumber')"
                    density="compact"
                    class="ml-2"
                  >
                  </v-text-field>
                </v-col>
                <!-- <v-col cols="12">
              <v-checkbox
                hide-details
                density="compact"
                v-model="registerVoucherAfterSaveDocument"
                :label="$t('TheConnectionWasStablishedsuccessfully')"
              />
            </v-col> -->
                <v-col cols="12" md="4" class="pa-1">
                  <accountSelector
                    name="connectedBank"
                    :textFieldRules="[
                      (v) => {
                        if (v || buyer) return true
                        return $t('enterRequiredField')
                      }
                    ]"
                    :title="$t('connectedBank')"
                    :persistent="false"
                    :detailedAccountFamily="4"
                    v-model="createORUpdatePOSDialog.form.bankAccount"
                  >
                    <v-text-field> </v-text-field>
                  </accountSelector>
                </v-col>
                <!-- <v-card-title> -->
                <!-- </v-card-title> -->
              </v-row>
              <v-card-actions class="justify-end dialog-bottombar px-5">
                <v-btn
                  @click="createOrUpdatePOS()"
                  :prepend-icon="saveIcon"
                  type="submit"
                  color="info"
                  variant="flat"
                  size="large"
                  :rules="rule"
                  >{{ $t('save') }}
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row style="justify-content: left; margin-top: 5px">
        <v-col>
          <v-btn
            @click="saveData"
            :prepend-icon="saveIcon"
            color="info"
            class="ma-1 float-left"
            >{{ $t('save') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import SaveIcon from '../../components/icons/Save.vue'
import datatable from '../../components/baseComponents/datatable/datatable.vue'
import poseIcon from '../../components/icons/banks/pos.vue'
import POSService from '../../../api/POS/POSService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import deleteIcon from '../../components/icons/Delete.vue'
import accountSelector from '../../components/accountsComponents/accountSelector.vue'
import pos from '../../../api/POS/POSService'
import { markRaw } from 'vue'
export default {
  data() {
    return {
      items: [],
      addWarehouseDialog: {
        show: false,
        isEdit: false,
        form: {
          code: null
        }
      },

      deleteIcon: markRaw(deleteIcon),
      poseIcon: markRaw(poseIcon),
      tab: 0,
      entered: null,
      saveIcon: markRaw(SaveIcon),
      rule: [(v) => !!v || this.$t('enterRequiredField')],
      registerVoucherAfterSaveDocument: false,
      selectedShow: 0,
      showOptions: [
        { title: this.$t('justDetailedAccounts'), value: 0 },
        { title: this.$t('justAccounts'), value: 1 },
        { title: this.$t('showBoth'), value: 2 }
      ],
      reveiveAndPaySettingItems: [
        {
          title: 'LAN',
          id: 0
        },
        {
          title: 'USB',
          id: 1
        }
      ],
      connectedBankItems: [
        {
          title: this.$t('saderatBank'),
          id: 0
        }
      ],
      remittanceHeader: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '50px'
        },
        {
          title: this.$t('name'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '50px'
        },
        {
          title: this.$t('type'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '50px'
        },
        {
          title: this.$t('IP'),
          align: 'center',
          sortable: true,
          key: 'ip',
          width: '50px'
        },
        {
          title: this.$t('port'),
          align: 'center',
          sortable: true,
          key: 'port',
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
      createORUpdatePOSDialog: {
        show: false,
        isEdit: false,
        form: {
          code: null,
          connectionType: 0
        }
      },
      products: [],
      templateEntity: {
        isEdit: false,
        sourceType: 0,
        records: []
      },
      addOrUpdateTemplateRowDialog: false
    }
  },
  components: {
    datatable,
    accountSelector
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    async createOrUpdatePOS() {
      const validition = await this.$refs.addWarehouseForm.validate()
      if (validition.valid) {
        this.createORUpdatePOSDialog.form.bankAccountId =
          this.createORUpdatePOSDialog.form.bankAccount?.selectedDetailedAccount?.detailedAccountId
        await POSService.create({
          entity: { ...this.createORUpdatePOSDialog.form }
        }).then((res) => {
          if (res.isSuccess) {
            this.getAllData()
            this.createORUpdatePOSDialog.show = false
            this.setErrorMessage(this.$t('bankPosCreatedSuccessfully'), 'success')
          } else this.setErrorMessage(res.message)
        })
      }
    },
    async getAllData() {
      await POSService.getAll().then((res) => {
        if (res.isSuccess) {
          this.items = res.entities
        } else this.setErrorMessage(res.message)
      })
    },
    deleteItems(item) {
      this.setWarningDialog(true, this.$t('deleteItems'), this.$t('confirmDeleteMessage'), () =>
        this.deleteAccount(item.id)
      )
    },
    async deleteAccount(id) {
      await POSService.delete(id).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('bankPosSuccessfullyDeleted'), 'success')
          this.closeWarning()
          this.getAllData()
        } else this.setErrorMessage(res.message)
      })
    },
    OpenEdit(item) {
      this.createORUpdatePOSDialog.form = { ...item }
      this.createORUpdatePOSDialog.form.posConnectionType = item.type
      this.createORUpdatePOSDialog.show = true
    },
    saveData(){
      
    }
  },
  async mounted() {
    await this.getAllData()
  }
}
</script> 
<style>
</style>
