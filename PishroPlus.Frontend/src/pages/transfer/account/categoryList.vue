<template>
  <v-card>
    <v-card-text class="px-0">
      <v-row no-gutters class="flex-column">
        <v-row class="align-center" no-gutters>
          <v-tabs v-model="tab" color="primary" align-tabs="start">
            <v-tab :value="4"
              ><v-icon
                class="me-2"
                size="25"
                :color="tab == 4 ? 'primary' : 'grey'"
                :icon="bankAccountIcon"
              />
              <p
                :class="tab == 4 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 4 ? 'bold' : 'unset'}`"
              >
                {{ $t('bank') }}
              </p></v-tab
            >
            <v-tab :value="5"
              ><v-icon
                class="me-2"
                size="25"
                :color="tab == 5 ? 'primary' : 'grey'"
                :icon="cashDeskIcon"
              />
              <p
                :class="tab == 5 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 5 ? 'bold' : 'unset'}`"
              >
                {{ $t('cashDesk') }}
              </p>
            </v-tab>
            <v-tab :value="6"
              ><v-icon
                class="me-2"
                size="25"
                :color="tab == 6 ? 'primary' : 'grey'"
                :icon="fundAccountIcon"
              />
              <p
                :class="tab == 6 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 6 ? 'bold' : 'unset'}`"
              >
                {{ $t('fund') }}
              </p>
            </v-tab>
          </v-tabs>
        </v-row>
        <v-window :touch="false" v-model="tab" style="width: 100%">
          <v-window-item :value="4">
            <detailed-group :family="4" />
          </v-window-item>
          <v-window-item :value="5">
            <detailed-group :family="5" />
          </v-window-item>
          <v-window-item :value="6">
            <detailed-group :family="6" />
          </v-window-item>
        </v-window>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import detailedGroup from '../../../components/accountsComponents/detailedGroup.vue'
import bankAccountIcon from '../../../components/icons/BankAccount.vue'
import fundAccountIcon from '../../../components/icons/FundAccount.vue'
import cashDeskIcon from '../../../components/icons/AccountingRegisterIncomesToCashDesk.vue'
export default {
  data() {
    return {
      tab: 4,
      bankAccountIcon: markRaw(bankAccountIcon),
      cashDeskIcon: markRaw(cashDeskIcon),
      fundAccountIcon: markRaw(fundAccountIcon)
    }
  },
  components: {
    detailedGroup
  }
}
</script>

<style></style>
