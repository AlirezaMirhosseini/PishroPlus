<template>
  <!-- <v-dialog persistent v-model="showTopDescsDialog" width="400px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="documentPaperIcon" />
        <p style="font-weight: bold">
          {{ $t('commonDescs') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="showTopDescsDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <v-text-field
          class="mb-4"
          hide-details
          variant="outlined"
          name="descSearch"
          autofocus
          density="compact"
          :label="$t('search')"
          append-inner-icon="mdi mdi-magnify"
          v-model="searchDescText"
          v-debounce:200="changeDescText"
        />
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ $t('commonDescs') }}
          </legend>
          <v-list>
            <v-list-item
              @click="selectDesc(item)"
              v-for="(item, index) in descItems"
              :key="index"
              :value="item"
            >
              <v-list-item-title>{{ item }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </fieldset>
      </v-card-text>
    </v-card>
  </v-dialog> -->

  <v-dialog persistent v-model="selectAccountDialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="treeViewIcon" />
        <p style="font-weight: bold">
          {{ isDetailedSelect ? $t('selectDetailedAccount') : $t('selectAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="selectAccountDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="px-1">
        <v-text-field
          v-if="!isDetailedSelect"
          class="mb-4"
          hide-details
          variant="outlined"
          name="search"
          autofocus
          density="compact"
          :label="$t('search')"
          append-inner-icon="mdi mdi-magnify"
          v-model="searchAccountText"
          v-debounce:300="changeSearchText"
        />
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ isDetailedSelect ? $t('detailedAccountsTreeView') : $t('accountingTreeView') }}
          </legend>
          <tree-view
            v-model="treeViewAccountsShowList"
            @activeChanged="setActiveAccount"
            :hasEnter="selectAccountDialog"
            @enterMethod="saveSelectAccount"
          />
        </fieldset>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="saveSelectAccount" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('select') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- <v-dialog persistent v-model="editItemDialog" width="800px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters>
        <v-icon class="me-2" size="40" color="info" :icon="registerDocumentIcon" />
        <div>
          <p style="font-weight: bold">
            {{ $t('edit') + ' ' + $t('voucher') }}
          </p>
          <p class="text-grey pishro-caption">
            {{ $t('addRowToAccountingVoucher') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="editItemDialog = false" variant="text" />
        </div>
      </v-row>
      <custom-form
        @input="
          () => {
            if (!hasChange) hasChange = true
          }
        "
        @submit="saveEditItem"
        :focusoutKeyCode="9"
      >
        <v-card-text>
          <fieldset class="pishro-border">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('properties') }}
            </legend>
            <v-row>
              <v-col class="my-auto" cols="3">{{ $t('accountCode') }}:</v-col>
              <v-col class="pb-0" cols="9"
                ><v-text-field
                  name="code"
                  type="tel"
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi mdi-open-in-new"
                  v-model="editItem.accountCode"
                  @click:append-inner="showSelectAccountDialog('')"
                  @change="updateAccountCode"
                  style="max-width: 200px"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="3">{{ $t('accountName') }}:</v-col>
              <v-col class="pb-0" cols="9"
                ><v-text-field
                  readonly
                  name="name"
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi mdi-open-in-new"
                  @click:append-inner="showSelectAccountDialog('')"
                  v-model="editItem.accountName"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="3">{{ $t('operationDesc') }}:</v-col>
              <v-col cols="9"
                ><v-text-field
                  clearable
                  name="description"
                  variant="outlined"
                  density="compact"
                  hide-details
                  append-inner-icon="mdi mdi-file-document-outline"
                  @click:append-inner="openTopDescDialog(true)"
                  v-model="editItem.description"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="3">{{ $t('detailedCode') }}:</v-col>
              <v-col class="pb-0" cols="9"
                ><v-text-field
                  name="detailedCode"
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi mdi-open-in-new"
                  @click:append-inner="showSelectDetailedAccountDialog()"
                  v-model="editItem.detailedCode"
                  clearable
                  readonly
                  style="max-width: 200px"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="3">{{ $t('detailedName') }}:</v-col>
              <v-col class="pb-0" cols="9"
                ><v-text-field
                  name="detailedName"
                  variant="outlined"
                  density="compact"
                  append-inner-icon="mdi mdi-open-in-new"
                  @click:append-inner="showSelectDetailedAccountDialog()"
                  v-model="editItem.detailedName"
                  clearable
                  readonly
                  style="max-width: 200px"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="3">{{ $t('debtAmount') }}:</v-col>
              <v-col class="pb-0" cols="9"
                ><v-text-field
                  name="debt"
                  variant="outlined"
                  density="compact"
                  v-model="editItem.maskedDebtAmount"
                  v-maska:[maskOptions]
                  @maska="($event) => changeMaskedDebt($event, editItem)"
                  style="max-width: 200px"
                ></v-text-field>
              </v-col>
              <v-col class="my-auto" cols="3">{{ $t('creditAmount') }}:</v-col>
              <v-col class="pb-0" cols="9"
                ><v-text-field
                  name="credit"
                  variant="outlined"
                  density="compact"
                  v-model="editItem.maskedCreditAmount"
                  v-maska:[maskOptions]
                  @maska="($event) => changeMaskedCredit($event, editItem)"
                  style="max-width: 200px"
                ></v-text-field>
              </v-col>
            </v-row>
          </fieldset>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn type="submit" :prepend-icon="saveIcon" variant="flat" color="info"
            >{{ $t('save') }}
          </v-btn>
        </v-card-actions>
      </custom-form>
    </v-card>
  </v-dialog> -->

  <v-dialog v-model="recallVoucherDialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters>
        <v-icon class="me-2" size="40" color="info" icon="mdi-file-import-outline" />
        <div>
          <p style="font-weight: bold">
            {{ $t('voucherRecall') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="recallVoucherDialog = false"
            variant="text"
            tabIndex="-1"
          />
        </div>
      </v-row>
      <v-card-text>
        <v-row no-gutters v-if="recallVoucherStep === 0">
          <v-col cols="6" class="pa-1">
            <v-card class="pa-1 d-flex align-center justify-center flex-column" @click="recall(0)">
              <p class="text-grey text-center">{{ $t('recallVoucherFromAnotherVoucher') }}</p>
              <v-icon size="x-large" color="secondary">mdi-text-box-search-outline</v-icon>
            </v-card>
          </v-col>
          <v-col cols="6" class="pa-1">
            <v-card
              class="pa-1 d-flex align-center justify-center flex-column"
              @click="recall(1)"
              disabled
            >
              <p class="text-grey text-center">{{ $t('recallVoucherFromExcel') }}</p>
              <!-- #005c37 main excel color -->
              <v-icon size="x-large" color="grey">mdi-file-excel</v-icon>
            </v-card>
          </v-col>
        </v-row>
        <div v-else-if="recallVoucherStep === 1">
          <p class="text-grey text-center">{{ $t('selectVoucher') }}</p>
          <data-table
            :headers="recallVouchersDatatableHeader"
            :showPagination="false"
            v-model:selectedRow="selectedRecallVoucher"
            itemValue="id"
            :items="recallVoucherItems"
            :selectableRow="true"
          >
            <template> </template>
          </data-table>
          <v-row no-gutters justify="end">
            <v-btn color="primary" @click="selectRecallVoucher"
              ><v-icon>mdi-check</v-icon> {{ $t('select') }}</v-btn
            >
          </v-row>
        </div>
        <div v-else></div>
      </v-card-text>
    </v-card>
  </v-dialog>
  <v-card>
    <v-card-text>
      <v-form
        @input="
          () => {
            if (!hasChange) hasChange = true
          }
        "
      >
        <!-- <v-row class="d-flex justify-end">
          <report-output />
        </v-row> -->
        <v-row class="mt-6 register-top-row" style="gap: 10px">
          <date-picker
            class="order-1"
            :disabled="isView || [2, 3].indexOf(status) > -1"
            v-model="date"
            format="YYYY-MM-DD"
            display-format="jYYYY/jMM/jDD"
            :label="$t('date')"
            :editable="true"
            locale="fa,en"
            ref="datePicker"
          />
          <v-text-field
            class="order-2 doc-number ml-2"
            variant="outlined"
            hide-details
            density="compact"
            :disabled="isView || isAutomate || [2, 3].indexOf(status) > -1"
            persistent-placeholder
            placeholder="---"
            v-model="documentNumber"
            type="number"
            :label="$t('voucherNumber')"
            style="max-width: 100px"
          />
          <switch-button
            class="order-4 order-md-3"
            v-model:checked="isAutomate"
            :disabled="isView || [2, 3].indexOf(status) > -1"
            :label="isAutomate ? $t('automatic') : $t('manual')"
            style="width: 130px"
          />
          <v-combobox
            class="doc-desc order-3 order-sm-4"
            v-model="documentDesc"
            :items="descItems"
            :readonly="isView || [2, 3].indexOf(status) > -1"
            variant="outlined"
            :hide-details="!isVoucherDescRequired"
            density="compact"
            @update:search="(val) => searchDesc(val, false)"
            :no-data-text="$t('noDataAvailable')"
            :loading="isLoadingDescs"
            tabindex="0"
            :label="$t('voucherDesc')"
            :rules="isVoucherDescRequired ? [(v) => !!v || $t('enterRequiredField')] : []"
          />
        </v-row>
        <v-row class="mt-8 d-flex flex-column flex-md-row">
          <div :class="['px-0 w-100']">
            <v-row class="pishro-border" no-gutters>
              <v-col cols="12" class="px-3">
                <data-table
                  class="accounts-table"
                  :headers="datatableHeader"
                  :items="items"
                  :clickableRow="[2, 3].indexOf(this.status) > -1 ? false : true"
                  :selectableRow="[2, 3].indexOf(this.status) > -1 ? false : true"
                  v-model:selectedRow="selectedRow"
                  itemValue="index"
                  :showPagination="false"
                >
                  <template v-slot:toolbar>
                    <v-btn
                      v-if="!([2, 3].indexOf(this.status) > -1) && !isView"
                      @click="addRow"
                      :prepend-icon="insertRowIcon"
                      variant="tonal"
                      color="primary"
                      style="position: sticky; left: 0; right: 0"
                      >{{ $t('addRow') }}</v-btn
                    >
                    <v-tooltip :text="$t('reverseVoucherItems')">
                      <template v-slot:activator="{ props }">
                        <v-btn
                          v-if="!isView"
                          v-bind="props"
                          @click="reverseItems"
                          variant="tonal"
                          color="primary"
                          class="mx-1"
                          tabIndex="-1"
                          ><v-icon>mdi-swap-horizontal</v-icon></v-btn
                        >
                      </template>
                    </v-tooltip>
                    <v-spacer></v-spacer>
                  </template>
                  <template v-slot:column_accountCode="{ entity, index }">
                    <v-autocomplete
                      :ref="`code_${index}`"
                      v-model="entity.accountCode"
                      :items="filteredAccountss"
                      item-title="hierarchyCode"
                      item-value="hierarchyCode"
                      density="compact"
                      variant="solo"
                      :readonly="isView || !!entity.accountCode"
                      clearable
                      @click:clear="clearAccount(entity, false)"
                      @focus="showInitialAccounts"
                      @click="showInitialAccounts"
                      @update:modelValue="(v) => updateAccountCode(v, entity, index)"
                      @update:search="searchQuery = $event"
                      hide-details
                      bg-color="transparent"
                      :hide-no-data="true"
                      :no-data-text="$t('noDataAvailable')"
                      :append-inner-icon="null"
                    >
                      <template v-slot:clear="{ props }">
                        <v-btn
                          v-if="!isView"
                          variant="plain"
                          :tabindex="-1"
                          v-bind="props"
                          @click.stop="clearAccount(entity, false)"
                          class="clear-btn"
                        >
                          <v-icon size="small">mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="item.raw.name"
                          :title="item.raw.hierarchyCode"
                        ></v-list-item>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div style="font-size: 9pt">{{ entity.accountCode }}</div>
                      </template>
                    </v-autocomplete>
                  </template>
                  <template v-slot:column_accountName="{ entity, index }">
                    <v-autocomplete
                      :ref="`name_${index}`"
                      v-model="entity.accountName"
                      :items="filteredAccountss"
                      item-title="hierarchyName"
                      item-value="hierarchyName"
                      density="compact"
                      variant="solo"
                      :readonly="isView || !!entity.accountId"
                      clearable
                      @click:clear="clearAccount(entity, false)"
                      @focus="showInitialAccounts"
                      @click="showInitialAccounts"
                      @update:modelValue="(v) => updateAccountName(v, entity, index)"
                      @update:search="searchQuery = $event"
                      hide-details
                      bg-color="transparent"
                      :hide-no-data="true"
                      :no-data-text="$t('noDataAvailable')"
                      :append-inner-icon="null"
                    >
                      <template v-slot:clear="{ props }">
                        <v-btn
                          v-if="!isView"
                          variant="plain"
                          :tabindex="-1"
                          v-bind="props"
                          @click.stop="clearAccount(entity, false)"
                          class="clear-btn"
                        >
                          <v-icon size="small">mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:item="{ props, item }">
                        <v-list-item
                          v-bind="props"
                          :subtitle="item.raw.hierarchyCode"
                          :title="item.raw.hierarchyName"
                        ></v-list-item>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div style="font-size: 9pt">{{ entity.accountName }}</div>
                      </template>
                    </v-autocomplete>
                  </template>

                  <template v-slot:column_detailedName="{ entity, index }">
                    <v-autocomplete
                      :ref="`detailed_${index}`"
                      v-model="entity.detailedName"
                      :items="entity.filteredDetailedAccounts"
                      item-title="name"
                      item-value="name"
                      density="compact"
                      variant="solo"
                      :readonly="isView || !!entity.detailedName"
                      clearable
                      @click:clear="clearAccount(entity, true)"
                      @update:modelValue="(v) => updateDetailedAccount(v, entity, index)"
                      @update:search="(val) => onDetailedSearch(val, entity)"
                      hide-details
                      bg-color="transparent"
                      :no-data-text="$t('noDataAvailable')"
                    >
                      <template v-slot:clear="{ props }">
                        <v-btn
                          v-if="!isView"
                          variant="tonal"
                          :tabindex="-1"
                          v-bind="props"
                          @click.stop="clearAccount(entity, true)"
                          class="clear-btn"
                        >
                          <v-icon size="small">mdi-close</v-icon>
                        </v-btn>
                      </template>
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <v-list-item-subtitle>{{
                            item.raw.hierarchicalName
                          }}</v-list-item-subtitle>
                        </v-list-item>
                      </template>
                      <template v-slot:selection="{ item }">
                        <div class="d-flex flex-column">
                          <div
                            v-if="
                              detailedAccountBalances[
                                item?.raw?.hierarchicalCode ?? entity.detailedCode
                              ] !== null
                            "
                            class="text-remaining"
                            :class="{
                              'text-primary':
                                detailedAccountBalances[
                                  item?.raw?.hierarchicalCode ?? entity.detailedCode
                                ] > 0,
                              'text-error':
                                detailedAccountBalances[
                                  item?.raw?.hierarchicalCode ?? entity.detailedCode
                                ] <= 0
                            }"
                          >
                            {{
                              `${$t('remaining')}: ${formatNumber(
                                detailedAccountBalances[
                                  item?.raw?.hierarchicalCode ?? entity.detailedCode
                                ]
                              )}`
                            }}
                          </div>
                          <div style="font-size: 9pt">{{ entity.detailedName }}</div>
                        </div>
                      </template>
                      <template v-slot:append>
                        <v-icon
                          v-if="!isView && hasFieldError(index, 'detailedName')"
                          color="error"
                          size="small"
                        >
                          mdi-alert-circle
                        </v-icon>
                      </template>
                    </v-autocomplete>
                  </template>

                  <template v-slot:column_description="{ entity, index }">
                    <v-combobox
                      :ref="`desc_${index}`"
                      v-model="entity.description"
                      :items="itemDescItems"
                      density="compact"
                      variant="solo"
                      :readonly="isView || [2, 3].indexOf(this.status) > -1"
                      hide-details
                      bg-color="transparent"
                      :append-inner-icon="null"
                      :loading="isLoadingDescs"
                      v-debounce:500="(val) => !isView && searchDesc(val, true)"
                      @update:modelValue="(v) => updateDescription(v, entity, index)"
                      @keyup.tab="fillDescfromLastItem(entity, index)"
                      :no-data-text="$t('noDataAvailable')"
                    >
                      <template v-slot:append>
                        <v-icon
                          v-if="!isView && hasFieldError(index, 'description')"
                          color="error"
                          size="small"
                        >
                          mdi-alert-circle
                        </v-icon>
                      </template>
                    </v-combobox>
                  </template>
                  <template v-slot:column_debtAmount="{ entity, index }">
                    <v-text-field
                      :readonly="isView || [2, 3].indexOf(this.status) > -1"
                      class="elevation-0 debt-field px-2"
                      bg-color="transparent"
                      hide-details
                      density="compact"
                      variant="solo"
                      v-model="entity.maskedDebtAmount"
                      v-maska:[maskOptions]
                      @maska="($event) => changeMaskedDebt($event, entity)"
                      style="margin: -10px"
                      :placeholder="
                        index > 0 &&
                        items[index - 1] &&
                        (Number(items[index - 1].debtAmount) > 0 ||
                          Number(items[index - 1].creditAmount) > 0) &&
                        totalCredit > totalDebt
                          ? Math.abs(totalCredit - totalDebt).toLocaleString()
                          : ''
                      "
                      @keydown="(ev) => performRemainAmount(ev, 0, entity)"
                    >
                      <!-- <template v-slot:append>
                        <v-icon
                          v-if="hasFieldError(index, 'amount')"
                          color="error"
                          size="small"
                        >
                          mdi-alert-circle
                        </v-icon>
                      </template> -->
                    </v-text-field>
                  </template>
                  <template v-slot:column_creditAmount="{ entity, index }">
                    <v-text-field
                      :readonly="isView || [2, 3].indexOf(this.status) > -1"
                      class="px-2"
                      bg-color="transparent"
                      hide-details
                      density="compact"
                      variant="solo"
                      v-model="entity.maskedCreditAmount"
                      v-maska:[maskOptions]
                      @maska="($event) => changeMaskedCredit($event, entity)"
                      style="margin: -10px"
                      :placeholder="
                        index > 0 &&
                        items[index - 1] &&
                        (Number(items[index - 1].debtAmount) > 0 ||
                          Number(items[index - 1].creditAmount) > 0) &&
                        totalCredit < totalDebt
                          ? Math.abs(totalDebt - totalCredit).toLocaleString()
                          : ''
                      "
                      @keydown="(ev) => performRemainAmount(ev, 1, entity)"
                    >
                      <!-- <template v-slot:append>
                        <v-icon
                          v-if="hasFieldError(index, 'amount')"
                          color="error"
                          size="small"
                        >
                          mdi-alert-circle
                        </v-icon>
                      </template> -->
                    </v-text-field>
                  </template>
                  <template v-slot:column_operations="{ entity, index }">
                    <v-row class="d-none d-md-flex justify-center" style="width: 70px" no-gutters>
                      <!-- <v-tooltip :text="$t('edit')">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            @click="() => openEditItem(entity)"
                            icon="mdi mdi-square-edit-outline"
                            color="info"
                            variant="text"
                            size="x-small"
                            tabIndex="-1"
                            :disabled="isView"
                          />
                        </template>
                      </v-tooltip> -->
                      <v-tooltip :text="$t('copyRow')">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            @click="() => copyRow(entity)"
                            icon="mdi mdi-content-copy"
                            color="info"
                            variant="text"
                            size="x-small"
                            tabIndex="-1"
                            :disabled="!!isView"
                          />
                        </template>
                      </v-tooltip>
                      <v-tooltip :text="$t('deleteRow')">
                        <template v-slot:activator="{ props }">
                          <v-btn
                            v-bind="props"
                            @click="() => deleteRow(entity, index)"
                            :icon="deleteIcon"
                            color="error"
                            variant="text"
                            size="x-small"
                            :disabled="!!isView"
                            tabIndex="-1"
                          />
                        </template>
                      </v-tooltip>
                    </v-row>
                    <v-row class="d-flex d-md-none justify-center align-center" no-gutters>
                      <v-btn size="x-small" icon="mdi-dots-vertical" variant="text">
                        <v-icon icon="mdi-dots-vertical" variant="text" />
                        <v-menu activator="parent">
                          <v-list density="compact">
                            <!-- <v-list-item
                              density="compact"
                              @click.prevent="() => openEditItem(entity)"
                              :title="$t('edit')"
                            >
                              <template v-slot:prepend>
                                <v-icon icon="mdi mdi-square-edit-outline" color="info" />
                              </template>
                            </v-list-item> -->
                            <v-list-item
                              density="compact"
                              @click.prevent="() => copyRow(entity)"
                              :title="$t('copyRow')"
                            >
                              <template v-slot:prepend>
                                <v-icon icon="mdi mdi-content-copy" color="info" />
                              </template>
                            </v-list-item>
                            <v-list-item
                              density="compact"
                              @click.prevent="() => deleteRow(entity, index)"
                              :title="$t('deleteRow')"
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
                  <template v-slot:fixed_row>
                    <tr>
                      <td colspan="6" class="px-4">
                        <b style="font-size: 12pt">{{ $t('total') }}</b>
                      </td>
                      <td class="text-grey text-center">{{ totalDebt?.toLocaleString() }}</td>
                      <td class="text-grey text-center">{{ totalCredit?.toLocaleString() }}</td>
                      <td class="text-grey text-center">
                        <span :class="totalCredit >= totalDebt ? 'text-info' : 'text-red'">
                          {{
                            (totalCredit > totalDebt
                              ? $t('creditorAbbreviation')
                              : totalCredit < totalDebt
                              ? $t('debtorAbbreviation')
                              : '') +
                            ' ' +
                            Math.abs(totalCredit - totalDebt)?.toLocaleString() +
                            (totalCredit >= totalDebt ? '' : '-')
                          }}
                        </span>
                      </td>
                    </tr>
                  </template>
                </data-table>
                <v-row no-gutters class="my-2" align="center">
                  <template v-if="!attachmentFileDto || attachmentFileDto?.data?.length < 1">
                    <input
                      type="file"
                      ref="attachmentFile"
                      style="display: none"
                      @change="uploadAttachFile"
                    />

                    <v-btn
                      tabindex="-1"
                      variant="outlined"
                      color="primary"
                      @click="$refs.attachmentFile.click()"
                      :disabled="!!isView"
                      ><v-icon>mdi-attachment</v-icon>{{ $t('attachFile') }}</v-btn
                    >
                  </template>
                  <template v-else>
                    <v-btn
                      @click="downloadURL(attachmentFileDto)"
                      color="primary"
                      variant="outlined"
                      prepend-icon="mdi-download"
                      :disabled="!!isView"
                    >
                      {{ attachmentFileDto.displayName }}
                    </v-btn>
                    <!-- <v-btn
                      variant="outlined"
                      color="primary"
                      @click="downloadURL(attachmentFileDto)"
                    >
                      <p>{{ attachmentFileDto.displayName }}<v-icon size="small">mdi-download</v-icon></p>
                    </v-btn> -->
                    <v-btn
                      variant="text"
                      color="error"
                      :disabled="!!isView"
                      @click="deleteAttachFile"
                      size="x-small"
                    >
                      <v-icon size="small">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <!-- <v-btn
                    tabindex="-1"
                    variant="outlined"
                    color="primary"
                    class="mr-1"
                    @click="openRecallVoucherDialog"
                    :disabled="isView"
                    ><v-icon>mdi-file-import-outline</v-icon>{{ $t('voucherRecall') }}</v-btn
                  > -->
                  <v-spacer></v-spacer>
                  <template v-if="!isEdit">
                    <v-btn
                      :prepend-icon="saveIcon"
                      @click="saveDocument()"
                      variant="flat"
                      color="info"
                      light
                      >{{ $t('registerVoucher') }}</v-btn
                    >
                    <v-btn
                      @click="saveDocument(true)"
                      variant="outlined"
                      color="info"
                      class="mr-2"
                      >{{ $t('saveAsDraft') }}</v-btn
                    >
                  </template>
                  <v-btn
                    v-else-if="[2, 3].indexOf(this.status) > -1"
                    to="/accounting/vouchers"
                    variant="flat"
                    color="info"
                    light
                    >{{ $t('vouchersList') }}</v-btn
                  >
                  <!-- <v-btn
                    v-else-if="isView"
                    prepend-icon="mdi mdi-pencil-outline"
                    :to="`/accounting/registerVoucher/edit/${id}`"
                    variant="flat"
                    color="info"
                    light
                    :disabled="isView"
                    >{{ $t('edit') }}</v-btn
                  > -->
                  <template v-else>
                    <v-btn
                      :prepend-icon="saveIcon"
                      @click="saveDocument(totalCredit === totalDebt ? false : true)"
                      variant="flat"
                      color="info"
                      light
                      :disabled="!!isView"
                      >{{ $t('save') }}</v-btn
                    >
                    <v-btn
                      @click="saveDocument(true)"
                      variant="outlined"
                      color="info"
                      class="mr-2"
                      :disabled="!!isView"
                      >{{ $t('saveAsDraft') }}</v-btn
                    >
                  </template>
                </v-row>
              </v-col>
            </v-row>
          </div>
          <!-- <div class="px-0 pishro-left-item ps-md-3" v-if="!expanded">
            <v-row class="pishro-border pa-2" no-gutters>
              <v-col
                :class="[
                  'pa-6 rounded-lg',
                  totalCredit == totalDebt ? 'bg-lightBlue' : 'bg-red-lighten-5'
                ]"
                cols="12"
              >
                <v-row
                  :class="[
                    'justify-space-between',
                    totalCredit == totalDebt ? 'text-info' : 'text-red'
                  ]"
                >
                  <p style="font-weight: bold; font-size: 17px">{{ $t('accountBalance') }}</p>
                  <p style="font-weight: bold; font-size: 17px">
                    {{
                      (totalCredit > totalDebt
                        ? $t('creditorAbbreviation')
                        : totalCredit < totalDebt
                        ? $t('debtorAbbreviation')
                        : '') +
                      ' ' +
                      Math.abs(totalCredit - totalDebt).toLocaleString()
                    }}
                  </p>
                </v-row>
              </v-col>
              <v-col class="pa-6" cols="12">
                <v-row class="justify-space-between">
                  <p>{{ $t('debtor') }}</p>
                  <p>{{ totalDebt.toLocaleString() }}</p>
                </v-row>
              </v-col>
              <v-col class="pa-6" cols="12">
                <v-row class="justify-space-between">
                  <p>{{ $t('creditor') }}</p>
                  <p>{{ totalCredit.toLocaleString() }}</p>
                </v-row>
              </v-col>
            </v-row>
          </div> -->
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import voucherService from '../../../../api/voucher/voucherService'
import accountService from '../../../../api/account/accountService'
import ReportService from '../../../../api/reports/reportService'
import detailedAccountService from '../../../../api/detailedAccount/detailedAccountService'
import settingService from '../../../../api/setting/settingService'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import saveIcon from '../../../components/icons/Save.vue'
import savePlusIcon from '../../../components/icons/SavePlus.vue'
import deleteIcon from '../../../components/icons/Delete.vue'
import newDocumentIcon from '../../../components/icons/AccountingRegisterDocument.vue'
import insertRowIcon from '../../../components/icons/InsertRow.vue'
import registerDocumentIcon from '../../../components/icons/AccountingRegisterDocument.vue'
import folderIcon from '../../../components/icons/Folder.vue'
import openedFolderIcon from '../../../components/icons/Folder-Opened.vue'
import folderStarIcon from '../../../components/icons/Folder-Star.vue'
import paperIcon from '../../../components/icons/Paper.vue'
import treeViewIcon from '../../../components/icons/AccountingTreeView.vue'
import documentPaperIcon from '../../../components/icons/DocumentPaper.vue'
import dataTable from '../../../components/baseComponents/datatable/datatable.vue'
import { markRaw } from 'vue'
import customForm from '../../../components/baseComponents/customForm.vue'
import treeView from '../../../components/baseComponents/Treeview/treeview.vue'
import info from '../../../components/baseComponents/info.vue'
import reportOutput from '../../../components/baseComponents/reportOutput.vue'
import switchButton from '../../../components/baseComponents/switchButton.vue'
import { vMaska } from 'maska'
import utils from '../../../../plugins/utils'

export default {
  directives: { maska: vMaska },
  data() {
    return {
      shouldLeave: false,
      hasChange: false,
      maskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, ''),
        postProcess: (val) => {
          if (!val) return ''
          return Number.parseInt(val).toLocaleString()
        }
      },
      isAutomate: true,
      status: null,
      isEdit: false,
      isView: false,
      id: null,
      showTopDescsDialog: false,
      isVoucherItemDesSearch: false,
      showInfo: false,
      date: new Date().toISOString().split('T')[0],
      documentDesc: null,
      attachmentFileDto: {
        name: '',
        displayName: '',
        extension: '',
        data: ''
      },
      fieldErrors: [],
      searchAccountText: '',
      searchDescText: '',
      searchQuery: '',
      filteredAccounts: [],
      filteredDetailedAccounts: [],
      allAccounts: [],
      expanded: false,
      selectAccountDialog: false,
      isDetailedSelect: false,
      deletedItems: [],
      editItemDialog: false,
      editItem: {},
      items: [],
      descItems: [],
      itemDescItems: [],
      allDescriptions: [],
      allItemDescriptions: [],
      isLoading: false,
      isLoadingDescs: false,
      detailedAccountBalances: {},
      treeViewAccountsShowList: [],
      selectedAccount: null,
      selectedRow: null,
      documentNumber: null,
      savedDocumentNumber: null,
      accoutingSettings: [],
      recallVoucherDialog: false,
      recallVoucherStep: 0,
      selectedRecallVoucher: {},
      recallVoucherItems: [],
      newDocumentIcon: markRaw(newDocumentIcon),
      insertRowIcon: markRaw(insertRowIcon),
      deleteIcon: markRaw(deleteIcon),
      saveIcon: markRaw(saveIcon),
      savePlusIcon: markRaw(savePlusIcon),
      registerDocumentIcon: markRaw(registerDocumentIcon),
      folderIcon: markRaw(folderIcon),
      folderStarIcon: markRaw(folderStarIcon),
      paperIcon: markRaw(paperIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      treeViewIcon: markRaw(treeViewIcon),
      documentPaperIcon: markRaw(documentPaperIcon),
      recallVouchersDatatableHeader: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'index',
          width: '50px'
        },
        {
          title: this.$t('date'),
          align: 'center',
          sortable: true,
          key: 'date',
          width: '50px'
        },
        {
          title: this.$t('voucherNumber'),
          align: 'center',
          sortable: true,
          key: 'code',
          width: '50px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'description',
          width: '50px'
        }
      ],
      datatableHeader: [
        {
          title: '#',
          align: 'center',
          sortable: true,
          key: 'index',
          width: '30px'
        },
        {
          title: this.$t('code'),
          align: 'center',
          sortable: true,
          key: 'accountCode',
          width: '70px'
        },
        {
          title: this.$t('accountName'),
          align: 'start',
          sortable: true,
          key: 'accountName',
          width: '220px'
        },
        {
          title: this.$t('detailed'),
          align: 'start',
          sortable: true,
          key: 'detailedName',
          width: '200px'
        },
        {
          title: this.$t('operationDesc'),
          align: 'center',
          sortable: true,
          key: 'description',
          width: '200px'
        },
        {
          title: this.$t('debtor'),
          align: 'center',
          sortable: true,
          key: 'debtAmount',
          width: '100px'
        },
        {
          title: this.$t('creditor'),
          align: 'center',
          sortable: true,
          key: 'creditAmount',
          width: '100px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: false,
          key: 'operations',
          width: '0',
          fixed: true
        }
      ]
    }
  },
  computed: {
    ...mapState(defaultStore, ['tabs']),
    totalCredit() {
      let total = 0
      this.items.forEach((element) => {
        total += parseInt(element?.creditAmount ? element.creditAmount : '0')
      })
      return total
    },
    totalDebt() {
      let total = 0
      this.items.forEach((element) => {
        total += parseInt(element?.debtAmount ? element.debtAmount : '0')
      })
      return total
    },
    filteredAccountss() {
      const searchText = this.searchQuery?.toLowerCase() || ''

      const filteredItems = this.allAccounts.filter((account) => {
        const code = account.code?.toString()?.toLowerCase()
        const name = account.name.toLowerCase()
        const hierarchyCode = account.hierarchyCode.toLowerCase()
        const hierarchyName = account.hierarchyName.toLowerCase()

        return (
          code.includes(searchText) ||
          name.includes(searchText) ||
          hierarchyCode.includes(searchText) ||
          hierarchyName.includes(searchText)
        )
      })

      return filteredItems
    },
    isVoucherDescRequired() {
      return this.accoutingSettings.find((a) => a.key === 'VoucherDescRequired')?.value === '1'
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      setPageTitle: 'setPageTitle',
      setSkipLoading: 'setSkipLoading',
      closeTab: 'closeTab',
      refreshTabByName: 'refreshTabByName',
      closeAndRefreshTab: 'closeAndRefreshTab'
    }),

    async recall(type) {
      if (type === 0) {
        this.recallVoucherStep++
        await this.getRecallVouchers()
      }
    },
    async selectRecallVoucher() {
      // console.log(this.selectedRecallVoucher)
      this.recallVoucherDialog = false
      this.recallVoucherStep = 0
      await this.getById(this.selectedRecallVoucher.id)
      this.documentNumber = ''
    },
    openRecallVoucherDialog() {
      this.recallVoucherDialog = true
      this.recallVoucherStep = 0
    },
    fillDescfromLastItem(entity, index) {
      let lastItem = this.items[index - 1]
      if (lastItem) {
        this.items[index].description = lastItem.description
      }
    },
    performRemainAmount(ev, type, entity) {
      if (ev.key === '+')
        if (type === 0) {
          entity.debtAmount = Math.abs(this.totalCredit - this.totalDebt)
          entity.creditAmount = 0
          entity.maskedDebtAmount = entity.debtAmount?.toLocaleString()
        } else {
          entity.creditAmount = Math.abs(this.totalCredit - this.totalDebt)
          entity.debtAmount = 0
          entity.maskedCreditAmount = entity.creditAmount?.toLocaleString()
        }
    },
    // shouldShowDebtPlaceholder(currentIndex) {
    //   return currentIndex > 0 &&
    //         this.items[currentIndex - 1] &&
    //         Number(this.items[currentIndex - 1].debtAmount || 0) > 0;
    // },

    // shouldShowCreditPlaceholder(currentIndex) {
    //   return currentIndex > 0 &&
    //         this.items[currentIndex - 1] &&
    //         Number(this.items[currentIndex - 1].creditAmount || 0) > 0;
    // },
    deleteAttachFile() {
      if (this.attachmentFileDto?.id) {
        this.attachmentFileDto = {
          ...this.attachmentFileDto,
          action: 3
        }
      } else {
        this.attachmentFileDto = null
      }
    },
    downloadURL(attachmentFileDto) {
      console.log(attachmentFileDto)
      if (!attachmentFileDto?.data) {
        this.setErrorMessage(this.$t('noFileToDownload'))
        return
      }

      const mimeTypes = {
        pdf: 'application/pdf',
        png: 'image/png',
        jpg: 'image/jpeg',
        jpeg: 'image/jpeg',
        gif: 'image/gif',
        xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        xls: 'application/vnd.ms-excel',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        doc: 'application/msword',
        txt: 'text/plain'
      }
      const mimeType =
        mimeTypes[attachmentFileDto.extension.toLowerCase()] || 'application/octet-stream'
      // const base64WithHeader = `data:${mimeType};base64,${attachmentFileDto.data}`;
      const byteCharacters = atob(attachmentFileDto.data)
      const byteArray = new Uint8Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArray[i] = byteCharacters.charCodeAt(i)
      }
      const blob = new Blob([byteArray], { type: mimeType })

      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = attachmentFileDto.displayName || attachmentFileDto.name || 'download'

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(link.href)
    },
    selectDesc(item) {
      if (this.isVoucherItemDesSearch) {
        if (this.editItemDialog) this.editItem.description = item
        else this.selectedRow.description = item
      } else this.documentDesc = item
      this.showTopDescsDialog = false
    },
    setActiveAccount(item) {
      this.selectedAccount = item
    },
    saveSelectAccount() {
      console.log(this.selectedAccount)
      if (!this.selectedAccount) this.setErrorMessage(this.$t('noAccountSelected'))
      else if (this.isDetailedSelect) {
        if (this.selectedAccount.children.length === 0) {
          if (this.editItemDialog) {
            this.editItem.detailedCode = this.selectedAccount.code
            this.editItem.detailedName = this.selectedAccount.hierarchicalName
            this.editItem.detailedId = this.selectedAccount.id
          } else {
            this.selectedRow.detailedCode = this.selectedAccount.code
            this.selectedRow.detailedName = this.selectedAccount.hierarchicalName
            this.selectedRow.detailedId = this.selectedAccount.id
          }
          this.selectAccountDialog = false
        } else this.setErrorMessage(this.$t('accountWithChildrenNotSelectable'))
        // if (this.selectedAccount?.maximumChildCodeLength == 0) {
        //   if (this.editItemDialog) {
        //     this.editItem.detailedCode = this.selectedAccount.hierarchicalCode
        //     this.editItem.detailedName = this.selectedAccount.hierarchicalName
        //     this.editItem.detailedId = this.selectedAccount.id
        //   } else {
        //     this.selectedRow.detailedCode = this.selectedAccount.hierarchicalCode
        //     this.selectedRow.detailedName = this.selectedAccount.hierarchicalName
        //     this.selectedRow.detailedId = this.selectedAccount.id
        //   }
        //   this.selectAccountDialog = false
        // } else this.setErrorMessage(this.$t('accountWithChildrenNotSelectable'))
      } else if (!this.selectedAccount.children || this.selectedAccount.children.length === 0) {
        if (this.editItemDialog) {
          this.editItem.accountCode = this.selectedAccount.hierarchicalCode
          this.editItem.accountName = this.selectedAccount.hierarchicalName
          this.editItem.accountId = this.selectedAccount.id
          this.editItem.detailedCode = null
          this.editItem.detailedName = null
          this.editItem.detailedId = null
        } else {
          this.selectedRow.accountCode = this.selectedAccount.hierarchicalCode
          this.selectedRow.accountName = this.selectedAccount.hierarchicalName
          this.selectedRow.accountId = this.selectedAccount.id
          this.selectedRow.detailedCode = null
          this.selectedRow.detailedName = null
          this.selectedRow.detailedId = null
        }
        this.selectAccountDialog = false
      } else this.setErrorMessage(this.$t('selectedAccountIsNotOperational'))
    },
    arrangeItems(list, isDetailed) {
      list.forEach((item) => {
        if (this.isDetailedSelect) item.isOperational = true
        item.title = item.name + ' ' + item.hierarchicalCode
        item.draggable = false
        if (isDetailed) item.icon = item?.maximumChildCodeLength > 0 ? folderIcon : paperIcon
        else item.icon = folderStarIcon
        item.openedIcon = item.isOperational ? null : openedFolderIcon
        item.open = this.searchAccountText ? true : false
        item.dblClick = () => this.saveSelectAccount()
        if (item?.children?.length > 0) item.children = this.arrangeItems(item.children, isDetailed)
      })
      return list
    },
    changeMaskedDebt(value, model) {
      let amount = value.detail.unmasked
      if (amount > 0 || (amount == 0 && !model.creditAmount)) {
        model.creditAmount = 0
        model.maskedCreditAmount = 0
      }
      model.debtAmount = amount
    },
    changeMaskedCredit(value, model) {
      let amount = value.detail.unmasked
      if (amount > 0 || (amount == 0 && !model.debtAmount)) {
        model.debtAmount = 0
        model.maskedDebtAmount = 0
      }
      model.creditAmount = amount
    },

    async getBulkDetailedAccountBalances(hierarchicalCodes) {
      if (!hierarchicalCodes?.length) return {}

      const uniqueCodes = [...new Set(hierarchicalCodes)]
      const codesString = uniqueCodes.join(',')

      const res = await ReportService.execute({
        schema: 'dbo',
        procedureName: 'Accounting_GetAccountsRemainAmountReport',
        parameters: {
          '@HierarchicalCodes': codesString
        }
      })
      if (res.isSuccess && res.value[0]?.length > 0) {
        return res.value[0].reduce((acc, item) => {
          acc[item.HierarchicalCode] = item.RemainAmount || 0
          return acc
        }, {})
      }
      return {}
    },

    async getDetailedAccountBalance(hierarchicalCode) {
      const params = {
        '@HierarchicalCodes': hierarchicalCode
      }

      try {
        const res = await ReportService.execute({
          schema: 'dbo',
          procedureName: 'Accounting_GetAccountsRemainAmountReport',
          parameters: params
        })

        if (res.isSuccess && res.value?.result?.length > 0) {
          return res.value.result[0].RemainAmount || 0
        }
        return 0
      } catch (error) {
        return 0
      }
    },

    formatNumber(number) {
      if (number === undefined || number === null) return ''

      const isNegative = number < 0
      const absoluteNumber = Math.abs(number)
      const formattedNumber = absoluteNumber.toLocaleString()

      return isNegative ? `(${formattedNumber})` : formattedNumber
    },

    async updateDetailedAccount(value, entity, index) {
      if (this.isView) return

      const selectedAccount = entity.filteredDetailedAccounts.find((acc) => acc.name === value)
      if (selectedAccount) {
        entity.detailedId = selectedAccount.id
        entity.detailedName = selectedAccount.name
        entity.detailedCode = selectedAccount.code
        entity.detailedFullName = selectedAccount.hierarchicalName
        this.clearFieldError(index, 'detailedName')

        // const balance = await this.getDetailedAccountBalance(selectedAccount.hierarchicalCode)
        // this.detailedAccountBalances[selectedAccount.hierarchicalCode] = balance

        if (!this.isEdit || (this.isEdit && !this.isLoading)) {
          const balance = await this.getDetailedAccountBalance(selectedAccount.hierarchicalCode)
          this.detailedAccountBalances[selectedAccount.hierarchicalCode] = balance
        }
      }
    },

    onDetailedSearch(searchText, entity) {
      if (this.isView) return

      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout)
      }

      this.searchTimeout = setTimeout(() => {
        if (!entity.accountId) {
          this.setErrorMessage(this.$t('noAccountSelected'))
          return
        }

        if (!searchText) {
          this.filteredDetailedAccounts = []
          return
        }
        accountService.getById(entity.accountId).then((res) => {
          if (res.isSuccess) {
            this.filteredDetailedAccounts = res.value.dependencies.filter(
              (dep) =>
                dep.name.toLowerCase().includes(searchText.toLowerCase()) ||
                dep.hierarchicalCode.toLowerCase().includes(searchText.toLowerCase())
            )
          } else {
            this.setErrorMessage(res.errors[0].message)
          }
        })
      }, 500)
    },

    updateDescription(value, entity, index) {
      if (this.isView) return
      entity.description = value
      if (value) {
        this.clearFieldError(index, 'description')
      }
    },

    openEditItem(item) {
      if (this.isView) return
      this.editItemDialog = true
      this.editItem = { ...item }
    },
    saveEditItem() {
      let selectedItem = this.items.filter((a) => a.index == this.editItem.index)[0]
      Object.assign(selectedItem, this.editItem)
      this.editItemDialog = false
    },
    addRow() {
      this.items.push({})
      this.items.forEach((element, index) => {
        element.index = index + 1
      })
      this.selectedRow = this.items[this.items.length - 1]
    },
    copyRow(item) {
      if (this.isView) return

      const copiedItem = {
        ...item,
        action: 1
      }
      console.log(copiedItem)
      this.items.push(copiedItem)
      this.items.forEach((element, index) => {
        element.index = index + 1
      })

      this.selectedRow = copiedItem

      setTimeout(() => {
        const codeRef = this.$refs[`code_${this.items.length - 1}`]
        if (codeRef) codeRef.focus()
      }, 100)
    },
    deleteRow(item, rowIndex) {
      if (this.isView) return
      console.log('Deleting item:', item)

      if (this.items.length <= 1) {
        this.setErrorMessage(this.$t('atLeastOneRowRequired'), 'warning')
        return
      }

      if (item.accountId) {
        this.setWarningDialog(true, this.$t('deleteRow'), this.$t('confirmDeleteRowData'), () => {
          if (item.id) {
            const deletedItem = {
              ...item,
              action: 3
            }
            this.deletedItems.push(deletedItem)
          }

          this.items.splice(rowIndex, 1)
          this.items.forEach((element, idx) => {
            element.index = idx + 1
          })

          this.selectedRow = null
          this.closeWarning()
        })
      } else {
        if (item.id) {
          const deletedItem = {
            ...item,
            action: 3
          }
          console.log('Adding to deletedItems:', deletedItem)
          this.deletedItems.push(deletedItem)
        }

        this.items.splice(rowIndex, 1)
        this.items.forEach((element, idx) => {
          element.index = idx + 1
        })

        this.selectedRow = null
      }
    },
    onkeydown(e) {
      if (this.editItemDialog && e.keyCode == 27) {
        if (this.selectAccountDialog) this.selectAccountDialog = false
        else if (this.showTopDescsDialog) this.showTopDescsDialog = false
        else this.editItemDialog = false
      }
      if (this.selectAccountDialog && e.keyCode == 27) this.selectAccountDialog = false
      if (this.showTopDescsDialog && e.keyCode == 27) this.showTopDescsDialog = false
    },
    reverseItems() {
      this.items.forEach((item) => {
        if (item.debtAmount && parseFloat(item.debtAmount)) {
          if (item.debtAmount) {
            item.creditAmount = parseFloat(item.debtAmount)
            item.debtAmount = ''
            item.maskedCreditAmount = item.creditAmount.toLocaleString()
          }
        } else {
          if (item.creditAmount) {
            item.debtAmount = parseFloat(item.creditAmount)
            item.creditAmount = ''
            item.maskedDebtAmount = item.debtAmount.toLocaleString()
          }
        }
      })
    },
    async getRecallVouchers() {
      let lst = await voucherService.getAll()
      this.recallVoucherItems = [...lst.entities].map((x, idx) => {
        return {
          ...x,
          index: idx + 1,
          date: utils.showDate(x.date)
        }
      })
      // this.documents.map((a, index) => ({
      //   id: a.id,
      //   showingIndex: index + 1,
      //   date: utils.showDate(a.date),
      //   code: a.code,
      //   description: a.description,
      //   status: a.status,
      //   showingStatus: utils.showDocumentStatus(a.status).text,
      //   checkbox: a.checkbox,
      //   statusColor: utils.showDocumentStatus(a.status).color
      // }))
    },
    async uploadAttachFile(ev) {
      if (ev.target.files && ev.target.files.length > 0) {
        let file = ev.target.files[0]
        let fileSize = file.size / 1024

        if (fileSize > 200) {
          this.setErrorMessage(this.$t('maximumFileSize') + ': 200KB')
          return
        }
        const fileData = await utils.toBase64(file)
        const base64Data = fileData.split(',')[1]

        const fileName = file.name
        const fileExtension = fileName.split('.').pop()
        const displayName = fileName.replace(`.${fileExtension}`, '')

        this.attachmentFileDto = {
          name: fileName,
          displayName: displayName,
          data: base64Data,
          extension: fileExtension,
          size: file.size,
          action: 1
        }
      }
    },

    async changeSearchText(value) {
      if (this.isDetailedSelect) await this.searchDetailedAccount(value)
      else this.searchQuery = value
    },
    async changeDescText(value) {
      await this.searchDesc(value)
    },
    async getDetailedAccounts(accountId) {
      if (!accountId) return []
      let res = await accountService.getById(accountId)
      if (res.isSuccess) {
        return res.value.dependencies
      } else {
        this.setErrorMessage(res.errors[0].message)
        return []
      }
    },
    updateAccountCode(value, entity, index) {
      if (this.isView) return

      if (value && typeof value === 'object') {
        entity.accountId = value.id
        entity.accountName = value.hierarchyName
        entity.accountCode = value.hierarchyCode
        entity.accountFullName = value.hierarchyName

        entity.detailedId = null
        entity.detailedName = null
        entity.detailedCode = null
        entity.detailedFullName = null

        this.getDetailedAccounts(value.id).then((res) => {
          entity.filteredDetailedAccounts = res
        })
        return
      }

      const selectedAccount = this.allAccounts.find((acc) => acc.hierarchyCode === value)
      if (selectedAccount) {
        entity.accountId = selectedAccount.id
        entity.accountName = selectedAccount.hierarchyName
        entity.accountCode = selectedAccount.hierarchyCode
        entity.accountFullName = selectedAccount.hierarchicalName

        entity.detailedId = null
        entity.detailedName = null
        entity.detailedCode = null
        entity.detailedFullName = null

        this.getDetailedAccounts(selectedAccount.id).then((res) => {
          entity.filteredDetailedAccounts = res
        })
      }
    },

    updateAccountName(value, entity, index) {
      if (this.isView) return

      if (value && typeof value === 'object') {
        entity.accountId = value.id
        entity.accountName = value.hierarchyName
        entity.accountCode = value.hierarchyCode
        entity.accountFullName = value.hierarchyName

        entity.detailedId = null
        entity.detailedName = null
        entity.detailedCode = null
        entity.detailedFullName = null

        this.getDetailedAccounts(value.id).then((res) => {
          entity.filteredDetailedAccounts = res
        })
        return
      }

      const selectedAccount = this.allAccounts.find((acc) => acc.hierarchyName === value)
      if (selectedAccount) {
        entity.accountId = selectedAccount.id
        entity.accountName = selectedAccount.hierarchyName
        entity.accountCode = selectedAccount.hierarchyCode
        entity.accountFullName = selectedAccount.hierarchicalName

        entity.detailedId = null
        entity.detailedName = null
        entity.detailedCode = null
        entity.detailedFullName = null

        this.getDetailedAccounts(selectedAccount.id).then((res) => {
          entity.filteredDetailedAccounts = res
        })
      }
    },

    hasFieldError(rowIndex, fieldName) {
      return this.fieldErrors.some((error) => error.row === rowIndex && error.field === fieldName)
    },
    clearFieldError(rowIndex, fieldName) {
      this.fieldErrors = this.fieldErrors.filter(
        (error) => !(error.row === rowIndex && error.field === fieldName)
      )
    },

    async showSelectAccountDialog(text) {
      this.isDetailedSelect = false
      this.searchAccountText = text
      this.searchQuery = text
      this.selectAccountDialog = true
    },
    async showSelectDetailedAccountDialog() {
      this.isDetailedSelect = true
      if (this.editItemDialog) {
        if (this.editItem?.accountId) {
          await this.searchDetailedAccount(this.editItem.accountId)
          if (this.treeViewAccountsShowList[0]?.children?.length > 0)
            this.selectAccountDialog = true
          else this.setErrorMessage(this.$t('selectedAccountHasNoDetailed'))
        } else this.setErrorMessage(this.$t('noAccountSelected'))
      } else {
        if (this.selectedRow?.accountId) {
          await this.searchDetailedAccount(this.selectedRow.accountId)
          if (this.treeViewAccountsShowList[0]?.children?.length > 0)
            this.selectAccountDialog = true
          else this.setErrorMessage(this.$t('selectedAccountHasNoDetailed'))
        } else this.setErrorMessage(this.$t('noAccountSelected'))
      }
    },

    clearAccount(entity, isDetailed) {
      if (!isDetailed) {
        entity.accountId = null
        entity.accountName = null
        entity.accountCode = null
        entity.accountFullName = null
        entity.filteredDetailedAccounts = []
      }
      entity.detailedId = null
      entity.detailedName = null
      entity.detailedCode = null
      entity.detailedFullName = null

      if (isDetailed && entity.detailedCode) {
        delete this.detailedAccountBalances[entity.detailedCode]
      }
    },

    showInitialAccounts() {
      if (this.isView) return
      this.filteredAccounts = this.allAccounts.slice(0, 10)
    },

    // async searchAccount(searchText) {
    //   if (this.isView) return;

    //   if (!searchText) {
    //     this.filteredAccounts = this.allAccounts.slice(0, 10);
    //     return;
    //   }
    //   this.filteredAccounts = this.allAccounts.filter(account =>
    //     account.code?.toString()?.toLowerCase().includes(searchText.toLowerCase()) ||
    //     account.name.toLowerCase().includes(searchText.toLowerCase()) ||
    //     account.hierarchyCode.toLowerCase().includes(searchText.toLowerCase()) ||
    //     account.hierarchyName.toLowerCase().includes(searchText.toLowerCase())
    //   )

    // await accountService.search(params).then((res) => {
    //   if (res.isSuccess) {
    //     this.isDetailedSelect = false
    //     let accounts = this.arrangeItems([...res.value], false)
    //     this.treeViewAccountsShowList = [
    //       {
    //         id: null,
    //         active: true,
    //         title: this.$t('accountingTreeView'),
    //         draggable: false,
    //         open: true,
    //         icon: folderIcon,
    //         openedIcon: openedFolderIcon,
    //         children: accounts
    //       }
    //     ]
    //     console.log(this.treeViewAccountsShowList);
    //   } else this.setErrorMessage(res.errors[0].message)
    // })
    // },
    async searchDetailedAccount(searchText) {
      const row = this.editItemDialog ? this.editItem : this.selectedRow
      if (!row.accountId) {
        this.setErrorMessage(this.$t('noAccountSelected'))
        return
      }
      console.log(row)

      await accountService.getById(row.accountId).then((res) => {
        if (res.isSuccess) {
          console.log('searchDetailedAccount', res.value)
          this.isDetailedSelect = true
          this.filteredDetailedAccounts = res.value.dependencies
          // let accounts = this.arrangeItems(res.value.dependenciesHierarchy, true)
          // this.treeViewAccountsShowList = [
          //   {
          //     id: null,
          //     active: true,
          //     title: this.$t('detailedAccountsTreeView'),
          //     draggable: false,
          //     open: true,
          //     icon: folderIcon,
          //     openedIcon: openedFolderIcon,
          //     children: accounts,
          //     maximumChildCodeLength: 1
          //   }
          // ]
          // console.log(this.treeViewAccountsShowList);
        } else this.setErrorMessage(res.errors[0].message)
      })
    },
    async loadAllDescriptions() {
      this.isLoadingDescs = true
      const request = {
        text: '',
        searchType: 2,
        count: 100
      }

      const res = await voucherService.searchDesc(request)
      if (res.isSuccess) {
        this.allDescriptions = [
          ...new Set(
            res.value.map((item) => item.descriptions).filter((desc) => desc && desc.trim() !== '')
          )
        ]

        this.allItemDescriptions = [
          ...new Set(
            res.value
              .flatMap((item) => item.itemDescriptions)
              .filter((desc) => desc && desc.trim() !== '')
          )
        ]

        this.descItems = [...this.allDescriptions]
        this.itemDescItems = [...this.allItemDescriptions]
      } else {
        this.setErrorMessage(res.errors[0].message)
      }
      this.isLoadingDescs = false
    },
    async searchDesc(searchText, isItemDesc = false) {
      if (this.isView) return

      if (!searchText) {
        if (isItemDesc) {
          this.itemDescItems = [...this.allItemDescriptions]
        } else {
          this.descItems = [...this.allDescriptions]
        }
        return
      }
      const searchTextLower = searchText.toLowerCase()

      if (isItemDesc) {
        this.itemDescItems = this.allItemDescriptions.filter((desc) =>
          desc?.toLowerCase().includes(searchTextLower)
        )
      } else {
        this.descItems = this.allDescriptions.filter((desc) =>
          desc?.toLowerCase().includes(searchTextLower)
        )
      }

      // this.descItems = text ? this.allDescriptions.filter(desc =>
      //   desc.toLowerCase().includes(text.toLowerCase())
      // ) : [...this.allDescriptions];

      // if (!text) {
      //   this.descItems = [];
      //   return;
      // }

      // const request = {
      //   text: text || '',
      //   searchInVoucherItems: isVoucherItem || false,
      //   count: count
      // };

      // const res = await voucherService.searchDesc(request);
      // if (res.isSuccess) {
      //   this.descItems = res.value;
      //   console.log('searchDesc', this.descItems);
      // } else {
      //   this.setErrorMessage(res.errors[0].message);
      // }
      // const request = {
      //   text: text || '',
      //   searchInVoucherItems: isVoucherItem || false,
      //   count: count
      // }
      // await voucherService.searchDesc(request).then((res) => {
      //   if (res.isSuccess) this.descItems = res.value
      //   else this.setErrorMessage(res.errors[0].message)
      // })
    },

    getFormattedDateTime() {
      const now = new Date()
      const selectedDate = new Date(this.date)

      if (!this.isView) {
        selectedDate.setHours(now.getHours())
        selectedDate.setMinutes(now.getMinutes() - 1)
        selectedDate.setSeconds(now.getSeconds())
        selectedDate.setMilliseconds(now.getMilliseconds())

        return selectedDate.toISOString()
      }
      return this.date
    },

    async saveDocument(isDraft = false) {
      if (this.isView) return
      this.fieldErrors = []

      const hasAnyAccount = this.items.some((item) => item.accountId)
      const hasDescription = this.documentDesc && this.documentDesc.trim() !== ''

      if (!hasAnyAccount && !hasDescription) {
        const errorMessage = isDraft
          ? this.$t('draftNeedsRowError')
          : this.$t('needDescriptionOrAccount')
        this.setErrorMessage(errorMessage, 'warning')
        return
      }

      const rowsWithoutDetailedAccount = []
      for (const item of this.items) {
        if (item.accountId) {
          const accountResponse = await accountService.getById(item.accountId)
          if (accountResponse.isSuccess && accountResponse.value.dependencies?.length > 0) {
            if (!item.detailedId) {
              rowsWithoutDetailedAccount.push(item)
            }
          }
        }
      }
      // if (rowsWithoutDetailedAccount.length > 0) {
      //   const warningMessage = this.$t('someAccountsNeedDetailedWarning', {
      //     rows: rowsWithoutDetailedAccount.map((item) => item.index).join(', ')
      //   })
      //   this.setErrorMessage(warningMessage, 'warning')
      // }

      if (!isDraft) {
        const validationErrors = []

        this.items.forEach((item, index) => {
          if (item.accountId) {
            if (!item.description) {
              validationErrors.push({
                row: index,
                field: 'description',
                message: this.$t('allRowsNeedDescription')
              })
            }
            if (
              (!item.debtAmount || Number(item.debtAmount) === 0) &&
              (!item.creditAmount || Number(item.creditAmount) === 0)
            ) {
              validationErrors.push({
                row: index,
                field: 'amount',
                message: this.$t('rowAmountCannotBeZero')
              })
            }
          }
        })

        if (validationErrors.length > 0) {
          this.fieldErrors = validationErrors
          this.setErrorMessage(validationErrors[0].message, 'warning')
          return
        }

        const validRows = this.items.filter((item) => item.accountId)
        if (validRows.length < 2) {
          this.setErrorMessage(this.$t('voucherNeedsAtLeastTwoRows'), 'warning')
          return
        }

        if (this.isVoucherDescRequired && !this.documentDesc) {
          this.setErrorMessage(this.$t('voucherDescriptionRequired'), 'warning')
          return
        }

        if (this.totalDebt !== this.totalCredit) {
          this.setErrorMessage(this.$t('voucherMustBeBalanced'), 'warning')
          return
        }
      }

      // if (!isDraft) {
      //   const hasRowWithoutDetailedAccount = this.items.some(item => item.accountId && !item.detailedId);
      //   const hasRowWithoutDescription = this.items.some(item => item.accountId && !item.description);
      //   const hasZeroAmountRow = this.items.some(item =>
      //     (!item.debtAmount || Number(item.debtAmount) === 0) &&
      //     (!item.creditAmount || Number(item.creditAmount) === 0)
      //   );
      //   const validRows = this.items.filter(item => item.accountId);

      //   if (hasRowWithoutDetailedAccount) {
      //     this.setErrorMessage(this.$t('allRowsNeedDetailedAccount'), 'warning');
      //     return;
      //   } else if (this.totalDebt !== this.totalCredit) {
      //     this.setErrorMessage(this.$t('voucherMustBeBalanced'), 'warning');
      //     return;
      //   } else if (hasRowWithoutDescription) {
      //     this.setErrorMessage(this.$t('allRowsNeedDescription'), 'warning');
      //     return;
      //   } else if (hasZeroAmountRow) {
      //     this.setErrorMessage(this.$t('rowAmountCannotBeZero'), 'warning');
      //     return;
      //   } else if (validRows.length < 2) {
      //     this.setErrorMessage(this.$t('voucherNeedsAtLeastTwoRows'), 'warning');
      //     return;
      //   }
      // }

      let request = {}
      if (!this.isEdit) {
        request = {
          description: this.documentDesc,
          code: this.documentNumber?.toString() || null,
          attachmentFile: this.attachmentFileDto || null,
          date: this.getFormattedDateTime(),
          status: isDraft ? 0 : 1,
          isOperational: isDraft ? false : true,
          items: this.items
            .filter((item) => item && item.accountId)
            .map((item) => {
              let accounts = [
                {
                  id: item.accountId,
                  name: item.accountName,
                  code: item.accountCode.toString(),
                  order: 0,
                  type: 0
                }
              ]
              if (item?.detailedId)
                accounts.push({
                  id: item.detailedId,
                  name: item.detailedName,
                  code: item.detailedCode.toString(),
                  order: 1,
                  type: 3
                })
              return {
                id: item.id || null,
                description: item.description,
                debtAmount: Number(item.debtAmount || 0),
                creditAmount: Number(item.creditAmount || 0),
                action: item.action || 1,
                accounts: accounts
                // account: {
                //   accountId: item.accountId,
                //   accountName: item.accountName,
                //   accountCode: item.accountCode.toString()
                // },
                // firstDetailedAccount: item.detailedId
                //   ? {
                //       accountId: item.detailedId,
                //       accountName: item.detailedName,
                //       accountCode: item.detailedCode.toString()
                //     }
                //   : null
              }
            })
        }
      } else {
        request = {
          id: this.id,
          code: this.documentNumber?.toString() || null,
          description: this.documentDesc,
          date: this.getFormattedDateTime(),
          attachmentFile: this.attachmentFileDto || null,
          status: !isDraft && this.totalDebt === this.totalCredit ? 1 : 0,
          isOperational: !isDraft && this.totalDebt === this.totalCredit,
          items: [
            ...this.items
              .filter((item) => item && item.accountId)
              .map((item) => {
                let accounts = [
                  {
                    id: item.accountId,
                    name: item.accountName,
                    code: item.accountCode.toString(),
                    order: 0,
                    type: 0
                  }
                ]
                if (item?.detailedId)
                  accounts.push({
                    id: item.detailedId,
                    name: item.detailedName,
                    code: item.detailedCode.toString(),
                    order: 1,
                    type: 3
                  })

                return {
                  id: item.id,
                  description: item.description,
                  debtAmount: Number(item.debtAmount || 0),
                  creditAmount: Number(item.creditAmount || 0),
                  action: item.id ? 2 : 1,
                  accounts: accounts
                }
              }),
            ...this.deletedItems
          ]
        }
      }
      console.log(request)

      if (rowsWithoutDetailedAccount.length > 0) {
        return new Promise((resolve) => {
          // const warningMessage = this.$t('someAccountsNeedDetailedWarning', {
          //   rows: rowsWithoutDetailedAccount.map((item) => item.index).join(', ')
          // });

          this.setWarningDialog(
            true,
            this.$t('registerVoucher'),
            this.$t('someAccountsNeedDetailedWarning'),
            async () => {
              this.closeWarning()
              !this.isEdit ? await this.createVoucher(request) : await this.editVoucher(request)
              resolve(true)
            },
            () => {
              this.closeWarning()
              resolve(false)
            }
          )
        })
      }

      !this.isEdit ? await this.createVoucher(request) : await this.editVoucher(request)
    },
    async createVoucher(request) {
      await voucherService.create(request).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('createVoucherSuccessMessage'), 'success')
          this.hasChange = false
          this.closeAndRefreshTab()

          // const currentTabIndex = this.tabs.findIndex(
          //   (tab) => tab.name === 'registerAccountingVoucher' && tab.isActive
          // )
          // if (currentTabIndex !== -1) {
          //   this.closeTab(currentTabIndex)
          // }

          // const vouchersTabExists = this.refreshTabByName('vouchersList');
          // if (!vouchersTabExists) {
          //   this.$router.push('/accounting/vouchers')
          // }
        } else {
          this.setErrorMessage(res.errors[0].message)
          if (res.errors?.length > 0) {
            var errorMessage = ''
            res.errors.forEach((error) => {
              errorMessage += error + '\n'
            })
            this.setErrorMessage(errorMessage.slice(0, -1))
          }
          this.showInfo = false
        }
      })
    },
    async editVoucher(request) {
      await voucherService.update(request).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('editVoucherSuccessMessage'), 'success')
          this.hasChange = false

          const currentTabIndex = this.tabs.findIndex(
            (tab) => tab.name === 'editAccountingVoucher' && tab.isActive
          )
          if (currentTabIndex !== -1) {
            this.closeTab(currentTabIndex)
          }

          const vouchersTabExists = this.refreshTabByName('vouchersList');
          if (!vouchersTabExists) {
            this.$router.push('/accounting/vouchers')
          }
        } else {
          this.setErrorMessage(res.errors[0].message)
          if (res.errors?.length > 0) {
            var errorMessage = ''
            res.errors.forEach((error) => {
              errorMessage += error + '\n'
            })
            this.setErrorMessage(errorMessage.slice(0, -1))
          }
        }
      })
    },
    async getAccountSetting() {
      const params = {
        page: 1,
        size: 100,
        settingModule: 0
      }
      await settingService.getSetting(params).then((resp) => {
        console.log(resp)
        this.accoutingSettings = resp.value.result
      })
    },
    async getById(id) {
      const res = await voucherService.getById(id)
      if (res.isSuccess) {
        this.date = res.value.date.split('T')[0]
        this.documentDesc = res.value.description
        this.documentNumber = res.value.code
        this.savedDocumentNumber = res.value.code
        this.attachmentFileDto = res.value.attachmentFile || null
        this.status = Number.parseInt(res.value.status)
        // if (res.value.attachmentFile) {
        // this.attachFile = this.baseUrl + res.value.attachmentFile.path;
        // this.attachFileName = res.value.attachmentFile.displayName + res.value.attachmentFile.extension;
        // }
        // if ([2, 3].indexOf(Number.parseInt(res.value.status)) > -1)
        //   this.datatableHeader = this.datatableHeader.filter((a) => a.key != 'operations')

        const detailedCodes = res.value.items
          .map((item) => item.accounts?.find((a) => a.order === 1)?.code)
          .filter((code) => code)

        if (detailedCodes.length > 0) {
          this.detailedAccountBalances = await this.getBulkDetailedAccountBalances(detailedCodes)
        }

        this.items = []
        for (let index = 0; index < res.value.items.length; index++) {
          const a = res.value.items[index]
          const account = a.accounts?.find((a) => a.order === 0)
          const firstDetailedAccount = a.accounts?.find((a) => a.order === 1)

          const newItem = {
            index: index + 1,
            id: a.id,
            accountId: account?.id,
            detailedId: firstDetailedAccount?.id,
            description: a.description || null,
            debtAmount: Number(a.debtAmount || 0),
            maskedDebtAmount: a.debtAmount?.toLocaleString() || 0,
            creditAmount: Number(a.creditAmount || 0),
            maskedCreditAmount: a.creditAmount?.toLocaleString() || 0,
            accountName: account.name,
            accountFullName: account.hierarchicalName,
            accountCode: account.code,
            detailedName: firstDetailedAccount?.name,
            detailedFullName: firstDetailedAccount?.hierarchicalName,
            detailedCode: firstDetailedAccount?.code
          }
          // if (firstDetailedAccount?.code) {
          //   const balance = await this.getDetailedAccountBalance(firstDetailedAccount.code)
          //   this.detailedAccountBalances[firstDetailedAccount.code] = balance
          // }
          this.items.push(newItem)
        }
        // this.items = res.value.items.map((a, index) => {
        //   return {
        //     index: index + 1,
        //     id: a.id,
        //     accountId: a.account?.accountId,
        //     detailedId: a.firstDetailedAccount?.accountId,
        //     description: a.description || null,
        //     debtAmount: Number(a.debtAmount || 0),
        //     maskedDebtAmount: a.debtAmount?.toLocaleString() || 0,
        //     creditAmount: Number(a.creditAmount || 0),
        //     maskedCreditAmount: a.creditAmount?.toLocaleString() || 0,
        //     accountName: a.account.accountName,
        //     accountFullName: a.account.hierarchicalName,
        //     accountCode: a.account.accountCode,
        //     detailedName: a.firstDetailedAccount?.accountName,
        //     detailedFullName: a.firstDetailedAccount?.hierarchicalName,
        //     detailedCode: a.firstDetailedAccount?.accountCode
        //   }
        // })
      } else this.setErrorMessage(res.errors[0].message)
    },
    async loadAllAccounts() {
      const generalAccountLevel =
        parseInt(
          this.accoutingSettings.find((a) => a.key === 'default_level_of_general_accounts')?.value
        ) || 1

      let apiAccounts = []
      let currentPage = 1
      let hasMoreData = true
      const pageSize = 500

      while (hasMoreData) {
        const response = await accountService.advancedSearch({
          accountType: 0,
          accountFamily: null,
          page: currentPage,
          size: pageSize,
          text: ''
        })

        if (!response.isSuccess) {
          this.setErrorMessage(response.errors[0].message)
          break
        }
        // apiAccounts = [
        //   ...apiAccounts,
        //   ...response.value.result?.map((a) => ({
        //     ...a,
        //     fullName: `${a.name} (${a.hierarchyCode})`
        //   }))
        // ]
        apiAccounts = [...apiAccounts, ...response.value.result]

        hasMoreData = currentPage * pageSize < response.value.totalCount
        currentPage++
      }
      this.allAccounts = apiAccounts
        .filter((account) => account.level > generalAccountLevel)
        .map((a) => ({
          ...a,
          fullName: `${a.name} (${a.hierarchyCode})`
        }))
      // this.allAccounts = apiAccounts
    }
  },
  watch: {
    isAutomate(value) {
      if (value) this.documentNumber = null
    }
  },
  async beforeMount() {
    this.setSkipLoading(true)

    await this.getAccountSetting()
    await this.loadAllAccounts()
    await this.loadAllDescriptions()

    this.setSkipLoading(false)
  },
  async mounted() {
    this.isLoading = true
    ;(await this.$refs['datePicker']).focus()
    document.addEventListener('keydown', this.onkeydown)
    await this.changeDescText('')

    let type = this.currentActiveTab.params.isEdit
    let title =
      type == 'create'
        ? 'registerAccountingVoucher'
        : type == 'edit'
        ? 'editAccountingVoucher'
        : 'viewAccountingVoucher'

    document.title = this.$t(title)
    this.setPageTitle(title)

    this.isEdit = type !== 'create'
    this.isView = type !== 'edit' && type !== 'create'

    const id = this.$route.params.id || this.currentActiveTab?.params?.id
    this.id = id === 'new' ? '0' : id

    // this.id = this.currentActiveTab.params.id == 'new' ? '0' : this.currentActiveTab.params.id;
    // console.log(this.$route, this.currentActiveTab, this.isEdit, this.isView);
    if (!this.isEdit && !this.isView) {
      this.items.push({ index: 1 }, { index: 2 })
      this.selectedRow = this.items[0]
    } else if (this.id && this.id !== '0') {
      await this.getById(this.id)
    }
    this.isLoading = false
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  beforeRouteLeave(to, from) {
    if (this.hasChange) {
      if (!this.shouldLeave)
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.shouldLeave = true
          this.$router.push(to.href)
        })
      return this.shouldLeave
    }
  },
  components: {
    dataTable,
    customForm,
    treeView,
    info,
    reportOutput,
    switchButton
  }
}
</script>

