<template>
  <v-card class="mb-auto">
    <v-card-text>
      <v-form ref="frm">
        <v-row no-gutters justify="end">
          <v-col cols="12" class="d-flex justify-space-between align-center">
            <h2 class="text-h6 font-weight-bold text-primary">
              <v-icon icon="mdi-cash-minus" color="primary" size="large" />
              {{ $t('discountDetails') }}
            </h2>
          </v-col>
        </v-row>

        <v-card class="mb-6">
          <v-card-title class="d-flex align-center py-3 px-4">
            <v-icon icon="mdi-cash-minus" color="primary" class="me-2" />
            <span>{{ $t('status') }}</span>
            <v-spacer></v-spacer>
            <div class="d-flex align-center">
              <span class="me-2">{{
                discountEntity.isActive ? $t('discountIsActive') : $t('discountIsInactive')
              }}</span>
              <switch-button
                v-model:checked="discountEntity.isActive"
                :label="discountEntity.isActive ? $t('active') : $t('inActive')"
                class="discount-status-switch"
              />
            </div>
          </v-card-title>
        </v-card>

        <v-card :disabled="!discountEntity.isActive && action !== 0">
          <v-card-text>
            <v-row>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="discountEntity.name"
                  :label="$t('discountName')"
                  variant="outlined"
                  density="compact"
                  :readonly="action === 0"
                  :rules="[
                    v => !!v || $t('enterRequiredField'),
                    v => (v && v.length >= 3) || $t('minimumCharacters', { count: 3 })
                  ]"
                  required
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-tooltip :text="discountEntity.usePercentage ? $t('usePercentageHelp') : $t('useAmountHelp')">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <v-checkbox
                        v-model="discountEntity.usePercentage"
                        :label="$t('usePercentage')"
                        color="primary"
                        :readonly="action === 0"
                        hide-details
                      />
                    </div>
                  </template>
                </v-tooltip>
              </v-col>

              <v-col v-if="discountEntity.usePercentage" cols="12" md="4">
                <v-text-field
                  v-model="discountEntity.discountPercentage"
                  :label="$t('discountPercentage')"
                  variant="outlined"
                  density="compact"
                  type="number"
                  min="0"
                  max="100"
                  :readonly="action === 0"
                  :rules="[
                    v => v >= 0 || $t('minimumValue', { value: 0 }),
                    v => v <= 100 || $t('maximumValue', { value: 100 })
                  ]"
                  suffix="%"
                />
              </v-col>
              <v-col v-else cols="12" md="4">
                <v-text-field
                  v-model="discountEntity.discountAmount"
                  :label="$t('discountAmount')"
                  variant="outlined"
                  density="compact"
                  type="number"
                  min="0"
                  :readonly="action === 0"
                  :rules="[
                    v => v >= 0 || $t('minimumValue', { value: 0 })
                  ]"
                  :suffix="$t('rial')"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="discountEntity.maximumDiscountAmount"
                  :label="$t('maximumDiscountAmount')"
                  variant="outlined"
                  density="compact"
                  type="number"
                  min="0"
                  :readonly="action === 0"
                  :suffix="$t('rial')"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-tooltip :text="$t('isCumulativeHelp')">
                  <template v-slot:activator="{ props }">
                    <div v-bind="props">
                      <v-checkbox
                        v-model="discountEntity.isCumulative"
                        :label="$t('isCumulative')"
                        color="primary"
                        :readonly="action === 0"
                        hide-details
                      />
                    </div>
                  </template>
                </v-tooltip>
              </v-col>
              <v-col cols="12" md="4">
                <v-checkbox
                  v-model="discountEntity.requiresCouponCode"
                  :label="$t('requiresCouponCode')"
                  color="primary"
                  :readonly="action === 0"
                  hide-details
                />
              </v-col>

              <v-col cols="12" md="4">
                <date-picker
                  v-model="discountEntity.startDateUtc"
                  :label="$t('startDate')"
                  :readonly="action === 0"
                  density="compact"
                  clearable
                />
              </v-col>
              <v-col cols="12" md="4">
                <date-picker
                  v-model="discountEntity.endDateUtc"
                  :label="$t('endDate')"
                  :readonly="action === 0"
                  density="compact"
                  clearable
                />
              </v-col>

              <v-col v-if="discountEntity.requiresCouponCode" cols="12" md="4">
                <v-text-field
                  v-model="discountEntity.couponCode"
                  :label="$t('couponCode')"
                  variant="outlined"
                  density="compact"
                  :readonly="action === 0"
                  :rules="[
                    v => !discountEntity.requiresCouponCode || !!v || $t('enterRequiredField')
                  ]"
                />
              </v-col>
              <v-col cols="12" md="6">
                <AccountSelector
                  v-model="customerEntity"
                  :title="$t('customer')"
                  :persistent="false"
                  :readonly="action === 0"
                  addNewRoute="/persons/new"
                  density="compact"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  :model-value="selectedProduct?.title || ''"
                  :label="$t('product')"
                  variant="outlined"
                  density="compact"
                  :readonly="action === 0"
                  clearable
                  @click:clear="clearProduct"
                  @focus="openProductDialog"
                  @click="openProductDialog"
                  :placeholder="$t('selectProduct')"
                  append-inner-icon="mdi-open-in-new"
                  @click:append-inner="openProductDialog"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="discountEntity.description"
                  :label="$t('description')"
                  variant="outlined"
                  density="compact"
                  :readonly="action === 0"
                  rows="1"
                />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-form>
      <div cols="12" sm="6" lg="2" md="2" class="d-flex justify-end mt-6">
        <v-btn
          @click="saveDiscount"
          :loading="loading"
          color="info"
          size="large"
          variant="flat"
          :disabled="action === 0"
        >
          <v-icon class="me-1">mdi-content-save</v-icon>
          {{ $t('save') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>

  <v-dialog v-model="showProductSelectionDialog" width="75%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" color="info" icon="mdi-shopping-outline" />
        <p style="font-weight: bold">
          {{ `${$t('selectProduct')}/${$t('service')}` }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi-close"
            @click="showProductSelectionDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <div class="d-flex justify-space-between">
          <div class="d-flex">
          </div>
          <div class="d-flex justify-end ga-2">
            <v-btn
              color="info"
              to="/warehouse/products/new"
              @click="showProductSelectionDialog = false"
              variant="tonal"
            >
              {{ $t('addProduct') }}
            </v-btn>
            <v-btn
              color="primary"
              to="/warehouse/services/new"
              @click="showProductSelectionDialog = false"
              variant="tonal"
            >
              {{ $t('addService') }}
            </v-btn>
          </div>
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
          <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
          <template v-slot:column_salesPrice="{ entity }">
            {{ entity.salesPrice?.toLocaleString() || '' }}
          </template>
          <template v-slot:column_operation="{ entity }">
            <v-row class="d-none d-md-flex justify-center" no-gutters>
              <v-tooltip :text="$t('editProductOrService')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-square-edit-outline"
                    variant="text"
                    color="info"
                    size="x-small"
                    @click="updateProductOrService(entity)"
                  />
                </template>
              </v-tooltip>
            </v-row>
          </template>
        </data-table>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar px-5">
        <v-btn @click="selectProduct" color="info" variant="elevated" size="large">
          <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import AccountSelector from '../../components/accountsComponents/accountSelector.vue'
import switchButton from '../../components/baseComponents/switchButton.vue'
import productService from '../../../api/product/productService'
import discountService from '../../../api/discount/discountService'

export default {
  name: 'EditOrCreateDiscount',
  components: {
    dataTable,
    AccountSelector,
    switchButton
  },
  data() {
    return {
      loading: false,
      discountEntity: this.getDefaultForm(),
      customerEntity: {},
      selectedProduct: null,
      showProductSelectionDialog: false,
      selectedRow: {},
      products: [],
      productDialogSearchTxt: '',
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
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: false,
          key: 'operation',
          width: '10px',
          fixed: true
        }
      ]
    }
  },
  computed: {
    isNewDiscount() {
      return this.currentActiveTab.path === '/shop/discount/new'
    },
    currentId() {
      if (this.currentActiveTab.params.id) return this.currentActiveTab.params.id
      else return null
    },
    action() {
      if (this.isNewDiscount) return 1
      if (this.currentActiveTab.query?.action === 'view') return 0
      return 2
    }
  },
  async mounted() {
    if (!this.isNewDiscount) {
      await this.getDiscountById()
    }
  },
  methods: {
    ...mapActions(defaultStore, ['setErrorMessage']),

    getDefaultForm() {
      return {
        name: '',
        adminComment: '',
        usePercentage: true,
        discountPercentage: 0,
        discountAmount: 0,
        maximumDiscountAmount: 0,
        startDateUtc: null,
        endDateUtc: null,
        requiresCouponCode: false,
        couponCode: '',
        isCumulative: false,
        limitationType: 0,
        limitationTimes: 0,
        discountType: 0,
        maximumDiscountedQuantity: 0,
        isActive: true,
        customerAccountId: null,
        productAccountId: null,
        description: ''
      }
    },

    async getDiscountById() {
      const response = await discountService.getById(this.currentId)
      if (response.isSuccess) {
        this.discountEntity = { ...response.value }
        await this.loadCustomerAndProductInfo(response.value)
      } else {
        this.setErrorMessage(response.errors?.[0]?.message || this.$t('errorLoadingData'))
      }
    },

    async loadCustomerAndProductInfo(discountData) {
      if (discountData.customerAccountId) {
        this.customerEntity = {
          selectedAccount: {
            accountId: discountData.customerAccountId,
            hierarchyName: 'مشتری انتخاب شده'
          }
        }
      } else {
        this.customerEntity = {}
      }

      if (discountData.productAccountId) {
        const response = await productService.getById(discountData.productAccountId)
        if (response.isSuccess) {
          this.selectedProduct = response.value
        }
      } else {
        this.selectedProduct = null
      }
    },

    async openProductDialog() {
      if (this.action === 0) return
      
      await this.searchProducts()
      this.productDialogSearchTxt = this.selectedProduct?.title || ''
      this.showProductSelectionDialog = true
    },

    async searchProducts() {
      this.products = []
      const response = await productService.search({
        page: 1,
        size: 100
      })
      
      if (response.isSuccess) {
        this.products = response.value.result.map((x) => {
          const salesPrice = x.prices?.find((p) => p.type === 0)?.price || 0

          return {
            ...x,
            typeTitle: x.type === 0 ? this.$t('product') : this.$t('service'),
            type: x.type,
            salesPrice: salesPrice
          }
        })
      } else {
        this.setErrorMessage(response.message || this.$t('errorLoadingProducts'))
      }
    },

    selectProduct() {
      if (this.selectedRow && this.selectedRow.product) {
        this.selectedProduct = { ...this.selectedRow.product }
        this.discountEntity.productAccountId = this.selectedProduct.id
        this.showProductSelectionDialog = false
      }
    },

    clearProduct() {
      if (this.action === 0) return
      
      this.selectedProduct = null
      this.discountEntity.productAccountId = null
    },

    updateProductOrService(item) {
      if (item.type === 0) this.$router.push('/warehouse/products/' + item.id)
      else this.$router.push('/warehouse/services/' + item.id)
      this.showProductSelectionDialog = false
    },

    async saveDiscount() {
      const { valid } = await this.$refs.frm.validate()
      if (!valid) return
  
      this.loading = true
      const formData = { ...this.discountEntity }
      
      formData.customerAccountId = this.customerEntity?.selectedAccount?.accountId || 
                                    this.customerEntity?.selectedAccount?.id || null
      formData.productAccountId = this.selectedProduct?.id || null
      
      formData.limitationType = 0
      formData.limitationTimes = 0
      formData.discountType = 0
      formData.maximumDiscountedQuantity = 0

      let response
      if (this.isNewDiscount) {
        response = await discountService.create(formData)
      } else {
        response = await discountService.update(formData)
      }

      if (response.isSuccess) {
        this.setErrorMessage(
          this.isNewDiscount 
            ? this.$t('discountCreatedSuccessfully') 
            : this.$t('discountUpdatedSuccessfully'), 
          'success'
        )
        this.$router.push('/shop/discounts')
      } else {
        this.setErrorMessage(response.errors?.[0]?.message || this.$t('errorSavingDiscount'))
      }
    }
  }
}
</script>

<style scoped>
.v-card-subtitle {
  opacity: 0.7;
  font-size: 0.875rem;
}

.discount-status-switch :deep(input:checked + .slider) {
  background-color: rgba(76, 175, 80, 0.3);
}

.discount-status-switch :deep(input:checked + .slider #slide-toggle) {
  background-color: rgb(76, 175, 80);
}

.discount-status-switch :deep(input:not(:checked) + .slider) {
  background-color: rgba(244, 67, 54, 0.3);
}

.discount-status-switch :deep(input:not(:checked) + .slider #slide-toggle) {
  background-color: rgb(244, 67, 54);
}
</style>