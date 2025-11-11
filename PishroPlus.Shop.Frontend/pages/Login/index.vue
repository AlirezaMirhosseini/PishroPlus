<template>
  <v-form
    ref="loginForm"
    v-model="loginValid"
    @submit.prevent="handleLogin"
    class="auth-form auth-form-login mt-2"
  >
    <v-text-field
      v-model="login.phoneNumber"
      label="شماره موبایل"
      :rules="[rules.required, rules.phoneNumber]"
      maxlength="11"
      variant="outlined"
    />

    <v-text-field
      v-model="login.password"
      label="رمز عبور"
      :rules="[rules.required]"
      variant="outlined"
      :type="showPassword ? 'text' : 'password'"
      :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="showPassword = !showPassword"
      style="margin-bottom: 245px"
    />

    <v-btn
      block
      color="primary"
      size="large"
      type="submit"
      :loading="loading"
    >
      ورود
    </v-btn>

    <!-- <div class="text-center mt-4">
      <v-btn 
        variant="text"
        color="primary"
        @click="navigateToForgetPassword"
      >
        رمز عبور را فراموش کرده‌اید؟
      </v-btn>
    </div> -->
  </v-form>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { defaultStore } from '~/store/defaultStore';

definePageMeta({
  layout: 'auth'
})

const router = useRouter();
const { $axios } = useNuxtApp();
const loginForm = ref(null);
const loginValid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const store = defaultStore();

const login = ref({
  phoneNumber: '',
  password: '',
})

const rules = {
  required: (v) => !!v || "این فیلد الزامی است",
  phoneNumber: (v) => /^09\d{9}$/.test(v) || "شماره موبایل معتبر نیست",
}

async function handleLogin() {
  const { valid } = await loginForm.value.validate()
  if (!valid) return

  loading.value = true;

  const requestBody = {
    phoneNumber: login.value.phoneNumber,
    password: login.value.password
  };
  
  const response = await $axios.post("/Shop/Users/Login", requestBody);
  if (response.data.isSuccess) {
    store.setUserToken(response.data.value);
    router.push("/");
  } else {
    showError.value = true;
  }
  loading.value = false;
}

// function navigateToForgetPassword() {
//   router.push('/forget-password')
// }

onMounted(() => {
  localStorage.removeItem('auth_token');
  localStorage.removeItem('userEntity');
});
</script>

<style scoped>
.auth-form {
  min-height: auto;
  display: flex;
  flex-direction: column;
}

.auth-form-login {
  min-height: 250px;
}

.auth-form .v-btn {
  margin-top: auto;
}
</style>