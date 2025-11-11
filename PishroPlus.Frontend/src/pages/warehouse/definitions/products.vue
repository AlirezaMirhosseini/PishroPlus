<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters class="flex-column">
        <v-window :touch="false" v-model="tab" style="width: 100%">
          <v-window-item :value="0">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :headers="headers"
                :items="products"
                :hasSearch="true"
                :searchItems="['code', 'title', 'categoryTitle', 'desc']"
                :clickableRow="true"
              >
                <template v-slot:column_code="{ entity }">
                  <v-tooltip :text="$t('productDetails')">
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        variant="text"
                        color="info"
                        size="x-small"
                        :to="`/warehouse/productDetails/${entity.id}`"
                        >{{ entity.code }}</v-btn
                      >
                      <!-- ${entity.id} -->
                    </template>
                  </v-tooltip>
                </template>
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      to="/warehouse/products/new"
                      prepend-icon="mdi mdi-shopping-outline"
                      variant="tonal"
                      color="info"
                      >{{ $t('addProduct') }}</v-btn
                    >
                  </v-row>
                  <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4">
                    <v-select
                      hide-details
                      :label="$t('category')"
                      :no-data-text="$t('noItems')"
                      variant="outlined"
                      density="compact"
                      :loading="false"
                      style="max-width: 250px"
                      :items="productCategories"
                      item-value="parentDetailedAccountId"
                      item-title="parentDetailedAccountName"
                      v-model="selectedCategoryAccountFilterId"
                      @update:modelValue="searchProducts"
                    ></v-select>
                  </v-col>
                  <v-col md="4" lg="3" sm="6" cols="12" class="px-1 py-4">
                    <v-select
                      hide-details
                      :label="$t('warehouse')"
                      :no-data-text="$t('noItems')"
                      variant="outlined"
                      density="compact"
                      :loading="false"
                      style="max-width: 250px"
                      :items="warehouseItems"
                      item-title="title"
                      item-value="id"
                      v-model="selectedWarehouseId"
                      @update:modelValue="(val) => getProductsByWarehouse(val)"
                    ></v-select>
                  </v-col>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ products.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_stock="{ entity }">
                  <p v-if="selectedWarehouseId">
                    {{
                      entity.stocks?.find((s) => s.warehouseId == selectedWarehouseId)?.amount || 0
                    }}
                  </p>
                  <template v-else>
                    <v-tooltip
                      v-if="entity?.stocks?.length > 0"
                      :text="
                        entity?.stocks
                          ?.map((s) => `${s.warehouse?.title ?? ''} : ${s.amount}`)
                          ?.join(' - ')
                      "
                    >
                      <template v-slot:activator="{ props }">
                        <p v-bind="props">
                          {{ entity.stock }}
                        </p>
                      </template>
                    </v-tooltip>
                    <p v-else>{{ entity.stock }}</p>
                  </template>
                </template>
                <template v-slot:column_image="{ entity }">
                  <v-avatar
                    :image="entity.image?.data ? `${entity.image.data}` : productImage"
                  ></v-avatar>
                </template>
                <template v-slot:column_categoryTitle="{ entity }">
                  {{ entity.parentDetailedAccount?.name }}
                </template>
                <template v-slot:column_barcode="{ entity }">
                  {{ entity.units?.find((x) => x.isDefault)?.barcode }}
                </template>
                <template v-slot:column_unit="{ entity }">
                  <v-tooltip :text="entity.units?.map((u) => u.title).join('، ')">
                    <template v-slot:activator="{ props }">
                      <p v-bind="props">
                        {{ entity.units?.find((x) => x.isDefault)?.title }}
                      </p>
                    </template>
                  </v-tooltip>
                </template>
                <template v-slot:column_purchasePrice="{ entity }">
                  <div class="d-flex align-center ga-1 justify-center">
                    <p>
                      {{ entity.prices?.find((p) => p.type == 0)?.price?.toLocaleString() || 0 }}
                    </p>
                    <p class="pishro-caption">
                      {{ entity.prices?.find((p) => p.type == 0)?.currency.name }}
                    </p>
                  </div>
                </template>
                <template v-slot:column_salesPrice="{ entity }">
                  <div class="d-flex align-center ga-1 justify-center">
                    <p>
                      {{ entity.prices?.find((p) => p.type == 1)?.price?.toLocaleString() || 0 }}
                    </p>
                    <p class="pishro-caption">
                      {{ entity.prices?.find((p) => p.type == 1)?.currency.name }}
                    </p>
                  </div>
                </template>
                <template v-slot:column_status="{ entity, index }">
                  <div class="d-flex justify-center">
                    <v-switch
                      :model-value="entity.status"
                      :false-value="1"
                      :true-value="0"
                      hide-details
                      density="compact"
                      color="primary"
                      @update:modelValue="(v) => changeProductStatus(v, index)"
                    >
                      <template #label>
                        <span class="text-success" v-if="entity.status === 0">{{
                          $t('active')
                        }}</span>
                        <span class="text-warning" v-else>{{ $t('inActive') }}</span>
                      </template>
                    </v-switch>
                  </div>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-row class="d-none d-md-flex justify-center" style="width: 90px">
                    <v-tooltip :text="$t('editProduct')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi mdi-square-edit-outline"
                          variant="text"
                          color="info"
                          size="x-small"
                          :to="`/warehouse/products/${entity.id}`"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="$t('deleteProduct')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="deleteIcon"
                          variant="text"
                          color="error"
                          size="x-small"
                          @click="() => openDeleteDialog(entity)"
                        />
                      </template>
                    </v-tooltip>
                  </v-row>
                  <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                    <v-btn size="x-small" icon="mdi-dots-vertical" color="grey" variant="text">
                      <v-icon icon="mdi-dots-vertical" variant="text" />
                      <v-menu activator="parent">
                        <v-list density="compact">
                          <v-list-item
                            density="compact"
                            :title="$t('editProduct')"
                            :to="`/warehouse/products/${entity.id}`"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                            </template>
                          </v-list-item>
                          <v-list-item
                            density="compact"
                            :title="$t('deleteProduct')"
                            @click.prevent="() => openDeleteDialog(entity)"
                          >
                            <template v-slot:prepend>
                              <v-icon :icon="deleteIcon" color="error" />
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </v-row>
                </template>
              </data-table>
            </v-col>
          </v-window-item>
          <v-window-item :value="1">
            <v-col cols="12" class="align-start pa-2" no-gutters>
              <data-table
                :headers="headers?.filter((h) => h.key != 'stock')"
                :items="services"
                :hasSearch="true"
                :searchItems="['code', 'title', 'categoryTitle', 'desc']"
                :clickableRow="true"
              >
                <template v-slot:toolbar>
                  <v-row class="ps-2" no-gutters>
                    <v-btn
                      to="/warehouse/services/new"
                      prepend-icon="mdi mdi-account-wrench-outline"
                      variant="tonal"
                      color="info"
                      >{{ $t('addService') }}</v-btn
                    >
                  </v-row>
                </template>
                <template v-slot:column_index="{ entity }">
                  {{ services.indexOf(entity) + 1 }}
                </template>
                <template v-slot:column_categoryTitle="{ entity }">
                  {{ entity.parentDetailedAccount?.name }}
                </template>
                <template v-slot:column_image="{ entity }">
                  <v-avatar
                    :image="entity.image?.data ? `${entity.image.data}` : productImage"
                  ></v-avatar>
                </template>
                <template v-slot:column_barcode="{ entity }">
                  {{ entity.units?.find((x) => x.isDefault)?.title }}
                </template>
                <template v-slot:column_purchasePrice="{ entity }">
                  <div class="d-flex align-center ga-1 justify-center">
                    <p>
                      {{ entity.prices?.find((p) => p.type == 0)?.price?.toLocaleString() || 0 }}
                    </p>
                    <p class="pishro-caption">
                      {{ entity.prices?.find((p) => p.type == 0)?.currency.name }}
                    </p>
                  </div>
                </template>
                <template v-slot:column_salesPrice="{ entity }">
                  <div class="d-flex align-center ga-1 justify-center">
                    <p>
                      {{ entity.prices?.find((p) => p.type == 1)?.price?.toLocaleString() || 0 }}
                    </p>
                    <p class="pishro-caption">
                      {{ entity.prices?.find((p) => p.type == 1)?.currency.name }}
                    </p>
                  </div>
                </template>
                <template v-slot:column_operations="{ entity }">
                  <v-row class="d-none d-md-flex justify-center" style="width: 90px">
                    <v-tooltip :text="entity.type == 0 ? $t('editProduct') : $t('editService')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          icon="mdi mdi-square-edit-outline"
                          variant="text"
                          color="info"
                          size="x-small"
                          :to="`/warehouse/services/${entity.id}`"
                        />
                      </template>
                    </v-tooltip>
                    <v-tooltip :text="$t('deleteService')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-bind="props"
                          :icon="deleteIcon"
                          variant="text"
                          color="error"
                          size="x-small"
                          @click="() => openDeleteDialog(entity)"
                        />
                      </template>
                    </v-tooltip>
                  </v-row>
                  <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                    <v-btn size="x-small" icon="mdi-dots-vertical" color="grey" variant="text">
                      <v-icon icon="mdi-dots-vertical" variant="text" />
                      <v-menu activator="parent">
                        <v-list density="compact">
                          <v-list-item
                            density="compact"
                            :title="$t('editService')"
                            :to="`/warehouse/products/${entity.id}`"
                          >
                            <template v-slot:prepend>
                              <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                            </template>
                          </v-list-item>
                          <v-list-item
                            density="compact"
                            :title="$t('deleteService')"
                            @click.prevent="() => openDeleteDialog(entity)"
                          >
                            <template v-slot:prepend>
                              <v-icon :icon="deleteIcon" color="error" />
                            </template>
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </v-btn>
                  </v-row>
                </template>
              </data-table>
            </v-col>
          </v-window-item>
        </v-window>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import productService from '../../../../api/product/productService'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import productImage from '../../../assets/images/product.png'
