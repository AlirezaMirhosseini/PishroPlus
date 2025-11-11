<template>
  <v-row class="w-100 flex-column" no-gutters>
    <v-row
      class="justify-space-between my-4 transfer-stepper-container align-self-center px-4"
      no-gutters
    >
      <v-progress-linear class="transfer-stepper-progress" color="info" v-model="progress" />
      <div
        v-for="(item, index) in items"
        :key="item.id"
        :class="[
          'd-flex flex-column align-center',
          item.disabled ? 'transfer-stepper-disabled' : ''
        ]"
      >
        <div
          class="transfer-stepper-icon-container"
          :style="index > tab ? '' : 'border: 2px solid rgb(var(--v-theme-info))'"
        >
          <v-btn
            @click="setTab(index)"
            class="transfer-stepper-icon"
            :icon="item.icon"
            :variant="index > tab ? 'tonal' : 'flat'"
            color="info"
            :size="$vuetify.display.smAndDown ? 40 : 60"
          >
          </v-btn>
        </div>
        <p class="text-info mt-2" :style="tab == index ? 'font-weight: bold' : ''">
          {{ item.title }}
        </p>
        <p class="mt-2">
          {{ item.desc }}
        </p>
      </div>
    </v-row>
    <v-window class="w-100" v-model="tab" :touch="false">
      <template v-for="(item, index) in items" :key="item.id">
        <v-window-item class="pa-4" :value="index">
          <slot :name="`content_${item.id}`" />
        </v-window-item>
      </template>
    </v-window>
    <v-row class="ma-4" no-gutters>
      <v-btn
        v-if="tab > 0 && !previousTab?.disabled"
        prepend-icon="mdi mdi-chevron-right"
        class="me-auto"
        color="info"
        variant="tonal"
        height="60"
        @click="goToPreviousTab"
      >
        <div class="d-flex flex-column">
          <strong class="text-start">قبلی</strong>
          <p class="mt-2 text-start">{{ items.find((a, index) => index == tab - 1).title }}</p>
        </div>
      </v-btn>
      <v-btn
        v-if="tab < items.length - 1"
        append-icon="mdi mdi-chevron-left"
        class="ms-auto"
        color="info"
        height="60"
        @click="
          items.find((a, index) => index == tab).customNext
            ? items.find((a, index) => index == tab).customNext()
            : goToNextTab()
        "
      >
        <div class="d-flex flex-column">
          <strong class="text-start">بعدی</strong>
          <p class="mt-2 text-start">{{ items.find((a, index) => index == tab + 1).title }}</p>
        </div>
      </v-btn>
      <v-btn
        v-if="tab == items.length - 1"
        color="info"
        prepend-icon="mdi mdi-check"
        @click="$emit('save')"
        class="ms-auto"
        >{{ $t('confirmAndSave') }}</v-btn
      >
    </v-row>
  </v-row>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'

export default {
  props: {
    items: {
      required: true
    }
  },
  data() {
    return {
      tab: 0
    }
  },
  emits: ['save'],
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    async setTab(index) {
      if (this.items[index].disabled) {
        return
      }
      let valid = await this.items[this.tab].isValid()
      if (valid === true || index < this.tab) {
        this.tab = index
        if (this.items[index].setTab) this.items[index].setTab()
      } else this.setErrorMessage(await this.items[this.tab].isValid())
    },
    goToPreviousTab() {
      let prev = this.tab - 1
      if (this.items[prev].setTab) this.items[prev].setTab()
      this.tab = prev
    },
    async goToNextTab() {
      let valid = await this.items[this.tab].isValid()
      if (valid === true) {
        let next = this.tab + 1
        this.tab = next
        if (this.items[next].setTab) this.items[next].setTab()
      } else this.setErrorMessage(await this.items[this.tab].isValid())
    },
    onkeydown(e) {
      if (e.key == 'Enter' && this.items.find((a, index) => this.tab == index).enterForNextTab)
        this.items.find((a, index) => index == this.tab).customNext
          ? this.items.find((a, index) => index == this.tab).customNext()
          : goToNextTab()
    }
  },
  computed: {
    progress() {
      return (this.tab / (this.items.length - 1)) * 100
    },
    iconSizeMultiplier() {
      let output = this.$vuetify.display.smAndDown ? '1.4' : '2'
      return output
    },
    previousTab() {
      let tb = this.items.find((a, index) => index == this.tab - 1)
      return tb
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onkeydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  }
}
</script>

<style>
.transfer-stepper-icon-container {
  background-color: rgb(var(--v-theme-surface));
  border: 2px solid rgb(var(--v-theme-info), 20%);
  border-radius: 50%;
  padding: 2px;
}

.transfer-stepper-icon .v-icon {
  --v-icon-size-multiplier: v-bind(iconSizeMultiplier) !important;
}

.transfer-stepper-progress {
  position: absolute;
  top: 36px !important;
  bottom: 50% !important;
  left: 0 !important;
  right: 0 !important;
  transform: none !important;
  margin-left: 78px;
  margin-right: 84px;
  
}

.transfer-stepper-container {
  width: 90%;
  max-width: 800px;
}

.transfer-stepper-disabled {
  pointer-events: none;
  opacity: 0.4;
}

@media only screen and (max-width: 960px) {
  .transfer-stepper-progress {
    top: 24px !important;
  }
}
</style>
