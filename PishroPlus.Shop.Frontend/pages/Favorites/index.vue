<template>
  <div class="favorites-page">
    <v-row justify="center" class="my-8">
      <v-col cols="12" md="10">
        <div class="d-flex align-center justify-space-between mb-8">
          <div class="d-flex align-center">
            <v-icon size="x-large" color="red" class="me-2">mdi-heart</v-icon>
            <h1 class="font-weight-bold" style="border-bottom: 3px solid blue">لیست علاقه‌مندی‌ها</h1>
          </div>
          <div class="d-flex ga-2 align-center">
            <v-btn
              v-if="favoriteProducts.length > 0"
              color="primary"
              class="d-none d-sm-flex align-center"
              to="/"
            >
              <h4 class="font-weight-bold">بازگشت به فروشگاه</h4>
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
            </v-btn>
            <v-btn
              v-if="favoriteProducts.length > 0"
              color="red"
              variant="outlined"
              prepend-icon="mdi-delete"
              @click="showClearConfirm = true"
            >
              حذف همه
            </v-btn>
          </div>
        </div>

        <div v-if="favoriteProducts.length > 0" class="slider-container">
          <v-slide-group
            v-model="favoritesModel"
            selected-class="bg-primary"
            :show-arrows="false"
            :mandatory="false"
            :multiple="false"
            class="custom-slider"
            id="favorites-slider"
          >
            <v-slide-group-item
              v-for="(item, index) in favoriteProducts"
              :key="index"
            >
              <div class="me-2">
                <ProductCard
                  :product="getProductWithAmount(item)"
                  :_index="index"
                  class="w-100"
                  @updateAmount="updateAmount"
                />
              </div>
            </v-slide-group-item>
          </v-slide-group>

          <div class="slider-navigation">
            <v-btn
              icon="mdi-chevron-right"
              variant="text"
              density="compact"
              class="navigation-btn"
              @click="handleSlide('favorites', 'next')"
            />
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              density="compact"
              class="navigation-btn"
              @click="handleSlide('favorites', 'prev')"
            />
          </div>
        </div>

        <div v-else class="d-flex flex-column align-center justify-center py-16">
          <v-icon size="100" color="grey" class="mb-4">mdi-heart-outline</v-icon>
          <h2 class="text-grey-darken-1 mb-2">لیست علاقه‌مندی‌های شما خالی است</h2>
          <p class="text-grey-darken-1 mb-4">محصولات مورد علاقه خود را به این لیست اضافه کنید</p>
          <v-btn
            color="primary"
            to="/"
            prepend-icon="mdi-shopping"
          >
            مشاهده محصولات
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <v-dialog v-model="showClearConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-right">حذف همه محصولات</v-card-title>
        <v-card-text class="text-right">
          آیا مطمئن هستید که می‌خواهید تمام محصولات را از لیست علاقه‌مندی‌ها حذف کنید؟
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showClearConfirm = false"
          >
            انصراف
          </v-btn>
          <v-btn
            color="red"
            variant="flat"
            @click="clearAllFavorites"
          >
            حذف همه
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { defaultStore } from '~/store/defaultStore';

const store = defaultStore();
const showClearConfirm = ref(false);
const favoritesModel = ref(null);

// Initialize store data
onMounted(() => {
  store.initializeStore();
});
const favoriteProducts = computed(() => store.favoriteProducts);

function getProductWithAmount(product) {
  return {
    ...product,
    amount: store.getProductAmount(product.id)
  };
}

function updateAmount(index, val) {
  const product = favoriteProducts.value[index];
  if (isNaN(val) || val === undefined) val = 0;
  if (val < 0) val = 0;

  store.updateProductAmount(product.id, val);
}

function clearAllFavorites() {
  store.clearAllFavorites();
  showClearConfirm.value = false;
}

function handleSlide(sliderId, direction) {
  const slideGroup = document.querySelector(`#${sliderId}-slider .v-slide-group__container`);
  if (slideGroup) {
    const scrollAmount = direction === 'next' ? 400 : -400;
    slideGroup.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }
}

onMounted(() => {
  // Prevent default drag behavior on slide group
  const slideGroups = document.getElementsByClassName("v-slide-group");
  for (let item of slideGroups) {
    item.addEventListener("mousedown", (ev) => ev.preventDefault());
  }
});
</script>

<style scoped>
.favorites-page {
  min-height: 50vh;
}

.slider-container {
  position: relative;
  padding-bottom: 3rem;
}

.custom-slider {
  overflow: hidden;
}

.slider-navigation {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 0.5rem;
}

.navigation-btn {
  background-color: white !important;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  height: 36px !important;
  width: 36px !important;
  border-radius: 50%;
}

.navigation-btn:hover {
  background-color: #f5f5f5 !important;
}

:deep(.v-slide-group__container) {
  scroll-behavior: smooth;
  padding: 16px 0;
}
</style>