<template>
  <v-row class="align-center flex-row flex-nowrap" no-gutters dense>
    <v-textarea class="send-text-area mt-4" :model-value="text" @input="$emit('update:text', $event.target.value)" :rules="[
      (v) => {
        if (v) return true
        return $t('enterRequiredField')
      }
    ]" variant="outlined" auto-grow :label="$t('textMessage')" rows="1" row-height="40"
      append-inner-icon="mdi mdi-attachment" @click:append-inner="attach">
    </v-textarea>
    <v-btn type="submit" color="primary" class="send-button d-inline-flex ms-2" icon="mdi mdi-send"
      @click="isInForm ? null : $emit('send')" variant="text"></v-btn>
  </v-row>
  <input type="file" ref="file" style="display: none" @change="upload" multiple />
  <v-row>
    <!-- v-if="files?.length > 0" -->
    <template v-for="file in files" :key="file.name" v-if="!isFromNewTicket">
      <div>
        <v-chip @click="file.hovered = true" class="ma-2 c-pointer" closable color="primary"
          @click:close="deleteFile(file)">
          <p class="file-chip">
            {{ file.name }}
          </p>
        </v-chip>
        <v-slide-x-transition>
          <v-card v-if="file.hovered" height="150" width="150" style="position:absolute;bottom:0;">
            <v-btn @click="file.hovered = false" style="position:absolute;z-index: 100;right:10px" icon="mdi-close"
              size="x-small"></v-btn>
            <img :src="file.base64" alt="hi" height="100%" width="100%" />
          </v-card>
        </v-slide-x-transition>
      </div>
    </template>
  </v-row>
</template>

<script>
import { defaultStore } from '../../stores/default'
import { mapState, mapActions } from 'pinia'
export default {
  props: {
    isInForm: { required: false },
    text: { required: true },
    files: { required: true, default: () => [] }
  },
  data() {
    return {
      _files: [],
      isFromNewTicket: false
    }
  },
  emits: ['update:text', 'update:files', 'send'],
  watch: {
    files:
    {
      handler(val) {
        if (val && (!this._files || this._files.length < 1)) {
          this._files = [...val]
        }
      },
      deep: true,
    }
  },
  methods: {
    deleteFile(file) {
      var idx = this._files.findIndex((a) => a.name !== file.name)
      this._files.splice(idx, 1)
      this.$emit('update:files', this._files)
    },
    upload(value) {
      var output = Array.from(value.target.files)
      output.forEach(async (file) => {
        let res = await this.toBase64(file)
        this._files.push({ base64: res, name: file.name })
      })
      console.log(this._files);
      this.$emit('update:files', this._files)
    },
    attach() {
      this.$refs.file.click()
    },
    toBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve(reader.result)
        }
      })
    },
  },
}
</script>

<style>
.v-tooltip-content {
  max-width: 200px;
}

.file-chip {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100px;
}

.v-locale--is-rtl .send-button {
  transform: scale(-1);
}

.send-button,
.send-text-area .v-field__append-inner>.v-icon {
  transform: scale(1);
  color: rgb(var(--v-theme-primary));
  padding: 25px;
  border-radius: 50% !important;
  opacity: 1;
  transition: 0.3s ease;
}

.send-button:hover,
.send-text-area .v-field__append-inner>.v-icon:hover {
  background-color: rgb(var(--v-theme-primary), 33%);
}
</style>
