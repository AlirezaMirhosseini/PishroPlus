<template>
  <v-card>
    <v-card-text>
      <v-form
        @submit.prevent="save"
        ref="productForm"
        @input="
          () => {
            if (!hasChange) hasChange = true
          }
        "
      >
        <fieldset class="w-100 pishro-border">
          <legend class="mx-auto px-2 text-grey">
            {{ type == 0 ? $t('productInfo') : $t('serviceInfo') }}
          </legend>
          <v-row no-gutters class="d-flex align-center" style="gap: 20px">
            <div
              class="image-container"
              @click="showImagesDialog = true"
              :style="mainImage ? 'opacity:1' : 'opacity:0.7'"
            >
              <v-img
                width="100"
                aspect-ratio="1/1"
                cover
                :src="mainImage ? `data:image/image/jpeg;base64,${mainImage}` : productImgSrc"
                style="border-radius: 50%"
              ></v-img>
              <div class="image-count-badge" :class="{ 'has-images': totalImages > 0 }">
                {{ imageCountText }}
              </div>
            </div>
            <div class="d-flex flex-column justify-center" style="width: 85%">
              <v-row class="align-center justify-space-between" no-gutters style="gap: 10px">
                <switch-button
                  v-if="!isEdit"
                  class="mb-5 ms-2"
                  v-model:checked="isAutomateCode"
                  :label="isAutomateCode ? $t('automaticCode') : $t('manualCode')"
                />
                <v-text-field
                  name="code"
                  :disabled="isAutomateCode"
                  v-model="form.code"
                  :rules="[
                    (v) => {
                      if (v || isAutomateCode) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  variant="outlined"
                  :label="this.type == 0 ? $t('productCode') : $t('serviceCode')"
                  density="compact"
                  style="min-width: 170px"
                />
                <v-text-field
                  name="name"
                  v-model="form.title"
                  :rules="[
                    (v) => {
                      if (v) return true
                      return $t('enterRequiredField')
                    }
                  ]"
                  autofocus
                  variant="outlined"
                  :label="$t('title')"
                  density="compact"
                  style="min-width: 170px"
                />
                <v-text-field
                  readonly
                  v-model="form.parent.title"
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
                  append-inner-icon="mdi-menu"
                  style="min-width: 300px"
                />
                <group-select
                  :selected="form.parentDetailedAccountId"
                  @save="saveSelectParent"
                  v-model:show="showGroupDialog"
                  :family="8"
                  :onlyParents="true"
                />
              </v-row>
              <v-row no-gutters class="mt-4">
                <v-text-field
                  name="description"
                  v-model="form.description"
                  variant="outlined"
                  :label="$t('desc')"
                  density="compact"
                  style="min-width: 220px"
                />
              </v-row>
            </div>
          </v-row>
        </fieldset>
        <v-row class="mt-4 flex-column" no-gutters>
          <v-tabs class="w-100" v-model="tab" color="primary" align-tabs="start">
            <v-tab :value="0"
              ><v-icon
                class="me-2"
                :icon="generalInfoIcon"
                size="28"
                :color="tab == 0 ? 'primary' : 'grey'"
              />
              <p
                :class="tab == 0 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 0 ? 'bold' : 'unset'}`"
              >
                {{ $t('generalInfo') }}
              </p></v-tab
            >
            <v-tab :value="1"
              ><v-icon
                class="me-2"
                :icon="saleIcon"
                size="28"
                :color="tab == 1 ? 'primary' : 'grey'"
              />
              <p
                :class="tab == 1 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 1 ? 'bold' : 'unset'}`"
              >
                {{ $t('price') }}
              </p></v-tab
            >
            <v-tab v-if="type === 0" :value="2"
              ><v-icon
                class="me-2"
                :icon="inventoryIcon"
                size="28"
                :color="tab == 2 ? 'primary' : 'grey'"
              />
              <p
                :class="tab == 2 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 2 ? 'bold' : 'unset'}`"
              >
                {{ $t('inventory') }}
              </p></v-tab
            >
            <v-tab :value="3"
              ><v-icon
                class="me-2"
                :icon="taxIcon"
                size="28"
                :color="tab == 3 ? 'primary' : 'grey'"
              />
              <p
                :class="tab == 3 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 3 ? 'bold' : 'unset'}`"
              >
                {{ $t('tax') }}
              </p></v-tab
            >
            <v-tab :value="4"
              ><v-icon
                class="me-2"
                icon="mdi-store"
                size="28"
                :color="tab == 4 ? 'primary' : 'grey'"
              />
              <p
                :class="tab == 4 ? 'text-primary' : 'text-grey'"
                :style="`font-weight:${tab == 4 ? 'bold' : 'unset'}`"
              >
                {{ $t('shop') }}
              </p></v-tab
            >
          </v-tabs>
          <v-window :touch="false" v-model="tab">
            <v-window-item :value="0" class="pa-1">
              <v-row class="align-start pa-2 pt-6">
                <v-col cols="12">
                  <fieldset v-if="type == 0" class="pishro-border mb-3">
                    <legend class="mx-auto px-2 text-grey">{{ $t('warehouse') }}</legend>
                    <v-row no-gutters>
                      <v-checkbox
                        v-for="item in warehouses"
                        hide-details
                        :label="item.title"
                        v-model="item.checked"
                        :key="item.id"
                        color="primary"
                      />
                    </v-row>
                  </fieldset>
                  <fieldset class="pishro-border">
                    <legend class="mx-auto px-2 text-grey">{{ $t('unit') }}</legend>
                    <v-row no-gutters>
                      <v-col cols="12" md="5" class="pa-3">
                        <v-text-field
                          name="barcode"
                          v-model="mainUnit.barcode"
                          variant="outlined"
                          :label="$t('mainBarcode')"
                          density="compact"
                          style="min-width: 170px"
                          append-inner-icon="mdi-barcode"
                        />
                      </v-col>
                      <v-col cols="12" md="5" class="pa-3">
                        <v-text-field
                          hide-details
                          name="unit"
                          v-model="mainUnit.title"
                          variant="outlined"
                          :label="$t('mainUnit')"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-btn
                          @click="addSubunit"
                          prepend-icon="mdi mdi-plus"
                          variant="flat"
                          color="primary"
                          height="40"
                          >{{ $t('add') }}</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row
                      no-gutters
                      v-for="(unit, index) in form.units?.filter(
                        (x) => !x.isDefault && x.action != 3
                      )"
                      :key="index"
                    >
                      <v-col cols="12" md="5" class="pa-3 d-flex align-top">
                        <span class="ml-1 text-grey mt-2" style="font-size: 12pt"
                          >{{ index + 1 }}.</span
                        >
                        <v-text-field
                          v-model="unit.barcode"
                          variant="outlined"
                          :label="$t('subBarcode')"
                          density="compact"
                          style="min-width: 170px"
                          append-inner-icon="mdi-barcode"
                        />
                      </v-col>
                      <v-col cols="12" md="3" class="pa-3">
                        <v-text-field
                          hide-details
                          v-model="unit.title"
                          :rules="[
                            (v) => {
                              if (v) return true
                              return $t('enterRequiredField')
                            }
                          ]"
                          variant="outlined"
                          :label="$t('subunit')"
                          density="compact"
                          style="min-width: 150px"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-text-field
                          hide-details
                          type="number"
                          v-model.number="unit.conversionFactor"
                          :rules="[
                            (v) => {
                              if (v) return true
                              return $t('enterRequiredField')
                            }
                          ]"
                          variant="outlined"
                          :label="$t('coefficient')"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-btn
                          @click="() => (unit.action = 3)"
                          icon="mdi mdi-minus-circle"
                          variant="text"
                          color="error"
                          tabIndex="-1"
                        ></v-btn>
                      </v-col>
                    </v-row>
                    <p
                      v-if="form.units?.filter((x) => !x.isDefault && x.action == 3)?.length > 0"
                      class="text-error"
                    >
                      {{ $t('deleted') }} :
                    </p>
                    <v-row
                      no-gutters
                      v-for="(unit, index) in form.units?.filter(
                        (x) => !x.isDefault && x.action == 3
                      )"
                      :key="index"
                    >
                      <v-col cols="12" md="5" class="pa-3 d-flex align-top">
                        <span class="ml-1 text-grey mt-2" style="font-size: 12pt"
                          >{{ index + 1 }}.</span
                        >
                        <v-text-field
                          v-model="unit.barcode"
                          variant="outlined"
                          :label="$t('subBarcode')"
                          density="compact"
                          style="min-width: 170px"
                          append-inner-icon="mdi-barcode"
                        />
                      </v-col>
                      <v-col cols="12" md="3" class="pa-3">
                        <v-text-field
                          hide-details
                          v-model="unit.title"
                          :rules="[
                            (v) => {
                              if (v) return true
                              return $t('enterRequiredField')
                            }
                          ]"
                          variant="outlined"
                          :label="$t('subunit')"
                          density="compact"
                          style="min-width: 150px"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-text-field
                          hide-details
                          type="number"
                          v-model.number="unit.conversionFactor"
                          :rules="[
                            (v) => {
                              if (v) return true
                              return $t('enterRequiredField')
                            }
                          ]"
                          variant="outlined"
                          :label="$t('coefficient')"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-tooltip bottom>
                          <template #activator="{ props }">
                            <v-btn
                              v-bind="props"
                              @click="() => (unit.action = 2)"
                              icon="mdi mdi-arrow-u-right-bottom-bold"
                              variant="text"
                              color="info"
                              tabIndex="-1"
                            ></v-btn>
                          </template>
                          {{ $t('restore') }}
                        </v-tooltip>
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="1">
              <v-row class="align-start pa-2 pt-6">
                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details
                    name="salesPrice"
                    :model-value="form?.prices?.filter((p) => p.type == 1)[0]?.price"
                    variant="outlined"
                    :label="$t('salesPrice')"
                    dir="ltr"
                    density="compact"
                    :suffix="defaultCurrency"
                    v-maska:[maskOptions]
                    @maska="
                      (ev) => {
                        form.prices.filter((p) => p.type == 1)[0].price = parseFloat(
                          ev.detail.unmasked || 0
                        )
                        form.prices.filter((p) => p.type == 0)[0].edited = true
                      }
                    "
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details
                    name="purchasePrice"
                    :model-value="form?.prices?.filter((p) => p.type == 0)[0]?.price"
                    variant="outlined"
                    :label="$t('purchasePrice')"
                    dir="ltr"
                    density="compact"
                    :suffix="defaultCurrency"
                    v-maska:[maskOptions]
                    @maska="
                      (ev) => {
                        form.prices.filter((p) => p.type == 0)[0].price = parseFloat(
                          ev.detail.unmasked || 0
                        )
                        form.prices.filter((p) => p.type == 0)[0].edited = true
                      }
                    "
                  />
                </v-col>
                <v-col v-if="form.otherPrices?.length > 0" cols="12">
                  <fieldset class="pishro-border pt-4">
                    <legend class="mx-auto px-2 text-grey">{{ $t('otherPrices') }}</legend>
                    <div
                      class="d-flex flex-column flex-md-row mb-3"
                      style="gap: 12px"
                      v-for="(price, index) in form.otherPrices?.filter((p) => p.action != 3)"
                      :key="index"
                    >
                      <v-text-field
                        hide-details
                        v-model="price.title"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        variant="outlined"
                        :label="$t('title')"
                        density="compact"
                      />
                      <v-text-field
                        hide-details
                        :model-value="price.price"
                        :suffix="defaultCurrency"
                        :rules="[
                          (v) => {
                            if (v) return true
                            return $t('enterRequiredField')
                          }
                        ]"
                        v-maska:[maskOptions]
                        @maska="
                          (ev) => {
                            price.price = parseFloat(ev.detail.unmasked || 0)
                            price.edited = true
                          }
                        "
                        variant="outlined"
                        :label="$t('price')"
                        density="compact"
                      />
                      <v-select
                        :label="$t('type')"
                        variant="outlined"
                        density="compact"
                        hide-details
                        v-model="price.type"
                        :items="productPriceTypes"
                      />
                      <v-btn
                        @click="() => (price.action = 3)"
                        icon="mdi mdi-minus-circle"
                        variant="text"
                        color="error"
                      ></v-btn>
                    </div>
                    <v-btn
                      density="compact"
                      @click="addOtherPrice"
                      icon="mdi-plus"
                      variant="flat"
                      color="info"
                    ></v-btn>
                  </fieldset>
                </v-col>
                <v-btn
                  v-else
                  class="ma-3"
                  @click="addOtherPrice"
                  prepend-icon="mdi mdi-plus"
                  variant="flat"
                  color="info"
                  >{{ $t('addPrice') }}</v-btn
                >
                <v-col v-if="form.otherPrices?.filter((p) => p.action == 3).length > 0" cols="12">
                  <p class="text-error">{{ $t('deleted') }} :</p>
                  <div
                    class="d-flex flex-column flex-md-row mt-3"
                    style="gap: 12px"
                    v-for="(price, index) in form.otherPrices?.filter((p) => p.action == 3)"
                    :key="index"
                  >
                    <v-text-field
                      hide-details
                      v-model="price.title"
                      :rules="[
                        (v) => {
                          if (v) return true
                          return $t('enterRequiredField')
                        }
                      ]"
                      variant="outlined"
                      :label="$t('title')"
                      density="compact"
                    />
                    <v-text-field
                      hide-details
                      :model-value="price.price"
                      :suffix="defaultCurrency"
                      :rules="[
                        (v) => {
                          if (v) return true
                          return $t('enterRequiredField')
                        }
                      ]"
                      v-maska:[maskOptions]
                      @maska="
                        (ev) => {
                          price.price = parseFloat(ev.detail.unmasked || 0)
                          price.edited = true
                        }
                      "
                      variant="outlined"
                      :label="$t('price')"
                      density="compact"
                    />
                    <v-select
                      :label="$t('type')"
                      variant="outlined"
                      density="compact"
                      hide-details
                      v-model="price.type"
                      :items="productPriceTypes"
                    />
                    <v-tooltip bottom>
                      <template #activator="{ props }">
                        <v-btn
                          v-bind="props"
                          @click="() => (price.action = 2)"
                          icon="mdi mdi-arrow-u-right-bottom-bold"
                          variant="text"
                          color="info"
                        ></v-btn>
                      </template>
                      {{ $t('restore') }}
                    </v-tooltip>
                  </div>
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item v-if="type === 0" :value="2">
              <v-row class="align-start pa-2 pt-6">
                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details
                    type="number"
                    name="minOrder"
                    v-model="form.minOrder"
                    variant="outlined"
                    :label="$t('minOrder')"
                    density="compact"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    hide-details
                    type="number"
                    name="reorderPoint"
                    v-model="form.reorderPoint"
                    variant="outlined"
                    :label="$t('reorderPoint')"
                    density="compact"
                  />
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="3">
              <v-row class="align-start pa-2 pt-6">
                <v-col cols="12" md="6">
                  <v-text-field
                    type="number"
                    name="salesTax"
                    v-model="form.salesTax"
                    variant="outlined"
                    :label="$t('salesTax')"
                    density="compact"
                    suffix="%"
                    :rules="[(value) => value <= 100 || $t('invalidValue')]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    type="number"
                    name="purchaseTax"
                    v-model="form.purchaseTax"
                    variant="outlined"
                    :label="$t('purchaseTax')"
                    density="compact"
                    suffix="%"
                    :rules="[(value) => value <= 100 || $t('invalidValue')]"
                  />
                </v-col>
              </v-row>
            </v-window-item>
            <v-window-item :value="4">
              <v-row class="align-start pa-2 pt-6">
                <v-col cols="12">
                  <v-row class="d-flex">
                    <v-col cols="4">
                      <v-text-field
                        name="shopDisplayName"
                        v-model="form.shopDisplayName"
                        variant="outlined"
                        :label="$t('shopDisplayName')"
                        density="compact"
                        style="min-width: 170px"
                      />
                    </v-col>
                    <v-col cols="8">
                      <v-text-field
                        name="desc"
                        v-model="form.shopDescription"
                        variant="outlined"
                        :label="$t('desc')"
                        density="compact"
                        style="min-width: 220px"
                      />
                    </v-col>
                  </v-row>
                  <fieldset class="pishro-border mb-3">
                    <legend class="mx-auto px-2 text-grey">{{ $t('shopPosition') }}</legend>
                    <v-row>
                      <v-col
                        cols="12"
                        sm="6"
                        md="3"
                        lg="2"
                        v-for="item in shopPositions"
                        :key="item.value"
                      >
                        <v-checkbox
                          hide-details
                          :disabled="item.value != 1 && !form.shopPosition.includes(1)"
                          :label="item.title"
                          :value="item.value"
                          v-model="form.shopPosition"
                          color="primary"
                        />
                      </v-col>
                    </v-row>
                  </fieldset>
                  <fieldset class="pishro-border">
                    <legend class="mx-auto px-2 text-grey">{{ $t('productFeatures') }}</legend>
                    <v-row no-gutters class="d-flex justify-space-between align-center">
                      <v-col cols="12" md="8" class="d-flex justify-center align-center ga-4 pa-3">
                        <p>{{ $t('productFeatureTitle') }}</p>
                        <v-text-field
                          hide-details
                          name="feature"
                          v-model="newFeature"
                          variant="outlined"
                          density="compact"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-btn
                          @click="addFeature"
                          prepend-icon="mdi mdi-plus"
                          variant="flat"
                          color="primary"
                          height="40"
                          >{{ $t('add') }}</v-btn
                        >
                      </v-col>
                    </v-row>
                    <v-row
                      no-gutters
                      v-for="(feature, index) in form.features"
                      :key="index"
                      class="d-flex justify-space-between align-center"
                    >
                      <v-col cols="12" md="8" class="pa-3 d-flex align-top">
                        <span class="ml-1 text-grey mt-2" style="font-size: 12pt"
                          >{{ index + 1 }}.</span
                        >
                        <v-text-field
                          v-model="feature.title"
                          variant="outlined"
                          density="compact"
                          style="min-width: 170px"
                        />
                      </v-col>
                      <v-col cols="12" md="2" class="pa-3">
                        <v-btn
                          @click="removeFeature(feature)"
                          icon="mdi mdi-minus-circle"
                          variant="text"
                          color="error"
                          tabIndex="-1"
                        ></v-btn>
                      </v-col>
                    </v-row>
                  </fieldset>
                </v-col>
              </v-row>
            </v-window-item>
          </v-window>
          <v-row class="justify-end pa-4 pb-2" no-gutters>
            <v-btn type="submit" :prepend-icon="saveIcon" variant="flat" color="info">{{
              $t('save')
            }}</v-btn>
          </v-row>
        </v-row>
      </v-form>
    </v-card-text>
  </v-card>
  <v-dialog v-model="showImagesDialog" persistent width="500">
    <v-card>
      <v-card-title class="d-flex align-center mx-2">
        <v-icon color="primary" class="me-2 mr-3" icon="mdi-image-multiple" size="24" />
        <p class="font-weight-bold">{{ $t('productPictures') }}</p>
        <v-spacer></v-spacer>
        <v-btn icon="mdi-close" variant="text" @click="showImagesDialog = false"></v-btn>
      </v-card-title>
      <hr />

      <v-card-text>
        <v-row justify="center">
          <v-col cols="8">
            <v-card
              :class="['image-upload-card', { 'has-image': form.images[0]?.data }]"
              style="border: 2px dashed #e0e0e0; aspect-ratio: 1"
            >
              <div class="upload-area" @click="triggerImageUpload(0)" style="height: 100%">
                <input
                  type="file"
                  ref="imageInput0"
                  accept=".jpg,.jpeg,.png"
                  style="display: none"
                  @change="(event) => handleImageUpload(event, 0)"
                />
                <template v-if="form?.images[0]?.data">
                  <v-img
                    :src="`data:image/image/jpeg;base64,${form.images[0].data}`"
                    cover
                    height="100%"
                    class="upload-preview"
                  />
                  <div class="image-actions">
                    <v-btn
                      icon="mdi-delete"
                      variant="tonal"
                      color="error"
                      size="small"
                      @click.stop="removeImage(0)"
                    ></v-btn>
                  </div>
                </template>
                <template v-else>
                  <div
                    class="upload-placeholder d-flex flex-column align-center justify-center"
                    style="height: 100%"
                  >
                    <v-icon icon="mdi-image-plus" size="48" color="grey-darken-1"></v-icon>
                    <span class="mt-2">{{ $t('productMainPicture') }}</span>
                    <span class="text-caption text-grey">{{ $t('maximumImgSize5mb') }}</span>
                  </div>
                </template>
              </div>
            </v-card>
          </v-col>

          <v-col cols="12">
            <v-row justify="center">
              <v-col v-for="index in 3" :key="index" cols="12" sm="4" class="px-2">
                <v-card
                  :class="['image-upload-card', { 'has-image': form.images[index]?.data }]"
                  style="border: 2px dashed #e0e0e0; aspect-ratio: 1"
                >
                  <div class="upload-area" @click="triggerImageUpload(index)" style="height: 100%">
                    <input
                      type="file"
                      :ref="`imageInput${index}`"
                      accept=".jpg,.jpeg,.png"
                      style="display: none"
                      @change="(event) => handleImageUpload(event, index)"
                    />
                    <template v-if="form.images[index]?.data">
                      <v-img
                        :src="`data:image/image/jpeg;base64,${form.images[index].data}`"
                        cover
                        height="100%"
                        class="upload-preview"
                      />
                      <div class="image-actions">
                        <v-btn
                          icon="mdi-delete"
                          variant="tonal"
                          color="error"
                          size="small"
                          @click.stop="removeImage(index)"
                        ></v-btn>
                      </div>
                    </template>
                    <template v-else>
                      <div
                        class="upload-placeholder d-flex flex-column align-center justify-center"
                        style="height: 100%"
                      >
                        <v-icon icon="mdi-image-plus" size="32" color="grey-darken-1"></v-icon>
                        <span class="mt-1">{{ $t('image') }} {{ index + 1 }}</span>
                        <span class="text-caption text-grey">{{ $t('maximumImgSize5mb') }}</span>
                      </div>
                    </template>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="error" variant="text" @click="showImagesDialog = false">{{
          $t('cancel')
        }}</v-btn>
        <v-btn color="primary" @click="showImagesDialog = false" :disabled="!form.images[0]?.data">
          {{ $t('confirm') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { markRaw } from 'vue'
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default'
import imgResize2 from '../../../../plugins/imgResize2'
import productImgSrc from '../../../assets/images/product.png'
import switchButton from '../../../components/baseComponents/switchButton.vue'
import saleIcon from '../../../components/icons/Sale.vue'
import inventoryIcon from '../../../components/icons/Inventory.vue'
import generalInfoIcon from '../../../components/icons/ProductGeneralInfo.vue'
import taxIcon from '../../../components/icons/ProductTax.vue'
import saveIcon from '../../../components/icons/Save.vue'
import productService from '../../../../api/product/productService'
import warehouseService from '../../../../api/warehouse/warehouseService'
import groupSelect from '../../../components/accountsComponents/detailedAccountGroupSelect.vue'
import mixin from '../../../../plugins/mixins/default-mixin'
import imageCompression from 'browser-image-compression'
import currencyService from '../../../../api/currency/currencyService'
import mediaService from '../../../../api/media/mediaService'
import utils from '../../../../plugins/utils'

export default {
  mixins: [mixin],
  data() {
    return {
      showGroupDialog: false,
      productImgSrc: productImgSrc,
      saleIcon: markRaw(saleIcon),
      inventoryIcon: markRaw(inventoryIcon),
      generalInfoIcon: markRaw(generalInfoIcon),
      taxIcon: markRaw(taxIcon),
      saveIcon: markRaw(saveIcon),
      hasChange: false,
      isAutomateCode: true,
      type: 0,
      isEdit: false,
      _warehouses: [],
      warehouses: [],
      showImagesDialog: false,
      maxFileSize: 5 * 1024 * 1024, // 5MB
      targetFileSize: 100 * 1024, // 100KB
      newFeature: '',
      form: {
        parent: {
          title: '',
          id: null
        },
        parentDetailedAccountId: null,
        description: '',
        images: [
          { name: '', displayName: '', data: '', extension: '', type: 0, size: 0 },
          { name: '', displayName: '', data: '', extension: '', type: 0, size: 0 },
          { name: '', displayName: '', data: '', extension: '', type: 0, size: 0 },
          { name: '', displayName: '', data: '', extension: '', type: 0, size: 0 }
        ],
        features: [],
        shopPosition: [],
        title: '',
        shopDisplayName: '',
        shopDescription: '',
        code: '',
        salesTax: 0,
        purchaseTax: 0,
        minOrder: 0,
        reorderPoint: 0,
        salesPrice: 0,
        purchasePrice: 0,
        lowAmountAlert: true,
        status: 0,
        type: 0,
        onlineShopPosition: 0,
        stocks: [],
        allowedWarehouseIds: [],
        prices: [
          { price: 0, title: this.$t('salesPrice'), dateTime: new Date(), type: 0 },
          { price: 0, title: this.$t('purchasePrice'), dateTime: new Date(), type: 1 }
        ],
        units: [{ barcode: '', title: '', conversionFactor: 1, isDefault: true }]
      },
      maskOptions: {
        preProcess: (val) => val.replace(/[$,a-z,.,/,;,',\-,=,+,_,#,!,@,%,^,&,*,(,), ,`,\\]/g, ''),
        postProcess: (val) => {
          if (!val) return ''
          return Number.parseInt(val).toLocaleString()
        }
      },
      tab: 0,
      defaultCurrency: ''
    }
  },
  computed: {
    shopPositions() {
      return utils.showShopPositions()
    },
    productPriceTypes() {
      return [
        {
          title: this.$t('wholePrice'),
          value: 2
        },
        {
          title: this.$t('corporationPrice'),
          value: 3
        },
        {
          title: this.$t('others'),
          value: 4
        }
      ]
    },
    mainUnit: {
      get() {
        if (!this.form.units || this.form.units.length <= 0)
          this.form.units = [{ barcode: '', title: '', isDefault: true, conversionFactor: 1 }]
        return this.form.units?.find((u) => u.isDefault)
      },
      set(val) {
        val.isDefault = true
        this.form.units[0] = { ...val }
      }
    },
    mainImage() {
      return this.form.images[0]?.data || null
    },
    totalImages() {
      return this.form.images.filter((img) => img.data).length
    },
    imageCountText() {
      if (this.totalImages === 0) return this.$t('noImage')
      return `${this.totalImages} ${this.$t('image')}`
    }
  },
  methods: {
    ...mapActions(defaultStore, {
      setErrorMessage: 'setErrorMessage',
      setWarningDialog: 'setWarningDialog',
      closeWarning: 'closeWarning',
      closeAndRefreshTab: 'closeAndRefreshTab'
    }),
    // changeShopPosition(value) {
    //   if (!value.includes(1)) this.form.shopPosition = [0]
    // },
    getShopPositionsName(value) {
      return utils.showShopPositionName(value)
    },
    addFeature() {
      if (!this.newFeature.trim()) return
      this.form.features.push({ title: this.newFeature.trim() })
      this.newFeature = ''
    },
    removeFeature(index) {
      this.form.features.splice(index, 1)
    },
    addOtherPrice() {
      if (this.form.otherPrices)
        this.form.otherPrices.push({ title: '', type: 2, price: 0, dateTime: new Date() })
      else this.form.otherPrices = [{ title: '', type: 2, price: 0, dateTime: new Date() }]
    },
    addSubunit() {
      if (this.form.units)
        this.form.units.push({ title: '', conversionFactor: 0, isDefault: false })
    },
    removeSubunit(unit) {
      let idx = this.form.units.findIndex(
        (x) =>
          x.title === unit.title &&
          x.barcode === unit.barcode &&
          x.conversionFactor === unit.conversionFactor
      )
      if (idx > -1) this.form.units.splice(idx, 1)
    },
    attachImage() {
      this.$refs.image.click()
    },
    saveSelectParent(item) {
      if (item) {
        this.form.parent = {
          title: item.fName || item.name,
          id: item.id
        }
        this.form.parentDetailedAccount = { ...item }
        this.form.parentDetailedAccountId = item.id

        console.log(item)
        console.log(this.form)
      }
      this.showGroupDialog = false
    },
    validateImage(file) {
      if (!file) return false

      if (file.size > this.maxFileSize) {
        this.setErrorMessage(this.$t('imgSizeCantBeMoreThan5mb'))
        return false
      }
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!allowedTypes.includes(file.type)) {
        this.setErrorMessage(this.$t('onlyJpgJpegPngAllowed'))
        return false
      }
      return true
    },

    async compressImage(file) {
      if (file.size <= this.targetFileSize) {
        return file
      }

      const options = {
        maxSizeMB: this.targetFileSize / (1024 * 1024),
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }

      try {
        const compressedFile = await imageCompression(file, options)
        return compressedFile
      } catch (error) {
        return file
      }
    },
    async handleImageUpload(event, index) {
      const file = event.target.files[0]
      if (!this.validateImage(file)) return

      try {
        const compressedFile = await this.compressImage(file)
        const resizedImage = await imgResize2(compressedFile)

        this.form.images[index] = {
          id: this.form.images[index]?.id || null,
          name: file.name,
          displayName: file.name,
          data: resizedImage.split(',')[1],
          extension: file.name.split('.').pop(),
          type: 0,
          size: compressedFile.size,
          edited: true
        }
      } catch (error) {
        this.setErrorMessage(this.$t('errorUploadingImage'))
      }
    },
    removeImage(index) {
      this.form.images[index] = {
        id: this.form.images[index]?.id || null,
        name: '',
        displayName: '',
        data: '',
        extension: '',
        type: 0,
        size: 0
      }
    },
    triggerImageUpload(index) {
      const inputRef = this.$refs[`imageInput${index}`]
      if (inputRef) {
        ;(Array.isArray(inputRef) ? inputRef[0] : inputRef)?.click()
      }
    },
    async getAllWarehouses() {
      let res = await warehouseService.getAll(0, 1000)
      if (res.isSuccess) {
        this._warehouses = res.value?.result
        this.warehouses = this._warehouses.map((x) => {
          return { ...x, checked: this.form.allowedWarehouseIds?.includes(x.id) || false }
        })
      }
    },
    async uploadImage(value) {
      let file = value.target.files[0]
      let img = await imgResize2(file)

      this.form.imageBase64 = img
    },
    async save() {
      const isVal = await this.$refs.productForm.validate()
      if (isVal.valid) {
        // if (this.warehouses)
        //   this.setWarningDialog(
        //     true,
        //     this.$t('leaveFromPage'),
        //     this.$t('leaveFromPageAlert'),
        //     () => {
        //       this.closeWarning()
        //       this.addGroupDialog.show = false
        //     }
        //   )
        let request = {
          ...this.form,
          type: this.type,
          minOrder: +this?.form?.minOrder || 0,
          reorderPoint: +this?.form?.reorderPoint || 0,
          allowedWarehouseIds: this.warehouses?.filter((i) => i.checked)?.map((w) => w.id) || [],
          prices:
            this.form?.prices?.map((p) => ({ ...p, action: p?.id ? (p?.edited ? 2 : 0) : 1 })) ||
            [],
          images: this.form.images
            ?.filter((img) => img.data || img.id)
            ?.map((img, index) => ({
              ...img,
              action: img?.id ? (!img.data ? 3 : img?.edited ? 2 : 0) : 1,
              type: index
            })),
          features: this.form?.features?.map((f) => f.title) || [],
          units:
            this.form?.units?.map((u) => ({
              ...u,
              action: u?.id ? (u?.action == 3 ? 3 : 2) : 1
            })) || []
        }
        if (this.form?.otherPrices?.length > 0)
          request.prices = [
            ...this.form.prices,
            ...this.form.otherPrices?.map((p) => ({
              ...p,
              action: p?.id ? (p?.action == 3 ? 3 : 2) : 1
            }))
          ]
        request.code = this.form?.code ?? null
        if (this.isEdit) {
          await productService.update(request).then((res) => {
            if (res.isSuccess) {
              this.setErrorMessage(
                this.type == 0
                  ? this.$t('productEditedSuccessfully')
                  : this.$t('serviceEditedSuccessfully'),
                'success'
              )
              this.closeAndRefreshTab()
            } else this.setErrorMessage(res.message)
          })
        } else {
          await productService.create(request).then((res) => {
            if (res.isSuccess) {
              console.log(res)
              this.setErrorMessage(
                this.type == 0
                  ? this.$t('productCreatedSuccessfully')
                  : this.$t('serviceCreatedSuccessfully'),
                'success'
              )
              this.closeAndRefreshTab()
            } else this.setErrorMessage(res.message)
          })
        }
      }
    },
    async getById(id) {
      await productService.getById(id).then(async (res) => {
        if (res.isSuccess) {
          for (let index = 0; index < res.value?.images?.length; index++) {
            const img = res.value.images[index]
            const imgRes = await mediaService.getMedia(img.name)
            if (imgRes.data?.isSuccess) {
              img.data = imgRes.data?.value
            } else img.data = '.'
          }

          this.form = {
            ...res.value,
            parentDetailedAccountId: res.value?.detailedAccount?.parentId,
            detailedAccountId: res.value?.detailedAccount?.id,
            parent: {
              id: res.value?.parentDetailedAccount?.id,
              title: res.value?.parentDetailedAccount?.hierarchyName
            },
            otherPrices: res.value?.prices?.filter((p) => p.type != 0 && p.type != 1) || [],
            prices: res.value?.prices?.filter((p) => p.type == 0 || p.type == 1) || [],
            features: res.value?.features?.map((f) => ({ title: f }))
          }

          if (!res.value?.prices?.find((p) => p.type == 1))
            this.form?.prices.push({
              price: 0,
              title: this.$t('purchasePrice'),
              dateTime: new Date(),
              type: 1
            })
          if (!res.value?.prices?.find((p) => p.type == 0))
            this.form?.prices.push({
              price: 0,
              title: this.$t('salesPrice'),
              dateTime: new Date(),
              type: 0
            })
        } else this.setErrorMessage(res.message)
      })
    },
    async getCurrencies() {
      const res = await currencyService.getAll(1, 100)
      if (res.isSuccess) {
        const defaultC = res.value.result?.find((c) => c.setDefault)
        this.defaultCurrency = defaultC.name
      }
    }
  },
  watch: {
    isAutomateCode(value) {
      if (value == true) this.form.code = null
    }
  },
  async mounted() {
    this.isEdit = !this.currentActiveTab.tabName.toLowerCase().includes('new')
    if (this.isEdit) await this.getById(this.currentActiveTab.params.id)
    this.type = this.currentActiveTab.tabName.toLowerCase().includes('product') ? 0 : 1
    await this.getAllWarehouses()
    await this.getCurrencies()
  },
  components: {
    switchButton,
    groupSelect
  }
}
</script>

<style scoped>
.image-count-badge {
  margin-top: 8px;
  text-align: center;
  font-size: 0.85rem;
  padding: 4px 8px;
  border-radius: 12px;
  background-color: #f5f5f5;
  color: #757575;
  transition: all 0.3s ease;
}

.image-count-badge.has-images {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.image-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.image-upload-card {
  transition: all 0.3s ease;
}

.image-upload-card:hover {
  border-color: #1976d2 !important;
}

.image-upload-card.has-image {
  border-style: solid !important;
}

.upload-area {
  cursor: pointer;
  position: relative;
}

.upload-placeholder {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.image-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: none;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 4px;
}

.upload-area:hover .image-actions {
  display: block;
}

.upload-preview {
  border-radius: 4px;
}
</style>
