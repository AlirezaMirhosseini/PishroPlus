<template>
  <div>
    <v-card class="mb-auto">
      <v-card-text>
        <v-form ref="frm">
          <v-row no-gutters>
            <v-col cols="4" class="px-1 d-none d-sm-block">
              <v-card width="100%">
                <v-tabs v-model="tab" color="primary" align-tabs="start">
                  <v-tab v-for="item in tabItems2" :value="item.title" :key="item.title">
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
                <v-window :touch="false" v-model="tab" width="100%">
                  <v-window-item value="search" class="pa-2" width="100%">
                    <!-- <v-text-field/> -->
                    <v-col class="pa-1" cols="15">
                      <div class="d-flex justify-space-between mb-2 mr-2 ml-2">
                        <v-text-field
                          name="bank"
                          ref="searchField"
                          variant="outlined"
                          density="compact"
                          :label="$t('search')"
                          append-inner-icon="mdi mdi-magnify"
                          v-model="searchQuery"
                        >
                        </v-text-field>
                      </div>
                    </v-col>

                    <v-row no-gutters class="d-flex justify-center">
                      <v-col cols="3">
                        <div
                          class="d-flex justify-center align-center mt-1 ml-1"
                          v-for="(list, index) in favoriteLists"
                          :key="index"
                          :style="{
                            height: '3rem',
                            backgroundColor:
                              selectedFavList === list ? 'rgb(88, 139, 255)' : '#fff',
                            border: selectedFavList === list ? '' : '1px solid rgb(88, 139, 255)',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }"
                          @contextmenu.prevent="(e) => favoriteListContextMenu(e, list.id)"
                          @click="selectFavList(list)"
                        >
                          <p
                            :style="{
                              fontSize: '8pt',
                              color: selectedFavList === list ? '#fff' : 'rgb(88, 139, 255)'
                            }"
                            >{{ list.title }}</p
                          >
                        </div>
                        <div
                          class="d-flex justify-center align-center mt-1 ml-1"
                          :style="{
                            height: '3rem',
                            backgroundColor: '#eee',
                            border: '1px solid #8d8d8d',
                            borderRadius: '5px',
                            cursor: 'pointer'
                          }"
                          @click="openNewFavoriteListDialog"
                        >
                          <p style="font-size: 8pt; color: #8d8d8d">{{ $t('addList') }}</p>
                        </div>
                      </v-col>

                      <v-col cols="9">
                        <v-row no-gutters>
                          <v-col
                            cols="6"
                            xl="4"
                            class="pr-2"
                            v-for="item in filteredItems"
                            :key="item"
                            @contextmenu.prevent="(e) => onContextMenu(e, item.id)"
                            @click="addToTable(item)"
                          >
                            <div
                              class="d-flex flex-column justify-center align-center pa-2 mt-1"
                              style="
                                background-color: rgb(238, 238, 238);
                                border-radius: 5px;
                                cursor: pointer;
                              "
                            >
                              <p style="font-size: 8pt;" class="codeTitle">
                                {{ item.title }}
                              </p>
                              <div class="d-flex main">
                                <p class="price" style="font-size: 7pt">
                                  {{ item.salesPrice.toLocaleString() }}
                                </p>
                              </div>
                            </div>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-window-item>
                  <v-window-item value="barcode" class="pa-2 mb-2">
                    <barcode />
                    <v-text-field
                      name="barcode"
                      :rules="[
                        (v) => {
                          if (v || isAutoCode) return true
                          return $t('enterRequiredField')
                        }
                      ]"
                      ref="barcodeField"
                      variant="outlined"
                      hide-details
                      :label="$t('barcode')"
                      density="compact"
                      class="ml-2"
                      v-model="barcode"
                      @keydown.enter="getProductByBarcode"
                    ></v-text-field>
                  </v-window-item>
                </v-window>
              </v-card>
            </v-col>
            <v-col cols="12" lg="8" md="8">
              <v-row no-gutters>
                <v-col cols="12" sm="6" lg="3" md="4" class="d-flex px-1">
                  <v-text-field
                    name="code"
                    :disabled="isAutoCode"
                    :rules="[
                      (v) => {
                        if (v || isAutoCode) return true
                        return $t('enterRequiredField')
                      }
                    ]"
                    variant="outlined"
                    :label="$t('code')"
                    density="compact"
                    class="ml-2"
                    v-model="quickInvoiceEntity.code"
                  ></v-text-field>
                  <switchButton
                    class="mt-1 ml-2"
                    v-model:checked="isAutoCode"
                    :label="isAutoCode ? $t('automatic') : $t('manual')"
                  />
                </v-col>
                <v-col cols="12" sm="6" lg="4" md="4" class="px-1 pb-5">
                  <date-picker
                    :editable="true"
                    v-model="quickInvoiceEntity.dateTime"
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
                    @editItemClicked="updateItems"
                    addNewRoute="/persons/new"
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
                    <v-icon class="mr-1">{{
                      showMore ? 'mdi-chevron-up' : 'mdi-chevron-down'
                    }}</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
              <v-slide-y-transition>
                <v-row no-gutters v-show="showMore">
                  <v-col cols="12" sm="6" lg="3" md="4" class="pa-1">
                    <v-text-field
                      name="title"
                      :label="$t('title')"
                      variant="outlined"
                      density="compact"
                      ref="title"
                      v-model="quickInvoiceEntity.title"
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
                      v-model="quickInvoiceEntity.dueDateTime"
                      format="YYYY-MM-DD"
                      display-format="jYYYY/jMM/jDD"
                      :label="$t('dueDate')"
                      locale="fa,en"
                      ref="dueDatePicker"
                    />
                  </v-col>
                  <v-col cols="12" sm="6" lg="3" md="4" class="pa-1 pb-5 pb-md-1">
                    <v-select
                      density="compact"
                      :label="$t('currencyUnit')"
                      hide-details
                      variant="outlined"
                      disabled
                    ></v-select>
                  </v-col>
                  <v-col cols="12" sm="6" lg="3" md="4" class="pa-1">
                    <v-row no-gutters>
                      <v-col cols="12">
                        <AccountSelector
                          :persistent="false"
                          v-model="marketerEntity"
                          :title="`${$t('marketer')}/${$t('visitor')}`"
                          tabindex="-1"
                          addNewRoute="/persons/new"
                        />
                      </v-col>
                      <v-col cols="12" class="pr-1">
                        <v-text-field
                          v-if="marketerEntity.type === 0"
                          hide-details
                          :disabled="
                            !marketerEntity.selectedAccount ||
                            !marketerEntity.selectedAccount.accountId
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
                              @click="
                                ;(marketerEntity.marketingPercent = 0), (marketerEntity.type = 1)
                              "
                            ></v-icon>
                          </template>
                        </v-text-field>
                        <v-text-field
                          v-else
                          hide-details
                          :disabled="
                            !marketerEntity.selectedAccount ||
                            !marketerEntity.selectedAccount.accountId
                          "
                          bg-color="transparent"
                          density="compact"
                          variant="outlined"
                          v-maska:[maskOptions]
                          :model-value="marketerEntity.marketingAmount || 0"
                          @maska="
                            (ev) =>
                              (marketerEntity.marketingAmount = parseFloat(ev.detail.unmasked))
                          "
                        >
                          <template v-slot:append-inner>
                            <v-icon
                              icon="mdi-cash"
                              size="x-small"
                              @click="
                                ;(marketerEntity.marketingAmount = 0), (marketerEntity.type = 0)
                              "
                            ></v-icon>
                          </template>
                        </v-text-field>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-slide-y-transition>
              <data-table
                class="invoice-items-table"
                :headers="quickInvoiceItemHeaders"
                :items="quickInvoiceItems"
                :showPagination="false"
              >
                <template v-slot:column_warehouse="{ entity, index }">
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
                <template v-slot:column_productTitle="{ index }">
                  <v-text-field
                    hide-details
                    bg-color="transparent"
                    density="compact"
                    variant="solo"
                    append-inner-icon="mdi mdi-open-in-new"
                    @click:append-inner="openProductDialog(index)"
                    @keyup.enter="openProductDialog(index)"
                    v-model="quickInvoiceItems[index].productTitle"
                    style="margin: -10px"
                    :ref="`product_${index}`"
                  />
                </template>
                <!-- <template v-slot:column_value="{ entity, index }">
                  <v-text-field
                    hide-details
                    bg-color="transparent"
                    density="compact"
                    variant="solo"
                    :model-value="entity.amount"
                    @change="(ev) => (quickInvoiceItems[index].amount = parseFloat(ev.target.value || 0))"
                    style="margin: -10px"
                  />
                </template> -->
                <template v-slot:column_unit="{ entity, index }">
                  <v-text-field
                    hide-details
                    bg-color="transparent"
                    density="compact"
                    variant="solo"
                    readonly
                    :model-value="entity.unit"
                    style="margin: -10px"
                  >
                    <template v-slot:append-inner v-if="entity.product?.subunits?.length > 0">
                      <v-menu open-on-hover width="150">
                        <template v-slot:activator="{ props }">
                          <v-icon size="x-small" v-bind="props" class="c-pointer">mdi-menu</v-icon>
                        </template>
                        <v-list density="compact">
                          <v-list-item
                            @click="changeUnit(entity, index, entity.product?.unit, 1)"
                            v-if="entity.unit != entity.product?.unit"
                          >
                            <v-list-item-title>{{ entity.product?.unit }}</v-list-item-title>
                          </v-list-item>
                          <v-list-item
                            v-for="(unit, idx) in entity.product?.subunits.filter(
                              (x) => x.title !== entity.unit
                            )"
                            :key="idx"
                            @click="changeUnit(entity, index, unit.title, unit.conversionFactor)"
                          >
                            <v-list-item-title>{{
                              `${unit.title}(${unit.conversionFactor + entity.product?.unit})`
                            }}</v-list-item-title>
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
                    @change="
                      (ev) => (quickInvoiceItems[index].amount = parseFloat(ev.target.value || 0))
                    "
                    style="margin: -10px"
                  />
                </template>
                <template v-slot:column_price="{ entity, index }">
                  <v-text-field
                    hide-details
                    bg-color="transparent"
                    density="compact"
                    variant="solo"
                    v-maska:[maskOptions]
                    :model-value="entity.price"
                    @maska="
                      (ev) => (quickInvoiceItems[index].price = parseFloat(ev.detail.unmasked || 0))
                    "
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
                              quickInvoiceItems[index].price = parseFloat(
                                entity.product?.salesPrice
                              )
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
                            @click="quickInvoiceItems[index].price = parseFloat(item.price)"
                          >
                            <v-list-item-title
                              >{{ item.title }} :
                              {{ item.price.toLocaleString() }}</v-list-item-title
                            >
                          </v-list-item>
                        </v-list>
                      </v-menu>
                    </template>
                  </v-text-field>
                </template>
                <template v-slot:column_tax="{ entity, index }">
                  <div class="d-flex">
                    <v-checkbox
                      v-show="entity.product?.salesTax"
                      density="compact"
                      hide-details
                      :model-value="
                        !isNewInvoice ? quickInvoiceItems[index].performTaxAmount : true
                      "
                      @change="
                        (ev) => (quickInvoiceItems[index].performTaxAmount = ev.target.checked)
                      "
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
                <template v-slot:column_discount="{ entity, index }">
                  <v-text-field
                    v-if="quickInvoiceItems[index].discountType === 1"
                    hide-details
                    bg-color="transparent"
                    density="compact"
                    variant="solo"
                    :model-value="entity.discountPercent"
                    @change="
                      (ev) => (
                        (quickInvoiceItems[index].discountPercent = parseFloat(ev.target.value)),
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
                      (ev) =>
                        (quickInvoiceItems[index].discountAmount = parseFloat(ev.detail.unmasked))
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
                <template v-slot:column_index="{ index }">{{ index + 1 }}</template>
                <template v-slot:column_operation="{ index }">
                  <v-btn
                    variant="text"
                    color="error"
                    height="45"
                    :icon="DeleteIcon"
                    @click="quickInvoiceItems.splice(index, 1)"
                  />
                </template>
                <template v-slot:append-inner v-if="entity?.product.subunits?.length > 0">
                  <v-menu open-on-hover width="150">
                    <template v-slot:activator="{ props }">
                      <v-icon size="x-small" v-bind="props" class="c-pointer">mdi-menu</v-icon>
                    </template>
                    <v-list density="compact">
                      <v-list-item
                        @click="changeUnit(entity, index, entity.product?.unit, 1)"
                        v-if="entity.unit != entity.product?.unit"
                      >
                        <v-list-item-title>{{ entity.product?.unit }}</v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-for="(unit, idx) in entity.product?.subunits.filter(
                          (x) => x.title !== entity.unit
                        )"
                        :key="idx"
                        @click="changeUnit(entity, index, unit.title, unit.conversionFactor)"
                      >
                        <v-list-item-title>{{
                          `${unit.title}(${unit.conversionFactor + entity.product?.unit})`
                        }}</v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
                <template v-slot:column_coefficient="{ entity }">
                  {{ entity.conversionFactor }}
                </template>
              </data-table>
              <v-row no-gutters>
                <v-col cols="12" md="9" class="pishro-border">
                  <v-tabs v-model="settlementTab" color="primary" align-tabs="start">
                    <v-tab v-for="item in tabItems" :value="item.title" :key="item.title">
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
                    <v-window-item value="description" class="pa-2">
                      <v-textarea
                        v-model="quickInvoiceEntity.desc"
                        variant="outlined"
                        rows="1"
                        hide-details
                        tabIndex="-1"
                        :label="`${$t('description')} ${$t('factor')}`"
                      ></v-textarea>
                    </v-window-item>
                    <v-window-item :eager="true" value="transportation" class="pa-2">
                      <v-col cols="12" sm="6" lg="3" md="4">
                        <AccountSelector
                          v-model="transportationEntity"
                          :title="$t('person')"
                          max-width="300px"
                        />
                        <v-text-field
                          :label="$t('cost')"
                          variant="outlined"
                          density="compact"
                          ref="transportation-cost"
                          v-maska:[maskOptions]
                          :model-value="transportationEntity.cost"
                          @maska="
                            (ev) =>
                              (transportationEntity.cost = parseFloat(ev.detail.unmasked || 0))
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
                        <th width="50%" height="35" class="text-center">{{ $t('count') }}</th>
                        <td width="50%" class="text-center">
                          {{ quickInvoiceItems.filter((x) => x.product).length }}
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
                      :prepend-icon="saveIcon"
                      color="info"
                      class="ma-1"
                      :disabled="!formIsValid"
                      @click="createOrUpdate(true)"
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
          </data-table>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn @click="selectProduct" color="info" variant="elevated" size="large">
            <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}</v-btn
          >
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
            <v-btn color="info" width="150" to="/sales" variant="elevated"
              ><v-icon class="ml-1">mdi-chevron-right</v-icon>
              {{ $t('confirm') + '/' + $t('continue') }}</v-btn
            >
            <v-btn
              color="info"
              variant="elevated"
              width="150"
              @click="$router.go($router.currentRoute)"
              ><v-icon class="ml-1">mdi-plus</v-icon>{{ $t('submitAndNew') }}</v-btn
            >
            <v-btn color="primary" width="150" variant="elevated">
              <v-icon class="ml-1">mdi-cash-register</v-icon>{{ $t('invoiceSettlement') }}</v-btn
            >
          </v-row>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="addNewFavoriteList.dialog" width="75%">
      <v-card>
        <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
          <v-icon class="me-2" color="info" icon="mdi mdi-shopping-outline" />
          <p style="font-weight: bold">
            {{ `${$t('selectProduct')}` }}
          </p>
          <div class="ms-auto">
            <v-btn
              color="grey"
              icon="mdi mdi-close"
              @click="closeNewFavoriteListDialog"
              variant="text"
            />
          </div>
        </v-row>
        <v-card-text>
          <fieldset class="pishro-border mb-2 pb-4">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('favoriteListDetail') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="12" sm="3">{{ $t('favoriteListName') }}:</v-col>
              <v-col class="pb-0" cols="12" sm="9">
                <v-text-field
                  name="listname"
                  ref="listNameField"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  @input="
                    () => {
                      if (!addNewFavoriteList.hasChanged) addNewFavoriteList.hasChanged = true
                    }
                  "
                  autofocus
                  variant="outlined"
                  density="compact"
                  v-model="addNewFavoriteList.form.listTitle"
                ></v-text-field>
              </v-col>
            </v-row>
          </fieldset>
          <data-table
            :headers="productSelectionHeaders"
            :items="items"
            :selectableRow="true"
            :hasEnter="true"
            :hasSearch="true"
            :searchText="productDialogSearchTxt"
            :searchItems="['title', 'salesPrice', 'categoryTitle', 'stock']"
            @enterMethod="selectProduct"
            v-model:selectedRow="selectedRow.product"
            clickableRow
            itemValue="id"
          >
            <template v-slot:toolbar>
              <v-row class="ms-2 justify-end" no-gutters>
                <v-btn
                  to="/warehouse/products/new"
                  @click="addNewFavoriteList.dialog = false"
                  variant="tonal"
                  color="info"
                  >{{ $t('addProduct') }}</v-btn
                >
                <v-btn
                  to="/warehouse/services/new"
                  @click="addNewFavoriteList.dialog = false"
                  class="ms-2"
                  variant="tonal"
                  color="primary"
                  >{{ $t('addService') }}</v-btn
                >
              </v-row>
            </template>
            <template v-slot:column_select="{ entity }">
              <div class="d-flex justify-center align-center">
                <v-checkbox
                  v-model="selectedProducts"
                  :value="entity.id"
                  hide-details
                  density="compact"
                ></v-checkbox>
              </div>
            </template>
            <template v-slot:column_index="{ index }"> {{ index + 1 }}</template>
            <template v-slot:column_salesPrice="{ entity }">
              {{ entity.salesPrice?.toLocaleString() || '' }}
            </template>
          </data-table>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn @click="saveAddNewFavoriteList" color="info" variant="elevated" size="large">
            <v-icon size="small">mdi-check</v-icon> {{ $t('confirm') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { defaultStore } from '../../stores/default'
import switchButton from '../../components/baseComponents/switchButton.vue'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import AccountSelector from '../../components/accountsComponents/accountSelector.vue'
import SaveIcon from '../../components/icons/Save.vue'
import TransferCategoryIcon from '../../components/icons/TransferCategory.vue'
import productService from '../../../api/product/productService.js'
import utils from '../../../plugins/utils.js'
import { markRaw } from 'vue'
import barcode from './barcode.vue'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
import { mapActions } from 'pinia'
import invoiceService from '../../../api/invoice/invoiceService.js'
import settingService from '../../../api/setting/settingService'
import accountService from '../../../api/account/accountService'
import DeleteIcon from '../../components/icons/Delete.vue'
export default {
  data() {
    return {
      searchQuery: '',
      selectedFavList: null,
      DeleteIcon: markRaw(DeleteIcon),
      SaveIcon: markRaw(SaveIcon),
      TransferCategoryIcon: markRaw(TransferCategoryIcon),
      marketerEntity: {},
      showMore: false,
      customerEntity: {},
      showSettlementDecisionDialog: false,
      createdInvoiceEntity: {
        code: '',
        id: ''
      },
      productDialogSearchTxt: '',
      isAutoCode: true,
      showProductsAndServices: false,
      showProductSelectionDialog: false,
      showDetailedAccounts: false,
      products: [],
      saveIcon: markRaw(SaveIcon),
      selectedAccount: {},
      showScanBarcodeMenu: false,
      settlementItems: [],
      tab: 'barcode',
      settlementTab: 'description',
      maskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, ''),
        postProcess: (val) => {
          if (!val) return ''
          return Number.parseInt(val).toLocaleString()
        }
      },
      barcode: '',
      product: [],
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
      quickInvoiceItemHeaders: [
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
          key: 'productTitle',
          width: '150px'
        },
        {
          title: this.$t('warehouse'),
          align: 'center',
          sortable: true,
          show: false,
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
          title: this.$t('price'),
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
          title: this.$t('tax'),
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
      items: [],
      tabItems: [
        { icon: 'mdi-text-long mdi-flip-h', title: 'description' },
        // { icon: 'mdi-cash-register', title: 'invoiceSettlement' },
        { icon: 'mdi-truck-delivery', title: 'transportation' }
      ],
      tabItems2: [
        { icon: 'mdi mdi-magnify', title: 'search' },
        { icon: 'mdi-barcode-scan', title: 'barcode' }
      ],
      quickInvoiceItems: [{ id: 1, performTaxAmount: true }],
      transportationEntity: {},
      quickInvoiceEntity: {
        additionsAndDeductions: [],
        code: '',
        dateTime: new Date().toISOString().split('T')[0],
        dueDateTime: new Date().toISOString().split('T')[0]
      },
      selectedRowIndex: 0,
      selectedRow: {},
      productHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
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
      productSelectionHeaders: [
        {
          title: '',
          align: 'center',
          key: 'select',
          width: '10px'
        },
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
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
      saveAsDraft: false,
      showOperationTypeDialog: false,
      marketerEntity: {},
      addNewFavoriteList: {
        dialog: false,
        hasChanged: false,
        isEdit: false,
        form: {
          favoriteListId: null,
          listTitle: '',
          productIds: []
        }
      },
      selectedProducts: [],
      favoriteListProducts: [],
      favoriteLists: [],
      invoiceEntity: {
        additionsAndDeductions: [],
        code: '',
        settlement: {
          hasDeposit: true,
          hasCheck: false,
          hasCash: false,
          check: {
            amountMasked: {}
          },
          deposit: {
            amountMasked: {},
            defaultDepositBankAccount: {},
            type: 6
          },
          cash: {
            defaultCashBoxAccount: {},
            amountMasked: {}
          }
        },
        dateTime: new Date().toISOString().split('T')[0],
        dueDateTime: new Date().toISOString().split('T')[0]
      }
    }
  },
  props: {
    modelValue: {
      default: () => {
        return {
          title: '',
          id: '',
          open: true,
          draggable: true,
          notClickable: false,
          parent: {}
        }
      }
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    async getFavoriteListProducts() {
      await productService
        .search({ entity: { favoriteListId: this.selectedFavList.id } })
        .then((res) => {
          if (res.isSuccess) this.favoriteListProducts = res.entities
          else this.setErrorMessage(res.message)
        })
    },
    selectProduct() {
      console.log('Selected products:', this.selectedProducts)
    },
    async openNewFavoriteListDialog() {
      this.addNewFavoriteList = {
        ...this.addNewFavoriteList,
        hasChanged: false,
        dialog: true,
        isEdit: false,
        form: {
          listTitle: ''
        }
      }
      await this.$refs.listNameField?.focus()
    },
    closeNewFavoriteListDialog() {
      if (this.addNewFavoriteList.hasChanged)
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.addNewFavoriteList.dialog = false
        })
      else this.addNewFavoriteList.dialog = false
    },
    async saveAddNewFavoriteList() {
      if (this.selectedProducts.length === 0) {
        this.setErrorMessage(this.$t('listCantBeEmpty'), 'error')
        return
      }
      if (this.addNewFavoriteList.form.listTitle) {
        let entity = {
          favoriteListId: this.addNewFavoriteList.isEdit ? this.selectedFavList.id : null,
          listTitle: this.addNewFavoriteList.form.listTitle,
          productIds: this.selectedProducts
        }
        let res = await productService.addOrUpdateFavoriteList({ entity: entity })
        if (res.isSuccess) {
          this.addNewFavoriteList.isEdit
            ? this.setErrorMessage(this.$t('listSuccessfullyEdited'), 'success')
            : this.setErrorMessage(this.$t('listSuccessfullyAdded'), 'success')

          this.addNewFavoriteList = {
            hasChanged: false,
            dialog: false,
            isEdit: false,
            form: {
              favoriteListId: null,
              listTitle: '',
              productIds: []
            }
          }
          await this.getFavoriteLists()
          this.selectFavList(entity)
          this.selectedFavList = entity
          this.selectedProducts = []
        } else this.setErrorMessage(res.message)
      }
    },
    selectFavList(favList) {
      if (this.selectedFavList === favList) {
        this.selectedFavList = null
        this.favoriteListProducts = []
      } else {
        this.selectedFavList = favList
        this.getFavoriteListProducts()
      }
    },
    favoriteListContextMenu(e, id) {
      e.preventDefault()
      let lst = [
        {
          label: this.$t('editList'),
          icon: 'mdi mdi-pencil',
          onClick: () => {
            this.editFavoriteList(id)
          }
        },
        {
          label: this.$t('deleteList'),
          icon: 'mdi mdi-delete',
          onClick: () => {
            this.confirmDeleteFavoriteList(id)
          }
        }
      ]
      this.$contextmenu({
        items: lst,
        theme: this.$vuetify.theme.global.name == 'light' ? 'win10' : 'win10 dark',
        iconFontClass: 'iconfont',
        zIndex: 3,
        minWidth: 100,
        x: e.x,
        y: e.y
      })
    },
    async editFavoriteList(favoriteListId) {
      this.selectedFavList = this.favoriteLists.find((list) => list.id === favoriteListId)

      if (this.selectedFavList) {
        this.addNewFavoriteList.isEdit = true
        this.addNewFavoriteList.dialog = true
        this.addNewFavoriteList.form.listTitle = this.selectedFavList.title
        this.selectedProducts = []

        await this.getFavoriteListProducts()
        this.favoriteListProducts.forEach((product) => {
          this.selectedProducts.push(product.id)
        })

        await this.$refs.listNameField?.focus()
      }
    },
    confirmDeleteFavoriteList(favoriteListId) {
      // console.log(this.selectedFavList);
      console.log(this.favoriteLists)
      this.setWarningDialog(true, this.$t('confirmDelete'), this.$t('confirmDeleteMessage'), () => {
        this.deleteFavoriteList(favoriteListId)
      })
    },
    async deleteFavoriteList(favoriteListId) {
      this.selectedFavList = this.favoriteLists.find((list) => list.id === favoriteListId)

      let entity = {
        favoriteListId: this.selectedFavList.id
      }

      await productService.deleteFavoriteList({ entity: entity }).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('listSuccessfullyDeleted'), 'success')

          this.addNewFavoriteList = {
            hasChanged: false,
            dialog: false,
            isEdit: false,
            form: {
              favoriteListId: null,
              listTitle: '',
              productIds: []
            }
          }
          this.getFavoriteLists()
        } else this.setErrorMessage(res.message)
      })
    },
    onContextMenu(e, id) {
      e.preventDefault()
      let lst = [
        {
          label: this.$t('editProduct'),
          icon: 'mdi mdi-pencil',
          onClick: () => {
            this.$router.push(`/warehouse/products/${id}?call_back=${this.$route.fullPath}`)
          }
        }
      ]
      this.$contextmenu({
        items: lst,
        theme: this.$vuetify.theme.global.name == 'light' ? 'win10' : 'win10 dark',
        iconFontClass: 'iconfont',
        zIndex: 3,
        minWidth: 100,
        x: e.x,
        y: e.y
      })
    },
    updateItems(id) {
      this.$router.push('/persons/' + id)
    },
    addToTable(item) {
      const existingItemIndex = this.quickInvoiceItems.findIndex(
        (m) => m.product && m.product.id === item.id
      )
      if (existingItemIndex > -1) {
        this.quickInvoiceItems[existingItemIndex].amount += 1
      } else {
        let emptyRowIndex = this.quickInvoiceItems.findIndex((m) => !m.product || !m.product.id)
        if (emptyRowIndex > -1) {
          this.quickInvoiceItems[emptyRowIndex] = {
            ...item,
            product: { ...item },
            productTitle: item.title,
            price: item.salesPrice,
            tax: item.salesTax,
            performTaxAmount: true,
            amount: 1
          }
        } else {
          this.quickInvoiceItems.push({
            ...item,
            product: { ...item },
            productTitle: item.title,
            price: item.salesPrice,
            tax: item.salesTax,
            performTaxAmount: true,
            amount: 1
          })
        }
      }
    },
    changeUnit(item, index, unit, conversionFactor) {
      this.quickInvoiceItems[index].unit = unit
      this.quickInvoiceItems[index].conversionFactor = conversionFactor
      this.quickInvoiceItemHeaders.filter((x) => x.key === 'coefficient')[0].show = !(
        !conversionFactor || conversionFactor == 1
      )
    },
    calcItemDiscountAmount(item, index, type) {
      let price = this.calcPrice(item)
      if (type === 1) {
        this.quickInvoiceItems[index].discountPercent = item.discountAmount
          ? (item.discountAmount * 100) / price
          : 0
      } else {
        this.quickInvoiceItems[index].discountAmount = item.discountPercent
          ? (item.discountPercent * price) / 100
          : 0
      }
    },
    switchDiscountType(item, index, type) {
      this.quickInvoiceItems[index].discountType = type
      let price = this.calcPrice(item)

      if (type === 1) {
        this.quickInvoiceItems[index].discountPercent = item.discountAmount
          ? (item.discountAmount * 100) / price
          : 0
      } else {
        this.quickInvoiceItems[index].discountAmount = item.discountPercent
          ? (item.discountPercent * price) / 100
          : 0
      }
    },
    //  navToInvoiceSettlement() {
    //   this.$router.push(
    //     `/transfer/wizard/register/receive?issuer=0&amount=${this.totalPayableAmount}&id=${this.createdInvoiceEntity.id}`
    //   )
    // },
    async getDefaultSettings() {
      let res = await settingService.getSalesSetting()
      let defaultSalesInvoiceCustomerAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceCustomerAccountId'
      )[0]?.value
      let defaultSalesInvoiceCustomerDetailedAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceCustomerDetailedAccountId'
      )[0]?.value
      this.showScanBarcodeMenu =
        res.entities.filter((x) => x.name === 'EnableBarcodeReaderAsDefault')[0]?.value == 'true'

      let defaultSalesInvoiceSettlementCashAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceSettlementCashAccountId'
      )[0]?.value
      let defaultSalesInvoiceSettlementCashDetailedAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceSettlementCashDetailedAccountId'
      )[0]?.value

      let defaultSalesInvoiceSettlementDepositBankAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceSettlementDepositBankAccountId'
      )[0]?.value

      let defaultSalesInvoiceSettlementDepositBankDetailedAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceSettlementDepositBankDetailedAccountId'
      )[0]?.value

      let defaultSalesInvoiceSettlementCheckBankAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceSettlementCheckBankAccountId'
      )[0]?.value

      let defaultSalesInvoiceSettlementCheckBankDetailedAccountId = res.entities.filter(
        (x) => x.name === 'DefaultSalesInvoiceSettlementCheckBankDetailedAccountId'
      )[0]?.value

      this.tab = this.showScanBarcodeMenu ? 'barcode' : 'search'
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
            let account = res.entities.filter(
              (x) => x.accountId == defaultSalesInvoiceCustomerAccountId
            )[0]
            this.customerEntity.selectedAccount = {
              accountId: account?.accountId,
              fName: account?.name,
              name: account?.name,
              code: account?.code
            }
            let detailedAccount = res.entities.filter(
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
    async getAllProducts() {
      await productService.getAll().then((res) => {
        if (res.isSuccess) {
          this.items = res.entities
        }
      })
    },
    async getFavoriteLists() {
      await productService.getFavoriteList().then((res) => {
        if (res.isSuccess) {
          this.favoriteLists = res.entities
        }
      })
    },
    async createOrUpdate(isDraft) {
      if (!(await this.$refs.frm.validate()) || (!isDraft && !this.formIsValid)) return
      this.showSettlementDecisionDialog = true
      let entity = {
        transportationDetailedAccountId:
          this.transportationEntity?.selectedDetailedAccount?.detailedAccountId,
        customerAccountId: this.customerEntity?.selectedAccount?.accountId,
        customerDetailedAccountId: this.customerEntity?.selectedDetailedAccount?.detailedAccountId,
        dateTime: new Date(),
        dueDateTime: new Date(),
        type: 1,
        isDraft: isDraft,
        desc: this.quickInvoiceEntity.desc,

        title: this.quickInvoiceEntity.title,
        code: this.quickInvoiceEntity.code,
        items: this.quickInvoiceItems
          .filter((x) => x.product && Object.keys(x.product).length > 0)
          .map((x) => {
            return {
              ...x,
              discount: x.discountAmount,
              productId: x.product.id,
              detailedAccountId: x.product?.detailedAccountId || x.detailedAccountId,
              accountId: x.product?.accountId || x.accountId
            }
          })
      }

      await invoiceService.create({ entity }).then((res) => {
        if (res.isSuccess) {
          this.createdInvoiceEntity = { ...res.entity }
          this.showSettlementDecisionDialog = true
          this.setErrorMessage(this.$t('invoiceSuccessfullyUpdated'), 'success')
        } else {
          this.setErrorMessage(res.message, 'error')
        }
      })
    },
    calcPrice(item) {
      return (
        (item?.price || 0) *
        (item?.amount || 0) *
        (item.conversionFactor > 1 ? item.conversionFactor : 1)
      )
    },
    calcTaxAmount(item, price) {
      let taxAmount = 0
      if (item.product?.salesTax && item.product?.salesTax > 0 && item.performTaxAmount) {
        taxAmount = (price * item.product.salesTax) / 100
      }
      item.taxAmount = taxAmount
      return taxAmount
    },
    caclItemTotalAmount(item, index) {
      let price = this.calcPrice(item)
      item.totalAmount = price
      price -= item.discountAmount || 0
      price += this.calcTaxAmount(item, price)
      return price > 0 ? price : 0
    },
    addNewRow() {
      let ids = this.quickInvoiceItems.filter((x) => typeof x.id == 'number').map((x) => x.id)
      ids.sort((a, b) => b - a)
      this.quickInvoiceItems.push({ id: ids[0] + 1, performTaxAmount: true })
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
          const existingProductIndex = this.quickInvoiceItems.findIndex(
            (item) => item.product && item.product.id === this.products[0].id
          )
          if (existingProductIndex >= 0) this.quickInvoiceItems[existingProductIndex].amount += 1
          else {
            this.selectedRowIndex = this.quickInvoiceItems.findIndex(
              (x) => !x.product || !x.product.id
            )
            if (this.selectedRowIndex < 0) {
              this.addNewRow()
              this.selectedRowIndex = this.quickInvoiceItems.length - 1
            }
            let product = { ...res.entities[0] }
            this.quickInvoiceItems[this.selectedRowIndex].product = { ...product }
            this.quickInvoiceItems[this.selectedRowIndex].productTitle = product.title
            this.quickInvoiceItems[this.selectedRowIndex].amount = 1
            this.quickInvoiceItems[this.selectedRowIndex].price = product?.salesPrice || 0
            this.quickInvoiceItems[this.selectedRowIndex].unit = product?.unit || ''
          }
          this.barcode = ''
        } else this.setErrorMessage(res.message)
      })
    },
    async openProductDialog(rowIndex) {
      await this.searchProducts()
      this.productDialogSearchTxt = this.quickInvoiceItems[rowIndex].productTitle
      this.selectedRowIndex = rowIndex
      this.showProductSelectionDialog = true
    },
    async searchProducts() {
      this.products = []
      if (this.showProductsAndServices)
        await productService.search({ entity: {} }).then((res) => {
          if (res.isSuccess) {
            this.products = res.entities.map((x) => {
              return {
                ...x,
                typeTitle: x.type === 0 ? this.$t('product') : this.$t('service'),
                type: x.type
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
                title: x.fName,
                type: 2,
                typeTitle: this.$t('account'),
                categoryTitle: utils.showAccountFamily(x.family)
              }
            })
            this.products = [...this.products, ...lst]
          }
        })
    }
  },
  components: {
    switchButton,
    AccountSelector,
    dataTable,
    barcode
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) => {
        const query = this.searchQuery.toLowerCase()
        const matchesQuery =
          (typeof item.code === 'string' && item.code.toLowerCase().includes(query)) ||
          (typeof item.title === 'string' && item.title.toLowerCase().includes(query)) ||
          (typeof item.categoryTitle === 'string' &&
            item.categoryTitle.toLowerCase().includes(query)) ||
          (typeof item.stock === 'string' && item.stock.toString().toLowerCase().includes(query)) ||
          (typeof item.unit === 'string' && item.unit.toLowerCase().includes(query)) ||
          (typeof item.desc === 'string' && item.desc.toLowerCase().includes(query))
        if (this.selectedFavList) {
          const isInFavoriteList = this.favoriteListProducts.some(
            (favProduct) => favProduct.id === item.id
          )
          return matchesQuery && isInFavoriteList
        }
        return matchesQuery
      })
    },
    formIsValid() {
      return (
        this.customerEntity?.selectedAccount?.accountId &&
        this.quickInvoiceEntity.title &&
        this.quickInvoiceItems.filter((x) => x.product && Object.keys(x.product).length > 0)
          .length > 0
      )
    },
    isNewInvoice() {
      return this.currentActiveTab.path === '/sales/quickInvoice/new'
    },
    totalAmount() {
      let sum = 0
      this.quickInvoiceItems.forEach((x) => (sum += x.totalAmount || 0))
      return sum
    },
    totalTax() {
      let taxSum = 0
      this.quickInvoiceItems.forEach((x) => (taxSum += x.taxAmount || 0))
      return taxSum
    },
    totalAdditions() {
      let sum = 0
      this.quickInvoiceEntity.additionsAndDeductions
        ?.filter((x) => x.type === 0)
        ?.forEach((x) => (sum += x.amount))
      return sum
    },
    totalDeductions() {
      let sum = 0
      this.quickInvoiceEntity.additionsAndDeductions
        ?.filter((x) => x.type === 1)
        ?.forEach((x) => (sum += x.amount))
      return sum
    },
    totalDiscount() {
      let disSum = 0
      this.quickInvoiceItems.forEach((x) => (disSum += x.discountAmount || 0))
      disSum += this.quickInvoiceEntity.discountAmount || 0
      return disSum
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
    totalPayableRemainAmount() {
      if (this.totalPayableAmount <= 0) {
        return 0
      }
      let res =
        this.totalPayableAmount -
        (this.settlement.deposit.amount || 0) -
        (this.settlement.cash.amount || 0) -
        (this.settlement.check.amount || 0)

      return res <= 0 ? 0 : res
    },
    totalSettlementItems() {
      let sum = 0
      this.settlementItems.forEach((it) => {
        sum += parseFloat(it.amount)
      })
      return sum
    }
  },
  watch: {
    tab(newTab) {
      if (newTab === 'barcode') {
        this.$nextTick(() => {
          this.$refs.barcodeField?.focus()
        })
      } else
        this.$nextTick(() => {
          this.$refs.searchField?.focus()
        })
    },
    showProductSelectionDialog(val) {
      if (!val) {
        this.quickInvoiceItems[this.selectedRowIndex].productTitle =
          this.quickInvoiceItems[this.selectedRowIndex]?.product?.title || ''
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
          this.quickInvoiceEntity.title =
            this.$t('salesInvoice') + '_' + val?.selectedDetailedAccount?.fName
          // ;(await this.$refs['title']).focus()
        }
      }
    }
  },
  async mounted() {
    ;(await this.$refs['datePicker']).focus()
    await this.getAllProducts()
    await this.getDefaultSettings()
    await this.getFavoriteLists()
  }
}
</script>
<style scoped>
.unit {
  background-color: #46be91;
  color: white;
  display: flex;
  justify-content: center;
  width: 30px;
  border-radius: 5px;
  padding: 2px;
  /* align-items: center; */
  font-size: 8pt;
}

.price {
  background-color: #588bff;
  color: white;
  display: flex;
  border-radius: 5px;
  height: 25px;
  padding: 5px;
  align-items: center;
  height: 20px;
  font-size: 10pt;
}

.img {
  max-width: 50px;
  max-height: 50px;
  border-radius: 5px;
  border: 1px solid lightgray;
  padding: 5px;
  float: right;
}

@media (max-width: 1308px) {
  .img {
    width: 40px;
    height: 40px;
    border-radius: 3px;
    border: 1px solid lightgray;
    padding: 2px;
    float: right;
  }

  .price {
    background-color: #588bff;
    color: white;
    display: flex;
    border-radius: 5px;
    height: 15px;
    padding: 5px;
    align-items: center;
    /* height: 20px; */
    font-size: 7pt;
  }

  .unit {
    background-color: #46be91;
    color: white;
    display: flex;
    justify-content: center;

    border-radius: 5px;
    padding: 2px;
    /* align-items: center; */
    font-size: 7pt;
  }

  .codeTitle {
    font-size: 4pt;
  }

  .main {
    display: flex;
    flex-direction: column;
  }
}
</style>