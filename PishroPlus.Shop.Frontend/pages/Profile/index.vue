<template>
  <div class="profile-page">
    <v-container class="py-8">
      <v-row>
        <v-col cols="12" class="mb-6">
          <div class="d-flex justify-space-between align-center">
            <div class="d-flex align-center">
              <div class="position-relative me-4">
                <v-avatar size="120" color="grey-lighten-2">
                  <v-img v-if="profile.avatar" :src="profile.avatar" alt="profile" />
                  <v-icon v-else size="48" color="grey">mdi-account</v-icon>
                </v-avatar>
                <v-btn
                  icon="mdi-camera"
                  size="small"
                  color="primary"
                  class="position-absolute"
                  style="bottom: 0; right: 0"
                  @click="uploadAvatar"
                />
              </div>
              <div>
                <h1 class="font-weight-bold mb-1">{{ profile.firstName }} {{ profile.lastName }}</h1>
                <p class="text-grey">{{ profile.phoneNumber }}</p>
              </div>
            </div>
            <v-btn
						  color="primary"
              class="d-none d-sm-flex"
              to="/"
            >
              <h4 class="font-weight-bold">بازگشت به فروشگاه</h4>
              <v-icon class="mr-2">mdi-arrow-left</v-icon>
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12">
          <v-tabs v-model="activeTab">
            <v-tab value="personal" class="font-weight-bold">اطلاعات شخصی</v-tab>
            <v-tab value="orders" class="font-weight-bold">سفارشات</v-tab>
          </v-tabs>

          <v-window v-model="activeTab">
            <v-window-item value="personal">
              <fieldset class="custom-fieldset mb-6">
                <legend class="custom-legend">اطلاعات شخصی</legend>
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="profile.firstName"
                      label="نام"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="profile.lastName"
                      label="نام خانوادگی"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="profile.phoneNumber"
                      label="شماره موبایل"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      disabled
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="d-flex justify-center align-center" cols="12" md="4">
                    <p class="ml-2">گروه مشتری :</p>
                    <v-text-field
                      v-model="profile.stakeholderType"
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      disabled
                    />
                  </v-col>
                </v-row>
              </fieldset>

              <fieldset class="custom-fieldset mb-6">
                <legend class="custom-legend">آدرس‌ها</legend>
                <div v-for="(address, index) in profile.addresses" :key="index" class="mb-4">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <h3 class="font-weight-bold">آدرس {{ index + 1 }}</h3>
                  </div>
                  <v-row>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="address.province"
                        :items="provinces"
                        item-title="name"
                        item-value="id"
                        label="استان"
                        :rules="[rules.required]"
                        variant="outlined"
                        hide-details
                        density="compact"
                        @update:model-value="updateProvinces(address)"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-select
                        v-model="address.city"
                        :items="filteredCities(address.province)"
                        item-title="name"
                        item-value="id"
                        label="شهر"
                        :rules="[rules.required]"
                        variant="outlined"
                        hide-details
                        density="compact"
                        :disabled="!address.province"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="3">
                      <v-text-field
                        v-model="address.recipient"
                        label="گیرنده"
                        :rules="[rules.required]"
                        variant="outlined"
                        hide-details
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" md="2">
                      <v-text-field
                        v-model="address.phoneNumber"
                        label="شماره تلفن"
                        :rules="[rules.required, rules.phoneNumber]"
                        maxlength="11"
                        variant="outlined"
                        hide-details
                        density="compact"
                      />
                    </v-col>

                  </v-row>
                  <v-row>
                    <v-col cols="12" md="9">
                      <v-text-field
                        v-model="address.text"
                        label="آدرس"
                        :rules="[rules.required]"
                        variant="outlined"
                        auto-grow
                        hide-details
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <v-text-field
                        v-model="address.postalCode"
                        label="کد پستی"
                        maxlength="10"
                        variant="outlined"
                        hide-details
                        density="compact"
                      />
                    </v-col>
                    <v-col class="d-flex justify-center" cols="12" md="1">
                      <v-btn
                        icon
                        color="red"
                        variant="text"
                        @click="removeAddress(index)"
                      >
                        <v-icon size="large">mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>
                  <v-divider v-if="index < profile.addresses.length - 1" class="my-4" />
                </div>
                <v-btn
                  color="primary"
                  variant="outlined"
                  prepend-icon="mdi-plus"
                  class="mt-2"
                  @click="addAddress"
                >
                  افزودن آدرس جدید
                </v-btn>
              </fieldset>

              <div class="d-flex justify-end">
                <v-btn color="primary" size="large">
                  ذخیره تغییرات
                </v-btn>
              </div>
            </v-window-item>

            <v-window-item value="orders">
              <fieldset class="custom-fieldset">
                <legend class="custom-legend">سفارشات</legend>
                <div v-if="orderStore.length > 0">
                  <!-- Desktop View -->
                  <div class="table-container d-none d-md-block">
                    <v-table class="orders-table">
                      <thead>
                        <tr>
                          <th class="text-center order-column">شماره سفارش</th>
                          <th class="text-center date-column">تاریخ</th>
                          <th class="text-center price-column">مبلغ کل</th>
                          <th class="text-center status-column">وضعیت</th>
                          <th class="text-center actions-column">عملیات</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="order in orderStore" :key="order.id">
                          <td class="text-center">{{ order.id }}</td>
                          <td class="text-center">{{ order.date }}</td>
                          <td class="text-center">{{ new Intl.NumberFormat('fa-IR').format(order.total) }} تومان</td>
                          <td class="text-center">
                            <v-chip
                              :color="getOrderStatusColor(order.status)"
                              size="small"
                            >
                              {{ order.status }}
                            </v-chip>
                          </td>
                          <td class="text-center">
                            <v-btn
                              variant="text"
                              color="primary"
                              density="comfortable"
                              @click="viewOrderDetails(order)"
                            >
                              مشاهده جزئیات
                            </v-btn>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>

                  <!-- Mobile View -->
                  <div class="d-md-none">
                    <v-card
                      v-for="order in orderStore"
                      :key="order.id"
                      class="mb-4"
                      variant="outlined"
                    >
                      <v-card-item>
                        <div class="d-flex justify-space-between align-center mb-2">
                          <span class="text-subtitle-1 font-weight-bold">سفارش {{ order.id }}</span>
                          <v-chip
                            :color="getOrderStatusColor(order.status)"
                            size="small"
                          >
                            {{ order.status }}
                          </v-chip>
                        </div>
                        <div class="d-flex flex-column ga-2">
                          <div class="d-flex justify-space-between">
                            <span class="text-grey">تاریخ:</span>
                            <span>{{ order.date }}</span>
                          </div>
                          <div class="d-flex justify-space-between">
                            <span class="text-grey">مبلغ کل:</span>
                            <span>{{ new Intl.NumberFormat('fa-IR').format(order.total) }} تومان</span>
                          </div>
                          <v-btn
                            block
                            color="primary"
                            variant="text"
                            @click="viewOrderDetails(order)"
                          >
                            مشاهده جزئیات
                          </v-btn>
                        </div>
                      </v-card-item>
                    </v-card>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <v-icon size="64" color="grey" class="mb-4">mdi-package-variant</v-icon>
                  <p class="text-grey-darken-1">هنوز سفارشی ثبت نشده است</p>
                </div>
              </fieldset>
            </v-window-item>
          </v-window>
        </v-col>
      </v-row>
    </v-container>

    <v-dialog v-model="showOrderDetails" max-width="600">
      <v-card>
        <v-card-title class="text-right">جزئیات سفارش {{ selectedOrder?.id }}</v-card-title>
        <v-card-text>
          <v-list v-if="selectedOrder">
            <v-list-item v-for="item in selectedOrder.items" :key="item.id">
              <v-list-item-title>{{ item.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ new Intl.NumberFormat('fa-IR').format(item.price) }} تومان × {{ item.quantity }}
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="primary"
            variant="text"
            @click="showOrderDetails = false"
          >
            بستن
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { defaultStore } from '~/store/defaultStore';
import imageCompression from 'browser-image-compression';

