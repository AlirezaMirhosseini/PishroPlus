<script setup>
import Treeview from '@/components/baseComponents/Treeview/Treeview.vue'
import Datatable from '@/components/baseComponents/datatable/datatable.vue'
import { reactive, ref, watch } from 'vue'
import Loading from '@/components/baseComponents/loading.vue'

const datatableModel = ref([])
let loading = ref(false)
const treeviewModel = ref([
  {
    id: 1,
    title: 'test',
    open: true,
    draggable: true,
    children: [
      {
        id: 2,
        title: 'test2',
        draggable: true,
        children: [
          { id: 6, title: 'test6', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          {
            id: 7,
            title: 'test7',
            draggable: true,
            desc: 'hi',
            children: [
              { id: 4, title: 'test4' },
              { id: 5, title: 'test5' }
            ]
          },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', desc: 'hi', draggable: true },
          { id: 7, title: 'test7', draggable: true }
        ]
      },
      {
        id: 3,
        title: 'test3',
        draggable: true,
        children: [
          { id: 4, title: 'test4', draggable: true, children: [] },
          {
            id: 5,
            title: 'test5',
            children: [
              { id: 4, title: 'test4', draggable: true },
              { id: 5, title: 'test5' }
            ]
          }
        ]
      }
    ]
  }
]).value

// watch(datatableModel, (val) => {
//   console.log(val)
// })
const datatableHeader = [
  {
    title: 'عنوان',
    align: 'start',
    sortable: true,
    key: 'title'
  },
  {
    title: 'توضیحات',
    align: 'start',
    sortable: true,
    key: 'desc'
  }
]

const changeActiveAccount = (item) => {
  datatableModel.value = item.children || []
}
</script>

<template>
  <loading :loading="loading"/>
  <div class="d-flex">
    <div class="flex-grow-1">
      <Treeview
        v-model="treeviewModel"
        titleKey="name"
        title="حساب"
        @activeChanged="changeActiveAccount"
      >
        <template #itemPrependIcon
          ><v-icon color="primary" size="small">mdi-folder-outline</v-icon></template
        >
      </Treeview>
    </div>
    <div class="flex-grow-1">
      <Datatable :headers="datatableHeader" :items="datatableModel"></Datatable>
    </div>
  </div>
  <v-btn @click="loading=!loading">loading</v-btn>
</template>

<style scoped></style>
