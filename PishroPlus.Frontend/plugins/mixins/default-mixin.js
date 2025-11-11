import { defaultStore } from '../../src/stores/default'
import { mapState, mapActions } from 'pinia'

const mixin = {
  data() {
    return {
      required_rule: (value) => !!value || 'تکمیل این فیلد الزامی می باشد',
      mobileNumber_rule: (value) => {
        const pattern = /^09[0-9'@s]{9,9}$/
        return value && !pattern.test(value) ? 'شماره موبایل را به درستی وارد نمایید' : true
      },
      // fileBaseUrl: 'localhost:5000/files',
      _screenshot: '',
      headerMenuItems: [
        {
          title: 'profile',
          icon: 'mdi-account',
          link: '/panel/profile'
        }
      ], 
      shortcuts: [
        {
          title: 'openDashboard',
          shortcut: 'ctrl + n',
          action: () => {
            this.$router.push({ path: '/' })
          }
        },
        {
          title: 'openNewReceipt',
          shortcut: 'ctrl + b',
          action: () => {
            this.$router.push({ path: '/warehouse/receipts/new' })
          }
        },
        {
          title: 'openNewRemittance',
          shortcut: 'ctrl + d',
          action: () => {
            this.$router.push({ path: '/warehouse/remittances/new' })
          }
        },
        {
          title: 'openAddPerson',
          shortcut: 'ctrl + e',
          action: () => {
            this.$router.push({ path: '/persons/new' })
          }
        },

        {
          title: 'openRegisterVouche',
          shortcut: 'ctrl + g',
          action: () => {
            this.$router.push({ path: '/accounting/registerVoucher/create/new' })
          }
        },
        {
          title: 'openVoucherJournal',
          shortcut: 'ctrl + h',
          action: () => {
            this.$router.push({ path: '/accounting/voucherJournal' })
          }
        },
        {
          title: 'openQuickSale',
          shortcut: 'ctrl + i',
          action: () => {
            this.$router.push({ path: '/sales/quick' })
          }
        },
        {
          title: 'openNewPurchase',
          shortcut: 'ctrl + j',
          action: () => {
            this.$router.push({ path: '/purchase/newPurchase' })
          }
        },
        {
          title: 'openNewReceive',
          shortcut: 'ctrl + k',
          action: () => {
            this.$router.push({ path: '/transfer/wizard/register/receive' })
          }
        },
        {
          title: 'openNewPay',
          shortcut: 'ctrl + l',
          action: () => {
            this.$router.push({ path: '/transfer/wizard/register/pay' })
          }
        },
        {
          title: 'openNewTicket',
          shortcut: 'ctrl + m',
          action: () => {
            this.$router.push({ path: '/support/ticket/newTicket' })
          }
        }
      ],

      drawerListItems: [
        {
          id: 1,
          text: 'users',
          link: '/panel/users',
          icon: 'mdi-account-group'
        },
        {
          id: 2,
          text: 'forms',
          link: '/panel/forms',
          icon: 'mdi-note-text'
        },
        {
          id: 3,
          text: 'accounts',
          link: '/panel/accounts',
          icon: 'mdi-file-tree mdi-flip-h'
        },
        {
          id: 4,
          text: 'contactus',
          link: '/panel/contactus',
          icon: 'mdi-phone'
        },
        { id: 5, text: 'settings', link: '/panel/settings', icon: 'mdi-cog' }
        // { id: 6, text: 'ticket', link: '/panel/tickets', icon: 'mdi-message' },
      ]
    }
  },
  watch: {
    '$i18n.locale'() {
      this.$vuetify.rtl = this.currentLocaleMessage.rtl
    }
  },
  computed: {
    ...mapState(defaultStore, ['tabs']),
    currentActiveTab() {
      return this.tabs.filter((tab) => tab.isActive)[0] || { params: {} }
    },
    currentLocaleMessage() {
      const current = this.$i18n.locale
      if (current == 'fa') return 'rtl'
      else return 'ltr'
      // return this.$i18n.messages[this.$i18n.locale]
    },
    baseUrl() {
      return (
        (import.meta.env.MODE === 'development'
          ? import.meta.env.VITE_BASE_URL_DEV
          : import.meta.env.VITE_BASE_URL_PRO) + '/'
      )
    },
    screenshot: {
      get() {
        return localStorage.getItem('_sc')
      },
      set(val) {
        if (val) localStorage.setItem('_sc', val)
        else localStorage.removeItem('_sc')
      }
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setNewTab: 'setNewTab',
      refreshCurrentTab: 'refreshCurrentTab'
    }),
    async logout() {
      await this.$auth.logout()
    },
    handleError(error, message) {
      console.error(error)
      this.$store.commit('set_notice', {
        message: !message ? 'متاسفانه خطایی رخ داده است' : message,
        type: 'error'
      })
    },
    handleSuccess(message) {
      this.$store.commit('set_notice', {
        message: !message ? 'عملیات با موفقیت انجام شد' : message,
        type: 'success'
      })
    }
  }
}

export default mixin
