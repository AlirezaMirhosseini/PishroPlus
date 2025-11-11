<template>
  <div class="tv-container pb-2" id="tvContainer">
    <template v-for="(item, index) in model" :key="index">
      <TreeviewItem
        v-model="model[index]"
        @drag-started="setDragItem"
        @drag-finished="setDragTargetItem"
        @activated="setActiveItem"
        @focusHandler="onFocusHandler"
        @blurHandler="onBlurHandler"
      >
        <template #itemPrependIcon>
          <slot name="itemPrependIcon"></slot>
        </template>
      </TreeviewItem>
    </template>
  </div>
</template>

<script src="./script.js"></script>
<style scoped>
@import url('./style.css');
</style>
