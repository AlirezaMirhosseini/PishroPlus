<template>
	<div class="contact-page">
		<v-container>
			<div class="d-flex align-center justify-space-between mb-8">
				<div class="d-flex align-center">
					<v-icon size="x-large" color="primary" class="me-2">mdi-chat</v-icon>
					<h1 class="font-weight-bold" style="border-bottom: 3px solid blue">ارتباط با ما</h1>
				</div>
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
			
			<fieldset class="custom-fieldset">
				<legend class="custom-legend">راه‌های ارتباطی</legend>
				
				<div class="d-flex flex-wrap justify-center ga-4 mb-8">
					<v-btn
						color="#0088cc"
						class="contact-btn"
						href="https://t.me/alirezamirhosseini"
						target="_blank"
					>
						<v-icon size="x-large" color="white" style="transform: rotate(-45deg);">mdi-send-circle</v-icon>
						<p class="text-white mr-2">تلگرام</p>
					</v-btn>

					<v-btn
						color="#25D366"
						class="contact-btn"
						href="https://wa.me/989135230364"
						target="_blank"
					>
						<v-icon size="x-large" color="white">mdi-whatsapp</v-icon>
						<p class="text-white mr-2">واتساپ</p>
					</v-btn>

					<v-btn
						color="#1867C0"
						class="contact-btn"
						href="tel:+989135230364"
					>
						<v-icon size="large" color="white">mdi-phone</v-icon>
						<p class="text-white mr-2">تماس با پشتیبانی</p>
					</v-btn>
				</div>

				<v-divider class="mb-8" />

				<div class="contact-form">
					<h2 class="text-center font-weight-bold mb-6">نظر خود را با ما در میان بگذارید</h2>
					
					<v-form ref="form" v-model="valid" @submit.prevent="submitForm">
						<v-row>
							<v-col cols="12" md="6">
								<v-text-field
									v-model="formData.name"
									label="نام شما"
									variant="outlined"
									:rules="[rules.required]"
									hide-details
									density="compact"
								/>
							</v-col>

							<v-col cols="12" md="6">
								<v-text-field
									v-model="formData.email"
									label="ایمیل شما"
									variant="outlined"
									:rules="[rules.required, rules.email]"
									hide-details
									density="compact"
								/>
							</v-col>

							<v-col cols="12">
								<v-textarea
									v-model="formData.message"
									label="دیدگاه شما"
									variant="outlined"
									rows="6"
									:rules="[rules.required]"
									hide-details
									density="compact"
								/>
							</v-col>

							<v-col cols="12">
								<div class="d-flex justify-end">
									<v-btn
										type="submit"
										color="primary"
										size="large"
										min-width="150"
										:loading="loading"
									>
										ثبت
									</v-btn>
								</div>
							</v-col>
						</v-row>
					</v-form>
				</div>
			</fieldset>
		</v-container>

		<v-snackbar
			v-model="showSnackbar"
			color="success"
			timeout="3000"
			location="top"
		>
			پیام شما با موفقیت ارسال شد.
		</v-snackbar>
	</div>
</template>

<script setup>
import { ref, computed } from 'vue';

const form = ref(null);
const valid = ref(false);
const loading = ref(false);
const showSnackbar = ref(false);

const formData = ref({
	name: '',
	email: '',
	message: ''
});

const rules = {
	required: v => !!v || 'این فیلد الزامی است',
	email: v => /.+@.+\..+/.test(v) || 'ایمیل معتبر نیست'
};

async function submitForm() {
	const { valid } = await form.value.validate();
	if (!valid) return;

	loading.value = true;
	try {
		await new Promise(resolve => setTimeout(resolve, 1000));
		showSnackbar.value = true;
		form.value.reset();
	} catch (error) {
		console.error('Error submitting form:', error);
	} finally {
		loading.value = false;
	}
}
</script>

<style scoped>
.contact-page {
	min-height: 100vh;
	background-color: #f5f5f5;
}

.custom-fieldset {
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	padding: 2rem;
	position: relative;
	margin-top: 2rem;
	background-color: white;
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

.contact-btn {
	display: flex;
	justify-content: center;
	align-items: center;
	min-width: 180px;
}

@media (max-width: 600px) {
	.contact-btn {
		min-width: 140px;
	}
}
</style>