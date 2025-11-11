import { useI18n } from 'vue-i18n'
import Editable from '../editable.vue'
import utils from '../../../../plugins/utils'
import { mapState } from 'pinia'
import { defaultStore } from '../../../stores/default'

function dynamicSort(property, order = 'asc') {
  let ord = order === 'asc' ? 1 : -1
  return function (a, b) {
    var result = a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0
    return result * ord
  }
}
// function dynamicSortMultiple(items) {
//   var props = items
//   return function (obj1, obj2) {
//     var i = 0,
//       result = 0,
//       numberOfProperties = props.length
//     while (result === 0 && i < numberOfProperties) {
//       result = dynamicSort(props[i])(obj1, obj2)
//       i++
//     }
//     return result
//   }
// }
var debounceSearchTimeout

export default {
  props: {
    showSettingIcon: { default: () => true },
    arrowCondition: {
      required: false,
      default: () => true
    },
    maxHeight: {
      required: false
    },
    hasEnter: {
      required: false
    },
    hasSearch: {
      required: false
    },
    preventClientSideSearch: {
      required: false,
      default: () => false
    },
    searchText: {
      default: () => ''
    },
    bigSearch: {
      required: false
    },
    searchLabel: {
      required: false
    },
    searchItems: {
      required: false
    },
    clickableRow: {
      required: false
    },
    selectableRow: {
      required: false,
      default: () => false
    },
    selectedRow: {
      required: false
    },
    itemValue: {
      default: () => 'id'
    },
    items: {
      required: true,
      default: () => []
    },
    headers: {
      required: true,
      default: () => []
    },
    noResultText: { default: () => 'noItems' },
    showPagination: {
      default: () => true
    },
    pagination: {
      default: () => {
        return {
          ofText: 'of',
          rowPerPageText: 'rowsPerPage',
          rowsPerPageItems: [10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'all'],
          page: 1
        }
      }
    },
    isServerSide: {
      type: Boolean,
      default: false
    },
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    totalCount: {
      type: Number,
      default: 0
    }
  },
  emits: [
    'rowClick',
    'rowDblClick',
    'update:selectedRow',
    'enterMethod',
    'update:search',
    'update:page',
    'update:pageSize'
  ],
  components: {
    Editable
  },
  data() {
    return {
      randomNumber: 0,
      _searchText: this.searchText,
      dialogOrder: 0,
      sortBy: '0',
      selectedItem: {},
      allItemsCount: 0,
      _pagination: {
        ofText: 'of',
        rowPerPageText: 'rowsPerPage',
        rowsPerPageItems: [10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 'all'],
        rowsPerPage: this.pageSize,
        page: this.page,
        currentTabName: ''
      }
    }
  },
  watch: {
    items: {
      deep: true,
      handler(val) {
        if (!val || val.length < 1) {
          this._pagination.page = 1
        }
        setTimeout(() => {
          var tables = document.getElementsByTagName('table')
          for (var i = 0; i < tables.length; i++) {
            resizableGrid(tables[i])
          }
        }, 100)
      }
    },
    tab(value) {
      if (this.currentTabName == this.tabs?.find((t) => t.isActive).name && this.hasSearch) {
        setTimeout(() => {
          this.$refs.tableSearchText.focus()
        }, 100)
      }
    },
    selectedItem: {
      handler(val, oldVal) {
        if (!oldVal || Object.keys(oldVal).length < 1) {
          this.ensureVisible()
        }
      }
    },
    selectedRow: {
      handler(val, oldVal) {
        this.selectedItem = val
      }
    },
    _searchText(val) {
      // Clear the previous timeout
      if (debounceSearchTimeout) {
        clearTimeout(debounceSearchTimeout)
      }
      // Set a new timeout
      debounceSearchTimeout = setTimeout(() => {
        this.$emit('update:search', val)
      }, 400)
    },
    page(val) {
      this._pagination.page = val
    },
    pageSize(val) {
      this._pagination.rowsPerPage = val
    },
    totalCount(val) {
      this.allItemsCount = val
    }
  },
  computed: {
    ...mapState(defaultStore, {
      tabs: 'tabs'
    }),
    tab: {
      get() {
        return this.tabs.findIndex((x) => x.isActive)
      },
      set() {}
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      }
    },
    _items() {
      // this.randomNumber += this.randomNumber
      var lst = [...this.items]
      if (this.hasSearch && !this.preventClientSideSearch)
        lst = this.items.filter((a) => utils.filterBySearch(this._searchText, this.searchItems, a))
      this.headers
        .filter((x) => x.sortable && x.sort)
        ?.forEach((element) => {
          lst = lst.sort(dynamicSort(element.key, element.sort))
        })
      this.sortBy?.toString()
      if (
        lst.length > 0 &&
        (!this.selectedItem || Object.keys(this.selectedItem).length < 1) &&
        this.selectableRow
      ) {
        this.selectedItem =
          this.selectedRow && Object.keys(this.selectedRow).length > 0
            ? this.selectedRow
            : lst[0] || {}
        this.$emit('update:selectedRow', this.selectedItem)
      }
      this.allItemsCount = lst.length
      let idx = lst.findIndex((x) => x[this.itemValue] == this.selectedItem[this.itemValue])
      let isVisible =
        idx >= 0
          ? idx <
            (this._pagination.rowsPerPage !== 'all' ? this._pagination.rowsPerPage - 1 : lst.length)
          : false
      let rpp = this._pagination.rowsPerPageItems.filter((x) => x > idx)
      if (!isVisible && this.selectedItem && Object.keys(this.selectedItem).length > 0) {
        this._pagination.rowsPerPage = rpp[0] || 'all'
      }
      let startIdx = (this._pagination.page - 1) * this._pagination.rowsPerPage
      let endIdx = this._pagination.page * this._pagination.rowsPerPage
      lst =
        this._pagination.rowsPerPage == 'all' || this.isServerSide
          ? lst
          : lst.slice(startIdx, endIdx)

      return lst
    },
    pageCounts() {
      return this.isServerSide
        ? Math.ceil((this.totalCount || 1) / this._pagination.rowsPerPage)
        : this._pagination.rowsPerPage == 'all'
        ? 1
        : Math.ceil((this.items?.length || 1) / this._pagination.rowsPerPage)
    },
    hasNextPage() {
      return this.pageCounts > this._pagination.page
    },
    hasPrevPage() {
      return this._pagination.page > 1
    }
  },
  methods: {
    onContextMenu(e, item) {
      if (item?.contexts) {
        this.rowClick(item)
        e.preventDefault()
        this.$contextmenu({
          items: item.contexts,
          theme: this.$vuetify.theme.global.name == 'light' ? 'win10' : 'win10 dark',
          iconFontClass: 'iconfont',
          zIndex: 3,
          minWidth: 230,
          x: e.x,
          y: e.y
        })
      }
    },
    rowClick(row) {
      if (this.selectableRow) {
        this.selectedItem = row
        this.$emit('update:selectedRow', row)
      } else this.$emit('rowClick', row)
    },
    rowDblClick(row) {
      if (this.selectableRow) {
        this.selectedItem = row
        this.$emit('update:selectedRow', row)
      }
      this.$emit('enterMethod', row)
    },
    onEdit(item, key) {
      // this.focusNext(key)
    },
    focusNext(key) {
      let inputs = Array.prototype.slice.call(document.querySelectorAll(`[id='${key}']`))
      const currInput = document.activeElement
      const currInputIndex = inputs.indexOf(currInput)
      const nextinputIndex = (currInputIndex + 1) % inputs.length
      const input = inputs[nextinputIndex]

      input.focus()
    },
    nextPage() {
      if (this._pagination.page === this.pageCounts) return
      this._pagination.page++
      if (this.isServerSide) {
        this.$emit('update:page', this._pagination.page)
      }
    },
    prevPage() {
      if (this._pagination.page < 2) return
      this._pagination.page--
      if (this.isServerSide) {
        this.$emit('update:page', this._pagination.page)
      }
    },
    firstPage() {
      this._pagination.page = 1
      if (this.isServerSide) {
        this.$emit('update:page', this._pagination.page)
      }
    },
    lastPage() {
      this._pagination.page = this.pageCounts
      if (this.isServerSide) {
        this.$emit('update:page', this._pagination.page)
      }
    },
    updatePageSize() {
      this._pagination.page = 1
      if (this.isServerSide) {
        this.$emit('update:pageSize', this._pagination.rowsPerPage)
        this.$emit('update:page', 1)
      }
    },
    //pagination
    sort(item) {
      this.sortBy = item.sort
      this.headers.filter((z) => z != item).forEach((a) => (a.sort = ''))
      switch (item.sort) {
        case 'asc':
          item.sort = 'desc'
          break
        case 'desc':
          item.sort = ''
          break
        default:
          item.sort = 'asc'
          break
      }
    },
    handleKeyPress(e) {
      if (
        document.activeElement === this.$refs.dataTable ||
        document.activeElement === this.$refs?.tableSearchText?.$el?.querySelector('input')
      ) {
        if (this.hasEnter && e.key == 'Enter') this.$emit('enterMethod')

        // if (this.dialogOrder !== this.getLastActiveDialogOrder()) {
        //   return
        // }
        // if (this.hasSearch && !this.$refs.tableSearchText.focused && e.key == '/' && e.ctrlKey)
        //   this.$refs.tableSearchText.focus()

        // if (this.hasEnter && e.key == 'Enter') this.$emit('enterMethod')

        if (this.selectableRow) {
          let selectedIndex =
            this._items.findIndex((a) => a[this.itemValue] == this.selectedItem[this.itemValue]) ||
            0
          if (e.key == 'ArrowDown') {
            if (selectedIndex < this._items.length - 1) {
              let nextRow = this._items[selectedIndex + 1]
              this.selectedItem = nextRow
              this.$emit('update:selectedRow', nextRow)
            } else {
              this.$emit('update:selectedRow', this._items[0])
              this.selectedItem = this._items[0]
            }
          } else if (e.key == 'ArrowUp') {
            if (selectedIndex > 0) {
              let prevRow = this._items[selectedIndex - 1]
              this.selectedItem = prevRow
              this.$emit('update:selectedRow', prevRow)
            } else {
              this.$emit('update:selectedRow', this._items[this._items.length - 1])
              this.selectedItem = this._items[this._items.length - 1]
            }
          }
          this.ensureVisible()
        }
      }
    },
    onkeydown(e) {
      if (this.hasSearch && !this.$refs.tableSearchText.focused && e.key == '/' && e.ctrlKey)
        this.$refs.tableSearchText.focus()
    },
    generateRandNumber() {
      const englishCharactersAndNumbers = [
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)), // Uppercase letters (A-Z)
        ...Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i)), // Lowercase letters (a-z)
        ...Array.from({ length: 10 }, (_, i) => i.toString()) // Numbers (0-9)
      ]
      let key = ''
      for (let i = 0; i < 10; i++) {
        var randNumber =
          Math.floor(Math.random() * (englishCharactersAndNumbers.length - 1 - 0 + 1)) + 0
        key += englishCharactersAndNumbers[randNumber].toString()
      }
      return key
    },
    getLastActiveDialogOrder() {
      let dialogs = [...document.getElementsByClassName('data-table-custom')]
      if (dialogs) {
        let orderedDialogs = dialogs
          ?.map((x) => x.getAttribute('data-order'))
          .sort(function (a, b) {
            return a - b
          })
        return parseInt(orderedDialogs[orderedDialogs.length - 1])
      }
      return 0
    },
    ensureVisible() {
      try {
        let container = document.querySelectorAll(`[data-order="${this.dialogOrder}"]`)[0]
        let element = container.getElementsByClassName('selected-row')[0]
        if (!element) return
        element.scrollIntoView({ block: 'center' })
      } catch (error) {
        // console.error(error);
      }
    }
  },
  mounted() {
    this.currentTabName = this.currentActiveTab.name
    this.headers.forEach((element) => {
      if (!element.hasOwnProperty('show')) element.show = true
    })
    window.addEventListener('keydown', this.onkeydown)
    if (this.hasSearch && this.$refs.tableSearchText) this.$refs.tableSearchText.focus()
    this.dialogOrder = this.getLastActiveDialogOrder() + 1
  },
  created() {
    this._pagination = { ...this.pagination }
    this._pagination.rowsPerPage = this._pagination.rowsPerPageItems[0]
  },
  unmounted() {
    window.removeEventListener('keydown', this.onkeydown)
  }
}

