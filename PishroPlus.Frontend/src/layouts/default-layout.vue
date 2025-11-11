<script>
import HesabdariIcon from '../components/icons/RightMenu-Hesabdari.vue'
import PurchaseIcon from '../components/icons/RightMenu-Purchase.vue'
import SaleIcon from '../components/icons/RightMenu-Sale.vue'
import CheckOBankIcon from '../components/icons/RightMenu-CheckOBank.vue'
import reviewAccountsIcon from '../components/icons/ReviewAccounts.vue'
import AnbarIcon from '../components/icons/RightMenu-Anbar.vue'
// import SaleIcon from '../components/icons/Sale.vue'
import MenuIcon from '../components/icons/RightMenu-Menu.vue'
import treeViewIcon from '../components/icons/AccountingTreeView.vue'
import Loading from '../components/baseComponents/loading.vue'
import Auth from '../../plugins/auth'
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../stores/default'
import { markRaw } from 'vue'
import RightMenu from '../components/layoutComponents/rightMenu.vue'
import RightSubMenu from '../components/layoutComponents/rightSubMenu.vue'
import RightNestedSubMenu from '../components/layoutComponents/rightNestedSubMenu.vue'
import DesktopTopBar from '../components/layoutComponents/desktopTopBar.vue'
import AndroidTopBar from '../components/layoutComponents/androidTopBar.vue'
import AndroidSearchBar from '../components/layoutComponents/androidSearchBar.vue'
import DesktopStatusBar from '../components/layoutComponents/desktopStatusBar.vue'
import BreadCrumb from '../components/layoutComponents/breadCrumb.vue'
import registerDocumentIcon from '../components/icons/AccountingRegisterDocument.vue'
import voucherJournalIcon from '../components/icons/VoucherJournal.vue'
import balanceSheetIcon from '../components/icons/balanceSheet.vue'
import PersonsIcon from '../components/icons/Persons.vue'
import bankAccountIcon from '../components/icons/BankAccount.vue'
import transferAccountIcon from '../components/icons/TransferAccount.vue'
import FundAccountIcon from '../components/icons/FundAccount.vue'
import accountingRegisterIncomesToCashDeskIcon from '../components/icons/AccountingRegisterIncomesToCashDesk.vue'
import recieveAndPayListIcon from '../components/icons/ReceiveAndPayList.vue'
import checkBookIcon from '../components/icons/CheckBook.vue'
import checkPaperIcon from '../components/icons/CheckPaperRegister.vue'
import receiveIcon from '../components/icons/Receive.vue'
import voucherListIcon from '../components/icons/VoucherList.vue'
import NewReceiptIcon from '../components/icons/NewReceipt.vue'
import ReceiptListIcon from '../components/icons/ReceiptList.vue'
import addPersonIcon from '../components/icons/AddPerson.vue'
import personCategoryIcon from '../components/icons/PersonCategory.vue'
import transferCategoryIcon from '../components/icons/TransferCategory.vue'
import ProfitAndLossIcon from '../components/icons/ProfitAndLoss.vue'
import utils from '../../plugins/utils'
import settingService from '../../api/setting/settingService'
import Tabs from '../components/layoutComponents/tabs.vue'
import RightMenuHesabdari from '../components/icons/RightMenu-Hesabdari.vue'
import RightMenuCheckOBank from '../components/icons/RightMenu-CheckOBank.vue'
import reportService from '../../api/reports/reportService'
import FormulaService from '../../api/formula/formulaService'

