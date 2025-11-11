<template>
  <div class="pishro-border d-flex justify-space-between align-center pa-1 my-2">
    <div class="d-flex align-center">
      <v-avatar :image="image"></v-avatar>
      <p class="ms-2">{{ title }}</p>
    </div>
    <p class="text-grey">{{amount}}</p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true
    },
    image: {
      required: true
    },
    amount: {
      required: true
    }
  }
}
</script>
