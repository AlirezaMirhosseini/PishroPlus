<template>
  <div
    tabindex="0"
    ref="dataTable"
    @keydown="handleKeyPress"
    class="datatable data-table-custom"
    id="dataTable"
    :data-order="dialogOrder"
  >
    <v-row
      class="my-2 mb-6 justify-center align-center"
      v-if="bigSearch"
      no-gutters
      style="row-gap: 8px"
    >
      <v-col cols="12" md="3">
        <slot name="bigSearchToolbar"></slot>
      </v-col>
      <v-col cols="12" md="6">
        <v-text-field
          v-if="hasSearch"
          autofocus
          @keydown="handleKeyPress"
          ref="tableSearchText"
          variant="outlined"
          hide-details
          v-model="_searchText"
          append-inner-icon="mdi mdi-magnify"
          :placeholder="searchLabel ? searchLabel : $t('search') + ' (' + $t('ctrlSlash') + ')'"
          style="width: 100%"
      /></v-col>
      <v-col cols="12" md="3"></v-col>
    </v-row>
    <v-row v-else class="my-2" no-gutters>
      <v-text-field
        v-if="hasSearch"
        class="dt-searchbox"
        ref="tableSearchText"
        variant="outlined"
        hide-details
        v-model="_searchText"
        density="compact"
        prepend-inner-icon="mdi mdi-magnify"
        :placeholder="searchLabel ? searchLabel : $t('search') + ' (' + $t('ctrlSlash') + ')'"
      />
      <v-row class="align-center justify-end" no-gutters>
        <slot name="toolbar"></slot>
        <v-menu :close-on-content-click="false" location="bottom end">
          <template v-slot:activator="{ props }">
            <v-btn
              v-if="showSettingIcon"
              tabindex="-1"
              v-bind="props"
              class="ms-2"
              color="grey"
              icon="mdi mdi-table-cog"
              variant="tonal"
              size="x-small"
            >
            </v-btn>
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
    <slot name="filterBox"></slot>
    <div class="table-container" :style="maxHeight ? `max-height:${maxHeight}` : ''">
      <table>
        <!-- caption row -->
        <thead>
          <tr>
            <th class="select-column" v-if="selectableRow"></th>
            <template v-for="(item, index) in headers.filter((a) => a?.show ?? true)" :key="index">
              <th
                :class="[
                  item.sortable ? 'sortable' : '',
                  item.sort,
                  item?.align ? `text-${item.align}` : 'text-start',
                  item?.class,
                  item.fixed ? 'dt-fixed-item dt-fixed-header' : null
                ]"
                v-if="!item?.notShowInSmAndDown || !$vuetify.display.smAndDown"
                :style="`width:${item.width};min-width:${item.width}`"
                @click="sort(item)"
              >
                <slot :name="`header_${item.key}`" :header="item">
                  {{ item.title }}
                </slot>
              </th>
            </template>
          </tr>
        </thead>
        <!-- items part -->
        <tbody id="table-body">
          <tr
            :id="index"
            v-for="(item, index) in _items"
            :key="`entity.${index}`"
            :class="[
              'row',
              clickableRow ? 'clickable-row' : '',
              selectedItem &&
              Object.keys(selectedItem).length > 0 &&
              selectedItem[itemValue] === _items[index][itemValue]
                ? 'selected-row'
                : ''
            ]"
            @contextmenu="onContextMenu($event, _items[index])"
          >
            <td
              :class="['select-column']"
              v-if="selectableRow"
              :style="`background-color:${item.statusColor ? item.statusColor : 'inherit'};`"
            >
              <v-icon
                v-if="selectedItem && selectedItem[itemValue] === _items[index][itemValue]"
                icon="mdi mdi-menu-left"
                tabindex="-1"
                :color="item.statusColor ? 'white' : 'grey'"
                size="20"
                style="width: 10px"
              />
            </td>
            <template
              v-for="(header, idx) in headers.filter((a) => a?.show ?? true)"
              :key="`column.${idx}`"
            >
              <td
                :class="[
                  header?.align ? `text-${header.align}` : 'text-start',
                  header?.class,
                  header.fixed ? 'dt-fixed-item' : null
                ]"
                v-if="!header?.notShowInSmAndDown || !$vuetify.display.smAndDown"
                @click="header.clickable !== false && rowClick(_items[index])"
                @dblclick="header.clickable !== false && rowDblClick(_items[index])"
                :colspan="item?.colspan || 1"
              >
                <slot :name="`column_${header.key}`" :entity="item" :index="index">
                  {{ item[header.key] }}
                </slot>
              </td>
            </template>
          </tr>
          <tr v-if="_items?.length < 1">
            <td
              :colspan="selectableRow ? headers.length + 1 : headers.length"
              style="text-align: center"
            >
              {{ $t(noResultText) }}
            </td>
          </tr>
          <slot name="fixed_row"> </slot>
        </tbody>
      </table>
      <slot name="footerToolbar"></slot>
    </div>
    <!-- pagiantion -->
    <div class="pagination" v-if="showPagination">
      <div class="select-row-per-page">
        <span>{{ $t(pagination.rowPerPageText) + ':' }}</span>
        <select
          v-model="_pagination.rowsPerPage"
          name="rows per page"
          id="rows-per-page"
          @change="updatePageSize"
        >
          <option
            class="bg-surface"
            v-for="item in _pagination.rowsPerPageItems?.filter((size) =>
              isServerSide ? size != 'all' : true
            )"
            :key="item"
            :value="item"
          >
            {{
              item === 'all' ? $t(item) + `(${isServerSide ? totalCount : allItemsCount})` : item
            }}
          </option>
        </select>
      </div>
      <div class="select-page">
        <button @click="firstPage" :disabled="!hasPrevPage">«</button>
        <button @click="prevPage" :disabled="!hasPrevPage">&#8249;</button>
        <span class="page">{{ _pagination.page }}</span>
        <button @click="nextPage" :disabled="!hasNextPage">&#8250;</button>
        <button @click="lastPage" :disabled="!hasNextPage">&#187;</button>
        <span style="margin-inline: 8px">{{ $t(pagination.ofText) }}</span>
        <span>{{ pageCounts }}</span>
      </div>
      <span class="ms-auto">{{
        $t('totalCount') + `: ${isServerSide ? totalCount : allItemsCount}`
      }}</span>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style>
@import url('./style.css');
</style>