export default {
  data() {
    return {
      isMenuExpanded: false,
      isSubMenuExpanded: true,
      isMenuHide: true,
      menuIcon: markRaw(MenuIcon),
      treeViewIcon: markRaw(treeViewIcon),
      AnbarIcon: markRaw(AnbarIcon),
      selectedItem: null,
      selectedSubItem: null,
      searchText: null,
      reportProcedures: [],
      formulaItems: []
    }
  },
  computed: {
    ...mapState(defaultStore, {
      pageTitle: 'pageTitle',
      companyDetails: 'companyDetails',
      drawerExpanded: 'drawerExpanded',
      sLoading: 'loading',
      tabs: 'tabs',
      clearTabs: 'clearTabs'
    }),
    menuItems() {
      let items = [
        { title: this.$t('dashboard'), icon: 'mdi mdi-view-dashboard-outline', link: '/', id: 1 },
        {
          title: this.$t('persons'),
          icon: markRaw(PersonsIcon),
          id: 2,
          items: [
            {
              title: this.$t('definitions'),
              icon: 'mdi mdi-file-document-multiple-outline',
              id: 1,
              items: [
                {
                  title: this.$t('addPerson'),
                  icon: markRaw(addPersonIcon),
                  id: 1,
                  link: '/persons/new'
                },
                {
                  title: this.$t('personsList'),
                  icon: markRaw(PersonsIcon),
                  id: 2,
                  link: '/persons/list'
                },
                {
                  title: this.$t('personsCategory'),
                  icon: markRaw(personCategoryIcon),
                  id: 3,
                  link: '/persons/category'
                }
              ]
            }
          ]
        },
        {
          title: this.$t('accounting'),
          icon: markRaw(HesabdariIcon),
          id: 3,
          items: [
            {
              title: this.$t('vouchers'),
              icon: 'mdi mdi-file-document-multiple-outline',
              id: 1,
              items: [
                {
                  title: this.$t('registerAccountingVoucher'),
                  icon: markRaw(registerDocumentIcon),
                  id: 1,
                  link: '/accounting/registerVoucher/create/new'
                }
              ]
            },
            {
              title: this.$t('definitions'),
              icon: 'mdi-comment-text-outline',
              id: 2,
              items: [
                {
                  title: this.$t('accountingTreeView'),
                  icon: treeViewIcon,
                  id: 1,
                  link: '/accounting/treeView'
                },
                {
                  title: this.$t('detailedAccountsTreeView'),
                  icon: treeViewIcon,
                  id: 2,
                  link: '/accounting/detailedAccountsTreeView'
                }
              ]
            },
            {
              title: this.$t('systemReports'),
              icon: 'mdi-chart-box-outline',
              id: 3,
              // items: this.reportProcedures.filter(proc => proc.ProcedureName.startsWith('Accounting_'))
              // .map((proc, index) => ({
              //   title: proc.ProcedureName,
              //   icon: markRaw(voucherListIcon),
              //   id: index + 1,
              //   link: `/reportBuilder?report=${proc.ProcedureName}`
              // }))
              items: [
                {
                  title: this.$t('allAccountLedgerReport'),
                  icon: markRaw(reviewAccountsIcon),
                  id: 1,
                  link: '/accounting/allAccountLedgerReport'
                },
                {
                  title: this.$t('accountLedgerReport'),
                  icon: markRaw(reviewAccountsIcon),
                  id: 6,
                  link: '/accounting/allAccountLedgerReport/single'
                },
                {
                  title: this.$t('allDetailedAccountLedgerReport'),
                  icon: markRaw(reviewAccountsIcon),
                  id: 7,
                  link: '/accounting/allDetailedAccountLedgerReport'
                },
                {
                  title: this.$t('reviewDetailedAccount'),
                  icon: markRaw(reviewAccountsIcon),
                  id: 8,
                  link: '/accounting/allDetailedAccountLedgerReport/single'
                },
                // {
                //   title: this.$t('reviewAccounts'),
                //   icon: markRaw(reviewAccountsIcon),
                //   id: 2,
                //   link: '/accounting/reviewAccounts'
                // },
                {
                  title: this.$t('voucherJournal'),
                  icon: markRaw(voucherJournalIcon),
                  id: 3,
                  link: '/accounting/voucherJournal'
                },
                {
                  title: this.$t('balanceSheet'),
                  icon: markRaw(balanceSheetIcon),
                  id: 9,
                  link: '/accounting/balanceSheet'
                },
                // {
                //   title: this.$t('profitLoss'),
                //   icon: markRaw(reviewAccountsIcon),
                //   id: 4,
                //   link: '/accounting/profitLossReport'
                // },
                {
                  title: this.$t('vouchersList'),
                  icon: markRaw(voucherListIcon),
                  id: 5,
                  link: '/accounting/vouchers'
                }
              ]
            }
          ]
        },
        {
          title: this.$t('sale'),
          icon: markRaw(SaleIcon),
          id: 7,
          items: [
            {
              title: this.$t('factor'),
              icon: '',
              id: 1,
              items: [
                {
                  title: this.$t('newSale'),
                  icon: 'mdi-note-plus-outline mdi-flip-h',
                  id: 1,
                  link: '/sales/new',
                  items: []
                },
                {
                  title: this.$t('quickInvoice'),
                  icon: 'mdi-note-plus-outline mdi-flip-h',
                  id: 2,
                  link: '/sales/quick',
                  items: []
                },
                {
                  title: this.$t('returnFromSales'),
                  icon: 'mdi mdi-skip-forward',
                  id: 3,
                  link: '/sales/return/selectInvoice',
                  items: []
                }
              ]
            },
            {
              title: this.$t('profitLoss'),
              icon: 'mdi-chart-box-outline',
              id: 2,
              items: [
                {
                  title: this.$t('saleList'),
                  icon: 'mdi-note-multiple-outline mdi-flip-h',
                  id: 1,
                  link: '/sales',
                  items: []
                },
                {
                  title: this.$t('returnSalesList'),
                  icon: 'mdi-keyboard-return',
                  id: 2,
                  link: '/sales/returns',
                  items: []
                }
              ]
            }
            // {
            //   title: this.$t('definitions'),
            //   icon: markRaw(transferAccountIcon),
            //   id: 3,
            //   items: []
            // }
          ]
        },
        {
          title: this.$t('purchase'),
          // icon: markRaw(SaleIcon),
          // icon:'mdi-cart-plus',
          icon: markRaw(SaleIcon),
          id: 6,
          // disabled: true,
          items: [
            {
              title: this.$t('factor'),
              icon: '',
              id: 1,
              items: [
                {
                  title: this.$t('newPurchase'),
                  icon: 'mdi-note-multiple-outline mdi-flip-h',
                  id: 1,
                  link: '/purchase/purchaseInvoice',
                  items: []
                },
                {
                  title: this.$t('returnFromPurchases'),
                  icon: 'mdi mdi-skip-forward',
                  id: 2,
                  link: '/purchase/return/selectInvoice',
                  items: []
                }
              ]
            },
            {
              title: this.$t('reports'),
              icon: '',
              id: 2,
              items: [
                {
                  title: this.$t('purchaseInvoices'),
                  icon: 'mdi-note-multiple-outline mdi-flip-h',
                  id: 1,
                  link: '/purchase/purchaseInvoices',
                  items: []
                },
                {
                  title: this.$t('returnPurchasesList'),
                  icon: 'mdi-keyboard-return',
                  id: 2,
                  link: '/purchase/returns',
                  items: []
                }
              ]
            }
            // {
            //   title: this.$t('reports'),
            //   icon: 'mdi-chart-box-outline',
            //   id: 2,
            //   items: [
            //     {
            //       title: this.$t('saleList'),
            //       icon: 'mdi-note-multiple-outline mdi-flip-h',
            //       id: 1,
            //       link: '/sales',
            //       items: []
            //     }
            //   ]
            // }
            // {
            //   title: this.$t('definitions'),
            //   icon: markRaw(transferAccountIcon),
            //   id: 3,
            //   items: []
            // }
          ]
        },
        // {
        //   title: this.$t('purchase'),
        //   icon: markRaw(PurchaseIcon),
        //   id: 8,
        //   items: []
        // },
        {
          title: this.$t('receiveAndPay'),
          icon: markRaw(CheckOBankIcon),
          id: 4,
          disabled: true,
          items: [
            {
              title: this.$t('receive'),
              icon: markRaw(receiveIcon),
              id: 1,
              items: [
                {
                  title: this.$t('registerReceive'),
                  icon: markRaw(receiveIcon),
                  link: '/transfer/wizard/register/receive',
                  id: 1
                },
                {
                  title: this.$t('receiveList'),
                  icon: markRaw(recieveAndPayListIcon),
                  link: '/transfer/payOrReceiveList/receiveList',
                  id: 2
                }
              ]
            },
            {
              title: this.$t('pay'),
              icon: markRaw(receiveIcon),
              iconStyle: 'transform: scaleY(-1)',
              id: 2,
              items: [
                {
                  title: this.$t('registerPay'),
                  icon: markRaw(receiveIcon),
                  iconStyle: 'transform: scaleY(-1)',
                  link: '/transfer/wizard/register/pay',
                  id: 1
                },
                {
                  title: this.$t('payList'),
                  icon: markRaw(recieveAndPayListIcon),
                  link: '/transfer/payOrReceiveList/payList',
                  id: 2
                }
              ]
            },
            {
              title: this.$t('definitions'),
              icon: markRaw(transferAccountIcon),
              id: 3,
              items: [
                {
                  title: this.$t('bank'),
                  icon: markRaw(bankAccountIcon),
                  link: '/transfer/registerAccount/bank',
                  id: 1
                },
                {
                  title: this.$t('cashDesk'),
                  icon: markRaw(accountingRegisterIncomesToCashDeskIcon),
                  link: '/transfer/registerAccount/cashBox',
                  id: 2
                },
                {
                  title: this.$t('fund'),
                  icon: markRaw(FundAccountIcon),
                  link: '/transfer/registerAccount/fund',
                  id: 3
                },
                {
                  title: this.$t('category'),
                  icon: markRaw(transferCategoryIcon),
                  link: '/transfer/category',
                  id: 4
                },
                {
                  title: this.$t('checkBook'),
                  icon: markRaw(checkPaperIcon),
                  link: '/transfer/checkBookList',
                  id: 5
                }
              ]
            }
          ]
        },
        {
          title: this.$t('warehouseManagement'),
          icon: markRaw(AnbarIcon),
          id: 8,
          disabled: false,
          items: [
            {
              title: this.$t('receipt'),
              icon: '',
              id: 1,
              items: [
                {
                  title: this.$t('newReceipt'),
                  icon: markRaw(NewReceiptIcon),
                  id: 1,
                  items: [],
                  link: '/warehouse/receipts/new'
                },
                {
                  title: this.$t('receiptList'),
                  icon: markRaw(ReceiptListIcon),
                  id: 2,
                  items: [],
                  link: '/warehouse/remittance-and-receipt/receipts'
                }
              ]
            },
            {
              title: this.$t('remittance'),
              icon: '',
              id: 2,
              items: [
                {
                  title: this.$t('newRemittance'),
                  icon: markRaw(NewReceiptIcon),
                  id: 1,
                  items: [],
                  link: '/warehouse/remittances/new'
                },
                {
                  title: this.$t('remittanceList'),
                  icon: markRaw(ReceiptListIcon),
                  id: 2,
                  items: [],
                  link: '/warehouse/remittance-and-receipt/remittances'
                }
              ]
            },
            {
              title: this.$t('definitions'),
              icon: markRaw(AnbarIcon),
              id: 3,
              items: [
                {
                  title: this.$t('warehouses'),
                  icon: 'mdi mdi-warehouse',
                  id: 1,
                  link: '/warehouse/list'
                },
                {
                  title: this.$t('products'),
                  icon: 'mdi mdi-shopping-outline',
                  id: 2,
                  link: '/warehouse/products'
                },
                {
                  title: this.$t('services'),
                  icon: 'mdi mdi-account-wrench-outline',
                  id: 3,
                  link: '/warehouse/services'
                },
                {
                  title: this.$t('productsAndServicesCategory'),
                  icon: 'mdi mdi-shape-outline',
                  id: 4,
                  link: '/warehouse/productsAndServicesCategory'
                }
              ]
            }
          ]
        },
        {
          title: this.$t('shopManagement'),
          icon: markRaw(AnbarIcon),
          id: 9,
          disabled: false,
          items: [
            {
              title: this.$t('discounts'),
              icon: '',
              id: 1,
              items: [
                {
                  title: this.$t('newDiscount'),
                  icon: 'mdi mdi-cash-minus',
                  id: 1,
                  items: [],
                  link: '/shop/discount/new'
                },
                {
                  title: this.$t('discountList'),
                  icon: 'mdi mdi-cash-minus',
                  id: 2,
                  items: [],
                  link: '/shop/discounts'
                },
              ]
            },
            {
              title: this.$t('settings'),
              icon: '',
              id: 2,
              items: [
                {
                  title: this.$t('shopSetting'),
                  icon: 'mdi-cog',
                  link: '/setting/shopSetting',
                  id: 1
                },
              ]
            }
          ]
        },
        {
          title: this.$t('support'),
          icon: 'mdi mdi-face-agent',
          id: 8,
          disabled: true,
          items: [
            {
              title: this.$t('factor'),
              icon: '',
              id: 1,
              items: [
                {
                  title: this.$t('ticket'),
                  icon: 'mdi mdi-ticket',
                  id: 1,
                  link: '/support/ticket'
                },
                {
                  title: this.$t('newTickets'),
                  icon: 'mdi mdi-ticket-account',
                  id: 2,
                  link: '/support/ticket/newTicket'
                }
              ]
            }
            // { title: this.$t('ticket'), icon: 'mdi mdi-ticket', id: 1, link: '/support/ticket' },
            // {
            //   title: this.$t('newTickets'),
            //   icon: 'mdi mdi-ticket-account',
            //   id: 2,
            //   link: '/support/supportTicket'
            // }
          ]
        },

        // {
        //   title:this.$t('purchase'),
        //   icon:markRaw(SaleIcon),
        //   id: 6,
        //   items:[
        //     {title: this.$t('purchaseInvoice'), icon:'mdi-note-multiple-outline mdi-flip-h' , id: 6, link:'/purchase/purchaseInvoice'},
        //      {
        //       title: this.$t('purchaseInvoices'),
        //       icon: 'mdi-note-multiple-outline mdi-flip-h',
        //       id: 6,
        //       link: '/purchase/purchaseInvoices'
        //     }
        //   ]
        // },

        // { title: this.$t('users'), icon: 'mdi mdi-account-supervisor', id: 9, link: '/users' },
        // {
        //   title: this.$t('management'),
        //   icon: 'mdi mdi-security',
        //   id: 10,
        //   items: [
        //     {
        //       title: this.$t('permissions'),
        //       icon: 'mdi mdi-security-network',
        //       link: '/manage/permissions',
        //       id: 1
        //     },
        //     {
        //       title: this.$t('companies'),
        //       icon: 'mdi mdi-domain',
        //       link: '/manage/companies',
        //       id: 2
        //     },
        //     {
        //       title: this.$t('tutorial'),
        //       icon: 'mdi mdi-lifebuoy',
        //       link: '/manage/tutorial',
        //       id: 3
        //     }
        //   ]
        // },
        {
          title: this.$t('settings'),
          icon: 'mdi-cog',
          id: -1,
          items: [
            // {
            //   title: this.$t('settings'),
            //   icon: 'mdi mdi-cogs',
            //   link: '/setting',
            //   id: 1
            // },

            {
              title: this.$t('users'),
              icon: 'mdi mdi-account-supervisor',
              link: '/setting/users',
              id: 2
            },
            {
              icon: 'mdi mdi-file-document-multiple-outline',
              id: -1,
              items: [
                {
                  title: this.$t('generalSettings'),
                  icon: 'mdi mdi-cog-outline',
                  link: '/setting/generalSetting',
                  id: 3
                },
                {
                  title: this.$t('accountingSetting'),
                  icon: markRaw(RightMenuHesabdari),
                  link: '/setting/accountingSetting',
                  id: 4
                },
                // {
                //   title: this.$t('receiveAndPaySetting'),
                //   icon: markRaw(RightMenuCheckOBank),
                //   link: '/setting/receiveAndPaySetting',
                //   id: 5
                // },
                {
                  title: this.$t('remittanceOrReceiptSetting'),
                  icon: markRaw(AnbarIcon),
                  link: '/setting/remittanceOrReceiptSetting',
                  id: 6
                },
                {
                  title: this.$t('salesAndPurchaseSetting'),
                  icon: markRaw(SaleIcon),
                  link: '/setting/salesAndPurchaseSetting',
                  id: 7
                },
                {
                  title: this.$t('templateSetting'),
                  icon: 'mdi mdi-brush-variant',
                  link: '/setting/templateSetting',
                  id: 8
                },
                {
                  title: this.$t('currencySetting'),
                  icon: 'mdi mdi-currency-rial',
                  link: '/setting/currencySetting',
                  id: 9
                }
              ]
            }
          ]
        }
        // {
        //   title: this.$t('tools'),
        //   icon: 'mdi-tools',
        //   id: 11, // شناسه منحصر به فرد (از شناسه‌های موجود استفاده نکنید)
        //   items: [
        //     {
        //       title: 'excelViewer',
        //       icon: 'mdi-file-excel',
        //       id: 1,
        //       link: '/tools/excel-viewer'
        //     }
        //     // می‌توانید در آینده ابزارهای دیگر را اینجا اضافه کنید
        //   ]
        // }
      ]

      if (this.formulaItems?.length > 0)
        items
          ?.find((i) => i.id == 3)
          ?.items.push({
            title: this.$t('customReports'),
            icon: 'mdi-chart-box-outline',
            id: 4,
            items: this.formulaItems.map((element, index) => ({
              title: element.name,
              icon: markRaw(ProfitAndLossIcon),
              id: 20 + index,
              link: `/accounting/formulaReport/${element.id}`
            }))
          })

      this.setMenuItems(items)

      return items.filter((item) => {
        if (item.disabled) {
          return false
        }

        return (
          utils.filterBySearch(this.searchText, ['title'], item) ||
          this.checkSubItemSearch(item) ||
          this.checkNestedSubItemSearch(item)
        )
      })

      // return items.filter(
      //   (a) =>
      //     utils.filterBySearch(this.searchText, ['title'], a) ||
      //     this.checkSubItemSearch(a) ||
      //     this.checkNestedSubItemSearch(a)
      // )
    }
  },
  watch: {
    selectedItem(value, oldValue) {
      if (value?.items?.length > 0) {
        value.items.forEach((item) => {
          item.showChildren = false
        })
      }
      if (oldValue != value && this.selectedSubItem) this.selectedSubItem = null
      if (value && this.$vuetify.display.smAndDown) this.isMenuExpanded = false
    },
    selectedSubItem(value) {
      if (value && this.$vuetify.display.smAndDown) {
        this.isSubMenuExpanded = false
        this.isMenuExpanded = false
      } else this.isSubMenuExpanded = true
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setDrawer: 'setDrawer',
      setNewTab: 'setNewTab',
      setActiveTab: 'setActiveTab',
      getActiveTabIndex: 'getActiveTabIndex',
      closeTab: 'closeTab',
      initializeFlatMenu: 'initializeFlatMenu',
      setMenuItems: 'setMenuItems'
    }),
    checkSubItemSearch(item) {
      if (item.items?.length > 0) {
        return item.items.some((z) => utils.filterBySearch(this.searchText, ['title'], z))
      } else return false
    },
    checkNestedSubItemSearch(item) {
      let output = false
      if (item.items?.length > 0) {
        item.items.forEach((element) => {
          if (
            element.items?.length > 0 &&
            element.items.some((x) => utils.filterBySearch(this.searchText, ['title'], x))
          ) {
            output = true
            return
          }
        })
        return output
      } else return false
    },
    changeSearch(value) {
      this.searchText = value
      if (this.menuItems.length > 0) this.selectItem(this.menuItems[0], true)
      else this.selectedItem = null
    },
    openMenu() {
      this.isMenuExpanded = !this.isMenuExpanded
      this.setDrawer(this.isMenuExpanded)
    },
    closeMenu() {
      this.selectedItem = false
      this.isMenuExpanded = this.drawerExpanded
      this.isMenuHide = true
    },
    openMenuAndroid() {
      this.isMenuExpanded = true
      this.isMenuHide = false
    },
    hideMenu() {
      this.isMenuExpanded = this.drawerExpanded
      this.isMenuHide = true
      this.selectedItem = null
    },
    CloseSubMenu() {
      this.isMenuExpanded = this.drawerExpanded
      this.selectedItem = null
    },
    CloseNestedSubMenu() {
      this.selectedSubItem = null
    },
    selectItem(item, isFromSearch) {
      if (item.link) this.closeMenu()
      else {
        if (!isFromSearch && this.selectedItem && this.selectedItem.id == item.id)
          this.selectedItem = null
        else this.selectedItem = this.menuItems.filter((a) => a.id == item.id)[0]
      }
    },
    selectSubItem(item) {
      if (item.link) this.closeMenu()
      else this.selectedSubItem = this.selectedItem.filter((a) => a.id == item.id)[0]
    },
    logout() {
      Auth.logOut()
      this.clearTabs()
      this.$router.push('/login')
    },
    checkMoreThan2modifiers(event, modifiers) {
      const modifierKeys = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey
      }
      var trues = []
      for (const [key, value] of Object.entries(modifierKeys)) {
        trues.push(value == true ? key : '')
      }
      if (trues.includes(modifiers[0]) && trues.includes(modifiers[1])) {
        trues = []
        return true
      }
    },
    handleKeydown(event) {
      for (let shortcut of this.shortcuts) {
        var splittedVal = shortcut.shortcut.split('+').map((x) => x.trim()?.toLowerCase())
        var a = this.checkModifiers(
          event,
          splittedVal.filter((x) => x == 'ctrl' || x == 'shift' || x == 'alt')
        )
        if (a && event.key.toLowerCase() === splittedVal[splittedVal.length - 1].toLowerCase()) {
          event.preventDefault()
          const func = shortcut.action
          if (func && typeof func === 'function') func()
        }
      }

      if (event.ctrlKey) {
        // Check if active element or any parent has v-overlay__content class
        const activeElement = document.activeElement
        const hasOverlayParent = activeElement?.closest('.v-overlay__content')
        
        if (hasOverlayParent) return
        
        let idx = this.getActiveTabIndex()        
        if (idx < 0) return
        //handle switching between tabs
        switch (event.keyCode) {
          //right arrow key
          case 39:
            this.setActiveTab(idx - 1)
            break
          //left arrow key
          case 37:
            this.setActiveTab(idx + 1)
            break
        }
      }
    },
    checkModifiers(event, modifiers) {
      const modifierKeys = {
        ctrl: event.ctrlKey,
        alt: event.altKey,
        shift: event.shiftKey
      }
      let result = true
      for (const [key, value] of Object.entries(modifierKeys)) {
        if ((!modifiers.includes(key) && value) || (modifiers.includes(key) && !value)) {
          result = false
        }
      }
      return result
    },
    async getFormulas() {
      const res = await FormulaService.getAll()
      if (res.isSuccess) this.formulaItems = res.value.result
    }
  },
  async mounted() {
    this.isMenuExpanded = this.drawerExpanded
    this.getFormulas()
    // const res = await reportService.getProcedures()
    // if (res.isSuccess) {
    //   this.reportProcedures = res.value.filter(proc =>
    //     proc.ProcedureName.endsWith('Report')
    //   )
    // }

    document.addEventListener('keydown', this.handleKeydown)

    // settingService.getDashboardSetting().then((res) => {
    //   if (res.isSuccess) {
    //     var sList = JSON.parse(res.entity.shortcuts)
    //     sList.forEach((item, index) => {
    //       let i = this.shortcuts.findIndex((x) => x.title === item.title)
    //       if (this.shortcuts[i]) {
    //         this.shortcuts[i].shortcut = item.shortcut
    //       }
    //     })
    //   } else this.setErrorMessage(res.message)
    // })
  },
  beforeDestroy() {
    document.addEventListener('keydown', this.handleKeydown)
  },
  components: {
    Loading,
    RightMenu,
    RightSubMenu,
    RightNestedSubMenu,
    DesktopTopBar,
    AndroidTopBar,
    AndroidSearchBar,
    DesktopStatusBar,
    BreadCrumb,
    Tabs
  }
}
</script>

