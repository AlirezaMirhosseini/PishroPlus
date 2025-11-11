<template>
  <div class="android-top-bar bg-androidTopBar">
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
    <div class="d-flex align-center">
      <v-btn
        :icon="menuIcon"
        @click.stop="$emit('openMenuAndroid')"
        variant="text"
        color="white"
      ></v-btn>
      <lang-switcher />
      <theme-switcher />
    </div>
    <div style="display: flex; align-items: center; min-width: 150px; position: initial">
      <p
        class="android-page-title"
        style="color: white; position: absolute; left: 50%; transform: translateX(-50%)"
      >
        {{ $t(pageTitle) }}
      </p>
    </div>
    <div style="display: flex; align-items: center">
      <span class="top-icon">
        <v-badge offset-x="40" offset-y="30" content="33" max="10" color="white">
          <v-btn size="small" color="white" icon="mdi-bell-outline" variant="text">
          </v-btn> </v-badge
      ></span>
      <span class="top-icon"
        ><v-btn
          @click="showHelp"
          size="small"
          color="white"
          icon="mdi-information-outline"
          variant="text"
      /></span>
    </div>
  </div>
</template>

<script>
import LangSwitcher from './langSwitcher.vue'
import ThemeSwitcher from './themeSwitcher.vue'
import helpStepper from './helpStepper.vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import helpService from '../../../api/help/helpService'

export default {
  data() {
    return {
      helpOverlay: false,
      helpItems: []
    }
  },
  props: {
    pageTitle: {
      required: false
    },
    menuIcon: {
      required: true
    }
  },
  methods: {
    ...mapActions(defaultStore, {
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
    }
  },
  emits: ['openMenuAndroid'],
  components: {
    LangSwitcher,
    ThemeSwitcher,
    helpStepper
  }
}
</script>

<style></style>
