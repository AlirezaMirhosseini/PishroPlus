import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import axios from 'axios'
import { getCurrentInstance } from 'vue'
import i18n from '../../plugins/vue-i18n.js'
import utils from '../../plugins/utils.js'

const defaultDashItems = {
  xs: [
    { show: true, x: 0, y: 0, w: 12, h: 8, i: 'profitLoss' },
    { show: true, x: 0, y: 1, w: 12, h: 11, i: 'supportTicket' },
    { show: true, x: 0, y: 2, w: 12, h: 11, i: 'accountBalance' },
    { show: true, x: 0, y: 3, w: 12, h: 6, i: 'allIncome' },
    { show: true, x: 0, y: 4, w: 12, h: 5, i: 'events' },
    { show: true, x: 0, y: 5, w: 12, h: 10, i: 'latePayingCustomers' },
    { show: true, x: 0, y: 6, w: 12, h: 20, i: 'financialBill' },
    { show: true, x: 0, y: 7, w: 12, h: 11, i: 'lastVouchers' }
  ],
  sm: [
    { show: true, x: 0, y: 0, w: 12, h: 8, i: 'profitLoss' },
    { show: true, x: 0, y: 1, w: 12, h: 11, i: 'supportTicket' },
    { show: true, x: 0, y: 2, w: 12, h: 11, i: 'accountBalance' },
    { show: true, x: 0, y: 3, w: 12, h: 6, i: 'allIncome' },
    { show: true, x: 0, y: 4, w: 12, h: 5, i: 'events' },
    { show: true, x: 0, y: 5, w: 12, h: 10, i: 'latePayingCustomers' },
    { show: true, x: 0, y: 6, w: 12, h: 18, i: 'financialBill' },
    { show: true, x: 0, y: 7, w: 12, h: 11, i: 'lastVouchers' }
  ],
  md: [
    { show: true, x: 0, y: 0, w: 12, h: 4, i: 'profitLoss' },
    { show: true, x: 0, y: 10, w: 6, h: 11, i: 'supportTicket' },
    { show: true, x: 6, y: 10, w: 6, h: 11, i: 'accountBalance' },
    { show: true, x: 6, y: 4, w: 6, h: 6, i: 'allIncome' },
    { show: true, x: 0, y: 4, w: 6, h: 6, i: 'events' },
    { show: true, x: 0, y: 21, w: 6, h: 11, i: 'latePayingCustomers' },
    { show: true, x: 0, y: 32, w: 12, h: 11, i: 'financialBill' },
    { show: true, x: 6, y: 21, w: 6, h: 11, i: 'lastVouchers' }
  ],
  lg: [
    { show: true, x: 0, y: 0, w: 12, h: 4, i: 'profitLoss' },
    { show: true, x: 0, y: 1, w: 3, h: 11, i: 'supportTicket' },
    { show: true, x: 3, y: 1, w: 3, h: 11, i: 'accountBalance' },
    { show: true, x: 6, y: 1, w: 6, h: 6, i: 'allIncome' },
    { show: true, x: 6, y: 1, w: 6, h: 5, i: 'events' },
    { show: true, x: 0, y: 2, w: 3, h: 11, i: 'latePayingCustomers' },
    { show: true, x: 3, y: 2, w: 6, h: 11, i: 'financialBill' },
    { show: true, x: 9, y: 2, w: 3, h: 11, i: 'lastVouchers' }
  ]
}

const localTheme = localStorage?.getItem('v-theme') ?? 'light'
const localFont = localStorage?.getItem('font-default') ?? 14
const localCaptionFont = localStorage?.getItem('font-caption') ?? 12
const localCardTitleFont = localStorage?.getItem('font-card-title') ?? 15
const localPageTitleFont = localStorage?.getItem('font-page-title') ?? 23
const localFontFamily = localStorage?.getItem('font') ?? 'IranYekan'
const localCompany = JSON.parse(localStorage?.getItem('com') ?? '{}')
const localFP = JSON.parse(localStorage?.getItem('FP') ?? '{}')
const localTabs = JSON.parse(localStorage?.getItem('tabs') ?? '[]')
const localDrawerExpanded = localStorage?.getItem('drawerExpanded')
  ? localStorage?.getItem('drawerExpanded') == 'true'
  : true
