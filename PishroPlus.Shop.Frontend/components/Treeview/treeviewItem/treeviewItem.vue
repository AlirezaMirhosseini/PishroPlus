<template>
  <div :class="$attrs.class">
    <div :class="['tv-item',
      modelValue.active ? 'tv-item-active' : '']" :draggable="modelValue.draggable"
      @dragstart="onDragStart(modelValue)" @drop.prevent="onDragFinished(modelValue)" @dragenter.prevent @dragover.prevent
      :style="`cursor: ${modelValue.draggable ? 'move' : ''};`" @click="setActiveItem(modelValue)"
      @contextmenu="onContextMenu($event)" @dblclick="modelValue.dblClick" :tabindex="0" @focus="onFocusHandler"
      @blur="onBlurHandler">
      <i @click="modelValue.open = !modelValue.open" v-if="modelValue.children?.length > 0" class="tv-item-expand-icon">{{
        modelValue.open ? '-' : '+' }}</i>
      <v-checkbox :indeterminate="indeterminate" color="primary" v-if="modelValue.hasCheckBox"
        :model-value="modelValue.checked" @update:modelValue="($event) => update($event, modelValue)" class="flex-grow-0"
        density="compact" hide-details />
      <v-icon v-if="modelValue.icon" :icon="modelValue.openedIcon
        ? modelValue.open
          ? modelValue.openedIcon
          : modelValue.icon
        : modelValue.icon
        " color="grey" style="align-self: baseline" />

      <!-- <slot name="itemPrependIcon" :item="modelValue"></slot> -->
      <span   :class="modelValue.active ? 'text-primary' : 'text-grey'">{{
        modelValue.title }}</span>
    </div>

    <div class="child-box" v-show="modelValue.children?.length > 0 && modelValue.open" >
      <TreeviewItem v-for="(it, idx) in modelValue.children" :key="idx" v-model="modelValue.children[idx]"
        class="child-item" @drag-finished="onDragFinished" @drag-started="onDragStart" @activated="setActiveItem"
        :tabindex="0" @focusHandler="onFocusHandler" @blurHandler="onBlurHandler" >
        <v-checkbox :indeterminate="indeterminate" color="primary" v-if="modelValue.hasCheckBox"
          :model-value="modelValue.children[idx].checked"
          @update:modelValue="($event) => update($event, modelValue.children[idx])" class="flex-grow-0" density="compact"
          hide-details />
        <template #itemPrependIcon >
          <slot name="itemPrependIcon" :item="modelValue.children[idx]"></slot>
        </template>

        <v-icon v-if="modelValue.icon"
          :icon="modelValue.openedIcon ? modelValue.open ? modelValue.openedIcon : modelValue.icon : modelValue.icon"
          color="grey" style="align-self: baseline" />
        <!-- <v-tooltip :text="modelValue.children[idx].text">
        <div class="text-grey" v-tooltip="modelValue.children[idx].text" v-if="modelValue.children[idx].text">
          {{ truncatedText(modelValue.children[idx].text) }}
        </div>
      </v-tooltip> -->
        <!-- <v-tooltip :text="modelValue.children[idx].text" v-if="modelValue.children[idx].text">
          <template #activator="{ on }">
            <div class="text-grey" v-bind="on" :title="modelValue.children[idx].text" style="cursor: pointer;">
              {{ truncatedText(modelValue.children[idx].text) }}
            </div>
          </template>
        </v-tooltip> -->
      </TreeviewItem>
    </div>
  </div>
</template>

<script src="./script.js"></script>
<style scoped >
@import url('./style.css');
</style>
<!-- <script src="../../../components/baseComponents/Treeview/script"> -->
<!-- </script> -->
  <!-- ./script.js -->
  <!-- <style> -->
  <!-- /* @import url('../../../components/baseComponents/Treeview/style.css'); */ -->
