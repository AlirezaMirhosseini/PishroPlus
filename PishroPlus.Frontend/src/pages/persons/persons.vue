<template>
  <v-card>
    <v-card-text class="px-2 h-100">
      <data-table
        :hasSearch="true"
        :searchItems="[
          'name',
          'fCode',
          'firstName',
          'lastName',
          'nationalCode',
          'phoneNumber',
          'city',
          'province',
          'postalCode'
        ]"
        :headers="headerItems"
        :items="items"
      >
        <template v-slot:toolbar>
          <v-row class="align-center ga-2" no-gutters>
            <v-btn
              to="/persons/new"
              :prepend-icon="addPersonIcon"
              class="ms-2"
              color="info"
              variant="tonal"
              >{{ $t('addPerson') }}</v-btn
            >
            <v-spacer></v-spacer>
            <v-select
              hide-details
              variant="outlined"
              density="compact"
              :loading="false"
              style="max-width: 250px"
              :items="leafTypeList"
              item-value="id"
              item-title="title"
              v-model="leafType"
              @update:modelValue="getData"
            ></v-select>
          </v-row>
        </template>
        <template v-slot:column_index="{ entity }">
          {{ items.indexOf(entity) + 1 }}
        </template>
        <template v-slot:column_nationalCode="{ entity }">
          {{ entity.personType == 0 ? entity.nationalCode : entity.nationalId }}
        </template>
        <template v-slot:column_personType="{ entity }">
          {{ entity.personType ? (entity.personType == 0 ? $t('real') : $t('legal')) : '' }}
        </template>
        <template v-slot:column_cityProvince="{ entity }">
          {{ entity.city || entity.province ? entity.city + '/' + entity.province : '' }}
        </template>
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
                  :to="`/persons/${entity.id}`"
                />
              </template>
            </v-tooltip>

            <v-tooltip :text="$t('deleteUser')">
              <template v-slot:activator="{ props }">
                <v-btn
                  class="ms-2"
                  v-bind="props"
                  :icon="deleteIcon"
                  variant="text"
                  color="error"
                  size="x-small"
                  @click="() => deleteUser(entity)"
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
                    :to="`/persons/${entity.id}`"
                    :title="$t('editUser')"
                  >
                    <template v-slot:prepend>
                      <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                    </template>
                  </v-list-item>
                  <v-list-item
                    density="compact"
                    @click.prevent="() => deleteUser(entity)"
                    :title="$t('deleteUser')"
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
import addPersonIcon from '../../components/icons/AddPerson.vue'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
import accountService from '../../../api/account/accountService'
import CustomerService from '../../../api/customer/customerService'
import deleteIcon from '../../components/icons/Delete.vue'
import personTable from '../../components/baseComponents/personTable.vue'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import reportOutput from '../../components/baseComponents/reportOutput.vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import { markRaw } from 'vue'

export default {
  data() {
    return {
      deleteIcon: markRaw(deleteIcon),
      addPersonIcon: markRaw(addPersonIcon),
      items: [],
      headerItems: [
        {
          title: this.$t('row'),
          key: 'index',
          align: 'center',
          width: '70px'
        },
        {
          title: this.$t('accountingCode'),
          key: 'hierarchyCode',
          align: 'center',
          width: '150px'
        },
        {
          title: this.$t('title'),
          key: 'name',
          align: 'center',
          width: '200px'
        },
        {
          title: this.$t('firstName'),
          key: 'firstName',
          align: 'center',
          width: '120px'
        },
        {
          title: this.$t('lastName'),
          key: 'lastName',
          align: 'center',
          width: '150px'
        },
        {
          title: this.$t('nationaIdOrCode'),
          key: 'nationalCode',
          align: 'center',
          width: '200px'
        },
        {
          title: this.$t('phoneNumber'),
          key: 'phoneNumber',
          align: 'center',
          width: '200px'
        },
        {
          title: this.$t('personType'),
          key: 'personType',
          align: 'center',
          width: '100px'
        },
        {
          title: this.$t('cityProvince'),
          align: 'center',
          key: 'cityProvince',
          width: '150px'
        },
        {
          title: this.$t('postalCode'),
          align: 'center',
          key: 'postalCode',
          width: '100px'
        },
        {
          title: this.$t('taxable'),
          align: 'center',
          key: 'taxable',
          show: false,
          width: '100px'
        },
        {
          title: this.$t('operations'),
          key: 'operations',
          align: 'center',
          width: '0',
          fixed: true
        }
      ],
      leafType: null,
      leafTypeList: [
        {
          id: null,
          title: this.$t('showAll')
        },
        {
          id: true,
          title: this.$t('withoutChildren')
        },
        {
          id: false,
          title: this.$t('others')
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
    handleBeforeUnload(event) {
      const message = 'آیا مطمئن هستید که می‌خواهید صفحه را ترک کنید؟'
      event.returnValue = message
      console.log(message)
      return message
    },
    deleteUser(item) {
      this.setWarningDialog(true, this.$t('deleteUser'), this.$t('confirmDeleteMessage'), () =>
        this.deleteAccount(item.id)
      )
    },
    async deleteAccount(id) {
      await detailedAccountService.delete(id).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('userSuccessfullyDeleted'), 'success')
          this.closeWarning()
          this.getData()
        } else if(res?.response?.data?.errors[0]?.type==600) {}
        
      })
    },
    async getData() {
      const params = {
        leafAccounts: this.leafType
      }
      await CustomerService.getList(params).then((res) => {
        if (res.isSuccess) {
          this.items = res.value.result.map((item) => {
            const processedItem = { ...item }
            if (Array.isArray(item.attributes) && item.attributes.length > 0) {
              item.attributes.forEach((attr) => {
                processedItem[attr.key] = attr.value
              })
            }
            return processedItem
          })
          // this.items = res.value.result
          // this.items.forEach((element, index) => {
          //   if (element.attributes && element.attributes.trim() !== '') {
          //     let extra = JSON.parse(element.attributes)
          //     this.items[index] = { ...element, ...extra }
          //   }
          // })
        } else this.setErrorMessage(res.message)
      })
    }
  },
  async mounted() {
    await this.getData()
    window.addEventListener('beforeunload', this.handleBeforeUnload)
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload)
  },
  components: {
    personTable,
    reportOutput,
    dataTable
  }
}
</script>

<style>
.person-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
