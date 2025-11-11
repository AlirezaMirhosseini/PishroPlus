<template>
  <label class="dayNight">
    <input v-model="darkmode" type="checkbox" />
    <div></div>
  </label>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'

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

<style>
.dayNight {
  cursor: pointer;
}
.dayNight input {
  display: none;
}
.dayNight input + div {
  border-radius: 50%;
  width: 36px;
  height: 36px;
  position: relative;
  box-shadow: inset 16px -16px 0 0 rgb(var(--v-theme-primary));
  transform: scale(0.6) rotate(-2deg);
  transition: box-shadow 0.5s ease 0s, transform 0.4s ease 0.1s;
}
.dayNight input + div:before {
  content: '';
  width: inherit;
  height: inherit;
  border-radius: inherit;
  position: absolute;
  left: 0;
  top: 0;
  transition: background 0.3s ease;
}
.dayNight input + div:after {
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
.dayNight input:checked + div {
  box-shadow: inset 32px -32px 0 0 #fff;
  transform: scale(0.3) rotate(0deg);
  transition: transform 0.3s ease 0.1s, box-shadow 0.2s ease 0s;
}
.dayNight input:checked + div:before {
  background: rgb(var(--v-theme-primary));
  transition: background 0.3s ease 0.1s;
}
.dayNight input:checked + div:after {
  transform: scale(1.5);
  transition: transform 0.5s ease 0.15s;
}

@media only screen and (max-width: 960px) {
  .dayNight input + div {
    box-shadow: inset 16px -16px 0 0 #ffffff;
  }

  .dayNight input + div:after {
    box-shadow: 0 -23px 0 #ffffff, 0 23px 0 #ffffff, 23px 0 0 #ffffff, -23px 0 0 #ffffff,
      15px 15px 0 #ffffff, -15px 15px 0 #ffffff, 15px -15px 0 #ffffff, -15px -15px 0 #ffffff;
  }

  .dayNight input:checked + div:before {
    background: #ffffff;
  }
}
</style>
