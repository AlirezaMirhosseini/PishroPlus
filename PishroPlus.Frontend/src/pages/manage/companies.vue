<template>
  <!-- <v-dialog v-model="deleteModel.dialog" max-width="400">
    <v-card class="pa-3" dir="ltr">
      <v-card-title>
        <span class="text-h5">Delete</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <p>Are you sure?</p>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-col cols="6">
          <v-btn variant="flat" block color="grey" @click="deleteModel.dialog = false"
            >Cancel</v-btn
          >
        </v-col>
        <v-col cols="6">
          <v-btn variant="flat" block color="error" @click="DeleteModule">Delete</v-btn>
        </v-col>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addModuleModel.dialog" max-width="400">
    <v-card class="pa-3">
      <v-card-title>
        <span class="text-h5">Add Module</span>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="12">
            <v-autocomplete
              v-model="addModuleModel.moduleId"
              label="Modules"
              :items="modules"
              variant="outlined"
              item-title="name"
              item-value="id"
            ></v-autocomplete>
          </v-col>
          <v-col cols="12">
            <v-btn color="primary" block @click="addModule">Add</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog v-model="selectedCompany.dialog" max-width="400">
    <v-card class="pa-3" dir="ltr">
      <v-card-title>
        <span class="text-h5">{{ selectedCompany.name }} Modules</span>
      </v-card-title>
      <v-card-text class="d-flex flex-column">
        <v-btn @click="openAddModule" variant="flat" color="primary">Add Module</v-btn>
        <v-table class="mt-4" v-if="selectedCompany.modules.length > 0">
          <thead>
            <tr>
              <th>Module</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in selectedCompany.modules" :key="item.moduleId">
              <td>{{ item.moduleName }}</td>
              <td>
                <v-btn
                  @click="openDeleteModule(item.moduleId)"
                  icon="mdi mdi-delete"
                  variant="text"
                  color="error"
                />
              </td>
            </tr>
          </tbody>
        </v-table>
        <span class="mt-4 text-center" v-else>modules not found!</span>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-card dir="ltr">
    <v-col cols="12">
      <v-btn variant="flat" color="primary" @click="openRegisterDialog">Register Company</v-btn>
      <v-dialog v-model="registerCompanyModel.dialog" max-width="400">
        <v-form @submit.prevent="register" ref="registerRef">
          <v-card class="pa-3" dir="ltr">
            <v-card-title>
              <span class="text-h5">Register Company</span>
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="registerCompanyModel.name"
                    variant="outlined"
                    label="company name"
                    autofocus
                    :rules="[
                      (v) => {
                        if (v) return true
                        return 'enter company name'
                      }
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>
            <v-card-actions>
              <v-btn variant="flat" type="submit" color="primary" block @click="register"
                >Register</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>
    </v-col>
    <v-table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Code</th>
          <th>Modules</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in companies" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.code }}</td>
          <td>
            <v-btn variant="flat" color="info" @click="viewModules(item)">View Modules</v-btn>
          </td>
        </tr>
      </tbody>
    </v-table></v-card
  > -->
  <div></div>
</template>

<script>
// import Company from '../../../api/company/companyService.js'
// import Module from '../../../api/module/moduleService.js'
// import { mapActions } from 'pinia'
// import { defaultStore } from '../../stores/default'
// export default {
//   data() {
//     return {
//       companies: [],
//       modules: [],
//       registerCompanyModel: {
//         dialog: false,
//         name: null
//       },
//       selectedCompany: {
//         id: null,
//         code: null,
//         name: null,
//         dialog: false,
//         modules: []
//       },
//       addModuleModel: {
//         dialog: false,
//         moduleId: null,
//         companyId: null
//       },
//       deleteModel: {
//         dialog: false,
//         id: null
//       }
//     }
//   },
//   methods: {
//     ...mapActions(defaultStore, { setErrorMessage: 'setErrorMessage' }),
//     openDeleteModule(id) {
//       this.deleteModel = {
//         dialog: true,
//         id: id
//       }
//     },
//     async DeleteModule() {
//       await Company.removeModule({
//         entity: {
//           companyId: this.selectedCompany.id,
//           moduleId: this.deleteModel.id
//         }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.deleteModel = {
//             dialog: false,
//             id: null
//           }
//           this.viewModules(this.selectedCompany)
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     openAddModule() {
//       this.addModuleModel = {
//         dialog: true,
//         companyId: this.selectedCompany.id,
//         moduleId: null
//       }
//     },
//     async addModule() {
//       await Company.addModule({
//         entity: {
//           companyId: this.addModuleModel.companyId,
//           moduleId: this.addModuleModel.moduleId
//         }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.addModuleModel = {
//             dialog: false,
//             companyId: null,
//             moduleId: null
//           }
//           this.viewModules(this.selectedCompany)
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     openRegisterDialog() {
//       this.registerCompanyModel = {
//         dialog: true,
//         name: null
//       }
//     },
//     async register() {
//       const { valid } = await this.$refs.registerRef.validate()
//       if (valid) {
//         await Company.register({ entity: { name: this.registerCompanyModel.name } }).then(
//           (resp) => {
//             if (resp.isSuccess) {
//               this.registerCompanyModel = {
//                 dialog: false,
//                 name: null
//               }
//               this.getCompanies()
//             } else this.setErrorMessage(resp.message)
//           }
//         )
//       }
//     },
//     async viewModules(company) {
//       await Company.getModules(company.id).then((resp) => {
//         if (resp.isSuccess) {
//           this.selectedCompany = {
//             id: company.id,
//             name: company.name,
//             code: company.code,
//             modules: resp.entities,
//             dialog: true
//           }
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async getModules() {
//       await Module.getAll().then((resp) => {
//         if (resp.isSuccess) this.modules = resp.entities
//         else this.setErrorMessage(resp.message)
//       })
//     },
//     async getCompanies() {
//       await Company.getAll().then((resp) => {
//         if (resp.isSuccess) this.companies = resp.entities
//         else this.setErrorMessage(resp.message)
//       })
//     }
//   },
//   async mounted() {
//     await this.getCompanies()
//     await this.getModules()
//   }
// }
</script>

<style></style>
