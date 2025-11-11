import { defaultStore } from '../src/stores/default'

export default {
  required_rule: (value) => !!value || 'تکمیل این فیلد الزامی می باشد',
  mobileNumber_rule: (value) => {
    const pattern = /^09[0-9'@s]{9,9}$/
    return value && !pattern.test(value) ? 'شماره موبایل را به درستی وارد نمایید' : true
  },
  fileBaseUrl: 'localhost:5000/files'
}

export function handleError(error, message) {
  console.error(error)
  const store = defaultStore()
  store.setNotice({
    message: !message ? 'متاسفانه خطایی رخ داده است' : message,
    type: 'error'
  })
}
export function handleSuccess(message) {
  const store = defaultStore()
  store.setNotice({
    message: !message ? 'عملیات با موفقیت انجام شد' : message,
    type: 'success'
  })
}

export function handleResult(response) {
  const store = defaultStore()
  if (response.isSuccess) {
    store.setNotice({
      message: response.message ? response.message : 'عملیات با موفقیت انجام شد',
      type: 'success'
    })
  } else {
    store.setNotice({
      message: response.message ? response.message : 'عملیات با شکست مواجه شد',
      type: 'error'
    })
  }
}
