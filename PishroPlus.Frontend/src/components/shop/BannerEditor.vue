<template>
  <v-card variant="elevated" class="banner-card pa-4">
    <v-card-title class="pb-0 d-flex align-center">
      <v-icon color="primary" class="me-2">mdi-image</v-icon>
      <span class="font-weight-bold">{{ positionName }}</span>
    </v-card-title>
    <v-card-text>
      <div class="banner-image-container mb-4">
        <div v-if="localBanner.data" class="banner-image-wrapper">
          <img :src="getBannerImageSrc(localBanner.data)" alt="Banner" class="banner-image" />
          <div class="banner-image-actions">
            <v-tooltip bottom>
              <template #activator="{ on, attrs }">
                <v-btn icon variant="text" color="error" v-bind="attrs" v-on="on" @click.stop="removeImage">
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </template>
              <span>{{ $t('delete') }}</span>
            </v-tooltip>
          </div>
        </div>
        <div v-else class="banner-image-placeholder" @click="$refs.fileInput.click()">
          <v-icon size="56" color="grey-lighten-1">mdi-image-plus</v-icon>
          <div class="text-caption mt-2 text-grey-darken-1">{{ $t('clickToUploadImage') }}</div>
        </div>
        <input
          ref="fileInput"
          type="file"
          class="d-none"
          accept="image/*"
          @change="handleFileUpload"
        />
      </div>

      <v-text-field
        v-model="localBanner.title"
        :label="$t('title')"
        variant="outlined"
        density="comfortable"
        class="mb-3"
        prepend-inner-icon="mdi-format-title"
        color="primary"
      ></v-text-field>

      <v-text-field
        v-model="localBanner.link"
        :label="$t('link')"
        variant="outlined"
        density="comfortable"
        dir="ltr"
        prepend-inner-icon="mdi-link-variant"
        color="primary"
        class="mb-3"
        :rules="[]"
      ></v-text-field>

      <div class="d-flex justify-end mt-4">
        <v-btn color="primary" variant="elevated" @click="saveBanner" :disabled="!isBannerValid">
          <v-icon start>mdi-content-save</v-icon>
          {{ $t('save') }}
        </v-btn>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'

export default {
  props: {
    banner: {
      type: Object,
      required: true
    },
    positionName: {
      type: String,
      required: true
    }
  },
  
  data() {
    return {
      localBanner: { ...this.banner }
    }
  },
  
  watch: {
    banner: {
      handler(newVal) {
        this.localBanner = { ...newVal }
      },
      deep: true
    }
  },
  
  computed: {
    isBannerValid() {
      return !!this.localBanner.data
    }
  },

  methods: {
    ...mapActions(defaultStore, ['setErrorMessage']),

    async handleFileUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.startsWith('image/')) {
        this.setErrorMessage(this.$t('onlyImageFilesAllowed'))
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        this.setErrorMessage(this.$t('imgSizeCantBeMoreThan5mb'))
        return
      }

      try {
        // دریافت داده‌های base64 بدون قسمت header
        const base64 = await this.fileToBase64(file)
        this.localBanner.data = base64
        this.localBanner.name = file.name
        this.localBanner.displayName = file.name
        this.localBanner.extension = file.name.split('.').pop()
        this.localBanner.size = file.size
      } catch (error) {
        this.setErrorMessage(this.$t('errorInLoadingImage'))
      }
    },

    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          // حذف قسمت ابتدایی داده‌های base64
          const fullBase64 = reader.result
          const base64Data = fullBase64.split(',')[1]
          resolve(base64Data)
        }
        reader.onerror = (error) => reject(error)
      })
    },
    

    getBannerImageSrc(data) {
      if (data.startsWith('data:')) {
        return data
      }
      // براساس پسوند فایل، نوع MIME مناسب را تعیین می‌کنیم
      const extension = this.localBanner.extension?.toLowerCase() || 'jpeg'
      const mimeType = extension === 'png' ? 'image/png' : 'image/jpeg'
      return `data:${mimeType};base64,${data}`
    },

    removeImage() {
      this.$emit('remove-image', this.localBanner)
    },

    saveBanner() {
      this.$emit('save', this.localBanner)
    }
  }
}
</script>

<style scoped>
.banner-card {
  border-radius: 18px;
  box-shadow: 0 2px 12px 0 rgba(60,60,60,0.07);
  background: #fff;
}

.banner-image-container {
  height: 210px;
  width: 100%;
  position: relative;
  border: 2px dashed #90caf9;
  border-radius: 10px;
  overflow: hidden;
  background: #f8fafc;
  transition: border-color 0.2s;
}

.banner-image-container:hover {
  border-color: #1976d2;
}

.banner-image-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
}

.banner-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
}

.banner-image-placeholder {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: #f8fafc;
  transition: background 0.2s;
}

.banner-image-placeholder:hover {
  background: #e3f2fd;
}

.banner-image-actions {
  position: absolute;
  top: 10px;
  right: 10px;
  display: none;
  background-color: rgba(255, 255, 255, 0.85);
  border-radius: 6px;
  z-index: 2;
}

.banner-image-wrapper:hover .banner-image-actions {
  display: flex;
}
</style>