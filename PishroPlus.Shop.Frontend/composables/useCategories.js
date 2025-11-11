import { ref, onMounted } from 'vue';

export function useCategories() {
  const categories = ref([]);
  const isLoading = ref(false);
  const error = ref(null);

  const fetchCategories = async () => {
    const { $axios } = useNuxtApp();
    isLoading.value = true;
    error.value = null;
    
    const response = await $axios.get('/Shop/Categories');
    if (response.data.isSuccess) {
      categories.value = [response.data.value];
    } else {
      error.value = 'خطا در دریافت دسته‌بندی‌ها';
    }
    isLoading.value = false;
  };

  onMounted(() => {
    fetchCategories();
  });

  return {
    categories,
    isLoading,
    error,
    fetchCategories
  };
}

// export function useCategories() {
//   const categories = [
//     {
//       id: 'fsaa',
//       title: 'لوازم یدکی',
//       link: '/product/122',
//     },
//     {
//       id: 'mobile',
//       title: 'موبایل',
//       items: [
//         {
//           id: 'mobile-brands',
//           title: 'برندهای مختلف گوشی',
//           items: [
//             {
//               id: 'apple-phonett', title: 'گوشی اپل',
//               items: [
//                 { id: 'apple-phone', title: 'گوشی اپل', link: '/product/156' },
//                 { id: 'samsung-phone', title: 'گوشی سامسونگ', link: '/product/256' },
//                 { id: 'xiaomi-phone', title: 'گوشی شیائومی', link: '/product/356' },
//                 { id: 'blackberry-phone', title: 'گوشی بلک بری', link: '/product/456' }
//               ]
//             },
//             { id: 'samsung-phonett', title: 'گوشی سامسونگ', link: '/product/2' },
//             { id: 'xiaomi-phonett', title: 'گوشی شیائومی', link: '/product/3' },
//             { id: 'blackberry-phonett', title: 'گوشی بلک بری', link: '/product/4' }
//           ]
//         },
//         {
//           id: 'mobile-price',
//           title: 'گوشی بر اساس قیمت',
//           items: [
//             { id: 'phone-5m', title: 'گوشی تا 5 میلیون', link: '/product/5' },
//             { id: 'phone-10m', title: 'گوشی تا 10 میلیون', link: '/product/6' },
//             { id: 'phone-15m', title: 'گوشی تا 15 میلیون', link: '/product/7' },
//             { id: 'phone-15m-plus', title: 'گوشی بالای 15 میلیون', link: '/product/8' }
//           ]
//         },
//         {
//           id: 'mobile-usage',
//           title: 'گوشی حالیت باشه',
//           link: '/product/12',
//         },
//       ]
//     },
//     {
//       id: 'tablet',
//       title: 'تبلت',
//       items: [
//         {
//           id: 'tablet-brands',
//           title: 'برندهای مختلف تبلت',
//           items: [
//             { id: 'apple-tablet', title: 'تبلت اپل', link: '/product/13' },
//             { id: 'samsung-tablet', title: 'تبلت سامسونگ', link: '/product/14' },
//             { id: 'lenovo-tablet', title: 'تبلت لنوو', link: '/product/15' },
//             { id: 'huawei-tablet', title: 'تبلت هواوی', link: '/product/16' }
//           ]
//         },
//         {
//           id: 'tablet-price',
//           title: 'تبلت بر اساس قیمت',
//           items: [
//             { id: 'tablet-5m', title: 'تبلت تا 5 میلیون', link: '/product/17' },
//             { id: 'tablet-10m', title: 'تبلت تا 10 میلیون', link: '/product/18' },
//             { id: 'tablet-15m', title: 'تبلت تا 15 میلیون', link: '/product/19' },
//             { id: 'tablet-15m-plus', title: 'تبلت بالای 15 میلیون', link: '/product/20' }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'IPad',
//       title: 'آیپد',
//       items: [
//         {
//           id: 'IPad-brands',
//           title: 'برندهای مختلف آیپد',
//           items: [
//             { id: 'apple-IPad', title: 'آیپد اپل', link: '/product/21' },
//             { id: 'samsung-IPad', title: 'آیپد سامسونگ', link: '/product/22' },
//             { id: 'lenovo-IPad', title: 'آیپد لنوو', link: '/product/23' },
//             { id: 'huawei-IPad', title: 'آیپد هواوی', link: '/product/24' }
//           ]
//         },
//         {
//           id: 'IPad-price',
//           title: 'آیپد بر اساس قیمت',
//           items: [
//             { id: 'IPad-5m', title: 'آیپد تا 5 میلیون', link: '/product/25' },
//             { id: 'IPad-10m', title: 'آیپد تا 10 میلیون', link: '/product/26' },
//             {
//               id: 'IPad-15m', title: 'آیپد تا 15 میلیون',
//               items: [
//                 { id: 'tablet-5m', title: 'تبلت تا 5 میلیون', link: '/product/67' },
//                 { id: 'tablet-10m', title: 'تبلت تا 10 میلیون', link: '/product/68' },
//                 { id: 'tablet-15m', title: 'تبلت تا 15 میلیون', link: '/product/69' },
//                 { id: 'tablet-15m-plus', title: 'تبلت بالای 15 میلیون', link: '/product/60' }
//               ]
//             },
//             { id: 'IPad-15m-plus', title: 'آیپد بالای 15 میلیون', link: '/product/28' }
//           ]
//         }
//       ]
//     }
//   ];

//   return {
//     categories
//   };
// }