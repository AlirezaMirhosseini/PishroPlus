<template>
  <v-dialog close-on-back persistent v-model="addDialog.show" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-currency-usd" />
        <p style="font-weight: bold">
          {{ addDialog.isEdit ? $t('editCurrency') : $t('addCurrency') }}
        </p>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="handleCloseAddDialog" variant="text" />
        </div>
      </v-row>
      <v-form ref="addCurrencyForm" @submit.prevent="saveAdd">
        <v-card-text class="pb-0">
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('accountDetails') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('name') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="name"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addDialog.form.name"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('code') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9"
                ><v-text-field
                  name="code"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  density="compact"
                  v-model="addDialog.form.code"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('default') }}:</v-col>
              <v-col class="pb-0 d-flex align-center" cols="12" sm="9">
                <switch-button
                  class="mb-5 ms-2"
                  v-model:checked="addDialog.form.setDefault"
                  :label="addDialog.form.setDefault ? $t('yes') : $t('no')"
                  style="width: 130px"
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
      <data-table
        :items="items"
        :headers="headers"
        :hasSearch="true"
        :searchItems="['code', 'name']"
      >
        <template v-slot:toolbar>
          <v-row class="ps-2" no-gutters>
            <v-btn
              @click="openAddDialog"
              prepend-icon="mdi mdi-currency-usd"
              variant="tonal"
              color="info"
              >{{ $t('addCurrency') }}</v-btn
            >
          </v-row>
        </template>
        <template v-slot:column_index="{ entity }">
          <p>{{ items.indexOf(entity) + 1 }}</p>
        </template>
        <template v-slot:column_setDefault="{ entity }">
          <div class="d-flex justify-center">
            <v-switch
              v-model="entity.setDefault"
              color="primary"
              :label="entity.setDefault ? $t('yes') : $t('no')"
              hide-details
              density="compact"
              @update:modelValue="(value) => handleSetDefault(entity, value)"
            ></v-switch>
          </div>
        </template>
        <template v-slot:column_operations="{ entity }">
          <v-row class="d-none d-md-flex justify-center" style="width: 100px">
            <v-tooltip :text="$t('editCurrency')">
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
            <v-tooltip :text="$t('deleteCurrency')">
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
                    :title="$t('editCurrency')"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                    </template>
                  </v-list-item>
                  <v-list-item
                    density="compact"
                    @click.prevent="() => openDelete(entity)"
                    :title="$t('deleteCurrency')"
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
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import switchButton from '../../components/baseComponents/switchButton.vue'
import saveIcon from '../../components/icons/Save.vue'
import deleteIcon from '../../components/icons/Delete.vue'
import currencyService from '../../../api/currency/currencyService'

export default {
  data() {
    return {
      saveIcon: markRaw(saveIcon),
      deleteIcon: markRaw(deleteIcon),
      items: [],
      addDialog: {
        show: false,
        isEdit: false,
        form: {
          name: '',
          code: '',
          setDefault: false
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
          title: this.$t('name'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '200px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '140px'
        },
        {
          title: this.$t('default'),
          align: 'center',
          sortable: true,
          key: 'setDefault',
          width: '90px'
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
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    handleCloseAddDialog() {
      this.addDialog.show = false
    },
    openAddDialog() {
      this.addDialog = {
        show: true,
        isEdit: false,
        form: {
          name: '',
          code: '',
          setDefault: false
        }
      }
    },
    openEditDialog(entity) {
      this.addDialog = {
        show: true,
        isEdit: true,
        form: {
          id: entity.id,
          code: entity.code,
          name: entity.name,
          setDefault: entity.setDefault
        }
      }
    },
    openDelete(item) {
      this.setWarningDialog(true, this.$t('deleteCurrency'), this.$t('confirmDeleteMessage'), () =>
        this.deleteAccount(item.id)
      )
    },
    async handleSetDefault(entity, value) {
      if (!value) entity.setDefault = true
      else {
        const res = await currencyService.setDefault(entity.id)
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('currencySetDefaultSuccessfully'), 'success')
          this.getAllData()
        } else {
          entity.setDefault = false
          this.setErrorMessage(res.message)
        }
      }
    },
    async deleteAccount(id) {
      await currencyService.delete(id).then((res) => {
        if (res == '') {
          this.setErrorMessage(this.$t('currencyDeletedSuccessfully'), 'success')
          this.closeWarning()
          this.getAllData(this.tab)
        } else this.setErrorMessage(res.message)
      })
    },
    async saveAdd() {
      const validation = await this.$refs.addCurrencyForm.validate()
      if (validation.valid) {
        let request = {
          code: this.addDialog.form.code,
          name: this.addDialog.form.name,
          setDefault: this.addDialog.form.setDefault
        }
        if (this.addDialog.isEdit) {
          request.id = this.addDialog.form.id
          await currencyService.update(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('currencyEditedSuccessfully'), 'success')
              this.addDialog.show = false
              this.getAllData()
            } else this.setErrorMessage(res.message)
          })
        } else
          await currencyService.create(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('currencyCreatedSuccessfully'), 'success')
              this.addDialog.show = false
              this.getAllData()
            } else this.setErrorMessage(res.message)
          })
      }
    },
    async getAllData() {
      await currencyService.getAll(1, 1000, null).then((res) => {
        if (res.isSuccess) this.items = res.value.result
        else this.setErrorMessage(res.message)
      })
    }
  },
  async mounted() {
    await this.getAllData()
  },
  components: {
    dataTable,
    switchButton
  }
}
</script>

<style></style>
