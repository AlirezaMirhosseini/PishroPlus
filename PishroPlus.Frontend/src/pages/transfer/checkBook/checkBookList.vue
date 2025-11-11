<template>
  <v-dialog close-on-back persistent v-model="checkPapers.dialog" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="checkPaperIcon" />
        <p style="font-weight: bold">
          {{ $t('viewCheckPapers') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="checkPapers.dialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <data-table :headers="checkPaperHeaders" :items="checkPapers.items">
          <template v-slot:column_index="{ entity }">
            {{ checkPapers?.items?.indexOf(entity) + 1 }}
          </template>
          <template v-slot:column_status="{ entity }">
            <p :class="`text-${getStatusColor(entity.status)}`">
              {{ getStatusText(entity.status) }}
            </p>
          </template>
        </data-table>
      </v-card-text>
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
            :items="items"
            :hasSearch="true"
            :searchItems="[
              'bankAccountCode',
              'bankName',
              'serieNumber',
              'bankAccountNumber',
              'firstCheckPaperSerialNumber',
              'paperCount',
              'iBan',
              'desc'
            ]"
            :clickableRow="true"
          >
            <template v-slot:toolbar>
              <v-row class="ps-2" no-gutters>
                <v-btn
                  to="/transfer/addCheckBook/new"
                  :prepend-icon="addCheckBookIcon"
                  variant="tonal"
                  color="info"
                  >{{ $t('addCheckBook') }}</v-btn
                >
              </v-row>
            </template>
            <template v-slot:column_index="{ entity }">
              <p>{{ items.indexOf(entity) + 1 }}</p>
            </template>
            <template v-slot:column_iBan="{ entity }">
              {{ 'IR ' + entity.iBan }}
            </template>
            <template v-slot:column_operations="{ entity }">
              <v-row class="d-none d-md-flex justify-center" style="width: 140px">
                <v-tooltip :text="$t('viewCheckPapers')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="checkPaperIcon"
                      variant="text"
                      color="primary"
                      size="x-small"
                      @click="() => viewCheckPapers(entity.id)"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('editCheckBook')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi mdi-square-edit-outline"
                      variant="text"
                      color="info"
                      size="x-small"
                      :to="`/transfer/addCheckBook/${entity.id}`"
                    />
                  </template>
                </v-tooltip>
                <v-tooltip :text="$t('deleteCheckBook')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :icon="deleteIcon"
                      variant="text"
                      color="error"
                      size="x-small"
                      @click="() => deleteCheckBook(entity)"
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
                        @click.prevent="() => viewCheckPapers(entity.id)"
                        density="compact"
                        :title="$t('viewCheckPapers')"
                      >
                        <template v-slot:prepend>
                          <v-icon :icon="checkPaperIcon" color="primary" />
                        </template>
                      </v-list-item>
                      <v-list-item
                        :to="`/transfer/addCheckBook/${entity.id}`"
                        density="compact"
                        :title="$t('editCheckBook')"
                      >
                        <template v-slot:prepend>
                          <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                        </template>
                      </v-list-item>
                      <v-list-item
                        density="compact"
                        :title="$t('deleteCheckBook')"
                        @click.prevent="() => deleteCheckBook(entity)"
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
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import transferService from '../../../../api/transfer/transferService'
import addCheckBookIcon from '../../../components/icons/AddCheckBook.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import checkPaperIcon from '../../../components/icons/CheckPaperRegister.vue'

export default {
  data() {
    return {
      addCheckBookIcon: markRaw(addCheckBookIcon),
      deleteIcon: markRaw(deleteIcon),
      checkPaperIcon: markRaw(checkPaperIcon),
      items: [],
      checkPapers: {
        dialog: false,
        items: []
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
          title: this.$t('bankAccountCode'),
          align: 'center',
          sortable: true,
          key: 'bankCode',
          width: '120px'
        },
        {
          title: this.$t('bankName'),
          align: 'center',
          sortable: true,
          key: 'bankName',
          width: '140px'
        },

        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '140px'
        },
        {
          title: this.$t('accountNumber'),
          align: 'center',
          sortable: true,
          key: 'bankAccountNumber',
          width: '150px'
        },
        {
          title: this.$t('paperCount'),
          align: 'center',
          sortable: true,
          key: 'paperCount',
          width: '90px'
        },
        {
          title: this.$t('shabaNumber'),
          align: 'center',
          sortable: true,
          key: 'iBan',
          width: '200px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '160px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ],
      checkPaperHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('sayyadiNumber'),
          align: 'center',
          sortable: true,
          key: 'sayadNumber',
          width: '140px'
        },
        {
          title: this.$t('serieNumber'),
          align: 'center',
          sortable: true,
          key: 'serieCode',
          width: '120px'
        },
        {
          title: this.$t('serialNumber'),
          align: 'center',
          sortable: true,
          key: 'serialNumber',
          width: '80px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'status',
          width: '120px'
        },
        {
          title: this.$t('description'),
          class: 'flex-grow-1',
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '120px'
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
    getStatusColor(status) {
      switch (status) {
        case 0:
          return 'primary'
        case 1:
          return 'error'
        case 2:
          return 'success'
        case 3:
          return 'success'
        case 4:
          return 'error'
        default:
          return ''
      }
    },
    getStatusText(status) {
      switch (status) {
        case 0:
          return this.$t('initial')
        case 1:
          return this.$t('expired')
        case 2:
          return this.$t('returned')
        case 3:
          return this.$t('passed')
        default:
          return ''
      }
    },
    async viewCheckPapers(id) {
      await transferService.getCheckBookById(id).then((res) => {
        if (res.isSuccess) {
          this.checkPapers = {
            dialog: true,
            items: res.entity.checkPapers
          }
        } else this.setErrorMessage(res.message)
      })
    },
    deleteCheckBook(item) {
      this.setWarningDialog(true, this.$t('deleteCheckBook'), this.$t('confirmDeleteMessage'), () =>
        this.confirmDeleteCheckBook(item.id)
      )
    },
    async confirmDeleteCheckBook(id) {
      await transferService.deleteCheckBook(id).then((res) => {
        if (res.isSuccess) {
          this.getdata()
          this.closeWarning()
          this.setErrorMessage(this.$t('checkBookSuccessfullyDeleted'), 'success')
        } else this.setErrorMessage(res.message)
      })
    },
    async getdata() {
      return await transferService.getAllCheckBooks().then((res) => {
        if (res.isSuccess) {
          this.items = res.entities
        } else this.setErrorMessage(res.message)
      })
    },
    onkeydown(e) {
      if (this.checkPapers.dialog && e.keyCode == 27) this.checkPapers.dialog = false
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
    await this.getdata()
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  components: {
    reportOutput,
    dataTable
  }
}
</script>

<style></style>