<style>
.accounts-table .v-field__input {
  min-height: 32px !important;
  max-height: 32px !important;
  padding: 0 8px !important;
  font-size: 9pt !important;
  display: flex !important;
  align-items: center !important;
}

.accounts-table .v-field--variant-solo,
.v-field--variant-solo-filled {
  box-shadow: none !important;
}

.accounts-table .v-field__input {
  font-size: 9pt !important;
  padding: 0 8px !important;
}

.accounts-table .v-field {
  padding: 0 !important;
  margin: 0 !important;
  min-height: 32px !important;
  max-height: 32px !important;
  overflow: visible !important;
}

.accounts-table .v-table {
  table-layout: fixed;
}

.accounts-table .v-autocomplete .v-field__append-inner {
  display: none !important;
}

.register-top-row .vpd-input-group input {
  width: 131px;
}

.doc-desc {
  max-width: 500px;
}

.pishro-right-item {
  width: 75%;
  transition: 0.3s ease;
}

.pishro-right-item-expanded {
  width: 100%;
}

.pishro-left-item {
  width: 25%;
  max-width: 25%;
  animation: plitemaction 0.3s ease;
  transition: ease 0.3s;
}

@keyframes plitemaction {
  from {
    width: 0%;
  }

  to {
    width: 25%;
  }
}

