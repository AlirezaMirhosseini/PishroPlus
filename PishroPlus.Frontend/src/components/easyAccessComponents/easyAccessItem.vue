<!-- <template>
  <div
 
    :class="[
      hasOrder ? `order-${item.order}` : '',
      'd-flex flex-column align-center justify-center ea-container'
    ]"
    @click.prevent="$emit('click',item)"
  >
    <div :class="['ea-icon-container', '']">
      <v-icon class="ea-icon" :icon="item.icon" :size="40" :style="item.iconStyle || ''" />
    </div>
    <p
      :class="['text-center ', $vuetify.display.smAndDown ? 'pishro-caption' : '']"
      class="ea-title"
      style="font-weight: bold"
    >
      {{ item.title }}
    </p>
    <span class=" pishro-caption text-center ea-desc">{{ item.desc }} </span>
  </div>
</template> -->

<template>
  <div
    :tabindex="0"
    :class="[
      hasOrder ? `order-${item.order}` : '',
      'd-flex flex-column align-center justify-center ea-container'
    ]"
    @click.prevent="$emit('click', item)"
    :id="`ea-${index}`"
    @keypress="handleKeyPress"
  >
    <v-btn
      v-if="showRemove"
      icon="mdi-close"
      size="small"
      variant="text"
      class="remove-btn"
      @click.stop="$emit('remove', item)"
      :tabindex="-1"
    >
      <v-icon size="15">mdi-close</v-icon>
    </v-btn>
    <div class="ea-icon-container">
      <v-icon class="ea-icon" :icon="menuItem?.icon" :size="32" />
      <!-- <v-icon 
        v-else
        class="ea-icon" 
        :size="32"
      >
        mdi-folder
      </v-icon> -->
    </div>
    <p class="text-center ea-title">
      {{ item.title }}
    </p>
  </div>
</template>

<script>
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../stores/default'

export default {
  emits: ['click', 'remove'],
  props: {
    item: {
      required: true
    },
    index: {
      required: true
    },
    hasOrder: {
      required: false,
      default: false
    },
    showRemove: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      findMenuItemByTitle: 'findMenuItemByTitle'
    }),
    handleKeyPress(e) {
      if (e.code == 'Enter' || e.code == 'Space') {
        this.$emit('click', this.item)
      }
    }
  },
  computed: {
    menuItem() {
      return this.findMenuItemByTitle(this.item.title)
    }
  }
}
</script>

<style>
.ea-container {
  position: relative;
  row-gap: 8px;
  width: 120px;
  height: 100px;
  border-radius: 8px;
  margin: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px;
  background: white;
}

.remove-btn {
  position: absolute !important;
  top: -3px !important;
  left: -3px !important;
  z-index: 1;
  background-color: rgb(156, 171, 177) !important;
  border-radius: 50% !important;
  width: 20px !important;
  height: 20px !important;
  min-width: 16px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  color: rgb(var(--v-theme-on-surface)) !important;
}

.remove-btn:hover {
  background-color: rgba(var(--v-theme-error), 0.9) !important;
  color: rgb(var(--v-theme-on-error)) !important;
}

.ea-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  padding: 8px;
  transition: all 0.3s ease;
}

.ea-icon {
  color: rgb(var(--v-theme-primary));
  transition: color 0.3s ease;
}

.ea-title {
  color: rgb(var(--v-theme-primary));
  font-size: 9pt;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  transition: color 0.3s ease;
}

.ea-container:hover,
.ea-container:focus {
  background-color: rgb(var(--v-theme-primary));
  outline: none;
}

.ea-container:hover .ea-icon,
.ea-container:focus .ea-icon,
.ea-container:hover .ea-title,
.ea-container:focus .ea-title {
  color: white;
}

.v-theme--dark .ea-icon,
.v-theme--dark .ea-title {
  color: #2b5278;
}

.v-theme--dark .ea-container:hover .ea-icon,
.v-theme--dark .ea-container:focus .ea-icon,
.v-theme--dark .ea-container:hover .ea-title,
.v-theme--dark .ea-container:focus .ea-title {
  color: white;
}

@media only screen and (max-width: 960px) {
  .ea-container {
    width: 100px;
    height: 100px;
    margin: 4px;
  }

  .ea-icon-container {
    padding: 6px;
  }

  .ea-title {
    font-size: 8pt;
  }
}
</style>
