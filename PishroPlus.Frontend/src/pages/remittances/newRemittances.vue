<template>
  <v-card>
    <v-form ref="newRemittanceFrm" @submit.prevent="saveAdd">
      <v-card-text>
        <v-row no-gutters>
          <v-col class="px-1 d-flex">
            <p class="text-info" style="padding-bottom: 20px">
              {{ $t('remittanceType') }} :
              {{ remittanceTypes.filter((x) => x.value === remittanceType)[0]?.title }}
            </p>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="4" lg="3" sm="6" cols="12" class="px-1 d-flex">
            <v-text-field
              name="code"
              v-model="remittanceEntity.code"
              :disabled="isAutoCode"
              :rules="[
                (v) => {
                  if (v || isAutoCode) return true
                  return $t('enterRequiredField')
                }
              ]"
              variant="outlined"
              :label="$t('remittanceCode')"
              density="compact"
              class="ml-2"
            >
            </v-text-field>
            <SwitchButton
              class="ml-2"
              v-model:checked="isAutoCode"
              v-show="isNewRemittance"
              :label="isAutoCode ? $t('automatic') : $t('manual')"
            />
          </v-col>
          <v-col cols="12" sm="6" md="3" class="px-1">
            <v-text-field
              name="title"
              v-model="remittanceEntity.title"
              :rules="[
                (v) => {
                  if (v) return true
                  return $t('enterRequiredField')
                }
              ]"
              variant="outlined"
              :label="$t('title')"
              density="compact"
              class="ml-2"
            />
          </v-col>
          <v-col md="4" lg="3" sm="6" cols="12" class="px-1">
            <date-picker
              :rules="rule"
              v-model="remittanceEntity.dateTime"
              :editable="true"
              ref="datePicker"
              @change="($event) => changeStartDateTime($event)"
              format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD"
              :label="$t('date')"
              locale="fa,en"
            />
          </v-col>

          <v-col md="4" lg="3" sm="6" cols="12" class="px-1">
            <v-autocomplete
              hide-details
              ref="warehouse"
              v-model="remittanceEntity.selectedWarehouse"
              :loading="false"
              :items="warehouseItems"
              :rules="rule"
              item-title="title"
              item-value="id"
              :label="$t('warehouse')"
              density="compact"
              variant="outlined"
              :no-data-text="$t('noItems')"
            />
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4" v-if="this.remittanceType != 52">
            <v-autocomplete
              hide-details
              v-model="remittanceEntity.selectedSalesInvoice"
              @update:search="onSalesInvoiceSearch"
              @update:modelValue="getInvoiceData"
              :loading="false"
              no-filter
              :items="saleInvoiceItems"
              :rules="[
                this.remittanceType == 51 || this.remittanceType == 54
                  ? (v) => !!v || $t('enterRequiredField')
                  : true
              ]"
              item-title="title"
              item-value="id"
              :label="$t('salesInvoice')"
              density="compact"
              variant="outlined"
              :no-data-text="$t('noItems')"
            >
              <template v-slot:selection="{ item }">
                {{ item.raw.title }}_{{ item.raw.code }}
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.title}_${item.raw.code}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4" v-else>
            <v-autocomplete
              hide-details
              v-model="remittanceEntity.selectedPurchaseInvoice"
              @update:search="onPurchaseInvoiceSearch"
              @update:modelValue="getInvoiceData"
              :loading="false"
              no-filter
              :items="purchaseInvoiceItems"
              :rules="rule"
              item-title="title"
              item-value="id"
              :label="$t('purchaseInvoice')"
              density="compact"
              variant="outlined"
              :no-data-text="$t('noItems')"
            >
              <template v-slot:selection="{ item }">
                {{ item.raw.title }}_{{ item.raw.code }}
              </template>
              <template v-slot:item="{ props, item }">
                <v-list-item
                  v-bind="props"
                  :title="`${item.raw.title}_${item.raw.code}`"
                ></v-list-item>
              </template>
            </v-autocomplete>
          </v-col>
          <v-col md="8" lg="9" sm="12" cols="12" class="px-1 py-4">
            <v-textarea
              name="description"
              v-model="generatedDescription"
              :label="$t('description')"
              rows="1"
              variant="outlined"
              density="compact"
            />
          </v-col>
        </v-row>
        <v-row style="width: 100%; justify-content: left; margin-bottom: 5px">
          <v-col cols="12" sm="6" lg="2" md="2" class="px-1 d-flex justify-end">
            <v-btn
              variant="tonal"
              color="primary"
              height="43"
              @click="showMore = !showMore"
              tabindex="-1"
            >
              {{ showMore ? $t('less') : $t('more') }}
              <v-icon class="mr-1">{{ showMore ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <v-slide-y-transition>
          <v-row no-gutters v-show="showMore">
            <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4">
              <v-autocomplete
                v-model="remittanceEntity.destinationWarehouse"
                :loading="false"
                :rules="[this.remittanceType == 54 ? (v) => !!v || $t('enterRequiredField') : true]"
                no-filter
                :items="destinationWarehouseItems"
                item-title="title"
                item-value="id"
                :label="$t('destinationWarehouse')"
                density="compact"
                variant="outlined"
                :no-data-text="$t('noItems')"
              />
            </v-col>

            <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4">
              <accountSelector
                :justDetailedAccount="true"
                :persistent="false"
                v-model="remittanceEntity.buyer"
                :title="$t('buyer')"
                addNewRoute="/persons/new"
              />
            </v-col>
            <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4">
              <accountSelector
                justDetailedAccount="true"
                :persistent="false"
                v-model="remittanceEntity.transportation"
                :title="$t('transportation')"
                addNewRoute="/persons/new"
              />
            </v-col>
            <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4">
              <accountSelector
                justDetailedAccount="true"
                :persistent="false"
                v-model="remittanceEntity.delivery"
                :title="$t('delivery')"
                addNewRoute="/persons/new"
              />
            </v-col>
          </v-row>
        </v-slide-y-transition>
      </v-card-text>

      <v-row no-gutters>
        <datatable
          class="invoice-items-table ml-5 mr-5"
          :items="tableItems?.filter((i) => i.action != 3)"
          :headers="remittanceHeader"
          :showPagination="false"
        >
          <template #toolbar>
            <p class="ma-2" style="font-weight: bold">{{ $t('remittanceItems') }}</p>
            <v-btn
              prepend-icon="mdi-plus"
              class="ml-2 mr-8"
              color="info"
              variant="tonal"
              tabindex="-1"
              @click="addNewRow"
              >{{ $t('addRow') }}
            </v-btn>
            <v-menu width="150" :close-on-content-click="false" v-model="showScanBarcodeMenu">
              <template v-slot:activator="{ props }">
                <v-btn
                  prepend-icon="mdi-barcode-scan"
                  height="43"
                  class="ml-2"
                  color="info"
                  variant="tonal"
                  v-bind="props"
                  @click="onScanBarcodeBtnClicked"
                  >{{ $t('barcode') }}
                </v-btn>
              </template>
              <v-card width="300px">
                <v-text-field
                  ref="barcodeField"
                  density="compact"
                  hide-details
                  variant="outlined"
                  append-inner-icon="mdi-barcode"
                  @blur="showScanBarcodeMenu = false"
                  v-model="barcode"
                  @keydown.enter="getProductByBarcode"
                >
                </v-text-field>
              </v-card>
            </v-menu>
            <v-spacer></v-spacer>
          </template>

          <template v-slot:column_row="{ index }">
            {{ index + 1 }}
          </template>

          <template v-slot:column_product="{ index, entity }">
            <v-text-field
              hide-details
              bg-color="transparent"
              density="compact"
              variant="solo"
              append-inner-icon="mdi mdi-open-in-new"
              @click:append-inner="openProductDialog(index)"
              @keyup.enter="openProductDialog(index)"
              style="margin: -10px"
              v-model="entity.productTitle"
            />
          </template>

          <template v-slot:column_productCode="{ entity }">
            <span>{{ entity.productCode }}</span>
          </template>

          <template v-slot:column_unit="{ entity, index }">
            <v-text-field
              hide-details
              bg-color="transparent"
              density="compact"
              variant="solo"
              readonly
              :model-value="entity?.unit?.title"
              style="margin: -10px"
            >
              <template v-slot:append-inner v-if="entity.product?.units?.length > 1">
                <v-menu open-on-hover width="150">
                  <template v-slot:activator="{ props }">
                    <v-icon size="x-small" v-bind="props" class="c-pointer">mdi-menu</v-icon>
                  </template>
                  <v-list density="compact">
                    <!-- <v-list-item
                      @click="changeUnit(entity, index, entity.product?.unit, 1)"
                      v-if="entity.unit != entity.product?.unit"
                    >
                      <v-list-item-title>{{ entity.product?.unit }}</v-list-item-title>
                    </v-list-item> -->
                    <v-list-item
                      v-for="(unit, idx) in entity.product?.units.filter(
                        (x) => x.id != entity.unit?.id
                      )"
                      :key="idx"
                      @click="changeUnit(entity, index, unit, unit.conversionFactor)"
                    >
                      <v-list-item-title>{{
                        `${unit.title}(${unit.conversionFactor + entity.product?.unit?.title})`
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </template>
            </v-text-field>
          </template>
          <template v-slot:column_value="{ entity }">
            <v-text-field
              hide-details
              bg-color="transparent"
              density="compact"
              variant="solo"
              :model-value="entity.amount"
              @change="
                (ev) => {
                  entity.amount = parseFloat(ev.target.value || 0)
                  entity.action = entity.id ? 2 : 1
                }
              "
            >
              <template v-slot:append-inner v-if="!entity.unit?.isDefault">
                <span style="font-size: 8pt; color: grey">{{ entity.conversionFactor }}x</span>
              </template>
            </v-text-field>
          </template>

          <template v-slot:column_stock="{ entity }">
            <span
              hide-details
              bg-color="transparent"
              density="compact"
              variant="solo"
              style="margin: -10px"
            >
              {{ entity.stock }}</span
            >
          </template>

          <template v-slot:column_desc="{ entity }">
            <v-text-field
              hide-details
              bg-color="transparent"
              density="compact"
              variant="solo"
              :model-value="entity.desc"
              @change="
                (ev) => {
                  entity.desc = ev.target.value
                  entity.action = entity.id ? 2 : 1
                }
              "
              style="margin: -10px"
            />
          </template>

          <template v-slot:column_operations="{ entity, index }">
            <div class="d-flex justify-center">
              <v-tooltip :text="$t('delete')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :icon="deleteIcon"
                    @click="() => deleteRow(entity, index)"
                    variant="text"
                    color="error"
                    size="small"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </datatable>
      </v-row>
    </v-form>
    <v-row style="justify-content: left; margin: 5px">
      <v-btn
        @click="saveAdd(false)"
        :prepend-icon="saveIcon"
        color="info"
        class="ma-1 ml-3 float-left"
        :disabled="!formIsValid"
        >{{ $t('save') }}</v-btn
      >
      <!-- <v-btn
        @click="saveAdd(true)"
        :prepend-icon="saveIcon"
        color="info"
        variant="outlined"
        class="ma-1 ml-3"
        :disabled="!formIsValid"
        >{{ $t('saveAsDraft') }}</v-btn
      > -->
    </v-row>
  </v-card>
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
        <datatable
          :headers="productHeaders"
          :items="products"
          :selectableRow="true"
          :hasEnter="true"
          :hasSearch="true"
          :searchText="productDialogSearchTxt"
          :searchItems="['title', 'code', 'salesPrice', 'categoryTitle', 'stock']"
          @enterMethod="selectProduct"
          v-model:selectedRow="selectedRow.product"
          clickableRow
          itemValue="id"
        >
          <template v-slot:toolbar>
            <v-row class="ms-2 justify-end" no-gutters>
              <v-btn
                to="/warehouse/products/new"
                @click="showProductSelectionDialog = false"
                variant="tonal"
                color="info"
                >{{ $t('addProduct') }}</v-btn
              >
            </v-row>
          </template>
          <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
          <template v-slot:column_salesPrice="{ entity }">
            {{ entity.price?.toLocaleString() || '' }}
          </template>
          <template v-slot:column_unit="{ entity }">
            {{ entity.units?.find((u) => u.isDefault)?.title }}
          </template>
        </datatable>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar px-5">
        <v-btn @click="selectProduct" color="info" variant="elevated" size="large">
          <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    @keyup.enter="selectTypeOfRemittance"
    v-model="showTypeSelectionDialog"
    persistent
    min-width="380"
    max-width="fit-content"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="30" color="info" :icon="typeIcon" />
        <p style="font-weight: bold">
          {{ $t('chooseTheTypeOfRemittance') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="showTypeSelectionDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <div class="bg-surface">
          <v-radio-group
            hide-details
            v-for="item in remittanceTypes"
            :key="item.value"
            v-model="remittanceEntity.type"
            color="info"
          >
            <v-radio density="compact" :label="item.title" :value="item.value"></v-radio>
          </v-radio-group>
        </div>
      </v-card-text>
      <v-card-actions class="dialog-bottombar">
        <v-btn
          style="float: left"
          variant="flat"
          @click="selectTypeOfRemittance"
          :prepend-icon="saveIcon"
          color="info"
          >{{ $t('submit') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import SwitchButton from '../../components/baseComponents/switchButton.vue'
import datatable from '../../components/baseComponents/datatable/datatable.vue'
import SaveIcon from '../../components/icons/Save.vue'
import accountSelector from '../../components/accountsComponents/accountSelector.vue'
import receiptService from '../../../api/receipt/receiptService.js'
import productService from '../../../api/product/productService'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
import invoiceService from '../../../api/invoice/invoiceService.js'
import warehouseService from '../../../api/warehouse/warehouseService'
import deleteIcon from '../../../src/components/icons/Delete.vue'
import { markRaw } from 'vue'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import typeIcon from '../../../src/components/icons/warehouseRemittancesType.vue'
import settingService from '../../../api/setting/settingService'

export default {
  components: {
    SwitchButton,
    datatable,
    accountSelector
  },
  data() {
    return {
      showScanBarcodeMenu: false,
      barcode: '',
      typeIcon: markRaw(typeIcon),
      deleteIcon: markRaw(deleteIcon),
      saveAsDraft: false,
      showMore: false,
      isAutoCode: true,
      saveIcon: markRaw(SaveIcon),
      rule: [(v) => !!v || this.$t('enterRequiredField')],
      saleInvoiceItems: [],
      purchaseInvoiceItems: [],
      warehouseItems: [],
      destinationWarehouseItems: [],
      remittanceHeader: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '10px'
        },
        {
          title: this.$t('product'),
          align: 'center',
          sortable: true,
          key: 'product',
          width: '100px'
        },
        {
          title: this.$t('productCode'),
          align: 'center',
          sortable: true,
          key: 'productCode',
          width: '50px'
        },
        {
          title: this.$t('unit'),
          align: 'center',
          sortable: true,
          key: 'unit',
          width: '50px'
        },
        {
          title: this.$t('value'),
          align: 'center',
          sortable: true,
          key: 'value',
          width: '50px'
        },

        {
          title: this.$t('inventory'),
          align: 'center',
          sortable: true,
          key: 'stock',
          width: '20px'
        },
        {
          title: this.$t('description'),
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '50px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '50px'
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
          title: this.$t('unit'),
          align: 'center',
          sortable: true,
          key: 'unit',
          width: '50px'
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
      remittanceEntity: {
        code: null,
        title: null,
        description: '',
        dateTime: new Date().toISOString().split('T')[0],
        destinationWarehouse: null,
        buyer: null,
        transportation: null,
        delivery: null,
        selectedSalesInvoice: null,
        selectedPurchaseInvoice: null,
        selectedWarehouse: null,
        type: 51,
        items: {
          productId: null,
          desc: null,
          amount: 0,
          unit: null,
          subunit: null,
          conversionFactor: 0,
          useSubunit: false,
          price: 0,
          totalPrice: 0
        }
      },
      tableItems: [{ id: 1 }],
      showProductSelectionDialog: false,
      showTypeSelectionDialog: false,
      productDialogSearchTxt: '',
      selectedRowIndex: 0,
      selectedRow: {},
      showProductsAndServices: true,
      products: [],
      remittanceTypes: [
        {
          value: 51,
          title: this.$t('sale')
        },
        {
          value: 52,
          title: this.$t('exitPurchaseReturn')
        },
        {
          value: 53,
          title: this.$t('exitConsumption')
        },
        {
          value: 54,
          title: this.$t('exitTreansfer')
        },
        {
          value: 55,
          title: this.$t('exitWastage')
        },
        {
          value: 99,
          title: this.$t('exitOther')
        }
      ]
    }
  },
  watch: {
    showProductSelectionDialog(val) {
      if (!val) {
        this.tableItems[this.selectedRowIndex].productTitle =
          this.tableItems[this.selectedRowIndex]?.product?.title || ''
      }
    },

    remittanceType(val) {
      this.showMore = val == 54
      if (val == 51 || val == 54) {
        if (this.saleInvoiceItems?.length > 0) {
          this.remittanceEntity.selectedSalesInvoice = this.saleInvoiceItems[0]?.id
          this.getInvoiceData(this.remittanceEntity.selectedSalesInvoice.id)
        }
      } else {
        this.remittanceEntity.selectedSalesInvoice = null
        this.tableItems = []
      }
    }
  },
  computed: {
    ...mapState(defaultStore, ['tabs']),
    remittanceType() {
      return this.remittanceEntity?.type || 1
    },
    formIsValid() {
      return (
        ((!this.isAutoCode && this.remittanceEntity.code) || this.isAutoCode) &&
        this.remittanceEntity.selectedWarehouse &&
        this.tableItems.filter((x) => x.product && Object.keys(x.product).length > 0).length > 0 &&
        (this.remittanceType == 51 ? this.remittanceEntity.selectedSalesInvoice : true) &&
        (this.remittanceType == 52 ? this.remittanceEntity.selectedPurchaseInvoice : true) &&
        (this.remittanceType == 54 ? this.remittanceEntity.destinationWarehouse : true)
      )
    },
    isNewRemittance() {
      return this.currentActiveTab.path === '/warehouse/remittances/new'
    },
    generatedDescription: {
      get() {
        var warehouseTitle = this.warehouseItems.filter(
          (x) => x.id == this.remittanceEntity.selectedWarehouse
        )[0]?.title
        var destinationWarehouseTitle = this.destinationWarehouseItems.filter(
          (x) => x.id == this.remittanceEntity.destinationWarehouse
        )[0]?.title
        var salesInvoiceTitle = this.saleInvoiceItems.filter(
          (x) => x.id == this.remittanceEntity.selectedSalesInvoice
        )[0]?.code
        var purchaseInvoiceTitle = this.purchaseInvoiceItems.filter(
          (x) => x.id == this.remittanceEntity.selectedPurchaseInvoice
        )[0]?.code
        if (!this.remittanceEntity.description || this.remittanceEntity.description.length < 1) {
          switch (this.remittanceType) {
            case 52:
              return (
                (warehouseTitle ? `${this.$t('inventoryExitRemitter')} (${warehouseTitle})` : '') +
                (purchaseInvoiceTitle
                  ? `${this.$t('purchaseInvoice')} (${purchaseInvoiceTitle})`
                  : '')
              )
            case 54:
              return (
                (warehouseTitle ? `${this.$t('inventoryExitRemitter')} (${warehouseTitle})` : '') +
                (salesInvoiceTitle ? `${this.$t('salesInvoice')} (${salesInvoiceTitle})` : '') +
                (destinationWarehouseTitle
                  ? `${this.$t('destinationWarehouse')} (${destinationWarehouseTitle})`
                  : '')
              )
            default:
              return (
                (warehouseTitle ? `${this.$t('inventoryExitRemitter')} (${warehouseTitle})` : '') +
                (salesInvoiceTitle ? `${this.$t('salesInvoice')} (${salesInvoiceTitle})` : '')
              )
          }
        } else {
          return this.remittanceEntity.description
        }
      },
      set(val) {
        this.remittanceEntity.description = val
      }
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      closeTab: 'closeTab',
      refreshTabByName: 'refreshTabByName',
      closeAndRefreshTab: 'closeAndRefreshTab'
    }),

    onSalesInvoiceSearch(ev) {
      clearTimeout(this.salesInvoiceSearchTimeout)
      this.salesInvoiceSearchTimeout = setTimeout(() => {
        this.getSaleInvoiceItems(ev)
      }, 800)
    },

    async getSaleInvoiceItems(searchText) {
      await invoiceService.getAll(1, 10, 1, searchText).then((res) => {
        if (res.isSuccess) {
          this.saleInvoiceItems = res.value.result
        } else this.setErrorMessage(res.message)
      })
    },

    onPurchaseInvoiceSearch(ev) {
      clearTimeout(this.purchaseInvoiceSearchTimeout)
      this.purchaseInvoiceSearchTimeout = setTimeout(() => {
        this.getPurchaseInvoiceItems(ev)
      }, 800)
    },

    async getPurchaseInvoiceItems(searchText) {
      await invoiceService.getAll(1, 10, 0, searchText).then((res) => {
        if (res.isSuccess) {
          this.purchaseInvoiceItems = res.value.result
        } else this.setErrorMessage(res.message)
      })
    },

    async getInvoiceData(data) {
      invoiceService.getById(data).then((res) => {
        if (res.isSuccess) {
          this.tableItems = res.entity.items.map((x) => {
            return {
              ...x,
              unit: x.useSubunit ? x.subunitTitle : x.unit,
              subunit: x.subunitTitle,
              useSubunit: x.useSubunit,
              conversionFactor: x.subunitConversionFactor,
              stock: x.productStock,
              product: {
                id: x.productId,
                title: x.productTitle,
                subunits: x.subunits,
                unit: x.unit
              }
            }
          })
        }
      })
    },

    async onScanBarcodeBtnClicked() {
      this.showScanBarcodeMenu = true
      setTimeout(async () => {
        ;(await this.$refs.barcodeField)?.focus()
      }, 300)
    },
    async getProductByBarcode() {
      if (!this.barcode) {
        return
      }
      await productService.search({ entity: { barcode: this.barcode } }).then((res) => {
        if (res.isSuccess) {
          if (!res.entities || res.entities.length < 1) {
            this.setErrorMessage(this.$t('barcodeNotFound'))
            return
          }
          // this.barcode = ''
          console.log(res)
          this.products = res.entities
          this.selectedRowIndex = this.tableItems.findIndex((x) => !x.product || !x.product.id)
          if (this.selectedRowIndex < 0) {
            this.addNewRow()
            this.selectedRowIndex = this.tableItems.length - 1
          }
          let product = { ...res.entities[0] }
          this.tableItems[this.selectedRowIndex].product = { ...product }
          this.tableItems[this.selectedRowIndex].productTitle = product.title
          this.tableItems[this.selectedRowIndex].unit = product?.unit || ''
          this.tableItems[this.selectedRowIndex].productCode = product.code
          this.tableItems[this.selectedRowIndex].stock = product.stock
          if (!this.tableItems[this.selectedRowIndex].amount) {
            this.tableItems[this.selectedRowIndex].amount = 1
          }
        } else this.setErrorMessage(res.message)
      })
    },
    async getWarehouseItems(searchText) {
      await warehouseService.getAll(1, 10, searchText).then((res) => {
        if (res.isSuccess) {
          this.warehouseItems = res.value.result
          this.destinationWarehouseItems = res.value.result
        } else this.setErrorMessage(res.message)
      })
    },
    changeUnit(item, index, unit, conversionFactor) {
      item.unit = unit
      item.conversionFactor = conversionFactor
      item.useSubunit = item.product?.unit?.isDefault === false
    },
    deleteRow(item, index) {
      item.action = 3
    },

    async openProductDialog(rowIndex) {
      await this.searchProducts()
      this.productDialogSearchTxt = this.tableItems[rowIndex].productTitle
      this.selectedRowIndex = rowIndex
      this.showProductSelectionDialog = true
    },
    async searchProducts(txtSearch) {
      this.products = []
      if (this.showProductsAndServices)
        await productService.getAll(0, null, 1, 1000).then((res) => {
          if (res.isSuccess) {
            this.products = res.value.result.map((x) => {
              return {
                ...x,
                typeTitle: x.type === 0 ? this.$t('product') : this.$t('service'),
                type: x.type
              }
            })
          } else this.setErrorMessage(res.message)
        })
    },
    async selectProduct() {
      if (this.selectedRow && this.selectedRow.product) {
        if (this.selectedRowIndex < 0) {
          this.addNewRow()
          this.selectedRowIndex = this.tableItems.length - 1
        }
        this.tableItems[this.selectedRowIndex].product = {
          ...this.selectedRow.product,
          unit: this.selectedRow.product.units?.find((u) => u.isDefault) || { title: '' }
        }
        this.tableItems[this.selectedRowIndex].productCode = this.selectedRow.product.code
        this.tableItems[this.selectedRowIndex].productTitle = this.selectedRow.product.title
        this.tableItems[this.selectedRowIndex].unit = this.selectedRow.product.units?.find(
          (u) => u.isDefault
        ) || { title: '' }
        this.tableItems[this.selectedRowIndex].stock = this.selectedRow.product.productStock
        this.tableItems[this.selectedRowIndex].action = this.selectedRow?.id ? 2 : 1

        if (!this.tableItems[this.selectedRowIndex].amount) {
          this.tableItems[this.selectedRowIndex].amount = 1
        }
        if (!this.tableItems[this.selectedRowIndex].stock) {
          this.tableItems[this.selectedRowIndex].stock = 0
        }
        this.showProductSelectionDialog = false
        this.tableItems[this.selectedRowIndex].dataSelect = true
        this.barcode = ''
      }
    },
    changeStartDateTime(value) {
      if (!this.remittanceEntity.dateTime) {
        let newDate = new Date(value)
        newDate.setFullYear(newDate.getFullYear() + 1)
        this.remittanceEntity.dateTime = newDate.toISOString().split('T')[0]
      }
    },
    addNewRow() {
      let ids = this.tableItems.filter((x) => typeof x.id == 'number').map((x) => x.id)
      ids.sort((a, b) => b - a)
      this.tableItems.push({ id: ids[0] + 1 })
    },

    async saveAdd(isDraft) {
      this.saveAsDraft = isDraft
      const formValidation = await this.$refs.newRemittanceFrm.validate()

      if (!formValidation.valid || (!isDraft && !this.formIsValid)) return
      let request = {
        code: this.remittanceEntity.code,
        dateTime: this.remittanceEntity.dateTime,
        warehouseId: this.remittanceEntity.selectedWarehouse,
        invoiceId:
          this.remittanceType != 52
            ? this.remittanceEntity.selectedSalesInvoice
            : this.remittanceEntity.selectedPurchaseInvoice,
        type: this.remittanceEntity.type,
        customerDetailedAccountId:
          this.remittanceEntity.buyer?.selectedDetailedAccount.detailedAccountId,
        transportationDetailedAccountId:
          this.remittanceEntity.transportation?.selectedDetailedAccount.detailedAccountId,
        deliveryDetailedAccountId:
          this.remittanceEntity.delivery?.selectedDetailedAccount.detailedAccountId,
        destinationWarehouseId: this.remittanceEntity.destinationWarehouse,
        description: this.remittanceEntity.description,
        title: this.remittanceEntity.title,
        items: this.tableItems
          .filter((x) => x.product && Object.keys(x.product).length > 0)
          .map((m) => {
            let output = {
              productId: m.product.id,
              unit: m.product?.unit,
              desc: m.desc,
              amount: m.amount,
              subunit: m.subunitTitle,
              useSubunit: m.useSubunit,
              subunitConversionFactor: m.subunitConversionFactor
            }
            if (!this.isNewRemittance) {
              output.id = m.id
              output.action = m.id ? 1 : m.action
            }
            return output
          })
      }
      if (this.isNewRemittance) {
        await receiptService.create(request).then((resp) => {
          if (resp.isSuccess) {
            this.setErrorMessage(this.$t('remittanceSuccessfullyCreated'), 'success')
            this.closeAndRefreshTab()
            
            // const currentTabIndex = this.tabs.findIndex(
            //   (tab) => tab.path === '/warehouse/remittances/new' || tab.path.startsWith('/warehouse/remittances/')
            // );
            // if (currentTabIndex !== -1) {
            //   this.closeTab(currentTabIndex);
            // }

            // const remittanceListTabExists = this.refreshTabByName('remittanceOrReceipt');
            // if (!remittanceListTabExists) {
            //   this.$router.push('/warehouse/remittance-and-receipt/remittances');
            // }
          } else {
            this.setErrorMessage(resp.message)
            if (resp.errors?.length > 0) {
              var errorMessage = ''
              resp.errors.forEach((error) => {
                errorMessage += error + '\n'
              })
              this.setErrorMessage(errorMessage.slice(0, -1))
            }
          }
        })
      } else {
        request.id = this.currentActiveTab.params['id']
        await receiptService.update(request).then((res) => {
          if (res.isSuccess) {
            this.setErrorMessage(this.$t('remittanceSuccessfullyUpdated'), 'success')
            this.closeAndRefreshTab()

            // const currentTabIndex = this.tabs.findIndex(
            //   (tab) => tab.path.startsWith('/warehouse/remittances/')
            // );
            // if (currentTabIndex !== -1) {
            //   this.closeTab(currentTabIndex);
            // }
            
            // const remittanceListTabExists = this.refreshTabByName('remittanceOrReceipt');
            // if (!remittanceListTabExists) {
            //   this.$router.push('/warehouse/remittance-and-receipt/remittances');
            // }
          } else {
            this.setErrorMessage(res.message, 'error')
          }
        })
      }
    },
    selectTypeOfRemittance() {
      this.showTypeSelectionDialog = false
      this.remittanceEntity.type = this.remittanceType
      this.$refs.warehouse.focus()
      this.$refs.warehouse.menu = true
    },
    async getRemittanceById() {
      let res = await receiptService.getById(this.currentActiveTab.params['id'])
      if (res.isSuccess) {
        this.remittanceEntity = {
          code: res.value.code,
          title: res.value.title,
          description: res.value.description,
          dateTime: res.value.dateTime,
          selectedSalesInvoice: res.value.type !== 52 ? res.value.invoiceId : null,
          selectedPurchaseInvoice: res.value.type === 52 ? res.value.invoiceId : null,
          selectedWarehouse: res.value.sourceWarehouseId,
          destinationWarehouse: res.value.destinationWarehouseId,
          type: res.value.type
        }
        this.tableItems = res.value.items.map((x) => {
          return {
            ...x,
            unit: x.unit,
            useSubunit: x.unit?.isDefault === false,
            conversionFactor: x.unit?.conversionFactor,
            stock: x.stock,
            product: { id: x.productId, title: x.productTitle, subunits: x.subunits, unit: x.unit }
          }
        })

        if (!this.tableItems || this.tableItems.length < 1) {
          this.addNewRow()
        }
        if (res.entity.customer) {
          this.remittanceEntity.buyer = {
            selectedDetailedAccount: {
              detailedAccountId: res.entity.customer.id,
              fName: res.entity.customer?.fName || res.entity.customer?.name,
              fCode: res.entity.customer?.fCode || res.entity.customer?.code,
              code: res.entity.customer.code,
              name: res.entity.customer.name
            }
          }
        }

        if (res.entity.transportation) {
          this.remittanceEntity.transportation = {
            selectedDetailedAccount: {
              detailedAccountId: res.entity.customer.id,
              fName: res.entity.customer?.fName || res.entity.customer?.name,
              fCode: res.entity.customer?.fCode || res.entity.customer?.code,
              code: res.entity.customer.code,
              name: res.entity.customer.name
            }
          }
        }
        if (res.entity.delivery) {
          this.remittanceEntity.delivery = {
            selectedDetailedAccount: {
              detailedAccountId: res.entity.customer.id,
              fName: res.entity.customer?.fName || res.entity.customer?.name,
              fCode: res.entity.customer?.fCode || res.entity.customer?.code,
              code: res.entity.customer.code,
              name: res.entity.customer.name
            }
          }
        }
      } else {
        this.setErrorMessage(res.message)
        if (res.errors?.length > 0) {
          var errorMessage = ''
          res.errors.forEach((error) => {
            errorMessage += error + '\n'
          })
          this.setErrorMessage(errorMessage.slice(0, -1))
        }
      }
    },

    async getDefaultWarehouses() {
      settingService.GetWarehouseSetting().then((res) => {
        if (!res.isSuccess) {
          this.setErrorMessage(res.message)
          return
        }
        this.remittanceEntity.selectedWarehouse = res.entities.filter(
          (x) => x.name === 'DefaultRemittanceWarehouseId'
        )[0]?.value
      })
    }
  },

  async created() {
    await this.getWarehouseItems()
    await this.getSaleInvoiceItems()
    await this.getPurchaseInvoiceItems()
    await this.getDefaultWarehouses()
    if (this.isNewRemittance) this.showTypeSelectionDialog = true
    if (this.remittanceType == 51 || this.remittanceType == 54) {
      this.remittanceEntity.selectedSalesInvoice = this.saleInvoiceItems[0]?.id
    } else {
      this.tableItems = []
    }
    if (!this.isNewRemittance) await this.getRemittanceById()
    this.getInvoiceData(
      this.remittanceEntity.selectedSalesInvoice || this.remittanceEntity.selectedPurchaseInvoice
    )
    ;(await this.$refs['datePicker']).focus()
  }
}
</script>
<style scoped></style>