@media only screen and (max-width: 600px) {
  .register-top-row .vpd-main {
    flex-grow: 1;
  }
}

@media only screen and (max-width: 960px) {
  .doc-desc {
    min-width: 199px;
  }

  .register-top-row .vpd-input-group input {
    width: unset;
  }

  .pishro-right-item {
    width: 100%;
    transition: 0.3s ease;
  }

  .pishro-left-item {
    margin-top: 10px;
    min-width: 100%;
    animation: plitemaction 0.3s ease;
    transition: ease 0.3s;
    overflow: hidden;
  }

  @keyframes plitemaction {
    from {
      height: 0px;
    }

    to {
      height: 162px;
    }
  }
}

.accounts-table .v-autocomplete--readonly .v-field__input {
  cursor: default !important;
  color: rgba(var(--v-theme-on-surface), 0.7) !important;
}

.accounts-table .v-autocomplete--readonly .v-field {
  opacity: 0.7;
  background-color: rgb(var(--v-theme-surface-variant)) !important;
}

.accounts-table .v-autocomplete.description-field .v-field__input {
  font-size: 9pt !important;
  padding: 0 8px !important;
}

.accounts-table .v-autocomplete.description-field .v-field {
  margin: -10px;
  min-height: 32px !important;
}

.accounts-table .v-autocomplete--selected .v-field__input {
  cursor: default !important;
}

