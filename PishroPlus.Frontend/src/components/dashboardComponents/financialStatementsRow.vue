<template>
  <v-row class="text-grey my-2" no-gutters>
    <v-col class="d-flex align-center" cols="6">
      <v-icon class="me-2" :icon="icon"/>
      <p class="financial-statements-row">{{ title }}</p>
    </v-col>
    <v-col class="text-end" cols="6">
      <p class="financial-statements-row">{{ value }}</p>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    title: {
      required: true
    },
    icon: {
      required: false
    },    
    value: {
      required: true
    }
  }
}
</script>

<style>
.financial-statements-row{
font-size: 10px !important;
}
</style>
