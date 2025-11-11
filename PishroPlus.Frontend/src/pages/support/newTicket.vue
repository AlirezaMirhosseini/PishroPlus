<template>
  <v-card :title="$t('selectUnit')" min-height="100%">
    <v-card-text>
      <v-item-group v-model="selectedDepartment" mandatory selected-class="bg-primary">
        <v-row class="justify-space-evenly mt-4">
          <select-unit-item v-for="item in departments" :key="item.id" :icon="departmentIcon(item.id)" :title="item.title"
            :description="item.desc" :value="item.id" />
        </v-row>
      </v-item-group>
      <v-select class="mt-8" :label="$t('financialPeriod')" :items="financialPeriods" v-model="selectedFinancialPeriod"
        title="title" item-value="id" variant="outlined" hide-details></v-select>
      <p class="v-card-title mt-4">{{ $t('newTicket') }}</p>
      <v-form @submit.prevent="send" ref="sendTicketForm">
        <v-row class="flex-nowrap" no-gutters>
          <v-text-field variant="outlined" v-model="title" :label="$t('subject')" :rules="[
            (v) => {
              if (v) return true
              return $t('enterRequiredField')
            }
          ]" />
          <v-select :label="$t('Prioritization')" :items="PrioritizationList" v-model="selectedPriority" title="title"
            item-value="value" variant="outlined" density="compact" hide-details
            style="margin-inline-start: 10px; max-width: 150px; max-height: 76px"></v-select>
        </v-row>
        <attachable-text v-model:text="text" v-model:files="files" @send="send" :isInForm="true">
        </attachable-text>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import techSupport from '../../components/icons/Unit-TechSupport.vue'
import financial from '../../components/icons/Unit-Financial.vue'
import saleAdvisor from '../../components/icons/Unit-SaleAdvisor.vue'
import comments from '../../components/icons/Unit-Comments.vue'
import selectUnitItem from '../../components/ticketComponents/selectUnitItem.vue'
import TicketService from '../../../api/ticket/ticketService'
import financialPeriodService from '../../../api/financialPeriod/financialPeriodService'
import attachableText from '../../components/baseComponents/attachableText.vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
export default {
  data() {
    return {
      techSupportIcon: markRaw(techSupport),
      financialIcon: markRaw(financial),
      saleAdvisorIcon: markRaw(saleAdvisor),
      commentsIcon: markRaw(comments),
      companyInfo: JSON.parse(localStorage.getItem('com')),
      departments: [],
      selectedDepartment: null,
      financialPeriods: [],
      selectedFinancialPeriod: null,
      selectedPriority: 0,
      files: null,
      text: null,
      title: null
    }
  },
  computed: {
    PrioritizationList() {
      return [
        { title: this.$t('low'), value: 0 },
        { title: this.$t('average'), value: 1 },
        { title: this.$t('high'), value: 2 }
      ]
    },
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage'
    }),
    departmentIcon(id) {
      switch (id) {
        case '8d2a5207-8e65-42f4-b010-7030758ae8c1':
          return this.techSupportIcon
        case 'b54f8c5a-5863-48fe-88be-af8c8ac44b5d':
          return this.financialIcon
        case '0c99cc69-af3e-49f6-afbc-0689f24fa15e':
          return this.saleAdvisorIcon
        case 'd1529143-8f07-4277-962c-4a6c8dd1b3fa':
          return this.commentsIcon
        default:
          return this.techSupportIcon
      }
    },
    async getAllDepartments() {
      await TicketService.getDepartments().then((res) => {
        if (res.isSuccess) {
          this.departments = res.entities
          this.selectedDepartment = res?.entities[0]?.id
        } else this.setErrorMessage(res.message)
      })
    },
    async getAllFinancialPeriods() {
      await financialPeriodService.getAll().then((res) => {
        if (res.isSuccess) {
          this.financialPeriods = res.entities
          this.selectedFinancialPeriod = res?.entities[0]?.id
        } else this.setErrorMessage(res.message)
      })
    },
    async createTicket(request) {
      await TicketService.create(request).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('successfullSubmitTicketMessage'), 'success')
          this.$router.push('/support/ticket')
        } else this.setErrorMessage(res.message)
      })
    },
    async send() {
      const { valid } = await this.$refs.sendTicketForm.validate()
      if (valid) {
        await this.createTicket({
          entity: {
            ticketDepartmentId: this.selectedDepartment,
            title: this.title,
            text: this.text,
            financialPeriodId: this.selectedFinancialPeriod,
            companyId: this.companyInfo.i,
            priority: this.selectedPriority,
            files: this.files?.map((a) => ({ name: a.name, type: 3, fileBase64: a.base64 }))
          }
        })
      }
    }
  },
  async mounted() {
    await this.getAllDepartments()
    await this.getAllFinancialPeriods()
    if (this.$route.query.from && this.$route.query.from.length > 0) {
      this.selectedDepartment = this.departments[1]?.id
    } else {
      console.log('err')
    }
    if (!this.files) this.files = []
    if (this.screenshot)
      this.files.push({
        base64: this.screenshot,
        name: 'screenshot'
      })
  },
  components: {
    selectUnitItem,
    attachableText
  }
}
</script>

<style></style>
