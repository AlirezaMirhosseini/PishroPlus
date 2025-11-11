<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters class="flex-column-reverse flex-md-row">
        <v-col class="flex-grow-1 pa-0 account-info-container">
          <!-- <v-btn
            to="/support/supportTicket"
            :prepend-icon="feedBackIcon"
            color="info"
            variant="outlined"
            class="ma-1"
            
          >
          </v-btn> -->

          <v-row no-gutters>
            <v-col class="pa-1" cols="6" sm="4" md="3">
              <date-picker
                :editable="true"
                v-model="tableItems.openingDateTime"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
                :label="$t('fromDate')"
                locale="fa,en"
                ref="datePicker"
              />
            </v-col>
            <v-col class="pa-1" cols="6" sm="4" md="3">
              <date-picker
                :editable="true"
                v-model="quickInvoiceEntity.dateTime"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
                :label="$t('untilDate')"
                locale="fa,en"
                ref="datePicker"
              />
            </v-col>
            <v-col class="pa-1" cols="6" sm="4" md="3">
              <v-text-field
                :label="$t('product')"
                bg-color="transparent"
                density="compact"
                append-inner-icon="mdi mdi-open-in-new"
                @click:append-inner="openProductDialog(index)"
                :model-value="`${tableItems.code}_${tableItems.title} `"
                variant="outlined"
                class="ml-2"
              >
              </v-text-field>
            </v-col>
          </v-row>
          <v-row no-gutters>
            <v-col class="px-1" cols="12" sm="4" md="12">
              <v-card
                variant="outlined"
                class="pa-1 d-flex justify-space-between align-center mt-2 pishro-border"
              >
                <div class="w-100 text-right">
                  <table class="w-100">
                    <tr>
                      <th>{{ $t('count') }}</th>
                      <td>عدد{{ tableItems.stockBalance }}</td>
                      <!-- <th> {{ $t('waitingTime') }}</th>
                      <td> {{ tableItems.waitingTime }}</td> -->
                      <th>{{ $t('productCode') }}</th>
                      <td>{{ tableItems.fCode }}</td>
                      <th>{{ $t('salesPrice') }}</th>
                      <td>{{ tableItems.salesPrice?.toLocaleString() }} ریال</td>
                      <th>{{ $t('minOrder') }}</th>
                      <td>{{ tableItems.minOrder }}-عدد</td>
                    </tr>
                    <tr>
                      <th>{{ $t('barcode') }}</th>
                      <td>{{ tableItems.barcode }}</td>
                      <th>{{ $t('purchasePrice') }}</th>
                      <td>{{ tableItems.purchasePrice?.toLocaleString() }} ریال</td>
                      <th>{{ $t('description') }}</th>
                      <td>{{ tableItems.desc }}</td>
                    </tr>
                    <tr>
                      <th>{{ $t('salesTax') }}</th>
                      <td>{{ tableItems.salesTax }}%</td>
                      <th>{{ $t('orderPoint') }}</th>
                      <td>{{ tableItems.reorderPoint }}-عدد</td>
                      <th>{{ $t('purchaseTax') }}</th>
                      <td>{{ tableItems.purchaseTax }}%</td>
                    </tr>
                    <tr></tr>
                  </table>
                </div>
              </v-card>
            </v-col>
          </v-row>
          <v-row no-gutters class="mt-2">
            <v-col cols="12" sm="4" md="12">
              <v-tabs
                center-active
                align-tabs="center"
                color="primary"
                v-model="settlementTab"
                class="w-100"
              >
                <v-tab
                  v-for="item in tabItems2"
                  :value="item.title"
                  :key="item.title"
                  fixed
                  class="pishro-border"
                >
                  <!-- "$vuetify.display.mdAndUpNot -->
                  <!-- style="min-width: 520px" -->
                  <v-icon
                    class="me-2"
                    size="small"
                    :color="tab === item.title ? 'primary' : 'grey'"
                    :icon="item.icon"
                  />
                  <p
                    :class="tab == item.title ? 'text-primary' : 'text-grey'"
                    :style="`font-weight:${tab == item.title ? 'bold' : 'unset'}`"
                  >
                    {{ $t(item.title) }}
                  </p>
                </v-tab>
              </v-tabs>
              <v-window :touch="false" v-model="settlementTab" style="width: 100%">
                <v-window-item value="Transactions">
                  <data-table
                    items=""
                    :headers="TransactionsHeaders"
                    :selectableRow="true"
                    :hasEnter="true"
                  >
                    <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
                    <template v-slot:column_salesPrice="{ entity }">
                      {{ entity.salesPrice?.toLocaleString() || '' }}
                    </template>
                  </data-table>
                </v-window-item>
                <v-window-item value="draft" class="pa-2">
                  <data-table
                    items=""
                    :headers="draftHeaders"
                    :selectableRow="true"
                    :hasEnter="true"
                  >
                    <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
                    <template v-slot:column_salesPrice="{ entity }">
                      {{ entity.salesPrice?.toLocaleString() || '' }}
                    </template>
                  </data-table>
                </v-window-item>
                <v-window-item :eager="true" value="warehouseReciptsAndRemittances" class="pa-2">
                  <v-col cols="12" sm="6" lg="3" md="4">
                    <v-select
                      :items="defaultWarehouse"
                      variant="outlined"
                      density="compact"
                      :label="$t('warehouse')"
                    />
                  </v-col>
                  <data-table
                    :headers="warehouseReciptsAndRemittancesHeaders"
                    :items="quickInvoiceItems"
                    :selectableRow="true"
                    :hasEnter="true"
                  >
                    <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
                    <template v-slot:column_type="{ entity, index }">
                      <v-select
                        density="compact"
                        bg-color="transparent"
                        hide-details
                        disabled
                        :items="entity.product?.warehouses || []"
                        item-value="id"
                        v-model="quickInvoiceItems[index].warehouseId"
                        style="margin: -10px"
                      ></v-select>
                    </template>
                  </data-table>
                </v-window-item>
                <v-window-item value="warehouseFlow" class="pa-2">
                  <data-table
                    :headers="warehouseFlowtHeaders"
                    :items="warehouseItems"
                    :hasEnter="true"
                  >
                    <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
                    <!-- <template v-slot:column_salesPrice="{ entity }">
                      {{ entity.salesPrice?.toLocaleString() || '' }}
                    </template> -->
                    <template v-slot:toolbar>
                      <v-row>
                        <v-col cols="12" md="3">
                          <v-select
                            density="compact"
                            bg-color="transparent"
                            hide-details
                            variant="outlined"
                            :label="$t('reportType')"
                            :items="reportTypeItems"
                            item-value="id"
                            v-model="reportTypeDefault"
                          ></v-select>
                        </v-col>
                      </v-row>
                    </template>
                    <template v-slot:column_dateTime="{ entity }">
                      {{ showPersinDate(entity.dateTime) }}
                    </template>
                    <template v-slot:column_function="{ entity }">
                      {{ entity.type == 0 ? $t('purchase') : $t('BTFC') }}
                    </template>
                    <template v-slot:column_unitPrice="{ entity }">
                      {{ entity.unitPrice != '0' ? entity.unitPrice?.toLocaleString() : '-' }}
                    </template>
                    <template v-slot:column_totalPriceAmount="{ entity }">
                      {{ entity.totalPriceAmount?.toLocaleString() }}
                    </template>
                    <template v-slot:column_stockRemainigAmount="{ entity }">
                      {{ entity.stockRemainigAmount?.toLocaleString() }}
                    </template>
                    <template v-slot:column_totalPriceRemainingAmount="{ entity }">
                      {{ entity.totalPriceRemainingAmount?.toLocaleString() }}
                    </template>
                  </data-table>
                </v-window-item>
              </v-window>
            </v-col>
          </v-row>
          <!-- {{  $vuetify.breakPoints}} -->
          <v-dialog v-model="showProductSelectionDialog" width="75%">
            <v-card>
              <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
                <v-icon class="me-2" color="info" icon="mdi mdi-shopping-outline" />
                <p style="font-weight: bold">
                  {{ `${$t('selectProduct')}/${$t('service')}/${$t('account')}` }}
                </p>
                <div class="ms-auto">
                  <v-btn
                    color="grey"
                    icon="mdi mdi-close"
                    @click="showProductSelectionDialog = false"
                    variant="text"
                  />
                </div>
              </v-row>
              <v-card-text>
                <div class="d-flex">
                  <v-checkbox
                    :label="`${$t('product')}/${$t('service')}`"
                    density="compact"
                    hide-details
                    :model-value="true"
                    v-model="showProductsAndServices"
                    @change="searchProducts"
                  >
                  </v-checkbox>
                  <v-checkbox
                    v-model="showDetailedAccounts"
                    :label="`${$t('show')} ${$t('accounts')}`"
                    hide-details
                    density="compact"
                    @change="searchProducts"
                  ></v-checkbox>
                </div>
                <data-table
                  :headers="productHeaders"
                  :items="products"
                  :selectableRow="true"
                  :hasEnter="true"
                  :bigSearch="true"
                  :hasSearch="true"
                  :searchText="productDialogSearchTxt"
                  :searchItems="['title', 'code', 'salesPrice', 'categoryTitle', 'stock']"
                  @enterMethod="selectProduct"
                  v-model:selectedRow="selectedRow.product"
                  clickableRow
                  itemValue="id"
                >
                  <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
                  <template v-slot:column_salesPrice="{ entity }">
                    {{ entity.salesPrice?.toLocaleString() || '' }}
                  </template>
                </data-table>
              </v-card-text>
              <v-card-actions class="justify-end dialog-bottombar px-5">
                <v-btn @click="selectProduct" color="info" variant="elevated" size="large">
                  <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script>
