import moment from 'moment'

let locale = localStorage.getItem('lang') ?? 'fa'
const highlight = function highlight(formatted, dateMoment) {
  let attributes = {}
  if (dateMoment.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
    attributes['class'] = 'is-today'
  }
  return attributes
}

let localeConfig = () => ({
  ar: {
    dow: 0,
    dir: 'rtl',
    displayFormat: (vm) => {
      switch (vm.type) {
        case 'date':
          return 'YYYY/MM/DD'
        case 'datetime':
          return 'YYYY/MM/DD HH:mm'
        case 'year':
          return 'YYYY'
        case 'month':
          return 'MM'
        case 'yearmonth':
          return 'YY/MM'
        case 'time':
          return 'HH:mm'
      }
    },
    lang: {
      label: 'AR',
      submit: 'اختيار',
      cancel: 'إلغاء',
      now: 'الآن',
      nextMonth: 'الشهر القادم',
      prevMonth: 'الشهر الماضي'
    }
  },
  en: {
    dow: 0,
    dir: 'ltr',
    lang: { label: 'Gregorian' },
    displayFormat: (vm) => {
      switch (vm.type) {
        case 'date':
          return 'MM/DD/YYYY'
        case 'datetime':
          return 'MM/DD/YYYY HH:mm'
        case 'year':
          return 'YYYY'
        case 'month':
          return 'MM'
        case 'yearmonth':
          return 'YY/MM'
        case 'time':
          return 'HH:mm'
      }
    }
  }
})

const datePickerConfig = {
  name: 'date-picker',
  props: {
    locale,
    highlight,
    localeConfig,
    clearable: true,
    appendTo: 'body',
    autoSubmit: false,
    color: 'rgb(var(--v-theme-datePicker))'
  }
}

const dateTimePickerConfig = {
  name: 'date-time-picker',
  props: {
    locale,
    highlight,
    localeConfig,
    clearable: true,
    autoSubmit: false,
    color: 'rgb(var(--v-theme-datePicker))',
    type: 'datetime'
  }
}

const timePickerConfig = {
  name: 'time-picker',
  props: {
    clearable: true,
    autoSubmit: true,
    color: 'rgb(var(--v-theme-datePicker))',
    type: 'time',
    format: 'HH:mm',
    displayFormat: 'HH:mm'
  }
}

export { datePickerConfig, dateTimePickerConfig, timePickerConfig }
