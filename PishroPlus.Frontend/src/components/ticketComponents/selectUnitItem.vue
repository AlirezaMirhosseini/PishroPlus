<template>
  <div class="d-flex flex-column align-center mb-4 unit-container">
    <v-item :value="value" v-slot="{ isSelected, selectedClass, toggle }">
      <div @click="toggle" :class="['unit-icon-container', selectedClass]">
        <v-icon :icon="icon" :size="$vuetify.display.name==='xs'?20:40" :color="isSelected ? 'surface' : 'grey'" />
      </div>
    </v-item>
    <p class="text-center">{{ title }}</p>
    <span class="text-grey pishro-caption text-center">{{ description }}</span>
  </div>
</template>

<script>
export default {
  props: {
    icon: {
      required: true
    },
    value: {
      required: true
    },
    title: {
      required: true
    },
    description: {
      required: true
    }
  }
}
</script>

<style>
.unit-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 15px;
  background-color: rgb(var(--v-theme-container));
  cursor: pointer;
}

.unit-container {
  row-gap: 15px;
  flex-basis: 150px;
}

@media only screen and (max-width: 960px) {
  .unit-container {
    row-gap: 10px;
    flex-basis: 50px;
  }
}
</style>
