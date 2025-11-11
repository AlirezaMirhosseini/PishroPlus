<template>
  <div :class="['d-flex', 'mb-4', isSend ? '' : 'receive-chat']">
    <v-avatar
      size="large"
      :color="isSend ? 'container' : 'primary'"
      :variant="isSend ? 'flat' : 'tonal'"
    >
      <span v-if="type == 0" :class="isSend ? 'text-grey' : ''">{{ companyName[0] + '.' }}</span>
      <v-icon v-else :icon="supportIcon" />
    </v-avatar>
    <div
      :class="[isSend ? 'bg-container' : 'bg-primary', isSend ? 'text-grey' : '', 'chat-bubble']"
    >
      <p class="d-flex flex-wrap">
        <span class="mx-1">{{ senderName }} </span><span class="mx-1"> | </span
        ><span class="pishro-caption mx-1">{{ senderRole }}</span>
      </p>
      <p class="my-2 chat-message-body" style="white-space: pre-wrap">
        {{ message }}
      </p>
      <template v-if="files?.length > 0">
        <v-divider />
        <v-chip v-for="file in files" :key="file.id" class="ma-2" color="#111111" variant="tonal">
          <v-icon>
            <div
              :class="['d-flex', 'file-icon', isSend ? 'text-grey' : 'text-white']"
              v-html="showIcon(file)"
            ></div>
          </v-icon>
          <a
            :class="['file-link', isSend ? 'text-grey' : 'text-white']"
            :href="baseUrl + '/' + file?.path"
            target="_blank"
            download
          >
            {{ file.displayName }}
          </a>
        </v-chip>
      </template>
    </div>
    <p class="pishro-caption textgrey align-self-end ma-2 show-date" dir="rtl">
      {{ showDate(dateTime) }}
    </p>
  </div>
</template>

<script>
import { markRaw } from 'vue'
import supportIcon from '../icons/Unit-TechSupport.vue'
import utils from '../../../plugins/utils'
import { getIcon } from 'material-file-icons'
// import baseUrl from '../../assets/baseUrl.json'
export default {
  data() {
    return {
      supportIcon: markRaw(supportIcon),
      baseUrl:import.meta.env.MODE ==='development' ? import.meta.env.VITE_BASE_URL_DEV : import.meta.env.VITE_BASE_URL_PRO
    }
  },
  props: {
    files: {
      required: false
    },
    dateTime: {
      required: true
    },
    companyName: {
      required: false
    },
    type: {
      required: true
    },
    isSend: {
      required: true
    },
    message: {
      required: false
    },
    senderName: {
      required: true
    },
    senderRole: {
      required: false
    }
  },
  methods: {
    testSet() {
      var ele = Array.from(document.getElementsByClassName('file-icon'))
      ele.forEach((item) => {
        var path = item.getElementsByTagName('path')[0]
        path.setAttribute('fill', 'currentColor')
      })
    },
    showDate(date) {
      return utils.showDate(date, true, false, false, true)
    },
    showIcon(file) {
      return getIcon(file.displayName).svg
    }
  },
  mounted() {
    this.testSet()
  }
}
</script>

<style>
.v-locale--is-rtl .chat-message-body {
  direction: rtl;
}

.chat-message-body {
  direction: ltr;
}

.file-link {
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  max-width: 100px;
}

.chat-bubble {
  border-radius: 5px;
  margin-inline-start: 5px;
  margin-top: 10px;
  padding: 10px;
  max-width: 400px;
  padding-block-end: 0;
}

.v-locale--is-rtl .receive-chat {
  align-self: flex-end;
  direction: ltr;
}

.receive-chat {
  direction: rtl;
}

@media only screen and (max-width: 600px) {
  .show-date {
    writing-mode: vertical-rl;
  }
}
</style>
