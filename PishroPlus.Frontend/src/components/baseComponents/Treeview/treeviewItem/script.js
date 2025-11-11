export default {
  name: 'TreeviewItem',
  data() {
    return {
      indeterminate: false
    }
  },
  props: {
    modelValue: {
      default: () => {
        return {
          title: '',
          id: '',
          open: true,
          draggable: true,
          notClickable: false,
          parent: {},
          showFullText: false,
          canDropOutside: false
        }
      }
    }
  },
  watch: {
    modelValue: {
      handler(value, oldValue) {
        if (value.children?.length > 0)
          if (value.children.every((z) => z.checked)) {
            value.checked = true
            this.indeterminate = false
          } else if (value.children.some((a) => a.checked)) {
            value.checked = false
            this.indeterminate = true
          } else {
            value.checked = false
            this.indeterminate = false
          }
      },
      deep: true
    }
  },
  methods: {
    truncatedText(text) {
      console.log(text)
      return text.length > 200 ? text.substring(0, 200) + '...' : text
    },
    // truncatedText(text) {
    //   const maxLength = 20; // طول حداکثر متن
    //   return text.length > maxLength ? '...' + text.substring(text.length - maxLength) : text;
    // },
    onContextMenu(e) {
      if (this.modelValue?.contexts) {
        this.setActiveItem(this.modelValue)
        e.preventDefault()
        this.$contextmenu({
          items: this.modelValue.contexts,
          theme: this.$vuetify.theme.global.name == 'light' ? 'win10' : 'win10 dark',
          iconFontClass: 'iconfont',
          zIndex: 3,
          minWidth: 230,
          x: e.x,
          y: e.y
        })
      }
    },
    checkChildren(value, item) {
      if (item.children?.length > 0)
        item.children.forEach((element) => {
          element.checked = value
          if (element.children?.length > 0) this.checkChildren(value, element)
        })
    },
    update(value, item) {
      item.checked = value
      this.checkChildren(value, item)
    },
    onDragStart(item, event) {
      // event.stopPropagation()
      if (item.canDropOutside) event.dataTransfer.setData('application/json', JSON.stringify(item))
      this.$emit('dragStarted', item)
    },
    onDragFinished(item) {
      this.$emit('dragFinished', item)
    },
    setActiveItem(item) {
      if (!item.notClickable) this.$emit('activated', item)
    },
    onFocusHandler(event) {
      this.$emit('focusHandler', event)
    },
    onBlurHandler(event) {
      this.$emit('blurHandler', event)
    },
    handleKeyDown(event) {
      if (this.modelValue.active && this.modelValue.children?.length > 0) {
        if (event.key === 'Enter' || event.key === '+') {
          event.preventDefault()
          this.modelValue.open = true
        } else if (event.key === 'Enter' || event.key === '-') {
          event.preventDefault()
          this.modelValue.open = false
        }
      }
    },
    toggleNode() {
      if (this.modelValue.children?.length > 0) {
        this.modelValue.open = !this.modelValue.open
      }
    }
  },

  mounted() {
    if (this.modelValue.children?.length > 0)
      if (this.modelValue.children.every((z) => z.checked)) {
        this.modelValue.checked = true
        this.indeterminate = false
      } else if (this.modelValue.children.some((a) => a.checked)) {
        this.modelValue.checked = false
        this.indeterminate = true
      } else {
        this.modelValue.checked = false
        this.indeterminate = false
      }
  }
}
