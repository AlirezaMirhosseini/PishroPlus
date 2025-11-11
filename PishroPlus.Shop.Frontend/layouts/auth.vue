<template>
	<div class="auth-page d-flex justify-center align-center" dir="rtl">
		<div class="auth-background"></div>
		<v-container>
			<v-row no-gutters class="auth-content">
				<v-col cols="12" md="6">
					<v-card class="mx-auto pa-8" style="border-radius: 0 20px 20px 0">
						<div class="d-flex align-center">
							<v-btn icon="mdi-arrow-right" variant="text" to="/" />
							<h1 class="font-weight-bold primary--text mr-4">فروشگاه</h1>
						</div>

						<v-tabs v-model="activeTab">
							<template v-if="!isForgetPasswordPage">
								<v-tab value="login" to="/login" class="font-weight-bold" style="font-size: 14pt">ورود</v-tab>
								<v-tab value="signup" to="/signup" class="font-weight-bold" style="font-size: 14pt">ثبت نام</v-tab>
							</template>
							<template v-else>
								<v-tab value="forget-password" class="font-weight-bold" style="font-size: 14pt; border-bottom: 2px solid black;">فراموشی رمز عبور</v-tab>
							</template>
						</v-tabs>
						<slot />
					</v-card>
				</v-col>

				<v-col cols="12" md="6" class="d-none d-md-block">
					<v-card height="610" elevation="0" style="border-radius: 20px 0 0 20px">
						<v-img
							src="https://img.freepik.com/free-photo/wooden-board-empty-table-blurred-background_1253-1560.jpg?t=st=1731918100~exp=1731921700~hmac=c7c09168ef5de379794a9f9228a2c68e0808864985e60ad4730cc20c22a0f9a1&w=900"
							cover
							height="100%"
							class="rounded-lg"
						>
							<div class="fill-height backdrop-blur-sm bg-black/30 pa-12">
								<div class="d-flex flex-column h-100 justify-center text-center">
									<h1 class="font-weight-bold mb-4 text-white">فروشگاه</h1>
									<h2 class="text-white">خرید آسان، سریع و مطمئن</h2>
								</div>
							</div>
						</v-img>
					</v-card>
				</v-col>
			</v-row>
		</v-container>
	</div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute();
const activeTab = ref('login');

const isForgetPasswordPage = computed(() => {
  return route.path.includes('forget-password');
});

onMounted(() => {
	const path = route.path
	if (path.includes('signup')) {
		activeTab.value = 'signup';
	} else {
		activeTab.value = 'login';
	}
})

</script>

<style scoped>
.auth-page {
	height: 100vh;
	position: relative;
	overflow: hidden;
}

.auth-background {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-image: url("https://img.freepik.com/free-vector/paper-style-white-monochrome-background_23-2149008681.jpg?t=st=1731921969~exp=1731925569~hmac=99ecc653c0d3e58f7b6b3b3c0f9a94f06de6baae95d13033b542329de199483f&w=996");
	background-size: cover;
	background-position: center;
	opacity: 1;
	z-index: 0;
}

.auth-content {
	position: relative;
	z-index: 1;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
}

.backdrop-blur-sm {
	backdrop-filter: blur(4px);
}
</style>