const showOrderDetails = ref(false);
const selectedOrder = ref(null);
const activeTab = ref('personal');
const store = defaultStore();
const orderStore = computed(() => store.orders);
const provinces = ref(store.provinces);
const cities = ref(store.cities);

const filteredCities = computed(() => {
  return (provinceId) => {
    return cities.value.filter(city => city.province_id === provinceId);
  };
});

const route = useRoute();
if (route.query.tab) {
  activeTab.value = route.query.tab;
}

const profile = ref({
  firstName: store.userEntity?.firstName || 'Fname',
  lastName: store.userEntity?.lastName || 'Lname',
  phoneNumber: store.userEntity?.phoneNumber || 'PhoneNumber',
  stakeholderType: store.userEntity?.isStockHolder ? 'سهامدار' : 'کاربر عادی',
  avatar: null,
  addresses: [
    {
      recipient: 'محسن حسینی فر',
      phoneNumber: '09371401910',
      province: 'یزد',
      city: 'یزد',
      text: 'مردآباد، ورزشگاه سلمان، پشت مسجد صاحب الزمان، بغل نانوایی حسن زاده',
      postalCode: '8917943255'
    }
  ],
  orders: [
    {
      id: '10001',
      date: '1402/12/25',
      total: 2500000,
      status: 'تحویل شده',
      items: [
        { id: 1, title: 'انگشتر نقره', price: 1500000, quantity: 1 },
        { id: 2, title: 'ماست محلی', price: 500000, quantity: 2 }
      ]
    },
    {
      id: '10002',
      date: '1402/12/28',
      total: 3800000,
      status: 'در حال پردازش',
      items: [
        { id: 3, title: 'قارچ طلایی', price: 1900000, quantity: 2 }
      ]
    },
    {
      id: '10003',
      date: '1402/12/28',
      total: 3800000,
      status: 'لغو شده',
      items: [
        { id: 3, title: 'قارچ طلایی', price: 1900000, quantity: 2 }
      ]
    },
    {
      id: '10004',
      date: '1402/12/28',
      total: 3800000,
      status: 'به طرز عجیبی معلق',
      items: [
        { id: 3, title: 'قارچ طلایی', price: 1900000, quantity: 2 }
      ]
    }
  ]
});

