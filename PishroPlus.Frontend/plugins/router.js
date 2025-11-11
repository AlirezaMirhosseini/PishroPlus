import { createRouter, createWebHistory } from 'vue-router'
import { markRaw, ref, shallowRef, shallowReactive } from 'vue'
import Auth from './auth'
import defaultLayout from '../src/layouts/default-layout.vue'
import emptyLayout from '../src/layouts/empty-layout.vue'
import { defaultStore } from '../src/stores/default'
import i18n from './vue-i18n'
import Login from '../src/pages/login/login.vue'
import About from '../src/pages/about/index.vue'
import Users from '../src/pages/panel/users/index.vue'
import Accounts from '../src/pages/panel/accounts/index.vue'
import Dashboard from '../src/pages/dashboard/dashboard.vue'
import managePermissions from '../src/pages/manage/permissions.vue'
import manageCompanies from '../src/pages/manage/companies.vue'
import setting from '../src/pages/setting/setting.vue'
import users from '../src/pages/users/users.vue'
import userPermissions from '../src/pages/users/userPermissions.vue'
import notFound from '../src/pages/errors/notFound404.vue'
import serverUnavailable from '../src/pages/errors/serverUnavailable503.vue'
import inputModules from '../src/pages/modules/inputModules.vue'
import ticket from '../src/pages/support/ticket.vue'
import supportTicket from '../src/pages/support/supportTicket.vue'
import newTicket from '../src/pages/support/newTicket.vue'
import ticketChat from '../src/pages/support/ticketChat.vue'
import supportTicketChat from '../src/pages/support/supportTicketChat.vue'
// import accountingEasyAccess from '../src/pages/accounting/accountingEasyAccess.vue'
import accountingTreeView from '../src/pages/accounting/definitions/treeViewAccounts.vue'
import detailedAccountsTreeView from '../src/pages/accounting/definitions/treeViewDetailedAccounts.vue'
import registerAccountingVoucher from '../src/pages/accounting/register/registerVoucher.vue'
import reviewAccounts from '../src/pages/accounting/reports/reviewAccounts.vue'
import voucherJournal from '../src/pages/accounting/reports/voucherJournal.vue'
import vouchersList from '../src/pages/accounting/VouchersList.vue'
import tutorial from '../src/pages/manage/tutorial.vue'
import newTutorial from '../src/pages/manage/newTutorial.vue'
import companyUsers from '../src/pages/setting/users.vue'
import companyUserPermissions from '../src/pages/setting/userPermissions.vue'
import persons from '../src/pages/persons/persons.vue'
import addPerson from '../src/pages/persons/addPerson.vue'
import personsCategory from '../src/pages/persons/personsCategory.vue'
// import personsEasyAccess from '../src/pages/persons/personsEasyAccess.vue'
import registerTransferAccount from '../src/pages/transfer/account/registerAccount.vue'
import transferCategory from '../src/pages/transfer/account/categoryList.vue'
// import transferEasyAccess from '../src/pages/transfer/transferEasyAccess.vue'
import checkBookList from '../src/pages/transfer/checkBook/checkBookList.vue'
import addCheckBook from '../src/pages/transfer/checkBook/addCheckBook.vue'
import payOrReceiveList from '../src/pages/transfer/payOrReceive/payOrReceiveList.vue'
import payOrReceiveWizard from '../src/pages/transfer/payOrReceive/wizard.vue'
// import warehouseEasyAccess from '../src/pages/warehouse/warehouseEasyAccess.vue'
import warehouseList from '../src/pages/warehouse/definitions/warehouseList.vue'
import products from '../src/pages/warehouse/definitions/products.vue'
import productsAndServicesGroups from '../src/pages/warehouse/definitions/productsAndServicesGroups.vue'
import newProduct from '../src/pages/warehouse/definitions/newProduct.vue'
import saleDetailed from '../src/pages/sales/[id].vue'
import sales from '../src/pages/sales/sales.vue'
import returnFromSales from '../src/pages/sales/returnFromSales.vue'
import returnFromPurchases from '../src/pages/purchase/returnFromPurchases.vue'
import returnSalesList from '../src/pages/sales/returnSalesList.vue'
import returnPurchasesList from '../src/pages/purchase/returnPurchasesList.vue'
import quickInvoice from '../src/pages/sales/quickInvoice.vue'
import newRemittances from '../src/pages/remittances/newRemittances.vue'
import remittanceOrReceipt from '../src/pages/remittances/remittanceOrReceipt.vue'
import newReceipts from '../src/pages/remittances/newReceipts.vue'
// import salesEasyAccess from '../src/pages/sales/salesEasyAccess.vue'
// import supportEasyAccess from '../src/pages/support/supportEasyAccess.vue'
import newPurchase from '../src/pages/purchase/newPurchase.vue'
import purchaseInvoices from '../src/pages/purchase/purchaseInvoices.vue'
// import purchaseEasyAccess from '../src/pages/purchase/purchaseEasyAccess.vue'
import productDetails from '../src/pages/warehouse/definitions/productDetails.vue'
import profitLossReport from '../src/pages/accounting/reports/profitLossReport.vue'
import generalSetting from '../src/pages/setting/generalSetting.vue'
import accountingSetting from '../src/pages/setting/accountingSetting.vue'
import receiveAndPaySetting from '../src/pages/setting/reveiveAndPaySetting.vue'
import remittanceOrReceiptSetting from '../src/pages/setting/remittanceOrReceiptSetting.vue'
import salesAndPurchaseSetting from '../src/pages/setting/salesAndPurchaseSetting.vue'
// import salesSetting from '../src/pages/setting/salesSetting.vue'
// import purchaseSetting from '../src/pages/setting/purchaseSetting.vue'
import templateSetting from '../src/pages/setting/templateSetting.vue'
import shopSetting from '../src/pages/setting/shopSetting.vue'
import currencySetting from '../src/pages/setting/currencySetting.vue'
import userProfile from '../src/components/layoutComponents/userProfile.vue'
import ReportBuilder from '../src/pages/reports/reportBuilder.vue'
import allAccountLedgerReport from '../src/pages/accounting/reports/allAccountLedgerReport.vue'
import AccountLedgerReport from '../src/pages/accounting/reports/accountLedgerReport.vue'
import JournalLedgerReport from '../src/pages/accounting/reports/journalLedgerReport.vue'
import AllDetailedAccountLedgerReport from '../src/pages/accounting/reports/allDetailedAccountLedgerReport.vue'
import DetailedAccountLedgerReport from '../src/pages/accounting/reports/detailedAccountLedgerReport.vue'
import BalanceSheet from '../src/pages/accounting/reports/balanceSheet.vue'
import FormulaReport from '../src/pages/accounting/reports/formulaReport.vue'
import ExcelViewer from '../src/pages/tools/excelViewer.vue'
import discount from '../src/pages/shop/discount.vue'
import discountList from '../src/pages/shop/discountList.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: Dashboard,
    meta: {
      layout: defaultLayout,
      noBreadCrumb: true,
      activeRoute: 1,
      closableTab: false,
      tabName: 'dashboard'
    }
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      layout: emptyLayout,
      notShow: true,
      preventTab: true,
      tabName: 'login'
    }
  },
  {
    path: '/manage/permissions',
    name: 'permissions',
    component: managePermissions,
    meta: { layout: defaultLayout, activeRoute: 10, tabName: 'permissions' }
  },
  {
    path: '/manage/companies',
    name: 'companies',
    component: manageCompanies,
    meta: { layout: defaultLayout, activeRoute: 10, tabName: 'companies' }
  },
  {
    path: '/manage/tutorial',
    name: 'tutorial',
    component: tutorial,
    meta: { layout: defaultLayout, activeRoute: 10, tabName: 'tutorial' }
  },
  {
    path: '/manage/tutorial/new/:isEdit/:id',
    name: 'newTutorial',
    component: newTutorial,
    meta: {
      layout: defaultLayout,
      activeRoute: 10,
      notShow: true,
      tabName: 'newTutorial',
      secureRefresh: true,
      parents: [{ name: 'tutorial', url: '/manage/tutorial' }]
    }
  },
  {
    path: '/setting',
    name: 'settings',
    component: setting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'settings' }
  },
  {
    path: '/setting/generalSetting',
    name: 'generalSetting',
    component: generalSetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'generalSettings' }
  },
  {
    path: '/setting/accountingSetting',
    name: 'accountingSetting',
    component: accountingSetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'accountingSetting' }
  },
  {
    path: '/setting/receiveAndPaySetting',
    name: 'receiveAndPaySetting',
    component: receiveAndPaySetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'receiveAndPaySetting' }
  },
  {
    path: '/setting/users',
    name: 'companyUsers',
    component: companyUsers,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'companyUsers' }
  },
  {
    path: '/setting/users/permissions/:userId',
    name: 'companyUserPermissions',
    component: companyUserPermissions,
    meta: {
      layout: defaultLayout,
      activeRoute: -1,
      tabName: 'companyUserPermissions',
      parents: [{ name: 'companyUsers', url: '/setting/users' }]
    }
  },
  {
    path: '/setting/remittanceOrReceiptSetting',
    name: 'remittanceOrReceiptSetting',
    component: remittanceOrReceiptSetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'remittanceOrReceiptSetting' }
  },
  {
    path: '/setting/salesAndPurchaseSetting',
    name: 'salesAndPurchaseSetting',
    component: salesAndPurchaseSetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'salesAndPurchaseSetting' }
  },
  // {
  //   path: '/setting/salesSetting',
  //   name: 'salesSetting',
  //   component: salesSetting,
  //   meta: { layout: defaultLayout, activeRoute: -1, tabName: 'salesSetting' }
  // },
  // {
  //   path: '/setting/purchaseSetting',
  //   name: 'purchaseSetting',
  //   component: purchaseSetting,
  //   meta: { layout: defaultLayout, activeRoute: -1, tabName: 'purchaseSetting' }
  // },
  {
    path: '/setting/templateSetting',
    name: 'templateSetting',
    component: templateSetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'templateSetting' }
  },
  {
    path: '/setting/shopSetting',
    name: 'shopSetting',
    component: shopSetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'shopSetting' }
  },
  {
    path: '/setting/currencySetting',
    name: 'currencySetting',
    component: currencySetting,
    meta: { layout: defaultLayout, activeRoute: -1, tabName: 'currencySetting' }
  },
  {
    path: '/users',
    name: 'users',
    component: users,
    meta: { layout: defaultLayout, activeRoute: 9, tabName: 'users' }
  },

  // {
  //   path: '/persons',
  //   name: 'persons',
  //   component: personsEasyAccess,
  //   meta: { layout: defaultLayout, activeRoute: 2, tabName: 'persons', easyAccess: true }
  // },
  {
    path: '/persons/list',
    name: 'personsList',
    component: persons,
    meta: {
      layout: defaultLayout,
      activeRoute: 2,
      tabName: 'personsList'
    }
  },
  {
    path: '/persons/new',
    name: 'addPerson',
    component: addPerson,
    meta: {
      layout: defaultLayout,
      activeRoute: 2,
      tabName: 'addPerson',
      secureRefresh: true,
      parents: [{ name: 'personsList', url: '/persons/list' }]
    }
  },
  {
    path: '/persons/:id',
    name: 'editPerson',
    component: addPerson,
    meta: {
      layout: defaultLayout,
      activeRoute: 2,
      tabName: 'editPerson',
      secureRefresh: true,
      parents: [
        { name: 'persons', url: '/persons' },
        { name: 'personsList', url: '/persons/list' }
      ]
    }
  },
  {
    path: '/persons/category',
    name: 'personsCategory',
    component: personsCategory,
    meta: {
      layout: defaultLayout,
      activeRoute: 2,
      tabName: 'personsCategory',
      parents: [{ name: 'persons', url: '/persons' }]
    }
  },
  // {
  //   path: '/transfer',
  //   name: 'receiveAndPay',
  //   component: transferEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 2,
  //     tabName: 'personsCategory',
  //     parents: [{ name: 'persons', url: '/persons' }]
  //   }
  // },
  // {
  //   path: '/transfer',
  //   name: 'receiveAndPay',
  //   component: transferEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 4,
  //     tabName: 'receiveAndPay'
  //   }
  // },
  {
    path: '/transfer/registerAccount/:type',
    name: 'registerAccount',
    component: registerTransferAccount,
    meta: {
      layout: defaultLayout,
      activeRoute: 4,
      tabName: 'registerAccount',
      parents: [{ name: 'receiveAndPay', url: '/transfer' }]
    }
  },
  {
    path: '/transfer/category',
    name: 'transferCategory',
    component: transferCategory,
    meta: {
      layout: defaultLayout,
      activeRoute: 4,
      tabName: 'transferCategory',
      parents: [{ name: 'receiveAndPay', url: '/transfer' }]
    }
  },
  {
    path: '/transfer/checkBookList',
    name: 'checkBookList',
    component: checkBookList,
    meta: {
      layout: defaultLayout,
      activeRoute: 4,
      tabName: 'checkBookList',
      parents: [{ name: 'receiveAndPay', url: '/transfer' }]
    }
  },
  {
    path: '/transfer/addCheckBook/:id',
    name: 'addCheckBook',
    component: addCheckBook,
    meta: {
      layout: defaultLayout,
      activeRoute: 4,
      secureRefresh: true,
      tabName: 'addCheckBook',
      parents: [{ name: 'receiveAndPay', url: '/transfer' }]
    }
  },
  {
    path: '/transfer/payOrReceiveList/:type',
    name: 'receiveList',
    component: payOrReceiveList,
    meta: {
      layout: defaultLayout,
      activeRoute: 4,
      tabName: 'receiveList',
      parents: [{ name: 'receiveAndPay', url: '/transfer' }]
    }
  },
  // {
  //   path: '/transfer/payOrReceiveList/pay',
  //   name: 'payList',
  //   component: payOrReceiveList,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 4,
  //     tabName: 'payList',
  //     parents: [{ name: 'receiveAndPay', url: '/transfer' }]
  //   }
  // },
  {
    path: '/transfer/wizard/:id/:type',
    name: 'wizard',
    component: payOrReceiveWizard,
    meta: {
      layout: defaultLayout,
      activeRoute: 4,
      tabName: 'receiveAndPay',
      secureRefresh: true,
      parents: [
        { name: 'receiveAndPay', url: '/transfer' },
        { name: 'payOrReceiveList', url: '/transfer/payOrReceiveList/receive' }
      ]
    }
  },
  // {
  //   path: '/transfer/wizard/:id/pay',
  //   name: 'registerPay',
  //   component: payOrReceiveWizard,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 4,
  //     tabName: 'registerPay',
  //     parents: [
  //       { name: 'receiveAndPay', url: '/transfer' },
  //       { name: 'payOrReceiveList', url: '/transfer/payOrReceiveList/receive' }
  //     ]
  //   }
  // },
  // {
  //   path: '/warehouse',
  //   name: 'warehouseManagement',
  //   component: warehouseEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 5,
  //     tabName: 'warehouseManagement'
  //   }
  // },
  {
    path: '/warehouse/list',
    name: 'warehouses',
    component: warehouseList,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'warehouses',
      parents: [{ name: 'warehouseManagement', url: '/warehouse' }]
    }
  },
  {
    path: '/warehouse/:type',
    name: 'products',
    component: products,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: null,
      parents: [{ name: 'warehouseManagement', url: '/warehouse' }]
    }
  },
  // {
  //   path: '/warehouse/:type',
  //   name: 'services',
  //   component: products,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 5,
  //     tabName: nu,
  //     parents: [{ name: 'warehouseManagement', url: '/warehouse' }]
  //   }
  // },
  {
    path: '/warehouse/productsAndServicesCategory',
    name: 'productsAndServicesCategory',
    component: productsAndServicesGroups,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'productsAndServicesCategory',
      secureRefresh: true,
      parents: [{ name: 'warehouseManagement', url: '/warehouse' }]
    }
  },
  {
    path: '/warehouse/products/new',
    name: 'newProduct',
    component: newProduct,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'newProduct',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'products', url: '/warehouse/products' }
      ]
    }
  },
  {
    path: '/warehouse/products/:id',
    name: 'editProduct',
    component: newProduct,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'editProduct',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'products', url: '/warehouse/products' }
      ]
    }
  },
  {
    path: '/warehouse/services/new',
    name: 'newService',
    component: newProduct,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'newService',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'services', url: '/warehouse/services' }
      ]
    }
  },
  {
    path: '/warehouse/services/:id',
    name: 'editService',
    component: newProduct,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'editService',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'services', url: '/warehouse/services' }
      ]
    }
  },
  {
    path: '/users/permissions/:userId',
    name: 'userPermissions',
    component: userPermissions,
    meta: {
      layout: defaultLayout,
      notShow: true,
      activeRoute: 9,
      tabName: 'userPermissions',
      parents: [{ name: 'users', url: '/users' }]
    }
  },
  // {
  //   path: '/accounting',
  //   name: 'accounting',
  //   component: accountingEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     tabName: 'accounting',
  //     activeRoute: 3
  //   }
  // },
  // {
  //   path: '/sale',
  //   name: 'sale',
  //   component: salesEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 3,
  //     tabName: 'sale'
  //   }
  // },
  // {
  //   path: '/support',
  //   name: 'support',
  //   component: supportEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 3,
  //     tabName: 'support'
  //   }
  // },
  {
    path: '/accounting/treeView',
    name: 'accountingTreeView',
    component: accountingTreeView,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'accountingTreeView',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/profitLossReport',
    name: 'profitLossReport',
    component: profitLossReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'profitLossReport',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/detailedAccountsTreeView',
    name: 'detailedAccountsTreeView',
    component: detailedAccountsTreeView,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'detailedAccountsTreeView',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/vouchers',
    name: 'vouchersList',
    component: vouchersList,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'vouchersList',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/registerVoucher/:isEdit/new',
    name: 'registerAccountingVoucher',
    component: registerAccountingVoucher,
    meta: {
      needWarningForClose: true,
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'registerAccountingVoucher',
      secureRefresh: true,
      parents: [
        { name: 'accounting', url: '/accounting' },
        { name: 'vouchersList', url: '/accounting/vouchers' }
      ]
    }
  },
  {
    path: '/accounting/registerVoucher/:isEdit/:id',
    name: 'editAccountingVoucher',
    component: registerAccountingVoucher,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'editAccountingVoucher',
      secureRefresh: true,
      parents: [
        { name: 'accounting', url: '/accounting' },
        { name: 'vouchersList', url: '/accounting/vouchers' }
      ]
    }
  },
  {
    path: '/accounting/registerVoucher/view/:id',
    name: 'viewAccountingVoucher',
    component: registerAccountingVoucher,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'viewAccountingVoucher',
      secureRefresh: true,
      parents: [
        { name: 'accounting', url: '/accounting' },
        { name: 'vouchersList', url: '/accounting/vouchers' }
      ]
    }
  },
  {
    path: '/accounting/allAccountLedgerReport',
    name: 'allAccountLedgerReport',
    component: allAccountLedgerReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'reviewAccounts',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/allDetailedAccountLedgerReport',
    name: 'allDetailedAccountLedgerReport',
    component: AllDetailedAccountLedgerReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'allDetailedAccountLedgerReport',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/allAccountLedgerReport/single',
    name: 'accountLedgerReport',
    component: AccountLedgerReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'reviewAccount',
      parents: [{ name: 'accounting', url: '/accounting/allAccountLedgerReport' }]
    }
  },
  {
    path: '/accounting/allDetailedAccountLedgerReport/single',
    name: 'detailedAccountLedgerReport',
    component: DetailedAccountLedgerReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'reviewDetailedAccount',
      parents: [{ name: 'accounting', url: '/accounting/allDetailedAccountLedgerReport' }]
    }
  },
  {
    path: '/accounting/reviewAccounts',
    name: 'reviewAccounts',
    component: reviewAccounts,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'reviewAccounts',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/voucherJournal',
    name: 'voucherJournal',
    component: JournalLedgerReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'voucherJournal',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/balanceSheet',
    name: 'balanceSheet',
    component: BalanceSheet,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'balanceSheet',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  {
    path: '/accounting/formulaReport/:id',
    name: 'report',
    component: FormulaReport,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'report',
      parents: [{ name: 'accounting', url: '/accounting' }]
    }
  },
  // {
  //   path: '/accounting/voucherJournal',
  //   name: 'voucherJournal',
  //   component: voucherJournal,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 3,
  //     tabName: 'voucherJournal',
  //     parents: [{ name: 'accounting', url: '/accounting' }]
  //   }
  // },

  {
    path: '/sales/new',
    name: 'newSale',
    component: saleDetailed,
    meta: {
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'newSale',
      secureRefresh: true,
      parents: [{ name: 'sale', url: '/sales' }]
    }
  },
  {
    path: '/sales/:id',
    name: 'viewInvoice',
    component: saleDetailed,
    meta: {
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'viewInvoice',
      secureRefresh: true,
      parents: [{ name: 'sale', url: '/sales' }]
    }
  },
  {
    path: '/sales/return/:id',
    name: 'returnFromSales',
    component: returnFromSales,
    meta: {
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'returnFromSales',
      secureRefresh: true,
      parents: [{ name: 'sale', url: '/sales' }]
    }
  },
  {
    path: '/sales/quick',
    name: 'quickInvoice',
    component: quickInvoice,
    meta: {
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'quickInvoice',
      secureRefresh: true,
      parents: [{ name: 'sale', url: '/sales' }]
    }
  },
  {
    path: '/sales',
    name: 'saleList',
    component: sales,
    meta: {
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'saleList',
      parents: [{ name: 'sale', url: '/sales' }]
    }
  },
  {
    path: '/sales/returns',
    name: 'returnSalesList',
    component: returnSalesList,
    meta: {
      requiresAuth: true,
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'returnSalesList',
      parents: [{ name: 'sale', url: '/sales' }]
    }
  },
  {
    path: '/support/ticket',
    name: 'ticket',
    component: ticket,
    meta: {
      parents: [{ name: 'support', url: '/support' }],
      layout: defaultLayout,
      activeRoute: 8,
      tabName: 'ticket'
    }
  },
  {
    path: '/support/ticket/:id/:code',
    name: 'ticketChat',
    component: ticketChat,
    meta: {
      layout: defaultLayout,
      notShow: true,
      secureRefresh: true,
      activeRoute: 8,
      tabName: `ticketChat`,
      parents: [
        { name: 'support', url: '/support' },
        { name: 'ticket', url: '/support/ticket' }
      ]
    }
  },
  // {
  //   path: '/support/newTicket',
  //   name: 'newTickets',
  //   component: newTicket,
  //   meta: {
  //     layout: defaultLayout, activeRoute: 8,
  //     parents: [{ name: 'support', url: '/support' },
  //     { name: 'ticket', url: '/support/ticket' }],
  //     tabName: 'newTickets'
  //   }
  // },
  // {
  //   path: '/support/newTicket/:id',
  //   name: 'newTickets',
  //   component: newTicket,
  //   meta: { layout: defaultLayout, activeRoute: 8, tabName: 'newTickets' }
  // },
  {
    path: '/support/supportTicket/:id/:code',
    name: 'supportTicketChat',
    component: supportTicketChat,
    meta: {
      layout: defaultLayout,
      notShow: true,
      secureRefresh: true,
      activeRoute: 8,
      tabName: 'supportTicketChat',
      parents: [
        { name: 'support', url: '/support' },
        { name: 'supportTicket', url: '/support/supportTicket' }
      ]
    }
  },
  {
    path: '/support/ticket/newTicket',
    name: 'newTicket',
    component: newTicket,
    meta: {
      layout: defaultLayout,
      notShow: true,
      secureRefresh: true,
      activeRoute: 8,
      tabName: 'newTicket',
      parents: [
        { name: 'support', url: '/support' },
        { name: 'ticket', url: '/support/ticket' }
      ]
    }
  },
  // {
  //   path: '/test/about',
  //   name: 'about',
  //   component: About,
  //   meta: { layout: defaultLayout, notShow: true }
  // },
  // { path: '/test/panel/users', name: 'panel-users', component: Users, meta: { notShow: true } },
  // {
  //   path: '/test/panel/accounts',
  //   name: 'panel-accounts',
  //   component: Accounts,
  //   meta: { layout: defaultLayout, notShow: true }
  // },
  // {
  //   path: '/test/modules/input',
  //   name: 'input-modules',
  //   component: inputModules,
  //   meta: { layout: defaultLayout, notShow: true }
  // },
  {
    path: '/:pathMatch(.*)*',
    name: 'pageNotFoundError',
    component: notFound,
    meta: { layout: defaultLayout, notShow: true, tabName: 'pageNotFoundError', preventTab: true }
  },
  // {
  //   path: '/notFound',
  //   name: 'pageNotFoundError',
  //   component: notFound,
  //   meta: { layout: defaultLayout, notShow: true, tabName: 'pageNotFoundError', preventTab: true }
  // },
  {
    path: '/503',
    name: 'serverUnavailableError',
    component: serverUnavailable,
    meta: { layout: defaultLayout, notShow: true, tabName: 'serverUnavailableError' }
  },
  {
    path: '/warehouse/remittance-and-receipt/:remittanceOrReceipt',
    name: 'remittanceOrReceipt',
    component: remittanceOrReceipt,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'remittanceOrReceipt',
      parents: [{ name: 'warehouseManagement', url: '/warehouse' }]
    }
  },
  {
    path: '/warehouse/remittances/new',
    name: 'newRemittance',
    component: newRemittances,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'newRemittance',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'remittanceList', url: '/warehouse/remittance-and-receipt/remittances' }
      ]
    }
  },
  {
    path: '/warehouse/remittances/:id',
    name: 'editRemittance',
    component: newRemittances,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'editRemittance',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'remittanceList', url: '/warehouse/remittance-and-receipt/remittances' }
      ]
    }
  },
  {
    path: '/warehouse/receipts/new',
    name: 'newReceipt',
    component: newReceipts,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'newReceipt',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'receiptList', url: '/warehouse/remittance-and-receipt/receipts' }
      ]
    }
  },
  {
    path: '/warehouse/receipts/:id',
    name: 'editReceipt',
    component: newReceipts,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'editReceipt',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'receiptList', url: '/warehouse/remittance-and-receipt/receipts' }
      ]
    }
  },
  {
    path: '/warehouse/productDetails/:id',
    name: 'productDetails',
    component: productDetails,
    meta: {
      layout: defaultLayout,
      activeRoute: 5,
      tabName: 'productDetails',
      secureRefresh: true,
      parents: [
        { name: 'warehouseManagement', url: '/warehouse' },
        { name: 'products', url: '/warehouse/products' }
      ]
    }
  },
  // {
  //   path: '/purchase',
  //   name: 'purchase',
  //   component: purchaseEasyAccess,
  //   meta: {
  //     layout: defaultLayout,
  //     activeRoute: 5,
  //     tabName: 'purchase'
  //   }
  // },
  {
    path: '/purchase/newPurchase',
    name: 'newPurchase',
    component: newPurchase,
    meta: {
      layout: defaultLayout,
      activeRoute: 6,
      tabName: 'newPurchase',
      secureRefresh: true,
      parents: [{ name: 'purchase', url: '/purchase' }]
    }
  },
  {
    path: '/purchase/:id',
    name: 'viewPurchase',
    component: newPurchase,
    meta: {
      layout: defaultLayout,
      activeRoute: 6,
      tabName: 'viewInvoice',
      secureRefresh: true,
      parents: [{ name: 'purchase', url: '/purchase' }]
    }
  },
  {
    path: '/purchase/purchaseInvoices',
    name: 'purchaseInvoices',
    component: purchaseInvoices,
    meta: {
      layout: defaultLayout,
      activeRoute: 6,
      tabName: 'purchaseInvoices',
      parents: [{ name: 'purchase', url: '/purchase' }]
    }
  },
  {
    path: '/purchase/returns',
    name: 'returnPurchasesList',
    component: returnPurchasesList,
    meta: {
      requiresAuth: true,
      layout: defaultLayout,
      activeRoute: 6,
      tabName: 'returnPurchasesList',
      parents: [{ name: 'purchase', url: '/purchase' }]
    }
  },
  {
    path: '/purchase/return/:id',
    name: 'returnFromPurchases',
    component: returnFromPurchases,
    meta: {
      layout: defaultLayout,
      activeRoute: 6,
      tabName: 'returnFromPurchases',
      secureRefresh: true,
      parents: [{ name: 'purchase', url: '/purchase' }]
    }
  },
  {
    path: '/userProfile',
    name: 'userProfile',
    component: userProfile,
    meta: {
      layout: defaultLayout,
      activeRoute: 7,
      tabName: 'userProfile',
      secureRefresh: true
      // parents: [{ name: 'purchase', url: '/purchase' }]
    }
  },
  {
    path: '/reportBuilder',
    name: 'reportBuilder',
    component: ReportBuilder,
    meta: {
      layout: defaultLayout,
      activeRoute: 3,
      tabName: 'Report',
      secureRefresh: true
    }
  },
  {
    path: '/tools/excel-viewer',
    name: 'excelViewer',
    component: ExcelViewer,
    meta: {
      requiresAuth: true,
      layout: defaultLayout,
      activeRoute: 11,
      tabName: 'excelViewer',
      title: 'excelViewer'
    }
  },
  {
    path: '/shop/discounts',
    name: 'discountList',
    component: discountList,
    meta: {
      layout: defaultLayout,
      activeRoute: 9,
      tabName: 'discountList',
      parents: [{ name: 'shopManagement', url: '/shop' }]
    }
  },
  {
    path: '/shop/discount/new',
    name: 'newDiscount',
    component: discount,
    meta: {
      layout: defaultLayout,
      activeRoute: 9,
      tabName: 'newDiscount',
      secureRefresh: true,
      parents: [
        { name: 'shopManagement', url: '/shop' },
        { name: 'discountList', url: '/shop/discounts' }
      ]
    }
  },
  {
    path: '/shop/discount/:id',
    name: 'editDiscount',
    component: discount,
    meta: {
      layout: defaultLayout,
      activeRoute: 9,
      tabName: 'editDiscount',
      secureRefresh: true,
      parents: [
        { name: 'shopManagement', url: '/shop' },
        { name: 'discountList', url: '/shop/discounts' }
      ]
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

const addTab = (to) => {
  if (window.location.pathname != '/') window.location = '/'
  var route = routes.filter((x) => x.name === to.name)[0]
  if (route) {
    const store = defaultStore()

    store.$state.tabs.forEach((t) => {
      if (!t.component) {
        const selectedRoute = routes.filter((x) => x.name === t.name)[0]
        if (selectedRoute) {
          t.component = markRaw(selectedRoute.component)
        }
      }
    })

    if (!route.meta.preventTab) {
      let closable = typeof route.meta.closableTab == 'boolean' ? route.meta.closableTab : true
      if (!closable && store.$state.tabs.some((x) => x.name === to.name)) {
      } else
        store.setNewTab({
          name: to.name,
          path: to.path,
          params: to.params,
          query: to.query,
          tabName: to.meta.tabName,
          secureRefresh: to.meta.secureRefresh,
          component: markRaw(route.component),
          closable: closable,
          easyAccess: to.meta.easyAccess
        })

      return to.path === '/'
    }
    return true
  } else return false
}

router.beforeEach((to, from, next) => {
  const store = defaultStore()

  store.helpStepperItem = []
  let res = addTab(to)

  // next()
  if (to.path !== '/login' && !Auth.loggedIn()) {
    document.title = i18n.global.t(to.name)
    store.pageTitle = to.name
    Auth?.logOut()
    if (res) next({ path: '/login' })
  } else if (to.path === '/login' && Auth.loggedIn()) {
    document.title = i18n.global.t(to.name)
    store.pageTitle = to.name
    if (res) next({ name: 'dashboard' })
  } else {
    document.title = i18n.global.t(to.name)
    store.pageTitle = to.name
    if (res) next()
  }
})
export default router
