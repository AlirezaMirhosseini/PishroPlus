<template>
    <v-card>
        <v-row no-gutters>
            <v-col cols="12" class="mt-5 mr-5">
                <v-btn @click="()=>isOpen=!isOpen" variant="tonal" color="info">{{ isOpen ? $t('closeAll') :
                    $t('openAll') }}</v-btn>
            </v-col>
            <v-col cols=12>
                <div class="header">
                    <span>{{ $t('accountingTreeView') }}</span>
                    <span style="float: left;">{{ $t('profitAndLoss') }}</span>
                </div>
                <v-treeview :items="plList" v-if="plList.length > 0" item-value="id" :open-all="isOpen?true:false">
                    <template v-slot:title="{ item }">
                        <span> {{ item.title }} </span>
                        <span v-bind:style="{ color: item.balance > 0 ? 'green' : item.balance < 0 ? 'red' : 'gray' }"
                            style="float: left;">
                            <v-icon v-if="item.balance != 0" :color="item.balance > 0 ? 'green' : 'red'"
                                :icon="item.balance > 0 ? 'mdi-chevron-up' : 'mdi-chevron-down'" size="20"></v-icon>
                            {{ item.balance.toLocaleString() }}
                        </span>
                    </template>
                </v-treeview>
            </v-col>
            <v-col cols="12">
                <div class="result"
                    v-bind:style="{ backgroundColor: this.result > 0 ? 'rgb(225, 255, 225)' : this.result < 0 ? 'rgb(238, 198, 198)' : 'rgb(226, 226, 226)' }">
                    <div v-bind:style="{ color: this.result > 0 ? 'green' : this.result < 0 ? 'red' : 'gray' }">
                        <span>{{ $t('profit') }}</span>
                        <span style="float: left;padding-left: 10px;">{{ this.result }}</span>
                    </div>
                </div>
            </v-col>
        </v-row>
    </v-card>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../../stores/default.js'
import accountReportService from '../../../../api/accountReport/accountReportService'
export default {
    data() {
        return {
            plList: [],
            isOpen: true,
            result: null,
        }
    },
    methods: {
        ...mapActions(defaultStore, { setErrorMessage: 'setErrorMessage' }),
        async getAllPLReportItems() {
            await accountReportService.getPLReport().then((resp) => {
                if (resp.isSuccess) {
                    this.plList = [...resp.entities]

                    const setTitle = (item) => {
                        item.title = item.account?.name
                        item.id = item.account?.id
                        if (item.children.length > 0) {
                            item.children.forEach(it => {
                                setTitle(it)
                            });
                        } else {
                            delete item.children
                        }
                    }
                    this.plList.forEach(item => {
                        setTitle(item)
                    });
                    //

                    
                    
                    this.result = this.plList[0].balance
                }
                else this.setErrorMessage(resp.message)
            })
        },
       
    },
    async mounted() {
        await this.getAllPLReportItems()
    },
}
</script>
<style scoped>
.header {
    background-color: rgb(226, 226, 226);
    padding: 5px;
    margin-top: 15px;
    padding-right: 20px;
    color: gray
}

.result {
    padding: 5px;
    margin: 15px 0px;
    padding-right: 20px;
}
</style>