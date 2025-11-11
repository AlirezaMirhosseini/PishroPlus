import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { fa } from 'vuetify/iconsets/fa'
import * as components from 'vuetify/components'
import * as labsComponents from 'vuetify/labs/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components: {
    ...components,
    ...labsComponents
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      fa
    },
    locale: {
      rtl: true
    }
  },
  theme: {
    defaultTheme: localStorage?.getItem('v-theme') ?? 'light',
    themes: {
      light: {
        colors: {
          primary: localStorage?.getItem('theme') ?? '#2C73A7',
          grey: '#7b7b7b',
          lgrey: '#f3f3f3',
          success: '#46BE91',
          warning: '#EF884E',
          info: '#588BFF',
          error: '#E45252',
          container: '#eeeeee',
          androidTopBar: localStorage?.getItem('theme') ?? '#2C73A7',
          datePicker: localStorage?.getItem('theme') ?? '#2C73A7',
          lightBlue: '#EBF1FF',
          navBg: '#F3F3F3',
          greyArrow: '#7b7b7b',
          darkContainer:'#ffffff'
        }
      },
      dark: {
        colors: {
          primary: '#C7C7C7',
          grey: '#ffffff',
          lgrey: '#bdbdbd',
          success: '#ffffff',
          warning: '#ffffff',
          info: '#ffffff',
          error: '#ffffff',
          container: '#182533',
          surface:localStorage?.getItem('drakSurface') ?? '#2B5278',
          androidTopBar: localStorage?.getItem('drakSurface') ??'#2B5278',
          datePicker: '#182533',
          lightBlue: '#182533',
          navBg: '#182533',
          greyArrow: '#182533',
          darkContainer:'#C7C7C7'
        }
      }
    }
  }
})

export default vuetify
