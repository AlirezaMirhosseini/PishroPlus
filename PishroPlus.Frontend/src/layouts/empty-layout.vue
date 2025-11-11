<script>
import LangSwitcher from '../components/layoutComponents/langSwitcher.vue'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../stores/default'
export default {
  data() {
    return {
      darkmode: true
    }
  },
  computed: {
    ...mapState(defaultStore, {
      theme: 'theme'
    })
  },
  watch: {
    darkmode(value) {
      if (value) {
        this.setTheme('light')
        this.$vuetify.theme.global.name = 'light'
      } else {
        this.setTheme('dark')
        this.$vuetify.theme.global.name = 'dark'
      }
    }
  },
  components: {
    LangSwitcher
  },
  methods: {
    ...mapActions(defaultStore, {
      setTheme: 'setTheme'
    })
  },
  mounted() {
    if (this.theme === 'light') this.darkmode = true
    else this.darkmode = false
  }
}
</script>

<template>
  <div class="h-100 w-100 overflow-auto">
    <v-main class="main">
      <v-card elevation="0" class="ma-4 p-relative" width="473" max-width="100%" height="680">
        <div class="pa-4 d-flex justify-end">
          <label class="dayNightLogin">
            <input v-model="darkmode" type="checkbox" />
            <div></div>
          </label>
          <lang-switcher />
        </div>
        <slot />
      </v-card>
    </v-main>
  </div>
</template>

<style scoped>
.v-theme--dark .main {
  background-color: rgba(16, 61, 115, 1);
}

.v-theme--light .main {
  background-color: #eeeeee;
}

.main {
  background-image: url(../assets/images/login-bg.png);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  background-size: cover;
}

.dayNightLogin {
  cursor: pointer;
}

.dayNightLogin input {
  display: none;
}

.dayNightLogin input+div {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  position: relative;
  box-shadow: inset 16px -16px 0 0 rgb(var(--v-theme-primary));
  transform: scale(0.6) rotate(-2deg);
  transition: box-shadow 0.5s ease 0s, transform 0.4s ease 0.1s;
}

.dayNightLogin input+div:before {
  content: '';
  width: inherit;
  height: inherit;
  border-radius: inherit;
  position: absolute;
  left: 0;
  top: 0;
  transition: background 0.3s ease;
}

.dayNightLogin input+div:after {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin: -4px 0 0 -4px;
  position: absolute;
  top: 50%;
  left: 50%;
  box-shadow: 0 -23px 0 rgb(var(--v-theme-primary)), 0 23px 0 rgb(var(--v-theme-primary)),
    23px 0 0 rgb(var(--v-theme-primary)), -23px 0 0 rgb(var(--v-theme-primary)),
    15px 15px 0 rgb(var(--v-theme-primary)), -15px 15px 0 rgb(var(--v-theme-primary)),
    15px -15px 0 rgb(var(--v-theme-primary)), -15px -15px 0 rgb(var(--v-theme-primary));
  transform: scale(0);
  transition: all 0.3s ease;
}

.dayNightLogin input:checked+div {
  box-shadow: inset 32px -32px 0 0 #fff;
  transform: scale(0.3) rotate(0deg);
  transition: transform 0.3s ease 0.1s, box-shadow 0.2s ease 0s;
}

.dayNightLogin input:checked+div:before {
  background: rgb(var(--v-theme-primary));
  transition: background 0.3s ease 0.1s;
}

.dayNightLogin input:checked+div:after {
  transform: scale(1.5);
  transition: transform 0.5s ease 0.15s;
}</style>
