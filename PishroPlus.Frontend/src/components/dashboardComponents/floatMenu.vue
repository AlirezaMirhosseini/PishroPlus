<template>
  <div class="float-menu d-none d-md-block">
    <div :class="['menu-btn', toggled ? 'menu-toggled' : 'menu-untoggled']">
      <v-btn class="menu-btn" @click="toggled = !toggled" icon="mdi mdi-menu" color="primary" />
    </div>
    <div :class="['menu-btn', toggled ? 'close-untoggled' : 'close-toggled']">
      <v-btn class="menu-btn" @click="toggled = !toggled" icon="mdi mdi-close" color="primary" />
    </div>
    <div :class="['menu-btn', toggled ? 'toggled' : '']">
      <v-menu location="end">
        <template v-slot:activator="{ props: menu }">
          <v-tooltip location="top">
            <template v-slot:activator="{ props: tooltip }">
              <v-btn icon="mdi mdi-plus" color="primary" v-bind="mergeProps(menu, tooltip)"/>
            </template>
            <span>{{ $t('addItem') }}</span>
          </v-tooltip>
        </template>
<slot/>
      </v-menu>
    </div>
    <div :class="['menu-btn', toggled ? 'toggled' : '']">
      <v-tooltip :text="$t('defaultArrange')">
        <template v-slot:activator="{ props }">
          <v-btn
            @click="$emit('setDefault')"
            v-bind="props"
            icon="mdi mdi-restore"
            color="primary"
          />
        </template>
      </v-tooltip>
    </div>
  </div>
</template>

<script>
import { mergeProps } from 'vue'
export default {
  methods: {
    mergeProps
  },
  data() {
    return {
      toggled: false,
    }
  },
  emits: ['setDefault']
}
</script>

<style>
.menu-toggled {
  opacity: 0;
  transform: translateY(25px);
}

.menu-untoggled {
  opacity: 1;
  transform: translateY(0px);
}

.close-toggled {
  opacity: 0;
  transform: translateY(-25px);
}

.close-untoggled {
  opacity: 1;
  transform: translateY(0px);
}

.v-locale--is-rtl .float-menu {
  left: 0;
  right: unset;
}

.float-menu {
  position: fixed;
  top: 50%;
  z-index: 2;
  right: 0;
  left: unset;
  margin-inline-end: -24px;
}

.v-locale--is-rtl .toggled:nth-child(3) {
  left: 50px;
  right: unset;
}

.toggled:nth-child(3) {
  right: 50px;
  left: unset;
  top: -50px;
  opacity: 1 !important;
  -webkit-transition-delay: 0s;
  transition-delay: 0s;
}

.v-locale--is-rtl .toggled:nth-child(4) {
  left: 50px;
  right: unset;
}

.toggled:nth-child(4) {
  right: 50px;
  left: unset;
  top: 50px;
  opacity: 1 !important;
  -webkit-transition-delay: 0.1s;
  transition-delay: 0.1s;
}

.v-locale--is-rtl .menu-btn {
  left: 0;
  right: unset;
}

.menu-btn {
  position: absolute;
  left: unset;
  right: 0;
  top: 0;
  -webkit-transition: all 0.6s cubic-bezier(0.87, -0.41, 0.19, 1.44);
  transition: all 0.6s cubic-bezier(0.87, -0.41, 0.19, 1.44);
  z-index: 1;
}

.menu-btn:nth-child(1) .v-btn__content {
  margin-inline-start: -15px;
}

.menu-btn:nth-child(3),
.menu-btn:nth-child(4) {
  opacity: 0;
  z-index: 0;
}
</style>
