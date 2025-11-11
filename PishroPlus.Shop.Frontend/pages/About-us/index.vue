<template>
  <div class="about-page">
    <v-container class="py-8">
      <div class="d-flex align-center justify-space-between mb-12">
        <h1 class="font-weight-bold mb-2">
          <span class="text-primary">قبل از خرید</span>
          <span>, بیشتر ما رو بشناس</span>
        </h1>
				<div class="d-none d-md-flex ga-2 align-center">
					<v-btn
						color="primary"
						class="d-flex align-center"
						to="/"
					>
						<h4 class="font-weight-bold">بازگشت به فروشگاه</h4>
						<v-icon class="mr-2">mdi-arrow-left</v-icon>
					</v-btn>
				</div>
      </div>

      <v-row align="center" class="mb-16">
        <v-col cols="12" md="6" order="2" order-md="1">
          <h2 class="font-weight-bold mb-6">چرا باید در مورد فروشگاه بدونید</h2>
          <p class="text-grey-darken-2 mb-4" style="line-height: 2">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. جایگاه‌ها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
          </p>
          <p class="text-grey-darken-2" style="line-height: 2">
            کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.
          </p>
        </v-col>
        <v-col cols="12" md="6" order="1" order-md="2">
          <v-img
            src="https://picsum.photos/id/180/800/600"
            class="rounded-lg"
            cover
          />
        </v-col>
      </v-row>

      <v-row align="center">
        <v-col cols="12" md="6">
          <v-img
            src="https://picsum.photos/id/177/800/600"
            class="rounded-lg"
            cover
          />
        </v-col>
        <v-col cols="12" md="6">
          <h2 class="font-weight-bold mb-6">اینجا شرکت ماست</h2>
          <p class="text-grey-darken-2 mb-4" style="line-height: 2">
            لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است. جایگاه‌ها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است و برای شرایط فعلی تکنولوژی مورد نیاز و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد.
          </p>
          <p class="text-grey-darken-2" style="line-height: 2">
            کتابهای زیادی در شصت و سه درصد گذشته، حال و آینده شناخت فراوان جامعه و متخصصان را می طلبد تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی و فرهنگ پیشرو در زبان فارسی ایجاد کرد.
          </p>
        </v-col>
      </v-row>

      <v-row class="mt-16">
        <v-col cols="12">
          <div class="text-center mb-12">
            <h2 class="font-weight-bold mb-2">ویژگی‌های ما</h2>
            <p class="text-grey-darken-1">چرا مشتریان ما را انتخاب می‌کنند</p>
          </div>
          
          <v-row>
            <v-col cols="12" md="4">
              <v-card class="feature-card" elevation="0">
                <div class="d-flex align-center mb-4">
                  <v-icon size="42" color="primary" class="me-4">mdi-truck-delivery-outline</v-icon>
                  <h3 class="font-weight-bold">ارسال سریع</h3>
                </div>
                <p class="text-grey-darken-1">ارسال سریع و مطمئن به تمام نقاط کشور با بهترین قیمت</p>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="feature-card" elevation="0">
                <div class="d-flex align-center mb-4">
                  <v-icon size="42" color="primary" class="me-4">mdi-shield-check-outline</v-icon>
                  <h3 class="font-weight-bold">تضمین اصالت</h3>
                </div>
                <p class="text-grey-darken-1">تضمین اصالت و کیفیت تمامی محصولات ارائه شده</p>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="feature-card" elevation="0">
                <div class="d-flex align-center mb-4">
                  <v-icon size="42" color="primary" class="me-4">mdi-headphones</v-icon>
                  <h3 class="font-weight-bold">پشتیبانی ۲۴/۷</h3>
                </div>
                <p class="text-grey-darken-1">پشتیبانی شبانه‌روزی و پاسخگویی سریع به مشتریان</p>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>

</script>

<style scoped>
.about-page {
  background-color: #f5f5f5;
  min-height: 100vh;
}

.feature-card {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  height: 100%;
  transition: transform 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
}
</style>