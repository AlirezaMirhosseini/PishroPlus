<template>
  <v-card flat>
    <v-card-text>
      <v-row>
        <v-col cols="12">
          <!-- File Upload Section -->
          <v-card variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center py-3">
              <v-icon icon="mdi-file-excel" color="success" class="me-2" />
              <span>{{ $t('excelViewer') }}</span>
            </v-card-title>
            <v-card-text>
              <v-row align="center">
                <v-col cols="12" md="6">
                  <v-file-input
                    v-model="file"
                    :label="$t('selectExcelFile')"
                    accept=".xlsx, .xls"
                    prepend-icon="mdi-file-excel"
                    @update:model-value="importFile"
                    :loading="loading"
                    :error-messages="errorMessage"
                    :hint="infoMessage"
                    :persistent-hint="!!infoMessage"
                    variant="outlined"
                    density="comfortable"
                  ></v-file-input>
                </v-col>
                <v-col cols="12" md="6">
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-switch
                        v-model="useRowLimits"
                        :label="$t('limitRows')"
                        color="primary"
                        hide-details
                        class="mb-2"
                      ></v-switch>
                    </v-col>
                  </v-row>
                  <v-row v-if="useRowLimits">
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="startRow"
                        type="number"
                        :label="$t('startFromRow')"
                        min="1"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        @keyup.enter="applyRowLimits"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="endRow"
                        type="number"
                        :label="$t('endAtRow')"
                        min="1"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        @keyup.enter="applyRowLimits"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" class="d-flex justify-end mt-2">
                      <v-btn
                        color="primary"
                        size="small"
                        @click="applyRowLimits"
                        prepend-icon="mdi-check"
                        :disabled="!file"
                      >
                        {{ $t('apply') }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>

          <!-- Display File Information If Available -->
          <v-card v-if="sheets.length > 0" variant="outlined" class="mb-4">
            <v-card-title class="d-flex align-center py-3">
              <v-icon icon="mdi-file-table-outline" color="primary" class="me-2" />
              <span>{{ $t('fileInfo') }}</span>
            </v-card-title>
            <v-card-text>
              <div class="d-flex align-center mb-4">
                <span class="text-body-2">{{ file?.name }}</span>
                <v-chip class="ms-2" size="small" color="primary" variant="outlined">
                  {{ sheets.length }} {{ $t('sheets') }}
                </v-chip>
                <v-chip
                  v-if="getActiveSheet()?.originalTotalRows > 0"
                  class="ms-2"
                  size="small"
                  color="secondary"
                  variant="outlined"
                >
                  {{ $t('totalRows') }}: {{ getActiveSheet()?.originalTotalRows }}
                </v-chip>
                <v-chip
                  v-if="useRowLimits && getActiveSheet()"
                  class="ms-2"
                  size="small"
                  color="info"
                  variant="outlined"
                >
                  {{ $t('showing') }}: {{ $t('rows') }} {{ getActiveSheet()?.startRow }} -
                  {{ getActiveSheet()?.endRow }}
                </v-chip>
              </div>

              <!-- Sheet Tabs -->
              <v-tabs v-model="activeSheet" bg-color="primary" centered>
                <v-tab v-for="sheet in sheets" :key="sheet.name" :value="sheet.name">
                  {{ sheet.name }}
                  <v-chip class="ms-1" size="x-small" color="primary">
                    {{ sheet.totalRows }}
                  </v-chip>
                </v-tab>
              </v-tabs>

              <v-window v-model="activeSheet">
                <v-window-item v-for="sheet in sheets" :key="sheet.name" :value="sheet.name">
                  <div class="mt-4">
                    <div v-if="sheet.data.length === 0" class="text-center pa-4">
                      <v-icon icon="mdi-table-off" size="large" color="grey"></v-icon>
                      <div class="text-body-1 mt-2">{{ $t('emptySheet') }}</div>
                    </div>
                    <div v-else>
                      <div class="text-caption mb-2">
                        {{ $t('showingFirst100Rows') }}
                      </div>
                      <v-data-table
                        :headers="sheet.headers.map((h) => ({ title: h, key: h, sortable: false }))"
                        :items="sheet.data"
                        :items-per-page="10"
                        class="elevation-1"
                        v-bind="tableProps"
                      ></v-data-table>
                    </div>
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>

          <!-- Column Mapping Stage -->
          <v-card
            v-if="sheets.length > 0 && databaseColumns.length > 0 && !mappingCompleted"
            variant="outlined"
            class="mb-4"
          >
            <v-card-title class="d-flex align-center py-3">
              <v-icon icon="mdi-table-sync" color="primary" class="me-2" />
              <span>{{ $t('columnMapping') }}</span>
            </v-card-title>
            <v-card-text>
              <v-tabs v-model="mappingTab">
                <v-tab value="mapping">{{ $t('columnMapping') }}</v-tab>
                <v-tab value="filters">{{ $t('dataFilters') }}</v-tab>
              </v-tabs>
              
              <v-window v-model="mappingTab" class="mt-4">
                <!-- نگاشت ستون‌ها -->
                <v-window-item value="mapping">
                  <p class="mb-4">{{ $t('columnMappingDescription') }}</p>
                  
                  <v-table>
                    <thead>
                      <tr>
                        <th>{{ $t('excelColumn') }}</th>
                        <th>{{ $t('databaseColumn') }}</th>
                        <th>{{ $t('required') }}</th>
                        <th>{{ $t('preview') }}</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(dbColumn, index) in databaseColumns" :key="index">
                        <td>
                          <v-select
                            v-model="columnMapping[dbColumn.field]"
                            :items="activeSheet ? getHeadersForMapping(getActiveSheet()) : []"
                            variant="outlined"
                            density="compact"
                            :label="dbColumn.title || dbColumn.field"
                            item-title="title"
                            item-value="key"
                            return-object
                            :disabled="mappingInProgress"
                          ></v-select>
                        </td>
                        <td>{{ dbColumn.title || dbColumn.field }}</td>
                        <td>
                          <v-chip
                            size="small"
                            :color="dbColumn.required ? 'error' : 'success'"
                            :text="dbColumn.required ? $t('yes') : $t('no')"
                          ></v-chip>
                        </td>
                        <td>
                          <span v-if="columnMapping[dbColumn.field] && getActiveSheet()?.data[0]">
                            {{ getActiveSheet()?.data[0][columnMapping[dbColumn.field].key] }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </v-window-item>
                
                <!-- فیلترهای داده -->
                <v-window-item value="filters">
                  <p class="mb-4">
                    {{ $t('dataFilterBackendDescription') }}
                    <v-icon icon="mdi-information" color="info" size="small" class="ms-1"></v-icon>
                  </p>
                  
                  <v-btn 
                    color="primary" 
                    variant="outlined" 
                    size="small" 
                    prepend-icon="mdi-plus"
                    class="mb-4" 
                    @click="addFilter"
                  >
                    {{ $t('addFilter') }}
                  </v-btn>
                  
                  <div v-if="filters.length === 0" class="text-center pa-4 grey lighten-3 rounded">
                    <v-icon icon="mdi-filter-off" color="grey" size="large"></v-icon>
                    <div class="text-body-1 mt-2">{{ $t('noFiltersApplied') }}</div>
                    <div class="text-caption mt-1">{{ $t('filtersWillBeAppliedInBackend') }}</div>
                  </div>
                  
                  <v-card v-for="(filter, index) in filters" :key="index" variant="outlined" class="mb-3 pa-3">
                    <div class="d-flex align-center mb-2">
                      <div class="text-subtitle-2">{{ $t('filter') }} #{{ index + 1 }}</div>
                      <v-spacer></v-spacer>
                      <v-btn 
                        icon="mdi-delete" 
                        variant="text" 
                        color="error" 
                        size="small" 
                        @click="removeFilter(index)"
                      ></v-btn>
                    </div>
                    
                    <v-row>
                      <v-col cols="12" sm="4">
                        <v-select
                          v-model="filter.column"
                          :items="activeSheet ? getHeadersForMapping(getActiveSheet()) : []"
                          item-title="title"
                          item-value="key"
                          return-object
                          :label="$t('column')"
                          variant="outlined"
                          density="compact"
                        ></v-select>
                      </v-col>
                      
                      <v-col cols="12" sm="4">
                        <v-select
                          v-model="filter.operator"
                          :items="filterOperators"
                          item-title="text"
                          item-value="value"
                          :label="$t('condition')"
                          variant="outlined"
                          density="compact"
                        ></v-select>
                      </v-col>
                      
                      <v-col cols="12" sm="4">
                        <v-text-field
                          v-if="showFilterValueInput(filter.operator)"
                          v-model="filter.value"
                          :label="$t('value')"
                          variant="outlined"
                          density="compact"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                    
                    <div class="text-caption mt-2 text-grey">
                      <v-icon icon="mdi-information-outline" size="x-small" class="me-1"></v-icon>
                      {{ $t('thisFilterWillBeAppliedInBackend') }}
                    </div>
                  </v-card>
                  
                  <!-- اضافه کردن توضیحات -->
                  <v-alert v-if="filters.length > 0" type="info" variant="outlined" class="mt-4" density="compact">
                    <div>{{ $t('backendFilteringInfo') }}</div>
                  </v-alert>
                </v-window-item>
              </v-window>
              
              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="primary"
                  :loading="mappingInProgress"
                  :disabled="!canCompleteMappingProcess"
                  @click="completeMapping"
                >
                  {{ $t('completeMapping') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Display Conversion Results -->
          <v-card v-if="mappingCompleted" variant="outlined">
            <v-card-title class="d-flex align-center py-3">
              <v-icon icon="mdi-check-circle-outline" color="success" class="me-2" />
              <span>{{ $t('dataMappingCompleted') }}</span>
            </v-card-title>
            <v-card-text>
              <!-- نمایش جدول داده‌های تبدیل شده -->
              <v-data-table
                :headers="
                  databaseColumns.map((col) => ({
                    title: col.title,
                    key: col.field,
                    sortable: false
                  }))
                "
                :items="mappedData.slice(0, 10)"
                :items-per-page="10"
                class="elevation-1 mb-4"
                v-bind="tableProps"
              ></v-data-table>

              <!-- نمایش خطاها و مشکلات -->
              <v-expansion-panels v-if="validationErrors.length > 0" class="mb-6">
                <v-expansion-panel>
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon color="error" class="me-2">mdi-alert-circle</v-icon>
                      {{ $t('validationErrors') }} ({{ validationErrors.length }})
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-data-table
                      :headers="[
                        { title: $t('row'), key: 'row', sortable: true, width: '80px' },
                        { title: $t('column'), key: 'column', sortable: true },
                        { title: $t('message'), key: 'message', sortable: false }
                      ]"
                      :items="validationErrors"
                      :items-per-page="5"
                      class="elevation-1"
                    ></v-data-table>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>

              <v-row class="mt-6">
                <v-col cols="12" md="6">
                  <v-card variant="outlined">
                    <v-card-title class="text-subtitle-1 py-2">
                      {{ $t('sendOptions') }}
                    </v-card-title>
                    <v-card-text>
                      <v-radio-group v-model="sendMethod" inline>
                        <v-radio :value="'bulk'" :label="$t('sendAsBulk')"></v-radio>
                        <v-radio :value="'individual'" :label="$t('sendIndividually')"></v-radio>
                      </v-radio-group>

                      <div class="text-caption mt-2">
                        <div v-if="sendMethod === 'bulk'">
                          <v-icon
                            icon="mdi-information-outline"
                            size="small"
                            color="info"
                            class="me-1"
                          ></v-icon>
                          {{ $t('bulkSendDescription', { count: mappedData.length }) }}
                        </div>
                        <div v-else>
                          <v-icon
                            icon="mdi-information-outline"
                            size="small"
                            color="info"
                            class="me-1"
                          ></v-icon>
                          {{ $t('individualSendDescription', { count: mappedData.length }) }}
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" md="6">
                  <v-card variant="outlined" height="100%">
                    <v-card-title class="text-subtitle-1 py-2">
                      {{ $t('dataStatistics') }}
                    </v-card-title>
                    <v-card-text>
                      <div class="d-flex align-center mb-2">
                        <v-icon
                          icon="mdi-table-row"
                          color="primary"
                          size="small"
                          class="me-2"
                        ></v-icon>
                        <span>{{ $t('totalRows') }}: {{ mappedData.length }}</span>
                      </div>
                      <div class="d-flex align-center mb-2">
                        <v-icon
                          icon="mdi-table-column"
                          color="primary"
                          size="small"
                          class="me-2"
                        ></v-icon>
                        <span>{{ $t('totalColumns') }}: {{ databaseColumns.length }}</span>
                      </div>
                      <div
                        v-if="validationWarnings > 0"
                        class="d-flex align-center mt-2 text-warning"
                      >
                        <v-icon icon="mdi-alert" color="warning" size="small" class="me-2"></v-icon>
                        <span>{{ $t('potentialIssues') }}: {{ validationWarnings }}</span>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>

              <div class="d-flex justify-end mt-4">
                <v-btn
                  color="success"
                  @click="sendToDatabase"
                  :loading="sendingData"
                  :disabled="sendingData"
                  prepend-icon="mdi-database-import"
                >
                  {{ $t('sendToDatabase') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import * as XLSX from 'xlsx'
import axios from 'axios'

export default {
  name: 'ExcelViewer',
  data() {
    return {
      // File properties
      file: null,
      loading: false,
      errorMessage: null,
      infoMessage: null,
      sheets: [],
      activeSheet: null,

      // Row limit options
      useRowLimits: false,
      startRow: 1,
      endRow: 100,

      // Mapping properties
      mappingCompleted: false,
      databaseColumns: [],
      columnMapping: {},
      mappingInProgress: false,
      mappedData: [],

      // Send options
      sendMethod: 'bulk', // Default to bulk
      sendingData: false,
      sendProgress: 0,
      sendTotal: 0,
      validationWarnings: 0, // For display in statistics

      // Table properties
      tableProps: {
        dense: true,
        headerProps: { sortable: false }
      },
      //Validation errors
      validationErrors: [],

      // Filter properties
      mappingTab: 'mapping',
      filters: [],
      filterOperators: [
        { text: this.$t('contains'), value: 'contains' },
        { text: this.$t('notContains'), value: 'notContains' },
        { text: this.$t('equal'), value: 'equal' },
        { text: this.$t('notEqual'), value: 'notEqual' },
        { text: this.$t('biggerThan'), value: 'gt' },
        { text: this.$t('biggerOrEqual'), value: 'gte' },
        { text: this.$t('smallerThan'), value: 'lt' },
        { text: this.$t('smallerOrEqual'), value: 'lte' },
        { text: this.$t('empty'), value: 'empty' },
        { text: this.$t('notEmpty'), value: 'notEmpty' }
      ],

      // متغیرهای جدید برای فیلترینگ بک‌اند
      filtersForBackend: [],         // فیلترهای آماده‌سازی شده برای ارسال به بک‌اند
      activeFiltersCount: 0,         // تعداد فیلترهای فعال
      filteringMethod: 'backend',    // نوع فیلترینگ (همیشه backend)
    }
  },

  computed: {
    canCompleteMappingProcess() {
      if (!this.databaseColumns || !Array.isArray(this.databaseColumns)) {
        return false
      }

      const requiredColumnsMapped = this.databaseColumns
        .filter((column) => column.required)
        .every(
          (column) =>
            this.columnMapping[column.field] !== null &&
            this.columnMapping[column.field] !== undefined
        )

      return requiredColumnsMapped
    }
  },

  methods: {
    // Fix for the importFile method that's causing the error
    importFile(fileInput) {
      // When using v-file-input with @update:model-value,
      // fileInput is directly the file object, not an event
      this.file = fileInput

      if (!this.file) {
        this.errorMessage = this.$t('pleaseSelectFile')
        return
      }

      this.processExcelFile()
    },

    clearError() {
      this.errorMessage = null
    },

    async processExcelFile() {
      if (!this.file) {
        this.errorMessage = this.$t('pleaseSelectFile')
        return
      }

      const fileName = this.file.name.toLowerCase()
      if (!fileName.endsWith('.xlsx') && !fileName.endsWith('.xls')) {
        this.errorMessage = this.$t('invalidExcelFormat')
        return
      }

      this.loading = true
      this.sheets = []

      try {
        const fileData = await this.readFileAsArrayBuffer(this.file)
        const workbook = XLSX.read(fileData, { type: 'array' })

        // Process workbook
        workbook.SheetNames.forEach((sheetName) => {
          const worksheet = workbook.Sheets[sheetName]
          const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          if (data.length > 0) {
            // همیشه سطر اول به عنوان هدر استفاده می‌شود
            const headers = data[0].map((header, index) => {
              return header ? header.toString() : `Column ${index + 1}`
            })

            // محاسبه محدوده سطرها برای استخراج
            let startRowIndex = 1 // پیش‌فرض از سطر دوم (بعد از هدر)
            let endRowIndex = data.length

            if (this.useRowLimits) {
              // تبدیل به عدد و اطمینان از اینکه مقادیر معتبر هستند
              startRowIndex = parseInt(this.startRow) || 1
              startRowIndex = Math.max(1, startRowIndex) // حداقل از سطر دوم شروع کند

              endRowIndex = parseInt(this.endRow) || data.length
              endRowIndex = Math.min(data.length, endRowIndex)

              // اطمینان از اینکه پایان بزرگتر از شروع است
              if (endRowIndex < startRowIndex) {
                endRowIndex = data.length
              }
            }

            const rows = []
            for (let i = startRowIndex; i < endRowIndex; i++) {
              if (i < data.length) {
                // اطمینان از وجود داده
                const row = {}
                data[i].forEach((cell, j) => {
                  row[headers[j] || `Column ${j + 1}`] = cell
                })
                rows.push(row)
              }
            }

            this.sheets.push({
              name: sheetName,
              headers: headers,
              data: rows,
              totalRows: endRowIndex - startRowIndex,
              originalTotalRows: data.length - 1, // تعداد کل سطرها در فایل اصلی
              startRow: startRowIndex,
              endRow: endRowIndex - 1
            })
          } else {
            this.sheets.push({
              name: sheetName,
              headers: [],
              data: [],
              totalRows: 0,
              originalTotalRows: 0
            })
          }
        })

        if (this.sheets.length > 0) {
          this.activeSheet = this.sheets[0].name
        }

        if (this.useRowLimits) {
          this.infoMessage = this.$t('rowLimitsApplied', {
            start: this.startRow,
            end: this.endRow
          })
        } else {
          this.infoMessage = this.$t('fileProcessedSuccessfully')
        }

        // Fetch database structure after processing file
        this.fetchDatabaseStructure()
      } catch (error) {
        console.error('Error processing Excel file:', error)
        this.errorMessage = this.$t('errorProcessingExcelFile')
      } finally {
        this.loading = false
      }
    },

    readFileAsArrayBuffer(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target.result)
        reader.onerror = (e) => reject(e)
        reader.readAsArrayBuffer(file)
      })
    },

    getHeaders(sheet) {
      if (!sheet.headers || sheet.headers.length === 0) return []

      return sheet.headers.map((header) => ({
        title: header,
        key: header,
        align: 'start',
        sortable: true
      }))
    },

    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    async fetchDatabaseStructure() {
      try {
        // For demonstration purposes, using mock data
        // In a real app, you'd call an API
        // const response = await axios.get('/api/table-structure/your-table-name');
        // this.databaseColumns = response.data.columns;

        // Mock data for testing
        this.databaseColumns = [
          { field: 'name', title: this.$t('name'), required: true, type: 'string' },
          { field: 'code', title: this.$t('code'), required: true, type: 'string' },
          { field: 'amount', title: this.$t('amount'), required: false, type: 'number' },
          { field: 'date', title: this.$t('date'), required: false, type: 'date' },
          { field: 'description', title: this.$t('description'), required: false, type: 'string' }
        ]

        // Initialize mapping values
        this.columnMapping = {}
        this.databaseColumns.forEach((column) => {
          this.columnMapping[column.field] = null
        })
      } catch (error) {
        this.errorMessage = this.$t('errorFetchingTableStructure')
      }
    },

    getActiveSheet() {
      return this.sheets.find((sheet) => sheet.name === this.activeSheet)
    },

    getHeadersForMapping(sheet) {
      if (!sheet || !sheet.headers) return []

      return sheet.headers.map((header) => ({
        title: header,
        key: header
      }))
    },

    async completeMapping() {
      this.mappingInProgress = true;
      this.validationErrors = [];
      
      try {
        const activeSheet = this.getActiveSheet();
        
        if (!activeSheet || !activeSheet.data) {
          throw new Error(this.$t('noDataAvailable'));
        }
        
        // به جای فیلتر کردن داده در فرانت‌اند، فقط آماده‌سازی می‌کنیم
        this.prepareFilteredData(activeSheet.data);
        
        // شبیه‌سازی داده‌های نگاشت شده
        this.mappedData = activeSheet.data.map((row, rowIndex) => {
          const mappedRow = {};
          
          // نگاشت ستون‌های اکسل به ستون‌های دیتابیس
          this.databaseColumns.forEach(dbColumn => {
            const excelColumn = this.columnMapping[dbColumn.field];
            
            if (excelColumn) {
              // گرفتن مقدار از ستون مناسب اکسل
              let value = row[excelColumn.key];
              
              // بررسی نوع داده و تبدیل آن
              if (dbColumn.type === 'number' && typeof value === 'string') {
                const numberValue = parseFloat(value);
                if (isNaN(numberValue)) {
                  this.validationErrors.push({
                    row: rowIndex + 1,
                    column: excelColumn.title,
                    message: this.$t('invalidNumberFormat')
                  });
                  value = null;
                } else {
                  value = numberValue;
                }
              } else if (dbColumn.type === 'date' && typeof value === 'string') {
                // تبدیل تاریخ
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                  this.validationErrors.push({
                    row: rowIndex + 1,
                    column: excelColumn.title,
                    message: this.$t('invalidDateFormat')
                  });
                  value = null;
                } else {
                  value = date.toISOString().split('T')[0];
                }
              }
              
              mappedRow[dbColumn.field] = value;
            } else if (dbColumn.required) {
              // اگر ستون اجباری نگاشت نشده است
              this.validationErrors.push({
                row: rowIndex + 1,
                column: dbColumn.title || dbColumn.field,
                message: this.$t('requiredColumnNotMapped')
              });
            }
          });
          
          return mappedRow;
        });
        
        // اگر خطاها زیاد باشند، هشدار نمایش دهیم اما فرایند را متوقف نکنیم
        if (this.validationErrors.length > 0) {
          this.infoMessage = this.$t('validationErrorsFound', { count: this.validationErrors.length });
        }
        
        // محاسبه هشدارهای اعتبارسنجی
        this.calculateValidationWarnings();
        
        // اعلام اتمام نگاشت
        this.mappingCompleted = true;
        this.infoMessage = this.$t('dataMappingCompleted');
        
      } catch (error) {
        this.errorMessage = error.message || this.$t('errorDuringMapping');
      } finally {
        this.mappingInProgress = false;
      }
    },

    prepareFilteredData(data) {
      // به جای فیلتر کردن داده، فقط فیلترها را آماده‌سازی می‌کنیم
      // و فقط بررسی می‌کنیم که فیلترها معتبر هستند
      const validFilters = this.filters.filter(filter => 
        filter.column && filter.operator && 
        (this.showFilterValueInput(filter.operator) ? filter.value !== undefined : true)
      );
      
      // برای نمایش به کاربر، تعداد فیلترهای فعال را ذخیره می‌کنیم
      this.activeFiltersCount = validFilters.length;
      
      // آماده‌سازی فیلترها برای ارسال به سرور
      this.filtersForBackend = validFilters.map(filter => ({
        columnKey: filter.column.key,
        columnName: filter.column.title,
        operator: filter.operator,
        value: filter.value
      }));
    },

    // Updated to set appropriate message properties instead of calling store
    setErrorMessage(message, type = 'error') {
      if (type === 'error') {
        this.errorMessage = message
        this.infoMessage = null
      } else {
        this.infoMessage = message
        this.errorMessage = null
      }

      // Auto-clear messages after 5 seconds
      setTimeout(() => {
        if (type === 'error') {
          this.errorMessage = null
        } else {
          this.infoMessage = null
        }
      }, 5000)
    },

    applyRowLimits() {
      if (!this.file) {
        return
      }

      // تنظیم مقادیر معتبر
      this.startRow = parseInt(this.startRow) || 1
      this.endRow = parseInt(this.endRow) || 100

      // اطمینان از صحت مقادیر
      this.startRow = Math.max(1, this.startRow)
      if (this.endRow < this.startRow) {
        this.endRow = this.startRow + 10
      }

      // پردازش مجدد فایل با محدودیت‌های جدید
      this.processExcelFile()
    },

    /**
     * Send data to database according to selected method
     */
    async sendToDatabase() {
      this.sendingData = true;
      this.sendProgress = 0;
      this.sendTotal = this.mappedData.length;

      try {
        // اضافه کردن فیلترها به پارامترهای ارسالی
        const requestData = {
          data: this.mappedData,
          filters: this.filtersForBackend, // فیلترهای آماده شده برای بک‌اند
          mapping: this.getColumnMappingForBackend(),
          sendMethod: this.sendMethod,
          rowLimits: this.useRowLimits ? {
            startRow: this.startRow,
            endRow: this.endRow
          } : null
        };

        if (this.sendMethod === 'bulk') {
          await this.sendDataInBulk(requestData);
        } else {
          await this.sendDataIndividually(requestData);
        }

        this.infoMessage = this.$t('dataSentSuccessfully', {
          count: this.mappedData.length,
          method: this.$t(this.sendMethod === 'bulk' ? 'bulk' : 'individual')
        });

        this.$emit('data-sent', {
          count: this.mappedData.length,
          method: this.sendMethod,
          filters: this.filtersForBackend
        });
      } catch (error) {
        console.error('Error sending data to database:', error);
        this.errorMessage = this.$t('errorSendingData');
      } finally {
        this.sendingData = false;
      }
    },

    getColumnMappingForBackend() {
      // تبدیل نگاشت ستون‌ها به فرمت مناسب برای بک‌اند
      const mapping = {};
      
      Object.keys(this.columnMapping).forEach(dbField => {
        if (this.columnMapping[dbField]) {
          mapping[dbField] = {
            excelKey: this.columnMapping[dbField].key,
            excelTitle: this.columnMapping[dbField].title,
            required: this.databaseColumns.find(col => col.field === dbField)?.required || false,
            type: this.databaseColumns.find(col => col.field === dbField)?.type || 'string'
          };
        }
      });
      
      return mapping;
    },

    /**
     * Send all data in a single API call
     */
    async sendDataInBulk(requestData) {
      // در یک پروژه واقعی، این متد یک درخواست API ارسال می‌کند
      // ارسال کامل داده و فیلترها به بک‌اند برای پردازش
      // const response = await axios.post('/api/import-excel-data', requestData);
      
      console.log('Sending data to backend with filters:', requestData.filters);
      
      // شبیه‌سازی درخواست API برای نمایش
      await new Promise(resolve => setTimeout(resolve, 1500));
      return true;
    },

    /**
     * Send data one by one in separate API calls
     */
    async sendDataIndividually(requestData) {
      // ارسال تک به تک با در نظر گرفتن فیلترها در بک‌اند
      const total = this.mappedData.length;
      let successful = 0;
      
      // ارسال فیلترها فقط یکبار به بک‌اند
      // const filtersResponse = await axios.post('/api/set-import-filters', { 
      //   filters: requestData.filters,
      //   mapping: requestData.mapping 
      // });
      
      console.log('Setting filters in backend:', requestData.filters);
      
      for (let i = 0; i < total; i++) {
        try {
          // ارسال هر رکورد به بک‌اند - بک‌اند فیلترها را از قبل دارد
          // const response = await axios.post('/api/import-single-record', { 
          //   record: this.mappedData[i],
          //   index: i
          // });
          
          // شبیه‌سازی درخواست API برای نمایش
          await new Promise(resolve => setTimeout(resolve, 100));
          
          successful++;
          this.sendProgress = Math.floor((i + 1) / total * 100);
        } catch (error) {
          console.error(`Error sending record ${i + 1}:`, error);
        }
      }
      
      return successful === total;
    },

    /**
     * Calculate validation warnings from mapped data for statistics
     */
    calculateValidationWarnings() {
      this.validationWarnings = this.mappedData.reduce((count, row) => {
        // بررسی مقادیر null یا undefined
        const nullValues = Object.values(row).filter(
          (val) => val === null || val === undefined
        ).length

        // بررسی رشته‌های خالی
        const emptyStrings = Object.values(row).filter((val) => val === '').length

        return count + nullValues + emptyStrings
      }, 0)
    },

    addFilter() {
      this.filters.push({
        column: null,
        operator: 'contains',
        value: ''
      })
    },

    removeFilter(index) {
      this.filters.splice(index, 1)
    },

    showFilterValueInput(operator) {
      return !['empty', 'notEmpty'].includes(operator)
    },

    applyFilters(data) {
      if (!this.filters.length) return data
      
      return data.filter(row => {
        return this.filters.every(filter => {
          if (!filter.column) return true
          
          const cellValue = row[filter.column.key]
          const filterValue = filter.value
          
          switch (filter.operator) {
            case 'contains':
              return String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())
            case 'notContains':
              return !String(cellValue).toLowerCase().includes(String(filterValue).toLowerCase())
            case 'equal':
              return cellValue == filterValue
            case 'notEqual':
              return cellValue != filterValue
            case 'gt':
              return Number(cellValue) > Number(filterValue)
            case 'gte':
              return Number(cellValue) >= Number(filterValue)
            case 'lt':
              return Number(cellValue) < Number(filterValue)
            case 'lte':
              return Number(cellValue) <= Number(filterValue)
            case 'empty':
              return cellValue === null || cellValue === undefined || cellValue === ''
            case 'notEmpty':
              return cellValue !== null && cellValue !== undefined && cellValue !== ''
            default:
              return true
          }
        })
      })
    }
  },

  // اضافه کردن هوک چرخه حیات برای محاسبه هشدارها
  watch: {
    mappedData: {
      handler() {
        this.calculateValidationWarnings()
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.v-card-title {
  background-color: #f5f5f5;
}
.excel-table-container {
  overflow-x: auto;
}
</style>
