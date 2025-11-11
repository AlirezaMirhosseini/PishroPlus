<template>
  <div>
    <v-row justify="center">
      <v-col cols="12" md="10">
        <div class="d-flex justify-space-between align-center">
          <div class="d-flex align-center my-6">
            <v-icon size="large" color="primary" class="ml-2">mdi-clipboard-list</v-icon>
            <h1 class="font-weight-bold" style="border-bottom: 3px solid blue">سبد خرید</h1>
          </div>
          <v-btn v-if="store.items.length" to="/" color="primary" class="d-flex align-center my-6">
            <h4 class="font-weight-bold">بازگشت به فروشگاه</h4>
            <v-icon class="mr-2">mdi-arrow-left</v-icon>
          </v-btn>
        </div>

        <v-card v-if="!store.items.length" class="text-center pa-8 mb-6">
          <v-icon size="64" color="grey">mdi-cart-outline</v-icon>
          <h2 class="mt-4">سبد خرید شما خالی است</h2>
          <v-btn
            color="primary"
            class="mt-4"
            to="/"
          >
            <v-icon class="ml-2">mdi-cart</v-icon>
            <h4 class="font-weight-bold">بازگشت به فروشگاه</h4>
          </v-btn>
        </v-card>

        <template v-else>
          <v-card class="mb-6">
            <v-table>
              <thead>
                <tr>
                  <th class="text-right">تصویر</th>
                  <th class="text-right">نام محصول</th>
                  <th class="text-center">واحد</th>
                  <th class="text-center">قیمت واحد</th>
                  <th class="text-center">تخفیف</th>
                  <th class="text-center">تعداد</th>
                  <th class="text-center">قیمت کل</th>
                  <th class="text-center">حذف محصول</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in store.items" :key="index">
                  <td class="pa-2">
                    <v-img
                      :src="item.image || noImage"
                      :alt="item.title"
                      width="80"
                      height="80"
                      cover
                      class="rounded"
                    />
                  </td>
                  <td class="text-right">{{ item.title }}</td>
                  <td class="text-center">{{ item.unitTitle }}</td>
                  <td class="text-center">
                    <div class="d-flex flex-column align-center">
                      <span v-if="item.priceWithDiscount" class="font-weight-bold">
                        {{ item.priceWithDiscount.toLocaleString('fa-IR') }} تومان
                      </span>
                      <span :class="{'text-decoration-line-through': item.priceWithDiscount, 'text-grey': item.priceWithDiscount}">
                        {{ item.price.toLocaleString('fa-IR') }} تومان
                      </span>
                    </div>
                  </td>
                  <td class="text-center">
                    <v-chip
                      v-if="item.discountPercent"
                      color="red"
                      text-color="white"
                      size="small"
                    >
                      {{ item.discountPercent }}%
                    </v-chip>
                    <span v-else>-</span>
                  </td>
                  <td>
                    <div class="d-flex justify-center align-center ga-3">
                      <v-btn
                        icon="mdi-plus"
                        size="x-small"
                        color="#00ba06"
                        variant="tonal"
                        @click="store.updateAmount(index, item.amount + 1)"
                      />
                      <span class="mx-3 font-weight-bold" style="font-size: 12pt">{{ item.amount }}</span>
                      <v-btn
                        icon="mdi-minus"
                        size="x-small"
                        color="#ed0222"
                        variant="tonal"
                        @click="store.updateAmount(index, item.amount - 1)"
                      />
                    </div>
                  </td>
                  <td class="text-center">
                    {{ ((item.priceWithDiscount || item.price) * item.amount).toLocaleString('fa-IR') }} تومان
                  </td>
                  <td class="text-center">
                    <v-btn
                      icon="mdi-delete"
                      color="red"
                      variant="text"
                      @click="store.removeItem(index)"
                    />
                  </td>
                </tr>
              </tbody>
            </v-table>
          </v-card>

          <v-card class="pa-5 mb-4">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex justify-space-between align-center ma-2">
                <h3>مبلغ کل :</h3>
                <h3 class="text-grey text-decoration-line-through">
                  {{ getTotalWithoutDiscount().toLocaleString('fa-IR') }} تومان
                </h3>
              </div>
              <hr>
              <div class="d-flex justify-space-between align-center ma-2">
                <h3> تخفیف ها :</h3>
                <h3 class="text-red">
                  {{ getTotalDiscount().toLocaleString('fa-IR') }} تومان
                </h3>
              </div>
              <hr>
              <div class="d-flex justify-space-between align-center ma-2">
                <h3>مبلغ قابل پرداخت :</h3>
                <h2 class="font-weight-bold text-success">
                  {{ store.getTotalPrice().toLocaleString('fa-IR') }} تومان
                </h2>
              </div>
            </div>
            
            <div class="d-flex justify-end mt-6">
              <v-btn
                color="red"
                variant="outlined"
                class="ml-4"
                @click="showClearConfirm = true"
              >
                حذف سبد خرید
              </v-btn>
              <v-btn
                color="primary"
                @click="proceedToCheckout"
              >
                ثبت نهایی
              </v-btn>
            </div>
          </v-card>
        </template>
      </v-col>
    </v-row>

    <v-dialog v-model="showClearConfirm" max-width="400">
      <v-card>
        <v-card-title class="text-right">خالی‌کردن سبد خرید</v-card-title>
        <v-card-text class="text-right">
          آیا مطمئن هستید که می‌خواهید تمام محصولات را از سبد خرید حذف کنید؟
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
            @click="clearEntireCart"
          >
            حذف همه
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { defaultStore } from '~/store/defaultStore';
import { onMounted } from 'vue';
import noImage from '~/assets/image/noImage.jpg';

const store = defaultStore();

const showClearConfirm = ref(false);

onMounted(() => {
  store.initializeStore()
});

function getTotalWithoutDiscount() {
  return store.items.reduce((total, item) => {
    return total + (item.price * item.amount);
  }, 0);
}

function getTotalDiscount() {
  return store.items.reduce((total, item) => {
    if (item.priceWithDiscount) {
      return total + ((item.price - item.priceWithDiscount) * item.amount);
    }
    return total;
  }, 0);
}

function proceedToCheckout() {
  store.addOrder([...store.items]);
  store.clearCart();
  navigateTo('/profile?tab=orders');
}

function clearEntireCart() {
  store.clearCart();
  showClearConfirm.value = false;
}
</script>
