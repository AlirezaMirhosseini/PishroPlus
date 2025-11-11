<template>
  <!-- <v-card dir="ltr">
    <v-tabs v-model="tab" bg-color="primary">
      <v-tab value="one">Routes</v-tab>
      <v-tab value="two">Permissions</v-tab>
      <v-tab value="three">Modules</v-tab>
    </v-tabs>

    <v-card-text>
      <v-window :touch="false" v-model="tab">
        <v-window-item value="one">
          <v-dialog v-model="deleteModel.dialog" max-width="400">
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
                  <v-btn variant="flat" block color="error" @click="DeleteItem">Delete</v-btn>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <v-dialog v-model="addPermissionToRouteModel.dialog" max-width="400">
            <v-card class="pa-3">
              <v-card-title>
                <span class="text-h5">Add Permission</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="addPermissionToRouteModel.permissionId"
                      label="Permission"
                      :items="permissions"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" block @click="addPermissionToRoute">Add</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="addModuleToRouteModel.dialog" max-width="400">
            <v-card class="pa-3">
              <v-card-title>
                <span class="text-h5">Add Module</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="addModuleToRouteModel.moduleId"
                      label="Modules"
                      :items="modules"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" block @click="addModuleToRoute">Add</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-table>
            <thead>
              <tr>
                <th></th>
                <th>Id</th>
                <th>Controller</th>
                <th>Action</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="item in routes" :key="item.id">
                <tr>
                  <td>
                    <v-btn
                      :class="['row-icon', item.showDetails ? 'selected-row-icon' : '']"
                      icon="mdi mdi-chevron-right"
                      size="small"
                      variant="text"
                      @click="item.showDetails = !item.showDetails"
                    ></v-btn>
                  </td>
                  <td>{{ item.id }}</td>
                  <td>{{ item.controller }}</td>
                  <td>{{ item.action }}</td>
                  <td>
                    {{ `${item.modules.length} Modules, ${item.permissions.length} Permissions` }}
                  </td>
                </tr>
                <transition name="subitem" mode="out-in">
                  <tr v-if="item.showDetails">
                    <td colspan="5">
                      <v-btn color="primary" @click="openAddModuleToRouteDialog(item.id)"
                        >Add Module</v-btn
                      >
                      <v-btn
                        class="ms-4"
                        color="primary"
                        @click="openAddPermissionToRouteDialog(item.id)"
                        >Add Permission</v-btn
                      >
                    </td>
                  </tr>
                </transition>
                <template v-if="item.showDetails && item.permissions.length > 0">
                  <tr style="background-color: lightgrey">
                    <td colspan="2">Permissions</td>
                    <td>Name</td>
                    <td>Parent</td>
                    <td>Delete</td>
                  </tr>
                  <tr
                    v-for="permission in item.permissions"
                    :key="permission.id"
                    style="background-color: #eeeeee"
                  >
                    <td colspan="2"></td>
                    <td>{{ permission.name }}</td>
                    <td>{{ permissions?.filter((a) => a.id === permission.parentId)[0]?.name }}</td>
                    <td>
                      <v-btn
                        icon="mdi mdi-delete"
                        variant="text"
                        color="error"
                        @click="openDelete(permission.id, item.id, 'permission')"
                      />
                    </td>
                  </tr>
                </template>
                <template v-if="item.showDetails && item.modules.length > 0">
                  <tr style="background-color: lightgrey">
                    <td colspan="2">Modules</td>
                    <td>Name</td>
                    <td></td>
                    <td>Delete</td>
                  </tr>
                  <tr
                    v-for="module in item.modules"
                    :key="module.id"
                    style="background-color: #eeeeee"
                  >
                    <td colspan="2"></td>
                    <td>{{ module.name }}</td>
                    <td></td>
                    <td>
                      <v-btn
                        icon="mdi mdi-delete"
                        variant="text"
                        color="error"
                        @click="openDelete(module.id, item.id, 'module')"
                      />
                    </td>
                  </tr>
                </template>
              </template>
            </tbody>
          </v-table>
        </v-window-item>

        <v-window-item value="two">
          <v-dialog v-model="addPermissionModel.dialog" max-width="400">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props">Add Permission</v-btn>
            </template>
            <v-card class="pa-3">
              <v-card-title>
                <span class="text-h5">Add Permission</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="addPermissionModel.name"
                      variant="outlined"
                      label="permission name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="addPermissionModel.parentId"
                      label="parent"
                      :items="permissions"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" block @click="addPermission">Add</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="editPermissionModel.dialog" max-width="400">
            <v-card class="pa-3">
              <v-card-title>
                <span class="text-h5">Edit Permission</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editPermissionModel.name"
                      variant="outlined"
                      label="permission name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-autocomplete
                      v-model="editPermissionModel.parentId"
                      label="parent"
                      :items="permissions.filter((a) => a.id != editPermissionModel.id)"
                      variant="outlined"
                      item-title="name"
                      item-value="id"
                    ></v-autocomplete>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" block @click="editPermission">Edit</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Parent</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in permissions" :key="item.id">
                <td>{{ item.name }}</td>
                <td>{{ permissions?.filter((a) => a.id === item.parentId)[0]?.name }}</td>
                <td>
                  <v-btn
                    @click="openPermissionEditDialog(item)"
                    icon="mdi mdi-pencil"
                    color="info"
                    size="small"
                    variant="text"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>

        <v-window-item value="three">
          <v-dialog v-model="addModuleModel.dialog" max-width="400">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" v-bind="props">Add Module</v-btn>
            </template>
            <v-card class="pa-3">
              <v-card-title>
                <span class="text-h5">Add Module</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="addModuleModel.name"
                      variant="outlined"
                      label="module name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" block @click="addModule">Add</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="editModuleModel.dialog" max-width="400">
            <v-card class="pa-3">
              <v-card-title>
                <span class="text-h5">Edit Module</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="editModuleModel.name"
                      variant="outlined"
                      label="module name"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-btn color="primary" block @click="editModule">Edit</v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Edit</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in modules" :key="item.id">
                <td>{{ item.name }}</td>
                <td>
                  <v-btn
                    @click="openModuleEditDialog(item)"
                    icon="mdi mdi-pencil"
                    color="info"
                    size="small"
                    variant="text"
                  ></v-btn>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card> -->
