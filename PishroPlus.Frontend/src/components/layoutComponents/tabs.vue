<template>
  <div style="height: 100%">
    <div class="d-flex justify-space-between align-center">
      <div class="tab-container">
        <v-tabs v-model="tab" class="flex-grow-1 tab-box">
          <v-tab
            v-for="(item, idx) in tabs"
            :key="item.tabName"
            :text="item.tabName"
            :class="`tab-item ${item.isActive ? 'tab-item-active' : ''}`"
            @contextmenu.prevent="showContextMenu($event, idx)"
            @click.middle="() => (item.closable ? _closeTab(idx) : null)"
          >
            <v-btn
              v-if="item.closable"
              size="30"
              @click="_closeTab(idx)"
              variant="text"
              class="btn-class"
              >✕</v-btn
            >
            <p @click="_setActiveTab(idx)" class="title">{{ getTitle(item) }}</p>
          </v-tab>
        </v-tabs>
      </div>
      <DesktopTopBar />
    </div>
    <v-tabs-window v-model="tab" style="height: calc(100% - 46px); overflow-y: scroll">
      <v-tabs-window-item v-for="tab in tabs" :key="tab.name" class="py-1" style="height: 100%">
        <KeepAlive>
          <component :is="tab.component" :key="tab.id"></component>
        </KeepAlive>
      </v-tabs-window-item>
    </v-tabs-window>

    <!-- Context Menu (Right Click) -->
    <div
      v-if="contextMenuVisible"
      :style="{ top: `${contextMenuY}px`, left: `${contextMenuX}px` }"
      class="context-menu"
    >
      <div
        v-if="contextMenuOptions.includes('closeThisTab')"
        @click="closeThisTab(contextMenuTabIndex)"
      >
        {{ $t('closeThisTab') }}
      </div>
      <hr v-if="contextMenuOptions.includes('closeThisTab')" />
      <div @click="closeOtherTabs(contextMenuTabIndex)">{{ $t('closeOtherTabs') }}</div>
      <hr />
      <div @click="closeAllTabs()">{{ $t('closeAll') }}</div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import BreadCrumb from '../../components/layoutComponents/breadCrumb.vue'
import DesktopTopBar from '../../components/layoutComponents/desktopTopBar.vue'
import ReportOutput from '../../components/baseComponents/reportOutput.vue'

