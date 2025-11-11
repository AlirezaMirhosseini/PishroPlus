<template>
  <div style="background-color: white;">
    <v-row no-gutters class="d-flex justify-space-between pa-4">
      <v-col cols="12" sm="3" class="d-flex align-center ga-2">
        <v-btn icon @click="drawer = !drawer" class="d-sm-none">
          <v-icon>mdi-menu</v-icon>
        </v-btn>
        <v-img @click="router.push('/')" class="cursor-pointer" src="assets/image/logo.png" alt="Logo" max-width="200" />
      </v-col>

      <v-col cols="12" sm="4" class="d-none d-sm-flex justify-end align-center ga-2">
        <v-menu offset-y>
          <v-list>
            <v-list-item v-for="(item, index) in userMenu" :key="index">
              <v-list-item-title>
                <NuxtLink :to="item.link">{{ item.title }}</NuxtLink>
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <div class="d-flex justify-center align-center ga-2">
          <v-btn @click="onProfileClick" class="d-flex justify-center align-center" style="border-radius: 25px; cursor: context-menu; height: 3rem;">
            <div v-if="isLoggedIn" class="d-flex flex-column justify-center align-center mr-2">
              <p class="d-flex justify-center align-center ga-1" style="color: #275fe0">
                <v-icon size="large">mdi-account-circle</v-icon>
                <span class="font-weight-bold">{{ userFullName }}</span>
              </p>
              <p class="text-red font-weight-light">{{ userType }}</p>
            </div>
            <div v-else class="d-flex justify-center align-center mr-2">
              <p>ثبت‌نام</p>
              /
              <p>ورود</p>
            </div>
          </v-btn>
          <v-btn @click="onLogoutClick" icon>
            <v-icon style="transform: rotate(180deg);">mdi-logout</v-icon>
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-navigation-drawer v-model="drawer" location="right" temporary>
      <v-list>
        <v-list-item>
          <v-btn block @click="onProfileClick" class="d-flex justify-center align-center my-4" style="border-radius: 25px; cursor: context-menu; height: 3rem;">
            <div v-if="isLoggedIn" class="d-flex flex-column justify-center align-center mr-2">
              <p class="d-flex justify-center align-center ga-1" style="color: #275fe0">
                <v-icon size="large">mdi-account-circle</v-icon>
                <span class="font-weight-bold">{{ userFullName }}</span>
              </p>
              <p class="text-red font-weight-light">{{ userType }}</p>
            </div>
            <div v-else class="d-flex justify-center align-center mr-2">
              <p>ثبت‌نام</p>
              /
              <p>ورود</p>
            </div>
          </v-btn>
        </v-list-item>

        <MobileMenu />

        <v-list-item to="/contact-us" prepend-icon="mdi-card-account-phone">
          <v-list-item-title>ارتباط با ما</v-list-item-title>
        </v-list-item>

        <v-list-item to="/about-us" prepend-icon="mdi-information">
          <v-list-item-title>درباره ما</v-list-item-title>
        </v-list-item>

        <v-list-item 
          v-for="(item, index) in userMenu" 
          :key="index" 
          :to="item.link"
        >
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defaultStore } from '~/store/defaultStore';
import MobileMenu from './MobileMenu.vue';

const store = defaultStore();
const router = useRouter();
const drawer = ref(false);

const isLoggedIn = computed(() => store.isAuthenticated);
const userFullName = computed(() => store.userFullName);
const userType = computed(() => store.isStockHolder ? 'کاربر سهامدار' : 'کاربر عادی');

const userMenu = [
  { title: 'پروفایل', link: '/profile' },
  { title: 'محصولات مورد علاقه', link: '/favorites' },
  { title: 'خروج از حساب کاربری', link: '/login' },
];

function onProfileClick() {
  if (isLoggedIn.value) {
    router.push('/profile');
  } else {
    router.push('/login');
  }
}

function onLogoutClick() {
  store.clearUserData();
  router.push('/login');
}
</script>