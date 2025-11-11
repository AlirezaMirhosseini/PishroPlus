<!-- <template>
  <v-card class="mb-auto">
    <v-card-text>
      <v-form ref="frm">
        <v-row no-gutters justify="end">
          <v-col cols="12" sm="6" lg="3" md="4" class="d-flex px-1">
            <v-text-field
              name="code"
              v-model="newPurchaseEntity.code"
              :disabled="isAutoCode"
              :rules="[
                (v) => {
                  if (v || isAutoCode) return true
                  return $t('enterRequiredField')
                }
              ]"
              variant="outlined"
              :label="$t('invoiceCode')"
              density="compact"
              class="ml-2"
            >
            </v-text-field>
            <switch-button
              v-show="isNewInvoice"
              class="mt-1 ml-2"
              v-model:checked="isAutoCode"
              :label="isAutoCode ? $t('automatic') : $t('manual')"
            />
          </v-col>
          <v-col cols="12" sm="6" lg="3" md="4" class="px-1 pb-5">
            <date-picker
              :editable="true"
              v-model="newPurchaseEntity.dateTime"
              format="YYYY-MM-DD"
              display-format="jYYYY/jMM/jDD"
              :label="$t('invoiceDate')"
              locale="fa,en"
              ref="datePicker"
            />
          </v-col>
          <v-col cols="12" sm="6" lg="3" md="4" class="px-1">
            <AccountSelector
              v-model="customerEntity"
              :title="$t('customer')"
              :persistent="false"
              addNewRoute="/persons/new"
              @editItemClicked="updateItems"
            />
          </v-col>
          <v-spacer></v-spacer>
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
            <v-col cols="12" sm="6" lg="3" md="4" class="px-1">
              <v-text-field
                name="title"
                :label="$t('title')"
                variant="outlined"
                density="compact"
                ref="title"
                v-model="newPurchaseEntity.title"
                :rules="[
                  (v) => {
                    if (v) return true
                    return $t('enterRequiredField')
                  }
                ]"
              >
              </v-text-field>
            </v-col>
            <v-col cols="12" sm="6" lg="3" md="4" class="px-1 pb-5">
              <date-picker
                :editable="true"
                v-model="newPurchaseEntity.dueDateTime"
                format="YYYY-MM-DD"
                display-format="jYYYY/jMM/jDD"
                :label="$t('dueDate')"
                locale="fa,en"
                ref="dueDatePicker"
              />
            </v-col>
            <v-col cols="12" sm="6" lg="3" md="4" class="px-1">
              <v-select
                density="compact"
                :label="$t('currencyUnit')"
                hide-details
                variant="outlined"
                disabled
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6" lg="3" md="4" class="px-1">
              <v-row no-gutters>
                <v-col cols="12" md="8">
                  <AccountSelector
                    :persistent="false"
                    v-model="marketerEntity"
                    :title="`${$t('marketer')}/${$t('visitor')}`"
                    tabindex="-1"
                    addNewRoute="/persons/new"
                  />
                </v-col>
                <v-col cols="12" md="4" class="pr-1">
                  <v-text-field
                    v-if="marketerEntity.type === 0"
                    hide-details
                    :disabled="
                      !marketerEntity.selectedAccount || !marketerEntity.selectedAccount.accountId
                    "
                    bg-color="transparent"
                    density="compact"
                    variant="outlined"
                    :model-value="marketerEntity.marketingPercent"
                    @change="
                      (ev) => (marketerEntity.marketingPercent = parseFloat(ev.target.value))
                    "
                  >
                    <template v-slot:append-inner>
                      <v-icon
                        icon="mdi-percent"
                        size="x-small"
                        @click=";(marketerEntity.marketingPercent = 0), (marketerEntity.type = 1)"
                      ></v-icon>
                    </template>
                  </v-text-field>
                  <v-text-field
                    v-else
                    hide-details
                    :disabled="
                      !marketerEntity.selectedAccount || !marketerEntity.selectedAccount.accountId
                    "
                    bg-color="transparent"
                    density="compact"
                    variant="outlined"
                    v-maska:[maskOptions]
                    :model-value="marketerEntity.marketingAmount || 0"
                    @maska="
                      (ev) => (marketerEntity.marketingAmount = parseFloat(ev.detail.unmasked))
                    "
                  >
                    <template v-slot:append-inner>
                      <v-icon
                        icon="mdi-cash"
                        size="x-small"
                        @click=";(marketerEntity.marketingAmount = 0), (marketerEntity.type = 0)"
                      ></v-icon>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-slide-y-transition>
        <v-row no-gutters class="mt-5">
          <v-col cols="12" class="px-1">
            <data-table
              :hasSearch="true"
              :searchItems="['name', 'product', 'desc', 'warehouse']"
              class="invoice-items-table"
              :headers="invoiceItemHeaders"
              :items="invoiceItems"
              :showPagination="false"
            >
              <template v-slot:toolbar>
                <v-row class="align-center pa-2" no-gutters>
                  <v-btn
                    prepend-icon="mdi-plus"
                    class="ml-2"
                    color="info"
                    variant="tonal"
                    tabindex="-1"
                    @click="addNewRow"
                    >{{ $t('addRow') }}</v-btn
                  >
                  <v-menu
                    width="150"
                    :close-on-content-click="false"
                    v-model="showScanBarcodeMenu"
                    location="end"
                  >
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
                    <v-card width="300px" class="mr-1">
                      <v-text-field
                        ref="barcodeField"
                        density="compact"
                        hide-details
                        height="44"
                        variant="outlined"
                        append-inner-icon="mdi-barcode"
                        @blur="showScanBarcodeMenu = false"
                        v-model="barcode"
                        @keydown.enter="getProductByBarcode"
                      ></v-text-field> </v-card
                  ></v-menu>
                </v-row>
              </template>
              <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
              <template v-slot:column_product="{ index }">
                <v-text-field
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  append-inner-icon="mdi mdi-open-in-new"
                  @click:append-inner="openProductDialog(index)"
                  @keyup.enter="openProductDialog(index)"
                  v-model="invoiceItems[index].productTitle"
                  style="margin: -10px"
                  :ref="`product_${index}`"
                />
              </template>
              <template v-slot:column_desc="{ entity, index }">
                <v-text-field
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  :ref="`desc_${index}`"
                  :model-value="entity.desc"
                  @change="(ev) => (invoiceItems[index].desc = ev.target.value)"
                  style="margin: -10px"
                />
              </template>
              <template v-slot:column_warehouse="{ entity, index }">
                <v-select
                  density="compact"
                  bg-color="transparent"
                  hide-details
                  :items="entity.product?.warehouses || []"
                  item-value="id"
                  variant="solo"
                  item-title="title"
                  :no-data-text="$t('noDataAvailable')"
                  v-model="invoiceItems[index].warehouseId"
                  :disabled="!entity.product?.warehouses?.length"
                ></v-select>
              </template>
              <template v-slot:column_unit="{ entity, index }">
                <v-text-field
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  readonly
                  :model-value="entity.unit?.title"
                  style="margin: -10px"
                >
                  <template v-slot:append-inner v-if="entity.product?.units?.some((x) => !x.isDefault)">
                    <v-menu open-on-hover width="150">
                      <template v-slot:activator="{ props }">
                        <v-icon size="x-small" v-bind="props" class="c-pointer">mdi-menu</v-icon>
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          v-for="(unit, idx) in entity.product?.units.filter(
                            (x) => x.id !== entity.unit.id
                          )"
                          :key="idx"
                          @click="changeUnit(entity, index, unit)"
                        >
                          <v-list-item-title>
                            {{ `${unit.title}` }}
                            {{
                              entity.unit.id === entity.product?.units?.find((x) => x.isDefault).id
                                ? `(${
                                    unit.conversionFactor +
                                    entity.product?.units?.find((x) => x.isDefault)?.title
                                  })`
                                : ''
                            }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
              </template>
              <template v-slot:column_value="{ entity, index }">
                <v-text-field
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  :model-value="entity.amount"
                  @change="(ev) => (invoiceItems[index].amount = parseFloat(ev.target.value || 0))"
                  style="margin: -10px"
                >
                  <template v-slot:append-inner v-if="!entity.unit?.isDefault">
                    <span style="font-size: 8pt; color: grey">
                      x {{ entity.unit?.conversionFactor }}
                      {{ entity.product?.units?.find((x) => x.isDefault)?.title }}
                    </span>
                  </template>
                </v-text-field>
              </template>
              <template v-slot:column_price="{ entity, index }">
                <v-text-field
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  v-maska:[maskOptions]
                  :model-value="entity.price"
                  @maska="(ev) => (invoiceItems[index].price = parseFloat(ev.detail.unmasked || 0))"
                  style="margin: -10px"
                >
                  <template v-slot:append-inner>
                    <v-menu
                      open-on-hover
                      width="150"
                      v-if="entity.product?.salesPrice || entity.product?.otherPrices"
                    >
                      <template v-slot:activator="{ props }">
                        <v-icon size="x-small" v-bind="props" class="c-pointer">mdi-menu</v-icon>
                      </template>
                      <v-list density="compact">
                        <v-list-item
                          @click="
                            invoiceItems[index].price = parseFloat(entity.product?.salesPrice)
                          "
                          v-if="entity.product?.salesPrice"
                        >
                          <v-list-item-title
                            >{{ $t('sale') }} :
                            {{ entity.product?.salesPrice.toLocaleString() }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          v-for="(item, idx) in entity.product?.otherPrices"
                          :key="idx"
                          @click="invoiceItems[index].price = parseFloat(item.price)"
                        >
                          <v-list-item-title
                            >{{ item.title }} : {{ item.price.toLocaleString() }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
              </template>
              <template v-slot:column_discount="{ entity, index }">
                <v-text-field
                  v-if="invoiceItems[index].discountType === 1"
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  :model-value="entity.discountPercent"
                  @change="
                    (ev) => (
                      (invoiceItems[index].discountPercent = parseFloat(ev.target.value)),
                      calcItemDiscountAmount(entity, index, 0)
                    )
                  "
                  style="margin: -10px"
                >
                  <template v-slot:append-inner>
                    <v-icon
                      icon="mdi-percent"
                      size="x-small"
                      @click="switchDiscountType(entity, index, 0)"
                    ></v-icon>
                  </template>
                </v-text-field>
                <v-text-field
                  v-else
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  v-maska:[maskOptions]
                  :model-value="entity.discountAmount || 0"
                  @maska="
                    (ev) => (invoiceItems[index].discountAmount = parseFloat(ev.detail.unmasked))
                  "
                  style="margin: -10px"
                >
                  <template v-slot:append-inner>
                    <v-icon
                      icon="mdi-cash"
                      size="x-small"
                      @click="switchDiscountType(entity, index, 1)"
                    ></v-icon>
                  </template>
                </v-text-field>
              </template>
              <template v-slot:column_tax="{ entity, index }">
                <div class="d-flex">
                  <v-checkbox
                    v-show="entity.product?.salesTax"
                    density="compact"
                    hide-details
                    :model-value="!isNewInvoice ? invoiceItems[index].performTaxAmount : true"
                    @change="(ev) => (invoiceItems[index].performTaxAmount = ev.target.checked)"
                  ></v-checkbox>
                  <v-text-field
                    hide-details
                    bg-color="transparent"
                    density="compact"
                    variant="solo"
                    readonly
                    tabindex="-1"
                    :model-value="entity.product?.salesTax"
                    style="margin: -10px"
                  >
                    <template v-slot:append-inner>
                      <v-icon icon="mdi-percent" size="x-small"></v-icon>
                    </template>
                  </v-text-field>
                </div>
              </template>
              <template v-slot:column_totalAmount="{ entity, index }">
                <div style="margin: -10px">
                  {{ caclItemTotalAmount(entity, index).toLocaleString() }}
                </div>
              </template>
              <template v-slot:column_operation="{ entity, index }">
                <v-btn
                  class="ms-2"
                  :icon="deleteIcon"
                  variant="text"
                  color="error"
                  size="x-small"
                  tabindex="-1"
                  @click="() => deleteRow(entity, index)"
                />
              </template>
            </data-table>
            <v-row no-gutters>
              <v-col cols="12" md="9" class="pishro-border">
                <v-tabs v-model="tab" color="primary" align-tabs="start">
                  <v-tab v-for="item in tabItems" :value="item.title" :key="item.title"
                    ><v-icon
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
                    </p></v-tab
                  >
                </v-tabs>
                <v-window :touch="false" v-model="tab" style="width: 100%">
                  <v-window-item value="invoiceSettlement" class="pa-2">
                    <data-table
                      :headers="settlementItemHeaders"
                      :showPagination="false"
                      :items="settlementItems"
                    >
                      <template #toolbar>
                        <p class="ma-2" style="font-weight: bold">{{ $t('receives') }}</p>
                        <v-spacer></v-spacer>
                      </template>
                      <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
                      <template v-slot:column_type="{ entity }"
                        >{{ getDepositTypeTitle(entity) }}
                      </template>
                      <template v-slot:column_amount="{ entity }">
                        {{ entity.amountMasked.masked }}
                      </template>
                      <template v-slot:column_operations="{ index }">
                        <v-btn
                          variant="text"
                          color="error"
                          height="45"
                          :icon="deleteIcon"
                          @click="settlementItems.splice(index, 1)"
                        ></v-btn>
                      </template>
                    </data-table>
                    <v-row no-gutters justify="end" class="px-1">
                      <span
                        >{{ $t('totalReceives') }}:
                        <span class="text-primary">{{
                          newPurchaseEntity.payedAmount?.toLocaleString()
                        }}</span></span
                      >
                    </v-row>
                  </v-window-item>
                  <v-window-item value="description" class="pa-2">
                    <v-textarea
                      v-model="newPurchaseEntity.desc"
                      variant="outlined"
                      rows="1"
                      hide-details
                      tabIndex="-1"
                      :label="`${$t('description')} ${$t('factor')}`"
                    ></v-textarea>
                  </v-window-item>
                  <v-window-item :eager="true" value="transportation" class="pa-2">
                    <v-col cols="6" sm="6" lg="3" md="4">
                      <AccountSelector
                        v-model="transportationEntity"
                        :title="$t('person')"
                        max-width="300px"
                        addNewRoute="/persons/new"
                      />
                      <v-text-field
                        :label="$t('cost')"
                        variant="outlined"
                        density="compact"
                        ref="transportation-cost"
                        v-maska:[maskOptions]
                        :model-value="transportationEntity.cost"
                        @maska="
                          (ev) => (transportationEntity.cost = parseFloat(ev.detail.unmasked || 0))
                        "
                        style="max-width: 300px"
                      ></v-text-field>
                    </v-col>
                  </v-window-item>
                </v-window>
              </v-col>
              <v-col cols="12" md="3" class="pr-md-1">
                <v-card variant="flat" class="pishro-border" min-height="200px" width="100%">
                  <table class="w-100 result-tbl">
                    <tr>
                      <th width="50%" height="35" class="text-center">{{ $t('value') }}</th>
                      <td width="50%" class="text-center">
                        {{ invoiceItems.filter((x) => x.product).length }}
                      </td>
                    </tr>
                    <tr>
                      <th width="50%" height="35" class="text-center">{{ $t('total') }}</th>
                      <td width="50%" class="text-center">
                        {{ totalAmount.toLocaleString() }}
                      </td>
                    </tr>

                    <tr>
                      <th width="50%" height="35" class="text-center">{{ $t('tax') }}</th>
                      <td width="50%" class="text-center">
                        {{ totalTax.toLocaleString() }}
                      </td>
                    </tr>
                    <tr v-if="transportationEntity.cost > 0">
                      <th width="50%" height="35" class="text-center">
                        {{ $t('transportation') }}
                      </th>
                      <td width="50%" class="text-center">
                        {{ transportationEntity.cost.toLocaleString() }}
                      </td>
                    </tr>
                    <tr v-if="totalAdditions > 0">
                      <th width="50%" height="35" class="text-center">{{ $t('additions') }}</th>
                      <td width="50%" class="text-center">
                        {{ totalAdditions.toLocaleString() }}
                      </td>
                    </tr>

                    <tr v-if="totalDeductions > 0">
                      <th width="50%" height="35" class="text-center">{{ $t('deductions') }}</th>
                      <td width="50%" class="text-center text-error">
                        {{ totalDeductions.toLocaleString() }}
                      </td>
                    </tr>

                    <tr>
                      <th width="50%" height="35" class="text-center">{{ $t('discount') }}</th>
                      <td width="50%" class="text-center text-red">
                        {{ totalDiscount.toLocaleString() }}
                      </td>
                    </tr>
                    <tr>
                      <th width="50%" height="35" class="text-center border-none">
                        {{ $t('totalAmount') }}
                      </th>
                      <td width="50%" class="text-center text-primary border-none">
                        {{ totalPayableAmount.toLocaleString() }}
                      </td>
                    </tr>
                  </table>
                </v-card>
                <v-row class="justify-end py-2" no-gutters>
                  <v-btn
                    @click="createOrUpdate(false)"
                    :prepend-icon="saveIcon"
                    color="info"
                    class="ma-1"
                    :disabled="!formIsValid"
                    >{{ $t('save') }}</v-btn
                  >
                  <v-btn
                    :prepend-icon="saveIcon"
                    color="info"
                    variant="outlined"
                    class="ma-1"
                    :disabled="!formIsValid"
                    @click.prevent="createOrUpdate(true)"
                    >{{ $t('saveAsDraftInvoice') }}</v-btn
                  >
                </v-row>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
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
        <div class="d-flex justify-space-between">
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
          <div class="d-flex justify-end ga-2">
            <v-btn
              color="info"
              to="/warehouse/products/new"
              @click="showProductSelectionDialog = false"
              variant="tonal"
              >{{ $t('addProduct') }}</v-btn
            >
            <v-btn
              color="primary"
              to="/warehouse/services/new"
              @click="showProductSelectionDialog = false"
              variant="tonal"
              >{{ $t('addService') }}</v-btn
            >
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
          <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
          <template v-slot:column_salesPrice="{ entity }">
            {{ entity.salesPrice?.toLocaleString() || '' }}
          </template>
          <template v-slot:column_operation="{ entity }">
            <v-row class="d-none d-md-flex justify-center" no-gutters>
              <v-tooltip :text="$t('editProductOrService')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi mdi-square-edit-outline"
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
          <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog close-on-back v-model="showAccountDialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="paperIcon" />
        <p style="font-weight: bold">
          {{ $t('selectAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="showAccountDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <p>{{ $t('selectConnectedMoeinMessage') }}</p>
        <data-table
          id="accounts-dt"
          :headers="accountsHeaders"
          :items="accounts"
          :clickableRow="true"
          :selectableRow="true"
          :hasEnter="showAccountDialog"
          itemValue="accountId"
          @enterMethod="selectAccount"
          v-model:selectedRow="selectedAccount"
        >
          <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
        </data-table>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="selectAccount" variant="flat" color="info">{{ $t('select') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="showSettlementDecisionDialog" width="500px">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" color="info" icon="mdi-note-check" />
        <p style="font-weight: bold">
          {{ `${!saveAsDraft ? $t('submitInvoice') : $t('submitDraftInvoice')}` }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="showSettlementDecisionDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="pt-0">
        <div class="text-center">
          <v-icon color="success">mdi-check</v-icon>
        </div>
        <p class="text-center">{{ $t('invoiceSuccessfullyCreated') }}</p>
        <p class="text-center mb-3">{{ $t('invoiceCode') }}: {{ createdInvoiceEntity.code }}</p>
      </v-card-text>
      <v-card-actions class="dialog-bottombar">
        <v-row no-gutters justify="space-between">
          <v-btn color="info" width="150" to="/purchase/purchaseInvoices" variant="elevated"
            ><v-icon class="ml-1">mdi-chevron-right</v-icon>
            {{ $t('confirm') + '/' + $t('continue') }}</v-btn
          >
          <v-btn
            color="info"
            variant="elevated"
            width="150"
            @click="this.$router.push('/purchase/newPurchase')"
            ><v-icon class="ml-1">mdi-autorenew</v-icon>{{ $t('newInvoice') }}</v-btn
          >
          <v-btn color="primary" width="150" @click="navToInvoiceSettlement" variant="elevated"
            ><v-icon class="ml-1">mdi-cash-register</v-icon>{{ $t('invoiceSettlement') }}</v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import utils from '../../../plugins/utils.js'
import switchButton from '../../components/baseComponents/switchButton.vue'
import DeleteIcon from '../../components/icons/Delete.vue'
import PersonIcon from '../../components/icons/Person.vue'
import SaveIcon from '../../components/icons/Save.vue'
import PaperIcon from '../../components/icons/Paper.vue'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import productService from '../../../api/product/productService'
import AccountSelector from '../../components/accountsComponents/accountSelector.vue'
import productImage from '../../assets/images/product.png'
import invoiceService from '../../../api/invoice/invoiceService'
import accountService from '../../../api/account/accountService'
import settingService from '../../../api/setting/settingService'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
export default {
  components: {
    switchButton,
    dataTable,
    AccountSelector
  },
  data() {
    return {
      productImage: productImage,
      personIcon: markRaw(PersonIcon),
      paperIcon: markRaw(PaperIcon),
      deleteIcon: markRaw(DeleteIcon),
      saveIcon: markRaw(SaveIcon),
      showAccountDialog: false,
      showDetailedAccounts: false,
      showProductsAndServices: true,
      showMore: false,
      saveAsDraft: false,
      maskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, ''),
        postProcess: (val) => {
          if (!val) return ''
          return Number.parseInt(val).toLocaleString()
        }
      },
      showScanBarcodeMenu: false,
      tab: 'invoiceSettlement',
      tabItems: [
        { icon: 'mdi-cash-register', title: 'invoiceSettlement' },
        { icon: 'mdi-text-long mdi-flip-h', title: 'description' },
        { icon: 'mdi-truck-delivery', title: 'transportation' }
      ],

      accounts: [],
      selectedAccount: {},
      newPurchaseEntity: {
        additionsAndDeductions: [],
        code: '',
        dateTime: new Date().toISOString().split('T')[0],
        dueDateTime: new Date().toISOString().split('T')[0]
      },
      newAdditionOrDeductionEntity: {},
      customerEntity: {},
      transportationEntity: {},
      marketerEntity: {},
      isAutoCode: true,
      showOperationTypeDialog: false,
      showSettlementDecisionDialog: false,
      productDialogSearchTxt: '',
      settlementItems: [],
      settlementItemHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('type'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '80px'
        },
        {
          title: this.$t('cardNumber'),
          align: 'center',
          sortable: true,
          key: 'cardNumber',
          width: '150px'
        },
        {
          title: this.$t('serialNumber'),
          align: 'center',
          sortable: true,
          key: 'serialNumber',
          width: '150px'
        },
        // {
        //   title: this.$t('bank'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'bank',
        //   width: '100px'
        // },
        {
          title: this.$t('amount'),
          align: 'center',
          sortable: true,
          key: 'amount',
          width: '150px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '40px'
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
          key: 'hierarchyName',
          width: '200px'
        }
      ],
      invoiceItemHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
        },
        {
          title: this.$t('product'),
          align: 'center',
          sortable: true,
          key: 'product',
          width: '150px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'desc',
          width: '150px',
          show: false
        },
        {
          title: this.$t('warehouse'),
          align: 'center',
          sortable: true,
          key: 'warehouse',
          width: '90px'
        },
        {
          title: this.$t('unit'),
          align: 'center',
          sortable: true,
          key: 'unit',
          width: '40px'
        },
        {
          title: this.$t('coefficient'),
          align: 'center',
          sortable: true,
          show: false,
          key: 'coefficient',
          width: '20px'
        },
        {
          title: this.$t('value'),
          align: 'center',
          sortable: true,
          key: 'value',
          width: '20px'
        },
        {
          title: `${this.$t('price')} ${this.$t('unit')}`,
          align: 'center',
          sortable: true,
          key: 'price',
          width: '130px'
        },
        {
          title: this.$t('discount'),
          align: 'center',
          sortable: true,
          key: 'discount',
          width: '80px'
        },
        {
          title: `${this.$t('percent')} ${this.$t('tax')}`,
          align: 'center',
          sortable: true,
          key: 'tax',
          width: '20px'
        },
        {
          title: this.$t('totalAmount'),
          align: 'center',
          sortable: true,
          key: 'totalAmount',
          width: '130px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: false,
          key: 'operation',
          width: '10px',
          fixed: true
        }
      ],
      invoiceItems: [{ id: 1, performTaxAmount: true }],
      showProductSelectionDialog: false,
      selectedRow: {},
      selectedRowIndex: 0,
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
      ],
      products: [],
      barcode: '',
      createdInvoiceEntity: {
        code: '10352',
        id: '9d2df28b-819b-4875-b9b2-06f3536e1328'
      }
    }
  },
  watch: {
    showProductSelectionDialog(val) {
      if (!val) {
        this.invoiceItems[this.selectedRowIndex].productTitle =
          this.invoiceItems[this.selectedRowIndex]?.product?.title || ''
      }
    },
    transportationEntity: {
      deep: true,
      async handler(val) {
        if (val && val.selectedAccount && Object.keys(val.selectedAccount).length > 0) {
          ;(await this.$refs['transportation-cost'])?.focus()
        }
      }
    },
    customerEntity: {
      deep: true,
      async handler(val) {
        if (val && val.selectedAccount && Object.keys(val.selectedAccount).length > 0) {
          this.newPurchaseEntity.title =
            this.$t('purchaseInvoice') + '_' + val?.selectedDetailedAccount?.hierarchyName
          // ;(await this.$refs['title']).focus()
        }
      }
    }
  },
  computed: {
    totalAdditions() {
      let sum = 0
      this.newPurchaseEntity.additionsAndDeductions
        ?.filter((x) => x.type === 0)
        ?.forEach((x) => (sum += x.amount))
      return sum
    },
    totalDeductions() {
      let sum = 0
      this.newPurchaseEntity.additionsAndDeductions
        ?.filter((x) => x.type === 1)
        ?.forEach((x) => (sum += x.amount))
      return sum
    },
    totalAmount() {
      let sum = 0
      this.invoiceItems.forEach((x) => (sum += x.totalAmount || 0))
      return sum
    },
    totalDiscount() {
      let disSum = 0
      this.invoiceItems.forEach((x) => (disSum += x.discountAmount || 0))
      disSum += this.newPurchaseEntity.discountAmount || 0
      return disSum
    },
    totalTax() {
      let taxSum = 0
      this.invoiceItems.forEach((x) => (taxSum += x.taxAmount || 0))
      return taxSum
    },
    totalPayableAmount() {
      let amount =
        this.totalAmount -
        this.totalDiscount +
        this.totalTax +
        (this.transportationEntity.cost || 0) +
        this.totalAdditions -
        this.totalDeductions
      return amount > 0 ? amount : 0
    },
    formIsValid() {
      return (
        this.customerEntity?.selectedAccount?.accountId &&
        this.newPurchaseEntity.title &&
        this.invoiceItems.filter((x) => x.product && Object.keys(x.product).length > 0).length > 0
      )
    },
    isNewInvoice() {
      let res = this.currentActiveTab?.path === '/purchase/newPurchase'
      if (res) this.tabItems.splice(0, 1)
      return res
    }
  },
  async mounted() {
    ;(await this.$refs['datePicker']).focus()
  },
  async created() {
    if (!this.isNewInvoice) await this.getInvoiceById()
    else {
      await this.getDefaultSettings()
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    updateProductOrService(item) {
      if (item.type === 0) this.$router.push('/warehouse/products/' + item.id)
      else this.$router.push('/warehouse/services/' + item.id)
      this.showProductSelectionDialog = false
    },
    updateItems(id) {
      this.$router.push('/persons/' + id)
      console.log(id)
    },
    navToInvoiceSettlement() {
      this.$router.push(
        `/transfer/wizard/register/pay?issuer=0&amount=${this.totalPayableAmount}&id=${this.createdInvoiceEntity.id}`
      )
    },
    getDepositTypeTitle(entity) {
      return this.settlementTypes.filter((x) => x.value === entity.type)[0]?.title || ''
    },
    async onScanBarcodeBtnClicked() {
      setTimeout(async () => {
        ;(await this.$refs.barcodeField).focus()
      }, 300)
    },
    connectoToPOS() {
      this.setErrorMessage(this.$t('connectingToPOSFailed'))
    },
    showPersianNum(num) {
      return utils.showNumberInPersianLetters(num)
    },
    deleteRow(item, index) {
      this.invoiceItems.splice(index, 1)
    },
    addNewRow() {
      let ids = this.invoiceItems.filter((x) => typeof x.id == 'number').map((x) => x.id)
      ids.sort((a, b) => b - a)
      this.invoiceItems.push({ id: ids[0] + 1, performTaxAmount: true })
    },
    switchInvoiceDiscountType(type) {
      this.newPurchaseEntity.discountType = type
      let price = this.totalPayableAmount
      if (type === 1) {
        this.newPurchaseEntity.discountPercent =
          price > 0 ? (this.newPurchaseEntity.discountAmount * 100) / price : 0
      } else {
        this.newPurchaseEntity.discountAmount =
          price > 0 ? (this.newPurchaseEntity.discountPercent * price) / 100 : 0
      }
    },
    switchDiscountType(item, index, type) {
      this.invoiceItems[index].discountType = type
      let price = this.calcPrice(item)

      if (type === 1) {
        this.invoiceItems[index].discountPercent = item.discountAmount
          ? (item.discountAmount * 100) / price
          : 0
      } else {
        this.invoiceItems[index].discountAmount = item.discountPercent
          ? (item.discountPercent * price) / 100
          : 0
      }
    },
    async selectProduct() {
      if (this.selectedRow && this.selectedRow.product) {
        if (this.selectedRowIndex < 0) {
          this.addNewRow()
          this.selectedRowIndex = this.invoiceItems.length - 1
        }
        this.invoiceItems[this.selectedRowIndex].product = { ...this.selectedRow.product }
        this.invoiceItems[this.selectedRowIndex].productTitle = this.selectedRow.product.title
        if (!this.invoiceItems[this.selectedRowIndex].amount) {
          this.invoiceItems[this.selectedRowIndex].amount = 1
        }
        this.invoiceItems[this.selectedRowIndex].price = this.selectedRow.product?.salesPrice || 0
        this.invoiceItems[this.selectedRowIndex].unit = this.selectedRow.product?.unit || ''

        if (this.invoiceItems[this.selectedRowIndex].product.type === 2) {
          await accountService
            .advancedSearch({
              entity: {
                searchType: 1,
                detailedAccountId:
                  this.invoiceItems[this.selectedRowIndex].product.detailedAccountId
              }
            })
            .then((res) => {
              if (res.isSuccess) {
                if (res.entities?.length == 0) {
                  this.setErrorMessage(this.$t('selectedDetailedHasNoAccount'))
                } else if (res.entities.length == 1) {
                  this.invoiceItems[this.selectedRowIndex].product.accountId = res.entities[0].id
                  this.updateModel()
                  this.showProductSelectionDialog = false
                } else {
                  let items = res.entities.map((a, index) => ({ ...a }))
                  this.accounts = items
                  this.showAccountDialog = true
                }
              } else {
                this.setErrorMessage(res.message)
              }
            })
        } else {
          this.showProductSelectionDialog = false
        }
        this.barcode = ''
      }

      ;(await this.$refs[`desc_${this.selectedRowIndex}`]).focus()
    },
    changeUnit(item, index, unit, conversionFactor) {
      this.invoiceItems[index].unit = unit
      this.invoiceItems[index].conversionFactor = conversionFactor
      this.invoiceItems[index].useSubunit =
        this.invoiceItems[index].product?.unit != this.invoiceItems[index].unit
    },
    calcPrice(item) {
      return (
        (item?.price || 0) *
        (item?.amount || 0) *
        (item.conversionFactor > 1 ? item.conversionFactor : 1)
      )
    },
    caclItemTotalAmount(item, index) {
      let price = this.calcPrice(item)
      item.totalAmount = price
      price -= item.discountAmount || 0
      price += this.calcTaxAmount(item, price)
      return price > 0 ? price : 0
    },
    calcItemDiscountAmount(item, index, type) {
      let price = this.calcPrice(item)
      if (type === 1) {
        this.invoiceItems[index].discountPercent = item.discountAmount
          ? (item.discountAmount * 100) / price
          : 0
      } else {
        this.invoiceItems[index].discountAmount = item.discountPercent
          ? (item.discountPercent * price) / 100
          : 0
      }
    },
    calcDiscountAmount(type) {
      let price = this.totalPayableAmount
      if (type === 1) {
        this.newPurchaseEntity.discountPercent =
          price > 0 ? (this.newPurchaseEntity.discountAmount * 100) / price : 0
      } else {
        this.newPurchaseEntity.discountAmount =
          price > 0 ? (this.newPurchaseEntity.discountPercent * price) / 100 : 0
      }
    },
    calcTaxAmount(item, price) {
      let taxAmount = 0
      if (item.product?.salesTax && item.product?.salesTax > 0 && item.performTaxAmount) {
        taxAmount = (price * item.product.salesTax) / 100
      }
      item.taxAmount = taxAmount
      return taxAmount
    },
    selectAccount() {
      this.invoiceItems[this.selectedRowIndex].product.accountId = this.selectedAccount.id
    },
    async getDefaultSettings() {
      const params = {
        page: 1,
        size: 100,
        settingModule: 4
      }
      let res = await settingService.getSetting(params)
      let defaultSalesInvoiceCustomerAccountId = res.value.result.filter(
        (x) => x.name === 'DefaultSalesInvoiceCustomerAccountId'
      )[0]?.value
      let defaultSalesInvoiceCustomerDetailedAccountId = res.value.result.filter(
        (x) => x.name === 'DefaultSalesInvoiceCustomerDetailedAccountId'
      )[0]?.value
      // openBarcodeMenuByDefault
      this.showScanBarcodeMenu =
        res.value.result.filter((x) => x.name === 'EnableBarcodeReaderAsDefault')[0]?.value ==
        'true'

      if (this.showScanBarcodeMenu) {
        setTimeout(async () => {
          ;(await this.$refs.barcodeField).focus()
        }, 300)
      }
      accountService
        .advancedSearch({
          entity: { searchType: 4 }
        })
        .then((res) => {
          if (res.isSuccess) {
            let account = res.value.filter(
              (x) => x.accountId == defaultSalesInvoiceCustomerAccountId
            )[0]
            this.customerEntity.selectedAccount = {
              accountId: account?.accountId,
              fName: account?.name,
              name: account?.name,
              code: account?.code
            }
            let detailedAccount = res.value.filter(
              (x) => x.detailedAccountId == defaultSalesInvoiceCustomerDetailedAccountId
            )[0]
            this.customerEntity.selectedDetailedAccount = {
              detailedAccountId: detailedAccount?.detailedAccountId,
              fName: detailedAccount?.name,
              name: detailedAccount?.name,
              code: detailedAccount?.code
            }
          } else this.setErrorMessage(res.message)
        })
    },
    async getInvoiceById() {
      invoiceService.getById(this.currentActiveTab.params['id']).then((res) => {
        if (res.isSuccess) {
          this.newPurchaseEntity = {
            code: res.value.code,
            title: res.value.title,
            desc: res.value.description,
            dateTime: res.value.dateTime,
            dueDateTime: res.value.dueDateTime,
            additionsAndDeductions: res.value.otherPriceFactors?.map((x) => {
              return {
                amount: x.amount < 0 ? x.amount * -1 : x.amount,
                type: x.amount > 0 ? 0 : 1,
                title: x.title
              }
            }),
            discountAmount: res.value.discount
          }
          this.invoiceItems = res.value.items.map((x) => {
            return {
              ...x,
              discountAmount: x.discount,
              unit: x.useSubunit ? x.subunit : x.unit,
              product: {
                id: x.productId,
                unit: x.unit,
                subunits: x.subunits,
                title: x.productTitle,
                salesTax: x.salesTax
              }
            }
          })
          if (!this.invoiceItems || this.invoiceItems.length < 1) {
            this.addNewRow()
          }
          if (res.value.customerOfficialAccount) {
            this.customerEntity = {
              selectedAccount: {
                accountId: res.value.customerOfficialAccount.id,
                hierarchyName: res.value.customerOfficialAccount.name,
                code: res.value.customerOfficialAccount.code
              },
              selectedDetailedAccount: res.value.customerDetailedAccount ? {
                detailedAccountId: res.value.customerDetailedAccount.id,
                hierarchyName: res.value.customerDetailedAccount.name,
                code: res.value.customerDetailedAccount.code
              } : null
            }
          }
          if (res.value.marketerOfficialAccount) {
            this.marketerEntity = {
              marketingAmount: res.value.marketingAmount,
              selectedAccount: {
                accountId: res.value.marketerOfficialAccount.id,
                hierarchyName: res.value.marketerOfficialAccount.name,
                code: res.value.marketerOfficialAccount.code
              },
              selectedDetailedAccount : res.value.marketerDetailedAccount ? {
                detailedAccountId: res.value.marketerDetailedAccount.id,
                hierarchyName: res.value.marketerDetailedAccount.name,
                code: res.value.marketerDetailedAccount.code
              } : null
            }
          }
          if (res.value.transportationOfficialAccount) {
            this.transportationEntity = {
              cost: res.value.transportationCost,
              selectedAccount: {
                accountId: res.value.transportationOfficialAccount.id,
                hierarchyName: res.value.transportationOfficialAccount.name,
                code: res.value.transportationOfficialAccount.code
              },
              selectedDetailedAccount : res.value.transportationDetailedAccount ? {
                detailedAccountId: res.value.transportationDetailedAccount.id,
                hierarchyName: res.value.transportationDetailedAccount.name,
                code: res.value.transportationDetailedAccount.code
              } : null
            }
          }
        }
      })
    },
    async createOrUpdate(isDraft) {
      this.saveAsDraft = isDraft
      if (!(await this.$refs.frm.validate()) || (!isDraft && !this.formIsValid)) return
      this.showOperationTypeDialog = true
      let request = {
        marketerAccountId: this.marketerEntity?.selectedAccount?.id,
        marketerDetailedAccountId: this.marketerEntity?.selectedDetailedAccount?.id,
        marketingAmount:
          this.marketerEntity.marketingAmount ||
          (this.marketerEntity.marketingPercent > 0
            ? (this.totalPayableAmount * this.marketerEntity.marketingPercent) / 100
            : 0),
        transportationDetailedAccountId:
          this.transportationEntity?.selectedDetailedAccount?.id,
        transportationAccountId: this.transportationEntity?.selectedAccount?.id,
        customerAccountId: this.customerEntity?.selectedAccount?.accountId,
        customerDetailedAccountId: this.customerEntity?.selectedDetailedAccount?.detailedAccountId,
        transportationCost: this.transportationEntity.cost,
        code: this.newPurchaseEntity.code,
        dateTime: this.newPurchaseEntity.dateTime,
        dueDateTime: this.newPurchaseEntity.dueDateTime,
        title: this.newPurchaseEntity.title,
        type: 0, // purchase
        isDraft: isDraft,
        desc: this.newPurchaseEntity.desc,
        items: this.invoiceItems
          .filter((x) => x.product && Object.keys(x.product).length > 0)
          .map((x) => {
            let useSubunit = x.unit != x.product.unit
            return {
              ...x,
              useSubunit: useSubunit,
              subunit: useSubunit ? x.unit : null,
              subunitConversionFactor: x.conversionFactor,
              discount: x.discountAmount,
              productId: x.product.id,
              detailedAccountId: x.product?.detailedAccountId || x.detailedAccountId,
              accountId: x.product?.accountId || x.accountId
            }
          })
      }
      console.log(request);
      if (this.isNewInvoice) {
        await invoiceService.create(request).then((res) => {
          if (res.isSuccess) {
            // this.setErrorMessage(this.$t('invoiceSuccessfullyCreated'), 'success')
            // this.$router.push('/sales')
            this.createdInvoiceEntity = { ...res.value }
            this.showSettlementDecisionDialog = true
          } else {
            this.setErrorMessage(res.message, 'error')
          }
        })
      } else {
        request.id = this.currentActiveTab.params['id']
        await invoiceService.update(request).then((res) => {
          if (res.isSuccess) {
            // this.setErrorMessage(this.$t('invoiceSuccessfullyUpdated'), 'success')
            // this.$router.push('/sales')
            this.showSettlementDecisionDialog = true
          } else {
            this.setErrorMessage(res.message, 'error')
          }
        })
      }
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
          this.products = res.entities
          let product = { ...res.entities[0] }
          const existingProductIndex = this.invoiceItems.findIndex(
            (item) => item?.product?.id === product.id
          )

          if (existingProductIndex >= 0) {
            this.invoiceItems[existingProductIndex].amount += 1
          } else {
            this.selectedRowIndex = this.invoiceItems.findIndex((x) => !x.product || !x.product.id)
            if (this.selectedRowIndex < 0) {
              this.addNewRow()
              this.selectedRowIndex = this.invoiceItems.length - 1
            }
            this.invoiceItems[this.selectedRowIndex].product = { ...product }
            this.invoiceItems[this.selectedRowIndex].productTitle = product.title
            this.invoiceItems[this.selectedRowIndex].amount = 1
            this.invoiceItems[this.selectedRowIndex].price = product?.salesPrice || 0
            this.invoiceItems[this.selectedRowIndex].unit = product?.unit || ''
          }
        } else {
          this.setErrorMessage(res.message)
        }
      })
      this.barcode = ''
      this.showScanBarcodeMenu = true
      ;(await this.$refs['barcodeField'])?.focus()
    },
    async openProductDialog(rowIndex) {
      await this.searchProducts()
      this.productDialogSearchTxt = this.invoiceItems[rowIndex].productTitle
      this.selectedRowIndex = rowIndex
      this.showProductSelectionDialog = true
    },
    async searchProducts(txtSearch) {
      this.products = []
      if (this.showProductsAndServices)
        await productService.search({
          page: 1,
          size: 100,
        }).then((res) => {
          if (res.isSuccess) {
            console.log(res);
            this.products = res.value.result.map((x) => {
              const salesPrice = x.prices?.find((p) => p.type === 0)?.price || 0

              return {
                ...x,
                typeTitle: x.type === 0 ? this.$t('product') : this.$t('service'),
                type: x.type,
                salesPrice: salesPrice
              }
            })
          } else this.setErrorMessage(res.message)
        })
      if (this.showDetailedAccounts)
        await detailedAccountService.getByFamily(null, 1, 1000).then((res) => {
          if (res.isSuccess) {
            let lst = res.entities.map((x) => {
              return {
                id: x.id,
                detailedAccountId: x.id,
                title: x.hierarchyName,
                type: 2,
                typeTitle: this.$t('account'),
                categoryTitle: utils.showAccountFamily(x.family),
                salesPrice: 0
              }
            })
            this.products = [...this.products, ...lst]
          }
        })
    }
  }
}
</script>
<style>
.invoice-items-table .v-field--variant-solo,
.v-field--variant-solo-filled {
  box-shadow: none !important;
}
.result-tbl td {
  font-weight: bold;
}
.result-tbl td,
.result-tbl th {
  border-bottom: 1px solid lightgrey;
}
</style> -->





<template>
  <EditOrCreateInvoice
    :type="0"
    :isNewInvoice="isNewInvoice"
    :isBackInvoce="false"
    :id="currentId"
  />
</template>

<script>
import EditOrCreateInvoice from '../../components/invoiceComponents/editOrCreateInvoice.vue'
export default {
  components: {
    EditOrCreateInvoice
  },
  computed: {
    isNewInvoice() {
      let res = this.currentActiveTab.path === '/purchase/purchaseInvoice'
      return res
    },
    currentId() {
      if (this.currentActiveTab.params.id) return this.currentActiveTab.params.id
      else return null
    }
  }
}
</script>

<style></style>