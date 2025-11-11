<template>
  <v-card  color="#f5f5f5" class="ma-3 px-2 ">
    <v-breadcrumbs :items="items"></v-breadcrumbs>
  </v-card>
</template>

<script>
export default {
  name: 'BreadcrumbsComponent',
  data() {
    return {}
  },
  computed: {
    items() {
      const splittedPath = this.currentActiveTab.path.split('/')
      const lst = splittedPath
        .filter((m) => m)
        .map((x) => {
          const idx = splittedPath.findIndex((m) => m === x)
          let href = ''
          for (let i = 0; i <= idx; i++) {
            href += splittedPath[i] + '/'
          }
          return {
            text: this.$t(x.trim()),
            href,
          }
        })
      return lst
    },
  },
}
</script>