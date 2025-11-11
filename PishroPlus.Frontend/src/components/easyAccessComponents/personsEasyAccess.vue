<template>
  <nav-tab
    :items="[$t('definitions')]"
    v-model:activeTab="activeTab"
    storeName="personsTab"
  ></nav-tab>
  <div class="bg-surface flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center tab-container">
    <transition name="easyaccess" mode="out-in">
      <v-row
        v-if="activeTab == 0"
        justify="center"
        no-gutters
        dense
        style="align-content: baseline"
      >
        <easy-access-item v-for="(item, index) in definitionItems" :key="index" :item="item" />
      </v-row>
    </transition><template>
  <nav-tab
    :items="[$t('definitions')]"
    v-model:activeTab="activeTab"
    storeName="personsTab"
  ></nav-tab>
  <div class="bg-surface flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center tab-container">
    <transition name="easyaccess" mode="out-in">
      <v-row
        v-if="activeTab == 0"
        justify="center"
        no-gutters
        dense
        style="align-content: baseline"
      >
        <easy-access-item v-for="(item, index) in definitionItems" :key="index" :item="item" />
      </v-row>
    </transition>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import navTab from '../../components/baseComponents/navTab.vue'
import easyAccessItem from '../../components/dashboardComponents/easyAccessItem.vue'
import personsIcon from '../../components/icons/Persons.vue'
import addPersonIcon from '../../components/icons/AddPerson.vue'
import personsCategoryIcon from '../../components/icons/PersonCategory.vue'

export default {
  data() {
    return {
      activeTab: localStorage?.getItem('personsTab') ?? 0,
      definitionItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('addPerson'),
          desc: this.$t('addPerson'),
          icon: markRaw(addPersonIcon),
          url: '/persons/new'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('personsList'),
          desc: this.$t('personsList'),
          icon: markRaw(personsIcon),
          url: '/persons/list'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('personsCategory'),
          desc: this.$t('personsCategory'),
          icon: markRaw(personsCategoryIcon),
          url: '/persons/category'
        }
      ]
    }
  },
  components: {
    navTab,
    easyAccessItem
  }
}
</script>

  </div>
</template>

<script>
import { markRaw } from 'vue'
import navTab from '../../components/baseComponents/navTab.vue'
import easyAccessItem from '../../components/dashboardComponents/easyAccessItem.vue'
import personsIcon from '../../components/icons/Persons.vue'
import addPersonIcon from '../../components/icons/AddPerson.vue'
import personsCategoryIcon from '../../components/icons/PersonCategory.vue'

export default {
  data() {
    return {
      activeTab: localStorage?.getItem('personsTab') ?? 0,
      definitionItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('addPerson'),
          desc: this.$t('addPerson'),
          icon: markRaw(addPersonIcon),
          url: '/persons/new'
        },
        {
          id: 1,
          order: 1,
          title: this.$t('personsList'),
          desc: this.$t('personsList'),
          icon: markRaw(personsIcon),
          url: '/persons/list'
        },
        {
          id: 2,
          order: 2,
          title: this.$t('personsCategory'),
          desc: this.$t('personsCategory'),
          icon: markRaw(personsCategoryIcon),
          url: '/persons/category'
        }
      ]
    }
  },
  components: {
    navTab,
    easyAccessItem
  }
}
</script>
