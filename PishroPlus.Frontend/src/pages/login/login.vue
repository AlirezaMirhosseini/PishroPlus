<template>
  <v-snackbar v-model="invalidCodeSnackbar" color="error">
    {{ $t('invalidCode') }}

    <template v-slot:actions>
      <v-btn variant="text" prepend-icon="mdi mdi-close" @click="invalidCodeSnackbar = false" />
    </template>
  </v-snackbar>
  <div class="d-flex flex-column pa-8 pa-sm-16 pt-sm-10" style="position: initial">
    <v-icon
      class="align-self-center"
      :icon="logo"
      color="primary"
      size="200"
      style="margin-block: -10px"
    />
    <v-form
      class="d-flex flex-column"
      v-if="!checkedUser"
      @submit.prevent="checkUser"
      ref="checkUserRef"
    >
      <h3 class="mt-6" style="font-size: 20px">{{ $t('login') }}</h3>
      <!-- <v-text-field
        name="phone-number"
        v-model="phoneNumber"
        :loading="loading"
        :disabled="loading"
        color="primary"
        autofocus
        class="mt-6"
        counter="11"
        maxLength="11"
        :rules="[
          (v) =>
            /(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/.test(
              v
            ) || $t('enterPhoneNumberCorrectFormat')
        ]"
        :flat="true"
        bg-color="#eeeeee"
        variant="solo"
        :clearable="true"
        :label="$t('phoneNumber')"
        type="tel"
      /> -->

      <v-text-field
        name="username"
        v-model="userName"
        :loading="loading"
        :disabled="loading"
        color="primary"
        autofocus
        class="mt-6"
        :rules="[
          (v) => {
            if (v) return true
            return $t('enterUserName')
          }
        ]"
        :flat="true"
        variant="outlined"
        :label="$t('userName')"
        dir="ltr"
      >
      </v-text-field>

      <v-text-field
        ref="passRef"
        name="password"
        v-model="password"
        :loading="loading"
        :disabled="loading"
        color="primary"
        class="mt-6"
        :rules="[(v) => (v ? true : $t('enterPassword'))]"
        :flat="true"
        variant="outlined"
        :label="$t('password')"
        :type="visible ? 'text' : 'password'"
        dir="ltr"
        @focus="showPasswordIcons = true"
        @blur="showPasswordIcons = false"
      >
        <template v-slot>
          <v-icon v-if="showPasswordIcons" @click="toggleVisibility">
            {{ visible ? 'mdi-eye-off' : 'mdi-eye' }}
          </v-icon>
        </template>
      </v-text-field>

      <v-btn
        class="mt-6"
        color="primary"
        variant="flat"
        prepend-icon="mdi mdi-login-variant"
        type="submit"
        aria-label="login"
        :disabled="loading"
      >
        {{ $t('login') }}
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="20"
          width="2"
          class="ms-4"
        ></v-progress-circular
      ></v-btn>
    </v-form>

    <v-form class="d-flex flex-column position-initial" v-if="checkedUser">
      <h3 class="mt-6">{{ $t('selectCompany') }}</h3>

      <v-select
        class="mt-4"
        variant="outlined"
        :items="companies"
        v-model="selectedCompany"
        item-title="name"
        item-value="code"
        :hint="`${$t('code')} ${selectedCompany}`"
        persistent-hint
        density="compact"
      >
      </v-select>

      <v-btn
        ref="loginButton"
        class="mt-6"
        color="primary"
        variant="flat"
        prepend-icon="mdi mdi-check"
        @click="login"
        aria-label="login"
        :disabled="loading"
      >
        {{ $t('login') }}
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="20"
          width="2"
          class="ms-4"
        ></v-progress-circular
      ></v-btn>

      <p class="edit-number text-grey" @click="() => (this.checkedUser = false)">
        {{ $t('return') }}
      </p>
    </v-form>
    <!-- <v-form
      class="d-flex flex-column align-center text-center"
      v-if="checkedPhone"
      @submit.prevent="checkUser"
      ref="checkUserRef"
    >
      <h3 class="mt-6">{{ $t('enterConfirmCode') }}</h3>

      <div class="d-flex mt-10 w-100" style="direction: ltr">
        <v-otp-input
          class="w-100 justify-space-between"
          :is-disabled="loading"
          ref="otpInput"
          v-model:value="confirmCode"
          input-classes="otp-input"
          separator=""
          :num-inputs="5"
          :should-auto-focus="true"
          input-type="tel"
          :placeholder="['*', '*', '*', '*', '*']"
          @on-complete="confirmComplete"
        />
      </div>

      <v-btn
        class="mt-6"
        color="primary"
        variant="flat"
        prepend-icon="mdi mdi-check"
        aria-label="check code"
        :disabled="loading || confirmCode.length != 5"
        @click="checkOtp"
        block
      >
        {{ $t('confirm') }}
        <v-progress-circular
          v-if="loading"
          indeterminate
          color="white"
          size="20"
          width="2"
          class="ms-4"
        ></v-progress-circular
      ></v-btn>
      <p
        class="mt-4"
        @click="resend"
        :style="`font-size: 13px; color: #717171;${
          timer === 0 ? 'cursor:pointer;' : 'pointer-events: none;'
        }`"
      >
        {{ $t('resend') + (timer != 0 ? '(' + timeFormatTimer + ')' : '') }}
      </p>
      <p class="edit-number" @click="() => (this.checkedPhone = false)">
        {{ $t('editPhoneNumber') }} ({{ phoneNumber }})
      </p>
    </v-form> -->
  </div>
</template>
<script>
import logo from '../../components/icons/ppLogo.vue'
import { mapState, mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import userService from '../../../api/user/userService'
import auth from '../../../plugins/auth'
import { markRaw } from 'vue'
export default {
  data() {
    return {
      phoneNumber: null,
      userName: null,
      password: null,
      nameAndNumber: '',
      permissions: [],
      loginAsWebAssistant: false,
      logo: markRaw(logo),
      checkedPhone: false,
      checkedUser: false,
      confirmCode: '',
      timer: 121,
      timeFormatTimer: '',
      invalidCodeSnackbar: false,
      resendInterval: null,
      companies: [],
      selectedCompany: null,
      visible: false,
      showPasswordIcons: false,
      showUsernameIcons: false
    }
  },
  computed: {
    ...mapState(defaultStore, {
      loading: 'loading',
      companyDetails: 'companyDetails'
    }),
    userNameAndNumber() {
      return this.$store.state.userNameAndNumber
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setCompanyDetails: 'setCompanyDetails',
      setUserData: 'setUserData'
    }),
    async checkUser() {
      const { valid } = await this.$refs.checkUserRef.validate()
      if (valid) {
        const res = await userService.checkUserName({
          userName: this.userName,
          password: this.password
        })

        if (!res.isSuccess) {
          this.setErrorMessage('Invalid credentials')
          return
        }

        if (!res.enterCompanyCode) {
          const company = res.companies[0]
          this.setCompanyDetails(
            company.companyName,
            company.companyCode,
            company.companyId,
            company.displayName
          )
          this.$router.push('/')
        } else {
          this.companies = res.companies
          if (this.companies?.length) {
            this.selectedCompany = this.companies[0].companyCode
          }
          this.checkedUser = true
          this.permissions = res.permissions

          setTimeout(() => {
            this.$refs.loginButton?.$el.focus()
          }, 100)
        }
      } else {
        this.$refs.passRef?.focus()
      }
    },

    async login() {
      try {
        const res = await userService.login({
          userName: this.userName,
          password: this.password
        })
        console.log(res)

        if (res.isSuccess) {
          const selectedCompanyProfile = this.companies.find(
            (company) => company.companyCode === this.selectedCompany
          )

          if (selectedCompanyProfile) {
            this.setCompanyDetails(
              selectedCompanyProfile.companyName,
              selectedCompanyProfile.companyCode,
              selectedCompanyProfile.companyId,
              selectedCompanyProfile.displayName
            )

            if (res.value.permissions) {
              this.setUserData({
                permissions: res.value.permissions,
                token: res.value.token
              })
            }

            this.$router.push('/')
          }
        } else {
          this.setErrorMessage(res.errors?.[0]?.message || 'Login failed')
        }
      } catch (error) {
        this.setErrorMessage(error.response?.data?.errors?.[0]?.message || 'Login failed')
      }
    },
    // async checkUser() {
    //   const { valid } = await this.$refs.checkUserRef.validate()
    //   if (valid) {
    //     await userService
    //       .checkUserName({ userName: this.userName, password: this.password })
    //       .then((resp) => {
    //         console.log(resp);
    //         if (!resp.isSuccess) this.setErrorMessage(resp.message)
    //         else if (!resp.enterCompanyCode) {
    //           let com = resp.companies[0]
    //           setCompanyDetails(com, com.code, com.id)
    //           this.$router.push('/')
    //         } else {
    //           this.companies = resp.companies
    //           if (this.companies) this.selectedCompany = this.companies[0].code
    //           this.checkedUser = true
    //           this.permissions = resp.permissions
    //           setTimeout(() => {
    //             this.$refs.loginButton.$el.focus()
    //           }, 100)
    //         }
    //       })
    //   } else this.$refs.passRef.focus()
    // },
    toggleVisibility() {
      this.visible = !this.visible
    }
    // async login() {
    //   await userService
    //     .login({
    //         userName: this.userName,
    //         password: this.password
    //     })
    //     .then((res) => {
    //       console.log(res);
    //       if (res.isSuccess) {
    //         this.setUserData({
    //           userName: res.entity.userName,
    //           firstName: res.entity.firstName,
    //           lastName: res.entity.lastName,
    //           phoneNumber: res.entity.phoneNumber,
    //           permissions: res.permissions,
    //           id: res.entity.id
    //         })
    //         let com = this.companies.filter((a) => a.code === this.selectedCompany)[0]
    //         this.setCompanyDetails(com.name, com.code, com.id)
    //         this.$router.push('/')
    //       }
    //     })
    // }
    // async confirmComplete(_) {
    //   await this.checkOtp()
    // },

    // async checkOtp() {
    //   this.loading = true
    //   // Call Api

    //   setTimeout(() => {
    //     this.loading = false
    //     if (this.confirmCode === '12345') {
    //       this.$router.push('/')
    //     } else {
    //       this.invalidCodeSnackbar = true
    //       this.confirmCode = ''
    //     }
    //   }, 1000)
    // },

    // resend() {
    //   this.timer = 121
    //   // Call Api

    //   clearInterval(this.resendInterval)
    //   this.resendInterval = setInterval(this.setTimer, 1000)
    // },

    // setTimer() {
    //   if (this.timer > 0) {
    //     this.timer--
    //     var date = new Date(0)
    //     date.setSeconds(this.timer)
    //     this.timeFormatTimer = date.toISOString().substring(14, 19)
    //   } else return
    // }
  }
}
</script>

<style>
.v-theme--dark .logo-img {
  filter: hue-rotate(325deg);
}

.v-theme--light .logo-img {
  filter: none;
}

.edit-number {
  position: absolute;
  bottom: 10px;
  right: 50%;
  transform: translateX(50%);
  font-size: 13px;
  cursor: pointer;
}

.position-initial {
  position: initial;
}

.otp-input {
  width: 50px;
  height: 50px;
  padding: 5px;
  font-size: 20px;
  border-radius: 5px;
  border: none;
  text-align: center;
  background-color: #eeeeee;
}

/* Background colour of an input field with value */
.otp-input.is-complete {
  background-color: #e4e4e4;
}

.otp-input::-webkit-inner-spin-button,
.otp-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.otp-input input::placeholder {
  font-size: 15px;
  text-align: center;
  font-weight: 600;
}
</style>
