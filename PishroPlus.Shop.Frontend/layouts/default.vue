<template>
  <div class="app-layout">
    <div class="content-wrapper">
      <BaseHeader />
      <MegaMenu :cartCount="cartCount" :favoriteCount="favoriteCount" />
      <slot class="main-content"/>
    </div>
    <BaseFooter class="footer"/>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { defaultStore } from '~/store/defaultStore';

const store = defaultStore();

const cartCount = computed(() => store.getTotalItems());
const favoriteCount = computed(() => store.getFavoriteCount);

</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content-wrapper {
  flex: 1 0 auto;
}

.footer {
  flex-shrink: 0;
}

.main-content {
  flex-grow: 1;
}
</style>