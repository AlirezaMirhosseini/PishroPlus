<script>
import { useI18n } from 'vue-i18n'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from './stores/default'
import warning from './components/baseComponents/warning.vue'

// window.onbeforeunload = function (event) {
//   console.log("here");
//   event.returnValue = "hello"
//   return confirm('آیا مطمئن هستید؟ ممکن است تغییراتی ذخیره نشده باشد!')
// }

export default {
  data() {
    return {
      isRtl: true,
      currentLocale: useI18n().locale,
      componentKey: 0
    }
  },
  watch: {
    currentLocale(value) {
      this.componentKey += 1
      if (value == 'fa') this.isRtl = true
      else this.isRtl = false
    },
    $route(to, from) {
      // When the route changes, increment the key to force a re-render
      this.componentKey += 1
    }
  },
  computed: {
    ...mapState(defaultStore, {
      showError: 'showErrorMessage',
      snackbarColor: 'snackbarColor',
      errorMessage: 'errorMessage',
      defaultFont: 'defaultFont',
      cardTitleFont: 'cardTitleFont',
      pageTitleFont: 'pageTitleFont',
      captionFont: 'captionFont',
      pfont: 'font'
    }),
    font() {
      if (this.$i18n.locale == 'fa') return this.pfont
      else return 'system-ui'
    },
    defaultFontSize() {
      return this.defaultFont + 'px'
    },
    defaultXsFontSize() {
      return (Number.parseInt(this.defaultFont) - 2).toString() + 'px'
    },
    cardTitleFontSize() {
      return this.cardTitleFont + 'px'
    },
    pageTitleFontSize() {
      return this.pageTitleFont + 'px'
    },
    androidPageTitleFontSize() {
      return this.pageTitleFont - 10 + 'px'
    },
    captionFontSize() {
      return this.captionFont + 'px'
    }
  },
  methods: {
    ...mapActions(defaultStore, { setErrorMessage: 'setErrorMessage' }),
    handleBeforeUnload(event) {
      event.preventDefault()
      const message = 'تغییراتی که ایجاد کرده‌اید ممکن است ذخیره نشوند.';
      event.returnValue = message;
      console.log("we're in methods");
      console.log(event);
      confirm(message)
      return ''
    }
  },
  components: {
    warning
  },
  // beforeDestroy() {
  //   window.removeEventListener('beforeunload', this.handleBeforeUnload);
  //   console.log("beforeDestroy");
  // },
  mounted() {
    var lang = localStorage?.getItem('lang') ?? 'fa'
    this.currentLocale = lang
    // window.addEventListener('beforeunload', this.handleBeforeUnload);
    // window.addEventListener('beforeunload', (event) => {
    //   event.returnValue = 'Are you sure?';
    // });
    // console.log("mounted");
  }
}
</script>

<template>
  <v-app>
    <v-locale-provider :rtl="isRtl">
      <v-snackbar position="absolute" location="top" offset="100px" v-model="showError" :color="snackbarColor"
        style="white-space: pre-wrap;top:50px;">
        {{ errorMessage }}
        <template v-slot:actions>
          <v-btn variant="text" icon="mdi mdi-close" @click="setErrorMessage(false)" />
        </template>
      </v-snackbar>
      <warning />
      <component :is="$route.meta.layout || 'div'" :key="componentKey">
        <template v-if="$route.meta.preventTab == true">
          <router-view />
        </template>
      </component>
    </v-locale-provider>
  </v-app>
</template>
<!-- <script>
export default {
  mounted() {
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  },
  methods: {
    handleBeforeUnload(event) {
      const message = 'لطفاً مطمئن شوید که تغییرات خود را ذخیره کرده‌اید.';
      event.returnValue = message; // برای مرورگرهای جدید
      return message; // برای مرورگرهای قدیمی
    },
  },
};
</script> -->
<style>
* {
  font-family: v-bind(font) !important;
  font-size: v-bind(defaultFontSize);
}

.v-card-title {
  font-size: v-bind(cardTitleFontSize) !important;
  padding: 0.5rem 0 !important;
}

.page-title {
  font-size: v-bind(pageTitleFontSize);
}

.android-page-title {
  font-size: v-bind(androidPageTitleFontSize);
}

.pishro-caption {
  font-size: v-bind(captionFontSize) !important;
}

.right-menu-item-text {
  font-size: 10px;
}

.right-menu-sub-items-expanded .right-menu-item-text,
.right-menu-expanded .right-menu-item-text {
  font-size: v-bind(defaultFontSize);
}

input,
label {
  font-size: v-bind(defaultFontSize) !important;
}

@media only screen and (max-width: 600px) {
  * {
    font-size: v-bind(defaultXsFontSize);
  }
}
</style>
