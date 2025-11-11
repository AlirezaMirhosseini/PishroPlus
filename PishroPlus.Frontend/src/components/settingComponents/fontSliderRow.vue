<template>
  <v-row class="d-flex align-center" no-gutters style="height: 60px">
    <v-col cols="4" sm="2">
      <p>{{ title }}</p></v-col
    >
    <v-col cols="5">
      <slot />
    </v-col>
    <v-col class="d-flex align-center" cols="3" sm="5">
      <div class="font-value">
        <slot name="font-value" />
      </div>
      <v-tooltip text="پیش نمایش" location="top">
        <template v-slot:activator="{ props }">
          <p v-bind="props" :class="['ms-4', 'font-preview', cssClass,'d-none','d-sm-flex']">ABC ابجد 123</p>
        </template>
      </v-tooltip>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    title: { required: true },
    cssClass: { required: false }
  }
}
</script>

<style>
.font-value {
  width: 70px;
}

.font-preview {
  background: #dddddd;
  border-radius: 5px;
  color: grey;
  flex-grow: 1 !important;
  height: 45px;
  display: flex !important;
  align-items: center;
  justify-content: center;
}
</style>
