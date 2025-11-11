<template>
  <div class="d-flex flex-column align-center mb-4 status-container">
    <v-icon color="grey" :icon="icon" :size="$vuetify.display.name==='xs'?40:70" />
    <p>{{ title }}</p>
    <span class="status-number" :style="[`border:1px solid ${color}`, `color:${color}`]">{{
      amount
    }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      required: true
    },
    title: {
      required: true
    },
    color: {
      required: true
    },
    amount: {
      required: true
    }
  },
}
</script>

<style>
.status-number {
  border-radius: 50% !important;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffffff11;
  /* box-shadow: 0px 0px 7px 0px white, inset 0px 0px 2px 0px white; */
}

.status-container {
  row-gap: 15px;
  flex-basis: 150px;
}

@media only screen and (max-width: 960px) {
  .status-container {
    row-gap: 10px;
    flex-basis: 50px;
  }
}
</style>
