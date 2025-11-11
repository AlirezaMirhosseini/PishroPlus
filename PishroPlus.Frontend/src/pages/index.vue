<template>
  <v-row>
    <v-col cols="12" md="6">
      <tree-view v-model="treeViewItems" @activeChanged="changeActiveAccount">
        <template #itemPrependIcon
          ><v-icon icon="mdi-folder-outline" color="primary" size="small"
        /></template> </tree-view
    ></v-col>
    <v-col cols="12" md="6">
      <datatable :headers="datatableHeader" :items="datatableModel" />
    </v-col>
  </v-row>
</template>
<script>
import Datatable from '../components/baseComponents/datatable/datatable.vue'
import TreeView from '../components/baseComponents/Treeview/Treeview.vue'
import moduleService from '../../api/module/moduleService.js'
import permissionService from '../../api/permission/permissionService.js'
export default {
  components: {
    Datatable,
    TreeView
  },
  methods: {
    changeActiveAccount(item) {
      this.datatableModel = item.children || []
    },
    test(){
      var test2 = permissionService.getAll(10,10)
      var test3 = test2.entities[0].id
    }
  },
  data() {
    return {
      datatableModel: [],
      treeViewItems: [
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
                { id: 6, title: 'test6', desc: 'a', draggable: true },
                { id: 7, title: 'test8', desc: 'b', draggable: true },
                { id: 8, title: 'test12', desc: 'c', draggable: true },
                { id: 9, title: 'test9', desc: 'd', draggable: true },
                { id: 14, title: 'test13', desc: 'h', draggable: true },
                { id: 10, title: 'test15', desc: 'e', draggable: true },
                { id: 11, title: 'test10', desc: 'f', draggable: true },
                { id: 12, title: 'test11', desc: 'g', draggable: true },
                { id: 13, title: 'test16', desc: 'i', draggable: true },
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
      ],
      datatableHeader: [
        {
          title: 'عنوان',
          align: 'start',
          sortable: true,
          sort: '',
          key: 'title'
        },
        {
          title: 'توضیحات',
          align: 'start',
          sortable: true,
          sort: '',
          key: 'desc'
        }
      ],
      itemsPerPage: 5
    }
  },
}
</script>
