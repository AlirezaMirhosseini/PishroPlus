<template>
  <div class="event-card pishro-border">
    <div class="d-flex justify-space-between">
      <p style="font-weight: bold; font-size: 13px">{{ title }}</p>
      <p class="text-grey" style="font-size: 10px">{{ date }}</p>
    </div>
    <p class="event-description pishro-caption">
      {{ description }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      required: true,
      default: () => ''
    },
    date: {
      required: true,
      default: () => ''
    },
    description: {
      required: false,
      default: 'توضیحاتی ثبت نشده است.'
    }
  }
}
</script>

<style>
.event-card {
  padding: 5px;
  padding-block: 7px;
  height: 100%;
}

.event-description {
  margin-top: 6px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}
</style>
