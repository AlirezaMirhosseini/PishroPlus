<template>
	<div class="mt-6">
		<data-table 
			:items="templates" 
			:headers="voucherTemplateHeaders"
			:page="templatesParams.page"
			:pageSize="templatesParams.size"
			:totalCount="templatesTotalCount"
			:isServerSide="true"
			@update:page="updateTemplatesPage"
			@update:pageSize="updateTemplatesPageSize"
		>
			<template v-slot:toolbar>
				<v-row no-gutters align="center">
					<p style="font-weight: bold">{{ $t('voucherTemplates') }}</p>
					<v-btn
						class="mx-2"
						color="info"
						variant="tonal"
						@click="showCreateOrUpdateTemplateDialog"
					>
						<v-icon size="small">mdi-plus</v-icon>
						{{ $t('newVoucherTemplate') }}
					</v-btn>
				</v-row>
			</template>
			
			<template v-slot:column_row="{ entity }">
				<v-icon
					v-if="entity.isDefault"
					color="amber-darken-3"
					size="x-small"
					icon="mdi mdi-star"
				/>
				{{ templates.indexOf(entity) + 1 }}
			</template>
			<template v-slot:column_title="{ entity }">
				<span>{{ entity.title }}</span>
			</template>
			<template v-slot:column_issuerPart="{ entity }">
				{{ getSourceTypeName(entity.issuerPart) }}
			</template>
			<template v-slot:column_type="{ entity }">
				{{ entity.type === 0 ? $t('customize') : $t('systemic') }}
			</template>
			<template v-slot:column_operations="{ entity }">
				<div class="d-flex justify-ceneter">
					<v-tooltip :text="$t('edit')">
						<template v-slot:activator="{ props }">
							<v-btn
								v-bind="props"
								icon="mdi mdi-pencil-outline"
								variant="text"
								color="info"
								size="small"
								@click="() => OpenEdit(entity)"
							/>
						</template>
					</v-tooltip>
					<v-tooltip :text="$t('delete')">
						<template v-slot:activator="{ props }">
							<v-btn
								v-bind="props"
								:icon="deleteIcon"
								:disabled="entity.type === 1"
								@click="deleteVoucherTemplate(entity)"
								variant="text"
								color="error"
								size="small"
							/>
						</template>
					</v-tooltip>
				</div>
			</template>
		</data-table>
	</div>

	<v-dialog v-model="createOrUpdateTemplateDialog" max-width="75%">
		<v-card>
      <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
        <v-icon
          color="info"
          class="ml-2"
          :icon="`mdi ${templateEntity.id ? 'mdi-pencil-outline' : 'mdi-note-plus'}`"
        />
        <div>
          <p style="font-weight: bold">
            {{ !templateEntity.id ? $t('createVoucherTemplate') : $t('updateVoucherTemplate') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="hideCreateOrUpdateTemplateDialog"
            variant="text"
          />
        </div>
      </v-row>
			<v-form ref="templateEntityForm" @submit.prevent="saveTemplate">
				<v-card-text>
					<v-row class="mb-4" no-gutters>
            <v-col class="pa-1" cols="12" md="3">
              <v-select
                :label="$t('templateType')"
                variant="outlined"
                density="compact"
                hide-details
                v-model="templateEntity.issuerPart"
                item-title="title"
                item-value="id"
                :items="issuerParts"
                :disabled="templateEntity.isEdit"
              ></v-select>
            </v-col>
            <v-col class="pa-1" cols="12" md="6">
              <v-text-field
                v-model="templateEntity.title"
                :rules="[(v) => !!v || $t('enterRequiredField')]"
                variant="outlined"
                density="compact"
                :label="$t('templateTitle')"
              />
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-checkbox
                hide-details
                density="compact"
                v-model="templateEntity.isDefault"
                :label="$t('setAsDefaultTemplate')"
              />
            </v-col>
            <v-col class="pa-1" cols="12" md="9">
              <v-textarea
                @drop.prevent="dropToVoucherDesc"
                v-model="templateEntity.description"
                :rules="[(v) => !!v || $t('enterRequiredField')]"
                variant="outlined"
                density="compact"
                :label="$t('desc')"
                style="min-width: 300px"
              />
              <div v-if="linkWarningMessage" class="text-warning mt-1 px-3">
                {{ linkWarningMessage }}
              </div>
            </v-col>
            <v-col class="pa-1" cols="12" md="3">
              <v-card variant="outlined" class="pishro-border" width="100%">
                <p
                  v-for="item in voucherDescItems"
                  :key="item.id"
                  :draggable="true"
                  @dragstart="($event) => onDragDescItem($event, item)"
                  class="text-info pishro-caption pishro-border pa-2 ma-1"
                  style="cursor: move"
                >
                  <v-icon>mdi-chevron-double-right</v-icon>
                  {{ `(${item.id}) ${item.title}` }}
                </p>
              </v-card>
            </v-col>
					</v-row>
					<data-table
						:items="templateEntity?.items"
						:headers="voucherTemplateRecordHeaders"
						:showPagination="false"
					>
            <template v-slot:toolbar>
              <v-row no-gutters align="center">
                <p style="font-weight: bold">{{ $t('voucherTemplateRecords') }}</p>
              </v-row>
            </template>
            <template v-slot:column_row="{ index }">
              {{ index + 1 }}
            </template>
            <template v-slot:column_operations="{ entity, index }">
              <div class="d-flex justify-center">
                <v-tooltip :text="$t('edit')">
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      icon="mdi mdi-pencil-outline"
                      variant="text"
                      color="info"
                      size="small"
                      @click="() => openVoucherTemplateRecordEdit(entity, index)"
                      :disabled="templateEntity.type === 1"
                    />
                  </template>
                </v-tooltip>
              </div>
            </template>
					</data-table>
				</v-card-text>

				<v-card-actions class="justify-end dialog-bottombar px-5">
					<v-btn
						v-if="templateEntity.id"
						@click="hideCreateOrUpdateTemplateDialog"
						color="grey"
						variant="outlined"
						size="large"
						prepend-icon="mdi mdi-close"
						>{{ $t('cancel') }}</v-btn
					>
					<v-btn
						:disabled="!templateEntity.title || !templateEntity.description || templateEntity.type === 1"
						type="submit"
						color="info"
						size="large"
						variant="flat"
						prepend-icon="mdi mdi-content-save"
						>{{ $t('save') }}</v-btn
					>
				</v-card-actions>
			</v-form>
		</v-card>
	</v-dialog>

	<v-dialog v-model="addOrUpdateTemplateRowDialog" max-width="75%" persistent eager>
		<v-card>
      <v-row class="align-center pr-5 dialog-topbar no-border" no-gutters>
        <v-icon
          color="info"
          class="ml-2"
          :icon="`mdi ${templateRecordEntity.isEdit ? 'mdi-note-pencil' : 'mdi-note-plus'}`"
        />
        <div>
          <p style="font-weight: bold">
            {{ !templateRecordEntity.isEdit ? $t('add') : $t('edit') }} {{ $t('row') }}
          </p>
        </div>
        <div class="ms-auto">
          <v-btn
            color="grey"
            icon="mdi mdi-close"
            @click="hideAddOrUpdateTemplateRowDialog"
            variant="text"
          />
        </div>
      </v-row>
      <v-form ref="addOrUpdateTemplateRowFrm">
        <v-card-text>
          <v-row no-gutters>
            <v-col cols="12" md="9" class="pa-1">
              <v-row no-gutters>
                <v-col cols="12" md="6" class="pa-1">
                  <accountSelector v-model="templateRecordEntity.account" :justAccount="true" />
                </v-col>
                <v-col cols="12" md="6" class="pa-1">
                  <accountSelector :title="$t('detailed')" :disableComponent="!templateRecordEntity.account?.selectedAccount || !templateRecordEntity.isDetailedAccountWritable" v-model="templateRecordEntity.detailedAccount" :justDetailedAccount="true" />
                </v-col>
                <v-col cols="12" class="pa-1">
                  <v-textarea
                    @drop.prevent="dropToVoucherTemplateRecordDesc"
                    variant="outlined"
                    density="compact"
                    hide-details
                    :label="$t('desc')"
                    v-model="templateRecordEntity.description"
                  >
                  </v-textarea>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="12" md="3" class="pa-1">
              <v-row class="pa-4 pishro-border" no-gutters>
                <v-col class="mb-2" cols="12">
                  <p class="text-center text-grey">
                    {{ $t('descItems') }}
                  </p>
                </v-col>
                <v-col
                  v-for="item in voucherRecordDescItems"
                  :key="item.id"
                  cols="12"
                  sm="6"
                  md="12"
                >
                  <p
                    :draggable="true"
                    @dragstart="($event) => onDragDescItem($event, item)"
                    class="text-info pishro-caption my-2"
                    style="cursor: grab"
                  >
                    {{ `(${item.id}) ${item.title}` }}
                  </p>
                </v-col>
              </v-row>
              <p class="pishro-caption text-grey pa-2">{{ '* ' + $t('insertByDragAndDrop') }}</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar px-5">
          <v-btn
            @click="addOrUpdateTemplateRow"
            color="info"
            variant="flat"
            size="large"
            prepend-icon="mdi mdi-check"
            >{{ $t('submit') }}</v-btn
          >
        </v-card-actions>
      </v-form>
		</v-card>
	</v-dialog>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default.js'
import voucherService from '../../../api/voucher/voucherService.js'
import accountService from '../../../api/account/accountService.js'
import dataTable from '../baseComponents/datatable/datatable.vue'
import accountSelector from '../accountsComponents/accountSelector.vue'
import deleteIcon from '../icons/Delete.vue'
import { markRaw } from 'vue'

export default {
	name: 'VoucherTemplate',
	
	components: {
		dataTable,
		accountSelector
	},

	data() {
		return {
			deleteIcon: markRaw(deleteIcon),
			templates: [],
			templatesParams: {
				page: 1,
				size: 10
			},
      allApiTemplates: [],
			templatesTotalCount: 0,
      linkWarningMessage: '',
			createOrUpdateTemplateDialog: false,
			addOrUpdateTemplateRowDialog: false,
      deletedItems: [],
      templates: [],
      templateEntity: {
        isEdit: false,
        title: '',
        issuerPart: 0,
        isDefault: false,
        description: '',
        items: []
      },
      templateRecordEntity: {
        isEdit: false,
        id: null,
        key: null,
        natureType: null,
        account: {
          selectedAccount: null
        },
        detailedAccount: {
          selectedDetailedAccount: null
        },
        description: '',
        isDetailedAccountWritable: false
      },
      issuerParts: [
        { id: 0, title: `${this.$t('salesInvoice')}` },
        { id: 21, title: `${this.$t('receiveDeposit')}_${this.$t('cardToCard')}` },
        { id: 24, title: `${this.$t('receiveDeposit')}_${this.$t('BankPos')}` }
      ],
      voucherDescItems: [
        { id: 'code', title: this.$t('code') },
        { id: 'dateTime', title: this.$t('dateTime') },
        { id: 'totalAmount', title: this.$t('totalAmount') },
        { id: 'dueDate', title: this.$t('dueDate') }
      ],
      voucherRecordDescItems: [
        { id: 'accountCode', title: this.$t('accountCode') },
        { id: 'accountName', title: this.$t('accountName') },
        { id: 'invoiceCode', title: this.$t('invoiceCode') },
        { id: 'invoiceDate', title: this.$t('invoiceDate') },
        { id: 'invoiceDueDate', title: this.$t('dueDate') },
        { id: 'totalAmount', title: this.$t('totalAmount') },
        { id: 'documentType', title: this.$t('documentType') },
        { id: 'serialNumber', title: this.$t('serialNumber') }
      ],
      actionTypes: [
        { id: 0, title: this.$t('additional') },
        { id: 1, title: this.$t('regressive') }
      ],
      profitAndLossHeader: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('account'),
          align: 'center',
          sortable: true,
          key: 'accountName',
          width: '50px'
        },
        {
          title: this.$t('action'),
          align: 'center',
          sortable: true,
          key: 'action',
          width: '50px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '50px'
        }
      ],
      voucherTemplateRecordHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('key'),
          align: 'center', 
          sortable: true,
          key: 'showingKey',
          width: '100px'
        },
        {
          title: this.$t('accountNature'),
          align: 'center',
          sortable: true, 
          key: 'showingNatureType',
          width: '120px'
        },
        {
          title: this.$t('defaultAccount'),
          align: 'center',
          sortable: true,
          key: 'defaultAccount',
          width: '200px'
        },
        {
          title: this.$t('defaultDetailedAccount'),
          align: 'center',
          sortable: true,
          key: 'defaultDetailedAccount',
          width: '200px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'description',
          width: '200px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '40px',
          fixed: true
        }
      ],
      voucherTemplateHeaders: [
        {
          title: this.$t('row'),
          align: 'center',
          sortable: true,
          key: 'row',
          width: '50px'
        },
        {
          title: this.$t('issuerPart'),
          align: 'center',
          sortable: true,
          key: 'issuerPart',
          width: '200px'
        },
        {
          title: this.$t('title'),
          align: 'center',
          sortable: true,
          key: 'title',
          width: '200px'
        },
        {
          title: this.$t('desc'),
          align: 'center',
          sortable: true,
          key: 'description',
          minWidth: '300px'
        },
        {
          title: this.$t('type'),
          align: 'center',
          sortable: true,
          key: 'type',
          width: '100px'
        },
        {
          title: this.$t('operations'),
          align: 'center',
          sortable: true,
          key: 'operations',
          width: '40px',
          fixed: true
        }
      ],
      voucherTemplateRecordTypes: [
        {
          title: this.$t('debtor'),
          value: 0
        },
        {
          title: this.$t('creditor'),
          value: 1
        }
      ],
      voucherTemplateAccountTypes: [
        {
          title: this.$t('productStockAccount'),
          value: 0,
          issuerPart: [0]
        },
        {
          title: this.$t('productCostAccount'),
          value: 1,
          issuerPart: [0]
        },
        {
          title: this.$t('vatAccount'),
          value: 2,
          issuerPart: [0]
        },
        {
          title: this.$t('discountAccount'),
          value: 3,
          issuerPart: [0]
        },
        {
          title: this.$t('marketingCostAccount'),
          value: 4,
          issuerPart: [0]
        },
        {
          title: this.$t('cashBoxAccount'),
          value: 5,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('receivableAccount'),
          value: 6,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('VouchersReceivable'),
          value: 7,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('payableAccount'),
          value: 8,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('commissionAccount'),
          value: 9,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('transportationCostAccount'),
          value: 10,
          issuerPart: [0]
        },
        {
          title: this.$t('bankAccount'),
          value: 20,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('taxAccount'),
          value: 21,
          issuerPart: [24, 21]
        },
        {
          title: this.$t('ExpensesAccount'),
          value: 22,
          issuerPart: [0]
        },
        {
          title: this.$t('RevenuesAccount'),
          value: 23,
          issuerPart: [0]
        },
        {
          title: this.$t('SalesRevenueAccount'),
          value: 24,
          issuerPart: [0]
        },
        {
          title: this.$t('ServiceRevenueAccount'),
          value: 25,
          issuerPart: [0]
        },
        {
          title: this.$t('check'),
          value: 26,
          issuerPart: [0]
        },
        {
          title: this.$t('cash'),
          value: 27,
          issuerPart: [0]
        },
        {
          title: this.$t('warrantyDocuments'),
          value: 28,
          issuerPart: [0]
        },
        {
          title: this.$t('cardToCard'),
          value: 29,
          issuerPart: [0]
        },
        {
          title: this.$t('satna'),
          value: 30,
          issuerPart: [0]
        },
        {
          title: this.$t('paya'),
          value: 31,
          issuerPart: [0]
        },
        {
          title: this.$t('other'),
          value: 32,
          issuerPart: [0]
        },
        {
          title: this.$t('directPOS'),
          value: 33,
          issuerPart: [0]
        }
      ]
		}
	},

  watch: {
    'templateEntity.issuerPart': {
      handler: async function(newIssuerPart) {
        if (!this.templateEntity.isEdit && newIssuerPart !== undefined) {
          await this.updateTemplateItemsBasedOnIssuerPart(newIssuerPart);
        }
      },
      immediate: false
    }
  },

	methods: {
		...mapActions(defaultStore, {
			setErrorMessage: 'setErrorMessage',
			setWarningDialog: 'setWarningDialog'
		}),

    OpenEdit(item) {
      const systemTemplate = this.allApiTemplates.find(t => t.systemic === true && t.issuerPart === item.issuerPart);

      this.templateEntity = {
        ...item,
        isEdit: true,
        items: item.items.map(record => ({
          id: record.id,
          key: record.key,
          showingKey: this.getAccountTypeText(record.key),
          natureType: record.natureType,
          showingNatureType: this.getNatureTypeText(record.natureType),
          defaultAccount: record.account?.name,
          defaultDetailedAccount: record.detailedAccount?.name,
          description: record.description,
          account: record.account ? {
            id: record.account.id,
            name: record.account.name,
            code: record.account.code.toString()
          } : null,
          detailedAccount: record.detailedAccount ? {
            id: record.detailedAccount.id,
            name: record.detailedAccount.name,
            code: record.detailedAccount.code.toString()
          } : null,
          isDetailedAccountWritable: record.isDetailedAccountWritable,
          action: record.id ? 2 : 1
        }))
      };

      if (systemTemplate) {
        systemTemplate.items.forEach(systemItem => {
          const existingItem = this.templateEntity.items.find(userItem => 
            userItem.key === systemItem.key
          );
          if (!existingItem) {
            
            this.templateEntity.items.push({
              key: systemItem.key,
              showingKey: this.getAccountTypeText(systemItem.key),
              natureType: systemItem.natureType,
              showingNatureType: this.getNatureTypeText(systemItem.natureType),
              defaultAccount: '',
              defaultDetailedAccount: '',
              description: '',
              account: null,
              detailedAccount: null,
              isDetailedAccountWritable: systemItem.isDetailedAccountWritable,
              action: 1
            });
          }
        });
      }
      this.createOrUpdateTemplateDialog = true;
    },

    getNatureTypeText(type) {
      return this.voucherTemplateRecordTypes.find(x => x.value === type)?.title || '';
    },

    getAccountTypeText(key) {
      return this.voucherTemplateAccountTypes.find(x => x.value === key)?.title || '';
    },

		async getTemplates() {
			const res = await voucherService.getAllTemplates(this.templatesParams);
			if (res.isSuccess) {
        this.allApiTemplates = res.value.result;
        const nonSystemicTemplates = res.value.result.filter(t => !t.systemic);
        this.templates = nonSystemicTemplates.map(template => ({
          ...template,
          items: template.items.map(item => ({
            key: item.key ?? 0,
            natureType: item.natureType ?? 0,
            defaultAccount: item.account?.name || '',
            defaultDetailedAccount: item.detailedAccount?.name || '',
            description: item.description || '',
            
            id: item.id,
            account: item.account ? {
              ...item.account,
              code: (item.account.code || '').toString()
            } : null,
            detailedAccount: item.detailedAccount ? {
              ...item.detailedAccount,
              code: (item.detailedAccount.code || '').toString()
            } : null,
            isDetailedAccountWritable: item.isDetailedAccountWritable || false,
            action: item.action || 0
          }))
        }));
        
        this.templatesTotalCount = nonSystemicTemplates.length;
      } else {
				this.setErrorMessage(res.errors[0]?.message);
			}
		},

		updateTemplatesPage(page) {
			this.templatesParams.page = page;
			this.getTemplates();
		},

		updateTemplatesPageSize(size) {
			this.templatesParams.size = size;
			this.templatesParams.page = 1;
			this.getTemplates();
		},
    
    async updateTemplateItemsBasedOnIssuerPart(issuerPart) {
      if (issuerPart !== null) {
        const systemTemplate = this.allApiTemplates.find(t => 
          t.systemic === true && t.issuerPart === issuerPart
        );
        
        if (systemTemplate) {
          if (!this.templateEntity.description || this.templateEntity.description === '') {
            this.templateEntity.description = systemTemplate.description || '';
          }
          this.templateEntity.items = systemTemplate.items.map(item => ({
            key: item.key,
            showingKey: this.getAccountTypeText(item.key),
            natureType: item.natureType,
            showingNatureType: this.getNatureTypeText(item.natureType),
            description: item.description || '',
            isDetailedAccountWritable: item.isDetailedAccountWritable,
            action: 1,
            account: null,
            detailedAccount: null,
            defaultAccount: '',
            defaultDetailedAccount: ''
          }));
        } else {
          this.setErrorMessage(
            this.$t(`No system template found for issuerPart ${issuerPart}`),
            'info'
          );
          this.templateEntity.items = [];
        }
      }
    },

		async showCreateOrUpdateTemplateDialog() {
      this.templateEntity = {
        isEdit: false,
        title: '',
        issuerPart: 0,
        isDefault: false,
        description: '',
        items: []
      };
      await this.updateTemplateItemsBasedOnIssuerPart(this.templateEntity.issuerPart);
      this.createOrUpdateTemplateDialog = true;
		},

		async deleteTemplate(template) {
			this.setWarningDialog(
				true,
				this.$t('warning'),
				this.$t('deleteTemplateWarning'),
				async () => {
					const res = await voucherService.deleteTemplate(template.id);
					if (res.isSuccess) {
						this.setErrorMessage(this.$t('voucherTemplateDeletedSuccessfully'), 'success');
						await this.getTemplates();
					} else {
						this.setErrorMessage(res.errors[0]?.message);
					}
				}
			);
		},

    hideCreateOrUpdateTemplateDialog() {
      this.$refs.templateEntityForm.reset();
      this.templateEntity.isEdit = false;
      this.createOrUpdateTemplateDialog = false;
      this.linkWarningMessage = '';
      this.deletedItems = [];
    },

		deleteTemplateRecord(record) {
			const index = this.templateEntity.items.indexOf(record);
			this.templateEntity.items.splice(index, 1);
		},

		async addOrUpdateTemplateRow() {
      if (!this.templateRecordEntity.account?.selectedAccount) {
        this.setErrorMessage(this.$t('pleaseSelectAccount'));
        return;
      }
      const accountResponse = await accountService.getById(
        this.templateRecordEntity.account.selectedAccount.id
      );
      if (this.templateRecordEntity.detailedAccount?.selectedDetailedAccount) {
        const detailedId = this.templateRecordEntity.detailedAccount.selectedDetailedAccount.id;
        const isLinked = accountResponse.value.dependencies.some(dep => dep.id === detailedId);

        if (!isLinked) {
          const accountName = this.templateRecordEntity.account.selectedAccount.name;
          const detailedName = this.templateRecordEntity.detailedAccount.selectedDetailedAccount.name;
          
          this.linkWarningMessage = this.$t('accountDetailedLinkWarningTemplate', [
            detailedName,
            accountName
          ]);
        }
      }
      const itemAction = this.templateRecordEntity.isEdit ? 2 : 1;

      const newRecord = {
        id: this.templateRecordEntity.id,
        key: this.templateRecordEntity.key,
        natureType: this.templateRecordEntity.natureType,
        showingKey: this.getAccountTypeText(this.templateRecordEntity.key),
        showingNatureType: this.getNatureTypeText(this.templateRecordEntity.natureType),
        account: this.templateRecordEntity.account?.selectedAccount ? {
          id: this.templateRecordEntity.account.selectedAccount.id,
          name: this.templateRecordEntity.account.selectedAccount.name,
          code: this.templateRecordEntity.account.selectedAccount.code.toString()
        } : null,
        detailedAccount: this.templateRecordEntity.detailedAccount?.selectedDetailedAccount ? {
          id: this.templateRecordEntity.detailedAccount.selectedDetailedAccount.id,
          name: this.templateRecordEntity.detailedAccount.selectedDetailedAccount.name,
          code: this.templateRecordEntity.detailedAccount.selectedDetailedAccount.code.toString()
        } : null,
        defaultAccount: this.templateRecordEntity.account?.selectedAccount?.name || '',
        defaultDetailedAccount: this.templateRecordEntity.detailedAccount?.selectedDetailedAccount?.name || '',
        description: this.templateRecordEntity.description || '',
        isDetailedAccountWritable: this.templateRecordEntity.isDetailedAccountWritable,
        action: itemAction
      };

      if (this.templateRecordEntity.isEdit) {
        const updateIndex = this.templateRecordEntity.index;
        this.templateEntity.items.splice(updateIndex, 1, newRecord);
      } else {
        this.templateEntity.items.push(newRecord);
      }

			this.hideAddOrUpdateTemplateRowDialog();
      this.setErrorMessage(
        this.templateRecordEntity.isEdit 
          ? this.$t('recordUpdatedSuccessfully')
          : this.$t('recordAddedSuccessfully'),
        'success'
      );
		},

		deleteRecordItem(entity, index) {
			this.setWarningDialog(
				true, 
				this.$t('deleteRow'), 
				this.$t('confirmDeleteMessage'), 
				() => {
          if (entity.id) {
            const itemToDelete = { ...this.templateEntity.items[index], action: 3 };
            this.deletedItems.push(itemToDelete);
          }
          this.templateEntity.items.splice(index, 1);
        }
			)
		},

		onDragDescItem(element, item) {
			element.dataTransfer.setData('text', item.id)
		},

		dropToVoucherDesc(element) {
      element.preventDefault();
      element.stopPropagation();
      
			const id = element.dataTransfer.getData('text')
			if (!this.templateEntity.description) this.templateEntity.description = ''
			this.templateEntity.description += `[${id}]`;
		},

		dropToVoucherTemplateRecordDesc(element) {
      element.preventDefault();
      element.stopPropagation();

			const id = element.dataTransfer.getData('text')
			if (!this.templateRecordEntity.description) this.templateRecordEntity.description = ''
			this.templateRecordEntity.description += `[${id}]`
		},

		showAddOrUpdateTemplateRowDialog(isNew) {
			if (isNew) {
				this.templateRecordEntity = {}
			}
			this.addOrUpdateTemplateRowDialog = true
		},

		hideAddOrUpdateTemplateRowDialog() {
      const tempValues = { ...this.templateRecordEntity };
			this.$refs.addOrUpdateTemplateRowFrm.reset()
      this.templateRecordEntity = tempValues;
      // this.showLinkWarning = false;
			this.addOrUpdateTemplateRowDialog = false
		},

		openVoucherTemplateRecordEdit(item, index) {
      this.templateRecordEntity = {
        id: item.id,
        isEdit: true,
        key: item.key,
        natureType: item.natureType,
        index: index,
        account: {
          selectedAccount: item.account ? {
            id: item.account.id,
            name: item.account.name,  
            code: item.account.code.toString(),
            accountId: item.account.id,
            hierarchicalName: item.account.name,
            hierarchicalCode: item.account.code.toString()
          } : null
        },
        detailedAccount: {
          selectedDetailedAccount: item.detailedAccount ? {
            id: item.detailedAccount.id,
            name: item.detailedAccount.name,
            code: item.detailedAccount.code.toString(),
            detailedAccountId: item.detailedAccount.id,
            hierarchicalName: item.detailedAccount.name,
            hierarchicalCode: item.detailedAccount.code.toString()
          } : null
        },
        description: item.description || '',
        isDetailedAccountWritable: item.isDetailedAccountWritable
      };
      this.$nextTick(() => {
        this.addOrUpdateTemplateRowDialog = true;
      });
		},

		getSourceTypeName(type) {
			return this.issuerParts.find(x => x.id === type)?.title
		},

		async deleteVoucherTemplate(entity) {
			this.setWarningDialog(
				true,
				this.$t('deleteRow'),
				this.$t('confirmDeleteMessage'),
				async () => {
					await voucherService.deleteTemplate(entity.id).then((res) => {
            this.setErrorMessage(this.$t('voucherTemplateHasRemoveSuccessfully'), 'success');
            this.getTemplates();
            // if (res.status === 204) {
            //   this.setErrorMessage(this.$t('voucherTemplateHasRemoveSuccessfully'), 'success');
            //   this.getTemplates();
            // }
          })
				}
			)
		},
    
    validateTemplateItems() {
      const invalidItems = this.templateEntity.items.filter(item => 
        !item.account || !item.account.id
      );
      
      if (invalidItems.length > 0) {
        const itemNames = invalidItems.map(item => 
          this.getAccountTypeText(item.key)
        ).join(', ');
        
        this.setErrorMessage(
          this.$t('pleaseSelectAccountForAllRows', { items: itemNames }),
          'error'
        );
        return false;
      }
      return true;
    },

		async saveTemplate() {
			const valid = await this.$refs.templateEntityForm.validate();
			if (valid.valid) {
        if (!this.validateTemplateItems()) return;

        const templateAction = this.templateEntity.isEdit ? 
          (this.templateEntity.id ? 2 : 1) : 1;

        const currentItems = this.templateEntity.items.map(item => {
          let itemAction = item.id ? item.action : 1;
          
          return {
            id: item.id,
            key: item.key,
            natureType: item.natureType,
            account: item.account ? {
              id: item.account.id,
              name: item.account.name,
              code: item.account.code.toString()
            } : null,
            detailedAccount: item.detailedAccount ? {
              id: item.detailedAccount.id,
              name: item.detailedAccount.name,
              code: item.detailedAccount.code.toString()
            } : null,
            description: item.description,
            isDetailedAccountWritable: item.isDetailedAccountWritable,
            action: itemAction
          };
        });
        
        const allItems = [
          ...currentItems,
          ...this.deletedItems?.map(item => ({
            id: item.id,
            key: item.key,
            natureType: item.natureType,
            account: item.account ? {
              id: item.account.id,
              name: item.account.name,
              code: item.account.code.toString()
            } : null,
            detailedAccount: item.detailedAccount ? {
              id: item.detailedAccount.id,
              name: item.detailedAccount.name,
              code: item.detailedAccount.code.toString()
            } : null,
            description: item.description,
            isDetailedAccountWritable: item.isDetailedAccountWritable,
            action: 3
          }))
        ];

        const request = {
          title: this.templateEntity.title,
          issuerPart: this.templateEntity.issuerPart,
          isDefault: this.templateEntity.isDefault,
          description: this.templateEntity.description,
          action: templateAction,
          items: allItems
        };
        
        if (this.templateEntity.isEdit && this.templateEntity.id) {
          request.id = this.templateEntity.id;
        }
        
        const service = this.templateEntity.isEdit 
          ? voucherService.updateTemplate 
          : voucherService.createTemplate;
        
        const response = await service(request);
        if (response.isSuccess) {
          this.$refs.templateEntityForm.reset();
          this.deletedItems = [];
          this.setErrorMessage(
            this.$t(this.templateEntity.isEdit 
              ? 'voucherTemplateUpdatedSuccessfully' 
              : 'voucherTemplateCreatedSuccessfully'),
            'success'
          );
          await this.getTemplates();
          this.createOrUpdateTemplateDialog = false;
        } else {
          this.setErrorMessage(response.errors[0]?.message);
        }
			}
		},
	},

	async mounted() {
		await this.getTemplates();
	}
}
</script>