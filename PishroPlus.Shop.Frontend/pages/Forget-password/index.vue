<template>
	<v-form
		ref="forgetPasswordForm"
		v-model="formValid"
		@submit.prevent="handleForgetPassword"
		class="auth-form auth-form-forget mt-2"
	>
		<v-text-field
			v-model="mobile"
			label="شماره موبایل"
			:rules="[rules.required, rules.mobile]"
      maxlength="11"
			variant="outlined"
		/>

		<template v-if="showVerificationStep">
			<v-text-field
				v-model="verificationCode"
				label="کد تأیید"
				:rules="[rules.required, rules.code]"
      	maxlength="5"
				variant="outlined"
			/>
		</template>

		<template v-if="showVerificationStep">
			<v-text-field
				v-model="newPassword"
				label="رمز عبور جدید"
				:rules="[rules.required, rules.password]"
				variant="outlined"
				:type="showNewPassword ? 'text' : 'password'"
				:append-inner-icon="showNewPassword ? 'mdi-eye-off' : 'mdi-eye'"
				@click:append-inner="showNewPassword = !showNewPassword"
			/>

			<v-text-field
				v-model="confirmPassword"
				label="تکرار رمز عبور"
				:rules="[rules.required, rules.passwordMatch]"
				variant="outlined"
				:type="showConfirmPassword ? 'text' : 'password'"
				:append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
				@click:append-inner="showConfirmPassword = !showConfirmPassword"
			/>
		</template>

    <v-btn
      block
      color="primary"
      size="large"
      type="submit"
      :loading="loading"
      :style="{ marginTop: dynamicMarginTop }"
    >
      {{ buttonText }}
    </v-btn>

		<div class="text-center mt-4">
			<v-btn
				variant="text"
				color="primary"
				@click="navigateToLogin"
			>
				بازگشت به صفحه ورود
			</v-btn>
		</div>
	</v-form>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
	layout: 'auth'
})

const router = useRouter()

const forgetPasswordForm = ref(null)
const formValid = ref(false)
const loading = ref(false)

const mobile = ref('')
const verificationCode = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showVerificationStep = ref(false)
// const showPasswordResetStep = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const buttonText = computed(() => {
	if (!showVerificationStep.value) return 'ارسال کد تأیید'
	return 'تغییر رمز عبور'
})

const rules = {
	required: (v) => !!v || 'این فیلد الزامی است',
	mobile: (v) => /^09\d{9}$/.test(v) || 'شماره موبایل معتبر نیست',
	code: (v) => /^\d{5}$/.test(v) || 'کد تأیید باید 5 رقم باشد',
	password: (v) => v.length >= 8 || 'رمز عبور باید حداقل 8 کاراکتر باشد',
	passwordMatch: () => newPassword.value === confirmPassword.value || 'رمزهای عبور مطابقت ندارند'
}

const dynamicMarginTop = computed(() => {
  if (showVerificationStep.value) return '30px'
  return '270px'
})

async function handleForgetPassword() {
	const { valid } = await forgetPasswordForm.value.validate()
	if (!valid) return

	loading.value = true

	try {
		if (!showVerificationStep.value) {
			await sendVerificationCode()
		} else {
			await verifyCode()
			// await resetPassword()
		}
	} catch (error) {
		console.error('Error:', error)
	} finally {
		loading.value = false
	}
}

async function sendVerificationCode() {
	console.log(`Sending verification code to ${mobile.value}`)
	showVerificationStep.value = true
}

async function verifyCode() {
	console.log(`Verifying code ${verificationCode.value}`)
}

async function resetPassword() {
	// Simulated password reset
	console.log('Resetting password')
	router.push('/login')
}

function navigateToLogin() {
	router.push('/login')
}
</script>

<style scoped>
.auth-form {
	min-height: auto;
	display: flex;
	flex-direction: column;
}

.auth-form-forget {
	min-height: 250px;
}

.auth-form .v-btn {
	margin-top: auto;
}
</style>