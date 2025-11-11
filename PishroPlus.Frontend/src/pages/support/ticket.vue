<template>
  <v-card>
    <v-card-title>
      <v-row class="justify-space-between px-4" no-gutters>
        <v-card-title>
          {{ $t('ticketsStatus') }}
        </v-card-title>
        <v-btn
          variant="flat"
          prepend-icon="mdi mdi-plus"
          color="primary"
          to="/support/ticket/newTicket"
          >{{ $t('newTicket') }}</v-btn
        >
      </v-row>
      <v-card-text>
        <v-row class="justify-space-evenly mt-4">
          <ticket-status-item
            :title="$t('opened')"
            color="#7D82E3"
            :icon="openedTicketIcon"
            :amount="tickets.filter((a) => a.status == 0).length"
          />
          <ticket-status-item
            :title="$t('waitingForReview')"
            color="#F2A578"
            :icon="waitingForReviewTicketIcon"
            :amount="tickets.filter((a) => a.status == 1).length"
          />
          <ticket-status-item
            :title="$t('answered')"
            color="#46BE91"
            :icon="answeredTicketIcon"
            :amount="tickets.filter((a) => a.status == 2).length"
          />
          <ticket-status-item
            :title="$t('closed')"
            color="#E45252"
            :icon="closedTicketIcon"
            :amount="tickets.filter((a) => a.status == 3).length"
          />
        </v-row>
        <v-row class="mt-12 align-center" no-gutters style="row-gap: 20px">
          <p class="me-3">{{ $t('ticketsIndex') }}</p>
          <v-text-field
            clearable
            class="me-3"
            density="compact"
            persistent-placeholder
            hide-details
            variant="outlined"
            v-model="search"
            :label="$t('search')"
            :placeholder="$t('ticketSearchPlaceHolder')"
            append-inner-icon="mdi mdi-magnify"
            style="max-width: 250px"
          />
          <transition name="filter" mode="out-in">
            <v-row class="me-2" no-gutters v-if="showFilters">
              <v-select
                class="me-3"
                :label="$t('financialPeriod')"
                :items="showingFinancialPeriods"
                v-model="selectedFinancialPeriod"
                title="title"
                item-value="id"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 150px"
              ></v-select>
              <v-select
                class="me-3"
                :label="$t('responseSection')"
                :items="showingDepartments"
                title="title"
                code
                item-value="id"
                v-model="selectedDepartment"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 150px"
              ></v-select>
              <v-select
                :label="$t('status')"
                :items="statuses"
                v-model="selectedStatus"
                title="title"
                item-value="status"
                variant="outlined"
                density="compact"
                hide-details
                style="max-width: 150px"
              ></v-select
            ></v-row>
          </transition>
          <v-btn
            :icon="showFilters ? 'mdi mdi-close' : 'mdi mdi-filter-variant'"
            class="rounded ms-auto"
            size="x-small"
            variant="tonal"
            @click="showFilters = !showFilters"
            :color="showFilters ? 'error' : 'primary'"
          />
        </v-row>
        <data-table
          class="mt-4"
          :headers="datatableHeader"
          :items="ticketsDataTable"
          @rowClick="goToTicket"
          :clickableRow="true"
        >
          <template v-slot:ce="{ entity }">
            <p :class="rowColor(entity.statusCode)">
              {{ entity.code }}
            </p>
          </template>
          <template v-slot:column_title="{ entity }">
            <p :class="rowColor(entity.statusCode)">
              {{ entity.title }}
            </p>
          </template>
          <template v-slot:column_updateDateTime="{ entity }">
            <p :class="rowColor(entity.statusCode)">
              {{ entity.updateDateTime }}
            </p>
          </template>
          <template v-slot:column_financialPeriodTitle="{ entity }">
            <p :class="rowColor(entity.statusCode)">
              {{ entity.financialPeriodTitle }}
            </p>
          </template>
          <template v-slot:column_departmentTitle="{ entity }">
            <p :class="rowColor(entity.statusCode)">
              {{ entity.departmentTitle }}
            </p>
          </template>
          <template v-slot:column_status="{ entity }">
            <p :class="statusColor(entity.statusCode)">
              {{ entity.status }}
            </p>
          </template>
          <template v-slot:column_operations="{ entity }">
            <div class="d-flex justify-center">
              <v-tooltip :text="$t('viewTicket')">
                <template v-slot:activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi mdi-eye"
                    variant="text"
                    color="info"
                    size="x-small"
                    @click="goToTicket(entity)"
                  />
                </template>
              </v-tooltip>
            </div>
          </template>
        </data-table>
      </v-card-text>
    </v-card-title>
  </v-card>
</template>

<script>
import DeleteIcon from '../../components/icons/Delete.vue'
import { markRaw } from 'vue'
import openedTicket from '../../components/icons/Ticket-Opened.vue'
import waitingForReviewTicket from '../../components/icons/Ticket-WaitingForReview.vue'
import answeredTicket from '../../components/icons/Ticket-Answered.vue'
import closedTicket from '../../components/icons/Ticket-Closed.vue'
import ticketStatusItem from '../../components/ticketComponents/ticketStatusItem.vue'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import utils from '../../../plugins/utils'
import TicketService from '../../../api/ticket/ticketService'
import financialPeriodService from '../../../api/financialPeriod/financialPeriodService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'

