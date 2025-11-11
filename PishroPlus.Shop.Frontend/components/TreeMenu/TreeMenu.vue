<template>
  <v-list density="compact" class="menu-list" open-strategy="single">
    <template v-for="item in categories" :key="item.id">
      <v-list-group
        :value="item.name"
        @click="handleGroupClick"
        class="menu-group"
        v-if="hasChildren(item)"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
            v-bind="props"
            class="menu-item"
            :class="{ 'has-children': hasChildren(item) }"
          >
            <v-list-item-title>
              <span class="font-weight-bold">{{ item.name }}</span>
            </v-list-item-title>
          </v-list-item>
        </template>

        <TreeMenu 
          :categories="item.children" 
          :depth="depth + 1" 
        />
      </v-list-group>   
      <v-list-item 
        v-else
        link 
        class="menu-item"
      >
        <v-list-item-title>
          <span class="font-weight-bold">{{ item.name }}</span>
        </v-list-item-title>
      </v-list-item>
      <!-- <v-list-item v-else :to="item.link" link class="menu-item">
        <v-list-item-title>
          <span>{{ item.title }}</span>
        </v-list-item-title>
      </v-list-item> -->
    </template>
  </v-list>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => [],
  },
  depth: {
    type: Number,
    default: 0,
  },
});

const opened = ref([]);

const hasChildren = (item) => {
  return item.children && item.children.length > 0;
};

const handleGroupClick = (event) => {
  const currentLevel = event.target.closest(".v-list");
  const groups = currentLevel.querySelectorAll(".v-list-group--active");

  groups.forEach((group) => {
    if (!group.contains(event.target)) {
      const items = group.querySelector(".v-list-group__items");
      if (items) {
        items.style.display = "none";
        group.classList.remove("v-list-group--active");
      }
    }
  });
};

watch(
  () => props.depth,
  (newDepth) => {
    if (newDepth === 0) {
      opened.value = [];
    }
  }
);

</script>

<style scoped>
.menu-list {
  min-width: 300px !important;
  background: white;
  border-radius: 8px;
  padding: 4px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  max-height: calc(100vh - 120px);
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-item {
  padding: 12px 16px;
  min-height: 48px;
  transition: all 0.2s ease;
  border-radius: 6px;
  margin: 2px 0;
  white-space: normal !important;
  line-height: 1.4;
}

.menu-item:hover {
  background-color: #f5f7fa;
  color: #1a73e8;
}

.menu-group {
  background-color: white;
  transition: background-color 0.3s ease;
}

:deep(.v-list-group--active) {
  background-color: #f8f9fa;
  border-radius: 8px;
}

:deep(.v-list-group__items) {
  padding-right: 8px !important;
  background-color: #fcfcfc;
  border-radius: 0 0 8px 8px;
  margin-top: 2px;
  max-height: calc(100vh - 200px);
  overflow-y: auto;
}

.menu-list::-webkit-scrollbar,
:deep(.v-list-group__items::-webkit-scrollbar) {
  width: 1px;
}

.menu-list::-webkit-scrollbar-track,
:deep(.v-list-group__items::-webkit-scrollbar-track) {
  background: #f1f1f1;
  border-radius: 3px;
}

.menu-list::-webkit-scrollbar-thumb,
:deep(.v-list-group__items::-webkit-scrollbar-thumb) {
  background: #c1c1c1;
  border-radius: 3px;
}

.menu-list::-webkit-scrollbar-thumb:hover,
:deep(.v-list-group__items::-webkit-scrollbar-thumb:hover) {
  background: #a8a8a8;
}

:deep(.v-list-group--active > .v-list-group__items) {
  background-color: rgba(0, 0, 0, 0.02);
}

:deep(.v-list-group--active .v-list-group__header .v-icon) {
  transform: rotate(-90deg);
}

.has-children:hover {
  background-color: #eef2ff;
}

.v-list-item-title {
  font-size: 0.95rem;
  white-space: normal !important;
  line-height: 1.4;
}
</style>