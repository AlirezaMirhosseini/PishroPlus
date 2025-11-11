<template>
  <div
    :class="[
      'right-menu',
      'bg-surface',
      'elevation-2',
      isMenuExpanded ? 'right-menu-expanded' : '',
      isMenuHide ? 'right-menu-hide' : ''
    ]"
  >
    <v-btn
      class="d-none d-md-flex"
      :icon="menuIcon"
      @click="$emit('openMenu')"
      variant="text"
      color="grey"
    ></v-btn>
    <v-btn
      class="d-flex d-md-none back-chevron"
      icon="mdi-chevron-down"
      @click="$emit('hideMenu')"
      variant="text"
      color="grey"
    ></v-btn>
    <div
      @click="toggleCompanyDetails"
      class="right-menu-user d-flex justify-space-between align-center"
    >
      <div class="d-flex flex-column">
        <p>{{ companyDetails.n }}</p>
        <p class="pishro-caption">{{ $t('appCode') }}: {{ companyDetails.c }}</p>
      </div>
      <v-icon
        class="me-8"
        icon="mdi mdi-chevron-down"
        :style="[
          'transition:0.3s ease',
          showCompanyDetails ? 'transform:rotate(180deg)' : 'transform:rotate(0deg)'
        ]"
      />
    </div>
    <v-expand-transition>
      <div v-if="showCompanyDetails && isMenuExpanded" class="company-details">
        <div
          class="d-flex flex-column ps-2"
          style="row-gap: 4px; border-inline-start: 1px solid rgb(var(--v-theme-primary))"
        >
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center">
              <v-icon size="x-small" :icon="assetIcon" color="androidTopBar" />
              <p class="pishro-caption text-androidTopBar ms-2">
                {{ $t('subscriptionEnd') }} : 245 {{ $t('day') }}
              </p>
            </div>
            <div class="text-left">
              <v-btn
                icon="mdi-pencil"
                style="cursor: pointer"
                to="/userProfile"
                variant="text"
              ></v-btn>
            </div>
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-small" :icon="personIcon" color="grey" />
            <p class="pishro-caption text-grey ms-2">{{ $t('usersCount') }} : 5</p>
          </div>
          <div class="d-flex align-center">
            <v-icon size="x-small" :icon="calendarIcon" color="grey" />
            <p class="pishro-caption text-grey ms-2">
              {{ $t('lastLogin') }} : {{ showPersinDate(new Date()) }}
            </p>
          </div>
          <div class="d-flex align-center">
            <!-- {{ userData }} -->
            <p class="pishro-caption text-grey">{{ $t('user') }}:{{ companyDetails?.d }}</p>
          </div>
          <div class="d-flex align-center">
            <p class="pishro-caption text-grey">
              {{ $t('phoneNumber') }}: {{ userData?.phoneNumber }}
            </p>
          </div>
        </div>
      </div>
    </v-expand-transition>
    <v-text-field
      class="mx-2 mt-4 right-menu-search flex-grow-0"
      :placeholder="$t('search') + ' (' + $t('ctrlF') + ')'"
      ref="layoutSearchRef"
      @update:modelValue="($event) => $emit('changeSearch', $event)"
      hide-details
      variant="outlined"
      density="compact"
      prepend-inner-icon="mdi mdi-magnify"
      :style="`transform:scaleX(${isMenuExpanded ? 1 : 0})`"
    />
    <div class="right-menu-items">
      <div
        @click="itemClicked(item)"
        :class="[
          'right-menu-item',
          selectedItem?.id === item.id ? 'right-menu-item-selected' : '',
          this.currentActiveTab.path == item.link ? 'right-menu-item-selected' : '',
          hasMatchingPath(item?.items) ? 'right-menu-item-selected' : ''
        ]"
        v-for="item in menuItems.filter((a) => a.id != -1)"
        :key="item.id"
      >
        <v-btn
          :id="`menu-button-${item.id}`"
          :icon="item.icon"
          variant="text"
          :color="
            selectedItem?.id === item.id ||
            this.currentActiveTab.path == item.link ||
            hasMatchingPath(item?.items)
              ? 'surface'
              : 'grey'
          "
        />
        <p class="right-menu-item-text">{{ item.title }}</p>
        <v-icon
          v-if="item.items"
          class="chevron-ico"
          icon="mdi-chevron-down"
          size="small"
          :color="
            selectedItem?.id === item.id ||
            this.currentActiveTab.path == item.link ||
            hasMatchingPath(item?.items)
              ? 'surface'
              : 'grey'
          "
        />
      </div>
    </div>
    <v-spacer class="flex-grow-0"></v-spacer>
    <div
      @click="itemClicked(item)"
      v-for="item in menuItems.filter((a) => a.id == -1)"
      :key="item.id"
      :class="[
        'right-menu-item',
        selectedItem?.id === item.id ? 'right-menu-item-selected' : '',
        this.currentActiveTab.path == item.link ? 'right-menu-item-selected' : '',
        hasMatchingPath(item?.items) ? 'right-menu-item-selected' : ''
      ]"
    >
      <v-btn
        :icon="item.icon"
        variant="text"
        :color="
          selectedItem?.id === item.id ||
          this.currentActiveTab.path == item.link ||
          hasMatchingPath(item?.items)
            ? 'surface'
            : 'grey'
        "
      ></v-btn>
      <p class="right-menu-item-text">{{ item.title }}</p>
      <v-icon
        v-if="item.items"
        class="chevron-ico"
        icon="mdi-chevron-down"
        size="small"
        :color="
          selectedItem?.id === item.id ||
          this.currentActiveTab.path == item.link ||
          hasMatchingPath(item?.items)
            ? 'surface'
            : 'grey'
        "
      />
    </div>
    <div @click="$emit('logout')" class="right-menu-item">
      <v-btn icon="mdi-power" variant="text" color="grey"></v-btn>
      <p class="right-menu-item-text">{{ this.$t('logout') }}</p>
    </div>
  </div>
  <!-- <v-dialog v-model="editProfile" persistent width="600px">
    <v-card>
     <div class=""> 
        <div class="d-flex justify-space-between">
          <div class="mr-3">
            <v-card-title>{{ this.$t('edit') }}</v-card-title>
          </div>
          <v-btn color="grey" icon="mdi mdi-close" @click="this.editProfile = false" variant="text" />
        </div>
      </div> 
      <v-text-field variant="outlined" :label="$t('name')" class="ma-3" />
      <v-text-field variant="outlined" :label="$t('lastName')" class="ma-3" />
      <v-text-field variant="outlined" :label="$t('phoneNumber')" class="ma-3" v-model=" userData.phoneNumber ">  </v-text-field>
      <div style=" direction: ltr;" class="mb-2 ml-3" @click="saveEditProfileChanges">
      <v-btn color="primary" width="100px">{{ this.$t('save') }}</v-btn>
    </div>
    </v-card>
  </v-dialog> -->
