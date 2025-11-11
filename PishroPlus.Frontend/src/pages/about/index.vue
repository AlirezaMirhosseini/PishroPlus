<template>
  <loadingComp :loading="loading" />
  <v-btn @click="setLoading">loading</v-btn>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import loadingComp from '../../components/baseComponents/Loading.vue'
import { defaultStore } from '../../stores/default'
import { watch } from 'vue'
export default {
  data() {
    return {
      loading:false
    }
  },
  methods: {
    setLoading() {
      this.loading = true
    }
  },
  components: {
    loadingComp
  }
  // computed: {
  //   ...mapState(defaultStore, {
  //     test: 'loading'
  //   })
  // },
  // methods: {
  //   callApi() {
  //     axios.post('/user/login', {
  //       entity: {
  //         userName: 'test',
  //         password: 'test'
  //       }
  //     })
  //   },
  //   ...mapActions(defaultStore, { setLoading: 'setLoading' })
  // }
  //   watch:{
  //     test(value){
  //         console.log(value);
  //     }
  //   }
}
</script>

<style></style>
