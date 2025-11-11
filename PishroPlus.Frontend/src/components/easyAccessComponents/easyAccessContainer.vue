<!-- <template>
    <div class="d-flex eac" >
        <template v-if="selectedItem && selectedItem.children">
            <div class="d-flex flex-column" >
                <v-row no-gutters justify="end">
                    <v-btn @click="selectedItem = {}" max-width="150" variant="text">{{ $t('back')
                    }}<v-icon>mdi-chevron-left</v-icon></v-btn>
                </v-row>
                <nav-tab :items="navTabTitles" v-model:activeTab="activeTab" storeName="tab"></nav-tab>
                <v-row no-gutters>
                    <easy-access-item v-for="(it, idx) in selectedItem.children[childrenKeys[activeTab]]" :key="idx"
                        :item="it"  @click="navigate"/>

                </v-row>
            </div>
        </template>
        <template v-else>
            <easy-access-item v-for="(item, i) in items" :key="i" :item="item" @click="selectItem" />
        </template>
    </div>
</template> -->
<template>
  <div class="d-flex flex-column eac">
    <div v-if="recentTabs.length > 0" class="recent-section mb-8">
      <div class="d-flex align-center justify-space-between mb-4">
        <div class="d-flex align-center ga-2">
          <v-icon>mdi-history</v-icon>
          <h2>{{ $t('recentlyVisited') + ' : ' }}</h2>
        </div>
        <v-btn
          density="compact"
          variant="text"
          color="error"
          @click="clearAllRecents"
          class="ml-2"
        >
          <v-icon size="small" class="mr-1">mdi-delete-sweep</v-icon>
          {{ $t('clearHistory') }}
        </v-btn>
      </div>
      <v-row no-gutters id="ea-container">
        <div v-for="(item, i) in recentTabs" :key="`recent-${i}`" class="recent-item-wrapper">
          <easy-access-item
            :index="i"
            :item="item"
            :show-remove="true"
            @click="navigate"
            @remove="removeFromRecents"
          />
        </div>
      </v-row>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../../src/stores/default'
import navTab from '../baseComponents/navTab.vue'
import easyAccessItem from './easyAccessItem.vue'
import utils from '../../../plugins/utils'

export default {
  components: {
    easyAccessItem,
    navTab
  },
  props: {
    items: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      selectedItem: {},
      activeTab: 0
    }
  },
  computed: {
    ...mapState(defaultStore, {
      tabs: 'tabs',
      recentTabs: 'recentTabs'
    }),
    childrenKeys() {
      if (!this.selectedItem.children) return []
      return Object.keys(this.selectedItem.children)
    },
    tab: {
      get() {
        return this.tabs.findIndex((x) => x.isActive)
      },
      set() {}
    },
    navTabTitles() {
      return this.childrenKeys.map((x) => this.$t(x))
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      findMenuItemByTitle: 'findMenuItemByTitle',
      initializeFlatMenu: 'initializeFlatMenu',
      loadRecentTabs: 'loadRecentTabs',
      removeRecentTab: 'removeRecentTab',
      removeAllRecentTabs: 'removeAllRecentTabs'
    }),

    selectItem(item) {
      this.selectedItem = { ...item }
    },
    navigate(item) {
      const menuItem = this.findMenuItemByTitle(item.title)
      if (menuItem) {
        this.$router.push(menuItem.link)
        utils.addToRecents(item)
      }
    },
    removeFromRecents(item) {
      this.removeRecentTab(item.link)
    },
    clearAllRecents() {
      this.removeAllRecentTabs()
    },
    setupRecentsNavigation() {
      if (this.recentTabs?.length > 0) {
        this.$nextTick(() => {
          setTimeout(() => {
            const firstEl = document.getElementById('ea-0')
            if (firstEl) {
              firstEl.focus()
            }

            const container = document.getElementById('ea-container')
            if (container) {
              const oldListener = container._keydownListener
              if (oldListener) {
                container.removeEventListener('keydown', oldListener)
              }
              
              const keydownListener = function(event) {
                const items = Array.from(this.querySelectorAll('.ea-container'))
                
                if (items.length === 0) return;
                
                const currentIndex = items.indexOf(document.activeElement)
                if (currentIndex === -1) return;
                
                switch (event.key) {
                  case 'ArrowLeft':
                  case 'ArrowDown':
                    if (currentIndex < items.length - 1) {
                      items[currentIndex + 1].focus()
                    } else {
                      items[0].focus()
                    }
                    event.preventDefault();
                    break

                  case 'ArrowRight':
                  case 'ArrowUp':
                    if (currentIndex > 0) {
                      items[currentIndex - 1].focus()
                    } else {
                      items[items.length - 1].focus()
                    }
                    event.preventDefault();
                    break

                  default:
                    break
                }
              }
              
              container.addEventListener('keydown', keydownListener)
              container._keydownListener = keydownListener
            }
          }, 100)
        })
      }
    },
  },
  watch: {
    tab(value) {
      if (value === 0) {
        this.setupRecentsNavigation()
      }
    },
    recentTabs: {
      handler() {
        this.$nextTick(() => {
          this.setupRecentsNavigation()
        })
      },
      deep: true
    }
  },
  mounted() {
    this.initializeFlatMenu()
    this.loadRecentTabs()
    this.setupRecentsNavigation()
    // if (this.recentTabs?.length > 0) {
    //   setTimeout(() => {
    //     const firstEl = document.getElementById('ea-0')
    //     firstEl?.focus()

    //     document.getElementById('ea-container').addEventListener('keydown', function (event) {
    //       const items = Array.from(this.querySelectorAll('.ea-container'))

    //       const currentIndex = items.indexOf(document.activeElement)

    //       switch (event.key) {
    //         case 'ArrowLeft':
    //         case 'ArrowDown':
    //           if (currentIndex < items.length - 1) {
    //             items[currentIndex + 1].focus()
    //           } else {
    //             items[0].focus()
    //           }
    //           break

    //         case 'ArrowRight':
    //         case 'ArrowUp':
    //           if (currentIndex > 0) {
    //             items[currentIndex - 1].focus()
    //           } else {
    //             items[items.length - 1].focus()
    //           }
    //           break

    //         default:
    //           break
    //       }
    //     })
    //   }, 300)
    // }
  }
}
</script>
<style>
.recent-item-wrapper {
  position: relative;
  display: inline-block;
}

.eac {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.recent-section {
  width: 100%;
}

.main-content {
  width: 100%;
  display: flex;
  flex-flow: wrap;
  justify-content: center;
  align-items: flex-start;
}

@media only screen and (max-width: 960px) {
  .eac {
    padding: 0 16px;
  }
}
</style>
