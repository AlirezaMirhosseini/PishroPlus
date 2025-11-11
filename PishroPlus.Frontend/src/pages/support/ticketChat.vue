<template>
  <v-card class="d-flex flex-column" style="height: calc(100% - 40px)">
    <v-card-title>
      <v-row class="justify-space-between mx-4 pb-4 mb-4" no-gutters style="border-bottom: 1px solid #e0e0e0">
        <div>
          <v-row class="align-center" no-gutters>
            <v-card-title style="font-weight: bold">{{ ticket?.title }}</v-card-title>
            <v-btn @click="refreshData" class="ms-4" prepend-icon="mdi mdi-refresh" variant="text" color="info">{{
              $t('refresh') }}</v-btn>
          </v-row>
          <span :class="'text-' + getStatus(ticket?.status).color">&#9679; {{ getStatus(ticket?.status).text }}</span>
          <p>{{ isTyping ? typingText : '' }}</p>
        </div>
        <div class="d-flex flex-column justify-space-evenly">
          <span class="text-grey"> {{$t('createDateTime') }}: {{ getDate(ticket?.createDateTime) }}</span>
          <span class="text-grey"> {{$t('ticketCode') }} : {{ this.currentActiveTab.params.code }}</span>
        </div>
      </v-row>
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-space-between h-0 px-1">
      <div id="chat-container" class="chat-container">
        <chat-bubble v-for="message in ticket?.messages" :key="message.id" :message="message.text"
          :isSend="message.type == 0" :sender-name="message.userFullName" :type="message.type"
          :company-name="ticket?.companyName" :dateTime="message?.dateTime" :files="message?.files" />
      </div>
      <div>
        <v-form v-if="ticket?.status != 3" @submit.prevent="send" ref="sendTicketForm">
          <attachable-text v-model:text="text" v-model:files="files" @send="send" :isInForm="true" />
        </v-form>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapActions } from 'pinia'
import { defaultStore } from '../../stores/default'
import utils from '../../../plugins/utils'
import chatBubble from '../../components/ticketComponents/ticketChatBubble.vue'
import TicketService from '../../../api/ticket/ticketService'
import attachableText from '../../components/baseComponents/attachableText.vue'
import connection from '../../../plugins/signalR.js'

export default {
  data() {
    return {
      text: null,
      files: null,
      ticket: null,
      typingTimeout: null,
      isTyping: false,
      userId:JSON.parse(localStorage.getItem('userData')).id,
      typingText:''
    }
  },
  watch: {
    text(val) {
      if (this.typingTimeout) {
        clearTimeout(this.typingTimeout)
      }
      this.typingTimeout = setTimeout(() => {
        connection.invoke("IsTyping", this.userId);
      }, 500)
    }
  },
  methods: {
    callTyping() {
      connection.invoke("IsTyping", 'true');
    },
    ...mapActions(defaultStore, {
      setPageTitle: 'setPageTitle',
      setErrorMessage: 'setErrorMessage'
    }),
    async refreshData() {
      await this.getTicket()
      setTimeout(() => {
        this.scrollToBottom()
      }, 500)
    },
    scrollToBottom() {
      var element = document.getElementById('chat-container')
      element.scrollTop = element.scrollHeight
    },
    getDate(date) {
      return utils.showDate(date)
    },
    getStatus(status) {
      return utils.showTicketStatus(status)
    },
    async send() {
      const { valid } = await this.$refs.sendTicketForm.validate()
      if (valid) {
        await this.reply()
      }
    },
    async getTicket() {
      await TicketService.getById(this.currentActiveTab.params.id).then((res) => {
        if (res.isSuccess) {
          res.entity?.messages?.reverse()
          this.ticket = res.entity
        } else this.setErrorMessage(res.message)
      })
    },
    async reply() {
      await TicketService.reply(0, {
        entity: {
          id: this.ticket.id,
          files: this.files?.map((a) => ({ name: a.name, type: 3, fileBase64: a.base64 })),
          message: this.text
        }
      }).then((res) => {
        if (res.isSuccess) {
          this.files = null
          this.text = null
          this.refreshData()
        } else this.setErrorMessage(res.message)
      })
    }
  },
  async mounted() {
    var userName=
    connection.on("isTyping", (user) => {
      if (user == this.userId) {
        this.typingText= `${this.$t('isTyping')}...`
        this.isTyping = true
        let to = setTimeout(() => {
          this.isTyping = false
        }, 2000);
      }

    });
    var title = this.$t('ticket') + ' ' + this.currentActiveTab.params.code
    document.title = title
    this.setPageTitle(title)
    await this.refreshData()
  },
  components: {
    chatBubble,
    attachableText
  }
}
</script>

<style>
.chat-container {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  padding-inline: 1rem;
  scroll-behavior: smooth;
}
</style>
<!-- <template>
  <div>
    <input v-model="message" placeholder="Enter message" />
    <button @click="sendMessage">Send</button>
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
  </div>
</template>

<script>
import connection from '../../../plugins/signalR.js';

export default {
  data() {
    return {
      message: '',
      messages: []
    };
  },
  mounted() {
    console.log(connection.state);
    connection.on("ReceiveMessage", (user, message) => {
      console.log(`${user}: ${message}`);
      this.messages.push(`${user}: ${message}`);
    });
  },
  methods: {
    sendMessage() {
      console.log(connection.state);
      connection.invoke("CallBack", "User")
        .catch(err => console.error("Error invoking callback:", err));
      this.message = '';
    }
  }
};
</script> -->
