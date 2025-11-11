<template>
  <v-col class="py-1 px-0">
    <v-card class="h-100 pa-2" style="width: 280px;border-radius: 15px;">
      <div :class="product.discountPercent > 0 ? 'd-flex justify-space-between align-center' : 'd-flex justify-end align-center'">
        <v-chip
          v-if="product.discountPercent > 0"
          color="red"
          class="mb-1"
          variant="tonal"
        >
          <p>٪</p>
          {{ product.discountPercent }}
          <p class="mr-1"> تخفیف</p>
        </v-chip>
        <v-btn
          icon
          class="mb-1"
          variant="tonal"
          size="small"
          @click="toggleFavorite"
          :color="isFavorite ? 'red' : 'grey'"
        >
          <v-icon size="large">{{ isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}</v-icon>
        </v-btn>
      </div>
      <v-img
        :src="product.image || noImage"
        :alt="product.title"
        height="250"
        cover
        class="cursor-pointer"
        @click="navigateToProduct"
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="grey-lighten-5" />
          </v-row>
        </template>
      </v-img>
      
      <v-card-item>
        <v-card-title class="text-right font-weight-bold" style="font-size: medium;">{{ product.title }}</v-card-title>
      </v-card-item>

      <div class="d-flex justify-space-between align-center" style="background-color: #f7f7f7;border-radius: 15px;">
        <div class="d-flex flex-column align-center justify-space-between mr-1">
          <div v-if="product.discountPercent > 0" class="font-weight-black" style="font-size: 10pt;">
            {{ new Intl.NumberFormat('fa-IR').format(product.priceWithDiscount) }} تومان
          </div>
          <div :class="product.discountPercent > 0 ? 'text-decoration-line-through text-grey' : 'font-weight-black font-black'" style="font-size: 10pt;">
            {{ new Intl.NumberFormat('fa-IR').format(product.price) }} تومان
          </div>
        </div>
  
        <v-card-actions class="d-flex justify-center align-center" style="width: 130px;">
          <template v-if="product.amount > 0">
            <v-btn
              icon
              variant="elevated"
              color="#00ba06"
              size="x-small"
              @click="updateAmount(_index, (product.amount || 0) + 1)"
              style="border-radius: 0 20px 20px 0;"
            >
              <v-icon size="large">mdi-plus</v-icon>
            </v-btn>
            <input
              v-model="product.amount"
              inputmode="decimal"
              style="width: 40px; direction: ltr; height: 35px; font-size: 12pt; box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);"
              class="text-center font-weight-bold"
              @click="(ev) => ev.target.select()"
            />
            <v-btn
              icon
              variant="elevated"
              color="#ed0222"
              size="x-small"
              @click="updateAmount(_index, (product.amount || 0) - 1)"
              style="border-radius: 20px 0 0 20px;"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
          </template>
          <template v-else>
            <v-btn
              style="border-radius: 10px;"
              color="primary"
              variant="elevated"
              class="d-flex align-center justify-space-between pa-2"
              @click="updateAmount(_index, 1)"
            >
              <v-icon>mdi-basket</v-icon>
              <p>افزودن به سبد</p>
            </v-btn>
          </template>
        </v-card-actions>
      </div>
    </v-card>
  </v-col>
</template>

<script setup>
import { defineProps, computed } from 'vue';
import { useRouter } from 'vue-router';
import { defaultStore } from '~/store/defaultStore';
import noImage from '~/assets/image/noImage.jpg';

const router = useRouter();
const store = defaultStore();

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  _index: {
    type: Number,
    required: true
  },
});

const emit = defineEmits(['updateAmount']);

const isFavorite = computed(() => {
  return store.isFavorite(props.product.id);
});

function toggleFavorite() {
  store.toggleFavorite(props.product);
}

function updateAmount(id, amount) {
  const defaultUnit = props.product.units?.find(unit => unit.isDefault);
  emit('updateAmount', id, amount, defaultUnit?.id);
}

async function navigateToProduct() {
  const titleSlug = props.product.title
    .replace(/\s+/g, '-')
    .toLowerCase();
    
  router.push(`/product/${props.product.code}/${titleSlug}`);
}

// async function navigateToProduct() {
//   const product = await store.fetchProductById(props.product.id);
//   if (product) {
//     const slug = createSlug(product.title, product.code);
//     const productData = {
//       slug: slug,
//       id: props.product.id
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
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>