const rules = {
  required: (v) => !!v || "این فیلد الزامی است",
  phoneNumber: (v) => /^09\d{9}$/.test(v) || "شماره موبایل معتبر نیست",
}

function uploadAvatar() {
  const { $swal } = useNuxtApp()

  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';

  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        $swal.fire({
          title: 'خطا!',
          text: 'حجم فایل نباید بیشتر از  ۵ مگابایت باشد',
          icon: 'error',
          // showConfirmButton: false,
          // timer: '1500'
          confirmButtonColor: "#ebe4e6",
          confirmButtonText: 'متوجه شدم'
        });
        return;
      }

      try {
        let imageFile = file;
        
        if (file.size > 100 * 1024) {
          const options = {
            maxSizeMB: 0.1,
            maxWidthOrHeight: 800,
            useWebWorker: true
          };
          
          imageFile = await imageCompression(file, options);
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          profile.value.avatar = e.target.result;
          
          $swal.fire({
            title: 'موفق!',
            text: 'تصویر پروفایل با موفقیت آپلود شد',
            icon: 'success',
            confirmButtonColor: "#dfeddf",
            confirmButtonText: 'متوجه شدم'
          });
        };
        reader.readAsDataURL(imageFile);
        
        // send imageFile to server
        // await uploadAvatar(imageFile);
        
      } catch (error) {
        console.error('Error processing image:', error);
        $swal.fire({
          title: 'خطا!',
          text: 'مشکلی در پردازش تصویر رخ داد',
          icon: 'error',
          confirmButtonColor: "#ebe4e6",
          confirmButtonText: 'متوجه شدم'
        });
      }
    }
  };
  input.click();
}

// async function uploadAvatarToServer(file) {
//   const formData = new FormData();
//   formData.append('avatar', file);

//   try {
//     const response = await fetch('/api/upload-avatar', {
//       method: 'POST',
//       body: formData
//     });

//     if (response.ok) {
//       const result = await response.json();
//       console.log('آواتار با موفقیت آپلود شد', result);
//     } else {
//       console.error('خطا در آپلود آواتار');
//     }
//   } catch (error) {
//     console.error('خطای شبکه', error);
//   }
// }

function updateProvinces(address) {
  address.city = '';
  // console.log('Provice changed to :', address);
  // if (address.province === 'یزد') {
  //   address.city = '';
  // } else {
  //   address.city = '';
  // }
}

function addAddress() {
  profile.value.addresses.push({
    recipient: '',
    phoneNumber: '',
    province: '',
    city: '',
    text: '',
    postalCode: ''
  });
}

function removeAddress(index) {
  profile.value.addresses.splice(index, 1);
}

function getOrderStatusColor(status) {
  switch (status) {
    case 'تحویل شده':
      return 'success';
    case 'در حال پردازش':
      return 'warning';
    case 'لغو شده':
      return 'error';
    default:
      return 'grey';
  }
}

function viewOrderDetails(order) {
  selectedOrder.value = order;
  showOrderDetails.value = true;
}

onMounted(() => {
  store.initializeStore();
});

</script>

<style scoped>
.table-container {
  width: 100%;
  margin: 0 auto;
  overflow-x: auto;
}
.orders-table {
  width: 100%;
  margin: 0 auto;
  border-collapse: separate;
  border-spacing: 0;
}
.order-column {
  width: 15%;
}

.date-column {
  width: 20%;
}

.price-column {
  width: 25%;
}

.status-column {
  width: 15%;
}

.actions-column {
  width: 25%;
}

@media (min-width: 1400px) {
  .orders-table {
    width: 90%;
  }

  .orders-table td,
  .orders-table th {
    padding: 1rem;
  }
}

@media (min-width: 1600px) {
  .orders-table {
    width: 85%;
  }

  .orders-table td,
  .orders-table th {
    padding: 1.25rem;
  }
}

@media (min-width: 1920px) {
  .orders-table {
    width: 80%;
  }

  .orders-table td,
  .orders-table th {
    padding: 1.5rem;
  }
}

@media (min-width: 2560px) {
  .orders-table {
    width: 70%;
  }

  .orders-table td,
  .orders-table th {
    padding: 2rem;
  }
}

.custom-fieldset {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.5rem;
  position: relative;
  margin-top: 2rem;
}

.custom-legend {
  position: absolute;
  top: -1rem;
  right: 50%;
  transform: translateX(50%);
  background-color: white;
  padding: 0 0.5rem;
  font-weight: bold;
  color: #1867c0;
  text-align: center;
}

.position-relative {
  position: relative;
}

.position-absolute {
  position: absolute;
}

.v-tab__slider {
  margin-bottom: -10px !important;
}
</style>