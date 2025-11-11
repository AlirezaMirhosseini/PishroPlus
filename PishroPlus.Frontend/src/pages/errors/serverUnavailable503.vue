<template>
  <v-row class="h-100 w-100 bg-white rounded-lg" no-gutters>
    <v-row class="d-flex flex-column flex-md-row align-center justify-center" no-gutters>
      <v-col class="d-flex align-center" style="max-width: 260px">
        <v-img
          class="align-self-center"
          width="260"
          max-height="340"
          :src="serverUnavailableImage"
          alt="not found"
          aria-label="not found"
        >
          <template v-slot:placeholder>
            <div class="d-flex align-center justify-center fill-height">
              <v-progress-circular color="grey-lighten-4" indeterminate></v-progress-circular>
            </div> </template
        ></v-img>
      </v-col>
      <v-col class="d-flex flex-column align-center" style="max-width: 550px; line-height: 50px">
        <p class="v-card-title">{{ $t('serverUnavailable') }}</p>
        <p class="text-grey" style="padding-inline: 3px; text-align: center; line-height: 35px">
          لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ
        </p>
        <p to="/" class="text-primary">{{$t('pleaseWait')}}...</p>
      </v-col>
    </v-row>
  </v-row>
</template>

<script>
import serverUnavailableImage from '../../assets/images/503.png'
export default {
  data() {
    return {
        serverUnavailableImage: serverUnavailableImage
    }
  }
}
</script>

<style></style>
