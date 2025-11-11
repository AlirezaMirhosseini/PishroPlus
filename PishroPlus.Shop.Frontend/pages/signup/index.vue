<template>
  <v-form
    ref="signupForm"
    v-model="signupValid"
    @submit.prevent="handleSignup"
    class="auth-form mt-2"
  >
    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="signup.firstName"
          label="نام"
          :rules="[rules.required]"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="signup.lastName"
          label="نام خانوادگی"
          :rules="[rules.required]"
          variant="outlined"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="signup.phoneNumber"
          label="شماره موبایل"
          :rules="[rules.required, rules.phoneNumber]"
          maxlength="11"
          variant="outlined"
          hide-details
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="signup.nationalId"
          label="کد ملی"
          :rules="[rules.nationalId]"
          maxlength="10"
          variant="outlined"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="signup.password"
          label="رمز عبور"
          :rules="[rules.required, rules.password]"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showPassword = !showPassword"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-text-field
          v-model="signup.confirmPassword"
          label="تکرار رمز عبور"
          :rules="[rules.required, rules.confirmPassword]"
          variant="outlined"
          :type="showPassword ? 'text' : 'password'"
          hide-details
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12" sm="6">
        <v-select
          v-model="signup.userType"
          :items="userTypes"
          label="نوع کاربر"
          :rules="[rules.required]"
          variant="outlined"
          hide-details
          @update:model-value="handleUserTypeChange"
        />
      </v-col>
      <v-col cols="12" sm="6">
        <v-text-field
          label="نوع سهامدار"
          variant="outlined"
          hide-details
          :rules="[rules.stakeholderType]"
          append-inner-icon="mdi mdi-open-in-new"
          v-model="signup.stakeholderType"
          @click:append-inner="showStakeholderTypeDialog"
          :disabled="!isStakeholderTypeSelected"
        />
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-btn
          block
          color="primary"
          size="large"
          type="submit"
          :loading="loading"
        >
          ثبت نام
        </v-btn>
      </v-col>
    </v-row>

    <v-dialog
      persistent
      v-model="selectStakeholderType"
      width="600px"
      max-width="100%"
    >
      <v-card>
        <v-row
          class="align-center px-2 dialog-topbar"
          no-gutters
          style="z-index: 2"
        >
          <v-icon class="me-2" size="40" color="info">mdi-family-tree</v-icon>
          <p style="font-weight: bold">انتخاب نوع مشتری</p>
          <div class="ms-auto">
            <v-btn
              color="grey"
              icon="mdi mdi-close"
              @click="selectStakeholderType = false"
              variant="text"
            />
          </div>
        </v-row>
        <v-card-text class="px-1">
          <v-text-field
            class="mb-4"
            hide-details
            variant="outlined"
            name="search"
            autofocus
            density="compact"
            label="جستجو"
            append-inner-icon="mdi mdi-magnify"
            v-model="searchStakeholderTypeText"
            @update:model-value="handleSearch"
          />
          <fieldset class="px-4">
            <legend class="mx-auto px-2 text-grey">نوع مشتری</legend>
            <treeview
              v-model="treeView.treeViewData.model"
              @active-changed="handleNodeSelection"
              :hasEnter="selectStakeholderType"
              @enterMethod="saveStakeholderType"
            />
          </fieldset>
        </v-card-text>
        <v-card-actions class="justify-end dialog-bottombar">
          <v-btn
            @click="saveStakeholderType"
            prepend-icon="mdi-content-save"
            variant="flat"
            color="info"
          >
            انتخاب
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-snackbar
        v-model="showError"
        color="error"
        timeout="3000"
        location="top"
      >
        {{ errorMessage }}
      </v-snackbar>
    </v-dialog>
  </v-form>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTreeView } from "~/composables/useTreeView";
import { useDebounce } from "~/composables/useDebounce";

definePageMeta({
  layout: "auth",
});

const { $axios } = useNuxtApp();
const router = useRouter();
const treeView = useTreeView();

const signupForm = ref(null);
const signupValid = ref(false);
const loading = ref(false);
const showPassword = ref(false);
const selectStakeholderType = ref(false);
const searchStakeholderTypeText = ref("");
const selectedNode = ref(null);
const showError = ref(false);
const errorMessage = ref("");