import AccountSelector from '../../../components/accountsComponents/accountSelector.vue'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import warehouseServices from '../../../../api/warehouse/warehouseService'
import feedBack from '../../../components/ticketComponents/feedBack.vue'
import LineChart from '../../../components/baseComponents/lineChart.vue'
import productService from '../../../../api/product/productService.js'
import utils from '../../../../plugins/utils.js'

import { markRaw } from 'vue'
// import feedBack from '../../../components/ticketComponents/feedBack.vue'
export default {
  components: {
    AccountSelector,
    GridItem,
    GridLayout,
    dataTable,
    LineChart,
    feedBack
  },
  data() {
    return {
      selectedRow: {},
      invoiceItems: [{ id: 1, performTaxAmount: true }],
      warehouseItems: [],
      warehouseFlowtHeaders: [
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'dateTime',
          width: '0'
        },
        {
          title: this.$t('function'),
          align: 'center',
          sortable: true,
          key: 'function',
          width: '10px'
        },
        {
          title: this.$t('count'),
          align: 'center',
          sortable: true,
          key: 'amount',
          width: '150px'
        },
        {
          title: this.$t('unitAmount'),
          align: 'center',
          sortable: true,
          key: 'unitPrice',
          width: '10px'
        },
        {
          title: this.$t('totalAmount'),
          align: 'center',
          sortable: true,
          key: 'totalPriceAmount',
          width: '10px'
        },
        {
          title: this.$t('totalBalance'),
          align: 'center',
          sortable: true,
          key: 'stockRemainigAmount',
          width: '10px'
        },
        {
          title: this.$t('productRialBalance'),
          align: 'center',
          sortable: true,
          key: 'totalPriceRemainingAmount',
          width: '10px'
        }
      ],
      productHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
        },
        {
          title: this.$t('type'),
          align: 'center',
          sortable: true,
          key: 'typeTitle',
          width: '0'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '150px'
        },
        {
          title: this.$t('price'),
          align: 'center',
          sortable: true,
          key: 'salesPrice',
          width: '30px'
        },
        {
          title: this.$t('stockAmount'),
          align: 'center',
          sortable: true,
          key: 'stock',
          width: '20px'
        },
        {
          title: this.$t('category'),
          align: 'center',
          sortable: true,
          key: 'categoryTitle',
          width: '60px'
        }
      ],
      selectedAccount: {},
      tableItems: {},
      defaultWarehouse: [],
      product: [],
      quickInvoiceItems: [{ id: 1, performTaxAmount: true }],
      TransactionsHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'date',
          width: '0'
        },
        {
          title: this.$t('number'),
          align: 'center',
          sortable: true,
          key: 'number',
          width: '150px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '30px'
        },
        {
          title: this.$t('person'),
          align: 'center',
          sortable: true,
          key: 'person',
          width: '20px'
        },
        {
          title: this.$t('entree'),
          align: 'entree',
          sortable: true,
          key: 'categoryTitle',
          width: '60px'
        },
        {
          title: this.$t('issue'),
          align: 'issue',
          sortable: true,
          key: 'exite',
          width: '60px'
        },
        {
          title: this.$t('scale'),
          align: 'scale',
          sortable: true,
          key: 'exite',
          width: '60px'
        },
        {
          title: this.$t('amount'),
          align: 'issue',
          sortable: true,
          key: 'amount',
          width: '60px'
        },
        {
          title: this.$t('unitAmount'),
          align: 'issue',
          sortable: true,
          key: 'unitAmount',
          width: '60px'
        },
        {
          title: this.$t('warehouseRemittance'),
          align: 'issue',
          sortable: true,
          key: 'warehouseRemittance',
          width: '60px'
        }
      ],
      draftHeaders: [
        {
          title: this.$t('row'),
          align: 'issue',
          sortable: true,
          key: 'row',
          width: '60px'
        },
        {
          title: this.$t('date'),
          align: 'issue',
          sortable: true,
          key: 'date',
          width: '60px'
        },
        {
          title: this.$t('desc'),
          align: 'issue',
          sortable: true,
          key: 'desc',
          width: '60px'
        },
        {
          title: this.$t('person'),
          align: 'issue',
          sortable: true,
          key: 'person',
          width: '60px'
        },
        {
          title: this.$t('entree'),
          align: 'issue',
          sortable: true,
          key: 'entree',
          width: '60px'
        },
        {
          title: this.$t('issue'),
          align: 'issue',
          sortable: true,
          key: 'issue',
          width: '60px'
        },
        {
          title: this.$t('amount'),
          align: 'issue',
          sortable: true,
          key: 'amount',
          width: '60px'
        }
      ],
      warehouseReciptsAndRemittancesHeaders: [
        {
          title: this.$t('row'),
          align: 'issue',
          sortable: true,
          key: 'row',
          width: '60px'
        },
        {
          title: this.$t('date'),
          align: 'issue',
          sortable: true,
          key: 'date',
          width: '60px'
        },
        {
          title: this.$t('number'),
          align: 'issue',
          sortable: true,
          key: 'number',
          width: '60px'
        },
        {
          title: this.$t('type'),
          align: 'issue',
          sortable: true,
          key: 'type',
          width: '60px'
        },
        {
          title: this.$t('description'),
          align: 'issue',
          sortable: true,
          key: 'description',
          width: '60px'
        },
        {
          title: this.$t('entree'),
          align: 'issue',
          sortable: true,
          key: 'entree',
          width: '60px'
        },
        {
          title: this.$t('issue'),
          align: 'issue',
          sortable: true,
          key: 'issue',
          width: '60px'
        },
        {
          title: this.$t('scale'),
          align: 'issue',
          sortable: true,
          key: 'scale',
          width: '60px'
        }
      ],
      settlementTab: 'Transactions',
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      tabItems2: [
        { icon: 'mdi mdi-magnify', title: 'Transactions' },
        { icon: 'mdi-barcode-scan', title: 'draft' },
        { icon: 'mdi mdi-magnify', title: 'warehouseReciptsAndRemittances' },
        { icon: 'mdi mdi-magnify', title: 'warehouseFlow' }
      ],
      reportTypeItems: [
        {
          title: 'FIFO',
          id: 0
        },
        {
          title: this.$t('median'),
          id: 1
        },
        {
          title: 'میانگین موزون',
          id: 2
        }
      ],
      tab: 'barcode',
      selectedCycle: 1,
      chartLabels: [
        'فروردین',
        'اردیبهشت',
        'خرداد',
        'تیر',
        'مرداد',
        'شهریور',
        'مهر',
        'آبان',
        'آذر',
        'دی',
        'بهمن',
        'اسفند'
      ],
      products: [],
      product: [],
      purchaseData: [40, 39, 10, 40, 39, 80, 40, 32, 67, 83, 12, 50],
      saleData: [30, 80, 20, 15, 12, 100, 60, 12, 34, 68, 12, 45],
      quickInvoiceEntity: {
        additionsAndDeductions: [],
        code: '',
        dateTime: new Date().toISOString().split('T')[0],
        // dateTime:this.tableItems.entity.detailedAccount.openingDateTime,
        dueDateTime: new Date().toISOString().split('T')[0]
      },
      voucherDateRange: null,
      voucherFromDate: null,
      voucherToDate: null,
      productDialogSearchTxt: '',
      selectedRowIndex: 0,
      showProductSelectionDialog: false,
      showProductsAndServices: true,
      reportTypeDefault: 0
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setDashItem: 'setDashItem',
      removeDashboardItem: 'removeDashItem',
      setDefaultDashItem: 'setDefaultDashItem',
      addDashboardItem: 'addDashItem',
      setErrorMessage: 'setErrorMessage'
    }),
    warehouseFlowTypeHasChanged(val) {
      console.log(val)
    },
    showPersinDate(date) {
      return utils.showDate(date, false, false, false, false)
    },
    async openProductDialog(rowIndex) {
      await this.searchProducts()
      this.productDialogSearchTxt = this.quickInvoiceItems[rowIndex]
      //   this.selectedRowIndex = rowIndex
      // console.log(this.products );
      this.showProductSelectionDialog = true
    },
    async searchProducts(txtSearch) {
      this.products = []
      if (this.showProductsAndServices)
        await productService.getAll(7, this.$route.query.warehouseId).then((res) => {
          if (res.isSuccess) {
            this.products = res.value?.result
          } else this.setErrorMessage(res?.errors[0]?.message)
        })
    },
    async selectProduct() {
      await this.getInvoiceData()
      this.showProductSelectionDialog = false
    },
    addToTable(item) {
      let emptyRowIndex = this.quickInvoiceItems.findIndex((m) => !m.products || !m.products.id)
      // console.log(this.quickInvoiceItems,emptyRowIndex);
      //   if (emptyRowIndex > -1) {
      this.quickInvoiceItems[emptyRowIndex] = {
        ...item,
        product: { ...item },
        productTitle: item.title,
        price: item.salesPrice,
        tax: item.salesTax,
        performTaxAmount: true,
        amount: 1

        //   } else {
        //     this.quickInvoiceItems.push({
        //       ...item,
        //       product: { ...item },
        //       productTitle: item.title,
        //       price: item.salesPrice,
        //       tax: item.salesTax,
        //       performTaxAmount: true,
        //       amount: 1
        //     })
      }
    },
    async getAllDefaultWarehouse() {
      await warehouseServices.getAll().then((res) => {
        if (res.isSuccess) {
          //   console.log(res)
          this.defaultWarehouse = res.entities
          //   this.selectedDefaultWarehouce = res?.entities[0]?.id
        } else this.setErrorMessage(res.message)
      })
    },
    layoutUpdate(value) {
      this.setDashItem(this.$vuetify.display.name, this.layout)
    },
    changeVoucherRange(value) {
      this.voucherDateRange = value
      this.voucherFromDate = value[0]
      this.voucherToDate = value[1]
      this.getAllData()
    },

    removeDashItem(id) {
      this.removeDashboardItem(this.$vuetify.display.name, id)
    },
    selectCycle(cycle) {
      this.selectedCycle = cycle
      switch (cycle) {
        case 1:
          this.chartLabels = [
            'فروردین',
            'اردیبهشت',
            'خرداد',
            'تیر',
            'مرداد',
            'شهریور',
            'مهر',
            'آبان',
            'آذر',
            'دی',
            'بهمن',
            'اسفند'
          ]
          this.purchaseData = [40, 39, 10, 40, 39, 80, 40, 32, 67, 83, 12, 50]
          this.saleData = [30, 80, 20, 15, 12, 100, 60, 12, 34, 68, 12, 45]
          break
        case 2:
          this.chartLabels = ['فروردین', 'اردیبهشت', 'خرداد']
          this.purchaseData = [40, 39, 10]
          this.saleData = [30, 80, 20]
          break
        case 3:
          this.chartLabels = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور']
          this.purchaseData = [40, 39, 10, 40, 39, 80]
          this.saleData = [30, 80, 20, 15, 12, 100]
          break
        case 4:
          this.chartLabels = [
            'فروردین',
            'اردیبهشت',
            'خرداد',
            'تیر',
            'مرداد',
            'شهریور',
            'مهر',
            'آبان',
            'آذر',
            'دی',
            'بهمن',
            'اسفند'
          ]
          this.purchaseData = [40, 39, 10, 40, 39, 80, 40, 32, 67, 83, 12, 50]
          this.saleData = [30, 80, 20, 15, 12, 100, 60, 12, 34, 68, 12, 45]
          break
      }
    },
    async getAllProducts() {
      await productService.getAll().then((res) => {
        // console.log(res)
        if (res.isSuccess) {
          this.product = res.entities
        } else this.setErrorMessage(res.message)
      })
    },
    async getInvoiceData() {
      console.log(this.selectedRow)
      console.log(this.selectedRowIndex)

      productService
        .getDetails(
          this.selectedRow?.product?.id
            ? this.selectedRow?.product?.id
            : this.currentActiveTab.params['id']
        )
        .then((res) => {
          if (res.isSuccess) {
            this.tableItems.fCode = res.value.detailedAccount.fCode
            this.tableItems.code = res.value.code
            this.tableItems.salesPrice = res.value.salesPrice
            this.tableItems.purchasePrice = res.value.purchasePrice
            this.tableItems.imageUrl = res.value.imageUrl
            this.tableItems.salesTax = res.value.salesTax
            this.tableItems.purchaseTax = res.value.purchaseTax
            this.tableItems.unit = res.value.unit
            this.tableItems.barcode = res.value.barcode
            this.tableItems.title = res.value.title
            this.tableItems.categoryTitle = res.value.categoryTitle
            this.tableItems.desc = res.value.desc
            this.tableItems.stockBalance = res.value.stockBalance
            this.tableItems.parentName = res.value.detailedAccount.parentName
            this.tableItems.minOrder = res.value.minOrder
            this.tableItems.reorderPoint = res.value.reorderPoint
            this.tableItems.openingDateTime = res.value.detailedAccount.openingDateTime
            this.warehouseItems = res.value.warehouseReportItems
          }
          // if ((this.warehouseItems?.type = 1)) {
          // } else this.setErrorMessage(res.message)
        })
      console.log(this.reportTypeDefault)
    }
  },
  watch: {
    reportTypeDefault(val) {
      this.getInvoiceData()
    },
    showProductSelectionDialog(val) {
      if (!val) {
        this.invoiceItems[this.selectedRowIndex].productTitle =
          this.invoiceItems[this.selectedRowIndex]?.product?.title || ''
      }
    }
  },
  computed: {
    ...mapState(defaultStore, {
      presetLayout: 'dashItems'
    }),
    // filteredItems(){
    //   if(!this.reportTypeDefault){
    //     return this.warehouseItems
    //   }
    //   return this.warehouseItems.filter(item=>item.type)
    // },
    chartData() {
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.$t('entree'),
            borderColor: '#46be91',
            pointBackgroundColor: '#46be91',
            backgroundColor: '#46be91',
            data: this.saleData,
            fill: false,
            tension: 0.3,
            pointRadius: 1
          },
          {
            label: this.$t('issue'),
            borderColor: '#ED2939',
            pointBackgroundColor: '#ED2939',
            backgroundColor: '#ED2939',
            data: this.saleData,
            fill: false,
            tension: 0.3,
            pointRadius: 1
          },
          {
            label: this.$t('countmax'),
            borderColor: '#F2A578',
            pointBackgroundColor: '#F2A578',
            backgroundColor: '#F2A578',
            data: this.purchaseData,
            fill: false,
            tension: 0.3,
            pointRadius: 1
          },
          {
            label: this.$t('countmin'),
            borderColor: '#F2A578',
            pointBackgroundColor: '#F2A578',
            backgroundColor: '#F2A578',
            data: this.saleData,
            fill: false,
            tension: 0.3,
            pointRadius: 1
          }
        ]
      }
    },
    layout() {
      switch (this.$vuetify.display.name) {
        case 'xs':
          return this.presetLayout.xs
        case 'sm':
          return this.presetLayout.sm
        case 'md':
          return this.presetLayout.md
        case 'lg':
          return this.presetLayout.lg
      }
      return this.presetLayout.lg
    }
  },
  async mounted() {
    await this.getAllDefaultWarehouse()
    await this.getAllProducts()
    await this.getInvoiceData()
    // console.log(this.$vuetify)
  }
}
</script>
<style scoped>
tr {
  margin-left: 30px;
}

table,
th,
td {
  padding: 8px;
  text-align: center;
  text-align: right;
  /* vertical-align: middle; */
}

th {
  font-weight: bold;
  display: table-header-group;
}

td {
  color: rgb(104, 103, 103);
}
</style>