.accounts-table .v-field__clearable {
  position: absolute !important;
  left: -15px !important;
  padding: 0 !important;
  margin: 0 !important;
  height: 20px !important;
  width: 20px !important;
  top: 25% !important;
  left: 15% !important;
  transform: translateY(-50%) !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

.accounts-table .v-field__clearable .v-icon {
  font-size: 17px !important;
  width: 17px !important;
  height: 17px !important;
}

.accounts-table .v-field__input {
  padding-left: 0 !important;
}

.clear-btn {
  padding: 0 !important;
  margin: 0 !important;
  min-width: 18px !important;
  width: 18px !important;
  height: 18px !important;
  border-radius: 50% !important;
}

.v-field:hover .clear-btn {
  opacity: 1;
  background-color: rgba(102, 92, 92, 0.4);
}

.v-combobox .v-field__append-inner {
  display: none !important;
}

.v-combobox .v-field__input {
  padding-right: 12px !important;
}

.v-combobox.error-field .v-field__input {
  padding-right: 36px !important;
}

.text-remaining {
  font-size: 0.6rem !important;
  font-weight: 900;
  line-height: 1rem;
}

.accounts-table .v-autocomplete .v-selection-control__wrapper {
  max-height: 20px;
  overflow: hidden;
}

.accounts-table .v-field--focused {
  min-height: 32px !important;
  max-height: 32px !important;
}

.accounts-table .v-field--focused .v-field__input {
  transform: none !important;
}

.accounts-table .v-autocomplete {
  height: 32px !important;
}

.accounts-table .v-autocomplete .v-field__field {
  height: 32px !important;
  min-height: 32px !important;
  max-height: 32px !important;
}

.accounts-table .v-autocomplete .v-field__field .v-field__input > div {
  position: absolute !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
}

.clear-btn .v-icon {
  font-size: 14px !important;
  width: 14px !important;
  height: 14px !important;
}
</style>
