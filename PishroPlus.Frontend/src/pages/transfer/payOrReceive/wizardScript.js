import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import transferStepper from '../../../components/baseComponents/transferStepper.vue'
import accountService from '../../../../api/account/accountService'
import detailedAccountService from '../../../../api/detailedAccount/detailedAccountService'
import invoiceService from '../../../../api/invoice/invoiceService'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import treeView from '../../../components/baseComponents/Treeview/treeview.vue'
import voucherService from '../../../../api/voucher/voucherService'
import transferService from '../../../../api/transfer/transferService'
import POSService from '../../../../api/POS/POSService'
import AccountSelector from '../../../components/accountsComponents/accountSelector.vue'
import PersonsIcon from '../../../components/icons/Persons.vue'
import selectDocumentsIcon from '../../../components/icons/CheckBook.vue'
import operationReportIcon from '../../../components/icons/OperationReport.vue'
import calendarIcon from '../../../components/icons/Calendar.vue'
import penIcon from '../../../components/icons/Pen.vue'
import paperIcon from '../../../components/icons/Paper.vue'
import moneyPlusIcon from '../../../components/icons/MoneyPlus.vue'
import utils from '../../../../plugins/utils'
import navTab from '../../../components/baseComponents/navTab.vue'
import AyandehIcon from '../../../components/icons/banks/Ayandeh.vue'
import deyIcon from '../../../components/icons/banks/dey.vue'
import eghtesadNovinIcon from '../../../components/icons/banks/eghtesadNovin.vue'
import toseeSaderaatIcon from '../../../components/icons/banks/toseeSaderaat.vue'
import mellatIcon from '../../../components/icons/banks/mellat.vue'
import sanatVaMadanIcon from '../../../components/icons/banks/sanatVaMadan.vue'
import iranZaminIcon from '../../../components/icons/banks/iranZamin.vue'
import karafarinIcon from '../../../components/icons/banks/karafarin.vue'
import keshavarziIcon from '../../../components/icons/banks/keshavarzi.vue'
import maskanIcon from '../../../components/icons/banks/maskan.vue'
import mehrIranIcon from '../../../components/icons/banks/mehrIran.vue'
import melalIcon from '../../../components/icons/banks/melal.vue'
import melliIcon from '../../../components/icons/banks/melli.vue'
import khavarMianehIcon from '../../../components/icons/banks/khavarMianeh.vue'
import noorIcon from '../../../components/icons/banks/noor.vue'
import parsianIcon from '../../../components/icons/banks/parsian.vue'
import pasargadIcon from '../../../components/icons/banks/pasargad.vue'
import postBankIcon from '../../../components/icons/banks/postBank.vue'
import refahIcon from '../../../components/icons/banks/refah.vue'
import resalatIcon from '../../../components/icons/banks/resalat.vue'
import saderatIcon from '../../../components/icons/banks/saderat.vue'
import samanIcon from '../../../components/icons/banks/saman.vue'
import sarmayehIcon from '../../../components/icons/banks/sarmayeh.vue'
import sepahIcon from '../../../components/icons/banks/sepah.vue'
import shahrIcon from '../../../components/icons/banks/shahr.vue'
import sinaIcon from '../../../components/icons/banks/sina.vue'
import tejaratIcon from '../../../components/icons/banks/tejarat.vue'
import toseeTaavonIcon from '../../../components/icons/banks/toseeTaavon.vue'
import gardeshgariIcon from '../../../components/icons/banks/gardeshgari.vue'
import cashDeskIcon from '../../../components/icons/AccountingRegisterIncomesToCashDesk.vue'
import treeViewIcon from '../../../components/icons/AccountingTreeView.vue'
import saveIcon from '../../../components/icons/Save.vue'
import folderIcon from '../../../components/icons/Folder.vue'
import openedFolderIcon from '../../../components/icons/Folder-Opened.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import { vMaska } from 'maska'
import moment from 'moment-jalaali'

