<!-- src/components/EasyAccessSubItem.vue -->
<template>
    <nav-tab :items="[$t('definitions')]" v-model:activeTab="activeTab" storeName="personsTab"></nav-tab>
    <div class="bg-surface flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center tab-container">
        <transition name="easyaccess" mode="out-in">
            <v-row v-if="activeTab == 0" justify="center" no-gutters dense style="align-content: baseline">
                <easy-access-item v-for="(item, index) in items" :key="index" :item="item" />
            </v-row>
        </transition>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            activeTab: 0,
        }
    },
    props: {
        items: {
            type: Array,
            required: true
        }
    }
}
</script>
  
<style scoped>
.sub-item {
    margin: 10px 0;
}
</style>