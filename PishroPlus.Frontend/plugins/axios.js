import axios from 'axios'
import Auth from './auth'
import router from './router'
import { defaultStore } from '../src/stores/default'

const lang = localStorage?.getItem('lang') ?? 'fa'
const errorMessage = lang === 'fa' ? 'خطا در برقراری ارتباط' : 'connection error'
const badRequestMessage = lang === 'fa' ? 'خطا در درخواست ارسالی' : 'خطا در درخواست ارسالی'
const authErrorMessage = lang === 'fa' ? 'خطا در اعتبار سنجی' : 'authorization error'
const permissionErrorMessage =
  lang === 'fa' ? 'شما دسترسی لازم را ندارید' : 'you dont have permission'

export function createAxiosInstance(baseURL) {
  const instance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Accept-Language': lang
    }
  })

  instance.interceptors.request.use(
    function (config) {
      const store = defaultStore()

      if (!store.skipLoading) {
        store.setLoading(true)
      }

      const token = Auth.getToken()
      const fp = Auth.getFP()
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`
        config.headers['FP-Id'] = fp
      }

      return config
    },
    function (error) {
      const store = defaultStore()
      store.setLoading(false)
      store.setErrorMessage(errorMessage)
      return Promise.reject(error)
    }
  )

  instance.interceptors.response.use(
    (response) => {
      const store = defaultStore()
      store.setLoading(false)
      if (response.status == 204 && !response.data) {
        return {
          data: {
            isSuccess: true
          }
        }
      }
      return response
    },
    (error) => {
      console.log(error)

      const store = defaultStore()
      store.setLoading(false)
      store.setErrorMessage(errorMessage)

      if (error.response) {
        if (error.response.status === 401) {
          store.setErrorMessage(authErrorMessage)
          Auth.logOut()
          router.push('/login')
        } else if (error.response.status === 400) {
          store.setErrorMessage(error.response?.data?.errors[0]?.message || badRequestMessage)
        } else if (error.response.status === 403) {
          store.setErrorMessage(error.response?.data?.errors[0]?.message)
        } else if (error.response.status === 500) {
          store.setErrorMessage(
            error.response?.data?.errors?.length > 0
              ? error.response.data?.errors[0]?.message
              : errorMessage
          )
        } else if (error.response.status === 503) {
          router.push('/503')
        }
        store.setErrorMessage(error.response?.data?.errors[0]?.message || badRequestMessage)
      }
      return error
    }
  )

  return instance
}

// import axios from 'axios'
// import Auth from './auth'
// import router from './router'
// import { defaultStore } from '../src/stores/default'
// // import baseUrl from '../src/assets/baseUrl.json'

// const lang = localStorage?.getItem('lang') ?? 'fa'
// const errorMessage = lang === 'fa' ? 'خطا در برقراری ارتباط' : 'connection error'
// const authErrorMessage = lang === 'fa' ? 'خطا در اعتبار سنجی' : 'authorization error'
// const permissionErrorMessage =
//   lang === 'fa' ? 'شما دسترسی لازم را ندارید' : 'you dont have permission'
// axios.interceptors.request.use(
//   function (config) {
//     // show loading while sending request
//     const store = defaultStore()
//     store.setLoading(true)
//     return config
//   },
//   function (error) {
//     // hide loading while request done
//     const store = defaultStore()
//     store.setLoading(false)
//     store.setErrorMessage(errorMessage)
//     // console.error(error.toJSON())
//     return Promise.reject(error)
//   }
// )
// axios.interceptors.response.use(
//   // hide loading while response done
//   (response) => {
//     const store = defaultStore()
//     store.setLoading(false)
//     return response
//   },
//   (error) => {
//     console.log(error)
//     console.log(error.code)
//     console.log(error.request.code)
//     // hide loading while response done
//     const store = defaultStore()
//     store.setLoading(false)
//     store.setErrorMessage(errorMessage)
//     // console.error(error.toJSON())
//     if (error.response) {
//       // Check authtorize
//       if (error.response.status === 401) {
//         store.setErrorMessage(authErrorMessage)
//         Auth.logOut()
//         router.push('/login')
//       } else if (error.response.status === 403) store.setErrorMessage(error.response?.data?.Message)
//       else if (error.response.status === 500) {
//         store.setErrorMessage(error.response.data.Message)
//       } else if (error.response.status === 503) {
//         router.push('/503')
//       }
//     }
//     return Promise.reject(error)
//   }
// )

// // axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
// let baseUrl =
// import.meta.env.MODE ==='development' ? import.meta.env.VITE_BASE_URL_DEV : import.meta.env.VITE_BASE_URL_PRO
// axios.defaults.baseURL = baseUrl
// /* eslint-disable*/
// axios.defaults.headers.common['Authorization'] = Auth.getToken()
// axios.defaults.headers.common['FP-Id'] = Auth.getFP()
// axios.defaults.headers.common['Content-Type'] = 'application/json'
// axios.defaults.headers.common['Accept'] = 'application/json'
// axios.defaults.headers.common['Accept-Language'] = lang
// /* eslint-disable*/
// export default axios
