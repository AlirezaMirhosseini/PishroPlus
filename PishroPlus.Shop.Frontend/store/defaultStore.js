import { defineStore } from "pinia";
import { ref } from "vue";
import { provinces, cities } from "~/utils/provincesAndCities";
import noImage from "~/assets/image/noImage.jpg";
import { setToken, removeToken } from '~/utils/cookieLSAuth';



const defaultValues = {
  items: [],
  favoriteProducts: [],
  newestProducts: [],
  bestSellings: [],
  specials: [],
  _products: [],
  orders: [],
  currentProduct: null,
  userEntity: null,
  token: '',
  provinces,
  cities,
};

export const defaultStore = defineStore("defualt", {
  state: () => {
    return {
      ...defaultValues,
    };
  },
  
  getters: {
    getFavoriteCount: (state) => state.favoriteProducts.length,

    getProductById: (state) => (id) => {
      return  state.bestSellings.find(p => p.id === id) || 
              state.newestProducts.find(p => p.id === id) || 
              state.specials.find(p => p.id === id);
    },
    
    getProductAmount: (state) => (id) => {
      const cartItem = state.items.find(item => item.id === id);
      return cartItem ? cartItem.amount : 0;
    },

    getCurrentProduct: (state) => state.currentProduct,

    userFullName: (state) => state.userEntity ? `${state.userEntity.firstName} ${state.userEntity.lastName}` : '',
    
    isStockHolder: (state) => state.userEntity?.isStockHolder || false,
    
    isAuthenticated: (state) => !!state.token,
  },
  
  actions: {
    async fetchProducts() {
      const { $axios } = useNuxtApp();

      const response = await $axios.get('/Shop/Home/Products');
      if (response.data.isSuccess) {
        const processedProducts = response.data.value.map(product => ({
          ...product,
          price: Math.trunc(product.price),
        }));
        this.specials = processedProducts.filter(product => product.shopPosition === 2);
        this.bestSellings = processedProducts.filter(product => product.shopPosition === 3);
        this.newestProducts = processedProducts.filter(product => product.shopPosition === 4);

        this.saveProductsToLocalStorage();
      } else {
        console.error('خطا در دریافت محصولات:');
        this.loadProductsFromLocalStorage();
      }
    },

    async getProductBySlug(params) {
      const { $axios } = useNuxtApp();
      try {
        const response = await $axios.get('/Shop/Products', {
          params: {
            page: 1,
            size: 10,
            code: params.code,
          },
        });
  
        if (response.data.isSuccess) {
          const fetchedProductData = response.data.value.result[0];
          const finalProduct = await this.fetchProductById(fetchedProductData.id);
          const defaultImages = [noImage, noImage, noImage, noImage];
          
          this.currentProduct = {
            ...finalProduct,
            images: finalProduct.images?.length > 0 ? finalProduct.images : defaultImages,
            amount: this.getProductAmount(finalProduct.id)
          };
          
          return this.currentProduct;
        }
        return null;
      } catch (error) {
        console.error('Error fetching product:', error);
        return null;
      }
    },

    async fetchProductById(productId) {
      const { $axios } = useNuxtApp();
      
      const response = await $axios.get(`/Shop/Products/${productId}`);
      if (response.data.isSuccess) {
        const productData = response.data.value;
        const defaultImages = [ noImage, noImage, noImage, noImage ];
        
        this.currentProduct = {
          ...productData,
          images: productData.images?.length > 0 ? productData.images : defaultImages,
          amount: this.getProductAmount(productId),
        };
        
        return this.currentProduct;
      } else {
        console.error('خطا در دریافت اطلاعات محصول:');
        return null;
      }
    },

    saveProductsToLocalStorage() {
      localStorage.setItem('specials', JSON.stringify(this.specials));
      localStorage.setItem('bestSellings', JSON.stringify(this.bestSellings));
      localStorage.setItem('newestProducts', JSON.stringify(this.newestProducts));
    },

    loadProductsFromLocalStorage() {
      const savedSpecials = localStorage.getItem('specials');
      const savedBestSellings = localStorage.getItem('bestSellings');
      const savedNewestProducts = localStorage.getItem('newestProducts');
      
      if (savedSpecials) this.specials = JSON.parse(savedSpecials);
      if (savedBestSellings) this.bestSellings = JSON.parse(savedBestSellings);
      if (savedNewestProducts) this.newestProducts = JSON.parse(savedNewestProducts);
    },
  
    initializeStore() {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        this.items = JSON.parse(savedCart)
      }
      const favorites = localStorage.getItem('favoriteProducts')
      if (favorites) {
        this.favoriteProducts = JSON.parse(favorites)
      }
      const savedOrders = localStorage.getItem('orders');
      if (savedOrders) {
        this.orders = JSON.parse(savedOrders);
      }
      
      const savedSpecials = localStorage.getItem('specials');
      const savedBestSellings = localStorage.getItem('bestSellings');
      const savedNewestProducts = localStorage.getItem('newestProducts');
      
      if (savedSpecials) this.specials = JSON.parse(savedSpecials);
      if (savedBestSellings) this.bestSellings = JSON.parse(savedBestSellings);
      if (savedNewestProducts) this.newestProducts = JSON.parse(savedNewestProducts);
    },
    
    addOrder(cartItems) {
      const order = {
        id: `${10000 + this.orders.length + 1}`,
        date: new Date().toLocaleDateString('fa-IR'),
        total: cartItems.reduce((sum, item) => {
          return sum + ((item.priceWithDiscount || item.price) * item.amount)
        }, 0),
        status: 'در حال پردازش',
        items: cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.priceWithDiscount || item.price,
          quantity: item.amount
        }))
      };
      
      this.orders.push(order);
      
      localStorage.setItem('orders', JSON.stringify(this.orders));
    },
    //////////////////////////////////////////
    updateProductAmount(productId, amount) {
      const product = this.getProductById(productId);
      if (product) {
        if (amount <= 0) {
          product.amount = 0;
          this.items = this.items.filter(item => item.id !== productId);
        } else {
          product.amount = amount;
          this.addItem(product, amount);
        }
        
        if (this.currentProduct && this.currentProduct.id === productId) {
          this.currentProduct.amount = amount;
        }
        
        this.syncProductAmounts();
      }
      this.saveToLocalStorage();
    },
    // async updateProductAmount(productId, amount, unitId) {
    //   const { $axios } = useNuxtApp();
    //   const product = this.getProductById(productId);
      
    //   if (!product) return;
    
    //   try {
    //     await $axios.post('/Shop/Users/Cart', {
    //       productId: productId,
    //       amount: amount,
    //       unitId: unitId
    //     });
    
    //     if (amount <= 0) {
    //       this.items = this.items.filter(item => item.id !== productId);
    //       product.amount = 0;
    //     } else {
    //       const existingItem = this.items.find(item => item.id === productId);
    //       if (existingItem) {
    //         existingItem.amount = amount;
    //         existingItem.unitId = unitId;
    //       } else {
    //         const selectedUnit = product.units?.find(u => u.id === unitId);
    //         this.items.push({
    //           ...product,
    //           amount: amount,
    //           unitId: unitId,
    //           unitTitle: selectedUnit?.title || ''
    //         });
    //       }
    //       product.amount = amount;
    //     }
    
    //     if (this.currentProduct && this.currentProduct.id === productId) {
    //       this.currentProduct.amount = amount;
    //     }
    
    //     this.syncProductAmounts();
    //     this.saveToLocalStorage();
    
    //   } catch (error) {
    //     console.error('خطا در بروزرسانی سبد خرید:', error.response?.data || error.message);
    //     throw error;
    //   }
    // },
    /////////////////////////////////////////////

    syncProductAmounts() {
      [...this.newestProducts, ...this.bestSellings].forEach(product => {
        const cartItem = this.items.find(item => item.id === product.id);
        product.amount = cartItem ? cartItem.amount : 0;
      });
    },

    clearAllFavorites() {
      const productsToRemove = [...this.favoriteProducts];
      productsToRemove.forEach(product => {
        const originalProduct = this.getProductById(product.id);
        if (originalProduct) {
          originalProduct.isFavorite = false;
        }
      });
      this.favoriteProducts = [];
      localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
    },

    saveToLocalStorage() {
      if (this.items.length > 0) {
        localStorage.setItem('cart', JSON.stringify(this.items));
      } else {
        localStorage.removeItem('cart');
      }
    },

    saveFavoritesToLocalStorage() {
      if (this.favoriteProducts.length > 0) {
        localStorage.setItem('favoriteProducts', JSON.stringify(this.favoriteProducts));
      } else {
        localStorage.removeItem('favoriteProducts');
      }
    },

    addItem(product, amount) {
      const existingItem = this.items.find(item => item.id === product.id);

      if (amount === 0) {
        const index = this.items.indexOf(existingItem);
        if (index > -1) {
          this.items.splice(index, 1);
        }
      } else {
        if (existingItem) {
          existingItem.amount = amount;
        } else {
          this.items.push({
            id: product.id,
            title: product.title,
            price: product.price,
            discountPercent: product.discountPercent,
            priceWithDiscount: product.priceWithDiscount,
            image: product.image,
            isFavorite: product.isFavorite,
            amount: amount,
          });
        }
      }
      this.saveToLocalStorage();
    },
    
    async toggleFavorite(product) {
      const { $axios } = useNuxtApp();
      console.log(product);
      const existingFavorite = this.favoriteProducts.find(item => item.id === product.id);
      
      if (existingFavorite) {
        const response = await $axios.delete(`/Shop/Users/Favorites/${product.id}`);
        if (response.data.isSuccess) {
          const index = this.favoriteProducts.findIndex(item => item.id === product.id);
          if (index > -1) {
            this.favoriteProducts.splice(index, 1);
          }
        } else {
          console.error('خطا در عملیات علاقه‌مندی:', error.response?.data || error.message);
        }
      } else {
        console.log(product.id);
        const response = await $axios.post('/Shop/Users/Favorites', {
          productId: product.id
        });
        if (response.data.isSuccess) {
          this.favoriteProducts.push({
            id: product.id,
            title: product.title,
            price: product.price,
            discountPercent: product.discountPercent,
            priceWithDiscount: product.priceWithDiscount,
            image: product.image,
            isFavorite: true,
          });
        } else {
          console.error('خطا در عملیات علاقه‌مندی:', error.response?.data || error.message);
        }
      }
      const cartItem = this.items.find(item => item.id === product.id);
      if (cartItem) {
        cartItem.isFavorite = !cartItem.isFavorite;
      }
      
      this.saveFavoritesToLocalStorage();
    },
    
    isFavorite(productId) {
      return this.favoriteProducts.some(item => item.id === productId);
    },

    removeItem(index) {
      this.items.splice(index, 1);
      this.saveToLocalStorage();
    },

    async updateProductAmount(productId, amount) {
      const { $axios } = useNuxtApp();
      const product = this.getProductById(productId);
      
      if (!product) return;

      const response = await $axios.post('/Shop/Users/Cart', {
        productId: productId,
        amount: amount
      });
      if (response.data.isSuccess) {
        if (amount <= 0) {
          this.items = this.items.filter(item => item.id !== productId);
          product.amount = 0;
        } else {
          const existingItem = this.items.find(item => item.id === productId);
          if (existingItem) {
            existingItem.amount = amount;
          } else {
            this.items.push({
              ...product,
              amount: amount
            });
          }
          product.amount = amount;
        }
        if (this.currentProduct && this.currentProduct.id === productId) {
          this.currentProduct.amount = amount;
        }
        this.syncProductAmounts();
        this.saveToLocalStorage();
      } else {
        console.error('خطا در بروزرسانی سبد خرید:');
      }
    },
    
    updateAmount(index, newAmount) {
      if (newAmount <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].amount = newAmount;
        this.saveToLocalStorage();
      }
    },
    
    clearCart() {
      this.items = [];
      localStorage.removeItem('cart');
    },
    
    getTotalPrice() {
      return this.items.reduce((total, item) => {
        const price = item.priceWithDiscount || item.price;
        return total + (price * item.amount);
      }, 0);
    },
    
    getTotalItems() {
      return this.items.reduce((total, item) => {
        return total + item.amount
      }, 0);
    },

    async setUserToken(token) {
      const { $axios } = useNuxtApp();
      const { jwtDecode } = await import('jwt-decode');
      
      this.token = token;
      setToken(token);
      
      const decodedToken = jwtDecode(token);
    
      const response = await $axios.get(`/Shop/Users/Profiles/${decodedToken.user_id}`);
      if (response.data.isSuccess) {
        this.userEntity = response.data.value;
        localStorage.setItem("userEntity", JSON.stringify(response.data.value));
      } else {
        console.error('خطا در دریافت اطلاعات پروفایل:');
      }
    },
    
    clearUserData() {
      this.token = '';
      this.userEntity = null;
      removeToken();
      localStorage.removeItem('userEntity');
    },
    
    async initializeUserData() {
      const token = getToken();
      const userEntity = localStorage.getItem('userEntity');
      
      if (token) {
        this.token = token;
        
        if (!userEntity) {
          try {
            const { $axios } = useNuxtApp();
            const { jwtDecode } = await import('jwt-decode');
            const decodedToken = jwtDecode(token);
            
            const response = await $axios.get(`/Shop/Users/Profiles/${decodedToken.user_id}`);
            if (response.data.isSuccess) {
              this.userEntity = response.data.value;
              localStorage.setItem("userEntity", JSON.stringify(response.data.value));
            }
          } catch (error) {
            console.error('خطا در بازیابی اطلاعات کاربر:');
            this.clearUserData();
          }
        } else {
          this.userEntity = JSON.parse(userEntity);
        }
      }
    }
  }
});