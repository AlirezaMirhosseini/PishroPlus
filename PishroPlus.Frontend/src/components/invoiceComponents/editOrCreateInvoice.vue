<template>
  <v-card class="mb-auto">
    <v-card-text>
      <v-form ref="frm">
        <v-row no-gutters justify="end">
          <v-col cols="12" sm="6" lg="3" md="4" class="d-flex px-1">
            <v-text-field
              name="code"
              v-model="invoiceEntity.code"
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
              class="mx-2"
              v-model:checked="isAutoCode"
              :label="isAutoCode ? $t('automatic') : $t('manual')"
            />
          </v-col>
          <v-col cols="12" sm="6" lg="3" md="4" class="px-1 pb-5">
            <date-picker
              :editable="true"
              v-model="invoiceEntity.dateTime"
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
                v-model="invoiceEntity.title"
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
                v-model="invoiceEntity.dueDateTime"
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
                      !marketerEntity.selectedAccount || !marketerEntity.selectedAccount.id
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
                      !marketerEntity.selectedAccount || !marketerEntity.selectedAccount.id
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
            <v-col cols="12" sm="6" lg="3" md="4" class="px-1">
              <v-select
                density="compact"
                :label="$t('invoiceTemplate')"
                hide-details
                variant="outlined"
                item-title="title"
                item-value="id"
                :items="invoiceTemplates"
                v-model="selectedTemplateId"
                :disabled="!isNewInvoice"
              ></v-select>
            </v-col>
          </v-row>
        </v-slide-y-transition>
        <v-row no-gutters class="mt-5">
          <v-col cols="12" class="px-1">
            <data-table
              :hasSearch="true"
              :searchItems="['productTitle', 'description', 'warehouseTitle', 'product.title', 'unit.title']"
              class="invoice-items-table"
              :headers="invoiceItemHeaders"
              :items="invoiceItems"
              :showPagination="false"
            >
              <template v-slot:toolbar>
                <v-row class="align-center" no-gutters>
                  <v-btn
                    prepend-icon="mdi-plus"
                    class="mx-2"
                    height="43"
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
              <template v-slot:column_description="{ entity, index }">
                <v-text-field
                  hide-details
                  bg-color="transparent"
                  density="compact"
                  variant="solo"
                  :ref="`desc_${index}`"
                  :model-value="entity.description"
                  @change="(ev) => (invoiceItems[index].description = ev.target.value)"
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
                  <template
                    v-slot:append-inner
                    v-if="entity.product?.units?.some((x) => !x.isDefault)"
                  >
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
                  @focus="getLatestPrices(entity.product.id, index)"
                  @blur="onBlurPrice(index)"
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
                          v-if="type === 1 && entity.product?.prices?.find((p) => p.type === 0)"
                          @click="
                            invoiceItems[index].price = parseFloat(
                              entity.product?.prices?.find((p) => p.type === 0)?.price
                            )
                          "
                        >
                          <v-list-item-title
                            >{{ $t('sale') }}:
                            {{
                              parseFloat(
                                entity.product?.prices?.find((p) => p.type === 0)?.price
                              ).toLocaleString()
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          v-if="type === 0 && entity.product?.prices?.find((p) => p.type === 1)"
                          @click="
                            invoiceItems[index].price = parseFloat(
                              entity.product?.prices?.find((p) => p.type === 1)?.price
                            )
                          "
                        >
                          <v-list-item-title
                            >{{ $t('purchase') }}:
                            {{
                              parseFloat(
                                entity.product?.prices?.find((p) => p.type === 1)?.price
                              ).toLocaleString()
                            }}</v-list-item-title
                          >
                        </v-list-item>
                        <v-list-item
                          v-for="(price, idx) in entity.product?.prices?.filter(
                            (p) => p.type !== 0 && p.type !== 1
                          )"
                          :key="idx"
                          @click="invoiceItems[index].price = parseFloat(price.price)"
                        >
                          <v-list-item-title
                            >{{ price.title }}:
                            {{ parseFloat(price.price).toLocaleString() }}</v-list-item-title
                          >
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </template>
                </v-text-field>
                <v-menu
                  v-if="recentPrices.length > 0"
                  width="150"
                  v-model="entity.showRecentPricesMenu"
                >
                  <template v-slot:activator="{ props }">
                    <span v-bind="props"></span>
                  </template>
                  <v-list density="compact" hidedetails style="width: max-content">
                    <v-list-item v-for="(rPrice, idx) in recentPrices" :key="idx">
                      <v-list-item-title>
                        {{ parseFloat(rPrice.price).toLocaleString() }} -
                        {{ getRecentPriceDateTime(rPrice) }}
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
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
                    v-if="entity.product"
                    v-model="entity.product.taxPercent"
                    style="margin: -10px"
                  >
                    <template v-slot:append-inner>
                      <v-icon icon="mdi-percent" size="x-small"></v-icon>
                    </template>
                  </v-text-field>
                </div>
              </template>
              <template v-slot:column_taxAmount="{ entity, index }">
                {{ entity.taxAmount?.toLocaleString() }}
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
                    </p>
                  </v-tab>
                </v-tabs>
                <v-window :touch="false" v-model="tab" style="width: 100%">
                  <!-- v-if="id" -->
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
                        {{ entity.amount?.toLocaleString() }}
                      </template>
                    </data-table>
                    <div class="px-1 d-flex justify-end flex-column align-end">
                      <span
                        >{{ $t('totalReceives') }}:
                        <span class="text-primary">{{
                          invoiceEntity.payedAmount?.toLocaleString()
                        }}</span></span
                      >
                      <span
                        >{{ $t('remainingAmount') }}:
                        <span class="text-warning">{{
                          invoiceEntity.remainingAmount?.toLocaleString()
                        }}</span></span
                      >
                    </div>
                  </v-window-item>
                  <v-window-item value="description" class="pa-2">
                    <v-textarea
                      v-model="invoiceEntity.description"
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
                <v-row v-if="isBackInvoce" class="justify-end py-2" no-gutters>
                  <v-btn
                    @click="handleShowWarehouseDialog"
                    :prepend-icon="saveIcon"
                    color="info"
                    class="ma-1"
                    :disabled="!formIsValid"
                    >{{ $t('save') }}</v-btn
                  >
                  <v-btn
                    prepend-icon="mdi mdi-keyboard-return"
                    color="info"
                    variant="outlined"
                    class="ma-1"
                    @click="handleReturnToSelectInvoice"
                    >{{ $t('returnToSelectInvoice') }}</v-btn
                  >
                </v-row>
                <v-row v-else class="justify-end py-2" no-gutters>
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
          {{ `${$t('selectProduct')}/${$t('service')}` }}
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
        <div v-if="!isBackInvoce" class="d-flex justify-space-between">
          <div class="d-flex">
            <!-- <v-checkbox
              :label="`${$t('product')}/${$t('service')}`"
              density="compact"
              hide-details
              :model-value="true"
              v-model="showProductsAndServices"
              @change="searchProducts"
            >
            </v-checkbox> -->
            <!-- <v-checkbox
              v-model="showDetailedAccounts"
              :label="`${$t('show')} ${$t('accounts')}`"
              hide-details
              density="compact"
              @change="searchProducts"
            ></v-checkbox> -->
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
          :items="products?.filter((p) => !isBackInvoce || defaultProductIds?.includes(p.id))"
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
          <v-btn color="info" width="150" @click="navigateToSalesPage()" variant="elevated"
            ><v-icon class="ml-1">mdi-chevron-right</v-icon>
            {{ $t('confirm') + '/' + $t('continue') }}</v-btn
          >
          <v-btn color="info" variant="elevated" width="150" @click="resetData()"
            ><v-icon class="ml-1">mdi-autorenew</v-icon>{{ $t('newInvoice') }}</v-btn
          >
          <v-btn color="primary" width="150" @click="navToInvoiceSettlement" variant="elevated"
            ><v-icon class="ml-1">mdi-cash-register</v-icon>{{ $t('invoiceSettlement') }}</v-btn
          >
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="selectWarehouseDialog" width="75%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" color="info" icon="mdi mdi-shopping-outline" />
        <p style="font-weight: bold">
          {{ `${$t('selectWarehouse')}` }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="selectWarehouseDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <data-table
          :headers="warehouseHeaders"
          :items="warehouses"
          :selectableRow="true"
          :hasEnter="true"
          :bigSearch="true"
          :hasSearch="true"
          :searchItems="['title', 'code', 'wareHouseKeeper', 'telephoneNumber', 'address']"
          @enterMethod="() => createOrUpdate(false, true)"
          v-model:selectedRow="refundWarehouse"
          clickableRow
          itemValue="id"
        >
          <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
          <template v-slot:column_isActive="{ entity }">
            <v-icon
              :icon="entity.isActive ? 'mdi mdi-check' : 'mdi mdi-close'"
              :color="entity.isActive ? 'success' : 'error'"
            />
          </template>
          <template v-slot:column_isDefault="{ entity }">
            <v-icon
              :icon="entity.isDefault ? 'mdi mdi-check' : 'mdi mdi-close'"
              :color="entity.isDefault ? 'success' : 'error'"
            />
          </template>
        </data-table>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar px-5">
        <v-btn
          @click="() => createOrUpdate(false, true)"
          color="info"
          variant="elevated"
          size="large"
        >
          <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default.js'
import utils from '../../../plugins/utils.js'
import switchButton from '../baseComponents/switchButton.vue'
import DeleteIcon from '../icons/Delete.vue'
import PersonIcon from '../icons/Person.vue'
import SaveIcon from '../icons/Save.vue'
import PaperIcon from '../icons/Paper.vue'
import dataTable from '../baseComponents/datatable/datatable.vue'
import productService from '../../../api/product/productService.js'
import warehouseService from '../../../api/warehouse/warehouseService.js'
import AccountSelector from '../accountsComponents/accountSelector.vue'
import productImage from '../../assets/images/product.png'
import invoiceService from '../../../api/invoice/invoiceService.js'
import accountService from '../../../api/account/accountService.js'
import voucherService from '../../../api/voucher/voucherService'
import settingService from '../../../api/setting/settingService.js'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService.js'

export default {
  name: 'editOrCreateInvocie',
  props: {
    isNewInvoice: {
      required: false,
      default: () => false
    },
    id: {
      required: false
    },
    isBackInvoce: {
      required: false,
      default: () => false
    },
    type: {
      required: true
    }
  },
  emits: ['resetInvoice'],
  components: {
    switchButton,
    dataTable,
    AccountSelector
  },
  data() {
    return {
      showRecentPricesMenu: false,
      productImage: productImage,
      personIcon: markRaw(PersonIcon),
      paperIcon: markRaw(PaperIcon),
      deleteIcon: markRaw(DeleteIcon),
      saveIcon: markRaw(SaveIcon),
      showAccountDialog: false,
      showDetailedAccounts: false,
      showProductsAndServices: true,
      invoiceTemplates: [],
      selectedTemplateId: null,
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
      tab: 'description',
      tabItems: [
        { icon: 'mdi-cash-register', title: 'invoiceSettlement' },
        { icon: 'mdi-text-long mdi-flip-h', title: 'description' },
        { icon: 'mdi-truck-delivery', title: 'transportation' }
      ],
      accounts: [],
      selectedAccount: {},
      invoiceEntity: {
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
        }
        // {
        //   title: this.$t('operations'),
        //   align: 'center',
        //   sortable: true,
        //   key: 'operations',
        //   width: '40px'
        // }
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
          key: 'description',
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
          width: '90px'
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
          title: `${this.$t('amount')} ${this.$t('tax')}`,
          align: 'center',
          sortable: true,
          key: 'taxAmount',
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
      productDialogSearchTxt: '',
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
      recentPrices: [],
      barcode: '',
      createdInvoiceEntity: {
        code: '10352',
        id: '9d2df28b-819b-4875-b9b2-06f3536e1328'
      },
      settlementDocumentTypes: [
        {
          title: this.$t('check'),
          value: 0
        },
        {
          title: this.$t('cash'),
          value: 1
        },
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
      defaultProductIds: [],
      refundWarehouse: null,
      selectWarehouseDialog: false,
      warehouses: [],
      warehouseHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '40px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '120px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '70px'
        },
        {
          title: this.$t('wareHouseKeeper'),
          align: 'center',
          sortable: true,
          key: 'keeperFullName',
          width: '120px'
        },
        {
          title: this.$t('telephoneNumber'),
          align: 'center',
          sortable: true,
          key: 'telephone',
          width: '100px'
        },
        {
          title: this.$t('address'),
          align: 'center',
          sortable: true,
          key: 'address',
          minWidth: '250px'
        },
        {
          title: this.$t('active'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '0'
        },
        {
          title: this.$t('default'),
          align: 'center',
          sortable: true,
          key: 'isDefault',
          width: '0'
        }
      ]
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
        if (
          val &&
          val.selectedAccount &&
          Object.keys(val.selectedAccount).length > 0 &&
          this.isNewInvoice
        ) {
          const invoiceTypeText =
            this.type === 1 ? this.$t('salesInvoice') : this.$t('purchaseInvoice')
          this.invoiceEntity.title =
            invoiceTypeText + '_' + val?.selectedDetailedAccount?.hierarchyName
        }
      }
    }
  },
  computed: {
    totalAdditions() {
      let sum = 0
      this.invoiceEntity.additionsAndDeductions
        ?.filter((x) => x.type === 0)
        ?.forEach((x) => (sum += x.amount))
      return sum
    },
    totalDeductions() {
      let sum = 0
      this.invoiceEntity.additionsAndDeductions
        ?.filter((x) => x.type === 1)
        ?.forEach((x) => (sum += x.amount))
      return sum
    },
    totalAmount() {
      let sum = 0
      console.log(this.invoiceItems);
      this.invoiceItems.forEach((x) => (sum += x.totalAmount || 0))
      return sum
    },
    totalDiscount() {
      // let disSum = 0
      console.log(this.invoiceEntity);
      // this.invoiceItems.forEach((x) => (disSum += x.discountAmount || 0))
      // disSum += this.invoiceEntity.discountAmount || 0
      return this.invoiceEntity.discountAmount || 0
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
        (this.customerEntity?.selectedAccount?.accountId ||
          this.customerEntity?.selectedAccount?.id) &&
        this.invoiceEntity.title &&
        this.invoiceItems.filter((x) => x.product && Object.keys(x.product).length > 0).length > 0
      )
    },
    pageTitle() {
      return this.type === 1 ? this.$t('salesInvoice') : this.$t('purchaseInvoice')
    }
  },
  async mounted() {
    if (!this.isNewInvoice) {
      await this.getInvoiceById()
      this.tab = 'invoiceSettlement'
    } else {
      await this.getDefaultSettings()
      await this.getInvoiceTemplates()
    }
    if (!this.showScanBarcodeMenu) (await this.$refs['datePicker']).focus()
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    async getInvoiceTemplates() {
      const response = await voucherService.getAllTemplates({
        page: 1,
        size: 100
      })

      if (response.isSuccess) {
        this.invoiceTemplates = response.value.result.filter(
          (t) => t.issuerPart === 0 && t.systemic === false
        )
        const defaultTemplate = this.invoiceTemplates.find((t) => t.isDefault)
        if (defaultTemplate) {
          this.selectedTemplateId = defaultTemplate.id
        }
      } else {
        this.setErrorMessage(
          response.errors?.[0]?.message || this.$t('errorLoadingTemplates'),
          'error'
        )
      }
    },
    async getLatestPrices(productId, index) {
      const response = await invoiceService.getLatestPrices(productId)
      if (response.isSuccess) {
        this.recentPrices = response.entities
        this.invoiceItems[index].showRecentPricesMenu = true
      } else {
        this.setErrorMessage(response.message)
      }
    },
    updateItems(id) {
      this.$router.push('/persons/' + id)
      console.log(id)
    },
    getRecentPriceDateTime(rPrice) {
      let date = new Date()
      if (rPrice.dateTime) {
        date = new Date(rPrice.dateTime)
      }
      const formatter = new Intl.DateTimeFormat('fa-IR')
      return formatter.format(date) + ' ' + date.toLocaleTimeString('fa-IR')
    },
    onBlurPrice(index) {
      this.invoiceItems[index].showRecentPricesMenu = false
      this.recentPrices = []
    },
    navigateToSalesPage() {
      if (this.type === 1) this.$router.push('/sales')
      else this.$router.push('/purchase/purchaseInvoices')
      this.showSettlementDecisionDialog = false
    },
    updateProductOrService(item) {
      if (item.type === 0) this.$router.push('/warehouse/products/' + item.id)
      else this.$router.push('/warehouse/services/' + item.id)
      this.showProductSelectionDialog = false
    },
    async resetData() {
      Object.assign(this.$data, this.$options.data.call(this))
      this.showScanBarcodeMenu = true
      setTimeout(async () => {
        ;(await this.$refs.barcodeField).focus()
      }, 300)
    },
    navToInvoiceSettlement() {
      const path =
        this.type === 1
          ? `/transfer/wizard/register/receive?issuer=0&amount=${this.totalPayableAmount}&id=${this.createdInvoiceEntity.id}`
          : `/transfer/wizard/register/pay?issuer=0&amount=${this.totalPayableAmount}&id=${this.createdInvoiceEntity.id}`

      this.$router.push(path)
    },
    getDepositTypeTitle(entity) {
      return (
        this.settlementDocumentTypes.filter((x) => x.value === entity.documentType)[0]?.title || ''
      )
    },
    async onScanBarcodeBtnClicked() {
      setTimeout(async () => {
        ;(await this.$refs.barcodeField)?.focus()
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
      const newId = ids.length > 0 ? ids[0] + 1 : 1;
      this.invoiceItems.push({ 
        id: newId, 
        performTaxAmount: true,
        description: '',
        productTitle: '',
        warehouseTitle: '',
        unit: { title: '' }
      })
    },

    switchInvoiceDiscountType(type) {
      this.invoiceEntity.discountType = type
      let basePrice = this.totalAmount
      
      if (type === 1) {
        this.invoiceEntity.discountPercent =
          basePrice > 0 ? (this.invoiceEntity.discountAmount * 100) / basePrice : 0
      } else {
        this.invoiceEntity.discountAmount =
          basePrice > 0 ? (this.invoiceEntity.discountPercent * basePrice) / 100 : 0
      }
    },

    switchDiscountType(item, index, type) {
      this.invoiceItems[index].discountType = type
      let basePrice = this.calcPrice(item)

      if (type === 1) {
        this.invoiceItems[index].discountPercent = item.discountAmount
          ? (item.discountAmount * 100) / basePrice
          : 0
      } else {
        this.invoiceItems[index].discountAmount = item.discountPercent
          ? (item.discountPercent * basePrice) / 100
          : 0
      }
    },

    async selectProduct() {
      if (this.selectedRow && this.selectedRow.product) {
        if (this.selectedRowIndex < 0) {
          this.addNewRow()
          this.selectedRowIndex = this.invoiceItems.length - 1
        }

        const productDetails = await productService.getById(this.selectedRow.product.id)
        if (!productDetails.isSuccess) {
          this.setErrorMessage(productDetails.errors[0]?.message)
          return
        }

        const productData = {
          ...this.selectedRow.product,
          taxPercent: this.selectedRow.product?.salesTax || 0,
          warehouses:
            productDetails.value.stocks?.filter(s => s.warehouse)?.map((stock) => ({
              id: stock.warehouseId,
              title: stock.warehouse?.title
            })) || []
        }

        const defaultPrice =
          this.type === 1
            ? this.selectedRow.product?.salesPrice || 0
            : this.selectedRow.product?.prices?.find((p) => p.type === 1)?.price || 0

        this.invoiceItems[this.selectedRowIndex] = {
          ...this.invoiceItems[this.selectedRowIndex],
          product: productData,
          productTitle: productData.title,
          amount: this.invoiceItems[this.selectedRowIndex].amount || 1,
          price: defaultPrice,
          _price: defaultPrice,
          unit: productData.units?.find((x) => x.isDefault) || {},
          warehouseId: productData.warehouses?.length > 0 ? productData.warehouses[0].id : null
        }

        if (this.invoiceItems[this.selectedRowIndex].product.type === 2) {
          await accountService
            .advancedSearch({
              id: this.invoiceItems[this.selectedRowIndex].product.detailedAccountId
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
      ;(await this.$refs[`desc_${this.selectedRowIndex}`])?.focus()
    },

    changeUnit(item, index, unit) {
      this.invoiceItems[index].unit = { ...unit }
      this.invoiceItems[index].price =
        (item?._price || 0) * (item?.amount || 0) * (item.unit?.conversionFactor || 1)
    },

    calcPrice(item) {
      return (item?.price || 0) * (item?.amount || 0)
    },

    caclItemTotalAmount(item, index) {
      const basePrice = this.calcPrice(item)
      item.totalAmount = basePrice
      const discountAmount = item.discountAmount || 0
      const taxAmount = this.calcTaxAmount(item, basePrice)
      const finalPrice = basePrice - discountAmount + taxAmount
      return finalPrice > 0 ? finalPrice : 0
    },

    calcItemDiscountAmount(item, index, type) {
      let basePrice = this.calcPrice(item)
      
      if (type === 1) {
        this.invoiceItems[index].discountPercent = item.discountAmount
          ? (item.discountAmount * 100) / basePrice
          : 0
      } else {
        this.invoiceItems[index].discountAmount = item.discountPercent
          ? (item.discountPercent * basePrice) / 100
          : 0
      }
    },

    calcDiscountAmount(type) {
      let basePrice = this.totalAmount
      
      if (type === 1) {
        this.invoiceEntity.discountPercent =
          basePrice > 0 ? (this.invoiceEntity.discountAmount * 100) / basePrice : 0
      } else {
        this.invoiceEntity.discountAmount =
          basePrice > 0 ? (this.invoiceEntity.discountPercent * basePrice) / 100 : 0
      }
    },

    calcTaxAmount(item, basePrice) {
      if (!basePrice) {
        basePrice = this.calcPrice(item)
      }
      
      let taxAmount = 0
      if (item.product?.taxPercent && item.product?.taxPercent > 0 && item.performTaxAmount) {
        taxAmount = Math.floor((basePrice * item.product.taxPercent) / 100)
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
        size: 10,
        settingModule: this.type === 0 ? 4 : 6
      }
      let res = await settingService.getSetting(params)
      let defaultSalesInvoiceCustomerAccountId = res.value.result.filter(
        (x) => x.key === 'default_customer_account_id'
      )[0]?.value
      let defaultSalesInvoiceCustomerDetailedAccountId = res.value.result.filter(
        (x) => x.key === 'default_customer_detailed_account_id'
      )[0]?.value

      this.showScanBarcodeMenu =
        res.value.result.filter((x) => x.key === 'EnableBarcodeReaderAsDefault')[0]?.value == 'true'

      if (this.showScanBarcodeMenu) {
        setTimeout(async () => {
          ;(await this.$refs.barcodeField).focus()
        }, 300)
      }

      const firstPageRes = await accountService.advancedSearch({ page: 1, size: 100 })
      if (!firstPageRes.isSuccess) {
        this.setErrorMessage(firstPageRes.errors[0].message)
        return
      }

      let accounts = [...firstPageRes.value.result]
      const totalPages = firstPageRes.value.totalPages

      for (let page = 2; page <= totalPages; page++) {
        const pageRes = await accountService.advancedSearch({ page, size: 100 })
        if (pageRes.isSuccess) {
          accounts = [...accounts, ...pageRes.value.result]
        }
      }

      console.log(
        defaultSalesInvoiceCustomerAccountId,
        defaultSalesInvoiceCustomerDetailedAccountId
      )
      const account = accounts.find((x) => x.accountId == defaultSalesInvoiceCustomerAccountId)
      const detailedAccount = accounts.find(
        (x) => x.detailedAccountId == defaultSalesInvoiceCustomerDetailedAccountId
      )

      if (account) {
        this.customerEntity.selectedAccount = {
          accountId: account.id,
          hierarchyName: account.hierarchyName,
          name: account.name,
          code: account.code
        }
      }

      if (detailedAccount) {
        this.customerEntity.selectedDetailedAccount = {
          detailedAccountId: detailedAccount.id,
          hierarchyName: detailedAccount.hierarchyName,
          name: detailedAccount.name,
          code: detailedAccount.code
        }
      }
    },
    async getInvoiceById() {
      invoiceService.getById(this.id).then((res) => {
        if (res.isSuccess) {
          const invoice = res.value
          console.log(invoice);

          this.invoiceEntity = {
            code: invoice.code || '',
            title: invoice.title || '',
            payedAmount: invoice.paidAmount || 0,
            remainingAmount: invoice.remainingAmount || 0,
            description: invoice.description || '',
            dateTime: invoice.dateTime,
            dueDateTime: invoice.dueDateTime,
            discountAmount: invoice.discount || 0
          }
          if (invoice.items) {
            this.invoiceItems = invoice.items.map((item) => {
              return {
                id: item.id,
                productId: item.productId,
                productTitle: item.productTitle,
                warehouseId: item.warehouseId,
                warehouseTitle: item.warehouseTitle,
                amount: item.amount || 0,
                price: item.price || 0,
                discountAmount: item.discount || 0,
                discountPercent:
                  item.price > 0 ? (item.discount * 100) / (item.price * item.amount) : 0,
                taxAmount: item.taxAmount || 0,
                performTaxAmount: item.performTaxAmount,
                description: item.description || '',
                totalAmount: item.totalPrice || 0,
                product: {
                  id: item.productId,
                  title: item.productTitle,
                  code: item.productCode,
                  unit: item.unit,
                  units: item.units,
                  taxPercent: item.taxPercentage || 0,
                  warehouses: [
                    {
                      id: item.warehouseId,
                      title: item.warehouseTitle,
                      code: item.warehouseCode
                    }
                  ]
                },
                unit: item.unit,
                units: item.units
              }
            })
            this.defaultProductIds = res.value.items?.map((i) => i.productId)
            if (!this.invoiceItems || this.invoiceItems.length < 1) {
              this.addNewRow()
            }
            if (invoice.settlementDocuments) {
              this.settlementItems = invoice.settlementDocuments
            }
            if (invoice.customerOfficialAccount) {
              this.customerEntity = {
                selectedAccount: {
                  accountId: invoice.customerOfficialAccount.id,
                  hierarchyName: invoice.customerOfficialAccount.name,
                  code: invoice.customerOfficialAccount.code
                },
                selectedDetailedAccount: invoice.customerDetailedAccount
                  ? {
                      detailedAccountId: invoice.customerDetailedAccount.id,
                      hierarchyName: invoice.customerDetailedAccount.name,
                      code: invoice.customerDetailedAccount.code
                    }
                  : null
              }
            }
            if (invoice.marketerOfficialAccount) {
              this.marketerEntity = {
                marketingAmount: invoice.marketingAmount,
                selectedAccount: {
                  accountId: invoice.marketerOfficialAccount.id,
                  hierarchyName: invoice.marketerOfficialAccount.name,
                  code: invoice.marketerOfficialAccount.code
                },
                selectedDetailedAccount: invoice.marketerDetailedAccount
                  ? {
                      detailedAccountId: invoice.marketerDetailedAccount.id,
                      hierarchyName: invoice.marketerDetailedAccount.name,
                      code: invoice.marketerDetailedAccount.code
                    }
                  : null
              }
            }
            if (invoice.transportationOfficialAccount) {
              this.transportationEntity = {
                cost: invoice.transportationCost,
                selectedAccount: {
                  accountId: invoice.transportationOfficialAccount.id,
                  hierarchyName: invoice.transportationOfficialAccount.name,
                  code: invoice.transportationOfficialAccount.code
                },
                selectedDetailedAccount: invoice.transportationDetailedAccount
                  ? {
                      detailedAccountId: invoice.transportationDetailedAccount.id,
                      hierarchyName: invoice.transportationDetailedAccount.name,
                      code: invoice.transportationDetailedAccount.code
                    }
                  : null
              }
            }
          }
        }
      })
    },
    handleReturnToSelectInvoice() {
      this.$emit('resetInvoice')
    },
    async handleShowWarehouseDialog() {
      const res = await warehouseService.getAll(1, 100)
      if (res.isSuccess) {
        this.warehouses = res.value.result
        this.selectWarehouseDialog = true
      }
    },
    async createOrUpdate(isDraft, isRefund) {
      this.saveAsDraft = isDraft
      if (!(await this.$refs.frm.validate()) || (!isDraft && !this.formIsValid)) return

      var warehouseInvalidRecordIdx = this.invoiceItems.findIndex((x) => !x.warehouseId)
      var productInvalidRecordIdx = this.invoiceItems.findIndex((x) => !x.product || !x.product?.id)
      if (productInvalidRecordIdx > -1) {
        this.setErrorMessage(
          `${this.$t('productIsRequired')}, ${this.$t('row')}:${productInvalidRecordIdx + 1}`,
          'error'
        )
        return
      }
      if (warehouseInvalidRecordIdx > -1) {
        this.setErrorMessage(
          `${this.$t('warehouseIsRequired')}, ${this.$t('row')}:${warehouseInvalidRecordIdx + 1}`,
          'error'
        )
        return
      }
      var unitPriceInvalidRecordIdx = this.invoiceItems.findIndex((x) => x.price <= 0)
      if (unitPriceInvalidRecordIdx > -1) {
        this.setErrorMessage(
          `${this.$t('unitPriceIsInvalid')}, ${this.$t('row')}:${unitPriceInvalidRecordIdx + 1}`,
          'error'
        )
        return
      }
      this.showOperationTypeDialog = true

      // console.log(this.marketerEntity)
      // const marketerOfficialAccount = this.marketerEntity?.selectedAccount
      //   ? {
      //       id:
      //         this.marketerEntity.selectedAccount.id ||
      //         this.marketerEntity.selectedAccount.accountId,
      //       name:
      //         this.marketerEntity.selectedAccount.name ||
      //         this.marketerEntity.selectedAccount.hierarchyName,
      //       code: this.marketerEntity.selectedAccount.code.toString()
      //     }
      //   : null

      // const marketerDetailedAccount = this.marketerEntity?.selectedDetailedAccount
      //   ? {
      //       id:
      //         this.marketerEntity.selectedDetailedAccount.id ||
      //         this.marketerEntity.selectedAccount.accountId,
      //       name:
      //         this.marketerEntity.selectedDetailedAccount.name ||
      //         this.marketerEntity.selectedAccount.hierarchyName,
      //       code: this.marketerEntity.selectedDetailedAccount.code.toString()
      //     }
      //   : null

      // console.log(this.transportationEntity)
      // const transportationOfficialAccount = this.transportationEntity?.selectedAccount
      //   ? {
      //       id:
      //         this.transportationEntity.selectedAccount.id ||
      //         this.transportationEntity.selectedAccount.accountId,
      //       name:
      //         this.transportationEntity.selectedAccount.name ||
      //         this.transportationEntity.selectedAccount.hierarchyName,
      //       code: this.transportationEntity.selectedAccount.code.toString()
      //     }
      //   : null

      // const transportationDetailedAccount = this.transportationEntity?.selectedDetailedAccount
      //   ? {
      //       id:
      //         this.transportationEntity.selectedDetailedAccount.id ||
      //         this.transportationEntity.selectedAccount.accountId,
      //       name:
      //         this.transportationEntity.selectedDetailedAccount.name ||
      //         this.transportationEntity.selectedAccount.hierarchyName,
      //       code: this.transportationEntity.selectedDetailedAccount.code.toString()
      //     }
      //   : null

      // console.log(this.customerEntity)
      // const customerOfficialAccount = this.customerEntity?.selectedAccount
      //   ? {
      //       id:
      //         this.customerEntity.selectedAccount.id ||
      //         this.customerEntity.selectedAccount.accountId,
      //       name:
      //         this.customerEntity.selectedAccount.name ||
      //         this.customerEntity.selectedAccount.hierarchyName,
      //       code: this.customerEntity.selectedAccount.code.toString()
      //     }
      //   : null

      // const customerDetailedAccount = this.customerEntity?.selectedDetailedAccount
      //   ? {
      //       id:
      //         this.customerEntity.selectedDetailedAccount.id ||
      //         this.customerEntity.selectedAccount.accountId,
      //       name:
      //         this.customerEntity.selectedDetailedAccount.name ||
      //         this.customerEntity.selectedAccount.hierarchyName,
      //       code: this.customerEntity.selectedDetailedAccount.code.toString()
      //     }
      //   : null
      
      const prepareAccount = (account) => {
        if (!account) return null;
        
        return {
          id: account.id || account.accountId,
          name: account.name || account.hierarchyName,
          code: account.code?.toString() || ''
        };
      };

      const marketerOfficialAccount = prepareAccount(this.marketerEntity?.selectedAccount);
      const marketerDetailedAccount = prepareAccount(this.marketerEntity?.selectedDetailedAccount);
      const transportationOfficialAccount = prepareAccount(this.transportationEntity?.selectedAccount);
      const transportationDetailedAccount = prepareAccount(this.transportationEntity?.selectedDetailedAccount);
      const customerOfficialAccount = prepareAccount(this.customerEntity?.selectedAccount);
      const customerDetailedAccount = prepareAccount(this.customerEntity?.selectedDetailedAccount);

      let request = {
        marketerOfficialAccount,
        marketerDetailedAccount,
        transportationOfficialAccount,
        transportationDetailedAccount,
        customerOfficialAccount,
        customerDetailedAccount,
        transportationCost: this.transportationEntity.cost || 0,
        code: this.invoiceEntity.code || '',
        dateTime: this.invoiceEntity.dateTime,
        dueDateTime: this.invoiceEntity.dueDateTime,
        title: this.invoiceEntity.title || '',
        type: this.type,
        marketingAmount:
          this.marketerEntity.marketingAmount ||
          (this.marketerEntity.marketingPercent > 0
            ? (this.totalPayableAmount * this.marketerEntity.marketingPercent) / 100
            : 0),
        discount: this.invoiceEntity.discountAmount || 0,
        description: this.invoiceEntity.description || '',
        items: this.invoiceItems
          .filter((x) => x.product?.id)
          .map((x) => {
            return {
              productId: x.product.id,
              productUnitId: x.unit?.id || null,
              warehouseId: x.warehouseId,
              amount: x.amount || 0,
              price: x.price || 0,
              discountPercentage: x.discountPercent || 0,
              performTaxAmount: x.performTaxAmount || false,
              taxPercentage: parseFloat(x.product.taxPercent) || 0,
              description: x.description || ''
            }
          })
      }

      if (this.isNewInvoice && this.selectedTemplateId) {
        request.templateId = this.selectedTemplateId
      }

      console.log(request)
      let response = null

      if (this.isNewInvoice) {
        response = await invoiceService.create(request)
      } else {
        const updateRequest = {
          ...request,
          id: this.id,
          totalAmount: this.totalAmount || 0,
          paidAmount: this.invoiceEntity.payedAmount || 0,
          remainingAmount: this.invoiceEntity.remainingAmount || 0,
          action: 2,
          items: request.items.map((item) => {
            const originalItem = this.invoiceItems.find((x) => x.product?.id === item.productId);
            return {
              ...item,
              id: originalItem.id,
              totalPrice: (originalItem.amount || 0) * (originalItem.price || 0),
              discount: originalItem.discountAmount || 0,
              taxAmount: originalItem.taxAmount || 0,
              invoiceId: this.id,
              productTitle: originalItem.product?.title || '',
              productCode: originalItem.product?.code || '',
              warehouseTitle: originalItem.product?.warehouses?.find((w) => w.id === originalItem.warehouseId)?.title || '',
              invoiceTitle: this.invoiceEntity.title || '',
              invoiceCode: this.invoiceEntity.code || '',
              action: 2
            };
          })
        };
        console.log(updateRequest);
        if (isRefund) {
          request.warehouseId = this.refundWarehouse.id
          response = await invoiceService.refund(updateRequest)
        } else response = await invoiceService.update(updateRequest)
      }

      if (response.isSuccess) {
        if (isRefund) {
          const path = this.type === 1 ? '/sales' : '/purchase/purchaseInvoices'
          this.selectWarehouseDialog = false
          this.$router.push(path)
        } else {
          if (this.isNewInvoice) {
            this.createdInvoiceEntity = { ...response.value }
          }
          this.showSettlementDecisionDialog = true
        }
      } else {
        this.setErrorMessage(response.errors?.[0]?.message || response.message, 'error')
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
            (item) => item?.product?.id === product.id && item.unit?.barcode == this.barcode
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
            this.invoiceItems[this.selectedRowIndex].product.taxPercent = product.salesTax
            this.invoiceItems[this.selectedRowIndex].productTitle = product.title
            this.invoiceItems[this.selectedRowIndex].amount = 1
            this.invoiceItems[this.selectedRowIndex]._price = product?.salesPrice || 0
            this.invoiceItems[this.selectedRowIndex].unit =
              product?.units?.find((x) => x.barcode == this.barcode) ||
              product?.units?.find((x) => x.isDefault) ||
              {}
            this.invoiceItems[this.selectedRowIndex].price =
              (product?.salesPrice || 0) *
                this.invoiceItems[this.selectedRowIndex].unit?.conversionFactor || 1

            this.invoiceItems[this.selectedRowIndex].warehouseId =
              product?.warehouses[0]?.id || null
          }
        } else this.setErrorMessage(res.message)
      })
      this.barcode = ''
      this.showScanBarcodeMenu = true
      ;(await this.$refs.barcodeField)?.focus()
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
        await productService
          .search({
            page: 1,
            size: 100
          })
          .then((res) => {
            if (res.isSuccess) {
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
            let lst = res.value.result.map((x) => {
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
</style>
