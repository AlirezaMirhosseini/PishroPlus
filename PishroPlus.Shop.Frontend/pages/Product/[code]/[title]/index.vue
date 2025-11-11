<template>
    <div class="product-details-page">
      <v-container class="py-8">
        <v-row>
          <v-col cols="12" lg="4" md="5">
            <div class="position-relative">
              <v-carousel
                v-model="currentSlide"
                reverse
                hide-delimiters
                height="400"
                class="bg-grey-lighten-3 rounded-lg"
              >
                <template v-slot:prev="{ props }">
                  <v-btn
                    icon
                    color="white"
                    variant="elevated"
                    @click="props.onClick"
                    ><v-icon>mdi-chevron-right</v-icon></v-btn
                  >
                </template>
                <template v-slot:next="{ props }">
                  <v-btn
                    icon
                    color="white"
                    variant="elevated"
                    @click="props.onClick"
                    ><v-icon>mdi-chevron-left</v-icon></v-btn
                  >
                </template>
                <v-carousel-item
                  v-for="(image, i) in product.images"
                  :key="i"
                  :src="image"
                  cover
                />
              </v-carousel>
  
              <div class="mt-4 d-flex ga-2 overflow-x-auto">
                <v-img
                  v-for="(image, i) in product.images"
                  :key="i"
                  :src="image"
                  width="80"
                  height="80"
                  cover
                  class="rounded cursor-pointer"
                  :class="{ 'border-primary': currentSlide === i }"
                  @click="currentSlide = i"
                />
              </div>
            </div>
          </v-col>
  
          <v-col cols="12" lg="8" md="7">
            <div class="d-flex flex-column h-100">
              <div class="d-flex justify-space-between align-center mb-4">
                <h1 class="font-weight-bold">{{ product.title }}</h1>
                <v-btn
                  icon="mdi-heart"
                  :color="isFavorite ? 'red' : 'grey'"
                  variant="text"
                  @click="toggleFavorite"
                />
                <v-btn
                  color="primary"
                  class="d-none d-sm-flex align-center"
                  to="/"
                >
                  <h4 class="font-weight-bold">بازگشت به فروشگاه</h4>
                  <v-icon class="mr-2">mdi-arrow-left</v-icon>
                </v-btn>
              </div>
  
              <p class="text-grey-darken-1 mb-6">
                {{ product.productDescription }}
              </p>
  
              <!-- <div class="d-flex align-center mb-4">
                <v-rating
                  v-model="product.rating"
                  readonly
                  density="compact"
                  color="warning"
                />
                <span class="text-grey ms-2">({{ product.reviews }} دیدگاه)</span>
              </div> -->
  
              <div v-if="product.features" class="product-features mb-6">
                <h3 class="mb-4">ویژگی‌های کالا</h3>
                <v-list>
                  <v-list-item
                    v-for="(feature, index) in product.features"
                    :key="index"
                    density="compact"
                  >
                    <template v-slot:prepend>
                      <v-icon color="black" size="xx-small">mdi-circle</v-icon>
                    </template>
                    <v-list-item-title>{{ feature }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </div>
              <div class="mt-auto">
                <v-col cols="3" class="d-flex mb-4">
                  <v-select
                    v-model="selectedUnit"
                    :items="unitOptions"
                    item-title="title"
                    item-value="id"
                    label="انتخاب واحد"
                    variant="outlined"
                    density="compact"
                    hide-details
                    class="max-width-200"
                  />
                </v-col>
                <div class="d-flex justify-space-between align-center mb-4 mx-6">
                  <div>
                    <div
                      v-if="product.discountPercent > 0"
                      class="font-weight-bold"
                    >
                      {{
                        new Intl.NumberFormat("fa-IR").format(
                          product.priceWithDiscount
                        )
                      }}
                      تومان
                    </div>
                    <div
                      :class="
                        product.discountPercent > 0
                          ? 'text-decoration-line-through text-grey mb-1'
                          : 'font-weight-black font-black'
                      "
                    >
                      {{ new Intl.NumberFormat("fa-IR").format(product.price) }}
                      تومان
                    </div>
                  </div>
                  <v-chip
                    v-if="product.discountPercent > 0"
                    color="red"
                    class="font-weight-bold"
                  >
                    {{ product.discountPercent }}٪ تخفیف
                  </v-chip>
                </div>
  
                <div class="d-flex justify-end ga-2 ml-6">
                  <template v-if="product.amount > 0">
                    <div class="d-flex align-center ga-2">
                      <v-btn
                        icon
                        color="success"
                        size="small"
                        @click="updateAmount(product.amount + 1)"
                      >
                        <v-icon>mdi-plus</v-icon>
                      </v-btn>
                      <input
                        v-model="product.amount"
                        inputmode="decimal"
                        style="
                          width: 40px;
                          direction: ltr;
                          height: 35px;
                          font-size: 12pt;
                          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
                        "
                        class="text-center font-weight-bold"
                        @click="(ev) => ev.target.select()"
                      />
                      <v-btn
                        icon
                        color="red"
                        size="small"
                        @click="updateAmount(product.amount - 1)"
                      >
                        <v-icon>mdi-minus</v-icon>
                      </v-btn>
                    </div>
                  </template>
                  <v-btn
                    v-else
                    color="primary"
                    prepend-icon="mdi-cart"
                    @click="updateAmount(1)"
                    style="width: 160px; height: 3rem"
                  >
                    افزودن به سبد
                  </v-btn>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { defaultStore } from "~/store/defaultStore";
  
  const route = useRoute();
  const router = useRouter();
  const store = defaultStore();
  const currentSlide = ref(0);
  const selectedUnit = ref(null);
  const { code } = route.params;
  
  const product = computed(() => {
    return store.getCurrentProduct || {};
  });
  // const product = reactive({});
  
  const unitOptions = computed(() => {
    if (product.value?.units?.length > 0) {
      return product.value.units;
    }
    return [{ id: "default", title: "عدد", isDefault: true }];
  });
  
  const defaultUnit = computed(() => {
    if (product.value?.units?.length > 0) {
      const defaultUnitObj = product.value.units.find((unit) => unit.isDefault);
      return defaultUnitObj?.id;
    }
    return "default";
  });
  
  const isFavorite = computed(() => store.isFavorite(product.value?.id));
  
  // function createSlug(title, code) {
  //   const titleWithoutSpace = title
  //     .replace(/\s+/g, '-')
  //     .toLowerCase();
  
  //   return `${code}-${titleWithoutSpace}`;
  // }
  
  onMounted(async () => {
		const currentProduct = await store.getProductBySlug({ code });
  
		selectedUnit.value = defaultUnit.value;
    // // try {
    // const currentSlug = route.params.id;
    // console.log('currentSlug in [id]=', currentSlug);
    // const getProductBySlugRes = await store.getProductBySlug(currentSlug);
    // // product.value = getProductBySlugRes.result[0];
    // console.log(getProductBySlugRes);
  
    // return;
    // let productData = localStorage.getItem("currentProduct");
    // console.log(productData);
    // if (productData) {
    //   console.log("iffffffff");
    //   const { slug, id } = JSON.parse(productData);
    //   if (slug === currentSlug) {
    //     console.log("iffffffff2");
    //     await store.fetchProductById(id);
    //   } else {
    //     console.log("iffffffffelsssss");
    //     const product = await store.getProductBySlug(currentSlug);
    //     if (!product) {
    //       router.push("/404");
    //       return;
    //     }
    //   }
    // } else {
    //   console.log("elseeeeeee");
    //   const product = await store.getProductBySlug(currentSlug);
    //   if (!product) {
    //     router.push("/404");
    //     return;
    //   }
    // }
  
    // selectedUnit.value = defaultUnit.value;
    // // } catch (error) {
    // //   console.error("خطا در بارگذاری محصول:", error);
    // //   router.push("/404");
    // // }
  });
  
  // onMounted(async () => {
  //   const route = useRoute();
  //   const currentSlug = route.params.id;
  //   console.log(route);
  //   const productData = localStorage.getItem('currentProduct');
  
  //   if (productData) {
  //     const { slug, id } = JSON.parse(productData);
  //     console.log(route.params.id);
  //     if (slug === currentSlug) {
  //       console.log(route.params.id);
  //       await store.fetchProductById(id);
  //     } else {
  //       router.push('/404');
  //     }
  //   } else {
  //     router.push('/404');
  //   }
  // });
  
  function updateAmount(amount) {
    store.updateProductAmount(product.value.id, amount, selectedUnit.value);
  }
  
  async function toggleFavorite() {
    try {
      await store.toggleFavorite(product.value);
    } catch (error) {
      console.error("خطا در تغییر وضعیت علاقه‌مندی:", error);
    }
  }
  </script>
  
  <style scoped>
  .border-primary {
    border: 5px solid rgb(var(--v-theme-primary));
  }
  
  .cursor-pointer {
    cursor: pointer;
  }
  
  :deep(.v-carousel .v-window__container) {
    border-radius: 8px;
  }
  
  .v-col {
    display: flex;
    flex-direction: column;
  }
  </style>