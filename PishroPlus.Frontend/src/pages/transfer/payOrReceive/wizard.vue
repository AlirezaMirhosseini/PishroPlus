<template>
  <v-dialog persistent v-model="selectDetailedAccountDialog" width="600px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="treeViewIcon" />
        <p style="font-weight: bold">
          {{ $t('selectDetailedAccount') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="selectDetailedAccountDialog = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="px-1">
        <v-text-field
          class="mb-4"
          hide-details
          variant="outlined"
          name="search"
          autofocus
          density="compact"
          :label="$t('search')"
          append-inner-icon="mdi mdi-magnify"
          v-model="searchAccountText"
          v-debounce:290="changeSearchText"
        />
        <fieldset class="pishro-border">
          <legend class="mx-auto px-2 text-grey pishro-caption">
            {{ $t('detailedAccountsTreeView') }}
          </legend>
          <tree-view
            v-model="treeViewAccountsShowList"
            @activeChanged="setActiveAccount"
            :hasEnter="selectDetailedAccountDialog"
            @enterMethod="saveDetailedAccount"
          />
        </fieldset>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="saveDetailedAccount" :prepend-icon="saveIcon" variant="flat" color="info"
          >{{ $t('select') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog close-on-back persistent v-model="showQrCodeScanner" width="400px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" icon="mdi mdi-qrcode-scan" />
        <p style="font-weight: bold">
          {{ $t('scanSayyadiBarcode') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="showQrCodeScanner = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <qrcode-stream @detect="onDetectQr" />
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog
    close-on-back
    persistent
    v-model="advancedRegisterDocumentDialog.show"
    width="800px"
    max-width="100%"
  >
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="selectDocumentsIcon" />
        <p style="font-weight: bold">
          {{ $t('advancedRegister') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="handleCloseAdvancedDialog"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text class="pb-4">
        <v-form
          v-if="!advancedRegisterDocumentDialog.isPriceEntered"
          ref="totalAmountRef"
          @submit.prevent="saveTotalAmount"
          @input="
            () => {
              if (!advancedRegisterDocumentDialog.hasChanged)
                advancedRegisterDocumentDialog.hasChanged = true
            }
          "
        >
          <v-row class="align-center">
            <v-col cols="12" md="6">
              <p>{{ $t('enterTheTotalAmountMessage') }}:</p>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                hide-details
                :rules="[(v) => !!v || $t('enterRequiredField')]"
                variant="outlined"
                density="compact"
                :label="$t('totalAmount')"
                :suffix="$t('rial')"
                v-maska:[advancedTotalPriceOptions]
                v-maska="advancedRegisterDocumentDialog.totalAmountMasked"
                v-model="advancedRegisterDocumentDialog.totalAmountMasked.masked"
              />
              <p class="pishro-caption text-grey">
                {{
                  advancedRegisterDocumentDialog.totalAmount
                    ? showPersianNum(advancedRegisterDocumentDialog.totalAmount) + ' ' + $t('rial')
                    : ''
                }}
              </p>
            </v-col>
            <v-col class="justify-end d-flex" cols="12">
              <v-btn type="submit" variant="flat" color="primary">{{ $t('continue') }} </v-btn>
            </v-col>
          </v-row>
        </v-form>
        <v-form v-else ref="advancedRegisterRef" @submit.prevent="saveAdvancedRegister">
          <v-row>
            <v-col class="d-flex justify-end align-center remaining-box" cols="12">
              <v-btn
                v-if="advancedRegisterDocumentDialog.expanded"
                @click="advancedRegisterDocumentDialog.expanded = false"
                icon="mdi mdi-calculator-variant-outline"
                variant="tonal"
                size="x-small"
                color="info"
              />
              <v-btn
                v-else
                @click="advancedRegisterDocumentDialog.expanded = true"
                icon="mdi mdi-menu-down"
                variant="tonal"
                size="x-small"
                color="error"
              />
              <p class="pishro-caption text-grey ms-2">
                {{ $t('remainingAmount') + ' : ' + remainingAmount.toLocaleString() }}
              </p>
            </v-col>
            <v-expand-transition>
              <v-col
                v-show="!advancedRegisterDocumentDialog.expanded"
                cols="12"
                class="pishro-border amounts-details-box"
              >
                <v-row class="justify-space-between">
                  <v-btn size="x-small" variant="text" :icon="penIcon" style="visibility: hidden" />
                  <div>
                    <span class="text-info" style="font-size: 25px; font-weight: bold">
                      {{
                        Number.parseInt(
                          advancedRegisterDocumentDialog.totalAmount
                        ).toLocaleString() + ' '
                      }}</span
                    >
                    <span class="text-info"> {{ $t('rial') }}</span>
                    <p class="text-grey pishro-caption text-center mb-2" style="margin-top: -4px">
                      {{ $t('totalAmount') }}
                    </p>
                  </div>
                  <v-btn
                    @click="() => (advancedRegisterDocumentDialog.isPriceEntered = false)"
                    size="x-small"
                    variant="text"
                    :icon="penIcon"
                  />
                </v-row>
                <v-row>
                  <v-col cols="4" style="border-inline-end: 1px solid #eeeeee">
                    <p class="text-center text-grey">{{ $t('check') }}</p>
                    <p class="text-center text-grey">
                      {{
                        (advancedRegisterDocumentDialog.checkDetails.amount
                          ? Number.parseInt(
                              advancedRegisterDocumentDialog.checkDetails.amount
                            ).toLocaleString()
                          : 0) +
                        ' ' +
                        $t('rial')
                      }}
                    </p>
                  </v-col>
                  <v-col cols="4" style="border-inline-end: 1px solid #eeeeee">
                    <p class="text-center text-grey">{{ $t('deposit') }}</p>
                    <p class="text-center text-grey">
                      {{
                        (advancedRegisterDocumentDialog.depositDetails.amount
                          ? Number.parseInt(
                              advancedRegisterDocumentDialog.depositDetails.amount
                            ).toLocaleString()
                          : 0) +
                        ' ' +
                        $t('rial')
                      }}
                    </p>
                  </v-col>
                  <v-col cols="4">
                    <p class="text-center text-grey">{{ $t('cash') }}</p>
                    <p class="text-center text-grey">
                      {{
                        (advancedRegisterDocumentDialog.cashDetails.amount
                          ? Number.parseInt(
                              advancedRegisterDocumentDialog.cashDetails.amount
                            ).toLocaleString()
                          : 0) +
                        ' ' +
                        $t('rial')
                      }}
                    </p>
                  </v-col>
                </v-row>
              </v-col>
            </v-expand-transition>
            <v-col class="advanced-content" cols="12">
              <v-checkbox
                :model-value="advancedRegisterDocumentDialog.hasCheck"
                @update:modelValue="($event) => updateCheck($event)"
                class="advanced-checkbox"
                hide-details
                base-color="error"
                color="info"
                :label="$t('check')"
              />
              <v-row class="ms-8" v-if="advancedRegisterDocumentDialog.hasCheck">
                <v-col cols="12" md="6">
                  <v-text-field
                    :label="$t('totalChecksAmount')"
                    :rules="[
                      (v) =>
                        !!v || !advancedRegisterDocumentDialog.hasCheck || $t('enterRequiredField')
                    ]"
                    hide-details
                    name="checkAmount"
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-maska:[advancedCheckAmountOptions]
                    v-maska="advancedRegisterDocumentDialog.checkDetails.amountMasked"
                    v-model="advancedRegisterDocumentDialog.checkDetails.amountMasked.masked"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      advancedRegisterDocumentDialog.checkDetails.amount
                        ? showPersianNum(advancedRegisterDocumentDialog.checkDetails.amount) +
                          ' ' +
                          $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    type="number"
                    name="checkCount"
                    hide-details
                    variant="outlined"
                    density="compact"
                    :label="$t('checkCount')"
                    v-model="advancedRegisterDocumentDialog.checkDetails.count"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <date-picker
                    :editable="true"
                    v-model="advancedRegisterDocumentDialog.checkDetails.date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    :label="$t('firstCheckDueDate')"
                    locale="fa,en"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-text-field
                    type="number"
                    name="checkTimePeriod"
                    hide-details
                    variant="outlined"
                    density="compact"
                    :label="$t('timeToNextCheck')"
                    v-model="advancedRegisterDocumentDialog.checkDetails.timePeriod"
                  />
                </v-col>
                <v-col cols="6" md="3">
                  <v-select
                    :items="periodTypes"
                    v-model="advancedRegisterDocumentDialog.checkDetails.periodType"
                    variant="outlined"
                    :label="$t('periodType')"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <v-btn
                    prepend-icon="mdi mdi-calculator-variant-outline"
                    variant="flat"
                    color="info"
                    @click="calculateChecks"
                  >
                    {{ $t('doCalculate') }}
                  </v-btn>
                  <v-menu>
                    <template v-slot:activator="{ props }">
                      <v-btn
                        v-bind="props"
                        class="ms-2"
                        prepend-icon="mdi mdi-numeric"
                        variant="tonal"
                        color="primary"
                      >
                        {{ $t('roundTheAmount') }}
                      </v-btn>
                    </template>
                    <v-list>
                      <v-list-item
                        density="compact"
                        @click="() => roundCheckAmounts(1000)"
                        :title="$t('threeDigit')"
                      >
                      </v-list-item>
                      <v-list-item
                        density="compact"
                        @click="() => roundCheckAmounts(10000)"
                        :title="$t('fourDigit')"
                      >
                      </v-list-item>
                      <v-list-item
                        density="compact"
                        @click="() => roundCheckAmounts(100000)"
                        :title="$t('fiveDigit')"
                      >
                      </v-list-item>
                      <v-list-item
                        density="compact"
                        @click="() => roundCheckAmounts(1000000)"
                        :title="$t('sixDigit')"
                      >
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </v-col>
                <v-col
                  v-for="(item, index) in advancedRegisterDocumentDialog.checkDetails.checks"
                  :key="index"
                  cols="12"
                >
                  <div class="checkbox-start-bar">
                    <v-btn
                      :class="['check-card-arrow', item.showDetails ? '' : 'opened-check-arrow']"
                      @click="() => (item.showDetails = !item.showDetails)"
                      size="x-small"
                      variant="text"
                      density="comfortable"
                      color="greyArrow"
                      icon="mdi mdi-chevron-up"
                    />
                  </div>
                  <v-row class="pishro-border flex-column my-0 pa-3 ps-6">
                    <v-row class="align-center">
                      <v-col class="py-0" cols="6" sm="3">
                        <p>{{ index + 1 }}</p>
                        <p class="text-grey">{{ $t('checkPaperNumber') }}</p>
                      </v-col>
                      <v-col class="py-0" cols="6" sm="4">
                        <p>{{ getPersianDate(item.date, false) }}</p>
                        <p class="text-grey">{{ $t('dueDate') }}</p>
                      </v-col>
                      <v-col class="py-0" cols="6" sm="3">
                        <p>{{ item.amount.toLocaleString() }}</p>
                        <p class="text-grey">{{ $t('amount') }}</p>
                      </v-col>
                      <v-col class="py-0 d-flex flex-row" cols="6" sm="2">
                        <v-btn
                          @click="
                            () =>
                              advancedRegisterDocumentDialog.checkDetails.checks.push({ ...item })
                          "
                          icon="mdi mdi-content-copy"
                          color="info"
                          variant="text"
                        />
                        <v-btn
                          @click="
                            () =>
                              (advancedRegisterDocumentDialog.checkDetails.checks =
                                advancedRegisterDocumentDialog.checkDetails.checks.filter(
                                  (a) => a != item
                                ))
                          "
                          :icon="deleteIcon"
                          color="error"
                          variant="text"
                        />
                      </v-col>
                    </v-row>
                    <v-expand-transition>
                      <v-row v-show="item.showDetails">
                        <template v-if="type == 0">
                          <v-col cols="12" :md="item.custumBank ? 6 : 12">
                            <v-combobox
                              v-model="item.bankName"
                              :items="bankItems"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              item-title="title"
                              item-value="value"
                              hide-details
                              :label="$t('selectBank')"
                              density="compact"
                              variant="outlined"
                              :no-data-text="$t('noItems')"
                              :prepend-inner-icon="
                                item?.bankName
                                  ? bankItems.find((a) => a.value == item.bankName)?.icon
                                  : null
                              "
                            >
                              <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props">
                                  <template v-slot:prepend>
                                    <v-avatar :icon="item.raw.icon"></v-avatar>
                                  </template>
                                </v-list-item>
                              </template>
                              <template v-slot:append-item>
                                <v-divider />
                                <v-list-item
                                  prepend-icon="mdi mdi-plus"
                                  @click.prevent="() => selectAdvancedCustomBank(item)"
                                  title="سایر"
                                ></v-list-item>
                              </template>
                            </v-combobox>
                          </v-col>
                          <v-col v-if="item.custumBank" cols="12" md="6">
                            <v-text-field
                              hide-details
                              variant="outlined"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              density="compact"
                              :label="$t('bankName')"
                              v-model="item.bankName"
                            />
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              hide-details
                              variant="outlined"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              density="compact"
                              :label="$t('branchName')"
                              v-model="item.branchName"
                            />
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              hide-details
                              variant="outlined"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              density="compact"
                              :label="$t('branchCode')"
                              v-model="item.branchCode"
                            />
                          </v-col>
                          <v-col cols="12" md="4">
                            <v-text-field
                              hide-details
                              variant="outlined"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              density="compact"
                              :label="$t('serieNumber')"
                              v-model="item.serieCode"
                            />
                          </v-col>
                        </template>
                        <template v-else>
                          <v-col cols="12" md="4">
                            <v-autocomplete
                              v-model="item.checkBookId"
                              @update:modelValue="($event) => changeAdvancedCheckBook($event, item)"
                              :items="checkBooks"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              item-title="title"
                              item-value="id"
                              hide-details
                              :label="$t('selectCheckBook')"
                              density="compact"
                              variant="outlined"
                              :no-data-text="$t('noItems')"
                            />
                          </v-col>
                          <v-col cols="12" md="5">
                            <v-autocomplete
                              v-model="item.checkPaperId"
                              @update:modelValue="changeCheckPaper"
                              :disabled="!item.checkBookId"
                              :items="checkPapers"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              item-title="title"
                              item-value="id"
                              hide-details
                              :label="$t('selectCheckPaper')"
                              density="compact"
                              variant="outlined"
                              :no-data-text="$t('noItems')"
                            />
                          </v-col>
                          <v-col cols="12" md="3">
                            <v-text-field
                              hide-details
                              variant="outlined"
                              :rules="[
                                (v) =>
                                  !!v ||
                                  !advancedRegisterDocumentDialog.hasCheck ||
                                  $t('enterRequiredField')
                              ]"
                              density="compact"
                              :label="$t('serieNumber')"
                              v-model="item.serieCode"
                            />
                          </v-col>
                        </template>
                        <v-col cols="12" md="6">
                          <date-picker
                            :editable="true"
                            :clearable="false"
                            v-model="item.date"
                            format="YYYY-MM-DD"
                            display-format="jYYYY/jMM/jDD"
                            :label="$t('dueDate')"
                            locale="fa,en"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            type="number"
                            hide-details
                            :rules="[
                              (v) =>
                                !!v ||
                                !advancedRegisterDocumentDialog.hasCheck ||
                                $t('enterRequiredField')
                            ]"
                            variant="outlined"
                            density="compact"
                            :label="$t('checkSerialNumber')"
                            v-model="item.serialNumber"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            :label="$t('sayyadiNumber')"
                            type="number"
                            hide-details
                            density="compact"
                            variant="outlined"
                            :rules="[
                              (v) => {
                                if (advancedRegisterDocumentDialog.hasCheck) {
                                  if (!v) return $t('enterRequiredField')
                                  else if (!sayyadiRegex.test(v))
                                    return $t('enterTheSayyadiNumberCorrectly')
                                  else return true
                                } else return true
                              }
                            ]"
                            v-model="item.sayadNumber"
                            append-inner-icon="mdi mdi-qrcode-scan"
                            @click:append-inner="() => openQrScanner(item)"
                          />
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            :label="$t('accountNumber')"
                            :rules="[
                              (v) =>
                                !!v ||
                                !advancedRegisterDocumentDialog.hasCheck ||
                                $t('enterRequiredField')
                            ]"
                            hide-details
                            type="number"
                            variant="outlined"
                            density="compact"
                            v-model="item.bankAccountNumber"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            :label="$t('shabaNumber')"
                            hide-details
                            variant="outlined"
                            density="compact"
                            v-model="item.iBan"
                            type="number"
                            suffix="IR"
                          ></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                          <v-text-field
                            :label="$t('amount')"
                            type="number"
                            :rules="[
                              (v) =>
                                !!v ||
                                !advancedRegisterDocumentDialog.hasCheck ||
                                $t('enterRequiredField')
                            ]"
                            hide-details
                            variant="outlined"
                            density="compact"
                            :suffix="$t('rial')"
                            v-model="item.amount"
                          ></v-text-field>
                          <p class="pishro-caption text-grey">
                            {{ item.amount ? showPersianNum(item.amount) + ' ' + $t('rial') : '' }}
                          </p>
                        </v-col>
                      </v-row>
                    </v-expand-transition>
                  </v-row>
                </v-col>
              </v-row>
              <v-checkbox
                :model-value="advancedRegisterDocumentDialog.hasCash"
                @update:modelValue="($event) => updateCash($event)"
                class="advanced-checkbox"
                hide-details
                color="info"
                :label="$t('cash')"
              />
              <v-row class="ms-8" v-if="advancedRegisterDocumentDialog.hasCash">
                <v-col cols="12" md="6">
                  <date-picker
                    :editable="true"
                    v-model="advancedRegisterDocumentDialog.cashDetails.date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    :label="$t('date')"
                    locale="fa,en"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-autocomplete
                    v-model="advancedRegisterDocumentDialog.cashDetails.cashBoxId"
                    :items="cashBoxes"
                    :rules="[
                      (v) =>
                        !!v || !advancedRegisterDocumentDialog.hasCash || $t('enterRequiredField')
                    ]"
                    item-title="fName"
                    item-value="id"
                    :label="$t('cashDesk')"
                    density="compact"
                    :prepend-inner-icon="cashDeskIcon"
                    variant="outlined"
                    :no-data-text="$t('noItems')"
                    hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$t('amount')"
                    :rules="[
                      (v) =>
                        !!v || !advancedRegisterDocumentDialog.hasCash || $t('enterRequiredField')
                    ]"
                    hide-details
                    name="cashAmount"
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-maska:[advancedCashAmountOptions]
                    v-maska="advancedRegisterDocumentDialog.cashDetails.amountMasked"
                    v-model="advancedRegisterDocumentDialog.cashDetails.amountMasked.masked"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      advancedRegisterDocumentDialog.cashDetails.amount
                        ? showPersianNum(advancedRegisterDocumentDialog.cashDetails.amount) +
                          ' ' +
                          $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
              </v-row>
              <v-checkbox
                :model-value="advancedRegisterDocumentDialog.hasDeposit"
                @update:modelValue="($event) => updateDeposit($event)"
                class="advanced-checkbox"
                hide-details
                color="info"
                :label="$t('deposit')"
              />
              <v-row class="ms-8" v-if="advancedRegisterDocumentDialog.hasDeposit">
                <v-col cols="12" md="6">
                  <v-select
                    :items="documentTypes"
                    v-model="advancedRegisterDocumentDialog.depositDetails.type"
                    :rules="[
                      (v) =>
                        !!v ||
                        !advancedRegisterDocumentDialog.hasDeposit ||
                        $t('enterRequiredField')
                    ]"
                    variant="outlined"
                    :label="$t('depositType')"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    hide-details
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :disabled="item.raw.disabled"></v-list-item>
                    </template>
                  </v-select>
                </v-col>

                <v-col
                  v-if="
                    [2, 3, 4].some((a) => a == advancedRegisterDocumentDialog.depositDetails.type)
                  "
                  cols="12"
                  md="6"
                >
                  <v-autocomplete
                    v-model="advancedRegisterDocumentDialog.depositDetails.selectedDetailedBank"
                    :items="myBanks"
                    :rules="[
                      (v) =>
                        !!v ||
                        !advancedRegisterDocumentDialog.hasDeposit ||
                        $t('enterRequiredField')
                    ]"
                    item-title="fName"
                    item-value="id"
                    :label="$t('selectBank')"
                    density="compact"
                    variant="outlined"
                    :no-data-text="$t('noItems')"
                    hide-details
                  />
                </v-col>
                <v-col
                  v-if="
                    [2, 3, 4].some(
                      (a) => a == advancedRegisterDocumentDialog.depositDetails.type
                    ) && registerDocumentDialog.custumBank
                  "
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    hide-details
                    variant="outlined"
                    :rules="[
                      (v) =>
                        !!v ||
                        !advancedRegisterDocumentDialog.hasDeposit ||
                        $t('enterRequiredField')
                    ]"
                    density="compact"
                    :label="$t('bankName')"
                    v-model="advancedRegisterDocumentDialog.depositDetails.bankName"
                  />
                </v-col>
                <v-col
                  v-if="[6, 7].some((a) => a == advancedRegisterDocumentDialog.depositDetails.type)"
                  cols="12"
                  md="6"
                >
                  <v-select
                    :rules="[
                      (v) =>
                        !!v ||
                        !advancedRegisterDocumentDialog.hasDeposit ||
                        $t('enterRequiredField')
                    ]"
                    v-model="advancedRegisterDocumentDialog.selectedPOSId"
                    :items="POSList"
                    variant="outlined"
                    :label="$t('posDevice')"
                    density="compact"
                    item-title="name"
                    item-value="id"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <date-picker
                    :editable="true"
                    v-model="advancedRegisterDocumentDialog.depositDetails.date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    :label="$t('depositDate')"
                    locale="fa,en"
                  />
                </v-col>
                <v-col
                  v-if="
                    [2, 3, 4, 7].some(
                      (a) => a == advancedRegisterDocumentDialog.depositDetails.type
                    )
                  "
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    type="number"
                    hide-details
                    :rules="[
                      (v) =>
                        !!v ||
                        !advancedRegisterDocumentDialog.hasDeposit ||
                        $t('enterRequiredField')
                    ]"
                    variant="outlined"
                    density="compact"
                    :label="$t('serialNumber')"
                    v-model="advancedRegisterDocumentDialog.depositDetails.serialNumber"
                  />
                </v-col>
                <v-col
                  v-if="advancedRegisterDocumentDialog.depositDetails.type == 2"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    :label="$t('cardNumber')"
                    hide-details
                    type="number"
                    variant="outlined"
                    density="compact"
                    v-model="advancedRegisterDocumentDialog.depositDetails.cardNumber"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="[3, 4].some((a) => a == advancedRegisterDocumentDialog.depositDetails.type)"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    :label="$t('accountNumber')"
                    hide-details
                    type="number"
                    variant="outlined"
                    density="compact"
                    v-model="advancedRegisterDocumentDialog.depositDetails.bankAccountNumber"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="[3, 4].some((a) => a == advancedRegisterDocumentDialog.depositDetails.type)"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    :label="$t('shabaNumber')"
                    hide-details
                    type="number"
                    variant="outlined"
                    density="compact"
                    suffix="IR"
                    v-model="advancedRegisterDocumentDialog.depositDetails.iBan"
                  ></v-text-field>
                </v-col>
                <v-col
                  v-if="
                    [2, 3, 4].some(
                      (a) => a == advancedRegisterDocumentDialog.depositDetails.type
                    ) && type == 1
                  "
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    :label="$t('bankCommission')"
                    type="number"
                    hide-details
                    name="bankCommission"
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-model="advancedRegisterDocumentDialog.depositDetails.commissionAmount"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      advancedRegisterDocumentDialog.depositDetails.commissionAmount
                        ? showPersianNum(
                            advancedRegisterDocumentDialog.depositDetails.commissionAmount
                          ) +
                          ' ' +
                          $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    :label="$t('amount')"
                    :rules="[
                      (v) =>
                        !!v ||
                        !advancedRegisterDocumentDialog.hasDeposit ||
                        $t('enterRequiredField')
                    ]"
                    hide-details
                    name="depositAmount"
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-maska:[advancedDepositAmountOptions]
                    v-maska="advancedRegisterDocumentDialog.depositDetails.amountMasked"
                    v-model="advancedRegisterDocumentDialog.depositDetails.amountMasked.masked"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      advancedRegisterDocumentDialog.depositDetails.amount
                        ? showPersianNum(advancedRegisterDocumentDialog.depositDetails.amount) +
                          ' ' +
                          $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row class="justify-end pb-2">
            <v-btn prepend-icon="mdi mdi-check" variant="flat" color="primary" type="submit">{{
              $t('save')
            }}</v-btn>
          </v-row>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>

  <v-dialog close-on-back v-model="registerDocumentDialog.show" width="650px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="moneyPlusIcon" />
        <p style="font-weight: bold">
          {{ $t('registerDocument') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="handleCloseRegisterDialog"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <nav-tab
          :items="type === 0 ? [$t('check'), $t('depositToAccount'), $t('cash')] : [$t('check'), $t('withdrawFromAccount'), $t('cash')]"
          :theme="1"
          :disabled="
            registerDocumentDialog.editType
              ? (type === 0 ? [$t('check'), $t('depositToAccount'), $t('cash')].filter(
                  (a) => a != registerDocumentDialog.editType
                ) : [$t('check'), $t('withdrawFromAccount'), $t('cash')].filter(
                  (a) => a != registerDocumentDialog.editType
                ))
              : []
          "
          v-model:activeTab="registerDocumentDialog.activeTab"
        ></nav-tab>
        <v-window :touch="false" v-model="registerDocumentDialog.activeTab">
          <v-window-item :value="0">
            <v-form
              ref="registerDocumentRefCheck"
              style="all: unset"
              @input="
                () => {
                  if (!registerDocumentDialog.hasChanged) registerDocumentDialog.hasChanged = true
                }
              "
            >
              <v-row class="mt-4">
                <template v-if="type == 0">
                  <v-col cols="12" :md="registerDocumentDialog.custumBank ? 6 : 12">
                    <v-combobox
                      id="firstTabSelectBank"
                      v-model="registerDocumentDialog.bankName"
                      :items="bankItems"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      item-title="title"
                      item-value="value"
                      hide-details
                      :label="$t('selectBank')"
                      density="compact"
                      variant="outlined"
                      :no-data-text="$t('noItems')"
                      :prepend-inner-icon="
                        registerDocumentDialog?.bankName
                          ? bankItems.find((a) => a.value == registerDocumentDialog.bankName)?.icon
                          : null
                      "
                    >
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props">
                          <template v-slot:prepend>
                            <v-avatar :icon="item.raw.icon"></v-avatar>
                          </template>
                        </v-list-item>
                      </template>
                    </v-combobox>
                  </v-col>
                  <!-- <v-col v-if="registerDocumentDialog.custumBank" cols="12" md="6">
                    <v-text-field
                      ref="bankNameRef"
                      hide-details
                      variant="outlined"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      density="compact"
                      :label="$t('bankName')"
                      v-model="registerDocumentDialog.bankName"
                    />
                  </v-col> -->
                  <v-col cols="12" md="4">
                    <v-text-field
                      hide-details
                      variant="outlined"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      density="compact"
                      :label="$t('branchName')"
                      v-model="registerDocumentDialog.branchName"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      hide-details
                      variant="outlined"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      density="compact"
                      :label="$t('branchCode')"
                      v-model="registerDocumentDialog.branchCode"
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      hide-details
                      variant="outlined"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      density="compact"
                      :label="$t('serieNumber')"
                      v-model="registerDocumentDialog.serieCode"
                    />
                  </v-col>
                </template>
                <template v-else>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="registerDocumentDialog.checkBookId"
                      @update:modelValue="changeCheckBook"
                      :items="checkBooks"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      item-title="title"
                      item-value="id"
                      hide-details
                      :label="$t('selectCheckBook')"
                      density="compact"
                      variant="outlined"
                      :no-data-text="$t('noItems')"
                    />
                  </v-col>
                  <v-col cols="12" md="5">
                    <v-autocomplete
                      v-model="registerDocumentDialog.checkPaperId"
                      @update:modelValue="changeCheckPaper"
                      :disabled="!registerDocumentDialog.checkBookId"
                      :items="checkPapers"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      item-title="title"
                      item-value="id"
                      hide-details
                      :label="$t('selectCheckPaper')"
                      density="compact"
                      variant="outlined"
                      :no-data-text="$t('noItems')"
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-text-field
                      hide-details
                      variant="outlined"
                      :rules="[
                        (v) =>
                          !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                      ]"
                      density="compact"
                      :label="$t('serieNumber')"
                      v-model="registerDocumentDialog.serieCode"
                    />
                  </v-col>
                </template>
                <v-col cols="12" md="6">
                  <date-picker
                    :editable="true"
                    v-model="registerDocumentDialog.date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    :label="$t('dueDate')"
                    locale="fa,en"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    type="number"
                    hide-details
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                    ]"
                    variant="outlined"
                    density="compact"
                    :label="$t('checkSerialNumber')"
                    v-model="registerDocumentDialog.serialNumber"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :label="$t('sayyadiNumber')"
                    type="number"
                    hide-details
                    density="compact"
                    variant="outlined"
                    :rules="[
                      (v) => {
                        if (registerDocumentDialog.activeTab == 0) {
                          if (!v) return $t('enterRequiredField')
                          else if (!sayyadiRegex.test(v))
                            return $t('enterTheSayyadiNumberCorrectly')
                          else return true
                        } else return true
                      }
                    ]"
                    v-model="registerDocumentDialog.sayadNumber"
                    append-inner-icon="mdi mdi-qrcode-scan"
                    @click:append-inner="openQrScanner(entity)"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :label="$t('accountNumber')"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                    ]"
                    hide-details
                    type="number"
                    variant="outlined"
                    density="compact"
                    v-model="registerDocumentDialog.bankAccountNumber"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :label="$t('shabaNumber')"
                    hide-details
                    variant="outlined"
                    :rules="[
                      (v) => {
                        if (/^\d{24}$/.test(v)) return true
                        return $t('enterRequiredField')
                      }
                    ]"
                    dir="ltr"
                    counter="24"
                    maxlength="24"
                    density="compact"
                    v-model="registerDocumentDialog.iBan"
                    suffix="IR"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    :label="$t('amount')"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                    ]"
                    hide-details
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-maska:[options]
                    v-maska="registerDocumentDialog.amountMasked"
                    v-model="registerDocumentDialog.amountMasked.masked"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      registerDocumentDialog.amount
                        ? showPersianNum(registerDocumentDialog.amount) + ' ' + $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    hide-details
                    density="compact"
                    :label="$t('description')"
                  />
                </v-col>
                <!-- <v-col class="mb-4" cols="12">
                  <v-expansion-panels class="account-expansion">
                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <p>{{ $t('debtor') }}</p>
                        <v-divider class="mx-4" />
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('desc')"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('account')"
                            disabled
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          class="d-flex align-center"
                          v-for="item in registerDocumentDialog.debtorDetailedAccounts"
                          :key="item.id"
                        >
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="
                              $t('detailed') +
                              ` ${registerDocumentDialog.debtorDetailedAccounts.indexOf(item) + 1}`
                            "
                            v-model="item.fName"
                            disabled
                          />
                          <v-btn
                            @click="
                              () =>
                                (registerDocumentDialog.debtorDetailedAccounts =
                                  registerDocumentDialog.debtorDetailedAccounts.filter(
                                    (a) => a.id != item.id
                                  ))
                            "
                            class="ms-2"
                            icon="mdi mdi-minus"
                            variant="tonal"
                            color="error"
                            size="x-small"
                          ></v-btn>
                        </v-col>
                        <v-col
                          v-if="registerDocumentDialog.debtorDetailedAccounts.length < 3"
                          cols="12"
                        >
                          <v-btn
                            @click="openSelectConnectedDetailedDialog(true)"
                            color="info"
                            append-icon="mdi mdi-plus"
                            variant="text"
                            >{{ $t('addDetailedAccount') }}</v-btn
                          >
                        </v-col>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <p>{{ $t('creditor') }}</p>
                        <v-divider class="mx-4" />
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('desc')"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('account')"
                            disabled
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          class="d-flex align-center"
                          v-for="item in registerDocumentDialog.creditorDetailedAccounts"
                          :key="item.id"
                        >
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="
                              $t('detailed') +
                              ` ${
                                registerDocumentDialog.creditorDetailedAccounts.indexOf(item) + 1
                              }`
                            "
                            v-model="item.fName"
                            disabled
                          />
                          <v-btn
                            @click="
                              () =>
                                (registerDocumentDialog.creditorDetailedAccounts =
                                  registerDocumentDialog.creditorDetailedAccounts.filter(
                                    (a) => a.id != item.id
                                  ))
                            "
                            class="ms-2"
                            icon="mdi mdi-minus"
                            variant="tonal"
                            color="error"
                            size="x-small"
                          ></v-btn>
                        </v-col>
                        <v-col
                          v-if="registerDocumentDialog.creditorDetailedAccounts.length < 3"
                          cols="12"
                        >
                          <v-btn
                            @click="openSelectConnectedDetailedDialog(false)"
                            color="info"
                            append-icon="mdi mdi-plus"
                            variant="text"
                            >{{ $t('addDetailedAccount') }}</v-btn
                          >
                        </v-col>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col> -->
              </v-row>
            </v-form>
          </v-window-item>
          <v-window-item :value="1">
            <v-form
              ref="registerDocumentRefBank"
              style="all: unset"
              @input="
                () => {
                  if (!registerDocumentDialog.hasChanged) registerDocumentDialog.hasChanged = true
                }
              "
            >
              <v-row class="mt-4">
                <v-col cols="12" md="6" >
                  <v-select
                    :items="documentTypes"
                    v-model="registerDocumentDialog.type"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 1 || $t('enterRequiredField')
                    ]"
                    variant="outlined"
                    :label="$t('depositType')"
                    density="compact"
                    item-title="title"
                    item-value="value"
                    hide-details
                  >
                    <template v-slot:item="{ props, item }">
                      <v-list-item v-bind="props" :disabled="item.raw.disabled"></v-list-item>
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="6">
                  <AccountSelector
                    v-model="registerDocumentDialog.bankAccount"
                    :title="$t('bank')"
                    hide-details
                    density="compact"
                    :mainHeaders="bankHeaders"
                    :detailedAccountFamily="4"
                    :justDetailedAccount="true"
                    :persistent="false"
                    :textFieldRules="[(v) => !!v || $t('enterRequiredField')]"
                    addNewRoute="/transfer/registerAccount/bank"
                    @accountAdded="handleAccountAdded"
                  />
                </v-col>
                <v-col
                  v-if="
                    [2, 3, 4].some((a) => a == registerDocumentDialog.type) &&
                    registerDocumentDialog.custumBank
                  "
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    hide-details
                    variant="outlined"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 1 || $t('enterRequiredField')
                    ]"
                    density="compact"
                    :label="$t('bankName')"
                    v-model="registerDocumentDialog.bankName"
                  />
                </v-col>
                <v-col v-if="[6, 7].some((a) => a == registerDocumentDialog.type)" cols="12" md="6">
                  <v-select
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 1 || $t('enterRequiredField')
                    ]"
                    v-model="registerDocumentDialog.selectedPOSId"
                    :items="POSList"
                    variant="outlined"
                    :label="$t('posDevice')"
                    density="compact"
                    item-title="name"
                    item-value="id"
                    hide-details
                  ></v-select>
                </v-col>
                <v-col cols="12" md="6">
                  <date-picker
                    :editable="true"
                    v-model="registerDocumentDialog.date"
                    format="YYYY-MM-DD"
                    display-format="jYYYY/jMM/jDD"
                    :label="type === 0 ? $t('depositDate') : $t('withdrawDate')"
                    locale="fa,en"
                  />
                </v-col>
                <v-col
                  v-if="[2, 3, 4, 7].some((a) => a == registerDocumentDialog.type)"
                  cols="6"
                >
                  <v-text-field
                    type="number"
                    hide-details
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 1 || $t('enterRequiredField')
                    ]"
                    variant="outlined"
                    density="compact"
                    :label="$t('serialNumber')"
                    v-model="registerDocumentDialog.serialNumber"
                  />
                </v-col>
                <fieldset class="w-100 px-4 pishro-border">
                  <legend class="mx-auto px-2 text-grey">
                    {{ type == 0 ? $t('sourceAccountInfo') : $t('destinationAccountInfo') }}
                  </legend>
                  <v-row>
                    <v-col cols="6">
                      <v-combobox
                        id="secondTabSelectBank"
                        v-model="registerDocumentDialog.bankName"
                        :items="bankItems"
                        :rules="[
                          (v) =>
                            !!v || registerDocumentDialog.activeTab != 0 || $t('enterRequiredField')
                        ]"
                        item-title="title"
                        item-value="value"
                        hide-details
                        :label="$t('selectBank')"
                        density="compact"
                        variant="outlined"
                        :no-data-text="$t('noItems')"
                        :prepend-inner-icon="
                          registerDocumentDialog?.bankName
                            ? bankItems.find((a) => a.value == registerDocumentDialog.bankName)?.icon
                            : null
                        "
                      >
                        <template v-slot:item="{ props, item }">
                          <v-list-item v-bind="props">
                            <template v-slot:prepend>
                              <v-avatar :icon="item.raw.icon"></v-avatar>
                            </template>
                          </v-list-item>
                        </template>
                      </v-combobox>
                    </v-col>
                    <!-- <v-col
                      v-if="[2, 3, 4].some((a) => a == registerDocumentDialog.type)"
                      cols="12"
                      md="6"
                    >
                      <v-autocomplete
                        v-model="registerDocumentDialog.selectedDetailedBank"
                        :items="myBanks"
                        :rules="[
                          (v) =>
                            !!v || registerDocumentDialog.activeTab != 1 || $t('enterRequiredField')
                        ]"
                        item-title="fName"
                        item-value="id"
                        :label="$t('selectBank')"
                        density="compact"
                        variant="outlined"
                        :no-data-text="$t('noItems')"
                        hide-details
                      />
                    </v-col> -->
                    <v-col v-if="[3, 4].some((a) => a == registerDocumentDialog.type)" cols="6">
                      <v-text-field
                        :label="$t('accountNumber')"
                        hide-details
                        density="compact"
                        type="number"
                        variant="outlined"
                        v-model="registerDocumentDialog.bankAccountNumber"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col v-if="[3, 4].some((a) => a == registerDocumentDialog.type)" cols="6">
                      <v-text-field
                        :label="$t('shabaNumber')"
                        required
                        :rules="[
                          (v) => {
                            if (/^\d{24}$/.test(v)) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        variant="outlined"
                        density="compact"
                        v-model="registerDocumentDialog.iBan"
                        counter="24"
                        dir="ltr"
                        maxlength="24"
                        suffix="IR"
                      ></v-text-field>
                    </v-col>
                    <v-col v-if="registerDocumentDialog.type == 2" cols="6">
                      <v-text-field
                        :label="$t('cardNumber')"
                        hide-details
                        type="number"
                        variant="outlined"
                        density="compact"
                        v-model="registerDocumentDialog.cardNumber"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </fieldset>
                <v-col
                  v-if="[2, 3, 4].some((a) => a == registerDocumentDialog.type) && type == 1"
                  cols="12"
                >
                  <v-text-field
                    :label="$t('bankCommission')"
                    type="number"
                    hide-details
                    name="bankCommission"
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-model="registerDocumentDialog.commissionAmount"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      registerDocumentDialog.commissionAmount
                        ? showPersianNum(registerDocumentDialog.commissionAmount) + ' ' + $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$t('amount')"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 1 || $t('enterRequiredField')
                    ]"
                    hide-details
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-maska:[options]
                    v-maska="registerDocumentDialog.amountMasked"
                    v-model="registerDocumentDialog.amountMasked.masked"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      registerDocumentDialog.amount
                        ? showPersianNum(registerDocumentDialog.amount) + ' ' + $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    variant="outlined"
                    hide-details
                    density="compact"
                    :label="$t('description')"
                  />
                </v-col>
                <!-- <template v-for="selectedType in [2, 3, 4, 6, 7]" :key="selectedType">
                  
                </template> -->
                <!-- <v-col class="mb-4" cols="12">
                  <template v-for="selectedType in [2, 3, 4, 6, 7]" :key="selectedType">
                    <v-expansion-panels
                      v-if="registerDocumentDialog.type == selectedType"
                      class="account-expansion"
                    >
                      <v-expansion-panel elevation="0">
                        <v-expansion-panel-title>
                          <p>{{ $t('debtor') }}</p>
                          <v-divider class="mx-4" />
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-col cols="12">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              density="compact"
                              :label="$t('desc')"
                              v-model="
                                registerDocumentDialog.items.find(
                                  (a) => a.sourceType == selectedType
                                ).debtorDesc
                              "
                            />
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              density="compact"
                              :label="$t('account')"
                              disabled
                              v-model="
                                registerDocumentDialog.items.find(
                                  (a) => a.sourceType == selectedType
                                ).debtorAccountName
                              "
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            class="d-flex align-center"
                            v-for="item in registerDocumentDialog.debtorDetailedAccounts"
                            :key="item.id"
                          >
                            <v-text-field
                              variant="outlined"
                              hide-details
                              density="compact"
                              :label="
                                $t('detailed') +
                                ` ${
                                  registerDocumentDialog.debtorDetailedAccounts.indexOf(item) + 1
                                }`
                              "
                              v-model="item.fName"
                              disabled
                            />
                            <v-btn
                              @click="
                                () =>
                                  (registerDocumentDialog.debtorDetailedAccounts =
                                    registerDocumentDialog.debtorDetailedAccounts.filter(
                                      (a) => a.id != item.id
                                    ))
                              "
                              class="ms-2"
                              icon="mdi mdi-minus"
                              variant="tonal"
                              color="error"
                              size="x-small"
                            ></v-btn>
                          </v-col>
                          <v-col
                            v-if="registerDocumentDialog.debtorDetailedAccounts.length < 3"
                            cols="12"
                          >
                            <v-btn
                              @click="openSelectConnectedDetailedDialog(true)"
                              color="info"
                              append-icon="mdi mdi-plus"
                              variant="text"
                              >{{ $t('addDetailedAccount') }}</v-btn
                            >
                          </v-col>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                      <v-expansion-panel elevation="0">
                        <v-expansion-panel-title>
                          <p>{{ $t('creditor') }}</p>
                          <v-divider class="mx-4" />
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <v-col cols="12">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              density="compact"
                              :label="$t('desc')"
                              v-model="
                                registerDocumentDialog.items.find(
                                  (a) => a.sourceType == selectedType
                                ).creditorDesc
                              "
                            />
                          </v-col>
                          <v-col cols="12">
                            <v-text-field
                              variant="outlined"
                              hide-details
                              density="compact"
                              :label="$t('account')"
                              disabled
                              v-model="
                                registerDocumentDialog.items.find(
                                  (a) => a.sourceType == selectedType
                                ).creditorAccountName
                              "
                            />
                          </v-col>
                          <v-col
                            cols="12"
                            class="d-flex align-center"
                            v-for="item in registerDocumentDialog.creditorDetailedAccounts"
                            :key="item.id"
                          >
                            <v-text-field
                              variant="outlined"
                              hide-details
                              density="compact"
                              :label="
                                $t('detailed') +
                                ` ${
                                  registerDocumentDialog.creditorDetailedAccounts.indexOf(item) + 1
                                }`
                              "
                              v-model="item.fName"
                              disabled
                            />
                            <v-btn
                              @click="
                                () =>
                                  (registerDocumentDialog.creditorDetailedAccounts =
                                    registerDocumentDialog.creditorDetailedAccounts.filter(
                                      (a) => a.id != item.id
                                    ))
                              "
                              class="ms-2"
                              icon="mdi mdi-minus"
                              variant="tonal"
                              color="error"
                              size="x-small"
                            ></v-btn>
                          </v-col>
                          <v-col
                            v-if="registerDocumentDialog.creditorDetailedAccounts.length < 3"
                            cols="12"
                          >
                            <v-btn
                              @click="openSelectConnectedDetailedDialog(false)"
                              color="info"
                              append-icon="mdi mdi-plus"
                              variant="text"
                              >{{ $t('addDetailedAccount') }}</v-btn
                            >
                          </v-col>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </template>
                </v-col> -->
              </v-row>
            </v-form>
          </v-window-item>
          <v-window-item :value="3">
            <v-form
              ref="registerDocumentRefCash"
              style="all: unset"
              @input="
                () => {
                  if (!registerDocumentDialog.hasChanged) registerDocumentDialog.hasChanged = true
                }
              "
            >
              <v-row class="mt-4">
                <v-col cols="12">
                  <v-autocomplete
                    @update:modelValue="changeCashBox"
                    v-model="registerDocumentDialog.cashBoxId"
                    :items="cashBoxes"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 2 || $t('enterRequiredField')
                    ]"
                    item-title="fName"
                    item-value="id"
                    :label="$t('cashDesk')"
                    density="compact"
                    :prepend-inner-icon="cashDeskIcon"
                    variant="outlined"
                    :no-data-text="$t('noItems')"
                    hide-details
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    :label="$t('amount')"
                    :rules="[
                      (v) =>
                        !!v || registerDocumentDialog.activeTab != 2 || $t('enterRequiredField')
                    ]"
                    hide-details
                    name="amount"
                    variant="outlined"
                    density="compact"
                    :suffix="$t('rial')"
                    v-maska:[options]
                    v-maska="registerDocumentDialog.amountMasked"
                    v-model="registerDocumentDialog.amountMasked.masked"
                  ></v-text-field>
                  <p class="pishro-caption text-grey">
                    {{
                      registerDocumentDialog.amount
                        ? showPersianNum(registerDocumentDialog.amount) + ' ' + $t('rial')
                        : ''
                    }}
                  </p>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    name="desc"
                    variant="outlined"
                    hide-details
                    density="compact"
                    :label="$t('description')"
                  />
                </v-col>
                <!-- <v-col class="mb-4" cols="12">
                  <v-expansion-panels class="account-expansion">
                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <p>{{ $t('debtor') }}</p>
                        <v-divider class="mx-4" />
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('desc')"
                            
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('account')"
                            disabled
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          class="d-flex align-center"
                          v-for="item in registerDocumentDialog.debtorDetailedAccounts"
                          :key="item.id"
                        >
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="
                              $t('detailed') +
                              ` ${registerDocumentDialog.debtorDetailedAccounts.indexOf(item) + 1}`
                            "
                            v-model="item.fName"
                            disabled
                          />
                          <v-btn
                            @click="
                              () =>
                                (registerDocumentDialog.debtorDetailedAccounts =
                                  registerDocumentDialog.debtorDetailedAccounts.filter(
                                    (a) => a.id != item.id
                                  ))
                            "
                            class="ms-2"
                            icon="mdi mdi-minus"
                            variant="tonal"
                            color="error"
                            size="x-small"
                          ></v-btn>
                        </v-col>
                        <v-col
                          v-if="registerDocumentDialog.debtorDetailedAccounts.length < 3"
                          cols="12"
                        >
                          <v-btn
                            @click="openSelectConnectedDetailedDialog(true)"
                            color="info"
                            append-icon="mdi mdi-plus"
                            variant="text"
                            >{{ $t('addDetailedAccount') }}</v-btn
                          >
                        </v-col>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                    <v-expansion-panel elevation="0">
                      <v-expansion-panel-title>
                        <p>{{ $t('creditor') }}</p>
                        <v-divider class="mx-4" />
                      </v-expansion-panel-title>
                      <v-expansion-panel-text>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('desc')"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="$t('account')"
                            disabled
                          />
                        </v-col>
                        <v-col
                          cols="12"
                          class="d-flex align-center"
                          v-for="item in registerDocumentDialog.creditorDetailedAccounts"
                          :key="item.id"
                        >
                          <v-text-field
                            variant="outlined"
                            hide-details
                            density="compact"
                            :label="
                              $t('detailed') +
                              ` ${
                                registerDocumentDialog.creditorDetailedAccounts.indexOf(item) + 1
                              }`
                            "
                            v-model="item.fName"
                            disabled
                          />
                          <v-btn
                            @click="
                              () =>
                                (registerDocumentDialog.creditorDetailedAccounts =
                                  registerDocumentDialog.creditorDetailedAccounts.filter(
                                    (a) => a.id != item.id
                                  ))
                            "
                            class="ms-2"
                            icon="mdi mdi-minus"
                            variant="tonal"
                            color="error"
                            size="x-small"
                          ></v-btn>
                        </v-col>
                        <v-col
                          v-if="registerDocumentDialog.creditorDetailedAccounts.length < 3"
                          cols="12"
                        >
                          <v-btn
                            @click="openSelectConnectedDetailedDialog(false)"
                            color="info"
                            append-icon="mdi mdi-plus"
                            variant="text"
                            >{{ $t('addDetailedAccount') }}</v-btn
                          >
                        </v-col>
                      </v-expansion-panel-text>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-col> -->
              </v-row>
            </v-form>
          </v-window-item>
        </v-window>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="addDocument" prepend-icon="mdi mdi-check" variant="flat" color="primary"
          >{{ $t('save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog
    close-on-back
    persistent
    v-model="selectMoeinAccountDialog.show"
    width="600px"
    max-width="100%"
  >
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
            @click="selectMoeinAccountDialog.show = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <p>{{ $t('selectConnectedMoeinMessage') }}</p>
        <data-table
          :headers="accountsHeaders"
          :items="selectMoeinAccountDialog.accounts"
          :clickableRow="true"
          :selectableRow="true"
          :hasEnter="selectMoeinAccountDialog.show"
          @enterMethod="selectMoeinAccount"
          v-model:selectedRow="selectMoeinAccountDialog.selected"
        >
          <template v-slot:column_index="{ entity }">
            {{ selectMoeinAccountDialog.accounts.indexOf(entity) + 1 }}</template
          >
        </data-table>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="selectMoeinAccount" variant="flat" color="info">{{ $t('select') }} </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog close-on-back persistent v-model="selectDateDialog.show" width="550px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="calendarIcon" />
        <p style="font-weight: bold">
          {{ $t('voucherDate') }}
        </p>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="selectDateDialog.show = false"
            variant="text"
          />
        </div>
      </v-row>
      <v-card-text>
        <p>{{ $t('selectVoucherDateMessage') }}</p>
        <v-row class="mt-4" no-gutters style="gap: 10px">
          <date-picker
            v-model="selectDateDialog.date"
            format="YYYY-MM-DD"
            display-format="jYYYY/jMM/jDD"
            :label="$t('date')"
            locale="fa,en"
            @change="changeDate"
          />
          <!-- <v-checkbox
            :label="$t('todayDate') + ` (${getPersianDate(new Date())})`"
            :model-value="selectDateDialog.isToday"
            @update:modelValue="($event) => checkIsToday($event)"
            hide-details
            density="compact"
          /> -->
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-end dialog-bottombar">
        <v-btn @click="saveDate" ref="selectDateBtn" variant="flat" color="info"
          >{{ $t('submit') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-card>
    <transfer-stepper ref="transferStepper" :items="stepperItems" @save="saveAll">
      <template v-slot:content_0>
        <v-row no-gutters>
          <data-table
            :hasSearch="true"
            :bigSearch="true"
            :searchLabel="$t('searchByAccountCodeAndName')"
            :searchItems="['name', 'fName', 'code', 'fCode']"
            :headers="detailedHeaders"
            :items="detailedAccounts"
            :clickableRow="true"
            :selectableRow="true"
            v-model:selectedRow="selectedDetailed"
            maxHeight="340px"
            :hasEnter="
              $refs.transferStepper?.tab == 0 &&
              !(selectMoeinAccountDialog.show || selectDateDialog.show)
            "
            @enterMethod="customNextTabFirst"
            :arrowCondition="
              $refs.transferStepper?.tab == 0 &&
              !selectDateDialog.show &&
              !selectMoeinAccountDialog.show
            "
          >
            <template v-slot:bigSearchToolbar>
              <v-row class="align-center" style="gap: 8px" no-gutters>
                <p>
                  {{
                    $t('date') +
                    ' ' +
                    (type == 0 ? $t('receive') : $t('pay')) +
                    ' : ' +
                    (date ? getPersianDate(date) : '')
                  }}
                </p>
                <v-btn
                  @click="editDate"
                  :icon="penIcon"
                  variant="text"
                  color="info"
                  size="x-small"
                />
              </v-row>
            </template>
            <template v-slot:column_index="{ entity }">
              {{ detailedAccounts.indexOf(entity) + 1 }}</template
            >
            <template v-slot:column_nationalCode="{ entity }">
              {{ entity.personType == 0 ? entity.nationalCode : entity.nationalId }}
            </template>
            <template v-slot:column_personType="{ entity }">
              {{ entity.personType ? (entity.personType == 0 ? $t('real') : $t('legal')) : '' }}
            </template>
            <template v-slot:column_cityProvince="{ entity }">
              {{ entity.city || entity.province ? entity.city + '/' + entity.province : '' }}
            </template>
          </data-table>
        </v-row>
      </template>
      <template v-slot:content_1>
        <v-row no-gutters class="align-center w-100">
          <p class="text-grey" style="max-width: calc(100% - 60px)">
            {{
              (type == 0 ? $t('payer') : $t('receiver')) +
              ` : ${selectedDetailed.fName} (${selectedDetailed.fCode})`
            }}
          </p>
          <v-btn
            v-if="issuerPart < 0"
            variant="text"
            class="ms-1"
            icon="mdi mdi-pencil-outline"
            size="x-small"
            color="primary"
            @click="() => $refs.transferStepper.setTab(0)"
          />
        </v-row>
        <data-table
          :hasSearch="true"
          :searchItems="['serialNumber', 'detailedAccount', 'amount', 'desc']"
          :headers="documentHeaders"
          :items="documents"
          maxHeight="340px"
        >
          <template v-slot:toolbar>
            <v-row class="ms-2" no-gutters>
              <v-btn
                @click="openRegisterDocument"
                variant="tonal"
                color="info"
                :prepend-icon="moneyPlusIcon"
                >{{ $t('registerNew') }}</v-btn
              >
              <v-btn
                @click="openAdvancedRegisterDocument"
                class="ms-2"
                variant="tonal"
                color="primary"
                :prepend-icon="selectDocumentsIcon"
                >{{ $t('advancedRegister') }}</v-btn
              >
            </v-row>
          </template>
          <template v-slot:column_index="{ entity }"> {{ documents.indexOf(entity) + 1 }}</template>
          <template v-slot:column_amount="{ entity }">
            {{ entity.amount.toLocaleString() + ` ${$t('rial')}` }}</template
          >
          <template v-slot:column_type="{ entity }">
            {{ getDocumentTypeName(entity.type) }}</template
          >
          <template v-slot:column_date="{ entity }">
            {{ getPersianDate(entity.date) }}
          </template>
          <template v-slot:column_status="{ entity }">
            <span
              v-if="entity.transactionResultCode && entity.transactionResultCode.length > 0"
              :class="entity.transactionResultCode == '00' ? 'text-success' : 'text-error'"
            >
              <v-icon :color="entity.transactionResultCode == '00' ? 'success' : 'error'">{{
                entity.transactionResultCode == '00' ? 'mdi-check-circle' : 'mdi-alert-circle'
              }}</v-icon>
              {{
                entity.transactionResultCode == '00'
                  ? $t('transactionSucceed')
                  : $t('transactionFailed')
              }}</span
            >
          </template>
          <template v-slot:column_operations="{ entity, index }">
            <v-row class="d-none d-md-flex justify-center" no-gutters>
              <v-tooltip
                v-if="entity && entity.transactionResultCode != '00' && entity.type == 6"
                :text="$t('repeatTransaction')"
              >
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi mdi-repeat"
                    variant="text"
                    color="primary"
                    size="x-small"
                    @click="repeatTransaction(entity, index)"
                  />
                </template>
              </v-tooltip>
              <v-tooltip v-if="entity" :text="$t('edit')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi mdi-pencil-outline"
                    variant="text"
                    color="info"
                    size="x-small"
                    @click="showDocumentEditDialog(entity)"
                  />
                </template>
              </v-tooltip>
              <v-tooltip :text="$t('delete')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    :icon="deleteIcon"
                    variant="text"
                    color="error"
                    size="x-small"
                    @click="() => (documents = documents.filter((a) => a.id != entity.id))"
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
                      v-if="entity"
                      density="compact"
                      @click.prevent="
                        () =>
                          (registerDocumentDialog = {
                            ...entity,
                            isEdit: true,
                            id: entity.id
                          })
                      "
                      :title="$t('edit')"
                    >
                      <template v-slot:prepend>
                        <v-icon icon="mdi mdi-pencil-outline" color="info" />
                      </template>
                    </v-list-item>
                    <v-list-item
                      density="compact"
                      @click.prevent="
                        () => (documents = documents.filter((a) => a.id != entity.id))
                      "
                      :title="$t('delete')"
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
      </template>
      <template v-slot:content_2>
        <v-row no-gutters class="align-center w-100">
          <p class="text-grey" style="max-width: calc(100% - 60px)">
            {{
              (type == 0 ? $t('payer') : $t('receiver')) +
              ` : ${selectedDetailed.fName} (${selectedDetailed.fCode})`
            }}
          </p>
          <v-btn
            variant="text"
            class="ms-2"
            icon="mdi mdi-pencil-outline"
            size="small"
            v-if="issuerpart < 0"
            @click="() => $refs.transferStepper.setTab(0)"
          />
        </v-row>
        <v-row no-gutters class="align-center w-100">
          <p class="text-grey">
            {{ $t('receivedDocuments') + ` : ${documents.length}` }}
          </p>
          <v-btn
            variant="text"
            class="ms-2"
            icon="mdi mdi-pencil-outline"
            size="small"
            @click="() => $refs.transferStepper.setTab(1)"
          />
        </v-row>
        <v-row no-gutters class="align-center mt-2 w-100">
          <v-form ref="wizardReviewForm" @submit.prevent="saveAll" style="width: 100%">
            <v-text-field
              variant="outlined"
              name="desc"
              autofocus
              density="compact"
              :label="$t('description')"
              v-model="desc"
          /></v-form>
        </v-row>
        <v-row no-gutters class="align-center w-100">
          <data-table
            :headers="documentHeaders.filter((a) => a.key != 'operations')"
            :items="documents"
            maxHeight="300px"
          >
            <template v-slot:column_index="{ entity }">
              {{ documents.indexOf(entity) + 1 }}</template
            >
            <template v-slot:column_amount="{ entity }">
              {{ entity.amount.toLocaleString() + ` ${$t('rial')}` }}</template
            >
            <template v-slot:column_date="{ entity }">
              {{ getPersianDate(entity.date) }}
            </template>
            <template v-slot:column_status="{ entity }">
              <span
                v-if="entity.transactionResultCode && entity.transactionResultCode.length > 0"
                :class="entity.transactionResultCode == '00' ? 'text-success' : 'text-error'"
              >
                <v-icon :color="entity.transactionResultCode == '00' ? 'success' : 'error'">{{
                  entity.transactionResultCode == '00' ? 'mdi-check-circle' : 'mdi-alert-circle'
                }}</v-icon>
                {{
                  entity.transactionResultCode == '00'
                    ? $t('transactionSucceed')
                    : $t('transactionFailed')
                }}</span
              >
            </template>
            <template v-slot:column_type="{ entity }">
              {{ getDocumentTypeName(entity.type) }}</template
            >
          </data-table>
        </v-row>
      </template>
    </transfer-stepper>
  </v-card>
</template>

<script src="./wizardScript.js"></script>

<style src="./wizardStyle.css"></style>
