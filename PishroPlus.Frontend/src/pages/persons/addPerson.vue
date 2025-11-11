<template>
  <v-card>
    <v-card-text>
      <v-row no-gutters class="flex-column-reverse flex-md-row">
        <v-col class="flex-grow-1 pa-0 account-info-container">
          <v-form
            @submit.prevent="save"
            ref="personForm"
            @input="
              () => {
                if (!hasChange) hasChange = true
              }
            "
          >
            <!-- <fieldset class="w-100 pishro-border">
              <legend class="mx-auto px-2 text-grey">{{ $t('accountDetails') }}</legend>
              <v-row class="align-center justify-space-between" no-gutters style="row-gap: 10px">
                <div class="image-container ml-8" @click="accountInfo.image ? null : attachImage()"
                  :style="accountInfo.image ? 'opacity:1' : 'opacity:0.7'">
                  <input type="file" accept=".jpg,.jpeg,.png" ref="image" style="display: none" @change="uploadImage" />
                  <div @click.stop="accountInfo.image = null" v-if="accountInfo.image" class="delete-pic">
                    <v-icon icon="mdi mdi-window-close" color="error" />
                  </div>
                  <v-img width="100" aspect-ratio="1/1" cover :src="`data:image/jpeg;base64,${accountInfo.image
                    ? accountInfo.image
                    : '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'
                    }`" style="border-radius: 50%"></v-img>
                </div>
                <switch-button v-if="!isEdit" class="mb-5 ms-2 " v-model:checked="isAutomatePersonCode"
                  :label="isAutomatePersonCode ? $t('automaticCode') : $t('manualCode')" />
                <v-text-field :disabled="isAutomatePersonCode" name="code" v-model="accountInfo.code" :rules="[
                  (v) => {
                    if (v || isAutomatePersonCode) return true
                    return $t('enterRequiredField')
                  }
                ]" class="ms-2 ml-2" variant="outlined" :label="$t('accountingCode')" density="compact"
                  style="min-width: 150px; max-width: 150px" />
                <v-text-field placeholder='اجباری' name="name" v-model="accountInfo.title" :rules="[
                  (v) => {
                    if (v) return true
                    return $t('')
                  }
                ]" class="ms-2 mr-2" variant="outlined" :label="`*${$t('title')}`" density="compact"
                  style="max-width: 250px">
                </v-text-field>
                <v-text-field readonly class="ms-2" v-model="accountInfo.parentName" :rules="[
                  (v) => {
                    if (v) return true
                    return $t('enterRequiredField')
                  }
                ]" variant="outlined" @focus="() => (showGroupDialog = true)" density="compact" :label="$t('category')"
                  style="min-width: 300px" />
                <group-select :selected="accountInfo.parentId" @save="saveSelectParent" v-model:show="showGroupDialog"
                  :family="0" :onlyParents="true" />
                <v-text-field name="desc" v-model="accountInfo.desc" class="ms-2" variant="outlined" :label="$t('desc')"
                  density="compact" />
              </v-row>
            </fieldset> -->
            <v-row class="pishro-border mt-4 flex-column" no-gutters>
              <v-col cols="6" md="6">
                <v-tabs class="w-100" v-model="tab" color="primary" align-tabs="start">
                  <v-tab :value="0"
                    ><v-icon
                      class="me-2"
                      :icon="generalInfoIcon"
                      size="35"
                      :color="tab == 0 ? 'primary' : 'grey'"
                    />
                    <p
                      :class="tab == 0 ? 'text-primary' : 'text-grey'"
                      :style="`font-weight:${tab == 0 ? 'bold' : 'unset'}`"
                    >
                      {{ $t('generalInfo') }}
                    </p>
                  </v-tab>
                  <!-- <v-tab :value="1"
                  ><v-icon
                    class="me-2"
                    :icon="contactInfoIcon"
                    size="35"
                    :color="tab == 1 ? 'primary' : 'grey'"
                  />
                  <p
                    :class="tab == 1 ? 'text-primary' : 'text-grey'"
                    :style="`font-weight:${tab == 1 ? 'bold' : 'unset'}`"
                  >
                    {{ $t('contactInfo') }}
                  </p></v-tab
                > -->
                  <!-- <v-tab :value="2"
                  ><v-icon
                    class="me-2"
                    :icon="addressInfoIcon"
                    size="35"
                    :color="tab == 2 ? 'primary' : 'grey'"
                  />
                  <p
                    :class="tab == 2 ? 'text-primary' : 'text-grey'"
                    :style="`font-weight:${tab == 2 ? 'bold' : 'unset'}`"
                  >
                    {{ $t('addressInfo') }}
                  </p></v-tab -->

                  <!-- <v-tab :value="3"
                  ><v-icon
                    class="me-2"
                    :icon="financialInfoIcon"
                    size="35"
                    :color="tab == 3 ? 'primary' : 'grey'"
                  />
                  <p
                    :class="tab == 3 ? 'text-primary' : 'text-grey'"
                    :style="`font-weight:${tab == 3 ? 'bold' : 'unset'}`"
                  >
                    {{ $t('financialInfo') }}
                  </p></v-tab
                > -->
                  <!-- <v-tab :value="4"
                  ><v-icon
                    :icon="salesAndPurchaseInfoIcon"
                    class="me-2"
                    size="35"
                    :color="tab == 4 ? 'primary' : 'grey'"
                  />
                  <p
                    :class="tab == 4 ? 'text-primary' : 'text-grey'"
                    :style="`font-weight:${tab == 4 ? 'bold' : 'unset'}`"
                  >
                    {{ $t('salesAndPurchaseInfo') }}
                  </p></v-tab
                > -->
                </v-tabs>
              </v-col>
              <div class="d-flex justify-center align-center mt-2 mr-2">
                <v-row class="" no-gutters style="row-gap: 10px">
                  <div
                    class="image-container ml-8 mb-7"
                    @click="accountInfo.image ? null : attachImage()"
                    :style="accountInfo.image ? 'opacity:1' : 'opacity:0.7'"
                  >
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      ref="image"
                      style="display: none"
                      @change="uploadImage"
                    />
                    <div
                      @click.stop="accountInfo.image = null"
                      v-if="accountInfo.image"
                      class="delete-pic"
                    >
                      <v-icon icon="mdi mdi-window-close" color="error" />
                    </div>
                    <v-img
                      width="100"
                      aspect-ratio="1/1"
                      cover
                      :src="`data:image/jpeg;base64,${
                        accountInfo.image
                          ? accountInfo.image
                          : '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'
                      }`"
                      style="border-radius: 50%"
                    ></v-img>
                  </div>
                  <div class="flex-grow-1">
                    <v-row no-gutters justify="center">
                      <v-radio-group
                        v-model="extraAttributes.personType"
                        color="info"
                        inline
                        hide-details
                        class="d-flex justify-center"
                      >
                        <v-radio :label="$t('real')" value="0"></v-radio>
                        <v-radio :label="$t('legal')" value="1"></v-radio>
                      </v-radio-group>
                    </v-row>
                    <div class="d-flex">
                      <switch-button
                        v-if="!isEdit"
                        class="ms-2 mt-10"
                        v-model:checked="isAutomatePersonCode"
                        :label="isAutomatePersonCode ? $t('automaticCode') : $t('manualCode')"
                      />
                      <v-text-field
                        :disabled="isAutomatePersonCode"
                        name="code"
                        v-model="accountInfo.code"
                        :rules="[
                          (v) => {
                            if (v || isAutomatePersonCode) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        class="ms-2 ml-2 mt-10"
                        variant="outlined"
                        :label="$t('accountingCode')"
                        density="compact"
                        style="min-width: 150px; max-width: 150px"
                      />
                      <v-text-field
                        readonly
                        class="ms-2 ml-2 mt-10"
                        v-model="accountInfo.parentName"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        variant="outlined"
                        @focus="() => (showGroupDialog = true)"
                        density="compact"
                        :label="$t('category')"
                        style="min-width: 300px; max-width: 300px"
                      />
                      <group-select
                        :selected="accountInfo.parentId"
                        @save="saveSelectParent"
                        v-model:show="showGroupDialog"
                        :family="0"
                        :onlyParents="true"
                      />
                    </div>
                  </div>
                </v-row>
              </div>
              <v-window :touch="false" v-model="tab">
                <v-window-item :value="0">
                  <v-row class="align-start pa-2 pt-5" no-gutters>
                    <!-- <div class="d-md-flex justify-space-between"> -->
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <fieldset class="w-100 pishro-border pa-0 mt-n5">
                        <legend class="mx-auto px-2 text-grey">{{ $t('gender') }}</legend>
                        <v-radio-group
                          v-model="extraAttributes.gender"
                          color="info"
                          inline
                          hide-details
                        >
                          <v-radio :label="$t('male')" value="0"></v-radio>
                          <v-radio :label="$t('female')" value="1"></v-radio>
                        </v-radio-group>
                      </fieldset>
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-text-field
                        name="firstname"
                        v-model="extraAttributes.firstName"
                        variant="outlined"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        density="compact"
                        :label="$t('firstName')"
                      />
                      <!-- @blur="updateAccountDescription"  -->
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="4"
                      md="3"
                    >
                      <v-text-field
                        name="lastname"
                        v-model="extraAttributes.lastName"
                        variant="outlined"
                        density="compact"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        :label="$t('lastName')"
                      />
                      <!-- @blur="updateAccountDescription" -->
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="4"
                      md="3"
                    >
                      <v-textarea
                        variant="outlined"
                        density="compact"
                        :label="$t('accountDesc')"
                        rows="1"
                        v-model="accountDescription"
                        @focus="appendFullNameToDescription"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1 d-flex"
                      cols="12"
                      sm="4"
                      md="3"
                      style="margin-left: -3px"
                    >
                      <fieldset class="w-100 pishro-border pa-0 d-flex">
                        <!-- <legend class="mx-auto px-2 text-grey">{{ $t('nationality') }}</legend> -->
                        <v-checkbox
                          v-model="extraAttributes.isForeignNationals"
                          variant="outlined"
                          density="compact"
                          hide-details
                          :label="$t('foreignNationals')"
                          @change="handleCheckboxChange('foreign')"
                        />
                        <v-checkbox
                          v-model="extraAttributes.isCiviParticipation"
                          variant="outlined"
                          density="compact"
                          hide-details
                          :label="$t('civiParticipation')"
                          @change="handleCheckboxChange('civi')"
                        />
                      </fieldset>
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="4"
                      md="3"
                      style="margin-left: 1px"
                    >
                      <v-text-field
                        v-if="!extraAttributes.isForeignNationals"
                        name="nationalcode"
                        counter="10"
                        maxLength="10"
                        v-model="extraAttributes.nationalCode"
                        variant="outlined"
                        density="compact"
                        dir="ltr"
                        :label="$t('nationalCode')"
                        :rules="[
                          v => !isNationalCodeRequired || !!v || $t('enterRequiredField'),
                          v => !v || validationPatterns.nationalCode.test(v) || $t('nationalCodeInvalid')
                        ]"
                      />
                      <v-text-field
                        v-else
                        name="foreignNationalCode"
                        counter="12"
                        maxLength="12"
                        v-model="extraAttributes.foreignNationalCode"
                        variant="outlined"
                        density="compact"
                        type="number"
                        :label="$t('foreignNationalCode')"
                      />
                    </v-col>
                    <!-- </div> -->
                    <!-- <v-col v-if="extraAttributes.personType == 0" class="pa-1" cols="12" sm="4" md="12">
                      <v-textarea variant="outlined" density="compact" :label="$t('accountDesc')" rows="1"
                        v-model="accountDescription" @focus="appendFullNameToDescription" />
                    </v-col> -->
                    <!-- <v-col v-if="extraAttributes.personType == 0" class="pa-1" cols="12">
                      <v-textarea v-model="extraAttributes.desc" variant="outlined" density="compact"
                        :label="$t('description')" />
                    </v-col> -->
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <date-picker
                        :editable="true"
                        v-model="extraAttributes.birthDate"
                        format="YYYY-MM-DD"
                        display-format="jYYYY/jMM/jDD"
                        :label="$t('birthDate')"
                        locale="fa,en"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-text-field
                        v-if="!extraAttributes.isForeignNationals"
                        v-model="extraAttributes.birthCertificateNumber"
                        variant="outlined"
                        density="compact"
                        :label="$t('birthCertificateNumber')"
                      />
                      <v-text-field
                        v-else
                        v-model="extraAttributes.passportCode"
                        variant="outlined"
                        density="compact"
                        :label="$t('passportCode')"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-text-field
                        v-model="extraAttributes.placeOfIssue"
                        variant="outlined"
                        density="compact"
                        :label="$t('placeOfIssue')"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-text-field
                        v-model="extraAttributes.fathersName"
                        variant="outlined"
                        density="compact"
                        :label="$t('fathersName')"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-select
                        v-model="extraAttributes.maritalStatus"
                        :items="maritalStatus"
                        variant="outlined"
                        density="compact"
                        :label="$t('maritalStatus')"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-text-field
                        v-model="extraAttributes.email"
                        variant="outlined"
                        density="compact"
                        :label="$t('email')"
                        :rules="[
                          v => !v || validationPatterns.email.test(v) || $t('emailInvalid')
                        ]"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-text-field
                        v-model="extraAttributes.site"
                        variant="outlined"
                        density="compact"
                        :label="$t('site')"
                        :rules="[
                          v => !v || validationPatterns.website.test(v) || $t('websiteInvalid')
                        ]"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-text-field
                        v-model="extraAttributes.economicCode"
                        variant="outlined"
                        density="compact"
                        :label="$t('economicCode')"
                        :rules="[
                          v => !isEconomicCodeRequired || !!v || $t('enterRequiredField'),
                          v => !v || validationPatterns.economicCode.test(v) || $t('economicCodeInvalid')
                        ]"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 1"
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-text-field
                        name="type"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        v-model="extraAttributes.type"
                        variant="outlined"
                        density="compact"
                        :label="$t('type')"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 1"
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-text-field
                        name="firstname"
                        v-model="extraAttributes.companyName"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        variant="outlined"
                        density="compact"
                        :label="$t('firstName')"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 1"
                      class="pa-1"
                      cols="12"
                      sm="4"
                      md="3"
                    >
                      <v-textarea
                        variant="outlined"
                        density="compact"
                        ref="selectAccountDesc"
                        :label="$t('accountDesc')"
                        rows="1"
                        v-model="accountDescription"
                        @focus="appendCompanyNameToDescription"
                      />
                    </v-col>

                    <!-- <v-col v-if="extraAttributes.personType == 1" class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="nationalId" v-model="extraAttributes.nationalCode" variant="outlined"
                        density="compact" :label="$t('ownerNationalCode')" />
                    </v-col> -->
                    <v-col
                      v-if="extraAttributes.personType == 1"
                      class="pa-1 d-flex"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-checkbox
                        v-model="extraAttributes.isCiviParticipation"
                        variant="outlined"
                        density="compact"
                        :label="$t('civiParticipation')"
                        class="ml-1"
                      />
                      <v-text-field
                        name="nationalId"
                        v-model="extraAttributes.nationalId"
                        variant="outlined"
                        density="compact"
                        :label="$t('nationalId')"
                        :rules="[
                          v => extraAttributes.personType != '1' || !!v || $t('enterRequiredField'),
                          v => !v || validationPatterns.nationalId.test(v) || $t('nationalIdInvalid')
                        ]"
                      />
                    </v-col>
                    <!-- <v-col v-if="extraAttributes.personType == 1" class="pa-1" cols="12" sm="4" md="12">
                      <v-textarea variant="outlined" density="compact" :label="$t('accountDesc')" rows="1"
                        v-model="accountDescription" @focus="appendFullNameToDescription" />
                    </v-col> -->
                    <!-- <v-col v-if="extraAttributes.personType == 1" class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="economicCode" v-model="extraAttributes.economicCode" variant="outlined"
                        density="compact" :label="$t('economicCode')" />
                    </v-col> -->
                    <v-col
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                    >
                      <v-text-field
                        name="postalCode"
                        v-model="extraAttributes.postalCode"
                        variant="outlined"
                        counter="10"
                        maxLength="10"
                        density="compact"
                        :label="$t('postalCode')"
                        :rules="[
                          v => (!isPostalCodeRequired || !!v) || $t('enterRequiredField'),
                          v => !v || validationPatterns.postalCode.test(v) || $t('postalCodeInvalid')
                        ]"
                      />
                    </v-col>
                    <v-col
                      class="pa-1"
                      cols="6"
                      sm="4"
                      md="3"
                      v-if="extraAttributes.personType == 1"
                    >
                      <v-select
                        :items="locationData.map((x) => x.title)"
                        variant="outlined"
                        density="compact"
                        :label="$t('province')"
                        v-model="extraAttributes.province"
                      />
                      <!-- v-model="selectedProvince" -->
                    </v-col>
                    <v-col
                      cols="6"
                      sm="4"
                      md="3"
                      class="pa-1"
                      v-if="extraAttributes.personType == 1"
                    >
                      <v-select
                        :items="filteredCities"
                        v-model="extraAttributes.city"
                        variant="outlined"
                        density="compact"
                        :label="$t('city')"
                      />
                      <!-- v-model="selectedCity" -->
                    </v-col>
                    <v-col
                      cols="6"
                      sm="4"
                      md="3"
                      class="pa-1"
                      v-if="extraAttributes.personType == 1"
                    >
                      <v-select
                        v-model="extraAttributes.taxStatus"
                        :items="taxStatus"
                        variant="outlined"
                        density="compact"
                        :label="$t('taxStatus')"
                        item-title="title"
                        item-value="id"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                      />
                    </v-col>
                    <v-col
                      v-if="extraAttributes.personType == 0"
                      class="pa-1"
                      cols="12"
                      sm="6"
                      md="3"
                    >
                      <v-select
                        v-model="extraAttributes.taxStatus"
                        :items="taxStatus"
                        variant="outlined"
                        density="compact"
                        :label="$t('taxStatus')"
                        item-title="title"
                        item-value="id"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                      />
                    </v-col>
                    <v-col
                      cols="12"
                      sm="4"
                      md="12"
                      class="pa-1"
                    >
                      <v-textarea
                        v-model="extraAttributes.addres"
                        variant="outlined"
                        density="compact"
                        rows="1"
                        :label="$t('address')"
                      />
                      <!-- v-model="selectedCity" -->
                    </v-col>
                    <!-- <v-col v-if="extraAttributes.personType == 1" class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="registrationNumber" v-model="extraAttributes.registrationNumber"
                        variant="outlined" density="compact" :label="$t('registrationNumber')" />
                    </v-col>
                    <v-col v-if="extraAttributes.personType == 1" class="pa-1" cols="12">
                      <v-textarea v-model="extraAttributes.desc" variant="outlined" density="compact"
                        :label="$t('description')" />
                    </v-col> -->
                  </v-row>
                  <!-- </v-window-item> -->
                  <!-- <v-window-item :value="1"> -->
                  <!-- <v-row class="align-center pa-2" no-gutters> -->
                  <!-- <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field :rules="[
                        (v) => {
                          if (v && v.length < 11)
                            return $t('enterPhoneNumberCorrectFormat')
                          else return true
                        }
                      ]" name="phoneNumber" :counter="11" :maxLength="11" v-model="extraAttributes.phoneNumber"
                        variant="outlined" density="compact" :label="$t('phoneNumber')" type="tel" />
                    </v-col> -->
                  <!-- <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field :rules="[
                        (v) => {
                          if (v && v.length < 11)
                            return $t('enterTelephoneNumberCorrectFormat')
                          else return true
                        }
                      ]" name="telephone" :counter="11" :maxLength="11" v-model="extraAttributes.telephone"
                        variant="outlined" density="compact" :label="$t('telephone')" type="tel" />
                    </v-col> -->
                  <!-- <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="fax" v-model="extraAttributes.fax" variant="outlined" density="compact"
                        :label="$t('faxNumber')" type="tel" />
                    </v-col> -->
                  <!-- <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field :rules="[
                        (v) =>
                          (!!v && emailAddressRegex.test(v)) ||
                          $t('enterEmailAddressCorrectFormat')
                      ]" name="email" v-model="extraAttributes.email" variant="outlined" density="compact"
                        :label="$t('email')" type="email" />
                    </v-col> -->
                  <!-- <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="website" v-model="extraAttributes.website" variant="outlined" density="compact"
                        :label="$t('website')" type="url" />
                    </v-col> -->
                  <!-- </v-row> -->
                  <!-- </v-window-item> -->
                  <!-- <v-window-item :value="2"> -->
                  <!-- <v-row class="align-center pa-2" no-gutters>
                    <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="country" v-model="extraAttributes.country" variant="outlined" density="compact"
                        :model-value="$t('iran')" :label="$t('country')" />
                    </v-col> -->
                  <!-- <v-col class="px-1" cols="6" sm="4" md="3">
                      <v-select :items="locationData.map((x) => x.title)" variant="outlined" density="compact"
                        :label="$t('province')" v-model="extraAttributes.province" />
                      v-model="selectedProvince" 
                    </v-col> 
                    <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-select :items="filteredCities" v-model="extraAttributes.city" variant="outlined"
                        density="compact" :label="$t('city')" />
                     v-model="selectedCity" -->
                  <!-- </v-col> -->
                  <!-- <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="postalCode" :rules="[
                        (v) => {
                          if (v && v.length < 10)
                            return $t('enterPostalCodeCorrectFormat')
                          else return true
                        }
                      ]" :counter="10" :maxLength="10" v-model="extraAttributes.postalCode" variant="outlined"
                        density="compact" :label="$t('postalCode')" />
                    </v-col> -->
                  <!-- <v-col class="pa-1" cols="12">
                      <v-textarea name="address" v-model="extraAttributes.address" variant="outlined" density="compact"
                        :label="$t('address')" />
                    </v-col>
                  </v-row> -->
                  <!-- </v-window-item> -->
                  <!-- <v-window-item :value="3"> -->
                  <!-- <v-row class="align-center pa-2" no-gutters>
                    <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="bank" v-model="extraAttributes.bankName" variant="outlined" density="compact"
                        :label="$t('bankName')" />
                    </v-col>
                    <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="bankBranch" v-model="extraAttributes.bankBranch" variant="outlined"
                        density="compact" :label="$t('branch')" />
                    </v-col>
                    <v-col class="pa-1" cols="12" sm="4" md="6">
                      <v-text-field :rules="[
                        (v) => {
                          if (v && v.length < 10)
                            return $t('enterCardNumberCorrectFormat')
                          else return true
                        }
                      ]" name="cardNumber" :counter="16" :maxLength="16" v-model="extraAttributes.cardNumber"
                        variant="outlined" density="compact" :label="$t('cardNumber')" />
                    </v-col>
                    <v-col class="pa-1" cols="12" sm="6">
                      <v-text-field name="accountNumber" v-model="extraAttributes.bankAccountNumber" variant="outlined"
                        density="compact" :label="$t('accountNumber')" />
                    </v-col>
                    <v-col class="pa-1" cols="12" sm="6">
                      <v-text-field :rules="[
                        (v) => {
                          if (v && v.length < 10)
                            return $t('enterShabaNumberCorrectFormat')
                          else return true
                        }
                      ]" name="iBan" v-model="extraAttributes.iBan" variant="outlined" density="compact"
                        :label="$t('shabaNumber')" type="number" :counter="24" :maxLength="24" suffix="IR" />
                    </v-col>
                  </v-row> -->
                  <!-- </v-window-item> -->
                  <!-- <v-window-item :value="4"> -->
                  <!-- <v-row class="align-center pa-2" no-gutters>
                    <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="country" v-model="extraAttributes.marketingPercentAmount" variant="outlined"
                        density="compact" :label="$t('marketingPercentAmount')">
                        <template #append-inner>
                          <v-icon size="small">mdi-percent</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                    <v-col class="pa-1" cols="6" sm="4" md="3">
                      <v-text-field name="country" v-model="extraAttributes.salesAmountIncreasePercent" variant="outlined"
                        density="compact" :label="$t('salesAmountIncreasePercent')">
                        <template #append-inner>
                          <v-icon size="small">mdi-percent</v-icon>
                        </template>
                      </v-text-field>
                    </v-col>
                  </v-row> -->
                </v-window-item>
              </v-window>
              <v-row class="justify-end pa-4 pb-2" no-gutters>
                <v-btn type="submit" :prepend-icon="saveIcon" variant="flat" color="info">{{
                  $t('save')
                }}</v-btn>
              </v-row>
            </v-row>
          </v-form>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
import provinceData from '../../../public/province.json'
import treeView from '../../components/baseComponents/Treeview/treeview.vue'
import switchButton from '../../components/baseComponents/switchButton.vue'
import detailedAccountService from '../../../api/detailedAccount/detailedAccountService'
import CustomerService from '../../../api/customer/customerService'
import settingService from '../../../api/setting/settingService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import folderIcon from '../../components/icons/Folder.vue'
import paperIcon from '../../components/icons/Paper.vue'
import openedFolderIcon from '../../components/icons/Folder-Opened.vue'
import addAccountIcon from '../../components/icons/AccountingAddAccount.vue'
import deleteIcon from '../../components/icons/Delete.vue'
import saveIcon from '../../components/icons/Save.vue'
import generalInfoIcon from '../../components/icons/PersonGeneralInfo.vue'
import contactInfoIcon from '../../components/icons/PersonContactInfo.vue'
import addressInfoIcon from '../../components/icons/PersonAddressInfo.vue'
import salesAndPurchaseInfoIcon from '../../components/icons/salesAndPurchaseInfo.vue'
import financialInfoIcon from '../../components/icons/PersonFinancialInfo.vue'
import { markRaw } from 'vue'
import utils from '../../../plugins/utils'
import imgResize from '../../../plugins/imgResize'
import customForm from '../../components/baseComponents/customForm.vue'
import groupSelect from '../../components/accountsComponents/detailedAccountGroupSelect.vue'

export default {
  data() {
    return {
      accountDescription: '',
      locationData: [],
      cities: [],
      selectedProvince: null,
      selectedCity: null,
      selectedShow: 0,
      emailAddressRegex:
        /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      showGroupDialog: false,
      postalCodeRegex: /^(?:[A-Z0-9]+([- ]?[A-Z0-9]+)*)?$/,
      shouldLeave: false,
      hasChange: false,
      parentId: null,
      isEdit: false,
      id: null,
      tab: 0,
      isAutomatePersonCode: true,
      accountSetting: [],
      isAutomateCode: false,
      createAccountDialog: {
        dialog: false,
        form: {
          controlLimit: 1,
          type: 0,
          subLevelAccountCodeCount: 0
        }
      },
      validationPatterns: {
        email: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        website: /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+)(\/[a-zA-Z0-9-_.~%]*)*$/,
        nationalCode: /^[0-9]{10}$/,
        postalCode: /^[0-9]{10}$/,
        nationalId: /^[0-9]{11}$/,
        economicCode: /^[0-9]{12}$/
      },
      accountInfo: {
        image: null,
        code: null,
        title: null,
        desc: null
      },
      extraAttributes: {
        personType: '0',
        gender: '0',
        firstName: '',
        lastName: '',
        isForeignNationals: false,
        isCiviParticipation: false,
        nationalCode: '',
        taxStatus: 1
      },
      maritalStatus: [
        { title: this.$t('single'), id: 0 },
        { title: this.$t('married'), id: 1 }
      ],
      taxStatus: [
        { title: this.$t('finalCustomer'), id: 1 },
        { title: this.$t('movvadiUnderTaxSystem'), id: 2 },
        { title: this.$t('movvadiSubjectToArticle81TaxLaw'), id: 3 }
      ],
      treeViewAccountsShowList: [],
      treeViewAccounts: [],
      lastOpenItems: [],
      folderIcon: markRaw(folderIcon),
      saveIcon: markRaw(saveIcon),
      paperIcon: markRaw(paperIcon),
      openedFolderIcon: markRaw(openedFolderIcon),
      deleteIcon: markRaw(deleteIcon),
      generalInfoIcon: markRaw(generalInfoIcon),
      contactInfoIcon: markRaw(contactInfoIcon),
      addressInfoIcon: markRaw(addressInfoIcon),
      financialInfoIcon: markRaw(financialInfoIcon),
      addAccountIcon: markRaw(addAccountIcon),
      salesAndPurchaseInfoIcon: markRaw(salesAndPurchaseInfoIcon),
      personFullName: '',
    }
  },
  computed: {
    isPostalCodeRequired() {
      return this.extraAttributes.personType === '1';
    },
    maxNationalCodeLength() {
      if (this.extraAttributes.isForeignNationals || this.extraAttributes.isCiviParticipation) {
        return 11
      }
      return 10
    },
    isNationalCodeRequired() {
      return this.extraAttributes.personType == 0 && 
            (this.extraAttributes.taxStatus === 2 || this.extraAttributes.taxStatus === 3) &&
            !this.extraAttributes.economicCode;
    },
    isEconomicCodeRequired() {
      return this.extraAttributes.personType == 0 && 
            (this.extraAttributes.taxStatus === 2 || this.extraAttributes.taxStatus === 3) &&
            !this.extraAttributes.nationalCode;
    },
    subGroupStatuses() {
      return [
        { title: this.$t('noSubGroup'), id: 0 },
        { title: this.$t('subGroup') + ' ' + this.$t('singleDigit'), id: 1 },
        { title: this.$t('subGroup') + ' ' + this.$t('doubleDigit'), id: 2 },
        { title: this.$t('subGroup') + ' ' + this.$t('threeDigit'), id: 3 },
        { title: this.$t('subGroup') + ' ' + this.$t('fourDigit'), id: 4 },
        { title: this.$t('subGroup') + ' ' + this.$t('fiveDigit'), id: 5 },
        { title: this.$t('subGroup') + ' ' + this.$t('sixDigit'), id: 6 },
        { title: this.$t('subGroup') + ' ' + this.$t('sevenDigit'), id: 7 },
        { title: this.$t('subGroup') + ' ' + this.$t('eightDigit'), id: 8 }
      ]
    },
    filteredCities() {
      let province = this.locationData.filter((x) => x.title === this.extraAttributes.province)[0]
      this.extraAttributes.city = null
      return province?.cities || []
    },

    accountTypes() {
      return [
        { title: this.$t('neutral'), id: 0 },
        { title: this.$t('debtor'), id: 1 },
        { title: this.$t('creditor'), id: 2 }
      ]
    },
    accountFamilies() {
      return [
        { title: this.$t('people'), id: 0 },
        { title: this.$t('costCenters'), id: 1 },
        { title: this.$t('projects'), id: 2 },
        { title: this.$t('contracts'), id: 3 },
        { title: this.$t('banksCashDeskFund'), id: 4 },
        { title: this.$t('products'), id: 5 },
        { title: this.$t('other'), id: 6 }
      ]
    }
  },
  watch: {
    isAutomateCode(value) {
      if (value == true) this.createAccountDialog.form.code = null
    },
    isAutomatePersonCode(value) {
      if (value == true) this.accountInfo.code = null
    },
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      closeAndRefreshTab: 'closeAndRefreshTab'
    }),
    handleCheckboxChange(type) {
      if (type === 'foreign') {
        this.extraAttributes.isCiviParticipation = false
      } else if (type === 'civi') {
        this.extraAttributes.isForeignNationals = false
      }
    },
    appendFullNameToDescription() {
      if (
        !this.accountDescription &&
        this.extraAttributes.firstName &&
        this.extraAttributes.lastName
      ) {
        const genderLabel = this.extraAttributes.gender == 0 ? this.$t('Mr') : this.$t('Miss')
        this.accountDescription = `${genderLabel} ${this.extraAttributes.firstName} ${this.extraAttributes.lastName}`
      }
    },
    appendCompanyNameToDescription() {
      if (!this.accountDescription && this.extraAttributes.companyName) {
        this.accountDescription = `${this.$t('company')} ${this.extraAttributes.companyName}`
      }
    },
    saveSelectParent(item) {
      if (item) {
        this.accountInfo.parentName = item.fName || item.name;
        this.accountInfo.parentId = item.id;
        this.hasChange = true;
      }
      this.showGroupDialog = false;
    },
    handleCloseEditDialog() {
      if (this.createAccountDialog.hasChanged) {
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.createAccountDialog.dialog = false
        })
      } else this.createAccountDialog.dialog = false
    },
    async save() {
      const isValid = await this.$refs.personForm.validate()
      console.log(isValid);
      if (!isValid) {
        this.setErrorMessage(this.$t('formContainsErrors'));
        return;
      }
      let errors = ''
      if (this.extraAttributes.personType === '0') {
        if (!this.extraAttributes.firstName || !this.extraAttributes.firstName.trim()) {
          errors += this.$t('firstNameRequired') + '\n';
        }
        
        if (!this.extraAttributes.lastName || !this.extraAttributes.lastName.trim()) {
          errors += this.$t('lastNameRequired') + '\n';
        }
        
        if (this.isNationalCodeRequired && 
            (!this.extraAttributes.nationalCode || 
            !this.validationPatterns.nationalCode.test(this.extraAttributes.nationalCode))) {
          errors += this.$t('nationalCodeInvalid') + '\n';
        }
      } else {
        if (!this.extraAttributes.companyName || !this.extraAttributes.companyName.trim()) {
          errors += this.$t('companyNameRequired') + '\n';
        }
        
        if (!this.extraAttributes.nationalId || 
            !this.validationPatterns.nationalId.test(this.extraAttributes.nationalId)) {
          errors += this.$t('nationalIdInvalid') + '\n';
        }
      }
      
      if (!this.accountInfo.parentId) {
        errors += this.$t('categoryRequired') + '\n';
      }
      
      if (errors.length > 0) {
        this.setErrorMessage(errors.trim());
        return;
      }

      // if (
      //   !this.extraAttributes.phoneNumber ||
      //   !/(0|\+98)?([ ]|-|[()]){0,2}9[1|2|3|4|9]([ ]|-|[()]){0,2}(?:[0-9]([ ]|-|[()]){0,2}){8}$/.test(
      //     this.extraAttributes.phoneNumber
      //   )
      // )
      //   errors += this.$t('enterPhoneNumber') + '\n'
      // if (
      //   !this.extraAttributes.firstName ||
      //   !this.extraAttributes.lastName ||
      //   (this.extraAttributes.personType == '0' &&
      //     (!this.extraAttributes.nationalCode ||
      //       !/^([0-9]){10}$/.test(this.extraAttributes.nationalCode))) ||
      //   (this.extraAttributes.personType == '1' && !this.extraAttributes.companyName)
      // )
      //   errors += this.$t('enterGeneralInfoMessage') + '\n'
      // console.log(errors);

      const attributesList = Object.entries({
        ...this.extraAttributes,
        image: this.accountInfo.image
      }).map(([key, value]) => ({
        key: key,
        value: value?.toString() ?? '',
        validation: '',
        action: this.isEdit ? 2 : 1
      }));
      console.log(attributesList);


      if (errors.length > 0) this.setErrorMessage(errors.slice(0, -1))
      else {
        let request = {
          type: 3,
          code: this.accountInfo.code,
          name: this.extraAttributes.personType === '0' 
            ? `${this.extraAttributes.firstName} ${this.extraAttributes.lastName}`
            : this.extraAttributes.companyName,
          description: this.accountDescription,
          family: 0,
          isActive: true,
          maximumChildCodeLength: 0,
          parentId: this.accountInfo.parentId,
          attributes: attributesList
        }
        if (this.isEdit) {
          request.id = this.id
          console.log(request);
          await detailedAccountService.update(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('userSuccessfullyEdited'), 'success')
              this.hasChange = false
              this.closeAndRefreshTab()
            } else this.setErrorMessage(res.message)
          })
        } else {
          console.log(request);
          await detailedAccountService.create(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(this.$t('userSuccessfullyCreated'), 'success')
              this.hasChange = false
              this.closeAndRefreshTab()
            } else this.setErrorMessage(res.message)
          })
        }
      }
    },
    attachImage() {
      this.$refs.image.click()
    },
    async uploadImage(value) {
      let file = value.target.files[0]
      let img = await imgResize(file)
      this.accountInfo.image = img
    },
    async getAccountSetting(type) {
      const params = {
        page: 1,
        size: 10,
        settingModule: 0
      }
      await settingService.getSetting(params).then((resp) => {
        this.accountSetting = resp.value.result
      })
    },
    async getById(id) {
      let resp = await CustomerService.getById(id)
      if (resp.isSuccess) return resp.value
      else {
        this.setErrorMessage(resp.message)
        return false
      }
    },
    fetchEditData(item) {
      this.accountInfo = {
        image: null,
        code: item.code,
        title: item.name,
        desc: item.description,
        parentName: item.hierarchyNames,
        parentId: item.parentId
      }
      this.parentId = item.parentId;
      
      this.extraAttributes = {
        personType: '0',
        gender: '0',
        firstName: '',
        lastName: '',
        isForeignNationals: false,
        isCiviParticipation: false,
        nationalCode: '',
        taxStatus: 1
      };
      if (Array.isArray(item.attributes) && item.attributes.length > 0) {
        item.attributes.forEach(attr => {
          if (attr.key === 'taxStatus') {
            this.extraAttributes[attr.key] = parseInt(attr.value) || 1;
          } else if (attr.key === 'maritalStatus') {
            this.extraAttributes[attr.key] = parseInt(attr.value) || 0;
          } else if (attr.value === "true" || attr.value === "false") {
            this.extraAttributes[attr.key] = attr.value === "true";
          } else {
            this.extraAttributes[attr.key] = attr.value;
          }
        });
      }
      this.accountDescription = item.description || '';

      if (item.parentId) {
        this.loadParentInfo(item.parentId);
      }
    },
    async loadParentInfo(parentId) {
      const response = await detailedAccountService.getById(parentId);
      if (response.isSuccess) {
        const parent = response.entity || response.value;
        if (parent) {
          this.accountInfo.parentName = parent.hierarchyNames || parent.name;
        }
      }
    },
    onkeydown(e) {
      if (this.createAccountDialog?.dialog && e.keyCode == 27) this.handleCloseEditDialog()
    },
    async fetchLocationData() {
      try {
        const response = await fetch('../../../province.json')
          .then((res) => res.json())
          .then((res) => {
            this.locationData = res.states
          })
      } catch (error) {
        console.error('خطا در دریافت داده‌ها:', error)
      }
    }
  },
  async mounted() {
    await this.fetchLocationData()
    document.addEventListener('keydown', this.onkeydown)
    if (this.currentActiveTab.params.id && this.currentActiveTab.params.id != 'new') {
      this.isEdit = true
      this.id = this.currentActiveTab.params.id
      let item = await this.getById(this.id)
      if (item) {
        this.fetchEditData(item)
      } else this.$router.go(-1)
    }
    await this.getAccountSetting(6)
  },
  unmounted() {
    document.removeEventListener('keydown', this.onkeydown)
  },

  beforeRouteLeave(to, from) {
    if (this.hasChange) {
      if (!this.shouldLeave)
        this.setWarningDialog(true, this.$t('leaveFromPage'), this.$t('leaveFromPageAlert'), () => {
          this.closeWarning()
          this.shouldLeave = true
          this.$router.push(to.href)
        })
      return this.shouldLeave
    }
  },
  components: {
    treeView,
    customForm,
    switchButton,
    groupSelect
  }
}
</script>

<style>
.image-container {
  position: relative;
  border-radius: 8%;
  padding: 4px;
  border: 2px dashed rgb(var(--v-theme-info));
  cursor: pointer;
  transition: 0.3s ease;
}

.image-container:hover {
  opacity: 1 !important;
}

.delete-pic {
  z-index: 1;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: 0.3s ease;
  background-color: rgb(18 15 15 / 39%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  border-radius: 50%;
  transform: scale(0.5);
}

.image-container:hover .delete-pic {
  transform: scale(1);
  opacity: 1;
}
</style>