function resizableGrid(table) {
  var row = table.getElementsByTagName('tr')[0],
    cols = row ? row.children : undefined
  if (!cols) return

  table.style.overflow = 'hidden'

  var tableHeight = table.offsetHeight
  var isRTL = window.getComputedStyle(table).direction === 'rtl'

  for (var i = 0; i < cols.length; i++) {
    var div = createDiv(tableHeight, isRTL)
    cols[i].appendChild(div)
    cols[i].style.position = 'relative'
    setListeners(div, isRTL)
  }

  function setListeners(div, isRTL) {
    var pageX, curCol, nxtCol, curColWidth, nxtColWidth

    div.addEventListener('mousedown', function (e) {
      curCol = e.target.parentElement
      nxtCol = curCol.nextElementSibling
      pageX = e.pageX

      var padding = paddingDiff(curCol)

      curColWidth = curCol.offsetWidth - padding
      if (nxtCol) nxtColWidth = nxtCol.offsetWidth - padding
    })

    div.addEventListener('mouseover', function (e) {
      e.target.style[isRTL ? 'borderLeft' : 'borderRight'] = '2px solid #0000ff'
    })

    div.addEventListener('mouseout', function (e) {
      e.target.style[isRTL ? 'borderLeft' : 'borderRight'] = ''
    })

    document.addEventListener('mousemove', function (e) {
      if (curCol) {
        var diffX = e.pageX - pageX
        // Reverse the direction of resize in RTL
        var adjustedDiffX = isRTL ? -diffX : diffX

        if (nxtCol) nxtCol.style.width = nxtColWidth - adjustedDiffX + 'px'

        curCol.style.width = curColWidth + adjustedDiffX + 'px'
      }
    })

    document.addEventListener('mouseup', function (e) {
      curCol = undefined
      nxtCol = undefined
      pageX = undefined
      nxtColWidth = undefined
      curColWidth = undefined
    })
  }

  function createDiv(height, isRTL) {
    var div = document.createElement('div')
    div.style.top = 0
    // Position handle on left for RTL, right for LTR
    div.style[isRTL ? 'left' : 'right'] = 0
    div.style.width = '5px'
    div.style.position = 'absolute'
    div.style.cursor = 'col-resize'
    div.style.userSelect = 'none'
    div.style.height = height + 'px'
    return div
  }

  function paddingDiff(col) {
    if (getStyleVal(col, 'box-sizing') == 'border-box') {
      return 0
    }

    var padLeft = getStyleVal(col, 'padding-left')
    var padRight = getStyleVal(col, 'padding-right')
    return parseInt(padLeft) + parseInt(padRight)
  }

  function getStyleVal(elm, css) {
    return window.getComputedStyle(elm, null).getPropertyValue(css)
  }
}
