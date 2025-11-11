import Cookies from 'js-cookie'
import axios from 'axios'
import { defaultStore } from '../src/stores/default'
import { mapState, mapActions } from 'pinia'


const authKey = 'auth_token'
const fp = 'FP'

function logIn(token, expires) {
  localStorage.setItem('tabs','')
  setToken(token, expires)
  axios.defaults.headers.common['Authorization'] = token
}

function loggedIn() {
  const token = getToken()
  return token && token.length > 0 ? true : false
}

function logOut() {
  localStorage?.removeItem('com')
  const store = defaultStore()
  store.clearTabs()
  localStorage.removeItem("tabs")
  Cookies.remove(authKey)
  Cookies.remove(fp)
  localStorage?.removeItem(authKey)
  localStorage?.removeItem(fp)
  axios.defaults.headers.common['Authorization'] = ''
  axios.defaults.headers.common['FP-Id'] = ''
}

function getToken() {
  let token = ''
  token = Cookies.get(authKey)
  if (!token) token = localStorage.getItem(authKey)
  return token || ''
}

function setToken(token, expires) {
  Cookies.set(authKey, token, { expires: expires || 365 })
  if (localStorage) {
    localStorage.setItem(authKey, token)
  }
}

function getFP() {
  let fpId = ''
  fpId = JSON.parse(Cookies.get(fp) ?? '{}')
  if (fpId == {}) fpId = JSON.parse(localStorage.getItem(fp) ?? '{}')
  return fpId == {} ? '' : fpId.id
}

function setFP(token) {
  const store = defaultStore()
  store.setFP(token)
}

export default {
  logIn,
  logOut,
  loggedIn,
  getToken,
  getFP,
  setFP
}
