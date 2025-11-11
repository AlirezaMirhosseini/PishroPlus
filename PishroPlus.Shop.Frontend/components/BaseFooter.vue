<template>
	<v-footer
		class="bg-grey-darken-4"
	>
		<v-container>
			<v-row>
				<v-col cols="12" md="3" class="d-flex flex-column align-center ga-6">
					<p class="text-grey font-weight-bold">فروشگاه آنلاین پویان سیستم یزد</p>
					<img src="../assets/image/enamad.png" width="100" height="100" alt="enamad">
				</v-col>

				<v-col cols="12" md="3">
					<h4 class="font-weight-bold mb-4 text-right">دسترسی سریع</h4>
					<v-list density="compact" nav class="bg-transparent pa-0">
						<v-list-item to="/profile" prepend-icon="mdi-account-circle" title="مشاهده پروفایل" class="text-grey" />
						<v-list-item to="/about-us" prepend-icon="mdi-information" title="درباره ما" class="text-grey" />
						<v-list-item to="/contact-us" prepend-icon="mdi-phone" title="تماس با ما" class="text-grey" />
					</v-list>
				</v-col>

				<v-col cols="12" md="3">
					<h4 class="font-weight-bold mb-4 text-right">خدمات مشتریان</h4>
					<v-list density="compact" nav class="bg-transparent pa-0">
						<v-list-item prepend-icon="mdi-undo" title="رویه‌های بازگشت کالا" class="text-grey" />
						<v-list-item prepend-icon="mdi-file-document" title="شرایط استفاده" class="text-grey" />
						<v-list-item prepend-icon="mdi-shield-lock" title="حریم خصوصی" class="text-grey" />
					</v-list>
				</v-col>

				<v-col cols="12" md="3">
					<h4 class="font-weight-bold mb-4 text-right">تماس با ما</h4>
					<v-list density="compact" nav class="bg-transparent pa-0">
						<v-list-item prepend-icon="mdi-map-marker" title="آدرس: یزد، خیابان مطهری" class="text-grey" />
						<v-list-item prepend-icon="mdi-phone" title="تلفن: 37654613-035" class="text-grey" />
						<v-list-item prepend-icon="mdi-email" title="ایمیل: info@altonyazd.com" class="text-grey" />
					</v-list>
				</v-col>
			</v-row>
		</v-container>
	</v-footer>
</template>

<script setup>

</script>

<style>

</style>