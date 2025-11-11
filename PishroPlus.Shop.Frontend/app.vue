<template>
  <v-layout class="h-screen d-flex flex-column">
    <NuxtLayout :name="layout">
      <v-main>
        <v-locale-provider rtl>
          <NuxtPage />
        </v-locale-provider>
      </v-main>
    </NuxtLayout>
  </v-layout>
</template>

<script setup>
import { useRoute } from "vue-router";
import { computed, onMounted } from "vue";
import { defaultStore } from '~/store/defaultStore';

const store = defaultStore();

const route = useRoute();
const layout = computed(() => {
  return route.meta.layout || "default";
});

onMounted(() => {
  store.initializeUserData();
});
</script>

<style>
* {
  direction: rtl !important;
  letter-spacing: 0;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  position: relative;
  font-weight: normal;
}

@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Black-FD-WOL.ttf") format("truetype");
  font-weight: 900;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Black-FD-WOL.ttf") format("truetype");
  font-weight: 800;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Bold-FD-WOL.ttf") format("truetype");
  font-weight: 700;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Bold-FD-WOL.ttf") format("truetype");
  font-weight: 600;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Medium-FD-WOL.ttf") format("truetype");
  font-weight: 500;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Regular-FD-WOL.ttf") format("truetype");
  font-weight: 400;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Regular-FD-WOL.ttf") format("truetype");
  font-weight: 300;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Light-FD-WOL.ttf") format("truetype");
  font-weight: 200;
  font-style: normal;
}
@font-face {
  font-family: "Vazir";
  src: url("./assets/fonts/Vazir-Thin-FD-WOL.ttf") format("truetype");
  font-weight: 100;
  font-style: normal;
}

body {
  font-family: "Vazir", sans-serif;
}
</style>