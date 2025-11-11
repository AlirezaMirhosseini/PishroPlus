<template>
  <div>
    <v-card flat color="transparent" width="auto" class="pa-1">
      <v-row justify="center" class="mb-1">
        <v-avatar  size="100">
          <img v-if="base64" ref="avatar" :src="base64" />
          <v-icon v-else color="gray" size="100">mdi-account-circle</v-icon>
        </v-avatar>
      </v-row>
      <v-row no-gutters>
        <v-col class="px-2 d-flex justify-center align-center" cols="6">
          <v-btn @click="openDialog()" icon color="primary"
            ><v-icon>mdi-file-image</v-icon></v-btn
          >
          <input
            @change="uploadImage()"
            class="d-none"
            type="file"
            ref="file_uploader"
          />
        </v-col>
        <v-col class="px-1 d-flex justify-center align-center" cols="6">
          <v-btn @click="deleteImage()" icon color="red" title="حذف">
            <v-icon>mdi-delete</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      base64: '',
    }
  },
  computed: {
    image: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      },
    },
  },
  methods: {
    openDialog() {
      const input = this.$refs.file_uploader
      input.click()
    },
    uploadImage() {
      const files = this.$refs.file_uploader.files
      if (files.length > 0) {
        this.image = files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          this.base64 = reader.result
        }
        reader.readAsDataURL(files[0])
      }
    },
    deleteImage() {
      this.base64 = null
      this.image = null
    },
  },
  props: {
    value: {
      required: true,
    },
  },
}
</script>

<style>
</style>