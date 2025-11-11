<template>
  <v-dialog persistent v-model="FPDialog.show" width="400px" max-width="100%">
    <v-card>
      <v-row class="align-center px-2 dialog-topbar no-border" no-gutters style="z-index: 2">
        <v-icon class="me-2" size="40" color="info" :icon="financialPeriodDialogIcon" />
        <div>
          <p style="font-weight: bold">
            {{ $t('financialPeriod') }}
          </p>
          <p class="text-grey pishro-caption">
            {{ $t('activeFinancialPeriod') + ': ' + FPDialog?.items.length }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn color="grey" icon="mdi mdi-close" @click="FPDialog.show = false" variant="text" />
        </div>
      </v-row>
      <v-card-text class="pt-0">
        <v-expand-transition>
          <v-row v-show="!editFpModel.show" no-gutters>
            <v-btn
              class="mb-3"
              prepend-icon="mdi mdi-plus"
              @click="showAddItem"
              variant="flat"
              color="info"
              >{{ this.$t('create') }}</v-btn
            >
            <v-col
              :class="[
                item.id == currentFP.id ? 'fp-item-container-selected' : 'pishro-border',
                'd-flex pa-2 mb-3 align-center fp-item-container'
              ]"
              v-for="item in FPDialog?.items"
              :key="item.id"
              @click="() => selectFP(item)"
              cols="12"
            >
              <div class="fp-icon-container d-flex pa-2">
                <v-icon size="30" :icon="financialPeriodIcon" />
              </div>

              <span class="ms-2">{{ item.title }}</span>
              <span class="text-success pishro-caption ms-2" v-if="item.id == currentFP.id">
                ● فعال است</span
              >
              <v-btn
                @click.stop="showEditItem(item)"
                class="ms-auto"
                variant="text"
                icon="mdi mdi-cog-outline"
                color="info"
              />
            </v-col>
          </v-row>
        </v-expand-transition>
        <v-expand-transition>
          <v-form v-show="editFpModel.show" @submit.prevent="saveEdit" ref="editFPForm">
            <v-row class="pishro-border pa-3" v-show="editFpModel.show" no-gutters>
              <v-col class="mb-3 d-flex align-center" cols="12">
                <div class="fp-icon-container d-flex pa-2">
                  <v-icon size="30" :icon="financialPeriodIcon" />
                </div>
                <p class="ms-3">{{ editFpModel.title }}</p>
                <v-btn
                  class="ms-auto"
                  @click="editFpModel.show = false"
                  variant="text"
                  color="grey"
                  >{{ $t('cancel') }}</v-btn
                >
              </v-col>
              <v-col class="mb-3 pe-0 pe-md-2" cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  density="compact"
                  v-model="editFpModel.title"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  :label="$t('title')"
                />
              </v-col>
              <v-col class="mb-3" cols="12" md="6">
                <v-text-field
                  variant="outlined"
                  hide-details
                  density="compact"
                  v-model="editFpModel.desc"
                  :label="$t('description')"
                />
              </v-col>
              <v-col class="mb-3" cols="12">
                <date-picker
                  :editable="true"
                  v-model="editFpModel.startDateTime"
                  @change="($event) => changeStartDateTime($event)"
                  format="YYYY-MM-DD"
                  display-format="jYYYY-jMM-jDD"
                  :label="$t('startDate')"
                  locale="fa,en"
                />
              </v-col>
              <v-col class="mb-3" cols="12">
                <date-picker
                  :editable="true"
                  v-model="editFpModel.endDateTime"
                  :min="editFpModel.startDateTime"
                  format="YYYY-MM-DD"
                  display-format="jYYYY-jMM-jDD"
                  :label="$t('endDate')"
                  locale="fa,en"
                />
              </v-col>
              <v-col class="d-flex justify-end" cols="12">
                <v-btn
                  v-if="editFpModel.id"
                  @click="deleteFPItem"
                  :prepend-icon="deleteIcon"
                  variant="text"
                  color="error"
                  >{{ $t('delete') }}</v-btn
                >
                <v-btn class="ms-2" variant="flat" color="info" type="submit">{{
                  $t('confirm')
                }}</v-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </v-dialog>
  <footer class="desktop-status-bar bg-primary">
    <div class="d-flex align-center h-100" style="gap: 5px">
      <v-icon size="20" :icon="calendarIcon" />
      <span class="footer-text">{{ persianDate }}</span>
      <hr style="height: 80%" />
      <v-icon size="20" :icon="clockIcon" />
      <span class="footer-text">{{ $t('userEntranceTime') }}:</span>
      <span class="footer-text">{{ time }}</span>
    </div>
    <div></div>
    <div class="d-flex align-center">
      <!-- <v-icon color="red"> mdi-account-badge</v-icon> -->
      <v-icon :color="isOnline ? 'green' : 'red'">{{
        isOnline ? 'mdi-wifi' : 'mdi-wifi-off'
      }}</v-icon>

      <v-btn
        class="financial-button footer-text"
        @click="openFPDialog"
        variant="text"
        :prepend-icon="financialPeriodIcon"
        >{{ currentFP.title }}</v-btn
      >
    </div>
  </footer>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import calendarIcon from '../icons/BottomBarCalendar.vue'
import clockIcon from '../icons/BottomBarClock.vue'
import financialPeriodIcon from '../icons/BottomBarFinancialPeriod.vue'
import financialPeriodDialogIcon from '../icons/FinancialPeriodDialog.vue'
import deleteIcon from '../icons/Delete.vue'
import financialPeriodService from '../../../api/financialPeriod/financialPeriodService'
import { markRaw } from 'vue'
import auth from '../../../plugins/auth'

