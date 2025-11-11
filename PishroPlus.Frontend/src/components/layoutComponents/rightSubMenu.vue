<template>
  <div
    :class="[
      'right-menu',
      'bg-surface',
      'right-menu-sub-items',
      'elevation-2',
      isSubMenuExpanded ? 'right-menu-sub-items-expanded' : ''
    ]"
  >
    <div class="d-flex align-center mb-16">
      <v-icon
        :class="isSubMenuExpanded ? '' : 'ms-3'"
        :icon="selectedItem.icon"
        size="large"
        color="grey"
      />
      <div v-if="isSubMenuExpanded" class="d-flex flex-grow-1 align-center">
        <p class="ms-4" style="color: rgb(var(--v-theme-grey))">
          {{ selectedItem.title }}
        </p>
        <v-spacer />
        <v-btn
          @click.prevent="$emit('CloseSubMenu')"
          icon="mdi-chevron-double-down back-chevron"
          size="small"
          color="grey"
          variant="text"
        />
      </div>
    </div>
    <div class="d-flex flex-column" style="overflow-y: auto; overflow-x: hidden">
      <template
        v-for="item in selectedItem.items?.filter(
          (b) => searchCheck(b) || subItemsearchCheck(b) || parentSearchCheck()
        )"
        :key="selectedItem.id + '-' + item.id"
      >
        <div v-if="item?.items?.length > 0" class="d-flex align-center">
          <p class="text-grey pishro-caption me-3" style="font-weight: bold; white-space: nowrap">
            {{ item.title }}
          </p>
          <v-divider />
        </div>
        <router-link
          v-else
          @click.prevent="handleItemClick(item)"
          :key="item.id"
          :to="item.link"
          class="right-menu-item right-menu-link"
        >
          <v-btn :icon="item.icon" variant="text" color="grey" />
          <p class="right-menu-item-text">{{ item.title }}</p>
        </router-link>
        <div
          :class="searchText ? '' : 'right-sub-item-child-content'"
          v-if="item?.items?.length > 0"
        >
          <div
            :id="'rightContent' + selectedItem.id + '-' + item.id"
            class="d-flex flex-column ms-4"
          >
            <router-link
              v-for="child in item.items.filter(
                (c) => searchCheck(c) || searchCheck(item) || parentSearchCheck()
              )"
              @click.prevent="handleItemClick(child)"
              :key="child.id"
              :to="child.link"
              class="right-menu-item right-menu-link"
            >
              <v-btn :icon="child.icon" variant="text" color="grey" />
              <p class="right-menu-item-text">{{ child.title }}</p>
            </router-link>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import utils from '../../../plugins/utils'

export default {
  props: {
    isSubMenuExpanded: {
      required: true
    },
    selectedItem: {
      required: true
    },
    selectedSubItem: {
      required: true
    },
    searchText: {
      required: false
    }
  },
  emits: ['CloseSubMenu', 'closeMenu'],
  methods: {
    expandChildren(item) {
      if (item?.items?.length > 0 && !this.searchText) item.showChildren = !item.showChildren
      else this.$emit('closeMenu')
    },
    getScrollHeight(id) {
      let idString = 'rightContent' + this.selectedItem.id + '-' + id
      let height = document.getElementById(idString).scrollHeight
      return `${height}px`
    },
    searchCheck(item) {
      return utils.filterBySearch(this.searchText, ['title'], item)
    },
    subItemsearchCheck(item) {
      if (item.items?.length > 0) {
        return item.items.some((z) => utils.filterBySearch(this.searchText, ['title'], z))
      } else return false
    },
    parentSearchCheck() {
      return utils.filterBySearch(this.searchText, ['title'], this.selectedItem)
    },
    handleItemClick(item) {
      utils.addToRecents(item);
      this.$emit('closeMenu');
    },
  }
}
</script>

<style></style>
