<template>
  <v-list-group value="categories">
    <template v-slot:activator="{ props }">
      <v-list-item v-bind="props" prepend-icon="mdi-menu">
        <v-list-item-title>دسته‌بندی کالاها</v-list-item-title>
      </v-list-item>
    </template>

    <v-list-group
      v-for="category in categories"
      :key="category.id"
      :value="category.id"
    >
      <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" :prepend-icon="category.icon">
          <v-list-item-title>{{ category.title }}</v-list-item-title>
        </v-list-item>
      </template>

      <v-list-group
        v-for="section in category.sections"
        :key="section.id"
        :value="section.id"
      >
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props">
            <v-list-item-title>{{ section.title }}</v-list-item-title>
          </v-list-item>
        </template>

        <v-list-item
          v-for="item in section.items"
          :key="item.id"
          :to="item.link"
          class="mobile-category-item"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list-group>
    </v-list-group>
  </v-list-group>
</template>

<script setup>
import { useCategories } from '@/composables/useCategories';

const { categories } = useCategories();
</script>

<style scoped>
.mobile-category-item {
  padding-right: 32px !important;
}

:deep(.v-list-group__items) {
  margin-right: 8px;
}

:deep(.v-list-item) {
  min-height: 44px;
}
</style>