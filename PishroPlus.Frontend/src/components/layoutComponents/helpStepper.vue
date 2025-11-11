<template>
  <div class="help-stepper">
    <div class="help-content text-center text-white">
      <v-window :touch="false" v-if="items?.length > 0" v-model="tab" style="height: 100%" reverse>
        <v-window-item
          v-for="item in items.sort((a, b) => a.order - b.order)"
          :key="item.order"
          :value="item.order"
          style="height: 100%"
        >
          <p style="font-size: 30px">{{ item.title }}</p>
          <div class="my-10 px-md-12 d-flex align-center help-content-inner">
            <div class="ql-editor" v-html="item.content"></div>
          </div>
        </v-window-item>
      </v-window>
      <div v-else>راهنمایی برای این صفحه یافت نشد!</div>
    </div>
    <div class="help-actions">
      <transition name="action" mode="out-in">
        <v-btn
          @click="tab++"
          class="rounded-xl help-action-button"
          variant="flat"
          prepend-icon="mdi mdi-chevron-right"
          color="white"
          v-if="items?.length > 0 && tab != items?.length"
          >بعدی</v-btn
        >
      </transition>
      <transition name="action" mode="out-in">
        <v-btn
          @click="tab--"
          class="rounded-xl ms-auto help-action-button"
          variant="flat"
          append-icon="mdi mdi-chevron-left"
          color="white"
          v-if="tab != 1"
          >قبلی</v-btn
        >
      </transition>
    </div>
    <div class="help-steps-container">
      <v-btn
        v-for="item in items"
        :key="item.order"
        variant="text"
        size="x-small"
        icon="mdi mdi-circle"
        @click="tab = item.order"
        :color="tab == item.order ? 'white' : '#71717133'"
      />
    </div>
  </div>
</template>

<script>
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default {
  data() {
    return {
      tab: 1
    }
  },
  props: {
    items: {
      required: true
    }
  }
}
</script>

<style>
.help-stepper {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  flex-grow: 1;
  direction: rtl;
}

.help-content {
  flex-grow: 1;
  max-height: calc(100% - 108px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.help-content-inner {
  max-height: calc(100% - 112px);
  height: calc(100% - 112px);
  overflow: auto;
  text-align: justify;
}

.help-actions {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  padding-inline: 40px;
}

.help-steps-container {
  display: flex;
  justify-content: center;
  padding-block: 10px;
  flex-direction: row-reverse;
}

.action-enter-active {
  animation: action 0.3s ease-out;
}

.action-leave-active {
  animation: action 0.3s ease-in reverse;
}

.action-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.action-leave-to {
  opacity: 1;
  transform: translateX(0px);
}

@keyframes action {
  from {
    opacity: 0;
    transform: translateX(10px);
  }

  to {
    opacity: 1;
    transform: translateX(0px);
  }
}
</style>
