<template>
  <label :class="['switch', $attrs.class]">
    <input :disabled="disabled" v-model="checkbox" type="checkbox" @click="toggleCheckbox" />
    <div class="slider round">
      <div id="slide-toggle" class="px-6">{{ label }}</div>
    </div>
  </label>
</template>

<script>
export default {
  data() {
    return {
      checkbox: false
    }
  },
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      required: false
    }
  },
  emits: ['update:checked'],
  methods: {
    toggleCheckbox() {
      this.checkbox = !this.checkbox
      this.$emit('update:checked', this.checkbox)
    }
  },
  watch: {
    checkBox(val) {
      if (!val) {
      }
    }
  },
  mounted() {
    this.checkbox = this.checked
  }
}
</script>

<style>
.switch {
  position: relative;
  width: 70px !important;
  height: 41px !important;
  display: flex;
  padding-inline: 40px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgb(var(--v-theme-primary), 0.3);
  -webkit-transition: 0.4s ease;
  transition: 0.4s ease;
}

#slide-toggle {
  position: absolute;
  height: 41px;
  width: 35px;
  left: 0px;
  bottom: 0px;
  background-color: rgb(var(--v-theme-primary));
  -webkit-transition: 0.4s ease;
  transition: 0.4s ease;
  border-radius: 5px;
  text-wrap: nowrap;
  font-size: 0.6rem;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

input:checked + .slider {
  background-color: rgb(var(--v-theme-info), 0.3);
}

input:disabled + .slider {
  opacity: 0.5;
  cursor: auto;
}

input:focus + .slider {
  box-shadow: 0 0 1px #101010;
}

input:checked + .slider #slide-toggle {
  -webkit-transform: translateX(35px);
  -ms-transform: translateX(35px);
  transform: translateX(35px);
  background-color: rgb(var(--v-theme-info));
}

.slider.round {
  border-radius: 5px;
}
</style>
