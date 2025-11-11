<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters class="flex-column">
        <v-col cols="12" class="align-start pa-2" no-gutters>
          <data-table :headers="headers" :items="users" :hasSearch="true" :searchItems="[
            'userName',
            'firstName',
            'lastName',
            'phoneNumber',
            'address',
            'nationalCode',
            'tel',
            'postalCode',
            'displayName'
          ]" :clickableRow="true">
            <template v-slot:toolbar>
              <v-row class="align-center mr-5" no-gutters>
                <v-btn @click="addNewUser()" prepend-icon="mdi-plus" variant="tonal" style="float: right;" color="info">{{
                  $t('newUser') }}
                </v-btn>
                <!-- <report-output /> -->
              </v-row>
            </template>
            <template v-slot:column_index="{ entity }">
              <p>{{ users.indexOf(entity) + 1 }}</p>
            </template>
            <template v-slot:column_operations="{ entity }">
              <v-row class="d-none d-md-flex justify-center" style="width: 90px">
                <v-tooltip :text="$t('permissions')">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi mdi-security" variant="text" color="info" size="x-small"
                      :to="`/setting/users/permissions/${entity.id}`" />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('editInvoice')">
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi mdi-square-edit-outline" variant="text" color="info" size="x-small"
                      @click="() => openEditDialog(entity)" />
                  </template>
                </v-tooltip>
              </v-row>
              <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                <v-btn size="x-small" icon="mdi-dots-vertical" color="grey" variant="text">
                  <v-icon icon="mdi-dots-vertical" variant="text" />
                  <v-menu activator="parent">
                    <v-list density="compact">
                      <v-list-item density="compact" :title="$t('permissions')"
                        :to="`/setting/users/permissions/${entity.id}`">
                        <template v-slot:prepend>
                          <v-icon icon="mdi mdi-security" color="info" />
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
  <v-dialog close-on-back v-model="userDialog.show" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters>
        <v-icon class="me-2" size="30" color="info" icon="mdi mdi-square-edit-outline" />
        <p style="font-weight: bold">
          {{ userDialog.isEdit ? $t('editUser') : $t('addUser') }}
        </p>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="handleCloseUserDialog" variant="text" />
        </div>
      </v-row>
      <v-form ref="userForm" @submit.prevent="saveAdd" @input="() => {
        if (!userDialog.hasChanged) userDialog.hasChanged = true
      }
        ">

        <v-card-text class="pb-0">
          <v-row no-gutters>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('name')" name="userName" variant="outlined" density="compact"
                v-model="userDialog.form.userName">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('lastName')" name="userLastName" variant="outlined" density="compact"
                v-model="userDialog.form.userLastName">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('displayname')" name="userDisplayname" variant="outlined" density="compact"
                v-model="userDialog.form.userDisplayname">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('nationalCode')" name="userNationalCode  " variant="outlined" density="compact"
                v-model="userDialog.form.userNationalCode">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <accountSelector name="connectedBank" :title="$t('connectedBank')" :justDetailedAccount="true"
                :persistent="false" v-model="userDialog.form.userDetailAccountId">
                <v-text-field> </v-text-field>
              </accountSelector>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('password')" name="userPassword  " variant="outlined" density="compact"
                v-model="userDialog.form.userPassword">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6" v-if="!userDialog.isEdit">
              <v-text-field :label="$t('phoneNumber')" :rules="rule" name="userMobile" variant="outlined"
                density="compact" v-model="userDialog.form.userPhoneNumber">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6" v-if="!userDialog.isEdit">
              <v-text-field :label="$t('userName')" :disabled="true" name="userUserName" variant="outlined"
                density="compact" v-model="userDialog.form.userPhoneNumber">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('postalCode')" name="userPostalCode" variant="outlined" density="compact"
                v-model="userDialog.form.userPostalCode">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('address')" name="userAddress" variant="outlined" density="compact"
                v-model="userDialog.form.userAddress">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-text-field :label="$t('telephone')" name="userTel" variant="outlined" density="compact"
                v-model="userDialog.form.userTel">
              </v-text-field>
            </v-col>
            <v-col class="pa-1" cols="12" sm="6">
              <v-select :label="$t('gender')" v-model="userDialog.form.userGender" :items="genderItems" variant="outlined"
                density="compact" />
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="text-end">
              <v-btn type="submit" variant="flat" :prepend-icon="saveIcon" color="info" class="ma-1  ">{{
                $t('save')
              }}</v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-form>
    </v-card>
  </v-dialog>
