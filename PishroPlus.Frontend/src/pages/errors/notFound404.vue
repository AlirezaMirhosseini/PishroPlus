<template>
  <v-row class="h-100 w-100 bg-surface rounded-lg" no-gutters>
    <v-row class="d-flex flex-column flex-md-row align-center justify-center main" no-gutters>
      <v-col class="d-flex align-center" style="max-width: 260px">
        <v-img class="align-self-center" width="260" max-height="340" :src="notFoundImage" alt="not found"
          aria-label="not found">
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div>
          </template></v-img>
      </v-col>
      <v-col class="d-flex flex-column align-center" style="max-width: 550px; line-height: 50px">
        <p class="v-card-title">{{ $t('pageNotFoundError') }}</p>
        <p class="text-grey" style="padding-inline: 3px;text-align: center;line-height: 35px;">متاسفانه صفحه موردنظر یافت
          نشد!</p>
        <v-btn to="/" color="primary" variant="text" class="main-page" append-icon="mdi mdi-chevron-down">صفحه
          اصلی</v-btn>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import notFoundImage from '../../assets/images/404.png'
export default {
  data() {
    return {
      notFoundImage: notFoundImage
    }
  }
}
</script>

<style scoped>
.main-page .v-icon {
  transform: rotate(-90deg);
}

.v-locale--is-rtl .main-page .v-icon {
  transform: rotate(90deg);
}

.main {}

@media only screen and (max-width: 600px) {
  /* .main {
    position: relative !important;
    bottom: 20% !important;
  } */
}
</style>
