import { ref, watch } from 'vue';
import { arabicToPersian } from '~/utils/arabicToPersian';
import { formatNumber, parseNumber } from '~/utils/numberFormat';

export function useProductFilters() {
  const searchText = ref('');
  const minPriceFormatted = ref('');
  const maxPriceFormatted = ref('');
  const minPrice = ref(null);
  const maxPrice = ref(null);

  const updateMinPrice = (value) => {
    minPriceFormatted.value = value;
    minPrice.value = parseNumber(value);
  };

  const updateMaxPrice = (value) => {
    maxPriceFormatted.value = value;
    maxPrice.value = parseNumber(value);
  };

  watch(minPriceFormatted, (newValue) => {
    if (newValue) {
      const formatted = formatNumber(newValue);
      if (formatted !== newValue) {
        minPriceFormatted.value = formatted;
      }
    }
  });

  watch(maxPriceFormatted, (newValue) => {
    if (newValue) {
      const formatted = formatNumber(newValue);
      if (formatted !== newValue) {
        maxPriceFormatted.value = formatted;
      }
    }
  });

  function applyFilters(products) {
    return products.filter(product => {
      const nameMatch = !searchText.value || 
        arabicToPersian(product.title.toLowerCase()).includes(
          arabicToPersian(searchText.value.toLowerCase())
        );

      const priceMatch = 
        (!minPrice.value || product.price >= minPrice.value) && 
        (!maxPrice.value || product.price <= maxPrice.value);

      return nameMatch && priceMatch;
    });
  }

  return {
    searchText,
    minPrice,
    maxPrice,
    minPriceFormatted,
    maxPriceFormatted,
    updateMinPrice,
    updateMaxPrice,
    applyFilters
  };
}