import deleteIcon from '../../../components/icons/Delete.vue'
import { markRaw } from 'vue'
import warehouseService from '../../../../api/warehouse/warehouseService'
import detailedAccountService from '../../../../api/detailedAccount/detailedAccountService'
import mediaService from '../../../../api/media/mediaService'

export default {
  data() {
    return {
      productCategories: [
        { parentDetailedAccountName: this.$t('all'), parentDetailedAccountId: null }
      ],
      warehouseItems: [{ title: this.$t('all'), id: null }],
      selectedWarehouseId: null,
      selectedCategoryAccountFilterId: null,
      productImage: productImage,
      deleteIcon: markRaw(deleteIcon),
      tab: 0,
      products: [],
      services: [],
      headers: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '70px'
        },
        {
          title: this.$t('image'),
          align: 'center',
          key: 'image',
          width: '0'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '200px'
        },
        {
          title: this.$t('stockAmount'),
          align: 'center',
          sortable: true,
          key: 'stock',
          width: '100px'
        },
        {
          title: this.$t('shopDisplayName'),
          align: 'center',
          sortable: true,
          key: 'shopDisplayName',
          width: '200px'
        },
        {
          title: this.$t('category'),
          align: 'center',
          sortable: true,
          key: 'categoryTitle',
          width: '200px'
        },
        {
          title: this.$t('purchasePrice'),
          align: 'center',
          sortable: true,
          key: 'purchasePrice',
          width: '100px'
        },
        {
          title: this.$t('salesPrice'),
          align: 'center',
          sortable: true,
          key: 'salesPrice',
          width: '100px'
        },
        {
          title: this.$t('mainBarcode'),
          align: 'center',
          sortable: true,
          key: 'barcode',
          width: '100px'
        },
        {
          title: this.$t('mainUnit'),
          align: 'center',
          sortable: true,
          key: 'unit',
          width: '100px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'status',
          width: '100px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ]
    }
  },
  watch: {
    // selectedWarehouseId(val) {
    //   this.$router.push({
    //     path: this.currentActiveTab.path,
    //     query: val ? { warehouseId: val } : null
    //   })
    //   this.getAllData(this.tab)
    // }
    async products(val) {
      for (let index = 0; index < val.length; index++) {
        const item = val[index]
        if (item?.image) {
          let img = item.image
          this.setSkipLoading(true)
          const res = await mediaService.getMedia(img.name)
          if (res.data?.isSuccess) {
            img.data = `data:image/image/jpeg;base64,${res.data?.value}`
          }
          this.setSkipLoading(false)
        }
      }
    },
    async services(val) {
      for (let index = 0; index < val.length; index++) {
        const item = val[index]
        if (item?.image) {
          let img = item.image
          this.setSkipLoading(true)
          const res = await mediaService.getMedia(img.name)
          if (res.data?.isSuccess) {
            img.data = `data:image/image/jpeg;base64,${res.data?.value}`
          }
          this.setSkipLoading(false)
        }
      }
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      setSkipLoading: 'setSkipLoading'
    }),
    openDeleteDialog(item) {
      this.setWarningDialog(
        true,
        item.type == 0 ? this.$t('deleteProduct') : this.$t('deleteService'),
        this.$t('confirmDeleteMessage'),
        () => this.deleteProduct(item)
      )
    },
    clearWarehouseFilter() {},
    async changeProductStatus(v, index) {
      if (!this.products[index]) return
      this.products[index].status = v
      let res = await productService.changeStatus({
        ids: [this.products[index].id],
        status: v
      })
      if (res.isSuccess) {
        this.setErrorMessage(this.$t('opeartionWasSuccessful'), 'success')
      } else {
        this.products[index].status = !v
      }
    },
    async deleteProduct(item) {
      await productService.delete({ id: item.id }).then((res) => {
        if (res == '') {
          this.setErrorMessage(
            item.type == 0
              ? this.$t('productDeletedSuccessfully')
              : this.$t('serviceDeletedSuccessfully'),
            'success'
          )
          this.closeWarning()
          this.getAllData(this.tab)
        } else this.setErrorMessage(res.message)
      })
    },
    async getAllData(type) {
      await productService
        .getAll(type, this.$route.query.warehouseId, 1, 1000, this.selectedCategoryAccountFilterId)
        .then((res) => {
          if (res.isSuccess) {
            if (type == 0) this.products = res.value?.result
            else this.services = res.value?.result

            this.productCategories = [
              { parentDetailedAccountName: this.$t('all'), parentDetailedAccountId: null },
              ...res.value?.result
                ?.map((x) => {
                  return {
                    parentDetailedAccountName: x.parentDetailedAccount.name,
                    parentDetailedAccountId: x.parentDetailedAccount.id
                  }
                })
                .reduce((acc, current) => {
                  const x = acc.find(
                    (item) => item.parentDetailedAccountId === current.parentDetailedAccountId
                  )
                  if (!x) {
                    acc.push(current)
                  }
                  return acc
                }, [])
            ]
          } else this.setErrorMessage(res.message)
        })
    },
    async getWarehouseItems(searchText) {
      await warehouseService.getAll(1, 10, searchText).then((res) => {
        if (res.isSuccess) {
          this.warehouseItems = [{ title: this.$t('all'), id: null }, ...res.value?.result]
        } else this.setErrorMessage(res.message)
      })
    },
    async getProductsByWarehouse(warehouseId) {
      if (warehouseId)
        await productService
          .getAll(this.tab, warehouseId, 1, 1000, this.selectedCategoryAccountFilterId)
          .then((res) => {
            if (res.isSuccess) this.products = res.value?.result
            else this.setErrorMessage(res.message)
          })
      else await this.searchProducts()
    },
    async searchProducts(value) {
      await productService
        .getAll(this.tab, this.selectedWarehouseId, 1, 1000, this.selectedCategoryAccountFilterId)
        .then((res) => {
          if (res.isSuccess) {
            if (this.tab == 0) this.products = res.value?.result
            else this.services = res.value?.result
          } else this.setErrorMessage(res.message)
        })

      // await productService
      //   .search({
      //     entity: {
      //       parentDetailedAccountId: this.selectedCategoryAccountFilterId
      //     }
      //   })
      //   .then(async (res) => {
      //     if (res.isSuccess) {
      //       this.products = res.entities.map((x) => {
      //         return {
      //           ...x,
      //           checked: x.warehouses.some((x) => x.id == this.selectedWarehouseId) || false,
      //           typeTitle: x.type === 0 ? this.$t('product') : this.$t('service'),
      //           type: x.type
      //         }
      //       })
      //     } else this.setErrorMessage(res.message)
      //   })
    }
  },
  async mounted() {
    await this.getWarehouseItems()
    this.tab = this.currentActiveTab.params.type === 'products' ? 0 : 1
    if (this.currentActiveTab.query.warehouseId) {
      this.selectedWarehouseId = this.currentActiveTab.query.warehouseId
      this.getProductsByWarehouse(this.currentActiveTab.query.warehouseId)
    } else await this.getAllData(this.tab)
  },
  components: {
    reportOutput,
    dataTable
  }
}
</script>

<style></style>