<template>
  <loading :loading="sLoading" />
  <div class="main-container">
    <div class="main-body bg-container">
      <right-menu
        :isMenuExpanded="isMenuExpanded"
        :menuIcon="menuIcon"
        :isMenuHide="isMenuHide"
        :companyDetails="companyDetails"
        :menuItems="menuItems"
        :selectedItem="selectedItem"
        @openMenu="openMenu"
        @hideMenu="hideMenu"
        @closeMenu="closeMenu"
        @selectItem="selectItem"
        @logout="logout"
        @changeSearch="changeSearch"
      ></right-menu>
      <transition name="subitem" mode="out-in">
        <right-sub-menu
          v-if="selectedItem"
          :isSubMenuExpanded="isSubMenuExpanded"
          :selectedItem="selectedItem"
          :selectedSubItem="selectedSubItem"
          :searchText="searchText"
          @CloseSubMenu="CloseSubMenu"
          @closeMenu="closeMenu"
        />
      </transition>
      <div
        @click="hideMenu"
        :class="[
          'left-content',
          isMenuExpanded ? 'left-content-expanded' : '',
          selectedItem ? 'left-content-sub-expanded' : '',
          isMenuHide ? '' : 'left-content-sub-expanded'
        ]"
      >
        <!-- <desktop-top-bar :pageTitle="pageTitle" /> -->
        <android-top-bar
          :pageTitle="pageTitle"
          @openMenuAndroid="openMenuAndroid"
          :menuIcon="menuIcon"
        />
        <!-- <bread-crumb /> -->
        <div class="tab-section">
          <Tabs />
          <slot />
        </div>
      </div>
    </div>
    <desktop-status-bar />
  </div>
</template>
<style>
@media only screen and (max-width: 960px) {
  .tab-section {
    margin-top: 45px !important;
  }
}
.tab-section {
  height: 100%;
  overflow: hidden;
}
</style>
