<template>
  <div class="right-menu bg-surface right-menu-nested-sub-items elevation-2">
    <div class="d-flex align-center mb-16">
      <v-icon :icon="selectedSubItem.icon" size="large" color="primary" />
      <div class="d-flex flex-grow-1 align-center">
        <p class="ms-4" style="color: rgb(var(--v-theme-primary))">
          {{ selectedSubItem.title }}
        </p>
        <v-spacer />
        <v-btn
          @click="$emit('CloseNestedSubMenu')"
          icon="mdi-chevron-double-down back-chevron"
          size="small"
          color="primary"
          variant="text"
        />
      </div>
    </div>
    <router-link
      :to="item.link"
      @click.prevent="$emit('closeMenu')"
      v-for="item in selectedSubItem.items"
      class="right-menu-navigation-item"
      :key="item.id"
    >
      <v-btn :icon="item.icon" variant="text" color="primary" />
      <p>{{ item.title }}</p>
    </router-link>
  </div>
</template>

<script>
export default {
  props: {
    selectedSubItem: {
      required: true
    }
  },
  emits: ['CloseNestedSubMenu','closeMenu']
}
</script>

<style></style>
