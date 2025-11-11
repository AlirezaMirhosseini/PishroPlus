<template>
    <div :class="$attrs.class">
      <div :class="['tv-item',
       modelValue.active ? 'tv-item-active' : '']" :draggable="modelValue.draggable"
        @dragstart="onDragStart(modelValue)"
         @drop.prevent="onDragFinished(modelValue)" 
         @dragenter.prevent @dragover.prevent
        :style="`cursor: ${modelValue.draggable ? 'move' : ''};`" 
        @click="setActiveItem(modelValue)"
        @contextmenu="onContextMenu($event)" 
        @dblclick="modelValue.dblClick" :tabindex="0" @focus="onFocusHandler"
        @blur="onBlurHandler"
         style="border-bottom: 1px solid lightgray;">
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
        <span :class="modelValue.active ? 'text-primary' : 'text-grey'" style="margin-inline-start: 2px">{{ modelValue.title}}</span>
      <div class="price">
        <v-icon class="me-2" size="20" color="info" icon="mdi-chevron-down"/>
      <p >1.000.000.000</p>
      </div>
      </div>
      <div class="child-box" v-show="modelValue.children?.length > 0 && modelValue.open">
        <TreeviewItem v-for="(it, idx) in modelValue.children" :key="idx" v-model="modelValue.children[idx] " 
          class="child-item" @drag-finished="onDragFinished" @drag-started="onDragStart" @activated="setActiveItem"
          :tabindex="0" @focusHandler="onFocusHandler" @blurHandler="onBlurHandler">
          <v-checkbox :indeterminate="indeterminate" color="primary" v-if="modelValue.hasCheckBox"
            :model-value="modelValue.children[idx].checked"
            @update:modelValue="($event) => update($event, modelValue.children[idx])" class="flex-grow-0" density="compact"
            hide-details />
          <!-- <template #itemPrependIcon
            ><slot name="itemPrependIcon" :item="modelValue.children[idx]"></slot
          ></template> -->
          <v-icon v-if="modelValue.icon" :icon="modelValue.openedIcon
              ? modelValue.open
                ? modelValue.openedIcon
                : modelValue.icon
              : modelValue.icon
            " color="grey" style="align-self: baseline" />
        </TreeviewItem>
      </div>
    </div>
    
  </template>
  
  <script>
  export default {
  name: 'TreeviewItem',
  data() {
    return {
      indeterminate: false
    }
  },
  props: {
    modelValue: {
      default: () => {
        return {
          title: '',
          id: '',
          open: true,
          draggable: true,
          notClickable: false,
          parent: {}
        }
      }
    }
  },
  watch: {
    modelValue: {
      handler(value, oldValue) {
        if (value.children?.length > 0)
          if (value.children.every((z) => z.checked)) {
            value.checked = true
            this.indeterminate = false
          } else if (value.children.some((a) => a.checked)) {
            value.checked = false
            this.indeterminate = true
          } else {
            value.checked = false
            this.indeterminate = false
          }
      },
      deep: true
    }
  },
  methods: {
    onContextMenu(e) {
      if (this.modelValue?.contexts) {
        e.preventDefault()
        this.$contextmenu({
          items: this.modelValue.contexts,
          theme: this.$vuetify.theme.global.name == 'light' ? 'win10' : 'win10 dark',
          iconFontClass: 'iconfont',
          zIndex: 3,
          minWidth: 230,
          x: e.x,
          y: e.y
        })
      }
    },
    checkChildren(value, item) {
      if (item.children?.length > 0)
        item.children.forEach((element) => {
          element.checked = value
          if (element.children?.length > 0) this.checkChildren(value, element)
        })
    },
    update(value, item) {
      item.checked = value
      this.checkChildren(value, item)
    },
    onDragStart(item, parent) {
      this.$emit('dragStarted', item)
    },
    onDragFinished(item) {
      this.$emit('dragFinished', item)
    },
    setActiveItem(item) {
      if (!item.notClickable) this.$emit('activated', item)
    },
    onFocusHandler(event) {
      this.$emit('focusHandler', event)
    },
    onBlurHandler(event) {
      this.$emit('blurHandler', event)
    }
  },
  mounted() {
    if (this.modelValue.children?.length > 0)
      if (this.modelValue.children.every((z) => z.checked)) {
        this.modelValue.checked = true
        this.indeterminate = false
      } else if (this.modelValue.children.some((a) => a.checked)) {
        this.modelValue.checked = false
        this.indeterminate = true
      } else {
        this.modelValue.checked = false
        this.indeterminate = false
      }
  }
}

</script>
  <!-- ./script.js -->
  <style>
  @import url('../../../components/baseComponents/Treeview/style.css');
  
  .price {
    display: flex ;
    position: absolute;
    left: 2px;
  }
  </style>
  