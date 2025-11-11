<template>
  <v-table>
    <thead>
      <tr>
        <th>{{ $t('userName') }}</th>
        <th>{{ $t('permissions') }}</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in users" :key="item.id">
        <td>{{ item.userName }}</td>
        <td>
          <v-btn
            prepend-icon="mdi mdi-security"
            color="info"
            size="small"
            variant="flat"
            :to="`/users/permissions/${item.id}`"
            >{{ $t('permissions') }}</v-btn
          >
        </td>
      </tr>
    </tbody>
  </v-table>
</template>

<script>
import UserService from '../../../api/user/userService'
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default.js'
export default {
  data() {
    return {
      users: []
    }
  },
  methods: {
    ...mapActions(defaultStore, { setErrorMessage: 'setErrorMessage' }),
    async getUsers() {
      UserService.getAll(1, 10000).then((resp) => {
        if (resp.isSuccess){ 
          this.users = resp.entities}
        else this.setErrorMessage(resp.message)
      })
    }
  },
  async mounted() {
    await this.getUsers()
  }
}
</script>

<style></style>
