import { createI18n } from 'vue-i18n'
import fa from './lang/fa-IR'
import en from './lang/en-US'

const messages = { en, fa }
const vuei18n = new createI18n({
  legacy: false,
  locale: 'fa', // set locale,
  fallbackLocale: 'en', // set fallback locale,
  availableLocales: ['fa', 'en'],
  messages // set locale messages
})

export default vuei18n
