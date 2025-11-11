import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '../plugins/router'
import vuetify from '../plugins/vuetify'
import vuei18n from '../plugins/vue-i18n'
import { datePickerConfig, dateTimePickerConfig, timePickerConfig } from '../plugins/date-picker'
import defaultMixin from '../plugins/mixins/default-mixin'
import './assets/style.css'
import './registerServiceWorker'
import VOtpInput from 'vue3-otp-input'
import Vue3PersianDatetimePicker from 'vue3-persian-datetime-picker'
import { cloneDeep as clone } from 'lodash'
import draggable from 'vuedraggable'
import '@imengyu/vue3-context-menu/lib/vue3-context-menu.css'
import ContextMenu from '@imengyu/vue3-context-menu'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import { vue3Debounce } from 'vue-debounce'
import cDialog from './components/baseComponents/cDialog.vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import { vMaska } from 'maska'


const app = createApp(App)
// router.beforeEach((to, from, next) => {
//     console.log(app);
//     // app['_instance']['ctx'].addTab(to, from)
// })
app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(vuei18n)
app.use(ContextMenu)
app.directive('maska', vMaska)
app.component('cDialog', cDialog)
app.directive('debounce', vue3Debounce({ lock: true }))
app.component('draggable', draggable)
app.component('QuillEditor', QuillEditor)
app.component('QrcodeStream', QrcodeStream)
app.use(clone(Vue3PersianDatetimePicker), datePickerConfig)
app.use(clone(Vue3PersianDatetimePicker), dateTimePickerConfig)
app.use(clone(Vue3PersianDatetimePicker), timePickerConfig)
app.component('v-otp-input', VOtpInput)
app.mixin(defaultMixin)
app.mount('#app')