export default {
  directives: { maska: vMaska },
  data() {
    return {
      options: {
        preProcess: (val) => val.replace(/[^0-9]/g, ''),
        postProcess: (val) => {
          if (!val) return '0'
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.registerDocumentDialog.amount = value.unmasked
          this.registerDocumentDialog.amountMasked = value
        }
      },
      advancedTotalPriceOptions: {
        preProcess: (val) => val.replace(/[^0-9]/g, ''),
        postProcess: (val) => {
          if (!val) return '0'
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.advancedRegisterDocumentDialog.totalAmount = value.unmasked
          this.advancedRegisterDocumentDialog.totalAmountMasked = value
        }
      },
      advancedCheckAmountOptions: {
        preProcess: (val) => val.replace(/[^0-9]/g, ''),
        postProcess: (val) => {
          if (!val) return '0'
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.advancedRegisterDocumentDialog.checkDetails.amount = value.unmasked
          this.advancedRegisterDocumentDialog.checkDetails.amountMasked = value
        }
      },
      advancedCashAmountOptions: {
        preProcess: (val) => val.replace(/[^0-9]/g, ''),
        postProcess: (val) => {
          if (!val) return '0'
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.advancedRegisterDocumentDialog.cashDetails.amount = value.unmasked
          this.advancedRegisterDocumentDialog.cashDetails.amountMasked = value
        }
      },
      advancedDepositAmountOptions: {
        preProcess: (val) => val.replace(/[^0-9]/g, ''),
        postProcess: (val) => {
          if (!val) return '0'
          return Number.parseInt(val).toLocaleString()
        },
        onMaska: (value) => {
          this.advancedRegisterDocumentDialog.depositDetails.amount = value.unmasked
          this.advancedRegisterDocumentDialog.depositDetails.amountMasked = value
        }
      },
      sayyadiRegex: /^[0-9,۰-۹]{16}$/,
      cashDeskIcon: markRaw(cashDeskIcon),
      deleteIcon: markRaw(deleteIcon),
      shouldLeave: false,
      desc: '',
      templates: [],
      cashBoxes: [],
      myBanks: [],
      checkBooks: [],
      checkPapers: [],
      selectDetailedAccountDialog: false,
      isDebtorDetailedSelect: false,
      selectedDetailedAccount: null,
      treeViewAccountsShowList: [],
      searchAccountText: '',
      selectDateDialog: {
        show: false,
        date: null
      },
      selectMoeinAccountDialog: {
        show: false,
        accounts: [],
        selected: null
      },
      slectedAdvancedItem: null,
      advancedRegisterDocumentDialog: {
        show: false,
        isPriceEntered: false,
        totalAmountMasked: {
          masked: '',
          unmasked: '',
          completed: false
        },
        hasCash: false,
        hasCheck: false,
        hasDeposit: false,
        cashDetails: {
          cashBoxId: null,
          date: null,
          amount: 0,
          amountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        },
        checkDetails: {
          amount: 0,
          periodType: 1,
          timePeriod: 1,
          checks: [],
          amountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        },
        depositDetails: {
          amount: 0,
          type: 6,
          amountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        }
      },
      registerDocumentDialog: {
        show: false,
        isEdit: false,
        activeTab: 0,
        commissionAmount: 0,
        selectedBank: null,
        type: 6,
        debtorDetailedAccounts: [],
        creditorDetailedAccounts: [],
        items: [],
        amountMasked: {
          masked: '',
          unmasked: '',
          completed: false
        }
      },
      detailedAccounts: [],
      POSList: [],
      selectedDetailed: null,
      selectedAccount: null,
      date: new Date(),
      id: null,
      type: 0,
      bankDialogSearchTxt: '',
      documents: [],
      showQrCodeScanner: false,
      calendarIcon: markRaw(calendarIcon),
      penIcon: markRaw(penIcon),
      paperIcon: markRaw(paperIcon),
      selectDocumentsIcon: markRaw(selectDocumentsIcon),
      moneyPlusIcon: markRaw(moneyPlusIcon),
      treeViewIcon: markRaw(treeViewIcon),
      saveIcon: markRaw(saveIcon),
      folderIcon: markRaw(folderIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      stepperItems: [
        {
          id: 0,
          title: this.$t('selectAccount'),
          icon: markRaw(PersonsIcon),
          desc: this.$t('accountsList'),
          isValid: async () => this.isValidTab(0),
          setTab: () => this.setTab(0),
          customNext: async () => this.customNextTabFirst()
        },
        {
          id: 1,
          title: this.$t('selectDocuments'),
          icon: selectDocumentsIcon,
          desc: this.$t('documentsList'),
          isValid: async () => this.isValidTab(1),
          setTab: () => this.setTab(1)
        },
        {
          id: 2,
          title: this.$t('operationReport'),
          icon: markRaw(operationReportIcon),
          desc: this.$t('voucherReview'),
          isValid: () => true,
          setTab: () => this.setTab(2)
        }
      ],
      accountsHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          width: '100px',
          key: 'fCode'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'fName',
          width: '200px'
        }
      ],
      detailedHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          width: '100px',
          key: 'fCode'
        },
        {
          title: this.$t('accountName'),
          align: 'center',
          sortable: true,
          key: 'fName',
          width: '200px'
        },
        {
          title: this.$t('nationaIdOrCode'),
          key: 'nationalCode',
          align: 'center',
          width: '200px'
        },
        {
          title: this.$t('phoneNumber'),
          key: 'phoneNumber',
          align: 'center',
          width: '200px'
        },
        {
          title: this.$t('personType'),
          key: 'personType',
          align: 'center',
          width: '100px'
        },
        {
          title: this.$t('cityProvince'),
          align: 'center',
          key: 'cityProvince',
          width: '150px'
        },
        {
          title: this.$t('postalCode'),
          align: 'center',
          key: 'postalCode',
          width: '100px'
        },
        {
          title: this.$t('taxable'),
          align: 'center',
          key: 'taxable',
          show: false,
          width: '100px'
        }
      ],
      bankHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('accountCode'),
          align: 'center',
          sortable: true,
          key: 'fCode',
          width: '90px'
        },
        {
          title: this.$t('bankName'),
          align: 'center',
          sortable: true,
          key: 'name',
          minWidth: '180px'
        },
        {
          title: this.$t('accountNumber'),
          align: 'center',
          sortable: true,
          key: 'bankAccountNumber',
          width: '200px'
        },
        {
          title: this.$t('accountOwner'),
          align: 'center',
          sortable: true,
          key: 'accountOwner',
          width: '150px'
        },
      ],
      documentHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('serialNumber'),
          align: 'center',
          sortable: true,
          key: 'serialNumber',
          width: '60px'
        },
        {
          title: this.$t('documentType'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '100px'
        },
        {
          title: this.$t('amount'),
          align: 'center',
          sortable: true,
          key: 'amount',
          width: '140px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'date',
          width: '80px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'desc',
          minWidth: '150px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          show: false,
          key: 'status',
          width: '200px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '150px',
          fixed: true
        }
      ],
      bankItems: [
        {
          title: this.$t('ayandeh'),
          value: 'آینده',
          icon: markRaw(AyandehIcon)
        },
        {
          title: this.$t('iranZamin'),
          value: 'ایران زمین',
          icon: markRaw(iranZaminIcon)
        },
        {
          title: this.$t('eghtesadNovin'),
          value: 'اقتصاد نوین',
          icon: markRaw(eghtesadNovinIcon)
        },
        {
          title: this.$t('pasargad'),
          value: 'پاسارگاد',
          icon: markRaw(pasargadIcon)
        },
        {
          title: this.$t('sina'),
          value: 'سینا',
          icon: markRaw(sinaIcon)
        },
        {
          title: this.$t('tejarat'),
          value: 'تجارت',
          icon: markRaw(tejaratIcon)
        },
        {
          title: this.$t('parsian'),
          value: 'پارسیان',
          icon: markRaw(parsianIcon)
        },
        {
          title: this.$t('shahr'),
          value: 'شهر',
          icon: markRaw(shahrIcon)
        },
        {
          title: this.$t('khavarMianeh'),
          value: 'خاورمیانه',
          icon: markRaw(khavarMianehIcon)
        },
        {
          title: this.$t('toseeSaderaat'),
          value: 'توسعه صادرات',
          icon: markRaw(toseeSaderaatIcon)
        },
        {
          title: this.$t('dey'),
          value: 'دی',
          icon: markRaw(deyIcon)
        },
        {
          title: this.$t('saman'),
          value: 'سامان',
          icon: markRaw(samanIcon)
        },
        {
          title: this.$t('sepah'),
          value: 'سپه',
          icon: markRaw(sepahIcon)
        },
        {
          title: this.$t('saderat'),
          value: 'صادرات',
          icon: markRaw(saderatIcon)
        },
        {
          title: this.$t('sarmayeh'),
          value: 'سرمایه',
          icon: markRaw(sarmayehIcon)
        },
        {
          title: this.$t('refaaheKargaran'),
          value: 'رفاه کارگران',
          icon: markRaw(refahIcon)
        },
        {
          title: this.$t('toseeTaavon'),
          value: 'توسعه تعاون',
          icon: markRaw(toseeTaavonIcon)
        },
        {
          title: this.$t('keshavarzi'),
          value: 'کشاورزی',
          icon: markRaw(keshavarziIcon)
        },
        {
          title: this.$t('gardeshgari'),
          value: 'گردشگری',
          icon: markRaw(gardeshgariIcon)
        },
        {
          title: this.$t('maskan'),
          value: 'مسکن',
          icon: markRaw(maskanIcon)
        },
        {
          title: this.$t('sanatVaMadan'),
          value: 'صنعت و معدن',
          icon: markRaw(sanatVaMadanIcon)
        },
        {
          title: this.$t('resalat'),
          value: 'رسالت',
          icon: markRaw(resalatIcon)
        },
        {
          title: this.$t('mehrIran'),
          value: 'مهر ایران',
          icon: markRaw(mehrIranIcon)
        },
        {
          title: this.$t('karafarin'),
          value: 'کارآفرین',
          icon: markRaw(karafarinIcon)
        },
        {
          title: this.$t('mellat'),
          value: 'ملت',
          icon: markRaw(mellatIcon)
        },
        {
          title: this.$t('melliIran'),
          value: 'ملی ایران',
          icon: markRaw(melliIcon)
        },
        {
          title: this.$t('postBank'),
          value: 'پست بانک',
          icon: markRaw(postBankIcon)
        },
        {
          title: this.$t('melal'),
          value: 'مؤسسه اعتباری ملل',
          icon: markRaw(melalIcon)
        },
        {
          title: this.$t('noor'),
          value: 'مؤسسه اعتباری نور',
          icon: markRaw(noorIcon)
        }
      ],
      documentTypes: [
        {
          title: this.$t('cardToCard'),
          value: 3
        },
        {
          title: this.$t('satna'),
          value: 4
        },
        {
          title: this.$t('paya'),
          value: 5
        },
        {
          title: this.$t('directPOS'),
          value: 6
        },
        {
          title: this.$t('manualPOS'),
          value: 7
        }
      ],
      periodTypes: [
        {
          title: this.$t('month'),
          value: 1
        },
        {
          title: this.$t('day'),
          value: 2
        }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setPageTitle: 'setPageTitle',
      setAddBankDialog: 'setAddBankDialog',
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    handleAccountAdded() {
      this.registerDocumentDialog.show = false;
      this.setAddBankDialog(true);
    },
    handleCloseAdvancedDialog() {
      if (this.advancedRegisterDocumentDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.advancedRegisterDocumentDialog.show = false
        })
      } else this.advancedRegisterDocumentDialog.show = false
    },
    handleCloseRegisterDialog() {
      if (this.registerDocumentDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.registerDocumentDialog.show = false
        })
      } else this.registerDocumentDialog.show = false
    },
    updateCheck(value) {
      this.advancedRegisterDocumentDialog.hasCheck = value
      if (value) {
        let remaining = this.remainingAmount
        this.advancedRegisterDocumentDialog.checkDetails.amount = remaining
        this.advancedRegisterDocumentDialog.checkDetails.amountMasked.masked =
          remaining.toLocaleString()
      } else {
        this.advancedRegisterDocumentDialog.checkDetails.amount = 0
        this.advancedRegisterDocumentDialog.checkDetails.amountMasked.masked = ''
      }
    },
    updateCash(value) {
      this.advancedRegisterDocumentDialog.hasCash = value
      if (value) {
        let remaining = this.remainingAmount
        this.advancedRegisterDocumentDialog.cashDetails.amount = remaining
        this.advancedRegisterDocumentDialog.cashDetails.amountMasked.masked =
          remaining.toLocaleString()
      } else {
        this.advancedRegisterDocumentDialog.cashDetails.amount = 0
        this.advancedRegisterDocumentDialog.cashDetails.amountMasked.masked = ''
      }
    },
    updateDeposit(value) {
      this.advancedRegisterDocumentDialog.hasDeposit = value
      if (value) {
        let remaining = this.remainingAmount
        this.advancedRegisterDocumentDialog.depositDetails.amount = remaining
        this.advancedRegisterDocumentDialog.depositDetails.amountMasked.masked =
          remaining.toLocaleString()
      } else {
        this.advancedRegisterDocumentDialog.depositDetails.amount = 0
        this.advancedRegisterDocumentDialog.depositDetails.amountMasked.masked = ''
      }
    },
    calculateChecks() {
      let item = this.advancedRegisterDocumentDialog.checkDetails
      if (!item.amount || !item.timePeriod || !item.date || !item.count)
        this.setErrorMessage(this.$t('checkDetailsErrorMessage'))
      else {
        item.checks = []
        for (let i = 0; i < item.count; i++) {
          let date = new Date(item.date)
          if (item.periodType == 2) date.setDate(date.getDate() + i * item.timePeriod)
          else {
            let m = moment(date)
            date = m.add(i * item.timePeriod, 'jMonth')
          }
          let amount = Math.ceil(item.amount / item.count)
          if (i == item.count - 1)
            amount = item.amount - item.checks.map((z) => z.amount).reduce((a, b) => a + b, 0)
          let check = {
            amount: amount,
            date: date.toISOString().split('T')[0]
          }
          item.checks.push(check)
        }
        item.checks[0].showDetails = true
      }
    },
    roundCheckAmounts(number) {
      for (let i = 0; i < this.advancedRegisterDocumentDialog.checkDetails.checks.length; i++) {
        let item = this.advancedRegisterDocumentDialog.checkDetails.checks[i]
        if (i == this.advancedRegisterDocumentDialog.checkDetails.checks.length - 1) {
          item.amount =
            this.advancedRegisterDocumentDialog.checkDetails.amount -
            this.advancedRegisterDocumentDialog.checkDetails.checks
              .filter((a, index) => index != i)
              .map((z) => z.amount)
              .reduce((a, b) => a + b, 0)
        } else {
          item.amount = Math.floor(item.amount / number) * number
        }
      }
    },
    openAdvancedRegisterDocument() {
      this.advancedRegisterDocumentDialog = {
        show: true,
        hasChanged: false,
        isPriceEntered: false,
        totalAmountMasked: {
          masked: '',
          unmasked: '',
          completed: false
        },
        hasCash: false,
        hasCheck: false,
        hasDeposit: false,
        cashDetails: {
          cashBoxId: null,
          date: null,
          amount: 0,
          amountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        },
        checkDetails: {
          amount: 0,
          periodType: 1,
          timePeriod: 1,
          checks: [],
          amountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        },
        depositDetails: {
          amount: 0,
          type: 6,
          amountMasked: {
            masked: '',
            unmasked: '',
            completed: false
          }
        }
      }
    },
    async repeatTransaction(entity) {
      await POSService.sendTransaction({
        entity: {
          id: entity.selectedPOSId,
          amount: entity.amount
        }
      }).then((res) => {
        entity.serialNumber = res.entity.serialNumber
        entity.desc =
          res.entity.trackingNumber && `${this.$t('trackingNumber')}:${res.entity.trackingNumber}`
        entity.transactionResultCode = res.entity.resultCode
        if (res.isSuccess && res.entity.resultCode == '00') {
          this.setErrorMessage(this.$t('transactionSucceed'), 'success')
        } else this.setErrorMessage(this.$t('transactionFailed'))
      })
    },
    async getPOSList() {
      await POSService.getAll(null, 1, 1000).then((res) => {
        if (res.isSuccess) {
          this.POSList = [...res.entities]
        }
      })
    },
    async getInvoiceById(invoiceId) {
      let res = await invoiceService.getById(invoiceId)
      if (res.isSuccess) {
        this.selectedDetailed = {
          detailedAccountId: res.entity.customer.detailedAccountId,
          fName: res.entity.customer.detailedAccountName,
          fCode: res.entity.customer.detailedAccountCode
        }
        this.selectedAccount = {
          accountId: res.entity.customer.accountId,
          fName: res.entity.customer.accountName,
          fCode: res.entity.customer.accountCode
        }
      }
      // console.log(this.selectedDetailed, this.selectedAccount)
      this.stepperItems[0].disabled = true
      this.$refs.transferStepper.setTab(1)
      return res.entity
    },
    async saveTotalAmount() {
      let validation = await this.$refs.totalAmountRef.validate()
      if (validation.valid) {
        if (!this.advancedRegisterDocumentDialog.totalAmount) {
          this.advancedRegisterDocumentDialog.totalAmount = 0
        }
        this.advancedRegisterDocumentDialog.isPriceEntered = true
      }
    },
    getDocumentTypeName(type) {
      return utils.showDocumentType(type)
    },
    changeCashBox(value) {
      let cashBox = this.cashBoxes.find((a) => a.id == value)
      if (value) {
        if (this.type == 0)
          this.registerDocumentDialog.debtorDetailedAccounts[0]
            ? (this.registerDocumentDialog.debtorDetailedAccounts[0] = cashBox)
            : this.registerDocumentDialog.debtorDetailedAccounts.push(cashBox)
        else
          this.registerDocumentDialog.creditorDetailedAccounts[0]
            ? (this.registerDocumentDialog.creditorDetailedAccounts[0] = cashBox)
            : this.registerDocumentDialog.creditorDetailedAccounts.push(cashBox)
      }
    },
    async changeCheckBook(value) {
      if (value) await this.getCheckPapers(value)
      let checkBook = this.checkBooks.find((a) => a.id == this.registerDocumentDialog.checkBookId)
      this.registerDocumentDialog.checkPaperId = null
      this.registerDocumentDialog.bankAccountNumber = checkBook.bankAccountNumber
      this.registerDocumentDialog.sayadNumber = null
      this.registerDocumentDialog.serialNumber = null
      this.registerDocumentDialog.serieCode = this.checkPapers[0]?.serieCode ?? null
      this.registerDocumentDialog.iBan = checkBook?.iBan ?? null
    },
    async changeAdvancedCheckBook(value, item) {
      if (value) await this.getCheckPapers(value)
      let checkBook = this.checkBooks.find((a) => a.id == item.checkBookId)
      item.checkPaperId = null
      item.bankAccountNumber = checkBook.bankAccountNumber
      item.sayadNumber = null
      item.serialNumber = null
      item.serieCode = this.checkPapers[0]?.serieCode ?? null
      item.iBan = checkBook?.iBan ?? null
    },
    changeCheckPaper(value) {
      let checkPaper = this.checkPapers.find((b) => b.id == value)
      this.registerDocumentDialog.sayadNumber = checkPaper.sayadNumber
      this.registerDocumentDialog.serialNumber = checkPaper.serialNumber
    },
    async openSelectConnectedDetailedDialog(isDebtor) {
      this.selectDetailedAccountDialog = true
      this.selectedDetailedAccount = null
      this.isDebtorDetailedSelect = isDebtor
      await this.searchDetailedAccount('')
    },
    saveDetailedAccount() {
      if (!this.selectedDetailedAccount) this.setErrorMessage(this.$t('noAccountSelected'))
      else if (this.selectedDetailedAccount.subLevelAccountCodeCount != 0)
        this.setErrorMessage(this.$t('accountWithChildrenNotSelectable'))
      else {
        if (this.isDebtorDetailedSelect)
          this.registerDocumentDialog.debtorDetailedAccounts.push(this.selectedDetailedAccount)
        else this.registerDocumentDialog.creditorDetailedAccounts.push(this.selectedDetailedAccount)
        this.selectDetailedAccountDialog = false
      }
    },
    setActiveAccount(item) {
      this.selectedDetailedAccount = item
    },
    showPersianNum(num) {
      return utils.showNumberInPersianLetters(num)
    },
    openQrScanner(item) {
      if (advancedRegisterDocumentDialog.show) this.slectedAdvancedItem = item
      else this.showQrCodeScanner = true
    },
    onDetectQr(detectedCode) {
      let nums = detectedCode[0].rawValue.split('\n')
      let code = nums[nums.length - 1]
      if (this.sayyadiRegex.test(code)) {
        if (this.advancedRegisterDocumentDialog.show) this.slectedAdvancedItem.sayadNumber = code
        else this.registerDocumentDialog.sayadNumber = code
      } else this.setErrorMessage(this.$t('invalidSayyadiQrCode'))
      this.showQrCodeScanner = false
    },
    async saveAdvancedRegister() {
      if (this.remainingAmount != 0) this.setErrorMessage(this.$t('remainingAmountShouldBeZero'))
      else if (
        this.advancedRegisterDocumentDialog.hasCheck &&
        !this.advancedRegisterDocumentDialog.checkDetails.checks?.length > 0
      )
        this.setErrorMessage(this.$t('noCheckPapersRegistered'))
      else if (
        this.advancedRegisterDocumentDialog.hasCheck &&
        this.advancedRegisterDocumentDialog.checkDetails.checks.some((a) => !a.date)
      )
        this.setErrorMessage(this.$t('enterCheckDatesMessage'))
      else if (
        this.advancedRegisterDocumentDialog.hasDeposit &&
        !this.advancedRegisterDocumentDialog.depositDetails.date
      )
        this.setErrorMessage(this.$t('enterDepositDateMessage'))
      else if (
        this.advancedRegisterDocumentDialog.hasCash &&
        !this.advancedRegisterDocumentDialog.cashDetails.date
      )
        this.setErrorMessage(this.$t('enterCashDateMessage'))
      else {
        const validation = await this.$refs.advancedRegisterRef.validate()
        if (validation.valid) {
          let documents = []
          let items = []
          if (this.templates?.length > 0) {
            items = this.templates
              .filter((b) => b.isDefault)
              .map((a) => ({
                templateId: a.id,
                sourceType: a.sourceType,
                creditorDesc: a.creditorDesc,
                debtorDesc: a.debtorDesc,
                creditorAccountName:
                  this.type == 0 ? this.selectedAccountFullNameAndCode : a.creditorAccountName,
                creditorAccountId:
                  this.type == 0 ? this.selectedAccount.accountId : a.creditorAccountId,
                debtorAccountName:
                  this.type == 0 ? a.debtorAccountName : this.selectedAccountFullNameAndCode,
                debtorAccountId:
                  this.type == 0 ? a.debtorAccountId : this.selectedAccount.accountId,
                desc: a.voucherDesc,
                commissionDesc: a.commissionCreditorDesc,
                commissionCreditorAccountId: a.commissionCreditorAccountId
              }))

            for (let i = 0; i < 8; i++) {
              if (!items.some((a) => a.sourceType == i))
                items.push({
                  sourceType: i
                })
            }
          }
          let debtorDetaildeId = null
          let creditorDetaildeId = null
          if (this.type == 1) debtorDetaildeId = this.selectedDetailed.detailedAccountId
          else creditorDetaildeId = this.selectedDetailed.detailedAccountId

          if (this.advancedRegisterDocumentDialog.hasCash) {
            let cash = this.advancedRegisterDocumentDialog.cashDetails
            let temp = items.find((z) => z.sourceType == 5)
            let doc = {
              id: utils.generateGUID(),
              type: 5,
              amount: cash.amount,
              desc: temp?.desc ?? null,
              debtorDesc: temp?.debtorDesc ?? null,
              creditorDesc: temp?.creditorDesc ?? null,
              voucherDesc: temp?.desc ?? null,
              date: cash.date,
              generateVoucher: true,
              voucherTemplateId: temp?.templateId ?? null,
              payerAccountId:
                this.type == 0 ? this.selectedAccount.accountId : temp?.creditorAccountId,
              receiverAccountId:
                this.type == 0 ? temp?.debtorAccountId : this.selectedAccount.accountId
            }
            documents.push(doc)
          }

          if (this.advancedRegisterDocumentDialog.hasDeposit) {
            let deposit = this.advancedRegisterDocumentDialog.depositDetails
            let temp = items.find((z) => z.sourceType == deposit.type)
            let myBank = null
            if (deposit.selectedDetailedBank) {
              myBank = this.myBanks.find((a) => a.id == deposit.selectedDetailedBank)
              if (myBank.extraAttributes) {
                myBank.branchName = JSON.parse(myBank.extraAttributes)?.branch
                myBank.iBan = JSON.parse(myBank.extraAttributes)?.iBan
              }
            }
            let doc = {
              id: utils.generateGUID(),
              type: deposit.type,
              bankName: [2, 3, 4].some((a) => a == deposit.type)
                ? myBank.fName
                : deposit?.bankName ?? null,
              bankAccountNumber: deposit?.bankAccountNumber ?? null,
              branchName: [2, 3, 4].some((a) => a == deposit.type)
                ? myBank?.branchName ?? null
                : null,
              iBan: [2, 3, 4].some((a) => a == deposit.type) ? myBank?.iBan ?? null : null,
              serialNumber: deposit?.serialNumber ?? null,
              amount: deposit.amount,
              desc: temp?.desc ?? null,
              debtorDesc: temp?.debtorDesc ?? null,
              creditorDesc: temp?.creditorDesc ?? null,
              voucherDesc: temp?.desc ?? null,
              date: deposit.date,
              generateVoucher: true,
              commissionAmount: Number.parseInt(deposit?.commissionAmount ?? '0')
            }
            documents.push(doc)
          }

          if (this.advancedRegisterDocumentDialog.hasCheck) {
            let check = this.advancedRegisterDocumentDialog.checkDetails
            let temp = items.find((z) => z.sourceType == 0)
            check.checks.forEach((item) => {
              let doc = {
                id: utils.generateGUID(),
                type: 0,
                bankName: item?.bankName ?? null,
                bankAccountNumber: item?.bankAccountNumber ?? null,
                branchName: item?.branchName ?? null,
                branchCode: item?.branchCode,
                iBan: item?.iBan ?? null,
                serialNumber: item?.serialNumber ?? null,
                sayadNumber: item?.sayadNumber ?? null,
                serieCode: item?.serieCode ?? null,
                amount: item.amount,
                desc: temp?.desc ?? null,
                voucherDesc: temp?.desc ?? null,
                date: item.date,
                generateVoucher: true
              }
              documents.push(doc)
            })
          }
          documents.forEach((item) => {
            this.documents.push(item)
          })
          this.advancedRegisterDocumentDialog.show = false
        } else this.setErrorMessage(this.$t('enterRequiredFieldsMessage'))
      }
    },
    async addDocument() {
      if (!this.registerDocumentDialog.date && this.registerDocumentDialog.activeTab != 2)
        this.setErrorMessage(this.$t('pleaseEnterTheDate'))
      else {
        const validationCheck = await this.$refs.registerDocumentRefCheck?.validate()
        const validationBank = await this.$refs.registerDocumentRefBank?.validate()
        const validationCash = await this.$refs.registerDocumentRefCash?.validate()
        if ((validationCheck?.valid && this.registerDocumentDialog.activeTab === 0)
          || (validationBank?.valid && this.registerDocumentDialog.activeTab === 1)
          || (validationCash?.valid && this.registerDocumentDialog.activeTab === 3)) {
          let myBank = null
          if (this.registerDocumentDialog.selectedDetailedBank) {
            myBank = this.myBanks.find(
              (a) => a.id == this.registerDocumentDialog.selectedDetailedBank
            )
            if (myBank.extraAttributes) {
              myBank.branchName = JSON.parse(myBank.extraAttributes)?.branch
              myBank.iBan = JSON.parse(myBank.extraAttributes)?.iBan
            }
          }
          let currentItem = this.registerDocumentDialog.items.find(
            (a) =>
              (this.registerDocumentDialog.activeTab == 0 && a.sourceType == 0) ||
              (this.registerDocumentDialog.activeTab == 1 &&
                a.sourceType == this.registerDocumentDialog.type) ||
              (this.registerDocumentDialog.activeTab == 2 && a.sourceType == 5)
          )
          let editType =
            this.registerDocumentDialog.activeTab == 0
              ? this.$t('check')
              : this.registerDocumentDialog.activeTab == 1
              ? this.$t('depositToAccount')
              : this.$t('cash')
          this.registerDocumentDialog.editType = editType
          let obj = {
            // object: { ...this.registerDocumentDialog },
            id: this.registerDocumentDialog.isEdit
              ? this.registerDocumentDialog.id
              : utils.generateGUID(),
            type:
              this.registerDocumentDialog.activeTab == 0
                ? 0
                : this.registerDocumentDialog.activeTab == 1
                ? this.registerDocumentDialog.type
                : 5,
            bankName:
              this.registerDocumentDialog.activeTab == 1 &&
              [2, 3, 4].some((a) => a == this.registerDocumentDialog.type)
                ? myBank.fName
                : this.registerDocumentDialog?.bankName ?? null,
            bankAccountNumber: this.registerDocumentDialog?.bankAccountNumber ?? null,
            branchName:
              this.registerDocumentDialog.activeTab == 1 &&
              [2, 3, 4].some((a) => a == this.registerDocumentDialog.type)
                ? myBank?.branchName ?? null
                : this.registerDocumentDialog.activeTab == 0 && this.type == 0
                ? this.registerDocumentDialog.branchName
                : null,
            branchCode:
              this.registerDocumentDialog.activeTab == 0 && this.type == 0
                ? this.registerDocumentDialog.branchCode
                : null,
            iBan:
              this.registerDocumentDialog.activeTab == 1 &&
              [2, 3, 4].some((a) => a == this.registerDocumentDialog.type)
                ? myBank?.iBan ?? null
                : this.registerDocumentDialog.iBan ?? null,
            serialNumber: this.registerDocumentDialog?.serialNumber ?? null,
            sayadNumber: this.registerDocumentDialog?.sayadNumber ?? null,
            selectedPOSId: this.registerDocumentDialog.selectedPOSId,
            serieCode:
              this.registerDocumentDialog.activeTab == 0
                ? this.registerDocumentDialog?.serieCode ?? null
                : null,
            amount: Number.parseInt(this.registerDocumentDialog?.amount ?? '0'),
            desc: currentItem?.desc ?? null,
            voucherDesc: currentItem?.desc ?? null,
            date:
              this.registerDocumentDialog.activeTab == 2
                ? this.date
                : this.registerDocumentDialog.date,
            commissionAmount: Number.parseInt(this.registerDocumentDialog?.commissionAmount ?? '0'),
            debtorDesc: currentItem?.debtorDesc ?? null,
            creditorDesc: currentItem?.creditorDesc ?? null,
            generateVoucher: true,
            bankDetailedAccountId:
              this.registerDocumentDialog.bankAccount?.selectedDetailedAccount?.detailedAccountId,
            checkBookId: this.registerDocumentDialog?.checkBookId ?? null,
            checkPaperId: this.registerDocumentDialog?.checkPaperId ?? null
          }
          if (this.registerDocumentDialog.isEdit) {
            let index = this.documents.findIndex((a) => a.id == obj.id)
            this.documents[index] = obj
          } else {
            if (
              this.registerDocumentDialog.type === 6 &&
              this.registerDocumentDialog.selectedPOSId &&
              this.registerDocumentDialog.activeTab === 1
            ) {
              POSService.sendTransaction({
                entity: {
                  id: this.registerDocumentDialog.selectedPOSId,
                  amount: obj.amount
                }
              })
                .then((res) => {
                  this.documentHeaders.filter((x) => x.key === 'status')[0].show = true
                  if (res.entity) {
                    obj.serialNumber = res.entity.serialNumber
                    obj.desc =
                      res.entity.trackingNumber &&
                      `${this.$t('trackingNumber')}:${res.entity.trackingNumber}`
                    obj.transactionResultCode = res.entity.resultCode
                    this.documents.push(obj)
                  }
                  if (res.isSuccess && res.entity.resultCode == '00') {
                    this.setErrorMessage(this.$t('transactionSucceed'), 'success')
                  } else this.setErrorMessage(this.$t('transactionFailed'))
                })
                .finally((r) => {
                  this.registerDocumentDialog.show = false
                })
            } else {
              this.documents.push(obj)
              this.registerDocumentDialog.show = false
            }
          }
        }
      }
    },
    showDocumentEditDialog(entity) {
      this.isEdit = true
      this.registerDocumentDialog = { ...entity }
      this.registerDocumentDialog.show = true
    },
    openRegisterDocument(params) {
      let items = []
      this.registerDocumentDialog = {
        hasChanged: false,
        show: true,
        isEdit: false,
        activeTab: 1,
        selectedBank: null,
        type: 3,
        date: new Date().toISOString().split('T')[0],
        commissionAmount: 0,
        debtorDetailedAccounts: [],
        creditorDetailedAccounts: [],
        items: items,
        selectedPOSId: this.POSList ? this.POSList[0]?.id : '',
        amountMasked: {
          masked: (params?.amount || 0).toLocaleString(),
          unmasked: (params?.amount || 0).toString(),
          completed: false
        }
      }
      if (this.type == 1)
        this.registerDocumentDialog.debtorDetailedAccounts.push({
          ...this.selectedDetailed,
          id: this.selectedDetailed.detailedAccountId
        })
      else
        this.registerDocumentDialog.creditorDetailedAccounts.push({
          ...this.selectedDetailed,
          id: this.selectedDetailed.detailedAccountId
        })
    },
    selectCustomBank() {
      this.registerDocumentDialog.selectedBank = 'سایر'
      this.registerDocumentDialog.bankName = ''
      setTimeout(() => {
        this.$refs.bankNameRef.focus()
      }, 100)
    },
    selectAdvancedCustomBank(item) {
      item.selectedBank = 'سایر'
      item.bankName = ''
    },
    selectMoeinAccount() {
      this.selectedAccount = this.selectMoeinAccountDialog.selected
      this.selectMoeinAccountDialog.show = false
      this.$refs.transferStepper.setTab(1)
    },
    getPersianDate(date, persianMonth) {
      return utils.showDate(date, false, false, false, persianMonth ? false : true)
    },
    changeDate(event) {
      if (event._isAMomentObject === true) this.selectDateDialog.isToday = false
    },
    checkIsToday(event) {
      this.selectDateDialog.isToday = event
      if (event) this.selectDateDialog.date = new Date().toISOString().split('T')[0]
    },
    editDate() {
      this.selectDateDialog = {
        show: true,
        date: this.date
      }
    },
    saveDate() {
      if (this.selectDateDialog.date) {
        this.date = this.selectDateDialog.date
        this.selectDateDialog.show = false
      } else this.setErrorMessage(this.$t('noSelectedDateMessage'))
    },
    async saveAll() {
      const validation = await this.$refs.wizardReviewForm.validate()
      if (validation.valid) {
        await transferService
          .payOrReceive({
            entity: {
              date: this.date,
              type: this.type,
              desc: this.desc,
              documents: this.documents,
              payerOrReceiverDetailedAccountId: this.selectedDetailed?.detailedAccountId
            }
          })
          .then((res) => {
            if (res.isSuccess) {
              switch (this.issuerPart) {
                case 0:
                  invoiceService
                    .setSettlement({
                      entity: {
                        id: this.$route.query.id,
                        transferId: res.entity.id
                      }
                    })
                    .then((resp) => {
                      if (!resp.isSuccess) {
                        this.setErrorMessage(resp.message)
                      }
                    })
                  break
                default:
                  break
              }

              this.setErrorMessage(
                (this.type == 0 ? this.$t('receive') : this.$t('pay')) +
                  ' ' +
                  this.$t('successfullyRegistered'),
                'success'
              )
              this.shouldLeave = true
              this.$router.push(`/transfer/payOrReceiveList/${this.type == 0 ? 'receive' : 'pay'}`)
            } else this.setErrorMessage(res.message)
          })
      }
    },
    async isValidTab(tab) {
      switch (tab) {
        case 0: {
          if (!this.date) return this.$t('noSelectedDateMessage')
          else if (!this.selectedDetailed) return this.$t('noAccountSelected')
          else return true
        }
        case 1: {
          if (!this.documents?.length > 0) return this.$t('noDocumentMessage')
          else return true
        }
      }
    },
    async customNextTabFirst() {
      if (!this.selectedDetailed) {
        this.setErrorMessage(this.$t('noAccountSelected'))
        return
      }
      this.$refs.transferStepper.setTab(1)
      // await accountService
      //   .advancedSearch({
      //     entity: {
      //       searchType: 1,
      //       detailedAccountId: this.selectedDetailed.detailedAccountId
      //     }
      //   })
      //   .then((res) => {
      //     if (res.isSuccess) {
      //       if (res.entities?.length == 0) {
      //         this.setErrorMessage(this.$t('selectedDetailedHasNoAccount'))
      //       } else if (res.entities.length == 1) {
      //         this.selectedAccount = res.entities[0]
      //         this.$refs.transferStepper.setTab(1)
      //       } else {
      //         let items = res.entities.map((a, index) => ({ ...a, id: index }))
      //         this.selectMoeinAccountDialog = {
      //           show: true,
      //           accounts: items,
      //           selected: items[0]
      //         }
      //       }
      //     } else {
      //       this.setErrorMessage(res.message)
      //     }
      //   })
    },
    async setTab(tab) {
      switch (tab) {
        case 0: {
          await this.getDetailedAccounts()
          break
        }
        case 1: {
          await this.getCashBoxes()
          await this.getMyBanks()
          if (this.type == 1) await this.getCheckBooks()
          break
        }
      }
    },
    async getDetailedAccounts() {
      await accountService
        .advancedSearch({ entity: { searchType: 0, detailedAccountFamily: 0 } })
        .then((res) => {
          if (res.isSuccess) {
            this.detailedAccounts = res.entities.map((a, index) => {
              if (a.extraAttributes) {
                let extra = JSON.parse(a.extraAttributes)
                return { ...a, id: index, ...extra }
              } else return { ...a, id: index }
            })
            if (!this.selectedDetailed && this.currentActiveTab.params.id == 'new')
              this.selectedDetailed = this.detailedAccounts[0]
          } else this.setErrorMessage(res.message)
        })
    },
    async getCashBoxes() {
      await detailedAccountService.getByFamily(5).then((res) => {
        if (res.isSuccess) {
          this.cashBoxes = res.entities?.filter((a) => a.parentId != null)
        } else this.setErrorMessage(res.message)
      })
    },
    async getMyBanks() {
      await detailedAccountService.getByFamily(4).then((res) => {
        if (res.isSuccess) {
          this.myBanks = res.entities?.filter((a) => a.parentId != null)
        } else this.setErrorMessage(res.message)
      })
    },
    async getCheckBooks() {
      await transferService.getAllCheckBooks().then((res) => {
        if (res.isSuccess) {
          this.checkBooks = res.entities
        } else this.setErrorMessage(res.message)
      })
    },
    async getCheckPapers(checkBookId) {
      await transferService.getCheckBookById(checkBookId).then((res) => {
        if (res.isSuccess) {
          this.checkPapers = res.entity.checkPapers.map((a) => {
            return { ...a, title: this.$t('serialNumber') + ' ' + a.serialNumber }
          })
        } else this.setErrorMessage(res.message)
      })
    },
    async getVoucherTemplate() {
      await voucherService
        .getAllTemplates({ entity: { sourceTypes: [0, 1, 2, 3, 4, 5, 6, 7] } })
        .then((res) => {
          if (res.isSuccess) {
            this.templates = res.entities
          } else this.setErrorMessage(res.message)
        })
    },
    async changeSearchText(text) {
      await this.searchDetailedAccount(text)
    },
    arrangeConnectedItems(list) {
      list.forEach((item) => {
        item.title = item.name + ' ' + item.fCode
        item.draggable = false
        item.icon = item?.subLevelAccountCodeCount > 0 ? folderIcon : paperIcon
        item.openedIcon = item?.children?.length > 0 ? openedFolderIcon : null
        item.open = this.searchAccountText ? true : false
        if (item?.children?.length > 0) item.children = this.arrangeConnectedItems(item.children)
      })
      return list
    },
    async searchDetailedAccount(text) {
      await detailedAccountService.search({ entity: { searchText: text } }).then((res) => {
        if (res.isSuccess) {
          let accounts = this.arrangeConnectedItems([...res.entities])
          this.treeViewAccountsShowList = [
            {
              id: null,
              active: false,
              title: this.$t('detailedAccountsTreeView'),
              draggable: false,
              open: true,
              icon: folderIcon,
              openedIcon: openedFolderIcon,
              children: accounts
            }
          ]
        } else this.setErrorMessage(res.message)
      })
    },
    onkeydown(e) {
      // if (this.selectMoeinAccountDialog.show && e.keyCode == 27)
      //   this.selectMoeinAccountDialog.show = false
      // if (this.selectDateDialog.show && e.keyCode == 27) this.selectDateDialog.show = false
      // if (this.registerDocumentDialog.show && e.keyCode == 27) this.handleCloseRegisterDialog()
      // if (this.advancedRegisterDocumentDialog.show && e.keyCode == 27)
      //   this.handleCloseAdvancedDialog()
    }
  },
  computed: {
    remainingAmount() {
      let totalAmount = this.advancedRegisterDocumentDialog.totalAmount
        ? Number.parseInt(this.advancedRegisterDocumentDialog.totalAmount)
        : 0
      let checkAmount = this.advancedRegisterDocumentDialog.checkDetails.amount
        ? Number.parseInt(this.advancedRegisterDocumentDialog.checkDetails.amount)
        : 0
      let cashAmount = this.advancedRegisterDocumentDialog.cashDetails.amount
        ? Number.parseInt(this.advancedRegisterDocumentDialog.cashDetails.amount)
        : 0
      let depositAmount = this.advancedRegisterDocumentDialog.depositDetails.amount
        ? Number.parseInt(this.advancedRegisterDocumentDialog.depositDetails.amount)
        : 0

      let amount = totalAmount - (checkAmount + cashAmount + depositAmount)
      return amount
    },
    selectedAccountFullNameAndCode() {
      return this.selectedAccount.fName + ` (${this.selectedAccount.fCode})`
    },
    issuerPart() {
      let issuerPart = -1
      if (this.$route.query.issuer) issuerPart = parseFloat(this.$route.query.issuer)
      return issuerPart
    }
  },
  watch: {
    // registerDocumentDialog: {
    //   handler(value, oldValue) {
    //     console.log(oldValue,value)
    //     if (value.selectedBank == 'سایر') {
    //       value.custumBank = true
    //     } else {
    //       value.custumBank = false
    //       value.bankName = value.selectedBank
    //     }
    //   },
    //   deep: true
    // },
    // advancedRegisterDocumentDialog: {
    //   handler(value, oldValue) {
    //     if (value.hasCheck) {
    //       value.checkDetails.checks.forEach((item) => {
    //         if (item.selectedBank == 'سایر') {
    //           item.custumBank = true
    //         } else {
    //           item.custumBank = false
    //           item.bankName = item.selectedBank
    //         }
    //       })
    //     }
    //   },
    //   deep: true
    // }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
    let id = this.currentActiveTab.params.id
    if (id != 'new') this.id = id
    else {
      this.checkIsToday(true)
      this.date = this.selectDateDialog.date
      // if (this.issuerPart < 0) this.selectDateDialog.show = true
    }
    this.type = this.currentActiveTab.params.type == 'receive' ? 0 : 1;
    var title = this.currentActiveTab.params.type
    document.title = this.$t(title)
    this.setPageTitle(title)
    // await this.$refs['selectDateBtn']?.focus()
    // console.log(this.$refs['selectDateBtn'])
    await this.getPOSList()
    switch (this.issuerPart) {
      case 0:
        let invoice = await this.getInvoiceById(this.$route.query.id)
        this.openRegisterDocument({ amount: invoice.totalAmount })
        break
      default:
        await this.getDetailedAccounts()
        await this.getVoucherTemplate()
        break
    }
  },
  // unmounted() {
  //   document.removeEventListener('keydown', this.onkeydown)
  // },
  // beforeRouteLeave(to, from) {
  //   if (this.$refs.transferStepper?.tab > 0) {
  //     if (!this.shouldLeave)
  //       this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
  //         this.closeWarning()
  //         this.shouldLeave = true
  //         this.$router.push(to.href)
  //       })
  //     return this.shouldLeave
  //   }
  // },
  components: {
    transferStepper,
    dataTable,
    navTab,
    treeView,
    AccountSelector
  }
}