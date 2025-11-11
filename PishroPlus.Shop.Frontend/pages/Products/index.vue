<template>
	<div class="product-list-container pa-4">
		<v-container class="pa-0">
			<div class="d-flex align-center mb-6">
				<v-icon size="large" color="primary" class="me-2">mdi-fire-circle</v-icon>
				<h1 class="font-weight-bold">محصولات پرفروش</h1>
			</div>

			<v-row justify="center" class="mb-6">
				<v-col cols="12">
					<v-card 
						elevation="2"
						class="filter-fieldset pa-6"
					>
						<v-card-title class="text-center mb-4">
							<span class="font-weight-bold">فیلترها</span>
						</v-card-title>
						
						<v-row justify="center">
							<v-col cols="12" md="4">
								<v-text-field 
									v-model="searchText" 
									label="جستجوی محصول" 
									variant="outlined"
									prepend-inner-icon="mdi-magnify"
									hide-details
									density="compact"
									clearable
								/>
							</v-col>
							<v-col cols="12" md="4" sm="6">
								<v-text-field 
									v-model="minPriceFormatted"
									@update:model-value="updateMinPrice"
									label="حداقل قیمت" 
									variant="outlined"
									hide-details
									density="compact"
									dir="ltr"
									suffix="تومان"
								/>
							</v-col>
							<v-col cols="12" md="4" sm="6">
								<v-text-field 
									v-model="maxPriceFormatted"
									@update:model-value="updateMaxPrice"
									label="حداکثر قیمت" 
									variant="outlined"
									hide-details
									density="compact"
									dir="ltr"
									suffix="تومان"
								/>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>

			<v-row class="d-flex justify-center align-center" align="stretch">
				<v-col 
					v-for="(product, index) in filteredProducts"
					:key="product.id"
					cols="12"
					sm="6"
					md="4"
					lg="3"
				>
					<ProductCard
						:_index="index"
						:product="product"
						@updateAmount="setAmount"
						class="flex-grow-1"
					/>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { defaultStore } from '~/store/defaultStore';
import { useProductFilters } from '~/composables/useProductFilters';

const store = defaultStore();

const { 
  searchText, 
  minPriceFormatted,
  maxPriceFormatted,
  updateMinPrice,
  updateMaxPrice,
  applyFilters 
} = useProductFilters();

const bestSellingsWithAmount = computed(() => {
  return store.bestSellings.map((product) => ({
    ...product,
    amount: store.getProductAmount(product.id),
  }));
});

const filteredProducts = computed(() => {
  const productsWithAmount = bestSellingsWithAmount.value;
  return applyFilters(productsWithAmount);
});

function setAmount(idx, val) {
  const product = bestSellingsWithAmount.value[idx];
  store.updateProductAmount(product.id, val);
}

onMounted(() => {
  store.initializeStore();
});
</script>

<style scoped>
.product-list-container {
	background-color: #f5f5f5;
	min-height: 100vh;
}

.filter-fieldset {
	background-color: white;
	border-radius: 12px;
}
</style>