<template>
  <v-autocomplete
    v-model="searchValue"
    :class="searchClass"
    :placeholder="$t('search')"
    prepend-inner-icon="mdi-magnify"
    :variant="variant"
    :flat="true"
    density="compact"
    style="min-width: 300px"
    hide-details
    clearable
    :items="routes"
    item-title="newName"
    no-data-text="صفحه ای یافت نشد"
    @update:modelValue="search"
  />
</template>

<script>
export default {
  props: {
    searchClass: {
      required: false,
      default: ''
    },
    variant: {
      required: false,
      default: 'solo'
    }
  },
  data() {
    return {
      routes: [],
      searchValue: null
    }
  },
  methods: {
    search(value) {
      if (value != null) {
        var item = this.routes.filter((a) => a.newName == value)[0]
        this.$router.push(item.path)
        setTimeout(() => {
          this.searchValue = null
        }, 100)
      }
    }
  },
  mounted() {
    this.routes = this.$router.getRoutes().filter((z) => !z.meta.notShow)
    this.routes.forEach((x) => {
      x.newName = this.$t(x.name)
    })
  }
}
</script>

<style></style>
