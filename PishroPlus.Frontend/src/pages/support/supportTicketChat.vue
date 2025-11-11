<template>
  <v-card class="d-flex flex-column" style="height: calc(100% - 40px)">
    <v-card-title>
      <v-row
        class="justify-space-between mx-4 pb-4 mb-4"
        no-gutters
        style="border-bottom: 1px solid #e0e0e0"
      >
        <div>
          <v-row class="align-center" no-gutters>
            <v-card-title style="font-weight: bold">{{ ticket?.title }}</v-card-title>
            <v-btn
              @click="refreshData"
              class="ms-4"
              prepend-icon="mdi mdi-refresh"
              variant="text"
              color="info"
              >{{ $t('refresh') }}</v-btn
            >
          </v-row>
          <span :class="'text-' + getStatus(ticket?.status).color"
            >&#9679; {{ getStatus(ticket?.status).text }}</span
          >
          <v-btn
            v-if="ticket?.status != 3"
            @click="ChangeStatus(1)"
            class="ms-4"
            variant="tonal"
            color="warning"
            >{{ $t('waitingForReview') }}</v-btn
          >
          <v-btn
            v-if="ticket?.status != 3"
            @click="ChangeStatus(3)"
            class="ms-4"
            variant="tonal"
            color="error"
            >{{ $t('closeTicket') }}</v-btn
          >
        </div>
        <div class="d-flex flex-column justify-space-evenly">
          <span class="text-grey">تاریخ ایجاد: {{ getDate(ticket?.createDateTime) }}</span>
          <span class="text-grey">شماره تیکت: {{ this.currentActiveTab.params.code }}</span>
        </div>
      </v-row>
    </v-card-title>
    <v-card-text class="d-flex flex-column justify-space-between h-0 px-1">
      <div id="chat-container" class="chat-container">
        <chat-bubble
          v-for="message in ticket?.messages"
          :key="message.id"
          :message="message.text"
          :isSend="message.type == 1"
          :sender-name="message.userFullName"
          :type="message.type"
          :company-name="ticket?.companyName"
          :dateTime="message?.dateTime"
          :files="message?.files"
        />
      </div>
      <div>
        <v-form v-if="ticket?.status != 3" @submit.prevent="send" ref="sendTicketForm">
          <attachable-text
            v-model:text="text"
            v-model:files="files"
            @send="send"
            :isInForm="true"
          />
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

export default {
  data() {
    return {
      text: null,
      files: null,
      ticket: null
    }
  },
  methods: {
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
    async ChangeStatus(status) {
      await TicketService.changeStatus({ entity: { id: this.ticket.id, status: status } }).then(
        (res) => {
          if (res.isSuccess) {
            this.getTicket()
          } else this.setErrorMessage(res.message)
        }
      )
    },
    async reply() {
      await TicketService.reply(1, {
        entity: {
          id: this.ticket.id,
          files: this.files?.map((a) => ({ name:a.name, type: 3, fileBase64: a.base64 })),
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
