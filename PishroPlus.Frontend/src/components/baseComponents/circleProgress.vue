<template>
  <div :class="'circle-container ' + circleClass">
    <svg viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="54" fill="none" stroke="#e6e6e6" stroke-width="8" />
      <circle
        class="percent"
        cx="60"
        cy="60"
        r="54"
        fill="none"
        :stroke="color"
        stroke-width="8"
        pathLength="100"
        :style="`stroke-dashoffset:${100 - percent}`"
      ></circle>
    </svg>
    <v-icon :color="color" size="x-large" class="icon" :icon="icon" />
  </div>
</template>

<script>
export default {
  props: {
    percent: {
      required: false,
      default: () => 100
    },
    color: {
      required: false,
      default: () => '#f77a52'
    },
    icon: {
      required: false,
      default: () => ''
    },
    circleClass: {
      required: false,
      default: () => ''
    }
  }
}
</script>

<style scoped>
.circle-container {
  position: relative;
  height: 60px;
  width: 60px;
}

.icon {
  position: absolute;
  top: 50%;
  right: 50%;
  transform: translate(50%, -50%);
  font-size: 30px;
}

.percent {
  stroke-dasharray: 100;
}

@media only screen and (max-width: 600px) {
  .circle-container {
    width: 40px;
    height: 40px;
  }
}
</style>
