<template>
  <v-overlay v-model="helpOverlay">
    <div class="help-container">
      <v-btn
        class="close-help-button"
        variant="text"
        icon="mdi mdi-window-close"
        color="white"
        @click="helpOverlay = false"
      />
      <div class="py-4 h-100">
        <help-stepper :items="previewItems"> </help-stepper>
      </div>
    </div>
  </v-overlay>

  <v-card title="لیست آموزش ها">
    <v-card-text>
      <v-btn variant="flat" color="primary" to="/manage/tutorial/new/false/null">آموزش جدید</v-btn>
      <data-table
        :hasSearch="true"
        :searchItems="['route', 'title']"
        :headers="headers"
        :items="helps"
      >
        <template v-slot:column_route="{ entity }">
          <router-link :to="entity.route">{{
            routes.filter((a) => a.path == entity.route)[0]?.newName
          }}</router-link>
        </template>
        <template v-slot:column_operation="{ entity }">
          <v-tooltip text="پیش نمایش">
            <template v-slot:activator="{ props }">
              <v-btn
                size="x-small"
                v-bind="props"
                variant="text"
                color="primary"
                icon="mdi mdi-eye-circle"
                @click="gethelpByRoute(entity)"
              />
              <v-tooltip text="ویرایش">
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="x-small"
                    class="ms-2"
                    v-bind="props"
                    variant="text"
                    color="info"
                    icon="mdi mdi-pencil-circle"
                    :to="`/manage/tutorial/new/true/${entity.id}`"
                  />
                </template>
              </v-tooltip>
              <v-tooltip text="حذف">
                <template v-slot:activator="{ props }">
                  <v-btn
                    size="x-small"
                    class="ms-2"
                    v-bind="props"
                    variant="text"
                    color="error"
                    icon="mdi mdi-delete"
                    @click="openDeleteDialog(entity.id)"
                  />
                </template>
              </v-tooltip>
            </template>
          </v-tooltip>
        </template>
      </data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import helpService from '../../../api/help/helpService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import helpStepper from '../../components/layoutComponents/helpStepper.vue'
export default {
  data() {
    return {
      previewItems: [],
      helpOverlay: false,
      routes: [],
      helps: [],
      headers: [
        {
          title: 'مربوط به صفحه',
          align: 'center',
          sortable: true,
          key: 'route'
        },
        {
          title: 'عنوان',
          align: 'center',
          sortable: true,
          key: 'title'
        },
        {
          title: 'ترتیب نمایش',
          align: 'center',
          sortable: true,
          key: 'order'
        },
        {
          title: 'عملیات',
          align: 'center',
          sortable: true,
          key: 'operation'
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
    openDeleteDialog(id) {
      this.setWarningDialog(true, 'حذف راهنما', this.$t('confirmDeleteMessage'), () =>
        this.remove(id)
      )
    },
    async getHelps() {
      await helpService.getAll().then((resp) => {
        if (resp.isSuccess) {
          this.helps = [...resp.entities]
        } else this.setErrorMessage(resp.message)
      })
    },
    async gethelpByRoute(item) {
      await helpService.getByRoute(item.route).then((res) => {
        if (res.isSuccess) {
          this.previewItems = res.entities
          this.helpOverlay = true
        } else this.setErrorMessage(res.message)
      })
    },
    async remove(id) {
      await helpService.remove({ id: id }).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage('راهنما با موفقیت حذف گردید', 'success')
          this.closeWarning()
          this.getHelps()
        } else this.setErrorMessage(res.message)
      })
    }
  },
  components: {
    dataTable,
    helpStepper
  },
  async mounted() {
    await this.getHelps()
    this.routes = this.$router.getRoutes()
    this.routes.forEach((x) => {
      x.newName = this.$t(x.name)
    })
  }
}
</script>

<style></style>
