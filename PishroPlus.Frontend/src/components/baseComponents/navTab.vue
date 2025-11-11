<template>
  <div :class="[theme == 0 ? 'bg-surface' : 'bg-navBg', 'nav-tab-wrapper']">
    <div
      :class="['active-tab-bg', theme == 0 ? 'active-theme-0' : 'active-theme-1']"
      :style="`margin-inline-start: ${activeTab * 140}px`"
    ></div>
    <v-btn
      :ripple="false"
      :class="[
        'nav-button',
        index == activeTab
          ? theme == 0
            ? 'text-primary'
            : 'text-white'
          : theme == 0
          ? ''
          : 'text-grey'
      ]"
      :variant="theme == 1 && index == activeTab ? 'flat' : 'text'"
      width="140px"
      v-for="(item, index) in items"
      :key="index"
      @click="setActiveTab(index)"
      :disabled="disabled?.includes(item)"
      style="transition: 0.3s ease"
      >{{ item }}</v-btn
    >
  </div>
</template>

<script>
export default {
  props: {
    items: {
      required: true
    },
    disabled: {
      required: false,
      default: []
    },
    activeTab: {
      required: false,
      default: 0
    },
    storeName: {
      required: false,
      default: 0
    },
    theme: {
      required: false,
      default: 0
    }
  },
  emits: ['update:activeTab'],
  methods: {
    setActiveTab(index) {
      this.$emit('update:activeTab', index)
      if (this.storeName) localStorage.setItem(this.storeName, index)
    }
  }
}
</script>

<style>
.active-tab-bg {
  width: 140px;
  position: absolute;
  height: 36px;
  border-radius: 5px;
  transition: all 0.6s cubic-bezier(0.87, -0.36, 0.19, 1.34);
}

.active-theme-0 {
  background: rgb(var(--v-theme-primary), 20%);
}

.active-theme-1 {
  background: rgb(var(--v-theme-primary));
}

.nav-tab-wrapper {
  width: fit-content;
  padding: 7px;
  margin-inline: auto;
  margin-bottom: 10px;
  border-radius: 5px;
  display: flex;
  overflow-x: auto;
  max-width: 100%;
}

.nav-button {
  background: transparent !important;
}
</style>
