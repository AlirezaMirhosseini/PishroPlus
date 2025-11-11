<template>
  <v-card>
    <v-form @submit.prevent="save" ref="helpForm">
      <v-row class="align-center ms-4 mt-4" no-gutters>
        <v-card-title>اضافه کردن آموزش</v-card-title>
        <v-btn class="ms-4" variant="flat" color="info" :prepend-icon="saveIcon" type="submit"
          >ذخیره</v-btn
        >
      </v-row>
      <v-card-text>
        <v-row class="pb-2">
          <v-col cols="12" md="4">
            <v-autocomplete
              :disabled="isEdit"
              variant="outlined"
              density="compact"
              label="انتخاب صفحه ی مربوطه"
              :items="routes"
              item-title="newName"
              item-value="path"
              v-model="selectedRoute"
              :rules="[
                (v) => {
                  if (v) return true
                  return 'لطفا صفحه را انتخاب کنید'
                }
              ]"
              no-data-text="صفحه ای یافت نشد!"
            />
          </v-col>
          <v-col cols="6" md="4">
            <v-text-field
              name="help-title"
              variant="outlined"
              density="compact"
              label="عنوان"
              v-model="title"
              :rules="[
                (v) => {
                  if (v) return true
                  return 'لطفا عنوان را بنویسید'
                }
              ]"
            />
          </v-col>
          <v-col cols="6" md="4">
            <v-text-field
              name="order"
              type="number"
              variant="outlined"
              density="compact"
              label="ترتیب(شروع از 1)"
              v-model="order"
              :rules="[
                (v) => {
                  if (v) return true
                  return 'لطفا ترتیب را بنویسید'
                }
              ]"
            />
          </v-col>
        </v-row>
        <quill-editor
          contentType="html"
          v-model:content="text"
          :toolbar="toolbarOptions"
          style="height: 500px"
        />
      </v-card-text>
    </v-form>
  </v-card>
</template>

<script>
import helpService from '../../../api/help/helpService'
// import BlotFormatter from 'quill-blot-formatter'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import saveIcon from '../../components/icons/Save.vue'
import { markRaw } from 'vue'

export default {
  data() {
    return {
      saveIcon: markRaw(saveIcon),
      isEdit: false,
      id: null,
      selectedRoute: null,
      title: null,
      order: null,
      routes: [],
      text: '',
      toolbarOptions: [
        ['bold', 'italic', 'underline', 'strike'], // toggled buttons
        ['blockquote'],

        [{ header: 1 }, { header: 2 }], // custom button values
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
        [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
        [{ direction: 'rtl' }], // text direction

        [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [] }, { background: [] }], // dropdown with defaults from theme
        [{ align: [] }],
        ['image'],

        ['clean'] // remove formatting button
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    async save() {
      const { valid } = await this.$refs.helpForm.validate()
      if (valid) {
        if (this.isEdit) await this.editHelp()
        else await this.addHelp()
      }
    },
    async addHelp() {
      await helpService
        .add({
          entity: {
            content: this.text,
            order: this.order,
            route: this.selectedRoute,
            title: this.title
          }
        })
        .then((res) => {
          if (res.isSuccess) {
            this.setErrorMessage('راهنما با موفقیت ثبت شد!', 'success')
            this.$router.push('/manage/tutorial')
          } else this.setErrorMessage(res.message)
        })
    },
    async editHelp() {
      await helpService
        .update({
          entity: {
            id: this.id,
            route: this.selectedRoute,
            content: this.text,
            order: this.order,
            title: this.title
          }
        })
        .then((res) => {
          if (res.isSuccess) {
            this.setErrorMessage('راهنما با موفقیت ویرایش شد!', 'success')
            this.$router.push('/manage/tutorial')
          } else this.setErrorMessage(res.message)
        })
    },
    async getHelpById(id) {
      await helpService.getById(id).then((res) => {
        if (res.isSuccess) {
          this.selectedRoute = res.entity.route
          this.title = res.entity.title
          this.order = res.entity.order
          this.text = res.entity.content
        } else {
          this.setErrorMessage(res.message)
          this.$router.push('/manage/tutorial')
        }
      })
    }
  },
  async mounted() {
    this.isEdit = this.currentActiveTab.params.isEdit == 'true'
    this.id = this.currentActiveTab.params.id
    if (this.currentActiveTab.params.id != 'null') this.getHelpById(this.currentActiveTab.params.id)
    this.routes = this.$router.getRoutes()
    this.routes.forEach((x) => {
      x.newName = this.$t(x.name)
    })
  }
}
</script>

<style></style>
