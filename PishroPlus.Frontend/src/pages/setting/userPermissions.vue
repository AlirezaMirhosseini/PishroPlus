<template>
  <v-card elevation="0">
    <v-card-text>
      <tree-view v-model="newList"> </tree-view>
    </v-card-text>
  </v-card>
  <v-btn class="save-btn" color="primary" @click="submit" :prepend-icon="saveIcon">{{
    $t('save')
  }}</v-btn>
  <v-btn
    class="save-btn reset-btn"
    color="warning"
    @click="getAllData"
    prepend-icon="mdi mdi-refresh"
    >{{ $t('reset') }}</v-btn
  >
</template>

<script>
import { markRaw } from 'vue'
import UserService from '../../../api/user/userService'
import PermissionService from '../../../api/permission/permissionService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default.js'
import treeView from '../../components/baseComponents/Treeview/treeview.vue'
import saveIcon from '../../components/icons/Save.vue'

export default {
  data() {
    return {
      allPermissions: [],
      userPermissions: [],
      requestPermissions: [],
      newList: [],
      saveIcon: markRaw(saveIcon)
    }
  },
  methods: {
    ...mapActions(defaultStore, { setErrorMessage: 'setErrorMessage' }),
    async submit() {
      this.checkChildren(this.newList[0])
      UserService.updatePermissions({
        entity: { userId: this.currentActiveTab.params.userId, permissions: this.requestPermissions }
      }).then((resp) => {
        this.requestPermissions = []
        this.getAllData()
        if (resp.isSuccess) {
          this.setErrorMessage(resp.message, 'success')
        } else this.setErrorMessage(resp.message)
      })
    },
    checkChildren(list) {
      list.children.forEach((item) => {
        if (item.checked) this.requestPermissions.push(item.id)
        if (item.children?.length > 0) this.checkChildren(item)
      })
    },
    arrangeItems(list) {
      list.forEach((item) => {
        item.hasCheckBox = true
        item.checked = this.userPermissions.includes(item.id)
        item.title = item.displayName
        item.draggable = false
        item.open = true
        item.children = list.filter((a) => a.parentId === item.id)
      })
      return list.filter((x) => !x.parentId)
    },
    async getAllData() {
      await this.getUserPermissions()
      this.getAllPermissions()
    },
    async getUserPermissions() {
      var res = await UserService.getAllPermissions(this.currentActiveTab.params.userId)
      if (res.isSuccess) {
        this.userPermissions = res.entities.map((x) => x.id)
      } else this.setErrorMessage(res.message)
    },
    async getAllPermissions() {
      await PermissionService.getAll().then((resp) => {
        if (resp.isSuccess) {
          this.allPermissions = [...resp.entities]
          this.allPermissions = this.arrangeItems(this.allPermissions)
          this.newList = [
            {
              id: '1',
              hasCheckBox: true,
              checked: this.allPermissions.every((a) => a.checked) ? true : false,
              title: this.$t('permissions'),
              draggable: false,
              open: true,
              children: this.allPermissions
            }
          ]
        } else this.setErrorMessage(resp.message)
      })
    }
  },
  async mounted() {
    await this.getAllData()
  },
  components: {
    treeView
  }
}
</script>

<style scoped>
.save-btn {
  position: fixed;
  bottom: 105px;
  right: 20px;
  left: unset;
  transition: all 0.3s ease;
}

.v-locale--is-rtl .save-btn {
  left: 20px;
  right: unset;
}

.reset-btn {
  bottom: 60px;
}

@media only screen and (max-width: 960px) {
  .save-btn {
    bottom: 55px;
    right: 30px;
    left: unset;
  }

  .v-locale--is-rtl .save-btn {
    left: 30px;
    right: unset;
  }

  .reset-btn {
    bottom: 10px;
  }
}
</style>
