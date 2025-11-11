<template>
  <v-app>
    <div style="background-color: #f5f5f5">
      <ProductSlider />
      <FeaturesBar />

      <v-container class="my-4" fluid style="padding: 0 1rem">
        <div class="d-flex justify-space-between align-center mb-6">
          <div class="d-flex align-center ga-2">
            <v-icon size="large" color="primary">mdi-new-box</v-icon>
            <h2
              class="font-weight-bold text-right"
              style="border-bottom: 3px solid blue"
            >
              جدیدترین محصولات
            </h2>
          </div>
          <NuxtLink to="/products" class="text-decoration-none">
            <v-btn variant="text" color="primary" class="font-weight-bold">
              مشاهده همه
              <v-icon end>mdi-chevron-left</v-icon>
            </v-btn>
          </NuxtLink>
        </div>

        <div class="slider-container">
          <v-slide-group
            v-model="newestModel"
            selected-class="bg-primary"
            :show-arrows="false"
            class="custom-slider"
            id="newest-slider"
          >
            <v-slide-group-item
              v-for="(item, index) in newestProductsWithAmount"
              :key="index"
            >
              <div class="me-2">
                <ProductCard
                  :_index="index"
                  :product="item"
                  @updateAmount="setNPAmount"
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
              @click="handleSlide('newest', 'next')"
            />
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              density="compact"
              class="navigation-btn"
              @click="handleSlide('newest', 'prev')"
            />
          </div>
        </div>
      </v-container>

      <v-container class="my-4" fluid style="padding: 0 1rem">
        <div class="d-flex justify-space-between align-center mb-6">
          <div class="d-flex align-center ga-2">
            <v-icon size="large" color="primary">mdi-fire-circle</v-icon>
            <h2
              class="font-weight-bold text-right"
              style="border-bottom: 3px solid blue"
            >
              محصولات پرفروش
            </h2>
          </div>
          <NuxtLink to="/products" class="text-decoration-none">
            <v-btn variant="text" color="primary" class="font-weight-bold">
              مشاهده همه
              <v-icon end>mdi-chevron-left</v-icon>
            </v-btn>
          </NuxtLink>
        </div>

        <div class="slider-container">
          <v-slide-group
            v-model="bestSellingsModel"
            selected-class="bg-primary"
            :show-arrows="false"
            :mandatory="false"
            :multiple="false"
            class="custom-slider"
            id="bestSellings-slider"
          >
            <v-slide-group-item
              v-for="(item, index) in bestSellingsWithAmount"
              :key="index"
            >
              <div class="me-2">
                <ProductCard
                  :_index="index"
                  :product="item"
                  @updateAmount="setBSAmount"
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
              @click="handleSlide('bestSellings', 'next')"
            />
            <v-btn
              icon="mdi-chevron-left"
              variant="text"
              density="compact"
              class="navigation-btn"
              @click="handleSlide('bestSellings', 'prev')"
            />
          </div>
        </div>
      </v-container>
    </div>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { defaultStore } from "~/store/defaultStore";

const bestSellingsModel = ref(null);
const newestModel = ref(null);
const store = defaultStore();

const bestSellingsWithAmount = computed(() => {
  return store.bestSellings.map((product) => ({
    ...product,
    amount: store.getProductAmount(product.id),
  }));
});

const newestProductsWithAmount = computed(() => {
  return store.newestProducts.map((product) => ({
    ...product,
    amount: store.getProductAmount(product.id),
  }));
});

function handleSlide(sliderId, direction) {
  const slideGroup = document.querySelector(
    `#${sliderId}-slider .v-slide-group__container`
  );
  if (slideGroup) {
    const scrollAmount = direction === "next" ? 400 : -400;
    slideGroup.scrollBy({ left: scrollAmount, behavior: "smooth" });
  }
}

function setBSAmount(idx, val) {
  const product = bestSellingsWithAmount.value[idx];
  store.updateProductAmount(product.id, val);
}

function setNPAmount(idx, val) {
  const product = newestProductsWithAmount.value[idx];
  store.updateProductAmount(product.id, val);
}

onMounted(async () => {
  store.initializeStore();
  await store.fetchProducts();
  
  let b = document.getElementsByClassName("v-slide-group");
  for (let item of b) {
    item.addEventListener("mousedown", (ev) => ev.preventDefault());
  }
});
</script>

<style scoped>
</style>
<style>
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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
.v-slide-group__prev,
.v-slide-group__next {
  display: none;
}
</style>