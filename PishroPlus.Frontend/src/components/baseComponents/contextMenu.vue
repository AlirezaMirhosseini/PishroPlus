<template>
  <div id="context-menu" class="context-menu">
    <slot name="body"></slot>
  </div>
</template>

<script>
export default {
  name: 'ContextMenuComponent',
  props: {
    pointX: {
      type: Number,
      default: 0,
    },
    pointY: {
      type: Number,
      default: 0,
    },
    value: {
      required: true,
      default: () => false,
    },
  },
  watch: {
    value(val) {
      if (val) this.showContextMenu()
    },
  },
  mounted() {
    window.addEventListener('mousedown', this.hideContextMenu)
  },
  beforeDestroy() {
    window.removeEventListener('mousedown', this.hideContextMenu)
  },
  methods: {
    hideContextMenu() {
      const contextMenuBox = document.getElementById('context-menu')
      contextMenuBox.style = ''
      this.$emit('input', false)
    },
    showContextMenu() {
      this.hideContextMenu()
      const contextMenuBox = document.getElementById('context-menu')
      contextMenuBox.style.display = 'block'
      // subtract 56px because of header
      contextMenuBox.style.top = `${this.pointY - 60}px`
      contextMenuBox.style.left = `${
        this.pointX - contextMenuBox.offsetWidth
      }px`
    },
  },
}
</script>

<style scoped>
.context-menu {
  position: absolute;
  min-height: 50px;
  min-width: 90px;
  padding: 10px;
  background-color: white;
  display: none;
  z-index: 100;
  border-radius: 3px;
  box-shadow: 0px 0px 5px 0px;
}
.context-menu ul {
  list-style: none;
  width: 100%;
  padding: 0 !important;
  cursor: pointer;
}
.context-menu li {
  width: 100%;
  font-size: 0.8rem;
  margin-bottom: 3px;
  cursor: pointer;
}
</style>