export default {
  data() {
    return {
      contextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      contextMenuTabIndex: null
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      closeTab: 'closeTab',
      setActiveTab: 'setActiveTab',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    _closeTab(idx) {
      this.closeTab(idx)
      if (!this.tabs || this.tabs.length === 0) {
        this.$router.push('/')
      }
    },
    _setActiveTab(idx) {
      this.setActiveTab(idx)
    },
    showContextMenu(event, idx) {
      const desiredTabName = this.tabs[idx].tabName
      const tabElement = event.currentTarget
      const rect = tabElement.getBoundingClientRect()

      this.contextMenuVisible = true
      // this.contextMenuX = rect.left;
      this.contextMenuY = rect.top + 30
      this.contextMenuTabIndex = idx

      // Adjust the X position for the "dashboard" tab :)
      if (desiredTabName === 'dashboard') {
        this.contextMenuX = rect.left - 50 // Move 10 pixels to the left for 'dashboard'
      } else {
        this.contextMenuX = rect.left // Keep the position for other tabs
      }

      // If the clicked tab is "dashboard", only show the option to close other tabs :)
      if (desiredTabName === 'dashboard') {
        this.contextMenuOptions = ['closeOtherTabs']
      } else {
        this.contextMenuOptions = ['closeThisTab', 'closeOtherTabs']
      }
    },
    closeThisTab(tabIndex) {
      this.closeTab(tabIndex)
      this.contextMenuVisible = false
    },
    closeAllTabs() {
      for (let index = this.tabs.length - 1; index > 0; index--) {
        this.closeTab(index)
      }
      this.setActiveTab(0)
      this.contextMenuVisible = false
    },
    closeOtherTabs(tabIndex) {
      for (let index = this.tabs.length - 1; index > 0; index--) {
        if (index !== tabIndex) {
          this.closeTab(index)
        }
      }
      // this._setActiveTab(-1)
      if (tabIndex === 0) this.setActiveTab(0)
      else this.setActiveTab(1)
      this.contextMenuVisible = false
    },
    hideContextMenu() {
      this.contextMenuVisible = false
    },
    getTitle(tab) {
      if (tab.tabName !== null) {
        if (tab.name === 'ticketChat') {
          return `${this.$t(tab.tabName)}_${tab.params.code}`
        } else if (tab.name === 'remittanceOrReceipt') {
          if (tab.params.remittanceOrReceipt === 'receipts') {
            return `${this.$t('receiptsList')}`
          } else {
            return `${this.$t('remittancesList')}`
          }
        } else {
          return this.$t(tab.tabName)
        }
      }
      let paramsLst = []
      for (const key in tab.params) {
        paramsLst.push(this.$t(tab.params[key]))
      }
      return paramsLst.join('-')
    },
    handlePressEscape(e) {
      if (e.key == 'Escape') {
        if (document.activeElement.tagName == 'BODY' && this.tabs[this.tab].closable) {
          this.setWarningDialog(
            true,
            this.$t('leaveFromPage'),
            this.$t('closeTabWarningMessage'),
            () => {
              this.closeWarning()
              this.closeTab(this.tab)
            }
          )
        }
        document.activeElement.blur()
      }
    }
  },
  mounted() {
    document.addEventListener('click', this.hideContextMenu)
    window.addEventListener('keydown', this.handlePressEscape)

    const dashboardIndex = this.tabs.findIndex((tab) => tab.tabName === 'dashboard')

    if (dashboardIndex === -1) {
      this.tabs.push({ tabName: 'dashboard' })
      this.setActiveTab(this.tabs.length - 1)
    } else {
      const activeTab = this.tabs.findIndex((tab) => tab.isActive)
      this.setActiveTab(activeTab)
    }
    document.title = this.tabs[this.tab]?.tabName
      ? this.$t(this.tabs[this.tab].tabName)
      : this.$t(this.tabs[this.tab].params.type)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.hideContextMenu)
    window.removeEventListener('keydown', this.handlePressEscape)
  },
  watch: {
    tab(newVal) {
      const selectedTab = this.tabs[newVal]
      document.title = selectedTab?.tabName
        ? this.$t(selectedTab.tabName)
        : this.$t(selectedTab.params.type)
    }
  },
  computed: {
    ...mapState(defaultStore, {
      tabs: 'tabs'
    }),
    tab: {
      get() {
        return this.tabs.findIndex((x) => x.isActive)
      },
      set() {}
    }
  },
  components: {
    BreadCrumb,
    DesktopTopBar,
    ReportOutput
  }
}
</script>

<style>
@media only screen and (max-width: 600px) {
  .tab-box {
    height: 42px;
  }
  .title {
    font-size: 10px;
    padding: 0px !important;
  }
}
.btn-class:hover {
  background-color: gray;
  color: black;
}

.tab-box {
  border-bottom: 1px solid lightgray;
  display: inline-block;
}

.tab-item {
  padding: 0px !important;
  margin-inline: 1px;
  border-top-left-radius: 5px !important;
  border-top-right-radius: 5px !important;
}

.tab-item-active {
  background: #e1e1e1 !important;
}
.v-theme--dark .tab-item-active {
  color: black;
}

.title {
  padding-inline: 13px;
  height: 100%;
  display: flex;
  align-items: center;
}
.context-menu {
  position: absolute;
  background: white;
  border: 1px solid lightgray;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 10px;
}

.context-menu div {
  padding: 10px;
  cursor: pointer;
}

.context-menu div:hover {
  background-color: lightgray;
}

.tab-container {
  max-width: 100%;
  overflow: auto;
  white-space: nowrap;
  padding-block: 5px;
}
.v-tabs--density-default {
  --v-tabs-height: 36px !important;
}
.v-tab--selected .v-tab__slider {
  height: 3px !important;
}
</style>
