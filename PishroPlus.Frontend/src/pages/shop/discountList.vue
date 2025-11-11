<template>
  <v-card>
    <v-card-text>
      <data-table
        :headers="headers"
        :items="discounts"
        :hasSearch="true"
        :searchItems="['name', 'adminComment', 'couponCode', 'description']"
        :clickableRow="true"
      >
        <template v-slot:toolbar>
          <v-row class="ps-2 ga-2" no-gutters>
            <v-btn to="/shop/discount/new" prepend-icon="mdi-plus" variant="tonal" color="info">
              {{ $t('addDiscount') }}
            </v-btn>
            <v-spacer></v-spacer>
            <date-picker
              v-model="fromDate"
              @change="getDiscountList"
              format="YYYY-MM-DD"
              display-format="jYYYY-jMM-jDD"
              :label="$t('fromDate')"
              locale="fa,en"
            />
            <date-picker
              v-model="toDate"
              @change="getDiscountList"
              format="YYYY-MM-DD"
              display-format="jYYYY-jMM-jDD"
              :label="$t('toDate')"
              locale="fa,en"
            />
            <v-select
              hide-details
              variant="outlined"
              density="compact"
              :loading="false"
              style="max-width: 250px"
              :items="statusList"
              item-value="id"
              item-title="title"
              v-model="selectStatusFilter"
              @update:modelValue="getDiscountList"
            ></v-select>
          </v-row>
        </template>
        <template v-slot:column_index="{ index }">
          {{ index + 1 }}
        </template>
        <template v-slot:column_discountType="{ entity }">
          <v-chip 
            :color="entity.usePercentage ? 'success' : 'info'" 
            size="small"
            variant="tonal"
          >
            {{ entity.usePercentage ? $t('percentage') : $t('amount') }}
          </v-chip>
        </template>
        <template v-slot:column_discountValue="{ entity }">
          <span v-if="entity.usePercentage">
            {{ entity.discountPercentage }}%
          </span>
          <span v-else>
            {{ entity.discountAmount?.toLocaleString() }}
          </span>
        </template>
        <template v-slot:column_couponCode="{ entity }">
          <v-chip 
            v-if="entity.requiresCouponCode && entity.couponCode"
            color="warning" 
            size="small"
            variant="outlined"
          >
            {{ entity.couponCode }}
          </v-chip>
          <span v-else-if="!entity.requiresCouponCode" class="text-grey-500">
            {{ $t('noCouponRequired') }}
          </span>
          <span v-else class="text-grey-500">-</span>
        </template>
        <template v-slot:column_startDate="{ entity }">
          <span v-if="entity.startDateUtc">
            {{ getPersianDate(entity.startDateUtc) }}
          </span>
          <span v-else class="text-grey-500">-</span>
        </template>
        <template v-slot:column_endDate="{ entity }">
          <span v-if="entity.endDateUtc">
            {{ getPersianDate(entity.endDateUtc) }}
          </span>
          <span v-else class="text-grey-500">-</span>
        </template>
        <template v-slot:column_isActive="{ entity }">
          <v-chip 
            :color="entity.isActive ? 'success' : 'error'" 
            size="small"
            variant="tonal"
          >
            {{ entity.isActive ? $t('active') : $t('inActive') }}
          </v-chip>
        </template>
        <template v-slot:column_operations="{ entity }">
          <v-row class="d-none d-md-flex justify-center" style="flex-wrap: nowrap;">
            <v-tooltip :text="$t('view')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  variant="text"
                  color="info"
                  size="x-small"
                  :to="`/shop/discount/${entity.id}?action=view`"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="$t('edit')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi mdi-square-edit-outline"
                  variant="text"
                  color="info"
                  size="x-small"
                  :to="`/shop/discount/${entity.id}`"
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
                  @click="confirmDelete(entity)"
                />
              </template>
            </v-tooltip>
          </v-row>
        </template>
      </data-table>
    </v-card-text>
  </v-card>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import dataTable from '../../components/baseComponents/datatable/datatable.vue'
import discountService from '../../../api/discount/discountService'
import DeleteIcon from '../../components/icons/Delete.vue'
import utils from '../../../plugins/utils'

export default {
  components: {
    dataTable,
  },
  data() {
    return {
      deleteIcon: markRaw(DeleteIcon),
      selectStatusFilter: null,
      fromDate: null,
      toDate: null,
      discounts: [],
      headers: [
        {
          title: '#',
          align: 'center',
          sortable: true,
          key: 'index',
          width: '10px'
        },
        {
          title: this.$t('discountName'),
          align: 'center',
          sortable: true,
          key: 'name',
          width: '150px'
        },
        {
          title: this.$t('discountType'),
          align: 'center',
          sortable: true,
          key: 'discountType',
          width: '100px'
        },
        {
          title: this.$t('discountValue'),
          align: 'center',
          sortable: true,
          key: 'discountValue',
          width: '120px'
        },
        {
          title: this.$t('couponCode'),
          align: 'center',
          sortable: true,
          key: 'couponCode',
          width: '120px'
        },
        {
          title: this.$t('startDate'),
          align: 'center',
          sortable: true,
          key: 'startDate',
          width: '100px'
        },
        {
          title: this.$t('endDate'),
          align: 'center',
          sortable: true,
          key: 'endDate',
          width: '100px'
        },
        {
          title: this.$t('status'),
          align: 'center',
          sortable: true,
          key: 'isActive',
          width: '80px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          key: 'operations',
          width: '120px'
        }
      ],
      statusList: [
        {
          id: null,
          title: this.$t('showAll')
        },
        {
          id: true,
          title: this.$t('active')
        },
        {
          id: false,
          title: this.$t('inActive')
        }
      ]
    }
  },
  async mounted() {
    await this.getDiscountList()
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    getPersianDate(date) {
      return utils.showDate(date)
    },
    confirmDelete(item) {
      this.setWarningDialog(
        true, 
        this.$t('deleteDiscount'), 
        this.$t('confirmDeleteDiscount', { name: item.name }), 
        () => this.deleteDiscount(item)
      )
    },
    
    async deleteDiscount(item) {
			const response = await discountService.delete(item.id)
			
			if (response.isSuccess || response.status === 204) {
				this.setErrorMessage(this.$t('discountDeletedSuccessfully'), 'success')
				this.closeWarning()
				await this.getDiscountList()
			} else {
				this.setErrorMessage(response.errors?.[0]?.message || this.$t('errorDeletingDiscount'))
			}
    },
    async getDiscountList() {
			const params = {
				page: 1,
				size: 1000,
				startDate: this.fromDate ? new Date(this.fromDate).toISOString() : null,
				endDate: this.toDate ? new Date(this.toDate).toISOString() : null
			}

			const response = await discountService.getAll(params)
			
			if (response.isSuccess) {
				this.discounts = response.value.result
					.filter((discount) => {
						if (this.selectStatusFilter === null) return true
						return discount.isActive === this.selectStatusFilter
					})
					.map((x) => {
						return {
							...x,
							contexts: [
								{
									label: this.$t('view'),
									icon: 'mdi-eye',
									onClick: () => this.$router.push(`/shop/discount/${x.id}?action=view`)
								},
								{
									label: this.$t('edit'),
									icon: 'mdi-pencil',
									onClick: () => this.$router.push(`/shop/discount/${x.id}`)
								},
								{
									label: this.$t('delete'),
									icon: 'mdi-delete',
									onClick: () => this.confirmDelete(x)
								}
							]
						}
					})
			} else {
				this.setErrorMessage(response.errors?.[0]?.message || this.$t('errorLoadingData'))
			}
    }
  }
}
</script>