export default {
  data() {
    return {
      isOnline: navigator.onLine,
      editFpModel: {
        show: false,
        title: null,
        desc: null,
        id: null,
        startDateTime: null,
        endDateTime: null
      },
      date: Date.now(),
      calendarIcon: markRaw(calendarIcon),
      deleteIcon: markRaw(deleteIcon),
      clockIcon: markRaw(clockIcon),
      financialPeriodIcon: markRaw(financialPeriodIcon),
      financialPeriodDialogIcon: markRaw(financialPeriodDialogIcon),
      FPDialog: {
        show: false
      }
    }
  },
  computed: {
    ...mapState(defaultStore, {
      companyDetails: 'companyDetails',
      currentFP: 'fp'
    }),
    persianDate() {
      var options = {
        weekday: 'short',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric'
      }
      return new Intl.DateTimeFormat(
        this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US',
        options
      ).format(this.date)
    },
    time() {
      var options = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: false
      }
      return new Intl.DateTimeFormat(
        this.$i18n.locale === 'fa' ? 'fa-IR' : 'en-US',
        options
      ).format(this.date)
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    updateOnlineStatus() {
      this.isOnline = navigator.onLine
    },
    async saveEdit() {
      const isVal = await this.$refs.editFPForm.validate()
      if (isVal.valid) {
        if (!this.editFpModel.startDateTime || !this.editFpModel.endDateTime)
          this.setErrorMessage(this.$t('pleaseEnterTheDate'))
        else {
          if (this.editFpModel.id) {
            await financialPeriodService
              .update({
                entity: {
                  id: this.editFpModel.id,
                  startDateTime: this.editFpModel.startDateTime,
                  endDateTime: this.editFpModel.endDateTime,
                  title: this.editFpModel.title,
                  desc: this.editFpModel.desc
                }
              })
              .then((res) => {
                if (res.isSuccess) {
                  this.openFPDialog()
                  this.setErrorMessage(this.$t('updateFPSuccessMessage'), 'success')
                } else this.setErrorMessage(res.message)
              })
          } else {
            await financialPeriodService
              .create({
                entity: {
                  id: this.editFpModel.id,
                  startDateTime: this.editFpModel.startDateTime,
                  endDateTime: this.editFpModel.endDateTime,
                  title: this.editFpModel.title,
                  desc: this.editFpModel.desc
                }
              })
              .then((res) => {
                if (res.isSuccess) {
                  this.openFPDialog()
                  this.setErrorMessage(this.$t('createFPSuccessMessage'), 'success')
                } else this.setErrorMessage(res.message)
              })
          }
        }
      }
    },
    deleteFPItem() {
      this.setWarningDialog(true, this.$t('deleteFP'), this.$t('confirmDeleteMessage'), () =>
        this.deleteFP()
      )
    },
    async deleteFP() {
      await financialPeriodService.delete({ id: this.editFpModel.id }).then((res) => {
        if (res.isSuccess) {
          this.closeWarning()
          this.openFPDialog()
          this.setErrorMessage(this.$t('deleteFPSuccessMessage'), 'success')
        } else this.setErrorMessage(res.message)
      })
    },
    async openFPDialog() {
      await financialPeriodService.getAll().then((res) => {
        if (res.isSuccess) {
          this.FPDialog = {
            show: true,
            items: res.entities
          }
          this.editFpModel = {
            show: false
          }
        }
      })
    },
    showEditItem(item) {
      this.editFpModel = {
        show: true,
        title: item.title,
        id: item.id,
        startDateTime: item.startDateTime,
        endDateTime: item.endDateTime
      }
    },
    showAddItem() {
      this.editFpModel = {
        show: true,
        title: null,
        id: null,
        startDateTime: null,
        endDateTime: null
      }
    },
    showTime() {
      // this.date = Date.now()
    },
    selectFP(item) {
      auth.setFP(item)
    },
    changeStartDateTime(value) {
      if (!this.editFpModel.endDateTime) {
        let newDate = new Date(value)
        newDate.setFullYear(newDate.getFullYear() + 1)
        this.editFpModel.endDateTime = newDate.toISOString().split('T')[0]
      }
    },
    onkeydown(e) {
      if (this.FPDialog?.show && e.keyCode == 27) this.FPDialog.show = false
    }
  },
  mounted() {
    document.addEventListener('keydown', this.onkeydown)
    setInterval(() => {
      this.showTime()
    }, 1000)
    window.addEventListener('online', this.updateOnlineStatus)
    window.addEventListener('offline', this.updateOnlineStatus)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },
  beforeUnmount() {
    window.removeEventListener('online', this.updateOnlineStatus)
    window.removeEventListener('offline', this.updateOnlineStatus)
  }
}
</script>

<style>
.financial-button .v-btn__content {
  font-size: 13px;
}

.financial-button .v-icon {
  --v-icon-size-multiplier: 0.8 !important;
}

.footer-text {
  font-size: 13px;
}

.fp-icon-container {
  border-radius: 50%;
  border: 1px solid #717171;
}

.fp-item-container-selected {
  border-radius: 5px;
  border: 1px solid #717171;
}

.fp-item-container {
  cursor: pointer;
  transition: 0.2s ease;
  transform: translate(0, 0);
}

.fp-item-container:hover {
}
</style>
