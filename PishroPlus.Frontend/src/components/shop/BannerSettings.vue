<template>
  <div>
    <v-card-title>{{ $t('bannerSettings') }}</v-card-title>
    <v-card-text>
      <v-row>
        <!-- اسلایدر اصلی -->
        <v-col cols="12" class="mb-6">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center py-3 px-4">
              <v-icon icon="mdi-view-carousel" color="primary" class="me-2" />
              <span>{{ $t('mainSliders') }}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <!-- اسلایدر اول -->
                <v-col cols="12" md="6">
                  <banner-editor
                    :banner="getBannerByOrder(0)"
                    :position-name="$t('firstSlider')"
                    @save="saveBanner"
                    @remove-image="removeImage"
                  />
                </v-col>

                <!-- اسلایدر دوم -->
                <v-col cols="12" md="6">
                  <banner-editor
                    :banner="getBannerByOrder(1)"
                    :position-name="$t('secondSlider')"
                    @save="saveBanner"
                    @remove-image="removeImage"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- بنرهای پایین صفحه -->
        <v-col cols="12">
          <v-card variant="outlined">
            <v-card-title class="d-flex align-center py-3 px-4">
              <v-icon icon="mdi-image-multiple" color="teal" class="me-2" />
              <span>{{ $t('bottomBanners') }}</span>
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <!-- بنر پایینی اول -->
                <v-col cols="12" md="4">
                  <banner-editor
                    :banner="getBannerByOrder(2)"
                    :position-name="$t('firstBottomBanner')"
                    @save="saveBanner"
                    @remove-image="removeImage"
                  />
                </v-col>

                <!-- بنر پایینی دوم -->
                <v-col cols="12" md="4">
                  <banner-editor
                    :banner="getBannerByOrder(3)"
                    :position-name="$t('secondBottomBanner')"
                    @save="saveBanner"
                    @remove-image="removeImage"
                  />
                </v-col>

                <!-- بنر پایینی سوم -->
                <v-col cols="12" md="4">
                  <banner-editor
                    :banner="getBannerByOrder(4)"
                    :position-name="$t('thirdBottomBanner')"
                    @save="saveBanner"
                    @remove-image="removeImage"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
  </div>
</template>

<script>
import shopService from '../../../api/shop/shopService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import BannerEditor from './BannerEditor.vue'

export default {
  components: {
    BannerEditor
  },

  data() {
    return {
      banners: [],
      // تعریف موقعیت‌های ثابت بنر
      bannerPositions: [
        { order: 0, title: 'firstSlider' },
        { order: 1, title: 'secondSlider' },
        { order: 2, title: 'firstBottomBanner' },
        { order: 3, title: 'secondBottomBanner' },
        { order: 4, title: 'thirdBottomBanner' }
      ]
    }
  },

  methods: {
    ...mapActions(defaultStore, ['setErrorMessage']),

    async fetchBanners() {
      try {
        const response = await shopService.getBanners()

        if (response.isSuccess && response.value.result) {
          // دریافت بنرهای موجود
          const existingBanners = response.value.result

          // تنظیم آرایه بنرها براساس موقعیت‌های ثابت
          this.banners = this.bannerPositions.map((position) => {
            // جستجو برای بنر با این ترتیب در داده‌های موجود
            const existingBanner = existingBanners.find((b) => b.order === position.order)

            if (existingBanner) {
              return {
                ...existingBanner,
                descriptions: existingBanner.descriptions || existingBanner.title || ''
              }
            } else {
              // اگر بنر با این ترتیب وجود نداشت، یک بنر جدید بسازیم
              return {
                type: 0,
                name: '',
                extension: '',
                size: 0,
                action: 1, // Create
                displayName: '',
                data: '',
                title: '',
                descriptions: '',
                link: '',
                order: position.order
              }
            }
          })
        } else {
          this.setErrorMessage(this.$t('errorFetchingBanners'))

          // اگر دریافت بنرها با مشکل مواجه شد، بنرهای پیش‌فرض ایجاد کنیم
          this.createDefaultBanners()
        }
      } catch (error) {
        this.setErrorMessage(this.$t('errorFetchingBanners'))
        this.createDefaultBanners()
      }
    },

    createDefaultBanners() {
      // ایجاد بنرهای پیش‌فرض با موقعیت‌های از قبل تعیین شده
      this.banners = this.bannerPositions.map((position) => ({
        type: 0,
        name: '',
        extension: '',
        size: 0,
        action: 1, // Create
        displayName: '',
        data: '',
        title: '',
        descriptions: '',
        link: '',
        order: position.order
      }))
    },

    getBannerByOrder(order) {
      // پیدا کردن بنر براساس ترتیب آن
      const banner = this.banners.find((b) => b.order === order)

      // اگر بنر با این ترتیب وجود نداشت، یک بنر جدید برگردانیم
      if (!banner) {
        const newBanner = {
          type: 0,
          name: '',
          extension: '',
          size: 0,
          action: 1, // Create
          displayName: '',
          data: '',
          title: '',
          descriptions: '',
          link: '',
          order: order
        }
        this.banners.push(newBanner)
        return newBanner
      }

      return banner
    },

    async saveBanner(banner) {
      // اطمینان از اینکه descriptions تنظیم شده است
      banner.descriptions = banner.descriptions || banner.title
      banner.displayPosition = 1

      let response = null

      // تنظیم action براساس اینکه آیا بنر قبلاً ذخیره شده یا خیر
      if (banner.id) {
        banner.action = 2 // Update
        response = await shopService.updateBanner(banner)
      } else {
        banner.action = 1 // Create
        response = await shopService.createBanner(banner)
      }

      if (response.isSuccess) {
        this.setErrorMessage(this.$t('bannerSavedSuccessfully'), 'success')
        await this.fetchBanners()
      } else {
        this.setErrorMessage(response.message || this.$t('errorSavingBanner'))
      }
    },

    async deleteBanner(banner) {
      const res = await shopService.deleteBanner(banner.id)
      if (res.isSuccess) {
        this.setErrorMessage(this.$t('bannerDeletedSuccessfully'), 'success')
        await this.fetchBanners()
      }
    },

    removeImage(banner) {
      banner.data = ''
      banner.name = ''
      banner.displayName = ''
      banner.extension = ''
      banner.size = 0

      // اگر بنر قبلاً ذخیره شده، باید به‌روزرسانی شود
      if (banner.id) {
        this.deleteBanner(banner)
      }
    }
  },

  mounted() {
    this.fetchBanners()
  }
}
</script>
