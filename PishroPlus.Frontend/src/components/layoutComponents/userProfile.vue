<template>
    <div class="mr-3">
        <v-card-title>{{ this.$t('edit') }}</v-card-title>
    </div>
    <v-text-field variant="outlined" :label="$t('name')" class="ma-3" v-model="entity.firstName" />
    <v-text-field variant="outlined" :label="$t('lastName')" class="ma-3" v-model="entity.lastName" />
    <v-text-field variant="outlined" :label="$t('phoneNumber')" class="ma-3" v-model="entity.phoneNumber" />
    <!-- <div style=" direction: ltr;" class="mb-2 ml-3" @click="saveEditProfileChanges"> -->
    <v-btn color="primary" width="100px" @click="saveData">{{ this.$t('save') }}</v-btn>
    <!-- </div> -->
    <v-dialog close-on-back persistent v-model="edit" width="600px" max-width="100%">
        <v-card class="pa-2">
            <div class="ms-auto d-flex justify-space-between " style="width:100%;">
                <!-- <div class="float-right"> -->
                    <p class="d-flex align-center">{{ $t('userProfileSuccessMessage') }}</p>
                <!-- </div> -->
                <v-btn color="grey" icon="mdi mdi-close" @click="this.edit = false" variant="text" />
            </div>
        </v-card>
    </v-dialog>
</template>
<script>
import { mapActions, mapState } from 'pinia'
import { defaultStore } from '../../stores/default'
export default {
    data() {
        return {
            // userData: JSON.parse(localStorage.getItem('userData')),
            entity: { ...this.userData },
            userName: '',
            edit: false
        }
    },
    computed: {
        ...mapState(defaultStore, {
            userData: 'userData'
        }),
    },
    methods: {
        ...mapActions(defaultStore, {
            setUserData: 'setUserData'
        }),
        saveData() {
            // console.log(this.entity);
            // localStorage.setItem('userData', JSON.stringify(this.entity))
            this.setUserData(this.entity)
            this.edit = true
        }
    },
    mounted() {
        // console.log(this.entity, this.userData);
        this.entity = { ...this.userData }
    }
    //   mounted() {
    //     this.userName=localStorage.getItem('userName')
    //     this.phoneNumber=localStorage.getItem('password')
    //     console.log( this.phoneNumber)
    //   },
}
</script>