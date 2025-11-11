<template>
  <v-card>
  <v-row class="pa-4">
    <v-col class="px-5" cols="12" md="6">
      <p class="text-grey">{{ $t('identityInformation') }}</p>
      <v-row class="pishro-border pa-2 mt-2">
        <v-col cols="12">
          <div class="image-container mx-auto" @click="companyImage ? null : attachImage()"
            :style="[companyImage ? 'opacity:1' : 'opacity:0.7', 'width:100px;height:100px']">
            <input type="file" accept=".jpg,.jpeg,.png" ref="image" style="display: none" @change="uploadImage" />
            <div @click.stop="companyImage = null" v-if="companyImage" class="delete-pic">
              <v-icon icon="mdi mdi-window-close" color="error" />
            </div>
            <v-img width="100" aspect-ratio="1/1" cover :src="companyImage ? companyImage : companyImgSrc"
              style="border-radius: 50%"></v-img>
          </div>
        </v-col>
        <v-col cols="12">
          <v-text-field name="complexName" readonly v-model="complexName" variant="outlined" hide-details
            density="compact" :label="$t('complexName')" />
        </v-col>
        <v-col cols="12">
          <!-- <fieldset class="pishro-border">
            <legend class="mx-auto px-2 text-grey pishro-caption">
              {{ $t('ownerDetails') }}
            </legend>
            <v-row no-gutters class="px-1">
              <v-col cols="12" md="6">
                <v-text-field name="firstName" v-model="firstName" variant="outlined" hide-details density="compact"
                  :label="$t('name')" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field name="lastName" v-model="lastName" variant="outlined" hide-details density="compact"
                  :label="$t('lastName')" />
              </v-col>

              <v-col cols="12" md="6">
                <v-text-field name="nationalCode" v-model="nationalCode" variant="outlined" hide-details density="compact"
                  :label="$t('nationalCode')" />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field name="phoneNumber" v-model="phoneNumber" variant="outlined" hide-details density="compact"
                  :label="$t('phoneNumber')" />
              </v-col>
              <v-col cols="12" md="6">
                <v-radio-group hide-details density="compact" :label="$t('gender')" v-model="gender" color="info" inline>
                  <v-radio :label="$t('male')" :value="0"></v-radio>
                  <v-radio :label="$t('female')" :value="1"></v-radio>
                </v-radio-group>
              </v-col>
            </v-row>
          </fieldset> -->
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field name="nationalId" v-model="nationalId" variant="outlined" hide-details density="compact"
            :label="$t('nationalId')" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field name="registerNumber" v-model="registerNumber" variant="outlined" hide-details density="compact"
            :label="$t('registerNumber')" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field name="economicId" v-model="economicId" variant="outlined" hide-details density="compact"
            :label="$t('economicId')" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field name="postalCode" v-model="postalCode" variant="outlined" hide-details density="compact"
            :label="$t('postalCode')" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field name="phoneNumber1" v-model="phoneNumber1" variant="outlined" hide-details density="compact"
            :label="$t('telephoneNumber')" />
        </v-col>
        <v-col cols="12" md="6">
          <v-text-field name="phoneNumber2" v-model="phoneNumber2" variant="outlined" hide-details density="compact"
            :label="$t('telephoneNumber') + '2'" />
        </v-col>
        <!-- <v-col cols="12">
          <p class="text-grey">{{ $t('signatureImage') }}</p>
          <div class="image-container mx-auto" @click="signatureImage ? null : attachSigImage()" :style="[
            signatureImage ? 'opacity:1' : 'opacity:0.7',
            'width:200px;height:100px;border-radius:10px'
          ]">
            <input type="file" accept=".jpg,.jpeg,.png" ref="sigImage" style="display: none" @change="uploadSigImage" />
            <div @click.stop="signatureImage = null" v-if="signatureImage" class="delete-pic" style="border-radius: 10px">
              <v-icon icon="mdi mdi-window-close" color="error" />
            </div>
            <v-img width="200" aspect-ratio="2/1" cover :src="signatureImage ? signatureImage : signatureImgSrc"
              style="border-radius: 10px"></v-img>
          </div>
        </v-col> -->
        <v-col cols="12">
          <v-textarea name="address" :label="$t('address')" hide-details density="compact" v-model="address"
            variant="outlined" />
        </v-col>
      </v-row>
      <v-row class="pishro-border pa-2 mt-7">
        <v-col cols="6" v-for="shortcut in shortcuts " :key="shortcut.title">
          <v-text-field :label="$t(shortcut.title)" name="complexName" readonly v-model="shortcut.shortcut"
            @keydown="(ev) => handleKeyDown(ev, shortcut.title)" variant="outlined" hide-details density="compact" />
        </v-col>
      </v-row>
    </v-col>
    <v-col class="px-5" cols="12" md="6">
      <!-- <p class="text-grey">{{ $t('scaleSetting') }}</p> -->
      <!-- <v-row class="pishro-border pa-2 mt-2">
        <v-col class="d-flex" cols="12">
          <v-text-field name="scaleName" v-model="scaleName" :label="$t('scaleName')" density="compact" hide-details
            variant="outlined" />
          <v-text-field name="comPort" v-model="comPort" :label="$t('comPort')" density="compact" hide-details
            variant="outlined" style="max-width: 100px; margin-inline-start: 8px" />
        </v-col>
      </v-row> -->
      <!-- <p class="text-grey mt-6">{{ $t('posSetting') }}</p>
      <v-row class="pishro-border pa-2 mt-2"> </v-row> -->
      <p class="text-grey mt-6">{{ $t('movaddiyanSetting') }}</p>
      <v-row class="pishro-border pa-2 mt-2">
        <v-col cols="12">
          <v-text-field name="movaddiyanPrivateKey" v-model="movaddiyanPrivateKey" :label="$t('privateKey')"
            density="compact" hide-details variant="outlined" />
        </v-col>
        <v-col class="d-flex flex-wrap align-center" cols="12" style="gap: 8px">
          <v-text-field name="movaddiyanUniqueId" v-model="movaddiyanUniqueId" :label="$t('taxMemoryUniqueId')"
            density="compact" hide-details variant="outlined" style="min-width: 200px" />
          <v-text-field name="movaddiyanPassword" v-model="movaddiyanPassword" :label="$t('password')" density="compact"
            hide-details variant="outlined" style="min-width: 200px" />
          <v-text-field name="movaddiyanLastSerial" v-model="movaddiyanLastSerial" :label="$t('lastExportedSerial')"
            density="compact" hide-details variant="outlined" style="min-width: 200px" />
          <v-btn :disabled="true" variant="flat" color="primary" prepend-icon="mdi mdi-check">{{
            $t('send')
          }}</v-btn>
        </v-col>
      </v-row>
      <!-- <p class="text-grey mt-6">{{ $t('telegramConnectionSetting') }}</p>
      <v-row class="pishro-border pa-2 mt-2">
        <v-col class="d-flex flex-wrap align-center" cols="12" style="gap: 8px">
          <v-text-field name="phoneNumber" v-model="mobileNumber" :label="$t('phoneNumber')" density="compact"
            hide-details variant="outlined" style="min-width: 200px" />
          <v-btn :disabled="true" variant="flat" color="primary" prepend-icon="mdi mdi-check">{{
            $t('send')
          }}</v-btn>
        </v-col>
      </v-row> -->
      <!-- <p class="text-grey mt-6">{{ $t('commerceSystemConnectionSetting') }}</p>
      <v-row class="pishro-border pa-2 mt-2">
        <v-col class="d-flex flex-wrap align-center" cols="12" style="gap: 8px">
          <v-text-field name="commerceUsername" v-model="commerceSystemUserName" :label="$t('userName')" density="compact"
            hide-details variant="outlined" style="min-width: 100px" />
          <v-text-field name="commercePassword" v-model="commerceSystemPassword" :label="$t('password')" density="compact"
            hide-details variant="outlined" style="min-width: 100px" />
          <v-btn :disabled="true" variant="flat" color="primary" prepend-icon="mdi mdi-check">{{
            $t('send')
          }}</v-btn>
        </v-col>
      </v-row> -->
      <v-row class="float-left">
        <v-btn @click="saveData" :prepend-icon="saveIcon" color="info" class="ma-1 ">{{
          $t('save')
        }}</v-btn>
      </v-row>

    </v-col>

    


  </v-row>
