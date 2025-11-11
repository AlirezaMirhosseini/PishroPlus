<template>
    <v-card>
      <v-card-text>
        <v-row no-gutters class="flex-column-reverse flex-md-row">
          <v-col class="flex-grow-1 pa-0 account-info-container">
            <v-row no-gutters>
              <v-col class="px-1" cols="6" sm="4" md="3">
                <v-select :items="defaultWarehouse" item-title="title" item-value="id" v-model="defaultReceiptWarehouseId"
                  variant="outlined" density="compact" :label="$t('defaultReceiptWarehouse')"
                  @change="setDefaultWarehouses" />
              </v-col>
              <v-col class="px-1" cols="6" sm="4" md="3">
                <v-select v-model="defaultRemittanceWarehouseId" item-title="title" item-value="id"
                  :items="defaultWarehouse" variant="outlined" density="compact"
                  :label="$t('defaultRemittanceWarehouse')" />
              </v-col>
  
              <v-btn @click="setDefaultWarehouses" :prepend-icon="saveIcon" color="info" class="ma-1 float-left">{{
                  $t('save')
                }}</v-btn>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </template>
  <script>
  import warehouseServices from '../../../api/warehouse/warehouseService'
  import settingService from '../../../api/setting/settingService'
  import { mapActions } from 'pinia'
  import { defaultStore } from '../../stores/default'
  import SaveIcon from '../../components/icons/Save.vue'
  import { markRaw } from 'vue'
  
  
  export default {
    data() {
      return {
        defaultWarehouse: [],
        defaultRemittanceWarehouseId: null,
        defaultReceiptWarehouseId: null,
        fonts: ['IRANSans', 'IRANYekan', 'Anjoman', 'Aviny', 'Dana', 'IRANSharp', 'Kalameh'],
        saveIcon: markRaw(SaveIcon),
      }
    },
    methods: {
      ...mapActions(defaultStore, {
        setErrorMessage: 'setErrorMessage',
        setWarningDialog: 'setWarningDialog',
        closeWarning: 'closeWarning'
      }),
  
      async getAllDefaultWarehouse() {
        await warehouseServices.getAll().then((res) => {
          if (res.isSuccess) {
            this.defaultWarehouse = res.entities
          } else this.setErrorMessage(res.message)
        })
      },
  
      setDefaultWarehouses() {
        let items = {}
        items['defaultReceiptWarehouseId'] =
          this.defaultReceiptWarehouseId.toString()
  
        items['defaultRemittanceWarehouseId'] =
          this.defaultRemittanceWarehouseId.toString()
  
        if (Object.keys(items).length > 0) {
          settingService
            .SetWarehouseSetting({
              entity: {
                items: items
              }
            })
            .then((res) => {
              if (!res.isSuccess) {
                this.setErrorMessage(res.message)
              } else {
                this.setErrorMessage(this.$t('settingHasSetSuccessfully'), 'success')
              }
            })
        }
      },
      async getDefaultWarehouses() {
        settingService.GetWarehouseSetting().then((res) => {
          if (!res.isSuccess) {
            this.setErrorMessage(res.message)
            return
          }
          this.defaultReceiptWarehouseId =
            res.entities.filter((x) => x.name === 'DefaultReceiptWarehouseId')[0]
              ?.value
          this.defaultRemittanceWarehouseId =
            res.entities.filter((x) => x.name === 'DefaultRemittanceWarehouseId')[0]?.value
        },
        )
      },
    },
    async mounted() {
      await this.getAllDefaultWarehouse()
    },
    async created() {
      await this.getDefaultWarehouses()
    },
  }
  </script>