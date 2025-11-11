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
        <help-stepper :items="helpItems" />
      </div>
    </div>
  </v-overlay>

  <div class="desktop-top-bar">
    <div style="display: flex; align-items: center">
      <span class="top-icon">
        <v-tooltip :text="$t('refresh')">
          <template v-slot:activator="{ props }">
            <v-btn
              @click="refreshCurrentTab"
              size="medium"
              icon="mdi-refresh"
              color="primary"
              variant="text"
              v-bind="props"
            />
          </template> </v-tooltip
      ></span>
      <span class="top-icon">
        <dialogs></dialogs>
      </span>
      <span class="top-icon"
        ><v-btn
          @click="showHelp"
          size="medium"
          color="primary"
          icon="mdi-information-outline"
          variant="text"
      /></span>
      <span class="top-icon">
        <v-tooltip :text="$t('feedBack')">
          <template v-slot:activator="{ props }">
            <feedBack v-bind="props" />
          </template>
        </v-tooltip>
      </span>
      <span class="top-icon">
        <theme-switcher />
      </span>
      <lang-switcher menuClass="top-icon" />
    </div>
  </div>
</template>

<script>
// import Tabs from '../layoutComponents/tabs.vue';
import feedBack from '../ticketComponents/feedBack.vue'
// import feedBack from '../ticketComponents/feedBack.vue'
import LangSwitcher from './langSwitcher.vue'
import ThemeSwitcher from './themeSwitcher.vue'
import { useI18n } from 'vue-i18n'
import search from './search.vue'
import helpStepper from './helpStepper.vue'
import helpService from '../../../api/help/helpService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dialogs from '../layoutComponents/dialogs.vue'
import feedbackVue from '../icons/feedback.vue'
export default {
  data() {
    return {
      currentLocale: useI18n().locale,
      helpOverlay: false,
      helpItems: [],
      dialogIsVisible: false
    }
  },
  props: {
    pageTitle: {
      required: false
    }
  },
  computed: {},
  methods: {
    ...mapActions(defaultStore, {
      closeTab: 'closeTab',
      setNewTab: 'setNewTab',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      setErrorMessage: 'setErrorMessage'
    }),

    async showHelp() {
      await helpService
        .getByRoute(this.$router.getRoutes().filter((a) => a.name == this.$route.name)[0].path)
        .then((res) => {
          if (res.isSuccess) {
            this.helpItems = res.entities
            this.helpOverlay = true
          } else this.setErrorMessage(res.message)
        })
    },
    showDialog() {
      this.dialogIsVisible = true
    }
  },
  components: {
    LangSwitcher,
    ThemeSwitcher,
    search,
    helpStepper,
    dialogs,
    feedBack
    // Tabs
  },
  watch: {
    currentLocale(newValue, oldValue) {
      if (oldValue != newValue)
        this.routes = this.$router
          .getRoutes()
          .filter(
            (z) =>
              !(z.path.includes('test') || z.path.includes('login') || z.name === 'userPermissions')
          )
      this.routes.forEach((x) => {
        x.newName = this.$t(x.name)
      })
    }
  }
}
</script>

<style></style>
