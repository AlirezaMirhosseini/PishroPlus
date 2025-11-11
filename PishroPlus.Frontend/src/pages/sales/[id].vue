<template>
  <EditOrCreateInvoice
    :type="1"
    :isNewInvoice="isNewInvoice"
    :isBackInvoce="false"
    :id="currentId"
  />
</template>

<script>
import EditOrCreateInvoice from '../../components/invoiceComponents/editOrCreateInvoice.vue'
export default {
  components: {
    EditOrCreateInvoice
  },
  computed: {
    isNewInvoice() {
      let res = this.currentActiveTab.path === '/sales/new'
      return res
    },
    currentId() {
      if (this.currentActiveTab.params.id) return this.currentActiveTab.params.id
      else return null
    }
  }
}
</script>

<style></style>
