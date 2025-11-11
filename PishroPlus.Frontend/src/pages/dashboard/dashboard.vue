<template>
  <!-- <nav-tab
    :items="[$t('easyAccess')]"
    v-model:activeTab="activeTab"
    storeName="dashTab"
  ></nav-tab> -->
  <!-- <transition name="dash" mode="out-in">
    <div v-if="activeTab == 0">
      <float-menu @setDefault="setDefaultDashItem">
        <v-card width="180px">
          <p v-if="addItems?.length < 1" style="font-size: 13px; padding: 10px; text-align: center">
            {{ $t('thereIsNoItemsToAdd') }}
          </p>
          <v-btn
            v-else
            block
            variant="flat"
            v-for="item in addItems"
            :key="item.i"
            @click="addDashItem(item.i)"
            >{{ $t(item.i) }}
          </v-btn>
        </v-card>
      </float-menu>
      <grid-layout
        v-model:layout="layout"
        :responsive-layouts="presetLayout"
        @layout-updated="layoutUpdate"
        :row-height="31"
        :is-draggable="$vuetify.display.smAndDown ? false : true"
        :is-resizable="$vuetify.display.smAndDown ? false : true"
        style="margin: -10px"
      >
        <grid-item
          v-if="layout[0].show"
          :x="layout[0].x"
          :y="layout[0].y"
          :w="layout[0].w"
          :h="layout[0].h"
          :i="layout[0].i"
          :key="layout[0].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[0].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <v-row
                class="pa-1 px-3 rounded bg-surface h-100"
                no-gutters
                style="position: relative"
              >
                <p class="cost-and-benefit v-card-title">{{ $t('profitLoss') }}</p>
                <v-col class="dashboard-top-card" cols="6" md="3">
                  <div class="d-flex align-center">
                    <circle-progress
                      circleClass="ms-2"
                      color="rgb(var(--v-theme-success))"
                      percent="80"
                      icon="mdi mdi-arrow-top-right"
                    />
                    <p class="ms-2">{{ $t('purchase') }}</p>
                  </div>
                  <p class="amount">
                    <v-badge color="#DBFFF1" text-color="#46BE91" content="50%" inline></v-badge>
                    500.000.000 {{ $t('toman') }}
                  </p>
                </v-col>
                <v-col class="dashboard-top-card" cols="6" md="3">
                  <circle-progress
                    circleClass="ms-2"
                    color="rgb(var(--v-theme-warning))"
                    percent="80"
                    icon="mdi mdi-arrow-top-right"
                  />
                  <p class="ms-2">{{ $t('sale') }}</p>
                  <p class="amount">
                    <v-badge color="#DBFFF1" text-color="#46BE91" content="50%" inline></v-badge>
                    500.000.000 {{ $t('toman') }}
                  </p>
                </v-col>
                <v-col class="dashboard-top-card" cols="6" md="3">
                  <circle-progress
                    circleClass="ms-2"
                    color="rgb(var(--v-theme-info))"
                    percent="80"
                    icon="mdi mdi-arrow-bottom-left"
                  />

                  <p class="ms-2">{{ $t('incomes') }}</p>
                  <p class="amount">
                    <v-badge color="#FFE3E3" text-color="#BE0000" content="50%" inline></v-badge>
                    500.000.000 {{ $t('toman') }}
                  </p>
                </v-col>
                <v-col class="dashboard-top-card" cols="6" md="3">
                  <circle-progress
                    circleClass="ms-2"
                    color="#7D82E3"
                    percent="80"
                    icon="mdi mdi-arrow-bottom-left"
                  />

                  <p class="ms-2">{{ $t('costs') }}</p>
                  <p class="amount">
                    <v-badge color="#FFE3E3" text-color="#BE0000" content="50%" inline></v-badge>
                    500.000.000 {{ $t('toman') }}
                  </p>
                </v-col>
              </v-row>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[1].show"
          :x="layout[1].x"
          :y="layout[1].y"
          :w="layout[1].w"
          :h="layout[1].h"
          :i="layout[1].i"
          :key="layout[1].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[1].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <div class="h-100 pa-1 px-3 rounded bg-surface">
                <p class="v-card-title">{{ $t('supportTicket') }}</p>
                <div
                  style="
                    max-height: calc(100% - 52px);
                    overflow-y: scroll;
                    padding-inline-end: 5px;
                    margin-block-start: -8px;
                  "
                >
                  <ticket-card
                    v-for="i in 6"
                    :key="i"
                    title="014014121 مشکلات فنی"
                    description="توضیحات تیکت در این قسمت نمایش داده می شود."
                    date="1402/01/09"
                    :icon="SupportIcon"
                  />
                </div>
              </div>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[2].show"
          :x="layout[2].x"
          :y="layout[2].y"
          :w="layout[2].w"
          :h="layout[2].h"
          :i="layout[2].i"
          :key="layout[2].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[2].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <div class="h-100 pa-1 px-3 rounded bg-surface">
                <div class="d-flex justify-space-between">
                  <p class="v-card-title">{{ $t('accountBalance') }}</p>
                  <div class="d-flex align-center">
                    <p
                      :class="['chart-cycle', 'text-grey', selectedBalance === 1 ? 'selected' : '']"
                      @click="selectBalance(1)"
                    >
                      {{ $t('customers') }}
                    </p>
                    <p
                      :class="['chart-cycle', 'text-grey', selectedBalance === 2 ? 'selected' : '']"
                      @click="selectBalance(2)"
                    >
                      {{ $t('bank') }}
                    </p>
                    <p
                      :class="['chart-cycle', 'text-grey', selectedBalance === 3 ? 'selected' : '']"
                      @click="selectBalance(3)"
                    >
                      {{ $t('cashDesk') }}
                    </p>
                  </div>
                </div>
                <div class="d-flex justify-center" cols="12">
                  <v-btn-toggle
                    class="balance-btn-group my-1"
                    v-model="balanceToggle"
                    color="info"
                    density="compact"
                    style="height: 28px"
                  >
                    <v-btn class="balance-btn">{{ $t('debtors') }}</v-btn>
                    <v-btn class="balance-btn">{{ $t('creditors') }}</v-btn>
                  </v-btn-toggle>
                </div>
                <div class="d-flex justify-end" cols="12">
                  <p class="text-grey">175.000.000 {{ $t('toman') }}</p>
                </div>
                <div
                  cols="12"
                  style="
                    max-height: calc(100% - 110px);
                    overflow-y: scroll;
                    padding-inline-end: 5px;
                  "
                >
                  <account-balance-card
                    title="علی رفیعی فرد"
                    :image="avatarPic"
                    :amount="'25.000.000 ' + $t('toman')"
                  />
                  <account-balance-card
                    title="داود ابراهیمی"
                    :image="unknownPic"
                    :amount="'25.000.000 ' + $t('toman')"
                  />
                  <account-balance-card
                    title="صالح آرش"
                    :image="unknownPic"
                    :amount="'25.000.000 ' + $t('toman')"
                  />
                  <account-balance-card
                    title="محمدرضا متین"
                    :image="unknownPic"
                    :amount="'25.000.000 ' + $t('toman')"
                  />
                  <account-balance-card
                    title="سجاد آرش"
                    :image="unknownPic"
                    :amount="'25.000.000 ' + $t('toman')"
                  />
                </div>
              </div>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[3].show"
          :x="layout[3].x"
          :y="layout[3].y"
          :w="layout[3].w"
          :h="layout[3].h"
          :i="layout[3].i"
          :key="layout[3].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[3].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <v-row class="h-100 pa-1 px-3 rounded bg-surface" no-gutters>
                <v-col class="d-flex justify-space-between">
                  <p class="v-card-title">{{ $t('allIncome') }}</p>
                  <div class="d-flex align-center">
                    <p
                      :class="['chart-cycle', selectedCycle === 1 ? 'selected' : '']"
                      @click="selectCycle(1)"
                    >
                      {{ $t('all') }}
                    </p>
                    <p
                      :class="['chart-cycle', selectedCycle === 2 ? 'selected' : '']"
                      @click="selectCycle(2)"
                    >
                      {{ $t('threeMonth') }}
                    </p>
                    <p
                      :class="['chart-cycle', selectedCycle === 3 ? 'selected' : '']"
                      @click="selectCycle(3)"
                    >
                      {{ $t('sixMonth') }}
                    </p>
                    <p
                      :class="['chart-cycle', selectedCycle === 4 ? 'selected' : '']"
                      @click="selectCycle(4)"
                    >
                      {{ $t('oneYear') }}
                    </p>
                  </div>
                </v-col>
                <v-col cols="12">
                  <line-chart :chartData="chartData" :chartOptions="chartOptions" /></v-col
              ></v-row>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[4].show"
          :x="layout[4].x"
          :y="layout[4].y"
          :w="layout[4].w"
          :h="layout[4].h"
          :i="layout[4].i"
          :key="layout[4].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[4].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <v-row
                class="h-100 pa-1 px-3 rounded bg-surface"
                no-gutters
                style="align-content: baseline"
              >
                <p class="v-card-title">{{ $t('events') }}</p>
                <v-row class="event-inner-card w-100" dense>
                  <v-col v-for="event in dashboardData?.events" :key="event.id" cols="12">
                    <event-card
                      :title="event.title"
                      :date="showDate(event.dueDate, true)"
                      :description="event.message"
                    />
                  </v-col>
                </v-row>
              </v-row>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[5].show"
          :x="layout[5].x"
          :y="layout[5].y"
          :w="layout[5].w"
          :h="layout[5].h"
          :i="layout[5].i"
          :key="layout[5].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[5].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <div class="h-100 pa-1 px-3 rounded bg-surface">
                <p class="v-card-title">{{ $t('latePayingCustomers') }}</p>
                <div
                  class="mt-2"
                  style="
                    max-height: calc(100% - 52px);
                    overflow-y: scroll;
                    padding-inline-end: 5px;
                    margin-block-start: -8px;
                  "
                >
                  <delayed-purchase-card
                    v-for="i in 5"
                    :key="i"
                    :title="`مشتری شماره ${i}`"
                    description="25.000.000 تومان"
                    date="1402/01/01"
                    icon="mdi mdi-account-outline"
                  />
                </div>
              </div>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[6].show"
          :x="layout[6].x"
          :y="layout[6].y"
          :w="layout[6].w"
          :h="layout[6].h"
          :i="layout[6].i"
          :key="layout[6].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[6].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <div class="h-100 pa-1 px-3 rounded bg-surface">
                <p class="v-card-title">{{ $t('financialBill') }}</p>
                <v-row
                  dense
                  style="max-height: calc(100% - 50px); overflow-y: scroll; align-items: center"
                >
                  <v-col class="pishro-border rounded-lg" cols="12" md="6" lg="8">
                    <v-row class="pt-2 h-100" no-gutters>
                      <v-col class="px-2" cols="6" style="border-inline-end: 1px #e0e0e0 dashed">
                        <div class="d-flex" style="position: relative">
                          <v-progress-linear
                            color="info"
                            model-value="60"
                            location="start center"
                            style="width: 30px"
                            absolute
                            rounded
                            reverse
                          ></v-progress-linear>
                          <p class="ms-9">{{ $t('profitLossBill') }}</p>
                        </div>
                        <financial-statements-row
                          :title="$t('sale')"
                          :icon="saleIcon"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <financial-statements-row
                          :title="`(${$t('purchase')})`"
                          :icon="purchaseIcon"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <financial-statements-row
                          :title="`(${$t('startOfPeriodBalance')})`"
                          :icon="startBalanceIcon"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <financial-statements-row
                          :title="$t('endOfPeriodBalance')"
                          :icon="endBalanceIcon"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <v-icon class="w-100 justify-end" icon="mdi mdi-drag-horizontal-variant" />
                        <financial-statements-row
                          :title="$t('grossProfit')"
                          icon="mdi mdi-currency-usd"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <financial-statements-row
                          :title="$t('income')"
                          icon="mdi mdi-cash"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <financial-statements-row
                          :title="`(${$t('cost')})`"
                          icon="mdi mdi-hand-coin-outline"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                        <v-icon class="w-100 justify-end" icon="mdi mdi-drag-horizontal-variant" />
                        <financial-statements-row
                          :title="$t('netProfit')"
                          icon="mdi mdi-cash-multiple"
                          :value="`500.000.000 ${$t('toman')}`"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-col class="pt-0" cols="12" style="border-bottom: 1px #e0e0e0 dashed">
                          <div class="d-flex" style="position: relative">
                            <v-progress-linear
                              color="success"
                              model-value="60"
                              location="start center"
                              style="width: 30px"
                              absolute
                              rounded
                              reverse
                            ></v-progress-linear>
                            <p class="ms-9">{{ $t('accountingEquation') }}</p>
                          </div>
                          <financial-statements-row
                            :title="$t('asset')"
                            :icon="assetIcon"
                            :value="`500.000.000 ${$t('toman')}`"
                          />
                          <v-icon
                            class="w-100 justify-end"
                            icon="mdi mdi-drag-horizontal-variant"
                          />
                          <financial-statements-row
                            :title="$t('stockHoldersSalary')"
                            :icon="stockHolderIcon"
                            :value="`250.000.000 ${$t('toman')}`"
                          />
                          <financial-statements-row
                            :title="$t('debt')"
                            icon="mdi mdi-cash-100"
                            :value="`250.000.000 ${$t('toman')}`"
                          />
                        </v-col>
                        <v-col cols="12">
                          <div class="d-flex" style="position: relative">
                            <v-progress-linear
                              color="warning"
                              model-value="60"
                              location="start center"
                              style="width: 30px"
                              absolute
                              rounded
                              reverse
                            ></v-progress-linear>
                            <p class="ms-9">{{ $t('cashFlow') }}</p>
                          </div>
                          <financial-statements-row
                            :title="$t('operationalActivities')"
                            icon="mdi mdi-calculator"
                            :value="`0 ${$t('toman')}`"
                          />
                          <financial-statements-row
                            :title="$t('investmentActivities')"
                            icon="mdi mdi-clock-time-three-outline"
                            :value="`500.000.000 ${$t('toman')}`"
                          />
                          <financial-statements-row
                            :title="$t('financing')"
                            :icon="financingIcon"
                            :value="`500.000.000 ${$t('toman')}`"
                          />
                        </v-col>
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col
                    class="d-flex align-center justify-center"
                    cols="12"
                    md="6"
                    lg="4"
                    style="max-height: 270px; position: relative"
                  >
                    <doughnut-chart :chartData="doughnutChartData" :chartOptions="chartOptions" />
                    <div class="d-flex flex-column justify-center align-center inner-doughnut">
                      <p class="text-grey">{{ $t('sale') }}</p>
                      <p class="text-info" style="font-size: 40px; font-weight: bolder">100%</p>
                      <p class="text-grey" style="font-size: 13px">500.000.000 {{ $t('toman') }}</p>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </div>
          </div>
        </grid-item>
        <grid-item
          v-if="layout[7].show"
          :x="layout[7].x"
          :y="layout[7].y"
          :w="layout[7].w"
          :h="layout[7].h"
          :i="layout[7].i"
          :key="layout[7].i"
          drag-allow-from=".vue-draggable-handle"
          drag-ignore-from=".no-drag"
        >
          <div class="drag-parent">
            <div class="vue-draggable-handle">
              <v-icon icon="mdi mdi-cursor-move" />
            </div>
            <div class="vue-remove-handle" @click="removeDashItem(layout[7].i)">
              <v-icon icon="mdi mdi-minus-circle" />
            </div>
            <div class="no-drag">
              <div class="h-100 pa-1 px-3 rounded bg-surface">
                <p class="v-card-title">{{ $t('lastVouchers') }}</p>
                <div
                  style="
                    max-height: calc(100% - 52px);
                    overflow-y: scroll;
                    padding-inline-end: 5px;
                    margin-block-start: -8px;
                  "
                >
                  <ticket-card
                    v-for="voucher in dashboardData?.latestVouchers"
                    :key="voucher.id"
                    :title="$t('voucher') + ' ' + voucher.code"
                    :description="voucher.desc"
                    :date="showDate(voucher.date, false)"
                    :icon="HesabdariIcon"
                    :to="`/accounting/registerVoucher/view/${voucher.id}`"
                  />
                </div>
              </div>
            </div>
          </div>
        </grid-item>
      </grid-layout>
    </div>
  </transition> -->
  <transition name="dash" mode="out-in">
    <div v-if="activeTab == 1" class=" flex-grow-1 pa-2 pa-md-4 px-0 d-flex justify-center"
      style="min-height: calc(100% - 66px); border-radius: 5px; position: relative">
      <!-- <v-btn
        class="easy-access-setting-icon"
        icon="mdi mdi-cog"
        variant="text"
        color="primary"
        @click="openSettingDialog"
      ></v-btn> -->
      <v-dialog v-model="settingDialog.dialog" width="600px" max-width="100%">
        <v-card class="text-center py-1" :title="$t('easyAccessSetting')">
          <v-card-text class="px-1">
            <v-row>
              <v-col cols="6">
                <fieldset class="h-100">
                  <legend>نمایش داده نشود</legend>
                  <draggable class="list-group" group="setting" v-model="settingDialog.notShowItems" v-bind="dragOptions"
                    @start="drag = true" @end="drag = false" item-key="order">
                    <template #item="{ element }">
                      <li :key="element.id" class="list-group-item">
                        {{ element.title }}
                      </li>
                    </template>
                  </draggable>
                </fieldset>
              </v-col>
              <v-icon icon="mdi mdi-swap-horizontal"
                style="position: absolute; top: 50%; right: 50%; transform: translate(50%, -50%)"></v-icon>
              <v-col cols="6">
                <fieldset class="h-100">
                  <legend>نمایش داده شود</legend>
                  <draggable class="list-group" group="setting" v-model="settingDialog.showingItems" v-bind="dragOptions"
                    @start="drag = true" @end="drag = false" item-key="order">
                    <template #item="{ element }">
                      <li :key="element.id" class="list-group-item" style="position: relative">
                        <v-btn class="ea-delete-icon" icon="mdi mdi-close" variant="text" size="x-small"
                          @click="dontShowItem(index)"></v-btn>
                        {{ element.title }}
                      </li>
                    </template>
                  </draggable>
                </fieldset>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="error" variant="flat" @click="settingDialog.dialog = false">{{
              $t('cancel')
            }}</v-btn>
            <v-btn variant="flat" @click="saveArrange" :prepend-icon="saveIcon" color="info">{{
              $t('save')
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- <v-row justify="center" no-gutters dense style="align-content: baseline; max-width: 1000px">
        <easy-access-item v-for="(item, index) in eaItems" :key="index" :item="item" :hasOrder="true"
          @navigate="navigateToPage" />
      </v-row> -->
      <easy-access-container :items="eaItems" />
    </div>
  </transition>
</template>

<script>
import CircleProgress from '../../components/baseComponents/circleProgress.vue'
import LineChart from '../../components/baseComponents/lineChart.vue'
import NavTab from '../../components/baseComponents/navTab.vue'
import DoughnutChart from '../../components/baseComponents/doughnutChart.vue'
import EventCard from '../../components/dashboardComponents/dashboardEventCard.vue'
import AvatarPic from '../../assets/images/ali-rafie.png'
import UnknownPic from '../../assets/images/profile.png'
import AccountBalanceCard from '../../components/dashboardComponents/dashboardAccountBalanceCard.vue'
import TicketCard from '../../components/dashboardComponents/dashboardTicketCard.vue'
import DelayedPurchaseCard from '../../components/dashboardComponents/dashboardDelayedPurchaseCard.vue'
import FinancialStatementsRow from '../../components/dashboardComponents/financialStatementsRow.vue'
import FloatMenu from '../../components/dashboardComponents/floatMenu.vue'
import EasyAccessContainer from '../../components/easyAccessComponents/easyAccessContainer.vue'
import SupportIcon from '../../components/icons/Support.vue'
import HesabdariIcon from '../../components/icons/RightMenu-Hesabdari.vue'
// import SaleIcon from '../../components/icons/RightMenu-Sale.vue'
import PurchaseIcon from '../../components/icons/RightMenu-Purchase.vue'
import CheckOBankIcon from '../../components/icons/RightMenu-CheckOBank.vue'
import ProductionControlIcon from '../../components/icons/EasyAccess-Production-Control.vue'
import ReportsIcon from '../../components/icons/EasyAccess-Reports.vue'
import CommerceSystemIcon from '../../components/icons/EasyAccess-CommerceSystem.vue'
import StartBalanceIcon from '../../components/icons/Balance-StartOfPeriod.vue'
import StoreIcon from '../../components/icons/RightMenu-Anbar.vue'
import EndBalanceIcon from '../../components/icons/Balance-EndOfPeriod.vue'
import AssetIcon from '../../components/icons/Asset.vue'
import StockHolderIcon from '../../components/icons/StockHolder.vue'
import FinancingIcon from '../../components/icons/Financing.vue'
import saveIcon from '../../components/icons/Save.vue'
import personIcon from '../../components/icons/Persons.vue'
import { markRaw } from 'vue'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dashboardService from '../../../api/dashboard/dashboardService'
import auth from '../../../plugins/auth'
import utils from '../../../plugins/utils'
// import accountingEasyAccess from '../../components/accountsComponents/accountingEasyAccess.vue'
// import saleEasyAccess from '../../components/easyAccessComponents/salesEasyAccess.vue'
// import supportEasyAccess from '../../components/easyAccessComponents/supportEasyAccess.vue'
// import transferEasyAccess from '../../components/easyAccessComponents/transferEasyAccess.vue'
// import warehouseEasyAccess from '../../components/easyAccessComponents/warehouseEasyAccess.vue'
// import personsEasyAccess from '../../components/easyAccessComponents/personsEasyAccess.vue'
// import purchaseEasyAccess from '../../components/easyAccessComponents/purchaseEasyAccess.vue'
import treeViewIcon from '../../components/icons/AccountingTreeView.vue'
import reviewAccountsIcon from '../../components/icons/ReviewAccounts.vue'
import voucherJournalIcon from '../../components/icons/VoucherJournal.vue'
import registerDocumentIcon from '../../components/icons/AccountingRegisterDocument.vue'
import voucherListIcon from '../../components/icons/VoucherList.vue'
import NewReceiptIcon from '../../components/icons/NewReceipt.vue'
import ReceiptListIcon from '../../components/icons/ReceiptList.vue'
import receiveAndPayListIcon from '../../components/icons/ReceiveAndPayList.vue'
import receiveIcon from '../../components/icons/Receive.vue'
import bankAccountIcon from '../../components/icons/BankAccount.vue'
import accountingRegisterIncomesToCashDeskIcon from '../../components/icons/AccountingRegisterIncomesToCashDesk.vue'
import fundAccountIcon from '../../components/icons/FundAccount.vue'
import addPersonIcon from '../../components/icons/AddPerson.vue'
import personsIcon from '../../components/icons/Persons.vue'
import personsCategoryIcon from '../../components/icons/PersonCategory.vue'
import RightMenuHesabdari from '../../components/icons/RightMenu-Hesabdari.vue'
import RightMenuCheckOBank from '../../components/icons/RightMenu-CheckOBank.vue'
import AnbarIcon from '../../components/icons/RightMenu-Anbar.vue'
import SaleIcon from '../../components/icons/RightMenu-Sale.vue'

export default {
  data() {
    return {
      dashboardData: null,
      activeComponent: null,
      activeEasyAccessItem: null,
      eaItems: [
        {
          id: 0,
          order: 0,
          title: this.$t('accounting'),
          desc: this.$t('accountingDesc'),
          icon: markRaw(HesabdariIcon),
          children: {
            definitions: [
              {
                id: 0,
                order: 0,
                title: this.$t('accountingTreeView'),
                desc: this.$t('accountingDesc'),
                icon: markRaw(treeViewIcon),
                url: '/accounting/treeview'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('detailedAccountsTreeView'),
                desc: this.$t('accountingDesc'),
                icon: markRaw(treeViewIcon),
                url: '/accounting/detailedAccountsTreeView'
              },],
            reports: [
              {
                id: 0,
                order: 0,
                title: this.$t('reviewAccounts'),
                desc: this.$t('accountingDesc'),
                icon: markRaw(reviewAccountsIcon),
                url: '/accounting/reviewAccounts'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('voucherJournal'),
                desc: this.$t('accountingDesc'),
                icon: markRaw(voucherJournalIcon),
                url: '/accounting/voucherJournal'
              }
            ],
            vouchers: [
              {
                id: 0,
                order: 0,
                title: this.$t('registerAccountingVoucher'),
                desc: this.$t('accountingDesc'),
                icon: markRaw(registerDocumentIcon),
                url: '/accounting/registerVoucher/create/new'
              }, {
                id: 1,
                order: 1,
                title: this.$t('vouchersList'),
                desc: this.$t('accountingDesc'),
                icon: markRaw(voucherListIcon),
                url: '/accounting/vouchers'
              },
            ]
          },
        },
        {
          id: 0,
          order: 0,
          title: this.$t('sale'),
          desc: this.$t('salesInvoice'),
          icon: markRaw(SaleIcon),
          // url: '/sale',
          children: {
            invoice: [
              {
                id: 0,
                order: 0,
                title: this.$t('quickInvoice'),
                desc: this.$t('quickInvoice'),
                icon: 'mdi-note-plus-outline mdi-flip-h',
                url: '/sales/quick'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('newSale'),
                desc: this.$t('newSale'),
                icon: 'mdi-note-plus-outline mdi-flip-h',
                url: '/sales/new'
              },
              {
                id: 2,
                order: 2,
                title: this.$t('saleList'),
                desc: this.$t('saleList'),
                icon: 'mdi-note-multiple-outline mdi-flip-h',
                url: '/sales'
              }
            ]
          },
          click: false,
        },
        {
          id: 0,
          order: 0,
          title: this.$t('support'),
          desc: this.$t('support'),
          icon: markRaw(SupportIcon),
          children: {
            invoice: [
              {
                id: 0,
                order: 0,
                title: this.$t('tickets'),
                desc: this.$t('tickets'),
                icon: 'mdi mdi-ticket',
                url: '/support/ticket'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('newTickets'),
                desc: this.$t('newTickets'),
                icon: 'mdi mdi-ticket-account',
                url: '/support/ticket/newTicket'
              },
            ]
          },
          click: false
        },
        {
          id: 1,
          order: 1,
          title: this.$t('receiveAndPay'),
          desc: this.$t('checkAndBankDesc'),
          icon: markRaw(CheckOBankIcon),
          children: {
            account: [
              {
                id: 0,
                order: 0,
                title: this.$t('bank'),
                desc: this.$t('registerBankAccount'),
                icon: markRaw(bankAccountIcon),
                url: '/transfer/registerAccount/bank'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('cashDesk'),
                desc: this.$t('registerCashDeskAccount'),
                icon: markRaw(accountingRegisterIncomesToCashDeskIcon),
                url: '/transfer/registerAccount/cashBox'
              },
              {
                id: 2,
                order: 2,
                title: this.$t('fund'),
                desc: this.$t('registerFundAccount'),
                icon: markRaw(fundAccountIcon),
                url: '/transfer/registerAccount/fund'
              },
              {
                id: 3,
                order: 3,
                title: this.$t('checkBook'),
                desc: this.$t('checkBookList'),
                icon: 'mdi mdi-checkbook',
                url: '/transfer/checkBookList'
              },
            ],
            receive: [
              {
                id: 1,
                order: 1,
                title: this.$t('receiveList'),
                desc: this.$t('receiveAndPayList'),
                icon: markRaw(receiveAndPayListIcon),
                url: '/transfer/payOrReceiveList/receive'
              },
              {
                id: 2,
                order: 2,
                title: this.$t('addReceive'),
                desc: this.$t('receiveAndPayList'),
                icon: markRaw(receiveIcon),
                url: '/transfer/wizard/new/receive'
              }
            ],
            pay: [
              {
                id: 1,
                order: 1,
                title: this.$t('payList'),
                desc: this.$t('receiveAndPayList'),
                icon: markRaw(receiveAndPayListIcon),
                url: '/transfer/payOrReceiveList/pay'
              },
              {
                id: 2,
                order: 2,
                title: this.$t('addPay'),
                desc: this.$t('receiveAndPayList'),
                icon: markRaw(receiveIcon),
                iconStyle: 'transform: scaleY(-1)',
                url: '/transfer/wizard/new/pay'
              }
            ]
          },
          click: false
        },
        {
          id: 2,
          order: 2,
          title: this.$t('warehouseManagement'),
          desc: this.$t('storeDesc'),
          icon: markRaw(StoreIcon),
          children: {
            remittance: [
              {
                id: 0,
                order: 0,
                title: this.$t('remittanceList'),
                desc: this.$t('remittanceList'),
                icon: markRaw(ReceiptListIcon),
                url: '/warehouse/remittances'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('newRemittance'),
                desc: this.$t('newRemittance'),
                icon: markRaw(NewReceiptIcon),
                url: '/warehouse/remittances/new'
              }
            ],
            receiptItems: [
              {
                id: 0,
                order: 0,
                title: this.$t('receiptList'),
                desc: this.$t('receiptList'),
                icon: markRaw(ReceiptListIcon),
                url: '/warehouse/receipts'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('newReceipt'),
                desc: this.$t('newReceipt'),
                icon: markRaw(NewReceiptIcon),
                url: '/warehouse/receipts/new'
              }
            ],
            definitions: [
              {
                id: 0,
                order: 0,
                title: this.$t('warehouses'),
                desc: this.$t('warehouses'),
                icon: 'mdi mdi-warehouse',
                url: '/warehouse/list'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('products'),
                desc: this.$t('products'),
                icon: 'mdi mdi-shopping-outline',
                url: '/warehouse/products'
              },
              {
                id: 2,
                order: 2,
                title: this.$t('services'),
                desc: this.$t('services'),
                icon: 'mdi mdi-account-wrench-outline',
                url: '/warehouse/services'
              },
              {
                id: 3,
                order: 3,
                title: this.$t('productsAndServicesCategory'),
                desc: this.$t('productsAndServicesCategory'),
                icon: 'mdi mdi-shape-outline',
                url: '/warehouse/productsAndServicesCategory'
              }
            ]
          },
          click: false
        },
        {
          id: 3,
          order: 3,
          title: this.$t('persons'),
          desc: this.$t('personsDesc'),
          icon: markRaw(personIcon),
          children: {
            definitions: [
              {
                id: 0,
                order: 0,
                title: this.$t('addPerson'),
                desc: this.$t('addPerson'),
                icon: markRaw(addPersonIcon),
                url: '/persons/new'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('personsList'),
                desc: this.$t('personsList'),
                icon: markRaw(personsIcon),
                url: '/persons/list'
              },
              {
                id: 2,
                order: 2,
                title: this.$t('personsCategory'),
                desc: this.$t('personsCategory'),
                icon: markRaw(personsCategoryIcon),
                url: '/persons/category'
              }
            ]
          },
          click: false
        },
        {
          id: 4,
          order: 4,
          title: this.$t('settings'),
          desc: this.$t('settings'),
          icon: 'mdi mdi-cog',
          children: {
            user: [
              {
                title: this.$t('users'),
                icon: 'mdi mdi-account-supervisor',
                url: '/setting/users',
                id: 2
              },],
            settings: [
              {
                title: this.$t('generalSettings'),
                icon: 'mdi mdi-cog-outline',
                url: '/setting/generalSetting',
                id: 3
              },
              {
                title: this.$t('accountingSetting'),
                icon: markRaw(RightMenuHesabdari),
                url: '/setting/accountingSetting',
                id: 4
              },
              {
                title: this.$t('receiveAndPaySetting'),
                icon: markRaw(RightMenuCheckOBank),
                url: '/setting/receiveAndPaySetting',
                id: 5
              },
              {
                title: this.$t('remittanceOrReceiptSetting'),
                icon: markRaw(AnbarIcon),
                url: '/setting/remittanceOrReceiptSetting',
                id: 6
              },
              {
                title: this.$t('salesSetting'),
                icon: markRaw(SaleIcon),
                url: '/setting/salesSetting',
                id: 7
              },
              {
                title: this.$t('templateSetting'),
                icon: 'mdi mdi-brush-variant',
                url: '/setting/templateSetting',
                id: 8
              },
              {
                title: this.$t('shopSetting'),
                icon: 'mdi mdi-store',
                url: '/setting/shopSetting',
                id: 9
              },
            ]
          },
          click: false
        },
        {
          id: 5,
          order: 5,
          title: this.$t('purchase'),
          desc: this.$t('purchase'),
          // icon: markRaw(SaleIcon),
          icon: 'mdi-basket-plus-outline',
          children: {
            definitions: [
              {
                id: 0,
                order: 0,
                title: this.$t('newPurchase'),
                desc: this.$t('newPurchase'),
                icon: ' mdi-note-plus-outline mdi-flip-h',
                url: '/purchase/newPurchase'
              },
              {
                id: 1,
                order: 1,
                title: this.$t('purchaseInvoices'),
                desc: this.$t('purchaseInvoices'),
                icon: 'mdi-note-multiple-outline mdi-flip-h',
                url: '/purchase/purchaseInvoices'
              },
            ]
          },
          click: false
        }
      ],
      eaItemsNotShow: [],
      drag: false,
      settingDialog: {
        dialog: false,
        showingItems: [],
        notShowItems: []
      },
      activeTab: 1,
      avatarPic: AvatarPic,
      unknownPic: UnknownPic,
      SupportIcon: markRaw(SupportIcon),
      HesabdariIcon: markRaw(HesabdariIcon),
      saleIcon: markRaw(SaleIcon),
      purchaseIcon: markRaw(PurchaseIcon),
      startBalanceIcon: markRaw(StartBalanceIcon),
      endBalanceIcon: markRaw(EndBalanceIcon),
      assetIcon: markRaw(AssetIcon),
      stockHolderIcon: markRaw(StockHolderIcon),
      financingIcon: markRaw(FinancingIcon),
      CheckOBankIcon: markRaw(CheckOBankIcon),
      StoreIcon: markRaw(StoreIcon),
      ProductionControlIcon: markRaw(ProductionControlIcon),
      CommerceSystemIcon: markRaw(CommerceSystemIcon),
      saveIcon: markRaw(saveIcon),
      balanceToggle: 0,
      selectedCycle: 1,
      selectedBalance: 1,
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
      purchaseData: [40, 39, 10, 40, 39, 80, 40, 32, 67, 83, 12, 50],
      saleData: [30, 80, 20, 15, 12, 100, 60, 12, 34, 68, 12, 45],
      chartOptions: {
        responsive: true,
        maintainAspectRatio: false
      },
      doughnutChartData: {
        labels: [
          'مولفه یک',
          'مولفه دو',
          'مولفه سه',
          'مولفه چهار',
          'مولفه پنج',
          'مولفه شش',
          'مولفه هفت'
        ],
        datasets: [
          {
            backgroundColor: [
              '#FF88CF',
              '#FF7272',
              '#46BE91',
              '#F2A578',
              '#588BFF',
              '#7D82E3',
              '#FFDA55'
            ],
            data: [8, 20, 20, 10, 12, 12, 18],
            borderRadius: 50,
            borderColor: 'transparent',
            spacing: 10,
            cutout: '75%'
          }
        ]
      }
    }
  },
  computed: {
    ...mapState(defaultStore, {
      presetLayout: 'dashItems'
    }),
    navTabTitles() {
      return Object.keys(this.activeEasyAccessItem.children).map(x => {
        return this.$t(x)
      })
    },
    activeEasyAccessItemSubItems() {

    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    addItems() {
      return this.layout.filter((a) => !a.show)
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
    },
    chartData() {
      return {
        labels: this.chartLabels,
        datasets: [
          {
            label: this.$t('sale'),
            borderColor: '#F2A578',
            pointBackgroundColor: '#F2A578',
            backgroundColor: '#F2A578',
            data: this.purchaseData,
            fill: false,
            tension: 0.3,
            pointRadius: 1
          },
          {
            label: this.$t('purchase'),
            borderColor: '#46be91',
            pointBackgroundColor: '#46be91',
            backgroundColor: '#46be91',
            data: this.saleData,
            fill: false,
            tension: 0.3,
            pointRadius: 1
          }
        ]
      }
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
    setActiveComponent(component) {
      this.activeComponent = component; // Set the active component
    },
    // navigateToPage(pageUrl) {
    //   this.$router.push(pageUrl);
    //   console.log(pageUrl); // Use Vue Router to navigate
    // },
    layoutUpdate(value) {
      this.setDashItem(this.$vuetify.display.name, this.layout)
    },
    showDate(date, showDayOfWeekName) {
      return utils.showDate(date, false, showDayOfWeekName)
    },
    saveArrange() {
      this.settingDialog.showingItems.forEach((item, index) => {
        item.order = index
      })
      this.eaItems = this.settingDialog.showingItems
      this.eaItemsNotShow = this.settingDialog.notShowItems
      this.settingDialog.dialog = false
    },
    dontShowItem(index) {
      this.settingDialog.notShowItems.push(...this.settingDialog.showingItems.splice(index, 1))
    },
    openSettingDialog() {
      this.settingDialog = {
        dialog: true,
        showingItems: [...this.eaItems],
        notShowItems: [...this.eaItemsNotShow]
      }
    },
    addDashItem(id) {
      this.addDashboardItem(this.$vuetify.display.name, id)
    },
    selectBalance(num) {
      this.selectedBalance = num
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
    // async getData() {
    //   await dashboardService.getData().then((res) => {
    //     if (res.isSuccess) {
    //       if (!auth.getFP()) auth.setFP(res.entity.defaultFinancialPeriod)
    //       this.dashboardData = res.entity
    //     } else this.setErrorMessage(res.message)
    //   })
    // },
    handleItemClick(item) {
      this.activeEasyAccessItem = { ...item }
      console.log(activeEasyAccessItem);
    }
  },
  async mounted() {
    // await this.getData()
  },
  created() {
    // this.activeTab = localStorage?.getItem('dashTab') ?? 0
  },
  components: {
    CircleProgress,
    LineChart,
    EventCard,
    AccountBalanceCard,
    TicketCard,
    DelayedPurchaseCard,
    DoughnutChart,
    FinancialStatementsRow,
    GridLayout,
    GridItem,
    FloatMenu,
    NavTab,
    EasyAccessContainer
  }
}
</script>
<style>
.vgl-layout {
  --vgl-placeholder-bg: rgb(var(--v-theme-primary)) !important;
}

.drag-parent {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: end;
}

.vgl-item .no-drag {
  width: 100%;
  height: 100%;
}

.vue-remove-handle {
  position: absolute;
  top: 5px;
  margin-inline-end: 35px;
  font-size: 13px;
  cursor: pointer;
  z-index: 1;
  color: rgb(var(--v-theme-error));
  opacity: 0;
  transition: 0.5s ease;
}

.drag-parent:hover .vue-remove-handle {
  opacity: 1;
}

.vue-draggable-handle {
  position: absolute;
  top: 5px;
  margin-inline-end: 5px;
  font-size: 13px;
  cursor: move;
  z-index: 1;
  color: rgb(var(--v-theme-primary));
  opacity: 0;
  transition: 0.5s ease;
}

.drag-parent:hover .vue-draggable-handle {
  opacity: 1;
}

.vgl-item__resizer:before {
  border-style: solid !important;
  border-width: 0 0 10px 10px !important;
  border-color: transparent transparent rgb(var(--v-theme-primary)) !important;
  inset: 0 !important;
}

.vgl-item__resizer {
  opacity: 0;
  transition: 0.5s ease;
}

.vgl-item--resizable:hover .vgl-item__resizer {
  opacity: 1;
}

.inner-doughnut {
  position: absolute;
  border-radius: 50%;
  aspect-ratio: 1;
  height: 150px;
}

.balance-btn {
  transform: skewX(-20deg);
  background-color: rgb(var(--v-theme-container)) !important;
}

.balance-btn-group .balance-btn:first-child {
  margin-inline-start: -15px;
  padding-inline-start: 30px;
}

.balance-btn-group .balance-btn:last-child {
  margin-inline-end: -15px;
  padding-inline-end: 30px;
}

.balance-btn .v-btn__content {
  transform: skewX(20deg);
}

.event-inner-card {
  max-height: calc(100% - 42px);
  overflow-y: scroll;
}

.chart-cycle {
  font-size: 11px;
  margin-inline: 5px;
  cursor: pointer;
  user-select: none;
}

.chart-cycle.selected {
  color: #588bff !important;
}

.cost-and-benefit {
  position: absolute;
  top: 0;
  margin-inline-start: 4px;
}

.amount {
  position: absolute;
  margin-inline-start: -10px;
  bottom: 5px;
  width: 100%;
  text-align: end;
}

.dashboard-top-card {
  display: flex;
  align-items: center;
  position: relative;
}

.dashboard-top-card:not(:last-child) {
  border-inline-end: #e0e0e0 1px solid;
}

.dash-enter-active {
  animation: dash-anim 0.3s ease-out;
}

.dash-enter-from {
  opacity: 0;
  margin-top: 100px;
}

.dash-leave-active {
  animation: dash-anim 0.3s ease-in reverse;
}

.dash-leave-to {
  opacity: 1;
  margin-top: 0px;
}

.easy-access-setting-icon {
  position: absolute !important;
  top: -50px;
  left: 0px;
}

.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}

.list-group {
  height: 100%;
}

.list-group-item {
  cursor: move;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  margin-block: 8px;
  padding-inline: 15px;
  list-style-type: decimal;
  user-select: none;
  text-align: center;
  padding-block: 5px;
}

.list-group-item i {
  cursor: pointer;
}

.ea-delete-icon {
  position: absolute !important;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

@keyframes dash-anim {
  from {
    opacity: 0;
    margin-top: 100px;
  }

  to {
    opacity: 1;
    margin-top: 0px;
  }
}

@media only screen and (max-width: 960px) {
  .vue-draggable-handle {
    display: none;
  }

  .vue-remove-handle {
    display: none;
  }

  .dashboard-top-card:nth-child(3) {
    border-inline-end: none;
  }

  .dashboard-top-card:nth-child(2),
  .dashboard-top-card:nth-child(3) {
    border-bottom: #e0e0e0 1px solid;
  }
}</style>
