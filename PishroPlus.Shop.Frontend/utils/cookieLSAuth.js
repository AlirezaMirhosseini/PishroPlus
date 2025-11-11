import { useCookie } from '#app'

const TOKEN_NAME = 'auth_token'
// const COOKIE_OPTIONS = {
//   maxAge: 60 * 60 * 24 * 7, // 1 week
//   path: '/',
//   secure: process.env.NODE_ENV === 'production'
// }

export const setToken = (token) => {
  localStorage.setItem(TOKEN_NAME, token)
  const tokenCookie = useCookie(TOKEN_NAME)
  tokenCookie.value = token
}

export const removeToken = () => {
  localStorage.removeItem(TOKEN_NAME)
  const tokenCookie = useCookie(TOKEN_NAME)
  tokenCookie.value = null
}

export const getToken = () => {
  return localStorage.getItem(TOKEN_NAME) || useCookie(TOKEN_NAME).value
}