</template>

<script>
import { markRaw } from 'vue'
import assetIcon from '../../components/icons/Asset.vue'
import personIcon from '../../components/icons/Person.vue'
import calendarIcon from '../../components/icons/Calendar.vue'
import utils from '../../../plugins/utils'
import userService from '../../../api/user/userService.js'
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../stores/default'
export default {
  data() {
    return {
      // userData:JSON.parse(localStorage.getItem('userData')),
      editProfile: false,
      showCompanyDetails: false,
      assetIcon: markRaw(assetIcon),
      personIcon: markRaw(personIcon),
      calendarIcon: markRaw(calendarIcon)
    }
  },

  props: {
    isMenuExpanded: {
      required: true
    },
    isMenuHide: {
      required: true
    },
    menuIcon: {
      required: true
    },
    companyDetails: {
      required: true
    },
    menuItems: {
      required: true
    },
    selectedItem: {
      required: true
    }
  },
  emits: ['openMenu', 'hideMenu', 'closeMenu', 'selectItem', 'logout', 'changeSearch'],
  computed: {
    ...mapState(defaultStore, {
      userData: 'userData',
      recentTabs: 'recentTabs'
    })
  },
  methods: {
    ...mapActions(defaultStore, {
      loadRecentTabs: 'loadRecentTabs',
      setActiveTab: 'setActiveTab'
    }),
    hasMatchingPath(items) {
      if (!items || items?.length == 0) return false
      return items.some((item) => {
        // Check if current item's link matches
        if (item.link === this.currentActiveTab.path) {
          return true
        }

        if (item.items && item.items.length > 0) {
          return this.hasMatchingPath(item.items)
        }

        return false
      })
    },
    itemClicked(item) {
      this.$emit('selectItem', item)
      if (item.link == '/') this.setActiveTab(0)
      else if (item.link && item.link.length > 0) this.$router.push(item.link)
    },
    toggleCompanyDetails() {
      this.showCompanyDetails = !this.showCompanyDetails
    },
    showPersinDate(date) {
      return utils.showDate(date, true, false, false, false)
    },
    onkeydown(e) {
      if (e.code == 'KeyF' && e.ctrlKey) {
        e.preventDefault()
        if (!this.$refs.layoutSearchRef?.focused) {
          if (!this.isMenuExpanded) this.$emit('openMenu')
          this.$refs.layoutSearchRef.focus()
        }
      }
    }
    // async userData(){
    //   await userService.login().then((res) => {
    //     if (res.isSuccess) {
    //       console.log(res)
    //       this.userDetails.userName = res.entity.userName
    //       this.userDetails.phoneNumber=res.entity.phoneNumber
    //     } else this.setErrorMessage(res.message)
    //   })
    // }
  },
  mounted() {
    window.addEventListener('keydown', this.onkeydown)
    // await this.getAllData()
    // this.userName=localStorage.getItem('userName')
    // this.phoneNumber=localStorage.getItem('password')
    this.loadRecentTabs()
    if (!this.recentTabs || this.recentTabs?.length == 0) {
      if (!this.$refs.layoutSearchRef?.focused) {
        if (!this.isMenuExpanded) this.$emit('openMenu')
        this.$refs.layoutSearchRef.focus()
      }
    }
  },
  unmounted() {
    window.removeEventListener('keydown', this.onkeydown)
  }
}
</script>

<style>
#menu-button-4 i,
#menu-button-4 svg {
  width: 30px !important;
}
</style>