<div></div>
</template>

<script>
// import PermissionService from '../../../api/permission/permissionService.js'
// import RouteService from '../../../api/route/routeService.js'
// import ModuleService from '../../../api/module/moduleService.js'
// import { mapActions } from 'pinia'
// import { defaultStore } from '../../stores/default.js'
// export default {
//   data() {
//     return {
//       showDetails: false,
//       routes: [],
//       permissions: [],
//       modules: [],
//       tab: null,
//       addPermissionModel: {
//         dialog: false,
//         name: null,
//         parentId: null
//       },
//       editPermissionModel: {
//         dialog: false,
//         id: null,
//         name: null,
//         parentId: null
//       },
//       addModuleModel: {
//         dialog: false,
//         name: null
//       },
//       editModuleModel: {
//         dialog: false,
//         id: null,
//         name: null
//       },
//       addPermissionToRouteModel: {
//         dialog: false,
//         routeId: null,
//         permissionId: null
//       },
//       addModuleToRouteModel: {
//         dialog: false,
//         routeId: null,
//         moduleId: null
//       },
//       deleteModel: {
//         dialog: false,
//         type: null,
//         id: null,
//         routeId: null
//       }
//     }
//   },
//   methods: {
//     ...mapActions(defaultStore, { setErrorMessage: 'setErrorMessage' }),
//     openDelete(id, routeId, type) {
//       this.deleteModel = {
//         dialog: true,
//         type: type,
//         id: id,
//         routeId: routeId
//       }
//     },
//     openAddPermissionToRouteDialog(id) {
//       this.addPermissionToRouteModel = {
//         dialog: true,
//         routeId: id
//       }
//     },
//     openAddModuleToRouteDialog(id) {
//       this.addModuleToRouteModel = {
//         dialog: true,
//         routeId: id
//       }
//     },
//     openPermissionEditDialog(item) {
//       this.editPermissionModel = {
//         dialog: true,
//         id: item.id,
//         name: item.name,
//         parentId: item?.parentId
//       }
//     },
//     openModuleEditDialog(item) {
//       this.editModuleModel = {
//         dialog: true,
//         id: item.id,
//         name: item.name
//       }
//     },
//     async addPermission() {
//       await PermissionService.create({
//         entity: { name: this.addPermissionModel.name, parentId: this.addPermissionModel.parentId }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.addPermissionModel = {
//             dialog: false,
//             name: null,
//             parentId: null
//           }
//           this.getPermissions()
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async editPermission() {
//       await PermissionService.update({
//         entity: {
//           id: this.editPermissionModel.id,
//           name: this.editPermissionModel.name,
//           parentId: this.editPermissionModel.parentId
//         }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.editPermissionModel = {
//             dialog: false,
//             id: null,
//             name: null,
//             parentId: null
//           }
//           this.getPermissions()
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async addModule() {
//       await ModuleService.create({
//         entity: { name: this.addModuleModel.name }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.addModuleModel = {
//             dialog: false,
//             name: null
//           }
//           this.getModules()
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async editModule() {
//       await ModuleService.update({
//         entity: {
//           id: this.editModuleModel.id,
//           name: this.editModuleModel.name
//         }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.editModuleModel = {
//             dialog: false,
//             id: null,
//             name: null
//           }
//           this.getModules()
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async addPermissionToRoute() {
//       await RouteService.addPermission({
//         entity: {
//           permissionId: this.addPermissionToRouteModel.permissionId,
//           routeId: this.addPermissionToRouteModel.routeId
//         }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.addPermissionToRouteModel = {
//             dialog: false,
//             permissionId: null,
//             routeId: null
//           }
//           this.getRoutes()
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async addModuleToRoute() {
//       await RouteService.addModule({
//         entity: {
//           moduleId: this.addModuleToRouteModel.moduleId,
//           routeId: this.addModuleToRouteModel.routeId
//         }
//       }).then((resp) => {
//         if (resp.isSuccess) {
//           this.addModuleToRouteModel = {
//             dialog: false,
//             moduleId: null,
//             routeId: null
//           }
//           this.getRoutes()
//         } else this.setErrorMessage(resp.message)
//       })
//     },
//     async DeleteItem() {
//       if (this.deleteModel.type === 'permission') {
//         await RouteService.removePermission({
//           entity: {
//             routeId: this.deleteModel.routeId,
//             permissionId: this.deleteModel.id
//           }
//         }).then((resp) => {
//           if (resp.isSuccess) {
//             this.deleteModel = {
//               dialog: false,
//               id: null,
//               routeId: null,
//               type: null
//             }
//             this.getRoutes()
//           } else this.setErrorMessage(resp.message)
//         })
//       } else if (this.deleteModel.type === 'module') {
//         await RouteService.removeModule({
//           entity: {
//             routeId: this.deleteModel.routeId,
//             moduleId: this.deleteModel.id
//           }
//         }).then((resp) => {
//           if (resp.isSuccess) {
//             this.deleteModel = {
//               dialog: false,
//               id: null,
//               routeId: null,
//               type: null
//             }
//             this.getRoutes()
//           } else this.setErrorMessage(resp.message)
//         })
//       }
//     },
//     async getModules() {
//       await ModuleService.getAll().then((resp) => {
//         if (resp.isSuccess) this.modules = resp.entities
//         else this.setErrorMessage(resp.message)
//       })
//     },
//     async getPermissions() {
//       await PermissionService.getAll().then((resp) => {
//         if (resp.isSuccess) this.permissions = resp.entities
//         else this.setErrorMessage(resp.message)
//       })
//     },
//     async getRoutes() {
//       await RouteService.getAll().then((resp) => {
//         if (resp.isSuccess) this.routes = resp.entities
//         else this.setErrorMessage(resp.message)
//       })
//     }
//   },
//   async mounted() {
//     await this.getModules()
//     await this.getPermissions()
//     await this.getRoutes()
//   }
// }
</script>

<style>
.row-icon {
  transition: 0.5s ease;
  transform: rotate(0);
}

.selected-row-icon {
  transform: rotate(90deg);
}
</style>
