<template>
    <v-row dense>
    <v-col order="0" cols="12">
      <v-row class="pa-1 px-3 rounded bg-white" no-gutters style="position: relative">
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
            color="rgb(var(--v-theme-primary))"
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
    </v-col>
    <v-col order="1" cols="12" lg="6">
      <v-row dense>
        <v-col cols="12" md="6" lg="12">
          <v-row class="pa-1 px-3 rounded bg-white" no-gutters>
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
        </v-col>
        <v-col cols="12" md="6" lg="12">
          <v-row class="h-100 pa-1 px-3 rounded bg-white" no-gutters>
            <v-col>
              <p class="v-card-title">{{ $t('events') }}</p>
              <v-row class="mt-2 event-inner-card" dense>
                <v-col cols="12" lg="6">
                  <event-card
                    title="چک خرید رم کامپیوتر"
                    date="سه شنبه 1402/06/27"
                    description="پرداختی چک در سر رسید 27 فروردین بانک ملی حساب علی رفیعی فرد"
                  />
                </v-col>

                <v-col cols="12" lg="6">
                  <event-card
                    title="اجاره خانه"
                    date="سه شنبه 1402/06/27"
                    description="پرداخت اجاره خانه در سر رسید 20 فروردین"
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <event-card
                    title="پرداخت قسط سوم مغازه"
                    date="سه شنبه 1402/06/27"
                    description="پرداخت قسط در سر رسید 27 مرداد بانک ملی حساب علی رفیعی فرد"
                  />
                </v-col>
                <v-col cols="12" lg="6">
                  <event-card title="انبارگردانی فروردین ماه" date="سه شنبه 1402/06/27" />
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-col>
    <v-col order="2" cols="12" md="6" lg="3">
      <div class="h-100 pa-1 px-3 rounded bg-white">
        <div class="d-flex justify-space-between">
          <p class="v-card-title">{{ $t('accountBalance') }}</p>
          <div class="d-flex align-center">
            <p
              :class="['chart-cycle', selectedBalance === 1 ? 'selected' : '']"
              @click="selectBalance(1)"
            >
              {{ $t('customers') }}
            </p>
            <p
              :class="['chart-cycle', selectedBalance === 2 ? 'selected' : '']"
              @click="selectBalance(2)"
            >
              {{ $t('bank') }}
            </p>
            <p
              :class="['chart-cycle', selectedBalance === 3 ? 'selected' : '']"
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
        <div cols="12" style="max-height: 295px; padding-inline-end: 5px">
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
    </v-col>
    <v-col order="3" cols="12" md="6" lg="3">
      <div class="h-100 pa-1 px-3 rounded bg-white">
        <p class="v-card-title">{{ $t('supportTicket') }}</p>
        <div class="mt-2" style="max-height: 340px; padding-inline-end: 5px">
          <ticket-card
            v-for="i in 5"
            :key="i"
            title="014014121 مشکلات فنی"
            description="توضیحات تیکت در این قسمت نمایش داده می شود."
            date="1402/01/09"
            :icon="SupportIcon"
          />
        </div>
      </div>
    </v-col>
    <v-col order="4" cols="12" md="6" lg="3">
      <div class="h-100 pa-1 px-3 rounded bg-white">
        <p class="v-card-title">{{ $t('lastVouchers') }}</p>
        <div class="mt-2" style="max-height: 310px; padding-inline-end: 5px">
          <ticket-card
            v-for="i in 5"
            :key="i"
            title="014014121 سند شماره 1"
            description="توضیحات سند در این قسمت نمایش داده می شود."
            date="1402/01/09"
            :icon="HesabdariIcon"
          />
        </div>
      </div>
    </v-col>

    <v-col order="5" order-md="6" order-lg="5" cols="12" lg="6">
      <div class="h-100 pa-1 px-3 rounded bg-white">
        <p class="v-card-title">{{ $t('financialBill') }}</p>
        <v-row dense>
          <v-col class="pishro-border rounded-lg mt-3" cols="12" md="6" lg="8">
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
                <v-col cols="12" style="border-bottom: 1px #e0e0e0 dashed">
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
                  <v-icon class="w-100 justify-end" icon="mdi mdi-drag-horizontal-variant" />
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
            style="max-height: 100%; position: relative"
          >
            <doughnut-chart :chartData="doughnutChartData" :chartOptions="chartOptions" />
            <div class="d-flex flex-column justify-center align-center inner-doughnut">
              <p class="text-grey">{{ $t('sale') }}</p>
              <p class="text-info" style="font-size: 40px; font-weight: bolder">100%</p>
              <p style="font-size: 13px">500.000.000 {{ $t('toman') }}</p>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-col>

    <v-col order="6" order-md="5" order-lg="6" cols="12" md="6" lg="3">
      <div class="h-100 pa-1 px-3 rounded bg-white">
        <p class="v-card-title">{{ $t('latePayingCustomers') }}</p>
        <div class="mt-2" style="max-height: 310px; padding-inline-end: 5px">
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
    </v-col>
  </v-row>
  
</template>

<script>
export default {

}
</script>

<style>

</style>