<template>
  <v-btn :class="menuClass" color="androidTopBar" variant="flat">
    <p class="d-none d-md-flex">{{ currentLang.title }}</p>
    <v-icon class="ms-2" small :icon="currentLang.icon" />
    <v-menu activator="parent" location="bottom end">
      <v-list>
        <v-list-item
          density="compact"
          v-for="locale in availableLocales"
          :key="locale.title"
          @click.prevent="setLocale(locale.locale)"
          :prepend-icon="locale.icon"
          :title="locale.title"
        >
        </v-list-item>
      </v-list>
    </v-menu>
  </v-btn>
</template>

<script>
import { shallowRef } from 'vue'
import irFlag from '../icons/Iran-Flag.vue'
import usFlag from '../icons/US-Flag.vue'
import axios from 'axios'

export default {
  name: 'LangSwitcher',
  props: { menuClass: '' },
  data() {
    return {
      irFlag: shallowRef(irFlag),
      usFlag: shallowRef(usFlag)
    }
  },
  components: {
    irFlag,
    usFlag
  },
  computed: {
    currentLang() {
      let lang = ''
      let icon = null
      let x = this.$i18n.locale
      switch (x) {
        case 'fa':
          lang = 'فارسی'
          icon = this.irFlag
          break
        case 'en':
          lang = 'English'
          icon = this.usFlag
          break
      }
      return { title: lang, icon: icon }
    },
    availableLocales() {
      const locales = this.$i18n.availableLocales
        .filter((locale) => locale !== this.$i18n.locale)
        .map((x) => {
          let lang = ''
          let icon = null
          switch (x) {
            case 'fa':
              lang = 'فارسی'
              icon = this.irFlag
              break
            case 'en':
              lang = 'English'
              icon = this.usFlag
              break
          }
          return { locale: x, title: lang, icon: icon }
        })
      return locales
    }
  },
  methods: {
    setLocale(locale) {
      this.$i18n.locale = locale
      localStorage.setItem('lang', locale)
      axios.defaults.headers.common['Accept-Language'] = locale
    }
  }
}
</script>