</v-card>
</template>

<script>
import imgResize2 from '../../../plugins/imgResize2'
import companyImgSrc from '../../assets/images/companyImg.png'
import signatureImgSrc from '../../assets/images/signature.jpg'
import SaveIcon from '../../components/icons/Save.vue'
import { markRaw } from 'vue'
import companyService from '../../../api/company/companyService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import settingService from '../../../api/setting/settingService'
import utils from '../../../plugins/utils'

export default {
  data() {
    return {
      saveIcon: markRaw(SaveIcon),
      companyInfo: JSON.parse(localStorage.getItem('com')),
      companyImgSrc: companyImgSrc,
      signatureImgSrc: signatureImgSrc,
      id: null,
      companyImage: null,
      complexName: null,
      firstName: null,
      lastName: null,
      gender: null,
      nationalCode: null,
      phoneNumber: null,
      nationalId: null,
      registerNumber: null,
      economicId: null,
      postalCode: null,
      phoneNumber1: null,
      phoneNumber2: null,
      signatureImage: null,
      address: null,
      scaleName: null,
      comPort: null,
      posSetting: null,
      movaddiyanPrivateKey: null,
      movaddiyanUniqueId: null,
      movaddiyanPassword: null,
      movaddiyanLastSerial: null,
      mobileNumber: null,
      commerceSystemUserName: null,
      commerceSystemPassword: null
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning'
    }),
    async handleKeyDown(event, title) {
      event.preventDefault()
      const modifiers = []
      if (event.ctrlKey)
        modifiers.push('ctrl')
      if (event.shiftKey)
        modifiers.push('Shift')
      if (event.altKey)
        modifiers.push('Alt')

      let m = this.shortcuts.filter((x) => x.title == title)[0].shortcut = modifiers.length > 0 ? `${modifiers.join('+')} + ${event.key}` : event.key


      var commonShortcuts
      await fetch('../../../commonShortcuts.json')
        .then((res) => res.json())
        .then((res) => {
          commonShortcuts = res.commonShortcuts
        })


      for (let x of commonShortcuts) {
        if (m == x) {
          this.setErrorMessage(this.$t('confirmSetShortcut'))
          this.shortcuts.filter((x) => x.title == title)[0].shortcut=null
        }

      }



    },
    attachImage() {
      this.$refs.image.click()
    },
    async uploadImage(value) {
      let file = value.target.files[0]
      let img = await imgResize2(file)
      this.companyImage = img
    },
    attachSigImage() {
      this.$refs.sigImage.click()
    },
    async uploadSigImage(value) {
      let file = value.target.files[0]
      let img = await imgResize2(file, 200, 100)
      this.signatureImage = img
    },
    async getDate() {
      let res = await companyService.getById(this.companyInfo.i)
      if (res.isSuccess) {
        this.id = res.entity.id
        //  code
        this.complexName = res.entity.name
        this.nationalId = res.entity.nationalId
        this.registerNumber = res.entity.registrationNumber
        this.phoneNumber1 = res.entity.phoneNumber
        this.phoneNumber2 = res.entity.phoneNumber2
        this.postalCode = res.entity.postalCode
        this.economicId = res.entity.licenceNumber
        this.address = res.entity.address

      } else {
        this.setErrorMessage(res.message)
        if (res.errors?.length > 0) {
          var errorMessage = ''
          res.errors.forEach((error) => {
            errorMessage += error + '\n'
          })
          this.setErrorMessage(errorMessage.slice(0, -1))
        }
      }
    },
    async saveData() {

      let request = {
        entity: {
          id: this.id,
          registrationNumber: this.registerNumber,
          licenceNumber: this.economicId,
          nationalId: this.nationalId,
          phoneNumber: this.phoneNumber1,
          phoneNumber2: this.phoneNumber2,
          postalCode: this.postalCode,
          address: this.address

        }
      }

      await companyService.update(request).then((res) => {
        if (res.isSuccess) {
          this.setErrorMessage(this.$t('settingSuccessfullyUpdated'), 'success')
        } else {
          this.setErrorMessage(res.message, 'error')
        }
      })



      let shortcutsRequest = {
        entity: {
          shortcuts: utils.customStringify(this.shortcuts)
        }
      }

      await settingService.setDashboardSetting(shortcutsRequest).then((res) => {
        if (res.isSuccess) {
        } else this.setErrorMessage(this.res.message)
      })

      window.location.reload();
      // this.$forceUpdate();
    },
  },
  async mounted() {
    // await this.getDate()
    // settingService.getDashboardSetting().then((res) => {
    //   if (res.isSuccess) {
    //     var sList = JSON.parse(res.entity.shortcuts)
    //     sList.forEach((item, index) => {
    //       let i = this.shortcuts.findIndex(x => x.title === item.title)
    //       if (this.shortcuts[i]) {
    //         this.shortcuts[i].shortcut = item.shortcut
    //       }
    //     });
    //   } else this.setErrorMessage(this.res.message)
    // })
  }
}
</script>

<style></style>
