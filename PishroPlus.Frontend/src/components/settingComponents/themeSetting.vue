<template></template>
<!-- <template>
  <v-row no-gutters>
    <v-col class="pa-4" cols="12" md="4">
      <v-card elevation="3" :title="$t('themeColor')">
        <v-card-text class="d-flex flex-column">
          <v-color-picker elevation="0" width="100%" v-model="color"></v-color-picker>
          <p class="pishro-caption text-grey">{{ $t('lightThemeSuggestedColor') }}</p>
          <v-row class="mb-2" no-gutters>
            <v-btn
              v-for="sColor in suggestedLightColor"
              :key="sColor"
              icon="mdi mdi-circle-slice-8"
              variant="text"
              :color="sColor"
              @click="() => (color = sColor)"
            />
          </v-row>
          <p class="pishro-caption text-grey">{{ $t('darkThemeSuggestedColor') }}</p>
          <v-row class="my-3 bg-darkContainer rounded" no-gutters>
            <v-btn
              v-for="sColor in suggestedDarkColor"
              :key="sColor"
              icon="mdi mdi-circle-slice-8"
              variant="text"
              :color="sColor"
              @click="() => (darkColor = sColor)"
            />
          </v-row>
          <v-btn-group density="compact"
            ><v-btn
              class="w-50"
              @click="color = '#2C73A7'"
              variant="flat"
              style="background-color: #2c73a7; color: white"
              >{{ $t('reset') }}</v-btn
            >
            <v-btn class="w-50" @click="undoColor" variant="flat" color="error">{{
              $t('cancel')
            }}</v-btn></v-btn-group
          >
        </v-card-text>
      </v-card>
    </v-col>
    <v-col class="pa-4" cols="12" md="8">
      <v-card elevation="3" class="h-100" :title="$t('fonts')">
        <v-card-text>
          <font-slider-row-vue :title="$t('selectFont')">
            <v-select
              v-model="font"
              :items="fonts"
              variant="outlined"
              density="compact"
              hide-details
            >
            </v-select>
          </font-slider-row-vue>
          <font-slider-row-vue :title="$t('mainFont')">
            <v-slider
              hide-details
              v-model="fontSize"
              show-ticks="always"
              min="10"
              max="40"
              step="1"
            ></v-slider>
            <template #font-value>
              <p>{{ fontSize + ' ' + $t('pixel') }}</p>
            </template>
          </font-slider-row-vue>

          <font-slider-row-vue :title="$t('cardTitle')" cssClass="v-card-title">
            <v-slider
              hide-details
              v-model="cardTitleSize"
              show-ticks="always"
              min="10"
              max="40"
              step="1"
            ></v-slider>
            <template #font-value>
              <p>{{ cardTitleSize + ' ' + $t('pixel') }}</p>
            </template>
          </font-slider-row-vue>

          <font-slider-row-vue :title="$t('pageTitle')" cssClass="page-title">
            <v-slider
              hide-details
              v-model="pageTitleSize"
              show-ticks="always"
              min="10"
              max="40"
              step="1"
            ></v-slider>
            <template #font-value>
              <p>{{ pageTitleSize + ' ' + $t('pixel') }}</p>
            </template>
          </font-slider-row-vue>

          <font-slider-row-vue :title="$t('caption')" cssClass="pishro-caption">
            <v-slider
              hide-details
              v-model="captionSize"
              show-ticks="always"
              min="10"
              max="40"
              step="1"
            ></v-slider>
            <template #font-value>
              <p>{{ captionSize + ' ' + $t('pixel') }}</p>
            </template>
          </font-slider-row-vue>
        </v-card-text>
        <v-card-actions class="justify-end pe-4">
          <v-btn @click="resetFontSizes" variant="flat" color="primary">{{
            $t('resetAllValues')
          }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import fontSliderRowVue from '../settingComponents/fontSliderRow.vue'
export default {
  data() {
    return {
      suggestedLightColor: ['#7D82E3', '#2C73A7', '#588BFF', '#169191'],
      suggestedDarkColor: ['#2B5278', '#242F3D'],
      fonts: ['IRANSans', 'IRANYekan', 'Anjoman', 'Aviny', 'Dana', 'IRANSharp', 'Kalameh'],
      color: '',
      darkColor: '',
      prevColor: '',
      fontSize: null,
      font: null,
      captionSize: null,
      cardTitleSize: null,
      pageTitleSize: null
    }
  },
  mounted() {
    var defaultColor = localStorage?.getItem('theme') ?? '#2C73A7'
    var defaultDarkColor = localStorage?.getItem('drakSurface') ?? '#2B5278'
    this.fontSize = this.defaultFontSize
    this.font = this.defaultFont
    this.captionSize = this.defaultCaptionSize
    this.cardTitleSize = this.defaultCardTitleSize
    this.pageTitleSize = this.defaultPageTitleSize
    this.color = defaultColor
    this.darkColor = defaultDarkColor
    this.prevColor = defaultColor
  },
  computed: {
    ...mapState(defaultStore, {
      defaultFontSize: 'defaultFont',
      defaultCardTitleSize: 'cardTitleFont',
      defaultPageTitleSize: 'pageTitleFont',
      defaultCaptionSize: 'captionFont',
      defaultFont: 'font'
    })
  },
  watch: {
    color(value) {
      localStorage.setItem('theme', value)
      this.$vuetify.theme.themes.light.colors.primary = value
      this.$vuetify.theme.themes.light.colors.androidTopBar = value
    },
    darkColor(value) {
      localStorage.setItem('drakSurface', value)
      this.$vuetify.theme.themes.dark.colors.surface = value
      this.$vuetify.theme.themes.dark.colors.androidTopBar = value
    },
    fontSize(value) {
      this.setFont(value)
    },
    cardTitleSize(value) {
      this.setCardTitleFont(value)
    },
    pageTitleSize(value) {
      this.setPageTitleFont(value)
    },
    captionSize(value) {
      this.setCaptionFont(value)
    },
    font(value) {
      this.setFontFamily(value)
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setFont: 'setDefaultFont',
      setCardTitleFont: 'setCardTitleFont',
      setPageTitleFont: 'setPageTitleFont',
      setCaptionFont: 'setCaptionFont',
      setFontFamily: 'setFont'
    }),
    resetFontSizes() {
      this.font = 'IranYekan'
      this.fontSize = 15
      this.captionSize = 12
      this.cardTitleSize = 20
      this.pageTitleSize = 23
    },
    undoColor() {
      this.color = this.prevColor
    }
  },
  components: {
    fontSliderRowVue
  }
}
</script>

<style></style> -->
