<template>
  <v-row no-gutters class="pishro-border justify-space-between align-center pa-1 my-2">
    <v-col cols="9" class="d-flex align-center">
      <v-avatar color="primary" variant="tonal" :icon="icon"></v-avatar>
      <div class="ms-2" style="max-width: calc(100% - 45px)">
        <p style="font-weight: bold; font-size: 13px">{{ title }}</p>
        <p class="event-description pishro-caption">{{ description }}</p>
      </div>
    </v-col>
    <v-col class="d-flex align-center justify-end" cols="3">
      <p class="text-grey pishro-caption">{{ date }}</p>
      <v-btn
        :to="to"
        target="_blank"
        class="end-chevron"
        color="grey"
        variant="text"
        icon="mdi mdi-chevron-left"
      ></v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: {
    icon: {
      required: true
    },
    to: {
      required: false
    },
    title: {
      required: true
    },
    description: {
      required: false,
      default: 'توضیحاتی ثبت نشده است.'
    },
    date: {
      required: true
    }
  }
}
</script>

<style scoped>
.event-description {
  margin-top: 4px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