export default {
  data() {
    return {
      deleteIcon: markRaw(DeleteIcon),
      companyInfo: JSON.parse(localStorage.getItem('com')),
      search: null,
      tickets: [],
      departments: [],
      selectedDepartment: null,
      financialPeriods: [],
      selectedFinancialPeriod: null,
      selectedStatus: -1,
      openedTicketIcon: markRaw(openedTicket),
      waitingForReviewTicketIcon: markRaw(waitingForReviewTicket),
      answeredTicketIcon: markRaw(answeredTicket),
      closedTicketIcon: markRaw(closedTicket),
      showFilters: false,
      financialPeriod: 'همه',
      financialPeriodList: ['همه', '1401', '1402'],
      datatableHeader: [
        {
          title: this.$t('ticketCode'),
          align: 'center',
          sortable: true,
          key: 'code'
        },
        {
          title: this.$t('ticketTitle'),
          align: 'center',
          sortable: true,
          key: 'title'
        },
        {
          title: this.$t('dateTime'),
          align: 'center',
          sortable: true,
          key: 'updateDateTime',
          class: 'd-none d-sm-table-cell'
        },
        {
          title: this.$t('financialPeriod'),
          align: 'center',
          sortable: true,
          key: 'financialPeriodTitle',
          class: 'd-none d-md-table-cell'
        },
        {
          title: this.$t('answeringUnit'),
          align: 'center',
          sortable: false,
          key: 'departmentTitle',
          class: 'd-none d-md-table-cell'
        },
        {
          title: this.$t('lastStatus'),
          align: 'start',
          sortable: true,
          key: 'status'
        },
        {
          title: this.$t('operations'),
          align: 'start',
          sortable: true,
          key: 'operations',
          clickable: false
        }
      ]
    }
  },
  computed: {
    ticketsDataTable() {
      return this.tickets
        .map((a) => ({
          id: a.id,
          title: a.title,
          code: a.code,
          updateDateTime: utils.showDate(a.updateDateTime, true, true, false, false),
          financialPeriodTitle: a.financialPeriodTitle,
          departmentTitle: a.ticketDepartment.title,
          status: '● ' + utils.showTicketStatus(a.status).text,
          financialPeriodId: a.financialPeriodId,
          departmentId: a.ticketDepartment.id,
          statusCode: a.status
        }))
        .filter(
          (z) =>
            (!this.selectedFinancialPeriod ||
              z.financialPeriodId === this.selectedFinancialPeriod) &&
            (!this.selectedDepartment || z.departmentId === this.selectedDepartment) &&
            (this.selectedStatus == -1 || z.statusCode == this.selectedStatus) &&
            utils.filterBySearch(
              this.search,
              [
                'title',
                'code',
                'updateDateTime',
                'financialPeriodTitle',
                'departmentTitle',
                'status'
              ],
              z
            )
        )
    },
    showingDepartments() {
      return [
        ...[{ id: null, title: this.$t('all') }],
        ...this.departments?.map((a) => ({ id: a.id, title: a.title }))
      ]
    },
    showingFinancialPeriods() {
      return [...[{ id: null, title: this.$t('all') }], ...this.financialPeriods]
    },
    statuses() {
      return [
        { title: this.$t('all'), status: -1 },
        { title: this.$t('opened'), status: 0 },
        { title: this.$t('waitingForReview'), status: 1 },
        { title: this.$t('answered'), status: 2 },
        { title: this.$t('closed'), status: 3 }
      ]
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    rowColor(statusCode) {
      if (statusCode == 1 || statusCode == 2) return 'text-primary'
      return ''
    },
    statusColor(statusCode) {
      return `text-${utils.showTicketStatus(statusCode).color}`
    },
    goToTicket(value) {
      this.$router.push(`/support/ticket/${value.id}/${value.code}`)
    },
    async getAllTickets() {
      // console.log(this.companyInfo)
      await TicketService.getByCompanyId(this.companyInfo.i).then((resp) => {
        if (resp.isSuccess) {
          this.tickets = resp.entities
        } else this.setErrorMessage(resp.message)
      })
    },
    async getAllDepartments() {
      await TicketService.getDepartments().then((resp) => {
        if (resp.isSuccess) {
          this.departments = resp.entities
        } else this.setErrorMessage(resp.message)
      })
    },
    async getAllFinancialPeriods() {
      await financialPeriodService.getAll().then((res) => {
        if (res.isSuccess) {
          this.financialPeriods = res.entities
        } else this.setErrorMessage(res.message)
      })
    }
  },
  async mounted() {
    await this.getAllFinancialPeriods()
    await this.getAllDepartments()
    await this.getAllTickets()
  },
  components: {
    ticketStatusItem,
    dataTable
  }
}
</script>

<style>
.filter-enter-active {
  animation: filter-anim 0.3s ease-out;
}

.filter-leave-active {
  animation: filter-anim 0.3s ease-in reverse;
}

@keyframes filter-anim {
  from {
    opacity: 0;
    margin-inline-start: -260px;
  }

  to {
    opacity: 1;
  }
}
</style>