</template>

<script>
import UserService from '../../../api/user/userService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import reportOutput from '../../components/baseComponents/reportOutput.vue'
import SaveIcon from '../../components/icons/Save.vue'
import { markRaw } from 'vue'
import userService from '../../../api/user/userService.js'
import accountSelector from '../../components/accountsComponents/accountSelector.vue'


export default {
  data() {
    return {
      rule: [
        (v) => {
          if (v) return true
          return this.$t('enterRequiredField')
        }
      ],
      saveIcon: markRaw(SaveIcon),
      users: [],
      userDialog: {
        show: false,
        form: {
          isActive: true,
          userGender: 0
        }
      },
      opendialog: false,
      genderItems: [
        { title: this.$t('male'), value: 0 },
        { title: this.$t('female'), value: 1 },
      ],
      headers: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('userName'),
          align: 'center',
          sortable: true,
          key: 'userName',
          width: '120px'
        },
        {
          title: this.$t('firstName'),
          align: 'center',
          sortable: true,
          key: 'firstName',
          width: '120px'
        },
        {
          title: this.$t('lastName'),
          align: 'center',
          sortable: true,
          key: 'lastName',
          width: '120px'
        },
        {
          title: this.$t('nationalCode'),
          align: 'center',
          sortable: true,
          key: 'nationalCode',
          width: '120px'
        },
        {
          title: this.$t('address'),
          align: 'center',
          sortable: true,
          key: 'address',
          minWidth: '150px'
        },
        {
          title: this.$t('postalCode'),
          align: 'center',
          sortable: true,
          key: 'postalCode',
          width: '120px'
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
    async getUsers() {
      UserService.getAllByCompany(1, 10000).then((resp) => {
        if (resp.isSuccess) this.users = resp.entities
        else this.setErrorMessage(resp.message)
      })
    },
    addNewUser() {
      this.userDialog = {
        show: true,
        isEdit: false,
        form: {
          isActive: true,
          userGender: 0
        }
      }
    },
    openEditDialog(entity) {
      this.userDialog = {
        show: true,
        isEdit: true,
        form: {
          id: entity.id,
          userGender: 0,
          userName: entity.firstName,
          userLastName: entity.lastName,
          userNationalCode: entity.nationalCode,
          userPostalCode: entity.postalCode,
          userAddress: entity.address,
          userTel: entity.tel,
          userPhoneNumber: entity.phoneNumber
        }
      }
    },
    handleCloseUserDialog() {
      if (this.userDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.userDialog.show = false
        })
      } else this.userDialog.show = false
    },
    async saveAdd() {
      const validation = await this.$refs.userForm.validate()
      if (validation.valid) {
        const company = JSON.parse(localStorage.getItem('com'))
        let request = {
          entity: {
            id: this.userDialog.form?.id,
            firstName: this.userDialog.form.userName,
            lastName: this.userDialog.form.userLastName,
            nationalCode: this.userDialog.form.userNationalCode,
            phoneNumber: this.userDialog.form.userPhoneNumber,
            postalCode: this.userDialog.form.userPostalCode,
            address: this.userDialog.form.userAddress,
            tel: this.userDialog.form.userTel,
            gender: this.userDialog.form.userGender,
            displayName: this.userDialog.form.userDisplayname,
            userName: this.userDialog.form.userPhoneNumber,
            password: this.userDialog.form?.userPassword,
            companyCode: company.c,
            detailAccountId: this.userDialog.form.userDetailAccountId.selectedDetailedAccount.detailedAccountId
          }
        }
        if (this.userDialog.isEdit == true) {
          await userService.update(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('userEditedSuccessfully'), 'success')
              this.userDialog.show = false
              this.getUsers()
            } else this.setErrorMessage(res.message)
          })
        } else {
          await userService.add(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('userCreatedSuccessfully'), 'success')
              this.userDialog.show = false
              this.getUsers()
            } else this.setErrorMessage(res.message)
          })
        }
      }
    }
  },
  async mounted() {
    await this.getUsers()
  },
  components: {
    dataTable,
    reportOutput,
    accountSelector
  }
}
</script>

<style></style>