const signup = ref({
  firstName: "",
  lastName: "",
  phoneNumber: "",
  nationalId: "",
  password: "",
  confirmPassword: "",
  userType: "",
  stakeholderType: "",
});

const userTypes = ["عادی", "سهامدار"];

const isStakeholderTypeSelected = computed(
  () => signup.value.userType === "سهامدار"
);

const fetchStockHoldersData = async () => {
  const response = await $axios.get("/Shop/Accounts/StockHolderNodeAccounts");
  console.log(response);
  if (response.data.isSuccess) {
    treeView.updateTreeData(response.data.value);
  } else {
    errorMessage.value = "خطا در دریافت اطلاعات";
    showError.value = true;
  }
};

onMounted(() => {
  fetchStockHoldersData();
  localStorage.removeItem('auth_token');
  localStorage.removeItem('userEntity');
});

const handleSearch = useDebounce((value) => {
  treeView.searchInTree(value);
}, 300);

const handleUserTypeChange = (value) => {
  if (value === "سهامدار") {
    const singleLeafNode = treeView.findSingleLeafNode(treeView.treeViewData.model);
    if (singleLeafNode) {
      signup.value.stakeholderType = singleLeafNode.title;
      treeView.selectNode(singleLeafNode);
      selectedNode.value = singleLeafNode;
      treeView.treeViewData.active = [singleLeafNode];
      console.log('Selected Node:', selectedNode.value);
    }
  } else {
    signup.value.stakeholderType = "";
    treeView.treeViewData.active = [];
    selectedNode.value = null;
  }
};

const rules = {
  required: (v) => !!v || "این فیلد الزامی است",
  phoneNumber: (v) => /^09\d{9}$/.test(v) || "شماره موبایل معتبر نیست",
  nationalId: (v) => {
    if (signup.value.userType === "سهامدار" && !v) {
      return "برای کاربران سهامدار، کد ملی اجباری است";
    }
    if (v && !/^\d{10}$/.test(v)) {
      return "کد ملی معتبر نیست";
    }
    return true;
  },
  password: (v) => v.length >= 8 || "رمز عبور باید حداقل ۸ کاراکتر باشد",
  confirmPassword: (v) =>
    v === signup.value.password || "رمز عبور مطابقت ندارد",
  stakeholderType: (v) => {
    if (signup.value.userType === "سهامدار" && !v) {
      return "برای کاربران سهامدار، نوع سهامداری اجباری است";
    }
    return true;
  },
};

function showStakeholderTypeDialog() {
  selectStakeholderType.value = true;
}

function handleNodeSelection(node) {
  treeView.selectNode(node);
}

function saveStakeholderType() {
  if (
    !treeView.treeViewData.active ||
    treeView.treeViewData.active.length === 0
  ) {
    errorMessage.value = "لطفاً یک نوع سهامدار را انتخاب کنید";
    showError.value = true;
    return;
  }

  selectedNode.value = treeView.treeViewData.active[0];
  if (!treeView.isLeafNode(selectedNode.value)) {
    errorMessage.value = "لطفاً یکی از گزینه‌های نهایی را انتخاب کنید";
    showError.value = true;
    return;
  }

  signup.value.stakeholderType = selectedNode.value.title;
  selectStakeholderType.value = false;
}

async function handleSignup() {
  const { valid } = await signupForm.value.validate();
  if (!valid) return;

  loading.value = true;
  const requestBody = {
    nationalCode: signup.value.nationalId || null,
    firstName: signup.value.firstName,
    lastName: signup.value.lastName,
    password: signup.value.password,
    phoneNumber: signup.value.phoneNumber,
    stockHolderAccountId: signup.value.userType === "سهامدار" 
      ? selectedNode.value.id
      : null,
  };

  const response = await $axios.post("/Shop/Users/Register", requestBody);
  if (response.data.isSuccess) {
    console.log(response);
    console.log("ثبت نام موفقیت‌آمیز بود");
    router.push("/login");
  } else {
    errorMessage.value = "خطا در ثبت نام. لطفاً مجدداً تلاش کنید.";
    showError.value = true;
  }
  loading.value = false;
}
</script>