/* eslint-disable */

import TreeviewItem from './treeviewItem/treeviewItem.vue'

export default {
  name: 'CustomTreeviewComponent',
  components: {
    TreeviewItem
  },
  data() {
    return {
      isFocused: false,
      isParentFound: false
    }
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    isLtr: {
      required: false,
      default: false
    },
    hasEnter: {
      required: false,
      default: false
    }
  },
  emits: ['activeChanged', 'enterMethod'],
  data() {
    return {
      dragItem: {},
      dragTargetItem: {}
      // lastOpenItems: []
    }
  },
  computed: {
    model: {
      get() {
        let idList = []
        this._recursiveSearch(
          this.modelValue,
          null,
          null,
          'children',
          null,
          (list, keyName, keyValue, subListName, i) => {
            var id = ''
            do {
              id = this.generateRandomKey(8)
            } while (idList.indexOf(id) > -1)
            idList.push(id)
            list[i]._id = id
            // if (this.lastOpenItems.includes(list[i].id)) {
            //   list[i].open = true
            // }
          }
        )
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    }
  },
  methods: {
   
    setDragItem(item) {
      this.dragItem = { ...item }
    },
    onFocusHandler(event) {
      this.isFocused = true
    },
    onBlurHandler(event) {
      this.isFocused = false
    },
    setDragTargetItem(item) {
      let targetObj = { ...item }
      if (
        targetObj._id === this.dragItem._id ||
        this.dragItem.children?.some((x) => x._id === targetObj._id)
      ) {
        return
      }
      this._recursiveSearch(
        this.model,
        '_id',
        this.dragItem._id,
        'children',
        true,
        (list, keyName, keyValue, subListName, i) => {
          list.splice(i, 1)
          if (!item.children) {
            item.children = []
          }
          item.children.push({ ...this.dragItem })
        }
      )
    },
    setActiveItem(item) {
      this._recursiveSearch(
        this.modelValue,
        'active',
        true,
        'children',
        true,
        (list, keyName, keyValue, subListName, i) => {
          list[i].active = false
        }
      )
      item.active = true
      this.$emit('activeChanged', item)
    },
    generateRandomKey(length) {
      var result = ''
      var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
      var charactersLength = characters.length
      for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength))
      }
      return result
    },
    lastVisibleItemSearch(item) {
      if (!(item.open && item.children.length > 0)) return item
      let result = this.lastVisibleItemSearch(item.children[item.children.length - 1])
      if (result) return result
      return null
    },
    nextVisibleItemSearch(item) {
      let parent = this.parentSearch(this.modelValue, item.id)
      if (parent) {
        let index = parent.children.indexOf(item)
        if (index != parent.children.length - 1) {
          return parent.children[index + 1]
        }
        let result = this.nextVisibleItemSearch(parent)
        if (result) {
          return result
        }
      }
      return null
    },
    parentSearch(array, id) {
      // loop through the array
      for (let item of array) {
        // check if the item has the same id as the target id
        if (item.children.some((a) => a.id == id)) {
          // return the item
          return item
        }
        // check if the item has a children property that is an array
        if (Array.isArray(item.children)) {
          // recursively call the function on the children array
          let result = this.parentSearch(item.children, id)
          // if the result is not null, return it
          if (result) {
            return result
          }
        }
      }
      // if no match is found, return null
      return null
    },
    itemSearchByActive(array) {
      // loop through the array
      for (let item of array) {
        // check if the item has the same id as the target id
        if (item.active) {
          // return the item
          return item
        }
        // check if the item has a children property that is an array
        if (Array.isArray(item.children)) {
          // recursively call the function on the children array
          let result = this.itemSearchByActive(item.children)
          // if the result is not null, return it
          if (result) {
            return result
          }
        }
      }
      // if no match is found, return null
      return null
    },
    _recursiveSearch(
      list,
      keyName = 'id',
      keyValue = null,
      subListName = 'children',
      equalToValue = true,
      callback
    ) {
      let resultList = []
      let parentList = []
      for (let i = 0; i < list.length; i++) {
        const x = list[i]
        if (!keyValue) {
          if (callback) {
            callback.call(this, list, keyName, keyValue, subListName, i)
          }
          if (x[subListName] && x[subListName].length > 0) {
            this._recursiveSearch(
              x[subListName],
              keyName,
              keyValue,
              subListName,
              equalToValue,
              callback
            )
          }
        } else {
          if (
            (equalToValue && x[keyName] === keyValue) ||
            (!equalToValue && x[keyName].includes(keyValue))
          ) {
            if (callback) {
              callback.call(this, list, keyName, keyValue, subListName, i)
            }
            resultList.push(x)
            continue
          }
          if (x[subListName] && x[subListName].length > 0) {
            const item = this._recursiveSearch(
              x[subListName],
              keyName,
              keyValue,
              subListName,
              equalToValue,
              callback
            )
            if (!item || item.length < 1) continue
            resultList = [...item]
          }
        }
      }
      return resultList
    },
    onkeydown(e) {
      if (this.hasEnter && e.key == 'Enter') this.$emit('enterMethod')

      if (this.isFocused) {
        let selectedItem = this.itemSearchByActive(this.modelValue)

        if (selectedItem) {
          let parent = this.parentSearch(this.modelValue, selectedItem.id)

          //Arrow Right
          if (
            (e.keyCode == 37 && this.$i18n.locale == 'fa') ||
            (e.keyCode == 39 && this.$i18n.locale == 'en')
          )
            selectedItem.open = this.isLtr ? false : true
          //Arrow Left
          if (
            (e.keyCode == 39 && this.$i18n.locale == 'fa') ||
            (e.keyCode == 37 && this.$i18n.locale == 'en')
          )
            selectedItem.open = this.isLtr ? true : false
          //Arrow Up
          if (e.keyCode == 38) {
            e.preventDefault()
            let activeEle =
              document.getElementsByClassName('tv-item-active')[
                document.getElementsByClassName('tv-item-active').length - 1
              ]
            activeEle.scrollIntoView({ behavior: 'smooth', block: 'center' })
            if (parent) {
              let index = parent.children.indexOf(selectedItem)
              if (index == 0) this.setActiveItem(parent)
              else this.setActiveItem(this.lastVisibleItemSearch(parent.children[index - 1]))
            }
          }
          //Arrow Down
          if (e.keyCode == 40) {
            e.preventDefault()
            let activeEle =
              document.getElementsByClassName('tv-item-active')[
                document.getElementsByClassName('tv-item-active').length - 1
              ]
            activeEle.scrollIntoView({ behavior: 'smooth', block: 'center' })
            if (selectedItem.open && selectedItem.children?.length > 0)
              this.setActiveItem(selectedItem.children[0])
            else {
              if (parent) {
                let nextItem = this.nextVisibleItemSearch(selectedItem)
                if (nextItem) this.setActiveItem(nextItem)
              }
            }
          }
        } else this.setActiveItem(this.modelValue[0])
      }
    }
  },
  async mounted() {
    document.addEventListener('keydown', this.onkeydown)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  }
}
/* eslint-disable */