const localUserData = JSON.parse(localStorage.getItem('userData'))
const localDashItems =
  JSON.parse(localStorage?.getItem('dashItems')) ?? JSON.parse(JSON.stringify(defaultDashItems))

function setTabInLocalStorage(tabs) {
  localStorage.setItem(
    'tabs',
    JSON.stringify(
      [...tabs].map((x) => {
        return { ...x, component: null }
      })
    )
  )
}

function generateRandomString(length = 20) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const charactersLength = characters.length
  let result = ''
  // Create an array of 32-bit unsigned integers
  const randomValues = new Uint32Array(length)
  // Generate random values
  window.crypto.getRandomValues(randomValues)
  randomValues.forEach((value) => {
    result += characters.charAt(value % charactersLength)
  })
  return result
}
export const defaultStore = defineStore('default', {
  state: () => {
    const savedTabs = JSON.parse(localStorage?.getItem('tabs') ?? '[]')
    // Only use default dashboard if no saved tabs exist
    const initialTabs = savedTabs.length > 0 ? savedTabs : []

    return {
      tabs: initialTabs,
      recentTabs: [],
      menuItems: [],
      flattenedMenuItems: [],
      skipLoading: false,
      fp: localFP,
      loading: false,
      theme: localTheme,
      errorMessage: null,
      pageTitle: 'Pishro',
      addBankDialog: false,
      addCashBoxDialog: false,
      font: localFontFamily,
      defaultFont: localFont,
      snackbarColor: 'error',
      showErrorMessage: false,
      dashItems: localDashItems,
      companyDetails: localCompany,
      captionFont: localCaptionFont,
      pageTitleFont: localPageTitleFont,
      cardTitleFont: localCardTitleFont,
      drawerExpanded: localDrawerExpanded,
      warningDialog: {
        show: false,
        title: '',
        desc: '',
        confirm: null
      },
      warningDialog: {
        show: false,
        title: '',
        desc: '',
        confirm: null
      },
      userData: localUserData
    }
  },
  actions: {
    flattenMenuItems(items, result = []) {
      items.forEach((item) => {
        if (item.link) {
          result.push({
            title: item.title,
            link: item.link,
            // icon: typeof item.icon === 'string' ? item.icon : markRaw(item.icon),
            icon: item.icon,
            iconStyle: item.iconStyle
          })
        }
        if (item.items?.length > 0) {
          this.flattenMenuItems(item.items, result)
        }
      })
      return result
    },

    setSkipLoading(val) {
      this.skipLoading = val
    },

    setLoading(val, force = false) {
      if (this.skipLoading && !force) {
        return
      }
      this.loading = val
    },

    setMenuItems(items) {
      this.menuItems = items
      this.initializeFlatMenu(items)
    },

    initializeFlatMenu(items = null) {
      const menuToFlatten = items || this.menuItems
      this.flattenedMenuItems = this.flattenMenuItems(menuToFlatten)
    },

    findMenuItemByTitle(title) {
      return this.flattenedMenuItems.find((item) => item.title === title)
    },

    setNewTab(val, index = -1) {
      val.id = generateRandomString()
      if (index < 0) this.tabs.push(val)
      else {
        this.closeTab(index)
        this.tabs.splice(index, 0, val)
      }
      this.setActiveTab(index > -1 ? index : this.tabs.length - 1)
      setTabInLocalStorage(this.tabs)
    },

    loadRecentTabs() {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        this.recentTabs = []
        return
      }
      const tokenData = utils.parseJwt(token)
      if (!tokenData?.user_id) {
        this.recentTabs = []
        return
      }
      const storageKey = `recentlyVisited_${tokenData.user_id}`
      const storedRecents = localStorage.getItem(storageKey)

      this.recentTabs = storedRecents ? JSON.parse(storedRecents) : []
    },

    removeRecentTab(tabLink) {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const tokenData = utils.parseJwt(token)
      if (!tokenData?.user_id) return

      const storageKey = `recentlyVisited_${tokenData.user_id}`
      const storedRecents = localStorage.getItem(storageKey)

      if (storedRecents) {
        const recentItems = JSON.parse(storedRecents).filter((i) => i.link !== tabLink)
        localStorage.setItem(storageKey, JSON.stringify(recentItems))
      }
      this.recentTabs = this.recentTabs.filter((tab) => tab.link !== tabLink)
    },

    removeAllRecentTabs() {
      const token = localStorage.getItem('auth_token')
      if (!token) return

      const tokenData = utils.parseJwt(token)
      if (!tokenData?.user_id) return

      const storageKey = `recentlyVisited_${tokenData.user_id}`

      // Clear the user-specific storage
      localStorage.removeItem(storageKey)

      // Update the state
      this.recentTabs = []
    },

    setActiveTab(index) {
      if (index < 0 || !this.tabs[index]) return
      var activeTab = this.tabs.filter((x) => x.isActive)[0]
      if (activeTab) this.tabs[index].lastActiveTabId = activeTab.id
      this.tabs.forEach((item) => {
        item.isActive = false
      })
      if (this.tabs[index]) {
        this.tabs[index].isActive = true
      }
      setTabInLocalStorage(this.tabs)
    },
    getActiveTabIndex() {
      return this.tabs.findIndex((x) => x.isActive)
    },
    closeCurrentTab() {
      let idx = this.tabs.findIndex((x) => x.isActive)
      this.closeTab(idx)
    },
    closeAndRefreshTab() {
      let idx = this.tabs.findIndex((x) => x.isActive)
      this.closeTab(idx)
      this.refreshCurrentTab()
    },
    closeTab(index) {
      if (index < 0 || index == undefined) {
        return
      }
      let currentTab = this.tabs[index]
      this.tabs.splice(index, 1)
      let lastActiveTabIdx = this.tabs.findIndex((x) => x.id === currentTab?.lastActiveTabId)
      this.tabs.forEach((item) => {
        item.isActive = false
      })
      if (lastActiveTabIdx > -1) {
        this.tabs[lastActiveTabIdx].isActive = true
      } else if (this.tabs && this.tabs.length > 0) {
        this.tabs[this.tabs.length - 1].isActive = true
      }
      setTabInLocalStorage(this.tabs)
    },
    clearTabs() {
      this.tabs = []
    },
    refreshTab(idx) {
      if (idx < 0) return
      let activeTab = this.tabs[idx]
      const refresh = () => {
        this.closeWarning()
        let tab = this.tabs[idx]
        this.setNewTab({ ...tab }, idx)
      }
      if (idx > -1) {
        if (activeTab.secureRefresh === true) {
          this.setWarningDialog(
            true,
            i18n.global.t('refreshTab'),
            i18n.global.t('refreshFromPageAlert'),
            () => {
              refresh()
            }
          )
        } else {
          refresh()
        }
      }
    },
    refreshCurrentTab() {
      let idx = this.tabs.findIndex((x) => x.isActive)
      this.refreshTab(idx)
    },
    refreshTabByName(tabName) {
      const index = this.tabs.findIndex((tab) => tab.tabName === tabName)
      if (index >= 0) {
        this.refreshTab(index)
        this.setActiveTab(index)
        return true
      }
      return false
    },
    setAddBankDialog(val) {
      this.addBankDialog = val
    },
    setAddCashBoxDialog(val) {
      this.addCashBoxDialog = val
    },
    // setWarningDialog(show, title, desc, confirm) {
    //     this.warningDialog = {
    //         show: show,
    //         title: title,
    //         desc: desc,
    //         confirm: confirm
    //     }
    // },
    setWarningDialog(show, title, desc, confirm) {
      this.warningDialog = {
        show: show,
        title: title,
        desc: desc,
        confirm: confirm
      }
    },
    setUserData(data) {
      localStorage.setItem('userData', JSON.stringify(data))
      this.userData = data
    },
    closeWarning() {
      this.warningDialog.show = false
    },
    setTheme(val) {
      this.theme = val
      localStorage.setItem('v-theme', val)
    },
    addDashItem(breakpoint, id) {
      switch (breakpoint) {
        case 'xs':
          const xsIndex = this.dashItems.xs.findIndex((item) => item.i === id)
          this.dashItems.xs[xsIndex] = {
            show: true,
            x: 12,
            y: 20,
            w: 3,
            h: 6,
            i: id
          }
          break
        case 'sm':
          let smIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.sm[smIndex] = {
            show: true,
            x: 12,
            y: 20,
            w: 3,
            h: 6,
            i: id
          }
          break
        case 'md':
          let mdIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.md[mdIndex] = {
            show: true,
            x: 12,
            y: 20,
            w: 3,
            h: 6,
            i: id
          }
          break
        case 'lg':
          let lgIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.lg[lgIndex] = {
            show: true,
            x: 12,
            y: 20,
            w: 3,
            h: 6,
            i: id
          }
          break
        default:
          let defIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.lg[defIndex] = {
            show: true,
            x: 12,
            y: 20,
            w: 3,
            h: 6,
            i: id
          }
      }
      localStorage.setItem('dashItems', JSON.stringify(this.dashItems))
    },
    removeDashItem(breakpoint, id) {
      switch (breakpoint) {
        case 'xs':
          const xsIndex = this.dashItems.xs.findIndex((item) => item.i === id)
          this.dashItems.xs[xsIndex] = {
            show: false,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            i: id
          }
          break
        case 'sm':
          let smIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.sm[smIndex] = {
            show: false,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            i: id
          }
          break
        case 'md':
          let mdIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.md[mdIndex] = {
            show: false,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            i: id
          }
          break
        case 'lg':
          let lgIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.lg[lgIndex] = {
            show: false,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            i: id
          }
          break
        default:
          let defIndex = this.dashItems.lg.findIndex((item) => item.i === id)
          this.dashItems.lg[defIndex] = {
            show: false,
            x: 0,
            y: 0,
            w: 0,
            h: 0,
            i: id
          }
      }
      localStorage.setItem('dashItems', JSON.stringify(this.dashItems))
    },
    setDashItem(breakpoint, item) {
      switch (breakpoint) {
        case 'xs':
          this.dashItems.xs = item
          break
        case 'sm':
          this.dashItems.sm = item
          break
        case 'md':
          this.dashItems.md = item
          break
        case 'lg':
          this.dashItems.lg = item
          break
        default:
          this.dashItems.lg = item
      }
      localStorage.setItem('dashItems', JSON.stringify(this.dashItems))
    },
    setDefaultDashItem() {
      this.dashItems = JSON.parse(JSON.stringify(defaultDashItems))
      localStorage.setItem('dashItems', JSON.stringify(this.dashItems))
    },
    setDrawer(val) {
      this.drawerExpanded = val
      localStorage.setItem('drawerExpanded', val)
    },
    setFP(item) {
      this.fp = item
      Cookies.set('FP', JSON.stringify(item), { expires: 365 })
      if (localStorage) localStorage.setItem('FP', JSON.stringify(item))
      axios.defaults.headers.common['FP-Id'] = item.id
    },
    setCompanyDetails(name, code, id, displayName) {
      this.companyDetails = {
        c: code,
        n: name,
        i: id,
        d: displayName
      }
      localStorage.setItem('com', JSON.stringify(this.companyDetails))
    },
    setFont(val) {
      this.font = val
      localStorage.setItem('font', val)
    },
    setPageTitle(val) {
      this.pageTitle = val
    },
    setDefaultFont(val) {
      this.defaultFont = val
      localStorage.setItem('font-default', val)
    },
    setCaptionFont(val) {
      this.captionFont = val
      localStorage.setItem('font-caption', val)
    },
    setCardTitleFont(val) {
      this.cardTitleFont = val
      localStorage.setItem('font-card-title', val)
    },
    setPageTitleFont(val) {
      ;(this.pageTitleFont = val), localStorage.setItem('font-page-title', val)
    },
    setLoading(val) {
      this.loading = val
    },
    setErrorMessage(val, color) {
      if (color) this.snackbarColor = color
      else this.snackbarColor = 'error'
      if (val === false) {
        this.errorMessage = ''
        this.showErrorMessage = false
      } else {
        this.errorMessage = val
        this.showErrorMessage = true
        setTimeout(() => {
          this.errorMessage = ''
          this.showErrorMessage = false
        }, 3000)
      }
    }
  }
})
