<template>
  <v-container>
    <v-card>
      <v-card-title class="text-h5 ma-2 ms-4">{{ $t('shopSetting') }}</v-card-title>
      <v-tabs v-model="activeSettingTab" color="primary" align-tabs="center">
        <v-tab value="general">{{ $t('generalSettings') }}</v-tab>
        <v-tab value="banners">{{ $t('bannerSettings') }}</v-tab>
      </v-tabs>

      <v-card-text>
        <v-window v-model="activeSettingTab">
          <v-window-item value="general">
            <v-form ref="form" v-model="valid">
              <v-card class="mb-4">
                <v-card-title class="d-flex align-center py-3 px-4">
                  <v-icon icon="mdi-store" color="primary" class="me-2" />
                  <span>{{ $t('status') }}</span>
                  <v-spacer></v-spacer>
                  <div class="d-flex align-center">
                    <span class="me-2">{{
                      formData.isActive ? $t('shopIsActive') : $t('shopIsInactive')
                    }}</span>
                    <switch-button
                      v-model:checked="formData.isActive"
                      :label="formData.isActive ? $t('active') : $t('inActive')"
                      class="shop-status-switch"
                    />
                  </div>
                </v-card-title>
              </v-card>

              <v-card class="mb-6" :disabled="!formData.isActive">
                <v-card-title class="d-flex align-center py-3 px-4">
                  <v-icon icon="mdi-information" color="primary" class="me-2" />
                  <span>{{ $t('basicShopInfo') }}</span>
                </v-card-title>

                <v-divider></v-divider>

                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="3">
                      <div
                        class="logo-upload-box"
                        @click="$refs.logoInput.click()"
                        :class="{ 'has-image': formData.logo?.data }"
                      >
                        <input
                          ref="logoInput"
                          type="file"
                          accept="image/*"
                          class="d-none"
                          @change="handleLogoUpload"
                        />
                        <v-img
                          v-if="formData.logo?.data"
                          :src="formData.logo.data"
                          width="100%"
                          height="100%"
                          cover
                          class="rounded-lg"
                        />
                        <div v-else class="upload-placeholder">
                          <v-icon size="40" color="grey-lighten-1">mdi-image-plus</v-icon>
                          <span class="text-grey-lighten-1 text-caption mt-2">{{
                            $t('uploadShopLogo')
                          }}</span>
                        </div>
                      </div>
                      <div class="text-caption text-grey mt-2">
                        {{ $t('squareDimensionsRecommended') }}
                      </div>
                    </v-col>

                    <v-col cols="12" md="9">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="formData.title"
                            :label="$t('shopTitle')"
                            variant="outlined"
                            density="comfortable"
                            :rules="[rules.required]"
                            prepend-inner-icon="mdi-store"
                          />
                        </v-col>

                        <v-col cols="12">
                          <div class="d-flex align-center mb-2">
                            <span class="text-subtitle-2">{{ $t('shopDomains') }}</span>
                            <v-btn
                              icon
                              variant="text"
                              density="comfortable"
                              class="ms-2"
                              @click="addDomain"
                              color="primary"
                            >
                              <v-icon>mdi-plus</v-icon>
                            </v-btn>
                          </div>

                          <div
                            v-for="(domain, index) in formData.domains"
                            :key="index"
                            class="d-flex mb-2"
                          >
                            <v-text-field
                              v-model="formData.domains[index]"
                              :label="$t('address')"
                              variant="outlined"
                              density="comfortable"
                              prepend-inner-icon="mdi-web"
                              placeholder="example.com"
                              class="me-2"
                            />
                            <v-btn
                              icon
                              variant="outlined"
                              color="error"
                              density="comfortable"
                              @click="removeDomain(index)"
                              :disabled="formData.domains.length <= 1"
                            >
                              <v-icon>mdi-minus</v-icon>
                            </v-btn>
                          </div>
                        </v-col>

                        <v-col cols="12">
                          <v-text-field
                            v-model="formData.trustSignature"
                            :label="$t('enamadUniqueId')"
                            variant="outlined"
                            density="comfortable"
                            prepend-inner-icon="mdi-shield-check"
                            :hint="$t('enamadHint')"
                            persistent-hint
                          />
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mb-6" :disabled="!formData.isActive">
                <v-card-title class="d-flex align-center py-3 px-4">
                  <v-icon icon="mdi-star" color="amber-darken-2" class="me-2" />
                  <span>{{ $t('shopFeatures') }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row>
                    <v-col
                      v-for="feature in availableFeatures"
                      :key="feature.key"
                      cols="12"
                      sm="6"
                      md="4"
                    >
                      <v-checkbox
                        v-model="formData.features"
                        :value="feature.key"
                        :label="feature.title"
                        density="comfortable"
                        hide-details
                        class="mb-2"
                      >
                        <template v-slot:label>
                          <div class="d-flex align-center">
                            <v-icon :icon="feature.icon" color="primary" class="me-2" />
                            {{ feature.title }}
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-card>

              <v-card class="mb-6" :disabled="!formData.isActive">
                <v-card-title class="d-flex align-center py-3 px-4">
                  <v-icon icon="mdi-file-document" color="teal" class="me-2" />
                  <span>{{ $t('shopContentPages') }}</span>
                </v-card-title>
                <v-divider></v-divider>
                <v-card-text>
                  <v-tabs v-model="activeTab" grow>
                    <v-tab value="about">{{ $t('aboutUs') }}</v-tab>
                    <v-tab value="contact">{{ $t('contactUs') }}</v-tab>
                    <v-tab value="privacy">{{ $t('privacyPolicy') }}</v-tab>
                    <v-tab value="terms">{{ $t('termsAndConditions') }}</v-tab>
                  </v-tabs>

                  <v-window v-model="activeTab" class="mt-4">
                    <v-window-item value="about">
                      <rich-text-editor
                        v-model="formData.aboutContext"
                        :preview-mode="previewMode"
                        @toggle-preview="previewMode = !previewMode"
                        :placeholder="$t('aboutUsContent')"
                        key="about"
                        v-if="activeTab === 'about'"
                      />
                    </v-window-item>

                    <v-window-item value="contact">
                      <v-form ref="contactForm">
                        <v-card-text>
                          <v-row>
                            <v-col cols="12">
                              <div class="text-subtitle-1 mb-2">{{ $t('basicInfo') }}</div>
                              <v-row>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="
                                      contactForm.company_contact_info.basic_info.company_name
                                    "
                                    :label="$t('companyName')"
                                    variant="outlined"
                                    density="comfortable"
                                    :rules="[contactRules.required]"
                                  />
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="contactForm.company_contact_info.basic_info.phone"
                                    :rules="[contactRules.phone]"
                                    :label="$t('phone')"
                                    variant="outlined"
                                    density="comfortable"
                                  />
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="contactForm.company_contact_info.basic_info.email"
                                    :label="$t('email')"
                                    variant="outlined"
                                    density="comfortable"
                                    type="email"
                                    :rules="[contactRules.email]"
                                  />
                                </v-col>
                              </v-row>
                            </v-col>

                            <v-col cols="12">
                              <div class="text-subtitle-1 mb-2">{{ $t('address') }}</div>
                              <v-textarea
                                v-model="contactForm.company_contact_info.address"
                                :label="$t('address')"
                                variant="outlined"
                                density="comfortable"
                                rows="3"
                              />
                            </v-col>

                            <v-col cols="12">
                              <div class="text-subtitle-1 mb-2">{{ $t('socialMedia') }}</div>
                              <v-row>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="
                                      contactForm.company_contact_info.social_media.instagram
                                    "
                                    :label="$t('instagram')"
                                    variant="outlined"
                                    density="comfortable"
                                    prepend-inner-icon="mdi-instagram"
                                  />
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="contactForm.company_contact_info.social_media.Telegram"
                                    :label="$t('telegram')"
                                    variant="outlined"
                                    density="comfortable"
                                    prepend-inner-icon="mdi-telegram"
                                  />
                                </v-col>
                                <v-col cols="12" md="4">
                                  <v-text-field
                                    v-model="contactForm.company_contact_info.social_media.Whatsup"
                                    :label="$t('whatsApp')"
                                    variant="outlined"
                                    density="comfortable"
                                    prepend-inner-icon="mdi-whatsapp"
                                  />
                                </v-col>
                              </v-row>
                            </v-col>
                          </v-row>
                        </v-card-text>
                      </v-form>
                    </v-window-item>

                    <v-window-item value="privacy">
                      <rich-text-editor
                        v-model="formData.privacyTermsContext"
                        :preview-mode="previewMode"
                        @toggle-preview="previewMode = !previewMode"
                        :placeholder="$t('privacyPolicyContent')"
                        key="privacy"
                        v-if="activeTab === 'privacy'"
                      />
                    </v-window-item>

                    <v-window-item value="terms">
                      <rich-text-editor
                        v-model="formData.conditionsContext"
                        :preview-mode="previewMode"
                        @toggle-preview="previewMode = !previewMode"
                        :placeholder="$t('termsAndConditionsContent')"
                        key="terms"
                        v-if="activeTab === 'terms'"
                      />
                    </v-window-item>
                  </v-window>
                </v-card-text>
              </v-card>

              <div class="d-flex justify-end">
                <v-btn
                  color="info"
                  variant="flat"
                  size="large"
                  prepend-icon="mdi mdi-content-save"
                  class="text-center"
                  @click="saveSettings"
                  :loading="loading"
                  :disabled="!valid"
                  >{{ $t('save') }}</v-btn
                >
              </div>
            </v-form>
          </v-window-item>
          
          <v-window-item value="banners">
            <banner-settings />
          </v-window-item>
        </v-window>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import { ref } from 'vue'
import richTextEditor from '../../components/baseComponents/richTextEditor.vue'
import switchButton from '../../components/baseComponents/switchButton.vue'
import shopService from '../../../api/shop/shopService'
import BannerSettings from '../../components/shop/BannerSettings.vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'

export default {
  components: {
    richTextEditor,
    switchButton,
    BannerSettings
  },

  setup() {
    const previewMode = ref(false)
    const activeTab = ref('about')

    return {
      previewMode,
      activeTab
    }
  },

  data() {
    return {
      activeSettingTab: 'general',
      valid: false,
      loading: false,
      showApiMessage: false,
      formData: {
        title: '',
        domains: [''],
        aboutContext: '',
        contactContext: '',
        isActive: true,
        trustSignature: '',
        features: [],
        privacyTermsContext: '',
        conditionsContext: '',
        logo: null
      },
      contactForm: {
        company_contact_info: {
          basic_info: {
            company_name: '',
            phone: '',
            email: ''
          },
          address: '',
          social_media: {
            instagram: '',
            Telegram: '',
            Whatsup: ''
          }
        }
      },

      availableFeatures: [
        { key: 'freeShipping', title: this.$t('freeShipping'), icon: 'mdi-truck-check' },
        {
          key: 'fastExpressDelivery',
          title: this.$t('fastExpressDelivery'),
          icon: 'mdi-truck-fast'
        },
        { key: 'cashOnDelivery', title: this.$t('cashOnDelivery'), icon: 'mdi-cash-multiple' },
        {
          key: 'sevenDayReturnGuarantee',
          title: this.$t('sevenDayReturnGuarantee'),
          icon: 'mdi-calendar-refresh'
        },
        {
          key: 'twentyFourSevenSupport',
          title: this.$t('twentyFourSevenSupport'),
          icon: 'mdi-headset'
        },
        {
          key: 'authenticityGuaranteed',
          title: this.$t('authenticityGuaranteed'),
          icon: 'mdi-shield-check'
        },
        {
          key: 'bestPriceGuarantee',
          title: this.$t('bestPriceGuarantee'),
          icon: 'mdi-currency-usd'
        },
        { key: 'freeGiftWithPurchase', title: this.$t('freeGiftWithPurchase'), icon: 'mdi-gift' },
        {
          key: 'securePaymentGateway',
          title: this.$t('securePaymentGateway'),
          icon: 'mdi-credit-card-check'
        },
        {
          key: 'onlineOrderTracking',
          title: this.$t('onlineOrderTracking'),
          icon: 'mdi-map-marker-path'
        }
      ],
      contactRules: {
        required: (v) => !!v || this.$t('enterRequiredField'),
        email: (v) => /.+@.+\..+/.test(v) || this.$t('invalidEmail'),
        phone: (v) => /^[0-9]{11}$/.test(v) || this.$t('invalidPhone')
      },
      rules: {
        required: (v) => !!v || this.$t('enterRequiredField'),
        domain: (v) =>
          /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(v) ||
          this.$t('invalidDomain')
      }
    }
  },

  async mounted() {
    await this.loadSettings()
  },

  methods: {
    ...mapActions(defaultStore, ['setErrorMessage']),
    async loadSettings() {
      this.loading = true
      const response = await shopService.getData()
      if (response.isSuccess) {
        const data = response.value

        this.formData = {
          title: data.title || '',
          domains: data.domains?.length ? data.domains : [''],
          aboutContext: data.aboutContext || '',
          contactContext: data.contactContext || '',
          isActive: data.isActive ?? true,
          trustSignature: data.trustSignature || '',
          features: data.features || [],
          privacyTermsContext: data.privacyTermsContext || '',
          conditionsContext: data.conditionsContext || '',
          logo: data.logo || null,
          id: data.id
        }
        this.parseContactContext()
      } else {
        this.setErrorMessage(response.errors?.[0]?.message || this.$t('settingsSaveError'))
      }
      this.loading = false
    },

    async handleLogoUpload(event) {
      const file = event.target.files[0]
      if (!file) return

      if (!file.type.match('image.*')) {
        this.setErrorMessage(this.$t('onlyImageFilesAllowed'))
        return
      }

      if (file.size > 2 * 1024 * 1024) {
        this.setErrorMessage(this.$t('fileSizeExceeded'))
        return
      }

      try {
        const base64 = await this.fileToBase64(file)
        this.formData.logo = {
          id: this.formData.logo?.id,
          type: 0,
          name: file.name,
          displayName: file.name,
          data: base64,
          extension: file.name.split('.').pop(),
          size: file.size,
          action: this.formData.logo?.id ? 2 : 1
        }
      } catch (error) {
        this.setErrorMessage(this.$t('fileProcessingError'))
      }
    },

    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
      })
    },

    addDomain() {
      this.formData.domains.push('')
    },

    removeDomain(index) {
      if (this.formData.domains.length > 1) {
        this.formData.domains.splice(index, 1)
      }
    },

    async saveSettings() {
      const { valid } = await this.$refs.form.validate()
      if (!valid) return

      // Update contact context before saving
      this.updateContactContext()

      const filteredDomains = this.formData.domains.filter((domain) => domain.trim() !== '')
      if (filteredDomains.length === 0) {
        this.setErrorMessage(this.$t('atLeastOneDomainRequired'))
        return
      }
      this.loading = true

      const request = {
        id: this.formData.id,
        title: this.formData.title,
        domains: filteredDomains,
        aboutContext: this.formData.aboutContext,
        contactContext: this.formData.contactContext,
        isActive: this.formData.isActive,
        trustSignature: this.formData.trustSignature,
        features: this.formData.features,
        privacyTermsContext: this.formData.privacyTermsContext,
        conditionsContext: this.formData.conditionsContext,
        logo: this.formData.logo
      }

      console.log(request)

      const response = await shopService.saveShopSettings(request)

      if (response.isSuccess) {
        this.setErrorMessage(this.$t('settingsSavedSuccessfully'), 'success')
        await this.loadSettings()
      } else {
        this.setErrorMessage(response.errors?.[0]?.message || this.$t('settingsSaveError'))
      }
      this.loading = false
    },

    resetForm() {
      this.$refs.form.reset()
      this.loadSettings()
    },

    updateContactContext() {
      this.formData.contactContext = JSON.stringify(this.contactForm, null, 2)
    },

    parseContactContext() {
      try {
        if (this.formData.contactContext) {
          this.contactForm = JSON.parse(this.formData.contactContext)
        }
      } catch (error) {
        console.error('Error parsing contact context:', error)
      }
    }
  }
}
</script>

<style scoped>
.logo-upload-box {
  width: 150px;
  height: 150px;
  border: 2px dashed #e0e0e0;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  position: relative;
}

.logo-upload-box:hover {
  border-color: #1867c0;
  background-color: #f0f8ff;
}

.logo-upload-box.has-image {
  border-style: solid;
  border-color: #1867c0;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.shop-status-switch :deep(input:checked + .slider) {
  background-color: rgba(76, 175, 80, 0.3);
}

.shop-status-switch :deep(input:checked + .slider #slide-toggle) {
  background-color: rgb(76, 175, 80);
}

.shop-status-switch :deep(input:not(:checked) + .slider) {
  background-color: rgba(244, 67, 54, 0.3);
}

.shop-status-switch :deep(input:not(:checked) + .slider #slide-toggle) {
  background-color: rgb(244, 67, 54);
}
</style>
