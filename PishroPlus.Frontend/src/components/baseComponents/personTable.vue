<template>
  <div class="person-table">
    <v-row class="my-2 flex-grow-0" no-gutters>
      <v-text-field
        v-if="hasSearch"
        ref="tableSearchText"
        variant="outlined"
        hide-details
        v-model="searchText"
        density="compact"
        prepend-inner-icon="mdi mdi-magnify"
        :label="$t('search') + ' (' + $t('ctrlSlash') + ')'"
        style="max-width: 300px"
      />
      <v-row class="align-center justify-end" no-gutters>
        <slot name="toolbar"></slot>
        <v-menu :close-on-content-click="false" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn
              v-bind="props"
              class="ms-2"
              color="grey"
              icon="mdi mdi-table-cog"
              variant="tonal"
              size="x-small"
            />
          </template>
          <v-card>
            <draggable
              :list="headers"
              item-key="key"
              handle=".dt-column-handler"
              class="list-group"
              ghost-class="ghost"
              @start="dragging = true"
              @end="dragging = false"
            >
              <template #item="{ element }">
                <div
                  v-if="!element.notShowInSetting"
                  class="dt-column-list-item d-flex align-center"
                >
                  <v-checkbox
                    class="me-4"
                    hide-details
                    density="comfortable"
                    v-model="element.show"
                    :label="element.title"
                  />
                  <v-icon class="dt-column-handler ms-auto" icon="mdi mdi-drag" />
                </div>
              </template>
            </draggable>
          </v-card>
        </v-menu>
      </v-row>
    </v-row>
    <slot class="flex-grow-0" name="filterBox"></slot>
    <v-row class="mt-4 flex-grow-1" no-gutters style="overflow-x: auto; align-content: start">
      <div
        class="py-2 d-flex flex-row flex-grow-1"
        style="position: sticky; top: 0; z-index: 1; background-color: rgb(var(--v-theme-surface))"
      >
        <div
          v-for="(header, index) in headers.filter((a) => a?.show ?? true)"
          :key="index"
          :class="[
            'text-grey',
            header.headerClass,
            ,
            header.fixed ? 'pt-fixed-item' : null,
            'pt-header-item'
          ]"
          :style="`width: ${header.width}px`"
        >
          {{ header.title }}
        </div>
      </div>
      <div
        class="person-list-item d-flex flex-row align-center flex-grow-1"
        v-for="item in showingData.filter(
          (a) =>
            showingData.indexOf(a) < perPage * page &&
            showingData.indexOf(a) > perPage * (page - 1) - 1
        )"
        :key="item.id"
      >
        <div
          v-for="(field, headerIndex) in headers.filter((a) => a?.show ?? true)"
          :key="headerIndex"
          :class="[
            field.itemClass,
            'pt-field-item',
            field.fixed ? 'pt-fixed-item dashed-end-border' : null
          ]"
          :style="`width: ${field.width}px`"
        >
          <p :style="`width:${field.width}px `">
            <slot :name="`column_${field.key}`" :entity="item">
              {{ item[field.key] }}
            </slot>
          </p>
        </div>
      </div>
    </v-row>
    <v-row class="justify-center mt-4 px-2 flex-grow-0" no-gutters>
      <v-pagination
        class="flex-grow-1"
        v-model="page"
        size="x-small"
        :length="Math.ceil(showingData.length / perPage)"
        rounded="circle"
      ></v-pagination>
      <div class="d-flex align-center">
        <v-select
          :label="$t('rowsPerPage')"
          :items="[5, 10, 20, 50, 100]"
          v-model="perPage"
          variant="outlined"
          density="compact"
          hide-details
        />
        <p class="ms-14">{{ $t('totalCount') + ' ' + showingData.length }}</p>
      </div>
    </v-row>
  </div>
</template>

<script>
import utils from '../../../plugins/utils'

export default {
  data() {
    return {
      page: 1,
      perPage: 10,
      searchText: null
    }
  },
  props: {
    headers: {
      required: true
    },
    items: {
      required: true
    },
    hasSearch: {
      required: false
    },
    searchItems: {
      required: false
    }
  },
  computed: {
    showingData() {
      if (this.hasSearch)
        return this.items.filter((a) => utils.filterBySearch(this.searchText, this.searchItems, a))
      else return this.items
    }
  },
  methods: {
    onkeydown(e) {
      if (this.hasSearch && !this.$refs.tableSearchText.focused && e.key == '/' && e.ctrlKey)
        this.$refs.tableSearchText.focus()
    }
  },
  mounted() {
    this.headers.forEach((element) => {
      if (!element.hasOwnProperty('show')) element.show = true
    })
    document.addEventListener('keydown', this.onkeydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  }
}
</script>

<style>
.person-list-item {
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-block: 5px;
}

.person-list-item .pt-field-item:first-child {
  border-inline-start: none;
}

.pt-header-item {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pt-field-item {
  border-inline-start: 1px solid #e0e0e0;
  height: 100%;
  display: flex;
  align-items: center;
  margin-block: 8px;
  justify-content: center;
}

.pt-field-item p {
  overflow: hidden;
  text-overflow: ellipsis;
  text-wrap: nowrap;
  text-align: center;
}

.pt-fixed-item {
  position: sticky !important;
  left: 0;
  background-color: rgb(var(--v-theme-surface));
}

.dashed-end-border {
  border-inline-start: 1px solid #e0e0e0;
}
</style>
