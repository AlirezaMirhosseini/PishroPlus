<template>
  <v-container fluid class="mega-menu" style="padding: 6px">
    <div>
      <v-row no-gutters class="d-flex justify-end justify-sm-space-between align-center ga-2">
        <div class="d-none d-sm-flex justify-center align-center">
          <div class="mega-menu-wrapper">
            <div 
              class="mega-menu-btn" 
              @click="toggleMenu"
              ref="menuBtn"
            >
              <v-icon>mdi-menu</v-icon>
              <span class="mr-2">دسته‌بندی کالاها</span>
            </div>

            <transition name="slide-fade">
              <div 
                v-if="isMenuOpen" 
                class="mega-menu-container"
                ref="menuContainer"
              >
                <div v-if="isLoading" class="loading-state">
                  <v-progress-circular indeterminate color="primary" />
                </div>
                <div v-else-if="error" class="error-state">
                  {{ error }}
                </div>
                <TreeMenu
                  v-else
                  :categories="categories" 
                  :depth="0"
                  @close="closeMenu"
                />
              </div>
            </transition>
          </div>

          <div @click="router.push('/contact-us')" class="d-flex justify-center align-center ga-2 mr-4 cursor-pointer">
            <p style="color: #275fe0">ارتباط با ما</p>
          </div>
          <div @click="router.push('/about-us')" class="d-flex justify-center align-center ga-2 mr-4 cursor-pointer">
            <p style="color: #275fe0">درباره ما</p>
          </div>
        </div>

        <div class="d-flex justify-center align-center ga-2">
          <v-tooltip location="bottom" text="سبد خرید">
            <template v-slot:activator="{ props }">
              <v-btn to="/settlement" v-bind="props" icon>
                <div v-if="cartCount > 0">
                  <v-badge color="red" :content="cartCount">
                    <v-icon>mdi-cart</v-icon>
                  </v-badge>
                </div>
                <div v-else>
                  <v-icon>mdi-cart</v-icon>
                </div>
              </v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="bottom" text="علاقه‌مندی‌ها">
            <template v-slot:activator="{ props }">
              <v-btn class="d-none d-sm-flex" to="/favorites" v-bind="props" icon>
                <div v-if="favoriteCount > 0">
                  <v-badge color="red" :content="favoriteCount">
                    <v-icon>mdi-heart</v-icon>
                  </v-badge>
                </div>
                <div v-else>
                  <v-icon>mdi-heart</v-icon>
                </div>
              </v-btn>
            </template>
          </v-tooltip>
        </div>
      </v-row>
    </div>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { useCategories } from "@/composables/useCategories";

const props = defineProps({
  cartCount: {
    type: Number,
    required: true,
  },
  favoriteCount: {
    type: Number,
    required: true,
  },
});

const router = useRouter();
const isMenuOpen = ref(false);
const { categories, isLoading, error } = useCategories();
const menuBtn = ref(null);
const menuContainer = ref(null);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const closeMenu = () => {
  isMenuOpen.value = false;
};

const handleClickOutside = (event) => {
  if (isMenuOpen.value && 
      menuBtn.value && 
      menuContainer.value && 
      !menuBtn.value.contains(event.target) && 
      !menuContainer.value.contains(event.target)) {
    closeMenu();
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.mega-menu {
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 800;
}
.mega-menu-wrapper {
  position: relative;
  z-index: 1000;
}

.mega-menu-btn {
  background-color: #275fe0;
  color: white;
  border-radius: 20px;
  height: 40px;
  min-width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0 16px;
}

.mega-menu-container {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  z-index: 1000;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateY(-10px);
  opacity: 0;
}

.loading-state,
.error-state {
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.error-state {
  color: #dc3545;
}
</style>