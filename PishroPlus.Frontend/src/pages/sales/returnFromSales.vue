<template>
  <EditOrCreateInvoice
    v-if="selectedInvoice"
    :type="1"
    :isNewInvoice="false"
    :isBackInvoce="true"
    :id="selectedInvoice"
    @resetInvoice="() => (selectedInvoice = null)"
  />
  <div class="d-flex justify-center align-center" style="height: 100%" v-else>
    <v-form
      @submit.prevent="handleSearchInvoice"
      ref="searchInvoiceForm"
      class="pishro-border bg-surface pa-8 px-12 d-flex flex-column"
      style="gap: 20px"
    >
      <p>{{ $t('enterTheInvoiceNumber') }} :</p>
      <v-text-field
        v-model="invoiceNumber"
        variant="outlined"
        density="compact"
        :label="$t('invoiceNumber')"
        :rules="[
          (v) => {
            if (v) return true
            return $t('enterRequiredField')
          }
        ]"
        autofocus
      />
      <v-btn type="submit" color="primary">{{ $t('confirm') }}</v-btn>
    </v-form>
  </div>
</template>

<script>
import EditOrCreateInvoice from '../../components/invoiceComponents/editOrCreateInvoice.vue'
import invoiceService from '../../../api/invoice/invoiceService.js'

export default {
  data() {
    return {
      invoiceNumber: '',
      selectedInvoice: null
    }
  },
  components: {
    EditOrCreateInvoice
  },
  methods: {
    async handleSearchInvoice() {
      const { valid } = await this.$refs.searchInvoiceForm.validate()
      if (valid) {
        const res = await invoiceService.GetByCode(this.invoiceNumber)
        if (res.isSuccess) this.selectedInvoice = res.value
      }
    }
  },
  mounted() {
    if (this.currentActiveTab.params.id == 'selectInvoice') this.selectedInvoice = null
    else this.selectedInvoice = this.currentActiveTab.params.id
  }
}
</script>

<style></style>
