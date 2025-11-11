<template>
  <v-container fluid class="pa-0">
    <v-row class="ma-0">
      <v-col cols="12" md="4" order="2" order-md="1" class="pa-2">
        <div class="right-slider-box">
          <v-carousel
            height="400"
            :show-arrows="false"
            hide-delimiters
            cycle
          >
            <v-carousel-item
              v-for="product in featuredProducts"
              :key="product.id"
            >
              <v-card class="h-100" @click="navigateToProduct(product.id)" style="cursor: pointer;">
                <v-img
                  :src="product.image || noImage"
                  :alt="product.title"
                  height="250"
                  cover
                >
                  <template v-slot:placeholder>
                    <v-row class="fill-height ma-0" align="center" justify="center">
                      <v-progress-circular indeterminate color="grey-lighten-5" />
                    </v-row>
                  </template>
                </v-img>
                
                <v-card-text class="text-right">
                  <h2 class="mb-2 font-weight-bold">{{ product.title }}</h2>
                  <div :class="product.discountPercent > 0 ? 'd-flex justify-space-between align-center' : 'd-flex justify-end align-center'">
                    <v-chip
                      v-if="product.discountPercent > 0"
                      color="red"
                      size="large"
                      class="font-weight-bold"
                    >
                      {{ product.discountPercent }}٪ تخفیف
                    </v-chip>
                    <div class="text-left">
                      <h3 v-if="product.discountPercent > 0" class="font-weight-bold">
                        {{ new Intl.NumberFormat('fa-IR').format(product.priceWithDiscount) }} تومان
                      </h3>
                      <h3 :class="product.discountPercent > 0 ? 'text-decoration-line-through text-grey' : 'font-weight-bold'">
                        {{ new Intl.NumberFormat('fa-IR').format(product.price) }} تومان
                      </h3>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-carousel-item>
          </v-carousel>
        </div>
      </v-col>

      <v-col cols="12" md="8" order="1" order-md="2" class="pa-2">
        <div class="slider-box">
          <v-carousel
            height="400"
            :show-arrows="false"
            hide-delimiters
            cycle
          >
            <v-carousel-item 
              v-for="banner in banners" 
              :key="banner.id"
            >
              <v-img 
                :src="banner.data"
                :alt="banner.title"
                cover
                height="400"
                @click="navigateToBanner(banner.link)"
                class="cursor-pointer"
              >
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey-lighten-5" />
                  </v-row>
                </template>
                
                <div class="product-overlay">
                  <h2 v-if="banner.title" class="font-weight-bold mb-2">{{ banner.title }}</h2>
                  <p v-if="banner.descriptions">{{ banner.descriptions }}</p>
                </div>
              </v-img>
            </v-carousel-item>
          </v-carousel>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { defaultStore } from '~/store/defaultStore';
import noImage from '~/assets/image/noImage.jpg';
import { formatUrl } from '~/utils/formatUrl';

const store = defaultStore();
const router = useRouter();
const { $axios } = useNuxtApp();
const banners = ref([]);

const featuredProducts = computed(() => {
  return store.specials;
  // return store.specials.slice(0, 3);
});

async function fetchBanners() {
  const response = await $axios.get('/Shop/Banners', {
    params: {
      page: 1,
      size: 10,
    },
  });

  if (response.data.isSuccess) {
    banners.value = response.data.value.result;
  } else {
    console.error("خطا در دریافت بنر");
  }
}

function navigateToBanner(link) {
  if (link) {
    const formattedUrl = formatUrl(link);
    window.open(formattedUrl, '_blank');
  }
}

async function navigateToProduct(productId) {
  const product = await store.fetchProductById(productId);
  const titleSlug = product.title
    .replace(/\s+/g, '-')
    .toLowerCase();
    
  router.push(`/product/${product.code}/${titleSlug}`);
}

// async function navigateToProduct(productId) {
//   const product = await store.fetchProductById(productId);
//   if (product) {
//     const slug = createSlug(product.title, product.code);
//     const productData = {
//       slug: slug,
//       id: productId
//     };
//     localStorage.setItem('currentProduct', JSON.stringify(productData));
//     router.push(`/product/${slug}`);
//   }
// }

// function createSlug(title, code) {
//   const titleWithoutSpace = title
//     .replace(/\s+/g, '-')
//     .toLowerCase();
    
//   return `${code}-${titleWithoutSpace}`;
// }

onMounted(() => {
  fetchBanners();
});
</script>

<style scoped>
.main-slider {
  background-color: #f5f5f5;
}

.slider-box {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  height: 100%;
}

.right-slider-box {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  height: 100%;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  transform-origin: center center;
}

.right-slider-box:hover {
  transform: scale(1.02);
  z-index: 20;
  box-shadow: 0 20px 40px rgba(0,0,0,0.25);
}

.cursor-pointer {
  cursor: pointer;
}

.product-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
  color: white;
}

:deep(.v-carousel) {
  height: 100%;
}

:deep(.v-window__container) {
  height: 100%;
}

:deep(.v-window-item) {
  height: 100%;
}

:deep(.v-card) {
  height: 100%;
  display: flex;
  flex-direction: column;
}
 

:deep(.v-card-text) {
  flex-grow: 1;
}
</style>
